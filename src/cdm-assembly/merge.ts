import type { MappingValue } from '../mapping-ir/types'

export function mappingValueToNode(value: MappingValue): unknown {
  switch (value.kind) {
    case 'raw_scalar':
      return value.value
    case 'enum':
      return value.normalized
    case 'period':
      return {
        periodMultiplier: value.multiplier,
        period: value.unit,
      }
    case 'reference':
      return value.resolvedId ?? value.raw
    case 'schedule_marker':
      return []
    case 'object_marker':
      return {}
    case 'composite_hint':
      return value.raw ?? value.hint
    default:
      return undefined
  }
}
