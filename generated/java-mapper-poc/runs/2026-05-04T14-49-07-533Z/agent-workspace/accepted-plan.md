# Accepted Plan

Accepted in round 3.

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

## Supported FX Products for this Run
- FX spot (fx-ex01-fx-spot)
- FX spot with cross rates (fx-ex02-spot-cross-w-side-rates)
- FX forward (fx-ex03-fx-fwd)
- FX forward with settlement instructions (fx-ex04-fx-fwd-w-settlement)
- FX forward with standard settlement instructions (fx-ex05-fx-fwd-w-ssi)
- FX forward with split settlement (fx-ex06-fx-fwd-w-splits)
- Non-deliverable forward (fx-ex07-non-deliverable-forward)

## Observed Unsupported FX Products
- FX swap (fx-ex08-fx-swap)
- FX simple option (fx-ex09-euro-opt, fx-ex10-amer-opt, fx-ex11-non-deliverable-option)
- FX digital option (fx-ex14-euro-digital-option, fx-ex15-euro-range-digital-option, fx-ex16-one-touch-option, fx-ex17-no-touch-option, fx-ex18-double-one-touch-option, fx-ex19-double-no-touch-option)
- FX barrier option (fx-ex12-fx-barrier-option, fx-ex13-fx-dbl-barrier-option)
- FX average-rate option (fx-ex20-avg-rate-option-parametric, fx-ex21-avg-rate-option-specific)
- FX strategy (fx-ex22-straddle, fx-ex23-delta-hedge)

## Java Package and Class Design

### Core Package Structure
- `org.finos.cdm.fx.mapper`: Main mapper package
  - `FxSingleLegMapper`: Entry point for FX single-leg mapping
  - `FxMapperContext`: Shared context and utility methods
  - `FxMapperException`: Custom exception type

### CDM Object Construction Strategy
- Utilize Rosetta-generated CDM Java objects directly as internal representation
- Map FpML elements to CDM objects using Rosetta function intuition:
  - `MapFxSingleLegCounterpartyList` → `Counterparty` objects
  - `MapFxSingleLegAncillaryPartyList` → `AncillaryParty` objects
  - `MapFxSingleLegNonTransferableProduct` → `NonTransferableProduct` with embedded `EconomicTerms`
  - `MapFxSingleLegEconomicTerms` → `EconomicTerms` with `Payout` (settlement via `SettlementPayout`)
  - `MapFxCoreDetailsModelToSettlementPayout` → `Payout` with structured `SettlementPayout`
    - `payerReceiver`: Constructed via `MapPayerReceiver`
    - `priceQuantity`: Constructed via `ResolvablePriceQuantity`, with
      - `quantitySchedule`: via `MapFxCoreDetailsModelQuantityWithAddress`
      - `priceSchedule`: via `MapFxCoreDetailsModelPriceWithAddress`
    - `settlementTerms`: via `MapFxCashSettlementToSettlementTerms`
    - `underlier`: via `MapCurrencyToObservableCashWithAddress`

### Mapping Responsibilities
- Input: FpML `fxSingleLeg` root and associated `party` structures
- Output: CDM `Trade` containing a `NonTransferableProduct` with `EconomicTerms`
- Responsibility for mapping TXN header and party structures handled by shared ingest components (not in scope)
- Each core mapping function will be implemented as a bean or utility method to maintain Java style and Rosetta function intent

## Tests
- **Structure validation**: Verify `Trade` and `NonTransferableProduct` structures
- **Party mapping**: Validate `Counterparty` and `AncillaryParty` population
- **EconomicTerms validation**:
  - Ensure `SettlementPayout` with correct `payerReceiver`
  - Validate `ResolvablePriceQuantity` with correct schedule references for price & quantity
  - Confirm `SettlementTerms` with correct cash settlement inputs
  - Confirm `Underlier` populated via `Observable`
- **Value validation**:
  - Validate currency codes for `quantitySchedule` and `priceSchedule`
  - Map and validate trade date, value date, and exchange rate from FpML to CDM
