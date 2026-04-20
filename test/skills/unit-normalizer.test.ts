import { describe, expect, it } from 'bun:test'
import { unitNormalizerLogic } from '../../src/skills/unit-normalizer/logic'

describe('unit_normalizer', () => {
  it('maps currency codes to CurrencyCodeEnum', () => {
    const result = unitNormalizerLogic({
      fieldName: 'currency',
      fieldPath: '/trade/currency',
      fieldValue: 'USD',
    })
    expect(result.cdmEnum).toBe('CurrencyCodeEnum.USD')
    expect(result.confidence).toBeGreaterThanOrEqual(90)
  })

  it('maps notional amounts to priceQuantity quantity amount', () => {
    const result = unitNormalizerLogic({
      fieldName: 'notionalAmount',
      fieldPath: '/trade/notionalAmount',
      fieldValue: '1000000',
    })
    expect(result.cdmPath).toBe('priceQuantity.quantity.amount')
  })

  it('maps quantity units to UnitEnum', () => {
    const result = unitNormalizerLogic({
      fieldName: 'quantityUnit',
      fieldPath: '/trade/quantityUnit',
      fieldValue: 'BBL',
    })
    expect(result.cdmEnum).toBe('UnitEnum.BBL')
  })

  it('maps tradeId under partyTradeIdentifier to packageMeta', () => {
    const result = unitNormalizerLogic({
      fieldName: 'tradeId',
      fieldPath: '/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId',
      fieldValue: 'tid-1',
    })
    expect(result.cdmPath).toBe('packageMeta.fpmlTradeId_0')
  })

  it('maps quoteBasis to packageMeta FX hint', () => {
    const result = unitNormalizerLogic({
      fieldName: 'quoteBasis',
      fieldPath: '/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis',
      fieldValue: 'Currency2PerCurrency1',
    })
    expect(result.cdmPath).toBe('packageMeta.fpmlFxQuotedCurrencyPair.quoteBasis')
  })
})
