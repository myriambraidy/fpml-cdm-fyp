## Class: cdm.product.common.settlement.ResolvablePriceQuantity

Exists: yes
Package: cdm.product.common.settlement
Builder: cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder

### Public Methods

```java
public abstract cdm.base.math.Quantity getResolvedQuantity()
```
```java
public abstract cdm.base.math.metafields.ReferenceWithMetaNonNegativeQuantitySchedule getQuantitySchedule()
```
```java
public abstract cdm.product.common.settlement.metafields.ReferenceWithMetaResolvablePriceQuantity getQuantityReference()
```
```java
public abstract cdm.product.common.settlement.QuantityMultiplier getQuantityMultiplier()
```
```java
public abstract java.lang.Boolean getReset()
```
```java
public abstract cdm.product.asset.FutureValueAmount getFutureValueNotional()
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule> getPriceSchedule()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity build()
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder toBuilder()
```
```java
public static cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.common.settlement.ResolvablePriceQuantity> getType()
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
public abstract cdm.base.math.Quantity$QuantityBuilder getOrCreateResolvedQuantity()
```
```java
public abstract cdm.base.math.Quantity$QuantityBuilder getResolvedQuantity()
```
```java
public abstract cdm.base.math.metafields.ReferenceWithMetaNonNegativeQuantitySchedule$ReferenceWithMetaNonNegativeQuantityScheduleBuilder getOrCreateQuantitySchedule()
```
```java
public abstract cdm.base.math.metafields.ReferenceWithMetaNonNegativeQuantitySchedule$ReferenceWithMetaNonNegativeQuantityScheduleBuilder getQuantitySchedule()
```
```java
public abstract cdm.product.common.settlement.metafields.ReferenceWithMetaResolvablePriceQuantity$ReferenceWithMetaResolvablePriceQuantityBuilder getOrCreateQuantityReference()
```
```java
public abstract cdm.product.common.settlement.metafields.ReferenceWithMetaResolvablePriceQuantity$ReferenceWithMetaResolvablePriceQuantityBuilder getQuantityReference()
```
```java
public abstract cdm.product.common.settlement.QuantityMultiplier$QuantityMultiplierBuilder getOrCreateQuantityMultiplier()
```
```java
public abstract cdm.product.common.settlement.QuantityMultiplier$QuantityMultiplierBuilder getQuantityMultiplier()
```
```java
public abstract cdm.product.asset.FutureValueAmount$FutureValueAmountBuilder getOrCreateFutureValueNotional()
```
```java
public abstract cdm.product.asset.FutureValueAmount$FutureValueAmountBuilder getFutureValueNotional()
```
```java
public abstract cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder getOrCreatePriceSchedule(int)
```
```java
public abstract java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule$ReferenceWithMetaPriceScheduleBuilder> getPriceSchedule()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setResolvedQuantity(cdm.base.math.Quantity)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setQuantitySchedule(cdm.base.math.metafields.ReferenceWithMetaNonNegativeQuantitySchedule)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setQuantityScheduleValue(cdm.base.math.NonNegativeQuantitySchedule)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setQuantityReference(cdm.product.common.settlement.metafields.ReferenceWithMetaResolvablePriceQuantity)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setQuantityReferenceValue(cdm.product.common.settlement.ResolvablePriceQuantity)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setQuantityMultiplier(cdm.product.common.settlement.QuantityMultiplier)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setReset(java.lang.Boolean)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setFutureValueNotional(cdm.product.asset.FutureValueAmount)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder addPriceSchedule(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder addPriceSchedule(cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule, int)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder addPriceScheduleValue(cdm.observable.asset.PriceSchedule)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder addPriceScheduleValue(cdm.observable.asset.PriceSchedule, int)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder addPriceSchedule(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setPriceSchedule(java.util.List<? extends cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule>)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder addPriceScheduleValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setPriceScheduleValue(java.util.List<? extends cdm.observable.asset.PriceSchedule>)
```
```java
public abstract cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.product.asset.FutureValueAmount getFutureValueNotional()
```
```java
public default cdm.product.common.settlement.QuantityMultiplier getQuantityMultiplier()
```
```java
public default cdm.product.common.settlement.metafields.ReferenceWithMetaResolvablePriceQuantity getQuantityReference()
```
```java
public default cdm.base.math.metafields.ReferenceWithMetaNonNegativeQuantitySchedule getQuantitySchedule()
```
```java
public default cdm.base.math.Quantity getResolvedQuantity()
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

