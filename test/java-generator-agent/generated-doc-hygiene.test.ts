import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { findGeneratedDocHygieneFindings } from '../../src/java-generator-agent/generated-doc-hygiene'

describe('generated doc hygiene diagnostic', () => {
  test('detects mojibake in generated markdown', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-doc-hygiene-'))
    try {
      const workspace = join(root, 'agent-workspace')
      await mkdir(workspace, { recursive: true })
      await Bun.write(join(workspace, 'repair-log.md'), 'Fixed Ã¢ bad text')

      const findings = await findGeneratedDocHygieneFindings(root)

      expect(findings.map(finding => finding.code)).toContain('mojibake')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
