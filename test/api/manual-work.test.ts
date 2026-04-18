import './manual-work-env'

import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { createApp } from '../../src/app'

const app = createApp({ llmClient: undefined })

describe('Reduce manual work', () => {
  let uploadId: string

  it('setup upload + map', async () => {
    const xml = readFileSync('test/fixtures/sample-fpml.xml', 'utf8')
    const fd = new FormData()
    fd.set('formatType', 'xml')
    fd.set('file', new Blob([xml], { type: 'text/xml' }), 'sample-fpml.xml')
    const up = await app.request('/api/upload', { method: 'POST', body: fd })
    expect(up.status).toBe(200)
    uploadId = (await up.json() as { uploadId: string }).uploadId

    const map = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId }),
    })
    expect(map.status).toBe(200)
  })

  it('T-AA1: some proposals are auto_approved', async () => {
    const res = await app.request(`/api/review/${uploadId}`)
    const body = (await res.json()) as {
      proposals: Array<{ status: string }>
    }
    const autos = body.proposals.filter(p => p.status === 'auto_approved')
    expect(autos.length).toBeGreaterThan(0)
  })

  it('T-AA3: multi-candidate fields are not auto_approved', async () => {
    const res = await app.request(`/api/review/${uploadId}`)
    const body = (await res.json()) as {
      proposals: Array<{ status: string; payload: { candidateProposals: unknown[] } }>
    }
    for (const p of body.proposals) {
      const n = p.payload?.candidateProposals?.length ?? 0
      if (n > 1) {
        expect(p.status).not.toBe('auto_approved')
      }
    }
    expect(true).toBe(true)
  })

  it('T-BA1: batch approve two pending', async () => {
    const list = (await (await app.request(`/api/review/${uploadId}`)).json()) as {
      proposals: { id: string; status: string }[]
    }
    const pending = list.proposals.filter(p => p.status === 'pending').slice(0, 2)
    if (pending.length < 2) {
      return
    }
    const res = await app.request(`/api/review/${uploadId}/batch`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        proposalIds: pending.map(p => p.id),
        notes: 'batch',
      }),
    })
    expect(res.status).toBe(200)
  })

  it('T-BA2: batch empty is ok', async () => {
    const res = await app.request(`/api/review/${uploadId}/batch`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'approve', proposalIds: [] }),
    })
    expect(res.status).toBe(200)
  })

  it('T-IE1: edit pending proposal', async () => {
    const list = (await (await app.request(`/api/review/${uploadId}`)).json()) as {
      proposals: { id: string; status: string; cdmPath: string }[]
    }
    const pend = list.proposals.find(p => p.status === 'pending')
    if (!pend) {
      return
    }
    const res = await app.request(`/api/review/proposals/${pend.id}/edit`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        cdmPath: 'test.edit.path',
        transformation: 'manual_edit',
        notes: 'ie1',
      }),
    })
    expect(res.status).toBe(200)
    const again = (await (await app.request(`/api/review/${uploadId}`)).json()) as {
      proposals: { id: string; status: string; cdmPath: string }[]
    }
    const edited = again.proposals.find(p => p.id === pend.id)
    expect(edited?.status).toBe('edited')
    expect(edited?.cdmPath).toBe('test.edit.path')
  })
})
