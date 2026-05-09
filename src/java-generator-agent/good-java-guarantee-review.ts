import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { GateResult, GeneratorRunConfig, GeneratorWorkspace } from './types'
import { readApprovedCdmApiContract } from './approved-cdm-api-contract'
import { readSemanticRecipeBundle } from './semantic-recipes'

export type GoodJavaGuaranteeVerdict = 'pass' | 'fail' | 'partial'

export type GoodJavaGuaranteeReview = {
  overallVerdict: GoodJavaGuaranteeVerdict
  runId: string
  approvedClassCount: number
  recipeDerivedFixtureCount: number
  compileStatus: 'passed' | 'failed' | 'not-run'
  runtimeFixtureStatus: 'passed' | 'failed' | 'not-run'
  blockingFailures: string[]
  nonBlockingGaps: string[]
  gapReportPath: string | null
}

export async function writeGoodJavaGuaranteeReview(args: {
  config: GeneratorRunConfig
  workspace: GeneratorWorkspace
  gateResults: GateResult[]
  promoted: boolean
  errorMessage?: string
}): Promise<GoodJavaGuaranteeReview> {
  const contract = await readApprovedCdmApiContract(args.workspace.approvedCdmApiContractPath)
  const recipes = await readSemanticRecipeBundle(args.workspace.semanticRecipesPath)
  const fixtureReport = JSON.parse(await readFile(args.workspace.semanticRecipeFixturesReportPath, 'utf8')) as {
    fixtures: Array<{ fixtureKind: string }>
  }
  const blockingFailures = blockingFailuresFor(args.gateResults, args.errorMessage)
  const review: GoodJavaGuaranteeReview = {
    overallVerdict: args.promoted && blockingFailures.length === 0 ? 'pass' : 'fail',
    runId: args.config.runId,
    approvedClassCount: contract.approvedClasses.length,
    recipeDerivedFixtureCount: fixtureReport.fixtures.filter(fixture => fixture.fixtureKind === 'recipe-derived').length,
    compileStatus: statusForGate(args.gateResults, 'maven-compile'),
    runtimeFixtureStatus: runtimeStatusForGates(args.gateResults),
    blockingFailures,
    nonBlockingGaps: recipes.recipes.flatMap(recipe =>
      recipe.steps
        .filter(step => !step.core && step.approvedBuilderMethods.length === 0)
        .map(step => `${recipe.id} step ${step.order} has no builder methods but is non-core.`)
    ),
    gapReportPath: blockingFailures.length === 0 ? null : args.workspace.finalBuildReportPath,
  }
  await mkdir(dirname(args.workspace.goodJavaGuaranteeReviewPath), { recursive: true })
  await writeFile(args.workspace.goodJavaGuaranteeReviewPath, renderGoodJavaGuaranteeReview(review), 'utf8')
  return review
}

export function renderGoodJavaGuaranteeReview(review: GoodJavaGuaranteeReview): string {
  return `# Good Java Guarantee Review

overall_verdict: ${review.overallVerdict}
run_id: ${review.runId}
approved_class_count: ${review.approvedClassCount}
recipe_derived_fixture_count: ${review.recipeDerivedFixtureCount}
compile_status: ${review.compileStatus}
runtime_fixture_status: ${review.runtimeFixtureStatus}
gap_report_path: ${review.gapReportPath ?? 'null'}

## Blocking Failures

${review.blockingFailures.length === 0 ? '- none' : review.blockingFailures.map(item => `- ${item}`).join('\n')}

## Non-Blocking Gaps

${review.nonBlockingGaps.length === 0 ? '- none' : review.nonBlockingGaps.map(item => `- ${item}`).join('\n')}
`
}

function blockingFailuresFor(gateResults: GateResult[], errorMessage: string | undefined): string[] {
  const failures = gateResults
    .filter(gate => gate.status === 'failed')
    .map(gate => `${gate.name}: ${gate.outputSnippet}`)
  if (errorMessage !== undefined) failures.push(`generator-error: ${errorMessage}`)
  return failures
}

function statusForGate(gateResults: GateResult[], gateName: string): 'passed' | 'failed' | 'not-run' {
  const gate = gateResults.find(item => item.name === gateName)
  if (gate === undefined) return 'not-run'
  return gate.status === 'passed' ? 'passed' : 'failed'
}

function runtimeStatusForGates(gateResults: GateResult[]): 'passed' | 'failed' | 'not-run' {
  const runtimeGates = gateResults.filter(gate => gate.name.includes('runtime') || gate.name.includes('output'))
  if (runtimeGates.length === 0) return 'not-run'
  return runtimeGates.every(gate => gate.status === 'passed') ? 'passed' : 'failed'
}
