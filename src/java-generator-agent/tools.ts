import { mkdir, readdir, readFile, stat } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import type { LLMTool } from '../agent/types'
import { parseJSON } from '../parser/json-parser'
import { parseXML } from '../parser/xml-parser'
import { GENERATED_IMPL_PACKAGE, GENERATED_IMPL_SOURCE_ROOT } from './java-contract'
import { truncateForLog } from './markdown'
import type {
  ActiveStageContext,
  GeneratorRunConfig,
  ToolAuditEntry,
  ToolExecutionState,
  ToolResult,
} from './types'

type ToolName =
  | 'read_file'
  | 'list_files'
  | 'search_text'
  | 'parse_xml_summary'
  | 'parse_json_summary'
  | 'write_file'
  | 'write_generated_java'
  | 'run_command'
  | 'validate_generated_output'
  | 'get_scope_evidence'
  | 'get_context_packet'
  | 'get_fixture_summary'
  | 'get_expected_cdm_summary'
  | 'get_rosetta_snippets'
  | 'get_rosetta_snippet'
  | 'get_unsupported_products'

type ToolInput = {
  path?: string
  root?: string
  pattern?: string
  content?: string
  className?: string
  command?: string
  cwd?: string
  role?: string
  topic?: string
  functionName?: string
}

type ToolContext = {
  config: GeneratorRunConfig
  audit: ToolAuditEntry[]
  state: ToolExecutionState
  stage: ActiveStageContext
}

export const GENERATOR_LLM_TOOLS: LLMTool[] = [
  toolSchema('read_file', 'Read a UTF-8 text file from an allowed project path.', [
    ['path', 'string'],
  ]),
  toolSchema('list_files', 'List files under an allowed project directory.', [
    ['root', 'string'],
  ]),
  toolSchema('search_text', 'Search files under an allowed root for a literal text pattern.', [
    ['root', 'string'],
    ['pattern', 'string'],
  ]),
  toolSchema('parse_xml_summary', 'Parse XML and return a path/value summary.', [
    ['path', 'string'],
  ]),
  toolSchema('parse_json_summary', 'Parse JSON and return a path/value summary.', [
    ['path', 'string'],
  ]),
  toolSchema('write_file', 'Write a generated file inside the current run output directory.', [
    ['path', 'string'],
    ['content', 'string'],
  ]),
  toolSchema('write_generated_java', 'Write a generated Java class to the deterministic generated package.', [
    ['className', 'string'],
    ['content', 'string'],
  ]),
  toolSchema('run_command', 'Run an allowed build/runtime command for this generator run.', [
    ['command', 'string'],
    ['cwd', 'string'],
  ]),
  toolSchema('validate_generated_output', 'Validate generated CDM JSON and sidecar reports.', []),
  toolSchema('get_scope_evidence', 'Return the precomputed product scope and evidence index.', []),
  toolSchema('get_context_packet', 'Return scoped context for a role and topic.', [
    ['role', 'string'],
    ['topic', 'string'],
  ]),
  toolSchema('get_fixture_summary', 'Return a selected FpML fixture summary.', [['path', 'string']]),
  toolSchema('get_expected_cdm_summary', 'Return a selected expected CDM summary.', [['path', 'string']]),
  toolSchema('get_rosetta_snippets', 'Return curated Rosetta snippets for FX derivatives.', []),
  toolSchema('get_rosetta_snippet', 'Return a specific Rosetta function snippet by function name.', [
    ['functionName', 'string'],
  ]),
  toolSchema('get_unsupported_products', 'Return non-FX and unknown product classifications.', []),
]

function toolSchema(
  name: ToolName,
  description: string,
  fields: Array<[string, 'string']>
): LLMTool {
  const properties: Record<string, { type: 'string' }> = {}
  const required: string[] = []
  for (const [field, type] of fields) {
    properties[field] = { type }
    required.push(field)
  }
  return {
    name,
    description,
    input_schema: {
      type: 'object',
      additionalProperties: false,
      required,
      properties,
    },
  }
}

