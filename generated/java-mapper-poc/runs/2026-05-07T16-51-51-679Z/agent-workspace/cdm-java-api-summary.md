# CDM Java API Summary

Artifact: org.finos.cdm:cdm-java:6.7.0
Authority: compiled-jar-javap
Total indexed classes: 5183

## Rules

- This summary is an index, not method authority.
- The compiled CDM Java jar inspected by javap is the only source of truth.
- Before using any CDM class builder, call get_cdm_java_class with the exact fully qualified class name.
- Missing-class results apply only to the exact package queried.
- Do not infer a class is missing from a same-simple-name class in another package.

## Prompt Seed Classes

- cdm.event.common.Trade
- cdm.event.common.TradeState
- cdm.event.common.TradeIdentifier
- cdm.product.template.TradableProduct
- cdm.product.template.TradeLot
- cdm.product.template.Product
- cdm.product.template.NonTransferableProduct
- cdm.product.template.EconomicTerms
- cdm.product.template.Payout
- cdm.base.staticdata.party.Party
- cdm.base.staticdata.party.PartyRole
- cdm.base.staticdata.party.Counterparty
- cdm.base.staticdata.party.CounterpartyRoleEnum
- cdm.base.staticdata.party.AncillaryParty
- cdm.base.staticdata.party.Account
- cdm.base.staticdata.asset.common.ProductIdentifier
- cdm.base.staticdata.asset.common.ProductTaxonomy
- cdm.base.staticdata.identifier.Identifier
- cdm.base.staticdata.identifier.AssignedIdentifier
- cdm.observable.asset.PriceQuantity
- cdm.observable.asset.Observable
- cdm.base.math.NonNegativeQuantitySchedule
- cdm.base.math.NonNegativeQuantity
- cdm.base.math.UnitType
- com.rosetta.model.metafields.FieldWithMetaDate

## Exact Missing-Class Observations

- cdm.base.math.PriceSchedule: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.observable.asset.PriceSchedule
- cdm.base.math.PriceTypeEnum: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.observable.asset.PriceTypeEnum
- cdm.base.staticdata.asset.Asset: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.base.staticdata.asset.common.Asset
- cdm.base.staticdata.asset.Cash: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.base.staticdata.asset.common.Cash
- cdm.base.staticdata.party.PartyReference: exact class not found in cdm-java-6.7.0.jar
- cdm.observable.asset.ResolvablePriceQuantity: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.product.common.settlement.ResolvablePriceQuantity
- cdm.product.common.settlement.SettlementPayout: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.product.template.SettlementPayout
- cdm.product.template.CashSettlementTerms: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.product.common.settlement.CashSettlementTerms
- cdm.product.template.SettlementTerms: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.product.common.settlement.SettlementTerms
- cdm.product.template.SettlementTypeEnum: exact class not found in cdm-java-6.7.0.jar
  Same simple-name candidates in jar:
  - cdm.product.common.settlement.SettlementTypeEnum
- com.rosetta.model.lib.records.Date: prompt seed class not found in cdm-java-6.7.0.jar
- com.rosetta.model.metafields.MetaFields: prompt seed class not found in cdm-java-6.7.0.jar
- FpmlFxSingleLeg: not part of CDM Java; use XML parser DTOs or DOM/StAX parsing
