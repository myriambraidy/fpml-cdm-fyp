# Planner Plan — FX Derivatives Generator Run

**Run id:** `2026-05-01T17-28-07-939Z`  
**Product family:** `fx-derivatives`  
**Planning round:** 1  
**Status:** Draft for review

---

## 1. Evidence Inspected

| Source | Items | Purpose |
|---|---|---|
| `data_to_learn_from/fpml/fx-derivatives/` | 25 XML fixtures | FpML structural patterns and field paths |
| `data_to_learn_from/cdm_parallel/fx-derivatives/` | 25 JSON fixtures | CDM target structure |
| `data/agent-cookbook/latest/product-families/fx-derivatives.md` | 5 stable rules, 6 repeated TRs, 9 tentative patterns | Mapping rule provenance |
| `data/agent-cookbook/latest/references/fx-derivatives.evidence.json` | 25 semantic pairs | Confidence and coverage scores |
| `data/rosetta-source/latest/docs/product-families/fx.md` + rosetta-source FX func files | Rosetta block index | CDM type/model reference |
| `data/agent-cookbook/latest/global/*.md` | Shared enrichment, wrapper, party, date rules | Cross-cutting guidance |

---

## 2. Supported FX Products (Runtime-Ready)

Products listed here have: (a) both FpML fixture and CDM parallel fixture evidence, (b) Rosetta block support identified, and (c) stable cookbook mapping rules covering their core fields.

| # | FpML Product | CDM Product | Evidence Files | Cookbook Rules |
|---|---|---|---|---|
| 1 | `fxSingleLeg` — FX Spot | `ForeignExchange_Spot` | fx-ex01, fx-ex02 | RULE-001, RULE-002, TR-001, TR-004 |
| 2 | `fxSingleLeg` — FX Forward | `ForeignExchange_Forward` | fx-ex03, fx-ex04, fx-ex05, fx-ex06 | RULE-001, RULE-002, TR-001, TR-004 |
| 3 | `fxSingleLeg` — NDF | `ForeignExchange_NonDeliverableForward` | fx-ex07 | RULE-001, RULE-002, TR-001, TR-004, NDF-specific fixing TR |
| 4 | `fxSwap` | `ForeignExchange_Swap` | fx-ex08 | RULE-001, RULE-002, TR-001, TR-004 |
| 5 | `fxSimpleOption` — European | `ForeignExchange_Option` (European) | fx-ex09 | RULE-001, RULE-003, RULE-004, TR-001, TR-003 |
| 6 | `fxSimpleOption` — American | `ForeignExchange_Option` (American) | fx-ex10 | RULE-001, RULE-003, RULE-004, TR-001, TR-003 |
| 7 | `fxDigitalOption` — Euro Digital | `ForeignExchange_DigitalOption` | fx-ex14, fx-ex16 | RULE-001, RULE-003, RULE-004, TR-001, TR-003 |
| 8 | `fxDigitalOption` — Range Digital | `ForeignExchange_DigitalOption` | fx-ex15 | RULE-001, RULE-003, RULE-004, TR-001, TR-003 |
| 9 | `fxDigitalOption` — One-Touch / No-Touch | `ForeignExchange_DigitalOption` | fx-ex17, fx-ex18, fx-ex19 | RULE-001, RULE-003, RULE-004, TR-001, TR-003 |
| 10 | `fxDigitalOption` — Average Rate | `ForeignExchange_AverageRateOption` | fx-ex20, fx-ex21 | RULE-001, RULE-003, RULE-004, TR-001, TR-003 |
| 11 | `fxDigitalOption` — Straddle | `ForeignExchange_Straddle` | fx-ex22 | RULE-001, RULE-003, RULE-004, TR-001, TR-003 |

---

## 3. Observed Unsupported FX Products

These products appear in the FX derivatives evidence folder and were observed during inspection, but **no runtime mapper or tests will be generated** for them in this run. Each is recorded here for traceability.

| # | FpML Product | Evidence File | Reason for Unsupported |
|---|---|---|---|
| A | `fxBarrierOption` (single barrier) | fx-ex12 | Barrier trigger mapping has no stable cookbook rule; Rosetta block exists but evidence is thin (0 full semantic pairs in fx-derivatives evidence; barrier-specific TRs are tentative only) |
| B | `fxDigitalOption` — double barrier | fx-ex13 | Double-barrier knock-in/out mapping has no stable rule; complex barrier schedule structure not covered by cookbook |
| C | `fxSimpleOption` — NDO | fx-ex11 | Non-deliverable option variant; NDF fixing logic exists (fx-ex07) but NDO-specific expiry/payout structure lacks cookbook coverage |
| D | `fxSimpleOption` — delta hedge | fx-ex23 | Delta-hedge instrument type is an execution strategy, not a primary product; not modeled in CDM parallel fixture with full semantic mapping |
| E | `TermDeposit` | td-ex01, td-ex02 | Term deposit is a money-market product, not an FX derivative per the `fx-derivatives` product family scope; excluded by scope boundary |

