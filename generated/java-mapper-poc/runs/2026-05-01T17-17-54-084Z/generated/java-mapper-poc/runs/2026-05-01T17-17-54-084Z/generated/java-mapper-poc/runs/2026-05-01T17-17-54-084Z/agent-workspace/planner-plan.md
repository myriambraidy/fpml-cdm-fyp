# Planner Plan — Run 2026-05-01T17-17-54-084Z

## Product Family: FX Derivatives

---

## 1. Scope Decision

### Supported Products (Runtime)

The following 8 product sub-types are selected for runtime mapper support. They each have evidence from matching FpML/CDM parallel pairs and a Rosetta source block reference. Each will get a dedicated Java mapper class and a JUnit test.

| # | Product | FpML Element | CDM productQualifier | Evidence Files | Rosetta Block |
|---|---|---|---|---|---|
| 1 | FX Spot | `fxSingleLeg` | `ForeignExchange_Spot_Forward` | fx-ex01, fx-ex02 | `MapFxSingleLegNonTransferableProduct` |
| 2 | FX Forward (NDF) | `fxSingleLeg` | `ForeignExchange_Spot_Forward` | fx-ex03–07 | `MapFxSingleLegNonTransferableProduct` |
| 3 | FX Swap | `fxSwap` | `ForeignExchange_Swap` | fx-ex08 | `MapFxSwapNonTransferableProduct` |
| 4 | FX European Vanilla Option | `fxSimpleOption` | `ForeignExchange_VanillaOption` | fx-ex09, fx-ex10 | `MapFxOptionNonTransferableProduct` |
| 5 | FX Non-Deliverable Option | `fxSimpleOption` | `ForeignExchange_VanillaOption` | fx-ex11 | `MapFxOptionNonTransferableProduct` |
| 6 | FX Barrier Option (single) | `fxSimpleOption` | `ForeignExchange_VanillaOption` | fx-ex12 | `MapFxOptionNonTransferableProduct` |
| 7 | FX Double-Barrier Option | `fxSimpleOption` | `ForeignExchange_VanillaOption` | fx-ex13 | `MapFxOptionNonTransferableProduct` |
| 8 | FX Euro Digital Option | `fxDigitalOption` | `ForeignExchange_DigitalOption` | fx-ex14–20 | `MapFxDigitalOptionNonTransferableProduct` |


### Observed but Unsupported Products

The following FX products exist in the evidence but lack sufficient mapping rules, Rosetta source blocks, or CDM parallel examples for this run. They are **not** included in the generated jar for this run and are recorded for future enhancement.

| Product | Reason for Exclusion |
|---|---|
| FX Variance Swap (`fxVarianceSwap`) | Rosetta block exists but no CDM parallel JSON found; evidence: `MapFxVarianceSwapNonTransferableProduct` |
| FX Volatility Swap (`fxVolatilitySwap`) | Rosetta block exists but no CDM parallel JSON found; evidence: `MapFxVolatilitySwapNonTransferableProduct` |
| FX Straddle (`fxSimpleOption` variant) | CDM parallel exists (fx-ex22) but no explicit Rosetta `MapFxStraddle*` block; only generic `fxOption` mapping |
| FX Delta Hedge (`fxSimpleOption` variant) | CDM parallel exists (fx-ex23) but no explicit Rosetta block; only generic `fxOption` mapping |
| Term Deposit (`termDeposit`) | CDM parallel exists (td-ex01, td-ex02) but FpML product is not an FX derivative; excluded per scope rules |
| One-touch / No-touch / Double barrier (ex16–19) | Covered by `fxDigitalOption` Rosetta block; included via rule RULE-003 productType mapping |
| FX Barrier Option (double, ex13) | Covered by `fxOption` generic block |

---

## 2. Java Package / Class Design

```
com.cdm.fpmlmapper
├── FpmlToCdmApplication.java          # Main entry point — Maven shade exec jar
├── MapperFactory.java                  # Dispatches FpML trade element → mapper
├── FpmlTradeMapper.java               # Interface
├── util/
│   ├── FpmlParser.java                 # Parse FpML XML → DOM/POJO
│   ├── DateUtils.java                  # Trim trailing 'Z', parse to ISO date
│   ├── PartyResolver.java              # Resolve partyReference href → Party1/Party2
│   ├── CdmWrapperBuilder.java          # Build meta, globalKey, trade scaffold
│   └── TaxonomyResolver.java           # Map productType string → CDM taxonomy name
└── product/
    ├── FxSingleLegMapper.java          # fxSingleLeg → spot/forward/NDF
    ├── FxSwapMapper.java               # fxSwap → FX swap
    ├── FxOptionMapper.java             # fxSimpleOption → vanilla + barrier
    └── FxDigitalOptionMapper.java      # fxDigitalOption → euro digital
```

