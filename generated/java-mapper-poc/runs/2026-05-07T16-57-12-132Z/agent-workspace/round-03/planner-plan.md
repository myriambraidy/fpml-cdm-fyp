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
- FX single-leg (fx-single-leg) - All 7 runtime fixtures are supported in this phase.
  - fx-ex01-fx-spot
  - fx-ex02-spot-cross-w-side-rates
  - fx-ex03-fx-fwd
  - fx-ex04-fx-fwd-w-settlement
  - fx-ex05-fx-fwd-w-ssi
  - fx-ex06-fx-fwd-w-splits
  - fx-ex07-non-deliverable-forward

## Observed unsupported FX products
- FX swap (fx-swap) - 1 fixture observed but not in runtime scope.
  - fx-ex08-fx-swap
- FX simple option (fx-simple-option) - 3 fixtures observed but not in runtime scope.
  - fx-ex09-euro-opt
  - fx-ex10-amer-opt
  - fx-ex11-non-deliverable-option
- FX digital option (fx-digital-option) - 6 fixtures observed but not in runtime scope.
  - fx-ex14-euro-digital-option
  - fx-ex15-euro-range-digital-option
  - fx-ex16-one-touch-option
  - fx-ex17-no-touch-option
  - fx-ex18-double-one-touch-option
  - fx-ex19-double-no-touch-option
- FX barrier option (fx-barrier-option) - 2 fixtures observed but not in runtime scope.
  - fx-ex12-fx-barrier-option
  - fx-ex13-fx-dbl-barrier-option
- FX average-rate option (fx-average-rate-option) - 2 fixtures observed but not in runtime scope.
  - fx-ex20-avg-rate-option-parametric
  - fx-ex21-avg-rate-option-specific
- FX strategy (fx-strategy) - 2 fixtures observed but not in runtime scope.
  - fx-ex22-straddle
  - fx-ex23-delta-hedge
- Non-FX (non-fx) - 2 fixtures excluded.
  - td-ex01-simple-term-deposit
  - td-ex02-term-deposit-w-settlement-etc

## Java package/class design
### Core Mapper Package: `org.finos.cdm.fx.singleleg`
- **`FxSingleLegMapper`**: Main entry point for mapping FX single-leg FpML to CDM. Orchestrates the entire transformation using Rosetta-defined functions. Accepts FpML XML stream and produces a fully constructed `cdm.event.common.Trade`.
- **`FxSingleLegMapperContext`**: Stateful context for mapping execution. Holds parsed FpML elements, party reference resolution maps, and traceability logs. Provides access to Rosetta function wrappers and CDM builder utilities.
- **`FpmlFxSingleLegParser`**: XML parsing layer using StAX to extract FpML elements into internal DTOs (`FpmlFxCoreDetailsModelDto`, `FpmlPayerReceiverModelDto`, `FpmlSettlementInstructionDto`, `FpmlNonDeliverableForwardDto`, etc.) without referencing FpML model classes.
- **`PartyMapper`**: Maps FpML party references to CDM `Counterparty` and `AncillaryParty` using `MapPayerReceiverModelToCounterpartyList`, `MapFxSingleLegCounterpartyList`, and `MapFxSingleLegAncillaryPartyList`. Resolves party IDs via `MapCounterpartyRoleEnum` and `MapCounterparty`.

### Supporting Classes
- **`ProductMapper`**: Maps FpML product details to `NonTransferableProduct` via `MapFxSingleLegNonTransferableProduct`. Handles product identifiers (`MapProductIdentifierList`) and taxonomies (`MapProductTaxonomyList`).
- **`EconomicTermsMapper`**: Constructs `EconomicTerms` using `MapFxSingleLegEconomicTerms`, which delegates to `MapFxCoreDetailsModelToSettlementPayout`.
- **`PayoutMapper`**: Maps `SettlementPayout` via `MapFxCoreDetailsModelToSettlementPayout`, including:
  - `payerReceiver` via `MapPayerReceiver`
  - `priceQuantity` via `MapFxCoreDetailsModelQuantityWithAddress` and `MapFxCoreDetailsModelPriceWithAddress`
  - `settlementTerms` via `MapFxCashSettlementToSettlementTerms`
  - `underlier` via `MapCurrencyToObservableCashWithAddress`
- **`PriceQuantityMapper`**: Constructs `ResolvablePriceQuantity` using Rosetta’s price/quantity mapping rules with address metadata derived from FpML `paymentAmount`, `exchangeRate`, and `valueDate` paths.

### CDM Java Imports (Approved and Verified)
All classes are drawn exclusively from the approved CDM API contract (38 classes, 114 builder methods):

