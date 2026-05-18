# Rosetta Pack: Shared FpML Ingest

## Purpose

Use this pack to find shared Rosetta context for trade state, party, payment, price/quantity, datetime, and settlement handling.

## Relevant Raw Files

- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-header-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-message-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-payment-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-settlement-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-tradestate-func.rosetta`

## Important Blocks

| Kind | Name | Source | Lines |
|---|---|---|---:|
| `func` | `GetFpmlTrade` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 28-50 |
| `func` | `MapStringWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 51-63 |
| `func` | `MapStringWithReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 64-76 |
| `func` | `MapCurrency` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 77-86 |
| `func` | `MapCurrencyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 87-96 |
| `func` | `MapResolvablePriceQuantityReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 97-108 |
| `func` | `MapProductTaxonomyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 109-136 |
| `func` | `MapAssetClassWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 137-149 |
| `func` | `MapUnitTypeWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 150-167 |
| `func` | `MapCapacityUnitWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 168-180 |
| `func` | `MapWeatherUnitWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 181-193 |
| `func` | `MapFinancialUnitWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 194-206 |
| `func` | `MapTaxonomySourceEnum` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 207-221 |
| `func` | `MapFeeTypeEnumWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 222-234 |
| `func` | `MapProductIdentifierList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 235-242 |
| `func` | `MapProductIdentifier` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 243-257 |
| `func` | `MapProductIdType` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 258-278 |
| `func` | `MapFxFeature` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 279-292 |
| `func` | `MapReferenceCurrency` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 293-306 |
| `func` | `MapComposite` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 307-322 |
| `func` | `MapQuanto` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 323-335 |
| `func` | `MapFxRate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 336-347 |
| `func` | `MapQuotedCurrencyPair` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 348-360 |
| `func` | `MapQuotedCurrencyPairWithLocation` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 361-372 |
| `func` | `MapFxSpotRateSource` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 373-386 |
| `func` | `MapInformationSource` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 387-402 |
| `func` | `MapMoney` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 403-420 |
| `func` | `GetFpmlEquityExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 421-434 |
| `func` | `GetFpmlCommodityExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 435-446 |
| `func` | `GetFpmlCommodityPhysicalExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 447-458 |
| `func` | `GetFpmlFxExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 459-470 |
| `func` | `GetFpmlFxDigitalExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 471-482 |
| `func` | `MapExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 483-527 |
| `func` | `MapExerciseProcedure` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 528-568 |
| `func` | `MapEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 569-603 |
| `func` | `MapEquityEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 604-629 |
| `func` | `MapCommodityEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 630-656 |
| `func` | `MapFxEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 657-678 |
| `func` | `MapBermudaExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 679-709 |
| `func` | `MapEquityBermudaExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 710-747 |
| `func` | `MapAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 748-782 |
| `func` | `MapMultipleExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 783-800 |
| `func` | `MapEquityAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 801-835 |
| `func` | `MapEquityMultipleExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 836-850 |
| `func` | `MapCommodityAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 851-879 |
| `func` | `MapFxDigitalAmericanExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 880-904 |
| `func` | `MapFxAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 905-914 |
| `func` | `GetPerUnitOfForEquityDerivativeBase` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 915-936 |
| `func` | `MapAdjustableOrRelativeDateToObservationTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 937-965 |
| `func` | `StringContains` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 966-973 |
| `func` | `MapMessageAction` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 974-987 |
| `func` | `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 25-40 |
| `func` | `MapAdjustableOrAdjustedOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 41-58 |
| `func` | `MapAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 59-75 |
| `func` | `MapAdjustedDateToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 76-89 |
| `func` | `MapAdjustedDateToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 90-101 |
| `func` | `MapAdjustableDate2ToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 102-119 |
| `func` | `MapAdjustableDate2ToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 120-131 |
| `func` | `MapUnadjustedDateToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 132-145 |
| `func` | `MapUnadjustedDateToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 146-157 |
| `func` | `MapAdjustableDateOrAdjustedRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 158-170 |
| `func` | `MapAdjustedRelativeDateReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 171-182 |
| `func` | `MapAdjustableDateOrRelativeDateSequenceToAdjustableOrAdjustedRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 183-200 |
| `func` | `MapAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 201-215 |
| `func` | `MapZoneDateTimeToDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 216-222 |
| `func` | `MapAdjustableOrRelativeDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 223-239 |
| `func` | `MapAdjustable2` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 240-255 |
| `func` | `MapAdjustableRelativeOrPeriodicDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 256-276 |
| `func` | `MapAdjustableRelativeOrPeriodicDates2` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 277-297 |
| `func` | `MapAdjustableOrRelativeDatesToAdjustableRelativeOrPeriodicDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 298-314 |
| `func` | `MapAdjustableDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 315-329 |
| `func` | `MapDateWithId` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 330-341 |
| `func` | `MapDateListToAdjustableOrRelativeDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 342-353 |
| `func` | `MapDateListToAdjustableDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 354-365 |
| `func` | `MapDateToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 366-377 |
| `func` | `MapDateToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 378-389 |
| `func` | `MapOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 390-402 |
| `func` | `MapAdjustedRelativeDateOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 403-414 |
| `func` | `MapRelativeDateSequenceToAdjustedRelativeDateOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 415-438 |
| `func` | `MapRelativeDateOffsetToAdjustedRelativeDateOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 439-461 |
| ... | 274 additional blocks omitted from markdown | See extracted JSON | ... |

## Next Step

Inspect these block references before extracting cookbook rules. Full raw block text is stored in `../extracted/blocks.json`.
