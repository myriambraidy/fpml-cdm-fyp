import { describe, expect, it } from 'bun:test'
import { buildFamilyDocument, extractCookbookRules } from '../../src/cookbook/extract-rules'
import { computeFamilyReadiness } from '../../src/cookbook/readiness'
import { validateCookbookDocument } from '../../src/cookbook/validate'
import { makeLoadedFamily } from './helpers'

describe('validateCookbookDocument', () => {
  it('accepts generated operational documents', () => {
    const family = makeLoadedFamily()
    const readiness = computeFamilyReadiness(family)
    const rules = extractCookbookRules({ family, readiness })
    const document = buildFamilyDocument({ family, readiness, rules })
    const issues = validateCookbookDocument(document)

    expect(issues.filter(issue => issue.severity === 'error')).toHaveLength(0)
  })

  it('flags operational mapping rules without target paths', () => {
    const family = makeLoadedFamily()
    const readiness = computeFamilyReadiness(family)
    const rules = extractCookbookRules({ family, readiness })
    const document = buildFamilyDocument({
      family,
      readiness,
      rules: rules.map(rule =>
        rule.kind === 'mapping'
          ? {
              ...rule,
              targetPaths: [],
            }
          : rule
      ),
    })
    const issues = validateCookbookDocument(document)

    expect(issues.some(issue => issue.code === 'missing_target_paths')).toBe(true)
  })
})
