import { join } from 'node:path'
import { unlinkSync } from 'node:fs'

const dbPath = join(import.meta.dir, 'manual-work-isolated.db')
try {
  unlinkSync(dbPath)
} catch {
  // ok
}
process.env.DB_PATH = dbPath
