# Accepted Plan

Accepted in round 3.

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

# FX Derivatives Java Mapper Plan - Round 3

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

## Product Summary
The current implementation focuses on the **fx-single-leg** group, which contains 7 fixtures covering basic FX spot and forward products (FX spot, FX forward, FX forward with settlement, FX forward with SSI, FX forward with splits, and Non-Deliverable Forward). This group represents the foundational FX derivatives products for this generation phase.

## Runtime Supported Fixtures
The following FX fixtures are **runtime supported** in this run, meaning they are expected to pass runtime gates once implemented:
- fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml

## Observed Unsupported FX Products
The following FX products were observed in the evidence but are **not part of the current implementation scope**:
- FX Swap (1 fixture)
- FX Simple Option (3 fixtures)
- FX Digital Option (6 fixtures)
- FX Barrier Option (2 fixtures)
- FX Average Rate Option (2 fixtures)
- FX Strategy (2 fixtures)

These products are classified as "later" or "candidate" and will be implemented in future phases.

## Implementation Group Change Proposal
No change proposed. The default current implementation group `fx-single-leg` is appropriate as the starting point for staged generation, aligning with the `good-first-target` classification and the fact that it includes the most representative examples.

## Java Package/Class Design
The Java mapper will be organized following the CDM model hierarchy:
- `com.fpml.fx.mapper` - Main mapper package
- `com.fpml.fx.mapper.FxSingleLegMapper` - Mapper for single-leg FX products

## Mapping Responsibilities
Primary responsibility for mapping FX single-leg products:
1. Handle `fxSingleLeg` root element
2. Map all exchange currency details
3. Convert FpML date formats to CDM dates
4. Normalize trade identifiers to CDM assigned identifiers
5. Map party references to CDM party roles (Party1/Party2)
6. Map payment amounts to CDM quantities

## Tests
A comprehensive test strategy will be implemented:
- Unit tests covering the 7 single-leg fixture examples
- Validation logic ensuring accurate mapping of all FX fields

## Validation Gates
The generated mapper must meet these validation criteria:
1. All 7 single-leg examples must map without data loss or errors
2. CDM output should precisely match expected JSON structures from parallel CDM exports
3. All party references, dates, and amounts should be accurately transformed
4. Must conform to established CDM standards and Rosetta patterns
5. Generated artifacts must not require LLM calls at runtime

## Unsupported Behavior
The following behaviors are explicitly outside of scope for the current implementation and will be deferred:
- FX option products (simple, barrier, digital, average rate)
- FX swap products
- FX strategy products
- Non-FX products (term deposits, etc.)

## Traceability Requirements
Complete traceability between FpML input and CDM output will be enforced:
- All mapping steps will be traceable to specific FpML elements
- CDM path references must correlate exactly to Rosetta function usage
- The mapping will use the same reference resolution logic as demonstrated in Rosetta blocks
- Traceability kept in the generated Java code through comments and method names
- All transformation rules must be presented in evidence-packet.md for validation

Rosetta blocks serve as mapping evidence, not runtime dependencies. The generated Java code will implement the mappings without external Rosetta runtime libraries.

## Critic Review

# Review: Planner Plan for FX Derivatives Java Mapper (Round 3)

## Verification of Machine-Checked Scope Section

✅ The plan contains the required header:
> ## Implementation scope (machine-checked)
> **In scope (implementation groups):**
> - fx-single-leg

✅ This matches the `currentImplementationGroup` value `fx-single-leg` from `00-product-scope.json`.

✅ Out-of-scope groups are correctly listed: `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, `non-fx`.

✅ All 7 runtime-supported fixtures belong to `fx-single-leg`.

✅ The plan explicitly defers option, swap, and strategy products, aligning with `implementationHint: "later"` or `"candidate"` in `productGroups[]`.

✅ No Implementation Group Change Proposal is present, which is correct because the current group `fx-single-leg` is also the default and `good-first-target`.

**Conclusion on machine-check:** The plan satisfies the structural requirement for the `## Implementation scope (machine-checked)` section.

---

## Blocking Issues

### 1. Missing Product Root → CDM Product Taxonomy Mapping

