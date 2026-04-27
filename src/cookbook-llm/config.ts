import { resolve } from 'node:path'
import type { CookbookLlmConfig, CookbookLlmLogLevel, CookbookLlmWriteMode } from './types'

export function readCookbookLlmConfigFromEnv(workspaceRoot: string): CookbookLlmConfig {
  const authorModel = process.env.COOKBOOK_LLM_AUTHOR_MODEL ?? 'openai/gpt-5'
  return {
    workspaceRoot,
    deterministicRoot: resolve(
      workspaceRoot,
      process.env.COOKBOOK_LLM_DETERMINISTIC_ROOT ?? 'data/agent-cookbook/latest'
    ),
    draftsRoot: resolve(workspaceRoot, process.env.COOKBOOK_LLM_DRAFTS_ROOT ?? 'data/drafts'),
    outputRoot: resolve(workspaceRoot, process.env.COOKBOOK_LLM_OUTPUT_ROOT ?? 'data/agent-cookbook-llm'),
    mode: readMode(process.env.COOKBOOK_LLM_MODE),
    maxRepairLoops: readInt(process.env.COOKBOOK_LLM_MAX_REPAIR_LOOPS, 3),
    includeReviewOnly: readBool(process.env.COOKBOOK_LLM_INCLUDE_REVIEW_ONLY, false),
    storeRawResponses: readBool(process.env.COOKBOOK_LLM_STORE_RAW_RESPONSES, true),
    failFast: readBool(process.env.COOKBOOK_LLM_FAIL_FAST, false),
    logLevel: readLogLevel(process.env.COOKBOOK_LLM_LOG_LEVEL),
    onlyPacketId: process.env.COOKBOOK_LLM_ONLY_PACKET,
    models: {
      author: authorModel,
      critic: process.env.COOKBOOK_LLM_CRITIC_MODEL ?? 'anthropic/claude-sonnet-4.6',
      auditor: process.env.COOKBOOK_LLM_AUDITOR_MODEL ?? 'openai/gpt-5',
      repair: process.env.COOKBOOK_LLM_REPAIR_MODEL ?? authorModel,
      judge: process.env.COOKBOOK_LLM_JUDGE_MODEL ?? 'openai/gpt-5-mini',
    },
    temperatures: {
      author: readNumber(process.env.COOKBOOK_LLM_AUTHOR_TEMPERATURE, 0.2),
      critic: readNumber(process.env.COOKBOOK_LLM_CRITIC_TEMPERATURE, 0),
      auditor: readNumber(process.env.COOKBOOK_LLM_AUDITOR_TEMPERATURE, 0),
      repair: readNumber(process.env.COOKBOOK_LLM_REPAIR_TEMPERATURE, 0.1),
      judge: readNumber(process.env.COOKBOOK_LLM_JUDGE_TEMPERATURE, 0),
    },
  }
}

function readLogLevel(value: string | undefined): CookbookLlmLogLevel {
  if (value === 'silent' || value === 'debug') return value
  return 'info'
}

function readMode(value: string | undefined): CookbookLlmWriteMode {
  return value === 'append' ? 'append' : 'overwrite'
}

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback
  const normalized = value.trim().toLowerCase()
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false
  return fallback
}

function readInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
