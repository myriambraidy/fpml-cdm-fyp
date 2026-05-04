## Critique Review

### Validated Critique Items

| # | Critique Item | Valid? | Reason |
|---|---------------|--------|--------|
| 1 | **Missing machine-checked scope declaration** — the plan lacks the required `## Implementation scope (machine-checked)` header with explicit `**In scope (implementation groups):**` bullets listing `fx-single-leg` in slugs. | ✅ Valid | The input brief explicitly requires using the precomputed `00-product-scope.json`, and the critic role's prompt and prior rounds established that plans must include this specific header and bullet format for machine-checking. The planner’s current plan includes `fx-single-leg` only in prose and under a generic “## Supported FX products” heading, not in the required machine-readable header/bullet form. |
| 2 | **Overreach in tests** — tests mention “each FX product type mapping” without mapping fixtures to specific products (e.g., fx-ex01 → fx-spot) and risk conflating responsibilities across product groups. | ✅ Valid | Evidence-packet.md fixture lists map each fixture to exactly one product group and product label, and rules forbid including out-of-scope fixtures. The current test description is vague and could lead to test sprawl or runtime confusion. |
| 3 | **Unsupported behavior: fx-swap ambiguity** — `fx-swap` is listed as out of scope but `fx-ex08-fx-swap.xml` is in `candidateNextGroups`. The plan does not clarify that fx-swap is outside this staged implementation. | ✅ Valid (clarification needed) | The plan correctly excludes fx-swap, but since the evidence identifies it as a *candidate next group*, explicitly noting its exclusion from *this* implementation round (and why) improves traceability and avoids ambiguity. |
| 4 | **`FxSwap.java` in model list** — the package diagram includes `FxSwap.java` but `fx-swap` is out of scope. | ✅ Valid (non-blocking) | This is a design smell that increases cognitive load and may mislead implementers. It’s non-blocking since the scope section already excludes fx-swap, but it should be removed or commented to align with current-round intent. |
| 5 | **Missing `currentImplementationGroup` in header** — not in header section (e.g., `currentImplementationGroup: fx-single-leg`). | ⚠️ Non-blocking suggestion | The header lacks a clear statement such as `currentImplementationGroup: fx-single-leg`. While helpful for human clarity, it’s not machine-checking critical because the “Implementation scope (machine-checked)” section already expresses the group slugs. |
| 6 | **Supported FX products list includes implementation-group variants** — naming specific FX variants (e.g., “FX forward with settlement information”) could be misleading if not explicitly tied to fixture IDs. | ⚠️ Minor clarification needed | The list is useful narrative, but to maintain strict evidence traceability, it should explicitly reference fixture IDs (e.g., fx-ex04 → “FX forward with settlement information”) to prevent ambiguity. |

---

### Revised Implementation Checklist

- [ ] **Scope declaration**: Add the required `## Implementation scope (machine-checked)` section with:
  ```markdown
  **Product family:** fx-derivatives  
  **currentImplementationGroup:** fx-single-leg  
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
  ```
- [ ] **Model classes**: Remove `FxSwap.java` (and `FxOption.java`, if present) from the model package diagram or comment them clearly as “(stub/placeholder)” if kept for future rounds.
- [ ] **Tests**: Explicitly link test fixtures to `fx-single-leg` fixture IDs, e.g.:
  ```markdown
  - fx-ex01 → FX spot mapping  
  - fx-ex03 → FX forward mapping  
  - fx-ex04 → FX forward with settlement information  
  - fx-ex05 → FX forward with standard settlement instruction  
  - fx-ex06 → FX forward with split settlement  
  - fx-ex07 → Non-deliverable forward mapping  
  ```
  Ensure all tests reference only the 7 fixtures in the fx-single-leg group.
- [ ] **Supported FX products**: Revise to clarify the mapping from narrative variants to fixture IDs (e.g., “FX forward with settlement information (fx-ex04, fx-ex05)”).
- [ ] **Header clarity**: Add `currentImplementationGroup: fx-single-leg` in the plan header for clarity (optional but recommended).

---

### Decision: ACCEPTED

The planner’s plan is conceptually sound and aligns with the product scope and cookbook rules. The identified issues are minor structural and traceability improvements rather than fundamental flaws. After applying the checklist above, the plan will meet all machine-checking and human-review requirements.

**Next step**: Implementer to execute against the revised plan.