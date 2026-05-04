import { readFile, writeFile } from 'node:fs/promises'

export async function writeRoundSummary(args: {
  round: number
  plannerPath: string
  criticPath: string
  resolutionPath: string
  outputPath: string
}): Promise<void> {
  const [planner, critic, resolution] = await Promise.all([
    readFile(args.plannerPath, 'utf8'),
    readFile(args.criticPath, 'utf8'),
    readFile(args.resolutionPath, 'utf8'),
  ])

  await writeFile(
    args.outputPath,
    `# Round ${args.round} Summary

Decision: ${extractDecision(resolution)}

## Planner Focus

${extractBullets(planner, 8)}

## Critic Findings

${extractBullets(critic, 10)}

## Resolution Notes

${extractBullets(resolution, 10)}
`,
    'utf8'
  )
}

function extractDecision(markdown: string): string {
  const match = markdown.match(/Decision:\s*(ACCEPTED|NEXT_ROUND_REQUIRED|FAILED)/iu)
  return match?.[1] ?? 'UNKNOWN'
}

function extractBullets(markdown: string, limit: number): string {
  const bullets = markdown
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.startsWith('- ') || /^\d+\./u.test(line))
    .slice(0, limit)
  return bullets.length === 0 ? '- No concise bullets found in artifact.' : bullets.join('\n')
}
