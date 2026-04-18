import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import {
  listProposalsForUpload,
  approveProposal,
  rejectProposal,
  batchReviewActions,
  editProposal,
} from '../storage/queries'
import { env } from '../config'
import type { AppDeps } from '../app'

const UploadIdParams = z.object({
  uploadId: z.string().openapi({ param: { name: 'uploadId', in: 'path' } }),
})

const ProposalIdParams = z.object({
  proposalId: z.string().openapi({ param: { name: 'proposalId', in: 'path' } }),
})

const ListResponse = z.object({
  uploadId: z.string(),
  proposals: z.array(z.any()),
})

const listRoute = createRoute({
  method: 'get',
  path: '/review/{uploadId}',
  request: {
    params: UploadIdParams,
  },
  responses: {
    200: {
      description: 'Proposals for review',
      content: { 'application/json': { schema: ListResponse } },
    },
  },
})

const ApproveBody = z.object({
  notes: z.string().optional(),
})

const approveRoute = createRoute({
  method: 'patch',
  path: '/review/proposals/{proposalId}/approve',
  request: {
    params: ProposalIdParams,
    body: {
      content: {
        'application/json': {
          schema: ApproveBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Approved',
      content: {
        'application/json': { schema: z.object({ ok: z.boolean(), approvedMappingId: z.string() }) },
      },
    },
    404: { description: 'Not found' },
  },
})

const RejectBody = z.object({
  correction: z.string().optional(),
  notes: z.string().optional(),
})

const rejectRoute = createRoute({
  method: 'patch',
  path: '/review/proposals/{proposalId}/reject',
  request: {
    params: ProposalIdParams,
    body: {
      content: {
        'application/json': {
          schema: RejectBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Rejected',
      content: { 'application/json': { schema: z.object({ ok: z.boolean() }) } },
    },
    404: { description: 'Not found' },
  },
})

const EditBody = z.object({
  cdmPath: z.string(),
  transformation: z.string(),
  notes: z.string().optional(),
})

const editRoute = createRoute({
  method: 'patch',
  path: '/review/proposals/{proposalId}/edit',
  request: {
    params: ProposalIdParams,
    body: {
      content: {
        'application/json': {
          schema: EditBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Edited',
      content: {
        'application/json': { schema: z.object({ ok: z.boolean(), approvedMappingId: z.string() }) },
      },
    },
    404: { description: 'Not found' },
  },
})

const BatchBody = z.object({
  action: z.enum(['approve', 'reject']),
  proposalIds: z.array(z.string()),
  notes: z.string().optional(),
  correction: z.string().optional(),
})

const batchRoute = createRoute({
  method: 'post',
  path: '/review/{uploadId}/batch',
  request: {
    params: UploadIdParams,
    body: {
      content: {
        'application/json': {
          schema: BatchBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Batch completed',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.boolean(),
            approvedMappingIds: z.array(z.string()),
          }),
        },
      },
    },
    400: { description: 'Bad request' },
  },
})

export function createReviewRouter(_deps: AppDeps) {
  const router = new OpenAPIHono()

  router.openapi(listRoute, async c => {
    const { uploadId } = c.req.valid('param')
    const proposals = listProposalsForUpload(uploadId)
    return c.json({ uploadId, proposals }, 200)
  })

  router.openapi(approveRoute, async c => {
    const { proposalId } = c.req.valid('param')
    const body = c.req.valid('json')
    try {
      const approvedMappingId = approveProposal(proposalId, env.ANALYST_EMAIL, body?.notes)
      return c.json({ ok: true as const, approvedMappingId }, 200)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('not found')) {
        return c.json({ error: msg }, 404)
      }
      throw e
    }
  })

  router.openapi(rejectRoute, async c => {
    const { proposalId } = c.req.valid('param')
    const body = c.req.valid('json')
    try {
      rejectProposal(proposalId, env.ANALYST_EMAIL, body?.correction, body?.notes)
      return c.json({ ok: true as const }, 200)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('not found')) {
        return c.json({ error: msg }, 404)
      }
      throw e
    }
  })

  router.openapi(editRoute, async c => {
    const { proposalId } = c.req.valid('param')
    const body = c.req.valid('json')
    try {
      const approvedMappingId = editProposal(
        proposalId,
        env.ANALYST_EMAIL,
        body.cdmPath,
        body.transformation,
        body.notes
      )
      return c.json({ ok: true as const, approvedMappingId }, 200)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('not found')) {
        return c.json({ error: msg }, 404)
      }
      throw e
    }
  })

  router.openapi(batchRoute, async c => {
    const { uploadId } = c.req.valid('param')
    const body = c.req.valid('json')
    try {
      const { approvedMappingIds } = batchReviewActions(
        uploadId,
        body.action,
        body.proposalIds,
        env.ANALYST_EMAIL,
        { notes: body.notes, correction: body.correction }
      )
      return c.json({ ok: true as const, approvedMappingIds }, 200)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('not found') || msg.includes('not part of upload')) {
        return c.json({ error: msg }, 400)
      }
      throw e
    }
  })

  return router
}
