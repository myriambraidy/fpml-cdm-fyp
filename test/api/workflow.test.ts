import './workflow-env'

import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { createApp } from '../../src/app'

const app = createApp({ llmClient: undefined })

describe('Week 3 API', () => {
  let uploadId: string

  it('W3-T1: upload XML fixture', async () => {
    const xml = readFileSync('test/fixtures/sample-fpml.xml', 'utf8')
    const fd = new FormData()
    fd.set('formatType', 'xml')
    fd.set('file', new Blob([xml], { type: 'text/xml' }), 'sample-fpml.xml')

    const res = await app.request('/api/upload', { method: 'POST', body: fd })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { uploadId: string; fieldsCount: number }
    expect(body.uploadId).toBeString()
    expect(body.fieldsCount).toBeGreaterThan(0)
    uploadId = body.uploadId
  })

  it('W3-T4: mapping', async () => {
    const res = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId }),
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { proposals: { payload: unknown }[] }
    expect(body.proposals.length).toBeGreaterThan(0)
  })

  it('W3-T5: mapping unknown upload → 404', async () => {
    const res = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId: '00000000-0000-4000-8000-000000000000' }),
    })
    expect(res.status).toBe(404)
  })

  it('W3-T7: review lists proposals with payload', async () => {
    const res = await app.request(`/api/review/${uploadId}`)
    expect(res.status).toBe(200)
    const body = (await res.json()) as {
      proposals: Array<{ payload: { trace?: unknown; candidateSkills?: unknown } }>
    }
    const first = body.proposals[0]
    expect(first?.payload).toBeDefined()
    expect(first.payload.trace).toBeDefined()
    expect(first.payload.candidateSkills).toBeArray()
  })

  it('W3-T8: approve', async () => {
    const list = (await (await app.request(`/api/review/${uploadId}`)).json()) as {
      proposals: { id: string }[]
    }
    const pid = list.proposals[0]!.id
    const res = await app.request(`/api/review/proposals/${pid}/approve`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ notes: 'lgtm' }),
    })
    expect(res.status).toBe(200)
  })

  it('W3-T9: reject another proposal', async () => {
    const list = (await (await app.request(`/api/review/${uploadId}`)).json()) as {
      proposals: { id: string; status: string }[]
    }
    const pending = list.proposals.find(p => p.status === 'pending')
    if (!pending) {
      expect(true).toBe(true)
      return
    }
    const res = await app.request(`/api/review/proposals/${pending.id}/reject`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ correction: 'bad mapping', notes: 'retry' }),
    })
    expect(res.status).toBe(200)
  })

  it('W3-T10: approve missing proposal → 404', async () => {
    const res = await app.request(
      '/api/review/proposals/00000000-0000-4000-8000-000000000000/approve',
      {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      }
    )
    expect(res.status).toBe(404)
  })

  it('W3-T6: re-mapping replaces proposals', async () => {
    const res1 = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId }),
    })
    expect(res1.status).toBe(200)
    const n1 = ((await res1.json()) as { proposals: unknown[] }).proposals.length
    const res2 = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId }),
    })
    expect(res2.status).toBe(200)
    const n2 = ((await res2.json()) as { proposals: unknown[] }).proposals.length
    expect(n1).toBe(n2)
  })
})

describe('Week 4 export API', () => {
  const app = createApp({ llmClient: undefined })
  let uploadId: string

  async function approveAllPending(uid: string) {
    const list = (await (await app.request(`/api/review/${uid}`)).json()) as {
      proposals: { id: string; status: string }[]
    }
    for (const p of list.proposals.filter(x => x.status === 'pending')) {
      const res = await app.request(`/api/review/proposals/${p.id}/approve`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      })
      expect(res.status).toBe(200)
    }
  }

  it('W4-T1: upload + map for export flow', async () => {
    const xml = readFileSync('test/fixtures/sample-fpml.xml', 'utf8')
    const fd = new FormData()
    fd.set('formatType', 'xml')
    fd.set('file', new Blob([xml], { type: 'text/xml' }), 'sample-fpml-export.xml')

    const up = await app.request('/api/upload', { method: 'POST', body: fd })
    expect(up.status).toBe(200)
    uploadId = ((await up.json()) as { uploadId: string }).uploadId

    const map = await app.request('/api/mapping', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ uploadId }),
    })
    expect(map.status).toBe(200)
  })

  it('W4-T2: POST export strict → 422 when pending remain', async () => {
    const res = await app.request(`/api/export/${uploadId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(422)
    const j = (await res.json()) as { error: string; pendingProposalIds: string[] }
    expect(j.error).toBe('INCOMPLETE_REVIEW')
    expect(j.pendingProposalIds.length).toBeGreaterThan(0)
  })

  it('W4-T3: POST export allowPartial → 200', async () => {
    const res = await app.request(`/api/export/${uploadId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ allowPartial: true }),
    })
    expect(res.status).toBe(200)
    const j = (await res.json()) as {
      exportId: string
      package: { version: string; document: { uploadId: string }; coverage: { skipped: unknown[] } }
    }
    expect(j.exportId).toBeString()
    expect(j.package.version).toBe('1.1.0-prototype')
    expect(j.package.document.uploadId).toBe(uploadId)
    expect(j.package.coverage.skipped.length).toBeGreaterThan(0)
  })

  it('W4-T4: GET latest export', async () => {
    const res = await app.request(`/api/export/${uploadId}`, { method: 'GET' })
    expect(res.status).toBe(200)
    const j = (await res.json()) as { exportId: string; exportedAt: string; package: { version: string } }
    expect(j.package.version).toBe('1.1.0-prototype')
    expect(j.exportedAt).toBeString()
  })

  it('W4-T5: approve all pending then strict export → 200', async () => {
    await approveAllPending(uploadId)
    const res = await app.request(`/api/export/${uploadId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(200)
    const j = (await res.json()) as {
      package: { mappings: unknown[]; coverage: { skipped: unknown[]; totalProposals: number } }
    }
    expect(j.package.mappings.length).toBeGreaterThan(0)
    expect(j.package.coverage.skipped.length).toBe(0)
  })

  it('W4-T6: GET unknown upload → 404', async () => {
    const res = await app.request(
      '/api/export/00000000-0000-4000-8000-000000000000',
      { method: 'GET' }
    )
    expect(res.status).toBe(404)
  })
})
