import { describe, expect, it } from 'bun:test'
import { buildFallbackSynthesis, renderDraftMarkdown, synthesizeDraftFolder } from '../../src/draft/folder-synthesis'
import type { DraftArtifacts } from '../../src/draft/types'
import { QueueMockLLM } from '../agent/mock-llm'

const artifact: DraftArtifacts = {
  generatedAt: '2026-04-22T12:00:00.000Z',
  config: {
    workspaceRoot: 'C:/repo',
    fpmlRoot: 'C:/repo/data_to_learn_from/fpml',
    cdmRoot: 'C:/repo/data_to_learn_from/cdm_parallel',
    outputRoot: 'C:/repo/data/drafts',
    folder: 'fx-derivatives',
  },
  selection: {
    manifestPath: 'C:/repo/data_to_learn_from/cdm_parallel/manifest.json',
    folder: 'fx-derivatives',
    includedPairs: [
      {
        folder: 'fx-derivatives',
        fpmlRelativePath: 'fx-derivatives/fx-ex01.xml',
        cdmRelativePath: 'fx-derivatives/fx-ex01.json',
        fpmlAbsolutePath: 'C:/repo/data_to_learn_from/fpml/fx-derivatives/fx-ex01.xml',
        cdmAbsolutePath: 'C:/repo/data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01.json',
        pairingStrategy: 'exact',
      },
    ],
    missingExamples: ['fx-derivatives/fx-ex02.xml'],
    ignoredExamples: [],
    coverage: {
      totalFpmlFilesInFolder: 2,
      matchedPairsAvailable: 1,
      matchedPairsUsed: 1,
      missingCounterparts: 1,
      ignoredPairs: 0,
      exactMatches: 1,
      normalizedMatches: 0,
      aliasMatches: 0,
    },
  },
  pairAnalyses: [],
  synthesis: {
    folder: 'fx-derivatives',
    evidenceCoverage: {
      matchedPairCount: 1,
      structuralPairCount: 1,
      semanticPairCount: 1,
      fullSemanticPairCount: 1,
      salvagedSemanticPairCount: 0,
      failedSemanticPairCount: 0,
      structuralBasisNote: 'Structural summaries are computed from all matched pairs.',
      semanticBasisNote: 'Semantic rules are computed from successful or salvaged pair analyses.',
    },
    repeatedFpmlStructure: {
      headerAndBoilerplate: ['Header appears consistently before trade content.'],
      topLevelSections: [{ section: 'trade', count: 1, total: 1 }],
      nestedStructures: ['trade > fxSingleLeg (6 paths)'],
      optionalSections: [],
    },
    repeatedCdmStructure: {
      topLevelSections: [{ section: 'trade', count: 1, total: 1 }],
      wrappersAndScaffolding: ['trade > product (8 paths)'],
      optionalSections: [],
    },
    stableMappingPatterns: [],
    repeatedNonLiteralTransformations: [],
    tentativeRepeatedPatterns: [
      {
        id: 'TENT-001',
        kind: 'mapping',
        strength: 'moderate recurring pattern',
        description: 'Trade date normalization appears repeatedly.',
        evidenceCount: 2,
        exampleFiles: ['fx-derivatives/fx-ex01.xml', 'fx-derivatives/fx-ex02.xml'],
        notes: ['Recovered from pair-level evidence.'],
      },
    ],
    folderLevelPrinciples: ['FX examples center priceQuantity and settlement semantics.'],
    variantsAndExceptions: [],
    suspectedEnrichmentOrDefaultBehavior: [],
    repeatedHeaderAndCommonBoilerplateSummary: {
      commonFpmlHeaderBehavior: ['Header fields often carry messaging metadata.'],
      commonTradeScaffolding: ['Trade blocks wrap the economic content.'],
      commonCdmBoilerplateBehavior: ['CDM output repeatedly uses trade wrappers and meta nodes.'],
    },
    openQuestions: ['No strong evidence yet.'],
    pairLevelHighlights: [
      {
        fpmlFile: 'fx-derivatives/fx-ex01.xml',
        cdmFile: 'fx-derivatives/fx-ex01.json',
        mainFpmlSections: 'trade, header, party',
        mainCdmSections: 'trade, product, tradeLot',
        importantMappings: ['Amounts are reorganized into quantity structures.'],
        importantTransformation: 'Rate becomes price while exchanged amounts become quantity.',
        uncertainty: ['Party enrichment may not be directly grounded in source values.'],
      },
    ],
    agentPlaybook: {
      summary: 'Use deterministic structure plus semantic evidence.',
      canonicalSteps: ['Map identifiers before economic terms.'],
      recurringRules: ['Trade date normalizes into CDM tradeDate.'],
      transformationPatterns: ['Amounts are reshaped into quantity structures.'],
      productSpecificBranches: [],
      validationChecks: ['Check enriched identifiers.'],
      doNotAssume: ['Do not assume every repeated wrapper is semantic.'],
    },
    draftConclusion: {
      mostReusableFindings: ['Trade wrappers recur strongly.'],
      safeToGeneralize: ['FX examples repeatedly use quantity plus price decomposition.'],
      remainTentative: ['Identifier enrichment needs more evidence.'],
    },
    sourceAppendixNotes: ['Included one matched pair in this fixture.'],
  },
}

