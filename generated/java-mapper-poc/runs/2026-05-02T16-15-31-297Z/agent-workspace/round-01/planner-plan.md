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

## Product Scope Summary
The implementation scope is focused on the `fx-single-leg` product group, which contains 7 fixtures. This is the default starting group for staged FX-family generation as defined in 00-product-scope.json. The other FX product groups (fx-swap, fx-simple-option, etc.) are explicitly out of scope for this first implementation phase.

## Supported FX products for this run
- FX spot and forward transactions (fx-spot, fx-fwd)
- FX Non-Deliverable Forward (NDF) transactions
- FX Swap (fx-swap) - Note: The fx-swap group is out of scope for this plan but has an available fixture for future implementation

## Observed unsupported FX products
- FX simple options (fx-simple-option) - 3 fixtures
- FX digital options (fx-digital-option) - 6 fixtures  
- FX barrier options (fx-barrier-option) - 2 fixtures
- FX average rate options (fx-average-rate-option) - 2 fixtures
- FX strategies (fx-strategy) - 2 fixtures
- Non-FX products (non-fx) - 2 fixtures: term deposits

## Java Package/Class Design
The implementation will be structured using a Maven project layout:
- `src/main/java/com.fpml.cdm.fx` - Main package for FX derivatives conversion logic
  - `FxMapper` - Main entry point class for FpML to CDM conversion
  - `FxSingleLegMapper` - Specific mapper for `fxSingleLeg` products
  - `FxSwapMapper` - Specific mapper for `fxSwap` products (placed for future use)
  - `FxOptionMapper` - Specific mapper for `fxOption` products (placed for future use)
  - `FxConverter` - Utility class for shared conversion functions

The mapper will process FpML XML documents and convert them to CDM JSON representations, focusing on `fxSingleLeg` as the primary target.

## Mapping Responsibilities
1. **Basic FX Single-Leg Processing**:
   - Extract `partyTradeIdentifier` and map to CDM trade identifiers
   - Process `tradeDate` field with timezone normalization
   - Map `valueDate` to settlement date
   - Handle `exchangeRate` including spot rate and forward points
   - Process payment amounts and currency pairs from `exchangedCurrency1` and `exchangedCurrency2`

2. **Party Resolution**: 
   - Resolve `partyReference` hrefs into CDM party objects
   - Map party roles (Party1/Party2) from FpML payer/receiver semantics

3. **Settlement Information Handling**:
   - Map settlement instructions when present (SWIFT, splits, etc.)

4. **Special FX Cases**:
   - Handle Non-Deliverable Forward (NDF) with `nonDeliverableForward` section
   - Process side rates (`sideRates`) for cross-currency transactions

## Tests
The implementation will include:
1. Unit tests for each FX single-leg fixture
2. Integration tests for processing the complete FpML XML to CDM JSON conversion
3. Validation tests ensuring that all 7 fx-single-leg fixtures produce valid CDM outputs
4. Edge case tests for split settlements and NDF scenarios
5. Test coverage for party resolution and reference mapping

## Validation Gates
1. **Code Quality**: 
   - Static code analysis with CheckStyle
   - Unit test coverage minimum 80%
   - No code smells or maintainability issues

2. **Output Validation**:  
   - Each generated CDM matches expected output format from CDM parallel files
   - All 7 fixtures successfully convert to valid CDM representations
   - All CDM fields are populated correctly per cookbook rules
   - Party reference resolution is correct
   - Date normalization works as expected

3. **Performance**: 
   - Conversion time < 100ms per fixture
   - Memory usage under 50MB for batch processing

## Unsupported Behavior
- FX Swap (`fxSwap`) processing is not included in this scope but will be available for future implementation
- FX Option (`fxOption`) products are not included and will be supported in future phases
- FX Digital Options and other exotic options are not supported in this scope
- Settlement instruction sub-sections beyond basic SWIFT and recipient details may need refinement
- Multi-leg or strategy products are out of scope for this implementation

## Traceability Requirements
1. Each mapping operation must have traceability to a cookbook rule from `data/agent-cookbook/latest/product-families/fx-derivatives.md`
2. All FpML-to-CDM field mappings must trace to an authoritative cookbook rule
3. Generated code must be testable using the 7 provided fixture files
4. Every mapped CDM field must either:
   - Be explicitly mapped by a cookbook rule (medium-high confidence)
   - Be populated through defaulting or inferred from source data
5. Reference resolution must follow cookbook transformation rules for party hrefs

This plan focuses exclusively on the `fx-single-leg` implementation group, which includes:
- fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates.xml  
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml