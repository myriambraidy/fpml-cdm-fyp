# FPML Structure Analysis (Version 5.12)

**Analyzed from:** FPML→CDM mapping synonyms + FPML training knowledge
**Date:** 2026-04-17

---

## Party Roles (from FpML)

### Direct Party References
```xml
<buyer>...</buyer>                    <!-- Buyer party -->
<seller>...</seller>                  <!-- Seller party -->
<counterparty>...</counterparty>      <!-- Counterparty -->
```

### Payment Direction
```xml
<payer>...</payer>                    <!-- Party making payment -->
<payee>...</payee>                    <!-- Party receiving payment -->

<!-- In swap streams -->
<swapStream>
  <payerPartyReference href="party1"/>
  <receiverPartyReference href="party2"/>
</swapStream>
```

### Party Definition
```xml
<party id="party1">
  <partyId partyIdScheme="...">LEI_CODE</partyId>
  <partyName>Acme Corporation</partyName>
</party>
```

**Key insight:** FPML uses semantic role names (buyer, seller) AND directional names (payer, receiver). CDM normalizes to PARTY_1/PARTY_2.

---

## Product Types (from synonym mappings)

### Interest Rate Derivatives
```xml
<swap>
  <swapStream>
    <payerPartyReference href="..."/>
    <receiverPartyReference href="..."/>
    <calculationPeriodDates>...</calculationPeriodDates>
    <paymentDates>...</paymentDates>
    <calculationPeriodAmount>
      <calculation>
        <notionalSchedule>...</notionalSchedule>
        <fixedRateSchedule>...</fixedRateSchedule>
        <!-- OR -->
        <floatingRateCalculation>
          <floatingRateIndex>USD-LIBOR-BBA</floatingRateIndex>
          <indexTenor>3M</indexTenor>
        </floatingRateCalculation>
      </calculation>
    </calculationPeriodAmount>
  </swapStream>
</swap>

<swaption>...</swaption>
<capFloor>...</capFloor>
<fra>...</fra>
```

### Credit Derivatives
```xml
<creditDefaultSwap>
  <generalTerms>
    <referenceInformation>
      <referenceEntity>...</referenceEntity>
      <referenceObligation>...</referenceObligation>
    </referenceInformation>
  </generalTerms>
  <feeLeg>...</feeLeg>
  <protectionTerms>
    <creditEvents>...</creditEvents>
  </protectionTerms>
</creditDefaultSwap>
```

### Equity Derivatives
```xml
<returnSwap>
  <equityLeg>
    <underlyer>
      <singleUnderlyer>
        <equity>...</equity>
      </singleUnderlyer>
    </underlyer>
    <rateOfReturn>
      <initialPrice>...</initialPrice>
      <notionalReset>...</notionalReset>
    </rateOfReturn>
  </equityLeg>
</returnSwap>

<equityOption>...</equityOption>
<varianceSwap>
  <varianceStrike>...</varianceStrike>
  <vegaNotional>...</vegaNotional>
</varianceSwap>
```

### FX Derivatives
```xml
<fxOption>
  <buyerPartyReference href="party1"/>
  <sellerPartyReference href="party2"/>
  <fxEuropeanExercise>
    <expirationDate>...</expirationDate>
  </fxEuropeanExercise>
  <putCurrencyAmount>
    <currency>USD</currency>
    <amount>10000000</amount>
  </putCurrencyAmount>
  <callCurrencyAmount>
    <currency>EUR</currency>
    <amount>9000000</amount>
  </callCurrencyAmount>
  <premium>
    <payerPartyReference href="party1"/>
    <receiverPartyReference href="party2"/>
  </premium>
</fxOption>

<fxSwap>...</fxSwap>
<fxForward>...</fxForward>
```

