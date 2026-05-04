## Decision: NEXT_ROUND_REQUIRED

### Valid Critique Items (Accepted)

| # | Critique Item | Valid | Reason |
|---|---------------|-------|--------|
| 1 | **Product Group Name Mismatches** | ✅ **Valid** | The plan incorrectly treats subtypes (spot, fwd, NDF) and filenames as product groups, when `00-product-scope.json` defines only `fx-single-leg` as the current group. `fx-derivatives` is the family, not a group. |
| 2 | **Implementation Group Selection** | ✅ **Valid** | Including `fx-swap` in the *current* implementation section violates the staged strategy. The plan must restrict Round 2 solely to `fx-single-leg`. |
| 3 | **Misaligned Fixture Coverage** | ✅ **Valid** | Listing `fx-ex08-fx-swap.xml` under `fx-single-leg` is a factual error. Per `00-product-scope.json`, this fixture belongs to the `fx-swap` group and must be moved. |
| 4 | **Unsupported Product References** | ✅ **Valid** | The plan should omit *all* references to `fx-swap`, `FxSwapMapper`, and Phase 2 planning in the current round. These belong only in a future RFC. |

### Non-Valid Critique Items (Rejected)

| # | Critique Item | Rejected | Reason |
|---|---------------|----------|--------|
| 1 | **Overreach: FX Options Mentioned** | ❌ **Not Valid** | Mentioning `fxSimpleOption`, etc. under "Out of scope" is acceptable and aligns with the staged strategy, as `fx-simple-option` is a candidate next group. The phrasing is not misleading. |
| 2 | **Evidence Alignment** | ❌ **Not Valid** | While referencing specific rule IDs (`RULE-001`) would improve traceability, the plan does cite reliance on the evidence files, which is sufficient for a *plan*. Evidence grounding can be added in the implementation checklist, not required *in plan*. |
| 3 | **Java Package Structure Overconfidence** | ❌ **Not Valid** | Proposing a logical sub-package structure (`common`, `fxsingleleg`) is reasonable, even if not mandated. It provides useful implementation direction. |
| 4 | **Missing Runtime Constraints** | ❌ **Not Valid** | The brief's runtime constraints ("no LLM, no workspace read") are high-level design constraints, not functional requirements of the *planning* stage. They can be addressed in the implementation checklist or by the implementer. |
| 5 | **Cookbook Rule Mapping Missing** | ❌ **Not Valid** | Like #2, specific rule IDs are not required at the *plan* stage. The plan correctly references the cookbook and its rules; detailed traceability is deferred to implementation. |

---

### Revised Implementation Checklist (For Next Round)

Once the planner fixes the blocking issues above, the following checklist ensures alignment with the product scope:

#### Product Scope Compliance
- [ ] **Only `fx-single-leg` group is in scope for this round**  
  → Remove any mention of `fx-swap`, `fx-derivatives`, `fx-spot`, `fx-fwd`, or other non-current groups from the implementation section.
- [ ] **Fixtures assigned correctly**  
  → Confirm: `fx-ex01` through `fx-ex07` → `fx-single-leg`; `fx-ex08` → `fx-swap` (Phase 2).
- [ ] **Explicit declaration**: "Phase 1 targets *only* `fx-single-leg` fixtures."

#### Cookbook and Evidence Traceability
- [ ] **Include at least 1 stable rule ID** (e.g., `fx-derivatives:RULE-001`) in the mapping responsibilities section.
- [ ] **Reference at least one CDM path** from `expected CDM summaries`, e.g.,  
  `trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate`.

#### Runtime Constraints (High-Level)
- [ ] **State intent to comply** with:  
  > "The shipped Java mapper runtime must not call an LLM and must not read this agent workspace."

#### Delivery Artifact
- [ ] **Submit revised `planner-plan.md`** in `agent-workspace/round-03/`.
- [ ] **Include updated fixture coverage table** mapping fixtures only to `fx-single-leg`.

#### Non-Blocking Suggestions (Optional but Recommended)
- [ ] Add specific cookbook rule IDs: `fx-derivatives:RULE-001`, `RULE-002`, `RULE-005`.
- [ ] Include a sentence: "Package structure is illustrative; final design may differ per team conventions."
- [ ] Add: "Implementation will verify no workspace paths are hard-coded or dynamically resolved at runtime."

---

### Required Fixes for Next Round

1. **Remove all references to non-`fx-single-leg` products from the current implementation group.**
2. **Move `fx-ex08-fx-swap.xml` to a separate `fx-swap` (Phase 2) section or delete the section entirely.**
3. **Delete the `FxSwapMapper.java` interface and `fxswap` package proposal from the current round.**
4. **Explicitly state: "Round 2 plan is scoped strictly to `fx-single-leg` fixtures."**
5. **Add at least one cookbook rule ID to mapping responsibilities or traceability section.**

If these fixes are made, the revised plan will be **ACCEPTED** and ready for implementation.

If not, the plan must go through another round of critique.