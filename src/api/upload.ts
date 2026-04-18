import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { parseXML } from '../parser/xml-parser'
import { parseJSON } from '../parser/json-parser'
import { saveUpload, saveFields } from '../storage/queries'
import { env } from '../config'
import type { AppDeps } from '../app'

const SuccessSchema = z.object({
  uploadId: z.string(),
  fieldsCount: z.number(),
})

const uploadOkRoute = createRoute({
  method: 'post',
  path: '/upload',
  responses: {
    200: {
      description: 'Upload successful',
      content: { 'application/json': { schema: SuccessSchema } },
    },
    400: { description: 'Bad request' },
    413: { description: 'Payload too large' },
  },
})

export function createUploadRouter(_deps: AppDeps) {
  const router = new OpenAPIHono()

  router.openapi(uploadOkRoute, async c => {
    const len = c.req.header('content-length')
    if (len && Number(len) > env.UPLOAD_MAX_BYTES) {
      return c.json({ error: 'payload too large' }, 413)
    }

    const body = await c.req.parseBody({ all: true })
    const file = body.file
    const formatType = body.formatType

    if (!(file instanceof File)) {
      return c.json({ error: 'file required' }, 400)
    }
    if (formatType !== 'xml' && formatType !== 'json') {
      return c.json({ error: 'invalid formatType' }, 400)
    }

    const content = await file.text()
    if (content.length > env.UPLOAD_MAX_BYTES) {
      return c.json({ error: 'payload too large' }, 413)
    }

    const fields = formatType === 'xml' ? parseXML(content) : parseJSON(content)

    const uploadId = crypto.randomUUID()
    saveUpload({
      id: uploadId,
      filename: file.name,
      content,
      formatType,
      uploadedBy: env.ANALYST_EMAIL,
    })
    saveFields(uploadId, fields)

    return c.json({ uploadId, fieldsCount: fields.length }, 200)
  })

  return router
}
