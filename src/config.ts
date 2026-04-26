import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_PATH: z.string().default('./data/app.db'),
  /** Single-user prototype; used for uploads / approvals until auth exists */
  ANALYST_EMAIL: z.string().default('analyst@localhost'),
  UPLOAD_MAX_BYTES: z.coerce.number().int().positive().default(10_000_000),
  /**
   * Below this confidence, orchestrator sets `needsReview: true` on proposals (`src/agent/orchestrator.ts`).
   */
  REVIEW_CONFIDENCE_THRESHOLD: z.coerce.number().int().min(0).max(100).default(60),
  /**
   * After mapping, proposals at or above this with no ambiguity are auto-approved (`src/storage/queries.ts`).
   */
  AUTO_APPROVE_THRESHOLD: z.coerce.number().int().min(0).max(100).default(80),
  OPENROUTER_API_KEY: z.string().optional(),
  /** OpenRouter model id; override if your account exposes different slugs. */
  OPENROUTER_MODEL: z.string().default('minimax/minimax-m2.7'),
  DRAFT_MODEL: z.string().default('openai/gpt-5-mini'),
  DRAFT_SYNTHESIS_MODEL: z.string().default('openai/gpt-5-mini'),
  DRAFT_PAIR_MAX_TOKENS: z.coerce.number().int().positive().max(128_000).default(3000),
  DRAFT_PAIR_MAX_RETRIES: z.coerce.number().int().min(0).max(3).default(1),
  DRAFT_PAIR_CONCURRENCY: z.coerce.number().int().min(1).max(64).default(4),
  DRAFT_SYNTHESIS_MAX_TOKENS: z.coerce.number().int().positive().max(128_000).default(5000),
  DRAFT_SYNTHESIS_MAX_RETRIES: z.coerce.number().int().min(0).max(2).default(1),
  DRAFT_STORE_FAILED_RAW_RESPONSES: z.preprocess((v: unknown) => {
    if (v === true || v === 1) return true
    if (v === false || v === 0) return false
    if (typeof v === 'string') return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase().trim())
    return true
  }, z.boolean().default(true)),
  CDM_ORCHESTRATOR_MODEL: z.string().optional(),
  /**
   * Completion token budget for CDM synthesis/repair only (full FPML + large `cdm` JSON).
   * Field mapping still uses `LLM_MAX_TOKENS`.
   */
  CDM_ORCHESTRATOR_MAX_TOKENS: z.coerce.number().int().positive().max(128_000).default(8192),
  LLM_MAX_TOKENS: z.coerce.number().int().positive().default(1024),
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(60_000),
  LLM_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(1),
  CDM_JSON_SCHEMA_DIR: z.string().default('./data/cdm-schema'),
  CDM_ORCHESTRATOR_ROOT_TYPE: z
    .enum(['Trade', 'TradeState', 'BusinessEvent'])
    .default('TradeState'),
  CDM_ORCHESTRATOR_PROMPT_VERSION: z.string().default('v1'),
  CDM_ORCHESTRATOR_STRICT_PROMPT: z.preprocess((v: unknown) => {
    if (v === false || v === 0) return false
    if (typeof v === 'string') {
      const s = v.toLowerCase().trim()
      if (['0', 'false', 'no', 'off'].includes(s)) return false
      if (['1', 'true', 'yes', 'on'].includes(s)) return true
      return true
    }
    if (v === true || v === 1) return true
    return true
  }, z.boolean().default(true)),
  CDM_ENFORCE_GROUNDED_IDENTIFIERS: z.preprocess((v: unknown) => {
    if (v === true || v === 1) return true
    if (v === false || v === 0) return false
    if (typeof v === 'string') return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase().trim())
    return false
  }, z.boolean().default(false)),
  CDM_ENABLE_REPAIR_LOOP: z.preprocess((v: unknown) => {
    if (v === false || v === 0) return false
    if (typeof v === 'string') {
      const s = v.toLowerCase().trim()
      if (['0', 'false', 'no', 'off'].includes(s)) return false
      if (['1', 'true', 'yes', 'on'].includes(s)) return true
      return true
    }
    if (v === true || v === 1) return true
    return true
  }, z.boolean().default(true)),
  CDM_MAX_STRUCTURAL_REPAIRS: z.coerce.number().int().min(0).max(10).default(2),
  CDM_MAX_SEMANTIC_REPAIRS: z.coerce.number().int().min(0).max(10).default(2),
  CDM_MAX_TOTAL_REPAIRS: z.coerce.number().int().min(0).max(20).default(4),
  CDM_SEMANTIC_VALIDATOR_CMD: z.string().optional(),
  CDM_ORCHESTRATOR_USE_LLM: z.preprocess((v: unknown) => {
    if (v === false || v === 0) return false
    if (typeof v === 'string') {
      const s = v.toLowerCase().trim()
      if (['0', 'false', 'no', 'off'].includes(s)) return false
      if (['1', 'true', 'yes', 'on'].includes(s)) return true
      return true
    }
    if (v === true || v === 1) return true
    return true
  }, z.boolean().default(true)),
  /**
   * When true (env `1` / `true` / `yes`) or when the client sends `X-Cdm-Debug: 1`,
   * orchestrator emits a `debug` trace in the API response and `[cdm-orchestrator]` console logs.
   */
  CDM_ORCHESTRATOR_DEBUG: z.preprocess((v: unknown) => {
    if (v === true || v === 1) return true
    if (v === false || v === 0) return false
    if (typeof v === 'string') return ['1', 'true', 'yes'].includes(v.toLowerCase().trim())
    return false
  }, z.boolean()),
})

export const env = EnvSchema.parse(process.env)

export const CDM_VERSION = '6.0.0' as const
