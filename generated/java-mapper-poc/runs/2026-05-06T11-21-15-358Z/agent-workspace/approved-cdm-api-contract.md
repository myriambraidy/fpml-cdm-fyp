# Approved CDM API Contract

Generated: 2026-05-06T11:21:15.501Z
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

### cdm.base.math.CapacityUnitEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.DatedValue

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.FinancialUnitEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.NonNegativeQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.NonNegativeQuantitySchedule

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.Quantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.QuantityChangeDirectionEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.QuantitySchedule

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.UnitType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.WeatherUnitEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.functions.CompareQuantityByUnitOfAmount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.functions.FilterQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.functions.FilterQuantityByCurrency

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.functions.FilterQuantityByCurrencyExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.functions.FilterQuantityByFinancialUnit

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.AveragingCalculationMethodMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.DatedValueMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.MeasureBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.MeasureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.MeasureScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.MoneyBoundMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.MoneyRangeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.NonNegativeQuantityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.NonNegativeQuantityScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.NonNegativeStepMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.NumberBoundMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.NumberRangeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.QuantityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.QuantityScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.RoundingMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.ScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.meta.UnitTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.metafields.FieldWithMetaNonNegativeQuantitySchedule

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.math.metafields.FieldWithMetaNonNegativeQuantityScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.math.metafields.ReferenceWithMetaNonNegativeQuantitySchedule

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.math.metafields.ReferenceWithMetaNonNegativeQuantityScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.math.processor.OpenUnitsMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.util.UnitTypeDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.DatedValueTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.DatedValueValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.NonNegativeQuantityScheduleTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.NonNegativeQuantityScheduleValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.NonNegativeQuantityTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.NonNegativeQuantityValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.QuantityScheduleTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.QuantityScheduleValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.QuantityTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.QuantityValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.UnitTypeTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.UnitTypeValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.datarule.NonNegativeQuantityNonNegativeQuantity_amount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.datarule.NonNegativeQuantityScheduleNonNegativeQuantity_amount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.datarule.QuantityAmountOnlyExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.datarule.QuantityScheduleQuantity_multiplier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.datarule.QuantityScheduleUnitOfAmountExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.datarule.UnitTypeUnitType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.exists.DatedValueOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.exists.NonNegativeQuantityOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.exists.NonNegativeQuantityScheduleOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.exists.QuantityOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.exists.QuantityScheduleOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.math.validation.exists.UnitTypeOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.Asset

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.AssetBase

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.AssetClassEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.AssetIdTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.AssetIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.AssetType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.AssetTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.Cash

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.CommodityProductDefinition

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.DeliveryDateParameters

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.DigitalAsset

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.FundProductTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.PriceSource

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.ProductIdTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.ProductIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.ProductTaxonomy

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.functions.AssetIdentifierByType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.functions.GetCashCurrency

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.functions.SetCashCurrency

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.AssetBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.AssetIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.AssetMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.AssetTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.CashMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.CollateralIssuerTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.CollateralTaxonomyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.CollateralTaxonomyValueMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.CommodityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.CommodityProductDefinitionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.CommodityReferenceFrameworkMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.DebtEconomicsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.DebtTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.DeliveryDateParametersMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.DigitalAssetMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.InstrumentBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.InstrumentMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.ListedDerivativeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.LoanMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.PriceSourceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.ProductIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.ProductTaxonomyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.QuasiGovernmentIssuerTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.RegionalGovernmentIssuerTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.SecurityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.SpecialPurposeVehicleIssuerTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.TaxonomyClassificationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.TaxonomyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.meta.TaxonomyValueMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.asset.common.metafields.FieldWithMetaAssetClassEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.asset.common.processor.AssetIdentifierTypeMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.processor.CashAssetIdentifierMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.processor.FxMetaHelper

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.processor.ProductIdDescriptionMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.processor.ProductIdentifierSourceMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.util.AssetDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetBaseTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetBaseValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetTypeTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetTypeValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.AssetValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.CashTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.CashValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.CommodityProductDefinitionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.CommodityProductDefinitionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.DeliveryDateParametersTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.DeliveryDateParametersValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.DigitalAssetTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.DigitalAssetValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.PriceSourceTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.PriceSourceValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.ProductIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.ProductIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.ProductTaxonomyTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.ProductTaxonomyValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetBaseExchangeListed

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetBaseRelatedExchange

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetTypeBondSubType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetTypeEquitySubType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetTypeFundSubType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetTypeOtherAssetSubType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.AssetTypeSecuritySubType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.CashCurrencyExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.CashNoExchange

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.CashNoTaxonomy

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.CommodityProductDefinitionCommodityProductDefinitionChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.DeliveryDateParametersDeliveryDateParametersChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.PriceSourcePriceSourceHeading

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.ProductTaxonomyTaxonomySource

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.ProductTaxonomyTaxonomyType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.datarule.ProductTaxonomyTaxonomyValue

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.AssetBaseOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.AssetIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.AssetOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.AssetTypeOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.CashOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.CommodityProductDefinitionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.DeliveryDateParametersOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.DigitalAssetOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.PriceSourceOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.ProductIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.asset.common.validation.exists.ProductTaxonomyOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.AssignedIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.CommodityLocationIdentifierTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.Identifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.LocationIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.TradeIdentifierTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.meta.AssignedIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.meta.IdentifiedListMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.meta.IdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.meta.LocationIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.metafields.FieldWithMetaIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.identifier.metafields.FieldWithMetaIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.identifier.validation.AssignedIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.AssignedIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.IdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.IdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.LocationIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.LocationIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.datarule.IdentifierIssuerChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.datarule.LocationIdentifierIdentifierType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.exists.AssignedIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.exists.IdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.identifier.validation.exists.LocationIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: approved CDM construction where cited by recipes

