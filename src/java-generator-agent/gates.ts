import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { GENERATED_JAVA_VERSION } from './java-contract'
import { runJavaReferenceGate } from './java-reference-gate'
import { runGeneratedJavaStaticSanityGate } from './java-static-sanity'
import { truncateForLog } from './markdown'
import { validateGeneratedOutput } from './output-validation'
import { runSourceHygieneGate } from './source-hygiene'
import type { RuntimeFixture } from './java-contract'
import type { GateResult, GeneratorRunConfig } from './types'

export async function runGates(config: GeneratorRunConfig): Promise<GateResult[]> {
  const results: GateResult[] = []
  results.push(await runGate('typescript-typecheck', 'bun run typecheck', resolve('.')))
  results.push(await validateGeneratedProjectStructure(config))
  results.push(await validateGeneratedShellContract(config))
  results.push(await runSourceHygieneGate(config))
  results.push(await runGeneratedJavaStaticSanityGate(config))
  results.push(await runJavaReferenceGate(config))
  if (hasFailedGate(results)) {
    pushSkippedBuildGates(results, config, 'Skipped because an earlier pre-Maven gate failed.')
  } else {
    results.push(
      await runGate(
        'maven-dependency-preflight',
        'mvn -q -DskipTests dependency:go-offline',
        config.runOutputDir
      )
    )
    if (hasFailedGate(results)) {
      pushSkippedCompileAndRuntimeGates(results, config, 'Skipped because Maven dependency preflight failed.')
    } else {
      results.push(await runGate('maven-compile', 'mvn -q -DskipTests compile', config.runOutputDir))
      if (hasFailedGate(results)) {
        pushSkippedTestAndRuntimeGates(results, config, 'Skipped because main Java compilation failed.')
      } else {
        results.push(await runGate('maven-test-compile', 'mvn -q -DskipTests test-compile', config.runOutputDir))
        if (hasFailedGate(results)) {
          pushSkippedTestRuntimeAndPackageGates(results, config, 'Skipped because test Java compilation failed.')
        } else {
          results.push(await runGate('maven-test', 'mvn test', config.runOutputDir))
          if (hasFailedGate(results)) {
            pushSkippedPackageAndRuntimeGates(results, config, 'Skipped because Maven tests failed.')
          } else {
            results.push(await runGate('maven-package', 'mvn package', config.runOutputDir))
            if (hasFailedGate(results)) {
              pushSkippedRuntimeGates(results, config, 'Skipped because Maven package failed.')
            } else {
              results.push(...(await runJarRuntimeGates(config)))
              results.push(await validateGeneratedOutput(config))
            }
          }
        }
      }
    }
  }
  const gateResultsPath = resolve(config.runOutputDir, 'build-reports', 'gate-results.json')
  await mkdir(dirname(gateResultsPath), { recursive: true })
  await writeFile(
    gateResultsPath,
    JSON.stringify(results, null, 2),
    'utf8'
  )
  return results
}

export async function validateGeneratedProjectStructure(config: GeneratorRunConfig): Promise<GateResult> {
  const required = [
    resolve(config.runOutputDir, 'pom.xml'),
    resolve(config.runOutputDir, 'src/main/java'),
    resolve(config.runOutputDir, 'src/test/java'),
  ]
  const missing: string[] = []
  for (const path of required) {
    if (!(await exists(path))) missing.push(path)
  }
  if (missing.length > 0) {
    return {
      name: 'generated-project-structure',
      command: 'check generated Maven project structure',
      status: 'failed',
      exitCode: 1,
      outputSnippet: `Missing required generated project paths:\n${missing.join('\n')}`,
    }
  }
  return {
    name: 'generated-project-structure',
    command: 'check generated Maven project structure',
    status: 'passed',
    exitCode: 0,
    outputSnippet: 'Generated Maven project structure is present.',
  }
}

