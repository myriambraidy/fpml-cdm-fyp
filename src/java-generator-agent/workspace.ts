import { mkdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  GENERATED_BASE_PACKAGE,
  GENERATED_IMPL_CLASS,
  GENERATED_IMPL_PACKAGE,
  GENERATED_JAVA_VERSION,
} from './java-contract'
import { bulletList } from './markdown'
import { buildEvidencePacket, writeEvidencePacket } from './evidence-packet'
import { renderCdmRosettaPreflightMarkdown } from './cdm-rosetta-preflight'
import {
  ensureCdmJavaApiPack,
  renderCdmJavaApiPackMarkdown,
  renderCdmJavaApiSummaryMarkdown,
  renderCdmJavaMissingClassesMarkdownFromDisk,
} from './cdm-java-api-pack'
import { renderRosettaGenerationContext } from './rosetta-context'
import { buildProductScopeGuidance, renderProductScopeMarkdown } from './product-scope'
import { appendRunLog } from './run-log'
import {
  approvedCdmApiContractJsonPath,
  approvedCdmApiContractMarkdownPath,
  approvedCdmApiContractSummaryPath,
  buildApprovedCdmApiContract,
  renderApprovedCdmApiContractSummary,
  writeApprovedCdmApiContract,
} from './approved-cdm-api-contract'
import {
  buildCdmApiSelectionPass1,
  buildFinalCdmApiSelection,
  cdmApiSelectionFinalJsonPath,
  cdmApiSelectionFinalMarkdownPath,
  cdmApiSelectionPass1JsonPath,
  cdmApiSelectionPass1MarkdownPath,
  writeCdmApiSelection,
} from './cdm-api-selection'
import {
  extractBuilderParameterClasses,
  resolveBuilderMethodsForRecipeStep,
} from './cdm-builder-method-resolver'
import {
  discoverRelevantCdmApi,
  relevantCdmApiDiscoveryJsonPath,
  relevantCdmApiDiscoveryMarkdownPath,
  writeRelevantCdmApiDiscovery,
} from './cdm-concept-resolver'
import {
  type DraftRecipeStepRequirement,
  buildFxSingleLegDraftRecipeRequirements,
  buildSemanticRecipeBundle,
  renderDraftSemanticRecipeRequirements,
  semanticRecipesDraftJsonPath,
  semanticRecipesDraftMarkdownPath,
  semanticRecipesJsonPath,
  semanticRecipesMarkdownPath,
  writeSemanticRecipeBundle,
} from './semantic-recipes'
import {
  semanticRecipeValidationJsonPath,
  semanticRecipeValidationMarkdownPath,
  validateSemanticRecipes,
  writeSemanticRecipeValidationReport,
} from './semantic-recipe-validator'
import {
  semanticRecipeFixturesReportJsonPath,
  semanticRecipeFixturesReportMarkdownPath,
  writeSemanticRecipeFixtures,
} from './semantic-recipe-fixtures'
import {
  buildFinalImplementationContract,
  finalImplementationContractJsonPath,
  finalImplementationContractMarkdownPath,
  renderFinalImplementationContract,
  writeFinalImplementationContract,
} from './final-implementation-contract'
import {
  buildContextBudgetReport,
  contextBudgetReportJsonPath,
  contextBudgetReportMarkdownPath,
  defaultContextBudgetConfig,
  writeContextBudgetReport,
} from './context-budget'
import {
  buildDocumentationReadinessReport,
  javaDocumentationReadinessJsonPath,
  javaDocumentationReadinessMarkdownPath,
  writeDocumentationReadinessReport,
} from './documentation-readiness'
import type { ProductScopeGuidance } from './product-scope'
import type { GeneratorRunConfig, GeneratorWorkspace } from './types'

