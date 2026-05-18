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

