import { appendFile } from 'node:fs/promises'
import { fence } from './markdown'
import type { JsonValue } from './types'

export type LogDetails = Record<string, JsonValue>

export async function appendRunLog(
  runLogPath: string,
  event: {
    title: string
    sourceEventId?: string
    details?: LogDetails
  }
): Promise<void> {
  const heading = event.sourceEventId
    ? `\n## ${new Date().toISOString()} - ${event.title} (${event.sourceEventId})`
    : `\n## ${new Date().toISOString()} - ${event.title}`
  const parts = [heading, '']
  if (event.details) {
    parts.push(fence('json', JSON.stringify(event.details, null, 2)), '')
  }
  await appendFile(runLogPath, parts.join('\n'), 'utf8')
}
