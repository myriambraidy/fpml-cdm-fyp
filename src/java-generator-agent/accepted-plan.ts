import { readFile, writeFile } from 'node:fs/promises'

export async function synthesizeAcceptedPlan(args: {
  round: number
  productScopePath: string
  evidencePacketPath: string
  plannerPath: string
  criticPath: string
  resolutionPath: string
  validationPath: string
  outputPath: string
}): Promise<void> {
  const [scope, planner, critic, resolution, validation] = await Promise.all([
    readFile(args.productScopePath, 'utf8'),
    readFile(args.plannerPath, 'utf8'),
    readFile(args.criticPath, 'utf8'),
    readFile(args.resolutionPath, 'utf8'),
    readFile(args.validationPath, 'utf8'),
  ])

  await writeFile(
    args.outputPath,
    `# Accepted Plan

Accepted in round ${args.round}.

This file is the implementation contract. It is synthesized from the product
scope, planner plan, critic review, critique resolution, and deterministic plan
validation. The full evidence packet path is referenced below for on-demand reads
via tools (for example get_context_packet); it is not inlined here to keep this
artifact small.

## Product Scope Contract

${scope}

## Deterministic Validation

${validation}

## Planner Plan

${planner}

## Critic Review

${critic}

## Critique Resolution

${resolution}

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

\`\`\`text
${args.evidencePacketPath}
\`\`\`

Use evidence-index.md and get_context_packet when implementer or repair roles need detail; do not assume this file repeats evidence content.
`,
    'utf8'
  )
}