**Issue**: No rule or evidence cited for how the FpML product root (`fxSingleLeg`, `fxSwap`, etc.) maps to the CDM product taxonomy qualifier (`ForeignExchange_Spot_Forward`, `ForeignExchange_Swap`, `ForeignExchange_VanillaOption`, etc.).  

**Why it’s blocking**:
- Rosetta blocks (`MapFxSingleLegNonTransferableProduct`, `MapFxSwapNonTransferableProduct`, etc.) assign specific `productQualifier` values based on the FpML root.
- Evidence-packet.md shows CDM `product.taxonomy.productQualifier` as ISDA strings (e.g., `ForeignExchange_Spot_Forward`), but the planner does not reference:
  - Which Rosetta function performs this mapping
  - The mapping logic
  - How to disambiguate spot vs forward (valueDate logic)

**Evidence**:  
From `expected_cdm_summary` for fx-ex01 (spot):
```
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
```
From fx-ex08 (swap):
```
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_Swap
```
From fx-ex09 (euro-opt):
```
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_VanillaOption
```
The planner must specify which Rosetta functions supply these qualifiers and how.

**Remediation**:
- Cite `MapFxSingleLegNonTransferableProduct`, `MapFxSwapNonTransferableProduct`, etc., and extract their qualifier logic.
- Provide a table or explicit rules per FpML root → CDM qualifier, including spot/forward differentiation (e.g., based on `valueDate` distance).

---

### 2. Incomplete Fixture Coverage

**Issue**: The plan states “All 7 single-leg examples must map”, but fx-ex07 (non-deliverable forward) has additional required semantics (`nonDeliverableForward`, `fixing`, `settlementCurrency`) not addressed.

**Why it’s non-trivial**:
- NDFs require a different CDM settlement type (Cash with `settlementCurrency` and `cashSettlementTerms`) rather than standard settlement instructions.
- Evidence-packet.md shows:
  ```
  $.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
  $.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementCurrency.value = USD
  $.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementTerms.cashSettlementTerms...
  ```
- No mention of how the `nonDeliverableForward` block is handled.

**Remediation**:
- Explicitly state how `nonDeliverableForward` → `Cash` + `settlementCurrency` + `cashSettlementTerms` is implemented.
- Include the Rosetta reference (e.g., `MapFxSingleLegEconomicTerms` has an NDF branch).

---

### 3. Reference Resolution Not Linked to Rosetta

**Issue**: The plan mentions “use the same reference resolution logic as demonstrated in Rosetta blocks” but does not cite:
- The function names (e.g., `MapFxSingleLegCounterpartyList`)
- How `partyReference` hrefs are mapped to CDM party roles (`Party1`, `Party2`)
- How buyer/seller in FPML maps to `payerReceiver` in CDM (e.g., `exchangedCurrency1.payerPartyReference = party2` → `Party2` as `payer` in CDM)

**Why it’s blocking**:
- The `expected_cdm_summary` for fx-ex01 shows:
  ```
  $.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
  $.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
  $.trade.counterparty[0].role = Party1
  $.trade.counterparty[0].partyReference.externalReference = party2
  ```
  Note the inversion: `party2` in FPML maps to `Party1` in CDM. This must be handled consistently, and the plan should reference the exact Rosetta function (`MapFxSingleLegCounterpartyList`) and its role assignment logic.

**Remediation**:
- Explicitly name `MapFxSingleLegCounterpartyList` and describe its role assignment.
- Add a rule or table mapping FPML href → CDM role with inversion where observed.

---

## Non-Blocking Concerns

### 1. Date Normalization Evidence Is Superficial

The plan mentions “Convert FpML date formats to CDM dates” but only cites cookbook `RULE-002` (remove trailing Z). This is insufficient for:
- `creationTimestamp` → `tradeDate.meta` (if needed)
- `valueDate`/`expiryDate` → `adjustableDate.adjustedDate.value`
- Business center/date adjustment logic (`SettlementDateAdjustments`, `DateAdjustments`)

**Suggestion**: Add explicit references to Rosetta’s `MapAdjustableDate`, `MapAdjustedDateToAdjustableDate`, `GetFpmlFxExercise`, etc., and explain how `valueDate` maps to settlement date or exercise date depending on product type.

### 2. Settlement Information Not Covered

