```markdown
# Planner Plan — Round 2
**Run id:** 2026-05-01T17-28-07-939Z  
**Planner round:** 2 of 3  
**Product family:** fx-derivatives  
**Status:** Concrete generator execution plan (addresses Round-1 critic)

---

## 1. Confirmed Evidence Inventory

### 1.1 Fixture files (confirmed on disk)

**23 FX derivative fixtures (data_to_learn_from/fpml/fx-derivatives/):**
```
fx-ex01-fx-spot.xml                  fx-ex09-euro-opt.xml
fx-ex02-spot-cross-w-side-rates.xml  fx-ex10-amer-opt.xml
fx-ex03-fx-fwd.xml                   fx-ex11-non-deliverable-option.xml
fx-ex04-fx-fwd-w-settlement.xml      fx-ex12-fx-barrier-option.xml
fx-ex05-fx-fwd-w-ssi.xml             fx-ex13-fx-dbl-barrier-option.xml
fx-ex06-fx-fwd-w-splits.xml          fx-ex14-euro-digital-option.xml
fx-ex07-non-deliverable-forward.xml  fx-ex15-euro-range-digital-option.xml
fx-ex08-fx-swap.xml                  fx-ex16-one-touch-option.xml
                                    fx-ex17-no-touch-option.xml
                                    fx-ex18-double-one-touch-option.xml
                                    fx-ex19-double-no-touch-option.xml
                                    fx-ex20-avg-rate-option-parametric.xml
                                    fx-ex21-avg-rate-option-specific.xml
                                    fx-ex22-straddle.xml
                                    fx-ex23-delta-hedge.xml
