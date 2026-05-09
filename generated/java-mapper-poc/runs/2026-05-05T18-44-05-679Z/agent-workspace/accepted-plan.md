# Accepted Plan

Accepted in round 1.

This file is the implementation contract. It is synthesized from the product
scope, planner plan, critic review, critique resolution, and deterministic plan
validation. The full evidence packet path is referenced below for on-demand reads
via tools (for example get_context_packet); it is not inlined here to keep this
artifact small.

## Product Scope Contract

# Product Scope

Selected product family: fx-derivatives
Implementation strategy: staged-by-product-group
Default current implementation group: fx-single-leg
Candidate next groups: fx-swap, fx-simple-option

## Product Groups

- fx-single-leg: 7 fixture(s), good-first-target. Default starting group for staged FX-family generation.
- fx-swap: 1 fixture(s), candidate. Natural next FX group after single-leg handling.
- fx-simple-option: 3 fixture(s), candidate. Candidate after simpler linear FX products are stable.
- fx-digital-option: 6 fixture(s), later. Requires richer option handling and should follow simpler options.
- fx-barrier-option: 2 fixture(s), later. More complex option variant; later milestone.
- fx-average-rate-option: 2 fixture(s), later. More complex option variant; later milestone.
- fx-strategy: 2 fixture(s), later. Strategy wrappers need separate decomposition logic.
- non-fx: 2 fixture(s), exclude. Excluded from FX derivatives generation.

## Classified Fixtures

- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex01-fx-spot.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex02-spot-cross-w-side-rates.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex02-spot-cross-w-side-rates.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex03-fx-fwd.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex03-fx-fwd.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex04-fx-fwd-w-settlement.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex04-fx-fwd-w-settlement.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex05-fx-fwd-w-ssi.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex05-fx-fwd-w-ssi.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex06-fx-fwd-w-splits.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex06-fx-fwd-w-splits.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex07-non-deliverable-forward.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex07-non-deliverable-forward.json
- fx-swap: data_to_learn_from\fpml\fx-derivatives\fx-ex08-fx-swap.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex08-fx-swap.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex09-euro-opt.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex09-euro-opt.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex10-amer-opt.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex10-amer-opt.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex11-non-deliverable-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex11-non-deliverable-option.json
- fx-barrier-option: data_to_learn_from\fpml\fx-derivatives\fx-ex12-fx-barrier-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex12-fx-barrier-option.json
- fx-barrier-option: data_to_learn_from\fpml\fx-derivatives\fx-ex13-fx-dbl-barrier-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex13-fx-dbl-barrier-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex14-euro-digital-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex14-euro-digital-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex15-euro-range-digital-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex15-euro-range-digital-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex16-one-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex16-one-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex17-no-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex17-no-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex18-double-one-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex18-double-one-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex19-double-no-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex19-double-no-touch-option.json
- fx-average-rate-option: data_to_learn_from\fpml\fx-derivatives\fx-ex20-avg-rate-option-parametric.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex20-avg-rate-option-parametric.json
- fx-average-rate-option: data_to_learn_from\fpml\fx-derivatives\fx-ex21-avg-rate-option-specific.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex21-avg-rate-option-specific.json
- fx-strategy: data_to_learn_from\fpml\fx-derivatives\fx-ex22-straddle.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex22-straddle.json
- fx-strategy: data_to_learn_from\fpml\fx-derivatives\fx-ex23-delta-hedge.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex23-delta-hedge.json
- non-fx: data_to_learn_from\fpml\fx-derivatives\td-ex01-simple-term-deposit.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\td-ex01-simple-term-deposit.json
- non-fx: data_to_learn_from\fpml\fx-derivatives\td-ex02-term-deposit-w-settlement-etc.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\td-ex02-term-deposit-w-settlement-etc.json

## Rules

- Use this product map instead of discovering product types through broad search.
- Plan within the FX derivatives family.
- Do not add non-FX products to the current plan.
- Do not invent fixture paths, cookbook paths, or product roots.
- If changing the default implementation group, write an "Implementation Group Change Proposal".


## Deterministic Validation

# Plan Validation

Status: passed

## Blocking Issues

- none

## Warnings

- none

## Validation details

