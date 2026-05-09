# Plan Validation Decision

**Decision: NEXT_ROUND_REQUIRED**

---

## Valid Critique Items

### ✅ Valid: Fixture IDs Missing — `Runtime supported fixtures` section uses filenames instead of IDs

- **Reasoning**:  
  - The `00-run-config/runtimeFixtures` explicitly defines fixture IDs as keys (e.g., `fx-ex01-fx-spot`), with values being file paths (e.g., `fx-ex01-fx-spot.xml`).  
  - `plan-validation.md` fails with:  
    > `Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex01-fx-spot`  
    and repeats for all 7 fixtures — confirming the list is parsed as *empty* (none of the IDs were extracted).  
  - The `critic-review.md` correctly identifies that the format `id: filename.xml` is *invalid* — the section must list IDs *alone*, one per line (e.g., `- fx-ex01-fx-spot`), not `id: file.xml`.  
  - This is a structural, machine-readable requirement per `plan-validation.md`’s `structured-section` mode and the validator spec.

- **Required fix**:  
  Change from:
  ```markdown
  ## Runtime supported fixtures (machine-checked)
  - fx-ex01-fx-spot: fx-ex01-fx-spot.xml
  ...
  ```
  To:
  ```markdown
  ## Runtime supported fixtures (machine-checked)
  - fx-ex01-fx-spot
  - fx-ex02-spot-cross-w-side-rates
  - fx-ex03-fx-fwd
  - fx-ex04-fx-fwd-w-settlement
  - fx-ex05-fx-fwd-w-ssi
  - fx-ex06-fx-fwd-w-splits
  - fx-ex07-non-deliverable-forward
  ```

---

### ✅ Valid: Contradictory CDM Class List — Allowed vs. Forbidden

- **Reasoning**:  
  - `cdm-java-negative-classes.md` unambiguously lists `SettlementPayout` and `ResolvablePriceQuantity` as *forbidden* (both have `: not found in ...`).  
  - Yet, the plan’s **Allowed Classes** section includes them *with notes*:
    ```java
    - `cdm.product.common.settlement.SettlementPayout` ... - **Note: Not in API Pack**
    - `cdm.observable.asset.ResolvablePriceQuantity` ... - **Note: Not in API Pack**
    ```
  - This creates a contradiction:  
    → If a class is *forbidden* (not in JAR), it must not appear in *Allowed Classes*.  
    → Planning must exclude such classes entirely, or propose a *fallback* (e.g., “use `cdm.product.template.SettlementPayout` if available; otherwise, restructure via `Payout` + `PriceQuantity`”).

- **Required fix**:  
  - Remove `SettlementPayout` and `ResolvablePriceQuantity` from the **Allowed Classes** list.  
  - Update **Mapping Responsibilities** and **Payout Mapping** sections to state:  
    > Since `SettlementPayout` and `ResolvablePriceQuantity` are not available (per `cdm-java-negative-classes.md`), we will use **only** `Payout`, `PriceQuantity`, and `Observable`.  
    > Rosetta’s `MapFxCoreDetailsModelToSettlementPayout` will be emulated via composition of `Payout` with inline `SettlementPayout` semantics (e.g., via `Payout` + `SettlementTerms` + `ResolvablePriceQuantity` re-expressed as `PriceQuantity`).

---

### ✅ Valid: FpML DTO Naming — `FpmlFxSingleLegDto` is acceptable *but* needs clarity

- **Reasoning**:  
  - `FpmlFxSingleLeg` (the real Rosetta function signature class) is explicitly forbidden (negative class list), so `*Dto` suffix is correct.  
  - However, the plan’s example `mapFxSingleLeg(FpmlFxSingleLeg fpmlFxSingleLeg)` is inconsistent — it still references the forbidden class name in signature (should use `FpmlFxSingleLegDto`).  
  - While not blocking, it risks copy-paste errors in implementation.

- **Recommended fix (non-blocking)**:  
  Rename internal DTO method signature to:
  ```java
  public static Trade mapFxSingleLeg(FpmlFxSingleLegDto fpml) { ... }
  ```

---

## Rejected Critique Items

### ❌ Invalid: “Architecture gap in Rosetta function invocation”

- **Claim**: *“Does not specify how Java invokes Rosetta logic — via compiled Rosetta JAR or JIT”*  
- **Rejection**:  
  - This is *not* a plan defect — it is a *deployment choice* (runtime or ahead-of-time).  
  - The plan *does* state:  
    > Generated Java mapping code must **Call Rosetta Functions** from `rosetta-generation-context.md`  
    and lists the required functions.  
  - The CDM/Rosetta ecosystem *already* supports two modes:  
    1. Precompiled Rosetta functions (via `rosetta-validator-1.0.0.jar`),  
    2. Just-in-time Rosetta (if embedded),  
  - Since `cdm-rosetta-preflight.md` confirms `rosetta-validator` is built and ready, no further architectural detail is required at *planning* stage.

---

## Revised Implementation Checklist (for next round)

1. **Update `Runtime supported fixtures` section**  
   - List *only* fixture IDs (no filenames), matching `00-run-config/runtimeFixtures` keys.

2. **Prune forbidden classes from Allowed Classes list**  
   - Remove `SettlementPayout`, `ResolvablePriceQuantity`  
   - Replace in *Payout Mapping* responsibility with:  
     > Use `Payout` with inline settlement semantics (no `SettlementPayout`).  
     > Use `PriceQuantity` for price/quantity (no `ResolvablePriceQuantity`).

3. **Standardize DTO naming**  
   - Rename `FpmlFxSingleLeg` → `FpmlFxSingleLegDto` everywhere in the plan.  
   - Example: `mapFxSingleLeg(FpmlFxSingleLegDto)`.

4. **Add fallback justification for missing CDM classes**  
   - Explicitly cite `cdm-java-negative-classes.md` as the reason and describe how Rosetta functions will be *emulated* using only available classes (e.g., `SettlementPayout` semantics → `Payout` + `SettlementTerms` + `PriceQuantity`).

5. **Clarify traceability**  
   - Add a bullet:  
     > Each mapping step will be tagged with the Rosetta function name (e.g., `MapFxCoreDetailsModelToSettlementPayout`) for auditability.

---

✅ **Next Round Must Address**:  
- **Fix fixture ID formatting** (blocking per validator)  
- **Remove forbidden class references** (semantic consistency)  
- Optionally clarify DTO and fallback strategy (non-blocking but recommended)

Once resolved, this plan will pass validation.