import type { LLMClient } from '../agent/types'
import { callLlmJson } from './llm-json'
import type { CookbookLlmLogger } from './logger'
import { buildJudgeMessages } from './prompts'
import { StopJudgeReportSchema } from './schemas'
import type {
  AuthoredCookbookPage,
  CookbookEvidencePacket,
  CriticReport,
  EvidenceAuditReport,
  LlmCallTrace,
  StopJudgeReport,
} from './types'

export async function judgeCookbookPage(args: {
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
}): Promise<StopJudgeReport> {
  const result = await callLlmJson({
    llm: args.llm,
    model: args.model,
    messages: buildJudgeMessages({
      packet: args.packet,
      page: args.page,
      criticReport: args.criticReport,
      auditReport: args.auditReport,
    }),
    schema: StopJudgeReportSchema,
    maxTokens: args.maxTokens,
    role: 'judge',
    trace: args.trace,
    storeRawResponse: args.storeRawResponse,
    logger: args.logger,
  })
  return result.parsed
}
