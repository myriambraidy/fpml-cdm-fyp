## Critique Review Analysis

After carefully analyzing the critic review against the planner plan, I find that **all five blocking issues are valid**, and several non-blocking concerns are also well-founded. Here's the disposition of each critique item:

---

### ✅ Valid Blocking Issues

#### 1. **Plan selects unknown product groups**
**Critique item is VALID**  
The plan incorrectly refers to individual fixtures (`fx-ex01-fx-spot.xml`, `fx-ex02-spot-cross-w-side-rates.xml`, etc.) and descriptive names like `fx-fwd`, `fx-fwd-w-settlement`, `fx-fwd-w-ssi`, and `fx-fwd-w-splits` as "implementation groups". These are **fixtures**, not product groups.

Per the product scope (`00-product-scope.md`), the only valid implementation groups are:
- `fx-single-leg`
- `fx-swap`
- `fx-simple-option`
- `fx-digital-option`
- `fx-barrier-option`
- `fx-average-rate-option`
- `fx-strategy`
- `non-fx`

The plan **does** correctly identify `fx-single-leg` and `fx-swap` elsewhere, but the incorrect usage undermines precision and clarity.

#### 2. **Misalignment with staged implementation strategy**
**Critique item is VALID**  
The plan conflates *fixtures* with *product groups*. While the text says “`fx-single-leg`: 7 fixtures (…Components: 1. FX Spot [fx-ex01-fx-spot.xml]…” — this is descriptive listing, not defining new groups. The critic is right to flag this as potential confusion.

#### 3. **No mention of implementation group boundaries**
**Critique item is VALID**  
The plan *does* state “Phase 1 is bounded strictly to `fx-single-leg`”, but the earlier misuse of group names weakens credibility. Explicit confirmation that *no other groups* are included in Phase 1 is required for correctness.

#### 4. **Missing evidence mapping**
**Critique item is VALID**  
The plan references the cookbook and evidence packet, but does **not** explicitly map stable rules from `fx-derivatives.evidence.json` (e.g., `RULE-001` through `RULE-005`) to specific mapping behaviors. For example:
- Which rules enable trade ID preservation?
- Which support date normalization?
- Which drive economic terms extraction?

Stable rules form the evidential foundation for correctness — they must be cited.

#### 5. **Java mapper runtime requirements violated**
**Critique item is VALID**  
This is a *requirement* from the input brief:  
> “The shipped Java mapper runtime must not call an LLM and must not read this agent workspace.”

The plan makes no explicit guarantee that the mapper will be:
- LLM-free at runtime
- Workspace-isolated (no reads of `agent-workspace`, `data/agent-cookbook/latest`, etc.)

This is a non-negotiable constraint and must be stated explicitly.

---

### ✅ Valid Non-blocking Concerns

| # | Concern | Valid? | Reason |
|---|---------|--------|--------|
| A | Over-reliance on fixed patterns | ✅ | Stable rules must be cited to support auditability. |
| B | Lack of concrete test strategy | ✅ | The input brief requires “run gates” — test derivation strategy should be clarified. |
| C | Fixture coverage guarantees | ✅ | Staged implementation implies full coverage of `fx-single-leg` group (7 fixtures) is expected. |
| D | Missing error behavior specification | ✅ | Validation gates need explicit semantics (e.g., throw, return empty, log-and-continue). |
| E | Implementation group change proposal | ✅ (non-issue here) | Since the plan *does* stick to `fx-single-leg`, no change is needed — but explicit confirmation is still desirable. |
| F | Version assumptions are vague | ✅ | CDM and FpML versions should be referenced (e.g., CDM 2.7, FpML 5.10). |
| G | Lack of path guarantees | ✅ | Must distinguish design-time (cookbook, evidence) vs runtime (excluded). |

All 7 non-blocking concerns are reasonable and should be addressed for robustness.

---

## Decision: **NEXT_ROUND_REQUIRED**

The plan has serious correctness flaws that violate critical constraints and cause ambiguity in scope. It cannot proceed to implementation in its current form.

### Required Fixes for Next Round

1. **Correct all product group terminology**
   - Replace every instance of fixture-specific or invalid group names (e.g., `fx-spot`, `fx-fwd`, `fx-fwd-w-settlement`) with **only** official group names: `fx-single-leg`, `fx-swap`, `fx-simple-option`, etc.
   - Clarify that fixtures (`fx-ex01`, `fx-ex02`, … `fx-ex07`) are *members* of `fx-single-leg`, not groups themselves.

2. **Explicitly declare implementation group boundaries**
   - Add a new bullet:  
     > “**Phase 1 scope is strictly limited to `fx-single-leg` (7 fixtures).** All other groups (`fx-swap`, `fx-simple-option`, etc.) are excluded from this phase and reserved for future RFCs.”

3. **Map stable rules to features**
   - Add a table or bulleted list mapping each stable rule from `fx-derivatives.evidence.json` to features in the plan:
     - `RULE-001`: Trade ID mapping → supports `tradeIdentifier.assignedIdentifier.identifier.value`
     - `RULE-002`: Date normalization → supports `tradeDate.value` (Z-trimming)
     - `RULE-003`: Product type → supports `product.taxonomy` classification
     - `RULE-004`: Exercise terms (note: *not needed for single-leg linear FX, but good to acknowledge exclusion if not applicable*)
     - `RULE-005`: Amounts → supports `tradeLot.quantity` construction
   - Clarify whether any rules require special handling for NDF or split settlement fixtures.

4. **Include explicit runtime guarantees**
   - Add a new section:  
     ### Runtime Constraints
     > This Java mapper runtime:
     > - Does **not** call any LLM at runtime.
     > - Does **not** read any agent workspace paths (e.g., `agent-workspace`, `data/agent-cookbook`, `data_to_learn_from`, `round-*`).
     > - Relies solely on precomputed mapping logic compiled into the JAR.
     > - Uses only the CDM model and hardcoded mappings derived from fixture evidence.

5. **Clarify fixture coverage**
   - State:  
     > “Phase 1 implements full support for all 7 fixtures in `fx-single-leg`: `fx-ex01` through `fx-ex07` (FX spot, forward, settlement, SSI, split, and NDF).”

6. **Add version references**
   - Cite: “CDM model version: `2.7.0` (or actual), FpML version: `5.10`” based on evidence.

7. **Specify error behavior**
   - E.g.,  
     > “Invalid FpML structure: throw `FpmlMappingException`.  
     > Missing required field: log warning + return `Optional.empty()`.  
     > Unsupported product: throw `UnsupportedProductException` with product label.”

---

## Revised Implementation Checklist (for next round)

- [ ] Rename all section headings to use `fx-single-leg` (not fixture names)  
- [ ] Add table of stable rules applied, per `fx-derivatives.evidence.json`  
- [ ] Insert explicit “Phase 1 scope is `fx-single-leg` only” declaration  
- [ ] Add “Runtime Constraints” section with LLM/workspace isolation guarantees  
- [ ] Confirm full fixture coverage: `fx-ex01`–`fx-ex07` (7 total)  
- [ ] Cite CDM and FpML versions  
- [ ] Define error handling semantics  
- [ ] Clarify design-time vs runtime path usage  
- [ ] Remove all references to `fx-spot`, `fx-fwd`, `fx-fwd-w-ssi`, etc. as groups  

Once these are addressed, the plan can be re-submitted for acceptance.