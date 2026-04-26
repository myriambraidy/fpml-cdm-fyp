import type {
  CookbookEvidenceSidecar,
  CookbookFamilyDocument,
  CookbookGlobalDocument,
  CookbookManifest,
  LoadedDraftFamily,
} from './types'

export function buildEvidenceSidecar(args: {
  family: LoadedDraftFamily
  generatedAt: string
}): CookbookEvidenceSidecar {
  const synthesis = args.family.artifact.synthesis!
  return {
    folder: args.family.folder,
    generatedAt: args.generatedAt,
    sourceDraft: args.family.draftPath,
    sourceDebug: args.family.debugPath,
    evidenceCoverage: synthesis.evidenceCoverage,
    publication: args.family.debug?.publication,
    qualityAssessment: args.family.debug?.qualityAssessment,
    rolloutReadiness: args.family.debug?.rolloutReadiness,
    stableMappingPatterns: synthesis.stableMappingPatterns,
    repeatedNonLiteralTransformations: synthesis.repeatedNonLiteralTransformations,
    tentativeRepeatedPatterns: synthesis.tentativeRepeatedPatterns,
    variantsAndExceptions: synthesis.variantsAndExceptions,
    suspectedEnrichmentOrDefaultBehavior: synthesis.suspectedEnrichmentOrDefaultBehavior,
    openQuestions: synthesis.openQuestions,
  }
}

export function buildCookbookManifest(args: {
  generatedAt: string
  mode: CookbookManifest['mode']
  sourceDraftRoot: string
  outputRoot: string
  familyDocuments: CookbookFamilyDocument[]
  globalDocuments: CookbookGlobalDocument[]
  familySources: LoadedDraftFamily[]
}): CookbookManifest {
  return {
    generatedAt: args.generatedAt,
    mode: args.mode,
    sourceDraftRoot: args.sourceDraftRoot,
    outputRoot: args.outputRoot,
    families: args.familyDocuments.map(document => {
      const source = args.familySources.find(item => item.folder === document.folder)!
      return {
        folder: document.folder,
        operationalStatus: document.readiness.operationalStatus,
        confidenceSummary: summarizeConfidence(document),
        markdownPath: familyMarkdownPath(document),
        evidencePath: `references/${document.folder}.evidence.json`,
        draftPath: source.draftPath,
        debugPath: source.debugPath,
      }
    }),
    globalDocuments: args.globalDocuments.map(document => ({
      name: document.slug,
      markdownPath: `global/${document.slug}.md`,
      ruleCount: document.rules.length + document.familySpecificRules.length,
    })),
  }
}

function summarizeConfidence(document: CookbookFamilyDocument): Record<'high' | 'medium' | 'low' | 'blocked', number> {
  const result = {
    high: 0,
    medium: 0,
    low: 0,
    blocked: 0,
  }
  for (const rule of [
    ...document.stableRules,
    ...document.transformations,
    ...document.variants,
    ...document.enrichments,
    ...document.cautions,
  ]) {
    result[rule.confidence] += 1
  }
  return result
}

function familyMarkdownPath(document: CookbookFamilyDocument): string {
  if (document.readiness.operationalStatus === 'ready' || document.readiness.operationalStatus === 'pilot_only') {
    return `product-families/${document.folder}.md`
  }
  return `review-only/${document.folder}.md`
}
