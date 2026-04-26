import { basename } from 'node:path'
import type {
  DraftFolderSynthesis,
  DraftIntegrityIssue,
  DraftIntegrityValidationResult,
  DraftPairAnalysis,
  DraftQualityAssessment,
  DraftRolloutReadiness,
  DraftSynthesisDiagnostics,
  PairHighlight,
} from './types'

const LARGE_FOLDER_STABLE_RULE_PAIR_THRESHOLD = 10
const LARGE_FOLDER_STABLE_RULE_RATIO = 0.15

function buildAllowedReferences(pairAnalyses: DraftPairAnalysis[]): Set<string> {
  const allowed = new Set<string>()
  for (const analysis of pairAnalyses) {
    const fpmlRelative = analysis.pair.fpmlRelativePath.replaceAll('\\', '/')
    const cdmRelative = analysis.pair.cdmRelativePath.replaceAll('\\', '/')
    allowed.add(fpmlRelative)
    allowed.add(cdmRelative)
    allowed.add(basename(fpmlRelative))
    allowed.add(basename(cdmRelative))
  }
  return allowed
}

function isAllowedReference(reference: string, allowed: Set<string>): boolean {
  const trimmed = reference.trim().replaceAll('\\', '/')
  return allowed.has(trimmed) || allowed.has(basename(trimmed))
}

function pushIssues(
  issues: DraftIntegrityIssue[],
  args: {
    kind: DraftIntegrityIssue['kind']
    values: string[]
    allowed: Set<string>
    prefix: string
  }
): void {
  for (const value of args.values) {
    if (!isAllowedReference(value, args.allowed)) {
      issues.push({
        kind: args.kind,
        message: `${args.prefix} references an unexpected example.`,
        evidence: value,
      })
    }
  }
}

export function validateDraftSynthesisIntegrity(args: {
  synthesis: DraftFolderSynthesis
  successfulPairAnalyses: DraftPairAnalysis[]
}): DraftIntegrityValidationResult {
  const issues: DraftIntegrityIssue[] = []
  const allowed = buildAllowedReferences(args.successfulPairAnalyses)

  pushIssues(issues, {
    kind: 'unexpected_pair_highlight',
    values: args.synthesis.pairLevelHighlights.flatMap(item => [item.fpmlFile, item.cdmFile]),
    allowed,
    prefix: 'Pair highlight',
  })

  for (const rule of args.synthesis.stableMappingPatterns) {
    pushIssues(issues, {
      kind: 'unexpected_rule_example',
      values: rule.exampleFiles,
      allowed,
      prefix: `Rule ${rule.id}`,
    })
  }

  for (const transformation of args.synthesis.repeatedNonLiteralTransformations) {
    pushIssues(issues, {
      kind: 'unexpected_transformation_example',
      values: transformation.exampleFiles,
      allowed,
      prefix: `Transformation ${transformation.id}`,
    })
  }

  for (const variant of args.synthesis.variantsAndExceptions) {
    pushIssues(issues, {
      kind: 'unexpected_variant_example',
      values: variant.seenIn,
      allowed,
      prefix: `Variant ${variant.id}`,
    })
  }

  for (const enrichment of args.synthesis.suspectedEnrichmentOrDefaultBehavior) {
    pushIssues(issues, {
      kind: 'unexpected_enrichment_example',
      values: enrichment.evidence,
      allowed,
      prefix: `Enrichment ${enrichment.id}`,
    })
  }

  return {
    ok: issues.length === 0,
    issues,
  }
}

