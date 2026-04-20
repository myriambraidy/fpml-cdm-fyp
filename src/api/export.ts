import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { uploadExists, getLatestExportForUpload } from '../storage/queries'
import { createMappingExportForUpload } from '../exporter/create-mapping-export-for-upload'
import type { RosettaMappingPackage } from '../exporter/types'
import type { AppDeps } from '../app'

const UploadIdParams = z.object({
  uploadId: z.string().openapi({ param: { name: 'uploadId', in: 'path' } }),
})

const ExportBodySchema = z.object({
  allowPartial: z.boolean().optional(),
})

const exportPostRoute = createRoute({
  method: 'post',
  path: '/export/{uploadId}',
  request: {
    params: UploadIdParams,
    body: {
      content: {
        'application/json': {
          schema: ExportBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Export created',
      content: { 'application/json': { schema: z.object({ exportId: z.string(), package: z.any() }) } },
    },
    404: { description: 'Upload not found' },
    422: { description: 'Incomplete review' },
  },
})

const exportGetRoute = createRoute({
  method: 'get',
  path: '/export/{uploadId}',
  request: { params: UploadIdParams },
  responses: {
    200: {
      description: 'Latest export',
      content: {
        'application/json': {
          schema: z.object({
            exportId: z.string(),
            exportedAt: z.string(),
            package: z.any(),
          }),
        },
      },
    },
    404: { description: 'No export or upload' },
  },
})

export function createExportRouter(_deps: AppDeps) {
  const router = new OpenAPIHono()

  router.openapi(exportPostRoute, async c => {
    const { uploadId } = c.req.valid('param')
    const body = c.req.valid('json')

    if (!uploadExists(uploadId)) {
      return c.json({ error: 'upload_not_found' }, 404)
    }

    const created = createMappingExportForUpload(uploadId, {
      allowPartial: body.allowPartial ?? false,
    })
    if (!created.ok) {
      if (created.error === 'upload_not_found') {
        return c.json({ error: 'upload_not_found' }, 404)
      }
      return c.json(
        { error: 'INCOMPLETE_REVIEW', pendingProposalIds: created.pendingProposalIds },
        422
      )
    }

    const pkg = JSON.parse(created.row.rosettaJson) as RosettaMappingPackage
    return c.json({ exportId: created.row.exportId, package: pkg }, 200)
  })

  router.openapi(exportGetRoute, async c => {
    const { uploadId } = c.req.valid('param')
    if (!uploadExists(uploadId)) {
      return c.json({ error: 'upload_not_found' }, 404)
    }
    const row = getLatestExportForUpload(uploadId)
    if (!row) {
      return c.json({ error: 'export_not_found' }, 404)
    }
    const pkg = JSON.parse(row.rosettaJson) as RosettaMappingPackage
    return c.json({ exportId: row.exportId, exportedAt: row.exportedAt, package: pkg }, 200)
  })

  return router
}
