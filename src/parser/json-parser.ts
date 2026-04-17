import { normalizeFields } from './normalizer'
import type { Field } from './types'

const inferType = (value: unknown): string => {
  if (value === null) {
    return 'null'
  }
  if (Array.isArray(value)) {
    return 'array'
  }
  return typeof value
}

const walkJson = (
  value: unknown,
  path: string,
  ancestors: string[],
  out: Field[]
): void => {
  if (Array.isArray(value)) {
    const name = ancestors.at(-1) ?? '$'
    out.push({
      name,
      path,
      type: 'array',
      isArray: true,
      context: {
        parentName: ancestors.at(-2),
        ancestors: [...ancestors],
        length: value.length,
      },
    })

    value.forEach((item, index) => {
      walkJson(item, `${path}[${index}]`, ancestors, out)
    })
    return
  }

  if (value !== null && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const childPath = path === '$' ? `$.${key}` : `${path}.${key}`
      walkJson(child, childPath, [...ancestors, key], out)
    }
    return
  }

  out.push({
    name: ancestors.at(-1) ?? path,
    path,
    value: value == null ? undefined : String(value),
    type: inferType(value),
    context: {
      parentName: ancestors.at(-2),
      ancestors: [...ancestors],
    },
  })
}

export const parseJSON = (raw: string): Field[] => {
  const parsed = JSON.parse(raw) as unknown
  const fields: Field[] = []
  walkJson(parsed, '$', [], fields)
  return normalizeFields(fields)
}
