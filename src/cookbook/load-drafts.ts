import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import type { DraftArtifacts, DraftDebugArtifacts } from '../draft/types'
import type { LoadedDraftFamily } from './types'

async function fileExists(path: string): Promise<boolean> {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch {
    return false
  }
}

async function directoryExists(path: string): Promise<boolean> {
  try {
    const result = await stat(path)
    return result.isDirectory()
  } catch {
    return false
  }
}

async function readJson<T>(path: string): Promise<T> {
  const text = await readFile(path, 'utf8')
  return JSON.parse(text) as T
}

export async function loadDraftFamilies(draftsRoot: string): Promise<LoadedDraftFamily[]> {
  if (!(await directoryExists(draftsRoot))) {
    return []
  }

  const entries = await readdir(draftsRoot)
  const families: LoadedDraftFamily[] = []

  for (const folder of entries) {
    const folderPath = join(draftsRoot, folder)
    if (!(await directoryExists(folderPath))) continue

    const finalPath = join(folderPath, 'draft.json')
    const partialPath = join(folderPath, 'draft.partial.json')
    const draftPath = (await fileExists(finalPath)) ? finalPath : partialPath
    if (!(await fileExists(draftPath))) continue

    const artifact = await readJson<DraftArtifacts>(draftPath)
    if (!artifact.synthesis) continue

    const debugPath = join(folderPath, 'debug.json')
    const debug = (await fileExists(debugPath))
      ? await readJson<DraftDebugArtifacts>(debugPath)
      : undefined
    const logPath = join(folderPath, 'run-log.json')

    families.push({
      folder,
      draftPath,
      debugPath: debug ? debugPath : undefined,
      logPath: (await fileExists(logPath)) ? logPath : undefined,
      artifact,
      debug,
    })
  }

  return families.sort((a, b) => a.folder.localeCompare(b.folder))
}
