import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { findGeneratedReportConsistencyFindings } from '../../src/java-generator-agent/generated-report-consistency'

describe('generated report consistency diagnostic', () => {
  test('detects false class usage compliance claim', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-report-consistency-'))
    try {
      await mkdir(join(root, 'reports'), { recursive: true })
      await mkdir(join(root, 'build-reports'), { recursive: true })
      await Bun.write(join(root, 'reports/cdm-class-usage-report.json'), '{"forbiddenClassesUsed":0}')
      await Bun.write(
        join(root, 'build-reports/cdm-java-api-usage.json'),
        JSON.stringify({ findings: [{ code: 'cdm_import_not_in_approved_contract' }] })
      )

      const findings = await findGeneratedReportConsistencyFindings(root)

      expect(findings.some(finding => finding.artifact === 'reports/cdm-class-usage-report.json')).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('flags repair prose in repair-attempt file when artifact report shows zero java writes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-report-repair-'))
    try {
      await mkdir(join(root, 'agent-workspace'), { recursive: true })
      await mkdir(join(root, 'build-reports'), { recursive: true })
      await writeFile(join(root, 'agent-workspace/repair-attempt-01.md'), 'We patched the mapper.\n', 'utf8')
      await writeFile(
        join(root, 'build-reports/repair-artifact-report.json'),
        JSON.stringify({ generatedJavaWriteCount: 0 }),
        'utf8'
      )

      const findings = await findGeneratedReportConsistencyFindings(root)

      expect(
        findings.some(
          f =>
            f.claim.includes('patched') &&
            f.contradictedBy.includes('repair-artifact-report.json') &&
            f.contradictedBy.includes('generatedJavaWriteCount')
        )
      ).toBe(true)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
