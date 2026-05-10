import { env } from '../config'
import type { LLMClient, LLMMessage, LLMResponse, LLMTool } from './types'
import {
  LLMConfigurationError,
  LLMContextLengthError,
  LLMHTTPError,
  LLMProviderError,
  LLMProtocolError,
  LLMTimeoutError,
  type LLMProtocolErrorKind,
} from './types'

const OPENROUTER_CHAT = 'https://openrouter.ai/api/v1/chat/completions'

type JsonPrimitive = string | number | boolean | null
type JsonArray = JsonValue[]
type JsonObject = { [key: string]: JsonValue }
type JsonValue = JsonPrimitive | JsonArray | JsonObject

export type FetchOpenRouterOptions = {
  apiKey: string
  model?: string
  maxTokens?: number
  maxContextTokens?: number
  timeoutMs?: number
  /** @deprecated Use maxHttpTransientRetries */
  maxRetriesOn429?: number
  /** Retries for HTTP 429, 502, 503, 504 (default from env). */
  maxHttpTransientRetries?: number
  /** Max extra attempts after a retryable protocol failure (empty body, bad JSON envelope, missing choices). Default from env. */
  maxProtocolRetries?: number
  protocolRetryBaseMs?: number
  protocolLogDiagnostics?: boolean
  onDiagnostic?: (message: string) => void
  httpReferer?: string
  appTitle?: string
}

/**
 * OpenRouter via OpenAI-compatible Chat Completions + tools (plans/week2 §8.2 spike).
 * docs/architecture.md — LLM abstraction; swap implementation behind LLMClient.
 */
export class FetchOpenRouterClient implements LLMClient {
  private readonly apiKey: string
  private readonly model: string
  private readonly maxTokens: number
  private readonly maxContextTokens: number
  private readonly timeoutMs: number
  private readonly httpTransientMaxRetries: number
  private readonly maxProtocolRetries: number
  private readonly protocolRetryBaseMs: number
  private readonly protocolLogDiagnostics: boolean
  private readonly onDiagnostic?: (message: string) => void
  private readonly httpReferer?: string
  private readonly appTitle?: string

  constructor(opts: FetchOpenRouterOptions) {
    const key = opts.apiKey?.trim()
    if (!key) {
      throw new LLMConfigurationError()
    }
    this.apiKey = key
    this.model = opts.model ?? env.OPENROUTER_MODEL
    this.maxTokens = opts.maxTokens ?? env.LLM_MAX_TOKENS
    this.maxContextTokens = opts.maxContextTokens ?? env.LLM_CONTEXT_LENGTH_TOKENS
    this.timeoutMs = opts.timeoutMs ?? env.LLM_TIMEOUT_MS
    this.httpTransientMaxRetries =
      opts.maxHttpTransientRetries ??
      opts.maxRetriesOn429 ??
      env.LLM_HTTP_TRANSIENT_MAX_RETRIES
    this.maxProtocolRetries = opts.maxProtocolRetries ?? env.LLM_PROTOCOL_MAX_RETRIES
    this.protocolRetryBaseMs = opts.protocolRetryBaseMs ?? env.LLM_PROTOCOL_RETRY_BASE_MS
    this.protocolLogDiagnostics =
      opts.protocolLogDiagnostics ?? env.LLM_PROTOCOL_LOG_DIAGNOSTICS
    this.onDiagnostic = opts.onDiagnostic
    this.httpReferer = opts.httpReferer
    this.appTitle = opts.appTitle
  }

