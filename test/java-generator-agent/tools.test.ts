import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  assertInside,
  createToolExecutionState,
  executeGeneratorTool,
  IMPLEMENTER_WRITE_TOOLS,
} from '../../src/java-generator-agent/tools'
import { createWorkspace } from '../../src/java-generator-agent/workspace'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
  ToolAuditEntry,
} from '../../src/java-generator-agent/types'

describe('java generator tools', () => {
  test('rejects writes outside the run output directory', () => {
    const root = resolve('generated/java-mapper-poc/runs/test')
    expect(() => assertInside(root, resolve('README.md'))).toThrow()
  })

  test('writes generated files inside the run output directory', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      const audit: ToolAuditEntry[] = []
      const result = await executeGeneratorTool(
        {
          config,
          audit,
          state: createToolExecutionState(),
          stage: {
            role: 'implementer',
            allowedWritePaths: ['pom.xml'],
          },
        },
        'write_file',
        { path: 'pom.xml', content: '<project />' }
      )

      expect(result).toContain('Wrote')
      expect(await Bun.file(join(config.runOutputDir, 'pom.xml')).text()).toBe('<project />')
      expect(audit[0]?.tool).toBe('write_file')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('writes generated Java files by path and rejects shell-owned Java paths', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      const audit: ToolAuditEntry[] = []
      const context = {
        config,
        audit,
        state: createToolExecutionState(),
        stage: {
          role: 'implementer' as const,
          allowedWritePaths: ['src/main/java/com/fpml/cdm/fx/mapper/generated/**'],
        },
      }
      const content = [
        'package com.fpml.cdm.fx.mapper.generated.helpers;',
        '',
        'public final class HelperMapper {',
        '}',
        '',
      ].join('\n')

      const written = await executeGeneratorTool(context, 'write_generated_java_file', {
        path: 'src/main/java/com/fpml/cdm/fx/mapper/generated/helpers/HelperMapper.java',
        content,
      })
      const blocked = await executeGeneratorTool(context, 'write_generated_java_file', {
        path: 'src/main/java/com/fpml/cdm/fx/mapper/Main.java',
        content: 'package com.fpml.cdm.fx.mapper; public final class Main {}',
      })

      expect(written).toContain('Wrote')
      expect(blocked).toContain('ERROR')
      expect(blocked).toContain('write_generated_java_file can only write under')
      expect(audit[0]?.tool).toBe('write_generated_java_file')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('implementer write tool surface exposes only write tools', () => {
    const names = IMPLEMENTER_WRITE_TOOLS.map(tool => tool.name)
    expect(names).toEqual(['write_generated_java_file', 'write_file'])
    expect(names).not.toContain('read_file')
    expect(names).not.toContain('write_generated_java')
  })

  test('fixture and expected summary tools accept runtime fixture ids', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      const context = {
        config,
        audit: [],
        state: createToolExecutionState(),
        stage: {
          role: 'implementer' as const,
          allowedWritePaths: [],
        },
      }

      const fixture = await executeGeneratorTool(context, 'get_fixture_summary', {
        path: 'fx-ex01-fx-spot',
      })
      const expected = await executeGeneratorTool(context, 'get_expected_cdm_summary', {
        path: 'fx-ex01-fx-spot',
      })

      expect(fixture).toContain('FpML')
      expect(expected).toContain('SettlementPayout')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('blocks duplicate run-root write paths', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      const audit: ToolAuditEntry[] = []
      const result = await executeGeneratorTool(
        {
          config,
          audit,
          state: createToolExecutionState(),
          stage: {
            role: 'implementer',
            allowedWritePaths: ['pom.xml'],
          },
        },
        'write_file',
        {
          path: join(config.runOutputDir, 'pom.xml'),
          content: '<project />',
        }
      )

      expect(result).toContain('ERROR')
      expect(result).toContain('current run id')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('returns cached failures for repeated bad tool calls', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      const audit: ToolAuditEntry[] = []
      const state = createToolExecutionState()
      const context = {
        config,
        audit,
        state,
        stage: {
          role: 'planner' as const,
          round: 1,
          allowedWritePaths: ['agent-workspace/round-01/planner-plan.md'],
        },
      }

      const first = await executeGeneratorTool(context, 'read_file', { path: 'missing-file.md' })
      const second = await executeGeneratorTool(context, 'read_file', { path: 'missing-file.md' })

      expect(first).toContain('ERROR')
      expect(second).toContain('CACHE_HIT_BLOCKED_FAILURE')
      expect(audit[1]?.cacheStatus).toBe('hit')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('search alone does not unlock exact CDM class lookup', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      const context = {
        config,
        audit: [],
        state: createToolExecutionState(),
        stage: {
          role: 'planner' as const,
          round: 1,
          allowedWritePaths: ['agent-workspace/round-01/planner-plan.md'],
        },
      }
      const search = await executeGeneratorTool(
        context,
        'search_cdm_java_classes',
        { pattern: 'SettlementPayout' }
      )
      const lookup = await executeGeneratorTool(
        context,
        'get_cdm_java_class',
        { className: 'cdm.product.template.SettlementPayout' }
      )

      expect(search).toContain('cdm.product.template.SettlementPayout')
      expect(lookup).toContain('Exact lookup blocked')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('concept resolution unlocks exact CDM class lookup', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      await createWorkspace(config)
      const context = {
        config,
        audit: [],
        state: createToolExecutionState(),
        stage: {
          role: 'planner' as const,
          round: 1,
          allowedWritePaths: ['agent-workspace/round-01/planner-plan.md'],
        },
      }
      const resolution = await executeGeneratorTool(
        context,
        'resolve_cdm_concept',
        { concept: 'Settlement payout' }
      )
      const lookup = await executeGeneratorTool(
        context,
        'get_cdm_java_class',
        { className: 'cdm.product.template.SettlementPayout' }
      )

      expect(resolution).toContain('Selected: cdm.product.template.SettlementPayout')
      expect(lookup).toContain('Lookup status: found')
      expect(lookup).toContain('cdm.product.template.SettlementPayout')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('returns approved contract and semantic recipe without raw API dumps', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      await createWorkspace(config)
      const context = {
        config,
        audit: [],
        state: createToolExecutionState(),
        stage: {
          role: 'planner' as const,
          round: 1,
          allowedWritePaths: ['agent-workspace/round-01/planner-plan.md'],
        },
      }

      const contract = await executeGeneratorTool(context, 'get_approved_cdm_api_contract', {})
      const recipe = await executeGeneratorTool(context, 'get_cdm_semantic_recipe', {
        recipeId: 'fx-single-leg-tradestate',
      })

      expect(contract).toContain('Approved CDM API Contract Summary')
      expect(contract).toContain('cdm.event.common.TradeState')
      expect(recipe).toContain('Build FX single-leg TradeState')
      expect(recipe).toContain('Semantic authority')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('returns exact Rosetta retrieval tool evidence', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-tools-'))
    try {
      const config = makeConfig(root)
      const context = {
        config,
        audit: [],
        state: createToolExecutionState(),
        stage: {
          role: 'planner' as const,
          round: 1,
          allowedWritePaths: ['agent-workspace/round-01/planner-plan.md'],
        },
      }

      const result = await executeGeneratorTool(context, 'get_rosetta_mapping_area', {
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
        area: 'settlement-payout',
      })

      expect(result).toContain('MapFxCoreDetailsModelToSettlementPayout')
      expect(result).toContain('Rosetta source is mapping-intent authority')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

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
    evidenceRoots: ['data_to_learn_from/fpml/fx-derivatives'],
    fixturePaths: ['data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml'],
    expectedCdmPaths: ['data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json'],
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
