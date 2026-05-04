# FX Derivatives Java Mapper - Implementation Plan

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

## Supported FX products for this run
- FX single-leg: 7 fixtures (all observed, all runtime supported in this phase)
  - fx-ex01-fx-spot.xml
  - fx-ex02-spot-cross-w-side-rates.xml
  - fx-ex03-fx-fwd.xml
  - fx-ex04-fx-fwd-w-settlement.xml
  - fx-ex05-fx-fwd-w-ssi.xml
  - fx-ex06-fx-fwd-w-splits.xml
  - fx-ex07-non-deliverable-forward.xml

## Observed unsupported FX products
- FX swap: 1 fixture
  - fx-ex08-fx-swap.xml
- FX simple option: 3 fixtures
  - fx-ex09-euro-opt.xml
  - fx-ex10-amer-opt.xml
  - fx-ex11-non-deliverable-option.xml
- FX digital option: 6 fixtures
  - fx-ex14-euro-digital-option.xml
  - fx-ex15-euro-range-digital-option.xml
  - fx-ex16-one-touch-option.xml
  - fx-ex17-no-touch-option.xml
  - fx-ex18-double-one-touch-option.xml
  - fx-ex19-double-no-touch-option.xml
- FX barrier option: 2 fixtures
  - fx-ex12-fx-barrier-option.xml
  - fx-ex13-fx-dbl-barrier-option.xml
- FX average-rate option: 2 fixtures
  - fx-ex20-avg-rate-option-parametric.xml
  - fx-ex21-avg-rate-option-specific.xml
- FX strategy: 2 fixtures
  - fx-ex22-straddle.xml
  - fx-ex23-delta-hedge.xml

## Java package/class design
The Java mapper will be structured under `com.rosetta.fx.mapper`:

### Core package structure
- `com.rosetta.fx.mapper` (package for main mapper logic)
  - `FpmlToCdmMapper.java` (Primary mapper interface)
  - `FxSingleLegMapper.java` (Implementation for FX single-leg products)
  - `FxMapperContext.java` (Common context and utility for mapping)

### Domain packages
- `com.rosetta.fx.mapper.model` (CDM model wrapper classes)
  - `FxSingleLeg.java` (CDM representation of FX single-leg)
  - `FxTrade.java` (Base trade type)
  - `FxSettlement.java` (Settlement info)
- `com.rosetta.fx.mapper.mapping` (Mapping logic to handle specific FpML elements)
  - `FxSingleLegMapping.java`
  - `PartyAndTradeIdMapping.java`
  - `SettlementInfoMapping.java`
  - `ExchangeRateMapping.java`
  - `CurrencyAmountMapping.java`

### Mapper organization
- `FpmlToCdmMapper` is the main entry point, with a method to convert `FpmlTrade` to `CdmTrade`.
- `FxSingleLegMapper` specifically handles trade root node `<fxSingleLeg>` and its children.
- Mapping utilities are shared, encapsulated in mapping classes like `CurrencyAmountMapping`.

## Mapping responsibilities
This planning phase is focused on the FX single-leg product family.

### FpML parsing responsibilities for fx-single-leg
- `trade/fxSingleLeg/exchangedCurrency1`
- `trade/fxSingleLeg/exchangedCurrency2`
- `trade/fxSingleLeg/valueDate`
- `trade/fxSingleLeg/exchangeRate`
- `trade/fxSingleLeg/exchangeRate/quotedCurrencyPair`
- `trade/fxSingleLeg/exchangeRate/rate`
- `trade/fxSingleLeg/exchangeRate/sideRates` (optional)
- `trade/fxSingleLeg/exchangeRate/spotRate` (optional)
- `trade/fxSingleLeg/exchangeRate/forwardPoints` (optional)
- `trade/fxSingleLeg/nonDeliverableForward` (optional)

