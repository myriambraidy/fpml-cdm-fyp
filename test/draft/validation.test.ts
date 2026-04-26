import { describe, expect, it } from 'bun:test'
import {
  assessDraftRolloutReadiness,
  computeDraftQualityAssessment,
  decideDraftPublication,
  validateDraftSynthesisIntegrity,
} from '../../src/draft/validation'
import type { DraftFolderSynthesis, DraftPairAnalysis } from '../../src/draft/types'

const successfulPairAnalysis: DraftPairAnalysis = {
  pair: {
    folder: 'fx-derivatives',
    fpmlRelativePath: 'fx-derivatives/fx-ex01.xml',
    cdmRelativePath: 'fx-derivatives/fx-ex01.json',
    fpmlAbsolutePath: 'C:/repo/data_to_learn_from/fpml/fx-derivatives/fx-ex01.xml',
    cdmAbsolutePath: 'C:/repo/data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01.json',
    pairingStrategy: 'exact',
  },
  status: 'success',
  productOrTradeFamily: 'fx-derivatives',
  fpmlSummary: {
    format: 'xml',
    root: 'FpML',
    topLevelSections: ['header', 'trade', 'party'],
    structuralNotes: [],
    headerBoilerplateSignals: [],
    nestedStructureSignals: [],
    samplePaths: [],
    rawFieldCount: 10,
  },
  cdmSummary: {
    format: 'json',
    root: '$',
    topLevelSections: ['trade', 'meta'],
    structuralNotes: [],
    headerBoilerplateSignals: [],
    nestedStructureSignals: [],
    samplePaths: [],
    rawFieldCount: 10,
  },
  mappingObservations: [],
  transformations: [],
  enrichments: [],
  openQuestions: [],
  pairHighlight: {
    fpmlFile: 'fx-derivatives/fx-ex01.xml',
    cdmFile: 'fx-derivatives/fx-ex01.json',
    mainFpmlSections: 'header, trade, party',
    mainCdmSections: 'trade, meta',
    importantMappings: ['Trade date maps to tradeDate.'],
    importantTransformation: 'Amounts are reshaped into quantity structures.',
    uncertainty: [],
  },
  semanticRecovery: 'full',
}

const synthesis: DraftFolderSynthesis = {
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
    headerAndBoilerplate: [],
    topLevelSections: [],
    nestedStructures: [],
    optionalSections: [],
  },
  repeatedCdmStructure: {
    topLevelSections: [],
    wrappersAndScaffolding: [],
    optionalSections: [],
  },
  stableMappingPatterns: [
    {
      id: 'DRAFT-001',
      name: 'Trade date mapping',
      strength: 'strong recurring pattern',
      evidenceCount: 2,
      sourcePattern: '/FpML/trade/tradeHeader/tradeDate',
      targetPattern: '$.trade.tradeDate',
      explanation: 'Trade date is normalized into the CDM tradeDate object.',
      whyItWorksThisWay: 'CDM models trade dates in a typed object wrapper.',
      exampleFiles: ['fx-derivatives/fx-ex01.xml'],
      caveats: [],
    },
  ],
  repeatedNonLiteralTransformations: [],
  tentativeRepeatedPatterns: [],
  folderLevelPrinciples: ['Trade dates and cash amounts are normalized into CDM objects.'],
  variantsAndExceptions: [],
  suspectedEnrichmentOrDefaultBehavior: [],
  repeatedHeaderAndCommonBoilerplateSummary: {
    commonFpmlHeaderBehavior: [],
    commonTradeScaffolding: [],
    commonCdmBoilerplateBehavior: [],
  },
  openQuestions: [],
  pairLevelHighlights: [
    {
      fpmlFile: 'fx-derivatives/fx-ex01.xml',
      cdmFile: 'fx-derivatives/fx-ex01.json',
      mainFpmlSections: 'header, trade, party',
      mainCdmSections: 'trade, meta',
      importantMappings: ['Trade date maps to tradeDate.'],
      importantTransformation: 'Amounts are reshaped into quantity structures.',
      uncertainty: [],
    },
  ],
  agentPlaybook: {
    summary: 'Use deterministic structure plus semantic evidence.',
    canonicalSteps: ['Map identifiers before product economics.'],
    recurringRules: ['Trade date normalizes into tradeDate.'],
    transformationPatterns: ['Amounts are reshaped into quantity structures.'],
    productSpecificBranches: [],
    validationChecks: ['Check enriched identifiers carefully.'],
    doNotAssume: ['Do not assume every metadata field is source-backed.'],
  },
  draftConclusion: {
    mostReusableFindings: ['Trade dates normalize cleanly into CDM date objects.'],
    safeToGeneralize: ['Trade date normalization.'],
    remainTentative: [],
  },
  sourceAppendixNotes: [],
}

