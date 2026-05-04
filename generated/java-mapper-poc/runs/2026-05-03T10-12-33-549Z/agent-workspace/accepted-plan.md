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

## FX derivatives implementation plan

This plan is for the initial staged generation of FX derivatives mapper targeting the `fx-single-leg` implementation group as the default starting point. The scope is limited to FX single-leg products (spot, forward) and excludes all non-FX products as well as other FX product types (swap, options, barrier, etc.) in this phase.

### Supported FX products for this run

**In scope:**
- `fx-single-leg`: 7 fixtures covering spot and forward FX transactions, including cross-rate and NDF scenarios.

**All referenced files in scope:**
```text
data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex03-fx-fwd.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex06-fx-fwd-w-splits.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex07-non-deliverable-forward.xml
```

**Observed unsupported FX products**
Other product types, such as `fx-swap`, `fx-simple-option`, etc., are not planned for this phase.

### Java package/class design

A `fx.singleleg` package is selected as the core Java package for generated classes targeting the `fx-single-leg` group. Classes implementing mapping logic are expected to follow these conventions:
- `FxSingleLegMapper`: Main mapper class handling both parser and consumer aspects.
- `FxSingleLegParser`: XML parser implementation for FpML.
- `FxSingleLegConsumer`: Abstract CDM transform implementation.
- `FxSingleLegMapperImpl`: Concrete parser-consumer adapter.
- Secondary classes can be created for value objects and support structures (e.g., `FxSingleLegTrade`, `FxSingleLegPayment`).

### Mapping responsibilities

- Parsing of FpML `fxSingleLeg` sections into intermediate objects.
- Conversion of payment amounts (currency and value) into CDM primitives.
- Map FX rate (exchange rate), spot rate, and forward points into CDM quantities.
- Date handling (values with or without trailing 'Z').
- Party identification and mapping between FpML href references and CDM party roles (Party1/Party2).
- Settlement instructions (SWIFT, etc., depending on fixture examples).

### Tests

Generated Java classes are expected to be unit tested using JUnit.
- Test each identified `fx-single-leg` fixture.
- All test cases are expected to pass within the scope of this phase.
- Testing should cover both mapping correctness and runtime behavior.

### Validation gates

Published rules from `data/agent-cookbook/latest/product-families/fx-derivatives.md` represent the recipe for transformation:
- `RULE-001` - Trade identifier -> `assignedIdentifier.value`.
- `RULE-002` - Trade date normalization (remove trailing 'Z').
- `RULE-005` - Payment amounts -> CDM quantities.
- `TR-001` - Resolve party hrefs -> CDM party references.
- `TR-002` - Date normalization (trim trailing 'Z').
- `TR-003` - Expiry date/time/businessCenter -> exerciseTerms.expiration (optional; not needed for fx-single-leg).

### Unsupported behavior

This phase does not produce any code for the following:
- FX products other than `fx-single-leg`.
- Any FX derivative offering that is not a basic single leg (e.g., swaps, options).
- Complex FX features requiring future rule expansion (e.g., fixing dates, averaging terms, digital features).
- Functionalality that depends on missing schemas (e.g., `cdm.base`) or complex financial modeling libraries beyond the requirements of basic FX payment and party mapping.

### Traceability requirements

Traceability to source and target is critical:
- Source FpML fixtures must be fully parsed and validated.
- All CDM mapping paths are validated against the evidence packet.
- Key transformation rules are linked from `fx-derivatives.md` and its supporting evidence.
- Use of Rosetta `fxsingleleg-func.rosetta` blocks as reference for core mapping functions:
  - `MapFxSingleLegCounterpartyList`
  - `MapFxSingleLegAncillaryPartyList`
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
  - `MapFxSingleLegAccountPartyReference`

## Critic Review

## Review of Planner Plan (round-01)

### 1. Machine-checked implementation scope verification

✅ **In scope section correctly matches `00-product-scope.json`:**

