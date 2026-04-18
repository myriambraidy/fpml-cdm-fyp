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
  LLM_MAX_TOKENS: z.coerce.number().int().positive().default(1024),
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(60_000),
  LLM_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(1),
})

export const env = EnvSchema.parse(process.env)

export const CDM_VERSION = '6.0.0' as const
