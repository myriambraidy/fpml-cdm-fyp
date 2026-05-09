# Java Documentation Readiness

Generated: 2026-05-08T16:37:07.042Z
Status: passed
Product family: fx-derivatives
Implementation group: fx-single-leg
CDM Java artifact: org.finos.cdm:cdm-java:6.7.0
CDM Java jar: C:\Users\User\.m2\repository\org\finos\cdm\cdm-java\6.7.0\cdm-java-6.7.0.jar

## Authority Files

- generated\java-mapper-poc\runs\2026-05-08T16-37-06-340Z\agent-workspace\java-shell-contract.md
- C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T16-37-06-340Z\agent-workspace\approved-cdm-api-contract-summary.md
- C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T16-37-06-340Z\agent-workspace\semantic-recipes.md
- C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T16-37-06-340Z\agent-workspace\semantic-recipe-validation.md
- C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T16-37-06-340Z\agent-workspace\semantic-recipe-fixtures.md
- C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T16-37-06-340Z\agent-workspace\context-budget-report.md
- data/rosetta-source/latest/docs/product-families/fx.md
- data/rosetta-source/latest/docs/shared-ingest.md

## Blocking Issues

- none

## Warnings

- Contract details has no direct approved builder method; it may only be used as a parameter or constructed indirectly.
- Economic terms has no direct approved builder method; it may only be used as a parameter or constructed indirectly.
- Resolvable price quantity has no direct approved builder method; it may only be used as a parameter or constructed indirectly.
- Price schedule has no direct approved builder method; it may only be used as a parameter or constructed indirectly.
- Party reference or party identity has no direct approved builder method; it may only be used as a parameter or constructed indirectly.

## Checks

- passed cdm-java-manifest: CDM Java manifest version 6.7.0.
- passed cdm-java-index: CDM Java index path: C:\Users\User\Desktop\fpml-cdm-fyp\data\cdm-java-api\6.7.0\api-index.json.
- passed approved-api-contract: Approved classes: 38; approved builder methods: 114.
- passed semantic-recipes: Recipes: 1.
- passed semantic-recipe-validation: Semantic recipe validation status: passed.
- passed semantic-recipe-fixtures: Semantic recipe fixture status: passed.
- passed context-budget: Context budget status: passed.
- passed rosetta-fx-pack: FX Rosetta product-family pack must be available.
- passed rosetta-shared-ingest-pack: Shared Rosetta ingest pack must be available.

## Core Concepts

- Trade root: resolved, approved=yes, builder-ready=yes, selected=cdm.event.common.Trade
- Trade state root: resolved, approved=yes, builder-ready=yes, selected=cdm.event.common.TradeState
- Contract details: resolved, approved=yes, builder-ready=no, selected=cdm.event.common.ContractDetails
- Non-transferable product: resolved, approved=yes, builder-ready=yes, selected=cdm.product.template.NonTransferableProduct
- Economic terms: resolved, approved=yes, builder-ready=no, selected=cdm.product.template.EconomicTerms
- Payout container: resolved, approved=yes, builder-ready=yes, selected=cdm.product.template.Payout
- Settlement payout: resolved, approved=yes, builder-ready=yes, selected=cdm.product.template.SettlementPayout
- Resolvable price quantity: resolved, approved=yes, builder-ready=no, selected=cdm.product.common.settlement.ResolvablePriceQuantity
- Price schedule: resolved, approved=yes, builder-ready=no, selected=cdm.observable.asset.PriceSchedule
- Party reference or party identity: resolved, approved=yes, builder-ready=no, selected=cdm.base.staticdata.party.metafields.ReferenceWithMetaParty

## Rosetta Mapping Areas

- product-root: resolved
  Functions: MapFxSingleLegNonTransferableProduct, MapProductIdentifierList, MapProductTaxonomyList
  Blocks: func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxSingleLegNonTransferableProduct, func:ingest-fpml-confirmation-common-func.rosetta:MapProductIdentifierList, func:ingest-fpml-confirmation-common-func.rosetta:MapProductTaxonomyList
- economic-terms: resolved
  Functions: MapFxSingleLegEconomicTerms
  Blocks: func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxSingleLegEconomicTerms
- settlement-payout: resolved
  Functions: MapFxCoreDetailsModelToSettlementPayout
  Blocks: func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxCoreDetailsModelToSettlementPayout
- price-quantity: resolved
  Functions: MapFxSingleLegPriceQuantityList, MapFxCoreDetailsModelPriceListWithLocation, MapFxCoreDetailsModelQuantityListWithLocation
  Blocks: func:ingest-fpml-confirmation-pricequantity-func.rosetta:MapFxCoreDetailsModelPriceListWithLocation, func:ingest-fpml-confirmation-pricequantity-func.rosetta:MapFxCoreDetailsModelQuantityListWithLocation, func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxSingleLegPriceQuantityList
- party-counterparty: resolved
  Functions: MapFxSingleLegCounterpartyList, MapFxSingleLegAncillaryPartyList
  Blocks: func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxSingleLegAncillaryPartyList, func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxSingleLegCounterpartyList
- account-party-reference: resolved
  Functions: MapFxSingleLegAccountPartyReference, MapPayerReceiverToAccountPartyReference
  Blocks: func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxSingleLegAccountPartyReference, func:ingest-fpml-confirmation-party-func.rosetta:MapPayerReceiverToAccountPartyReference
- product-identifiers-taxonomy: resolved
  Functions: MapProductIdentifierList, MapProductIdentifier, MapProductTaxonomyList
  Blocks: func:ingest-fpml-confirmation-common-func.rosetta:MapProductIdentifier, func:ingest-fpml-confirmation-common-func.rosetta:MapProductIdentifierList, func:ingest-fpml-confirmation-common-func.rosetta:MapProductTaxonomyList
- dates-settlement: resolved
  Functions: MapFxCoreDetailsModelToSettlementPayout, MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate
  Blocks: func:ingest-fpml-confirmation-datetime-func.rosetta:MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate, func:ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:MapFxCoreDetailsModelToSettlementPayout
