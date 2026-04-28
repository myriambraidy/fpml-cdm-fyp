import { mkdir, readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import {
  extractBlocksFromFiles,
  splitBlocksByKind,
  type RosettaExtractionDiagnostics,
  type RosettaSourceBlock,
} from './block-extractor'
import type {
  RosettaProductFamily,
  RosettaSourceFileIndexEntry,
  RosettaSourceIndexManifest,
} from './indexer'

export type RosettaDocpackOptions = {
  snapshotDir: string
  dryRun: boolean
}

export type RosettaExtractionManifest = {
  generatedAt: string
  snapshotDirectory: string
  sourceIndexPath: string
  sourceIndexGeneratedAt?: string
  totalFilesRead: number
  totalBlocks: number
  functionCount: number
  typeCount: number
  enumCount: number
  outputFiles: string[]
  extractorVersion: 1
}

export type RosettaDocpackResult = {
  snapshotDirectory: string
  extractedOutputDirectory: string
  docsOutputDirectory: string
  extractionManifest: RosettaExtractionManifest
  diagnostics: RosettaExtractionDiagnostics
  blocks: RosettaSourceBlock[]
  functions: RosettaSourceBlock[]
  types: RosettaSourceBlock[]
  enums: RosettaSourceBlock[]
  docs: Array<{ relativePath: string; content: string }>
}

const PRODUCT_FAMILIES: RosettaProductFamily[] = [
  'fx',
  'rates',
  'credit',
  'commodity',
  'equity',
]

export function parseDocpackArgs(argv: string[]): RosettaDocpackOptions {
  const options: RosettaDocpackOptions = {
    snapshotDir: 'data/rosetta-source/latest',
    dryRun: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]
    if (arg === '--snapshot' && next) {
      options.snapshotDir = next
      i += 1
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
    }
  }

  return options
}

export async function buildRosettaDocpacks(args: {
  options: RosettaDocpackOptions
  now?: Date
}): Promise<RosettaDocpackResult> {
  const snapshotDirectory = path.resolve(args.options.snapshotDir)
  const generatedAt = args.now?.toISOString() ?? new Date().toISOString()
  const filesIndexPath = path.join(snapshotDirectory, 'index', 'files.json')
  const indexManifestPath = path.join(snapshotDirectory, 'index', 'index-manifest.json')
  const files = JSON.parse(
    await readFile(filesIndexPath, 'utf8')
  ) as RosettaSourceFileIndexEntry[]
  const indexManifest = JSON.parse(
    await readFile(indexManifestPath, 'utf8')
  ) as RosettaSourceIndexManifest
  const extraction = await extractBlocksFromFiles({
    snapshotDirectory,
    files,
    generatedAt,
  })
  const split = splitBlocksByKind(extraction.blocks)
  const extractedOutputDirectory = path.join(snapshotDirectory, 'extracted')
  const docsOutputDirectory = path.join(snapshotDirectory, 'docs')
  const extractionManifest: RosettaExtractionManifest = {
    generatedAt,
    snapshotDirectory,
    sourceIndexPath: filesIndexPath,
    sourceIndexGeneratedAt: indexManifest.generatedAt,
    totalFilesRead: extraction.diagnostics.filesRead,
    totalBlocks: extraction.blocks.length,
    functionCount: split.functions.length,
    typeCount: split.types.length,
    enumCount: split.enums.length,
    outputFiles: [
      'extraction-manifest.json',
      'blocks.json',
      'functions.json',
      'types.json',
      'enums.json',
      'diagnostics.json',
    ],
    extractorVersion: 1,
  }
  const docs = renderDocumentationPacks({
    blocks: extraction.blocks,
    manifest: extractionManifest,
  })

  if (!args.options.dryRun) {
    await mkdir(extractedOutputDirectory, { recursive: true })
    await writeJson(path.join(extractedOutputDirectory, 'extraction-manifest.json'), extractionManifest)
    await writeJson(path.join(extractedOutputDirectory, 'blocks.json'), extraction.blocks)
    await writeJson(path.join(extractedOutputDirectory, 'functions.json'), split.functions)
    await writeJson(path.join(extractedOutputDirectory, 'types.json'), split.types)
    await writeJson(path.join(extractedOutputDirectory, 'enums.json'), split.enums)
    await writeJson(path.join(extractedOutputDirectory, 'diagnostics.json'), extraction.diagnostics)

    for (const doc of docs) {
      const outputPath = path.join(docsOutputDirectory, doc.relativePath)
      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(outputPath, doc.content, 'utf8')
    }
  }

  return {
    snapshotDirectory,
    extractedOutputDirectory,
    docsOutputDirectory,
    extractionManifest,
    diagnostics: extraction.diagnostics,
    blocks: extraction.blocks,
    functions: split.functions,
    types: split.types,
    enums: split.enums,
    docs,
  }
}

export function selectBlocksForFamily(args: {
  family: RosettaProductFamily
  blocks: RosettaSourceBlock[]
}): RosettaSourceBlock[] {
  return sortBlocks(
    args.blocks.filter(block => block.inferredProductFamily === args.family)
  )
}

export function selectSharedIngestBlocks(blocks: RosettaSourceBlock[]): RosettaSourceBlock[] {
  return sortBlocks(
    blocks.filter(block => {
      const name = block.fileName.toLowerCase()
      return (
        block.category === 'fpml-ingest' &&
        /(tradestate|party|payment|pricequantity|datetime|settlement|common|header|message)/.test(name)
      )
    })
  )
}

