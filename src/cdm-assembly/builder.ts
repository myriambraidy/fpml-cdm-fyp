import { assignStableBindings } from './bindings'
import { mappingValueToNode } from './merge'
import type { BindingRegistry } from './types'
import type { MappingIR, CanonicalSegment } from '../mapping-ir/types'
import type { SourceModel } from '../source-model/types'
import { findMappingCollisions } from '../diagnostics/mapping-collisions'
import { buildCoverageFindings } from '../diagnostics/coverage'
import type { AssemblyDiagnostics } from '../diagnostics/report'

function getArrayRegistryKey(pathParts: string[], bindingKey: string): string {
  return `${pathParts.join('.')}:${bindingKey}`
}

function getRepeatingPropertyRegistryKey(
  pathParts: string[],
  bindingKey: string
): string {
  return `prop:${pathParts.join('.')}::${bindingKey}`
}

function ensureObjectRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value != null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

const PACKAGE_META_PREFIX = 'packageMeta.'

/** Writes `packageMeta.a.b` targets into the root `meta` object (provenance / messaging / FPML-only). */
function mergePackageMetaFromMappings(
  target: Record<string, unknown>,
  mappings: MappingIR[],
  appliedSourcePaths?: Set<string>
): void {
  for (const mapping of mappings) {
    const lp = mapping.target.legacyPath
    if (!lp.startsWith(PACKAGE_META_PREFIX)) continue
    const sub = lp.slice(PACKAGE_META_PREFIX.length)
    if (!sub) continue
    const parts = sub.split('.').filter(Boolean)
    let c = target
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]!
      const next = c[p]
      if (typeof next !== 'object' || next === null || Array.isArray(next)) {
        c[p] = {}
      }
      c = ensureObjectRecord(c[p])
    }
    const leaf = parts[parts.length - 1]!
    c[leaf] = mappingValueToNode(mapping.value)
    appliedSourcePaths?.add(mapping.source.path)
  }
}

function resolveRepeatingPropertyIndex(args: {
  pathParts: string[]
  bindingRegistry: BindingRegistry
  mapping: MappingIR
  existingArrayLength: number
}): number {
  const bindingKey =
    args.mapping.arrayBinding?.bindingKey ?? args.mapping.grouping[0]?.entityKey
  if (bindingKey) {
    const registryKey = getRepeatingPropertyRegistryKey(args.pathParts, bindingKey)
    const binding = args.bindingRegistry[registryKey]
    if (binding) {
      return binding.stableIndex
    }
  }
  return args.mapping.arrayBinding?.sourceIndex ?? args.existingArrayLength
}

