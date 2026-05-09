import { readFile, stat, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { CdmJavaApiIndex, CdmJavaClassIndexEntry } from './cdm-java-api-pack'
import { ensureCdmJavaApiPack, readCdmJavaApiIndex } from './cdm-java-api-pack'

export type RequiredCdmConcept = {
  concept: string
  searchTerms: string[]
  preferredPackages: string[]
  purpose: string
}

export type ResolvedCdmConcept = {
  concept: string
  selectedClassName: string
  candidates: string[]
  authority: 'compiled-jar-javap'
  status: 'resolved' | 'ambiguous' | 'missing'
  reason: string
  purpose: string
}

export type RelevantCdmApiDiscovery = {
  generatedAt: string
  productFamily: string
  implementationGroup: string
  relevantPackages: string[]
  searchTerms: string[]
  candidateClasses: CdmJavaClassIndexEntry[]
  resolvedConcepts: ResolvedCdmConcept[]
}

const FX_SINGLE_LEG_PACKAGES = [
  'cdm.event.common',
  'cdm.product.template',
  'cdm.product.common.settlement',
  'cdm.observable.asset',
  'cdm.observable.asset.metafields',
  'cdm.base.staticdata.party',
  'cdm.base.staticdata.party.metafields',
  'cdm.base.staticdata.asset.common',
  'cdm.base.staticdata.asset.common.metafields',
  'cdm.base.staticdata.identifier',
  'cdm.base.math',
  'com.rosetta.model.metafields',
  'com.rosetta.model.lib.records',
]

const FX_SINGLE_LEG_TERMS = [
  'Trade',
  'TradeState',
  'Contract',
  'Product',
  'EconomicTerms',
  'Payout',
  'Settlement',
  'Price',
  'Quantity',
  'PayerReceiver',
  'Underlier',
  'Observable',
  'Asset',
  'Cash',
  'Party',
  'Identifier',
  'Date',
  'Unit',
  'Meta',
]

const FX_SINGLE_LEG_CONCEPTS: RequiredCdmConcept[] = [
  {
    concept: 'Trade root',
    searchTerms: ['Trade'],
    preferredPackages: ['cdm.event.common'],
    purpose: 'Root trade object for generated CDM output.',
  },
  {
    concept: 'Trade state root',
    searchTerms: ['TradeState'],
    preferredPackages: ['cdm.event.common'],
    purpose: 'Runtime output wrapper validated as tradeState.',
  },
  {
    concept: 'Contract details',
    searchTerms: ['ContractDetails'],
    preferredPackages: ['cdm.event.common'],
    purpose: 'Attach the mapped product to the trade.',
  },
  {
    concept: 'Non-transferable product',
    searchTerms: ['NonTransferableProduct'],
    preferredPackages: ['cdm.product.template'],
    purpose: 'Represent FX single-leg product terms.',
  },
  {
    concept: 'Economic terms',
    searchTerms: ['EconomicTerms'],
    preferredPackages: ['cdm.product.template'],
    purpose: 'Contain payout and economic dates.',
  },
  {
    concept: 'Payout container',
    searchTerms: ['Payout'],
    preferredPackages: ['cdm.product.template'],
    purpose: 'Contain settlement payout details.',
  },
  {
    concept: 'Settlement payout',
    searchTerms: ['SettlementPayout'],
    preferredPackages: ['cdm.product.template', 'cdm.product.common.settlement'],
    purpose: 'Represent FX settlement payout selected from compiled jar candidates.',
  },
  {
    concept: 'Resolvable price quantity',
    searchTerms: ['ResolvablePriceQuantity'],
    preferredPackages: ['cdm.product.common.settlement', 'cdm.observable.asset'],
    purpose: 'Represent settlement price/quantity where supported by the selected payout type.',
  },
  {
    concept: 'Price schedule',
    searchTerms: ['PriceSchedule'],
    preferredPackages: ['cdm.observable.asset', 'cdm.base.math'],
    purpose: 'Represent price values without guessing a package.',
  },
  {
    concept: 'Party reference or party identity',
    searchTerms: ['PartyReference', 'ReferenceWithMetaParty', 'Party'],
    preferredPackages: ['cdm.base.staticdata.party.metafields', 'cdm.base.staticdata.party'],
    purpose: 'Represent payer, receiver, and party identity without inventing PartyReference.',
  },
]

export async function discoverRelevantCdmApi(args: {
  productFamily: string
  implementationGroup: string
}): Promise<RelevantCdmApiDiscovery> {
  await ensureCdmJavaApiPack()
  const index = await readCdmJavaApiIndex()
  const packages = packagesFor(args.productFamily, args.implementationGroup)
  const terms = termsFor(args.productFamily, args.implementationGroup)
  const concepts = conceptsFor(args.productFamily, args.implementationGroup)
  return {
    generatedAt: new Date().toISOString(),
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    relevantPackages: packages,
    searchTerms: terms,
    candidateClasses: searchCdmClassIndex({ index, packages, terms }),
    resolvedConcepts: concepts.map(concept => resolveConcept(index, concept)),
  }
}

export function searchCdmClassIndex(args: {
  index: CdmJavaApiIndex
  packages: string[]
  terms: string[]
}): CdmJavaClassIndexEntry[] {
  const matches = args.index.classes.filter(entry =>
    args.packages.some(pkg => entry.packageName === pkg || entry.packageName.startsWith(`${pkg}.`))
      && args.terms.some(term => entry.simpleName.toLowerCase().includes(term.toLowerCase()))
  )
  return dedupeClasses(matches).sort((left, right) => left.className.localeCompare(right.className))
}

export function resolveConcept(index: CdmJavaApiIndex, concept: RequiredCdmConcept): ResolvedCdmConcept {
  const matches = index.classes.filter(entry =>
    concept.searchTerms.some(term => entry.simpleName.toLowerCase() === term.toLowerCase())
  )
  const preferred = matches.find(entry =>
    concept.preferredPackages.some(pkg => entry.packageName === pkg)
  )
  const candidates = matches.map(match => match.className).sort()

  if (preferred !== undefined) {
    return {
      concept: concept.concept,
      selectedClassName: preferred.className,
      candidates,
      authority: 'compiled-jar-javap',
      status: 'resolved',
      reason: 'selected from compiled jar index using preferred package order',
      purpose: concept.purpose,
    }
  }

  if (matches.length === 1) {
    const only = matches[0]
    return {
      concept: concept.concept,
      selectedClassName: only.className,
      candidates,
      authority: 'compiled-jar-javap',
      status: 'resolved',
      reason: 'selected as the only compiled jar candidate',
      purpose: concept.purpose,
    }
  }

  return {
    concept: concept.concept,
    selectedClassName: '',
    candidates,
    authority: 'compiled-jar-javap',
    status: matches.length > 1 ? 'ambiguous' : 'missing',
    reason: matches.length > 1
      ? 'multiple compiled jar candidates; semantic recipe must choose'
      : 'no compiled jar candidates',
    purpose: concept.purpose,
  }
}

export async function writeRelevantCdmApiDiscovery(args: {
  discovery: RelevantCdmApiDiscovery
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.discovery, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderRelevantCdmApiDiscovery(args.discovery), 'utf8')
}

export async function readRelevantCdmApiDiscovery(path: string): Promise<RelevantCdmApiDiscovery> {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content) as RelevantCdmApiDiscovery
}

export async function relevantCdmApiDiscoveryExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

export function relevantCdmApiDiscoveryJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'relevant-cdm-api-candidates.json')
}

export function relevantCdmApiDiscoveryMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'relevant-cdm-api-candidates.md')
}

export function renderRelevantCdmApiDiscovery(discovery: RelevantCdmApiDiscovery): string {
  return `# Relevant CDM API Candidates

Generated: ${discovery.generatedAt}
Product family: ${discovery.productFamily}
Implementation group: ${discovery.implementationGroup}

## Relevant Packages

${discovery.relevantPackages.map(pkg => `- ${pkg}`).join('\n')}

## Search Terms

${discovery.searchTerms.map(term => `- ${term}`).join('\n')}

## Resolved Concepts

${discovery.resolvedConcepts.map(renderResolvedConcept).join('\n\n')}

## Candidate Classes

${discovery.candidateClasses.map(entry => `- ${entry.className}`).join('\n')}
`
}

function renderResolvedConcept(concept: ResolvedCdmConcept): string {
  return `### ${concept.concept}

- Status: ${concept.status}
- Selected: ${concept.selectedClassName || 'none'}
- Purpose: ${concept.purpose}
- Reason: ${concept.reason}
- Candidates:
${concept.candidates.length === 0 ? '  - none' : concept.candidates.map(candidate => `  - ${candidate}`).join('\n')}`
}

function packagesFor(productFamily: string, implementationGroup: string): string[] {
  if (productFamily === 'fx-derivatives' && implementationGroup === 'fx-single-leg') return FX_SINGLE_LEG_PACKAGES
  return FX_SINGLE_LEG_PACKAGES
}

function termsFor(productFamily: string, implementationGroup: string): string[] {
  if (productFamily === 'fx-derivatives' && implementationGroup === 'fx-single-leg') return FX_SINGLE_LEG_TERMS
  return FX_SINGLE_LEG_TERMS
}

function conceptsFor(productFamily: string, implementationGroup: string): RequiredCdmConcept[] {
  if (productFamily === 'fx-derivatives' && implementationGroup === 'fx-single-leg') return FX_SINGLE_LEG_CONCEPTS
  return FX_SINGLE_LEG_CONCEPTS
}

function dedupeClasses(entries: CdmJavaClassIndexEntry[]): CdmJavaClassIndexEntry[] {
  const byClassName = new Map<string, CdmJavaClassIndexEntry>()
  for (const entry of entries) {
    byClassName.set(entry.className, entry)
  }
  return [...byClassName.values()]
}
