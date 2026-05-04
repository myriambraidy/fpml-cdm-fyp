# Round 3 Summary

Decision: ACCEPTED

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

- **Runtime LLM dependency concern** (critical): The plan states:
- `cdm-rosetta-preflight.md` mandates:
- `00-product-scope.json` and `rosetta-generation-context.md` enforce **pure functional mapping**, not decision-making LLMs.
- **Missing runtime fixture IDs in “Runtime supported fixtures (machine-checked)”** (non-blocking): The section lists fixture names (`fx-ex01-fx-spot`, …), but the `run_config`’s `runtimeFixtures` map uses keys like `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`. The plan’s listing style is acceptable *if* it maps 1:1 to the JSON map keys, but the validator’s “none” entry for “Runtime Fixtures” in `evidence-index.md` suggests ambiguity. Since the machine-checked section *does* list the same 7 IDs, this is **not blocking**.
- **Overreach in “Supported FX products for this run”**: The text states:
- **Missing explicit exclusion of non-FX fixtures in test scope**: The plan explicitly excludes `termDeposit` in *“Unsupported behavior”*, but the test list does not mention validation failure for non-FX input. This is **acceptable**, since exclusion is clear and tests focus on in-scope fixtures.
- **Evidence for helper functions not fully cited**: The plan lists 11 shared helpers but does not explicitly link all of them to their source Rosetta function IDs (e.g., `MapCounterpartyRoleEnum`, `CreateQuantityKey`, etc.). However, these are all present in `rosetta-generation-context.md`’s “Unresolved Helper Functions” section and are covered indirectly via the primary functions. This is **acceptable** under strict scope.

## Resolution Notes

- Makes the constraint *machine-checkable* (e.g., via static analysis for LLM SDK usage, HTTP calls, or reflective model loading at runtime).
- Aligns with `cdm-rosetta-preflight.md`’s “Use the CDM model object as the internal representation and serialize it at the runtime boundary” — implying *no dynamic model inference*.
- Eliminates the ambiguity flagged by the critic: a plan that merely *does not include* LLMs is not the same as *forbidding* them.
- [ ] **Add explicit LLM prohibition clause** in “Validation gates” (as above).
- [ ] ✅ Maintain current product-group boundaries (`fx-single-leg` only).
- [ ] ✅ Keep 7 runtime fixtures supported (spot, forward, NDF variants).
- [ ] ✅ Retain direct Rosetta → Java method mapping with source-line attribution.
- [ ] ✅ Preserve `org.finos.cdm.fx.singleleg` package structure (`FxSingleLegMapper`, `FxSingleLegMapperContext`).
- [ ] ✅ Keep all 11 shared helpers mapped as utilities (via `rosetta-generation-context.md`).
- [ ] ✅ Include tests for all 7 runtime fixtures + per-function validation.
