# Planner Plan — FX Derivatives

**Run id:** 2026-05-01T17-28-07-939Z  
**Planning round:** 1 of 3  
**Status:** ACCEPTED

---

## Evidence Inspection Summary

### Evidence Folders Inspected

| Folder | Contents |
|--------|----------|
| `data_to_learn_from/fpml/fx-derivatives/` | 25 XML fixtures (fx-ex01–fx-ex23 + td-ex01–02) |
| `data_to_learn_from/cdm_parallel/fx-derivatives/` | 25 JSON expected outputs (1:1 with XML) |
| `data/agent-cookbook/latest/product-families/fx-derivatives.md` | 5 stable rules, 6 repeated transformations, 7 open questions |
| `data/agent-cookbook/latest/references/fx-derivatives.evidence.json` | Quality score 9.8, semantic success rate 100% |
| `data/rosetta-source/latest/docs/product-families/fx.md` | FX Rosetta pack with shared-ingest.md |
| `data/rosetta-source/latest/extracted/blocks.json` | Raw Rosetta ingest functions |
| `data/agent-cookbook/latest/global/` | 7 cross-family global guides |


### Fixture Inventory (25 products)

All 25 fixtures have paired CDM expected outputs.

| Fixture | Product Type | FpML Trade Element |
|---------|-------------|-------------------|
| `fx-ex01-fx-spot.xml` | FX Spot | `fxSingleLeg` |
| `fx-ex02-spot-cross-w-side-rates.xml` | FX Spot (cross with side rates) | `fxSingleLeg` |
| `fx-ex03-fx-fwd.xml` | FX Forward | `fxSingleLeg` |
| `fx-ex04-fx-fwd-w-settlement.xml` | FX Forward (with settlement) | `fxSingleLeg` |
| `fx-ex05-fx-fwd-w-ssi.xml` | FX Forward (with SSI) | `fxSingleLeg` |
| `fx-ex06-fx-fwd-w-splits.xml` | FX Forward (with splits) | `fxSingleLeg` |
| `fx-ex07-non-deliverable-forward.xml` | NDF | `fxSingleLeg` + `nonDeliverableForward` |
| `fx-ex08-fx-swap.xml` | FX Swap | `fxSwap` |
| `fx-ex09-euro-opt.xml` | FX European Option | `fxSimpleOption` |
| `fx-ex10-amer-opt.xml` | FX American Option | `fxSimpleOption` |
| `fx-ex11-non-deliverable-option.xml` | NDO | `fxSimpleOption` |
| `fx-ex12-fx-barrier-option.xml` | FX Barrier | `fxBarrierOption` |
| `fx-ex13-fx-dbl-barrier-option.xml` | FX Double Barrier | `fxBarrierOption` |
| `fx-ex14-euro-digital-option.xml` | Euro Digital | `fxDigitalOption` |
| `fx-ex15-euro-range-digital-option.xml` | Euro Range Digital | `fxDigitalOption` |
| `fx-ex16-one-touch-option.xml` | One-Touch | `fxDigitalOption` |
| `fx-ex17-no-touch-option.xml` | No-Touch | `fxDigitalOption` |
| `fx-ex18-double-one-touch-option.xml` | Double One-Touch | `fxDigitalOption` |
| `fx-ex19-double-no-touch-option.xml` | Double No-Touch | `fxDigitalOption` |
| `fx-ex20-avg-rate-option-parametric.xml` | Avg Rate Parametric | `fxSimpleOption` |
| `fx-ex21-avg-rate-option-specific.xml` | Avg Rate Specific | `fxSimpleOption` |
| `fx-ex22-straddle.xml` | FX Straddle | `fxSimpleOption` |
| `fx-ex23-delta-hedge.xml` | FX Delta Hedge | `fxSimpleOption` |
| `td-ex01-simple-term-deposit.xml` | Term Deposit | `termDeposit` |
| `td-ex02-term-deposit-w-settlement-etc.xml` | Term Deposit (complex) | `termDeposit` |

---

## Supported Products for This Run

**Supported (25/25 fixtures):** All FX derivatives fixtures in the evidence folder.

The cookbook reports **100% semantic success rate** across all 25 paired examples.
Every product type has Rosetta ingest function coverage:

| FpML Element | Rosetta Ingest File | Covered |
|-------------|-------------------|---------|
| `fxSingleLeg` | `ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | ✅ |
| `fxSwap` | `ingest-fpml-confirmation-product-fxswap-func.rosetta` | ✅ |
| `fxSimpleOption` | `ingest-fpml-confirmation-product-fxoption-func.rosetta` | ✅ |
| `fxBarrierOption` | same as `fxSimpleOption` + feature mapping | ✅ |
| `fxDigitalOption` | `ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | ✅ |
| `fxVarianceSwap` | `ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | ✅ |
| `fxVolatilitySwap` | `ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | ✅ |
| `termDeposit` | shared ingest via settlement/payment | ⚠️ partial |

