# Deterministic Plan Validation

The planner output failed machine validation before LLM critique.

# Plan Validation

Status: failed

## Blocking Issues

- Plan missing required section "## Implementation scope (machine-checked)" with **In scope (implementation groups):** and at least one implementation group slug from 00-product-scope.json (productGroups[].group).
- Plan missing required section "## Runtime supported fixtures (machine-checked)" with a bullet list of fixture ids exactly matching this run's runtimeFixtures config.
- Plan missing required section "## Java shell contract (machine-checked)".
- Plan missing required section "## Rosetta evidence coverage (machine-checked)".

## Warnings

- none

## Validation details

- Mode: structured-section
- Parsed in-scope groups: (none)
- Parsed out-of-scope groups: (none)
- Parsed runtime fixture ids: (none)



Decision: NEXT_ROUND_REQUIRED