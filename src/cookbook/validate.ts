import { basename } from 'node:path'
import type {
  CookbookFamilyDocument,
  CookbookGlobalDocument,
  CookbookRule,
  CookbookValidationIssue,
  LoadedDraftFamily,
} from './types'

export function validateCookbookDocument(document: CookbookFamilyDocument): CookbookValidationIssue[] {
  const issues: CookbookValidationIssue[] = []
  const rules = collectFamilyRules(document)

  for (const rule of rules) {
    if (isOperationalRule(rule)) {
      if (rule.sourceSignals.length === 0) {
        issues.push(issue('error', 'missing_source_signals', 'Operational rule is missing source signals.', document.folder, rule.id))
      }
      if (rule.targetPaths.length === 0 && rule.kind === 'mapping') {
        issues.push(issue('error', 'missing_target_paths', 'Operational mapping rule is missing target CDM paths.', document.folder, rule.id))
      }
      if (rule.validationChecks.length === 0) {
        issues.push(issue('error', 'missing_validation', 'Operational rule is missing validation checks.', document.folder, rule.id))
      }
      if (rule.confidence === 'low' && rule.humanReviewTriggers.length === 0) {
        issues.push(
          issue(
            'warning',
            'low_confidence_without_review_trigger',
            'Low-confidence rule should tell the agent when to ask for analyst review.',
            document.folder,
            rule.id
          )
        )
      }
    }
  }

  if (document.doNotAssume.length === 0) {
    issues.push(issue('error', 'missing_do_not_assume', 'Every family cookbook must contain hard negative instructions.', document.folder))
  }

  return issues
}

export function validateGlobalDocuments(documents: CookbookGlobalDocument[]): CookbookValidationIssue[] {
  const issues: CookbookValidationIssue[] = []

  for (const document of documents) {
    for (const rule of document.rules) {
      if (!isOperationalRule(rule)) {
        issues.push(
          issue(
            'error',
            'non_operational_global_rule',
            'Promoted global rules must come from ready or pilot-only documents.',
            document.slug,
            rule.id
          )
        )
      }
      if (countRuleFamilies(document.rules, rule.title) < 2) {
        issues.push(
          issue(
            'error',
            'single_family_global_rule',
            'Promoted global rules must be backed by at least two product families.',
            document.slug,
            rule.id
          )
        )
      }
    }
    for (const rule of document.familySpecificRules) {
      if (!isOperationalRule(rule)) {
        issues.push(
          issue(
            'error',
            'non_operational_family_specific_rule',
            'Global family-specific evidence must come from ready or pilot-only documents.',
            document.slug,
            rule.id
          )
        )
      }
    }
  }

  return issues
}

export function validateRuleEvidence(args: {
  family: LoadedDraftFamily
  document: CookbookFamilyDocument
}): CookbookValidationIssue[] {
  const allowed = buildAllowedReferences(args.family)
  const issues: CookbookValidationIssue[] = []

  for (const rule of collectFamilyRules(args.document)) {
    for (const file of rule.evidence.files.filter(looksLikeExampleReference)) {
      if (!isAllowedReference(file, allowed)) {
        issues.push(
          issue(
            'warning',
            'unexpected_evidence_reference',
            `Rule cites an example that is not in the source pair evidence: ${file}`,
            args.document.folder,
            rule.id
          )
        )
      }
    }
  }

  return issues
}

export function splitValidationIssues(issues: CookbookValidationIssue[]): {
  errorCount: number
  warningCount: number
} {
  return {
    errorCount: issues.filter(item => item.severity === 'error').length,
    warningCount: issues.filter(item => item.severity === 'warning').length,
  }
}

function collectFamilyRules(document: CookbookFamilyDocument): CookbookRule[] {
  return [
    ...document.stableRules,
    ...document.transformations,
    ...document.variants,
    ...document.enrichments,
    ...document.cautions,
  ]
}

function isOperationalRule(rule: CookbookRule): boolean {
  return rule.operationalStatus === 'ready' || rule.operationalStatus === 'pilot_only'
}

function countRuleFamilies(rules: CookbookRule[], title: string): number {
  const normalizedTitle = normalizeTitle(title)
  const families = new Set(
    rules
      .filter(rule => normalizeTitle(rule.title) === normalizedTitle)
      .map(rule => rule.family)
      .filter((family): family is string => !!family)
  )
  return families.size
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function buildAllowedReferences(family: LoadedDraftFamily): Set<string> {
  const allowed = new Set<string>()
  for (const analysis of family.artifact.pairAnalyses) {
    const fpmlRelative = analysis.pair.fpmlRelativePath.replaceAll('\\', '/')
    const cdmRelative = analysis.pair.cdmRelativePath.replaceAll('\\', '/')
    allowed.add(fpmlRelative)
    allowed.add(cdmRelative)
    allowed.add(basename(fpmlRelative))
    allowed.add(basename(cdmRelative))
  }
  return allowed
}

function looksLikeExampleReference(value: string): boolean {
  return /\.(xml|json)$/i.test(value.trim())
}

function isAllowedReference(reference: string, allowed: Set<string>): boolean {
  const trimmed = reference.trim().replaceAll('\\', '/')
  return allowed.has(trimmed) || allowed.has(basename(trimmed))
}

function issue(
  severity: CookbookValidationIssue['severity'],
  code: string,
  message: string,
  document?: string,
  ruleId?: string
): CookbookValidationIssue {
  return {
    severity,
    code,
    message,
    document,
    ruleId,
  }
}