  async call(params: {
    messages: LLMMessage[]
    tools?: LLMTool[]
    model?: string
    maxTokens?: number
    responseFormat?: {
      type: 'json_schema'
      json_schema: {
        name: string
        strict?: boolean
        schema: Record<string, unknown>
      }
    }
  }): Promise<LLMResponse> {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await this.callOnce(params)
      } catch (e) {
        if (
          e instanceof LLMHTTPError &&
          isTransientOpenRouterHttpStatus(e.status) &&
          attempt < this.httpTransientMaxRetries
        ) {
          const delayMs = transientHttpRetryDelayMs(e, attempt)
          this.emitProtocolDiagnostic(
            `HTTP ${String(e.status)} transient retry ${String(attempt + 1)}/${String(this.httpTransientMaxRetries)} in ${String(delayMs)}ms`
          )
          await new Promise(r => setTimeout(r, delayMs))
          continue
        }
        throw e
      }
    }
  }

  private async callOnce(params: {
    messages: LLMMessage[]
    tools?: LLMTool[]
    model?: string
    maxTokens?: number
    responseFormat?: {
      type: 'json_schema'
      json_schema: {
        name: string
        strict?: boolean
        schema: Record<string, unknown>
      }
    }
  }): Promise<LLMResponse> {
    const requestedOutputTokens = params.maxTokens ?? this.maxTokens
    const baseBody: Record<string, unknown> = {
      model: params.model ?? this.model,
      max_tokens: requestedOutputTokens,
      messages: params.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }

    if (params.responseFormat) {
      baseBody.response_format = params.responseFormat
    }

    if (!params.tools?.length) {
      assertContextBudget({
        messages: params.messages,
        requestedOutputTokens,
        maxContextTokens: this.maxContextTokens,
      })
      return this.postChatCompletions(baseBody)
    }

    const toolsPayload = params.tools.map(t => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.input_schema,
      },
    }))
    assertContextBudget({
      messages: params.messages,
      toolsPayload,
      requestedOutputTokens,
      maxContextTokens: this.maxContextTokens,
    })

    const withTools = (toolChoice: 'required' | 'auto'): Record<string, unknown> => ({
      ...baseBody,
      tools: toolsPayload,
      tool_choice: toolChoice,
    })

    const first = await this.postChatCompletions(withTools('required'))
    if (!first.tool_calls?.length) {
      return this.postChatCompletions(withTools('auto'))
    }
    return first
  }

  private emitProtocolDiagnostic(message: string): void {
    if (this.onDiagnostic) {
      this.onDiagnostic(message)
    } else if (this.protocolLogDiagnostics) {
      console.warn(`[openrouter] ${message}`)
    }
  }

  private async sleepProtocolBackoff(attemptIndex: number): Promise<void> {
    const base = this.protocolRetryBaseMs * 2 ** attemptIndex
    const jitter = Math.floor(Math.random() * 250)
    await new Promise(r => setTimeout(r, base + jitter))
  }

  private isRetryableProtocolKind(kind: LLMProtocolErrorKind | undefined): boolean {
    if (kind === undefined) return false
    return (
      kind === 'empty_body' ||
      kind === 'json_parse' ||
      kind === 'not_json_object' ||
      kind === 'missing_choices' ||
      kind === 'missing_message'
    )
  }

  private async postChatCompletions(body: Record<string, unknown>): Promise<LLMResponse> {
    const bodyStr = JSON.stringify(body)

    for (let attempt = 0; attempt <= this.maxProtocolRetries; attempt += 1) {
      try {
        return await this.singlePostChatCompletion(bodyStr)
      } catch (e) {
        if (
          e instanceof LLMProtocolError &&
          this.isRetryableProtocolKind(e.kind) &&
          attempt < this.maxProtocolRetries
        ) {
          this.emitProtocolDiagnostic(
            `protocol retry ${attempt + 1}/${this.maxProtocolRetries} after ${e.kind}: ${e.message}`
          )
          await this.sleepProtocolBackoff(attempt)
          continue
        }
        throw e
      }
    }

    throw new LLMProtocolError('OpenRouter protocol retries exhausted', { kind: 'empty_body' })
  }

  private async singlePostChatCompletion(bodyStr: string): Promise<LLMResponse> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
    if (this.httpReferer) headers['HTTP-Referer'] = this.httpReferer
    if (this.appTitle) headers['X-Title'] = this.appTitle

    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), this.timeoutMs)

    let res: Response
    try {
      res = await fetch(OPENROUTER_CHAT, {
        method: 'POST',
        headers,
        body: bodyStr,
        signal: ac.signal,
      })
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        throw new LLMTimeoutError()
      }
      throw e
    } finally {
      clearTimeout(timer)
    }

    const text = await res.text()
    const contentType = res.headers.get('content-type') ?? ''

    if (res.status === 429) {
      throw new LLMHTTPError(res.status, text)
    }
    if (!res.ok) {
      throw new LLMHTTPError(res.status, text)
    }

    const httpStatus = res.status
    const ctxBase = { httpStatus, contentType, bodyBytes: text.length }

    if (text.trim().length === 0) {
      throw new LLMProtocolError(
        `OpenRouter returned empty body (${formatProtocolDiag(ctxBase)})`,
        { kind: 'empty_body', httpStatus }
      )
    }

    let data: JsonValue
    try {
      data = JSON.parse(text) as JsonValue
    } catch {
      throw new LLMProtocolError(
        `OpenRouter invalid JSON envelope (${formatProtocolDiag(ctxBase)} preview=${safeTextPreview(text)})`,
        { kind: 'json_parse', httpStatus }
      )
    }

    return parseChatCompletions(data, ctxBase)
  }
}

