# FX Derivatives Java Mapper Implementation Plan

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
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd: fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement: fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi: fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits: fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward: fx-ex07-non-deliverable-forward.xml

## Supported FX products for this run
- FX spot and forward transactions (single legs)
- Includes cross-currency spot, forward, and non-deliverable forward (NDF) products
- All fixtures under `fx-single-leg` group are runtime supported

## Observed unsupported FX products
- FX swaps (including fx-ex08-fx-swap.xml)
- FX simple options (including fx-ex09-euro-opt.xml, fx-ex10-amer-opt.xml, fx-ex11-non-deliverable-option.xml)
- FX digital options (including fx-ex14-euro-digital-option.xml, ... fx-ex19-double-no-touch-option.xml)
- FX barrier options (including fx-ex12-fx-barrier-option.xml, fx-ex13-fx-dbl-barrier-option.xml)
- FX average-rate options (including fx-ex20-avg-rate-option-parametric.xml, fx-ex21-avg-rate-option-specific.xml)
- FX strategies (including fx-ex22-straddle.xml, fx-ex23-delta-hedge.xml)
- Non-FX products (including td-ex01-simple-term-deposit.xml, td-ex02-term-deposit-w-settlement-etc.xml)

## Java package/class design

### Core Mapper Package
- `org.finos.cdm.fx.mapper`
  - `FxSingleLegMapper`: Main entry point for mapping FX single-leg trades
    - `mapFromFpml()` method: Takes FpmlFxSingleLeg and returns Trade
    - `mapFxSingleLeg()` method: Primary mapping function that orchestrates the mapping process

### Supporting Packages
- `org.finos.cdm.fx.mapper.model`
  - `FpmlFxSingleLeg`: DOM/StAX representation of FX single-leg trade (not CDM Java classes)
    - Uses parsed XML elements as internal DTOs
  - `FpmlContext`: Container for parsed FpmlFxSingleLeg components

- `org.finos.cdm.fx.mapper.helpers`
  - `PartyMapper`: Maps FPML party references to CDM parties
  - `SettlementMapper`: Maps payment details and settlement information
  - `PriceQuantityMapper`: Maps exchange rate and payment data

### Mapping Function Structure
The mapper will use a sequence of Rosetta functions from the FX single-leg ingestion context, adapted to the Java implementation:
1. `MapFxSingleLegCounterpartyList` → maps parties
2. `MapFxSingleLegNonTransferableProduct` → maps product details
3. `MapFxSingleLegEconomicTerms` → maps payout structures
4. `MapFxCoreDetailsModelToSettlementPayout` → maps payout details including price, quantity, and settlement terms
5. `MapFxSingleLegPriceQuantityList` → maps price-quantity structures

### Key CDM/Rosetta Classes Used
- `cdm.event.common.Trade`
- `cdm.product.template.NonTransferableProduct`
- `cdm.product.template.EconomicTerms`
- `cdm.product.template.Payout`
- `cdm.product.template.SettlementPayout`
- `cdm.product.common.settlement.ResolvablePriceQuantity`
- `cdm.observable.asset.Observable`
- `cdm.base.staticdata.party.Party`
- `cdm.base.staticdata.party.Counterparty`
- `cdm.base.staticdata.identifier.Identifier`

### CDM Class Import Guidelines
- Only import CDM classes explicitly mentioned in the approved CDM API contract summary
- Do not import missing classes identified in the CDM Java missing-class observations
- Use fully qualified class names from the approved CDM Java jar

## Mapping responsibilities

This plan focuses on mapping the core FX single-leg product, which includes:
- Currency pair identification (e.g., EUR/USD, GBP/USD)
- Payment amounts and currencies for both legs of the transaction
- Exchange rates (spot and forward points)
- Value dates and settlement terms
- Parties and their roles
- Settlement instructions, including split settlements
- Non-deliverable forward features

### Key mapping areas and Rosetta functions
- **Parties**: Use `MapFxSingleLegCounterpartyList` to map payer/receiver parties
- **Product details**: Use `MapFxSingleLegNonTransferableProduct` and `MapFxSingleLegEconomicTerms`
- **Price and quantity**: Use `MapFxCoreDetailsModelToSettlementPayout` and related mapper functions to transform exchange rate and payment data
- **Settlement terms**: Use `MapFxCashSettlementToSettlementTerms` for settlement logic
- **Settlement instructions**: Handle various settlement methods like SWIFT, standard, and split settlements

### Input/Output Handling
- Input: FpmlFxSingleLeg DOM object derived from XML parsing
- Output: CDM Trade object, which can be serialized via the CDM Java serializer (Jackson)
- Mapping is performed in a single-pass process using the Rosetta function definitions as reference

## Tests

### Test Strategy
1. **Unit Tests for Mapping Logic**:
   - Create unit tests for each mapped component (parties, product, price/quantity, settlement terms)
   - Each test will have an XML fixture file and its expected CDM JSON counterpart
   - Verify that key fields are correctly mapped from FpML to CDM

2. **Integration Tests**:
   - Integrate and test full mapping from FpmlFxSingleLeg to CDM Trade
   - Validate the expected CDM structure against the test fixtures

### Test Coverage by Fixture
- `fx-ex01-fx-spot.xml` → Standard spot transaction
- `fx-ex02-spot-cross-w-side-rates.xml` → Spot transaction with cross-currency rates
- `fx-ex03-fx-fwd.xml` → Standard forward transaction
- `fx-ex04-fx-fwd-w-settlement.xml` → Forward with specific settlement instructions
- `fx-ex05-fx-fwd-w-ssi.xml` → Forward with SWIFT settlement instruction
- `fx-ex06-fx-fwd-w-splits.xml` → Forward with split settlement
- `fx-ex07-non-deliverable-forward.xml` → Non-deliverable forward with fixing dates

### Validation Gates
1. **Compilation gate**: Generated Java must compile without error
2. **Mapping accuracy gate**: Generated CDM objects must match the expected structure from CDM JSON fixtures
3. **Runtime gate**: Java mapper must successfully parse input XML and produce CDM Trade objects for all 7 runtime fixtures

## Unsupported behavior

The following features are out of scope for this phase:
- FX swaps: `fx-ex08-fx-swap.xml`
- FX options: All simple option fixtures (`fx-ex09-euro-opt.xml`, `fx-ex10-amer-opt.xml`, `fx-ex11-non-deliverable-option.xml`)
- FX digital options: All digital option fixtures (`fx-ex14-euro-digital-option.xml` to `fx-ex19-double-no-touch-option.xml`)
- FX barrier options: `fx-ex12-fx-barrier-option.xml`, `fx-ex13-fx-dbl-barrier-option.xml`
- FX average-rate options: `fx-ex20-avg-rate-option-parametric.xml`, `fx-ex21-avg-rate-option-specific.xml`
- FX strategies: `fx-ex22-straddle.xml`, `fx-ex23-delta-hedge.xml`
- Non-FX products: `td-ex01-simple-term-deposit.xml`, `td-ex02-term-deposit-w-settlement-etc.xml`

These features will be handled in future phases.

## Traceability requirements

All generated Java mapping functions must be traceable to:
- Rosetta function names (as per rosetta-generation-context.md)
  - `MapFxSingleLegCounterpartyList`
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
- XML fixture structure (FpML element paths and schema)
- CDM model objects used for the mapping (from approved-cdm-api-contract-summary.md)
- CDM output JSON structure (expected from test fixtures)

The mapping logic must follow the Rosetta function call chains exactly as they would be interpreted in Rosetta, ensuring traceability to the authoritative mapping specifications and CDM model representations.