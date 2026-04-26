import type { CookbookGlobalDocument, CookbookRule } from './types'

const GLOBAL_BUCKETS: Array<{ slug: string; title: string; summary: string }> = [
  {
    slug: 'identifier-handling',
    title: 'Global FPML -> CDM Identifier Handling',
    summary: 'Use these rules when preserving, normalizing, or reviewing trade and party identifiers.',
  },
  {
    slug: 'temporal-normalization',
    title: 'Global FPML -> CDM Temporal Normalization',
    summary: 'Use these rules when moving FPML dates, dateTimes, and adjustable-date structures into CDM.',
  },
  {
    slug: 'party-reference-resolution',
    title: 'Global FPML -> CDM Party Reference Resolution',
    summary: 'Use these rules when resolving party hrefs, counterparties, payer/receiver roles, and party direction.',
  },
  {
    slug: 'quantity-and-unit-normalization',
    title: 'Global FPML -> CDM Quantity And Unit Normalization',
    summary: 'Use these rules when mapping amounts, notionals, prices, currencies, and units.',
  },
  {
    slug: 'cdm-wrapper-construction',
    title: 'Global FPML -> CDM Wrapper Construction',
    summary: 'Use these rules when CDM requires wrapper structures around source values.',
  },
  {
    slug: 'enrichment-and-defaults',
    title: 'Global FPML -> CDM Enrichment And Defaults',
    summary: 'Use these rules to decide when generated or default CDM values require analyst review.',
  },
]

export function buildGlobalDocuments(rules: CookbookRule[]): CookbookGlobalDocument[] {
  return GLOBAL_BUCKETS.map(bucket => {
    const bucketRules = rules.filter(rule => classifyGlobalBucket(rule) === bucket.slug)
    const operationalRules = bucketRules.filter(
      rule => rule.operationalStatus === 'ready' || rule.operationalStatus === 'pilot_only'
    )
    const promotedRules = operationalRules.filter(rule => countFamiliesForTitle(operationalRules, rule.title) >= 2)
    const promotedIds = new Set(promotedRules.map(rule => rule.id))
    const familySpecificRules = operationalRules.filter(rule => !promotedIds.has(rule.id))

    return {
      slug: bucket.slug,
      title: bucket.title,
      summary: bucket.summary,
      rules: promotedRules,
      familySpecificRules,
      validationChecklist: buildGlobalValidationChecklist(bucket.slug),
      doNotAssume: buildGlobalDoNotAssume(bucket.slug),
    }
  })
}

export function classifyGlobalBucket(rule: CookbookRule): string | undefined {
  const text = [
    rule.title,
    ...rule.sourceSignals,
    ...rule.targetPaths,
    rule.action,
    rule.rationale,
  ]
    .join(' ')
    .toLowerCase()

  if (/tradeid|trade id|identifier|assignedidentifier|partytradeidentifier/.test(text)) {
    return 'identifier-handling'
  }
  if (/date|time|timezone|unadjusteddate|adjustabledate|expiry|expiration|effective|termination/.test(text)) {
    return 'temporal-normalization'
  }
  if (/party|payer|receiver|buyer|seller|counterparty|href|calculationagent/.test(text)) {
    return 'party-reference-resolution'
  }
  if (/amount|currency|quantity|price|unit|notional|rate/.test(text)) {
    return 'quantity-and-unit-normalization'
  }
  if (/wrapper|tradelot|trade lot|payout|settlementterms|settlement terms|pricequantity|adjustableorrelative/.test(text)) {
    return 'cdm-wrapper-construction'
  }
  if (/enrich|default|globalkey|externalkey|lei|generated|taxonomy|exchange/.test(text)) {
    return 'enrichment-and-defaults'
  }
  return undefined
}

function countFamiliesForTitle(rules: CookbookRule[], title: string): number {
  const families = new Set(
    rules
      .filter(rule => normalizeTitle(rule.title) === normalizeTitle(title))
      .map(rule => rule.family)
      .filter((family): family is string => !!family)
  )
  return families.size
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function buildGlobalValidationChecklist(slug: string): string[] {
  const shared = [
    'Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.',
    'If the source signal does not match the rule, do not apply the rule.',
  ]
  if (slug === 'party-reference-resolution') {
    return [
      ...shared,
      'Validate Party1/Party2 and payer/receiver direction against the FPML product context.',
      'Mark ambiguous party direction for analyst review.',
    ]
  }
  if (slug === 'enrichment-and-defaults') {
    return [
      ...shared,
      'Validate every generated key, identifier, default, exchange code, and taxonomy value against source evidence or approved defaults.',
      'Mark unsupported enrichment for analyst review.',
    ]
  }
  return shared
}

function buildGlobalDoNotAssume(slug: string): string[] {
  if (slug === 'party-reference-resolution') {
    return ['Do not infer party direction from document order alone.']
  }
  if (slug === 'identifier-handling') {
    return ['Do not invent identifiers, duplicate identifiers, schemes, global keys, or external keys.']
  }
  if (slug === 'enrichment-and-defaults') {
    return ['Do not create enriched CDM values unless evidence or an approved default supports them.']
  }
  return ['Do not generalize a family-specific rule unless this global document says it is promoted.']
}