- Mode: structured-section
- Parsed in-scope groups: fx-single-leg
- Parsed out-of-scope groups: fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, non-fx
- Parsed runtime fixture ids: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward


## Planner Plan

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

## Critic Review

## Plan Review

### Blocking Issues

#### 1. Missing CDM Java classes used in Rosetta FX mapping logic

The plan references `ResolvablePriceQuantity`, `SettlementPayout`, `CashSettlementTerms`, `SettlementTerms`, `SettlementTypeEnum`, `PartyReference`, `PriceSchedule`, `PriceTypeEnum`, `Asset`, `Cash`, and `PartyReference`. While some of these are found in the jar (e.g., `cdm.product.common.settlement.ResolvablePriceQuantity`, `cdm.product.template.SettlementPayout`, `cdm.product.common.settlement.CashSettlementTerms`, `cdm.product.common.settlement.SettlementTerms`, `cdm.product.common.settlement.SettlementTypeEnum`, `cdm.observable.asset.PriceSchedule`, `cdm.base.staticdata.asset.common.Asset`, `cdm.base.staticdata.asset.common.Cash`), others are **missing**:

- `cdm.base.staticdata.party.PartyReference`: not present in `cdm-java-6.7.0.jar`.  
- `cdm.base.math.PriceSchedule`: not present in `cdm-java-6.7.0.jar`.  
- `cdm.base.math.PriceTypeEnum`: not present; only `cdm.observable.asset.PriceTypeEnum` exists.

The Rosetta function `MapFxCoreDetailsModelToSettlementPayout` references `ResolvablePriceQuantity`, but the available class is `cdm.product.common.settlement.ResolvablePriceQuantity`, and no equivalent in `cdm.base.math`. The Rosetta function uses the type as a nested object inside `SettlementPayout`, and while the plan correctly maps to `cdm.product.template.SettlementPayout`, Rosetta expects `SettlementPayout.SettlementPayout` containing `ResolvablePriceQuantity`. This may require additional internal handling or model generation.

#### 2. Unsupported raw JSON construction

The plan states:

> The generated Java will use Rosetta Java model objects as its internal representation.

This is acceptable **only if** it uses builder APIs (not raw JSON) to construct the CDM model. However, the plan does **not** explicitly forbid or prevent internal raw JSON construction (e.g., using Jackson to build JSON then deserialize), which is a violation of the policy requiring runtime-safe CDM model object usage.

#### 3. No explicit claim of using Rosetta functions for FX single-leg mapping

The plan describes mapping responsibilities but **does not explicitly cite** that the mapping logic is derived directly from Rosetta functions (e.g., `MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`) in the mapping design section. The plan *mentions* Rosetta functions in passing, but lacks a clear statement that the implementation will rely on them as the source of truth for Java mapping logic.

#### 4. FX product-group scope not fully supported by runtime fixtures

The plan states it is scoped to `fx-single-leg`, which is correct per `00-product-scope.json`, and correctly identifies the runtime fixtures. However, the plan includes a broad narrative description of FX single-leg products (e.g., “FX spot trades, FX forwards, non-deliverable forwards”) without any **fixture gate** or validation constraint to ensure only runtime-supported fixtures (`fx-ex01` through `fx-ex07`) are tested. This risks overreach into untested behavior (e.g., if future fixes introduce unsupported variants like FX swaps or digital options).

---

### Non-blocking Concerns

#### 1. Missing-class notes should be marked as "blocked for this run"

The plan’s “Missing Classes” section is informative but does not **block** those missing classes from the scope of this run. This should be reworded: if the Rosetta mapping logic for FX single-leg requires `PartyReference`, `PriceSchedule`, or `PriceTypeEnum`, and those are absent from the jar, then the mapping of those specific subfields must be deferred or stubbed, and the plan should acknowledge this limitation explicitly.

#### 2. Java package structure lacks evidence backing

The plan proposes `org.finos.cdm.fx.mapper.singleleg`, but does not provide evidence that this structure is required or recommended by Rosetta, CDM Java, or preflight. The CDM Java API uses builder patterns from deep namespaces (e.g., `cdm.event.common.Trade$TradeBuilder`), so the mapping service package hierarchy is not determined by CDM naming conventions.

#### 3. Test strategy is high-level

