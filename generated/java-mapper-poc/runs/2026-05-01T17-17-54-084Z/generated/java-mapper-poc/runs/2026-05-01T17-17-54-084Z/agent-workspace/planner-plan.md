# Planner Plan — FX Derivatives Generator Run

**Run ID:** `2026-05-01T17-17-54-084Z`  
**Product family:** `fx-derivatives`  
**Planning round:** 1 of 3  
**Planner role:** minimax/minimax-m2.7  
**Generated:** 2026-05-01T17:17:54Z

---

## 1. Evidence Inspection Summary

### 1.1 Source FpML fixtures (25 files)

| # | Filename | Product type | FpML element |
|---|---|---|---|
| 01 | `fx-ex01-fx-spot.xml` | FX Spot | `fxSingleLeg` |
| 02 | `fx-ex02-spot-cross-w-side-rates.xml` | FX Spot (cross rates) | `fxSingleLeg` |
| 03 | `fx-ex03-fx-fwd.xml` | FX Forward | `fxSingleLeg` |
| 04 | `fx-ex04-fx-fwd-w-settlement.xml` | FX Forward (settlement) | `fxSingleLeg` |
| 05 | `fx-ex05-fx-fwd-w-ssi.xml` | FX Forward (SSI) | `fxSingleLeg` |
| 06 | `fx-ex06-fx-fwd-w-splits.xml` | FX Forward (splits) | `fxSingleLeg` |
| 07 | `fx-ex07-non-deliverable-forward.xml` | NDF | `fxSingleLeg` |
| 08 | `fx-ex08-fx-swap.xml` | FX Swap | `fxSwap` |
| 09 | `fx-ex09-euro-opt.xml` | FX Vanilla Option (European) | `fxSimpleOption` |
| 10 | `fx-ex10-amer-opt.xml` | FX Vanilla Option (American) | `fxSimpleOption` |
| 11 | `fx-ex11-non-deliverable-option.xml` | NDO | `fxSimpleOption` |
| 12 | `fx-ex12-fx-barrier-option.xml` | FX Barrier Option | `fxOption` |
| 13 | `fx-ex13-fx-dbl-barrier-option.xml` | FX Double Barrier Option | `fxOption` |
| 14 | `fx-ex14-euro-digital-option.xml` | FX Digital Option | `fxDigitalOption` |
| 15 | `fx-ex15-euro-range-digital-option.xml` | FX Range Digital Option | `fxDigitalOption` |
| 16 | `fx-ex16-one-touch-option.xml` | One-Touch Digital | `fxDigitalOption` |
| 17 | `fx-ex17-no-touch-option.xml` | No-Touch Digital | `fxDigitalOption` |
| 18 | `fx-ex18-double-one-touch-option.xml` | Double One-Touch | `fxDigitalOption` |
| 19 | `fx-ex19-double-no-touch-option.xml` | Double No-Touch | `fxDigitalOption` |
| 20 | `fx-ex20-avg-rate-option-parametric.xml` | FX Average Rate (parametric) | `fxOption` |
| 21 | `fx-ex21-avg-rate-option-specific.xml` | FX Average Rate (specific) | `fxOption` |
| 22 | `fx-ex22-straddle.xml` | FX Straddle | `fxOption` |
| 23 | `fx-ex23-delta-hedge.xml` | FX Delta Hedge | `fxOption` |
| 24 | `td-ex01-simple-term-deposit.xml` | Term Deposit | `termDeposit` |
| 25 | `td-ex02-term-deposit-w-settlement-etc.xml` | Term Deposit (settlement) | `termDeposit` |

### 1.2 CDM parallel evidence (25 files)

- All 25 FpML files have matching CDM JSON counterparts at `data_to_learn_from/cdm_parallel/fx-derivatives/`.
- All 25 pairs are semantically matched (100% success rate per `fx-derivatives.evidence.json`).
- All 25 pairs have stable mapping patterns documented in the agent-cookbook.

### 1.3 Rosetta source blocks (6 product function files)

| Rosetta file | Product | Key functions |
|---|---|---|
| `ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | FX Spot/Forward/NDF | `MapFxSingleLegNonTransferableProduct`, `MapFxCoreDetailsModelToSettlementPayout` |
| `ingest-fpml-confirmation-product-fxswap-func.rosetta` | FX Swap | `MapFxSwapNonTransferableProduct`, `MapFxSwapPayoutList` |
| `ingest-fpml-confirmation-product-fxoption-func.rosetta` | FX Vanilla/American/NDO/Barrier/Avg/Straddle | `MapFxOptionNonTransferableProduct`, `MapFxOptionPayout`, `MapFxOptionStrikePrice` |
| `ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | FX Digital options | `MapFxDigitalOptionNonTransferableProduct`, `MapFxDigitalOptionPayout` |
| `ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | FX Variance Swap | Not in 25-pair evidence |
| `ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | FX Volatility Swap | Not in 25-pair evidence |

