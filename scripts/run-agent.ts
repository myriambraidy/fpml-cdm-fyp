/**
 * Run MappingAgent on parsed XML/JSON (first N fields).
 * Usage: bun scripts/run-agent.ts [fixture] [limit] [--live]
 *
 * Default: **no LLM** (deterministic; multi-match uses priority + needsReview).
 * Pass `--live` with OPENROUTER_API_KEY in .env to call OpenRouter on multi-match fields.
 */
import '../src/skills'
import { readFileSync } from 'node:fs'
import { parseXML } from '../src/parser/xml-parser'
import { parseJSON } from '../src/parser/json-parser'
import { MappingAgent } from '../src/agent/orchestrator'
import { createOpenRouterClientFromEnv } from '../src/agent/client'
import type { LLMClient } from '../src/agent/types'

const argv = process.argv.slice(2).filter(a => a !== '--live')
const useLive = process.argv.includes('--live')

const file = argv[0] ?? 'test/fixtures/sample-fpml.xml'
const limit = Math.max(1, Number(argv[1] ?? '50'))

const raw = readFileSync(file, 'utf8')
const fields =
  file.endsWith('.json') || file.endsWith('.JSON')
    ? parseJSON(raw)
    : parseXML(raw)

const slice = fields.slice(0, limit)

let llm: LLMClient | undefined
if (useLive) {
  llm = createOpenRouterClientFromEnv()
}

const agent = new MappingAgent(llm)
const proposals = await agent.generateMappings(slice)

console.log(
  JSON.stringify(
    {
      file,
      fieldSlice: slice.length,
      llmMode: useLive ? 'openrouter' : 'off',
      needsReviewCount: proposals.filter(p => p.needsReview).length,
    },
    null,
    2
  )
)

for (const p of proposals) {
  const tag = p.needsReview ? 'REVIEW' : 'ok   '
  console.log(
    `${tag}\t${p.sourceField.path}\t${p.skillInvoked}\t${p.confidence}\t${p.cdmPath}`
  )
}
