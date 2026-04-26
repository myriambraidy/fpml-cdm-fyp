import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { LLMClient } from '../agent/types'
import { parseJSON } from '../parser/json-parser'
import { parseXML } from '../parser/xml-parser'
import type { DraftLogger } from './logging'
import { extractPossiblyTruncatedJsonObject, parseStructuredResponse, readUtf8 } from './io'
import { buildPairAnalysisMessages } from './prompts'
import type {
  DraftPair,
  DraftPairAnalysis,
  PairDocumentSummary,
  PairHighlight,
} from './types'

const PairDocumentSummarySchema = z.object({
  format: z.enum(['xml', 'json']),
  root: z.string().min(1),
  topLevelSections: z.array(z.string()),
  structuralNotes: z.array(z.string()),
  headerBoilerplateSignals: z.array(z.string()),
  nestedStructureSignals: z.array(z.string()),
  samplePaths: z.array(z.string()),
  rawFieldCount: z.number().int().nonnegative(),
})

const ObservationConfidenceSchema = z.enum(['high', 'medium', 'low'])

const MappingObservationSchema = z.object({
  sourcePaths: z.array(z.string()),
  targetPaths: z.array(z.string()),
  classification: z.enum(['direct', 'normalized', 'enriched', 'unclear']),
  mappingNote: z.string().min(1),
  confidence: ObservationConfidenceSchema,
  whyNote: z.string(),
})

const TransformationObservationSchema = z.object({
  type: z.enum([
    'split',
    'merge',
    'normalization',
    'reference_resolution',
    'enrichment',
    'wrapper_insertion',
    'nesting_change',
  ]),
  sourcePaths: z.array(z.string()),
  targetPaths: z.array(z.string()),
  transformationNote: z.string().min(1),
  confidence: ObservationConfidenceSchema,
})

const EnrichmentObservationSchema = z.object({
  targetPaths: z.array(z.string()),
  enrichmentNote: z.string().min(1),
  confidence: ObservationConfidenceSchema,
})

const PairAnalysisEnvelopeSchema = z.object({
  productOrTradeFamily: z.string(),
  mappingObservations: z.array(MappingObservationSchema),
  transformations: z.array(TransformationObservationSchema),
  enrichments: z.array(EnrichmentObservationSchema),
  openQuestions: z.array(z.string()),
})

type PairAnalysisEnvelope = z.infer<typeof PairAnalysisEnvelopeSchema>
type PairAnalysisRecoveredEnvelope = PairAnalysisEnvelope & { pairHighlight: PairHighlight }
type ParsedField = ReturnType<typeof parseXML>[number]

const PATH_LIMIT = 10
const STRUCTURE_LIMIT = 8
const RAW_RESPONSE_PREVIEW_LIMIT = 1200

function uniqueStrings(items: string[]): string[] {
  return Array.from(new Set(items.filter(Boolean)))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function sanitizeStringList(value: unknown, limit?: number): string[] {
  const result = Array.isArray(value)
    ? uniqueStrings(
        value.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean)
      )
    : []
  return typeof limit === 'number' ? result.slice(0, limit) : result
}

function sanitizeArrayItems<T>(value: unknown, schema: z.ZodType<T>): T[] {
  if (!Array.isArray(value)) return []
  const items: T[] = []
  for (const candidate of value) {
    const parsed = schema.safeParse(candidate)
    if (parsed.success) {
      items.push(parsed.data)
    }
  }
  return items
}

function summarizeFields(fields: ParsedField[], format: 'xml' | 'json'): PairDocumentSummary {
  const root = extractRoot(fields, format)
  const topLevelSections = uniqueStrings(
    fields.map(field => extractTopLevelSection(field.path, format)).filter(Boolean) as string[]
  ).slice(0, STRUCTURE_LIMIT)
  const samplePaths = uniqueStrings(fields.map(field => field.path)).slice(0, PATH_LIMIT)
  const headerBoilerplateSignals = uniqueStrings(
    fields
      .map(field => field.path)
      .filter(path =>
        /(^\/[^/]+\/header)|tradeHeader|conversationId|messageId|partyTradeIdentifier|counterparty|tradeIdentifier|meta/i.test(
          path
        )
      )
  ).slice(0, STRUCTURE_LIMIT)
  const nestedStructureSignals = deriveNestedSignals(fields, format)
  const structuralNotes = buildStructuralNotes({
    root,
    topLevelSections,
    headerBoilerplateSignals,
    nestedStructureSignals,
  })

  return {
    format,
    root,
    topLevelSections,
    structuralNotes,
    headerBoilerplateSignals,
    nestedStructureSignals,
    samplePaths,
    rawFieldCount: fields.length,
  }
}