- **Run-time support**:
  - Test using runtime fixtures: `fx-ex01-fx-spot` through `fx-ex07-non-deliverable-forward`
  - Test with full handling of all case variations:
    - Spot vs forward
    - Non-deliverable vs deliverable forward
    - Settlement instructions
    - Split settlements
    - Cross rates
  - Use framework (Maven,JUnit,Mockito) and ensure Rosetta CDM dependency correctly resolves

## Validation Gates
1. **Static Compile Check**: Ensure generated Java code compiles without Rosetta or CDM dependency errors.
2. **Gated Serialization**: Compile-time check using `cdm-rosetta-preflight.md`'s "maven-compile-gated-jackson-serialization" to confirm CDM objects can be serialized.
3. **Semantic Runtime Validation**:
   - Map runtime fixtures to CDM objects.
   - Validate CDM object structure matches expected schema.
   - Ensure no `null` embedded objects where non-null required.

## Unsupported Behavior
The following behaviors will not be supported in this scope, though they are documented for future reference in the product model:
1. `fxSwap` product mapping is not in scope for this run (future phase)
2. `fxSimpleOption`, `fxDigitalOption`, `fxBarrierOption`, `fxAverageRateOption`, `fxStrategy` product types are not in scope (future phases)
3. Settlement instruction (`settlementInstruction`) information within `exchangedCurrency` will be supported for basic destination bank/account, but not for more complex addressing of multi-leg settlements with amount splits or sub-settlements not directly in FpML example
4. `nonDeliverableSettlement` and `fixing` configuration within FpML for NDFs are not fully mapped (just the core cash settle component as per base requirement)
5. Currency conversion features like `sideRates` or `spotRate` may be optionally extended in later phases

## Traceability Requirements
For each runtime supported fixture:
1. Map FpML element to CDM object
2. Correlate FpML participant (`partyReference`) with CDM `partyReference`
3. Cross-reference `fxCoreDetailsModel`, `exchangeRate`, and settlement date elements to CDM `EconomicTerms` and `SettlementTerms`
4. Validate core attributes like `quantity`, `price`, and `currency` are present and correctly mapped
5. Trace mapping paths using Rosetta function cues:
   - Use `MapFxSingleLegCounterpartyList` to find `Counterparty` anchors
   - Use `MapFxCoreDetailsModelToSettlementPayout` to trace `SettlementPayout` relationship
   - Validate via `MapFxCoreDetailsModelQuantityWithAddress` and `MapFxCoreDetailsModelPriceWithAddress` that price/quantity geometry is consistent
   - Validate via `MapCurrencyToObservableCashWithAddress` that the underlier information is correctly mapped
6. Ensure that the abstracted Rosetta functions are directly reflected in the Java method contracts to provide traceability of intended mapping behavior

## Critic Review

## Review of Planner Plan

### Blocking Issues

- **Missing machine-checked runtime fixture section header**  
  The plan states `## Runtime supported fixtures (machine-checked)` followed by a list, but the fixtures in that list do **not** match the IDs in `run_config.runtimeFixtures`, which are:  
  `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, `fx-ex03-fx-fwd`, `fx-ex04-fx-fwd-w-settlement`, `fx-ex05-fx-fwd-w-ssi`, `fx-ex06-fx-fwd-w-splits`, `fx-ex07-non-deliverable-forward`.  
  The plan's list uses hyphenated names like `fx-ex01-fx-spot` but includes `fx-ex02-spot-cross-w-side-rates`, `fx-ex03-fx-fwd`, etc., **without the `fx-` prefix before the run id** — i.e., they should be `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, etc., but the plan's bullets say `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, etc. — **this is correct**.  
  However, the run config only supports these 7 fixtures, and the plan *does* list exactly those seven IDs under the "Runtime supported fixtures" section. So no block here.

  ⚠️ Wait: let's compare the plan’s bullet list:
  ```
  - fx-ex01-fx-spot
  - fx-ex02-spot-cross-w-side-rates
  - fx-ex03-fx-fwd
  - fx-ex04-fx-fwd-w-settlement
  - fx-ex05-fx-fwd-w-ssi
  - fx-ex06-fx-fwd-w-splits
  - fx-ex07-non-deliverable-forward
  ```
  Run config has:
  ```
  runtimeFixtures:
  - fx-ex01-fx-spot: fx-ex01-fx-spot.xml
  - fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
  - fx-ex03-fx-fwd: fx-ex03-fx-fwd.xml
  - fx-ex04-fx-fwd-w-settlement: fx-ex04-fx-fwd-w-settlement.xml
  - fx-ex05-fx-fwd-w-ssi: fx-ex05-fx-fwd-w-ssi.xml
  - fx-ex06-fx-fwd-w-splits: fx-ex06-fx-fwd-w-splits.xml
  - fx-ex07-non-deliverable-forward: fx-ex07-non-deliverable-forward.xml
  ```

  ✅ They match **exactly**.

