# Critic Review Decision

## Validation Summary

All deterministic validation checks passed.

| Check | Status |
|-------|--------|
| `plan-validation.md` status | **passed** |
| Implementation scope matches `00-product-scope.json` | ✅ |
| Runtime fixtures match `run_config.runtimeFixtures` | ✅ |
| Java shell contract adherence | ✅ |
| Approved CDM API contract usage | ✅ |
| Semantic recipe alignment | ✅ |
| No blocking missing classes | ✅ |

## Critique Item Evaluation

| Critique Item | Valid? | Reason |
|---------------|--------|--------|
| Builder method signature verification needed | ✅ Valid (low severity) | The plan uses intent labels (e.g., `set-party`, `set-identifier`) but should rely on `get_cdm_builder_methods` for exact matches. However, the **approved-cdm-api-contract-summary.md** confirms all listed methods are approved, and the plan avoids ambiguous methods. |
| Party identity vs `ReferenceWithMetaParty` usage | ✅ Valid (low severity) | The plan correctly uses `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty`, which is both approved and safe per missing-class evidence. |
| `cdm.observable.asset.PriceSchedule` vs `cdm.base.math.PriceSchedule` | ✅ Valid (low severity) | Plan correctly uses `cdm.observable.asset.PriceSchedule`. |
| `cdm.product.template.SettlementPayout` vs `cdm.product.common.settlement.SettlementPayout` | ✅ Valid (low severity) | Plan correctly uses `cdm.product.template.SettlementPayout`. |
| `cdm.product.common.settlement.ResolvablePriceQuantity` vs `cdm.observable.asset.ResolvablePriceQuantity` | ✅ Valid (low severity) | Plan correctly uses `cdm.product.common.settlement.ResolvablePriceQuantity`. |

**No invalid critique items.** All concerns are low-severity clarifications already addressed safely by the plan.

## Authority Cross-Check

| Source | Evidence | Plan Alignment |
|--------|----------|----------------|
| `cdm-java-api-summary.md` | `cdm.base.math.PriceSchedule` missing → use `cdm.observable.asset.PriceSchedule` | ✅ Plan uses correct path |
| `cdm-java-api-summary.md` | `cdm.product.common.settlement.SettlementPayout` missing → use `cdm.product.template.SettlementPayout` | ✅ Plan uses correct path |
| `cdm-java-api-summary.md` | `cdm.observable.asset.ResolvablePriceQuantity` missing → use `cdm.product.common.settlement.ResolvablePriceQuantity` | ✅ Plan uses correct path |
| `approved-cdm-api-contract-summary.md` | Lists all 38 approved classes including `cdm.observable.asset.PriceSchedule`, `cdm.product.template.SettlementPayout`, `cdm.product.common.settlement.ResolvablePriceQuantity`, `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty` | ✅ Plan uses only approved classes |
| `semantic-recipes.md` | Step order: Party → TradeIdentifier → Product/EconomicTerms → Payout/SettlementPayout → Trade/TradeState | ✅ Plan maps responsibilities in same order |

## Implementation Checklist (Approved)

- [x] Implementation scope is `fx-single-leg` only, matching `00-product-scope.json`.
- [x] All 7 runtime fixtures (`fx-ex01-fx-spot` through `fx-ex07-non-deliverable-forward`) are supported.
- [x] Generated class: `GeneratedFpmlToCdmMapper` in `com.fpml.cdm.fx.mapper.generated`.
- [x] Implements `FpmlToCdmMapper` interface.
- [x] Shell-owned files (`pom.xml`, `Main.java`, `RuntimeArgs.java`, `FpmlToCdmMapper.java`) are not rewritten.
- [x] Uses only approved CDM classes (38 classes, all verified).
- [x] Uses only approved builder methods (114 methods, all verified).
- [x] Follows `semantic-recipes.md` construction order (Party → TradeIdentifier → Product/EconomicTerms → Payout/SettlementPayout → Trade/TradeState).
- [x] All Rosetta functions correctly assigned:
  - `MapFxSingleLegNonTransferableProduct`, `MapProductIdentifierList`, `MapProductTaxonomyList`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
  - `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`
  - `MapFxSingleLegAccountPartyReference`, `MapPayerReceiverToAccountPartyReference`
  - `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`
- [x] No forbidden classes used (no `cdm.base.math.*`, no `cdm.base.staticdata.asset.*`, no `cdm.base.staticdata.party.PartyReference`, no `cdm.observable.asset.ResolvablePriceQuantity`, etc.).
- [x] No FpML model classes invented (no `FpmlFxSingleLeg`, etc.).
- [x] Jackson used only for final serialization and reports, not for internal CDM construction.

## Decision

**Decision: ACCEPTED**

No blocking issues. All critiques are valid but non-blocking clarifications that are already addressed by the plan.

### Required Implementation Conditions

1. **Before calling a builder method**, use `get_cdm_builder_methods` to verify exact parameter types and method overloads — do not rely solely on intent labels.
2. Ensure `setPartyReferenceValue(...)` is never used — party identity must be represented via `ReferenceWithMetaParty` or equivalent approved constructs.
3. Always prefer `cdm.observable.asset.PriceSchedule`, `cdm.product.template.SettlementPayout`, `cdm.product.common.settlement.ResolvablePriceQuantity`, and `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty`.
4. Preserve source FpML identifiers in traceability reports.

No further planning rounds required.