import { describe, expect, it } from 'bun:test'
import { partyResolverLogic } from '../../src/skills/party-resolver/logic'

describe('party_resolver', () => {
  it('maps buyer to PARTY_1', () => {
    const result = partyResolverLogic({
      fieldName: 'buyer',
      fieldPath: '/trade/buyer',
    })
    expect(result.cdmPath).toBe('tradableProduct.counterparty[0]')
    expect(result.cdmCounterpartyRole).toBe('PARTY_1')
    expect(result.confidence).toBeGreaterThanOrEqual(90)
  })

  it('maps premium payer context to buyer role', () => {
    const result = partyResolverLogic({
      fieldName: 'payer',
      fieldPath: '/fxOption/premium/payer',
      context: { parentName: 'premium', ancestors: ['fxOption', 'premium'] },
    })
    expect(result.cdmCounterpartyRole).toBe('PARTY_1')
    expect(result.confidence).toBeGreaterThanOrEqual(85)
  })

  it('keeps ambiguous payer confidence low', () => {
    const result = partyResolverLogic({
      fieldName: 'payer',
      fieldPath: '/trade/payer',
    })
    expect(result.confidence).toBeLessThanOrEqual(60)
  })
})
