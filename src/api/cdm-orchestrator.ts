import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import type { AppDeps } from '../app'
import { createMappingExportForUpload } from '../exporter/create-mapping-export-for-upload'
import {
  getCdmOrchestratorRun,
  getFieldsByUpload,
  getLatestExportForUpload,
  getUploadContent,
  insertCdmOrchestratorRun,
  listCdmOrchestratorRuns,
  uploadExists,
} from '../storage/queries'
import type { RosettaMappingPackage } from '../exporter/types'
import { CdmOrchestrator } from '../copilot/cdm-orchestrator'
import { env } from '../config'
import { validateSemanticCdm } from '../cdm-validation/semantic'
import { validateStructuralCdm } from '../cdm-validation/structural'

const UploadIdParams = z.object({
  uploadId: z.string().openapi({ param: { name: 'uploadId', in: 'path' } }),
})

const RunIdParams = z.object({
  uploadId: z.string().openapi({ param: { name: 'uploadId', in: 'path' } }),
  runId: z.string().openapi({ param: { name: 'runId', in: 'path' } }),
})

const ValidateBody = z.object({
  cdm: z.record(z.any()),
})

const runRoute = createRoute({
  method: 'post',
  path: '/cdm-orchestrator/{uploadId}/run',
  request: { params: UploadIdParams },
  responses: {
    200: {
      description: 'CDM orchestration run completed',
      content: {
        'application/json': {
          schema: z.object({
            runId: z.string(),
            status: z.string(),
            cdmPayload: z.record(z.any()).optional(),
            cdm: z.record(z.any()).optional(),
            provenance: z.record(z.any()).optional(),
            ambiguities: z.array(z.any()),
            recommendations: z.array(z.string()),
            attempts: z.array(z.any()),
            repairTrace: z.array(z.any()),
            validation: z.object({
              structural: z.object({ ok: z.boolean(), errors: z.array(z.any()) }),
              semantic: z.object({ ok: z.boolean(), errors: z.array(z.any()) }),
            }),
          }),
        },
      },
    },
    404: { description: 'Upload/export not found' },
    422: { description: 'Cannot build export (e.g. incomplete review)' },
  },
})

const listRoute = createRoute({
  method: 'get',
  path: '/cdm-orchestrator/{uploadId}/runs',
  request: { params: UploadIdParams },
  responses: {
    200: {
      description: 'List CDM orchestration runs',
      content: { 'application/json': { schema: z.object({ runs: z.array(z.any()) }) } },
    },
    404: { description: 'Upload not found' },
  },
})

const getRoute = createRoute({
  method: 'get',
  path: '/cdm-orchestrator/{uploadId}/runs/{runId}',
  request: { params: RunIdParams },
  responses: {
    200: {
      description: 'Single CDM orchestration run',
      content: { 'application/json': { schema: z.object({ run: z.any() }) } },
    },
    404: { description: 'Run not found' },
  },
})

