## Class: cdm.product.template.SettlementPayout

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.SettlementPayout$SettlementPayoutBuilder

### Public Methods

```java
public abstract cdm.product.template.Underlier getUnderlier()
```
```java
public abstract java.lang.String getDeliveryTerm()
```
```java
public abstract cdm.product.asset.AssetDeliveryInformation getDelivery()
```
```java
public abstract cdm.product.template.CalculationSchedule getSchedule()
```
```java
public abstract cdm.product.template.SettlementPayout build()
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder toBuilder()
```
```java
public static cdm.product.template.SettlementPayout$SettlementPayoutBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.SettlementPayout> getType()
```
```java
public default cdm.product.common.settlement.PayoutBase$PayoutBaseBuilder toBuilder()
```
```java
public default cdm.product.common.settlement.PayoutBase build()
```
```java
public default com.rosetta.model.lib.RosettaModelObject build()
```
```java
public default com.rosetta.model.lib.RosettaModelObjectBuilder toBuilder()
```

### Builder Methods

```java
public abstract cdm.product.template.Underlier$UnderlierBuilder getOrCreateUnderlier()
```
```java
public abstract cdm.product.template.Underlier$UnderlierBuilder getUnderlier()
```
```java
public abstract cdm.product.asset.AssetDeliveryInformation$AssetDeliveryInformationBuilder getOrCreateDelivery()
```
```java
public abstract cdm.product.asset.AssetDeliveryInformation$AssetDeliveryInformationBuilder getDelivery()
```
```java
public abstract cdm.product.template.CalculationSchedule$CalculationScheduleBuilder getOrCreateSchedule()
```
```java
public abstract cdm.product.template.CalculationSchedule$CalculationScheduleBuilder getSchedule()
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setPayerReceiver(cdm.base.staticdata.party.PayerReceiver)
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setPrincipalPayment(cdm.product.common.settlement.PrincipalPayments)
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setSettlementTerms(cdm.product.common.settlement.SettlementTerms)
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setUnderlier(cdm.product.template.Underlier)
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setDeliveryTerm(java.lang.String)
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setDelivery(cdm.product.asset.AssetDeliveryInformation)
```
```java
public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setSchedule(cdm.product.template.CalculationSchedule)
```
```java
public default cdm.product.template.CalculationSchedule getSchedule()
```
```java
public default cdm.product.asset.AssetDeliveryInformation getDelivery()
```
```java
public default cdm.product.template.Underlier getUnderlier()
```
```java
public default cdm.product.common.settlement.PayoutBase$PayoutBaseBuilder setSettlementTerms(cdm.product.common.settlement.SettlementTerms)
```
```java
public default cdm.product.common.settlement.PayoutBase$PayoutBaseBuilder setPrincipalPayment(cdm.product.common.settlement.PrincipalPayments)
```
```java
public default cdm.product.common.settlement.PayoutBase$PayoutBaseBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)
```
```java
public default cdm.product.common.settlement.PayoutBase$PayoutBaseBuilder setPayerReceiver(cdm.base.staticdata.party.PayerReceiver)
```