function isTransientOpenRouterHttpStatus(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504
}

function assertContextBudget(args: {
  messages: LLMMessage[]
  toolsPayload?: unknown
  requestedOutputTokens: number
  maxContextTokens: number
}): void {
  const estimatedInputTokens = estimateTokensFromChars(
    args.messages.reduce((total, message) => total + message.content.length, 0)
  )
  const estimatedToolTokens = estimateTokensFromChars(
    args.toolsPayload === undefined ? 0 : JSON.stringify(args.toolsPayload).length
  )
  const estimatedTotalTokens = estimatedInputTokens + estimatedToolTokens + args.requestedOutputTokens
  if (estimatedTotalTokens <= args.maxContextTokens) return
  throw new LLMContextLengthError(
    estimatedTotalTokens,
    args.maxContextTokens,
    estimatedInputTokens,
    estimatedToolTokens,
    args.requestedOutputTokens
  )
}

function estimateTokensFromChars(chars: number): number {
  return Math.ceil(chars / 4)
}

const OPENROUTER_RETRY_AFTER_CAP_MS = 120_000

function parseOpenRouterRetryAfterMs(bodySnippet: string): number | undefined {
  try {
    const root = JSON.parse(bodySnippet) as Record<string, unknown>
    const err = root.error
    if (err === null || typeof err !== 'object' || Array.isArray(err)) return undefined
    const meta = (err as Record<string, unknown>).metadata
    if (meta === null || typeof meta !== 'object' || Array.isArray(meta)) return undefined
    const raw = (meta as Record<string, unknown>).retry_after_seconds
    const sec =
      typeof raw === 'number'
        ? raw
        : typeof raw === 'string' && /^\d+(\.\d+)?$/.test(raw.trim())
          ? Number(raw.trim())
          : undefined
    if (sec === undefined || sec < 0 || !Number.isFinite(sec)) return undefined
    return Math.min(Math.round(sec * 1000), OPENROUTER_RETRY_AFTER_CAP_MS)
  } catch {
    return undefined
  }
}

function transientHttpRetryDelayMs(error: LLMHTTPError, attemptIndex: number): number {
  const floorMs = 1000
  const capMs = 45_000
  if (error.status === 429) {
    const fromBody = parseOpenRouterRetryAfterMs(error.bodySnippet)
    if (fromBody !== undefined) {
      return Math.min(Math.max(fromBody, floorMs), capMs)
    }
  }
  return Math.min(Math.max(1500 * (attemptIndex + 1), floorMs), capMs)
}

function formatProtocolDiag(args: {
  httpStatus: number
  contentType: string
  bodyBytes: number
}): string {
  return `status=${String(args.httpStatus)} contentType=${args.contentType} bodyBytes=${String(args.bodyBytes)}`
}

