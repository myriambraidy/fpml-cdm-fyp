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

# FX Derivatives Java Mapper Implementation Plan

This document outlines an AI-native implementation plan for generating a Java mapper targeting the FX derivatives product family, specifically focusing on FX single-leg products.

## Overview

The goal is to design a generated Java application that converts FpML trade representations of FX single-leg derivatives into CDM (Common Data Model) representations.
The generated Java will use Rosetta Java model objects as its internal representation, adhering to the CDM Java classes verified for availability.

## Product Scope

This run is scoped to the `fx-single-leg` product group, which includes:

- FX spot trades
- FX forwards (including various settlement scenarios)
- Non-deliverable forwards

The fixtures included in this scope are:
- `fx-ex01-fx-spot`
- `fx-ex02-spot-cross-w-side-rates`
- `fx-ex03-fx-fwd`
- `fx-ex04-fx-fwd-w-settlement`
- `fx-ex05-fx-fwd-w-ssi`
- `fx-ex06-fx-fwd-w-splits`
- `fx-ex07-non-deliverable-forward`

All these are FX single-leg products.

## CDM Java Model Object Plan

The following CDM Java classes are required for this implementation, confirmed as available.

### Root Classes

- `Trade` from `cdm.event.common` (used to hold the final mapped trade)
- `TradeState` from `cdm.event.common` (used if state tracking is part of mapping)

### Core CDM Objects for Mapping

- `NonTransferableProduct` from `cdm.product.template` (core product container)
- `EconomicTerms` from `cdm.product.template` (economic details)
- `Payout` from `cdm.product.template` (Payout details)
- `SettlementPayout` from `cdm.product.template` (Payout with settlement details)

### Supporting CDM Objects

Each of the following is a required component object for mapping:

- `Counterparty` from `cdm.base.staticdata.party` (Counterparty model)
- `Party` from `cdm.base.staticdata.party` (Party identification)
- `CounterpartyRoleEnum` from `cdm.base.staticdata.party` (Role identifiers)
- `AncillaryParty` from `cdm.base.staticdata.party` (Ancillary parties)
- `ProductIdentifier` from `cdm.base.staticdata.asset.common` (Product identifiers)
- `ProductTaxonomy` from `cdm.base.staticdata.asset.common` (Product taxonomy)
- `Identifier` from `cdm.base.staticdata.identifier` (Generic identifier)
- `AssignedIdentifier` from `cdm.base.staticdata.identifier` (Assigned identifier)
- `PriceQuantity` from `cdm.observable.asset` (Quantity and price schedule)
- `Observable` from `cdm.observable.asset` (Underlier observable)
- `NonNegativeQuantitySchedule` from `cdm.base.math` (Quantity schedule)
- `NonNegativeQuantity` from `cdm.base.math` (Single quantity)
- `UnitType` from `cdm.base.math` (Unit of measure)
- `FieldWithMetaDate` from `com.rosetta.model.metafields` (Date with metadata)

### Missing Classes (Note for Reference)

The following CDM Java classes from the Rosetta functions in `rosetta-generation-context` are noted to be **missing from the model jar** (`cdm-java-6.7.0.jar`) but are needed for building the corresponding object types in the CDM Java model. These are likely present in the CDM model in a broader context but were not in the local jar.

- `cdm.observable.asset.ResolvablePriceQuantity` (Required for some price-quantity structures)
- `cdm.product.common.settlement.SettlementPayout` (Required for SettlementPayout mapping; alternative `cdm.product.template.SettlementPayout` is available, but not verified for this exact Rosetta usage)
- `cdm.product.template.CashSettlementTerms` (Required for cash settlement mappings)
- `cdm.product.template.SettlementTerms` (Required for settlement terms)
- `cdm.product.template.SettlementTypeEnum` (Required for settlement type)
- `cdm.base.math.PriceSchedule` (Used for pricing)
- `cdm.base.math.PriceTypeEnum` (Price type identifier)
- `cdm.base.staticdata.asset.Asset` (Asset specification)
- `cdm.base.staticdata.asset.Cash` (Cash details, used for mapping)
- `cdm.base.staticdata.party.PartyReference` (Reference to Party, possibly used as meta)

