## Plan Review

### ✅ Correct Structure
The plan correctly includes:
- `## Implementation scope (machine-checked)` with `**In scope (implementation groups):**` bullet matching `currentImplementationGroup: fx-single-leg`.
- `## Runtime supported fixtures (machine-checked)` — but **incorrectly formatted**: it lists fixture files (`fx-ex01-fx-spot.xml`) instead of the required fixture *ids* (`fx-ex01-fx-spot`), per `00-run-config/runtimeFixtures`.

### 🛑 Blocking Issue: Fixture IDs Mismatch
The validator and runtime config require that `Runtime supported fixtures (machine-checked)` list **fixture IDs** (e.g., `fx-ex01-fx-spot`) — *not file names*. The current plan lists full XML filenames (e.g., `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`), which fails the machine-check because:

- The validation rule explicitly expects: `Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex01-fx-spot`.
- The `00-run-config/runtimeFixtures` keys are `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, ..., `fx-ex07-non-deliverable-forward`.
- The evidence-index.md confirms the runtime fixtures are identified by these IDs, with file paths mapped externally.

The plan must change:
```diff
- - fx-ex01-fx-spot: fx-ex01-fx-spot.xml
+ - fx-ex01-fx-spot
```

### ⚠️ Non-blocking concerns
- **FpML DTO naming**: The plan proposes `FpmlFxSingleLegDto` — acceptable, since CDM Java forbids `FpmlFxSingleLeg`. However, ensure it avoids naming collisions with future generated internal DTOs.
- **CDM classes marked as “Unsupported Behavior”** (`SettlementPayout`, `ResolvablePriceQuantity`) are correctly flagged per `cdm-java-negative-classes.md`, but they are also listed under **Allowed Classes** earlier — contradictory. The **Allowed Classes** section should **omit** them (per `-` in negative list), not just add a note. This creates a planning inconsistency even though the final code should exclude them.
- **Rosetta function calls**: The plan mentions calling Rosetta functions (e.g., `MapFxCoreDetailsModelToSettlementPayout`) but does not specify how Java will invoke Rosetta logic — via compiled Rosetta JAR or JIT. This is architectural, not blocking if a runtime bridge is assumed.

### Decision
Decision: NEXT_ROUND_REQUIRED