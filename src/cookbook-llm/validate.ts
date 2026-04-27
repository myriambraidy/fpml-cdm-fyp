import type {
  AuthoredPageResult,
  CookbookEvidencePacket,
  LlmCookbookValidationIssue,
} from './types'

export function validateAuthoredPage(args: {
  packet: CookbookEvidencePacket
  result: AuthoredPageResult
}): LlmCookbookValidationIssue[] {
  const evidenceIds = new Set(args.packet.evidenceReferences.map(reference => reference.id))
  const issues: LlmCookbookValidationIssue[] = []

  if (args.result.finalDecision !== 'pass') {
    issues.push(
      error(
        args.packet.id,
        'authoring_not_passed',
        `Authoring loop ended with decision ${args.result.finalDecision}.`
      )
    )
  }

  for (const claim of args.result.finalPage.claims) {
    if (claim.evidenceIds.length === 0) {
      issues.push(error(args.packet.id, 'claim_missing_evidence', `Claim has no evidence ids: ${claim.claim}`))
    }
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) {
        issues.push(
          error(args.packet.id, 'claim_missing_evidence_reference', `Claim cites a missing evidence id: ${evidenceId}`)
        )
      }
    }
    if (claim.confidence === 'low' && !claim.requiresHumanReview) {
      issues.push(
        error(
          args.packet.id,
          'low_confidence_without_review',
          `Low-confidence claim does not require review: ${claim.claim}`
        )
      )
    }
  }

  const finalIteration = args.result.iterations.at(-1)
  if (finalIteration) {
    for (const audited of finalIteration.auditReport.auditedClaims) {
      if (
        audited.support === 'unsupported' ||
        audited.support === 'overgeneralized' ||
        audited.support === 'contradicted'
      ) {
        issues.push(
          error(args.packet.id, 'bad_audited_claim', `${audited.support}: ${audited.claim}`)
        )
      }
    }
  }

  for (const section of args.packet.requiredSections) {
    if (!hasHeading(args.result.finalPage.markdown, section)) {
      issues.push(error(args.packet.id, 'missing_required_section', `Missing section: ${section}`))
    }
  }

  if (args.result.finalPage.doNotAssume.length === 0) {
    issues.push(error(args.packet.id, 'missing_do_not_assume', 'Authored page has no do-not-assume rules.'))
  }

  if (
    (args.packet.operationalStatus === 'review_only' || args.packet.operationalStatus === 'blocked') &&
    /agents may apply|apply these rules during normal|normal proposal generation/i.test(args.result.finalPage.markdown)
  ) {
    issues.push(
      error(
        args.packet.id,
        'non_operational_page_has_operational_language',
        'Review-only or blocked page appears to permit automatic rule application.'
      )
    )
  }

  return issues
}

export function splitLlmValidationIssues(issues: LlmCookbookValidationIssue[]): {
  errorCount: number
  warningCount: number
} {
  return {
    errorCount: issues.filter(issue => issue.severity === 'error').length,
    warningCount: issues.filter(issue => issue.severity === 'warning').length,
  }
}

function hasHeading(markdown: string, section: string): boolean {
  const heading = section.toLowerCase().trim()
  return markdown
    .split('\n')
    .some(line => line.replace(/^#+\s*/, '').trim().toLowerCase() === heading)
}

function error(
  packetId: string,
  code: string,
  message: string
): LlmCookbookValidationIssue {
  return {
    severity: 'error',
    code,
    message,
    packetId,
  }
}
