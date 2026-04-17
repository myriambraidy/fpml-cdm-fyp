import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_PATH: z.string().default('./data/app.db'),
  OPENROUTER_API_KEY: z.string().optional(),
})

export const env = EnvSchema.parse(process.env)

export const CDM_VERSION = '6.0.0' as const
