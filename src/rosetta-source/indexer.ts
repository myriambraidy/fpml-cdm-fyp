import { mkdir, readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'
import type { RosettaSourceManifest, RosettaSourceManifestFile } from './fetch'

export type RosettaFileCategory =
  | 'fpml-ingest'
  | 'mapping-synonym'
  | 'base-model'
  | 'product-model'
  | 'event-model'
  | 'observable-model'
  | 'legal-documentation'
  | 'margin'
  | 'regulation'
  | 'dictionary'
  | 'other'

export type RosettaFileKind =
  | 'function'
  | 'type'
  | 'enum'
  | 'description'
  | 'synonym'
  | 'dictionary'
  | 'mixed'
  | 'unknown'

export type RosettaProductFamily =
  | 'fx'
  | 'rates'
  | 'credit'
  | 'commodity'
  | 'equity'
  | 'legal'
  | 'common'
  | 'other'

export type RosettaRelevanceConfidence = 'high' | 'medium' | 'low' | 'none'

export type RosettaSourceFileIndexEntry = {
  sourcePath: string
  localPath: string
  fileName: string
  extension: '.rosetta' | '.txt'
  category: RosettaFileCategory
  kind: RosettaFileKind
  inferredProductFamily: RosettaProductFamily | null
  byteSize?: number
  lineCount: number
  functionCount: number
  typeCount: number
  enumCount: number
  conditionCount: number
  hasFpmlReference: boolean
  hasIngestReference: boolean
  hasQualificationReference: boolean
  likelyRelevantToFpmlMapping: boolean
  relevanceConfidence: RosettaRelevanceConfidence
  relevanceReasons: string[]
}

export type RosettaCategorySummary = {
  generatedAt: string
  sourceManifestPath: string
  totalFiles: number
  categories: Record<string, number>
  kinds: Record<string, number>
  productFamilies: Record<string, number>
  fpmlRelevantCount: number
  topFpmlRelevantFiles: Array<{
    sourcePath: string
    category: RosettaFileCategory
    inferredProductFamily: RosettaProductFamily | null
    relevanceReasons: string[]
  }>
}

export type RosettaFpmlIngestIndex = {
  generatedAt: string
  files: RosettaSourceFileIndexEntry[]
  directIngestFiles: RosettaSourceFileIndexEntry[]
  supportingSharedFiles: RosettaSourceFileIndexEntry[]
  productSpecificFiles: RosettaSourceFileIndexEntry[]
  uncertainFiles: RosettaSourceFileIndexEntry[]
}

export type RosettaSourceIndexManifest = {
  generatedAt: string
  snapshotDirectory: string
  sourceManifestPath: string
  sourceManifestGeneratedAt: string
  sourceRepo: string
  sourceBranch: string
  sourceTreeSha: string
  indexedFileCount: number
  outputFiles: string[]
  indexerVersion: 1
}

export type RosettaSourceIndexResult = {
  outputDirectory: string
  indexManifest: RosettaSourceIndexManifest
  files: RosettaSourceFileIndexEntry[]
  categories: RosettaCategorySummary
  fpmlIngest: RosettaFpmlIngestIndex
  summaryMarkdown: string
}

export type IndexRosettaSourceOptions = {
  snapshotDir: string
  dryRun: boolean
}

export function parseIndexArgs(argv: string[]): IndexRosettaSourceOptions {
  const options: IndexRosettaSourceOptions = {
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

export function inferCategory(fileName: string): RosettaFileCategory {
  const lower = fileName.toLowerCase()
  if (fileName === 'RosettaDictionary.txt') return 'dictionary'
  if (lower.startsWith('ingest-fpml-confirmation-')) return 'fpml-ingest'
  if (lower.startsWith('mapping-') && lower.endsWith('-synonym.rosetta')) {
    return 'mapping-synonym'
  }
  if (lower.startsWith('base-')) return 'base-model'
  if (lower.startsWith('product-')) return 'product-model'
  if (lower.startsWith('event-')) return 'event-model'
  if (lower.startsWith('observable-')) return 'observable-model'
  if (lower.startsWith('legaldocumentation-')) return 'legal-documentation'
  if (lower.startsWith('margin-')) return 'margin'
  if (lower.startsWith('regulation-')) return 'regulation'
  return 'other'
}

export function inferKind(fileName: string): RosettaFileKind {
  const lower = fileName.toLowerCase()
  if (fileName === 'RosettaDictionary.txt') return 'dictionary'
  if (lower.startsWith('mapping-') && lower.endsWith('-synonym.rosetta')) return 'synonym'
  if (lower.endsWith('-func.rosetta')) return 'function'
  if (lower.endsWith('-type.rosetta')) return 'type'
  if (lower.endsWith('-enum.rosetta')) return 'enum'
  if (lower.endsWith('-desc.rosetta')) return 'description'
  return 'unknown'
}

export function inferProductFamily(fileName: string): RosettaProductFamily | null {
  const lower = fileName.toLowerCase()
  if (/(fx|fxoption|fxsingleleg|fxswap)/.test(lower)) return 'fx'
  if (/(creditdefaultswap|credit)/.test(lower)) return 'credit'
  if (/commodity/.test(lower)) return 'commodity'
  if (/(equity|dividend|broker)/.test(lower)) return 'equity'
  if (/(legal|legaldocumentation|csa)/.test(lower)) return 'legal'
  if (/(swap|swaption|fra|capfloor|floatingrate|rates)/.test(lower)) return 'rates'
  if (/(base|common|party|payment|pricequantity|tradestate|datetime|settlement|header|message)/.test(lower)) {
    return 'common'
  }
  return null
}

export function countConstructs(content: string): {
  lineCount: number
  functionCount: number
  typeCount: number
  enumCount: number
  conditionCount: number
} {
  const lines = content.length === 0 ? [] : content.split(/\r?\n/)
  return {
    lineCount: lines.length,
    functionCount: lines.filter(line => /^\s*func\s+/.test(line)).length,
    typeCount: lines.filter(line => /^\s*type\s+/.test(line)).length,
    enumCount: lines.filter(line => /^\s*enum\s+/.test(line)).length,
    conditionCount: lines.filter(line => /\b(post-)?condition\b/i.test(line)).length,
  }
}

export function assessFpmlRelevance(args: {
  fileName: string
  category: RosettaFileCategory
  inferredProductFamily: RosettaProductFamily | null
  content: string
}): {
  likelyRelevantToFpmlMapping: boolean
  relevanceConfidence: RosettaRelevanceConfidence
  relevanceReasons: string[]
  hasFpmlReference: boolean
  hasIngestReference: boolean
  hasQualificationReference: boolean
} {
  const lowerName = args.fileName.toLowerCase()
  const lowerContent = args.content.toLowerCase()
  const reasons: string[] = []
  const hasFpmlReference = lowerName.includes('fpml') || lowerContent.includes('fpml')
  const hasIngestReference =
    lowerName.includes('ingest') ||
    lowerContent.includes('[ingest xml]') ||
    lowerContent.includes('ingest xml')
  const hasQualificationReference = /\[qualification\s+product\]/i.test(args.content)

  if (args.category === 'fpml-ingest') {
    reasons.push('file category is fpml-ingest')
  }
  if (lowerName.includes('fpml')) {
    reasons.push('filename contains fpml')
  }
  if (lowerContent.includes('fpml')) {
    reasons.push('content contains fpml')
  }
  if (lowerContent.includes('[ingest xml]') || lowerContent.includes('ingest xml')) {
    reasons.push('content contains ingest XML reference')
  }
  if (lowerContent.includes('confirmation') || lowerName.includes('confirmation')) {
    reasons.push('mentions confirmation')
  }
  if (isSupportingSharedFile(lowerName, args.inferredProductFamily)) {
    reasons.push('shared file likely supports FpML mapping')
  }

  const likelyRelevantToFpmlMapping = reasons.length > 0
  const relevanceConfidence = inferRelevanceConfidence({
    category: args.category,
    lowerName,
    hasFpmlReference,
    hasIngestReference,
    supportingShared: reasons.includes('shared file likely supports FpML mapping'),
  })

  return {
    likelyRelevantToFpmlMapping,
    relevanceConfidence,
    relevanceReasons: unique(reasons),
    hasFpmlReference,
    hasIngestReference,
    hasQualificationReference,
  }
}

export async function indexRosettaSource(args: {
  options: IndexRosettaSourceOptions
  now?: Date
}): Promise<RosettaSourceIndexResult> {
  const snapshotDir = path.resolve(args.options.snapshotDir)
  const generatedAt = args.now?.toISOString() ?? new Date().toISOString()
  const manifestPath = path.join(snapshotDir, 'manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as RosettaSourceManifest
  const entries: RosettaSourceFileIndexEntry[] = []

  for (const file of manifest.files) {
    const localPath = path.resolve(snapshotDir, file.localPath)
    const content = await readFile(localPath, 'utf8')
    entries.push(buildFileIndexEntry({ manifestFile: file, localPath, content }))
  }

  const sortedEntries = entries.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath))
  const categories = buildCategorySummary({
    generatedAt,
    sourceManifestPath: manifestPath,
    files: sortedEntries,
  })
  const fpmlIngest = buildFpmlIngestIndex({ generatedAt, files: sortedEntries })
  const outputDirectory = path.join(snapshotDir, 'index')
  const outputFiles = [
    'index-manifest.json',
    'files.json',
    'categories.json',
    'fpml-ingest-files.json',
    'summary.md',
  ]
  const indexManifest: RosettaSourceIndexManifest = {
    generatedAt,
    snapshotDirectory: snapshotDir,
    sourceManifestPath: manifestPath,
    sourceManifestGeneratedAt: manifest.generatedAt,
    sourceRepo: manifest.repo,
    sourceBranch: manifest.branch,
    sourceTreeSha: manifest.treeSha,
    indexedFileCount: sortedEntries.length,
    outputFiles,
    indexerVersion: 1,
  }
  const summaryMarkdown = renderSummaryMarkdown({
    manifest,
    categories,
    fpmlIngest,
  })

  if (!args.options.dryRun) {
    await mkdir(outputDirectory, { recursive: true })
    await writeJson(path.join(outputDirectory, 'index-manifest.json'), indexManifest)
    await writeJson(path.join(outputDirectory, 'files.json'), sortedEntries)
    await writeJson(path.join(outputDirectory, 'categories.json'), categories)
    await writeJson(path.join(outputDirectory, 'fpml-ingest-files.json'), fpmlIngest)
    await writeFile(path.join(outputDirectory, 'summary.md'), summaryMarkdown, 'utf8')
  }

  return {
    outputDirectory,
    indexManifest,
    files: sortedEntries,
    categories,
    fpmlIngest,
    summaryMarkdown,
  }
}

export function buildFileIndexEntry(args: {
  manifestFile: RosettaSourceManifestFile
  localPath: string
  content: string
}): RosettaSourceFileIndexEntry {
  const fileName = path.posix.basename(args.manifestFile.sourcePath)
  const category = inferCategory(fileName)
  const kind = inferKind(fileName)
  const inferredProductFamily = inferProductFamily(fileName)
  const counts = countConstructs(args.content)
  const relevance = assessFpmlRelevance({
    fileName,
    category,
    inferredProductFamily,
    content: args.content,
  })

  return {
    sourcePath: args.manifestFile.sourcePath,
    localPath: args.manifestFile.localPath,
    fileName,
    extension: args.manifestFile.extension,
    category,
    kind,
    inferredProductFamily,
    byteSize: args.manifestFile.size,
    ...counts,
    ...relevance,
  }
}

export function buildCategorySummary(args: {
  generatedAt: string
  sourceManifestPath: string
  files: RosettaSourceFileIndexEntry[]
}): RosettaCategorySummary {
  const relevant = args.files.filter(file => file.likelyRelevantToFpmlMapping)
  return {
    generatedAt: args.generatedAt,
    sourceManifestPath: args.sourceManifestPath,
    totalFiles: args.files.length,
    categories: countBy(args.files, file => file.category),
    kinds: countBy(args.files, file => file.kind),
    productFamilies: countBy(args.files, file => file.inferredProductFamily ?? 'unclassified'),
    fpmlRelevantCount: relevant.length,
    topFpmlRelevantFiles: sortFpmlRelevantFiles(relevant)
      .slice(0, 25)
      .map(file => ({
        sourcePath: file.sourcePath,
        category: file.category,
        inferredProductFamily: file.inferredProductFamily,
        relevanceReasons: file.relevanceReasons,
      })),
  }
}

export function buildFpmlIngestIndex(args: {
  generatedAt: string
  files: RosettaSourceFileIndexEntry[]
}): RosettaFpmlIngestIndex {
  const files = sortFpmlRelevantFiles(
    args.files.filter(file => file.likelyRelevantToFpmlMapping)
  )
  const directIngestFiles = files.filter(file => file.category === 'fpml-ingest')
  const supportingSharedFiles = files.filter(
    file => file.category !== 'fpml-ingest' && file.inferredProductFamily === 'common'
  )
  const productSpecificFiles = files.filter(
    file =>
      file.category !== 'fpml-ingest' &&
      file.inferredProductFamily != null &&
      file.inferredProductFamily !== 'common'
  )
  const uncertainFiles = files.filter(
    file =>
      file.category !== 'fpml-ingest' &&
      file.inferredProductFamily == null
  )
  return {
    generatedAt: args.generatedAt,
    files,
    directIngestFiles,
    supportingSharedFiles,
    productSpecificFiles,
    uncertainFiles,
  }
}

export function sortFpmlRelevantFiles(
  files: RosettaSourceFileIndexEntry[]
): RosettaSourceFileIndexEntry[] {
  return [...files].sort((a, b) => {
    const priority = fpmlSortPriority(a) - fpmlSortPriority(b)
    if (priority !== 0) return priority
    return a.sourcePath.localeCompare(b.sourcePath)
  })
}

export function renderSummaryMarkdown(args: {
  manifest: RosettaSourceManifest
  categories: RosettaCategorySummary
  fpmlIngest: RosettaFpmlIngestIndex
}): string {
  const firstInspection = args.fpmlIngest.files.slice(0, 12)
  return [
    '# Rosetta Source Index Summary',
    '',
    '## Snapshot',
    '',
    `- Repo: \`${args.manifest.repo}\``,
    `- Branch: \`${args.manifest.branch}\``,
    `- Tree SHA: \`${args.manifest.treeSha}\``,
    `- Source prefix: \`${args.manifest.sourcePrefix}\``,
    `- File count: ${args.categories.totalFiles}`,
    `- Total bytes: ${args.manifest.totalBytes ?? 'unknown'}`,
    '',
    '## Category Counts',
    '',
    renderCountTable(args.categories.categories, 'Category'),
    '',
    '## Kind Counts',
    '',
    renderCountTable(args.categories.kinds, 'Kind'),
    '',
    '## Product-Family Coverage',
    '',
    renderCountTable(args.categories.productFamilies, 'Family'),
    '',
    '## FpML-Relevant Files',
    '',
    `- Total likely relevant files: ${args.categories.fpmlRelevantCount}`,
    `- Direct ingest files: ${args.fpmlIngest.directIngestFiles.length}`,
    `- Supporting shared files: ${args.fpmlIngest.supportingSharedFiles.length}`,
    `- Product-specific supporting files: ${args.fpmlIngest.productSpecificFiles.length}`,
    `- Uncertain relevant files: ${args.fpmlIngest.uncertainFiles.length}`,
    '',
    '## Suggested Files To Inspect First',
    '',
    ...firstInspection.map(file => `- \`${file.sourcePath}\` (${file.relevanceReasons.join('; ')})`),
    '',
    '## Suggested Next Action',
    '',
    'Inspect the direct FpML ingest files first, starting with trade state, party, payment, price/quantity, datetime, and settlement. Then choose one product family for deeper review.',
    '',
    '## Next Decision',
    '',
    'This index does not parse rules. Decide whether the next step should inspect full files, extract function blocks with line numbers, or build a conservative Rosetta parser.',
    '',
  ].join('\n')
}

function inferRelevanceConfidence(args: {
  category: RosettaFileCategory
  lowerName: string
  hasFpmlReference: boolean
  hasIngestReference: boolean
  supportingShared: boolean
}): RosettaRelevanceConfidence {
  if (args.category === 'fpml-ingest') return 'high'
  if (args.hasFpmlReference && args.hasIngestReference) return 'high'
  if (args.supportingShared) return 'medium'
  if (args.hasFpmlReference || args.lowerName.includes('confirmation')) return 'low'
  return 'none'
}

function isSupportingSharedFile(
  lowerName: string,
  family: RosettaProductFamily | null
): boolean {
  if (family !== 'common') return false
  return /(party|payment|pricequantity|datetime|tradestate|settlement)/.test(lowerName)
}

function fpmlSortPriority(file: RosettaSourceFileIndexEntry): number {
  const name = file.fileName.toLowerCase()
  const sharedOrder = [
    'tradestate',
    'party',
    'payment',
    'pricequantity',
    'datetime',
    'settlement',
  ]
  if (file.category === 'fpml-ingest') {
    const index = sharedOrder.findIndex(token => name.includes(token))
    if (index >= 0) return index
    return 100
  }
  if (file.inferredProductFamily === 'common') return 200
  if (file.inferredProductFamily != null) return 300
  return 400
}

function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const out: Record<string, number> = {}
  for (const item of items) {
    const key = keyFn(item)
    out[key] = (out[key] ?? 0) + 1
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)))
}

function renderCountTable(counts: Record<string, number>, label: string): string {
  const lines = [`| ${label} | Count |`, '|---|---:|']
  for (const [key, value] of Object.entries(counts)) {
    lines.push(`| \`${key}\` | ${value} |`)
  }
  return lines.join('\n')
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(value, null, 2), 'utf8')
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}
