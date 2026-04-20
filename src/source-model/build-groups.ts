import type { Field } from '../parser/types'
import { groupPartyEntities } from './groupers/party'
import { groupPremiumEntities } from './groupers/premium'
import { groupScheduleEntities } from './groupers/schedule'
import { groupStreamEntities } from './groupers/stream'
import type { SourceEntity, SourceModel } from './types'

function buildFieldToEntityKeys(entities: SourceEntity[]): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const entity of entities) {
    for (const path of entity.sourcePaths) {
      if (!out[path]) out[path] = []
      out[path]!.push(entity.entityKey)
    }
  }
  return out
}

export function buildSourceModel(fields: Field[]): SourceModel {
  const entities: SourceEntity[] = [
    ...groupPartyEntities(fields),
    ...groupStreamEntities(fields),
    ...groupScheduleEntities(fields),
    ...groupPremiumEntities(fields),
  ]

  const entityIndex: Record<string, SourceEntity> = {}
  for (const entity of entities) {
    entityIndex[entity.entityKey] = entity
  }

  return {
    entities,
    entityIndex,
    fieldToEntityKeys: buildFieldToEntityKeys(entities),
  }
}
