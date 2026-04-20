export type CollisionFinding = {
  code:
    | 'same_target_multiple_sources'
    | 'container_leaf_overlap'
    | 'conflicting_scalar_values'
    | 'missing_array_binding'
  severity: 'info' | 'warn' | 'error'
  targetPath: string
  sourcePaths: string[]
  message: string
}

export type CoverageFinding = {
  code:
    | 'approved_mapping_not_applied'
    | 'mapping_applied_with_fallback'
    | 'unmapped_entity_group'
    | 'diagnostic_suppressed_export'
  severity: 'info' | 'warn' | 'error'
  sourcePath?: string
  targetPath?: string
  message: string
}

export type AssemblyDiagnostics = {
  collisions: CollisionFinding[]
  coverage: CoverageFinding[]
}
