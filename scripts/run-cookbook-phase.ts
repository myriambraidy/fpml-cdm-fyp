import { readCookbookConfigFromEnv } from '../src/cookbook/config'
import { runCookbookPhase } from '../src/cookbook'

const workspaceRoot = process.cwd()
const result = await runCookbookPhase({
  config: readCookbookConfigFromEnv(workspaceRoot),
})

console.log(JSON.stringify(result, null, 2))
