# FX Derivatives Java Mapper - Implementation Plan

## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
**Explicitly out of scope (implementation groups):**
- non-fx

## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

## Supported FX Products for this run
- FX Spot (fx-ex01-fx-spot.xml)
- FX Spot with cross rate (fx-ex02-spot-cross-w-side-rates.xml)
- FX Forward (fx-ex03-fx-fwd.xml)
- FX Forward with Settlement (fx-ex04-fx-fwd-w-settlement.xml)
- FX Forward with SSI (fx-ex05-fx-fwd-w-ssi.xml)
- FX Forward with Splits (fx-ex06-fx-fwd-w-splits.xml)
- Non-Deliverable Forward (fx-ex07-non-deliverable-forward.xml)

## Observed unsupported FX products
- FX Swap (fx-ex08-fx-swap.xml) - Future phase
- FX Simple Option (fx-ex09-euro-opt.xml, fx-ex10-amer-opt.xml, fx-ex11-non-deliverable-option.xml) - Future phase
- FX Digital Option (fx-ex14-euro-digital-option.xml, fx-ex15-euro-range-digital-option.xml, fx-ex16-one-touch-option.xml, fx-ex17-no-touch-option.xml, fx-ex18-double-one-touch-option.xml, fx-ex19-double-no-touch-option.xml) - Future phase
- FX Barrier Option (fx-ex12-fx-barrier-option.xml, fx-ex13-fx-dbl-barrier-option.xml) - Future phase
- FX Average Rate Option (fx-ex20-avg-rate-option-parametric.xml, fx-ex21-avg-rate-option-specific.xml) - Future phase
- FX Strategy (fx-ex22-straddle.xml, fx-ex23-delta-hedge.xml) - Future phase

## Java Package/Class Design

### Core Package Structure
```java
package org.finos.cdm.mapper.fx;

// Core mapping entry points
public class FxMapper {
    public static Trade mapFxSingleLeg(FpmlFxSingleLegDto fpml) { ... }
    public static TradeState mapFxSingleLegToTradeState(FpmlFxSingleLegDto fpml) { ... }
}

// Internal DTOs for FpML parsing
package org.finos.cdm.mapper.fx.dto;

public class FpmlFxSingleLegDto { ... }
public class FpmlExchangedCurrencyDto { ... }
public class FpmlExchangeRateDto { ... }
public class FpmlPartyDto { ... }

// Helper mapping utilities  
package org.finos.cdm.mapper.fx.helper;

public class FxMapperHelper { ... }
public class PartyMapperHelper { ... }
```

### CDM Class Usage
The following CDM classes are used as the primary internal representation, based on the CDM Java API Pack and Rosetta functions:

- `cdm.event.common.Trade` (builder: `Trade$TradeBuilder`)
- `cdm.event.common.TradeState` (builder: `TradeState$TradeBuilder`)
- `cdm.product.template.NonTransferableProduct` (builder: `NonTransferableProduct$NonTransferableProductBuilder`)
- `cdm.product.template.EconomicTerms` (builder: `EconomicTerms$EconomicTermsBuilder`)
- `cdm.product.template.Payout` (builder: `Payout$PayoutBuilder`)
- `cdm.base.staticdata.party.Party` (builder: `Party$PartyBuilder`)
- `cdm.base.staticdata.party.Counterparty` (builder: `Counterparty$CounterpartyBuilder`)
- `cdm.base.staticdata.party.AncillaryParty` (builder: `AncillaryParty$AncillaryPartyBuilder`)
- `cdm.base.staticdata.identifier.TradeIdentifier` (builder: `TradeIdentifier$TradeIdentifierBuilder`)
- `cdm.observable.asset.PriceQuantity` (builder: `PriceQuantity$PriceQuantityBuilder`)
- `cdm.observable.asset.Observable` (builder: `Observable$ObservableBuilder`)
- `com.rosetta.model.metafields.FieldWithMetaDate` (builder: `FieldWithMetaDate$FieldWithMetaDateBuilder`)

**Forbidden Classes (as per cdm-java-negative-classes.md):**
The following classes are explicitly forbidden and must not be imported or referenced:
- `FpmlFxSingleLeg` (not in CDM Java)
- `cdm.base.math.PriceSchedule`
- `cdm.base.math.PriceTypeEnum`
- `cdm.base.staticdata.asset.Asset`
- `cdm.base.staticdata.asset.Cash`
- `cdm.base.staticdata.party.PartyReference`
- `cdm.observable.asset.ResolvablePriceQuantity` (substituted with `PriceQuantity`)
- `cdm.product.common.settlement.SettlementPayout` (restructured into `Payout` + `PriceQuantity` + `SettlementTerms`)
- `cdm.product.template.CashSettlementTerms`
- `cdm.product.template.SettlementTerms`
- `cdm.product.template.SettlementTypeEnum`
- `com.rosetta.model.lib.records.Date`
- `com.rosetta.model.metafields.MetaFields`

## Mapping Responsibilities

