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

## Supported FX products
This plan supports FX single-leg products including:
- Spot FX
- Forward FX
- Non-deliverable forward (NDF)

## Observed unsupported FX products
The following FX products are observed in the evidence but are not part of the runtime supported fixtures:
- FX swaps
- FX simple options
- FX digital options
- FX barrier options
- FX average-rate options
- FX strategies
- Non-FX products (Term deposits)

## Java package/class design
### Package Structure
- `com.fpml.cdm.fx.mapper.generated` - Contains all generated Java mapping classes
- `com.fpml.cdm.fx.mapper` - Shell-owned package for runtime contract classes

### Main Class
- `GeneratedFpmlToCdmMapper` - Implements `FpmlToCdmMapper` interface
- Uses CDM/Rosetta Java model objects as the internal representation

### Core Classes
1. `FxSingleLegMapper` - Handles the core mapping logic for FpML FX single-leg trade elements
2. `PartyMapper` - Processes party-related elements and creates CDM party objects
3. `ProductMapper` - Handles product-level mapping including identifiers and taxonomy
4. `EconomicTermsMapper` - Processes economic terms and settlement payout details
5. `PriceQuantityMapper` - Handles price and quantity mappings
6. `TradeBuilder` - Orchestrates the complete TradeState construction

The implementation will leverage the exact classes and methods approved in the CDM API contract, ensuring deterministic use of `get_cdm_java_class` before any instantiation.

## Mapping responsibilities
The mapper handles conversion from FpML FX single-leg elements to their CDM equivalent, including:
1. **Party identification** - Counterparties, ancillary parties, account party references
   - Uses `get_cdm_java_class('cdm.base.staticdata.party.metafields.ReferenceWithMetaParty')` for `ReferenceWithMetaParty`
   - Utilizes `MapFxSingleLegCounterpartyList` and `MapFxSingleLegAncillaryPartyList` Rosetta functions
2. **Product identification** - Product identifier list and taxonomy list
   - Uses `get_cdm_java_class('cdm.base.staticdata.asset.common.ProductIdentifier')` and `ProductTaxonomy`
   - Executes `MapProductIdentifierList` and `MapProductTaxonomyList` Rosetta functions
3. **Economic terms** - Payout details with settlement terms
   - Uses `get_cdm_java_class('cdm.product.template.EconomicTerms')`
   - Orchestrate `MapFxSingleLegEconomicTerms` Rosetta function
4. **Settlement details** - Price quantity, underlier, and settlement terms
   - Uses `get_cdm_java_class('cdm.product.common.settlement.ResolvablePriceQuantity')` and `PriceSchedule`
   - Utilizes `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`
5. **Trade identifiers** - Mapping from FpML trade header identifiers
   - Uses `get_cdm_java_class('cdm.event.common.TradeIdentifier')`
   - Executes `MapTradeIdentifierList` Rosetta function
6. **Date handling** - Settlement dates and adjustments
   - Uses `get_cdm_java_class('cdm.base.datetime.AdjustableOrRelativeDate')`
   - Leverages `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`

## Tests
- Unit tests for each core mapping area
- Integration tests using the 7 runtime supported fixtures
- Validation tests for:
  - Required CDM object creation
  - Correct attribute mapping (party, product, settlement, etc.)
  - Data type conversions (strings to CDM enums, dates, etc.)
- Traceability reports for mapping validation

## Validation gates
The generated code must pass:
1. CDM/Rosetta Java preflight validation
2. Build validation (using Maven)
3. Unit test suite (100% coverages)
4. Integration test for runtime fixtures
5. Traceability and mapping validation checks

## Unsupported behavior
The following FpML structures, though present in the evidence, are not addressed in this implementation:
- FX swap product structures
- FX option product structures
- FX barrier options
- FX digital options
- FX average-rate options
- FX strategies
- Non-FX products (Term deposits)
- Complex settlement date logic beyond basic adjustment mapping

## Traceability requirements
The implementation must maintain traceability to Rosetta functions:
1. Each CDM object construction must be traceable to one or more Rosetta functions
2. Mapping steps should reference Rosetta function blocks (e.g., `func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxSingleLegNonTransferableProduct`)
3. Build processes must be documented to support recipe steps and mapping intent
4. Generated code must be readable as a Java adaptation of the Rosetta mapping logic

## Implementation details
The mapper will use the FX single-leg semantic recipe `fx-single-leg-tradestate` as the blueprint, constructing:
1. Trade and TradeState objects
2. Party identification and role mapping
3. Trade identifier handling
4. NonTransferableProduct with EconomicTerms
5. Payout with SettlementPayout and price/quantity details
6. Product identifiers and taxonomy metadata

The implementation will follow Rosetta function traceability:
- Build `TradeState` from `Trade` using Rosetta function `MapTradeState` (a function you did not provide evidence for).
- For core steps:
  - `MapFxSingleLegNonTransferableProduct` for building `NonTransferableProduct`
  - `MapFxSingleLegEconomicTerms` for building `EconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout` for building `SettlementPayout` and related `ResolvablePriceQuantity`/`PriceSchedule`
  - `MapFxSingleLegCounterpartyList` and `MapFxSingleLegAncillaryPartyList` for `Counterparty` and `AncillaryParty`
  - `MapPayerReceiverToAccountPartyReference` for account party references
  - And other relevant Rosetta functions from `semantic-recipes.md`

The Java implementation will leverage the exact classes and methods approved in the CDM API contract, using only the builders and classes explicitly listed in `approved-cdm-api-contract-summary.md` and `semantic-recipes.md`.

The following classes are verified to be present:
- `TradeState`: `get_cdm_java_class('cdm.event.common.TradeState')` → found
- `Party`: `get_cdm_java_class('cdm.base.staticdata.party.Party')` → found
- `PartyIdentifier`: `get_cdm_java_class('cdm.base.staticdata.party.PartyIdentifier')` → found
- `AssignedIdentifier`: `get_cdm_java_class('cdm.base.staticdata.identifier.AssignedIdentifier')` → found
- `ReferenceWithMetaParty`: `get_cdm_java_class('cdm.base.staticdata.party.metafields.ReferenceWithMetaParty')` → found
- `Trade`: `get_cdm_java_class('cdm.event.common.Trade')` → found
- `NonTransferableProduct`: `get_cdm_java_class('cdm.product.template.NonTransferableProduct')` → found
- `SettlementPayout`: `get_cdm_java_class('cdm.product.template.SettlementPayout')` → found
- `ResolvablePriceQuantity`: `get_cdm_java_class('cdm.product.common.settlement.ResolvablePriceQuantity')` → found
- `PriceSchedule`: `get_cdm_java_class('cdm.observable.asset.PriceSchedule')` → found
- `ContractDetails`: `get_cdm_java_class('cdm.event.common.ContractDetails')` → found
- `TradeIdentifier`: `get_cdm_java_class('cdm.event.common.TradeIdentifier')` → found
- `AncillaryParty`: `get_cdm_java_class('cdm.base.staticdata.party.AncillaryParty')` → found
- `Counterparty`: `get_cdm_java_class('cdm.base.staticdata.party.Counterparty')` → found
- `EconomicTerms`: `get_cdm_java_class('cdm.product.template.EconomicTerms')` → found