---

## 2. Stable Mapping Rules (from agent-cookbook fx-derivatives)

| Rule ID | Description | Source signal | Target path | Confidence |
|---|---|---|---|---|
| `RULE-001` | Trade identifier → `assignedIdentifier.value` | `tradeHeader.partyTradeIdentifier.tradeId` | `trade.tradeIdentifier.assignedIdentifier.identifier.value` | medium |
| `RULE-002` | Trade date normalization (trim `Z`) | `trade.tradeHeader.tradeDate` | `trade.tradeDate.value` | high |
| `RULE-003` | Option product type → CDM taxonomy name | `fxDigitalOption.productType` | `trade.product.taxonomyName.value` | high |
| `RULE-004` | Expiry date/time/businessCenter → exerciseTerms.expiration | `expiryDateTime.expiryDate`, `expiryTime`, `businessCenter` | `exerciseTerms.expiration` | medium |
| `RULE-005` | Payment amounts → CDM quantities | `exchangedCurrencyX.paymentAmount.amount` + `currency` | `trade.tradeLot.quantity.value` + `unit.currency.value` | medium |

### Repeated non-literal transformations

| TR ID | Description | Type |
|---|---|---|
| `TR-001` | Resolve `partyReference href` → CDM `Party1`/`Party2` roles | reference resolution |
| `TR-002` | Date normalization (trim trailing `Z`) | normalization |
| `TR-003` | Expiry date/time → `exerciseTerms.expiration` | normalization |
| `TR-004` | `PaymentAmount` → `Quantity` mapping | normalization |
| `TR-005` | `QuoteBasis` → `perUnitOf` unit mapping | normalization |
| `TR-006` | `QuoteBasis` → CDM exchange rate direction | normalization |

### Tentative patterns requiring analyst review

| ID | Description |
|---|---|
| `TENT-001` | Trade identifiers mapping (duplicate CDM entries observed) |
| `TENT-002` | LEI enrichment in CDM not present in FpML |
| `TENT-003` | `spotRate`/`forwardPoints` → `composite` in CDM price |
| `TENT-004` | `fxOptionPremium` → `transferHistory` in CDM |
| `TENT-005` | `settlementInstruction` → payment legs in CDM |

---

## 3. Supported Products for This Run

**Decision:** All 25 products are supported — all have complete FpML fixtures and CDM parallel outputs, and the Rosetta source blocks cover all four FpML product elements (`fxSingleLeg`, `fxSwap`, `fxSimpleOption`, `fxDigitalOption`).


### 3.1 By FpML product element

| FpML element | Products | Count |
|---|---|---|
| `fxSingleLeg` | fx-ex01, fx-ex02, fx-ex03, fx-ex04, fx-ex05, fx-ex06, fx-ex07 (NDF) | 7 |
| `fxSwap` | fx-ex08 | 1 |
| `fxSimpleOption` | fx-ex09 (EUR), fx-ex10 (AMER), fx-ex11 (NDO), fx-ex20, fx-ex21, fx-ex22, fx-ex23 | 7 |
| `fxDigitalOption` | fx-ex12, fx-ex13, fx-ex14, fx-ex15, fx-ex16, fx-ex17, fx-ex18, fx-ex19 | 8 |
| `termDeposit` | td-ex01, td-ex02 | 2 |
| **Total** | | **25** |

### 3.2 Products grouped by complexity tier

