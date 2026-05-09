# CDM Java API Pack

Artifact: org.finos.cdm:cdm-java:6.7.0
Authority: compiled-jar-javap
Javadocs: https://javadoc.io/doc/org.finos.cdm/cdm-java/6.7.0/
Maven directory: https://repo1.maven.org/maven2/org/finos/cdm/cdm-java/6.7.0/

## Rules

- Use only classes listed as Exists: yes.
- Use only builder methods listed under the class.
- Do not import classes listed under Negative Classes.
- Do not infer CDM Java packages from Rosetta function names or JSON paths.
- CDM Java does not provide FpML input model classes; parse FpML XML with DOM/StAX or generated internal DTOs.

## Allowed Classes

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



## Class: cdm.event.common.TradeState

Exists: yes
Package: cdm.event.common
Builder: cdm.event.common.TradeState$TradeStateBuilder

### Public Methods

```java
public abstract cdm.event.common.Trade getTrade()
```
```java
public abstract cdm.event.common.State getState()
```
```java
public abstract java.util.List<? extends cdm.event.common.Reset> getResetHistory()
```
```java
public abstract java.util.List<? extends cdm.event.common.TransferState> getTransferHistory()
```
```java
public abstract java.util.List<? extends cdm.event.common.ObservationEvent> getObservationHistory()
```
```java
public abstract java.util.List<? extends cdm.event.common.Valuation> getValuationHistory()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.event.common.TradeState build()
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder toBuilder()
```
```java
public static cdm.event.common.TradeState$TradeStateBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.event.common.TradeState> getType()
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
public abstract cdm.event.common.Trade$TradeBuilder getOrCreateTrade()
```
```java
public abstract cdm.event.common.Trade$TradeBuilder getTrade()
```
```java
public abstract cdm.event.common.State$StateBuilder getOrCreateState()
```
```java
public abstract cdm.event.common.State$StateBuilder getState()
```
```java
public abstract cdm.event.common.Reset$ResetBuilder getOrCreateResetHistory(int)
```
```java
public abstract java.util.List<? extends cdm.event.common.Reset$ResetBuilder> getResetHistory()
```
```java
public abstract cdm.event.common.TransferState$TransferStateBuilder getOrCreateTransferHistory(int)
```
```java
public abstract java.util.List<? extends cdm.event.common.TransferState$TransferStateBuilder> getTransferHistory()
```
```java
public abstract cdm.event.common.ObservationEvent$ObservationEventBuilder getOrCreateObservationHistory(int)
```
```java
public abstract java.util.List<? extends cdm.event.common.ObservationEvent$ObservationEventBuilder> getObservationHistory()
```
```java
public abstract cdm.event.common.Valuation$ValuationBuilder getOrCreateValuationHistory(int)
```
```java
public abstract java.util.List<? extends cdm.event.common.Valuation$ValuationBuilder> getValuationHistory()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder setTrade(cdm.event.common.Trade)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder setState(cdm.event.common.State)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addResetHistory(cdm.event.common.Reset)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addResetHistory(cdm.event.common.Reset, int)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addResetHistory(java.util.List<? extends cdm.event.common.Reset>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder setResetHistory(java.util.List<? extends cdm.event.common.Reset>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addTransferHistory(cdm.event.common.TransferState)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addTransferHistory(cdm.event.common.TransferState, int)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addTransferHistory(java.util.List<? extends cdm.event.common.TransferState>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder setTransferHistory(java.util.List<? extends cdm.event.common.TransferState>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addObservationHistory(cdm.event.common.ObservationEvent)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addObservationHistory(cdm.event.common.ObservationEvent, int)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addObservationHistory(java.util.List<? extends cdm.event.common.ObservationEvent>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder setObservationHistory(java.util.List<? extends cdm.event.common.ObservationEvent>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addValuationHistory(cdm.event.common.Valuation)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addValuationHistory(cdm.event.common.Valuation, int)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder addValuationHistory(java.util.List<? extends cdm.event.common.Valuation>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder setValuationHistory(java.util.List<? extends cdm.event.common.Valuation>)
```
```java
public abstract cdm.event.common.TradeState$TradeStateBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.event.common.State getState()
```
```java
public default cdm.event.common.Trade getTrade()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.event.common.TradeIdentifier

Exists: yes
Package: cdm.event.common
Builder: cdm.event.common.TradeIdentifier$TradeIdentifierBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.identifier.TradeIdentifierTypeEnum getIdentifierType()
```
```java
public abstract cdm.event.common.TradeIdentifier build()
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder toBuilder()
```
```java
public static cdm.event.common.TradeIdentifier$TradeIdentifierBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.event.common.TradeIdentifier> getType()
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder toBuilder()
```
```java
public default cdm.base.staticdata.identifier.Identifier build()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setIssuerReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setIssuerReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setIssuer(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setIssuerValue(java.lang.String)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier, int)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder addAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setIdentifierType(cdm.base.staticdata.identifier.TradeIdentifierTypeEnum)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setAssignedIdentifier(java.util.List)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(java.util.List)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier, int)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuerValue(java.lang.String)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuer(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuerReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuerReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```



## Class: cdm.product.template.TradableProduct

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.TradableProduct$TradableProductBuilder

### Public Methods

