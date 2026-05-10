import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import {
  approvedCdmApiContractExists,
  approvedCdmApiContractJsonPath,
  readApprovedCdmApiContract,
} from './approved-cdm-api-contract'
import {
  ensureCdmJavaApiPack,
  readCdmJavaApiIndex,
  readCdmJavaMissingClassObservations,
} from './cdm-java-api-pack'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

export type CdmJavaApiUsageFinding = {
  file: string
  line: number
  code: string
  message: string
}

export type CdmJavaReference = {
  className: string
  line: number
  kind: 'import' | 'fully-qualified-reference'
}

export async function runCdmJavaApiUsageGate(config: GeneratorRunConfig): Promise<GateResult> {
  await ensureCdmJavaApiPack()
  const findings = await findCdmJavaApiUsageFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'cdm-java-api-usage.json')
  const computedReportPath = resolve(config.runOutputDir, 'build-reports', 'computed-cdm-class-usage.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ authority: 'diagnostic', findings }, null, 2), 'utf8')
  await writeFile(computedReportPath, JSON.stringify(buildComputedClassUsageReport(findings), null, 2), 'utf8')

  return {
    name: 'cdm-java-api-usage',
    command: 'scan generated Java against CDM Java API pack',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet:
      findings.length === 0
        ? 'Curated-contract diagnostic passed: generated Java uses only allowed CDM Java API pack imports.'
        : JSON.stringify(findings.slice(0, 60), null, 2),
  }
}

function buildComputedClassUsageReport(findings: CdmJavaApiUsageFinding[]): {
  authority: 'diagnostic'
  reportKind: 'curated_contract_compliance'
  unapprovedReferences: CdmJavaApiUsageFinding[]
  forbiddenReferences: CdmJavaApiUsageFinding[]
  missingReferences: CdmJavaApiUsageFinding[]
  inventedFpmlReferences: CdmJavaApiUsageFinding[]
} {
  return {
    authority: 'diagnostic',
    reportKind: 'curated_contract_compliance',
    unapprovedReferences: findings.filter(finding =>
      finding.code === 'cdm_import_not_in_prompt_seed' || finding.code === 'cdm_import_not_in_approved_contract'
    ),
    forbiddenReferences: findings.filter(finding => finding.code === 'forbidden_cdm_class_reference'),
    missingReferences: findings.filter(finding => finding.code === 'exact_missing_cdm_class_reference'),
    inventedFpmlReferences: findings.filter(finding => finding.code === 'invented_fpml_model_reference'),
  }
}

export async function findCdmJavaApiUsageFindings(root: string): Promise<CdmJavaApiUsageFinding[]> {
  const mainRoot = resolve(root, 'src/main/java')
  if (!(await exists(mainRoot))) return []
  const index = await readCdmJavaApiIndex()
  const missingObservations = await readCdmJavaMissingClassObservations()
  const contractPath = approvedCdmApiContractJsonPath(root)
  const contract = await approvedCdmApiContractExists(contractPath)
    ? await readApprovedCdmApiContract(contractPath)
    : null
  const approvedClasses = contract === null
    ? new Set(index.promptSeedClasses)
    : new Set(contract.approvedClasses.map(item => item.className))
  const forbiddenClasses = contract === null
    ? new Set<string>()
    : new Set(contract.forbiddenClasses.map(item => item.className))
  const exactMissingClasses = new Set(missingObservations.map(item => item.className))
  const indexedClassNames = new Set(index.classes.map(entry => entry.className))
  const javaFiles = (await listFilesRecursive(mainRoot)).filter(file => file.endsWith('.java'))
  const declaredFpmlTypes = await collectDeclaredFpmlTypes(javaFiles)
  const findings: CdmJavaApiUsageFinding[] = []

  for (const file of javaFiles) {
    const text = await readFile(file, 'utf8')
    const lines = text.split(/\r?\n/u)
    const displayPath = relative(root, file)
    for (const reference of extractCdmJavaReferences({ sourceText: text, indexedClassNames })) {
      if (forbiddenClasses.has(reference.className)) {
        findings.push({
          file: displayPath,
          line: reference.line,
          code: 'forbidden_cdm_class_reference',
          message: `CDM/Rosetta ${reference.kind} is forbidden by approved API contract: ${reference.className}`,
        })
      } else if (!approvedClasses.has(reference.className)) {
        findings.push({
          file: displayPath,
          line: reference.line,
          code: contract === null ? 'cdm_import_not_in_prompt_seed' : 'cdm_import_not_in_approved_contract',
          message: contract === null
            ? `CDM/Rosetta ${reference.kind} is outside the prompt seed compatibility policy: ${reference.className}`
            : `CDM/Rosetta ${reference.kind} is outside approved-cdm-api-contract.json: ${reference.className}`,
        })
      }
    }
    for (const className of exactMissingClasses) {
      if (!text.includes(className)) continue
      findings.push({
        file: displayPath,
        line: firstMatchingLine(lines, className),
        code: 'exact_missing_cdm_class_reference',
        message: `Generated Java references an exact CDM Java class that was not found in the compiled jar: ${className}`,
      })
    }
    for (const match of text.matchAll(/\bFpml[A-Z][A-Za-z0-9_]*\b/gmu)) {
      const className = match[0]
      if (declaredFpmlTypes.has(className)) continue
      findings.push({
        file: displayPath,
        line: lineForIndex(text, match.index),
        code: 'invented_fpml_model_reference',
        message: `Generated Java references an FpML model class (${className}); use DOM/StAX or generated internal DTOs.`,
      })
    }
  }

  return findings
}

