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

    const smokeFindings = fixture.id === 'fx-ex01-fx-spot'
      ? assertFxEx01Smoke(parsed)
      : fixture.id === 'fx-ex03-fx-fwd'
        ? assertFxEx03Forward(parsed)
        : []
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

function assertFxEx03Forward(cdm: JsonObject): string[] {
  const findings: string[] = []
  const text = JSON.stringify(cdm)
  const requiredStrings = [
    'ForeignExchange_Spot_Forward',
    'EUR',
    'USD',
    'ABN1234',
    'DB5678',
    'ABNANL2A',
    'DEUTDEFF',
    '2001-11-19',
    '2001-12-21',
    'ExchangeRate',
    'ForwardPoint',
    'Buyer',
    'Seller',
  ]
  for (const expected of requiredStrings) {
    if (!text.includes(expected)) findings.push(`fx-ex03-fx-fwd: expected generated CDM to include ${expected}.`)
  }
  for (const expected of [0.9175, 0.913, 0.0045, 10000000, 9175000]) {
    if (!containsNumber(cdm, expected)) findings.push(`fx-ex03-fx-fwd: expected generated CDM to include numeric value ${expected}.`)
  }
  if (!text.includes('"trade"')) findings.push('fx-ex03-fx-fwd: expected TradeState root with trade.')
  if (!text.includes('"partyRole"')) findings.push('fx-ex03-fx-fwd: expected buyer/seller partyRole entries required by Rosetta validation.')
  return findings
}

function containsNumber(value: JsonValue, expected: number): boolean {
  if (typeof value === 'number') return Math.abs(value - expected) < 0.0000001
  if (Array.isArray(value)) return value.some(item => containsNumber(item, expected))
  if (isJsonObject(value)) return Object.values(value).some(item => containsNumber(item, expected))
  return false
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
