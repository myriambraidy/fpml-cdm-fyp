# Planner Plan Excerpt

## Implementation scope (machine-checked)

**Product family:** fx-derivatives

**In scope (implementation groups):**
- fx-single-leg

**Explicitly out of scope (implementation groups):**
- fx-swap
- fx-simple-option

## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fx-ex02-spot-cross-w-side-rates.xml

## Java shell contract (machine-checked)
**Generated package:** com.fpml.cdm.fx.mapper.generated
**Main generated class:** GeneratedFpmlToCdmMapper
**Required interface:** com.fpml.cdm.fx.mapper.FpmlToCdmMapper
**Generated source root:** src/main/java/com/fpml/cdm/fx/mapper/generated/
**Shell-owned files must not be rewritten:**
- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

## Rosetta evidence coverage (machine-checked)
**product-root:**
- MapFxSingleLegNonTransferableProduct
**economic-terms:**
- MapFxSingleLegEconomicTerms
**settlement-payout:**
- MapFxCoreDetailsModelToSettlementPayout
**price-quantity:**
- MapFxSingleLegPriceQuantityList
**party-counterparty:**
- MapFxSingleLegCounterpartyList
- MapFxSingleLegAncillaryPartyList
**account-party-reference:**
- MapFxSingleLegAccountPartyReference
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductTaxonomyList
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout

## Mapping Responsibilities

- Build `PartyIdentifier` with `IdentifierType.LEI` or equivalent.
- Destination: `cdm.observable.asset.PriceSchedule`, `cdm.base.math.NonNegativeQuantitySchedule`.
- Destination: `cdm.base.staticdata.asset.common.ProductIdentifier`, `ProductTaxonomy`.
