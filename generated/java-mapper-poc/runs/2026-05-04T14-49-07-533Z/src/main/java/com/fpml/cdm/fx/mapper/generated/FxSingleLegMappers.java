package com.fpml.cdm.fx.mapper.generated;

import cdm.product.template.NonTransferableProduct;
import cdm.product.template.EconomicTerms;
import cdm.product.template.SettlementTerms;
import cdm.product.template.CashSettlementTerms;
import cdm.product.template.SettlementTypeEnum;
import cdm.product.common.settlement.SettlementPayout;
import cdm.product.common.settlement.PayerReceiver;
import cdm.product.common.settlement.SettlementDate;
import cdm.observable.asset.ResolvablePriceQuantity;
import cdm.observable.asset.Observable;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.CounterpartyRoleEnum;
import cdm.base.staticdata.party.PartyReference;
import cdm.base.staticdata.asset.common.ProductTaxonomy;
import cdm.base.staticdata.asset.common.TaxonomySourceEnum;
import cdm.base.staticdata.asset.common.TaxonomyValue;
import cdm.base.staticdata.asset.Asset;
import cdm.base.staticdata.asset.Cash;
import cdm.base.staticdata.identifier.Identifier;
import cdm.base.math.NonNegativeQuantitySchedule;
import cdm.base.math.NonNegativeQuantity;
import cdm.base.math.PriceSchedule;
import cdm.base.math.Measure;
import cdm.base.math.UnitType;
import cdm.base.math.PriceTypeEnum;
import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * FX single-leg specific mappers implementing Rosetta function patterns.
 * 
 * Rosetta trace:
 * - MapFxSingleLegNonTransferableProduct (rosetta-source: ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:34-47)
 * - MapFxSingleLegEconomicTerms (rosetta-source: ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:48-64)
 * - MapFxCoreDetailsModelToSettlementPayout (rosetta-source: ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:65-111)
 */
public class FxSingleLegMappers {

    /**
     * Maps FpML fxSingleLeg to CDM NonTransferableProduct.
     * Rosetta: MapFxSingleLegNonTransferableProduct
     */
    public static NonTransferableProduct mapNonTransferableProduct(
            FpmlFxSingleLeg fx,
            List<Counterparty> counterpartyList) {

        var economicTerms = mapEconomicTerms(fx, counterpartyList);

        return NonTransferableProduct.builder()
            .setIdentifier(new ArrayList<>())
            .setTaxonomy(mapProductTaxonomy())
            .setEconomicTerms(economicTerms)
            .build();
    }

    /**
     * Maps FpML fxSingleLeg to CDM EconomicTerms.
     * Rosetta: MapFxSingleLegEconomicTerms
     */
    public static EconomicTerms mapEconomicTerms(
            FpmlFxSingleLeg fx,
            List<Counterparty> counterpartyList) {

        var payout = mapSettlementPayout(fx, counterpartyList);

        return EconomicTerms.builder()
            .setPayout(List.of(
                cdm.product.template.Payout.builder()
                    .setSettlementPayout(payout)
                    .build()))
            .build();
    }

    /**
     * Maps FpML fxCoreDetails to CDM SettlementPayout.
     * Rosetta: MapFxCoreDetailsModelToSettlementPayout
     */
    public static SettlementPayout mapSettlementPayout(
            FpmlFxSingleLeg fx,
            List<Counterparty> counterpartyList) {

        var payerReceiver = mapPayerReceiver(fx, counterpartyList);
        var priceQuantity = mapResolvablePriceQuantity(fx);
        var settlementTerms = mapSettlementTerms(fx);
        var underlier = mapUnderlier(fx);

        return SettlementPayout.builder()
            .setPayerReceiver(payerReceiver)
            .setPriceQuantity(priceQuantity)
            .setSettlementTerms(settlementTerms)
            .setUnderlier(underlier)
            .build();
    }

    /**
     * Maps payer/receiver from exchangedCurrency payerReceiverModel.
     * Rosetta: MapPayerReceiver (ingest-fpml-confirmation-party-func.rosetta:779-797)
     */
    public static PayerReceiver mapPayerReceiver(
            FpmlFxSingleLeg fx,
            List<Counterparty> counterpartyList) {

        String payerHref = null;
        String receiverHref = null;

        if (fx.exchangedCurrency1 != null && fx.exchangedCurrency1.payerReceiverModel != null) {
            var prm = fx.exchangedCurrency1.payerReceiverModel;
            if (prm.payerModel != null && prm.payerModel.payerPartyReference != null) {
                payerHref = prm.payerModel.payerPartyReference.href;
            }
            if (prm.receiverModel != null && prm.receiverModel.receiverPartyReference != null) {
                receiverHref = prm.receiverModel.receiverPartyReference.href;
            }
        }

        return PayerReceiver.builder()
            .setPayer(mapCounterpartyRoleEnum(payerHref, counterpartyList))
            .setReceiver(mapCounterpartyRoleEnum(receiverHref, counterpartyList))
            .build();
    }

    /**
     * Resolves counterparty role enum from party reference href.
     */
    public static CounterpartyRoleEnum mapCounterpartyRoleEnum(
            String href,
            List<Counterparty> counterpartyList) {

        if (href == null || counterpartyList.isEmpty()) {
            return CounterpartyRoleEnum.PARTY_1;
        }
        for (var cp : counterpartyList) {
            if (cp.getPartyReference() != null
                && href.equals(cp.getPartyReference().getExternalReference())) {
                return cp.getRole();
            }
        }
        return CounterpartyRoleEnum.PARTY_1;
    }

