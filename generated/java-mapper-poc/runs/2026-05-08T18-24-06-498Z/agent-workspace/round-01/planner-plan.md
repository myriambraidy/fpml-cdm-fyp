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
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductTaxonomyList
- MapProductIdentifier
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

## Product Coverage

This plan implements mapping for FX single-leg products (fx-single-leg), covering the following runtime fixtures:
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

## Core Design Elements

### Package Structure
- `com.fpml.cdm.fx.mapper.generated` - All generated Java mapping classes
- Main entry point: `GeneratedFpmlToCdmMapper`
- Implementation follows the semantic recipe pattern for building `TradeState`

### Runtime Requirements
- Generated jar must produce valid CDM `TradeState` instances
- Runtime fixtures will be processed via StAX/XML parsing, not FpML Java model classes
- All processing uses only approved CDM Java classes per `approved-cdm-api-contract-summary.md`

### Mapping Intent Authority
- Rosetta functions define mapping semantics and relationships
- CDM Java classes and build methods are derived from the approved contract
- Java implementation must match Rosetta mapping intent exactly

### Implementation Strategy
This implementation uses the `fx-single-leg-tradestate` semantic recipe in the approved mapping plan. The core steps are:

1. **Party and Identifier Mapping**: Handle party elements from FpML using `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList` and `MapPayerReceiverToAccountPartyReference`.
2. **Trade Identifier Building**: Construct `TradeIdentifier` from `tradeHeader.partyTradeIdentifier` using `MapTradeIdentifierList`.
3. **Product Creation**: Build `NonTransferableProduct` along with `EconomicTerms` using:
   - `MapFxSingleLegNonTransferableProduct`
   - `MapFxSingleLegEconomicTerms`
   - Related product identification and taxonomy mapping via `MapProductIdentifierList` and `MapProductTaxonomyList`
4. **Payout Creation**: Build `SettlementPayout` including price/quantity/settlement terms using:
   - `MapFxCoreDetailsModelToSettlementPayout`
   - `MapFxSingleLegPriceQuantityList`
   - `MapFxCoreDetailsModelPriceListWithLocation`
   - `MapFxCoreDetailsModelQuantityListWithLocation`
5. **Final Trade Wrapping**: Assemble all components into a complete `TradeState`.

## Mapping Responsibilities

### Rosetta Functions and Class Mapping
| Rosetta Function | Java Mapping Responsibility |
|------------------|----------------------------|
| MapFxSingleLegCounterpartyList | Map `fpml.FxSingleLeg` to CDM `Counterparty` and build them on `cdm.event.common.Trade`. |
| MapFxSingleLegAncillaryPartyList | Map `fpml.FxSingleLeg` to CDM `AncillaryParty` and build them on `cdm.event.common.Trade`. |
| MapFxSingleLegNonTransferableProduct | Build `NonTransferableProduct` from `fpml.FxSingleLeg` and associated identifiers/taxonomies. |
| MapFxSingleLegEconomicTerms | Build `EconomicTerms` and its `Payout` component using `MapFxCoreDetailsModelToSettlementPayout`. |
| MapFxCoreDetailsModelToSettlementPayout | Build core Payout structure including `SettlementPayout`, `ResolvablePriceQuantity`, `SettlementTerms`, and `Underlier`. |
| MapFxSingleLegPriceQuantityList | Extract `PriceQuantity` from `fpml.FxSingleLeg`. |
| MapFxSingleLegAccountPartyReference | Map `fpml.Account` to CDM `Party` reference. |
| MapProductIdentifierList | Populate `ProductIdentifier` for `NonTransferableProduct`. |
| MapProductTaxonomyList | Populate `ProductTaxonomy` for `NonTransferableProduct`. |
| MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate | Process adjustable dates from FpML for settlement terms. |

### Java Class Usage and Restrictions
- Only approved CDM classes from the `approved-cdm-api-contract-summary.md` are used
- All builder methods must be from the approved lists in the semantic recipes
- No non-approved Rosetta classes or enums like `FpmlFxSingleLeg`, `FpmlExchangedCurrency`, etc. are created directly
- CDM model objects are built exclusively using `builder().setXXX()` methods

### Test Coverage
- Each runtime supported fixture must have one generated unit test case
- Tests validate the complete conversion from FpML XML to CDM TradeState
- Tests check for correct population of core FX attributes (`Product`, `Counterparties`, `SettlementTerms`, `PriceQuantity`)
- Validation gates will assert structural correctness against the CDM schema

## Validation Gates
- CDM Java artifact version 6.7.0 must be present and validated
- All runtime fixture outputs must be valid `TradeState` representations
- Generated code must compile cleanly with the specified Java package structure
- Output `TradeState` must be serializable via Jackson according to runtime contract
- All Rosetta functions must have direct Java equivalent implementations
- Build artifacts pass Maven compilation and the preflight checks for CDM/Rosetta compatibility

## Unsupported Behavior
- Non-FX product types are out of scope
- FX Swap, Options, Digital Options, etc. are intentionally excluded from this run
- Any CDM concepts not explicitly in the approved API contract are not implemented
- No generation of FpML Java model classes (e.g., FpmlFxSingleLeg) - DOM/StAX or internal DTOs required for parsing
- XML processing is done through standard Java StAX or DOM mechanisms, not FpML-generated model objects

## Traceability Requirements
- Generated Java methods must correspond directly to Rosetta function mapping areas
- Each CDM class instantiation must align with Rosetta function block constructs
- Traceability reports must be generated showing Rosetta functions to Java methods
- Every CDM field assignment must have a documented Rosetta analog in semantic recipes

## Implementation Group Change Proposal
No change proposed. The current implementation group `fx-single-leg` represents the best first target in the phased rollout of the FX family and matches the scope defined in 00-product-scope.json.

## Fixtures Covered in this Phase:
- fx-ex01-fx-spot: Basic spot FX transaction
- fx-ex02-spot-cross-w-side-rates: Cross currency spot with side rates
- fx-ex03-fx-fwd: Forward FX transaction
- fx-ex04-fx-fwd-w-settlement: Forward with custom settlement
- fx-ex05-fx-fwd-w-ssi: Forward with SSI (Settlement Service Instructions)
- fx-ex06-fx-fwd-w-splits: Forward with split payment
- fx-ex07-non-deliverable-forward: NDF (Non-Deliverable Forward) transaction