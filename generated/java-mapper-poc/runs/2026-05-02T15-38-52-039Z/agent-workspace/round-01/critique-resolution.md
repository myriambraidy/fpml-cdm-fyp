# Critique Review Decision

## Valid Critique Items

### ✅ Critique Item: Incorrect product group identifiers used
**Status: VALID**  
**Reason**: The critic correctly identifies that the planner used informal/ambiguous names like `fx-derivatives`, `fx-spot`, `fx-fwd`, etc., instead of the exact, canonical product group identifiers (`fx-single-leg`, `fx-swap`, `fx-simple-option`, etc.) defined in `00-product-scope.json`. The plan validation (`plan-validation.md`) correctly flags these as *blocking issues*. Using non-canonical identifiers would cause downstream tooling and implementation logic to fail.

### ✅ Critique Item: Plan mislabels "Current Implementation Group"
**Status: VALID**  
**Reason**: While the *content* of the plan correctly describes `fx-single-leg` with its 7 fixtures, the *labeling* incorrectly states “Current Implementation Group: fx-single-leg (Default starting group)” but then proceeds to list product group names like `fx-derivatives`, `fx-spot`, `fx-fwd`, etc., in the table. This contradiction indicates a naming confusion in the planner's internal logic — a risk for consistency and tooling.

### ⚠️ Critique Item: Plan lists fixture names as product groups
**Status: VALID**  
**Reason**: The critic points out that the plan mistakenly used fixture filenames (e.g., `fx-fwd-w-settlement`, `fx-fwd-w-ssi`) as if they were product group names. These are *fixtures* belonging to the `fx-single-leg` product group, not product groups themselves. This is a clear deviation from the rules in `00-product-scope.md`.

## Invalid/Rejected Critique Items

### ❌ Critique Item: “Plan's description of current implementation group is correct” is presented as a mitigating factor  
**Status: INVALID as mitigation**  
**Reason**: The critic acknowledges that the plan's *description* of `fx-single-leg` with 7 fixtures is correct — but this is irrelevant to the *blocking* issue that the plan uses non-canonical identifiers elsewhere. This is a non-sequitur: correctness of a subset does not excuse errors elsewhere. This point should not be used to downgrade the severity of the blocking issues.

### ❌ Critique Item: “Java package structure and code contracts are reasonable”  
**Status: IRRELEVANT to current blocking failure**  
**Reason**: These are design-quality concerns and do not address the *blocking* issue of incorrect product group identification. They are outside scope of current validation decision.

## Overall Evaluation

| Criterion | Status |
|----------|--------|
| Compliance with `00-product-scope.json` | ❌ FAILED |
| Blocking issues | 6 (all valid, all blocking) |
| Critical product group mislabeling | ✅ Confirmed |
| Implementation logic soundness | — (cannot proceed) |
| Risk of runtime failure | ⚠️ High (plan cannot be executed as written) |

---

## Decision: FAILED

The planner must fix the core issue: **replace all informal/non-canonical product group names with the exact identifiers from `00-product-scope.json`**.

### Required Fix

- Replace:
  - `fx-derivatives` → `fx-single-leg` (since family ≠ group)
  - `fx-spot`, `fx-fwd`, `fx-fwd-w-settlement`, `fx-fwd-w-ssi`, `fx-fwd-w-splits` → these are *not groups*; they are fixtures under `fx-single-leg`
- Use only canonical group names:
  - `fx-single-leg`
  - `fx-swap`
  - `fx-simple-option`
  - etc.
- In the **Implementation Groups** section, clarify that the *current phase* is for `fx-single-leg`, and list its fixtures explicitly (as done correctly in the "Current: `fx-single-leg`" subsection), but do **not** list `fx-spot`, `fx-fwd`, etc., as separate groups.

---

## Revised Implementation Checklist (After Fix)

- [ ] Update "Current Implementation Group" header to use `fx-single-leg` only (no other group names)
- [ ] Remove all incorrect group names (`fx-derivatives`, `fx-spot`, `fx-fwd`, `fx-fwd-w-settlement`, etc.)
- [ ] Keep the list of fixtures under `fx-single-leg` — but label them *as fixtures*, not product groups
- [ ] Ensure all references in the plan use `fx-single-leg`, `fx-swap`, etc., matching `00-product-scope.json` exactly
- [ ] Confirm no fixture paths or group paths are “invented” per Rules in `00-product-scope.md`
- [ ] Run `plan-validation` again to confirm blocking issues resolved before next implementer round

If the planner can produce a version that uses only the exact group identifiers, the plan will be acceptable for implementation.

Decision: **NEXT_ROUND_REQUIRED**