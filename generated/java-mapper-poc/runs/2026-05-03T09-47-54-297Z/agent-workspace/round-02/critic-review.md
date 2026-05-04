# Critic Review: Planner Plan (round 2)

## Verification of Implementation Scope Header

The plan contains the required machine-checked header:
```markdown
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
**currentImplementationGroup: fx-single-leg**
```

**In-scope groups match product scope**: ✅
- Product scope confirms `fx-single-leg` as the default `currentImplementationGroup`
- Product scope confirms `fx-swap`, `fx-simple-option`, etc. as candidate/deferred groups

**Out-of-scope groups match product scope**: ✅
- All groups listed in plan's out-of-scope match the non-current groups in product scope
- `non-fx` is correctly excluded per product scope rules

## Evidence Support Check

The plan's fixture list for `fx-single-leg` matches the product scope exactly:
- fx-ex01 through fx-ex07 are the 7 fixtures confirmed for `fx-single-leg`
- No extra fixtures or unsupported fixture types are included

## Blocking Issues

### 1. Unsupported fixture fx-ex07 (NDF) not clearly supported by cookbook evidence

**Issue**: The plan includes fx-ex07 (non-deliverable-forward) in the supported fixture list, claiming NDF-specific rules like `NDF rules (TR-001, TR-002)` apply.

**Evidence**: The cookbook evidence packet (`fx-derivatives.md`) does **not** contain stable rules or transformations for NDF handling. The `evidence.json` shows:
- Stable mapping patterns: `RULE-001`, `RULE-002`, `RULE-003`, `RULE-004`, `RULE-005`
- Repeated transformations: 6 transformations (TR-001 through TR-003 are mentioned)
- **No specific NDF cash settlement, fixing, or valuationDate rules are documented**

**Evidence from expected CDM**: `fx-ex07-non-deliverable-forward.json` includes:
- `settlementTerms.settlementCurrency.value = USD`
- `settlementTerms.settlementTerms.cashSettlementTerms[0].valuationMethod.valuationSource` (NDF-specific)
- `valuationDate.fxFixingDate`, `valuationTime`

**Conclusion**: The plan overreaches by including fx-ex07 without cookbook evidence for NDF-specific handling.

### 2. Plan claims party references are resolved per TR-001, but TR-001 does not exist in evidence

**Issue**: Plan states: "Resolve party references (`payerPartyReference`, `receiverPartyReference`) into `Party1`/`Party2` roles using cookbook transformation **TR-001**"

**Evidence**: The cookbook evidence packet lists transformations by **Rule id**: `fx-derivatives:TR-001`, etc. in the markdown, but the JSON evidence (`fx-derivatives.evidence.json`) only documents:
- Stable rules: `RULE-001` through `RULE-005`
- No `TR-001` through `TR-003` in the evidence JSON

**Conclusion**: The plan references a non-existent transformation ID (`TR-001`) from the evidence JSON. This is a mapping error: the cookbook uses `TR-001` in the MD, but the JSON evidence doesn't have a `TR-001`.

### 3. Rule ID mapping per fixture is incomplete

**Issue**: The plan's "Rule-ID mapping per fixture" table shows `fx-ex07` uses `RULE-001, RULE-002, RULE-005, NDF rules (TR-001, TR-002)`, but there's no evidence for `NDF rules`, `TR-001`, or `TR-002`.

**Evidence**: `fx-ex07` fixture evidence does not show mapping for settlementCurrency, cashSettlementTerms, valuationDate, or fixing—only `RULE-001`, `RULE-002`, and `RULE-005` are supported.

## Non-Blocking Concerns

### 1. Package name is placeholder `com.example.fxmapper`

The plan uses `com.example.fxmapper`, which is a standard placeholder. No blocking issue, but should be corrected in implementation.

### 2. Missing `FpmlFxMapper.java` traceability to fixture examples

The plan should explicitly state how each fixture maps to the `FpmlFxMapper.java` entry point (e.g., which fixtures it handles, and what happens to unsupported fixtures).

## Decision

**Decision: NEXT_ROUND_REQUIRED**

The plan has one blocking issue: fx-ex07 (NDF) is included without cookbook evidence for NDF-specific handling, and references non-existent transformation IDs. Additionally, the plan does not clearly separate NDF handling from simple single-leg handling, which could lead to runtime failures.

The next round should:
1. Remove fx-ex07 from the supported fixture list (defer NDF to a future phase)
2. Remove references to `TR-001`, `TR-002`, `TR-003` unless explicitly supported in the evidence JSON
3. Clarify that the current implementation only supports linear single-leg products (spots, forwards) without option or NDF features