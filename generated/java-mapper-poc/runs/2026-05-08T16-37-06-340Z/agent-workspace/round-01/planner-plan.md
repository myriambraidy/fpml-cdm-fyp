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

## FX Single-Leg Product Family Support

This plan targets the complete mapping of FX single-leg derivative products within the FX derivatives family. The focus is on mapping from FpML `fxSingleLeg` products to CDM objects, specifically targeting the Core FX domain.

The currently supported runtime fixtures are:
- fx-ex01-fx-spot: Standard FX spot transaction
- fx-ex02-spot-cross-w-side-rates: Cross-currency spot with side rates
- fx-ex03-fx-fwd: Standard FX forward transaction
- fx-ex04-fx-fwd-w-settlement: FX forward with settlement details
- fx-ex05-fx-fwd-w-ssi: FX forward with SSI (Settlement Service Instructions)
- fx-ex06-fx-fwd-w-splits: FX forward with split payments
- fx-ex07-non-deliverable-forward: Non-deliverable forward transaction

All of these fixtures represent coverable FX single-leg products within the CDM framework.

## Java Package/Class Design

The Java mapper will be contained within the `com.fpml.cdm.fx.mapper.generated` package.
The main entry point will be `GeneratedFpmlToCdmMapper` which implements the shell's `FpmlToCdmMapper` interface.
Generated classes will not overwrite shell-owned files (pom.xml, Main.java, RuntimeArgs.java, FpmlToCdmMapper.java).

## Mapping Responsibilities

The core mapping logic for FX single-leg will be built using Rosetta functions as intent authority. The implementation will handle:
- Mapping from FpML `fxSingleLeg` to CDM `NonTransferableProduct` with appropriate `EconomicTerms`
- Converting `fxCoreDetailsModel` into CDM settlement payout with price/quantity details
- Converting party references from FpML into CDM parties and counterparties
- Setting the appropriate identifiers and taxonomies
- Mapping settlement terms and dates
- Handling price and quantity schedules

## Tests

The implementation will undergo a suite of unit tests for each runtime fixture. Tests will validate:
- Correct construction of CDM `TradeState` objects
- Proper mappings of all parties and counterparties
- Correct economic terms and settlement payout construction
- Valid identifier and taxonomy conversions
- Addressing of all Rosetta function mappings as captured in mapping coverage
- Runtime serialization correctness and validation

## Validation Gates

The generated mapper will be validated through:
- Architecture compliance with shell contract
- Consistent CDM object construction using approved patterns
- Correct mapping of all mapping areas identified by Rosetta
- Compliance with the expected CDM API contract
- Runtime validation of all test fixtures

## Unsupported Behavior

The following behavior is NOT covered in this implementation:
- FX swap products (fx-swap)
- FX options (fx-simple-option, fx-digital-option, etc.)
- Strategy structures (fx-strategy)
- Non-FX products (non-fx)

## Traceability Requirements

All mapping will be traceable to:
1. Rosetta functions identified in the Rosetta evidence coverage
2. Specific concepts captured in the semantic recipes
3. CDM Java API methods approved in the API contract
4. Runtime fixture validations against expected CDM structures

The mapping will be implemented using safe Java patterns without bypassing the CDM/Rosetta import model. All usage will be limited to:
- Approved CDM classes from the approved contract
- Approved builder methods from the semantic recipes
- Rosetta function implementations via extracted intent tracing
- JAXB processing of XML with DOM/StAX for input structures, not FpML DTOs
- Jackson only for final serialization and reporting purposes