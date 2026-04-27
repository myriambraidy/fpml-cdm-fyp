import type { LLMMessage } from '../agent/types'
import type {
  AuthoredCookbookPage,
  CookbookEvidencePacket,
  CriticReport,
  EvidenceAuditReport,
} from './types'

export const AUTHOR_SYSTEM_PROMPT = `You are an expert FPML to CDM cookbook author for an analyst-in-the-loop mapping copilot.

Your job is to write provider-neutral instructions that a capable LLM can use to propose a CDM representation from FPML.

Write from the supplied evidence only.
Do not invent mapping rules, CDM paths, product behavior, identifiers, party roles, defaults, enrichment, examples, or confidence levels.
If evidence is weak, partial, contradictory, or unclear, write an explicit caution or human-review trigger.

Optimize for agent actionability:
- say when a rule applies
- say what FPML source signals to inspect
- say what CDM target structure to propose
- say how to validate the proposal
- say when not to apply the rule
- include exceptions and analyst-review triggers

Do not produce a narrative research report.
Produce an operational cookbook page.

Every material claim must cite evidence ids in the claims array.
If a claim cannot be traced to evidence, omit it or mark it as unresolved.
Keep the output complete and concise. Prefer fewer stronger rules over a long exhaustive rewrite.
The JSON must be syntactically complete.

Return only JSON matching the requested schema.`

export const CRITIC_SYSTEM_PROMPT = `You are a strict reviewer of FPML to CDM agent cookbook documentation.

Assess whether the cookbook can safely guide an LLM to propose a CDM representation.

Review against this rubric:
- evidence grounding
- actionability
- CDM path specificity
- exception handling
- party-role safety
- enrichment/default safety
- validation quality
- concision
- usefulness for analyst review

Return only JSON.`

export const AUDITOR_SYSTEM_PROMPT = `You are an evidence auditor.

Your task is not to improve writing.
Your task is to verify whether every material claim in the cookbook is supported by the evidence packet.

Classify each claim:
- supported
- partially_supported
- unsupported
- overgeneralized
- contradicted

A claim is unsupported if its evidence ids do not exist or do not support the claim.
A claim is overgeneralized if it turns folder-specific, weak, pilot-only, or review-only evidence into a broad operational rule.

Return only JSON.`

export const REPAIR_SYSTEM_PROMPT = `You are revising an FPML to CDM cookbook page.

You may only fix issues raised by the critic and evidence auditor.
You may not add new claims unless they are directly supported by the evidence packet.
Prefer narrowing claims over making them sound stronger.
If a claim is unsupported, remove it or convert it into an unresolved question.

Return only JSON matching the original author schema.`

export const JUDGE_SYSTEM_PROMPT = `You are the final gate for an FPML to CDM cookbook authoring loop.

Pass only if:
- no unsupported claims remain
- no overgeneralized operational rules remain
- all low-confidence rules have human-review triggers
- the cookbook tells an LLM exactly how to propose CDM mappings
- weak folders are not presented as ready
- enrichment/default behavior is clearly guarded
- validation checklist is concrete

Return only JSON.`

export function buildAuthorMessages(packet: CookbookEvidencePacket): LLMMessage[] {
  return [
    { role: 'system', content: AUTHOR_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `${renderEvidencePacket(packet)}

<business_goal>
Write the best possible FPML to CDM agent cookbook page.
The page will be used by an LLM to propose a CDM representation for analyst review.
</business_goal>

<quality_bar>
A great page is evidence-grounded, concise, operational, explicit about exceptions, safe against overgeneralization, and useful for analyst review.
Prefer a compact cookbook that another LLM can use in context over a long report.
</quality_bar>

<section_contract>
The markdown must include every required section from the evidence packet as a visible markdown heading.
Use the exact section names when possible.
If the page has doNotAssume entries, include them under a "Do Not Assume" or "Universal Do Not Assume" heading.
</section_contract>

<required_output>
Return JSON:
{
  "markdown": "string",
  "claims": [
    {
      "claim": "string",
      "evidenceIds": ["string"],
      "confidence": "high|medium|low",
      "requiresHumanReview": true
    }
  ],
  "unresolvedQuestions": ["string"],
  "doNotAssume": ["string"]
}
</required_output>

Write the cookbook page now.`,
    },
  ]
}

