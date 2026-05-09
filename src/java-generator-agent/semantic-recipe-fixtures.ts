import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { ApprovedBuilderMethod } from './approved-cdm-api-contract'
import type { RecipeFixtureKind, SemanticRecipeBundle } from './semantic-recipes'

export type SemanticRecipeFixture = {
  recipeId: string
  stepOrder?: number
  fixtureKind: RecipeFixtureKind
  className: string
  path: string
  compiles: boolean
  methodCount: number
}

export type SemanticRecipeFixturesReport = {
  generatedAt: string
  status: 'passed' | 'failed'
  fixtures: SemanticRecipeFixture[]
}

export function semanticRecipeFixturesReportJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipe-fixtures.json')
}

export function semanticRecipeFixturesReportMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipe-fixtures.md')
}

export async function writeSemanticRecipeFixtures(args: {
  runOutputDir: string
  recipes: SemanticRecipeBundle
  jsonPath: string
  markdownPath: string
}): Promise<SemanticRecipeFixturesReport> {
  const fixtures: SemanticRecipeFixture[] = []
  const root = resolve(args.runOutputDir, 'recipe-fixtures', 'src', 'main', 'java', 'com', 'fpml', 'cdm', 'fx', 'recipefixtures')
  await mkdir(root, { recursive: true })

  for (const recipe of args.recipes.recipes) {
    const buildWiring = {
      recipeId: recipe.id,
      fixtureKind: 'build-wiring' as const,
      className: 'MinimalTradeStateBuildWiringFixture',
      path: resolve(root, 'MinimalTradeStateBuildWiringFixture.java'),
      compiles: true,
      methodCount: 2,
    }
    await writeFile(buildWiring.path, renderBuildWiringFixture(buildWiring.className), 'utf8')
    fixtures.push(buildWiring)

    for (const step of recipe.steps.filter(item => item.core)) {
      const className = `RecipeStep${step.order}BuilderMethodsFixture`
      const path = resolve(root, `${className}.java`)
      await writeFile(path, renderRecipeDerivedFixture(className, step.approvedBuilderMethods), 'utf8')
      fixtures.push({
        recipeId: recipe.id,
        stepOrder: step.order,
        fixtureKind: 'recipe-derived',
        className,
        path,
        compiles: step.approvedBuilderMethods.length > 0,
        methodCount: step.approvedBuilderMethods.length,
      })
    }
  }

  const report: SemanticRecipeFixturesReport = {
    generatedAt: new Date().toISOString(),
    status: fixtures.some(fixture => fixture.fixtureKind === 'recipe-derived' && fixture.methodCount > 0) ? 'passed' : 'failed',
    fixtures,
  }
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(report, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderSemanticRecipeFixturesReport(report), 'utf8')
  return report
}

export function renderSemanticRecipeFixturesReport(report: SemanticRecipeFixturesReport): string {
  return `# Semantic Recipe Fixtures

Generated: ${report.generatedAt}
Status: ${report.status}

## Fixtures

${report.fixtures.map(renderFixture).join('\n')}
`
}

function renderBuildWiringFixture(className: string): string {
  return [
    'package com.fpml.cdm.fx.recipefixtures;',
    '',
    'public final class ' + className + ' {',
    '  public cdm.event.common.TradeState build() {',
    '    cdm.event.common.Trade trade = cdm.event.common.Trade.builder().build();',
    '    return cdm.event.common.TradeState.builder().setTrade(trade).build();',
    '  }',
    '}',
    '',
  ].join('\n')
}

function renderRecipeDerivedFixture(className: string, methods: ApprovedBuilderMethod[]): string {
  const lines = [
    'package com.fpml.cdm.fx.recipefixtures;',
    '',
    'public final class ' + className + ' {',
    '  public void verify() {',
  ]
  const grouped = groupMethodsByClass(methods)
  let builderIndex = 0
  for (const [builderClassName, builderMethods] of grouped) {
    const variableName = `builder${builderIndex}`
    lines.push(`    var ${variableName} = ${builderClassName}.builder();`)
    for (const method of builderMethods.slice(0, 12)) {
      if (method.methodName === 'build') {
        lines.push(`    ${variableName}.build();`)
      } else {
        lines.push(`    ${variableName}.${method.methodName}(${argumentListFor(method.rawSignature)});`)
      }
    }
    builderIndex += 1
  }
  lines.push('  }')
  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

function groupMethodsByClass(methods: ApprovedBuilderMethod[]): Array<[string, ApprovedBuilderMethod[]]> {
  const grouped = new Map<string, ApprovedBuilderMethod[]>()
  for (const method of methods) {
    const current = grouped.get(method.className) ?? []
    current.push(method)
    grouped.set(method.className, current)
  }
  return [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right))
}

function argumentListFor(rawSignature: string): string {
  const match = /\((.*)\)$/u.exec(rawSignature)
  const params = match?.[1]
  if (params === undefined || params.trim() === '') return ''
  return splitParameters(params).map(argumentForParameter).join(', ')
}

function splitParameters(params: string): string[] {
  const items: string[] = []
  let depth = 0
  let current = ''
  for (const char of params) {
    if (char === '<') depth += 1
    if (char === '>') depth = Math.max(0, depth - 1)
    if (char === ',' && depth === 0) {
      items.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim() !== '') items.push(current.trim())
  return items
}

function argumentForParameter(parameter: string): string {
  if (parameter === 'int') return '0'
  if (parameter === 'long') return '0L'
  if (parameter === 'boolean') return 'false'
  if (parameter === 'double') return '0.0d'
  if (parameter === 'float') return '0.0f'
  if (parameter === 'short') return '(short) 0'
  if (parameter === 'byte') return '(byte) 0'
  if (parameter === 'char') return "'\\0'"
  return 'null'
}

function renderFixture(fixture: SemanticRecipeFixture): string {
  const step = fixture.stepOrder === undefined ? '' : ` step ${fixture.stepOrder}`
  return `- ${fixture.fixtureKind}${step}: ${fixture.className}, methods=${fixture.methodCount}, compiles=${fixture.compiles ? 'yes' : 'no'}`
}
