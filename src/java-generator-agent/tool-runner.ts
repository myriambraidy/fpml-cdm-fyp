import type { LLMClient, LLMMessage, LLMResponse, LLMTool } from '../agent/types'
import {
  LLMHTTPError,
  LLMProviderError,
  LLMProtocolError,
  LLMTimeoutError,
} from '../agent/types'
import type { GeneratorLogger } from './logger'
import { truncateForLog } from './markdown'

export async function callRoleWithTools(args: {
  llm: LLMClient
  messages: LLMMessage[]
  tools: LLMTool[]
  executeTool: (name: string, input: Record<string, string>) => Promise<string>
  maxToolRounds: number
  model: string
  fallbackModel?: string
  maxTokens: number
  logger?: GeneratorLogger
  roleName?: string
}): Promise<string> {
  const messages = [...args.messages]
  const roleName = args.roleName ?? 'role'

  for (let round = 0; round < args.maxToolRounds; round += 1) {
    args.logger?.info('llm_call_start', {
      role: roleName,
      toolRound: round + 1,
      messages: messages.length,
    })
    const response = await callWithFallback(args.llm, {
      messages,
      tools: args.tools,
      model: args.model,
      fallbackModel: args.fallbackModel,
      maxTokens: args.maxTokens,
    })
    args.logger?.info('llm_call_done', {
      role: roleName,
      toolRound: round + 1,
      contentChars: response.content.length,
      toolCalls: response.tool_calls?.length ?? 0,
    })

    if (!response.tool_calls?.length) {
      return response.content
    }

    messages.push({
      role: 'assistant',
      content: response.content || '[tool calls requested]',
    })

    for (const call of response.tool_calls) {
      args.logger?.info('tool_call_start', {
        role: roleName,
        tool: call.name,
      })
      const output = await args.executeTool(call.name, call.input as Record<string, string>)
      args.logger?.info('tool_call_done', {
        role: roleName,
        tool: call.name,
        outputChars: output.length,
      })
      messages.push({
        role: 'user',
        content: `<tool_result name="${call.name}" id="${call.id}">
${truncateForLog(output, 12_000)}
</tool_result>`,
      })
    }
  }

  args.logger?.warn('tool_round_limit_reached', { role: roleName })
  const final = await callWithFallback(args.llm, {
    messages: [
      ...messages,
      {
        role: 'user',
        content:
          'Tool round limit reached. Write the best Markdown artifact possible from the evidence already gathered.',
      },
    ],
    model: args.model,
    fallbackModel: args.fallbackModel,
    maxTokens: args.maxTokens,
  })
  return final.content
}

function shouldTryLlmFallback(error: Error): boolean {
  if (error instanceof LLMProtocolError) return true
  if (error instanceof LLMTimeoutError) return true
  if (error instanceof LLMProviderError) return true
  if (error instanceof LLMHTTPError) {
    if (error.status === 401 || error.status === 403) return false
    return error.status >= 500 || error.status === 429
  }
  return false
}

async function callWithFallback(
  llm: LLMClient,
  args: {
    messages: LLMMessage[]
    tools?: LLMTool[]
    model: string
    fallbackModel?: string
    maxTokens: number
  }
): Promise<LLMResponse> {
  try {
    return await llm.call({
      messages: args.messages,
      tools: args.tools,
      model: args.model,
      maxTokens: args.maxTokens,
    })
  } catch (error) {
    if (!(error instanceof Error)) throw error
    if (!args.fallbackModel || !shouldTryLlmFallback(error)) throw error
    return llm.call({
      messages: args.messages,
      tools: args.tools,
      model: args.fallbackModel,
      maxTokens: args.maxTokens,
    })
  }
}
