import { describe, expect, it } from 'bun:test'
import { validateSemanticCdm } from '../../src/cdm-validation/semantic'

function makeBaseTradeState() {
  return {
    tradeState: {
      tradableProduct: {
        counterparty: [
          { role: 'Party1', partyReference: 'partyA' },
          { role: 'Party2', partyReference: 'partyB' },
        ],
      },
      party: [
        { globalKey: 'partyA', externalKey: 'partyA' },
        { globalKey: 'partyB', externalKey: 'partyB' },
      ],
      tradeDate: { value: '2026-05-01' },
    },
  }
}

describe('validateSemanticCdm', () => {
  it('flags duplicate tradeIdentifier entries with same semantics', () => {
    const candidate = makeBaseTradeState() as Record<string, unknown>
    ;(candidate.tradeState as Record<string, unknown>).tradeIdentifier = [
      {
        issuerReference: { globalReference: 'partyA' },
        assignedIdentifier: [{ identifier: { value: 'UTI-1', meta: { scheme: 'scheme:a' } } }],
      },
      {
        issuerReference: { globalReference: 'partyA' },
        assignedIdentifier: [{ identifier: { value: 'UTI-1', meta: { scheme: 'scheme:a' } } }],
      },
    ]

    const result = validateSemanticCdm(candidate, 'TradeState')
    expect(result.errors.some(error => error.code === 'duplicate_trade_identifier')).toBe(true)
  })

  it('flags ungrounded identifiers when grounding enforcement is enabled', () => {
    const candidate = makeBaseTradeState() as Record<string, unknown>
    ;(candidate.tradeState as Record<string, unknown>).tradeIdentifier = [
      {
        assignedIdentifier: [{ identifier: { value: 'INVENTED-999' } }],
      },
    ]

    const result = validateSemanticCdm(candidate, 'TradeState', {
      enforceGroundedIdentifiers: true,
      allowedIdentifierValues: ['KNOWN-123', 'partyA', 'partyB'],
    })

    expect(result.errors.some(error => error.code === 'ungrounded_identifier')).toBe(true)
  })
})
