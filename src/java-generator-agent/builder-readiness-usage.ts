import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import {
  finalImplementationContractJsonPath,
  readFinalImplementationContract,
  type BuilderReadinessConstraint,
} from './final-implementation-contract'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

export type BuilderReadinessUsageFinding = {
  file: string
  line: number
  className: string
  rule: 'parameter_only' | 'report_gap'
  message: string
}

export async function runBuilderReadinessUsageGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findBuilderReadinessUsageFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'builder-readiness-usage.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ authority: 'diagnostic', findings }, null, 2), 'utf8')
  return {
    name: 'builder-readiness-usage',
    command: 'diagnose direct builder usage against final implementation contract',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet: findings.length === 0
      ? 'Builder readiness diagnostic passed.'
      : JSON.stringify(findings.slice(0, 40), null, 2),
  }
}

export async function findBuilderReadinessUsageFindings(root: string): Promise<BuilderReadinessUsageFinding[]> {
  const contractPath = finalImplementationContractJsonPath(root)
  const mainRoot = resolve(root, 'src/main/java')
  if (!(await exists(contractPath)) || !(await exists(mainRoot))) return []
  const contract = await readFinalImplementationContract(contractPath)
  const constrained = contract.builderReadinessConstraints.filter(isConstrainedBuilderReadiness)
  if (constrained.length === 0) return []
  const files = (await listFilesRecursive(mainRoot)).filter(file => file.endsWith('.java'))
  const findings: BuilderReadinessUsageFinding[] = []
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    const lines = text.split(/\r?\n/u)
    for (const constraint of constrained) {
      const simpleName = constraint.className.split('.').at(-1) ?? constraint.className
      const directBuilderPattern = new RegExp(`\\b${escapeRegExp(simpleName)}\\s*\\.\\s*builder\\s*\\(`, 'u')
      const lineIndex = lines.findIndex(line => directBuilderPattern.test(line))
      if (lineIndex === -1) continue
      findings.push({
        file: relative(root, file),
        line: lineIndex + 1,
        className: constraint.className,
        rule: constraint.implementationRule,
        message: `${constraint.className} is ${constraint.implementationRule}; avoid direct construction unless the contract is updated from JAR evidence.`,
      })
    }
  }
  return findings
}

function isConstrainedBuilderReadiness(
  constraint: BuilderReadinessConstraint
): constraint is BuilderReadinessConstraint & { implementationRule: 'parameter_only' | 'report_gap' } {
  return constraint.implementationRule === 'parameter_only' || constraint.implementationRule === 'report_gap'
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
