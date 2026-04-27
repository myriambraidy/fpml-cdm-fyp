import type { ProductFamily } from '../source-model/product-family'
import { policyForStatus } from './policy'
import type {
  CookbookFamilyContext,
  CookbookRuntimeBundle,
  CookbookRuntimeSelection,
} from './types'

const FAMILY_SLUG_BY_HINT: Record<ProductFamily, string[]> = {
  fx: ['fx-derivatives'],
  rates: ['interest-rate-derivatives', 'inflation-swaps', 'correlation-swaps'],
  credit: ['credit-derivatives', 'total-return-swaps'],
  equity: ['equity-options', 'equity-swaps', 'dividend-swaps', 'bond-options'],
  commodity: ['commodity-derivatives'],
  unknown: [],
}

function pickFamily(
  families: CookbookFamilyContext[],
  productFamily: ProductFamily
): CookbookFamilyContext | null {
  const preferred = FAMILY_SLUG_BY_HINT[productFamily]
  if (preferred.length === 0) return null
  for (const slug of preferred) {
    const found = families.find(item => item.familySlug === slug)
    if (found) return found
  }
  return null
}

function trimText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return `${text.slice(0, maxChars)}\n...[truncated]`
}

export function selectCookbookContext(args: {
  bundle: CookbookRuntimeBundle
  productFamily: ProductFamily
  maxChars: number
  includeReviewOnly: boolean
}): CookbookRuntimeSelection {
  const warnings = [...args.bundle.warnings]
  const selectedFamily = pickFamily(args.bundle.families, args.productFamily)
  const excludedFamilySlugs: string[] = []
  let family: CookbookFamilyContext | null = null

  if (selectedFamily) {
    const policy = policyForStatus(selectedFamily.status)
    if (
      (selectedFamily.status === 'review_only' || selectedFamily.status === 'blocked') &&
      !args.includeReviewOnly
    ) {
      excludedFamilySlugs.push(selectedFamily.familySlug)
      warnings.push(`family ${selectedFamily.familySlug} excluded by review-only policy`)
    } else if (!policy.allowedForGuidance) {
      excludedFamilySlugs.push(selectedFamily.familySlug)
      warnings.push(`family ${selectedFamily.familySlug} excluded by policy`)
    } else {
      family = {
        ...selectedFamily,
        markdown: trimText(selectedFamily.markdown, Math.floor(args.maxChars * 0.55)),
      }
    }
  } else if (args.productFamily !== 'unknown') {
    warnings.push(`no cookbook family found for inferred product family ${args.productFamily}`)
  }

  const globalShare = family ? Math.floor(args.maxChars * 0.45) : args.maxChars
  const perDocBudget = Math.max(1000, Math.floor(globalShare / Math.max(args.bundle.global.length, 1)))
  const global = args.bundle.global.map(doc => ({
    ...doc,
    markdown: trimText(doc.markdown, perDocBudget),
  }))

  const currentTotal =
    global.reduce((sum, doc) => sum + doc.markdown.length, 0) + (family?.markdown.length ?? 0)
  let outputChars = currentTotal
  if (outputChars > args.maxChars && family) {
    const over = outputChars - args.maxChars
    family = {
      ...family,
      markdown: trimText(family.markdown, Math.max(800, family.markdown.length - over)),
    }
    outputChars =
      global.reduce((sum, doc) => sum + doc.markdown.length, 0) + (family?.markdown.length ?? 0)
  }
  if (outputChars > args.maxChars) {
    const perDoc = Math.max(400, Math.floor(args.maxChars / Math.max(global.length, 1)))
    const compactGlobal = global.map(doc => ({ ...doc, markdown: trimText(doc.markdown, perDoc) }))
    outputChars = compactGlobal.reduce((sum, doc) => sum + doc.markdown.length, 0) + (family?.markdown.length ?? 0)
    return {
      family,
      global: compactGlobal,
      warnings,
      diagnostics: {
        inferredProductFamily: args.productFamily,
        selectedFamilySlug: family?.familySlug ?? null,
        status: family?.status ?? null,
        excludedFamilySlugs,
        charBudget: args.maxChars,
        outputChars,
      },
    }
  }

  return {
    family,
    global,
    warnings,
    diagnostics: {
      inferredProductFamily: args.productFamily,
      selectedFamilySlug: family?.familySlug ?? null,
      status: family?.status ?? null,
      excludedFamilySlugs,
      charBudget: args.maxChars,
      outputChars,
    },
  }
}

