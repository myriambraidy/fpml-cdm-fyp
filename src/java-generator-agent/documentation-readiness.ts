import { readFile, stat, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { ApprovedCdmApiContract } from './approved-cdm-api-contract'
import { readApprovedCdmApiContract } from './approved-cdm-api-contract'
import type { CdmJavaApiManifest } from './cdm-java-api-pack'
import { cdmJavaApiIndexPath, cdmJavaApiManifestPath } from './cdm-java-api-pack'
import { CDM_JAVA_VERSION } from './java-contract'
import type { ContextBudgetReport } from './context-budget'
import type { SemanticRecipeFixturesReport } from './semantic-recipe-fixtures'
import type { SemanticRecipeValidationReport } from './semantic-recipe-validator'
import type { SemanticRecipeBundle } from './semantic-recipes'
import { readSemanticRecipeBundle } from './semantic-recipes'
import {
  getRosettaMappingArea,
  requiredRosettaAreasForScope,
  rosettaProductPackExists,
  sharedIngestPackExists,
  type RosettaMappingArea,
} from './rosetta-retrieval'

export type DocumentationReadinessStatus = 'passed' | 'failed'

export type DocumentationReadinessConcept = {
  concept: string
  status: 'resolved' | 'ambiguous' | 'missing' | 'deferred'
  selectedClassName?: string
  approved: boolean
  builderReady: boolean
  evidence: string[]
  diagnostics: string[]
}

export type DocumentationReadinessRosettaArea = {
  area: RosettaMappingArea
  required: boolean
  functionNames: string[]
  blockIds: string[]
  status: 'resolved' | 'missing'
  diagnostics: string[]
}

export type DocumentationReadinessCheck = {
  name: string
  status: DocumentationReadinessStatus
  message: string
}

export type DocumentationReadinessReport = {
  generatedAt: string
  status: DocumentationReadinessStatus
  productFamily: string
  implementationGroup: string
  cdmArtifact: {
    groupId: string
    artifactId: string
    version: string
    jarPath: string
  }
  checks: DocumentationReadinessCheck[]
  concepts: DocumentationReadinessConcept[]
  rosettaAreas: DocumentationReadinessRosettaArea[]
  authorityFiles: string[]
  blockingIssues: string[]
  warnings: string[]
}

export function javaDocumentationReadinessJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'java-documentation-readiness.json')
}

export function javaDocumentationReadinessMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'java-documentation-readiness.md')
}

