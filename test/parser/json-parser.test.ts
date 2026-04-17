import { describe, expect, it } from 'bun:test'
import { parseJSON } from '../../src/parser/json-parser'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('json-parser', () => {
  it('parses nested json into field entries', () => {
    const raw = readFileSync(
      resolve(process.cwd(), 'test/fixtures/sample-format.json'),
      'utf8'
    )
    const fields = parseJSON(raw)
    expect(fields.length).toBeGreaterThan(0)
    expect(fields.some(field => field.path === '$.trade.tradeDate')).toBeTrue()
    expect(fields.some(field => field.path === '$.trade.economics.currency')).toBeTrue()
  })

  it('marks arrays and preserves indexed paths', () => {
    const fields = parseJSON(`{"x":{"items":[{"id":"1"},{"id":"2"}]}}`)
    const marker = fields.find(field => field.path === '$.x.items' && field.isArray)
    expect(marker).toBeDefined()
    expect(fields.some(field => field.path === '$.x.items[0].id')).toBeTrue()
    expect(fields.some(field => field.path === '$.x.items[1].id')).toBeTrue()
  })
})
