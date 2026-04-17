# Party Resolver Skill

**Generated from:** FPML 5.12 + CDM 5.35.0 analysis  
**Generation date:** 2026-04-17  
**Status:** ⚠️ Generated, requires user review

---

## Purpose

Maps party role fields from FPML to CDM party structures. Handles semantic roles (buyer, seller) and directional payment references (payer, receiver).

---

## Schema Analysis

### FPML Party Fields (8 identified)

| Field | Context | Type | Description |
|-------|---------|------|-------------|
| `buyer` | Trade-level | PartyReference | Buyer party |
| `seller` | Trade-level | PartyReference | Seller party |
| `counterparty` | Trade-level | PartyReference | Counterparty |
| `payer` | Payment context | PartyReference | Party making payment |
| `payee` | Payment context | PartyReference | Party receiving payment |
| `payerPartyReference` | Stream-level | PartyReference | Swap stream payer |
| `receiverPartyReference` | Stream-level | PartyReference | Swap stream receiver |
| `calculationAgentPartyReference` | Trade-level | PartyReference | Calculation agent |

### CDM Party Structure

```
TradableProduct:
  counterparty: Counterparty[2..2]     // Exactly 2 counterparties
    role: CounterpartyRoleEnum         // PARTY_1 or PARTY_2
    partyReference: Party

Payout (in InterestRatePayout, etc.):
  payerReceiver: PayerReceiver
    payer: CounterpartyRoleEnum        // PARTY_1 or PARTY_2
    receiver: CounterpartyRoleEnum
```

---

## Mapping Rules

### Mechanical Mappings (95% confidence)

✅ **buyer → counterparty[0] with role=PARTY_1**
- Direct semantic match
- No ambiguity

✅ **seller → counterparty[1] with role=PARTY_2**
- Direct semantic match
- No ambiguity

✅ **payerPartyReference → payerReceiver.payer**
- Stream-level directional reference
- Clear mapping from synonym file

✅ **receiverPartyReference → payerReceiver.receiver**
- Stream-level directional reference
- Clear mapping from synonym file

---

### Contextual Mappings (75% confidence)

⚠️ **payer + premium context → buyer (PARTY_1)**
- Reasoning: Buyer typically pays premium to seller in option trades
- **TODO:** Verify this rule with your institution's FPML files
- **Evidence needed:** Check premium payment direction in sample trades

⚠️ **payer + settlement context → seller (PARTY_2)**
- Reasoning: Seller typically receives settlement payment
- **TODO:** Verify this rule with your institution's FPML files
- **Evidence needed:** Check settlement payment direction in sample trades

---

### Ambiguous Mappings (50% confidence - Requires Review)

⚠️ **payer (no context) → payerReceiver.payer**
- Fallback mapping when context is unclear
- **TODO:** Define correct behavior:
  - Option 1: Map to payerReceiver.payer (current)
  - Option 2: Return confidence 0, require manual review
  - Option 3: Check parent element for additional context
  - Option 4: Map to buyer/seller based on product type

⚠️ **counterparty → counterparty[?]**
- Can be counterparty[0] or counterparty[1] depending on position
- **TODO:** Add logic to determine index based on:
  - Order in FPML document
  - Role in trade (if specified)
  - Party identification matching

⚠️ **calculationAgent → multiple possibilities**
- Can map to party reference OR enum value
- **TODO:** Determine from field structure:
  - If `calculationAgentPartyReference` → map to party
  - If `calculationAgentParty` → map to enum (ExercisingParty, etc.)

---

## Examples

### Example 1: FX Option with Premium
```xml
<fxOption>
  <buyerPartyReference href="party1"/>
  <sellerPartyReference href="party2"/>
  <premium>
    <payerPartyReference href="party1"/>
    <receiverPartyReference href="party2"/>
  </premium>
</fxOption>
```

**Mappings:**
- `buyerPartyReference` → counterparty[0] (PARTY_1) - confidence 95%
- `sellerPartyReference` → counterparty[1] (PARTY_2) - confidence 95%
- `premium.payerPartyReference` → payerReceiver.payer=PARTY_1 - confidence 95%
- `premium.receiverPartyReference` → payerReceiver.receiver=PARTY_2 - confidence 95%

### Example 2: Interest Rate Swap Stream
```xml
<swapStream>
  <payerPartyReference href="party1"/>
  <receiverPartyReference href="party2"/>
  <calculationPeriodAmount>...</calculationPeriodAmount>
</swapStream>
```

**Mappings:**
- `payerPartyReference` → payerReceiver.payer=PARTY_1 - confidence 95%
- `receiverPartyReference` → payerReceiver.receiver=PARTY_2 - confidence 95%

### Example 3: Ambiguous Payer (Needs Review)
```xml
<trade>
  <payer>party1</payer>
  <payee>party2</payee>
</trade>
```

**Mappings:**
- `payer` → ??? (confidence 50%, ambiguous)
- `payee` → payerReceiver.receiver - confidence 85%

**Question:** Is this payer the buyer, seller, or stream-level payer?

---

## User Review Checklist

Before using this skill in production:

- [ ] Test with 5+ real FPML files from your institution
- [ ] Verify premium payer = buyer assumption
- [ ] Verify settlement payer = seller assumption
- [ ] Define behavior for context-free payer/payee
- [ ] Add logic for counterparty index determination
- [ ] Handle calculationAgent dual mapping (reference vs enum)
- [ ] Adjust confidence thresholds based on test results
- [ ] Document any product-specific party role patterns
- [ ] Add unit tests for all mapping rules

---

## Known Limitations

1. **Context detection is simple** (keyword search in JSON string). May need structured context parsing.
2. **No validation against party definitions** (doesn't check if referenced party exists).
3. **Assumes 2-party trades** (buyer/seller model). Some trades have 3+ parties.
4. **No handling of ancillaryParty** (CDM supports additional parties beyond counterparty[0/1]).

---

## Confidence Calibration

After testing with real data, update these thresholds:

| Current | Tested | Rule |
|---------|--------|------|
| 95% | ??? | buyer → counterparty[0] |
| 95% | ??? | seller → counterparty[1] |
| 95% | ??? | payerPartyReference → payer |
| 75% | ??? | payer + premium → buyer |
| 75% | ??? | payer + settlement → seller |
| 50% | ??? | payer (no context) |

Record actual approval rates and adjust confidence to match reality.
