import type {
  DraftArtifacts,
  DraftDebugArtifacts,
  DraftFolderSynthesis,
} from '../draft/types'

export type CookbookWriteMode = 'overwrite' | 'append'

export type OperationalStatus = 'ready' | 'pilot_only' | 'review_only' | 'blocked'

export type CookbookConfidence = 'high' | 'medium' | 'low' | 'blocked'

export type CookbookRuleKind =
  | 'mapping'
  | 'transformation'
  | 'variant'
  | 'enrichment'
  | 'validation'
  | 'caution'

export type ValidationSeverity = 'error' | 'warning'

export interface JsonObject {
  [key: string]: JsonValue
}

export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]

export interface CookbookConfig {
  workspaceRoot: string
  draftsRoot: string
  outputRoot: string
  mode: CookbookWriteMode
  updateLatest: boolean
  includeReviewOnly: boolean
  enablePolish: boolean
  folderOverridesPath?: string
}

export interface CookbookFolderOverride {
  folder: string
  operationalStatus?: OperationalStatus
  reasonCode?: string
  agentUsePolicy?: string
}

export interface LoadedDraftFamily {
  folder: string
  draftPath: string
  debugPath?: string
  logPath?: string
  artifact: DraftArtifacts
  debug?: DraftDebugArtifacts
}

export interface FamilyReadiness {
  folder: string
  operationalStatus: OperationalStatus
  reasonCodes: string[]
  agentUsePolicy: string
  semanticSuccessRate: number
  qualityRating?: string
  publicationStatus?: string
  integrityOk?: boolean
}

export interface CookbookEvidence {
  count: number
  files: string[]
  draftPath: string
  semanticBasis: number
  totalPairs: number
}

export interface CookbookRule {
  id: string
  family?: string
  kind: CookbookRuleKind
  title: string
  operationalStatus: OperationalStatus
  confidence: CookbookConfidence
  sourceSignals: string[]
  targetPaths: string[]
  action: string
  rationale: string
  evidence: CookbookEvidence
  caveats: string[]
  doNotAssume: string[]
  validationChecks: string[]
  humanReviewTriggers: string[]
}

export interface CookbookWorkedExample {
  title: string
  sourceSignals: string[]
  cdmProposal: string[]
  validation: string[]
}

export interface CookbookFamilyDocument {
  folder: string
  title: string
  readiness: FamilyReadiness
  triggerSignals: string[]
  canonicalProcedure: string[]
  stableRules: CookbookRule[]
  transformations: CookbookRule[]
  variants: CookbookRule[]
  enrichments: CookbookRule[]
  cautions: CookbookRule[]
  doNotAssume: string[]
  humanReviewTriggers: string[]
  validationChecklist: string[]
  workedExamples: CookbookWorkedExample[]
  sourceEvidencePath: string
}

export interface CookbookGlobalDocument {
  slug: string
  title: string
  summary: string
  rules: CookbookRule[]
  familySpecificRules: CookbookRule[]
  validationChecklist: string[]
  doNotAssume: string[]
}

export interface CookbookEvidenceSidecar {
  folder: string
  generatedAt: string
  sourceDraft: string
  sourceDebug?: string
  evidenceCoverage: DraftFolderSynthesis['evidenceCoverage']
  publication?: DraftDebugArtifacts['publication']
  qualityAssessment?: DraftDebugArtifacts['qualityAssessment']
  rolloutReadiness?: DraftDebugArtifacts['rolloutReadiness']
  stableMappingPatterns: DraftFolderSynthesis['stableMappingPatterns']
  repeatedNonLiteralTransformations: DraftFolderSynthesis['repeatedNonLiteralTransformations']
  tentativeRepeatedPatterns: DraftFolderSynthesis['tentativeRepeatedPatterns']
  variantsAndExceptions: DraftFolderSynthesis['variantsAndExceptions']
  suspectedEnrichmentOrDefaultBehavior: DraftFolderSynthesis['suspectedEnrichmentOrDefaultBehavior']
  openQuestions: string[]
}

export interface CookbookValidationIssue {
  severity: ValidationSeverity
  code: string
  message: string
  document?: string
  ruleId?: string
}

export interface CookbookManifestFamily {
  folder: string
  operationalStatus: OperationalStatus
  confidenceSummary: Record<CookbookConfidence, number>
  markdownPath: string
  evidencePath: string
  draftPath: string
  debugPath?: string
}

export interface CookbookManifestGlobalDocument {
  name: string
  markdownPath: string
  ruleCount: number
}

export interface CookbookManifest {
  generatedAt: string
  mode: CookbookWriteMode
  sourceDraftRoot: string
  outputRoot: string
  families: CookbookManifestFamily[]
  globalDocuments: CookbookManifestGlobalDocument[]
}

export interface CookbookRunComparison {
  comparedToLatest: boolean
  previousManifestPath?: string
  addedFamilies: string[]
  removedFamilies: string[]
  statusChanges: Array<{
    folder: string
    before: OperationalStatus
    after: OperationalStatus
  }>
  globalRuleCountChanges: Array<{
    name: string
    before: number
    after: number
  }>
}

export interface CookbookRunResult {
  generatedAt: string
  outputDirectory: string
  latestDirectory?: string
  manifestPath: string
  familyDocumentCount: number
  globalDocumentCount: number
  validationErrorCount: number
  validationWarningCount: number
}

export interface CookbookWriteArtifactsInput {
  config: CookbookConfig
  generatedAt: string
  outputDirectory: string
  familyDocuments: CookbookFamilyDocument[]
  globalDocuments: CookbookGlobalDocument[]
  evidenceSidecars: CookbookEvidenceSidecar[]
  manifest: CookbookManifest
  validationIssues: CookbookValidationIssue[]
  comparison?: CookbookRunComparison
}
