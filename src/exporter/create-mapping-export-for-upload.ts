import { env } from '../config'
import {
  countPendingProposals,
  countProposalsForUpload,
  getLatestExportForUpload,
  getUploadMeta,
  insertExportWithAudit,
  listApprovedMappingsForExport,
  listPendingProposalIds,
  listSkippedProposalsForExport,
} from '../storage/queries'
import { buildExportAuditSnapshot } from './audit-snapshot'
import { buildRosettaPackage } from './build-package'

export type LatestExportRow = {
  exportId: string
  exportedAt: string
  rosettaJson: string
}

export type CreateMappingExportForUploadResult =
  | { ok: true; row: LatestExportRow }
  | { ok: false; error: 'upload_not_found' }
  | { ok: false; error: 'INCOMPLETE_REVIEW'; pendingProposalIds: string[] }

/**
 * Builds the Rosetta mapping package and inserts an `exports` row (same as POST /api/export).
 */
export function createMappingExportForUpload(
  uploadId: string,
  opts: { allowPartial: boolean }
): CreateMappingExportForUploadResult {
  if (!opts.allowPartial && countPendingProposals(uploadId) > 0) {
    return {
      ok: false,
      error: 'INCOMPLETE_REVIEW',
      pendingProposalIds: listPendingProposalIds(uploadId),
    }
  }

  const meta = getUploadMeta(uploadId)
  if (!meta) {
    return { ok: false, error: 'upload_not_found' }
  }

  const approved = listApprovedMappingsForExport(uploadId)
  const skipped = listSkippedProposalsForExport(uploadId)
  const totalProposalCount = countProposalsForUpload(uploadId)
  const baseAudit = buildExportAuditSnapshot({ uploadId, filename: meta.filename })
  const pkg = buildRosettaPackage({
    document: { uploadId, filename: meta.filename, formatType: meta.formatType },
    totalProposalCount,
    approved,
    skipped,
    audit: baseAudit,
  })

  const exportId = crypto.randomUUID()
  const rosettaJson = JSON.stringify(pkg)
  insertExportWithAudit({
    exportId,
    uploadId,
    rosettaJson,
    exportedBy: env.ANALYST_EMAIL,
    auditMetadata: {
      uploadId,
      mappings: pkg.mappings.length,
      skipped: pkg.coverage.skipped.length,
    },
  })

  const row = getLatestExportForUpload(uploadId)
  if (!row) {
    throw new Error('createMappingExportForUpload: export row missing after insert')
  }
  return { ok: true, row }
}
