import { basename } from 'node:path'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { LLMClient } from '../agent/types'
import { extractPossiblyTruncatedJsonObject, parseStructuredResponse } from './io'
import type { DraftLogger } from './logging'
import { buildFolderSynthesisMessages } from './prompts'
import type {
  AgentPlaybookBranch,
  DocumentSectionFrequency,
  DraftArtifacts,
  DraftAgentPlaybook,
  DraftConclusion,
  DraftEvidenceCoverage,
  EnrichmentSummary,
  DraftFolderSynthesis,
  DraftIgnoredExample,
  DraftPairAnalysis,
  DraftPairSelectionResult,
  DraftSynthesisDiagnostics,
  FolderHeaderBoilerplateSummary,
  MappingObservation,
  PairHighlight,
  StableMappingRule,
  TentativeRepeatedPattern,
  TransformationSummary,
  TransformationObservation,
  VariantSummary,
} from './types'

const SectionFrequencySchema = z.object({
  section: z.string().min(1),
  count: z.number().int().nonnegative(),
  total: z.number().int().positive(),
})

const StableRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  strength: z.enum(['strong recurring pattern', 'moderate recurring pattern', 'weak pattern']),
  evidenceCount: z.number().int().nonnegative(),
  sourcePattern: z.string().min(1),
  targetPattern: z.string().min(1),
  explanation: z.string().min(1),
  whyItWorksThisWay: z.string().min(1),
  exampleFiles: z.array(z.string()),
  caveats: z.array(z.string()),
})

const TransformationSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    'split',
    'merge',
    'normalization',
    'reference resolution',
    'enrichment',
    'wrapper insertion',
    'nesting change',
  ]),
  description: z.string().min(1),
  sourceSide: z.string().min(1),
  targetSide: z.string().min(1),
  evidenceCount: z.number().int().nonnegative(),
  exampleFiles: z.array(z.string()),
  notes: z.array(z.string()),
})

const VariantSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  seenIn: z.array(z.string()),
  impactOnGeneralization: z.string().min(1),
})

const EnrichmentSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  classification: z.enum(['suspected enrichment', 'normalization', 'unclear']),
  evidence: z.array(z.string()),
  caution: z.array(z.string()),
})

const TentativeRepeatedPatternSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['mapping', 'transformation', 'enrichment']),
  strength: z.enum(['strong recurring pattern', 'moderate recurring pattern', 'weak pattern']),
  description: z.string().min(1),
  evidenceCount: z.number().int().nonnegative(),
  exampleFiles: z.array(z.string()),
  notes: z.array(z.string()),
})

const PairHighlightSchema = z.object({
  fpmlFile: z.string().min(1),
  cdmFile: z.string().min(1),
  mainFpmlSections: z.string().min(1),
  mainCdmSections: z.string().min(1),
  importantMappings: z.array(z.string()),
  importantTransformation: z.string().min(1),
  uncertainty: z.array(z.string()),
})

const DraftEvidenceCoverageSchema = z.object({
  matchedPairCount: z.number().int().nonnegative(),
  structuralPairCount: z.number().int().nonnegative(),
  semanticPairCount: z.number().int().nonnegative(),
  fullSemanticPairCount: z.number().int().nonnegative(),
  salvagedSemanticPairCount: z.number().int().nonnegative(),
  failedSemanticPairCount: z.number().int().nonnegative(),
  structuralBasisNote: z.string().min(1),
  semanticBasisNote: z.string().min(1),
})

const AgentPlaybookBranchSchema = z.object({
  name: z.string().min(1),
  whenToUse: z.string().min(1),
  sourceSignals: z.array(z.string()),
  mappingFocus: z.array(z.string()),
  cautions: z.array(z.string()),
})

const DraftAgentPlaybookSchema = z.object({
  summary: z.string().min(1),
  canonicalSteps: z.array(z.string()),
  recurringRules: z.array(z.string()),
  transformationPatterns: z.array(z.string()),
  productSpecificBranches: z.array(AgentPlaybookBranchSchema),
  validationChecks: z.array(z.string()),
  doNotAssume: z.array(z.string()),
})

const DraftSemanticSynthesisSchema = z.object({
  stableMappingPatterns: z.array(StableRuleSchema),
  repeatedNonLiteralTransformations: z.array(TransformationSummarySchema),
  folderLevelPrinciples: z.array(z.string()),
  variantsAndExceptions: z.array(VariantSummarySchema),
  suspectedEnrichmentOrDefaultBehavior: z.array(EnrichmentSummarySchema),
  openQuestions: z.array(z.string()),
  draftConclusion: z.object({
    mostReusableFindings: z.array(z.string()),
    safeToGeneralize: z.array(z.string()),
    remainTentative: z.array(z.string()),
  }),
})

const DraftFolderSynthesisSchema = z.object({
  folder: z.string().min(1),
  evidenceCoverage: DraftEvidenceCoverageSchema,
  repeatedFpmlStructure: z.object({
    headerAndBoilerplate: z.array(z.string()),
    topLevelSections: z.array(SectionFrequencySchema),
    nestedStructures: z.array(z.string()),
    optionalSections: z.array(SectionFrequencySchema),
  }),
  repeatedCdmStructure: z.object({
    topLevelSections: z.array(SectionFrequencySchema),
    wrappersAndScaffolding: z.array(z.string()),
    optionalSections: z.array(SectionFrequencySchema),
  }),
  stableMappingPatterns: z.array(StableRuleSchema),
  repeatedNonLiteralTransformations: z.array(TransformationSummarySchema),
  tentativeRepeatedPatterns: z.array(TentativeRepeatedPatternSchema),
  folderLevelPrinciples: z.array(z.string()),
  variantsAndExceptions: z.array(VariantSummarySchema),
  suspectedEnrichmentOrDefaultBehavior: z.array(EnrichmentSummarySchema),
  repeatedHeaderAndCommonBoilerplateSummary: z.object({
    commonFpmlHeaderBehavior: z.array(z.string()),
    commonTradeScaffolding: z.array(z.string()),
    commonCdmBoilerplateBehavior: z.array(z.string()),
  }),
  openQuestions: z.array(z.string()),
  pairLevelHighlights: z.array(PairHighlightSchema),
  agentPlaybook: DraftAgentPlaybookSchema,
  draftConclusion: z.object({
    mostReusableFindings: z.array(z.string()),
    safeToGeneralize: z.array(z.string()),
    remainTentative: z.array(z.string()),
  }),
  sourceAppendixNotes: z.array(z.string()),
})

const RAW_RESPONSE_PREVIEW_LIMIT = 1200
const MARKDOWN_HIGHLIGHT_LIMIT = 10
const MARKDOWN_HIGHLIGHT_TRUNCATION_THRESHOLD = 12
const MIN_REPEATED_EVIDENCE_COUNT = 2
const LARGE_FOLDER_STABLE_RULE_PAIR_THRESHOLD = 10
const LARGE_FOLDER_STABLE_RULE_RATIO = 0.15
type DraftSemanticSynthesis = z.infer<typeof DraftSemanticSynthesisSchema>
type SemanticSynthesisPromptInput = {
  tentativeRepeatedPatterns: TentativeRepeatedPattern[]
  representativeHighlights: PairHighlight[]
  openQuestions: string[]
}

