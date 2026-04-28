import { describe, expect, it } from 'bun:test'
import {
  assessFpmlRelevance,
  buildFpmlIngestIndex,
  countConstructs,
  inferCategory,
  inferKind,
  inferProductFamily,
  sortFpmlRelevantFiles,
  type RosettaSourceFileIndexEntry,
} from '../../src/rosetta-source'

describe('rosetta source indexer helpers', () => {
  it('infers file categories from filenames', () => {
    expect(inferCategory('RosettaDictionary.txt')).toBe('dictionary')
    expect(inferCategory('ingest-fpml-confirmation-party-func.rosetta')).toBe('fpml-ingest')
    expect(inferCategory('mapping-fis-synonym.rosetta')).toBe('mapping-synonym')
    expect(inferCategory('base-datetime-type.rosetta')).toBe('base-model')
    expect(inferCategory('product-template-type.rosetta')).toBe('product-model')
    expect(inferCategory('event-common-func.rosetta')).toBe('event-model')
    expect(inferCategory('observable-asset-type.rosetta')).toBe('observable-model')
    expect(inferCategory('legaldocumentation-csa-type.rosetta')).toBe('legal-documentation')
    expect(inferCategory('margin-schedule-type.rosetta')).toBe('margin')
    expect(inferCategory('regulation-type.rosetta')).toBe('regulation')
  })

  it('infers broad file kinds from filenames', () => {
    expect(inferKind('RosettaDictionary.txt')).toBe('dictionary')
    expect(inferKind('mapping-fis-synonym.rosetta')).toBe('synonym')
    expect(inferKind('product-template-func.rosetta')).toBe('function')
    expect(inferKind('product-template-type.rosetta')).toBe('type')
    expect(inferKind('product-template-enum.rosetta')).toBe('enum')
    expect(inferKind('product-desc.rosetta')).toBe('description')
  })

  it('infers product families from filename substrings', () => {
    expect(inferProductFamily('ingest-fpml-confirmation-product-fxoption-func.rosetta')).toBe('fx')
    expect(inferProductFamily('ingest-fpml-confirmation-product-creditdefaultswap-func.rosetta')).toBe('credit')
    expect(inferProductFamily('ingest-fpml-confirmation-product-commodityswap-func.rosetta')).toBe('commodity')
    expect(inferProductFamily('ingest-fpml-confirmation-product-equityoption-func.rosetta')).toBe('equity')
    expect(inferProductFamily('ingest-fpml-confirmation-product-swaption-func.rosetta')).toBe('rates')
    expect(inferProductFamily('ingest-fpml-confirmation-party-func.rosetta')).toBe('common')
  })

  it('counts lightweight Rosetta constructs', () => {
    const counts = countConstructs(`
func Foo:
  inputs:
condition Foo:
type Bar:
enum Baz:
post-condition Result:
`)

    expect(counts.functionCount).toBe(1)
    expect(counts.typeCount).toBe(1)
    expect(counts.enumCount).toBe(1)
    expect(counts.conditionCount).toBe(2)
  })

  it('assesses FpML relevance with confidence and reasons', () => {
    const relevance = assessFpmlRelevance({
      fileName: 'ingest-fpml-confirmation-party-func.rosetta',
      category: 'fpml-ingest',
      inferredProductFamily: 'common',
      content: '[ingest XML]\nfunc MapFpmlParty:',
    })

    expect(relevance.likelyRelevantToFpmlMapping).toBe(true)
    expect(relevance.relevanceConfidence).toBe('high')
    expect(relevance.relevanceReasons).toContain('file category is fpml-ingest')
    expect(relevance.hasFpmlReference).toBe(true)
    expect(relevance.hasIngestReference).toBe(true)
  })

  it('sorts FpML shortlist with shared ingest files first', () => {
    const files = [
      entry('ingest-fpml-confirmation-product-fxoption-func.rosetta', 'fx'),
      entry('ingest-fpml-confirmation-party-func.rosetta', 'common'),
      entry('ingest-fpml-confirmation-tradestate-func.rosetta', 'common'),
    ]

    expect(sortFpmlRelevantFiles(files).map(file => file.fileName)).toEqual([
      'ingest-fpml-confirmation-tradestate-func.rosetta',
      'ingest-fpml-confirmation-party-func.rosetta',
      'ingest-fpml-confirmation-product-fxoption-func.rosetta',
    ])
  })

  it('builds grouped FpML ingest index without renaming the output concept', () => {
    const files = [
      entry('ingest-fpml-confirmation-party-func.rosetta', 'common'),
      { ...entry('base-datetime-type.rosetta', 'common'), category: 'base-model' as const },
      { ...entry('product-template-type.rosetta', 'rates'), category: 'product-model' as const },
    ]
    const index = buildFpmlIngestIndex({
      generatedAt: '2026-04-27T00:00:00.000Z',
      files,
    })

    expect(index.files).toHaveLength(3)
    expect(index.directIngestFiles).toHaveLength(1)
    expect(index.supportingSharedFiles).toHaveLength(1)
    expect(index.productSpecificFiles).toHaveLength(1)
  })
})

function entry(
  fileName: string,
  family: RosettaSourceFileIndexEntry['inferredProductFamily']
): RosettaSourceFileIndexEntry {
  return {
    sourcePath: `rosetta-source/src/main/rosetta/${fileName}`,
    localPath: `files/rosetta-source/src/main/rosetta/${fileName}`,
    fileName,
    extension: fileName.endsWith('.txt') ? '.txt' : '.rosetta',
    category: 'fpml-ingest',
    kind: 'function',
    inferredProductFamily: family,
    byteSize: 100,
    lineCount: 10,
    functionCount: 1,
    typeCount: 0,
    enumCount: 0,
    conditionCount: 0,
    hasFpmlReference: true,
    hasIngestReference: true,
    hasQualificationReference: false,
    likelyRelevantToFpmlMapping: true,
    relevanceConfidence: 'high',
    relevanceReasons: ['file category is fpml-ingest'],
  }
}
