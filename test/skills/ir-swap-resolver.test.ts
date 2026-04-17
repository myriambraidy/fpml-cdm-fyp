import { describe, expect, it } from 'bun:test'
import { irSwapResolverLogic } from '../../src/skills/ir-swap-resolver/logic'

describe('ir_swap_resolver', () => {
  it('maps swap structures to payout target', () => {
    const result = irSwapResolverLogic({
      fieldName: 'swap',
      fieldPath: '/trade/swap',
    })
    expect(result.cdmPath).toBe('tradableProduct.product.contractualProduct.economicTerms.payout')
    expect(result.productCategory).toBe('vanilla_swap')
    expect(result.confidence).toBeGreaterThanOrEqual(90)
  })

  it('detects floating stream context', () => {
    const result = irSwapResolverLogic({
      fieldName: 'swapStream',
      fieldPath: '/trade/legs/swapStream',
      context: { floatingRateCalculation: true },
    })
    expect(result.rateType).toBe('floating')
  })

  it('maps floatingRateCalculation fields to floating rate spec', () => {
    const result = irSwapResolverLogic({
      fieldName: 'floatingRateCalculation',
      fieldPath: '/trade/legs/floatingRateCalculation',
    })
    expect(result.cdmPath).toBe('payout.rateSpecification.floatingRate')
  })
})
