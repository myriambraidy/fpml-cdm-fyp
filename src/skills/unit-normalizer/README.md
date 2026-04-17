# Unit Normalizer Skill

**Generated from:** FPML 5.12 + CDM 5.35.0 analysis  
**Generation date:** 2026-04-17  
**Status:** ⚠️ Generated, requires user review

---

## Purpose

Maps currency codes, quantity units, amounts, and rates from FPML to CDM unit structures. Normalizes ISO 4217 currency codes, commodity units, and financial quantities.

---

## Unit Categories

### 1. Currency (ISO 4217)
```
FPML: <currency>USD</currency>
CDM: currency: CurrencyCodeEnum.USD
```

**Supported currencies:**
USD, EUR, GBP, JPY, CHF, AUD, CAD, NZD, SEK, NOK, DKK, CNY, HKD, SGD, KRW, INR, BRL, MXN, ZAR, RUB, TRY, PLN

**TODO:** Add any additional currencies your institution trades

### 2. Commodity Units
```
FPML: <quantityUnit>BBL</quantityUnit>
CDM: quantity.unit: UnitEnum.BBL
```

**Supported units:**
- BBL (barrels - oil)
- MT (metric tons)
- MWh (megawatt-hours - power)
- MMBTU (million BTU - natural gas)
- GAL (gallons)
- LBS (pounds)
- KG (kilograms)
- MMBBL (million barrels)

**TODO:** Add commodity units specific to your institution's traded products

### 3. Amounts & Notional
```
FPML: <notionalAmount><amount>10000000</amount></notionalAmount>
CDM: priceQuantity.quantity.amount: 10000000
```

### 4. Prices & Rates
```
FPML: <fixedRate>0.05</fixedRate>
CDM: rateSchedule.price: 0.05
```

---

## Mapping Rules

### High Confidence (95%)

✅ `currency` field → `CurrencyCodeEnum`
✅ `notionalAmount` → `priceQuantity.quantity.amount`
✅ Currency code value (USD, EUR) → enum mapping

### Medium Confidence (85-90%)

⚠️ `quantity` + unit → `priceQuantity.quantity` with `UnitEnum`
⚠️ `amount` → `quantity.amount` (context-dependent)
⚠️ `price` → `priceQuantity.price`
⚠️ `rate` → `rateSchedule`

### Low Confidence (70-80% - Needs Context)

⚠️ Generic `amount` without prefix → Could be notional, payment, settlement, or premium amount
⚠️ `rate` without type → Could be fixed rate, floating rate, spread, FX rate

---

## Examples

### Example 1: Currency in Notional
```xml
<notionalAmount>
  <currency>USD</currency>
  <amount>10000000</amount>
</notionalAmount>
```

**Mappings:**
- currency → CurrencyCodeEnum.USD (95%)
- amount → priceQuantity.quantity.amount: 10000000 (95%)

### Example 2: Commodity Quantity
```xml
<quantity>
  <quantityUnit>BBL</quantityUnit>
  <quantityFrequency>
    <periodMultiplier>1000</periodMultiplier>
    <period>D</period>
  </quantityFrequency>
</quantity>
```

**Mappings:**
- quantityUnit → UnitEnum.BBL (90%)
- quantity structure → priceQuantity.quantity (90%)

### Example 3: Fixed Rate
```xml
<fixedRateSchedule>
  <initialValue>0.05</initialValue>
</fixedRateSchedule>
```

**Mappings:**
- fixedRateSchedule → rateSpecification.fixedRate (95%)
- initialValue → rateSchedule.price: 0.05 (90%)

### Example 4: FX Rate
```xml
<exchangeRate>
  <quotedCurrencyPair>
    <currency1>EUR</currency1>
    <currency2>USD</currency2>
    <quoteBasis>Currency2PerCurrency1</quoteBasis>
  </quotedCurrencyPair>
  <rate>1.18</rate>
</exchangeRate>
```

**Mappings:**
- currency1 → CurrencyCodeEnum.EUR (95%)
- currency2 → CurrencyCodeEnum.USD (95%)
- rate → priceQuantity.price (FX context, 85%)

---

## Known Limitations

1. **Currency validation not enforced** - Doesn't check if currency code is valid ISO 4217
2. **Unit conversion not supported** - Doesn't convert between units (barrels ↔ gallons)
3. **Price context detection limited** - "price" field could be strike, spot, forward, or settlement price
4. **Rate type ambiguity** - "rate" could be interest rate, FX rate, dividend rate, etc.

---

## User Review Checklist

- [ ] Add any missing currency codes your institution uses
- [ ] Add commodity units for products you trade
- [ ] Define behavior for unknown currency codes (reject vs pass through)
- [ ] Clarify price field mappings (strike vs spot vs forward)
- [ ] Clarify rate field mappings (fixed vs floating vs FX)
- [ ] Test with multi-currency trades
- [ ] Test with commodity swaps/options
- [ ] Verify enum values match your CDM version

---

## Enum Mapping Tables

### Currency Codes (partial list)
| ISO 4217 | CDM Enum | Region |
|----------|----------|--------|
| USD | CurrencyCodeEnum.USD | United States |
| EUR | CurrencyCodeEnum.EUR | Eurozone |
| GBP | CurrencyCodeEnum.GBP | United Kingdom |
| JPY | CurrencyCodeEnum.JPY | Japan |
| CHF | CurrencyCodeEnum.CHF | Switzerland |

**TODO:** Add full list from your CDM version

### Commodity Units
| Code | CDM Enum | Description |
|------|----------|-------------|
| BBL | UnitEnum.BBL | Barrels (crude oil) |
| MT | UnitEnum.MT | Metric tons |
| MWh | UnitEnum.MWH | Megawatt-hours (power) |
| MMBTU | UnitEnum.MMBTU | Million BTU (natural gas) |

**TODO:** Add units for products your institution trades
