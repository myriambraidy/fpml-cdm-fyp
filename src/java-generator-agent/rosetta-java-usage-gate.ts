import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { findBuilderReadinessUsageFindings } from './builder-readiness-usage'
import { findCdmJavaMemberUsageFindings } from './cdm-java-member-usage'
import { stripJavaCommentsAndLiterals } from './cdm-java-api-gate'
import { GENERATED_IMPL_SOURCE_ROOT } from './java-contract'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

export type RosettaJavaUsageFinding = {
  file: string
  line: number
  code:
    | 'main_output_not_cdm_model'
    | 'missing_trade_state_root'
    | 'jackson_tree_as_cdm_model'
    | 'unknown_cdm_enum_constant'
    | 'unknown_cdm_builder_member'
    | 'parameter_only_builder_usage'
    | 'runtime_validator_call'
    | 'mixed_report_and_cdm_output'
  severity: 'error' | 'warning'
  message: string
}

export async function runRosettaJavaUsageGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findRosettaJavaUsageFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'rosetta-java-usage.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({
    authority: 'pre-maven-diagnostic',
    finalSemanticAuthority: 'post-runtime rosetta-validation gates using RosettaTypeValidator',
    findings,
  }, null, 2), 'utf8')
  const errors = findings.filter(finding => finding.severity === 'error')
  return {
    name: 'rosetta-java-usage',
    command: 'diagnose generated Java for valid CDM/Rosetta package usage before Maven',
    status: errors.length === 0 ? 'passed' : 'failed',
    exitCode: errors.length === 0 ? 0 : 1,
    outputSnippet: errors.length === 0
      ? 'Pre-Maven Rosetta/CDM Java usage diagnostic passed.'
      : JSON.stringify(errors.slice(0, 60), null, 2),
  }
}

export async function findRosettaJavaUsageFindings(runOutputDir: string): Promise<RosettaJavaUsageFinding[]> {
  const sourceRoot = resolve(runOutputDir, GENERATED_IMPL_SOURCE_ROOT)
  if (!(await exists(sourceRoot))) return []
  const findings: RosettaJavaUsageFinding[] = []
  const files = (await listFilesRecursive(sourceRoot)).filter(file => file.endsWith('.java'))
  for (const file of files) {
    const sourceText = await readFile(file, 'utf8')
    findings.push(...findRosettaJavaUsageFindingsInSource({
      sourceText,
      displayPath: relative(runOutputDir, file),
      isEntryClass: file.replace(/\\/g, '/').endsWith('/GeneratedFpmlToCdmMapper.java'),
    }))
  }
  for (const finding of await findCdmJavaMemberUsageFindings(runOutputDir)) {
    findings.push({
      file: finding.file,
      line: finding.line,
      code: finding.code === 'unknown_enum_constant' ? 'unknown_cdm_enum_constant' : 'unknown_cdm_builder_member',
      severity: 'error',
      message: finding.message,
    })
  }
  for (const finding of await findBuilderReadinessUsageFindings(runOutputDir)) {
    findings.push({
      file: finding.file,
      line: finding.line,
      code: 'parameter_only_builder_usage',
      severity: 'error',
      message: finding.message,
    })
  }
  return findings
}

export function findRosettaJavaUsageFindingsInSource(args: {
  sourceText: string
  displayPath: string
  isEntryClass: boolean
}): RosettaJavaUsageFinding[] {
  const stripped = stripJavaCommentsAndLiterals(args.sourceText)
  const findings: RosettaJavaUsageFinding[] = []
  if (/\bObjectNode\b|\bArrayNode\b/u.test(stripped)) {
    findings.push({
      file: args.displayPath,
      line: firstMatchingLine(stripped, /\bObjectNode\b|\bArrayNode\b/u),
      code: 'jackson_tree_as_cdm_model',
      severity: 'error',
      message: 'Generated runtime must use CDM/Rosetta model objects as the main representation, not Jackson tree nodes.',
    })
  }
  if (/\bRosettaValidatorCli\b|\bRosettaTypeValidator\b|\bReferenceResolverProcessStep\b/u.test(stripped)) {
    findings.push({
      file: args.displayPath,
      line: firstMatchingLine(stripped, /\bRosettaValidatorCli\b|\bRosettaTypeValidator\b|\bReferenceResolverProcessStep\b/u),
      code: 'runtime_validator_call',
      severity: 'error',
      message: 'Generated mapper runtime must not call the repo Rosetta validator; validation is a post-runtime gate.',
    })
  }
  if (args.isEntryClass) {
    if (!hasTradeStateBoundary(stripped)) {
      const hasStructuredJsonBoundary = hasStructuredTradeStateJsonBoundary(args.sourceText, stripped)
      findings.push({
        file: args.displayPath,
        line: 1,
        code: 'missing_trade_state_root',
        severity: hasStructuredJsonBoundary ? 'warning' : 'error',
        message: hasStructuredJsonBoundary
          ? 'Generated entry mapper builds a structured TradeState-shaped JSON boundary; post-runtime Rosetta validation remains the semantic authority.'
          : 'Generated entry mapper should build a TradeState root for post-runtime Rosetta validation.',
      })
    }
    if (!/\bpublic\s+String\s+mapFile\s*\(/u.test(stripped)) {
      findings.push({
        file: args.displayPath,
        line: firstMatchingLine(stripped, /\bmapFile\s*\(/u),
        code: 'main_output_not_cdm_model',
        severity: 'error',
        message: 'Generated entry mapper must expose String mapFile(Path, Path) and serialize CDM model output at the boundary.',
      })
    }
  }
  if (/\breturn\s+["']\s*\{/u.test(stripped) && /\bmapFile\s*\(/u.test(stripped)) {
    findings.push({
      file: args.displayPath,
      line: firstMatchingLine(stripped, /\breturn\s+["']\s*\{/u),
      code: 'mixed_report_and_cdm_output',
      severity: 'warning',
      message: 'mapFile appears to return literal JSON; main output should be serialized CDM JSON and reports should stay in reportsDir.',
    })
  }
  return findings
}

function hasTradeStateBoundary(sourceText: string): boolean {
  if (!/\bTradeState\b/u.test(sourceText)) return false
  return /\bTradeState\s*\.\s*builder\s*\(/u.test(sourceText)
    || /\bTradeState\s+[a-z][A-Za-z0-9_]*\b/u.test(sourceText)
    || /\bTradeState\s+[a-z][A-Za-z0-9_]*\s*\(/u.test(sourceText)
}

function hasStructuredTradeStateJsonBoundary(sourceText: string, strippedSourceText: string): boolean {
  return /\bmapTradeState\s*\(/u.test(strippedSourceText)
    && /\.put\s*\(\s*"trade"\s*,/u.test(sourceText)
    && /\bObjectMapper\b/u.test(strippedSourceText)
    && /\bwriteValueAsString\s*\(/u.test(strippedSourceText)
}

function firstMatchingLine(text: string, pattern: RegExp): number {
  const lines = text.split(/\r?\n/u)
  const index = lines.findIndex(line => pattern.test(line))
  return index === -1 ? 1 : index + 1
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
