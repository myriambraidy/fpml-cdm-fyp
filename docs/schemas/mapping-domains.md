# FPML → CDM Mapping Domains Analysis

**Source:** CDM mapping-fpml-confirmation-tradestate-synonym.rosetta + schema analysis
**Date:** 2026-04-17

---

## Domain Clustering (10 Skills Identified)

### Skill 1: Party Role Resolver
**Complexity:** Medium (contextual mapping required)
**Field Count:** 8-12 party-related fields

**FPML Fields:**
- `buyer`, `seller`, `counterparty`
- `payer`, `payee` (context-dependent)
- `payerPartyReference`, `receiverPartyReference`
- `buyerPartyReference`, `sellerPartyReference`
- `calculationAgentPartyReference`

**CDM Targets:**
- `counterparty[0]` (PARTY_1 or PARTY_2)
- `counterparty[1]` (PARTY_1 or PARTY_2)
- `payerReceiver.payer` (CounterpartyRoleEnum)
- `payerReceiver.receiver` (CounterpartyRoleEnum)

**Mapping Rules:**
1. **buyer → counterparty[0] with role PARTY_1** (confidence: 90%)
2. **seller → counterparty[1] with role PARTY_2** (confidence: 90%)
3. **payer in premium context → buyer** (confidence: 75%)
4. **payer in settlement context → seller** (confidence: 75%)
5. **payerPartyReference in swapStream → payerReceiver.payer** (confidence: 95%)

**Ambiguities:**
- payer/payee without context (TODO: user review)
- calculationAgent (can be party reference OR enum)

---

### Skill 2: Temporal Mapper
**Complexity:** Simple (mechanical date mapping)
**Field Count:** 10-15 date/time fields

**FPML Fields:**
- `tradeDate`
- `effectiveDate`, `unadjustedDate`
- `terminationDate`, `maturityDate`
- `expirationDate`, `expirationTime`
- `calculationPeriodDates`
- `paymentDates`, `paymentDate`
- `resetDates`, `valuationDate`
- `commencementDate`

**CDM Targets:**
- `tradeDate` (Date)
- `effectiveDate` (AdjustableOrRelativeDate)
- `terminationDate` (AdjustableOrRelativeDate)
- `calculationPeriodDates` (CalculationPeriodDates)
- `paymentDates` (PaymentDates)
- `valuationDate` (ValuationDate)

**Mapping Rules:**
1. **Direct date fields → CDM date fields** (confidence: 95%)
2. **unadjustedDate + dateAdjustments → AdjustableDate** (confidence: 95%)
3. **expirationDate → exercise.europeanExercise.expirationDate** (confidence: 90%)
4. **calculationPeriodDates → calculationPeriodDates** (structure preserved, confidence: 95%)

**Transformations:**
- Parse date formats (YYYY-MM-DD)
- Handle relative dates
- Business day adjustments

---

### Skill 3: Cardinality Checker
**Complexity:** Simple (structural analysis)
**Field Count:** Applies to all fields (structural)

**Pattern Detection:**
- Plural field names (trades, payments, parties) → array type
- Singular field names (trade, payment, party) → single
- minOccurs/maxOccurs in schema → cardinality bounds

**FPML Patterns:**
- `<trade>` (1) → single
- `<payments><payment>...</payment></payments>` (0..*) → array
- `<swapStream>` (1..*) → array (at least 1)

**CDM Patterns:**
- `payout[]` (1..*)
- `counterparty[]` (2..2)
- `party` (0..1)

**Mapping Rules:**
1. **0..1 → 0..1** (optional field)
2. **1 → 1..1** (required field)
3. **0..* → 0..*** (optional array)
4. **1..* → 1..*** (required array)
5. **Fixed count (2..2) → fixed array length**

---

### Skill 4: Interest Rate Swap Resolver
**Complexity:** High (product-specific logic)
**Field Count:** 25-30 fields

**FPML Fields:**
- `swap`, `swapStream`
- `calculationPeriodAmount`
- `notionalSchedule`, `notionalStepSchedule`
- `fixedRateSchedule`
- `floatingRateCalculation`
  - `floatingRateIndex` (USD-LIBOR-BBA, EUR-EURIBOR-Reuters)
  - `indexTenor` (3M, 6M)
  - `spread`, `spreadSchedule`
- `dayCountFraction` (ACT/360, 30/360)
- `compoundingMethod`
- `resetDates`, `fixingDates`

**CDM Targets:**
- `InterestRatePayout`
- `rateSpecification.fixedRate` or `rateSpecification.floatingRate`
- `calculationPeriodDates`
- `paymentDates`
- `dayCountFraction`
- `priceQuantity.quantity` (notional)

**Mapping Rules:**
1. **swap → InterestRatePayout[]** (1 payout per stream, confidence: 95%)
2. **fixedRateSchedule → rateSpecification.fixedRate** (confidence: 95%)
3. **floatingRateIndex + indexTenor → rateSpecification.floatingRate** (confidence: 95%)
4. **dayCountFraction → dayCountFraction** (enum mapping, confidence: 95%)
5. **notionalSchedule → priceQuantity.quantity** (confidence: 90%)

