import type { CookbookLlmConfig } from './types'

export type CookbookLlmLogValue = string | number | boolean | null | undefined

export interface CookbookLlmLogDetails {
  [key: string]: CookbookLlmLogValue
}

export interface CookbookLlmLogger {
  info(event: string, details?: CookbookLlmLogDetails): void
  warn(event: string, details?: CookbookLlmLogDetails): void
  debug(event: string, details?: CookbookLlmLogDetails): void
}

export function createCookbookLlmLogger(config: CookbookLlmConfig): CookbookLlmLogger {
  if (config.logLevel === 'silent') return silentLogger
  return {
    info: (event, details) => writeLog('info', event, details),
    warn: (event, details) => writeLog('warn', event, details),
    debug: (event, details) => {
      if (config.logLevel === 'debug') writeLog('debug', event, details)
    },
  }
}

export const silentLogger: CookbookLlmLogger = {
  info: () => undefined,
  warn: () => undefined,
  debug: () => undefined,
}

function writeLog(level: 'info' | 'warn' | 'debug', event: string, details?: CookbookLlmLogDetails): void {
  const payload = details ? ` ${formatDetails(details)}` : ''
  console.error(`[cookbook-llm][${new Date().toISOString()}][${level}][${event}]${payload}`)
}

function formatDetails(details: CookbookLlmLogDetails): string {
  return Object.entries(details)
    .filter((entry): entry is [string, Exclude<CookbookLlmLogValue, undefined>] => entry[1] !== undefined)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(' ')
}

function formatValue(value: Exclude<CookbookLlmLogValue, undefined>): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (value === null) return 'null'
  return String(value)
}
