import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { runCookbookPhase } from '../../src/cookbook'
import type { CookbookManifest, CookbookRunComparison } from '../../src/cookbook/types'
import { makeLoadedFamily } from './helpers'

describe('runCookbookPhase', () => {
  it('writes latest cookbook artifacts in overwrite mode', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'cookbook-phase-'))
    const draftsRoot = join(tempDir, 'drafts')
    const outputRoot = join(tempDir, 'agent-cookbook')
    const family = makeLoadedFamily()
    const familyDir = join(draftsRoot, family.folder)
    await mkdir(familyDir, { recursive: true })
    await writeFile(join(familyDir, 'draft.json'), JSON.stringify(family.artifact, null, 2), 'utf8')
    await writeFile(join(familyDir, 'debug.json'), JSON.stringify(family.debug, null, 2), 'utf8')

    const result = await runCookbookPhase({
      config: {
        workspaceRoot: tempDir,
        draftsRoot,
        outputRoot,
        mode: 'overwrite',
        updateLatest: true,
        includeReviewOnly: true,
        enablePolish: false,
      },
    })

    const index = await readFile(join(outputRoot, 'latest', 'index.md'), 'utf8')
    const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8')) as CookbookManifest

    expect(result.familyDocumentCount).toBe(1)
    expect(index).toContain('FPML -> CDM Agent Cookbook')
    expect(manifest.families[0]?.folder).toBe(family.folder)
  })

  it('writes append runs with comparison and honors folder overrides', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'cookbook-phase-append-'))
    const draftsRoot = join(tempDir, 'drafts')
    const outputRoot = join(tempDir, 'agent-cookbook')
    const overridesPath = join(tempDir, 'overrides.json')
    const family = makeLoadedFamily({ qualityRating: 'good' })
    const familyDir = join(draftsRoot, family.folder)
    await mkdir(familyDir, { recursive: true })
    await writeFile(join(familyDir, 'draft.json'), JSON.stringify(family.artifact, null, 2), 'utf8')
    await writeFile(join(familyDir, 'debug.json'), JSON.stringify(family.debug, null, 2), 'utf8')

    await runCookbookPhase({
      config: {
        workspaceRoot: tempDir,
        draftsRoot,
        outputRoot,
        mode: 'overwrite',
        updateLatest: true,
        includeReviewOnly: true,
        enablePolish: false,
      },
    })

    await writeFile(
      overridesPath,
      JSON.stringify(
        [
          {
            folder: family.folder,
            operationalStatus: 'ready',
            reasonCode: 'test_override',
          },
        ],
        null,
        2
      ),
      'utf8'
    )

    const result = await runCookbookPhase({
      config: {
        workspaceRoot: tempDir,
        draftsRoot,
        outputRoot,
        mode: 'append',
        updateLatest: true,
        includeReviewOnly: true,
        enablePolish: false,
        folderOverridesPath: overridesPath,
      },
    })

    const manifest = JSON.parse(await readFile(result.manifestPath, 'utf8')) as CookbookManifest
    const comparison = JSON.parse(
      await readFile(join(result.outputDirectory, 'comparison.json'), 'utf8')
    ) as CookbookRunComparison

    expect(result.latestDirectory).toBe(join(outputRoot, 'latest'))
    expect(manifest.families[0]?.operationalStatus).toBe('ready')
    expect(comparison.comparedToLatest).toBe(true)
    expect(comparison.statusChanges[0]?.folder).toBe(family.folder)
  })
})