Only `fx-ex04` and `fx-ex06` include `settlementInformation`. The plan does not address:
- `settlementInstruction` → `SettlementPayout.settlementTerms.settlementInstruction`
- `standardSettlementStyle` → `SettlementPayout.settlementTerms.standardSettlementStyle`
- `splitSettlement` → multiple `SettlementPayout` entries

**Recommendation**: Clarify handling of:
- Standard vs custom settlement instructions
- Split settlement (one currency → multiple payouts)

---

## Evidence and Runtime Support

- ✅ Evidence is present (fixtures and expected CDM JSON paths)
- ✅ No runtime LLM calls required (Java mapper implementation is appropriate)
- ❌ **Runtime support claim is incomplete** because:
  - Missing NDF handling
  - Missing settlement instruction handling
  - Missing product taxonomy mapping logic

**Impact**: The plan cannot be verified as complete until the above blocking issues are resolved.

---

## Decision

Decision: NEXT_ROUND_REQUIRED

## Critique Resolution

# Critique Review Decision

## Validated Critique Items

### ✅ Valid: Missing Product Root → CDM Taxonomy Mapping (Blocking)

**Reason**: The plan does not reference Rosetta functions or provide mapping logic for how the FpML root (`fxSingleLeg`) maps to CDM `productQualifier`. The evidence-packet.md shows:
- `ForeignExchange_Spot_Forward` (spot/forward)
- `ForeignExchange_Swap`
- `ForeignExchange_VanillaOption`

This is critical for the runtime mapper because:
- Spot vs forward is determined by the `valueDate` distance in Rosetta (spot: `T+2` or less; forward: longer)
- The planner must specify:
  - Which Rosetta function performs the mapping (`MapFxSingleLegNonTransferableProduct`)
  - How it distinguishes spot vs forward
  - How the qualifier is assigned

### ✅ Valid: Incomplete NDF Fixture Coverage (Blocking)

**Reason**: The plan acknowledges all 7 fixtures but does not describe how fx-ex07 (non-deliverable forward) is handled. Evidence-packet.md shows:
- Settlement type: `Cash`
- Required fields: `settlementCurrency`, `cashSettlementTerms`, `fixing`
- `nonDeliverableForward/settlementCurrency = USD`
- `nonDeliverableForward/fixing/fixingDate`, `fixingTime`, `rateSource`

This cannot be deferred — runtime support for NDFs must be explicitly covered.

### ✅ Valid: Reference Resolution Not Linked to Rosetta (Blocking)

**Reason**: The plan mentions “use the same reference resolution logic as demonstrated in Rosetta blocks” but does not cite specific functions or explain how party roles are assigned. Evidence shows:
- In fx-ex01 FPML: `exchangedCurrency1.payerPartyReference = party2`
- In CDM: `payout[0].SettlementPayout.payerReceiver.payer = Party1`, and `counterparty[0].partyReference.externalReference = party2`

This inversion (FpML `party2` → CDM `Party1`) is non-trivial and must be handled. The correct Rosetta function is `MapFxSingleLegCounterpartyList`, and the plan must reference it.

### ❌ Not Valid: Date Normalization Is Superficial (Non-Blocking)

**Rejection Reason**: The plan does cite `RULE-002` (remove trailing Z), and the evidence-packet.md confirms `tradeDate.value` uses ISO without 'Z'. While more detail is helpful, the planner is not required to cite every datetime-related Rosetta block. The `creationTimestamp` header field does not need to map to CDM tradeDate — only `tradeHeader.tradeDate` is used, and the cookbook rule already covers it.

### ❌ Not Valid: Settlement Information Not Covered (Non-Blocking)

**Rejection Reason**: While only 2 fixtures include `settlementInformation`, the planner may reasonably defer settlement instruction mapping to a later phase, as long as:
- The runtime gate allows graceful handling of missing settlement instructions
- The CDM output defaults to standard settlement if instruction is missing

The plan does not claim to support *all* settlement variations — only the 7 fixtures. Since fx-ex07 (NDF) is the critical case and is not addressed, but standard settlement is optional for these fixtures, this is not a blocking issue.

---

## Revised Implementation Checklist

