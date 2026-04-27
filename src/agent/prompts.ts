import type { Field } from '../parser/types'

/** Short system prompt for tool-style multi-skill arbitration (OpenRouter chat). */
export const buildMultiMatchSystemPrompt = (): string =>
  'You map FPML fields to CDM via the provided tools only. When tools are listed, call exactly one whose name is in the allowed skill set; do not invent CDM paths or skill names. Cookbook guidance is advisory context and must never override deterministic tool semantics.'

const STRICT_SUFFIX = `

STRICT: Call exactly one function. The function name MUST be one of the allowed skill names below.
Arguments may omit keys; the server merges canonical field data. Do not invent field paths.`

export const buildMultiMatchUserPrompt = (
  field: Field,
  allowedSkillNames: string[],
  structuralHints: Record<string, unknown>,
  cookbookGuidance?: string | null
): string => {
  return `Map this field to CDM by selecting the single best skill tool.

Allowed skill names: ${allowedSkillNames.join(', ')}

Field:
- name: ${field.name}
- path: ${field.path}
- type: ${field.type ?? 'unknown'}
- value: ${field.value ?? 'N/A'}
- context: ${JSON.stringify(field.context ?? {})}

Cardinality / structural pre-pass:
${JSON.stringify(structuralHints)}
${cookbookGuidance ? `\nCookbook runtime guidance:\n${cookbookGuidance}` : ''}
${STRICT_SUFFIX}`
}

export const buildMultiMatchRetryPrompt = (
  field: Field,
  allowedSkillNames: string[],
  structuralHints: Record<string, unknown>,
  reason: string,
  cookbookGuidance?: string | null
): string => {
  return `${buildMultiMatchUserPrompt(field, allowedSkillNames, structuralHints, cookbookGuidance)}

Previous attempt failed: ${reason}
Retry: respond with exactly one tool call whose name is in the allowed list.`
}
