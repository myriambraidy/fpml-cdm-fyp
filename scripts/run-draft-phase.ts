import { resolve } from 'node:path'
import { createOpenRouterClientFromEnv } from '../src/agent/client'
import type { LLMClient } from '../src/agent/types'
import { env } from '../src/config'
import { runDraftPhase } from '../src/draft'

const WORKSPACE_ROOT = process.cwd()
const FPML_ROOT = 'data_to_learn_from/fpml'
const CDM_ROOT = 'data_to_learn_from/cdm_parallel'
const SELECTED_FOLDER = 'variance-swaps'
const OUTPUT_DIR = 'data/drafts'
const MAX_PAIRS: number | undefined = undefined
const USE_LIVE_LLM = true

let llm: LLMClient | undefined
if (USE_LIVE_LLM) {
  llm = createOpenRouterClientFromEnv()
}

const result = await runDraftPhase({
  config: {
    workspaceRoot: WORKSPACE_ROOT,
    fpmlRoot: resolve(WORKSPACE_ROOT, FPML_ROOT),
    cdmRoot: resolve(WORKSPACE_ROOT, CDM_ROOT),
    outputRoot: resolve(WORKSPACE_ROOT, OUTPUT_DIR),
    folder: SELECTED_FOLDER,
    maxPairs: MAX_PAIRS,
    pairConcurrency: env.DRAFT_PAIR_CONCURRENCY,
    pairMaxRetries: env.DRAFT_PAIR_MAX_RETRIES,
    synthesisMaxRetries: env.DRAFT_SYNTHESIS_MAX_RETRIES,
    model: env.DRAFT_MODEL,
    synthesisModel: env.DRAFT_SYNTHESIS_MODEL,
    pairMaxTokens: env.DRAFT_PAIR_MAX_TOKENS,
    synthesisMaxTokens: env.DRAFT_SYNTHESIS_MAX_TOKENS,
    storeFailedRawResponses: env.DRAFT_STORE_FAILED_RAW_RESPONSES,
  },
  llm,
})

console.log(
  JSON.stringify(
    {
      folder: SELECTED_FOLDER,
      status: result.status,
      outputDirectory: result.outputDirectory,
      markdownPath: result.markdownPath,
      jsonPath: result.jsonPath,
      debugPath: result.debugPath,
      logPath: result.logPath,
      matchedPairsUsed: result.selection.coverage.matchedPairsUsed,
      missingCounterparts: result.selection.coverage.missingCounterparts,
      ignoredPairs: result.selection.coverage.ignoredPairs,
      pairConcurrency: env.DRAFT_PAIR_CONCURRENCY,
      pairMaxRetries: env.DRAFT_PAIR_MAX_RETRIES,
      synthesisMaxRetries: env.DRAFT_SYNTHESIS_MAX_RETRIES,
      llmMode: USE_LIVE_LLM ? 'openrouter' : 'off',
      model: env.DRAFT_MODEL,
      synthesisModel: env.DRAFT_SYNTHESIS_MODEL,
    },
    null,
    2
  )
)