export async function executeGeneratorTool(
  context: ToolContext,
  name: string,
  input: ToolInput
): Promise<string> {
  const key = toolCacheKey(name, input)
  const cached = context.state.cache.get(key)
  if (cached) {
    cached.count += 1
    context.audit.push({
      tool: name,
      inputSummary: summarizeInput(input),
      outputSummary: truncateForLog(cached.output, 500),
      sourcePaths: cached.sourcePaths,
      cacheStatus: 'hit',
      ok: cached.ok,
    })
    return cached.ok ? `CACHE_HIT\n${cached.output}` : `CACHE_HIT_BLOCKED_FAILURE\n${cached.output}`
  }

  const result = await safeExecuteTool(context, name, input)
  context.state.cache.set(key, { ...result, count: 1 })
  context.audit.push({
    tool: name,
    inputSummary: summarizeInput(input),
    outputSummary: truncateForLog(result.output, 500),
    sourcePaths: result.sourcePaths,
    cacheStatus: 'miss',
    ok: result.ok,
  })

  if (!result.ok) {
    const repeats = (context.state.failedRepeats.get(key) ?? 0) + 1
    context.state.failedRepeats.set(key, repeats)
    if (repeats >= 2) return `ERROR_BLOCKED_REPEATED_TOOL_FAILURE: ${result.output}`
  }

  return result.ok ? result.output : `ERROR: ${result.output}`
}

export function createToolExecutionState(): ToolExecutionState {
  return {
    cache: new Map(),
    failedRepeats: new Map(),
  }
}

async function safeExecuteTool(
  context: ToolContext,
  name: string,
  input: ToolInput
): Promise<ToolResult> {
  try {
    return await executeTool(context, name, input)
  } catch (error) {
    return {
      ok: false,
      output: error instanceof Error ? error.message : String(error),
      sourcePaths: [],
    }
  }
}

async function executeTool(
  context: ToolContext,
  name: string,
  input: ToolInput
): Promise<ToolResult> {
  if (name === 'read_file') return readFileTool(context.config, input)
  if (name === 'list_files') return listFilesTool(context.config, input)
  if (name === 'search_text') return searchTextTool(context.config, input)
  if (name === 'parse_xml_summary') return parseXmlSummaryTool(context.config, input)
  if (name === 'parse_json_summary') return parseJsonSummaryTool(context.config, input)
  if (name === 'write_file') return writeFileTool(context, input)
  if (name === 'write_generated_java') return writeGeneratedJavaTool(context, input)
  if (name === 'run_command') return runCommandTool(context.config, input)
  if (name === 'validate_generated_output') return validateGeneratedOutputTool(context.config)
  if (name === 'get_scope_evidence') return getScopeEvidenceTool(context.config)
  if (name === 'get_context_packet') return getContextPacketTool(context.config, input)
  if (name === 'get_fixture_summary') return parseXmlSummaryTool(context.config, input)
  if (name === 'get_expected_cdm_summary') return parseJsonSummaryTool(context.config, input)
  if (name === 'get_rosetta_snippets') return getRosettaSnippetsTool(context.config)
  if (name === 'get_rosetta_snippet') return getRosettaSnippetTool(context.config, input)
  if (name === 'get_unsupported_products') return getUnsupportedProductsTool(context.config)
  return { ok: false, output: `Unknown tool: ${name}`, sourcePaths: [] }
}

async function readFileTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  const path = requireString(input.path, 'path')
  const resolved = assertAllowedRead(config, path)
  const content = await readFile(resolved, 'utf8')
  return { ok: true, output: truncateForLog(content, 16_000), sourcePaths: [resolved] }
}

async function listFilesTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  const root = requireString(input.root, 'root')
  const resolved = assertAllowedRead(config, root)
  const files = await listFiles(resolved, 200)
  return { ok: true, output: files.join('\n'), sourcePaths: [resolved] }
}

async function searchTextTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  const root = assertAllowedRead(config, requireString(input.root, 'root'))
  const pattern = requireString(input.pattern, 'pattern').toLowerCase()
  const files = await listFiles(root, 500)
  const matches: string[] = []
  for (const file of files) {
    const content = await readFile(file, 'utf8')
    const lines = content.split(/\r?\n/)
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(pattern)) {
        matches.push(`${file}:${index + 1}: ${line.trim()}`)
      }
    })
  }
  return {
    ok: true,
    output: matches.length > 0 ? truncateForLog(matches.join('\n'), 16_000) : 'No matches.',
    sourcePaths: [root],
  }
}

async function parseXmlSummaryTool(
  config: GeneratorRunConfig,
  input: ToolInput
): Promise<ToolResult> {
  const path = assertAllowedRead(config, requireString(input.path, 'path'))
  const fields = parseXML(await readFile(path, 'utf8'))
  const summary = fields
    .slice(0, 300)
    .map(field => `${field.path}${field.value ? ` = ${field.value}` : ''}`)
    .join('\n')
  return { ok: true, output: summary, sourcePaths: [path] }
}

