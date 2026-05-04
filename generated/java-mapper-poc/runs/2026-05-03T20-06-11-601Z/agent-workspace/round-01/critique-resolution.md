```markdown
# Plan Review Decision

## Summary

The critic correctly identifies a **formatting issue** in the `## Runtime supported fixtures (machine-checked)` section. Specifically, the line:

```markdown
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
```

is interpreted by the validator as **not matching** the expected format — which should be just the **fixture id**, i.e.,

```markdown
- fx-ex01-fx-spot
```

### Why this is a valid critique

The `run_config` defines:
```yaml
runtimeFixtures:
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
```

The key here is: **the fixture id is `fx-ex01-fx-spot`**, and the validator expects the `## Runtime supported fixtures (machine-checked)` section to list only those ids — *without附加 metadata* like `: filename.xml`. This is confirmed by the instruction:

> bullets must **exactly match** run_config `runtimeFixtures` **ids**.

The `plan-validation.md` error is *not* a false negative — it's enforcing strict formatting, and the planner violated it. Per the instructions, validator output is binding.

✅ **Critique is valid**: this is a blocking issue.

## Action Required

The planner must update the `## Runtime supported fixtures (machine-checked)` section to:

```markdown
## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
```

No additional colon-and-filename suffix.

## Revised Implementation Checklist (Post-Fix)

After fixing the above, the plan passes validation and is **ACCEPTED**.

### ✅ Acceptance Checklist
- [x] `## Implementation scope` includes `fx-single-leg` (matches `currentImplementationGroup`)
- [x] `## Runtime supported fixtures (machine-checked)` lists only `fx-ex01-fx-spot` (no `: filename.xml`)
- [x] Scope is limited to one implementation group (`fx-single-leg`)
- [x] All other sections (mapping, tests, validation gates) are internally consistent and well-defined
- [x] Unsupported behavior is clearly stated
- [x] Java package structure is clean, modular, and traceable

### 🔧 Required Fix
Replace:
```markdown
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
```
with:
```markdown
- fx-ex01-fx-spot
```

### 🟢 Decision: **ACCEPTED** (after fix applied)

> **Next step**: Planner applies the minimal formatting fix above. The plan is otherwise sound and ready for implementation.
```