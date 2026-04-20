import { spawnSync } from 'node:child_process'
import { env } from '../config'
import type { SemanticValidationResult, ValidationFinding } from './types'

export interface SemanticValidationOptions {
  allowedIdentifierValues?: Iterable<string>
  enforceGroundedIdentifiers?: boolean
}

function pathToJsonPath(path: string): string {
  if (!path.startsWith('$.')) return path
  return path
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null && !Array.isArray(value)
}

function collectDateErrors(value: unknown, path: string, out: ValidationFinding[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collectDateErrors(item, `${path}[${idx}]`, out))
    return
  }
  if (!isRecord(value)) return
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`
    const lower = key.toLowerCase()
    if (lower.includes('date')) {
      if (typeof child === 'string' && /^\d{4}-\d{2}-\d{2}Z$/.test(child)) {
        out.push({
          path: pathToJsonPath(childPath),
          code: 'date_only_with_z',
          message: 'Date-only value must not end with Z',
        })
      }
      if (lower === 'tradedate' && typeof child === 'string') {
        out.push({
          path: pathToJsonPath(childPath),
          code: 'trade_date_object_expected',
          message: 'tradeDate should be an object with value for canonical payload',
        })
      }
    }
    collectDateErrors(child, childPath, out)
  }
}

function collectPartyReferences(value: unknown, path: string, out: Array<{ path: string; value: string }>): void {
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collectPartyReferences(item, `${path}[${idx}]`, out))
    return
  }
  if (!isRecord(value)) return
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`
    if (typeof child === 'string' && key.toLowerCase().includes('partyreference')) {
      out.push({ path: childPath, value: child })
    }
    collectPartyReferences(child, childPath, out)
  }
}

function collectIdentifierValues(
  value: unknown,
  path: string,
  out: Array<{ path: string; value: string }>
): void {
  if (Array.isArray(value)) {
    value.forEach((item, idx) => collectIdentifierValues(item, `${path}[${idx}]`, out))
    return
  }
  if (!isRecord(value)) return
  for (const [key, child] of Object.entries(value)) {
    const childPath = `${path}.${key}`
    if (key === 'identifier') {
      if (typeof child === 'string' && child.trim()) {
        out.push({ path: childPath, value: child.trim() })
      } else if (isRecord(child) && typeof child.value === 'string' && child.value.trim()) {
        out.push({ path: `${childPath}.value`, value: child.value.trim() })
      }
    }
    collectIdentifierValues(child, childPath, out)
  }
}

function collectDuplicateTradeIdentifierErrors(
  rootObj: Record<string, unknown>,
  rootPath: string,
  out: ValidationFinding[]
): void {
  const items = Array.isArray(rootObj.tradeIdentifier) ? rootObj.tradeIdentifier : []
  const seen = new Map<string, number>()
  items.forEach((entry, idx) => {
    if (!isRecord(entry)) return
    const issuer = isRecord(entry.issuerReference)
      ? `${entry.issuerReference.globalReference ?? ''}|${entry.issuerReference.externalReference ?? ''}`
      : ''
    const assigned = Array.isArray(entry.assignedIdentifier) ? entry.assignedIdentifier : []
    const assignedKeys = assigned
      .map(item => {
        if (!isRecord(item) || !isRecord(item.identifier)) return ''
        const idValue = typeof item.identifier.value === 'string' ? item.identifier.value : ''
        const scheme = isRecord(item.identifier.meta) && typeof item.identifier.meta.scheme === 'string'
          ? item.identifier.meta.scheme
          : ''
        return `${idValue}|${scheme}`
      })
      .filter(Boolean)
      .sort()
      .join('::')
    if (!assignedKeys) return
    const signature = `${issuer}##${assignedKeys}`
    const count = seen.get(signature) ?? 0
    seen.set(signature, count + 1)
    if (count >= 1) {
      out.push({
        path: pathToJsonPath(`${rootPath}.tradeIdentifier[${idx}]`),
        code: 'duplicate_trade_identifier',
        message: 'Duplicate tradeIdentifier entry with equivalent issuer/assignedIdentifier semantics',
      })
    }
  })
}

