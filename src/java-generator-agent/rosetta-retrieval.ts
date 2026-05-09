import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

export type RosettaBlockKind = 'func' | 'type' | 'enum'

export type RosettaBlock = {
  id: string
  kind: RosettaBlockKind
  name: string
  sourcePath: string
  localPath: string
  fileName: string
  startLine: number
  endLine: number
  lineCount: number
  category: string
  inferredProductFamily: string
  rawText: string
  headerLine: string
}

export type RosettaMappingArea =
  | 'product-root'
  | 'economic-terms'
  | 'settlement-payout'
  | 'price-quantity'
  | 'party-counterparty'
  | 'account-party-reference'
  | 'product-identifiers-taxonomy'
  | 'dates-settlement'

export type RosettaRetrievalResult = {
  ok: boolean
  blocks: RosettaBlock[]
  missingFunctionNames: string[]
  sourcePaths: string[]
  diagnostics: string[]
}

export const ROSETTA_SOURCE_ROOT = 'data/rosetta-source/latest'
export const ROSETTA_BLOCKS_PATH = `${ROSETTA_SOURCE_ROOT}/extracted/blocks.json`
export const ROSETTA_FUNCTIONS_PATH = `${ROSETTA_SOURCE_ROOT}/extracted/functions.json`
export const ROSETTA_FX_PACK_PATH = `${ROSETTA_SOURCE_ROOT}/docs/product-families/fx.md`
export const ROSETTA_SHARED_INGEST_PACK_PATH = `${ROSETTA_SOURCE_ROOT}/docs/shared-ingest.md`

export const FX_SINGLE_LEG_ROSETTA_AREAS: Record<RosettaMappingArea, string[]> = {
  'product-root': [
    'MapFxSingleLegNonTransferableProduct',
    'MapProductIdentifierList',
    'MapProductTaxonomyList',
  ],
  'economic-terms': [
    'MapFxSingleLegEconomicTerms',
  ],
  'settlement-payout': [
    'MapFxCoreDetailsModelToSettlementPayout',
  ],
  'price-quantity': [
    'MapFxSingleLegPriceQuantityList',
    'MapFxCoreDetailsModelPriceListWithLocation',
    'MapFxCoreDetailsModelQuantityListWithLocation',
  ],
  'party-counterparty': [
    'MapFxSingleLegCounterpartyList',
    'MapFxSingleLegAncillaryPartyList',
  ],
  'account-party-reference': [
    'MapFxSingleLegAccountPartyReference',
    'MapPayerReceiverToAccountPartyReference',
  ],
  'product-identifiers-taxonomy': [
    'MapProductIdentifierList',
    'MapProductIdentifier',
    'MapProductTaxonomyList',
  ],
  'dates-settlement': [
    'MapFxCoreDetailsModelToSettlementPayout',
    'MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate',
  ],
}

export async function readRosettaBlocks(): Promise<RosettaBlock[]> {
  return JSON.parse(await readFile(resolve(ROSETTA_BLOCKS_PATH), 'utf8')) as RosettaBlock[]
}

export async function rosettaProductPackExists(productFamily: string): Promise<boolean> {
  if (productFamily !== 'fx-derivatives') return false
  return exists(resolve(ROSETTA_FX_PACK_PATH))
}

export async function sharedIngestPackExists(): Promise<boolean> {
  return exists(resolve(ROSETTA_SHARED_INGEST_PACK_PATH))
}

export async function getRosettaProductPack(productFamily: string): Promise<RosettaRetrievalResult> {
  if (productFamily !== 'fx-derivatives') {
    return retrievalFailure(`Unsupported Rosetta product pack: ${productFamily}`, [ROSETTA_SOURCE_ROOT])
  }
  const paths = [resolve(ROSETTA_FX_PACK_PATH), resolve(ROSETTA_SHARED_INGEST_PACK_PATH)]
  const missing: string[] = []
  for (const path of paths) {
    if (!(await exists(path))) missing.push(path)
  }
  if (missing.length > 0) {
    return {
      ok: false,
      blocks: [],
      missingFunctionNames: [],
      sourcePaths: paths,
      diagnostics: missing.map(path => `Missing Rosetta pack: ${path}`),
    }
  }
  return {
    ok: true,
    blocks: [],
    missingFunctionNames: [],
    sourcePaths: paths,
    diagnostics: ['Rosetta product-family and shared ingest packs are available.'],
  }
}

export async function getRosettaFunction(functionName: string): Promise<RosettaRetrievalResult> {
  return getRosettaFunctions([functionName])
}