- **Citation of Rosetta functions for FX single-leg mapping**  
  ✅ The plan explicitly lists and traces back to multiple Rosetta functions (`MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`, `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`, `MapFxCoreDetailsModelToSettlementPayout`, etc.), and these are all present and well-documented in `rosetta-generation-context.md`.

- **Use of raw JSON construction as internal CDM model**  
  ✅ The plan explicitly states:  
  > "Utilize Rosetta-generated CDM Java objects directly as internal representation"  
  and cites the preflight mode as `maven-compile-gated-jackson-serialization`, which is aligned with `cdm-rosetta-preflight.md`. So no raw JSON construction here.

- **Citation of CDM/Rosetta classes unsupported by preflight**  
  The plan lists the following CDM classes:  
  `Trade`, `TradeState`, `NonTransferableProduct`, `EconomicTerms`, `Payout`, `SettlementPayout`, `ResolvablePriceQuantity`.  
  Preflight (`cdm-rosetta-preflight.md`) confirms all of these are required and validated, and their full class paths are present.

- **Broad FX support claims without fixture gates**  
  ✅ The plan has strict `## Runtime supported fixtures (machine-checked)` and `## Implementation scope (machine-checked)` sections. All “Supported FX Products” are explicitly limited to runtime fixtures and all “Observed Unsupported FX Products” are clearly marked as out of scope. No broad or unwarranted FX claims.

- **Evidence/runtime support confusion**  
  ✅ The plan clearly distinguishes between “Runtime supported fixtures” (7 fixtures) and “Observed Unsupported FX Products”, and only tests runtime fixtures. It does not claim to support fx-swap, options, strategies, etc.

### Non-blocking Concerns

- **Test section: missing runtime fixture reference format**  
  The tests list “Run-time support: Test using runtime fixtures: fx-ex01-fx-spot through fx-ex07-non-deliverable-forward”, but the exact fixture IDs in `run_config` include hyphen-separated suffixes like `fx-ex05-fx-fwd-w-ssi`. The plan could more precisely cite the *exact* IDs (e.g., `fx-ex05-fx-fwd-w-ssi`, not just “fx-fwd-w-ssi”).

- **Traceability: mapping SSI/splits not validated against test evidence**  
  The plan notes:  
  > “Settlement instruction (`settlementInstruction`) information within `exchangedCurrency` will be supported for basic destination bank/account, but not for more complex addressing of multi-leg settlements with amount splits or sub-settlements not directly in FpML example”  
  However, `fx-ex06-fx-fwd-w-splits.xml` *does* contain split settlements (per fixture evidence), and `fx-ex04-fx-fwd-w-settlement.xml` and `fx-ex05-fx-fwd-w-ssi.xml` include settlement instructions. While not explicitly out of scope, the plan’s “Unsupported Behavior” does not clearly state whether splits (e.g., `splitSettlement`) are *supported* or *unsupported*.  
  This is a low-severity gap; not blocking, but should be clarified.

- **Optional extension note: “sideRates” and “spotRate”**  
  The plan says:  
  > “Currency conversion features like `sideRates` or `spotRate` may be optionally extended in later phases”  
  This is fine as a “future reference” note, but `fx-ex02` and `fx-ex03` *do* contain `spotRate` and `forwardPoints`, and the expected CDM for those *does* include composite pricing (`composite.baseValue`, `operand`, etc.). Since these are in runtime fixtures, the Java implementation must support them to pass the tests — so labeling them as “optional extension” could be misleading.  
  🛑 This is a non-blocking concern — the plan does not say “ignore these”; it just labels them as optional for *later phases*. But for this run, they *must* be supported.