export function decideDraftPublication(args: {
  llmEnabled: boolean
  successfulPairCount: number
  failedPairCount: number
  synthesis?: DraftFolderSynthesis
  integrity: DraftIntegrityValidationResult
  includedPairCount: number
}): import('./types').DraftPublicationDecision {
  const reasons: string[] = []

  if (!args.llmEnabled) {
    return {
      status: 'deterministic_only',
      publishFinal: false,
      reasons: ['Live LLM was disabled, so only deterministic structural output is available.'],
    }
  }

  if (args.successfulPairCount === 0) {
    return {
      status: 'failed_pair_analysis',
      publishFinal: false,
      reasons: ['No pair analyses completed successfully.'],
    }
  }

  if (!args.synthesis) {
    return {
      status: 'failed_synthesis',
      publishFinal: false,
      reasons: ['Folder synthesis did not complete successfully.'],
    }
  }

  if (!args.integrity.ok) {
    return {
      status: 'failed_integrity_validation',
      publishFinal: false,
      reasons: args.integrity.issues.map(issue => issue.message),
    }
  }

  const meaningfulPrinciples = args.synthesis.folderLevelPrinciples.filter(isMeaningfulDraftPrinciple)
  const meaningfulHighlights = args.synthesis.pairLevelHighlights.filter(isMeaningfulPairHighlight)
  const hasPublishableSemanticEvidence =
    args.synthesis.stableMappingPatterns.length > 0 ||
    args.synthesis.repeatedNonLiteralTransformations.length > 0 ||
    args.synthesis.variantsAndExceptions.length > 0 ||
    args.synthesis.suspectedEnrichmentOrDefaultBehavior.length > 0 ||
    meaningfulPrinciples.length > 0 ||
    meaningfulHighlights.length >= 3

  const minimumSuccessfulPairs = Math.min(args.includedPairCount, 2)
  if (args.successfulPairCount < minimumSuccessfulPairs || !hasPublishableSemanticEvidence) {
    reasons.push('Semantic evidence is not strong enough yet to publish a final draft.')
    if (args.failedPairCount > 0) {
      reasons.push(`${args.failedPairCount} pair analyses failed and were excluded.`)
    }
    return {
      status: 'partial_success',
      publishFinal: false,
      reasons,
    }
  }

  if (args.failedPairCount > 0) {
    reasons.push(`${args.failedPairCount} pair analyses failed and were excluded from synthesis.`)
  }

  return {
    status: 'success',
    publishFinal: true,
    reasons: reasons.length ? reasons : ['Draft passed quality and integrity checks.'],
  }
}

