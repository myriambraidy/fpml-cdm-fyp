# Approved CDM API Contract Summary

Generated: 2026-05-07T16:47:50.929Z
Product family: fx-derivatives
Implementation group: fx-single-leg
Authority: compiled-jar-javap-and-semantic-recipes

## Rules

- This summary is the default prompt authority.
- The full contract stays on disk as approved-cdm-api-contract.json and approved-cdm-api-contract.md.
- Import or fully qualify only approved classes listed below.
- Use get_cdm_builder_methods for exact method details before using a builder method.
- Use get_cdm_java_class only for classes already approved by this contract or resolved by concept.
- Forbidden categories are validation, utility, processor, and metadata implementation packages unless explicitly approved.

## Counts

- Approved classes: 38
- Approved builder methods: 114
- Forbidden full-contract entries: 811

## Approved Classes

- cdm.base.staticdata.asset.common.Asset
- cdm.base.staticdata.asset.common.Cash
- cdm.base.staticdata.identifier.AssignedIdentifier
- cdm.base.staticdata.identifier.Identifier
- cdm.base.staticdata.identifier.TradeIdentifierTypeEnum
- cdm.base.staticdata.party.AncillaryParty
- cdm.base.staticdata.party.Counterparty
- cdm.base.staticdata.party.Party
- cdm.base.staticdata.party.PartyIdentifier
- cdm.base.staticdata.party.PartyIdentifierTypeEnum
- cdm.base.staticdata.party.PartyRole
- cdm.base.staticdata.party.metafields.ReferenceWithMetaParty
- cdm.event.common.ContractDetails
- cdm.event.common.Trade
- cdm.event.common.TradeIdentifier
- cdm.event.common.TradeState
- cdm.observable.asset.Observable
- cdm.observable.asset.PriceSchedule
- cdm.product.asset.CommodityPayout
- cdm.product.asset.CreditDefaultPayout
- cdm.product.asset.InterestRatePayout
- cdm.product.common.settlement.CashSettlementTerms
- cdm.product.common.settlement.ResolvablePriceQuantity
- cdm.product.common.settlement.SettlementTerms
- cdm.product.common.settlement.SettlementTypeEnum
- cdm.product.template.AssetPayout
- cdm.product.template.EconomicTerms
- cdm.product.template.FixedPricePayout
- cdm.product.template.NonTransferableProduct
- cdm.product.template.OptionPayout
- cdm.product.template.Payout
- cdm.product.template.PerformancePayout
- cdm.product.template.Product
- cdm.product.template.SettlementPayout
- cdm.product.template.TradableProduct
- cdm.product.template.TransferableProduct
- cdm.product.template.Underlier
- com.rosetta.model.metafields.FieldWithMetaString

## Approved Builder Method Index

- cdm.base.staticdata.identifier.AssignedIdentifier: getIdentifier [set-identifier], getOrCreateIdentifier [set-identifier], setIdentifier [set-identifier], setIdentifierValue [set-identifier]
- cdm.base.staticdata.identifier.Identifier: addAssignedIdentifier [set-identifier], getAssignedIdentifier [set-identifier], getOrCreateAssignedIdentifier [set-identifier], setAssignedIdentifier [set-identifier]
- cdm.base.staticdata.party.Party: addPartyId [set-party], getOrCreatePartyId [set-party], getPartyId [set-party], setPartyId [set-party]
- cdm.base.staticdata.party.PartyIdentifier: getIdentifier [set-identifier], getOrCreateIdentifier [set-identifier], setIdentifier [set-identifier], setIdentifierType [set-identifier], setIdentifierValue [set-identifier]
- cdm.event.common.Trade: addAncillaryParty [set-party], addCounterparty [set-party], addParty [set-party], addPartyRole [set-party], getOrCreateParty [set-party], getOrCreatePartyRole [set-party], getParty [set-party], getPartyRole [set-party], setAncillaryParty [set-party], setContractDetails [set-contract-details], setCounterparty [set-party], setParty [set-party], setPartyRole [set-party], setProduct [set-product]
- cdm.event.common.TradeIdentifier: addAssignedIdentifier [set-identifier], setAssignedIdentifier [set-identifier], setIdentifierType [set-identifier]
- cdm.event.common.TradeState: setTrade [set-trade]
- cdm.product.template.NonTransferableProduct: getEconomicTerms [set-economic-terms], getOrCreateEconomicTerms [set-economic-terms], setEconomicTerms [set-economic-terms]
- cdm.product.template.Payout: getAssetPayout [set-payout], getCommodityPayout [set-payout], getCreditDefaultPayout [set-payout], getFixedPricePayout [set-payout], getInterestRatePayout [set-payout], getOptionPayout [set-payout], getOrCreateAssetPayout [set-payout], getOrCreateCommodityPayout [set-payout], getOrCreateCreditDefaultPayout [set-payout], getOrCreateFixedPricePayout [set-payout], getOrCreateInterestRatePayout [set-payout], getOrCreateOptionPayout [set-payout], getOrCreatePerformancePayout [set-payout], getOrCreateSettlementPayout [set-settlement-payout], getPerformancePayout [set-payout], getSettlementPayout [set-settlement-payout], setAssetPayout [set-payout], setCommodityPayout [set-payout], setCreditDefaultPayout [set-payout], setFixedPricePayout [set-payout], setInterestRatePayout [set-payout], setOptionPayout [set-payout], setPerformancePayout [set-payout], setSettlementPayout [set-settlement-payout]
- cdm.product.template.Product: getNonTransferableProduct [set-product], getOrCreateNonTransferableProduct [set-product], getOrCreateTransferableProduct [set-product], getTransferableProduct [set-product], setNonTransferableProduct [set-product], setTransferableProduct [set-product]
- cdm.product.template.SettlementPayout: setPriceQuantity [set-price-quantity]
- cdm.product.template.TradableProduct: getOrCreateProduct [set-product], getProduct [set-product], setProduct [set-product]
