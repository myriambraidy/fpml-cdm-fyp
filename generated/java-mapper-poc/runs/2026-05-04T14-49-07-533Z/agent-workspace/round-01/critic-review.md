```markdown
# Plan Review Report

## Evidence Summary

### Product Scope (00-product-scope.json)
- **Product family**: `fx-derivatives`
- **Current implementation group**: `fx-single-leg`
- **Runtime fixtures**: 7 fixtures under `fx-single-leg`:
  - fx-ex01 through fx-ex07 (fx-spot through non-deliverable-forward)
- **Staged rollout** plan: `fx-single-leg` → `fx-swap` → `fx-simple-option` → others

### Runtime Fixtures (run_config)
Explicitly required runtime fixtures (ids and files):
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

### Rosetta FX Functions (rosetta-generation-context.md)
- **Core mapping functions for fx-single-leg** are present, well-documented, and fully defined:
  - `MapFxSingleLegCounterpartyList`
  - `MapFxSingleLegAncillaryPartyList`
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
- **Supporting helpers** (e.g., `MapPayerReceiver`, `MapCurrency`, `MapFxCoreDetailsModelQuantityWithAddress`) exist and are listed.
- **All required CDM classes** are supported (as verified by `cdm-rosetta-preflight.md`).

### Validation Status (plan-validation.md)
- **Status**: `failed`
- **Blocking issue**: `Parsed runtime fixture ids: (none)` — the plan’s "Runtime supported fixtures (machine-checked)" section does not contain **any** fixture IDs in machine-checkable bullet format.

## Blocking Issue

❌ The plan’s **"## Runtime supported fixtures (machine-checked)"** section uses narrative prose like:
```markdown
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- …
```
but the validator **requires exact IDs only**, and in bullet form. Since no valid IDs were parsed (per `plan-validation.md`), the plan fails the machine-check gate.

✅ The plan contains the required **"## Implementation scope (machine-checked)"** section, and the in-scope group (`fx-single-leg`) matches `currentImplementationGroup`.

## Non-blocking Concerns

- **CDM construction is safe**: Plan uses Rosetta-generated CDM Java objects directly as internal representation, aligns with `"maven-compile-gated-jackson-serialization"` mode in `cdm-rosetta-preflight.md`, and avoids raw JSON.
- **No unsupported CDM/Rosetta classes referenced**: The classes used (`Counterparty`, `Payout`, `SettlementPayout`, `ResolvablePriceQuantity`, etc.) are listed in `cdm-rosetta-preflight.md`.
- **No unsupported broad FX claims**: Out-of-scope groups are listed, and the scope is limited to `fx-single-leg`.
- **Traceability is strong**: Rosetta functions are mapped to Java methods and tests.

## Decision

Decision: NEXT_ROUND_REQUIRED
```