const validateRoute = createRoute({
  method: 'post',
  path: '/cdm-orchestrator/{uploadId}/validate',
  request: {
    params: UploadIdParams,
    body: {
      content: {
        'application/json': {
          schema: ValidateBody,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Validation result',
      content: {
        'application/json': {
          schema: z.object({
            structural: z.object({ ok: z.boolean(), errors: z.array(z.any()) }),
            semantic: z.object({ ok: z.boolean(), errors: z.array(z.any()) }),
          }),
        },
      },
    },
    404: { description: 'Upload not found' },
  },
})

export function createCdmOrchestratorRouter(deps: AppDeps) {
  const router = new OpenAPIHono()

  router.openapi(runRoute, async c => {
    const { uploadId } = c.req.valid('param')
    if (!uploadExists(uploadId)) {
      console.warn('[cdm-orchestrator:api] POST /run 404 upload_not_found', { uploadId })
      return c.json({ error: 'upload_not_found' }, 404)
    }

    let allowPartial = false
    const ct = (c.req.header('content-type') ?? '').toLowerCase()
    if (ct.includes('application/json')) {
      const parsed = z
        .object({ allowPartial: z.boolean().optional() })
        .safeParse(await c.req.json().catch(() => ({})))
      if (parsed.success) {
        allowPartial = parsed.data.allowPartial ?? false
      }
    }

    let exportRow = getLatestExportForUpload(uploadId)
    if (!exportRow) {
      const created = createMappingExportForUpload(uploadId, { allowPartial })
      if (!created.ok) {
        if (created.error === 'INCOMPLETE_REVIEW') {
          console.warn('[cdm-orchestrator:api] POST /run 422 INCOMPLETE_REVIEW — auto-export blocked', {
            uploadId,
            pendingCount: created.pendingProposalIds.length,
          })
          return c.json(
            {
              error: 'INCOMPLETE_REVIEW',
              pendingProposalIds: created.pendingProposalIds,
              hint:
                'Orchestrator needs a Rosetta package from `exports`. Approve pending mappings, run export from Review, ' +
                'or POST /run with JSON body {"allowPartial":true} (same as partial export).',
            },
            422
          )
        }
        console.warn('[cdm-orchestrator:api] POST /run 404 upload_not_found (meta)', { uploadId })
        return c.json({ error: 'upload_not_found' }, 404)
      }
      exportRow = created.row
    }
    const fpml = getUploadContent(uploadId)
    if (!fpml) {
      console.warn('[cdm-orchestrator:api] POST /run 404 upload_content_not_found', { uploadId })
      return c.json({ error: 'upload_content_not_found' }, 404)
    }

    const pkg = JSON.parse(exportRow.rosettaJson) as RosettaMappingPackage
    const fields = getFieldsByUpload(uploadId)
    const debugRequested =
      env.CDM_ORCHESTRATOR_DEBUG || c.req.header('x-cdm-debug') === '1'
    if (debugRequested) {
      console.log('[cdm-orchestrator:api] POST /run', {
        uploadId,
        exportId: exportRow.exportId,
        fields: fields.length,
        mappings: pkg.mappings?.length ?? 0,
      })
    }

    const orchestrator = new CdmOrchestrator(deps.llmClient)
    const result = await orchestrator.run({ pkg, fpml, fields }, { debug: debugRequested })

    const runId = crypto.randomUUID()
    insertCdmOrchestratorRun({
      id: runId,
      uploadId,
      exportId: exportRow.exportId,
      inputRosettaJson: exportRow.rosettaJson,
      inputSourceXml: fpml,
      inputFieldsJson: JSON.stringify(fields),
      outputCdmJson: result.cdmPayload ? JSON.stringify(result.cdmPayload) : null,
      envelopeJson: JSON.stringify({
        reasoning: result.reasoning,
        sourceEvidence: result.sourceEvidence,
        openQuestions: result.openQuestions,
        provenance: result.provenance,
        ambiguities: result.ambiguities,
        recommendations: result.recommendations,
        assemblyDiagnostics: result.assemblyDiagnostics,
      }),
      status: result.status,
      attemptsJson: JSON.stringify(result.attempts),
      repairTraceJson: JSON.stringify(result.repairTrace),
      structuralValidationOk: result.structural.ok,
      structuralErrorsJson: JSON.stringify(result.structural.errors),
      semanticValidationOk: result.semantic.ok,
      semanticErrorsJson: JSON.stringify(result.semantic.errors),
      validatorKind: result.semantic.validatorKind,
      validatorVersion: result.semantic.validatorVersion ?? null,
      openrouterModel: env.CDM_ORCHESTRATOR_MODEL || env.OPENROUTER_MODEL,
      promptVersion: env.CDM_ORCHESTRATOR_PROMPT_VERSION,
      createdBy: env.ANALYST_EMAIL,
    })

    if (debugRequested) {
      console.log('[cdm-orchestrator:api] POST /run done', {
        uploadId,
        runId,
        status: result.status,
        durationMs: result.debug?.durationMs,
        eventCount: result.debug?.events?.length,
      })
    }

    return c.json(
      {
        runId,
        status: result.status,
        cdmPayload: result.cdmPayload,
        cdm: result.cdm,
        provenance: result.provenance,
        reasoning: result.reasoning,
        attempts: result.attempts,
        repairTrace: result.repairTrace,
        sourceEvidence: result.sourceEvidence,
        openQuestions: result.openQuestions,
        ambiguities: result.ambiguities,
        recommendations: result.recommendations,
        assemblyDiagnostics: result.assemblyDiagnostics,
        validation: {
          structural: result.structural,
          semantic: result.semantic,
        },
        ...(result.debug ? { debug: result.debug } : {}),
      },
      200
    )
  })

  router.openapi(listRoute, async c => {
    const { uploadId } = c.req.valid('param')
    if (!uploadExists(uploadId)) {
      return c.json({ error: 'upload_not_found' }, 404)
    }
    return c.json({ runs: listCdmOrchestratorRuns(uploadId) }, 200)
  })

  router.openapi(getRoute, async c => {
    const { uploadId, runId } = c.req.valid('param')
    const run = getCdmOrchestratorRun(uploadId, runId)
    if (!run) {
      return c.json({ error: 'run_not_found' }, 404)
    }
    return c.json({ run }, 200)
  })

  router.openapi(validateRoute, async c => {
    const { uploadId } = c.req.valid('param')
    if (!uploadExists(uploadId)) {
      return c.json({ error: 'upload_not_found' }, 404)
    }
    const { cdm } = c.req.valid('json')
    const structural = validateStructuralCdm(cdm)
    const semantic = structural.ok
      ? validateSemanticCdm(cdm)
      : validateSemanticCdm({}, env.CDM_ORCHESTRATOR_ROOT_TYPE)
    return c.json({ structural, semantic }, 200)
  })

  return router
}