### cdm.base.staticdata.party.AncillaryParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.BusinessUnit

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.Counterparty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.CounterpartyRoleEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.Party

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PartyContactInformation

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PartyIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PartyIdentifierTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PartyReferencePayerReceiver

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PartyRole

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PartyRoleEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PayerReceiver

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PayerReceiverEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PersonIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.PersonIdentifierTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.RelatedParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.functions.ExtractAncillaryPartyByRole

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.functions.ExtractCounterpartyByRole

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.functions.FilterPartyRole

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.functions.FilterRelatedPartyByRole

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.functions.ReplaceParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.AccountMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.AddressMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.AncillaryEntityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.AncillaryPartyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.BusinessUnitMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.BuyerSellerMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.ContactInformationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.CounterpartyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.LegalEntityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.NaturalPersonMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.NaturalPersonRoleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.PartyContactInformationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.PartyIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.PartyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.PartyReferencePayerReceiverMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.PartyRoleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.PayerReceiverMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.PersonIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.ReferenceBankMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.ReferenceBanksMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.RelatedPartyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.meta.TelephoneNumberMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.metafields.FieldWithMetaAccountTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.FieldWithMetaAccountTypeEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.FieldWithMetaEntityTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.FieldWithMetaEntityTypeEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.FieldWithMetaNaturalPersonRoleEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.FieldWithMetaNaturalPersonRoleEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.FieldWithMetaPersonIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.FieldWithMetaPersonIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaAccount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaAccountMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaLegalEntity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaLegalEntityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaNaturalPerson

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaNaturalPersonMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaParty

- Reason: Selected for concept: Party reference or party identity. Represent payer, receiver, and party identity without inventing PartyReference.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.metafields.ReferenceWithMetaPartyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.base.staticdata.party.processor.AccountPartyReferenceMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.processor.BuyerSellerPartyHelper

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.processor.CashPaymentBuyerMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.processor.CashPaymentSellerMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.processor.PayerReceiverMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.processor.TradeSideToPartyMappingHelper

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.processor.TradeSideToPartyMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.AncillaryPartyTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.AncillaryPartyValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.BusinessUnitTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.BusinessUnitValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.CounterpartyTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.CounterpartyValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyContactInformationTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyContactInformationValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyReferencePayerReceiverTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyReferencePayerReceiverValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyRoleTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyRoleValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PartyValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PayerReceiverTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PayerReceiverValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PersonIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.PersonIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.RelatedPartyTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.RelatedPartyValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.AncillaryPartyOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.BusinessUnitOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.CounterpartyOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.PartyContactInformationOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.PartyIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.PartyOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.PartyReferencePayerReceiverOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.PartyRoleOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.PayerReceiverOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.PersonIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.base.staticdata.party.validation.exists.RelatedPartyOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: party, counterparty, payer, receiver, or reference construction

### cdm.event.common.AssetTransferTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.ContractDetails

- Reason: Selected for concept: Contract details. Attach the mapped product to the trade.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.ContractFormationInstruction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.CounterpartyPositionBusinessEvent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.CounterpartyPositionState

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.PartyChangeInstruction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.PositionIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.PriceTimingEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.QuantityChangeInstruction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.Trade

- Reason: Selected for concept: Trade root. Root trade object for generated CDM output.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.TradeIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.TradePricingReport

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.TradeState

