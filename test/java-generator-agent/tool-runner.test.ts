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

    expect(output).toContain('Decision: ACCEPTED')
    expect(llm.calls.length).toBe(2)
    expect(llm.calls[1]?.some(message => message.content.includes('scope contents'))).toBe(true)
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
