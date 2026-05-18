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

