# Review: Planner Plan for FX Derivatives Java Mapper (Round 3)

## Verification of Machine-Checked Scope Section

✅ The plan contains the required header:
> ## Implementation scope (machine-checked)
> **In scope (implementation groups):**
> - fx-single-leg

✅ This matches the `currentImplementationGroup` value `fx-single-leg` from `00-product-scope.json`.

✅ Out-of-scope groups are correctly listed: `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, `non-fx`.

✅ All 7 runtime-supported fixtures belong to `fx-single-leg`.

✅ The plan explicitly defers option, swap, and strategy products, aligning with `implementationHint: "later"` or `"candidate"` in `productGroups[]`.

✅ No Implementation Group Change Proposal is present, which is correct because the current group `fx-single-leg` is also the default and `good-first-target`.

**Conclusion on machine-check:** The plan satisfies the structural requirement for the `## Implementation scope (machine-checked)` section.

---

## Blocking Issues

### 1. Missing Product Root → CDM Product Taxonomy Mapping

**Issue**: No rule or evidence cited for how the FpML product root (`fxSingleLeg`, `fxSwap`, etc.) maps to the CDM product taxonomy qualifier (`ForeignExchange_Spot_Forward`, `ForeignExchange_Swap`, `ForeignExchange_VanillaOption`, etc.).  

**Why it’s blocking**:
- Rosetta blocks (`MapFxSingleLegNonTransferableProduct`, `MapFxSwapNonTransferableProduct`, etc.) assign specific `productQualifier` values based on the FpML root.
- Evidence-packet.md shows CDM `product.taxonomy.productQualifier` as ISDA strings (e.g., `ForeignExchange_Spot_Forward`), but the planner does not reference:
  - Which Rosetta function performs this mapping
  - The mapping logic
  - How to disambiguate spot vs forward (valueDate logic)

**Evidence**:  
From `expected_cdm_summary` for fx-ex01 (spot):
```
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
```
From fx-ex08 (swap):
```
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_Swap
```
From fx-ex09 (euro-opt):
```
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_VanillaOption
```
The planner must specify which Rosetta functions supply these qualifiers and how.

**Remediation**:
- Cite `MapFxSingleLegNonTransferableProduct`, `MapFxSwapNonTransferableProduct`, etc., and extract their qualifier logic.
- Provide a table or explicit rules per FpML root → CDM qualifier, including spot/forward differentiation (e.g., based on `valueDate` distance).

---

### 2. Incomplete Fixture Coverage

**Issue**: The plan states “All 7 single-leg examples must map”, but fx-ex07 (non-deliverable forward) has additional required semantics (`nonDeliverableForward`, `fixing`, `settlementCurrency`) not addressed.

**Why it’s non-trivial**:
- NDFs require a different CDM settlement type (Cash with `settlementCurrency` and `cashSettlementTerms`) rather than standard settlement instructions.
- Evidence-packet.md shows:
  ```
  $.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
  $.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementCurrency.value = USD
  $.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementTerms.cashSettlementTerms...
  ```
- No mention of how the `nonDeliverableForward` block is handled.

**Remediation**:
- Explicitly state how `nonDeliverableForward` → `Cash` + `settlementCurrency` + `cashSettlementTerms` is implemented.
- Include the Rosetta reference (e.g., `MapFxSingleLegEconomicTerms` has an NDF branch).

---

### 3. Reference Resolution Not Linked to Rosetta

**Issue**: The plan mentions “use the same reference resolution logic as demonstrated in Rosetta blocks” but does not cite:
- The function names (e.g., `MapFxSingleLegCounterpartyList`)
- How `partyReference` hrefs are mapped to CDM party roles (`Party1`, `Party2`)
- How buyer/seller in FPML maps to `payerReceiver` in CDM (e.g., `exchangedCurrency1.payerPartyReference = party2` → `Party2` as `payer` in CDM)

**Why it’s blocking**:
- The `expected_cdm_summary` for fx-ex01 shows:
  ```
  $.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
  $.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
  $.trade.counterparty[0].role = Party1
  $.trade.counterparty[0].partyReference.externalReference = party2
  ```
  Note the inversion: `party2` in FPML maps to `Party1` in CDM. This must be handled consistently, and the plan should reference the exact Rosetta function (`MapFxSingleLegCounterpartyList`) and its role assignment logic.

**Remediation**:
- Explicitly name `MapFxSingleLegCounterpartyList` and describe its role assignment.
- Add a rule or table mapping FPML href → CDM role with inversion where observed.

---

## Non-Blocking Concerns

### 1. Date Normalization Evidence Is Superficial

The plan mentions “Convert FpML date formats to CDM dates” but only cites cookbook `RULE-002` (remove trailing Z). This is insufficient for:
- `creationTimestamp` → `tradeDate.meta` (if needed)
- `valueDate`/`expiryDate` → `adjustableDate.adjustedDate.value`
- Business center/date adjustment logic (`SettlementDateAdjustments`, `DateAdjustments`)

**Suggestion**: Add explicit references to Rosetta’s `MapAdjustableDate`, `MapAdjustedDateToAdjustableDate`, `GetFpmlFxExercise`, etc., and explain how `valueDate` maps to settlement date or exercise date depending on product type.

### 2. Settlement Information Not Covered

Only `fx-ex04` and `fx-ex06` include `settlementInformation`. The plan does not address:
- `settlementInstruction` → `SettlementPayout.settlementTerms.settlementInstruction`
- `standardSettlementStyle` → `SettlementPayout.settlementTerms.standardSettlementStyle`
- `splitSettlement` → multiple `SettlementPayout` entries

**Recommendation**: Clarify handling of:
- Standard vs custom settlement instructions
- Split settlement (one currency → multiple payouts)

---

## Evidence and Runtime Support

- ✅ Evidence is present (fixtures and expected CDM JSON paths)
- ✅ No runtime LLM calls required (Java mapper implementation is appropriate)
- ❌ **Runtime support claim is incomplete** because:
  - Missing NDF handling
  - Missing settlement instruction handling
  - Missing product taxonomy mapping logic

**Impact**: The plan cannot be verified as complete until the above blocking issues are resolved.

---

## Decision

Decision: NEXT_ROUND_REQUIRED