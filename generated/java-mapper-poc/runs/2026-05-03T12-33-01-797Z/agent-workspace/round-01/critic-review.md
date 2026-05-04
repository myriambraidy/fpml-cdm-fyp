## Review of Planner Plan

### 1. Verification of Machine-Checked Scope Section

The plan contains the required section:
```markdown
## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
- fx-swap
- fx-simple-option
**Explicitly out of scope (implementation groups):**
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx
```

- ✅ Matches `currentImplementationGroup: fx-single-leg`
- ✅ Includes both `candidateNextGroups`: fx-swap, fx-simple-option
- ✅ Does *not* include fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, non-fx in in-scope list
- ✅ "Out of scope" list is consistent and explicitly stated

→ Plan passes the structural requirement.

### 2. Evidence of Support in Product Scope JSON

Product Groups (`productGroups[]`) match the in-scope groups:
- fx-single-leg (7 fixtures)
- fx-swap (1 fixture)
- fx-simple-option (3 fixtures)

All three are marked with `"implementationHint": "good-first-target"` (for fx-single-leg) or `"candidate"` (for fx-swap and fx-simple-option), consistent with being in scope for this staged phase.

The plan correctly excludes later/excluded groups.

### 3. Blocking Issues

None.

### 4. Non-Blocking Concerns

1. **Mapping of fx-swap to CDM**  
   The evidence shows `fx-ex08-fx-swap.xml` contains *two* `<fxSingleLeg>` entries under `<fxSwap>`. The plan states `FxSwapMapper` maps to CDM `SettlementPayout`, but the CDM example shows **two** `SettlementPayout` entries (`payout[0]` and `payout[1]`).  
   → *Suggestion:* Clarify that `FxSwapMapper` will produce a *list* of mappers or wrap two `SettlementPayout` objects.

2. **Fixture paths / evidence paths consistency**  
   The plan uses paths like `fpml/fx-derivatives/<filename>.xml` but the evidence shows:
   - `data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml`
   - `data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex01-fx-spot.json`  
   → *Suggestion:* Ensure runtime code references or test paths match the evidence paths (backslashes in Windows evidence, but forward slashes in plan example).

3. **Test coverage vs. evidence**  
   Cookbook evidence shows `fx-ex02-spot-cross-w-side-rates.xml` introduces *side rates*, which the CDM example normalizes into a `composite` base + forward point. The plan mentions side rates in "Edge cases", but doesn’t call out *composite rate handling* explicitly.  
   → *Suggestion:* Add a bullet in Mapping Responsibilities under `FxSingleLegMapper` about composite rate (spot + forward points) handling for fx-ex03, fx-ex06, fx-ex07.

### Decision

Decision: ACCEPTED