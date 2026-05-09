import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { CdmJavaApiIndex } from './cdm-java-api-pack'
import { readCdmJavaApiIndex } from './cdm-java-api-pack'
import type { RelevantCdmApiDiscovery } from './cdm-concept-resolver'

export const FORBIDDEN_APPROVED_CONTRACT_PACKAGE_SEGMENTS = [
  '.validation.',
  '.validation.datarule.',
  '.validation.exists.',
  '.util.',
  '.processor.',
  '.meta.',
]

export type CdmApiSelectionPass = 'pass1' | 'pass2'

export type CdmApiSelectionReason =
  | 'resolved-concept'
  | 'draft-recipe-required'
  | 'verified-builder-parameter'
  | 'runtime-serialization'
  | 'metafield-required'

export type SelectedCdmApiClass = {
  className: string
  selectedInPass: CdmApiSelectionPass
  reason: CdmApiSelectionReason
  evidence: string[]
  requiredByRecipeIds: string[]
}

export type RejectedCdmApiClass = {
  className: string
  reason: string
  replacement?: string
}

export type CdmApiSelection = {
  generatedAt: string
  productFamily: string
  implementationGroup: string
  pass: CdmApiSelectionPass
  selectedClasses: SelectedCdmApiClass[]
  rejectedClasses: RejectedCdmApiClass[]
  candidateClassCount: number
}

export type FinalCdmApiSelectionInput = {
  productFamily: string
  implementationGroup: string
  discovery: RelevantCdmApiDiscovery
  pass1Selection: CdmApiSelection
  recipeRequiredClasses: string[]
  builderParameterClasses: string[]
  recipeId: string
}

export function cdmApiSelectionPass1JsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'cdm-api-selection-pass1.json')
}

export function cdmApiSelectionPass1MarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'cdm-api-selection-pass1.md')
}

export function cdmApiSelectionFinalJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'cdm-api-selection-final.json')
}

export function cdmApiSelectionFinalMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'cdm-api-selection-final.md')
}

export async function buildCdmApiSelectionPass1(args: {
  productFamily: string
  implementationGroup: string
  discovery: RelevantCdmApiDiscovery
}): Promise<CdmApiSelection> {
  const index = await readCdmJavaApiIndex()
  const selected = new Map<string, SelectedCdmApiClass>()

  for (const concept of args.discovery.resolvedConcepts) {
    if (concept.status !== 'resolved' || concept.selectedClassName === '') continue
    if (!indexHasClass(index, concept.selectedClassName)) continue
    selected.set(concept.selectedClassName, {
      className: concept.selectedClassName,
      selectedInPass: 'pass1',
      reason: 'resolved-concept',
      evidence: [`concept:${concept.concept}`, concept.reason],
      requiredByRecipeIds: [],
    })
  }

  return {
    generatedAt: new Date().toISOString(),
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    pass: 'pass1',
    selectedClasses: sortSelectedClasses([...selected.values()]),
    rejectedClasses: buildRejectedClasses(args.discovery, selected),
    candidateClassCount: args.discovery.candidateClasses.length,
  }
}

export async function buildFinalCdmApiSelection(args: FinalCdmApiSelectionInput): Promise<CdmApiSelection> {
  const index = await readCdmJavaApiIndex()
  const selected = new Map<string, SelectedCdmApiClass>()

  for (const item of args.pass1Selection.selectedClasses) {
    selected.set(item.className, { ...item })
  }

  for (const className of args.recipeRequiredClasses) {
    addSelectedClass({
      selected,
      index,
      className,
      selectedInPass: 'pass2',
      reason: className.includes('.metafields.') ? 'metafield-required' : 'draft-recipe-required',
      evidence: [`draft-recipe:${args.recipeId}`],
      requiredByRecipeIds: [args.recipeId],
    })
  }

  for (const className of args.builderParameterClasses) {
    addSelectedClass({
      selected,
      index,
      className,
      selectedInPass: 'pass2',
      reason: 'verified-builder-parameter',
      evidence: [`builder-parameter:${className}`],
      requiredByRecipeIds: [args.recipeId],
    })
  }

  return {
    generatedAt: new Date().toISOString(),
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    pass: 'pass2',
    selectedClasses: sortSelectedClasses([...selected.values()]),
    rejectedClasses: buildRejectedClasses(args.discovery, selected),
    candidateClassCount: args.discovery.candidateClasses.length,
  }
}

