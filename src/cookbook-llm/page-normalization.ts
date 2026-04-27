import type { AuthoredCookbookPage, CookbookEvidencePacket } from './types'

export function normalizeAuthoredPage(
  page: AuthoredCookbookPage,
  packet: CookbookEvidencePacket
): AuthoredCookbookPage {
  const markdown = ensureStructuredSections(page.markdown, page, packet)
  if (markdown === page.markdown) return page
  return { ...page, markdown }
}

function ensureStructuredSections(
  markdown: string,
  page: AuthoredCookbookPage,
  packet: CookbookEvidencePacket
): string {
  let normalized = markdown.trimEnd()
  if (requiresDoNotAssume(packet) && page.doNotAssume.length > 0 && !hasHeading(normalized, 'Do Not Assume')) {
    normalized = appendSection(normalized, 'Do Not Assume', page.doNotAssume)
  }
  if (
    requiresHumanReview(packet) &&
    page.unresolvedQuestions.length > 0 &&
    !hasHeading(normalized, 'Human Review Triggers')
  ) {
    normalized = appendSection(normalized, 'Human Review Triggers', page.unresolvedQuestions)
  }
  return normalized
}

function requiresDoNotAssume(packet: CookbookEvidencePacket): boolean {
  return packet.requiredSections.some(section => section.toLowerCase().includes('do not assume'))
}

function requiresHumanReview(packet: CookbookEvidencePacket): boolean {
  return packet.requiredSections.some(section => section.toLowerCase().includes('human review'))
}

function hasHeading(markdown: string, section: string): boolean {
  const expected = section.toLowerCase()
  return markdown
    .split('\n')
    .some(line => line.replace(/^#+\s*/, '').trim().toLowerCase().includes(expected))
}

function appendSection(markdown: string, heading: string, lines: string[]): string {
  const body = lines.map(line => `- ${line}`).join('\n')
  return `${markdown}\n\n## ${heading}\n\n${body}`
}
