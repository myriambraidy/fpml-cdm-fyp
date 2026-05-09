# FX Derivatives Java Mapper Plan

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
**party-counterparty:**
- MapFxSingleLegCounterpartyList
- MapFxSingleLegAncillaryPartyList
**account-party-reference:**
- MapFxSingleLegAccountPartyReference
- MapPayerReceiverToAccountPartyReference
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductTaxonomyList
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

## Supported FX Products
This implementation supports FX single-leg products defined by the following runtime fixtures:
- FX spot trades (`fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`)
- FX forward trades (`fx-ex03-fx-fwd`, `fx-ex04-fx-fwd-w-settlement`, `fx-ex05-fx-fwd-w-ssi`, `fx-ex06-fx-fwd-w-splits`)
- Non-deliverable forward trades (`fx-ex07-non-deliverable-forward`)

The implementation specifically avoids supporting any FX options, swaps, or other derivative products in this iteration.

## Java Package and Class Design
Generated Java classes will be structured under:
- `com.fpml.cdm.fx.mapper.generated`
- Main mapper class: `GeneratedFpmlToCdmMapper`

The implementation will make use of:
- CDM Java model classes as specified in the approved contract
- Rosetta functions for mapping intent
- Java classes imported only from the approved CDM API contract

## Key Mapping Responsibilities for Each Area
1. **Party and Counterparty Resolution** (`party-counterparty`)
   - Maps FpML parties into CDM counterparty and ancillary party constructs
   - Uses `MapFxSingleLegCounterpartyList` and `MapFxSingleLegAncillaryPartyList` Rosetta functions
   - Assigns appropriate party roles using `MapPayerReceiver` and related functions

2. **Product Root Composition** (`product-root`)
   - Converts FpML `<fxSingleLeg>` into a CDM `NonTransferableProduct`
   - Populates identifiers and taxonomies via `MapProductIdentifierList` and `MapProductTaxonomyList`
   - Attaches `EconomicTerms` using `MapFxSingleLegEconomicTerms`

3. **Economic Terms Mapping** (`economic-terms`)
   - Builds `EconomicTerms` containing `SettlementPayout`
   - Leverages `MapFxCoreDetailsModelToSettlementPayout` to create payout structures
   - Ensures counterparty information is preserved for payout construction

4. **Settlement Payout Construction** (`settlement-payout`)
   - Uses `MapFxCoreDetailsModelToSettlementPayout` as primary Rosetta function
   - Includes `payerReceiver` resolution (via `MapPayerReceiver`)
   - Populates `priceQuantity` with `ResolvablePriceQuantity` (from `quantitySchedule` and `priceSchedule`)
   - Sets up `settlementTerms` using `MapFxCashSettlementToSettlementTerms`

5. **Price/Quantity Mapping** (`price-quantity`)
   - Processes FX price/quantity data through `MapFxCoreDetailsModelPriceQuantityList`
   - Retrieves price schedules from `MapFxCoreDetailsModelPriceWithAddress`
   - Extracts quantity schedules via `MapFxCoreDetailsModelQuantityWithAddress`

6. **Account Party Reference Assignment** (`account-party-reference`)
   - Connects accounts to parties using `MapFxSingleLegAccountPartyReference`
   - Relies on `MapPayerReceiverToAccountPartyReference` to link account identifiers

7. **Product Identifiers And Taxonomy Assignment** (`product-identifiers-taxonomy`)
   - Populates `ProductIdentifier` values using `MapProductIdentifierList` and `MapProductIdentifier`
   - Builds `ProductTaxonomy` information utilizing `MapProductTaxonomyList` and associated functions

## Tests and Validation Gates
- Unit tests will validate correct conversion of FpML input fixtures to CDM structures
- Tests will verify all required CDM classes (e.g., `Trade`, `TradeState`, `NonTransferableProduct`) are constructible and properly mapped
- Validation against the `approved-cdm-api-contract-summary.md` ensures no unauthorized imports or usage of forbidden classes
- Compliance checks validate Java shell contract adherence (packages, interfaces, files)
- Functional gates test that Rosetta-generated mappings match expected CDM structure outputs
- Runtime tests ensure the generated Maven project compiles cleanly and passes integration tests with the configured fixtures

## Unsupported Behavior
- FX swap and option products are intentionally excluded from this implementation
- Products outside the FX single-leg family (such as term deposits) are not supported and will not be processed by this generator
- Mapping from FpML-specific identifiers to CDM structures will preserve original FpML identifiers in traceability reports
- This implementation assumes standard Rosetta mappings are sufficient for basic FX single-leg structures; complex business logic enhancements are not included in this scope

## Traceability Requirements
Each step follows Rosetta mapping functions exactly as documented:
- All mappings are derived from Rosetta function blocks identified in this plan
- Java builder method calls align with approved methods from the semantic construction recipes
- Full traceability to source Rosetta functions is maintained for auditing and verification purposes
- Generated Java code uses only the authorized CDM classes and interfaces defined in the approved API contract