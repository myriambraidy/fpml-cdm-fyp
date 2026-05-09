# Round 3 Summary

Decision: UNKNOWN

## Planner Focus

- fx-single-leg
- non-fx
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits

## Critic Findings

- `fx-single-leg` — matches `currentImplementationGroup` and `productGroups[].group` for fx-single-leg.
- `non-fx` — matches `productGroups[].group == "non-fx"` and `allowNonFxExpansion == false`.
- `fx-ex01-fx-spot`
- `fx-ex02-spot-cross-w-side-rates`
- `fx-ex03-fx-fwd`
- `fx-ex04-fx-fwd-w-settlement`
- `fx-ex05-fx-fwd-w-ssi`
- `fx-ex06-fx-fwd-w-splits`
- `fx-ex07-non-deliverable-forward`
1. **`PriceSchedule` not available**

## Resolution Notes

- **Exists:** yes
- **Builder:** `cdm.product.template.SettlementPayout$SettlementPayoutBuilder`
- **Field in `Payout`:** `cdm.product.template.SettlementPayout getSettlementPayout()`
- **Builder method:** `setSettlementPayout(cdm.product.template.SettlementPayout)`
- `cdm.product.template.SettlementPayout` ✅ exists
- `cdm.product.common.settlement.SettlementPayout` ❌ does *not* exist (and is *not* used in the plan)
- Rosetta outputs `Payout`, not `SettlementPayout` → `SettlementTerms`.
- In Java, `Payout.setSettlementPayout(...)` expects a **pre-constructed** `SettlementPayout`.
- `SettlementPayout` (cdm.product.template) *is* available — but it has **no publicly documented Java API for construction**, and Rosetta is responsible for populating it.
- `setPrice(...FieldWithMetaPriceSchedule...)`
