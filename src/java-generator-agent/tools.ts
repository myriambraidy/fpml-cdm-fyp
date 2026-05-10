import { mkdir, readdir, readFile, stat } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import type { LLMTool } from '../agent/types'
import { parseJSON } from '../parser/json-parser'
import { parseXML } from '../parser/xml-parser'
import { GENERATED_IMPL_PACKAGE, GENERATED_IMPL_SOURCE_ROOT } from './java-contract'
import { truncateForLog } from './markdown'
import { renderCdmRosettaPreflightMarkdown } from './cdm-rosetta-preflight'
import {
  buildRosettaGenerationContext,
  renderRosettaCallGraph,
  renderRosettaGenerationContext,
} from './rosetta-context'
import {
  getRosettaFunction,
  getRosettaFunctions,
  getRosettaMappingArea,
  getRosettaProductPack,
  renderRosettaRetrievalResult,
  searchRosettaBlocks,
  type RosettaMappingArea,
} from './rosetta-retrieval'
import {
  cdmJavaClassDetailsPath,
  cdmJavaApiIndexPath,
  cdmJavaApiSummaryMarkdownPath,
  cdmJavaFxSingleLegPackMarkdownPath,
  cdmJavaMissingClassesPath,
  ensureCdmJavaApiPack,
  lookupCdmJavaClassDetails,
  readCdmJavaApiIndex,
  renderCdmJavaApiSummaryMarkdownFromDisk,
  renderCdmJavaMissingClassesMarkdownFromDisk,
} from './cdm-java-api-pack'
import {
  approvedCdmApiContractJsonPath,
  approvedCdmApiContractMarkdownPath,
  approvedCdmApiContractSummaryPath,
  readApprovedCdmApiContract,
} from './approved-cdm-api-contract'
import type { ApprovedBuilderMethod } from './approved-cdm-api-contract'
import {
  readRelevantCdmApiDiscovery,
  relevantCdmApiDiscoveryJsonPath,
  resolveConcept,
} from './cdm-concept-resolver'
import {
  readSemanticRecipeBundle,
  renderSemanticRecipeBundle,
  semanticRecipesJsonPath,
} from './semantic-recipes'
import { CDM_JAVA_VERSION } from './java-contract'
import type {
  ActiveStageContext,
  GeneratorRunConfig,
  ToolAuditEntry,
  ToolExecutionState,
  ToolResult,
} from './types'

