import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { validateImplementationArtifacts } from '../../src/java-generator-agent/implementation-artifacts'
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
      expect(await readFile(report.contract.entryClassPath, 'utf8')).toContain('public final class GeneratedFpmlToCdmMapper')
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
})

function renderEntryClass(): string {
  return `package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Path;

public final class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    @Override
    public String mapFile(Path inputPath, Path reportsDir) {
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
