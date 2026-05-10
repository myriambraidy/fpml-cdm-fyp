import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { findGeneratedTestShellContractFindings } from '../../src/java-generator-agent/generated-test-shell-contract'

describe('generated test shell contract diagnostic', () => {
  test('rejects invented RuntimeArgs and mapper.map usage', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-test-contract-'))
    try {
      const testDir = join(root, 'src/test/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(testDir, { recursive: true })
      await Bun.write(
        join(testDir, 'GeneratedFpmlToCdmMapperTest.java'),
        [
          'package com.fpml.cdm.fx.mapper.generated;',
          'class GeneratedFpmlToCdmMapperTest {',
          '  void testMapper() {',
          '    RuntimeArgs args = new RuntimeArgs();',
          '    args.setFixtureName("fixture");',
          '    mapper.map(args);',
          '  }',
          '}',
        ].join('\n')
      )

      const findings = await findGeneratedTestShellContractFindings(root)
      const codes = findings.map(finding => finding.code)

      expect(codes).toContain('runtime_args_default_constructor')
      expect(codes).toContain('runtime_args_set_fixture_name')
      expect(codes).toContain('mapper_map_runtime_args')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  test('allows mapFile path usage', async () => {
    const root = await mkdtemp(join(tmpdir(), 'java-generator-test-contract-'))
    try {
      const testDir = join(root, 'src/test/java/com/fpml/cdm/fx/mapper/generated')
      await mkdir(testDir, { recursive: true })
      await Bun.write(
        join(testDir, 'GeneratedFpmlToCdmMapperTest.java'),
        [
          'package com.fpml.cdm.fx.mapper.generated;',
          'class GeneratedFpmlToCdmMapperTest {',
          '  void testMapper() throws Exception {',
          '    FpmlToCdmMapper mapper = new GeneratedFpmlToCdmMapper();',
          '    String json = mapper.mapFile(inputPath, reportsDir);',
          '  }',
          '}',
        ].join('\n')
      )

      expect(await findGeneratedTestShellContractFindings(root)).toEqual([])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
