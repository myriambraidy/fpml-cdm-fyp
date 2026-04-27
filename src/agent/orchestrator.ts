import type { Field } from '../parser/types'
import { getSkill, matchSkills } from '../skills/registry'
import type { Skill } from '../skills/types'
import { CardinalityCheckerInput } from '../skills/cardinality-checker/schemas'
import { buildOrchestrationContext, type OrchestrationContext } from './context'
import { sortMatchedSkills } from './skill-priority'
import { getToolsFromSkills } from './tools'
import {
  buildMultiMatchRetryPrompt,
  buildMultiMatchSystemPrompt,
  buildMultiMatchUserPrompt,
} from './prompts'
import { env } from '../config'
import {
  loadCookbookRuntimeBundle,
  readCookbookRuntimeConfig,
  renderCookbookContext,
  selectCookbookContext,
} from '../cookbook-runtime'
import {
  buildMappingIR,
  canonicalTargetToPath,
  parseLegacyCdmPath,
} from '../mapping-ir/transform'
import {
  detectSourceFormatFromField,
  type ArrayBindingHint,
  type GroupingHint,
  type LegacySkillOutput,
  type MappingIR,
  type MappingSemanticMeta,
  type MappingValue,
} from '../mapping-ir/types'
import type {
  PartyEntity,
  PremiumEntity,
  ScheduleEntity,
  SourceEntity,
  StreamEntity,
} from '../source-model/types'
import type {
  CandidateProposal,
  LLMClient,
  LLMMessage,
  LLMResponse,
  LLMToolCall,
  MappingProposal,
  OrchestrationTrace,
} from './types'
import { inferProductFamily } from '../source-model/product-family'

/** Exported for T7 — Zod safe-parse on skill input. */
export const safeParseSkillInput = (skill: Skill, input: unknown) =>
  skill.inputSchema.safeParse(input)

function inferParentPath(path: string): string | undefined {
  if (path.startsWith('$')) {
    const idx = path.lastIndexOf('.')
    return idx > 0 ? path.slice(0, idx) : undefined
  }
  const idx = path.lastIndexOf('/')
  return idx > 0 ? path.slice(0, idx) : undefined
}

function makeTrace(partyOrder: readonly string[]): OrchestrationTrace {
  return {
    partyOrder,
    llmCallCount: 0,
    arbitrationNotes: [],
    retries: 0,
  }
}

interface CookbookPromptContext {
  family: string | null
  ruleIds: string[]
  guidance: string | null
}

async function loadCookbookPromptContext(fields: Field[]): Promise<CookbookPromptContext> {
  const runtimeConfig = readCookbookRuntimeConfig(process.cwd())
  if (!runtimeConfig.enabled) {
    return { family: null, ruleIds: [], guidance: null }
  }
  const inferredFamily = inferProductFamily({
    fpml: '',
    fields,
    mappings: [],
  })
  try {
    const bundle = await loadCookbookRuntimeBundle(runtimeConfig.rootPath)
    const selection = selectCookbookContext({
      bundle,
      productFamily: inferredFamily,
      maxChars: Math.max(2000, Math.floor(runtimeConfig.maxChars * 0.3)),
      includeReviewOnly: runtimeConfig.includeReviewOnly,
    })
    const rendered = renderCookbookContext(selection)
    return {
      family: rendered.familySlug,
      ruleIds: rendered.ruleIds,
      guidance: rendered.text,
    }
  } catch {
    return { family: null, ruleIds: [], guidance: null }
  }
}

function buildEntityProposal(args: {
  anchorField: Field
  cdmPath: string
  transformation: string
  confidence: number
  reasoning: string
  skillInvoked: string
  semantics: MappingSemanticMeta
  grouping: GroupingHint[]
  leafKind: MappingIR['target']['leafKind']
  value: MappingValue
  sourceEntityKey: NonNullable<MappingProposal['sourceEntityKey']>
  sourceEntityType: NonNullable<MappingProposal['sourceEntityType']>
  trace: OrchestrationTrace
  arrayBinding?: ArrayBindingHint
  structuralHints?: Record<string, unknown>
}): MappingProposal {
  const parsed = parseLegacyCdmPath(args.cdmPath, args.semantics)
  const ir: MappingIR = {
    version: 'v2',
    source: {
      path: args.anchorField.path,
      name: args.anchorField.name,
      value: args.anchorField.value,
      parentPath: inferParentPath(args.anchorField.path),
      parentName: args.anchorField.context?.parentName as string | undefined,
      ancestors: Array.isArray(args.anchorField.context?.ancestors)
        ? (args.anchorField.context?.ancestors as string[])
        : [],
      sourceFormat: detectSourceFormatFromField(args.anchorField),
    },
    target: {
      pathTemplate: parsed.pathTemplate,
      leafKind: args.leafKind,
      legacyPath: args.cdmPath,
    },
    value: args.value,
    semantics: args.semantics,
    grouping: args.grouping,
    arrayBinding: args.arrayBinding,
    confidence: args.confidence,
    transformation: args.transformation,
    reasoning: args.reasoning,
    skillInvoked: args.skillInvoked,
    candidateSkills: [args.skillInvoked],
    needsReview: false,
    diagnostics: parsed.diagnostics,
  }

  return {
    sourceField: args.anchorField,
    cdmPath: args.cdmPath,
    transformation: args.transformation,
    confidence: args.confidence,
    reasoning: args.reasoning,
    skillInvoked: args.skillInvoked,
    structuralHints: args.structuralHints ?? {},
    candidateSkills: [args.skillInvoked],
    candidateProposals: [],
    needsReview: false,
    trace: args.trace,
    scope: 'entity',
    sourceEntityKey: args.sourceEntityKey,
    sourceEntityType: args.sourceEntityType,
    ir,
  }
}

