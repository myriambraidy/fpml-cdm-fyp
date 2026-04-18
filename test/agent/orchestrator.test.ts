import { describe, expect, it } from 'bun:test'
import '../../src/skills'
import { MappingAgent, safeParseSkillInput } from '../../src/agent/orchestrator'
import { partyResolverSkill } from '../../src/skills/party-resolver'
import { QueueMockLLM } from './mock-llm'
import type { LLMClient } from '../../src/agent/types'

describe('MappingAgent', () => {
  it('T1: single-match does not call LLM (DEC-01)', async () => {
    let calls = 0
    const llm: LLMClient = {
      async call() {
        calls++
        return { content: '' }
      },
    }
    const agent = new MappingAgent(llm)
    const [p] = await agent.generateMappings([
      {
        name: 'buyerPartyReference',
        path: '/trade/buyerPartyReference',
        value: 'party1',
      },
    ])
    expect(calls).toBe(0)
    expect(p.skillInvoked).toBe('party_resolver')
    expect(p.candidateProposals).toHaveLength(0)
  })

  it('T2: multi-match + LLM valid tool picks floating_rate_index_resolver', async () => {
    const mock = new QueueMockLLM([
      {
        content: '',
        tool_calls: [
          {
            id: '1',
            name: 'floating_rate_index_resolver',
            input: {},
          },
        ],
      },
    ])
    const agent = new MappingAgent(mock)
    const [p] = await agent.generateMappings([
      {
        name: 'floatingRateIndex',
        path: '/swapStream/floatingRateIndex',
        value: 'USD-LIBOR-BBA',
      },
    ])
    expect(p.skillInvoked).toBe('floating_rate_index_resolver')
    expect(p.candidateProposals.length).toBeGreaterThan(1)
    expect(p.trace.llmCallCount).toBeGreaterThanOrEqual(1)
    expect(p.needsReview).toBeFalse()
  })

  it('T3: multi-match + disallowed tool → priority fallback + arbitration', async () => {
    const mock = new QueueMockLLM([
      {
        content: '',
        tool_calls: [{ id: '1', name: 'totally_unknown_skill', input: {} }],
      },
      {
        content: '',
        tool_calls: [{ id: '2', name: 'totally_unknown_skill', input: {} }],
      },
    ])
    const agent = new MappingAgent(mock)
    const [p] = await agent.generateMappings([
      {
        name: 'floatingRateIndex',
        path: '/leg/floatingRateIndex',
        value: 'USD-SOFR',
      },
    ])
    expect(p.needsReview).toBeTrue()
    expect(p.trace.arbitrationNotes.join(' ') + p.reasoning).toMatch(
      /fallback|usable|allowed|tool/i
    )
    expect(p.skillInvoked).toBe(p.candidateProposals[0]!.skillName)
  })

  it('T4: multi-match + no tool_calls → fallback', async () => {
    const mock = new QueueMockLLM([
      { content: 'no tools', tool_calls: undefined },
      { content: 'still no', tool_calls: undefined },
    ])
    const agent = new MappingAgent(mock)
    const [p] = await agent.generateMappings([
      {
        name: 'floatingRateIndex',
        path: '/y/floatingRateIndex',
        value: 'USD-SOFR',
      },
    ])
    expect(p.needsReview).toBeTrue()
    expect(p.trace.arbitrationNotes.length).toBeGreaterThan(0)
  })

  it('T5: no skill match → unmapped', async () => {
    const agent = new MappingAgent()
    const [p] = await agent.generateMappings([
      { name: 'zzzUnknownField', path: '/meta/zzz', value: 'x' },
    ])
    expect(p.skillInvoked).toBe('none')
    expect(p.confidence).toBe(0)
    expect(p.needsReview).toBeTrue()
  })

  it('T6: ambiguous payer → needsReview + low confidence', async () => {
    const agent = new MappingAgent()
    const [p] = await agent.generateMappings([
      { name: 'payer', path: '/trade/payer', value: 'party1' },
    ])
    expect(p.skillInvoked).toBe('party_resolver')
    expect(p.confidence).toBeLessThanOrEqual(60)
    expect(p.needsReview).toBeTrue()
  })

  it('T7: safeParseSkillInput fails on incomplete input', () => {
    const r = safeParseSkillInput(partyResolverSkill, {})
    expect(r.success).toBeFalse()
  })

  it('T8: cardinality structuralHints present', async () => {
    const agent = new MappingAgent()
    const [p] = await agent.generateMappings([
      { name: 'tradeDate', path: '/trade/tradeDate', value: '2024-01-15' },
    ])
    expect(p.structuralHints).toMatchObject({
      fpmlCardinality: expect.any(String),
    })
  })

  it('T9: multi-match without LLM → needsReview + deterministic first candidate', async () => {
    const agent = new MappingAgent()
    const [p] = await agent.generateMappings([
      {
        name: 'floatingRateIndex',
        path: '/calc/floatingRateIndex',
        value: 'USD-LIBOR-BBA',
      },
    ])
    expect(p.candidateSkills.length).toBeGreaterThan(1)
    expect(p.needsReview).toBeTrue()
    expect(p.candidateProposals.length).toBeGreaterThan(0)
    expect(p.skillInvoked).toBe(p.candidateProposals[0]!.skillName)
  })
})
