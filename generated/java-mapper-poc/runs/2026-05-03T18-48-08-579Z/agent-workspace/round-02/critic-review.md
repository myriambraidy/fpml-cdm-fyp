## Blocking Issues

- **Mismatched runtime fixture listing**: The plan’s *Runtime supported fixtures (machine-checked)* section lists `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`, but the `run_config` specifies `runtimeFixtures: [{id: "fx-ex01-fx-spot", path: "fx-ex01-fx-spot.xml"}]`. However, the validator’s parsed result says *parsed runtime fixture ids: (none)*, indicating the YAML-style bullet formatting does **not** parse as a valid fixture id list. The section must list fixture IDs exactly as they appear in `run_config.runtimeFixtures`, i.e., `fx-ex01-fx-spot`. The current bullet uses a label+path pattern instead of a plain ID.

  This is blocking because the protocol requires machine-checkable runtime gate entries: the section must be a bullet list of IDs only (e.g., `- fx-ex01-fx-spot`).

## Non-blocking Concerns

- **Evidence-policy mismatch**: The evidence index and run config label the runtime fixture as `fx-ex01-fx-spot`, and the plan’s narrative mentions `fx-ex01-fx-spot.xml`, but the validator’s parser expects only the ID. While the *narrative* test descriptions correctly reference the XML file, the plan must use machine-parseable IDs in the header block. This is a formatting inconsistency, not a logic failure.

- **Over-reliance on unsupported runtime phrasing elsewhere**: The plan’s “Runtime support” validation gate says *“Only fixture `fx-ex01-fx-spot` is runtime supported”*. While logically correct, the plan’s header block failed to encode it in the required machine-checkable form, which is why the validator flagged it.

---

Decision: NEXT_ROUND_REQUIRED