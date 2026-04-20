import type { MappingIR } from '../mapping-ir/types'
import { canonicalTargetToPath } from '../mapping-ir/transform'
import type { CollisionFinding } from './report'

function collisionBucketKey(mapping: MappingIR): string {
  const target = canonicalTargetToPath(mapping.target.pathTemplate)
  const hasArraySegment = mapping.target.pathTemplate.segments.some(
    segment => segment.kind === 'array'
  )
  const bindingKey =
    mapping.arrayBinding?.cardinality === 'repeating' && !hasArraySegment
      ? mapping.arrayBinding.bindingKey ?? mapping.grouping[0]?.entityKey
      : undefined
  return bindingKey ? `${target}::${bindingKey}` : target
}

export function findMappingCollisions(mappings: MappingIR[]): CollisionFinding[] {
  const collisions: CollisionFinding[] = []
  const byTarget = new Map<string, MappingIR[]>()

  for (const mapping of mappings) {
    const target = collisionBucketKey(mapping)
    const list = byTarget.get(target) ?? []
    list.push(mapping)
    byTarget.set(target, list)
  }

  for (const list of byTarget.values()) {
    const targetPath = canonicalTargetToPath(list[0]!.target.pathTemplate)
    if (list.length > 1) {
      const uniqueValues = new Set(
        list.map(mapping =>
          mapping.value.kind === 'raw_scalar'
            ? mapping.value.value ?? ''
            : JSON.stringify(mapping.value)
        )
      )
      collisions.push({
        code:
          uniqueValues.size > 1
            ? 'conflicting_scalar_values'
            : 'same_target_multiple_sources',
        severity: uniqueValues.size > 1 ? 'error' : 'warn',
        targetPath,
        sourcePaths: list.map(mapping => mapping.source.path),
        message:
          uniqueValues.size > 1
            ? `Conflicting values detected for target ${targetPath}`
            : `Multiple source fields map to target ${targetPath}`,
      })
    }

    if (list.some(mapping => mapping.diagnostics.some(d => d.code === 'missing_binding'))) {
      collisions.push({
        code: 'missing_array_binding',
        severity: 'error',
        targetPath,
        sourcePaths: list.map(mapping => mapping.source.path),
        message: `Target ${targetPath} depends on at least one unresolved array binding`,
      })
    }
  }

  for (let i = 0; i < mappings.length; i++) {
    for (let j = i + 1; j < mappings.length; j++) {
      const a = canonicalTargetToPath(mappings[i]!.target.pathTemplate)
      const b = canonicalTargetToPath(mappings[j]!.target.pathTemplate)
      if (a === b) continue
      if (a.startsWith(`${b}.`) || b.startsWith(`${a}.`)) {
        collisions.push({
          code: 'container_leaf_overlap',
          severity: 'warn',
          targetPath: a.length < b.length ? a : b,
          sourcePaths: [mappings[i]!.source.path, mappings[j]!.source.path],
          message: `Overlapping target subtrees detected between ${a} and ${b}`,
        })
      }
    }
  }

  return collisions
}
