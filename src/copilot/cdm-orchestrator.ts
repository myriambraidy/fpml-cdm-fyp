import { z } from 'zod'
import { CDM_VERSION, env } from '../config'
import type { AppDeps } from '../app'
import type { Field } from '../parser/types'
import type { RosettaMappingPackage } from '../exporter/types'
import type { LLMClient, LLMMessage } from '../agent/types'
import { validateStructuralCdm } from '../cdm-validation/structural'
import { validateSemanticCdm } from '../cdm-validation/semantic'
import type {
  RepairHint,
  SemanticValidationResult,
  ValidationFinding,
  ValidationResult,
} from '../cdm-validation/types'
import type { CdmOrchestratorDebugPayload } from './cdm-orchestrator-debug'
import { CdmOrchestratorRunDebug } from './cdm-orchestrator-debug'
import { buildSourceModel } from '../source-model/build-groups'
import { buildCdmCandidate } from '../cdm-assembly/builder'
import { applyCanonicalBuilders } from '../cdm-assembly/canonical-builders'
import { deriveNormalizedFacts } from '../source-model/normalized-facts'
import type { MappingIR } from '../mapping-ir/types'
import type { MappingSemanticMeta } from '../mapping-ir/types'
import { isAssemblyReady, parseLegacyCdmPath } from '../mapping-ir/transform'
import { expectedPayoutFamilies, inferProductFamily, type ProductFamily } from '../source-model/product-family'
import {
  loadCookbookRuntimeBundle,
  readCookbookRuntimeConfig,
  renderCookbookContext,
  selectCookbookContext,
  type CookbookRuntimeRenderResult,
} from '../cookbook-runtime'

const LlmEnvelopeSchema = z.object({
  reasoning: z.string(),
  cdm: z.record(z.any()),
  sourceEvidence: z
    .array(
      z.object({
        sourcePath: z.string(),
        targetPath: z.string(),
        note: z.string(),
      })
    )
    .default([]),
  openQuestions: z.array(z.string()).default([]),
})

const JsonSchemaEnvelope = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'cdm_orchestrator_envelope',
    strict: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      required: ['reasoning', 'cdm', 'sourceEvidence', 'openQuestions'],
      properties: {
        reasoning: { type: 'string' },
        cdm: { type: 'object' },
        sourceEvidence: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['sourcePath', 'targetPath', 'note'],
            properties: {
              sourcePath: { type: 'string' },
              targetPath: { type: 'string' },
              note: { type: 'string' },
            },
          },
        },
        openQuestions: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  },
}

export interface CdmOrchestratorAttempt {
  stage:
    | 'initial_generation'
    | 'structural_repair'
    | 'semantic_repair'
  iteration: number
  reasoning: string
  structural: ValidationResult
  semantic?: SemanticValidationResult
}

export interface CdmOrchestratorResult {
  status:
    | 'invalid_json'
    | 'invalid_envelope'
    | 'structurally_invalid'
    | 'structurally_valid'
    | 'semantically_invalid'
    | 'semantically_valid'
    | 'repair_exhausted'
    | 'needs_analyst_review'
    | 'compliant'
  cdmPayload?: Record<string, unknown>
  /** Backward compatibility alias for older API consumers. */
  cdm?: Record<string, unknown>
  provenance?: Record<string, unknown>
  reasoning: string
  sourceEvidence: Array<{ sourcePath: string; targetPath: string; note: string }>
  openQuestions: string[]
  ambiguities: Array<{
    sourcePath: string
    detail: string
    confidence: number
    severity: 'info' | 'warn' | 'error'
  }>
  recommendations: string[]
  attempts: CdmOrchestratorAttempt[]
  repairTrace: RepairHint[]
  structural: ValidationResult
  semantic: SemanticValidationResult
  assemblyDiagnostics?: {
    collisions: ValidationFinding[]
    coverage: ValidationFinding[]
  }
  /** Present when `CDM_ORCHESTRATOR_DEBUG` or `X-Cdm-Debug: 1` enabled */
  debug?: CdmOrchestratorDebugPayload
}

