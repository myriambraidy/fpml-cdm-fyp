import { describe, expect, it } from 'bun:test'
import { temporalMapperLogic } from '../../src/skills/temporal-mapper/logic'

describe('temporal_mapper', () => {
  it('maps tradeDate to tradeDate with high confidence', () => {
    const result = temporalMapperLogic({
      fieldName: 'tradeDate',
      fieldPath: '/trade/tradeDate',
    })
    expect(result.cdmPath).toBe('tradeDate')
    expect(result.confidence).toBeGreaterThanOrEqual(90)
  })

  it('maps paymentDate fields to payout payment dates', () => {
    const result = temporalMapperLogic({
      fieldName: 'paymentDates',
      fieldPath: '/trade/swapStream/paymentDates',
    })
    expect(result.cdmPath).toBe('payout.paymentDates')
    expect(result.hasSchedule).toBeTrue()
  })

  it('keeps generic date fields low confidence', () => {
    const result = temporalMapperLogic({
      fieldName: 'date',
      fieldPath: '/trade/date',
    })
    expect(result.confidence).toBeLessThanOrEqual(50)
  })
})