export async function writeCdmApiSelection(args: {
  selection: CdmApiSelection
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.selection, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderCdmApiSelection(args.selection), 'utf8')
}

export async function readCdmApiSelection(path: string): Promise<CdmApiSelection> {
  return JSON.parse(await readFile(path, 'utf8')) as CdmApiSelection
}

export async function cdmApiSelectionExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

export function renderCdmApiSelection(selection: CdmApiSelection): string {
  return `# CDM API Selection

Generated: ${selection.generatedAt}
Product family: ${selection.productFamily}
Implementation group: ${selection.implementationGroup}
Pass: ${selection.pass}
Candidate class count: ${selection.candidateClassCount}
Selected class count: ${selection.selectedClasses.length}
Rejected class count: ${selection.rejectedClasses.length}

## Selected Classes

${selection.selectedClasses.map(renderSelectedClass).join('\n\n')}

## Rejected Classes

${selection.rejectedClasses.length === 0 ? '- none' : selection.rejectedClasses.map(renderRejectedClass).join('\n')}
`
}

export function isForbiddenApprovedContractClass(className: string): boolean {
  return FORBIDDEN_APPROVED_CONTRACT_PACKAGE_SEGMENTS.some(segment => className.includes(segment))
}

function addSelectedClass(args: {
  selected: Map<string, SelectedCdmApiClass>
  index: CdmJavaApiIndex
  className: string
  selectedInPass: CdmApiSelectionPass
  reason: CdmApiSelectionReason
  evidence: string[]
  requiredByRecipeIds: string[]
}): void {
  if (args.className === '') return
  if (!indexHasClass(args.index, args.className)) return
  if (isForbiddenApprovedContractClass(args.className)) return
  const existing = args.selected.get(args.className)
  if (existing !== undefined) {
    args.selected.set(args.className, {
      ...existing,
      evidence: mergeStrings(existing.evidence, args.evidence),
      requiredByRecipeIds: mergeStrings(existing.requiredByRecipeIds, args.requiredByRecipeIds),
    })
    return
  }
  args.selected.set(args.className, {
    className: args.className,
    selectedInPass: args.selectedInPass,
    reason: args.reason,
    evidence: args.evidence,
    requiredByRecipeIds: args.requiredByRecipeIds,
  })
}

function buildRejectedClasses(
  discovery: RelevantCdmApiDiscovery,
  selected: Map<string, SelectedCdmApiClass>
): RejectedCdmApiClass[] {
  const rejected = new Map<string, RejectedCdmApiClass>()
  const selectedClassNames = new Set(selected.keys())
  for (const entry of discovery.candidateClasses) {
    if (selectedClassNames.has(entry.className)) continue
    if (isForbiddenApprovedContractClass(entry.className)) {
      rejected.set(entry.className, {
        className: entry.className,
        reason: 'Rejected because this package category is not allowed in the approved API contract.',
      })
    }
  }
  for (const concept of discovery.resolvedConcepts) {
    for (const candidate of concept.candidates) {
      if (selectedClassNames.has(candidate)) continue
      rejected.set(candidate, {
        className: candidate,
        reason: `Rejected same-concept candidate for ${concept.concept}.`,
        replacement: concept.selectedClassName || undefined,
      })
    }
  }
  return [...rejected.values()].sort((left, right) => left.className.localeCompare(right.className))
}

function indexHasClass(index: CdmJavaApiIndex, className: string): boolean {
  return index.classes.some(entry => entry.className === className)
}

function sortSelectedClasses(classes: SelectedCdmApiClass[]): SelectedCdmApiClass[] {
  return classes.sort((left, right) => left.className.localeCompare(right.className))
}

function mergeStrings(left: string[], right: string[]): string[] {
  return [...new Set([...left, ...right])].sort()
}

function renderSelectedClass(item: SelectedCdmApiClass): string {
  return `### ${item.className}

- Pass: ${item.selectedInPass}
- Reason: ${item.reason}
- Evidence: ${item.evidence.join('; ')}
- Required by recipes: ${item.requiredByRecipeIds.length === 0 ? 'none' : item.requiredByRecipeIds.join(', ')}`
}

function renderRejectedClass(item: RejectedCdmApiClass): string {
  return `- ${item.className}: ${item.reason}${item.replacement === undefined ? '' : ` Use ${item.replacement}.`}`
}
