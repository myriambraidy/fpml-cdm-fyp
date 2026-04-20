import type { Field } from '../parser/types'
import { buildSourceModel } from '../source-model/build-groups'
import type { SourceModel } from '../source-model/types'

/**
 * Document-level state for orchestration (DEC-05, plans/week2-implementation-plan.md §0).
 * Week 2: `partyOrder` only — party ids / href targets in first-seen document order.
 */
export interface OrchestrationContext {
  readonly partyOrder: readonly string[]
  readonly sourceModel: SourceModel
}

/**
 * Heuristic: collect party identifiers from `partyId`, `*PartyReference` leaf values.
 * See docs/schemas/fpml-structure.md (party id / href pattern).
 */
export const buildOrchestrationContext = (fields: Field[]): OrchestrationContext => {
  const partyOrder: string[] = []
  const seen = new Set<string>()

  for (const f of fields) {
    const n = f.name.toLowerCase()
    const v = f.value?.trim()
    if (!v) continue

    const isPartyId = n === 'partyid' || n === 'partyidentifier'
    const isPartyRef =
      n.endsWith('partyreference') ||
      n === 'partyreference' ||
      n.endsWith('href')

    if (isPartyId || isPartyRef) {
      if (!seen.has(v)) {
        seen.add(v)
        partyOrder.push(v)
      }
    }
  }

  return {
    partyOrder,
    sourceModel: buildSourceModel(fields),
  }
}
