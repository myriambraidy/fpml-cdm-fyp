## Class: cdm.product.asset.CommodityPayout

Exists: yes
Package: cdm.product.asset
Builder: cdm.product.asset.CommodityPayout$CommodityPayoutBuilder

### Public Methods

```java
public abstract cdm.product.template.AveragingCalculation getAveragingFeature()
```
```java
public abstract cdm.product.common.settlement.CommodityPriceReturnTerms getCommodityPriceReturnTerms()
```
```java
public abstract cdm.product.common.settlement.PricingDates getPricingDates()
```
```java
public abstract cdm.product.template.CalculationSchedule getSchedule()
```
```java
public abstract cdm.product.common.schedule.CalculationPeriodDates getCalculationPeriodDates()
```
```java
public abstract cdm.product.common.schedule.PaymentDates getPaymentDates()
```
```java
public abstract cdm.product.template.Underlier getUnderlier()
```
```java
public abstract cdm.product.template.FxFeature getFxFeature()
```
```java
public abstract cdm.product.asset.AssetDeliveryInformation getDelivery()
```
```java
public abstract cdm.product.asset.CommodityPayout build()
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder toBuilder()
```
```java
public static cdm.product.asset.CommodityPayout$CommodityPayoutBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.asset.CommodityPayout> getType()
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
public abstract cdm.product.template.AveragingCalculation$AveragingCalculationBuilder getOrCreateAveragingFeature()
```
```java
public abstract cdm.product.template.AveragingCalculation$AveragingCalculationBuilder getAveragingFeature()
```
```java
public abstract cdm.product.common.settlement.CommodityPriceReturnTerms$CommodityPriceReturnTermsBuilder getOrCreateCommodityPriceReturnTerms()
```
```java
public abstract cdm.product.common.settlement.CommodityPriceReturnTerms$CommodityPriceReturnTermsBuilder getCommodityPriceReturnTerms()
```
```java
public abstract cdm.product.common.settlement.PricingDates$PricingDatesBuilder getOrCreatePricingDates()
```
```java
public abstract cdm.product.common.settlement.PricingDates$PricingDatesBuilder getPricingDates()
```
```java
public abstract cdm.product.template.CalculationSchedule$CalculationScheduleBuilder getOrCreateSchedule()
```
```java
public abstract cdm.product.template.CalculationSchedule$CalculationScheduleBuilder getSchedule()
```
```java
public abstract cdm.product.common.schedule.CalculationPeriodDates$CalculationPeriodDatesBuilder getOrCreateCalculationPeriodDates()
```
```java
public abstract cdm.product.common.schedule.CalculationPeriodDates$CalculationPeriodDatesBuilder getCalculationPeriodDates()
```
```java
public abstract cdm.product.common.schedule.PaymentDates$PaymentDatesBuilder getOrCreatePaymentDates()
```
```java
public abstract cdm.product.common.schedule.PaymentDates$PaymentDatesBuilder getPaymentDates()
```
```java
public abstract cdm.product.template.Underlier$UnderlierBuilder getOrCreateUnderlier()
```
```java
public abstract cdm.product.template.Underlier$UnderlierBuilder getUnderlier()
```
```java
public abstract cdm.product.template.FxFeature$FxFeatureBuilder getOrCreateFxFeature()
```
```java
public abstract cdm.product.template.FxFeature$FxFeatureBuilder getFxFeature()
```
```java
public abstract cdm.product.asset.AssetDeliveryInformation$AssetDeliveryInformationBuilder getOrCreateDelivery()
```
```java
public abstract cdm.product.asset.AssetDeliveryInformation$AssetDeliveryInformationBuilder getDelivery()
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setPayerReceiver(cdm.base.staticdata.party.PayerReceiver)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setPrincipalPayment(cdm.product.common.settlement.PrincipalPayments)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setSettlementTerms(cdm.product.common.settlement.SettlementTerms)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setAveragingFeature(cdm.product.template.AveragingCalculation)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setCommodityPriceReturnTerms(cdm.product.common.settlement.CommodityPriceReturnTerms)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setPricingDates(cdm.product.common.settlement.PricingDates)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setSchedule(cdm.product.template.CalculationSchedule)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setCalculationPeriodDates(cdm.product.common.schedule.CalculationPeriodDates)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setPaymentDates(cdm.product.common.schedule.PaymentDates)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setUnderlier(cdm.product.template.Underlier)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setFxFeature(cdm.product.template.FxFeature)
```
```java
public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder setDelivery(cdm.product.asset.AssetDeliveryInformation)
```
```java
public default cdm.product.asset.AssetDeliveryInformation getDelivery()
```
```java
public default cdm.product.template.FxFeature getFxFeature()
```
```java
public default cdm.product.template.Underlier getUnderlier()
```
```java
public default cdm.product.common.schedule.PaymentDates getPaymentDates()
```
```java
public default cdm.product.common.schedule.CalculationPeriodDates getCalculationPeriodDates()
```
```java
public default cdm.product.template.CalculationSchedule getSchedule()
```
```java
public default cdm.product.common.settlement.PricingDates getPricingDates()
```
```java
public default cdm.product.common.settlement.CommodityPriceReturnTerms getCommodityPriceReturnTerms()
```
```java
public default cdm.product.template.AveragingCalculation getAveragingFeature()
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