function rootKey(rootType = env.CDM_ORCHESTRATOR_ROOT_TYPE): string {
  return rootType.charAt(0).toLowerCase() + rootType.slice(1)
}

function canonicalRootKey(): 'tradeState' | 'trade' | 'businessEvent' {
  if (env.CDM_ORCHESTRATOR_ROOT_TYPE === 'Trade') return 'trade'
  if (env.CDM_ORCHESTRATOR_ROOT_TYPE === 'BusinessEvent') return 'businessEvent'
  return 'tradeState'
}

function mapDiagnosticsToFindings(
  diagnostics: RosettaMappingPackage['diagnostics']
): { collisions: ValidationFinding[]; coverage: ValidationFinding[] } | undefined {
  if (!diagnostics) return undefined
  return {
    collisions: diagnostics.collisions.map(d => ({
      path: d.targetPath,
      code: d.code,
      message: d.message,
    })),
    coverage: diagnostics.coverage.map(d => ({
      path: d.sourcePath ?? d.targetPath ?? '$',
      code: d.code,
      message: d.message,
    })),
  }
}

function findingKey(
  kind: 'collision' | 'coverage',
  finding: ValidationFinding
): string {
  return [
    kind,
    finding.code.trim(),
    finding.path.trim(),
    finding.message.trim(),
  ].join('::')
}

function dedupeFindings(
  kind: 'collision' | 'coverage',
  findings: ValidationFinding[]
): ValidationFinding[] {
  const seen = new Set<string>()
  const result: ValidationFinding[] = []
  for (const finding of findings) {
    const key = findingKey(kind, finding)
    if (seen.has(key)) continue
    seen.add(key)
    result.push(finding)
  }
  return result
}

function buildSourceEvidence(pkg: RosettaMappingPackage) {
  return pkg.mappings.map(mapping => ({
    sourcePath: mapping.source.path,
    targetPath: mapping.target.cdmPath,
    note: `${mapping.target.transformation} via ${mapping.evidence.skillInvoked}`,
  }))
}

function buildAmbiguities(mappings: MappingIR[]) {
  const out: Array<{
    sourcePath: string
    detail: string
    confidence: number
    severity: 'info' | 'warn' | 'error'
  }> = []
  for (const mapping of mappings) {
    if (mapping.confidence < 70) {
      out.push({
        sourcePath: mapping.source.path,
        detail: `Low-confidence inference for ${mapping.target.legacyPath}`,
        confidence: mapping.confidence,
        severity: mapping.confidence < 50 ? 'error' : 'warn',
      })
    }
    for (const diagnostic of mapping.diagnostics) {
      if (diagnostic.severity === 'info') continue
      out.push({
        sourcePath: mapping.source.path,
        detail: diagnostic.message,
        confidence: mapping.confidence,
        severity: diagnostic.severity,
      })
    }
  }
  return out
}

function buildRecommendations(ambiguities: ReturnType<typeof buildAmbiguities>): string[] {
  const recommendations: string[] = []
  if (ambiguities.some(item => item.detail.toLowerCase().includes('party'))) {
    recommendations.push('Review party roster and counterparty references before approval.')
  }
  if (ambiguities.some(item => item.detail.toLowerCase().includes('date'))) {
    recommendations.push('Confirm date typing (date-only vs timestamp) and canonical formatting.')
  }
  if (ambiguities.some(item => item.detail.toLowerCase().includes('binding'))) {
    recommendations.push('Resolve array/entity bindings to avoid unstable placement in assembled payload.')
  }
  if (recommendations.length === 0 && ambiguities.length > 0) {
    recommendations.push('Review highlighted ambiguities before promoting this payload downstream.')
  }
  return recommendations
}

function normalizeRepairHint(
  stage: 'structural' | 'semantic',
  findings: ValidationFinding[]
): RepairHint {
  return {
    stage,
    summary: `${findings.length} validation error${findings.length === 1 ? '' : 's'}`,
    errors: findings.map(finding => ({
      ...finding,
      repairHint: `Revise the subtree at ${finding.path} to resolve ${finding.code} while preserving valid unrelated content.`,
    })),
  }
}

