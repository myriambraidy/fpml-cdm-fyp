import type { Field } from './types'

const normalizeField = (field: Field): Field => {
  const normalizedName = field.name.trim()
  const normalizedPath = field.path.trim()
  const normalizedType = field.type?.trim()
  const normalizedValue =
    field.value === undefined || field.value === null
      ? undefined
      : String(field.value)

  return {
    ...field,
    name: normalizedName,
    path: normalizedPath,
    type: normalizedType || undefined,
    value: normalizedValue,
  }
}

export const normalizeFields = (fields: Field[]): Field[] => {
  const deduped = new Map<string, Field>()

  for (const field of fields) {
    const normalized = normalizeField(field)
    const key = `${normalized.path}|${normalized.name}|${normalized.type ?? ''}|${
      normalized.value ?? ''
    }`
    if (!deduped.has(key)) {
      deduped.set(key, normalized)
    }
  }

  return Array.from(deduped.values())
}
