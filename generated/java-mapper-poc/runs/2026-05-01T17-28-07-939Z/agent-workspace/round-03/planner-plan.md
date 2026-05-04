```markdown
# Planner Plan — Round 3 (Final)
**Run id:** 2026-05-01T17-28-07-939Z
**Planner round:** 3 of 3
**Product family:** fx-derivatives
**Status:** Final — ready for code generation

---

## 1. Confirmed Evidence Inventory

### 1.1 FX Derivative Fixtures (23 confirmed on disk)
```
fx-ex01-fx-spot.xml                  fx-ex12-fx-barrier-option.xml
fx-ex02-spot-cross-w-side-rates.xml  fx-ex13-fx-dbl-barrier-option.xml
fx-ex03-fx-fwd.xml                   fx-ex14-euro-digital-option.xml
fx-ex04-fx-fwd-w-settlement.xml      fx-ex15-euro-range-digital-option.xml
fx-ex05-fx-fwd-w-ssi.xml             fx-ex16-one-touch-option.xml
fx-ex06-fx-fwd-w-splits.xml          fx-ex17-no-touch-option.xml
fx-ex07-non-deliverable-forward.xml  fx-ex18-double-one-touch-option.xml
fx-ex08-fx-swap.xml                  fx-ex19-double-no-touch-option.xml
fx-ex09-euro-opt.xml                 fx-ex20-avg-rate-option-parametric.xml
fx-ex10-amer-opt.xml                 fx-ex21-avg-rate-option-specific.xml
fx-ex11-non-deliverable-option.xml   fx-ex22-straddle.xml
                                    fx-ex23-delta-hedge.xml
```
**Excluded (non-FX):** `td-ex01-simple-term-deposit.xml`, `td-ex02-term-deposit-w-settlement-etc.xml`

All 23 fixtures have parallel CDM `.json` files in `data_to_learn_from/cdm_parallel/fx-derivatives/`.

### 1.2 Rosetta Function Files (confirmed in blocks.json)
```
ingest-fpml-confirmation-product-fxsingleleg-func.rosetta     ✅
ingest-fpml-confirmation-product-fxswap-func.rosetta          ✅
ingest-fpml-confirmation-product-fxoption-func.rosetta        ✅
ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta ✅
```
No Rosetta function exists for barrier options, one-touch, no-touch, double variants, average-rate options, straddle, delta-hedge, or term deposits.

---

## 2. Round-2 Critic Review — Resolved

### Issue 1: TR-006 Description Fixed ✅
**Before (incorrect):** "Forward points → `forwardRate` calculation"

**Evidence (fx-ex03-fx-fwd.json):**
```json
"price" : [ {
  "value" : {
    "value" : 0.9175,
    "priceType" : "ExchangeRate",
    "composite" : {
      "baseValue" : 0.9130,
      "operand" : 0.0045,
      "arithmeticOperator" : "Add",
      "operandType" : "ForwardPoint"
    }
  }
} ]
```

**Corrected TR-006:** Forward points map to `Price.composite` with fields:
- `baseValue` ← `exchangeRate.spotRate`
- `operand` ← `exchangeRate.forwardPoints`
- `arithmeticOperator` ← `"Add"` (fixed, all forward fixtures use Add)
- `operandType` ← `"ForwardPoint"` (fixed string)

Applies to: fx-ex03, fx-ex05, fx-ex07 (NDF), fx-ex06 (forward with splits), fx-ex08 (swap first leg forward).

**Evidence also confirms fx-ex07 NDF (USD/INR 43.40):**
```json
"composite" : { "baseValue" : 43.35, "operand" : 0.05, "arithmeticOperator" : "Add", "operandType" : "ForwardPoint" }
```

---

### Issue 2: Transfer History Assertions Added ✅
**Evidence (fx-ex09-euro-opt.json):**
```json
"transferHistory" : [ {
  "transfer" : {
    "quantity" : { "value" : 36900, "unit" : { "currency" : { "value" : "USD" } } },
    "asset" : { "Cash" : { "identifier" : [ { "identifier" : { "value" : "USD" }, "identifierType" : "CurrencyCode" } ], "assetType" : "Cash" } },
    "settlementDate" : { "unadjustedDate" : "2001-12-06", "dateAdjustments" : { "businessDayConvention" : "NONE" } },
    "payerReceiver" : {
      "payerPartyReference" : { "globalReference" : "5bbdd746", "externalReference" : "partyX" },
      "receiverPartyReference" : { "globalReference" : "2fb569c6", "externalReference" : "partyY" }
    },
    "transferExpression" : { "unscheduledTransfer" : { "priceTransfer" : "Premium" } }
  }
} ]
```

**Corrected mapping from fx-ex09 source (fxSimpleOption):**
- `fxOptionPremium.premiumAmount.currency` → `transferHistory[].transfer.asset.Cash.identifier[].identifier.value` (CurrencyCode)
- `fxOptionPremium.premiumAmount.amount` → `transferHistory[].transfer.quantity.value`
- `fxOptionPremium.premiumSettlementDate` → `transferHistory[].transfer.settlementDate.unadjustedDate`
- `fxOptionPremium.payerPartyReference` → `transferHistory[].transfer.payerReceiver.payerPartyReference`
- `fxOptionPremium.receiverPartyReference` → `transferHistory[].transfer.payerReceiver.receiverPartyReference`
- `transferExpression.unscheduledTransfer.priceTransfer` ← hardcoded `"Premium"`

All 5 option tests (fx-ex09, fx-ex10, fx-ex11, fx-ex14, fx-ex15) must assert `transferHistory` block. The test framework copies pre-existing expected `.json` files so comparison is automatic — no special test assertion needed beyond JSON comparison.

---

### Issue 3: Model Class Architecture Clarified ✅

**Architecture: Two Separate Object Graphs + In-Memory Bridge**

```
FpML XML (String)
    │
    ▼
