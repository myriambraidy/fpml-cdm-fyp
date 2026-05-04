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
]

export async function runGeneratedJavaStaticSanityGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findGeneratedJavaStaticSanityFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'java-static-sanity.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ findings }, null, 2), 'utf8')

  return {
    name: 'generated-java-static-sanity',
    command: 'scan generated Java for known invalid fragments',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet:
      findings.length === 0 ? 'Generated Java static sanity passed.' : JSON.stringify(findings.slice(0, 40), null, 2),
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
    lines.forEach((line, index) => {
      for (const forbidden of forbiddenJavaPatterns) {
        if (forbidden.pattern.test(line)) {
          findings.push({
            file: relative(root, file),
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

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

