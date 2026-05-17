import type { PlanValidationResult } from './plan-validator'

export function renderPlanValidationRepairGuidance(validation: PlanValidationResult): string {
  const guidance: string[] = []

  if (hasIssue(validation, 'ProductIdentifier') || hasIssue(validation, 'ProductTaxonomy')) {
    guidance.push(
      'Remove ProductIdentifier/ProductTaxonomy as Java implementation classes. Use only approved identifier/taxonomy substitute paths from approved-cdm-api-contract-summary.md and semantic-recipes.md.'
    )
  }

  if (hasIssue(validation, 'NonNegativeQuantitySchedule')) {
    guidance.push(
      'Remove NonNegativeQuantitySchedule. Use only approved quantity classes and builder methods from approved-cdm-api-contract-summary.md; if no attachable quantity builder exists, mark the Rosetta concept traceability-only.'
    )
  }

  if (hasIssue(validation, 'IdentifierType') || hasIssue(validation, 'LEI')) {
    guidance.push(
      'Remove IdentifierType.LEI and unproved enum constants. Enum constants may appear only after get_cdm_enum_constants proves the exact constant.'
    )
  }

  if (hasIssue(validation, 'Runtime supported fixtures section')) {
    guidance.push(
      'Rewrite runtime fixture bullets as exact runtime fixture ids, optionally followed by a colon description, for every configured runtime fixture.'
    )
  }

  if (hasIssue(validation, 'missing required section')) {
    guidance.push(
      'Rewrite the planner artifact with all four required machine-checked sections before adding narrative sections.'
    )
  }

  if (hasIssue(validation, 'tool-only sentinel')) {
    guidance.push(
      'Stop calling tools and write planner-plan.md as Markdown with all four machine-checked sections.'
    )
  }

  return guidance.length === 0
    ? 'No specialized repair guidance was generated. Fix every blocking issue exactly as written.'
    : guidance.map(item => `- ${item}`).join('\n')
}

function hasIssue(validation: PlanValidationResult, text: string): boolean {
  return validation.blockingIssues.some(issue => issue.includes(text))
}
