## Class: cdm.event.common.Trade

Exists: yes
Package: cdm.event.common
Builder: cdm.event.common.Trade$TradeBuilder

### Public Methods

```java
public abstract java.util.List<? extends cdm.event.common.TradeIdentifier> getTradeIdentifier()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaDate getTradeDate()
```
```java
public abstract cdm.base.datetime.metafields.FieldWithMetaTimeZone getTradeTime()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.Party> getParty()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.PartyRole> getPartyRole()
```
```java
public abstract cdm.event.common.ExecutionDetails getExecutionDetails()
```
```java
public abstract cdm.event.common.ContractDetails getContractDetails()
```
```java
public abstract com.rosetta.model.lib.records.Date getClearedDate()
```
```java
public abstract cdm.product.collateral.Collateral getCollateral()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.Account> getAccount()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.event.common.Trade build()
```
```java
public abstract cdm.event.common.Trade$TradeBuilder toBuilder()
```
```java
public static cdm.event.common.Trade$TradeBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.event.common.Trade> getType()
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder toBuilder()
```
```java
public default cdm.product.template.TradableProduct build()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```

### Builder Methods

```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder getOrCreateTradeIdentifier(int)
```
```java
public abstract java.util.List<? extends cdm.event.common.TradeIdentifier$TradeIdentifierBuilder> getTradeIdentifier()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaDate$FieldWithMetaDateBuilder getOrCreateTradeDate()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaDate$FieldWithMetaDateBuilder getTradeDate()
```
```java
public abstract cdm.base.datetime.metafields.FieldWithMetaTimeZone$FieldWithMetaTimeZoneBuilder getOrCreateTradeTime()
```
```java
public abstract cdm.base.datetime.metafields.FieldWithMetaTimeZone$FieldWithMetaTimeZoneBuilder getTradeTime()
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder getOrCreateParty(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.Party$PartyBuilder> getParty()
```
```java
public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder getOrCreatePartyRole(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.PartyRole$PartyRoleBuilder> getPartyRole()
```
```java
public abstract cdm.event.common.ExecutionDetails$ExecutionDetailsBuilder getOrCreateExecutionDetails()
```
```java
public abstract cdm.event.common.ExecutionDetails$ExecutionDetailsBuilder getExecutionDetails()
```
```java
public abstract cdm.event.common.ContractDetails$ContractDetailsBuilder getOrCreateContractDetails()
```
```java
public abstract cdm.event.common.ContractDetails$ContractDetailsBuilder getContractDetails()
```
```java
public abstract cdm.product.collateral.Collateral$CollateralBuilder getOrCreateCollateral()
```
```java
public abstract cdm.product.collateral.Collateral$CollateralBuilder getCollateral()
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder getOrCreateAccount(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.Account$AccountBuilder> getAccount()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setProduct(cdm.product.template.NonTransferableProduct)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addTradeLot(cdm.product.template.TradeLot)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addTradeLot(cdm.product.template.TradeLot, int)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addTradeLot(java.util.List<? extends cdm.product.template.TradeLot>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setTradeLot(java.util.List<? extends cdm.product.template.TradeLot>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addCounterparty(cdm.base.staticdata.party.Counterparty)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addCounterparty(cdm.base.staticdata.party.Counterparty, int)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addCounterparty(java.util.List<? extends cdm.base.staticdata.party.Counterparty>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setCounterparty(java.util.List<? extends cdm.base.staticdata.party.Counterparty>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty, int)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addAncillaryParty(java.util.List<? extends cdm.base.staticdata.party.AncillaryParty>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setAncillaryParty(java.util.List<? extends cdm.base.staticdata.party.AncillaryParty>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setAdjustment(cdm.product.common.NotionalAdjustmentEnum)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addTradeIdentifier(cdm.event.common.TradeIdentifier)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addTradeIdentifier(cdm.event.common.TradeIdentifier, int)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addTradeIdentifier(java.util.List<? extends cdm.event.common.TradeIdentifier>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setTradeIdentifier(java.util.List<? extends cdm.event.common.TradeIdentifier>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setTradeDate(com.rosetta.model.metafields.FieldWithMetaDate)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setTradeDateValue(com.rosetta.model.lib.records.Date)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setTradeTime(cdm.base.datetime.metafields.FieldWithMetaTimeZone)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setTradeTimeValue(cdm.base.datetime.TimeZone)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addParty(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addParty(cdm.base.staticdata.party.Party, int)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addParty(java.util.List<? extends cdm.base.staticdata.party.Party>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setParty(java.util.List<? extends cdm.base.staticdata.party.Party>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addPartyRole(cdm.base.staticdata.party.PartyRole)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addPartyRole(cdm.base.staticdata.party.PartyRole, int)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addPartyRole(java.util.List<? extends cdm.base.staticdata.party.PartyRole>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setPartyRole(java.util.List<? extends cdm.base.staticdata.party.PartyRole>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setExecutionDetails(cdm.event.common.ExecutionDetails)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setContractDetails(cdm.event.common.ContractDetails)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setClearedDate(com.rosetta.model.lib.records.Date)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setCollateral(cdm.product.collateral.Collateral)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addAccount(cdm.base.staticdata.party.Account)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addAccount(cdm.base.staticdata.party.Account, int)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder addAccount(java.util.List<? extends cdm.base.staticdata.party.Account>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setAccount(java.util.List<? extends cdm.base.staticdata.party.Account>)
```
```java
public abstract cdm.event.common.Trade$TradeBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.product.collateral.Collateral getCollateral()
```
```java
public default cdm.event.common.ContractDetails getContractDetails()
```
```java
public default cdm.event.common.ExecutionDetails getExecutionDetails()
```
```java
public default cdm.base.datetime.metafields.FieldWithMetaTimeZone getTradeTime()
```
```java
public default com.rosetta.model.metafields.FieldWithMetaDate getTradeDate()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder setAdjustment(cdm.product.common.NotionalAdjustmentEnum)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder setAncillaryParty(java.util.List)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(java.util.List)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty, int)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder setCounterparty(java.util.List)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(java.util.List)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(cdm.base.staticdata.party.Counterparty, int)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(cdm.base.staticdata.party.Counterparty)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder setTradeLot(java.util.List)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addTradeLot(java.util.List)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addTradeLot(cdm.product.template.TradeLot, int)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder addTradeLot(cdm.product.template.TradeLot)
```
```java
public default cdm.product.template.TradableProduct$TradableProductBuilder setProduct(cdm.product.template.NonTransferableProduct)
```

