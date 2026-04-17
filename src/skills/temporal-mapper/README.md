# Temporal Mapper Skill

**Generated from:** FPML 5.12 + CDM 5.35.0 analysis  
**Generation date:** 2026-04-17  
**Status:** ⚠️ Generated, requires user review

---

## Purpose

Maps date and time fields from FPML to CDM temporal structures. Handles trade execution dates, lifecycle dates, exercise dates, calculation schedules, and payment dates.

---

## Date Categories (from schema analysis)

### 1. Trade-Level Dates
- `tradeDate` → when trade was executed
- Maps to: `tradeDate` (CDM root level)

### 2. Lifecycle Dates
- `effectiveDate` → when economic terms start
- `terminationDate` / `maturityDate` → when economic terms end
- Maps to: `economicTerms.effectiveDate`, `economicTerms.terminationDate`

### 3. Exercise Dates (Options)
- `expirationDate` → when option expires
- `commencementDate` → when exercise period begins (American)
- Maps to: `payout.exerciseTerms.expirationDate`, `americanExercise.commencementDate`

### 4. Calculation Dates (IR Swaps, etc.)
- `calculationPeriodDates` → schedule for calculating payments
- `resetDates` → when floating rates are observed
- `fixingDates` → when rates are fixed
- Maps to: `payout.calculationPeriodDates`, `payout.resetDates`

### 5. Payment Dates
- `paymentDates` → schedule for making payments
- `settlementDate` → when settlement occurs
- Maps to: `payout.paymentDates`, `settlementTerms.settlementDate`

### 6. Valuation/Pricing Dates
- `valuationDate` → when assets are valued
- `pricingDate` → when commodity prices are set
- Maps to: `payout.valuationDates`, `payout.pricingDates`

---

## Mapping Rules

### High Confidence (95%)

✅ `tradeDate` → `tradeDate`
✅ `effectiveDate` → `economicTerms.effectiveDate`
✅ `terminationDate` → `economicTerms.terminationDate`
✅ `maturityDate` → `economicTerms.terminationDate`
✅ `calculationPeriodDates` → `payout.calculationPeriodDates`
✅ `paymentDates` → `payout.paymentDates`

### Medium Confidence (85-90%)

⚠️ `expirationDate` → `payout.exerciseTerms.expirationDate`
⚠️ `resetDates` → `payout.resetDates`
⚠️ `valuationDate` → `payout.valuationDates`
⚠️ `settlementDate` → `settlementTerms.settlementDate`

### Low Confidence (40-70% - Requires Context)

⚠️ Generic `date` field → needs parent context
⚠️ `unadjustedDate` → component of AdjustableDate (needs parent path)
⚠️ Product-specific dates → may need product-type detection

---

## Date Structure Handling

### Adjustable Dates

FPML pattern:
```xml
<effectiveDate>
  <unadjustedDate>2024-01-15</unadjustedDate>
  <dateAdjustments>
    <businessDayConvention>MODFOLLOWING</businessDayConvention>
    <businessCenters>
      <businessCenter>USNY</businessCenter>
    </businessCenters>
  </dateAdjustments>
</effectiveDate>
```

CDM pattern:
```
effectiveDate: AdjustableOrRelativeDate
  adjustableDate: AdjustableDate
    unadjustedDate: date
    dateAdjustments: BusinessDayAdjustments
```

**Mapping:** Preserve structure, map nested elements recursively

### Relative Dates

FPML pattern:
```xml
<relativeDate>
  <periodMultiplier>2</periodMultiplier>
  <period>D</period>
  <dayType>Business</dayType>
  <dateRelativeTo href="resetDate"/>
</relativeDate>
```

CDM pattern:
```
RelativeDate:
  periodMultiplier: int
  period: PeriodEnum
  dayType: DayTypeEnum
  dateRelativeTo: reference
```

**Mapping:** Preserve structure, map period enums

---

## Known Limitations

1. **Time zones not handled** - CDM and FPML may use different timezone representations
2. **Business day calendars** - Calendar mapping (USNY, GBLO, etc.) not included in this skill
3. **Date arithmetic** - Doesn't calculate relative dates, only maps structure
4. **Schedule generation** - Doesn't expand schedules to individual dates

---

## User Review Checklist

- [ ] Test with FPML files containing all date types
- [ ] Verify effectiveDate always maps to economicTerms.effectiveDate
- [ ] Check if maturityDate and terminationDate are always synonyms
- [ ] Validate exercise date mappings for options
- [ ] Confirm calculationPeriodDates structure preservation
- [ ] Test unadjustedDate + dateAdjustments parsing
- [ ] Add any missing date field patterns specific to your products
- [ ] Adjust confidence thresholds based on test results

---

## Examples

### Example 1: Trade Dates
```xml
<tradeDate>2024-01-15</tradeDate>
<effectiveDate>
  <unadjustedDate>2024-01-17</unadjustedDate>
</effectiveDate>
<terminationDate>
  <unadjustedDate>2029-01-17</unadjustedDate>
</terminationDate>
```

**Mappings:**
- tradeDate → tradeDate (95%)
- effectiveDate → economicTerms.effectiveDate (95%)
- terminationDate → economicTerms.terminationDate (95%)

### Example 2: Option Exercise
```xml
<europeanExercise>
  <expirationDate>2024-12-15</expirationDate>
  <expirationTime>
    <hourMinuteTime>10:00:00</hourMinuteTime>
  </expirationTime>
</europeanExercise>
```

**Mappings:**
- expirationDate → exerciseTerms.expirationDate (90%)
- expirationTime → exerciseTerms.expirationTime (85%)

### Example 3: Payment Schedule
```xml
<paymentDates>
  <calculationPeriodDatesReference href="floatingCalcPeriodDates"/>
  <paymentFrequency>
    <periodMultiplier>3</periodMultiplier>
    <period>M</period>
  </paymentFrequency>
</paymentDates>
```

**Mappings:**
- paymentDates → payout.paymentDates (95%, structure preserved)