---

### Skill 5: Cap/Floor Resolver
**Complexity:** Medium (interest rate options)
**Field Count:** 15-20 fields

**FPML Fields:**
- `capFloor`
- `capFloorStream`
- `capRate`, `floorRate`
- `calculationPeriodAmount` (similar to swap)

**CDM Targets:**
- `InterestRatePayout` with `capRate`/`floorRate`
- `OptionPayout` with strike = cap/floor rate

**Mapping Rules:**
1. **capFloorStream → InterestRatePayout** (confidence: 90%)
2. **capRate → priceSchedule with operator=Max** (confidence: 85%)
3. **floorRate → priceSchedule with operator=Min** (confidence: 85%)

---

### Skill 6: Credit Default Swap Resolver
**Complexity:** High (complex credit event logic)
**Field Count:** 20-30 fields

**FPML Fields:**
- `creditDefaultSwap`
- `generalTerms.referenceInformation`
  - `referenceEntity`, `referenceObligation`
- `feeLeg` (premium payments)
- `protectionTerms`
  - `creditEvents` (bankruptcy, failure to pay, restructuring)
  - `obligations` (borrowed money, bonds, loans)

**CDM Targets:**
- `CreditDefaultPayout`
- `generalTerms` (referenceInformation)
- `protectionTerms` (credit events, payout calculation)

**Mapping Rules:**
1. **referenceEntity → generalTerms.referenceInformation.referenceEntity** (confidence: 95%)
2. **creditEvents → protectionTerms.creditEvents** (confidence: 95%)
3. **feeLeg → separate payout for premium** (confidence: 85%)

---

### Skill 7: Equity Derivatives Resolver
**Complexity:** Medium
**Field Count:** 15-20 fields

**FPML Fields:**
- `returnSwap`, `equitySwap`
- `equityLeg`
  - `underlyer` (singleUnderlyer, basket, index)
  - `rateOfReturn`, `priceReturn`
  - `dividendConditions`
- `equityOption`
- `varianceSwap` (varianceStrike, vegaNotional)
- `volatilitySwap`

**CDM Targets:**
- `PerformancePayout`
- `returnTerms` (PriceReturnTerms, DividendReturnTerms, VarianceReturnTerms)
- `underlier`

**Mapping Rules:**
1. **returnSwap → PerformancePayout** (confidence: 90%)
2. **priceReturn → PriceReturnTerms** (confidence: 95%)
3. **dividendConditions → DividendReturnTerms** (confidence: 90%)
4. **varianceSwap → VarianceReturnTerms** (confidence: 95%)
5. **vegaNotional → set in VarianceReturnTerms** (confidence: 90%)

---

### Skill 8: FX Derivatives Resolver
**Complexity:** Medium
**Field Count:** 15-20 fields

**FPML Fields:**
- `fxOption` (vanilla, barrier, digital)
- `fxSwap`, `fxForward`
- `quotedCurrencyPair`
  - `currency1`, `currency2`
  - `quoteBasis` (Currency1PerCurrency2)
- `putCurrencyAmount`, `callCurrencyAmount`
- `exchangeRate`
- `fxEuropeanExercise`, `fxAmericanExercise`

**CDM Targets:**
- `OptionPayout` (for options)
- `observable` with FX rate
- `priceQuantity` with currency pair

**Mapping Rules:**
1. **fxOption → OptionPayout** (confidence: 90%)
2. **quotedCurrencyPair → observable.rateOption** (confidence: 85%)
3. **putCurrencyAmount/callCurrencyAmount → priceQuantity** (confidence: 85%)
4. **exchangeRate → price** (confidence: 90%)

---

### Skill 9: Exercise Terms Resolver
**Complexity:** Simple (enum mapping)
**Field Count:** 8-10 fields

**FPML Fields:**
- `europeanExercise` (expirationDate)
- `americanExercise` (commencementDate, expirationDate)
- `bermudaExercise` (bermudaExerciseDates)
- `automaticExercise` (boolean)
- `exerciseProcedure`

**CDM Targets:**
- `exerciseTerms.europeanExercise`
- `exerciseTerms.americanExercise`
- `exerciseTerms.bermudaExercise`
- `automaticExercise` (boolean)

**Mapping Rules:**
1. **europeanExercise → EuropeanExercise** (confidence: 95%)
2. **americanExercise → AmericanExercise** (confidence: 95%)
3. **bermudaExercise → BermudaExercise** (confidence: 95%)
4. **Direct field mapping** (structure preserved)

---

### Skill 10: Settlement Terms Resolver
**Complexity:** Medium
**Field Count:** 10-15 fields

**FPML Fields:**
- `cashSettlement`
  - `settlementCurrency`
  - `settlementDate`
  - `cashSettlementValuationDate`
- `physicalSettlement`
  - `physicalSettlementPeriod`
  - `deliverableObligations`