Unit tests for each Rosetta function “in isolation” is vague. The plan does not specify how mapping tests would be grounded in fixture data or assert CDM model object equality. Runtime tests are mentioned, but no mechanism (e.g., `assertEquals`, serialization round-trip) is proposed.

---

### Decision

**NEXT_ROUND_REQUIRED**

The plan must be revised to:

1. Explicitly cite Rosetta functions (e.g., `MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`) as the *source* for Java mapping logic.
2. Block use of raw JSON construction in internal CDM representation.
3. Acknowledge missing CDM classes (`PartyReference`, `PriceSchedule`, `PriceTypeEnum`) and either:
   - State how the mapping will be adjusted to avoid them (e.g., use alternative types or skip unsupported fields), or
   - Deferring those parts to a future phase with evidence.
4. Add a runtime fixture gate: “Only `fx-ex01` through `fx-ex07` are in scope; anything beyond must fail validation.”
5. Remove or re-word the “FX single-leg” narrative to align strictly with the fixture IDs in the machine-checked section.

Until these are addressed, the plan is not safe to execute.

Decision: NEXT_ROUND_REQUIRED

## Critique Resolution

# Critique Review Response and Decision

## Validated Critique Items

### ✅ Item 1: `cdm.base.staticdata.party.PartyReference` is missing  
**Status: VALID**  
Evidence: `get_cdm_java_class` confirms `cdm.base.staticdata.party.PartyReference` is not present in `cdm-java-6.7.0.jar`, and no same-simple-name candidate exists.  
**Action required**: Do not use `PartyReference`; rely on `Party` (which *is* available) for referenced party identification.

### ✅ Item 2: `cdm.base.math.PriceSchedule` is missing  
**Status: VALID**  
Evidence: `get_cdm_java_class` returns exact-class-not-found for `cdm.base.math.PriceSchedule`. Candidate `cdm.observable.asset.PriceSchedule` *is* available, but cannot be used interchangeably—different packages, different metadata semantics.  
**Action required**: Do not expect `PriceSchedule` from `cdm.base.math`. Use `cdm.observable.asset.PriceSchedule` only if its metadata constraints match fixture expectations.

### ✅ Item 3: `cdm.base.math.PriceTypeEnum` is missing  
**Status: VALID**  
Evidence: `get_cdm_java_class` returns exact-class-not-found for `cdm.base.math.PriceTypeEnum`. Candidate `cdm.observable.asset.PriceTypeEnum` exists but belongs to a different package and may not be assignment-compatible.  
**Action required**: Do not use `cdm.base.math.PriceTypeEnum`. Defer price-type-specific logic or use enum strings pending verification.

### ✅ Item 4: `cdm.observable.asset.ResolvablePriceQuantity` is missing  
**Status: VALID**, but a workable alternative exists  
Evidence: Exact class missing; available candidate is `cdm.product.common.settlement.ResolvablePriceQuantity`, confirmed present and with suitable builder support.  
**Action required**: Replace all references to `ResolvablePriceQuantity` in Rosetta function `MapFxCoreDetailsModelToSettlementPayout` with `cdm.product.common.settlement.ResolvablePriceQuantity`.

### ✅ Item 5: `cdm.product.template.SettlementPayout` is the correct replacement  
**Status: VALID**  
Evidence: `get_cdm_java_class` confirms `cdm.product.template.SettlementPayout` exists and *accepts* `cdm.product.common.settlement.ResolvablePriceQuantity` via `.setPriceQuantity(...)`.  
**Action required**: Use `cdm.product.template.SettlementPayout` as the root payout type, and embed `cdm.product.common.settlement.ResolvablePriceQuantity` where Rosetta references `SettlementPayout`.

### ✅ Item 6: `cdm.product.template.CashSettlementTerms` is missing  
**Status: VALID**, but available replacement  
Evidence: Exact class not found; candidate `cdm.product.common.settlement.CashSettlementTerms` exists and is complete (verified builder methods: `setValuationMethod`, `setValuationDate`, etc.).  
**Action required**: Use `cdm.product.common.settlement.CashSettlementTerms`.

### ✅ Item 7: `cdm.product.template.SettlementTerms` is missing  
**Status: VALID**, but available replacement  
Evidence: Exact class not found; candidate `cdm.product.common.settlement.SettlementTerms` exists and supports `CashSettlementTerms` and `settlementType: SettlementTypeEnum`.  
**Action required**: Use `cdm.product.common.settlement.SettlementTerms`.

