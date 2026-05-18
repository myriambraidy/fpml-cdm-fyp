## Class: cdm.product.template.PerformancePayout

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.PerformancePayout$PerformancePayoutBuilder

### Public Methods

```java
public abstract cdm.product.common.schedule.ObservationTerms getObservationTerms()
```
```java
public abstract cdm.observable.asset.ValuationDates getValuationDates()
```
```java
public abstract cdm.product.common.schedule.PaymentDates getPaymentDates()
```
```java
public abstract cdm.product.template.Underlier getUnderlier()
```
```java
public abstract java.util.List<? extends cdm.product.template.FxFeature> getFxFeature()
```
```java
public abstract cdm.product.template.ReturnTerms getReturnTerms()
```
```java
public abstract java.util.List<? extends cdm.product.template.PortfolioReturnTerms> getPortfolioReturnTerms()
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule> getInitialValuationPrice()
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule> getInterimValuationPrice()
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule> getFinalValuationPrice()
```
```java
public abstract cdm.product.template.PerformancePayout build()
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder toBuilder()
```
```java
public static cdm.product.template.PerformancePayout$PerformancePayoutBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.PerformancePayout> getType()
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
public abstract cdm.product.common.schedule.ObservationTerms$ObservationTermsBuilder getOrCreateObservationTerms()
```
```java
public abstract cdm.product.common.schedule.ObservationTerms$ObservationTermsBuilder getObservationTerms()
```
```java
public abstract cdm.observable.asset.ValuationDates$ValuationDatesBuilder getOrCreateValuationDates()
```
```java
public abstract cdm.observable.asset.ValuationDates$ValuationDatesBuilder getValuationDates()
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
public abstract cdm.product.template.FxFeature$FxFeatureBuilder getOrCreateFxFeature(int)
```
```java
public abstract java.util.List<? extends cdm.product.template.FxFeature$FxFeatureBuilder> getFxFeature()
```
```java
public abstract cdm.product.template.ReturnTerms$ReturnTermsBuilder getOrCreateReturnTerms()
```
```java
public abstract cdm.product.template.ReturnTerms$ReturnTermsBuilder getReturnTerms()
```
```java
public abstract cdm.product.template.PortfolioReturnTerms$PortfolioReturnTermsBuilder getOrCreatePortfolioReturnTerms(int)
```
```java
public abstract java.util.List<? extends cdm.product.template.PortfolioReturnTerms$PortfolioReturnTermsBuilder> getPortfolioReturnTerms()
```
```java
public abstract cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder getOrCreateInitialValuationPrice(int)
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder> getInitialValuationPrice()
```
```java
public abstract cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder getOrCreateInterimValuationPrice(int)
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder> getInterimValuationPrice()
```
```java
public abstract cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder getOrCreateFinalValuationPrice(int)
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder> getFinalValuationPrice()
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setPayerReceiver(cdm.base.staticdata.party.PayerReceiver)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setPrincipalPayment(cdm.product.common.settlement.PrincipalPayments)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setSettlementTerms(cdm.product.common.settlement.SettlementTerms)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setObservationTerms(cdm.product.common.schedule.ObservationTerms)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setValuationDates(cdm.observable.asset.ValuationDates)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setPaymentDates(cdm.product.common.schedule.PaymentDates)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setUnderlier(cdm.product.template.Underlier)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFxFeature(cdm.product.template.FxFeature)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFxFeature(cdm.product.template.FxFeature, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFxFeature(java.util.List<? extends cdm.product.template.FxFeature>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setFxFeature(java.util.List<? extends cdm.product.template.FxFeature>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setReturnTerms(cdm.product.template.ReturnTerms)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addPortfolioReturnTerms(cdm.product.template.PortfolioReturnTerms)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addPortfolioReturnTerms(cdm.product.template.PortfolioReturnTerms, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addPortfolioReturnTerms(java.util.List<? extends cdm.product.template.PortfolioReturnTerms>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setPortfolioReturnTerms(java.util.List<? extends cdm.product.template.PortfolioReturnTerms>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInitialValuationPrice(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInitialValuationPrice(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInitialValuationPriceValue(cdm.observable.asset.PriceSchedule)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInitialValuationPriceValue(cdm.observable.asset.PriceSchedule, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInitialValuationPrice(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setInitialValuationPrice(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInitialValuationPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setInitialValuationPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInterimValuationPrice(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInterimValuationPrice(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInterimValuationPriceValue(cdm.observable.asset.PriceSchedule)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInterimValuationPriceValue(cdm.observable.asset.PriceSchedule, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInterimValuationPrice(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setInterimValuationPrice(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addInterimValuationPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setInterimValuationPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFinalValuationPrice(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFinalValuationPrice(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFinalValuationPriceValue(cdm.observable.asset.PriceSchedule)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFinalValuationPriceValue(cdm.observable.asset.PriceSchedule, int)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFinalValuationPrice(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setFinalValuationPrice(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder addFinalValuationPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder setFinalValuationPriceValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public default cdm.product.template.ReturnTerms getReturnTerms()
```
```java
public default cdm.product.template.Underlier getUnderlier()
```
```java
public default cdm.product.common.schedule.PaymentDates getPaymentDates()
```
```java
public default cdm.observable.asset.ValuationDates getValuationDates()
```
```java
public default cdm.product.common.schedule.ObservationTerms getObservationTerms()
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