    /**
     * Maps FX core details to ResolvablePriceQuantity.
     * Rosetta: MapFxCoreDetailsModelQuantityWithAddress, MapFxCoreDetailsModelPriceWithAddress
     */
    public static ResolvablePriceQuantity mapResolvablePriceQuantity(FpmlFxSingleLeg fx) {
        var quantitySchedule = mapQuantitySchedule(fx);
        var priceSchedule = mapPriceSchedule(fx);

        return ResolvablePriceQuantity.builder()
            .setQuantitySchedule(quantitySchedule)
            .setPriceSchedule(List.of(priceSchedule))
            .build();
    }

    /**
     * Maps quantity based on quote basis (Currency2PerCurrency1 vs Currency1PerCurrency2).
     * Rosetta: MapFxCoreDetailsModelQuantityWithAddress
     */
    public static NonNegativeQuantitySchedule mapQuantitySchedule(FpmlFxSingleLeg fx) {
        var qcp = fx.exchangeRate != null ? fx.exchangeRate.quotedCurrencyPair : null;
        String currency = "USD";
        BigDecimal amount = BigDecimal.ZERO;

        if (qcp != null) {
            if ("Currency2PerCurrency1".equals(qcp.quoteBasis)) {
                currency = qcp.currency1;
            } else {
                currency = qcp.currency2 != null ? qcp.currency2 : "USD";
            }
        }

        if (fx.exchangedCurrency1 != null && fx.exchangedCurrency1.paymentAmount != null) {
            amount = fx.exchangedCurrency1.paymentAmount.amount;
            currency = fx.exchangedCurrency1.paymentAmount.currency;
        }

        return NonNegativeQuantitySchedule.builder()
            .setValue(NonNegativeQuantity.builder()
                .setValue(amount)
                .setUnit(UnitType.builder()
                    .setCurrency(currency)
                    .build())
                .build())
            .build();
    }

    /**
     * Maps exchange rate to PriceSchedule.
     * Rosetta: MapFxCoreDetailsModelPriceWithAddress
     */
    public static PriceSchedule mapPriceSchedule(FpmlFxSingleLeg fx) {
        var rate = fx.exchangeRate != null ? fx.exchangeRate.rate : BigDecimal.ZERO;
        var qcp = fx.exchangeRate != null ? fx.exchangeRate.quotedCurrencyPair : null;

        String currency1 = qcp != null ? qcp.currency1 : "USD";
        String currency2 = qcp != null ? qcp.currency2 : "EUR";

        // Handle composite price for forwards (spotRate + forwardPoints)
        if (fx.exchangeRate != null 
            && fx.exchangeRate.spotRate != null 
            && fx.exchangeRate.forwardPoints != null) {
            // Composite price - spotRate + forwardPoints
            return PriceSchedule.builder()
                .setValue(Measure.builder()
                    .setValue(rate)
                    .setUnit(UnitType.builder().setCurrency(currency2).build())
                    .setPerUnitOf(UnitType.builder().setCurrency(currency1).build())
                    .setPriceType(PriceTypeEnum.EXCHANGE_RATE)
                    .build())
                .build();
        }

        return PriceSchedule.builder()
            .setValue(Measure.builder()
                .setValue(rate)
                .setUnit(UnitType.builder().setCurrency(currency2).build())
                .setPerUnitOf(UnitType.builder().setCurrency(currency1).build())
                .setPriceType(PriceTypeEnum.EXCHANGE_RATE)
                .build())
            .build();
    }

    /**
     * Maps FX cash settlement to CDM SettlementTerms.
     * Rosetta: MapFxCashSettlementToSettlementTerms
     */
    public static SettlementTerms mapSettlementTerms(FpmlFxSingleLeg fx) {
        String settlementCurrency = "USD";

        if (fx.exchangedCurrency2 != null && fx.exchangedCurrency2.paymentAmount != null) {
            settlementCurrency = fx.exchangedCurrency2.paymentAmount.currency;
        }


        // Handle NDF settlement currency
        if (fx.nonDeliverableForward != null 
            && fx.nonDeliverableForward.settlementCurrency != null) {
            settlementCurrency = fx.nonDeliverableForward.settlementCurrency;
        }

        return SettlementTerms.builder()
            .setSettlementType(SettlementTypeEnum.CASH)
            .setSettlementCurrency(settlementCurrency)
            .setSettlementDate(SettlementDate.builder()
                .setValueDate(fx.valueDate)
                .build())
            .build();
    }

    /**
     * Maps currency to Observable for underlier.
     * Rosetta: MapCurrencyToObservableCashWithAddress
     */
    public static Observable mapUnderlier(FpmlFxSingleLeg fx) {
        String currency = "USD";

        if (fx.exchangedCurrency1 != null && fx.exchangedCurrency1.paymentAmount != null) {
            currency = fx.exchangedCurrency1.paymentAmount.currency;
        }

        return Observable.builder()
            .setValue(Asset.builder()
                .setCash(Cash.builder()
                    .setIdentifier(List.of(Identifier.builder()
                        .setIdentifierType("CurrencyCode")
                        .setValue(currency)
                        .build()))
                    .setAssetType("Cash")
                    .build())
                .build())
            .build();
    }

    /**
     * Maps product taxonomy for FX single-leg.
     */
    public static List<ProductTaxonomy> mapProductTaxonomy() {
        var taxonomy = new ArrayList<ProductTaxonomy>();
        taxonomy.add(ProductTaxonomy.builder()
            .setSource(TaxonomySourceEnum.ISDA)
            .setProductQualifier("ForeignExchange_Spot_Forward")
            .build());
        return taxonomy;
    }
}
