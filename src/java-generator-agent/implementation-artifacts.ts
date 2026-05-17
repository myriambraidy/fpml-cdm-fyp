import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { describeGateAuthority } from './gate-policy'
import { detectPseudoToolCalls, type PseudoToolCallFinding } from './pseudo-tool-calls'
import { listFilesRecursive } from './file-list'
import {
  generatedEntryClassPath,
  validateGeneratedImplementationContract,
  type GeneratedImplementationContractReport,
} from './generated-implementation-contract'
import type { GateResult, GeneratorRunConfig, GeneratorRole, ToolAuditEntry, ToolExecutionState } from './types'

export type ImplementationArtifactReport = {
  schemaVersion: 1
  status: 'passed' | 'failed'
  role: Extract<GeneratorRole, 'implementer' | 'repair'>
  reportPath: string
  attempt?: number
  classifications: string[]
  toolWriteCount: number
  generatedJavaWriteCount: number
  successfulWriteTools: string[]
  failedWriteTools: string[]
  pseudoToolCalls: PseudoToolCallFinding[]
  contract: GeneratedImplementationContractReport
  findings: string[]
}

export type RepairMutationTarget = 'generated_java' | 'test_java' | 'pom' | 'reports' | 'unknown' | 'none'

export type RepairWriteRequirement = {
  required: boolean
  target: RepairMutationTarget
  reason: string
  requiredToolNames: string[]
  allowedWritePaths: string[]
  drivingGates: string[]
}

const SOURCE_REPAIR_GATES = new Set([
  'generated-java-static-sanity',
  'cdm-java-api-usage',
  'cdm-java-member-usage',
  'rosetta-java-usage',
  'java-reference-check',
  'generated-test-shell-contract',
  'builder-readiness-usage',
  'maven-compile',
  'maven-test-compile',
])

const GENERATED_JAVA_GLOB = 'src/main/java/com/fpml/cdm/fx/mapper/generated/**'

function authorityRank(authority: string): number {
  if (authority === 'pipeline_integrity') return 0
  if (authority === 'authoritative') return 1
  return 2
}

function gateHasJarSignatureSignal(gate: GateResult): boolean {
  const t = gate.outputSnippet.toLowerCase()
  if (t.includes('invalid signature file digest')) return true
  if (t.includes('securityexception')) return true
  if (t.includes('meta-inf') && (t.includes('.sf') || t.includes('manifest'))) return true
  return false
}

function gateHasPomRepairSignal(gate: GateResult): boolean {
  if (gate.name === 'generated-shell-contract') return /pom\.xml|maven\.compiler\.release|artifactId|dependency/iu.test(gate.outputSnippet)
  if (gate.name === 'maven-dependency-preflight') return true
  return gateHasJarSignatureSignal(gate)
}

function gateHasJavaRepairSignal(gate: GateResult): boolean {
  if (/\.java/iu.test(gate.outputSnippet)) return true
  return SOURCE_REPAIR_GATES.has(gate.name)
}

export function repairRequiresWrite(gateResults: GateResult[]): RepairWriteRequirement {
  const failed = gateResults.filter(gate => gate.status === 'failed')
  if (failed.length === 0) {
    return {
      required: false,
      target: 'none',
      reason: 'no_failed_gate',
      requiredToolNames: [],
      allowedWritePaths: [],
      drivingGates: [],
    }
  }

  const sorted = [...failed].sort((a, b) => {
    const diff = authorityRank(describeGateAuthority(a)) - authorityRank(describeGateAuthority(b))
    if (diff !== 0) return diff
    return gateResults.indexOf(a) - gateResults.indexOf(b)
  })

  const pomGates = failed.filter(gateHasPomRepairSignal).map(g => g.name)
  const javaGates = failed.filter(gateHasJavaRepairSignal).map(g => g.name)

  if (pomGates.length > 0) {
    return {
      required: true,
      target: 'pom',
      reason: `pom_or_build_contract_repair:${pomGates[0]}`,
      requiredToolNames: ['write_file'],
      allowedWritePaths: ['pom.xml'],
      drivingGates: pomGates,
    }
  }

  if (javaGates.length > 0) {
    const primary = sorted.find(g => javaGates.includes(g.name)) ?? sorted[0]
    return {
      required: true,
      target: 'generated_java',
      reason: `source_repair_gate:${primary.name}`,
      requiredToolNames: ['write_generated_java_file'],
      allowedWritePaths: [GENERATED_JAVA_GLOB],
      drivingGates: javaGates,
    }
  }

  const first = sorted[0]
  return {
    required: false,
    target: 'unknown',
    reason: `non_source_gate:${first.name}`,
    requiredToolNames: [],
    allowedWritePaths: [],
    drivingGates: failed.map(g => g.name),
  }
}

