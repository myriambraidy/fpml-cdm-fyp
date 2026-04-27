import type { LLMClient } from '../agent/types'
import { callLlmJson } from './llm-json'
import type { CookbookLlmLogger } from './logger'
import { buildCriticMessages } from './prompts'
import { CriticReportSchema } from './schemas'
import type {
  AuthoredCookbookPage,
  CookbookEvidencePacket,
  CriticReport,
  LlmCallTrace,
} from './types'

export async function critiqueCookbookPage(args: {
  llm: LLMClient
  model: string
  packet: CookbookEvidencePacket
  page: AuthoredCookbookPage
  maxTokens: number
  trace: LlmCallTrace[]
  storeRawResponse: boolean
  logger?: CookbookLlmLogger
}): Promise<CriticReport> {
  const result = await callLlmJson({
    llm: args.llm,
    model: args.model,
    messages: buildCriticMessages({
      packet: args.packet,
      page: args.page,
    }),
    schema: CriticReportSchema,
    maxTokens: args.maxTokens,
    role: 'critic',
    trace: args.trace,
    storeRawResponse: args.storeRawResponse,
    logger: args.logger,
  })
  return result.parsed
}
