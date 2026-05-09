import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { ApprovedBuilderMethod, ApprovedCdmApiContract } from './approved-cdm-api-contract'
import type { CdmApiSelection } from './cdm-api-selection'
import type { FxBuilderMethodIntent } from './cdm-builder-method-resolver'
import type { DocumentationAuthority } from './semantic-docs'
import { renderAuthorities } from './semantic-docs'

export type CdmConstructionRecipe = {
  id: string
  title: string
  productFamily: string
  implementationGroup: string
  rootOutputClass: string
  authority: DocumentationAuthority[]
  steps: CdmConstructionRecipeStep[]
  forbiddenClasses: string[]
  examples: CdmConstructionRecipeExample[]
}

export type CdmConstructionRecipeStep = {
  order: number
  action: string
  core: boolean
  approvedClasses: string[]
  requiredBuilderIntents: FxBuilderMethodIntent[]
  approvedBuilderMethods: ApprovedBuilderMethod[]
  rosettaFunctions: string[]
  notes: string[]
}

export type RecipeFixtureKind = 'build-wiring' | 'recipe-derived'

export type CdmConstructionRecipeExample = {
  title: string
  fixtureKind: RecipeFixtureKind
  code: string
  compiles: boolean
  source: DocumentationAuthority
}

export type SemanticRecipeBundle = {
  generatedAt: string
  productFamily: string
  implementationGroup: string
  recipes: CdmConstructionRecipe[]
}

export type DraftRecipeStepRequirement = {
  order: number
  action: string
  core: boolean
  classNames: string[]
  requiredBuilderIntents: FxBuilderMethodIntent[]
  rosettaFunctions: string[]
  notes: string[]
}

export type DraftSemanticRecipeRequirements = {
  recipeId: string
  requiredClasses: string[]
  steps: DraftRecipeStepRequirement[]
}