This plan assumes that `cdm.product.template.SettlementPayout` can be used directly, despite the Rosetta mapping referencing a `cdm.product.common.settlement.SettlementPayout` in the Rosetta function context. We will implement it using `cdm.product.template.SettlementPayout`. Other missing classes that are critical for full functionality (especially related to price schedule mapping, settlement terms, and cash settlement) will be noted as potential extensions in future phases.

For this run, only the available classes are used within the mapped implementation.

## Java Package Design

All generated code will reside in the `org.finos.cdm.fx` package structure.

The primary structure should allow the mapping to be performed using a core `FxMapper` service.

### Key Java Packages

- `org.finos.cdm.fx.mapper` (Main mapping services)
- `org.finos.cdm.fx.mapper.singleleg` (FX single-leg specific mapping logic)

## Mapping Responsibilities for FX Single-Leg

We derive the mapping classes from the Rosetta functions defined in `rosetta-generation-context.md`, which are authoritative for this FX product family and the current product group.

### Core Mapping Tasks

1. **Trade Creation**
   - Create `Trade` and `TradeState` roots
   - Populate the trade identifier with values from the FpML trade

2. **Party Mapping**
   - Map `Counterparty` objects using `MapFxSingleLegCounterpartyList`
   - Map `AncillaryParty` objects using `MapFxSingleLegAncillaryPartyList`

3. **Product Modeling**
   - Create `NonTransferableProduct` using `MapFxSingleLegNonTransferableProduct`
   - Map taxonomy (product classification) using `MapProductTaxonomyList`
   - Map identifiers (product id) using `MapProductIdentifierList`

4. **Economic Terms**
   - Populate the `EconomicTerms` using `MapFxSingleLegEconomicTerms`
   - Build the `Payout` structure (using `SettlementPayout` as base) via `MapFxCoreDetailsModelToSettlementPayout`

5. **Price and Quantity**
   - Map `PriceQuantity` lists using `MapFxSingleLegPriceQuantityList`
   - Use `MapFxCoreDetailsModelPriceListWithLocation`, `MapFxCoreDetailsModelQuantityListWithLocation`, etc. for mapping of underlying structures

6. **Payer/Receiver and Account Party Referencing**
   - Build `Party` reference using `MapPayerReceiverToAccountPartyReference` (if needed) via `MapFxSingleLegAccountPartyReference`

## Traceability and Validation

### Validation Gates

1. **Unit Tests**
   - Create unit tests for each Rosetta function in isolation, using the `fx-exXX-*` fixtures as the test input.
   - Use `Trade` builder with populated required fields to validate complete mappings.

2. **Runtime Tests**
   - Execute tests against `runtimeFixtures` to validate correct transformation
   - Ensure that all generated trade output objects conform to the specified CDM interface.
   - Test that the resulting `Trade` and `TradeState` are serializable to JSON correctly.

### Unsupported Behavior

- **Non-FX Products:** Any fixtures that have been classified into non-FX groups (e.g., `non-fx`, `fx-swap`, `fx-simple-option`, etc.) are not part of this scope and will generate an error if attempted.
- **Missing CDM Classes:** As noted in "Missing Classes", this run will defer support for missing classes due to limitations in the CDM Java model jar for this run's context.
- **Complex Derivatives:** Features like FX swaps, options, and digital options are out of scope for this phase but noted for future consideration.
- **Unsupported CDM Features:** All mappings will be strictly based on CDM classes confirmed available and the mapping logic derived from Rosetta. Any feature in CDM not covered by Rosetta functions in this context is excluded.

## Test Requirements

- For `fx-ex01-fx-spot` through `fx-ex07-non-deliverable-forward`, map into corresponding `cdm.event.common.Trade` objects
- Each `Trade` must contain the correct:
  - `TradeIdentifier`
  - `Party` (counterparties)
  - `ContractDetails` (`NonTransferableProduct`, etc.)
- Validate all `EconomicTerms` and `Payout` structures against the fixture mappings

## Implementation Group Change Proposal

None required. The default implementation group `fx-single-leg` is appropriate and correct for this phase of development.