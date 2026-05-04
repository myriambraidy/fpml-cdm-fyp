# Critic Review Resolution — Round 1

## Decision: NEXT_ROUND_REQUIRED

The critic's review identifies four blocking issues that must be resolved before the plan can advance to generation.

---

## Blocking Issue Resolutions

### 1. Non-FX Fixtures Claimed as Supported — **VALID**

**Critique:** The plan includes `td-ex01-simple-term-deposit.xml` and `td-ex02-term-deposit-w-settlement-etc.xml` as FX-derivative-supported fixtures. Term Deposit is not an FX derivative product. This violates product scope rule 2.

**Resolution:** The next plan must:
- Remove `td-ex01` and `td-ex02` from any "supported" table or section
- The true FX fixture count is **23**, not 25
- Any future mention of term deposit fixtures must be in an explicitly labeled "Observed but unsupported" section


**Status: ACCEPTED** — The critique is correct and mandatory to fix.

---

### 2. Evidence Support ≠ Runtime Support — **VALID**


**Critique:** The plan conflates cookbook evidence quality scores (9.8, 100% semantic success) with actual generated Java mapper runtime. Rule 3 requires a mapper and tests in the generated jar before claiming support. No generated code, Maven structure, or test plan exists to back support claims.

**Resolution:** The next plan must:
- Clearly separate "observed in evidence" from "supported in generated jar"
- Only claim runtime support for products that will have an actual Java mapper class and unit tests in the generated Maven project
- Provide a concrete list of what will be in the shipped jar (e.g., `FxSpotMapper`, `FxFwdMapper`, `FxSwapMapper`, associated test classes)

**Status: ACCEPTED** — The critique is correct. Evidence audit ≠ generator execution plan.

---

### 3. No Generation Plan or Project Structure — **VALID**

**Critique:** The plan contains zero concrete generation steps. No Maven `pom.xml`, no package/module naming, no mapper interface/class outline, no test strategy.

**Resolution:** The next plan must include:
- A Maven `pom.xml` skeleton (groupId, artifactId, version, key dependencies)
- Package naming convention (e.g., `com.example.mapper.fx`)
- Mapper interface outline (e.g., `FpmlToCdmMapper` with concrete implementations per product)
- Test class structure per fixture
- A numbered step-by-step generation workflow

**Status: ACCEPTED** — A generator execution plan must contain actual generation artifacts or concrete steps to produce them.

---

### 4. .rosetta Function Files — Existence Not Verified — **VALID**

**Critique:** The plan references function files (`ingest-fpml-confirmation-product-fxsingleleg-func.rosetta`, etc.) as confirmed artifacts. These are referenced in the cookbook but not confirmed to exist in `data/rosetta-source/latest/extracted/blocks.json`.

**Resolution:** The next plan must either:
- Inspect `data/rosetta-source/latest/` to confirm existence of referenced `.rosetta` files, OR
- Explicitly state that function file discovery will occur during generation, with a fallback strategy if expected files are missing

**Status: ACCEPTED** — Claims about evidence artifacts require verification or explicit acknowledgment of uncertainty.


---

## Non-Blocking Issue Resolutions

### 5. Term Deposit Fixtures Bootstrapped In — **VALID (same as #1)**

Same root cause as blocking issue #1. Already addressed above.

### 6. fx-ex02 Ambiguous Fixture — **VALID**


**Critique:** `fx-ex02-spot-cross-w-side-rates.xml` is listed but not present in the candidate fixture paths from product scope.

**Resolution:** Align fixture list with actual filesystem. If the fixture exists in the evidence folder, include it with proper path. If not, move to "observed but unsupported."

**Status: ACCEPTED** — Fixture lists must match actual file locations.

### 7. No Unsupported Products Section — **VALID**

**Critique:** Rule 4 requires recording observed but unsupported FX products. Complex barrier/digital options, cross-currency swaps, and unmapped fixtures should be listed.

**Resolution:** Include a section titled **"Observed but Unsupported"** listing products seen in evidence but not in the generated jar, with reason (e.g., "no confirmed .rosetta mapping", "complex barrier logic not implemented").

**Status: ACCEPTED** — This is a stated requirement from the input brief rules.

### 8. "All 25 Fixtures" Count Includes 2 Term Deposits — **VALID (same as #1)**

Same root cause as blocking issue #1. The corrected FX fixture count is **23**. All percentages and counts must reflect this.


---

## Summary

| Critique Item | Valid? | Action Required |
|---|---|---|
| 1. Non-FX Fixtures | YES | Drop td-ex01/td-ex02 from supported; correct count to 23 |
| 2. Evidence ≠ Runtime | YES | Separate evidence observation from runtime support claims |
| 3. No Generation Plan | YES | Add Maven project skeleton, mapper outline, step-by-step workflow |
| 4. .rosetta Files Unverified | YES | Verify or explicitly state discovery strategy |
| 5. Term Deposit Bootstrapped | YES | Same as #1 |
| 6. fx-ex02 Ambiguous | YES | Align fixture list with actual filesystem |
| 7. No Unsupported Section | YES | Add "Observed but Unsupported" section |
| 8. Fixture Count Error | YES | Same as #1 |

**All 8 critique items are accepted.**

---

## Next Steps for Planner

The planner must submit a revised plan (Round 2) that:

1. **Drops all non-FX products** (term deposit fixtures) from any supported section
2. **Declares only products with planned Java mappers + tests** as "supported in shipped jar"
3. **Provides a concrete Maven project structure**: `pom.xml` with dependencies, package naming, mapper interface/class outline
4. **Gives a numbered generation workflow**: e.g., Step 1: Analyze .rosetta files → Step 2: Generate mapper interfaces → Step 3: Implement mappers → Step 4: Write test classes → Step 5: Maven verify
5. **Verifies or acknowledges uncertainty** about referenced `.rosetta` function files
6. **Adds an "Observed but Unsupported"** section for complex FX products without confirmed mappings
7. **Corrects all fixture counts** to reflect 23 true FX fixtures (not 25)
8. **Aligns fixture paths** with actual filesystem locations

Only after these items are addressed will the plan be ready for generation.
