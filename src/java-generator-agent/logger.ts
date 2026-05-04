import { truncateForLog } from './markdown'

export type GeneratorLogger = {
  info: (event: string, details?: Record<string, string | number | boolean>) => void
  warn: (event: string, details?: Record<string, string | number | boolean>) => void
  error: (event: string, details?: Record<string, string | number | boolean>) => void
}

export const createConsoleGeneratorLogger = (): GeneratorLogger => ({
  info: (event, details) => log('info', event, details),
  warn: (event, details) => log('warn', event, details),
  error: (event, details) => log('error', event, details),
})

function log(
  level: 'info' | 'warn' | 'error',
  event: string,
  details?: Record<string, string | number | boolean>
): void {
  const rendered = details
    ? ' ' +
      Object.entries(details)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(' ')
    : ''
  console[level](`[java-generator][${new Date().toISOString()}][${level}] ${event}${truncateForLog(rendered, 1000)}`)
}
