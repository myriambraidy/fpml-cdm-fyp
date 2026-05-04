package com.fpml.cdm.fx.util;


import com.fpml.cdm.fx.model.CdmTrade;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;


import java.util.HashMap;
import java.util.Map;

/**
 * Utility for resolving party references from FpML documents.
 * Implements TR-001: Resolve party hrefs -> CDM party references and roles.
 */
public class PartyResolver {

    private Map<String, String> partyIdToGlobalKey = new HashMap<>();
    private Map<String, String> partyHrefToRole = new HashMap<>();
    private Map<String, Element> parties = new HashMap<>();

    /**
     * Resolves all party references from an FpML document.
     * @param doc Parsed FpML XML document
     */
    public void resolveParties(Document doc) {
        parties.clear();
        partyIdToGlobalKey.clear();
        partyHrefToRole.clear();

        // Extract parties
        NodeList partyNodes = doc.getElementsByTagName("party");
        for (int i = 0; i < partyNodes.getLength(); i++) {
            Element party = (Element) partyNodes.item(i);
            String partyId = getPartyId(party);
            if (partyId != null) {
                parties.put(partyId, party);
                // Generate deterministic-ish globalKey based on index
                String globalKey = "party-global-" + i + "-" + partyId.hashCode();
                partyIdToGlobalKey.put(partyId, globalKey);
            }
        }

        // Build party reference map (partyReference href -> external key like "party1", "party2")
        NodeList refNodes = doc.getElementsByTagName("partyReference");
        int refIndex = 0;
        for (int i = 0; i < refNodes.getLength(); i++) {
            Element ref = (Element) refNodes.item(i);
            String href = ref.getAttribute("href");
            if (href != null && !href.isEmpty()) {
                if (!partyHrefToRole.containsKey(href)) {
                    String role = "Party" + ((refIndex % 2 == 0) ? "1" : "2");
                    partyHrefToRole.put(href, role);
                    refIndex++;
                }
            }