export function buildFxSingleLegDraftRecipeRequirements(selection: CdmApiSelection): DraftSemanticRecipeRequirements {
  const settlementPayout = selectedClassForConcept(selection, 'Settlement payout', 'cdm.product.template.SettlementPayout')
  const resolvablePriceQuantity = selectedClassForConcept(
    selection,
    'Resolvable price quantity',
    'cdm.product.common.settlement.ResolvablePriceQuantity'
  )
  const priceSchedule = selectedClassForConcept(selection, 'Price schedule', 'cdm.observable.asset.PriceSchedule')
  const partyReference = selectedClassForConcept(
    selection,
    'Party reference or party identity',
    'cdm.base.staticdata.party.metafields.ReferenceWithMetaParty'
  )
  const steps: DraftRecipeStepRequirement[] = [
    {
      order: 1,
      action: 'Build parties and party identifiers from FpML party elements.',
      core: true,
      classNames: [
        'cdm.base.staticdata.party.Party',
        'cdm.base.staticdata.party.PartyIdentifier',
        'cdm.base.staticdata.identifier.Identifier',
        'cdm.base.staticdata.identifier.AssignedIdentifier',
        partyReference,
      ],
      requiredBuilderIntents: ['build-root', 'set-party', 'set-identifier'],
      rosettaFunctions: [
        'MapFxSingleLegCounterpartyList',
        'MapFxSingleLegAncillaryPartyList',
        'MapPayerReceiverToAccountPartyReference',
      ],
      notes: ['Do not invent cdm.base.staticdata.party.PartyReference. Use approved party identity or metafield classes.'],
    },
    {
      order: 2,
      action: 'Build trade identifiers from tradeHeader.partyTradeIdentifier values.',
      core: true,
      classNames: ['cdm.event.common.TradeIdentifier'],
      requiredBuilderIntents: ['build-root', 'set-identifier'],
      rosettaFunctions: ['MapTradeIdentifierList'],
      notes: ['Preserve source trade identifiers in traceability reports.'],
    },
    {
      order: 3,
      action: 'Build NonTransferableProduct and attach EconomicTerms.',
      core: true,
      classNames: [
        'cdm.product.template.NonTransferableProduct',
        'cdm.product.template.EconomicTerms',
        'cdm.product.template.Product',
        'cdm.product.template.TradableProduct',
      ],
      requiredBuilderIntents: ['build-root', 'set-product', 'set-economic-terms'],
      rosettaFunctions: [
        'MapFxSingleLegNonTransferableProduct',
        'MapFxSingleLegEconomicTerms',
        'MapProductIdentifierList',
        'MapProductTaxonomyList',
      ],
      notes: ['Use CDM builders as the internal model. Jackson is only for final serialization and reports.'],
    },
    {
      order: 4,
      action: 'Build Payout and selected SettlementPayout with price, quantity, settlement, and underlier details.',
      core: true,
      classNames: [
        'cdm.product.template.Payout',
        settlementPayout,
        resolvablePriceQuantity,
        'cdm.product.common.settlement.SettlementTerms',
        'cdm.product.common.settlement.CashSettlementTerms',
        'cdm.product.common.settlement.SettlementTypeEnum',
        'cdm.product.template.Underlier',
        priceSchedule,
        'cdm.observable.asset.Observable',
        'cdm.base.staticdata.asset.common.Asset',
        'cdm.base.staticdata.asset.common.Cash',
      ],
      requiredBuilderIntents: ['build-root', 'set-payout', 'set-settlement-payout', 'set-price-quantity'],
      rosettaFunctions: [
        'MapFxCoreDetailsModelToSettlementPayout',
        'MapFxSingleLegPriceQuantityList',
        'MapFxCoreDetailsModelPriceListWithLocation',
        'MapFxCoreDetailsModelQuantityListWithLocation',
      ],
      notes: ['Use the selected class in the approved contract for each concept; do not use rejected same-name candidates.'],
    },
    {
      order: 5,
      action: 'Build Trade and wrap it in TradeState for runtime output.',
      core: true,
      classNames: [
        'cdm.event.common.Trade',
        'cdm.event.common.TradeState',
        'cdm.event.common.ContractDetails',
      ],
      requiredBuilderIntents: ['build-root', 'set-trade', 'set-contract-details', 'set-product', 'set-party'],
      rosettaFunctions: ['MapTradeState'],
      notes: ['The runtime output root is TradeState unless the final implementation contract states otherwise.'],
    },
  ]

  return {
    recipeId: 'fx-single-leg-tradestate',
    requiredClasses: uniqueStrings(steps.flatMap(step => step.classNames).filter(Boolean)),
    steps,
  }
}

export function buildSemanticRecipeBundle(args: {
  productFamily: string
  implementationGroup: string
  contract: ApprovedCdmApiContract
}): SemanticRecipeBundle {
  const recipe = buildFxSingleLegTradeStateRecipe(args.contract, args.productFamily, args.implementationGroup)
  assertRecipeContractAlignment(recipe, args.contract)
  assertCoreStepsHaveMethods(recipe)
  return {
    generatedAt: new Date().toISOString(),
    productFamily: args.productFamily,
    implementationGroup: args.implementationGroup,
    recipes: [recipe],
  }
}

export async function writeSemanticRecipeBundle(args: {
  bundle: SemanticRecipeBundle
  jsonPath: string
  markdownPath: string
}): Promise<void> {
  await mkdir(dirname(args.jsonPath), { recursive: true })
  await writeFile(args.jsonPath, JSON.stringify(args.bundle, null, 2), 'utf8')
  await writeFile(args.markdownPath, renderSemanticRecipeBundle(args.bundle), 'utf8')
}

export async function readSemanticRecipeBundle(path: string): Promise<SemanticRecipeBundle> {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content) as SemanticRecipeBundle
}

export async function semanticRecipeBundleExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

export function semanticRecipesJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipes.json')
}

export function semanticRecipesMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipes.md')
}

export function semanticRecipesDraftJsonPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipes-draft.json')
}

export function semanticRecipesDraftMarkdownPath(runOutputDir: string): string {
  return resolve(runOutputDir, 'agent-workspace', 'semantic-recipes-draft.md')
}

