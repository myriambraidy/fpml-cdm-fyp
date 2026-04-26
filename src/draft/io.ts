import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { z } from 'zod'
import type { DraftArtifacts, DraftDebugArtifacts, DraftLogEntry } from './types'

export const readUtf8 = (path: string): Promise<string> => readFile(path, 'utf8')

export async function ensureParentDir(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
}

export async function writeDraftArtifacts(args: {
  markdownPath?: string
  jsonPath?: string
  markdown?: string
  artifact?: DraftArtifacts
  debugPath: string
  debugArtifact: DraftDebugArtifacts
  logPath: string
  runLog: DraftLogEntry[]
}): Promise<void> {
  if (args.markdownPath && args.markdown) {
    await ensureParentDir(args.markdownPath)
    await writeFile(args.markdownPath, args.markdown, 'utf8')
  }
  if (args.jsonPath && args.artifact) {
    await ensureParentDir(args.jsonPath)
    await writeFile(args.jsonPath, JSON.stringify(args.artifact, null, 2), 'utf8')
  }
  await ensureParentDir(args.debugPath)
  await ensureParentDir(args.logPath)
  await writeFile(args.debugPath, JSON.stringify(args.debugArtifact, null, 2), 'utf8')
  await writeFile(args.logPath, JSON.stringify(args.runLog, null, 2), 'utf8')
}

export function extractJsonObject(raw: string): unknown {
  return extractJsonWithCandidates(raw, false)
}

export function extractPossiblyTruncatedJsonObject(raw: string): unknown {
  return extractJsonWithCandidates(raw, true)
}

function extractJsonWithCandidates(raw: string, allowSalvage: boolean): unknown {
  const trimmed = raw.trim()
  const candidates = buildJsonCandidates(trimmed, allowSalvage)

  let lastError: unknown
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as unknown
    } catch (error) {
      lastError = error
    }
  }

  const preview = trimmed.slice(0, 500)
  const message = lastError instanceof Error ? lastError.message : 'Unknown JSON parse failure'
  throw new SyntaxError(`Unable to parse structured JSON response: ${message}. Preview: ${preview}`)
}

export function parseStructuredResponse<T>(raw: string, schema: z.ZodType<T>): T {
  return schema.parse(extractJsonObject(raw))
}

function buildJsonCandidates(trimmed: string, allowSalvage: boolean): string[] {
  const fencedMatches = Array.from(trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi))
  const baseCandidates = [
    ...fencedMatches.map(match => match[1]?.trim()).filter((value): value is string => !!value),
    extractBalancedJsonObject(trimmed),
    trimmed,
  ].filter((value, index, self): value is string => !!value && self.indexOf(value) === index)

  if (!allowSalvage) {
    return baseCandidates
  }

  const salvagedCandidates = baseCandidates
    .map(candidate => salvageTruncatedJsonObject(candidate))
    .filter((value, index, self): value is string => !!value && self.indexOf(value) === index)

  return [...baseCandidates, ...salvagedCandidates]
}

function extractBalancedJsonObject(input: string): string | undefined {
  const start = input.indexOf('{')
  if (start < 0) return undefined

  let depth = 0
  let inString = false
  let isEscaped = false

  for (let index = start; index < input.length; index += 1) {
    const char = input[index]

    if (inString) {
      if (isEscaped) {
        isEscaped = false
        continue
      }
      if (char === '\\') {
        isEscaped = true
        continue
      }
      if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }
    if (char === '{') {
      depth += 1
      continue
    }
    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return input.slice(start, index + 1)
      }
      continue
    }
  }

  return undefined
}

function salvageTruncatedJsonObject(input: string): string | undefined {
  const start = input.indexOf('{')
  if (start < 0) return undefined

  const source = input.slice(start).trim()
  const safePoints: Array<{ index: number; stack: string[] }> = []
  const stack: string[] = []
  let inString = false
  let isEscaped = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]

    if (inString) {
      if (isEscaped) {
        isEscaped = false
        continue
      }
      if (char === '\\') {
        isEscaped = true
        continue
      }
      if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }
    if (char === '{' || char === '[') {
      stack.push(char)
      continue
    }
    if (char === '}' || char === ']') {
      if (stack.length > 0) {
        stack.pop()
      }
      safePoints.push({ index, stack: [...stack] })
      continue
    }
    if (char === ',') {
      safePoints.push({ index, stack: [...stack] })
    }
  }

  for (let index = safePoints.length - 1; index >= 0; index -= 1) {
    const safePoint = safePoints[index]
    if (!safePoint) continue

    let candidate = source.slice(0, safePoint.index + 1).trimEnd()
    candidate = candidate.replace(/[,\s]+$/g, '')
    candidate = trimDanglingJsonTail(candidate)
    if (!candidate.startsWith('{')) {
      continue
    }

    const closing = safePoint.stack
      .slice()
      .reverse()
      .map(token => (token === '{' ? '}' : ']'))
      .join('')
    const repaired = `${candidate}${closing}`

    try {
      JSON.parse(repaired)
      return repaired
    } catch {
      continue
    }
  }

  return undefined
}

function trimDanglingJsonTail(candidate: string): string {
  let trimmed = candidate.trimEnd()
  while (/[,:{\[]$/.test(trimmed)) {
    trimmed = trimmed.slice(0, -1).trimEnd()
  }
  return trimmed
}

export function toAbsolutePath(workspaceRoot: string, candidate: string): string {
  return resolve(workspaceRoot, candidate)
}

export function toWorkspaceRelative(workspaceRoot: string, absolutePath: string): string {
  return relative(workspaceRoot, absolutePath).replaceAll('\\', '/')
}
