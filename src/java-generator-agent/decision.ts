export function isAcceptedDecision(markdown: string): boolean {
  return decisionText(markdown).some(line => /^Decision:\s*ACCEPTED$/iu.test(line))
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
