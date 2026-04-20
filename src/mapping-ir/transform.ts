import type { Field } from '../parser/types'
import { env } from '../config'
import type {
  ArrayBindingHint,
  CanonicalRoot,
  CanonicalSegment,
  GroupingHint,
  LegacySkillOutput,
  MappingDiagnostic,
  MappingIR,
  MappingSemanticMeta,
  MappingValue,
  TargetPathTemplate,
} from './types'
import { detectSourceFormatFromField } from './types'

function rootKeyFromEnv(): CanonicalRoot {
  const raw = env.CDM_ORCHESTRATOR_ROOT_TYPE
  if (raw === 'Trade') return 'trade'
  if (raw === 'BusinessEvent') return 'businessEvent'
  return 'tradeState'
}

function inferParentPath(path: string): string | undefined {
  if (path.startsWith('$')) {
    const idx = path.lastIndexOf('.')
    if (idx <= 0) return undefined
    return path.slice(0, idx)
  }
  const idx = path.lastIndexOf('/')
  if (idx <= 0) return undefined
  return path.slice(0, idx)
}

function normalizeBindingKey(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

function inferArrayBindingKey(
  name: string,
  binding: string,
  semantics: MappingSemanticMeta,
  diagnostics: MappingDiagnostic[]
): string {
  if (binding === '0') {
    if (semantics.cdmCounterpartyRole === 'PARTY_1') return 'counterparty_primary'
    return `${normalizeBindingKey(name)}_0`
  }
  if (binding === '1') {
    if (semantics.cdmCounterpartyRole === 'PARTY_2') return 'counterparty_secondary'
    return `${normalizeBindingKey(name)}_1`
  }
  if (binding === 'i') {
    diagnostics.push({
      code: 'legacy_path_binding',
      message: `Legacy anonymous array binding found in target path segment "${name}[i]"`,
      severity: 'warn',
    })
    return `${normalizeBindingKey(name)}_unbound`
  }
  return `${normalizeBindingKey(name)}_${normalizeBindingKey(binding)}`
}

export function parseLegacyCdmPath(
  rawPath: string,
  semantics: MappingSemanticMeta,
  defaultRoot = rootKeyFromEnv()
): { pathTemplate: TargetPathTemplate; diagnostics: MappingDiagnostic[] } {
  const diagnostics: MappingDiagnostic[] = []
  const cleaned = rawPath.trim()

  if (cleaned.startsWith('unmapped.')) {
    diagnostics.push({
      code: 'legacy_unmapped_path',
      message: `Legacy unmapped path preserved: ${cleaned}`,
      severity: 'info',
    })
  }

  const parts = cleaned.split('.').filter(Boolean)
  const segments: CanonicalSegment[] = parts.map(part => {
    const match = part.match(/^([^\[]+)(?:\[(.+)\])?$/)
    if (!match) {
      return { kind: 'property', name: part }
    }
    const [, name, binding] = match
    if (binding != null) {
      return {
        kind: 'array',
        name,
        bindingKey: inferArrayBindingKey(name, binding, semantics, diagnostics),
      }
    }
    return { kind: 'property', name }
  })

  return {
    pathTemplate: {
      root: defaultRoot,
      segments,
    },
    diagnostics,
  }
}

function inferDomain(skillName: string): MappingSemanticMeta['domain'] {
  switch (skillName) {
    case 'party_resolver':
      return 'party'
    case 'temporal_mapper':
      return 'temporal'
    case 'unit_normalizer':
      return 'unit'
    case 'floating_rate_index_resolver':
      return 'floating_rate'
    case 'ir_swap_resolver':
      return 'interest_rate_product'
    case 'fpml_header_metadata':
      return 'generic'
    case 'cardinality_checker':
      return 'cardinality'
    default:
      return 'generic'
  }
}

function inferLeafKind(
  skillOutput: LegacySkillOutput,
  semantics: MappingSemanticMeta
): MappingIR['target']['leafKind'] {
  if (semantics.cdmEnum) return 'enum'
  if (skillOutput.hasSchedule === true) return 'schedule_marker'
  if (semantics.partyRole || skillOutput.cdmPath.includes('counterparty')) return 'reference'
  if (skillOutput.cdmPath.endsWith('payout') || skillOutput.cdmPath.endsWith('priceQuantity')) {
    return 'object_marker'
  }
  return 'scalar'
}

function inferGroupingHints(
  field: Field,
  skillOutput: LegacySkillOutput,
  semantics: MappingSemanticMeta
): GroupingHint[] {
  const hints: GroupingHint[] = []
  const path = field.path.toLowerCase()

  if (semantics.partyRole || path.includes('party')) {
    const relation =
      semantics.partyRole === 'buyer'
        ? 'buyer'
        : semantics.partyRole === 'seller'
          ? 'seller'
          : semantics.partyRole === 'payer'
            ? 'payer'
            : semantics.partyRole === 'receiver'
              ? 'receiver'
              : semantics.partyRole === 'counterparty'
                ? 'counterparty'
                : undefined
    const entityKey =
      semantics.cdmCounterpartyRole === 'PARTY_1'
        ? 'counterparty_primary'
        : semantics.cdmCounterpartyRole === 'PARTY_2'
          ? 'counterparty_secondary'
          : normalizeBindingKey(field.value || field.name || 'party')
    hints.push({
      entityType: semantics.cdmCounterpartyRole ? 'counterparty' : 'party',
      entityKey,
      relation,
      rankHint:
        semantics.cdmCounterpartyRole === 'PARTY_1'
          ? 0
          : semantics.cdmCounterpartyRole === 'PARTY_2'
            ? 1
            : undefined,
    })
  }

  if (path.includes('swapstream')) {
    const match = field.path.match(/swapStream(?:\[(\d+)\])?/i)
    const order = match?.[1] != null ? Number(match[1]) : 0
    hints.push({
      entityType: 'stream',
      entityKey: `payout_stream_${order + 1}`,
      relation: semantics.rateType,
      rankHint: order,
    })
    hints.push({
      entityType: 'payout',
      entityKey: `payout_stream_${order + 1}`,
      relation: skillOutput.payoutType,
      rankHint: order,
    })
  }

  if (path.includes('premium')) {
    hints.push({
      entityType: 'premium',
      entityKey: 'premium_main',
    })
  }

  if (skillOutput.hasSchedule === true || field.isArray === true || path.includes('dates')) {
    hints.push({
      entityType: 'schedule',
      entityKey: normalizeBindingKey(field.name || 'schedule') || 'schedule_main',
    })
  }

  return hints
}

function inferArrayBinding(
  field: Field,
  pathTemplate: TargetPathTemplate,
  grouping: GroupingHint[],
  hasSchedule: boolean
): ArrayBindingHint | undefined {
  const arr = pathTemplate.segments.find(
    (segment): segment is Extract<CanonicalSegment, { kind: 'array' }> =>
      segment.kind === 'array'
  )
  const sourceIndexMatch = field.path.match(/\[(\d+)\](?!.*\[\d+\])/)
  if (!arr) return undefined
  return {
    bindingKey: arr.bindingKey,
    sourceCollectionPath: inferParentPath(field.path),
    sourceIndex: sourceIndexMatch?.[1] != null ? Number(sourceIndexMatch[1]) : undefined,
    cardinality: field.isArray ? 'repeating' : field.maxOccurs === 'unbounded' ? 'repeating' : 'single',
  }
}

function inferValue(
  field: Field,
  skillOutput: LegacySkillOutput,
  semantics: MappingSemanticMeta,
  leafKind: MappingIR['target']['leafKind']
): MappingValue {
  if (semantics.cdmEnum) {
    return {
      kind: 'enum',
      raw: field.value,
      normalized: semantics.cdmEnum,
    }
  }

  if (semantics.tenorPeriod != null) {
    const match = semantics.tenorPeriod.match(/^(\d+)([DWMY])$/)
    if (match) {
      return {
        kind: 'period',
        raw: field.value,
        multiplier: Number(match[1]),
        unit: match[2] as 'D' | 'W' | 'M' | 'Y',
      }
    }
  }

  if (leafKind === 'reference') {
    return {
      kind: 'reference',
      refType: semantics.domain === 'party' ? 'party' : 'generic',
      raw: field.value,
      resolvedId: field.value,
    }
  }

  if (leafKind === 'schedule_marker') {
    return {
      kind: 'schedule_marker',
      raw: field.value,
    }
  }

  if (leafKind === 'object_marker') {
    return {
      kind: 'object_marker',
      raw: field.value,
    }
  }

  if (skillOutput.transformation.startsWith('map_') && skillOutput.cdmPath.endsWith('payout')) {
    return {
      kind: 'composite_hint',
      raw: field.value,
      hint: skillOutput.transformation,
    }
  }

  return {
    kind: 'raw_scalar',
    value: field.value,
  }
}

export function buildMappingIR(args: {
  field: Field
  skillName: string
  skillOutput: LegacySkillOutput
  candidateSkills: string[]
  needsReview: boolean
}): MappingIR {
  const { field, skillName, skillOutput, candidateSkills, needsReview } = args
  const semantics: MappingSemanticMeta = {
    domain: inferDomain(skillName),
    cdmCounterpartyRole: skillOutput.cdmCounterpartyRole,
    cdmEnum: skillOutput.cdmEnum,
    tenor: skillOutput.tenor,
    tenorPeriod: skillOutput.tenorPeriod,
    normalizedUnit: skillOutput.normalizedUnit,
    unitType:
      typeof skillOutput.unitType === 'string'
        ? (skillOutput.unitType as MappingSemanticMeta['unitType'])
        : undefined,
    productCategory:
      typeof skillOutput.productCategory === 'string'
        ? skillOutput.productCategory
        : undefined,
    payoutType:
      typeof skillOutput.payoutType === 'string' ? skillOutput.payoutType : undefined,
    rateType: typeof skillOutput.rateType === 'string' ? skillOutput.rateType : undefined,
    dateType: typeof skillOutput.dateType === 'string' ? skillOutput.dateType : undefined,
    indexCategory:
      typeof skillOutput.indexCategory === 'string' ? skillOutput.indexCategory : undefined,
  }

  if (typeof skillOutput.partyRole === 'string') {
    semantics.partyRole = skillOutput.partyRole as MappingSemanticMeta['partyRole']
  }

  const parsed = parseLegacyCdmPath(skillOutput.cdmPath, semantics)
  const leafKind = inferLeafKind(skillOutput, semantics)
  const grouping = inferGroupingHints(field, skillOutput, semantics)
  let arrayBinding = inferArrayBinding(field, parsed.pathTemplate, grouping, skillOutput.hasSchedule === true)
  const diagnostics: MappingDiagnostic[] = [...parsed.diagnostics]

  if (!arrayBinding) {
    const sourceIndexMatch = field.path.match(/\[(\d+)\](?!.*\[\d+\])/)
    const scheduleHint = grouping.find(h => h.entityType === 'schedule')
    if (sourceIndexMatch || skillOutput.hasSchedule === true || field.isArray === true) {
      arrayBinding = {
        bindingKey:
          scheduleHint?.entityKey ??
          `${normalizeBindingKey(field.name || 'array')}_${sourceIndexMatch?.[1] ?? 'group'}`,
        sourceCollectionPath: inferParentPath(field.path),
        sourceIndex: sourceIndexMatch?.[1] != null ? Number(sourceIndexMatch[1]) : undefined,
        cardinality: 'repeating',
      }
    }
  }

  if (
    parsed.pathTemplate.segments.some(
      segment => segment.kind === 'array' && segment.bindingKey.endsWith('_unbound')
    )
  ) {
    diagnostics.push({
      code: 'missing_binding',
      message: `Target path ${skillOutput.cdmPath} still depends on an anonymous array binding`,
      severity: 'error',
    })
  }

  if (candidateSkills.length > 1) {
    diagnostics.push({
      code: 'ambiguous_skill',
      message: `Multiple candidate skills matched: ${candidateSkills.join(', ')}`,
      severity: needsReview ? 'warn' : 'info',
    })
  }

  return {
    version: 'v2',
    source: {
      path: field.path,
      name: field.name,
      value: field.value,
      parentPath: inferParentPath(field.path),
      parentName: field.context?.parentName as string | undefined,
      ancestors: Array.isArray(field.context?.ancestors)
        ? (field.context?.ancestors as string[])
        : [],
      sourceFormat: detectSourceFormatFromField(field),
    },
    target: {
      pathTemplate: parsed.pathTemplate,
      leafKind,
      legacyPath: skillOutput.cdmPath,
    },
    value: inferValue(field, skillOutput, semantics, leafKind),
    semantics,
    grouping,
    arrayBinding,
    confidence: skillOutput.confidence,
    transformation: skillOutput.transformation,
    reasoning: skillOutput.reasoning,
    skillInvoked: skillName,
    candidateSkills,
    needsReview,
    diagnostics,
  }
}

export function canonicalTargetToPath(target: TargetPathTemplate): string {
  return target.segments
    .map(segment =>
      segment.kind === 'property'
        ? segment.name
        : `${segment.name}[${segment.bindingKey}]`
    )
    .join('.')
}

export function isAssemblyReady(mapping: MappingIR): boolean {
  return Boolean(
    mapping.target.pathTemplate &&
      mapping.target.leafKind &&
      mapping.value &&
      (mapping.arrayBinding?.cardinality !== 'repeating' ||
        mapping.arrayBinding?.bindingKey)
  )
}