export function normalizeRunRelativePath(runOutputDir: string, path: string): string {
  const normalizedRoot = resolve(runOutputDir).replace(/\\/g, '/')
  const normalizedPath = resolve(path).replace(/\\/g, '/')
  if (normalizedPath.startsWith(`${normalizedRoot}/`)) {
    return normalizedPath.slice(normalizedRoot.length + 1)
  }
  return normalizedPath.replace(/\\/g, '/')
}

export async function validateImplementationArtifacts(args: {
  config: GeneratorRunConfig
  role: Extract<GeneratorRole, 'implementer' | 'repair'>
  attempt?: number
  roleOutput: string
  auditEntries: ToolAuditEntry[]
  policyFailures?: string[]
  repairWriteRequirement?: RepairWriteRequirement
  toolState?: ToolExecutionState
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

  const req = args.repairWriteRequirement
  if (args.role === 'repair' && req?.required === true) {
    const successfulRelPaths = args.auditEntries
      .filter(entry => entry.ok !== false && isWriteTool(entry.tool))
      .flatMap(entry => entry.sourcePaths)
      .map(path => normalizeRunRelativePath(args.config.runOutputDir, path))

    if (req.target === 'pom' && !successfulRelPaths.includes('pom.xml')) {
      findings.push(`Repair target was pom.xml, but no successful write tool wrote pom.xml: ${req.reason}.`)
      classifications.push('repair_required_target_not_written')
    }
    if (req.target === 'generated_java' && generatedJavaWriteCount === 0) {
      findings.push(
        `Repair target was generated Java, but no successful write_generated_java_file call occurred: ${req.reason}.`
      )
      classifications.push('repair_required_target_not_written')
    }
    if (successfulWriteTools.length === 0) {
      findings.push(`Repair required source changes but executed no successful write tool: ${req.reason}.`)
      classifications.push('repair_no_write_tool_calls')
    }
  }

  if (
    args.role === 'repair'
    && args.repairWriteRequirement?.required === true
    && asksUserForReadableGeneratedFiles(args.roleOutput)
  ) {
    findings.push('Repair asked the user to provide generated files that are readable inside the run workspace.')
    classifications.push('repair_asked_for_readable_generated_files')
  }
  if (args.role === 'implementer') {
    const claimedFindings = validateClaimedGeneratedFiles({
      roleOutput: args.roleOutput,
      auditEntries: args.auditEntries,
      runOutputDir: args.config.runOutputDir,
    })
    for (const finding of claimedFindings) {
      findings.push(finding)
      classifications.push('claimed_generated_file_not_written')
    }
  }
  if (args.toolState !== undefined) {
    const rejectedReferences = await findRejectedClassReferences(args.config, args.toolState)
    for (const reference of rejectedReferences) {
      findings.push(
        `Generated source references a class rejected by tool evidence: ${reference.className} in ${reference.file}:${reference.line}. ${reference.reason}`
      )
      classifications.push('tool_rejected_class_used_in_source')
    }
  }
  for (const entry of args.auditEntries.filter(item => item.ok === false && isWriteTool(item.tool))) {
    const classification = classifyFailedWrite(entry)
    classifications.push(classification)
    findings.push(`Write tool failed (${entry.tool}): ${entry.outputSummary}`)
  }
  if (fallbackFinding !== null) findings.push(fallbackFinding)
  if (fallbackFinding !== null) classifications.push('missing_required_entry_class')
  for (const finding of contract.findings) {
    findings.push(finding)
    classifications.push('missing_required_entry_class')
  }

  const reportPath = implementationArtifactReportPath(args.config, args.role, args.attempt)
  const report: ImplementationArtifactReport = {
    schemaVersion: 1,
    status: findings.length === 0 ? 'passed' : 'failed',
    role: args.role,
    reportPath,
    attempt: args.attempt,
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
  const jsonPath = reportPath.replace(/\.md$/u, '.json')
  await writeFile(jsonPath, JSON.stringify(report, null, 2), 'utf8')

  if (args.role === 'repair' && args.attempt !== undefined) {
    const attemptJson = `build-reports/repair-artifact-report-attempt-${String(args.attempt).padStart(2, '0')}.json`
    const latestPayload = {
      ...report,
      latestAttempt: args.attempt,
      attemptReportPath: attemptJson,
    }
    await writeFile(
      resolve(args.config.runOutputDir, 'build-reports', 'repair-artifact-report.json'),
      JSON.stringify(latestPayload, null, 2),
      'utf8'
    )
    await writeFile(
      resolve(args.config.runOutputDir, 'build-reports', 'repair-artifact-report.md'),
      renderImplementationArtifactReport(report),
      'utf8'
    )
  }

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
  role: Extract<GeneratorRole, 'implementer' | 'repair'>,
  attempt?: number
): string {
  if (role === 'repair' && attempt !== undefined) {
    return resolve(
      config.runOutputDir,
      'build-reports',
      `repair-artifact-report-attempt-${String(attempt).padStart(2, '0')}.md`
    )
  }
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

function asksUserForReadableGeneratedFiles(roleOutput: string): boolean {
  const normalized = roleOutput.replace(/\\/g, '/')
  return /please provide|provide full contents|once available/iu.test(normalized)
    && normalized.includes('src/main/java/com/fpml/cdm/fx/mapper/generated')
}

function validateClaimedGeneratedFiles(args: {
  roleOutput: string
  auditEntries: ToolAuditEntry[]
  runOutputDir: string
}): string[] {
  const claimed = extractClaimedGeneratedJavaFiles(args.roleOutput)
  if (claimed.length === 0) return []
  const written = new Set(
    args.auditEntries
      .filter(entry => entry.ok !== false && (entry.tool === 'write_generated_java' || entry.tool === 'write_generated_java_file'))
      .flatMap(entry => entry.sourcePaths)
      .map(path => normalizeRunRelativePath(args.runOutputDir, path))
  )
  return claimed
    .filter(path => !written.has(path))
    .map(path => `Implementation claimed generated Java file ${path}, but no successful write tool wrote that file.`)
}

function extractClaimedGeneratedJavaFiles(markdown: string): string[] {
  const files = new Set<string>()
  for (const line of markdown.split(/\r?\n/u)) {
    if (!lineLooksLikeCompletedGeneratedFileClaim(line)) continue
    for (const rawPath of extractGeneratedJavaPaths(line)) {
      files.add(normalizeGeneratedClaim(rawPath))
    }
  }
  return [...files]
}

function lineLooksLikeCompletedGeneratedFileClaim(line: string): boolean {
  return /\b(?:implemented|wrote|written|created|updated|added|fixed)\b/iu.test(line)
    && !/\b(?:plan|planned|will|would|should|need to|todo|manifest)\b/iu.test(line)
}

function extractGeneratedJavaPaths(line: string): string[] {
  const paths: string[] = []
  for (const match of line.matchAll(/`([^`]+\.java)`/gmu)) {
    const rawPath = match[1]
    if (rawPath !== undefined) paths.push(rawPath.replace(/\\/g, '/'))
  }
  for (const match of line.matchAll(/\b((?:src\/main\/java\/com\/fpml\/cdm\/fx\/mapper\/generated\/)?[A-Z][A-Za-z0-9_]*\.java)\b/gmu)) {
    const rawPath = match[1]
    if (rawPath !== undefined) paths.push(rawPath.replace(/\\/g, '/'))
  }
  return paths
    .filter(path => path.includes('/generated/') || /^[A-Z][A-Za-z0-9_]*\.java$/u.test(path))
}

function normalizeGeneratedClaim(path: string): string {
  const marker = 'src/main/java/com/fpml/cdm/fx/mapper/generated/'
  const index = path.indexOf(marker)
  return index === -1 ? path : path.slice(index)
}

type RejectedClassReference = {
  className: string
  file: string
  line: number
  reason: string
}

async function findRejectedClassReferences(
  config: GeneratorRunConfig,
  state: ToolExecutionState
): Promise<RejectedClassReference[]> {
  const root = resolve(config.runOutputDir, 'src/main/java')
  if (!(await exists(root))) return []
  const rejected = new Map<string, string>([
    ...state.rejectedCdmClasses.entries(),
    ...state.rejectedBuilderClasses.entries(),
  ])
  if (rejected.size === 0) return []
  const files = (await listFilesRecursive(root)).filter(file => file.endsWith('.java'))
  const references: RejectedClassReference[] = []
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    const lines = text.split(/\r?\n/u)
    for (const [className, reason] of rejected) {
      const lineIndex = lines.findIndex(line => line.includes(className))
      if (lineIndex === -1) continue
      references.push({
        className,
        file: file.slice(resolve(config.runOutputDir).length + 1).replace(/\\/g, '/'),
        line: lineIndex + 1,
        reason,
      })
    }
  }
  return references
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

import cdm.event.common.Trade;
import cdm.event.common.TradeState;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.Files;
import java.nio.file.Path;

public final class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        Files.createDirectories(reportsDir);
        Files.writeString(reportsDir.resolve("unsupported-scope.json"), "{\\"status\\":\\"blocked\\",\\"reason\\":\\"Generated mapper fallback inserted because implementation files were not written.\\"}");
        Trade trade = Trade.builder().build();
        TradeState tradeState = TradeState.builder().setTrade(trade).build();
        return objectMapper.writeValueAsString(tradeState);
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
