# Round 1 Summary

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

- FX spot, forward, NDF (within scope)
- but tests section does not clarify which test data (expected CDM) corresponds to which product. This is unsupported by evidence-packet.md fixture lists which assign each fixture to exactly one product group and product type. The test description risks conflating responsibilities across product groups.
- `currentImplementationGroup` = `fx-single-leg` ✅
- `productGroups` includes `group: "fx-single-leg"` with 7 fixtures ✅
- `candidateNextGroups` = `["fx-swap", "fx-simple-option"]` — correctly listed as out of scope ✅
- `nonFxFixtures` correctly excluded ✅
- `fx-single-leg` fixtures match 00-product-scope.json ✅
- No evidence supports fx-swap, fx-option, or other out-of-scope product types ✅

## Resolution Notes

- [ ] **Scope declaration**: Add the required `## Implementation scope (machine-checked)` section with:
- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx
- [ ] **Model classes**: Remove `FxSwap.java` (and `FxOption.java`, if present) from the model package diagram or comment them clearly as “(stub/placeholder)” if kept for future rounds.