### 1. Trade Level Mapping
- **Mapping Function**: `MapFxSingleLegCounterpartyList`
- **Responsibility**: Extract counterparty information using `MapPayerReceiverModelToCounterpartyList`
- **Classes Used**: `Counterparty`, `Party`

### 2. Ancillary Party Mapping
- **Mapping Function**: `MapFxSingleLegAncillaryPartyList`
- **Responsibility**: Map additional parties beyond counterparts
- **Classes Used**: `AncillaryParty`

### 3. Non-Transferable Product Mapping
- **Mapping Function**: `MapFxSingleLegNonTransferableProduct`
- **Responsibility**: Create the main product container
- **Classes Used**: `NonTransferableProduct`, `ProductIdentifier`, `ProductTaxonomy`

### 4. Economic Terms Mapping
- **Mapping Function**: `MapFxSingleLegEconomicTerms`
- **Responsibility**: Create economic terms for the product
- **Classes Used**: `EconomicTerms`, `Payout`

### 5. Payout Mapping
- **Mapping Function**: `MapFxCoreDetailsModelToSettlementPayout`
- **Responsibility**: Create the payout details
- **Classes Used**:
  - **Substituted (due to missing `SettlementPayout`)**: `Payout` with inline `SettlementTerms`
  - **Substituted (due to missing `ResolvablePriceQuantity`)**: `PriceQuantity`
  - `Observable`

### 6. Price Quantity List Mapping
- **Mapping Function**: `MapFxSingleLegPriceQuantityList`
- **Responsibility**: Handle price and quantity details
- **Classes Used**: `PriceQuantity`

### 7. Party Reference Mapping
- **Mapping Function**: `MapFxSingleLegAccountPartyReference`
- **Responsibility**: Map to account party references
- **Classes Used**: `Party`, `Account`

## Test Coverage

Runtime supported fixtures will be tested:
- `fx-ex01-fx-spot.xml` - FX Spot
- `fx-ex02-spot-cross-w-side-rates.xml` - FX Spot with cross rate
- `fx-ex03-fx-fwd.xml` - FX Forward
- `fx-ex04-fx-fwd-w-settlement.xml` - FX Forward with Settlement
- `fx-ex05-fx-fwd-w-ssi.xml` - FX Forward with SSI
- `fx-ex06-fx-fwd-w-splits.xml` - FX Forward with Splits
- `fx-ex07-non-deliverable-forward.xml` - Non-Deliverable Forward

Each fixture will be validated against its expected CDM JSON output from the parallel processing task.

## Validation Gates

1. **Rosetta Preflight**: The CDM/Rosetta Java model classes must be available in the expected version (`org.finos.cdm:cdm-java:6.7.0`)
2. **CDM Class Availability**: All classes used in the mapping must exist in expected CDM version per `cdm-java-api-pack.md`
3. **Negative Class Exclusion**: Generated Java must not reference any class in `cdm-java-negative-classes.md`
4. **Implementation Scope**: Generated code must only handle FX single-leg derivative products (runtime fixtures)
5. **Runtime Validation**: All fixtures listed in runtimeFixtures must pass the runtime mapper generation and import paths.

## Unsupported Behavior

1. **Complex SettlementPayout and ResolvablePriceQuantity Handling**:
   - `cdm.product.common.settlement.SettlementPayout` and `cdm.observable.asset.ResolvablePriceQuantity` are not available in CDM Java API Pack.  
   - These classes will be **emulated** using `Payout` + `PriceQuantity` + `SettlementTerms` (to represent settlement semantics) and `PriceQuantity` respectively.

2. **STAX/DOM Parsing for FpML Input**:
   - The generated mapper will use a basic DOM/StAX parser approach to read XML input.  
   - Specific FpML structures (`FpmlFxSingleLeg`) are not modeled directly in CDM Java and are instead parsed as DTOs.

3. **Missing Date/MetaFields Handling**:
   - `com.rosetta.model.metafields.MetaFields` and `com.rosetta.model.lib.records.Date` are not available via standard API.  
   - The mapping will manage metadata and date fields manually where possible, or leverage external tools if needed.

## Traceability Requirements

Generated Java mapping code must:
1. **Call Rosetta Functions** from `rosetta-generation-context.md` to handle:
   - Counterparty mapping: `MapFxSingleLegCounterpartyList` and `MapPayerReceiverModelToCounterpartyList`
   - Ancillary mapping: `MapFxSingleLegAncillaryPartyList`
   - Product mapping: `MapFxSingleLegNonTransferableProduct`
   - Economic terms mapping: `MapFxSingleLegEconomicTerms` and `MapFxCoreDetailsModelToSettlementPayout`
2. **Use CDM API Classes** only, defined in `cdm-java-api-pack.md`
3. **Avoid Circular Dependencies** by using correct builders pattern and proper context passing
4. **Implement Traceability** by tagging each mapping step back to the corresponding Rosetta function for auditability

## Implementation Group Change Proposal

None. The current implementation group `fx-single-leg` is appropriate for this phase and aligns with the runtime fixtures and product scope requirements. The runtime fixtures are specifically FX single-leg products covering spot, forward, and NDFs, making this group the logical and exclusive focus of this run.