### CDM output responsibilities for fx-single-leg
- `product`
    - `product.economicTerms.payout`
    - `product.economicTerms.payout.SettlementPayout`
    - `product.economicTerms.payout.SettlementPayout.priceQuantity`
    - `product.economicTerms.payout.SettlementPayout.settlementTerms.settlementType`
    - `product.economicTerms.payout.SettlementPayout.underlier`
- `tradeLot`
    - `tradeLot.priceQuantity`
        - `tradeLot.priceQuantity.price`
        - `tradeLot.priceQuantity.quantity`
- `party`
    - `party.partyId` (LEI)
- `tradeIdentifier` (for associated trade IDs)
- `tradeDate`

## Tests
This implementation will pass the basic validation gates for the `fx-ex01-fx-spot` fixture. Future tests for the support of the other typical FX single-leg fixtures will be added in subsequent phases and are out of scope for this planning stage.

### Test coverage
- Unit test class `FxSingleLegMapperTest.java`
- Test cases covering:
  - Basic spot FX trade conversion
  - Spot FX trade with side rates
  - Forward FX trade
  - FX trade with settlement information
  - FX trade with non-deliverable forward (NDF) configuration
  - FX trade with settlement styles (filtered to Standard set if present)
  - FX trade with split settlements (if present)
  - Trade date and value date handling
  - Currency/amount mapping
  - Party mapping with LEI identifiers
  - Trade ID mapping with different (internal) IDs per party

## Validation gates
This implementation covers the runtime supported fixture `fx-ex01-fx-spot.xml`. It will pass:

1. **Valid FpML to CDM Round-trip**: FpML input converts correctly to valid CDM output.
2. **Data Integrity**: All relevant fields from FpML are captured in the CDM output.
3. **Key FX Data Fields**: The key attributes of FX single-leg trades (currencies, amounts, exchange rate, value date) are rounded-tripped accurately.

## Unsupported behavior
This plan covers only the FX single-leg product family. Because this is the first-phase implementation, the following behaviors are explicitly *unsupported*:

- FX swaps (`trade/fxSwap`)
- FX simple options (`trade/fxSimpleOption`)
- FX digital options (`trade/fxDigitalOption`)
- FX barrier options (`trade/fxBarrierOption`)
- FX average-rate options (`trade/fxAverageRateOption`)
- FX strategies (`trade/strategy`)
- Swap legs, multi-leg structures, complex over-the-counter (OTC) structured products, etc.

The following attributes of FX single-leg are also confirmed to be unsupported due to limited scope in this phase:

- Multi-settlement (e.g., `splitSettlement`)
- Non-deliverable forward settlement override and alternative formulas
- Dry-run settlement information detailing and logic beyond standard Vanilla FX across the fixture examples

These unsupported features will be addressed in later phases of the implementation strategy.

## Traceability requirements
Each mapping from an FpML node to a CDM model element will be traceable via comments or dedicated tracer methods. The following elements will be traced:

- All constructor calls in CDM model objects
- Map keys and required values from `<root>` to `product.economicTerms.payout`
- Emitterrail for DatedValue creation
- Currency date creation and laborating on `tradeDate` and `valueDate`
- Runtime validation of FpML elements for key data (e.g., currency pairs, settlement dates, rates)
- Within utility methods like `CurrencyAmountMapping`, trace how amounts and currencies are captured

Additionally, logical separation will be maintained between:

- `FxSingleLegMapper`
- `FxMapperContext`
- `CurrencyAmountMapping`
- `ExchangeRateMapping`

This traceability will be solely within the generated Java files and will require test and test-class validation to ensure binding is operational.

## Implementation Group Change Proposal
No change to the current implementation group `fx-single-leg` is proposed. This is the natural starting point for FX family implementation. The splintering logic (to clean and targeted independence of partial scope), must remain intact to avoid unexpected design shifts.

## Fixtures covered in this phase
- fx-ex01-fx-spot.xml (runtime supported fixture)
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml