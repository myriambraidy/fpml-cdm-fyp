# Round 1 Summary

Decision: UNKNOWN

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

- **In-scope group mismatch**: The plan’s “In scope (implementation groups):” bullet includes only `fx-single-leg`, which matches `00-product-scope.json.currentImplementationGroup`. ✅
- However, **the runtime-supported list is not derived from `productGroups[].fixtureCount`**. It lists six FX products, but the `fx-single-leg` group only includes seven fixtures of *single-leg* FX products (fxSingleLeg). The plan conflates “FX single-leg” with six specific runtime products. This overstates what is in scope for `fx-single-leg` and is unsupported by the product-scope JSON.
- `fx-ex01-fx-spot.xml` → `FX Spot`
- `fx-ex02-spot-cross-w-side-rates.xml` → `FX Spot`
- `fx-ex03-fx-fwd.xml` → `FX Forward`
- `fx-ex04-fx-fwd-w-settlement.xml` → `FX Forward with Settlement`
- `fx-ex05-fx-fwd-w-ssi.xml` → `FX Forward with SSI`
- `fx-ex06-fx-fwd-w-splits.xml` → `FX Forward with Splits`
- `fx-ex07-non-deliverable-forward.xml` → `Non-Deliverable Forward`
- **“Tests” section is unsupported by evidence**: The plan promises “Gatling performance tests for throughput verification” and “Integration tests for dependent component compatibility,” but no performance or integration test requirements exist in `00-input-brief` or `00-product-scope`. The brief explicitly asks for a **Java Maven mapper project** with **runtime gates** that **must not call an LLM**. Performance benchmarks and integration test libraries are outside the current scope.

## Resolution Notes

1. **Update “Runtime Supported FX Products” → “Runtime Supported Fixtures”**
- `fx-ex01-fx-spot.xml`
- `fx-ex02-spot-cross-w-side-rates.xml`
- `fx-ex03-fx-fwd.xml`
- `fx-ex04-fx-fwd-w-settlement.xml`
- `fx-ex05-fx-fwd-w-ssi.xml`
- `fx-ex06-fx-fwd-w-splits.xml`
- `fx-ex07-non-deliverable-forward.xml`
2. **Remove unsupported test components**
- Unit tests for each of the 7 fixtures
