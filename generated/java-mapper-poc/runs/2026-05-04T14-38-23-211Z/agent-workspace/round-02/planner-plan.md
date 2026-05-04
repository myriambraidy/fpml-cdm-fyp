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
The following FX products are supported in this implementation phase:
- FX spot
- FX forward
- Non-deliverable forward (NDF)

These are all covered in the `fx-single-leg` group and correspond to the 7 runtime supported fixtures.

## Observed unsupported FX products
The following FX products are observed but not yet supported in this run:
- FX swap (1 fixture)
- FX simple option (3 fixtures)
- FX digital option (6 fixtures)
- FX barrier option (2 fixtures)
- FX average-rate option (2 fixtures)
- FX strategy (2 fixtures)

## Java package/class design
The generated Java mapper will follow these Java package structures:

- **Package:** `org.finos.cdm.fx.singleleg`
  - **Class:** `FxSingleLegMapper`
    - Entry point for mapping FX single-leg products from FpML to CDM
    - Implements core Rosetta functions using direct function-to-method mapping:
      - `mapFxSingleLegCounterpartyList`
      - `mapFxSingleLegAncillaryPartyList`
      - `mapFxSingleLegNonTransferableProduct`
      - `mapFxSingleLegEconomicTerms`
      - `mapFxCoreDetailsModelToSettlementPayout`
      - `mapFxSingleLegPriceQuantityList`
      - `mapFxSingleLegAccountPartyReference`
  - **Class:** `FxSingleLegMapperContext`
    - Maintains context for mapping operations
    - Provides utility methods for shared Rosetta helper functions
    - Manages reference mapping, observable/price/quantity key resolution, and metadata attachment

## Mapping responsibilities
The `FxSingleLegMapper` implements the following Rosetta functions with direct alignment to authoritative source:

### Primary mapping functions (direct Rosetta function mapping)
1. **MapFxSingleLegCounterpartyList** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:17-27`)
   - Maps counterpartyList from payer/receiver models via MapPayerReceiverModelToCounterpartyList

2. **MapFxSingleLegAncillaryPartyList** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:28-33`)
   - Maps ancillaryPartyList directly from FxSingleLeg structure

3. **MapFxSingleLegNonTransferableProduct** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:34-47`)
   - Constructs NonTransferableProduct with identifiers, taxonomy, and economicTerms from productModel and counterpartyList

4. **MapFxSingleLegEconomicTerms** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:48-64`)
   - Builds EconomicTerms with payout derived from MapFxCoreDetailsModelToSettlementPayout

5. **MapFxCoreDetailsModelToSettlementPayout** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:65-111`)
   - Central payout builder: creates SettlementPayout, ResolvablePriceQuantity, SettlementTerms, and Underlier with Observable
   - Handles NDF cash settlement via MapFxCashSettlementToSettlementTerms

6. **MapFxSingleLegPriceQuantityList** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:112-120`)
   - Aggregates PriceQuantity objects via MapFxCoreDetailsModelPriceQuantityList

7. **MapFxSingleLegAccountPartyReference** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:121-134`)
   - Maps account reference to Party using MapPayerReceiverToAccountPartyReference

### Shared helper functions (implemented as utilities)
- **MapPayerReceiverModelToCounterpartyList** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta:102-119`)
- **MapPayerReceiver** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta:779-797`)
- **MapFxCoreDetailsModelQuantityWithAddress** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:575-593`)
- **MapFxCoreDetailsModelPriceWithAddress** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:1260-1271`)
- **MapFxCashSettlementToSettlementTerms** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-settlement-func.rosetta:512-557`)
- **MapCurrencyToObservableCashWithAddress** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:2197-2207`)
- **MapFxCoreDetailsModelPriceQuantityList** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:1219-1244`)
- **MapPayerReceiverToAccountPartyReference** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta:647-677`)
- **MapProductIdentifierList** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:235-242`)
- **MapProductTaxonomyList** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:109-136`)
- **MapCurrency** (`rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:77-86`)

## Tests
The code will include unit tests for:
1. Each core mapping function, with direct input/output validation mirroring Rosetta semantics
2. Each shared helper function, validated with isolated inputs from fixture data
3. End-to-end tests for each of the 7 runtime supported fixtures:
   - `fx-ex01-fx-spot.xml`
   - `fx-ex02-spot-cross-w-side-rates.xml`
   - `fx-ex03-fx-fwd.xml`
   - `fx-ex04-fx-fwd-w-settlement.xml`
   - `fx-ex05-fx-fwd-w-ssi.xml`
   - `fx-ex06-fx-fwd-w-splits.xml`
   - `fx-ex07-non-deliverable-forward.xml`
4. Test assertions covering:
   - Correct instantiation of CDM objects (`Trade`, `NonTransferableProduct`, `EconomicTerms`, `Payout`, `SettlementPayout`, `ResolvablePriceQuantity`)
   - Correct assignment of identifiers, currencies, counterparties, settlement dates, exchange rates, and price/quantity schedules
   - Correct metadata attachment (e.g., `[metadata address]`, `[metadata reference]`)
   - Null and edge case handling (e.g., missing valueDate, empty settlementCurrency)

## Validation gates
- **Rosetta model compatibility**: All Java methods mirror Rosetta function signatures exactly and use only types declared in `rosetta-generation-context.md`
- **Runtime fixture compliance**: All 7 runtime fixtures must map successfully to CDM Trade objects without error
- **CDM model integrity**: All generated objects are instances of validated CDM types from `cdm-java:6.7.0` (per `cdm-rosetta-preflight.md`)
- **Jackson serialization**: Runtime output must use `maven-compile-gated-jackson-serialization` strategy; no ObjectNode/ArrayNode permitted
- **No LLM dependency**: Generated code must contain zero external dependencies on AI models or runtime LLMs

## Unsupported behavior
- Mapping of FX swap products is not supported in this phase
- Mapping of FX options (simple, digital, barrier, average-rate, etc.) is not supported in this run
- Mapping of FX strategies is not supported in this phase
- Any FX product with an FpML root other than `fxSingleLeg` is explicitly excluded
- Non-FX products (e.g., `termDeposit`) are excluded and will cause validation failure if encountered

## Traceability requirements
Mapping traceability will be ensured through:
1. **Direct function-to-method mapping**: Each Java method name is a direct camelCase translation of the Rosetta function name (e.g., `MapFxSingleLegCounterpartyList` → `mapFxSingleLegCounterpartyList`)
2. **Source attribution in code**: Each method includes a JavaDoc reference to its Rosetta source file and line range (e.g., `Source: ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:17-27`)
3. **CDM object lineage**: Each CDM object instance is constructed using only allowed types from `cdm-java:6.7.0`
4. **Fixture-to-Rosetta alignment**: Each runtime fixture has a dedicated test class (`FxSingleLegMapperTest_fxEx01`, etc.) verifying full traceability from FpML XML → CDM Java object graph
5. **Context linkage**: `FxSingleLegMapperContext` preserves all referenced IDs and metadata to support cross-function reference resolution (e.g., account references → party references)