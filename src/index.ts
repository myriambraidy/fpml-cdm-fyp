import { createApp } from './app'
import { env } from './config'
import { createOpenRouterClientFromEnv } from './agent/client'
import { getAllSkills } from './skills/registry'

let llmClient: import('./agent/types').LLMClient | undefined
try {
  llmClient = createOpenRouterClientFromEnv()
} catch {
  console.warn('[App] No OPENROUTER_API_KEY — mapping runs deterministic-only')
}

console.log(`[App] ${getAllSkills().length} skills registered`)

export default {
  port: env.PORT,
  fetch: createApp({ llmClient }).fetch,
}
