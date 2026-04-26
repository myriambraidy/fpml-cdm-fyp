import type {
  CookbookFamilyDocument,
  CookbookGlobalDocument,
  CookbookManifest,
  CookbookRule,
  CookbookWorkedExample,
} from './types'

export function renderIndexMarkdown(args: {
  manifest: CookbookManifest
  familyDocuments: CookbookFamilyDocument[]
  globalDocuments: CookbookGlobalDocument[]
}): string {
  return [
    '# FPML -> CDM Agent Cookbook',
    '',
    'This provider-neutral cookbook gives an LLM the operational rules needed to propose a CDM representation from FPML while preserving evidence, confidence, and analyst review triggers.',
    '',
    '## How To Use This Cookbook',
    '',
    renderNumbered([
      'Identify the FPML product family from root, trade, and product elements.',
      'Open the matching product-family document when its status is ready or pilot_only.',
      'Apply global rules for identifiers, dates, parties, quantities, wrappers, and enrichment policy.',
      'Apply product-family rules only when source trigger signals match.',
      'Build a proposed CDM representation with explicit target paths and transformation notes.',
      'Attach confidence and evidence rule ids to each material mapping.',
      'Run the validation checklist before presenting the proposal.',
      'Mark unresolved party direction, generated identifiers, exchange-code normalization, unsupported enrichment, and partial-folder evidence for analyst review.',
      'Do not invent CDM fields, party roles, identifiers, or economic terms when evidence is missing.',
    ]),
    '',
    '## Operational Statuses',
    '',
    renderBullets([
      '`ready`: agents may apply these rules during normal proposal generation.',
      '`pilot_only`: agents may apply these rules but must mark material proposals for analyst confirmation.',
      '`review_only`: agents must not apply these rules automatically; use only as background evidence.',
      '`blocked`: agents must not use this folder as semantic mapping knowledge.',
    ]),
    '',
    '## Global Documents',
    '',
    renderBullets(args.globalDocuments.map(doc => `\`${doc.slug}.md\`: ${doc.summary}`)),
    '',
    '## Product Family Routing',
    '',
    renderFamilyRouting(args.familyDocuments),
    '',
    '## Proposed CDM Representation Format',
    '',
    'When using this cookbook, return a proposal with this provider-neutral shape:',
    '',
    '```ts',
    'interface CdmMappingProposal {',
    '  productFamily: string',
    '  operationalStatusUsed: string',
    '  proposedRepresentation: JsonValue',
    '  fieldMappings: Array<{',
    '    sourcePath: string',
    '    targetPath: string',
    '    transformation: string',
    '    confidence: string',
    '    evidenceRuleIds: string[]',
    '    needsReview: boolean',
    '    reviewReason?: string',
    '  }>',
    '  assumptions: string[]',
    '  unresolvedQuestions: string[]',
    '  validationResults: Array<{',
    '    check: string',
    "    status: 'passed' | 'failed' | 'needs_review'",
    '    details: string',
    '  }>',
    '}',
    '```',
    '',
    '## Universal Do Not Assume',
    '',
    renderBullets([
      'Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.',
      'Do not invent identifiers, global keys, external keys, LEIs, exchange codes, or taxonomy values.',
      'Do not treat suspected enrichment as source-backed mapping.',
      'Do not apply a product-family rule when the source trigger signal is absent.',
      'Do not hide unresolved questions; put them in the proposal.',
    ]),
    '',
    `Generated at: \`${args.manifest.generatedAt}\``,
    '',
  ].join('\n')
}

export function renderFamilyMarkdown(document: CookbookFamilyDocument): string {
  return [
    `# ${document.title}`,
    '',
    '## Status',
    '',
    renderBullets([
      `Operational status: \`${document.readiness.operationalStatus}\``,
      `Agent use policy: ${document.readiness.agentUsePolicy}`,
      `Semantic success rate: ${formatPercent(document.readiness.semanticSuccessRate)}`,
      document.readiness.qualityRating ? `Draft quality: \`${document.readiness.qualityRating}\`` : '',
      document.readiness.publicationStatus ? `Draft publication: \`${document.readiness.publicationStatus}\`` : '',
      document.readiness.reasonCodes.length
        ? `Readiness reasons: ${inlineList(document.readiness.reasonCodes)}`
        : '',
    ]),
    '',
    '## Trigger Signals',
    '',
    renderBullets(document.triggerSignals),
    '',
    '## Canonical Mapping Procedure',
    '',
    renderNumbered(document.canonicalProcedure),
    '',
    '## Stable Rules',
    '',
    renderRules(document.stableRules, 'No stable operational rules were recovered for this family.'),
    '',
    '## Transformations',
    '',
    renderRules(document.transformations, 'No repeated transformations were recovered for this family.'),
    '',
    '## Variants And Branches',
    '',
    renderRules(document.variants, 'No product variants or branches were recovered for this family.'),
    '',
    '## Enrichment And Defaults',
    '',
    renderRules(document.enrichments, 'No enrichment or default behavior was recovered for this family.'),
    '',
    '## Cautions And Tentative Signals',
    '',
    renderRules(document.cautions, 'No additional cautionary signals were recovered for this family.'),
    '',
    '## Do Not Assume',
    '',
    renderBullets(document.doNotAssume),
    '',
    '## Human Review Triggers',
    '',
    renderBullets(document.humanReviewTriggers),
    '',
    '## Validation Checklist',
    '',
    renderBullets(document.validationChecklist),
    '',
    '## Worked Examples',
    '',
    renderWorkedExamples(document.workedExamples),
    '',
    '## Source Evidence',
    '',
    renderBullets([`Evidence sidecar: \`${document.sourceEvidencePath}\``]),
    '',
  ].join('\n')
}

