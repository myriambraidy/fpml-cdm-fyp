import { mkdir, rm, writeFile } from 'node:fs/promises'
import * as path from 'node:path'

export type GitTreeEntry = {
  path: string
  mode: string
  type: string
  sha: string
  size?: number
  url: string
}

export type GitTreeResponse = {
  sha: string
  truncated: boolean
  tree: GitTreeEntry[]
}

export type FetchRosettaSourceOptions = {
  repo: string
  branch: string
  prefix: string
  outDir: string
  mode: 'overwrite' | 'append'
  updateLatest: boolean
  dryRun: boolean
  limit?: number
  include: string[]
}

export type RosettaSourceManifestFile = {
  sourcePath: string
  localPath: string
  rawUrl: string
  sha: string
  size?: number
  extension: '.rosetta' | '.txt'
}

export type RosettaSourceManifest = {
  generatedAt: string
  repo: string
  branch: string
  sourcePrefix: string
  apiTreeUrl: string
  treeSha: string
  treeTruncated: boolean
  fileCount: number
  totalBytes?: number
  files: RosettaSourceManifestFile[]
}

export type RosettaFetchDiagnostics = {
  generatedAt: string
  dryRun: boolean
  requestedFileCount: number
  downloadedFileCount: number
  skippedFileCount: number
  failedDownloads: Array<{
    sourcePath: string
    rawUrl: string
    status?: number
    message: string
  }>
  warnings: string[]
}

export type FetchJson = <T>(url: string) => Promise<T>
export type FetchText = (url: string) => Promise<string>

export type FetchRosettaSourceResult = {
  outputDirectory: string
  latestDirectory?: string
  manifest: RosettaSourceManifest
  diagnostics: RosettaFetchDiagnostics
}

export function parseArgs(argv: string[]): FetchRosettaSourceOptions {
  const options: FetchRosettaSourceOptions = {
    repo: 'finos/common-domain-model',
    branch: 'master',
    prefix: 'rosetta-source/src/main/rosetta/',
    outDir: 'data/rosetta-source',
    mode: 'overwrite',
    updateLatest: true,
    dryRun: false,
    include: [],
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]

    if (arg === '--repo' && next) {
      options.repo = next
      i += 1
      continue
    }
    if (arg === '--branch' && next) {
      options.branch = next
      i += 1
      continue
    }
    if (arg === '--prefix' && next) {
      options.prefix = ensureTrailingSlash(next.trim())
      i += 1
      continue
    }
    if (arg === '--out' && next) {
      options.outDir = next
      i += 1
      continue
    }
    if (arg === '--mode' && next) {
      if (next !== 'overwrite' && next !== 'append') {
        throw new Error(`Unsupported --mode "${next}". Use overwrite or append.`)
      }
      options.mode = next
      i += 1
      continue
    }
    if (arg === '--limit' && next) {
      const value = Number.parseInt(next, 10)
      if (!Number.isNaN(value) && value > 0) {
        options.limit = value
      }
      i += 1
      continue
    }
    if (arg === '--include' && next) {
      options.include = next
        .split(',')
        .map(value => value.trim())
        .filter(Boolean)
      i += 1
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--no-latest') {
      options.updateLatest = false
      continue
    }
  }

  return options
}

export function treeApiUrl(repo: string, branch: string): string {
  return `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`
}

export function toRawUrl(repo: string, branch: string, filePath: string): string {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`
}

export function shouldKeepRosettaSourceFile(
  filePath: string,
  prefix: string,
  include: string[] = []
): boolean {
  if (!filePath.startsWith(prefix)) return false

  const basename = path.posix.basename(filePath)
  const isRosetta = filePath.endsWith('.rosetta')
  const isDictionary = basename === 'RosettaDictionary.txt'
  if (!isRosetta && !isDictionary) return false

  if (include.length === 0) return true
  return include.some(pattern => filePath.includes(pattern))
}

export function localSourcePath(baseDir: string, sourcePath: string): string {
  return path.resolve(baseDir, 'files', ...sourcePath.split('/'))
}

export function manifestFileForEntry(args: {
  entry: GitTreeEntry
  repo: string
  branch: string
  outputDirectory: string
}): RosettaSourceManifestFile {
  const extension = args.entry.path.endsWith('.rosetta') ? '.rosetta' : '.txt'
  return {
    sourcePath: args.entry.path,
    localPath: path.relative(
      args.outputDirectory,
      localSourcePath(args.outputDirectory, args.entry.path)
    ),
    rawUrl: toRawUrl(args.repo, args.branch, args.entry.path),
    sha: args.entry.sha,
    size: args.entry.size,
    extension,
  }
}

export function buildTimestamp(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, '-')
}

export function outputDirectories(args: {
  outDir: string
  mode: 'overwrite' | 'append'
  updateLatest: boolean
  generatedAt: string
}): { outputDirectory: string; latestDirectory?: string } {
  const root = path.resolve(args.outDir)
  if (args.mode === 'append') {
    const outputDirectory = path.join(root, 'runs', args.generatedAt)
    return {
      outputDirectory,
      latestDirectory: args.updateLatest ? path.join(root, 'latest') : undefined,
    }
  }
  return {
    outputDirectory: path.join(root, 'latest'),
    latestDirectory: undefined,
  }
}

export async function defaultFetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'fpml-cdm-fyp-rosetta-fetcher',
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`)
  }

  return (await response.json()) as T
}