function fieldByPath(fields: Field[]): Map<string, Field> {
  return new Map(fields.map(field => [field.path, field]))
}

function firstFieldForEntity(entity: SourceEntity, fieldsByPath: Map<string, Field>): Field | undefined {
  for (const sourcePath of entity.sourcePaths) {
    const field = fieldsByPath.get(sourcePath)
    if (field) return field
  }
  return undefined
}

function fieldForEntityPath(
  entity: SourceEntity,
  fieldsByPath: Map<string, Field>,
  matcher: (field: Field) => boolean
): Field | undefined {
  for (const sourcePath of entity.sourcePaths) {
    const field = fieldsByPath.get(sourcePath)
    if (field && matcher(field)) return field
  }
  return undefined
}

function partyBindingFromEntity(entity: PartyEntity): {
  index: number
  legacyIndex: '0' | '1'
  entityKey: 'counterparty_primary' | 'counterparty_secondary'
  counterpartyRole: 'PARTY_1' | 'PARTY_2'
} | null {
  if (entity.role === 'buyer') {
    return {
      index: 0,
      legacyIndex: '0',
      entityKey: 'counterparty_primary',
      counterpartyRole: 'PARTY_1',
    }
  }
  if (entity.role === 'seller') {
    return {
      index: 1,
      legacyIndex: '1',
      entityKey: 'counterparty_secondary',
      counterpartyRole: 'PARTY_2',
    }
  }
  const jsonPartyMatch = entity.entityKey.match(/^json_party_(\d+)$/)
  if (jsonPartyMatch) {
    const idx = Number(jsonPartyMatch[1])
    if (idx === 0 || idx === 1) {
      return {
        index: idx,
        legacyIndex: idx === 0 ? '0' : '1',
        entityKey: idx === 0 ? 'counterparty_primary' : 'counterparty_secondary',
        counterpartyRole: idx === 0 ? 'PARTY_1' : 'PARTY_2',
      }
    }
  }
  return null
}

function buildPartyEntityProposals(args: {
  entity: PartyEntity
  fieldsByPath: Map<string, Field>
  trace: OrchestrationTrace
}): MappingProposal[] {
  const isJsonPartyEntity = /^json_party_\d+$/.test(args.entity.entityKey)
  if (!isJsonPartyEntity && args.entity.sourcePaths.length < 2) {
    return []
  }
  const binding = partyBindingFromEntity(args.entity)
  if (!binding) return []

  const roleField =
    fieldForEntityPath(args.entity, args.fieldsByPath, field => field.name.toLowerCase() === 'role') ??
    firstFieldForEntity(args.entity, args.fieldsByPath)
  if (!roleField) return []

  const idField =
    fieldForEntityPath(args.entity, args.fieldsByPath, field =>
      ['id', 'partyid', 'partyidentifier'].includes(field.name.toLowerCase())
    ) ??
    fieldForEntityPath(args.entity, args.fieldsByPath, field =>
      field.name.toLowerCase().includes('partyreference')
    ) ??
    roleField

  const grouping: GroupingHint[] = [
    {
      entityType: 'counterparty',
      entityKey: binding.entityKey,
      relation: args.entity.role,
      rankHint: binding.index,
    },
  ]
  const semantics: MappingSemanticMeta = {
    domain: 'party',
    partyRole: args.entity.role,
    cdmCounterpartyRole: binding.counterpartyRole,
  }
  const arrayBinding: ArrayBindingHint = {
    bindingKey: binding.entityKey,
    sourceCollectionPath: inferParentPath(roleField.path),
    sourceIndex: binding.index,
    cardinality: 'single',
  }
  const basePath = `tradableProduct.counterparty[${binding.legacyIndex}]`
  const proposals: MappingProposal[] = [
    buildEntityProposal({
      anchorField: roleField,
      cdmPath: basePath,
      transformation: 'map_grouped_counterparty_entity',
      confidence: 98,
      reasoning: `Grouped party entity ${args.entity.entityKey} establishes a structured counterparty object for ${args.entity.role ?? 'party'}.`,
      skillInvoked: 'grouped_entity_party',
      semantics,
      grouping,
      leafKind: 'object_marker',
      value: { kind: 'object_marker', raw: args.entity.partyId ?? args.entity.href },
      sourceEntityKey: args.entity.entityKey,
      sourceEntityType: 'party',
      trace: args.trace,
      arrayBinding,
      structuralHints: {
        sourcePaths: args.entity.sourcePaths,
        groupedEntity: args.entity.entityKey,
      },
    }),
  ]

  const resolvedPartyId = args.entity.partyId ?? args.entity.href
  if (resolvedPartyId && idField) {
    proposals.push(
      buildEntityProposal({
        anchorField: idField,
        cdmPath: `${basePath}.partyReference`,
        transformation: 'map_grouped_counterparty_reference',
        confidence: 98,
        reasoning: `Grouped party entity ${args.entity.entityKey} provides the counterparty reference value ${resolvedPartyId}.`,
        skillInvoked: 'grouped_entity_party',
        semantics,
        grouping,
        leafKind: 'reference',
        value: {
          kind: 'reference',
          refType: 'party',
          raw: resolvedPartyId,
          resolvedId: resolvedPartyId,
        },
        sourceEntityKey: args.entity.entityKey,
        sourceEntityType: 'party',
        trace: args.trace,
        arrayBinding,
        structuralHints: {
          sourcePaths: args.entity.sourcePaths,
          groupedEntity: args.entity.entityKey,
        },
      })
    )
  }

  return proposals
}

