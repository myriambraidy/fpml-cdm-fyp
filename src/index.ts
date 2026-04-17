import { Hono } from 'hono'
import { env } from './config'
import './skills'
import { getAllSkills } from './skills/registry'
import './storage/db'

const app = new Hono()

app.get('/health', c => c.json({ ok: true }))

console.log(`[App] ${getAllSkills().length} skills registered`)

export default {
  port: env.PORT,
  fetch: app.fetch,
}
