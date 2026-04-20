import type { MappingIR } from '../mapping-ir/types'

export interface NormalizedPartyFact {
  id: string
  roles: string[]
}

export interface NormalizedEconomicsFact {
  baseCurrency?: string
  quoteCurrency?: string
  baseAmount?: string
  quoteAmount?: string
  exchangeRate?: string
}

export interface NormalizedTemporalFact {
  tradeDate?: string
  valueDate?: string
  effectiveDate?: string
  terminationDate?: string
}

export interface NormalizedFactModel {
  productType?: string
  economics: NormalizedEconomicsFact
  temporal: NormalizedTemporalFact
  parties: NormalizedPartyFact[]
  tradeIds: string[]
}

function normalizeDateLike(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}Z$/.test(value)) return value.slice(0, -1)
  return value
}

export function deriveNormalizedFacts(mappings: MappingIR[]): NormalizedFactModel {
  const partyById = new Map<string, NormalizedPartyFact>()
  const tradeIds = new Set<string>()
  const facts: NormalizedFactModel = {
    economics: {},
    temporal: {},
    parties: [],
    tradeIds: [],
  }

  for (const mapping of mappings) {
    const target = mapping.target.legacyPath.toLowerCase()
    const sourceValue =
      mapping.value.kind === 'raw_scalar'
        ? mapping.value.value
        : mapping.value.kind === 'reference'
          ? mapping.value.resolvedId ?? mapping.value.raw
          : mapping.source.value

    if (!sourceValue) continue

    if (mapping.semantics.productCategory && !facts.productType) {
      facts.productType = mapping.semantics.productCategory
    }

    if (target.includes('tradeid') || target.includes('tradeidentifier')) {
      tradeIds.add(sourceValue)
    }

    if (mapping.semantics.domain === 'party' || target.includes('partyreference')) {
      const id = sourceValue
      const existing = partyById.get(id) ?? { id, roles: [] }
      if (mapping.semantics.partyRole && !existing.roles.includes(mapping.semantics.partyRole)) {
        existing.roles.push(mapping.semantics.partyRole)
      }
      partyById.set(id, existing)
    }

    const dateType = mapping.semantics.dateType?.toLowerCase()
    if (dateType === 'trade_date' || target.endsWith('tradedate')) {
      facts.temporal.tradeDate = normalizeDateLike(sourceValue)
    } else if (target.includes('valuedate') || dateType === 'payment_date') {
      facts.temporal.valueDate = normalizeDateLike(sourceValue)
    } else if (dateType === 'effective_date') {
      facts.temporal.effectiveDate = normalizeDateLike(sourceValue)
    } else if (dateType === 'termination_date') {
      facts.temporal.terminationDate = normalizeDateLike(sourceValue)
    }

    if (target.includes('currency1') || target.includes('basecurrency')) {
      facts.economics.baseCurrency = sourceValue
    } else if (target.includes('currency2') || target.includes('quotecurrency')) {
      facts.economics.quoteCurrency = sourceValue
    } else if (target.includes('amount1') || target.includes('baseamount')) {
      facts.economics.baseAmount = sourceValue
    } else if (target.includes('amount2') || target.includes('quoteamount')) {
      facts.economics.quoteAmount = sourceValue
    } else if (target.includes('rate') || target.includes('exchangerate')) {
      facts.economics.exchangeRate = sourceValue
    }
  }

  facts.parties = Array.from(partyById.values())
  facts.tradeIds = Array.from(tradeIds.values())
  return facts
}
