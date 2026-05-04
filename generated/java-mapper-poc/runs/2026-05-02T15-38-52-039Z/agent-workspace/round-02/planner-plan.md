# FX Derivatives Java Mapper Plan

## Product Scope and Implementation Strategy

### Current Status
- **Product Family**: fx-derivatives
- **Implementation Strategy**: staged-by-product-group
- **Current Implementation Group**: fx-single-leg (Default starting group)
- **Candidate Next Groups**: fx-swap, fx-simple-option
- **Run ID**: 2026-05-02T15-38-52-039Z

### Product Groups and Fixture Count
1. **fx-single-leg**: 7 fixtures (good-first-target, default starting group)
2. **fx-swap**: 1 fixture (candidate)
3. **fx-simple-option**: 3 fixtures (candidate)
4. **fx-digital-option**: 6 fixtures (later)
5. **fx-barrier-option**: 2 fixtures (later)
6. **fx-average-rate-option**: 2 fixtures (later)
7. **fx-strategy**: 2 fixtures (later)
8. **non-fx**: 2 fixtures (excluded)

## Supported FX Products

### Primary Focus: FX Single-Leg Products
**Supported Components**:
- FX Spot/Forward Transactions
- FX Forward Transactions with Settlement
- FX Forward with Side Rates
- FX Forward with Standard Settlement Instructions (SSI)
- FX Forward with Split Settlements
- Non-Deliverable Forward (NDF)

**Key Properties**:
- Exchange of two currencies at a fixed rate
- Value dates and exchange rates defined
- Settlement instructions can be present
- Side rates and cross rates support

### Secondary Target: FX Swap
**Supported Components**:
- FX Swap Contracts (Two leg exchanges)

**Key Properties**:
- Two FX exchanges of same currencies at different times
- May contain multiple exchanges
- Settlement detailed in multiple legs

### Future Planning Products
This plan focuses only on products within the current **fx-single-leg** implementation group. Other products are noted for their later decomposition:

- **fx-simple-option**: European/American/Old-style options (Later)
- **fx-digital-option**: Binary options (Later)
- **fx-barrier-option**: Barrier options (Later)
- **fx-average-rate-option**: Average rate options (Later)
- **fx-strategy**: Strategy wrappers (Later)

## Implementation Groups

### Current: `fx-single-leg`
- **Content**: 7 fixtures
- **Components**:
  1. FX Spot [fx-ex01-fx-spot.xml]
  2. FX Spot with cross rates [fx-ex02-spot-cross-w-side-rates.xml]
  3. FX Forward [fx-ex03-fx-fwd.xml]
  4. FX Forward with Settlement [fx-ex04-fx-fwd-w-settlement.xml]
  5. FX Forward with SSI [fx-ex05-fx-fwd-w-ssi.xml]
  6. FX Forward with Split Settlements [fx-ex06-fx-fwd-w-splits.xml]
  7. Non-Deliverable Forward [fx-ex07-non-deliverable-forward.xml]

### Next Proposed: `fx-swap`
- **Content**: 1 fixture (will be prioritized after single-leg is stable)
- **Components**: 
  1. FX Swap [fx-ex08-fx-swap.xml]

Note: Implementation group `fx-swap` will be included in **Phase 2** RFC after `fx-single-leg` implementation is complete.

### General limitations:
- No non-FX products will be included.
- All current implementation is of the `fx-single-leg` type, following existing patterns.

## Java Package Structure

### Core Package: `com.fpml.cdm.mapper.fx`
- `common`: Shared utilities, data model adapters, constants.
- `fxsingleleg`: FX Single-Leg processing, including spot/forward/NDF support.
- `fxswap`: FX Swap processing, needed when `fx-swap` group is implemented.
- `error`: Error handling and validation strategies.

### Model Mapping Contracts

#### `FxSingleLegMapper.java`
```java
public interface FxSingleLegMapper {
    CdmTrade map(FpmlTrade fpmlTrade);
}
```

Includes:
- Spot transactions
- Forward transactions
- NDF (Non-Deliverable Forward) transactions
- Value date extraction
- Forward points calculation
- Settlement information handling
- Exchange rate source extraction

#### `FxSwapMapper.java` (Pending in Phase 2)
```java
public interface FxSwapMapper {
    CdmTrade map(FpmlTrade fpmlTrade);
}
```

### Data Model Context

#### Java Types Based on CDM Core

- `CdmTrade`: Represents trade-level structure
- `Product`: Contains specific product information (e.g., `ForeignExchange`)
- `EconomicTerms`: Describes payout structure
- `Payout`: Details on cash flow components
- `PriceQuantity`: Amounts and pricing data

