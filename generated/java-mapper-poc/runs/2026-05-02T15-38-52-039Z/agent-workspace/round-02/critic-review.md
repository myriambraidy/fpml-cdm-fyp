# Critique of Planner Plan (Round 2)

## Blocking Issues

### 1. **Product Group Name Mismatches**
The plan repeatedly references incorrect product group names that do **not exist** in the product scope:

| Plan Reference | Actual Group (per 00-product-scope.json) | Issue |
|----------------|------------------------------------------|-------|
| `fx-derivatives` | Not a group—this is the **family**, not a product group | Invalid group name |
| `fx-spot`, `fx-fwd`, etc. | **fx-single-leg** contains all these subtypes | Planner invented non-existent groups |

**Evidence**:  
The authoritative 00-product-scope.json explicitly defines:
```json
"currentImplementationGroup": "fx-single-leg",
"candidateNextGroups": ["fx-swap", "fx-simple-option"]
```
and lists exactly eight product groups:
- `fx-single-leg`, `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, `non-fx`.

The plan incorrectly treats FpML fixture filenames (`fx-ex03-fx-fwd.xml`, etc.) as if they defined separate product groups. This is a fundamental misunderstanding of the staged-by-product-group strategy.

### 2. **Implementation Group Selection**
The plan states:  
> "Note: Implementation group `fx-swap` will be included in **Phase 2** RFC after `fx-single-leg` implementation is complete."

This is a **non-issue for Round 2** *if* the plan is focused on the current group only. However, the validation output shows **six blocking issues**—all naming errors—and the plan’s continued mention of “fx-swap” as part of the current plan undermines focus on the *current* group.

### 3. **Misaligned Fixture Coverage**
The plan lists the `fx-single-leg` fixtures (7 fixtures) correctly, but then adds:
> "FX Swap [fx-ex08-fx-swap.xml]" under "Current: `fx-single-leg`"

This is a **misclassification**. `fx-ex08-fx-swap.xml` belongs to the `fx-swap` group, not `fx-single-leg`. Its inclusion in the "Current" section is an error of scope.

### 4. **Unsupported Product References**
The plan says:  
> "This plan focuses only on products within the current **fx-single-leg** implementation group."  

Yet it then describes:  
> "FX Swap Contracts (Two leg exchanges)"  
> "FxSwapMapper.java (Pending in Phase 2)"

The inconsistency is that while `fx-swap` is mentioned as "Phase 2", the plan should **not include any planning for it in Round 2**. Its interface and considerations belong in the next-phase RFC, not in a plan for the *current* implementation group.

## Non-Blocking Concerns

### 1. **Overreach: FX Options Mentioned**
The plan states:  
> "FX options (`fxSimpleOption`, `fxBarrierOption`, etc.)"  
under "Out of scope".  

This is **not wrong**, but it’s irrelevant to the current group. Since `fx-simple-option` is a *candidate next group*, it's acceptable to mention in a limitation, but this should be phrased as:  
> "The `fx-simple-option` group is out of scope for Phase 1 but planned for later"  
to align with the staged strategy.

### 2. **Evidence Alignment**
The plan says:  
> "Reliance on stable rules identified in `fx-derivatives.evidence.json`"

However, the plan does **not** reference any *specific* stable rule ID (e.g., `RULE-001`, `TR-001`) from the evidence, nor does it map to the product-group-level rules in the cookbook. This is an overreach without evidence grounding.

### 3. **Java Package Structure Overconfidence**
The plan proposes:
```java
package com.fpml.cdm.mapper.fx;
- common
- fxsingleleg
- fxswap
- error
```

While reasonable, this structure is **not required** by the product scope or cookbook. The planner assumes technical implementation details (e.g., sub-package per product group) that were not mandated. This is not blocking but is unsupported.

### 4. **Missing Runtime Constraints**
The input brief says:  
> "The shipped Java mapper runtime must not call an LLM and must not read this agent workspace."

The plan does **not** confirm how these constraints are met. It is silent on whether generated code:
- Uses static mappings (no reflection or dynamic dispatch),
- Avoids external dependencies,
- Uses pure Java (no JVM injection, no script engine),
- Ensures no path traversal to workspace paths.

This is not necessarily an error, but it’s a missed opportunity to explicitly rule out LLM/runtime coupling.

### 5. **Cookbook Rule Mapping Missing**
The plan references cookbook, Rosetta, and shared ingest docs but **does not map any specific rules** (e.g., `fx-derivatives:RULE-001`, `fx-derivatives:TR-001`) to implementation tasks. This reduces traceability and fails to leverage the cookbook’s high-confidence mappings.

## Evidence Support

- **Product Scope (00-product-scope.json)**: Confirms only `fx-single-leg` is the current implementation group. No `fx-spot`, `fx-fwd`, or `fx-derivatives` group exists.
- **Evidence Packet**: Reiterates `fx-single-leg: 7 fixture(s), good-first-target`.
- **Cookbook Evidence**: Rules like `RULE-001` (trade id), `RULE-002` (date normalization), and `TR-001` (party resolution) apply specifically to `fx-single-leg` and are high-confidence (≥7 examples).
- **Expected CDM Summaries**: Show `SettlementPayout` structure for `fxSingleLeg`, confirming the mapping target for current fixtures.

## Decision

**Decision: FAILED**

**Why**:  
The plan fails due to **blocking product group naming errors** that contradict the authoritative product scope. These are not minor typos—they reflect a fundamental misunderstanding of the staged-by-product-group strategy. The plan conflates fixture filenames with product groups and proposes incorrect current-group scope (e.g., including `fx-ex08-fx-swap.xml` under `fx-single-leg`). Until the planner aligns with the exact group names and fixtures in `00-product-scope.json`, no implementation can be trusted.

**Required Next Round Fixes**:
1. Remove all references to `fx-derivatives`, `fx-spot`, `fx-fwd`, etc. as product groups—these do not exist.
2. Replace them with only `fx-single-leg` and `fx-swap` (as candidate).
3. Move `fx-ex08-fx-swap.xml` to the `fx-swap` group section, not current group.
4. Explicitly declare that Phase 1 targets *only* `fx-single-leg` and no other groups.
5. Optionally, link to cookbook rule IDs and expected CDM paths for concrete traceability.