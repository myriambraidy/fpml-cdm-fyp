import type {
  DraftFolderSynthesis,
  EnrichmentSummary,
  StableMappingRule,
  TentativeRepeatedPattern,
  TransformationSummary,
  VariantSummary,
} from '../draft/types'
import type {
  CookbookConfidence,
  CookbookEvidence,
  CookbookFamilyDocument,
  CookbookRule,
  CookbookRuleKind,
  CookbookWorkedExample,
  FamilyReadiness,
  LoadedDraftFamily,
  OperationalStatus,
} from './types'

const MAX_WORKED_EXAMPLES = 3

export function extractCookbookRules(args: {
  family: LoadedDraftFamily
  readiness: FamilyReadiness
}): CookbookRule[] {
  const synthesis = args.family.artifact.synthesis
  if (!synthesis) return []

  return dedupeRules([
    ...synthesis.stableMappingPatterns.map(rule =>
      stableRuleToCookbookRule({
        family: args.family,
        readiness: args.readiness,
        rule,
      })
    ),
    ...synthesis.repeatedNonLiteralTransformations.map(rule =>
      transformationToCookbookRule({
        family: args.family,
        readiness: args.readiness,
        rule,
      })
    ),
    ...synthesis.tentativeRepeatedPatterns.map(rule =>
      tentativeToCookbookRule({
        family: args.family,
        readiness: args.readiness,
        rule,
      })
    ),
    ...synthesis.variantsAndExceptions.map(rule =>
      variantToCookbookRule({
        family: args.family,
        readiness: args.readiness,
        rule,
      })
    ),
    ...synthesis.suspectedEnrichmentOrDefaultBehavior.map(rule =>
      enrichmentToCookbookRule({
        family: args.family,
        readiness: args.readiness,
        rule,
      })
    ),
  ])
}

export function buildFamilyDocument(args: {
  family: LoadedDraftFamily
  readiness: FamilyReadiness
  rules: CookbookRule[]
}): CookbookFamilyDocument {
  const synthesis = args.family.artifact.synthesis!
  const playbook = synthesis.agentPlaybook

  return {
    folder: args.family.folder,
    title: `FPML -> CDM Cookbook: ${args.family.folder}`,
    readiness: args.readiness,
    triggerSignals: deriveTriggerSignals(synthesis),
    canonicalProcedure: normalizeProcedure(playbook.canonicalSteps),
    stableRules: args.rules.filter(rule => rule.kind === 'mapping'),
    transformations: args.rules.filter(rule => rule.kind === 'transformation'),
    variants: args.rules.filter(rule => rule.kind === 'variant'),
    enrichments: args.rules.filter(rule => rule.kind === 'enrichment'),
    cautions: args.rules.filter(rule => rule.kind === 'caution' || rule.kind === 'validation'),
    doNotAssume: unique([
      ...playbook.doNotAssume,
      ...args.rules.flatMap(rule => rule.doNotAssume),
      ...deriveFolderDoNotAssume(synthesis),
    ]),
    humanReviewTriggers: unique([
      ...synthesis.openQuestions,
      ...args.rules.flatMap(rule => rule.humanReviewTriggers),
    ]),
    validationChecklist: unique([
      ...playbook.validationChecks,
      ...args.rules.flatMap(rule => rule.validationChecks),
      ...buildUniversalValidationChecks(args.readiness.operationalStatus),
    ]),
    workedExamples: buildWorkedExamples(synthesis),
    sourceEvidencePath: `../references/${args.family.folder}.evidence.json`,
  }
}

export function stableRuleToCookbookRule(args: {
  family: LoadedDraftFamily
  readiness: FamilyReadiness
  rule: StableMappingRule
}): CookbookRule {
  const evidenceCoverage = args.family.artifact.synthesis!.evidenceCoverage
  return {
    id: `${args.family.folder}:${args.rule.id}`,
    family: args.family.folder,
    kind: 'mapping',
    title: args.rule.name,
    operationalStatus: args.readiness.operationalStatus,
    confidence: computeRuleConfidence({
      documentStatus: args.readiness.operationalStatus,
      evidenceCount: args.rule.evidenceCount,
      totalPairs: evidenceCoverage.matchedPairCount,
      caveats: args.rule.caveats,
      isTentative: false,
      kind: 'mapping',
    }),
    sourceSignals: [args.rule.sourcePattern],
    targetPaths: [args.rule.targetPattern],
    action: args.rule.explanation,
    rationale: args.rule.whyItWorksThisWay,
    evidence: buildEvidence(args.family, args.rule.evidenceCount, args.rule.exampleFiles),
    caveats: args.rule.caveats,
    doNotAssume: deriveDoNotAssume([
      ...args.rule.caveats,
      args.rule.sourcePattern,
      args.rule.targetPattern,
    ]),
    validationChecks: deriveValidationChecks({
      sourceSignals: [args.rule.sourcePattern],
      targetPaths: [args.rule.targetPattern],
      action: args.rule.explanation,
    }),
    humanReviewTriggers: deriveHumanReviewTriggers([
      ...args.rule.caveats,
      args.rule.sourcePattern,
      args.rule.targetPattern,
    ]),
  }
}

