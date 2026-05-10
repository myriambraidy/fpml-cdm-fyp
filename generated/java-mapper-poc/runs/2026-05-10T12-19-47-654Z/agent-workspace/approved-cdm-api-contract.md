# Approved CDM API Contract

Generated: 2026-05-10T12:19:48.041Z
Product family: fx-derivatives
Implementation group: fx-single-leg
Authority: compiled-jar-javap-and-semantic-recipes

## Rules

- Import only classes listed under Approved Classes.
- Do not import classes listed under Forbidden Classes.
- If a required class is not approved, stop and update this contract before implementation.
- The gate validates generated Java against this same contract.

## Concept Resolutions

### Trade root

- Status: resolved
- Selected: cdm.event.common.Trade
- Reason: selected from compiled jar index using preferred package order
- Purpose: Root trade object for generated CDM output.

### Trade state root

- Status: resolved
- Selected: cdm.event.common.TradeState
- Reason: selected from compiled jar index using preferred package order
- Purpose: Runtime output wrapper validated as tradeState.

### Contract details

- Status: resolved
- Selected: cdm.event.common.ContractDetails
- Reason: selected from compiled jar index using preferred package order
- Purpose: Attach the mapped product to the trade.

### Non-transferable product

- Status: resolved
- Selected: cdm.product.template.NonTransferableProduct
- Reason: selected from compiled jar index using preferred package order
- Purpose: Represent FX single-leg product terms.

### Economic terms

- Status: resolved
- Selected: cdm.product.template.EconomicTerms
- Reason: selected from compiled jar index using preferred package order
- Purpose: Contain payout and economic dates.

### Payout container

- Status: resolved
- Selected: cdm.product.template.Payout
- Reason: selected from compiled jar index using preferred package order
- Purpose: Contain settlement payout details.

### Settlement payout

- Status: resolved
- Selected: cdm.product.template.SettlementPayout
- Reason: selected from compiled jar index using preferred package order
- Purpose: Represent FX settlement payout selected from compiled jar candidates.

### Resolvable price quantity

- Status: resolved
- Selected: cdm.product.common.settlement.ResolvablePriceQuantity
- Reason: selected from compiled jar index using preferred package order
- Purpose: Represent settlement price/quantity where supported by the selected payout type.

### Price schedule

- Status: resolved
- Selected: cdm.observable.asset.PriceSchedule
- Reason: selected from compiled jar index using preferred package order
- Purpose: Represent price values without guessing a package.

### Party reference or party identity

- Status: resolved
- Selected: cdm.base.staticdata.party.metafields.ReferenceWithMetaParty
- Reason: selected from compiled jar index using preferred package order
- Purpose: Represent payer, receiver, and party identity without inventing PartyReference.

## Approved Classes

### cdm.base.staticdata.asset.common.Asset

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: cdm.base.staticdata.asset.common.Asset$AssetBuilder
- Enum values: none

### cdm.base.staticdata.asset.common.Cash

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: cdm.base.staticdata.asset.common.Cash$CashBuilder
- Enum values: none

### cdm.base.staticdata.identifier.AssignedIdentifier

- Reason: Selected by draft-recipe-required; evidence: builder-parameter:cdm.base.staticdata.identifier.AssignedIdentifier; draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder
- Enum values: none

### cdm.base.staticdata.identifier.Identifier

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: cdm.base.staticdata.identifier.Identifier$IdentifierBuilder
- Enum values: none

### cdm.base.staticdata.identifier.TradeIdentifierTypeEnum

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.base.staticdata.identifier.TradeIdentifierTypeEnum.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: none detected
- Enum values: none

### cdm.base.staticdata.party.AncillaryParty

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.base.staticdata.party.AncillaryParty.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction
- Builder class: cdm.base.staticdata.party.AncillaryParty$AncillaryPartyBuilder
- Enum values: none

### cdm.base.staticdata.party.Counterparty

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.base.staticdata.party.Counterparty.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction
- Builder class: cdm.base.staticdata.party.Counterparty$CounterpartyBuilder
- Enum values: none

### cdm.base.staticdata.party.Party

- Reason: Selected by draft-recipe-required; evidence: builder-parameter:cdm.base.staticdata.party.Party; draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction
- Builder class: cdm.base.staticdata.party.Party$PartyBuilder
- Enum values: none

### cdm.base.staticdata.party.PartyIdentifier

- Reason: Selected by draft-recipe-required; evidence: builder-parameter:cdm.base.staticdata.party.PartyIdentifier; draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction
- Builder class: cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder
- Enum values: none

### cdm.base.staticdata.party.PartyIdentifierTypeEnum

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.base.staticdata.party.PartyIdentifierTypeEnum.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction
- Builder class: none detected
- Enum values: none

### cdm.base.staticdata.party.PartyRole

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.base.staticdata.party.PartyRole.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction
- Builder class: cdm.base.staticdata.party.PartyRole$PartyRoleBuilder
- Enum values: none

### cdm.base.staticdata.party.metafields.ReferenceWithMetaParty

- Reason: Selected by resolved-concept; evidence: concept:Party reference or party identity; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes
- Builder class: cdm.base.staticdata.party.metafields.ReferenceWithMetaParty$ReferenceWithMetaPartyBuilder
- Enum values: none

### cdm.event.common.ContractDetails

- Reason: Selected by resolved-concept; evidence: builder-parameter:cdm.event.common.ContractDetails; concept:Contract details; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction
- Builder class: cdm.event.common.ContractDetails$ContractDetailsBuilder
- Enum values: none

### cdm.event.common.Trade

- Reason: Selected by resolved-concept; evidence: builder-parameter:cdm.event.common.Trade; concept:Trade root; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction
- Builder class: cdm.event.common.Trade$TradeBuilder
- Enum values: none

### cdm.event.common.TradeIdentifier

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction
- Builder class: cdm.event.common.TradeIdentifier$TradeIdentifierBuilder
- Enum values: none

### cdm.event.common.TradeState

- Reason: Selected by resolved-concept; evidence: concept:Trade state root; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction
- Builder class: cdm.event.common.TradeState$TradeStateBuilder
- Enum values: none

### cdm.observable.asset.Observable

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction
- Builder class: cdm.observable.asset.Observable$ObservableBuilder
- Enum values: none

### cdm.observable.asset.PriceSchedule

- Reason: Selected by resolved-concept; evidence: concept:Price schedule; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction
- Builder class: cdm.observable.asset.PriceSchedule$PriceScheduleBuilder
- Enum values: none

