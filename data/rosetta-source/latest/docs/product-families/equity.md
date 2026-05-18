# Rosetta Pack: Equity

## Purpose

Use this pack to find Rosetta context for Equity FpML ingestion and model support.

## Relevant Raw Files

- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta`

## Important Blocks

| Kind | Name | Source | Lines |
|---|---|---|---:|
| `func` | `MapBrokerEquityOptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta` | 18-26 |
| `func` | `MapBrokerEquityOptionAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta` | 27-32 |
| `func` | `MapBrokerEquityOptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta` | 33-49 |
| `func` | `MapBrokerEquityOptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta` | 50-62 |
| `func` | `MapBrokerEquityOptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta` | 63-131 |
| `func` | `MapBrokerEquityOptionPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta` | 132-150 |
| `func` | `MapBrokerEquityOptionAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-brokerequityoption-func.rosetta` | 151-164 |
| `func` | `MapDividendSwapOptionTransactionSupplementCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta` | 16-26 |
| `func` | `MapDividendSwapOptionTransactionSupplementAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta` | 27-32 |
| `func` | `MapDividendSwapOptionTransactionSupplementNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta` | 33-53 |
| `func` | `MapDividendSwapOptionTransactionSupplementEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta` | 54-69 |
| `func` | `MapDividendSwapOptionTransactionSupplementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta` | 70-118 |
| `func` | `MapDividendSwapOptionTransactionSupplementPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta` | 119-129 |
| `func` | `MapDividendSwapOptionTransactionSupplementAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswapoptiontransactionsupplement-func.rosetta` | 130-143 |
| `func` | `MapDividendSwapTransactionSupplementCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 22-32 |
| `func` | `MapDividendSwapTransactionSupplementAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 33-38 |
| `func` | `MapDividendSwapTransactionSupplementNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 39-59 |
| `func` | `MapDividendSwapTransactionSupplementEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 60-75 |
| `func` | `MapDividendSwapTransactionSupplementPayoutList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 76-95 |
| `func` | `MapDividendLegToPerformancePayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 96-136 |
| `func` | `MapSwapTransactionSupplementDividendReturnTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 137-186 |
| `func` | `MapFixedPaymentLegToFixedPricePayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 187-233 |
| `func` | `MapFixedLegSettlementTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 234-261 |
| `func` | `MapDividendSwapTransactionSupplementPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 262-273 |
| `func` | `MapFixedPaymentLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 274-292 |
| `func` | `MapDividendLegToPriceQuantity` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 293-307 |
| `func` | `MapSingleUnderlyerToNonNegativeQuantityScheduleWithLocation` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 308-329 |
| `func` | `MapDividendSwapTransactionSupplementAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-dividendswaptransactionsupplement-func.rosetta` | 330-343 |
| `func` | `MapEquityForwardCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta` | 14-19 |
| `func` | `MapEquityForwardAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta` | 20-25 |
| `func` | `MapEquityForwardNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta` | 26-42 |
| `func` | `MapEquityForwardEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta` | 43-55 |
| `func` | `MapEquityForwardPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta` | 56-67 |
| `func` | `MapEquityForwardPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta` | 68-73 |
| `func` | `MapEquityForwardAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityforward-func.rosetta` | 74-87 |
| `func` | `MapEquityOptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 22-30 |
| `func` | `MapEquityOptionAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 31-36 |
| `func` | `MapEquityOptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 37-53 |
| `func` | `MapEquityOptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 54-66 |
| `func` | `MapEquityOptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 67-183 |
| `func` | `MapAveragingObservations` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 184-198 |
| `func` | `MapEquityOptionPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 199-215 |
| `func` | `MapEquityOptionAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoption-func.rosetta` | 216-229 |
| `func` | `MapEquityOptionTransactionSupplementCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta` | 18-28 |
| `func` | `MapEquityOptionTransactionSupplementAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta` | 29-34 |
| `func` | `MapEquityOptionTransactionSupplementNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta` | 35-55 |
| `func` | `MapEquityOptionTransactionSupplementEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta` | 56-71 |
| `func` | `MapEquityOptionTransactionSupplementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta` | 72-141 |
| `func` | `MapEquityOptionTransactionSupplementPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta` | 142-160 |
| `func` | `MapEquityOptionTransactionSupplementAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityoptiontransactionsupplement-func.rosetta` | 161-174 |
| `func` | `MapEquitySwapTransactionSupplementCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta` | 17-27 |
| `func` | `MapEquitySwapTransactionSupplementAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta` | 28-33 |
| `func` | `MapEquitySwapTransactionSupplementNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta` | 34-54 |
| `func` | `MapEquitySwapTransactionSupplementEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta` | 55-80 |
| `func` | `MapReturnSwapLegListToPayoutList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta` | 81-103 |
| `func` | `MapEquitySwapTransactionSupplementPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta` | 104-126 |
| `func` | `MapEquitySwapTransactionSupplementAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-equityswaptransactionsupplement-func.rosetta` | 127-140 |

## Shared Dependencies

Also read `../shared-ingest.md` for party, payment, date, settlement, and price/quantity context.

## Next Step

Inspect these block references before extracting cookbook rules. Full raw block text is stored in `../../extracted/blocks.json`.