async function collectDeclaredFpmlTypes(javaFiles: string[]): Promise<Set<string>> {
  const names = new Set<string>()
  for (const file of javaFiles) {
    const text = await readFile(file, 'utf8')
    for (const match of text.matchAll(/\b(?:class|interface|enum|record)\s+(Fpml[A-Z][A-Za-z0-9_]*)\b/gmu)) {
      const name = match[1]
      if (name !== undefined) names.add(name)
    }
  }
  return names
}

export function validateCdmImports(args: {
  sourceText: string
  promptSeedClasses?: Set<string>
  approvedClasses?: Set<string>
  forbiddenClasses?: Set<string>
  indexedClasses?: Set<string>
  exactMissingClasses: Set<string>
}): string[] {
  const findings: string[] = []
  const approvedClasses = args.approvedClasses ?? args.promptSeedClasses ?? new Set<string>()
  const forbiddenClasses = args.forbiddenClasses ?? new Set<string>()
  const indexedClasses = args.indexedClasses ?? new Set([
    ...approvedClasses,
    ...forbiddenClasses,
    ...args.exactMissingClasses,
  ])
  for (const reference of extractCdmJavaReferences({ sourceText: args.sourceText, indexedClassNames: indexedClasses })) {
    if (forbiddenClasses.has(reference.className)) {
      findings.push(`CDM/Rosetta ${reference.kind} is forbidden by approved API contract: ${reference.className}`)
    } else if (!approvedClasses.has(reference.className)) {
      findings.push(`CDM/Rosetta ${reference.kind} is outside approved API contract: ${reference.className}`)
    }
  }
  for (const className of args.exactMissingClasses) {
    if (args.sourceText.includes(className)) {
      findings.push(`Generated Java references exact missing CDM class: ${className}`)
    }
  }
  if (/\bFpml[A-Z][A-Za-z0-9_]*\b/u.test(args.sourceText)) {
    findings.push('Generated Java references an FpML model class; use XML parser DTOs instead.')
  }
  return findings
}

export function extractCdmJavaReferences(args: {
  sourceText: string
  indexedClassNames: Set<string>
}): CdmJavaReference[] {
  const references: CdmJavaReference[] = []
  const stripped = stripJavaCommentsAndLiterals(args.sourceText)
  for (const match of stripped.matchAll(/^\s*import\s+((?:cdm|com\.rosetta)\.[A-Za-z0-9_.$]+);/gmu)) {
    const token = match[1]
    if (token === undefined) continue
    const className = normalizePotentialClassReference({ token, indexedClassNames: args.indexedClassNames })
    if (className === null) continue
    references.push({
      className,
      line: lineForIndex(stripped, match.index),
      kind: 'import',
    })
  }
  for (const match of stripped.matchAll(/\b((?:cdm|com\.rosetta)\.[A-Za-z0-9_.$]+)\b/gmu)) {
    const token = match[1]
    if (token === undefined) continue
    const className = normalizePotentialClassReference({ token, indexedClassNames: args.indexedClassNames })
    if (className === null) continue
    references.push({
      className,
      line: lineForIndex(stripped, match.index),
      kind: 'fully-qualified-reference',
    })
  }
  return dedupeReferences(references)
}

export function normalizePotentialClassReference(args: {
  token: string
  indexedClassNames: Set<string>
}): string | null {
  const normalized = args.token.replace(/\$/g, '.')
  const parts = normalized.split('.')
  for (let end = parts.length; end >= 2; end -= 1) {
    const candidate = parts.slice(0, end).join('.')
    if (args.indexedClassNames.has(candidate)) return candidate
  }
  return null
}

export function stripJavaCommentsAndLiterals(sourceText: string): string {
  let output = ''
  let index = 0
  let mode: 'code' | 'line-comment' | 'block-comment' | 'string' | 'char' = 'code'

  while (index < sourceText.length) {
    const current = sourceText[index] ?? ''
    const next = sourceText[index + 1] ?? ''
    if (mode === 'code') {
      if (current === '/' && next === '/') {
        output += '  '
        index += 2
        mode = 'line-comment'
        continue
      }
      if (current === '/' && next === '*') {
        output += '  '
        index += 2
        mode = 'block-comment'
        continue
      }
      if (current === '"') {
        output += ' '
        index += 1
        mode = 'string'
        continue
      }
      if (current === "'") {
        output += ' '
        index += 1
        mode = 'char'
        continue
      }
      output += current
      index += 1
      continue
    }
    if (mode === 'line-comment') {
      output += current === '\n' ? '\n' : ' '
      index += 1
      if (current === '\n') mode = 'code'
      continue
    }
    if (mode === 'block-comment') {
      if (current === '*' && next === '/') {
        output += '  '
        index += 2
        mode = 'code'
        continue
      }
      output += current === '\n' ? '\n' : ' '
      index += 1
      continue
    }
    if (mode === 'string' || mode === 'char') {
      if (current === '\\') {
        output += ' '
        if (next !== '') output += next === '\n' ? '\n' : ' '
        index += 2
        continue
      }
      if ((mode === 'string' && current === '"') || (mode === 'char' && current === "'")) {
        output += ' '
        index += 1
        mode = 'code'
        continue
      }
      output += current === '\n' ? '\n' : ' '
      index += 1
      continue
    }
  }

  return output
}

function dedupeReferences(references: CdmJavaReference[]): CdmJavaReference[] {
  const seen = new Set<string>()
  const deduped: CdmJavaReference[] = []
  for (const reference of references) {
    const key = `${reference.kind}:${reference.className}:${reference.line}`
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(reference)
  }
  return deduped
}

function lineForIndex(text: string, index: number | undefined): number {
  if (index === undefined) return 1
  return text.slice(0, index).split(/\r?\n/u).length
}

function firstMatchingLine(lines: string[], text: string): number {
  const index = lines.findIndex(line => line.includes(text))
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
