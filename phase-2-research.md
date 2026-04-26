# Phase 2 Research: Generating Agentic FPML -> CDM Skills

Date: 2026-04-26

## Purpose

Phase 1 generated folder-level drafts under `data/drafts`. Phase 2 should convert those drafts into agent-facing mapping documentation: concise rules, cookbook steps, evidence-backed caveats, and validation checks that a mapping agent can use when proposing CDM output from FPML input.

The output should not be a narrative research report. It should be a reusable instruction corpus for agents, with enough provenance for analyst review.

## Business Need

The product is an analyst-in-the-loop FPML -> CDM mapping copilot, not an autonomous code generator. The narrow success target from `docs/design.md` is:

- analysts upload or inspect a format and receive a proposed CDM mapping quickly
- the mapping proposal includes evidence, confidence, transformation notes, and unresolved questions
- analysts can approve, edit, reject, and export a reviewed mapping package
- Rosetta/Java generation is later, after the mapping stage is trusted

This means the Phase 2 documentation generator must optimize for:

- correctness over breadth
- traceable evidence over generic explanations
- explicit uncertainty over confident guesses
- small reusable skills over one giant document
- validation and human review hooks over fully automatic generalization

## Web Research Summary

### Agent instructions should be explicit, procedural, and grounded

OpenAI's agent-building guide recommends converting existing operating procedures and policy documents into LLM-friendly routines, breaking dense resources into smaller steps, making every step correspond to a clear action or output, and explicitly capturing edge cases and branches. Source: [OpenAI practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/).

Implication for this project:

- Each generated skill should be a routine, not prose.
- A rule should say what to inspect, what to map, when it applies, what output to produce, and when to escalate.
- Edge cases belong inside the skill as conditional branches, not in a separate "notes" section that agents may ignore.

### Skills should be portable instruction sets with references loaded on demand