export function renderGlobalMarkdown(document: CookbookGlobalDocument): string {
  return [
    `# ${document.title}`,
    '',
    document.summary,
    '',
    '## Promoted Cross-Family Rules',
    '',
    renderRules(document.rules, 'No rules have enough cross-family evidence for promotion yet.'),
    '',
    '## Family-Specific Evidence',
    '',
    renderRules(document.familySpecificRules, 'No family-specific rules were classified into this bucket.'),
    '',
    '## Do Not Assume',
    '',
    renderBullets(document.doNotAssume),
    '',
    '## Validation Checklist',
    '',
    renderBullets(document.validationChecklist),
    '',
  ].join('\n')
}

function renderFamilyRouting(documents: CookbookFamilyDocument): string
function renderFamilyRouting(documents: CookbookFamilyDocument[]): string
function renderFamilyRouting(documents: CookbookFamilyDocument | CookbookFamilyDocument[]): string {
  const items = Array.isArray(documents) ? documents : [documents]
  if (!items.length) return '- No product-family documents generated.'
  return items
    .map(
      item =>
        `- \`${item.folder}\`: \`${item.readiness.operationalStatus}\` - ${item.readiness.agentUsePolicy}`
    )
    .join('\n')
}

function renderRules(rules: CookbookRule[], emptyMessage: string): string {
  if (!rules.length) return emptyMessage
  return rules.map(renderRule).join('\n')
}

function renderRule(rule: CookbookRule): string {
  return [
    `### ${rule.title}`,
    '',
    renderBullets([
      `Rule id: \`${rule.id}\``,
      rule.family ? `Family: \`${rule.family}\`` : '',
      `Kind: \`${rule.kind}\``,
      `Operational status: \`${rule.operationalStatus}\``,
      `Confidence: \`${rule.confidence}\``,
      `Source signals: ${inlineList(rule.sourceSignals)}`,
      rule.targetPaths.length ? `Target CDM paths: ${inlineList(rule.targetPaths)}` : 'Target CDM paths: none recovered; treat as branch, caution, or review guidance.',
      `Action: ${rule.action}`,
      `Rationale: ${rule.rationale}`,
      `Evidence: ${rule.evidence.count} examples from ${rule.evidence.semanticBasis}/${rule.evidence.totalPairs} semantic pairs`,
      rule.caveats.length ? `Caveats: ${inlineList(rule.caveats)}` : '',
      rule.humanReviewTriggers.length ? `Human review when: ${inlineList(rule.humanReviewTriggers)}` : '',
      rule.validationChecks.length ? `Validate: ${inlineList(rule.validationChecks)}` : '',
    ]),
    '',
  ].join('\n')
}

function renderWorkedExamples(examples: CookbookWorkedExample[]): string {
  if (!examples.length) return 'No worked examples recovered.'
  return examples
    .map(
      example => [
        `### ${example.title}`,
        '',
        '- Source signals:',
        renderIndentedBullets(example.sourceSignals),
        '- CDM proposal guidance:',
        renderIndentedBullets(example.cdmProposal),
        '- Validation:',
        renderIndentedBullets(example.validation),
      ].join('\n')
    )
    .join('\n\n')
}

function renderBullets(items: string[]): string {
  const filtered = items.map(item => item.trim()).filter(Boolean)
  if (!filtered.length) return '- None.'
  return filtered.map(item => `- ${item}`).join('\n')
}

function renderIndentedBullets(items: string[]): string {
  const filtered = items.map(item => item.trim()).filter(Boolean)
  if (!filtered.length) return '  - None.'
  return filtered.map(item => `  - ${item}`).join('\n')
}

function renderNumbered(items: string[]): string {
  const filtered = items.map(item => item.trim()).filter(Boolean)
  if (!filtered.length) return '1. None.'
  return filtered.map((item, index) => `${index + 1}. ${item}`).join('\n')
}

function inlineList(items: string[]): string {
  const filtered = items.map(item => item.trim()).filter(Boolean)
  if (!filtered.length) return 'none'
  return filtered.map(item => `\`${item}\``).join(', ')
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
