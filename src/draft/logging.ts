import type { DraftLogEntry } from './types'

export class DraftLogger {
  private readonly entries: DraftLogEntry[] = []
  constructor(private readonly consoleEnabled = true) {}

  info(
    stage: DraftLogEntry['stage'],
    message: string,
    data?: Record<string, unknown>
  ): void {
    this.push('info', stage, message, data)
  }

  warn(
    stage: DraftLogEntry['stage'],
    message: string,
    data?: Record<string, unknown>
  ): void {
    this.push('warn', stage, message, data)
  }

  error(
    stage: DraftLogEntry['stage'],
    message: string,
    data?: Record<string, unknown>
  ): void {
    this.push('error', stage, message, data)
  }

  getEntries(): DraftLogEntry[] {
    return [...this.entries]
  }

  private push(
    level: DraftLogEntry['level'],
    stage: DraftLogEntry['stage'],
    message: string,
    data?: Record<string, unknown>
  ): void {
    const entry: DraftLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      stage,
      message,
      data,
    }
    this.entries.push(entry)
    if (this.consoleEnabled) {
      this.emitConsole(entry)
    }
  }

  private emitConsole(entry: DraftLogEntry): void {
    const time = entry.timestamp.slice(11, 19)
    const prefix = `[draft][${time}][${entry.stage}][${entry.level}]`
    const details = formatData(entry.data)
    const line = details ? `${prefix} ${entry.message} ${details}` : `${prefix} ${entry.message}`

    if (entry.level === 'error') {
      console.error(line)
      return
    }
    if (entry.level === 'warn') {
      console.warn(line)
      return
    }
    console.log(line)
  }
}

function formatData(data?: Record<string, unknown>): string {
  if (!data || Object.keys(data).length === 0) {
    return ''
  }

  const compact = Object.entries(data)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(' ')

  return compact.length > 240 ? `${compact.slice(0, 237)}...` : compact
}

function formatValue(value: unknown): string {
  if (value == null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return `[${value.map(item => formatValue(item)).join(',')}]`
  }
  try {
    return JSON.stringify(value)
  } catch {
    return '[unserializable]'
  }
}
