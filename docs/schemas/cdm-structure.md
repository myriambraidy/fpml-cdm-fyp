# CDM Structure Analysis (Version 5.35.0)

**Analyzed from:** CDM documentation + Rosetta source files
**Date:** 2026-04-17

---

## Core Types

### Party
```rosetta
type Party:
    partyId PartyIdentifier (1..*)      // LEI code, identifiers
    name string (0..1)                   // Party name
    businessUnit BusinessUnit (0..*)    // Trading desks, org units
    person NaturalPerson (0..*)         // Associated persons
    personRole NaturalPersonRole (0..*)
    account Account (0..1)              // Associated account
    contactInformation ContactInformation (0..1)
```

### PayoutBase (abstract)
Common fields for all payout types:
```rosetta
type PayoutBase:
    payerReceiver PayerReceiver (0..1)           // Direction of payment flow
    priceQuantity ResolvablePriceQuantity (0..1) // Pricing and quantity
    principalPayment PrincipalPayment (0..1)     // Principal terms
    settlementTerms SettlementTerms (0..1)       // Settlement provisions
```

### PayerReceiver
```rosetta
type PayerReceiver:
    payer CounterpartyRoleEnum (1..1)   // PARTY_1 or PARTY_2
    receiver CounterpartyRoleEnum (1..1) // PARTY_1 or PARTY_2
```

**Key insight:** CDM uses normalized roles (PARTY_1, PARTY_2) instead of semantic names (buyer, seller).

---

## Product Types

### Interest Rate Derivatives
- **InterestRatePayout** (extends PayoutBase)
  - rateSpecification (fixed/floating/inflation)
  - calculationPeriodDates
  - paymentDates
  - resetDates
  - dayCountFraction
  - compoundingMethod

### Credit Derivatives
- **CreditDefaultPayout** (extends PayoutBase)
  - generalTerms (reference entity/obligation)
  - protectionTerms (credit events, payout calculation)
  - transactedPrice

### Equity Derivatives
- **PerformancePayout** (extends PayoutBase)
  - returnTerms (price/dividend/variance/volatility)
  - valuationDates
  - underlier

### Commodity Derivatives
- **CommodityPayout** (extends PayoutBase)
  - commodityPriceReturnTerms
  - pricingDates
  - delivery terms

### Options
- **OptionPayout** (extends PayoutBase)
  - exerciseTerms (American/European/Bermuda)
  - underlier
  - optionType (call/put)

---

## Settlement Types

```rosetta
enum SettlementTypeEnum:
    Cash
    Physical
    CashOrPhysical
    Election
```

---

## Temporal Fields

From product model analysis:
- **effectiveDate**: AdjustableOrRelativeDate
- **terminationDate**: AdjustableOrRelativeDate
- **tradeDate**: Date
- **calculationPeriodDates**: CalculationPeriodDates
- **paymentDates**: PaymentDates
- **valuationDate**: ValuationDate

---

## Cardinality Patterns

| CDM Type | Cardinality | Notes |
|----------|-------------|-------|
| partyId | 1..* | Required, multiple allowed |
| name | 0..1 | Optional, single |
| businessUnit | 0..* | Optional, multiple |
| payout | 1..* | Required, array (multiple payouts per product) |
| counterparty | 2..2 | Exactly 2 counterparties |
| ancillaryParty | 0..* | Optional additional parties |

---

## Enums

### CounterpartyRoleEnum
```rosetta
enum CounterpartyRoleEnum:
    PARTY_1
    PARTY_2
```

### SettlementTypeEnum
```rosetta
enum SettlementTypeEnum:
    Cash
    Physical
    CashOrPhysical
    Election
```

---

## Units & Quantities

From documentation:
- **currency**: CurrencyCodeEnum (USD, EUR, GBP, etc.)
- **notional**: Quantity with unit of measure
- **quantity**: NonNegativeQuantitySchedule
- **priceSchedule**: Price values over time
