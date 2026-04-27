import { describe, expect, it } from 'bun:test'
import type { CookbookRuntimeBundle } from '../../src/cookbook-runtime/types'
import { selectCookbookContext } from '../../src/cookbook-runtime/selector'

const bundle: CookbookRuntimeBundle = {
  rootPath: '/tmp',
  manifest: { generatedAt: '' },
  validationIssueCount: 0,
  warnings: [],
  global: [
    { name: 'identifier-handling', markdown: 'global rules '.repeat(200) },
    { name: 'temporal-normalization', markdown: 'dates '.repeat(200) },
  ],
  families: [
    {
      familySlug: 'fx-derivatives',
      status: 'ready',
      markdown: 'family body '.repeat(400),
      evidence: {
        ruleIds: ['RULE-001'],
        transformationIds: ['TR-001'],
        variantIds: [],
        enrichmentIds: [],
        openQuestions: [],
      },
    },
  ],
}

describe('cookbook runtime selector', () => {
  it('selects family by inferred product family and trims by budget', () => {
    const selection = selectCookbookContext({
      bundle,
      productFamily: 'fx',
      maxChars: 3500,
      includeReviewOnly: false,
    })
    expect(selection.family?.familySlug).toBe('fx-derivatives')
    expect(selection.diagnostics.outputChars).toBeLessThanOrEqual(3500 + 100)
  })
})

