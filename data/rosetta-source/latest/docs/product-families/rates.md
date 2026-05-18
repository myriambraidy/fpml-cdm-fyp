# Rosetta Pack: Rates

## Purpose

Use this pack to find Rosetta context for Rates FpML ingestion and model support.

## Relevant Raw Files

- `rosetta-source/src/main/rosetta/base-staticdata-asset-rates-enum.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-capfloor-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swaption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-varianceswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-varianceswaptransactionsupplement-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-volatilityswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-volatilityswaptransactionsupplement-func.rosetta`
- `rosetta-source/src/main/rosetta/product-asset-floatingrate-enum.rosetta`
- `rosetta-source/src/main/rosetta/product-asset-floatingrate-func.rosetta`
- `rosetta-source/src/main/rosetta/product-asset-floatingrate-type.rosetta`

## Important Blocks

| Kind | Name | Source | Lines |
|---|---|---|---:|
| `enum` | `FloatingRateIndexEnum` | `rosetta-source/src/main/rosetta/base-staticdata-asset-rates-enum.rosetta` | 6-668 |
| `enum` | `InflationRateIndexEnum` | `rosetta-source/src/main/rosetta/base-staticdata-asset-rates-enum.rosetta` | 669-744 |
| `func` | `MapCapFloorCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-capfloor-func.rosetta` | 15-25 |
| `func` | `MapCapFloorAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-capfloor-func.rosetta` | 26-31 |
| `func` | `MapCapFloorNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-capfloor-func.rosetta` | 32-45 |
| `func` | `MapCapFloorEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-capfloor-func.rosetta` | 46-63 |
| `func` | `MapCapFloorPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-capfloor-func.rosetta` | 64-71 |
| `func` | `MapCapFloorAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-capfloor-func.rosetta` | 72-85 |
| `func` | `MapCorrelationSwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 20-30 |
| `func` | `MapCorrelationSwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 31-36 |
| `func` | `MapCorrelationSwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 37-53 |
| `func` | `MapCorrelationSwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 54-66 |
| `func` | `MapCorrelationSwapPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 67-131 |
| `func` | `MapCorrelationLegToCorrelationReturnTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 132-170 |
| `func` | `MapCorrelationSwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 171-189 |
| `func` | `MapCorrelationSwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-correlationswap-func.rosetta` | 190-203 |
| `func` | `MapFraCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 23-30 |
| `func` | `MapFraAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 31-36 |
| `func` | `MapFraNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 37-50 |
| `func` | `MapFraEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 51-63 |
| `func` | `MapFraPayoutList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 64-101 |
| `func` | `MapFraToFixedInterestRatePayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 102-157 |
| `func` | `MapFraToFloatingInterestRatePayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 158-203 |
| `func` | `MapFraCalculationPeriodDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 204-222 |
| `func` | `MapFraResetDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 223-234 |
| `func` | `MapFraDiscountingMethod` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 235-246 |
| `func` | `MapFraPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 247-256 |
| `func` | `MapFraFixedLegPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 257-277 |
| `func` | `MapFraFloatingLegPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 278-296 |
| `func` | `MapFraAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 297-307 |
| `func` | `FixedLeg` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 308-315 |
| `func` | `FloatingLeg` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fra-func.rosetta` | 316-323 |
| `func` | `MapReturnSwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 25-35 |
| `func` | `MapReturnSwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 36-41 |
| `func` | `MapReturnSwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 42-55 |
| `func` | `MapReturnSwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 56-75 |
| `func` | `MapReturnSwapLegToPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 76-90 |
| `func` | `MapInterestLegToInterestRatePayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 91-152 |
| `func` | `MapResolvablePriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 153-175 |
| `func` | `MapInterestLegCalculationPeriodDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 176-193 |
| `func` | `MapStubCalculationPeriodToStubPeriod` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 194-208 |
| `func` | `MapInterestLegPaymentDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 209-228 |
| `func` | `MapInterestLegResetDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 229-255 |
| `func` | `MapReturnLegToPerformancePayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 256-319 |
| `func` | `MapPaymentDateSchedule` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 320-335 |
| `func` | `MapReturnLegValuationToValuationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 336-357 |
| `func` | `MapReturnSwapDividendReturnTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 358-404 |
| `func` | `MapDividendCurrency` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 405-419 |
| `func` | `MapReturnSwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 420-442 |
| `func` | `MapInterestLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 443-469 |
| `func` | `MapInterestCalculationToPriceListWithLocation` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 470-491 |
| `func` | `MapNotionalAmountToQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 492-507 |
| `func` | `MapReturnLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 508-540 |
| `func` | `MapReturnSwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-returnswap-func.rosetta` | 541-554 |
| `func` | `MapSwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 25-35 |
| `func` | `MapSwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 36-41 |
| `func` | `MapSwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 42-55 |
| `func` | `MapSwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 56-73 |
| `func` | `MapSwapPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 74-179 |
| `func` | `MapQuantityMultiplier` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 180-205 |
| `func` | `MapFutureValueAmount` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 206-228 |
| `func` | `MapFloatingRateSpecification` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 229-261 |
| `func` | `MapInflationRateSpecification` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 262-299 |
| `func` | `MapInitialRate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 300-317 |
| `func` | `MapFinalRateRounding` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 318-330 |
| `func` | `MapTerminationProvision` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 331-350 |
| `func` | `MapEarlyTerminationProvision` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 351-370 |
| `func` | `MapOptionalEarlyTermination` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 371-401 |
| `func` | `MapMandatoryEarlyTermination` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 402-420 |
| `func` | `MapStubCalculationPeriodAmountToStubPeriod` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 421-437 |
| `func` | `MapStubValue` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 438-450 |
| `func` | `MapInitialOrFinalStub` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 451-458 |
| `func` | `MapStubFloatingRate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 459-473 |
| `func` | `MapSwapResetDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 474-502 |
| `func` | `MapResetFrequency` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 503-516 |
| `func` | `MapSwapCalculationPeriodDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 517-552 |
| `func` | `MapSwapPaymentDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 553-578 |
| `func` | `MapFrequency` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 579-589 |
| `func` | `MapCashflowRepresentation` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 590-600 |
| `func` | `MapPaymentCalculationPeriodList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-swap-func.rosetta` | 601-615 |
| ... | 72 additional blocks omitted from markdown | See extracted JSON | ... |

## Shared Dependencies

Also read `../shared-ingest.md` for party, payment, date, settlement, and price/quantity context.

## Next Step

Inspect these block references before extracting cookbook rules. Full raw block text is stored in `../../extracted/blocks.json`.
