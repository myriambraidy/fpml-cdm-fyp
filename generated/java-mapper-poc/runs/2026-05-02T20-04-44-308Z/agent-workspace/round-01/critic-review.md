# Plan Review

## Blocking Issues

### 1. Missing machine-checked scope declaration
The plan lacks the required `## Implementation scope (machine-checked)` header with explicit `**In scope (implementation groups):**` bullets listing the **currentImplementationGroup** (`fx-single-leg`) in `productGroups[].group` slugs. While `fx-single-leg` appears in the narrative, the strict section header and bullet format required for validation is absent.

**Impact**: Plan cannot be machine-checked for alignment with `00-product-scope.json`’s `currentImplementationGroup`.

### 2. Overreach in tests
The plan states:
> Tests for each FX product type mapping

and lists:
- FX spot, forward, NDF (within scope)
- but tests section does not clarify which test data (expected CDM) corresponds to which product. This is unsupported by evidence-packet.md fixture lists which assign each fixture to exactly one product group and product type. The test description risks conflating responsibilities across product groups.

**Impact**: Risk of test sprawl, unclear test isolation, and potential runtime/agent-runtime confusion.

### 3. Unsupported behavior: fx-swap ambiguity
While `fx-swap` is correctly listed as out of scope, the plan does not address the fact that `fx-ex08-fx-swap.xml` is a **staged-by-product-group** candidate in `candidateNextGroups`. The plan should not imply future scope or add implementation details for fx-swap.

**Impact**: Potential implementation confusion if future-stage fixtures are mistakenly included.

## Non-blocking Concerns

### 1. `FxSwap.java` in model list
`model/FxSwap.java` is listed in the package structure diagram but `fx-swap` is explicitly out of scope. If `FxSwap` is not implemented in this round, it should either be commented out or removed.

### 2. Missing `currentImplementationGroup` in header
The plan does not include a `currentImplementationGroup: fx-single-leg` declaration in the header section. This is not strictly blocking but adds clarity.

### 3. “FX single-leg” test example listing
The “Supported FX products” list includes specific variants (“FX forward with settlement information” etc.) which are fine as narrative, but the plan should ensure tests map exactly to fixtures in `fx-single-leg` group and do not add fixtures from other groups.

## Evidence Alignment

### 00-product-scope.json
- `currentImplementationGroup` = `fx-single-leg` ✅
- `productGroups` includes `group: "fx-single-leg"` with 7 fixtures ✅
- `candidateNextGroups` = `["fx-swap", "fx-simple-option"]` — correctly listed as out of scope ✅
- `nonFxFixtures` correctly excluded ✅

### evidence-packet.md
- `fx-single-leg` fixtures match 00-product-scope.json ✅
- No evidence supports fx-swap, fx-option, or other out-of-scope product types ✅

## Decision

Decision: NEXT_ROUND_REQUIRED