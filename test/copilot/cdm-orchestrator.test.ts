import { describe, expect, it } from 'bun:test'
import { CdmOrchestrator } from '../../src/copilot/cdm-orchestrator'
import { parseLegacyCdmPath } from '../../src/mapping-ir/transform'
import type { RosettaMappingPackage } from '../../src/exporter/types'
import type { MappingSemanticMeta } from '../../src/mapping-ir/types'
import type { LLMClient } from '../../src/agent/types'

function makeBasePackage(
  mappings: RosettaMappingPackage['mappings'],
  diagnostics?: RosettaMappingPackage['diagnostics']
): RosettaMappingPackage {
  return {
    version: '1.1.0-prototype',
    document: {
      uploadId: 'upload-1',
      filename: 'sample.json',
      formatType: 'json',
    },
    mappings,
    coverage: {
      totalProposals: mappings.length,
      exportedCount: mappings.length,
      skipped: [],
    },
    diagnostics,
    audit: {
      exportedAt: '2026-04-19T00:00:00.000Z',
      exportedBy: 'analyst@localhost',
      cdmVersion: '6.0.0',
      skillVersions: {},
      uploadId: 'upload-1',
      filename: 'sample.json',
      counts: {
        mappings: mappings.length,
        skipped: 0,
      },
    },
  }
}