### cdm.product.asset.CommodityPayout

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.asset.CommodityPayout.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: cdm.product.asset.CommodityPayout$CommodityPayoutBuilder
- Enum values: none

### cdm.product.asset.CreditDefaultPayout

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.asset.CreditDefaultPayout.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder
- Enum values: none

### cdm.product.asset.InterestRatePayout

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.asset.InterestRatePayout.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes
- Builder class: none detected
- Enum values: none

### cdm.product.common.settlement.CashSettlementTerms

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes
- Builder class: cdm.product.common.settlement.CashSettlementTerms$CashSettlementTermsBuilder
- Enum values: none

### cdm.product.common.settlement.ResolvablePriceQuantity

- Reason: Selected by resolved-concept; evidence: builder-parameter:cdm.product.common.settlement.ResolvablePriceQuantity; concept:Resolvable price quantity; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes
- Builder class: cdm.product.common.settlement.ResolvablePriceQuantity$ResolvablePriceQuantityBuilder
- Enum values: none

### cdm.product.common.settlement.SettlementTerms

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes
- Builder class: cdm.product.common.settlement.SettlementTerms$SettlementTermsBuilder
- Enum values: none

### cdm.product.common.settlement.SettlementTypeEnum

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes
- Builder class: none detected
- Enum values: none

### cdm.product.template.AssetPayout

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.template.AssetPayout.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.AssetPayout$AssetPayoutBuilder
- Enum values: none

### cdm.product.template.EconomicTerms

- Reason: Selected by resolved-concept; evidence: builder-parameter:cdm.product.template.EconomicTerms; concept:Economic terms; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.EconomicTerms$EconomicTermsBuilder
- Enum values: none

### cdm.product.template.FixedPricePayout

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.template.FixedPricePayout.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.FixedPricePayout$FixedPricePayoutBuilder
- Enum values: none

### cdm.product.template.NonTransferableProduct

- Reason: Selected by resolved-concept; evidence: builder-parameter:cdm.product.template.NonTransferableProduct; concept:Non-transferable product; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder
- Enum values: none

### cdm.product.template.OptionPayout

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.template.OptionPayout.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.OptionPayout$OptionPayoutBuilder
- Enum values: none

### cdm.product.template.Payout

- Reason: Selected by resolved-concept; evidence: concept:Payout container; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.Payout$PayoutBuilder
- Enum values: none

### cdm.product.template.PerformancePayout

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.template.PerformancePayout.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.PerformancePayout$PerformancePayoutBuilder
- Enum values: none

### cdm.product.template.Product

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.Product$ProductBuilder
- Enum values: none

### cdm.product.template.SettlementPayout

- Reason: Selected by resolved-concept; evidence: builder-parameter:cdm.product.template.SettlementPayout; concept:Settlement payout; draft-recipe:fx-single-leg-tradestate; selected from compiled jar index using preferred package order.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.SettlementPayout$SettlementPayoutBuilder
- Enum values: none

### cdm.product.template.TradableProduct

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.TradableProduct$TradableProductBuilder
- Enum values: none

### cdm.product.template.TransferableProduct

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:cdm.product.template.TransferableProduct.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: none detected
- Enum values: none

### cdm.product.template.Underlier

- Reason: Selected by draft-recipe-required; evidence: draft-recipe:fx-single-leg-tradestate.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction
- Builder class: cdm.product.template.Underlier$UnderlierBuilder
- Enum values: none

### com.rosetta.model.metafields.FieldWithMetaString

- Reason: Selected by verified-builder-parameter; evidence: builder-parameter:com.rosetta.model.metafields.FieldWithMetaString.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes
- Builder class: com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder
- Enum values: none

## Forbidden Classes

