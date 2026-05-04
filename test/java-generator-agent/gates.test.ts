import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  runGates,
  runJarRuntimeGate,
  validateGeneratedProjectStructure,
} from '../../src/java-generator-agent/gates'
import { DEFAULT_RUNTIME_FIXTURES } from '../../src/java-generator-agent/java-contract'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator gates', () => {
  test('validates generated project structure', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-gates-'))
    try {
      const config = makeConfig(root)
      await mkdir(join(config.runOutputDir, 'src/main/java'), { recursive: true })
      await mkdir(join(config.runOutputDir, 'src/test/java'), { recursive: true })
      await Bun.write(join(config.runOutputDir, 'pom.xml'), '<project />')

      const result = await validateGeneratedProjectStructure(config)

      expect(result.status).toBe('passed')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test(
    'after early gate failure skipped jar-runtime names match runtimeFixtures',
    async () => {
      const root = await mkdtemp(join(tmpdir(), 'java-generator-gates-'))
      try {
        const config = makeConfig(root)
        await mkdir(join(config.runOutputDir, 'src/main/java'), { recursive: true })
        await mkdir(join(config.runOutputDir, 'src/test/java'), { recursive: true })

        const results = await runGates(config)

        const skippedJar = results.filter(r => r.name.startsWith('jar-runtime:') && r.status === 'skipped')
        const skippedRosetta = results.filter(r => r.name.startsWith('rosetta-validation:') && r.status === 'skipped')
        expect(skippedJar.length).toBe(DEFAULT_RUNTIME_FIXTURES.length)
        expect(skippedRosetta.length).toBe(DEFAULT_RUNTIME_FIXTURES.length)
        for (let i = 0; i < DEFAULT_RUNTIME_FIXTURES.length; i += 1) {
          const fixture = DEFAULT_RUNTIME_FIXTURES[i]
          expect(skippedJar[i]?.name).toBe(`jar-runtime:${fixture.id}`)
          expect(skippedRosetta[i]?.name).toBe(`rosetta-validation:${fixture.id}`)
        }
      } finally {
        await rm(root, { recursive: true, force: true })
      }
    },
    120_000
  )

  test('missing jar fails runtime gate', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-gates-'))
    try {
      const config = makeConfig(root)
      await mkdir(config.runOutputDir, { recursive: true })

      const result = await runJarRuntimeGate(config)

      expect(result.status).toBe('failed')
      expect(result.name).toBe(`jar-runtime:${DEFAULT_RUNTIME_FIXTURES[0].id}`)
      expect(result.command).toContain('target/fpml-cdm-rosetta-mapper.jar')
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