function computeSectionFrequencies(
  pairAnalyses: DraftPairAnalysis[],
  selector: (analysis: DraftPairAnalysis) => string[]
): DocumentSectionFrequency[] {
  const total = Math.max(pairAnalyses.length, 1)
  const counts = new Map<string, number>()
  for (const analysis of pairAnalyses) {
    const uniqueSections = new Set(selector(analysis))
    for (const section of uniqueSections) {
      counts.set(section, (counts.get(section) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([section, count]) => ({ section, count, total }))
}

function splitFrequencies(frequencies: DocumentSectionFrequency[]): {
  repeated: DocumentSectionFrequency[]
  optional: DocumentSectionFrequency[]
} {
  return {
    repeated: frequencies.filter(item => item.count >= Math.max(2, Math.ceil(item.total * 0.6))),
    optional: frequencies.filter(item => item.count < Math.max(2, Math.ceil(item.total * 0.6))),
  }
}

function uniqueLines(lines: string[]): string[] {
  return Array.from(new Set(lines.map(line => line.trim()).filter(Boolean)))
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizePathList(paths: string[]): string[] {
  return uniqueLines(paths.map(path => path.replaceAll('\\', '/'))).sort((a, b) => a.localeCompare(b))
}

function normalizePunctuation(value: string): string {
  return value
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/â€”/g, '-')
}

function splitPathTokens(path: string): string[] {
  return normalizePunctuation(path)
    .replaceAll('\\', '/')
    .replace(/\[(\d+)\]/g, '')
    .split(/[/.[\]]+/)
    .map(token => token.trim())
    .filter(Boolean)
}

function normalizePathToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function buildPathSignature(paths: string[]): string {
  const signatures = normalizePathList(paths)
    .map(path =>
      splitPathTokens(path)
        .map(normalizePathToken)
        .filter(token => token && token !== 'fpml' && token !== '$')
        .slice(-3)
        .join('.')
    )
    .filter(Boolean)
  return uniqueLines(signatures).sort((a, b) => a.localeCompare(b)).join('|')
}

function buildFriendlyPathSummary(paths: string[]): string {
  const signature = buildPathSignature(paths)
  return signature || buildShortPathSummary(paths)
}

function canonicalizeSemanticNote(note: string): string {
  return normalizeWhitespace(normalizePunctuation(note))
    .toLowerCase()
    .replace(/\bpartytradeidentifier\b/g, 'trade identifier')
    .replace(/\bparty trade identifier\b/g, 'trade identifier')
    .replace(/\bglobalkey\b/g, 'global key')
    .replace(/\btrade id\b/g, 'trade identifier')
    .replace(/\bz-?timestamp\b/g, 'z timestamp')
    .replace(/\bremove(?:d)? trailing z\b/g, 'z removed')
    .replace(/\bdate only\b/g, 'date normalized')
    .replace(/\bpricequantity\b/g, 'price quantity')
}

function deriveRecurringPatternStrength(count: number, total: number): TentativeRepeatedPattern['strength'] {
  if (count >= Math.max(3, Math.ceil(total * 0.5))) {
    return 'strong recurring pattern'
  }
  if (count >= 2) {
    return 'moderate recurring pattern'
  }
  return 'weak pattern'
}

function buildShortPathSummary(paths: string[]): string {
  return paths.length > 0 ? paths.join(', ') : 'unspecified paths'
}

function buildTentativePatternDescription(args: {
  kind: TentativeRepeatedPattern['kind']
  note: string
  sourcePaths?: string[]
  targetPaths: string[]
  classification?: MappingObservation['classification']
}): string {
  const note = normalizeWhitespace(args.note)
  if (args.kind === 'mapping') {
    const source = buildFriendlyPathSummary(args.sourcePaths ?? [])
    const target = buildFriendlyPathSummary(args.targetPaths)
    const classification = args.classification ? `${args.classification} mapping` : 'mapping'
    return `${note} (${classification}; ${source} -> ${target})`
  }
  if (args.kind === 'transformation') {
    const source = buildFriendlyPathSummary(args.sourcePaths ?? [])
    const target = buildFriendlyPathSummary(args.targetPaths)
    return `${note} (${source} -> ${target})`
  }
  return `${note} (${buildFriendlyPathSummary(args.targetPaths)})`
}

function buildMappingGrouping(args: {
  note: string
  sourcePaths: string[]
  targetPaths: string[]
  classification: MappingObservation['classification']
}): {
  key: string
  description: string
} {
  const note = canonicalizeSemanticNote(args.note)
  const sourceSignature = buildPathSignature(args.sourcePaths)
  const targetSignature = buildPathSignature(args.targetPaths)
  const sourceLabel = buildFriendlyPathSummary(args.sourcePaths)
  const targetLabel = buildFriendlyPathSummary(args.targetPaths)
  const combined = `${note} ${sourceSignature} ${targetSignature}`

  if (/(trade date|value date|effective date|expiration date|expiry date)/.test(combined) && /(normal|date|timestamp|z )/.test(combined)) {
    return {
      key: `mapping::date-normalization::${sourceSignature}::${targetSignature}`,
      description: `Date-like fields repeatedly normalize from ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (/(trade identifier|tradeidentifier)/.test(combined) && /tradeidentifier|identifier/.test(combined)) {
    return {
      key: `mapping::trade-identifier::${sourceSignature}::${targetSignature}`,
      description: `Trade identifiers repeatedly map from ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (/party/.test(combined) && /(reference|identifier|counterparty|payer|receiver)/.test(combined)) {
    return {
      key: `mapping::party-reference::${sourceSignature}::${targetSignature}`,
      description: `Party references repeatedly resolve from ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (/premium/.test(combined) && /(quantity|transfer|settlement|price)/.test(combined)) {
    return {
      key: `mapping::premium-reshaping::${sourceSignature}::${targetSignature}`,
      description: `Premium and settlement terms repeatedly reshape from ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (/(price|rate|amount|notional|quantity)/.test(combined) && /(pricequantity|quantity|price|measure)/.test(combined)) {
    return {
      key: `mapping::economic-reshaping::${sourceSignature}::${targetSignature}`,
      description: `Economic terms repeatedly reshape from ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (/settlement/.test(combined)) {
    return {
      key: `mapping::settlement-terms::${sourceSignature}::${targetSignature}`,
      description: `Settlement terms repeatedly map from ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (/(option|barrier|digital|touch|exercise|style)/.test(combined)) {
    return {
      key: `mapping::option-terms::${sourceSignature}::${targetSignature}`,
      description: `Option-specific terms repeatedly map from ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (/product/.test(combined) && /(type|classification|identifier)/.test(combined)) {
    return {
      key: `mapping::product-normalization::${sourceSignature}::${targetSignature}`,
      description: `Product classification data repeatedly normalizes from ${sourceLabel} into ${targetLabel}.`,
    }
  }

  return {
    key: `mapping::${args.classification}::${note}::${sourceSignature}::${targetSignature}`,
    description: buildTentativePatternDescription({
      kind: 'mapping',
      note: args.note,
      sourcePaths: args.sourcePaths,
      targetPaths: args.targetPaths,
      classification: args.classification,
    }),
  }
}

function buildTransformationGrouping(args: {
  note: string
  sourcePaths: string[]
  targetPaths: string[]
  type: TransformationObservation['type']
}): {
  key: string
  description: string
} {
  const note = canonicalizeSemanticNote(args.note)
  const sourceSignature = buildPathSignature(args.sourcePaths)
  const targetSignature = buildPathSignature(args.targetPaths)
  const sourceLabel = buildFriendlyPathSummary(args.sourcePaths)
  const targetLabel = buildFriendlyPathSummary(args.targetPaths)
  const typeLabel = args.type.replaceAll('_', ' ')
  const combined = `${note} ${sourceSignature} ${targetSignature} ${typeLabel}`

  if (args.type === 'reference_resolution' || /reference|party/.test(combined)) {
    return {
      key: `transformation::reference-resolution::${sourceSignature}::${targetSignature}`,
      description: `Reference resolution repeatedly converts ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (args.type === 'normalization' || /normalize|timestamp|date|z removed/.test(combined)) {
    return {
      key: `transformation::normalization::${sourceSignature}::${targetSignature}`,
      description: `Normalization repeatedly reshapes ${sourceLabel} into ${targetLabel}.`,
    }
  }
  if (args.type === 'wrapper_insertion' || /wrapper|scaffold|container/.test(combined)) {
    return {
      key: `transformation::wrapper-insertion::${sourceSignature}::${targetSignature}`,
      description: `Wrapper insertion repeatedly nests ${sourceLabel} under ${targetLabel}.`,
    }
  }
  if (args.type === 'split') {
    return {
      key: `transformation::split::${sourceSignature}::${targetSignature}`,
      description: `Split transformations repeatedly expand ${sourceLabel} across ${targetLabel}.`,
    }
  }
  if (args.type === 'merge') {
    return {
      key: `transformation::merge::${sourceSignature}::${targetSignature}`,
      description: `Merge transformations repeatedly combine ${sourceLabel} into ${targetLabel}.`,
    }
  }

  return {
    key: `transformation::${args.type}::${note}::${sourceSignature}::${targetSignature}`,
    description: buildTentativePatternDescription({
      kind: 'transformation',
      note: `${typeLabel}: ${args.note}`,
      sourcePaths: args.sourcePaths,
      targetPaths: args.targetPaths,
    }),
  }
}

function buildEnrichmentGrouping(args: {
  note: string
  targetPaths: string[]
}): {
  key: string
  description: string
} {
  const note = canonicalizeSemanticNote(args.note)
  const targetSignature = buildPathSignature(args.targetPaths)
  const targetLabel = buildFriendlyPathSummary(args.targetPaths)
  const combined = `${note} ${targetSignature}`

  if (/global key|generated|identifier|default/.test(combined)) {
    return {
      key: `enrichment::generated-identifiers::${targetSignature}`,
      description: `Generated identifiers or defaults repeatedly appear under ${targetLabel}.`,
    }
  }
  if (/party/.test(combined)) {
    return {
      key: `enrichment::party-enrichment::${targetSignature}`,
      description: `Party-related enrichments repeatedly appear under ${targetLabel}.`,
    }
  }
  if (/meta|metadata/.test(combined)) {
    return {
      key: `enrichment::metadata::${targetSignature}`,
      description: `Metadata-like enrichments repeatedly appear under ${targetLabel}.`,
    }
  }

  return {
    key: `enrichment::${note}::${targetSignature}`,
    description: buildTentativePatternDescription({
      kind: 'enrichment',
      note: args.note,
      targetPaths: args.targetPaths,
    }),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function sanitizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? uniqueLines(value.filter((item): item is string => typeof item === 'string'))
    : []
}

function sanitizeArrayItems<T>(value: unknown, schema: z.ZodType<T>): T[] {
  if (!Array.isArray(value)) return []
  const items: T[] = []
  for (const candidate of value) {
    const parsed = schema.safeParse(candidate)
    if (parsed.success) {
      items.push(parsed.data)
    }
  }
  return items
}

function normalizeNarrativeLine(value: string): string {
  return normalizeWhitespace(normalizePunctuation(value))
    .replace(/\u00e2\u20ac[\u201c\u201d]/g, '-')
    .replace(/\u00e2\u20ac[\u0153\u009d]/g, '"')
    .replace(/\u00e2\u20ac[\u02dc\u2122]/g, "'")
}

function normalizeNarrativeList(lines: string[], limit?: number): string[] {
  const normalized = uniqueLines(lines.map(normalizeNarrativeLine).filter(Boolean))
  return typeof limit === 'number' ? normalized.slice(0, limit) : normalized
}

function normalizeComparableText(value: string): string {
  return normalizeNarrativeLine(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function buildConceptSignature(parts: string[]): string {
  return normalizeComparableText(parts.join(' '))
}

function dedupeBySignature<T>(items: T[], getSignature: (item: T) => string): T[] {
  const seen = new Set<string>()
  const deduped: T[] = []
  for (const item of items) {
    const signature = getSignature(item)
    if (!signature || seen.has(signature)) {
      continue
    }
    seen.add(signature)
    deduped.push(item)
  }
  return deduped
}

function normalizeStableRule(rule: StableMappingRule): StableMappingRule {
  return {
    ...rule,
    name: normalizeNarrativeLine(rule.name),
    sourcePattern: normalizeNarrativeLine(rule.sourcePattern),
    targetPattern: normalizeNarrativeLine(rule.targetPattern),
    explanation: normalizeNarrativeLine(rule.explanation),
    whyItWorksThisWay: normalizeNarrativeLine(rule.whyItWorksThisWay),
    exampleFiles: normalizePathList(rule.exampleFiles),
    caveats: normalizeNarrativeList(rule.caveats, 4),
  }
}

function normalizeTransformationSummary(item: TransformationSummary): TransformationSummary {
  return {
    ...item,
    name: normalizeNarrativeLine(item.name),
    description: normalizeNarrativeLine(item.description),
    sourceSide: normalizeNarrativeLine(item.sourceSide),
    targetSide: normalizeNarrativeLine(item.targetSide),
    exampleFiles: normalizePathList(item.exampleFiles),
    notes: normalizeNarrativeList(item.notes, 4),
  }
}

function normalizeVariantSummary(item: VariantSummary): VariantSummary {
  return {
    ...item,
    name: normalizeNarrativeLine(item.name),
    description: normalizeNarrativeLine(item.description),
    seenIn: normalizePathList(item.seenIn),
    impactOnGeneralization: normalizeNarrativeLine(item.impactOnGeneralization),
  }
}

function normalizeEnrichmentSummary(item: EnrichmentSummary): EnrichmentSummary {
  return {
    ...item,
    name: normalizeNarrativeLine(item.name),
    description: normalizeNarrativeLine(item.description),
    evidence: normalizePathList(item.evidence),
    caution: normalizeNarrativeList(item.caution, 4),
  }
}

function normalizeTentativePattern(item: TentativeRepeatedPattern): TentativeRepeatedPattern {
  return {
    ...item,
    description: normalizeNarrativeLine(item.description),
    exampleFiles: normalizePathList(item.exampleFiles),
    notes: normalizeNarrativeList(item.notes, 4),
  }
}

function normalizePairHighlight(item: PairHighlight): PairHighlight {
  return {
    ...item,
    fpmlFile: normalizeNarrativeLine(item.fpmlFile),
    cdmFile: normalizeNarrativeLine(item.cdmFile),
    mainFpmlSections: normalizeNarrativeLine(item.mainFpmlSections),
    mainCdmSections: normalizeNarrativeLine(item.mainCdmSections),
    importantMappings: normalizeNarrativeList(item.importantMappings, 4),
    importantTransformation: normalizeNarrativeLine(item.importantTransformation),
    uncertainty: normalizeNarrativeList(item.uncertainty, 4),
  }
}

function minimumStableRuleEvidence(semanticPairCount: number): number {
  if (semanticPairCount >= LARGE_FOLDER_STABLE_RULE_PAIR_THRESHOLD) {
    return Math.max(3, Math.ceil(semanticPairCount * LARGE_FOLDER_STABLE_RULE_RATIO))
  }
  return MIN_REPEATED_EVIDENCE_COUNT
}

function looksLikeEnrichmentText(text: string): boolean {
  return /\b(default|generated|autogenerated|derived|enrich|enrichment|metadata|meta\b|global key|globalkey|lei)\b/i.test(
    text
  )
}

function looksLikeNormalizationText(text: string): boolean {
  return /\b(normaliz|trim|timezone|timestamp|date only|date-only|trailing z|strip time|remove(?:d)? trailing z)\b/i.test(
    text
  )
}

function looksLikeEnrichmentRule(rule: StableMappingRule): boolean {
  return looksLikeEnrichmentText(
    [rule.name, rule.explanation, rule.whyItWorksThisWay, rule.sourcePattern, rule.targetPattern].join(' ')
  )
}

function looksLikeEnrichmentTransformation(item: TransformationSummary): boolean {
  const text = [item.name, item.description, item.sourceSide, item.targetSide, item.type].join(' ')
  return item.type === 'enrichment' || (looksLikeEnrichmentText(text) && !looksLikeNormalizationText(text))
}

function looksLikeNormalizationEnrichment(item: EnrichmentSummary): boolean {
  return (
    item.classification === 'normalization' ||
    looksLikeNormalizationText([item.name, item.description, ...item.caution].join(' '))
  )
}

function convertRuleToEnrichment(rule: StableMappingRule): EnrichmentSummary {
  return {
    id: rule.id,
    name: rule.name,
    description: normalizeNarrativeLine(`${rule.explanation} ${rule.whyItWorksThisWay}`),
    classification: looksLikeNormalizationText([rule.name, rule.explanation, rule.whyItWorksThisWay].join(' '))
      ? 'normalization'
      : 'suspected enrichment',
    evidence: normalizePathList(rule.exampleFiles),
    caution: normalizeNarrativeList(
      [...rule.caveats, `Do not treat ${rule.name} as a guaranteed direct mapping rule yet.`],
      4
    ),
  }
}

function convertTransformationToEnrichment(item: TransformationSummary): EnrichmentSummary {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    classification: item.type === 'normalization' ? 'normalization' : 'suspected enrichment',
    evidence: normalizePathList(item.exampleFiles),
    caution: normalizeNarrativeList(
      [...item.notes, `Do not treat ${item.name} as a reusable direct mapping transformation yet.`],
      4
    ),
  }
}

function convertEnrichmentToTransformation(item: EnrichmentSummary): TransformationSummary {
  return {
    id: item.id,
    name: item.name,
    type: 'normalization',
    description: item.description,
    sourceSide: 'Normalization cue inferred from source-side values.',
    targetSide: item.name,
    evidenceCount: item.evidence.length,
    exampleFiles: normalizePathList(item.evidence),
    notes: normalizeNarrativeList(item.caution, 4),
  }
}

function convertRuleToTentativePattern(rule: StableMappingRule): TentativeRepeatedPattern {
  return {
    id: rule.id,
    kind: 'mapping',
    strength: rule.strength,
    description: normalizeNarrativeLine(`${rule.explanation} (${rule.sourcePattern} -> ${rule.targetPattern})`),
    evidenceCount: rule.evidenceCount,
    exampleFiles: normalizePathList(rule.exampleFiles),
    notes: normalizeNarrativeList([rule.whyItWorksThisWay, ...rule.caveats], 4),
  }
}

function convertTransformationToTentativePattern(item: TransformationSummary): TentativeRepeatedPattern {
  return {
    id: item.id,
    kind: item.type === 'enrichment' ? 'enrichment' : 'transformation',
    strength: item.evidenceCount >= 3 ? 'moderate recurring pattern' : 'weak pattern',
    description: normalizeNarrativeLine(`${item.description} (${item.sourceSide} -> ${item.targetSide})`),
    evidenceCount: item.evidenceCount,
    exampleFiles: normalizePathList(item.exampleFiles),
    notes: normalizeNarrativeList(item.notes, 4),
  }
}

function isEligibleStableRule(rule: StableMappingRule, semanticPairCount: number): boolean {
  return rule.evidenceCount >= minimumStableRuleEvidence(semanticPairCount)
}

function isEligibleRepeatedTransformation(item: TransformationSummary): boolean {
  return item.evidenceCount >= MIN_REPEATED_EVIDENCE_COUNT
}

function buildStableRuleSignature(rule: StableMappingRule): string {
  return buildConceptSignature([rule.sourcePattern, rule.targetPattern, rule.explanation])
}

function buildTransformationSignature(item: TransformationSummary): string {
  return buildConceptSignature([item.type, item.sourceSide, item.targetSide, item.description])
}

function buildVariantSignature(item: VariantSummary): string {
  return buildConceptSignature([item.name, item.description, item.impactOnGeneralization])
}

function buildEnrichmentSignature(item: EnrichmentSummary): string {
  return buildConceptSignature([item.name, item.description, item.classification])
}

function buildTentativePatternSignature(item: TentativeRepeatedPattern): string {
  return buildConceptSignature([item.kind, item.description])
}

function normalizeSemanticSections(synthesis: DraftFolderSynthesis): DraftFolderSynthesis {
  const stableMappingPatterns: StableMappingRule[] = []
  const repeatedNonLiteralTransformations: TransformationSummary[] = []
  const suspectedEnrichmentOrDefaultBehavior: EnrichmentSummary[] = synthesis.suspectedEnrichmentOrDefaultBehavior.map(
    normalizeEnrichmentSummary
  )

  for (const rule of synthesis.stableMappingPatterns.map(normalizeStableRule)) {
    if (looksLikeEnrichmentRule(rule)) {
      suspectedEnrichmentOrDefaultBehavior.push(convertRuleToEnrichment(rule))
      continue
    }
    stableMappingPatterns.push(rule)
  }

  for (const item of synthesis.repeatedNonLiteralTransformations.map(normalizeTransformationSummary)) {
    if (looksLikeEnrichmentTransformation(item)) {
      suspectedEnrichmentOrDefaultBehavior.push(convertTransformationToEnrichment(item))
      continue
    }
    repeatedNonLiteralTransformations.push(item)
  }

  const normalizedEnrichments: EnrichmentSummary[] = []
  for (const item of suspectedEnrichmentOrDefaultBehavior) {
    if (looksLikeNormalizationEnrichment(item)) {
      repeatedNonLiteralTransformations.push(convertEnrichmentToTransformation(item))
      continue
    }
    normalizedEnrichments.push(item)
  }

  return {
    ...synthesis,
    stableMappingPatterns,
    repeatedNonLiteralTransformations,
    suspectedEnrichmentOrDefaultBehavior: normalizedEnrichments,
  }
}

function mergeTentativePatterns(
  existing: TentativeRepeatedPattern[],
  additions: TentativeRepeatedPattern[]
): TentativeRepeatedPattern[] {
  const combined = [...existing.map(normalizeTentativePattern), ...additions.map(normalizeTentativePattern)]
  const bestBySignature = new Map<string, TentativeRepeatedPattern>()
  for (const item of combined) {
    if (item.evidenceCount < MIN_REPEATED_EVIDENCE_COUNT) {
      continue
    }
    const signature = buildTentativePatternSignature(item)
    const current = bestBySignature.get(signature)
    if (
      !current ||
      item.evidenceCount > current.evidenceCount ||
      (item.evidenceCount === current.evidenceCount && item.description.length > current.description.length)
    ) {
      bestBySignature.set(signature, item)
    }
  }
  return Array.from(bestBySignature.values())
}

function enforceEvidenceThresholds(synthesis: DraftFolderSynthesis): DraftFolderSynthesis {
  const semanticPairCount = synthesis.evidenceCoverage.semanticPairCount
  const stableMappingPatterns: StableMappingRule[] = []
  const repeatedNonLiteralTransformations: TransformationSummary[] = []
  const demotedTentativePatterns: TentativeRepeatedPattern[] = []

  for (const rule of synthesis.stableMappingPatterns) {
    if (isEligibleStableRule(rule, semanticPairCount)) {
      stableMappingPatterns.push(rule)
      continue
    }
    demotedTentativePatterns.push(convertRuleToTentativePattern(rule))
  }

  for (const item of synthesis.repeatedNonLiteralTransformations) {
    if (isEligibleRepeatedTransformation(item)) {
      repeatedNonLiteralTransformations.push(item)
      continue
    }
    demotedTentativePatterns.push(convertTransformationToTentativePattern(item))
  }

  return {
    ...synthesis,
    stableMappingPatterns,
    repeatedNonLiteralTransformations,
    tentativeRepeatedPatterns: mergeTentativePatterns(synthesis.tentativeRepeatedPatterns, demotedTentativePatterns),
  }
}

function renumberStableRules(items: StableMappingRule[]): StableMappingRule[] {
  return items.map((item, index) => ({
    ...item,
    id: `RULE-${String(index + 1).padStart(3, '0')}`,
  }))
}

function renumberTransformations(items: TransformationSummary[]): TransformationSummary[] {
  return items.map((item, index) => ({
    ...item,
    id: `TR-${String(index + 1).padStart(3, '0')}`,
  }))
}

function renumberVariants(items: VariantSummary[]): VariantSummary[] {
  return items.map((item, index) => ({
    ...item,
    id: `VAR-${String(index + 1).padStart(3, '0')}`,
  }))
}

function renumberEnrichments(items: EnrichmentSummary[]): EnrichmentSummary[] {
  return items.map((item, index) => ({
    ...item,
    id: `ENR-${String(index + 1).padStart(3, '0')}`,
  }))
}

function renumberTentativePatterns(items: TentativeRepeatedPattern[]): TentativeRepeatedPattern[] {
  return items.map((item, index) => ({
    ...item,
    id: `TENT-${String(index + 1).padStart(3, '0')}`,
  }))
}

function selectMarkdownHighlights(highlights: PairHighlight[]): PairHighlight[] {
  if (highlights.length <= MARKDOWN_HIGHLIGHT_TRUNCATION_THRESHOLD) {
    return highlights
  }
  return highlights.slice(0, MARKDOWN_HIGHLIGHT_LIMIT)
}

function finalizeDraftSynthesis(synthesis: DraftFolderSynthesis): DraftFolderSynthesis {
  const normalized = normalizeSemanticSections(synthesis)
  const thresholded = enforceEvidenceThresholds(normalized)

  const stableMappingPatterns = renumberStableRules(
    dedupeBySignature(
      thresholded.stableMappingPatterns
        .map(normalizeStableRule)
        .sort((left, right) => right.evidenceCount - left.evidenceCount || left.name.localeCompare(right.name)),
      buildStableRuleSignature
    )
  )
  const repeatedNonLiteralTransformations = renumberTransformations(
    dedupeBySignature(
      thresholded.repeatedNonLiteralTransformations
        .map(normalizeTransformationSummary)
        .sort(
          (left, right) =>
            right.evidenceCount - left.evidenceCount || left.name.localeCompare(right.name)
        ),
      buildTransformationSignature
    )
  )
  const suspectedEnrichmentOrDefaultBehavior = renumberEnrichments(
    dedupeBySignature(
      thresholded.suspectedEnrichmentOrDefaultBehavior
        .map(normalizeEnrichmentSummary)
        .sort((left, right) => right.evidence.length - left.evidence.length || left.name.localeCompare(right.name)),
      buildEnrichmentSignature
    )
  )
  const strongerSectionSignatures = new Set<string>([
    ...stableMappingPatterns.map(item => buildConceptSignature([item.explanation, item.sourcePattern, item.targetPattern])),
    ...repeatedNonLiteralTransformations.map(item =>
      buildConceptSignature([item.description, item.sourceSide, item.targetSide])
    ),
    ...suspectedEnrichmentOrDefaultBehavior.map(item =>
      buildConceptSignature([item.name, item.description, item.classification])
    ),
  ])
  const tentativeRepeatedPatterns = renumberTentativePatterns(
    dedupeBySignature(
      thresholded.tentativeRepeatedPatterns
        .map(normalizeTentativePattern)
        .filter(item => !strongerSectionSignatures.has(buildConceptSignature([item.description])))
        .sort(
          (left, right) =>
            right.evidenceCount - left.evidenceCount || left.description.localeCompare(right.description)
        ),
      buildTentativePatternSignature
    )
  )
  const variantsAndExceptions = renumberVariants(
    dedupeBySignature(
      thresholded.variantsAndExceptions
        .map(normalizeVariantSummary)
        .sort((left, right) => left.name.localeCompare(right.name)),
      buildVariantSignature
    )
  )
  const pairLevelHighlights = dedupeBySignature(
    thresholded.pairLevelHighlights
      .map(normalizePairHighlight)
      .sort((left, right) => left.fpmlFile.localeCompare(right.fpmlFile)),
    item => `${item.fpmlFile}::${item.cdmFile}`
  )

  const finalized: DraftFolderSynthesis = {
    ...thresholded,
    stableMappingPatterns,
    repeatedNonLiteralTransformations,
    tentativeRepeatedPatterns,
    folderLevelPrinciples: normalizeNarrativeList(thresholded.folderLevelPrinciples, 6),
    variantsAndExceptions,
    suspectedEnrichmentOrDefaultBehavior,
    repeatedHeaderAndCommonBoilerplateSummary: {
      commonFpmlHeaderBehavior: normalizeNarrativeList(
        thresholded.repeatedHeaderAndCommonBoilerplateSummary.commonFpmlHeaderBehavior,
        8
      ),
      commonTradeScaffolding: normalizeNarrativeList(
        thresholded.repeatedHeaderAndCommonBoilerplateSummary.commonTradeScaffolding,
        8
      ),
      commonCdmBoilerplateBehavior: normalizeNarrativeList(
        thresholded.repeatedHeaderAndCommonBoilerplateSummary.commonCdmBoilerplateBehavior,
        8
      ),
    },
    openQuestions: normalizeNarrativeList(thresholded.openQuestions, 12),
    pairLevelHighlights,
    agentPlaybook: thresholded.agentPlaybook,
    draftConclusion: {
      mostReusableFindings: normalizeNarrativeList(thresholded.draftConclusion.mostReusableFindings, 4),
      safeToGeneralize: normalizeNarrativeList(thresholded.draftConclusion.safeToGeneralize, 4),
      remainTentative: normalizeNarrativeList(thresholded.draftConclusion.remainTentative, 4),
    },
    sourceAppendixNotes: normalizeNarrativeList(thresholded.sourceAppendixNotes, 10),
  }

  finalized.agentPlaybook = buildAgentPlaybook({
    evidenceCoverage: finalized.evidenceCoverage,
    synthesis: finalized,
    structure: {
      repeatedFpmlStructure: finalized.repeatedFpmlStructure,
      repeatedCdmStructure: finalized.repeatedCdmStructure,
    },
  })

  return finalized
}

function buildEvidenceCoverage(args: {
  selection: DraftPairSelectionResult
  allPairAnalyses: DraftPairAnalysis[]
  semanticPairAnalyses: DraftPairAnalysis[]
}): DraftEvidenceCoverage {
  const fullSemanticPairCount = args.semanticPairAnalyses.filter(
    analysis => analysis.semanticRecovery === 'full'
  ).length
  const salvagedSemanticPairCount = args.semanticPairAnalyses.filter(
    analysis => analysis.semanticRecovery === 'salvaged'
  ).length

  return {
    matchedPairCount: args.selection.includedPairs.length,
    structuralPairCount: args.allPairAnalyses.length,
    semanticPairCount: args.semanticPairAnalyses.length,
    fullSemanticPairCount,
    salvagedSemanticPairCount,
    failedSemanticPairCount: args.allPairAnalyses.filter(analysis => analysis.status === 'failed').length,
    structuralBasisNote: `Structural summaries are computed from all ${args.allPairAnalyses.length}/${args.selection.includedPairs.length} matched pairs, including pairs without semantic extraction.`,
    semanticBasisNote: `Semantic rules are computed from ${args.semanticPairAnalyses.length}/${args.selection.includedPairs.length} successful or salvaged pair analyses (${fullSemanticPairCount} full, ${salvagedSemanticPairCount} salvaged).`,
  }
}

function buildDeterministicStructure(args: {
  allPairAnalyses: DraftPairAnalysis[]
}): Pick<
  DraftFolderSynthesis,
  'repeatedFpmlStructure' | 'repeatedCdmStructure' | 'repeatedHeaderAndCommonBoilerplateSummary'
> {
  const fpmlFrequencies = computeSectionFrequencies(args.allPairAnalyses, analysis => analysis.fpmlSummary.topLevelSections)
  const cdmFrequencies = computeSectionFrequencies(args.allPairAnalyses, analysis => analysis.cdmSummary.topLevelSections)
  const fpmlSplit = splitFrequencies(fpmlFrequencies)
  const cdmSplit = splitFrequencies(cdmFrequencies)
  const headerSummary: FolderHeaderBoilerplateSummary = {
    commonFpmlHeaderBehavior: uniqueLines(
      args.allPairAnalyses.flatMap(analysis => analysis.fpmlSummary.headerBoilerplateSignals)
    ).slice(0, 8),
    commonTradeScaffolding: uniqueLines(
      args.allPairAnalyses.flatMap(analysis => analysis.fpmlSummary.nestedStructureSignals)
    ).slice(0, 8),
    commonCdmBoilerplateBehavior: uniqueLines(
      args.allPairAnalyses.flatMap(analysis => analysis.cdmSummary.headerBoilerplateSignals)
    ).slice(0, 8),
  }

  return {
    repeatedFpmlStructure: {
      headerAndBoilerplate:
        headerSummary.commonFpmlHeaderBehavior.length > 0
          ? headerSummary.commonFpmlHeaderBehavior
          : ['No strong evidence yet.'],
      topLevelSections: fpmlSplit.repeated,
      nestedStructures: uniqueLines(
        args.allPairAnalyses.flatMap(analysis => analysis.fpmlSummary.nestedStructureSignals)
      ).slice(0, 8),
      optionalSections: fpmlSplit.optional,
    },
    repeatedCdmStructure: {
      topLevelSections: cdmSplit.repeated,
      wrappersAndScaffolding: uniqueLines(
        args.allPairAnalyses.flatMap(analysis => analysis.cdmSummary.nestedStructureSignals)
      ).slice(0, 8),
      optionalSections: cdmSplit.optional,
    },
    repeatedHeaderAndCommonBoilerplateSummary: headerSummary,
  }
}

function buildDeterministicSemanticAggregation(args: {
  semanticPairAnalyses: DraftPairAnalysis[]
}): {
  tentativeRepeatedPatterns: TentativeRepeatedPattern[]
  folderLevelPrinciples: string[]
  recurringRules: string[]
  transformationPatterns: string[]
  validationChecks: string[]
  conclusionFindings: string[]
} {
  type PatternGroup = {
    kind: TentativeRepeatedPattern['kind']
    description: string
    exampleFiles: string[]
    notes: string[]
  }

  const total = args.semanticPairAnalyses.length
  const groups = new Map<string, PatternGroup>()

  const addGroup = (key: string, value: PatternGroup): void => {
    const existing = groups.get(key)
    if (existing) {
      existing.exampleFiles.push(...value.exampleFiles)
      existing.notes.push(...value.notes)
      return
    }
    groups.set(key, value)
  }

  for (const analysis of args.semanticPairAnalyses) {
    const exampleFile = analysis.pair.fpmlRelativePath

    for (const observation of analysis.mappingObservations) {
      const sourcePaths = normalizePathList(observation.sourcePaths)
      const targetPaths = normalizePathList(observation.targetPaths)
      const note = normalizeWhitespace(observation.mappingNote)
      if (!note) continue
      const grouping = buildMappingGrouping({
        note,
        sourcePaths,
        targetPaths,
        classification: observation.classification,
      })
      addGroup(grouping.key, {
        kind: 'mapping',
        description: grouping.description,
        exampleFiles: [exampleFile],
        notes: [
          `Confidence mix includes ${observation.confidence}.`,
          `Representative note: ${normalizePunctuation(note)}`,
        ],
      })
    }

    for (const transformation of analysis.transformations) {
      const sourcePaths = normalizePathList(transformation.sourcePaths)
      const targetPaths = normalizePathList(transformation.targetPaths)
      const note = normalizeWhitespace(transformation.transformationNote)
      if (!note) continue
      const grouping = buildTransformationGrouping({
        note,
        sourcePaths,
        targetPaths,
        type: transformation.type,
      })
      addGroup(grouping.key, {
        kind: 'transformation',
        description: grouping.description,
        exampleFiles: [exampleFile],
        notes: [
          `Confidence mix includes ${transformation.confidence}.`,
          `Representative note: ${normalizePunctuation(note)}`,
        ],
      })
    }

    for (const enrichment of analysis.enrichments) {
      const targetPaths = normalizePathList(enrichment.targetPaths)
      const note = normalizeWhitespace(enrichment.enrichmentNote)
      if (!note) continue
      const grouping = buildEnrichmentGrouping({
        note,
        targetPaths,
      })
      addGroup(grouping.key, {
        kind: 'enrichment',
        description: grouping.description,
        exampleFiles: [exampleFile],
        notes: [
          `Confidence mix includes ${enrichment.confidence}.`,
          `Representative note: ${normalizePunctuation(note)}`,
        ],
      })
    }
  }

  const tentativeRepeatedPatterns = Array.from(groups.values())
    .map((group, index) => {
      const exampleFiles = uniqueLines(group.exampleFiles)
      const evidenceCount = exampleFiles.length
      return {
        id: `TENT-${String(index + 1).padStart(3, '0')}`,
        kind: group.kind,
        strength: deriveRecurringPatternStrength(evidenceCount, total),
        description: group.description,
        evidenceCount,
        exampleFiles,
        notes: uniqueLines(group.notes).slice(0, 4),
      }
    })
    .filter(pattern => pattern.evidenceCount >= 2)
    .sort((a, b) => b.evidenceCount - a.evidenceCount || a.description.localeCompare(b.description))
    .slice(0, 8)

  const folderLevelPrinciples = tentativeRepeatedPatterns
    .slice(0, 3)
    .map(
      pattern =>
        `${pattern.description} appears in ${pattern.evidenceCount}/${Math.max(total, 1)} semantic examples.`
    )

  const recurringRules = tentativeRepeatedPatterns
    .filter(pattern => pattern.kind === 'mapping')
    .slice(0, 4)
    .map(pattern => `${pattern.description} [${pattern.evidenceCount}/${Math.max(total, 1)} examples]`)

  const transformationPatterns = tentativeRepeatedPatterns
    .filter(pattern => pattern.kind === 'transformation')
    .slice(0, 4)
    .map(pattern => `${pattern.description} [${pattern.evidenceCount}/${Math.max(total, 1)} examples]`)

  const validationChecks = tentativeRepeatedPatterns
    .filter(pattern => pattern.kind === 'enrichment')
    .slice(0, 3)
    .map(pattern => `Validate tentative enrichment signal: ${pattern.description}`)

  const conclusionFindings = tentativeRepeatedPatterns
    .slice(0, 3)
    .map(pattern => `${pattern.description} [${pattern.evidenceCount} examples]`)

  return {
    tentativeRepeatedPatterns,
    folderLevelPrinciples,
    recurringRules,
    transformationPatterns,
    validationChecks,
    conclusionFindings,
  }
}

function isPlaceholderHighlightLine(line: string): boolean {
  return /No live LLM analysis was available for this pair\.|Recovered partial semantic evidence|still requires live LLM analysis/i.test(
    line
  )
}

function scorePairHighlight(highlight: PairHighlight): number {
  const meaningfulMappings = highlight.importantMappings.filter(item => !isPlaceholderHighlightLine(item)).length
  const meaningfulTransformation = isPlaceholderHighlightLine(highlight.importantTransformation) ? 0 : 1
  const placeholderUncertaintyCount = highlight.uncertainty.filter(item => isPlaceholderHighlightLine(item)).length
  return meaningfulMappings * 3 + meaningfulTransformation * 2 + Math.max(0, 3 - placeholderUncertaintyCount)
}

function buildRepresentativeHighlights(
  semanticPairAnalyses: DraftPairAnalysis[],
  limit: number
): PairHighlight[] {
  return semanticPairAnalyses
    .slice()
    .sort((left, right) => {
      const scoreDelta = scorePairHighlight(right.pairHighlight) - scorePairHighlight(left.pairHighlight)
      if (scoreDelta !== 0) {
        return scoreDelta
      }
      if (left.semanticRecovery !== right.semanticRecovery) {
        return left.semanticRecovery === 'full' ? -1 : 1
      }
      return left.pair.fpmlRelativePath.localeCompare(right.pair.fpmlRelativePath)
    })
    .slice(0, limit)
    .map(analysis => analysis.pairHighlight)
}

function collectOpenQuestions(semanticPairAnalyses: DraftPairAnalysis[], limit: number): string[] {
  return uniqueLines(semanticPairAnalyses.flatMap(analysis => analysis.openQuestions)).slice(0, limit)
}

function buildSemanticSynthesisPromptInput(args: {
  fallback: DraftFolderSynthesis
  semanticPairAnalyses: DraftPairAnalysis[]
}): SemanticSynthesisPromptInput {
  return {
    tentativeRepeatedPatterns: args.fallback.tentativeRepeatedPatterns,
    representativeHighlights: buildRepresentativeHighlights(args.semanticPairAnalyses, 8),
    openQuestions: collectOpenQuestions(args.semanticPairAnalyses, 8),
  }
}

function buildFallbackConclusion(args: {
  semanticPairAnalyses: DraftPairAnalysis[]
  tentativeRepeatedPatterns: TentativeRepeatedPattern[]
}): DraftConclusion {
  const mostReusableFindings = uniqueLines([
    ...args.tentativeRepeatedPatterns.slice(0, 3).map(pattern => pattern.description),
    ...args.semanticPairAnalyses.flatMap(analysis => analysis.pairHighlight.importantMappings.slice(0, 2)),
  ]).slice(0, 4)
  const remainTentative = uniqueLines(
    [
      ...args.semanticPairAnalyses.flatMap(analysis => analysis.pairHighlight.uncertainty),
      ...args.tentativeRepeatedPatterns.map(
        pattern => `${pattern.description} still needs stronger repeated evidence before becoming a stable folder rule.`
      ),
    ]
  ).slice(0, 4)

  return {
    mostReusableFindings:
      mostReusableFindings.length > 0
        ? mostReusableFindings
        : ['Deterministic structural summaries were generated for the matched pairs.'],
    safeToGeneralize:
      args.tentativeRepeatedPatterns.length > 0
        ? args.tentativeRepeatedPatterns
            .slice(0, 2)
            .map(pattern => `${pattern.description} can be used as tentative folder guidance.`)
      : args.semanticPairAnalyses.length > 0
        ? ['Apply only rules backed by repeated semantic evidence and exact source cues.']
        : ['Repeated top-level structure can be reused as initial folder scaffolding.'],
    remainTentative:
      remainTentative.length > 0
        ? remainTentative
        : ['Semantic mapping rules still need stronger evidence before they are treated as folder-wide defaults.'],
  }
}

function buildAgentPlaybook(args: {
  evidenceCoverage: DraftEvidenceCoverage
  synthesis: Pick<
    DraftFolderSynthesis,
    | 'stableMappingPatterns'
    | 'repeatedNonLiteralTransformations'
    | 'tentativeRepeatedPatterns'
    | 'pairLevelHighlights'
    | 'openQuestions'
    | 'suspectedEnrichmentOrDefaultBehavior'
  >
  structure: Pick<DraftFolderSynthesis, 'repeatedFpmlStructure' | 'repeatedCdmStructure'>
}): DraftAgentPlaybook {
  const recurringRules = uniqueLines(
    [
      ...args.synthesis.stableMappingPatterns.map(
        rule => `${rule.sourcePattern} -> ${rule.targetPattern}: ${rule.explanation}`
      ),
      ...args.synthesis.tentativeRepeatedPatterns
        .filter(pattern => pattern.kind === 'mapping')
        .map(pattern => `${pattern.description} [tentative ${pattern.evidenceCount} examples]`),
    ]
  ).slice(0, 6)
  const transformationPatterns = uniqueLines(
    [
      ...args.synthesis.repeatedNonLiteralTransformations.map(
        item => `${item.type}: ${item.description}`
      ),
      ...args.synthesis.tentativeRepeatedPatterns
        .filter(pattern => pattern.kind === 'transformation')
        .map(pattern => `${pattern.description} [tentative ${pattern.evidenceCount} examples]`),
    ]
  ).slice(0, 6)
  const productSpecificBranches: AgentPlaybookBranch[] = args.synthesis.pairLevelHighlights.slice(0, 6).map(item => ({
    name: basename(item.fpmlFile),
    whenToUse: `Use this branch when the source document resembles ${item.mainFpmlSections}.`,
    sourceSignals: uniqueLines(item.mainFpmlSections.split(',').map(part => part.trim())).slice(0, 4),
    mappingFocus: item.importantMappings.slice(0, 4),
    cautions: item.uncertainty.slice(0, 4),
  }))
  const validationChecks = uniqueLines([
    ...args.synthesis.openQuestions.map(question => `Check unresolved question: ${question}`),
    ...args.synthesis.suspectedEnrichmentOrDefaultBehavior.map(
      item => `Check enrichment/default behavior: ${item.description}`
    ),
    ...args.synthesis.tentativeRepeatedPatterns
      .filter(pattern => pattern.kind === 'enrichment')
      .map(pattern => `Check tentative repeated enrichment: ${pattern.description}`),
  ]).slice(0, 6)
  const doNotAssume = uniqueLines([
    ...args.synthesis.suspectedEnrichmentOrDefaultBehavior.map(
      item => `Do not treat ${item.name} as a guaranteed direct mapping rule yet.`
    ),
    ...args.synthesis.pairLevelHighlights.flatMap(item => item.uncertainty),
  ]).slice(0, 6)

  return {
    summary: `${args.evidenceCoverage.structuralBasisNote} ${args.evidenceCoverage.semanticBasisNote}`,
    canonicalSteps: [
      `Start from the repeated FPML sections seen across matched files: ${args.structure.repeatedFpmlStructure.topLevelSections
        .map(section => section.section)
        .join(', ') || 'no strong top-level pattern yet'}.`,
      'Map trade identifiers, party references, and trade dates before product-specific economics.',
      recurringRules.length > 0
        ? 'Apply recurring mapping rules only when the exact source cues appear in the document.'
        : 'Use pair-level examples as tentative guidance; no repeated folder-wide rules were recovered yet.',
      transformationPatterns.length > 0
        ? 'Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.'
        : 'Watch for non-literal reshaping and confirm it from pair-level examples before generalizing.',
      `Assemble the result under repeated CDM scaffolding such as ${args.structure.repeatedCdmStructure.topLevelSections
        .map(section => section.section)
        .join(', ') || 'trade'}.`,
      'Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.',
    ],
    recurringRules,
    transformationPatterns,
    productSpecificBranches,
    validationChecks:
      validationChecks.length > 0
        ? validationChecks
        : ['Check every generalized rule against the pair-level examples before using it on a new document.'],
    doNotAssume:
      doNotAssume.length > 0
        ? doNotAssume
        : ['Do not assume every repeated wrapper or metadata field implies a semantic mapping rule.'],
  }
}

function clipRawResponse(raw: string): string {
  return raw.length <= RAW_RESPONSE_PREVIEW_LIMIT
    ? raw
    : `${raw.slice(0, RAW_RESPONSE_PREVIEW_LIMIT)}...[truncated preview]`
}

function isTruncatedStructuredOutput(raw: string, errorMessage: string): boolean {
  if (/Unexpected EOF|Unterminated string/i.test(errorMessage)) {
    return true
  }
  const trimmed = raw.trim()
  return trimmed.startsWith('{') && !trimmed.endsWith('}')
}

function computeRetryMaxTokens(maxTokens: number): number {
  return Math.max(1800, Math.floor(maxTokens * 0.7))
}

function mergeStringLists(primary: string[], fallback: string[]): string[] {
  return primary.length > 0 ? primary : fallback
}

function mergeDraftConclusion(primary: DraftConclusion, fallback: DraftConclusion): DraftConclusion {
  return {
    mostReusableFindings: mergeStringLists(primary.mostReusableFindings, fallback.mostReusableFindings),
    safeToGeneralize: mergeStringLists(primary.safeToGeneralize, fallback.safeToGeneralize),
    remainTentative: mergeStringLists(primary.remainTentative, fallback.remainTentative),
  }
}

function mergeSemanticSynthesis(args: {
  base: DraftFolderSynthesis
  semantic: DraftSemanticSynthesis
}): DraftFolderSynthesis {
  return finalizeDraftSynthesis({
    ...args.base,
    stableMappingPatterns:
      args.semantic.stableMappingPatterns.length > 0
        ? args.semantic.stableMappingPatterns
        : args.base.stableMappingPatterns,
    repeatedNonLiteralTransformations:
      args.semantic.repeatedNonLiteralTransformations.length > 0
        ? args.semantic.repeatedNonLiteralTransformations
        : args.base.repeatedNonLiteralTransformations,
    tentativeRepeatedPatterns: args.base.tentativeRepeatedPatterns,
    folderLevelPrinciples: mergeStringLists(args.semantic.folderLevelPrinciples, args.base.folderLevelPrinciples),
    variantsAndExceptions:
      args.semantic.variantsAndExceptions.length > 0
        ? args.semantic.variantsAndExceptions
        : args.base.variantsAndExceptions,
    suspectedEnrichmentOrDefaultBehavior:
      args.semantic.suspectedEnrichmentOrDefaultBehavior.length > 0
        ? args.semantic.suspectedEnrichmentOrDefaultBehavior
        : args.base.suspectedEnrichmentOrDefaultBehavior,
    openQuestions: mergeStringLists(args.semantic.openQuestions, args.base.openQuestions),
    pairLevelHighlights: args.base.pairLevelHighlights,
    draftConclusion: mergeDraftConclusion(args.semantic.draftConclusion, args.base.draftConclusion),
    sourceAppendixNotes: uniqueLines(args.base.sourceAppendixNotes),
  })
}

function sanitizeSemanticSynthesis(value: unknown): DraftSemanticSynthesis | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const stableMappingPatterns = sanitizeArrayItems(value.stableMappingPatterns, StableRuleSchema)
  const repeatedNonLiteralTransformations = sanitizeArrayItems(
    value.repeatedNonLiteralTransformations,
    TransformationSummarySchema
  )
  const variantsAndExceptions = sanitizeArrayItems(value.variantsAndExceptions, VariantSummarySchema)
  const suspectedEnrichmentOrDefaultBehavior = sanitizeArrayItems(
    value.suspectedEnrichmentOrDefaultBehavior,
    EnrichmentSummarySchema
  )
  const folderLevelPrinciples = sanitizeStringArray(value.folderLevelPrinciples)
  const openQuestions = sanitizeStringArray(value.openQuestions)

  let draftConclusion: DraftConclusion = {
    mostReusableFindings: [],
    safeToGeneralize: [],
    remainTentative: [],
  }
  if (isRecord(value.draftConclusion)) {
    draftConclusion = {
      mostReusableFindings: sanitizeStringArray(value.draftConclusion.mostReusableFindings),
      safeToGeneralize: sanitizeStringArray(value.draftConclusion.safeToGeneralize),
      remainTentative: sanitizeStringArray(value.draftConclusion.remainTentative),
    }
  }

  if (
    stableMappingPatterns.length === 0 &&
    repeatedNonLiteralTransformations.length === 0 &&
    folderLevelPrinciples.length === 0 &&
    variantsAndExceptions.length === 0 &&
    suspectedEnrichmentOrDefaultBehavior.length === 0 &&
    openQuestions.length === 0
  ) {
    return undefined
  }

  return {
    stableMappingPatterns,
    repeatedNonLiteralTransformations,
    folderLevelPrinciples,
    variantsAndExceptions,
    suspectedEnrichmentOrDefaultBehavior,
    openQuestions,
    draftConclusion,
  }
}

function buildFallbackSynthesis(args: {
  folder: string
  allPairAnalyses: DraftPairAnalysis[]
  semanticPairAnalyses: DraftPairAnalysis[]
  selection: DraftPairSelectionResult
}): DraftFolderSynthesis {
  const structure = buildDeterministicStructure({ allPairAnalyses: args.allPairAnalyses })
  const deterministicSemanticAggregation = buildDeterministicSemanticAggregation({
    semanticPairAnalyses: args.semanticPairAnalyses,
  })
  const pairLevelHighlights = buildRepresentativeHighlights(
    args.semanticPairAnalyses,
    Math.max(args.semanticPairAnalyses.length, 1)
  )
  const openQuestions = collectOpenQuestions(args.semanticPairAnalyses, 6)
  const evidenceCoverage = buildEvidenceCoverage({
    selection: args.selection,
    allPairAnalyses: args.allPairAnalyses,
    semanticPairAnalyses: args.semanticPairAnalyses,
  })
  const synthesis: DraftFolderSynthesis = {
    folder: args.folder,
    evidenceCoverage,
    repeatedFpmlStructure: structure.repeatedFpmlStructure,
    repeatedCdmStructure: structure.repeatedCdmStructure,
    stableMappingPatterns: [],
    repeatedNonLiteralTransformations: [],
    tentativeRepeatedPatterns: deterministicSemanticAggregation.tentativeRepeatedPatterns,
    folderLevelPrinciples:
      deterministicSemanticAggregation.folderLevelPrinciples.length > 0
        ? deterministicSemanticAggregation.folderLevelPrinciples
      : args.semanticPairAnalyses.length > 0
        ? ['Generalize only from repeated semantic evidence; use structural repetition only for scaffolding.']
        : ['No semantic synthesis was recovered for this folder; only deterministic structure is available.'],
    variantsAndExceptions: [],
    suspectedEnrichmentOrDefaultBehavior: [],
    repeatedHeaderAndCommonBoilerplateSummary: structure.repeatedHeaderAndCommonBoilerplateSummary,
    openQuestions:
      openQuestions.length > 0
        ? openQuestions
        : ['No semantic synthesis was recovered for this folder; mapping rules remain tentative.'],
    pairLevelHighlights,
    agentPlaybook: {
      summary: '',
      canonicalSteps: [],
      recurringRules: [],
      transformationPatterns: [],
      productSpecificBranches: [],
      validationChecks: [],
      doNotAssume: [],
    },
    draftConclusion: buildFallbackConclusion({
      semanticPairAnalyses: args.semanticPairAnalyses,
      tentativeRepeatedPatterns: deterministicSemanticAggregation.tentativeRepeatedPatterns,
    }),
    sourceAppendixNotes: [
      `Included pairs: ${args.selection.includedPairs.length}`,
      `Ignored pairs: ${args.selection.ignoredExamples.length}`,
      `Semantic pair analyses recovered: ${args.semanticPairAnalyses.length}`,
      `Tentative repeated semantic signals: ${deterministicSemanticAggregation.tentativeRepeatedPatterns.length}`,
    ],
  }

  return finalizeDraftSynthesis(synthesis)
}

export async function synthesizeDraftFolder(args: {
  folder: string
  allPairAnalyses: DraftPairAnalysis[]
  semanticPairAnalyses: DraftPairAnalysis[]
  selection: DraftPairSelectionResult
  llm?: LLMClient
  logger?: DraftLogger
  model?: string
  maxTokens?: number
  maxRetries?: number
  storeFailedRawResponses?: boolean
}): Promise<{ synthesis: DraftFolderSynthesis; diagnostics: DraftSynthesisDiagnostics }> {
  const {
    folder,
    allPairAnalyses,
    semanticPairAnalyses,
    selection,
    llm,
    logger,
    model,
    maxTokens = 5000,
    maxRetries = 1,
    storeFailedRawResponses = true,
  } = args

  const fallback = buildFallbackSynthesis({
    folder,
    allPairAnalyses,
    semanticPairAnalyses,
    selection,
  })
  const promptInput = buildSemanticSynthesisPromptInput({
    fallback,
    semanticPairAnalyses,
  })

  if (!llm || semanticPairAnalyses.length === 0) {
    logger?.warn('synthesis', 'Using deterministic folder synthesis fallback.', {
      folder,
      llmEnabled: !!llm,
      semanticPairCount: semanticPairAnalyses.length,
    })
    return {
      synthesis: fallback,
      diagnostics: {
        modelUsed: model,
        failureKind: !llm ? 'llm_disabled' : undefined,
      },
    }
  }

  const responseFormat = {
    type: 'json_schema' as const,
    json_schema: {
      name: 'draft_folder_semantic_synthesis',
      strict: true,
      schema: zodToJsonSchema(DraftSemanticSynthesisSchema, {
        $refStrategy: 'none',
      }) as Record<string, unknown>,
    },
  }

  let rawResponse = ''
  let lastPromptChars = 0
  let lastErrorMessage = ''

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const retryMode = attempt > 0
    const messages = buildFolderSynthesisMessages({
      folder,
      coverage: selection.coverage,
      tentativeRepeatedPatterns: promptInput.tentativeRepeatedPatterns,
      representativeHighlights: promptInput.representativeHighlights,
      openQuestions: promptInput.openQuestions,
      includedExamples: selection.includedPairs.map(analysis => analysis.fpmlRelativePath),
      missingExamples: selection.missingExamples,
      ignoredExamples: selection.ignoredExamples,
      retryMode,
    })
    const promptChars = messages.reduce((sum, message) => sum + message.content.length, 0)
    const attemptMaxTokens = retryMode ? computeRetryMaxTokens(maxTokens) : maxTokens
    lastPromptChars = promptChars

    try {
      logger?.info('synthesis', 'Sending folder synthesis request to LLM.', {
        folder,
        model: model ?? null,
        maxTokens: attemptMaxTokens,
        promptChars,
        retryAttempt: attempt,
        semanticPairCount: semanticPairAnalyses.length,
        structuralPairCount: allPairAnalyses.length,
        includedPairCount: selection.includedPairs.length,
        missingExampleCount: selection.missingExamples.length,
      })
      const response = await llm.call({
        messages,
        model,
        maxTokens: attemptMaxTokens,
        responseFormat,
      })
      rawResponse = response.content
    } catch (requestError) {
      const errorMessage = requestError instanceof Error ? requestError.message : String(requestError)
      logger?.error('synthesis', 'Folder synthesis request failed; using deterministic fallback.', {
        folder,
        model: model ?? null,
        promptChars,
        retryAttempt: attempt,
        error: errorMessage,
      })
      return {
        synthesis: fallback,
        diagnostics: {
          modelUsed: model,
          promptChars,
          failureKind: 'request_error',
        },
      }
    }

    if (!rawResponse.trim()) {
      lastErrorMessage = 'Empty structured response'
      if (attempt < maxRetries) {
        logger?.warn('synthesis', 'Folder synthesis returned empty structured content; retrying with a smaller request.', {
          folder,
          model: model ?? null,
          retryAttempt: attempt + 1,
        })
        continue
      }
    } else {
      try {
        const semantic = parseStructuredResponse(rawResponse, DraftSemanticSynthesisSchema)
        const synthesis = mergeSemanticSynthesis({
          base: fallback,
          semantic,
        })
        logger?.info('synthesis', 'Folder synthesis completed successfully.', {
          folder,
          model: model ?? null,
          promptChars,
          responseChars: rawResponse.length,
          retryAttempt: attempt,
          stableRuleCount: synthesis.stableMappingPatterns.length,
          transformationCount: synthesis.repeatedNonLiteralTransformations.length,
        })
        return {
          synthesis,
          diagnostics: {
            modelUsed: model,
            promptChars,
            rawResponseChars: rawResponse.length,
            rawResponsePreview: clipRawResponse(rawResponse),
          },
        }
      } catch (parseError) {
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError)
        const truncatedResponseSuspected = isTruncatedStructuredOutput(rawResponse, errorMessage)
        lastErrorMessage = errorMessage
        if (truncatedResponseSuspected && attempt < maxRetries) {
          logger?.warn('synthesis', 'Folder synthesis response looked truncated; retrying with a smaller request.', {
            folder,
            model: model ?? null,
            promptChars,
            responseChars: rawResponse.length,
            retryAttempt: attempt + 1,
            error: errorMessage,
          })
          continue
        }

        let salvaged: DraftSemanticSynthesis | undefined
        try {
          salvaged = sanitizeSemanticSynthesis(extractPossiblyTruncatedJsonObject(rawResponse))
        } catch {
          salvaged = undefined
        }
        if (salvaged) {
          const synthesis = mergeSemanticSynthesis({
            base: fallback,
            semantic: salvaged,
          })
          logger?.warn('synthesis', 'Folder synthesis response was malformed but partial semantic output was salvaged.', {
            folder,
            model: model ?? null,
            promptChars,
            responseChars: rawResponse.length,
            retryAttempt: attempt,
            salvagedRuleCount: salvaged.stableMappingPatterns.length,
            salvagedTransformationCount: salvaged.repeatedNonLiteralTransformations.length,
            truncatedResponseSuspected,
            error: errorMessage,
          })
          return {
            synthesis,
            diagnostics: {
              modelUsed: model,
              promptChars,
              rawResponseChars: rawResponse.length,
              rawResponsePreview: clipRawResponse(rawResponse),
              rawResponse: storeFailedRawResponses ? rawResponse : undefined,
              failureKind: 'parse_error',
              truncatedResponseSuspected,
            },
          }
        }
      }
    }
  }

  logger?.error(
    'synthesis',
    'Folder synthesis returned malformed structured output; using deterministic fallback.',
    {
      folder,
      model: model ?? null,
      promptChars: lastPromptChars,
      responseChars: rawResponse.length,
      truncatedResponseSuspected: isTruncatedStructuredOutput(rawResponse, lastErrorMessage),
      error: lastErrorMessage,
    }
  )
  return {
    synthesis: fallback,
    diagnostics: {
      modelUsed: model,
      promptChars: lastPromptChars,
      rawResponseChars: rawResponse.length,
      rawResponsePreview: clipRawResponse(rawResponse),
      rawResponse: storeFailedRawResponses ? rawResponse : undefined,
      failureKind: 'parse_error',
      truncatedResponseSuspected: isTruncatedStructuredOutput(rawResponse, lastErrorMessage),
    },
  }
}

function renderStringList(lines: string[], empty = 'None observed.'): string {
  if (!lines.length) return `- ${empty}`
  return lines.map(line => `- ${line}`).join('\n')
}

function renderFrequencyList(items: DocumentSectionFrequency[], empty = 'None observed.'): string {
  if (!items.length) return `- ${empty}`
  return items
    .map(item => `- \`${item.section}\` appears in \`${item.count}/${item.total}\` examples`)
    .join('\n')
}

function renderExamples(
  lines: string[],
  selection: DraftPairSelectionResult,
  empty = 'None observed.'
): string {
  if (!lines.length) return `- ${empty}`
  return lines
    .map(example => {
      const pair = selection.includedPairs.find(candidate => candidate.fpmlRelativePath === example)
      if (!pair) return `- \`${example}\``
      return `- \`${pair.fpmlRelativePath}\` -> \`${pair.cdmRelativePath}\` (\`${pair.pairingStrategy}\`)`
    })
    .join('\n')
}

function renderIgnoredExamples(ignored: DraftIgnoredExample[]): string {
  if (!ignored.length) return 'None observed.'
  return ignored
    .map(example => {
      const base = example.cdmRelativePath
        ? `- \`${example.fpmlRelativePath}\` -> \`${example.cdmRelativePath}\``
        : `- \`${example.fpmlRelativePath}\``
      return `${base}\n  Reason: ${example.reason}`
    })
    .join('\n')
}

function renderStableRules(rules: DraftFolderSynthesis['stableMappingPatterns']): string {
  if (!rules.length) return 'No strong evidence yet.'
  return rules
    .map(
      rule => `### Rule ${rule.id}: ${rule.name}

- Strength: \`${rule.strength}\`
- Evidence count: \`${rule.evidenceCount}\` examples
- Source pattern: \`${rule.sourcePattern}\`
- Target pattern: \`${rule.targetPattern}\`
- Explanation: ${rule.explanation}
- Why it seems to work this way: ${rule.whyItWorksThisWay}
- Example files:
${rule.exampleFiles.length ? rule.exampleFiles.map(file => `  - \`${file}\``).join('\n') : '  - None observed.'}
- Caveats:
${rule.caveats.length ? rule.caveats.map(item => `  - ${item}`).join('\n') : '  - None observed.'}`
    )
    .join('\n\n')
}

function renderTransformations(items: DraftFolderSynthesis['repeatedNonLiteralTransformations']): string {
  if (!items.length) return 'No strong evidence yet.'
  return items
    .map(
      item => `### Transformation ${item.id}: ${item.name}

- Type: \`${item.type}\`
- Description: ${item.description}
- Source side: \`${item.sourceSide}\`
- Target side: \`${item.targetSide}\`
- Evidence count: \`${item.evidenceCount}\`
- Example files:
${item.exampleFiles.length ? item.exampleFiles.map(file => `  - \`${file}\``).join('\n') : '  - None observed.'}
- Notes:
${item.notes.length ? item.notes.map(note => `  - ${note}`).join('\n') : '  - None observed.'}`
    )
    .join('\n\n')
}

function renderTentativePatterns(items: DraftFolderSynthesis['tentativeRepeatedPatterns']): string {
  if (!items.length) return 'No repeated tentative signals were recovered yet.'
  return items
    .map(
      item => `### ${item.id}: ${item.kind}

- Strength: \`${item.strength}\`
- Description: ${item.description}
- Evidence count: \`${item.evidenceCount}\`
- Example files:
${item.exampleFiles.length ? item.exampleFiles.map(file => `  - \`${file}\``).join('\n') : '  - None observed.'}
- Notes:
${item.notes.length ? item.notes.map(note => `  - ${note}`).join('\n') : '  - None observed.'}`
    )
    .join('\n\n')
}

function renderVariants(items: DraftFolderSynthesis['variantsAndExceptions']): string {
  if (!items.length) return 'No strong evidence yet.'
  return items
    .map(
      item => `### Variant ${item.id}: ${item.name}

- Description: ${item.description}
- Seen in:
${item.seenIn.length ? item.seenIn.map(file => `  - \`${file}\``).join('\n') : '  - None observed.'}
- Impact on generalization: ${item.impactOnGeneralization}`
    )
    .join('\n\n')
}

function renderEnrichments(items: DraftFolderSynthesis['suspectedEnrichmentOrDefaultBehavior']): string {
  if (!items.length) return 'No strong evidence yet.'
  return items
    .map(
      item => `### Enrichment ${item.id}: ${item.name}

- Description: ${item.description}
- Classification: \`${item.classification}\`
- Evidence:
${item.evidence.length ? item.evidence.map(file => `  - \`${file}\``).join('\n') : '  - None observed.'}
- Caution:
${item.caution.length ? item.caution.map(note => `  - ${note}`).join('\n') : '  - Do not treat this as a guaranteed direct mapping rule yet.'}`
    )
    .join('\n\n')
}

function renderHighlights(items: PairHighlight[]): string {
  if (!items.length) return 'No strong evidence yet.'
  return items
    .map(
      item => `### \`${item.fpmlFile}\` -> \`${item.cdmFile}\`

- Main FpML sections: ${item.mainFpmlSections}
- Main CDM sections: ${item.mainCdmSections}
- Most important observed mappings:
${item.importantMappings.length ? item.importantMappings.map(mapping => `  - ${mapping}`).join('\n') : '  - None observed.'}
- Most important transformation:
  - ${item.importantTransformation}
- Uncertainty:
${item.uncertainty.length ? item.uncertainty.map(note => `  - ${note}`).join('\n') : '  - None observed.'}`
    )
    .join('\n\n')
}

function renderPlaybook(playbook: DraftAgentPlaybook): string {
  const renderBranch = (branch: AgentPlaybookBranch): string => `### ${branch.name}

- When to use: ${branch.whenToUse}
- Source signals:
${branch.sourceSignals.length ? branch.sourceSignals.map(signal => `  - ${signal}`).join('\n') : '  - None observed.'}
- Mapping focus:
${branch.mappingFocus.length ? branch.mappingFocus.map(item => `  - ${item}`).join('\n') : '  - None observed.'}
- Cautions:
${branch.cautions.length ? branch.cautions.map(item => `  - ${item}`).join('\n') : '  - None observed.'}`

  return `- Summary: ${playbook.summary}

### Canonical Steps

${renderStringList(playbook.canonicalSteps, 'No canonical steps recovered yet.')}

### Recurring Rules

${renderStringList(playbook.recurringRules, 'No repeated semantic rules recovered yet.')}

### Transformation Patterns

${renderStringList(playbook.transformationPatterns, 'No repeated transformation patterns recovered yet.')}

### Product-Specific Branches

${playbook.productSpecificBranches.length ? playbook.productSpecificBranches.map(renderBranch).join('\n\n') : 'No product-specific branches recovered yet.'}

### Validation Checks

${renderStringList(playbook.validationChecks, 'No validation checks recovered yet.')}

### Do Not Assume

${renderStringList(playbook.doNotAssume, 'No cautions recovered yet.')}`
}

export function renderDraftMarkdown(args: {
  artifact: DraftArtifacts
  markdownPath?: string
}): string {
  const { artifact } = args
  if (!artifact.synthesis) {
    throw new Error('Cannot render Draft markdown without a synthesized draft artifact.')
  }
  const { config, selection, generatedAt } = artifact
  const synthesis = artifact.synthesis
  const includedExamplePaths = selection.includedPairs.map(pair => pair.fpmlRelativePath)
  const successfulPairCount = artifact.pairAnalyses.filter(analysis => analysis.status === 'success').length
  const failedPairCount = artifact.pairAnalyses.filter(analysis => analysis.status === 'failed').length
  const salvagedPairCount = artifact.pairAnalyses.filter(
    analysis => analysis.status === 'success' && analysis.semanticRecovery === 'salvaged'
  ).length
  const fullSemanticPairCount = artifact.pairAnalyses.filter(
    analysis => analysis.status === 'success' && analysis.semanticRecovery === 'full'
  ).length
  const markdownHighlights = selectMarkdownHighlights(synthesis.pairLevelHighlights)
  const highlightSelectionNote =
    markdownHighlights.length < synthesis.pairLevelHighlights.length
      ? `- Showing the top \`${markdownHighlights.length}\` worked examples in markdown; the full \`${synthesis.pairLevelHighlights.length}\` remain in the JSON and debug artifacts.`
      : ''

  return `# Agent Mapping Playbook: ${synthesis.folder}

## 1. Scope

- Folder: \`${synthesis.folder}\`
- FPML root: \`${config.fpmlRoot}\`
- CDM root: \`${config.cdmRoot}\`
- Run date: \`${generatedAt.slice(0, 10)}\`
- Pairing source: \`${selection.manifestPath}\`

## 2. Evidence Coverage

- Total FpML files in folder: \`${selection.coverage.totalFpmlFilesInFolder}\`
- Matched pairs selected: \`${selection.coverage.matchedPairsUsed}\`
- Structural evidence basis: \`${synthesis.evidenceCoverage.structuralPairCount}/${synthesis.evidenceCoverage.matchedPairCount}\` matched pairs
- Semantic evidence basis: \`${synthesis.evidenceCoverage.semanticPairCount}/${synthesis.evidenceCoverage.matchedPairCount}\` pair analyses
- Full semantic analyses: \`${fullSemanticPairCount}\`
- Salvaged semantic analyses: \`${salvagedPairCount}\`
- Failed semantic pair analyses: \`${failedPairCount}\`
- Missing counterparts: \`${selection.coverage.missingCounterparts}\`
- Ignored pairs: \`${selection.coverage.ignoredPairs}\`
- Exact matches: \`${selection.coverage.exactMatches}\`
- Normalized matches: \`${selection.coverage.normalizedMatches}\`
- Alias matches: \`${selection.coverage.aliasMatches}\`
- Structural basis note: ${synthesis.evidenceCoverage.structuralBasisNote}
- Semantic basis note: ${synthesis.evidenceCoverage.semanticBasisNote}

## 3. Included Examples

${renderExamples(includedExamplePaths, selection)}

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

${renderStringList(selection.missingExamples)}

### 4.2 Ignored despite match candidate

${renderIgnoredExamples(selection.ignoredExamples)}

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

${renderStringList(synthesis.repeatedFpmlStructure.headerAndBoilerplate)}

### 5.2 Repeated top-level sections

${renderFrequencyList(synthesis.repeatedFpmlStructure.topLevelSections)}

### 5.3 Repeated nested structures

${renderStringList(synthesis.repeatedFpmlStructure.nestedStructures)}

### 5.4 Optional but common FpML sections

${renderFrequencyList(synthesis.repeatedFpmlStructure.optionalSections)}

### 5.5 Repeated CDM top-level sections

${renderFrequencyList(synthesis.repeatedCdmStructure.topLevelSections)}

### 5.6 Repeated CDM wrappers and scaffolding

${renderStringList(synthesis.repeatedCdmStructure.wrappersAndScaffolding)}

### 5.7 Optional but common CDM sections

${renderFrequencyList(synthesis.repeatedCdmStructure.optionalSections)}

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

${renderStableRules(synthesis.stableMappingPatterns)}

### 6.2 Repeated non-literal transformations

${renderTransformations(synthesis.repeatedNonLiteralTransformations)}

### 6.3 Tentative and emerging signals

${renderTentativePatterns(synthesis.tentativeRepeatedPatterns)}

### 6.4 Folder-level principles

${renderStringList(synthesis.folderLevelPrinciples, 'No strong evidence yet.')}

### 6.5 Variants and exceptions

${renderVariants(synthesis.variantsAndExceptions)}

### 6.6 Suspected enrichment or default behavior

${renderEnrichments(synthesis.suspectedEnrichmentOrDefaultBehavior)}

## 7. Agent Playbook

${renderPlaybook(synthesis.agentPlaybook)}

## 8. Pair-Level Worked Examples

${highlightSelectionNote ? `${highlightSelectionNote}\n` : ''}${renderHighlights(markdownHighlights)}

## 9. Open Questions And Risks

${renderStringList(synthesis.openQuestions, 'None observed.')}

## 10. Draft Conclusion

- Most reusable findings:
${synthesis.draftConclusion.mostReusableFindings.length
  ? synthesis.draftConclusion.mostReusableFindings.map(item => `  - ${item}`).join('\n')
  : '  - None observed.'}
- What seems safe to generalize:
${synthesis.draftConclusion.safeToGeneralize.length
  ? synthesis.draftConclusion.safeToGeneralize.map(item => `  - ${item}`).join('\n')
  : '  - None observed.'}
- What should remain tentative:
${synthesis.draftConclusion.remainTentative.length
  ? synthesis.draftConclusion.remainTentative.map(item => `  - ${item}`).join('\n')
  : '  - None observed.'}

## 11. Source Appendix

- Manifest used: \`${selection.manifestPath}\`
- Included pair count: \`${selection.includedPairs.length}\`
- Successful semantic pair count: \`${successfulPairCount}\`
- Full semantic pair count: \`${fullSemanticPairCount}\`
- Salvaged semantic pair count: \`${salvagedPairCount}\`
- Failed semantic pair count: \`${failedPairCount}\`
- Ignored pair count: \`${selection.ignoredExamples.length}\`
- Notes:
${synthesis.sourceAppendixNotes.length
  ? synthesis.sourceAppendixNotes.map(note => `  - ${note}`).join('\n')
  : '  - None observed.'}
`
}

export { DraftFolderSynthesisSchema, buildFallbackSynthesis }
