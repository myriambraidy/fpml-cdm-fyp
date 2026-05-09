# Review of planner-plan.md for 2026-05-07T16-47-50-775Z

## Blocking Issues

- **Runtime fixtures section is malformed and missing IDs**: The section `## Runtime supported fixtures (machine-checked)` lists file names only (e.g., `fx-ex01-fx-spot.xml`) but does not use the exact required format `id: filename` where `id` comes from `run_config.runtimeFixtures` keys. The validation fails because the list does not contain all 7 fixture IDs in required format:
  - `fx-ex01-fx-spot` missing
  - `fx-ex02-spot-cross-w-side-rates` missing
  - `fx-ex03-fx-fwd` missing
  - `fx-ex04-fx-fwd-w-settlement` missing
  - `fx-ex05-fx-fwd-w-ssi` missing
  - `fx-ex06-fx-fwd-w-splits` missing
  - `fx-ex07-non-deliverable-forward` missing

- **Non-FX fixtures are mentioned as “out of scope” but the plan must exclude them explicitly by referencing productGroups[].group slugs**, which it does correctly. This is acceptable, but the runtime fixtures section must still match `run_config.runtimeFixtures` exactly.

## Non-blocking Concerns

- **Support for Rosetta functions lacks citation of functions in preflight or authoritatively**: While the plan lists the Rosetta function names, it does not explicitly cite the function context or call graph to confirm existence and arity. This is a minor concern because the next round will require verification against Rosetta execution context.

- **Input model `FpmlFxSingleLeg` is not a CDM Java class, and the plan correctly treats it as an XML-parsed DTO**. This is aligned with the expected design for raw XML input.

- **The plan correctly avoids raw JSON construction for internal CDM model and avoids using raw JSON as the internal data model**. This is correct.

- **No mention of CDM/Rosetta Java classes not proven by preflight**: The plan references only approved CDM classes and avoids forbidden categories.

## Decision

Decision: NEXT_ROUND_REQUIRED