- cdm.base.math.meta.AveragingCalculationMethodMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.DatedValueMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.MeasureBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.MeasureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.MeasureScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.MoneyBoundMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.MoneyRangeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.NonNegativeQuantityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.NonNegativeQuantityScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.NonNegativeStepMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.NumberBoundMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.NumberRangeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.QuantityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.QuantityScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.RoundingMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.ScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.meta.UnitTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.processor.OpenUnitsMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.util.UnitTypeDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.datarule.NonNegativeQuantityNonNegativeQuantity_amount: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.datarule.NonNegativeQuantityScheduleNonNegativeQuantity_amount: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.datarule.QuantityAmountOnlyExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.datarule.QuantityScheduleQuantity_multiplier: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.datarule.QuantityScheduleUnitOfAmountExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.datarule.UnitTypeUnitType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.DatedValueTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.DatedValueValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.exists.DatedValueOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.exists.NonNegativeQuantityOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.exists.NonNegativeQuantityScheduleOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.exists.QuantityOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.exists.QuantityScheduleOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.exists.UnitTypeOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.NonNegativeQuantityScheduleTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.NonNegativeQuantityScheduleValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.NonNegativeQuantityTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.NonNegativeQuantityValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.QuantityScheduleTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.QuantityScheduleValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.QuantityTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.QuantityValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.UnitTypeTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.math.validation.UnitTypeValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.AssetBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.AssetIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.AssetMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.AssetTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.CashMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.CollateralIssuerTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.CollateralTaxonomyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.CollateralTaxonomyValueMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.CommodityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.CommodityProductDefinitionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.CommodityReferenceFrameworkMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.DebtEconomicsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.DebtTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.DeliveryDateParametersMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.DigitalAssetMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.InstrumentBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.InstrumentMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.ListedDerivativeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.LoanMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.PriceSourceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.ProductIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.ProductTaxonomyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.QuasiGovernmentIssuerTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.RegionalGovernmentIssuerTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.SecurityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.SpecialPurposeVehicleIssuerTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.TaxonomyClassificationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.TaxonomyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.meta.TaxonomyValueMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.processor.AssetIdentifierTypeMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.processor.CashAssetIdentifierMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.processor.FxMetaHelper: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.processor.ProductIdDescriptionMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.processor.ProductIdentifierSourceMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.util.AssetDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetBaseTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetBaseValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetTypeTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetTypeValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.AssetValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.CashTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.CashValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.CommodityProductDefinitionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.CommodityProductDefinitionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetBaseExchangeListed: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetBaseRelatedExchange: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetTypeBondSubType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetTypeEquitySubType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetTypeFundSubType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetTypeOtherAssetSubType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.AssetTypeSecuritySubType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.CashCurrencyExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.CashNoExchange: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.CashNoTaxonomy: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.CommodityProductDefinitionCommodityProductDefinitionChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.DeliveryDateParametersDeliveryDateParametersChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.PriceSourcePriceSourceHeading: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.ProductTaxonomyTaxonomySource: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.ProductTaxonomyTaxonomyType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.datarule.ProductTaxonomyTaxonomyValue: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.DeliveryDateParametersTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.DeliveryDateParametersValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.DigitalAssetTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.DigitalAssetValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.AssetBaseOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.AssetIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.AssetOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.AssetTypeOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.CashOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.CommodityProductDefinitionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.DeliveryDateParametersOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.DigitalAssetOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.PriceSourceOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.ProductIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.exists.ProductTaxonomyOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.PriceSourceTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.PriceSourceValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.ProductIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.ProductIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.ProductTaxonomyTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.asset.common.validation.ProductTaxonomyValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.meta.AssignedIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.meta.IdentifiedListMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.meta.IdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.meta.LocationIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.AssignedIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.AssignedIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.datarule.IdentifierIssuerChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.datarule.LocationIdentifierIdentifierType: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.exists.AssignedIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.exists.IdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.exists.LocationIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.IdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.IdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.LocationIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.identifier.validation.LocationIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.AccountMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.AddressMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.AncillaryEntityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.AncillaryPartyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.BusinessUnitMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.BuyerSellerMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.ContactInformationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.CounterpartyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.LegalEntityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.NaturalPersonMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.NaturalPersonRoleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.PartyContactInformationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.PartyIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.PartyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.PartyReferencePayerReceiverMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.PartyRoleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.PayerReceiverMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.PersonIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.ReferenceBankMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.ReferenceBanksMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.RelatedPartyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.meta.TelephoneNumberMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.processor.AccountPartyReferenceMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.processor.BuyerSellerPartyHelper: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.processor.CashPaymentBuyerMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.processor.CashPaymentSellerMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.processor.PayerReceiverMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.processor.TradeSideToPartyMappingHelper: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.processor.TradeSideToPartyMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.AncillaryPartyTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.AncillaryPartyValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.BusinessUnitTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.BusinessUnitValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.CounterpartyTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.CounterpartyValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.AncillaryPartyOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.BusinessUnitOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.CounterpartyOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.PartyContactInformationOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.PartyIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.PartyOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.PartyReferencePayerReceiverOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.PartyRoleOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.PayerReceiverOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.PersonIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.exists.RelatedPartyOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyContactInformationTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyContactInformationValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyReferencePayerReceiverTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyReferencePayerReceiverValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyRoleTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyRoleValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PartyValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PayerReceiverTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PayerReceiverValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PersonIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.PersonIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.RelatedPartyTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.base.staticdata.party.validation.RelatedPartyValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.BillingInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.BillingRecordInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.BillingRecordMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.BillingSummaryInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.BillingSummaryMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.BusinessEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CalculateTransferInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ClearingInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ClosedStateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CollateralBalanceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CollateralPortfolioMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CollateralPositionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ContractDetailsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ContractFormationInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CorporateActionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CounterpartyPositionBusinessEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CounterpartyPositionStateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.CreditEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ExecutionDetailsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ExecutionInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ExerciseEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ExerciseInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ExposureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.IndexTransitionInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.InstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.LineageMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.MarginCallBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.MarginCallExposureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.MarginCallInstructionTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.MarginCallIssuanceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.MarginCallResponseActionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.MarginCallResponseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ObservationEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ObservationInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.PartyChangeInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.PositionIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.PrimitiveInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.QuantityChangeInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ResetInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ResetMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ReturnInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ScheduledTransferMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.SecurityLendingInvoiceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.SplitInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.StateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.StockSplitInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TermsChangeInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TradeIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TradeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TradePricingReportMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TradeStateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TransferExpressionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TransferInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TransferMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.TransferStateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ValuationInstructionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.meta.ValuationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.processor.CmePartyMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.processor.ContractFormationInstructionLegalAgreementMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.processor.NovationPartyMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.processor.ORECounterpartyMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.processor.PartyMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.processor.PartyRoleMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.processor.RelatedPartyRoleMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.ContractDetailsTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.ContractDetailsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.ContractFormationInstructionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.ContractFormationInstructionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.CounterpartyPositionBusinessEventTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.CounterpartyPositionBusinessEventValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.CounterpartyPositionStateTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.CounterpartyPositionStateValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.BusinessEventEventDate: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.ContractDetailsExecutedAgreement: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.ContractFormationInstructionExecutedAgreements: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.IndexTransitionInstructionPriceQuantity: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.InstructionNewTrade: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeAdditionalFixedPaymentsMortgages: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeBarrierDerterminationAgent: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeClearedDate: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeCreditEventsMortgages: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeCreditEventsPhysicalSettlementMatrix: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeDeliverableObligationsPhysicalSettlementMatrix: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeDeterminingParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeDisruptionEventsDeterminingParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeExtraordinaryEvents: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFloatingAmountEventsMortgages: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_1: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_11: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_19: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_20: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_23: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_24: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_25: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_32: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_7: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_cd_8: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeFpML_ird_8: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeHedgingParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeObligationsPhysicalSettlementMatrix: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradePackageTrade: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeRestructuringPhysicalSettlementMatrix: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.datarule.TradeSettlementPayout: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.ContractDetailsOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.ContractFormationInstructionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.CounterpartyPositionBusinessEventOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.CounterpartyPositionStateOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.PartyChangeInstructionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.PositionIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.QuantityChangeInstructionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.TradeIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.TradeOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.TradePricingReportOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.exists.TradeStateOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.PartyChangeInstructionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.PartyChangeInstructionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.PositionIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.PositionIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.QuantityChangeInstructionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.QuantityChangeInstructionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradeIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradeIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradePricingReportTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradePricingReportValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradeStateTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradeStateValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradeTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.event.common.validation.TradeValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.CalculatedRateDetailsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.CalculatedRateObservationDatesAndWeightsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.CalculatedRateObservationsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.FallbackRateParametersMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.FloatingRateCalculationParametersMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.ObservationParametersMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.ObservationShiftCalculationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.meta.OffsetCalculationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.validation.CalculatedRateObservationDatesAndWeightsTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.validation.CalculatedRateObservationDatesAndWeightsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.calculatedrate.validation.exists.CalculatedRateObservationDatesAndWeightsOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.BusinessDayOffsetMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.ContractualDefinitionIdentifierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.ContractualDefinitionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexCalculationDefaultsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexDefinitionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexExternalMapMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexExternalMappingsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexFixingDetailsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexFixingOffsetMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexFixingTimeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexIdentificationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexMapMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FloatingRateIndexMappingsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.meta.FroHistoryMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.validation.ContractualDefinitionIdentifierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.validation.ContractualDefinitionIdentifierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.validation.ContractualDefinitionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.validation.ContractualDefinitionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.validation.datarule.ContractualDefinitionChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.validation.exists.ContractualDefinitionIdentifierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.fro.validation.exists.ContractualDefinitionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.BasketConstituentMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.BasketMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CalculationAgentMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CashCollateralValuationMethodMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CashPriceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CreditIndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CreditNotationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CreditNotationsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CreditRatingDebtMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.CurveMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.DividendApplicabilityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.EquityIndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.FallbackReferencePriceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.FloatingRateIndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.ForeignExchangeRateIndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.FxInformationSourceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.FxRateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.FxRateSourceFixingMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.FxSettlementRateSourceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.FxSpotRateSourceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.IndexBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.IndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.InflationIndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.InformationSourceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.InterestRateCurveMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.InterestRateIndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.MakeWholeAmountMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.MoneyMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.MultipleCreditNotationsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.MultipleDebtTypesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.MultipleValuationDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.ObservableMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.OtherIndexMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.PerformanceValuationDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.PremiumExpressionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.PriceCompositeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.PriceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.PriceQuantityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.PriceScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.PriceSourceDisruptionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.QuotedCurrencyPairMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.RateObservationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.ReferenceSwapCurveMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.SettlementRateOptionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.SingleValuationDateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.SwapCurveValuationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.TransactedPriceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.ValuationDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.ValuationMethodMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.ValuationPostponementMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.meta.ValuationSourceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.CalculationAgentPartyMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.IndexAssetClassMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.OrePriceMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.OreQuantityMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.PriceQuantityHelper: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.PriceUnitTypeHelper: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.PriceUnitTypeMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.processor.TotalNotionalQuantityMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.util.ObservableDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.CashCollateralValuationMethodTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.CashCollateralValuationMethodValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.CashPriceTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.CashPriceValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.CashPricePremiumType: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.CreditIndexCreditAssetClass: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.EquityIndexEquityAssetClass: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.FallbackReferencePriceFallbackCalculationAgent: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.FallbackReferencePriceMaximumDaysOfPostponement: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.FloatingRateIndexInterestRateAssetClass: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.ForeignExchangeRateIndexFXAssetClass: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.FxSettlementRateSourceFxSettlementRateSourceChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.InflationIndexInterestRateAssetClass: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.MoneyCurrencyUnitExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.MultipleValuationDatesBusinessDaysThereafter: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.MultipleValuationDatesNumberValuationDates: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.ObservableChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.OtherIndexAssetClassRequired: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceAmountOnlyExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceCompositeArithmeticOperator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceQuantityArithmeticOperator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceQuantityInterestRateObservable: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceQuantityNonCurrencyQuantities: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleAccruedInterest: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleArithmeticOperator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleCashPrice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleCurrencyUnitForInterestRate: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleForwardPoint: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceSchedulePositiveAssetPrice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceSchedulePositiveCashPrice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceSchedulePositiveSpotRate: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleSpreadPrice: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.PriceScheduleUnitOfAmountExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.datarule.SingleValuationDateNonNegativeBusinessDays: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.CashCollateralValuationMethodOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.CashPriceOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.FallbackReferencePriceOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.FxSettlementRateSourceOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.MultipleValuationDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.ObservableOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.PerformanceValuationDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.PriceCompositeOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.PriceOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.PriceQuantityOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.PriceScheduleOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.PriceSourceDisruptionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.SettlementRateOptionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.SingleValuationDateOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.TransactedPriceOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.exists.ValuationDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.FallbackReferencePriceTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.FallbackReferencePriceValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.FxSettlementRateSourceTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.FxSettlementRateSourceValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.MultipleValuationDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.MultipleValuationDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.ObservableTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.ObservableValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PerformanceValuationDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PerformanceValuationDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceCompositeTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceCompositeValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceQuantityTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceQuantityValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceScheduleTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceScheduleValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceSourceDisruptionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceSourceDisruptionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.PriceValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.SettlementRateOptionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.SettlementRateOptionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.SingleValuationDateTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.SingleValuationDateValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.TransactedPriceTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.TransactedPriceValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.ValuationDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.observable.asset.validation.ValuationDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.AssetFlowBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.CashflowMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.CashflowTypeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.CashSettlementTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.CommodityPriceReturnTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.ComputedAmountMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.DeliverableObligationsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.FixedPriceMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.FxFixingDateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.LoanParticipationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PaymentDetailMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PaymentDiscountingMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PaymentRuleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PayoutBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PCDeliverableObligationCharacMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PercentageRuleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PhysicalSettlementPeriodMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PhysicalSettlementTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PricingDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PrincipalPaymentMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PrincipalPaymentScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.PrincipalPaymentsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.QuantityMultiplierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.ResolvablePriceQuantityMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.RollFeatureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.SettlementBaseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.SettlementDateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.SettlementProvisionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.SettlementTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.ShapingProvisionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.meta.ValuationDateMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.processor.CdsFeeLegMetaMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.processor.FxOptionQuantityMetaMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.processor.PredeterminedClearingOrganizationPartyMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.processor.SettlementTypeHelper: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.processor.SettlementTypeMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.util.PhysicalSettlementPeriodDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.util.QuantityMultiplierDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.util.ValuationDateDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.AssetFlowBaseTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.AssetFlowBaseValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CashflowTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CashflowTypeTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CashflowTypeValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CashflowValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CashSettlementTermsTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CashSettlementTermsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CommodityPriceReturnTermsTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.CommodityPriceReturnTermsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.AssetFlowBaseQuantityUnitExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.CashflowTypeChoice0: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.CashSettlementTermsCashCollateralMethod: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.CashSettlementTermsCashSettlementTermsChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.CashSettlementTermsFirmQuotationMethod: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.CashSettlementTermsMidMarketValuationMethod: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.CashSettlementTermsRecoveryFactor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.CashSettlementTermsReplacementValueMethod: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.FixedPriceNonNegativePrice_amount: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.FxFixingDateBusinessCentersChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.FxFixingDateDateChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.PayoutBaseFinalPrincipalAmountExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.PhysicalSettlementPeriodBusinessDays: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.PhysicalSettlementPeriodMaximumBusinessDays: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.PhysicalSettlementPeriodOneOf2: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.PhysicalSettlementTermsPredeterminedClearingOrganizationParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.PricingDatesOneOf0: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.QuantityMultiplierOneOf0: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.ResolvablePriceQuantityQuantityMultiplier: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.SettlementDateBusinessDays: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.SettlementDateDateChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.SettlementTermsCashSettlementTerms: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.SettlementTermsOptionSettlementChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.SettlementTermsPhysicalSettlementTerms: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.datarule.ValuationDateOneOf0: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.AssetFlowBaseOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.CashflowOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.CashflowTypeOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.CashSettlementTermsOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.CommodityPriceReturnTermsOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.FixedPriceOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.FxFixingDateOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.PayoutBaseOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.PhysicalSettlementPeriodOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.PhysicalSettlementTermsOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.PricingDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.QuantityMultiplierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.ResolvablePriceQuantityOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.SettlementBaseOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.SettlementDateOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.SettlementProvisionOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.SettlementTermsOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.exists.ValuationDateOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.FixedPriceTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.FixedPriceValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.FxFixingDateTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.FxFixingDateValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PayoutBaseTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PayoutBaseValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PhysicalSettlementPeriodTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PhysicalSettlementPeriodValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PhysicalSettlementTermsTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PhysicalSettlementTermsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PricingDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.PricingDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.QuantityMultiplierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.QuantityMultiplierValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.ResolvablePriceQuantityTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.ResolvablePriceQuantityValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementBaseTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementBaseValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementDateTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementDateValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementProvisionTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementProvisionValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementTermsTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.SettlementTermsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.ValuationDateTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.common.settlement.validation.ValuationDateValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.AsianMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.AssetLegMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.AssetPayoutMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.AutomaticExerciseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.AveragingCalculationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.AveragingStrikeFeatureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.BarrierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.CalculationScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.CalendarSpreadMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.CancelableProvisionAdjustedDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.CancelableProvisionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.CancellationEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.CompositeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ConstituentWeightMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.DividendTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.EarlyTerminationEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.EarlyTerminationProvisionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.EconomicTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.EvergreenProvisionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExerciseFeeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExerciseFeeScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExerciseNoticeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExercisePeriodMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExerciseProcedureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExerciseTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExtendibleProvisionAdjustedDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExtendibleProvisionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ExtensionEventMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.FixedPricePayoutMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.FxFeatureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.KnockMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.MandatoryEarlyTerminationAdjustedDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.MandatoryEarlyTerminationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ManualExerciseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.MultipleExerciseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.NonTransferableProductMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.OptionalEarlyTerminationAdjustedDatesMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.OptionalEarlyTerminationMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.OptionFeatureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.OptionPayoutMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.OptionStrikeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.PartialExerciseMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.PassThroughItemMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.PassThroughMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.PayoutMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.PerformancePayoutMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.PortfolioReturnTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ProductMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.QuantoMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.ReturnTermsMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.SchedulePeriodMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.SettlementPayoutMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.StrategyFeatureMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.StrikeMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.StrikeScheduleMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.StrikeSpreadMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.TerminationProvisionMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.TradableProductMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.TradeLotMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.TransferableProductMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.meta.UnderlierMeta: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.processor.AssetCashMetaMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.processor.CdsFeeLegPayoutMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.processor.CommodityClassificationMetaMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.processor.FraPayoutSplitterMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.processor.FraPriceQuantitySplitterMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.processor.InterestRateForwardDebtPriceMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.processor.UnderlierMetaMappingProcessor: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.util.PayoutDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.util.ProductDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.util.UnderlierDeepPathUtil: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.AssetLegTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.AssetLegValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.AssetPayoutTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.AssetPayoutValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.CancelableProvisionAdjustedDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.CancelableProvisionAdjustedDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.AssetPayoutQuantity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.AssetPayoutUnderlierNotCash: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.CancelableProvisionCancelableProvisionExerciseNoticeReceiverParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.CancelableProvisionEffectiveDate: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsAssetPayoutDividendTermsValidation: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsDayCountFraction: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsFpML_cd_26_28: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsFpML_cd_27: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsFpML_cd_30: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsIndependentCalculationAgent: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsLastRegularPaymentDate: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsMarketPrice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsNotionalResetInterestRatePayoutExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsNotionalResetOnPerformancePayout: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsPaymentDates: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsPaymentDatesAdjustments: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsPaymentFrequency: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsPayRelativeTo: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsQuantity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.EconomicTermsReturnType_Total_Requires_Dividends: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.ExerciseTermsCommencementAndExpirationDate: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.ExerciseTermsExerciseDateExpirationDateChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.ExtendibleProvisionExtendibleProvisionExerciseNoticeReceiverParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.FixedPricePayoutQuantity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.MandatoryEarlyTerminationAdjustedDatesFpML_ird_44: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.ManualExerciseManualExerciseNoticeReceiverParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.NonTransferableProductPrimaryAssetClass: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.OptionalEarlyTerminationOptionalEarlyTerminationExerciseNoticeReceiverParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.OptionPayoutClearedPhysicalSettlementExists: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.OptionPayoutDeliveryCapacity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.OptionPayoutOptionStylePresent: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.OptionPayoutOptionTypePresent: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.OptionPayoutPriceTimeIntervalQuantity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PayoutChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutCorrelationUnderlierOnlyBasket: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutEquitySpecificAttributes: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutNoSharePriceDividendAdjustmentForeignExchange: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutNoSharePriceDividendAdjustmentIndex: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutPortfolioOrStraightReturn: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutPortfolioReturnIsMultipleReturns: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutQuantity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutUnderlier: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.PerformancePayoutUnderlierOfPortfolioIsBasket: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.ProductChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.SettlementPayoutBasket: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.SettlementPayoutDeliveryCapacity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.SettlementPayoutIndex: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.SettlementPayoutPriceTimeIntervalQuantity: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.SettlementPayoutSettlementTerms: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.SettlementPayoutUnderlier: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductCalculationAgentIndependent: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductCalculationAgentMandatoryEarlyTermination: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductCalculationAgentOptionalEarlyTermination: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyCancelableProvision: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyExtendibleProvision: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyManual: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyOptionalEarlyTermination: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductForwardPayout_PredeterminedClearingOrganizationParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductNotionalAdjustment: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductOptionPayout_PredeterminedClearingOrganizationParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductPerformancePayout_ExtraordinaryDividendsParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductPredeterminedClearingOrganizationParty: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.TradableProductPriceQuantityTriangulation: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.datarule.UnderlierChoice: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.EconomicTermsTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.EconomicTermsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.AssetLegOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.AssetPayoutOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.CancelableProvisionAdjustedDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.EconomicTermsOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.ExtendibleProvisionAdjustedDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.FixedPricePayoutOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.MandatoryEarlyTerminationAdjustedDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.NonTransferableProductOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.OptionalEarlyTerminationAdjustedDatesOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.OptionPayoutOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.PayoutOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.PerformancePayoutOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.ProductOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.SettlementPayoutOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.TradableProductOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.TradeLotOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.TransferableProductOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.exists.UnderlierOnlyExistsValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.ExtendibleProvisionAdjustedDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.ExtendibleProvisionAdjustedDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.FixedPricePayoutTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.FixedPricePayoutValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.MandatoryEarlyTerminationAdjustedDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.MandatoryEarlyTerminationAdjustedDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.NonTransferableProductTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.NonTransferableProductValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.OptionalEarlyTerminationAdjustedDatesTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.OptionalEarlyTerminationAdjustedDatesValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.OptionPayoutTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.OptionPayoutValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.PayoutTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.PayoutValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.PerformancePayoutTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.PerformancePayoutValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.ProductTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.ProductValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.SettlementPayoutTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.SettlementPayoutValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.TradableProductTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.TradableProductValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.TradeLotTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.TradeLotValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.TransferableProductTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.TransferableProductValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.UnderlierTypeFormatValidator: Rejected because this package category is not allowed in the approved API contract.
- cdm.product.template.validation.UnderlierValidator: Rejected because this package category is not allowed in the approved API contract.

