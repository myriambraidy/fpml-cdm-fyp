import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  DEFAULT_RUNTIME_FIXTURES,
  FX_SINGLE_LEG_RUNTIME_FIXTURES,
  type RuntimeFixture,
} from '../../src/java-generator-agent/java-contract'
import { validateGeneratedOutput } from '../../src/java-generator-agent/output-validation'
import type {
  GeneratorRole,
  GeneratorRunConfig,
  RoleModelConfig,
} from '../../src/java-generator-agent/types'

describe('java generator output validation', () => {
  test('fails missing runtime output files', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-output-'))
    try {
      const config = makeConfig(root)
      const result = await validateGeneratedOutput(config)

      expect(result.status).toBe('failed')
      expect(result.outputSnippet).toContain(`outputs/${DEFAULT_RUNTIME_FIXTURES[0].id}.json`)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('fails wrapped output', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-output-'))
    try {
      const config = makeConfig(root)
      await writeOutputSet(config, '{"status":"ok","cdm":{"trade":{}}}')

      const result = await validateGeneratedOutput(config)

      expect(result.status).toBe('failed')
      expect(result.outputSnippet).toContain('wrapped')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('passes minimally shaped output when fixture has no strict smoke assert', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-output-'))
    try {
      const fixture = FX_SINGLE_LEG_RUNTIME_FIXTURES[1]
      const config = makeConfig(root, [fixture])
      await writeOutputSet(
        config,
        JSON.stringify({
          trade: {
            tradeDate: '2001-10-23',
            counterparty: [{ role: 'Party1' }],
            product: {
              taxonomy: [{ source: 'ISDA', productQualifier: 'ForeignExchange_Spot_Forward' }],
              payout: {
                quantity: [{ unit: { currency: 'GBP' } }, { unit: { currency: 'USD' } }],
              },
            },
          },
        })
      )

      const result = await validateGeneratedOutput(config)

      expect(result.status).toBe('passed')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})

async function writeOutputSet(config: GeneratorRunConfig, cdmJson: string): Promise<void> {
  await mkdir(join(config.runOutputDir, 'outputs'), { recursive: true })
  for (const fixture of config.runtimeFixtures) {
    await mkdir(join(config.runOutputDir, 'reports', fixture.id), { recursive: true })
    await Bun.write(join(config.runOutputDir, 'outputs', `${fixture.id}.json`), cdmJson)
    for (const report of [
      'mapping-report.json',
      'validation-report.json',
      'traceability-report.json',
      'unsupported-scope.json',
    ]) {
      await Bun.write(join(config.runOutputDir, 'reports', fixture.id, report), '{}')
    }
  }
}

function makeConfig(root: string, runtimeFixtures: RuntimeFixture[] = DEFAULT_RUNTIME_FIXTURES): GeneratorRunConfig {
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
    fixturePaths: runtimeFixtures.map(f => f.fpmlPath),
    expectedCdmPaths: runtimeFixtures.map(f => f.expectedCdmPath),
    runtimeFixtures,
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