- **Trade Root**: `cdm.event.common.Trade`, `cdm.event.common.TradeState`, `cdm.event.common.ContractDetails`
- **Product**: `cdm.product.template.NonTransferableProduct`, `cdm.product.template.EconomicTerms`, `cdm.product.template.SettlementPayout`
- **Payout/Price/Quantity**: `cdm.product.common.settlement.ResolvablePriceQuantity`, `cdm.product.common.settlement.SettlementTerms`, `cdm.product.common.settlement.CashSettlementTerms`, `cdm.observable.asset.Observable`
- **Party/Counterparty**: `cdm.base.staticdata.party.Party`, `cdm.base.staticdata.party.Counterparty`, `cdm.base.staticdata.party.AncillaryParty`, `cdm.base.staticdata.party.CounterpartyRoleEnum`
- **Identifiers**: `cdm.base.staticdata.identifier.AssignedIdentifier`, `cdm.base.staticdata.identifier.Identifier`
- **Meta Fields**: `com.rosetta.model.metafields.FieldWithMetaString`
- **Asset**: `cdm.base.staticdata.asset.common.Cash`

### Builder Method Usage
- Builder methods must be invoked only via approved contract methods: e.g., `Trade.builder().setContractDetails(...)`, `SettlementPayout.builder().setPriceQuantity(...)`, `ResolvablePriceQuantity.builder().setQuantitySchedule(...)`.
- No manual field assignment. All object construction must use builder chains validated by `get_cdm_builder_methods`.
- Traceability logs record each builder call’s origin FpML path.

## Mapping responsibilities
- **Primary Mapping Logic**: Each `Trade` object is constructed from a single `trade/fxSingleLeg` FpML input using Rosetta functions as authoritative semantics.
- **Trade Composition**:
  - `Trade` contains `TradeState` with `ContractDetails` and `Product`.
  - `Product` is a `NonTransferableProduct` holding `EconomicTerms`.
  - `EconomicTerms` contains exactly one `SettlementPayout`.
  - `SettlementPayout` holds:
    - `payerReceiver` (from `MapPayerReceiver`)
    - `priceQuantity` (ResolvablePriceQuantity with `quantitySchedule` and `priceSchedule`)
    - `settlementTerms` (with `settlementType: Cash`, `settlementDate`, and `cashSettlementTerms`)
    - `underlier` (Observable referencing `Cash` with currency identifier)
- **Cross-Object Linkage**: Party references (`partyReference`) are resolved globally and reused across `Counterparty`, `PayerReceiver`, and `AccountPartyReference`.

## Tests and validation gates
- **Unit Tests**: Each Rosetta function (e.g., `MapFxCoreDetailsModelToSettlementPayout`) is tested individually with one representative fixture. Assertions verify constructed CDM object fields match expected CDM JSON paths.
- **Integration Test**: A single JUnit test processes all 7 runtime fixtures end-to-end:
  1. Parse FpML XML to DTOs
  2. Transform to CDM `Trade` via `FxSingleLegMapper`
  3. Serialize to JSON using Jackson
  4. Validate against expected CDM JSON schema (verified via `get_expected_cdm_summary`)
- **Runtime Validation**:
  - Compile-time: Maven build with `cdm-java:6.7.0` dependency. Zero forbidden classes.
  - Runtime: Generated JAR passes `rosetta-validator` module check using `cdm-validator` JAR with `maven-compile-gated-jackson-serialization`.
  - Semantic validation: All 7 fixtures must pass round-trip JSON compliance with schema paths defined in `get_expected_cdm_summary`.
- **Coverage**: 100% traceability from each CDM field to FpML element via Rosetta function.

## Unsupported behavior
- Mapping of `fxSwap`, `fxSimpleOption`, `fxBarrierOption`, etc., is strictly excluded.
- Non-FX products (e.g., term deposits) are rejected at parsing layer with explicit exception.
- No support for non-Cash settlement types, non-standard FX features (e.g., averaging, digital options), or legacy FpML structures outside `fxSingleLeg` scope.
- Any use of `FpmlFxSingleLeg` or direct FpML model binding is prohibited.
- Use of unapproved CDM classes (e.g., `cdm.base.math.PriceSchedule`) or Rosetta functions outside the contract is forbidden.

## Traceability requirements
- Every constructed CDM field must be tagged with:
  - Origin FpML XPath (e.g., `/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency`)
  - Source Rosetta function (e.g., `MapCurrencyToObservableCashWithAddress`)
  - Target CDM field (e.g., `SettlementPayout.underlier.Observable.value.Asset.Cash.identifier`)
- Trace logs are serialized into a traceability metadata object attached to each `Trade` as `FieldWithMetaString`.
- Traceability must be queryable after serialization and preserved in downstream CDM storage.
- Traceability for each runtime fixture is documented in a dedicated `traceability/fx-ex01-fx-spot.json` file in the test assets.

## Implementation Group Change Proposal
No change is proposed. The default implementation group `fx-single-leg` is fully aligned with the 7 runtime fixtures and product scope. All supported fixtures are confirmed to map cleanly to `trade/fxSingleLeg` and its Rosetta ingestion functions. No expansion beyond this group is required for this run.