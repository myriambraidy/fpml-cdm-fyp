import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { ApprovedCdmApiContract } from './approved-cdm-api-contract'
import type { SemanticRecipeBundle } from './semantic-recipes'

export type ContextBudgetOverride = {
  enabled: boolean
  reason: string
  approvedBy: string
}

export type ContextBudgetConfig = {
  productFamily: string
  implementationGroup: string
  approvedClassLimit: number
  approvedBuilderMethodLimit: number
  finalContractLineLimit: number
  override?: ContextBudgetOverride
}

export type ContextBudgetFinding = {
  code: 'approved_contract_too_large' | 'approved_builder_method_contract_too_large' | 'final_contract_too_long'
  severity: 'blocking' | 'warning'
  message: string
}

export type ContextBudgetReport = {
  generatedAt: string
  config: ContextBudgetConfig
  approvedClassCount: number
  approvedBuilderMethodCount: number
  finalContractLineCount: number
  recipeCount: number
  findings: ContextBudgetFinding[]
  status: 'passed' | 'failed'
  derivation: string[]
}

export function contextBudgetReportJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'context-budget-report.json')
}

export function contextBudgetReportMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'context-budget-report.md')
}

export function defaultContextBudgetConfig(args: {
  productFamily: string
  implementationGroup: string
}): ContextBudgetConfig {
  return {
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    approvedClassLimit: 80,
    approvedBuilderMethodLimit: 240,
    finalContractLineLimit: 300,
  }
}

export function buildContextBudgetReport(args: {
  config: ContextBudgetConfig
  contract: ApprovedCdmApiContract
  recipes: SemanticRecipeBundle
  finalContractMarkdown: string
}): ContextBudgetReport {
  const overrideEnabled = args.config.override?.enabled === true
  const findings: ContextBudgetFinding[] = []
  const finalContractLineCount = args.finalContractMarkdown.split(/\r?\n/u).length

  if (args.contract.approvedClasses.length > args.config.approvedClassLimit) {
    findings.push({
      code: 'approved_contract_too_large',
      severity: overrideEnabled ? 'warning' : 'blocking',
      message: `Approved contract has ${args.contract.approvedClasses.length} classes; limit is ${args.config.approvedClassLimit}.`,
    })
  }
  if (args.contract.approvedBuilderMethods.length > args.config.approvedBuilderMethodLimit) {
    findings.push({
      code: 'approved_builder_method_contract_too_large',
      severity: overrideEnabled ? 'warning' : 'blocking',
      message: `Approved contract has ${args.contract.approvedBuilderMethods.length} builder methods; limit is ${args.config.approvedBuilderMethodLimit}.`,
    })
  }
  if (finalContractLineCount > args.config.finalContractLineLimit) {
    findings.push({
      code: 'final_contract_too_long',
      severity: overrideEnabled ? 'warning' : 'blocking',
      message: `Final implementation contract has ${finalContractLineCount} lines; limit is ${args.config.finalContractLineLimit}.`,
    })
  }

  return {
    generatedAt: new Date().toISOString(),
    config: args.config,
    approvedClassCount: args.contract.approvedClasses.length,
    approvedBuilderMethodCount: args.contract.approvedBuilderMethods.length,
    finalContractLineCount,
    recipeCount: args.recipes.recipes.length,
    findings,
    status: findings.some(finding => finding.severity === 'blocking') ? 'failed' : 'passed',
    derivation: [
      '80 approved classes is chosen so approved-cdm-api-contract.md remains inspectable and fits comfortably in implementer context.',
      '240 approved builder methods is chosen to cover core recipe methods without dumping unrelated builder APIs.',
      '300 final-contract lines is chosen so implementation authority remains readable in one prompt chunk.',
    ],
  }
}

export async function writeContextBudgetReport(args: {
  report: ContextBudgetReport
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.report, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderContextBudgetReport(args.report), 'utf8')
}

export function renderContextBudgetReport(report: ContextBudgetReport): string {
  const override = report.config.override?.enabled === true
    ? `enabled: ${report.config.override.reason} (approved by ${report.config.override.approvedBy})`
    : 'disabled'
  return `# Context Budget Report

Generated: ${report.generatedAt}
Status: ${report.status}
Product family: ${report.config.productFamily}
Implementation group: ${report.config.implementationGroup}
Override: ${override}

## Counts

- Approved classes: ${report.approvedClassCount} / ${report.config.approvedClassLimit}
- Approved builder methods: ${report.approvedBuilderMethodCount} / ${report.config.approvedBuilderMethodLimit}
- Final contract lines: ${report.finalContractLineCount} / ${report.config.finalContractLineLimit}
- Recipes: ${report.recipeCount}

## Derivation

${report.derivation.map(item => `- ${item}`).join('\n')}

## Findings

${report.findings.length === 0 ? '- none' : report.findings.map(renderFinding).join('\n')}
`
}

function renderFinding(finding: ContextBudgetFinding): string {
  return `- ${finding.severity} ${finding.code}: ${finding.message}`
}
