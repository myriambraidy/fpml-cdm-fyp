import { describe, expect, it } from 'bun:test'
import { join } from 'node:path'
import { loadCookbookRuntimeBundle } from '../../src/cookbook-runtime/loader'

describe('cookbook runtime loader', () => {
  it('loads latest cookbook bundle', async () => {
    const root = join(process.cwd(), 'data/agent-cookbook-llm/latest')
    const bundle = await loadCookbookRuntimeBundle(root)
    expect(bundle.global.length).toBeGreaterThan(0)
    expect(bundle.families.length).toBeGreaterThan(0)
  })
})