- Reason: Selected for concept: Trade state root. Runtime output wrapper validated as tradeState.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.AdjustedValuationDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.CompareTradeStatesToAmount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_AssetTransfer

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_CashTransfer

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_ContractFormation

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_ContractFormationInstruction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_EffectiveOrTerminationDateTermChangeInstruction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_NonTransferableProduct

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_OnDemandRateChangePriceChangeInstruction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_PartyChange

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_QuantityChange

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_RepricePrimitiveInstruction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Create_TradeState

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.EquityCashSettlementAmount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ExtractAfterTrade

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ExtractBeforeEconomicTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ExtractBeforeTrade

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ExtractOpenEconomicTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ExtractTradeCollateralPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ExtractTradeCollateralQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ExtractTradePurchasePrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.FilterCashTransfers

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.FilterClosedTradeStates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.FilterOpenTradeStates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.InterestCashSettlementAmount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.NewEquitySwapProduct

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.NewFloatingPayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.NewSingleNameEquityPerformancePayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.NewTradeInstructionOnlyExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Qualify_Reprice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.QuantityDecreased

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.QuantityDecreasedToZero

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.QuantityIncreased

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ResolveCashSettlementDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ResolveInterestRateObservationIdentifiers

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.ResolvePerformanceObservationIdentifiers

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.SecurityFinanceCashSettlementAmount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.TradeNoExecutionDetails

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.TransfersForDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.UpdateIndexTransitionPriceAndRateOption

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.UpdateSpreadAdjustmentAndRateOptions

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.functions.Update_ProductDirection

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.BillingInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.BillingRecordInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.BillingRecordMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.BillingSummaryInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.BillingSummaryMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.BusinessEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CalculateTransferInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ClearingInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ClosedStateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CollateralBalanceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CollateralPortfolioMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CollateralPositionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ContractDetailsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ContractFormationInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CorporateActionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CounterpartyPositionBusinessEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CounterpartyPositionStateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.CreditEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ExecutionDetailsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ExecutionInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ExerciseEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ExerciseInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ExposureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.IndexTransitionInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.InstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.LineageMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.MarginCallBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.MarginCallExposureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.MarginCallInstructionTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.MarginCallIssuanceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.MarginCallResponseActionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.MarginCallResponseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ObservationEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ObservationInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.PartyChangeInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.PositionIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.PrimitiveInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.QuantityChangeInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ResetInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ResetMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ReturnInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ScheduledTransferMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.SecurityLendingInvoiceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.SplitInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.StateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.StockSplitInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TermsChangeInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TradeIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TradeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TradePricingReportMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TradeStateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TransferExpressionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TransferInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TransferMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.TransferStateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ValuationInstructionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.meta.ValuationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.metafields.ReferenceWithMetaCollateralPortfolio

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaCollateralPortfolioMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaContractDetails

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaContractDetailsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaExecutionDetails

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaExecutionDetailsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaTrade

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaTradeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaTradeState

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.metafields.ReferenceWithMetaTradeStateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.event.common.processor.CmePartyMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.processor.ContractFormationInstructionLegalAgreementMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.processor.NovationPartyMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.processor.ORECounterpartyMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.processor.PartyMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.processor.PartyRoleMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.processor.RelatedPartyRoleMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.ContractDetailsTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.ContractDetailsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.ContractFormationInstructionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.ContractFormationInstructionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.CounterpartyPositionBusinessEventTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.CounterpartyPositionBusinessEventValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.CounterpartyPositionStateTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.CounterpartyPositionStateValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.PartyChangeInstructionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.PartyChangeInstructionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.PositionIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.PositionIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.QuantityChangeInstructionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.QuantityChangeInstructionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradeIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradeIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradePricingReportTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradePricingReportValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradeStateTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradeStateValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradeTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.TradeValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.BusinessEventEventDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.ContractDetailsExecutedAgreement

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.ContractFormationInstructionExecutedAgreements

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.IndexTransitionInstructionPriceQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.InstructionNewTrade

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeAdditionalFixedPaymentsMortgages

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeBarrierDerterminationAgent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeClearedDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeCreditEventsMortgages

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeCreditEventsPhysicalSettlementMatrix

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeDeliverableObligationsPhysicalSettlementMatrix

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeDeterminingParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeDisruptionEventsDeterminingParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeExtraordinaryEvents

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFloatingAmountEventsMortgages

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_1

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_11

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_19

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_20

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_23

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_24

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_25

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_32

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_7

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_cd_8

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeFpML_ird_8

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeHedgingParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeObligationsPhysicalSettlementMatrix

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradePackageTrade

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeRestructuringPhysicalSettlementMatrix

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.datarule.TradeSettlementPayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.ContractDetailsOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.ContractFormationInstructionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.CounterpartyPositionBusinessEventOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.CounterpartyPositionStateOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.PartyChangeInstructionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.PositionIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.QuantityChangeInstructionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.TradeIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.TradeOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.TradePricingReportOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.event.common.validation.exists.TradeStateOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: trade root or trade state construction

### cdm.observable.asset.CashCollateralValuationMethod

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.CashPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.CashPriceTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.CommodityReferencePriceEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.FallbackReferencePrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.FxSettlementRateSource

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.MultipleValuationDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.Observable

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PartyDeterminationEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PerformanceValuationDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.Price

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PriceComposite

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PriceExpressionEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PriceOperandEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PriceQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PriceSchedule

