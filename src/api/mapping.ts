import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { MappingAgent } from '../agent/orchestrator'
import {
  getFieldsByUpload,
  getFieldIdMap,
  listProposalsForUpload,
  saveProposals,
  uploadExists,
} from '../storage/queries'
import type { AppDeps } from '../app'

const MappingBodySchema = z.object({
  uploadId: z.string(),
})

const ProposalsResponse = z.object({
  proposals: z.array(z.any()),
})

const mappingRoute = createRoute({
  method: 'post',
  path: '/mapping',
  request: {
    body: {
      content: {
        'application/json': {
          schema: MappingBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Mapping proposals generated',
      content: { 'application/json': { schema: ProposalsResponse } },
    },
    404: { description: 'Upload not found' },
  },
})

export function createMappingRouter(deps: AppDeps) {
  const router = new OpenAPIHono()

  router.openapi(mappingRoute, async c => {
    const { uploadId } = c.req.valid('json')

    if (!uploadExists(uploadId)) {
      return c.json({ error: 'upload not found' }, 404)
    }

    const fields = getFieldsByUpload(uploadId)
    if (fields.length === 0) {
      return c.json({ error: 'upload not found or has no fields' }, 404)
    }

    const agent = new MappingAgent(deps.llmClient)
    const generated = await agent.generateMappings(fields)
    const fieldIdByPath = getFieldIdMap(uploadId)
    saveProposals(uploadId, generated, fieldIdByPath)

    const proposals = listProposalsForUpload(uploadId)
    return c.json({ proposals }, 200)
  })

  return router
}
