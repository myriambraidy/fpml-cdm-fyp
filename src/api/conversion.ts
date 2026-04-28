import { Hono } from 'hono'
import type { AppDeps } from '../app'
import { getUploadMetadata } from '../storage/queries'

export function createConversionRouter(_deps: AppDeps) {
  const router = new Hono()

  router.get('/conversion/:uploadId', c => {
    const uploadId = c.req.param('uploadId')
    const upload = getUploadMetadata(uploadId)

    if (!upload) {
      return c.json({ error: 'upload not found' }, 404)
    }

    return c.json({ upload }, 200)
  })

  router.post('/conversion/:uploadId/generate', c => {
    const uploadId = c.req.param('uploadId')

    return c.json(
      {
        status: 'not_implemented',
        uploadId,
        message: 'Java mapper coming soon.',
        nextStep:
          'This endpoint will later call the deterministic Java FpML-to-CDM mapper.',
      },
      501
    )
  })

  return router
}