export function computeDraftQualityAssessment(args: {
  synthesis?: DraftFolderSynthesis
  successfulPairCount: number
  includedPairCount: number
  integrity: DraftIntegrityValidationResult
  synthesisDiagnostics?: DraftSynthesisDiagnostics
}): DraftQualityAssessment {
  if (!args.synthesis) {
    return {
      score: 0,
      rating: 'poor',
      reasons: ['No folder synthesis was produced.'],
      metrics: {
        semanticSuccessRate: 0,
        fullParseRate: 0,
        stableRuleCount: 0,
        repeatedTransformationCount: 0,
        tentativePatternCount: 0,
        placeholderHighlightRate: 1,
        openQuestionCount: 0,
        openQuestionDensity: 0,
        criticalAmbiguityCount: 0,
        lowEvidenceStableRuleCount: 0,
        lowEvidenceTransformationCount: 0,
        synthesisReliability: 'fallback',
      },
    }
  }

  const synthesis = args.synthesis

  const semanticSuccessRate =
    args.includedPairCount > 0 ? args.successfulPairCount / args.includedPairCount : 0
  const fullParseRate =
    synthesis.evidenceCoverage.semanticPairCount > 0
      ? synthesis.evidenceCoverage.fullSemanticPairCount / synthesis.evidenceCoverage.semanticPairCount
      : 0
  const stableRuleCount = synthesis.stableMappingPatterns.length
  const repeatedTransformationCount = synthesis.repeatedNonLiteralTransformations.length
  const tentativePatternCount = synthesis.tentativeRepeatedPatterns.length
  const placeholderHighlightCount = synthesis.pairLevelHighlights.filter(isPlaceholderPairHighlight).length
  const placeholderHighlightRate =
    synthesis.pairLevelHighlights.length > 0
      ? placeholderHighlightCount / synthesis.pairLevelHighlights.length
      : 1
  const openQuestionCount = synthesis.openQuestions.length
  const openQuestionDensity = deriveOpenQuestionDensity(openQuestionCount, synthesis.evidenceCoverage.semanticPairCount)
  const criticalAmbiguityCount = synthesis.openQuestions.filter(isCriticalOpenQuestion).length
  const lowEvidenceStableRuleCount = synthesis.stableMappingPatterns.filter(rule =>
    rule.evidenceCount <= minimumStableRuleEvidence(synthesis.evidenceCoverage.semanticPairCount)
  ).length
  const lowEvidenceTransformationCount = synthesis.repeatedNonLiteralTransformations.filter(item => item.evidenceCount <= 2).length
  const synthesisReliability = deriveSynthesisReliability(args.synthesisDiagnostics)

  let score = 0
  score += semanticSuccessRate * 2.1
  score += fullParseRate * 1.8
  score += Math.min(stableRuleCount, 4) * 0.75
  score += Math.min(repeatedTransformationCount, 4) * 0.45
  score += Math.min(tentativePatternCount, 4) * 0.1
  score += synthesisReliability === 'full' ? 1.5 : synthesisReliability === 'salvaged' ? 0.5 : 0
  score -= Math.min(placeholderHighlightRate, 1) * 1
  score -= openQuestionDensity * 0.8
  score -= Math.min(criticalAmbiguityCount, 5) * 0.2
  score -= lowEvidenceStableRuleCount * 0.2
  score -= lowEvidenceTransformationCount * 0.15
  if (!args.integrity.ok) {
    score -= 2
  }
  const normalizedScore = Math.max(0, Math.min(10, Math.round(score * 10) / 10))

  const reasons: string[] = []
  if (semanticSuccessRate < 0.7) {
    reasons.push(
      `Semantic success rate is ${(semanticSuccessRate * 100).toFixed(0)}%, below the 70% target for strong folders.`
    )
  }
  if (fullParseRate < 0.4) {
    reasons.push(
      `Full semantic parse rate is ${(fullParseRate * 100).toFixed(0)}%, below the 40% target.`
    )
  }
  if (stableRuleCount < 4) {
    reasons.push(`Only ${stableRuleCount} stable mapping rule${stableRuleCount === 1 ? '' : 's'} were recovered.`)
  }
  if (repeatedTransformationCount < 2) {
    reasons.push(
      `Only ${repeatedTransformationCount} repeated transformation${repeatedTransformationCount === 1 ? '' : 's'} were recovered.`
    )
  }
  if (openQuestionDensity > 0.5) {
    reasons.push(
      `Open-question density is ${(openQuestionDensity * 100).toFixed(0)}%, which is still high for a stable reusable draft.`
    )
  }
  if (criticalAmbiguityCount > 0) {
    reasons.push(
      `${criticalAmbiguityCount} open question${criticalAmbiguityCount === 1 ? '' : 's'} still look critical or unresolved.`
    )
  }
  if (placeholderHighlightRate > 0.3) {
    reasons.push(
      `${(placeholderHighlightRate * 100).toFixed(0)}% of pair highlights still look placeholder-heavy or weakly grounded.`
    )
  }
  if (lowEvidenceStableRuleCount > 0) {
    reasons.push(
      `${lowEvidenceStableRuleCount} stable rule${lowEvidenceStableRuleCount === 1 ? '' : 's'} sit only at the minimum evidence threshold.`
    )
  }
  if (lowEvidenceTransformationCount > 0) {
    reasons.push(
      `${lowEvidenceTransformationCount} repeated transformation${lowEvidenceTransformationCount === 1 ? '' : 's'} still have thin supporting evidence.`
    )
  }
  if (synthesisReliability !== 'full') {
    reasons.push(
      synthesisReliability === 'salvaged'
        ? 'Folder synthesis required salvage instead of a clean full parse.'
        : 'Folder synthesis fell back to deterministic output instead of a clean model synthesis.'
    )
  }
  if (!args.integrity.ok) {
    reasons.push(`Integrity validation reported ${args.integrity.issues.length} issue(s).`)
  }
  if (reasons.length === 0) {
    reasons.push('Semantic coverage, synthesis reliability, and reusable rules all meet the current quality targets.')
  }

  return {
    score: normalizedScore,
    rating: deriveQualityRating(normalizedScore),
    reasons,
    metrics: {
      semanticSuccessRate,
      fullParseRate,
      stableRuleCount,
      repeatedTransformationCount,
      tentativePatternCount,
      placeholderHighlightRate,
      openQuestionCount,
      openQuestionDensity,
      criticalAmbiguityCount,
      lowEvidenceStableRuleCount,
      lowEvidenceTransformationCount,
      synthesisReliability,
    },
  }
}

