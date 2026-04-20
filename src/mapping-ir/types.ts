import type { Field } from '../parser/types'

export type MappingConfidence = number

export type SourceFormat = 'xml' | 'json' | 'unknown'

export type SourceLocator = {
  path: string
  name: string
  value?: string
  parentPath?: string
  parentName?: string
  ancestors: string[]
  sourceFormat: SourceFormat
}

export type MappingValue =
  | { kind: 'raw_scalar'; value?: string }
  | { kind: 'enum'; raw?: string; normalized: string }
  | { kind: 'period'; raw?: string; multiplier: number; unit: 'D' | 'W' | 'M' | 'Y' }
  | { kind: 'reference'; refType: 'party' | 'trade' | 'stream' | 'generic'; raw?: string; resolvedId?: string }
  | { kind: 'schedule_marker'; raw?: string }
  | { kind: 'object_marker'; raw?: string }
  | { kind: 'composite_hint'; raw?: string; hint: string }

export type CanonicalRoot = 'trade' | 'tradeState' | 'businessEvent'

export type CanonicalSegment =
  | { kind: 'property'; name: string }
  | { kind: 'array'; name: string; bindingKey: string }

export type TargetPathTemplate = {
  root: CanonicalRoot
  segments: CanonicalSegment[]
}

export type MappingSemanticDomain =
  | 'party'
  | 'temporal'
  | 'unit'
  | 'floating_rate'
  | 'interest_rate_product'
  | 'cardinality'
  | 'generic'

export type MappingSemanticMeta = {
  domain: MappingSemanticDomain
  partyRole?:
    | 'buyer'
    | 'seller'
    | 'payer'
    | 'payee'
    | 'receiver'
    | 'counterparty'
    | 'calculation_agent'
  cdmCounterpartyRole?: 'PARTY_1' | 'PARTY_2' | 'NONE'
  cdmEnum?: string
  tenor?: string
  tenorPeriod?: string
  normalizedUnit?: string
  unitType?:
    | 'currency'
    | 'quantity'
    | 'notional'
    | 'amount'
    | 'price'
    | 'rate'
    | 'percentage'
    | 'multiplier'
    | 'unknown'
  productCategory?: string
  payoutType?: string
  rateType?: string
  dateType?: string
  indexCategory?: string
}

export type GroupingHint = {
  entityType: 'party' | 'counterparty' | 'stream' | 'premium' | 'schedule' | 'payout'
  entityKey: string
  relation?: string
  rankHint?: number
}

export type ArrayBindingHint = {
  bindingKey: string
  sourceCollectionPath?: string
  sourceIndex?: number
  cardinality: 'single' | 'optional' | 'repeating'
}

export type MappingDiagnostic =
  | { code: 'ambiguous_skill'; message: string; severity: 'info' | 'warn' | 'error' }
  | { code: 'target_collision_risk'; message: string; severity: 'warn' | 'error' }
  | { code: 'missing_binding'; message: string; severity: 'warn' | 'error' }
  | { code: 'container_vs_leaf_overlap'; message: string; severity: 'warn' | 'error' }
  | { code: 'legacy_path_binding'; message: string; severity: 'info' | 'warn' | 'error' }
  | { code: 'legacy_unmapped_path'; message: string; severity: 'info' | 'warn' | 'error' }

export type MappingIR = {
  version: 'v2'
  source: SourceLocator
  target: {
    pathTemplate: TargetPathTemplate
    leafKind: 'scalar' | 'enum' | 'reference' | 'object_marker' | 'schedule_marker'
    legacyPath: string
  }
  value: MappingValue
  semantics: MappingSemanticMeta
  grouping: GroupingHint[]
  arrayBinding?: ArrayBindingHint
  confidence: MappingConfidence
  transformation: string
  reasoning: string
  skillInvoked: string
  candidateSkills: string[]
  needsReview: boolean
  diagnostics: MappingDiagnostic[]
}

export type LegacySkillOutput = {
  cdmPath: string
  transformation: string
  confidence: number
  reasoning: string
  todos?: string[]
  partyRole?: string
  cdmCounterpartyRole?: 'PARTY_1' | 'PARTY_2' | 'NONE'
  cdmEnum?: string
  tenor?: string
  tenorPeriod?: string
  normalizedUnit?: string
  unitType?: string
  productCategory?: string
  payoutType?: string
  rateType?: string
  dateType?: string
  indexCategory?: string
  hasSchedule?: boolean
  meaning?: string
  economicCategory?: string
  dateKind?: string
  ambiguityFlags?: string[]
  alternatives?: Array<{
    cdmPath: string
    confidence: number
    rationale: string
  }>
  inferenceBasis?: string
  patternSource?: string
  confidenceRationale?: string
  analystQuestion?: string
  [key: string]: unknown
}

export type MappingPayloadVersion = 'v1' | 'v2'

export type MappingProposalPayload = {
  version: MappingPayloadVersion
  ir?: MappingIR
}

export const detectSourceFormatFromField = (field: Field): SourceFormat => {
  if (field.path.startsWith('/')) return 'xml'
  if (field.path.startsWith('$')) return 'json'
  return 'unknown'
}
