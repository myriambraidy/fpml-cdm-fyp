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

## Supported FX Products for this Run
- FX spot (fx-ex01-fx-spot)
- FX spot with cross rates (fx-ex02-spot-cross-w-side-rates)
- FX forward (fx-ex03-fx-fwd)
- FX forward with settlement instructions (fx-ex04-fx-fwd-w-settlement)
- FX forward with standard settlement instructions (fx-ex05-fx-fwd-w-ssi)
- FX forward with split settlement (fx-ex06-fx-fwd-w-splits)
- Non-deliverable forward (fx-ex07-non-deliverable-forward)

## Observed Unsupported FX Products
- FX swap (fx-ex08-fx-swap)
- FX simple option (fx-ex09-euro-opt, fx-ex10-amer-opt, fx-ex11-non-deliverable-option)
- FX digital option (fx-ex14-euro-digital-option, fx-ex15-euro-range-digital-option, fx-ex16-one-touch-option, fx-ex17-no-touch-option, fx-ex18-double-one-touch-option, fx-ex19-double-no-touch-option)
- FX barrier option (fx-ex12-fx-barrier-option, fx-ex13-fx-dbl-barrier-option)
- FX average-rate option (fx-ex20-avg-rate-option-parametric, fx-ex21-avg-rate-option-specific)
- FX strategy (fx-ex22-straddle, fx-ex23-delta-hedge)

## Java Package and Class Design

### Core Package Structure
- `org.finos.cdm.fx.mapper`: Main mapper package
  - `FxSingleLegMapper`: Entry point for FX single-leg mapping
  - `FxMapperContext`: Shared context and utility methods
  - `FxMapperException`: Custom exception type

### CDM Object Construction Strategy
- Utilize Rosetta-generated CDM Java objects directly as internal representation
- Map FpML elements to CDM objects using Rosetta function intuition:
  - `MapFxSingleLegCounterpartyList` → `Counterparty` objects
  - `MapFxSingleLegAncillaryPartyList` → `AncillaryParty` objects
  - `MapFxSingleLegNonTransferableProduct` → `NonTransferableProduct` with embedded `EconomicTerms`
  - `MapFxSingleLegEconomicTerms` → `EconomicTerms` with `Payout` (settlement via `SettlementPayout`)
  - `MapFxCoreDetailsModelToSettlementPayout` → `Payout` with structured `SettlementPayout`
    - `payerReceiver`: Constructed via `MapPayerReceiver`
    - `priceQuantity`: Constructed via `ResolvablePriceQuantity`, with
      - `quantitySchedule`: via `MapFxCoreDetailsModelQuantityWithAddress`
      - `priceSchedule`: via `MapFxCoreDetailsModelPriceWithAddress`
    - `settlementTerms`: via `MapFxCashSettlementToSettlementTerms`
    - `underlier`: via `MapCurrencyToObservableCashWithAddress`

### Mapping Responsibilities
- Input: FpML `fxSingleLeg` root and associated `party` structures
- Output: CDM `Trade` containing a `NonTransferableProduct` with `EconomicTerms`
- Responsibility for mapping TXN header and party structures handled by shared ingest components (not in scope)
- Each core mapping function will be implemented as a bean or utility method to maintain Java style and Rosetta function intent

## Tests
- **Structure validation**: Verify `Trade` and `NonTransferableProduct` structures
- **Party mapping**: Validate `Counterparty` and `AncillaryParty` population
- **EconomicTerms validation**:
  - Ensure `SettlementPayout` with correct `payerReceiver`
  - Validate `ResolvablePriceQuantity` with correct schedule references for price & quantity
  - Confirm `SettlementTerms` with correct cash settlement inputs
  - Confirm `Underlier` populated via `Observable`
- **Value validation**:
  - Validate currency codes for `quantitySchedule` and `priceSchedule`
  - Map and validate trade date, value date, and exchange rate from FpML to CDM
- **Run-time support**:
  - Test using runtime fixtures: `fx-ex01-fx-spot` through `fx-ex07-non-deliverable-forward`
  - Test with full handling of all case variations:
    - Spot vs forward
    - Non-deliverable vs deliverable forward
    - Settlement instructions
    - Split settlements
    - Cross rates
  - Use framework (Maven,JUnit,Mockito) and ensure Rosetta CDM dependency correctly resolves

## Validation Gates
1. **Static Compile Check**: Ensure generated Java code compiles without Rosetta or CDM dependency errors.
2. **Gated Serialization**: Compile-time check using `cdm-rosetta-preflight.md`'s "maven-compile-gated-jackson-serialization" to confirm CDM objects can be serialized.
3. **Semantic Runtime Validation**:
   - Map runtime fixtures to CDM objects.
   - Validate CDM object structure matches expected schema.
   - Ensure no `null` embedded objects where non-null required.

## Unsupported Behavior
The following behaviors will not be supported in this scope, though they are documented for future reference in the product model:
1. `fxSwap` product mapping is not in scope for this run (future phase)
2. `fxSimpleOption`, `fxDigitalOption`, `fxBarrierOption`, `fxAverageRateOption`, `fxStrategy` product types are not in scope (future phases)
3. Settlement instruction (`settlementInstruction`) information within `exchangedCurrency` will be supported for basic destination bank/account, but not for more complex addressing of multi-leg settlements with amount splits or sub-settlements not directly in FpML example
4. `nonDeliverableSettlement` and `fixing` configuration within FpML for NDFs are not fully mapped (just the core cash settle component as per base requirement)
5. Currency conversion features like `sideRates` or `spotRate` may be optionally extended in later phases

## Traceability Requirements
For each runtime supported fixture:
1. Map FpML element to CDM object
2. Correlate FpML participant (`partyReference`) with CDM `partyReference`
3. Cross-reference `fxCoreDetailsModel`, `exchangeRate`, and settlement date elements to CDM `EconomicTerms` and `SettlementTerms`
4. Validate core attributes like `quantity`, `price`, and `currency` are present and correctly mapped
5. Trace mapping paths using Rosetta function cues:
   - Use `MapFxSingleLegCounterpartyList` to find `Counterparty` anchors
   - Use `MapFxCoreDetailsModelToSettlementPayout` to trace `SettlementPayout` relationship
   - Validate via `MapFxCoreDetailsModelQuantityWithAddress` and `MapFxCoreDetailsModelPriceWithAddress` that price/quantity geometry is consistent
   - Validate via `MapCurrencyToObservableCashWithAddress` that the underlier information is correctly mapped
6. Ensure that the abstracted Rosetta functions are directly reflected in the Java method contracts to provide traceability of intended mapping behavior