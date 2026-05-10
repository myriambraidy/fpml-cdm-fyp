import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { repairRequiresWrite, validateImplementationArtifacts } from '../../src/java-generator-agent/implementation-artifacts'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
  ToolAuditEntry,
} from '../../src/java-generator-agent/types'

describe('implementation artifact validation', () => {
  test('blocks pseudo tool calls and inserts fail-closed fallback entry class', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: '[tool_call({tool => "write_generated_java", args => {}})]',
        auditEntries: [],
      })

      expect(report.status).toBe('failed')
      expect(report.findings.join('\n')).toContain('pseudo tool call')
      expect(report.classifications).toContain('pseudo_tool_call_output')
      expect(report.findings.join('\n')).toContain('minimal GeneratedFpmlToCdmMapper fallback')
      const fallback = await readFile(report.contract.entryClassPath, 'utf8')
      expect(fallback).toContain('public final class GeneratedFpmlToCdmMapper')
      expect(fallback).toContain('TradeState.builder()')
      expect(fallback).toContain('writeValueAsString(tradeState)')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('classifies latest run uppercase pseudo read pattern and zero writes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: [
          '[TOOL_CALL]',
          '{tool => "read_file", args => {',
          '  --path "fixtures/fx-ex04-fx-fwd-w-settlement.xml"',
          '}}',
          '[/TOOL_CALL]',
        ].join('\n'),
        auditEntries: [],
        policyFailures: ['write_phase_no_write_tool_calls'],
      })

      expect(report.status).toBe('failed')
      expect(report.classifications).toContain('pseudo_tool_call_output')
      expect(report.classifications).toContain('no_write_tool_calls')
      expect(report.classifications).toContain('write_phase_no_write_tool_calls')
      expect(report.pseudoToolCalls[0]?.toolName).toBe('read_file')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('classifies previous run fake path write as pseudo write output', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: '[tool_call({tool => "write_generated_java", args => { --path "src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java" --content "..." }})]',
        auditEntries: [],
      })

      expect(report.status).toBe('failed')
      expect(report.classifications).toContain('pseudo_tool_call_output')
      expect(report.pseudoToolCalls[0]?.toolName).toBe('write_generated_java')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('passes when implementer wrote the generated entry class through a write tool', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const entryPath = join(
        config.runOutputDir,
        'src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java'
      )
      await mkdir(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated'), { recursive: true })
      await Bun.write(entryPath, renderEntryClass())
      const auditEntries: ToolAuditEntry[] = [
        {
          tool: 'write_generated_java_file',
          inputSummary: 'path=src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java',
          outputSummary: `Wrote ${entryPath}`,
          sourcePaths: [entryPath],
          ok: true,
        },
      ]

      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: 'Implemented.',
        auditEntries,
      })

      expect(report.status).toBe('passed')
      expect(report.findings).toEqual([])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('fails when generated mapper changes mapFile signature', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const sourceDir = join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      const entryPath = join(sourceDir, 'GeneratedFpmlToCdmMapper.java')
      await Bun.write(
        entryPath,
        `package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import cdm.event.common.TradeState;

public final class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    @Override
    public TradeState mapFile(String fpmlXml) {
        return null;
    }
}
`
      )

      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: 'Implemented.',
        auditEntries: [
          {
            tool: 'write_generated_java_file',
            inputSummary: 'path=src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java',
            outputSummary: `Wrote ${entryPath}`,
            sourcePaths: [entryPath],
            ok: true,
          },
        ],
      })

      expect(report.status).toBe('failed')
      expect(report.findings.some(finding => finding.includes('mapFile must return String'))).toBe(true)
      expect(report.findings.some(finding => finding.includes('Path inputPath, Path reportsDir'))).toBe(true)
      expect(report.findings.some(finding => finding.includes('throws clause must include Exception'))).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('passes entrypoint signature when mapper preserves shell method', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const sourceDir = join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      const entryPath = join(sourceDir, 'GeneratedFpmlToCdmMapper.java')
      await Bun.write(entryPath, renderEntryClass())

      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: 'Implemented.',
        auditEntries: [
          {
            tool: 'write_generated_java_file',
            inputSummary: 'path=src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java',
            outputSummary: `Wrote ${entryPath}`,
            sourcePaths: [entryPath],
            ok: true,
          },
        ],
      })

      expect(report.status).toBe('passed')
      expect(report.findings.some(finding => finding.includes('mapFile must'))).toBe(false)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('requires repair writes after source gate failure', () => {
    const requirement = repairRequiresWrite([
      {
        name: 'maven-compile',
        command: 'mvn compile',
        status: 'failed',
        exitCode: 1,
        outputSnippet: 'src/main/java/com/example/Generated.java:[12,3] cannot find symbol',
      },
    ])

    expect(requirement.required).toBe(true)
    expect(requirement.reason).toBe('failed_gate_references_java_source')
  })

  test('fails repair report when required Java write is missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      await mkdir(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated'), { recursive: true })
      await Bun.write(
        join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java'),
        renderEntryClass()
      )

      const report = await validateImplementationArtifacts({
        config,
        role: 'repair',
        roleOutput: 'Fixed the Java files.',
        auditEntries: [],
        repairWriteRequirement: { required: true, reason: 'source_repair_gate:maven-compile' },
      })

      expect(report.status).toBe('failed')
      expect(report.classifications).toContain('repair_write_required_but_missing')
      expect(report.classifications).toContain('repair_no_write_tool_calls')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('fails repair report that asks user for readable generated files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      await mkdir(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated'), { recursive: true })
      await Bun.write(
        join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java'),
        renderEntryClass()
      )

      const report = await validateImplementationArtifacts({
        config,
        role: 'repair',
        roleOutput: 'Please provide src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java.',
        auditEntries: [],
        repairWriteRequirement: { required: true, reason: 'source_repair_gate:maven-compile' },
      })

      expect(report.status).toBe('failed')
      expect(report.classifications).toContain('repair_asked_for_readable_generated_files')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('fails implementer report that claims unwritten generated files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const sourceDir = join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      const entryPath = join(sourceDir, 'GeneratedFpmlToCdmMapper.java')
      await Bun.write(entryPath, renderEntryClass())

      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: 'Implemented `GeneratedFpmlToCdmMapper.java` and `ProductMapper.java`.',
        auditEntries: [
          {
            tool: 'write_generated_java_file',
            inputSummary: 'path=src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java',
            outputSummary: `Wrote ${entryPath}`,
            sourcePaths: [entryPath],
            ok: true,
          },
        ],
      })

      expect(report.status).toBe('failed')
      expect(report.classifications).toContain('claimed_generated_file_not_written')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('detects plain-text generated file claims without backticks', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const sourceDir = join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      const entryPath = join(sourceDir, 'GeneratedFpmlToCdmMapper.java')
      await Bun.write(entryPath, renderEntryClass())

      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: 'Implemented GeneratedFpmlToCdmMapper.java and ProductMapper.java.',
        auditEntries: [
          {
            tool: 'write_generated_java_file',
            inputSummary: 'path=src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java',
            outputSummary: `Wrote ${entryPath}`,
            sourcePaths: [entryPath],
            ok: true,
          },
        ],
      })

      expect(report.status).toBe('failed')
      expect(report.classifications).toContain('claimed_generated_file_not_written')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('does not treat planned manifest entries as completed generated file claims', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const sourceDir = join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      const entryPath = join(sourceDir, 'GeneratedFpmlToCdmMapper.java')
      await Bun.write(entryPath, renderEntryClass())

      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: 'Planned manifest: `GeneratedFpmlToCdmMapper.java`, `ProductMapper.java`.',
        auditEntries: [
          {
            tool: 'write_generated_java_file',
            inputSummary: 'path=src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java',
            outputSummary: `Wrote ${entryPath}`,
            sourcePaths: [entryPath],
            ok: true,
          },
        ],
      })

      expect(report.classifications).not.toContain('claimed_generated_file_not_written')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('flags generated source that uses a tool-rejected class', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-artifacts-'))
    try {
      const config = makeConfig(root)
      const sourceDir = join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      const entryPath = join(sourceDir, 'GeneratedFpmlToCdmMapper.java')
      await Bun.write(
        entryPath,
        renderEntryClass().replace('return "{}";', 'cdm.product.common.settlement.SettlementDate.builder(); return "{}";')
      )
      const toolState = {
        cache: new Map(),
        failedRepeats: new Map(),
        searchedCdmClasses: new Set<string>(),
        lookupEligibleCdmClasses: new Set<string>(),
        approvedCdmClasses: new Set<string>(),
        rejectedCdmClasses: new Map([['cdm.product.common.settlement.SettlementDate', 'Class was rejected.']]),
        rejectedBuilderClasses: new Map<string, string>(),
        strictCdmLookup: true,
      }
      const report = await validateImplementationArtifacts({
        config,
        role: 'implementer',
        roleOutput: 'Implemented.',
        auditEntries: [
          {
            tool: 'write_generated_java_file',
            inputSummary: 'path=GeneratedFpmlToCdmMapper.java',
            outputSummary: `Wrote ${entryPath}`,
            sourcePaths: [entryPath],
            ok: true,
          },
        ],
        toolState,
      })

      expect(report.status).toBe('failed')
      expect(report.classifications).toContain('tool_rejected_class_used_in_source')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

function renderEntryClass(): string {
  return `package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Path;

public final class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        return "{}";
    }
}
`
}

function makeConfig(root: string): GeneratorRunConfig {
  return {
    runId: 'test-run',
    productFamily: 'fx-derivatives',
    supportedProducts: [],
    baseOutputDir: root,
    runOutputDir: join(root, 'runs', 'test-run'),
    maxPlanningRounds: 3,
    maxRepairAttempts: 3,
    requireApproval: false,
    resume: false,
    evidenceRoots: [],
    fixturePaths: [],
    expectedCdmPaths: [],
    runtimeFixtures: DEFAULT_RUNTIME_FIXTURES,
    roleModels: makeRoleModels(),
  }
}

function makeRoleModels(): Record<GeneratorRole, RoleModelConfig> {
  return {
    planner: { model: 'qwen/qwen3-coder-30b-a3b-instruct', maxTokens: 9000, maxToolRounds: 3 },
    critic: { model: 'qwen/qwen3-coder-next', maxTokens: 5000, maxToolRounds: 3 },
    'critique-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 5000, maxToolRounds: 2 },
    implementer: { model: 'minimax/minimax-m2.7', maxTokens: 16_000, maxToolRounds: 6 },
    repair: { model: 'minimax/minimax-m2.7', maxTokens: 12_000, maxToolRounds: 6 },
    'build-reviewer': { model: 'qwen/qwen3-coder-next', maxTokens: 4000, maxToolRounds: 2 },
  }
}
