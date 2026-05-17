import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

type JavaStaticPattern = {
  code: string
  pattern: RegExp
  message: string
}

type JavaStaticSanityFinding = {
  file: string
  line: number
  code: string
  message: string
}

const forbiddenJavaPatterns: JavaStaticPattern[] = [
  {
    code: 'java_import_alias',
    pattern: /^\s*import\s+.+\s+as\s+.+;/u,
    message: 'Java does not support import aliases. Use one import and fully qualify the other class if needed.',
  },
  {
    code: 'wildcard_cdm_import',
    pattern: /^\s*import\s+(?:cdm|com\.rosetta)\..+\.\*;/u,
    message: 'Wildcard CDM/Rosetta imports are forbidden; import only approved contract classes.',
  },
  {
    code: 'escaped_quotes_in_java',
    pattern: /\\"/u,
    message: 'Java source contains escaped quote text instead of normal string literals.',
  },
  {
    code: 'invalid_replaceall_fragment',
    pattern: /replaceAll\.\*/u,
    message: 'Java source contains invalid generated replaceAll.* fragment.',
  },
  {
    code: 'missing_mapping_utils_reference',
    pattern: /mapper\.MappingUtils/u,
    message: 'Java source references non-existent mapper.MappingUtils.',
  },
  {
    code: 'test_helper_in_main_source',
    pattern: /MapperTest\./u,
    message: 'Main Java source references a test helper.',
  },
  {
    code: 'rosetta_function_class_reference',
    pattern: /MapFx[A-Za-z0-9_]+\.class/u,
    message: 'Generated Java references Rosetta function names as Java classes.',
  },
  {
    code: 'unsupported_report_reference',
    pattern: /UnsupportedReport/u,
    message: 'Generated Java references UnsupportedReport without generating it.',
  },
  {
    code: 'silent_null_return',
    pattern: /^\s*return\s+null\s*;/u,
    message: 'Generated mapper should report unsupported data or throw a clear exception instead of returning null.',
  },
  {
    code: 'manual_json_string_construction',
    pattern: /"\s*\{\s*\\?"/u,
    message: 'Generated Java appears to hand-build JSON strings; prefer structured serialization or report writers.',
  },
]

export async function runGeneratedJavaStaticSanityGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findGeneratedJavaStaticSanityFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'java-static-sanity.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ findings }, null, 2), 'utf8')

  return {
    name: 'generated-java-static-sanity',
    command: 'diagnose generated Java for known invalid fragments',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet:
      findings.length === 0 ? 'Generated Java static sanity diagnostic passed.' : JSON.stringify(findings.slice(0, 40), null, 2),
  }
}

export async function findGeneratedJavaStaticSanityFindings(root: string): Promise<JavaStaticSanityFinding[]> {
  const mainRoot = resolve(root, 'src/main/java')
  if (!(await exists(mainRoot))) return []
  const javaFiles = (await listFilesRecursive(mainRoot)).filter(file => file.endsWith('.java'))
  const findings: JavaStaticSanityFinding[] = []

  for (const file of javaFiles) {
    const text = await readFile(file, 'utf8')
    const lines = text.split(/\r?\n/u)
    const displayPath = relative(root, file)
    if (isGeneratedMapperSource(file) && /ObjectNode|ArrayNode/u.test(text)) {
      findings.push({
        file: displayPath,
        line: firstMatchingLine(lines, /ObjectNode|ArrayNode/u),
        code: 'jackson_tree_cdm_construction',
        message: 'Generated mapper must not use Jackson tree nodes as the internal CDM model.',
      })
    }
    if (isGeneratedMapperSource(file) && !/import\s+(cdm|com\.rosetta)\./u.test(text)) {
      findings.push({
        file: displayPath,
        line: 1,
        code: 'missing_cdm_rosetta_import',
        message: 'Generated mapper must import preflight-approved CDM/Rosetta model classes.',
      })
    }
    if (isGeneratedMapperSource(file)) {
      const generatedFindings = findGeneratedMapperBehaviorFindings(displayPath, text, lines)
      findings.push(...generatedFindings)
    }
    lines.forEach((line, index) => {
      for (const forbidden of forbiddenJavaPatterns) {
        if (forbidden.pattern.test(line)) {
          findings.push({
            file: displayPath,
            line: index + 1,
            code: forbidden.code,
            message: forbidden.message,
          })
        }
      }
    })
  }

  return findings
}

function findGeneratedMapperBehaviorFindings(
  file: string,
  text: string,
  lines: string[]
): JavaStaticSanityFinding[] {
  const findings: JavaStaticSanityFinding[] = []
  const checks: JavaStaticPattern[] = [
    {
      code: 'todo_in_generated_mapper',
      pattern: /\bTODO\b|not implemented|skeleton has not implemented/iu,
      message: 'Generated mapper still contains TODO or skeleton wording.',
    },
    {
      code: 'ignored_input_path',
      pattern: /mapFile\s*\([^)]*inputPath[^)]*\)[\s\S]*?mapTradeState\s*\(\s*\)/u,
      message: 'Generated mapper appears to ignore inputPath and call a no-input mapping helper.',
    },
    {
      code: 'empty_cdm_builder',
      pattern: /\b(?:Trade|TradeState|NonTransferableProduct|SettlementPayout|Payout|EconomicTerms|TradableProduct)\.builder\(\)\.build\(\)/u,
      message: 'Generated mapper builds an empty core CDM object.',
    },
    {
      code: 'missing_required_reports',
      pattern: /mapFile\s*\([^)]*reportsDir[^)]*\)[\s\S]*?(?!mapping-report\.json)(?!validation-report\.json)(?!traceability-report\.json)(?!unsupported-scope\.json)/u,
      message: 'Generated mapper must write mapping, validation, traceability, and unsupported-scope sidecar reports.',
    },
  ]
  for (const check of checks) {
    if (check.code === 'missing_required_reports') {
      const required = ['mapping-report.json', 'validation-report.json', 'traceability-report.json', 'unsupported-scope.json']
      const missing = required.filter(name => !text.includes(name))
      if (missing.length === 0) continue
      findings.push({
        file,
        line: 1,
        code: check.code,
        message: `${check.message} Missing: ${missing.join(', ')}.`,
      })
      continue
    }
    const matchLine = firstMatchingLine(lines, check.pattern)
    if (matchLine === 1 && !check.pattern.test(lines[0] ?? '') && !check.pattern.test(text)) continue
    if (!check.pattern.test(text)) continue
    findings.push({
      file,
      line: matchLine,
      code: check.code,
      message: check.message,
    })
  }
  return findings
}

function isGeneratedMapperSource(file: string): boolean {
  return file.includes('src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\')
    || file.includes('src/main/java/com/fpml/cdm/fx/mapper/generated/')
}

function firstMatchingLine(lines: string[], pattern: RegExp): number {
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
