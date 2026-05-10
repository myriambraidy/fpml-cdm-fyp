import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

export type GeneratedTestShellContractFinding = {
  file: string
  line: number
  code: string
  message: string
}

type ForbiddenTestPattern = {
  code: string
  pattern: RegExp
  message: string
}

const forbiddenTestPatterns: ForbiddenTestPattern[] = [
  {
    code: 'runtime_args_default_constructor',
    pattern: /\bnew\s+RuntimeArgs\s*\(\s*\)/u,
    message: 'RuntimeArgs has no default constructor; tests should call mapper.mapFile(Path, Path).',
  },
  {
    code: 'runtime_args_set_fixture_name',
    pattern: /\.setFixtureName\s*\(/u,
    message: 'RuntimeArgs has no setFixtureName mutator.',
  },
  {
    code: 'runtime_args_set_fixtures_dir',
    pattern: /\.setFixturesDir\s*\(/u,
    message: 'RuntimeArgs has no setFixturesDir mutator.',
  },
  {
    code: 'runtime_args_set_output_dir',
    pattern: /\.setOutputDir\s*\(/u,
    message: 'RuntimeArgs has no setOutputDir mutator.',
  },
  {
    code: 'runtime_args_set_report_dir',
    pattern: /\.setReportDir\s*\(/u,
    message: 'RuntimeArgs has no setReportDir mutator.',
  },
  {
    code: 'mapper_map_runtime_args',
    pattern: /\bmapper\.map\s*\(/u,
    message: 'FpmlToCdmMapper exposes mapFile(Path, Path), not map(RuntimeArgs).',
  },
  {
    code: 'invented_map_fpml_to_cdm',
    pattern: /\bmapFpmlToCdm\s*\(/u,
    message: 'Generated tests should not call invented mapper methods.',
  },
  {
    code: 'invented_map_to_trade_state',
    pattern: /\bmapToTradeState\s*\(/u,
    message: 'Generated tests should not call invented mapper methods.',
  },
]

export async function runGeneratedTestShellContractGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findGeneratedTestShellContractFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'generated-test-shell-contract.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ findings }, null, 2), 'utf8')
  return {
    name: 'generated-test-shell-contract',
    command: 'diagnose generated tests against Java shell contract',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet: findings.length === 0
      ? 'Generated test shell contract diagnostic passed.'
      : JSON.stringify(findings.slice(0, 40), null, 2),
  }
}

export async function findGeneratedTestShellContractFindings(
  root: string
): Promise<GeneratedTestShellContractFinding[]> {
  const testRoot = resolve(root, 'src/test/java')
  if (!(await exists(testRoot))) return []
  const javaFiles = (await listFilesRecursive(testRoot)).filter(file => file.endsWith('.java'))
  const findings: GeneratedTestShellContractFinding[] = []
  for (const file of javaFiles) {
    const text = await readFile(file, 'utf8')
    const lines = text.split(/\r?\n/u)
    const displayPath = relative(root, file)
    lines.forEach((line, index) => {
      for (const forbidden of forbiddenTestPatterns) {
        if (!forbidden.pattern.test(line)) continue
        findings.push({
          file: displayPath,
          line: index + 1,
          code: forbidden.code,
          message: forbidden.message,
        })
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
