```
# Critique Review: Round 2 Planner Plan

## Evidence Used

- `plan-validation.md`: Status = **failed**, 7 blocking issues — all missing runtime fixture IDs in the “Runtime supported fixtures” section.
- `planner-plan.md`: Contains the heading `## Runtime supported fixtures (machine-checked)` but lists only *titles* (e.g., `fx-ex01-fx-spot`) without explicit IDs matching the canonical `id: filename` format used in `run_config` and `00-product-scope.json`.
- `run_config.xml`: Defines runtime fixtures as `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`, etc.

---

## Critique Items Validity Assessment

| # | Critique Item | Valid? | Reason |
|---|---------------|--------|--------|
| 1 | Missing `fx-ex01-fx-spot` in runtime fixtures section | ✅ **Valid** | Plan lists `fx-ex01-fx-spot` as a heading but does not explicitly render it as `id: filename`. Validation logic requires exact ID `fx-ex01-fx-spot: fx-ex01-fx-spot.xml` format. |
| 2 | Missing `fx-ex02-spot-cross-w-side-rates` | ✅ **Valid** | Same as above — no ID:filename pair in the section. |
| 3 | Missing `fx-ex03-fx-fwd` | ✅ **Valid** | Same. |
| 4 | Missing `fx-ex04-fx-fwd-w-settlement` | ✅ **Valid** | Same. |
| 5 | Missing `fx-ex05-fx-fwd-w-ssi` | ✅ **Valid** | Same. |
| 6 | Missing `fx-ex06-fx-fwd-w-splits` | ✅ **Valid** | Same. |
| 7 | Missing `fx-ex07-non-deliverable-forward` | ✅ **Valid** | Same. |

**All 7 blocking critiques are valid.** The plan’s “Runtime supported fixtures” section currently states only product names (e.g., `FX spot`, `FX forward`), but `plan-validation.md` requires explicit ID-to-filename mappings in the format `id: filename` (as in `run_config`). This is a clear structural mismatch.

No other critiques are present (e.g., no unsafe dependencies, no forbidden class usage, no CDM API mismatches), and the rest of the plan (package structure, Rosetta mapping, CDM class usage) aligns with `approved-cdm-api-contract-summary.md` and preflight status.

---

## Revised Implementation Checklist

✅ **Fix required**: Update the `## Runtime supported fixtures (machine-checked)` section to list **exact** `id: filename` pairs per `run_config`:

```
## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd: fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement: fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi: fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits: fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward: fx-ex07-non-deliverable-forward.xml
```

✅ Ensure this list is placed *directly* under the “## Runtime supported fixtures (machine-checked)” heading and matches the exact IDs/filenames used in `run_config`.

✅ No other changes are needed — remaining sections (package structure, Rosetta function mapping, tests, etc.) conform to the approved CDM API contract and implementation scope.

---

## Decision: **NEXT_ROUND_REQUIRED**

**Why**: The blocking issue is *structural* — the plan is otherwise viable and safe — and can be fixed in one editing pass (just reformatting the fixtures list). More rounds remain (`2/3`), so this qualifies for a repair round.

**Required fix**: Reformat the runtime fixtures section to use explicit `id: filename` pairs matching the `run_config`.

--- 

*No further action needed if the planner ensures the above fix is applied in Round 3.*
```