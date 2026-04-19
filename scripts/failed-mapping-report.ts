/**
 * Dump `failed_mappings` joined to `proposals` for one upload (Week 4 / W4-D09).
 * Run **before** `POST /api/mapping` if you need rejection evidence after re-map.
 *
 * Usage: `bun scripts/failed-mapping-report.ts <uploadId>`
 */
import '../src/storage/db'
import { db } from '../src/storage/db'

const uploadId = process.argv[2]
if (!uploadId) {
  console.error('Usage: bun scripts/failed-mapping-report.ts <uploadId>')
  process.exit(1)
}

const rows = db
  .prepare(
    `SELECT fm.id AS failed_id, fm.analyst_correction, fm.analyst_notes, fm.failed_at,
            p.id AS proposal_id, p.skill_invoked, p.payload_json, p.status AS proposal_status
     FROM failed_mappings fm
     JOIN proposals p ON p.id = fm.proposal_id
     WHERE p.upload_id = ?
     ORDER BY fm.failed_at DESC`
  )
  .all(uploadId)

console.log(JSON.stringify(rows, null, 2))
