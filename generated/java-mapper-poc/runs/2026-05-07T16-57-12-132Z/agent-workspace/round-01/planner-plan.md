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
- FX single-leg (fx-single-leg) - All 7 runtime fixtures are supported in this phase.
  - fx-ex01-fx-spot.xml
  - fx-ex02-spot-cross-w-side-rates.xml
  - fx-ex03-fx-fwd.xml
  - fx-ex04-fx-fwd-w-settlement.xml
  - fx-ex05-fx-fwd-w-ssi.xml
  - fx-ex06-fx-fwd-w-splits.xml
  - fx-ex07-non-deliverable-forward.xml

## Observed unsupported FX products
- FX swap (fx-swap) - 1 fixture observed but not in runtime scope.
  - fx-ex08-fx-swap.xml
- FX simple option (fx-simple-option) - 3 fixtures observed but not in runtime scope.
  - fx-ex09-euro-opt.xml
  - fx-ex10-amer-opt.xml
  - fx-ex11-non-deliverable-option.xml
- FX digital option (fx-digital-option) - 6 fixtures observed but not in runtime scope.
  - fx-ex14-euro-digital-option.xml
  - fx-ex15-euro-range-digital-option.xml
  - fx-ex16-one-touch-option.xml
  - fx-ex17-no-touch-option.xml
  - fx-ex18-double-one-touch-option.xml
  - fx-ex19-double-no-touch-option.xml
- FX barrier option (fx-barrier-option) - 2 fixtures observed but not in runtime scope.
  - fx-ex12-fx-barrier-option.xml
  - fx-ex13-fx-dbl-barrier-option.xml
- FX average-rate option (fx-average-rate-option) - 2 fixtures observed but not in runtime scope.
  - fx-ex20-avg-rate-option-parametric.xml
  - fx-ex21-avg-rate-option-specific.xml
- FX strategy (fx-strategy) - 2 fixtures observed but not in runtime scope.
  - fx-ex22-straddle.xml
  - fx-ex23-delta-hedge.xml

## Java package/class design
### Core Mapper Package: `org.finos.cdm.fx.singleleg`
- **`FxSingleLegMapper`**: Main entry point for mapping FX single-leg FpML to CDM.
  - Responsible for orchestrating the mapping process.
  - Maps `trade/fxSingleLeg` root element to CDM `Trade`.
- **`FxSingleLegMapperContext`**: Context class to hold mapping state and helper utilities.
  - Contains helper functions to access Rosetta functions, CDM builder methods, and shared state.
  - Provides a clean way to pass mapping context to various mapping sub-components.
- **`FxSingleLegMapperUtils`**: Utility methods for common tasks in FX single-leg mapping.
  - Contains methods for mapping common elements like product identifiers, taxonomies, and party references.
  - Provides access to necessary Rosetta helper functions like `MapProductIdentifierList`, `MapProductTaxonomyList`, `MapPayerReceiverModelToCounterpartyList`, etc.

### Supporting Classes
- **`FpmlFxSingleLegParser`**: Handles FpML XML parsing.
  - Uses a StAX or DOM parser to extract XML elements into intermediate DTOs or maps.
  - Not directly part of CDM Java but a necessary part of the generator’s structure.
  - DTOs like `FpmlFxSingleLegDto`, `FpmlFxCoreDetailsModelDto`, `FpmlLegDto` will be used for parsing and temporary storage.
- **`PartyMapper`**: Maps `Party` and `Counterparty` types.
  - Uses Rosetta functions like `MapPayerReceiverModelToCounterpartyList`, `MapCounterparty`, `MapCounterpartyRoleEnum`.
- **`ProductMapper`**: Maps `NonTransferableProduct` and `EconomicTerms`.
  - Uses Rosetta functions like `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`.
- **`PayoutMapper`**: Maps `Payout` types (especially `SettlementPayout`).
  - Uses Rosetta functions like `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`, `MapCurrencyToObservableCashWithAddress`, `MapFxCashSettlementToSettlementTerms`.
- **`PriceQuantityMapper`**: Maps `ResolvablePriceQuantity`.
  - Uses Rosetta functions like `MapFxCoreDetailsModelQuantityWithAddress`, `MapFxCoreDetailsModelPriceWithAddress`.

