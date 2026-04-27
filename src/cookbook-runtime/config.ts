import { resolve } from 'node:path'

function readBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name]
  if (raw == null || raw.trim() === '') return fallback
  const normalized = raw.trim().toLowerCase()
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false
  return fallback
}

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name]
  if (raw == null || raw.trim() === '') return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export interface CookbookRuntimeConfig {
  enabled: boolean
  rootPath: string
  maxChars: number
  includeReviewOnly: boolean
}

export function readCookbookRuntimeConfig(workspaceRoot: string): CookbookRuntimeConfig {
  const defaultRoot = resolve(workspaceRoot, 'data/agent-cookbook-llm/latest')
  const rootPath = process.env.COOKBOOK_RUNTIME_ROOT
    ? resolve(workspaceRoot, process.env.COOKBOOK_RUNTIME_ROOT)
    : defaultRoot
  return {
    enabled: readBoolean('COOKBOOK_RUNTIME_ENABLED', true),
    rootPath,
    maxChars: readNumber('COOKBOOK_RUNTIME_MAX_CHARS', 28_000),
    includeReviewOnly: readBoolean('COOKBOOK_RUNTIME_INCLUDE_REVIEW_ONLY', false),
  }
}

