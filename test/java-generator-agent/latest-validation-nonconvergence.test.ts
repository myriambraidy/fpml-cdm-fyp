import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import {
  DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
  validatePlannerPlan,
} from '../../src/java-generator-agent/plan-validator'
import { buildProductScopeGuidance } from '../../src/java-generator-agent/product-scope'
import { requiredRosettaAreasForScope } from '../../src/java-generator-agent/rosetta-retrieval'

const FIXTURE_DIR = join(
  import.meta.dir,
  '..',
  'fixtures',
  'java-generator',
  'latest-validation-nonconvergence'
)

const RUNTIME_FIXTURE_IDS = [
  'fx-ex01-fx-spot',
  'fx-ex02-spot-cross-w-side-rates',
]

const APPROVED_CDM_CLASS_NAMES = [
  'cdm.event.common.TradeState',
  'cdm.product.template.Trade',
  'cdm.observable.asset.PriceSchedule',
  'cdm.base.staticdata.party.PartyIdentifier',
]

describe('latest validation nonconvergence regression', () => {
  test('accepts described runtime fixture ids and prose At', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const markdown = await readFile(join(FIXTURE_DIR, 'round-01-planner-excerpt.md'), 'utf8')
    const result = validatePlannerPlan({
      scope,
      planMarkdown: markdown,
      runtimeFixtureIds: RUNTIME_FIXTURE_IDS,
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: APPROVED_CDM_CLASS_NAMES,
    })

    expect(result.status).toBe('passed')
    expect(result.blockingIssues.some(issue => issue.endsWith(': At'))).toBe(false)
    expect(result.details?.parsedRuntimeFixtureIds).toEqual(RUNTIME_FIXTURE_IDS)
  })

  test('still rejects unapproved classes and enum constants', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })
    const markdown = await readFile(join(FIXTURE_DIR, 'round-03-planner-excerpt.md'), 'utf8')
    const result = validatePlannerPlan({
      scope,
      planMarkdown: markdown,
      runtimeFixtureIds: RUNTIME_FIXTURE_IDS,
      javaShellContract: DEFAULT_JAVA_SHELL_PLAN_CONTRACT,
      requiredRosettaAreas: requiredRosettaAreasForScope({
        productFamily: 'fx-derivatives',
        implementationGroup: 'fx-single-leg',
      }),
      approvedCdmClassNames: APPROVED_CDM_CLASS_NAMES,
    })

    expect(result.status).toBe('failed')
    expect(result.blockingIssues.some(issue => issue.includes('ProductIdentifier'))).toBe(true)
    expect(result.blockingIssues.some(issue => issue.includes('NonNegativeQuantitySchedule'))).toBe(true)
    expect(result.blockingIssues.some(issue => issue.includes('IdentifierType'))).toBe(true)
    expect(result.blockingIssues.some(issue => issue.includes('LEI'))).toBe(true)
  })
})
