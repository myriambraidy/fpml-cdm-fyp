# Accepted Plan

Accepted in round 1.

This file is the implementation contract. It is synthesized from the product
scope, evidence packet, planner plan, critic review, critique resolution, and
deterministic plan validation.

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


## Planner Plan

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

## Critic Review

# Plan Review

## Correctness

### ✅ Correct mapping of in-scope groups
The plan correctly identifies `fx-single-leg` as the only in-scope implementation group, which matches `00-product-scope.json`'s `currentImplementationGroup`. The 7 fixtures in that group are correctly represented.

### ✅ Out-of-scope groups correctly excluded
The plan correctly excludes all other FX product groups: fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, and non-fx.

### ✅ Structure matches spec
The plan contains the required `## Implementation scope (machine-checked)` section with bullet items matching `productGroups[].group` slugs from `00-product-scope.json`. It includes `currentImplementationGroup: fx-single-leg`.

## Missing Mappings

No evidence suggests critical mappings are missing for fx-single-leg fixtures.

## Overreach

**No overreach in scope.** The plan is appropriately constrained to fx-single-leg.

However, the plan makes assumptions about future mappers (FxSwapMapper, FxOptionMapper) that are out of scope for this run. This is acceptable architectural foresight but could be clearer as “placeholders for future phases”.

## Weak Tests

No test details were provided beyond high-level categories (unit, integration, validation, edge case, party resolution). The plan lacks:

- Specific test assertions (e.g., “fx-ex01: valueDate maps to settlementDate.valueDate”)
- Evidence-backed assertions (no cookbook rule IDs referenced in test cases)
- CDM path assertions derived from expected CDM summaries (e.g., `$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate`)

## Unsupported Cases

The plan correctly states it does not support:
- FX Swap (fx-ex08-fx-swap.xml)
- FX Options (fx-ex09-euro-opt.xml, fx-ex10-amer-opt.xml, fx-ex11-non-deliverable-option.xml)
- Digital, barrier, average-rate options
- Strategies (fx-ex22, fx-ex23)
- Non-FX (term deposits)

This aligns with the staged-by-product-group strategy.

## Evidence/Runtime Support Confusion

The plan does not confuse evidence with runtime support. It correctly references cookbook rules and expected CDM structure without asserting LLM-based runtime behavior.

## Runtime/Agent-Runtime Confusion

The plan does not introduce LLM runtime calls or agent-runtime coupling. It specifies a Maven project that produces a deterministic Java mapper—consistent with “must not call an LLM and must not read this agent workspace”.

## Decision

**Decision: ACCEPTED**

## Critique Resolution

# ✅ Critique Review: ACCEPTED

All critique items are valid. The planner plan meets all safety, correctness, and scope constraints.

## Valid Critique Items (Accepted)

| Item | Valid? | Reason |
|------|--------|--------|
| ✅ Correct mapping of in-scope groups | ✔️ | `fx-single-leg` matches `currentImplementationGroup` in `00-product-scope.json`; all 7 fixtures correctly listed |
| ✅ Out-of-scope groups correctly excluded | ✔️ | All remaining product groups are explicitly listed as out of scope |
| ✅ Structure matches spec | ✔️ | `## Implementation scope (machine-checked)` section is present with correct bullet slugs |
| ✅ No critical mappings missing for fx-single-leg | ✔️ | Evidence from `evidence-packet.md` confirms 7 fixtures are representative of fx-single-leg; cookbook rules cover the required mappings |
| ✅ No overreach in scope | ✔️ | Plan is appropriately constrained to staged implementation of fx-single-leg only |
| ⚠️ Future mappers (FxSwapMapper, FxOptionMapper) labeled but not implemented | ✔️ | Acceptable architectural foresight; clearly noted as placeholders for future phases |
| ⚠️ Test details lack specificity (CDM paths, rule IDs) | ✔️ | Identified as improvement, not blocker; implementer will derive test assertions from cookbook and expected CDM summaries |
| ✅ Unsupported cases correctly excluded | ✔️ | Plan explicitly excludes fx-swap, options, strategies, and non-FX products |
| ✅ No confusion of evidence vs. runtime behavior | ✔️ | References cookbook rules correctly and specifies deterministic Java implementation |
| ✅ No LLM or agent-runtime coupling | ✔️ | Maven project with deterministic mapping—complies with requirement “must not call an LLM and must not read this agent workspace” |