- Reason: Selected for concept: Price schedule. Represent price values without guessing a package.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PriceSourceDisruption

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.PriceTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.SettlementRateOption

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.SettlementRateOptionEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.SingleValuationDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.TransactedPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.ValuationDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.CalculatedRateObservationDatesAndWeights

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.ObservationPeriodDatesEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.functions.DetermineWeightingDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.functions.GenerateObservationDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.functions.GenerateObservationDatesAndWeights

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.CalculatedRateDetailsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.CalculatedRateObservationDatesAndWeightsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.CalculatedRateObservationsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.FallbackRateParametersMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.FloatingRateCalculationParametersMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.ObservationParametersMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.ObservationShiftCalculationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.meta.OffsetCalculationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.validation.CalculatedRateObservationDatesAndWeightsTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.validation.CalculatedRateObservationDatesAndWeightsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.calculatedrate.validation.exists.CalculatedRateObservationDatesAndWeightsOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.ContractualDefinition

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.ContractualDefinitionIdentifier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.functions.FilterInvalidFloatingRateIndexTradeDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.functions.FloatingRateIndexMetadata

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.functions.ValidateFloatingRateIndexName

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.BusinessDayOffsetMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.ContractualDefinitionIdentifierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.ContractualDefinitionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexCalculationDefaultsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexDefinitionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexExternalMapMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexExternalMappingsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexFixingDetailsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexFixingOffsetMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexFixingTimeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexIdentificationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexMapMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FloatingRateIndexMappingsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.meta.FroHistoryMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.validation.ContractualDefinitionIdentifierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.validation.ContractualDefinitionIdentifierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.validation.ContractualDefinitionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.validation.ContractualDefinitionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.validation.datarule.ContractualDefinitionChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.validation.exists.ContractualDefinitionIdentifierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.fro.validation.exists.ContractualDefinitionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.functions.FilterPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.functions.InterestRateObservableCondition

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.functions.ObservableIsCommodity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.BasketConstituentMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.BasketMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CalculationAgentMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CashCollateralValuationMethodMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CashPriceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CreditIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CreditNotationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CreditNotationsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CreditRatingDebtMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.CurveMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.DividendApplicabilityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.EquityIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.FallbackReferencePriceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.FloatingRateIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.ForeignExchangeRateIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.FxInformationSourceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.FxRateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.FxRateSourceFixingMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.FxSettlementRateSourceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.FxSpotRateSourceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.IndexBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.IndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.InflationIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.InformationSourceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.InterestRateCurveMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.InterestRateIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.MakeWholeAmountMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.MoneyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.MultipleCreditNotationsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.MultipleDebtTypesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.MultipleValuationDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.ObservableMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.OtherIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.PerformanceValuationDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.PremiumExpressionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.PriceCompositeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.PriceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.PriceQuantityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.PriceScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.PriceSourceDisruptionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.QuotedCurrencyPairMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.RateObservationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.ReferenceSwapCurveMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.SettlementRateOptionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.SingleValuationDateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.SwapCurveValuationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.TransactedPriceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.ValuationDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.ValuationMethodMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.ValuationPostponementMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.meta.ValuationSourceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.metafields.FieldWithMetaBasketConstituent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaBasketConstituentMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaCommodityReferencePriceEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaCommodityReferencePriceEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaCreditNotation

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaCreditNotationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaInformationProviderEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaInformationProviderEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaInterestRateIndex

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaInterestRateIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaInterpolationMethodEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaInterpolationMethodEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaObservable

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaObservableMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaPriceSchedule

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaPriceScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaQuotedCurrencyPair

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaQuotedCurrencyPairMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaSettlementRateOptionEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.FieldWithMetaSettlementRateOptionEnumMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaBasketConstituent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaBasketConstituentMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaInterestRateIndex

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaInterestRateIndexMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaMoney

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaMoneyMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaObservable

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaObservableMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaPerformanceValuationDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaPerformanceValuationDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaPriceSchedule

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaPriceScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaQuotedCurrencyPair

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaQuotedCurrencyPairMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaRateObservation

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.metafields.ReferenceWithMetaRateObservationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.observable.asset.processor.CalculationAgentPartyMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.processor.IndexAssetClassMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.processor.OrePriceMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.processor.OreQuantityMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.processor.PriceQuantityHelper

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.processor.PriceUnitTypeHelper

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.processor.PriceUnitTypeMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.processor.TotalNotionalQuantityMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.util.ObservableDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.CashCollateralValuationMethodTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.CashCollateralValuationMethodValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.CashPriceTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.CashPriceValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.FallbackReferencePriceTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.FallbackReferencePriceValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.FxSettlementRateSourceTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.FxSettlementRateSourceValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.MultipleValuationDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.MultipleValuationDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.ObservableTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.ObservableValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PerformanceValuationDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PerformanceValuationDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceCompositeTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceCompositeValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceQuantityTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceQuantityValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceScheduleTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceScheduleValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceSourceDisruptionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceSourceDisruptionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.PriceValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.SettlementRateOptionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.SettlementRateOptionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.SingleValuationDateTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.SingleValuationDateValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.TransactedPriceTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.TransactedPriceValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.ValuationDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.ValuationDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.CashPricePremiumType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.CreditIndexCreditAssetClass

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.EquityIndexEquityAssetClass

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.FallbackReferencePriceFallbackCalculationAgent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.FallbackReferencePriceMaximumDaysOfPostponement

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.FloatingRateIndexInterestRateAssetClass

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.ForeignExchangeRateIndexFXAssetClass

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.FxSettlementRateSourceFxSettlementRateSourceChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.InflationIndexInterestRateAssetClass

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.MoneyCurrencyUnitExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.MultipleValuationDatesBusinessDaysThereafter

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.MultipleValuationDatesNumberValuationDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.ObservableChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.OtherIndexAssetClassRequired

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceAmountOnlyExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceCompositeArithmeticOperator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceQuantityArithmeticOperator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceQuantityInterestRateObservable

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceQuantityNonCurrencyQuantities

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleAccruedInterest

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleArithmeticOperator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleCashPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleCurrencyUnitForInterestRate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleForwardPoint

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceSchedulePositiveAssetPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceSchedulePositiveCashPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceSchedulePositiveSpotRate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleSpreadPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.PriceScheduleUnitOfAmountExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.datarule.SingleValuationDateNonNegativeBusinessDays

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.CashCollateralValuationMethodOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.CashPriceOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.FallbackReferencePriceOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.FxSettlementRateSourceOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.MultipleValuationDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.ObservableOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.PerformanceValuationDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.PriceCompositeOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.PriceOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.PriceQuantityOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.PriceScheduleOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.PriceSourceDisruptionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.SettlementRateOptionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.SingleValuationDateOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.TransactedPriceOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.observable.asset.validation.exists.ValuationDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: observable, price, quantity, or underlier construction

