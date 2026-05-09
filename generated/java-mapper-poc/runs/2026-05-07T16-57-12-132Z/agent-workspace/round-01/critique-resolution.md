## Critique Evaluation

The critic review identifies a **valid and blocking issue**:

> The **Runtime supported fixtures (machine-checked)** section must list every runtime gate fixture id; missing: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, ..., fx-ex07-non-deliverable-forward.

### ✅ Validity: **Valid**

- **Authority**: `run_config.runtimeFixtures` explicitly defines fixture IDs as:
  ```yaml
  runtimeFixtures:
    fx-ex01-fx-spot: fx-ex01-fx-spot.xml
    fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
    ...
  ```
- **Format requirement**: The validator (`plan-validation.md`) enforces that the **runtime fixtures section must list only IDs**, not `id: filename` pairs.
- **Current plan violation**: The plan writes:
  ```markdown
  - fx-ex01-fx-spot: fx-ex01-fx-spot.xml
  ```
  instead of:
  ```markdown
  - fx-ex01-fx-spot
  ```
- This is a **format compliance failure**, not a semantic one, but it's explicitly blocking per `plan-validation.md`.

The rest of the plan (package design, Rosetta functions, CDM classes) is consistent with:
- `approved-cdm-api-contract-summary.md` (38 classes, 114 builder methods),
- `cdm-java-api-summary.md` (no forbidden classes used),
- `semantic-recipe-validation.md` (status: passed),
- `context-budget-report.md` (status: passed),
- `00-product-scope.json` (`currentImplementationGroup: fx-single-leg`).

No other blocking issues.

---

## Decision: **NEXT_ROUND_REQUIRED**

### Reason
- A blocking formatting issue remains in the `Runtime supported fixtures` section.
- The plan is otherwise sound and **fixable in one round** (just correct the fixture listing format).
- `maxPlanningRounds: 3` → round 2 is available.

### Required Fix for Next Round

In the **“Runtime supported fixtures (machine-checked)”** section, replace:

```markdown
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
...
```

with the strict ID-only list:

```markdown
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward
```

Also update the bullet points in the “Supported FX products for this run” section to follow the same ID-only style (to avoid ambiguity and future validation failure).

After this change, the plan will satisfy `plan-validation.md`.

---

## Revised Implementation Checklist (post-fix)

Once the fixture-list formatting is corrected:

- [x] Product scope matches `00-product-scope.json`: `fx-single-leg` in scope, others out.
- [x] All 7 runtime fixtures listed with exact IDs (after fix).
- [x] Java package design (`org.finos.cdm.fx.singleleg.*`) is consistent with separation of concerns.
- [x] CDM imports limited to approved classes (`approved-cdm-api-contract-summary.md`).
- [x] Rosetta functions referenced match those defined in ingest function `ingest-fpml-confirmation-product-fxsingleleg-func.rosetta`.
- [x] No usage of `FpmlFxSingleLeg` (input model); parsing is delegated to DTO layer.
- [x] Validation gates: unit tests (per fixture), integration test, and CDM Java 6.7.0 compliance enforced.
- [x] Traceability requirements captured via Rosetta function lineage.

✅ After formatting fix, this plan is ready for approval.

--- 

**Decision: NEXT_ROUND_REQUIRED — Fix fixture ID format in `Runtime supported fixtures` section.**