| Tier | Products | Rationale |
|---|---|---|
| **Tier 1 — Core** | fx-ex01 (Spot), fx-ex03 (Forward) | Single-leg, plain exchange; highest evidence (11 examples for RULE-001). Foundation for all others. |
| **Tier 2 — Spot variants** | fx-ex02 (cross rates), fx-ex04 (settlement), fx-ex05 (SSI), fx-ex06 (splits) | Same `fxSingleLeg` element; incremental complexity on top of Tier 1 mapping logic. |
| **Tier 3 — NDF** | fx-ex07 | `fxSingleLeg` with non-deliverable flag; requires special settlement handling. |
| **Tier 4 — FX Swap** | fx-ex08 | Two `fxSingleLeg` instances inside `fxSwap`; two SettlementPayout entries in CDM. |
| **Tier 5 — Vanilla options** | fx-ex09, fx-ex10, fx-ex11 | `fxSimpleOption`; introduces OptionPayout, exerciseTerms, strikePrice, premium transfer. |
| **Tier 6 — Exotic options** | fx-ex12, fx-ex13, fx-ex14, fx-ex15, fx-ex16, fx-ex17, fx-ex18, fx-ex19 | `fxDigitalOption` + `fxOption` barrier/digital variants; productType → taxonomy normalization (RULE-003). |
| **Tier 7 — Average/Straddle/Delta** | fx-ex20, fx-ex21, fx-ex22, fx-ex23 | `fxOption` with average-rate observation schedules, straddle, delta-hedge features. |
| **Tier 8 — Term Deposit** | td-ex01, td-ex02 | Out of scope for product-specific FX mapping; map as generic settlement structure. |

---

## 4. Observed Unsupported FX Products

No unsupported FX products are observed in this run's evidence folder. All 25 fixtures have semantically matched CDM pairs.

**Note for future runs:** Variance swap and volatility swap Rosetta functions exist (`fxvarianceswap-func.rosetta`, `fxvolatilityswap-func.rosetta`) but no evidence fixtures were available in the evidence folder. These are flagged as observed-but-unsupported for traceability.


---

## 5. Java Package / Class Design

### 5.1 Project structure

```
fx-derivatives-mapper/
├── pom.xml
└── src/main/java/com/fpmltodm/mapper/
    │   ├── FpmlCdmMapperApplication.java        # CLI entry point
    │   ├── FpmlCdmMapperService.java            # Orchestrates parse → map → serialize
    │   │
    │   ├── product/                             # Product-specific mappers
    │   │   ├── FpmlProductMapper.java           # Interface
    │   │   ├── FxSingleLegMapper.java           # fx-ex01..07, td-ex01..02
    │   │   ├── FxSwapMapper.java                # fx-ex08
    │   │   ├── FxOptionMapper.java              # fx-ex09..13, fx-ex20..23
    │   │   └── FxDigitalOptionMapper.java       # fx-ex14..19
    │   │
    │   ├── shared/                              # Cross-product shared logic
    │   │   ├── TradeHeaderMapper.java           # RULE-001, RULE-002: tradeId, tradeDate
    │   │   ├── PartyReferenceMapper.java        # TR-001: party href → Party1/Party2
    │   │   ├── PaymentAmountMapper.java        # RULE-005, TR-004: paymentAmount → quantity
    │   │   ├── ExchangeRateMapper.java          # TR-005, TR-006: quoteBasis → unit/perUnitOf
    │   │   ├── ExerciseTermsMapper.java         # RULE-004, TR-003: expiry → exerciseTerms
    │   │   └── TaxonomyMapper.java              # RULE-003: productType → taxonomyName
    │   │
    │   ├── model/                               # Intermediate domain model (FpML → CDM bridge)
    │   │   ├── CdmTrade.java
    │   │   ├── CdmParty.java
    │   │   ├── CdmTradeIdentifier.java
    │   │   ├── CdmTradeLot.java
    │   │   ├── CdmQuantity.java
    │   │   ├── CdmPrice.java
    │   │   ├── CdmSettlementPayout.java
    │   │   ├── CdmOptionPayout.java
    │   │   ├── CdmExerciseTerms.java
    │   │   └── CdmTransferHistory.java
    │   │
    │   └── util/                                # Utilities
    │       ├── DateUtils.java                   # RULE-002, TR-002: trim 'Z'
    │       ├── CurrencyUtils.java               # String → currency code
    │       └── GlobalKeyGenerator.java          # Generate deterministic globalKey values
│
└── src/test/java/com/fpmltodm/mapper/
    ├── product/
    │   ├── FxSingleLegMapperTest.java           # Tests fx-ex01..07
    │   ├── FxSwapMapperTest.java                # Tests fx-ex08
    │   ├── FxOptionMapperTest.java             # Tests fx-ex09..13, fx-ex20..23
    │   └── FxDigitalOptionMapperTest.java       # Tests fx-ex14..19
    └── FpmlCdmMapperServiceIntegrationTest.java # Round-trip test all 25 fixtures
```

### 5.2 Package naming

