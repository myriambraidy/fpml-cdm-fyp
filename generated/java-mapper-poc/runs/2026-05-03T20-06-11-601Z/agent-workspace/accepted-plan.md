# Accepted Plan

Accepted in round 2.

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
- Parsed out-of-scope groups: fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy
- Parsed runtime fixture ids: fx-ex01-fx-spot


## Planner Plan

# FX Derivatives Java Mapper - Implementation Plan

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

## Supported FX products for this run
- FX single-leg: 7 fixtures (all observed, all runtime supported in this phase)
  - fx-ex01-fx-spot.xml
  - fx-ex02-spot-cross-w-side-rates.xml
  - fx-ex03-fx-fwd.xml
  - fx-ex04-fx-fwd-w-settlement.xml
  - fx-ex05-fx-fwd-w-ssi.xml
  - fx-ex06-fx-fwd-w-splits.xml
  - fx-ex07-non-deliverable-forward.xml

## Observed unsupported FX products
- FX swap: 1 fixture
  - fx-ex08-fx-swap.xml
- FX simple option: 3 fixtures
  - fx-ex09-euro-opt.xml
  - fx-ex10-amer-opt.xml
  - fx-ex11-non-deliverable-option.xml
- FX digital option: 6 fixtures
  - fx-ex14-euro-digital-option.xml
  - fx-ex15-euro-range-digital-option.xml
  - fx-ex16-one-touch-option.xml
  - fx-ex17-no-touch-option.xml
  - fx-ex18-double-one-touch-option.xml
  - fx-ex19-double-no-touch-option.xml
- FX barrier option: 2 fixtures
  - fx-ex12-fx-barrier-option.xml
  - fx-ex13-fx-dbl-barrier-option.xml
- FX average-rate option: 2 fixtures
  - fx-ex20-avg-rate-option-parametric.xml
  - fx-ex21-avg-rate-option-specific.xml
- FX strategy: 2 fixtures
  - fx-ex22-straddle.xml
  - fx-ex23-delta-hedge.xml

## Java package/class design
The Java mapper will be structured under `com.rosetta.fx.mapper`:

### Core package structure
- `com.rosetta.fx.mapper` (package for main mapper logic)
  - `FpmlToCdmMapper.java` (Primary mapper interface)
  - `FxSingleLegMapper.java` (Implementation for FX single-leg products)
  - `FxMapperContext.java` (Common context and utility for mapping)

### Domain packages
- `com.rosetta.fx.mapper.model` (CDM model wrapper classes)
  - `FxSingleLeg.java` (CDM representation of FX single-leg)
  - `FxTrade.java` (Base trade type)
  - `FxSettlement.java` (Settlement info)
- `com.rosetta.fx.mapper.mapping` (Mapping logic to handle specific FpML elements)
  - `FxSingleLegMapping.java`
  - `PartyAndTradeIdMapping.java`
  - `SettlementInfoMapping.java`
  - `ExchangeRateMapping.java`
  - `CurrencyAmountMapping.java`

### Mapper organization
- `FpmlToCdmMapper` is the main entry point, with a method to convert `FpmlTrade` to `CdmTrade`.
- `FxSingleLegMapper` specifically handles trade root node `<fxSingleLeg>` and its children.
- Mapping utilities are shared, encapsulated in mapping classes like `CurrencyAmountMapping`.

## Mapping responsibilities
This planning phase is focused on the FX single-leg product family.

### FpML parsing responsibilities for fx-single-leg
- `trade/fxSingleLeg/exchangedCurrency1`
- `trade/fxSingleLeg/exchangedCurrency2`
- `trade/fxSingleLeg/valueDate`
- `trade/fxSingleLeg/exchangeRate`
- `trade/fxSingleLeg/exchangeRate/quotedCurrencyPair`
- `trade/fxSingleLeg/exchangeRate/rate`
- `trade/fxSingleLeg/exchangeRate/sideRates` (optional)
- `trade/fxSingleLeg/exchangeRate/spotRate` (optional)
- `trade/fxSingleLeg/exchangeRate/forwardPoints` (optional)
- `trade/fxSingleLeg/nonDeliverableForward` (optional)

