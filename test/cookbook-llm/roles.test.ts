import { describe, expect, it } from 'bun:test'
import { authorCookbookPage } from '../../src/cookbook-llm/author'
import { auditCookbookPage } from '../../src/cookbook-llm/auditor'
import { critiqueCookbookPage } from '../../src/cookbook-llm/critic'
import { judgeCookbookPage } from '../../src/cookbook-llm/judge'
import { repairCookbookPage } from '../../src/cookbook-llm/repair'
import {
  authoredPage,
  jsonResponse,
  makePacket,
  passAudit,
  passCritic,
  passJudge,
  QueueLlmClient,
} from './helpers'
import type { LlmCallTrace } from '../../src/cookbook-llm/types'

describe('cookbook LLM role calls', () => {
  it('parses typed JSON responses for each role', async () => {
    const claim = authoredPage().claims[0]!.claim
    const llm = new QueueLlmClient([
      jsonResponse(authoredPage()),
      jsonResponse(passCritic()),
      jsonResponse(passAudit(claim)),
      jsonResponse(authoredPage()),
      jsonResponse(passJudge()),
    ])
    const packet = makePacket()
    const trace: LlmCallTrace[] = []
    const page = await authorCookbookPage({
      llm,
      model: 'author',
      packet,
      maxTokens: 1000,
      trace,
      storeRawResponse: true,
    })
    const critic = await critiqueCookbookPage({
      llm,
      model: 'critic',
      packet,
      page,
      maxTokens: 1000,
      trace,
      storeRawResponse: true,
    })
    const audit = await auditCookbookPage({
      llm,
      model: 'auditor',
      packet,
      page,
      maxTokens: 1000,
      trace,
      storeRawResponse: true,
    })
    const repaired = await repairCookbookPage({
      llm,
      model: 'repair',
      packet,
      page,
      criticReport: critic,
      auditReport: audit,
      maxTokens: 1000,
      trace,
      storeRawResponse: true,
    })
    const judge = await judgeCookbookPage({
      llm,
      model: 'judge',
      packet,
      page: repaired,
      criticReport: critic,
      auditReport: audit,
      maxTokens: 1000,
      trace,
      storeRawResponse: true,
    })

    expect(page.claims).toHaveLength(1)
    expect(critic.decision).toBe('pass')
    expect(audit.decision).toBe('pass')
    expect(repaired.markdown).toContain('FPML')
    expect(judge.decision).toBe('pass')
    expect(trace).toHaveLength(5)
  })

  it('retries once after malformed role JSON', async () => {
    const llm = new QueueLlmClient([
      '{"markdown":',
      jsonResponse(authoredPage()),
    ])
    const trace: LlmCallTrace[] = []

    const page = await authorCookbookPage({
      llm,
      model: 'author',
      packet: makePacket(),
      maxTokens: 1000,
      trace,
      storeRawResponse: true,
    })

    expect(page.markdown).toContain('FPML')
    expect(trace).toHaveLength(2)
    expect(trace[1]!.messages.at(-1)!.content).toContain('valid complete JSON')
  })
})
