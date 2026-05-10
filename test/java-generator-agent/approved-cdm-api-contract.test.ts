import { describe, expect, test } from 'bun:test'
import type { ApprovedCdmApiContract } from '../../src/java-generator-agent/approved-cdm-api-contract'
import { renderApprovedCdmApiContractSummary } from '../../src/java-generator-agent/approved-cdm-api-contract'

describe('approved cdm api contract', () => {
  test('summary exposes enum constants and builder class names', () => {
    const summary = renderApprovedCdmApiContractSummary({
      generatedAt: '2026-05-09T00:00:00.000Z',
      productFamily: 'fx-derivatives',
      implementationGroup: 'fx-single-leg',
      authority: 'compiled-jar-javap-and-semantic-recipes',
      approvedClasses: [
        {
          className: 'cdm.base.staticdata.identifier.TradeIdentifierTypeEnum',
          reason: 'test',
          existenceAuthority: 'compiled-jar-javap',
          semanticAuthorities: ['generated-recipe'],
          allowedUsages: ['test'],
          enumValues: ['UNIQUE_TRANSACTION_IDENTIFIER', 'UNIQUE_SWAP_IDENTIFIER'],
        },
        {
          className: 'cdm.event.common.TradeIdentifier',
          reason: 'test',
          existenceAuthority: 'compiled-jar-javap',
          semanticAuthorities: ['generated-recipe'],
          allowedUsages: ['test'],
          builderClassName: 'cdm.event.common.TradeIdentifier$TradeIdentifierBuilder',
        },
      ],
      forbiddenClasses: [],
      approvedBuilderMethods: [],
      conceptResolutions: [],
    } satisfies ApprovedCdmApiContract)

    expect(summary).toContain('UNIQUE_TRANSACTION_IDENTIFIER')
    expect(summary).toContain('UNIQUE_SWAP_IDENTIFIER')
    expect(summary).toContain('TradeIdentifier.TradeIdentifierBuilder')
  })
})