export function buildCriticMessages(args: {
  packet: CookbookEvidencePacket
  page: AuthoredCookbookPage
}): LLMMessage[] {
  return [
    { role: 'system', content: CRITIC_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `${renderEvidencePacket(args.packet)}

<cookbook_page>
${escapeCdata(args.page.markdown)}
</cookbook_page>

<claims>
${JSON.stringify(args.page.claims, null, 2)}
</claims>

<required_output>
{
  "decision": "pass|repair_required|fail",
  "score": 0,
  "blockingIssues": [
    {
      "section": "string",
      "issue": "string",
      "requiredFix": "string"
    }
  ],
  "nonBlockingSuggestions": ["string"]
}
</required_output>`,
    },
  ]
}

export function buildAuditMessages(args: {
  packet: CookbookEvidencePacket
  page: AuthoredCookbookPage
}): LLMMessage[] {
  return [
    { role: 'system', content: AUDITOR_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `${renderEvidencePacket(args.packet)}

<cookbook_page>
${escapeCdata(args.page.markdown)}
</cookbook_page>

<claims>
${JSON.stringify(args.page.claims, null, 2)}
</claims>

<required_output>
{
  "decision": "pass|repair_required|fail",
  "auditedClaims": [
    {
      "claim": "string",
      "support": "supported|partially_supported|unsupported|overgeneralized|contradicted",
      "evidenceIds": ["string"],
      "reason": "string"
    }
  ],
  "unsupportedClaims": ["string"],
  "overgeneralizedClaims": ["string"],
  "missingEvidence": ["string"]
}
</required_output>`,
    },
  ]
}

export function buildRepairMessages(args: {
  packet: CookbookEvidencePacket
  page: AuthoredCookbookPage
  criticReport: CriticReport
  auditReport: EvidenceAuditReport
}): LLMMessage[] {
  return [
    { role: 'system', content: REPAIR_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `${renderEvidencePacket(args.packet)}

<current_markdown>
${escapeCdata(args.page.markdown)}
</current_markdown>

<current_claims>
${JSON.stringify(args.page.claims, null, 2)}
</current_claims>

<critic_report>
${JSON.stringify(args.criticReport, null, 2)}
</critic_report>

<audit_report>
${JSON.stringify(args.auditReport, null, 2)}
</audit_report>

<required_output>
Return the same JSON shape as the author.
</required_output>`,
    },
  ]
}

export function buildJudgeMessages(args: {
  packet: CookbookEvidencePacket
  page: AuthoredCookbookPage
  criticReport: CriticReport
  auditReport: EvidenceAuditReport
}): LLMMessage[] {
  return [
    { role: 'system', content: JUDGE_SYSTEM_PROMPT },
    {
      role: 'user',
      content: `<packet_summary>
id: ${args.packet.id}
title: ${args.packet.title}
status: ${args.packet.operationalStatus}
</packet_summary>

<cookbook_page>
${escapeCdata(args.page.markdown)}
</cookbook_page>

<critic_report>
${JSON.stringify(args.criticReport, null, 2)}
</critic_report>

<audit_report>
${JSON.stringify(args.auditReport, null, 2)}
</audit_report>

<required_output>
{
  "decision": "pass|repair_required|fail",
  "reason": "string",
  "scores": {
    "grounding": 0,
    "actionability": 0,
    "exceptionHandling": 0,
    "validation": 0,
    "agentUsability": 0
  }
}
</required_output>`,
    },
  ]
}

export function renderEvidencePacket(packet: CookbookEvidencePacket): string {
  return `<evidence_packet id="${escapeXml(packet.id)}" subjectType="${packet.subjectType}">
<title>${escapeXml(packet.title)}</title>
<operational_status>${packet.operationalStatus}</operational_status>
<status_instruction>The operational_status tag is the authoritative cookbook status for this page. If evidence mentions draft rollout readiness, treat it as background quality evidence, not as the page status.</status_instruction>
<required_sections>
${packet.requiredSections.map(section => `<section>${escapeXml(section)}</section>`).join('\n')}
</required_sections>
<allowed_claims_policy>
${packet.allowedClaimsPolicy.map(policy => `<policy>${escapeXml(policy)}</policy>`).join('\n')}
</allowed_claims_policy>
<deterministic_markdown>
${escapeCdata(packet.deterministicMarkdown)}
</deterministic_markdown>
<evidence_references>
${packet.evidenceReferences.map(renderEvidenceReference).join('\n')}
</evidence_references>
</evidence_packet>`
}

function renderEvidenceReference(reference: CookbookEvidencePacket['evidenceReferences'][number]): string {
  return `<evidence id="${escapeXml(reference.id)}" kind="${reference.kind}" source="${escapeXml(reference.source)}">
${escapeCdata(reference.text)}
</evidence>`
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function escapeCdata(value: string): string {
  return value.replaceAll(']]>', ']]]]><![CDATA[>')
}
