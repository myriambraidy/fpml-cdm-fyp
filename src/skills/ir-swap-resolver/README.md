# Interest Rate Swap Resolver Skill

**Generated from:** FPML 5.12 + CDM 5.35.0 analysis  
**Generation date:** 2026-04-17  
**Status:** ⚠️ Generated, requires user review  
**Priority:** HIGH (needed for Week 2)

---

## Purpose

Maps interest rate derivative products from FPML to CDM payout structures. Handles vanilla swaps, basis swaps, cross-currency swaps, swaptions, caps/floors, and FRAs.

---

## Product Types

### 1. Vanilla Interest Rate Swap
**FPML:**
```xml
<swap>
  <swapStream id="fixedLeg">
    <payerPartyReference href="party1"/>
    <receiverPartyReference href="party2"/>
    <calculationPeriodAmount>
      <calculation>
        <notionalSchedule>...</notionalSchedule>
        <fixedRateSchedule>...</fixedRateSchedule>
        <dayCountFraction>ACT/360</dayCountFraction>
      </calculation>
    </calculationPeriodAmount>
  </swapStream>
  <swapStream id="floatingLeg">
    <payerPartyReference href="party2"/>
    <receiverPartyReference href="party1"/>
    <calculationPeriodAmount>
      <calculation>
        <notionalSchedule>...</notionalSchedule>
        <floatingRateCalculation>
          <floatingRateIndex>USD-LIBOR-BBA</floatingRateIndex>
          <indexTenor><periodMultiplier>3</periodMultiplier><period>M</period></indexTenor>
        </floatingRateCalculation>
      </calculation>
    </calculationPeriodAmount>
  </swapStream>
</swap>
```

**CDM:**
```
payout: [
  InterestRatePayout {
    payerReceiver: { payer: PARTY_1, receiver: PARTY_2 }
    rateSpecification: { fixedRate: ... }
    dayCountFraction: ACT_360
  },
  InterestRatePayout {
    payerReceiver: { payer: PARTY_2, receiver: PARTY_1 }
    rateSpecification: { floatingRate: ... }
  }
]
```

**Mapping:** Each swapStream → separate InterestRatePayout (confidence: 95%)

### 2. Basis Swap
**Detection:** Both streams have floatingRateCalculation
**CDM:** 2x InterestRatePayout with floatingRate
**Confidence:** 90%

### 3. Cross-Currency Swap
**Detection:** Streams have different notional currencies
**CDM:** 2x InterestRatePayout with different currencies
**Confidence:** 90%
**TODO:** Verify FX conversion handling

### 4. Swaption
**FPML:** `<swaption>` with underlying `<swap>`
**CDM:** `OptionPayout { underlier: InterestRatePayout[] }`
**Confidence:** 90%

### 5. Cap/Floor
**FPML:** `<capFloor>` with `<capRate>` or `<floorRate>`
**CDM:** `InterestRatePayout` with capRate/floorRate in priceSchedule
**Confidence:** 85%
**TODO:** Confirm operator mapping (capRate=Max, floorRate=Min)

### 6. FRA (Forward Rate Agreement)
**FPML:** `<fra>` with single calculation period
**CDM:** `InterestRatePayout` (single period)
**Confidence:** 90%

---

## Mapping Rules

### High Confidence (95%)

✅ `swap` → `InterestRatePayout[]`
✅ `swapStream` → `InterestRatePayout` (one per stream)
✅ `fixedRateSchedule` → `rateSpecification.fixedRate`
✅ `floatingRateCalculation` → `rateSpecification.floatingRate`

### Medium Confidence (85-90%)

⚠️ `swaption` → `OptionPayout`
⚠️ `capFloor` → `InterestRatePayout` with cap/floor rates
⚠️ `fra` → `InterestRatePayout` (single period)

### Requires Product Analysis

⚠️ Swap type detection (vanilla vs basis vs cross-currency) → analyze streams
⚠️ Calculation period amount nesting → recursive mapping

---

## Known Limitations

1. **Exotic swaps not covered:** Amortizing, accreting, roller-coaster notional schedules
2. **Inflation swaps:** Not included (add separate skill if needed)
3. **Volatility swaps:** Not IR derivatives (equity/commodity)
4. **Structured products:** Complex products with embedded swaps

---

## User Review Checklist

- [ ] Test with vanilla swap FPML files
- [ ] Test with basis swap (2 floating legs)
- [ ] Test with cross-currency swap
- [ ] Verify swaption mapping includes exercise terms
- [ ] Confirm cap/floor rate operator mapping
- [ ] Test FRA mapping (single period validation)
- [ ] Add any exotic swap types your institution uses
- [ ] Verify stream ordering matches your FPML convention

---

## Integration Notes

This skill should run AFTER:
- party-resolver (to map payerPartyReference/receiverPartyReference)
- temporal-mapper (to map dates)
- unit-normalizer (to map notional amounts/currencies)

This skill identifies the product structure. Other skills fill in the details.
