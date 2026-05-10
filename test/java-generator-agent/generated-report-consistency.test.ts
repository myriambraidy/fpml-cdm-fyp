import { mkdir, mkdtemp, rm } from 'node:fs/promises'
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
})
