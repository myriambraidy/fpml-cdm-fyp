import { describe, expect, it } from 'bun:test'
import { floatingRateIndexResolverLogic } from '../../src/skills/floating-rate-index-resolver/logic'

describe('floating_rate_index_resolver', () => {
  it('maps USD-LIBOR-BBA to USD_LIBOR enum', () => {
    const result = floatingRateIndexResolverLogic({
      fieldName: 'floatingRateIndex',
      fieldPath: '/trade/floatingRateIndex',
      fieldValue: 'USD-LIBOR-BBA',
    })
    expect(result.cdmIndexEnum).toBe('FloatingRateIndexEnum.USD_LIBOR')
    expect(result.confidence).toBeGreaterThanOrEqual(85)
  })

  it('maps index tenor values', () => {
    const result = floatingRateIndexResolverLogic({
      fieldName: 'indexTenor',
      fieldPath: '/trade/indexTenor',
      fieldValue: '3M',
    })
    expect(result.cdmPath).toBe('rateSpecification.floatingRate.indexTenor')
    expect(result.tenorPeriod).toBe('3M')
  })

  it('returns confidence 0 for unknown index', () => {
    const result = floatingRateIndexResolverLogic({
      fieldName: 'floatingRateIndex',
      fieldPath: '/trade/floatingRateIndex',
      fieldValue: 'ABC-UNKNOWN',
    })
    expect(result.confidence).toBe(0)
    expect(result.cdmIndexEnum).toBeUndefined()
  })
})
