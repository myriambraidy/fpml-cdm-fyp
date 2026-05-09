## Review of Planner Plan (2026-05-08T17-25-13-065Z)

### ✅ Deterministic validation
- `## Implementation scope (machine-checked)` section present.
- `## Runtime supported fixtures (machine-checked)` section present.
- **In scope groups** match `00-product-scope.json` → `"currentImplementationGroup": "fx-single-leg"` and include `"fx-single-leg"`.
- **Runtime fixture ids** match exactly the run_config runtimeFixtures: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward.

### ✅ Product scope
- Only fx-single-leg covered in this plan.
- Out-of-scope groups explicitly listed and excluded.
- Non-FX fixtures excluded as expected.

### ✅ Runtime fixtures
- RuntimeFixtures match the run_config runtimeFixtures ids exactly.

### ✅ Java shell contract
- Generated package: `com.fpml.cdm.fx.mapper.generated`.
- Main class: `GeneratedFpmlToCdmMapper`.
- Required interface: `com.fpml.cdm.fx.mapper.FpmlToCdmMapper`.
- Generated source root: `src/main/java/com/fpml/cdm/fx/mapper/generated/`.
- Shell-owned files list matches java-shell-contract.md.

### ✅ Rosetta evidence coverage
- All required Rosetta functions are covered with exact names:
  - product-root: MapFxSingleLegNonTransferableProduct, MapProductIdentifierList, MapProductTaxonomyList
  - economic-terms: MapFxSingleLegEconomicTerms
  - settlement-payout: MapFxCoreDetailsModelToSettlementPayout
  - price-quantity: MapFxSingleLegPriceQuantityList, MapFxCoreDetailsModelPriceListWithLocation, MapFxCoreDetailsModelQuantityListWithLocation
  - party-counterparty: MapFxSingleLegCounterpartyList, MapFxSingleLegAncillaryPartyList
  - account-party-reference: MapFxSingleLegAccountPartyReference, MapPayerReceiverToAccountPartyReference
  - product-identifiers-taxonomy: MapProductIdentifierList, MapProductIdentifier, MapProductTaxonomyList
  - dates-settlement: MapFxCoreDetailsModelToSettlementPayout, MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

### ✅ Approved API contract usage
- All CDM classes cited (e.g., Trade, TradeState, NonTransferableProduct, EconomicTerms, Payout, SettlementPayout, ResolvablePriceQuantity, etc.) are in the approved CDM API contract.
- Builder methods referenced in the plan (e.g., setTrade, setProduct, setEconomicTerms, setSettlementPayout, setPriceQuantity, etc.) appear in the approved builder method index.

### ✅ Semantic recipe coverage
- The semantic recipes cited in the plan (product-root, economic-terms, settlement-payout, price-quantity, party-counterparty, etc.) are approved by semantic-recipes.md.

### ✅ Generated file ownership
- Plan correctly identifies `GeneratedFpmlToCdmMapper` as the generated implementation class.
- Plan correctly identifies `com.fpml.cdm.fx.mapper.generated` as the generated package.
- Plan correctly identifies shell-owned files that must not be rewritten.

### ✅ Tests and gates
- Plan includes unit tests and integration tests for each mapping area.
- Plan includes runtime validation with the specified runtime fixtures.

### ✅ Unsupported behavior
- Plan explicitly excludes fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, and non-fx.
- Plan correctly states cases where FpML data does not conform to standard structures are unsupported.

### ✅ Traceability
- Plan correctly references Rosetta function names for all mapping areas.
- Plan correctly cites Rosetta functions and their block IDs.

---

## Blocking Issues

### ❌ CDM builder method evidence: Plan incorrectly assumes direct builder methods for TradeState and Nested Types

The plan states:
- `TradeState.builder().setTrade(trade).build()`
- `setProduct`, `setEconomicTerms`, `setSettlementPayout`, `setPriceQuantity`, `setProduct`, `setEconomicTerms` for various nested types.

However:
- `get_cdm_builder_methods` for `cdm.event.common.TradeState` and intent "set-trade" returned **no approved builder methods matched intent "set-trade"**.
- `get_cdm_builder_methods` for `cdm.event.common.Trade` and intent "set-product" returned **no approved builder methods matched intent "set-product"**.
- `get_cdm_builder_methods` for `cdm.product.template.NonTransferableProduct` and intent "set-economic-terms" returned **no approved builder methods matched intent "set-economic-terms"**.
- `get_cdm_builder_methods` for `cdm.product.template.Payout` and intent "set-settlement-payout" returned **no approved builder methods matched intent "set-settlement-payout"**.
- `get_cdm_builder_methods` for `cdm.product.template.SettlementPayout` and intent "set-price-quantity" returned **no approved builder methods matched intent "set-price-quantity"**.

Yet `get_cdm_java_class` confirms these builder classes exist, and the **CDM builder method names are case-sensitive and often more specific**. For example:
- `cdm.event.common.TradeState$TradeStateBuilder` has `setTrade(cdm.event.common.Trade)`, so the intent "set-trade" is correct but the builder method index did not match. This suggests a discrepancy in the approved builder method index.
- `cdm.product.template.SettlementPayout$SettlementPayoutBuilder` has `setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)`, so the intent "set-price-quantity" is correct but again not matched by the approved builder method index.