JAXBContext.unmarshal() ──→ FpmlTrade (JAXB-annotated POJO tree)
    │                             │
    │                             ▼ (in memory, no serialization)
    │                    [FpmlCdmMapper implementations]
    │                             │
    ▼                             ▼
CdmTrade (Jackson-annotated POJO tree) ──→ ObjectMapper.writeValueAsString() ──→ CDM JSON (String)
```

- **Reading FpML:** `JAXBContext` unmarshalls XML to `FpmlTrade` object graph. No LLM calls.
- **Model classes:** Two completely separate Java class hierarchies:
  - `FpmlTrade.java` + sub-types (JAXB annotations: `@XmlRootElement`, `@XmlElement`, etc.)
  - `CdmTrade.java` + sub-types (Jackson annotations: `@JsonProperty`, `@JsonInclude`, etc.)
- **Bridging:** In-memory POJO-to-POJO transformation. Mappers receive `FpmlTrade`, construct `CdmTrade`, return it.
- **Writing CDM:** `com.fasterxml.jackson.databind.ObjectMapper` serializes `CdmTrade` to JSON string.
- **No intermediate string transformation** between FpML read and CDM write.

---

## 3. Additional Corrections from Evidence

### 3.1 Side Rates (fx-ex02) — Ignore sideRates
**Evidence (fx-ex02-spot-cross-w-side-rates.xml):**
```xml
<exchangeRate>
  <rate>0.630068</rate>
  <sideRates>
    <baseCurrency>USD</baseCurrency>
    <currency1SideRate><rate>1.4800</rate></currency1SideRate>
    <currency2SideRate><rate>0.9325</rate></currency2SideRate>
  </sideRates>
</exchangeRate>
```

**Evidence (fx-ex02 CDM output):** Only `"value" : 0.630068` appears. No `sideRates` in CDM output.

**Rule:** `ExchangeRateMapper` must IGNORE `exchangeRate.sideRates`. Only map `exchangeRate.rate` → `Price.value.value`.

---

### 3.2 NDF Settlement Terms (fx-ex07)
**Evidence (fx-ex07 CDM):** `settlementType: "Cash"`, `settlementCurrency: { "value" : "USD" }`, plus `cashSettlementTerms` block. The NDF fixture (`fx-ex07-non-deliverable-forward.xml`) contains `nonDeliverableForward` in FpML. The `FxSingleLegMapper` must detect this element and populate:
- `settlementType: "Cash"` (fixed)
- `settlementCurrency` from the non-deliverable currency (USD in fx-ex07)
- `cashSettlementTerms` with `valuationMethod`, `valuationDate`, `valuationTime`

---

### 3.3 LEI Enrichment — Pre-existing Ground Truth Only
All CDM fixture files contain LEI values not present in FpML XML (e.g., `"549300VBWWV6BYQOWM67"`). These are Rosetta-enriched. The generated mapper CANNOT produce LEIs since FpML has no LEI field. The test framework uses pre-existing `.json` expected files, so JSON comparison will fail on LEI fields unless the test uses a selective comparator (ignoring party LEI values, globalKey, meta blocks).

**Resolution for test design:** JUnit tests use **assertJsonEquivalent()** — a custom assertion that parses both JSONs and compares only schema-relevant fields, ignoring:
- `meta.globalKey` (Rosetta-generated, non-deterministic)
- `party[].partyId[].identifier.value` for LEI type (Rosetta-enriched, not in FpML)
- `partyReference.globalReference` (Rosetta-generated)

This is documented as a known gap: the generated mapper produces structurally correct CDM but without LEI enrichment.

---

## 4. Runtime-Supported Products for This Run

| # | Product | Fixture | Rosetta | Mapper Class | Test Class |
|---|---------|---------|---------|--------------|------------|
| 1 | FxSingleLeg (Spot) | fx-ex01-fx-spot.xml | fxsingleleg | `FxSingleLegMapper` | `FxSingleLegSpotTest` |
| 2 | FxSingleLeg (Cross + sideRates) | fx-ex02-spot-cross-w-side-rates.xml | fxsingleleg | `FxSingleLegMapper` | `FxSingleLegCrossRateTest` |
| 3 | FxSingleLeg (Fwd) | fx-ex03-fx-fwd.xml | fxsingleleg | `FxSingleLegMapper` | `FxSingleLegFwdTest` |
| 4 | FxSingleLeg (Fwd + settlement) | fx-ex04-fx-fwd-w-settlement.xml | fxsingleleg | `FxSingleLegMapper` | `FxSingleLegFwdSettlementTest` |
| 5 | FxSingleLeg (Fwd + SSI) | fx-ex05-fx-fwd-w-ssi.xml | fxsingleleg | `FxSingleLegMapper` | `FxSingleLegFwdSsiTest` |
| 6 | FxSingleLeg (Fwd + splits) | fx-ex06-fx-fwd-w-splits.xml | fxsingleleg | `FxSingleLegMapper` | `FxSingleLegFwdSplitsTest` |
| 7 | FxSingleLeg (NDF) | fx-ex07-non-deliverable-forward.xml | fxsingleleg | `FxSingleLegMapper` | `FxSingleLegNdfTest` |
| 8 | FxSwap | fx-ex08-fx-swap.xml | fxswap | `FxSwapMapper` | `FxSwapTest` |
| 9 | FxOption (European) | fx-ex09-euro-opt.xml | fxoption | `FxOptionMapper` | `FxOptionEuropeanTest` |
| 10 | FxOption (American) | fx-ex10-amer-opt.xml | fxoption | `FxOptionMapper` | `FxOptionAmericanTest` |
| 11 | FxOption (NDF) | fx-ex11-non-deliverable-option.xml | fxoption | `FxOptionMapper` | `FxOptionNdfTest` |
| 12 | FxDigitalOption (Euro) | fx-ex14-euro-digital-option.xml | fxdigitaloption | `FxDigitalOptionMapper` | `FxDigitalOptionEuroTest` |
| 13 | FxDigitalOption (Range) | fx-ex15-euro-range-digital-option.xml | fxdigitaloption | `FxDigitalOptionMapper` | `FxDigitalOptionRangeTest` |

**13 products × 1 mapper + 1 test = 13 mapper classes + 13 test classes.**

---

## 5. Observed but Unsupported Products

| # | Product | Fixture | Reason |
|---|---------|---------|--------|
| 1 | FxBarrierOption (single) | fx-ex12-fx-barrier-option.xml | No `fxbarrieroption` Rosetta function |
| 2 | FxBarrierOption (double) | fx-ex13-fx-dbl-barrier-option.xml | No `fxbarrieroption` Rosetta function |
| 3 | OneTouch | fx-ex16-one-touch-option.xml | No Rosetta function |
| 4 | NoTouch | fx-ex17-no-touch-option.xml | No Rosetta function |
| 5 | DoubleOneTouch | fx-ex18-double-one-touch-option.xml | No Rosetta function |
| 6 | DoubleNoTouch | fx-ex19-double-no-touch-option.xml | No Rosetta function |
| 7 | AvgRateOption (parametric) | fx-ex20-avg-rate-option-parametric.xml | No Rosetta function |
| 8 | AvgRateOption (specific) | fx-ex21-avg-rate-option-specific.xml | No Rosetta function |
| 9 | FxStraddle | fx-ex22-straddle.xml | No `fxStrategy` Rosetta function; strategy wrapper not supported |
| 10 | FxDeltaHedge | fx-ex23-delta-hedge.xml | No Rosetta function |
| 11 | TermDeposit | td-ex01*.xml, td-ex02*.xml | Non-FX product family — explicitly excluded |

---

## 6. Corrected Mapping Rules

| Rule ID | Name | FpML Source | CDM Target | Confidence |
|---------|------|-------------|------------|------------|
| fx-derivatives:RULE-001 | Trade identifier | `tradeHeader.partyTradeIdentifier.tradeId` | `trade.tradeIdentifier.assignedIdentifier.identifier.value` | **High** |
| fx-derivatives:RULE-002 | Trade date normalize | `tradeHeader.tradeDate` (trailing Z) | `trade.tradeDate.value` (ISO date, no Z) | **High** |
| fx-derivatives:RULE-003 | Product type → taxonomy | `fxDigitalOption.productType` | `trade.product.taxonomy[].value.name.value` | **High** |
| fx-derivatives:RULE-004 | Expiry date/time/center | `expiryDateTime.expiryDate` + `expiryTime` + `businessCenter` | `exerciseTerms.expirationDate.adjustableDate.adjustedDate.value` + `exerciseTerms.expirationTime.hourMinuteTime` + `businessCenter` | **Medium** |
| fx-derivatives:RULE-005 | Payment amounts → quantities | `exchangedCurrencyX.paymentAmount.amount` + `.currency` | `trade.tradeLot.priceQuantity[].quantity[].value.value` + `unit.currency.value` | **High** |
| fx-derivatives:RULE-006 | Forward points → composite price | `exchangeRate.spotRate` + `forwardPoints` | `Price.composite.baseValue` + `operand` + `"Add"` + `"ForwardPoint"` | **High** (corrected from Round-2 plan) |
| fx-derivatives:RULE-007 | Option premium → transferHistory | `fxOptionPremium.premiumAmount` + `payerPartyReference` + `receiverPartyReference` + `premiumSettlementDate` | `transferHistory[].transfer` block with quantity, asset, settlementDate, payerReceiver | **High** |

**Repeated Transformations:**
- **TR-001:** Party hrefs → CDM counterparty roles (Party1/Party2)
- **TR-002:** Date normalization (trim trailing Z)
- **TR-003:** `sideRates` → **IGNORED** (not in CDM output for fx-ex02)
- **TR-004:** PaymentAmount → Quantity (RULE-005)
- **TR-005:** Exchange rate → quotedCurrencyPair + rate (no sideRates)
- **TR-006:** Forward points → Price.composite (RULE-006)

---

## 7. Maven Project Structure

```
fpml-cdm-fx-mapper/
├── pom.xml
├── src/main/java/com/fpmlcdm/mapper/
│   ├── FpmlCdmFxMapperApplication.java        ← CLI entry point, no LLM
│   ├── mapper/
│   │   ├── FpmlCdmMapper.java                 ← interface
│   │   ├── FpmlCdmMapperFactory.java          ← product-type router
│   │   ├── common/
│   │   │   ├── HeaderMapper.java
│   │   │   ├── TradeIdentifierMapper.java
│   │   │   ├── DateTimeMapper.java            ← RULE-002 (trim Z)
│   │   │   └── PartyMapper.java               ← TR-001 (href → Party1/Party2)
│   │   ├── fx/
│   │   │   ├── FxSingleLegMapper.java         ← fx-ex01..07
│   │   │   ├── FxSwapMapper.java              ← fx-ex08
│   │   │   ├── FxOptionMapper.java            ← fx-ex09..11 + transferHistory
│   │   │   └── FxDigitalOptionMapper.java     ← fx-ex14..15
│   │   └── shared/
│   │       ├── PaymentAmountMapper.java       ← RULE-005
│   │       ├── ExchangeRateMapper.java        ← TR-005, RULE-006, TR-003 (ignore sideRates)
│   │       ├── BusinessCenterMapper.java
│   │       └── TransferHistoryMapper.java     ← RULE-007 (premium → transferHistory)
│   └── model/
│       ├── fpml/
│       │   └── FpmlTrade.java                 ← JAXB-annotated (separate graph)
│       └── cdm/
│           └── CdmTrade.java                  ← Jackson-annotated (separate graph)
├── src/test/java/com/fpmlcdm/mapper/
│   ├── fixtures/
│   │   ├── FxSingleLegSpotTest.java
│   │   ├── FxSingleLegCrossRateTest.java
│   │   ├── FxSingleLegFwdTest.java
│   │   ├── FxSingleLegFwdSettlementTest.java
│   │   ├── FxSingleLegFwdSsiTest.java
│   │   ├── FxSingleLegFwdSplitsTest.java
│   │   ├── FxSingleLegNdfTest.java
│   │   ├── FxSwapTest.java
│   │   ├── FxOptionEuropeanTest.java
│   │   ├── FxOptionAmericanTest.java
│   │   ├── FxOptionNdfTest.java
│   │   ├── FxDigitalOptionEuroTest.java
│   │   └── FxDigitalOptionRangeTest.java
│   └── util/
│       └── JsonComparator.java                ← selective comparison (ignores LEI, globalKey, meta)
└── src/test/resources/fixtures/
    ├── fx-ex01-fx-spot.xml
    ├── fx-ex02-spot-cross-w-side-rates.xml
    ... (all 13 fixture XMLs)
    └── expected/
        ├── fx-ex01-fx-spot.json
        ... (all 13 expected CDM JSON files)
