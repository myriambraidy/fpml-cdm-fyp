import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

export type GeneratedDocHygieneFinding = {
  file: string
  code: string
  message: string
}

export async function runGeneratedDocHygieneGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findGeneratedDocHygieneFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'generated-doc-hygiene.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ authority: 'diagnostic', findings }, null, 2), 'utf8')
  return {
    name: 'generated-doc-hygiene',
    command: 'diagnose generated markdown hygiene',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet: findings.length === 0
      ? 'Generated doc hygiene diagnostic passed.'
      : JSON.stringify(findings.slice(0, 40), null, 2),
  }
}

export async function findGeneratedDocHygieneFindings(root: string): Promise<GeneratedDocHygieneFinding[]> {
  const workspaceRoot = resolve(root, 'agent-workspace')
  if (!(await exists(workspaceRoot))) return []
  const markdownFiles = (await listFilesRecursive(workspaceRoot)).filter(file => file.endsWith('.md'))
  const findings: GeneratedDocHygieneFinding[] = []
  for (const file of markdownFiles) {
    const text = await readFile(file, 'utf8')
    const displayPath = relative(root, file)
    if (/Ã¢|ï¿½|�/u.test(text)) {
      findings.push({
        file: displayPath,
        code: 'mojibake',
        message: 'Generated markdown contains mojibake replacement text.',
      })
    }
    if (/all required implementation files have been written and verified/iu.test(text)) {
      findings.push({
        file: displayPath,
        code: 'unsupported_compliance_claim',
        message: 'Generated markdown makes a compliance claim that must be verified by deterministic reports.',
      })
    }
  }
  return findings
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
