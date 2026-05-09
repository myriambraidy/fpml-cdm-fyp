import { readFile, writeFile } from 'node:fs/promises'
import { DEFAULT_JAVA_SHELL_PLAN_CONTRACT } from './plan-validator'
import { requiredRosettaAreasForScope } from './rosetta-retrieval'

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

## Machine-Checked Implementation Contract

This section is authoritative when it conflicts with planner narrative.
The planner, critic, and reviewer sections are historical rationale. They cannot
authorize CDM Java classes, builder methods, generated packages, runtime
fixtures, or file ownership that conflict with this section or deterministic
validation.

### Java Shell Contract

- Generated package: ${DEFAULT_JAVA_SHELL_PLAN_CONTRACT.generatedPackage}
- Main generated class: ${DEFAULT_JAVA_SHELL_PLAN_CONTRACT.mainGeneratedClass}
- Required interface: ${DEFAULT_JAVA_SHELL_PLAN_CONTRACT.requiredInterface}
- Generated source root: ${DEFAULT_JAVA_SHELL_PLAN_CONTRACT.generatedSourceRoot}
- Shell-owned files must not be rewritten:
${DEFAULT_JAVA_SHELL_PLAN_CONTRACT.shellOwnedFiles.map(path => `  - ${path}`).join('\n')}

### Rosetta Evidence Contract

Rosetta source is mapping-intent authority only. CDM Java class and builder
authority comes from the approved CDM API contract and semantic recipes.

${renderRosettaContract()}

### Runtime Contract

Runtime-supported fixtures are the fixture ids listed in the deterministic
validation section below. Observed fixtures outside that list are not runtime
supported by this accepted plan.

### Approved Java API Guardrails

- Java implementation authority comes from approved-cdm-api-contract-summary.md and semantic-recipes.md only.
- Use TradeState.builder().setTrade(trade).build() for the final root output.
- Do not use ProductIdentifier or ProductTaxonomy as Java implementation classes unless a future approved API contract explicitly adds them.
- Do not use AdjustableOrAdjustedDateOrRelativeDate or AdjustableOrRelativeDateOrExpression as Java implementation classes unless a future approved API contract explicitly adds them.
- Rosetta functions named MapProductIdentifierList, MapProductIdentifier, or MapProductTaxonomyList remain mapping-intent evidence only.

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

function renderRosettaContract(): string {
  const areas = requiredRosettaAreasForScope({
    productFamily: 'fx-derivatives',
    implementationGroup: 'fx-single-leg',
  })
  return Object.entries(areas)
    .map(([area, functions]) => `- ${area}: ${functions.join(', ')}`)
    .join('\n')
}
