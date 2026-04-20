import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import type { LLMClient } from './agent/types'
import { createUploadRouter } from './api/upload'
import { createMappingRouter } from './api/mapping'
import { createReviewRouter } from './api/review'
import { createExportRouter } from './api/export'
import { createCdmOrchestratorRouter } from './api/cdm-orchestrator'

import './skills'
import './storage/db'

export type AppDeps = {
  llmClient?: LLMClient
}

export function createApp(deps: AppDeps) {
  const app = new Hono()

  app.get('/health', c => c.json({ ok: true }))

  app.route('/api', createUploadRouter(deps))
  app.route('/api', createMappingRouter(deps))
  app.route('/api', createReviewRouter(deps))
  app.route('/api', createExportRouter(deps))
  app.route('/api', createCdmOrchestratorRouter(deps))

  app.use('/*', serveStatic({ root: './public' }))

  return app
}
