import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createOpenRouterClientFromEnv } from '../src/agent/client'
import { createRunConfig, runJavaGeneratorAgent } from '../src/java-generator-agent'

type CliArgs = {
  productFamily?: string
  out?: string
  resume?: string
  requireApproval: boolean
}

function parseArgs(argv: string[]): CliArgs {
  const parsed: CliArgs = { requireApproval: false }
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--require-approval') {
      parsed.requireApproval = true
      continue
    }
    if (arg === '--product-family') {
      parsed.productFamily = argv[index + 1]
      index += 1
      continue
    }
    if (arg === '--out') {
      parsed.out = argv[index + 1]
      index += 1
      continue
    }
    if (arg === '--resume') {
      parsed.resume = argv[index + 1]
      index += 1
    }
  }
  return parsed
}

const args = parseArgs(process.argv.slice(2))
const config = createRunConfig({
  productFamily: args.productFamily,
  baseOutputDir: args.out,
  requireApproval: args.requireApproval,
  resumeRunOutputDir: args.resume,
})

const llm = createOpenRouterClientFromEnv()

await mkdir(config.runOutputDir, { recursive: true })
await mkdir(join(config.baseOutputDir, 'latest'), { recursive: true })
await writeFile(
  join(config.baseOutputDir, 'latest', 'latest-run.md'),
  `# Latest Java Generator Run

Run id: ${config.runId}
Run output dir: ${config.runOutputDir}
`,
  'utf8'
)

await runJavaGeneratorAgent({ llm, config })

console.log(
  JSON.stringify(
    {
      runId: config.runId,
      runOutputDir: config.runOutputDir,
      approvalRequired: config.requireApproval,
    },
    null,
    2
  )
)
