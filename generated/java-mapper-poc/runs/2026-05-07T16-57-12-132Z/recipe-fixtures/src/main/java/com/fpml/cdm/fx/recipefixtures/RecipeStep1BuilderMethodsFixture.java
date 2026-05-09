package com.fpml.cdm.fx.recipefixtures;

public final class RecipeStep1BuilderMethodsFixture {
  public void verify() {
    var builder0 = cdm.base.staticdata.identifier.AssignedIdentifier.builder();
    builder0.getIdentifier();
    builder0.getIdentifier();
    builder0.getOrCreateIdentifier();
    builder0.setIdentifier(null);
    builder0.setIdentifierValue(null);
    var builder1 = cdm.base.staticdata.identifier.Identifier.builder();
    builder1.addAssignedIdentifier(null, 0);
    builder1.addAssignedIdentifier(null);
    builder1.addAssignedIdentifier(null);
    builder1.getAssignedIdentifier();
    builder1.getOrCreateAssignedIdentifier(0);
    builder1.setAssignedIdentifier(null);
    var builder2 = cdm.base.staticdata.party.Party.builder();
    builder2.addPartyId(null, 0);
    builder2.addPartyId(null);
    builder2.addPartyId(null);
    builder2.getOrCreatePartyId(0);
    builder2.getPartyId();
    builder2.setPartyId(null);
    var builder3 = cdm.base.staticdata.party.PartyIdentifier.builder();
    builder3.getIdentifier();
    builder3.getIdentifier();
    builder3.getOrCreateIdentifier();
    builder3.setIdentifier(null);
    builder3.setIdentifierType(null);
    builder3.setIdentifierValue(null);
  }
}