export function renderSemanticRecipeBundle(bundle: SemanticRecipeBundle): string {
  return `# Semantic Construction Recipes

Generated: ${bundle.generatedAt}
Product family: ${bundle.productFamily}
Implementation group: ${bundle.implementationGroup}

${bundle.recipes.map(renderRecipe).join('\n\n')}
`
}

export function renderDraftSemanticRecipeRequirements(requirements: DraftSemanticRecipeRequirements): string {
  return `# Draft Semantic Recipe Requirements

Recipe id: ${requirements.recipeId}
Required class count: ${requirements.requiredClasses.length}

## Required Classes

${requirements.requiredClasses.map(className => `- ${className}`).join('\n')}

## Steps

${requirements.steps.map(renderDraftStep).join('\n\n')}
`
}

function buildFxSingleLegTradeStateRecipe(
  contract: ApprovedCdmApiContract,
  productFamily: string,
  implementationGroup: string
): CdmConstructionRecipe {
  const selection = selectionFromContract(contract, productFamily, implementationGroup)
  const requirements = buildFxSingleLegDraftRecipeRequirements(selection)
  const forbidden = contract.forbiddenClasses.map(item => item.className)
  return {
    id: requirements.recipeId,
    title: 'Build FX single-leg TradeState',
    productFamily,
    implementationGroup,
    rootOutputClass: requireApproved(contract, 'cdm.event.common.TradeState'),
    authority: ['rosetta-source', 'cookbook', 'generated-recipe'],
    steps: requirements.steps.map(step => ({
      order: step.order,
      action: step.action,
      core: step.core,
      approvedClasses: approvedExisting(contract, step.classNames),
      requiredBuilderIntents: step.requiredBuilderIntents,
      approvedBuilderMethods: methodsFor(contract, step.classNames, step.requiredBuilderIntents),
      rosettaFunctions: step.rosettaFunctions,
      notes: step.notes,
    })),
    forbiddenClasses: forbidden,
    examples: [
      {
        title: 'Minimal TradeState build-wiring example',
        fixtureKind: 'build-wiring',
        code: [
          'Trade trade = Trade.builder().build();',
          'TradeState tradeState = TradeState.builder().setTrade(trade).build();',
        ].join('\n'),
        compiles: true,
        source: 'generated-recipe',
      },
    ],
  }
}

function assertRecipeContractAlignment(recipe: CdmConstructionRecipe, contract: ApprovedCdmApiContract): void {
  const approved = new Set(contract.approvedClasses.map(item => item.className))
  const approvedMethods = new Set(contract.approvedBuilderMethods.map(methodKey))
  for (const step of recipe.steps) {
    for (const className of step.approvedClasses) {
      if (!approved.has(className)) {
        throw new Error(`Recipe ${recipe.id} references class outside approved contract: ${className}`)
      }
    }
    for (const method of step.approvedBuilderMethods) {
      if (!approvedMethods.has(methodKey(method))) {
        throw new Error(`Recipe ${recipe.id} references method outside approved contract: ${method.className}.${method.methodName}`)
      }
    }
  }
}

function assertCoreStepsHaveMethods(recipe: CdmConstructionRecipe): void {
  for (const step of recipe.steps) {
    if (step.core && step.approvedBuilderMethods.length === 0) {
      throw new Error(`Core recipe step ${step.order} has no verified builder methods`)
    }
  }
}

function requireApproved(contract: ApprovedCdmApiContract, className: string): string {
  if (contract.approvedClasses.some(item => item.className === className)) return className
  throw new Error(`Required recipe class is not approved: ${className}`)
}

function approvedExisting(contract: ApprovedCdmApiContract, classNames: string[]): string[] {
  const approved = new Set(contract.approvedClasses.map(item => item.className))
  return classNames.filter(className => className !== '' && approved.has(className))
}

