import { policyForStatus } from './policy'
import type { CookbookRuntimeRenderResult, CookbookRuntimeSelection } from './types'

function renderGlobalSection(selection: CookbookRuntimeSelection): string {
  const chunks: string[] = []
  for (const doc of selection.global) {
    chunks.push(
      [
        `<global_doc name="${doc.name}">`,
        doc.markdown,
        `</global_doc>`,
      ].join('\n')
    )
  }
  return chunks.join('\n\n')
}

function renderFamilySection(selection: CookbookRuntimeSelection): { text: string; ruleIds: string[] } {
  if (!selection.family) return { text: '', ruleIds: [] }
  const policy = policyForStatus(selection.family.status)
  const statusDirectives = [
    `status=${selection.family.status}`,
    `autoApplyAllowed=${policy.autoApplyAllowed ? 'yes' : 'no'}`,
    `forceHumanReview=${policy.forceHumanReview ? 'yes' : 'no'}`,
  ].join(' ')
  const ruleIds = [
    ...selection.family.evidence.ruleIds,
    ...selection.family.evidence.transformationIds,
  ]
  const uniqueRuleIds = Array.from(new Set(ruleIds))
  return {
    text: [
      `<family_doc slug="${selection.family.familySlug}" ${statusDirectives}>`,
      `<rule_ids>${uniqueRuleIds.join(', ')}</rule_ids>`,
      `<variant_ids>${selection.family.evidence.variantIds.join(', ')}</variant_ids>`,
      `<enrichment_ids>${selection.family.evidence.enrichmentIds.join(', ')}</enrichment_ids>`,
      `<open_questions>${selection.family.evidence.openQuestions.join(' | ')}</open_questions>`,
      selection.family.markdown,
      `</family_doc>`,
    ].join('\n'),
    ruleIds: uniqueRuleIds,
  }
}

export function renderCookbookContext(selection: CookbookRuntimeSelection): CookbookRuntimeRenderResult {
  const globalText = renderGlobalSection(selection)
  const family = renderFamilySection(selection)
  const text = [
    '<cookbook_runtime_context>',
    `<inferred_product_family>${selection.diagnostics.inferredProductFamily}</inferred_product_family>`,
    `<selected_family>${selection.diagnostics.selectedFamilySlug ?? 'none'}</selected_family>`,
    `<warnings>${selection.warnings.join(' | ')}</warnings>`,
    '<global_guidance>',
    globalText,
    '</global_guidance>',
    '<family_guidance>',
    family.text || 'none',
    '</family_guidance>',
    '<policy>',
    'Prefer cookbook-backed rules.',
    'If cookbook guidance is missing or ambiguous, produce explicit assumption markers for analyst review.',
    '</policy>',
    '</cookbook_runtime_context>',
  ].join('\n')
  return {
    text,
    ruleIds: family.ruleIds,
    status: selection.family?.status ?? null,
    familySlug: selection.family?.familySlug ?? null,
  }
}