```
com.fpmltodm.mapper           — root
com.fpmltodm.mapper.product    — product mappers
com.fpmltodm.mapper.shared    — shared cross-product mappers
com.fpmltodm.mapper.model     — intermediate CDM model
com.fpmltodm.mapper.util      — utilities
```

### 5.3 Core interfaces

**`FpmlProductMapper` (interface)**
```java
public interface FpmlProductMapper {
    CdmTrade map(Element fpmlProductElement, FpmlParseContext context);
}
```

**`FpmlParseContext`** carries pre-parsed shared state: parties map, trade date, trade identifiers, payer/receiver roles.

---

## 6. Mapping Responsibilities

### 6.1 Shared (applies to all products)

| Shared mapper | Rules applied | Key logic |
|---|---|---|
| `TradeHeaderMapper` | RULE-001, RULE-002 | Extract tradeId → `assignedIdentifier.value`; trim `Z` from `tradeDate` → `tradeDate.value` |
| `PartyReferenceMapper` | TR-001 | Resolve `href` party references; assign `Party1`/`Party2` roles by convention (first party = Party1) |
| `PaymentAmountMapper` | RULE-005, TR-004 | Map `exchangedCurrency1/2.paymentAmount` → two `CdmQuantity` entries |
| `ExchangeRateMapper` | TR-005, TR-006 | Map `quotedCurrencyPair.quoteBasis`; handle `spotRate`/`forwardPoints` → `composite` |

### 6.2 Per-product mappers

| Mapper | Products | Specific logic |
|---|---|---|
| `FxSingleLegMapper` | 01–07, TD | Map `fxSingleLeg` → `CdmSettlementPayout`; valueDate → settlementDate.valueDate; handle NDF non-deliverable flag |
| `FxSwapMapper` | fx-ex08 | Map two `fxSingleLeg` legs → two `CdmSettlementPayout` entries with opposing payer/receiver |
| `FxOptionMapper` | 09–13, 20–23 | Map `fxSimpleOption`/`fxOption` → `CdmOptionPayout`; exerciseStyle, strikePrice, buyerSeller, premium → `transferHistory` |
| `FxDigitalOptionMapper` | 14–19 | Map `fxDigitalOption` → `CdmOptionPayout`; apply RULE-003 productType → taxonomyName normalization |
| `TaxonomyMapper` | 14–19 | Normalize FpML productType strings (e.g., "Euro Binary" → "EuroBinary") per RULE-003 |
| `ExerciseTermsMapper` | 09–19 | Map expiryDate + expiryTime + businessCenter → `exerciseTerms.expiration` per RULE-004/TR-003 |

### 6.3 Product-to-FpML element routing

| FpML root element | Java mapper |
|---|---|
| `trade/fxSingleLeg` | `FxSingleLegMapper` |
| `trade/fxSwap` | `FxSwapMapper` |
| `trade/fxSimpleOption` | `FxOptionMapper` |
| `trade/fxOption` (non-simple) | `FxOptionMapper` |
| `trade/fxDigitalOption` | `FxDigitalOptionMapper` |
| `trade/termDeposit` | `FxSingleLegMapper` (generic settlement structure) |

---

## 7. Test Plan

### 7.1 Unit tests (one test class per product mapper)

Each test class covers all fixture variants for that product family.

| Test class | Fixture files | Assertions |
|---|---|---|
| `FxSingleLegMapperTest` | fx-ex01..07, td-ex01..02 | Exchange rate, both quantities, currency units, payer/receiver roles, value date |
| `FxSwapMapperTest` | fx-ex08 | Two legs, opposing payers/receivers, two value dates |
| `FxOptionMapperTest` | fx-ex09..13, fx-ex20..23 | Option type (call/put), exercise style, strike price, expiration, premium transfer |
| `FxDigitalOptionMapperTest` | fx-ex14..19 | Taxonomy name normalization, digital barrier type |

### 7.2 Integration test

`FpmlCdmMapperServiceIntegrationTest` — runs all 25 fixtures through `FpmlCdmMapperService`, then compares the output JSON against the expected CDM parallel files.

**Note:** CDM outputs contain `globalKey` values (deterministic hashes) that differ from the reference outputs because the hash algorithm is not replicated in the Java mapper. Validation compares structural content, ignoring `globalKey` differences.

### 7.3 Test data

All fixture files are read from the classpath (copied from `data_to_learn_from/` into `src/test/resources/fixtures/`).

---

## 8. Validation Gates

