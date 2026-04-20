import { describe, expect, it } from 'bun:test'
import { buildCdmCandidate } from '../../src/cdm-assembly/builder'
import { parseLegacyCdmPath } from '../../src/mapping-ir/transform'
import type { MappingIR, MappingSemanticMeta } from '../../src/mapping-ir/types'

function makeRepeatingScalarMapping(args: {
  sourcePath: string
  value: string
  bindingKey: string
  sourceIndex: number
}): MappingIR {
  const semantics: MappingSemanticMeta = {
    domain: 'temporal',
    dateType: 'payment_date',
  }
  return {
    version: 'v2',
    source: {
      path: args.sourcePath,
      name: 'paymentDate',
      value: args.value,
      ancestors: [],
      sourceFormat: 'json',
    },
    target: {
      pathTemplate: parseLegacyCdmPath('payout.paymentDates', semantics).pathTemplate,
      leafKind: 'scalar',
      legacyPath: 'payout.paymentDates',
    },
    value: { kind: 'raw_scalar', value: args.value },
    semantics,
    grouping: [
      {
        entityType: 'schedule',
        entityKey: args.bindingKey,
        rankHint: args.sourceIndex,
      },
    ],
    arrayBinding: {
      bindingKey: args.bindingKey,
      sourceCollectionPath: '$.trade.economics.paymentDates',
      sourceIndex: args.sourceIndex,
      cardinality: 'repeating',
    },
    confidence: 95,
    transformation: 'map_payment_dates',
    reasoning: 'test fixture',
    skillInvoked: 'temporal_mapper',
    candidateSkills: ['temporal_mapper'],
    needsReview: false,
    diagnostics: [],
  }
}

describe('buildCdmCandidate', () => {
  it('binds repeating scalar properties by logical binding key instead of input order', () => {
    const second = makeRepeatingScalarMapping({
      sourcePath: '$.trade.economics.paymentDates[1]',
      value: '2026-07-10',
      bindingKey: 'payment_schedule_1',
      sourceIndex: 1,
    })
    const first = makeRepeatingScalarMapping({
      sourcePath: '$.trade.economics.paymentDates[0]',
      value: '2026-04-10',
      bindingKey: 'payment_schedule_0',
      sourceIndex: 0,
    })

    const candidate = buildCdmCandidate({
      mappings: [second, first],
      root: 'tradeState',
    })

    expect(candidate.cdmPayload).toMatchObject({
      tradeState: {
        payout: {
          paymentDates: ['2026-04-10', '2026-07-10'],
        },
      },
    })
  })

  it('merges packageMeta.* mapping targets into root.meta', () => {
    const semantics: MappingSemanticMeta = { domain: 'generic' }
    const mapping: MappingIR = {
      version: 'v2',
      source: {
        path: '/FpML/header/conversationId',
        name: 'conversationId',
        value: 'c-1',
        ancestors: [],
        sourceFormat: 'xml',
      },
      target: {
        pathTemplate: parseLegacyCdmPath('packageMeta.fpmlHeader.conversationId', semantics)
          .pathTemplate,
        leafKind: 'scalar',
        legacyPath: 'packageMeta.fpmlHeader.conversationId',
      },
      value: { kind: 'raw_scalar', value: 'c-1' },
      semantics,
      grouping: [],
      confidence: 88,
      transformation: 'map_fpml_conversation_id',
      reasoning: 'test',
      skillInvoked: 'fpml_header_metadata',
      candidateSkills: ['fpml_header_metadata'],
      needsReview: false,
      diagnostics: [],
    }

    const candidate = buildCdmCandidate({ mappings: [mapping], root: 'tradeState' })

    expect(candidate.provenance).toMatchObject({
      fpmlHeader: { conversationId: 'c-1' },
    })
    expect(candidate.cdmPayload).toMatchObject({
      tradeState: {},
    })
    expect(candidate.appliedSourcePaths.has('/FpML/header/conversationId')).toBe(true)
  })
})
