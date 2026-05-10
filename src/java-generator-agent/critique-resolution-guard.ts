import type { ApprovedCdmApiContract, ApprovedBuilderMethod } from './approved-cdm-api-contract'
import type { PlanningDecision } from './decision'
import type { PlanValidationResult } from './plan-validator'

export type CritiqueResolutionGuardResult = {
  status: 'passed' | 'failed'
  findings: string[]
}

export type GuardedPlanningDecision = {
  decision: PlanningDecision
  resolution: string
}

export function validateCritiqueResolutionAgainstContract(args: {
  resolutionMarkdown: string
  contract: ApprovedCdmApiContract
}): CritiqueResolutionGuardResult {
  const findings: string[] = []

  for (const item of args.contract.approvedClasses) {
    if (claimsClassMissing(args.resolutionMarkdown, item.className)) {
      findings.push(`Critique resolution contradicts approved contract by claiming approved class is missing: ${item.className}`)
    }
  }

  for (const method of args.contract.approvedBuilderMethods) {
    if (claimsMethodMissing(args.resolutionMarkdown, method)) {
      findings.push(`Critique resolution contradicts approved builder method: ${method.className}.${method.methodName}`)
    }
  }

  return {
    status: findings.length === 0 ? 'passed' : 'failed',
    findings,
  }
}

export function guardCritiqueReviewerDecision(args: {
  decision: PlanningDecision
  resolution: string
  validationResult: PlanValidationResult
  contract: ApprovedCdmApiContract
  finalRound: boolean
}): GuardedPlanningDecision {
  if (args.decision !== 'failed') {
    return { decision: args.decision, resolution: args.resolution }
  }
  if (args.validationResult.status !== 'passed') {
    return { decision: args.decision, resolution: args.resolution }
  }

  const guard = validateCritiqueResolutionAgainstContract({
    resolutionMarkdown: args.resolution,
    contract: args.contract,
  })
  if (guard.status === 'passed') {
    return { decision: args.decision, resolution: args.resolution }
  }

  const decision: PlanningDecision = args.finalRound ? 'accepted' : 'next_round_required'
  return {
    decision,
    resolution: appendGuardSection(args.resolution, guard, decision),
  }
}

function appendGuardSection(
  resolution: string,
  guard: CritiqueResolutionGuardResult,
  decision: PlanningDecision
): string {
  const decisionText = decision === 'accepted' ? 'ACCEPTED' : 'NEXT_ROUND_REQUIRED'
  return [
    '## Deterministic Critique Guard',
    '',
    'The critique reviewer emitted a failed decision, but deterministic approved-contract evidence contradicted fatal reviewer claims.',
    '',
    ...guard.findings.map(finding => `- ${finding}`),
    '',
    `Decision: ${decisionText}`,
    '',
    '## Original Critique Resolution',
    '',
    resolution,
  ].join('\n')
}

function claimsClassMissing(markdown: string, className: string): boolean {
  const escaped = escapeRegex(className)
  const direct = new RegExp(`${escaped}[^\\n]*(?:not\\s+found|missing|not\\s+available|does\\s+not\\s+exist|not\\s+in\\s+the\\s+jar)`, 'iu')
  const reversed = new RegExp(`(?:not\\s+found|missing|not\\s+available|does\\s+not\\s+exist|not\\s+in\\s+the\\s+jar)[^\\n]*${escaped}`, 'iu')
  return direct.test(markdown) || reversed.test(markdown)
}

function claimsMethodMissing(markdown: string, method: ApprovedBuilderMethod): boolean {
  const className = escapeRegex(method.className)
  const methodName = escapeRegex(method.methodName)
  const linePattern = new RegExp(`^.*${className}.*${methodName}.*$|^.*${methodName}.*${className}.*$`, 'gimu')
  for (const match of markdown.matchAll(linePattern)) {
    const line = match[0]
    if (/\b(no|not|missing|absent|unsupported|unavailable|without|does\s+not|doesn't|cannot|can't)\b/iu.test(line)) {
      return true
    }
  }
  return false
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}
