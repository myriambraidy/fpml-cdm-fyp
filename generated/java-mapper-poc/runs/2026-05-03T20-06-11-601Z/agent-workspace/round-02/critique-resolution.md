## Decision: ACCEPTED

The critic review raises a **valid concern** about the plan’s imprecise statement that *“all observed, all runtime supported in this phase”* for 7 FX single-leg fixtures—when the `run_config.runtimeFixtures` only lists `fx-ex01-fx-spot.xml`. This is a **critical clarification issue**, not a logic or scope failure.

However, upon analysis, **the plan is salvageable and functionally sound**, because:

### ✅ Valid Critique — Accept and Clarify, Not Reject
- **Issue**: Phrasing conflates *observed* fixtures with *runtime-supported* fixtures.
- **Resolution**: Replace misleading text with precise language:  
  > “This implementation supports **all 7 FX single-leg fixtures** for *mapping functionality*, though only **`fx-ex01-fx-spot` is designated as a runtime validation fixture**. Remaining fixtures (`fx-ex02`–`fx-ex07`) may be used for manual verification or in later phases.”  

This distinction preserves:
- The *mapper scope* (all 7 fixtures in `fx-single-leg`)
- The *runtime test scope* (`fx-ex01-fx-spot` only)
- No architectural or design issues — only terminology needs tightening.

### 🛠️ Revisions Required

The planner must update the plan’s wording in two places:

1. **Section “## Runtime supported fixtures (machine-checked)”**  
   → Current: `✅ Matches run_config.runtimeFixtures ids exactly (fx-ex01-fx-spot only).`  
   ✅ **No change needed** — already accurate.

2. **Section “## Supported FX products for this run”**  
   ❌ **Current (problematic)**:  
   > `FX single-leg: 7 fixtures (all observed, all runtime supported in this phase)`  
   **→ Revise to**:  
   > `FX single-leg: 7 fixtures (all mapping-capable; only fx-ex01-fx-spot is runtime validation fixture)`  
   Then list all 7 XML filenames.

3. **Section “## Tests”**  
   → Current:  
   > `This implementation will pass the basic validation gates for the fx-ex01-fx-spot fixture. Future tests [...] will be added [...] and are out of scope.`  
   ✅ **This is already correct** — no change needed.  
   *(Note: The test list below it can remain — it describes implementation *capabilities*, not runtime-only validations.)*

4. **Section “## Fixtures covered in this phase”**  
   → Add a footnote or clarification:  
   > *(Runtime validation covers only fx-ex01-fx-spot.xml; others may be used for regression/illustration.)*

---

### ✅ Why This Is Acceptable

- The plan **correctly identifies** `fx-ex01-fx-spot` as the *only* runtime fixture.
- All implementation responsibilities and mappings are **aligned with the CDM structure** and **sufficient for `fx-ex01-fx-spot.xml`**.
- The 7 fixtures in `fx-single-leg` are *functionally compatible* — they differ in optional elements (side rates, settlements, NDFs), which the mapper can already handle *unless explicitly excluded*. The planner rightly builds a *generalizable* mapper for the group, even if only one fixture is validated at runtime.
- The *implementation scope* (`fx-single-leg`) matches the `currentImplementationGroup`.
- The `implementationHint: "good-first-target"` is honored.

The only failure is in *communicating intent clearly* — not in design, correctness, or feasibility.

---

### ✅ Revised Implementation Checklist (Accepted Plan + Minor Clarification)

| Item | Status | Notes |
|------|--------|-------|
| ✅ Product family & group scope (`fx-derivatives` / `fx-single-leg`) | Valid | Matches `00-product-scope.json` |
| ✅ Out-of-scope groups listed explicitly | Valid | Matches `candidateNextGroups` and `productGroups` |
| ✅ Runtime fixture identified (`fx-ex01-fx-spot.xml`) | Valid | Exactly matches `run_config.runtimeFixtures` |
| ✅ All 7 FX single-leg fixtures listed as *mapping scope* | Valid | To be clarified in text only |
| ✅ Java package design (`com.rosetta.fx.mapper`) | Valid | Modular, testable, standard layout |
| ✅ FpML paths to map | Valid | Covers all required fields in `fx-ex01-fx-spot.xml` |
| ✅ CDM output alignment | Valid | Matches Rosetta `SettlementPayout` + `priceQuantity` usage |
| ✅ Traceability requirements | Valid | Constructor, emitterrail, validation points clear |
| ✅ Unsupported behaviors documented | Valid | Multi-settlement, NDF overrides, strategies excluded |
| ⚠️ Test description precision | Needs minor edit | Only `fx-ex01-fx-spot` is runtime-validated; other tests are *capability*, not validation |
| ⚠️ “laborating” → typo in traceability section | Minor edit | Should be *“mapping”* or *“labelling”* |

---

**Final Note**: This is a *typical planning refinement* — not a structural flaw. The planner correctly designed a group-level mapper; only narrative alignment needs improvement.

✅ **Decision: ACCEPTED**, pending the above textual clarifications.