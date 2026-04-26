import { resolve } from 'node:path'
import type { CookbookConfig, CookbookWriteMode } from './types'

export function readCookbookConfigFromEnv(workspaceRoot: string): CookbookConfig {
  return {
    workspaceRoot,
    draftsRoot: resolve(workspaceRoot, process.env.COOKBOOK_DRAFTS_ROOT ?? 'data/drafts'),
    outputRoot: resolve(workspaceRoot, process.env.COOKBOOK_OUTPUT_ROOT ?? 'data/agent-cookbook'),
    mode: readMode(process.env.COOKBOOK_MODE),
    updateLatest: readBoolean(process.env.COOKBOOK_UPDATE_LATEST, true),
    includeReviewOnly: readBoolean(process.env.COOKBOOK_INCLUDE_REVIEW_ONLY, true),
    enablePolish: readBoolean(process.env.COOKBOOK_ENABLE_POLISH, false),
    folderOverridesPath: process.env.COOKBOOK_FOLDER_OVERRIDES
      ? resolve(workspaceRoot, process.env.COOKBOOK_FOLDER_OVERRIDES)
      : undefined,
  }
}

function readMode(value: string | undefined): CookbookWriteMode {
  return value === 'append' ? 'append' : 'overwrite'
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback
  const normalized = value.trim().toLowerCase()
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false
  return fallback
}
