import { describe, expect, it } from 'bun:test'
import { parseXML } from '../../src/parser/xml-parser'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('xml-parser', () => {
  it('parses namespaced FPML with unprefixed field names', () => {
    const xml = readFileSync(
      resolve(process.cwd(), 'test/fixtures/sample-fpml.xml'),
      'utf8'
    )
    const fields = parseXML(xml)

    expect(fields.length).toBeGreaterThan(0)
    expect(fields.some(field => field.name === 'buyerPartyReference')).toBeTrue()
    expect(fields.some(field => field.path.includes('/trade/tradeHeader/tradeDate'))).toBeTrue()
  })

  it('extracts href on attribute-only nodes with parent context', () => {
    const xml = `
      <trade xmlns="urn:test">
        <premium>
          <payerPartyReference href="party1" />
        </premium>
      </trade>
    `
    const fields = parseXML(xml)
    const payerRef = fields.find(field => field.name === 'payerPartyReference')
    expect(payerRef).toBeDefined()
    expect(payerRef?.value).toBe('party1')
    expect(payerRef?.context?.parentName).toBe('premium')
  })

  it('throws for invalid xml', () => {
    expect(() => parseXML('<trade><oops></trade>')).toThrow()
  })
})
