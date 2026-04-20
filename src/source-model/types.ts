export type PartyEntity = {
  kind: 'party'
  entityKey: string
  sourcePaths: string[]
  role?: 'buyer' | 'seller' | 'payer' | 'receiver' | 'counterparty'
  partyId?: string
  href?: string
}

export type StreamEntity = {
  kind: 'stream'
  entityKey: string
  sourcePaths: string[]
  order: number
  payerRef?: string
  receiverRef?: string
  rateType?: 'fixed' | 'floating'
}

export type ScheduleEntity = {
  kind: 'schedule'
  entityKey: string
  sourcePaths: string[]
  sourceCollectionPath: string
  items: Array<{ sourcePath: string; value?: string; index: number }>
}

export type PremiumEntity = {
  kind: 'premium'
  entityKey: string
  sourcePaths: string[]
  payerRef?: string
  receiverRef?: string
  amount?: string
  currency?: string
}

export type SourceEntity =
  | PartyEntity
  | StreamEntity
  | ScheduleEntity
  | PremiumEntity

export type SourceModel = {
  entities: SourceEntity[]
  entityIndex: Record<string, SourceEntity>
  fieldToEntityKeys: Record<string, string[]>
}