function exportEntryToIr(
  pkg: RosettaMappingPackage,
  mapping: RosettaMappingPackage['mappings'][number]
): MappingIR {
  if (
    mapping.targetTemplate &&
    mapping.leafKind &&
    mapping.mappingValue &&
    mapping.semantics &&
    mapping.grouping &&
    mapping.diagnostics != null
  ) {
    const candidate: MappingIR = {
      version: mapping.irVersion ?? 'v2',
      source: {
        path: mapping.source.path,
        name: mapping.source.name,
        value: mapping.source.value,
        ancestors: [],
        sourceFormat: pkg.document.formatType,
      },
      target: {
        pathTemplate: mapping.targetTemplate,
        leafKind: mapping.leafKind,
        legacyPath: mapping.target.cdmPath,
      },
      value: mapping.mappingValue,
      semantics: mapping.semantics,
      grouping: mapping.grouping,
      arrayBinding: mapping.arrayBinding,
      confidence: mapping.evidence.confidence,
      transformation: mapping.target.transformation,
      reasoning: `${mapping.target.transformation} via ${mapping.evidence.skillInvoked}`,
      skillInvoked: mapping.evidence.skillInvoked,
      candidateSkills: [mapping.evidence.skillInvoked],
      needsReview: false,
      diagnostics: mapping.diagnostics,
    }
    if (isAssemblyReady(candidate)) {
      return candidate
    }
  }

  if (
    mapping.targetTemplate &&
    mapping.semantics &&
    mapping.grouping &&
    mapping.diagnostics != null
  ) {
    return {
      version: 'v2',
      source: {
        path: mapping.source.path,
        name: mapping.source.name,
        value: mapping.source.value,
        ancestors: [],
        sourceFormat: pkg.document.formatType,
      },
      target: {
        pathTemplate: mapping.targetTemplate,
        leafKind: mapping.leafKind ?? 'scalar',
        legacyPath: mapping.target.cdmPath,
      },
      value: mapping.mappingValue ??
        (mapping.semantics.cdmEnum
        ? {
            kind: 'enum',
            raw: mapping.source.value,
            normalized: mapping.semantics.cdmEnum,
          }
        : {
            kind: 'raw_scalar',
            value: mapping.source.value,
          }),
      semantics: mapping.semantics,
      grouping: mapping.grouping,
      arrayBinding: mapping.arrayBinding,
      confidence: mapping.evidence.confidence,
      transformation: mapping.target.transformation,
      reasoning: `${mapping.target.transformation} via ${mapping.evidence.skillInvoked}`,
      skillInvoked: mapping.evidence.skillInvoked,
      candidateSkills: [mapping.evidence.skillInvoked],
      needsReview: false,
      diagnostics: mapping.diagnostics,
    }
  }

  const fallbackSemantics: MappingSemanticMeta = {
    domain: 'generic',
  }
  const parsed = parseLegacyCdmPath(mapping.target.cdmPath, fallbackSemantics)
  return {
    version: 'v2',
    source: {
      path: mapping.source.path,
      name: mapping.source.name,
      value: mapping.source.value,
      ancestors: [],
      sourceFormat: pkg.document.formatType,
    },
    target: {
      pathTemplate: parsed.pathTemplate,
      leafKind: 'scalar',
      legacyPath: mapping.target.cdmPath,
    },
    value: {
      kind: 'raw_scalar',
      value: mapping.source.value,
    },
    semantics: fallbackSemantics,
    grouping: [],
    confidence: mapping.evidence.confidence,
    transformation: mapping.target.transformation,
    reasoning: `${mapping.target.transformation} via ${mapping.evidence.skillInvoked}`,
    skillInvoked: mapping.evidence.skillInvoked,
    candidateSkills: [mapping.evidence.skillInvoked],
    needsReview: false,
    diagnostics: parsed.diagnostics,
  }
}

