import { readFile } from 'node:fs/promises'
import * as path from 'node:path'
import type {
  RosettaFileCategory,
  RosettaProductFamily,
  RosettaSourceFileIndexEntry,
} from './indexer'

export type RosettaSourceBlockKind = 'func' | 'type' | 'enum'

export type RosettaSourceBlock = {
  id: string
  kind: RosettaSourceBlockKind
  name: string
  sourcePath: string
  localPath: string
  fileName: string
  startLine: number
  endLine: number
  lineCount: number
  category: RosettaFileCategory
  inferredProductFamily: RosettaProductFamily | null
  rawText: string
  headerLine: string
}

export type RosettaExtractionDiagnostics = {
  generatedAt: string
  filesRead: number
  filesWithZeroBlocks: string[]
  largeBlocks: Array<{
    id: string
    sourcePath: string
    startLine: number
    endLine: number
    lineCount: number
  }>
  duplicateBlockIds: string[]
  readFailures: Array<{
    sourcePath: string
    message: string
  }>
  warnings: string[]
}

const BLOCK_START = /^\s*(func|type|enum)\s+([A-Za-z0-9_]+)\s*:/
const LARGE_BLOCK_LINE_THRESHOLD = 500

export function extractRosettaBlocks(args: {
  file: RosettaSourceFileIndexEntry
  content: string
}): RosettaSourceBlock[] {
  const lines = args.content.length === 0 ? [] : args.content.split(/\r?\n/)
  const starts: Array<{
    index: number
    kind: RosettaSourceBlockKind
    name: string
  }> = []

  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(BLOCK_START)
    if (!match) continue
    starts.push({
      index: i,
      kind: match[1] as RosettaSourceBlockKind,
      name: match[2],
    })
  }

  return starts.map((start, position) => {
    const next = starts[position + 1]
    const endIndex = next ? next.index - 1 : lines.length - 1
    const rawLines = lines.slice(start.index, endIndex + 1)
    return {
      id: buildBlockId({
        kind: start.kind,
        fileName: args.file.fileName,
        name: start.name,
      }),
      kind: start.kind,
      name: start.name,
      sourcePath: args.file.sourcePath,
      localPath: args.file.localPath,
      fileName: args.file.fileName,
      startLine: start.index + 1,
      endLine: endIndex + 1,
      lineCount: rawLines.length,
      category: args.file.category,
      inferredProductFamily: args.file.inferredProductFamily,
      rawText: rawLines.join('\n'),
      headerLine: lines[start.index],
    }
  })
}

export async function extractBlocksFromFiles(args: {
  snapshotDirectory: string
  files: RosettaSourceFileIndexEntry[]
  generatedAt: string
}): Promise<{
  blocks: RosettaSourceBlock[]
  diagnostics: RosettaExtractionDiagnostics
}> {
  const blocks: RosettaSourceBlock[] = []
  const diagnostics: RosettaExtractionDiagnostics = {
    generatedAt: args.generatedAt,
    filesRead: 0,
    filesWithZeroBlocks: [],
    largeBlocks: [],
    duplicateBlockIds: [],
    readFailures: [],
    warnings: [],
  }

  for (const file of args.files) {
    const absolutePath = path.resolve(args.snapshotDirectory, file.localPath)
    try {
      const content = await readFile(absolutePath, 'utf8')
      diagnostics.filesRead += 1
      const fileBlocks = extractRosettaBlocks({ file, content })
      if (fileBlocks.length === 0 && file.extension === '.rosetta') {
        diagnostics.filesWithZeroBlocks.push(file.sourcePath)
      }
      for (const block of fileBlocks) {
        if (block.lineCount > LARGE_BLOCK_LINE_THRESHOLD) {
          diagnostics.largeBlocks.push({
            id: block.id,
            sourcePath: block.sourcePath,
            startLine: block.startLine,
            endLine: block.endLine,
            lineCount: block.lineCount,
          })
        }
      }
      blocks.push(...fileBlocks)
    } catch (error) {
      diagnostics.readFailures.push({
        sourcePath: file.sourcePath,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  diagnostics.duplicateBlockIds = findDuplicateBlockIds(blocks)
  if (diagnostics.duplicateBlockIds.length > 0) {
    diagnostics.warnings.push(
      `${diagnostics.duplicateBlockIds.length} duplicate block id(s) found.`
    )
  }
  if (diagnostics.filesWithZeroBlocks.length > 0) {
    diagnostics.warnings.push(
      `${diagnostics.filesWithZeroBlocks.length} Rosetta file(s) had no top-level func/type/enum blocks.`
    )
  }

  return { blocks, diagnostics }
}

export function buildBlockId(args: {
  kind: RosettaSourceBlockKind
  fileName: string
  name: string
}): string {
  return `${args.kind}:${args.fileName}:${args.name}`
}

export function splitBlocksByKind(blocks: RosettaSourceBlock[]): {
  functions: RosettaSourceBlock[]
  types: RosettaSourceBlock[]
  enums: RosettaSourceBlock[]
} {
  return {
    functions: blocks.filter(block => block.kind === 'func'),
    types: blocks.filter(block => block.kind === 'type'),
    enums: blocks.filter(block => block.kind === 'enum'),
  }
}

function findDuplicateBlockIds(blocks: RosettaSourceBlock[]): string[] {
  const counts = new Map<string, number>()
  for (const block of blocks) {
    counts.set(block.id, (counts.get(block.id) ?? 0) + 1)
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort()
}
