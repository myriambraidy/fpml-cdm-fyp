import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { RepairMutationTarget } from './implementation-artifacts'
import type { GateResult, GeneratorRunConfig, ToolAuditEntry } from './types'

export type RepairTraceRow = {
  attempt: number
  drivingGates: string[]
  target: RepairMutationTarget
  status: string
  logPath: string
}

export async function writeRunTraceIndex(
  config: GeneratorRunConfig,
  rows: RepairTraceRow[]
): Promise<void> {
  const path = resolve(config.runOutputDir, 'build-reports', 'run-trace-index.md')
  await mkdir(dirname(path), { recursive: true })
  const lines = [
    '# Run Trace Index',
    '',
    `Run id: ${config.runId}`,
    '',
    '## Start Here',
    '',
    '- Final build report: agent-workspace/final-build-report.md',
    '- Canonical events: build-reports/run-events.jsonl',
    '- Tool audit: build-reports/tool-audit-log.json',
    '- Stage manifest: build-reports/stage-manifest.json',
    '',
    '## Repair Attempts',
    '',
    '| Attempt | Driving gates | Target | Status | Log |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(
      row =>
        `| ${row.attempt} | ${row.drivingGates.join(', ')} | ${row.target} | ${row.status} | ${row.logPath} |`
    ),
    '',
  ]
  await writeFile(path, lines.join('\n'), 'utf8')
}

export function renderAgentLoopSummary(args: {
  audit: ToolAuditEntry[]
  gateResults: GateResult[]
}): string {
  const writes = args.audit.filter(entry => entry.ok !== false && entry.tool.startsWith('write'))
  const failedWrites = args.audit.filter(entry => entry.ok === false && entry.tool.startsWith('write'))
  const failedGateNames = args.gateResults.filter(gate => gate.status === 'failed').map(gate => gate.name)
  return [
    '## Agent Loop Summary',
    '',
    `- successful write tool calls: ${writes.length}`,
    `- failed write tool calls: ${failedWrites.length}`,
    `- final failed gates: ${failedGateNames.length === 0 ? 'none' : failedGateNames.join(', ')}`,
    '',
    '## Evidence Links',
    '',
    '- run events: build-reports/run-events.jsonl',
    '- tool audit: build-reports/tool-audit-log.json',
    '',
  ].join('\n')
}
