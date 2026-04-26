import type {
  DraftArtifacts,
  DraftDebugArtifacts,
  DraftFolderSynthesis,
  DraftPairAnalysis,
  DraftPairSelectionResult,
  DraftRunConfig,
} from '../../src/draft/types'
import type { LoadedDraftFamily } from '../../src/cookbook/types'

export function makePairAnalysis(folder: string): DraftPairAnalysis {
  return {
    pair: {
      folder,
      fpmlRelativePath: `${folder}/ex01.xml`,
      cdmRelativePath: `${folder}/ex01.json`,
      fpmlAbsolutePath: `C:/repo/fpml/${folder}/ex01.xml`,
      cdmAbsolutePath: `C:/repo/cdm/${folder}/ex01.json`,
      pairingStrategy: 'exact',
    },
    status: 'success',
    productOrTradeFamily: folder,
    fpmlSummary: {
      format: 'xml',
      root: 'FpML',
      topLevelSections: ['header', 'trade', 'party'],
      structuralNotes: [],
      headerBoilerplateSignals: [],
      nestedStructureSignals: ['trade > product'],
      samplePaths: ['/FpML/trade/tradeHeader/tradeId'],
      rawFieldCount: 10,
    },
    cdmSummary: {
      format: 'json',
      root: '$',
      topLevelSections: ['trade', 'meta'],
      structuralNotes: [],
      headerBoilerplateSignals: [],
      nestedStructureSignals: ['trade > tradeIdentifier'],
      samplePaths: ['trade.tradeIdentifier.assignedIdentifier'],
      rawFieldCount: 10,
    },
    mappingObservations: [],
    transformations: [],
    enrichments: [],
    openQuestions: [],
    pairHighlight: {
      fpmlFile: `${folder}/ex01.xml`,
      cdmFile: `${folder}/ex01.json`,
      mainFpmlSections: 'header, trade, party',
      mainCdmSections: 'trade, meta',
      importantMappings: ['tradeId maps to assignedIdentifier.value.'],
      importantTransformation: 'Date values are normalized.',
      uncertainty: [],
    },
    semanticRecovery: 'full',
  }
}

export function makeSynthesis(folder: string, semanticPairs = 5): DraftFolderSynthesis {
  return {
    folder,
    evidenceCoverage: {
      matchedPairCount: semanticPairs,
      structuralPairCount: semanticPairs,
      semanticPairCount: semanticPairs,
      fullSemanticPairCount: semanticPairs,
      salvagedSemanticPairCount: 0,
      failedSemanticPairCount: 0,
      structuralBasisNote: 'Structural summaries are computed from matched pairs.',
      semanticBasisNote: 'Semantic rules are computed from successful pair analyses.',
    },
    repeatedFpmlStructure: {
      headerAndBoilerplate: ['/FpML/header/messageId'],
      topLevelSections: [
        { section: 'header', count: semanticPairs, total: semanticPairs },
        { section: 'trade', count: semanticPairs, total: semanticPairs },
      ],
      nestedStructures: ['trade > product'],
      optionalSections: [],
    },
    repeatedCdmStructure: {
      topLevelSections: [
        { section: 'trade', count: semanticPairs, total: semanticPairs },
        { section: 'meta', count: semanticPairs, total: semanticPairs },
      ],
      wrappersAndScaffolding: ['trade > tradeIdentifier'],
      optionalSections: [],
    },
    stableMappingPatterns: [
      {
        id: 'RULE-001',
        name: 'Trade identifier preservation',
        strength: 'strong recurring pattern',
        evidenceCount: semanticPairs,
        sourcePattern: 'tradeHeader.partyTradeIdentifier.tradeId',
        targetPattern: 'trade.tradeIdentifier.assignedIdentifier.identifier.value',
        explanation: 'Copy FpML trade identifiers into CDM assigned identifiers.',
        whyItWorksThisWay: 'Trade identifiers preserve traceability to the source trade.',
        exampleFiles: [`${folder}/ex01.xml`],
        caveats: [],
      },
    ],
    repeatedNonLiteralTransformations: [
      {
        id: 'TR-001',
        name: 'Date normalization',
        type: 'normalization',
        description: 'Normalize FPML dateTime values into CDM date-only values.',
        sourceSide: 'tradeHeader.tradeDate',
        targetSide: 'trade.tradeDate.value',
        evidenceCount: semanticPairs,
        exampleFiles: [`${folder}/ex01.xml`],
        notes: [],
      },
    ],
    tentativeRepeatedPatterns: [],
    folderLevelPrinciples: ['Preserve identifiers and normalize dates before mapping economics.'],
    variantsAndExceptions: [],
    suspectedEnrichmentOrDefaultBehavior: [],
    repeatedHeaderAndCommonBoilerplateSummary: {
      commonFpmlHeaderBehavior: ['/FpML/header/messageId'],
      commonTradeScaffolding: ['/FpML/trade/tradeHeader'],
      commonCdmBoilerplateBehavior: ['trade.meta'],
    },
    openQuestions: [],
    pairLevelHighlights: [
      {
        fpmlFile: `${folder}/ex01.xml`,
        cdmFile: `${folder}/ex01.json`,
        mainFpmlSections: 'header, trade, party',
        mainCdmSections: 'trade, meta',
        importantMappings: ['tradeId maps to assignedIdentifier.value.'],
        importantTransformation: 'Date values are normalized.',
        uncertainty: [],
      },
    ],
    agentPlaybook: {
      summary: 'Map identifiers first, then dates and product economics.',
      canonicalSteps: ['Map identifiers.', 'Normalize dates.', 'Validate the CDM proposal.'],
      recurringRules: ['Trade identifiers are preserved.'],
      transformationPatterns: ['DateTime values become date-only values.'],
      productSpecificBranches: [],
      validationChecks: ['Confirm every mapped value has source evidence.'],
      doNotAssume: ['Do not invent identifiers.'],
    },
    draftConclusion: {
      mostReusableFindings: ['Identifiers are preserved.'],
      safeToGeneralize: ['Trade identifier preservation.'],
      remainTentative: [],
    },
    sourceAppendixNotes: [],
  }
}

