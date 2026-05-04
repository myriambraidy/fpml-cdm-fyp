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

## Product Coverage
This plan focuses on the **fx-single-leg** implementation group, which contains 7 fixtures:
- fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml

## Fixtures covered in this phase:
- data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex02-spot-cross-w-side-rates.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex03-fx-fwd.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex04-fx-fwd-w-settlement.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex05-fx-fwd-w-ssi.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex06-fx-fwd-w-splits.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex07-non-deliverable-forward.xml

## Implementation Group Change Proposal
No change to currentImplementationGroup needed. The default implementation group `fx-single-leg` is appropriate for the initial staged generation, as it represents a core, good-first-target product type with 7 well-defined fixtures that cover basic FX spot and forward structures.

## Java Package and Class Design
Based on Rosetta patterns and evidence from the cookbook, the implementation will be organized as follows:

### Java Package Structure
```
com.fpml.cdm.fx
├── FpmlToFxMapper.java (main mapper entry point)
├── model
│   ├── FxSingleLegTrade.java
│   ├── FxParty.java
│   ├── FxTradeIdentifier.java
│   └── FxTradeDate.java
└── mapper
    ├── FxSingleLegMapper.java
    ├── PartyMapper.java
    ├── TradeIdentifierMapper.java
    └── TradeDateMapper.java
```

### Key Classes for fx-single-leg:
1. **FxSingleLegMapper** - Maps `trade/fxSingleLeg` elements to CDM structures
2. **PartyMapper** - Handles party resolution and role assignment (Party1/Party2)
3. **TradeIdentifierMapper** - Maps trade identifiers with schemes
4. **TradeDateMapper** - Handles date normalization (trimming trailing 'Z')

## Mapping Responsibilities
### Core Economic Terms Mapping
- **Payment amounts** → `trade.tradeLot.quantity.value` and `trade.tradeLot.quantity.unit.currency.value`
  - Rule: `fx-derivatives:RULE-005` (Payment amounts -> CDM quantities)
- **Exchange rates** → `trade.tradeLot.priceQuantity.price` 
  - From `exchangeRate/rate` and `exchangeRate/quotedCurrencyPair`
  - Rosetta: `MapFxRate`, `MapQuotedCurrencyPair` 

### Trade Metadata Mapping
- **Trade date** → `trade.tradeDate.value`
  - Rule: `fx-derivatives:RULE-002` (Trade date normalization)
  - Rosetta: `MapDateToAdjustableOrRelativeDate`
- **Trade identifiers** → `trade.tradeIdentifier.assignedIdentifier`
  - Rule: `fx-derivatives:RULE-001` (Trade identifier mapping)
  - Rosetta: `MapProductIdentifierList`, `MapProductIdentifier`

### Party Resolution
- **Party references** → `trade.counterparty` 
  - Rule: `fx-derivatives:TR-001` (Resolve party hrefs)
  - Rosetta: `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAccountPartyReference`

## Validation Gates
1. **Parse validation**
   - FpML fixtures parse successfully with required elements
2. **Mapping consistency check**
   - All 7 fx-single-leg fixtures map to expected CDM structures  
3. **Semantic correctness**
   - Trade date normalization (removing 'Z')
   - Quantity/currency mappings for both exchanged currencies
   - Party reference resolution
4. **Round-trip verification**
   - Confirm key values (amounts, rates, dates) are preserved through mapping
   - Verify party roles are correctly assigned as Party1/Party2

## Tests
Unit tests will be generated for:
- Basic single-leg spot trade (fx-ex01-fx-spot.xml)
- Spot with cross rates (fx-ex02-spot-cross-w-side-rates.xml)  
- Forward trade (fx-ex03-fx-fwd.xml)
- Forward with settlement info (fx-ex04-fx-fwd-w-settlement.xml)
- Forward with standard settlement instructions (fx-ex05-fx-fwd-w-ssi.xml)
- Forward with split settlement (fx-ex06-fx-fwd-w-splits.xml)
- Non-deliverable forward (fx-ex07-non-deliverable-forward.xml)

## Unsupported Behavior
This phase excludes:
- FX swaps (fx-swap)
- FX options (fx-simple-option, fx-digital-option, etc.)
- Strategy products (fx-strategy)
- Non-FX products (non-fx)

## Traceability Requirements
Each generated Java class will be traced back to:
- Source FpML structure patterns observed in fixture examples
- Rosetta mapping functions used for implementation
- Cookbook rules that define expected conversion behavior
- CDM output schema structures validated against examples

## Critic Review

## Review Summary

The planner's Markdown plan is evaluated against the provided product scope (00-product-scope.json and evidence-packet.md). The plan contains the required "## Implementation scope (machine-checked)" section with **In scope (implementation groups):** bullets matching `productGroups[].group` slugs and `currentImplementationGroup`. All required scope checks pass.

### Blocking Issues