export function renderDocumentationPacks(args: {
  blocks: RosettaSourceBlock[]
  manifest: RosettaExtractionManifest
}): Array<{ relativePath: string; content: string }> {
  const sharedBlocks = selectSharedIngestBlocks(args.blocks)
  const docs: Array<{ relativePath: string; content: string }> = [
    {
      relativePath: 'index.md',
      content: renderDocsIndex({
        manifest: args.manifest,
        sharedBlockCount: sharedBlocks.length,
        productCounts: Object.fromEntries(
          PRODUCT_FAMILIES.map(family => [
            family,
            selectBlocksForFamily({ family, blocks: args.blocks }).length,
          ])
        ),
      }),
    },
    {
      relativePath: 'shared-ingest.md',
      content: renderPackMarkdown({
        title: 'Rosetta Pack: Shared FpML Ingest',
        purpose:
          'Use this pack to find shared Rosetta context for trade state, party, payment, price/quantity, datetime, and settlement handling.',
        blocks: sharedBlocks,
        sharedDependencyNote: undefined,
        blocksJsonReference: '../extracted/blocks.json',
      }),
    },
  ]

  for (const family of PRODUCT_FAMILIES) {
    const blocks = selectBlocksForFamily({ family, blocks: args.blocks })
    docs.push({
      relativePath: `product-families/${family}.md`,
      content: renderPackMarkdown({
        title: `Rosetta Pack: ${labelFamily(family)}`,
        purpose: `Use this pack to find Rosetta context for ${labelFamily(family)} FpML ingestion and model support.`,
        blocks,
        sharedDependencyNote: 'Also read `../shared-ingest.md` for party, payment, date, settlement, and price/quantity context.',
        blocksJsonReference: '../../extracted/blocks.json',
      }),
    })
  }

  return docs
}

export function renderPackMarkdown(args: {
  title: string
  purpose: string
  blocks: RosettaSourceBlock[]
  sharedDependencyNote?: string
  blocksJsonReference: string
}): string {
  const files = unique(args.blocks.map(block => block.sourcePath)).sort()
  return [
    `# ${args.title}`,
    '',
    '## Purpose',
    '',
    args.purpose,
    '',
    '## Relevant Raw Files',
    '',
    files.length === 0 ? '- No blocks selected for this pack.' : files.map(file => `- \`${file}\``).join('\n'),
    '',
    '## Important Blocks',
    '',
    renderBlockTable(args.blocks),
    '',
    args.sharedDependencyNote ? '## Shared Dependencies' : undefined,
    args.sharedDependencyNote ? '' : undefined,
    args.sharedDependencyNote,
    args.sharedDependencyNote ? '' : undefined,
    '## Next Step',
    '',
    `Inspect these block references before extracting cookbook rules. Full raw block text is stored in \`${args.blocksJsonReference}\`.`,
    '',
  ]
    .filter((line): line is string => line !== undefined)
    .join('\n')
}

function renderDocsIndex(args: {
  manifest: RosettaExtractionManifest
  sharedBlockCount: number
  productCounts: Record<string, number>
}): string {
  return [
    '# Rosetta Documentation Packs',
    '',
    '## Purpose',
    '',
    'Use these packs to select Rosetta context for future cookbook and Java-generator agents without loading every raw Rosetta file.',
    '',
    '## Source Snapshot',
    '',
    `- Snapshot directory: \`${args.manifest.snapshotDirectory}\``,
    `- Source index: \`${args.manifest.sourceIndexPath}\``,
    `- Total blocks: ${args.manifest.totalBlocks}`,
    `- Functions: ${args.manifest.functionCount}`,
    `- Types: ${args.manifest.typeCount}`,
    `- Enums: ${args.manifest.enumCount}`,
    '',
    '## Packs',
    '',
    `- [Shared ingest](shared-ingest.md): ${args.sharedBlockCount} blocks`,
    ...PRODUCT_FAMILIES.map(
      family =>
        `- [${labelFamily(family)}](product-families/${family}.md): ${args.productCounts[family] ?? 0} blocks`
    ),
    '',
    '## How To Use',
    '',
    'For a product-family task, read the relevant product-family pack, then read `shared-ingest.md`, then retrieve exact raw block text from `../extracted/blocks.json` when needed.',
    '',
    '## Scope Boundary',
    '',
    'These packs do not extract final mapping rules and do not generate Java.',
    '',
  ].join('\n')
}

function renderBlockTable(blocks: RosettaSourceBlock[]): string {
  if (blocks.length === 0) return 'No blocks selected.'
  const rows = ['| Kind | Name | Source | Lines |', '|---|---|---|---:|']
  for (const block of blocks.slice(0, 80)) {
    rows.push(
      `| \`${block.kind}\` | \`${block.name}\` | \`${block.sourcePath}\` | ${block.startLine}-${block.endLine} |`
    )
  }
  if (blocks.length > 80) {
    rows.push(`| ... | ${blocks.length - 80} additional blocks omitted from markdown | See extracted JSON | ... |`)
  }
  return rows.join('\n')
}

function sortBlocks(blocks: RosettaSourceBlock[]): RosettaSourceBlock[] {
  return [...blocks].sort((a, b) => {
    const sourceCompare = a.sourcePath.localeCompare(b.sourcePath)
    if (sourceCompare !== 0) return sourceCompare
    return a.startLine - b.startLine
  })
}

function labelFamily(family: RosettaProductFamily): string {
  if (family === 'fx') return 'FX'
  if (family === 'rates') return 'Rates'
  if (family === 'credit') return 'Credit'
  if (family === 'commodity') return 'Commodity'
  if (family === 'equity') return 'Equity'
  return family
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

async function writeJson(filePath: string, value: object | object[]): Promise<void> {
  await writeFile(filePath, JSON.stringify(value, null, 2), 'utf8')
}
