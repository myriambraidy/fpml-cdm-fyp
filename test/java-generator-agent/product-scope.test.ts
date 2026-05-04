import { describe, expect, test } from 'bun:test'
import { buildProductScopeGuidance } from '../../src/java-generator-agent/product-scope'

describe('java generator product-scope guidance', () => {
  test('classifies the FX derivatives family into product groups', async () => {
    const scope = await buildProductScopeGuidance({ productFamily: 'fx-derivatives' })

    expect(scope.productFamily).toBe('fx-derivatives')
    expect(scope.currentImplementationGroup).toBe('fx-single-leg')
    expect(scope.candidateNextGroups).toContain('fx-swap')
    expect(scope.candidateNextGroups).toContain('fx-simple-option')
    expect(scope.productGroups.some(group => group.group === 'fx-single-leg')).toBe(true)
    expect(scope.productGroups.some(group => group.group === 'fx-swap')).toBe(true)
    expect(scope.classifiedFixtures.some(fixture => fixture.productGroup === 'non-fx')).toBe(true)
  })

  test('rejects non-FX product families', async () => {
    await expect(buildProductScopeGuidance({ productFamily: 'credit-derivatives' })).rejects.toThrow(
      'Unsupported Java generator product family'
    )
  })
})
