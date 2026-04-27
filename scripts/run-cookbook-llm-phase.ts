import { createOpenRouterClientFromEnv } from '../src/agent/client'
import { readCookbookLlmConfigFromEnv } from '../src/cookbook-llm/config'
import { runCookbookLlmPhase } from '../src/cookbook-llm'

const workspaceRoot = process.cwd()
const result = await runCookbookLlmPhase({
  config: readCookbookLlmConfigFromEnv(workspaceRoot),
  llm: createOpenRouterClientFromEnv(),
})

console.log(JSON.stringify(result, null, 2))
