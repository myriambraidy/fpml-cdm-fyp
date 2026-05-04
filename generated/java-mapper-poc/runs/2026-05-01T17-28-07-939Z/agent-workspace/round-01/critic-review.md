```markdown
# Critic Review — Round 1

## Blocking Issues

### 1. **Non-FX Fixtures Claimed as Supported**
The plan's fixture table (lines 53–54) includes `td-ex01-simple-term-deposit.xml` and `td-ex02-term-deposit-w-settlement-etc.xml` marked as **Supported (25/25 fixtures)**. Term Deposit is not an FX derivative. The product scope rules (rule 2) explicitly state: *"Do not inspect or generate for non-FX derivative product families."* These two fixtures must be **dropped or moved to an observed-but-unsupported section**.

### 2. **Evidence Support ≠ Runtime Support**
The plan conflates two distinct things:
- Evidence/cookbook quality scores (quality score 9.8, semantic success rate 100%) — these are *observation-level* metrics from pre-existing Rosetta `.rosetta` files.
- Actual generated Java mapper runtime — the input brief demands a **shipped jar with mappers and tests** for claimed products.

Claiming support for 25/25 fixtures based on cookbook evidence is unsupported. The rules (rule 3) require *"a mapper and tests for it"* in the generated jar. No generated code, Maven structure, or test plan exists yet to back these claims.

### 3. **No Generation Plan or Project Structure**
The plan contains **zero concrete generation steps**:
- No Maven `pom.xml` skeleton
- No package/module naming
- No mapper interface/class outline
- No test strategy beyond referencing fixtures
- No evidence-of-actual-code (e.g., references to actual `.rosetta` files in the evidence folder)

The plan reads as an evidence audit rather than a generator execution plan.

### 4. **.rosetta Function Files — Existence Not Verified**
The plan references function files like `ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` and `ingest-fpml-confirmation-product-fxswap-func.rosetta` as if they are confirmed artifacts. These are **referenced in the cookbook but not confirmed to exist in** `data/rosetta-source/latest/extracted/blocks.json`. If they do not exist, the plan has no foundation.

---

## Non-Blocking Concerns

### 5. **Term Deposit Fixtures Are Bootstrapped In**
The product scope says "Supported products: To be selected by the planner." The planner selected term deposits as supported when the rule explicitly excludes non-FX products. This needs a proactive correction.

### 6. **fx-ex02 Ambiguous Fixture**
`fx-ex02-spot-cross-w-side-rates.xml` is listed but not present in the candidate fixture paths from product scope. This is minor but suggests incomplete fixture alignment.

### 7. **No Unsupported Products Section**
Rule 4 states: *"Record observed but unsupported FX products in the accepted plan and reports."* The plan has no such section. At minimum, complex barrier/digital options, cross-currency swaps, and any fixture without a confirmed `.rosetta` mapping should be listed here pending runtime verification.

### 8. **"All 25 Fixtures" Count Includes 2 Term Deposits — Actual FX Count Is 23**
Correcting for td-ex01 and td-ex02, the true FX fixture count is **23**, not 25. The support percentage should reflect this.

---

## Summary Assessment

The plan performs a thorough **evidence audit** but stops short of being a **generator execution plan**. It:
- Audits cookbook quality but does not establish the runtime code base
- Declares support without generating mappers or tests
- Includes non-FX products in violation of product scope rules
- Contains no Maven project structure or generation workflow
- Has not been verified against actual file-system evidence (`.rosetta` functions, fixture files)

The core deliverable — a shippable Java Maven mapper jar that does not call an LLM — is not planned for.

---

## Decision

**Decision: NEXT_ROUND_REQUIRED**

The next planner round must:
1. Drop `td-ex01` and `td-ex02` from supported fixtures; add a clearly labeled "Observed but unsupported" section for any complex FX products not being generated.
2. Provide a concrete Maven project generation plan (pom.xml, mapper interfaces, test class structure) before claiming runtime support.
3. Confirm existence of referenced `.rosetta` function files by inspecting `data/rosetta-source/latest/` or explicitly state they will be discovered during generation.
4. Provide a step-by-step generation workflow (not just evidence review).
5. State explicitly which products will be in the shipped jar with mapper + tests.
```