function buildStreamEntityProposals(args: {
  entity: StreamEntity
  fieldsByPath: Map<string, Field>
  trace: OrchestrationTrace
}): MappingProposal[] {
  if (!args.entity.payerRef && !args.entity.receiverRef) {
    return []
  }
  const anchor = firstFieldForEntity(args.entity, args.fieldsByPath)
  if (!anchor) return []

  const basePath =
    `tradableProduct.product.contractualProduct.economicTerms.` +
    `payout[${args.entity.order}]`
  const grouping: GroupingHint[] = [
    {
      entityType: 'stream',
      entityKey: args.entity.entityKey,
      rankHint: args.entity.order,
      relation: args.entity.rateType,
    },
    {
      entityType: 'payout',
      entityKey: args.entity.entityKey,
      rankHint: args.entity.order,
      relation: args.entity.rateType,
    },
  ]
  const arrayBinding: ArrayBindingHint = {
    bindingKey: args.entity.entityKey,
    sourceCollectionPath: inferParentPath(anchor.path),
    sourceIndex: args.entity.order,
    cardinality: 'repeating',
  }
  const baseProposal = buildEntityProposal({
    anchorField: anchor,
    cdmPath: basePath,
    transformation: 'map_grouped_stream_entity',
    confidence: 94,
    reasoning: `Grouped stream entity ${args.entity.entityKey} establishes a distinct payout container for stream-level fields.`,
    skillInvoked: 'grouped_entity_stream',
    semantics: {
      domain: 'interest_rate_product',
      payoutType: 'InterestRatePayout',
      rateType: args.entity.rateType,
    },
    grouping,
    leafKind: 'object_marker',
    value: { kind: 'object_marker', raw: args.entity.entityKey },
    sourceEntityKey: args.entity.entityKey,
    sourceEntityType: 'stream',
    trace: args.trace,
    arrayBinding,
    structuralHints: {
      sourcePaths: args.entity.sourcePaths,
      groupedEntity: args.entity.entityKey,
    },
  })
  const proposals = [baseProposal]

  const payerField =
    fieldForEntityPath(args.entity, args.fieldsByPath, field =>
      field.name.toLowerCase().includes('payerpartyreference')
    ) ?? anchor
  if (args.entity.payerRef) {
    proposals.push(
      buildEntityProposal({
        anchorField: payerField,
        cdmPath: `${basePath}.payerReceiver.payer`,
        transformation: 'map_grouped_stream_payer',
        confidence: 94,
        reasoning: `Grouped stream entity ${args.entity.entityKey} binds payer ${args.entity.payerRef} to its payout instead of the generic payout root.`,
        skillInvoked: 'grouped_entity_stream',
        semantics: {
          domain: 'party',
          partyRole: 'payer',
        },
        grouping,
        leafKind: 'reference',
        value: {
          kind: 'reference',
          refType: 'party',
          raw: args.entity.payerRef,
          resolvedId: args.entity.payerRef,
        },
        sourceEntityKey: args.entity.entityKey,
        sourceEntityType: 'stream',
        trace: args.trace,
        arrayBinding,
      })
    )
  }

  const receiverField =
    fieldForEntityPath(args.entity, args.fieldsByPath, field =>
      field.name.toLowerCase().includes('receiverpartyreference')
    ) ?? anchor
  if (args.entity.receiverRef) {
    proposals.push(
      buildEntityProposal({
        anchorField: receiverField,
        cdmPath: `${basePath}.payerReceiver.receiver`,
        transformation: 'map_grouped_stream_receiver',
        confidence: 94,
        reasoning: `Grouped stream entity ${args.entity.entityKey} binds receiver ${args.entity.receiverRef} to its payout instead of the generic payout root.`,
        skillInvoked: 'grouped_entity_stream',
        semantics: {
          domain: 'party',
          partyRole: 'receiver',
        },
        grouping,
        leafKind: 'reference',
        value: {
          kind: 'reference',
          refType: 'party',
          raw: args.entity.receiverRef,
          resolvedId: args.entity.receiverRef,
        },
        sourceEntityKey: args.entity.entityKey,
        sourceEntityType: 'stream',
        trace: args.trace,
        arrayBinding,
      })
    )
  }

  return proposals
}