async function parseJsonSummaryTool(
  config: GeneratorRunConfig,
  input: ToolInput
): Promise<ToolResult> {
  const path = assertAllowedRead(config, requireString(input.path, 'path'))
  const fields = parseJSON(await readFile(path, 'utf8'))
  const summary = fields
    .slice(0, 300)
    .map(field => `${field.path}${field.value ? ` = ${field.value}` : ''}`)
    .join('\n')
  return { ok: true, output: summary, sourcePaths: [path] }
}

async function writeFileTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const path = requireString(input.path, 'path')
  const content = requireString(input.content, 'content')
  const relativePath = normalizeWritePath(context.config, path)
  assertStageWriteAllowed(context.stage, relativePath)
  const resolved = assertInside(context.config.runOutputDir, resolve(context.config.runOutputDir, relativePath))
  await mkdir(dirname(resolved), { recursive: true })
  await Bun.write(resolved, content)
  return { ok: true, output: `Wrote ${resolved}`, sourcePaths: [resolved] }
}

async function writeGeneratedJavaTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const className = requireString(input.className, 'className')
  const content = requireString(input.content, 'content')
  const relativePath = generatedJavaPath(className)
  assertStageWriteAllowed(context.stage, relativePath)
  if (!content.includes(`package ${GENERATED_IMPL_PACKAGE};`)) {
    return {
      ok: false,
      output: `Generated Java class ${className} must declare package ${GENERATED_IMPL_PACKAGE}.`,
      sourcePaths: [],
    }
  }
  const resolved = assertInside(context.config.runOutputDir, resolve(context.config.runOutputDir, relativePath))
  await mkdir(dirname(resolved), { recursive: true })
  await Bun.write(resolved, content)
  return { ok: true, output: `Wrote ${resolved}`, sourcePaths: [resolved] }
}

async function runCommandTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  const command = requireString(input.command, 'command')
  const cwd = assertInside(resolve('.'), requireString(input.cwd, 'cwd'))
  if (!isAllowedCommand(command, cwd, config.runOutputDir)) {
    return { ok: false, output: `Command not allowed: ${command}`, sourcePaths: [] }
  }
  const proc = Bun.spawn(['powershell', '-NoProfile', '-Command', command], {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  const output = truncateForLog([stdout, stderr].filter(Boolean).join('\n'), 12_000)
  return {
    ok: exitCode === 0,
    output: `exit=${exitCode}\n${output}`,
    sourcePaths: [cwd],
  }
}

async function validateGeneratedOutputTool(config: GeneratorRunConfig): Promise<ToolResult> {
  const missing: string[] = []
  for (const fixture of config.runtimeFixtures) {
    const outputPath = resolve(config.runOutputDir, 'outputs', `${fixture.id}.json`)
    if (!(await exists(outputPath))) missing.push(outputPath)
    for (const report of [
      'mapping-report.json',
      'validation-report.json',
      'traceability-report.json',
      'unsupported-scope.json',
    ]) {
      const reportPath = resolve(config.runOutputDir, 'reports', fixture.id, report)
      if (!(await exists(reportPath))) missing.push(reportPath)
    }
  }
  if (missing.length > 0) {
    return { ok: false, output: `Missing files:\n${missing.join('\n')}`, sourcePaths: missing }
  }
  const outputPaths = config.runtimeFixtures.map(fixture =>
    resolve(config.runOutputDir, 'outputs', `${fixture.id}.json`)
  )
  for (const fixture of config.runtimeFixtures) {
    const outputPath = resolve(config.runOutputDir, 'outputs', `${fixture.id}.json`)
    const content = await readFile(outputPath, 'utf8')
    const fields = parseJSON(content)
    const rootNames = new Set(fields.map(field => field.path.split(/[.[\]]/)[1]).filter(Boolean))
    if (rootNames.has('cdm') || rootNames.has('status')) {
      return {
        ok: false,
        output: `${fixture.id} output appears wrapped with status/cdm root fields.`,
        sourcePaths: [outputPath],
      }
    }
  }
  return { ok: true, output: 'Generated output and reports are present.', sourcePaths: outputPaths }
}

async function getScopeEvidenceTool(config: GeneratorRunConfig): Promise<ToolResult> {
  const paths = [
    resolve(config.runOutputDir, 'agent-workspace', '00-product-scope.md'),
    resolve(config.runOutputDir, 'agent-workspace', 'evidence-index.md'),
  ]
  const contents = await Promise.all(paths.map(path => readFile(path, 'utf8')))
  return { ok: true, output: contents.join('\n\n'), sourcePaths: paths }
}

async function getContextPacketTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  const role = requireString(input.role, 'role')
  const topic = requireString(input.topic, 'topic')
  const paths = [
    resolve(config.runOutputDir, 'agent-workspace', 'evidence-index.md'),
    resolve(config.runOutputDir, 'agent-workspace', '00-product-scope.json'),
  ]
  if (role === 'implementer' || role === 'repair') {
    paths.push(resolve(config.runOutputDir, 'agent-workspace', 'java-shell-contract.md'))
  }
  const contents = await Promise.all(paths.map(path => readFile(path, 'utf8')))
  const fixtureSections = await buildRuntimeFixtureContext(config)
  const rosettaSection = topic.toLowerCase().includes('rosetta')
    ? `\n\n${(await getRosettaSnippetsTool(config)).output}`
    : ''
  return {
    ok: true,
    output: truncateForLog(
      [`# Context Packet`, `Role: ${role}`, `Topic: ${topic}`, ...contents, fixtureSections, rosettaSection].join(
        '\n\n'
      ),
      32_000
    ),
    sourcePaths: paths,
  }
}