---

## 3. Mapping Responsibilities

### 3.1 Common Scaffold (all products)

All mappers delegate to shared utility classes for:

| Responsibility | Class | Rule Reference |
|---|---|---|
| Parse FpML XML | `FpmlParser` | — |
| Trade identifier → `assignedIdentifier.value` | each mapper | `RULE-001` |
| Trade date → `tradeDate.value` (trim 'Z') | `DateUtils` | `RULE-002` |
| Party reference href → CDM Party1/Party2 | `PartyResolver` | `TR-001` |
| Taxonomy → CDM `productQualifier` | `TaxonomyResolver` | `RULE-003` |
| Wrap output with `meta.globalKey` | `CdmWrapperBuilder` | — |

### 3.2 Product-Specific Mapping

#### FxSingleLegMapper (`fxSingleLeg` → CDM)
- Map `exchangedCurrency1/2.paymentAmount` → `tradeLot.priceQuantity[].quantity[]` (value + currency unit)
- Map `exchangeRate.quotedCurrencyPair` → price (rate + unit/perUnitOf)
- Map `exchangeRate.spotRate` + `forwardPoints` → composite price
- Map `valueDate` → `settlementTerms.settlementDate.valueDate`
- Settlement type: default to `Cash`
- Taxonomy: `ForeignExchange_Spot_Forward` (spot/forward/NDF share same CDM qualifier)
- TR-004: PaymentAmount → Quantity with currency unit
- TR-005: Split settlement → single aggregated quantity

#### FxSwapMapper (`fxSwap` → CDM)
- Map each `fxSingleLeg` inside `fxSwap.fxSingleLeg[]` → one `tradeLot.priceQuantity[]` entry
- Map both leg exchange rates as separate price entries
- Map `fxSwap.productType` → taxonomy name
- Build two `SettlementPayout` entries (leg 1: payer=Party2, leg 2: payer=Party1)
- Settlement date per leg from each `valueDate`

#### FxOptionMapper (`fxSimpleOption` → CDM)
- Map `buyerPartyReference` / `sellerPartyReference` → `buyerSeller`
- Map `putCurrencyAmount` / `callCurrencyAmount` → `quantity[]`
- Map `fxStrikePrice` → `strike.strikePrice` (rate + unit/perUnitOf)
- Map `exerciseStyle` → `exerciseTerms.style`
- Map `expiryDateTime.expiryDate` → `adjustableDate.adjustedDate.value` (TR-003)
- Map `expiryDateTime.expiryTime.hourMinuteTime` → `expirationTime.hourMinuteTime` (TR-003)
- Map `expiryDateTime.businessCenter` → `expirationTime.businessCenter` (TR-003)
- Map `expiryDateTime.cutName` → `expirationTimeType = SpecificTime`
- Map `fxOptionPremium.payerPartyReference/receiverPartyReference` → premium payer/receiver
- Map `premiumAmount` → `transferHistory[0].transfer.quantity` (value + currency)
- Map `premiumSettlementDate` → `settlementDate`
- Map `valueDate` → `settlementTerms.settlementDate.valueDate`
- Map `putCurrencyAmount` → `optionType: Put` or `Call`
- Handle barrier features via `exerciseTerms.barrier` when present (fx-ex12, fx-ex13)

#### FxDigitalOptionMapper (`fxDigitalOption` → CDM)
- Map `fxDigitalOption.productType` → taxonomy name (RULE-003)
- Map `effectiveDateTime.effectiveDate` → `effectiveDate`
- Map `expiryDateTime` → `exerciseTerms.expiration` (TR-003)
- Map `fxDigitalOptionbuyerPartyReference/sellerPartyReference` → `buyerSeller`
- Map payment amounts → quantities
- Map `digitalBarrier` → CDM barrier terms
- Map `observationEventType` → `observationTerms`

---

## 4. Tests

| Test | FpML Source | Checks |
|---|---|---|
| `FxSingleLegMapperSpotTest` | fx-ex01-fx-spot.xml | Rate, both quantities, party roles, settlement date |
| `FxSingleLegMapperFwdTest` | fx-ex03-fx-fwd.xml | Forward rate, value date, quantities |
| `FxSingleLegMapperNdfTest` | fx-ex07-non-deliverable-forward.xml | NDF-specific fields, non-deliverable flag |
| `FxSwapMapperTest` | fx-ex08-fx-swap.xml | Two legs, two prices, two settlement dates |
| `FxOptionMapperEuropeanTest` | fx-ex09-euro-opt.xml | Expiry, strike, premium, buyer/seller |
| `FxOptionMapperAmericanTest` | fx-ex10-amer-opt.xml | American exercise style |
| `FxOptionMapperNdfOptionTest` | fx-ex11-non-deliverable-option.xml | NDF option fields |
| `FxOptionMapperBarrierTest` | fx-ex12-fx-barrier-option.xml | Barrier terms present |
| `FxDigitalOptionMapperTest` | fx-ex14-euro-digital-option.xml | productType taxonomy, expiry, digital barrier |

