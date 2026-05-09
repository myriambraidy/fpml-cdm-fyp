import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { ApprovedCdmApiContract } from './approved-cdm-api-contract'
import type { ProductScopeGuidance } from './product-scope'
import type { SemanticRecipeBundle } from './semantic-recipes'
import type { GeneratorRunConfig } from './types'

export type FinalImplementationContract = {
  generatedAt: string
  productFamily: string
  implementationGroup: string
  runtimeFixtureIds: string[]
  approvedCdmApiContractPath: string
  semanticRecipesPath: string
  rules: string[]
  forbiddenClasses: string[]
  approvedClasses: string[]
  recipeIds: string[]
}

export async function buildFinalImplementationContract(args: {
  config: GeneratorRunConfig
  scope: ProductScopeGuidance
  apiContract: ApprovedCdmApiContract
  recipeBundle: SemanticRecipeBundle
  approvedCdmApiContractPath: string
  semanticRecipesPath: string
}): Promise<FinalImplementationContract> {
  return {
    generatedAt: new Date().toISOString(),
    productFamily: args.config.productFamily,
    implementationGroup: args.scope.currentImplementationGroup,
    runtimeFixtureIds: args.config.runtimeFixtures.map(fixture => fixture.id),
    approvedCdmApiContractPath: args.approvedCdmApiContractPath,
    semanticRecipesPath: args.semanticRecipesPath,
    rules: [
      'Use only the approved CDM/Rosetta classes listed in this contract and approved-cdm-api-contract.json.',
      'Do not use classes listed under forbiddenClasses.',
      'Do not invent CDM classes or package names. Search the compiled jar index first.',
      'Never write Java import aliases. Java imports must never contain " as ".',
      'Use CDM Java builders as the internal model. Jackson is only for final serialization and sidecar reports.',
      'Follow semantic-recipes.md for object construction order and Rosetta function traceability.',
      'If a required class or builder method is missing from the contract, stop and report a contract gap.',
      'Unsupported fields must be reported explicitly; do not silently fabricate CDM fields.',
    ],
    forbiddenClasses: args.apiContract.forbiddenClasses.map(item => item.className),
    approvedClasses: args.apiContract.approvedClasses.map(item => item.className),
    recipeIds: args.recipeBundle.recipes.map(recipe => recipe.id),
  }
}

export async function writeFinalImplementationContract(args: {
  contract: FinalImplementationContract
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.contract, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderFinalImplementationContract(args.contract), 'utf8')
}

export async function readFinalImplementationContract(path: string): Promise<FinalImplementationContract> {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content) as FinalImplementationContract
}

export async function finalImplementationContractExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

export function finalImplementationContractJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'final-implementation-contract.json')
}

export function finalImplementationContractMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'final-implementation-contract.md')
}

export function renderFinalImplementationContract(contract: FinalImplementationContract): string {
  return `# Final Implementation Contract

Generated: ${contract.generatedAt}
Product family: ${contract.productFamily}
Implementation group: ${contract.implementationGroup}

## Runtime Fixtures

${contract.runtimeFixtureIds.map(id => `- ${id}`).join('\n')}

## Source Files

- Approved API contract: ${contract.approvedCdmApiContractPath}
- Semantic recipes: ${contract.semanticRecipesPath}

## Rules

${contract.rules.map(rule => `- ${rule}`).join('\n')}

## Approved Classes

${contract.approvedClasses.map(className => `- ${className}`).join('\n')}

## Forbidden Classes

${renderForbiddenClasses(contract.forbiddenClasses)}

## Recipes

${contract.recipeIds.map(id => `- ${id}`).join('\n')}
`
}

function renderForbiddenClasses(classNames: string[]): string {
  if (classNames.length === 0) return '- none'
  const shown = classNames.slice(0, 40).map(className => `- ${className}`).join('\n')
  const remaining = classNames.length - 40
  return remaining <= 0 ? shown : `${shown}\n- ... ${remaining} additional forbidden classes are listed in approved-cdm-api-contract.json`
}
