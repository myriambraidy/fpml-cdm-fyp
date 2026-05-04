import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import { promoteGeneratedJar } from '../../src/java-generator-agent/promotion'
import type {
  GateResult,
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator promotion', () => {
  test('does not promote if any gate failed', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-promotion-'))
    try {
      const config = makeConfig(root)
      const promoted = await promoteGeneratedJar(config, [
        gate('maven-test', 'passed'),
        gate('jar-runtime', 'failed'),
      ])

      expect(promoted).toBe(false)
      expect(await Bun.file(join(config.baseOutputDir, 'target/fpml-cdm-mapper.jar')).exists()).toBe(false)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('copies jar and writes promoted marker after all gates pass', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-promotion-'))
    try {
      const config = makeConfig(root)
      await mkdir(join(config.runOutputDir, 'target'), { recursive: true })
      await Bun.write(join(config.runOutputDir, 'target/fpml-cdm-mapper.jar'), 'jar')

      const promoted = await promoteGeneratedJar(config, [gate('maven-test', 'passed'), gate('jar-runtime', 'passed')])

      expect(promoted).toBe(true)
      expect(await Bun.file(join(config.baseOutputDir, 'target/fpml-cdm-mapper.jar')).text()).toBe('jar')
      expect(await Bun.file(join(config.baseOutputDir, 'target/latest-promoted-run.md')).text()).toContain('test-run')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

function gate(name: string, status: GateResult['status']): GateResult {
  return {
    name,
    command: name,
    status,
    exitCode: status === 'passed' ? 0 : 1,
    outputSnippet: status,
  }
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
