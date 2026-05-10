# Draft Semantic Recipe Requirements

Recipe id: fx-single-leg-tradestate
Required class count: 24

## Required Classes

- cdm.base.staticdata.asset.common.Asset
- cdm.base.staticdata.asset.common.Cash
- cdm.base.staticdata.identifier.AssignedIdentifier
- cdm.base.staticdata.identifier.Identifier
- cdm.base.staticdata.party.Party
- cdm.base.staticdata.party.PartyIdentifier
- cdm.base.staticdata.party.metafields.ReferenceWithMetaParty
- cdm.event.common.ContractDetails
- cdm.event.common.Trade
- cdm.event.common.TradeIdentifier
- cdm.event.common.TradeState
- cdm.observable.asset.Observable
- cdm.observable.asset.PriceSchedule
- cdm.product.common.settlement.CashSettlementTerms
- cdm.product.common.settlement.ResolvablePriceQuantity
- cdm.product.common.settlement.SettlementTerms
- cdm.product.common.settlement.SettlementTypeEnum
- cdm.product.template.EconomicTerms
- cdm.product.template.NonTransferableProduct
- cdm.product.template.Payout
- cdm.product.template.Product
- cdm.product.template.SettlementPayout
- cdm.product.template.TradableProduct
- cdm.product.template.Underlier

## Steps

### 1. Build parties and party identifiers from FpML party elements.

Core step: yes
Classes:
- cdm.base.staticdata.party.Party
- cdm.base.staticdata.party.PartyIdentifier
- cdm.base.staticdata.identifier.Identifier
- cdm.base.staticdata.identifier.AssignedIdentifier
- cdm.base.staticdata.party.metafields.ReferenceWithMetaParty
Builder intents:
- build-root
- set-party
- set-identifier

### 2. Build trade identifiers from tradeHeader.partyTradeIdentifier values.

Core step: yes
Classes:
- cdm.event.common.TradeIdentifier
Builder intents:
- build-root
- set-identifier

### 3. Build NonTransferableProduct and attach EconomicTerms.

Core step: yes
Classes:
- cdm.product.template.NonTransferableProduct
- cdm.product.template.EconomicTerms
- cdm.product.template.Product
- cdm.product.template.TradableProduct
Builder intents:
- build-root
- set-product
- set-economic-terms

### 4. Build Payout and selected SettlementPayout with price, quantity, settlement, and underlier details.

Core step: yes
Classes:
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
Builder intents:
- build-root
- set-payout
- set-settlement-payout
- set-price-quantity

### 5. Build Trade and wrap it in TradeState for runtime output.

Core step: yes
Classes:
- cdm.event.common.Trade
- cdm.event.common.TradeState
- cdm.event.common.ContractDetails
Builder intents:
- build-root
- set-trade
- set-contract-details
- set-product
- set-party
