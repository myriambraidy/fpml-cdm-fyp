## Class: cdm.base.staticdata.party.Party

Exists: yes
Package: cdm.base.staticdata.party
Builder: cdm.base.staticdata.party.Party$PartyBuilder

### Public Methods

```java
public abstract java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier> getPartyId()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString getName()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.BusinessUnit> getBusinessUnit()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPerson> getPerson()
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole> getPersonRole()
```
```java
public abstract cdm.base.staticdata.party.Account getAccount()
```
```java
public abstract cdm.base.staticdata.party.ContactInformation getContactInformation()
```
```java
public abstract com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public abstract cdm.base.staticdata.party.Party build()
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder toBuilder()
```
```java
public static cdm.base.staticdata.party.Party$PartyBuilder builder()
```
```java
public default java.lang.Class<? extends cdm.base.staticdata.party.Party> getType()
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
public abstract cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder getOrCreatePartyId(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder> getPartyId()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateName()
```
```java
public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getName()
```
```java
public abstract cdm.base.staticdata.party.BusinessUnit$BusinessUnitBuilder getOrCreateBusinessUnit(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.BusinessUnit$BusinessUnitBuilder> getBusinessUnit()
```
```java
public abstract cdm.base.staticdata.party.NaturalPerson$NaturalPersonBuilder getOrCreatePerson(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPerson$NaturalPersonBuilder> getPerson()
```
```java
public abstract cdm.base.staticdata.party.NaturalPersonRole$NaturalPersonRoleBuilder getOrCreatePersonRole(int)
```
```java
public abstract java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole$NaturalPersonRoleBuilder> getPersonRole()
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder getOrCreateAccount()
```
```java
public abstract cdm.base.staticdata.party.Account$AccountBuilder getAccount()
```
```java
public abstract cdm.base.staticdata.party.ContactInformation$ContactInformationBuilder getOrCreateContactInformation()
```
```java
public abstract cdm.base.staticdata.party.ContactInformation$ContactInformationBuilder getContactInformation()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getOrCreateMeta()
```
```java
public abstract com.rosetta.model.metafields.MetaFields$MetaFieldsBuilder getMeta()
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(cdm.base.staticdata.party.PartyIdentifier)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(cdm.base.staticdata.party.PartyIdentifier, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setPartyId(java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setName(com.rosetta.model.metafields.FieldWithMetaString)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setNameValue(java.lang.String)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addBusinessUnit(cdm.base.staticdata.party.BusinessUnit)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addBusinessUnit(cdm.base.staticdata.party.BusinessUnit, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addBusinessUnit(java.util.List<? extends cdm.base.staticdata.party.BusinessUnit>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setBusinessUnit(java.util.List<? extends cdm.base.staticdata.party.BusinessUnit>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPerson(cdm.base.staticdata.party.NaturalPerson)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPerson(cdm.base.staticdata.party.NaturalPerson, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPerson(java.util.List<? extends cdm.base.staticdata.party.NaturalPerson>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setPerson(java.util.List<? extends cdm.base.staticdata.party.NaturalPerson>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPersonRole(cdm.base.staticdata.party.NaturalPersonRole)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPersonRole(cdm.base.staticdata.party.NaturalPersonRole, int)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder addPersonRole(java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setPersonRole(java.util.List<? extends cdm.base.staticdata.party.NaturalPersonRole>)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setAccount(cdm.base.staticdata.party.Account)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setContactInformation(cdm.base.staticdata.party.ContactInformation)
```
```java
public abstract cdm.base.staticdata.party.Party$PartyBuilder setMeta(com.rosetta.model.metafields.MetaFields)
```
```java
public default com.rosetta.model.metafields.MetaFields getMeta()
```
```java
public default cdm.base.staticdata.party.ContactInformation getContactInformation()
```
```java
public default cdm.base.staticdata.party.Account getAccount()
```
```java
public default com.rosetta.model.metafields.FieldWithMetaString getName()
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