Each test verifies:
1. CDM JSON is parseable and non-null
2. `trade.product.taxonomy[0].productQualifier` matches expected value
3. `trade.tradeDate.value` equals expected date
4. `trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value` is present
5. `trade.counterparty` contains exactly two entries with Party1/Party2
6. `trade.tradeLot[0].priceQuantity[0].quantity` is non-empty

---

## 5. Validation Gates

| Gate | Criterion | Fail Action |
|---|---|---|
| Maven compile | `mvn compile` exits with code 0 | Block generation |
| Maven test | `mvn test` all green | Block generation |
| CDM JSON parseability | All generated JSON files parse as valid CDM | Mark test FAILED |
| Taxonomy presence | All generated CDM has `product.taxonomy[0].productQualifier` | Mark test FAILED |
| TradeDate trimmed | All `tradeDate.value` values lack trailing 'Z' | Apply DateUtils fix |
| Party roles | All generated CDM has exactly two counterparty entries | Apply PartyResolver fix |
| TradeIdentifier | All generated CDM has at least one `assignedIdentifier.identifier.value` | Apply mapper fix |
| Quantities | All generated CDM has at least one `priceQuantity.quantity` | Apply mapper fix |
| No LLM call | Source code contains zero LLM API references | Hard block |
| No agent workspace read | Source code contains zero reads of `agent-workspace` paths | Hard block |

---

## 6. Unsupported Behavior

| Pattern | Current Behavior | Required for Support |
|---|---|---|
| LEI enrichment for party identifiers | Not generated by mapper | Requires external LEI lookup service |
| Duplicate tradeIdentifier entries | Mapper emits one entry per FpML `partyTradeIdentifier` | Post-processing de-duplication step needed |
| Barrier level observation schedule (ex20–21 avg rate) | Not handled | Requires observation schedule builder |
| FX Straddle / Delta Hedge mapping | Not handled | Needs specific Rosetta `MapFxStraddle*` block |
| Variance/Volatility swap | Not handled | No CDM parallel evidence for this run |
| Term Deposit (non-FX) | Out of scope | Excluded |

---

## 7. Traceability Requirements

- Every mapper class Javadoc must cite the source cookbook rule ID(s) it implements
- Generated CDM JSON metadata comments include: source FpML file name, rule IDs applied, and run timestamp
- Test class Javadoc must cite the fixture FpML file and expected CDM file
- `planner-plan.md` in the run output dir records: supported products, unsupported products, package design, mapping rules applied, test plan, and validation gates
- All rule IDs referenced in mapper code must match those in `data/agent-cookbook/latest/references/fx-derivatives.evidence.json`

---

## 8. Run Output Structure

```
generated/java-mapper-poc/runs/2026-05-01T17-17-54-084Z/
├── generated/
│   └── java-mapper-poc/
│       └── runs/
│           └── 2026-05-01T17-17-54-084Z/
│               ├── agent-workspace/       # This run's workspace (NOT read at runtime)
│               │   ├── planner-plan.md    # This plan
│               │   └── 00-run-log.md
│               └── java-mapper-fx/
│                   ├── pom.xml
│                   └── src/
│                       ├── main/java/com/cdm/fpmlmapper/
│                       └── test/java/com/cdm/fpmlmapper/
│                           └── fixtures/
│                               ├── fx-ex01-fx-spot.xml
│                               └── ... (all fixture XMLs)
├── reported/
│   └── validation-report.json
└── accepted/
    └── report.md
```

---

## 9. Generation Instruction for Next Role

The **generator** role must:
1. Create the Maven project at `generated/java-mapper-poc/runs/2026-05-01T17-17-54-084Z/generated/java-mapper-poc/runs/2026-05-01T17-17-54-084Z/java-mapper-fx/`
2. Generate `pom.xml` with dependencies: Jackson (XML + JSON), JUnit 5, Gson
3. Generate all Java mapper classes as per the package design above
4. Generate all test classes with the fixture XML files
5. Run `mvn compile` then `mvn test`
6. Apply fixes until all validation gates pass
7. Run `validate_generated_output`
8. Write `accepted/report.md` and `reported/validation-report.json`
9. Update `00-run-log.md`

---

*Plan authored by: planner role — Run 2026-05-01T17-17-54-084Z*
*Planning round: 1/3*