function builtinSemanticValidate(
  data: unknown,
  rootType: string,
  options?: SemanticValidationOptions
): SemanticValidationResult {
  const errors: ValidationFinding[] = []
  if (typeof data !== 'object' || data == null) {
    errors.push({
      path: '$',
      code: 'not_object',
      message: 'CDM candidate must be an object',
    })
  } else {
    const obj = data as Record<string, unknown>
    const rootKey = rootType.charAt(0).toLowerCase() + rootType.slice(1)
    const root = obj[rootKey]
    if (typeof root !== 'object' || root == null) {
      errors.push({
        path: `$.[${rootKey}]`,
        code: 'missing_root',
        message: `Missing root object "${rootKey}"`,
      })
    } else {
      const rootObj = root as Record<string, unknown>
      const tradableProduct = rootObj.tradableProduct
      if (tradableProduct == null) {
        errors.push({
          path: pathToJsonPath(`$.${rootKey}.tradableProduct`),
          code: 'missing_tradable_product',
          message: 'tradableProduct is required for supported scope',
        })
      }
      const counterparty = (tradableProduct as Record<string, unknown> | undefined)?.counterparty
      if (Array.isArray(counterparty) && counterparty.length < 2) {
        errors.push({
          path: pathToJsonPath(`$.${rootKey}.tradableProduct.counterparty`),
          code: 'counterparty_count',
          message: 'supported scope expects at least two counterparties when counterparty is present',
        })
      }

      if (rootObj.product && (tradableProduct as Record<string, unknown> | undefined)?.product) {
        errors.push({
          path: pathToJsonPath(`$.${rootKey}`),
          code: 'duplicate_economic_sections',
          message: 'Both product and tradableProduct.product are present; keep a single economic source',
        })
      }

      const knownPartyIds = new Set<string>()
      const partyArray = Array.isArray(rootObj.party) ? rootObj.party : []
      for (const party of partyArray) {
        if (!isRecord(party)) continue
        for (const candidate of [party.globalKey, party.externalKey, party.id]) {
          if (typeof candidate === 'string' && candidate.trim()) knownPartyIds.add(candidate)
        }
      }
      const refs: Array<{ path: string; value: string }> = []
      collectPartyReferences(rootObj, `$.${rootKey}`, refs)
      for (const ref of refs) {
        if (knownPartyIds.size === 0 || !knownPartyIds.has(ref.value)) {
          errors.push({
            path: pathToJsonPath(ref.path),
            code: 'unresolved_party_reference',
            message: `partyReference "${ref.value}" does not resolve to trade.party[]`,
          })
        }
      }

      collectDuplicateTradeIdentifierErrors(rootObj, `$.${rootKey}`, errors)

      const shouldEnforceGrounding = options?.enforceGroundedIdentifiers ?? false
      if (shouldEnforceGrounding) {
        const allowed = new Set<string>()
        for (const value of options?.allowedIdentifierValues ?? []) {
          if (typeof value === 'string' && value.trim()) allowed.add(value.trim())
        }
        if (allowed.size > 0) {
          const identifiers: Array<{ path: string; value: string }> = []
          collectIdentifierValues(rootObj, `$.${rootKey}`, identifiers)
          for (const item of identifiers) {
            if (!allowed.has(item.value)) {
              errors.push({
                path: pathToJsonPath(item.path),
                code: 'ungrounded_identifier',
                message: `Identifier "${item.value}" is not grounded in source evidence`,
              })
            }
          }
        }
      }

      collectDateErrors(rootObj, `$.${rootKey}`, errors)
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    validatorKind: env.CDM_SEMANTIC_VALIDATOR_CMD ? 'external-bridge' : 'builtin-semantic',
    validatorVersion: env.CDM_SEMANTIC_VALIDATOR_CMD ? undefined : 'builtin-v1',
    rootType,
  }
}

export function validateSemanticCdm(
  data: unknown,
  rootType = env.CDM_ORCHESTRATOR_ROOT_TYPE,
  options?: SemanticValidationOptions
): SemanticValidationResult {
  const cmd = env.CDM_SEMANTIC_VALIDATOR_CMD?.trim()
  if (!cmd) {
    return builtinSemanticValidate(data, rootType, options)
  }

  const child = spawnSync(cmd, {
    shell: true,
    input: JSON.stringify({ rootType, cdm: data }),
    encoding: 'utf8',
  })

  if (child.status !== 0) {
    return {
      ok: false,
      errors: [
        {
          path: '$',
          code: 'semantic_validator_failed',
          message: child.stderr?.trim() || child.stdout?.trim() || `validator exited ${child.status}`,
        },
      ],
      validatorKind: 'external-bridge',
      validatorVersion: undefined,
      rootType,
    }
  }

  try {
    const parsed = JSON.parse(child.stdout || '{}') as Partial<SemanticValidationResult>
    return {
      ok: Boolean(parsed.ok),
      errors: Array.isArray(parsed.errors) ? parsed.errors : [],
      validatorKind: parsed.validatorKind || 'external-bridge',
      validatorVersion: parsed.validatorVersion,
      rootType: parsed.rootType || rootType,
    }
  } catch {
    return {
      ok: false,
      errors: [
        {
          path: '$',
          code: 'semantic_validator_invalid_json',
          message: 'semantic validator returned invalid JSON',
        },
      ],
      validatorKind: 'external-bridge',
      validatorVersion: undefined,
      rootType,
    }
  }
}
