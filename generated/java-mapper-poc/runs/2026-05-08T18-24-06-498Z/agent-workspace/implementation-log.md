# Implementer Research

## Implementation Outline

### File Manifest

**Generated-owned Java files** (under `src/main/java/com/fpml/cdm/fx/mapper/generated/`):

| File | Purpose |
|------|---------|
| `GeneratedFpmlToCdmMapper.java` | Main mapper implementing `FpmlToCdmMapper`; entry point called by `Main`. Maps each FpML FX fixture to a CDM `TradeState` and serialises to JSON. |
| `FxSpotMapper.java` | Maps fx-ex01 and fx-ex02 spot fixtures via `mapFxSingleLeg`. |
| `FxFwdMapper.java` | Maps fx-ex03 through fx-ex06 forward fixtures via `mapFxSingleLeg`; handles split-rate decomposition. |
| `NdfMapper.java` | Maps fx-ex07 non-deliverable-forward fixture; handles `nonDeliverableSettlement` and settlement currency. |
| `PartyMapper.java` | Builds CDM `Party`, `PartyIdentifier`, `Counterparty` from FpML `party` elements and `payerPartyReference`/`receiverPartyReference`. |
| `TradeIdentifierMapper.java` | Builds CDM `TradeIdentifier` list from `tradeHeader/partyTradeIdentifier`. |
| `PayoutMapper.java` | Builds `Payout` containing `SettlementPayout`; wires `priceQuantity` (`ResolvablePriceQuantity`), `settlementTerms` (`SettlementTerms` / `CashSettlementTerms`), and `underlier` (`Underlier` -> `Observable` -> `Cash`). |
| `PriceQuantityMapper.java` | Maps exchange-rate `rate` to CDM `PriceSchedule` and payment amounts to `NonNegativeQuantitySchedule`; handles `spotRate` + `forwardPoints` composite. |
| `SettlementMapper.java` | Maps `valueDate` to `SettlementDate` and `nonDeliverableSettlement` to `CashSettlementTerms`. |
| `ObservableMapper.java` | Maps currency codes to CDM `Observable` wrapping `Cash` asset. |
| `ReportWriter.java` | Jackson-based sidecar report writer: mapping summary, traceability citations (Rosetta function names), unsupported-field list, validation notes. |

**Test files** (under `src/test/java/`):
- `GeneratedFpmlToCdmMapperTest.java` — one test per fixture, asserting JSON round-trip parity against expected CDM summaries.

**Report files** (under `reports/`):
- Sidecar JSON reports per fixture containing traceability, unsupported-scope, and mapping notes.

### Build Order

1. `PartyMapper` — parties, party identifiers, counterparties (Rosetta: `MapFxSingleLegCounterpartyList`, `MapPayerReceiverModelToCounterpartyList`).
2. `TradeIdentifierMapper` — trade identifiers (Rosetta: `MapTradeIdentifierList`).
3. `ObservableMapper` — currency to CDM `Cash`/`Observable` (Rosetta: `MapCurrencyToObservableCashWithAddress`).
4. `PriceQuantityMapper` — exchange rate to `PriceSchedule`, amounts to `NonNegativeQuantitySchedule` (Rosetta: `MapFxCoreDetailsModelPriceWithAddress`, `MapFxCoreDetailsModelQuantityWithAddress`).
5. `SettlementMapper` — value date and NDF settlement terms (Rosetta: `MapFxCashSettlementToSettlementTerms`).
6. `PayoutMapper` — wires all above into `SettlementPayout` (Rosetta: `MapFxCoreDetailsModelToSettlementPayout`).
7. `NdfMapper` / `FxFwdMapper` / `FxSpotMapper` — per-product wrappers invoking recipe steps 3–5 (Rosetta: `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`, `MapTradeState`).
8. `GeneratedFpmlToCdmMapper` — orchestrates all mappers, builds `TradeState`, serialises with Jackson.

### Constraints Applied

- Only 38 approved CDM classes used; no forbidden validation/meta/processor classes.
- All builder methods drawn exclusively from the 114-entry approved builder-method index.
- FpML parsed via DOM/StAX only; no FpML Java model classes.
- Jackson used only for final JSON serialisation and sidecar reports.
- Unsupported fields written to sidecar report; no silent fabrication.
- Rosetta function names cited in traceability report for every major method.

# Implementer Write

All required implementation files have been written through native tool calls. Here is a concise summary of the completed files:

**Generated Java mapper classes** (`src/main/java/com/fpml/cdm/fx/mapper/generated/`):
- `GeneratedFpmlToCdmMapper.java` — Main entry point implementing `FpmlToCdmMapper`
- `FxSingleLegMapper.java` — Shared FX single-leg recipe orchestrator
- `FxSpotMapper.java` — Spot fixture mapper (ex01, ex02)
- `FxFwdMapper.java` — Forward fixture mapper (ex03–ex06)
- `NdfMapper.java` — NDF fixture mapper (ex07)
- `PartyMapper.java` — Party / PartyIdentifier / Counterparty builder
- `TradeIdentifierMapper.java` — TradeIdentifier builder
- `ObservableMapper.java` — Currency → CDM Cash / Observable
- `PriceQuantityMapper.java` — Exchange rate → PriceSchedule
- `SettlementMapper.java` — Value date / CashSettlementTerms builder
- `PayoutMapper.java` — Payout / SettlementPayout / Underlier assembler
- `ReportWriter.java` — Jackson sidecar report writer

**Test file** (`src/test/java/`):
- `GeneratedFpmlToCdmMapperTest.java`

**Reports** (`reports/`):
- 7 fixture sidecar reports (`fx-ex01` through `fx-ex07`)
- `mapping-traceability-report.json`
- `unsupported-fields-report.json`
- `cdm-class-usage-report.json`
- `validation-notes-report.json`
- `builder-method-usage-report.json`

**Agent-workspace logs**:
- `agent-workspace/implementation-plan.md`
- `agent-workspace/implementation-log.md`

The implementation uses only the 38 approved CDM classes, follows the 5-step semantic recipe, cites Rosetta function names in traceability reports, and uses Jackson only for final JSON serialisation and sidecar reports. FpML input is parsed via DOM/StAX; no FpML Java model classes are referenced.