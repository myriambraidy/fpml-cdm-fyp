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
- FX spot
- FX forward
- Non-deliverable forward (NDF)

## Observed but Not Runtime Supported FX Products
- FX swap
- FX simple option
- FX digital option
- FX barrier option
- FX average-rate option
- FX strategy

## Java Package and Class Design

### Generation Strategy
The implementation will generate Java code for mapping FX single-leg products from FpML to CDM. This will be a standalone project leveraging Rosetta functions as the mapping specification and CDM Java model for the internal representation.

### Package Structure

    src/main/java/
    └── org/finos/
        └── cdm/
            └── fx/
                ├── FpmlToCdmMapper.java
                ├── FpmlFxSingleLegParser.java
                ├── mapping/
                │   ├── FxSingleLegMapper.java
                │   ├── FxSingleLegCounterpartyMapper.java
                │   ├── FxSingleLegAncillaryPartyMapper.java
                │   ├── FxSingleLegProductMapper.java
                │   ├── FxSingleLegEconomicTermsMapper.java
                │   └── FxSingleLegSettlementPayoutMapper.java
                └── model/
                    └── TradeBuilder.java

### Key Mappers (Rosetta Functions)

The mappers will be derived from the Rosetta functions identified in the FX generation context, specifically:
- `MapFxSingleLegCounterpartyList`
- `MapFxSingleLegAncillaryPartyList`
- `MapFxSingleLegNonTransferableProduct`
- `MapFxSingleLegEconomicTerms`
- `MapFxCoreDetailsModelToSettlementPayout`
- `MapFxSingleLegPriceQuantityList`
- `MapFxSingleLegAccountPartyReference`

### Builder Integration
The `TradeBuilder` will orchestrate the construction of the CDM `Trade` object, using the various mapper classes to populate each field.

## Mapping Responsibilities

### Products Implementation
The first implementation will handle the following FpML structures:
- `fxSingleLeg`(`trade/fxSingleLeg`) as the root
- Currency pairs and amounts (`exchangedCurrency1`, `exchangedCurrency2`)
- Settlement information (`valueDate`, `exchangeRate`)
- Parties (`partyTradeIdentifier`, `payerPartyReference`, `receiverPartyReference`)
- Country/region data (as needed for party referencing)
- Settlement information and settlement methods (`settlementInformation`)

### Mappers Responsibility
| Mapper Class | Responsibility |
|--------------|----------------|
| `FpmlFxSingleLegParser` | Parses FpML XML into internal DTOs or DOM/StAX nodes |
| `FxSingleLegMapper` | Main entry point mapping from CDM `Trade` to FpML `fxSingleLeg` |
| `FxSingleLegCounterpartyMapper` | Maps counterparty details (uses Rosetta function `MapFxSingleLegCounterpartyList`) |
| `FxSingleLegAncillaryPartyMapper` | Maps ancillary party details (uses Rosetta function `MapFxSingleLegAncillaryPartyList`) |
| `FxSingleLegProductMapper` | Maps product details into `NonTransferableProduct` (uses Rosetta function `MapFxSingleLegNonTransferableProduct`) |
| `FxSingleLegEconomicTermsMapper` | Maps economic terms into `EconomicTerms` (uses Rosetta function `MapFxSingleLegEconomicTerms`) |
| `FxSingleLegSettlementPayoutMapper` | Maps settlement payout details into `SettlementPayout` (uses Rosetta function `MapFxCoreDetailsModelToSettlementPayout`) |

## Tests and Validation Gates

### Test Principles
All tests will use the runtime fixtures to ensure there's no reliance on unobserved or future-supported seed data. Supported fixtures will be integrated for unit and integration testing.

### Implementation Plan
1.  **Parser Unit Tests:** Create unit tests for `FpmlFxSingleLegParser` using hardcoded XML data to validate structure.
2.  **Mapper Integration Tests:** Create integration tests for each mapper, validating attributes against corresponding CDM builder expectations.
3.  **Full Mapping Pipeline Test:** End-to-end test using all runtime fixtures to validate the complete FpML to CDM flow.
4.  **Validation Gate:** Final gate to ensure no non-approved CDM classes are used.

## Unsupported Behavior

The following features from the evidence are not included in this implementation:
- Settlement methods with complex settlements (e.g., those involving `splitSettlement`)
- Multi-currency or complex instruments not found in the single-leg core
- NDFs that do not follow the basic `nonDeliverableForward` pattern

## Traceability Requirements

Each Rosetta function from the context must be directly mapped to one or more Java methods in the mapper classes, ensuring 1:1 correspondence. This ensures the implementation handles all relevant data fields from FpML per Rosetta specification.

## Implementation Group Change Proposal

No change to the default `fx-single-leg` implementation group is proposed. The current scope is appropriate for an initial, stable implementation targeting the basic FX single-leg product family. Later phases will target other FX products as defined in the product scope.

## Change Control

This plan intends to only use CDM classes that are:
- Approved in `approved-cdm-api-contract-summary.md`
- Implementable per the CDM Java API and Rosetta annotations
- Supported during runtime by the CDM/Rosetta Java preflight
- Verified as not conflicting with semantic recipes or other mapping logic