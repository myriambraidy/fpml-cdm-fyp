import { env } from '../config'
import type { LLMClient, LLMMessage, LLMResponse, LLMTool } from './types'
import {
  LLMConfigurationError,
  LLMHTTPError,
  LLMProtocolError,
  LLMTimeoutError,
} from './types'

const OPENROUTER_CHAT = 'https://openrouter.ai/api/v1/chat/completions'

export type FetchOpenRouterOptions = {
  apiKey: string
  model?: string
  maxTokens?: number
  timeoutMs?: number
  maxRetriesOn429?: number
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
  private readonly timeoutMs: number
  private readonly maxRetriesOn429: number
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
    this.timeoutMs = opts.timeoutMs ?? env.LLM_TIMEOUT_MS
    this.maxRetriesOn429 = opts.maxRetriesOn429 ?? env.LLM_MAX_RETRIES
    this.httpReferer = opts.httpReferer
    this.appTitle = opts.appTitle
  }

  async call(params: {
    messages: LLMMessage[]
    tools?: LLMTool[]
    model?: string
  }): Promise<LLMResponse> {
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.callOnce(params)
      } catch (e) {
        if (
          e instanceof LLMHTTPError &&
          e.status === 429 &&
          attempt < this.maxRetriesOn429
        ) {
          await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
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
  }): Promise<LLMResponse> {
    const baseBody: Record<string, unknown> = {
      model: params.model ?? this.model,
      max_tokens: this.maxTokens,
      messages: params.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }

    if (!params.tools?.length) {
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

  private async postChatCompletions(
    body: Record<string, unknown>
  ): Promise<LLMResponse> {
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
        body: JSON.stringify(body),
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
    if (res.status === 429) {
      throw new LLMHTTPError(res.status, text)
    }
    if (!res.ok) {
      throw new LLMHTTPError(res.status, text)
    }

    let data: unknown
    try {
      data = JSON.parse(text) as Record<string, unknown>
    } catch {
      throw new LLMProtocolError(`Invalid JSON from OpenRouter: ${text.slice(0, 400)}`)
    }

    return parseChatCompletions(data)
  }
}

function parseChatCompletions(data: unknown): LLMResponse {
  const root = data as Record<string, unknown>
  const choices = root.choices as unknown[] | undefined
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new LLMProtocolError('OpenRouter response missing choices[]')
  }
  const first = choices[0] as Record<string, unknown>
  const message = first.message as Record<string, unknown> | undefined
  if (!message) {
    throw new LLMProtocolError('OpenRouter response missing message')
  }

  const content =
    typeof message.content === 'string'
      ? message.content
      : message.content == null
        ? ''
        : JSON.stringify(message.content)

  const rawCalls = message.tool_calls as unknown[] | undefined
  const tool_calls: import('./types').LLMToolCall[] = []

  if (Array.isArray(rawCalls)) {
    for (const c of rawCalls) {
      const call = c as Record<string, unknown>
      const fn = call.function as Record<string, unknown> | undefined
      const name = fn?.name
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

/** Throws LLMConfigurationError if key missing (DEC-07). */
export const createOpenRouterClientFromEnv = (): FetchOpenRouterClient => {
  const k = env.OPENROUTER_API_KEY?.trim()
  if (!k) {
    throw new LLMConfigurationError()
  }
  return new FetchOpenRouterClient({ apiKey: k })
}
