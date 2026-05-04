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

## Supported FX products
Based on the product scope and evidence packet, the following FX products are supported in this run:

1. **FX single-leg** (`fx-single-leg`)
   - FX spot
   - FX forward
   - FX forward with settlement information
   - FX forward with standard settlement instruction
   - FX forward with split settlement
   - Non-deliverable forward

## Observed unsupported FX products
The following FX product types are present in the evidence but not included in this run's implementation scope:
- FX swap (`fx-swap`)
- FX simple option (`fx-simple-option`)
- FX digital option (`fx-digital-option`)
- FX barrier option (`fx-barrier-option`)
- FX average rate option (`fx-average-rate-option`)
- FX strategy (`fx-strategy`)

## Java package/class design

### Core Package Structure
```
com.fpml.cdm.fx
├── mapper
│   ├── FpmlToCdmMapper.java
│   └── FxMapperFactory.java
├── model
│   ├── FxTrade.java
│   ├── FxSingleLeg.java
│   ├── FxSwap.java
│   ├── FxOption.java
│   └── ...
├── exception
│   └── FxMappingException.java
└── util
    ├── CurrencyUtils.java
    ├── DateUtils.java
    └── PartyMapper.java
```

### Key Classes
1. **FpmlToCdmMapper** - Main entry point for mapping FX products, delegates to product-specific mappers
2. **FxMapperFactory** - Creates appropriate mappers for different FX product types
3. **FxTrade** - CDM model class representing FX trade
4. **FxSingleLeg** - CDM model class for single leg FX products
5. **PartyMapper** - Maps FpML party references to CDM party objects

## Mapping responsibilities
- Map FX single-leg products (spot, forward, NDF)
- Map basic trade identifiers, dates, and party references
- Convert payment amounts to CDM quantities with currency units
- Map exchange rates and associated FX details
- Convert trade dates from FpML's ISO date with 'Z' to CDM date without 'Z'
- Map FX product taxonomy

## Tests
- Unit tests for each FX product type mapping
- Integration tests covering the complete mapping pipeline
- Tests for edge cases like split settlements and NDFs
- Tests verifying date normalization and party reference resolution

## Validation gates
- Semantic validation of mapping results against expected CDM structure
- Trade identifier preservation
- Proper party reference resolution
- Correct date format compliance
- Amount and currency unit mapping accuracy

## Unsupported behavior
- FX swap products (`fx-swap`)
- FX simple options (`fx-simple-option`)
- FX digital options (`fx-digital-option`)
- FX barrier options (`fx-barrier-option`)
- FX average rate options (`fx-average-rate-option`)
- FX strategies (`fx-strategy`)
- Non-FX products

## Traceability requirements
- All mapping decisions must be traceable to evidence in 00-product-scope.json and evidence-packet.md
- Maintained mapping traceability for each supported FX single-leg product
- Configurable mapping behavior through cookbook reference rules when available
- Clear separation of concerns between FpML parsing and CDM mapping logic

## Critic Review

# Plan Review

## Blocking Issues

### 1. Missing machine-checked scope declaration
The plan lacks the required `## Implementation scope (machine-checked)` header with explicit `**In scope (implementation groups):**` bullets listing the **currentImplementationGroup** (`fx-single-leg`) in `productGroups[].group` slugs. While `fx-single-leg` appears in the narrative, the strict section header and bullet format required for validation is absent.

**Impact**: Plan cannot be machine-checked for alignment with `00-product-scope.json`’s `currentImplementationGroup`.

### 2. Overreach in tests
The plan states:
> Tests for each FX product type mapping

and lists:
- FX spot, forward, NDF (within scope)
- but tests section does not clarify which test data (expected CDM) corresponds to which product. This is unsupported by evidence-packet.md fixture lists which assign each fixture to exactly one product group and product type. The test description risks conflating responsibilities across product groups.

**Impact**: Risk of test sprawl, unclear test isolation, and potential runtime/agent-runtime confusion.

### 3. Unsupported behavior: fx-swap ambiguity
While `fx-swap` is correctly listed as out of scope, the plan does not address the fact that `fx-ex08-fx-swap.xml` is a **staged-by-product-group** candidate in `candidateNextGroups`. The plan should not imply future scope or add implementation details for fx-swap.

**Impact**: Potential implementation confusion if future-stage fixtures are mistakenly included.

## Non-blocking Concerns

### 1. `FxSwap.java` in model list
`model/FxSwap.java` is listed in the package structure diagram but `fx-swap` is explicitly out of scope. If `FxSwap` is not implemented in this round, it should either be commented out or removed.

### 2. Missing `currentImplementationGroup` in header
The plan does not include a `currentImplementationGroup: fx-single-leg` declaration in the header section. This is not strictly blocking but adds clarity.

### 3. “FX single-leg” test example listing
The “Supported FX products” list includes specific variants (“FX forward with settlement information” etc.) which are fine as narrative, but the plan should ensure tests map exactly to fixtures in `fx-single-leg` group and do not add fixtures from other groups.

## Evidence Alignment