### cdm.product.common.settlement.AssetFlowBase

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.CashSettlementMethodEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.CashSettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.Cashflow

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.CashflowType

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.CommodityPriceReturnTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.FixedPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.FxFixingDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.PayoutBase

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.PhysicalSettlementPeriod

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.PhysicalSettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.PricingDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.QuantityMultiplier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.ResolvablePriceQuantity

- Reason: Selected for concept: Resolvable price quantity. Represent settlement price/quantity where supported by the selected payout type.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.SettlementBase

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.SettlementCentreEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.SettlementDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.SettlementProvision

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.SettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.SettlementTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.StandardSettlementStyleEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.TransferSettlementEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.ValuationDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.functions.UpdateAmountForEachMatchingQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.functions.UpdateAmountForEachMatchingQuantityImpl

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.functions.UpdateAmountForEachQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.functions.UpdateAmountForEachQuantityImpl

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.AssetFlowBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.CashSettlementTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.CashflowMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.CashflowTypeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.CommodityPriceReturnTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.ComputedAmountMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.DeliverableObligationsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.FixedPriceMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.FxFixingDateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.LoanParticipationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PCDeliverableObligationCharacMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PaymentDetailMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PaymentDiscountingMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PaymentRuleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PayoutBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PercentageRuleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PhysicalSettlementPeriodMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PhysicalSettlementTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PricingDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PrincipalPaymentMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PrincipalPaymentScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.PrincipalPaymentsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.QuantityMultiplierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.ResolvablePriceQuantityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.RollFeatureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.SettlementBaseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.SettlementDateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.SettlementProvisionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.SettlementTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.ShapingProvisionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.meta.ValuationDateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.metafields.ReferenceWithMetaCashSettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.common.settlement.metafields.ReferenceWithMetaCashSettlementTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.common.settlement.metafields.ReferenceWithMetaPhysicalSettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.common.settlement.metafields.ReferenceWithMetaPhysicalSettlementTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.common.settlement.metafields.ReferenceWithMetaResolvablePriceQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.common.settlement.metafields.ReferenceWithMetaResolvablePriceQuantityMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.common.settlement.processor.CdsFeeLegMetaMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.processor.FxOptionQuantityMetaMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.processor.PredeterminedClearingOrganizationPartyMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.processor.SettlementTypeHelper

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.processor.SettlementTypeMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.util.PhysicalSettlementPeriodDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.util.QuantityMultiplierDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.util.ValuationDateDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.AssetFlowBaseTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.AssetFlowBaseValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CashSettlementTermsTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CashSettlementTermsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CashflowTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CashflowTypeTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CashflowTypeValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CashflowValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CommodityPriceReturnTermsTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.CommodityPriceReturnTermsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.FixedPriceTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.FixedPriceValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.FxFixingDateTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.FxFixingDateValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PayoutBaseTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PayoutBaseValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PhysicalSettlementPeriodTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PhysicalSettlementPeriodValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PhysicalSettlementTermsTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PhysicalSettlementTermsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PricingDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.PricingDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.QuantityMultiplierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.QuantityMultiplierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.ResolvablePriceQuantityTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.ResolvablePriceQuantityValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementBaseTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementBaseValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementDateTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementDateValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementProvisionTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementProvisionValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementTermsTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.SettlementTermsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.ValuationDateTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.ValuationDateValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.AssetFlowBaseQuantityUnitExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.CashSettlementTermsCashCollateralMethod

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.CashSettlementTermsCashSettlementTermsChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.CashSettlementTermsFirmQuotationMethod

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.CashSettlementTermsMidMarketValuationMethod

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.CashSettlementTermsRecoveryFactor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.CashSettlementTermsReplacementValueMethod

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.CashflowTypeChoice0

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.FixedPriceNonNegativePrice_amount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.FxFixingDateBusinessCentersChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.FxFixingDateDateChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.PayoutBaseFinalPrincipalAmountExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.PhysicalSettlementPeriodBusinessDays

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.PhysicalSettlementPeriodMaximumBusinessDays

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.PhysicalSettlementPeriodOneOf2

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.PhysicalSettlementTermsPredeterminedClearingOrganizationParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.PricingDatesOneOf0

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.QuantityMultiplierOneOf0

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.ResolvablePriceQuantityQuantityMultiplier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.SettlementDateBusinessDays

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.SettlementDateDateChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.SettlementTermsCashSettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.SettlementTermsOptionSettlementChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.SettlementTermsPhysicalSettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.datarule.ValuationDateOneOf0

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.AssetFlowBaseOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.CashSettlementTermsOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.CashflowOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.CashflowTypeOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.CommodityPriceReturnTermsOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.FixedPriceOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.FxFixingDateOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.PayoutBaseOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.PhysicalSettlementPeriodOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.PhysicalSettlementTermsOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.PricingDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.QuantityMultiplierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.ResolvablePriceQuantityOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.SettlementBaseOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.SettlementDateOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.SettlementProvisionOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.SettlementTermsOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.common.settlement.validation.exists.ValuationDateOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: settlement construction in approved recipes

