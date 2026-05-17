import type { RuntimeFixture } from './java-contract'
import type { CdmRosettaPreflightReport } from './cdm-rosetta-preflight'

export type GeneratorRole =
  | 'planner'
  | 'critic'
  | 'critique-reviewer'
  | 'implementer'
  | 'build-reviewer'
  | 'repair'

export type RoleDecision = 'accepted' | 'next_round_required' | 'failed'

export type RoleModelConfig = {
  model: string
  fallbackModel?: string
  maxTokens: number
  maxToolRounds: number
}

export type GeneratorRunConfig = {
  runId: string
  productFamily: string
  supportedProducts: string[]
  baseOutputDir: string
  runOutputDir: string
  maxPlanningRounds: number
  maxRepairAttempts: number
  requireApproval: boolean
  /** When true with fx-ex03 single-fixture POC shape, run gates before the LLM planning loop (opt-in smoke). */
  gatesOnlySmoke?: boolean
  resume: boolean
  evidenceRoots: string[]
  fixturePaths: string[]
  expectedCdmPaths: string[]
  runtimeFixtures: RuntimeFixture[]
  cdmRosettaPreflight?: CdmRosettaPreflightReport
  roleModels: Record<GeneratorRole, RoleModelConfig>
  llmBudget?: GeneratorLlmBudget
}

export type GeneratorLlmBudget = {
  maxTotalCalls: number
  maxInputTokensPerCall: number
  maxRepairAttempts: number
}

export type GeneratorWorkspace = {
  rootDir: string
  inputBriefPath: string
  productScopePath: string
  productScopeJsonPath: string
  evidencePacketPath: string
  evidencePacketJsonPath: string
  evidenceIndexPath: string
  javaShellContractPath: string
  rosettaGenerationContextPath: string
  cdmRosettaPreflightPath: string
  cdmJavaApiPackPath: string
  cdmJavaApiSummaryPath: string
  cdmJavaMissingClassesPath: string
  relevantCdmApiCandidatesPath: string
  relevantCdmApiCandidatesMarkdownPath: string
  cdmApiSelectionPass1Path: string
  cdmApiSelectionPass1MarkdownPath: string
  cdmApiSelectionFinalPath: string
  cdmApiSelectionFinalMarkdownPath: string
  approvedCdmApiContractPath: string
  approvedCdmApiContractMarkdownPath: string
  approvedCdmApiContractSummaryPath: string
  semanticRecipesDraftPath: string
  semanticRecipesDraftMarkdownPath: string
  semanticRecipesPath: string
  semanticRecipesMarkdownPath: string
  contextBudgetReportPath: string
  contextBudgetReportMarkdownPath: string
  javaDocumentationReadinessPath: string
  javaDocumentationReadinessMarkdownPath: string
  semanticRecipeValidationPath: string
  semanticRecipeValidationMarkdownPath: string
  apiContractValidationSummaryPath: string
  apiContractValidationSummaryMarkdownPath: string
  semanticRecipeFixturesReportPath: string
  semanticRecipeFixturesReportMarkdownPath: string
  goodJavaGuaranteeReviewPath: string
  finalImplementationContractPath: string
  finalImplementationContractJsonPath: string
  runLogPath: string
  acceptedPlanPath: string
  implementationPlanPath: string
  implementationLogPath: string
  repairLogPath: string
  finalBuildReportPath: string
}

export type RolePassResult = {
  role: GeneratorRole
  outputPath: string
  decision: RoleDecision
  summary: string
}

export type GateStatus = 'passed' | 'failed' | 'skipped'

export type GateAuthority = 'authoritative' | 'diagnostic' | 'pipeline_integrity'

export type GateResult = {
  name: string
  command: string
  status: GateStatus
  exitCode: number
  outputSnippet: string
  authority?: GateAuthority
}

export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

export type RolePhase = 'planning' | 'research' | 'write' | 'gates' | 'finalize'

export type ToolFailureKind = 'tool_error' | 'policy_block' | 'repeated_failure' | 'path_rejected'

export type ToolAuditEntry = {
  sequence: number
  timestamp: string
  role: GeneratorRole
  round?: number
  attempt?: number
  phase?: RolePhase
  llmCallId?: string
  toolCallId?: string
  toolRound?: number
  tool: string
  inputSummary: string
  outputSummary: string
  inputArtifactPath?: string
  outputArtifactPath?: string
  sourcePaths: string[]
  cacheStatus?: 'miss' | 'hit'
  ok?: boolean
  durationMs?: number
  failureKind?: ToolFailureKind
}

export type ToolResult = {
  ok: boolean
  output: string
  sourcePaths: string[]
}

export type ToolCacheEntry = ToolResult & {
  count: number
}

export type ToolExecutionState = {
  cache: Map<string, ToolCacheEntry>
  failedRepeats: Map<string, number>
  searchedCdmClasses: Set<string>
  lookupEligibleCdmClasses: Set<string>
  approvedCdmClasses: Set<string>
  rejectedCdmClasses: Map<string, string>
  rejectedBuilderClasses: Map<string, string>
  strictCdmLookup: boolean
}

export type ActiveStageContext = {
  role: GeneratorRole
  round?: number
  attempt?: number
  phase?: RolePhase
  allowedWritePaths: string[]
}

export type StageStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped'

export type StageManifestEntry = {
  stage: GeneratorRole | 'preflight' | 'gates'
  round?: number
  attempt?: number
  phase?: RolePhase
  status: StageStatus
  artifact?: string
  transcriptPath?: string
  eventIds?: string[]
  model?: string
  startedAt: string
  endedAt?: string
  llmCalls?: number
  toolCalls: number
  successfulWriteCalls?: number
  failedToolCalls: number
  policyFailures?: string[]
  message?: string
}

export type ModelCostLedgerEntry = {
  role: GeneratorRole
  round?: number
  model: string
  inputChars: number
  outputChars: number
  llmCalls: number
  toolCalls: number
  cachedToolCalls: number
  failedToolCalls: number
  durationMs: number
}