```java
public abstract cdm.product.template.NonTransferableProduct getProduct()
```
```java
public abstract java.util.List<? extends cdm.product.template.TradeLot> getTradeLot()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.Counterparty> getCounterparty()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.AncillaryParty> getAncillaryParty()
```
```java
public abstract cdm.product.common.NotionalAdjustmentEnum getAdjustment()
```
```java
public abstract cdm.product.template.TradableProduct build()
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder toBuilder()
```
```java
public static cdm.product.template.TradableProduct$TradableProductBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.TradableProduct> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getOrCreateProduct()
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getProduct()
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder getOrCreateTradeLot(int)
```
```java
public abstract java.util.List<? extends cdm.product.template.TradeLot$TradeLotBuilder> getTradeLot()
```
```java
public abstract cdm.base.staticdata.party.Counterparty$CounterpartyBuilder getOrCreateCounterparty(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.Counterparty$CounterpartyBuilder> getCounterparty()
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder getOrCreateAncillaryParty(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder> getAncillaryParty()
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder setProduct(cdm.product.template.NonTransferableProduct)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addTradeLot(cdm.product.template.TradeLot)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addTradeLot(cdm.product.template.TradeLot, int)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addTradeLot(java.util.List<? extends cdm.product.template.TradeLot>)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder setTradeLot(java.util.List<? extends cdm.product.template.TradeLot>)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(cdm.base.staticdata.party.Counterparty)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(cdm.base.staticdata.party.Counterparty, int)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(java.util.List<? extends cdm.base.staticdata.party.Counterparty>)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder setCounterparty(java.util.List<? extends cdm.base.staticdata.party.Counterparty>)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty, int)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(java.util.List<? extends cdm.base.staticdata.party.AncillaryParty>)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder setAncillaryParty(java.util.List<? extends cdm.base.staticdata.party.AncillaryParty>)
```
```java
public abstract cdm.product.template.TradableProduct$TradableProductBuilder setAdjustment(cdm.product.common.NotionalAdjustmentEnum)
```
```java
public default cdm.product.template.NonTransferableProduct getProduct()
```



## Class: cdm.product.template.TradeLot

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.TradeLot$TradeLotBuilder

### Public Methods

```java
public abstract java.util.List<? extends cdm.base.staticdata.identifier.Identifier> getLotIdentifier()
```
```java
public abstract java.util.List<? extends cdm.observable.asset.PriceQuantity> getPriceQuantity()
```
```java
public abstract cdm.product.template.TradeLot build()
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder toBuilder()
```
```java
public static cdm.product.template.TradeLot$TradeLotBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.TradeLot> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder getOrCreateLotIdentifier(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.identifier.Identifier$IdentifierBuilder> getLotIdentifier()
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder getOrCreatePriceQuantity(int)
```
```java
public abstract java.util.List<? extends cdm.observable.asset.PriceQuantity$PriceQuantityBuilder> getPriceQuantity()
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder addLotIdentifier(cdm.base.staticdata.identifier.Identifier)
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder addLotIdentifier(cdm.base.staticdata.identifier.Identifier, int)
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder addLotIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.Identifier>)
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder setLotIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.Identifier>)
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder addPriceQuantity(cdm.observable.asset.PriceQuantity)
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder addPriceQuantity(cdm.observable.asset.PriceQuantity, int)
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder addPriceQuantity(java.util.List<? extends cdm.observable.asset.PriceQuantity>)
```
```java
public abstract cdm.product.template.TradeLot$TradeLotBuilder setPriceQuantity(java.util.List<? extends cdm.observable.asset.PriceQuantity>)
```



## Class: cdm.product.template.Product

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.Product$ProductBuilder

### Public Methods

```java
public abstract cdm.product.template.TransferableProduct getTransferableProduct()
```
```java
public abstract cdm.product.template.NonTransferableProduct getNonTransferableProduct()
```
```java
public abstract cdm.product.template.Product build()
```
```java
public abstract cdm.product.template.Product$ProductBuilder toBuilder()
```
```java
public static cdm.product.template.Product$ProductBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.Product> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.product.template.TransferableProduct$TransferableProductBuilder getOrCreateTransferableProduct()
```
```java
public abstract cdm.product.template.TransferableProduct$TransferableProductBuilder getTransferableProduct()
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getOrCreateNonTransferableProduct()
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getNonTransferableProduct()
```
```java
public abstract cdm.product.template.Product$ProductBuilder setTransferableProduct(cdm.product.template.TransferableProduct)
```
```java
public abstract cdm.product.template.Product$ProductBuilder setNonTransferableProduct(cdm.product.template.NonTransferableProduct)
```
```java
public default cdm.product.template.NonTransferableProduct getNonTransferableProduct()
```
```java
public default cdm.product.template.TransferableProduct getTransferableProduct()
```



## Class: cdm.product.template.NonTransferableProduct

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder

### Public Methods

