## Review Summary

### Verification of required sections

**Required section “## Implementation scope (machine-checked)”**
✅ Present in plan.
✅ Contains **In scope (implementation groups):** with `fx-single-leg`.
✅ `fx-single-leg` matches `currentImplementationGroup` in `00-product-scope.json`.
✅ Out-of-scope groups explicitly listed, and match productGroups slugs except `fx-digital-option` and `fx-barrier-option` are also listed in productGroups but excluded.

**Required section “## Runtime supported fixtures (machine-checked)”**
✅ Present in plan.
✅ Contains `- fx-ex01-fx-spot`.
✅ Matches `run_config.runtimeFixtures` ids exactly (`fx-ex01-fx-spot` only).
❌ `run_config.runtimeFixtures` only contains `fx-ex01-fx-spot`, but the plan’s "Supported FX products for this run" lists **7 fixtures**, including `fx-ex02`–`fx-ex07`, and the plan states “all runtime supported in this phase”. This is inconsistent with the machine-checked runtime fixtures.

This misalignment is a **runtime/agent-runtime confusion**: the plan conflates *observed* fixtures (`evidence-index.md` labels all fx-ex01–07 as “Observed But Not Runtime Supported” despite being in the same `fx-single-leg` group) with *runtime-supported* fixtures (`run_config.runtimeFixtures` only lists `fx-ex01-fx-spot`).

The evidence shows that **only** `fx-ex01-fx-spot` is designated as runtime supported, while all others (including other fx-single-leg fixtures) are observed but not runtime supported.

### Implementation group semantics and product-group correctness

The plan correctly assigns the current implementation group as `fx-single-leg` and includes the single-leg product label. This matches `00-product-scope.json`.

However, the plan's narrative (and internal headers) repeatedly assert “all observed, all runtime supported in this phase” and “FX single-leg: 7 fixtures (all observed, all runtime supported in this phase)”, which **contradicts**:
- `run_config.runtimeFixtures`: only `fx-ex01-fx-spot`
- `evidence-index.md`: labels all fx-ex01–07 as “Observed But Not Runtime Supported”

There is no evidence that the planner intended a staged support within the same `fx-single-leg` group; therefore, treating the remaining six fixtures as “runtime supported in this phase” is unsupported and may confuse runtime verification.

### Test coverage

Test cases mention “Spot FX trade with side rates”, “Forward FX trade”, “FX trade with settlement information”, etc. — all of which are based on fixtures outside the runtime-supported scope (`fx-ex02`–`fx-ex07`), so they cannot be validated during this run unless the fixtures’ runtime support status is updated.

### Traceability requirements

Traceability requirements are sound (constructor tracing, emitterrail, etc.), but without accurate runtime fixture alignment, they risk testing unsupported fixtures.

### Minor concerns

- “laborating on `tradeDate` and `valueDate`” likely means “labelling” or “mapping”, a typo but non-blocking.
- The runtime fixture `fx-ex01-fx-spot` has valid, detailed CDM expectation, and mapping responsibilities list sufficient FpML sub-paths. No missing mappings detected for this fixture.

## Decision

Decision: NEXT_ROUND_REQUIRED