import type {
  AuthoredPageResult,
  CookbookEvidencePacket,
  LlmCookbookManifest,
} from './types'

export function buildLlmCookbookManifest(args: {
  generatedAt: string
  mode: LlmCookbookManifest['mode']
  deterministicRoot: string
  outputRoot: string
  sourceManifest: LlmCookbookManifest['sourceManifest']
  packets: CookbookEvidencePacket[]
  results: AuthoredPageResult[]
}): LlmCookbookManifest {
  return {
    generatedAt: args.generatedAt,
    mode: args.mode,
    deterministicRoot: args.deterministicRoot,
    outputRoot: args.outputRoot,
    sourceManifest: args.sourceManifest,
    pages: args.results.map(result => {
      const packet = args.packets.find(item => item.id === result.packetId)
      return {
        packetId: result.packetId,
        title: result.title,
        subjectType: result.subjectType,
        finalDecision: result.finalDecision,
        markdownPath: packet ? markdownPathForPacket(packet) : `failed/${safeName(result.packetId)}.md`,
        iterationCount: result.iterations.length,
      }
    }),
  }
}

export function markdownPathForPacket(packet: CookbookEvidencePacket): string {
  if (packet.subjectType === 'index') return 'index.md'
  if (packet.subjectType === 'global') return `global/${safeName(packet.id.replace(/^global:/, ''))}.md`
  const family = safeName(packet.id.replace(/^family:/, ''))
  if (packet.operationalStatus === 'ready' || packet.operationalStatus === 'pilot_only') {
    return `product-families/${family}.md`
  }
  return `review-only/${family}.md`
}

export function safeName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-')
}