## Revised Implementation Checklist

### Planning & Design
- [ ] Finalize Maven `pom.xml`: `groupId=com.fpml.cdm`, `artifactId=fx-mapper`, Java 17
- [ ] Package structure:
  - `com.fpml.cdm.fx`
    - `FxMapper` (main entry point)
    - `FxSingleLegMapper` (primary mapper)
    - `FxSwapMapper` (stub for future)
    - `FxOptionMapper` (stub for future)
    - `FxConverter` (shared utilities)
- [ ] Add dependency: `org.jdom2:jdom2` for XML parsing (or equivalent)
- [ ] Add dependency: `com.fasterxml.jackson.core:jackson-databind` for JSON output

### Core Mapping Implementation (fx-single-leg only)
- [ ] Implement `FxSingleLegMapper.map()` to convert FpML `fxSingleLeg` → CDM JSON
- [ ] Apply cookbook rules:
  - `fx-derivatives:RULE-001`: `tradeId` → `tradeIdentifier.assignedIdentifier.identifier.value`
  - `fx-derivatives:RULE-002`: trade date → `tradeDate.value` (strip trailing `Z`)
  - `fx-derivatives:RULE-005`: payment amounts → `tradeLot.quantity` (value + currency)
  - `fx-derivatives:TR-001`: party hrefs → CDM party objects and roles
  - `fx-derivatives:TR-002`: date normalization (trim `Z`)
- [ ] Special handling:
  - `nonDeliverableForward` section → CDM cash settlement + fixing
  - `sideRates` → include in `priceQuantity.price.composite` if present
  - `splitSettlement` → map to CDM `settlementInstruction` sub-lists

### Tests
- [ ] 7 JUnit tests (`fx-ex01` through `fx-ex07`) that:
  - Load FpML XML fixture
  - Call `FxSingleLegMapper.map()`
  - Assert against expected CDM JSON (using JSONAssert or equivalent)
  - Include checks on:
    - `tradeIdentifier`, `tradeDate`, `party` roles
    - `priceQuantity.quantity`, `price`, `unit`, `perUnitOf`
    - `settlementDate.valueDate`, `settlementCurrency`
    - `exerciseTerms.expirationDate.adjustedDate.value` (for NDF fixing)
- [ ] Add test assertions referencing cookbook rule IDs (e.g., assert `RULE-001` compliance)
- [ ] Add CDM path assertions (e.g., `$.trade.tradeDate.value`, `$.trade.counterparty[0].role`)

### Validation Gates
- [ ] Run static analysis: CheckStyle/SpotBugs with baseline rules
- [ ] Enforce ≥80% line coverage (focus on `FxSingleLegMapper`)
- [ ] Performance tests: <100ms per fixture, <50MB heap for 7-test batch

### Deliverables
- [ ] `src/main/java/com/fpml/cdm/fx/FxMapper.java`
- [ ] `src/main/java/com/fpml/cdm/fx/FxSingleLegMapper.java`
- [ ] `src/test/resources/fpml/*.xml` (7 fixtures)
- [ ] `src/test/resources/expected-cdm/*.json` (7 expected CDM outputs)
- [ ] `src/test/java/com/fpml/cdm/fx/FxMapperTest.java`

---

**Decision: ACCEPTED**

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-02T16-15-31-297Z\agent-workspace\evidence-packet.md
```

Evidence packet excerpt:

# Evidence Packet

Generated: 2026-05-02T16:15:31.338Z

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


## Fixture Summaries

### data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml

```text
/FpML/header/conversationId = FX987
/FpML/header/messageId = FX456a789b
/FpML/header/sentBy = MATCHSRV
/FpML/header/sendTo = CITIUS
/FpML/header/creationTimestamp = 2001-10-01T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI123
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = BARC987
/FpML/trade/tradeHeader/tradeDate = 2001-10-23Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = GBP
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 14800000
/FpML/trade/fxSingleLeg/valueDate = 2001-10-25Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 1.48
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = BARCGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex02-spot-cross-w-side-rates.xml

```text
/FpML/header/conversationId = FX987
/FpML/header/messageId = FX456a789b
/FpML/header/sentBy = PARTYAUS
/FpML/header/sendTo = MATCHSRV
/FpML/header/creationTimestamp = 2001-10-23T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = PARTYA345
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = CSFB9842
/FpML/trade/tradeHeader/tradeDate = 2001-10-23Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSi
