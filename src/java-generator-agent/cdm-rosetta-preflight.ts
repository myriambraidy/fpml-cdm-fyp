import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import {
  buildRosettaValidatorJar,
  rosettaValidatorModuleExists,
} from './rosetta-validator-bridge'

export type CdmRosettaMavenArtifact = {
  groupId: string
  artifactId: string
  version: string
}

export type CdmRosettaPreflightMode =
  | 'repo-local-rosetta-validator'
  | 'external-maven-coordinate'
  | 'missing'

export type CdmRosettaValidatorModule = {
  pomPath: string
  jarPath: string
  buildCommand: string
}

export type CdmRosettaPreflightPassedReport = {
  status: 'passed'
  mode: Exclude<CdmRosettaPreflightMode, 'missing'>
  generatedAt: string
  reportPath: string
  markdownPath: string
  cdmArtifact: CdmRosettaMavenArtifact
  validatorModule?: CdmRosettaValidatorModule
  modelRootCandidates: string[]
  requiredClasses: Record<string, string>
  serializer: {
    strategy: string
    notes: string
  }
  diagnostics: string[]
}

export type CdmRosettaPreflightBlockedReport = {
  status: 'blocked'
  mode: CdmRosettaPreflightMode
  generatedAt: string
  reportPath: string
  markdownPath: string
  cdmArtifact: null
  validatorModule?: CdmRosettaValidatorModule
  modelRootCandidates: string[]
  requiredClasses: Record<string, string>
  serializer: {
    strategy: 'unavailable'
    notes: string
  }
  diagnostics: string[]
}

export type CdmRosettaPreflightReport =
  | CdmRosettaPreflightPassedReport
  | CdmRosettaPreflightBlockedReport

export const CDM_ROSETTA_PREFLIGHT_DIR = 'generated/java-mapper-poc/cdm-rosetta-preflight'
export const CDM_ROSETTA_PREFLIGHT_JSON = 'preflight-report.json'
export const CDM_ROSETTA_PREFLIGHT_MARKDOWN = 'preflight-report.md'

const REQUIRED_CDM_CLASSES: Record<string, string> = {
  Trade: 'cdm.event.common.Trade',
  TradeState: 'cdm.event.common.TradeState',
  NonTransferableProduct: 'cdm.product.template.NonTransferableProduct',
  EconomicTerms: 'cdm.product.template.EconomicTerms',
  Payout: 'cdm.product.template.Payout',
  SettlementPayout: 'cdm.product.common.settlement.SettlementPayout',
  ResolvablePriceQuantity: 'cdm.observable.asset.ResolvablePriceQuantity',
}

export function cdmRosettaPreflightJsonPath(): string {
  return resolve(CDM_ROSETTA_PREFLIGHT_DIR, CDM_ROSETTA_PREFLIGHT_JSON)
}

export function cdmRosettaPreflightMarkdownPath(): string {
  return resolve(CDM_ROSETTA_PREFLIGHT_DIR, CDM_ROSETTA_PREFLIGHT_MARKDOWN)
}

export async function ensureCdmRosettaPreflightReport(): Promise<CdmRosettaPreflightReport> {
  const jsonPath = cdmRosettaPreflightJsonPath()
  const moduleExists = await rosettaValidatorModuleExists()
  if (await exists(jsonPath)) {
    const cached = await readCdmRosettaPreflightReport(jsonPath)
    if (!moduleExists || (cached.status === 'passed' && cached.mode === 'repo-local-rosetta-validator')) {
      return cached
    }
  }

  if (moduleExists) {
    const build = await buildRosettaValidatorJar()
    if (build.status === 'passed') {
      const report = passedReport({
        mode: 'repo-local-rosetta-validator',
        artifact: {
          groupId: 'org.finos.cdm',
          artifactId: 'cdm-java',
          version: '6.7.0',
        },
        validatorModule: {
          pomPath: build.pomPath,
          jarPath: build.jarPath,
          buildCommand: build.command,
        },
        diagnostics: [
          'rosetta-validator Maven module was found and packaged successfully.',
          `Built ${build.jarPath}.`,
        ],
      })
      await writeCdmRosettaPreflightReport(report)
      return report
    }
    const report = blockedReport({
      mode: 'repo-local-rosetta-validator',
      validatorModule: {
        pomPath: build.pomPath,
        jarPath: build.jarPath,
        buildCommand: build.command,
      },
      diagnostics: [
        'rosetta-validator Maven module was found, but packaging failed.',
        build.output,
      ],
    })
    await writeCdmRosettaPreflightReport(report)
    return report
  }

  const artifact = artifactFromEnvironment()
  const report =
    artifact === null
      ? blockedReport({
          mode: 'missing',
          diagnostics: [
            'No rosetta-validator Maven module or CDM/Rosetta Maven coordinate was provided.',
            'Add rosetta-validator/pom.xml or set CDM_ROSETTA_MAVEN_COORDINATE to groupId:artifactId:version.',
          ],
        })
      : passedReport({
          mode: 'external-maven-coordinate',
          artifact,
          diagnostics: [
            'CDM_ROSETTA_MAVEN_COORDINATE was provided.',
            'This report records the dependency contract; Maven compile gates still prove the artifact is usable.',
          ],
        })

  await writeCdmRosettaPreflightReport(report)
  return report
}

