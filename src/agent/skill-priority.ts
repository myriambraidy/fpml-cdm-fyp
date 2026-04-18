import type { Skill } from '../skills/types'

/**
 * Deterministic tie-break when multiple skills match one field (D5, plans/week2-implementation-plan.md).
 * Order: product-specific → index → party → temporal → generic units.
 * docs/schemas/mapping-domains.md — IR swap + floating index as "should have" vs generic unit normalizer.
 */
const SKILL_PRIORITY: readonly string[] = [
  'ir_swap_resolver',
  'floating_rate_index_resolver',
  'party_resolver',
  'temporal_mapper',
  'unit_normalizer',
] as const

const rank = (name: string): number => {
  const i = SKILL_PRIORITY.indexOf(name)
  return i === -1 ? 999 : i
}

export const sortMatchedSkills = (matched: Skill[]): Skill[] =>
  [...matched].sort((a, b) => rank(a.name) - rank(b.name))
