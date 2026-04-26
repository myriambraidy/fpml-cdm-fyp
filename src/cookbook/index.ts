import { buildRunOutputDirectory, writeCookbookArtifacts } from './io'
import { loadDraftFamilies } from './load-drafts'
import { computeFamilyReadiness } from './readiness'
import {
  buildFamilyDocument,
  extractCookbookRules,
} from './extract-rules'
import { buildGlobalDocuments } from './globalize-rules'
import { buildCookbookManifest, buildEvidenceSidecar } from './render-json'
import { runEvidenceLockedPolish } from './polish'
import { loadFolderOverrides, applyFolderOverride } from './folder-overrides'
import { compareWithLatest } from './compare'
import {
  splitValidationIssues,
  validateCookbookDocument,
  validateGlobalDocuments,
  validateRuleEvidence,
} from './validate'
import type {
  CookbookConfig,
  CookbookFamilyDocument,
  CookbookRunResult,
  LoadedDraftFamily,
} from './types'

export async function runCookbookPhase(args: {
  config: CookbookConfig
}): Promise<CookbookRunResult> {
  const generatedAt = new Date().toISOString()
  const outputDirectory = buildRunOutputDirectory({
    outputRoot: args.config.outputRoot,
    mode: args.config.mode,
    generatedAt,
  })
  const families = await loadDraftFamilies(args.config.draftsRoot)
  const folderOverrides = await loadFolderOverrides(args.config.folderOverridesPath)
  const familyDocuments: CookbookFamilyDocument[] = []
  const includedFamilies: LoadedDraftFamily[] = []

  for (const family of families) {
    const readiness = applyFolderOverride({
      readiness: computeFamilyReadiness(family),
      overrides: folderOverrides,
    })
    if (
      (readiness.operationalStatus === 'review_only' || readiness.operationalStatus === 'blocked') &&
      !args.config.includeReviewOnly
    ) {
      continue
    }

    const rules = extractCookbookRules({ family, readiness })
    const document = buildFamilyDocument({ family, readiness, rules })
    familyDocuments.push(document)
    includedFamilies.push(family)
  }

  const allRules = familyDocuments.flatMap(document => [
    ...document.stableRules,
    ...document.transformations,
    ...document.variants,
    ...document.enrichments,
    ...document.cautions,
  ])
  const globalDocuments = buildGlobalDocuments(allRules)
  const validationIssues = [
    ...familyDocuments.flatMap(validateCookbookDocument),
    ...familyDocuments.flatMap(document => {
      const family = includedFamilies.find(item => item.folder === document.folder)!
      return validateRuleEvidence({ family, document })
    }),
    ...validateGlobalDocuments(globalDocuments),
  ]

  const polish = runEvidenceLockedPolish({
    enabled: args.config.enablePolish,
    familyDocuments,
    globalDocuments,
    validationIssues,
  })
  const counts = splitValidationIssues(polish.validationIssues)
  if (counts.errorCount > 0) {
    throw new Error(`Cookbook validation failed with ${counts.errorCount} errors.`)
  }

  const evidenceSidecars = includedFamilies.map(family =>
    buildEvidenceSidecar({
      family,
      generatedAt,
    })
  )
  const manifest = buildCookbookManifest({
    generatedAt,
    mode: args.config.mode,
    sourceDraftRoot: args.config.draftsRoot,
    outputRoot: outputDirectory,
    familyDocuments: polish.familyDocuments,
    globalDocuments: polish.globalDocuments,
    familySources: includedFamilies,
  })
  const comparison = args.config.mode === 'append'
    ? await compareWithLatest({
        outputRoot: args.config.outputRoot,
        currentManifest: manifest,
      })
    : undefined

  return writeCookbookArtifacts({
    config: args.config,
    generatedAt,
    outputDirectory,
    familyDocuments: polish.familyDocuments,
    globalDocuments: polish.globalDocuments,
    evidenceSidecars,
    manifest,
    validationIssues: polish.validationIssues,
    comparison,
  })
}

export type {
  CookbookConfig,
  CookbookRunResult,
  CookbookWriteMode,
  OperationalStatus,
  CookbookConfidence,
  CookbookRule,
  CookbookFamilyDocument,
  CookbookGlobalDocument,
  CookbookManifest,
} from './types'
