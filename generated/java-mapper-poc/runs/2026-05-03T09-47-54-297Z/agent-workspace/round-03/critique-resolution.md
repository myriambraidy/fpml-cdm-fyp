## Critique Validation

### Critique Item 1: **NDF fixture omission (`fx-ex07`) breaks `fx-single-leg` coverage**
- ✅ **Valid**
- Reason: `00-product-scope.json` explicitly states `fx-single-leg` has **7 fixtures**, and `fx-ex07-non-deliverable-forward.xml` is listed with high-confidence classification. The planner’s justification (“lack of cookbook evidence”) is not sufficient — the requirement is to implement a *baseline* for the *entire group*. CDM evidence confirms that core fields required for a minimal mapping (`payerPartyReference`, `receiverPartyReference`, `paymentAmount`, `valueDate`, `settlementCurrency`) *are* present in the fixture and match stable rules (`RULE-001`, `RULE-002`, `RULE-005`). Excluding it breaks semantic test coverage and contradicts the scope definition.

### Critique Item 2: **Vague handling of NDF settlement fields**
- ✅ **Valid**
- Reason: The CDM evidence for `fx-ex07` shows:  
  `$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementCurrency.value = USD`,  
  `settlementDate.valueDate = 2002-04-11`,  
  and `FxOptionCashSettlementTerms` structures (`fixingDate`, `fixingTime`, `primaryRateSource`). While `RULE-005` covers `paymentAmount→quantity`, it does *not* cover `settlementCurrency`, which is NDF-specific. The plan must clarify whether `settlementCurrency` is handled via `SettlementTerms.settlementCurrency`, or if an extension is needed.

### Critique Item 3: **Missing `productType→taxonomy` mapping**
- ✅ **Valid**
- Reason: The CDM evidence for all `fx-single-leg` fixtures shows `product.taxonomy[0].source = ISDA` and `productQualifier = ForeignExchange_Spot_Forward`. Although no cookbook *stable rule* explicitly covers this mapping, the CDM expectation is clear, and the implementer must know where to source `productType` (or derive it from `fxSingleLeg` root) to populate taxonomy. Omission here risks incorrect product classification.

### Critique Item 4: **Date normalization scope unclear (`valueDate`)**
- ✅ **Valid**
- Reason: `fx-ex07` contains `valueDate = 2002-04-11Z`, and CDM maps it to `settlementDate.valueDate = 2002-04-11`. The plan mentions date normalization for `tradeDate` but doesn’t explicitly confirm whether `valueDate` is also trimmed of trailing `Z`. Since `settlementDate.valueDate` is used in NDF and forward fixtures, this clarification is needed for correctness.

### Critique Item 5: **`currentImplementationGroup` should acknowledge future phases**
- ⚠️ **Partially valid — minor**
- Reason: It’s good practice to acknowledge `candidateNextGroups`, but the current plan is scoped to `fx-single-leg` and the plan header correctly shows `currentImplementationGroup: fx-single-leg`. Adding a brief forward-looking statement improves clarity but doesn’t block implementation.

### Critique Item 6: **Missing `fx-ex07` in traceability table**
- ✅ **Valid**
- Reason: Omission breaks traceability. Adding the NDF fixture with applicable rules and any extensions is required for auditability and test planning.

---

## Decision: NEXT_ROUND_REQUIRED

### Required Fixes for Next Round

1. **Include `fx-ex07-non-deliverable-forward.xml`**  
   → Add to end-to-end tests as a baseline mapping: `payerPartyReference`, `receiverPartyReference`, `paymentAmount` → `PriceQuantity`, `valueDate` → `settlementDate.valueDate`, and `nonDeliverableForward/settlementCurrency` → `SettlementTerms.settlementCurrency`.  
   → Add fixture to `FxSingleLegEndToEndTest`.

2. **Document NDF settlement mapping**  
   → Add a subsection **“NDF Settlement Handling”** clarifying:  
   - `settlementCurrency` is mapped from `nonDeliverableForward/settlementCurrency` → `SettlementTerms.settlementCurrency.value`  
   - `fixingDate` → `settlementDate.valueDate` (same as `valueDate`)  
   - `fixingTime` and `fixingTime/businessCenter` → mapped only if used (optional in baseline; mark as future extension)  
   - Confirm that `settlementType = Cash` is implied for NDFs unless overridden.

3. **Add product type → taxonomy mapping**  
   → Add entry to traceability table:  
   | Fixture | Applicable Rules |  
   |---------|------------------|  
   | fx-ex07 | RULE-001, RULE-002, RULE-005, `productType→taxonomy` (derived from root `fxSingleLeg` → `ISDA.ForeignExchange_Spot_Forward`) |

4. **Clarify date normalization for `valueDate`**  
   → Update plan header: “Date normalization (trim trailing `Z`) applies to `tradeDate`, `valueDate`, and any `settlementDate` fields when copying to CDM `date.value` or `settlementDate.valueDate`.”

5. **Acknowledge future groups**  
   → Add one sentence to “Implementation Group Change Proposal”:  
   > “This phase implements `fx-single-leg` as the default starting group. Future phases may target `fx-swap` or `fx-simple-option` per `candidateNextGroups` in `00-product-scope.json`.”

---

## Revised Implementation Checklist

- [ ] Include `fx-ex07-non-deliverable-forward.xml` in all tests  
- [ ] Implement `SettlementTerms.settlementCurrency` field in model  
- [ ] Map `nonDeliverableForward/settlementCurrency` to `SettlementTerms.settlementCurrency.value`  
- [ ] Map `valueDate` → `settlementDate.valueDate` with date normalization (trim `Z`)  
- [ ] Add `productType→taxonomy` mapping rule (implicit: `fxSingleLeg` root → `ISDA.ForeignExchange_Spot_Forward`)  
- [ ] Update traceability table to include `fx-ex07`  
- [ ] Add “NDF Settlement Handling” subsection to plan  
- [ ] Update test matrix (`FxSingleLegEndToEndTest`) to cover `fx-ex07`  
- [ ] Add note on future groups in Implementation Group Change Proposal