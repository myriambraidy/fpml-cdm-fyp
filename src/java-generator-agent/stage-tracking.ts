import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type {
  GeneratorRunConfig,
  ModelCostLedgerEntry,
  StageManifestEntry,
  StageStatus,
} from './types'

export async function appendStageManifestEntry(
  config: GeneratorRunConfig,
  entry: StageManifestEntry
): Promise<void> {
  const path = stageManifestPath(config)
  const manifest = await readStageManifest(config)
  manifest.push(entry)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(manifest, null, 2), 'utf8')
}

export async function appendCostLedgerEntry(
  config: GeneratorRunConfig,
  entry: ModelCostLedgerEntry
): Promise<void> {
  const path = costLedgerPath(config)
  const ledger = await readCostLedger(config)
  ledger.push(entry)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(ledger, null, 2), 'utf8')
}

export async function stageArtifactExists(path: string): Promise<boolean> {
  try {
    const file = await stat(path)
    return file.isFile()
  } catch {
    return false
  }
}

export function createStageEntry(args: {
  stage: StageManifestEntry['stage']
  round?: number
  status: StageStatus
  artifact?: string
  model?: string
  startedAt: string
  endedAt?: string
  toolCalls: number
  failedToolCalls: number
  message?: string
}): StageManifestEntry {
  return args
}

async function readStageManifest(config: GeneratorRunConfig): Promise<StageManifestEntry[]> {
  const path = stageManifestPath(config)
  if (!(await stageArtifactExists(path))) return []
  return JSON.parse(await readFile(path, 'utf8')) as StageManifestEntry[]
}

async function readCostLedger(config: GeneratorRunConfig): Promise<ModelCostLedgerEntry[]> {
  const path = costLedgerPath(config)
  if (!(await stageArtifactExists(path))) return []
  return JSON.parse(await readFile(path, 'utf8')) as ModelCostLedgerEntry[]
}

function stageManifestPath(config: GeneratorRunConfig): string {
  return resolve(config.runOutputDir, 'build-reports', 'stage-manifest.json')
}

function costLedgerPath(config: GeneratorRunConfig): string {
  return resolve(config.runOutputDir, 'build-reports', 'model-cost-ledger.json')
}
