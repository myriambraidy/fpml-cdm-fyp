# Rosetta Pack: Commodity

## Purpose

Use this pack to find Rosetta context for Commodity FpML ingestion and model support.

## Relevant Raw Files

- `rosetta-source/src/main/rosetta/base-staticdata-asset-commodity-enum.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta`

## Important Blocks

| Kind | Name | Source | Lines |
|---|---|---|---:|
| `enum` | `ProductGradeEnum` | `rosetta-source/src/main/rosetta/base-staticdata-asset-commodity-enum.rosetta` | 6-81 |
| `func` | `MapCommodityForwardCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta` | 13-18 |
| `func` | `MapCommodityForwardAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta` | 19-24 |
| `func` | `MapCommodityForwardNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta` | 25-41 |
| `func` | `MapCommodityForwardEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta` | 42-54 |
| `func` | `MapCommodityForwardPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta` | 55-66 |
| `func` | `MapCommodityForwardPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta` | 67-72 |
| `func` | `MapCommodityForwardAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityforward-func.rosetta` | 73-80 |
| `func` | `MapCommodityOptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 22-30 |
| `func` | `MapCommodityOptionAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 31-36 |
| `func` | `MapCommodityOptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 37-53 |
| `func` | `MapCommodityOptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 54-69 |
| `func` | `MapCommodityOptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 70-150 |
| `func` | `MapCommodityOptionToObservationTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 151-175 |
| `func` | `MapCommodityPricingDatesToObservationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 176-200 |
| `func` | `MapCommodityOptionPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 201-218 |
| `func` | `MapCommodityOptionAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityoption-func.rosetta` | 219-232 |
| `func` | `MapCommoditySwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 22-34 |
| `func` | `GetFpmlPayerReceiver` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 35-50 |
| `func` | `MapCommoditySwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 51-56 |
| `func` | `MapCommoditySwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 57-73 |
| `func` | `MapCommoditySwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 74-95 |
| `func` | `MapCommoditySwapLegListToPayoutList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 96-170 |
| `func` | `MapFloatingLegToCommodityPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 171-236 |
| `func` | `MapAveragingCalculation` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 237-257 |
| `func` | `MapGasPhysicalLegToSettlementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 258-285 |
| `func` | `MapOilPhysicalLegToSettlementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 286-313 |
| `func` | `MapElectricityPhysicalLegToSettlementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 314-341 |
| `func` | `MapEnvironmentalPhysicalLegToSettlementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 342-369 |
| `func` | `MapCoalPhysicalLegToSettlementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 370-397 |
| `func` | `MapFixedLegToFixedPricePayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 398-435 |
| `func` | `MapCommoditySwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 436-493 |
| `func` | `MapFixedLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 494-512 |
| `func` | `MapFloatingLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 513-538 |
| `func` | `MapGasPhysicalLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 539-553 |
| `func` | `MapOilPhysicalLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 554-568 |
| `func` | `MapElectricityPhysicalLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 569-583 |
| `func` | `MapEnvironmentalPhysicalLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 584-598 |
| `func` | `MapCoalPhysicalLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 599-613 |
| `func` | `MapCommoditySwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswap-func.rosetta` | 614-621 |
| `func` | `MapCommoditySwaptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 15-23 |
| `func` | `MapCommoditySwaptionAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 24-29 |
| `func` | `MapCommoditySwaptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 30-46 |
| `func` | `MapCommoditySwaptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 47-59 |
| `func` | `MapCommoditySwaptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 60-107 |
| `func` | `MapUnderlierNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 108-123 |
| `func` | `MapCommoditySwaptionPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 124-129 |
| `func` | `MapCommoditySwaptionAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-commodityswaption-func.rosetta` | 130-143 |

## Shared Dependencies

Also read `../shared-ingest.md` for party, payment, date, settlement, and price/quantity context.

## Next Step

Inspect these block references before extracting cookbook rules. Full raw block text is stored in `../../extracted/blocks.json`.
