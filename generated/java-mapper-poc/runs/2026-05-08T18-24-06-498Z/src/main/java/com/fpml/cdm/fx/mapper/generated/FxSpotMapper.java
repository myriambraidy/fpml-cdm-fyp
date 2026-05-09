package com.fpml.cdm.fx.mapper.generated;

import cdm.event.common.Trade;
import cdm.product.template.EconomicTerms;
import cdm.product.template.NonTransferableProduct;
import cdm.product.template.Product;
import cdm.product.template.TradableProduct;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.util.List;

/**
 * Maps FpML FX spot fixtures (fx-ex01, fx-ex02) to CDM NonTransferableProduct.
 * Rosetta functions: MapFxSingleLegNonTransferableProduct, MapFxSingleLegEconomicTerms,
 * MapProductIdentifierList, MapProductTaxonomyList.
 */
public class FxSpotMapper {

    private final XPath xpath;
    private final PayoutMapper payoutMapper;
    private final PartyMapper partyMapper;

    public FxSpotMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
        this.payoutMapper = new PayoutMapper();
        this.partyMapper = new PartyMapper();
    }

    /**
     * Map FpML document to CDM TradableProduct with NonTransferableProduct.
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
     * Map FpML document to CDM NonTransferableProduct.
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
     * Map FpML document to CDM EconomicTerms.
     * Rosetta: MapFxSingleLegEconomicTerms.
     * @param doc FpML document
     * @return EconomicTerms
     */
    public EconomicTerms mapEconomicTerms(Document doc) {
        // Get payout
        cdm.product.template.Payout payout = payoutMapper.buildPayout(doc);
        if (payout == null) {
            payout = cdm.product.template.Payout.builder().build();
        }

        // Get settlement information
        SettlementMapper settleMapper = new SettlementMapper();
        cdm.product.common.settlement.SettlementTerms settleTerms = settleMapper.buildSettlementTerms(doc);

        return EconomicTerms.builder()
                .setPayout(payout)
                .build();
    }

    /**
     * Build complete CDM Trade from FpML document.
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
