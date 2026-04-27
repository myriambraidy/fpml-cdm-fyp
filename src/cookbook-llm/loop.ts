import type { LLMClient } from '../agent/types'
import { auditCookbookPage } from './auditor'
import { authorCookbookPage } from './author'
import { critiqueCookbookPage } from './critic'
import { judgeCookbookPage } from './judge'
import type { CookbookLlmLogger } from './logger'
import { repairCookbookPage } from './repair'
import type {
  AuthoredPageResult,
  AuthoringIteration,
  CookbookEvidencePacket,
  CookbookLlmConfig,
  LlmCallTrace,
} from './types'

const AUTHOR_MAX_TOKENS = 20000
const CRITIC_MAX_TOKENS = 8000
const AUDITOR_MAX_TOKENS = 8000
const JUDGE_MAX_TOKENS = 8000
const REPAIR_MAX_TOKENS = 20000

export async function runAuthoringLoop(args: {
  llm: LLMClient
  config: CookbookLlmConfig
  packet: CookbookEvidencePacket
  logger: CookbookLlmLogger
}): Promise<AuthoredPageResult> {
  const llmCalls: LlmCallTrace[] = []
  args.logger.info('role_start', {
    packetId: args.packet.id,
    role: 'author',
    model: args.config.models.author,
    maxTokens: AUTHOR_MAX_TOKENS,
  })
  let page = await authorCookbookPage({
    llm: args.llm,
    model: args.config.models.author,
    packet: args.packet,
    maxTokens: AUTHOR_MAX_TOKENS,
    trace: llmCalls,
    storeRawResponse: args.config.storeRawResponses,
    logger: args.logger,
  })
  args.logger.info('role_done', {
    packetId: args.packet.id,
    role: 'author',
    markdownChars: page.markdown.length,
    claims: page.claims.length,
  })

  const iterations: AuthoringIteration[] = []

  for (let iteration = 1; iteration <= args.config.maxRepairLoops; iteration += 1) {
    args.logger.info('iteration_start', {
      packetId: args.packet.id,
      iteration,
      maxRepairLoops: args.config.maxRepairLoops,
    })
    args.logger.info('role_start', {
      packetId: args.packet.id,
      iteration,
      role: 'critic',
      model: args.config.models.critic,
      maxTokens: CRITIC_MAX_TOKENS,
    })
    args.logger.info('role_start', {
      packetId: args.packet.id,
      iteration,
      role: 'auditor',
      model: args.config.models.auditor,
      maxTokens: AUDITOR_MAX_TOKENS,
    })
    const [criticReport, auditReport] = await Promise.all([
      critiqueCookbookPage({
        llm: args.llm,
        model: args.config.models.critic,
        packet: args.packet,
        page,
        maxTokens: CRITIC_MAX_TOKENS,
        trace: llmCalls,
        storeRawResponse: args.config.storeRawResponses,
        logger: args.logger,
      }),
      auditCookbookPage({
        llm: args.llm,
        model: args.config.models.auditor,
        packet: args.packet,
        page,
        maxTokens: AUDITOR_MAX_TOKENS,
        trace: llmCalls,
        storeRawResponse: args.config.storeRawResponses,
        logger: args.logger,
      }),
    ])
    args.logger.info('role_done', {
      packetId: args.packet.id,
      iteration,
      role: 'critic',
      decision: criticReport.decision,
      score: criticReport.score,
      blockingIssues: criticReport.blockingIssues.length,
    })
    args.logger.info('role_done', {
      packetId: args.packet.id,
      iteration,
      role: 'auditor',
      decision: auditReport.decision,
      unsupportedClaims: auditReport.unsupportedClaims.length,
      overgeneralizedClaims: auditReport.overgeneralizedClaims.length,
    })

    args.logger.info('role_start', {
      packetId: args.packet.id,
      iteration,
      role: 'judge',
      model: args.config.models.judge,
      maxTokens: JUDGE_MAX_TOKENS,
    })
    const judgeReport = await judgeCookbookPage({
      llm: args.llm,
      model: args.config.models.judge,
      packet: args.packet,
      page,
      criticReport,
      auditReport,
      maxTokens: JUDGE_MAX_TOKENS,
      trace: llmCalls,
      storeRawResponse: args.config.storeRawResponses,
      logger: args.logger,
    })
    args.logger.info('role_done', {
      packetId: args.packet.id,
      iteration,
      role: 'judge',
      decision: judgeReport.decision,
      grounding: judgeReport.scores.grounding,
      actionability: judgeReport.scores.actionability,
      validation: judgeReport.scores.validation,
    })

    iterations.push({
      iteration,
      page,
      criticReport,
      auditReport,
      judgeReport,
    })

    if (judgeReport.decision === 'pass') {
      args.logger.info('packet_authoring_passed', {
        packetId: args.packet.id,
        iterations: iteration,
        llmCalls: llmCalls.length,
      })
      return {
        packetId: args.packet.id,
        subjectType: args.packet.subjectType,
        title: args.packet.title,
        finalPage: page,
        iterations,
        llmCalls,
        finalDecision: 'pass',
      }
    }

    if (judgeReport.decision === 'fail') {
      args.logger.warn('packet_authoring_failed', {
        packetId: args.packet.id,
        iterations: iteration,
        reason: judgeReport.reason.slice(0, 220),
      })
      return {
        packetId: args.packet.id,
        subjectType: args.packet.subjectType,
        title: args.packet.title,
        finalPage: page,
        iterations,
        llmCalls,
        finalDecision: 'fail',
        failureReason: judgeReport.reason,
      }
    }

    args.logger.info('role_start', {
      packetId: args.packet.id,
      iteration,
      role: 'repair',
      model: args.config.models.repair,
      maxTokens: REPAIR_MAX_TOKENS,
    })
    page = await repairCookbookPage({
      llm: args.llm,
      model: args.config.models.repair,
      packet: args.packet,
      page,
      criticReport,
      auditReport,
      maxTokens: REPAIR_MAX_TOKENS,
      trace: llmCalls,
      storeRawResponse: args.config.storeRawResponses,
      logger: args.logger,
    })
    args.logger.info('role_done', {
      packetId: args.packet.id,
      iteration,
      role: 'repair',
      markdownChars: page.markdown.length,
      claims: page.claims.length,
    })
  }

  args.logger.warn('packet_authoring_repair_limit', {
    packetId: args.packet.id,
    maxRepairLoops: args.config.maxRepairLoops,
    llmCalls: llmCalls.length,
  })
  return {
    packetId: args.packet.id,
    subjectType: args.packet.subjectType,
    title: args.packet.title,
    finalPage: page,
    iterations,
    llmCalls,
    finalDecision: 'repair_required',
    failureReason: 'Maximum repair loops reached.',
  }
}