function buildPairAnalysis(index: number) {
  const padded = String(index).padStart(2, '0')
  return {
    pair: {
      folder: 'fx-derivatives',
      fpmlRelativePath: `fx-derivatives/fx-ex${padded}.xml`,
      cdmRelativePath: `fx-derivatives/fx-ex${padded}.json`,
      fpmlAbsolutePath: `C:/repo/data_to_learn_from/fpml/fx-derivatives/fx-ex${padded}.xml`,
      cdmAbsolutePath: `C:/repo/data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex${padded}.json`,
      pairingStrategy: 'exact' as const,
    },
    status: 'success' as const,
    productOrTradeFamily: 'fx-derivatives',
    fpmlSummary: {
      format: 'xml' as const,
      root: 'FpML',
      topLevelSections: ['trade'],
      structuralNotes: [],
      headerBoilerplateSignals: [],
      nestedStructureSignals: [],
      samplePaths: [],
      rawFieldCount: 5,
    },
    cdmSummary: {
      format: 'json' as const,
      root: '$',
      topLevelSections: ['trade'],
      structuralNotes: [],
      headerBoilerplateSignals: [],
      nestedStructureSignals: [],
      samplePaths: [],
      rawFieldCount: 5,
    },
    mappingObservations: [
      {
        sourcePaths: ['/FpML/trade/tradeHeader/tradeDate'],
        targetPaths: ['$.trade.tradeDate.value'],
        classification: 'normalized' as const,
        mappingNote: 'Trade date normalization appears repeatedly.',
        confidence: 'high' as const,
        whyNote: 'Dates are normalized.',
      },
    ],
    transformations: [
      {
        type: 'normalization' as const,
        sourcePaths: ['/FpML/trade/tradeHeader/tradeDate'],
        targetPaths: ['$.trade.tradeDate.value'],
        transformationNote: 'Timezone trimming is applied repeatedly.',
        confidence: 'high' as const,
      },
    ],
    enrichments: [],
    openQuestions: [],
    pairHighlight: {
      fpmlFile: `fx-derivatives/fx-ex${padded}.xml`,
      cdmFile: `fx-derivatives/fx-ex${padded}.json`,
      mainFpmlSections: 'trade',
      mainCdmSections: 'trade',
      importantMappings: ['Trade date normalization appears repeatedly.'],
      importantTransformation: 'Dates are normalized.',
      uncertainty: [],
    },
    semanticRecovery: 'full' as const,
  }
}

