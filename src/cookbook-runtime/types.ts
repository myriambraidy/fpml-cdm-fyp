import type { ProductFamily } from '../source-model/product-family'

export type CookbookOperationalStatus = 'ready' | 'pilot_only' | 'review_only' | 'blocked'

export interface JsonObject {
  [key: string]: JsonValue
}

export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]

export interface CookbookManifestFamily {
  folder: string
  operationalStatus: CookbookOperationalStatus
  markdownPath: string
  evidencePath: string
}

export interface CookbookManifestGlobalDocument {
  name: string
  markdownPath: string
}

export interface CookbookManifestSourceManifest {
  families: CookbookManifestFamily[]
  globalDocuments: CookbookManifestGlobalDocument[]
}

export interface CookbookManifest {
  generatedAt: string
  sourceManifest?: CookbookManifestSourceManifest
  pages?: Array<{
    packetId: string
    markdownPath: string
  }>
}

export interface CookbookFamilyEvidenceSummary {
  ruleIds: string[]
  transformationIds: string[]
  variantIds: string[]
  enrichmentIds: string[]
  openQuestions: string[]
}

export interface CookbookFamilyContext {
  familySlug: string
  status: CookbookOperationalStatus
  markdown: string
  evidence: CookbookFamilyEvidenceSummary
}

export interface CookbookGlobalContext {
  name: string
  markdown: string
}

export interface CookbookRuntimeBundle {
  rootPath: string
  manifest: CookbookManifest
  validationIssueCount: number
  global: CookbookGlobalContext[]
  families: CookbookFamilyContext[]
  warnings: string[]
}

export interface CookbookRuntimeSelection {
  family: CookbookFamilyContext | null
  global: CookbookGlobalContext[]
  warnings: string[]
  diagnostics: {
    inferredProductFamily: ProductFamily
    selectedFamilySlug: string | null
    status: CookbookOperationalStatus | null
    excludedFamilySlugs: string[]
    charBudget: number
    outputChars: number
  }
}

export interface CookbookRuntimeRenderResult {
  text: string
  ruleIds: string[]
  status: CookbookOperationalStatus | null
  familySlug: string | null
}

