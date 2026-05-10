import { mkdir, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'
import { findGeneratedInterfaceContractFindings } from '../../src/java-generator-agent/generated-implementation-contract'

describe('generated implementation contract', () => {
  test('rejects helper mappers implementing the shell interface', async () => {
    const root = await mkdtemp(join(tmpdir(), 'generated-contract-'))
    await writeGenerated(root, 'PartyMapper.java', [
      'package com.fpml.cdm.fx.mapper.generated;',
      'import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;',
      'public class PartyMapper implements FpmlToCdmMapper {',
      '}',
    ].join('\n'))

    const findings = await findGeneratedInterfaceContractFindings(root)

    expect(findings.some(finding => finding.includes('only GeneratedFpmlToCdmMapper'))).toBe(true)
  })

  test('rejects mapFile return types other than String', async () => {
    const root = await mkdtemp(join(tmpdir(), 'generated-contract-'))
    await writeGenerated(root, 'GeneratedFpmlToCdmMapper.java', [
      'package com.fpml.cdm.fx.mapper.generated;',
      'import java.nio.file.Path;',
      'public class GeneratedFpmlToCdmMapper {',
      '  public TradeState mapFile(Path inputPath, Path reportsDir) { return null; }',
      '}',
    ].join('\n'))

    const findings = await findGeneratedInterfaceContractFindings(root)

    expect(findings.some(finding => finding.includes('mapFile must return String'))).toBe(true)
  })

  test('allows public final String mapFile with canonical parameters', async () => {
    const root = await mkdtemp(join(tmpdir(), 'generated-contract-'))
    await writeGenerated(root, 'GeneratedFpmlToCdmMapper.java', [
      'package com.fpml.cdm.fx.mapper.generated;',
      'import java.nio.file.Path;',
      'public class GeneratedFpmlToCdmMapper {',
      '  public final String mapFile(final Path inputPath, final Path reportsDir) throws Exception { return "{}"; }',
      '}',
    ].join('\n'))

    const findings = await findGeneratedInterfaceContractFindings(root)

    expect(findings).toEqual([])
  })

  test('rejects mapFile with wrong parameters', async () => {
    const root = await mkdtemp(join(tmpdir(), 'generated-contract-'))
    await writeGenerated(root, 'GeneratedFpmlToCdmMapper.java', [
      'package com.fpml.cdm.fx.mapper.generated;',
      'import java.nio.file.Path;',
      'public class GeneratedFpmlToCdmMapper {',
      '  public String mapFile(Path inputPath) throws IOException { return "{}"; }',
      '}',
    ].join('\n'))

    const findings = await findGeneratedInterfaceContractFindings(root)

    expect(findings.some(finding => finding.includes('Path inputPath, Path reportsDir'))).toBe(true)
    expect(findings.some(finding => finding.includes('throws clause must include Exception'))).toBe(true)
  })
})

async function writeGenerated(root: string, fileName: string, content: string): Promise<void> {
  const dir = join(root, 'src/main/java/com/fpml/cdm/fx/mapper/generated')
  await mkdir(dir, { recursive: true })
  const path = join(dir, fileName)
  await Bun.write(path, content)
}
