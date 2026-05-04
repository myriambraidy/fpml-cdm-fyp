Let me validate the planner's Markdown plan against the product scope and evidence index.

First, checking the critical machine-checked sections:

1. "## Implementation scope (machine-checked)" section:
   - Contains `**In scope (implementation groups):**` with `fx-single-leg` bullet ✓
   - Contains `currentImplementationGroup: "fx-single-leg"` from product-scope.json ✓
   - Lists all other product groups as out of scope (not just "reserved for future") ✓

2. "## Runtime supported fixtures (machine-checked)" section:
   - Contains exactly one bullet: `fx-ex01-fx-spot` ✓
   - Matches `runtimeFixtures` in run_config: `fx-ex01-fx-spot: fx-ex01-fx-spot.xml` ✓
   - Evidence index confirms this is the only runtime fixture for fx-single-leg group ✓

Other checks:
- The plan's "Supported FX products for this run" matches the implementation scope.
- No overreach - the plan correctly restricts to fx-single-leg and explicitly marks other groups as out of scope.
- Evidence from evidence-index.md and 00-product-scope.json confirms fx-ex01-fx-spot is the only runtime fixture.
- The test section only references fx-ex01-fx-spot for runtime validation, which is correct.
- Unsupported behavior section appropriately excludes features that are not part of fx-single-leg (NDF handling, etc.)

No implementation details need to be verified with tools since all claims align with the provided evidence.

Only one minor concern: The run_config runtimeFixtures is an object with mapping, but the plan uses "fx-ex01-fx-spot" as a simple string. This is acceptable as the plan's "runtime supported fixtures" section explicitly matches the expected structure of runtimeFixtures.

Decision: ACCEPTED