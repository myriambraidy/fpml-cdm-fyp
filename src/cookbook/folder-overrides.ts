import { readFile, stat } from 'node:fs/promises'
import type {
  CookbookFolderOverride,
  FamilyReadiness,
  OperationalStatus,
} from './types'

async function fileExists(path: string): Promise<boolean> {
  try {
    const result = await stat(path)
    return result.isFile()
  } catch {
    return false
  }
}

export async function loadFolderOverrides(path: string | undefined): Promise<CookbookFolderOverride[]> {
  if (!path || !(await fileExists(path))) return []
  const text = await readFile(path, 'utf8')
  return JSON.parse(text) as CookbookFolderOverride[]
}

export function applyFolderOverride(args: {
  readiness: FamilyReadiness
  overrides: CookbookFolderOverride[]
}): FamilyReadiness {
  const override = args.overrides.find(item => item.folder === args.readiness.folder)
  if (!override) return args.readiness

  const operationalStatus = override.operationalStatus ?? args.readiness.operationalStatus
  return {
    ...args.readiness,
    operationalStatus,
    agentUsePolicy: override.agentUsePolicy ?? describeOverridePolicy(operationalStatus),
    reasonCodes: override.reasonCode
      ? [...args.readiness.reasonCodes, override.reasonCode]
      : args.readiness.reasonCodes,
  }
}

function describeOverridePolicy(status: OperationalStatus): string {
  if (status === 'ready') return 'Agents may apply these rules during normal FPML to CDM proposal generation by override.'
  if (status === 'pilot_only') return 'Agents may apply these rules with analyst confirmation by override.'
  if (status === 'review_only') return 'Agents must use this folder only as review evidence by override.'
  return 'Agents must not use this folder as semantic mapping knowledge by override.'
}
