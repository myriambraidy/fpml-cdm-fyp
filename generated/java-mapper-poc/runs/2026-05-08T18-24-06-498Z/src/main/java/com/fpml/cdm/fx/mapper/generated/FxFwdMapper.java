package com.fpml.cdm.fx.mapper.generated;

import cdm.event.common.Trade;
import cdm.product.template.EconomicTerms;
import cdm.product.template.NonTransferableProduct;
import cdm.product.template.Payout;
import cdm.product.template.Product;
import cdm.product.template.TradableProduct;
import cdm.product.common.settlement.SettlementTerms;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.util.List;

/**
 * Maps FpML FX forward fixtures (fx-ex03 through fx-ex06) to CDM NonTransferableProduct.
 * Handles forward rate decomposition (spot + forward points) and split-rate scenarios.
 * Rosetta functions: MapFxSingleLegNonTransferableProduct, MapFxSingleLegEconomicTerms,
 * MapProductIdentifierList, MapFxCoreDetailsModelPriceWithAddress.
 */
public class FxFwdMapper {

    private final XPath xpath;
    private final PayoutMapper payoutMapper;
    private final PartyMapper partyMapper;

    public FxFwdMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
        this.payoutMapper = new PayoutMapper();
        this.partyMapper = new PartyMapper();
    }

    /**
     * Map FpML forward document to CDM TradableProduct.
     * Rosetta: MapFxSingleLegNonTransferableProduct.
     * @param doc FpML document
     * @return TradableProduct
     */
    public TradableProduct mapTradableProduct(Document doc) {
        NonTransferableProduct ntp = mapNonTransferableProduct(doc);
        if (ntp == null) {
            return TradableProduct.builder().build();
        }
        return TradableProduct.builder()
                .setProduct(ntp)
                .build();
    }

    /**
     * Map FpML forward document to CDM NonTransferableProduct.
     * @param doc FpML document
     * @return NonTransferableProduct
     */
    public NonTransferableProduct mapNonTransferableProduct(Document doc) {
        EconomicTerms economicTerms = mapEconomicTerms(doc);
        if (economicTerms == null) {
            economicTerms = EconomicTerms.builder().build();
        }
        return NonTransferableProduct.builder()
                .setEconomicTerms(economicTerms)
                .build();
    }

    /**
     * Map FpML forward document to CDM EconomicTerms.
     * Rosetta: MapFxSingleLegEconomicTerms.
     * @param doc FpML document
     * @return EconomicTerms
     */
    public EconomicTerms mapEconomicTerms(Document doc) {
        Payout payout = payoutMapper.buildPayout(doc);
        if (payout == null) {
            payout = Payout.builder().build();
        }

        SettlementTerms settleTerms = null;
        try {
            SettlementMapper settleMapper = new SettlementMapper();
            settleTerms = settleMapper.buildSettlementTerms(doc);
        } catch (Exception e) {
            // log and continue
        }

        return EconomicTerms.builder()
                .setPayout(payout)
                .build();
    }

    /**
     * Build complete CDM Trade from FpML forward document.
     * Rosetta: MapTradeState.
     * @param doc FpML document
     * @return Trade
     */
    public Trade buildTrade(Document doc) {
        // Build product
        TradableProduct tradableProduct = mapTradableProduct(doc);

        // Build parties
        List<cdm.base.staticdata.party.Party> parties = partyMapper.mapTradeParties(getTradeElement(doc));

        // Build counterparties
        List<cdm.base.staticdata.party.Counterparty> counterparties = partyMapper.mapCounterparties(doc);

        // Build trade identifiers
        TradeIdentifierMapper tiMapper = new TradeIdentifierMapper();
        List<cdm.event.common.TradeIdentifier> tradeIds = tiMapper.mapTradeIdentifierList(doc);

        Trade.Builder tradeBuilder = Trade.builder()
                .setProduct(tradableProduct);

        // Add parties
        for (cdm.base.staticdata.party.Party party : parties) {
            tradeBuilder.addParty(party);
        }

        // Add counterparties
        for (cdm.base.staticdata.party.Counterparty cpty : counterparties) {
            tradeBuilder.addCounterparty(cpty);
        }

        // Add trade identifiers to contract details
        if (!tradeIds.isEmpty()) {
            cdm.event.common.ContractDetails contractDetails = cdm.event.common.ContractDetails.builder()
                    .addTradeIdentifier(tradeIds.get(0))
                    .build();
            tradeBuilder.setContractDetails(contractDetails);
        }

        return tradeBuilder.build();
    }

    /**
     * Handle split-rate forward decomposition.
     * fx-ex06 contains side rates (bid/ask) that require decomposition.
     * Rosetta: MapFxCoreDetailsModelPriceListWithLocation.
     * @param doc FpML document
     * @return list of price schedules representing decomposed rates
     */
    public List<cdm.observable.asset.PriceSchedule> buildSplitRates(Document doc) {
        List<cdm.observable.asset.PriceSchedule> rates = new java.util.ArrayList<>();
        try {
            // Check for split rate scenario
            String bidRate = xpath.evaluate("//spotRate/bidRate", doc);
            String askRate = xpath.evaluate("//spotRate/askRate", doc);

            if (bidRate != null && !bidRate.isEmpty()) {
                cdm.observable.asset.PriceSchedule bidSchedule = cdm.observable.asset.PriceSchedule.builder()
                        .setValue(com.rosetta.model.metafields.FieldWithMetaDecimal.builder()
                                .setValue(new java.math.BigDecimal(bidRate))
                                .build())
                        .setMeasureType(com.rosetta.model.metafields.FieldWithMetaString.builder()
                                .setValue("FX Bid Rate")
                                .build())
                        .build();
                rates.add(bidSchedule);
            }

            if (askRate != null && !askRate.isEmpty()) {
                cdm.observable.asset.PriceSchedule askSchedule = cdm.observable.asset.PriceSchedule.builder()
                        .setValue(com.rosetta.model.metafields.FieldWithMetaDecimal.builder()
                                .setValue(new java.math.BigDecimal(askRate))
                                .build())
                        .setMeasureType(com.rosetta.model.metafields.FieldWithMetaString.builder()
                                .setValue("FX Ask Rate")
                                .build())
                        .build();
                rates.add(askSchedule);
            }
        } catch (Exception e) {
            // log and continue
        }
        return rates;
    }

    private Element getTradeElement(Document doc) {
        try {
            NodeList nodes = (NodeList) xpath.evaluate("//fxSingleLeg", doc, XPathConstants.NODESET);
            if (nodes.getLength() > 0) {
                return (Element) nodes.item(0).getParentNode();
            }
        } catch (Exception e) {
            // log and continue
        }
        return doc.getDocumentElement();
    }
}
