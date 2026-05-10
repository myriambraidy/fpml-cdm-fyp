# Deterministic Plan Validation

The planner output failed machine validation before LLM critique.

# Plan Validation

Status: failed

## Blocking Issues

- Plan references CDM Java class not approved by this run's API contract: At

## Warnings

- none

## Validation details

- Mode: structured-section
- Parsed in-scope groups: fx-single-leg
- Parsed out-of-scope groups: (none)
- Parsed runtime fixture ids: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward

- Parsed generated package: com.fpml.cdm.fx.mapper.generated
- Parsed main generated class: GeneratedFpmlToCdmMapper
- Parsed required interface: com.fpml.cdm.fx.mapper.FpmlToCdmMapper
- Parsed generated source root: src/main/java/com/fpml/cdm/fx/mapper/generated/
- Parsed shell-owned files: pom.xml, src/main/java/com/fpml/cdm/fx/mapper/Main.java, src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java, src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

- Parsed Rosetta areas: product-root=MapFxSingleLegNonTransferableProduct; economic-terms=MapFxSingleLegEconomicTerms; settlement-payout=MapFxCoreDetailsModelToSettlementPayout; price-quantity=MapFxSingleLegPriceQuantityList|MapFxCoreDetailsModelPriceListWithLocation|MapFxCoreDetailsModelQuantityListWithLocation; party-counterparty=MapFxSingleLegCounterpartyList|MapFxSingleLegAncillaryPartyList; account-party-reference=MapFxSingleLegAccountPartyReference|MapPayerReceiverToAccountPartyReference; product-identifiers-taxonomy=MapProductIdentifierList|MapProductTaxonomyList; dates-settlement=MapFxCoreDetailsModelToSettlementPayout|MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate



Decision: NEXT_ROUND_REQUIRED