describe('validateDraftSynthesisIntegrity', () => {
  it('accepts synthesis that only references included examples', () => {
    const result = validateDraftSynthesisIntegrity({
      synthesis,
      successfulPairAnalyses: [successfulPairAnalysis],
    })

    expect(result.ok).toBe(true)
    expect(result.issues).toHaveLength(0)
  })

  it('rejects invented example references', () => {
    const bad = {
      ...synthesis,
      pairLevelHighlights: [
        {
          ...synthesis.pairLevelHighlights[0]!,
          fpmlFile: 'invented-example.xml',
        },
      ],
    }

    const result = validateDraftSynthesisIntegrity({
      synthesis: bad,
      successfulPairAnalyses: [successfulPairAnalysis],
    })

    expect(result.ok).toBe(false)
    expect(result.issues[0]?.kind).toBe('unexpected_pair_highlight')
  })
})

describe('decideDraftPublication', () => {
  it('publishes only when integrity passes and semantic evidence exists', () => {
    const decision = decideDraftPublication({
      llmEnabled: true,
      successfulPairCount: 1,
      failedPairCount: 0,
      synthesis,
      integrity: { ok: true, issues: [] },
      includedPairCount: 1,
    })

    expect(decision.status).toBe('success')
    expect(decision.publishFinal).toBe(true)
  })

  it('downgrades generic fallback principles to partial output', () => {
    const decision = decideDraftPublication({
      llmEnabled: true,
      successfulPairCount: 2,
      failedPairCount: 1,
      synthesis: {
        ...synthesis,
        stableMappingPatterns: [],
        repeatedNonLiteralTransformations: [],
        variantsAndExceptions: [],
        suspectedEnrichmentOrDefaultBehavior: [],
        folderLevelPrinciples: [
          'Generalize only from repeated semantic evidence; use structural repetition only for scaffolding.',
        ],
        pairLevelHighlights: [],
      },
      integrity: { ok: true, issues: [] },
      includedPairCount: 3,
    })

    expect(decision.status).toBe('partial_success')
    expect(decision.publishFinal).toBe(false)
  })

  it('allows several meaningful pair highlights to publish a final draft', () => {
    const highlight = synthesis.pairLevelHighlights[0]!
    const decision = decideDraftPublication({
      llmEnabled: true,
      successfulPairCount: 3,
      failedPairCount: 0,
      synthesis: {
        ...synthesis,
        stableMappingPatterns: [],
        repeatedNonLiteralTransformations: [],
        variantsAndExceptions: [],
        suspectedEnrichmentOrDefaultBehavior: [],
        folderLevelPrinciples: [],
        pairLevelHighlights: [
          highlight,
          {
            ...highlight,
            fpmlFile: 'fx-derivatives/fx-ex02.xml',
            cdmFile: 'fx-derivatives/fx-ex02.json',
          },
          {
            ...highlight,
            fpmlFile: 'fx-derivatives/fx-ex03.xml',
            cdmFile: 'fx-derivatives/fx-ex03.json',
          },
        ],
      },
      integrity: { ok: true, issues: [] },
      includedPairCount: 3,
    })

    expect(decision.status).toBe('success')
    expect(decision.publishFinal).toBe(true)
  })

  it('keeps deterministic-only runs as partial output', () => {
    const decision = decideDraftPublication({
      llmEnabled: false,
      successfulPairCount: 0,
      failedPairCount: 1,
      synthesis,
      integrity: { ok: true, issues: [] },
      includedPairCount: 1,
    })

    expect(decision.status).toBe('deterministic_only')
    expect(decision.publishFinal).toBe(false)
  })
})

