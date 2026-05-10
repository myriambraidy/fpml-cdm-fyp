# Implementation Plan: FX Derivatives FX Single-Leg Mapper

## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
**Explicitly out of scope (implementation groups):**
- fx-swap
- fx-simple-option
- fx-barrier-option
- fx-digital-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd: fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement: fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi: fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits: fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward: fx-ex07-non-deliverable-forward.xml

## Java shell contract (machine-checked)
**Generated package:** com.fpml.cdm.fx.mapper.generated
**Main generated class:** GeneratedFpmlToCdmMapper
**Required interface:** com.fpml.cdm.fx.mapper.FpmlToCdmMapper
**Generated source root:** src/main/java/com/fpml/cdm/fx/mapper/generated/
**Shell-owned files must not be rewritten:**
- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

## Rosetta evidence coverage (machine-checked)
**product-root:**
- MapFxSingleLegNonTransferableProduct
**economic-terms:**
- MapFxSingleLegEconomicTerms
**settlement-payout:**
- MapFxCoreDetailsModelToSettlementPayout
**price-quantity:**
- MapFxSingleLegPriceQuantityList
- MapFxCoreDetailsModelPriceListWithLocation
- MapFxCoreDetailsModelQuantityListWithLocation
**party-counterparty:**
- MapFxSingleLegCounterpartyList
- MapFxSingleLegAncillaryPartyList
**account-party-reference:**
- MapFxSingleLegAccountPartyReference
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductTaxonomyList
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

## Approach

### 1. High-level design

- Parse FpML `<fxSingleLeg>` using DOM/StAX; no FpML Java classes are available.
- Build internal CDM representation using approved CDM/Rosetta Java model classes.
- Serialize final TradeState at runtime boundary.
- Generate sidecar JSON reports for traceability and fixtures.

### 2. Package structure

- Generated mapper class: `com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper`
- Internal DTOs: `com.fpml.cdm.fx.mapper.dto.internal.*`
- Sidecar reporters: `com.fpml.cdm.fx.mapper.reports.*`
- Test fixtures: `src/test/resources/fixtures/` mirrored from input XML.

### 3. Core mapping responsibilities

#### 3.1 Parties and party identifiers
- Source: `<party>` and `<partyId>` under `<partyReference>` or payerReceiverModel.
- Destination: `cdm.base.staticdata.party.Party`.
- Build `PartyIdentifier` with `IdentifierType.LEI` or equivalent.
- Use `ReferenceWithMetaParty` for account references where Rosetta indicates metadata.

#### 3.2 Trade identifiers
- Source: `tradeHeader/partyTradeIdentifier`.
- Destination: `cdm.event.common.TradeIdentifier`.
- Preserve source trade ID as `AssignedIdentifier`.

#### 3.3 Product and economic terms
- Source: `fxSingleLeg/fxCoreDetailsModel`.
- Destination: `cdm.product.template.NonTransferableProduct`.
- Set `EconomicTerms` with `Payout` and `SettlementPayout`.

#### 3.4 Settlement and payout
- Source: `fxCoreDetailsModel/exchangedCurrency`, `valueDate`, `nonDeliverableSettlement`.
- Destination: `cdm.product.template.SettlementPayout`.
- Build `ResolvablePriceQuantity`, `SettlementTerms`, `Underlier` with `Observable`.

#### 3.5 Price and quantity
- Source: `exchangedCurrency/paymentAmount` for quantities; `exchangeRate` for price.
- Destination: `cdm.observable.asset.PriceSchedule`, `cdm.base.math.NonNegativeQuantitySchedule`.

#### 3.6 Product identifiers and taxonomy
- Source: `productModel/productId`, `primaryAssetClass`, `productType`.
- Destination: `cdm.base.staticdata.asset.common.ProductIdentifier`, `ProductTaxonomy`.

#### 3.7 Dates and settlement dates
- Source: `valueDate`, `nonDeliverableSettlement/settlementDate`.
- Destination: `SettlementDate` with `adjustableOrAdjustedOrRelativeDate`.

### 4. Rosetta traceability

| Concept | Rosetta function |
|--------|------------------|
| Product root | `MapFxSingleLegNonTransferableProduct` |
| Economic terms | `MapFxSingleLegEconomicTerms` |
| Settlement payout | `MapFxCoreDetailsModelToSettlementPayout` |
| Price/quantity | `MapFxSingleLegPriceQuantityList`, `MapFxCoreDetailsModelPriceListWithLocation`, `MapFxCoreDetailsModelQuantityListWithLocation` |
| Counterparty list | `MapFxSingleLegCounterpartyList` |
| Ancillary party list | `MapFxSingleLegAncillaryPartyList` |
| Account party reference | `MapFxSingleLegAccountPartyReference` |
| Product identifiers | `MapProductIdentifierList` |
| Product taxonomy | `MapProductTaxonomyList` |
| Settlement dates | `MapFxCoreDetailsModelToSettlementPayout`, `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` |

### 5. Implementation steps (Java)

1. **Parse FpML XML** into internal DTOs (DOM/StAX), extracting:
   - `fxSingleLeg` root
   - `tradeHeader`
   - `fxCoreDetailsModel`
   - `party`, `account`, `productId`, `productType`

2. **Build parties** using `Party.builder().addPartyId(...).build()`

3. **Build trade identifiers** using `TradeIdentifier.builder().addAssignedIdentifier(...).build()`

4. **Build settlement payout**:
   - `SettlementPayout.builder().setPriceQuantity(...).build()`
   - `ResolvablePriceQuantity.builder().setQuantitySchedule(...).setPriceSchedule(...).build()`
   - `SettlementTerms.builder().setSettlementCurrency(...).setSettlementDate(...).build()`

5. **Build product**:
   - `NonTransferableProduct.builder().setEconomicTerms(...).build()`
   - Attach product identifiers and taxonomy

6. **Build Trade**:
   - `Trade.builder().setProduct(...).setCounterparty(...).addAncillaryParty(...).build()`

7. **Build TradeState**:
   - `TradeState.builder().setTrade(trade).build()`

8. **Serialize** final CDM JSON at runtime boundary.

### 6. Testing and validation

- Unit tests per fixture XML path in `src/test/java`.
- Integration tests for runtime fixtures in `src/test/java/integration`.
- Sidecar JSON reports per fixture in `reports/`.
- Compile-time gating via `rosetta-validator` jar.
- Runtime validation: Ensure no Jackson ObjectNode is used for CDM construction.

### 7. Unsupported behavior

- No support for `<fxSwap>` or option roots in this phase.
- No support for non-FX products (e.g., termDeposit).
- No support for future product groups (swap, option) until later runs.

### 8. Traceability requirements

- Sidecar JSON must include:
  - Input FpML XML content (base64 or subset)
  - Rosetta function name per major block
  - Constructed CDM object tree
  - Lineage from XML element to CDM field

### 9. Build and gates

- `mvn compile` must succeed with approved CDM/Rosetta classes.
- `mvn test` must pass all runtime fixtures.
- `mvn package` must produce a runnable jar with no LLM dependency.

### 10. Future work

- Extend to fx-swap using `fxSwap` root detection.
- Extend to fx-simple-option using `fxSimpleOption`.
- Handle more complex option variants (barrier, digital, average) in subsequent phases.

--- 

*Plan derived from approved CDM API contract and semantic recipes. No unauthorized imports, builder methods, or same-simple-name class substitution are planned.*