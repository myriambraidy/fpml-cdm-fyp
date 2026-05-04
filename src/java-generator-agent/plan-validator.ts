import type { FxProductGroup, ProductScopeGuidance } from './product-scope'

export type PlanValidationDetails = {
  mode: 'structured-section'
  parsedInScopeGroups: string[]
  parsedOutOfScopeGroups: string[]
  parsedRuntimeFixtureIds: string[]
}

export type PlanValidationResult = {
  status: 'passed' | 'failed'
  blockingIssues: string[]
  warnings: string[]
  details?: PlanValidationDetails
}

const SECTION_HEADING = /^##\s+Implementation scope \(machine-checked\)\s*$/im
const RUNTIME_FIXTURES_HEADING = /^##\s+Runtime supported fixtures \(machine-checked\)\s*$/im
const IN_SCOPE_LABEL = /^\*\*In scope \(implementation groups\):\*\*\s*$/im
const OUT_OF_SCOPE_LABEL = /^\*\*Explicitly out of scope \(implementation groups\):\*\*\s*$/im

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
    const m = /^\s*[-*]\s+(fx-[a-z-]+)\s*$/.exec(line)
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

  if (/runtime\s+llm/i.test(args.planMarkdown)) {
    blockingIssues.push('Plan appears to allow a runtime LLM dependency.')
  }

  const sectionSlice = sliceImplementationScopeSection(args.planMarkdown)
  let parsedInScopeGroups: string[] = []
  let parsedOutOfScopeGroups: string[] = []
  let parsedRuntimeFixtureIds: string[] = []

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

  const passed = blockingIssues.length === 0
  const details: PlanValidationDetails = {
    mode: 'structured-section',
    parsedInScopeGroups,
    parsedOutOfScopeGroups,
    parsedRuntimeFixtureIds,
  }

  return {
    status: passed ? 'passed' : 'failed',
    blockingIssues,
    warnings,
    details,
  }
}

export function renderPlanValidation(result: PlanValidationResult): string {
  const detailsSection =
    result.details === undefined
      ? ''
      : `
## Validation details

- Mode: ${result.details.mode}
- Parsed in-scope groups: ${result.details.parsedInScopeGroups.length === 0 ? '(none)' : result.details.parsedInScopeGroups.join(', ')}
- Parsed out-of-scope groups: ${result.details.parsedOutOfScopeGroups.length === 0 ? '(none)' : result.details.parsedOutOfScopeGroups.join(', ')}
- Parsed runtime fixture ids: ${result.details.parsedRuntimeFixtureIds.length === 0 ? '(none)' : result.details.parsedRuntimeFixtureIds.join(', ')}
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