function buildPremiumEntityProposals(args: {
  entity: PremiumEntity
  fieldsByPath: Map<string, Field>
  trace: OrchestrationTrace
}): MappingProposal[] {
  const anchor = firstFieldForEntity(args.entity, args.fieldsByPath)
  if (!anchor) return []

  const basePath =
    'tradableProduct.product.contractualProduct.economicTerms.premium[0]'
  const grouping: GroupingHint[] = [
    {
      entityType: 'premium',
      entityKey: args.entity.entityKey,
      rankHint: 0,
    },
  ]
  const arrayBinding: ArrayBindingHint = {
    bindingKey: args.entity.entityKey,
    sourceCollectionPath: inferParentPath(anchor.path),
    sourceIndex: 0,
    cardinality: 'repeating',
  }
  const proposals = [
    buildEntityProposal({
      anchorField: anchor,
      cdmPath: basePath,
      transformation: 'map_grouped_premium_entity',
      confidence: 92,
      reasoning: `Grouped premium entity ${args.entity.entityKey} establishes a dedicated premium container so premium payment roles do not collide with stream payouts.`,
      skillInvoked: 'grouped_entity_premium',
      semantics: {
        domain: 'generic',
      },
      grouping,
      leafKind: 'object_marker',
      value: { kind: 'object_marker', raw: args.entity.entityKey },
      sourceEntityKey: args.entity.entityKey,
      sourceEntityType: 'premium',
      trace: args.trace,
      arrayBinding,
      structuralHints: {
        sourcePaths: args.entity.sourcePaths,
        groupedEntity: args.entity.entityKey,
      },
    }),
  ]

  const payerField =
    fieldForEntityPath(args.entity, args.fieldsByPath, field =>
      field.name.toLowerCase().includes('payerpartyreference')
    ) ?? anchor
  if (args.entity.payerRef) {
    proposals.push(
      buildEntityProposal({
        anchorField: payerField,
        cdmPath: `${basePath}.payerReceiver.payer`,
        transformation: 'map_grouped_premium_payer',
        confidence: 92,
        reasoning: `Grouped premium entity ${args.entity.entityKey} binds payer ${args.entity.payerRef} inside premium terms.`,
        skillInvoked: 'grouped_entity_premium',
        semantics: {
          domain: 'party',
          partyRole: 'payer',
        },
        grouping,
        leafKind: 'reference',
        value: {
          kind: 'reference',
          refType: 'party',
          raw: args.entity.payerRef,
          resolvedId: args.entity.payerRef,
        },
        sourceEntityKey: args.entity.entityKey,
        sourceEntityType: 'premium',
        trace: args.trace,
        arrayBinding,
      })
    )
  }

  const receiverField =
    fieldForEntityPath(args.entity, args.fieldsByPath, field =>
      field.name.toLowerCase().includes('receiverpartyreference')
    ) ?? anchor
  if (args.entity.receiverRef) {
    proposals.push(
      buildEntityProposal({
        anchorField: receiverField,
        cdmPath: `${basePath}.payerReceiver.receiver`,
        transformation: 'map_grouped_premium_receiver',
        confidence: 92,
        reasoning: `Grouped premium entity ${args.entity.entityKey} binds receiver ${args.entity.receiverRef} inside premium terms.`,
        skillInvoked: 'grouped_entity_premium',
        semantics: {
          domain: 'party',
          partyRole: 'receiver',
        },
        grouping,
        leafKind: 'reference',
        value: {
          kind: 'reference',
          refType: 'party',
          raw: args.entity.receiverRef,
          resolvedId: args.entity.receiverRef,
        },
        sourceEntityKey: args.entity.entityKey,
        sourceEntityType: 'premium',
        trace: args.trace,
        arrayBinding,
      })
    )
  }

  return proposals
}

function schedulePathForEntity(entity: ScheduleEntity): string | undefined {
  const lower = entity.sourceCollectionPath.toLowerCase()
  if (lower.includes('paymentdates')) return 'payout.paymentDates'
  if (lower.includes('fixingdates')) return 'payout.resetDates.fixingDates'
  if (lower.includes('resetdates')) return 'payout.resetDates'
  if (lower.includes('pricingdates')) return 'payout.pricingDates'
  return undefined
}

