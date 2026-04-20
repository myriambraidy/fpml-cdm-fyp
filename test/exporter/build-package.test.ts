import { describe, expect, it } from 'bun:test'
import { buildRosettaPackage } from '../../src/exporter/build-package'
import type { ApprovedMappingExportRow } from '../../src/storage/queries'
import { parseLegacyCdmPath } from '../../src/mapping-ir/transform'
import type { MappingIR, MappingSemanticMeta } from '../../src/mapping-ir/types'

function buildApprovedRow(): ApprovedMappingExportRow {
  const semantics: MappingSemanticMeta = {
    domain: 'party',
    partyRole: 'buyer',
    cdmCounterpartyRole: 'PARTY_1',
  }
  const ir: MappingIR = {
    version: 'v2',
    source: {
      path: '$.trade.parties[0].id',
      name: 'id',
      value: 'party1',
      ancestors: [],
      sourceFormat: 'json',
    },
    target: {
      pathTemplate: parseLegacyCdmPath(
        'tradableProduct.counterparty[0].partyReference',
        semantics
      ).pathTemplate,
      leafKind: 'reference',
      legacyPath: 'tradableProduct.counterparty[0].partyReference',
    },
    value: {
      kind: 'reference',
      refType: 'party',
      raw: 'party1',
      resolvedId: 'party1',
    },
    semantics,
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
    confidence: 98,
    transformation: 'map_grouped_counterparty_reference',
    reasoning: 'test fixture',
    skillInvoked: 'grouped_entity_party',
    candidateSkills: ['grouped_entity_party'],
    needsReview: false,
    diagnostics: [],
  }

  return {
    proposalId: 'proposal-1',
    fieldPath: ir.source.path,
    fieldName: ir.source.name,
    fieldValue: ir.source.value ?? null,
    cdmPath: ir.target.legacyPath,
    transformation: ir.transformation,
    skillInvoked: ir.skillInvoked,
    confidence: ir.confidence,
    approvedBy: 'system:auto',
    approvedAt: '2026-04-19T00:00:00.000Z',
    ir,
  }
}

describe('buildRosettaPackage', () => {
  it('preserves rich IR fields needed for CDM assembly round-trip', () => {
    const pkg = buildRosettaPackage({
      document: {
        uploadId: 'upload-1',
        filename: 'sample.json',
        formatType: 'json',
      },
      totalProposalCount: 1,
      approved: [buildApprovedRow()],
      skipped: [],
      audit: {
        exportedAt: '2026-04-19T00:00:00.000Z',
        exportedBy: 'analyst@localhost',
        cdmVersion: '6.0.0',
        skillVersions: {},
        uploadId: 'upload-1',
        filename: 'sample.json',
      },
    })

    expect(pkg.mappings[0]).toMatchObject({
      leafKind: 'reference',
      mappingValue: {
        kind: 'reference',
        resolvedId: 'party1',
      },
      irVersion: 'v2',
    })
  })
})
