import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { ApprovedCdmApiContract, ApprovedBuilderMethod } from './approved-cdm-api-contract'
import type { CdmConstructionRecipeStep, SemanticRecipeBundle } from './semantic-recipes'

export type SemanticRecipeValidationCode =
  | 'recipe_class_not_approved'
  | 'recipe_method_not_approved'
  | 'recipe_method_parameter_not_approved'
  | 'recipe_forbidden_class_used'
  | 'recipe_step_missing_builder_methods'

export type SemanticRecipeValidationFinding = {
  code: SemanticRecipeValidationCode
  severity: 'blocking' | 'warning'
  recipeId: string
  stepOrder?: number
  message: string
}

export type SemanticRecipeValidationReport = {
  generatedAt: string
  status: 'passed' | 'failed'
  findings: SemanticRecipeValidationFinding[]
}

export function semanticRecipeValidationJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipe-validation.json')
}

export function semanticRecipeValidationMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipe-validation.md')
}

export function validateSemanticRecipes(args: {
  recipes: SemanticRecipeBundle
  contract: ApprovedCdmApiContract
}): SemanticRecipeValidationReport {
  const findings: SemanticRecipeValidationFinding[] = []
  const approvedClasses = new Set(args.contract.approvedClasses.map(item => item.className))
  const forbiddenClasses = new Set(args.contract.forbiddenClasses.map(item => item.className))
  const approvedMethods = new Set(args.contract.approvedBuilderMethods.map(methodKey))

  for (const recipe of args.recipes.recipes) {
    if (!approvedClasses.has(recipe.rootOutputClass)) {
      findings.push({
        code: 'recipe_class_not_approved',
        severity: 'blocking',
        recipeId: recipe.id,
        message: `Recipe root output class is not approved: ${recipe.rootOutputClass}`,
      })
    }
    for (const step of recipe.steps) {
      validateStepClasses({ recipeId: recipe.id, step, approvedClasses, forbiddenClasses, findings })
      validateStepMethods({ recipeId: recipe.id, step, approvedMethods, approvedClasses, findings })
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    status: findings.some(finding => finding.severity === 'blocking') ? 'failed' : 'passed',
    findings,
  }
}

export async function writeSemanticRecipeValidationReport(args: {
  report: SemanticRecipeValidationReport
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.report, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderSemanticRecipeValidationReport(args.report), 'utf8')
}

export function renderSemanticRecipeValidationReport(report: SemanticRecipeValidationReport): string {
  return `# Semantic Recipe Validation

Generated: ${report.generatedAt}
Status: ${report.status}

## Findings

${report.findings.length === 0 ? '- none' : report.findings.map(renderFinding).join('\n')}
`
}

function validateStepClasses(args: {
  recipeId: string
  step: CdmConstructionRecipeStep
  approvedClasses: Set<string>
  forbiddenClasses: Set<string>
  findings: SemanticRecipeValidationFinding[]
}): void {
  for (const className of args.step.approvedClasses) {
    if (args.forbiddenClasses.has(className)) {
      args.findings.push({
        code: 'recipe_forbidden_class_used',
        severity: 'blocking',
        recipeId: args.recipeId,
        stepOrder: args.step.order,
        message: `Recipe step uses forbidden class: ${className}`,
      })
    }
    if (!args.approvedClasses.has(className)) {
      args.findings.push({
        code: 'recipe_class_not_approved',
        severity: 'blocking',
        recipeId: args.recipeId,
        stepOrder: args.step.order,
        message: `Recipe step uses class outside approved contract: ${className}`,
      })
    }
  }
}

function validateStepMethods(args: {
  recipeId: string
  step: CdmConstructionRecipeStep
  approvedMethods: Set<string>
  approvedClasses: Set<string>
  findings: SemanticRecipeValidationFinding[]
}): void {
  if (args.step.core && args.step.approvedBuilderMethods.length === 0) {
    args.findings.push({
      code: 'recipe_step_missing_builder_methods',
      severity: 'blocking',
      recipeId: args.recipeId,
      stepOrder: args.step.order,
      message: 'Core recipe step has no verified approved builder methods.',
    })
  }
  for (const method of args.step.approvedBuilderMethods) {
    if (!args.approvedMethods.has(methodKey(method))) {
      args.findings.push({
        code: 'recipe_method_not_approved',
        severity: 'blocking',
        recipeId: args.recipeId,
        stepOrder: args.step.order,
        message: `Recipe step uses builder method outside approved contract: ${method.className}.${method.methodName}`,
      })
    }
    for (const parameterType of method.parameterTypes) {
      if (isJavaOrPrimitive(parameterType)) continue
      if (!args.approvedClasses.has(parameterType)) {
        args.findings.push({
          code: 'recipe_method_parameter_not_approved',
          severity: 'blocking',
          recipeId: args.recipeId,
          stepOrder: args.step.order,
          message: `Builder method parameter is not approved: ${parameterType}`,
        })
      }
    }
  }
}

function methodKey(method: ApprovedBuilderMethod): string {
  return `${method.className}.${method.methodName}:${method.rawSignature}`
}

function isJavaOrPrimitive(className: string): boolean {
  return className.startsWith('java.')
    || className === 'int'
    || className === 'long'
    || className === 'boolean'
    || className === 'double'
    || className === 'float'
    || className === 'short'
    || className === 'byte'
    || className === 'char'
}

function renderFinding(finding: SemanticRecipeValidationFinding): string {
  const step = finding.stepOrder === undefined ? '' : ` step ${finding.stepOrder}`
  return `- ${finding.severity} ${finding.code}${step}: ${finding.message}`
}
