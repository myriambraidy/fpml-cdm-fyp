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

## Supported FX products for this run
This run supports **FX single-leg** products, specifically the following:

- FX spot
- FX forward
- Non-deliverable forward (NDF)

These are derived from the runtime supported fixtures:
- `fx-ex01-fx-spot` (FX spot)
- `fx-ex02-spot-cross-w-side-rates` (FX spot cross currency)
- `fx-ex03-fx-fwd` (FX forward)
- `fx-ex04-fx-fwd-w-settlement` (FX forward with settlement)
- `fx-ex05-fx-fwd-w-ssi` (FX forward with SSI)
- `fx-ex06-fx-fwd-w-splits` (FX forward with splits)
- `fx-ex07-non-deliverable-forward` (NDF)

## Observed but not runtime supported FX products
The following FX products were observed but are not in scope for this run:

- FX swap (`fx-ex08-fx-swap`)
- FX simple option (`fx-ex09-euro-opt`, `fx-ex10-amer-opt`, `fx-ex11-non-deliverable-option`)
- FX digital option (`fx-ex14-euro-digital-option`, `fx-ex15-euro-range-digital-option`, `fx-ex16-one-touch-option`, `fx-ex17-no-touch-option`, `fx-ex18-double-one-touch-option`, `fx-ex19-double-no-touch-option`)
- FX barrier option (`fx-ex12-fx-barrier-option`, `fx-ex13-fx-dbl-barrier-option`)
- FX average-rate option (`fx-ex20-avg-rate-option-parametric`, `fx-ex21-avg-rate-option-specific`)
- FX strategy (`fx-ex22-straddle`, `fx-ex23-delta-hedge`)

## Java package and class design
Based on the approved CDM API contract, the following key packages and classes will be used in the generated Java mapper implementation:

### Core CDM model packages:

- **`cdm.event.common`**: Contains core trade and trade state definitions.
  - `Trade`: Root trade object.
  - `TradeState`: Runtime wrapper validated as tradeState.
  - `ContractDetails`: Attach the mapped product to the trade.

- **`cdm.product.template`**: Contains core product definitions.
  - `NonTransferableProduct`: Represents FX single-leg product terms.
  - `EconomicTerms`: Contain payout and economic dates.
  - `Payout`: Container for settlement payout details.
  - `SettlementPayout`: Represents FX settlement payout.

- **`cdm.product.common.settlement`**: Contains settlement-related structures.
  - `ResolvablePriceQuantity`: Represents settlement price/quantity depending on payout type.

- **`cdm.observable.asset`**: Contains asset and price definitions.
  - `PriceSchedule`: Represents price values (from approved API contract).
  - `Observable`: Base class for underlying asset identification.

- **`cdm.base.staticdata.party.metafields`**: Party reference handling.
  - `ReferenceWithMetaParty`: Represents payer, receiver, and party identity without inventing `PartyReference`.

## Mapping responsibilities
The generated mapper will handle:

1. **Root object construction**:
   - Map FpML elements to CDM `TradeState` root using `TradeState.builder()` and `Trade.builder()`.
   - Ensure proper wrapping in `TradeState`.

2. **Contract details mapping**:
   - Map `ContractDetails` including documentation references and governing law.

3. **Non-transferable product and economic terms construction**:
   - Map `NonTransferableProduct` with identifiers and taxonomies.
   - Map `EconomicTerms` including effective date, termination date, payout and calculations.
   - Use `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms` and related Rosetta functions.

4. **Payout and settlement structures**:
   - Map `Payout` using `MapFxCoreDetailsModelToSettlementPayout`.
   - Map `SettlementPayout` components (payer/receiver, price/quantity, settlement terms, underlier).
   - Map `ResolvablePriceQuantity` including quantity and price schedules from `MapFxSingleLegPriceQuantityList`.

5. **Party and entity handling**:
   - Map counterparty, ancillary parties, and party identifiers using Rosetta functions.
   - Build `ReferenceWithMetaParty` structures, never `PartyReference`.

6. **Price and quantity handling**:
   - Construct `PriceSchedule` using available `PriceSchedule` from `cdm.observable.asset`.
   - Map `ResolvablePriceQuantity` containing both quantity schedule and price schedule for FX settlements.

## Test and validation gates
This implementation will pass the following validation gates:

1. **CDM/Rosetta Java preflight**: Confirmed artifact `org.finos.cdm:cdm-java:6.7.0` supports all used construction classes.
2. **Runtime output validation**: Generated `TradeState` objects will be checked against the contract's exact class list.
3. **Builder method conformity**: All CDM object builders will only use the approved methods listed in the contract.
4. **API contract compliance**: Only classes and methods listed in `approved-cdm-api-contract.json` will be imported and used.

## Unsupported behavior
Features explicitly identified as unsupported in this run include:

1. **Complex FX products**
   - All FX products in the "observed but not runtime supported" list will not be implemented.

2. **FX Swap products**
   - Not part of the current scope; requires different mapping functions and product structure.

3. **Option-based FX products**
   - Simple options and digital/barrier options not in scope for this run.

4. **Strategy FX products**
   - Strategies require additional decomposition not included in this scope.

5. **Non-COMMON FX assets**
   - Any features requiring access to modules like `cdm.product.collateral` or `cdm.observable.asset` classes outside those in the approved API contract will not be included.

6. **Unsupported CDM patterns**
   - No construction of `cdm.base.staticdata.party.PartyReference`, use `ReferenceWithMetaParty` instead.
   - No construction of `cdm.base.math.PriceSchedule` (instead use `cdm.observable.asset.PriceSchedule`).

## Traceability requirements
Traceability is supported through:

1. **Rosetta function coverage**: All top-level mapping steps directly trace to Rosetta functions documented in the context.
2. **Approved API adherence**: Explicitly defined and approved usage of only specific CDM classes.
3. **Semantic construction recipe adherence**: Following the `fx-single-leg-tradestate` recipe exactly.
4. **Runtime fixture testing**: Validation against actual sample fixtures (`fx-ex01-fx-spot.xml` through `fx-ex07-non-deliverable-forward.xml`).

Each generated Java class will reflect the exact object construction sequence as outlined in the semantic recipes and constrained by the approved API contract.

## Implementation Group Change Proposal
The current implementation group `fx-single-leg` is appropriate for this run. It represents the correct starting point with the best-first-target identified in the product scope. Moving to more complex FX products (swap, option) would require a significant extension of the mapper contract, which is outside this scope. The staged-by-product-group approach is working correctly.

The current implementation scope correctly implements the required FpML-to-CDM conversion for FX single-leg products without expanding into more complex derivatives categories that require substantial additional mappings and validation.