import type { Field } from '../parser/types'
import type { MappingIR } from '../mapping-ir/types'

export type ProductFamily = 'fx' | 'rates' | 'credit' | 'equity' | 'commodity' | 'unknown'

const FAMILY_KEYWORDS: Record<Exclude<ProductFamily, 'unknown'>, string[]> = {
  fx: ['fxsingleleg', 'fxswap', 'fxoption', 'exchangerate', 'quotedcurrencypair'],
  rates: ['swapstream', 'floatingrate', 'fixedrate', 'fra', 'daycountfraction', 'ibor'],
  credit: ['creditdefaultswap', 'protectionterms', 'referenceentity', 'credit'],
  equity: ['equityoption', 'equityswap', 'returnswap', 'equity', 'variance'],
  commodity: ['commodityswap', 'commodityoption', 'commodity'],
}

const FAMILY_ORDER: Array<Exclude<ProductFamily, 'unknown'>> = [
  'fx',
  'rates',
  'credit',
  'equity',
  'commodity',
]

function scoreByKeywords(
  scores: Record<ProductFamily, number>,
  text: string,
  weight: number
): void {
  const lower = text.toLowerCase()
  for (const family of FAMILY_ORDER) {
    if (FAMILY_KEYWORDS[family].some(keyword => lower.includes(keyword))) {
      scores[family] += weight
    }
  }
}

export function inferProductFamily(args: {
  fpml: string
  fields: Field[]
  mappings: MappingIR[]
}): ProductFamily {
  const scores: Record<ProductFamily, number> = {
    fx: 0,
    rates: 0,
    credit: 0,
    equity: 0,
    commodity: 0,
    unknown: 0,
  }

  scoreByKeywords(scores, args.fpml, 3)
  for (const field of args.fields) {
    scoreByKeywords(scores, `${field.path} ${field.name} ${field.value ?? ''}`, 2)
  }
  for (const mapping of args.mappings) {
    scoreByKeywords(
      scores,
      [
        mapping.target.legacyPath,
        mapping.semantics.productCategory ?? '',
        mapping.semantics.payoutType ?? '',
        mapping.semantics.rateType ?? '',
        mapping.semantics.indexCategory ?? '',
        mapping.reasoning,
      ].join(' '),
      1
    )
  }

  let best: ProductFamily = 'unknown'
  let bestScore = 0
  for (const family of FAMILY_ORDER) {
    if (scores[family] > bestScore) {
      best = family
      bestScore = scores[family]
    }
  }
  return best
}

export function expectedPayoutFamilies(family: ProductFamily): string[] {
  switch (family) {
    case 'fx':
      return ['SettlementPayout']
    case 'rates':
      return ['InterestRatePayout']
    case 'credit':
      return ['CreditDefaultPayout']
    case 'equity':
      return ['PerformancePayout', 'OptionPayout', 'SettlementPayout']
    case 'commodity':
      return ['CommodityPayout', 'OptionPayout', 'SettlementPayout']
    default:
      return []
  }
}
