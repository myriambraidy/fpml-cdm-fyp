import { describe, expect, it } from 'bun:test'
import {
  renderPackMarkdown,
  selectBlocksForFamily,
  selectSharedIngestBlocks,
  type RosettaSourceBlock,
} from '../../src/rosetta-source'

describe('rosetta documentation pack helpers', () => {
  it('selects shared ingest blocks', () => {
    const blocks = [
      block('ingest-fpml-confirmation-party-func.rosetta', 'common'),
      block('ingest-fpml-confirmation-product-fxoption-func.rosetta', 'fx'),
      { ...block('product-template-type.rosetta', 'rates'), category: 'product-model' as const },
    ]

    expect(selectSharedIngestBlocks(blocks).map(item => item.fileName)).toEqual([
      'ingest-fpml-confirmation-party-func.rosetta',
    ])
  })

  it('selects product family blocks', () => {
    const blocks = [
      block('ingest-fpml-confirmation-product-fxoption-func.rosetta', 'fx'),
      block('ingest-fpml-confirmation-product-creditdefaultswap-func.rosetta', 'credit'),
    ]

    expect(selectBlocksForFamily({ family: 'fx', blocks }).map(item => item.fileName)).toEqual([
      'ingest-fpml-confirmation-product-fxoption-func.rosetta',
    ])
  })

  it('renders source path and line references without dumping raw block text', () => {
    const content = renderPackMarkdown({
      title: 'Rosetta Pack: FX',
      purpose: 'Test pack.',
      blocks: [block('ingest-fpml-confirmation-product-fxoption-func.rosetta', 'fx')],
      sharedDependencyNote: 'Also read shared.',
      blocksJsonReference: '../../extracted/blocks.json',
    })

    expect(content).toContain('Rosetta Pack: FX')
    expect(content).toContain('ingest-fpml-confirmation-product-fxoption-func.rosetta')
    expect(content).toContain('10-20')
    expect(content).toContain('Also read shared.')
    expect(content).toContain('../../extracted/blocks.json')
    expect(content).not.toContain('raw body line')
  })
})

function block(
  fileName: string,
  family: RosettaSourceBlock['inferredProductFamily']
): RosettaSourceBlock {
  return {
    id: `func:${fileName}:Example`,
    kind: 'func',
    name: 'Example',
    sourcePath: `rosetta-source/src/main/rosetta/${fileName}`,
    localPath: `files/rosetta-source/src/main/rosetta/${fileName}`,
    fileName,
    startLine: 10,
    endLine: 20,
    lineCount: 11,
    category: 'fpml-ingest',
    inferredProductFamily: family,
    rawText: 'func Example:\n  raw body line',
    headerLine: 'func Example:',
  }
}
