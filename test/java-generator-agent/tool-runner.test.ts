import { describe, expect, test } from 'bun:test'
import type { LLMClient, LLMMessage, LLMResponse } from '../../src/agent/types'
import { callRoleWithTools } from '../../src/java-generator-agent/tool-runner'

describe('java generator tool runner', () => {
  test('feeds tool results back to the model', async () => {
    const llm = new QueueLLM([
      {
        content: '',
        tool_calls: [
          {
            id: 'call-1',
            name: 'read_file',
            input: { path: 'agent-workspace/00-product-scope.md' },
          },
        ],
      },
      { content: 'Decision: ACCEPTED\n\nTool result was useful.' },
    ])

    const output = await callRoleWithTools({
      llm,
      messages: [{ role: 'user', content: 'Plan.' }],
      tools: [],
      model: 'minimax/minimax-m2.7',
      maxTokens: 1000,
      maxToolRounds: 2,
      executeTool: async () => 'scope contents',
    })

    expect(output.content).toContain('Decision: ACCEPTED')
    expect(output.llmCalls).toBe(2)
    expect(output.inputChars).toBeGreaterThan(0)
    expect(llm.calls.length).toBe(2)
    expect(llm.calls[1]?.some(message => message.content.includes('scope contents'))).toBe(true)
  })

  test('blocks calls that exceed the input budget', async () => {
    const llm = new QueueLLM([{ content: 'unused' }])

    const output = await callRoleWithTools({
      llm,
      messages: [{ role: 'user', content: 'x'.repeat(100) }],
      tools: [],
      model: 'qwen/qwen3-coder-next',
      maxTokens: 1000,
      maxToolRounds: 1,
      maxInputTokensPerCall: 10,
      executeTool: async () => 'unused',
    })

    expect(output.content).toBe('unused')
    expect(llm.calls.length).toBe(1)
  })

  test('blocks calls that exceed the total call budget', async () => {
    const llm = new QueueLLM([{ content: 'unused' }])

    const output = await callRoleWithTools({
      llm,
      messages: [{ role: 'user', content: 'Plan.' }],
      tools: [],
      model: 'qwen/qwen3-coder-next',
      maxTokens: 1000,
      maxToolRounds: 1,
      maxTotalLlmCalls: 0,
      executeTool: async () => 'unused',
    })

    expect(output.content).toBe('unused')
    expect(llm.calls.length).toBe(1)
  })

  test('uses write-aware final instruction for implementer tool limit', async () => {
    const llm = new QueueLLM([{ content: 'blocked summary' }])

    await callRoleWithTools({
      llm,
      messages: [{ role: 'user', content: 'Implement.' }],
      tools: [],
      model: 'minimax/minimax-m2.7',
      maxTokens: 1000,
      maxToolRounds: 0,
      roleName: 'implementer',
      executeTool: async () => 'unused',
    })

    const lastCall = llm.calls[0]
    expect(lastCall?.at(-1)?.content).toContain('Do not write pseudo tool calls')
    expect(lastCall?.at(-1)?.content).toContain('state BLOCKED')
  })

  test('reports policy failure when required write tool is not called', async () => {
    const llm = new QueueLLM([{ content: 'Done without writing.' }])

    const output = await callRoleWithTools({
      llm,
      messages: [{ role: 'user', content: 'Write.' }],
      tools: [],
      model: 'minimax/minimax-m2.7',
      maxTokens: 1000,
      maxToolRounds: 1,
      toolCallPolicy: {
        requiredToolNames: ['write_generated_java_file'],
        minimumNativeToolCalls: 1,
        pseudoToolCallsAreFatal: true,
      },
      executeTool: async () => 'unused',
    })

    expect(output.policyFailures).toContain('minimum_native_tool_calls_not_met')
    expect(output.policyFailures).toContain('required_tool_not_called:write_generated_java_file')
  })

  test('reports pseudo tool output through policy', async () => {
    const llm = new QueueLLM([
      {
        content: '[TOOL_CALL]\n{tool => "read_file", args => { --path "x" }}\n[/TOOL_CALL]',
      },
    ])

    const output = await callRoleWithTools({
      llm,
      messages: [{ role: 'user', content: 'Write.' }],
      tools: [],
      model: 'minimax/minimax-m2.7',
      maxTokens: 1000,
      maxToolRounds: 1,
      toolCallPolicy: { pseudoToolCallsAreFatal: true },
      executeTool: async () => 'unused',
    })

    expect(output.policyFailures).toContain('pseudo_tool_call_output')
  })
})

class QueueLLM implements LLMClient {
  readonly calls: LLMMessage[][] = []
  private index = 0

  constructor(private readonly responses: LLMResponse[]) {}

  async call(params: { messages: LLMMessage[] }): Promise<LLMResponse> {
    this.calls.push(params.messages)
    const response = this.responses[this.index]
    this.index += 1
    if (!response) throw new Error('No queued response')
    return response
  }
}
