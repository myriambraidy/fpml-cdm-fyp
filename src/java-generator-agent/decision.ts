export type PlanningDecision = 'accepted' | 'next_round_required' | 'failed' | 'unrecognized'

export function parsePlanningDecision(markdown: string): PlanningDecision {
  const lines = decisionText(markdown)
  const decisionLine = lines.find(line =>
    /^(?:final\s+decision|decision|critique\s+decision)\s*:/iu.test(line)
  )
  const candidate = decisionLine ?? lines.find(line => /^(?:accepted|next_round_required|failed)$/iu.test(line))
  if (candidate === undefined) return 'unrecognized'

  const normalized = candidate
    .replace(/^(?:final\s+decision|decision|critique\s+decision)\s*:\s*/iu, '')
    .trim()
    .toUpperCase()

  if (normalized === 'ACCEPTED') return 'accepted'
  if (normalized === 'NEXT_ROUND_REQUIRED') return 'next_round_required'
  if (normalized === 'FAILED') return 'failed'
  return 'unrecognized'
}

export function isAcceptedDecision(markdown: string): boolean {
  return parsePlanningDecision(markdown) === 'accepted'
}

function decisionText(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .map(line =>
      line
        .replace(/^#+\s*/u, '')
        .replace(/\*\*/gu, '')
        .replace(/`/gu, '')
        .trim()
    )
}