---

## 4. Core Structural Mapping (All Products)

Every supported FX product will apply these shared mapping steps before product-specific logic:

```
FpML                          ->  CDM
---------------------------------------------------------------------------
header.conversationId        ->  meta.globalKey (enrichment — TR flagged)
header.messageId             ->  (discarded / logged)
header.creationTimestamp     ->  (discarded / logged)
trade.tradeHeader.tradeDate  ->  trade.tradeDate.value  (TR-002: trim 'Z')
trade.tradeHeader.partyTradeIdentifier[].tradeId
                              ->  trade.tradeIdentifier[].assignedIdentifier[].identifier.value
                              (RULE-001: copy value; scheme may differ — review)
trade.tradeHeader.partyTradeIdentifier[].partyReference
                              ->  trade.counterparty[].role (=Party1/Party2)
                              ->  trade.counterparty[].partyReference.externalReference (=href)
                              (TR-001: resolve hrefs to CDM Party roles)
party[].partyId              ->  trade.party[].partyId[].identifier.value
party[].partyName            ->  trade.party[].name.value
```

---

## 5. Product-Specific Mapping Logic

### 5.1 FX Spot (fxSingleLeg, no forward points)

```
FpML                                         ->  CDM
---------------------------------------------------------------------------
fxSingleLeg.exchangedCurrency1                ->  trade.tradeLot[0].priceQuantity[0].quantity[0]
  .payerPartyReference / .receiverPartyReference
                                             ->  SettlementPayout.payerReceiver
  .paymentAmount.currency                    ->  .quantity.unit.currency.value
  .paymentAmount.amount                      ->  .quantity.value
fxSingleLeg.exchangedCurrency2               ->  trade.tradeLot[0].priceQuantity[0].quantity[1]
  (same payer/receiver mapping)
  .paymentAmount.currency                    ->  .quantity.unit.currency.value
  .paymentAmount.amount                      ->  .quantity.value
fxSingleLeg.valueDate                        ->  SettlementPayout.settlementTerms.settlementDate.valueDate
                                             (TR-002: trim 'Z')
fxSingleLeg.exchangeRate.quotedCurrencyPair  ->  Price.schedule[0].value.perUnitOf.currency
                                             + observable.Asset.Cash
fxSingleLeg.exchangeRate.rate                 ->  Price.schedule[0].value.value (ExchangeRate)
fxSingleLeg.exchangeRate.spotRate            ->  (discarded — derived in CDM)
fxSingleLeg.exchangeRate.forwardPoints       ->  (discarded — not present in spot)
```

### 5.2 FX Forward (fxSingleLeg, with valueDate > spot)
Same as FX Spot, plus:
```
fxSingleLeg.valueDate                        ->  SettlementPayout.settlementTerms.settlementDate.valueDate
                                             (forward value date; TR-002 applied)
fxSingleLeg.exchangeRate.forwardPoints       ->  (informational; rate field captures all-in forward rate)
```

### 5.3 NDF (fxSingleLeg + nonDeliverableForward)
Same as FX Forward, plus:
```
fxSingleLeg.nonDeliverableForward            ->  SettlementPayout.settlementTerms.settlementType = Cash
  .settlementCurrency                        ->  (derived from exchangedCurrency2 currency)
  .fixing.rateSource / .rateSourcePage        ->  observable informationSource
  .fixing.fixingDate                         ->  settlementDate derivation source
```

### 5.4 FX Swap (fxSwap, two fxSingleLeg entries)
```
fxSwap.fxSingleLeg[0] (near leg)             ->  trade.product.economicTerms.payout[0]
fxSwap.fxSingleLeg[1] (far leg)             ->  trade.product.economicTerms.payout[1]
  (each leg: same quantity/price/rate mapping as fxSingleLeg)
fxSwap.productType                           ->  trade.product.taxonomy (FXSwap qualifier)
```