export async function buildDocumentationReadinessReport(args: {
  productFamily: string
  implementationGroup: string
  runOutputDir: string
  javaShellContractPath: string
  approvedCdmApiContractPath: string
  approvedCdmApiContractSummaryPath: string
  semanticRecipesPath: string
  semanticRecipesMarkdownPath: string
  semanticRecipeValidationPath: string
  semanticRecipeValidationMarkdownPath: string
  semanticRecipeFixturesReportPath: string
  semanticRecipeFixturesReportMarkdownPath: string
  contextBudgetReportPath: string
  contextBudgetReportMarkdownPath: string
}): Promise<DocumentationReadinessReport> {
  const checks: DocumentationReadinessCheck[] = []
  const warnings: string[] = []

  const manifest = await readManifest(cdmJavaApiManifestPath())
  pushCheck(
    checks,
    'cdm-java-manifest',
    manifest !== null && manifest.version === CDM_JAVA_VERSION,
    manifest === null
      ? `Missing CDM Java manifest at ${cdmJavaApiManifestPath()}.`
      : `CDM Java manifest version ${manifest.version}.`
  )
  pushCheck(
    checks,
    'cdm-java-index',
    await exists(cdmJavaApiIndexPath()),
    `CDM Java index path: ${cdmJavaApiIndexPath()}.`
  )

  const contract = await readContract(args.approvedCdmApiContractPath)
  pushCheck(
    checks,
    'approved-api-contract',
    contract !== null && contract.approvedClasses.length > 0,
    contract === null
      ? `Missing approved API contract at ${args.approvedCdmApiContractPath}.`
      : `Approved classes: ${contract.approvedClasses.length}; approved builder methods: ${contract.approvedBuilderMethods.length}.`
  )

  const recipes = await readRecipes(args.semanticRecipesPath)
  pushCheck(
    checks,
    'semantic-recipes',
    recipes !== null && recipes.recipes.length > 0,
    recipes === null ? `Missing semantic recipes at ${args.semanticRecipesPath}.` : `Recipes: ${recipes.recipes.length}.`
  )

  const recipeValidation = await readJsonReport<SemanticRecipeValidationReport>(args.semanticRecipeValidationPath)
  pushCheck(
    checks,
    'semantic-recipe-validation',
    recipeValidation !== null && recipeValidation.status === 'passed',
    recipeValidation === null
      ? `Missing semantic recipe validation at ${args.semanticRecipeValidationPath}.`
      : `Semantic recipe validation status: ${recipeValidation.status}.`
  )

  const fixtureReport = await readJsonReport<SemanticRecipeFixturesReport>(args.semanticRecipeFixturesReportPath)
  pushCheck(
    checks,
    'semantic-recipe-fixtures',
    fixtureReport !== null && fixtureReport.status === 'passed',
    fixtureReport === null
      ? `Missing semantic recipe fixture report at ${args.semanticRecipeFixturesReportPath}.`
      : `Semantic recipe fixture status: ${fixtureReport.status}.`
  )

  const contextBudget = await readJsonReport<ContextBudgetReport>(args.contextBudgetReportPath)
  pushCheck(
    checks,
    'context-budget',
    contextBudget !== null && contextBudget.status === 'passed',
    contextBudget === null
      ? `Missing context budget report at ${args.contextBudgetReportPath}.`
      : `Context budget status: ${contextBudget.status}.`
  )

  pushCheck(
    checks,
    'rosetta-fx-pack',
    await rosettaProductPackExists(args.productFamily),
    'FX Rosetta product-family pack must be available.'
  )
  pushCheck(
    checks,
    'rosetta-shared-ingest-pack',
    await sharedIngestPackExists(),
    'Shared Rosetta ingest pack must be available.'
  )

  const concepts = contract === null ? [] : buildConceptReadiness(contract)
  const conceptFailures = concepts.filter(concept =>
    concept.status === 'ambiguous' || concept.status === 'missing' || !concept.approved
  )
  for (const failure of conceptFailures) {
    checks.push({
      name: `concept:${failure.concept}`,
      status: 'failed',
      message: `${failure.concept} is ${failure.status}; selected=${failure.selectedClassName ?? 'none'}; approved=${failure.approved ? 'yes' : 'no'}.`,
    })
  }
  for (const concept of concepts.filter(item => !item.builderReady)) {
    warnings.push(`${concept.concept} has no direct approved builder method; it may only be used as a parameter or constructed indirectly.`)
  }

  const rosettaAreas = await buildRosettaAreaReadiness(args.productFamily, args.implementationGroup)
  for (const area of rosettaAreas.filter(item => item.status === 'missing')) {
    checks.push({
      name: `rosetta-area:${area.area}`,
      status: 'failed',
      message: `${area.area} is missing required Rosetta evidence: ${area.diagnostics.join('; ')}`,
    })
  }

  const authorityFiles = [
    args.javaShellContractPath,
    args.approvedCdmApiContractSummaryPath,
    args.semanticRecipesMarkdownPath,
    args.semanticRecipeValidationMarkdownPath,
    args.semanticRecipeFixturesReportMarkdownPath,
    args.contextBudgetReportMarkdownPath,
    'data/rosetta-source/latest/docs/product-families/fx.md',
    'data/rosetta-source/latest/docs/shared-ingest.md',
  ]
  const blockingIssues = checks
    .filter(check => check.status === 'failed')
    .map(check => `${check.name}: ${check.message}`)

  return {
    generatedAt: new Date().toISOString(),
    status: blockingIssues.length === 0 ? 'passed' : 'failed',
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    cdmArtifact: {
      groupId: manifest?.groupId ?? 'org.finos.cdm',
      artifactId: manifest?.artifactId ?? 'cdm-java',
      version: manifest?.version ?? CDM_JAVA_VERSION,
      jarPath: manifest?.jarPath ?? '',
    },
    checks,
    concepts,
    rosettaAreas,
    authorityFiles,
    blockingIssues,
    warnings,
  }
}

export async function writeDocumentationReadinessReport(args: {
  report: DocumentationReadinessReport
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.report, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderDocumentationReadinessReport(args.report), 'utf8')
}

