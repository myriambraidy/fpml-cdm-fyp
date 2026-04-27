import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { runCookbookLlmPhase } from '../../src/cookbook-llm'
import {
  authoredPage,
  jsonResponse,
  makeConfig,
  passAudit,
  passCritic,
  passJudge,
  QueueLlmClient,
  writeDeterministicFixture,
} from './helpers'

describe('runCookbookLlmPhase', () => {
  it('writes authored latest output for one packet', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'cookbook-llm-run-'))
    const config = makeConfig(tempDir)
    await writeDeterministicFixture(config.deterministicRoot)
    const page = authoredPage()
    const llm = new QueueLlmClient([
      jsonResponse(page),
      jsonResponse(passCritic()),
      jsonResponse(passAudit(page.claims[0]!.claim)),
      jsonResponse(passJudge()),
    ])

    const result = await runCookbookLlmPhase({ config, llm })
    const index = await readFile(join(config.outputRoot, 'latest', 'index.md'), 'utf8')
    const debug = await readFile(join(config.outputRoot, 'latest', 'authoring-debug.json'), 'utf8')

    expect(result.pageCount).toBe(1)
    expect(index).toContain('FPML -> CDM Agent Cookbook')
    expect(debug).toContain('author-model')
  })
})