async function getRosettaSnippetsTool(config: GeneratorRunConfig): Promise<ToolResult> {
  const paths = [
    resolve('data/rosetta-source/latest/docs/product-families/fx.md'),
    resolve('data/rosetta-source/latest/docs/shared-ingest.md'),
  ]
  const contents = await Promise.all(paths.map(path => readFile(path, 'utf8')))
  return { ok: true, output: truncateForLog(contents.join('\n\n'), 16_000), sourcePaths: paths }
}

async function getRosettaSnippetTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  const functionName = requireString(input.functionName, 'functionName')
  const rosettaRoot = resolve('data/rosetta-source/latest/files/rosetta-source/src/main/rosetta')
  const files = (await listFiles(rosettaRoot, 500)).filter(file => file.endsWith('.rosetta'))
  const matches: string[] = []
  const sourcePaths: string[] = []
  for (const file of files) {
    const content = await readFile(file, 'utf8')
    const lines = content.split(/\r?\n/u)
    const index = lines.findIndex(line => line.includes(`func ${functionName}:`))
    if (index === -1) continue
    const start = Math.max(0, index - 3)
    const end = Math.min(lines.length, index + 80)
    matches.push(lines.slice(start, end).join('\n'))
    sourcePaths.push(file)
  }
  if (matches.length === 0) {
    return {
      ok: false,
      output: `Rosetta function not found: ${functionName}`,
      sourcePaths: [rosettaRoot],
    }
  }
  return {
    ok: true,
    output: truncateForLog(matches.join('\n\n---\n\n'), 24_000),
    sourcePaths,
  }
}

async function getUnsupportedProductsTool(config: GeneratorRunConfig): Promise<ToolResult> {
  const path = resolve(config.runOutputDir, 'agent-workspace', '00-product-scope.md')
  const content = await readFile(path, 'utf8')
  const lines = content
    .split(/\r?\n/)
    .filter(line => line.includes('non-fx') || line.includes('unknown-fx') || line.includes('exclude'))
  return {
    ok: true,
    output: lines.length > 0 ? lines.join('\n') : 'No non-FX or unknown product classifications found.',
    sourcePaths: [path],
  }
}

function requireString(value: string | undefined, field: string): string {
  if (!value) throw new Error(`Missing required tool input: ${field}`)
  return value
}

function summarizeInput(input: ToolInput): string {
  return Object.entries(input)
    .filter(([key]) => key !== 'content')
    .map(([key, value]) => `${key}=${value}`)
    .join(', ')
}

function toolCacheKey(name: string, input: ToolInput): string {
  const entries = Object.entries(input)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    .map(([key, value]) => [key, normalizeSeparators(value)] as const)
    .sort(([left], [right]) => left.localeCompare(right))
  return JSON.stringify({ name, entries })
}

function normalizeWritePath(config: GeneratorRunConfig, path: string): string {
  const normalized = normalizeSeparators(path)
  const runRoot = normalizeSeparators(resolve(config.runOutputDir))
  if (normalized.includes('..')) throw new Error('write_file path cannot contain ..')
  if (normalized.startsWith('generated/')) {
    throw new Error('write_file path must be relative to the current run root; do not include generated/')
  }
  if (normalized.includes(config.runId)) {
    throw new Error('write_file path must not include the current run id')
  }
  if (isAbsolute(path)) {
    const absolute = normalizeSeparators(resolve(path))
    if (!absolute.startsWith(`${runRoot}/`) && absolute !== runRoot) {
      throw new Error(`write_file absolute path outside current run root: ${path}`)
    }
    return absolute === runRoot ? '' : absolute.slice(runRoot.length + 1)
  }
  return normalized
}

