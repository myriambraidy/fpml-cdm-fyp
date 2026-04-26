import type {
  CookbookFamilyDocument,
  CookbookGlobalDocument,
  CookbookValidationIssue,
} from './types'

export interface CookbookPolishResult {
  familyDocuments: CookbookFamilyDocument[]
  globalDocuments: CookbookGlobalDocument[]
  validationIssues: CookbookValidationIssue[]
  applied: boolean
}

export function runEvidenceLockedPolish(args: {
  enabled: boolean
  familyDocuments: CookbookFamilyDocument[]
  globalDocuments: CookbookGlobalDocument[]
  validationIssues: CookbookValidationIssue[]
}): CookbookPolishResult {
  if (!args.enabled) {
    return {
      familyDocuments: args.familyDocuments,
      globalDocuments: args.globalDocuments,
      validationIssues: args.validationIssues,
      applied: false,
    }
  }

  return {
    familyDocuments: args.familyDocuments,
    globalDocuments: args.globalDocuments,
    validationIssues: [
      ...args.validationIssues,
      {
        severity: 'warning',
        code: 'polish_not_configured',
        message: 'Evidence-locked polish was requested, but no external polish provider is configured; deterministic text was preserved.',
      },
    ],
    applied: false,
  }
}