export async function defaultFetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'fpml-cdm-fyp-rosetta-fetcher',
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`)
  }

  return response.text()
}

export async function fetchRosettaSource(args: {
  options: FetchRosettaSourceOptions
  fetchJson?: FetchJson
  fetchText?: FetchText
  now?: Date
}): Promise<FetchRosettaSourceResult> {
  const fetchJson = args.fetchJson ?? defaultFetchJson
  const fetchText = args.fetchText ?? defaultFetchText
  const generatedAt = args.now?.toISOString() ?? new Date().toISOString()
  const runStamp = buildTimestamp(args.now ?? new Date())
  const dirs = outputDirectories({
    outDir: args.options.outDir,
    mode: args.options.mode,
    updateLatest: args.options.updateLatest,
    generatedAt: runStamp,
  })
  const apiTreeUrl = treeApiUrl(args.options.repo, args.options.branch)
  const tree = await fetchJson<GitTreeResponse>(apiTreeUrl)
  const warnings: string[] = []
  if (tree.truncated) {
    warnings.push('GitHub tree response was truncated. Results may be incomplete.')
  }

  const selectedEntries = tree.tree
    .filter(entry => entry.type === 'blob')
    .filter(entry =>
      shouldKeepRosettaSourceFile(entry.path, args.options.prefix, args.options.include)
    )
    .slice(0, args.options.limit)

  const skippedFileCount = tree.tree.filter(entry => entry.type === 'blob').length - selectedEntries.length
  const manifestFiles = selectedEntries.map(entry =>
    manifestFileForEntry({
      entry,
      repo: args.options.repo,
      branch: args.options.branch,
      outputDirectory: dirs.outputDirectory,
    })
  )
  const manifest: RosettaSourceManifest = {
    generatedAt,
    repo: args.options.repo,
    branch: args.options.branch,
    sourcePrefix: args.options.prefix,
    apiTreeUrl,
    treeSha: tree.sha,
    treeTruncated: tree.truncated,
    fileCount: manifestFiles.length,
    totalBytes: sumKnownSizes(selectedEntries),
    files: manifestFiles,
  }
  const diagnostics: RosettaFetchDiagnostics = {
    generatedAt,
    dryRun: args.options.dryRun,
    requestedFileCount: selectedEntries.length,
    downloadedFileCount: 0,
    skippedFileCount,
    failedDownloads: [],
    warnings,
  }

  if (args.options.dryRun) {
    return {
      ...dirs,
      manifest,
      diagnostics,
    }
  }

  await writeSnapshot({
    outputDirectory: dirs.outputDirectory,
    manifest,
    diagnostics,
    selectedEntries,
    repo: args.options.repo,
    branch: args.options.branch,
    fetchText,
    cleanFirst: true,
  })

  if (dirs.latestDirectory) {
    await writeSnapshot({
      outputDirectory: dirs.latestDirectory,
      manifest: {
        ...manifest,
        files: selectedEntries.map(entry =>
          manifestFileForEntry({
            entry,
            repo: args.options.repo,
            branch: args.options.branch,
            outputDirectory: dirs.latestDirectory!,
          })
        ),
      },
      diagnostics,
      selectedEntries,
      repo: args.options.repo,
      branch: args.options.branch,
      fetchText,
      cleanFirst: true,
    })
  }

  return {
    ...dirs,
    manifest,
    diagnostics,
  }
}

async function writeSnapshot(args: {
  outputDirectory: string
  manifest: RosettaSourceManifest
  diagnostics: RosettaFetchDiagnostics
  selectedEntries: GitTreeEntry[]
  repo: string
  branch: string
  fetchText: FetchText
  cleanFirst: boolean
}): Promise<void> {
  if (args.cleanFirst) {
    await rm(args.outputDirectory, { recursive: true, force: true })
  }
  await mkdir(args.outputDirectory, { recursive: true })

  const diagnostics: RosettaFetchDiagnostics = {
    ...args.diagnostics,
    downloadedFileCount: 0,
    failedDownloads: [],
  }

  for (const entry of args.selectedEntries) {
    const rawUrl = toRawUrl(args.repo, args.branch, entry.path)
    const targetPath = localSourcePath(args.outputDirectory, entry.path)
    try {
      const content = await args.fetchText(rawUrl)
      await mkdir(path.dirname(targetPath), { recursive: true })
      await writeFile(targetPath, content, 'utf8')
      diagnostics.downloadedFileCount += 1
    } catch (error) {
      diagnostics.failedDownloads.push({
        sourcePath: entry.path,
        rawUrl,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  await writeFile(
    path.join(args.outputDirectory, 'manifest.json'),
    JSON.stringify(args.manifest, null, 2),
    'utf8'
  )
  await writeFile(
    path.join(args.outputDirectory, 'diagnostics.json'),
    JSON.stringify(diagnostics, null, 2),
    'utf8'
  )

  if (diagnostics.failedDownloads.length > 0) {
    throw new Error(
      `Failed to download ${diagnostics.failedDownloads.length} Rosetta source file(s).`
    )
  }
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`
}

function sumKnownSizes(entries: GitTreeEntry[]): number | undefined {
  const sizes = entries.map(entry => entry.size).filter((value): value is number => value != null)
  if (sizes.length === 0) return undefined
  return sizes.reduce((sum, value) => sum + value, 0)
}