export function renderDocumentationReadinessReport(report: DocumentationReadinessReport): string {
  return `# Java Documentation Readiness

Generated: ${report.generatedAt}
Status: ${report.status}
Product family: ${report.productFamily}
Implementation group: ${report.implementationGroup}
CDM Java artifact: ${report.cdmArtifact.groupId}:${report.cdmArtifact.artifactId}:${report.cdmArtifact.version}
CDM Java jar: ${report.cdmArtifact.jarPath || '(missing)'}

## Authority Files

${report.authorityFiles.map(path => `- ${path}`).join('\n')}

## Blocking Issues

${report.blockingIssues.length === 0 ? '- none' : report.blockingIssues.map(issue => `- ${issue}`).join('\n')}

## Warnings

${report.warnings.length === 0 ? '- none' : report.warnings.map(warning => `- ${warning}`).join('\n')}

## Checks

${report.checks.map(check => `- ${check.status} ${check.name}: ${check.message}`).join('\n')}

## Core Concepts

${report.concepts.length === 0 ? '- none' : report.concepts.map(renderConcept).join('\n')}

## Rosetta Mapping Areas

${report.rosettaAreas.length === 0 ? '- none' : report.rosettaAreas.map(renderRosettaArea).join('\n')}
`
}

async function buildRosettaAreaReadiness(
  productFamily: string,
  implementationGroup: string
): Promise<DocumentationReadinessRosettaArea[]> {
  const required = requiredRosettaAreasForScope({ productFamily, implementationGroup })
  const areas = Object.entries(required) as Array<[RosettaMappingArea, string[]]>
  const results: DocumentationReadinessRosettaArea[] = []
  for (const [area, functionNames] of areas) {
    const retrieval = await getRosettaMappingArea({ productFamily, implementationGroup, area })
    results.push({
      area,
      required: true,
      functionNames,
      blockIds: retrieval.blocks.map(block => block.id),
      status: retrieval.ok ? 'resolved' : 'missing',
      diagnostics: retrieval.diagnostics,
    })
  }
  return results
}

function buildConceptReadiness(contract: ApprovedCdmApiContract): DocumentationReadinessConcept[] {
  const approvedClassNames = new Set(contract.approvedClasses.map(item => item.className))
  return contract.conceptResolutions.map(concept => {
    const approved = concept.selectedClassName !== '' && approvedClassNames.has(concept.selectedClassName)
    const builderReady = contract.approvedBuilderMethods.some(method => method.className === concept.selectedClassName)
    return {
      concept: concept.concept,
      status: concept.status,
      selectedClassName: concept.selectedClassName || undefined,
      approved,
      builderReady,
      evidence: concept.candidates,
      diagnostics: [
        concept.reason,
        approved ? 'Selected class is approved by the run-specific API contract.' : 'Selected class is not approved by the run-specific API contract.',
      ],
    }
  })
}

async function readManifest(path: string): Promise<CdmJavaApiManifest | null> {
  if (!(await exists(path))) return null
  return JSON.parse(await readFile(path, 'utf8')) as CdmJavaApiManifest
}

async function readContract(path: string): Promise<ApprovedCdmApiContract | null> {
  if (!(await exists(path))) return null
  return readApprovedCdmApiContract(path)
}

async function readRecipes(path: string): Promise<SemanticRecipeBundle | null> {
  if (!(await exists(path))) return null
  return readSemanticRecipeBundle(path)
}

async function readJsonReport<T>(path: string): Promise<T | null> {
  if (!(await exists(path))) return null
  return JSON.parse(await readFile(path, 'utf8')) as T
}

function pushCheck(
  checks: DocumentationReadinessCheck[],
  name: string,
  passed: boolean,
  message: string
): void {
  checks.push({ name, status: passed ? 'passed' : 'failed', message })
}

function renderConcept(concept: DocumentationReadinessConcept): string {
  return `- ${concept.concept}: ${concept.status}, approved=${concept.approved ? 'yes' : 'no'}, builder-ready=${concept.builderReady ? 'yes' : 'no'}, selected=${concept.selectedClassName ?? 'none'}`
}

function renderRosettaArea(area: DocumentationReadinessRosettaArea): string {
  return [
    `- ${area.area}: ${area.status}`,
    `  Functions: ${area.functionNames.join(', ')}`,
    `  Blocks: ${area.blockIds.length === 0 ? 'none' : area.blockIds.join(', ')}`,
  ].join('\n')
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