### Summary of Machine-Checked Sections

- ✅ **Implementation scope (machine-checked)**  
  - ✅ Contains `## Implementation scope (machine-checked)` header  
  - ✅ Includes `**In scope (implementation groups):**` bullet with `fx-single-leg`  
  - ✅ Includes `currentImplementationGroup` (implicitly via product scope)  
  - ✅ Matches `productGroups[].group` slugs (`fx-single-leg`, `currentImplementationGroup`)  
- ✅ **Runtime supported fixtures (machine-checked)**  
  - ✅ Contains `## Runtime supported fixtures (machine-checked)` header  
  - ✅ Lists **exactly** the 7 fixture IDs from `run_config.runtimeFixtures`  
  - ✅ No extraneous or missing IDs

### Final Decision

✅ The plan is well-structured, grounded in preflight and Rosetta function evidence, and correctly scoped. The minor concerns are non-blocking and can be improved in a follow-up.

Decision: ACCEPTED

## Critique Resolution

```markdown
# Critique Review & Implementation Decision

## Validated Critique Items

### ✅ Valid — **Runtime fixture ID precision in test section (non-blocking)**  
**Critique Item**: The test section says *"Test using runtime fixtures: fx-ex01-fx-spot through fx-ex07-non-deliverable-forward"*, but the exact IDs include hyphenated suffixes like `fx-ex05-fx-fwd-w-ssi`, and the phrasing *"through fx-ex07"* could be ambiguous.

**Assessment**: ✅ **Valid**  
**Reason**: While the fixture list above is exact, the test bullet's phrasing is imprecise and could confuse implementers. Better:  
> `Test using exact runtime fixture IDs: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward.`  
This is a *clarity* issue, not a functional flaw.

---

### ✅ Valid — **Ambiguity around split settlements and settlement instructions (non-blocking)**  
**Critique Item**: The plan states *"Settlement instruction [...] will be supported for basic destination bank/account, but not for more complex addressing of multi-leg settlements with amount splits or sub-settlements not directly in FpML example"*, yet runtime fixtures `fx-ex04`, `fx-ex05`, and `fx-ex06` *do* contain settlement instructions and split settlements.

**Assessment**: ✅ **Valid**  
**Reason**: The “Unsupported Behavior” section should explicitly clarify whether *simple* split settlements (as in `fx-ex06`) *are* supported or not. Given the runtime fixtures include them, and CDM supports splits (`SplitSchedule`, `SplitAmountSchedule`, etc.), the implementation *must* support at least basic split settlement handling to pass validation.  
→ Recommended revision:  
> “Basic split settlements (e.g., `fx-ex06-fx-fwd-w-splits.xml`) are supported; complex sub-settlements or nested splits beyond FpML example structure are out of scope.”

---

### ✅ Valid — **Misleading “optional extension” phrasing for `spotRate`/`forwardPoints` (non-blocking)**  
**Critique Item**: The plan labels `spotRate` and `sideRates` as “optional extension for later phases”, yet `fx-ex02` (spot with cross rates) and `fx-ex03` (forward) *do* include these, and the CDM expected outputs contain composite pricing (e.g., `CompositePrice`, `CompositeAmount`), so they *must* be supported this round.

**Assessment**: ✅ **Valid**  
**Reason**: The phrase “may be optionally extended” risks under-implementation. Since these are present in runtime fixtures, they are *requirements*, not optional.  
→ Recommended revision:  
> “`spotRate`, `forwardPoints`, and `sideRates` are *supported this round* via composite price/quantity construction; more advanced rate interpolation or multi-bank averaging may be extended later.”

---

## Invalid Critique Items (Rejected)

### ❌ Invalid — *"Missing machine-checked runtime fixture section header"*  
**Critique Claim**: The header exists but was misinterpreted as “not matching”.

**Assessment**: ❌ **Rejected**  
**Reason**:  
- The plan *does* contain `## Runtime supported fixtures (machine-checked)`.  
- All 7 fixture IDs match *exactly* with `run_config.runtimeFixtures` (verified by both reviewers and runtime evidence in `00-product-scope.json` and `evidence-index.md`).  
- The reviewer’s “⚠️ Wait: let's compare...” self-correction confirms alignment — no error.

