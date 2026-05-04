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
    - Implements core functions using Rosetta mappings:
      - `mapFxSingleLegCounterpartyList`
      - `mapFxSingleLegAncillaryPartyList`
      - `mapFxSingleLegNonTransferableProduct`
      - `mapFxSingleLegEconomicTerms`
      - `mapFxCoreDetailsModelToSettlementPayout`
      - `mapFxSingleLegPriceQuantityList`
      - `mapFxSingleLegAccountPartyReference`
  - **Class:** `FxSingleLegMapperContext`
    - Maintains context for mapping operations
    - Provides utility methods for mapping shared helper functions
    - Manages reference mapping and caching

## Mapping responsibilities
The `FxSingleLegMapper` will implement the following Rosetta functions for FpML FX single-leg products:

### Primary mapping functions
1. **MapFxSingleLegCounterpartyList**: Maps counterparties from the FX single leg to CDM Counterparty objects
2. **MapFxSingleLegAncillaryPartyList**: Maps ancillary parties from the FX single leg
3. **MapFxSingleLegNonTransferableProduct**: Centralizes the mapping of the core product structure (`NonTransferableProduct`)
4. **MapFxSingleLegEconomicTerms**: Maps the economic terms including payout structures
5. **MapFxCoreDetailsModelToSettlementPayout**: Builds the full payout structure including price, quantity and settlement terms
6. **MapFxSingleLegPriceQuantityList**: Maps price quantity pairs for the leg
7. **MapFxSingleLegAccountPartyReference**: Maps account party references

### Helper functions used by mappings above
- **MapPayerReceiverModelToCounterpartyList**: Utility for mapping payer/receiver models to counterparties
- **MapPayerReceiver**: Maps payer/receiver models to the CDM PayerReceiver structure
- **MapFxCoreDetailsModelQuantityWithAddress**: Creates quantity schedule with address metadata
- **MapFxCoreDetailsModelPriceWithAddress**: Creates price schedule with address metadata
- **MapFxCashSettlementToSettlementTerms**: Maps cash settlement terms
- **MapCurrencyToObservableCashWithAddress**: Maps currencies to observable cash with address
- **MapFxCoreDetailsModelPriceQuantityList**: Aggregates price and quantity for underlying structures
- **MapPayerReceiverToAccountPartyReference**: Maps account party references to party references
- **MapProductIdentifierList**: Maps product identifiers
- **MapProductTaxonomyList**: Maps product taxonomy information

## Tests
The code will include unit tests for:
1. Each core mapping function (`MapFxSingleLegCounterpartyList`, `MapFxSingleLegNonTransferableProduct`, etc.)
2. Each helper function that is used by the core mappings
3. Test cases for each runtime supported fixture:
   - `fx-ex01-fx-spot.xml`
   - `fx-ex02-spot-cross-w-side-rates.xml`
   - `fx-ex03-fx-fwd.xml`
   - `fx-ex04-fx-fwd-w-settlement.xml`
   - `fx-ex05-fx-fwd-w-ssi.xml`
   - `fx-ex06-fx-fwd-w-splits.xml`
   - `fx-ex07-non-deliverable-forward.xml`
4. Test assertions verifying:
   - Correct instantiation of expected CDM objects (`Trade`, `NonTransferableProduct`, etc.)
   - Correct mapping of key fields such as counterparties, currencies, quantity, settlement terms
   - Correct structure and data flow through each mapping function

## Validation gates
- **Rosetta model compatibility**: The generated Java code must conform to the Rosetta function signatures and be compatible with CDM `cdm-java:6.7.0`
- **Runtime fixture compliance**: Validated mapping of all 7 runtime fixtures to CDM objects
- **CDM model integrity**: All CDM model calls will be made with correct types derived from `cdm-java:6.7.0`
- **Jackson serialization**: Runtime boundary serialization will use the approved `maven-compile-gated-jackson-serialization` strategy

## Unsupported behavior
- Mapping of FX swap products is not supported in this phase
- Mapping of FX options (simple, digital, barrier, average-rate, etc.) is not supported in this phase
- Mapping of FX strategies is not supported in this phase
- Any FX products outside the `fx-single-leg` group are not implemented in this run

## Traceability requirements
Mapping traceability will be ensured through:
1. **Function alignment**: Each Java method name corresponds directly to Rosetta function names
2. **Data flow tracking**: Each mapping function takes inputs as defined in Rosetta and produces outputs according to Rosetta specifications
3. **CDM model adherence**: All generated objects will be instance of classes from the `cdm-java:6.7.0` artifact
4. **Fixture mapping**: Each runtime fixture will have a dedicated test verifying end-to-end mapping to the target CDM representation
5. **Context linking**: `FxSingleLegMapperContext` maintains relationships between mapped elements to support shared helper calls