import { readFile } from 'node:fs/promises'

export type RosettaFunctionSnippet = {
  name: string
  sourcePath: string
  startLine: number
  endLine: number
  rawText: string
  calledFunctions: string[]
}

export type RosettaGenerationContext = {
  productFamily: 'fx-derivatives'
  implementationGroup: 'fx-single-leg'
  authority: 'rosetta-outranks-cookbook'
  requiredFunctions: RosettaFunctionSnippet[]
  sharedFunctions: RosettaFunctionSnippet[]
  unresolvedFunctions: string[]
}

type RosettaBlock = {
  kind: string
  name: string
  sourcePath: string
  startLine: number
  endLine: number
  rawText: string
}

const BLOCKS_PATH = 'data/rosetta-source/latest/extracted/blocks.json'

const REQUIRED_FX_SINGLE_LEG_FUNCTIONS = [
  'MapFxSingleLegCounterpartyList',
  'MapFxSingleLegAncillaryPartyList',
  'MapFxSingleLegNonTransferableProduct',
  'MapFxSingleLegEconomicTerms',
  'MapFxCoreDetailsModelToSettlementPayout',
  'MapFxSingleLegPriceQuantityList',
  'MapFxSingleLegAccountPartyReference',
]

const SHARED_FUNCTIONS = [
  'MapPayerReceiverModelToCounterpartyList',
  'MapPayerReceiver',
  'MapFxCoreDetailsModelQuantityWithAddress',
  'MapFxCoreDetailsModelPriceWithAddress',
  'MapFxCashSettlementToSettlementTerms',
  'MapCurrencyToObservableCashWithAddress',
  'MapFxCoreDetailsModelPriceQuantityList',
  'MapPayerReceiverToAccountPartyReference',
  'MapProductIdentifierList',
  'MapProductTaxonomyList',
  'MapCurrency',
  'MapMoney',
  'MapFxRate',
  'MapQuotedCurrencyPair',
  'MapDateToAdjustableDate',
]

const FUNCTION_CALL_PATTERN = /\b([A-Z][A-Za-z0-9_]*)\s*\(/gu

export async function buildRosettaGenerationContext(): Promise<RosettaGenerationContext> {
  const blocks = await readRosettaBlocks()
  const requiredFunctions = snippetsForNames(blocks, REQUIRED_FX_SINGLE_LEG_FUNCTIONS)
  const sharedFunctions = snippetsForNames(blocks, SHARED_FUNCTIONS)
  const availableNames = new Set([...requiredFunctions, ...sharedFunctions].map(snippet => snippet.name))
  const allCalls = new Set(
    [...requiredFunctions, ...sharedFunctions].flatMap(snippet => snippet.calledFunctions)
  )
  const requestedNames = new Set([...REQUIRED_FX_SINGLE_LEG_FUNCTIONS, ...SHARED_FUNCTIONS])
  const unresolvedFunctions = [...allCalls]
    .filter(name => !availableNames.has(name) && !requestedNames.has(name))
    .sort()

  return {
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
    authority: 'rosetta-outranks-cookbook',
    requiredFunctions,
    sharedFunctions,
    unresolvedFunctions,
  }
}

export function renderRosettaGenerationContext(context: RosettaGenerationContext): string {
  return `# Rosetta Generation Context

Authority: ${context.authority}
Product family: ${context.productFamily}
Implementation group: ${context.implementationGroup}

## Required Rosetta Functions

${context.requiredFunctions.map(renderSnippet).join('\n\n')}

## Shared Helper Functions

${context.sharedFunctions.map(renderSnippet).join('\n\n')}

## Unresolved Helper Functions

${context.unresolvedFunctions.length === 0 ? '- none' : context.unresolvedFunctions.map(name => `- ${name}`).join('\n')}
`
}

export function renderRosettaCallGraph(context: RosettaGenerationContext): string {
  const snippets = [...context.requiredFunctions, ...context.sharedFunctions]
  return `# Rosetta Call Graph

${snippets
  .map(
    snippet => `## ${snippet.name}

${snippet.calledFunctions.length === 0 ? '- no detected function calls' : snippet.calledFunctions.map(call => `- ${call}`).join('\n')}`
  )
  .join('\n\n')}
`
}

async function readRosettaBlocks(): Promise<RosettaBlock[]> {
  const content = await readFile(BLOCKS_PATH, 'utf8')
  return JSON.parse(content) as RosettaBlock[]
}

function snippetsForNames(blocks: RosettaBlock[], names: string[]): RosettaFunctionSnippet[] {
  return names.map(name => snippetForName(blocks, name))
}

function snippetForName(blocks: RosettaBlock[], name: string): RosettaFunctionSnippet {
  const block = blocks.find(candidate => candidate.kind === 'func' && candidate.name === name)
  if (block === undefined) {
    return {
      name,
      sourcePath: 'missing',
      startLine: 0,
      endLine: 0,
      rawText: `func ${name}: MISSING FROM ${BLOCKS_PATH}`,
      calledFunctions: [],
    }
  }
  return {
    name: block.name,
    sourcePath: block.sourcePath,
    startLine: block.startLine,
    endLine: block.endLine,
    rawText: block.rawText,
    calledFunctions: extractCalledFunctions(block.rawText, name),
  }
}

function extractCalledFunctions(rawText: string, selfName: string): string[] {
  const calls = new Set<string>()
  for (const match of rawText.matchAll(FUNCTION_CALL_PATTERN)) {
    const name = match[1]
    if (name !== undefined && name !== selfName) calls.add(name)
  }
  return [...calls].sort()
}

function renderSnippet(snippet: RosettaFunctionSnippet): string {
  return `### ${snippet.name}

Source: ${snippet.sourcePath}:${snippet.startLine}-${snippet.endLine}

\`\`\`rosetta
${snippet.rawText}
\`\`\`

Calls:
${snippet.calledFunctions.length === 0 ? '- none detected' : snippet.calledFunctions.map(name => `- ${name}`).join('\n')}
`
}
