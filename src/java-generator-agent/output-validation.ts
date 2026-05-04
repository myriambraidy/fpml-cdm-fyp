import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { GateResult, GeneratorRunConfig } from './types'

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]
type JsonObject = {
  [key: string]: JsonValue
}

const requiredReports = [
  'mapping-report.json',
  'validation-report.json',
  'traceability-report.json',
  'unsupported-scope.json',
]

export async function validateGeneratedOutput(config: GeneratorRunConfig): Promise<GateResult> {
  const command = 'validate runtime fixture CDM JSON and sidecar reports'
  const missing = await findMissingOutputFiles(config)
  if (missing.length > 0) return failedOutputGate(command, `Missing files:\n${missing.join('\n')}`)

  for (const fixture of config.runtimeFixtures) {
    const content = await readFile(outputPathForFixture(config, fixture.id), 'utf8')
    const parsed: JsonValue = JSON.parse(content)
    if (!isJsonObject(parsed)) return failedOutputGate(command, `${fixture.id}: output root must be a JSON object.`)

    if (hasOwn(parsed, 'status') || hasOwn(parsed, 'cdm')) {
      return failedOutputGate(command, `${fixture.id}: output is wrapped in status/cdm fields.`)
    }
    if (!hasOwn(parsed, 'trade') && !hasOwn(parsed, 'workflowStep')) {
      return failedOutputGate(command, `${fixture.id}: output does not contain a CDM-like root.`)
    }

    const smokeFindings = fixture.id === 'fx-ex01-fx-spot' ? assertFxEx01Smoke(parsed) : []
    if (smokeFindings.length > 0) return failedOutputGate(command, smokeFindings.join('\n'))
  }

  return {
    name: 'output-validation',
    command,
    status: 'passed',
    exitCode: 0,
    outputSnippet: 'Runtime fixture outputs and sidecar reports are present and minimally CDM-shaped.',
  }
}

async function findMissingOutputFiles(config: GeneratorRunConfig): Promise<string[]> {
  const missing: string[] = []
  for (const fixture of config.runtimeFixtures) {
    const outputPath = outputPathForFixture(config, fixture.id)
    if (!(await exists(outputPath))) missing.push(`outputs/${fixture.id}.json`)
    for (const report of requiredReports) {
      const reportPath = reportPathForFixture(config, fixture.id, report)
      if (!(await exists(reportPath))) missing.push(`reports/${fixture.id}/${report}`)
    }
  }
  return missing
}

function assertFxEx01Smoke(cdm: JsonObject): string[] {
  const findings: string[] = []
  const text = JSON.stringify(cdm)
  for (const expected of ['GBP', 'USD', 'ForeignExchange_Spot_Forward']) {
    if (!text.includes(expected)) findings.push(`Expected generated CDM to include ${expected}.`)
  }
  if (!text.includes('tradeDate')) findings.push('Expected generated CDM to include tradeDate.')
  if (!text.includes('counterparty')) findings.push('Expected generated CDM to include counterparty.')
  return findings
}

function failedOutputGate(command: string, outputSnippet: string): GateResult {
  return {
    name: 'output-validation',
    command,
    status: 'failed',
    exitCode: 1,
    outputSnippet,
  }
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasOwn(value: JsonObject, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function outputPathForFixture(config: GeneratorRunConfig, fixtureId: string): string {
  return resolve(config.runOutputDir, 'outputs', `${fixtureId}.json`)
}

function reportPathForFixture(config: GeneratorRunConfig, fixtureId: string, report: string): string {
  return resolve(config.runOutputDir, 'reports', fixtureId, report)
}
