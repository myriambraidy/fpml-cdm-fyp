# Plan Review

## Deterministic Validation

### ✅ Product scope section present
- Has `## Implementation scope (machine-checked)`
- Has `**In scope (implementation groups):**` with `fx-single-leg`
- Matches `00-product-scope.json` → `currentImplementationGroup: fx-single-leg`
- Out-of-scope list is present and exhaustive.

### ✅ Runtime fixtures section present
- Has `## Runtime supported fixtures (machine-checked)`
- Lists exactly the 7 fixture IDs found in `run_config.runtimeFixtures`.

### ✅ Java shell contract section present
- Specifies `GeneratedFpmlToCdmMapper`, `com.fpml.cdm.fx.mapper.generated`, `FpmlToCdmMapper`.
- Correctly identifies `shell-owned files`.

### ✅ Rosetta evidence coverage section present
- Lists all 14 Rosetta functions from evidence-index.md and Rosetta retrieval.
- Areas and functions match exactly the runtime fixtures.

**Conclusion:** Machine-checkable headers are correct. Narrative FX single-leg claims elsewhere are acceptable.

---

## Product Scope
- Only `fx-single-leg` is in scope.
- Out-of-scope items are correctly excluded.
- No overreach.

---

## Runtime Fixtures
- Plan targets exactly the 7 approved fixtures.
- No unsupported fixtures are claimed.

---

## Java Shell Contract
- `GeneratedFpmlToCdmMapper` is correctly named.
- Implements `FpmlToCdmMapper`.
- Uses `src/main/java/com/fpml/cdm/fx/mapper/generated/` package.
- No shell files are marked for rewriting.

**No blocking issue.**

---

## CDM/Rosetta Pre-flight
- `cdm.event.common.TradeState` exists and has `setTrade(...)` builder method.
- `cdm.event.common.Trade` exists and has `setProduct(...)` for `NonTransferableProduct`.
- `cdm.product.template.NonTransferableProduct` exists and has `setEconomicTerms(...)` and `addIdentifier(...)`/`setIdentifier(...)`.
- `cdm.product.template.EconomicTerms` exists and has `setPayout(...)`.
- `cdm.product.template.SettlementPayout` exists and has `setPriceQuantity(...)` and `setSettlementTerms(...)`.
- `cdm.product.common.settlement.ResolvablePriceQuantity` exists and has `setQuantityScheduleValue(...)` and `setPriceSchedule(...)`.
- `cdm.observable.asset.PriceSchedule` exists and has `setDatedValue(...)`, `setPerUnitOf(...)`, `setPriceType(...)`, `setUnit(...)`.
- `cdm.base.staticdata.party.Party` exists and has `addPartyId(...)`/`setPartyId(...)`.
- `cdm.base.staticdata.party.Counterparty` exists and has `setPartyReferenceValue(...)` and `setRole(...)`.
- `cdm.base.staticdata.party.AncillaryParty` exists and has `addPartyReferenceValue(...)` and `setRole(...)`.
- `cdm.base.staticdata.identifier.Identifier` exists and has `addAssignedIdentifier(...)`/`setAssignedIdentifier(...)`.
- `cdm.base.staticdata.identifier.AssignedIdentifier` exists and has `setIdentifierValue(...)`.
- `cdm.base.staticdata.identifier.TradeIdentifierTypeEnum` exists.
- `cdm.base.staticdata.asset.common.Cash` exists and has `addIdentifier(...)`/`setIdentifier(...)`.
- `cdm.observable.asset.Observable` exists and has `setAsset(...)`.
- `cdm.product.common.settlement.SettlementTerms` exists and has `setSettlementType(...)`, `setSettlementDate(...)`, `addCashSettlementTerms(...)`/`setCashSettlementTerms(...)`.
- `cdm.product.common.settlement.SettlementTypeEnum` exists.
- `cdm.product.common.settlement.CashSettlementTerms` exists and has `setCashSettlementMethod(...)`, `setValuationMethod(...)`, `setValuationDate(...)`, `setValuationTime(...)`, `setCashSettlementAmount(...)`, `setRecoveryFactor(...)`, `setFixedSettlement(...)`, `setAccruedInterest(...)`.

**All required classes and builder methods are preflights-approved.**

---

## Approved API Contract Usage
- Plan references only approved classes:
  - `Trade`, `TradeState`, `NonTransferableProduct`, `EconomicTerms`, `SettlementPayout`
  - `ResolvablePriceQuantity`, `PriceSchedule`
  - `Party`, `Counterparty`, `AncillaryParty`
  - `Identifier`, `AssignedIdentifier`, `TradeIdentifierTypeEnum`
  - `Cash`, `Observable`
  - `SettlementTerms`, `SettlementTypeEnum`, `CashSettlementTerms`
- No forbidden classes or packages cited.

**No overreach.**

---

## Semantic Recipe Coverage
- Plan maps:
  - `product-root`: `MapFxSingleLegNonTransferableProduct`
  - `economic-terms`: `MapFxSingleLegEconomicTerms`
  - `settlement-payout`: `MapFxCoreDetailsModelToSettlementPayout`
  - `price-quantity`: `MapFxSingleLegPriceQuantityList`, `MapFxCoreDetailsModelPriceListWithLocation`, `MapFxCoreDetailsModelQuantityListWithLocation`
  - `party-counterparty`: `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`
  - `account-party-reference`: `MapFxSingleLegAccountPartyReference`, `MapPayerReceiverToAccountPartyReference`
  - `product-identifiers-taxonomy`: `MapProductIdentifierList`, `MapProductIdentifier`, `MapProductTaxonomyList`
  - `dates-settlement`: `MapFxCoreDetailsModelToSettlementPayout`, `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`

**All Rosetta mapping areas and functions are accounted for.**

---

## Generated File Ownership
- Plan targets `com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper`.
- Does not touch `pom.xml`, `Main.java`, `RuntimeArgs.java`, `FpmlToCdmMapper.java`.

**Compliant.**

---

## Tests / Gates
- Plans test suite per fixture.
- Covers:
  - Correct `TradeState` construction
  - Parties/counterparties
  - Economic terms and settlement payout
  - Identifiers and taxonomies
  - All Rosetta mappings
  - Serialization correctness

**No blocking issues.**

---

## Unsupported Behavior
- Correctly excludes `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, and non-FX.

**Compliant.**

---

## Traceability
- Cites Rosetta functions, semantic recipes, approved CDM classes, and fixture validations.

**Compliant.**

---

## Evidence of Java Usage
- Plan describes builder chains using approved methods.
- Does not rely on raw JSON construction.
- No raw FpML DTOs are specified (XML parsing via DOM/StAX).
- Jackson usage limited to final serialization.

---

## Blocking Issues
- none

## Warnings
- none

## Decision
Decision: ACCEPTED