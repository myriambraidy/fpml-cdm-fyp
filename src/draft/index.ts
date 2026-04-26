import { join } from 'node:path'
import { mapWithConcurrency } from './concurrency'
import { analyzeDraftPair } from './pair-analysis'
import { selectDraftPairsForFolder, readDraftManifest } from './pair-selection'
import { renderDraftMarkdown, synthesizeDraftFolder } from './folder-synthesis'
import { writeDraftArtifacts } from './io'
import { DraftLogger } from './logging'
import {
  assessDraftRolloutReadiness,
  computeDraftQualityAssessment,
  decideDraftPublication,
  validateDraftSynthesisIntegrity,
} from './validation'
import type { DraftArtifacts, DraftRunConfig, DraftRunResult } from './types'
import type { LLMClient } from '../agent/types'

export async function runDraftPhase(args: {
  config: DraftRunConfig
  llm?: LLMClient
}): Promise<DraftRunResult> {
  const { config, llm } = args
  const logger = new DraftLogger()
  const startedAt = Date.now()
  logger.info('run', 'Draft phase run started.', {
    folder: config.folder,
    maxPairs: config.maxPairs ?? null,
    pairConcurrency: config.pairConcurrency ?? 1,
    llmEnabled: !!llm,
  })
  const manifestPath = join(config.cdmRoot, 'manifest.json')
  const manifest = await readDraftManifest(manifestPath)
  const selection = selectDraftPairsForFolder({
    manifest,
    manifestPath,
    config,
  })
  logger.info('pair_selection', 'Selected pairs from manifest.', {
    folder: config.folder,
    includedPairs: selection.includedPairs.length,
    missingExamples: selection.missingExamples.length,
    ignoredExamples: selection.ignoredExamples.length,
    exactMatches: selection.coverage.exactMatches,
    normalizedMatches: selection.coverage.normalizedMatches,
    aliasMatches: selection.coverage.aliasMatches,
  })

  const totalPairs = selection.includedPairs.length
  const pairAnalyses = await mapWithConcurrency({
    items: selection.includedPairs,
    concurrency: config.pairConcurrency ?? 1,
    worker: async (pair, index) => {
      logger.info('pair_analysis', 'Starting pair analysis.', {
        pair: pair.fpmlRelativePath,
        pairIndex: index + 1,
        totalPairs,
        strategy: pair.pairingStrategy,
        progress: `${index + 1}/${totalPairs}`,
      })
      return analyzeDraftPair({
        pair,
        llm,
        logger,
        model: config.model,
        maxTokens: config.pairMaxTokens,
        maxRetries: config.pairMaxRetries,
        storeFailedRawResponses: config.storeFailedRawResponses,
      })
    },
  })

  const successfulPairAnalyses = pairAnalyses.filter(analysis => analysis.status === 'success')
  const failedPairAnalyses = pairAnalyses.filter(analysis => analysis.status === 'failed')
  logger.info('pair_analysis', 'Pair analysis stage completed.', {
    successfulPairCount: successfulPairAnalyses.length,
    failedPairCount: failedPairAnalyses.length,
  })

  let synthesis
  let synthesisDiagnostics
  if (successfulPairAnalyses.length > 0) {
    logger.info('synthesis', 'Starting folder synthesis from semantic pair analyses plus all structural pairs.', {
      folder: config.folder,
      successfulPairCount: successfulPairAnalyses.length,
      failedPairCount: failedPairAnalyses.length,
      salvagedPairCount: successfulPairAnalyses.filter(analysis => analysis.semanticRecovery === 'salvaged').length,
      structuralPairCount: pairAnalyses.length,
    })
    const result = await synthesizeDraftFolder({
      folder: config.folder,
      allPairAnalyses: pairAnalyses,
      semanticPairAnalyses: successfulPairAnalyses,
      selection,
      llm,
      logger,
      model: config.synthesisModel ?? config.model,
      maxTokens: config.synthesisMaxTokens,
      maxRetries: config.synthesisMaxRetries,
      storeFailedRawResponses: config.storeFailedRawResponses,
    })
    synthesis = result.synthesis
    synthesisDiagnostics = result.diagnostics
  } else {
    logger.warn('synthesis', 'No semantic pair analyses succeeded; generating deterministic fallback synthesis only.', {
      folder: config.folder,
    })
    const result = await synthesizeDraftFolder({
      folder: config.folder,
      allPairAnalyses: pairAnalyses,
      semanticPairAnalyses: [],
      selection,
      llm: undefined,
      logger,
      model: config.synthesisModel ?? config.model,
      maxTokens: config.synthesisMaxTokens,
      maxRetries: config.synthesisMaxRetries,
      storeFailedRawResponses: config.storeFailedRawResponses,
    })
    synthesis = result.synthesis
    synthesisDiagnostics = result.diagnostics
  }

  const integrity = synthesis
    ? validateDraftSynthesisIntegrity({
        synthesis,
        successfulPairAnalyses,
      })
    : { ok: false, issues: [] }
  if (!integrity.ok) {
    logger.error('validation', 'Integrity validation failed for synthesized draft.', {
      issueCount: integrity.issues.length,
      issues: integrity.issues.map(issue => issue.evidence),
    })
  } else if (synthesis) {
    logger.info('validation', 'Integrity validation passed for synthesized draft.', {
      successfulPairCount: successfulPairAnalyses.length,
    })
  }

  const publication = decideDraftPublication({
    llmEnabled: !!llm,
    successfulPairCount: successfulPairAnalyses.length,
    failedPairCount: failedPairAnalyses.length,
    synthesis,
    integrity,
    includedPairCount: selection.includedPairs.length,
  })
  logger.info('publish', 'Publication decision computed.', {
    status: publication.status,
    publishFinal: publication.publishFinal,
    reasons: publication.reasons,
  })

  const qualityAssessment = computeDraftQualityAssessment({
    synthesis,
    successfulPairCount: successfulPairAnalyses.length,
    includedPairCount: selection.includedPairs.length,
    integrity,
    synthesisDiagnostics,
  })
  const rolloutReadiness = assessDraftRolloutReadiness({
    qualityAssessment,
  })
  logger.info('validation', 'Draft quality assessment computed.', {
    score: qualityAssessment.score,
    rating: qualityAssessment.rating,
    rolloutDecision: rolloutReadiness.decision,
    readyForBroadRollout: rolloutReadiness.readyForBroadRollout,
  })

  const generatedAt = new Date().toISOString()
  const outputDirectory = join(config.outputRoot, config.folder)
  const draftBaseName = publication.publishFinal ? 'draft' : 'draft.partial'
  const markdownPath = join(outputDirectory, `${draftBaseName}.md`)
  const jsonPath = join(outputDirectory, `${draftBaseName}.json`)
  const debugPath = join(outputDirectory, 'debug.json')
  const logPath = join(outputDirectory, 'run-log.json')

  const artifact: DraftArtifacts | undefined = synthesis
    ? {
        generatedAt,
        config,
      selection,
        pairAnalyses,
        synthesis,
      }
    : undefined

  const debugArtifact = {
    generatedAt,
    config,
    selection,
    pairAnalyses,
    successfulPairCount: successfulPairAnalyses.length,
    failedPairCount: failedPairAnalyses.length,
    synthesis,
    synthesisFailureReason:
      !synthesis && successfulPairAnalyses.length === 0
        ? 'No pair analyses completed successfully.'
        : undefined,
    synthesisDiagnostics,
    integrity,
    publication,
    qualityAssessment,
    rolloutReadiness,
    runLog: logger.getEntries(),
  }
  const markdown = artifact ? renderDraftMarkdown({ artifact }) : undefined

  logger.info('publish', 'Writing draft artifacts to disk.', {
    outputDirectory,
    publishFinal: publication.publishFinal,
    markdownPath: artifact ? markdownPath : null,
    jsonPath: artifact ? jsonPath : null,
    debugPath,
    logPath,
  })

  logger.info('run', 'Draft phase run completed.', {
    folder: config.folder,
    status: publication.status,
    durationMs: Date.now() - startedAt,
    publishedDraft: artifact ? markdownPath : null,
    publishedJson: artifact ? jsonPath : null,
    debugPath,
    logPath,
  })

  const finalRunLog = logger.getEntries()
  const finalDebugArtifact = {
    ...debugArtifact,
    runLog: finalRunLog,
  }

  await writeDraftArtifacts({
    markdownPath: artifact ? markdownPath : undefined,
    jsonPath: artifact ? jsonPath : undefined,
    markdown,
    artifact,
    debugPath,
    debugArtifact: finalDebugArtifact,
    logPath,
    runLog: finalRunLog,
  })

  return {
    outputDirectory,
    markdownPath,
    jsonPath,
    debugPath,
    logPath,
    status: publication.status,
    selection,
  }
}
