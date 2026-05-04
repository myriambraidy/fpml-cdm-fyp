# CDM/Rosetta Java Preflight

Generated: 2026-05-04T14:07:08.376Z
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

- Trade: cdm.event.common.Trade
- TradeState: cdm.event.common.TradeState
- NonTransferableProduct: cdm.product.template.NonTransferableProduct
- EconomicTerms: cdm.product.template.EconomicTerms
- Payout: cdm.product.template.Payout
- SettlementPayout: cdm.product.common.settlement.SettlementPayout
- ResolvablePriceQuantity: cdm.observable.asset.ResolvablePriceQuantity

## Serializer

- Strategy: maven-compile-gated-jackson-serialization
- Notes: Use the CDM model object as the internal representation and serialize it at the runtime boundary.

## Diagnostics

- rosetta-validator Maven module was found and packaged successfully.
- Built C:\Users\User\Desktop\fpml-cdm-fyp\rosetta-validator\target\rosetta-validator-1.0.0.jar.