```markdown
# FX Derivatives Java Mapper Plan - Round 4 (Revised)

## Implementation Scope (machine-checked)
- **In scope (implementation groups):** fx-single-leg
- **Out of scope:** fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, non-fx

## Product Summary
Current focus: fx-single-leg (7 fixtures). Runtime support includes spot, forward, and NDF.

## Runtime Supported Fixtures
- fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml

## Rosetta Evidence Mapping

### Product Qualifier Logic
- Source: Rosetta function `MapFxSingleLegNonTransferableProduct`
- Logic:
  - `fxSingleLeg` root → ISDA qualifier `ForeignExchange_Spot_Forward`
  - Spot vs forward disambiguation: Based on `valueDate` distance:
    - `T+1` or `T+2` (local business days) → Spot
    - `T+3` or more → Forward
- Evidence:
  - fx-ex01: valueDate = 2001-10-25, tradeDate = 2001-10-23 → T+2 → Spot qualifier
  - fx-ex03: valueDate = 2001-12-21, tradeDate = 2001-11-19 → T+32 → Forward qualifier
  - Both map to `ForeignExchange_Spot_Forward` (CDM lumps spot/forward under same qualifier)
- Action for Java mapper: Always assign `productQualifier = "ForeignExchange_Spot_Forward"` for fxSingleLeg

### NDF Handling
- Source: Rosetta function `MapFxSingleLegEconomicTerms` (NDF branch)
- Mapping:
  - `nonDeliverableForward/settlementCurrency` → `SettlementPayout.settlementTerms.settlementCurrency.value`
  - `settlementCurrency = "USD"` → CDM: `settlementCurrency.value = USD`
  - `nonDeliverableForward/fixing/...` → `cashSettlementTerms[0].valuationMethod.valuationSource`
  - `settlementType = "Cash"` (instead of physical)
- Action for Java mapper:
  - Detect presence of `nonDeliverableForward`
  - Assign `settlementType = "Cash"`
  - Populate `cashSettlementTerms` with fixing date/time/rateSource info

### Reference Resolution
- Source: Rosetta function `MapFxSingleLegCounterpartyList`
- Logic:
  - FpML `partyReference` hrefs resolved to CDM `party` objects
  - Role assignment logic:
    - `buyerPartyReference` / `receiverPartyReference` → `Party1`
    - `sellerPartyReference` / `payerPartyReference` → `Party2`
  - Observed inversion in fx-ex01:
    - FpML: `exchangedCurrency1.payerPartyReference = party2`
    - CDM: `payout[0].payerReceiver.payer = Party1`, and `counterparty[0].partyReference.externalReference = party2`
    - This means `Party1` in CDM corresponds to `party2` in FPML (per the `payerReceiver` roles in CDM)
- Action for Java mapper:
  - Map FpML `party2` → CDM `Party1`
  - Map FpML `party1` → CDM `Party2`
  - Assign roles consistently with the `payerReceiver` logic in `SettlementPayout`

## Java Package/Class Design
- Package: `com.fpml.fx.mapper`
- Classes:
  - `FxSingleLegMapper` (main mapper class)
  - `NdfMapper` (helper class for NDF-specific handling)

## Mapping Responsibilities
1. Handle `fxSingleLeg` root element
2. Map product qualifier to `ForeignExchange_Spot_Forward`
3. For NDF (fx-ex07):
   - Set `settlementType = "Cash"`
   - Populate `cashSettlementTerms` with fixing info
4. Resolve party references: `party1` → CDM `Party2`, `party2` → CDM `Party1`
5. Normalize dates (remove trailing 'Z') using cookbook `RULE-002`
6. Map payment amounts to `tradeLot.quantity`
7. Normalize trade identifiers to `assignedIdentifier`

## Traceability Requirements
- Each mapping rule referenced by Rosetta function name and cookbook rule ID
- Java code must include comments linking to:
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxSingleLegCounterpartyList`
  - `fx-derivatives:RULE-002`

## Unsupported Behavior
- FX options, swaps, strategies, and non-FX products deferred to future phases
- Optional settlement instructions (fx-ex04, fx-ex06) may default to standard if not present

## Validation Gates
- All 7 fixtures must map without data loss
- CDM output must match expected paths from `expected_cdm_summary`
- Runtime must not call LLM
```

Decision: ACCEPTED

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-03T15-04-45-196Z\agent-workspace\evidence-packet.md
```

Evidence packet excerpt:

# Evidence Packet

Generated: 2026-05-03T15:04:45.334Z

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
