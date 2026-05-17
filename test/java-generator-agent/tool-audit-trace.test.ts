import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  createToolExecutionState,
  executeGeneratorTool,
} from '../../src/java-generator-agent/tools'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import type { GeneratorRole, GeneratorRunConfig, RoleModelConfig, ToolAuditEntry } from '../../src/java-generator-agent/types'

describe('tool audit trace shape', () => {
  test('records sequence timestamp role and failureKind on disallowed read', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-tool-audit-trace-'))
    try {
      const config = makeConfig(root)
      await mkdir(config.runOutputDir, { recursive: true })
      const outside = join(root, 'outside-read.txt')
      await writeFile(outside, 'x', 'utf8')
      const audit: ToolAuditEntry[] = []
      const context = {
        config,
        audit,
        state: createToolExecutionState(),
        stage: {
          role: 'implementer' as const,
          phase: 'research' as const,
          allowedWritePaths: [],
        },
      }

      const out = await executeGeneratorTool(context, 'read_file', { path: outside })

      expect(out).toContain('ERROR')
      const entry = audit[0]
      expect(entry?.sequence).toBe(1)
      expect(typeof entry?.timestamp).toBe('string')
      expect(entry?.role).toBe('implementer')
      expect(entry?.phase).toBe('research')
      expect(entry?.ok).toBe(false)
      expect(entry?.failureKind).toBe('path_rejected')
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
    planner: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    critic: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    'critique-reviewer': { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    implementer: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    repair: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    'build-reviewer': { model: 'm', maxTokens: 1, maxToolRounds: 1 },
  }
}
