import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { GENERATED_IMPL_PACKAGE, GENERATED_IMPL_SOURCE_ROOT } from './java-contract'
import type { GateResult, GeneratorRunConfig } from './types'

export type GeneratedImplementationContractReport = {
  status: 'passed' | 'failed'
  entryClassPath: string
  findings: string[]
}

export function generatedEntryClassRelativePath(): string {
  return `${GENERATED_IMPL_SOURCE_ROOT}/GeneratedFpmlToCdmMapper.java`
}

export function generatedEntryClassPath(config: Pick<GeneratorRunConfig, 'runOutputDir'>): string {
  return resolve(config.runOutputDir, generatedEntryClassRelativePath())
}

export async function validateGeneratedImplementationContract(
  config: Pick<GeneratorRunConfig, 'runOutputDir'>
): Promise<GeneratedImplementationContractReport> {
  const entryClassPath = generatedEntryClassPath(config)
  const findings: string[] = []
  if (!(await exists(entryClassPath))) {
    findings.push(`Missing generated implementation entry class: ${generatedEntryClassRelativePath()}`)
    return { status: 'failed', entryClassPath, findings }
  }

  const content = await readFile(entryClassPath, 'utf8')
  if (!content.includes(`package ${GENERATED_IMPL_PACKAGE};`)) {
    findings.push(`GeneratedFpmlToCdmMapper must declare package ${GENERATED_IMPL_PACKAGE}.`)
  }
  if (!/\bpublic\s+(?:final\s+)?class\s+GeneratedFpmlToCdmMapper\b/u.test(content)) {
    findings.push('GeneratedFpmlToCdmMapper.java must declare public class GeneratedFpmlToCdmMapper.')
  }
  if (!/\bimplements\s+(?:com\.fpml\.cdm\.fx\.mapper\.)?FpmlToCdmMapper\b/u.test(content)) {
    findings.push('GeneratedFpmlToCdmMapper must implement com.fpml.cdm.fx.mapper.FpmlToCdmMapper.')
  }
  if (
    !content.includes('import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;')
    && !content.includes('implements com.fpml.cdm.fx.mapper.FpmlToCdmMapper')
  ) {
    findings.push('GeneratedFpmlToCdmMapper must import or fully qualify FpmlToCdmMapper.')
  }

  return {
    status: findings.length === 0 ? 'passed' : 'failed',
    entryClassPath,
    findings,
  }
}

export async function runGeneratedImplementationContractGate(
  config: GeneratorRunConfig
): Promise<GateResult> {
  const report = await validateGeneratedImplementationContract(config)
  return {
    name: 'generated-implementation-contract',
    command: 'check generated mapper entry class contract',
    status: report.status,
    exitCode: report.status === 'passed' ? 0 : 1,
    outputSnippet:
      report.status === 'passed'
        ? 'Generated implementation contract passed.'
        : report.findings.join('\n'),
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
