# Round 2 Summary

Decision: ACCEPTED

## Planner Focus

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Critic Findings

- **Mismatched runtime fixture listing**: The plan’s *Runtime supported fixtures (machine-checked)* section lists `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`, but the `run_config` specifies `runtimeFixtures: [{id: "fx-ex01-fx-spot", path: "fx-ex01-fx-spot.xml"}]`. However, the validator’s parsed result says *parsed runtime fixture ids: (none)*, indicating the YAML-style bullet formatting does **not** parse as a valid fixture id list. The section must list fixture IDs exactly as they appear in `run_config.runtimeFixtures`, i.e., `fx-ex01-fx-spot`. The current bullet uses a label+path pattern instead of a plain ID.
- **Evidence-policy mismatch**: The evidence index and run config label the runtime fixture as `fx-ex01-fx-spot`, and the plan’s narrative mentions `fx-ex01-fx-spot.xml`, but the validator’s parser expects only the ID. While the *narrative* test descriptions correctly reference the XML file, the plan must use machine-parseable IDs in the header block. This is a formatting inconsistency, not a logic failure.
- **Over-reliance on unsupported runtime phrasing elsewhere**: The plan’s “Runtime support” validation gate says *“Only fixture `fx-ex01-fx-spot` is runtime supported”*. While logically correct, the plan’s header block failed to encode it in the required machine-checkable form, which is why the validator flagged it.

## Resolution Notes

- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- **Current**: `- fx-ex01-fx-spot: fx-ex01-fx-spot.xml`
- **Required**: `- fx-ex01-fx-spot`
- The critic conflates **narrative test descriptions** (which may use paths) with **machine-checkable gate lists**.
- The plan’s narrative uses `fx-ex01-fx-spot.xml` correctly in context, but the *header block* was not aligned.
- This is a **single-place formatting bug**, not a systemic mismatch.
- The “Runtime support” gate is logically sound — it’s only the *header* section that’s malformed.
- The plan is otherwise complete, logically consistent, and aligned with Rosetta semantics.
- The blocker is a *formatting-only* issue confined to one line.
- Fixing it restores machine-checkable compliance without reworking any design decisions.