describe('renderDraftMarkdown', () => {
  it('renders the fixed markdown template sections', () => {
    const markdown = renderDraftMarkdown({ artifact })
    expect(markdown).toContain('# Agent Mapping Playbook: fx-derivatives')
    expect(markdown).toContain('### 6.3 Tentative and emerging signals')
    expect(markdown).toContain('## 7. Agent Playbook')
    expect(markdown).toContain('## 11. Source Appendix')
    expect(markdown).toContain('`fx-derivatives/fx-ex01.xml` -> `fx-derivatives/fx-ex01.json` (`exact`)')
  })

  it('curates large worked-example sections in markdown while keeping the JSON complete', () => {
    const manyHighlights = Array.from({ length: 13 }, (_, index) => ({
      ...artifact.synthesis!.pairLevelHighlights[0]!,
      fpmlFile: `fx-derivatives/fx-ex${String(index + 1).padStart(2, '0')}.xml`,
      cdmFile: `fx-derivatives/fx-ex${String(index + 1).padStart(2, '0')}.json`,
    }))
    const markdown = renderDraftMarkdown({
      artifact: {
        ...artifact,
        synthesis: {
          ...artifact.synthesis!,
          pairLevelHighlights: manyHighlights,
        },
      },
    })

    expect(markdown).toContain('Showing the top `10` worked examples')
    expect(markdown.match(/### `fx-derivatives\/fx-ex/g)?.length).toBe(10)
  })
})

describe('buildFallbackSynthesis', () => {
  it('derives tentative repeated signals from repeated pair-level observations', () => {
    const pairAnalysis = {
      pair: {
        folder: 'fx-derivatives',
        fpmlRelativePath: 'fx-derivatives/fx-ex01.xml',
        cdmRelativePath: 'fx-derivatives/fx-ex01.json',
        fpmlAbsolutePath: 'C:/repo/data_to_learn_from/fpml/fx-derivatives/fx-ex01.xml',
        cdmAbsolutePath: 'C:/repo/data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01.json',
        pairingStrategy: 'exact' as const,
      },
      status: 'success' as const,
      productOrTradeFamily: 'fx-derivatives',
      fpmlSummary: {
        format: 'xml' as const,
        root: 'FpML',
        topLevelSections: ['header', 'trade'],
        structuralNotes: [],
        headerBoilerplateSignals: [],
        nestedStructureSignals: [],
        samplePaths: [],
        rawFieldCount: 5,
      },
      cdmSummary: {
        format: 'json' as const,
        root: '$',
        topLevelSections: ['trade'],
        structuralNotes: [],
        headerBoilerplateSignals: [],
        nestedStructureSignals: [],
        samplePaths: [],
        rawFieldCount: 5,
      },
      mappingObservations: [
        {
          sourcePaths: ['/FpML/trade/tradeHeader/tradeDate'],
          targetPaths: ['$.trade.tradeDate.value'],
          classification: 'normalized' as const,
          mappingNote: 'Trade date normalization appears repeatedly.',
          confidence: 'high' as const,
          whyNote: 'Dates are normalized.',
        },
      ],
      transformations: [],
      enrichments: [],
      openQuestions: [],
      pairHighlight: {
        fpmlFile: 'fx-derivatives/fx-ex01.xml',
        cdmFile: 'fx-derivatives/fx-ex01.json',
        mainFpmlSections: 'header, trade',
        mainCdmSections: 'trade',
        importantMappings: ['Trade date normalization appears repeatedly.'],
        importantTransformation: 'Dates are normalized.',
        uncertainty: [],
      },
      semanticRecovery: 'full' as const,
    }

    const synthesis = buildFallbackSynthesis({
      folder: 'fx-derivatives',
      allPairAnalyses: [
        pairAnalysis,
        {
          ...pairAnalysis,
          pair: {
            ...pairAnalysis.pair,
            fpmlRelativePath: 'fx-derivatives/fx-ex02.xml',
            cdmRelativePath: 'fx-derivatives/fx-ex02.json',
          },
          pairHighlight: {
            ...pairAnalysis.pairHighlight,
            fpmlFile: 'fx-derivatives/fx-ex02.xml',
            cdmFile: 'fx-derivatives/fx-ex02.json',
          },
        },
      ],
      semanticPairAnalyses: [
        pairAnalysis,
        {
          ...pairAnalysis,
          pair: {
            ...pairAnalysis.pair,
            fpmlRelativePath: 'fx-derivatives/fx-ex02.xml',
            cdmRelativePath: 'fx-derivatives/fx-ex02.json',
          },
          pairHighlight: {
            ...pairAnalysis.pairHighlight,
            fpmlFile: 'fx-derivatives/fx-ex02.xml',
            cdmFile: 'fx-derivatives/fx-ex02.json',
          },
        },
      ],
      selection: artifact.selection,
    })

    expect(synthesis.tentativeRepeatedPatterns.length).toBeGreaterThan(0)
    expect(synthesis.folderLevelPrinciples.some(line => /normalize/i.test(line))).toBe(true)
  })
})

describe('synthesizeDraftFolder', () => {
  it('retries once when the first synthesis response is truncated', async () => {
    const semanticPairAnalysis = {
      pair: {
        folder: 'fx-derivatives',
        fpmlRelativePath: 'fx-derivatives/fx-ex01.xml',
        cdmRelativePath: 'fx-derivatives/fx-ex01.json',
        fpmlAbsolutePath: 'C:/repo/data_to_learn_from/fpml/fx-derivatives/fx-ex01.xml',
        cdmAbsolutePath: 'C:/repo/data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01.json',
        pairingStrategy: 'exact' as const,
      },
      status: 'success' as const,
      productOrTradeFamily: 'fx-derivatives',
      fpmlSummary: {
        format: 'xml' as const,
        root: 'FpML',
        topLevelSections: ['trade'],
        structuralNotes: [],
        headerBoilerplateSignals: [],
        nestedStructureSignals: [],
        samplePaths: [],
        rawFieldCount: 5,
      },
      cdmSummary: {
        format: 'json' as const,
        root: '$',
        topLevelSections: ['trade'],
        structuralNotes: [],
        headerBoilerplateSignals: [],
        nestedStructureSignals: [],
        samplePaths: [],
        rawFieldCount: 5,
      },
      mappingObservations: [
        {
          sourcePaths: ['/FpML/trade/tradeHeader/tradeDate'],
          targetPaths: ['$.trade.tradeDate.value'],
          classification: 'normalized' as const,
          mappingNote: 'Trade date normalization appears repeatedly.',
          confidence: 'high' as const,
          whyNote: 'Dates are normalized.',
        },
      ],
      transformations: [],
      enrichments: [],
      openQuestions: [],
      pairHighlight: {
        fpmlFile: 'fx-derivatives/fx-ex01.xml',
        cdmFile: 'fx-derivatives/fx-ex01.json',
        mainFpmlSections: 'trade',
        mainCdmSections: 'trade',
        importantMappings: ['Trade date normalization appears repeatedly.'],
        importantTransformation: 'Dates are normalized.',
        uncertainty: [],
      },
      semanticRecovery: 'full' as const,
    }

    const llm = new QueueMockLLM([
      {
        content: '{"stableMappingPatterns": [',
      },
      {
        content: JSON.stringify({
          stableMappingPatterns: [
            {
              id: 'RULE-001',
              name: 'Trade date normalization',
              strength: 'moderate recurring pattern',
              evidenceCount: 2,
              sourcePattern: '/FpML/trade/tradeHeader/tradeDate',
              targetPattern: '$.trade.tradeDate.value',
              explanation: 'Trade date normalizes into CDM tradeDate.',
              whyItWorksThisWay: 'CDM keeps date-only values.',
              exampleFiles: ['fx-derivatives/fx-ex01.xml'],
              caveats: [],
            },
          ],
          repeatedNonLiteralTransformations: [],
          folderLevelPrinciples: ['Trade dates normalize into date-only values.'],
          variantsAndExceptions: [],
          suspectedEnrichmentOrDefaultBehavior: [],
          openQuestions: [],
          draftConclusion: {
            mostReusableFindings: ['Trade date normalization'],
            safeToGeneralize: ['Trade date normalization.'],
            remainTentative: [],
          },
        }),
      },
    ])

    const result = await synthesizeDraftFolder({
      folder: 'fx-derivatives',
      allPairAnalyses: [semanticPairAnalysis],
      semanticPairAnalyses: [semanticPairAnalysis],
      selection: artifact.selection,
      llm,
      maxRetries: 1,
    })

    expect(result.synthesis.stableMappingPatterns).toHaveLength(1)
    expect(result.synthesis.pairLevelHighlights).toHaveLength(1)
    expect(result.diagnostics.failureKind).toBeUndefined()
  })

  it('normalizes contaminated sections and demotes thin stable evidence', async () => {
    const semanticPairAnalyses = Array.from({ length: 10 }, (_, index) => buildPairAnalysis(index + 1))
    const selection = {
      ...artifact.selection,
      includedPairs: semanticPairAnalyses.map(analysis => analysis.pair),
      coverage: {
        ...artifact.selection.coverage,
        totalFpmlFilesInFolder: 10,
        matchedPairsAvailable: 10,
        matchedPairsUsed: 10,
        exactMatches: 10,
        missingCounterparts: 0,
      },
      missingExamples: [],
    }
    const llm = new QueueMockLLM([
      {
        content: JSON.stringify({
          stableMappingPatterns: [
            {
              id: 'RULE-001',
              name: 'Trade date normalization',
              strength: 'strong recurring pattern',
              evidenceCount: 4,
              sourcePattern: '/FpML/trade/tradeHeader/tradeDate',
              targetPattern: '$.trade.tradeDate.value',
              explanation: 'Trade date normalizes into the CDM tradeDate object.',
              whyItWorksThisWay: 'CDM keeps date-only values.',
              exampleFiles: ['fx-derivatives/fx-ex01.xml', 'fx-derivatives/fx-ex02.xml'],
              caveats: [],
            },
            {
              id: 'RULE-002',
              name: 'Generated/default identifiers',
              strength: 'moderate recurring pattern',
              evidenceCount: 4,
              sourcePattern: '/FpML/trade/party',
              targetPattern: '$.party.partyId.identifier.value',
              explanation: 'Generated/default identifiers appear under party.partyId.identifier.value.',
              whyItWorksThisWay: 'Default party identifiers are added during enrichment.',
              exampleFiles: ['fx-derivatives/fx-ex03.xml', 'fx-derivatives/fx-ex04.xml'],
              caveats: [],
            },
            {
              id: 'RULE-003',
              name: 'Payer receiver role mapping',
              strength: 'moderate recurring pattern',
              evidenceCount: 2,
              sourcePattern: '/FpML/trade/payerPartyReference',
              targetPattern: '$.trade.counterparty',
              explanation: 'Payer and receiver roles map into counterparty structures.',
              whyItWorksThisWay: 'Role references are normalized during conversion.',
              exampleFiles: ['fx-derivatives/fx-ex05.xml', 'fx-derivatives/fx-ex06.xml'],
              caveats: [],
            },
          ],
          repeatedNonLiteralTransformations: [
            {
              id: 'TR-001',
              name: 'Timezone trimming',
              type: 'normalization',
              description: 'Timezone trimming removes trailing time suffixes.',
              sourceSide: '/FpML/trade/tradeHeader/tradeDate',
              targetSide: '$.trade.tradeDate.value',
              evidenceCount: 3,
              exampleFiles: ['fx-derivatives/fx-ex01.xml', 'fx-derivatives/fx-ex02.xml'],
              notes: [],
            },
            {
              id: 'TR-002',
              name: 'Generated global keys',
              type: 'enrichment',
              description: 'meta.globalKey defaults and generated keys are added.',
              sourceSide: '/FpML/trade',
              targetSide: '$.meta.globalKey',
              evidenceCount: 3,
              exampleFiles: ['fx-derivatives/fx-ex03.xml', 'fx-derivatives/fx-ex04.xml'],
              notes: [],
            },
          ],
          folderLevelPrinciples: ['Trade dates normalize consistently before product-specific mapping.'],
          variantsAndExceptions: [],
          suspectedEnrichmentOrDefaultBehavior: [
            {
              id: 'ENR-001',
              name: 'Timezone trimming as normalization',
              description: 'Timezone trimming is a normalization applied to date-like fields.',
              classification: 'normalization',
              evidence: ['fx-derivatives/fx-ex07.xml', 'fx-derivatives/fx-ex08.xml'],
              caution: [],
            },
          ],
          openQuestions: [],
          draftConclusion: {
            mostReusableFindings: ['Trade date normalization'],
            safeToGeneralize: ['Trade date normalization.'],
            remainTentative: [],
          },
        }),
      },
    ])

    const result = await synthesizeDraftFolder({
      folder: 'fx-derivatives',
      allPairAnalyses: semanticPairAnalyses,
      semanticPairAnalyses,
      selection,
      llm,
      maxRetries: 0,
    })

    expect(result.synthesis.stableMappingPatterns.map(rule => rule.name)).toEqual(['Trade date normalization'])
    expect(result.synthesis.repeatedNonLiteralTransformations.map(item => item.name)).toEqual([
      'Timezone trimming',
      'Timezone trimming as normalization',
    ])
    expect(result.synthesis.suspectedEnrichmentOrDefaultBehavior.map(item => item.name)).toEqual(
      expect.arrayContaining(['Generated/default identifiers', 'Generated global keys'])
    )
    expect(result.synthesis.tentativeRepeatedPatterns.some(item => /Payer and receiver roles map/i.test(item.description))).toBe(
      true
    )
    expect(result.synthesis.suspectedEnrichmentOrDefaultBehavior[0]?.id).toBe('ENR-001')
    expect(result.synthesis.repeatedNonLiteralTransformations[0]?.id).toBe('TR-001')
  })
})
