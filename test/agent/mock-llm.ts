import type { LLMClient, LLMResponse } from '../../src/agent/types'

/** Deterministic LLM for tests — consumes queued responses in order. */
export class QueueMockLLM implements LLMClient {
  private i = 0

  constructor(private readonly queue: LLMResponse[]) {}

  async call(): Promise<LLMResponse> {
    const r = this.queue[this.i++]
    if (!r) throw new Error('QueueMockLLM: empty queue')
    return r
  }
}
