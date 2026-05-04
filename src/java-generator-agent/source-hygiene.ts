import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

type SourceHygieneFinding = {
  file: string
  code: string
  message: string
}

const checkedExtensions = new Set(['.java', '.xml'])

export async function runSourceHygieneGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findSourceHygieneFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'source-hygiene.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ findings }, null, 2), 'utf8')

  return {
    name: 'source-hygiene',
    command: 'scan generated source for invalid generated text',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet:
      findings.length === 0 ? 'Source hygiene passed.' : JSON.stringify(findings.slice(0, 40), null, 2),
  }
}

export async function findSourceHygieneFindings(root: string): Promise<SourceHygieneFinding[]> {
  if (!(await exists(root))) return []
  const files = (await listFilesRecursive(root)).filter(shouldCheck)
  const findings: SourceHygieneFinding[] = []

  for (const file of files) {
    const text = await readFile(file, 'utf8')
    const displayPath = relative(root, file)
    if (/[\u2018\u2019\u201C\u201D]/u.test(text)) {
      findings.push({
        file: displayPath,
        code: 'smart_quotes',
        message: 'Generated source contains smart quotes.',
      })
    }
    if (/\u00E2\u20AC[\u0153\u009D\u2122]/u.test(text)) {
      findings.push({
        file: displayPath,
        code: 'mojibake_quotes',
        message: 'Generated source contains mojibake quote sequences.',
      })
    }
    if (/&quot;|&apos;/u.test(text)) {
      findings.push({
        file: displayPath,
        code: 'html_escaped_quotes',
        message: 'Generated source contains HTML-escaped quotes.',
      })
    }
    if (file.endsWith('.java') && /[^\x09\x0A\x0D\x20-\x7E]/u.test(text)) {
      findings.push({
        file: displayPath,
        code: 'non_ascii_java',
        message: 'Generated Java must be ASCII for V2.',
      })
    }
    if (file.endsWith('.java') && /import\s+com\.fpml\.cdm\.fx\.model\.\*/u.test(text)) {
      findings.push({
        file: displayPath,
        code: 'wildcard_missing_model_import',
        message: 'Generated source imports a model wildcard package.',
      })
    }
  }

  return findings
}

function shouldCheck(path: string): boolean {
  for (const extension of checkedExtensions) {
    if (path.endsWith(extension)) return true
  }
  return false
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
