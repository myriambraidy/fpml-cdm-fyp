package com.fpml.cdm.fx.mapper.generated;

import cdm.base.staticdata.identifier.AssignedIdentifier;
import cdm.base.staticdata.identifier.Identifier;
import cdm.base.staticdata.identifier.TradeIdentifierTypeEnum;
import cdm.event.common.TradeIdentifier;
import com.rosetta.model.metafields.FieldWithMetaString;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.util.ArrayList;
import java.util.List;

/**
 * Maps FpML tradeHeader/partyTradeIdentifier to CDM TradeIdentifier.
 * Rosetta function: MapTradeIdentifierList.
 */
public class TradeIdentifierMapper {

    private final XPath xpath;

    public TradeIdentifierMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
    }

    /**
     * Build a list of CDM TradeIdentifier from FpML tradeHeader/partyTradeIdentifier.
     * @param doc FpML document
     * @return list of TradeIdentifier
     */
    public List<TradeIdentifier> mapTradeIdentifierList(org.w3c.dom.Document doc) {
        List<TradeIdentifier> identifiers = new ArrayList<>();
        try {
            NodeList ptiNodes = (NodeList) xpath.evaluate(
                    "//tradeHeader/partyTradeIdentifier", doc, XPathConstants.NODESET);
            for (int i = 0; i < ptiNodes.getLength(); i++) {
                Element pti = (Element) ptiNodes.item(i);
                TradeIdentifier ti = mapPartyTradeIdentifier(pti);
                if (ti != null) {
                    identifiers.add(ti);
                }
            }
        } catch (Exception e) {
            // log and continue
        }
        return identifiers;
    }

    private TradeIdentifier mapPartyTradeIdentifier(Element pti) {
        // TradeId element
        String tradeId = null;
        NodeList tradeIdNodes = (NodeList) xpath.evaluate(
                "tradeId", pti, XPathConstants.NODESET);
        if (tradeIdNodes.getLength() > 0) {
            tradeId = tradeIdNodes.item(0).getTextContent();
        }

        // Optional versionedTradeId
        NodeList vtiNodes = (NodeList) xpath.evaluate(
                "versionedTradeId", pti, XPathConstants.NODESET);
        if (vtiNodes.getLength() > 0) {
            // Map versionedTradeId/tradeId as additional assigned identifier
            Element vti = (Element) vtiNodes.item(0);
            String vTradeId = xpath.evaluate("tradeId", vti);
            if (vTradeId != null && !vTradeId.isEmpty()) {
                AssignedIdentifier aid = AssignedIdentifier.builder()
                        .setIdentifierValue(FieldWithMetaString.builder()
                                .setValue(vTradeId)
                                .build())
                        .build();
                TradeIdentifier ti = TradeIdentifier.builder()
                        .setIdentifierType(TradeIdentifierTypeEnum.TRADE_ID)
                        .addAssignedIdentifier(aid)
                        .build();
                if (tradeId != null && !tradeId.isEmpty()) {
                    AssignedIdentifier primary = AssignedIdentifier.builder()
                            .setIdentifierValue(FieldWithMetaString.builder()
                                    .setValue(tradeId)
                                    .build())
                            .build();
                    ti = ti.toBuilder().addAssignedIdentifier(primary).build();
                }
                return ti;
            }
        }

        // Simple tradeId case
        if (tradeId != null && !tradeId.isEmpty()) {
            AssignedIdentifier aid = AssignedIdentifier.builder()
                    .setIdentifierValue(FieldWithMetaString.builder()
                            .setValue(tradeId)
                            .build())
                    .build();
            return TradeIdentifier.builder()
                    .setIdentifierType(TradeIdentifierTypeEnum.TRADE_ID)
                    .addAssignedIdentifier(aid)
                    .build();
        }

        return null;
    }
}
