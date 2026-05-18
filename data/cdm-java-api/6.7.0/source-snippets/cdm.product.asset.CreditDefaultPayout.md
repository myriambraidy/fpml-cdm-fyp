## Class: cdm.product.asset.CreditDefaultPayout

Exists: yes
Package: cdm.product.asset
Builder: cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder

### Public Methods

```java
public abstract cdm.product.asset.GeneralTerms getGeneralTerms()
```
```java
public abstract java.util.List<? extends cdm.product.asset.ProtectionTerms> getProtectionTerms()
```
```java
public abstract cdm.observable.asset.TransactedPrice getTransactedPrice()
```
```java
public abstract cdm.product.asset.CreditDefaultPayout build()
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder toBuilder()
```
```java
public static cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.product.asset.CreditDefaultPayout> getType()
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
public abstract cdm.product.asset.GeneralTerms$GeneralTermsBuilder getOrCreateGeneralTerms()
```
```java
public abstract cdm.product.asset.GeneralTerms$GeneralTermsBuilder getGeneralTerms()
```
```java
public abstract cdm.product.asset.ProtectionTerms$ProtectionTermsBuilder getOrCreateProtectionTerms(int)
```
```java
public abstract java.util.List<? extends cdm.product.asset.ProtectionTerms$ProtectionTermsBuilder> getProtectionTerms()
```
```java
public abstract cdm.observable.asset.TransactedPrice$TransactedPriceBuilder getOrCreateTransactedPrice()
```
```java
public abstract cdm.observable.asset.TransactedPrice$TransactedPriceBuilder getTransactedPrice()
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder setPayerReceiver(cdm.base.staticdata.party.PayerReceiver)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder setPrincipalPayment(cdm.product.common.settlement.PrincipalPayments)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder setSettlementTerms(cdm.product.common.settlement.SettlementTerms)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder setGeneralTerms(cdm.product.asset.GeneralTerms)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder addProtectionTerms(cdm.product.asset.ProtectionTerms)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder addProtectionTerms(cdm.product.asset.ProtectionTerms, int)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder addProtectionTerms(java.util.List<? extends cdm.product.asset.ProtectionTerms>)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder setProtectionTerms(java.util.List<? extends cdm.product.asset.ProtectionTerms>)
```
```java
public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder setTransactedPrice(cdm.observable.asset.TransactedPrice)
```
```java
public default cdm.observable.asset.TransactedPrice getTransactedPrice()
```
```java
public default cdm.product.asset.GeneralTerms getGeneralTerms()
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

