import type { Field } from '../../parser/types'
import type { ScheduleEntity } from '../types'

function normalizeKey(raw: string): string {
  return raw
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

export function groupScheduleEntities(fields: Field[]): ScheduleEntity[] {
  const byPath = new Map<string, ScheduleEntity>()

  const touch = (collectionPath: string, name: string): ScheduleEntity => {
    const existing = byPath.get(collectionPath)
    if (existing) return existing
    const created: ScheduleEntity = {
      kind: 'schedule',
      entityKey: normalizeKey(name || collectionPath || 'schedule') || 'schedule',
      sourcePaths: [],
      sourceCollectionPath: collectionPath,
      items: [],
    }
    byPath.set(collectionPath, created)
    return created
  }

  for (const field of fields) {
    const lowerName = field.name.toLowerCase()
    const lowerPath = field.path.toLowerCase()
    const scheduleLike =
      field.isArray === true ||
      lowerName.includes('dates') ||
      lowerName.includes('schedule') ||
      lowerPath.includes('paymentdates') ||
      lowerPath.includes('resetdates') ||
      lowerPath.includes('fixingdates')

    if (!scheduleLike) continue

    if (field.isArray) {
      const entity = touch(field.path, field.name)
      entity.sourcePaths.push(field.path)
      continue
    }

    const parentPathMatch = field.path.match(/^(.*)\[(\d+)\]$/)
    if (parentPathMatch) {
      const [, collectionPath, idxRaw] = parentPathMatch
      const entity = touch(collectionPath, field.name)
      entity.sourcePaths.push(field.path)
      entity.items.push({
        sourcePath: field.path,
        value: field.value,
        index: Number(idxRaw),
      })
      continue
    }

    if (lowerName.includes('date') || lowerName.includes('schedule')) {
      const collectionPath =
        (field.context?.parentPath as string | undefined) ||
        field.path
      const entity = touch(collectionPath, field.name)
      entity.sourcePaths.push(field.path)
    }
  }

  for (const entity of byPath.values()) {
    entity.items.sort((a, b) => a.index - b.index)
  }

  return Array.from(byPath.values())
}
