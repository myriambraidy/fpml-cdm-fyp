import type { LLMClient } from '../agent/types'
import { callLlmJson } from './llm-json'
import type { CookbookLlmLogger } from './logger'
import { buildAuditMessages } from './prompts'
import { EvidenceAuditReportSchema } from './schemas'
import type {
  AuthoredCookbookPage,
  CookbookEvidencePacket,
  EvidenceAuditReport,
  LlmCallTrace,
} from './types'

export async function auditCookbookPage(args: {
  llm: LLMClient
  model: string
  packet: CookbookEvidencePacket
  page: AuthoredCookbookPage
  maxTokens: number
  trace: LlmCallTrace[]
  storeRawResponse: boolean
  logger?: CookbookLlmLogger
}): Promise<EvidenceAuditReport> {
  const result = await callLlmJson({
    llm: args.llm,
    model: args.model,
    messages: buildAuditMessages({
      packet: args.packet,
      page: args.page,
    }),
    schema: EvidenceAuditReportSchema,
    maxTokens: args.maxTokens,
    role: 'auditor',
    trace: args.trace,
    storeRawResponse: args.storeRawResponse,
    logger: args.logger,
  })
  return result.parsed
}
