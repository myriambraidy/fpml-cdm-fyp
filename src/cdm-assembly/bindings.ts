import { canonicalTargetToPath } from '../mapping-ir/transform'
import type { CanonicalSegment, MappingIR } from '../mapping-ir/types'
import type { SourceModel } from '../source-model/types'
import type { BindingRegistry } from './types'

function sourceEntityForMapping(mapping: MappingIR, sourceModel?: SourceModel): string | undefined {
  if (!sourceModel) return mapping.grouping[0]?.entityKey
  const fromField = sourceModel.fieldToEntityKeys[mapping.source.path]?.[0]
  return fromField ?? mapping.grouping[0]?.entityKey
}

function resolveBindingKey(mapping: MappingIR, sourceModel?: SourceModel): string | undefined {
  return mapping.arrayBinding?.bindingKey ?? sourceEntityForMapping(mapping, sourceModel)
}

function getArrayRegistryKey(pathParts: string[], bindingKey: string): string {
  return `${pathParts.join('.')}:${bindingKey}`
}

function getRepeatingPropertyRegistryKey(
  pathParts: string[],
  bindingKey: string
): string {
  return `prop:${pathParts.join('.')}::${bindingKey}`
}

function registerStableBinding(args: {
  registry: BindingRegistry
  perPath: Map<string, Map<string, number>>
  registryKey: string
  pathKey: string
  targetPath: string
  bindingKey: string
  preferredIndex?: number
  sourceEntityKey?: string
  sourcePath: string
}) {
  const bucket = args.perPath.get(args.pathKey) ?? new Map<string, number>()
  if (!args.perPath.has(args.pathKey)) {
    args.perPath.set(args.pathKey, bucket)
  }

  if (!bucket.has(args.bindingKey)) {
    bucket.set(
      args.bindingKey,
      args.preferredIndex ?? bucket.size
    )
  }

  const stableIndex = bucket.get(args.bindingKey) ?? 0
  const existing = args.registry[args.registryKey]
  if (existing) {
    existing.sourcePaths.push(args.sourcePath)
    return
  }

  args.registry[args.registryKey] = {
    targetPath: args.targetPath,
    bindingKey: args.bindingKey,
    stableIndex,
    sourceEntityKey: args.sourceEntityKey,
    sourcePaths: [args.sourcePath],
  }
}

export function assignStableBindings(
  mappings: MappingIR[],
  sourceModel?: SourceModel
): BindingRegistry {
  const registry: BindingRegistry = {}
  const perRepeatablePath = new Map<string, Map<string, number>>()

  for (const mapping of mappings) {
    const resolvedBindingKey = resolveBindingKey(mapping, sourceModel)
    const preferredIndex =
      mapping.arrayBinding?.sourceIndex ?? mapping.grouping[0]?.rankHint
    const arrSegments = mapping.target.pathTemplate.segments.filter(
      (segment): segment is Extract<typeof segment, { kind: 'array' }> =>
        segment.kind === 'array'
    )
    const entityKey = sourceEntityForMapping(mapping, sourceModel)
    let prefixSegments: CanonicalSegment[] = []
    let prefixNames: string[] = []

    for (const segment of mapping.target.pathTemplate.segments) {
      if (segment.kind === 'property') {
        prefixSegments.push(segment)
        prefixNames.push(segment.name)
        continue
      }

      prefixSegments.push(segment)
      prefixNames.push(segment.name)
      const arrayPath = prefixNames.join('.')
      const targetArrayPath = canonicalTargetToPath({
        root: mapping.target.pathTemplate.root,
        segments: prefixSegments,
      })
      registerStableBinding({
        registry,
        perPath: perRepeatablePath,
        registryKey: getArrayRegistryKey(prefixNames, segment.bindingKey),
        pathKey: arrayPath,
        targetPath: targetArrayPath,
        bindingKey: segment.bindingKey,
        preferredIndex,
        sourceEntityKey: entityKey,
        sourcePath: mapping.source.path,
      })
    }

    const lastSegment =
      mapping.target.pathTemplate.segments[mapping.target.pathTemplate.segments.length - 1]
    if (
      arrSegments.length === 0 &&
      lastSegment?.kind === 'property' &&
      mapping.arrayBinding?.cardinality === 'repeating' &&
      resolvedBindingKey
    ) {
      const targetPath = canonicalTargetToPath(mapping.target.pathTemplate)
      registerStableBinding({
        registry,
        perPath: perRepeatablePath,
        registryKey: getRepeatingPropertyRegistryKey([targetPath], resolvedBindingKey),
        pathKey: `prop:${targetPath}`,
        targetPath,
        bindingKey: resolvedBindingKey,
        preferredIndex,
        sourceEntityKey: entityKey,
        sourcePath: mapping.source.path,
      })
    }
  }

  return registry
}
