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

## Supported FX products for this run
- FX single-leg (fx-single-leg)

## Observed unsupported FX products
- FX swap (fx-swap): 1 fixture(s)
- FX simple option (fx-simple-option): 3 fixture(s)
- FX digital option (fx-digital-option): 6 fixture(s)
- FX barrier option (fx-barrier-option): 2 fixture(s)
- FX average-rate option (fx-average-rate-option): 2 fixture(s)
- FX strategy (fx-strategy): 2 fixture(s)

## Java package/class design
- **Base package**: `com.rosetta.fx.mapper`
- **Core mapping class**: `FxSingleLegMapper` in `com.rosetta.fx.mapper.singleleg`
- **Support classes**:
  - `FxSingleLegMapperUtils` for shared utility functions
  - `PayerReceiverMapper` for mapping payer/receiver parties
  - `PriceQuantityMapper` for mapping price/quantity details
  - `SettlementTermsMapper` for mapping settlement details
- **Input/Output**: 
  - Input: `fpml.FxSingleLeg` (FpML object)
  - Output: `cdm.product.fx.FxSingleLeg` (CDM object)

## Mapping responsibilities
- **Party mapping**: Use Rosetta's `MapFxSingleLegCounterpartyList` and related functions to map parties
- **Economic terms**:
  - `MapFxSingleLegEconomicTerms` delegates to `MapFxCoreDetailsModelToSettlementPayout`
- **Settlement payout**:
  - `MapFxCoreDetailsModelToSettlementPayout` handles the core payout creation, including:
    - `payerReceiver` mapping
    - `priceQuantity` handling via `ResolvablePriceQuantity`
    - `settlementTerms` mapping via `MapFxCashSettlementToSettlementTerms`
    - `underlier` mapping with `Observable` type
- **Price and quantity**:
  - Delegated to `MapFxCoreDetailsModelPriceQuantityList` from the Rosetta function `MapFxSingleLegPriceQuantityList`
- **Taxonomy and identifier**: 
  - `MapProductTaxonomyList` and `MapProductIdentifierList` from Rosetta shared functions
- **Fixed point values**: The `rate` field uses a simple mapping from `fpml.ExchangeRate.rate` to `cdm.price.Quantity.value`

## Tests
- **Unit test suite**: `FxSingleLegMapperTest.java`
  - Tests mapping of `fx-ex01-fx-spot.xml` to match expected CDM JSON structure
  - Tests mapping of other single-leg fixtures to validate consistency
- **Snapshot tests**: For structural validation against expected JSON outputs

## Validation gates
- **Functional correctness**: All fields from the FpML `fxSingleLeg` must be correctly mapped to corresponding CDM fields.
- **Canonical data alignment**: Mapping of `rate` and `valueDate` must align with Rosetta canonical representation.
- **Party reference integrity**: Counterparty party resolution must be accurate using Rosetta's party mapping logic.
- **Runtime support**: Only fixture `fx-ex01-fx-spot` is runtime supported; others are reserved for future implementation.
- **Output json characteristics**: Output must match the expected CDM structure and be compatible with downstream CDM processing.

## Unsupported behavior
- **Non-deliverable forward (NDF) contracts**: These require explicit handling of `nonDeliverableSettlement` which is partially implemented in Rosetta but needs integration details in this mapping logic.
- **Settlement currency**: Currently, the mapping is unimplemented for settlement currency specific scenarios.
- **Delivery details**: Fully structural delivery handling (e.g., physical delivery) is outside the scope since SPOT and FORWARD are implemented in this stage.
- **Special FX features (e.g., quanto, barrier, average)**: These are not part of the current group and are reserved for later stages.

## Traceability requirements
- **Mapping traceability**: Each CDM field must have a clear lineage to a source FpML element or attribute.
- **Rosetta function traceability**: All mappings must reference functions defined in Rosetta FX ingest modules.
- **XML path traceability**: Each CDM element needs to be traceable to its specific XML path in the FpML file (e.g., `/FpML/trade/fxSingleLeg/exchangeRate/rate`).
- **CDM representation**: Must align with the canonical CDM structure as cited in the shared ingest documentation, adhering to CDM conventions.