export type ToolName =
  | 'read_file'
  | 'list_files'
  | 'search_text'
  | 'parse_xml_summary'
  | 'parse_json_summary'
  | 'write_file'
  | 'write_generated_java'
  | 'write_generated_java_file'
  | 'run_command'
  | 'validate_generated_output'
  | 'get_scope_evidence'
  | 'get_context_packet'
  | 'get_fixture_summary'
  | 'get_expected_cdm_summary'
  | 'get_rosetta_snippets'
  | 'get_rosetta_snippet'
  | 'get_rosetta_product_pack'
  | 'get_rosetta_function'
  | 'get_rosetta_functions'
  | 'search_rosetta_blocks'
  | 'get_rosetta_mapping_area'
  | 'get_rosetta_generation_context'
  | 'get_rosetta_call_graph'
  | 'get_cdm_rosetta_preflight'
  | 'get_cdm_java_api_summary'
  | 'get_cdm_java_api_pack'
  | 'get_cdm_java_class'
  | 'get_cdm_enum_constants'
  | 'search_cdm_java_classes'
  | 'resolve_cdm_concept'
  | 'get_cdm_builder_methods'
  | 'get_related_cdm_classes'
  | 'get_approved_cdm_api_contract'
  | 'get_cdm_semantic_recipe'
  | 'get_cdm_java_missing_classes'
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
  functionNames?: string
  productFamily?: string
  implementationGroup?: string
  area?: string
  query?: string
  concept?: string
  intent?: string
  recipeId?: string
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
  toolSchema('write_generated_java', 'Write a generated Java class to the root deterministic generated package.', [
    ['className', 'string'],
    ['content', 'string'],
  ]),
  toolSchema('write_generated_java_file', 'Write a generated Java source file by run-relative path under the generated mapper package.', [
    ['path', 'string'],
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
  toolSchema('get_rosetta_product_pack', 'Return availability and source paths for Rosetta product-family documentation packs.', [
    ['productFamily', 'string'],
  ]),
  toolSchema('get_rosetta_function', 'Return exact Rosetta block text for one function by name.', [
    ['functionName', 'string'],
  ]),
  toolSchema('get_rosetta_functions', 'Return exact Rosetta block text for a comma-separated function name list.', [
    ['functionNames', 'string'],
  ]),
  toolSchema('search_rosetta_blocks', 'Search extracted Rosetta blocks by query within a product family.', [
    ['query', 'string'],
    ['productFamily', 'string'],
  ]),
  toolSchema('get_rosetta_mapping_area', 'Return required Rosetta evidence for one supported mapping area.', [
    ['productFamily', 'string'],
    ['implementationGroup', 'string'],
    ['area', 'string'],
  ]),
  toolSchema('get_rosetta_generation_context', 'Return authoritative Rosetta FX single-leg function context.', []),
  toolSchema('get_rosetta_call_graph', 'Return the detected Rosetta helper call graph.', []),
  toolSchema('get_cdm_rosetta_preflight', 'Return the CDM/Rosetta Java dependency preflight report.', []),
  toolSchema('get_cdm_java_api_summary', 'Return the compact CDM Java API class index and exact missing-class observations.', []),
  toolSchema('get_cdm_java_api_pack', 'Return the large full CDM Java API pack. Prefer get_cdm_java_class for exact classes.', []),
  toolSchema('get_cdm_java_class', 'Return verified javap details for one CDM Java class.', [
    ['className', 'string'],
  ]),
  toolSchema('get_cdm_enum_constants', 'Return exact enum constants for one verified CDM/Rosetta enum class.', [
    ['className', 'string'],
  ]),
  toolSchema('search_cdm_java_classes', 'Search the verified CDM Java class index by class or package text.', [
    ['pattern', 'string'],
  ]),
  toolSchema('resolve_cdm_concept', 'Resolve a semantic CDM concept to existing compiled-jar classes before exact lookup.', [
    ['concept', 'string'],
  ]),
  toolSchema('get_cdm_builder_methods', 'Return approved builder methods for one approved CDM class, optionally filtered by intent text.', [
    ['className', 'string'],
    ['intent', 'string'],
  ]),
  toolSchema('get_related_cdm_classes', 'Return approved and indexed CDM classes with the same simple name or nearby package.', [
    ['className', 'string'],
  ]),
  toolSchema('get_approved_cdm_api_contract', 'Return the run-specific approved CDM API contract.', []),
  toolSchema('get_cdm_semantic_recipe', 'Return semantic construction recipes for the run or one recipe id.', [
    ['recipeId', 'string'],
  ]),
  toolSchema('get_cdm_java_missing_classes', 'Return exact missing CDM Java class observations.', []),
  toolSchema('get_unsupported_products', 'Return non-FX and unknown product classifications.', []),
]

export const IMPLEMENTER_RESEARCH_TOOLS = selectGeneratorTools([
  'read_file',
  'list_files',
  'search_text',
  'parse_xml_summary',
  'parse_json_summary',
  'get_scope_evidence',
  'get_context_packet',
  'get_fixture_summary',
  'get_expected_cdm_summary',
  'get_rosetta_function',
  'get_rosetta_functions',
  'get_rosetta_mapping_area',
  'get_rosetta_generation_context',
  'get_rosetta_call_graph',
  'get_cdm_rosetta_preflight',
  'get_cdm_java_api_summary',
  'get_cdm_java_class',
  'get_cdm_enum_constants',
  'search_cdm_java_classes',
  'resolve_cdm_concept',
  'get_cdm_builder_methods',
  'get_related_cdm_classes',
  'get_approved_cdm_api_contract',
  'get_cdm_semantic_recipe',
  'get_cdm_java_missing_classes',
  'get_unsupported_products',
])

export const IMPLEMENTER_WRITE_TOOLS = selectGeneratorTools([
  'write_generated_java_file',
  'write_file',
])

export const REPAIR_RESEARCH_TOOLS = selectGeneratorTools([
  'read_file',
  'list_files',
  'search_text',
  'get_context_packet',
  'get_cdm_rosetta_preflight',
  'get_cdm_java_api_summary',
  'get_cdm_java_class',
  'get_cdm_enum_constants',
  'search_cdm_java_classes',
  'resolve_cdm_concept',
  'get_cdm_builder_methods',
  'get_related_cdm_classes',
  'get_approved_cdm_api_contract',
  'get_cdm_semantic_recipe',
  'get_cdm_java_missing_classes',
])

export const REPAIR_WRITE_TOOLS = selectGeneratorTools([
  'write_generated_java_file',
  'write_file',
])

export function selectGeneratorTools(names: ToolName[]): LLMTool[] {
  return names.map(name => {
    const tool = GENERATOR_LLM_TOOLS.find(candidate => candidate.name === name)
    if (tool === undefined) throw new Error(`Missing generator tool schema: ${name}`)
    return tool
  })
}

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
    searchedCdmClasses: new Set(),
    lookupEligibleCdmClasses: new Set(),
    approvedCdmClasses: new Set(),
    rejectedCdmClasses: new Map(),
    rejectedBuilderClasses: new Map(),
    strictCdmLookup: true,
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
  if (name === 'write_generated_java_file') return writeGeneratedJavaFileTool(context, input)
  if (name === 'run_command') return runCommandTool(context.config, input)
  if (name === 'validate_generated_output') return validateGeneratedOutputTool(context.config)
  if (name === 'get_scope_evidence') return getScopeEvidenceTool(context.config)
  if (name === 'get_context_packet') return getContextPacketTool(context.config, input)
  if (name === 'get_fixture_summary') return getFixtureSummaryTool(context.config, input)
  if (name === 'get_expected_cdm_summary') return getExpectedCdmSummaryTool(context.config, input)
  if (name === 'get_rosetta_snippets') return getRosettaSnippetsTool(context.config)
  if (name === 'get_rosetta_snippet') return getRosettaSnippetTool(context.config, input)
  if (name === 'get_rosetta_product_pack') return getRosettaProductPackTool(input)
  if (name === 'get_rosetta_function') return getRosettaFunctionTool(input)
  if (name === 'get_rosetta_functions') return getRosettaFunctionsTool(input)
  if (name === 'search_rosetta_blocks') return searchRosettaBlocksTool(input)
  if (name === 'get_rosetta_mapping_area') return getRosettaMappingAreaTool(input)
  if (name === 'get_rosetta_generation_context') return getRosettaGenerationContextTool(context.config)
  if (name === 'get_rosetta_call_graph') return getRosettaCallGraphTool()
  if (name === 'get_cdm_rosetta_preflight') return getCdmRosettaPreflightTool(context.config)
  if (name === 'get_cdm_java_api_summary') return getCdmJavaApiSummaryTool(context.config)
  if (name === 'get_cdm_java_api_pack') return getCdmJavaApiPackTool(context.config)
  if (name === 'get_cdm_java_class') return getCdmJavaClassTool(context, input)
  if (name === 'get_cdm_enum_constants') return getCdmEnumConstantsTool(context, input)
  if (name === 'search_cdm_java_classes') return searchCdmJavaClassesTool(context, input)
  if (name === 'resolve_cdm_concept') return resolveCdmConceptTool(context, input)
  if (name === 'get_cdm_builder_methods') return getCdmBuilderMethodsTool(context, input)
  if (name === 'get_related_cdm_classes') return getRelatedCdmClassesTool(context, input)
  if (name === 'get_approved_cdm_api_contract') return getApprovedCdmApiContractTool(context.config, context.state)
  if (name === 'get_cdm_semantic_recipe') return getCdmSemanticRecipeTool(context.config, input)
  if (name === 'get_cdm_java_missing_classes') return getCdmJavaMissingClassesTool()
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

async function getFixtureSummaryTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  return parseXmlSummaryTool(config, { ...input, path: resolveFixtureInputPath(config, requireString(input.path, 'path')) })
}

async function getExpectedCdmSummaryTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  return parseJsonSummaryTool(config, { ...input, path: resolveExpectedInputPath(config, requireString(input.path, 'path')) })
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

async function writeGeneratedJavaFileTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const path = requireString(input.path, 'path')
  const content = requireString(input.content, 'content')
  const relativePath = normalizeWritePath(context.config, path)
  assertGeneratedJavaWritePath(relativePath)
  assertStageWriteAllowed(context.stage, relativePath)
  const contractError = validateGeneratedJavaFileContent(relativePath, content)
  if (contractError !== null) {
    return { ok: false, output: contractError, sourcePaths: [] }
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
  const authoritativeRosettaSection = topic.toLowerCase().includes('rosetta')
    ? `\n\n${(await getRosettaGenerationContextTool(config)).output}`
    : ''
  const cdmJavaApiSection = topic.toLowerCase().includes('cdm') || topic.toLowerCase().includes('java')
    ? `\n\n${(await getCdmJavaApiSummaryTool(config)).output}`
    : ''
  return {
    ok: true,
    output: truncateForLog(
      [
        `# Context Packet`,
        `Role: ${role}`,
        `Topic: ${topic}`,
        ...contents,
        fixtureSections,
        rosettaSection,
        authoritativeRosettaSection,
        cdmJavaApiSection,
      ].join('\n\n'),
      32_000
    ),
    sourcePaths: paths,
  }
}

