# Round 2 Summary

Decision: NEXT_ROUND_REQUIRED

## Planner Focus

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Critic Findings

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx
- Product scope confirms `fx-single-leg` as the default `currentImplementationGroup`
- Product scope confirms `fx-swap`, `fx-simple-option`, etc. as candidate/deferred groups

## Resolution Notes

- **Evidence**: Cookbook evidence JSON only documents 5 stable rules (`RULE-001` to `RULE-005`) and no explicit NDF rules for `settlementCurrency`, `cashSettlementTerms`, `valuationDate`, or `fixing`.
- **CDM Evidence**: The expected CDM output for fx-ex07 includes NDF-specific fields not covered by the documented rules.
- **Risk**: Including fx-ex07 without mapped rules would lead to incomplete/incorrect mappings and test failures.
- **Evidence**: The `fx-derivatives.md` cookbook uses IDs like `fx-derivatives:TR-001`, but the authoritative `fx-derivatives.evidence.json` file does **not** list any transformation IDs — only rules (`RULE-001` to `RULE-005`) and transformations are described in natural language, not ID-indexed.
- **Risk**: Using non-existent IDs undermines traceability and could mislead implementers.
- **Evidence**: The rule mapping table lists `NDF rules (TR-001, TR-002)` for fx-ex07, but no such rules are documented in evidence JSON or supported in the cookbook evidence.
- **Assessment**: Acceptable for planning phase. Should be finalized (e.g., `com.oracle.labs.fpml.fx`) in implementation.
- **Assessment**: Important for implementation traceability, but can be addressed in the next planning round without blocking.
1. **Remove fx-ex07 from supported fixtures**
- Update the "Supported FX products for this run" section to list only **6 fixtures** (fx-ex01 through fx-ex06).
