import { join } from 'node:path'
import type { LLMClient } from '../agent/types'
import { buildEvidencePackets } from './evidence-packet'
import {
  buildLlmOutputDirectory,
  readSourceManifest,
  writeAuthoredCookbook,
  writeFailedAuthoringRun,
} from './io'
import { createCookbookLlmLogger } from './logger'
import type { CookbookLlmLogger } from './logger'
import { runAuthoringLoop } from './loop'
import { buildLlmCookbookManifest } from './render'
import { splitLlmValidationIssues, validateAuthoredPage } from './validate'
import type {
  AuthoredPageResult,
  CookbookLlmConfig,
  CookbookLlmRunResult,
  LlmCookbookAuthoringDebug,
} from './types'

export async function runCookbookLlmPhase(args: {
  config: CookbookLlmConfig
  llm: LLMClient
}): Promise<CookbookLlmRunResult> {
  const logger = createCookbookLlmLogger(args.config)
  const generatedAt = new Date().toISOString()
  logger.info('run_start', {
    generatedAt,
    mode: args.config.mode,
    includeReviewOnly: args.config.includeReviewOnly,
    onlyPacketId: args.config.onlyPacketId,
    maxRepairLoops: args.config.maxRepairLoops,
  })
  const outputDirectory = buildLlmOutputDirectory({
    outputRoot: args.config.outputRoot,
    mode: args.config.mode,
    generatedAt,
  })
  const sourceManifest = await readSourceManifest(join(args.config.deterministicRoot, 'manifest.json'))
  logger.info('manifest_loaded', {
    families: sourceManifest.families.length,
    globalDocuments: sourceManifest.globalDocuments.length,
  })
  const packets = await buildEvidencePackets({
    deterministicRoot: args.config.deterministicRoot,
    includeReviewOnly: args.config.includeReviewOnly,
    onlyPacketId: args.config.onlyPacketId,
  })
  logger.info('packets_built', {
    packetCount: packets.length,
    outputDirectory,
  })
  const results: AuthoredPageResult[] = []

  for (const [index, packet] of packets.entries()) {
    const startedAt = Date.now()
    logger.info('packet_start', {
      packetId: packet.id,
      progress: `${index + 1}/${packets.length}`,
      subjectType: packet.subjectType,
      operationalStatus: packet.operationalStatus,
      evidenceReferences: packet.evidenceReferences.length,
    })
    const result = await runPacketSafely({
      llm: args.llm,
      config: args.config,
      packet,
      logger,
    })
    results.push(result)
    logger.info('packet_done', {
      packetId: packet.id,
      progress: `${index + 1}/${packets.length}`,
      decision: result.finalDecision,
      iterations: result.iterations.length,
      llmCalls: result.llmCalls.length,
      elapsedSeconds: Math.round((Date.now() - startedAt) / 1000),
    })
    if (args.config.failFast && result.finalDecision !== 'pass') break
  }

  logger.info('validation_start', {
    resultCount: results.length,
  })
  const validationIssues = results.flatMap(result => {
    const packet = packets.find(item => item.id === result.packetId)
    if (!packet) {
      return [
        {
          severity: 'error' as const,
          code: 'missing_packet',
          message: `No evidence packet found for ${result.packetId}`,
          packetId: result.packetId,
        },
      ]
    }
    return validateAuthoredPage({ packet, result })
  })
  const debug: LlmCookbookAuthoringDebug = {
    generatedAt,
    configSummary: {
      maxRepairLoops: args.config.maxRepairLoops,
      models: args.config.models,
    },
    results,
    validationIssues,
  }
  const counts = splitLlmValidationIssues(validationIssues)
  logger.info('validation_done', {
    errors: counts.errorCount,
    warnings: counts.warningCount,
  })
  if (counts.errorCount > 0) {
    logger.warn('failed_run_write_start', {
      errors: counts.errorCount,
      warnings: counts.warningCount,
    })
    await writeFailedAuthoringRun({
      config: args.config,
      generatedAt,
      packets,
      results,
      validationIssues,
      debug,
    })
    logger.warn('run_failed', {
      errors: counts.errorCount,
      warnings: counts.warningCount,
    })
    const topErrors = validationIssues
      .filter(issue => issue.severity === 'error')
      .slice(0, 6)
      .map(issue => `[${issue.packetId}] ${issue.code}: ${issue.message}`)
      .join(' | ')
    throw new Error(
      `LLM cookbook validation failed with ${counts.errorCount} errors.${
        topErrors ? ` Top errors: ${topErrors}` : ''
      }`
    )
  }

  const manifest = buildLlmCookbookManifest({
    generatedAt,
    mode: args.config.mode,
    deterministicRoot: args.config.deterministicRoot,
    outputRoot: outputDirectory,
    sourceManifest,
    packets,
    results,
  })

  logger.info('publish_start', {
    pageCount: results.length,
    outputDirectory,
  })
  const written = await writeAuthoredCookbook({
    config: args.config,
    generatedAt,
    outputDirectory,
    manifest,
    results,
    validationIssues,
    debug,
    packets,
  })
  logger.info('run_done', {
    pageCount: written.pageCount,
    validationErrorCount: written.validationErrorCount,
    validationWarningCount: written.validationWarningCount,
    outputDirectory: written.outputDirectory,
  })
  return written
}

export type {
  AuthoredCookbookPage,
  AuthoredPageResult,
  CookbookEvidencePacket,
  CookbookLlmConfig,
  CookbookLlmRunResult,
} from './types'

async function runPacketSafely(args: {
  llm: LLMClient
  config: CookbookLlmConfig
  packet: Parameters<typeof runAuthoringLoop>[0]['packet']
  logger: CookbookLlmLogger
}): Promise<AuthoredPageResult> {
  try {
    return await runAuthoringLoop(args)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'LLM authoring failed.'
    args.logger.warn('packet_exception', {
      packetId: args.packet.id,
      reason: message.slice(0, 220),
    })
    return {
      packetId: args.packet.id,
      subjectType: args.packet.subjectType,
      title: args.packet.title,
      finalPage: {
        markdown: args.packet.deterministicMarkdown,
        claims: [],
        unresolvedQuestions: [message],
        doNotAssume: ['Do not publish this LLM-authored page until the authoring loop succeeds.'],
      },
      iterations: [],
      llmCalls: [],
      finalDecision: 'fail',
      failureReason: message,
    }
  }
}
