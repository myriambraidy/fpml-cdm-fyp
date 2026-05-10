import type { FxProductGroup, ProductScopeGuidance } from './product-scope'
import {
  GENERATED_BASE_PACKAGE,
  GENERATED_IMPL_CLASS,
  GENERATED_IMPL_PACKAGE,
  GENERATED_IMPL_SOURCE_ROOT,
} from './java-contract'
import type { RosettaMappingArea } from './rosetta-retrieval'

export type PlanValidationDetails = {
  mode: 'structured-section'
  parsedInScopeGroups: string[]
  parsedOutOfScopeGroups: string[]
  parsedRuntimeFixtureIds: string[]
  parsedJavaShell?: ParsedJavaShellContract
  parsedRosettaAreas?: Partial<Record<RosettaMappingArea, string[]>>
}

export type JavaShellPlanContract = {
  generatedPackage: string
  mainGeneratedClass: string
  requiredInterface: string
  generatedSourceRoot: string
  shellOwnedFiles: string[]
}

export type ParsedJavaShellContract = {
  generatedPackage?: string
  mainGeneratedClass?: string
  requiredInterface?: string
  generatedSourceRoot?: string
  shellOwnedFiles: string[]
}

export type PlanValidationResult = {
  status: 'passed' | 'failed'
  blockingIssues: string[]
  warnings: string[]
  details?: PlanValidationDetails
}

const SECTION_HEADING = /^##\s+Implementation scope \(machine-checked\)\s*$/im
const RUNTIME_FIXTURES_HEADING = /^##\s+Runtime supported fixtures \(machine-checked\)\s*$/im
const JAVA_SHELL_HEADING = /^##\s+Java shell contract \(machine-checked\)\s*$/im
const ROSETTA_EVIDENCE_HEADING = /^##\s+Rosetta evidence coverage \(machine-checked\)\s*$/im
const IN_SCOPE_LABEL = /^\*\*In scope \(implementation groups\):\*\*\s*$/im
const OUT_OF_SCOPE_LABEL = /^\*\*Explicitly out of scope \(implementation groups\):\*\*\s*$/im
const ROSETTA_AREAS: RosettaMappingArea[] = [
  'product-root',
  'economic-terms',
  'settlement-payout',
  'price-quantity',
  'party-counterparty',
  'account-party-reference',
  'product-identifiers-taxonomy',
  'dates-settlement',
]
const FORBIDDEN_UNAPPROVED_CDM_REFERENCES = [
  'cdm.base.staticdata.asset.common.ProductIdentifier',
  'cdm.base.staticdata.asset.common.ProductTaxonomy',
  'cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate',
  'cdm.base.datetime.AdjustableOrRelativeDateOrExpression',
]

export const DEFAULT_JAVA_SHELL_PLAN_CONTRACT: JavaShellPlanContract = {
  generatedPackage: GENERATED_IMPL_PACKAGE,
  mainGeneratedClass: GENERATED_IMPL_CLASS,
  requiredInterface: `${GENERATED_BASE_PACKAGE}.FpmlToCdmMapper`,
  generatedSourceRoot: GENERATED_IMPL_SOURCE_ROOT,
  shellOwnedFiles: [
    'pom.xml',
    'src/main/java/com/fpml/cdm/fx/mapper/Main.java',
    'src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java',
    'src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java',
  ],
}