### Commodity Derivatives
```xml
<commoditySwap>
  <commodityLeg>
    <payerPartyReference href="..."/>
    <receiverPartyReference href="..."/>
    <commodity>
      <instrumentId>NYMEX:CL</instrumentId>
      <description>WTI Crude Oil</description>
    </commodity>
  </commodityLeg>
</commoditySwap>

<commodityOption>...</commodityOption>
```

---

## Temporal Fields

### Dates
```xml
<tradeDate>2024-01-15</tradeDate>
<effectiveDate>
  <unadjustedDate>2024-01-17</unadjustedDate>
  <dateAdjustments>...</dateAdjustments>
</effectiveDate>
<terminationDate>
  <unadjustedDate>2029-01-17</unadjustedDate>
</terminationDate>
<calculationPeriodDates>
  <effectiveDate>...</effectiveDate>
  <terminationDate>...</terminationDate>
  <calculationPeriodDatesAdjustments>...</calculationPeriodDatesAdjustments>
  <calculationPeriodFrequency>
    <periodMultiplier>3</periodMultiplier>
    <period>M</period>
  </calculationPeriodFrequency>
</calculationPeriodDates>
```

### Date Adjustments
```xml
<dateAdjustments>
  <businessDayConvention>MODFOLLOWING</businessDayConvention>
  <businessCenters>
    <businessCenter>GBLO</businessCenter>
    <businessCenter>USNY</businessCenter>
  </businessCenters>
</dateAdjustments>
```

---

## Cardinality Patterns

| Element | Cardinality | Notes |
|---------|-------------|-------|
| `<party>` | 1..* | Multiple parties required |
| `<trade>` | 1 | Single trade |
| `<swapStream>` | 1..* | Multiple streams (e.g., fixed + floating) |
| `<payment>` | 0..* | Optional, multiple payments |
| `<calculationPeriod>` | 1..* | Multiple calculation periods |
| `<underlyer>` | 1 or 1..* | Single or basket |

---

## Settlement

```xml
<cashSettlement>
  <settlementCurrency>USD</settlementCurrency>
  <settlementDate>
    <relativeDate>...</relativeDate>
  </settlementDate>
</cashSettlement>

<!-- OR -->

<physicalSettlement>
  <physicalSettlementPeriod>...</physicalSettlementPeriod>
  <deliverableObligations>...</deliverableObligations>
</physicalSettlement>
```

---

## Units & Currencies

```xml
<currency currencyScheme="...">USD</currency>
<notionalAmount>
  <currency>USD</currency>
  <amount>10000000</amount>
</notionalAmount>
<quantity>
  <quantityUnit>BBL</quantityUnit>  <!-- barrels -->
  <quantityFrequency>...</quantityFrequency>
</quantity>
```

---

## Exercise Terms (Options)

### American Exercise
```xml
<americanExercise>
  <commencementDate>...</commencementDate>
  <expirationDate>...</expirationDate>
  <latestExerciseTime>...</latestExerciseTime>
</americanExercise>
```

### European Exercise
```xml
<europeanExercise>
  <expirationDate>2024-12-15</expirationDate>
  <expirationTime>...</expirationTime>
</europeanExercise>
```

### Bermuda Exercise
```xml
<bermudaExercise>
  <bermudaExerciseDates>
    <adjustableDate>...</adjustableDate>
    <adjustableDate>...</adjustableDate>
  </bermudaExerciseDates>
</bermudaExercise>
```

---

## Calculation Agent

```xml
<calculationAgent>
  <calculationAgentPartyReference href="party1"/>
  <!-- OR -->
  <calculationAgentParty>ExercisingParty</calculationAgentParty>
</calculationAgent>
```

---

## Key FPML Characteristics

1. **Reference-based architecture:** Parties defined once, referenced by href
2. **Semantic role names:** buyer, seller, payer, receiver (context-dependent)
3. **Product-specific schemas:** Different elements for swap vs option vs CDS
4. **Flexible cardinality:** Many elements support 0..* or 1..*
5. **Date adjustments:** Rich business day convention system
