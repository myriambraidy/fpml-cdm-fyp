import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { GateResult, GeneratorRunConfig } from './types'

export type GeneratedReportConsistencyFinding = {
  artifact: string
  claim: string
  contradictedBy: string
  severity: 'warning' | 'blocking'
}

export async function runGeneratedReportConsistencyGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findGeneratedReportConsistencyFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'generated-report-consistency.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ authority: 'diagnostic', findings }, null, 2), 'utf8')
  return {
    name: 'generated-report-consistency',
    command: 'diagnose generated claims against deterministic gate reports',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet: findings.length === 0
      ? 'Generated report consistency diagnostic passed.'
      : JSON.stringify(findings.slice(0, 40), null, 2),
  }
}

export async function findGeneratedReportConsistencyFindings(
  runOutputDir: string
): Promise<GeneratedReportConsistencyFinding[]> {
  const findings: GeneratedReportConsistencyFinding[] = []
  await addCdmUsageContradictions(runOutputDir, findings)
  await addRepairWriteContradictions(runOutputDir, findings)
  return findings
}

async function addCdmUsageContradictions(
  runOutputDir: string,
  findings: GeneratedReportConsistencyFinding[]
): Promise<void> {
  const generatedReportPath = resolve(runOutputDir, 'reports', 'cdm-class-usage-report.json')
  const deterministicReportPath = resolve(runOutputDir, 'build-reports', 'cdm-java-api-usage.json')
  if (!(await exists(generatedReportPath)) || !(await exists(deterministicReportPath))) return
  const generatedText = await readFile(generatedReportPath, 'utf8')
  const deterministicText = await readFile(deterministicReportPath, 'utf8')
  if (!/"forbiddenClassesUsed"\s*:\s*0/u.test(generatedText)) return
  if (!/"findings"\s*:\s*\[\s*\]/u.test(deterministicText)) {
    findings.push({
      artifact: 'reports/cdm-class-usage-report.json',
      claim: 'forbiddenClassesUsed is 0',
      contradictedBy: 'build-reports/cdm-java-api-usage.json contains curated-contract findings',
      severity: 'warning',
    })
  }
}

async function addRepairWriteContradictions(
  runOutputDir: string,
  findings: GeneratedReportConsistencyFinding[]
): Promise<void> {
  const repairLogPath = resolve(runOutputDir, 'agent-workspace', 'repair-log.md')
  const repairReportPath = resolve(runOutputDir, 'build-reports', 'repair-artifact-report.json')
  if (!(await exists(repairLogPath)) || !(await exists(repairReportPath))) return
  const repairLog = await readFile(repairLogPath, 'utf8')
  const repairReport = await readFile(repairReportPath, 'utf8')
  if (!/\b(?:patched|fixed|updated|rewrote)\b/iu.test(repairLog)) return
  if (/"generatedJavaWriteCount"\s*:\s*0/u.test(repairReport)) {
    findings.push({
      artifact: 'agent-workspace/repair-log.md',
      claim: 'repair prose claims files were patched',
      contradictedBy: 'build-reports/repair-artifact-report.json has generatedJavaWriteCount 0',
      severity: 'warning',
    })
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
