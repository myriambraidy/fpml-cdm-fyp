import type { LLMMessage } from '../agent/types'
import type {
  CookbookManifest,
  CookbookManifestFamily,
  OperationalStatus,
} from '../cookbook/types'

export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]

export interface JsonObject {
  [key: string]: JsonValue
}

export type CookbookLlmWriteMode = 'overwrite' | 'append'

export type CookbookLlmLogLevel = 'silent' | 'info' | 'debug'

export type AuthoringSubjectType = 'index' | 'global' | 'family'

export type AuthoringDecision = 'pass' | 'repair_required' | 'fail'

export type ClaimSupport =
  | 'supported'
  | 'partially_supported'
  | 'unsupported'
  | 'overgeneralized'
  | 'contradicted'

export type EvidenceKind =
  | 'rule'
  | 'transformation'
  | 'variant'
  | 'enrichment'
  | 'open_question'
  | 'quality'
  | 'example'
  | 'deterministic'

export type AuthoredConfidence = 'high' | 'medium' | 'low'

export interface CookbookLlmConfig {
  workspaceRoot: string
  deterministicRoot: string
  draftsRoot: string
  outputRoot: string
  mode: CookbookLlmWriteMode
  maxRepairLoops: number
  includeReviewOnly: boolean
  storeRawResponses: boolean
  failFast: boolean
  logLevel: CookbookLlmLogLevel
  onlyPacketId?: string
  models: {
    author: string
    critic: string
    auditor: string
    repair: string
    judge: string
  }
  temperatures: {
    author: number
    critic: number
    auditor: number
    repair: number
    judge: number
  }
}

export interface EvidenceReference {
  id: string
  source: string
  kind: EvidenceKind
  text: string
}

export interface CookbookEvidencePacket {
  id: string
  subjectType: AuthoringSubjectType
  title: string
  operationalStatus: OperationalStatus
  deterministicMarkdown: string
  deterministicManifestEntry?: JsonObject
  evidenceReferences: EvidenceReference[]
  requiredSections: string[]
  allowedClaimsPolicy: string[]
  sourceSidecar?: JsonObject
}

export interface AuthoredClaim {
  claim: string
  evidenceIds: string[]
  confidence: AuthoredConfidence
  requiresHumanReview: boolean
}

export interface AuthoredCookbookPage {
  markdown: string
  claims: AuthoredClaim[]
  unresolvedQuestions: string[]
  doNotAssume: string[]
}

export interface CriticIssue {
  section: string
  issue: string
  requiredFix: string
}

export interface CriticReport {
  decision: AuthoringDecision
  score: number
  blockingIssues: CriticIssue[]
  nonBlockingSuggestions: string[]
}

export interface AuditedClaim {
  claim: string
  support: ClaimSupport
  evidenceIds: string[]
  reason: string
}

export interface EvidenceAuditReport {
  decision: AuthoringDecision
  auditedClaims: AuditedClaim[]
  unsupportedClaims: string[]
  overgeneralizedClaims: string[]
  missingEvidence: string[]
}

export interface StopJudgeReport {
  decision: AuthoringDecision
  reason: string
  scores: {
    grounding: number
    actionability: number
    exceptionHandling: number
    validation: number
    agentUsability: number
  }
}

export interface AuthoringIteration {
  iteration: number
  page: AuthoredCookbookPage
  criticReport: CriticReport
  auditReport: EvidenceAuditReport
  judgeReport: StopJudgeReport
}

export interface AuthoredPageResult {
  packetId: string
  subjectType: AuthoringSubjectType
  title: string
  finalPage: AuthoredCookbookPage
  iterations: AuthoringIteration[]
  llmCalls: LlmCallTrace[]
  finalDecision: AuthoringDecision
  failureReason?: string
}

export interface LlmCallTrace {
  role: 'author' | 'critic' | 'auditor' | 'repair' | 'judge'
  model: string
  messages: LLMMessage[]
  rawResponsePreview: string
  rawResponse?: string
  promptChars: number
  rawResponseChars: number
}

export interface LlmJsonCallResult<T> {
  parsed: T
  rawResponse: string
  promptChars: number
  rawResponseChars: number
  model: string
}

export interface LlmRoleCallInput<T> {
  model: string
  messages: LLMMessage[]
  maxTokens: number
  schemaName: string
  parse: (text: string) => T
}

export interface LlmCookbookValidationIssue {
  severity: 'error' | 'warning'
  code: string
  message: string
  packetId: string
}

export interface LlmCookbookAuthoringDebug {
  generatedAt: string
  configSummary: {
    maxRepairLoops: number
    models: CookbookLlmConfig['models']
  }
  results: AuthoredPageResult[]
  validationIssues: LlmCookbookValidationIssue[]
}

export interface LlmCookbookManifestPage {
  packetId: string
  title: string
  subjectType: AuthoringSubjectType
  finalDecision: AuthoringDecision
  markdownPath: string
  iterationCount: number
}

export interface LlmCookbookManifest {
  generatedAt: string
  mode: CookbookLlmWriteMode
  deterministicRoot: string
  outputRoot: string
  sourceManifest: CookbookManifest
  pages: LlmCookbookManifestPage[]
}

export interface CookbookLlmRunResult {
  generatedAt: string
  outputDirectory: string
  latestDirectory?: string
  manifestPath: string
  pageCount: number
  validationErrorCount: number
  validationWarningCount: number
}

export interface LlmCookbookWriteInput {
  config: CookbookLlmConfig
  generatedAt: string
  outputDirectory: string
  manifest: LlmCookbookManifest
  results: AuthoredPageResult[]
  validationIssues: LlmCookbookValidationIssue[]
  debug: LlmCookbookAuthoringDebug
  packets: CookbookEvidencePacket[]
}

export interface PacketSourcePaths {
  markdownPath: string
  evidencePath?: string
  family?: CookbookManifestFamily
}
