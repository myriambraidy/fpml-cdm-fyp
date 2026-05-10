import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import {
  ensureCdmJavaApiPack,
  lookupCdmJavaClassDetails,
  readCdmJavaApiIndex,
  type CdmJavaClassDetails,
} from './cdm-java-api-pack'
import { stripJavaCommentsAndLiterals } from './cdm-java-api-gate'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

export type CdmJavaMemberUsageFinding = {
  file: string
  line: number
  code: 'unknown_enum_constant' | 'unknown_nested_builder_type'
  className: string
  memberName: string
  message: string
}

export async function runCdmJavaMemberUsageGate(config: GeneratorRunConfig): Promise<GateResult> {
  await ensureCdmJavaApiPack()
  const findings = await findCdmJavaMemberUsageFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'cdm-java-member-usage.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ authority: 'diagnostic', findings }, null, 2), 'utf8')
  return {
    name: 'cdm-java-member-usage',
    command: 'scan generated Java against CDM Java member metadata',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet: findings.length === 0
      ? 'CDM Java member usage diagnostic passed.'
      : JSON.stringify(findings.slice(0, 60), null, 2),
  }
}

export async function findCdmJavaMemberUsageFindings(root: string): Promise<CdmJavaMemberUsageFinding[]> {
  const mainRoot = resolve(root, 'src/main/java')
  if (!(await exists(mainRoot))) return []
  const index = await readCdmJavaApiIndex()
  const indexedBySimpleName = new Map<string, string[]>()
  for (const entry of index.classes) {
    const existing = indexedBySimpleName.get(entry.simpleName) ?? []
    existing.push(entry.className)
    indexedBySimpleName.set(entry.simpleName, existing)
  }
  const files = (await listFilesRecursive(mainRoot)).filter(file => file.endsWith('.java'))
  const detailCache = new Map<string, CdmJavaClassDetails>()
  const findings: CdmJavaMemberUsageFinding[] = []
  for (const file of files) {
    const sourceText = await readFile(file, 'utf8')
    const importedClasses = collectImportedClasses(sourceText)
    findings.push(...await validateCdmJavaMembers({
      sourceText,
      displayPath: relative(root, file),
      importedClasses,
      indexedBySimpleName,
      detailCache,
    }))
  }
  return findings
}

export async function validateCdmJavaMembers(args: {
  sourceText: string
  displayPath: string
  importedClasses: Map<string, string>
  indexedBySimpleName: Map<string, string[]>
  detailCache?: Map<string, CdmJavaClassDetails>
}): Promise<CdmJavaMemberUsageFinding[]> {
  const detailCache = args.detailCache ?? new Map<string, CdmJavaClassDetails>()
  const stripped = stripJavaCommentsAndLiterals(args.sourceText)
  const findings: CdmJavaMemberUsageFinding[] = []

  for (const match of stripped.matchAll(/\b((?:[a-z_][A-Za-z0-9_]*\.)*[A-Z][A-Za-z0-9_]*Enum)\s*\.\s*([A-Z][A-Z0-9_]*)\b/gmu)) {
    const enumReference = match[1]
    const constantName = match[2]
    if (enumReference === undefined || constantName === undefined) continue
    const className = resolveClassReference(enumReference, args.importedClasses, args.indexedBySimpleName)
    if (className === null) continue
    const details = await classDetails(className, detailCache)
    if (details === null || details.enumValues === undefined || details.enumValues.includes(constantName)) continue
    findings.push({
      file: args.displayPath,
      line: lineForIndex(stripped, match.index),
      code: 'unknown_enum_constant',
      className,
      memberName: constantName,
      message: `${className}.${constantName} is not present in the compiled CDM Java jar. Available constants: ${details.enumValues.join(', ')}`,
    })
  }

  for (const match of stripped.matchAll(/\b((?:[a-z_][A-Za-z0-9_]*\.)*[A-Z][A-Za-z0-9_]*)\.Builder\b/gmu)) {
    const classReference = match[1]
    if (classReference === undefined) continue
    const className = resolveClassReference(classReference, args.importedClasses, args.indexedBySimpleName)
    if (className === null) continue
    const details = await classDetails(className, detailCache)
    if (details === null) continue
    findings.push({
      file: args.displayPath,
      line: lineForIndex(stripped, match.index),
      code: 'unknown_nested_builder_type',
      className,
      memberName: `${classReference}.Builder`,
      message: details.builderClassName === undefined
        ? `${className} has no builder class in compiled CDM Java details.`
        : `Use ${details.builderClassName.replace('$', '.')} or avoid declaring the builder type; ${classReference}.Builder is not valid.`,
    })
  }

  return findings
}

function resolveClassReference(
  classReference: string,
  importedClasses: Map<string, string>,
  indexedBySimpleName: Map<string, string[]>
): string | null {
  if (classReference.includes('.')) return classReference
  return resolveSimpleClassName(classReference, importedClasses, indexedBySimpleName)
}

export function collectImportedClasses(sourceText: string): Map<string, string> {
  const imports = new Map<string, string>()
  const stripped = stripJavaCommentsAndLiterals(sourceText)
  for (const match of stripped.matchAll(/^\s*import\s+((?:cdm|com\.rosetta)\.[A-Za-z0-9_.$]+);/gmu)) {
    const className = match[1]
    if (className === undefined) continue
    const simpleName = className.split('.').at(-1)
    if (simpleName !== undefined) imports.set(simpleName, className)
  }
  return imports
}

function resolveSimpleClassName(
  simpleName: string,
  importedClasses: Map<string, string>,
  indexedBySimpleName: Map<string, string[]>
): string | null {
  const imported = importedClasses.get(simpleName)
  if (imported !== undefined) return imported
  const indexed = indexedBySimpleName.get(simpleName) ?? []
  return indexed.length === 1 ? indexed[0] ?? null : null
}

async function classDetails(
  className: string,
  cache: Map<string, CdmJavaClassDetails>
): Promise<CdmJavaClassDetails | null> {
  const cached = cache.get(className)
  if (cached !== undefined) return cached
  const lookup = await lookupCdmJavaClassDetails(className)
  if (lookup.status === 'missing') return null
  cache.set(className, lookup.details)
  return lookup.details
}

function lineForIndex(text: string, index: number | undefined): number {
  if (index === undefined) return 1
  return text.slice(0, index).split(/\r?\n/u).length
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
