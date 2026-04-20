import type { NormalizedFactModel } from '../source-model/normalized-facts'

function ensureObject(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value != null && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function normalizeDateValue(raw: unknown): unknown {
  if (typeof raw !== 'string') return raw
  if (/^\d{4}-\d{2}-\d{2}Z$/.test(raw)) return raw.slice(0, -1)
  return raw
}

function normalizeDates(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(item => normalizeDates(item))
  if (typeof node !== 'object' || node == null) return node
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key.toLowerCase().includes('date')) {
      out[key] = normalizeDateValue(normalizeDates(value))
    } else {
      out[key] = normalizeDates(value)
    }
  }
  return out
}

function buildTradeDate(value: string): Record<string, unknown> {
  return { value: normalizeDateValue(value) }
}

function ensureParties(root: Record<string, unknown>, facts: NormalizedFactModel): void {
  if (Array.isArray(root.party) && root.party.length > 0) return
  if (facts.parties.length === 0) return
  root.party = facts.parties.map(party => ({
    externalKey: party.id,
    globalKey: party.id,
    roles: party.roles,
  }))
}

function ensureCounterparty(root: Record<string, unknown>, facts: NormalizedFactModel): void {
  const tradableProduct = ensureObject(root.tradableProduct)
  const current = Array.isArray(tradableProduct.counterparty) ? tradableProduct.counterparty : []
  if (current.length >= 2) {
    root.tradableProduct = tradableProduct
    return
  }
  if (facts.parties.length < 2) {
    root.tradableProduct = tradableProduct
    return
  }
  tradableProduct.counterparty = facts.parties.slice(0, 2).map((party, idx) => ({
    role: idx === 0 ? 'PARTY_1' : 'PARTY_2',
    partyReference: party.id,
  }))
  root.tradableProduct = tradableProduct
}

function ensureTradeLot(root: Record<string, unknown>, facts: NormalizedFactModel): void {
  if (
    facts.economics.exchangeRate == null &&
    facts.economics.baseAmount == null &&
    facts.economics.quoteAmount == null
  ) {
    return
  }
  if (Array.isArray(root.tradeLot) && root.tradeLot.length > 0) return

  const priceEntry: Record<string, unknown> = {}
  if (facts.economics.exchangeRate != null) {
    priceEntry.value = facts.economics.exchangeRate
  }
  if (facts.economics.baseCurrency && facts.economics.quoteCurrency) {
    priceEntry.observable = {
      currencyPair: {
        base: facts.economics.baseCurrency,
        quote: facts.economics.quoteCurrency,
      },
    }
  }

  const quantity: Record<string, unknown>[] = []
  if (facts.economics.baseAmount) {
    quantity.push({
      amount: facts.economics.baseAmount,
      currency: facts.economics.baseCurrency,
    })
  }
  if (facts.economics.quoteAmount) {
    quantity.push({
      amount: facts.economics.quoteAmount,
      currency: facts.economics.quoteCurrency,
    })
  }

  root.tradeLot = [
    {
      priceQuantity: [
        {
          ...(Object.keys(priceEntry).length > 0 ? { price: [priceEntry] } : {}),
          ...(quantity.length > 0 ? { quantity } : {}),
        },
      ],
    },
  ]
}

export function applyCanonicalBuilders(args: {
  cdmPayload: Record<string, unknown>
  root: 'tradeState' | 'trade' | 'businessEvent'
  facts: NormalizedFactModel
}): Record<string, unknown> {
  const payload = normalizeDates(args.cdmPayload) as Record<string, unknown>
  const rootNode = ensureObject(payload[args.root])

  if (typeof rootNode.tradeDate === 'string') {
    rootNode.tradeDate = buildTradeDate(rootNode.tradeDate)
  } else if (!rootNode.tradeDate && args.facts.temporal.tradeDate) {
    rootNode.tradeDate = buildTradeDate(args.facts.temporal.tradeDate)
  }

  if (!rootNode.tradeDate && args.facts.temporal.tradeDate) {
    rootNode.tradeDate = buildTradeDate(args.facts.temporal.tradeDate)
  }
  if (!rootNode.valueDate && args.facts.temporal.valueDate) {
    rootNode.valueDate = normalizeDateValue(args.facts.temporal.valueDate)
  }

  ensureParties(rootNode, args.facts)
  ensureCounterparty(rootNode, args.facts)
  ensureTradeLot(rootNode, args.facts)

  payload[args.root] = rootNode
  return payload
}
