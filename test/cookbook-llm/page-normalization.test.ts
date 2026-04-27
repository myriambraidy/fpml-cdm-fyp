import { describe, expect, it } from 'bun:test'
import { normalizeAuthoredPage } from '../../src/cookbook-llm/page-normalization'
import { authoredPage, makePacket } from './helpers'

describe('normalizeAuthoredPage', () => {
  it('adds a required do-not-assume section from structured output', () => {
    const page = {
      ...authoredPage(),
      markdown: [
        '# FPML -> CDM Agent Cookbook',
        '',
        '## How To Use This Cookbook',
        'Use the evidence-backed cookbook to propose CDM mappings.',
        '',
        '## Operational Statuses',
        'Respect ready, pilot_only, review_only, and blocked status.',
        '',
        '## Product Family Routing',
        'Route by product family.',
        '',
        '## Proposed CDM Representation Format',
        'Return field mappings with evidence rule ids.',
      ].join('\n'),
      doNotAssume: ['Do not invent mapping facts.'],
    }

    const normalized = normalizeAuthoredPage(page, makePacket())

    expect(normalized.markdown).toContain('## Do Not Assume')
    expect(normalized.markdown).toContain('- Do not invent mapping facts.')
  })
})