function buildInitialPrompt(
  pkg: RosettaMappingPackage,
  fpml: string,
  fields: Field[],
  draft: Record<string, unknown>,
  assemblyDiagnostics: CdmOrchestratorResult['assemblyDiagnostics'] | undefined,
  productFamilyHint: ProductFamily,
  expectedPayouts: string[],
  cookbookContext: CookbookRuntimeRenderResult | null
): LLMMessage[] {
  const strictSystemPrompt = [
    `You are a strict CDM constructor for root type ${env.CDM_ORCHESTRATOR_ROOT_TYPE}.`,
    `Do not invent identifiers, parties, LEIs, trade IDs, or timestamps.`,
    `Emit exactly one root object (${canonicalRootKey()}) and avoid duplicate economic sections.`,
    `All party references must resolve to declared trade parties.`,
    `TradableProduct.counterparty must contain exactly Party1 and Party2 roles.`,
    `Use payout branch types that match product economics.`,
    `If schedule/price/quantity addresses are used, ensure each address resolves to an existing PriceQuantity location.`,
    `Date-only values must be YYYY-MM-DD without trailing Z.`,
    `Preserve valid content; only adjust invalid portions.`,
    `Return JSON only in the required envelope.`,
  ].join(' ')
  const defaultSystemPrompt =
    `You repair and refine grounded CDM JSON for root type ${env.CDM_ORCHESTRATOR_ROOT_TYPE}. ` +
    `Preserve valid content. Use the provided FPML, approved mappings, and field summaries. Return JSON only in the required envelope.`
  return [
    {
      role: 'system',
      content: env.CDM_ORCHESTRATOR_STRICT_PROMPT ? strictSystemPrompt : defaultSystemPrompt,
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          task: 'Build or refine a grounded CDM representation',
          cdmVersion: CDM_VERSION,
          rootType: env.CDM_ORCHESTRATOR_ROOT_TYPE,
          package: pkg,
          fpml,
          fields,
          deterministicDraft: draft,
          assemblyDiagnostics,
          productFamilyHint,
          expectedPayouts,
          cookbookContext,
        },
        null,
        2
      ),
    },
  ]
}

async function buildCookbookContext(
  productFamilyHint: ProductFamily
): Promise<CookbookRuntimeRenderResult | null> {
  const runtimeConfig = readCookbookRuntimeConfig(process.cwd())
  if (!runtimeConfig.enabled) return null
  const bundle = await loadCookbookRuntimeBundle(runtimeConfig.rootPath)
  const selection = selectCookbookContext({
    bundle,
    productFamily: productFamilyHint,
    maxChars: runtimeConfig.maxChars,
    includeReviewOnly: runtimeConfig.includeReviewOnly,
  })
  return renderCookbookContext(selection)
}

function buildRepairPrompt(
  stage: 'structural' | 'semantic',
  current: Record<string, unknown>,
  hint: RepairHint,
  productFamilyHint: ProductFamily
): LLMMessage[] {
  return [
    {
      role: 'system',
      content:
        `You are repairing a ${stage} validation failure for a grounded CDM JSON candidate for ${productFamilyHint}. ` +
        `Preserve valid content and only change what is necessary to satisfy the reported validator errors.`,
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          stage,
          currentCandidate: current,
          repairHint: hint,
          productFamilyHint,
          rootType: env.CDM_ORCHESTRATOR_ROOT_TYPE,
          cdmVersion: CDM_VERSION,
        },
        null,
        2
      ),
    },
  ]
}

function extractJsonObject(content: string): Record<string, unknown> {
  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const source = fenced?.[1]?.trim() || trimmed
  return JSON.parse(source) as Record<string, unknown>
}

