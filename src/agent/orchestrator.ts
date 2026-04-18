import type { Field } from '../parser/types'
import { getSkill, matchSkills } from '../skills/registry'
import type { Skill } from '../skills/types'
import { CardinalityCheckerInput } from '../skills/cardinality-checker/schemas'
import { buildOrchestrationContext, type OrchestrationContext } from './context'
import { sortMatchedSkills } from './skill-priority'
import { getToolsFromSkills } from './tools'
import {
  buildMultiMatchRetryPrompt,
  buildMultiMatchSystemPrompt,
  buildMultiMatchUserPrompt,
} from './prompts'
import { env } from '../config'
import type {
  CandidateProposal,
  LLMClient,
  LLMMessage,
  LLMResponse,
  LLMToolCall,
  MappingProposal,
  OrchestrationTrace,
} from './types'

/** Exported for T7 — Zod safe-parse on skill input. */
export const safeParseSkillInput = (skill: Skill, input: unknown) =>
  skill.inputSchema.safeParse(input)

/**
 * Field → cardinality pre-pass → matchSkills → (multi) evaluate candidates → optional LLM pick.
 * plans/week2-implementation-plan.md §0 (DEC-01..DEC-07); docs/architecture.md §Main Orchestrator.
 */
export class MappingAgent {
  private readonly cardinalitySkill: Skill

  constructor(private readonly llm?: LLMClient) {
    const c = getSkill('cardinality_checker')
    if (!c) {
      throw new Error(
        'cardinality_checker must be registered before MappingAgent (import src/skills first)'
      )
    }
    this.cardinalitySkill = c
  }

  async generateMappings(fields: Field[]): Promise<MappingProposal[]> {
    const docCtx = buildOrchestrationContext(fields)
    const proposals: MappingProposal[] = []
    for (const field of fields) {
      proposals.push(await this.mapField(field, docCtx))
    }
    return proposals
  }

