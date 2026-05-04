import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { createWorkspace } from '../../src/java-generator-agent'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator workspace', () => {
  test('creates markdown workspace files for an FX derivatives run', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-workspace-'))
    try {
      const config = makeConfig(root)
      const workspace = await createWorkspace(config)

      const productScope = await Bun.file(workspace.productScopePath).text()
      const evidencePacket = await Bun.file(workspace.evidencePacketPath).text()
      const runLog = await Bun.file(workspace.runLogPath).text()

      expect(productScope).toContain('Selected product family: fx-derivatives')
      expect(productScope).toContain('data_to_learn_from')
      expect(productScope).toContain('Default current implementation group: fx-single-leg')
      expect(productScope).toContain('Do not add non-FX products')
      expect(evidencePacket).toContain('Evidence Packet')
      expect(runLog).toContain('Workspace created')
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
    evidenceRoots: [
      'data/agent-cookbook/latest',
      'data/rosetta-source/latest',
      'data_to_learn_from/fpml/fx-derivatives',
      'data_to_learn_from/cdm_parallel/fx-derivatives',
    ],
    fixturePaths: [
      'data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml',
      'data_to_learn_from/fpml/fx-derivatives/fx-ex03-fx-fwd.xml',
    ],
    expectedCdmPaths: [
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json',
      'data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex03-fx-fwd.json',
    ],
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