async function callForEnvelope(
  llm: LLMClient | undefined,
  messages: LLMMessage[],
  fallbackEnvelope: z.infer<typeof LlmEnvelopeSchema>,
  dbg: CdmOrchestratorRunDebug,
  label: string
): Promise<z.infer<typeof LlmEnvelopeSchema>> {
  if (!llm || !env.CDM_ORCHESTRATOR_USE_LLM) {
    dbg.log('llm_skipped', {
      label,
      reason: !llm ? 'no_llm_client' : 'cdm_orchestrator_use_llm_disabled',
    })
    return fallbackEnvelope
  }
  const model = env.CDM_ORCHESTRATOR_MODEL || env.OPENROUTER_MODEL
  const userMsg = messages.find(m => m.role === 'user')
  dbg.log('llm_request_start', {
    label,
    model,
    maxTokens: env.CDM_ORCHESTRATOR_MAX_TOKENS,
    timeoutMs: env.LLM_TIMEOUT_MS,
    userMessageChars: typeof userMsg?.content === 'string' ? userMsg.content.length : 0,
    responseFormat: 'json_schema',
  })
  const t0 = Date.now()
  try {
    const response = await llm.call({
      messages,
      model,
      maxTokens: env.CDM_ORCHESTRATOR_MAX_TOKENS,
      responseFormat: JsonSchemaEnvelope,
    })
    const ms = Date.now() - t0
    const raw = response.content ?? ''
    dbg.log('llm_response_raw', {
      label,
      ms,
      contentLength: raw.length,
      contentHead: raw.slice(0, 400),
    })
    const parsed = extractJsonObject(raw)
    const envelope = LlmEnvelopeSchema.parse(parsed)
    dbg.log('llm_envelope_ok', {
      label,
      ms,
      reasoningChars: envelope.reasoning.length,
      cdmTopKeys:
        envelope.cdm && typeof envelope.cdm === 'object' && !Array.isArray(envelope.cdm)
          ? Object.keys(envelope.cdm).slice(0, 24)
          : [],
    })
    return envelope
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    dbg.log('llm_envelope_error', {
      label,
      message,
      ms: Date.now() - t0,
      stackPreview:
        error instanceof Error ? error.stack?.split('\n').slice(0, 5).join(' ← ') : undefined,
    })
    throw error
  }
}

function countRepeatedErrors(hints: RepairHint[]): boolean {
  if (hints.length < 2) return false
  const last = JSON.stringify(hints[hints.length - 1]?.errors ?? [])
  const prev = JSON.stringify(hints[hints.length - 2]?.errors ?? [])
  return last === prev
}

function applyPathLocalRepairs(payload: Record<string, unknown>): Record<string, unknown> {
  const cloned = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>
  const walk = (node: unknown): unknown => {
    if (Array.isArray(node)) return node.map(item => walk(item))
    if (typeof node !== 'object' || node == null) return node
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key.toLowerCase().includes('date') && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}Z$/.test(value)) {
        out[key] = value.slice(0, -1)
        continue
      }
      if (key === 'tradeDate' && typeof value === 'string') {
        out[key] = { value: value.endsWith('Z') ? value.slice(0, -1) : value }
        continue
      }
      out[key] = walk(value)
    }
    return out
  }
  return walk(cloned) as Record<string, unknown>
}

function collectSourceIdentifierCandidates(args: {
  fields: Field[]
  mappings: MappingIR[]
  fpml: string
}): Set<string> {
  const out = new Set<string>()
  for (const field of args.fields) {
    if (typeof field.value === 'string' && field.value.trim()) out.add(field.value.trim())
  }
  for (const mapping of args.mappings) {
    const value = mapping.value as { kind?: string; value?: unknown; normalized?: unknown; raw?: unknown }
    for (const candidate of [value?.value, value?.normalized, value?.raw, mapping.source.value]) {
      if (typeof candidate === 'string' && candidate.trim()) out.add(candidate.trim())
    }
  }
  const fpmlStringMatches = args.fpml.match(/>[A-Za-z0-9:\-_.]{2,}</g) ?? []
  for (const token of fpmlStringMatches) {
    out.add(token.slice(1, -1).trim())
  }
  return out
}

function hasCriticalSemanticErrors(semantic: SemanticValidationResult): boolean {
  const critical = new Set([
    'unresolved_party_reference',
    'ungrounded_identifier',
    'missing_root',
    'missing_tradable_product',
  ])
  return semantic.errors.some(error => critical.has(error.code))
}

export class CdmOrchestrator {
  constructor(private readonly llm?: AppDeps['llmClient']) {}

