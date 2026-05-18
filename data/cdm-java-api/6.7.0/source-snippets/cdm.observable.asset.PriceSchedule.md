## Class: cdm.observable.asset.PriceSchedule

Exists: yes
Package: cdm.observable.asset
Builder: cdm.observable.asset.PriceSchedule$PriceScheduleBuilder

### Public Methods

```java
public abstract cdm.base.math.UnitType getPerUnitOf()
```
```java
public abstract cdm.observable.asset.PriceTypeEnum getPriceType()
```
```java
public abstract cdm.observable.asset.PriceExpressionEnum getPriceExpression()
```
```java
public abstract cdm.observable.asset.PriceComposite getComposite()
```
```java
public abstract cdm.base.math.ArithmeticOperationEnum getArithmeticOperator()
```
```java
public abstract cdm.observable.asset.CashPrice getCashPrice()
```
```java
public abstract cdm.observable.asset.PriceSchedule build()
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder toBuilder()
```
```java
public static cdm.observable.asset.PriceSchedule$PriceScheduleBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.observable.asset.PriceSchedule> getType()
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
public abstract cdm.base.math.UnitType$UnitTypeBuilder getOrCreatePerUnitOf()
```
```java
public abstract cdm.base.math.UnitType$UnitTypeBuilder getPerUnitOf()
```
```java
public abstract cdm.observable.asset.PriceComposite$PriceCompositeBuilder getOrCreateComposite()
```
```java
public abstract cdm.observable.asset.PriceComposite$PriceCompositeBuilder getComposite()
```
```java
public abstract cdm.observable.asset.CashPrice$CashPriceBuilder getOrCreateCashPrice()
```
```java
public abstract cdm.observable.asset.CashPrice$CashPriceBuilder getCashPrice()
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setValue(java.math.BigDecimal)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setUnit(cdm.base.math.UnitType)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder addDatedValue(cdm.base.math.DatedValue)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder addDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setPerUnitOf(cdm.base.math.UnitType)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setPriceType(cdm.observable.asset.PriceTypeEnum)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setPriceExpression(cdm.observable.asset.PriceExpressionEnum)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setComposite(cdm.observable.asset.PriceComposite)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setArithmeticOperator(cdm.base.math.ArithmeticOperationEnum)
```
```java
public abstract cdm.observable.asset.PriceSchedule$PriceScheduleBuilder setCashPrice(cdm.observable.asset.CashPrice)
```
```java
public default cdm.observable.asset.CashPrice getCashPrice()
```
```java
public default cdm.observable.asset.PriceComposite getComposite()
```
```java
public default cdm.base.math.UnitType getPerUnitOf()
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

