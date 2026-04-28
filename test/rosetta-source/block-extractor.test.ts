import { describe, expect, it } from 'bun:test'
import {
  extractRosettaBlocks,
  splitBlocksByKind,
  type RosettaSourceFileIndexEntry,
} from '../../src/rosetta-source'

describe('rosetta block extraction', () => {
  it('extracts multiple top-level blocks with line numbers', () => {
    const blocks = extractRosettaBlocks({
      file: fakeFile('sample-func.rosetta'),
      content: [
        'func First:',
        '  output:',
        '    result string (1..1)',
        '',
        'func Second:',
        '  output:',
        '    result string (1..1)',
      ].join('\n'),
    })

    expect(blocks).toHaveLength(2)
    expect(blocks[0].name).toBe('First')
    expect(blocks[0].startLine).toBe(1)
    expect(blocks[0].endLine).toBe(4)
    expect(blocks[0].lineCount).toBe(4)
    expect(blocks[1].name).toBe('Second')
    expect(blocks[1].startLine).toBe(5)
    expect(blocks[1].endLine).toBe(7)
  })

  it('extracts function, type, and enum blocks', () => {
    const blocks = extractRosettaBlocks({
      file: fakeFile('mixed.rosetta'),
      content: ['type Trade:', '  value string (1..1)', 'enum Side:', '  Buy', 'func Build:'].join('\n'),
    })
    const split = splitBlocksByKind(blocks)

    expect(split.types.map(block => block.name)).toEqual(['Trade'])
    expect(split.enums.map(block => block.name)).toEqual(['Side'])
    expect(split.functions.map(block => block.name)).toEqual(['Build'])
  })

  it('returns no blocks for files without declarations', () => {
    const blocks = extractRosettaBlocks({
      file: fakeFile('desc.rosetta'),
      content: 'namespace cdm\n// description only',
    })

    expect(blocks).toEqual([])
  })
})

function fakeFile(fileName: string): RosettaSourceFileIndexEntry {
  return {
    sourcePath: `rosetta-source/src/main/rosetta/${fileName}`,
    localPath: `files/rosetta-source/src/main/rosetta/${fileName}`,
    fileName,
    extension: '.rosetta',
    category: 'fpml-ingest',
    kind: 'function',
    inferredProductFamily: 'fx',
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
    relevanceReasons: ['test fixture'],
  }
}