**Note on term deposit (td-ex01/02):** These products are in the fx-derivatives folder but use `termDeposit` FpML structure. No dedicated Rosetta ingest file was found for `termDeposit` under `fx-derivatives`. They are treated as observed-but-unsupported for this run.

---

## Observed but Unsupported FX Products

| Product | Reason | Evidence |
|---------|--------|----------|
| Term Deposit (`td-ex01`, `td-ex02`) | No Rosetta ingest function found for `termDeposit` in FX Rosetta pack; shared ingest provides partial coverage for settlement/payment but product-level mapping is unconfirmed | `td-ex01-simple-term-deposit.xml`, `td-ex02-term-deposit-w-settlement-etc.xml` present in fixtures but no `ingest-fpml-confirmation-product-termdeposit*` file listed |
| FX Variance Swap | No fixture in current set (covered by Rosetta but not in XML fixtures) | Rosetta file exists but not exercised by a fixture |
| FX Volatility Swap | No fixture in current set | Rosetta file exists but not exercised by a fixture |

---

## Mapping Rules to Implement

### Stable Rules (5)

| Rule ID | Name | Source | Target |
|---------|------|--------|--------|
| RULE-001 | Trade identifier -> assignedIdentifier.value | `tradeHeader.partyTradeIdentifier.tradeId` | `trade.tradeIdentifier.assignedIdentifier.identifier.value` |
| RULE-002 | Trade date normalization (trim 'Z') | `tradeHeader.tradeDate` | `trade.tradeDate.value` |
| RULE-003 | Option product type -> CDM taxonomy name | `fxDigitalOption.productType` | `trade.product.taxonomyName.value` |
| RULE-004 | Expiry date/time/businessCenter -> exerciseTerms.expiration | `expiryDateTime.expiryDate/expiryTime` | `exerciseTerms.expiration.adjustedDate.value` |
| RULE-005 | PaymentAmount -> Quantity (value + currency unit) | `exchangedCurrencyX.paymentAmount` | `trade.tradeLot.quantity.value/unit.currency.value` |

### Repeated Transformations (6)

| TR ID | Name | Notes |
|-------|------|-------|
| TR-001 | Party href resolution | FpML partyReference hrefs -> CDM Party1/Party2 |
| TR-002 | Date normalization (trim 'Z') | Consistent with RULE-002 |
| TR-003 | Expiry date/time -> exerciseTerms | Consistent with RULE-004 |
| TR-004 | PaymentAmount -> Quantity | Consistent with RULE-005 |
| TR-005 | FX rate -> exchangeRate (rate + currency pair) | From Rosetta `MapFxRate`, `MapQuotedCurrencyPair` |
| TR-006 | Settlement terms mapping | Settlement type, date, instructions |

### Global Rules to Apply

| Source | Purpose |
|--------|---------|
| `shared-ingest.md` | Date wrappers, settlement scaffolding, payment, price/quantity |
| `identifier-handling.md` | Scheme-aware string mapping |
| `enrichment-and-defaults.md` | FLAG-ENR for suspect enrichments |
| `party-reference-resolution.md` | TR-001 caveats + VAR-002 role inversion flag |
| `quantity-and-unit-normalization.md` | Unit + currency normalization |
| `temporal-normalization.md` | Date/timezone normalization |

---

## Java Package / Class Design

### Project Structure

```
fpml-cdm-fx-mapper/
├── pom.xml
├── src/main/java/com/fpml/cdm/fx/
│   ├── FxMapperApplication.java           # Main entry (no LLM call, no workspace read)
│   ├── FpmlDocumentFactory.java           # Parse FpML XML -> DOM
│   ├── mapper/
│   │   ├── FxSingleLegMapper.java         # fxSingleLeg -> CDM
│   │   ├── FxSwapMapper.java              # fxSwap -> CDM
│   │   ├── FxOptionMapper.java            # fxSimpleOption -> CDM
│   │   ├── FxBarrierOptionMapper.java     # fxBarrierOption -> CDM
│   │   └── FxDigitalOptionMapper.java     # fxDigitalOption -> CDM
│   ├── context/
│   │   ├── TradeContext.java              # Shared trade scaffolding (meta, tradeDate, tradeIdentifier)
│   │   ├── PartyContext.java             # Party resolution + roles
│   │   └── SettlementContext.java         # Settlement terms
│   ├── transform/
│   │   ├── DateTransform.java             # Trim trailing 'Z', date wrapper
│   │   ├── PartyTransform.java            # Href resolution, Party1/Party2 assignment
│   │   ├── RateTransform.java             # FX rate + quoted currency pair
│   │   ├── QuantityTransform.java         # PaymentAmount -> Quantity
│   │   └── TaxonomyTransform.java         # Product type -> taxonomy name
│   └── model/
│       ├── CdmTrade.java                  # CDM Trade root model (plain POJO)
│       ├── CdmParty.java
│       ├── CdmPayout.java
│       └── CdmQuantity.java
└── src/test/java/com/fpml/cdm/fx/
    ├── FxSingleLegMapperTest.java        # Tests for fx-ex01, fx-ex02, fx-ex03
    ├── FxSwapMapperTest.java              # Tests for fx-ex08
    ├── FxOptionMapperTest.java            # Tests for fx-ex09, fx-ex10
    ├── FxBarrierOptionMapperTest.java     # Tests for fx-ex12, fx-ex13
    └── FxDigitalOptionMapperTest.java     # Tests for fx-ex14–fx-ex19
```


