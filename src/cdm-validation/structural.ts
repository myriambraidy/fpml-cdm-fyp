import AjvDraft04 from 'ajv-draft-04'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { env } from '../config'
import type { ValidationFinding, ValidationResult } from './types'

type StructuralSchema = {
  $id: string
  schema: Record<string, unknown>
}

let cachedAjv: AjvDraft04 | null = null

function getFallbackSchema(rootType: string): StructuralSchema {
  const rootKey = rootType.charAt(0).toLowerCase() + rootType.slice(1)
  return {
    $id: `fallback://${rootType}`,
    schema: {
      $id: `fallback://${rootType}`,
      type: 'object',
      additionalProperties: false,
      required: [rootKey],
      properties: {
        [rootKey]: {
          type: 'object',
          additionalProperties: true,
        },
      },
    },
  }
}

function loadAjv(): AjvDraft04 {
  if (cachedAjv) return cachedAjv

  const ajv = new AjvDraft04({ allErrors: true, strict: false })
  const schemaDir = resolve(process.cwd(), env.CDM_JSON_SCHEMA_DIR)
  if (existsSync(schemaDir)) {
    for (const file of readdirSync(schemaDir).filter(name => name.endsWith('.json'))) {
      const raw = JSON.parse(readFileSync(join(schemaDir, file), 'utf8')) as Record<string, unknown>
      const id = typeof raw.$id === 'string' ? raw.$id : undefined
      if (id) {
        ajv.addSchema(raw, id)
      }
    }
  }

  const fallback = getFallbackSchema(env.CDM_ORCHESTRATOR_ROOT_TYPE)
  ajv.addSchema(fallback.schema, fallback.$id)
  cachedAjv = ajv
  return ajv
}

function normalizeErrors(errors: unknown[] | null | undefined): ValidationFinding[] {
  if (!Array.isArray(errors)) return []
  return errors.map((error, index) => {
    const e = error as Record<string, unknown>
    const instancePath =
      typeof e.instancePath === 'string'
        ? e.instancePath
        : typeof e.dataPath === 'string'
          ? e.dataPath
          : '$'
    const keyword = typeof e.keyword === 'string' ? e.keyword : `ajv_${index}`
    const message = typeof e.message === 'string' ? e.message : 'validation error'
    return {
      path: instancePath || '$',
      code: keyword,
      message,
    }
  })
}

export function getStructuralSchemaRef(rootType: string): string {
  return `fallback://${rootType}`
}

export function validateStructuralCdm(data: unknown, rootType = env.CDM_ORCHESTRATOR_ROOT_TYPE): ValidationResult {
  const ajv = loadAjv()
  const ref = getStructuralSchemaRef(rootType)
  const ok = Boolean(ajv.validate(ref, data))
  const errors = ok ? [] : normalizeErrors(ajv.errors as unknown[] | null | undefined)

  return { ok, errors }
}
