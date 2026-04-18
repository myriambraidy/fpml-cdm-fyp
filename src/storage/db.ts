import { Database } from 'bun:sqlite'
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { env } from '../config'

const dbFile = resolve(process.cwd(), env.DB_PATH)
mkdirSync(dirname(dbFile), { recursive: true })

export const db = new Database(dbFile)

db.exec('PRAGMA foreign_keys = ON')
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA busy_timeout = 5000')

const schemaSql = readFileSync(resolve(process.cwd(), 'src/storage/schema.sql'), 'utf8')
db.exec(schemaSql)
