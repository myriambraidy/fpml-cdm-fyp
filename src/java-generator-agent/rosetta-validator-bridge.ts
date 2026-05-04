import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { truncateForLog } from './markdown'

export type RosettaValidationFailure = {
  name: string
  type: string
  path: string
  definition: string
  failureMessage: string
  failureCount: number
}

export type RosettaValidationResult = {
  valid: boolean
  failures: RosettaValidationFailure[]
}

export type RosettaValidationType = 'trade' | 'tradeState'

export type RosettaValidatorBuildResult =
  | {
      status: 'passed'
      pomPath: string
      jarPath: string
      command: string
      output: string
    }
  | {
      status: 'failed'
      pomPath: string
      jarPath: string
      command: string
      output: string
    }

export const ROSETTA_VALIDATOR_DIR = 'rosetta-validator'
export const ROSETTA_VALIDATOR_JAR = 'rosetta-validator-1.0.0.jar'

export function rosettaValidatorPomPath(): string {
  return resolve(ROSETTA_VALIDATOR_DIR, 'pom.xml')
}

export function rosettaValidatorJarPath(): string {
  return resolve(ROSETTA_VALIDATOR_DIR, 'target', ROSETTA_VALIDATOR_JAR)
}

export async function rosettaValidatorModuleExists(): Promise<boolean> {
  return exists(rosettaValidatorPomPath())
}

export async function buildRosettaValidatorJar(): Promise<RosettaValidatorBuildResult> {
  const pomPath = rosettaValidatorPomPath()
  const jarPath = rosettaValidatorJarPath()
  const command = 'mvn -q -DskipTests package'
  if (!(await exists(pomPath))) {
    return {
      status: 'failed',
      pomPath,
      jarPath,
      command,
      output: `Missing ${pomPath}`,
    }
  }
  if (await exists(jarPath)) {
    return {
      status: 'passed',
      pomPath,
      jarPath,
      command,
      output: `Using existing ${jarPath}`,
    }
  }
  let output = ''
  let exitCode = 1
  try {
    const proc = Bun.spawn(['mvn', '-q', '-DskipTests', 'package'], {
      cwd: resolve(ROSETTA_VALIDATOR_DIR),
      stdout: 'pipe',
      stderr: 'pipe',
    })
    const [stdout, stderr, procExitCode] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ])
    output = truncateForLog([stdout, stderr].filter(Boolean).join('\n'), 12_000)
    exitCode = procExitCode
  } catch (error) {
    output = error instanceof Error ? error.message : String(error)
  }
  if (exitCode !== 0 || !(await exists(jarPath))) {
    return {
      status: 'failed',
      pomPath,
      jarPath,
      command,
      output,
    }
  }
  return {
    status: 'passed',
    pomPath,
    jarPath,
    command,
    output,
  }
}

export async function ensureRosettaValidatorJar(): Promise<string> {
  const jarPath = rosettaValidatorJarPath()
  if (await exists(jarPath)) return jarPath
  const result = await buildRosettaValidatorJar()
  if (result.status !== 'passed') {
    throw new Error(`rosetta-validator Maven build failed\n${result.output}`)
  }
  return result.jarPath
}

export async function validateCdmJsonWithRosetta(args: {
  cdmJson: string
  type: RosettaValidationType
}): Promise<RosettaValidationResult> {
  const jarPath = await ensureRosettaValidatorJar()
  const tempDir = await mkdtemp(join(tmpdir(), 'rosetta-validation-'))
  try {
    const inputPath = join(tempDir, 'input.json')
    await writeFile(inputPath, args.cdmJson, 'utf8')
    return validateCdmJsonFileWithRosetta({ inputPath, type: args.type, jarPath })
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

export async function validateCdmJsonFileWithRosetta(args: {
  inputPath: string
  type: RosettaValidationType
  jarPath?: string
}): Promise<RosettaValidationResult> {
  const jarPath = args.jarPath ?? (await ensureRosettaValidatorJar())
  const proc = Bun.spawn(['java', '-jar', jarPath, args.inputPath, '--type', args.type], {
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  if (exitCode === 2) {
    throw new Error(`rosetta-validator failed\n${stderr}`)
  }
  const parsed = JSON.parse(stdout) as RosettaValidationResult
  return parsed
}

export async function readRosettaValidatorPom(): Promise<string> {
  return readFile(rosettaValidatorPomPath(), 'utf8')
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
