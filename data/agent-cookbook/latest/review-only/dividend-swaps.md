# FPML -> CDM Cookbook: dividend-swaps

## Status

- Operational status: `blocked`
- Agent use policy: Agents must not use this folder as semantic mapping knowledge.
- Semantic success rate: 0%
- Draft quality: `poor`
- Draft publication: `failed_pair_analysis`
- Readiness reasons: `not_final_publication`, `fallback_synthesis`, `low_semantic_success`, `weak_quality`, `high_open_question_density`

## Trigger Signals

- dividend-swaps
- FpML top-level section: header
- FpML top-level section: party
- FpML top-level section: trade
- trade > dividendSwapTransactionSupplement (50 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)
- trade > collateral (15 paths)

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: header, party, trade.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Use pair-level examples as tentative guidance; no repeated folder-wide rules were recovered yet.
4. Watch for non-literal reshaping and confirm it from pair-level examples before generalizing.
5. Assemble the result under repeated CDM scaffolding such as meta, trade.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

No stable operational rules were recovered for this family.

## Transformations

No repeated transformations were recovered for this family.

## Variants And Branches

No product variants or branches were recovered for this family.

## Enrichment And Defaults

No enrichment or default behavior was recovered for this family.

## Cautions And Tentative Signals

No additional cautionary signals were recovered for this family.

## Do Not Assume

- Do not assume every repeated wrapper or metadata field implies a semantic mapping rule.
- Do not treat as stable: Semantic mapping rules still need stronger evidence before they are treated as folder-wide defaults.

## Human Review Triggers

- No semantic synthesis was recovered for this folder; mapping rules remain tentative.

## Validation Checklist

- Check unresolved question: No semantic synthesis was recovered for this folder; mapping rules remain tentative.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Do not use this document to automatically map fields; use it only to explain uncertainty.

## Worked Examples

No worked examples recovered.

## Source Evidence

- Evidence sidecar: `../references/dividend-swaps.evidence.json`
