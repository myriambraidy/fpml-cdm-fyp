import { describe, expect, it } from 'bun:test'
import { cardinalityCheckerLogic } from '../../src/skills/cardinality-checker/logic'

describe('cardinality_checker', () => {
  it('maps explicit 0..1 cardinality correctly', () => {
    const result = cardinalityCheckerLogic({
      fieldName: 'tradeDate',
      fieldPath: '/trade/tradeDate',
      minOccurs: 0,
      maxOccurs: 1,
    })
    expect(result.cdmCardinality).toBe('0..1')
    expect(result.isArray).toBeFalse()
    expect(result.confidence).toBeGreaterThanOrEqual(90)
  })

  it('maps explicit unbounded arrays with array notation', () => {
    const result = cardinalityCheckerLogic({
      fieldName: 'payments',
      fieldPath: '/trade/payments',
      minOccurs: 0,
      maxOccurs: 'unbounded',
    })
    expect(result.cdmCardinality).toBe('0..*')
    expect(result.requiresArrayNotation).toBeTrue()
    expect(result.cdmPath.endsWith('[]')).toBeTrue()
  })

  it('infers plural field names as arrays', () => {
    const result = cardinalityCheckerLogic({
      fieldName: 'parties',
      fieldPath: '/trade/parties',
    })
    expect(result.isArray).toBeTrue()
    expect(result.cdmPath.endsWith('[]')).toBeTrue()
  })
})