export async function getRosettaFunctions(functionNames: string[]): Promise<RosettaRetrievalResult> {
  const blocks = await readRosettaBlocks()
  const resolved: RosettaBlock[] = []
  const missingFunctionNames: string[] = []
  for (const functionName of uniqueStrings(functionNames)) {
    const block = blocks.find(item => item.kind === 'func' && item.name === functionName)
    if (block === undefined) {
      missingFunctionNames.push(functionName)
    } else {
      resolved.push(block)
    }
  }
  return {
    ok: missingFunctionNames.length === 0,
    blocks: resolved,
    missingFunctionNames,
    sourcePaths: sourcePathsForBlocks(resolved, [resolve(ROSETTA_BLOCKS_PATH)]),
    diagnostics: [
      ...resolved.map(block => `Resolved Rosetta function ${block.name} from ${block.sourcePath}:${block.startLine}-${block.endLine}.`),
      ...missingFunctionNames.map(name => `Missing Rosetta function: ${name}`),
      'Rosetta source is mapping-intent authority, not Java API authority.',
    ],
  }
}

export async function searchRosettaBlocks(args: {
  query: string
  productFamily: string
  limit?: number
}): Promise<RosettaRetrievalResult> {
  const blocks = await readRosettaBlocks()
  const normalized = args.query.toLowerCase()
  const limit = args.limit ?? 20
  const family = args.productFamily === 'fx-derivatives' ? 'fx' : args.productFamily
  const matches = blocks
    .filter(block =>
      (block.inferredProductFamily === family || block.inferredProductFamily === 'common')
        && (block.name.toLowerCase().includes(normalized) || block.rawText.toLowerCase().includes(normalized))
    )
    .slice(0, limit)
  return {
    ok: true,
    blocks: matches,
    missingFunctionNames: [],
    sourcePaths: sourcePathsForBlocks(matches, [resolve(ROSETTA_BLOCKS_PATH)]),
    diagnostics: [
      matches.length === 0 ? `No Rosetta blocks matched query: ${args.query}` : `Matched ${matches.length} Rosetta block(s).`,
      'Rosetta source is mapping-intent authority, not Java API authority.',
    ],
  }
}

export async function getRosettaMappingArea(args: {
  productFamily: string
  implementationGroup: string
  area: RosettaMappingArea
}): Promise<RosettaRetrievalResult> {
  if (args.productFamily !== 'fx-derivatives' || args.implementationGroup !== 'fx-single-leg') {
    return retrievalFailure(
      `Unsupported Rosetta mapping area scope: ${args.productFamily}/${args.implementationGroup}`,
      [ROSETTA_BLOCKS_PATH]
    )
  }
  return getRosettaFunctions(FX_SINGLE_LEG_ROSETTA_AREAS[args.area])
}

export function renderRosettaRetrievalResult(result: RosettaRetrievalResult): string {
  const diagnostics = result.diagnostics.length === 0
    ? '- none'
    : result.diagnostics.map(item => `- ${item}`).join('\n')
  const blocks = result.blocks.length === 0
    ? '- none'
    : result.blocks.map(renderRosettaBlock).join('\n\n')
  const missing = result.missingFunctionNames.length === 0
    ? '- none'
    : result.missingFunctionNames.map(name => `- ${name}`).join('\n')
  return `# Rosetta Retrieval Result

Status: ${result.ok ? 'passed' : 'failed'}

## Diagnostics

${diagnostics}

## Missing Functions

${missing}

## Blocks

${blocks}
`
}

export function requiredRosettaAreasForScope(args: {
  productFamily: string
  implementationGroup: string
}): Record<RosettaMappingArea, string[]> {
  if (args.productFamily === 'fx-derivatives' && args.implementationGroup === 'fx-single-leg') {
    return FX_SINGLE_LEG_ROSETTA_AREAS
  }
  return FX_SINGLE_LEG_ROSETTA_AREAS
}

function renderRosettaBlock(block: RosettaBlock): string {
  return `### ${block.name}

- Block id: ${block.id}
- Source: ${block.sourcePath}:${block.startLine}-${block.endLine}

\`\`\`rosetta
${block.rawText}
\`\`\``
}

function retrievalFailure(message: string, sourcePaths: string[]): RosettaRetrievalResult {
  return {
    ok: false,
    blocks: [],
    missingFunctionNames: [],
    sourcePaths: sourcePaths.map(path => resolve(path)),
    diagnostics: [message],
  }
}

function sourcePathsForBlocks(blocks: RosettaBlock[], fallback: string[]): string[] {
  const sourcePaths = blocks.map(block => resolve(ROSETTA_SOURCE_ROOT, block.localPath))
  return uniqueStrings([...fallback, ...sourcePaths])
}

function uniqueStrings(items: string[]): string[] {
  return [...new Set(items)].sort()
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