describe('computeDraftQualityAssessment', () => {
  it('scores a fallback-heavy draft as fair-or-below and blocks broad rollout', () => {
    const quality = computeDraftQualityAssessment({
      synthesis: {
        ...synthesis,
        evidenceCoverage: {
          ...synthesis.evidenceCoverage,
          matchedPairCount: 5,
          semanticPairCount: 3,
          fullSemanticPairCount: 0,
          salvagedSemanticPairCount: 3,
        },
        stableMappingPatterns: [
          {
            ...synthesis.stableMappingPatterns[0]!,
          },
        ],
        repeatedNonLiteralTransformations: [],
        tentativeRepeatedPatterns: [
          {
            id: 'TENT-001',
            kind: 'mapping',
            strength: 'moderate recurring pattern',
            description: 'Date-like fields repeatedly normalize into CDM date values.',
            evidenceCount: 2,
            exampleFiles: ['fx-derivatives/fx-ex01.xml', 'fx-derivatives/fx-ex02.xml'],
            notes: ['Recovered from repeated observations.'],
          },
        ],
        pairLevelHighlights: [
          {
            ...synthesis.pairLevelHighlights[0]!,
            uncertainty: ['Recovered partial semantic evidence; transformation details are incomplete.'],
          },
        ],
      },
      successfulPairCount: 3,
      includedPairCount: 5,
      integrity: { ok: true, issues: [] },
      synthesisDiagnostics: {
        failureKind: 'parse_error',
      },
    })

    const rollout = assessDraftRolloutReadiness({
      qualityAssessment: quality,
    })

    expect(quality.rating === 'poor' || quality.rating === 'weak' || quality.rating === 'fair').toBe(true)
    expect(quality.metrics.synthesisReliability).toBe('salvaged')
    expect(quality.metrics.openQuestionDensity).toBe(0)
    expect(rollout.readyForBroadRollout).toBe(false)
  })

  it('marks a strong clean draft as ready for broader rollout', () => {
    const quality = computeDraftQualityAssessment({
      synthesis: {
        ...synthesis,
        evidenceCoverage: {
          ...synthesis.evidenceCoverage,
          matchedPairCount: 5,
          semanticPairCount: 5,
          fullSemanticPairCount: 5,
          salvagedSemanticPairCount: 0,
        },
        stableMappingPatterns: [
          {
            ...synthesis.stableMappingPatterns[0]!,
            evidenceCount: 4,
          },
          {
            ...synthesis.stableMappingPatterns[0]!,
            id: 'DRAFT-002',
            name: 'Party identifier mapping',
            evidenceCount: 4,
            sourcePattern: '/FpML/trade/tradeHeader/partyTradeIdentifier/tradeId',
            targetPattern: '$.trade.tradeIdentifier[].assignedIdentifier[].identifier.value',
          },
          {
            ...synthesis.stableMappingPatterns[0]!,
            id: 'DRAFT-003',
            name: 'Settlement date mapping',
            evidenceCount: 4,
            sourcePattern: '/FpML/trade/valueDate',
            targetPattern: '$.trade.settlementTerms.valueDate.value',
          },
          {
            ...synthesis.stableMappingPatterns[0]!,
            id: 'DRAFT-004',
            name: 'Settlement currency mapping',
            evidenceCount: 4,
            sourcePattern: '/FpML/trade/exchangedCurrency1',
            targetPattern: '$.trade.settlementTerms.currency.value',
          },
        ],
        repeatedNonLiteralTransformations: [
          {
            id: 'TR-001',
            name: 'Date normalization',
            type: 'normalization',
            description: 'Dates lose the trailing time wrapper.',
            sourceSide: '/FpML/trade/tradeHeader/tradeDate',
            targetSide: '$.trade.tradeDate.value',
            evidenceCount: 3,
            exampleFiles: ['fx-derivatives/fx-ex01.xml'],
            notes: [],
          },
          {
            id: 'TR-002',
            name: 'Reference resolution',
            type: 'reference resolution',
            description: 'Party references become embedded identifier structures.',
            sourceSide: '/FpML/trade/partyReference',
            targetSide: '$.trade.counterparty',
            evidenceCount: 3,
            exampleFiles: ['fx-derivatives/fx-ex02.xml'],
            notes: [],
          },
        ],
        tentativeRepeatedPatterns: [
          {
            id: 'TENT-001',
            kind: 'mapping',
            strength: 'strong recurring pattern',
            description: 'Date-like fields repeatedly normalize into CDM date values.',
            evidenceCount: 4,
            exampleFiles: ['fx-derivatives/fx-ex01.xml', 'fx-derivatives/fx-ex02.xml'],
            notes: [],
          },
          {
            id: 'TENT-002',
            kind: 'transformation',
            strength: 'moderate recurring pattern',
            description: 'Reference resolution repeatedly converts party references into identifier objects.',
            evidenceCount: 3,
            exampleFiles: ['fx-derivatives/fx-ex02.xml', 'fx-derivatives/fx-ex03.xml'],
            notes: [],
          },
        ],
        pairLevelHighlights: [
          synthesis.pairLevelHighlights[0]!,
          {
            ...synthesis.pairLevelHighlights[0]!,
            fpmlFile: 'fx-derivatives/fx-ex02.xml',
            cdmFile: 'fx-derivatives/fx-ex02.json',
          },
          {
            ...synthesis.pairLevelHighlights[0]!,
            fpmlFile: 'fx-derivatives/fx-ex03.xml',
            cdmFile: 'fx-derivatives/fx-ex03.json',
          },
          {
            ...synthesis.pairLevelHighlights[0]!,
            fpmlFile: 'fx-derivatives/fx-ex04.xml',
            cdmFile: 'fx-derivatives/fx-ex04.json',
          },
        ],
      },
      successfulPairCount: 5,
      includedPairCount: 5,
      integrity: { ok: true, issues: [] },
      synthesisDiagnostics: {},
    })

    const rollout = assessDraftRolloutReadiness({
      qualityAssessment: quality,
    })

    expect(quality.rating === 'good' || quality.rating === 'strong').toBe(true)
    expect(quality.metrics.synthesisReliability).toBe('full')
    expect(quality.metrics.lowEvidenceStableRuleCount).toBeGreaterThanOrEqual(0)
    expect(rollout.decision).toBe('ready')
    expect(rollout.readyForBroadRollout).toBe(true)
  })

  it('downgrades otherwise clean drafts when critical open questions stay high', () => {
    const quality = computeDraftQualityAssessment({
      synthesis: {
        ...synthesis,
        evidenceCoverage: {
          ...synthesis.evidenceCoverage,
          matchedPairCount: 6,
          semanticPairCount: 6,
          fullSemanticPairCount: 6,
        },
        stableMappingPatterns: [
          {
            ...synthesis.stableMappingPatterns[0]!,
            evidenceCount: 3,
          },
          {
            ...synthesis.stableMappingPatterns[0]!,
            id: 'DRAFT-002',
            name: 'Settlement date mapping',
            evidenceCount: 3,
            sourcePattern: '/FpML/trade/valueDate',
            targetPattern: '$.trade.settlementTerms.value',
          },
          {
            ...synthesis.stableMappingPatterns[0]!,
            id: 'DRAFT-003',
            name: 'Currency mapping',
            evidenceCount: 3,
            sourcePattern: '/FpML/trade/exchangedCurrency1',
            targetPattern: '$.trade.priceQuantity.quantity.unit.currency.value',
          },
          {
            ...synthesis.stableMappingPatterns[0]!,
            id: 'DRAFT-004',
            name: 'Payer mapping',
            evidenceCount: 3,
            sourcePattern: '/FpML/trade/payerPartyReference',
            targetPattern: '$.trade.counterparty[0]',
          },
        ],
        repeatedNonLiteralTransformations: [
          {
            id: 'TR-001',
            name: 'Date normalization',
            type: 'normalization',
            description: 'Dates lose the trailing time wrapper.',
            sourceSide: '/FpML/trade/tradeHeader/tradeDate',
            targetSide: '$.trade.tradeDate.value',
            evidenceCount: 3,
            exampleFiles: ['fx-derivatives/fx-ex01.xml'],
            notes: [],
          },
          {
            id: 'TR-002',
            name: 'Reference resolution',
            type: 'reference resolution',
            description: 'Party references become embedded identifier structures.',
            sourceSide: '/FpML/trade/partyReference',
            targetSide: '$.trade.counterparty',
            evidenceCount: 3,
            exampleFiles: ['fx-derivatives/fx-ex02.xml'],
            notes: [],
          },
        ],
        openQuestions: [
          'It is unclear whether payer inversion applies to all bond option variants.',
          'Confirm whether generated identifiers are defaults or source-backed values.',
          'Validate whether settlement date mapping depends on exercise style.',
        ],
      },
      successfulPairCount: 6,
      includedPairCount: 6,
      integrity: { ok: true, issues: [] },
      synthesisDiagnostics: {},
    })

    const rollout = assessDraftRolloutReadiness({
      qualityAssessment: quality,
    })

    expect(quality.metrics.criticalAmbiguityCount).toBe(3)
    expect(quality.score).toBeLessThan(8.5)
    expect(rollout.readyForBroadRollout).toBe(false)
  })
})
