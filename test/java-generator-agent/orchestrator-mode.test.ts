import { describe, expect, test } from 'bun:test'
import {
  DEFAULT_RUNTIME_FIXTURES,
  FX_SINGLE_LEG_RUNTIME_FIXTURES,
} from '../../src/java-generator-agent/java-contract'
import {
  isDeterministicFxForwardPocConfig,
  shouldRunGatesOnlySmokeFirst,
} from '../../src/java-generator-agent/orchestrator'
import type { GeneratorRole, GeneratorRunConfig, RoleModelConfig } from '../../src/java-generator-agent/types'

function minimalConfig(overrides: Partial<GeneratorRunConfig>): GeneratorRunConfig {
  const roleModels: Record<GeneratorRole, RoleModelConfig> = {
    planner: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    critic: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    'critique-reviewer': { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    implementer: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    repair: { model: 'm', maxTokens: 1, maxToolRounds: 1 },
    'build-reviewer': { model: 'm', maxTokens: 1, maxToolRounds: 1 },
  }
  return {
    runId: 't',
    productFamily: 'fx-derivatives',
    supportedProducts: [],
    baseOutputDir: '.',
    runOutputDir: './runs/t',
    maxPlanningRounds: 1,
    maxRepairAttempts: 0,
    requireApproval: false,
    resume: false,
    evidenceRoots: [],
    fixturePaths: [],
    expectedCdmPaths: [],
    runtimeFixtures: DEFAULT_RUNTIME_FIXTURES,
    roleModels,
    ...overrides,
  }
}

describe('orchestration mode gates-only smoke', () => {
  test('default POC shape does not skip LLM unless gatesOnlySmoke', () => {
    const c = minimalConfig({ runtimeFixtures: DEFAULT_RUNTIME_FIXTURES })
    expect(isDeterministicFxForwardPocConfig(c)).toBe(true)
    expect(shouldRunGatesOnlySmokeFirst(c)).toBe(false)
  })

  test('gatesOnlySmoke true enables pre-loop gate try', () => {
    const c = minimalConfig({ gatesOnlySmoke: true, runtimeFixtures: DEFAULT_RUNTIME_FIXTURES })
    expect(shouldRunGatesOnlySmokeFirst(c)).toBe(true)
  })

  test('requireApproval blocks gates-only short circuit', () => {
    const c = minimalConfig({ gatesOnlySmoke: true, requireApproval: true })
    expect(shouldRunGatesOnlySmokeFirst(c)).toBe(false)
  })

  test('multiple fixtures are not deterministic POC shape', () => {
    const c = minimalConfig({ runtimeFixtures: FX_SINGLE_LEG_RUNTIME_FIXTURES })
    expect(isDeterministicFxForwardPocConfig(c)).toBe(false)
    expect(shouldRunGatesOnlySmokeFirst({ ...c, gatesOnlySmoke: true })).toBe(false)
  })
})