  private async mapField(
    field: Field,
    docCtx: OrchestrationContext
  ): Promise<MappingProposal> {
    const trace: OrchestrationTrace = {
      partyOrder: docCtx.partyOrder,
      llmCallCount: 0,
      arbitrationNotes: [],
      retries: 0,
    }

    const cardInput = CardinalityCheckerInput.parse({
      fieldName: field.name,
      fieldPath: field.path,
      fieldValue: field.value,
      fieldType: field.type,
      context: field.context,
      isArray: field.isArray,
      minOccurs: field.minOccurs,
      maxOccurs: field.maxOccurs,
    })

    const rawHints = await Promise.resolve(this.cardinalitySkill.fn(cardInput))
    const structuralHints = this.cardinalitySkill.outputSchema.parse(
      rawHints
    ) as Record<string, unknown>

    const matched = matchSkills({
      name: field.name,
      type: field.type,
      path: field.path,
    })
    const sorted = sortMatchedSkills(matched)
    const candidateSkills = sorted.map(s => s.name)

    if (sorted.length === 0) {
      return this.unmappedProposal(
        field,
        structuralHints,
        candidateSkills,
        [],
        trace,
        'no_skill_matched'
      )
    }

    if (sorted.length === 1) {
      return this.singleSkillProposal(
        field,
        sorted[0]!,
        structuralHints,
        docCtx.partyOrder,
        candidateSkills,
        trace
      )
    }

    const candidates = await this.evaluateAllCandidates(
      sorted,
      field,
      structuralHints,
      docCtx.partyOrder,
      trace
    )

    if (candidates.length === 0) {
      trace.arbitrationNotes.push('All matched skills failed evaluation')
      return this.unmappedProposal(
        field,
        structuralHints,
        candidateSkills,
        [],
        trace,
        'candidate_eval_all_failed'
      )
    }

    if (!this.llm) {
      return this.multiMatchDeterministic(
        field,
        structuralHints,
        candidateSkills,
        candidates,
        trace
      )
    }

    try {
      return await this.multiMatchWithLlm(
        field,
        structuralHints,
        docCtx.partyOrder,
        sorted,
        candidateSkills,
        candidates,
        trace
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      trace.arbitrationNotes.push(
        `LLM error (deterministic fallback): ${msg.slice(0, 400)}`
      )
      return this.multiMatchDeterministic(
        field,
        structuralHints,
        candidateSkills,
        candidates,
        trace
      )
    }
  }

  private unmappedProposal(
    field: Field,
    structuralHints: Record<string, unknown>,
    candidateSkills: string[],
    candidateProposals: CandidateProposal[],
    trace: OrchestrationTrace,
    transformation: string
  ): MappingProposal {
    return {
      sourceField: field,
      cdmPath: `unmapped.${field.name}`,
      transformation,
      confidence: 0,
      reasoning: 'No applicable skill output',
      skillInvoked: 'none',
      structuralHints,
      candidateSkills,
      candidateProposals,
      needsReview: true,
      trace,
    }
  }

  private async singleSkillProposal(
    field: Field,
    skill: Skill,
    structuralHints: Record<string, unknown>,
    partyOrder: readonly string[],
    candidateSkills: string[],
    trace: OrchestrationTrace
  ): Promise<MappingProposal> {
    const base = this.buildCanonicalInput(field, structuralHints, partyOrder)
    const parsed = skill.inputSchema.parse(base)
    const raw = await Promise.resolve(skill.fn(parsed))
    const out = skill.outputSchema.parse(raw) as {
      cdmPath: string
      transformation: string
      confidence: number
      reasoning: string
    }

    return {
      sourceField: field,
      cdmPath: out.cdmPath,
      transformation: out.transformation,
      confidence: out.confidence,
      reasoning: out.reasoning,
      skillInvoked: skill.name,
      structuralHints,
      candidateSkills,
      candidateProposals: [],
      needsReview: out.confidence < env.REVIEW_CONFIDENCE_THRESHOLD,
      trace,
    }
  }

  private async evaluateAllCandidates(
    skills: Skill[],
    field: Field,
    structuralHints: Record<string, unknown>,
    partyOrder: readonly string[],
    trace: OrchestrationTrace
  ): Promise<CandidateProposal[]> {
    const base = this.buildCanonicalInput(field, structuralHints, partyOrder)
    const out: CandidateProposal[] = []

    for (const skill of skills) {
      const parsed = skill.inputSchema.safeParse(base)
      if (!parsed.success) continue
      try {
        const raw = await Promise.resolve(skill.fn(parsed.data))
        const po = skill.outputSchema.safeParse(raw)
        if (!po.success) {
          trace.arbitrationNotes.push(
            `candidate ${skill.name}: output schema rejected (${po.error.message.slice(0, 200)})`
          )
          continue
        }
        const d = po.data as {
          cdmPath: string
          transformation: string
          confidence: number
          reasoning: string
        }
        out.push({
          skillName: skill.name,
          cdmPath: d.cdmPath,
          transformation: d.transformation,
          confidence: d.confidence,
          reasoning: d.reasoning,
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        trace.arbitrationNotes.push(
          `candidate ${skill.name}: execution error (${msg.slice(0, 200)})`
        )
      }
    }
    return out
  }

  private multiMatchDeterministic(
    field: Field,
    structuralHints: Record<string, unknown>,
    candidateSkills: string[],
    candidates: CandidateProposal[],
    trace: OrchestrationTrace
  ): MappingProposal {
    const winner = candidates[0]!
    const pathConflict = candidates.some(c => c.cdmPath !== winner.cdmPath)
    const confidence = pathConflict
      ? Math.min(...candidates.map(c => c.confidence))
      : winner.confidence

    return {
      sourceField: field,
      cdmPath: winner.cdmPath,
      transformation: winner.transformation,
      confidence,
      reasoning: winner.reasoning,
      skillInvoked: winner.skillName,
      structuralHints,
      candidateSkills,
      candidateProposals: candidates,
      needsReview: true,
      trace,
    }
  }

  private async multiMatchWithLlm(
    field: Field,
    structuralHints: Record<string, unknown>,
    partyOrder: readonly string[],
    sorted: Skill[],
    candidateSkills: string[],
    candidates: CandidateProposal[],
    trace: OrchestrationTrace
  ): Promise<MappingProposal> {
    const tools = getToolsFromSkills(sorted)
    const allowed = new Set(sorted.map(s => s.name))

    const tryPick = (response: LLMResponse): LLMToolCall | null =>
      response.tool_calls?.[0] ?? null

    const isUsablePick = (pick: LLMToolCall | null): pick is LLMToolCall =>
      Boolean(
        pick &&
          allowed.has(pick.name) &&
          candidates.some(c => c.skillName === pick.name)
      )

    const callLlm = async (messages: LLMMessage[]) => {
      trace.llmCallCount++
      return this.llm!.call({ messages, tools })
    }

    const systemContent = buildMultiMatchSystemPrompt()
    let messages: LLMMessage[] = [
      { role: 'system', content: systemContent },
      {
        role: 'user',
        content: buildMultiMatchUserPrompt(
          field,
          candidateSkills,
          structuralHints
        ),
      },
    ]

    let response = await callLlm(messages)
    let pick = tryPick(response)

    if (!isUsablePick(pick)) {
      trace.retries = 1
      // Use response.tool_calls[0] here — after `!isUsablePick(pick)` TS can narrow `pick` to `never`
      // in the else-branch (inverted type-predicate + control-flow), which breaks `.name` access.
      const rawTool = response.tool_calls?.[0]
      let reason: string
      if (rawTool == null) {
        reason = 'no tool_calls'
      } else if (!allowed.has(rawTool.name)) {
        reason = `tool not in allowed set: ${rawTool.name}`
      } else {
        reason = `tool ${rawTool.name} had no evaluated candidate`
      }
      messages = [
        { role: 'system', content: systemContent },
        messages[1]!,
        {
          role: 'user',
          content: buildMultiMatchRetryPrompt(
            field,
            candidateSkills,
            structuralHints,
            reason
          ),
        },
      ]
      response = await callLlm(messages)
      pick = tryPick(response)
    }

    let winner: CandidateProposal

    if (isUsablePick(pick)) {
      const skill = sorted.find(s => s.name === pick.name)!
      const merged = this.mergeToolInput(field, structuralHints, partyOrder, pick.input)
      const parsed = skill.inputSchema.safeParse(merged)
      if (!parsed.success) {
        trace.arbitrationNotes.push(
          `Zod parse failed on merged LLM tool input: ${parsed.error.message}`
        )
      }
      winner = candidates.find(c => c.skillName === pick.name) ?? candidates[0]!
    } else {
      trace.arbitrationNotes.push('LLM did not return a usable tool; priority fallback')
      winner = candidates[0]!
    }

    const needsReview =
      trace.arbitrationNotes.length > 0 ||
      winner.confidence < env.REVIEW_CONFIDENCE_THRESHOLD

    return {
      sourceField: field,
      cdmPath: winner.cdmPath,
      transformation: winner.transformation,
      confidence: winner.confidence,
      reasoning: [winner.reasoning, ...trace.arbitrationNotes].filter(Boolean).join(' | '),
      skillInvoked: winner.skillName,
      structuralHints,
      candidateSkills,
      candidateProposals: candidates,
      needsReview,
      trace,
    }
  }

  private buildCanonicalInput(
    field: Field,
    structuralHints: Record<string, unknown>,
    partyOrder: readonly string[]
  ): Record<string, unknown> {
    const ctx: Record<string, unknown> = {
      ...(field.context as Record<string, unknown> | undefined),
      structuralHints,
      partyOrder: [...partyOrder],
    }
    return {
      fieldName: field.name,
      fieldPath: field.path,
      fieldValue: field.value,
      fieldType: field.type,
      context: ctx,
    }
  }

  /**
   * D7: model cannot override field identity; only enrich `context` and other allowed keys.
   */
  private mergeToolInput(
    field: Field,
    structuralHints: Record<string, unknown>,
    partyOrder: readonly string[],
    modelInput: Record<string, unknown>
  ): Record<string, unknown> {
    const baseContext: Record<string, unknown> = {
      ...(field.context as Record<string, unknown> | undefined),
      structuralHints,
      partyOrder: [...partyOrder],
    }
    const modelCtx =
      modelInput.context != null &&
      typeof modelInput.context === 'object' &&
      !Array.isArray(modelInput.context)
        ? (modelInput.context as Record<string, unknown>)
        : {}

    const { context: _drop, ...restModel } = modelInput

    return {
      ...restModel,
      fieldName: field.name,
      fieldPath: field.path,
      fieldValue: field.value,
      fieldType: field.type,
      context: { ...baseContext, ...modelCtx },
    }
  }
}