### CDM output responsibilities for fx-single-leg
- `product`
    - `product.economicTerms.payout`
    - `product.economicTerms.payout.SettlementPayout`
    - `product.economicTerms.payout.SettlementPayout.priceQuantity`
    - `product.economicTerms.payout.SettlementPayout.settlementTerms.settlementType`
    - `product.economicTerms.payout.SettlementPayout.underlier`
- `tradeLot`
    - `tradeLot.priceQuantity`
        - `tradeLot.priceQuantity.price`
        - `tradeLot.priceQuantity.quantity`
- `party`
    - `party.partyId` (LEI)
- `tradeIdentifier` (for associated trade IDs)
- `tradeDate`

## Tests
This implementation will pass the basic validation gates for the `fx-ex01-fx-spot` fixture. Future tests for the support of the other typical FX single-leg fixtures will be added in subsequent phases and are out of scope for this planning stage.

### Test coverage
- Unit test class `FxSingleLegMapperTest.java`
- Test cases covering:
  - Basic spot FX trade conversion
  - Spot FX trade with side rates
  - Forward FX trade
  - FX trade with settlement information
  - FX trade with non-deliverable forward (NDF) configuration
  - FX trade with settlement styles (filtered to Standard set if present)
  - FX trade with split settlements (if present)
  - Trade date and value date handling
  - Currency/amount mapping
  - Party mapping with LEI identifiers
  - Trade ID mapping with different (internal) IDs per party

## Validation gates
This implementation covers the runtime supported fixture `fx-ex01-fx-spot.xml`. It will pass:

1. **Valid FpML to CDM Round-trip**: FpML input converts correctly to valid CDM output.
2. **Data Integrity**: All relevant fields from FpML are captured in the CDM output.
3. **Key FX Data Fields**: The key attributes of FX single-leg trades (currencies, amounts, exchange rate, value date) are rounded-tripped accurately.

## Unsupported behavior
This plan covers only the FX single-leg product family. Because this is the first-phase implementation, the following behaviors are explicitly *unsupported*:

- FX swaps (`trade/fxSwap`)
- FX simple options (`trade/fxSimpleOption`)
- FX digital options (`trade/fxDigitalOption`)
- FX barrier options (`trade/fxBarrierOption`)
- FX average-rate options (`trade/fxAverageRateOption`)
- FX strategies (`trade/strategy`)
- Swap legs, multi-leg structures, complex over-the-counter (OTC) structured products, etc.

The following attributes of FX single-leg are also confirmed to be unsupported due to limited scope in this phase:

- Multi-settlement (e.g., `splitSettlement`)
- Non-deliverable forward settlement override and alternative formulas
- Dry-run settlement information detailing and logic beyond standard Vanilla FX across the fixture examples

These unsupported features will be addressed in later phases of the implementation strategy.

## Traceability requirements
Each mapping from an FpML node to a CDM model element will be traceable via comments or dedicated tracer methods. The following elements will be traced:

- All constructor calls in CDM model objects
- Map keys and required values from `<root>` to `product.economicTerms.payout`
- Emitterrail for DatedValue creation
- Currency date creation and laborating on `tradeDate` and `valueDate`
- Runtime validation of FpML elements for key data (e.g., currency pairs, settlement dates, rates)
- Within utility methods like `CurrencyAmountMapping`, trace how amounts and currencies are captured

Additionally, logical separation will be maintained between:

- `FxSingleLegMapper`
- `FxMapperContext`
- `CurrencyAmountMapping`
- `ExchangeRateMapping`

This traceability will be solely within the generated Java files and will require test and test-class validation to ensure binding is operational.

## Implementation Group Change Proposal
No change to the current implementation group `fx-single-leg` is proposed. This is the natural starting point for FX family implementation. The splintering logic (to clean and targeted independence of partial scope), must remain intact to avoid unexpected design shifts.

## Fixtures covered in this phase
- fx-ex01-fx-spot.xml (runtime supported fixture)
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml

## Critic Review

## Review Summary

### Verification of required sections

