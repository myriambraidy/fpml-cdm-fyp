import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'bun:test'
import { runDraftPhase } from '../../src/draft'
import type { DraftDebugArtifacts, DraftLogEntry } from '../../src/draft/types'

describe('runDraftPhase', () => {
  it('writes partial artifacts and persists the final completion log entry', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'draft-phase-run-'))

    try {
      const fpmlRoot = join(tempDir, 'fpml')
      const cdmRoot = join(tempDir, 'cdm_parallel')
      const outputRoot = join(tempDir, 'drafts')
      const folder = 'fx-derivatives'
      const fpmlDir = join(fpmlRoot, folder)
      const cdmDir = join(cdmRoot, folder)

      await mkdir(fpmlDir, { recursive: true })
      await mkdir(cdmDir, { recursive: true })

      await writeFile(
        join(fpmlDir, 'fx-ex01.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>
<FpML>
  <header>
    <conversationId>conv-1</conversationId>
  </header>
  <trade>
    <tradeHeader>
      <tradeDate>2001-11-19</tradeDate>
    </tradeHeader>
  </trade>
</FpML>`,
        'utf8'
      )
      await writeFile(
        join(cdmDir, 'fx-ex01.json'),
        JSON.stringify(
          {
            trade: {
              tradeDate: { value: '2001-11-19' },
            },
            meta: {
              globalKey: 'meta-1',
            },
          },
          null,
          2
        ),
        'utf8'
      )
      await writeFile(
        join(cdmRoot, 'manifest.json'),
        JSON.stringify(
          {
            generatedAt: '2026-04-23T00:00:00.000Z',
            sourceRoots: {
              fpml: fpmlRoot,
              cdmIngestOutput: cdmRoot,
              curatedOutput: cdmRoot,
            },
            notes: [],
            summary: {
              totalFpmlFiles: 1,
              totalCdmCandidates: 1,
              matchedFiles: 1,
              missingFiles: 0,
              byStrategy: {
                exact: 1,
                normalized: 0,
                alias: 0,
                missing: 0,
              },
              byCategory: {
                [folder]: {
                  total: 1,
                  matched: 1,
                  missing: 0,
                },
              },
            },
            entries: [
              {
                fpmlRelativePath: `${folder}/fx-ex01.xml`,
                cdmRelativePath: `${folder}/fx-ex01.json`,
                sourceBaseName: 'fx-ex01',
                strategy: 'exact',
                status: 'matched',
              },
            ],
          },
          null,
          2
        ),
        'utf8'
      )

      const result = await runDraftPhase({
        config: {
          workspaceRoot: tempDir,
          fpmlRoot,
          cdmRoot,
          outputRoot,
          folder,
          pairConcurrency: 2,
        },
      })

      expect(result.status).toBe('deterministic_only')

      const runLog = JSON.parse(await readFile(result.logPath, 'utf8')) as DraftLogEntry[]
      const debug = JSON.parse(await readFile(result.debugPath, 'utf8')) as DraftDebugArtifacts
      const markdown = await readFile(result.markdownPath, 'utf8')

      expect(runLog.some(entry => entry.message === 'Draft phase run completed.')).toBe(true)
      expect(debug.runLog.some(entry => entry.message === 'Draft phase run completed.')).toBe(true)
      expect(debug.qualityAssessment.rating).toBe('poor')
      expect(debug.rolloutReadiness.readyForBroadRollout).toBe(false)
      expect(markdown).toContain('# Agent Mapping Playbook: fx-derivatives')
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })
})
