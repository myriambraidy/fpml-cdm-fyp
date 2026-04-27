import type { LLMClient } from '../agent/types'
import { callLlmJson } from './llm-json'
import type { CookbookLlmLogger } from './logger'
import { normalizeAuthoredPage } from './page-normalization'
import { buildRepairMessages } from './prompts'
import { AuthoredCookbookPageSchema } from './schemas'
import type {
  AuthoredCookbookPage,
  CookbookEvidencePacket,
  CriticReport,
  EvidenceAuditReport,
  LlmCallTrace,
} from './types'

export async function repairCookbookPage(args: {
  llm: LLMClient
  model: string
  packet: CookbookEvidencePacket
  page: AuthoredCookbookPage
  criticReport: CriticReport
  auditReport: EvidenceAuditReport
  maxTokens: number
  trace: LlmCallTrace[]
  storeRawResponse: boolean
  logger?: CookbookLlmLogger
}): Promise<AuthoredCookbookPage> {
  const result = await callLlmJson({
    llm: args.llm,
    model: args.model,
    messages: buildRepairMessages({
      packet: args.packet,
      page: args.page,
      criticReport: args.criticReport,
      auditReport: args.auditReport,
    }),
    schema: AuthoredCookbookPageSchema,
    maxTokens: args.maxTokens,
    role: 'repair',
    trace: args.trace,
    storeRawResponse: args.storeRawResponse,
    logger: args.logger,
  })
  return normalizeAuthoredPage(result.parsed, args.packet)
}
