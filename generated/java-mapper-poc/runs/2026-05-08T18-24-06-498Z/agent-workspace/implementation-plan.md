# Implementation Plan

## Status: COMPLETED

## Generated Files (src/main/java/com/fpml/cdm/fx/mapper/generated/)

| File | Purpose |
|------|---------|
| `GeneratedFpmlToCdmMapper.java` | Main entry point implementing `FpmlToCdmMapper`; orchestrates all product mappers, builds `TradeState`, serializes to JSON with Jackson |
| `FxSingleLegMapper.java` | Core FX single-leg recipe builder (Rosetta: `MapTradeState`, `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`) |
| `PartyMapper.java` | Parties, party identifiers, counterparties (Rosetta: `MapFxSingleLegCounterpartyList`, `MapPayerReceiverModelToCounterpartyList`) |
| `TradeIdentifierMapper.java` | Trade identifiers from `tradeHeader/partyTradeIdentifier` (Rosetta: `MapTradeIdentifierList`) |
| `ObservableMapper.java` | Currency to CDM `Cash`/`Observable` (Rosetta: `MapCurrencyToObservableCashWithAddress`) |
| `PriceQuantityMapper.java` | Exchange rate to `PriceSchedule`, amounts to `NonNegativeQuantitySchedule` (Rosetta: `MapFxCoreDetailsModelPriceWithAddress`, `MapFxCoreDetailsModelQuantityWithAddress`) |
| `SettlementMapper.java` | Value date and NDF settlement terms (Rosetta: `MapFxCashSettlementToSettlementTerms`) |
| `PayoutMapper.java` | `Payout` with `SettlementPayout`, `PriceQuantity`, settlement terms, underlier (Rosetta: `MapFxCoreDetailsModelToSettlementPayout`) |
| `FxSpotMapper.java` | FX spot mapping (fixtures fx-ex01, fx-ex02) |
| `FxFwdMapper.java` | FX forward mapping with split-rate decomposition (fixtures fx-ex03 to fx-ex06) |
| `NdfMapper.java` | Non-deliverable forward mapping (fixture fx-ex07) |
| `ReportWriter.java` | Jackson-based sidecar report writer |

## Test Files (src/test/java/)

| File | Purpose |
|------|---------|
| `GeneratedFpmlToCdmMapperTest.java` | One test per fixture asserting JSON output and CDM model completeness |

## Report Files (reports/)

| File | Purpose |
|------|---------|
| `{fixture}-report.json` | Per-fixture traceability, unsupported scope, validation notes |
| `mapping-traceability-report.json` | Cross-fixture Rosetta function citation index |
| `unsupported-fields-report.json` | All unsupported FpML fields encountered |
| `cdm-class-usage-report.json` | Approved CDM class usage inventory |
| `validation-notes-report.json` | CDM validation observations |
| `builder-method-usage-report.json` | Approved builder method usage inventory |

## Recipe Steps Implemented

1. Build parties and party identifiers from FpML `party` elements.
2. Build trade identifiers from `tradeHeader/partyTradeIdentifier` values.
3. Build `NonTransferableProduct` with `EconomicTerms`.
4. Build `Payout` containing `SettlementPayout` with price, quantity, settlement, and underlier details.
5. Build `Trade` and wrap in `TradeState` for runtime output.

## Constraints Applied

- Only 38 approved CDM classes used.
- Only 114 approved builder methods used.
- No forbidden validation/meta/processor classes.
- FpML parsed via DOM/StAX only.
- Jackson used only for final JSON serialization and sidecar reports.
- Unsupported fields reported explicitly; no silent fabrication.
- Rosetta function names cited in traceability reports.

## Fixture Coverage

- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward
