# Round 1 Summary

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

- **Runtime fixtures section is malformed and missing IDs**: The section `## Runtime supported fixtures (machine-checked)` lists file names only (e.g., `fx-ex01-fx-spot.xml`) but does not use the exact required format `id: filename` where `id` comes from `run_config.runtimeFixtures` keys. The validation fails because the list does not contain all 7 fixture IDs in required format:
- `fx-ex01-fx-spot` missing
- `fx-ex02-spot-cross-w-side-rates` missing
- `fx-ex03-fx-fwd` missing
- `fx-ex04-fx-fwd-w-settlement` missing
- `fx-ex05-fx-fwd-w-ssi` missing
- `fx-ex06-fx-fwd-w-splits` missing
- `fx-ex07-non-deliverable-forward` missing
- **Non-FX fixtures are mentioned as “out of scope” but the plan must exclude them explicitly by referencing productGroups[].group slugs**, which it does correctly. This is acceptable, but the runtime fixtures section must still match `run_config.runtimeFixtures` exactly.
- **Support for Rosetta functions lacks citation of functions in preflight or authoritatively**: While the plan lists the Rosetta function names, it does not explicitly cite the function context or call graph to confirm existence and arity. This is a minor concern because the next round will require verification against Rosetta execution context.

## Resolution Notes

- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd: fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement: fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi: fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits: fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward: fx-ex07-non-deliverable-forward.xml
- `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, `non-fx`
- ✅ A Rosetta function (listed above)
- ✅ An FpML path (e.g., `trade/fxSingleLeg/settlementDate` → `SettlementPayout`)