function safeTextPreview(text: string, maxLen = 64): string {
  const slice = text.slice(0, maxLen)
  return JSON.stringify(slice.replace(/[\u0000-\u001f\u007f]/g, '?'))
}

function parseChatCompletions(
  data: JsonValue,
  ctx: { httpStatus: number; contentType: string; bodyBytes: number }
): LLMResponse {
  if (!isJsonObject(data)) {
    throw new LLMProtocolError(
      `OpenRouter response was not a JSON object (${formatProtocolDiag(ctx)})`,
      { kind: 'not_json_object', httpStatus: ctx.httpStatus }
    )
  }
  const providerError = extractProviderError(data)
  if (providerError) {
    throw new LLMProviderError(providerError)
  }

  const choices = Array.isArray(data.choices) ? data.choices : undefined
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new LLMProtocolError(
      `OpenRouter response missing choices[]. Body keys: ${Object.keys(data).join(', ') || '(none)'} (${formatProtocolDiag(ctx)})`,
      { kind: 'missing_choices', httpStatus: ctx.httpStatus }
    )
  }
  const first = choices[0]
  if (!isJsonObject(first) || !isJsonObject(first.message)) {
    throw new LLMProtocolError(
      `OpenRouter response missing message (${formatProtocolDiag(ctx)})`,
      { kind: 'missing_message', httpStatus: ctx.httpStatus }
    )
  }
  const message = first.message

  const content =
    typeof message.content === 'string'
      ? message.content
      : message.content == null
        ? ''
        : JSON.stringify(message.content)

  const rawCalls = Array.isArray(message.tool_calls) ? message.tool_calls : undefined
  const tool_calls: import('./types').LLMToolCall[] = []

  if (Array.isArray(rawCalls)) {
    for (const c of rawCalls) {
      if (!isJsonObject(c) || !isJsonObject(c.function)) continue
      const call = c
      const fn = c.function
      const name = fn.name
      if (typeof name !== 'string') continue
      const argsRaw = fn?.arguments
      let input: Record<string, unknown> = {}
      if (typeof argsRaw === 'string' && argsRaw.length > 0) {
        try {
          input = JSON.parse(argsRaw) as Record<string, unknown>
        } catch {
          input = {}
        }
      }
      const id = typeof call.id === 'string' ? call.id : crypto.randomUUID()
      tool_calls.push({ id, name, input })
    }
  }

  return {
    content,
    tool_calls: tool_calls.length ? tool_calls : undefined,
  }
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function extractProviderError(root: JsonObject): string | undefined {
  if (!isJsonObject(root.error)) return undefined
  const error = root.error
  const message = typeof error.message === 'string' ? error.message : 'OpenRouter provider error'
  const code = typeof error.code === 'string' || typeof error.code === 'number' ? String(error.code) : undefined
  const metadata = isJsonObject(error.metadata) ? error.metadata : undefined
  const raw = metadata && typeof metadata.raw === 'string' ? metadata.raw : undefined
  const provider =
    metadata && typeof metadata.provider_name === 'string' ? metadata.provider_name : undefined
  const retryAfter =
    metadata &&
    (typeof metadata.retry_after_seconds === 'string' ||
      typeof metadata.retry_after_seconds === 'number')
      ? String(metadata.retry_after_seconds)
      : undefined

  return [
    message,
    code ? `code=${code}` : undefined,
    provider ? `provider=${provider}` : undefined,
    retryAfter ? `retry_after_seconds=${retryAfter}` : undefined,
    raw ? `raw=${raw}` : undefined,
  ]
    .filter((part): part is string => part !== undefined)
    .join(' | ')
}

/** Throws LLMConfigurationError if key missing (DEC-07). */
export const createOpenRouterClientFromEnv = (): FetchOpenRouterClient => {
  const k = env.OPENROUTER_API_KEY?.trim()
  if (!k) {
    throw new LLMConfigurationError()
  }
  return new FetchOpenRouterClient({ apiKey: k })
}