### ✅ Item 8: `cdm.product.template.SettlementTypeEnum` is missing  
**Status: VALID**, but available replacement  
Evidence: Exact class not found; candidate `cdm.product.common.settlement.SettlementTypeEnum` exists (confirmed with `values()`, `valueOf()`, etc.).  
**Action required**: Use `cdm.product.common.settlement.SettlementTypeEnum`.

### ✅ Item 9: No explicit ban on raw JSON construction  
**Status: VALID**  
Plan does *not* explicitly forbid Jackson-based JSON construction as internal representation.  
**Action required**: Add a clause: “All internal processing must use CDM Java builders (`…$…Builder`), not intermediate JSON serialization/deserialization.”

### ✅ Item 10: Missing explicit Rosetta-function attribution  
**Status: VALID**  
Plan describes mapping *tasks* but does not explicitly assert: “All mapping logic is derived from and must exactly reproduce the semantics of Rosetta functions in `rosetta-generation-context.md`.”  
**Action required**: Add an explicit section: “Source of truth for mapping logic: Rosetta functions `MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`, and other functions in `rosetta-generation-context.md`.”

---

## Rejection of Critique Items

### ❌ Item: Java package structure needs evidence  
**Reason for rejection**: Package structure is design choice, not blocking dependency. CDM Java does not mandate `org.finos.cdm.fx.mapper`. This item is non-blocking and can be finalized during implementation.

### ❌ Item: Test strategy is vague  
**Reason for rejection**: Test design is out of scope for this planning round; only required that testability is ensured (e.g., by using public builder APIs). Vagueness is acceptable at planning stage.

### ❌ Item: “FX single-leg” narrative risks overreach  
**Reason for rejection**: The “machine-checked” section explicitly restricts scope to the 7 runtime fixture IDs. The narrative is explanatory only and does not override the machine-checked gate.

---

## Implementation Checklist (Revised)

Before execution, the planner must incorporate the following into the plan:

1. **Root type correction**:  
   - Use `cdm.product.template.SettlementPayout` as the top-level payout container (no change).  
   - Use `cdm.product.common.settlement.ResolvablePriceQuantity` for price/quantity fields inside `SettlementPayout`.

2. **Settlement types**:  
   - Replace `cdm.product.template.SettlementTypeEnum`, `SettlementTerms`, `CashSettlementTerms` with their `cdm.product.common.settlement.*` equivalents.

3. **Missing fields**:  
   - `PartyReference`, `cdm.base.math.PriceSchedule`, `cdm.base.math.PriceTypeEnum` are **not used**.  
   - Where Rosetta references these, map to `Party`, `String`, or omit.

4. **Construction policy**:  
   - All mapping logic must construct objects exclusively via CDM Java builders (`Foo$FooBuilder`), *not* via JSON serialization/deserialization.

5. **Rosetta-function attribution**:  
   - Add an explicit section:  
     > “This implementation strictly follows the Rosetta function semantics documented in `rosetta-generation-context.md`. Each mapping step corresponds to a Rosetta function definition; where Rosetta is silent or ambiguous, builder APIs are used, but only if they preserve the semantic intent of the Rosetta function.”

6. **Fixture gate**:  
   - Keep the existing machine-checked list of runtime fixture IDs, and add:  
     > “Any fixture not in the above machine-checked list will cause a validation failure; no extended FX single-leg variants are supported in this run.”

---

## Decision: ACCEPTED

The plan, once revised per the Implementation Checklist above, is safe to execute.

**Required conditions before execution**:
- All CDM class names updated to use available `cdm.product.common.settlement.*` types where `cdm.product.template.*` was referenced.
- `PartyReference`, `cdm.base.math.PriceSchedule`, `cdm.base.math.PriceTypeEnum` removed from implementation plan.
- JSON construction policy explicitly banned.
- Rosetta functions cited as the sole source of mapping semantics.
- Fixture IDs strictly limited to the 7 runtime-supported IDs.

No further rounds are needed for wording, citation, or clarification issues once these conditions are met.

✅ **Ready for implementation** (planner’s next revision must apply the checklist).

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-05T18-44-05-679Z\agent-workspace\evidence-packet.md
```

Use evidence-index.md and get_context_packet when implementer or repair roles need detail; do not assume this file repeats evidence content.
