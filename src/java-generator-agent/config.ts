import { basename, dirname, join } from 'node:path'
import { env } from '../config'
import { DEFAULT_RUNTIME_FIXTURES } from './java-contract'
import { ensureCdmRosettaPreflightReport } from './cdm-rosetta-preflight'
import type { GeneratorRole, GeneratorRunConfig, RoleModelConfig } from './types'

export type JavaGeneratorCliOptions = {
  productFamily?: string
  baseOutputDir?: string
  requireApproval?: boolean
  resumeRunOutputDir?: string
}

export async function createRunConfig(options: JavaGeneratorCliOptions): Promise<GeneratorRunConfig> {
  const runId = options.resumeRunOutputDir
    ? basename(options.resumeRunOutputDir)
    : new Date().toISOString().replace(/[:.]/g, '-')
  const baseOutputDir = options.resumeRunOutputDir
    ? dirname(dirname(options.resumeRunOutputDir))
    : options.baseOutputDir ?? 'generated/java-mapper-poc'
  const productFamily = options.productFamily ?? 'fx-derivatives'
  const cdmRosettaPreflight = await ensureCdmRosettaPreflightReport()

  return {
    runId,
    productFamily,
    supportedProducts: [],
    baseOutputDir,
    runOutputDir: options.resumeRunOutputDir ?? join(baseOutputDir, 'runs', runId),
    maxPlanningRounds: 4,
    maxRepairAttempts: env.JAVA_GENERATOR_MAX_REPAIR_ATTEMPTS,
    requireApproval: options.requireApproval ?? false,
    resume: options.resumeRunOutputDir !== undefined,
    evidenceRoots: [
      'data/agent-cookbook/latest',
      'data/rosetta-source/latest',
      'data_to_learn_from/fpml/fx-derivatives',
      'data_to_learn_from/cdm_parallel/fx-derivatives',
    ],
    fixturePaths: DEFAULT_RUNTIME_FIXTURES.map(fixture => fixture.fpmlPath),
    expectedCdmPaths: DEFAULT_RUNTIME_FIXTURES.map(fixture => fixture.expectedCdmPath),
    runtimeFixtures: DEFAULT_RUNTIME_FIXTURES,
    cdmRosettaPreflight,
    roleModels: createRoleModels(),
    llmBudget: {
      maxTotalCalls: env.JAVA_GENERATOR_MAX_LLM_CALLS,
      maxInputTokensPerCall: env.JAVA_GENERATOR_MAX_INPUT_TOKENS_PER_CALL,
      maxRepairAttempts: env.JAVA_GENERATOR_MAX_REPAIR_ATTEMPTS,
    },
  }
}

function createRoleModels(): Record<GeneratorRole, RoleModelConfig> {
  return {
    planner: {
      model: env.JAVA_GENERATOR_PLANNER_MODEL,
      fallbackModel: env.JAVA_GENERATOR_PLANNER_FALLBACK_MODEL,
      maxTokens: env.JAVA_GENERATOR_PLANNER_MAX_TOKENS,
      maxToolRounds: env.JAVA_GENERATOR_PLANNER_MAX_TOOL_ROUNDS,
    },
    critic: {
      model: env.JAVA_GENERATOR_CRITIC_MODEL,
      fallbackModel: env.JAVA_GENERATOR_CRITIC_FALLBACK_MODEL,
      maxTokens: env.JAVA_GENERATOR_CRITIC_MAX_TOKENS,
      maxToolRounds: 3,
    },
    'critique-reviewer': {
      model: env.JAVA_GENERATOR_REVIEWER_MODEL,
      fallbackModel: env.JAVA_GENERATOR_REVIEWER_FALLBACK_MODEL,
      maxTokens: env.JAVA_GENERATOR_REVIEWER_MAX_TOKENS,
      maxToolRounds: 2,
    },
    implementer: {
      model: env.JAVA_GENERATOR_IMPLEMENTER_MODEL,
      fallbackModel: env.JAVA_GENERATOR_IMPLEMENTER_FALLBACK_MODEL,
      maxTokens: env.JAVA_GENERATOR_IMPLEMENTER_MAX_TOKENS,
      maxToolRounds: 12,
    },
    repair: {
      model: env.JAVA_GENERATOR_REPAIR_MODEL,
      fallbackModel: env.JAVA_GENERATOR_REPAIR_FALLBACK_MODEL,
      maxTokens: env.JAVA_GENERATOR_REPAIR_MAX_TOKENS,
      maxToolRounds: 6,
    },
    'build-reviewer': {
      model: env.JAVA_GENERATOR_BUILD_REVIEWER_MODEL,
      fallbackModel: env.JAVA_GENERATOR_BUILD_REVIEWER_FALLBACK_MODEL,
      maxTokens: env.JAVA_GENERATOR_BUILD_REVIEWER_MAX_TOKENS,
      maxToolRounds: 2,
    },
  }
}