```
**EXCLUDED (non-FX):**
```
td-ex01-simple-term-deposit.xml      ← NOT AN FX DERIVATIVE
td-ex02-term-deposit-w-settlement.xml ← NOT AN FX DERIVATIVE
```

### 1.2 CDM parallel fixtures (confirmed on disk)
All 23 FX fixtures listed above have a corresponding `.json` in `data_to_learn_from/cdm_parallel/fx-derivatives/`.

### 1.3 Confirmed Rosetta function files (verified in blocks.json)
```
ingest-fpml-confirmation-product-fxsingleleg-func.rosetta     ← EXISTS
ingest-fpml-confirmation-product-fxswap-func.rosetta          ← EXISTS
ingest-fpml-confirmation-product-fxoption-func.rosetta        ← EXISTS
ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta ← EXISTS
```
Shared ingestion functions confirmed:
```
ingest-fpml-confirmation-header-func.rosetta
ingest-fpml-confirmation-party-func.rosetta
ingest-fpml-confirmation-datetime-func.rosetta
ingest-fpml-confirmation-payment-func.rosetta
ingest-fpml-confirmation-pricequantity-func.rosetta
ingest-fpml-confirmation-legal-func.rosetta
```
No rosetta functions exist for: term deposits, barrier options (single/double), average-rate options, straddle, delta-hedge in `ingest-fpml-confirmation-product-*` namespace.

### 1.4 Cookbook evidence quality
- Quality score: **9.8 / 10** (strong)
- Semantic success rate: **100%** (25/25 full semantic pairs)
- Stable mapping rules: **5** (medium-to-high confidence)
- Repeated transformations: **6**

---

## 2. Runtime-Supported Products for This Run

**Definition of runtime support:** Generated Maven module contains a Java mapper class + JUnit test that parses the fixture XML, maps it, and produces a valid CDM JSON output.

| # | Product | Fixture | Rosetta File | Mapper Status | Test Status |
|---|---------|---------|--------------|---------------|-------------|
| 1 | FxSingleLeg (Spot) | fx-ex01-fx-spot.xml | ✅ confirmed | **In scope** | **In scope** |
| 2 | FxSingleLeg (Spot + side rates) | fx-ex02-spot-cross-w-side-rates.xml | ✅ confirmed | **In scope** | **In scope** |
| 3 | FxSingleLeg (Fwd) | fx-ex03-fx-fwd.xml | ✅ confirmed | **In scope** | **In scope** |
| 4 | FxSingleLeg (Fwd + settlement) | fx-ex04-fx-fwd-w-settlement.xml | ✅ confirmed | **In scope** | **In scope** |
| 5 | FxSingleLeg (Fwd + SSI) | fx-ex05-fx-fwd-w-ssi.xml | ✅ confirmed | **In scope** | **In scope** |
| 6 | FxSingleLeg (Fwd + splits) | fx-ex06-fx-fwd-w-splits.xml | ✅ confirmed | **In scope** | **In scope** |
| 7 | FxSingleLeg (NDF) | fx-ex07-non-deliverable-forward.xml | ✅ confirmed | **In scope** | **In scope** |
| 8 | FxSwap | fx-ex08-fx-swap.xml | ✅ confirmed | **In scope** | **In scope** |
| 9 | FxOption (European) | fx-ex09-euro-opt.xml | ✅ confirmed | **In scope** | **In scope** |
| 10 | FxOption (American) | fx-ex10-amer-opt.xml | ✅ confirmed | **In scope** | **In scope** |
| 11 | FxOption (Non-deliverable) | fx-ex11-non-deliverable-option.xml | ✅ confirmed | **In scope** | **In scope** |
| 12 | FxOption (Digital) | fx-ex14-euro-digital-option.xml | ✅ confirmed | **In scope** | **In scope** |
| 13 | FxOption (Digital range) | fx-ex15-euro-range-digital-option.xml | ✅ confirmed | **In scope** | **In scope** |

**Total: 13 products × 1 mapper + 1 test each = 13 mapper classes + 13 test classes.**

### Products Observed but Unsupported (no Rosetta function file, no generated mapper for this run)

| # | Product | Fixture | Reason not generated |
|---|---------|---------|----------------------|
| 1 | FxBarrierOption (single) | fx-ex12-fx-barrier-option.xml | No `ingest-fpml-confirmation-product-fxbarrieroption-func.rosetta` confirmed in blocks.json |
| 2 | FxBarrierOption (double) | fx-ex13-fx-dbl-barrier-option.xml | No `ingest-fpml-confirmation-product-fxbarrieroption-func.rosetta` confirmed |
| 3 | OneTouch | fx-ex16-one-touch-option.xml | No rosetta function for one-touch in blocks.json |
| 4 | NoTouch | fx-ex17-no-touch-option.xml | No rosetta function for no-touch in blocks.json |
| 5 | DoubleOneTouch | fx-ex18-double-one-touch-option.xml | No rosetta function for double-one-touch in blocks.json |
| 6 | DoubleNoTouch | fx-ex19-double-no-touch-option.xml | No rosetta function for double-no-touch in blocks.json |
| 7 | AvgRateOption (parametric) | fx-ex20-avg-rate-option-parametric.xml | No rosetta function for average rate option in blocks.json |
| 8 | AvgRateOption (specific) | fx-ex21-avg-rate-option-specific.xml | No rosetta function for average rate option in blocks.json |
| 9 | FxStraddle | fx-ex22-straddle.xml | No rosetta function for straddle in blocks.json |
| 10 | FxDeltaHedge | fx-ex23-delta-hedge.xml | No rosetta function for delta-hedge in blocks.json |
| 11 | TermDeposit | td-ex01-simple-term-deposit.xml | **Non-FX product family — explicitly excluded by scope rule** |
| 12 | TermDeposit | td-ex02-term-deposit-w-settlement-etc.xml | **Non-FX product family — explicitly excluded by scope rule** |

These 12 products are **recorded as observed but unsupported** per product scope rule 4.

---

## 3. Stable Mapping Rules (from cookbook evidence.json, confirmed in blocks.json)

These rules apply across ALL 13 runtime-supported products:

| Rule ID | Name | Source | Target | Confidence |
|---------|------|--------|--------|------------|
| fx-derivatives:RULE-001 | Trade identifier → assignedIdentifier.value | `tradeHeader.partyTradeIdentifier.tradeId` (FpML) | `trade.tradeIdentifier.assignedIdentifier.identifier.value` (CDM) | Medium |
| fx-derivatives:RULE-002 | Trade date normalization (remove trailing 'Z') | `tradeHeader.tradeDate` (FpML with 'Z') | `trade.tradeDate.value` (CDM ISO date) | High |
| fx-derivatives:RULE-003 | Option product type → CDM taxonomy name | `fxDigitalOption.productType` (FpML) | `trade.product.taxonomyName.value` (CDM) | High |
| fx-derivatives:RULE-004 | Expiry date/time/businessCenter → exerciseTerms.expiration | `expiryDateTime.expiryDate` + `expiryTime` + `businessCenter` (FpML) | `adjustableDate.adjustedDate.value` + `exerciseTerms.expirationTime.hourMinuteTime` + `businessCenter` (CDM) | Medium |
| fx-derivatives:RULE-005 | Payment amounts → CDM quantities (value + currency unit) | `exchangedCurrencyX.paymentAmount.amount` + `.currency` (FpML) | `trade.tradeLot.quantity.value` + `quantity.unit.currency.value` (CDM) | Medium |

Repeated transformations (apply when source signal is present):
- **TR-001:** Party hrefs → CDM Party1/Party2 references and roles
- **TR-002:** Date normalization (trim trailing 'Z')
- **TR-003:** Expiry date/time → exerciseTerms.expiration
- **TR-004:** PaymentAmount → Quantity mapping
- **TR-005:** Exchange rate → quotedCurrencyPair mapping
- **TR-006:** Forward points → forwardRate calculation

---

## 4. Maven Project Structure

```
fpml-cdm-fx-mapper/
├── pom.xml
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/fpmlcdm/mapper/
│   │           ├── FpmlCdmFxMapperApplication.java    ← entry point, no LLM calls
│   │           ├── mapper/
│   │           │   ├── FpmlCdmMapper.java             ← main mapper interface
│   │           │   ├── FpmlCdmMapperFactory.java      ← product-type router
│   │           │   ├── common/
│   │           │   │   ├── HeaderMapper.java         ← TR-001 party resolution
│   │           │   │   ├── TradeIdentifierMapper.java
│   │           │   │   ├── DateTimeMapper.java        ← RULE-002 date trim
│   │           │   │   └── PartyMapper.java
│   │           │   ├── fx/
│   │           │   │   ├── FxSingleLegMapper.java    ← fx-ex01..07
│   │           │   │   ├── FxSwapMapper.java          ← fx-ex08
│   │           │   │   ├── FxOptionMapper.java        ← fx-ex09..11
│   │           │   │   └── FxDigitalOptionMapper.java ← fx-ex14..15
│   │           │   └── shared/
│   │           │       ├── PaymentAmountMapper.java
│   │           │       ├── ExchangeRateMapper.java
│   │           │       └── BusinessCenterMapper.java
│   │           └── model/
│   │               ├── FpmlTrade.java                 ← FpML DOM model (JAXB)
│   │               └── CdmTrade.java                  ← CDM model (Jackson-annotated)
│   └── test/
│       └── java/
│           └── com/fpmlcdm/mapper/
│               └── fixtures/
│                   ├── FxSingleLegSpotTest.java       ← fx-ex01-fx-spot.xml
│                   ├── FxSingleLegCrossRateTest.java   ← fx-ex02-spot-cross-w-side-rates.xml
│                   ├── FxSingleLegFwdTest.java         ← fx-ex03-fx-fwd.xml
│                   ├── FxSingleLegFwdSettlementTest.java ← fx-ex04-fx-fwd-w-settlement.xml
│                   ├── FxSingleLegFwdSsiTest.java      ← fx-ex05-fx-fwd-w-ssi.xml
│                   ├── FxSingleLegFwdSplitsTest.java   ← fx-ex06-fx-fwd-w-splits.xml
│                   ├── FxSingleLegNdfTest.java         ← fx-ex07-non-deliverable-forward.xml
│                   ├── FxSwapTest.java                 ← fx-ex08-fx-swap.xml
│                   ├── FxOptionEuropeanTest.java       ← fx-ex09-euro-opt.xml
│                   ├── FxOptionAmericanTest.java      ← fx-ex10-amer-opt.xml
│                   ├── FxOptionNdfTest.java            ← fx-ex11-non-deliverable-option.xml
│                   ├── FxDigitalOptionEuroTest.java    ← fx-ex14-euro-digital-option.xml
│                   └── FxDigitalOptionRangeTest.java   ← fx-ex15-euro-range-digital-option.xml
└── src/test/resources/
    └── fixtures/
        ├── fx-ex01-fx-spot.xml
        ├── fx-ex02-spot-cross-w-side-rates.xml
        ... (all 13 test fixture XMLs)
        └── expected/
            ├── fx-ex01-fx-spot.cdm.json   ← ground-truth CDM outputs
            ... (13 expected JSON files)