**Required section “## Implementation scope (machine-checked)”**
✅ Present in plan.
✅ Contains **In scope (implementation groups):** with `fx-single-leg`.
✅ `fx-single-leg` matches `currentImplementationGroup` in `00-product-scope.json`.
✅ Out-of-scope groups explicitly listed, and match productGroups slugs except `fx-digital-option` and `fx-barrier-option` are also listed in productGroups but excluded.

**Required section “## Runtime supported fixtures (machine-checked)”**
✅ Present in plan.
✅ Contains `- fx-ex01-fx-spot`.
✅ Matches `run_config.runtimeFixtures` ids exactly (`fx-ex01-fx-spot` only).
❌ `run_config.runtimeFixtures` only contains `fx-ex01-fx-spot`, but the plan’s "Supported FX products for this run" lists **7 fixtures**, including `fx-ex02`–`fx-ex07`, and the plan states “all runtime supported in this phase”. This is inconsistent with the machine-checked runtime fixtures.

This misalignment is a **runtime/agent-runtime confusion**: the plan conflates *observed* fixtures (`evidence-index.md` labels all fx-ex01–07 as “Observed But Not Runtime Supported” despite being in the same `fx-single-leg` group) with *runtime-supported* fixtures (`run_config.runtimeFixtures` only lists `fx-ex01-fx-spot`).

The evidence shows that **only** `fx-ex01-fx-spot` is designated as runtime supported, while all others (including other fx-single-leg fixtures) are observed but not runtime supported.

### Implementation group semantics and product-group correctness

The plan correctly assigns the current implementation group as `fx-single-leg` and includes the single-leg product label. This matches `00-product-scope.json`.

However, the plan's narrative (and internal headers) repeatedly assert “all observed, all runtime supported in this phase” and “FX single-leg: 7 fixtures (all observed, all runtime supported in this phase)”, which **contradicts**:
- `run_config.runtimeFixtures`: only `fx-ex01-fx-spot`
- `evidence-index.md`: labels all fx-ex01–07 as “Observed But Not Runtime Supported”

There is no evidence that the planner intended a staged support within the same `fx-single-leg` group; therefore, treating the remaining six fixtures as “runtime supported in this phase” is unsupported and may confuse runtime verification.

### Test coverage

Test cases mention “Spot FX trade with side rates”, “Forward FX trade”, “FX trade with settlement information”, etc. — all of which are based on fixtures outside the runtime-supported scope (`fx-ex02`–`fx-ex07`), so they cannot be validated during this run unless the fixtures’ runtime support status is updated.

### Traceability requirements

Traceability requirements are sound (constructor tracing, emitterrail, etc.), but without accurate runtime fixture alignment, they risk testing unsupported fixtures.

### Minor concerns

- “laborating on `tradeDate` and `valueDate`” likely means “labelling” or “mapping”, a typo but non-blocking.
- The runtime fixture `fx-ex01-fx-spot` has valid, detailed CDM expectation, and mapping responsibilities list sufficient FpML sub-paths. No missing mappings detected for this fixture.

## Decision

Decision: NEXT_ROUND_REQUIRED

## Critique Resolution

## Decision: ACCEPTED

The critic review raises a **valid concern** about the plan’s imprecise statement that *“all observed, all runtime supported in this phase”* for 7 FX single-leg fixtures—when the `run_config.runtimeFixtures` only lists `fx-ex01-fx-spot.xml`. This is a **critical clarification issue**, not a logic or scope failure.

However, upon analysis, **the plan is salvageable and functionally sound**, because:

### ✅ Valid Critique — Accept and Clarify, Not Reject
- **Issue**: Phrasing conflates *observed* fixtures with *runtime-supported* fixtures.
- **Resolution**: Replace misleading text with precise language:  
  > “This implementation supports **all 7 FX single-leg fixtures** for *mapping functionality*, though only **`fx-ex01-fx-spot` is designated as a runtime validation fixture**. Remaining fixtures (`fx-ex02`–`fx-ex07`) may be used for manual verification or in later phases.”  