```java
public abstract java.util.List<? extends cdm.base.staticdata.asset.common.ProductIdentifier> getIdentifier()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.asset.common.ProductTaxonomy> getTaxonomy()
```
```java
public abstract cdm.product.template.EconomicTerms getEconomicTerms()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.product.template.NonTransferableProduct build()
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder toBuilder()
```
```java
public static cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.NonTransferableProduct> getType()
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
public abstract cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder getOrCreateIdentifier(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder> getIdentifier()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder getOrCreateTaxonomy(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder> getTaxonomy()
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder getOrCreateEconomicTerms()
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder getEconomicTerms()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder addIdentifier(cdm.base.staticdata.asset.common.ProductIdentifier)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder addIdentifier(cdm.base.staticdata.asset.common.ProductIdentifier, int)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder addIdentifier(java.util.List<? extends cdm.base.staticdata.asset.common.ProductIdentifier>)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder setIdentifier(java.util.List<? extends cdm.base.staticdata.asset.common.ProductIdentifier>)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder addTaxonomy(cdm.base.staticdata.asset.common.ProductTaxonomy)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder addTaxonomy(cdm.base.staticdata.asset.common.ProductTaxonomy, int)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder addTaxonomy(java.util.List<? extends cdm.base.staticdata.asset.common.ProductTaxonomy>)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder setTaxonomy(java.util.List<? extends cdm.base.staticdata.asset.common.ProductTaxonomy>)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder setEconomicTerms(cdm.product.template.EconomicTerms)
```
```java
public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.product.template.EconomicTerms getEconomicTerms()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.product.template.EconomicTerms

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.EconomicTerms$EconomicTermsBuilder

### Public Methods

```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate getEffectiveDate()
```
```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate getTerminationDate()
```
```java
public abstract cdm.base.datetime.BusinessDayAdjustments getDateAdjustments()
```
```java
public abstract java.util.List<? extends cdm.product.template.Payout> getPayout()
```
```java
public abstract cdm.product.template.TerminationProvision getTerminationProvision()
```
```java
public abstract cdm.observable.asset.CalculationAgent getCalculationAgent()
```
```java
public abstract java.lang.Boolean getNonStandardisedTerms()
```
```java
public abstract cdm.product.collateral.Collateral getCollateral()
```
```java
public abstract cdm.product.template.EconomicTerms build()
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder toBuilder()
```
```java
public static cdm.product.template.EconomicTerms$EconomicTermsBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.EconomicTerms> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate$AdjustableOrRelativeDateBuilder getOrCreateEffectiveDate()
```
```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate$AdjustableOrRelativeDateBuilder getEffectiveDate()
```
```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate$AdjustableOrRelativeDateBuilder getOrCreateTerminationDate()
```
```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate$AdjustableOrRelativeDateBuilder getTerminationDate()
```
```java
public abstract cdm.base.datetime.BusinessDayAdjustments$BusinessDayAdjustmentsBuilder getOrCreateDateAdjustments()
```
```java
public abstract cdm.base.datetime.BusinessDayAdjustments$BusinessDayAdjustmentsBuilder getDateAdjustments()
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder getOrCreatePayout(int)
```
```java
public abstract java.util.List<? extends cdm.product.template.Payout$PayoutBuilder> getPayout()
```
```java
public abstract cdm.product.template.TerminationProvision$TerminationProvisionBuilder getOrCreateTerminationProvision()
```
```java
public abstract cdm.product.template.TerminationProvision$TerminationProvisionBuilder getTerminationProvision()
```
```java
public abstract cdm.observable.asset.CalculationAgent$CalculationAgentBuilder getOrCreateCalculationAgent()
```
```java
public abstract cdm.observable.asset.CalculationAgent$CalculationAgentBuilder getCalculationAgent()
```
```java
public abstract cdm.product.collateral.Collateral$CollateralBuilder getOrCreateCollateral()
```
```java
public abstract cdm.product.collateral.Collateral$CollateralBuilder getCollateral()
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setEffectiveDate(cdm.base.datetime.AdjustableOrRelativeDate)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setTerminationDate(cdm.base.datetime.AdjustableOrRelativeDate)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setDateAdjustments(cdm.base.datetime.BusinessDayAdjustments)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder addPayout(cdm.product.template.Payout)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder addPayout(cdm.product.template.Payout, int)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder addPayout(java.util.List<? extends cdm.product.template.Payout>)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setPayout(java.util.List<? extends cdm.product.template.Payout>)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setTerminationProvision(cdm.product.template.TerminationProvision)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setCalculationAgent(cdm.observable.asset.CalculationAgent)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setNonStandardisedTerms(java.lang.Boolean)
```
```java
public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder setCollateral(cdm.product.collateral.Collateral)
```
```java
public default cdm.product.collateral.Collateral getCollateral()
```
```java
public default cdm.observable.asset.CalculationAgent getCalculationAgent()
```
```java
public default cdm.product.template.TerminationProvision getTerminationProvision()
```
```java
public default cdm.base.datetime.BusinessDayAdjustments getDateAdjustments()
```
```java
public default cdm.base.datetime.AdjustableOrRelativeDate getTerminationDate()
```
```java
public default cdm.base.datetime.AdjustableOrRelativeDate getEffectiveDate()
```



## Class: cdm.product.template.Payout

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.Payout$PayoutBuilder

### Public Methods

```java
public abstract cdm.product.template.AssetPayout getAssetPayout()
```
```java
public abstract cdm.product.asset.CommodityPayout getCommodityPayout()
```
```java
public abstract cdm.product.asset.CreditDefaultPayout getCreditDefaultPayout()
```
```java
public abstract cdm.product.template.FixedPricePayout getFixedPricePayout()
```
```java
public abstract cdm.product.asset.InterestRatePayout getInterestRatePayout()
```
```java
public abstract cdm.product.template.OptionPayout getOptionPayout()
```
```java
public abstract cdm.product.template.PerformancePayout getPerformancePayout()
```
```java
public abstract cdm.product.template.SettlementPayout getSettlementPayout()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.product.template.Payout build()
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder toBuilder()
```
```java
public static cdm.product.template.Payout$PayoutBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.Payout> getType()
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
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder getOrCreateAssetPayout()
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder getAssetPayout()
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder getOrCreateCommodityPayout()
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder getCommodityPayout()
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder getOrCreateCreditDefaultPayout()
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder getCreditDefaultPayout()
```
```java
public abstract cdm.product.template.FixedPricePayout$FixedPricePayoutBuilder getOrCreateFixedPricePayout()
```
```java
public abstract cdm.product.template.FixedPricePayout$FixedPricePayoutBuilder getFixedPricePayout()
```
```java
public abstract cdm.product.asset.InterestRatePayout$InterestRatePayoutBuilder getOrCreateInterestRatePayout()
```
```java
public abstract cdm.product.asset.InterestRatePayout$InterestRatePayoutBuilder getInterestRatePayout()
```
```java
public abstract cdm.product.template.OptionPayout$OptionPayoutBuilder getOrCreateOptionPayout()
```
```java
public abstract cdm.product.template.OptionPayout$OptionPayoutBuilder getOptionPayout()
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder getOrCreatePerformancePayout()
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder getPerformancePayout()
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder getOrCreateSettlementPayout()
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder getSettlementPayout()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setAssetPayout(cdm.product.template.AssetPayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setCommodityPayout(cdm.product.asset.CommodityPayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setCreditDefaultPayout(cdm.product.asset.CreditDefaultPayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setFixedPricePayout(cdm.product.template.FixedPricePayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setInterestRatePayout(cdm.product.asset.InterestRatePayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setOptionPayout(cdm.product.template.OptionPayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setPerformancePayout(cdm.product.template.PerformancePayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setSettlementPayout(cdm.product.template.SettlementPayout)
```
```java
public abstract cdm.product.template.Payout$PayoutBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.product.template.SettlementPayout getSettlementPayout()
```
```java
public default cdm.product.template.PerformancePayout getPerformancePayout()
```
```java
public default cdm.product.template.OptionPayout getOptionPayout()
```
```java
public default cdm.product.asset.InterestRatePayout getInterestRatePayout()
```
```java
public default cdm.product.template.FixedPricePayout getFixedPricePayout()
```
```java
public default cdm.product.asset.CreditDefaultPayout getCreditDefaultPayout()
```
```java
public default cdm.product.asset.CommodityPayout getCommodityPayout()
```
```java
public default cdm.product.template.AssetPayout getAssetPayout()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.base.staticdata.party.Party

Exists: yes
Package: cdm.base.staticdata.party
Builder: cdm.base.staticdata.party.Party$PartyBuilder

### Public Methods

```java
public abstract java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier> getPartyId()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getName()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.BusinessUnit> getBusinessUnit()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPerson> getPerson()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole> getPersonRole()
```
```java
public abstract cdm.base.staticdata.party.Account getAccount()
```
```java
public abstract cdm.base.staticdata.party.ContactInformation getContactInformation()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.base.staticdata.party.Party build()
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder toBuilder()
```
```java
public static cdm.base.staticdata.party.Party$PartyBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.party.Party> getType()
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
public abstract cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder getOrCreatePartyId(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder> getPartyId()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateName()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getName()
```
```java
public abstract cdm.base.staticdata.party.BusinessUnit$BusinessUnitBuilder getOrCreateBusinessUnit(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.BusinessUnit$BusinessUnitBuilder> getBusinessUnit()
```
```java
public abstract cdm.base.staticdata.party.NaturalPerson$NaturalPersonBuilder getOrCreatePerson(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPerson$NaturalPersonBuilder> getPerson()
```
```java
public abstract cdm.base.staticdata.party.NaturalPersonRole$NaturalPersonRoleBuilder getOrCreatePersonRole(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole$NaturalPersonRoleBuilder> getPersonRole()
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder getOrCreateAccount()
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder getAccount()
```
```java
public abstract cdm.base.staticdata.party.ContactInformation$ContactInformationBuilder getOrCreateContactInformation()
```
```java
public abstract cdm.base.staticdata.party.ContactInformation$ContactInformationBuilder getContactInformation()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(cdm.base.staticdata.party.PartyIdentifier)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(cdm.base.staticdata.party.PartyIdentifier, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setPartyId(java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setName(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setNameValue(java.lang.String)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addBusinessUnit(cdm.base.staticdata.party.BusinessUnit)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addBusinessUnit(cdm.base.staticdata.party.BusinessUnit, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addBusinessUnit(java.util.List<? extends cdm.base.staticdata.party.BusinessUnit>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setBusinessUnit(java.util.List<? extends cdm.base.staticdata.party.BusinessUnit>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPerson(cdm.base.staticdata.party.NaturalPerson)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPerson(cdm.base.staticdata.party.NaturalPerson, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPerson(java.util.List<? extends cdm.base.staticdata.party.NaturalPerson>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setPerson(java.util.List<? extends cdm.base.staticdata.party.NaturalPerson>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPersonRole(cdm.base.staticdata.party.NaturalPersonRole)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPersonRole(cdm.base.staticdata.party.NaturalPersonRole, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPersonRole(java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setPersonRole(java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setAccount(cdm.base.staticdata.party.Account)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setContactInformation(cdm.base.staticdata.party.ContactInformation)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.base.staticdata.party.ContactInformation getContactInformation()
```
```java
public default cdm.base.staticdata.party.Account getAccount()
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getName()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.base.staticdata.party.PartyRole

Exists: yes
Package: cdm.base.staticdata.party
Builder: cdm.base.staticdata.party.PartyRole$PartyRoleBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getPartyReference()
```
```java
public abstract cdm.base.staticdata.party.PartyRoleEnum getRole()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getOwnershipPartyReference()
```
```java
public abstract cdm.base.staticdata.party.PartyRole build()
```
```java
public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder toBuilder()
```
```java
public static cdm.base.staticdata.party.PartyRole$PartyRoleBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.party.PartyRole> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreatePartyReference()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getPartyReference()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreateOwnershipPartyReference()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOwnershipPartyReference()
```
```java
public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder setPartyReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder setPartyReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder setRole(cdm.base.staticdata.party.PartyRoleEnum)
```
```java
public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder setOwnershipPartyReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder setOwnershipPartyReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public default cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getOwnershipPartyReference()
```
```java
public default cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getPartyReference()
```



## Class: cdm.base.staticdata.party.Counterparty

Exists: yes
Package: cdm.base.staticdata.party
Builder: cdm.base.staticdata.party.Counterparty$CounterpartyBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.party.CounterpartyRoleEnum getRole()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getPartyReference()
```
```java
public abstract cdm.base.staticdata.party.Counterparty build()
```
```java
public abstract cdm.base.staticdata.party.Counterparty$CounterpartyBuilder toBuilder()
```
```java
public static cdm.base.staticdata.party.Counterparty$CounterpartyBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.party.Counterparty> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreatePartyReference()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getPartyReference()
```
```java
public abstract cdm.base.staticdata.party.Counterparty$CounterpartyBuilder setRole(cdm.base.staticdata.party.CounterpartyRoleEnum)
```
```java
public abstract cdm.base.staticdata.party.Counterparty$CounterpartyBuilder setPartyReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.party.Counterparty$CounterpartyBuilder setPartyReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public default cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getPartyReference()
```



## Class: cdm.base.staticdata.party.CounterpartyRoleEnum

Exists: yes
Package: cdm.base.staticdata.party
Builder: none detected

### Public Methods



### Builder Methods

- none



## Class: cdm.base.staticdata.party.AncillaryParty

Exists: yes
Package: cdm.base.staticdata.party
Builder: cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.party.AncillaryRoleEnum getRole()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.metafields.ReferenceWithMetaParty> getPartyReference()
```
```java
public abstract cdm.base.staticdata.party.CounterpartyRoleEnum getOnBehalfOf()
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty build()
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder toBuilder()
```
```java
public static cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.party.AncillaryParty> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreatePartyReference(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder> getPartyReference()
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder setRole(cdm.base.staticdata.party.AncillaryRoleEnum)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder addPartyReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder addPartyReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty, int)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder addPartyReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder addPartyReferenceValue(cdm.base.staticdata.party.Party, int)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder addPartyReference(java.util.List<? extends cdm.base.staticdata.party.metafields.ReferenceWithMetaParty>)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder setPartyReference(java.util.List<? extends cdm.base.staticdata.party.metafields.ReferenceWithMetaParty>)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder addPartyReferenceValue(java.util.List<? extends cdm.base.staticdata.party.Party>)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder setPartyReferenceValue(java.util.List<? extends cdm.base.staticdata.party.Party>)
```
```java
public abstract cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder setOnBehalfOf(cdm.base.staticdata.party.CounterpartyRoleEnum)
```



## Class: cdm.base.staticdata.party.Account

Exists: yes
Package: cdm.base.staticdata.party
Builder: cdm.base.staticdata.party.Account$AccountBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getPartyReference()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getAccountNumber()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getAccountName()
```
```java
public abstract cdm.base.staticdata.party.metafields.FieldWithMetaAccountTypeEnum getAccountType()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getAccountBeneficiary()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getServicingParty()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.base.staticdata.party.Account build()
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder toBuilder()
```
```java
public static cdm.base.staticdata.party.Account$AccountBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.party.Account> getType()
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
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreatePartyReference()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getPartyReference()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateAccountNumber()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getAccountNumber()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateAccountName()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getAccountName()
```
```java
public abstract cdm.base.staticdata.party.metafields.FieldWithMetaAccountTypeEnum$FieldWithMetaAccountTypeEnumBuilder getOrCreateAccountType()
```
```java
public abstract cdm.base.staticdata.party.metafields.FieldWithMetaAccountTypeEnum$FieldWithMetaAccountTypeEnumBuilder getAccountType()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreateAccountBeneficiary()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getAccountBeneficiary()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreateServicingParty()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getServicingParty()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setPartyReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setPartyReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountNumber(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountNumberValue(java.lang.String)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountName(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountNameValue(java.lang.String)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountType(cdm.base.staticdata.party.metafields.FieldWithMetaAccountTypeEnum)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountTypeValue(cdm.base.staticdata.party.AccountTypeEnum)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountBeneficiary(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setAccountBeneficiaryValue(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setServicingParty(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setServicingPartyValue(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getServicingParty()
```
```java
public default cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getAccountBeneficiary()
```
```java
public default cdm.base.staticdata.party.metafields.FieldWithMetaAccountTypeEnum getAccountType()
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getAccountName()
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getAccountNumber()
```
```java
public default cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getPartyReference()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.base.staticdata.asset.common.ProductIdentifier

Exists: yes
Package: cdm.base.staticdata.asset.common
Builder: cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder

### Public Methods

```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getIdentifier()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductIdTypeEnum getSource()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductIdentifier build()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder toBuilder()
```
```java
public static cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.asset.common.ProductIdentifier> getType()
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
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateIdentifier()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getIdentifier()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder setIdentifier(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder setIdentifierValue(java.lang.String)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder setSource(cdm.base.staticdata.asset.common.ProductIdTypeEnum)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductIdentifier$ProductIdentifierBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getIdentifier()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.base.staticdata.asset.common.ProductTaxonomy

Exists: yes
Package: cdm.base.staticdata.asset.common
Builder: cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum getPrimaryAssetClass()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum> getSecondaryAssetClass()
```
```java
public abstract java.lang.String getProductQualifier()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy build()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder toBuilder()
```
```java
public static cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.asset.common.ProductTaxonomy> getType()
```
```java
public default cdm.base.staticdata.asset.common.Taxonomy$TaxonomyBuilder toBuilder()
```
```java
public default cdm.base.staticdata.asset.common.Taxonomy build()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum$FieldWithMetaAssetClassEnumBuilder getOrCreatePrimaryAssetClass()
```
```java
public abstract cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum$FieldWithMetaAssetClassEnumBuilder getPrimaryAssetClass()
```
```java
public abstract cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum$FieldWithMetaAssetClassEnumBuilder getOrCreateSecondaryAssetClass(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum$FieldWithMetaAssetClassEnumBuilder> getSecondaryAssetClass()
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder setSource(cdm.base.staticdata.asset.common.TaxonomySourceEnum)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder setValue(cdm.base.staticdata.asset.common.TaxonomyValue)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder setPrimaryAssetClass(cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder setPrimaryAssetClassValue(cdm.base.staticdata.asset.common.AssetClassEnum)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder addSecondaryAssetClass(cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder addSecondaryAssetClass(cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum, int)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder addSecondaryAssetClassValue(cdm.base.staticdata.asset.common.AssetClassEnum)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder addSecondaryAssetClassValue(cdm.base.staticdata.asset.common.AssetClassEnum, int)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder addSecondaryAssetClass(java.util.List<? extends cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum>)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder setSecondaryAssetClass(java.util.List<? extends cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum>)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder addSecondaryAssetClassValue(java.util.List<? extends cdm.base.staticdata.asset.common.AssetClassEnum>)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder setSecondaryAssetClassValue(java.util.List<? extends cdm.base.staticdata.asset.common.AssetClassEnum>)
```
```java
public abstract cdm.base.staticdata.asset.common.ProductTaxonomy$ProductTaxonomyBuilder setProductQualifier(java.lang.String)
```
```java
public default cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum getPrimaryAssetClass()
```
```java
public default cdm.base.staticdata.asset.common.Taxonomy$TaxonomyBuilder setValue(cdm.base.staticdata.asset.common.TaxonomyValue)
```
```java
public default cdm.base.staticdata.asset.common.Taxonomy$TaxonomyBuilder setSource(cdm.base.staticdata.asset.common.TaxonomySourceEnum)
```



## Class: cdm.base.staticdata.identifier.Identifier

Exists: yes
Package: cdm.base.staticdata.identifier
Builder: cdm.base.staticdata.identifier.Identifier$IdentifierBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getIssuerReference()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getIssuer()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier> getAssignedIdentifier()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.base.staticdata.identifier.Identifier build()
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder toBuilder()
```
```java
public static cdm.base.staticdata.identifier.Identifier$IdentifierBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.identifier.Identifier> getType()
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
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getOrCreateIssuerReference()
```
```java
public abstract cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder getIssuerReference()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateIssuer()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getIssuer()
```
```java
public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder getOrCreateAssignedIdentifier(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder> getAssignedIdentifier()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuerReference(cdm.base.staticdata.party.metafields.ReferenceWithMetaParty)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuerReferenceValue(cdm.base.staticdata.party.Party)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuer(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setIssuerValue(java.lang.String)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier, int)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)
```
```java
public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getIssuer()
```
```java
public default cdm.base.staticdata.party.metafields.ReferenceWithMetaParty getIssuerReference()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.base.staticdata.identifier.AssignedIdentifier

Exists: yes
Package: cdm.base.staticdata.identifier
Builder: cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder

### Public Methods

```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getIdentifier()
```
```java
public abstract java.lang.Integer getVersion()
```
```java
public abstract cdm.base.staticdata.identifier.AssignedIdentifier build()
```
```java
public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder toBuilder()
```
```java
public static cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.identifier.AssignedIdentifier> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateIdentifier()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getIdentifier()
```
```java
public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder setIdentifier(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder setIdentifierValue(java.lang.String)
```
```java
public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder setVersion(java.lang.Integer)
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getIdentifier()
```



## Class: cdm.observable.asset.PriceQuantity

Exists: yes
Package: cdm.observable.asset
Builder: cdm.observable.asset.PriceQuantity$PriceQuantityBuilder

### Public Methods

```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.FieldWithMetaPriceSchedule> getPrice()
```
```java
public abstract java.util.List<? extends cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule> getQuantity()
```
```java
public abstract cdm.observable.asset.metafields.FieldWithMetaObservable getObservable()
```
```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate getEffectiveDate()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.observable.asset.PriceQuantity build()
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder toBuilder()
```
```java
public static cdm.observable.asset.PriceQuantity$PriceQuantityBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.observable.asset.PriceQuantity> getType()
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
public abstract cdm.observable.asset.metafields.FieldWithMetaPriceSchedule$FieldWithMetaPriceScheduleBuilder getOrCreatePrice(int)
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.FieldWithMetaPriceSchedule$FieldWithMetaPriceScheduleBuilder> getPrice()
```
```java
public abstract cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule$FieldWithMetaNonNegativeQuantityScheduleBuilder getOrCreateQuantity(int)
```
```java
public abstract java.util.List<? extends cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule$FieldWithMetaNonNegativeQuantityScheduleBuilder> getQuantity()
```
```java
public abstract cdm.observable.asset.metafields.FieldWithMetaObservable$FieldWithMetaObservableBuilder getOrCreateObservable()
```
```java
public abstract cdm.observable.asset.metafields.FieldWithMetaObservable$FieldWithMetaObservableBuilder getObservable()
```
```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate$AdjustableOrRelativeDateBuilder getOrCreateEffectiveDate()
```
```java
public abstract cdm.base.datetime.AdjustableOrRelativeDate$AdjustableOrRelativeDateBuilder getEffectiveDate()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addPrice(cdm.observable.asset.metafields.FieldWithMetaPriceSchedule)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addPrice(cdm.observable.asset.metafields.FieldWithMetaPriceSchedule, int)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addPriceValue(cdm.observable.asset.PriceSchedule)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addPriceValue(cdm.observable.asset.PriceSchedule, int)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addPrice(java.util.List<? extends cdm.observable.asset.metafields.FieldWithMetaPriceSchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setPrice(java.util.List<? extends cdm.observable.asset.metafields.FieldWithMetaPriceSchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addQuantity(cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addQuantity(cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule, int)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addQuantityValue(cdm.base.math.NonNegativeQuantitySchedule)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addQuantityValue(cdm.base.math.NonNegativeQuantitySchedule, int)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addQuantity(java.util.List<? extends cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setQuantity(java.util.List<? extends cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder addQuantityValue(java.util.List<? extends cdm.base.math.NonNegativeQuantitySchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setQuantityValue(java.util.List<? extends cdm.base.math.NonNegativeQuantitySchedule>)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setObservable(cdm.observable.asset.metafields.FieldWithMetaObservable)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setObservableValue(cdm.observable.asset.Observable)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setEffectiveDate(cdm.base.datetime.AdjustableOrRelativeDate)
```
```java
public abstract cdm.observable.asset.PriceQuantity$PriceQuantityBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.base.datetime.AdjustableOrRelativeDate getEffectiveDate()
```
```java
public default cdm.observable.asset.metafields.FieldWithMetaObservable getObservable()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Class: cdm.observable.asset.Observable

Exists: yes
Package: cdm.observable.asset
Builder: cdm.observable.asset.Observable$ObservableBuilder

### Public Methods

```java
public abstract cdm.base.staticdata.asset.common.Asset getAsset()
```
```java
public abstract cdm.observable.asset.Basket getBasket()
```
```java
public abstract cdm.observable.asset.Index getIndex()
```
```java
public abstract cdm.observable.asset.Observable build()
```
```java
public abstract cdm.observable.asset.Observable$ObservableBuilder toBuilder()
```
```java
public static cdm.observable.asset.Observable$ObservableBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.observable.asset.Observable> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.staticdata.asset.common.Asset$AssetBuilder getOrCreateAsset()
```
```java
public abstract cdm.base.staticdata.asset.common.Asset$AssetBuilder getAsset()
```
```java
public abstract cdm.observable.asset.Basket$BasketBuilder getOrCreateBasket()
```
```java
public abstract cdm.observable.asset.Basket$BasketBuilder getBasket()
```
```java
public abstract cdm.observable.asset.Index$IndexBuilder getOrCreateIndex()
```
```java
public abstract cdm.observable.asset.Index$IndexBuilder getIndex()
```
```java
public abstract cdm.observable.asset.Observable$ObservableBuilder setAsset(cdm.base.staticdata.asset.common.Asset)
```
```java
public abstract cdm.observable.asset.Observable$ObservableBuilder setBasket(cdm.observable.asset.Basket)
```
```java
public abstract cdm.observable.asset.Observable$ObservableBuilder setIndex(cdm.observable.asset.Index)
```
```java
public default cdm.observable.asset.Index getIndex()
```
```java
public default cdm.observable.asset.Basket getBasket()
```
```java
public default cdm.base.staticdata.asset.common.Asset getAsset()
```



## Class: cdm.base.math.NonNegativeQuantitySchedule

Exists: yes
Package: cdm.base.math
Builder: cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder

### Public Methods

```java
public abstract cdm.base.math.NonNegativeQuantitySchedule build()
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder toBuilder()
```
```java
public static cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.math.NonNegativeQuantitySchedule> getType()
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder toBuilder()
```
```java
public default cdm.base.math.QuantitySchedule build()
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder toBuilder()
```
```java
public default cdm.base.math.MeasureSchedule build()
```
```java
public default cdm.base.math.MeasureBase$MeasureBaseBuilder toBuilder()
```
```java
public default cdm.base.math.MeasureBase build()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setValue(java.math.BigDecimal)
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setUnit(cdm.base.math.UnitType)
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder addDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setMultiplier(cdm.base.math.Measure)
```
```java
public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setFrequency(cdm.base.datetime.Frequency)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setFrequency(cdm.base.datetime.Frequency)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setMultiplier(cdm.base.math.Measure)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setDatedValue(java.util.List)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(java.util.List)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setUnit(cdm.base.math.UnitType)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setValue(java.math.BigDecimal)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setDatedValue(java.util.List)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(java.util.List)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setUnit(cdm.base.math.UnitType)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setValue(java.math.BigDecimal)
```
```java
public default cdm.base.math.MeasureBase$MeasureBaseBuilder setUnit(cdm.base.math.UnitType)
```
```java
public default cdm.base.math.MeasureBase$MeasureBaseBuilder setValue(java.math.BigDecimal)
```



## Class: cdm.base.math.NonNegativeQuantity

Exists: yes
Package: cdm.base.math
Builder: cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder

### Public Methods

```java
public abstract cdm.base.math.NonNegativeQuantity build()
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder toBuilder()
```
```java
public static cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.math.NonNegativeQuantity> getType()
```
```java
public default cdm.base.math.Quantity$QuantityBuilder toBuilder()
```
```java
public default cdm.base.math.Quantity build()
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder toBuilder()
```
```java
public default cdm.base.math.QuantitySchedule build()
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder toBuilder()
```
```java
public default cdm.base.math.MeasureSchedule build()
```
```java
public default cdm.base.math.MeasureBase$MeasureBaseBuilder toBuilder()
```
```java
public default cdm.base.math.MeasureBase build()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setValue(java.math.BigDecimal)
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setUnit(cdm.base.math.UnitType)
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder addDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setMultiplier(cdm.base.math.Measure)
```
```java
public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setFrequency(cdm.base.datetime.Frequency)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder setFrequency(cdm.base.datetime.Frequency)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder setMultiplier(cdm.base.math.Measure)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder setDatedValue(java.util.List)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder addDatedValue(java.util.List)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder setUnit(cdm.base.math.UnitType)
```
```java
public default cdm.base.math.Quantity$QuantityBuilder setValue(java.math.BigDecimal)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setFrequency(cdm.base.datetime.Frequency)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setMultiplier(cdm.base.math.Measure)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setDatedValue(java.util.List)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(java.util.List)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setUnit(cdm.base.math.UnitType)
```
```java
public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setValue(java.math.BigDecimal)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setDatedValue(java.util.List)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(java.util.List)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setUnit(cdm.base.math.UnitType)
```
```java
public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setValue(java.math.BigDecimal)
```
```java
public default cdm.base.math.MeasureBase$MeasureBaseBuilder setUnit(cdm.base.math.UnitType)
```
```java
public default cdm.base.math.MeasureBase$MeasureBaseBuilder setValue(java.math.BigDecimal)
```



## Class: cdm.base.math.UnitType

Exists: yes
Package: cdm.base.math
Builder: cdm.base.math.UnitType$UnitTypeBuilder

### Public Methods

```java
public abstract cdm.base.math.CapacityUnitEnum getCapacityUnit()
```
```java
public abstract cdm.base.math.WeatherUnitEnum getWeatherUnit()
```
```java
public abstract cdm.base.math.FinancialUnitEnum getFinancialUnit()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getCurrency()
```
```java
public abstract cdm.base.math.UnitType build()
```
```java
public abstract cdm.base.math.UnitType$UnitTypeBuilder toBuilder()
```
```java
public static cdm.base.math.UnitType$UnitTypeBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.math.UnitType> getType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateCurrency()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getCurrency()
```
```java
public abstract cdm.base.math.UnitType$UnitTypeBuilder setCapacityUnit(cdm.base.math.CapacityUnitEnum)
```
```java
public abstract cdm.base.math.UnitType$UnitTypeBuilder setWeatherUnit(cdm.base.math.WeatherUnitEnum)
```
```java
public abstract cdm.base.math.UnitType$UnitTypeBuilder setFinancialUnit(cdm.base.math.FinancialUnitEnum)
```
```java
public abstract cdm.base.math.UnitType$UnitTypeBuilder setCurrency(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.math.UnitType$UnitTypeBuilder setCurrencyValue(java.lang.String)
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getCurrency()
```



## Class: com.rosetta.model.metafields.FieldWithMetaDate

Exists: yes
Package: com.rosetta.model.metafields
Builder: com.rosetta.model.metafields.FieldWithMetaDate$FieldWithMetaDateBuilder

### Public Methods

```java
public abstract com.rosetta.model.lib.records.Date getValue()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaDate build()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaDate$FieldWithMetaDateBuilder toBuilder()
```
```java
public static com.rosetta.model.metafields.FieldWithMetaDate$FieldWithMetaDateBuilder builder()
```
```java
public default java.lang.Class<? extends com.rosetta.model.metafields.FieldWithMetaDate> getType()
```
```java
public default java.lang.Class<com.rosetta.model.lib.records.Date> getValueType()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```
```java
public default java.lang.Object getValue()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```

### Builder Methods

```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaDate$FieldWithMetaDateBuilder setValue(com.rosetta.model.lib.records.Date)
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaDate$FieldWithMetaDateBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields getMeta()
```
```java
public default com.rosetta.model.lib.meta.FieldWithMeta$FieldWithMetaBuilder setValue(java.lang.Object)
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getOrCreateMeta()
```
```java
public default com.rosetta.model.lib.meta.GlobalKeyFields$GlobalKeyFieldsBuilder getMeta()
```



## Missing Seed Classes

- com.rosetta.model.metafields.MetaFields
- com.rosetta.model.lib.records.Date

## Negative Classes

- cdm.base.math.PriceSchedule: not found in cdm-java-6.7.0.jar
- cdm.base.math.PriceTypeEnum: not found in cdm-java-6.7.0.jar
- cdm.base.staticdata.asset.Asset: not found in cdm-java-6.7.0.jar
- cdm.base.staticdata.asset.Cash: not found in cdm-java-6.7.0.jar
- cdm.base.staticdata.party.PartyReference: not found in cdm-java-6.7.0.jar
- cdm.observable.asset.ResolvablePriceQuantity: not found in cdm-java-6.7.0.jar
- cdm.product.common.settlement.SettlementPayout: not found in cdm-java-6.7.0.jar
- cdm.product.template.CashSettlementTerms: not found in cdm-java-6.7.0.jar
- cdm.product.template.SettlementTerms: not found in cdm-java-6.7.0.jar
- cdm.product.template.SettlementTypeEnum: not found in cdm-java-6.7.0.jar
- com.rosetta.model.lib.records.Date: seed class not found in cdm-java-6.7.0.jar
- com.rosetta.model.metafields.MetaFields: seed class not found in cdm-java-6.7.0.jar
- FpmlFxSingleLeg: not part of CDM Java; use XML parser DTOs or DOM/StAX parsing
