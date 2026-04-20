import { describe, expect, it } from 'bun:test'
import { fpmlHeaderMetadataLogic } from '../../src/skills/fpml-header-metadata/logic'

describe('fpml_header_metadata', () => {
  it('maps conversationId to packageMeta.fpmlHeader', () => {
    const r = fpmlHeaderMetadataLogic({
      fieldName: 'conversationId',
      fieldPath: '/FpML/header/conversationId',
      fieldValue: 'th-1',
    })
    expect(r.cdmPath).toBe('packageMeta.fpmlHeader.conversationId')
    expect(r.confidence).toBeGreaterThan(80)
  })
})
