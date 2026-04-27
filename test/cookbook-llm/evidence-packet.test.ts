import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { buildEvidencePackets } from '../../src/cookbook-llm/evidence-packet'
import { buildAuthorMessages } from '../../src/cookbook-llm/prompts'
import { writeDeterministicFixture } from './helpers'

describe('cookbook LLM evidence packets and prompts', () => {
  it('builds index, global, and family packets from deterministic cookbook output', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'cookbook-llm-packets-'))
    const root = join(tempDir, 'deterministic')
    await writeDeterministicFixture(root)

    const packets = await buildEvidencePackets({
      deterministicRoot: root,
      includeReviewOnly: true,
    })

    expect(packets.some(packet => packet.id === 'index')).toBe(true)
    expect(packets.some(packet => packet.id === 'global:identifier-handling')).toBe(true)
    expect(packets.some(packet => packet.id === 'family:fx-derivatives')).toBe(true)
    expect(packets.find(packet => packet.id === 'family:fx-derivatives')?.evidenceReferences.length).toBeGreaterThan(1)
  })

  it('builds author prompts with evidence and JSON instructions', () => {
    const packet = {
      id: 'index',
      subjectType: 'index' as const,
      title: 'Title',
      operationalStatus: 'ready' as const,
      deterministicMarkdown: '## How To Use This Cookbook\nUse it.',
      evidenceReferences: [
        {
          id: 'index:DETERMINISTIC',
          source: 'index.md',
          kind: 'deterministic' as const,
          text: 'Use it.',
        },
      ],
      requiredSections: ['How To Use This Cookbook'],
      allowedClaimsPolicy: ['Use evidence.'],
    }
    const messages = buildAuthorMessages(packet)

    expect(messages[1]?.content).toContain('<evidence_packet')
    expect(messages[1]?.content).toContain('<required_output>')
  })
})
