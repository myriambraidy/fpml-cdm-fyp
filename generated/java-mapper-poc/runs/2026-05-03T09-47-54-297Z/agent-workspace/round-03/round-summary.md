# Round 3 Summary

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

- **Product type taxonomy mapping**: The plan does not include a mapping for `productType`→`product.taxonomy` (e.g., “ForeignExchange_Spot_Forward”). While the CDM summary for single-legs uses `ISDA` taxonomy, no cookbook stable rule covers this. It should be added to the traceability table.
- **Date normalization scope**: The plan mentions date normalization for `tradeDate` but does not clarify whether `valueDate` (where present) is also normalized. NDF and forward fixtures contain `valueDate` in the FPML; CDM uses `settlementDate.valueDate`. Clarify whether date normalization applies to `valueDate`→`settlementDate.valueDate` as well.
- **`currentImplementationGroup` in plan header**: The plan header includes `currentImplementationGroup: fx-single-leg`, which is good. However, `00-product-scope.json` shows `currentImplementationGroup` is the *default* and `candidateNextGroups` include `fx-swap`, `fx-simple-option`. The plan should briefly acknowledge that future phases may target these groups.
- **Traceability table for `fx-ex07`**: The table is missing the NDF fixture. Add an entry showing applicable rules and any extensions.

## Resolution Notes

- ✅ **Valid**
- Reason: `00-product-scope.json` explicitly states `fx-single-leg` has **7 fixtures**, and `fx-ex07-non-deliverable-forward.xml` is listed with high-confidence classification. The planner’s justification (“lack of cookbook evidence”) is not sufficient — the requirement is to implement a *baseline* for the *entire group*. CDM evidence confirms that core fields required for a minimal mapping (`payerPartyReference`, `receiverPartyReference`, `paymentAmount`, `valueDate`, `settlementCurrency`) *are* present in the fixture and match stable rules (`RULE-001`, `RULE-002`, `RULE-005`). Excluding it breaks semantic test coverage and contradicts the scope definition.
- ✅ **Valid**
- Reason: The CDM evidence for `fx-ex07` shows:
- ✅ **Valid**
- Reason: The CDM evidence for all `fx-single-leg` fixtures shows `product.taxonomy[0].source = ISDA` and `productQualifier = ForeignExchange_Spot_Forward`. Although no cookbook *stable rule* explicitly covers this mapping, the CDM expectation is clear, and the implementer must know where to source `productType` (or derive it from `fxSingleLeg` root) to populate taxonomy. Omission here risks incorrect product classification.
- ✅ **Valid**
- Reason: `fx-ex07` contains `valueDate = 2002-04-11Z`, and CDM maps it to `settlementDate.valueDate = 2002-04-11`. The plan mentions date normalization for `tradeDate` but doesn’t explicitly confirm whether `valueDate` is also trimmed of trailing `Z`. Since `settlementDate.valueDate` is used in NDF and forward fixtures, this clarification is needed for correctness.
- ⚠️ **Partially valid — minor**
- Reason: It’s good practice to acknowledge `candidateNextGroups`, but the current plan is scoped to `fx-single-leg` and the plan header correctly shows `currentImplementationGroup: fx-single-leg`. Adding a brief forward-looking statement improves clarity but doesn’t block implementation.
