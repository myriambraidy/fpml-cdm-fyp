import type { CdmJavaMethodSignature } from './cdm-java-api-pack'
import { lookupCdmJavaClassDetails } from './cdm-java-api-pack'

export type BaseBuilderMethodIntent =
  | 'build-root'
  | 'set-trade'
  | 'set-contract-details'
  | 'set-party'
  | 'set-identifier'

export type FxBuilderMethodIntent =
  | BaseBuilderMethodIntent
  | 'set-product'
  | 'set-economic-terms'
  | 'set-payout'
  | 'set-settlement-payout'
  | 'set-price-quantity'

export type ResolvedBuilderMethod = {
  className: string
  methodName: string
  parameterTypes: string[]
  returnType: string
  rawSignature: string
  intent: FxBuilderMethodIntent
  source: 'compiled-jar-javap'
}

export async function resolveBuilderMethodsForRecipeStep(args: {
  classNames: string[]
  intents: FxBuilderMethodIntent[]
}): Promise<ResolvedBuilderMethod[]> {
  const resolved: ResolvedBuilderMethod[] = []
  for (const className of args.classNames) {
    const lookup = await lookupCdmJavaClassDetails(className)
    if (lookup.status !== 'found') continue
    for (const method of lookup.details.builderMethods) {
      const intent = classifyBuilderMethod(method)
      if (intent === null || !args.intents.includes(intent)) continue
      resolved.push({
        className,
        methodName: method.name,
        parameterTypes: extractCdmRosettaTypes(method.parameters.join(', ')),
        returnType: method.returnType,
        rawSignature: method.raw,
        intent,
        source: 'compiled-jar-javap',
      })
    }
  }
  return dedupeResolvedMethods(resolved)
}

export function extractBuilderParameterClasses(methods: ResolvedBuilderMethod[]): string[] {
  return [...new Set(methods.flatMap(method => method.parameterTypes).filter(isCdmRosettaClassName))].sort()
}

export function extractCdmRosettaTypes(text: string): string[] {
  const matches = text.match(/\b(?:cdm|com\.rosetta)\.[A-Za-z0-9_.$]+/gu) ?? []
  return [...new Set(matches.map(normalizeNestedClassName))].sort()
}

function classifyBuilderMethod(method: CdmJavaMethodSignature): FxBuilderMethodIntent | null {
  const name = method.name.toLowerCase()
  if (name === 'build') return 'build-root'
  if (name === 'settrade') return 'set-trade'
  if (name === 'setcontractdetails') return 'set-contract-details'
  if (name.includes('identifier')) return 'set-identifier'
  if (name.includes('party')) return 'set-party'
  if (name.includes('economicterms')) return 'set-economic-terms'
  if (name.includes('settlementpayout')) return 'set-settlement-payout'
  if (name.includes('pricequantity')) return 'set-price-quantity'
  if (name.includes('payout')) return 'set-payout'
  if (name.includes('product')) return 'set-product'
  return null
}

function normalizeNestedClassName(className: string): string {
  return className.replace(/\$/g, '.')
}

function isCdmRosettaClassName(className: string): boolean {
  return /^(?:cdm|com\.rosetta)\.[A-Za-z0-9_.]+$/u.test(className)
}

function dedupeResolvedMethods(methods: ResolvedBuilderMethod[]): ResolvedBuilderMethod[] {
  const bySignature = new Map<string, ResolvedBuilderMethod>()
  for (const method of methods) {
    bySignature.set(`${method.className}.${method.methodName}:${method.rawSignature}`, method)
  }
  return [...bySignature.values()].sort((left, right) =>
    `${left.className}.${left.methodName}.${left.rawSignature}`.localeCompare(
      `${right.className}.${right.methodName}.${right.rawSignature}`
    )
  )
}
