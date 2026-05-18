# Rosetta Pack: FX

## Purpose

Use this pack to find Rosetta context for FX FpML ingestion and model support.

## Relevant Raw Files

- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta`

## Important Blocks

| Kind | Name | Source | Lines |
|---|---|---|---:|
| `func` | `MapFxDigitalOptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 13-29 |
| `func` | `MapFxDigitalOptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 30-38 |
| `func` | `MapFxDigitalOptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 39-51 |
| `func` | `MapFxDigitalOptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 52-86 |
| `func` | `MapFxOptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 22-30 |
| `func` | `MapFxOptionAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 31-36 |
| `func` | `MapFxOptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 37-50 |
| `func` | `MapFxOptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 51-64 |
| `func` | `MapFxOptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 65-119 |
| `func` | `MapFxOptionFeaturesToObservationTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 120-141 |
| `func` | `MapObservationScheduleToObservationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 142-176 |
| `func` | `GetExchangedCurrencyAmount` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 177-186 |
| `func` | `MapFxOptionStrikePrice` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 187-232 |
| `func` | `MapFxOptionPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 233-247 |
| `func` | `MapFxOptionAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 248-258 |
| `func` | `MapFxSingleLegCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 17-27 |
| `func` | `MapFxSingleLegAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 28-33 |
| `func` | `MapFxSingleLegNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 34-47 |
| `func` | `MapFxSingleLegEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 48-64 |
| `func` | `MapFxCoreDetailsModelToSettlementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 65-111 |
| `func` | `MapFxSingleLegPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 112-120 |
| `func` | `MapFxSingleLegAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 121-134 |
| `func` | `MapFxSwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 16-26 |
| `func` | `MapFxSwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 27-32 |
| `func` | `MapFxSwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 33-46 |
| `func` | `MapFxSwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 47-59 |
| `func` | `MapFxSwapPayoutList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 60-80 |
| `func` | `MapFxSwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 81-98 |
| `func` | `MapFxSwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 99-112 |
| `func` | `MapFxVarianceSwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 22-37 |
| `func` | `MapFxVarianceSwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 38-43 |
| `func` | `MapFxVarianceSwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 44-60 |
| `func` | `MapFxVarianceSwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 61-77 |
| `func` | `MapFxVarianceSwapPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 78-132 |
| `func` | `MapFxVarianceSwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 133-163 |
| `func` | `MapFxPerformanceSwapToObservationTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 164-190 |
| `func` | `MapFxFixingScheduleToObservationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 191-225 |
| `func` | `MapFxValuationDateOffsetToValuationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 226-256 |
| `func` | `MapFxPerformanceSwapToReturnTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 257-303 |
| `func` | `MapFxVarianceSwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 304-311 |
| `func` | `MapFxVolatilitySwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 18-33 |
| `func` | `MapFxVolatilitySwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 34-39 |
| `func` | `MapFxVolatilitySwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 40-56 |
| `func` | `MapFxVolatilitySwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 57-69 |
| `func` | `MapFxVolatilitySwapPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 70-83 |
| `func` | `MapFxVolatilitySwapReturnTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 84-127 |
| `func` | `MapFxVolatilitySwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 128-147 |
| `func` | `MapFxVolatilitySwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 148-155 |

## Shared Dependencies

Also read `../shared-ingest.md` for party, payment, date, settlement, and price/quantity context.

## Next Step

Inspect these block references before extracting cookbook rules. Full raw block text is stored in `../../extracted/blocks.json`.