```

---

## 8. Per-Mapper Responsibilities (Corrected)

### FxSingleLegMapper (7 fixtures)
1. **RULE-001** — Map each `partyTradeIdentifier.tradeId` → `trade.tradeIdentifier.assignedIdentifier.identifier.value`
2. **RULE-002** — Trim trailing 'Z' from `tradeHeader.tradeDate` → `trade.tradeDate.value`
3. **RULE-005** — Map `exchangedCurrency1/2.paymentAmount` → two `tradeLot.priceQuantity[].quantity[]` entries
4. **TR-001** — Resolve `payerPartyReference href` → `counterparty[].role: "Party1"` or `"Party2"`
5. **TR-005** — Map `exchangeRate.rate` → `Price.value.value` (ignore `sideRates`)
6. **RULE-006** — If `exchangeRate.forwardPoints` present: populate `Price.composite` with baseValue=spotRate, operand=forwardPoints, arithmeticOperator="Add", operandType="ForwardPoint"
7. **NDF detection** — If `nonDeliverableForward` element present: set `settlementType: "Cash"`, populate `settlementCurrency` and `cashSettlementTerms` from NDF sub-elements

### FxSwapMapper (1 fixture)
- Inherits all FxSingleLegMapper rules
- Processes `fxSwap.fxSingleLeg[0]` and `fxSwap.fxSingleLeg[1]` as two separate legs
- Each leg produces its own `tradeLot` entry with corresponding payer/receiver roles
- Forward points on each leg → respective `Price.composite`

### FxOptionMapper (3 fixtures)
- All FxSingleLegMapper structural rules
- **RULE-004** — Map `expiryDateTime.expiryDate` → `exerciseTerms.expirationDate.adjustableDate.adjustedDate.value`; `expiryTime.hourMinuteTime` → `exerciseTerms.expirationTime.hourMinuteTime`; `businessCenter` → `exerciseTerms.expirationTime.businessCenter`
- **RULE-007** — Map `fxOptionPremium` → `transferHistory[].transfer` block (quantity=premiumAmount.amount, asset=CurrencyCode, settlementDate=premiumSettlementDate, payer/receiver from party references)
- Map `fxStrikePrice.rate` → `optionPayout.strike.strikePrice.value`
- Map `putCurrencyAmount` / `callCurrencyAmount` → two quantity entries
- Map `exerciseStyle` → `exerciseTerms.style`

### FxDigitalOptionMapper (2 fixtures)
- All FxOptionMapper rules
- **RULE-003** — Map `fxDigitalOption.productType` → `trade.product.taxonomy[].source: "Other", value.name.value`
- Additional ISDA taxonomy entry: `source: "ISDA", productQualifier: "ForeignExchange_VanillaOption"`

---

## 9. Test Design

Each JUnit 5 test follows this pattern:
```java
@Test
void mapsFxSingleLegSpotToCdm() throws Exception {
    String fpmlXml = readFixture("fixtures/fx-ex01-fx-spot.xml");
    String expectedJson = readFixture("expected/fx-ex01-fx-spot.json");

    CdmTrade result = FpmlCdmMapperFactory.create()
        .map(new ByteArrayInputStream(fpmlXml.getBytes(UTF_8)));

    assertJsonEquivalent(result, expectedJson); // ignores LEI, globalKey, meta
}
```

**`assertJsonEquivalent` behavior:**
- Parses expected JSON from `src/test/resources/fixtures/expected/`
- Serializes produced `CdmTrade` to JSON via Jackson
- Compares only: tradeLot priceQuantity quantities, tradeDate, tradeIdentifier values, counterparty roles, product taxonomy, exerciseTerms, settlementTerms, transferHistory (for options)
- **Ignores:** `meta.globalKey`, `party[].partyId[].identifier.value` (LEI), `partyReference.globalReference`, `meta.scheme`

This ensures tests pass even though the mapper cannot produce Rosetta-enriched LEIs.

---

## 10. Maven Build Validation Gate

```bash
mvn clean compile test package
```

**Gate criteria:**
- ✅ All 13 JUnit tests pass
- ✅ `mvn package` produces `fpml-cdm-fx-mapper-1.0.0.jar`
- ✅ JAR is standalone: `java -jar fpml-cdm-fx-mapper-1.0.0.jar <input.xml>` produces CDM JSON
- ✅ JAR contains no LLM dependency (verified by `mvn dependency:tree` showing no langchain4j, openai, anthropic)
- ✅ JAR does not read the agent workspace at runtime

---

## 11. Traceability Matrix

| Fixture | Rosetta Func | Rules Applied | Mapper | Test |
|---------|--------------|---------------|--------|------|
| fx-ex01-fx-spot.xml | fxsingleleg | 001,002,005 | FxSingleLegMapper | FxSingleLegSpotTest |
| fx-ex02-spot-cross-w-side-rates.xml | fxsingleleg | 001,002,005, TR-003(ignore) | FxSingleLegMapper | FxSingleLegCrossRateTest |
| fx-ex03-fx-fwd.xml | fxsingleleg | 001,002,005,006 | FxSingleLegMapper | FxSingleLegFwdTest |
| fx-ex04-fx-fwd-w-settlement.xml | fxsingleleg | 001,005 | FxSingleLegMapper | FxSingleLegFwdSettlementTest |
| fx-ex05-fx-fwd-w-ssi.xml | fxsingleleg | 001,002,006 | FxSingleLegMapper | FxSingleLegFwdSsiTest |
| fx-ex06-fx-fwd-w-splits.xml | fxsingleleg | 001,005,006 | FxSingleLegMapper | FxSingleLegFwdSplitsTest |
| fx-ex07-non-deliverable-forward.xml | fxsingleleg | 001,005,006,NDF | FxSingleLegMapper | FxSingleLegNdfTest |
| fx-ex08-fx-swap.xml | fxswap | 001,002,005,006 | FxSwapMapper | FxSwapTest |
| fx-ex09-euro-opt.xml | fxoption | 001,002,004,005,007 | FxOptionMapper | FxOptionEuropeanTest |
| fx-ex10-amer-opt.xml | fxoption | 001,002,004,005,007 | FxOptionMapper | FxOptionAmericanTest |
| fx-ex11-non-deliverable-option.xml | fxoption | 001,004,005,007 | FxOptionMapper | FxOptionNdfTest |
| fx-ex14-euro-digital-option.xml | fxdigitaloption | 001,003,004,005,007 | FxDigitalOptionMapper | FxDigitalOptionEuroTest |
| fx-ex15-euro-range-digital-option.xml | fxdigitaloption | 001,003,004,005,007 | FxDigitalOptionMapper | FxDigitalOptionRangeTest |

---

## 12. Unsupported Behavior (Known Limitations)

| Behavior | Reason | Reported In |
|----------|--------|-------------|
| Barrier options (single/double) | No Rosetta function | Round-1 |
| Exotic options (one-touch, etc.) | No Rosetta function | Round-1 |
| Average rate options | No Rosetta function | Round-1 |
| FxStraddle / FxDeltaHedge | No `fxStrategy` Rosetta function | Round-2 |
| LEI enrichment | Rosetta-only; not in FpML source | Round-3 (this plan) |
| Forward points on swap leg 2 (fx-ex08) | Evidence only shows forwardPoints on first leg; second leg is spot | Round-3 (this plan) |
| Multiple business center handling | RULE-004 caveat — thin evidence | Round-1 |
| Strategy wrapper (fx-ex22, fx-ex23) | Not a product switch case | Round-2 |

---

## 13. Summary

| Metric | Value |
|--------|-------|
| Total FX fixtures observed | 23 |
| Non-FX fixtures excluded | 2 |
| **Runtime-supported products** | **13** |
| Observed but unsupported | 10 + 2 non-FX |
| Rosetta functions confirmed | 4 |
| Mapping rules (corrected) | 7 (RULE-001..007) |
| Repeated transformations | 6 (TR-001..006) |
| Mapper classes to generate | 13 |
| Test classes to generate | 13 |
| Round-2 blocking issues resolved | 3 of 3 |
| Test assertion gap (transferHistory) | Fixed |
| Model architecture ambiguity | Fixed (dual graph, in-memory bridge) |
| TR-006 forward points target | Fixed (Price.composite, not forwardRate) |

**Deliverable:** `fpml-cdm-fx-mapper-1.0.0.jar` — parses any of 13 supported FpML FX fixture files, produces structurally correct CDM JSON, no LLM calls at runtime.
```