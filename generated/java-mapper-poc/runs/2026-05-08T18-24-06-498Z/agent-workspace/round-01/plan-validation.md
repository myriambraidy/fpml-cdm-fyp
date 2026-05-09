# Plan Validation

Status: passed

## Blocking Issues

- none

## Warnings

- none

## Validation details

- Mode: structured-section
- Parsed in-scope groups: fx-single-leg
- Parsed out-of-scope groups: fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, non-fx
- Parsed runtime fixture ids: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward

- Parsed generated package: com.fpml.cdm.fx.mapper.generated
- Parsed main generated class: GeneratedFpmlToCdmMapper
- Parsed required interface: com.fpml.cdm.fx.mapper.FpmlToCdmMapper
- Parsed generated source root: src/main/java/com/fpml/cdm/fx/mapper/generated/
- Parsed shell-owned files: pom.xml, src/main/java/com/fpml/cdm/fx/mapper/Main.java, src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java, src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

- Parsed Rosetta areas: product-root=MapFxSingleLegNonTransferableProduct|MapProductIdentifierList|MapProductTaxonomyList; economic-terms=MapFxSingleLegEconomicTerms; settlement-payout=MapFxCoreDetailsModelToSettlementPayout; price-quantity=MapFxSingleLegPriceQuantityList; party-counterparty=MapFxSingleLegCounterpartyList|MapFxSingleLegAncillaryPartyList; account-party-reference=MapFxSingleLegAccountPartyReference; product-identifiers-taxonomy=MapProductIdentifierList|MapProductTaxonomyList|MapProductIdentifier; dates-settlement=MapFxCoreDetailsModelToSettlementPayout|MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

