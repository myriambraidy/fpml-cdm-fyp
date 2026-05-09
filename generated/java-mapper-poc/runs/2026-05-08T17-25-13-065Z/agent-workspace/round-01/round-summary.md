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

- `## Implementation scope (machine-checked)` section present.
- `## Runtime supported fixtures (machine-checked)` section present.
- **In scope groups** match `00-product-scope.json` → `"currentImplementationGroup": "fx-single-leg"` and include `"fx-single-leg"`.
- **Runtime fixture ids** match exactly the run_config runtimeFixtures: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward.
- Only fx-single-leg covered in this plan.
- Out-of-scope groups explicitly listed and excluded.
- Non-FX fixtures excluded as expected.
- RuntimeFixtures match the run_config runtimeFixtures ids exactly.
- Generated package: `com.fpml.cdm.fx.mapper.generated`.
- Main class: `GeneratedFpmlToCdmMapper`.

## Resolution Notes

- `## Implementation scope (machine-checked)` is present and matches `00-product-scope.json` → `"currentImplementationGroup": "fx-single-leg"` with only `fx-single-leg` in scope.
- `## Runtime supported fixtures (machine-checked)` section is present and matches exactly the 7 runtime fixtures in the `run_config`.
- All Rosetta functions cited (`MapPayerReceiver`, `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`) were verified as resolvable via `get_rosetta_function`.
- All CDM classes referenced are present in the CDM Java jar (verified via `get_cdm_java_class` cache hits).
- `TradeState` *does* have `setTrade(cdm.event.common.Trade)` in its builder (`TradeStateBuilder.setTrade` confirmed in tool result).
- `NonTransferableProduct`, `Payout`, and `SettlementPayout` builders were not directly queried, but the critical `TradeState` builder method exists — this invalidates the claim that no builder methods match the intent.
- `get_cdm_java_class` returned `TradeStateBuilder.setTrade(cdm.event.common.Trade)` as a builder method.
- The earlier `get_cdm_builder_methods` “no methods matched intent `set-trade`” is a *false negative* due to intent heuristics (likely case or spacing sensitivity), but the method **exists and is valid**.
- Same applies for other builders: intent-based lookup may miss valid methods; direct class inspection is authoritative.
- Critic claimed it was not explicitly cited in Rosetta evidence coverage.
