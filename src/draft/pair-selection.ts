import { join } from 'node:path'
import { readUtf8 } from './io'
import type {
  DraftCoverageSummary,
  DraftIgnoredExample,
  DraftManifest,
  DraftManifestEntry,
  DraftPair,
  DraftPairSelectionResult,
  DraftRunConfig,
} from './types'

const normalizeSlashes = (value: string): string => value.replaceAll('\\', '/')

const folderMatches = (relativePath: string, folder: string): boolean => {
  const normalizedPath = normalizeSlashes(relativePath)
  const normalizedFolder = normalizeSlashes(folder).replace(/\/+$/, '')
  return (
    normalizedPath === normalizedFolder || normalizedPath.startsWith(`${normalizedFolder}/`)
  )
}

export async function readDraftManifest(manifestPath: string): Promise<DraftManifest> {
  return JSON.parse(await readUtf8(manifestPath)) as DraftManifest
}

function isMatchedDraftEntry(
  entry: DraftManifestEntry
): entry is DraftManifestEntry & {
  cdmRelativePath: string
  strategy: Exclude<DraftManifestEntry['strategy'], 'missing'>
  status: 'matched'
} {
  return entry.status === 'matched' && !!entry.cdmRelativePath && entry.strategy !== 'missing'
}

export function selectDraftPairsForFolder(args: {
  manifest: DraftManifest
  manifestPath: string
  config: DraftRunConfig
}): DraftPairSelectionResult {
  const { manifest, manifestPath, config } = args
  const folder = normalizeSlashes(config.folder)
  const entries = manifest.entries.filter(entry => folderMatches(entry.fpmlRelativePath, folder))
  const matchedEntries = entries.filter(isMatchedDraftEntry)
  const missingExamples = entries
    .filter(entry => entry.status === 'missing')
    .map(entry => normalizeSlashes(entry.fpmlRelativePath))

  const ignoredExamples: DraftIgnoredExample[] = []
  const maxPairs =
    typeof config.maxPairs === 'number' ? Math.max(0, Math.floor(config.maxPairs)) : undefined
  const limitedMatches = typeof maxPairs === 'number' ? matchedEntries.slice(0, maxPairs) : matchedEntries

  for (const skipped of matchedEntries.slice(limitedMatches.length)) {
    ignoredExamples.push({
      fpmlRelativePath: normalizeSlashes(skipped.fpmlRelativePath),
      cdmRelativePath: skipped.cdmRelativePath ? normalizeSlashes(skipped.cdmRelativePath) : undefined,
      reason: `Skipped because maxPairs=${maxPairs} limited the run.`,
      strategy: skipped.strategy,
    })
  }

  const includedPairs: DraftPair[] = limitedMatches.map(entry => ({
    folder,
    fpmlRelativePath: normalizeSlashes(entry.fpmlRelativePath),
    cdmRelativePath: normalizeSlashes(entry.cdmRelativePath!),
    fpmlAbsolutePath: join(config.fpmlRoot, entry.fpmlRelativePath),
    cdmAbsolutePath: join(config.cdmRoot, entry.cdmRelativePath!),
    pairingStrategy: entry.strategy,
  }))

  const byCategory = manifest.summary.byCategory[folder] ?? {
    total: entries.length,
    matched: matchedEntries.length,
    missing: missingExamples.length,
  }

  const coverage: DraftCoverageSummary = {
    totalFpmlFilesInFolder: byCategory.total,
    matchedPairsAvailable: matchedEntries.length,
    matchedPairsUsed: includedPairs.length,
    missingCounterparts: byCategory.missing,
    ignoredPairs: ignoredExamples.length,
    exactMatches: includedPairs.filter(pair => pair.pairingStrategy === 'exact').length,
    normalizedMatches: includedPairs.filter(pair => pair.pairingStrategy === 'normalized').length,
    aliasMatches: includedPairs.filter(pair => pair.pairingStrategy === 'alias').length,
  }

  return {
    manifestPath,
    folder,
    includedPairs,
    missingExamples,
    ignoredExamples,
    coverage,
  }
}

export { folderMatches, normalizeSlashes }