| Gate | Description | Pass criteria |
|---|---|---|
| **G1: Maven compile** | `mvn compile` | Zero compilation errors |
| **G2: Unit test pass** | `mvn test` | All unit tests pass |
| **G3: Structural round-trip** | All 25 FpML fixtures → CDM JSON | All output JSONs are valid (parseable) and contain expected top-level keys (`trade`, `meta`) |
| **G4: Key field preservation** | Spot check fx-ex01 and fx-ex08 | `tradeDate`, `product.taxonomy`, quantities, exchange rate, payer/receiver present |
| **G5: No LLM call** | Source code audit | Zero imports of LLM-related classes; zero HTTP calls to model endpoints |
| **G6: No agent-workspace read** | Source code audit | Zero references to `agent-workspace` path; file reads only from classpath or test resources |
| **G7: JAR is self-contained** | `mvn package -DskipTests` | Generated JAR runs with `java -jar` on a clean JVM without extra classpath entries |

---

## 9. Unsupported Behavior (Known Gaps)

| Gap | Description | Mitigation |
|---|---|---|
| **G1: LEI enrichment** | CDM outputs frequently contain LEI identifiers not present in FpML. Java mapper does not perform LEI lookup. | These appear as `TENT-002` (tentative enrichment). Output may differ from reference CDM in party.partyId fields. Flag for analyst review. |
| **G2: GlobalKey generation** | Reference CDM outputs contain deterministic hash-based globalKey values. The Java mapper generates synthetic keys using a simpler algorithm. | Ignore globalKey differences in integration test validation. |
| **G3: Duplicate tradeIdentifier entries** | Reference CDM shows duplicate tradeIdentifier entries per TR-001. Java mapper emits one entry per FpML `partyTradeIdentifier`. | This is a known variant (`TENT-001`). Output structure remains valid CDM. |
| **G4: `fxOptionPremium` → `transferHistory`** | Reference CDM maps premium payment to a `transferHistory` entry (TENT-004). Java mapper does not emit `transferHistory`. | Premium amount is captured in the option payout but not as a separate transfer record. |
| **G5: Forward points composite** | fx-ex03, fx-ex06, fx-ex22, fx-ex23 include `spotRate`/`forwardPoints` composite price in CDM. Java mapper maps composite as a single rate value. | Partial composite support; may lose forward-points decomposition. |
| **G6: Barrier/digital observation schedule** | fx-ex12, fx-ex13 (barrier), fx-ex20, fx-ex21 (avg rate) involve complex observation schedules. Java mapper handles basic option fields only. | Complex observation/declaration logic is out of scope for this run. |
| **G7: FX Variance/Volatility Swap** | No FpML fixtures available; Rosetta functions exist but are not exercised. | Not in scope for this run. |

---

## 10. Traceability Requirements

| Requirement | Implementation |
|---|---|
| Each mapper class cites cookbook rule IDs | Javadoc on every mapping method includes rule IDs (e.g., `@see RULE-001`) |
| Every FpML field maps to exactly one CDM path | Source comment on each line of mapper code cites the FpML path |
| Evidence coverage is recorded | `planner-plan.md` (this document) lists all 25 supported fixtures and their mapping tier |
| Unsupported behavior is documented | Section 9 of this plan documents all gaps with known-gap markers in source code |
| Output CDM is valid JSON | Gate G3 validates all 25 output JSONs |
| No LLM at runtime | Gate G5 enforces zero LLM dependencies at runtime |
| No agent-workspace access | Gate G6 enforces runtime reads from classpath only |

---

## 11. Run Output Layout

```
generated/java-mapper-poc/runs/2026-05-01T17-17-54-084Z/
├── agent-workspace/
│   ├── 00-input-brief.md
│   ├── 00-product-scope.md
│   ├── 00-run-log.md
│   └── planner-plan.md          ← this document
└── generated/
    └── fx-derivatives-mapper/   ← Maven project (generated by coder)
        ├── pom.xml
        ├── src/main/java/.../
        ├── src/test/java/.../
        ├── src/test/resources/
        │   └── fixtures/          ← copied from data_to_learn_from/
        └── target/
            └── fx-derivatives-mapper-1.0.jar
```

---

## 12. Next Steps

1. **Coder role** generates the Maven project scaffold, domain model classes, and mapper implementations according to this plan.
2. Maven compile gate (G1) must pass before unit tests.
3. Unit test gate (G2) must pass with all 25 fixtures mapped.
4. If any gate fails, the repair role is invoked with a targeted failure report.
5. Upon all gates passing, `validate_generated_output` is called to produce the final validation report.
