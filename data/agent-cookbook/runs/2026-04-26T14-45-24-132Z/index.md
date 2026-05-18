# FPML -> CDM Agent Cookbook

This provider-neutral cookbook gives an LLM the operational rules needed to propose a CDM representation from FPML while preserving evidence, confidence, and analyst review triggers.

## How To Use This Cookbook

1. Identify the FPML product family from root, trade, and product elements.
2. Open the matching product-family document when its status is ready or pilot_only.
3. Apply global rules for identifiers, dates, parties, quantities, wrappers, and enrichment policy.
4. Apply product-family rules only when source trigger signals match.
5. Build a proposed CDM representation with explicit target paths and transformation notes.
6. Attach confidence and evidence rule ids to each material mapping.
7. Run the validation checklist before presenting the proposal.
8. Mark unresolved party direction, generated identifiers, exchange-code normalization, unsupported enrichment, and partial-folder evidence for analyst review.
9. Do not invent CDM fields, party roles, identifiers, or economic terms when evidence is missing.

## Operational Statuses

- `ready`: agents may apply these rules during normal proposal generation.
- `pilot_only`: agents may apply these rules but must mark material proposals for analyst confirmation.
- `review_only`: agents must not apply these rules automatically; use only as background evidence.
- `blocked`: agents must not use this folder as semantic mapping knowledge.

## Global Documents

- `identifier-handling.md`: Use these rules when preserving, normalizing, or reviewing trade and party identifiers.
- `temporal-normalization.md`: Use these rules when moving FPML dates, dateTimes, and adjustable-date structures into CDM.
- `party-reference-resolution.md`: Use these rules when resolving party hrefs, counterparties, payer/receiver roles, and party direction.
- `quantity-and-unit-normalization.md`: Use these rules when mapping amounts, notionals, prices, currencies, and units.
- `cdm-wrapper-construction.md`: Use these rules when CDM requires wrapper structures around source values.
- `enrichment-and-defaults.md`: Use these rules to decide when generated or default CDM values require analyst review.

## Product Family Routing

- `bond-options`: `review_only` - Agents must not apply these rules automatically; use only as background evidence for analyst review.
- `commodity-derivatives`: `ready` - Agents may apply these rules during normal FPML to CDM proposal generation.
- `correlation-swaps`: `pilot_only` - Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.
- `credit-derivatives`: `pilot_only` - Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.
- `dividend-swaps`: `blocked` - Agents must not use this folder as semantic mapping knowledge.
- `equity-options`: `review_only` - Agents must not apply these rules automatically; use only as background evidence for analyst review.
- `equity-swaps`: `review_only` - Agents must not apply these rules automatically; use only as background evidence for analyst review.
- `fx-derivatives`: `ready` - Agents may apply these rules during normal FPML to CDM proposal generation.
- `inflation-swaps`: `pilot_only` - Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.
- `interest-rate-derivatives`: `review_only` - Agents must not apply these rules automatically; use only as background evidence for analyst review.
- `total-return-swaps`: `pilot_only` - Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.

## Proposed CDM Representation Format

When using this cookbook, return a proposal with this provider-neutral shape:

```ts
interface CdmMappingProposal {
  productFamily: string
  operationalStatusUsed: string
  proposedRepresentation: JsonValue
  fieldMappings: Array<{
    sourcePath: string
    targetPath: string
    transformation: string
    confidence: string
    evidenceRuleIds: string[]
    needsReview: boolean
    reviewReason?: string
  }>
  assumptions: string[]
  unresolvedQuestions: string[]
  validationResults: Array<{
    check: string
    status: 'passed' | 'failed' | 'needs_review'
    details: string
  }>
}
```

## Universal Do Not Assume

- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not invent identifiers, global keys, external keys, LEIs, exchange codes, or taxonomy values.
- Do not treat suspected enrichment as source-backed mapping.
- Do not apply a product-family rule when the source trigger signal is absent.
- Do not hide unresolved questions; put them in the proposal.

Generated at: `2026-04-26T14:45:24.132Z`