- **None identified.** The plan correctly:
  - Uses `fx-single-leg` as the current implementation group (matches `currentImplementationGroup` in 00-product-scope.json)
  - Excludes `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, and `non-fx` explicitly
  - Lists all 7 fx-single-leg fixtures in the plan
  - Provides an "Implementation Group Change Proposal" section correctly stating no change is needed
  - Maps mappings to cookbook rules (`RULE-001`, `RULE-002`, `RULE-005`) and Rosetta functions correctly

### Non-blocking Concerns

- The plan states “Based on Rosetta patterns and evidence from the cookbook” but does not explicitly cite Rosetta block names for key features like `MapFxSingleLegCounterpartyList`, `MapFxSingleLegEconomicTerms`, `MapFxSingleLegPriceQuantityList`, etc., though later sections reference some. This is minor and does not block implementation.
- The test list in the plan only lists fixtures, not test class names or methods, which is acceptable at this stage.

### Decision

Decision: ACCEPTED

## Critique Resolution

# Critique Review Decision

## Validation Summary

The critic review was evaluated against the provided product scope (`00-product-scope.json`, `evidence-packet.md`) and the planner's plan (`round-01/planner-plan.md`). Key findings are summarized below.

## Critique Items Assessment

| # | Critique Item | Valid? | Reason |
|---|---------------|--------|--------|
| 1 | "Uses `fx-single-leg` as current implementation group (matches `currentImplementationGroup`)" | ✅ Valid | Confirmed: `00-product-scope.json` defines `"currentImplementationGroup": "fx-single-leg"`; the plan explicitly lists `fx-single-leg` as in-scope. |
| 2 | "Excludes `fx-swap`, `fx-simple-option`, `fx-digital-option`, etc." | ✅ Valid | Confirmed: Plan explicitly lists all 7 out-of-scope groups with `**Explicitly out of scope (implementation groups):**` section. |
| 3 | "Lists all 7 fx-single-leg fixtures in the plan" | ✅ Valid | Confirmed: Plan includes a dedicated **Product Coverage** section listing all 7 fixtures. |
| 4 | "Provides 'Implementation Group Change Proposal' section" | ✅ Valid | Confirmed: Plan contains explicit section stating *“No change to currentImplementationGroup needed.”* |
| 5 | "Maps mappings to cookbook rules (`RULE-001`, `RULE-002`, `RULE-005`) and Rosetta functions" | ✅ Valid | Confirmed: Plan references `fx-derivatives:RULE-001`, `RULE-002`, `RULE-005`, and Rosetta functions (`MapFxRate`, `MapQuotedCurrencyPair`, `MapDateToAdjustableOrRelativeDate`, etc.) correctly. |
| 6 | "Does not explicitly cite all Rosetta block names (e.g., `MapFxSingleLegCounterpartyList`, `MapFxSingleLegEconomicTerms`, `MapFxSingleLegPriceQuantityList`)" | ⚠️ Non-blocking concern | Confirmed: Only some blocks are cited. This is minor: the plan correctly maps responsibilities to documented Rosetta functions from `rosetta-source/latest/docs/product-families/fx.md`. Full citation would improve traceability but is not required for gate passage. |
| 7 | "Test list only lists fixtures, not test class names or methods" | ⚠️ Non-blocking concern | Confirmed: Tests are named by fixture (e.g., `fx-ex01-fx-spot.xml`). Acceptable at planning stage; implementation details can be deferred. |

## Overall Validity

- **Blocking issues:** **None**  
- **Non-blocking concerns:** **2** (both minor and acceptable for pilot phase)  
- **Scope adherence:** **Full** — Plan respects staged-by-group strategy and product-scope constraints.  
- **Traceability:** **Good** — All major mappings are anchored to cookbook rules and Rosetta functions.

## Decision

**Decision: ACCEPTED**

The planner's plan is aligned with the product scope, adheres to the staged-by-product-group strategy, and includes all required sections and traceability anchors. The minor non-blocking concerns do not impede implementation and can be addressed incrementally.

---

## Revised Implementation Checklist

| Item | Status | Notes |
|------|--------|-------|
| ✅ Current implementation group matches `currentImplementationGroup` | PASS | Uses `fx-single-leg` as specified |
| ✅ All out-of-scope groups explicitly listed | PASS | 7 groups explicitly excluded |
| ✅ All 7 fx-single-leg fixtures listed | PASS | Covered in dedicated section |
| ✅ Implementation Group Change Proposal included | PASS | Explicit “no change” statement |
| ✅ Cookbook rules mapped to FpML → CDM patterns | PASS | `RULE-001`, `RULE-002`, `RULE-005` cited |
| ✅ Rosetta functions referenced for implementation | PASS | Key functions identified (may expand traceability in next phase) |
| ✅ Validation gates defined | PASS | Parse, consistency, semantics, round-trip |
| ✅ Unit test coverage defined | PASS | One test per fixture specified |
| ✅ Runtime constraints met | PASS | No LLM calls or workspace reads specified |

**Next phase actions (if any):**
- Expand Rosetta block citation to include `MapFxSingleLegCounterpartyList`, `MapFxSingleLegEconomicTerms`, `MapFxSingleLegPriceQuantityList`, `MapFxSingleLegAccountPartyReference` in implementation plan or javadoc.
- Add test class/method names to test plan in implementation checklist.

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-02T17-10-41-700Z\agent-workspace\evidence-packet.md
```

Evidence packet excerpt:

# Evidence Packet

Generated: 2026-05-02T17:10:41.746Z

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