function sliceImplementationScopeSection(planMarkdown: string): string | null {
  const sectionMatch = planMarkdown.match(SECTION_HEADING)
  if (!sectionMatch || sectionMatch.index === undefined) return null
  const after = planMarkdown.slice(sectionMatch.index + sectionMatch[0].length)
  const nextH2 = after.search(/^##\s+/m)
  return nextH2 === -1 ? after : after.slice(0, nextH2)
}

function sliceRuntimeSupportedFixturesSection(planMarkdown: string): string | null {
  const sectionMatch = planMarkdown.match(RUNTIME_FIXTURES_HEADING)
  if (!sectionMatch || sectionMatch.index === undefined) return null
  const after = planMarkdown.slice(sectionMatch.index + sectionMatch[0].length)
  const nextH2 = after.search(/^##\s+/m)
  return nextH2 === -1 ? after : after.slice(0, nextH2)
}

function sliceSection(planMarkdown: string, heading: RegExp): string | null {
  const sectionMatch = planMarkdown.match(heading)
  if (!sectionMatch || sectionMatch.index === undefined) return null
  const after = planMarkdown.slice(sectionMatch.index + sectionMatch[0].length)
  const nextH2 = after.search(/^##\s+/m)
  return nextH2 === -1 ? after : after.slice(0, nextH2)
}

function extractRuntimeFixtureIdList(sectionSlice: string): string[] {
  const ids: string[] = []
  for (const line of sectionSlice.split('\n')) {
    const m = /^\s*[-*]\s+([a-z][a-z0-9_-]*)\s*$/i.exec(line)
    if (m) ids.push(m[1])
  }
  return ids
}

function extractFxGroupListAfterLabel(
  sectionSlice: string,
  labelRegex: RegExp
): { groups: string[]; foundLabel: boolean } {
  const labelMatch = sectionSlice.match(labelRegex)
  if (!labelMatch || labelMatch.index === undefined) {
    return { groups: [], foundLabel: false }
  }
  const rest = sectionSlice.slice(labelMatch.index + labelMatch[0].length)
  const stop = rest.search(/^\*\*[^*]/m)
  const listBlock = stop === -1 ? rest : rest.slice(0, stop)
  const groups: string[] = []
  for (const line of listBlock.split('\n')) {
    const m = /^\s*[-*]\s+([a-z][a-z0-9-]+)\s*$/.exec(line)
    if (m) groups.push(m[1])
  }
  return { groups, foundLabel: true }
}

function isKnownImplementationGroup(scope: ProductScopeGuidance, slug: string): slug is FxProductGroup {
  return scope.productGroups.some(productGroup => productGroup.group === slug)
}

export function validatePlannerPlan(args: {
  planMarkdown: string
  scope: ProductScopeGuidance
  runtimeFixtureIds?: string[]
  javaShellContract?: JavaShellPlanContract
  requiredRosettaAreas?: Partial<Record<RosettaMappingArea, string[]>>
  approvedCdmClassNames?: string[]
}): PlanValidationResult {
  const blockingIssues: string[] = []
  const warnings: string[] = []

  for (const fixture of args.scope.nonFxFixtures) {
    if (mentionsPath(args.planMarkdown, fixture.fpmlPath)) {
      blockingIssues.push(`Plan includes non-FX fixture in FX implementation scope: ${fixture.fpmlPath}`)
    }
  }

  for (const knownAbsentPath of args.scope.knownAbsentPaths) {
    if (args.planMarkdown.includes(knownAbsentPath)) {
      blockingIssues.push(`Plan references known absent path: ${knownAbsentPath}`)
    }
  }

  if (appearsToAllowRuntimeLlm(args.planMarkdown)) {
    blockingIssues.push('Plan appears to allow a runtime LLM dependency.')
  }
  if (/supports?\s+(all\s+)?fx\s+derivatives/i.test(args.planMarkdown)) {
    blockingIssues.push(
      'Plan must not claim support for all FX derivatives while the implementation group is fx-single-leg.'
    )
  }
  if (appearsToUseJacksonTreeAsCdmModel(args.planMarkdown)) {
    blockingIssues.push('Plan must not use Jackson tree nodes as the internal CDM model.')
  }
  validateApprovedApiNarrativeContradictions(args.planMarkdown, blockingIssues)
  validateUnapprovedCdmClassReferences({
    planMarkdown: args.planMarkdown,
    approvedClassNames: args.approvedCdmClassNames ?? [],
    blockingIssues,
  })

  const sectionSlice = sliceImplementationScopeSection(args.planMarkdown)
  let parsedInScopeGroups: string[] = []
  let parsedOutOfScopeGroups: string[] = []
  let parsedRuntimeFixtureIds: string[] = []
  let parsedJavaShell: ParsedJavaShellContract | undefined
  let parsedRosettaAreas: Partial<Record<RosettaMappingArea, string[]>> | undefined

  if (sectionSlice === null) {
    blockingIssues.push(
      'Plan missing required section "## Implementation scope (machine-checked)" with **In scope (implementation groups):** and at least one implementation group slug from 00-product-scope.json (productGroups[].group).'
    )
  } else {
    const inScope = extractFxGroupListAfterLabel(sectionSlice, IN_SCOPE_LABEL)
    const outOfScope = extractFxGroupListAfterLabel(sectionSlice, OUT_OF_SCOPE_LABEL)
    parsedInScopeGroups = inScope.groups
    parsedOutOfScopeGroups = outOfScope.groups

    if (!inScope.foundLabel) {
      blockingIssues.push(
        'Implementation scope section must include the bold label **In scope (implementation groups):** followed by a bullet list of group slugs.'
      )
    } else if (inScope.groups.length === 0) {
      blockingIssues.push(
        '**In scope (implementation groups):** must list at least one slug from productGroups[].group (e.g. fx-single-leg).'
      )
    } else {
      for (const slug of inScope.groups) {
        if (slug === args.scope.productFamily) {
          blockingIssues.push(
            `${args.scope.productFamily} is the product family context, not an implementation group.`
          )
          continue
        }
        if (!isKnownImplementationGroup(args.scope, slug)) {
          blockingIssues.push(`In-scope implementation group is not defined in product scope: ${slug}`)
        }
      }
      if (!inScope.groups.includes(args.scope.currentImplementationGroup)) {
        blockingIssues.push(
          `In-scope list must include currentImplementationGroup: ${args.scope.currentImplementationGroup}`
        )
      }
    }

    if (outOfScope.foundLabel && outOfScope.groups.length > 0) {
      for (const slug of outOfScope.groups) {
        if (!isKnownImplementationGroup(args.scope, slug)) {
          blockingIssues.push(`Out-of-scope implementation group is not defined in product scope: ${slug}`)
        }
      }
      const overlap = inScope.groups.filter(g => outOfScope.groups.includes(g))
      if (overlap.length > 0) {
        warnings.push(`Group(s) appear both in scope and out of scope: ${overlap.join(', ')}`)
      }
    }
  }

  const runtimeIds = args.runtimeFixtureIds
  if (runtimeIds !== undefined && runtimeIds.length > 0) {
    const runtimeSlice = sliceRuntimeSupportedFixturesSection(args.planMarkdown)
    if (runtimeSlice === null) {
      blockingIssues.push(
        'Plan missing required section "## Runtime supported fixtures (machine-checked)" with a bullet list of fixture ids exactly matching this run\'s runtimeFixtures config.'
      )
    } else {
      parsedRuntimeFixtureIds = extractRuntimeFixtureIdList(runtimeSlice)
      const required = new Set(runtimeIds)
      const declared = new Set(parsedRuntimeFixtureIds)
      if (parsedRuntimeFixtureIds.length !== declared.size) {
        blockingIssues.push('Runtime supported fixtures list contains duplicate fixture ids.')
      }
      for (const id of parsedRuntimeFixtureIds) {
        if (!required.has(id)) {
          blockingIssues.push(
            `Runtime supported fixtures lists unknown id (not in run config runtimeFixtures): ${id}`
          )
        }
      }
      for (const id of runtimeIds) {
        if (!declared.has(id)) {
          blockingIssues.push(
            `Runtime supported fixtures section must list every runtime gate fixture id; missing: ${id}`
          )
        }
      }
    }
  }

  const javaShellContract = args.javaShellContract
  if (javaShellContract !== undefined) {
    const shellSlice = sliceSection(args.planMarkdown, JAVA_SHELL_HEADING)
    if (shellSlice === null) {
      blockingIssues.push('Plan missing required section "## Java shell contract (machine-checked)".')
    } else {
      parsedJavaShell = parseJavaShellContract(shellSlice)
      validateJavaShellContract({
        parsed: parsedJavaShell,
        expected: javaShellContract,
        blockingIssues,
      })
    }
    validateJavaShellContradictions({
      planMarkdown: args.planMarkdown,
      expected: javaShellContract,
      blockingIssues,
    })
  }

  const requiredRosettaAreas = args.requiredRosettaAreas
  if (requiredRosettaAreas !== undefined) {
    const rosettaSlice = sliceSection(args.planMarkdown, ROSETTA_EVIDENCE_HEADING)
    if (rosettaSlice === null) {
      blockingIssues.push('Plan missing required section "## Rosetta evidence coverage (machine-checked)".')
    } else {
      parsedRosettaAreas = parseRosettaEvidenceCoverage(rosettaSlice)
      validateRosettaCoverage({
        parsed: parsedRosettaAreas,
        required: requiredRosettaAreas,
        blockingIssues,
      })
    }
  }

  const passed = blockingIssues.length === 0
  const details: PlanValidationDetails = {
    mode: 'structured-section',
    parsedInScopeGroups,
    parsedOutOfScopeGroups,
    parsedRuntimeFixtureIds,
    parsedJavaShell,
    parsedRosettaAreas,
  }

  return {
    status: passed ? 'passed' : 'failed',
    blockingIssues,
    warnings,
    details,
  }
}

export function renderPlanValidation(result: PlanValidationResult): string {
  const shell = result.details?.parsedJavaShell
  const shellSection = shell === undefined
    ? ''
    : `
- Parsed generated package: ${shell.generatedPackage ?? '(none)'}
- Parsed main generated class: ${shell.mainGeneratedClass ?? '(none)'}
- Parsed required interface: ${shell.requiredInterface ?? '(none)'}
- Parsed generated source root: ${shell.generatedSourceRoot ?? '(none)'}
- Parsed shell-owned files: ${shell.shellOwnedFiles.length === 0 ? '(none)' : shell.shellOwnedFiles.join(', ')}
`
  const rosetta = result.details?.parsedRosettaAreas
  const rosettaSection = rosetta === undefined
    ? ''
    : `
- Parsed Rosetta areas: ${ROSETTA_AREAS.map(area => `${area}=${rosetta[area]?.join('|') ?? '(none)'}`).join('; ')}
`
  const detailsSection =
    result.details === undefined
      ? ''
      : `
## Validation details

- Mode: ${result.details.mode}
- Parsed in-scope groups: ${result.details.parsedInScopeGroups.length === 0 ? '(none)' : result.details.parsedInScopeGroups.join(', ')}
- Parsed out-of-scope groups: ${result.details.parsedOutOfScopeGroups.length === 0 ? '(none)' : result.details.parsedOutOfScopeGroups.join(', ')}
- Parsed runtime fixture ids: ${result.details.parsedRuntimeFixtureIds.length === 0 ? '(none)' : result.details.parsedRuntimeFixtureIds.join(', ')}
${shellSection}${rosettaSection}
`

  return `# Plan Validation

Status: ${result.status}

## Blocking Issues

${result.blockingIssues.length === 0 ? '- none' : result.blockingIssues.map(issue => `- ${issue}`).join('\n')}

## Warnings

${result.warnings.length === 0 ? '- none' : result.warnings.map(warning => `- ${warning}`).join('\n')}
${detailsSection}`
}

function mentionsPath(markdown: string, path: string): boolean {
  const fileName = path.split(/[\\/]/).at(-1)
  return markdown.includes(path) || (fileName !== undefined && markdown.includes(fileName))
}

function appearsToAllowRuntimeLlm(markdown: string): boolean {
  return markdown
    .split(/\r?\n/)
    .some(line => mentionsRuntimeLlm(line) && !forbidsRuntimeLlm(line))
}

function appearsToUseJacksonTreeAsCdmModel(markdown: string): boolean {
  return markdown
    .split(/\r?\n/u)
    .some(line =>
      /ObjectNode|ArrayNode/u.test(line)
      && /main\s+CDM|CDM\s+output|internal\s+CDM|CDM\s+model|CDM\s+result/iu.test(line)
      && !forbidsUse(line)
    )
}

function parseJavaShellContract(sectionSlice: string): ParsedJavaShellContract {
  return {
    generatedPackage: extractBoldValue(sectionSlice, 'Generated package'),
    mainGeneratedClass: extractBoldValue(sectionSlice, 'Main generated class'),
    requiredInterface: extractBoldValue(sectionSlice, 'Required interface'),
    generatedSourceRoot: extractBoldValue(sectionSlice, 'Generated source root'),
    shellOwnedFiles: extractListAfterBoldLabel(sectionSlice, 'Shell-owned files must not be rewritten'),
  }
}

function extractBoldValue(sectionSlice: string, label: string): string | undefined {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  const match = new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.+?)\\s*$`, 'imu').exec(sectionSlice)
  return match?.[1]?.trim()
}

function extractListAfterBoldLabel(sectionSlice: string, label: string): string[] {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  const labelMatch = new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*$`, 'imu').exec(sectionSlice)
  if (labelMatch === null || labelMatch.index === undefined) return []
  const rest = sectionSlice.slice(labelMatch.index + labelMatch[0].length)
  const stop = rest.search(/^\*\*[^*]/m)
  const listBlock = stop === -1 ? rest : rest.slice(0, stop)
  const items: string[] = []
  for (const line of listBlock.split('\n')) {
    const match = /^\s*[-*]\s+(.+?)\s*$/.exec(line)
    if (match?.[1] !== undefined) items.push(match[1])
  }
  return items
}

function validateJavaShellContract(args: {
  parsed: ParsedJavaShellContract
  expected: JavaShellPlanContract
  blockingIssues: string[]
}): void {
  if (args.parsed.generatedPackage !== args.expected.generatedPackage) {
    args.blockingIssues.push(
      `Java shell contract generated package must be ${args.expected.generatedPackage}; found ${args.parsed.generatedPackage ?? '(none)'}.`
    )
  }
  if (args.parsed.mainGeneratedClass !== args.expected.mainGeneratedClass) {
    args.blockingIssues.push(
      `Java shell contract main generated class must be ${args.expected.mainGeneratedClass}; found ${args.parsed.mainGeneratedClass ?? '(none)'}.`
    )
  }
  if (args.parsed.requiredInterface !== args.expected.requiredInterface) {
    args.blockingIssues.push(
      `Java shell contract required interface must be ${args.expected.requiredInterface}; found ${args.parsed.requiredInterface ?? '(none)'}.`
    )
  }
  if (normalizePath(args.parsed.generatedSourceRoot ?? '') !== normalizePath(args.expected.generatedSourceRoot)) {
    args.blockingIssues.push(
      `Java shell contract generated source root must be ${args.expected.generatedSourceRoot}; found ${args.parsed.generatedSourceRoot ?? '(none)'}.`
    )
  }
  const parsedFiles = new Set(args.parsed.shellOwnedFiles.map(normalizePath))
  for (const file of args.expected.shellOwnedFiles) {
    if (!parsedFiles.has(normalizePath(file))) {
      args.blockingIssues.push(`Java shell contract must list shell-owned file as not rewritten: ${file}`)
    }
  }
}

function validateJavaShellContradictions(args: {
  planMarkdown: string
  expected: JavaShellPlanContract
  blockingIssues: string[]
}): void {
  if (args.planMarkdown.includes('org.finos.cdm.fx.singleleg')) {
    args.blockingIssues.push(
      `Plan contradicts Java shell contract by referencing generated package org.finos.cdm.fx.singleleg instead of ${args.expected.generatedPackage}.`
    )
  }
  const expectedFqcn = `${args.expected.generatedPackage}.${args.expected.mainGeneratedClass}`
  for (const classReference of findFullyQualifiedGeneratedClassReferences(args.planMarkdown, args.expected.mainGeneratedClass)) {
    if (classReference !== expectedFqcn) {
      args.blockingIssues.push(
        `${args.expected.mainGeneratedClass} must be in package ${args.expected.generatedPackage}; found ${classReference}.`
      )
    }
  }
  for (const line of args.planMarkdown.split(/\r?\n/u)) {
    for (const shellOwnedFile of args.expected.shellOwnedFiles) {
      const fileName = shellOwnedFile.split('/').at(-1) ?? shellOwnedFile
      if (appearsToRewriteShellOwnedFile(line, fileName)) {
        args.blockingIssues.push(`Plan appears to rewrite shell-owned file ${fileName}: ${line.trim()}`)
      }
    }
  }
}

function findFullyQualifiedGeneratedClassReferences(markdown: string, className: string): string[] {
  const escapedClassName = escapeRegex(className)
  const pattern = new RegExp(`\\b([a-z][A-Za-z0-9_]*(?:\\.[A-Za-z_][A-Za-z0-9_]*)+\\.${escapedClassName})\\b`, 'gu')
  return [...new Set([...markdown.matchAll(pattern)].map(match => match[1]).filter((value): value is string => value !== undefined))]
}

function validateApprovedApiNarrativeContradictions(
  planMarkdown: string,
  blockingIssues: string[]
): void {
  for (const forbiddenReference of FORBIDDEN_UNAPPROVED_CDM_REFERENCES) {
    for (const line of linesWithForbiddenContext(planMarkdown)) {
      if (line.text.includes(forbiddenReference) && !line.forbiddenContext) {
        blockingIssues.push(
          `Plan references unapproved CDM Java class ${forbiddenReference}; use only classes in approved-cdm-api-contract-summary.md.`
        )
        break
      }
    }
  }

  for (const line of planMarkdown.split(/\r?\n/u)) {
    if (/\bset-?trade\b|\bsetTrade\b/u.test(line) && /\bnot\s+(?:use|in|approved)|not\s+in\s+the\s+API\s+contract|isn'?t\s+in\s+the\s+API\s+contract/iu.test(line)) {
      blockingIssues.push(
        `Plan contradicts approved API contract by rejecting TradeState.setTrade(...): ${line.trim()}`
      )
    }
    if (/\bTradeState\.builder\(\)\.trade\(/u.test(line)) {
      blockingIssues.push('Plan must use TradeState.builder().setTrade(trade).build(), not TradeState.builder().trade(...).')
    }
  }
}

function validateUnapprovedCdmClassReferences(args: {
  planMarkdown: string
  approvedClassNames: string[]
  blockingIssues: string[]
}): void {
  if (args.approvedClassNames.length === 0) return

  const approved = new Set(args.approvedClassNames)
  const approvedSimpleNames = new Set(args.approvedClassNames.map(className => simpleClassName(className)))
  const seen = new Set<string>()
  for (const reference of findCdmClassReferences(args.planMarkdown)) {
    const approvedReference = reference.kind === 'qualified'
      ? approved.has(reference.className)
      : approvedSimpleNames.has(reference.className)
    if (approvedReference) continue
    if (reference.forbiddenContext) continue
    if (seen.has(reference.className)) continue
    seen.add(reference.className)
    args.blockingIssues.push(
      `Plan references CDM Java class not approved by this run's API contract: ${reference.className}`
    )
  }
}

function findCdmClassReferences(markdown: string): Array<{
  className: string
  line: string
  forbiddenContext: boolean
  kind: 'qualified' | 'simple'
}> {
  const references: Array<{
    className: string
    line: string
    forbiddenContext: boolean
    kind: 'qualified' | 'simple'
  }> = []
  const pattern = /(^|[^A-Za-z0-9_.])(cdm\.[a-zA-Z0-9_.]+\.[A-Z][A-Za-z0-9_]*)\b/gu
  for (const line of linesWithForbiddenContext(markdown)) {
    for (const match of line.text.matchAll(pattern)) {
      const className = match[2]
      if (className !== undefined) {
        references.push({
          className,
          line: line.text,
          forbiddenContext: line.forbiddenContext,
          kind: 'qualified',
        })
      }
    }
    if (!isImplementationClassLine(line.text)) continue
    for (const match of line.text.matchAll(/`([A-Z][A-Za-z0-9_]+)`|\b([A-Z][A-Za-z0-9_]+)\b/gu)) {
      const className = match[1] ?? match[2]
      if (className === undefined || isAllowedNonCdmSimpleName(className)) continue
      references.push({
        className,
        line: line.text,
        forbiddenContext: line.forbiddenContext,
        kind: 'simple',
      })
    }
  }
  return references
}

function isImplementationClassLine(line: string): boolean {
  if (
    /key\s+classes\s*:|\*\*Class:\*\*|^\s*[-*]\s+Class\s*:|implementation\s+classes\s*:|approved\s+Java\s+classes|key\s+builder\s+methods|builder\(\)/iu.test(
      line
    )
  ) {
    return true
  }
  if (/approved\s+classes\s*:/iu.test(line)) return true

  // Action verbs like "Build" appear in normal overview prose ("Build an AI-native…"); only treat
  // list/table construction lines as implementation hints so we scan for CDM simple names there.
  if (/^\s*(?:[-*]|\d+\.)\s+/.test(line) && /\b(?:Build|Use|Construct|Attach|Set)\b/iu.test(line)) {
    return true
  }
  if (/^\s*\|[^|]*\|\s*[^|]*\bBuild\b/iu.test(line)) return true

  return false
}

function isAllowedNonCdmSimpleName(className: string): boolean {
  if (/^Map[A-Z]/u.test(className)) return true
  return new Set([
    'Approved',
    'Build',
    'Use',
    'Construct',
    'Attach',
    'Set',
    'String',
    'Path',
    'List',
    'Map',
    'Set',
    'Date',
    'Exception',
    'FpML',
    'CDM',
    'Rosetta',
    'Java',
    'XML',
    'JSON',
    'DOM',
    'StAX',
  ]).has(className)
}

function simpleClassName(className: string): string {
  return className.split('.').at(-1) ?? className
}

function forbidsUse(line: string): boolean {
  return /\b(no|not|never|without|must\s+not|do\s+not|forbid|forbidden|absent|unapproved)\b/iu.test(line)
}

function linesWithForbiddenContext(markdown: string): Array<{ text: string; forbiddenContext: boolean }> {
  const lines: Array<{ text: string; forbiddenContext: boolean }> = []
  let inForbiddenSection = false
  for (const text of markdown.split(/\r?\n/u)) {
    if (/^\s*#{1,6}\s+/u.test(text)) {
      inForbiddenSection = forbidsUse(text)
    }
    const forbiddenContext = inForbiddenSection || forbidsUse(text)
    lines.push({ text, forbiddenContext })
  }
  return lines
}

function appearsToRewriteShellOwnedFile(line: string, fileName: string): boolean {
  if (!line.includes(fileName)) return false
  if (/\b(no|not|never|without|must\s+not|do\s+not|forbid|forbidden)\b/iu.test(line)) return false
  return /\b(rewrite|modify|edit|replace|regenerate|own|generate)\b/iu.test(line)
}

function parseRosettaEvidenceCoverage(sectionSlice: string): Partial<Record<RosettaMappingArea, string[]>> {
  const parsed: Partial<Record<RosettaMappingArea, string[]>> = {}
  for (const area of ROSETTA_AREAS) {
    const label = `**${area}:**`
    const index = sectionSlice.indexOf(label)
    if (index === -1) continue
    const rest = sectionSlice.slice(index + label.length)
    const stop = rest.search(/^\*\*[a-z-]+:\*\*/m)
    const listBlock = stop === -1 ? rest : rest.slice(0, stop)
    const functions: string[] = []
    for (const line of listBlock.split('\n')) {
      const match = /^\s*[-*]\s+([A-Za-z][A-Za-z0-9_]*)\s*$/.exec(line)
      if (match?.[1] !== undefined) functions.push(match[1])
    }
    parsed[area] = functions
  }
  return parsed
}

function cloneRosettaAreaMap(
  parsed: Partial<Record<RosettaMappingArea, string[]>>
): Record<RosettaMappingArea, string[]> {
  const out = {} as Record<RosettaMappingArea, string[]>
  for (const area of ROSETTA_AREAS) {
    out[area] = [...(parsed[area] ?? [])]
  }
  return out
}

/**
 * FX single-leg Rosetta areas duplicate identifier/taxonomy functions under both `product-root` and
 * `product-identifiers-taxonomy`. Plans often list them only under product-root; accept that as satisfying
 * the taxonomy area when the dedicated heading is missing or has no required hits.
 */
function promoteProductIdentifiersTaxonomyFromProductRoot(args: {
  effective: Record<RosettaMappingArea, string[]>
  required: Partial<Record<RosettaMappingArea, string[]>>
}): void {
  const area: RosettaMappingArea = 'product-identifiers-taxonomy'
  const requiredList = args.required[area]
  if (requiredList === undefined || requiredList.length === 0) return

  const allowed = new Set(requiredList)
  if (args.effective[area].some(name => allowed.has(name))) return

  const promoted: string[] = []
  for (const fn of args.effective['product-root']) {
    if (allowed.has(fn)) promoted.push(fn)
  }
  if (promoted.length > 0) {
    args.effective[area] = promoted
  }
}

function validateRosettaCoverage(args: {
  parsed: Partial<Record<RosettaMappingArea, string[]>>
  required: Partial<Record<RosettaMappingArea, string[]>>
  blockingIssues: string[]
}): void {
  const effective = cloneRosettaAreaMap(args.parsed)
  promoteProductIdentifiersTaxonomyFromProductRoot({ effective, required: args.required })

  for (const area of ROSETTA_AREAS) {
    const required = args.required[area]
    if (required === undefined) continue
    const parsed = effective[area] ?? []
    if (parsed.length === 0) {
      args.blockingIssues.push(`Rosetta evidence coverage missing required area: ${area}`)
      continue
    }
    const allowed = new Set(required)
    if (!parsed.some(name => allowed.has(name))) {
      args.blockingIssues.push(
        `Rosetta evidence area ${area} must cite at least one required function: ${required.join(', ')}`
      )
    }
  }
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+$/u, '')
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

function mentionsRuntimeLlm(line: string): boolean {
  return /\bruntime\s+(?:llm|ai)\b|\b(?:llm|ai)\s+(?:fallback|dependency|service|model|api)\b/iu.test(line)
}

function forbidsRuntimeLlm(line: string): boolean {
  return /\b(no|not|never|without|zero|forbid(?:s|den)?|forbidden|prohibit(?:s|ed)?|prohibited)\b|\bmust\s+not\b|\bmust\s+contain\s+zero\b/iu.test(line)
}
