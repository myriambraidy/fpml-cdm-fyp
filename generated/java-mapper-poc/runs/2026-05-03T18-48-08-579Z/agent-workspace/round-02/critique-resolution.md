```markdown
# Critique Review Response and Revised Implementation Checklist

## Summary

The critic correctly identified a **blocking issue**: the *Runtime supported fixtures (machine-checked)* section uses an invalid format — `fx-ex01-fx-spot: fx-ex01-fx-spot.xml` — instead of the required machine-parseable ID-only format.

Per `run_config`:
```yaml
runtimeFixtures:
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
```

The validator expects only the **ID** in machine-checked headers (e.g., `- fx-ex01-fx-spot`), *not* a label:path pair. This is a parsing compliance issue, not a logical error.

---

## Validity Assessment of Critique Items

| Critique Item | Valid? | Reason |
|---------------|--------|--------|
| **Mismatched runtime fixture listing** (blocking) | ✅ **Valid** | The section must use ID-only bullets (`- fx-ex01-fx-spot`) to be parseable. The current `id: path` format fails machine parsing, as confirmed by `parsed runtime fixture ids: (none)`. |
| Evidence-policy mismatch (narrative vs. header) | ⚠️ **Partially valid (but non-blocking)** | The *narrative* in test sections may correctly refer to `fx-ex01-fx-spot.xml`. The *header* must use IDs. This is a formatting inconsistency in one section only — fixable by dedicated header formatting. |
| Over-reliance on unsupported phrasing elsewhere | ⚠️ **Partially valid (but non-blocking)** | The “Runtime support” gate correctly describes exclusivity, but *machine-checkable* fields must use IDs. This reinforces but does not introduce new issues beyond the header block. |

✅ **All blocking issues are addressed by a single, minimal change.**

---

## Accepted Critique Items

### ✅ Blocking: Runtime fixture listing format must be ID-only

- **Current**: `- fx-ex01-fx-spot: fx-ex01-fx-spot.xml`  
- **Required**: `- fx-ex01-fx-spot`

Rationale: The `run_config` defines runtime fixtures using a compact `id: path` YAML syntax, but the *machine-checkable header* must expose only the `id`, per protocol semantics. The validator fails to extract IDs from the current format, hence the parse failure.

---

## Rejected Critique Items

### ❌ “Evidence-policy mismatch” is overstated

- The critic conflates **narrative test descriptions** (which may use paths) with **machine-checkable gate lists**.
- The plan’s narrative uses `fx-ex01-fx-spot.xml` correctly in context, but the *header block* was not aligned.
- This is a **single-place formatting bug**, not a systemic mismatch.

### ❌ “Over-reliance on unsupported runtime phrasing” is redundant with the main issue

- The “Runtime support” gate is logically sound — it’s only the *header* section that’s malformed.

---

## Revised Implementation Checklist

### ✅ Plan Revisions Required

| Task | Status | Notes |
|------|--------|-------|
| Update *Runtime supported fixtures (machine-checked)* section | ✅ **To fix** | Replace: `fx-ex01-fx-spot: fx-ex01-fx-spot.xml` → `- fx-ex01-fx-spot` |
| Preserve all other sections unchanged | ✅ | Their logic, traceability, mapping design, and test scope are sound. |
| Confirm evidence consistency | ✅ | No changes needed — `evidence-index.md`, `run_config`, and product-scope all use `fx-ex01-fx-spot` as ID. |
| Retain runtime constraint clarity | ✅ | “Only fixture `fx-ex01-fx-spot` is runtime supported” remains valid in narrative sections. |

---

## Decision: ✅ ACCEPTED (after fix)

**Justification**:
- The plan is otherwise complete, logically consistent, and aligned with Rosetta semantics.
- The blocker is a *formatting-only* issue confined to one line.
- Fixing it restores machine-checkable compliance without reworking any design decisions.

---

## Final Action: Plan Revision Required

### Fix Instructions for Planner

Replace the **entire bullet** in *Runtime supported fixtures (machine-checked)* with:
```markdown
- fx-ex01-fx-spot
```

No other changes needed.

After applying this fix, the next round will be accepted without further review.

---

## Acceptance Signature

✅ **Decision: ACCEPTED**  
 RCA: Minimal formatting fix suffices. All functional, structural, and traceability requirements are sound.
```