async function getCdmJavaApiSummaryTool(config: GeneratorRunConfig): Promise<ToolResult> {
  await ensureCdmJavaApiPack()
  const path = resolve(config.runOutputDir, 'agent-workspace', 'cdm-java-api-summary.md')
  if (await exists(path)) {
    return { ok: true, output: truncateForLog(await readFile(path, 'utf8'), 16_000), sourcePaths: [path] }
  }
  const summaryPath = cdmJavaApiSummaryMarkdownPath()
  return { ok: true, output: truncateForLog(await readFile(summaryPath, 'utf8'), 16_000), sourcePaths: [summaryPath] }
}

async function getCdmJavaApiPackTool(config: GeneratorRunConfig): Promise<ToolResult> {
  await ensureCdmJavaApiPack()
  const path = resolve(config.runOutputDir, 'agent-workspace', 'cdm-java-api-pack.md')
  if (await exists(path)) {
    return { ok: true, output: truncateForLog(await readFile(path, 'utf8'), 16_000), sourcePaths: [path] }
  }
  const packPath = cdmJavaFxSingleLegPackMarkdownPath()
  return { ok: true, output: truncateForLog(await readFile(packPath, 'utf8'), 16_000), sourcePaths: [packPath] }
}

async function getCdmJavaClassTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const className = requireString(input.className, 'className')
  assertFullyQualifiedClassName(className)
  await loadApprovedCdmClasses(context)
  if (
    context.state.strictCdmLookup
    && !context.state.lookupEligibleCdmClasses.has(className)
    && !context.state.approvedCdmClasses.has(className)
  ) {
    context.state.rejectedCdmClasses.set(className, 'Exact lookup blocked until discovery selects or approves this class.')
    return {
      ok: false,
      output: [
        `Exact lookup blocked until discovery selects or approves this class: ${className}`,
        'Use resolve_cdm_concept first, or inspect approved-cdm-api-contract.md for approved classes.',
        'search_cdm_java_classes is summary-only and does not unlock exact lookup.',
      ].join('\n'),
      sourcePaths: [cdmJavaApiIndexPath()],
    }
  }
  await ensureCdmJavaApiPack()
  const result = await lookupCdmJavaClassDetails(className)
  if (result.status === 'missing') {
    context.state.rejectedCdmClasses.set(className, `Exact class not found in org.finos.cdm:cdm-java:${CDM_JAVA_VERSION}.`)
    return {
      ok: false,
      output: [
        `Exact class not found in org.finos.cdm:cdm-java:${CDM_JAVA_VERSION}: ${result.className}`,
        result.sameSimpleNameCandidates.length === 0
          ? 'No same-simple-name candidates exist in the jar.'
          : `Same-simple-name candidates in the jar:\n${result.sameSimpleNameCandidates.map(candidate => `- ${candidate}`).join('\n')}`,
        'Do not generalize this result to other packages. Query the exact fully qualified class you intend to use.',
      ].join('\n\n'),
      sourcePaths: [cdmJavaApiIndexPath()],
    }
  }
  context.state.lookupEligibleCdmClasses.add(className)
  return {
    ok: true,
    output: truncateForLog(
      [
        'Lookup status: found',
        `Lookup source: ${result.source}`,
        JSON.stringify(result.details, null, 2),
      ].join('\n\n'),
      32_000
    ),
    sourcePaths: [cdmJavaClassDetailsPath(className)],
  }
}

async function getCdmEnumConstantsTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const className = requireString(input.className, 'className')
  const classResult = await getCdmJavaClassTool(context, { className })
  if (!classResult.ok) return classResult
  const lookup = await lookupCdmJavaClassDetails(className)
  if (lookup.status === 'missing') {
    return {
      ok: false,
      output: `Exact enum class not found: ${className}`,
      sourcePaths: [cdmJavaApiIndexPath()],
    }
  }
  const values = lookup.details.enumValues ?? []
  return {
    ok: values.length > 0,
    output: values.length === 0
      ? `${className} is not an enum or no enum constants were detected.`
      : [`# Enum Constants: ${className}`, ...values.map(value => `- ${value}`)].join('\n'),
    sourcePaths: [cdmJavaClassDetailsPath(className)],
  }
}

async function searchCdmJavaClassesTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const pattern = requireString(input.pattern, 'pattern').toLowerCase()
  await ensureCdmJavaApiPack()
  const index = await readCdmJavaApiIndex()
  const matches = index.classes
    .filter(entry => entry.className.toLowerCase().includes(pattern))
    .slice(0, 100)
    .map(entry => {
      const seedStatus = index.promptSeedClasses.includes(entry.className) ? 'prompt-seed' : 'indexed-only'
      context.state.searchedCdmClasses.add(entry.className)
      return `${entry.className} (${seedStatus})`
    })
  return {
    ok: true,
    output: matches.length === 0 ? 'No CDM Java classes matched.' : matches.join('\n'),
    sourcePaths: [cdmJavaFxSingleLegPackMarkdownPath()],
  }
}

async function resolveCdmConceptTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const conceptText = requireString(input.concept, 'concept')
  await ensureCdmJavaApiPack()
  const index = await readCdmJavaApiIndex()
  const discoveryPath = relevantCdmApiDiscoveryJsonPath(context.config.runOutputDir)
  const discovery = await readRelevantCdmApiDiscovery(discoveryPath)
  const existing = discovery.resolvedConcepts.find(item =>
    item.concept.toLowerCase() === conceptText.toLowerCase()
      || item.concept.toLowerCase().includes(conceptText.toLowerCase())
  )
  const resolved = existing ?? resolveConcept(index, {
    concept: conceptText,
    searchTerms: conceptText.split(/\s+/u).filter(Boolean),
    preferredPackages: discovery.relevantPackages,
    purpose: 'Ad hoc concept requested by generator role.',
  })
  if (resolved.selectedClassName) context.state.lookupEligibleCdmClasses.add(resolved.selectedClassName)
  for (const candidate of resolved.candidates) {
    context.state.searchedCdmClasses.add(candidate)
  }
  return {
    ok: resolved.status !== 'missing',
    output: [
      `Concept: ${resolved.concept}`,
      `Status: ${resolved.status}`,
      `Selected: ${resolved.selectedClassName || 'none'}`,
      `Reason: ${resolved.reason}`,
      `Candidates:\n${resolved.candidates.length === 0 ? '- none' : resolved.candidates.map(candidate => `- ${candidate}`).join('\n')}`,
    ].join('\n\n'),
    sourcePaths: [discoveryPath, cdmJavaApiIndexPath()],
  }
}

async function getCdmBuilderMethodsTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const className = requireString(input.className, 'className')
  const intent = requireString(input.intent, 'intent').toLowerCase()
  assertFullyQualifiedClassName(className)
  const contract = await readApprovedCdmApiContract(approvedCdmApiContractJsonPath(context.config.runOutputDir))
  for (const item of contract.approvedClasses) {
    context.state.approvedCdmClasses.add(item.className)
  }
  if (!contract.approvedClasses.some(item => item.className === className)) {
    context.state.rejectedBuilderClasses.set(className, 'Class is not approved by approved-cdm-api-contract.json.')
    return {
      ok: false,
      output: `Class is not approved by approved-cdm-api-contract.json: ${className}`,
      sourcePaths: [approvedCdmApiContractJsonPath(context.config.runOutputDir)],
    }
  }
  const matchingMethods = contract.approvedBuilderMethods.filter(method =>
    method.className === className && builderMethodMatchesIntent(method, intent)
  )
  return {
    ok: true,
    output: matchingMethods.length === 0
      ? `No approved builder methods matched intent "${intent}" for ${className}. Use get_cdm_java_class for exact full details before changing the contract.`
      : matchingMethods.map(method => `${method.methodName}: ${method.rawSignature}`).join('\n'),
    sourcePaths: [approvedCdmApiContractJsonPath(context.config.runOutputDir)],
  }
}

function builderMethodMatchesIntent(method: ApprovedBuilderMethod, intent: string): boolean {
  if (intent === 'all') return true
  const normalizedIntent = normalizeLookupToken(intent)
  return [
    method.intent,
    method.methodName,
    method.rawSignature,
    ...method.parameterTypes,
    method.returnType,
  ].some(value => {
    const lower = value.toLowerCase()
    return lower.includes(intent) || normalizeLookupToken(value).includes(normalizedIntent)
  })
}

function normalizeLookupToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/gu, '')
}

async function getRelatedCdmClassesTool(context: ToolContext, input: ToolInput): Promise<ToolResult> {
  const className = requireString(input.className, 'className')
  assertFullyQualifiedClassName(className)
  const index = await readCdmJavaApiIndex()
  const simpleName = className.split('.').at(-1) ?? className
  const packageName = className.split('.').slice(0, -1).join('.')
  const contract = await readApprovedCdmApiContract(approvedCdmApiContractJsonPath(context.config.runOutputDir))
  const approved = new Set(contract.approvedClasses.map(item => item.className))
  const matches = index.classes
    .filter(entry => entry.simpleName === simpleName || entry.packageName === packageName)
    .slice(0, 100)
  for (const match of matches) {
    context.state.searchedCdmClasses.add(match.className)
  }
  return {
    ok: true,
    output: matches.length === 0
      ? 'No related classes found.'
      : matches.map(entry => `${entry.className} (${approved.has(entry.className) ? 'approved' : 'indexed-only'})`).join('\n'),
    sourcePaths: [cdmJavaApiIndexPath(), approvedCdmApiContractJsonPath(context.config.runOutputDir)],
  }
}

async function getApprovedCdmApiContractTool(config: GeneratorRunConfig, state?: ToolExecutionState): Promise<ToolResult> {
  const summaryPath = approvedCdmApiContractSummaryPath(config.runOutputDir)
  const markdownPath = (await exists(summaryPath))
    ? summaryPath
    : approvedCdmApiContractMarkdownPath(config.runOutputDir)
  const content = await readFile(markdownPath, 'utf8')
  if (state !== undefined) {
    const contract = await readApprovedCdmApiContract(approvedCdmApiContractJsonPath(config.runOutputDir))
    for (const item of contract.approvedClasses) {
      state.approvedCdmClasses.add(item.className)
    }
  }
  return {
    ok: true,
    output: content,
    sourcePaths: [markdownPath],
  }
}

async function getCdmSemanticRecipeTool(config: GeneratorRunConfig, input: ToolInput): Promise<ToolResult> {
  const recipeId = requireString(input.recipeId, 'recipeId')
  const path = semanticRecipesJsonPath(config.runOutputDir)
  const bundle = await readSemanticRecipeBundle(path)
  if (recipeId.toLowerCase() === 'all') {
    return {
      ok: true,
      output: renderSemanticRecipeBundle(bundle),
      sourcePaths: [path],
    }
  }
  const recipe = bundle.recipes.find(item => item.id === recipeId)
  if (recipe === undefined) {
    return {
      ok: false,
      output: `Semantic recipe not found: ${recipeId}`,
      sourcePaths: [path],
    }
  }
  return {
    ok: true,
    output: renderSemanticRecipeBundle({ ...bundle, recipes: [recipe] }),
    sourcePaths: [path],
  }
}