---

### ❌ Invalid — *Other syntactic/semantic concerns (Rosetta functions, CDM classes, scope)*  
**Critique Claim**: Various concerns about function citation, CDM class validity, and scope creep.

**Assessment**: ❌ **Rejected**  
**Reason**:  
- All cited Rosetta functions (`MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`, etc.) are present and documented in `rosetta-generation-context.md`.  
- All listed CDM classes (`Trade`, `NonTransferableProduct`, `EconomicTerms`, `Payout`, `SettlementPayout`, `ResolvablePriceQuantity`) are confirmed required in `cdm-rosetta-preflight.md`.  
- Scope is strictly bounded: only `fx-single-leg` (7 fixtures), all other products clearly marked as *out of scope*.  
→ The plan is **semantically sound and traceable**.

---

## Decision: ACCEPTED

### Rationale
- ✅ The plan is **well-scoped**, grounded in **Rosetta function evidence**, **CDM preflight**, and **product scope**.  
- ✅ All **machine-checked sections** (`## Implementation scope (machine-checked)`, `## Runtime supported fixtures (machine-checked)`) are complete and validated.  
- ✅ The plan correctly uses **Rosetta-generated CDM objects** as the internal representation (no raw JSON), aligning with `cdm-rosetta-preflight.md`’s `maven-compile-gated-jackson-serialization` mode.  
- ✅ Minor concerns are **non-blocking** and can be addressed in a minor revision or next round.

---

## Revised Implementation Checklist (Post-Critique Acceptance)

> ✅ **All changes are suggestions only — no rejection or blocking issues.**

1. **Test Section Update**  
   - Replace:  
     `Test using runtime fixtures: fx-ex01-fx-spot through fx-ex07-non-deliverable-forward`  
   - With:  
     ```markdown
     - Test using exact runtime fixture IDs:
       `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, `fx-ex03-fx-fwd`,
       `fx-ex04-fx-fwd-w-settlement`, `fx-ex05-fx-fwd-w-ssi`, `fx-ex06-fx-fwd-w-splits`,
       `fx-ex07-non-deliverable-forward`
     ```

2. **Unsupported Behavior: Clarify Split Settlements**  
   - Revise bullet 3 to:  
     > “Basic split settlements (e.g., `splitSettlement` in `fx-ex06`) are supported. Nested or sub-settlements not present in FpML examples are not supported.”

3. **Unsupported Behavior: Fix `spotRate`/`forwardPoints` Labeling**  
   - Revise bullet 5 to:  
     > “`spotRate`, `forwardPoints`, and `sideRates` are fully supported this round via composite price/quantity structures. Advanced rate interpolation (e.g., multi-bank averaging) may be extended in later phases.”

4. **Optional: Add Validation Test for Composite Pricing**  
   - Explicitly test in test section:  
     > “Validate composite pricing (`priceSchedule`/`quantitySchedule`) for `fx-ex02` (spot with side rates) and `fx-ex03` (forward with forward points).”

---

## Final Approval

**Decision**: ✅ **ACCEPTED**  
**Next Step**: Implementer proceeds with the above minor refinements to improve clarity and reduce ambiguity. No additional planning rounds required unless test failures reveal hidden gaps.

**Traceability Check**:  
- ✅ All 7 runtime fixtures → covered by `fx-single-leg` implementation group  
- ✅ All Rosetta functions traced → Java method contracts  
- ✅ CDM classes validated by preflight  
- ✅ Scope bounded by product-scope JSON and `run_config.runtimeFixtures`
```

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-04T14-49-07-533Z\agent-workspace\evidence-packet.md
```

Use evidence-index.md and get_context_packet when implementer or repair roles need detail; do not assume this file repeats evidence content.
