## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
**Explicitly out of scope (implementation groups):**
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

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
- MapProductIdentifierList
- MapProductTaxonomyList
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
- MapPayerReceiverToAccountPartyReference
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductIdentifier
- MapProductTaxonomyList
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

## Implementation Plan

This plan outlines the implementation of a Java mapper for FX derivatives, focusing on the `fx-single-leg` product family. The generated Java code will convert FpML FX single-leg trade data to CDM objects using Rosetta mapping functions.

### Product Coverage
This plan focuses only on the `fx-single-leg` product group, covering 7 runtime fixtures:
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

### Java Package and Class Design
- **Package:** `com.fpml.cdm.fx.mapper.generated`
- **Main class:** `GeneratedFpmlToCdmMapper`
- **Required interface:** `com.fpml.cdm.fx.mapper.FpmlToCdmMapper`
- All Java code will be generated within `src/main/java/com/fpml/cdm/fx/mapper/generated/`
- Follows the shell contract: `pom.xml`, `Main.java`, `RuntimeArgs.java`, and `FpmlToCdmMapper.java` are not rewritten by generated code

### Mapping Responsibilities

The core mapping involves constructing the CDM `TradeState` object from FpML `fxSingleLeg` data. The mapping process will use Rosetta functions to extract and transform data elements into CDM-compatible objects.

#### 1. Product Root Construction (`product-root`)
- **Rosetta Functions:** `MapFxSingleLegNonTransferableProduct`, `MapProductIdentifierList`, `MapProductTaxonomyList`
- Maps the root product elements from FpML to CDM `NonTransferableProduct`.
- Constructs the `identifier` and `taxonomy` fields using `MapProductIdentifierList` and `MapProductTaxonomyList` respectively.
- Connects to `economicTerms` via `MapFxSingleLegEconomicTerms`.

#### 2. Economic Terms (`economic-terms`)
- **Rosetta Function:** `MapFxSingleLegEconomicTerms`
- Maps the economic terms of the FX single leg to CDM `EconomicTerms`.
- The `payout` field is composed by calling `MapFxCoreDetailsModelToSettlementPayout`.

#### 3. Settlement Payout (`settlement-payout`)
- **Rosetta Function:** `MapFxCoreDetailsModelToSettlementPayout`
- Builds the `SettlementPayout` from the core FX details model.
- Populates `payerReceiver` using `MapPayerReceiver`.
- Sets `priceQuantity` using `ResolvablePriceQuantity` with `quantitySchedule` and `priceSchedule` populated via helper functions.
- Sets `settlementTerms` with cash settlement details from `MapFxCashSettlementToSettlementTerms`.
- Sets `underlier` via `MapCurrencyToObservableCashWithAddress`.

#### 4. Price and Quantity Mapping (`price-quantity`)
- **Rosetta Functions:** `MapFxSingleLegPriceQuantityList`, `MapFxCoreDetailsModelPriceListWithLocation`, `MapFxCoreDetailsModelQuantityListWithLocation`
- Extracts price and quantity information from FpML and maps to CDM `ResolvablePriceQuantity`.
- Uses helper functions to map `priceSchedule` and `quantitySchedule` for both currency legs.

#### 5. Party Mapping (`party-counterparty`)
- **Rosetta Functions:** `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`
- Maps counterparty parties using `MapPayerReceiverModelToCounterpartyList`.
- Maps additional ancillary parties.

#### 6. Account & Party References (`account-party-reference`)
- **Rosetta Functions:** `MapFxSingleLegAccountPartyReference`, `MapPayerReceiverToAccountPartyReference`
- Resolves party references for accounts in the FpML.

#### 7. Product Identifiers and Taxonomy (`product-identifiers-taxonomy`)
- **Rosetta Functions:** `MapProductIdentifierList`, `MapProductIdentifier`, `MapProductTaxonomyList`
- Constructs `ProductIdentifier` and `ProductTaxonomy` objects for the product taxonomy.

#### 8. Dates and Settlement (`dates-settlement`)
- **Rosetta Functions:** `MapFxCoreDetailsModelToSettlementPayout`, `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`
- Handles dates, particularly settlement date formatting.
- Uses `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` for settlement dates.

### Construction Order and Validation Gates
1. **Party Data Building** - Parse and build `Party`, `Counterparty`, `AncillaryParty` objects first.
2. **Trade Identifiers** - Derive and map trade identifiers from FpML's `partyTradeIdentifier`.
3. **Root Product Building** - Use `MapFxSingleLegNonTransferableProduct` to construct `NonTransferableProduct` and attach `EconomicTerms`.
4. **Economic Terms Building** - Build `EconomicTerms` using `MapFxSingleLegEconomicTerms`.
5. **Settlement Payout Building** - Build `Payout` and `SettlementPayout` using `MapFxCoreDetailsModelToSettlementPayout` and supporting functions.
6. **Price & Quantity Handling** - Use `MapFxSingleLegPriceQuantityList` and related helpers to resolve price and quantity data.
7. **Final Trade Wrapping** - Wrap constructed `Trade` in a `TradeState` using `TradeState.builder().setTrade(trade).build()`.

### Tests and Validation
- **Unit Tests:** Each mapped area will have unit tests covering the assignment of specific elements like `counterparty`, `productIdentifier`, `settlementTerms`, etc.
- **Integration Tests:** Full integration tests will exercise the transformation from an FpML `fxSingleLeg` document to a full `TradeState` object, validating the entire mapping pipeline.
- **Runtime Validation:** Generated code must pass all build and test gates with the support of the runtime fixtures specified in `runtimeFixtures`.

### Unsupported Behavior
This plan covers only the `fx-single-leg` group and does not support:
- FX options and exotic derivatives (`fx-simple-option`, `fx-digital-option`, etc.)
- FX swaps or strategies (`fx-swap`, `fx-strategy`)
- Non-FX products (`non-fx`)
- Cases where the FpML data does not conform to standard structures expected by the mapping functions.

All generated code will use the `approved-cdm-api-contract-summary.md` as the reference for which CDM classes and builder methods are allowed. The implementation will not create instances of classes not explicitly approved in the CDM API contract.