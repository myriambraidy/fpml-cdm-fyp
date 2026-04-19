import type { MappingProposal } from '../agent/types'
import type { Field } from '../parser/types'
import { env } from '../config'
import { db } from './db'

const SYSTEM_AUTO = 'system:auto'

export function qualifiesForAutoApprove(p: MappingProposal): boolean {
  return (
    p.confidence >= env.AUTO_APPROVE_THRESHOLD &&
    !p.needsReview &&
    p.candidateProposals.length <= 1
  )
}

export interface UploadRow {
  id: string
  filename: string
  content: string
  formatType: 'xml' | 'json'
  uploadedBy: string
}

export function saveUpload(row: UploadRow): void {
  db.prepare(
    `INSERT INTO uploads (id, filename, content, format_type, uploaded_at, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    row.id,
    row.filename,
    row.content,
    row.formatType,
    new Date().toISOString(),
    row.uploadedBy
  )
}

function fieldKey(path: string, name: string): string {
  return `${path}::${name}`
}

export function saveFields(uploadId: string, fields: Field[]): void {
  const stmt = db.prepare(
    `INSERT INTO fields (id, upload_id, name, type, path, value, context, is_array, min_occurs, max_occurs)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const tx = db.transaction((fs: Field[]) => {
    for (const f of fs) {
      stmt.run(
        crypto.randomUUID(),
        uploadId,
        f.name,
        f.type ?? null,
        f.path,
        f.value ?? null,
        f.context ? JSON.stringify(f.context) : null,
        f.isArray ? 1 : null,
        f.minOccurs ?? null,
        f.maxOccurs != null ? String(f.maxOccurs) : null
      )
    }
  })
  tx(fields)
}

export function uploadExists(uploadId: string): boolean {
  const row = db.prepare(`SELECT 1 AS ok FROM uploads WHERE id = ?`).get(uploadId) as
    | { ok: number }
    | undefined
  return row !== undefined
}

export function getFieldsByUpload(uploadId: string): Field[] {
  const rows = db
    .prepare(
      `SELECT name, type, path, value, context, is_array, min_occurs, max_occurs
       FROM fields WHERE upload_id = ?`
    )
    .all(uploadId) as Array<Record<string, unknown>>
  return rows.map(r => {
    const maxRaw = r.max_occurs as string | null | undefined
    let maxOccurs: Field['maxOccurs']
    if (maxRaw === null || maxRaw === undefined) {
      maxOccurs = undefined
    } else if (maxRaw === 'unbounded') {
      maxOccurs = 'unbounded'
    } else {
      const n = Number(maxRaw)
      maxOccurs = Number.isNaN(n) ? undefined : n
    }
    return {
      name: r.name as string,
      type: (r.type as string | null) ?? undefined,
      path: r.path as string,
      value: (r.value as string | null) ?? undefined,
      context: r.context ? JSON.parse(r.context as string) : undefined,
      isArray: r.is_array ? true : undefined,
      minOccurs: (r.min_occurs as number | null) ?? undefined,
      maxOccurs,
    }
  })
}

export function getFieldIdMap(uploadId: string): Map<string, string> {
  const rows = db
    .prepare(`SELECT id, path, name FROM fields WHERE upload_id = ?`)
    .all(uploadId) as { id: string; path: string; name: string }[]
  return new Map(rows.map(r => [fieldKey(r.path, r.name), r.id]))
}

export function saveProposals(
  uploadId: string,
  proposals: MappingProposal[],
  fieldIdByPath: Map<string, string>
): void {
  const delApproved = db.prepare(
    `DELETE FROM approved_mappings WHERE proposal_id IN (SELECT id FROM proposals WHERE upload_id = ?)`
  )
  const delFailed = db.prepare(
    `DELETE FROM failed_mappings WHERE proposal_id IN (SELECT id FROM proposals WHERE upload_id = ?)`
  )
  const delAudit = db.prepare(
    `DELETE FROM audit_log WHERE entity_type = 'proposal' AND entity_id IN (SELECT id FROM proposals WHERE upload_id = ?)`
  )
  const del = db.prepare(`DELETE FROM proposals WHERE upload_id = ?`)
  const ins = db.prepare(
    `INSERT INTO proposals
       (id, upload_id, field_id, cdm_path, transformation, confidence,
        reasoning, skill_invoked, status, needs_review, payload_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const insApproved = db.prepare(
    `INSERT INTO approved_mappings (id, proposal_id, cdm_path, transformation, approved_by, approved_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
  const insAudit = db.prepare(
    `INSERT INTO audit_log (id, entity_type, entity_id, action, user, timestamp, metadata)
     VALUES (?, 'proposal', ?, ?, ?, ?, NULL)`
  )
  const now = new Date().toISOString()
  const tx = db.transaction(() => {
    delApproved.run(uploadId)
    delFailed.run(uploadId)
    delAudit.run(uploadId)
    del.run(uploadId)
    for (const p of proposals) {
      const key = fieldKey(p.sourceField.path, p.sourceField.name)
      const fieldId = fieldIdByPath.get(key)
      if (!fieldId) {
        throw new Error(`No field row for ${key}`)
      }
      const proposalId = crypto.randomUUID()
      const auto = qualifiesForAutoApprove(p)
      const status = auto ? 'auto_approved' : 'pending'
      ins.run(
        proposalId,
        uploadId,
        fieldId,
        p.cdmPath,
        p.transformation,
        p.confidence,
        p.reasoning,
        p.skillInvoked,
        status,
        p.needsReview ? 1 : 0,
        JSON.stringify(p),
        now
      )
      if (auto) {
        const amId = crypto.randomUUID()
        insApproved.run(
          amId,
          proposalId,
          p.cdmPath,
          p.transformation,
          SYSTEM_AUTO,
          now,
          'auto-approved by policy'
        )
        insAudit.run(crypto.randomUUID(), proposalId, 'auto_approved', SYSTEM_AUTO, now)
      }
    }
  })
  tx()
}

export interface StoredProposal {
  id: string
  uploadId: string
  fieldId: string
  status: 'pending' | 'approved' | 'rejected' | 'edited' | 'auto_approved'
  createdAt: string
  cdmPath: string
  transformation: string
  confidence: number
  reasoning: string
  skillInvoked: string
  needsReview: boolean
  payload: MappingProposal
}

export function listProposalsForUpload(uploadId: string): StoredProposal[] {
  const rows = db
    .prepare(
      `SELECT p.id, p.upload_id, p.field_id, p.cdm_path, p.transformation,
            p.confidence, p.reasoning, p.skill_invoked, p.status,
            p.needs_review, p.payload_json, p.created_at
     FROM proposals p
     WHERE p.upload_id = ?
     ORDER BY p.created_at`
    )
    .all(uploadId) as Array<Record<string, unknown>>

  return rows.map(r => ({
    id: r.id as string,
    uploadId: r.upload_id as string,
    fieldId: r.field_id as string,
    status: r.status as StoredProposal['status'],
    createdAt: r.created_at as string,
    cdmPath: r.cdm_path as string,
    transformation: r.transformation as string,
    confidence: r.confidence as number,
    reasoning: r.reasoning as string,
    skillInvoked: r.skill_invoked as string,
    needsReview: Boolean(r.needs_review),
    payload: JSON.parse(r.payload_json as string) as MappingProposal,
  }))
}

function findApprovedMappingId(proposalId: string): string | undefined {
  const r = db
    .prepare(`SELECT id FROM approved_mappings WHERE proposal_id = ?`)
    .get(proposalId) as { id: string } | undefined
  return r?.id
}

/** Core approve logic — call inside an active transaction only. */
function approveProposalCore(
  proposalId: string,
  approvedBy: string,
  notes?: string | null
): string {
  const now = new Date().toISOString()
  const row = db
    .prepare(`SELECT cdm_path, transformation, status FROM proposals WHERE id = ?`)
    .get(proposalId) as
    | { cdm_path: string; transformation: string; status: string }
    | undefined
  if (!row) {
    throw new Error(`Proposal ${proposalId} not found`)
  }

  const existingAm = findApprovedMappingId(proposalId)
  if (existingAm) {
    if (row.status === 'auto_approved') {
      db.prepare(`UPDATE proposals SET status = 'approved' WHERE id = ?`).run(proposalId)
      db.prepare(
        `INSERT INTO audit_log (id, entity_type, entity_id, action, user, timestamp, metadata)
         VALUES (?, 'proposal', ?, 'confirmed', ?, ?, NULL)`
      ).run(crypto.randomUUID(), proposalId, approvedBy, now)
    }
    return existingAm
  }

  const id = crypto.randomUUID()
  db.prepare(`UPDATE proposals SET status = 'approved' WHERE id = ?`).run(proposalId)
  db.prepare(
    `INSERT INTO approved_mappings (id, proposal_id, cdm_path, transformation, approved_by, approved_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, proposalId, row.cdm_path, row.transformation, approvedBy, now, notes ?? null)
  db.prepare(
    `INSERT INTO audit_log (id, entity_type, entity_id, action, user, timestamp, metadata)
     VALUES (?, 'proposal', ?, 'approved', ?, ?, NULL)`
  ).run(crypto.randomUUID(), proposalId, approvedBy, now)
  return id
}

export function approveProposal(
  proposalId: string,
  approvedBy: string,
  notes?: string | null
): string {
  const run = db.transaction(() => approveProposalCore(proposalId, approvedBy, notes))
  return run()
}

/** Core reject — call inside an active transaction only. */
function rejectProposalCore(
  proposalId: string,
  rejectedBy: string,
  correction?: string | null,
  notes?: string | null
): void {
  const now = new Date().toISOString()
  const row = db.prepare(`SELECT field_id FROM proposals WHERE id = ?`).get(proposalId) as
    | { field_id: string }
    | undefined
  if (!row) {
    throw new Error(`Proposal ${proposalId} not found`)
  }

  db.prepare(`DELETE FROM approved_mappings WHERE proposal_id = ?`).run(proposalId)
  db.prepare(`UPDATE proposals SET status = 'rejected' WHERE id = ?`).run(proposalId)
  db.prepare(
    `INSERT INTO failed_mappings (id, field_id, proposal_id, analyst_correction, analyst_notes, failed_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(crypto.randomUUID(), row.field_id, proposalId, correction ?? '', notes ?? null, now)
  db.prepare(
    `INSERT INTO audit_log (id, entity_type, entity_id, action, user, timestamp, metadata)
     VALUES (?, 'proposal', ?, 'rejected', ?, ?, NULL)`
  ).run(crypto.randomUUID(), proposalId, rejectedBy, now)
}

export function rejectProposal(
  proposalId: string,
  rejectedBy: string,
  correction?: string | null,
  notes?: string | null
): void {
  const run = db.transaction(() =>
    rejectProposalCore(proposalId, rejectedBy, correction, notes)
  )
  run()
}

export function editProposal(
  proposalId: string,
  analyst: string,
  cdmPath: string,
  transformation: string,
  notes?: string | null
): string {
  const now = new Date().toISOString()
  const run = db.transaction(() => {
    const row = db
      .prepare(`SELECT payload_json, field_id FROM proposals WHERE id = ?`)
      .get(proposalId) as { payload_json: string; field_id: string } | undefined
    if (!row) {
      throw new Error(`Proposal ${proposalId} not found`)
    }
    const payload = JSON.parse(row.payload_json) as MappingProposal
    payload.cdmPath = cdmPath
    payload.transformation = transformation

    db.prepare(
      `UPDATE proposals SET cdm_path = ?, transformation = ?, status = 'edited', payload_json = ? WHERE id = ?`
    ).run(cdmPath, transformation, JSON.stringify(payload), proposalId)
    db.prepare(`DELETE FROM approved_mappings WHERE proposal_id = ?`).run(proposalId)
    const amId = crypto.randomUUID()
    db.prepare(
      `INSERT INTO approved_mappings (id, proposal_id, cdm_path, transformation, approved_by, approved_at, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(amId, proposalId, cdmPath, transformation, analyst, now, notes ?? null)
    db.prepare(
      `INSERT INTO audit_log (id, entity_type, entity_id, action, user, timestamp, metadata)
       VALUES (?, 'proposal', ?, 'edited', ?, ?, NULL)`
    ).run(crypto.randomUUID(), proposalId, analyst, now)
    return amId
  })
  return run()
}

export function assertProposalInUpload(proposalId: string, uploadId: string): void {
  const r = db
    .prepare(`SELECT upload_id FROM proposals WHERE id = ?`)
    .get(proposalId) as { upload_id: string } | undefined
  if (!r || r.upload_id !== uploadId) {
    throw new Error(`Proposal ${proposalId} is not part of upload ${uploadId}`)
  }
}

export function batchReviewActions(
  uploadId: string,
  action: 'approve' | 'reject',
  proposalIds: string[],
  analyst: string,
  opts?: { notes?: string; correction?: string }
): { approvedMappingIds: string[] } {
  const approvedMappingIds: string[] = []
  const run = db.transaction(() => {
    for (const proposalId of proposalIds) {
      assertProposalInUpload(proposalId, uploadId)
      if (action === 'approve') {
        approvedMappingIds.push(
          approveProposalCore(proposalId, analyst, opts?.notes ?? null)
        )
      } else {
        rejectProposalCore(proposalId, analyst, opts?.correction, opts?.notes)
      }
    }
  })
  run()
  return { approvedMappingIds }
}

// --- Week 4 export ---

export interface ApprovedMappingExportRow {
  proposalId: string
  fieldPath: string
  fieldName: string
  fieldValue: string | null
  cdmPath: string
  transformation: string
  skillInvoked: string
  confidence: number
  approvedBy: string
  approvedAt: string
}

export function listApprovedMappingsForExport(uploadId: string): ApprovedMappingExportRow[] {
  const rows = db
    .prepare(
      `SELECT p.id AS proposal_id, f.path AS field_path, f.name AS field_name, f.value AS field_value,
              am.cdm_path, am.transformation, p.skill_invoked, p.confidence, am.approved_by, am.approved_at
       FROM approved_mappings am
       JOIN proposals p ON p.id = am.proposal_id
       JOIN fields f ON f.id = p.field_id
       WHERE p.upload_id = ?
       ORDER BY am.approved_at`
    )
    .all(uploadId) as Array<Record<string, unknown>>

  return rows.map(r => ({
    proposalId: r.proposal_id as string,
    fieldPath: r.field_path as string,
    fieldName: r.field_name as string,
    fieldValue: (r.field_value as string | null) ?? null,
    cdmPath: r.cdm_path as string,
    transformation: r.transformation as string,
    skillInvoked: r.skill_invoked as string,
    confidence: Number(r.confidence),
    approvedBy: r.approved_by as string,
    approvedAt: r.approved_at as string,
  }))
}

export interface SkippedProposalRow {
  proposalId: string
  fieldPath: string
  fieldName: string
  status: string
}

export function listSkippedProposalsForExport(uploadId: string): SkippedProposalRow[] {
  const rows = db
    .prepare(
      `SELECT p.id AS proposal_id, f.path AS field_path, f.name AS field_name, p.status
       FROM proposals p
       JOIN fields f ON f.id = p.field_id
       LEFT JOIN approved_mappings am ON am.proposal_id = p.id
       WHERE p.upload_id = ? AND am.id IS NULL`
    )
    .all(uploadId) as Array<Record<string, unknown>>

  return rows.map(r => ({
    proposalId: r.proposal_id as string,
    fieldPath: r.field_path as string,
    fieldName: r.field_name as string,
    status: r.status as string,
  }))
}

function countScalar(sql: string, uploadId: string): number {
  const row = db.prepare(sql).get(uploadId) as { n: number | bigint } | undefined
  if (!row) return 0
  return Number(row.n)
}

export function countPendingProposals(uploadId: string): number {
  return countScalar(
    `SELECT COUNT(*) AS n FROM proposals WHERE upload_id = ? AND status = 'pending'`,
    uploadId
  )
}

export function listPendingProposalIds(uploadId: string): string[] {
  const rows = db
    .prepare(
      `SELECT id FROM proposals WHERE upload_id = ? AND status = 'pending' ORDER BY created_at`
    )
    .all(uploadId) as { id: string }[]
  return rows.map(r => r.id)
}

export function countProposalsForUpload(uploadId: string): number {
  return countScalar(`SELECT COUNT(*) AS n FROM proposals WHERE upload_id = ?`, uploadId)
}

export function getUploadMeta(
  uploadId: string
): { filename: string; formatType: 'xml' | 'json' } | undefined {
  const row = db
    .prepare(`SELECT filename, format_type FROM uploads WHERE id = ?`)
    .get(uploadId) as { filename: string; format_type: string } | undefined
  if (!row) return undefined
  const ft = row.format_type
  if (ft !== 'xml' && ft !== 'json') {
    return { filename: row.filename, formatType: 'xml' }
  }
  return { filename: row.filename, formatType: ft }
}

export function insertExportWithAudit(args: {
  exportId: string
  uploadId: string
  rosettaJson: string
  exportedBy: string
  auditMetadata: Record<string, unknown>
}): void {
  const now = new Date().toISOString()
  const run = db.transaction(() => {
    db.prepare(
      `INSERT INTO exports (id, upload_id, rosetta_json, exported_by, exported_at)
       VALUES (?, ?, ?, ?, ?)`
    ).run(args.exportId, args.uploadId, args.rosettaJson, args.exportedBy, now)
    db.prepare(
      `INSERT INTO audit_log (id, entity_type, entity_id, action, user, timestamp, metadata)
       VALUES (?, 'export', ?, 'exported', ?, ?, ?)`
    ).run(
      crypto.randomUUID(),
      args.exportId,
      args.exportedBy,
      now,
      JSON.stringify(args.auditMetadata)
    )
  })
  run()
}

export function getLatestExportForUpload(
  uploadId: string
): { exportId: string; exportedAt: string; rosettaJson: string } | undefined {
  const row = db
    .prepare(
      `SELECT id AS export_id, exported_at, rosetta_json FROM exports WHERE upload_id = ? ORDER BY exported_at DESC LIMIT 1`
    )
    .get(uploadId) as { export_id: string; exported_at: string; rosetta_json: string } | undefined
  if (!row) return undefined
  return { exportId: row.export_id, exportedAt: row.exported_at, rosettaJson: row.rosetta_json }
}
