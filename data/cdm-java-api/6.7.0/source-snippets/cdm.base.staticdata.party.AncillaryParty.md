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