- `currentImplementationGroup: "fx-single-leg"` is correctly listed in **In scope** bullets.
- All other groups (`fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, `non-fx`) are correctly listed in **Explicitly out of scope**.

✅ **Fixture list matches `00-product-scope.json`:**

All 7 fixtures for `fx-single-leg` are correctly identified and their paths match the source JSON.

✅ **Product group labels and metadata match evidence packet:**

- Correct usage of `fx-single-leg: 7 fixture(s), good-first-target`.
- Correct description of supported products: “spot and forward FX transactions, including cross-rate and NDF scenarios”.

### 2. Mapping responsibilities & validation gates

✅ **Correctly mapped rules from evidence packet:**

- `RULE-001`, `RULE-002`, `RULE-005`, `TR-001`, `TR-002`, `TR-003` are correctly identified from `fx-derivatives.md`.
- TR-003 is appropriately marked as optional/not needed for fx-single-leg — consistent with evidence.

✅ **Rosetta references are accurate:**

The list of Rosetta blocks (`MapFxSingleLeg*`) matches the `rosetta-source/latest/docs/product-families/fx.md` and `shared-ingest.md` evidence.

### 3. Non-blocking concerns

⚠️ **Overreach in “Tests” section**  
The plan states: *“All test cases are expected to pass within the scope of this phase.”*  
→ **Risk**: Overpromises runtime outcome. Tests will be auto-generated and must be verified by build gates, not assumed to pass at planning time.

⚠️ **Java class names may be too prescriptive**  
Specific class names like `FxSingleLegMapperImpl` or `FxSingleLegPayment` are recommended, but their necessity (vs. using standard CDM adapters) is not justified. The implementer and repair agents can refine naming.

⚠️ **Missing explicit mention of `java-mapper-poc` structure**  
The run context specifies a Maven project in `generated/java-mapper-poc`. The plan does not explicitly reference expected Maven coordinates (`groupId`, `artifactId`, `src/main/java`), although the implementer may infer them.

### 4. Evidence/runtime confusion

✅ **No runtime/agent-runtime confusion detected.**  
The plan stays in the planning layer, correctly referencing `evidence-packet.md`, `00-product-scope.json`, and cookbook paths. No runtime calls or LLM execution are implied in the planner’s description.

✅ **No false attribution of evidence.**  
All rules, Rosetta functions, and fixture paths are correctly attributed to their respective evidence sources.

---

**Decision: ACCEPTED**

The planner plan satisfies the machine-checked scope requirement, contains no blocking mappings or evidence misrepresentation, and is appropriate for a first round of staged generation for the `fx-single-leg` group.

- **Blocking issues**: None  
- **Non-blocking concerns**: Minor overpromise in test expectations and prescriptive naming (non-blocking; can be refined by implementer).  
- **Evidence/runtime confusion**: None  
- **Runtime/agent-runtime confusion**: None

## Critique Resolution

# Critique Review Decision

**Decision: ACCEPTED**

The planner plan for round-01 passes all machine-checked constraints and evidence alignment checks. There are no blocking issues, no evidence misrepresentations, and no unsafe or impossible commitments.

## Validated Critique Items

| # | Critique Item | Valid? | Reason |
|---|---------------|--------|--------|
| 1 | **Machine-checked scope matches `00-product-scope.json`** | ✅ Valid | The current implementation group `fx-single-leg` and all out-of-scope groups are correctly listed and match the authoritative JSON. |
| 2 | **Fixture list matches evidence** | ✅ Valid | All 7 `fx-single-leg` fixtures are correctly identified with paths consistent with `00-product-scope.json`. |
| 3 | **Rules from `fx-derivatives.md` correctly identified** | ✅ Valid | `RULE-001`, `RULE-002`, `RULE-005`, `TR-001`, `TR-002`, and optional `TR-003` are correctly cited. TR-003 appropriately marked as optional. |
| 4 | **Rosetta references accurate** | ✅ Valid | The listed `MapFxSingleLeg*` functions match `rosetta-source/latest/docs/product-families/fx.md`. |
| 5 | **“All test cases expected to pass” overpromise** | ⚠️ Non-blocking concern | Overpromises runtime success; tests will be generated and must be verified by build gates, not assumed at planning time. Does not invalidate plan — can be corrected by implementer or repair agent. |
| 6 | **Class names too prescriptive** | ⚠️ Non-blocking concern | Suggesting `FxSingleLegMapperImpl` etc. is not inherently wrong, but naming can be refined by implementer. No evidence of conflict with CDM adapters. |
| 7 | **Missing Maven coordinates** | ⚠️ Minor context gap | The plan omits explicit `groupId/artifactId` or Maven layout guidance. However, run context (`generated/java-mapper-poc`) provides sufficient grounding for the implementer to infer conventions. |

## Evidence/Runtimes Confirmed

- ✅ No false attribution of rules, Rosetta blocks, or fixture paths.
- ✅ Plan stays strictly in the planning layer — no runtime or LLM calls are implied.
- ✅ All guidance correctly traced to `evidence-packet.md`, `00-product-scope.json`, and `data/agent-cookbook/latest/product-families/fx-derivatives.md`.

## Revised Implementation Checklist (Post-Critique)

With the above valid items acknowledged, here is the recommended **accepted implementation checklist**, incorporating minor non-blocking refinements:

```markdown
# ✅ Accepted Implementation Checklist (Round-01)

## Scope & Product Map
- [ ] Implement only `fx-single-leg` fixtures: fx-ex01 through fx-ex07.
- [ ] Exclude `fx-swap`, `fx-simple-option`, `fx-barrier-option`, `fx-digital-option`, `fx-average-rate-option`, `fx-strategy`, and `non-fx`.
- [ ] Respect all paths and fixtures defined in `00-product-scope.json` (do not invent new paths).

## Code Generation & Structure
- [ ] Create Maven project under `generated/java-mapper-poc`.
- [ ] Use Java package `com.example.fx.singleleg` (or equivalent) for generated classes.
- [ ] Implement mapping logic in classes aligned with:
  - `MapFxSingleLegCounterpartyList`
  - `MapFxSingleLegAncillaryPartyList`
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
  - `MapFxSingleLegAccountPartyReference`
- [ ] Use standard CDM adapter patterns where appropriate (do not require arbitrary naming like `FxSingleLegMapperImpl` unless justified).

## Validation Gates (per fx-derivatives.md)
- [ ] `RULE-001`: FpML `tradeId` → `trade.tradeIdentifier.assignedIdentifier.identifier.value`
- [ ] `RULE-002`: FpML `tradeDate` with trailing `Z` → CDM `trade.tradeDate.value` without `Z`
- [ ] `RULE-005`: `exchangedCurrencyX.paymentAmount` → CDM `trade.tradeLot.quantity` (value + unit.currency)
- [ ] `TR-001`: Resolve FpML `partyReference` hrefs → CDM `partyReference.globalReference` and roles
- [ ] `TR-002`: Date normalization (trim `Z`)
- [ ] Optional: `TR-003` — only if option-like expiry fields are present (not applicable to `fxSingleLeg`)

## Tests & Gates
- [ ] Generate JUnit tests for each of the 7 fixtures.
- [ ] Build gates must verify *actual* test pass/fail — do not assume success at planning time.
- [ ] Report failures via `validation-report.json`.

## Traceability & Quality
- [ ] Produce `traceability-report.json` linking each mapping to the relevant rule + evidence snippet.
- [ ] Document unsupported or unhandled features in `unsupported-scope.json`.
- [ ] Emit `generated-cdm.json` for one canonical target structure (e.g., fx-ex01 as sample).

## Compliance
- [ ] No calls to LLM at runtime.
- [ ] No access to agent workspace (`00-*.md`) at runtime.
- [ ] Generated Java code must be pure mapper logic — no inference or language model execution.
```

## Next Steps

✅ **Plan is accepted.** Proceed to the **implementer** phase to generate Maven project, Java mapper classes, and unit tests for `fx-single-leg`.

If the implementer encounters unresolvable gaps (e.g., missing Rosetta primitives, missing CDM primitives, or unimplemented parsing paths), the **repair** agent may invoke one additional round — but this round-01 plan is fully acceptable as the foundation.

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-03T10-12-33-549Z\agent-workspace\evidence-packet.md
```

Evidence packet excerpt:

# Evidence Packet

Generated: 2026-05-03T10:12:33.608Z

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
