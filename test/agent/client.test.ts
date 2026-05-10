import { describe, expect, it } from 'bun:test'
import { FetchOpenRouterClient } from '../../src/agent/client'
import {
  LLMConfigurationError,
  LLMContextLengthError,
  LLMHTTPError,
  LLMProviderError,
  LLMProtocolError,
} from '../../src/agent/types'

function chatCompletionJson(content: string): string {
  return JSON.stringify({
    choices: [{ message: { content } }],
  })
}

describe('FetchOpenRouterClient (DEC-07)', () => {
  it('throws LLMConfigurationError when apiKey is empty', () => {
    expect(() => new FetchOpenRouterClient({ apiKey: '' })).toThrow(
      LLMConfigurationError
    )
    expect(() => new FetchOpenRouterClient({ apiKey: '   ' })).toThrow(
      LLMConfigurationError
    )
  })

  it('surfaces OpenRouter provider error envelopes instead of missing choices', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = Object.assign(
      async () =>
        new Response(
          JSON.stringify({
            error: {
              message: 'Provider returned error',
              code: 429,
              metadata: {
                raw: 'minimax/minimax-m2.7 is temporarily rate-limited upstream.',
                provider_name: 'Together',
                retry_after_seconds: 1,
              },
            },
          }),
          { status: 200 }
        ),
      { preconnect: originalFetch.preconnect }
    )

    try {
      const client = new FetchOpenRouterClient({ apiKey: 'test-key' })
      await expect(client.call({ messages: [{ role: 'user', content: 'hi' }] })).rejects.toThrow(
        LLMProviderError
      )
      await expect(client.call({ messages: [{ role: 'user', content: 'hi' }] })).rejects.toThrow(
        'rate-limited upstream'
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('includes response keys when an unexpected success body is returned', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = Object.assign(
      async () => new Response(JSON.stringify({ id: 'not-chat-completions' }), { status: 200 }),
      { preconnect: originalFetch.preconnect }
    )

    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxProtocolRetries: 0,
        protocolLogDiagnostics: false,
      })
      let caught: unknown
      try {
        await client.call({ messages: [{ role: 'user', content: 'hi' }] })
      } catch (e) {
        caught = e
      }
      expect(caught).toBeInstanceOf(LLMProtocolError)
      if (caught instanceof LLMProtocolError) {
        expect(caught.message).toContain('Body keys: id')
        expect(caught.kind).toBe('missing_choices')
      }
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('guards oversized context requests before fetch', async () => {
    const originalFetch = globalThis.fetch
    let fetchCount = 0
    globalThis.fetch = Object.assign(
      async () => {
        fetchCount += 1
        return new Response(chatCompletionJson('should-not-call'), { status: 200 })
      },
      { preconnect: originalFetch.preconnect }
    )

    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxContextTokens: 20,
        maxTokens: 10,
      })
      let caught: unknown
      try {
        await client.call({ messages: [{ role: 'user', content: 'x'.repeat(80) }] })
      } catch (e) {
        caught = e
      }
      expect(caught).toBeInstanceOf(LLMContextLengthError)
      if (caught instanceof LLMContextLengthError) {
        expect(caught.estimatedTotalTokens).toBeGreaterThan(caught.maxContextTokens)
        expect(caught.requestedOutputTokens).toBe(10)
      }
      expect(fetchCount).toBe(0)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('retries when the first 200 response body is whitespace-only then succeeds', async () => {
    const originalFetch = globalThis.fetch
    let n = 0
    globalThis.fetch = Object.assign(
      async () => {
        n += 1
        if (n === 1) {
          return new Response('\n\n  \n', { status: 200, headers: { 'content-type': 'application/json' } })
        }
        return new Response(chatCompletionJson('ok'), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      },
      { preconnect: originalFetch.preconnect }
    )
    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxProtocolRetries: 3,
        protocolLogDiagnostics: false,
      })
      const out = await client.call({ messages: [{ role: 'user', content: 'hi' }] })
      expect(out.content).toBe('ok')
      expect(n).toBe(2)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('retries when JSON.parse fails then succeeds', async () => {
    const originalFetch = globalThis.fetch
    let n = 0
    globalThis.fetch = Object.assign(
      async () => {
        n += 1
        if (n <= 2) {
          return new Response('not-json', { status: 200, headers: { 'content-type': 'application/json' } })
        }
        return new Response(chatCompletionJson('recovered'), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      },
      { preconnect: originalFetch.preconnect }
    )
    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxProtocolRetries: 3,
        protocolLogDiagnostics: false,
      })
      const out = await client.call({ messages: [{ role: 'user', content: 'hi' }] })
      expect(out.content).toBe('recovered')
      expect(n).toBe(3)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('retries on HTTP 429 then succeeds', async () => {
    const originalFetch = globalThis.fetch
    let n = 0
    const rateLimitBody = JSON.stringify({
      error: {
        message: 'Provider returned error',
        code: 429,
        metadata: { retry_after_seconds: 1, provider_name: 'Together' },
      },
    })
    globalThis.fetch = Object.assign(
      async () => {
        n += 1
        if (n === 1) {
          return new Response(rateLimitBody, { status: 429, headers: { 'content-type': 'application/json' } })
        }
        return new Response(chatCompletionJson('after-rate-limit'), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      },
      { preconnect: originalFetch.preconnect }
    )
    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxHttpTransientRetries: 3,
        protocolLogDiagnostics: false,
      })
      const out = await client.call({ messages: [{ role: 'user', content: 'hi' }] })
      expect(out.content).toBe('after-rate-limit')
      expect(n).toBe(2)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('retries on HTTP 503 then succeeds', async () => {
    const originalFetch = globalThis.fetch
    let n = 0
    globalThis.fetch = Object.assign(
      async () => {
        n += 1
        if (n === 1) {
          return new Response('upstream unavailable', { status: 503 })
        }
        return new Response(chatCompletionJson('ok'), { status: 200 })
      },
      { preconnect: originalFetch.preconnect }
    )
    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxHttpTransientRetries: 2,
        protocolLogDiagnostics: false,
      })
      const out = await client.call({ messages: [{ role: 'user', content: 'hi' }] })
      expect(out.content).toBe('ok')
      expect(n).toBe(2)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('throws LLMHTTPError when 429 persists after transient retries', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = Object.assign(
      async () =>
        new Response(JSON.stringify({ error: { message: 'rate limited' } }), { status: 429 }),
      { preconnect: originalFetch.preconnect }
    )
    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxHttpTransientRetries: 1,
        protocolLogDiagnostics: false,
      })
      let caught: unknown
      try {
        await client.call({ messages: [{ role: 'user', content: 'hi' }] })
      } catch (e) {
        caught = e
      }
      expect(caught).toBeInstanceOf(LLMHTTPError)
      if (caught instanceof LLMHTTPError) expect(caught.status).toBe(429)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('throws LLMProtocolError after exhausting protocol retries on empty body', async () => {
    const originalFetch = globalThis.fetch
    let fetchCount = 0
    globalThis.fetch = Object.assign(
      async () => {
        fetchCount += 1
        return new Response('   \n', { status: 200, headers: { 'content-type': 'application/json' } })
      },
      { preconnect: originalFetch.preconnect }
    )
    try {
      const client = new FetchOpenRouterClient({
        apiKey: 'test-key',
        maxProtocolRetries: 2,
        protocolLogDiagnostics: false,
      })
      let caught: unknown
      try {
        await client.call({ messages: [{ role: 'user', content: 'hi' }] })
      } catch (e) {
        caught = e
      }
      expect(caught).toBeInstanceOf(LLMProtocolError)
      if (caught instanceof LLMProtocolError) {
        expect(caught.kind).toBe('empty_body')
        expect(caught.message).toContain('empty body')
      }
      expect(fetchCount).toBe(3)
    } finally {
      globalThis.fetch = originalFetch
    }
  })

})
