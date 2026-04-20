import type { Field } from '../../parser/types'
import type { StreamEntity } from '../types'

function streamPrefix(path: string): { key: string; order: number } | null {
  const jsonMatch = path.match(/^(.*?\.swapStream(?:s)?\[(\d+)\])/i)
  if (jsonMatch) {
    return {
      key: `stream_${jsonMatch[2]}`,
      order: Number(jsonMatch[2]),
    }
  }

  const xmlIdxMatch = path.match(/^(.*?\/swapStream\[(\d+)\])/i)
  if (xmlIdxMatch) {
    return {
      key: `stream_${xmlIdxMatch[2]}`,
      order: Number(xmlIdxMatch[2]),
    }
  }

  if (path.toLowerCase().includes('/swapstream')) {
    return {
      key: 'stream_0',
      order: 0,
    }
  }

  return null
}

export function groupStreamEntities(fields: Field[]): StreamEntity[] {
  const byKey = new Map<string, StreamEntity>()

  const touch = (key: string, order: number): StreamEntity => {
    const existing = byKey.get(key)
    if (existing) return existing
    const created: StreamEntity = {
      kind: 'stream',
      entityKey: key,
      sourcePaths: [],
      order,
    }
    byKey.set(key, created)
    return created
  }

  for (const field of fields) {
    const stream = streamPrefix(field.path)
    if (!stream) continue
    const entity = touch(stream.key, stream.order)
    entity.sourcePaths.push(field.path)

    const lowerName = field.name.toLowerCase()
    if (lowerName.includes('payerpartyreference')) {
      entity.payerRef = field.value
    }
    if (lowerName.includes('receiverpartyreference')) {
      entity.receiverRef = field.value
    }
    if (lowerName.includes('fixedrate')) {
      entity.rateType = 'fixed'
    }
    if (lowerName.includes('floatingrate')) {
      entity.rateType = 'floating'
    }
  }

  return Array.from(byKey.values()).sort((a, b) => a.order - b.order)
}
