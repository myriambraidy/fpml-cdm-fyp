import './workflow-env'

import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { createApp } from '../../src/app'
import type { LLMClient, LLMResponse } from '../../src/agent/types'

class MockRepairLLM implements LLMClient {
  async call(params: {
    messages: Array<{ role: string; content: string }>
  }): Promise<LLMResponse> {
    return {
      content: JSON.stringify({
        reasoning: 'mock llm output',
        cdm: {
          tradeState: {
            tradeDate: { value: '2026-01-10' },
            party: [
              { globalKey: 'party1', externalKey: 'party1' },
              { globalKey: 'party2', externalKey: 'party2' },
            ],
            tradableProduct: {
              counterparty: [{ partyReference: 'party1' }, { partyReference: 'party2' }],
            },
          },
        },
        sourceEvidence: [
          {
            sourcePath: '/trade/buyerPartyReference',
            targetPath: 'tradableProduct.counterparty[0]',
            note: 'repaired from validator feedback',
          },
        ],
        openQuestions: [],
      }),
    }
  }
}

describe('CDM orchestrator API', () => {
  const app = createApp({ llmClient: new MockRepairLLM() })
  let uploadId = ''

  it('uploads, maps, approves, auto-exports on run, and completes orchestrator run', async () => {
    const xml = readFileSync('test/fixtures/sample-fpml.xml', 'utf8')
    const fd = new FormData()
    fd.set('formatType', 'xml')
    fd.set('file', new Blob([xml], { type: 'text/xml' }), 'sample-fpml-cdm.xml')

    const uploadRes = await app.request('/api/upload', { method: 'POST', body: fd })
    expect(uploadRes.status).toBe(200)
    uploadId = ((await uploadRes.json()) as { uploadId: string }).uploadId

    const mapRes = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId }),
    })
    expect(mapRes.status).toBe(200)

    const review = (await (await app.request(`/api/review/${uploadId}`)).json()) as {
      proposals: { id: string; status: string }[]
    }
    for (const proposal of review.proposals.filter(p => p.status === 'pending')) {
      const approve = await app.request(`/api/review/proposals/${proposal.id}/approve`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
      expect(approve.status).toBe(200)
    }

    const runRes = await app.request(`/api/cdm-orchestrator/${uploadId}/run`, {
      method: 'POST',
    })
    expect(runRes.status).toBe(200)
    const run = (await runRes.json()) as {
      runId: string
      status: string
      attempts: Array<{ semantic?: { ok: boolean } }>
      repairTrace: unknown[]
      validation: {
        structural: { ok: boolean }
        semantic: { ok: boolean }
      }
    }
    expect(run.runId).toBeString()
    expect(['semantically_invalid', 'compliant']).toContain(run.status)
    expect(run.validation.structural.ok).toBe(true)
    expect(typeof run.validation.semantic.ok).toBe('boolean')
    expect(run.attempts.length).toBe(1)
    expect(run.repairTrace.length).toBe(0)

    const runsRes = await app.request(`/api/cdm-orchestrator/${uploadId}/runs`)
    expect(runsRes.status).toBe(200)
    const runs = (await runsRes.json()) as { runs: Array<{ id: string }> }
    expect(runs.runs.length).toBeGreaterThan(0)

    const detailRes = await app.request(
      `/api/cdm-orchestrator/${uploadId}/runs/${runs.runs[0]!.id}`
    )
    expect(detailRes.status).toBe(200)
  })

  it('POST /run without prior export returns 422 when proposals are still pending', async () => {
    const xml = readFileSync('test/fixtures/sample-fpml.xml', 'utf8')
    const fd = new FormData()
    fd.set('formatType', 'xml')
    fd.set('file', new Blob([xml], { type: 'text/xml' }), 'sample-fpml-cdm-pending.xml')

    const uploadRes = await app.request('/api/upload', { method: 'POST', body: fd })
    expect(uploadRes.status).toBe(200)
    const pendingUploadId = ((await uploadRes.json()) as { uploadId: string }).uploadId

    const mapRes = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId: pendingUploadId }),
    })
    expect(mapRes.status).toBe(200)

    const runRes = await app.request(`/api/cdm-orchestrator/${pendingUploadId}/run`, {
      method: 'POST',
    })
    expect(runRes.status).toBe(422)
    const body = (await runRes.json()) as { error: string; pendingProposalIds?: string[] }
    expect(body.error).toBe('INCOMPLETE_REVIEW')
    expect(body.pendingProposalIds?.length).toBeGreaterThan(0)
  })

  it('re-validates edited JSON', async () => {
    const validateRes = await app.request(`/api/cdm-orchestrator/${uploadId}/validate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        cdm: {
          tradeState: {
            tradeDate: { value: '2026-01-10' },
            party: [
              { globalKey: 'party1', externalKey: 'party1' },
              { globalKey: 'party2', externalKey: 'party2' },
            ],
            tradableProduct: {
              counterparty: [{ partyReference: 'party1' }, { partyReference: 'party2' }],
            },
          },
        },
      }),
    })
    expect(validateRes.status).toBe(200)
    const body = (await validateRes.json()) as {
      structural: { ok: boolean }
      semantic: { ok: boolean }
    }
    expect(body.structural.ok).toBe(true)
    expect(body.semantic.ok).toBe(true)
  })
})
