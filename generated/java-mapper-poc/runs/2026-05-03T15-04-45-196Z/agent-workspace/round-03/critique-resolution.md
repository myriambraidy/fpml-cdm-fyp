# Critique Review Decision

## Validated Critique Items

### ✅ Valid: Missing Product Root → CDM Taxonomy Mapping (Blocking)

**Reason**: The plan does not reference Rosetta functions or provide mapping logic for how the FpML root (`fxSingleLeg`) maps to CDM `productQualifier`. The evidence-packet.md shows:
- `ForeignExchange_Spot_Forward` (spot/forward)
- `ForeignExchange_Swap`
- `ForeignExchange_VanillaOption`

This is critical for the runtime mapper because:
- Spot vs forward is determined by the `valueDate` distance in Rosetta (spot: `T+2` or less; forward: longer)
- The planner must specify:
  - Which Rosetta function performs the mapping (`MapFxSingleLegNonTransferableProduct`)
  - How it distinguishes spot vs forward
  - How the qualifier is assigned

### ✅ Valid: Incomplete NDF Fixture Coverage (Blocking)

**Reason**: The plan acknowledges all 7 fixtures but does not describe how fx-ex07 (non-deliverable forward) is handled. Evidence-packet.md shows:
- Settlement type: `Cash`
- Required fields: `settlementCurrency`, `cashSettlementTerms`, `fixing`
- `nonDeliverableForward/settlementCurrency = USD`
- `nonDeliverableForward/fixing/fixingDate`, `fixingTime`, `rateSource`

This cannot be deferred — runtime support for NDFs must be explicitly covered.

### ✅ Valid: Reference Resolution Not Linked to Rosetta (Blocking)

**Reason**: The plan mentions “use the same reference resolution logic as demonstrated in Rosetta blocks” but does not cite specific functions or explain how party roles are assigned. Evidence shows:
- In fx-ex01 FPML: `exchangedCurrency1.payerPartyReference = party2`
- In CDM: `payout[0].SettlementPayout.payerReceiver.payer = Party1`, and `counterparty[0].partyReference.externalReference = party2`

This inversion (FpML `party2` → CDM `Party1`) is non-trivial and must be handled. The correct Rosetta function is `MapFxSingleLegCounterpartyList`, and the plan must reference it.

### ❌ Not Valid: Date Normalization Is Superficial (Non-Blocking)

**Rejection Reason**: The plan does cite `RULE-002` (remove trailing Z), and the evidence-packet.md confirms `tradeDate.value` uses ISO without 'Z'. While more detail is helpful, the planner is not required to cite every datetime-related Rosetta block. The `creationTimestamp` header field does not need to map to CDM tradeDate — only `tradeHeader.tradeDate` is used, and the cookbook rule already covers it.

### ❌ Not Valid: Settlement Information Not Covered (Non-Blocking)

**Rejection Reason**: While only 2 fixtures include `settlementInformation`, the planner may reasonably defer settlement instruction mapping to a later phase, as long as:
- The runtime gate allows graceful handling of missing settlement instructions
- The CDM output defaults to standard settlement if instruction is missing

The plan does not claim to support *all* settlement variations — only the 7 fixtures. Since fx-ex07 (NDF) is the critical case and is not addressed, but standard settlement is optional for these fixtures, this is not a blocking issue.

---

## Revised Implementation Checklist

```markdown
# FX Derivatives Java Mapper Plan - Round 4 (Revised)

## Implementation Scope (machine-checked)
- **In scope (implementation groups):** fx-single-leg
- **Out of scope:** fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, non-fx

## Product Summary
Current focus: fx-single-leg (7 fixtures). Runtime support includes spot, forward, and NDF.

## Runtime Supported Fixtures
- fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml

## Rosetta Evidence Mapping

### Product Qualifier Logic
- Source: Rosetta function `MapFxSingleLegNonTransferableProduct`
- Logic:
  - `fxSingleLeg` root → ISDA qualifier `ForeignExchange_Spot_Forward`
  - Spot vs forward disambiguation: Based on `valueDate` distance:
    - `T+1` or `T+2` (local business days) → Spot
    - `T+3` or more → Forward
- Evidence:
  - fx-ex01: valueDate = 2001-10-25, tradeDate = 2001-10-23 → T+2 → Spot qualifier
  - fx-ex03: valueDate = 2001-12-21, tradeDate = 2001-11-19 → T+32 → Forward qualifier
  - Both map to `ForeignExchange_Spot_Forward` (CDM lumps spot/forward under same qualifier)
- Action for Java mapper: Always assign `productQualifier = "ForeignExchange_Spot_Forward"` for fxSingleLeg

### NDF Handling
- Source: Rosetta function `MapFxSingleLegEconomicTerms` (NDF branch)
- Mapping:
  - `nonDeliverableForward/settlementCurrency` → `SettlementPayout.settlementTerms.settlementCurrency.value`
  - `settlementCurrency = "USD"` → CDM: `settlementCurrency.value = USD`
  - `nonDeliverableForward/fixing/...` → `cashSettlementTerms[0].valuationMethod.valuationSource`
  - `settlementType = "Cash"` (instead of physical)
- Action for Java mapper:
  - Detect presence of `nonDeliverableForward`
  - Assign `settlementType = "Cash"`
  - Populate `cashSettlementTerms` with fixing date/time/rateSource info

### Reference Resolution
- Source: Rosetta function `MapFxSingleLegCounterpartyList`
- Logic:
  - FpML `partyReference` hrefs resolved to CDM `party` objects
  - Role assignment logic:
    - `buyerPartyReference` / `receiverPartyReference` → `Party1`
    - `sellerPartyReference` / `payerPartyReference` → `Party2`
  - Observed inversion in fx-ex01:
    - FpML: `exchangedCurrency1.payerPartyReference = party2`
    - CDM: `payout[0].payerReceiver.payer = Party1`, and `counterparty[0].partyReference.externalReference = party2`
    - This means `Party1` in CDM corresponds to `party2` in FPML (per the `payerReceiver` roles in CDM)
- Action for Java mapper:
  - Map FpML `party2` → CDM `Party1`
  - Map FpML `party1` → CDM `Party2`
  - Assign roles consistently with the `payerReceiver` logic in `SettlementPayout`

## Java Package/Class Design
- Package: `com.fpml.fx.mapper`
- Classes:
  - `FxSingleLegMapper` (main mapper class)
  - `NdfMapper` (helper class for NDF-specific handling)

## Mapping Responsibilities
1. Handle `fxSingleLeg` root element
2. Map product qualifier to `ForeignExchange_Spot_Forward`
3. For NDF (fx-ex07):
   - Set `settlementType = "Cash"`
   - Populate `cashSettlementTerms` with fixing info
4. Resolve party references: `party1` → CDM `Party2`, `party2` → CDM `Party1`
5. Normalize dates (remove trailing 'Z') using cookbook `RULE-002`
6. Map payment amounts to `tradeLot.quantity`
7. Normalize trade identifiers to `assignedIdentifier`

## Traceability Requirements
- Each mapping rule referenced by Rosetta function name and cookbook rule ID
- Java code must include comments linking to:
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxSingleLegCounterpartyList`
  - `fx-derivatives:RULE-002`

## Unsupported Behavior
- FX options, swaps, strategies, and non-FX products deferred to future phases
- Optional settlement instructions (fx-ex04, fx-ex06) may default to standard if not present

## Validation Gates
- All 7 fixtures must map without data loss
- CDM output must match expected paths from `expected_cdm_summary`
- Runtime must not call LLM
```

Decision: ACCEPTED