**CDM Targets:**
- `settlementTerms.settlementType` (SettlementTypeEnum)
- `settlementTerms.settlementCurrency`
- `settlementTerms.settlementDate`

**Mapping Rules:**
1. **cashSettlement exists → settlementType=Cash** (confidence: 95%)
2. **physicalSettlement exists → settlementType=Physical** (confidence: 95%)
3. **both exist → settlementType=CashOrPhysical** (confidence: 90%)
4. **settlementCurrency → settlementCurrency** (direct, confidence: 95%)

---

### Skill 11: Unit & Currency Normalizer
**Complexity:** Simple (enum/value mapping)
**Field Count:** 8-12 fields

**FPML Fields:**
- `currency` (USD, EUR, GBP)
- `currencyScheme`
- `amount`, `notionalAmount`
- `quantity`, `quantityUnit`
- `pricePerUnit`

**CDM Targets:**
- `currency` (CurrencyCodeEnum)
- `quantity.amount`
- `quantity.unit` (UnitEnum)
- `priceQuantity.price`

**Mapping Rules:**
1. **currency code → CurrencyCodeEnum** (confidence: 95%)
2. **amount → quantity.amount** (confidence: 95%)
3. **quantityUnit → UnitEnum** (BBL, MT, MWh, etc., confidence: 90%)

---

### Skill 12: Floating Rate Index Resolver
**Complexity:** Medium (index taxonomy)
**Field Count:** 15-20 fields

**FPML Fields:**
- `floatingRateIndex` (USD-LIBOR-BBA, EUR-EURIBOR-Reuters, SONIA, SOFR)
- `indexTenor` (1M, 3M, 6M, 12M)
- `spread`, `spreadSchedule`
- `multiplierSchedule`
- `rateObservation`

**CDM Targets:**
- `rateSpecification.floatingRate`
- `floatingRateIndex` (FloatingRateIndexEnum)
- `indexTenor` (period)
- `spread` (Spread type)

**Mapping Rules:**
1. **USD-LIBOR-BBA → FloatingRateIndexEnum mapping** (confidence: 90%)
2. **indexTenor → period** (confidence: 95%)
3. **spread → Spread** (confidence: 95%)

---

## Skill Count Summary

| Skill | Domain | Complexity | Field Count | Priority |
|-------|--------|------------|-------------|----------|
| 1 | Party roles | Medium | 8-12 | HIGH |
| 2 | Temporal/dates | Simple | 10-15 | HIGH |
| 3 | Cardinality | Simple | Structural | HIGH |
| 4 | IR Swaps | High | 25-30 | HIGH |
| 5 | Caps/Floors | Medium | 15-20 | MEDIUM |
| 6 | Credit derivatives | High | 20-30 | MEDIUM |
| 7 | Equity derivatives | Medium | 15-20 | MEDIUM |
| 8 | FX derivatives | Medium | 15-20 | MEDIUM |
| 9 | Exercise terms | Simple | 8-10 | LOW |
| 10 | Settlement terms | Medium | 10-15 | MEDIUM |
| 11 | Units/currency | Simple | 8-12 | HIGH |
| 12 | Floating rate index | Medium | 15-20 | HIGH |

**TOTAL: 12 skills** (not 5!)

**Prototype Priority:**
- **Must have (Week 1):** Skills 1, 2, 3, 11 (party, temporal, cardinality, units)
- **Should have (Week 2):** Skills 4, 12 (IR swaps, floating rate index)
- **Nice to have (Week 3+):** Skills 5-10 (other product types)

---

## Mapping Complexity Analysis

### Simple Mappings (Mechanical)
- Field name match → CDM path (buyer → party.buyer)
- Type conversion (date string → ISO date)
- Enum mapping (USD → CurrencyCodeEnum.USD)
- Structure preservation (calculationPeriodDates → calculationPeriodDates)

**Estimated:** 60% of mappings are mechanical

### Medium Mappings (Contextual)
- payer/receiver depends on payment context (premium vs settlement)
- calculationAgent (party reference vs enum)
- Settlement type (cash vs physical detection)
- Exercise type detection (European vs American)

**Estimated:** 30% of mappings need context

### Complex Mappings (Product-specific)
- Variance swap → VarianceReturnTerms (vegaNotional placement)
- CDS protection terms → protectionTerms structure
- Multi-stream swaps → multiple payouts
- Basket underlyers → array mapping

**Estimated:** 10% of mappings are product-specific

---

## Confidence Threshold Guidelines

Based on mapping complexity:

| Confidence | Mapping Type | Example |
|------------|--------------|---------|
| 95-100 | Direct field match | buyer → party.buyer |
| 85-94 | Type conversion | xsd:date → ISO date |
| 75-84 | Contextual inference | payer + premium → buyer |
| 60-74 | Product-specific | varianceSwap → VarianceReturnTerms |
| 40-59 | Ambiguous | payer (no context) → ??? |
| 0-39 | No mapping found | unmapped field |

---

## Next Steps

Generate 12 TypeScript skills based on these domains. Start with high-priority skills (1, 2, 3, 11) to validate the approach, then expand to product-specific skills.