```

---

## 5. Mapping Responsibilities

### 5.1 FpmlCdmMapper (interface)
```java
package com.fpmlcdm.mapper.mapper;
public interface FpmlCdmMapper {
    CdmTrade map(InputSource source);
    String productType();
    boolean canMap(String fpmlRootElement);
}
```

### 5.2 FpmlCdmMapperFactory (router)
- Inspects `FpML` root element name from the XML
- Returns appropriate `FpmlCdmMapper` instance
- Returns `null` for unsupported product types (barrier options, NDF options, average rate, straddle, delta-hedge, term deposits)

### 5.3 Per-mapper responsibilities

**FxSingleLegMapper** (maps 7 fixtures: fx-ex01 through fx-ex07):
- RULE-001: Copy `tradeHeader.partyTradeIdentifier.tradeId` → `trade.tradeIdentifier.assignedIdentifier.identifier.value`
- RULE-002: Trim trailing 'Z' from `tradeHeader.tradeDate` → `trade.tradeDate.value`
- RULE-005: Map each `exchangedCurrencyX.paymentAmount` → `trade.tradeLot.quantity`
- TR-001: Resolve `partyReference href` → CDM party roles
- TR-004: Map `exchangedCurrencyX.paymentAmount` → `quantity`
- TR-005: Map `exchangeRate.quotedCurrencyPair` → CDM quoted currency pair
- Map `fxSingleLeg.valueDate` → `trade.date.value` or `tradeLot.adjustedDate`
- Handle `fxSingleLeg.exchangedCurrency1/2` payer/receiver references
- For fx-ex07 (NDF): map `nonDeliverableForward` → `nonDeliverableSettlement terms`

**FxSwapMapper** (maps fx-ex08):
- All FxSingleLegMapper rules
- Map both legs of `fxSwap.fxSingleLeg[0]` and `fxSwap.fxSingleLeg[1]`
- Map `fxSwap.productType` → taxonomy name
- Forward points → `forwardRate` calculation (TR-006)

**FxOptionMapper** (maps 3 fixtures: fx-ex09, fx-ex10, fx-ex11):
- All FxSingleLegMapper structural rules
- RULE-004: Map `expiryDateTime` → `exerciseTerms.expiration`
- Map `fxOption.putDate` / `callDate` → `exerciseTerms.expirationDate`
- Map `fxOption.strikeRate` → `price.quantity.value`
- Map `fxOption.premium` → CDM price
- Handle European vs American exercise type

**FxDigitalOptionMapper** (maps 2 fixtures: fx-ex14, fx-ex15):
- All FxOptionMapper rules
- RULE-003: Normalize `fxDigitalOption.productType` → `taxonomyName`
- Map `fxDigitalOption.exerciseStyle` → CDM exercise style
- Map `digitalOption terms` → `cashSettlement` or `deliverable` payout

---

## 6. Step-by-Step Generation Workflow

### Step 1: Bootstrap Maven project
Generate `pom.xml` with:
- Group: `com.fpmlcdm`, Artifact: `fpml-cdm-fx-mapper`
- Java 17, UTF-8
- Dependencies: JAXB (FpML parsing), Jackson (JSON), JUnit 5, AssertJ
- No LLM dependencies (no langchain4j, no OpenAI, no Anthropic)

### Step 2: Generate model classes
- `FpmlTrade.java`: JAXB-annotated classes generated from FpML 4-9 XSD
- `CdmTrade.java`: Jackson-annotated classes matching CDM 2.x JSON structure
- Use fixture XML + JSON as specification; do NOT call an LLM

### Step 3: Generate common mappers
1. **HeaderMapper** — maps header → CDM meta (conversationId, messageId, creationTimestamp)
2. **TradeIdentifierMapper** — implements RULE-001
3. **DateTimeMapper** — implements RULE-002 (trim 'Z')
4. **PartyMapper** — implements TR-001 (href resolution to Party1/Party2)

### Step 4: Generate shared mappers
1. **PaymentAmountMapper** — implements RULE-005
2. **ExchangeRateMapper** — maps quotedCurrencyPair + rate + forwardPoints
3. **BusinessCenterMapper** — maps businessCenter strings

### Step 5: Generate product mappers
1. **FxSingleLegMapper** — maps fxSingleLeg (spot, fwd, NDF)
2. **FxSwapMapper** — extends FxSingleLegMapper, handles two legs
3. **FxOptionMapper** — maps fxOption (European, American, NDF)
4. **FxDigitalOptionMapper** — maps fxDigitalOption (RULE-003 + expiry)

### Step 6: Generate factory
- `FpmlCdmMapperFactory` — dispatches to correct mapper by root element name

### Step 7: Generate test fixtures
- Copy all 13 fixture XML files into `src/test/resources/fixtures/`
- Copy corresponding expected CDM JSON files into `src/test/resources/fixtures/expected/`
- Write 13 JUnit 5 tests (one per fixture)
- Each test: parse XML → map → serialize CDM JSON → compare with expected

### Step 8: Maven build validation gate
```bash
mvn clean compile test
```
Gate criteria:
- ✅ All 13 tests pass (CDM JSON output matches expected)
- ✅ No test failures
- ✅ `mvn package` produces a runnable `.jar` with no LLM dependency
- ✅ `.jar` runs standalone: `java -jar fpml-cdm-fx-mapper-1.0.0.jar <input-fpml-file>`

---

## 7. Unsupported Behavior

The following behaviors are **known limitations** and will NOT be implemented in this run:

| Unsupported | Reason |
|-------------|--------|
| Barrier options (single/double) | No Rosetta function file for `fxbarrieroption` confirmed in blocks.json |
| One-touch / No-touch / Double variants | No Rosetta function file in blocks.json |
| Average rate options (parametric/specific) | No Rosetta function file in blocks.json |
| FxStraddle | No Rosetta function file in blocks.json |
| FxDeltaHedge | No Rosetta function file in blocks.json |
| Term Deposits | Non-FX product family — excluded by product scope rule |
| Runtime enrichment (Party1/Party2 labels) | Logic not explicit in cookbook examples; requires human review per cookbook caveat |
| Forward points to forwardRate calculation (TR-006) | Tentative pattern; thin evidence in cookbook |
| Multiple business center handling | Cookbook RULE-004 caveat: may require further rules |

---

## 8. Traceability Requirements

| FpML fixture | Rosetta function | Cookbook rule | Java mapper class | JUnit test |
|---|---|---|---|---|
| fx-ex01-fx-spot.xml | fxsingleleg | RULE-001,002,005 | FxSingleLegMapper | FxSingleLegSpotTest |
| fx-ex02-spot-cross-w-side-rates.xml | fxsingleleg | RULE-001,005 | FxSingleLegMapper | FxSingleLegCrossRateTest |
| fx-ex03-fx-fwd.xml | fxsingleleg | RULE-001,002,005 | FxSingleLegMapper | FxSingleLegFwdTest |
| fx-ex04-fx-fwd-w-settlement.xml | fxsingleleg | RULE-001,005 | FxSingleLegMapper | FxSingleLegFwdSettlementTest |
| fx-ex05-fx-fwd-w-ssi.xml | fxsingleleg | RULE-001,005 | FxSingleLegMapper | FxSingleLegFwdSsiTest |
| fx-ex06-fx-fwd-w-splits.xml | fxsingleleg | RULE-001,005 | FxSingleLegMapper | FxSingleLegFwdSplitsTest |
| fx-ex07-non-deliverable-forward.xml | fxsingleleg | RULE-001,005 | FxSingleLegMapper | FxSingleLegNdfTest |
| fx-ex08-fx-swap.xml | fxswap | RULE-001,002,005, TR-005 | FxSwapMapper | FxSwapTest |
| fx-ex09-euro-opt.xml | fxoption | RULE-001,004,005 | FxOptionMapper | FxOptionEuropeanTest |
| fx-ex10-amer-opt.xml | fxoption | RULE-001,004,005 | FxOptionMapper | FxOptionAmericanTest |
| fx-ex11-non-deliverable-option.xml | fxoption | RULE-001,004,005 | FxOptionMapper | FxOptionNdfTest |
| fx-ex14-euro-digital-option.xml | fxdigitaloption | RULE-001,003,004,005 | FxDigitalOptionMapper | FxDigitalOptionEuroTest |
| fx-ex15-euro-range-digital-option.xml | fxdigitaloption | RULE-001,003,004,005 | FxDigitalOptionMapper | FxDigitalOptionRangeTest |

---

## 9. Run Summary

| Metric | Value |
|--------|-------|
| Total FX fixtures observed | 23 |
| Non-FX fixtures (excluded) | 2 (td-ex01, td-ex02) |
| **Runtime-supported products** | **13** |
| Observed but unsupported | 10 |
| Rosetta function files confirmed | 4 (`fxsingleleg`, `fxswap`, `fxoption`, `fxdigitaloption`) |
| Stable rules to implement | 5 |
| Repeated transformations to implement | 6 |
| Mapper classes to generate | 13 |
| Test classes to generate | 13 |
| Maven JAR gate | `mvn clean compile test package` |

**Deliverable:** A runnable `fpml-cdm-fx-mapper-1.0.0.jar` that parses any of the 13 supported FpML FX fixture files and produces CDM JSON — **without any LLM calls at runtime**.
```