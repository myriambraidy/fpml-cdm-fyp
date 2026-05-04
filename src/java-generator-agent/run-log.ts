import { appendFile } from 'node:fs/promises'
import { fence } from './markdown'

type LogDetails = Record<string, string | number | boolean | string[]>

export async function appendRunLog(
  runLogPath: string,
  event: {
    title: string
    details?: LogDetails
  }
): Promise<void> {
  const parts = [`\n## ${new Date().toISOString()} - ${event.title}`, '']
  if (event.details) {
    parts.push(fence('json', JSON.stringify(event.details, null, 2)), '')
  }
  await appendFile(runLogPath, parts.join('\n'), 'utf8')
}