### 5.5 FX Option (fxSimpleOption — European and American)
```
FxOption.productType                        ->  taxonomy (call/put derived from strikeQuoteBasis)
FxOption.buyerPartyReference / .sellerPartyReference
                                             ->  OptionPayout.payerReceiver
FxOption.expiryDateTime.expiryDate          ->  exerciseTerms.expiration.adjustableDate.adjustedDate.value
                                             (TR-002: trim 'Z')
FxOption.expiryDateTime.expiryTime          ->  exerciseTerms.expirationTime.hourMinuteTime
FxOption.expiryDateTime.businessCenter      ->  exerciseTerms.expirationTime.businessCenter.value
                                             (RULE-004)
FxOption.exerciseStyle                     ->  exerciseTerms.exerciseStyle
FxOption.fxStrikePrice.rate                 ->  OptionPayout.strikeSchedule
FxOption.fxStrikePrice.strikeQuoteBasis     ->  price.perUnitOf
FxOption.putCurrencyAmount / .callCurrencyAmount
                                             ->  OptionPayout.underlier (quantity references)
                                             (TR-004: PaymentAmount -> Quantity)
FxOption.valueDate                          ->  SettlementPayout.settlementDate.valueDate
FxOption.fxOptionPremium                    ->  Separate premium mapping (cash settlement payout)
  .premiumAmount.currency                    ->  premium quantity unit
  .premiumAmount.amount                      ->  premium quantity value
  .premiumSettlementDate                    ->  premium settlement date
  .settlementInstruction                    ->  (informational; payment routing)
```

### 5.6 FX Digital Option (fxDigitalOption — Euro, Range, Touch, Average)
```
FxDigitalOption.productType                 ->  trade.product.taxonomyName.value
                                             (RULE-003: normalize label to CDM taxonomy)
FxDigitalOption.buyerPartyReference / .sellerPartyReference
                                             ->  OptionPayout.payerReceiver
FxDigitalOption.expiryDateTime              ->  exerciseTerms.expiration (same as FxOption)
                                             (RULE-004, TR-003)
FxDigitalOption.fxDigitalBarrier            ->  OptionPayout.feature.barrier
  .fxBarrierType / .triggerRate / .quotedCurrencyPair
                                             ->  barrier type + level
  .informationSource                         ->  observable informationSource
FxDigitalOption.fxAverageRateFixing         ->  ObservationSchedule for avg-rate options
                                             (fx-ex20, fx-ex21)
```

---

## 6. Java Package and Class Design

```
com.fpmlcdm.mapper
├── FpmlCdmMapperApplication.java       # Main entry point; reads FpML, writes CDM JSON
├── mapper/
│   ├── FpmlCdmMapper.java              # Orchestrator: parse FpML -> dispatch to product mapper
│   ├── FpmlHeaderMapper.java           # header fields -> CDM meta (discarded fields logged)
│   ├── FpmlTradeHeaderMapper.java      # trade identifiers, trade date -> CDM trade.base
│   ├── FpmlPartyMapper.java            # partyId/partyName -> CDM party entries + roles
│   │
│   ├── FxSpotMapper.java               # fxSingleLeg spot -> CDM ForeignExchange_Spot
│   ├── FxForwardMapper.java            # fxSingleLeg forward (valueDate > spot) -> CDM
│   ├── FxNdfMapper.java                # fxSingleLeg + nonDeliverableForward -> CDM NDF
│   ├── FxSwapMapper.java               # fxSwap (2 legs) -> CDM ForeignExchange_Swap
│   ├── FxVanillaOptionMapper.java      # fxSimpleOption -> CDM OptionPayout
│   ├── FxDigitalOptionMapper.java      # fxDigitalOption -> CDM DigitalOptionPayout
│   └── FxAverageRateOptionMapper.java  # fxDigitalOption (avg-rate variant) -> CDM
│
├── model/
│   ├── CdmTrade.java                   # CDM trade root envelope
│   ├── CdmParty.java                  # CDM party entry
│   ├── CdmIdentifier.java             # CDM tradeIdentifier + assignedIdentifier
│   ├── CdmQuantity.java               # quantity with unit.currency
│   ├── CdmPrice.java                  # price with unit.currency and ExchangeRate type
│   ├── CdmSettlement.java             # settlementTerms + settlementDate
│   ├── CdmPayout.java                 # SettlementPayout or OptionPayout
│   ├── CdmExerciseTerms.java          # expiration date/time/businessCenter
│   └── CdmTaxonomy.java               # taxonomy source + productQualifier
│
├── util/
│   ├── DateUtils.java                  # trimTrailingZ(date), toIsoDate()
│   ├── CurrencyUtils.java              # normalizeCurrency(code)
│   ├── PartyResolver.java             # resolvePartyHref(partyReference) -> Party1/Party2
│   ├── StringUtils.java               # normalizeProductType(label) -> taxonomy string
│   └── GlobalKeyGenerator.java         # deterministic key generation for CDM globalKey
│
└── validation/
    └── CdmOutputValidator.java        # schema-agnostic structural checks on generated CDM
```