This indicates a **critical inconsistency in the approved builder method index**, or an issue with the intent matching logic.

### ❌ Missing Rosetta functions evidence: `MapPayerReceiver` not explicitly cited

The plan states:
> `payerReceiver` using `MapPayerReceiver`.

However, **`MapPayerReceiver` is not listed in the Rosetta evidence coverage** section. The Rosetta function used in the settlement-payout area is `MapPayerReceiverToAccountPartyReference`, not `MapPayerReceiver`. This is likely a mistake.

### ❌ Missing Rosetta functions evidence: `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` not explicitly cited

The plan states:
> Uses `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` for settlement dates.

However, **this function is not explicitly listed in the Rosetta evidence coverage section** under `dates-settlement`. While it appears in the summary, it should be explicitly listed with its Rosetta block ID for traceability.

---

## Non-blocking concerns

### ⚠️ Construction order and builder readiness for nested types

The plan suggests a construction order that builds nested types (e.g., `EconomicTerms`, `SettlementPayout`) and then sets them in parent types (e.g., `NonTransferableProduct`, `Payout`). This is correct in intent, but the builder readiness of these types is mixed:
- `cdm.product.template.NonTransferableProduct` is approved, but the builder method index does not show `setEconomicTerms` or `setProduct`.
- `cdm.product.template.Payout` is approved, but the builder method index does not show `setSettlementPayout`.
- `cdm.product.template.SettlementPayout` is approved, but the builder method index does not show `setPriceQuantity`.

This discrepancy suggests the builder method index is not exhaustive or there is a mismatch in the approved builder method index.

### ⚠️ Plan references CDM classes with same-simple-name candidates in another package

The plan references `PriceSchedule` and `ResolvablePriceQuantity` as Java implementation classes, but the CDM Java API summary shows:
- `cdm.base.math.PriceSchedule`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.observable.asset.PriceSchedule`
- `cdm.observable.asset.ResolvablePriceQuantity`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.product.common.settlement.ResolvablePriceQuantity`

The plan should use the fully qualified class names to avoid ambiguity.

### ⚠️ Plan references `ReferenceWithMetaParty`, `FieldWithMetaDate`, and other metafields classes without explicit approval

The plan references `ReferenceWithMetaParty`, `FieldWithMetaDate`, and other metafields classes without explicitly listing them in the approved CDM classes. While they are part of the approved CDM API contract, they should be explicitly cited.

### ⚠️ Plan references `ProductIdentifier`, `ProductTaxonomy`, `AdjustableOrAdjustedDateOrRelativeDate`, and `AdjustableOrRelativeDateOrExpression` as Java implementation classes

The plan references `ProductIdentifier`, `ProductTaxonomy`, `AdjustableOrAdjustedDateOrRelativeDate`, and `AdjustableOrRelativeDateOrExpression` as Java implementation classes, but the CDM Java API summary shows:
- `cdm.base.staticdata.asset.common.ProductIdentifier`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.base.staticdata.asset.common.ProductIdentifier`
- `cdm.base.staticdata.asset.common.ProductTaxonomy`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.base.staticdata.asset.common.ProductTaxonomy`
- `cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate`
- `cdm.base.datetime.AdjustableOrRelativeDateOrExpression`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.base.datetime.AdjustableOrRelativeDateOrExpression`

The plan should use the fully qualified class names to avoid ambiguity.

### ⚠️ Plan references `ReferenceWithMetaParty` as Java implementation class

The plan references `ReferenceWithMetaParty` as Java implementation class, but the CDM Java API summary shows:
- `cdm.base.staticdata.party.PartyReference`: exact class not found in cdm-java-6.7.0.jar.

The plan should use the fully qualified class name to avoid ambiguity.

### ⚠️ Plan references `PriceSchedule` as Java implementation class

The plan references `PriceSchedule` as Java implementation class, but the CDM Java API summary shows:
- `cdm.base.math.PriceSchedule`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.observable.asset.PriceSchedule`.

The plan should use the fully qualified class name to avoid ambiguity.

### ⚠️ Plan references `ResolvablePriceQuantity` as Java implementation class

The plan references `ResolvablePriceQuantity` as Java implementation class, but the CDM Java API summary shows:
- `cdm.observable.asset.ResolvablePriceQuantity`: exact class not found in cdm-java-6.7.0.jar, same simple-name candidate: `cdm.product.common.settlement.ResolvablePriceQuantity`.

The plan should use the fully qualified class name to avoid ambiguity.

---

## Decision

Decision: **NEXT_ROUND_REQUIRED**

The plan has critical issues with CDM builder method evidence and Rosetta function traceability. The plan incorrectly assumes direct builder methods for `TradeState` and nested types, and references `MapPayerReceiver` and `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` without explicit citation in the Rosetta evidence coverage. These issues must be addressed before the plan can be accepted.