export async function createWorkspace(
  config: GeneratorRunConfig
): Promise<GeneratorWorkspace> {
  const rootDir = join(config.runOutputDir, 'agent-workspace')
  await mkdir(rootDir, { recursive: true })

  const workspace: GeneratorWorkspace = {
    rootDir,
    inputBriefPath: join(rootDir, '00-input-brief.md'),
    productScopePath: join(rootDir, '00-product-scope.md'),
    productScopeJsonPath: join(rootDir, '00-product-scope.json'),
    evidencePacketPath: join(rootDir, 'evidence-packet.md'),
    evidencePacketJsonPath: join(rootDir, 'evidence-packet.json'),
    evidenceIndexPath: join(rootDir, 'evidence-index.md'),
    javaShellContractPath: join(rootDir, 'java-shell-contract.md'),
    rosettaGenerationContextPath: join(rootDir, 'rosetta-generation-context.md'),
    cdmRosettaPreflightPath: join(rootDir, 'cdm-rosetta-preflight.md'),
    cdmJavaApiPackPath: join(rootDir, 'cdm-java-api-pack.md'),
    cdmJavaApiSummaryPath: join(rootDir, 'cdm-java-api-summary.md'),
    cdmJavaMissingClassesPath: join(rootDir, 'cdm-java-missing-classes.md'),
    relevantCdmApiCandidatesPath: relevantCdmApiDiscoveryJsonPath(config.runOutputDir),
    relevantCdmApiCandidatesMarkdownPath: relevantCdmApiDiscoveryMarkdownPath(config.runOutputDir),
    cdmApiSelectionPass1Path: cdmApiSelectionPass1JsonPath(config.runOutputDir),
    cdmApiSelectionPass1MarkdownPath: cdmApiSelectionPass1MarkdownPath(config.runOutputDir),
    cdmApiSelectionFinalPath: cdmApiSelectionFinalJsonPath(config.runOutputDir),
    cdmApiSelectionFinalMarkdownPath: cdmApiSelectionFinalMarkdownPath(config.runOutputDir),
    approvedCdmApiContractPath: approvedCdmApiContractJsonPath(config.runOutputDir),
    approvedCdmApiContractMarkdownPath: approvedCdmApiContractMarkdownPath(config.runOutputDir),
    approvedCdmApiContractSummaryPath: approvedCdmApiContractSummaryPath(config.runOutputDir),
    semanticRecipesDraftPath: semanticRecipesDraftJsonPath(config.runOutputDir),
    semanticRecipesDraftMarkdownPath: semanticRecipesDraftMarkdownPath(config.runOutputDir),
    semanticRecipesPath: semanticRecipesJsonPath(config.runOutputDir),
    semanticRecipesMarkdownPath: semanticRecipesMarkdownPath(config.runOutputDir),
    contextBudgetReportPath: contextBudgetReportJsonPath(config.runOutputDir),
    contextBudgetReportMarkdownPath: contextBudgetReportMarkdownPath(config.runOutputDir),
    javaDocumentationReadinessPath: javaDocumentationReadinessJsonPath(config.runOutputDir),
    javaDocumentationReadinessMarkdownPath: javaDocumentationReadinessMarkdownPath(config.runOutputDir),
    semanticRecipeValidationPath: semanticRecipeValidationJsonPath(config.runOutputDir),
    semanticRecipeValidationMarkdownPath: semanticRecipeValidationMarkdownPath(config.runOutputDir),
    apiContractValidationSummaryPath: join(rootDir, 'api-contract-validation-summary.json'),
    apiContractValidationSummaryMarkdownPath: join(rootDir, 'api-contract-validation-summary.md'),
    semanticRecipeFixturesReportPath: semanticRecipeFixturesReportJsonPath(config.runOutputDir),
    semanticRecipeFixturesReportMarkdownPath: semanticRecipeFixturesReportMarkdownPath(config.runOutputDir),
    goodJavaGuaranteeReviewPath: join(config.baseOutputDir, 'latest', 'good-java-guarantee-review.md'),
    finalImplementationContractPath: finalImplementationContractMarkdownPath(config.runOutputDir),
    finalImplementationContractJsonPath: finalImplementationContractJsonPath(config.runOutputDir),
    runLogPath: join(rootDir, '00-run-log.md'),
    acceptedPlanPath: join(rootDir, 'accepted-plan.md'),
    implementationPlanPath: join(rootDir, 'implementation-plan.md'),
    implementationLogPath: join(rootDir, 'implementation-log.md'),
    repairLogPath: join(rootDir, 'repair-log.md'),
    finalBuildReportPath: join(rootDir, 'final-build-report.md'),
  }

  if (!config.resume || !(await exists(workspace.productScopeJsonPath))) {
    const productScope = await buildProductScopeGuidance({ productFamily: config.productFamily })
    const evidencePacket = await buildEvidencePacket(productScope)
    const cdmJavaApiPack = await ensureCdmJavaApiPack()
    const relevantCdmApi = await discoverRelevantCdmApi({
      productFamily: config.productFamily,
      implementationGroup: productScope.currentImplementationGroup,
    })
    const pass1Selection = await buildCdmApiSelectionPass1({
      productFamily: config.productFamily,
      implementationGroup: productScope.currentImplementationGroup,
      discovery: relevantCdmApi,
    })
    const draftRecipeRequirements = buildFxSingleLegDraftRecipeRequirements(pass1Selection)
    const draftBuilderMethods = await resolveBuilderMethodsForRequirements(draftRecipeRequirements.steps)
    const finalSelection = await buildFinalCdmApiSelection({
      productFamily: config.productFamily,
      implementationGroup: productScope.currentImplementationGroup,
      discovery: relevantCdmApi,
      pass1Selection,
      recipeRequiredClasses: draftRecipeRequirements.requiredClasses,
      builderParameterClasses: extractBuilderParameterClasses(draftBuilderMethods),
      recipeId: draftRecipeRequirements.recipeId,
    })
    const finalRecipeRequirements = buildFxSingleLegDraftRecipeRequirements(finalSelection)
    const finalBuilderMethods = await resolveBuilderMethodsForRequirements(finalRecipeRequirements.steps)
    const approvedCdmApiContract = await buildApprovedCdmApiContract({
      productFamily: config.productFamily,
      implementationGroup: productScope.currentImplementationGroup,
      discovery: relevantCdmApi,
      selection: finalSelection,
      approvedBuilderMethods: finalBuilderMethods,
    })
    const semanticRecipes = buildSemanticRecipeBundle({
      productFamily: config.productFamily,
      implementationGroup: productScope.currentImplementationGroup,
      contract: approvedCdmApiContract,
    })
    const recipeValidation = validateSemanticRecipes({
      recipes: semanticRecipes,
      contract: approvedCdmApiContract,
    })
    if (recipeValidation.status === 'failed') {
      throw new Error('Semantic recipe validation failed before agent run.')
    }
    const finalImplementationContract = await buildFinalImplementationContract({
      config,
      scope: productScope,
      apiContract: approvedCdmApiContract,
      recipeBundle: semanticRecipes,
      approvedCdmApiContractPath: workspace.approvedCdmApiContractPath,
      semanticRecipesPath: workspace.semanticRecipesPath,
    })
    const finalContractMarkdown = renderFinalImplementationContract(finalImplementationContract)
    const contextBudgetReport = buildContextBudgetReport({
      config: defaultContextBudgetConfig({
        productFamily: config.productFamily,
        implementationGroup: productScope.currentImplementationGroup,
      }),
      contract: approvedCdmApiContract,
      recipes: semanticRecipes,
      finalContractMarkdown,
    })
    if (contextBudgetReport.status === 'failed') {
      throw new Error('Context budget report failed before agent run.')
    }

    await writeFile(workspace.inputBriefPath, renderInputBrief(config), 'utf8')
    await writeFile(workspace.productScopePath, renderProductScopeMarkdown(productScope), 'utf8')
    await writeFile(workspace.productScopeJsonPath, JSON.stringify(productScope, null, 2), 'utf8')
    await writeEvidencePacket({
      packet: evidencePacket,
      markdownPath: workspace.evidencePacketPath,
      jsonPath: workspace.evidencePacketJsonPath,
    })
    await writeFile(
      workspace.rosettaGenerationContextPath,
      renderRosettaGenerationContext(evidencePacket.rosettaGenerationContext),
      'utf8'
    )
    await writeFile(
      workspace.cdmRosettaPreflightPath,
      renderCdmRosettaPreflightMarkdown(evidencePacket.cdmRosettaPreflight),
      'utf8'
    )
    await writeFile(workspace.cdmJavaApiPackPath, renderCdmJavaApiPackMarkdown(cdmJavaApiPack), 'utf8')
    await writeFile(workspace.cdmJavaApiSummaryPath, renderCdmJavaApiSummaryMarkdown(cdmJavaApiPack), 'utf8')
    await writeFile(
      workspace.cdmJavaMissingClassesPath,
      await renderCdmJavaMissingClassesMarkdownFromDisk(),
      'utf8'
    )
    await writeRelevantCdmApiDiscovery({
      discovery: relevantCdmApi,
      jsonPath: workspace.relevantCdmApiCandidatesPath,
      markdownPath: workspace.relevantCdmApiCandidatesMarkdownPath,
    })
    await writeCdmApiSelection({
      selection: pass1Selection,
      jsonPath: workspace.cdmApiSelectionPass1Path,
      markdownPath: workspace.cdmApiSelectionPass1MarkdownPath,
    })
    await writeFile(workspace.semanticRecipesDraftPath, JSON.stringify(draftRecipeRequirements, null, 2), 'utf8')
    await writeFile(
      workspace.semanticRecipesDraftMarkdownPath,
      renderDraftSemanticRecipeRequirements(draftRecipeRequirements),
      'utf8'
    )
    await writeCdmApiSelection({
      selection: finalSelection,
      jsonPath: workspace.cdmApiSelectionFinalPath,
      markdownPath: workspace.cdmApiSelectionFinalMarkdownPath,
    })
    await writeApprovedCdmApiContract({
      contract: approvedCdmApiContract,
      jsonPath: workspace.approvedCdmApiContractPath,
      markdownPath: workspace.approvedCdmApiContractMarkdownPath,
    })
    await writeFile(
      workspace.approvedCdmApiContractSummaryPath,
      renderApprovedCdmApiContractSummary(approvedCdmApiContract),
      'utf8'
    )
    await writeSemanticRecipeBundle({
      bundle: semanticRecipes,
      jsonPath: workspace.semanticRecipesPath,
      markdownPath: workspace.semanticRecipesMarkdownPath,
    })
    await writeSemanticRecipeValidationReport({
      report: recipeValidation,
      jsonPath: workspace.semanticRecipeValidationPath,
      markdownPath: workspace.semanticRecipeValidationMarkdownPath,
    })
    const fixtureReport = await writeSemanticRecipeFixtures({
      runOutputDir: config.runOutputDir,
      recipes: semanticRecipes,
      jsonPath: workspace.semanticRecipeFixturesReportPath,
      markdownPath: workspace.semanticRecipeFixturesReportMarkdownPath,
    })
    if (fixtureReport.status === 'failed') {
      throw new Error('Semantic recipe fixture generation failed before agent run.')
    }
    await writeFinalImplementationContract({
      contract: finalImplementationContract,
      jsonPath: workspace.finalImplementationContractJsonPath,
      markdownPath: workspace.finalImplementationContractPath,
    })
    await writeContextBudgetReport({
      report: contextBudgetReport,
      jsonPath: workspace.contextBudgetReportPath,
      markdownPath: workspace.contextBudgetReportMarkdownPath,
    })
    const documentationReadiness = await buildDocumentationReadinessReport({
      productFamily: config.productFamily,
      implementationGroup: productScope.currentImplementationGroup,
      runOutputDir: config.runOutputDir,
      javaShellContractPath: workspace.javaShellContractPath,
      approvedCdmApiContractPath: workspace.approvedCdmApiContractPath,
      approvedCdmApiContractSummaryPath: workspace.approvedCdmApiContractSummaryPath,
      semanticRecipesPath: workspace.semanticRecipesPath,
      semanticRecipesMarkdownPath: workspace.semanticRecipesMarkdownPath,
      semanticRecipeValidationPath: workspace.semanticRecipeValidationPath,
      semanticRecipeValidationMarkdownPath: workspace.semanticRecipeValidationMarkdownPath,
      semanticRecipeFixturesReportPath: workspace.semanticRecipeFixturesReportPath,
      semanticRecipeFixturesReportMarkdownPath: workspace.semanticRecipeFixturesReportMarkdownPath,
      contextBudgetReportPath: workspace.contextBudgetReportPath,
      contextBudgetReportMarkdownPath: workspace.contextBudgetReportMarkdownPath,
    })
    await writeDocumentationReadinessReport({
      report: documentationReadiness,
      jsonPath: workspace.javaDocumentationReadinessPath,
      markdownPath: workspace.javaDocumentationReadinessMarkdownPath,
    })
    if (documentationReadiness.status === 'failed') {
      throw new Error('Java documentation readiness failed before planner run.')
    }
    await writeApiContractValidationSummary({
      workspace,
      recipeValidationStatus: recipeValidation.status,
      contextBudgetStatus: contextBudgetReport.status,
    })
    await writeFile(workspace.evidenceIndexPath, renderEvidenceIndex(config, productScope), 'utf8')
    await writeFile(workspace.javaShellContractPath, renderJavaShellContract(config), 'utf8')
    await writeFile(workspace.runLogPath, renderRunLogStart(config), 'utf8')
    await writeFile(workspace.implementationPlanPath, '# Implementation Plan\n\n', 'utf8')
    await writeFile(workspace.implementationLogPath, '# Implementation Log\n\n', 'utf8')
    await writeFile(workspace.repairLogPath, '# Repair Log\n\n', 'utf8')
    await writeFile(workspace.finalBuildReportPath, '# Final Build Report\n\n', 'utf8')
  }

  if (!(await exists(workspace.javaDocumentationReadinessPath))) {
    const productScope = JSON.parse(await Bun.file(workspace.productScopeJsonPath).text()) as ProductScopeGuidance
    const documentationReadiness = await buildDocumentationReadinessReport({
      productFamily: config.productFamily,
      implementationGroup: productScope.currentImplementationGroup,
      runOutputDir: config.runOutputDir,
      javaShellContractPath: workspace.javaShellContractPath,
      approvedCdmApiContractPath: workspace.approvedCdmApiContractPath,
      approvedCdmApiContractSummaryPath: workspace.approvedCdmApiContractSummaryPath,
      semanticRecipesPath: workspace.semanticRecipesPath,
      semanticRecipesMarkdownPath: workspace.semanticRecipesMarkdownPath,
      semanticRecipeValidationPath: workspace.semanticRecipeValidationPath,
      semanticRecipeValidationMarkdownPath: workspace.semanticRecipeValidationMarkdownPath,
      semanticRecipeFixturesReportPath: workspace.semanticRecipeFixturesReportPath,
      semanticRecipeFixturesReportMarkdownPath: workspace.semanticRecipeFixturesReportMarkdownPath,
      contextBudgetReportPath: workspace.contextBudgetReportPath,
      contextBudgetReportMarkdownPath: workspace.contextBudgetReportMarkdownPath,
    })
    await writeDocumentationReadinessReport({
      report: documentationReadiness,
      jsonPath: workspace.javaDocumentationReadinessPath,
      markdownPath: workspace.javaDocumentationReadinessMarkdownPath,
    })
    if (documentationReadiness.status === 'failed') {
      throw new Error('Java documentation readiness failed before planner run.')
    }
  }

  await appendRunLog(workspace.runLogPath, {
    title: 'Workspace created',
    details: {
      runId: config.runId,
      productFamily: config.productFamily,
      runOutputDir: config.runOutputDir,
    },
  })

  return workspace
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function resolveBuilderMethodsForRequirements(
  steps: DraftRecipeStepRequirement[]
) {
  const methods = await Promise.all(
    steps.map(step =>
      resolveBuilderMethodsForRecipeStep({
        classNames: step.classNames,
        intents: step.requiredBuilderIntents,
      })
    )
  )
  return methods.flat()
}

async function writeApiContractValidationSummary(args: {
  workspace: GeneratorWorkspace
  recipeValidationStatus: string
  contextBudgetStatus: string
}): Promise<void> {
  const summary = {
    generatedAt: new Date().toISOString(),
    recipeValidationStatus: args.recipeValidationStatus,
    contextBudgetStatus: args.contextBudgetStatus,
    javaApiGateStatus: 'not-run-yet',
  }
  await writeFile(args.workspace.apiContractValidationSummaryPath, JSON.stringify(summary, null, 2), 'utf8')
  await writeFile(
    args.workspace.apiContractValidationSummaryMarkdownPath,
    `# API Contract Validation Summary

Generated: ${summary.generatedAt}

- Recipe validation: ${summary.recipeValidationStatus}
- Context budget: ${summary.contextBudgetStatus}
- Java API gate: ${summary.javaApiGateStatus}
`,
    'utf8'
  )
}

function renderInputBrief(config: GeneratorRunConfig): string {
  const roleModels = Object.entries(config.roleModels)
    .map(([role, model]) => `- ${role}: ${model.model}, maxTokens=${model.maxTokens}`)
    .join('\n')

  return `# Input Brief

Run id: ${config.runId}
Product family: ${config.productFamily}

Role models:
${roleModels}

Goal:

Build an AI-native generator run for the FX derivatives family. Use the
precomputed product-scope guidance and evidence packet instead of discovering
product scope through broad search. Generate a Java Maven mapper project, run
gates, and repair failures. The shipped Java mapper runtime must not call an LLM
and must not read this agent workspace.

Runtime fixtures for this run:
${bulletList(config.runtimeFixtures.map(fixture => `${fixture.id}: ${fixture.fixtureFileName}`))}
`
}

function renderEvidenceIndex(config: GeneratorRunConfig, scope: ProductScopeGuidance): string {
  const runtimeFixtureIds = new Set(config.runtimeFixtures.map(fixture => normalizePath(fixture.fpmlPath)))
  const runtimeFixtures = scope.classifiedFixtures.filter(fixture => runtimeFixtureIds.has(normalizePath(fixture.fpmlPath)))
  const observedFixtures = scope.classifiedFixtures.filter(fixture => !runtimeFixtureIds.has(normalizePath(fixture.fpmlPath)))
  return `# Evidence Index

Use this file as the default context map. Fetch detailed evidence only when needed.

## Runtime Fixtures

${bulletList(runtimeFixtures.map(fixture => `${fixture.productGroup}: ${fixture.fpmlPath}`))}

## Observed But Not Runtime Supported

${bulletList(observedFixtures.map(fixture => `${fixture.productGroup}: ${fixture.fpmlPath}`))}

## Detailed Evidence Sources

- Full evidence packet: agent-workspace/evidence-packet.md
- Product scope JSON: agent-workspace/00-product-scope.json
- Rosetta authoritative context: agent-workspace/rosetta-generation-context.md
- CDM/Rosetta Java preflight: agent-workspace/cdm-rosetta-preflight.md
- CDM Java API summary: agent-workspace/cdm-java-api-summary.md
- CDM Java API pack: agent-workspace/cdm-java-api-pack.md
- CDM Java missing-class observations: agent-workspace/cdm-java-missing-classes.md
- Relevant CDM API candidates: agent-workspace/relevant-cdm-api-candidates.md
- CDM API selection pass 1: agent-workspace/cdm-api-selection-pass1.md
- Final CDM API selection: agent-workspace/cdm-api-selection-final.md
- Approved CDM API contract summary: agent-workspace/approved-cdm-api-contract-summary.md
- Full approved CDM API contract: agent-workspace/approved-cdm-api-contract.json
- Draft semantic construction recipes: agent-workspace/semantic-recipes-draft.md
- Semantic construction recipes: agent-workspace/semantic-recipes.md
- Semantic recipe validation: agent-workspace/semantic-recipe-validation.md
- Context budget report: agent-workspace/context-budget-report.md
- Final implementation contract: agent-workspace/final-implementation-contract.md
- Rosetta FX docs: data/rosetta-source/latest/docs/product-families/fx.md
- Shared Rosetta ingest docs: data/rosetta-source/latest/docs/shared-ingest.md
`
}

function renderJavaShellContract(config: GeneratorRunConfig): string {
  return `# Java Shell Contract

Java target: ${GENERATED_JAVA_VERSION}
Base package: ${GENERATED_BASE_PACKAGE}
Generated implementation package: ${GENERATED_IMPL_PACKAGE}
Generated implementation class: ${GENERATED_IMPL_CLASS}
CDM/Rosetta preflight status: ${config.cdmRosettaPreflight?.status ?? 'missing'}
Approved CDM API contract summary: agent-workspace/approved-cdm-api-contract-summary.md
Full approved CDM API contract JSON: agent-workspace/approved-cdm-api-contract.json
Semantic construction recipes: agent-workspace/semantic-recipes.md

## Shell-Owned Files

- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

## Generated-Owned Files

- src/main/java/com/fpml/cdm/fx/mapper/generated/**
- src/test/java/**
- reports/**

## Runtime Fixtures

${bulletList(config.runtimeFixtures.map(fixture => `${fixture.id}: fixtures/${fixture.fixtureFileName}`))}

## Rosetta-Native Runtime Rules

- Build the main CDM result with approved CDM/Rosetta Java model classes from agent-workspace/approved-cdm-api-contract.md.
- Follow agent-workspace/semantic-recipes.md for construction order and Rosetta traceability.
- Call search_cdm_java_classes or resolve_cdm_concept before exact class lookup; do not guess package names.
- Missing-class observations apply only to exact fully qualified class names.
- Do not invent FpML Java model classes such as FpmlFxSingleLeg; parse XML with DOM/StAX or generated internal DTOs.
- Do not build the main CDM output with Jackson ObjectNode or ArrayNode.
- Never write Java import aliases such as import x.y.Type as Alias; Java does not support them.
- Use Jackson only for final serialization and sidecar reports.
- Cite Rosetta function names in traceability reports.
`
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, '/')
}

function renderRunLogStart(config: GeneratorRunConfig): string {
  return `# Run Log

Run id: ${config.runId}
Started: ${new Date().toISOString()}
Product family: ${config.productFamily}
Base output dir: ${config.baseOutputDir}
Run output dir: ${config.runOutputDir}
Max planning rounds: ${config.maxPlanningRounds}
Max repair attempts: ${config.maxRepairAttempts}
Resume: ${config.resume ? 'yes' : 'no'}

Evidence folders:
${bulletList(config.evidenceRoots)}
`
}
