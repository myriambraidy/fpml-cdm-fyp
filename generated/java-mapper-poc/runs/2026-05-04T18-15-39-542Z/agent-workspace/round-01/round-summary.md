# Round 1 Summary

Decision: NEXT_ROUND_REQUIRED

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

- `## Implementation scope (machine-checked)` with `**In scope (implementation groups):**` bullet matching `currentImplementationGroup: fx-single-leg`.
- `## Runtime supported fixtures (machine-checked)` — but **incorrectly formatted**: it lists fixture files (`fx-ex01-fx-spot.xml`) instead of the required fixture *ids* (`fx-ex01-fx-spot`), per `00-run-config/runtimeFixtures`.
- The validation rule explicitly expects: `Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex01-fx-spot`.
- The `00-run-config/runtimeFixtures` keys are `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, ..., `fx-ex07-non-deliverable-forward`.
- The evidence-index.md confirms the runtime fixtures are identified by these IDs, with file paths mapped externally.
- - fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- **FpML DTO naming**: The plan proposes `FpmlFxSingleLegDto` — acceptable, since CDM Java forbids `FpmlFxSingleLeg`. However, ensure it avoids naming collisions with future generated internal DTOs.
- **CDM classes marked as “Unsupported Behavior”** (`SettlementPayout`, `ResolvablePriceQuantity`) are correctly flagged per `cdm-java-negative-classes.md`, but they are also listed under **Allowed Classes** earlier — contradictory. The **Allowed Classes** section should **omit** them (per `-` in negative list), not just add a note. This creates a planning inconsistency even though the final code should exclude them.
- **Rosetta function calls**: The plan mentions calling Rosetta functions (e.g., `MapFxCoreDetailsModelToSettlementPayout`) but does not specify how Java will invoke Rosetta logic — via compiled Rosetta JAR or JIT. This is architectural, not blocking if a runtime bridge is assumed.

## Resolution Notes

- **Reasoning**:
- The `00-run-config/runtimeFixtures` explicitly defines fixture IDs as keys (e.g., `fx-ex01-fx-spot`), with values being file paths (e.g., `fx-ex01-fx-spot.xml`).
- `plan-validation.md` fails with:
- The `critic-review.md` correctly identifies that the format `id: filename.xml` is *invalid* — the section must list IDs *alone*, one per line (e.g., `- fx-ex01-fx-spot`), not `id: file.xml`.
- This is a structural, machine-readable requirement per `plan-validation.md`’s `structured-section` mode and the validator spec.
- **Required fix**:
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