function buildScheduleEntityProposals(args: {
  entity: ScheduleEntity
  fieldsByPath: Map<string, Field>
  trace: OrchestrationTrace
}): MappingProposal[] {
  const anchor = firstFieldForEntity(args.entity, args.fieldsByPath)
  const cdmPath = schedulePathForEntity(args.entity)
  if (!anchor || !cdmPath) return []

  return [
    buildEntityProposal({
      anchorField: anchor,
      cdmPath,
      transformation: 'map_grouped_schedule_marker',
      confidence: 90,
      reasoning: `Grouped schedule entity ${args.entity.entityKey} preserves schedule structure before repeated date leaves are assembled.`,
      skillInvoked: 'grouped_entity_schedule',
      semantics: {
        domain: 'temporal',
        dateType: anchor.name.toLowerCase().includes('payment')
          ? 'payment_date'
          : anchor.name.toLowerCase().includes('reset')
            ? 'reset_date'
            : anchor.name.toLowerCase().includes('fixing')
              ? 'fixing_date'
              : undefined,
      },
      grouping: [
        {
          entityType: 'schedule',
          entityKey: args.entity.entityKey,
        },
      ],
      leafKind: 'schedule_marker',
      value: { kind: 'schedule_marker', raw: args.entity.entityKey },
      sourceEntityKey: args.entity.entityKey,
      sourceEntityType: 'schedule',
      trace: args.trace,
      arrayBinding: {
        bindingKey: args.entity.entityKey,
        sourceCollectionPath: args.entity.sourceCollectionPath,
        sourceIndex: args.entity.items[0]?.index,
        cardinality: 'repeating',
      },
      structuralHints: {
        sourcePaths: args.entity.sourcePaths,
        groupedEntity: args.entity.entityKey,
      },
    }),
  ]
}

function isSupersededByEntityProposal(
  proposal: MappingProposal,
  entityProposals: MappingProposal[]
): boolean {
  const matchingEntities = entityProposals.filter(
    entityProposal =>
      entityProposal.sourceEntityKey &&
      proposal.sourceEntityKey === entityProposal.sourceEntityKey
  )
  if (matchingEntities.length === 0) return false

  const lowerName = proposal.sourceField.name.toLowerCase()
  if (
    lowerName === 'role' ||
    lowerName === 'id' ||
    lowerName === 'partyid' ||
    lowerName === 'partyidentifier'
  ) {
    return true
  }

  if (lowerName.includes('partyreference')) {
    return matchingEntities.some(entityProposal =>
      entityProposal.sourceEntityType === 'party' ||
      entityProposal.sourceEntityType === 'stream' ||
      entityProposal.sourceEntityType === 'premium'
    )
  }

  return false
}

function reconcileProposals(args: {
  entityProposals: MappingProposal[]
  fieldProposals: MappingProposal[]
}): MappingProposal[] {
  const kept: MappingProposal[] = [...args.entityProposals]
  const byTargetAndSource = new Map<string, MappingProposal>()

  for (const proposal of kept) {
    const key = `${proposal.sourceField.path}::${canonicalTargetToPath(proposal.ir.target.pathTemplate)}`
    byTargetAndSource.set(key, proposal)
  }

  for (const proposal of args.fieldProposals) {
    if (isSupersededByEntityProposal(proposal, args.entityProposals)) {
      continue
    }
    const key = `${proposal.sourceField.path}::${canonicalTargetToPath(proposal.ir.target.pathTemplate)}`
    const existing = byTargetAndSource.get(key)
    if (
      existing &&
      existing.scope === 'entity' &&
      existing.confidence >= proposal.confidence
    ) {
      continue
    }
    byTargetAndSource.set(key, proposal)
  }

  return Array.from(byTargetAndSource.values())
}

function preferredEntityForField(
  field: Field,
  docCtx: OrchestrationContext
): SourceEntity | undefined {
  const entityKeys = docCtx.sourceModel.fieldToEntityKeys[field.path] ?? []
  if (entityKeys.length === 0) return undefined
  const entities = entityKeys
    .map(key => docCtx.sourceModel.entityIndex[key])
    .filter((entity): entity is SourceEntity => entity != null)
  const lowerName = field.name.toLowerCase()
  const lowerPath = field.path.toLowerCase()

  if (lowerName.includes('partyreference')) {
    if (lowerPath.includes('premium')) {
      return entities.find(entity => entity.kind === 'premium') ?? entities[0]
    }
    if (lowerPath.includes('swapstream')) {
      return entities.find(entity => entity.kind === 'stream') ?? entities[0]
    }
    return entities.find(entity => entity.kind === 'party') ?? entities[0]
  }

  if (
    lowerName === 'role' ||
    lowerName === 'id' ||
    lowerName === 'partyid' ||
    lowerName === 'partyidentifier'
  ) {
    return entities.find(entity => entity.kind === 'party') ?? entities[0]
  }

  if (lowerName.includes('date') || lowerPath.includes('dates')) {
    return entities.find(entity => entity.kind === 'schedule') ?? entities[0]
  }

  return entities[0]
}

/**
 * Field → cardinality pre-pass → matchSkills → (multi) evaluate candidates → optional LLM pick.
 * plans/week2-implementation-plan.md §0 (DEC-01..DEC-07); docs/architecture.md §Main Orchestrator.
 */
export class MappingAgent {
  private readonly cardinalitySkill: Skill

  constructor(private readonly llm?: LLMClient) {
    const c = getSkill('cardinality_checker')
    if (!c) {
      throw new Error(
        'cardinality_checker must be registered before MappingAgent (import src/skills first)'
      )
    }
    this.cardinalitySkill = c
  }

