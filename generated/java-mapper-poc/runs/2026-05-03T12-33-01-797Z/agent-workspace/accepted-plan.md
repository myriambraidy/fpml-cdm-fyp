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
- Parsed in-scope groups: fx-single-leg, fx-swap, fx-simple-option
- Parsed out-of-scope groups: fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy


## Planner Plan

# FX Derivatives Java Mapper Plan

## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
- fx-swap
- fx-simple-option
**Explicitly out of scope (implementation groups):**
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Product Coverage

### Supported FX Products (Runtime supported)
- **fx-single-leg**: 7 fixtures (FX spot, forward, NDF)
  - `fx-ex01-fx-spot.xml` → `fx-ex01-fx-spot.json`
  - `fx-ex02-spot-cross-w-side-rates.xml` → `fx-ex02-spot-cross-w-side-rates.json`
  - `fx-ex03-fx-fwd.xml` → `fx-ex03-fx-fwd.json`
  - `fx-ex04-fx-fwd-w-settlement.xml` → `fx-ex04-fx-fwd-w-settlement.json`
  - `fx-ex05-fx-fwd-w-ssi.xml` → `fx-ex05-fx-fwd-w-ssi.json`
  - `fx-ex06-fx-fwd-w-splits.xml` → `fx-ex06-fx-fwd-w-splits.json`
  - `fx-ex07-non-deliverable-forward.xml` → `fx-ex07-non-deliverable-forward.json`

- **fx-swap**: 1 fixture (FX swap)
  - `fx-ex08-fx-swap.xml` → `fx-ex08-fx-swap.json`

- **fx-simple-option**: 3 fixtures (European, American, NDO options)
  - `fx-ex09-euro-opt.xml` → `fx-ex09-euro-opt.json`
  - `fx-ex10-amer-opt.xml` → `fx-ex10-amer-opt.json`
  - `fx-ex11-non-deliverable-option.xml` → `fx-ex11-non-deliverable-option.json`

### Observations / Unsupported FX Products (Observed, not runtime supported)
The following products are present in the fixture data but will not be implemented in this phase:
- **fx-digital-option**: 6 fixtures with digital option variants (euro, range, one-touch, etc.)
- **fx-barrier-option**: 2 fixtures
- **fx-average-rate-option**: 2 fixtures
- **fx-strategy**: 2 fixtures

> Note: These are identified in the evidence as having `later` or `exclude` implementation hints. They are in scope for future phases but not this run.

### Non-FX Products (Excluded)
- **non-fx**: 2 fixtures (term deposits)
- These are explicitly classified as `non-fx` and are excluded.

## Java Package Design

The generated Maven project will have a structured package hierarchy:

```
com.example.cdm.mapper
├── fx
│   ├── singleleg
│   │   ├── FxSingleLegMapper.java
│   │   ├── FxSingleLegMapperFactory.java
│   │   └── FxSingleLegMappingException.java
│   ├── swap
│   │   ├── FxSwapMapper.java
│   │   ├── FxSwapMapperFactory.java
│   │   └── FxSwapMappingException.java
│   └── simpleoption
│       ├── FxSimpleOptionMapper.java
│       ├── FxSimpleOptionMapperFactory.java
│       └── FxSimpleOptionMappingException.java
├── common
│   ├── FpmlHeaderMapper.java
│   ├── FpmlPartyMapper.java
│   ├── FpmlTradeDateMapper.java
│   └── FpmlTradeIdentifierMapper.java
└── FpmlToCdmMapper.java (entry point)
```

## Mapping Responsibilities

### Core Mappers (One per product group)
Each product group will have a dedicated mapper:
1. **FxSingleLegMapper** - Maps `fxSingleLeg` elements to CDM `SettlementPayout`
2. **FxSwapMapper** - Maps `fxSwap` elements containing `fxSingleLeg` to CDM `SettlementPayout` for both legs
3. **FxSimpleOptionMapper** - Maps `fxSimpleOption` elements to CDM `OptionPayout`

