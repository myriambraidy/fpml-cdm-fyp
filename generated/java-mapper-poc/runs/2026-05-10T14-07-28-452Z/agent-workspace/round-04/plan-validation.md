# Plan Validation

Status: failed

## Blocking Issues

- Plan references unapproved CDM Java class cdm.base.staticdata.asset.common.ProductIdentifier; use only classes in approved-cdm-api-contract-summary.md.
- Plan references CDM Java class not approved by this run's API contract: IdentifierType
- Plan references CDM Java class not approved by this run's API contract: LEI
- Plan references CDM Java class not approved by this run's API contract: cdm.base.math.NonNegativeQuantitySchedule
- Plan references CDM Java class not approved by this run's API contract: cdm.base.staticdata.asset.common.ProductIdentifier
- Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex01-fx-spot
- Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex02-spot-cross-w-side-rates
- Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex03-fx-fwd
- Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex04-fx-fwd-w-settlement
- Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex05-fx-fwd-w-ssi
- Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex06-fx-fwd-w-splits
- Runtime supported fixtures section must list every runtime gate fixture id; missing: fx-ex07-non-deliverable-forward

## Warnings

- none

## Validation details

- Mode: structured-section
- Parsed in-scope groups: fx-single-leg
- Parsed out-of-scope groups: fx-swap, fx-simple-option, fx-barrier-option, fx-digital-option, fx-average-rate-option, fx-strategy, non-fx
- Parsed runtime fixture ids: (none)

- Parsed generated package: com.fpml.cdm.fx.mapper.generated
- Parsed main generated class: GeneratedFpmlToCdmMapper
- Parsed required interface: com.fpml.cdm.fx.mapper.FpmlToCdmMapper
- Parsed generated source root: src/main/java/com/fpml/cdm/fx/mapper/generated/
- Parsed shell-owned files: pom.xml, src/main/java/com/fpml/cdm/fx/mapper/Main.java, src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java, src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

- Parsed Rosetta areas: product-root=MapFxSingleLegNonTransferableProduct; economic-terms=MapFxSingleLegEconomicTerms; settlement-payout=MapFxCoreDetailsModelToSettlementPayout; price-quantity=MapFxSingleLegPriceQuantityList|MapFxCoreDetailsModelPriceListWithLocation|MapFxCoreDetailsModelQuantityListWithLocation; party-counterparty=MapFxSingleLegCounterpartyList|MapFxSingleLegAncillaryPartyList; account-party-reference=MapFxSingleLegAccountPartyReference; product-identifiers-taxonomy=MapProductIdentifierList|MapProductTaxonomyList; dates-settlement=MapFxCoreDetailsModelToSettlementPayout|MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

