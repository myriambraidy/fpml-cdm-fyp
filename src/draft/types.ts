export type PairingStrategy = 'exact' | 'normalized' | 'alias'

export interface DraftRunConfig {
  workspaceRoot: string
  fpmlRoot: string
  cdmRoot: string
  outputRoot: string
  folder: string
  maxPairs?: number
  pairConcurrency?: number
  pairMaxRetries?: number
  synthesisMaxRetries?: number
  model?: string
  synthesisModel?: string
  pairMaxTokens?: number
  synthesisMaxTokens?: number
  storeFailedRawResponses?: boolean
}

export type DraftRunStatus =
  | 'success'
  | 'partial_success'
  | 'failed_pair_analysis'
  | 'failed_synthesis'
  | 'failed_integrity_validation'
  | 'deterministic_only'

export interface DraftManifestEntry {
  fpmlRelativePath: string
  cdmRelativePath: string | null
  sourceBaseName: string | null
  strategy: PairingStrategy | 'missing'
  status: 'matched' | 'missing'
}

export interface DraftManifestSummaryByCategory {
  total: number
  matched: number
  missing: number
}

export interface DraftManifest {
  generatedAt: string
  sourceRoots: {
    fpml: string
    cdmIngestOutput: string
    curatedOutput: string
  }
  notes: string[]
  summary: {
    totalFpmlFiles: number
    totalCdmCandidates: number
    matchedFiles: number
    missingFiles: number
    byStrategy: Record<string, number>
    byCategory: Record<string, DraftManifestSummaryByCategory>
  }
  entries: DraftManifestEntry[]
}

export interface DraftPair {
  folder: string
  fpmlRelativePath: string
  cdmRelativePath: string
  fpmlAbsolutePath: string
  cdmAbsolutePath: string
  pairingStrategy: PairingStrategy
}

export interface DraftIgnoredExample {
  fpmlRelativePath: string
  cdmRelativePath?: string
  reason: string
  strategy?: PairingStrategy | 'missing'
}

export interface DraftCoverageSummary {
  totalFpmlFilesInFolder: number
  matchedPairsAvailable: number
  matchedPairsUsed: number
  missingCounterparts: number
  ignoredPairs: number
  exactMatches: number
  normalizedMatches: number
  aliasMatches: number
}

export interface DraftPairSelectionResult {
  manifestPath: string
  folder: string
  includedPairs: DraftPair[]
  missingExamples: string[]
  ignoredExamples: DraftIgnoredExample[]
  coverage: DraftCoverageSummary
}

export interface DocumentSectionFrequency {
  section: string
  count: number
  total: number
}

export interface PairDocumentSummary {
  format: 'xml' | 'json'
  root: string
  topLevelSections: string[]
  structuralNotes: string[]
  headerBoilerplateSignals: string[]
  nestedStructureSignals: string[]
  samplePaths: string[]
  rawFieldCount: number
}

export type ObservationConfidence = 'high' | 'medium' | 'low'

export interface MappingObservation {
  sourcePaths: string[]
  targetPaths: string[]
  classification: 'direct' | 'normalized' | 'enriched' | 'unclear'
  mappingNote: string
  confidence: ObservationConfidence
  whyNote: string
}

export interface TransformationObservation {
  type:
    | 'split'
    | 'merge'
    | 'normalization'
    | 'reference_resolution'
    | 'enrichment'
    | 'wrapper_insertion'
    | 'nesting_change'
  sourcePaths: string[]
  targetPaths: string[]
  transformationNote: string
  confidence: ObservationConfidence
}

export interface EnrichmentObservation {
  targetPaths: string[]
  enrichmentNote: string
  confidence: ObservationConfidence
}

export interface PairHighlight {
  fpmlFile: string
  cdmFile: string
  mainFpmlSections: string
  mainCdmSections: string
  importantMappings: string[]
  importantTransformation: string
  uncertainty: string[]
}

export type SemanticRecoveryMode = 'full' | 'salvaged' | 'none'

export interface DraftPairAnalysis {
  pair: DraftPair
  status: 'success' | 'failed'
  failureReason?: string
  productOrTradeFamily: string
  fpmlSummary: PairDocumentSummary
  cdmSummary: PairDocumentSummary
  mappingObservations: MappingObservation[]
  transformations: TransformationObservation[]
  enrichments: EnrichmentObservation[]
  openQuestions: string[]
  pairHighlight: PairHighlight
  semanticRecovery: SemanticRecoveryMode
  modelUsed?: string
  promptChars?: number
  rawResponseChars?: number
  rawResponsePreview?: string
  rawResponse?: string
  failureKind?: 'request_error' | 'parse_error' | 'llm_disabled'
  truncatedResponseSuspected?: boolean
}

export interface StableMappingRule {
  id: string
  name: string
  strength: 'strong recurring pattern' | 'moderate recurring pattern' | 'weak pattern'
  evidenceCount: number
  sourcePattern: string
  targetPattern: string
  explanation: string
  whyItWorksThisWay: string
  exampleFiles: string[]
  caveats: string[]
}

export interface TransformationSummary {
  id: string
  name: string
  type:
    | 'split'
    | 'merge'
    | 'normalization'
    | 'reference resolution'
    | 'enrichment'
    | 'wrapper insertion'
    | 'nesting change'
  description: string
  sourceSide: string
  targetSide: string
  evidenceCount: number
  exampleFiles: string[]
  notes: string[]
}

export interface VariantSummary {
  id: string
  name: string
  description: string
  seenIn: string[]
  impactOnGeneralization: string
}

export interface EnrichmentSummary {
  id: string
  name: string
  description: string
  classification: 'suspected enrichment' | 'normalization' | 'unclear'
  evidence: string[]
  caution: string[]
}

