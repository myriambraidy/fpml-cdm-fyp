import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { GateResult, GeneratorRunConfig, ToolAuditEntry } from './types'

function isWriteTool(tool: string): boolean {
  return tool === 'write_file' || tool === 'write_generated_java' || tool === 'write_generated_java_file'
}

export async function runLogConsistencyGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings: string[] = []
  const eventsPath = resolve(config.runOutputDir, 'build-reports', 'run-events.jsonl')
  const auditPath = resolve(config.runOutputDir, 'build-reports', 'tool-audit-log.json')
  const workspaceDir = resolve(config.runOutputDir, 'agent-workspace')

  let eventsRaw: string
  try {
    eventsRaw = await readFile(eventsPath, 'utf8')
  } catch {
    findings.push('Missing build-reports/run-events.jsonl')
    eventsRaw = ''
  }

  if (eventsRaw.length > 0) {
    const lines = eventsRaw.trim().split(/\r?\n/u).filter(line => line.length > 0)
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i]
      if (line === undefined) continue
      try {
        const parsed = JSON.parse(line) as {
          schemaVersion?: number
          eventId?: string
          sequence?: number
        }
        if (parsed.schemaVersion !== 1) findings.push(`run-events.jsonl line ${i + 1}: schemaVersion must be 1`)
        if (typeof parsed.eventId !== 'string') findings.push(`run-events.jsonl line ${i + 1}: missing eventId`)
        if (typeof parsed.sequence !== 'number') findings.push(`run-events.jsonl line ${i + 1}: missing sequence`)
      } catch {
        findings.push(`run-events.jsonl line ${i + 1}: invalid JSON`)
      }
    }
  }

  let auditEntries: ToolAuditEntry[] = []
  try {
    auditEntries = JSON.parse(await readFile(auditPath, 'utf8')) as ToolAuditEntry[]
  } catch {
    findings.push('Missing build-reports/tool-audit-log.json')
  }

  for (let i = 0; i < auditEntries.length; i += 1) {
    const entry = auditEntries[i]
    if (typeof entry.sequence !== 'number') findings.push(`tool-audit entry ${i}: missing sequence`)
    if (typeof entry.timestamp !== 'string') findings.push(`tool-audit entry ${i}: missing timestamp`)
    if (typeof entry.role !== 'string') findings.push(`tool-audit entry ${i}: missing role`)
    if (entry.ok === false && isWriteTool(entry.tool) && entry.failureKind === undefined) {
      findings.push(`tool-audit entry ${i}: failed write missing failureKind`)
    }
  }

  let workspaceFiles: string[] = []
  try {
    workspaceFiles = await readdir(workspaceDir)
  } catch {
    workspaceFiles = []
  }

  const attemptNums = new Set<number>()
  for (const name of workspaceFiles) {
    const m = /^repair-attempt-(\d+)\.md$/u.exec(name)
    if (m?.[1] !== undefined) attemptNums.add(Number.parseInt(m[1], 10))
  }

  let repairLogText = ''
  try {
    repairLogText = await readFile(resolve(workspaceDir, 'repair-log.md'), 'utf8')
  } catch {
    findings.push('Missing agent-workspace/repair-log.md')
  }

  for (const n of [...attemptNums].sort((a, b) => a - b)) {
    const pad = String(n).padStart(2, '0')
    const attemptLog = `repair-attempt-${pad}.md`
    if (!workspaceFiles.includes(attemptLog)) {
      findings.push(`Missing agent-workspace/${attemptLog}`)
    }
    if (!repairLogText.includes(attemptLog)) {
      findings.push(`repair-log.md must link to ${attemptLog}`)
    }
    const artJson = resolve(config.runOutputDir, 'build-reports', `repair-artifact-report-attempt-${pad}.json`)
    try {
      await readFile(artJson, 'utf8')
    } catch {
      findings.push(`Missing build-reports/repair-artifact-report-attempt-${pad}.json`)
    }
    const failedGates = resolve(config.runOutputDir, 'build-reports', `failed-gates-attempt-${n}.json`)
    try {
      await readFile(failedGates, 'utf8')
    } catch {
      findings.push(`Missing build-reports/failed-gates-attempt-${n}.json`)
    }
    const failureClass = resolve(config.runOutputDir, 'build-reports', `failure-classification-attempt-${n}.md`)
    try {
      await readFile(failureClass, 'utf8')
    } catch {
      findings.push(`Missing build-reports/failure-classification-attempt-${n}.md`)
    }
  }

  return {
    name: 'log-consistency',
    command: 'check run trace completeness',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet: findings.length === 0 ? 'Run trace consistency passed.' : findings.join('\n'),
    authority: 'diagnostic',
  }
}