### Utility Mappers (Shared)
1. **FpmlHeaderMapper** - Maps `header` section and common fields (conversationId, messageId, sentBy, sendTo)
2. **FpmlPartyMapper** - Resolves party references, maps `partyId` to LEI, and assigns roles (Party1/Party2)
3. **FpmlTradeDateMapper** - Normalizes `tradeDate` values (removes 'Z' suffix)
4. **FpmlTradeIdentifierMapper** - Maps `partyTradeIdentifier` to `assignedIdentifier`

### Entry Point
- **FpmlToCdmMapper** - Combines all mappers to orchestrate full conversion from FpML to CDM

## Validation and Testing

### Validation Gates
1. Unit Tests for each mapper (assertion-based on fixture data):
   - Ensure input FpML element parses correctly
   - Map to expected CDM structure
   - Validate values (dates, amounts, identifiers)

2. Integration Tests:
   - Full conversion of all supported fixtures
   - Cross-check against known CDM example outputs
   - Validation against Rosetta and cookbook rules

### Test Coverage
1. **Fixture-driven tests**: Each fixture will have:
   - Input: `fpml/fx-derivatives/<filename>.xml`
   - Output: `cdm_parallel/fx-derivatives/<filename>.json`
2. **Mapper unit tests**: Each product group will have specific unit tests to cover:
   - Basic mapping scenarios
   - Edge cases (e.g., side rates, settlements, splits)
   - Mapping validation against cookbook rules

## Unsupported Behavior

1. **Unimplemented Products**: `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy` will not be mapped in this phase
2. **Non-FX Products**: `termDeposit` is excluded
3. **Partial Mappings**:
   - Settlement instructions will be mapped to basic fields (payment amounts, parties, dates)
   - Complex settlement rules (like splitSettlement) may not be fully implemented in this phase
   - Currency conversion and rate derivation logic (aside from spot rate) is not yet covered
4. **Limited party resolution**: Party role assignments (Party1/Party2) are simplified and may not handle all reference inversion cases present in examples

## Traceability Requirements

1. **Mapping Rules**:
   - All mappings must reference stable rules from `data/agent-cookbook/latest/product-families/fx-derivatives.md`
   - Transformations and patterns used must be traceable to evidence in the cookbook JSON

2. **Generated Code Traceability**:
   - Each generated class and method should have a comment referencing the relevant cookbook rule or Rosetta function
   - Method-level documentation should reference the specific elements or functions used

3. **Runtime Validation**:
   - Code should validate that all mandatory fields are populated
   - Mappers should fail gracefully on malformed FpML with meaningful error messages pointing to validation issues

## Implementation Group Change Proposal

No change to the default implementation group is proposed. The current implementation group `fx-single-leg` with its 7 supported fixtures is a strong, focused starting point. The next logical step (after single-leg) is `fx-swap` as it is a direct extension with similar structure, and `fx-simple-option` as it is a more complex but linear variant.

All features described above are consistent with the current implementation group structure and the product scope.

## Critic Review

## Review of Planner Plan

### 1. Verification of Machine-Checked Scope Section

The plan contains the required section:
```markdown
## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
- fx-swap
- fx-simple-option
**Explicitly out of scope (implementation groups):**
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx
```

- ✅ Matches `currentImplementationGroup: fx-single-leg`
- ✅ Includes both `candidateNextGroups`: fx-swap, fx-simple-option
- ✅ Does *not* include fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, non-fx in in-scope list
- ✅ "Out of scope" list is consistent and explicitly stated

→ Plan passes the structural requirement.

### 2. Evidence of Support in Product Scope JSON

Product Groups (`productGroups[]`) match the in-scope groups:
- fx-single-leg (7 fixtures)
- fx-swap (1 fixture)
- fx-simple-option (3 fixtures)

All three are marked with `"implementationHint": "good-first-target"` (for fx-single-leg) or `"candidate"` (for fx-swap and fx-simple-option), consistent with being in scope for this staged phase.

The plan correctly excludes later/excluded groups.

### 3. Blocking Issues

None.

### 4. Non-Blocking Concerns

1. **Mapping of fx-swap to CDM**  
   The evidence shows `fx-ex08-fx-swap.xml` contains *two* `<fxSingleLeg>` entries under `<fxSwap>`. The plan states `FxSwapMapper` maps to CDM `SettlementPayout`, but the CDM example shows **two** `SettlementPayout` entries (`payout[0]` and `payout[1]`).  
   → *Suggestion:* Clarify that `FxSwapMapper` will produce a *list* of mappers or wrap two `SettlementPayout` objects.