export function makeLoadedFamily(args: {
  folder?: string
  semanticPairs?: number
  qualityRating?: DraftDebugArtifacts['qualityAssessment']['rating']
  publicationFinal?: boolean
  integrityOk?: boolean
  synthesisReliability?: DraftDebugArtifacts['qualityAssessment']['metrics']['synthesisReliability']
} = {}): LoadedDraftFamily {
  const folder = args.folder ?? 'fx-derivatives'
  const semanticPairs = args.semanticPairs ?? 5
  const config = makeConfig(folder)
  const selection = makeSelection(folder, semanticPairs)
  const pairAnalyses = Array.from({ length: semanticPairs }, () => makePairAnalysis(folder))
  const synthesis = makeSynthesis(folder, semanticPairs)
  const artifact: DraftArtifacts = {
    generatedAt: '2026-04-26T00:00:00.000Z',
    config,
    selection,
    pairAnalyses,
    synthesis,
  }
  const debug: DraftDebugArtifacts = {
    generatedAt: artifact.generatedAt,
    config,
    selection,
    pairAnalyses,
    successfulPairCount: semanticPairs,
    failedPairCount: 0,
    synthesis,
    integrity: {
      ok: args.integrityOk ?? true,
      issues: [],
    },
    publication: {
      status: (args.publicationFinal ?? true) ? 'success' : 'failed_integrity_validation',
      publishFinal: args.publicationFinal ?? true,
      reasons: [],
    },
    qualityAssessment: {
      score: 9,
      rating: args.qualityRating ?? 'strong',
      reasons: [],
      metrics: {
        semanticSuccessRate: 1,
        fullParseRate: 1,
        stableRuleCount: 1,
        repeatedTransformationCount: 1,
        tentativePatternCount: 0,
        placeholderHighlightRate: 0,
        openQuestionCount: 0,
        openQuestionDensity: 0,
        criticalAmbiguityCount: 0,
        lowEvidenceStableRuleCount: 0,
        lowEvidenceTransformationCount: 0,
        synthesisReliability: args.synthesisReliability ?? 'full',
      },
    },
    rolloutReadiness: {
      decision: 'pilot_only',
      readyForBroadRollout: false,
      reasons: [],
    },
    runLog: [],
  }

  return {
    folder,
    draftPath: `C:/repo/data/drafts/${folder}/draft.json`,
    debugPath: `C:/repo/data/drafts/${folder}/debug.json`,
    artifact,
    debug,
  }
}

function makeConfig(folder: string): DraftRunConfig {
  return {
    workspaceRoot: 'C:/repo',
    fpmlRoot: 'C:/repo/fpml',
    cdmRoot: 'C:/repo/cdm',
    outputRoot: 'C:/repo/data/drafts',
    folder,
  }
}

function makeSelection(folder: string, count: number): DraftPairSelectionResult {
  return {
    manifestPath: 'C:/repo/cdm/manifest.json',
    folder,
    includedPairs: Array.from({ length: count }, () => ({
      folder,
      fpmlRelativePath: `${folder}/ex01.xml`,
      cdmRelativePath: `${folder}/ex01.json`,
      fpmlAbsolutePath: `C:/repo/fpml/${folder}/ex01.xml`,
      cdmAbsolutePath: `C:/repo/cdm/${folder}/ex01.json`,
      pairingStrategy: 'exact',
    })),
    missingExamples: [],
    ignoredExamples: [],
    coverage: {
      totalFpmlFilesInFolder: count,
      matchedPairsAvailable: count,
      matchedPairsUsed: count,
      missingCounterparts: 0,
      ignoredPairs: 0,
      exactMatches: count,
      normalizedMatches: 0,
      aliasMatches: 0,
    },
  }
}