function extractRoot(fields: ParsedField[], format: 'xml' | 'json'): string {
  const first = fields[0]?.path ?? ''
  if (!first) return format === 'xml' ? 'unknown-xml-root' : '$'
  if (format === 'xml') {
    return first.split('/').filter(Boolean)[0] ?? 'unknown-xml-root'
  }
  return '$'
}

function cleanPathSegments(path: string, format: 'xml' | 'json'): string[] {
  if (format === 'xml') {
    return path.split('/').filter(Boolean).map(segment => segment.replace(/\[\d+\]/g, ''))
  }
  return path
    .replace(/^\$\./, '')
    .split('.')
    .filter(Boolean)
    .map(segment => segment.replace(/\[\d+\]/g, ''))
}

function extractTopLevelSection(path: string, format: 'xml' | 'json'): string | undefined {
  const segments = cleanPathSegments(path, format)
  if (segments.length === 0) return undefined
  if (format === 'xml') return segments[1] ?? segments[0]
  return segments[0]
}

function deriveNestedSignals(fields: ParsedField[], format: 'xml' | 'json'): string[] {
  const counts = new Map<string, number>()
  for (const field of fields) {
    const segments = cleanPathSegments(field.path, format)
    if (format === 'xml' && segments.length >= 3) {
      const key = `${segments[1]} > ${segments[2]}`
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    if (format === 'json' && segments.length >= 2) {
      const key = `${segments[0]} > ${segments[1]}`
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, STRUCTURE_LIMIT)
    .map(([key, count]) => `${key} (${count} paths)`)
}

function buildStructuralNotes(args: {
  root: string
  topLevelSections: string[]
  headerBoilerplateSignals: string[]
  nestedStructureSignals: string[]
}): string[] {
  const notes: string[] = []
  notes.push(`Document root is ${args.root}.`)
  if (args.topLevelSections.length) {
    notes.push(`Top-level sections include ${args.topLevelSections.join(', ')}.`)
  }
  if (args.headerBoilerplateSignals.length) {
    notes.push(`Header or boilerplate signals were detected in ${args.headerBoilerplateSignals.length} paths.`)
  }
  if (args.nestedStructureSignals.length) {
    notes.push(`Repeated nested structures include ${args.nestedStructureSignals.slice(0, 3).join('; ')}.`)
  }
  return notes
}

function parseDocument(raw: string, format: 'xml' | 'json'): PairDocumentSummary {
  const fields = format === 'xml' ? parseXML(raw) : parseJSON(raw)
  return summarizeFields(fields, format)
}

function buildFallbackHighlight(args: {
  pair: DraftPair
  fpmlSummary: PairDocumentSummary
  cdmSummary: PairDocumentSummary
}): PairHighlight {
  return {
    fpmlFile: args.pair.fpmlRelativePath,
    cdmFile: args.pair.cdmRelativePath,
    mainFpmlSections: args.fpmlSummary.topLevelSections.join(', ') || 'No strong evidence yet.',
    mainCdmSections: args.cdmSummary.topLevelSections.join(', ') || 'No strong evidence yet.',
    importantMappings: ['No live LLM analysis was available for this pair.'],
    importantTransformation: 'No live LLM analysis was available for this pair.',
    uncertainty: ['Mapping interpretation still requires live LLM analysis.'],
  }
}

function buildFallbackAnalysis(args: {
  pair: DraftPair
  fpmlSummary: PairDocumentSummary
  cdmSummary: PairDocumentSummary
}): Omit<PairAnalysisEnvelope, 'pairHighlight'> {
  return {
    productOrTradeFamily: args.pair.folder,
    mappingObservations: [],
    transformations: [],
    enrichments: [],
    openQuestions: [
      'No live LLM analysis was available, so this pair only contributes deterministic structural summaries.',
    ],
  }
}

function buildDerivedPairHighlight(args: {
  pair: DraftPair
  fpmlSummary: PairDocumentSummary
  cdmSummary: PairDocumentSummary
  mappingObservations: PairAnalysisEnvelope['mappingObservations']
  transformations: PairAnalysisEnvelope['transformations']
  openQuestions: string[]
}): PairHighlight {
  const derivedMappings = args.mappingObservations
    .slice(0, 4)
    .map(observation => observation.mappingNote)
    .filter(Boolean)
  return {
    fpmlFile: args.pair.fpmlRelativePath,
    cdmFile: args.pair.cdmRelativePath,
    mainFpmlSections: args.fpmlSummary.topLevelSections.join(', ') || 'No strong evidence yet.',
    mainCdmSections: args.cdmSummary.topLevelSections.join(', ') || 'No strong evidence yet.',
    importantMappings:
      derivedMappings.length > 0 ? derivedMappings : ['Recovered partial semantic evidence; mapping details are incomplete.'],
    importantTransformation:
      args.transformations[0]?.transformationNote ??
      (args.mappingObservations.length > 0
        ? 'Recovered partial semantic evidence; transformation details are incomplete.'
        : 'No live LLM analysis was available for this pair.'),
    uncertainty:
      args.openQuestions.length > 0
        ? args.openQuestions.slice(0, 4)
        : ['Mapping interpretation still requires live LLM analysis.'],
  }
}

function salvagePairAnalysisEnvelope(args: {
  rawResponse: string
  pair: DraftPair
  fpmlSummary: PairDocumentSummary
  cdmSummary: PairDocumentSummary
}): PairAnalysisRecoveredEnvelope | undefined {
  let partial: unknown
  try {
    partial = extractPossiblyTruncatedJsonObject(args.rawResponse)
  } catch {
    return undefined
  }

  if (!isRecord(partial)) {
    return undefined
  }

  const mappingObservations = sanitizeArrayItems(partial.mappingObservations, MappingObservationSchema)
  const transformations = sanitizeArrayItems(partial.transformations, TransformationObservationSchema)
  const enrichments = sanitizeArrayItems(partial.enrichments, EnrichmentObservationSchema)
  const openQuestions = sanitizeStringList(partial.openQuestions, 3)
  const pairHighlight = buildDerivedPairHighlight({
    pair: args.pair,
    fpmlSummary: args.fpmlSummary,
    cdmSummary: args.cdmSummary,
    mappingObservations,
    transformations,
    openQuestions,
  })
  const productOrTradeFamily =
    typeof partial.productOrTradeFamily === 'string' && partial.productOrTradeFamily.trim()
      ? partial.productOrTradeFamily
      : args.pair.folder

  if (
    mappingObservations.length === 0 &&
    transformations.length === 0 &&
    enrichments.length === 0 &&
    openQuestions.length === 0 &&
    pairHighlight.importantMappings[0] === 'Recovered partial semantic evidence; mapping details are incomplete.'
  ) {
    return undefined
  }

  return {
    productOrTradeFamily,
    mappingObservations,
    transformations,
    enrichments,
    openQuestions,
    pairHighlight,
  }
}

function estimatePromptChars(messages: Array<{ role: 'system' | 'user'; content: string }>): number {
  return messages.reduce((sum, message) => sum + message.content.length, 0)
}

function clipRawResponse(raw: string): string {
  return raw.length <= RAW_RESPONSE_PREVIEW_LIMIT
    ? raw
    : `${raw.slice(0, RAW_RESPONSE_PREVIEW_LIMIT)}...[truncated preview]`
}

function isTruncatedStructuredOutput(raw: string, errorMessage: string): boolean {
  if (/Unexpected EOF|Unterminated string/i.test(errorMessage)) {
    return true
  }
  const trimmed = raw.trim()
  return trimmed.startsWith('{') && !trimmed.endsWith('}')
}

function computeRetryMaxTokens(maxTokens: number): number {
  return Math.max(1200, Math.floor(maxTokens * 0.7))
}

export async function analyzeDraftPair(args: {
  pair: DraftPair
  llm?: LLMClient
  logger?: DraftLogger
  model?: string
  maxTokens?: number
  maxRetries?: number
  storeFailedRawResponses?: boolean
}): Promise<DraftPairAnalysis> {
  const {
    pair,
    llm,
    logger,
    model,
    maxTokens = 3000,
    maxRetries = 1,
    storeFailedRawResponses = true,
  } = args
  const startedAt = Date.now()
  const [fpmlRaw, cdmRaw] = await Promise.all([
    readUtf8(pair.fpmlAbsolutePath),
    readUtf8(pair.cdmAbsolutePath),
  ])
  const fpmlSummary = parseDocument(fpmlRaw, 'xml')
  const cdmSummary = parseDocument(cdmRaw, 'json')

  if (!llm) {
    logger?.warn('pair_analysis', 'Live LLM disabled for pair; using deterministic fallback only.', {
      pair: pair.fpmlRelativePath,
    })
    const envelope = buildFallbackAnalysis({ pair, fpmlSummary, cdmSummary })
    return {
      pair,
      status: 'failed',
      failureReason: 'Live LLM disabled',
      failureKind: 'llm_disabled',
      productOrTradeFamily: envelope.productOrTradeFamily,
      fpmlSummary,
      cdmSummary,
      mappingObservations: [],
      transformations: [],
      enrichments: [],
      openQuestions: envelope.openQuestions,
      pairHighlight: buildFallbackHighlight({ pair, fpmlSummary, cdmSummary }),
      semanticRecovery: 'none',
      modelUsed: model,
    }
  }

  const responseFormat = {
    type: 'json_schema' as const,
    json_schema: {
      name: 'draft_pair_analysis',
      strict: true,
      schema: zodToJsonSchema(PairAnalysisEnvelopeSchema, {
        $refStrategy: 'none',
      }) as Record<string, unknown>,
    },
  }

  let rawResponse = ''
  let lastPromptChars = 0
  let lastErrorMessage = ''

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const retryMode = attempt > 0
    const messages = buildPairAnalysisMessages({
      pair,
      fpmlRaw,
      cdmRaw,
      fpmlSummary,
      cdmSummary,
      retryMode,
    })
    const promptChars = estimatePromptChars(messages)
    const attemptMaxTokens = retryMode ? computeRetryMaxTokens(maxTokens) : maxTokens
    lastPromptChars = promptChars

    try {
      logger?.info('pair_analysis', 'Sending pair analysis request to LLM.', {
        pair: pair.fpmlRelativePath,
        model: model ?? null,
        maxTokens: attemptMaxTokens,
        promptChars,
        retryAttempt: attempt,
        fpmlChars: fpmlRaw.length,
        cdmChars: cdmRaw.length,
        fpmlFields: fpmlSummary.rawFieldCount,
        cdmFields: cdmSummary.rawFieldCount,
      })

      const response = await llm.call({
        messages,
        model,
        maxTokens: attemptMaxTokens,
        responseFormat,
      })
      rawResponse = response.content
    } catch (error) {
      logger?.error('pair_analysis', 'Pair analysis request failed; excluding pair from semantic synthesis.', {
        pair: pair.fpmlRelativePath,
        model: model ?? null,
        durationMs: Date.now() - startedAt,
        retryAttempt: attempt,
        error: error instanceof Error ? error.message : String(error),
      })
      const envelope = buildFallbackAnalysis({ pair, fpmlSummary, cdmSummary })
      return {
        pair,
        status: 'failed',
        failureReason: error instanceof Error ? error.message : String(error),
        failureKind: 'request_error',
        productOrTradeFamily: envelope.productOrTradeFamily,
        fpmlSummary,
        cdmSummary,
        mappingObservations: [],
        transformations: [],
        enrichments: [],
        openQuestions: envelope.openQuestions,
        pairHighlight: buildFallbackHighlight({ pair, fpmlSummary, cdmSummary }),
        semanticRecovery: 'none',
        modelUsed: model,
        promptChars,
      }
    }

    if (!rawResponse.trim()) {
      lastErrorMessage = 'Empty structured response'
      if (attempt < maxRetries) {
        logger?.warn('pair_analysis', 'Pair analysis returned empty structured content; retrying with a smaller request.', {
          pair: pair.fpmlRelativePath,
          model: model ?? null,
          retryAttempt: attempt + 1,
        })
        continue
      }
    } else {
      try {
        const envelope = parseStructuredResponse(rawResponse, PairAnalysisEnvelopeSchema)
        logger?.info('pair_analysis', 'Pair analysis completed successfully.', {
          pair: pair.fpmlRelativePath,
          model: model ?? null,
          durationMs: Date.now() - startedAt,
          promptChars,
          responseChars: rawResponse.length,
          retryAttempt: attempt,
        })
        return {
          pair,
          status: 'success',
          productOrTradeFamily: envelope.productOrTradeFamily,
          fpmlSummary,
          cdmSummary,
        mappingObservations: envelope.mappingObservations,
        transformations: envelope.transformations,
        enrichments: envelope.enrichments,
        openQuestions: envelope.openQuestions,
        pairHighlight: buildDerivedPairHighlight({
          pair,
          fpmlSummary,
          cdmSummary,
          mappingObservations: envelope.mappingObservations,
          transformations: envelope.transformations,
          openQuestions: envelope.openQuestions,
        }),
        semanticRecovery: 'full',
        modelUsed: model,
        promptChars,
          rawResponseChars: rawResponse.length,
          rawResponsePreview: clipRawResponse(rawResponse),
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        const truncatedResponseSuspected = isTruncatedStructuredOutput(rawResponse, errorMessage)
        lastErrorMessage = errorMessage
        if (truncatedResponseSuspected && attempt < maxRetries) {
          logger?.warn('pair_analysis', 'Pair analysis response looked truncated; retrying with a smaller request.', {
            pair: pair.fpmlRelativePath,
            model: model ?? null,
            retryAttempt: attempt + 1,
            promptChars,
            responseChars: rawResponse.length,
            error: errorMessage,
          })
          continue
        }

        const salvagedEnvelope = salvagePairAnalysisEnvelope({
          rawResponse,
          pair,
          fpmlSummary,
          cdmSummary,
        })
        if (salvagedEnvelope) {
          logger?.warn('pair_analysis', 'Pair analysis response was malformed but partial semantic evidence was salvaged.', {
            pair: pair.fpmlRelativePath,
            model: model ?? null,
            durationMs: Date.now() - startedAt,
            promptChars,
            responseChars: rawResponse.length,
            retryAttempt: attempt,
            salvagedMappingCount: salvagedEnvelope.mappingObservations.length,
            salvagedTransformationCount: salvagedEnvelope.transformations.length,
            salvagedEnrichmentCount: salvagedEnvelope.enrichments.length,
            truncatedResponseSuspected,
            error: errorMessage,
          })
          return {
            pair,
            status: 'success',
            productOrTradeFamily: salvagedEnvelope.productOrTradeFamily,
            fpmlSummary,
            cdmSummary,
            mappingObservations: salvagedEnvelope.mappingObservations,
            transformations: salvagedEnvelope.transformations,
            enrichments: salvagedEnvelope.enrichments,
            openQuestions: salvagedEnvelope.openQuestions,
            pairHighlight: salvagedEnvelope.pairHighlight,
            semanticRecovery: 'salvaged',
            modelUsed: model,
            promptChars,
            rawResponseChars: rawResponse.length,
            rawResponsePreview: clipRawResponse(rawResponse),
            rawResponse: storeFailedRawResponses ? rawResponse : undefined,
            truncatedResponseSuspected,
          }
        }
      }
    }
  }

  logger?.error('pair_analysis', 'Pair analysis failed to parse; excluding pair from semantic synthesis.', {
    pair: pair.fpmlRelativePath,
    model: model ?? null,
    durationMs: Date.now() - startedAt,
    promptChars: lastPromptChars,
    responseChars: rawResponse.length,
    truncatedResponseSuspected: isTruncatedStructuredOutput(rawResponse, lastErrorMessage),
    error: lastErrorMessage,
  })
  const envelope = buildFallbackAnalysis({ pair, fpmlSummary, cdmSummary })
  return {
    pair,
    status: 'failed',
    failureReason: lastErrorMessage,
    failureKind: 'parse_error',
    productOrTradeFamily: envelope.productOrTradeFamily,
    fpmlSummary,
    cdmSummary,
    mappingObservations: [],
    transformations: [],
    enrichments: [],
    openQuestions: envelope.openQuestions,
    pairHighlight: buildFallbackHighlight({ pair, fpmlSummary, cdmSummary }),
    semanticRecovery: 'none',
    modelUsed: model,
    promptChars: lastPromptChars,
    rawResponseChars: rawResponse.length,
    rawResponsePreview: clipRawResponse(rawResponse),
    rawResponse: storeFailedRawResponses ? rawResponse : undefined,
    truncatedResponseSuspected: isTruncatedStructuredOutput(rawResponse, lastErrorMessage),
  }
}

export {
  PairAnalysisEnvelopeSchema,
  PairDocumentSummarySchema,
  buildFallbackAnalysis,
  summarizeFields,
}
