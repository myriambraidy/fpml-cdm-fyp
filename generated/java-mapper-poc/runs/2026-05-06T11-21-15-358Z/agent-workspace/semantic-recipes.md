# Semantic Construction Recipes

Generated: 2026-05-06T11:21:15.517Z
Product family: fx-derivatives
Implementation group: fx-single-leg

## Build FX single-leg TradeState

Recipe id: fx-single-leg-tradestate
Root output class: cdm.event.common.TradeState
Semantic authority: rosetta-source, cookbook, generated-recipe

### Steps

#### 1. Build parties and party identifiers from FpML party elements.

Approved classes:
- cdm.base.staticdata.party.Party
- cdm.base.staticdata.party.PartyIdentifier
- cdm.base.staticdata.identifier.Identifier
- cdm.base.staticdata.identifier.AssignedIdentifier

Approved builder methods:
- none

Rosetta functions:
- MapFxSingleLegCounterpartyList
- MapFxSingleLegAncillaryPartyList
- MapPayerReceiverToAccountPartyReference

Notes:
- Do not invent cdm.base.staticdata.party.PartyReference. Use the approved party reference or identity classes from the contract.

#### 2. Build trade identifiers from tradeHeader.partyTradeIdentifier values.

Approved classes:
- cdm.event.common.TradeIdentifier

Approved builder methods:
- none

Rosetta functions:
- MapTradeIdentifierList

Notes:
- Preserve source trade identifiers in traceability reports.

#### 3. Build NonTransferableProduct and attach EconomicTerms.

Approved classes:
- cdm.product.template.NonTransferableProduct
- cdm.product.template.EconomicTerms
- cdm.product.template.Product
- cdm.product.template.TradableProduct

Approved builder methods:
- none

Rosetta functions:
- MapFxSingleLegNonTransferableProduct
- MapFxSingleLegEconomicTerms
- MapProductIdentifierList
- MapProductTaxonomyList

Notes:
- Use CDM builders as the internal model. Jackson is only for final serialization and reports.

#### 4. Build Payout and the selected SettlementPayout with price, quantity, settlement, and underlier details.

Approved classes:
- cdm.product.template.Payout
- cdm.product.template.SettlementPayout
- cdm.product.common.settlement.ResolvablePriceQuantity
- cdm.product.common.settlement.SettlementTerms
- cdm.product.common.settlement.CashSettlementTerms
- cdm.product.common.settlement.SettlementTypeEnum
- cdm.product.template.Underlier
- cdm.observable.asset.PriceSchedule
- cdm.observable.asset.Observable
- cdm.base.staticdata.asset.common.Asset
- cdm.base.staticdata.asset.common.Cash

Approved builder methods:
- none

Rosetta functions:
- MapFxCoreDetailsModelToSettlementPayout
- MapFxSingleLegPriceQuantityList
- MapFxCoreDetailsModelPriceListWithLocation
- MapFxCoreDetailsModelQuantityListWithLocation

Notes:
- Use the selected class in the approved contract for each concept; do not use rejected same-name candidates.

#### 5. Build Trade and wrap it in TradeState for runtime output.

Approved classes:
- cdm.event.common.Trade
- cdm.event.common.TradeState
- cdm.event.common.ContractDetails

Approved builder methods:
- none

Rosetta functions:
- MapTradeState

Notes:
- The runtime output root is TradeState unless the final implementation contract states otherwise.

### Forbidden Classes

- none

### Examples

#### TradeState construction shape

Source: generated-recipe
Compile checked: no

```java
Trade trade = Trade.builder()
    .addTradeIdentifier(tradeIdentifier)
    .setContractDetails(contractDetails)
    .build();
TradeState tradeState = TradeState.builder()
    .setTrade(trade)
    .build();
```

