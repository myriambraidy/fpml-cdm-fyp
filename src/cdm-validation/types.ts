export interface ValidationFinding {
  path: string
  code: string
  message: string
}

export interface ValidationResult {
  ok: boolean
  errors: ValidationFinding[]
}

export interface SemanticValidationResult extends ValidationResult {
  validatorKind: string
  validatorVersion?: string
  rootType: string
}

export interface RepairHint {
  stage: 'structural' | 'semantic'
  summary: string
  errors: Array<ValidationFinding & { repairHint: string }>
}
