import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { readCdmJavaApiIndex } from './cdm-java-api-pack'
import type { RelevantCdmApiDiscovery, ResolvedCdmConcept } from './cdm-concept-resolver'
import { discoverRelevantCdmApi } from './cdm-concept-resolver'
import type { CdmApiSelection } from './cdm-api-selection'
import {
  buildCdmApiSelectionPass1,
  buildFinalCdmApiSelection,
  isForbiddenApprovedContractClass,
} from './cdm-api-selection'
import type { FxBuilderMethodIntent, ResolvedBuilderMethod } from './cdm-builder-method-resolver'
import type { DocumentationAuthority } from './semantic-docs'
import { renderAuthorities } from './semantic-docs'

export type ApprovedCdmClass = {
  className: string
  reason: string
  existenceAuthority: 'compiled-jar-javap'
  semanticAuthorities: DocumentationAuthority[]
  allowedUsages: string[]
}

export type ForbiddenCdmClass = {
  className: string
  reason: string
  replacement?: string
}

export type ApprovedBuilderMethod = {
  className: string
  methodName: string
  parameterTypes: string[]
  returnType: string
  rawSignature: string
  intent: FxBuilderMethodIntent
  source: 'compiled-jar-javap'
  reason: string
}

export type ApprovedCdmApiContract = {
  generatedAt: string
  productFamily: string
  implementationGroup: string
  authority: 'compiled-jar-javap-and-semantic-recipes'
  approvedClasses: ApprovedCdmClass[]
  forbiddenClasses: ForbiddenCdmClass[]
  approvedBuilderMethods: ApprovedBuilderMethod[]
  conceptResolutions: ResolvedCdmConcept[]
}

const SEMANTIC_AUTHORITIES: DocumentationAuthority[] = ['rosetta-source', 'cookbook', 'generated-recipe']

export async function buildApprovedCdmApiContract(args: {
  productFamily: string
  implementationGroup: string
  discovery?: RelevantCdmApiDiscovery
  selection?: CdmApiSelection
  approvedBuilderMethods?: ResolvedBuilderMethod[]
}): Promise<ApprovedCdmApiContract> {
  const discovery = args.discovery ?? await discoverRelevantCdmApi({
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
  })
  const selection = args.selection ?? await buildFallbackSelection({
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    discovery,
  })
  const index = await readCdmJavaApiIndex()
  const indexedClassNames = new Set(index.classes.map(entry => entry.className))
  const approvedClassNames = new Set<string>()

  for (const selected of selection.selectedClasses) {
    approvedClassNames.add(selected.className)
  }

  const approvedClasses = [...approvedClassNames]
    .filter(className => indexedClassNames.has(className))
    .filter(className => !isForbiddenApprovedContractClass(className))
    .sort()
    .map(className => ({
      className,
      reason: reasonForApprovedClass(className, discovery, selection),
      existenceAuthority: 'compiled-jar-javap' as const,
      semanticAuthorities: SEMANTIC_AUTHORITIES,
      allowedUsages: usagesForClass(className),
    }))

  return {
    generatedAt: new Date().toISOString(),
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    authority: 'compiled-jar-javap-and-semantic-recipes',
    approvedClasses,
    forbiddenClasses: buildForbiddenClasses(selection, new Set(approvedClasses.map(item => item.className))),
    approvedBuilderMethods: buildApprovedBuilderMethods(args.approvedBuilderMethods ?? [], approvedClasses.map(item => item.className)),
    conceptResolutions: discovery.resolvedConcepts,
  }
}

export async function writeApprovedCdmApiContract(args: {
  contract: ApprovedCdmApiContract
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.contract, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderApprovedCdmApiContract(args.contract), 'utf8')
}

export async function readApprovedCdmApiContract(path: string): Promise<ApprovedCdmApiContract> {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content) as ApprovedCdmApiContract
}

export async function approvedCdmApiContractExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

export function approvedCdmApiContractJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'approved-cdm-api-contract.json')
}

export function approvedCdmApiContractMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'approved-cdm-api-contract.md')
}

export function approvedCdmApiContractSummaryPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'approved-cdm-api-contract-summary.md')
}

export function renderApprovedCdmApiContract(contract: ApprovedCdmApiContract): string {
  return `# Approved CDM API Contract

Generated: ${contract.generatedAt}
Product family: ${contract.productFamily}
Implementation group: ${contract.implementationGroup}
Authority: ${contract.authority}

## Rules

- Import only classes listed under Approved Classes.
- Do not import classes listed under Forbidden Classes.
- If a required class is not approved, stop and update this contract before implementation.
- The gate validates generated Java against this same contract.

## Concept Resolutions

${contract.conceptResolutions.map(renderConceptResolution).join('\n\n')}

## Approved Classes

${contract.approvedClasses.map(renderApprovedClass).join('\n\n')}

## Forbidden Classes

${contract.forbiddenClasses.length === 0 ? '- none' : contract.forbiddenClasses.map(renderForbiddenClass).join('\n')}

## Approved Builder Methods

${contract.approvedBuilderMethods.length === 0 ? '- none' : contract.approvedBuilderMethods.map(renderApprovedBuilderMethod).join('\n')}
`
}

