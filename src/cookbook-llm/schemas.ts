import { z } from 'zod'
import type {
  AuthoredCookbookPage,
  CriticReport,
  EvidenceAuditReport,
  StopJudgeReport,
} from './types'

const AuthoredClaimSchema = z.object({
  claim: z.string().min(1),
  evidenceIds: z.array(z.string().min(1)),
  confidence: z.enum(['high', 'medium', 'low']),
  requiresHumanReview: z.boolean(),
})

export const AuthoredCookbookPageSchema: z.ZodType<AuthoredCookbookPage> = z.object({
  markdown: z.string().min(100),
  claims: z.array(AuthoredClaimSchema),
  unresolvedQuestions: z.array(z.string()),
  doNotAssume: z.array(z.string()),
})

export const CriticReportSchema: z.ZodType<CriticReport> = z.object({
  decision: z.enum(['pass', 'repair_required', 'fail']),
  score: z.number().int().min(0).max(100),
  blockingIssues: z.array(
    z.object({
      section: z.string().min(1),
      issue: z.string().min(1),
      requiredFix: z.string().min(1),
    })
  ),
  nonBlockingSuggestions: z.array(z.string()),
})

export const EvidenceAuditReportSchema: z.ZodType<EvidenceAuditReport> = z.object({
  decision: z.enum(['pass', 'repair_required', 'fail']),
  auditedClaims: z.array(
    z.object({
      claim: z.string().min(1),
      support: z.enum([
        'supported',
        'partially_supported',
        'unsupported',
        'overgeneralized',
        'contradicted',
      ]),
      evidenceIds: z.array(z.string()),
      reason: z.string().min(1),
    })
  ),
  unsupportedClaims: z.array(z.string()),
  overgeneralizedClaims: z.array(z.string()),
  missingEvidence: z.array(z.string()),
})

export const StopJudgeReportSchema: z.ZodType<StopJudgeReport> = z.object({
  decision: z.enum(['pass', 'repair_required', 'fail']),
  reason: z.string().min(1),
  scores: z.object({
    grounding: z.number().int().min(0).max(100),
    actionability: z.number().int().min(0).max(100),
    exceptionHandling: z.number().int().min(0).max(100),
    validation: z.number().int().min(0).max(100),
    agentUsability: z.number().int().min(0).max(100),
  }),
})
