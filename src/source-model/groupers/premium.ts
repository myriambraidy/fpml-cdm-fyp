import type { Field } from '../../parser/types'
import type { PremiumEntity } from '../types'

export function groupPremiumEntities(fields: Field[]): PremiumEntity[] {
  const premiumFields = fields.filter(field => field.path.toLowerCase().includes('premium'))
  if (premiumFields.length === 0) return []

  const entity: PremiumEntity = {
    kind: 'premium',
    entityKey: 'premium_main',
    sourcePaths: premiumFields.map(field => field.path),
  }

  for (const field of premiumFields) {
    const lowerName = field.name.toLowerCase()
    if (lowerName.includes('payerpartyreference')) {
      entity.payerRef = field.value
    } else if (lowerName.includes('receiverpartyreference')) {
      entity.receiverRef = field.value
    } else if (lowerName.includes('amount')) {
      entity.amount = field.value
    } else if (lowerName.includes('currency')) {
      entity.currency = field.value
    }
  }

  return [entity]
}
