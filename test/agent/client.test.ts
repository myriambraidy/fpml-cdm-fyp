import { describe, expect, it } from 'bun:test'
import { FetchOpenRouterClient } from '../../src/agent/client'
import { LLMConfigurationError } from '../../src/agent/types'

describe('FetchOpenRouterClient (DEC-07)', () => {
  it('throws LLMConfigurationError when apiKey is empty', () => {
    expect(() => new FetchOpenRouterClient({ apiKey: '' })).toThrow(
      LLMConfigurationError
    )
    expect(() => new FetchOpenRouterClient({ apiKey: '   ' })).toThrow(
      LLMConfigurationError
    )
  })
})
