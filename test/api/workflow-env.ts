import { join } from 'node:path'
import { unlinkSync } from 'node:fs'

/** Isolate API tests from dev ./data/app.db — set before any module loads config/db. */
const dbPath = join(import.meta.dir, 'workflow-isolated.db')
try {
  unlinkSync(dbPath)
} catch {
  // ok
}
process.env.DB_PATH = dbPath