function selectedClassForConcept(selection: CdmApiSelection, conceptName: string, fallback: string): string {
  const selected = selection.selectedClasses.find(item => item.evidence.some(evidence => evidence === `concept:${conceptName}`))
  return selected?.className ?? fallback
}

function selectionFromContract(
  contract: ApprovedCdmApiContract,
  productFamily: string,
  implementationGroup: string
): CdmApiSelection {
  return {
    generatedAt: contract.generatedAt,
    productFamily,
    implementationGroup,
    pass: 'pass2',
    candidateClassCount: contract.approvedClasses.length,
    rejectedClasses: contract.forbiddenClasses,
    selectedClasses: contract.approvedClasses.map(item => ({
      className: item.className,
      selectedInPass: 'pass2',
      reason: 'draft-recipe-required',
      evidence: evidenceFromReason(item.reason),
      requiredByRecipeIds: [],
    })),
  }
}

function evidenceFromReason(reason: string): string[] {
  const conceptMatch = /concept:([^.;]+)/u.exec(reason)
  if (conceptMatch?.[1] !== undefined) return [`concept:${conceptMatch[1]}`]
  return [reason]
}

function methodsFor(
  contract: ApprovedCdmApiContract,
  classNames: string[],
  intents: FxBuilderMethodIntent[]
): ApprovedBuilderMethod[] {
  const classSet = new Set(classNames)
  return contract.approvedBuilderMethods
    .filter(method => classSet.has(method.className))
    .filter(method => intents.includes(method.intent))
    .slice(0, 60)
}

function methodKey(method: ApprovedBuilderMethod): string {
  return `${method.className}.${method.methodName}:${method.rawSignature}`
}

function uniqueStrings(items: string[]): string[] {
  return [...new Set(items)].sort()
}

function renderRecipe(recipe: CdmConstructionRecipe): string {
  return `## ${recipe.title}

Recipe id: ${recipe.id}
Root output class: ${recipe.rootOutputClass}
Semantic authority: ${renderAuthorities(recipe.authority)}

### Steps

${recipe.steps.map(renderStep).join('\n\n')}

### Forbidden Classes

${recipe.forbiddenClasses.length === 0 ? '- none' : recipe.forbiddenClasses.map(className => `- ${className}`).join('\n')}

### Examples

${recipe.examples.map(renderExample).join('\n\n')}
`
}

function renderStep(step: CdmConstructionRecipeStep): string {
  return `#### ${step.order}. ${step.action}

Core step: ${step.core ? 'yes' : 'no'}

Approved classes:
${step.approvedClasses.length === 0 ? '- none' : step.approvedClasses.map(className => `- ${className}`).join('\n')}

Required builder intents:
${step.requiredBuilderIntents.map(intent => `- ${intent}`).join('\n')}

Approved builder methods:
${step.approvedBuilderMethods.length === 0 ? '- none' : step.approvedBuilderMethods.map(renderBuilderMethod).join('\n')}

Rosetta functions:
${step.rosettaFunctions.map(name => `- ${name}`).join('\n')}

Notes:
${step.notes.length === 0 ? '- none' : step.notes.map(note => `- ${note}`).join('\n')}`
}

function renderBuilderMethod(method: ApprovedBuilderMethod): string {
  const parameters = method.parameterTypes.length === 0 ? 'none' : method.parameterTypes.join(', ')
  return `- ${method.className}.${method.methodName} [${method.intent}] params=${parameters}`
}

function renderExample(example: CdmConstructionRecipeExample): string {
  return `#### ${example.title}

Fixture kind: ${example.fixtureKind}
Source: ${example.source}
Compile checked: ${example.compiles ? 'yes' : 'no'}

\`\`\`java
${example.code}
\`\`\``
}

function renderDraftStep(step: DraftRecipeStepRequirement): string {
  return `### ${step.order}. ${step.action}

Core step: ${step.core ? 'yes' : 'no'}
Classes:
${step.classNames.map(className => `- ${className}`).join('\n')}
Builder intents:
${step.requiredBuilderIntents.map(intent => `- ${intent}`).join('\n')}`
}
