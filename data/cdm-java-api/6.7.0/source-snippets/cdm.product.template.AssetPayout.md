## Class: cdm.product.template.AssetPayout

Exists: yes
Package: cdm.product.template
Builder: cdm.product.template.AssetPayout$AssetPayoutBuilder

### Public Methods

```java
public abstract java.util.List<? extends cdm.product.template.AssetLeg> getAssetLeg()
```
```java
public abstract cdm.base.staticdata.asset.common.Asset getUnderlier()
```
```java
public abstract cdm.observable.asset.Money getMinimumFee()
```
```java
public abstract cdm.product.template.DividendTerms getDividendTerms()
```
```java
public abstract cdm.product.template.AssetPayoutTradeTypeEnum getTradeType()
```
```java
public abstract cdm.product.template.AssetPayout build()
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder toBuilder()
```
```java
public static cdm.product.template.AssetPayout$AssetPayoutBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.template.AssetPayout> getType()
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
public abstract cdm.product.template.AssetLeg$AssetLegBuilder getOrCreateAssetLeg(int)
```
```java
public abstract java.util.List<? extends cdm.product.template.AssetLeg$AssetLegBuilder> getAssetLeg()
```
```java
public abstract cdm.base.staticdata.asset.common.Asset$AssetBuilder getOrCreateUnderlier()
```
```java
public abstract cdm.base.staticdata.asset.common.Asset$AssetBuilder getUnderlier()
```
```java
public abstract cdm.observable.asset.Money$MoneyBuilder getOrCreateMinimumFee()
```
```java
public abstract cdm.observable.asset.Money$MoneyBuilder getMinimumFee()
```
```java
public abstract cdm.product.template.DividendTerms$DividendTermsBuilder getOrCreateDividendTerms()
```
```java
public abstract cdm.product.template.DividendTerms$DividendTermsBuilder getDividendTerms()
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setPayerReceiver(cdm.base.staticdata.party.PayerReceiver)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setPrincipalPayment(cdm.product.common.settlement.PrincipalPayments)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setSettlementTerms(cdm.product.common.settlement.SettlementTerms)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder addAssetLeg(cdm.product.template.AssetLeg)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder addAssetLeg(cdm.product.template.AssetLeg, int)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder addAssetLeg(java.util.List<? extends cdm.product.template.AssetLeg>)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setAssetLeg(java.util.List<? extends cdm.product.template.AssetLeg>)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setUnderlier(cdm.base.staticdata.asset.common.Asset)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setMinimumFee(cdm.observable.asset.Money)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setDividendTerms(cdm.product.template.DividendTerms)
```
```java
public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder setTradeType(cdm.product.template.AssetPayoutTradeTypeEnum)
```
```java
public default cdm.product.template.DividendTerms getDividendTerms()
```
```java
public default cdm.observable.asset.Money getMinimumFee()
```
```java
public default cdm.base.staticdata.asset.common.Asset getUnderlier()
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

