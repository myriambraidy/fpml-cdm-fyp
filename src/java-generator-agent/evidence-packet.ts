import { readFile, writeFile } from 'node:fs/promises'
import { parseJSON } from '../parser/json-parser'
import { parseXML } from '../parser/xml-parser'
import type { ProductScopeGuidance } from './product-scope'
import { renderProductScopeMarkdown } from './product-scope'
import type { CdmRosettaPreflightReport } from './cdm-rosetta-preflight'
import { ensureCdmRosettaPreflightReport, renderCdmRosettaPreflightMarkdown } from './cdm-rosetta-preflight'
import type { RosettaGenerationContext } from './rosetta-context'
import { buildRosettaGenerationContext, renderRosettaGenerationContext } from './rosetta-context'

export type EvidencePacket = {
  generatedAt: string
  scope: ProductScopeGuidance
  fixtureSummaries: EvidenceFileSummary[]
  expectedCdmSummaries: EvidenceFileSummary[]
  cookbookFiles: EvidenceFileSummary[]
  rosettaFiles: EvidenceFileSummary[]
  rosettaGenerationContext: RosettaGenerationContext
  cdmRosettaPreflight: CdmRosettaPreflightReport
  knownAbsentPaths: string[]
  notes: string[]
}

export type EvidenceFileSummary = {
  path: string
  summary: string
}

export async function buildEvidencePacket(scope: ProductScopeGuidance): Promise<EvidencePacket> {
  const fixturePaths = scope.classifiedFixtures
    .filter(fixture => fixture.productGroup !== 'non-fx')
    .map(fixture => fixture.fpmlPath)
  const expectedCdmPaths = scope.classifiedFixtures.flatMap(fixture =>
    fixture.expectedCdmPath ? [fixture.expectedCdmPath] : []
  )

  const [fixtureSummaries, expectedCdmSummaries, cookbookFiles, rosettaFiles] =
    await Promise.all([
      Promise.all(fixturePaths.map(summarizeXmlFixture)),
      Promise.all(expectedCdmPaths.map(summarizeExpectedCdm)),
      collectCookbookSummaries(),
      collectRosettaSummaries(),
    ])
  const [rosettaGenerationContext, cdmRosettaPreflight] = await Promise.all([
    buildRosettaGenerationContext(),
    ensureCdmRosettaPreflightReport(),
  ])

  return {
    generatedAt: new Date().toISOString(),
    scope,
    fixtureSummaries,
    expectedCdmSummaries,
    cookbookFiles,
    rosettaFiles,
    rosettaGenerationContext,
    cdmRosettaPreflight,
    knownAbsentPaths: scope.knownAbsentPaths,
    notes: [
      'Use 00-product-scope.json as the authoritative FX product map.',
      'Use data/agent-cookbook/latest/product-families/fx-derivatives.md for cookbook rules.',
      'Use data/agent-cookbook/latest/references/fx-derivatives.evidence.json for evidence metadata.',
      'Rosetta source is authoritative for CDM mapping structure.',
      'Cookbook rules are secondary and must not override Rosetta source.',
      'Generated Java must use CDM/Rosetta Java model classes as the internal model.',
      'Jackson ObjectNode/ArrayNode are allowed for sidecar reports only, not CDM construction.',
      'Runtime support claims must be fixture-gated.',
      'Do not invent product roots, fixture paths, or cookbook paths.',
    ],
  }
}

export async function writeEvidencePacket(args: {
  packet: EvidencePacket
  markdownPath: string
  jsonPath: string
}): Promise<void> {
  await writeFile(args.markdownPath, renderEvidencePacketMarkdown(args.packet), 'utf8')
  await writeFile(args.jsonPath, JSON.stringify(args.packet, null, 2), 'utf8')
}

export function renderEvidencePacketMarkdown(packet: EvidencePacket): string {
  return `# Evidence Packet

Generated: ${packet.generatedAt}

${renderProductScopeMarkdown(packet.scope)}

## Fixture Summaries

${renderSummaries(packet.fixtureSummaries)}

## Expected CDM Summaries

${renderSummaries(packet.expectedCdmSummaries)}

## Cookbook Context

${renderSummaries(packet.cookbookFiles)}

## Rosetta Context

${renderSummaries(packet.rosettaFiles)}

## CDM/Rosetta Java Preflight

${renderCdmRosettaPreflightMarkdown(packet.cdmRosettaPreflight)}

## Rosetta Authoritative Context

${renderRosettaGenerationContext(packet.rosettaGenerationContext)}

## Known Absent Paths

${packet.knownAbsentPaths.map(path => `- ${path}`).join('\n')}

## Notes

${packet.notes.map(note => `- ${note}`).join('\n')}
`
}

async function summarizeXmlFixture(path: string): Promise<EvidenceFileSummary> {
  const fields = parseXML(await readFile(path, 'utf8'))
  return {
    path,
    summary: fields
      .slice(0, 120)
      .map(field => `${field.path}${field.value ? ` = ${field.value}` : ''}`)
      .join('\n'),
  }
}

async function summarizeExpectedCdm(path: string): Promise<EvidenceFileSummary> {
  const fields = parseJSON(await readFile(path, 'utf8'))
  return {
    path,
    summary: fields
      .slice(0, 120)
      .map(field => `${field.path}${field.value ? ` = ${field.value}` : ''}`)
      .join('\n'),
  }
}

async function collectCookbookSummaries(): Promise<EvidenceFileSummary[]> {
  const paths = [
    'data/agent-cookbook/latest/product-families/fx-derivatives.md',
    'data/agent-cookbook/latest/references/fx-derivatives.evidence.json',
  ]
  return Promise.all(paths.map(summarizeTextFile))
}

async function collectRosettaSummaries(): Promise<EvidenceFileSummary[]> {
  const paths = [
    'data/rosetta-source/latest/docs/product-families/fx.md',
    'data/rosetta-source/latest/docs/shared-ingest.md',
  ]
  return Promise.all(paths.map(summarizeTextFile))
}

async function summarizeTextFile(path: string): Promise<EvidenceFileSummary> {
  const content = await readFile(path, 'utf8')
  return {
    path,
    summary: content.split(/\r?\n/).slice(0, 160).join('\n'),
  }
}

function renderSummaries(summaries: EvidenceFileSummary[]): string {
  return summaries
    .map(
      summary => `### ${summary.path}

\`\`\`text
${summary.summary}
\`\`\``
    )
    .join('\n\n')
}
