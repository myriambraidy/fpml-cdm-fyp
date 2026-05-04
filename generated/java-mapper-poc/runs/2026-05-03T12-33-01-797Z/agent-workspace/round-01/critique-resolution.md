# Critique Review Decision

## Valid Critique Items

| # | Item | Valid | Reason |
|---|------|-------|--------|
| 1 | **FxSwapMapper should produce a list of SettlementPayout** | ✅ Valid | Evidence clearly shows `fx-ex08-fx-swap.xml` has two `<fxSingleLeg>` entries under `<fxSwap>`, and the CDM example has *two* `payout[]` entries: `SettlementPayout[0]` (GBP→USD, party2→party1) and `SettlementPayout[1]` (GBP→USD, party1→party2). The current phrasing “FxSwapMapper maps to CDM `SettlementPayout`” is ambiguous; the plan must clarify that it yields a **list** of mappers or a composite wrapper. |
| 2 | **Fixture paths must match evidence paths** | ✅ Valid | Evidence uses OS-specific backslashes (`data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml`), while the plan uses forward slashes (`fpml/fx-derivatives/<filename>.xml`). The runtime should use absolute or resolved paths consistent with the evidence to avoid hard-coded relative path mismatches. |
| 3 | **Explicit mention of composite rate handling (spot + forward points)** | ✅ Valid | CDM examples for fx-ex03, fx-ex06, fx-ex07 all include `.composite.baseValue` + `.operandType = ForwardPoint`. The plan mentions “edge cases” but does not explicitly state that the `FxSingleLegMapper` will produce a `Composite` price (spot + forward points) where both are present in FpML. This is a core non-literal transformation for forward-rate products. |

## Revised Implementation Checklist

The planner plan is accepted. To address the valid critique items, the implementer should:

- [ ] **Update `FxSwapMapper` description** in the plan:  
  > “`FxSwapMapper` produces a list of two `SettlementPayout` entries (one per `<fxSingleLeg>` inside `<fxSwap>`), mirroring the CDM structure where `payout[0]` and `payout[1]` correspond to the near and far legs respectively.”

- [ ] **Standardize fixture paths** in tests and documentation:  
  Replace `fpml/fx-derivatives/<filename>.xml` with absolute evidence paths:  
  `data_to_learn_from/fpml/fx-derivatives/<filename>.xml`  
  (normalize backslashes to forward slashes in code examples for portability, but resolve to the exact evidence directory.)

- [ ] **Explicitly state composite rate handling** under `FxSingleLegMapper` responsibilities:  
  > “`FxSingleLegMapper` detects `exchangeRate/rate`, `spotRate`, and `forwardPoints`. When `spotRate` and `forwardPoints` are present, it produces a CDM `Composite` value with `baseValue=spotRate`, `operand=forwardPoints`, `arithmeticOperator=Add`, and `operandType=ForwardPoint` (see fx-ex03, fx-ex06, fx-ex07).”

## Decision

**Decision: ACCEPTED**  
The plan meets all machine-checked constraints and the valid non-blocking concerns have been captured in the revised checklist above. The implementer should incorporate these clarifications before proceeding to code generation.