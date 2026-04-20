import type { Field } from '../../parser/types'
import type { PartyEntity } from '../types'

function normalizeKey(raw: string): string {
  return raw
    .replace(/[^a-zA-Z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

function roleFromValue(raw?: string): PartyEntity['role'] {
  const value = raw?.toLowerCase()
  if (value === 'buyer') return 'buyer'
  if (value === 'seller') return 'seller'
  if (value === 'payer') return 'payer'
  if (value === 'receiver') return 'receiver'
  if (value === 'counterparty') return 'counterparty'
  return undefined
}

function roleFromPath(path: string): PartyEntity['role'] {
  const lower = path.toLowerCase()
  if (lower.includes('buyer')) return 'buyer'
  if (lower.includes('seller')) return 'seller'
  if (lower.includes('receiver')) return 'receiver'
  if (lower.includes('payer')) return 'payer'
  if (lower.includes('counterparty')) return 'counterparty'
  return undefined
}

export function groupPartyEntities(fields: Field[]): PartyEntity[] {
  const byKey = new Map<string, PartyEntity>()

  const touch = (key: string, seed?: Partial<PartyEntity>): PartyEntity => {
    const existing = byKey.get(key)
    if (existing) return existing
    const created: PartyEntity = {
      kind: 'party',
      entityKey: key,
      sourcePaths: [],
      ...seed,
    }
    byKey.set(key, created)
    return created
  }

  for (const field of fields) {
    const lowerName = field.name.toLowerCase()
    const lowerPath = field.path.toLowerCase()

    if (field.path.startsWith('$') && lowerPath.includes('.parties[')) {
      const idxMatch = field.path.match(/\.parties\[(\d+)\]/)
      const idx = idxMatch?.[1] ?? '0'
      const key = `json_party_${idx}`
      const entity = touch(key)
      entity.sourcePaths.push(field.path)
      if (lowerName === 'role') {
        entity.role = roleFromValue(field.value)
      }
      if (lowerName === 'id') {
        entity.partyId = field.value
      }
      continue
    }

    if (lowerName === 'parties' && field.isArray) {
      continue
    }

    if (
      lowerName.includes('partyreference') ||
      lowerName === 'partyid' ||
      lowerName === 'partyidentifier' ||
      lowerName === 'counterparty'
    ) {
      const ref = field.value || (field.context?.href as string | undefined)
      const key = normalizeKey(ref || field.name || 'party')
      const entity = touch(key, {
        partyId: ref,
        href: ref,
      })
      entity.role ??= roleFromPath(field.path)
      entity.sourcePaths.push(field.path)
    }
  }

  return Array.from(byKey.values())
}
