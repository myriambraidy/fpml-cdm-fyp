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

- `cdm.base.staticdata.party.PartyReference`: not present in `cdm-java-6.7.0.jar`.
- `cdm.base.math.PriceSchedule`: not present in `cdm-java-6.7.0.jar`.
- `cdm.base.math.PriceTypeEnum`: not present; only `cdm.observable.asset.PriceTypeEnum` exists.
1. Explicitly cite Rosetta functions (e.g., `MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`) as the *source* for Java mapping logic.
2. Block use of raw JSON construction in internal CDM representation.
3. Acknowledge missing CDM classes (`PartyReference`, `PriceSchedule`, `PriceTypeEnum`) and either:
- State how the mapping will be adjusted to avoid them (e.g., use alternative types or skip unsupported fields), or
- Deferring those parts to a future phase with evidence.
4. Add a runtime fixture gate: “Only `fx-ex01` through `fx-ex07` are in scope; anything beyond must fail validation.”
5. Remove or re-word the “FX single-leg” narrative to align strictly with the fixture IDs in the machine-checked section.

## Resolution Notes

1. **Root type correction**:
- Use `cdm.product.template.SettlementPayout` as the top-level payout container (no change).
- Use `cdm.product.common.settlement.ResolvablePriceQuantity` for price/quantity fields inside `SettlementPayout`.
2. **Settlement types**:
- Replace `cdm.product.template.SettlementTypeEnum`, `SettlementTerms`, `CashSettlementTerms` with their `cdm.product.common.settlement.*` equivalents.
3. **Missing fields**:
- `PartyReference`, `cdm.base.math.PriceSchedule`, `cdm.base.math.PriceTypeEnum` are **not used**.
- Where Rosetta references these, map to `Party`, `String`, or omit.
4. **Construction policy**:
- All mapping logic must construct objects exclusively via CDM Java builders (`Foo$FooBuilder`), *not* via JSON serialization/deserialization.
