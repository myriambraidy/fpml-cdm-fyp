import type { z } from 'zod'
import type { LLMClient, LLMMessage } from '../agent/types'
import { extractJsonObject } from '../draft/io'
import type { CookbookLlmLogger } from './logger'
import type { LlmCallTrace, LlmJsonCallResult } from './types'

export async function callLlmJson<T>(args: {
  llm: LLMClient
  model: string
  messages: LLMMessage[]
  schema: z.ZodType<T>
  maxTokens: number
  role: LlmCallTrace['role']
  trace: LlmCallTrace[]
  storeRawResponse: boolean
  logger?: CookbookLlmLogger
}): Promise<LlmJsonCallResult<T>> {
  const first = await callAndParse(args, args.messages)
  if (first.parsed) return first.parsed

  args.logger?.warn('role_json_retry', {
    role: args.role,
    model: args.model,
    reason: first.error.message.slice(0, 220),
  })

  const retryMessages = [
    ...args.messages,
    {
      role: 'user' as const,
      content: [
        'Your previous response was not valid complete JSON.',
        'Return only one complete JSON object matching the requested schema.',
        'Keep string fields concise. Do not include markdown, explanations, or extra keys.',
      ].join('\n'),
    },
  ]
  const second = await callAndParse(args, retryMessages)
  if (second.parsed) return second.parsed

  args.logger?.warn('role_json_failed', {
    role: args.role,
    model: args.model,
    reason: second.error.message.slice(0, 220),
  })

  throw second.error
}

async function callAndParse<T>(
  args: {
    llm: LLMClient
    model: string
    schema: z.ZodType<T>
    maxTokens: number
    role: LlmCallTrace['role']
    trace: LlmCallTrace[]
    storeRawResponse: boolean
  },
  messages: LLMMessage[]
): Promise<
  | { parsed: LlmJsonCallResult<T>; error?: never }
  | { parsed?: never; error: Error }
> {
  const response = await args.llm.call({
    model: args.model,
    messages,
    maxTokens: args.maxTokens,
  })
  const promptChars = messages.reduce((sum, message) => sum + message.content.length, 0)
  args.trace.push({
    role: args.role,
    model: args.model,
    messages,
    rawResponsePreview: response.content.slice(0, 2000),
    rawResponse: args.storeRawResponse ? response.content : undefined,
    promptChars,
    rawResponseChars: response.content.length,
  })

  try {
    const parsed = parseWithSchema(args.schema, extractJsonObject(response.content))
    return {
      parsed: {
        parsed,
        rawResponse: response.content,
        promptChars,
        rawResponseChars: response.content.length,
        model: args.model,
      },
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('LLM JSON parse failed.'),
    }
  }
}

function parseWithSchema<T>(schema: z.ZodType<T>, payload: unknown): T {
  const direct = schema.safeParse(payload)
  if (direct.success) {
    return direct.data
  }

  if (!payload || typeof payload !== 'object') {
    throw direct.error
  }

  const candidateRecord = payload as Record<string, unknown>
  const wrappedKeys = ['page', 'result', 'output', 'data', 'response']
  for (const key of wrappedKeys) {
    const nested = candidateRecord[key]
    const nestedResult = schema.safeParse(nested)
    if (nestedResult.success) {
      return nestedResult.data
    }
  }

  for (const key of wrappedKeys) {
    const nested = candidateRecord[key]
    if (typeof nested !== 'string') continue
    try {
      const parsedNested = JSON.parse(nested) as unknown
      const nestedResult = schema.safeParse(parsedNested)
      if (nestedResult.success) {
        return nestedResult.data
      }
    } catch {
      // Ignore non-JSON wrapper text and keep checking.
    }
  }

  throw direct.error
}