function transformationToCookbookRule(args: {
  family: LoadedDraftFamily
  readiness: FamilyReadiness
  rule: TransformationSummary
}): CookbookRule {
  const sourceSignals = [args.rule.sourceSide]
  const targetPaths = [args.rule.targetSide]
  return {
    id: `${args.family.folder}:${args.rule.id}`,
    family: args.family.folder,
    kind: 'transformation',
    title: args.rule.name,
    operationalStatus: args.readiness.operationalStatus,
    confidence: computeRuleConfidence({
      documentStatus: args.readiness.operationalStatus,
      evidenceCount: args.rule.evidenceCount,
      totalPairs: args.family.artifact.synthesis!.evidenceCoverage.matchedPairCount,
      caveats: args.rule.notes,
      isTentative: false,
      kind: 'transformation',
    }),
    sourceSignals,
    targetPaths,
    action: args.rule.description,
    rationale: `Apply this ${args.rule.type} transformation when the source-side signal is present.`,
    evidence: buildEvidence(args.family, args.rule.evidenceCount, args.rule.exampleFiles),
    caveats: args.rule.notes,
    doNotAssume: deriveDoNotAssume([...args.rule.notes, args.rule.description]),
    validationChecks: deriveValidationChecks({
      sourceSignals,
      targetPaths,
      action: args.rule.description,
    }),
    humanReviewTriggers: deriveHumanReviewTriggers([...args.rule.notes, args.rule.description]),
  }
}

function tentativeToCookbookRule(args: {
  family: LoadedDraftFamily
  readiness: FamilyReadiness
  rule: TentativeRepeatedPattern
}): CookbookRule {
  const kind = mapTentativeKind(args.rule.kind)
  return {
    id: `${args.family.folder}:${args.rule.id}`,
    family: args.family.folder,
    kind,
    title: args.rule.description,
    operationalStatus: args.readiness.operationalStatus,
    confidence: computeRuleConfidence({
      documentStatus: args.readiness.operationalStatus,
      evidenceCount: args.rule.evidenceCount,
      totalPairs: args.family.artifact.synthesis!.evidenceCoverage.matchedPairCount,
      caveats: args.rule.notes,
      isTentative: true,
      kind,
    }),
    sourceSignals: [args.rule.description],
    targetPaths: [],
    action: `Treat as tentative ${args.rule.kind} guidance; apply only when the source evidence exactly matches.`,
    rationale: `Recovered as a ${args.rule.strength} from draft synthesis, but not promoted to a stable rule.`,
    evidence: buildEvidence(args.family, args.rule.evidenceCount, args.rule.exampleFiles),
    caveats: args.rule.notes,
    doNotAssume: unique([
      'Do not apply this tentative pattern without matching source evidence.',
      ...deriveDoNotAssume(args.rule.notes),
    ]),
    validationChecks: [
      'Confirm the source document contains an exact signal matching this tentative pattern.',
      'Mark the mapped field as requiring analyst review.',
    ],
    humanReviewTriggers: unique([
      'This pattern is tentative and needs analyst confirmation before it is treated as stable.',
      ...deriveHumanReviewTriggers(args.rule.notes),
    ]),
  }
}

