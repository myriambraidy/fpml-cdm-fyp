import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { classifyGateFailures, renderGateFailureClassification } from './gate-classification'
import { truncateForLog } from './markdown'
import type { GateResult, GeneratorRunConfig } from './types'

export type RepairFocusFileExcerpt = {
  path: string
  startLine: number
  endLine: number
  content: string
}

export type RepairFocusPacket = {
  attempt: number
  earliestFailedGate: string
  category: string
  failedGateOutput: string
  excerpts: RepairFocusFileExcerpt[]
}

export async function writeRepairFocusPacket(args: {
  config: GeneratorRunConfig
  gateResults: GateResult[]
  attempt: number
  outputPath: string
}): Promise<RepairFocusPacket> {
  const packet = await buildRepairFocusPacket(args.config, args.gateResults, args.attempt)
  await mkdir(dirname(args.outputPath), { recursive: true })
  await writeFile(args.outputPath, renderRepairFocusPacket(packet, args.gateResults), 'utf8')
  return packet
}

async function buildRepairFocusPacket(
  config: GeneratorRunConfig,
  gateResults: GateResult[],
  attempt: number
): Promise<RepairFocusPacket> {
  const classification = classifyGateFailures(gateResults)
  const failed = gateResults.find(result => result.status === 'failed')
  const failedGateOutput = failed?.outputSnippet ?? 'No failed gate output was recorded.'
  const refs = extractJavaFileRefs(config.runOutputDir, failedGateOutput)
  const excerpts: RepairFocusFileExcerpt[] = []
  for (const ref of refs.slice(0, 4)) {
    const excerpt = await readExcerpt(ref.path, ref.line, 25)
    if (excerpt !== null) excerpts.push(excerpt)
  }
  return {
    attempt,
    earliestFailedGate: classification.earliestFailedGate ?? 'none',
    category: classification.category ?? 'unknown',
    failedGateOutput: truncateForLog(failedGateOutput, 8000),
    excerpts,
  }
}

function renderRepairFocusPacket(packet: RepairFocusPacket, gateResults: GateResult[]): string {
  return `# Focused Repair Packet

Attempt: ${packet.attempt}
Earliest failed gate: ${packet.earliestFailedGate}
Category: ${packet.category}

${renderGateFailureClassification(gateResults)}

## Repair Instruction

- Patch only the earliest failed gate unless the excerpt proves the same root cause affects another file.
- Do not reread broad context unless a referenced class or method is missing from the compact approved API summary.
- Prefer the smallest changed file set.

## Failed Gate Output

\`\`\`text
${packet.failedGateOutput}
\`\`\`

## Affected File Excerpts

${packet.excerpts.length === 0 ? '- No Java file excerpt could be resolved from the failed gate output.' : packet.excerpts.map(renderExcerpt).join('\n\n')}
`
}

function renderExcerpt(excerpt: RepairFocusFileExcerpt): string {
  return `### ${excerpt.path}:${excerpt.startLine}-${excerpt.endLine}

\`\`\`java
${excerpt.content}
\`\`\``
}

type JavaFileRef = {
  path: string
  line: number
}

export function extractJavaFileRefs(runOutputDir: string, text: string): JavaFileRef[] {
  const refs: JavaFileRef[] = []
  const seen = new Set<string>()
  addJsonJavaFileRefs(runOutputDir, text, refs, seen)
  for (const match of text.matchAll(/((?:[A-Za-z]:|\/[A-Za-z]:)?[^\r\n:[\]]+\.java):\[(\d+)(?:,\d+)?\]/gmu)) {
    const rawPath = match[1]
    const rawLine = match[2]
    if (rawPath === undefined || rawLine === undefined) continue
    const resolved = resolveJavaPath(runOutputDir, rawPath)
    const line = Number.parseInt(rawLine, 10)
    if (!Number.isFinite(line)) continue
    const key = `${resolved}:${line}`
    if (seen.has(key)) continue
    seen.add(key)
    refs.push({ path: resolved, line })
  }
  for (const match of text.matchAll(/"file"\s*:\s*"([^"]+\.java)"/gmu)) {
    const rawPath = match[1]
    if (rawPath === undefined) continue
    addJavaFileRef(refs, seen, resolveJavaPath(runOutputDir, rawPath), 1)
  }
  return refs
}

type JsonJavaFinding = {
  file?: string
  line?: number
}

function addJsonJavaFileRefs(
  runOutputDir: string,
  text: string,
  refs: JavaFileRef[],
  seen: Set<string>
): void {
  const parsed = parseJsonJavaFindings(text)
  for (const finding of parsed) {
    if (finding.file === undefined || !finding.file.endsWith('.java')) continue
    const line = finding.line === undefined ? 1 : finding.line
    addJavaFileRef(refs, seen, resolveJavaPath(runOutputDir, finding.file), line)
  }
}

function parseJsonJavaFindings(text: string): JsonJavaFinding[] {
  try {
    const parsed = JSON.parse(text) as JsonJavaFinding | JsonJavaFinding[]
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return []
  }
}

function addJavaFileRef(
  refs: JavaFileRef[],
  seen: Set<string>,
  path: string,
  line: number
): void {
  const normalizedLine = Number.isFinite(line) && line > 0 ? Math.floor(line) : 1
  const key = `${path}:${normalizedLine}`
  if (seen.has(key)) return
  seen.add(key)
  refs.push({ path, line: normalizedLine })
}

function resolveJavaPath(runOutputDir: string, rawPath: string): string {
  const normalized = rawPath.replace(/\\/g, '/').replace(/^\/([A-Za-z]:)/u, '$1')
  if (/^[A-Za-z]:\//u.test(normalized)) return resolve(normalized)
  return resolve(runOutputDir, normalized)
}

async function readExcerpt(
  path: string,
  centerLine: number,
  radius: number
): Promise<RepairFocusFileExcerpt | null> {
  if (!(await exists(path))) return null
  const lines = (await readFile(path, 'utf8')).split(/\r?\n/u)
  const startLine = Math.max(1, centerLine - radius)
  const endLine = Math.min(lines.length, centerLine + radius)
  const content = lines
    .slice(startLine - 1, endLine)
    .map((line, index) => `${String(startLine + index).padStart(4, ' ')}: ${line}`)
    .join('\n')
  return { path, startLine, endLine, content }
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