**Key design decisions:**
- No LLM calls at runtime — all mapping is deterministic Java logic.
- Each product type has a dedicated mapper class following a shared `FxProductMapper` interface.
- Utilities are pure functions; `PartyResolver` uses a simple lookup table from the parsed FpML parties list.
- `GlobalKeyGenerator` produces deterministic pseudo-random keys from input data (no UUID.randomUUID).
- The mapper dispatches on `FpMLtrade/product` element name to the correct product mapper.

---

## 7. Mapping Responsibilities Matrix

| Mapper Class | Input FpML Path | Key CDM Output Paths | Cookbook Rules |
|---|---|---|---|
| `FpmlHeaderMapper` | `header/*` | (discarded; logged) | — |
| `FpmlTradeHeaderMapper` | `trade.tradeHeader` | `trade.tradeDate`, `trade.tradeIdentifier` | RULE-001, RULE-002 |
| `FpmlPartyMapper` | `party[]`, party hrefs | `trade.party[]`, `trade.counterparty[]` | TR-001 |
| `FxSpotMapper` | `fxSingleLeg` (spot) | `trade.tradeLot`, `SettlementPayout` | RULE-005, TR-004 |
| `FxForwardMapper` | `fxSingleLeg` (fwd) | `trade.tradeLot`, `SettlementPayout` | RULE-005, TR-004 |
| `FxNdfMapper` | `fxSingleLeg` + NDF | `SettlementPayout.settlementType=Cash` | NDF fixing TR |
| `FxSwapMapper` | `fxSwap` | `payout[0]`, `payout[1]` | RULE-005, TR-004 |
| `FxVanillaOptionMapper` | `fxSimpleOption` | `OptionPayout`, `exerciseTerms` | RULE-003, RULE-004, TR-003 |
| `FxDigitalOptionMapper` | `fxDigitalOption` | `OptionPayout` + barrier/digital features | RULE-003, RULE-004, TR-003 |
| `FxAverageRateOptionMapper` | `fxDigitalOption` (avg-rate variant) | `OptionPayout` + `ObservationSchedule` | RULE-003, RULE-004, TR-003 |

---

## 8. Test Plan

Each supported product gets a JUnit 5 test that:
1. Loads the corresponding FpML fixture.
2. Runs the appropriate mapper.
3. Validates output against the CDM parallel fixture (semantic key comparison).

| # | Test Class | Input Fixture | Expected CDM Fixture |
|---|---|---|---|
| 1 | `FxSpotMapperTest` | `fx-ex01-fx-spot.xml` | `fx-ex01-fx-spot.json` |
| 2 | `FxSpotMapperTest` | `fx-ex02-spot-cross-w-side-rates.xml` | `fx-ex02-spot-cross-w-side-rates.json` |
| 3 | `FxForwardMapperTest` | `fx-ex03-fx-fwd.xml` | `fx-ex03-fx-fwd.json` |
| 4 | `FxForwardMapperTest` | `fx-ex04-fx-fwd-w-settlement.xml` | `fx-ex04-fx-fwd-w-settlement.json` |
| 5 | `FxForwardMapperTest` | `fx-ex05-fx-fwd-w-ssi.xml` | `fx-ex05-fx-fwd-w-ssi.json` |
| 6 | `FxForwardMapperTest` | `fx-ex06-fx-fwd-w-splits.xml` | `fx-ex06-fx-fwd-w-splits.json` |
| 7 | `FxNdfMapperTest` | `fx-ex07-non-deliverable-forward.xml` | `fx-ex07-non-deliverable-forward.json` |
| 8 | `FxSwapMapperTest` | `fx-ex08-fx-swap.xml` | `fx-ex08-fx-swap.json` |
| 9 | `FxVanillaOptionMapperTest` | `fx-ex09-euro-opt.xml` | `fx-ex09-euro-opt.json` |
| 10 | `FxVanillaOptionMapperTest` | `fx-ex10-amer-opt.xml` | `fx-ex10-amer-opt.json` |
| 11 | `FxDigitalOptionMapperTest` | `fx-ex14-euro-digital-option.xml` | `fx-ex14-euro-digital-option.json` |
| 12 | `FxDigitalOptionMapperTest` | `fx-ex15-euro-range-digital-option.xml` | `fx-ex15-euro-range-digital-option.json` |
| 13 | `FxDigitalOptionMapperTest` | `fx-ex16-one-touch-option.xml` | `fx-ex16-one-touch-option.json` |
| 14 | `FxDigitalOptionMapperTest` | `fx-ex17-no-touch-option.xml` | `fx-ex17-no-touch-option.json` |
| 15 | `FxDigitalOptionMapperTest` | `fx-ex18-double-one-touch-option.xml` | `fx-ex18-double-one-touch-option.json` |
| 16 | `FxDigitalOptionMapperTest` | `fx-ex19-double-no-touch-option.xml` | `fx-ex19-double-no-touch-option.json` |
| 17 | `FxAverageRateOptionMapperTest` | `fx-ex20-avg-rate-option-parametric.xml` | `fx-ex20-avg-rate-option-parametric.json` |
| 18 | `FxAverageRateOptionMapperTest` | `fx-ex21-avg-rate-option-specific.xml` | `fx-ex21-avg-rate-option-specific.json` |
| 19 | `FxDigitalOptionMapperTest` | `fx-ex22-straddle.xml` | `fx-ex22-straddle.json` |

