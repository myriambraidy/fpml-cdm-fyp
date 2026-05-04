import type { Field } from '../parser/types'
import type { MappingIR } from '../mapping-ir/types'

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMTool {
  name: string
  description: string
  input_schema: Record<string, unknown>
}

export interface LLMToolCall {
  id: string
  name: string
  input: Record<string, unknown>
}

export interface LLMResponse {
  content: string
  tool_calls?: LLMToolCall[]
}

export interface LLMClient {
  call(params: {
    messages: LLMMessage[]
    tools?: LLMTool[]
    model?: string
    /** Override client default `max_tokens` (e.g. CDM orchestrator needs a larger completion budget). */
    maxTokens?: number
    responseFormat?: {
      type: 'json_schema'
      json_schema: {
        name: string
        strict?: boolean
        schema: Record<string, unknown>
      }
    }
  }): Promise<LLMResponse>
}

export class LLMConfigurationError extends Error {
  override readonly name = 'LLMConfigurationError'
  constructor(message = 'OPENROUTER_API_KEY is required for live LLM calls') {
    super(message)
  }
}

export class LLMTimeoutError extends Error {
  override readonly name = 'LLMTimeoutError'
  constructor(message = 'LLM request timed out') {
    super(message)
  }
}

export class LLMHTTPError extends Error {
  override readonly name = 'LLMHTTPError'
  constructor(
    readonly status: number,
    readonly bodySnippet: string
  ) {
    super(`OpenRouter HTTP ${status}: ${bodySnippet.slice(0, 500)}`)
  }
}

export type LLMProtocolErrorKind =
  | 'empty_body'
  | 'json_parse'
  | 'not_json_object'
  | 'missing_choices'
  | 'missing_message'

export class LLMProtocolError extends Error {
  override readonly name = 'LLMProtocolError'
  readonly kind?: LLMProtocolErrorKind
  readonly httpStatus?: number

  constructor(
    message: string,
    opts?: { kind?: LLMProtocolErrorKind; httpStatus?: number }
  ) {
    super(message)
    this.kind = opts?.kind
    this.httpStatus = opts?.httpStatus
  }
}

export class LLMProviderError extends Error {
  override readonly name = 'LLMProviderError'
  constructor(message: string) {
    super(message)
  }
}

/** One evaluated skill output for analyst / review UI (DEC-03). */
export interface CandidateProposal {
  skillName: string
  cdmPath: string
  transformation: string
  confidence: number
  reasoning: string
  ir?: MappingIR
  rawOutput?: Record<string, unknown>
}

export interface OrchestrationTrace {
  partyOrder: readonly string[]
  llmCallCount: number
  arbitrationNotes: string[]
  retries: number
}

export interface MappingProposal {
  sourceField: Field
  cdmPath: string
  transformation: string
  confidence: number
  reasoning: string
  skillInvoked: string
  structuralHints: Record<string, unknown>
  candidateSkills: string[]
  candidateProposals: CandidateProposal[]
  needsReview: boolean
  trace: OrchestrationTrace
  scope: 'field' | 'entity'
  sourceEntityKey?: string
  sourceEntityType?: 'party' | 'stream' | 'premium' | 'schedule'
  cookbookRuleIds?: string[]
  cookbookFamily?: string | null
  assumptionNotes?: string[]
  ir: MappingIR
}