2. **Fixture paths / evidence paths consistency**  
   The plan uses paths like `fpml/fx-derivatives/<filename>.xml` but the evidence shows:
   - `data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml`
   - `data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex01-fx-spot.json`  
   → *Suggestion:* Ensure runtime code references or test paths match the evidence paths (backslashes in Windows evidence, but forward slashes in plan example).

3. **Test coverage vs. evidence**  
   Cookbook evidence shows `fx-ex02-spot-cross-w-side-rates.xml` introduces *side rates*, which the CDM example normalizes into a `composite` base + forward point. The plan mentions side rates in "Edge cases", but doesn’t call out *composite rate handling* explicitly.  
   → *Suggestion:* Add a bullet in Mapping Responsibilities under `FxSingleLegMapper` about composite rate (spot + forward points) handling for fx-ex03, fx-ex06, fx-ex07.

### Decision

Decision: ACCEPTED

## Critique Resolution

# Critique Review Decision

## Valid Critique Items

| # | Item | Valid | Reason |
|---|------|-------|--------|
| 1 | **FxSwapMapper should produce a list of SettlementPayout** | ✅ Valid | Evidence clearly shows `fx-ex08-fx-swap.xml` has two `<fxSingleLeg>` entries under `<fxSwap>`, and the CDM example has *two* `payout[]` entries: `SettlementPayout[0]` (GBP→USD, party2→party1) and `SettlementPayout[1]` (GBP→USD, party1→party2). The current phrasing “FxSwapMapper maps to CDM `SettlementPayout`” is ambiguous; the plan must clarify that it yields a **list** of mappers or a composite wrapper. |
| 2 | **Fixture paths must match evidence paths** | ✅ Valid | Evidence uses OS-specific backslashes (`data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml`), while the plan uses forward slashes (`fpml/fx-derivatives/<filename>.xml`). The runtime should use absolute or resolved paths consistent with the evidence to avoid hard-coded relative path mismatches. |
| 3 | **Explicit mention of composite rate handling (spot + forward points)** | ✅ Valid | CDM examples for fx-ex03, fx-ex06, fx-ex07 all include `.composite.baseValue` + `.operandType = ForwardPoint`. The plan mentions “edge cases” but does not explicitly state that the `FxSingleLegMapper` will produce a `Composite` price (spot + forward points) where both are present in FpML. This is a core non-literal transformation for forward-rate products. |

## Revised Implementation Checklist

The planner plan is accepted. To address the valid critique items, the implementer should:

- [ ] **Update `FxSwapMapper` description** in the plan:  
  > “`FxSwapMapper` produces a list of two `SettlementPayout` entries (one per `<fxSingleLeg>` inside `<fxSwap>`), mirroring the CDM structure where `payout[0]` and `payout[1]` correspond to the near and far legs respectively.”

- [ ] **Standardize fixture paths** in tests and documentation:  
  Replace `fpml/fx-derivatives/<filename>.xml` with absolute evidence paths:  
  `data_to_learn_from/fpml/fx-derivatives/<filename>.xml`  
  (normalize backslashes to forward slashes in code examples for portability, but resolve to the exact evidence directory.)

- [ ] **Explicitly state composite rate handling** under `FxSingleLegMapper` responsibilities:  
  > “`FxSingleLegMapper` detects `exchangeRate/rate`, `spotRate`, and `forwardPoints`. When `spotRate` and `forwardPoints` are present, it produces a CDM `Composite` value with `baseValue=spotRate`, `operand=forwardPoints`, `arithmeticOperator=Add`, and `operandType=ForwardPoint` (see fx-ex03, fx-ex06, fx-ex07).”

## Decision

**Decision: ACCEPTED**  
The plan meets all machine-checked constraints and the valid non-blocking concerns have been captured in the revised checklist above. The implementer should incorporate these clarifications before proceeding to code generation.

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-03T12-33-01-797Z\agent-workspace\evidence-packet.md
```

Evidence packet excerpt:

# Evidence Packet

Generated: 2026-05-03T12:33:01.897Z

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