async function getCdmJavaMissingClassesTool(): Promise<ToolResult> {
  await ensureCdmJavaApiPack()
  return {
    ok: true,
    output: await renderCdmJavaMissingClassesMarkdownFromDisk(),
    sourcePaths: [cdmJavaMissingClassesPath()],
  }
}

async function loadApprovedCdmClasses(context: ToolContext): Promise<void> {
  const contractPath = approvedCdmApiContractJsonPath(context.config.runOutputDir)
  if (!(await exists(contractPath))) return
  const contract = await readApprovedCdmApiContract(contractPath)
  for (const item of contract.approvedClasses) {
    context.state.approvedCdmClasses.add(item.className)
  }
}

async function getRosettaGenerationContextTool(config: GeneratorRunConfig): Promise<ToolResult> {
  const path = resolve(config.runOutputDir, 'agent-workspace', 'rosetta-generation-context.md')
  if (await exists(path)) {
    const content = await readFile(path, 'utf8')
    return { ok: true, output: truncateForLog(content, 48_000), sourcePaths: [path] }
  }
  const context = await buildRosettaGenerationContext()
  return {
    ok: true,
    output: truncateForLog(renderRosettaGenerationContext(context), 48_000),
    sourcePaths: [resolve('data/rosetta-source/latest/extracted/blocks.json')],
  }
}

async function getRosettaCallGraphTool(): Promise<ToolResult> {
  const context = await buildRosettaGenerationContext()
  return {
    ok: true,
    output: truncateForLog(renderRosettaCallGraph(context), 24_000),
    sourcePaths: [resolve('data/rosetta-source/latest/extracted/blocks.json')],
  }
}

async function getCdmRosettaPreflightTool(config: GeneratorRunConfig): Promise<ToolResult> {
  if (config.cdmRosettaPreflight !== undefined) {
    return {
      ok: true,
      output: truncateForLog(renderCdmRosettaPreflightMarkdown(config.cdmRosettaPreflight), 16_000),
      sourcePaths: [config.cdmRosettaPreflight.markdownPath],
    }
  }
  const path = resolve(config.runOutputDir, 'agent-workspace', 'cdm-rosetta-preflight.md')
  const content = await readFile(path, 'utf8')
  return { ok: true, output: truncateForLog(content, 16_000), sourcePaths: [path] }
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

async function getRosettaProductPackTool(input: ToolInput): Promise<ToolResult> {
  const productFamily = requireString(input.productFamily, 'productFamily')
  const result = await getRosettaProductPack(productFamily)
  return {
    ok: result.ok,
    output: truncateForLog(renderRosettaRetrievalResult(result), 32_000),
    sourcePaths: result.sourcePaths,
  }
}

async function getRosettaFunctionTool(input: ToolInput): Promise<ToolResult> {
  const functionName = requireString(input.functionName, 'functionName')
  const result = await getRosettaFunction(functionName)
  return {
    ok: result.ok,
    output: truncateForLog(renderRosettaRetrievalResult(result), 32_000),
    sourcePaths: result.sourcePaths,
  }
}

async function getRosettaFunctionsTool(input: ToolInput): Promise<ToolResult> {
  const functionNames = requireString(input.functionNames, 'functionNames')
    .split(',')
    .map(name => name.trim())
    .filter(Boolean)
  const result = await getRosettaFunctions(functionNames)
  return {
    ok: result.ok,
    output: truncateForLog(renderRosettaRetrievalResult(result), 48_000),
    sourcePaths: result.sourcePaths,
  }
}

async function searchRosettaBlocksTool(input: ToolInput): Promise<ToolResult> {
  const query = requireString(input.query, 'query')
  const productFamily = requireString(input.productFamily, 'productFamily')
  const result = await searchRosettaBlocks({ query, productFamily, limit: 20 })
  return {
    ok: result.ok,
    output: truncateForLog(renderRosettaRetrievalResult(result), 48_000),
    sourcePaths: result.sourcePaths,
  }
}

async function getRosettaMappingAreaTool(input: ToolInput): Promise<ToolResult> {
  const productFamily = requireString(input.productFamily, 'productFamily')
  const implementationGroup = requireString(input.implementationGroup, 'implementationGroup')
  const area = parseRosettaMappingArea(requireString(input.area, 'area'))
  const result = await getRosettaMappingArea({ productFamily, implementationGroup, area })
  return {
    ok: result.ok,
    output: truncateForLog(renderRosettaRetrievalResult(result), 48_000),
    sourcePaths: result.sourcePaths,
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

function parseRosettaMappingArea(value: string): RosettaMappingArea {
  const allowed: RosettaMappingArea[] = [
    'product-root',
    'economic-terms',
    'settlement-payout',
    'price-quantity',
    'party-counterparty',
    'account-party-reference',
    'product-identifiers-taxonomy',
    'dates-settlement',
  ]
  const found = allowed.find(area => area === value)
  if (found === undefined) {
    throw new Error(`Unsupported Rosetta mapping area: ${value}`)
  }
  return found
}

function requireString(value: string | undefined, field: string): string {
  if (!value) throw new Error(`Missing required tool input: ${field}`)
  return value
}

function assertFullyQualifiedClassName(className: string): void {
  if (!/^(cdm|com\.rosetta)\.[A-Za-z0-9_$.]+$/u.test(className)) {
    throw new Error(
      `get_cdm_java_class requires a fully qualified class name. Use search_cdm_java_classes for simple names: ${className}`
    )
  }
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

function resolveFixtureInputPath(config: GeneratorRunConfig, value: string): string {
  const fixture = config.runtimeFixtures.find(item => item.id === value || item.fixtureFileName === value)
  return fixture?.fpmlPath ?? value
}

function resolveExpectedInputPath(config: GeneratorRunConfig, value: string): string {
  const fixture = config.runtimeFixtures.find(item => item.id === value || item.fixtureFileName === value)
  return fixture?.expectedCdmPath ?? value
}

function assertGeneratedJavaWritePath(relativePath: string): void {
  if (!relativePath.endsWith('.java')) {
    throw new Error(`write_generated_java_file path must end with .java: ${relativePath}`)
  }
  if (!pathMatches(`${GENERATED_IMPL_SOURCE_ROOT}/**`, relativePath)) {
    throw new Error(
      `write_generated_java_file can only write under ${GENERATED_IMPL_SOURCE_ROOT}/; received ${relativePath}`
    )
  }
}

function validateGeneratedJavaFileContent(relativePath: string, content: string): string | null {
  const className = javaClassNameFromPath(relativePath)
  const expectedPackage = javaPackageFromGeneratedPath(relativePath)
  if (!content.includes(`package ${expectedPackage};`)) {
    return `${relativePath} must declare package ${expectedPackage}.`
  }
  if (!new RegExp(`\\bpublic\\s+(?:final\\s+)?class\\s+${className}\\b`, 'u').test(content)) {
    return `${relativePath} must declare public class ${className}.`
  }
  return null
}

function javaClassNameFromPath(relativePath: string): string {
  const fileName = relativePath.split('/').at(-1)
  if (fileName === undefined || !fileName.endsWith('.java')) {
    throw new Error(`Invalid Java source path: ${relativePath}`)
  }
  return fileName.slice(0, -'.java'.length)
}

function javaPackageFromGeneratedPath(relativePath: string): string {
  const normalized = normalizeSeparators(relativePath)
  const directory = normalized.slice(0, normalized.lastIndexOf('/'))
  const suffix = directory.slice(GENERATED_IMPL_SOURCE_ROOT.length).replace(/^\//u, '')
  if (suffix.length === 0) return GENERATED_IMPL_PACKAGE
  return `${GENERATED_IMPL_PACKAGE}.${suffix.replace(/\//gu, '.')}`
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