  async generateMappings(fields: Field[]): Promise<MappingProposal[]> {
    const cookbookContext = await loadCookbookPromptContext(fields)
    const docCtx = buildOrchestrationContext(fields)
    const entityProposals = this.generateEntityMappings(fields, docCtx)
    const fieldProposals = await this.generateFieldMappings(fields, docCtx, cookbookContext.guidance)
    const reconciled = reconcileProposals({
      entityProposals,
      fieldProposals,
    })
    for (const proposal of reconciled) {
      proposal.cookbookFamily = cookbookContext.family
      proposal.cookbookRuleIds = cookbookContext.ruleIds
      const assumptions = proposal.assumptionNotes ?? []
      if ((proposal.cookbookRuleIds?.length ?? 0) === 0) {
        assumptions.push('No cookbook rule id available for this mapping decision.')
      }
      proposal.assumptionNotes = assumptions
    }
    return reconciled
  }

  private async generateFieldMappings(
    fields: Field[],
    docCtx: OrchestrationContext,
    cookbookGuidance: string | null
  ): Promise<MappingProposal[]> {
    const proposals: MappingProposal[] = []
    for (const field of fields) {
      const proposal = await this.mapField(field, docCtx, cookbookGuidance)
      const entity = preferredEntityForField(field, docCtx)
      proposal.sourceEntityKey = entity?.entityKey
      proposal.sourceEntityType =
        entity?.kind === 'party' ||
        entity?.kind === 'stream' ||
        entity?.kind === 'premium' ||
        entity?.kind === 'schedule'
          ? entity.kind
          : undefined
      proposals.push(proposal)
    }
    return proposals
  }

  private generateEntityMappings(
    fields: Field[],
    docCtx: OrchestrationContext
  ): MappingProposal[] {
    const fieldsByPath = fieldByPath(fields)
    const trace = makeTrace(docCtx.partyOrder)
    const proposals: MappingProposal[] = []

    for (const entity of docCtx.sourceModel.entities) {
      if (entity.kind === 'party') {
        proposals.push(...buildPartyEntityProposals({ entity, fieldsByPath, trace }))
      } else if (entity.kind === 'stream') {
        proposals.push(...buildStreamEntityProposals({ entity, fieldsByPath, trace }))
      } else if (entity.kind === 'premium') {
        proposals.push(...buildPremiumEntityProposals({ entity, fieldsByPath, trace }))
      } else if (entity.kind === 'schedule') {
        proposals.push(...buildScheduleEntityProposals({ entity, fieldsByPath, trace }))
      }
    }

    return proposals
  }

