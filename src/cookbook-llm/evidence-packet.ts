import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type {
  CookbookEvidenceSidecar,
  CookbookManifest,
  CookbookManifestFamily,
  CookbookManifestGlobalDocument,
  OperationalStatus,
} from '../cookbook/types'
import type {
  CookbookEvidencePacket,
  EvidenceReference,
  JsonObject,
} from './types'

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf8')) as T
}

export async function buildEvidencePackets(args: {
  deterministicRoot: string
  includeReviewOnly: boolean
  onlyPacketId?: string
}): Promise<CookbookEvidencePacket[]> {
  const manifest = await readJson<CookbookManifest>(join(args.deterministicRoot, 'manifest.json'))
  const packets: CookbookEvidencePacket[] = []

  packets.push(await buildIndexPacket(args.deterministicRoot, manifest))

  for (const globalDocument of manifest.globalDocuments) {
    packets.push(await buildGlobalPacket(args.deterministicRoot, globalDocument))
  }

  for (const family of manifest.families) {
    if (!args.includeReviewOnly && isNonOperational(family.operationalStatus)) continue
    packets.push(await buildFamilyPacket(args.deterministicRoot, family))
  }

  return args.onlyPacketId
    ? packets.filter(packet => packet.id === args.onlyPacketId)
    : packets
}

async function buildIndexPacket(
  root: string,
  manifest: CookbookManifest
): Promise<CookbookEvidencePacket> {
  const markdownPath = join(root, 'index.md')
  const deterministicMarkdown = await readFile(markdownPath, 'utf8')
  return {
    id: 'index',
    subjectType: 'index',
    title: 'FPML -> CDM Agent Cookbook',
    operationalStatus: 'ready',
    deterministicMarkdown,
    deterministicManifestEntry: toJsonObject(manifest),
    evidenceReferences: [
      {
        id: 'index:DETERMINISTIC',
        source: 'index.md',
        kind: 'deterministic',
        text: deterministicMarkdown.slice(0, 4000),
      },
    ],
    requiredSections: [
      'How To Use This Cookbook',
      'Operational Statuses',
      'Product Family Routing',
      'Proposed CDM Representation Format',
      'Universal Do Not Assume',
    ],
    allowedClaimsPolicy: [
      'Describe cookbook usage and routing only from the deterministic manifest.',
      'Do not add new product-family statuses or paths.',
      'Keep the proposal output format provider-neutral.',
    ],
  }
}

async function buildGlobalPacket(
  root: string,
  globalDocument: CookbookManifestGlobalDocument
): Promise<CookbookEvidencePacket> {
  const markdownPath = join(root, globalDocument.markdownPath)
  const deterministicMarkdown = await readFile(markdownPath, 'utf8')
  return {
    id: `global:${globalDocument.name}`,
    subjectType: 'global',
    title: globalDocument.name,
    operationalStatus: 'ready',
    deterministicMarkdown,
    deterministicManifestEntry: toJsonObject(globalDocument),
    evidenceReferences: [
      {
        id: `global:${globalDocument.name}:DETERMINISTIC`,
        source: globalDocument.markdownPath,
        kind: 'deterministic',
        text: deterministicMarkdown.slice(0, 8000),
      },
    ],
    requiredSections: [
      'Promoted Cross-Family Rules',
      'Family-Specific Evidence',
      'Do Not Assume',
      'Validation Checklist',
    ],
    allowedClaimsPolicy: [
      'Only promote cross-family guidance already present in the deterministic global document.',
      'Keep family-specific evidence separate from true global rules.',
      'Do not turn enrichment/default guidance into an automatic mapping rule.',
    ],
  }
}

async function buildFamilyPacket(
  root: string,
  family: CookbookManifestFamily
): Promise<CookbookEvidencePacket> {
  const markdownPath = join(root, family.markdownPath)
  const deterministicMarkdown = await readFile(markdownPath, 'utf8')
  const sidecar = await readJson<CookbookEvidenceSidecar>(join(root, family.evidencePath))

  return {
    id: `family:${family.folder}`,
    subjectType: 'family',
    title: `FPML -> CDM Cookbook: ${family.folder}`,
    operationalStatus: family.operationalStatus,
    deterministicMarkdown,
    deterministicManifestEntry: toJsonObject(family),
    sourceSidecar: toJsonObject(sidecar),
    evidenceReferences: buildFamilyEvidenceReferences(family.folder, sidecar),
    requiredSections: familyRequiredSections(family.operationalStatus),
    allowedClaimsPolicy: buildAllowedClaimsPolicy(family.operationalStatus),
  }
}

