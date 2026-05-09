# Final Implementation Contract

Generated: 2026-05-07T16:51:51.865Z
Product family: fx-derivatives
Implementation group: fx-single-leg

## Runtime Fixtures

- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

## Source Files

- Approved API contract: C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-07T16-51-51-679Z\agent-workspace\approved-cdm-api-contract.json
- Semantic recipes: C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-07T16-51-51-679Z\agent-workspace\semantic-recipes.json

## Rules

- Use only the approved CDM/Rosetta classes listed in this contract and approved-cdm-api-contract.json.
- Do not use classes listed under forbiddenClasses.
- Do not invent CDM classes or package names. Search the compiled jar index first.
- Never write Java import aliases. Java imports must never contain " as ".
- Use CDM Java builders as the internal model. Jackson is only for final serialization and sidecar reports.
- Follow semantic-recipes.md for object construction order and Rosetta function traceability.
- If a required class or builder method is missing from the contract, stop and report a contract gap.
- Unsupported fields must be reported explicitly; do not silently fabricate CDM fields.

## Approved Classes

- cdm.base.staticdata.asset.common.Asset
- cdm.base.staticdata.asset.common.Cash
- cdm.base.staticdata.identifier.AssignedIdentifier
- cdm.base.staticdata.identifier.Identifier
- cdm.base.staticdata.identifier.TradeIdentifierTypeEnum
- cdm.base.staticdata.party.AncillaryParty
- cdm.base.staticdata.party.Counterparty
- cdm.base.staticdata.party.Party
- cdm.base.staticdata.party.PartyIdentifier
- cdm.base.staticdata.party.PartyIdentifierTypeEnum
- cdm.base.staticdata.party.PartyRole
- cdm.base.staticdata.party.metafields.ReferenceWithMetaParty
- cdm.event.common.ContractDetails
- cdm.event.common.Trade
- cdm.event.common.TradeIdentifier
- cdm.event.common.TradeState
- cdm.observable.asset.Observable
- cdm.observable.asset.PriceSchedule
- cdm.product.asset.CommodityPayout
- cdm.product.asset.CreditDefaultPayout
- cdm.product.asset.InterestRatePayout
- cdm.product.common.settlement.CashSettlementTerms
- cdm.product.common.settlement.ResolvablePriceQuantity
- cdm.product.common.settlement.SettlementTerms
- cdm.product.common.settlement.SettlementTypeEnum
- cdm.product.template.AssetPayout
- cdm.product.template.EconomicTerms
- cdm.product.template.FixedPricePayout
- cdm.product.template.NonTransferableProduct
- cdm.product.template.OptionPayout
- cdm.product.template.Payout
- cdm.product.template.PerformancePayout
- cdm.product.template.Product
- cdm.product.template.SettlementPayout
- cdm.product.template.TradableProduct
- cdm.product.template.TransferableProduct
- cdm.product.template.Underlier
- com.rosetta.model.metafields.FieldWithMetaString

## Forbidden Classes

- cdm.base.math.meta.AveragingCalculationMethodMeta
- cdm.base.math.meta.DatedValueMeta
- cdm.base.math.meta.MeasureBaseMeta
- cdm.base.math.meta.MeasureMeta
- cdm.base.math.meta.MeasureScheduleMeta
- cdm.base.math.meta.MoneyBoundMeta
- cdm.base.math.meta.MoneyRangeMeta
- cdm.base.math.meta.NonNegativeQuantityMeta
- cdm.base.math.meta.NonNegativeQuantityScheduleMeta
- cdm.base.math.meta.NonNegativeStepMeta
- cdm.base.math.meta.NumberBoundMeta
- cdm.base.math.meta.NumberRangeMeta
- cdm.base.math.meta.QuantityMeta
- cdm.base.math.meta.QuantityScheduleMeta
- cdm.base.math.meta.RoundingMeta
- cdm.base.math.meta.ScheduleMeta
- cdm.base.math.meta.UnitTypeMeta
- cdm.base.math.processor.OpenUnitsMappingProcessor
- cdm.base.math.util.UnitTypeDeepPathUtil
- cdm.base.math.validation.datarule.NonNegativeQuantityNonNegativeQuantity_amount
- cdm.base.math.validation.datarule.NonNegativeQuantityScheduleNonNegativeQuantity_amount
- cdm.base.math.validation.datarule.QuantityAmountOnlyExists
- cdm.base.math.validation.datarule.QuantityScheduleQuantity_multiplier
- cdm.base.math.validation.datarule.QuantityScheduleUnitOfAmountExists
- cdm.base.math.validation.datarule.UnitTypeUnitType
- cdm.base.math.validation.DatedValueTypeFormatValidator
- cdm.base.math.validation.DatedValueValidator
- cdm.base.math.validation.exists.DatedValueOnlyExistsValidator
- cdm.base.math.validation.exists.NonNegativeQuantityOnlyExistsValidator
- cdm.base.math.validation.exists.NonNegativeQuantityScheduleOnlyExistsValidator
- cdm.base.math.validation.exists.QuantityOnlyExistsValidator
- cdm.base.math.validation.exists.QuantityScheduleOnlyExistsValidator
- cdm.base.math.validation.exists.UnitTypeOnlyExistsValidator
- cdm.base.math.validation.NonNegativeQuantityScheduleTypeFormatValidator
- cdm.base.math.validation.NonNegativeQuantityScheduleValidator
- cdm.base.math.validation.NonNegativeQuantityTypeFormatValidator
- cdm.base.math.validation.NonNegativeQuantityValidator
- cdm.base.math.validation.QuantityScheduleTypeFormatValidator
- cdm.base.math.validation.QuantityScheduleValidator
- cdm.base.math.validation.QuantityTypeFormatValidator
- ... 771 additional forbidden classes are listed in approved-cdm-api-contract.json

## Recipes

- fx-single-leg-tradestate
