import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { createApp } from '../../src/app'

const app = createApp({ llmClient: undefined })

describe('Conversion API', () => {
  it('returns uploaded file metadata', async () => {
    const xml = readFileSync('test/fixtures/sample-fpml.xml', 'utf8')
    const fd = new FormData()
    fd.set('formatType', 'xml')
    fd.set('file', new Blob([xml], { type: 'text/xml' }), 'sample-fpml.xml')

    const uploadRes = await app.request('/api/upload', { method: 'POST', body: fd })
    expect(uploadRes.status).toBe(200)
    const uploadBody = (await uploadRes.json()) as { uploadId: string }

    const metadataRes = await app.request(`/api/conversion/${uploadBody.uploadId}`)
    expect(metadataRes.status).toBe(200)
    const metadataBody = (await metadataRes.json()) as {
      upload: {
        id: string
        filename: string
        formatType: string
        uploadedAt: string
      }
    }

    expect(metadataBody.upload.id).toBe(uploadBody.uploadId)
    expect(metadataBody.upload.filename).toBe('sample-fpml.xml')
    expect(metadataBody.upload.formatType).toBe('xml')
    expect(metadataBody.upload.uploadedAt).toBeString()
  })

  it('returns the Java mapper placeholder response', async () => {
    const res = await app.request('/api/conversion/test-upload/generate', {
      method: 'POST',
    })

    expect(res.status).toBe(501)
    const body = (await res.json()) as {
      status: string
      uploadId: string
      message: string
      nextStep: string
    }

    expect(body.status).toBe('not_implemented')
    expect(body.uploadId).toBe('test-upload')
    expect(body.message).toBe('Java mapper coming soon.')
    expect(body.nextStep).toContain('deterministic Java')
  })
})
