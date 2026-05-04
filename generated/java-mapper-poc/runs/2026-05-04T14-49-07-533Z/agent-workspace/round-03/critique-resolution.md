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