## Mapping Responsibilities

For specification and runtime consistency, this implementation will follow these responsibilities:

1. **Root Processing**:
   - Identify the FpML version and element structure.
   - Extract top-level trade and party sections.

2. **Trade Identification**:
   - Map `tradeHeader.partyTradeIdentifier.tradeId` to CDM `tradeIdentifier.assignedIdentifier.identifier.value`
   - Trim `Z` suffix from date fields.

3. **Parties Mapping**:
   - Resolve `partyReference` hrefs to CDM party references
   - Assign party roles (Party1/Party2) based on structure

4. **Economic Terms Mapping**:
   - Extract base and quote currencies (e.g., USD/GBP)
   - Extract rate components (spot, forward points, composite)
   - Map party roles in payouts: buyerSeller, payerReceiver

5. **Product Specific Mapping**:
   - Identify all `fxSingleLeg` components
   - Paginate exchange structures to support FX swaps

6. **Settlement Information**:
   - Handle default and custom settlement instructions using pattern matching
   - Process split settlements if present

7. **Option Mapping**:
   - Support option-based structures (latter stage) when implemented

## Validation Gates

### Precondition Checks
1. **FpML Structure Validation**:
   - Confirm `<trade>` > `<fxSingleLeg>` is present
   - Validate required fields like party references and amount exist

2. **Rate Time Stability**:
   - Confirm exchange rate values exist and are valid
   - Check for record parsing validities

3. **Party Matching**:
   - Validates party references in `payerPartyReference`, `receiverPartyReference`, and trader contexts

4. **Joint Settlement Validation**:
   - Ensure sufficient settlement information for payout process

### Json Schema Compliance
- No gross misspellings or mismatched keys
- No unexpected objects or non-leaf fields

### Edge Case Handling
- Currency mismatch in rate pair components should be logged for diagnostics
- Price quantity ratios may require rounding/scale strategies
- Failsafe for poorly structured data (missing party data, return null/empty)

## Unsupported Behavior and Known Limitations

### In scope
These features are supported including in the current phase:

- Single-leg FX forwards with traditional settlement behavior
- Spot FX trades
- NDFs with fixing date and settlement handling
- Cross-currency rates
- Settlement with SWIFT, split payment, and standard instruction

### Out of scope
The following FX features are outside the scope of this first Phase due to resource constraints and complexity:

- FX swap products (next phase)
- FX options (`fxSimpleOption`, `fxBarrierOption`, etc.)
- FX average rate products
- Strategy products (`strategy`)
- Party role assignments from FpML where mismatches occur

### Version Assumptions
Assumes:
- Using CDM standard schema version matching to existing examples
- Assumes FpML 5.1 compatible representations (verified by example)
- Assumes compatible rate structures with base/quote pairs

## Traceability Requirements

Perform circular traceability through the following to ensure correctness:

1. FpML groups mapped to CDM:
   - `partyReference` URLs are resolved to CDM party address structures
   - `tradeHeader.tradeId` values are reflected in CDM assigned identifiers
   - Dates and base swap rate structures map correctly

2. Specific product sequence mapping:
   - FX Spot: `date` → `tradeDate.value`
   - FX Forward: `valueDate`, `rate`, and `forwardPoints` components
   - NDF: `nonDeliverableForward` container with `settlementCurrency` granularities

3. Consolidated Actionable Mapping:
   - FpML `valueDate` maps to `SettlementPayout.settlementTerms.settlementDate.valueDate`
   - Exchange rate components (`rate`, `spotRate`, `forwardPoints`) → `PriceQuantity.price.value`
   - Party roles require direct link from `payerPartyReference`, `receiverPartyReference` to CDM Party roles

## References

- **Cookbook**: data/agent-cookbook/latest/product-families/fx-derivatives.md
- **Evidence**: data/agent-cookbook/latest/references/fx-derivatives.evidence.json
- **Rosetta**: data/rosetta-source/latest/docs/product-families/fx.md
- **Shared Ingest Context**: data/rosetta-source/latest/docs/shared-ingest.md

## Implementation Notes

- All mapping logic will follow input/output value paths to avoid arbitrary assumptions.
- Validation code will not use conditional pass paths outside the scope of FpML correctness.
- Reliance on stable rules identified in `fx-derivatives.evidence.json`
- Accepts day-2 loaded fixture examples but verifies enum safety for release.
- Implementation will be aliased across legacy products and maintained to some common version.