### CDM Java Imports
All CDM objects used in the mapping are sourced from the approved contract:
- `cdm.event.common.Trade`, `cdm.event.common.TradeState`, `cdm.event.common.ContractDetails`
- `cdm.product.template.NonTransferableProduct`, `cdm.product.template.EconomicTerms`, `cdm.product.template.Payout`, `cdm.product.template.SettlementPayout`
- `cdm.product.common.settlement.ResolvablePriceQuantity`, `cdm.product.common.settlement.SettlementTerms`, `cdm.product.common.settlement.CashSettlementTerms`
- `cdm.product.template.Underlier`, `cdm.observable.asset.Observable`
- `cdm.base.staticdata.party.Party`, `cdm.base.staticdata.party.Counterparty`, `cdm.base.staticdata.party.AncillaryParty`
- `cdm.base.staticdata.identifier.Identifier`, `cdm.base.staticdata.identifier.AssignedIdentifier`

### Builder Method Usage
Builder method calls must be made against the approved CDM API contract methods.
- All CDM builder APIs should be accessed via the methods returned by `get_cdm_builder_methods` to ensure they are in the contract.
- Example: `Trade.builder().setProduct(...)` is used, not manual field assignment.

### Dependency on Rosetta Functions
All mapping logic is defined by Rosetta functions.
- **Primary Rosetta Functions Used**:
  - `MapFxSingleLegCounterpartyList`
  - `MapFxSingleLegAncillaryPartyList`
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
  - `MapFxSingleLegAccountPartyReference`
  - `MapPayerReceiverModelToCounterpartyList`
  - `MapPayerReceiver`
  - `MapFxCoreDetailsModelQuantityWithAddress`
  - `MapFxCoreDetailsModelPriceWithAddress`
  - `MapFxCashSettlementToSettlementTerms`
  - `MapCurrencyToObservableCashWithAddress`

## Mapping responsibilities
- The responsibility of the CDM mapper is to take an FpML XML input and convert it into a valid CDM `Trade` object according to the contract.
- Each `Trade` object is composed of:
  - A `TradeState` (containing `ContractDetails`, `Product`, and optionally `Party`/`AncillaryParty` list).
  - The `Product` is a `NonTransferableProduct` for all FX single-leg products.
  - `NonTransferableProduct` encapsulates `EconomicTerms` which contains one `SettlementPayout`.
  - `SettlementPayout` uses `ResolvablePriceQuantity`, `SettlementTerms`, `Underlier`.

## Tests and validation gates
- **Unit Tests**: Each Rosetta function used in mapping should be unit tested with one or more fixtures.
- **Integration Tests**: A single integration test should be built verifying the round-trip conversion from FpML XML to CDM object and JSON representation.
- **Runtime Validation**: Generated code must be checked for compile-time and runtime compliance against the `cdm-java` artifact version 6.7.0 and the approved API contract.
- **Fixtures Used**: The runtime supported fixtures for testing will include all 7 FX single-leg examples listed under "Runtime supported fixtures (machine-checked)".

## Unsupported behavior
- Any product or element not explicitly covered by Rosetta functions in `ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` or its shared dependencies is not supported.
- Mapping of `fx-swap`, `fx-simple-option`, and other non-single-leg FX products is excluded from this scope.
- Any usage or dependency on Rosetta functions or CDM classes not included in the approved contract is forbidden.
- Usage of `FpmlFxSingleLeg` or other FpML input model objects is disallowed in favor of a parsing layer that produces temporary DTOs.

## Traceability requirements
- Every mapping action (CDM object construction) must be traceable to an original FpML element or Rosetta function.
- The complete trace of elements and functions must be captured for each supported runtime fixture.
- The traceability of `SettlementPayout` construction, particularly `ResolvablePriceQuantity`, `SettlementTerms`, and `Underlier`, should be captured for each runtime file.
- Generated code must maintain full traceability with the Rosetta functions and FpML elements used.

## Implementation Group Change Proposal
No change is proposed for the current implementation group `fx-single-leg`.
The scope is limited to FX single-leg products as intended by the default strategy.
Additional products such as swaps and options are planned for future phases as indicated by the candidate next groups in the product map.