function setCanonicalValue(args: {
  container: Record<string, unknown>
  mapping: MappingIR
  bindingRegistry: BindingRegistry
  appliedSourcePaths: Set<string>
}) {
  const { container, mapping, bindingRegistry, appliedSourcePaths } = args
  const parts: string[] = []
  let cursor: Record<string, unknown> = container

  for (let i = 0; i < mapping.target.pathTemplate.segments.length; i++) {
    const segment: CanonicalSegment = mapping.target.pathTemplate.segments[i]!
    const isLast = i === mapping.target.pathTemplate.segments.length - 1

    if (segment.kind === 'property') {
      parts.push(segment.name)
      if (isLast) {
        if (mapping.arrayBinding?.cardinality === 'repeating') {
          const existingValue = cursor[segment.name]
          const existingArray: unknown[] = Array.isArray(existingValue) ? existingValue : []
          const index = resolveRepeatingPropertyIndex({
            pathParts: [...parts],
            bindingRegistry,
            mapping,
            existingArrayLength: existingArray.length,
          })
          while (existingArray.length <= index) existingArray.push(null)
          existingArray[index] =
            mapping.target.leafKind === 'object_marker'
              ? ensureObjectRecord(existingArray[index])
              : mappingValueToNode(mapping.value)
          cursor[segment.name] = existingArray
          appliedSourcePaths.add(mapping.source.path)
          return
        }
        if (
          mapping.target.leafKind === 'object_marker' &&
          typeof cursor[segment.name] === 'object' &&
          cursor[segment.name] != null
        ) {
          appliedSourcePaths.add(mapping.source.path)
          return
        }
        if (mapping.target.leafKind === 'schedule_marker') {
          if (!Array.isArray(cursor[segment.name])) {
            cursor[segment.name] = []
          }
          appliedSourcePaths.add(mapping.source.path)
          return
        }
        cursor[segment.name] = mappingValueToNode(mapping.value)
        appliedSourcePaths.add(mapping.source.path)
        return
      }

      const next = cursor[segment.name]
      if (typeof next !== 'object' || next == null || Array.isArray(next)) {
        cursor[segment.name] = {}
      }
      cursor = ensureObjectRecord(cursor[segment.name])
      continue
    }

    parts.push(segment.name)
    const registryKey = getArrayRegistryKey(parts, segment.bindingKey)
    const binding = bindingRegistry[registryKey]
    if (!binding) {
      return
    }
    const existing = cursor[segment.name]
    const arr = Array.isArray(existing) ? existing : []
    while (arr.length <= binding.stableIndex) arr.push({})

    if (isLast) {
      const value = mappingValueToNode(mapping.value)
      if (mapping.target.leafKind === 'object_marker') {
        const currentObj = ensureObjectRecord(arr[binding.stableIndex])
        arr[binding.stableIndex] = currentObj
      } else if (mapping.target.leafKind === 'schedule_marker') {
        if (!Array.isArray(arr[binding.stableIndex])) {
          arr[binding.stableIndex] = []
        }
      } else {
        arr[binding.stableIndex] = value
      }
      cursor[segment.name] = arr
      appliedSourcePaths.add(mapping.source.path)
      return
    }

    const next = arr[binding.stableIndex]
    if (typeof next !== 'object' || next == null || Array.isArray(next)) {
      arr[binding.stableIndex] = {}
    }
    cursor[segment.name] = arr
    cursor = ensureObjectRecord(arr[binding.stableIndex])
  }
}

export function buildCdmCandidate(args: {
  mappings: MappingIR[]
  sourceModel?: SourceModel
  root: 'tradeState' | 'trade' | 'businessEvent'
  meta?: Record<string, unknown>
}): {
  cdmPayload: Record<string, unknown>
  provenance: Record<string, unknown>
  diagnostics: AssemblyDiagnostics
  bindingRegistry: BindingRegistry
  appliedSourcePaths: Set<string>
} {
  const bindingRegistry = assignStableBindings(args.mappings, args.sourceModel)
  const appliedSourcePaths = new Set<string>()
  const collisions = findMappingCollisions(args.mappings)

  const mergedMeta = ensureObjectRecord(
    args.meta !== undefined && args.meta !== null && typeof args.meta === 'object'
      ? { ...(args.meta as Record<string, unknown>) }
      : {}
  )
  mergePackageMetaFromMappings(mergedMeta, args.mappings, appliedSourcePaths)

  const root: Record<string, unknown> = {
    [args.root]: {},
  }

  const container = ensureObjectRecord(root[args.root])

  for (const mapping of args.mappings) {
    const lp = mapping.target.legacyPath
    if (lp.startsWith('unmapped.') || lp.startsWith(PACKAGE_META_PREFIX)) {
      continue
    }
    setCanonicalValue({
      container,
      mapping,
      bindingRegistry,
      appliedSourcePaths,
    })
  }

  const coverage = buildCoverageFindings({
    mappings: args.mappings,
    appliedSourcePaths,
    sourceModel: args.sourceModel,
  })

  return {
    cdmPayload: root,
    provenance: mergedMeta,
    diagnostics: { collisions, coverage },
    bindingRegistry,
    appliedSourcePaths,
  }
}