export interface TentativeRepeatedPattern {
  id: string
  kind: 'mapping' | 'transformation' | 'enrichment'
  strength: 'strong recurring pattern' | 'moderate recurring pattern' | 'weak pattern'
  description: string
  evidenceCount: number
  exampleFiles: string[]
  notes: string[]
}

export interface RepeatedStructureSummary {
  headerAndBoilerplate: string[]
  topLevelSections: DocumentSectionFrequency[]
  nestedStructures: string[]
  optionalSections: DocumentSectionFrequency[]
}

export interface RepeatedCdmStructureSummary {
  topLevelSections: DocumentSectionFrequency[]
  wrappersAndScaffolding: string[]
  optionalSections: DocumentSectionFrequency[]
}

export interface FolderHeaderBoilerplateSummary {
  commonFpmlHeaderBehavior: string[]
  commonTradeScaffolding: string[]
  commonCdmBoilerplateBehavior: string[]
}

export interface DraftConclusion {
  mostReusableFindings: string[]
  safeToGeneralize: string[]
  remainTentative: string[]
}

export interface DraftEvidenceCoverage {
  matchedPairCount: number
  structuralPairCount: number
  semanticPairCount: number
  fullSemanticPairCount: number
  salvagedSemanticPairCount: number
  failedSemanticPairCount: number
  structuralBasisNote: string
  semanticBasisNote: string
}

export interface AgentPlaybookBranch {
  name: string
  whenToUse: string
  sourceSignals: string[]
  mappingFocus: string[]
  cautions: string[]
}

export interface DraftAgentPlaybook {
  summary: string
  canonicalSteps: string[]
  recurringRules: string[]
  transformationPatterns: string[]
  productSpecificBranches: AgentPlaybookBranch[]
  validationChecks: string[]
  doNotAssume: string[]
}

export interface DraftFolderSynthesis {
  folder: string
  evidenceCoverage: DraftEvidenceCoverage
  repeatedFpmlStructure: RepeatedStructureSummary
  repeatedCdmStructure: RepeatedCdmStructureSummary
  stableMappingPatterns: StableMappingRule[]
  repeatedNonLiteralTransformations: TransformationSummary[]
  tentativeRepeatedPatterns: TentativeRepeatedPattern[]
  folderLevelPrinciples: string[]
  variantsAndExceptions: VariantSummary[]
  suspectedEnrichmentOrDefaultBehavior: EnrichmentSummary[]
  repeatedHeaderAndCommonBoilerplateSummary: FolderHeaderBoilerplateSummary
  openQuestions: string[]
  pairLevelHighlights: PairHighlight[]
  agentPlaybook: DraftAgentPlaybook
  draftConclusion: DraftConclusion
  sourceAppendixNotes: string[]
}

export interface DraftArtifacts {
  generatedAt: string
  config: DraftRunConfig
  selection: DraftPairSelectionResult
  pairAnalyses: DraftPairAnalysis[]
  synthesis?: DraftFolderSynthesis
}

export interface DraftLogEntry {
  timestamp: string
  stage:
    | 'run'
    | 'pair_selection'
    | 'pair_analysis'
    | 'synthesis'
    | 'validation'
    | 'publish'
  level: 'info' | 'warn' | 'error'
  message: string
  data?: Record<string, unknown>
}

export interface DraftIntegrityIssue {
  kind:
    | 'unexpected_pair_highlight'
    | 'unexpected_rule_example'
    | 'unexpected_transformation_example'
    | 'unexpected_variant_example'
    | 'unexpected_enrichment_example'
  message: string
  evidence: string
}

export interface DraftIntegrityValidationResult {
  ok: boolean
  issues: DraftIntegrityIssue[]
}

export interface DraftPublicationDecision {
  status: DraftRunStatus
  publishFinal: boolean
  reasons: string[]
}

export interface DraftQualityAssessment {
  score: number
  rating: 'poor' | 'weak' | 'fair' | 'good' | 'strong'
  reasons: string[]
  metrics: {
    semanticSuccessRate: number
    fullParseRate: number
    stableRuleCount: number
    repeatedTransformationCount: number
    tentativePatternCount: number
    placeholderHighlightRate: number
    openQuestionCount: number
    openQuestionDensity: number
    criticalAmbiguityCount: number
    lowEvidenceStableRuleCount: number
    lowEvidenceTransformationCount: number
    synthesisReliability: 'full' | 'salvaged' | 'fallback'
  }
}

export interface DraftRolloutReadiness {
  decision: 'not_ready' | 'pilot_only' | 'ready'
  readyForBroadRollout: boolean
  reasons: string[]
}

export interface DraftDebugArtifacts {
  generatedAt: string
  config: DraftRunConfig
  selection: DraftPairSelectionResult
  pairAnalyses: DraftPairAnalysis[]
  successfulPairCount: number
  failedPairCount: number
  synthesis?: DraftFolderSynthesis
  synthesisFailureReason?: string
  synthesisDiagnostics?: DraftSynthesisDiagnostics
  integrity: DraftIntegrityValidationResult
  publication: DraftPublicationDecision
  qualityAssessment: DraftQualityAssessment
  rolloutReadiness: DraftRolloutReadiness
  runLog: DraftLogEntry[]
}

export interface DraftSynthesisDiagnostics {
  modelUsed?: string
  promptChars?: number
  rawResponseChars?: number
  rawResponsePreview?: string
  rawResponse?: string
  failureKind?: 'request_error' | 'parse_error' | 'llm_disabled'
  truncatedResponseSuspected?: boolean
}

export interface DraftRunResult {
  outputDirectory: string
  markdownPath: string
  jsonPath: string
  debugPath: string
  logPath: string
  status: DraftRunStatus
  selection: DraftPairSelectionResult
}