### cdm.product.template.AssetLeg

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.AssetPayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.AssetPayoutTradeTypeEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.CallingPartyEnum

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.CancelableProvisionAdjustedDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.EconomicTerms

- Reason: Selected for concept: Economic terms. Contain payout and economic dates.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.ExtendibleProvisionAdjustedDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.FixedPricePayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.MandatoryEarlyTerminationAdjustedDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.NonTransferableProduct

- Reason: Selected for concept: Non-transferable product. Represent FX single-leg product terms.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.OptionPayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.OptionalEarlyTerminationAdjustedDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.Payout

- Reason: Selected for concept: Payout container. Contain settlement payout details.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.PerformancePayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.Product

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.SettlementPayout

- Reason: Selected for concept: Settlement payout. Represent FX settlement payout selected from compiled jar candidates.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.TradableProduct

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.TradeLot

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.TransferableProduct

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.Underlier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.functions.AddTradeLot

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.functions.CompareTradeLot

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.functions.CompareTradeLotToAmount

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.functions.Create_CashflowFromSettlementPayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.functions.FilterTradeLot

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.functions.PriceQuantityTriangulation

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.functions.ReplaceTradeLot

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.AsianMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.AssetLegMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.AssetPayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.AutomaticExerciseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.AveragingCalculationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.AveragingStrikeFeatureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.BarrierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.CalculationScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.CalendarSpreadMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.CancelableProvisionAdjustedDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.CancelableProvisionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.CancellationEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.CompositeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ConstituentWeightMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.DividendTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.EarlyTerminationEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.EarlyTerminationProvisionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.EconomicTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.EvergreenProvisionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExerciseFeeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExerciseFeeScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExerciseNoticeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExercisePeriodMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExerciseProcedureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExerciseTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExtendibleProvisionAdjustedDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExtendibleProvisionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ExtensionEventMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.FixedPricePayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.FxFeatureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.KnockMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.MandatoryEarlyTerminationAdjustedDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.MandatoryEarlyTerminationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ManualExerciseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.MultipleExerciseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.NonTransferableProductMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.OptionFeatureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.OptionPayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.OptionStrikeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.OptionalEarlyTerminationAdjustedDatesMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.OptionalEarlyTerminationMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.PartialExerciseMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.PassThroughItemMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.PassThroughMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.PayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.PerformancePayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.PortfolioReturnTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ProductMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.QuantoMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.ReturnTermsMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.SchedulePeriodMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.SettlementPayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.StrategyFeatureMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.StrikeMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.StrikeScheduleMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.StrikeSpreadMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.TerminationProvisionMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.TradableProductMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.TradeLotMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.TransferableProductMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.meta.UnderlierMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.metafields.ReferenceWithMetaOptionPayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.template.metafields.ReferenceWithMetaOptionPayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.template.metafields.ReferenceWithMetaPayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.template.metafields.ReferenceWithMetaPayoutMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### cdm.product.template.processor.AssetCashMetaMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.processor.CdsFeeLegPayoutMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.processor.CommodityClassificationMetaMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.processor.FraPayoutSplitterMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.processor.FraPriceQuantitySplitterMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.processor.InterestRateForwardDebtPriceMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.processor.UnderlierMetaMappingProcessor

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.util.PayoutDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.util.ProductDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.util.UnderlierDeepPathUtil

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.AssetLegTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.AssetLegValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.AssetPayoutTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.AssetPayoutValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.CancelableProvisionAdjustedDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.CancelableProvisionAdjustedDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.EconomicTermsTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.EconomicTermsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.ExtendibleProvisionAdjustedDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.ExtendibleProvisionAdjustedDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.FixedPricePayoutTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.FixedPricePayoutValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.MandatoryEarlyTerminationAdjustedDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.MandatoryEarlyTerminationAdjustedDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.NonTransferableProductTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.NonTransferableProductValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.OptionPayoutTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.OptionPayoutValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.OptionalEarlyTerminationAdjustedDatesTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.OptionalEarlyTerminationAdjustedDatesValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.PayoutTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.PayoutValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.PerformancePayoutTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.PerformancePayoutValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.ProductTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.ProductValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.SettlementPayoutTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.SettlementPayoutValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.TradableProductTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.TradableProductValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.TradeLotTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.TradeLotValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.TransferableProductTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.TransferableProductValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.UnderlierTypeFormatValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.UnderlierValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.AssetPayoutQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.AssetPayoutUnderlierNotCash

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.CancelableProvisionCancelableProvisionExerciseNoticeReceiverParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.CancelableProvisionEffectiveDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsAssetPayoutDividendTermsValidation

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsDayCountFraction

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsFpML_cd_26_28

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsFpML_cd_27

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsFpML_cd_30

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsIndependentCalculationAgent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsLastRegularPaymentDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsMarketPrice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsNotionalResetInterestRatePayoutExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsNotionalResetOnPerformancePayout

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsPayRelativeTo

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsPaymentDates

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsPaymentDatesAdjustments

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsPaymentFrequency

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.EconomicTermsReturnType_Total_Requires_Dividends

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.ExerciseTermsCommencementAndExpirationDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.ExerciseTermsExerciseDateExpirationDateChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.ExtendibleProvisionExtendibleProvisionExerciseNoticeReceiverParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.FixedPricePayoutQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.MandatoryEarlyTerminationAdjustedDatesFpML_ird_44

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.ManualExerciseManualExerciseNoticeReceiverParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.NonTransferableProductPrimaryAssetClass

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.OptionPayoutClearedPhysicalSettlementExists

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.OptionPayoutDeliveryCapacity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.OptionPayoutOptionStylePresent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.OptionPayoutOptionTypePresent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.OptionPayoutPriceTimeIntervalQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.OptionalEarlyTerminationOptionalEarlyTerminationExerciseNoticeReceiverParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PayoutChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutCorrelationUnderlierOnlyBasket

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutEquitySpecificAttributes

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutNoSharePriceDividendAdjustmentForeignExchange

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutNoSharePriceDividendAdjustmentIndex

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutPortfolioOrStraightReturn

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutPortfolioReturnIsMultipleReturns

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutUnderlier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.PerformancePayoutUnderlierOfPortfolioIsBasket

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.ProductChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.SettlementPayoutBasket

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.SettlementPayoutDeliveryCapacity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.SettlementPayoutIndex

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.SettlementPayoutPriceTimeIntervalQuantity

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.SettlementPayoutSettlementTerms

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.SettlementPayoutUnderlier

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductCalculationAgentIndependent

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductCalculationAgentMandatoryEarlyTermination

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductCalculationAgentOptionalEarlyTermination

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyCancelableProvision

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyExtendibleProvision

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyManual

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductExerciseNoticeReceiverPartyOptionalEarlyTermination

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductForwardPayout_PredeterminedClearingOrganizationParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductNotionalAdjustment

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductOptionPayout_PredeterminedClearingOrganizationParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductPerformancePayout_ExtraordinaryDividendsParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductPredeterminedClearingOrganizationParty

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.TradableProductPriceQuantityTriangulation

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.datarule.UnderlierChoice

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.AssetLegOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.AssetPayoutOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.CancelableProvisionAdjustedDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.EconomicTermsOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.ExtendibleProvisionAdjustedDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.FixedPricePayoutOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.MandatoryEarlyTerminationAdjustedDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.NonTransferableProductOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.OptionPayoutOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.OptionalEarlyTerminationAdjustedDatesOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.PayoutOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.PerformancePayoutOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.ProductOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.SettlementPayoutOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.TradableProductOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.TradeLotOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.TransferableProductOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### cdm.product.template.validation.exists.UnderlierOnlyExistsValidator

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: product, economic terms, payout, or root product construction

