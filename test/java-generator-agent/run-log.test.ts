import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { appendRunLog } from '../../src/java-generator-agent/run-log'

describe('appendRunLog', () => {
  test('appends title and optional sourceEventId', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-run-log-'))
    const logPath = join(root, '00-run-log.md')
    try {
      await mkdir(root, { recursive: true })
      await appendRunLog(logPath, { title: 'gate.start', sourceEventId: 'evt-1', details: { gate: 'maven-compile' } })
      const text = await readFile(logPath, 'utf8')
      expect(text).toContain('gate.start (evt-1)')
      expect(text).toContain('"gate": "maven-compile"')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
