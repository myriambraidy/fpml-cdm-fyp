import { describe, expect, it } from 'bun:test'
import { buildOrchestrationContext } from '../../src/agent/context'
import type { Field } from '../../src/parser/types'

describe('buildOrchestrationContext', () => {
  it('collects party ids in document order', () => {
    const fields: Field[] = [
      { name: 'partyId', path: '/party[0]/partyId', value: 'LEI1' },
      { name: 'partyId', path: '/party[1]/partyId', value: 'LEI2' },
      { name: 'payerPartyReference', path: '/x', value: 'LEI1' },
    ]
    const ctx = buildOrchestrationContext(fields)
    expect(ctx.partyOrder).toEqual(['LEI1', 'LEI2'])
  })
})