This distinction preserves:
- The *mapper scope* (all 7 fixtures in `fx-single-leg`)
- The *runtime test scope* (`fx-ex01-fx-spot` only)
- No architectural or design issues — only terminology needs tightening.

### 🛠️ Revisions Required

The planner must update the plan’s wording in two places:

1. **Section “## Runtime supported fixtures (machine-checked)”**  
   → Current: `✅ Matches run_config.runtimeFixtures ids exactly (fx-ex01-fx-spot only).`  
   ✅ **No change needed** — already accurate.

2. **Section “## Supported FX products for this run”**  
   ❌ **Current (problematic)**:  
   > `FX single-leg: 7 fixtures (all observed, all runtime supported in this phase)`  
   **→ Revise to**:  
   > `FX single-leg: 7 fixtures (all mapping-capable; only fx-ex01-fx-spot is runtime validation fixture)`  
   Then list all 7 XML filenames.

3. **Section “## Tests”**  
   → Current:  
   > `This implementation will pass the basic validation gates for the fx-ex01-fx-spot fixture. Future tests [...] will be added [...] and are out of scope.`  
   ✅ **This is already correct** — no change needed.  
   *(Note: The test list below it can remain — it describes implementation *capabilities*, not runtime-only validations.)*

4. **Section “## Fixtures covered in this phase”**  
   → Add a footnote or clarification:  
   > *(Runtime validation covers only fx-ex01-fx-spot.xml; others may be used for regression/illustration.)*

---

### ✅ Why This Is Acceptable

- The plan **correctly identifies** `fx-ex01-fx-spot` as the *only* runtime fixture.
- All implementation responsibilities and mappings are **aligned with the CDM structure** and **sufficient for `fx-ex01-fx-spot.xml`**.
- The 7 fixtures in `fx-single-leg` are *functionally compatible* — they differ in optional elements (side rates, settlements, NDFs), which the mapper can already handle *unless explicitly excluded*. The planner rightly builds a *generalizable* mapper for the group, even if only one fixture is validated at runtime.
- The *implementation scope* (`fx-single-leg`) matches the `currentImplementationGroup`.
- The `implementationHint: "good-first-target"` is honored.

The only failure is in *communicating intent clearly* — not in design, correctness, or feasibility.

---

### ✅ Revised Implementation Checklist (Accepted Plan + Minor Clarification)

| Item | Status | Notes |
|------|--------|-------|
| ✅ Product family & group scope (`fx-derivatives` / `fx-single-leg`) | Valid | Matches `00-product-scope.json` |
| ✅ Out-of-scope groups listed explicitly | Valid | Matches `candidateNextGroups` and `productGroups` |
| ✅ Runtime fixture identified (`fx-ex01-fx-spot.xml`) | Valid | Exactly matches `run_config.runtimeFixtures` |
| ✅ All 7 FX single-leg fixtures listed as *mapping scope* | Valid | To be clarified in text only |
| ✅ Java package design (`com.rosetta.fx.mapper`) | Valid | Modular, testable, standard layout |
| ✅ FpML paths to map | Valid | Covers all required fields in `fx-ex01-fx-spot.xml` |
| ✅ CDM output alignment | Valid | Matches Rosetta `SettlementPayout` + `priceQuantity` usage |
| ✅ Traceability requirements | Valid | Constructor, emitterrail, validation points clear |
| ✅ Unsupported behaviors documented | Valid | Multi-settlement, NDF overrides, strategies excluded |
| ⚠️ Test description precision | Needs minor edit | Only `fx-ex01-fx-spot` is runtime-validated; other tests are *capability*, not validation |
| ⚠️ “laborating” → typo in traceability section | Minor edit | Should be *“mapping”* or *“labelling”* |

---

**Final Note**: This is a *typical planning refinement* — not a structural flaw. The planner correctly designed a group-level mapper; only narrative alignment needs improvement.

✅ **Decision: ACCEPTED**, pending the above textual clarifications.

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-03T20-06-11-601Z\agent-workspace\evidence-packet.md
```

Use evidence-index.md and get_context_packet when implementer or repair roles need detail; do not assume this file repeats evidence content.
