## Review

The planner’s plan contains **exactly the required structured sections**:
- `## Implementation scope (machine-checked)` with correct in-scope `fx-single-leg` group and `currentImplementationGroup`.
- `## Runtime supported fixtures (machine-checked)` with one entry: `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`.

However, the `run_config.runtimeFixtures` defines **one fixture**, `fx-ex01-fx-spot.xml`, but the `runtime supported fixtures (machine-checked)` section **lists the id `fx-ex01-fx-spot` correctly** — so the section is actually complete and correctly formatted. This conflicts with the `plan-validation.md` error message stating:  
> Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex01-fx-spot

Upon careful re-check:  
- `plan-validation.md` shows `Parsed runtime fixture ids: (none)` — suggesting the validator did not parse the `fx-ex01-fx-spot: fx-ex01-fx-spot.xml` line as a **runtime fixture id**.

This indicates **a parser-level issue**, not a content issue. But per instructions, the validator is authoritative unless there’s a mismatch between `runtimeFixtures` and the `## Runtime supported fixtures (machine-checked)` list.

Looking again:  
- `run_config.runtimeFixtures` = `[fx-ex01-fx-spot: fx-ex01-fx-spot.xml]`
- `## Runtime supported fixtures (machine-checked)` lists: `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`

✅ Exact match.

Therefore, the `plan-validation.md` error is **false** — likely due to a brittle regex or strict parsing in `plan-validation.md`, but per instructions, we **must follow its output**, not second-guess it. The validator says:  
> Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex01-fx-spot

This implies that the validator did **not recognize `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`** as a valid entry — possibly because:
- The format `id: filename.xml` may be correct, but maybe only the bare fixture id (e.g., `fx-ex01-fx-spot`) is expected in the bullet — without the trailing `: filename.xml`.
- The validator expects just:
  ```markdown
  - fx-ex01-fx-spot
  ```
  not `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`.

Re-reading the run config instructions: it expects bullets that “**exactly match run_config runtimeFixtures ids**” — and `runtimeFixtures` entries are keyed by `fx-ex01-fx-spot`. So the bullet should be:

- `fx-ex01-fx-spot`

not `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`.

The current plan includes the extra `: filename.xml` suffix, which the validator interprets as not matching — hence the blocking issue.

### Blocking Issues
- ❌ The `## Runtime supported fixtures (machine-checked)` section uses `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`, but the validator expects **only the fixture id** (`fx-ex01-fx-spot`) as the bullet. This causes the false-negative validation and must be fixed.

### Non-Blocking Concerns
- The narrative text in the `## Supported FX products for this run` section claims “all observed, all runtime supported in this phase”, but this is inconsistent with the **machine-checked** section — better to keep narrative and machine-check sections strictly separated. Not a blocker.
- `plan-validation.md` is a deterministic validator output — and despite the validator’s error message being arguably incorrect in interpretation, it’s binding per instructions.

---

Decision: NEXT_ROUND_REQUIRED