## Approved Builder Methods

- cdm.base.staticdata.identifier.AssignedIdentifier.getIdentifier [set-identifier]: `public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getIdentifier()`
- cdm.base.staticdata.identifier.AssignedIdentifier.getIdentifier [set-identifier]: `public default com.rosetta.model.metafields.FieldWithMetaString getIdentifier()`
- cdm.base.staticdata.identifier.AssignedIdentifier.getOrCreateIdentifier [set-identifier]: `public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateIdentifier()`
- cdm.base.staticdata.identifier.AssignedIdentifier.setIdentifier [set-identifier]: `public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder setIdentifier(com.rosetta.model.metafields.FieldWithMetaString)`
- cdm.base.staticdata.identifier.AssignedIdentifier.setIdentifierValue [set-identifier]: `public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder setIdentifierValue(java.lang.String)`
- cdm.base.staticdata.identifier.Identifier.addAssignedIdentifier [set-identifier]: `public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier, int)`
- cdm.base.staticdata.identifier.Identifier.addAssignedIdentifier [set-identifier]: `public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier)`
- cdm.base.staticdata.identifier.Identifier.addAssignedIdentifier [set-identifier]: `public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)`
- cdm.base.staticdata.identifier.Identifier.getAssignedIdentifier [set-identifier]: `public abstract java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder> getAssignedIdentifier()`
- cdm.base.staticdata.identifier.Identifier.getOrCreateAssignedIdentifier [set-identifier]: `public abstract cdm.base.staticdata.identifier.AssignedIdentifier$AssignedIdentifierBuilder getOrCreateAssignedIdentifier(int)`
- cdm.base.staticdata.identifier.Identifier.setAssignedIdentifier [set-identifier]: `public abstract cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)`
- cdm.base.staticdata.party.Party.addPartyId [set-party]: `public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(cdm.base.staticdata.party.PartyIdentifier, int)`
- cdm.base.staticdata.party.Party.addPartyId [set-party]: `public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(cdm.base.staticdata.party.PartyIdentifier)`
- cdm.base.staticdata.party.Party.addPartyId [set-party]: `public abstract cdm.base.staticdata.party.Party$PartyBuilder addPartyId(java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier>)`
- cdm.base.staticdata.party.Party.getOrCreatePartyId [set-party]: `public abstract cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder getOrCreatePartyId(int)`
- cdm.base.staticdata.party.Party.getPartyId [set-party]: `public abstract java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder> getPartyId()`
- cdm.base.staticdata.party.Party.setPartyId [set-party]: `public abstract cdm.base.staticdata.party.Party$PartyBuilder setPartyId(java.util.List<? extends cdm.base.staticdata.party.PartyIdentifier>)`
- cdm.base.staticdata.party.PartyIdentifier.getIdentifier [set-identifier]: `public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getIdentifier()`
- cdm.base.staticdata.party.PartyIdentifier.getIdentifier [set-identifier]: `public default com.rosetta.model.metafields.FieldWithMetaString getIdentifier()`
- cdm.base.staticdata.party.PartyIdentifier.getOrCreateIdentifier [set-identifier]: `public abstract com.rosetta.model.metafields.FieldWithMetaString$FieldWithMetaStringBuilder getOrCreateIdentifier()`
- cdm.base.staticdata.party.PartyIdentifier.setIdentifier [set-identifier]: `public abstract cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder setIdentifier(com.rosetta.model.metafields.FieldWithMetaString)`
- cdm.base.staticdata.party.PartyIdentifier.setIdentifierType [set-identifier]: `public abstract cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder setIdentifierType(cdm.base.staticdata.party.PartyIdentifierTypeEnum)`
- cdm.base.staticdata.party.PartyIdentifier.setIdentifierValue [set-identifier]: `public abstract cdm.base.staticdata.party.PartyIdentifier$PartyIdentifierBuilder setIdentifierValue(java.lang.String)`
- cdm.event.common.Trade.addAncillaryParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty, int)`
- cdm.event.common.Trade.addAncillaryParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty)`
- cdm.event.common.Trade.addAncillaryParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addAncillaryParty(java.util.List<? extends cdm.base.staticdata.party.AncillaryParty>)`
- cdm.event.common.Trade.addAncillaryParty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty, int)`
- cdm.event.common.Trade.addAncillaryParty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(cdm.base.staticdata.party.AncillaryParty)`
- cdm.event.common.Trade.addAncillaryParty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder addAncillaryParty(java.util.List)`
- cdm.event.common.Trade.addCounterparty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addCounterparty(cdm.base.staticdata.party.Counterparty, int)`
- cdm.event.common.Trade.addCounterparty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addCounterparty(cdm.base.staticdata.party.Counterparty)`
- cdm.event.common.Trade.addCounterparty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addCounterparty(java.util.List<? extends cdm.base.staticdata.party.Counterparty>)`
- cdm.event.common.Trade.addCounterparty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(cdm.base.staticdata.party.Counterparty, int)`
- cdm.event.common.Trade.addCounterparty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(cdm.base.staticdata.party.Counterparty)`
- cdm.event.common.Trade.addCounterparty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder addCounterparty(java.util.List)`
- cdm.event.common.Trade.addParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addParty(cdm.base.staticdata.party.Party, int)`
- cdm.event.common.Trade.addParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addParty(cdm.base.staticdata.party.Party)`
- cdm.event.common.Trade.addParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addParty(java.util.List<? extends cdm.base.staticdata.party.Party>)`
- cdm.event.common.Trade.addPartyRole [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addPartyRole(cdm.base.staticdata.party.PartyRole, int)`
- cdm.event.common.Trade.addPartyRole [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addPartyRole(cdm.base.staticdata.party.PartyRole)`
- cdm.event.common.Trade.addPartyRole [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder addPartyRole(java.util.List<? extends cdm.base.staticdata.party.PartyRole>)`
- cdm.event.common.Trade.getOrCreateParty [set-party]: `public abstract cdm.base.staticdata.party.Party$PartyBuilder getOrCreateParty(int)`
- cdm.event.common.Trade.getOrCreatePartyRole [set-party]: `public abstract cdm.base.staticdata.party.PartyRole$PartyRoleBuilder getOrCreatePartyRole(int)`
- cdm.event.common.Trade.getParty [set-party]: `public abstract java.util.List<? extends cdm.base.staticdata.party.Party$PartyBuilder> getParty()`
- cdm.event.common.Trade.getPartyRole [set-party]: `public abstract java.util.List<? extends cdm.base.staticdata.party.PartyRole$PartyRoleBuilder> getPartyRole()`
- cdm.event.common.Trade.setAncillaryParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder setAncillaryParty(java.util.List<? extends cdm.base.staticdata.party.AncillaryParty>)`
- cdm.event.common.Trade.setAncillaryParty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder setAncillaryParty(java.util.List)`
- cdm.event.common.Trade.setContractDetails [set-contract-details]: `public abstract cdm.event.common.Trade$TradeBuilder setContractDetails(cdm.event.common.ContractDetails)`
- cdm.event.common.Trade.setCounterparty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder setCounterparty(java.util.List<? extends cdm.base.staticdata.party.Counterparty>)`
- cdm.event.common.Trade.setCounterparty [set-party]: `public default cdm.product.template.TradableProduct$TradableProductBuilder setCounterparty(java.util.List)`
- cdm.event.common.Trade.setParty [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder setParty(java.util.List<? extends cdm.base.staticdata.party.Party>)`
- cdm.event.common.Trade.setPartyRole [set-party]: `public abstract cdm.event.common.Trade$TradeBuilder setPartyRole(java.util.List<? extends cdm.base.staticdata.party.PartyRole>)`
- cdm.event.common.Trade.setProduct [set-product]: `public abstract cdm.event.common.Trade$TradeBuilder setProduct(cdm.product.template.NonTransferableProduct)`
- cdm.event.common.Trade.setProduct [set-product]: `public default cdm.product.template.TradableProduct$TradableProductBuilder setProduct(cdm.product.template.NonTransferableProduct)`
- cdm.event.common.TradeIdentifier.addAssignedIdentifier [set-identifier]: `public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier, int)`
- cdm.event.common.TradeIdentifier.addAssignedIdentifier [set-identifier]: `public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier)`
- cdm.event.common.TradeIdentifier.addAssignedIdentifier [set-identifier]: `public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder addAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)`
- cdm.event.common.TradeIdentifier.addAssignedIdentifier [set-identifier]: `public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier, int)`
- cdm.event.common.TradeIdentifier.addAssignedIdentifier [set-identifier]: `public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(cdm.base.staticdata.identifier.AssignedIdentifier)`
- cdm.event.common.TradeIdentifier.addAssignedIdentifier [set-identifier]: `public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder addAssignedIdentifier(java.util.List)`
- cdm.event.common.TradeIdentifier.setAssignedIdentifier [set-identifier]: `public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setAssignedIdentifier(java.util.List<? extends cdm.base.staticdata.identifier.AssignedIdentifier>)`
- cdm.event.common.TradeIdentifier.setAssignedIdentifier [set-identifier]: `public default cdm.base.staticdata.identifier.Identifier$IdentifierBuilder setAssignedIdentifier(java.util.List)`
- cdm.event.common.TradeIdentifier.setIdentifierType [set-identifier]: `public abstract cdm.event.common.TradeIdentifier$TradeIdentifierBuilder setIdentifierType(cdm.base.staticdata.identifier.TradeIdentifierTypeEnum)`
- cdm.event.common.TradeState.setTrade [set-trade]: `public abstract cdm.event.common.TradeState$TradeStateBuilder setTrade(cdm.event.common.Trade)`
- cdm.product.template.NonTransferableProduct.getEconomicTerms [set-economic-terms]: `public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder getEconomicTerms()`
- cdm.product.template.NonTransferableProduct.getEconomicTerms [set-economic-terms]: `public default cdm.product.template.EconomicTerms getEconomicTerms()`
- cdm.product.template.NonTransferableProduct.getOrCreateEconomicTerms [set-economic-terms]: `public abstract cdm.product.template.EconomicTerms$EconomicTermsBuilder getOrCreateEconomicTerms()`
- cdm.product.template.NonTransferableProduct.setEconomicTerms [set-economic-terms]: `public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder setEconomicTerms(cdm.product.template.EconomicTerms)`
- cdm.product.template.Payout.getAssetPayout [set-payout]: `public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder getAssetPayout()`
- cdm.product.template.Payout.getAssetPayout [set-payout]: `public default cdm.product.template.AssetPayout getAssetPayout()`
- cdm.product.template.Payout.getCommodityPayout [set-payout]: `public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder getCommodityPayout()`
- cdm.product.template.Payout.getCommodityPayout [set-payout]: `public default cdm.product.asset.CommodityPayout getCommodityPayout()`
- cdm.product.template.Payout.getCreditDefaultPayout [set-payout]: `public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder getCreditDefaultPayout()`
- cdm.product.template.Payout.getCreditDefaultPayout [set-payout]: `public default cdm.product.asset.CreditDefaultPayout getCreditDefaultPayout()`
- cdm.product.template.Payout.getFixedPricePayout [set-payout]: `public abstract cdm.product.template.FixedPricePayout$FixedPricePayoutBuilder getFixedPricePayout()`
- cdm.product.template.Payout.getFixedPricePayout [set-payout]: `public default cdm.product.template.FixedPricePayout getFixedPricePayout()`
- cdm.product.template.Payout.getInterestRatePayout [set-payout]: `public abstract cdm.product.asset.InterestRatePayout$InterestRatePayoutBuilder getInterestRatePayout()`
- cdm.product.template.Payout.getInterestRatePayout [set-payout]: `public default cdm.product.asset.InterestRatePayout getInterestRatePayout()`
- cdm.product.template.Payout.getOptionPayout [set-payout]: `public abstract cdm.product.template.OptionPayout$OptionPayoutBuilder getOptionPayout()`
- cdm.product.template.Payout.getOptionPayout [set-payout]: `public default cdm.product.template.OptionPayout getOptionPayout()`
- cdm.product.template.Payout.getOrCreateAssetPayout [set-payout]: `public abstract cdm.product.template.AssetPayout$AssetPayoutBuilder getOrCreateAssetPayout()`
- cdm.product.template.Payout.getOrCreateCommodityPayout [set-payout]: `public abstract cdm.product.asset.CommodityPayout$CommodityPayoutBuilder getOrCreateCommodityPayout()`
- cdm.product.template.Payout.getOrCreateCreditDefaultPayout [set-payout]: `public abstract cdm.product.asset.CreditDefaultPayout$CreditDefaultPayoutBuilder getOrCreateCreditDefaultPayout()`
- cdm.product.template.Payout.getOrCreateFixedPricePayout [set-payout]: `public abstract cdm.product.template.FixedPricePayout$FixedPricePayoutBuilder getOrCreateFixedPricePayout()`
- cdm.product.template.Payout.getOrCreateInterestRatePayout [set-payout]: `public abstract cdm.product.asset.InterestRatePayout$InterestRatePayoutBuilder getOrCreateInterestRatePayout()`
- cdm.product.template.Payout.getOrCreateOptionPayout [set-payout]: `public abstract cdm.product.template.OptionPayout$OptionPayoutBuilder getOrCreateOptionPayout()`
- cdm.product.template.Payout.getOrCreatePerformancePayout [set-payout]: `public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder getOrCreatePerformancePayout()`
- cdm.product.template.Payout.getOrCreateSettlementPayout [set-settlement-payout]: `public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder getOrCreateSettlementPayout()`
- cdm.product.template.Payout.getPerformancePayout [set-payout]: `public abstract cdm.product.template.PerformancePayout$PerformancePayoutBuilder getPerformancePayout()`
- cdm.product.template.Payout.getPerformancePayout [set-payout]: `public default cdm.product.template.PerformancePayout getPerformancePayout()`
- cdm.product.template.Payout.getSettlementPayout [set-settlement-payout]: `public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder getSettlementPayout()`
- cdm.product.template.Payout.getSettlementPayout [set-settlement-payout]: `public default cdm.product.template.SettlementPayout getSettlementPayout()`
- cdm.product.template.Payout.setAssetPayout [set-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setAssetPayout(cdm.product.template.AssetPayout)`
- cdm.product.template.Payout.setCommodityPayout [set-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setCommodityPayout(cdm.product.asset.CommodityPayout)`
- cdm.product.template.Payout.setCreditDefaultPayout [set-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setCreditDefaultPayout(cdm.product.asset.CreditDefaultPayout)`
- cdm.product.template.Payout.setFixedPricePayout [set-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setFixedPricePayout(cdm.product.template.FixedPricePayout)`
- cdm.product.template.Payout.setInterestRatePayout [set-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setInterestRatePayout(cdm.product.asset.InterestRatePayout)`
- cdm.product.template.Payout.setOptionPayout [set-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setOptionPayout(cdm.product.template.OptionPayout)`
- cdm.product.template.Payout.setPerformancePayout [set-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setPerformancePayout(cdm.product.template.PerformancePayout)`
- cdm.product.template.Payout.setSettlementPayout [set-settlement-payout]: `public abstract cdm.product.template.Payout$PayoutBuilder setSettlementPayout(cdm.product.template.SettlementPayout)`
- cdm.product.template.Product.getNonTransferableProduct [set-product]: `public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getNonTransferableProduct()`
- cdm.product.template.Product.getNonTransferableProduct [set-product]: `public default cdm.product.template.NonTransferableProduct getNonTransferableProduct()`
- cdm.product.template.Product.getOrCreateNonTransferableProduct [set-product]: `public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getOrCreateNonTransferableProduct()`
- cdm.product.template.Product.getOrCreateTransferableProduct [set-product]: `public abstract cdm.product.template.TransferableProduct$TransferableProductBuilder getOrCreateTransferableProduct()`
- cdm.product.template.Product.getTransferableProduct [set-product]: `public abstract cdm.product.template.TransferableProduct$TransferableProductBuilder getTransferableProduct()`
- cdm.product.template.Product.getTransferableProduct [set-product]: `public default cdm.product.template.TransferableProduct getTransferableProduct()`
- cdm.product.template.Product.setNonTransferableProduct [set-product]: `public abstract cdm.product.template.Product$ProductBuilder setNonTransferableProduct(cdm.product.template.NonTransferableProduct)`
- cdm.product.template.Product.setTransferableProduct [set-product]: `public abstract cdm.product.template.Product$ProductBuilder setTransferableProduct(cdm.product.template.TransferableProduct)`
- cdm.product.template.SettlementPayout.setPriceQuantity [set-price-quantity]: `public abstract cdm.product.template.SettlementPayout$SettlementPayoutBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)`
- cdm.product.template.SettlementPayout.setPriceQuantity [set-price-quantity]: `public default cdm.product.common.settlement.PayoutBase$PayoutBaseBuilder setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)`
- cdm.product.template.TradableProduct.getOrCreateProduct [set-product]: `public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getOrCreateProduct()`
- cdm.product.template.TradableProduct.getProduct [set-product]: `public abstract cdm.product.template.NonTransferableProduct$NonTransferableProductBuilder getProduct()`
- cdm.product.template.TradableProduct.getProduct [set-product]: `public default cdm.product.template.NonTransferableProduct getProduct()`
- cdm.product.template.TradableProduct.setProduct [set-product]: `public abstract cdm.product.template.TradableProduct$TradableProductBuilder setProduct(cdm.product.template.NonTransferableProduct)`
