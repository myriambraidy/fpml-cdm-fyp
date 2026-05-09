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

## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

## Supported FX products for this run
This run implements the FX single-leg product family, covering the following runtime fixtures:
- fx-ex01-fx-spot: Spot FX trade
- fx-ex02-spot-cross-w-side-rates: Cross currency spot with side rates
- fx-ex03-fx-fwd: Forward FX trade
- fx-ex04-fx-fwd-w-settlement: Forward FX trade with settlement
- fx-ex05-fx-fwd-w-ssi: Forward FX trade with special ingredients
- fx-ex06-fx-fwd-w-splits: Forward FX trade with splits
- fx-ex07-non-deliverable-forward: Non-deliverable forward FX trade

## Observed unsupported FX products
The following FX products are observed but not included in this implementation phase:
- fx-swap: FX swap (1 fixture)
- fx-simple-option: FX simple option (3 fixtures)
- fx-digital-option: FX digital option (6 fixtures)
- fx-barrier-option: FX barrier option (2 fixtures)
- fx-average-rate-option: FX average-rate option (2 fixtures)
- fx-strategy: FX strategy (2 fixtures)

The implementation will be staged, with later phases targeting these additional products.

## Java package/class design
Generated Java code will produce a Maven project using the CDM/Rosetta Java model as its internal representation. The following key classes are used:

### Core CDM Objects
- `cdm.event.common.Trade` (Trade state container)
- `cdm.product.template.NonTransferableProduct` (Product container)
- `cdm.product.template.EconomicTerms` (Economic terms container)
- `cdm.product.template.Payout` (Payout container)
- `cdm.product.common.settlement.SettlementPayout` (Settlement details)
- `cdm.observable.asset.ResolvablePriceQuantity` (Price/quantity details)
- `cdm.base.staticdata.party.Counterparty` (Counterparty data)
- `cdm.base.staticdata.party.Party` (Party data)
- `cdm.base.staticdata.asset.common.ProductIdentifier` (Product identification)
- `cdm.base.staticdata.asset.common.ProductTaxonomy` (Product classification)

## Mapping responsibilities
### Rosetta Functions Used
The following Rosetta functions define mapping behavior for FX single-leg products:

1. **MapFxSingleLegCounterpartyList** - Maps FpML payer/receiver models to CDM counterparties
2. **MapFxSingleLegAncillaryPartyList** - Maps FpML ancillary parties to CDM ancillary parties
3. **MapFxSingleLegNonTransferableProduct** - Maps core product information to NonTransferableProduct
4. **MapFxSingleLegEconomicTerms** - Maps economic terms including settlement details
5. **MapFxCoreDetailsModelToSettlementPayout** - Maps core FX details to settlement payouts
6. **MapFxSingleLegPriceQuantityList** - Maps price/quantity data for trades

### Java Responsibilities
The generated Java code handles:
1. **XML parsing**: Using DOM or StAX to parse FpML input documents
2. **DOM/StAX to internal DTO conversion**: Mapping XML elements to manageable Java objects
3. **CDM Object Building**: Constructing CDM model objects using builder methods
4. **Assembly of Trade State**: Combining all generated elements into a complete `Trade` object
5. **Validation**: Ensuring data integrity through CDM object builder validation

## Tests and validation gates
### Validation approach:
1. Use the CDM/Rosetta Java model as the internal representation
2. Allow the CDM library's validation during object building
3. Run against the runtime fixtures to verify against expected CDM output
4. Implement unit tests for each mapped function that validate the generated CDM structure

### Test coverage:
- Input validation for all runtime fixtures
- Structural checks against expected CDM JSON output for each fixture
- Data integrity verification of all mapped trade fields

## Unsupported behavior
The following behaviors are not included in this implementation:
1. Non-FX products are excluded as per the product scope rules
2. Other FX derivative types (swaps, options, etc.) are out of scope for this run
3. Construction of FpmlFxSingleLeg model classes is avoided per CDM Java negative class list
4. Direct usage of `com.rosetta.model.metafields.MetaFields` and `com.rosetta.model.lib.records.Date` is avoided per CDM Java negative class list

## Traceability requirements
The generated mapping code maintains traceability to the Rosetta functions used for each mapping section. The mapping responsibilities clearly map to:
- Rosetta functions that define the transformation logic
- Generated Java methods that implement that logic
- CDM classes that hold the mapped data
- Runtime fixtures that validate the implementation

The implementation is anchored to:
1. Rosetta function signatures and documentation
2. CDM Java class method signatures (from cdm-java-api-pack.md)
3. Runtime fixtures that define expected behavior
4. Product scope JSON that identifies valid FX products
5. Negative classes list that guides what not to import

This ensures a reproducible and auditable mapping approach from FpML to CDM.