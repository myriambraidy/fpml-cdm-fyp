import { describe, expect, it } from 'bun:test'
import type { DraftManifest } from '../../src/draft/types'
import { selectDraftPairsForFolder } from '../../src/draft/pair-selection'

const manifest: DraftManifest = {
  generatedAt: '2026-04-22T00:00:00.000Z',
  sourceRoots: {
    fpml: 'C:/repo/data_to_learn_from/fpml',
    cdmIngestOutput: 'C:/repo/data_to_learn_from/cdm',
    curatedOutput: 'C:/repo/data_to_learn_from/cdm_parallel',
  },
  notes: [],
  summary: {
    totalFpmlFiles: 4,
    totalCdmCandidates: 3,
    matchedFiles: 3,
    missingFiles: 1,
    byStrategy: {
      exact: 2,
      normalized: 1,
      missing: 1,
    },
    byCategory: {
      'fx-derivatives': {
        total: 4,
        matched: 3,
        missing: 1,
      },
    },
  },
  entries: [
    {
      fpmlRelativePath: 'fx-derivatives/fx-ex01.xml',
      cdmRelativePath: 'fx-derivatives/fx-ex01.json',
      sourceBaseName: 'fx-ex01',
      strategy: 'exact',
      status: 'matched',
    },
    {
      fpmlRelativePath: 'fx-derivatives/fx-ex02.xml',
      cdmRelativePath: 'fx-derivatives/fx-ex02.json',
      sourceBaseName: 'fx-ex02',
      strategy: 'normalized',
      status: 'matched',
    },
    {
      fpmlRelativePath: 'fx-derivatives/fx-ex03.xml',
      cdmRelativePath: 'fx-derivatives/fx-ex03.json',
      sourceBaseName: 'fx-ex03',
      strategy: 'alias',
      status: 'matched',
    },
    {
      fpmlRelativePath: 'fx-derivatives/fx-ex04.xml',
      cdmRelativePath: null,
      sourceBaseName: null,
      strategy: 'missing',
      status: 'missing',
    },
  ],
}

describe('selectDraftPairsForFolder', () => {
  it('filters one folder and returns coverage from the manifest', () => {
    const result = selectDraftPairsForFolder({
      manifest,
      manifestPath: 'C:/repo/data_to_learn_from/cdm_parallel/manifest.json',
      config: {
        workspaceRoot: 'C:/repo',
        fpmlRoot: 'C:/repo/data_to_learn_from/fpml',
        cdmRoot: 'C:/repo/data_to_learn_from/cdm_parallel',
        outputRoot: 'C:/repo/data/drafts',
        folder: 'fx-derivatives',
      },
    })

    expect(result.coverage.totalFpmlFilesInFolder).toBe(4)
    expect(result.coverage.matchedPairsUsed).toBe(3)
    expect(result.coverage.missingCounterparts).toBe(1)
    expect(result.coverage.aliasMatches).toBe(1)
    expect(result.includedPairs[0]?.fpmlAbsolutePath).toContain('data_to_learn_from')
  })

  it('records skipped pairs when maxPairs is set', () => {
    const result = selectDraftPairsForFolder({
      manifest,
      manifestPath: 'C:/repo/data_to_learn_from/cdm_parallel/manifest.json',
      config: {
        workspaceRoot: 'C:/repo',
        fpmlRoot: 'C:/repo/data_to_learn_from/fpml',
        cdmRoot: 'C:/repo/data_to_learn_from/cdm_parallel',
        outputRoot: 'C:/repo/data/drafts',
        folder: 'fx-derivatives',
        maxPairs: 1,
      },
    })

    expect(result.includedPairs).toHaveLength(1)
    expect(result.ignoredExamples).toHaveLength(2)
    expect(result.ignoredExamples[0]?.reason).toContain('maxPairs=1')
  })

  it('allows maxPairs=0 to select zero pairs explicitly', () => {
    const result = selectDraftPairsForFolder({
      manifest,
      manifestPath: 'C:/repo/data_to_learn_from/cdm_parallel/manifest.json',
      config: {
        workspaceRoot: 'C:/repo',
        fpmlRoot: 'C:/repo/data_to_learn_from/fpml',
        cdmRoot: 'C:/repo/data_to_learn_from/cdm_parallel',
        outputRoot: 'C:/repo/data/drafts',
        folder: 'fx-derivatives',
        maxPairs: 0,
      },
    })

    expect(result.includedPairs).toHaveLength(0)
    expect(result.ignoredExamples).toHaveLength(3)
  })
})
