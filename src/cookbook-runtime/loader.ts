import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import type {
  CookbookFamilyContext,
  CookbookFamilyEvidenceSummary,
  CookbookGlobalContext,
  CookbookManifest,
  CookbookManifestFamily,
  CookbookManifestGlobalDocument,
  CookbookRuntimeBundle,
  JsonObject,
  JsonValue,
} from './types'

interface CachedBundle {
  mtimeMs: number
  bundle: CookbookRuntimeBundle
}

const runtimeCache = new Map<string, CachedBundle>()

function asObject(value: JsonValue): JsonObject | null {
  if (value != null && typeof value === 'object' && !Array.isArray(value)) {
    return value
  }
  return null
}

function asString(value: JsonValue): string | null {
  return typeof value === 'string' ? value : null
}

function asStringArray(value: JsonValue): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

async function readJson(path: string): Promise<JsonValue> {
  const text = await readFile(path, 'utf8')
  return JSON.parse(text) as JsonValue
}

function parseManifest(json: JsonValue): CookbookManifest {
  const obj = asObject(json)
  if (!obj) {
    return { generatedAt: '' }
  }
  const sourceManifestObj = asObject(obj.sourceManifest ?? null)
  const familiesRaw = sourceManifestObj?.families
  const globalsRaw = sourceManifestObj?.globalDocuments
  const families: CookbookManifestFamily[] = Array.isArray(familiesRaw)
    ? familiesRaw
        .map(item => asObject(item))
        .filter((item): item is JsonObject => item != null)
        .map(item => ({
          folder: asString(item.folder) ?? '',
          operationalStatus: (asString(item.operationalStatus) ?? 'review_only') as CookbookManifestFamily['operationalStatus'],
          markdownPath: asString(item.markdownPath) ?? '',
          evidencePath: asString(item.evidencePath) ?? '',
        }))
        .filter(item => item.folder.length > 0 && item.markdownPath.length > 0)
    : []
  const globalDocuments: CookbookManifestGlobalDocument[] = Array.isArray(globalsRaw)
    ? globalsRaw
        .map(item => asObject(item))
        .filter((item): item is JsonObject => item != null)
        .map(item => ({
          name: asString(item.name) ?? '',
          markdownPath: asString(item.markdownPath) ?? '',
        }))
        .filter(item => item.name.length > 0 && item.markdownPath.length > 0)
    : []
  return {
    generatedAt: asString(obj.generatedAt) ?? '',
    sourceManifest: {
      families,
      globalDocuments,
    },
  }
}

function extractIds(records: JsonValue, key: string): string[] {
  if (!Array.isArray(records)) return []
  const ids: string[] = []
  for (const item of records) {
    const obj = asObject(item)
    const value = obj ? asString(obj[key] ?? null) : null
    if (value) ids.push(value)
  }
  return ids
}

function parseEvidence(json: JsonValue): CookbookFamilyEvidenceSummary {
  const obj = asObject(json)
  if (!obj) {
    return {
      ruleIds: [],
      transformationIds: [],
      variantIds: [],
      enrichmentIds: [],
      openQuestions: [],
    }
  }
  return {
    ruleIds: extractIds(obj.stableMappingPatterns ?? null, 'id'),
    transformationIds: extractIds(obj.repeatedNonLiteralTransformations ?? null, 'id'),
    variantIds: extractIds(obj.variantsAndExceptions ?? null, 'id'),
    enrichmentIds: extractIds(obj.suspectedEnrichmentOrDefaultBehavior ?? null, 'id'),
    openQuestions: asStringArray(obj.openQuestions ?? []),
  }
}

async function loadGlobalDocs(rootPath: string, manifest: CookbookManifest): Promise<CookbookGlobalContext[]> {
  const docs =
    manifest.sourceManifest?.globalDocuments && manifest.sourceManifest.globalDocuments.length > 0
      ? manifest.sourceManifest.globalDocuments
      : await discoverGlobalDocuments(rootPath)
  const out: CookbookGlobalContext[] = []
  for (const doc of docs) {
    const path = join(rootPath, doc.markdownPath)
    try {
      const markdown = await readFile(path, 'utf8')
      out.push({ name: doc.name, markdown })
    } catch {
      continue
    }
  }
  return out
}

async function loadFamilyDocs(rootPath: string, manifest: CookbookManifest): Promise<CookbookFamilyContext[]> {
  const families =
    manifest.sourceManifest?.families && manifest.sourceManifest.families.length > 0
      ? manifest.sourceManifest.families
      : await discoverFamilyDocuments(rootPath)
  const out: CookbookFamilyContext[] = []
  for (const family of families) {
    let markdown: string
    try {
      markdown = await readFile(join(rootPath, family.markdownPath), 'utf8')
    } catch {
      continue
    }
    let evidenceJson: JsonValue = {}
    try {
      evidenceJson = await readJson(join(rootPath, family.evidencePath))
    } catch {
      evidenceJson = {}
    }
    out.push({
      familySlug: family.folder,
      status: family.operationalStatus,
      markdown,
      evidence: parseEvidence(evidenceJson),
    })
  }
  return out
}

async function discoverGlobalDocuments(rootPath: string): Promise<CookbookManifestGlobalDocument[]> {
  const folder = join(rootPath, 'global')
  const entries = await readdir(folder)
  return entries
    .filter(name => name.endsWith('.md'))
    .map(name => ({
      name: name.replace(/\.md$/i, ''),
      markdownPath: `global/${name}`,
    }))
}

function inferStatusFromFilename(familySlug: string): CookbookManifestFamily['operationalStatus'] {
  if (familySlug === 'dividend-swaps') return 'blocked'
  if (familySlug === 'fx-derivatives' || familySlug === 'commodity-derivatives') return 'ready'
  return 'review_only'
}

async function discoverFamilyDocuments(rootPath: string): Promise<CookbookManifestFamily[]> {
  const out: CookbookManifestFamily[] = []
  const familyDir = join(rootPath, 'product-families')
  const entries = await readdir(familyDir)
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue
    const familySlug = entry.replace(/\.md$/i, '')
    out.push({
      folder: familySlug,
      operationalStatus: inferStatusFromFilename(familySlug),
      markdownPath: `product-families/${entry}`,
      evidencePath: `references/${familySlug}.evidence.json`,
    })
  }
  return out
}

export async function loadCookbookRuntimeBundle(rootPath: string): Promise<CookbookRuntimeBundle> {
  const manifestPath = join(rootPath, 'manifest.json')
  const manifestStat = await stat(manifestPath)
  const cached = runtimeCache.get(rootPath)
  if (cached && cached.mtimeMs === manifestStat.mtimeMs) {
    return cached.bundle
  }

  const warnings: string[] = []
  const manifestJson = await readJson(manifestPath)
  const manifest = parseManifest(manifestJson)

  let validationIssueCount = 0
  try {
    const validationJson = await readJson(join(rootPath, 'validation.json'))
    if (Array.isArray(validationJson)) validationIssueCount = validationJson.length
  } catch {
    warnings.push('validation.json unavailable')
  }

  const global = await loadGlobalDocs(rootPath, manifest)
  const families = await loadFamilyDocs(rootPath, manifest)
  if (manifest.sourceManifest && manifest.sourceManifest.families.length !== families.length) {
    warnings.push('manifest family count does not match loadable family documents')
  }

  const bundle: CookbookRuntimeBundle = {
    rootPath,
    manifest,
    validationIssueCount,
    global,
    families,
    warnings,
  }
  runtimeCache.set(rootPath, { mtimeMs: manifestStat.mtimeMs, bundle })
  return bundle
}

