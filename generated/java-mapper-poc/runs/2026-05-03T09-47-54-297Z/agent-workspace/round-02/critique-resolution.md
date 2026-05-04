## Critique Review Analysis

### Valid Critique Items

The following critique items are **valid**:

#### ✅ Item 1: fx-ex07 (NDF) lacks cookbook evidence for NDF-specific handling  
- **Evidence**: Cookbook evidence JSON only documents 5 stable rules (`RULE-001` to `RULE-005`) and no explicit NDF rules for `settlementCurrency`, `cashSettlementTerms`, `valuationDate`, or `fixing`.
- **CDM Evidence**: The expected CDM output for fx-ex07 includes NDF-specific fields not covered by the documented rules.
- **Risk**: Including fx-ex07 without mapped rules would lead to incomplete/incorrect mappings and test failures.

#### ✅ Item 2: References to `TR-001`, `TR-002`, `TR-003` are inconsistent with evidence  
- **Evidence**: The `fx-derivatives.md` cookbook uses IDs like `fx-derivatives:TR-001`, but the authoritative `fx-derivatives.evidence.json` file does **not** list any transformation IDs — only rules (`RULE-001` to `RULE-005`) and transformations are described in natural language, not ID-indexed.
- **Risk**: Using non-existent IDs undermines traceability and could mislead implementers.

#### ✅ Item 3: Incomplete rule-to-fixture mapping for fx-ex07  
- **Evidence**: The rule mapping table lists `NDF rules (TR-001, TR-002)` for fx-ex07, but no such rules are documented in evidence JSON or supported in the cookbook evidence.

---

### Non-Blocking Concerns

#### ⚠️ Item 4: Package name placeholder `com.example.fxmapper`  
- **Assessment**: Acceptable for planning phase. Should be finalized (e.g., `com.oracle.labs.fpml.fx`) in implementation.

#### ⚠️ Item 5: Missing `FpmlFxMapper.java` fixture routing documentation  
- **Assessment**: Important for implementation traceability, but can be addressed in the next planning round without blocking.

---

## Decision: **NEXT_ROUND_REQUIRED**

### Required Fixes for Next Round

1. **Remove fx-ex07 from supported fixtures**
   - Update the "Supported FX products for this run" section to list only **6 fixtures** (fx-ex01 through fx-ex06).
   - Explicitly defer fx-ex07 (NDF) to a future phase.
   - Remove NDF-related implementation items (e.g., `NdfValidatorTest`, NDF settlement logic, `valuationDate`, `fixing` handling).

2. **Remove references to `TR-001`, `TR-002`, `TR-003`**
   - Replace all mentions with references to the documented **transformations by name** (e.g., "Resolve party references per the *Resolve party hrefs -> CDM party references and roles* transformation").
   - Update the "Rule-ID mapping per fixture" table to only list documented rules.

3. **Clarify implementation boundaries**
   - Specify: *"This implementation only supports linear single-leg FX products (spots and forwards) and excludes options, barriers, NDFs, and swaps."*
   - Remove settlement instruction mapping features (e.g., splitSettlement, standardSettlementStyle) unless explicitly supported in the cookbook for the included fixtures.

4. **Add traceability to fixed rules**
   - Ensure every mapping responsibility is linked to a stable rule or transformation **that appears in the evidence JSON**.

---

## Revised Implementation Checklist (After Fixes)

| Item | Status |
|------|--------|
| Package structure defined with placeholder `com.example.fxmapper` | ✅ Acceptable (to be updated) |
| **Supported fixtures = fx-ex01 to fx-ex06 only (6 fixtures)** | 🔁 **Must fix** |
| **No fx-ex07 (NDF) mentioned in scope** | 🔁 **Must fix** |
| **References to `TR-001`/`TR-002`/`TR-003` removed** | 🔁 **Must fix** |
| All transformation logic tied to documented cookbook entries | 🔁 **Must fix** |
| Test coverage limited to supported fixtures | 🔁 **Must fix** (remove `NdfValidatorTest`, etc.) |
| Settlement logic only for supported fixtures (no NDF cash settlement, no splits unless explicitly in `fx-ex04`/`fx-ex06`) | 🔁 **Must clarify** |

---

✅ **After addressing the above**, the plan will be ready for approval and implementation.

**Decision: NEXT_ROUND_REQUIRED**