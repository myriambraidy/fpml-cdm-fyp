# Round 1 Summary

Decision: NEXT_ROUND_REQUIRED

## Planner Focus

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- fx-ex01-fx-spot

## Critic Findings

- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml
- `cdm.product.common.settlement.SettlementPayout`
- `cdm.observable.asset.ResolvablePriceQuantity`

## Resolution Notes

1. `cdm.observable.asset.ResolvablePriceQuantity` — not in CDM Java API
2. `cdm.product.common.settlement.SettlementPayout` — wrong package; actual is `cdm.product.template.SettlementPayout`
1. **Replace `cdm.observable.asset.ResolvablePriceQuantity` with `cdm.observable.asset.PriceQuantity`**
- In all occurrences (e.g., “Core CDM Objects” and “Mapping responsibilities” sections)
2. **Replace `cdm.product.common.settlement.SettlementPayout` with `cdm.product.template.SettlementPayout`**
- Ensure consistent use in “Core CDM Objects” and “Mapping responsibilities”
3. **Add Rosetta helper function citations**
- Include `MapPayerReceiver`, `MapPayerReceiverModelToCounterpartyList`, `MapPayerReceiverToAccountPartyReference`
4. **List runtime fixture filenames (optional)**
- e.g., `fx-ex01-fx-spot.xml`, `fx-ex02-spot-cross-w-side-rates.xml`, etc.
