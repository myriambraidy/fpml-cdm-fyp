# Plan Validation

Status: **passed**

## Blocking Issues

- none

## Warnings

- none

## Validation Details

- Mode: structured-section
- Parsed in-scope groups: `fx-single-leg`
- Parsed out-of-scope groups: `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, `non-fx`
- Parsed runtime fixture ids: `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, `fx-ex03-fx-fwd`, `fx-ex04-fx-fwd-w-settlement`, `fx-ex05-fx-fwd-w-ssi`, `fx-ex06-fx-fwd-w-splits`, `fx-ex07-non-deliverable-forward`

---

# Plan Review: FX Single-Leg CDM Mapper

## Executive Summary

The planner’s Markdown plan for FX single-leg CDM mapping is **ACCEPTED**. It correctly restricts scope to `fx-single-leg`, cites runtime fixtures, avoids out-of-scope FX products, and adheres to the approved CDM API contract. No blocking issues were identified.

## Review Evidence

### 1. Machine-Checked Implementation Scope

- ✅ **Exact match to product scope**: In-scope group `fx-single-leg` matches `currentImplementationGroup` in `00-product-scope.json`.
- ✅ **Correct out-of-scope declarations**: All non-FX and later-stage FX groups (`fx-swap`, `fx-simple-option`, etc.) are explicitly excluded.
- ✅ **No overreach**: No claims to FX swap, option, or strategy support beyond the staged plan.

### 2. Machine-Checked Runtime Fixtures

- ✅ **All runtime fixtures listed**: `fx-ex01-fx-spot` through `fx-ex07-non-deliverable-forward` match evidence-index.md.
- ✅ **No unsupported fixtures**: Non-FX fixtures (term deposits) are excluded from runtime validation.

### 3. CDM Class Compliance

- ✅ **Approved contract adherence**: All listed classes (`TradeState`, `Trade`, `NonTransferableProduct`, etc.) are from `approved-cdm-api-contract.json`.
- ✅ **Correct PriceSchedule**: Uses `cdm.observable.asset.PriceSchedule`, not `cdm.base.math.PriceSchedule` (missing class).
- ✅ **No PartyReference**: Correctly avoids `cdm.base.staticdata.party.PartyReference` and uses `ReferenceWithMetaParty`.

### 4. Rosetta Function Traceability

- ✅ **All top-level functions cited**: `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`, `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`, `MapTradeState`.
- ✅ **Call graph consistency**: Nested Rosetta functions (e.g., `MapFxCoreDetailsModelToSettlementPayout`) are supported in rosetta-generation-context.md.

### 5. Test and Validation Gates

- ✅ **CDM preflight alignment**: Artifact `org.finos.cdm:cdm-java:6.7.0` matches preflight.
- ✅ **Runtime output validation**: Plan correctly targets `TradeState` as root output.

### 6. Unsupported Behavior

- ✅ **Correct exclusion scope**: FX swap, options, and strategies are correctly noted as out-of-scope.
- ✅ **No unsupported patterns**: No raw JSON construction, no invented classes, no unsupported CDM modules.

## Non-blocking Concerns

- **NarrativeFX wording**: The plan uses informal phrases like “FX single-leg products” in narratives but correctly gates technical claims with machine-checked sections. This is acceptable as long as implementation uses strict class names.
- **SettlementPayout ambiguity**: The plan cites `SettlementPayout` without specifying package; however, the *approved contract* resolves this to `cdm.product.template.SettlementPayout`, which is the only exact match found in `cdm-java-6.7.0.jar`.

## Decision

**Decision: ACCEPTED**

The plan meets all blocking criteria, uses the approved CDM API, and correctly restricts scope to FX single-leg. The minor concern about `SettlementPayout` package disambiguation is resolved by the approved contract and the compiled jar lookup.

---

# Revised Implementation Checklist

✅ **Root object construction**
- Use `cdm.event.common.TradeState.builder()` → `.setTrade(…)` → `.build()`.
- Use `cdm.event.common.Trade.builder()` for inner trade.

✅ **Contract details**
- Use `cdm.event.common.ContractDetails.builder()` with execution details, legal agreements, governing law.

✅ **Product and economic terms**
- Use `cdm.product.template.NonTransferableProduct.builder()` with identifiers, taxonomies.
- Use `cdm.product.template.EconomicTerms.builder()` with payout and economic dates.

✅ **Payout and settlement**
- Use `cdm.product.template.SettlementPayout.builder()` (exact class from contract and jar lookup).
- Use `cdm.observable.asset.PriceSchedule.builder()` for price schedules.
- Use `cdm.product.common.settlement.ResolvablePriceQuantity.builder()` for price/quantity container (builder methods confirmed via `get_cdm_java_class`).

✅ **Parties**
- Use `cdm.base.staticdata.party.Party`, `cdm.base.staticdata.party.PartyIdentifier`, and `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty`.
- Avoid `PartyReference`.

✅ **Price, quantity, and underlier**
- Use `cdm.observable.asset.Observable` and `cdm.base.staticdata.asset.common.Cash` (approved for FX underlier).
- Use `cdm.base.math.NonNegativeQuantitySchedule` and `cdm.observable.asset.PriceSchedule`.

✅ **Serialization and sidecar reports**
- Use Jackson to serialize only at boundary; internal model must be CDM Java builders.
- Generate traceability JSON per fixture.

✅ **Test fixtures**
- Validate generated `TradeState` against:
  - fx-ex01-fx-spot.xml → fx-ex01-fx-spot.json
  - fx-ex02-spot-cross-w-side-rates.xml → fx-ex02-spot-cross-w-side-rates.json
  - fx-ex03-fx-fwd.xml → fx-ex03-fx-fwd.json
  - fx-ex04-fx-fwd-w-settlement.xml → fx-ex04-fx-fwd-w-settlement.json
  - fx-ex05-fx-fwd-w-ssi.xml → fx-ex05-fx-fwd-w-ssi.json
  - fx-ex06-fx-fwd-w-splits.xml → fx-ex06-fx-fwd-w-splits.json
  - fx-ex07-non-deliverable-forward.xml → fx-ex07-non-deliverable-forward.json

✅ **Validation gates**
- Pass CDM/Rosetta Java preflight (artifact `org.finos.cdm:cdm-java:6.7.0`).
- Confirm no forbidden classes imported.
- Confirm builder methods used are from `approved-cdm-api-contract.json`.

--- 

**Decision: ACCEPTED**