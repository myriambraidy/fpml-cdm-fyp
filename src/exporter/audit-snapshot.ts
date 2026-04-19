import { env, CDM_VERSION } from '../config'
import { SKILL_VERSIONS } from './skill-versions'
import type { ExportAuditSnapshot } from './types'

export function buildExportAuditSnapshot(args: {
  uploadId: string
  filename?: string
}): Omit<ExportAuditSnapshot, 'counts'> {
  return {
    exportedAt: new Date().toISOString(),
    exportedBy: env.ANALYST_EMAIL,
    cdmVersion: CDM_VERSION,
    skillVersions: { ...SKILL_VERSIONS },
    uploadId: args.uploadId,
    ...(args.filename != null ? { filename: args.filename } : {}),
  }
}
