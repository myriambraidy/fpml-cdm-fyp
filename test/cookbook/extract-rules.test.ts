import { describe, expect, it } from 'bun:test'
import { buildFamilyDocument, extractCookbookRules } from '../../src/cookbook/extract-rules'
import { computeFamilyReadiness } from '../../src/cookbook/readiness'
import { makeLoadedFamily } from './helpers'

describe('extractCookbookRules', () => {
  it('converts stable mappings and transformations into operational rules', () => {
    const family = makeLoadedFamily()
    const readiness = computeFamilyReadiness(family)
    const rules = extractCookbookRules({ family, readiness })

    expect(rules.some(rule => rule.kind === 'mapping')).toBe(true)
    expect(rules.some(rule => rule.kind === 'transformation')).toBe(true)
    expect(rules.every(rule => rule.validationChecks.length > 0)).toBe(true)
  })

  it('builds family documents with agent safeguards', () => {
    const family = makeLoadedFamily()
    const readiness = computeFamilyReadiness(family)
    const rules = extractCookbookRules({ family, readiness })
    const document = buildFamilyDocument({ family, readiness, rules })

    expect(document.canonicalProcedure.length).toBeGreaterThan(0)
    expect(document.doNotAssume.length).toBeGreaterThan(0)
    expect(document.validationChecklist.length).toBeGreaterThan(0)
  })
})