function variantToCookbookRule(args: {
  family: LoadedDraftFamily
  readiness: FamilyReadiness
  rule: VariantSummary
}): CookbookRule {
  return {
    id: `${args.family.folder}:${args.rule.id}`,
    family: args.family.folder,
    kind: 'variant',
    title: args.rule.name,
    operationalStatus: args.readiness.operationalStatus,
    confidence: computeRuleConfidence({
      documentStatus: args.readiness.operationalStatus,
      evidenceCount: args.rule.seenIn.length,
      totalPairs: args.family.artifact.synthesis!.evidenceCoverage.matchedPairCount,
      caveats: [args.rule.impactOnGeneralization],
      isTentative: false,
      kind: 'variant',
    }),
    sourceSignals: [args.rule.description],
    targetPaths: [],
    action: args.rule.impactOnGeneralization,
    rationale: 'Use this branch only when the source product subtype or structure matches the variant description.',
    evidence: buildEvidence(args.family, args.rule.seenIn.length, args.rule.seenIn),
    caveats: [args.rule.impactOnGeneralization],
    doNotAssume: deriveDoNotAssume([args.rule.description, args.rule.impactOnGeneralization]),
    validationChecks: [
      'Confirm the source product subtype matches this variant before applying variant-specific mapping rules.',
    ],
    humanReviewTriggers: deriveHumanReviewTriggers([args.rule.impactOnGeneralization]),
  }
}

function enrichmentToCookbookRule(args: {
  family: LoadedDraftFamily
  readiness: FamilyReadiness
  rule: EnrichmentSummary
}): CookbookRule {
  return {
    id: `${args.family.folder}:${args.rule.id}`,
    family: args.family.folder,
    kind: 'enrichment',
    title: args.rule.name,
    operationalStatus: args.readiness.operationalStatus,
    confidence: 'low',
    sourceSignals: [args.rule.description],
    targetPaths: [],
    action: `Treat as ${args.rule.classification}; do not generate enriched CDM values unless source evidence or an approved default supports them.`,
    rationale: args.rule.description,
    evidence: buildEvidence(args.family, args.rule.evidence.length, args.rule.evidence),
    caveats: args.rule.caution,
    doNotAssume: unique([
      'Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.',
      ...deriveDoNotAssume(args.rule.caution),
    ]),
    validationChecks: [
      'Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.',
    ],
    humanReviewTriggers: unique([
      'The CDM proposal contains enrichment or default behavior not directly copied from FpML.',
      ...deriveHumanReviewTriggers(args.rule.caution),
    ]),
  }
}

export function computeRuleConfidence(args: {
  documentStatus: OperationalStatus
  evidenceCount: number
  totalPairs: number
  caveats: string[]
  isTentative: boolean
  kind: CookbookRuleKind
}): CookbookConfidence {
  if (args.documentStatus === 'blocked' || args.documentStatus === 'review_only') return 'blocked'
  if (args.kind === 'enrichment' || args.isTentative) return 'low'
  if (args.evidenceCount >= 5 && args.caveats.length === 0) return 'high'
  if (args.evidenceCount / Math.max(args.totalPairs, 1) >= 0.2 && args.caveats.length <= 1) return 'high'
  if (args.evidenceCount >= 2) return 'medium'
  return 'low'
}

function buildEvidence(
  family: LoadedDraftFamily,
  evidenceCount: number,
  files: string[]
): CookbookEvidence {
  const evidenceCoverage = family.artifact.synthesis!.evidenceCoverage
  return {
    count: evidenceCount,
    files,
    draftPath: family.draftPath,
    semanticBasis: evidenceCoverage.semanticPairCount,
    totalPairs: evidenceCoverage.matchedPairCount,
  }
}

function mapTentativeKind(kind: TentativeRepeatedPattern['kind']): CookbookRuleKind {
  if (kind === 'transformation') return 'transformation'
  if (kind === 'enrichment') return 'enrichment'
  return 'caution'
}

function deriveTriggerSignals(synthesis: DraftFolderSynthesis): string[] {
  return unique([
    synthesis.folder,
    ...synthesis.repeatedFpmlStructure.topLevelSections.map(item => `FpML top-level section: ${item.section}`),
    ...synthesis.repeatedFpmlStructure.nestedStructures.slice(0, 8),
    ...synthesis.agentPlaybook.productSpecificBranches.flatMap(branch => branch.sourceSignals),
  ]).slice(0, 20)
}

function normalizeProcedure(steps: string[]): string[] {
  const fallback = [
    'Identify the FPML product family and product subtype from root and trade product elements.',
    'Resolve parties, party hrefs, and payer/receiver direction before mapping economics.',
    'Map trade identifiers and dates with explicit normalization notes.',
    'Map economic quantities, prices, currencies, units, payout, settlement, and exercise structures.',
    'Record every assumption, confidence level, evidence rule id, and analyst review trigger.',
    'Run the validation checklist before presenting the proposed CDM representation.',
  ]
  return unique(steps.length ? steps : fallback)
}

