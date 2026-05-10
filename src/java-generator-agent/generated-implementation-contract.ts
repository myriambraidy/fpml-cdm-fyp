import { readFile, stat } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { GENERATED_IMPL_PACKAGE, GENERATED_IMPL_SOURCE_ROOT } from './java-contract'
import { listFilesRecursive } from './file-list'
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
  findings.push(...await findGeneratedInterfaceContractFindings(config.runOutputDir))

  return {
    status: findings.length === 0 ? 'passed' : 'failed',
    entryClassPath,
    findings,
  }
}

export async function findGeneratedInterfaceContractFindings(runOutputDir: string): Promise<string[]> {
  const sourceRoot = resolve(runOutputDir, GENERATED_IMPL_SOURCE_ROOT)
  if (!(await exists(sourceRoot))) return []
  const files = (await listFilesRecursive(sourceRoot)).filter(file => file.endsWith('.java'))
  const findings: string[] = []
  for (const file of files) {
    const content = await readFile(file, 'utf8')
    const displayPath = relative(runOutputDir, file)
    const className = classNameFromJavaPath(file)
    const implementsShell = /\bimplements\s+(?:com\.fpml\.cdm\.fx\.mapper\.)?FpmlToCdmMapper\b/u.test(content)
    if (className !== 'GeneratedFpmlToCdmMapper' && implementsShell) {
      findings.push(`${displayPath}: only GeneratedFpmlToCdmMapper may implement FpmlToCdmMapper.`)
    }
    findings.push(...validateMapFileSignatures(content, displayPath))
  }
  return findings
}

function validateMapFileSignatures(content: string, displayPath: string): string[] {
  const findings: string[] = []
  const stripped = stripJavaComments(content)
  for (const match of stripped.matchAll(/\b((?:public|protected|private)\s+(?:final\s+)?[A-Za-z0-9_$.<>]+\s+mapFile\s*\([^)]*\)(?:\s+throws\s+[A-Za-z0-9_.,\s]+)?)/gmu)) {
    const signature = match[1]
    if (signature === undefined) continue
    const line = lineForIndex(stripped, match.index)
    const parsed = /\b(public|protected|private)\s+(?:final\s+)?([A-Za-z0-9_$.<>]+)\s+mapFile\s*\(([^)]*)\)(?:\s+throws\s+([A-Za-z0-9_.,\s]+))?/mu.exec(signature)
    if (parsed === null) continue
    const visibility = parsed[1]
    const returnType = parsed[2]
    const params = normalizeWhitespace(parsed[3] ?? '')
    const throwsClause = normalizeWhitespace(parsed[4] ?? '')
    if (visibility !== 'public') {
      findings.push(`${displayPath}:${line} mapFile must be public.`)
    }
    if (returnType !== 'String') {
      findings.push(`${displayPath}:${line} mapFile must return String, found ${returnType ?? 'unknown'}.`)
    }
    if (!/^(?:final\s+)?Path\s+inputPath,\s*(?:final\s+)?Path\s+reportsDir$/u.test(params)) {
      findings.push(`${displayPath}:${line} mapFile must accept Path inputPath, Path reportsDir.`)
    }
    if (!throwsClause.split(/\s*,\s*/u).some(item => item === 'Exception')) {
      findings.push(`${displayPath}:${line} mapFile throws clause must include Exception.`)
    }
  }
  return findings
}

function stripJavaComments(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\//gu, '')
    .replace(/\/\/.*$/gmu, '')
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/gu, ' ').trim()
}

function classNameFromJavaPath(path: string): string {
  const normalized = path.replace(/\\/g, '/')
  const fileName = normalized.split('/').at(-1) ?? ''
  return fileName.endsWith('.java') ? fileName.slice(0, -'.java'.length) : fileName
}

function lineForIndex(text: string, index: number | undefined): number {
  if (index === undefined) return 1
  return text.slice(0, index).split(/\r?\n/u).length
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
