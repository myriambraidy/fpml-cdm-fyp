import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { detectPseudoToolCalls, type PseudoToolCallFinding } from './pseudo-tool-calls'
import {
  generatedEntryClassPath,
  validateGeneratedImplementationContract,
  type GeneratedImplementationContractReport,
} from './generated-implementation-contract'
import type { GateResult, GeneratorRunConfig, GeneratorRole, ToolAuditEntry } from './types'

export type ImplementationArtifactReport = {
  status: 'passed' | 'failed'
  role: Extract<GeneratorRole, 'implementer' | 'repair'>
  reportPath: string
  classifications: string[]
  toolWriteCount: number
  generatedJavaWriteCount: number
  successfulWriteTools: string[]
  failedWriteTools: string[]
  pseudoToolCalls: PseudoToolCallFinding[]
  contract: GeneratedImplementationContractReport
  findings: string[]
}

export async function validateImplementationArtifacts(args: {
  config: GeneratorRunConfig
  role: Extract<GeneratorRole, 'implementer' | 'repair'>
  roleOutput: string
  auditEntries: ToolAuditEntry[]
  policyFailures?: string[]
}): Promise<ImplementationArtifactReport> {
  const successfulWriteTools = args.auditEntries
    .filter(entry => entry.ok !== false && isWriteTool(entry.tool))
    .map(entry => entry.tool)
  const failedWriteTools = args.auditEntries
    .filter(entry => entry.ok === false && isWriteTool(entry.tool))
    .map(entry => entry.tool)
  const pseudoToolCalls = detectPseudoToolCalls(args.roleOutput)
  const fallbackFinding = await ensureFallbackIfMissing(args.config, args.role)
  const contract = await validateGeneratedImplementationContract(args.config)
  const generatedJavaWriteCount = successfulWriteTools
    .filter(tool => tool === 'write_generated_java' || tool === 'write_generated_java_file')
    .length
  const findings: string[] = []
  const classifications: string[] = []

  if (args.role === 'implementer' && successfulWriteTools.length === 0) {
    findings.push('Implementer completed without executing any successful write tool.')
    classifications.push('no_write_tool_calls')
  }
  if (args.role === 'implementer' && generatedJavaWriteCount === 0) {
    findings.push('Implementer completed without executing write_generated_java_file.')
    classifications.push('write_phase_no_write_tool_calls')
  }
  if (pseudoToolCalls.length > 0) {
    findings.push(
      `Role output contains pseudo tool call text instead of provider-native tool calls: ${
        pseudoToolCalls.map(call => call.toolName).join(', ')
      }.`
    )
    classifications.push('pseudo_tool_call_output')
  }
  const policyFailures = args.policyFailures ?? []
  for (const failure of policyFailures) {
    findings.push(`Tool call policy failed: ${failure}.`)
    classifications.push(failure)
  }
  for (const entry of args.auditEntries.filter(item => item.ok === false && isWriteTool(item.tool))) {
    classifications.push(classifyFailedWrite(entry))
  }
  if (fallbackFinding !== null) findings.push(fallbackFinding)
  if (fallbackFinding !== null) classifications.push('missing_required_entry_class')
  for (const finding of contract.findings) {
    findings.push(finding)
    classifications.push('missing_required_entry_class')
  }

  const reportPath = implementationArtifactReportPath(args.config, args.role)
  const report: ImplementationArtifactReport = {
    status: findings.length === 0 ? 'passed' : 'failed',
    role: args.role,
    reportPath,
    classifications: uniqueStrings(classifications),
    toolWriteCount: successfulWriteTools.length,
    generatedJavaWriteCount,
    successfulWriteTools,
    failedWriteTools,
    pseudoToolCalls,
    contract,
    findings,
  }
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, renderImplementationArtifactReport(report), 'utf8')
  await writeFile(reportPath.replace(/\.md$/u, '.json'), JSON.stringify(report, null, 2), 'utf8')
  return report
}

export function implementationArtifactGateResult(report: ImplementationArtifactReport): GateResult {
  return {
    name: 'implementation-artifacts',
    command: 'validate implementer write tools and generated Java entrypoint',
    status: report.status,
    exitCode: report.status === 'passed' ? 0 : 1,
    outputSnippet:
      report.status === 'passed'
        ? `Implementation artifacts passed. Report: ${report.reportPath}`
        : report.findings.join('\n'),
  }
}

function renderImplementationArtifactReport(report: ImplementationArtifactReport): string {
  return `# Implementation Artifact Report

Status: ${report.status}
Role: ${report.role}

## Write Tools

- successful writes: ${report.toolWriteCount}
- generated Java writes: ${report.generatedJavaWriteCount}
- failed write calls: ${report.failedWriteTools.length}

## Classifications

${report.classifications.length === 0 ? '- none' : report.classifications.map(classification => `- ${classification}`).join('\n')}

## Generated Contract

- entry class: ${report.contract.entryClassPath}
- status: ${report.contract.status}

## Findings

${report.findings.length === 0 ? '- none' : report.findings.map(finding => `- ${finding}`).join('\n')}

## Pseudo Tool Calls

${report.pseudoToolCalls.length === 0 ? '- none' : report.pseudoToolCalls.map(call => `- ${call.category}: ${call.toolName}: ${call.excerpt}`).join('\n')}
`
}

function implementationArtifactReportPath(
  config: GeneratorRunConfig,
  role: Extract<GeneratorRole, 'implementer' | 'repair'>
): string {
  return resolve(config.runOutputDir, 'build-reports', `${role}-artifact-report.md`)
}

function isWriteTool(tool: string): boolean {
  return tool === 'write_file' || tool === 'write_generated_java' || tool === 'write_generated_java_file'
}

function classifyFailedWrite(entry: ToolAuditEntry): string {
  const output = entry.outputSummary.toLowerCase()
  if (output.includes('path') || output.includes('write_generated_java_file can only write under')) {
    return 'write_tool_failed_path'
  }
  if (output.includes('package')) return 'write_tool_failed_package'
  if (output.includes('class')) return 'write_tool_failed_class'
  return 'write_tool_failed'
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)]
}

async function ensureFallbackIfMissing(
  config: GeneratorRunConfig,
  role: Extract<GeneratorRole, 'implementer' | 'repair'>
): Promise<string | null> {
  if (role !== 'implementer') return null
  const path = generatedEntryClassPath(config)
  if (await exists(path)) return null
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, renderMinimalGeneratedMapper(), 'utf8')
  return 'Inserted minimal GeneratedFpmlToCdmMapper fallback because the implementer did not create the required entry class; the run remains blocked.'
}

function renderMinimalGeneratedMapper(): string {
  return `package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Files;
import java.nio.file.Path;

public final class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        Files.createDirectories(reportsDir);
        Files.writeString(reportsDir.resolve("unsupported-scope.json"), "{\\"status\\":\\"blocked\\",\\"reason\\":\\"Generated mapper fallback inserted because implementation files were not written.\\"}");
        return "{}";
    }
}
`
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
