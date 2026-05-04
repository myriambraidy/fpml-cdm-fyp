Let me validate the critic review against the planner plan and the provided evidence.

### Critic Review Analysis

1. **Scope validation**:
   - The critic correctly verifies that `fx-single-leg` is marked as in-scope, aligning with `currentImplementationGroup: "fx-single-leg"` from `00-product-scope.json`.
   - It correctly confirms all other groups (`fx-swap`, `fx-simple-option`, etc.) are explicitly marked out-of-scope.

2. **Runtime fixtures validation**:
   - The critic correctly verifies that only `fx-ex01-fx-spot` is listed as runtime supported, which matches the run_config's `runtimeFixtures` section.

3. **Evidence alignment**:
   - The critic confirms alignment between the plan and `evidence-index.md`, which shows `fx-ex01-fx-spot` as the only runtime fixture for the fx-single-leg group.

4. **Minor concern about notation**:
   - The critic notes a difference in notation between the plan ("fx-ex01-fx-spot" as a string) and run_config (object mapping), but correctly accepts this as acceptable.

The critic review correctly validates all machine-checked sections of the plan and confirms alignment with evidence sources. No implementation details need to be verified as all claims are supported by evidence.

### Valid Critique Items

| Critique Item | Validity | Reason |
|---------------|----------|--------|
| Implementation scope validation | ✓ Valid | Plan correctly identifies fx-single-leg as in-scope and all other groups as out-of-scope, matching product-scope.json |
| Runtime fixtures validation | ✓ Valid | Plan correctly restricts runtime fixtures to fx-ex01-fx-spot, matching run_config and evidence-index.md |
| Evidence alignment | ✓ Valid | All assertions align with provided evidence (product-scope.json, evidence-index.md, run_config) |
| Minor notation concern | ✓ Valid | The critic appropriately accepts the difference between plan notation and run_config format |

### Decision: ACCEPTED

The critic review correctly validates all aspects of the planner plan against the evidence. The plan is well-structured, aligned with product scope, and appropriately restricts implementation to the fx-single-leg group with only fx-ex01-fx-spot as a runtime fixture.

## Revised Implementation Checklist

- [x] **Product scope alignment**: Plan correctly targets fx-single-leg group based on currentImplementationGroup in product-scope.json
- [x] **Runtime fixtures restriction**: Only fx-ex01-fx-spot is specified as runtime supported, matching run_config
- [x] **Out-of-scope products**: All other FX groups (fx-swap, fx-simple-option, etc.) are explicitly marked as out of scope
- [x] **Java package design**: Clear package structure defined for FxSingleLegMapper with supporting classes
- [x] **Mapping responsibilities**: Clear delegation of responsibilities to Rosetta functions
- [x] **Test strategy**: Unit tests specified for fx-ex01-fx-spot with snapshot validation
- [x] **Validation gates**: Specific correctness criteria defined for functional alignment
- [x] **Unsupported behavior**: Appropriate limitations documented (NDF handling, etc.)
- [x] **Traceability requirements**: Clear mapping lineage requirements specified
- [x] **Critic review validation**: All checks passed against product scope and evidence

The planner plan is ready to proceed to implementation.