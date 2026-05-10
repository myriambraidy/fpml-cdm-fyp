import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { renderGateFailureClassification } from './gate-classification'
import { describeGateAuthority } from './gate-policy'
import { fence } from './markdown'
import type { GateResult, GeneratorRunConfig, ToolAuditEntry } from './types'

export async function writeToolAuditLog(
  config: GeneratorRunConfig,
  entries: ToolAuditEntry[]
): Promise<void> {
  const dir = resolve(config.runOutputDir, 'build-reports')
  await mkdir(dir, { recursive: true })
  await writeFile(resolve(dir, 'tool-audit-log.json'), JSON.stringify(entries, null, 2), 'utf8')
}

export async function writeFinalBuildReport(args: {
  config: GeneratorRunConfig
  gateResults: GateResult[]
  promoted: boolean
  markdown?: string
}): Promise<void> {
  const failed = args.gateResults.filter(gate => gate.status === 'failed')
  const authoritativeFailures = failed.filter(gate => describeGateAuthority(gate) !== 'diagnostic')
  const diagnosticFindings = failed.filter(gate => describeGateAuthority(gate) === 'diagnostic')
  const fallback = `# Final Build Report

Status: ${args.promoted ? 'promoted' : 'blocked'}
Run id: ${args.config.runId}
Product family: ${args.config.productFamily}

${renderGateFailureClassification(args.gateResults)}

## Gate Results

${args.gateResults
  .map(gate => `- ${gate.name}: ${gate.status} (${describeGateAuthority(gate)}, exit ${gate.exitCode})`)
  .join('\n')}

## Authoritative And Pipeline Failures

${authoritativeFailures.length === 0 ? '- none' : authoritativeFailures.map(gate => `### ${gate.name}\n\n${fence('text', gate.outputSnippet)}`).join('\n\n')}

## Diagnostic Findings

${diagnosticFindings.length === 0 ? '- none' : diagnosticFindings.map(gate => `### ${gate.name}\n\n${fence('text', gate.outputSnippet)}`).join('\n\n')}

## Failed Gate Details

${failed.length === 0 ? '- none' : failed.map(gate => `### ${gate.name}\n\n${fence('text', gate.outputSnippet)}`).join('\n\n')}
`
  await writeFile(
    resolve(args.config.runOutputDir, 'agent-workspace', 'final-build-report.md'),
    args.markdown ?? fallback,
    'utf8'
  )
}
