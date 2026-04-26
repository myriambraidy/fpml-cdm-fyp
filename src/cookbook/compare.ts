import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import type { CookbookManifest, CookbookRunComparison } from './types'

async function fileExists(path: string): Promise<boolean> {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch {
    return false
  }
}

export async function compareWithLatest(args: {
  outputRoot: string
  currentManifest: CookbookManifest
}): Promise<CookbookRunComparison> {
  const previousManifestPath = join(args.outputRoot, 'latest', 'manifest.json')
  if (!(await fileExists(previousManifestPath))) {
    return {
      comparedToLatest: false,
      addedFamilies: [],
      removedFamilies: [],
      statusChanges: [],
      globalRuleCountChanges: [],
    }
  }

  const previousManifest = JSON.parse(await readFile(previousManifestPath, 'utf8')) as CookbookManifest
  const previousFamilies = new Map(previousManifest.families.map(family => [family.folder, family.operationalStatus]))
  const currentFamilies = new Map(args.currentManifest.families.map(family => [family.folder, family.operationalStatus]))
  const previousGlobal = new Map(previousManifest.globalDocuments.map(document => [document.name, document.ruleCount]))
  const currentGlobal = new Map(args.currentManifest.globalDocuments.map(document => [document.name, document.ruleCount]))

  return {
    comparedToLatest: true,
    previousManifestPath,
    addedFamilies: [...currentFamilies.keys()].filter(folder => !previousFamilies.has(folder)),
    removedFamilies: [...previousFamilies.keys()].filter(folder => !currentFamilies.has(folder)),
    statusChanges: [...currentFamilies.entries()]
      .filter(([folder, status]) => previousFamilies.has(folder) && previousFamilies.get(folder) !== status)
      .map(([folder, status]) => ({
        folder,
        before: previousFamilies.get(folder)!,
        after: status,
      })),
    globalRuleCountChanges: [...currentGlobal.entries()]
      .filter(([name, count]) => previousGlobal.has(name) && previousGlobal.get(name) !== count)
      .map(([name, count]) => ({
        name,
        before: previousGlobal.get(name)!,
        after: count,
      })),
  }
}
