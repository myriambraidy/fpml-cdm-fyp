import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { findGeneratedJavaStaticSanityFindings } from '../../src/java-generator-agent/java-static-sanity'

describe('generated java static sanity', () => {
  test('rejects Java import aliases and wildcard CDM imports', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-static-sanity-'))
    try {
      const sourceDir = join(root, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      await Bun.write(
        join(sourceDir, 'GeneratedMapper.java'),
        [
          'package com.fpml.cdm.fx.mapper.generated;',
          'import cdm.product.template.SettlementPayout as SettPayout;',
          'import cdm.product.template.*;',
          'public class GeneratedMapper {}',
        ].join('\n')
      )

      const findings = await findGeneratedJavaStaticSanityFindings(root)
      const codes = findings.map(finding => finding.code)

      expect(codes).toContain('java_import_alias')
      expect(codes).toContain('wildcard_cdm_import')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('diagnoses silent null returns and manual JSON strings', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-static-sanity-'))
    try {
      const sourceDir = join(root, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(sourceDir, { recursive: true })
      await Bun.write(
        join(sourceDir, 'GeneratedMapper.java'),
        [
          'package com.fpml.cdm.fx.mapper.generated;',
          'public class GeneratedMapper {',
          '  String json() { return "{\\"status\\":\\"ok\\"}"; }',
          '  Object value() {',
          '    return null;',
          '  }',
          '}',
        ].join('\n')
      )

      const findings = await findGeneratedJavaStaticSanityFindings(root)
      const codes = findings.map(finding => finding.code)

      expect(codes).toContain('manual_json_string_construction')
      expect(codes).toContain('silent_null_return')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
