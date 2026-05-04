```markdown
# Critique Review: Planning Round 3

## Validity Assessment of Critique Items

| # | Critique Item | Valid? | Reason |
|---|----------------|--------|--------|
| 1 | **Runtime LLM dependency concern (critical)** | ✅ **Valid** | The current phrasing — “Generated code must contain zero external dependencies on AI models or runtime LLMs” — is a *negative constraint* but does not *affirmatively forbid* runtime LLM invocation (e.g., via fallback, decision routing, or heuristic fallback). The validator correctly flags ambiguity: the plan *intends* to forbid LLM usage but lacks a *positive, machine-checkable prohibition* (e.g., “All logic must be statically compiled and deterministic per Rosetta semantics”). This opens interpretation risk for future implementations. The `cdm-rosetta-preflight.md` strategy (`maven-compile-gated-jackson-serialization`) and `rosetta-generation-context.md`’s pure functional mapping confirm LLMs have no role — but the plan must *explicitly codify* that, not just negate it. |
| 2 | **Missing runtime fixture IDs in “Runtime supported fixtures (machine-checked)”** | ❌ **Invalid** | The 7 listed IDs (`fx-ex01-fx-spot`, …) directly match the `run_config` keys (`fx-ex01-fx-spot: fx-ex01-fx-spot.xml`). The `evidence-index.md` “none” entry refers to *runtime execution fixtures* (not planned support), and the plan correctly identifies all 7 in its “Runtime supported fixtures” section. No ambiguity remains. |
| 3 | **Overreach in “Supported FX products for this run”** | ⚠️ **Non-blocking concern (accepted as valid, non-urgent)** | While `fx-ex02` and `fx-ex06` involve cross-currency flows or splits, they remain `fxSingleLeg` products under `rosetta-generation-context.md`. The plan correctly maps them to the `fx-single-leg` group via `MapFxCoreDetailsModelToSettlementPayout`. The description “FX spot, FX forward, Non-deliverable forward (NDF)” is a *simplified product taxonomy*, not a mapping error. No functional flaw. |
| 4 | **Missing explicit exclusion of non-FX fixtures in test scope** | ❌ **Invalid** | The “Unsupported behavior” section already clearly states `termDeposit` is excluded and “will cause validation failure if encountered.” Tests need not explicitly list *negative* cases unless required — and this is not. Clarity and correctness are maintained. |
| 5 | **Evidence for helper functions not fully cited** | ⚠️ **Non-blocking concern (accepted as valid, non-urgent)** | While not all helper functions (e.g., `MapCounterpartyRoleEnum`) are cited with Rosetta line numbers, they are *indirectly covered* via primary functions and *fully documented* in `rosetta-generation-context.md`’s “Unresolved Helper Functions” section. This satisfies traceability without over-specifying. |

✅ **Summary**: The *only blocking issue* is the insufficiently absolute phrasing on **no runtime LLM dependency** (Critique Item 1). All other items are either invalid or non-blocking and do not threaten correctness, safety, or testability.

---

## Decision: **ACCEPTED WITH REVISION**

> ✅ The plan is technically sound, faithful to Rosetta semantics, and aligned with CDM/Rosetta constraints — *once* the LLM dependency clause is tightened.

### Required Revision (MUST be applied in next round)

Add the following bullet **explicitly to the “Validation gates” section** (or as a new top-level section *“Runtime Constraints”* if preferred):

> **No runtime LLM or AI dependency**:  
> *All runtime logic must be statically compiled, deterministic, and derived solely from Rosetta semantics. The generated Java mapper must not invoke, route through, or depend on any external AI/LLM service, model, or API during execution — even as a fallback or heuristic.*

**Rationale for placement in Validation gates**:  
- Makes the constraint *machine-checkable* (e.g., via static analysis for LLM SDK usage, HTTP calls, or reflective model loading at runtime).  
- Aligns with `cdm-rosetta-preflight.md`’s “Use the CDM model object as the internal representation and serialize it at the runtime boundary” — implying *no dynamic model inference*.  
- Eliminates the ambiguity flagged by the critic: a plan that merely *does not include* LLMs is not the same as *forbidding* them.

---

### Revised Implementation Checklist (Post-Revision)

- [ ] **Add explicit LLM prohibition clause** in “Validation gates” (as above).
- [ ] ✅ Maintain current product-group boundaries (`fx-single-leg` only).
- [ ] ✅ Keep 7 runtime fixtures supported (spot, forward, NDF variants).
- [ ] ✅ Retain direct Rosetta → Java method mapping with source-line attribution.
- [ ] ✅ Preserve `org.finos.cdm.fx.singleleg` package structure (`FxSingleLegMapper`, `FxSingleLegMapperContext`).
- [ ] ✅ Keep all 11 shared helpers mapped as utilities (via `rosetta-generation-context.md`).
- [ ] ✅ Include tests for all 7 runtime fixtures + per-function validation.
- [ ] ✅ Enforce CDM type safety (`cdm-java:6.7.0` only), Jackson-only serialization, no `ObjectNode`/`ArrayNode`.
- [ ] ✅ Exclude non-FX and out-of-scope FX products explicitly.

✅ Once the LLM clause is fixed, the plan passes all validation gates and is ready for implementation.

> **Decision: ACCEPTED**
```