function deriveFolderDoNotAssume(synthesis: DraftFolderSynthesis): string[] {
  return unique([
    ...synthesis.draftConclusion.remainTentative.map(item => `Do not treat as stable: ${item}`),
    ...synthesis.suspectedEnrichmentOrDefaultBehavior.map(
      item => `Do not assume enrichment/default behavior for ${item.name} without source evidence or analyst approval.`
    ),
  ])
}

function buildUniversalValidationChecks(status: OperationalStatus): string[] {
  const checks = [
    'Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.',
    'Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.',
  ]
  if (status === 'pilot_only') {
    checks.push('Because this family is pilot-only, mark the overall proposal as requiring analyst confirmation.')
  }
  if (status === 'review_only' || status === 'blocked') {
    checks.push('Do not use this document to automatically map fields; use it only to explain uncertainty.')
  }
  return checks
}

function buildWorkedExamples(synthesis: DraftFolderSynthesis): CookbookWorkedExample[] {
  return synthesis.pairLevelHighlights.slice(0, MAX_WORKED_EXAMPLES).map(item => ({
    title: `${item.fpmlFile} -> ${item.cdmFile}`,
    sourceSignals: [item.mainFpmlSections],
    cdmProposal: [...item.importantMappings, item.importantTransformation],
    validation: item.uncertainty.length
      ? item.uncertainty.map(note => `Review uncertainty: ${note}`)
      : ['Confirm mapped CDM structures preserve the source economics and identifiers.'],
  }))
}

function deriveValidationChecks(args: {
  sourceSignals: string[]
  targetPaths: string[]
  action: string
}): string[] {
  const text = [...args.sourceSignals, ...args.targetPaths, args.action].join(' ')
  const checks = [
    `Confirm the FPML source contains: ${args.sourceSignals.join('; ')}.`,
  ]
  if (args.targetPaths.length) {
    checks.push(`Confirm the proposed CDM representation populates: ${args.targetPaths.join('; ')}.`)
  }
  checks.push('Confirm the value is copied, normalized, transformed, or enriched according to the rule action.')
  if (/date|time|timezone|unadjusted/i.test(text)) {
    checks.push('Confirm date/time normalization is intentional and does not drop required timezone semantics.')
  }
  if (/party|payer|receiver|buyer|seller|counterparty|href/i.test(text)) {
    checks.push('Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.')
  }
  if (/amount|currency|quantity|price|unit|notional/i.test(text)) {
    checks.push('Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.')
  }
  return unique(checks)
}

function deriveDoNotAssume(values: string[]): string[] {
  const text = values.join(' ')
  const items: string[] = []
  if (/party|payer|receiver|buyer|seller|counterparty|href/i.test(text)) {
    items.push('Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.')
  }
  if (/identifier|tradeid|globalkey|externalkey|lei/i.test(text)) {
    items.push('Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.')
  }
  if (/exchange|taxonomy|scheme/i.test(text)) {
    items.push('Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.')
  }
  if (/enrich|default|unclear|suspect|caveat|ambiguous/i.test(text)) {
    items.push('Do not treat caveated or unclear behavior as a stable mapping rule.')
  }
  return unique(items)
}

function deriveHumanReviewTriggers(values: string[]): string[] {
  const text = values.join(' ')
  const triggers: string[] = []
  if (/unclear|ambiguous|caveat|inconsistent|not consistently|requires|insufficient|unresolved/i.test(text)) {
    triggers.push('The supporting evidence is caveated, inconsistent, or explicitly incomplete.')
  }
  if (/party|payer|receiver|buyer|seller|counterparty/i.test(text)) {
    triggers.push('Party role or payment direction affects economic meaning.')
  }
  if (/enrich|default|globalkey|externalkey|lei|exchange|taxonomy/i.test(text)) {
    triggers.push('The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.')
  }
  return unique(triggers)
}

function unique(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    const normalized = value.trim()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }
  return result
}

function dedupeRules(rules: CookbookRule[]): CookbookRule[] {
  const seen = new Set<string>()
  const result: CookbookRule[] = []
  for (const rule of rules) {
    const key = [
      rule.family ?? '',
      rule.kind,
      rule.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(),
      rule.sourceSignals.join('|').toLowerCase(),
      rule.targetPaths.join('|').toLowerCase(),
    ].join('::')
    if (seen.has(key)) continue
    seen.add(key)
    result.push(rule)
  }
  return result
}
