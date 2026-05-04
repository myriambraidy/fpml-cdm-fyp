import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { listFilesRecursive } from './file-list'
import type { GateResult, GeneratorRunConfig } from './types'

type JavaReferenceFinding = {
  file: string
  importName: string
  message: string
}

export async function runJavaReferenceGate(config: GeneratorRunConfig): Promise<GateResult> {
  const findings = await findJavaReferenceFindings(config.runOutputDir)
  const reportPath = resolve(config.runOutputDir, 'build-reports', 'java-reference-check.json')
  await mkdir(dirname(reportPath), { recursive: true })
  await writeFile(reportPath, JSON.stringify({ findings }, null, 2), 'utf8')

  return {
    name: 'java-reference-check',
    command: 'check generated Java references',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet:
      findings.length === 0 ? 'Generated Java references passed.' : JSON.stringify(findings.slice(0, 40), null, 2),
  }
}

export async function findJavaReferenceFindings(root: string): Promise<JavaReferenceFinding[]> {
  const mainRoot = join(root, 'src/main/java')
  if (!(await exists(mainRoot))) return []

  const javaFiles = (await listFilesRecursive(mainRoot)).filter(file => file.endsWith('.java'))
  const declaredClasses = new Set<string>()
  const packageNames = new Set<string>()

  for (const file of javaFiles) {
    const text = await readFile(file, 'utf8')
    const packageName = matchPackageName(text)
    const className = matchPublicTypeName(text)
    if (packageName !== undefined) packageNames.add(packageName)
    if (packageName !== undefined && className !== undefined) declaredClasses.add(`${packageName}.${className}`)
  }

  const findings: JavaReferenceFinding[] = []
  for (const file of javaFiles) {
    const text = await readFile(file, 'utf8')
    const imports = matchProjectImports(text)
    for (const importName of imports) {
      if (importName.endsWith('.*')) {
        const importedPackage = importName.slice(0, -2)
        if (!packageNames.has(importedPackage)) {
          findings.push({
            file: relative(root, file),
            importName,
            message: 'Wildcard project import does not match a generated package.',
          })
        }
      } else if (!declaredClasses.has(importName)) {
        findings.push({
          file: relative(root, file),
          importName,
          message: 'Project import does not match a generated public type.',
        })
      }
    }
  }

  return findings
}

function matchPackageName(text: string): string | undefined {
  const match = text.match(/^\s*package\s+([A-Za-z0-9_.]+);/m)
  return match?.[1]
}

function matchPublicTypeName(text: string): string | undefined {
  const match = text.match(/^\s*public\s+(?:final\s+)?(?:class|record|interface|enum)\s+([A-Za-z0-9_]+)/m)
  return match?.[1]
}

function matchProjectImports(text: string): string[] {
  const imports: string[] = []
  const importPattern = /^\s*import\s+(com\.fpml\.cdm\.[A-Za-z0-9_.*]+);/gm
  for (const match of text.matchAll(importPattern)) {
    const importName = match[1]
    if (importName !== undefined) imports.push(importName)
  }
  return imports
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
