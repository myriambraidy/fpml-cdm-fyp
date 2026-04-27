import type { LLMClient } from '../agent/types'
import { callLlmJson } from './llm-json'
import type { CookbookLlmLogger } from './logger'
import { normalizeAuthoredPage } from './page-normalization'
import { buildAuthorMessages } from './prompts'
import { AuthoredCookbookPageSchema } from './schemas'
import type { AuthoredCookbookPage, CookbookEvidencePacket } from './types'
import type { LlmCallTrace } from './types'

export async function authorCookbookPage(args: {
  llm: LLMClient
  model: string
  packet: CookbookEvidencePacket
  maxTokens: number
  trace: LlmCallTrace[]
  storeRawResponse: boolean
  logger?: CookbookLlmLogger
}): Promise<AuthoredCookbookPage> {
  const result = await callLlmJson({
    llm: args.llm,
    model: args.model,
    messages: buildAuthorMessages(args.packet),
    schema: AuthoredCookbookPageSchema,
    maxTokens: args.maxTokens,
    role: 'author',
    trace: args.trace,
    storeRawResponse: args.storeRawResponse,
    logger: args.logger,
  })
  return normalizeAuthoredPage(result.parsed, args.packet)
}
