import { describe, expect, test } from 'bun:test'
import { renderPlanValidationRepairGuidance } from '../../src/java-generator-agent/plan-validation-repair-guidance'

describe('plan validation repair guidance', () => {
  test('renders targeted guidance for repeated unapproved CDM planning classes', () => {
    const markdown = renderPlanValidationRepairGuidance({
      status: 'failed',
      blockingIssues: [
        "Plan references CDM Java class not approved by this run's API contract: cdm.base.math.NonNegativeQuantitySchedule",
        'Plan references unapproved CDM Java class cdm.base.staticdata.asset.common.ProductIdentifier; use only classes in approved-cdm-api-contract-summary.md.',
        "Plan references CDM Java class not approved by this run's API contract: IdentifierType",
        "Plan references CDM Java class not approved by this run's API contract: LEI",
      ],
      warnings: [],
    })

    expect(markdown).toContain('Remove ProductIdentifier/ProductTaxonomy')
    expect(markdown).toContain('Remove NonNegativeQuantitySchedule')
    expect(markdown).toContain('Remove IdentifierType.LEI')
  })

  test('renders targeted guidance for fixture and tool-only planner failures', () => {
    const markdown = renderPlanValidationRepairGuidance({
      status: 'failed',
      blockingIssues: [
        'Planner did not produce a Markdown plan; final output was tool-only sentinel [tool calls requested].',
        'Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex01-fx-spot',
      ],
      warnings: [],
    })

    expect(markdown).toContain('Stop calling tools')
    expect(markdown).toContain('Rewrite runtime fixture bullets')
  })
})
