import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import type { ApprovedCdmApiContract } from '../../src/java-generator-agent/approved-cdm-api-contract'
import { validateCritiqueResolutionAgainstContract } from '../../src/java-generator-agent/critique-resolution-guard'
import {
  DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
  validatePlannerPlan,
} from '../../src/java-generator-agent/plan-validator'
import { buildProductScopeGuidance } from '../../src/java-generator-agent/product-scope'
import { requiredRosettaAreasForScope } from '../../src/java-generator-agent/rosetta-retrieval'

const FIXTURE_DIR = 'test/fixtures/java-generator/latest-terminal-reviewer-failure'

describe('latest terminal reviewer failure regression', () => {
  test('validator catches over-specific unapproved simple classes from failed run shape', async () => {
    const [plannerPlan, contract] = await Promise.all([
      readFile(join(FIXTURE_DIR, 'planner-plan.md'), 'utf8'),
      readContract(),
    ])
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })

    const result = validatePlannerPlan({
      scope,
      planMarkdown: plannerPlan,
      runtimeFixtureIds: ['fx-ex01-fx-spot'],
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: contract.approvedClasses.map(item => item.className),
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('NonNegativeQuantitySchedule'))).toBe(true)
    expect(result.blockingIssues.some(issue => issue.includes('ProductTaxonomy'))).toBe(true)
  })

  test('critique guard catches reversed SettlementPayout missing-class claim from failed run shape', async () => {
    const [resolution, contract] = await Promise.all([
      readFile(join(FIXTURE_DIR, 'critique-resolution.md'), 'utf8'),
      readContract(),
    ])

    const result = validateCritiqueResolutionAgainstContract({
      resolutionMarkdown: resolution,
      contract,
    })

    expect(result.status).toBe('failed')
    expect(result.findings.some(finding => finding.includes('cdm.product.template.SettlementPayout'))).toBe(true)
  })
})

async function readContract(): Promise<ApprovedCdmApiContract> {
  const content = await readFile(join(FIXTURE_DIR, 'approved-cdm-api-contract.json'), 'utf8')
  return JSON.parse(content) as ApprovedCdmApiContract
}
