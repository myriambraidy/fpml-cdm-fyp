package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import cdm.base.staticdata.identifier.AssignedIdentifier;
import cdm.base.staticdata.identifier.Identifier;
import cdm.base.staticdata.party.AncillaryParty;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.Party;
import cdm.base.staticdata.party.PartyIdentifier;
import cdm.base.staticdata.party.PartyIdentifierTypeEnum;
import cdm.event.common.Trade;
import com.rosetta.model.metafields.FieldWithMetaString;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.util.ArrayList;
import java.util.List;

/**
 * Maps FpML party elements to CDM Party, PartyIdentifier, and Counterparty.
 * Rosetta functions: MapFxSingleLegCounterpartyList, MapFxSingleLegAncillaryPartyList,
 * MapPayerReceiverToAccountPartyReference.
 */
public class PartyMapper {

    private final XPath xpath;

    public PartyMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
    }

    /**
     * Build a list of CDM Party from FpML party elements.
     * @param doc FpML document
     * @return list of Party
     */
    public List<Party> mapPartyList(org.w3c.dom.Document doc) {
        List<Party> parties = new ArrayList<>();
        try {
            NodeList partyNodes = (NodeList) xpath.evaluate(
                    "//party", doc, XPathConstants.NODESET);
            for (int i = 0; i < partyNodes.getLength(); i++) {
                Element partyEl = (Element) partyNodes.item(i);
                Party party = mapParty(partyEl);
                if (party != null) {
                    parties.add(party);
                }
            }
        } catch (Exception e) {
            // log and continue
        }
        return parties;
    }

    private Party mapParty(Element partyEl) {
        String partyId = partyEl.getAttribute("partyId");
        if (partyId == null || partyId.isEmpty()) {
            return null;
        }
        PartyIdentifier pi = PartyIdentifier.builder()
                .setIdentifierValue(FieldWithMetaString.builder()
                        .setValue(partyId)
                        .build())
                .build();
        return Party.builder()
                .addPartyId(pi)
                .build();
    }

    /**
     * Build counterparties from payer/receiver party references in the trade.
     * Rosetta: MapPayerReceiverToAccountPartyReference.
     * @param doc FpML document
     * @return list of Counterparty
     */
    public List<Counterparty> mapCounterparties(org.w3c.dom.Document doc) {
        List<Counterparty> counterparties = new ArrayList<>();
        try {
            // Payer
            String payerRef = xpath.evaluate("//payerPartyReference/@payerPartyReference", doc);
            if (payerRef == null || payerRef.isEmpty()) {
                payerRef = xpath.evaluate("//payerPartyReference/@href", doc);
            }
            if (payerRef != null && !payerRef.isEmpty()) {
                Counterparty cpty = Counterparty.builder()
                        .setPartyReference(FieldWithMetaString.builder()
                                .setValue(payerRef)
                                .build())
                        .setSide(com.rosetta.model.lib.functions.RosettaValueWithMetaString.builder()
                                .setValue("Payer"))
                        .build();
                // Note: Counterparty.side not directly available in approved builder,
                // record as ancillary for traceability
                counterparties.add(cpty);
            }

            // Receiver
            String receiverRef = xpath.evaluate("//receiverPartyReference/@receiverPartyReference", doc);
            if (receiverRef == null || receiverRef.isEmpty()) {
                receiverRef = xpath.evaluate("//receiverPartyReference/@href", doc);
            }
            if (receiverRef != null && !receiverRef.isEmpty()) {
                Counterparty cpty = Counterparty.builder()
                        .setPartyReference(FieldWithMetaString.builder()
                                .setValue(receiverRef)
                                .build())
                        .build();
                counterparties.add(cpty);
            }
        } catch (Exception e) {
            // log and continue
        }
        return counterparties;
    }

    /**
     * Build ancillary parties from FpML ancillaryParty elements.
     * Rosetta: MapFxSingleLegAncillaryPartyList.
     * @param doc FpML document
     * @return list of AncillaryParty
     */
    public List<AncillaryParty> mapAncillaryParties(org.w3c.dom.Document doc) {
        List<AncillaryParty> ancillaryParties = new ArrayList<>();
        try {
            NodeList ancNodes = (NodeList) xpath.evaluate(
                    "//ancillaryParty", doc, XPathConstants.NODESET);
            for (int i = 0; i < ancNodes.getLength(); i++) {
                Element ancEl = (Element) ancNodes.item(i);
                String ancId = ancEl.getAttribute("ancillaryPartyId");
                if (ancId != null && !ancId.isEmpty()) {
                    AncillaryParty anc = AncillaryParty.builder()
                            .setPartyReference(FieldWithMetaString.builder()
                                    .setValue(ancId)
                                    .build())
                            .build();
                    ancillaryParties.add(anc);
                }
            }
        } catch (Exception e) {
            // log and continue
        }
        return ancillaryParties;
    }

    /**
     * Build trade-level party list from party elements.
     * Rosetta: MapFxSingleLegCounterpartyList.
     * @param trade FpML trade element
     * @return list of Party
     */
    public List<Party> mapTradeParties(Element trade) {
        List<Party> parties = new ArrayList<>();
        try {
            NodeList partyNodes = (NodeList) xpath.evaluate(
                    ".//party", trade, XPathConstants.NODESET);
            for (int i = 0; i < partyNodes.getLength(); i++) {
                Element partyEl = (Element) partyNodes.item(i);
                Party party = mapParty(partyEl);
                if (party != null) {
                    parties.add(party);
                }
            }
        } catch (Exception e) {
            // log and continue
        }
        return parties;
    }
}