  private async mapField(
    field: Field,
    docCtx: OrchestrationContext,
    cookbookGuidance: string | null
  ): Promise<MappingProposal> {
    const trace: OrchestrationTrace = {
      ...makeTrace(docCtx.partyOrder),
    }

    const cardInput = CardinalityCheckerInput.parse({
      fieldName: field.name,
      fieldPath: field.path,
      fieldValue: field.value,
      fieldType: field.type,
      context: field.context,
      isArray: field.isArray,
      minOccurs: field.minOccurs,
      maxOccurs: field.maxOccurs,
    })

    const rawHints = await Promise.resolve(this.cardinalitySkill.fn(cardInput))
    const structuralHints = this.cardinalitySkill.outputSchema.parse(
      rawHints
    ) as Record<string, unknown>

    const matched = matchSkills({
      name: field.name,
      type: field.type,
      path: field.path,
    })
    const sorted = sortMatchedSkills(matched)
    const candidateSkills = sorted.map(s => s.name)

    if (sorted.length === 0) {
      return this.unmappedProposal(
        field,
        structuralHints,
        candidateSkills,
        [],
        trace,
        'no_skill_matched'
      )
    }

    if (sorted.length === 1) {
      return this.singleSkillProposal(
        field,
        sorted[0]!,
        structuralHints,
        docCtx,
        candidateSkills,
        trace
      )
    }

    const candidates = await this.evaluateAllCandidates(
      sorted,
      field,
      structuralHints,
      docCtx,
      trace
    )

    if (candidates.length === 0) {
      trace.arbitrationNotes.push('All matched skills failed evaluation')
      return this.unmappedProposal(
        field,
        structuralHints,
        candidateSkills,
        [],
        trace,
        'candidate_eval_all_failed'
      )
    }

    if (!this.llm) {
      return this.multiMatchDeterministic(
        field,
        structuralHints,
        candidateSkills,
        candidates,
        trace
      )
    }

    try {
      return await this.multiMatchWithLlm(
        field,
        structuralHints,
        docCtx,
        sorted,
        candidateSkills,
        candidates,
          trace,
          cookbookGuidance
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      trace.arbitrationNotes.push(
        `LLM error (deterministic fallback): ${msg.slice(0, 400)}`
      )
      return this.multiMatchDeterministic(
        field,
        structuralHints,
        candidateSkills,
        candidates,
        trace
      )
    }
  }

  private unmappedProposal(
    field: Field,
    structuralHints: Record<string, unknown>,
    candidateSkills: string[],
    candidateProposals: CandidateProposal[],
    trace: OrchestrationTrace,
    transformation: string
  ): MappingProposal {
    const rawOutput: LegacySkillOutput = {
      cdmPath: `unmapped.${field.name}`,
      transformation,
      confidence: 0,
      reasoning: 'No applicable skill output',
    }
    const ir = buildMappingIR({
      field,
      skillName: 'none',
      skillOutput: rawOutput,
      candidateSkills,
      needsReview: true,
    })
    return {
      sourceField: field,
      cdmPath: rawOutput.cdmPath,
      transformation: rawOutput.transformation,
      confidence: 0,
      reasoning: rawOutput.reasoning,
      skillInvoked: 'none',
      structuralHints,
      candidateSkills,
      candidateProposals,
      needsReview: true,
      trace,
      scope: 'field',
      ir,
    }
  }

  private async singleSkillProposal(
    field: Field,
    skill: Skill,
    structuralHints: Record<string, unknown>,
    docCtx: OrchestrationContext,
    candidateSkills: string[],
    trace: OrchestrationTrace
  ): Promise<MappingProposal> {
    const base = this.buildCanonicalInput(field, structuralHints, docCtx)
    const parsed = skill.inputSchema.parse(base)
    const raw = await Promise.resolve(skill.fn(parsed))
    const out = skill.outputSchema.parse(raw) as LegacySkillOutput
    const needsReview = out.confidence < env.REVIEW_CONFIDENCE_THRESHOLD
    const ir = buildMappingIR({
      field,
      skillName: skill.name,
      skillOutput: out,
      candidateSkills,
      needsReview,
    })

    return {
      sourceField: field,
      cdmPath: out.cdmPath,
      transformation: out.transformation,
      confidence: out.confidence,
      reasoning: out.reasoning,
      skillInvoked: skill.name,
      structuralHints,
      candidateSkills,
      candidateProposals: [],
      needsReview,
      trace,
      scope: 'field',
      ir,
    }
  }

  private async evaluateAllCandidates(
    skills: Skill[],
    field: Field,
    structuralHints: Record<string, unknown>,
    docCtx: OrchestrationContext,
    trace: OrchestrationTrace
  ): Promise<CandidateProposal[]> {
    const base = this.buildCanonicalInput(field, structuralHints, docCtx)
    const out: CandidateProposal[] = []

    for (const skill of skills) {
      const parsed = skill.inputSchema.safeParse(base)
      if (!parsed.success) continue
      try {
        const raw = await Promise.resolve(skill.fn(parsed.data))
        const po = skill.outputSchema.safeParse(raw)
        if (!po.success) {
          trace.arbitrationNotes.push(
            `candidate ${skill.name}: output schema rejected (${po.error.message.slice(0, 200)})`
          )
          continue
        }
        const d = po.data as LegacySkillOutput
        const ir = buildMappingIR({
          field,
          skillName: skill.name,
          skillOutput: d,
          candidateSkills: skills.map(s => s.name),
          needsReview: d.confidence < env.REVIEW_CONFIDENCE_THRESHOLD,
        })
        out.push({
          skillName: skill.name,
          cdmPath: d.cdmPath,
          transformation: d.transformation,
          confidence: d.confidence,
          reasoning: d.reasoning,
          ir,
          rawOutput: d,
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        trace.arbitrationNotes.push(
          `candidate ${skill.name}: execution error (${msg.slice(0, 200)})`
        )
      }
    }
    return out
  }

  private multiMatchDeterministic(
    field: Field,
    structuralHints: Record<string, unknown>,
    candidateSkills: string[],
    candidates: CandidateProposal[],
    trace: OrchestrationTrace
  ): MappingProposal {
    const winner = candidates[0]!
    const pathConflict = candidates.some(c => c.cdmPath !== winner.cdmPath)
    const confidence = pathConflict
      ? Math.min(...candidates.map(c => c.confidence))
      : winner.confidence

    return {
      sourceField: field,
      cdmPath: winner.cdmPath,
      transformation: winner.transformation,
      confidence,
      reasoning: winner.reasoning,
      skillInvoked: winner.skillName,
      structuralHints,
      candidateSkills,
      candidateProposals: candidates,
      needsReview: true,
      trace,
      scope: 'field',
      ir:
        winner.ir ??
        buildMappingIR({
          field,
          skillName: winner.skillName,
          skillOutput: {
            cdmPath: winner.cdmPath,
            transformation: winner.transformation,
            confidence: winner.confidence,
            reasoning: winner.reasoning,
          },
          candidateSkills,
          needsReview: true,
        }),
    }
  }

  private async multiMatchWithLlm(
    field: Field,
    structuralHints: Record<string, unknown>,
    docCtx: OrchestrationContext,
    sorted: Skill[],
    candidateSkills: string[],
    candidates: CandidateProposal[],
    trace: OrchestrationTrace,
    cookbookGuidance: string | null
  ): Promise<MappingProposal> {
    const tools = getToolsFromSkills(sorted)
    const allowed = new Set(sorted.map(s => s.name))

    const tryPick = (response: LLMResponse): LLMToolCall | null =>
      response.tool_calls?.[0] ?? null

    const isUsablePick = (pick: LLMToolCall | null): pick is LLMToolCall =>
      Boolean(
        pick &&
          allowed.has(pick.name) &&
          candidates.some(c => c.skillName === pick.name)
      )

    const callLlm = async (messages: LLMMessage[]) => {
      trace.llmCallCount++
      return this.llm!.call({ messages, tools })
    }

    const systemContent = buildMultiMatchSystemPrompt()
    let messages: LLMMessage[] = [
      { role: 'system', content: systemContent },
      {
        role: 'user',
        content: buildMultiMatchUserPrompt(
          field,
          candidateSkills,
          structuralHints,
          cookbookGuidance
        ),
      },
    ]

    let response = await callLlm(messages)
    let pick = tryPick(response)

    if (!isUsablePick(pick)) {
      trace.retries = 1
      // Use response.tool_calls[0] here — after `!isUsablePick(pick)` TS can narrow `pick` to `never`
      // in the else-branch (inverted type-predicate + control-flow), which breaks `.name` access.
      const rawTool = response.tool_calls?.[0]
      let reason: string
      if (rawTool == null) {
        reason = 'no tool_calls'
      } else if (!allowed.has(rawTool.name)) {
        reason = `tool not in allowed set: ${rawTool.name}`
      } else {
        reason = `tool ${rawTool.name} had no evaluated candidate`
      }
      messages = [
        { role: 'system', content: systemContent },
        messages[1]!,
        {
          role: 'user',
          content: buildMultiMatchRetryPrompt(
            field,
            candidateSkills,
            structuralHints,
            reason,
            cookbookGuidance
          ),
        },
      ]
      response = await callLlm(messages)
      pick = tryPick(response)
    }

    let winner: CandidateProposal

    if (isUsablePick(pick)) {
      const skill = sorted.find(s => s.name === pick.name)!
      const merged = this.mergeToolInput(field, structuralHints, docCtx, pick.input)
      const parsed = skill.inputSchema.safeParse(merged)
      if (!parsed.success) {
        trace.arbitrationNotes.push(
          `Zod parse failed on merged LLM tool input: ${parsed.error.message}`
        )
      }
      winner = candidates.find(c => c.skillName === pick.name) ?? candidates[0]!
    } else {
      trace.arbitrationNotes.push('LLM did not return a usable tool; priority fallback')
      winner = candidates[0]!
    }

    const needsReview =
      trace.arbitrationNotes.length > 0 ||
      winner.confidence < env.REVIEW_CONFIDENCE_THRESHOLD

    return {
      sourceField: field,
      cdmPath: winner.cdmPath,
      transformation: winner.transformation,
      confidence: winner.confidence,
      reasoning: [winner.reasoning, ...trace.arbitrationNotes].filter(Boolean).join(' | '),
      skillInvoked: winner.skillName,
      structuralHints,
      candidateSkills,
      candidateProposals: candidates,
      needsReview,
      trace,
      scope: 'field',
      ir:
        winner.ir ??
        buildMappingIR({
          field,
          skillName: winner.skillName,
          skillOutput: {
            cdmPath: winner.cdmPath,
            transformation: winner.transformation,
            confidence: winner.confidence,
            reasoning: winner.reasoning,
          },
          candidateSkills,
          needsReview,
        }),
    }
  }

  private buildCanonicalInput(
    field: Field,
    structuralHints: Record<string, unknown>,
    docCtx: OrchestrationContext
  ): Record<string, unknown> {
    const ctx: Record<string, unknown> = {
      ...(field.context as Record<string, unknown> | undefined),
      structuralHints,
      partyOrder: [...docCtx.partyOrder],
      sourceEntityKeys: docCtx.sourceModel.fieldToEntityKeys[field.path] ?? [],
    }
    return {
      fieldName: field.name,
      fieldPath: field.path,
      fieldValue: field.value,
      fieldType: field.type,
      context: ctx,
    }
  }

  /**
   * D7: model cannot override field identity; only enrich `context` and other allowed keys.
   */
  private mergeToolInput(
    field: Field,
    structuralHints: Record<string, unknown>,
    docCtx: OrchestrationContext,
    modelInput: Record<string, unknown>
  ): Record<string, unknown> {
    const baseContext: Record<string, unknown> = {
      ...(field.context as Record<string, unknown> | undefined),
      structuralHints,
      partyOrder: [...docCtx.partyOrder],
      sourceEntityKeys: docCtx.sourceModel.fieldToEntityKeys[field.path] ?? [],
    }
    const modelCtx =
      modelInput.context != null &&
      typeof modelInput.context === 'object' &&
      !Array.isArray(modelInput.context)
        ? (modelInput.context as Record<string, unknown>)
        : {}

    const { context: _drop, ...restModel } = modelInput

    return {
      ...restModel,
      fieldName: field.name,
      fieldPath: field.path,
      fieldValue: field.value,
      fieldType: field.type,
      context: { ...baseContext, ...modelCtx },
    }
  }
}