### com.rosetta.model.metafields.FieldWithMetaDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### com.rosetta.model.metafields.FieldWithMetaDateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### com.rosetta.model.metafields.FieldWithMetaString

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### com.rosetta.model.metafields.FieldWithMetaStringMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### com.rosetta.model.metafields.ReferenceWithMetaDate

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### com.rosetta.model.metafields.ReferenceWithMetaDateMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### com.rosetta.model.metafields.ReferenceWithMetaString

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

### com.rosetta.model.metafields.ReferenceWithMetaStringMeta

- Reason: Selected by relevant package and class-name discovery for this implementation group.
- Existence authority: compiled-jar-javap
- Semantic authorities: rosetta-source, cookbook, generated-recipe
- Allowed usages: metadata wrapper construction where required by approved recipes

## Forbidden Classes

- none

## Approved Builder Methods

- cdm.base.math.NonNegativeQuantity.setValue: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.NonNegativeQuantity.setUnit: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder addDatedValue(cdm.base.math.DatedValue)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder addDatedValue(cdm.base.math.DatedValue, int)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder addDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)`
- cdm.base.math.NonNegativeQuantity.setDatedValue: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)`
- cdm.base.math.NonNegativeQuantity.setMultiplier: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setMultiplier(cdm.base.math.Measure)`
- cdm.base.math.NonNegativeQuantity.setFrequency: `public abstract cdm.base.math.NonNegativeQuantity$NonNegativeQuantityBuilder setFrequency(cdm.base.datetime.Frequency)`
- cdm.base.math.NonNegativeQuantity.setFrequency: `public default cdm.base.math.Quantity$QuantityBuilder setFrequency(cdm.base.datetime.Frequency)`
- cdm.base.math.NonNegativeQuantity.setMultiplier: `public default cdm.base.math.Quantity$QuantityBuilder setMultiplier(cdm.base.math.Measure)`
- cdm.base.math.NonNegativeQuantity.setDatedValue: `public default cdm.base.math.Quantity$QuantityBuilder setDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.Quantity$QuantityBuilder addDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.Quantity$QuantityBuilder addDatedValue(cdm.base.math.DatedValue, int)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.Quantity$QuantityBuilder addDatedValue(cdm.base.math.DatedValue)`
- cdm.base.math.NonNegativeQuantity.setUnit: `public default cdm.base.math.Quantity$QuantityBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantity.setValue: `public default cdm.base.math.Quantity$QuantityBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.NonNegativeQuantity.setFrequency: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setFrequency(cdm.base.datetime.Frequency)`
- cdm.base.math.NonNegativeQuantity.setMultiplier: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setMultiplier(cdm.base.math.Measure)`
- cdm.base.math.NonNegativeQuantity.setDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue)`
- cdm.base.math.NonNegativeQuantity.setUnit: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantity.setValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.NonNegativeQuantity.setDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)`
- cdm.base.math.NonNegativeQuantity.addDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue)`
- cdm.base.math.NonNegativeQuantity.setUnit: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantity.setValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.NonNegativeQuantitySchedule.setValue: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.NonNegativeQuantitySchedule.setUnit: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder addDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)`
- cdm.base.math.NonNegativeQuantitySchedule.setDatedValue: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setDatedValue(java.util.List<? extends cdm.base.math.DatedValue>)`
- cdm.base.math.NonNegativeQuantitySchedule.setMultiplier: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setMultiplier(cdm.base.math.Measure)`
- cdm.base.math.NonNegativeQuantitySchedule.setFrequency: `public abstract cdm.base.math.NonNegativeQuantitySchedule$NonNegativeQuantityScheduleBuilder setFrequency(cdm.base.datetime.Frequency)`
- cdm.base.math.NonNegativeQuantitySchedule.setFrequency: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setFrequency(cdm.base.datetime.Frequency)`
- cdm.base.math.NonNegativeQuantitySchedule.setMultiplier: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setMultiplier(cdm.base.math.Measure)`
- cdm.base.math.NonNegativeQuantitySchedule.setDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder addDatedValue(cdm.base.math.DatedValue)`
- cdm.base.math.NonNegativeQuantitySchedule.setUnit: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantitySchedule.setValue: `public default cdm.base.math.QuantitySchedule$QuantityScheduleBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.NonNegativeQuantitySchedule.setDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(java.util.List)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue, int)`
- cdm.base.math.NonNegativeQuantitySchedule.addDatedValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder addDatedValue(cdm.base.math.DatedValue)`
- cdm.base.math.NonNegativeQuantitySchedule.setUnit: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantitySchedule.setValue: `public default cdm.base.math.MeasureSchedule$MeasureScheduleBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.NonNegativeQuantitySchedule.setUnit: `public default cdm.base.math.MeasureBase$MeasureBaseBuilder setUnit(cdm.base.math.UnitType)`
- cdm.base.math.NonNegativeQuantitySchedule.setValue: `public default cdm.base.math.MeasureBase$MeasureBaseBuilder setValue(java.math.BigDecimal)`
- cdm.base.math.UnitType.setCapacityUnit: `public abstract cdm.base.math.UnitType$UnitTypeBuilder setCapacityUnit(cdm.base.math.CapacityUnitEnum)`
- cdm.base.math.UnitType.setWeatherUnit: `public abstract cdm.base.math.UnitType$UnitTypeBuilder setWeatherUnit(cdm.base.math.WeatherUnitEnum)`
- cdm.base.math.UnitType.setFinancialUnit: `public abstract cdm.base.math.UnitType$UnitTypeBuilder setFinancialUnit(cdm.base.math.FinancialUnitEnum)`
- cdm.base.math.UnitType.setCurrency: `public abstract cdm.base.math.UnitType$UnitTypeBuilder setCurrency(com.rosetta.model.metafields.FieldWithMetaString)`
- cdm.base.math.UnitType.setCurrencyValue: `public abstract cdm.base.math.UnitType$UnitTypeBuilder setCurrencyValue(java.lang.String)`
