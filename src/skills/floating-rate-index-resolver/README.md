# Floating Rate Index Resolver Skill

**Generated from:** FPML 5.12 + CDM 5.35.0 analysis  
**Generation date:** 2026-04-17  
**Status:** ⚠️ Generated, requires user review  
**Priority:** HIGH (needed for Week 2)

---

## Purpose

Maps floating rate indexes and tenors from FPML to CDM FloatingRateIndexEnum. Handles legacy IBOR rates (LIBOR, EURIBOR) and risk-free rates (SOFR, SONIA, ESTR).

---

## Index Categories

### Legacy IBOR Rates (Pre-2023)

**USD LIBOR:**
- FPML: `USD-LIBOR-BBA`
- CDM: `FloatingRateIndexEnum.USD_LIBOR`
- Status: Discontinued June 2023, may still appear in legacy trades
- **TODO:** Verify if your institution needs LIBOR fallback rules

**EUR EURIBOR:**
- FPML: `EUR-EURIBOR-Reuters`, `EUR-EURIBOR-Telerate`
- CDM: `FloatingRateIndexEnum.EUR_EURIBOR`
- Status: Still active

**GBP LIBOR:**
- FPML: `GBP-LIBOR-BBA`
- CDM: `FloatingRateIndexEnum.GBP_LIBOR`
- Status: Discontinued December 2021

### Risk-Free Rates (RFR)

**SOFR (USD):**
- FPML: `USD-SOFR`, `USD-SOFR-COMPOUND`
- CDM: `FloatingRateIndexEnum.SOFR`
- Tenor: Overnight (ON) or compounded

**SONIA (GBP):**
- FPML: `GBP-SONIA-OIS`, `GBP-SONIA-COMPOUND`
- CDM: `FloatingRateIndexEnum.SONIA`
- Tenor: Overnight

**ESTR (EUR):**
- FPML: `EUR-ESTR`, `€STR`
- CDM: `FloatingRateIndexEnum.ESTR`
- Tenor: Overnight

**TONAR (JPY):**
- FPML: `JPY-TONAR`, `JPY-TONA`
- CDM: `FloatingRateIndexEnum.TONAR`
- Tenor: Overnight

### Other Rates

**Fed Funds:**
- FPML: `USD-Federal Funds-H.15`
- CDM: `FloatingRateIndexEnum.FED_FUNDS`

**Prime Rate:**
- FPML: `USD-Prime-H.15`
- CDM: `FloatingRateIndexEnum.USD_PRIME`

---

## Tenor Mapping

### FPML Structure
```xml
<indexTenor>
  <periodMultiplier>3</periodMultiplier>
  <period>M</period>
</indexTenor>
```

### CDM Structure
```
indexTenor: Period {
  periodMultiplier: 3
  period: PeriodEnum.M
}
```

### Common Tenors
- ON (overnight)
- 1M, 3M, 6M, 12M (months)
- 1Y, 2Y, 5Y, 10Y (years)
- 1D, 7D (days)
- 1W, 2W (weeks)

---

## Mapping Rules

### High Confidence (95%)

✅ `USD-LIBOR-BBA` → `FloatingRateIndexEnum.USD_LIBOR`
✅ `EUR-EURIBOR-Reuters` → `FloatingRateIndexEnum.EUR_EURIBOR`
✅ `USD-SOFR` → `FloatingRateIndexEnum.SOFR`
✅ `GBP-SONIA-OIS` → `FloatingRateIndexEnum.SONIA`
✅ Tenor `3M` → `Period { periodMultiplier: 3, period: M }`

### Medium Confidence (85-90%)

⚠️ Partial index name (USD-LIBOR without source) → normalize to enum
⚠️ Regional variants (EUR-EURIBOR-Telerate vs Reuters) → same enum
⚠️ Spread → floatingRate.spread

### Requires Review

⚠️ Unknown index names → confidence 0, manual mapping required
⚠️ Exotic regional rates (TIBOR, HIBOR, etc.) → add if needed

---

## Examples

### Example 1: USD LIBOR 3-Month
```xml
<floatingRateCalculation>
  <floatingRateIndex>USD-LIBOR-BBA</floatingRateIndex>
  <indexTenor>
    <periodMultiplier>3</periodMultiplier>
    <period>M</period>
  </indexTenor>
  <spread>0.0025</spread>
</floatingRateCalculation>
```

**Mappings:**
- floatingRateIndex → FloatingRateIndexEnum.USD_LIBOR (95%)
- indexTenor → Period { 3, M } (95%)
- spread → floatingRate.spread: 0.0025 (95%)

### Example 2: SOFR Compounded
```xml
<floatingRateCalculation>
  <floatingRateIndex>USD-SOFR-COMPOUND</floatingRateIndex>
</floatingRateCalculation>
```

**Mappings:**
- USD-SOFR-COMPOUND → FloatingRateIndexEnum.SOFR (95%)
- Tenor implied: ON (overnight)
- Compounding method: separate field in CDM

---

## Known Issues

1. **LIBOR transition:** Legacy trades have LIBOR, new trades use RFRs. Need fallback rules.
2. **Index source suffixes:** BBA, Reuters, Telerate (FPML specificity not always in CDM enum)
3. **Compounding methods:** SOFR-COMPOUND vs SOFR (averaging vs compounding)
4. **Lookback/lockout:** RFR conventions not captured in simple index mapping

---

## User Review Checklist

- [ ] Verify all indexes your institution uses are covered
- [ ] Add any regional indexes (TIBOR, HIBOR, etc.)
- [ ] Confirm LIBOR fallback rules if applicable
- [ ] Test tenor parsing with all period types (D, W, M, Y)
- [ ] Verify spread mapping includes negative spreads
- [ ] Check if compounding method needs separate skill
- [ ] Add any exotic rate indexes (CMS, OIS variations)
- [ ] Test with actual FPML floating leg structures

---

## LIBOR Transition Note

**Important:** LIBOR rates were discontinued 2021-2023. If your institution has legacy trades referencing LIBOR:

1. Add fallback logic to map LIBOR → RFR equivalent:
   - USD-LIBOR → SOFR
   - GBP-LIBOR → SONIA
   - EUR-LIBOR → ESTR

2. Or maintain LIBOR enum values for historical trades

**TODO:** Clarify your institution's LIBOR fallback policy
