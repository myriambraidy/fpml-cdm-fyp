import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import type { LLMClient, LLMMessage, LLMResponse, LLMTool } from '../agent/types'
import {
  LLMHTTPError,
  LLMProviderError,
  LLMProtocolError,
  LLMTimeoutError,
} from '../agent/types'
import type { GeneratorLogger } from './logger'
import { truncateForLog } from './markdown'
import { detectPseudoToolCalls } from './pseudo-tool-calls'

export type ToolCallPolicy = {
  requiredToolNames?: string[]
  requiredReadPaths?: string[]
  minimumNativeToolCalls?: number
  pseudoToolCallsAreFatal?: boolean
  disallowConversationalFinalContent?: boolean
}

type ToolCallRecord = {
  name: string
  input: Record<string, string>
}

export type LlmCallTrace = {
  llmCallId: string
  role: string
  model: string
  toolRound: number
  inputChars: number
  outputChars: number
  toolCallCount: number
  contentArtifactPath: string
}

export type RoleWithToolsResult = {
  content: string
  llmCalls: number
  inputChars: number
  outputChars: number
  toolCallNames: string[]
  toolCalls: ToolCallRecord[]
  policyFailures: string[]
  llmCallTraces: LlmCallTrace[]
}

export async function callRoleWithTools(args: {
  llm: LLMClient
  messages: LLMMessage[]
  tools: LLMTool[]
  executeTool: (name: string, input: Record<string, string>) => Promise<string>
  maxToolRounds: number
  model: string
  fallbackModel?: string
  maxTokens: number
  maxTotalLlmCalls?: number
  maxInputTokensPerCall?: number
  logger?: GeneratorLogger
  roleName?: string
  toolCallPolicy?: ToolCallPolicy
  llmTrace?: {
    runOutputDir: string
  }
}): Promise<RoleWithToolsResult> {
  const messages = [...args.messages]
  const roleName = args.roleName ?? 'role'
  let llmCalls = 0
  let inputChars = 0
  let outputChars = 0
  const toolCallNames: string[] = []
  const toolCalls: ToolCallRecord[] = []
  const policyFailures: string[] = []
  const llmCallTraces: LlmCallTrace[] = []
  let llmTurn = 0

  async function trackedCall(callArgs: {
    messages: LLMMessage[]
    tools?: LLMTool[]
  }): Promise<LLMResponse> {
    const inputForCall = callArgs.messages.reduce((total, message) => total + message.content.length, 0)
    const estimatedInputTokens = Math.ceil(inputForCall / 4)
    if (args.maxTotalLlmCalls !== undefined && llmCalls >= args.maxTotalLlmCalls) {
      args.logger?.warn('llm_call_budget_exceeded_soft', {
        role: roleName,
        maxTotalLlmCalls: args.maxTotalLlmCalls,
        llmCalls,
      })
    }
    if (args.maxInputTokensPerCall !== undefined && estimatedInputTokens > args.maxInputTokensPerCall) {
      args.logger?.warn('llm_input_budget_exceeded_soft', {
        role: roleName,
        estimatedInputTokens,
        maxInputTokensPerCall: args.maxInputTokensPerCall,
      })
    }
    const result = await callWithFallback(args.llm, {
      messages: callArgs.messages,
      tools: callArgs.tools,
      model: args.model,
      fallbackModel: args.fallbackModel,
      maxTokens: args.maxTokens,
    })
    llmCalls += result.llmCalls
    inputChars += inputForCall * result.llmCalls
    outputChars += result.response.content.length
    return result.response
  }

  async function recordAssistantTurn(response: LLMResponse, toolRound: number, inputForCall: number): Promise<void> {
    if (args.llmTrace === undefined) return
    llmTurn += 1
    const llmCallId = `${roleName}-${String(llmTurn).padStart(3, '0')}`
    const absPath = resolve(args.llmTrace.runOutputDir, 'build-reports', 'llm-calls', `${llmCallId}-assistant.md`)
    await mkdir(dirname(absPath), { recursive: true })
    await writeFile(absPath, response.content, 'utf8')
    const runRoot = resolve(args.llmTrace.runOutputDir)
    const relPath = relative(runRoot, absPath).replace(/\\/g, '/')
    llmCallTraces.push({
      llmCallId,
      role: roleName,
      model: args.model,
      toolRound,
      inputChars: inputForCall,
      outputChars: response.content.length,
      toolCallCount: response.tool_calls?.length ?? 0,
      contentArtifactPath: relPath,
    })
  }

  for (let round = 0; round < args.maxToolRounds; round += 1) {
    args.logger?.info('llm_call_start', {
      role: roleName,
      toolRound: round + 1,
      messages: messages.length,
    })
    const inputForCall = messages.reduce((total, message) => total + message.content.length, 0)
    const response = await trackedCall({
      messages,
      tools: args.tools,
    })
    args.logger?.info('llm_call_done', {
      role: roleName,
      toolRound: round + 1,
      contentChars: response.content.length,
      toolCalls: response.tool_calls?.length ?? 0,
    })
    await recordAssistantTurn(response, round + 1, inputForCall)

    if (!response.tool_calls?.length) {
      policyFailures.push(...evaluateFinalContentPolicy(response.content, args.toolCallPolicy, toolCallNames, toolCalls))
      return {
        content: response.content,
        llmCalls,
        inputChars,
        outputChars,
        toolCallNames,
        toolCalls,
        policyFailures,
        llmCallTraces,
      }
    }

    messages.push({
      role: 'assistant',
      content: response.content || '[tool calls requested]',
    })

    for (const call of response.tool_calls) {
      toolCallNames.push(call.name)
      const input = call.input as Record<string, string>
      toolCalls.push({ name: call.name, input })
      args.logger?.info('tool_call_start', {
        role: roleName,
        tool: call.name,
      })
      const output = await args.executeTool(call.name, input)
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
  const finalMessages = [
    ...messages,
    {
      role: 'user' as const,
      content: finalToolLimitInstruction(roleName),
    },
  ]
  const finalInputChars = finalMessages.reduce((total, message) => total + message.content.length, 0)
  const final = await trackedCall({
    messages: [
      ...finalMessages,
    ],
  })
  await recordAssistantTurn(final, args.maxToolRounds + 1, finalInputChars)
  policyFailures.push(...evaluateFinalContentPolicy(final.content, args.toolCallPolicy, toolCallNames, toolCalls))
  return {
    content: final.content,
    llmCalls,
    inputChars,
    outputChars,
    toolCallNames,
    toolCalls,
    policyFailures,
    llmCallTraces,
  }
}

function evaluateFinalContentPolicy(
  content: string,
  policy: ToolCallPolicy | undefined,
  toolCallNames: string[],
  toolCalls: ToolCallRecord[]
): string[] {
  if (policy === undefined) return []
  const failures: string[] = []
  if (policy.pseudoToolCallsAreFatal && detectPseudoToolCalls(content).length > 0) {
    failures.push('pseudo_tool_call_output')
  }
  if (policy.minimumNativeToolCalls !== undefined && toolCallNames.length < policy.minimumNativeToolCalls) {
    failures.push('minimum_native_tool_calls_not_met')
  }
  for (const required of policy.requiredToolNames ?? []) {
    if (!toolCallNames.includes(required)) failures.push(`required_tool_not_called:${required}`)
  }
  for (const requiredPath of policy.requiredReadPaths ?? []) {
    if (!hasReadFileCallForPath(toolCalls, requiredPath)) {
      failures.push(`required_read_path_not_called:${requiredPath}`)
    }
  }
  const structuralWriteRequirementsMet =
    (policy.minimumNativeToolCalls === undefined || toolCallNames.length >= policy.minimumNativeToolCalls)
    && (policy.requiredToolNames ?? []).every(name => toolCallNames.includes(name))
  if (
    policy.disallowConversationalFinalContent === true
    && !structuralWriteRequirementsMet
    && (policy.minimumNativeToolCalls !== undefined || (policy.requiredToolNames?.length ?? 0) > 0)
    && /\bwould you like me to\b|\bshall i\b|\bi can also\b/iu.test(content)
  ) {
    failures.push('conversational_write_phase_output')
  }
  return failures
}

function hasReadFileCallForPath(toolCalls: ToolCallRecord[], requiredPath: string): boolean {
  const normalizedRequired = normalizePath(requiredPath)
  return toolCalls.some(call =>
    call.name === 'read_file'
      && call.input.path !== undefined
      && pathsReferToSameRequiredFile(call.input.path, normalizedRequired)
  )
}

function normalizePath(path: string): string {
  return path
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\.\//u, '')
    .replace(/\/\.\//gu, '/')
    .replace(/\/$/u, '')
}

function pathsReferToSameRequiredFile(inputPath: string, normalizedRequiredPath: string): boolean {
  const normalizedInput = normalizePath(inputPath)
  return normalizedInput === normalizedRequiredPath
    || normalizedInput.endsWith(`/${normalizedRequiredPath}`)
}

function finalToolLimitInstruction(roleName: string): string {
  if (roleName === 'implementer' || roleName === 'repair') {
    return [
      'Tool round limit reached.',
      'Do not write pseudo tool calls in Markdown.',
      'If required files were not written through provider-native tool calls, state BLOCKED and list the missing files.',
      'If required files were already written through tool calls, write only a concise summary of completed files.',
    ].join('\n')
  }
  return 'Tool round limit reached. Write the best Markdown artifact possible from the evidence already gathered.'
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
): Promise<{ response: LLMResponse; llmCalls: number }> {
  try {
    const response = await llm.call({
      messages: args.messages,
      tools: args.tools,
      model: args.model,
      maxTokens: args.maxTokens,
    })
    return { response, llmCalls: 1 }
  } catch (error) {
    if (!(error instanceof Error)) throw error
    if (!args.fallbackModel || !shouldTryLlmFallback(error)) throw error
    const response = await llm.call({
      messages: args.messages,
      tools: args.tools,
      model: args.fallbackModel,
      maxTokens: args.maxTokens,
    })
    return { response, llmCalls: 2 }
  }
}
