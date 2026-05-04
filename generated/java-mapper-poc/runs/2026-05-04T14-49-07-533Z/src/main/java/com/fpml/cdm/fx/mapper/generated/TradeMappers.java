package com.fpml.cdm.fx.mapper.generated;


import cdm.event.common.Trade;
import cdm.event.common.TradeIdentifier;
import cdm.event.common.TradeLot;
import cdm.base.staticdata.asset.PriceQuantity;
import cdm.base.staticdata.party.Party;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.PartyReference;
import cdm.observable.asset.Observable;
import cdm.base.staticdata.asset.Asset;
import cdm.base.staticdata.asset.Cash;
import cdm.base.staticdata.identifier.Identifier;
import cdm.base.math.NonNegativeQuantity;
import cdm.base.math.PriceSchedule;
import cdm.base.math.Measure;
import cdm.base.math.UnitType;
import cdm.base.math.PriceTypeEnum;
import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;

/**
 * Trade-level mapping utilities.
 * 
 * Rosetta trace:
 * - Trade structure follows CDM event.common.Trade
 * - TradeIdentifier mapped from partyTradeIdentifier
 * - TradeLot mapped from exchangeRate and payment amounts
 */
public class TradeMappers {

    /**
     * Builds the complete Trade from FpML document.
     */
    public static Trade buildTrade(
            FpmlDocument doc,
            FpmlFxSingleLeg fx,
            cdm.product.template.NonTransferableProduct product,
            List<Counterparty> counterparties,
            List<Party> parties,
            List<TradeIdentifier> tradeIdentifiers,
            List<TradeLot> tradeLots) {

        return Trade.builder()
            .setTradeDate(doc.tradeDate)
            .setProduct(product)
            .setCounterparty(counterparties)
            .setParty(parties)
            .setTradeIdentifier(tradeIdentifiers)
            .setTradeLot(tradeLots)
            .build();
    }

    /**
     * Maps partyTradeIdentifier list to TradeIdentifier list.
     */
    public static List<TradeIdentifier> mapTradeIdentifiers(
            FpmlDocument doc,
            List<Counterparty> counterpartyList) {

        var identifiers = new ArrayList<TradeIdentifier>();

        if (doc.partyTradeIdentifiers != null) {
            for (var pti : doc.partyTradeIdentifiers) {
                var issuerHref = pti.partyReference != null ? pti.partyReference.href : null;

                var tid = TradeIdentifier.builder()
                    .setIssuerReference(PartyReference.builder()
                        .setExternalReference(issuerHref)
                        .build())
                    .setAssignedIdentifier(List.of(
                        com.fpml.cdm.fx.mapper.generated.AssignedIdentifier.builder()
                            .setIdentifier(Identifier.builder()
                                .setValue(pti.tradeId != null ? pti.tradeId : "")
                                .build())
                            .build()))
                    .build();

                identifiers.add(tid);
            }
        }

        return identifiers;
    }

    /**
     * Maps fxSingleLeg to TradeLot with PriceQuantity for both legs.
     */
    public static List<TradeLot> mapTradeLots(FpmlFxSingleLeg fx) {
        var lots = new ArrayList<TradeLot>();
        var pq = mapTradeLotPriceQuantity(fx);
        lots.add(TradeLot.builder()
            .setPriceQuantity(List.of(pq))
            .build());
        return lots;
    }

    /**
     * Builds PriceQuantity for trade lot from exchange rate and payment amounts.
     */
    public static PriceQuantity mapTradeLotPriceQuantity(FpmlFxSingleLeg fx) {
        var qcp = fx.exchangeRate != null ? fx.exchangeRate.quotedCurrencyPair : null;
        String currency1 = qcp != null ? qcp.currency1 : "USD";
        String currency2 = qcp != null ? qcp.currency2 : "EUR";
        BigDecimal rate = fx.exchangeRate != null ? fx.exchangeRate.rate : BigDecimal.ZERO;

        var price = PriceSchedule.builder()
            .setValue(Measure.builder()
                .setValue(rate)
                .setUnit(UnitType.builder().setCurrency(currency2).build())
                .setPerUnitOf(UnitType.builder().setCurrency(currency1).build())
                .setPriceType(PriceTypeEnum.EXCHANGE_RATE)
                .build())
            .build();

        var quantities = new ArrayList<NonNegativeQuantity>();

        if (fx.exchangedCurrency1 != null && fx.exchangedCurrency1.paymentAmount != null) {
            quantities.add(NonNegativeQuantity.builder()
                .setValue(fx.exchangedCurrency1.paymentAmount.amount)
                .setUnit(UnitType.builder()
                    .setCurrency(fx.exchangedCurrency1.paymentAmount.currency)
                    .build())
                .build());
        }

        if (fx.exchangedCurrency2 != null && fx.exchangedCurrency2.paymentAmount != null) {
            quantities.add(NonNegativeQuantity.builder()
                .setValue(fx.exchangedCurrency2.paymentAmount.amount)
                .setUnit(UnitType.builder()
                    .setCurrency(fx.exchangedCurrency2.paymentAmount.currency)
                    .build())
                .build());
        }

        return PriceQuantity.builder()
            .setPrice(List.of(price))
            .setQuantity(quantities)
            .setObservable(mapTradeLotObservable(fx))
            .build();
    }

    /**
     * Maps the primary currency to Observable for trade lot.
     */
    public static Observable mapTradeLotObservable(FpmlFxSingleLeg fx) {
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
}
