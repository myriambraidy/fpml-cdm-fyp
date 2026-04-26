import type { FamilyReadiness, LoadedDraftFamily, OperationalStatus } from './types'

export function computeFamilyReadiness(input: LoadedDraftFamily): FamilyReadiness {
  const synthesis = input.artifact.synthesis
  const debug = input.debug
  const metrics = debug?.qualityAssessment.metrics
  const publication = debug?.publication
  const quality = debug?.qualityAssessment
  const integrityOk = debug?.integrity.ok
  const semanticPairs = synthesis?.evidenceCoverage.semanticPairCount ?? 0
  const matchedPairs = synthesis?.evidenceCoverage.matchedPairCount ?? 0
  const semanticSuccessRate = matchedPairs > 0 ? semanticPairs / matchedPairs : 0
  const reasons: string[] = []

  if (!synthesis) reasons.push('missing_synthesis')
  if (publication && !publication.publishFinal) reasons.push('not_final_publication')
  if (integrityOk === false) reasons.push('integrity_failed')
  if ((metrics?.synthesisReliability ?? 'full') === 'fallback') reasons.push('fallback_synthesis')
  if (semanticSuccessRate < 0.7) reasons.push('low_semantic_success')
  if (quality?.rating === 'poor' || quality?.rating === 'weak') reasons.push('weak_quality')
  if ((metrics?.openQuestionDensity ?? 0) > 0.5) reasons.push('high_open_question_density')
  if ((metrics?.criticalAmbiguityCount ?? 0) > 0) reasons.push('critical_ambiguity')

  const operationalStatus = deriveOperationalStatus({
    semanticPairs,
    reasons,
    qualityRating: quality?.rating,
  })

  return {
    folder: input.folder,
    operationalStatus,
    reasonCodes: reasons,
    semanticSuccessRate,
    qualityRating: quality?.rating,
    publicationStatus: publication?.status,
    integrityOk,
    agentUsePolicy: describeAgentUsePolicy(operationalStatus),
  }
}

function deriveOperationalStatus(args: {
  semanticPairs: number
  reasons: string[]
  qualityRating?: string
}): OperationalStatus {
  if (args.reasons.includes('missing_synthesis') || args.semanticPairs === 0) {
    return 'blocked'
  }
  if (
    args.reasons.includes('fallback_synthesis') ||
    args.reasons.includes('low_semantic_success') ||
    args.reasons.includes('weak_quality') ||
    args.reasons.includes('integrity_failed') ||
    args.reasons.includes('not_final_publication')
  ) {
    return 'review_only'
  }
  if (
    args.qualityRating !== 'strong' ||
    args.reasons.includes('high_open_question_density') ||
    args.reasons.includes('critical_ambiguity')
  ) {
    return 'pilot_only'
  }
  return 'ready'
}

function describeAgentUsePolicy(status: OperationalStatus): string {
  if (status === 'ready') {
    return 'Agents may apply these rules during normal FPML to CDM proposal generation.'
  }
  if (status === 'pilot_only') {
    return 'Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.'
  }
  if (status === 'review_only') {
    return 'Agents must not apply these rules automatically; use only as background evidence for analyst review.'
  }
  return 'Agents must not use this folder as semantic mapping knowledge.'
}
