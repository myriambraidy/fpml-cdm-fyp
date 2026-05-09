# CDM/Rosetta Java Preflight

Generated: 2026-05-06T11:11:20.039Z
Status: passed
Mode: repo-local-rosetta-validator

## Artifact

org.finos.cdm:cdm-java:6.7.0

## Validator Module

- POM: C:\Users\User\Desktop\fpml-cdm-fyp\rosetta-validator\pom.xml
- JAR: C:\Users\User\Desktop\fpml-cdm-fyp\rosetta-validator\target\rosetta-validator-1.0.0.jar
- Build command: mvn -q -DskipTests package

## Model Root Candidates

- cdm.event.common.TradeState
- cdm.event.common.Trade

## Required Classes

- Trade root: cdm.event.common.Trade
- Trade state root: cdm.event.common.TradeState
- Contract details: cdm.event.common.ContractDetails
- Non-transferable product: cdm.product.template.NonTransferableProduct
- Economic terms: cdm.product.template.EconomicTerms
- Payout container: cdm.product.template.Payout
- Settlement payout: cdm.product.template.SettlementPayout
- Resolvable price quantity: cdm.product.common.settlement.ResolvablePriceQuantity
- Price schedule: cdm.observable.asset.PriceSchedule
- Party reference or party identity: cdm.base.staticdata.party.metafields.ReferenceWithMetaParty

## Serializer

- Strategy: maven-compile-gated-jackson-serialization
- Notes: Use the CDM model object as the internal representation and serialize it at the runtime boundary.

## Diagnostics

- rosetta-validator Maven module was found and packaged successfully.
- Built C:\Users\User\Desktop\fpml-cdm-fyp\rosetta-validator\target\rosetta-validator-1.0.0.jar.
