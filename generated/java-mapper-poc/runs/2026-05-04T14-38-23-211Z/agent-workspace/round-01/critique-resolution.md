## Review of Critique and Plan Revision

The critic’s review correctly identified one **blocking issue**:

### ✅ Critique Item 1 (Valid and Blocking)
> **"Runtime fixtures section incomplete / malformed"**  
> The plan lists `- fx-ex01-fx-spot: fx-ex01-fx-spot.xml`, but the validator expects *only the fixture ID* (e.g., `- fx-ex01-fx-spot`) in the `## Runtime supported fixtures (machine-checked)` section.

This is **fully valid**. The `run_config.runtimeFixtures` specifies:
```yaml
runtimeFixtures:
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
```
… and the plan’s bullet list must match the *left-hand side only* for machine comparison — i.e., just the IDs like `fx-ex01-fx-spot`. Including `: filename.xml` causes parsing to fail and yields **zero matched fixtures**.

> 🔴 **Blocking. Must be fixed.**

The remaining critiques are **non-blocking** — helpful suggestions, not blockers.

---

## Revised Plan Fix

Below is the corrected `## Runtime supported fixtures (machine-checked)` section (machine-parsable and aligned with `run_config`):

```markdown
## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward
```

This is the *only required change* to pass machine validation.

Note: The plan’s `## Supported FX products` narrative (e.g., “FX spot, FX forward, NDF”) is fine — it’s not machine-validated but adds value.

All other elements are sound:
- ✅ Implementation scope matches `currentImplementationGroup: fx-single-leg`
- ✅ All 7 runtime fixtures map to `fxSingleLeg` root in `00-product-scope.json`
- ✅ Rosetta functions listed align with `rosetta-generation-context.md` (file + line references omitted but not required)
- ✅ CDM types used (`Trade`, `NonTransferableProduct`, etc.) are all present and validated in `cdm-rosetta-preflight.md`
- ✅ No unsafe or impossible claims (e.g., no FX options support in this phase)

---

## Decision: ACCEPTED

The revised plan (with the above fixture list correction) satisfies all machine- and human-readable constraints.

### ✅ Implementation Checklist (Post-Fix)

| Item | Status | Reason |
|------|--------|--------|
| Product family: `fx-derivatives` | ✅ | Confirmed |
| Implementation group: `fx-single-leg` | ✅ | Matches `currentImplementationGroup` |
| Runtime fixtures: 7 fixtures (IDs only) | ✅ | Corrected list below |
| Java package: `org.finos.cdm.fx.singleleg` | ✅ | Clear, bounded scope |
| CDM version: `cdm-java:6.7.0` | ✅ | Preflight passed |
| Jackson strategy | ✅ | `maven-compile-gated-jackson-serialization` supported |
| Unsupported groups explicitly listed | ✅ | All later groups excluded |
| Traceability strategy | ✅ | Function/CDM/fixture mapping documented |

#### Final Runtime Fixture List (Accepted)
```markdown
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward
```

This list exactly matches `run_config.runtimeFixtures` and `00-product-scope.json`.