  async run(
    args: {
      pkg: RosettaMappingPackage
      fpml: string
      fields: Field[]
    },
    opts?: { debug?: boolean }
  ): Promise<CdmOrchestratorResult> {
    const includeDebug = Boolean(opts?.debug ?? env.CDM_ORCHESTRATOR_DEBUG)
    const model = env.CDM_ORCHESTRATOR_MODEL || env.OPENROUTER_MODEL
    const dbg = new CdmOrchestratorRunDebug(includeDebug, model)
    const wrap = (r: CdmOrchestratorResult): CdmOrchestratorResult =>
      includeDebug ? { ...r, debug: dbg.payload(r.status) } : r

    const attempts: CdmOrchestratorAttempt[] = []
    const repairTrace: RepairHint[] = []
    const sourceEvidence = buildSourceEvidence(args.pkg)
    const sourceModel = buildSourceModel(args.fields)
    const approvedMappings = args.pkg.mappings.map(mapping => exportEntryToIr(args.pkg, mapping))
    const ambiguities = buildAmbiguities(approvedMappings)
    const recommendations = buildRecommendations(ambiguities)
    const assembly = buildCdmCandidate({
      mappings: approvedMappings,
      sourceModel,
      root: canonicalRootKey(),
      meta: {
        rootType: env.CDM_ORCHESTRATOR_ROOT_TYPE,
        cdmVersion: CDM_VERSION,
        sourceDocument: args.pkg.document.filename,
        sourceFormat: args.pkg.document.formatType,
        fieldCount: args.fields.length,
      },
    })
    const normalizedFacts = deriveNormalizedFacts(approvedMappings)
    const assemblyDiagnostics = {
      collisions: assembly.diagnostics.collisions.map(d => ({
        path: d.targetPath,
        code: d.code,
        message: d.message,
      })),
      coverage: assembly.diagnostics.coverage.map(d => ({
        path: d.sourcePath ?? d.targetPath ?? '$',
        code: d.code,
        message: d.message,
      })),
    }
    const inheritedDiagnostics = mapDiagnosticsToFindings(args.pkg.diagnostics)
    const mergedAssemblyDiagnostics = inheritedDiagnostics
      ? {
          collisions: dedupeFindings('collision', [
            ...inheritedDiagnostics.collisions,
            ...assemblyDiagnostics.collisions,
          ]),
          coverage: dedupeFindings('coverage', [
            ...inheritedDiagnostics.coverage,
            ...assemblyDiagnostics.coverage,
          ]),
        }
      : assemblyDiagnostics
    const draft = applyCanonicalBuilders({
      cdmPayload: assembly.cdmPayload,
      root: canonicalRootKey(),
      facts: normalizedFacts,
    })
    const productFamilyHint = inferProductFamily({
      fpml: args.fpml,
      fields: args.fields,
      mappings: approvedMappings,
    })
    const expectedPayouts = expectedPayoutFamilies(productFamilyHint)
    const cookbookContext = await buildCookbookContext(productFamilyHint).catch(() => null)
    const allowedIdentifierValues = env.CDM_ENFORCE_GROUNDED_IDENTIFIERS
      ? collectSourceIdentifierCandidates({
          fields: args.fields,
          mappings: approvedMappings,
          fpml: args.fpml,
        })
      : undefined

    dbg.log('run_start', {
      uploadId: args.pkg.document.uploadId,
      filename: args.pkg.document.filename,
      formatType: args.pkg.document.formatType,
      mappingCount: args.pkg.mappings.length,
      fieldCount: args.fields.length,
      fpmlChars: args.fpml.length,
      rootType: env.CDM_ORCHESTRATOR_ROOT_TYPE,
      productFamilyHint,
      expectedPayouts,
      cookbookContext: {
        family: cookbookContext?.familySlug ?? null,
        status: cookbookContext?.status ?? null,
        ruleIds: cookbookContext?.ruleIds.length ?? 0,
      },
      caps: {
        structural: env.CDM_MAX_STRUCTURAL_REPAIRS,
        semantic: env.CDM_MAX_SEMANTIC_REPAIRS,
        total: env.CDM_MAX_TOTAL_REPAIRS,
      },
    })

    let envelope: z.infer<typeof LlmEnvelopeSchema>
    try {
      envelope = await callForEnvelope(
        this.llm,
        buildInitialPrompt(
          args.pkg,
          args.fpml,
          args.fields,
          draft,
          mergedAssemblyDiagnostics,
          productFamilyHint,
          expectedPayouts,
          cookbookContext
        ),
        {
          reasoning: 'deterministic draft generated from approved mappings',
          cdm: draft,
          sourceEvidence,
          openQuestions: [],
        },
        dbg,
        'initial'
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      dbg.log('initial_envelope_failed', { message })
      return wrap({
        status: 'invalid_envelope',
        cdmPayload: draft,
        cdm: draft,
        provenance: {
          ...assembly.provenance,
          normalizedFacts,
          cookbook: cookbookContext,
        },
        reasoning: message,
        sourceEvidence,
        openQuestions: ['LLM envelope parsing failed'],
        ambiguities,
        recommendations,
        attempts,
        repairTrace,
        assemblyDiagnostics: mergedAssemblyDiagnostics,
        structural: { ok: false, errors: [{ path: '$', code: 'invalid_envelope', message }] },
        semantic: {
          ok: false,
          errors: [{ path: '$', code: 'invalid_envelope', message }],
          validatorKind: 'builtin-semantic',
          validatorVersion: 'builtin-v1',
          rootType: env.CDM_ORCHESTRATOR_ROOT_TYPE,
        },
      })
    }

    const llmCandidate =
      envelope.cdm && typeof envelope.cdm === 'object' && !Array.isArray(envelope.cdm)
        ? (envelope.cdm as Record<string, unknown>)
        : draft
    dbg.log('candidate_selected', {
      source: llmCandidate === draft ? 'draft' : 'llm',
      enforceGroundedIdentifiers: env.CDM_ENFORCE_GROUNDED_IDENTIFIERS,
      repairLoopEnabled: env.CDM_ENABLE_REPAIR_LOOP,
    })

    let current = applyPathLocalRepairs(llmCandidate)
    if (JSON.stringify(current) !== JSON.stringify(llmCandidate)) {
      repairTrace.push({
        stage: 'structural',
        summary: 'Applied deterministic path-local repairs',
        errors: [
          {
            path: '$',
            code: 'path_local_repair_applied',
            message: 'Path-local repair adjusted known date typing/format issues.',
            repairHint: 'Review repaired date fields for semantic correctness.',
          },
        ],
      })
    }
    let reasoning = envelope.reasoning
    let openQuestions = [...envelope.openQuestions]
    let structural: ValidationResult = { ok: false, errors: [] }
    let semantic: SemanticValidationResult = {
      ok: false,
      errors: [],
      validatorKind: 'builtin-semantic',
      validatorVersion: 'builtin-v1',
      rootType: env.CDM_ORCHESTRATOR_ROOT_TYPE,
    }
    let structuralRepairCount = 0
    let semanticRepairCount = 0
    let totalRepairs = 0

    while (true) {
      structural = validateStructuralCdm(current)
      dbg.log('structural_validate', {
        ok: structural.ok,
        errorCount: structural.errors.length,
        errors: structural.errors.slice(0, 12),
        structuralRepairCount,
        totalRepairs,
      })

      if (!structural.ok) {
        attempts.push({
          stage: totalRepairs === 0 ? 'initial_generation' : 'structural_repair',
          iteration: totalRepairs,
          reasoning,
          structural,
        })
        const canRepair =
          env.CDM_ENABLE_REPAIR_LOOP &&
          structuralRepairCount < env.CDM_MAX_STRUCTURAL_REPAIRS &&
          totalRepairs < env.CDM_MAX_TOTAL_REPAIRS
        if (!canRepair) break

        const hint = normalizeRepairHint('structural', structural.errors)
        repairTrace.push(hint)
        if (countRepeatedErrors(repairTrace)) {
          dbg.log('repair_stop_repeated_errors', { stage: 'structural' })
          break
        }
        const repaired = await callForEnvelope(
          this.llm,
          buildRepairPrompt('structural', current, hint, productFamilyHint),
          {
            reasoning,
            cdm: current,
            sourceEvidence: envelope.sourceEvidence,
            openQuestions,
          },
          dbg,
          `structural_repair_${structuralRepairCount + 1}`
        )
        reasoning = repaired.reasoning
        openQuestions = [...openQuestions, ...repaired.openQuestions]
        current = applyPathLocalRepairs(repaired.cdm)
        structuralRepairCount += 1
        totalRepairs += 1
        continue
      }

      semantic = validateSemanticCdm(current, env.CDM_ORCHESTRATOR_ROOT_TYPE, {
        enforceGroundedIdentifiers: env.CDM_ENFORCE_GROUNDED_IDENTIFIERS,
        allowedIdentifierValues,
      })
      dbg.log('semantic_validate', {
        ok: semantic.ok,
        errorCount: semantic.errors.length,
        errors: semantic.errors.slice(0, 12),
        validatorKind: semantic.validatorKind,
        semanticRepairCount,
        totalRepairs,
      })

      attempts.push({
        stage: totalRepairs === 0 ? 'initial_generation' : 'semantic_repair',
        iteration: totalRepairs,
        reasoning,
        structural,
        semantic,
      })

      if (semantic.ok) {
        dbg.log('exit_compliant')
        return wrap({
          status: 'compliant',
          cdmPayload: current,
          cdm: current,
          provenance: {
            ...assembly.provenance,
            normalizedFacts,
            cookbook: cookbookContext,
          },
          reasoning,
          sourceEvidence: envelope.sourceEvidence,
          openQuestions,
          ambiguities,
          recommendations,
          attempts,
          repairTrace,
          assemblyDiagnostics: mergedAssemblyDiagnostics,
          structural,
          semantic,
        })
      }

      const canRepair =
        env.CDM_ENABLE_REPAIR_LOOP &&
        semanticRepairCount < env.CDM_MAX_SEMANTIC_REPAIRS &&
        totalRepairs < env.CDM_MAX_TOTAL_REPAIRS
      if (!canRepair) break

      const hint = normalizeRepairHint('semantic', semantic.errors)
      repairTrace.push(hint)
      if (countRepeatedErrors(repairTrace)) {
        dbg.log('repair_stop_repeated_errors', { stage: 'semantic' })
        break
      }
      const repaired = await callForEnvelope(
        this.llm,
        buildRepairPrompt('semantic', current, hint, productFamilyHint),
        {
          reasoning,
          cdm: current,
          sourceEvidence: envelope.sourceEvidence,
          openQuestions,
        },
        dbg,
        `semantic_repair_${semanticRepairCount + 1}`
      )
      reasoning = repaired.reasoning
      openQuestions = [...openQuestions, ...repaired.openQuestions]
      current = applyPathLocalRepairs(repaired.cdm)
      semanticRepairCount += 1
      totalRepairs += 1
    }

    const finalStatus = !structural.ok
      ? env.CDM_ENABLE_REPAIR_LOOP && totalRepairs > 0
        ? 'repair_exhausted'
        : 'structurally_invalid'
      : hasCriticalSemanticErrors(semantic)
        ? 'needs_analyst_review'
        : env.CDM_ENABLE_REPAIR_LOOP && totalRepairs > 0
          ? 'repair_exhausted'
          : 'semantically_invalid'
    dbg.log('exit_noncompliant', {
      status: finalStatus,
      structuralOk: structural.ok,
      semanticOk: semantic.ok,
      totalRepairs,
    })
    return wrap({
      status: finalStatus,
      cdmPayload: current,
      cdm: current,
      provenance: {
        ...assembly.provenance,
        normalizedFacts,
        cookbook: cookbookContext,
      },
      reasoning,
      sourceEvidence: envelope.sourceEvidence,
      openQuestions,
      ambiguities,
      recommendations,
      attempts,
      repairTrace,
      assemblyDiagnostics: mergedAssemblyDiagnostics,
      structural,
      semantic,
    })
  }
}
