# Critique Review Decision

## Validated Critique Items

| # | Critique Item | Validity | Reason |
|---|---------------|----------|--------|
| 1 | **In-scope group mismatch**: The plan incorrectly expands `fx-single-leg` scope by listing six distinct "runtime supported FX products" rather than acknowledging seven fixtures of *one* product type (`fxSingleLeg`). | ✅ **Valid** | The `00-product-scope.json` and `00-product-scope.md` clearly define `fx-single-leg` as having **7 fixtures**, all with root `<fxSingleLeg>`. The plan conflates fixture variations (e.g., `fx-ex06` with splits, `fx-ex04`/`fx-ex05` with different settlement patterns) with distinct runtime product types. The validation gates should be fixture-based, not product-type-aliased. |
| 2 | **“Tests” section introduces unsupported test frameworks**: Gatling performance tests and integration tests for dependent components are promised but absent from `00-input-brief` and `00-product-scope`. | ✅ **Valid** | The brief explicitly requires: *“Generate a Java Maven mapper project, run gates, and repair failures.”* There is **no mention** of performance testing, Gatling, or integration testing. Adding these violates scope constraints. |
| 3 | **“Java Package/Class Design” includes speculative future classes**: `FxSwapMapper`, `FxOptionMapper`, and `FxDigitalOptionMapper` are listed with “(future)” notes despite the current run being strictly `fx-single-leg`. | ✅ **Valid** | The brief mandates: *“Use the precomputed product-scope guidance… instead of discovering product scope through broad search.”* Including classes for out-of-scope groups violates the staged-by-product-group strategy and introduces noise. |
| 4 | **“Runtime Supported FX Products” list misleads by implying product-type count (6) rather than fixture count (7)**. | ✅ **Valid** | The product scope JSON lists 7 fixtures in `fx-single-leg`. Labeling them as six “runtime supported FX products” misrepresents coverage and risks gate design errors. |
| 5 | **Confusion between Rosetta evidence sources and runtime dependencies**: The plan mentions “Rosetta patterns” and “Rosetta function usage” as runtime requirements, but Rosetta blocks are only *evidence* for mapping. | ✅ **Valid** | The brief explicitly requires: *“The shipped Java mapper runtime must not call an LLM.”* Rosetta blocks are source evidence—not runtime libraries. The plan must avoid conflating evidence with runtime dependencies. |

## Rejected Critique Items

| # | Critique Item | Rejection Reason |
|---|---------------|------------------|
| N/A | N/A | All critiques were valid; none rejected. |

---

## Decision: **NEXT_ROUND_REQUIRED**

### Required Fixes for Next Round

The planner **must** revise the plan to align strictly with `00-product-scope.json` constraints. The next iteration should:

1. **Update “Runtime Supported FX Products” → “Runtime Supported Fixtures”**  
   Replace the six product-type aliases with the **seven fixture paths** from `fx-single-leg`, e.g.:  
   - `fx-ex01-fx-spot.xml`  
   - `fx-ex02-spot-cross-w-side-rates.xml`  
   - `fx-ex03-fx-fwd.xml`  
   - `fx-ex04-fx-fwd-w-settlement.xml`  
   - `fx-ex05-fx-fwd-w-ssi.xml`  
   - `fx-ex06-fx-fwd-w-splits.xml`  
   - `fx-ex07-non-deliverable-forward.xml`

2. **Remove unsupported test components**  
   Delete references to **Gatling** and **integration tests**. Replace with:  
   - Unit tests for each of the 7 fixtures  
   - JSON diff validation against corresponding `cdm_parallel` JSON files  
   - Runtime gate: successful execution and structural fidelity for all fixtures

3. **Refactor “Java Package/Class Design”**  
   Retain only `FxSingleLegMapper` in this round. Move `FxSwapMapper`, `FxOptionMapper`, etc., to a future `fx-swap` or `fx-simple-option` implementation group proposal with an explicit “Implementation Group Change Proposal”.

4. **Clarify Rosetta’s role**  
   Add: *“Rosetta blocks serve as mapping evidence, not runtime dependencies. The generated Java code will implement the mappings without external Rosetta runtime libraries.”*

---

## Revised Implementation Checklist (for next round)

### Scope & Coverage
- [ ] In-scope group: `fx-single-leg` (7 fixtures, all `<fxSingleLeg>`).
- [ ] Out-of-scope groups: explicitly listed and deferred.
- [ ] Fixtures (not product types) define runtime coverage.

### Runtime Constraints
- [ ] No LLM calls in runtime code.
- [ ] No external Rosetta runtime libraries—only evidence-derived mappings.
- [ ] Pure Java implementation (Maven project, Java 17+).

### Tests & Validation
- [ ] Unit tests for all 7 fixtures.
- [ ] JSON diff validation against `cdm_parallel` targets.
- [ ] Validation gates:  
  - No data loss in mapping  
  - Exact CDM path fidelity for key fields (party roles, dates, amounts)  
  - All trade identifiers preserved with scheme

### Package/Class Design
- [ ] Single mapper class: `com.fpml.fx.mapper.FxSingleLegMapper`.
- [ ] Future mappers excluded from current scope.

### Traceability
- [ ] Each mapping step traceable to FpML → CDM paths in `evidence-packet.md`.
- [ ] Comments/method names reflect traceability (e.g., `mapPartyReference`, `normalizeTradeDate`).

### Out-of-Scope Clarification
- [ ] FX options, swaps, strategies, and non-FX products explicitly deferred.

---

✅ **After addressing these items, the plan will be accepted for implementation.**