The MCP agent-skills documentation describes agent skills as portable instruction sets that encode domain knowledge and design decisions. It also notes a practical file shape: a primary `SKILL.md` plus a `references/` folder read on demand. Source: [MCP Build with Agent Skills](https://modelcontextprotocol.io/docs/develop/build-with-agent-skills).

Implication for this project:

- Phase 2 should produce one compact entry document per skill/family.
- Heavy evidence, example lists, and pair-level appendices should be placed in references or JSON sidecars.
- The top-level skill should fit in context and tell the agent when to open deeper evidence.

### Prompt and instruction docs should define success criteria before polishing prompts

Anthropic's prompt engineering overview says prompt work should start with clear success criteria and empirical tests. Anthropic's success-criteria guidance emphasizes specific and measurable criteria. Sources: [Anthropic prompt engineering overview](https://docs.anthropic.com/en/docs/prompt-engineering) and [Anthropic define success criteria](https://docs.anthropic.com/en/docs/test-and-evaluate/define-success).

Implication for this project:

- The generator should emit evaluation criteria with every skill.
- "Good documentation" is not enough. A generated skill is good if an agent can use it to produce mappings that analysts approve and that pass structural/semantic checks.

### Examples improve structured output and consistency

Anthropic's multishot prompting guidance says examples improve accuracy, consistency, and structured-format adherence, especially when examples are relevant, diverse, and cover edge cases. OpenAI's prompt engineering guidance also recommends explicit output formats and examples. Sources: [Anthropic multishot prompting](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting) and [OpenAI prompt engineering best practices](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api).

Implication for this project:

- Every generated skill should include a few compact worked examples.
- Examples should include at least one "happy path" and one cautionary or ambiguous path.
- Long raw example lists should not crowd the main skill; they should be sidecar evidence.

### Structured separation of context, rules, examples, and output format matters

Anthropic recommends using structure, including XML-style tags, to separate instructions, examples, and formatting when prompts contain multiple components. Source: [Anthropic XML tag guidance](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags).

Implication for this project:

- Even if the final artifact is Markdown, the sections should be stable and machine-readable.
- Recommended sections: Scope, Trigger Signals, Preconditions, Rules, Procedure, Examples, Validation, Do Not Assume, Escalation.

### Guardrails and instruction hierarchy matter for agent-consumed documents

OpenAI's Agents SDK guardrail docs distinguish input, output, and tool guardrails, and note that tool guardrails can validate or block tool calls before and after execution. OpenAI's instruction hierarchy research highlights that agents receive instructions from multiple sources and must prioritize trusted instructions over untrusted content. Sources: [OpenAI Agents SDK guardrails](https://openai.github.io/openai-agents-js/guides/guardrails/) and [OpenAI instruction hierarchy research](https://openai.com/index/instruction-hierarchy-challenge/).

Implication for this project:

- Generated skills should mark source FPML/CDM examples as evidence, not instructions.
- The skill should tell agents not to follow instructions embedded in source documents.
- Validation checks should be explicit enough to become guardrails later.

## Local Source Analysis

Relevant local files:

- `docs/design.md`: defines the analyst-in-the-loop business goal and the skill-augmented mapping architecture.
- `docs/schemas/mapping-domains.md`: identifies core skill domains such as party roles, temporal mapping, cardinality, interest-rate swaps, credit derivatives, equity derivatives, FX derivatives, and exercise terms.
- `docs/mapping-rules.md`: early manually researched rules for party roles, units, LIBOR, and contextual ambiguity.
- `src/draft/types.ts`: the current draft artifact contract.
- `src/draft/folder-synthesis.ts`: the current synthesis schema and quality heuristics.
- `data/drafts/*`: generated folder-level outputs.

The current draft schema is already close to what Phase 2 needs. The useful fields are:

- `synthesis.evidenceCoverage`
- `synthesis.stableMappingPatterns`
- `synthesis.repeatedNonLiteralTransformations`
- `synthesis.tentativeRepeatedPatterns`
- `synthesis.folderLevelPrinciples`
- `synthesis.variantsAndExceptions`
- `synthesis.suspectedEnrichmentOrDefaultBehavior`
- `synthesis.openQuestions`
- `synthesis.agentPlaybook`
- `synthesis.draftConclusion`
- `debug.publication`
- `debug.qualityAssessment`
- `debug.rolloutReadiness`

The important finding is that `draft.json` alone is not enough. Some folders have a `draft.json` but the corresponding `debug.json` says the publication failed integrity validation or is not ready for rollout. Phase 2 should read both.

## Draft Folder Findings

| Folder | Draft state | Semantic basis | Quality | Main Phase 2 treatment |
|---|---:|---:|---|---|
| `bond-options` | `draft.json`, but debug publication failed | 3/3 full | weak | Keep as pilot/reference only. Do not publish stable rules broadly until integrity issue is fixed. |
| `commodity-derivatives` | final | 23/23 full | strong | Good candidate for first generated cookbook. |
| `correlation-swaps` | final | 4/4 full | good | Usable but evidence count is small; mark many rules as pilot. |
| `credit-derivatives` | final | 40/40 full | good | Large semantic basis, but zero stable rules in synthesis. Generate cautious domain guide from transformations/tentative patterns. |
| `dividend-swaps` | partial | 0/3 semantic | poor | Structural scaffold only. Do not generate semantic skill rules. |
| `equity-options` | final file, but fallback synthesis | 6/27 semantic | poor | Do not publish as stable. Use only as "needs regeneration/human review" artifact. |
| `equity-swaps` | `draft.json`, but debug publication failed | 18/18 full | fair | Keep rules but tag as integrity-blocked; requires evidence cleanup. |
| `fx-derivatives` | final | 25/25 full | strong | Best first skill/cookbook candidate. |
| `inflation-swaps` | final | 5/5 full | strong | Good candidate, but small folder and high open-question density. |
| `interest-rate-derivatives` | partial and debug publication failed | 11/11 semantic, 24 missing | good | Useful pilot material, but incomplete folder coverage. Must label as partial. |
| `total-return-swaps` | final | 3/3 full | good | Usable only with small-sample warnings. |

### Repeated cross-folder patterns

These appear across multiple folders and should likely become global skills or shared cookbook sections:

- Trade identifiers: FpML `tradeHeader.partyTradeIdentifier.tradeId` often maps into CDM `tradeIdentifier.assignedIdentifier.identifier.value`.
- Date normalization: trailing `Z` or dateTime values often become CDM date-only strings such as `YYYY-MM-DD`.
- Party reference resolution: FpML hrefs need resolution into CDM `party`, `counterparty`, `payerReceiver`, or ancillary party structures.
- Quantity and amount normalization: source amount plus currency/unit often becomes CDM quantity/price structures with explicit unit.
- Wrapper insertion: CDM often introduces scaffolding such as `tradeLot`, `priceQuantity`, `payout`, `settlementTerms`, `adjustableDate`, or `adjustableOrRelativeDate`.
- Enrichment/default behavior: global keys, generated identifiers, normalized exchange codes, calculation-agent defaults, and LEI-like identifiers often appear without direct FpML evidence.

### High-risk recurring ambiguities

These should be explicit "Do not assume" entries:

- Party direction can invert or vary by context. Buyer/seller, payer/receiver, premium payer, settlement payer, and stream payer need context.
- CDM `Party1`/`Party2` role assignment is not always derivable from naive source order.
- Duplicated or enriched trade identifiers may not be direct copies.
- Exchange code normalization requires a controlled mapping table, not string guessing.
- Generated CDM keys and external identifiers should be treated as enrichment unless provenance is clear.
- Small folders may show a pattern only because the examples are too narrow.

## Recommended Phase 2 Output Shape

Use the name `agent-cookbook` for the generated corpus. It is clearer than "skills" while still compatible with a future `SKILL.md` layout.

Recommended output directory:

```text
data/agent-cookbook/
  index.md
  global/
    fpml-cdm-core-rules.md
    party-reference-resolution.md
    temporal-normalization.md
    identifier-handling.md
    quantity-and-unit-normalization.md
  product-families/
    fx-derivatives.md
    commodity-derivatives.md
    inflation-swaps.md
    ...
  references/
    fx-derivatives.evidence.json
    commodity-derivatives.evidence.json
    ...
  manifest.json
```

Future skill-compatible shape:

```text
skills/fpml-cdm-mapping/
  SKILL.md
  references/
    global-rules.md
    product-families/
    evidence/
```

## Recommended Document Template

Each generated product-family document should use this stable structure:

```markdown
# FPML -> CDM Cookbook: <folder>

## Status
- Readiness: ready | pilot_only | not_ready
- Evidence basis: X/Y matched pairs, Z full semantic analyses
- Source draft: <path>
- Use this document for: ...
- Do not use this document for: ...

## Trigger Signals
- Source root/product elements that indicate this family.
- Field/path signals that should route an agent here.

## Canonical Mapping Procedure
1. Identify product subtype.
2. Resolve parties and role direction.
3. Map identifiers.
4. Normalize dates.
5. Map economics: notional, quantity, price, currency, units.
6. Build product-specific payout/settlement/exercise structures.
7. Apply validations and mark unresolved questions.

## Stable Rules
For each rule:
- Rule ID
- When to apply
- Source signals
- CDM target
- Action
- Evidence count
- Example files
- Confidence/readiness
- Caveats
- Validation check

## Transformations
Split/merge/normalization/reference-resolution/wrapper insertion rules.

## Variants and Branches
Product subtypes, optional structures, and branch-specific handling.

## Enrichment and Defaults
Only describe as allowed when evidence supports it. Otherwise mark as suspected.

## Do Not Assume
Short hard prohibitions.

## Human Review Triggers
Conditions that require analyst confirmation.

## Worked Examples
Compact examples showing source signal -> CDM action -> validation.

## Source Evidence
Pointer to evidence sidecar.
```

## Recommended Rule Object Schema

The generator should create structured JSON first, then render Markdown from it. Suggested schema:

```ts
type CookbookRule = {
  id: string
  title: string
  scope: 'global' | 'product-family'
  family?: string
  readiness: 'ready' | 'pilot_only' | 'not_ready'
  confidence: 'high' | 'medium' | 'low'
  sourceSignals: string[]
  targetPaths: string[]
  action: string
  evidence: {
    count: number
    files: string[]
    draftPath: string
    semanticBasis: number
    totalPairs: number
  }
  caveats: string[]
  doNotAssume: string[]
  validationChecks: string[]
  humanReviewTriggers: string[]
}
```

## Evidence Gating Rules

Phase 2 must be more conservative than Phase 1.

Recommended gates:

- `ready`: folder publication succeeded, quality rating is `strong`, semantic success rate >= 0.70, integrity validation passed, and stable rules have enough evidence.
- `pilot_only`: publication succeeded or semantic basis is useful, but evidence is small, quality is `good`, open-question density is high, or low-evidence stable rules exist.
- `not_ready`: failed pair analysis, fallback synthesis, integrity validation failure, poor/weak quality, or semantic success rate below 0.70.

Rule-level readiness:

- `high`: stable rule, evidence count >= 5 or >= 20 percent of folder pairs, no critical caveat.
- `medium`: stable or transformation rule, evidence count >= 2, caveats are manageable.
- `low`: tentative pattern, suspected enrichment, small folder, or unresolved ambiguity.
- `blocked`: folder has failed integrity validation or failed semantic synthesis. Render only in a review appendix.

Special cases:

- A large folder with zero stable rules, like `credit-derivatives`, should not be considered empty. Generate a cautious "mapping guide" from transformations, folder principles, and tentative patterns, but do not claim stable semantic rules.
- A partial folder, like `interest-rate-derivatives`, can generate pilot material, but every page must show that coverage is incomplete.
- A fallback folder, like `dividend-swaps` or `equity-options`, should not produce agent-operational semantic rules.

## Proposed Generator Pipeline

1. Discover folders in `data/drafts`.
2. For each folder, load:
   - `draft.json` or `draft.partial.json`
   - `debug.json`
   - `run-log.json`
3. Normalize each folder into a `CookbookFamilyInput`.
4. Compute readiness from debug publication, quality, coverage, and semantic success.
5. Extract candidate rules from:
   - `stableMappingPatterns`
   - `repeatedNonLiteralTransformations`
   - `tentativeRepeatedPatterns`
   - `folderLevelPrinciples`
   - `variantsAndExceptions`
   - `suspectedEnrichmentOrDefaultBehavior`
   - `agentPlaybook`
6. Classify each candidate as stable, transformation, variant, enrichment, caution, or review question.
7. Deduplicate cross-folder patterns into global rules.
8. Render:
   - global cookbook sections
   - product-family cookbook sections
   - evidence sidecars
   - manifest with readiness and source paths
9. Validate:
   - all example files referenced by generated docs exist in the source draft evidence
   - no blocked folder emits ready rules
   - every rule has a validation check
   - every low-confidence rule has a human-review trigger
   - every generated document has "Do Not Assume" entries

## Recommended First Implementation Scope

Build the generator in TypeScript under `src/cookbook/`:

```text
src/cookbook/
  index.ts
  types.ts
  load-drafts.ts
  readiness.ts
  extract-rules.ts
  globalize-rules.ts
  render-markdown.ts
  render-json.ts
  validate.ts
scripts/run-cookbook-phase.ts
```

Start with deterministic extraction and rendering. Do not use an LLM in the first version of Phase 2. The Phase 1 drafts already used an LLM; Phase 2 should first prove that a deterministic compiler can turn those drafts into stable, auditable documentation.

Add an optional LLM polishing pass later only if:

- the deterministic document passes schema validation first
- the model is not allowed to add new evidence
- output is diffed against the structured JSON
- any new claim without source evidence is rejected

## Suggested First Generated Documents

Generate these first:

1. `global/identifier-handling.md`
2. `global/temporal-normalization.md`
3. `global/party-reference-resolution.md`
4. `global/quantity-and-unit-normalization.md`
5. `product-families/fx-derivatives.md`
6. `product-families/commodity-derivatives.md`
7. `product-families/inflation-swaps.md`

Hold back or mark as review-only:

- `dividend-swaps`
- `equity-options`
- `bond-options`
- `equity-swaps`
- `interest-rate-derivatives`

## Questions For You

These are the decisions I would ask before coding beyond the deterministic generator:

1. Should Phase 2 output be optimized for Codex/Claude-style `SKILL.md` files, or for a provider-neutral cookbook first?
2. Should global rules be allowed to combine evidence across product families, or should they remain product-scoped until an analyst approves them?
3. What readiness label should agents see by default: `ready/pilot_only/not_ready`, or a numeric confidence score?
4. Should not-ready folders be omitted entirely from the agent corpus, or included as review-only references?
5. Do you want the generator to overwrite cookbook outputs automatically, or write timestamped versions for auditability?

## Bottom Line

Phase 2 should be a documentation compiler, not another free-form summarizer. It should convert Phase 1 drafts into compact, evidence-gated, agent-executable mapping routines. The generator should preserve uncertainty, promote repeated cross-folder rules into global docs only when evidence supports it, and keep weak folders out of the operational agent path until they are regenerated or reviewed.