function assertStageWriteAllowed(stage: ActiveStageContext, relativePath: string): void {
  if (stage.allowedWritePaths.some(allowed => pathMatches(allowed, relativePath))) return
  throw new Error(
    `Invalid write path for ${stage.role}: ${relativePath}.
Use one of:
${stage.allowedWritePaths.map(path => `- ${path}`).join('\n')}
Do not include generated/java-mapper-poc/runs/... or the run id.`
  )
}

function pathMatches(pattern: string, path: string): boolean {
  const normalizedPattern = normalizeSeparators(pattern)
  const normalizedPath = normalizeSeparators(path)
  if (normalizedPattern.endsWith('/**')) {
    const prefix = normalizedPattern.slice(0, -3)
    return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
  }
  return normalizedPattern === normalizedPath
}

function normalizeSeparators(value: string): string {
  return value.replace(/\\/g, '/')
}

function generatedJavaPath(className: string): string {
  if (!/^[A-Z][A-Za-z0-9_]*$/u.test(className)) {
    throw new Error(`Invalid Java class name: ${className}`)
  }
  return `${GENERATED_IMPL_SOURCE_ROOT}/${className}.java`
}

function assertAllowedRead(config: GeneratorRunConfig, target: string): string {
  const resolved = resolve(target)
  const allowedRoots = [
    config.runOutputDir,
    ...config.evidenceRoots,
    ...config.fixturePaths,
    ...config.expectedCdmPaths,
    'docs',
    'plans',
    'src',
    'data',
    'data_to_learn_from',
  ].map(path => resolve(path))

  if (allowedRoots.some(root => isInsideOrEqual(root, resolved))) return resolved
  throw new Error(`Read path outside allowed roots: ${target}`)
}

export function assertInside(root: string, target: string): string {
  const resolvedRoot = resolve(root)
  const resolvedTarget = resolve(target)
  if (!isInsideOrEqual(resolvedRoot, resolvedTarget)) {
    throw new Error(`Path outside allowed root: ${target}`)
  }
  return resolvedTarget
}

function isInsideOrEqual(root: string, target: string): boolean {
  const rel = relative(root, target)
  return rel === '' || (!rel.startsWith('..') && !resolve(rel).startsWith('..'))
}

async function listFiles(root: string, limit: number): Promise<string[]> {
  const found: string[] = []
  async function visit(dir: string): Promise<void> {
    if (found.length >= limit) return
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const child = resolve(dir, entry.name)
      if (entry.isDirectory()) {
        await visit(child)
      } else if (entry.isFile()) {
        found.push(child)
      }
      if (found.length >= limit) return
    }
  }
  const rootStat = await stat(root)
  if (rootStat.isFile()) return [root]
  await visit(root)
  return found
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function buildRuntimeFixtureContext(config: GeneratorRunConfig): Promise<string> {
  const sections: string[] = []
  for (const fixture of config.runtimeFixtures) {
    const xmlFields = parseXML(await readFile(resolve(fixture.fpmlPath), 'utf8'))
    const jsonFields = parseJSON(await readFile(resolve(fixture.expectedCdmPath), 'utf8'))
    sections.push(`# Runtime Fixture: ${fixture.id}`)
    sections.push(`FpML path: ${fixture.fpmlPath}`)
    sections.push(xmlFields.slice(0, 80).map(field => `${field.path}${field.value ? ` = ${field.value}` : ''}`).join('\n'))
    sections.push(`Expected CDM path: ${fixture.expectedCdmPath}`)
    sections.push(
      jsonFields.slice(0, 120).map(field => `${field.path}${field.value ? ` = ${field.value}` : ''}`).join('\n')
    )
  }
  return sections.join('\n\n')
}

function isAllowedCommand(command: string, cwd: string, runOutputDir: string): boolean {
  const normalized = command.trim().toLowerCase()
  if (normalized === 'bun run typecheck') return cwd === resolve('.')
  const runRoot = resolve(runOutputDir)
  const mavenInRun = isInsideOrEqual(runRoot, cwd)
  const allowedMaven = new Set([
    'mvn test',
    'mvn package',
    'mvn -q -dskiptests compile',
    'mvn -q -dskiptests test-compile',
    'mvn -q -dskiptests dependency:go-offline',
  ])
  if (mavenInRun && allowedMaven.has(normalized)) return true
  if (normalized.startsWith('java -jar target/fpml-cdm-mapper.jar ') && mavenInRun) return true
  return false
}