export function renderApprovedCdmApiContractSummary(contract: ApprovedCdmApiContract): string {
  const methodsByClass = groupBuilderMethodsByClass(contract.approvedBuilderMethods)
  return `# Approved CDM API Contract Summary

Generated: ${contract.generatedAt}
Product family: ${contract.productFamily}
Implementation group: ${contract.implementationGroup}
Authority: ${contract.authority}

## Rules

- This summary is the default prompt authority.
- The full contract stays on disk as approved-cdm-api-contract.json and approved-cdm-api-contract.md.
- Import or fully qualify only approved classes listed below.
- Use get_cdm_builder_methods for exact method details before using a builder method.
- Use get_cdm_java_class only for classes already approved by this contract or resolved by concept.
- Forbidden categories are validation, utility, processor, and metadata implementation packages unless explicitly approved.

## Counts

- Approved classes: ${contract.approvedClasses.length}
- Approved builder methods: ${contract.approvedBuilderMethods.length}
- Forbidden full-contract entries: ${contract.forbiddenClasses.length}

## Approved Classes

${contract.approvedClasses.map(item => `- ${item.className}`).join('\n')}

## Approved Builder Method Index

${methodsByClass.map(([className, methods]) => renderMethodSummary(className, methods)).join('\n')}
`
}

async function buildFallbackSelection(args: {
  productFamily: string
  implementationGroup: string
  discovery: RelevantCdmApiDiscovery
}): Promise<CdmApiSelection> {
  const pass1 = await buildCdmApiSelectionPass1(args)
  return buildFinalCdmApiSelection({
    ...args,
    pass1Selection: pass1,
    recipeRequiredClasses: [],
    builderParameterClasses: [],
    recipeId: 'fallback',
  })
}

function reasonForApprovedClass(
  className: string,
  discovery: RelevantCdmApiDiscovery,
  selection: CdmApiSelection
): string {
  const selected = selection.selectedClasses.find(item => item.className === className)
  if (selected !== undefined) {
    return `Selected by ${selected.reason}; evidence: ${selected.evidence.join('; ')}.`
  }
  const concept = discovery.resolvedConcepts.find(item => item.selectedClassName === className)
  if (concept !== undefined) return `Selected for concept: ${concept.concept}. ${concept.purpose}`
  return 'Selected by final CDM API selection.'
}

function usagesForClass(className: string): string[] {
  if (className.includes('.metafields.')) return ['metadata wrapper construction where required by approved recipes']
  if (className.includes('.settlement.')) return ['settlement construction in approved recipes']
  if (className.includes('.party')) return ['party, counterparty, payer, receiver, or reference construction']
  if (className.includes('.observable.')) return ['observable, price, quantity, or underlier construction']
  if (className.includes('.template.')) return ['product, economic terms, payout, or root product construction']
  if (className.includes('.event.common.')) return ['trade root or trade state construction']
  return ['approved CDM construction where cited by recipes']
}

function buildForbiddenClasses(selection: CdmApiSelection, approvedClassNames: Set<string>): ForbiddenCdmClass[] {
  const forbidden = new Map<string, ForbiddenCdmClass>()
  for (const rejected of selection.rejectedClasses) {
    if (approvedClassNames.has(rejected.className)) continue
    forbidden.set(rejected.className, rejected)
  }
  return [...forbidden.values()].sort((left, right) => left.className.localeCompare(right.className))
}

function buildApprovedBuilderMethods(
  methods: ResolvedBuilderMethod[],
  approvedClassNames: string[]
): ApprovedBuilderMethod[] {
  const approved = new Set(approvedClassNames)
  return methods
    .filter(method => approved.has(method.className))
    .map(method => ({
      ...method,
      reason: `Verified on compiled CDM Java builder by javap for intent ${method.intent}.`,
    }))
    .sort((left, right) =>
      `${left.className}.${left.methodName}.${left.rawSignature}`.localeCompare(
        `${right.className}.${right.methodName}.${right.rawSignature}`
      )
    )
}

function renderConceptResolution(concept: ResolvedCdmConcept): string {
  return `### ${concept.concept}

- Status: ${concept.status}
- Selected: ${concept.selectedClassName || 'none'}
- Reason: ${concept.reason}
- Purpose: ${concept.purpose}`
}

function renderApprovedClass(item: ApprovedCdmClass): string {
  return `### ${item.className}

- Reason: ${item.reason}
- Existence authority: ${item.existenceAuthority}
- Semantic authorities: ${renderAuthorities(item.semanticAuthorities)}
- Allowed usages: ${item.allowedUsages.join('; ')}`
}

function renderForbiddenClass(item: ForbiddenCdmClass): string {
  return `- ${item.className}: ${item.reason}${item.replacement ? ` Use ${item.replacement}.` : ''}`
}

function renderApprovedBuilderMethod(item: ApprovedBuilderMethod): string {
  return `- ${item.className}.${item.methodName} [${item.intent}]: \`${item.rawSignature}\``
}

function groupBuilderMethodsByClass(methods: ApprovedBuilderMethod[]): Array<[string, ApprovedBuilderMethod[]]> {
  const grouped = new Map<string, ApprovedBuilderMethod[]>()
  for (const method of methods) {
    const existing = grouped.get(method.className) ?? []
    existing.push(method)
    grouped.set(method.className, existing)
  }
  return [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right))
}

function renderMethodSummary(className: string, methods: ApprovedBuilderMethod[]): string {
  const unique = [...new Set(methods.map(method => `${method.methodName} [${method.intent}]`))].sort()
  return `- ${className}: ${unique.join(', ')}`
}