export async function readCdmRosettaPreflightReport(
  path = cdmRosettaPreflightJsonPath()
): Promise<CdmRosettaPreflightReport> {
  const parsed = JSON.parse(await readFile(path, 'utf8')) as CdmRosettaPreflightReport
  return parsed
}

export async function writeCdmRosettaPreflightReport(
  report: CdmRosettaPreflightReport
): Promise<void> {
  await mkdir(dirname(report.reportPath), { recursive: true })
  await writeFile(report.reportPath, JSON.stringify(report, null, 2), 'utf8')
  await writeFile(report.markdownPath, renderCdmRosettaPreflightMarkdown(report), 'utf8')
}

export function renderCdmRosettaPreflightMarkdown(report: CdmRosettaPreflightReport): string {
  const artifact =
    report.cdmArtifact === null
      ? 'Unavailable'
      : `${report.cdmArtifact.groupId}:${report.cdmArtifact.artifactId}:${report.cdmArtifact.version}`
  return `# CDM/Rosetta Java Preflight

Generated: ${report.generatedAt}
Status: ${report.status}
Mode: ${report.mode}

## Artifact

${artifact}

## Validator Module

${renderValidatorModule(report.validatorModule)}

## Model Root Candidates

${report.modelRootCandidates.map(candidate => `- ${candidate}`).join('\n')}

## Required Classes

${Object.entries(report.requiredClasses)
  .map(([name, className]) => `- ${name}: ${className}`)
  .join('\n')}

## Serializer

- Strategy: ${report.serializer.strategy}
- Notes: ${report.serializer.notes}

## Diagnostics

${report.diagnostics.map(diagnostic => `- ${diagnostic}`).join('\n')}
`
}

function artifactFromEnvironment(): CdmRosettaMavenArtifact | null {
  const coordinate = process.env.CDM_ROSETTA_MAVEN_COORDINATE
  if (coordinate === undefined || coordinate.trim() === '') return null
  const parts = coordinate.split(':')
  if (parts.length !== 3) return null
  const [groupId, artifactId, version] = parts
  if (groupId === undefined || artifactId === undefined || version === undefined) return null
  if (groupId.trim() === '' || artifactId.trim() === '' || version.trim() === '') return null
  return {
    groupId: groupId.trim(),
    artifactId: artifactId.trim(),
    version: version.trim(),
  }
}

function passedReport(args: {
  mode: Exclude<CdmRosettaPreflightMode, 'missing'>
  artifact: CdmRosettaMavenArtifact
  validatorModule?: CdmRosettaValidatorModule
  diagnostics: string[]
}): CdmRosettaPreflightPassedReport {
  return {
    status: 'passed',
    mode: args.mode,
    generatedAt: new Date().toISOString(),
    reportPath: cdmRosettaPreflightJsonPath(),
    markdownPath: cdmRosettaPreflightMarkdownPath(),
    cdmArtifact: args.artifact,
    validatorModule: args.validatorModule,
    modelRootCandidates: ['cdm.event.common.TradeState', 'cdm.event.common.Trade'],
    requiredClasses: REQUIRED_CDM_CLASSES,
    serializer: {
      strategy: 'maven-compile-gated-jackson-serialization',
      notes:
        'Use the CDM model object as the internal representation and serialize it at the runtime boundary.',
    },
    diagnostics: args.diagnostics,
  }
}

function blockedReport(args: {
  mode: CdmRosettaPreflightMode
  validatorModule?: CdmRosettaValidatorModule
  diagnostics: string[]
}): CdmRosettaPreflightBlockedReport {
  return {
    status: 'blocked',
    mode: args.mode,
    generatedAt: new Date().toISOString(),
    reportPath: cdmRosettaPreflightJsonPath(),
    markdownPath: cdmRosettaPreflightMarkdownPath(),
    cdmArtifact: null,
    validatorModule: args.validatorModule,
    modelRootCandidates: ['cdm.event.common.TradeState', 'cdm.event.common.Trade'],
    requiredClasses: REQUIRED_CDM_CLASSES,
    serializer: {
      strategy: 'unavailable',
      notes: 'No CDM/Rosetta Java artifact has been proven usable yet.',
    },
    diagnostics: args.diagnostics,
  }
}

function renderValidatorModule(module: CdmRosettaValidatorModule | undefined): string {
  if (module === undefined) return 'Unavailable'
  return `- POM: ${module.pomPath}
- JAR: ${module.jarPath}
- Build command: ${module.buildCommand}`
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