### Design Constraints

- **No LLM calls at runtime.** All mapping logic is hard-coded.
- **No workspace reads at runtime.** The mapper only reads input XML and produces CDM JSON.
- **Deterministic.** Same input always produces identical output.
- **POJO models.** Use plain Java objects for CDM output (no CDM JAR dependency required). Target JSON key paths that match CDM expected output structure.
- **Validation gate.** Each test parses the generated CDM JSON and verifies required fields are present.

---

## Test Plan


| Test Class | Fixtures Covered | What It Validates |
|-----------|-----------------|-------------------|
| `FxSingleLegMapperTest` | fx-ex01–fx-ex07 | Spot, Fwd, NDF: tradeDate, valueDate, exchangeRate, quantities, payer/receiver |
| `FxSwapMapperTest` | fx-ex08 | FX Swap: two legs, both leg exchangeRates |
| `FxOptionMapperTest` | fx-ex09–fx-ex11, fx-ex20–fx-ex23 | European/American/NDO/Straddle/DeltaHedge: expiry, strike, premium, exerciseStyle |
| `FxBarrierOptionMapperTest` | fx-ex12–fx-ex13 | Barrier params: barrierType, triggerRate, informationSource |
| `FxDigitalOptionMapperTest` | fx-ex14–fx-ex19 | Digital options: productType -> taxonomyName, expiry, barrierLevelDetails |

**Test assertions (per fixture):**
1. Trade date is parsed without trailing 'Z'
2. Each exchangedCurrency has a quantity with value and currency
3. Exchange rate is populated with value and currency pair
4. Party roles (Party1/Party2) are assigned from party references
5. Product taxonomy name is present for options
6. Payer/receiver directions match FpML source

---

## Validation Gates


| Gate | Pass Criterion |
|------|---------------|
| `mvn compile` | No compilation errors |
| `mvn test` | All unit tests pass |
| `mvn verify -DskipITs=false` | All integration tests pass |
| CDM JSON structural validation | Required top-level keys present: `trade.meta`, `trade.tradeDate`, `trade.tradeIdentifier`, `trade.party`, `trade.product`, `trade.tradeLot` |
| Semantic validation | For each fixture: required product-specific fields are non-null |
| No LLM call verification | Unit test that asserts mapper classes do not reference LLM APIs |
| No workspace read verification | Unit test that asserts no file reads outside test resources |

---

## Unsupported Behavior


| Category | Behavior | Disposition |
|----------|----------|-------------|
| Term Deposit (td-ex01, td-ex02) | `termDeposit` FpML element | Logged as observed-but-unsupported; skipped in this run |
| FX Variance Swap | No fixture in evidence | Skipped; Rosetta file exists for future use |
| FX Volatility Swap | No fixture in evidence | Skipped; Rosetta file exists for future use |
| Buyer/seller role inversion | TR-001 + VAR-002 caveats | Flagged for analyst review; direction logged |
| Enrichment without source | Any CDM field not in FpML | Flagged with `FLAG-ENR` comment; logged to validation report |
| Split settlement aggregation | PaymentAmount merging behavior | Caveat noted; first-cut uses direct 1:1 mapping |

---

## Traceability Requirements

| Requirement | Implementation |
|-------------|-----------------|
| Rule provenance | Each mapper method includes `@see fx-derivatives:RULE-###` javadoc tag |
| Fixture traceability | Test names encode fixture file: `testFxEx01_fxSpot()` |
| Evidence citation | `planner-plan.md` line items reference cookbook rule IDs |
| CDM field origin | CDM output JSON includes optional `_sourcePath` comment field for top-level mapped values |
| Open question tracking | Each TR/TENT with caveat is listed in `UNSUPPORTED_BEHAVIOR.md` in the generated project |
| Run log | `00-run-log.md` updated at end of run with outcomes |

---

## Planning Round 1 Outcome

| Decision | Value |
|----------|-------|
| **Planning round** | 1 of 3 |
| **Plan status** | ACCEPTED |
| **Supported products** | 25 fx-derivatives fixtures (all spot, fwd, swap, option, digital option, barrier products) |
| **Observed but unsupported** | Term Deposit (td-ex01/02), FX Variance Swap, FX Volatility Swap |
| **Mapper classes** | 5 product mappers + 4 transforms + 1 factory |
| **Test classes** | 5 test classes covering all supported products |
| **Open questions** | 7 from cookbook (role inversion, business center handling, normalization edge cases) |
| **Next action** | Proceed to Java code generation |

---

*Plan accepted by planner. Forward to code generator.*
