# Round 3 Summary

Decision: UNKNOWN

## Planner Focus

- **Product Family**: fx-derivatives
- **Implementation Strategy**: staged-by-product-group
- **Current Implementation Group**: fx-single-leg (Default starting group)
- **Candidate Next Groups**: fx-swap, fx-simple-option
- **Run ID**: 2026-05-02T15-38-52-039Z
1. **fx-single-leg**: 7 fixtures (good-first-target, default starting group)
2. **fx-swap**: 1 fixture (candidate)
3. **fx-simple-option**: 3 fixtures (candidate)

## Critic Findings

- **Plan selects unknown product groups**: The plan mentions `fx-derivatives`, `fx-spot`, `fx-fwd`, `fx-fwd-w-settlement`, `fx-fwd-w-ssi`, and `fx-fwd-w-splits` as "implementation groups". These are not valid product groups per the product scope. The only valid implementation groups are: `fx-single-leg`, `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, and `non-fx`.
- **Misalignment with staged implementation strategy**: The run config and product scope specify `currentImplementationGroup = fx-single-leg`, yet the plan appears to discuss individual fixtures (e.g., `fx-ex01-fx-spot`) as if they were implementation groups rather than members of `fx-single-leg`. This suggests confusion between *product groups* and *individual fixtures*.
- **No mention of implementation group boundaries**: The plan should explicitly state that Phase 1 is limited to the `fx-single-leg` group and that `fx-swap` is reserved for Phase 2. While the text does mention this, the inconsistent usage of product group names undermines the clarity.
- **Missing evidence mapping**: While the plan references the cookbook, there is no explicit mapping of the stable rules from the evidence JSON (`fx-derivatives.evidence.json`) to the features described in the plan.
- **Java mapper runtime requirements violated**: The plan does not explicitly guarantee that:
- The generated Java runtime does **not** call an LLM at runtime.
- The generated Java runtime does **not** read the agent workspace (e.g., `agent-workspace`, evidence folders, cookbook).
- All runtime logic is hard-coded or derived solely from CDM and FpML models without dynamic introspection or LLM inference.
- **Over-reliance on fixed patterns**: The plan should explicitly state which of the stable rules (per `fx-derivatives.evidence.json`) are being relied upon, to support auditability and traceability. For example, `RULE-001` (trade ID mapping), `RULE-002` (date normalization), `RULE-003` (product type taxonomy), `RULE-004` (exercise terms), `RULE-005` (amounts as quantities) should be explicitly called out.
- **Lack of concrete test strategy**: The plan mentions validation gates and edge cases, but does not specify how tests will be derived from fixture pairs (FPML → CDM) — whether tests will be generated, manually written, or auto-validated from expected CDM outputs.

## Resolution Notes

- `fx-single-leg`
- `fx-swap`
- `fx-simple-option`
- `fx-digital-option`
- `fx-barrier-option`
- `fx-average-rate-option`
- `fx-strategy`
- `non-fx`
- Which rules enable trade ID preservation?
- Which support date normalization?
