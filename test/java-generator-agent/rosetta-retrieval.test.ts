import { describe, expect, test } from 'bun:test'
import {
  getRosettaFunction,
  getRosettaMappingArea,
  getRosettaProductPack,
  searchRosettaBlocks,
} from '../../src/java-generator-agent/rosetta-retrieval'

describe('rosetta retrieval', () => {
  test('returns exact function block text', async () => {
    const result = await getRosettaFunction('MapFxSingleLegEconomicTerms')

    expect(result.ok).toBe(true)
    expect(result.blocks[0]?.name).toBe('MapFxSingleLegEconomicTerms')
    expect(result.blocks[0]?.rawText).toContain('func MapFxSingleLegEconomicTerms')
  })

  test('returns mapping area functions for FX single-leg settlement payout', async () => {
    const result = await getRosettaMappingArea({
      productFamily: 'fx-derivatives',
      implementationGroup: 'fx-single-leg',
      area: 'settlement-payout',
    })

    expect(result.ok).toBe(true)
    expect(result.blocks.map(block => block.name)).toContain('MapFxCoreDetailsModelToSettlementPayout')
  })

  test('returns diagnostics for missing functions', async () => {
    const result = await getRosettaFunction('DoesNotExistInRosetta')

    expect(result.ok).toBe(false)
    expect(result.missingFunctionNames).toEqual(['DoesNotExistInRosetta'])
    expect(result.diagnostics.some(item => item.includes('Missing Rosetta function'))).toBe(true)
  })

  test('checks product pack availability', async () => {
    const result = await getRosettaProductPack('fx-derivatives')

    expect(result.ok).toBe(true)
    expect(result.sourcePaths.some(path => path.endsWith('fx.md'))).toBe(true)
  })

  test('search respects product family and query', async () => {
    const result = await searchRosettaBlocks({
      productFamily: 'fx-derivatives',
      query: 'MapFxSingleLeg',
      limit: 10,
    })

    expect(result.ok).toBe(true)
    expect(result.blocks.some(block => block.name.includes('MapFxSingleLeg'))).toBe(true)
  })
})