describe('CdmOrchestrator', () => {
  it('deduplicates inherited and rebuilt assembly diagnostics', async () => {
    const semantics: MappingSemanticMeta = {
      domain: 'temporal',
      dateType: 'trade_date',
    }
    const pathTemplate = parseLegacyCdmPath('tradeDate', semantics).pathTemplate
    const mappings: RosettaMappingPackage['mappings'] = [
      {
        source: { path: '$.trade.tradeDateA', name: 'tradeDateA', value: '2026-01-10' },
        target: { cdmPath: 'tradeDate', transformation: 'map_trade_date' },
        evidence: {
          skillInvoked: 'temporal_mapper',
          confidence: 95,
          proposalId: 'proposal-1',
          approvedBy: 'system:auto',
          approvedAt: '2026-04-19T00:00:00.000Z',
        },
        targetTemplate: pathTemplate,
        leafKind: 'scalar',
        mappingValue: { kind: 'raw_scalar', value: '2026-01-10' },
        semantics,
        grouping: [],
        diagnostics: [],
        irVersion: 'v2',
      },
      {
        source: { path: '$.trade.tradeDateB', name: 'tradeDateB', value: '2026-01-10' },
        target: { cdmPath: 'tradeDate', transformation: 'map_trade_date' },
        evidence: {
          skillInvoked: 'temporal_mapper',
          confidence: 95,
          proposalId: 'proposal-2',
          approvedBy: 'system:auto',
          approvedAt: '2026-04-19T00:00:00.000Z',
        },
        targetTemplate: pathTemplate,
        leafKind: 'scalar',
        mappingValue: { kind: 'raw_scalar', value: '2026-01-10' },
        semantics,
        grouping: [],
        diagnostics: [],
        irVersion: 'v2',
      },
    ]
    const diagnostics: NonNullable<RosettaMappingPackage['diagnostics']> = {
      collisions: [
        {
          code: 'same_target_multiple_sources',
          severity: 'warn' as const,
          targetPath: 'tradeDate',
          sourcePaths: ['$.trade.tradeDateA', '$.trade.tradeDateB'],
          message: 'Multiple source fields map to target tradeDate',
        },
      ],
      coverage: [],
    }

    const result = await new CdmOrchestrator().run({
      pkg: makeBasePackage(mappings, diagnostics),
      fpml: '{}',
      fields: [
        { name: 'tradeDateA', path: '$.trade.tradeDateA', value: '2026-01-10' },
        { name: 'tradeDateB', path: '$.trade.tradeDateB', value: '2026-01-10' },
      ],
    })

    expect(result.assemblyDiagnostics?.collisions).toHaveLength(1)
  })

  it('rehydrates rich IR payloads without flattening object-marker mappings', async () => {
    const counterpartySemantics: MappingSemanticMeta = {
      domain: 'party',
      partyRole: 'buyer',
      cdmCounterpartyRole: 'PARTY_1',
    }
    const objectTemplate = parseLegacyCdmPath(
      'tradableProduct.counterparty[0]',
      counterpartySemantics
    ).pathTemplate
    const refTemplate = parseLegacyCdmPath(
      'tradableProduct.counterparty[0].partyReference',
      counterpartySemantics
    ).pathTemplate

    const result = await new CdmOrchestrator().run({
      pkg: makeBasePackage([
        {
          source: { path: '$.trade.parties[0].role', name: 'role', value: 'buyer' },
          target: {
            cdmPath: 'tradableProduct.counterparty[0]',
            transformation: 'map_grouped_counterparty_entity',
          },
          evidence: {
            skillInvoked: 'grouped_entity_party',
            confidence: 98,
            proposalId: 'proposal-1',
            approvedBy: 'system:auto',
            approvedAt: '2026-04-19T00:00:00.000Z',
          },
          targetTemplate: objectTemplate,
          leafKind: 'object_marker',
          mappingValue: { kind: 'object_marker', raw: 'party1' },
          semantics: counterpartySemantics,
          grouping: [
            {
              entityType: 'counterparty',
              entityKey: 'counterparty_primary',
              relation: 'buyer',
              rankHint: 0,
            },
          ],
          arrayBinding: {
            bindingKey: 'counterparty_primary',
            sourceCollectionPath: '$.trade.parties',
            sourceIndex: 0,
            cardinality: 'single',
          },
          diagnostics: [],
          irVersion: 'v2',
        },
        {
          source: { path: '$.trade.parties[0].id', name: 'id', value: 'party1' },
          target: {
            cdmPath: 'tradableProduct.counterparty[0].partyReference',
            transformation: 'map_grouped_counterparty_reference',
          },
          evidence: {
            skillInvoked: 'grouped_entity_party',
            confidence: 98,
            proposalId: 'proposal-2',
            approvedBy: 'system:auto',
            approvedAt: '2026-04-19T00:00:00.000Z',
          },
          targetTemplate: refTemplate,
          leafKind: 'reference',
          mappingValue: {
            kind: 'reference',
            refType: 'party',
            raw: 'party1',
            resolvedId: 'party1',
          },
          semantics: counterpartySemantics,
          grouping: [
            {
              entityType: 'counterparty',
              entityKey: 'counterparty_primary',
              relation: 'buyer',
              rankHint: 0,
            },
          ],
          arrayBinding: {
            bindingKey: 'counterparty_primary',
            sourceCollectionPath: '$.trade.parties',
            sourceIndex: 0,
            cardinality: 'single',
          },
          diagnostics: [],
          irVersion: 'v2',
        },
      ]),
      fpml: '{}',
      fields: [
        { name: 'role', path: '$.trade.parties[0].role', value: 'buyer' },
        { name: 'id', path: '$.trade.parties[0].id', value: 'party1' },
      ],
    })

    const counterparty = ((result.cdmPayload ?? result.cdm)?.tradeState as Record<string, unknown>)
      ?.tradableProduct as
      | { counterparty?: Array<{ partyReference?: string }> }
      | undefined
    expect(Array.isArray(counterparty?.counterparty)).toBe(true)
    expect(counterparty?.counterparty?.some(item => item.partyReference === 'party1')).toBe(true)
  })

  it('uses LLM envelope cdm as validation candidate', async () => {
    const llm: LLMClient = {
      call: async () => ({
        content: JSON.stringify({
          reasoning: 'llm-candidate',
          cdm: {
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
              sentinel: 'from-llm',
            },
          },
          sourceEvidence: [],
          openQuestions: [],
        }),
      }),
    }

    const result = await new CdmOrchestrator(llm).run({
      pkg: makeBasePackage([]),
      fpml: '<FpML><fxSingleLeg /></FpML>',
      fields: [],
    })

    expect(result.status).toBe('compliant')
    const tradeState = (result.cdmPayload?.tradeState ?? {}) as Record<string, unknown>
    expect(tradeState.sentinel).toBe('from-llm')
  })

  it('routes critical semantic identity/reference failures to analyst review', async () => {
    const llm: LLMClient = {
      call: async () => ({
        content: JSON.stringify({
          reasoning: 'critical-semantic',
          cdm: {
            tradeState: {
              tradableProduct: {
                counterparty: [
                  { role: 'Party1', partyReference: 'partyA' },
                  { role: 'Party2', partyReference: 'partyB' },
                ],
              },
              party: [{ globalKey: 'partyA', externalKey: 'partyA' }],
            },
          },
          sourceEvidence: [],
          openQuestions: [],
        }),
      }),
    }

    const result = await new CdmOrchestrator(llm).run({
      pkg: makeBasePackage([]),
      fpml: '<FpML><trade /></FpML>',
      fields: [],
    })

    expect(result.status).toBe('needs_analyst_review')
    expect(result.semantic.errors.some(error => error.code === 'unresolved_party_reference')).toBe(true)
  })

  it('passes product-family hint in orchestrator prompt payload', async () => {
    const capturedUserPayload: Record<string, unknown>[] = []
    const llm: LLMClient = {
      call: async params => {
        const userMessage = params.messages.find(message => message.role === 'user')
        if (userMessage?.content) {
          capturedUserPayload.push(JSON.parse(userMessage.content))
        }
        return {
          content: JSON.stringify({
            reasoning: 'family-hint',
            cdm: {
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
              },
            },
            sourceEvidence: [],
            openQuestions: [],
          }),
        }
      },
    }

    await new CdmOrchestrator(llm).run({
      pkg: makeBasePackage([]),
      fpml: '<FpML><fxSingleLeg><exchangeRate /></fxSingleLeg></FpML>',
      fields: [{ name: 'exchangeRate', path: '/trade/fxSingleLeg/exchangeRate', value: '1.20' }],
    })

    expect(capturedUserPayload.length).toBeGreaterThan(0)
    const payload = capturedUserPayload[0] as {
      productFamilyHint?: string
      expectedPayouts?: string[]
    }
    expect(payload.productFamilyHint).toBe('fx')
    expect(payload.expectedPayouts).toContain('SettlementPayout')
  })
})
