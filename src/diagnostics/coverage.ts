import type { MappingIR } from '../mapping-ir/types'
import type { SourceModel } from '../source-model/types'
import type { CoverageFinding } from './report'

export function buildCoverageFindings(args: {
  mappings: MappingIR[]
  appliedSourcePaths: Set<string>
  sourceModel?: SourceModel
}): CoverageFinding[] {
  const findings: CoverageFinding[] = []

  for (const mapping of args.mappings) {
    if (!args.appliedSourcePaths.has(mapping.source.path)) {
      findings.push({
        code: 'approved_mapping_not_applied',
        severity: 'error',
        sourcePath: mapping.source.path,
        targetPath: mapping.target.legacyPath,
        message: `Approved mapping for ${mapping.source.path} was not applied during CDM assembly`,
      })
    }

    if (mapping.target.legacyPath !== mapping.target.legacyPath.trim()) {
      findings.push({
        code: 'mapping_applied_with_fallback',
        severity: 'info',
        sourcePath: mapping.source.path,
        targetPath: mapping.target.legacyPath,
        message: `Legacy path for ${mapping.source.path} required fallback normalization`,
      })
    }
  }

  if (args.sourceModel) {
    for (const entity of args.sourceModel.entities) {
      const touched = entity.sourcePaths.some(path => args.appliedSourcePaths.has(path))
      if (!touched) {
        findings.push({
          code: 'unmapped_entity_group',
          severity: 'warn',
          sourcePath: entity.sourcePaths[0],
          message: `Grouped source entity ${entity.entityKey} (${entity.kind}) did not contribute to assembled output`,
        })
      }
    }
  }

  return findings
}
