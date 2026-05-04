# Review: Planner Plan for `fx-derivatives` Java Mapper POC

## Blocking Issues

### 1. **Runtime fixtures section incomplete / malformed**

The plan’s `## Runtime supported fixtures (machine-checked)` section lists **fixture names with file suffixes**, e.g.:

```
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
```

But the validator output shows it **parsed zero runtime fixture IDs** — meaning the parser did not extract the required fixture IDs (e.g., `fx-ex01-fx-spot`, not `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`), and the **machine-check failed entirely**.

Per `run_config.runtimeFixtures` (copied above), the *correct* format is:

```yaml
runtimeFixtures:
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
```

and the plan’s bullet list must contain the **same IDs only** — *not* the full `id: file.xml` syntax — e.g.:

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

Without this exact format, the fixture list cannot be compared against `run_config.runtimeFixtures`, and validation fails.

> 🔴 **Blocking issue.** Must be fixed.

### 2. **No explicit “Implementation Group Change Proposal”**

The plan is correct to target `fx-single-leg`, but the instructions require an explicit section **if currentImplementationGroup is not `fx-single-leg`**, or to restate the current group for clarity.

While this is minor (current is `fx-single-leg`), and the plan *does* include `**In scope (implementation groups):** fx-single-leg`, the validator does *not* look for that. It only inspects `## Runtime supported fixtures (machine-checked)` and `## Implementation scope (machine-checked)` sections for machine parsing.

Still, no blocking issue *by itself* — but it’s a reminder that the machine checks are strict and syntactic.

## Non-blocking Concerns

### 1. **Missing Rosetta function citations**

The plan lists mapping responsibilities and helper functions with high fidelity (e.g., `MapFxSingleLegCounterpartyList`), and the Rosetta context (`rosetta-generation-context.md`) confirms all those functions exist.

However, the plan does **not** explicitly cite the Rosetta source functions (file + line numbers), nor does it reference `rosetta-generation-context.md`. While the validator does *not* require this citation for approval, it’s a best-practice for maintainability — and future versions may require it.

> 🟡 Suggestion: Add inline citations like `Source: rosetta-source/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:17-27`.

### 2. **CDM model usage — safe, but implicit**

The plan states that it will use CDM classes from `cdm-java:6.7.0`, and `cdm-rosetta-preflight.md` confirms that the validator supports those types (`Trade`, `NonTransferableProduct`, etc.). However, the plan does **not** explicitly say “*all CDM classes used will be derived from `cdm-java:6.7.0`*”, nor does it reference `cdm-rosetta-preflight.md`.

Again, not blocking *yet*, but the critic’s policy says: *“Block the plan if it references CDM/Rosetta classes not proven by preflight.”*

Since `cdm-rosetta-preflight.md` is authoritative and the listed CDM types *are* in preflight, this is a *non-blocking* concern — not a blocker.

### 3. **“Supported FX products” narrative may imply broader FX coverage**

The plan states:

> The following FX products are supported in this implementation phase: FX spot, FX forward, NDF.

This is correct *and helpful narrative*, but the validator does not parse this section. It only inspects the machine-checked sections.

However, *if* in the future a plan claims support for FX options in this run, the critic must compare to `00-product-scope.json` and `run_config.runtimeFixtures`. Since this plan does **not** overclaim, no concern.

## Decision

The plan is well-structured and mostly correct, but the **machine-checked fixture list is malformed**, causing a failed machine validation.

The critic must enforce the schema strictly.

Decision: **NEXT_ROUND_REQUIRED**