export function assessDraftRolloutReadiness(args: {
  qualityAssessment: DraftQualityAssessment
}): DraftRolloutReadiness {
  const { metrics, rating } = args.qualityAssessment
  const failureReasons: string[] = []

  if (metrics.semanticSuccessRate < 0.85) {
    failureReasons.push('Semantic success rate is below the broad-rollout threshold.')
  }
  if (metrics.fullParseRate < 0.75) {
    failureReasons.push('Full semantic parse rate is below the broad-rollout threshold.')
  }
  if (metrics.synthesisReliability !== 'full') {
    failureReasons.push('Folder synthesis did not complete as a clean full parse.')
  }
  if (metrics.stableRuleCount < 4) {
    failureReasons.push('Stable mapping rule count is below the broad-rollout threshold.')
  }
  if (metrics.repeatedTransformationCount < 2) {
    failureReasons.push('Repeated transformation count is below the broad-rollout threshold.')
  }
  if (metrics.placeholderHighlightRate > 0.2) {
    failureReasons.push('Too many pair highlights still look placeholder-heavy.')
  }
  if (metrics.openQuestionDensity > 0.5) {
    failureReasons.push('Open-question density is still too high for broad rollout.')
  }
  if (metrics.criticalAmbiguityCount > 2) {
    failureReasons.push('Too many critical unresolved questions remain in the folder draft.')
  }
  if (metrics.lowEvidenceStableRuleCount > 1) {
    failureReasons.push('Too many stable rules are only barely above the minimum evidence threshold.')
  }
  if (metrics.lowEvidenceTransformationCount > 1) {
    failureReasons.push('Too many repeated transformations still have thin supporting evidence.')
  }
  if (rating !== 'strong') {
    failureReasons.push(`Quality rating is ${rating}, below the broad-rollout target of strong.`)
  }

  if (failureReasons.length === 0) {
    return {
      decision: 'ready',
      readyForBroadRollout: true,
      reasons: ['Draft meets the current thresholds for broader multi-folder generation.'],
    }
  }

  const pilotEligible =
    metrics.semanticSuccessRate >= 0.7 &&
    metrics.fullParseRate >= 0.6 &&
    metrics.stableRuleCount >= 1 &&
    metrics.synthesisReliability !== 'fallback' &&
    metrics.openQuestionDensity <= 1 &&
    metrics.criticalAmbiguityCount <= 4 &&
    (rating === 'good' || rating === 'strong')

  if (pilotEligible) {
    return {
      decision: 'pilot_only',
      readyForBroadRollout: false,
      reasons: [
        'Draft quality is strong enough for a limited pilot on a few additional folders, but not for broad rollout yet.',
        ...failureReasons,
      ],
    }
  }

  return {
    decision: 'not_ready',
    readyForBroadRollout: false,
    reasons: failureReasons,
  }
}

function isMeaningfulDraftPrinciple(line: string): boolean {
  const normalized = line.trim().toLowerCase()
  if (!normalized) return false
  return (
    normalized !== 'generalize only from repeated semantic evidence; use structural repetition only for scaffolding.' &&
    !normalized.startsWith('no semantic synthesis') &&
    !normalized.startsWith('no live llm')
  )
}

function isMeaningfulPairHighlight(highlight: PairHighlight): boolean {
  const meaningfulMappings = highlight.importantMappings.some(
    item => !/No live LLM analysis was available for this pair\./i.test(item)
  )
  const meaningfulTransformation =
    !/No live LLM analysis was available for this pair\.|Recovered partial semantic evidence; transformation details are incomplete\./i.test(
      highlight.importantTransformation
    )
  return meaningfulMappings || meaningfulTransformation
}

function isPlaceholderPairHighlight(highlight: PairHighlight): boolean {
  if (!isMeaningfulPairHighlight(highlight)) {
    return true
  }
  return highlight.uncertainty.some(item =>
    /No live LLM analysis was available for this pair\.|Recovered partial semantic evidence|still requires live LLM analysis/i.test(
      item
    )
  )
}

function deriveSynthesisReliability(
  diagnostics?: DraftSynthesisDiagnostics
): DraftQualityAssessment['metrics']['synthesisReliability'] {
  if (!diagnostics || diagnostics.failureKind === 'llm_disabled' || diagnostics.failureKind === 'request_error') {
    return 'fallback'
  }
  if (diagnostics.failureKind === 'parse_error') {
    return 'salvaged'
  }
  return 'full'
}

function deriveQualityRating(score: number): DraftQualityAssessment['rating'] {
  if (score >= 8.5) return 'strong'
  if (score >= 6.75) return 'good'
  if (score >= 5.25) return 'fair'
  if (score >= 3) return 'weak'
  return 'poor'
}

function minimumStableRuleEvidence(semanticPairCount: number): number {
  if (semanticPairCount >= LARGE_FOLDER_STABLE_RULE_PAIR_THRESHOLD) {
    return Math.max(3, Math.ceil(semanticPairCount * LARGE_FOLDER_STABLE_RULE_RATIO))
  }
  return 2
}

function deriveOpenQuestionDensity(openQuestionCount: number, semanticPairCount: number): number {
  if (semanticPairCount <= 0) {
    return openQuestionCount > 0 ? 1 : 0
  }
  return Math.min(openQuestionCount / semanticPairCount, 1)
}

function isCriticalOpenQuestion(question: string): boolean {
  return /\b(unclear|ambig|unknown|unresolved|confirm|verify|validate|not clear|depends|needs review|needs confirmation|cannot tell)\b/i.test(
    question
  )
}