function buildFamilyEvidenceReferences(
  folder: string,
  sidecar: CookbookEvidenceSidecar
): EvidenceReference[] {
  const references: EvidenceReference[] = [
    {
      id: `${folder}:QUALITY`,
      source: sidecar.sourceDebug ?? sidecar.sourceDraft,
      kind: 'quality',
      text: JSON.stringify({
        evidenceCoverage: sidecar.evidenceCoverage,
        publication: sidecar.publication,
        qualityAssessment: sidecar.qualityAssessment,
        rolloutReadiness: sidecar.rolloutReadiness,
      }),
    },
  ]

  for (const rule of sidecar.stableMappingPatterns) {
    references.push({
      id: `${folder}:${rule.id}`,
      source: sidecar.sourceDraft,
      kind: 'rule',
      text: JSON.stringify(rule),
    })
  }

  for (const item of sidecar.repeatedNonLiteralTransformations) {
    references.push({
      id: `${folder}:${item.id}`,
      source: sidecar.sourceDraft,
      kind: 'transformation',
      text: JSON.stringify(item),
    })
  }

  for (const item of sidecar.tentativeRepeatedPatterns) {
    references.push({
      id: `${folder}:${item.id}`,
      source: sidecar.sourceDraft,
      kind: item.kind === 'enrichment' ? 'enrichment' : item.kind === 'transformation' ? 'transformation' : 'rule',
      text: JSON.stringify(item),
    })
  }

  for (const item of sidecar.variantsAndExceptions) {
    references.push({
      id: `${folder}:${item.id}`,
      source: sidecar.sourceDraft,
      kind: 'variant',
      text: JSON.stringify(item),
    })
  }

  for (const item of sidecar.suspectedEnrichmentOrDefaultBehavior) {
    references.push({
      id: `${folder}:${item.id}`,
      source: sidecar.sourceDraft,
      kind: 'enrichment',
      text: JSON.stringify(item),
    })
  }

  sidecar.openQuestions.forEach((question, index) => {
    references.push({
      id: `${folder}:OPEN-${String(index + 1).padStart(3, '0')}`,
      source: sidecar.sourceDraft,
      kind: 'open_question',
      text: question,
    })
  })

  return references
}

function familyRequiredSections(status: OperationalStatus): string[] {
  const common = [
    'Status',
    'Trigger Signals',
    'Canonical Mapping Procedure',
    'Do Not Assume',
    'Human Review Triggers',
    'Validation Checklist',
    'Source Evidence',
  ]
  if (status === 'blocked' || status === 'review_only') {
    return [...common, 'Operational Limitations']
  }
  return [
    ...common,
    'Stable Rules',
    'Transformations',
    'Variants And Branches',
    'Enrichment And Defaults',
    'Worked Examples',
  ]
}

function buildAllowedClaimsPolicy(status: OperationalStatus): string[] {
  if (status === 'ready') {
    return [
      'The packet operationalStatus is authoritative for cookbook routing; draft rolloutReadiness is only background quality evidence.',
      'Write operational mapping guidance only when the supplied evidence supports it.',
      'Every mapping rule must include source signals, CDM targets, validation checks, and review triggers where needed.',
    ]
  }
  if (status === 'pilot_only') {
    return [
      'The packet operationalStatus is authoritative for cookbook routing; draft rolloutReadiness is only background quality evidence.',
      'Write cautious operational guidance and require analyst confirmation for material mappings.',
      'Do not describe pilot-only evidence as broadly production-ready.',
    ]
  }
  if (status === 'review_only') {
    return [
      'Write review background and limitations only.',
      'Do not instruct agents to apply these rules automatically.',
    ]
  }
  return [
    'Write only why the folder is blocked and what evidence is missing.',
    'Do not provide semantic mapping instructions.',
  ]
}

function isNonOperational(status: OperationalStatus): boolean {
  return status === 'review_only' || status === 'blocked'
}

function toJsonObject(value: JsonObject | object): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject
}
