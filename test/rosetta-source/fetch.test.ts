import { describe, expect, it } from 'bun:test'
import * as path from 'node:path'
import {
  buildTimestamp,
  localSourcePath,
  manifestFileForEntry,
  outputDirectories,
  parseArgs,
  shouldKeepRosettaSourceFile,
  toRawUrl,
  treeApiUrl,
  type GitTreeEntry,
} from '../../src/rosetta-source'

describe('rosetta source fetch helpers', () => {
  it('parses defaults and common CLI options', () => {
    const options = parseArgs([
      '--dry-run',
      '--limit',
      '10',
      '--mode',
      'append',
      '--include',
      'ingest-fpml-confirmation,mapping-',
    ])

    expect(options.repo).toBe('finos/common-domain-model')
    expect(options.branch).toBe('master')
    expect(options.prefix).toBe('rosetta-source/src/main/rosetta/')
    expect(options.dryRun).toBe(true)
    expect(options.limit).toBe(10)
    expect(options.mode).toBe('append')
    expect(options.include).toEqual(['ingest-fpml-confirmation', 'mapping-'])
  })

  it('keeps rosetta files and the dictionary under the configured prefix', () => {
    const prefix = 'rosetta-source/src/main/rosetta/'

    expect(
      shouldKeepRosettaSourceFile(
        'rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta',
        prefix
      )
    ).toBe(true)
    expect(
      shouldKeepRosettaSourceFile(
        'rosetta-source/src/main/rosetta/RosettaDictionary.txt',
        prefix
      )
    ).toBe(true)
    expect(
      shouldKeepRosettaSourceFile('rosetta-source/src/main/rosetta/README.md', prefix)
    ).toBe(false)
    expect(
      shouldKeepRosettaSourceFile('examples/sample.rosetta', prefix)
    ).toBe(false)
  })

  it('applies optional include filters after source file filtering', () => {
    const prefix = 'rosetta-source/src/main/rosetta/'

    expect(
      shouldKeepRosettaSourceFile(
        'rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta',
        prefix,
        ['ingest-fpml-confirmation']
      )
    ).toBe(true)
    expect(
      shouldKeepRosettaSourceFile(
        'rosetta-source/src/main/rosetta/product-template-type.rosetta',
        prefix,
        ['ingest-fpml-confirmation']
      )
    ).toBe(false)
  })

  it('builds GitHub API and raw URLs', () => {
    expect(treeApiUrl('finos/common-domain-model', 'master')).toBe(
      'https://api.github.com/repos/finos/common-domain-model/git/trees/master?recursive=1'
    )
    expect(
      toRawUrl(
        'finos/common-domain-model',
        'master',
        'rosetta-source/src/main/rosetta/sample.rosetta'
      )
    ).toBe(
      'https://raw.githubusercontent.com/finos/common-domain-model/master/rosetta-source/src/main/rosetta/sample.rosetta'
    )
  })

  it('preserves source path under the files directory', () => {
    const output = path.resolve('data/rosetta-source/latest')
    const local = localSourcePath(
      output,
      'rosetta-source/src/main/rosetta/sample.rosetta'
    )

    expect(local).toBe(
      path.resolve(
        'data/rosetta-source/latest/files/rosetta-source/src/main/rosetta/sample.rosetta'
      )
    )
  })

  it('creates manifest file entries relative to the snapshot root', () => {
    const entry: GitTreeEntry = {
      path: 'rosetta-source/src/main/rosetta/sample.rosetta',
      mode: '100644',
      type: 'blob',
      sha: 'abc123',
      size: 42,
      url: 'https://api.github.com/blob/abc123',
    }

    const file = manifestFileForEntry({
      entry,
      repo: 'finos/common-domain-model',
      branch: 'master',
      outputDirectory: path.resolve('data/rosetta-source/latest'),
    })

    expect(file.sourcePath).toBe(entry.path)
    expect(file.extension).toBe('.rosetta')
    expect(file.sha).toBe('abc123')
    expect(file.size).toBe(42)
    expect(file.localPath.replaceAll('\\', '/')).toBe(
      'files/rosetta-source/src/main/rosetta/sample.rosetta'
    )
  })

  it('selects latest or timestamped output directories', () => {
    expect(
      outputDirectories({
        outDir: 'data/rosetta-source',
        mode: 'overwrite',
        updateLatest: true,
        generatedAt: '2026-04-27T10-00-00-000Z',
      }).outputDirectory
    ).toBe(path.resolve('data/rosetta-source/latest'))

    const append = outputDirectories({
      outDir: 'data/rosetta-source',
      mode: 'append',
      updateLatest: true,
      generatedAt: '2026-04-27T10-00-00-000Z',
    })
    expect(append.outputDirectory).toBe(
      path.resolve('data/rosetta-source/runs/2026-04-27T10-00-00-000Z')
    )
    expect(append.latestDirectory).toBe(path.resolve('data/rosetta-source/latest'))
  })

  it('creates filesystem-safe timestamps', () => {
    expect(buildTimestamp(new Date('2026-04-27T10:11:12.345Z'))).toBe(
      '2026-04-27T10-11-12-345Z'
    )
  })
})
