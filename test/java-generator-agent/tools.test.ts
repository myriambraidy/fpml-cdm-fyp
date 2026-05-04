import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  assertInside,
  createToolExecutionState,
  executeGeneratorTool,
} from '../../src/java-generator-agent/tools'
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
