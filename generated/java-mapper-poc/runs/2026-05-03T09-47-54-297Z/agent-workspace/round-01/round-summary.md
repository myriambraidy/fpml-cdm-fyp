# Round 1 Summary

Decision: UNKNOWN

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

1. **Missing "## Implementation scope (machine-checked)" section header and `currentImplementationGroup` verification**
2. **Unsupported group fx-swap listed incorrectly**
3. **Overreach in "expiryDateTime mapping must convert into exerciseTerms.expiration"**
4. **Test coverage includes option-specific tests**
1. **Party assignment logic in `FxSingleLegMapper` lacks detail**
2. **Missing explicit mention of settlement information handling**
3. **Package naming convention not justified**
4. **Missing explicit trace to cookbook rules per fixture**
5. **No mention of NDF-specific logic for fx-ex07**
6. **Date normalization rule may be incomplete for NDF fixing dates**

## Resolution Notes

- fx-ex04: custom settlement instructions
- fx-ex05: standard settlement styles
- fx-ex06: split settlements
- fx-ex07: NDF cash settlement
- fx-ex02: requires RULE-005 (side rates)
- fx-ex06: requires RULE-005 + settlement splits
- fx-ex07: requires NDF-specific rules (cash settlement, fixing)
- [x] ✅ **Product scope alignment:**
- [x] ✅ **Test coverage correction:**
- [x] ✅ **Remove unsupported `expiryDateTime` requirement:**
