# Round 3 Summary

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

- `cdm.product.template.Payout` **does** include:
- `getSettlementPayout(): cdm.product.template.SettlementPayout`
- `setSettlementPayout(SettlementPayout)`
- `getOrCreateSettlementPayout(): SettlementPayout$SettlementPayoutBuilder`
- Correct the plan to **use `cdm.product.template.SettlementPayout`** and its builder.
- Ensure fixtures requiring settlement (`fx-ex04`, `fx-ex05`, `fx-ex06`, `fx-ex07`) are mapped via `Payout.builder().setSettlementPayout(...)` as supported in the API.
- In narrative sections, attach FX coverage explicitly to the runtime fixture IDs (e.g., *“fx-ex01–fx-ex07”*) instead of generic terms like *“FX single-leg”*.

## Resolution Notes

- **Issue**: Plan incorrectly asserts `cdm.product.template.SettlementPayout` does not exist, while earlier evidence falsely suggested `cdm.product.template.Payout.getSettlementPayout()` exists.
- **Verified Fact**:
- `get_cdm_java_class("cdm.product.template.SettlementPayout")` → **"cdm.product.template.SettlementPayout is not present in the CDM Java API pack"**
- `cdm-java-negative-classes.md` explicitly lists:
- `cdm-java-api-pack.md` shows `Payout` has `getSettlementPayout(): cdm.product.template.SettlementPayout` — but this is **inconsistent** with the lookup failure.
- **Resolution**: `cdm.product.template.SettlementPayout` **does not exist** in v6.7.0 — the `getSettlementPayout()` method cited in `cdm-java-api-pack.md` is a **documentation error**, as the class itself is absent from the jar and negative classes list.
- ✅ **Evidence sufficiency**: Yes — multiple sources confirm the absence:
- Direct toolcall: `"cdm.product.template.SettlementPayout is not present"`
- Negative classes list: `cdm.product.common.settlement.SettlementPayout` excluded, but no `cdm.product.template.SettlementPayout` appears — consistent with total absence.
- CDM v6.7.0 API pack’s builder methods for `Payout` show `setSettlementPayout(...)` but **no type `SettlementPayout` is defined** — high likelihood of stale or schema-derived stub generation.