**Unsupported products (no tests generated):** fx-ex11, fx-ex12, fx-ex13, fx-ex23, td-ex01, td-ex02 — recorded in section 3.

---

## 9. Validation Gates

All three gates must pass for the run to be considered successful.

### Gate 1 — Build
```
mvn clean compile
```
- Zero compile errors.
- All mapper, model, util, and validation classes compile without missing imports.

### Gate 2 — Unit Tests
```
mvn test
```
- All 19 tests pass.
- No `@Disabled` or skipped tests in the supported product set.

### Gate 3 — CDM Output Validation
```
Generated CDM JSON files are validated by:
  1. JSON parse check (well-formedness).
  2. Required top-level fields present: trade, meta.globalKey.
  3. trade.tradeDate.value is a valid ISO date string without trailing 'Z'.
  4. trade.tradeIdentifier[].assignedIdentifier[].identifier.value is non-empty.
  5. trade.tradeLot[0].priceQuantity[].quantity[].value is a positive number.
  6. trade.tradeLot[0].priceQuantity[].quantity[].unit.currency.value is a 3-letter ISO code.
```

---

## 10. Unsupported Behavior

The following behaviors were **observed in evidence** but will **not be implemented** in this run:

| Behavior | Observed In | Reason |
|---|---|---|
| AssignedIdentifier duplication (CDM has more entries than FpML tradeIds) | fx-ex01 CDM | No deterministic rule; likely an upstream enrichment bug |
| Buyer/seller role inversion (CDM Party1 vs FpML party2) | fx-ex12, fx-ex14 | TR-001 caveated; party role polarity marked as human-review flag |
| Barrier trigger mapping | fx-ex12, fx-ex13 | No stable cookbook rule; barrier TR is tentative only |
| Double-barrier schedules | fx-ex13 | Not covered by cookbook |
| NDO specific expiry mapping | fx-ex11 | NDO variant not covered by stable rules |
| Delta-hedge execution strategy | fx-ex23 | Not a primary product; no CDM parallel semantic mapping |
| Term deposit products | td-ex01, td-ex02 | Outside fx-derivatives product family scope |

---

## 11. Traceability Requirements

- Each generated Java mapper method must cite the cookbook rule id it implements in a Javadoc comment.
- Each generated CDM output field must be traceable to a source FpML XPath.
- Unsupported products are listed in section 3 with explicit reason codes.
- The run manifest (`00-run-log.md`) records this plan and its approved status.
- Maven test output must show pass/fail counts per fixture file.

---

## 12. Run Scope Summary

```
Products:              11 supported (11 product types), 6 observed unsupported
FpML fixtures:         25 total (19 covered by tests, 6 out-of-scope)
CDM fixtures:          25 total (19 covered by tests, 6 out-of-scope)
Cookbook rules used:   RULE-001, RULE-002, RULE-003, RULE-004, RULE-005
                       TR-001, TR-002, TR-003, TR-004
Java classes:          ~18 (mappers + models + utils + validation)
Maven tests:           19 (one per supported fixture subset)
Compilation:           Required gate
Unit tests:            Required gate (all must pass)
CDM validation:       Required gate
```