### 00-product-scope.json
- `currentImplementationGroup` = `fx-single-leg` ✅
- `productGroups` includes `group: "fx-single-leg"` with 7 fixtures ✅
- `candidateNextGroups` = `["fx-swap", "fx-simple-option"]` — correctly listed as out of scope ✅
- `nonFxFixtures` correctly excluded ✅

### evidence-packet.md
- `fx-single-leg` fixtures match 00-product-scope.json ✅
- No evidence supports fx-swap, fx-option, or other out-of-scope product types ✅

## Decision

Decision: NEXT_ROUND_REQUIRED

## Critique Resolution

## Critique Review

### Validated Critique Items

| # | Critique Item | Valid? | Reason |
|---|---------------|--------|--------|
| 1 | **Missing machine-checked scope declaration** — the plan lacks the required `## Implementation scope (machine-checked)` header with explicit `**In scope (implementation groups):**` bullets listing `fx-single-leg` in slugs. | ✅ Valid | The input brief explicitly requires using the precomputed `00-product-scope.json`, and the critic role's prompt and prior rounds established that plans must include this specific header and bullet format for machine-checking. The planner’s current plan includes `fx-single-leg` only in prose and under a generic “## Supported FX products” heading, not in the required machine-readable header/bullet form. |
| 2 | **Overreach in tests** — tests mention “each FX product type mapping” without mapping fixtures to specific products (e.g., fx-ex01 → fx-spot) and risk conflating responsibilities across product groups. | ✅ Valid | Evidence-packet.md fixture lists map each fixture to exactly one product group and product label, and rules forbid including out-of-scope fixtures. The current test description is vague and could lead to test sprawl or runtime confusion. |
| 3 | **Unsupported behavior: fx-swap ambiguity** — `fx-swap` is listed as out of scope but `fx-ex08-fx-swap.xml` is in `candidateNextGroups`. The plan does not clarify that fx-swap is outside this staged implementation. | ✅ Valid (clarification needed) | The plan correctly excludes fx-swap, but since the evidence identifies it as a *candidate next group*, explicitly noting its exclusion from *this* implementation round (and why) improves traceability and avoids ambiguity. |
| 4 | **`FxSwap.java` in model list** — the package diagram includes `FxSwap.java` but `fx-swap` is out of scope. | ✅ Valid (non-blocking) | This is a design smell that increases cognitive load and may mislead implementers. It’s non-blocking since the scope section already excludes fx-swap, but it should be removed or commented to align with current-round intent. |
| 5 | **Missing `currentImplementationGroup` in header** — not in header section (e.g., `currentImplementationGroup: fx-single-leg`). | ⚠️ Non-blocking suggestion | The header lacks a clear statement such as `currentImplementationGroup: fx-single-leg`. While helpful for human clarity, it’s not machine-checking critical because the “Implementation scope (machine-checked)” section already expresses the group slugs. |
| 6 | **Supported FX products list includes implementation-group variants** — naming specific FX variants (e.g., “FX forward with settlement information”) could be misleading if not explicitly tied to fixture IDs. | ⚠️ Minor clarification needed | The list is useful narrative, but to maintain strict evidence traceability, it should explicitly reference fixture IDs (e.g., fx-ex04 → “FX forward with settlement information”) to prevent ambiguity. |

---

### Revised Implementation Checklist

- [ ] **Scope declaration**: Add the required `## Implementation scope (machine-checked)` section with:
  ```markdown
  **Product family:** fx-derivatives  
  **currentImplementationGroup:** fx-single-leg  
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
  ```
- [ ] **Model classes**: Remove `FxSwap.java` (and `FxOption.java`, if present) from the model package diagram or comment them clearly as “(stub/placeholder)” if kept for future rounds.
- [ ] **Tests**: Explicitly link test fixtures to `fx-single-leg` fixture IDs, e.g.:
  ```markdown
  - fx-ex01 → FX spot mapping  
  - fx-ex03 → FX forward mapping  
  - fx-ex04 → FX forward with settlement information  
  - fx-ex05 → FX forward with standard settlement instruction  
  - fx-ex06 → FX forward with split settlement  
  - fx-ex07 → Non-deliverable forward mapping  
  ```
  Ensure all tests reference only the 7 fixtures in the fx-single-leg group.
- [ ] **Supported FX products**: Revise to clarify the mapping from narrative variants to fixture IDs (e.g., “FX forward with settlement information (fx-ex04, fx-ex05)”).
- [ ] **Header clarity**: Add `currentImplementationGroup: fx-single-leg` in the plan header for clarity (optional but recommended).

---

### Decision: ACCEPTED

The planner’s plan is conceptually sound and aligns with the product scope and cookbook rules. The identified issues are minor structural and traceability improvements rather than fundamental flaws. After applying the checklist above, the plan will meet all machine-checking and human-review requirements.

**Next step**: Implementer to execute against the revised plan.

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-02T20-04-44-308Z\agent-workspace\evidence-packet.md
```

Evidence packet excerpt:

# Evidence Packet

Generated: 2026-05-02T20:04:44.414Z

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