export async function validateGeneratedShellContract(config: GeneratorRunConfig): Promise<GateResult> {
  const required = [
    resolve(config.runOutputDir, 'pom.xml'),
    resolve(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/Main.java'),
    resolve(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java'),
    resolve(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java'),
  ]
  const missing: string[] = []
  for (const path of required) {
    if (!(await exists(path))) missing.push(path)
  }
  const findings: string[] = missing.map(path => `Missing shell file: ${path}`)
  if (missing.length === 0) {
    const pom = await Bun.file(required[0]).text()
    const runtimeArgs = await Bun.file(required[2]).text()
    const main = await Bun.file(required[1]).text()
    if (!pom.includes(`<maven.compiler.release>${GENERATED_JAVA_VERSION}</maven.compiler.release>`)) {
      findings.push(`pom.xml must set maven.compiler.release to ${GENERATED_JAVA_VERSION}.`)
    }
    if (runtimeArgs.includes('record RuntimeArgs')) {
      findings.push(`RuntimeArgs must be Java ${GENERATED_JAVA_VERSION} compatible and must not be a record.`)
    }
    if (!main.includes('GeneratedFpmlToCdmMapper')) {
      findings.push('Main.java must instantiate GeneratedFpmlToCdmMapper through the shell contract.')
    }
  }
  return {
    name: 'generated-shell-contract',
    command: 'check generated Java shell contract',
    status: findings.length === 0 ? 'passed' : 'failed',
    exitCode: findings.length === 0 ? 0 : 1,
    outputSnippet: findings.length === 0 ? 'Generated shell contract passed.' : findings.join('\n'),
  }
}

function skippedGate(name: string, command: string, outputSnippet: string): GateResult {
  return {
    name,
    command,
    status: 'skipped',
    exitCode: 0,
    outputSnippet,
  }
}

export async function runGate(name: string, command: string, cwd: string): Promise<GateResult> {
  try {
    const proc = Bun.spawn(['powershell', '-NoProfile', '-Command', command], {
      cwd,
      stdout: 'pipe',
      stderr: 'pipe',
    })
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ])
    return {
      name,
      command,
      status: exitCode === 0 ? 'passed' : 'failed',
      exitCode,
      outputSnippet: truncateForLog([stdout, stderr].filter(Boolean).join('\n'), 6000),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      name,
      command,
      status: 'failed',
      exitCode: 1,
      outputSnippet: truncateForLog(message, 6000),
    }
  }
}

function jarRuntimeCommand(fixture: Pick<RuntimeFixture, 'id' | 'fixtureFileName'>): string {
  return `java -jar target/fpml-cdm-mapper.jar fixtures/${fixture.fixtureFileName} --output outputs/${fixture.id}.json --reports reports/${fixture.id}`
}

const DEFAULT_JAR_RUNTIME_FIXTURE: Pick<RuntimeFixture, 'id' | 'fixtureFileName'> = {
  id: 'fx-ex01-fx-spot',
  fixtureFileName: 'fx-ex01-fx-spot.xml',
}

export async function runJarRuntimeGate(config: GeneratorRunConfig): Promise<GateResult> {
  const results = await runJarRuntimeGates(config)
  const first = results[0]
  if (first === undefined) {
    throw new Error('runJarRuntimeGates returned no results')
  }
  return first
}

async function runJarRuntimeGates(config: GeneratorRunConfig): Promise<GateResult[]> {
  const fixtures = config.runtimeFixtures
  if (fixtures.length === 0) {
    return [
      await runGate(
        `jar-runtime:${DEFAULT_JAR_RUNTIME_FIXTURE.id}`,
        jarRuntimeCommand(DEFAULT_JAR_RUNTIME_FIXTURE),
        config.runOutputDir
      ),
    ]
  }
  const results: GateResult[] = []
  for (const fixture of fixtures) {
    results.push(await runGate(`jar-runtime:${fixture.id}`, jarRuntimeCommand(fixture), config.runOutputDir))
  }
  return results
}

function hasFailedGate(results: GateResult[]): boolean {
  return results.some(result => result.status === 'failed')
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function pushSkippedBuildGates(results: GateResult[], config: GeneratorRunConfig, reason: string): void {
  results.push(skippedGate('maven-dependency-preflight', 'mvn -q -DskipTests dependency:go-offline', reason))
  pushSkippedCompileAndRuntimeGates(results, config, reason)
}

function pushSkippedCompileAndRuntimeGates(results: GateResult[], config: GeneratorRunConfig, reason: string): void {
  results.push(skippedGate('maven-compile', 'mvn -q -DskipTests compile', reason))
  pushSkippedTestAndRuntimeGates(results, config, reason)
}

function pushSkippedTestAndRuntimeGates(results: GateResult[], config: GeneratorRunConfig, reason: string): void {
  results.push(skippedGate('maven-test-compile', 'mvn -q -DskipTests test-compile', reason))
  pushSkippedTestRuntimeAndPackageGates(results, config, reason)
}

function pushSkippedTestRuntimeAndPackageGates(results: GateResult[], config: GeneratorRunConfig, reason: string): void {
  results.push(skippedGate('maven-test', 'mvn test', reason))
  pushSkippedPackageAndRuntimeGates(results, config, reason)
}

function pushSkippedPackageAndRuntimeGates(results: GateResult[], config: GeneratorRunConfig, reason: string): void {
  results.push(skippedGate('maven-package', 'mvn package', reason))
  pushSkippedRuntimeGates(results, config, reason)
}

function pushSkippedRuntimeGates(results: GateResult[], config: GeneratorRunConfig, reason: string): void {
  if (config.runtimeFixtures.length === 0) {
    results.push(
      skippedGate(
        `jar-runtime:${DEFAULT_JAR_RUNTIME_FIXTURE.id}`,
        jarRuntimeCommand(DEFAULT_JAR_RUNTIME_FIXTURE),
        reason
      )
    )
  } else {
    for (const fixture of config.runtimeFixtures) {
      results.push(skippedGate(`jar-runtime:${fixture.id}`, jarRuntimeCommand(fixture), reason))
    }
  }
  results.push(skippedGate('output-validation', 'validate generated-cdm.json and sidecar reports', reason))
}
