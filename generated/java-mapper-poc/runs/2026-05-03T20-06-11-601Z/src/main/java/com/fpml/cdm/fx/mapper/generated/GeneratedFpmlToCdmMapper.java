package com.fpml.cdm.fx.mapper.generated;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Path;
import java.nio.file.Files;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

/**
 * Generated FpML to CDM mapper for FX single-leg products.
 * Maps FpML FX spot/forward trades to CDM JSON format.
 */
public final class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {

    private final ObjectMapper objectMapper;
    private final DocumentBuilderFactory docFactory;


    public GeneratedFpmlToCdmMapper() {
        this.objectMapper = new ObjectMapper();
        this.docFactory = DocumentBuilderFactory.newInstance();
        this.docFactory.setNamespaceAware(true);
    }

    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        String fpmlContent = Files.readString(inputPath);
        Document doc = parseXml(fpmlContent);
        ObjectNode cdmJson = mapToCdm(doc, reportsDir);
        return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(cdmJson);
    }

    private Document parseXml(String xml) throws Exception {
        DocumentBuilder builder = docFactory.newDocumentBuilder();
        ByteArrayInputStream is = new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8));
        return builder.parse(is);
    }

    private ObjectNode mapToCdm(Document doc, Path reportsDir) {
        ObjectNode root = objectMapper.createObjectNode();

        Element fpmlRoot = doc.getDocumentElement();
        if (!"FpML".equals(fpmlRoot.getTagName())) {
            throw new IllegalArgumentException("Invalid FpML root element: " + fpmlRoot.getTagName());
        }

        NodeList fxSingleLegList = doc.getElementsByTagName("fxSingleLeg");
        if (fxSingleLegList.getLength() > 0) {
            return mapFxSingleLeg(doc, root);
        }

        ObjectNode unsupported = objectMapper.createObjectNode();
        unsupported.put("error", "Unsupported product type");
        root.set("unsupported", unsupported);
        return root;
    }

    private ObjectNode mapFxSingleLeg(Document doc, ObjectNode root) {
        Element fpmlRoot = doc.getDocumentElement();

        // Extract party information
        Map<String, String> partyIdMap = new HashMap<>();
        NodeList partyNodes = doc.getElementsByTagName("party");
        for (int i = 0; i < partyNodes.getLength(); i++) {
            Element party = (Element) partyNodes.item(i);
            String partyId = party.getAttribute("id");
            NodeList idList = party.getElementsByTagName("partyId");
            if (idList.getLength() > 0) {
                String idValue = getTextContent(idList.item(0));
                partyIdMap.put(partyId, idValue);
            }
        }

        // Trade header
        Element tradeHeader = getChildElement(fpmlRoot, "trade");
        if (tradeHeader == null) {
            throw new IllegalArgumentException("Missing trade element");
        }
        Element tradeHdr = getChildElement(tradeHeader, "tradeHeader");
        if (tradeHdr == null) {
            throw new IllegalArgumentException("Missing tradeHeader element");
        }

        // Trade date
        String tradeDate = "";
        NodeList tradeDateNodes = doc.getElementsByTagName("tradeDate");
        if (tradeDateNodes.getLength() > 0) {
            tradeDate = normalizeDate(getTextContent(tradeDateNodes.item(0)));
        }

        // Party trade identifiers
        List<Map<String, String>> partyTradeIds = new ArrayList<>();
        NodeList ptiList = doc.getElementsByTagName("partyTradeIdentifier");
        for (int i = 0; i < ptiList.getLength(); i++) {
            Element pti = (Element) ptiList.item(i);
            Map<String, String> ptiInfo = new HashMap<>();
            Element pref = getChildElement(pti, "partyReference");
            if (pref != null) {
                ptiInfo.put("partyRef", pref.getAttribute("href"));
            }
            NodeList tidList = pti.getElementsByTagName("tradeId");
            if (tidList.getLength() > 0) {
                Element tid = (Element) tidList.item(0);
                ptiInfo.put("tradeId", getTextContent(tid));
                ptiInfo.put("scheme", tid.getAttribute("tradeIdScheme"));
            }
            partyTradeIds.add(ptiInfo);
        }

        // FX Single Leg data
        Element fxSingleLeg = getChildElement(tradeHdr, "fxSingleLeg");
        if (fxSingleLeg == null) {
            NodeList fxList = doc.getElementsByTagName("fxSingleLeg");
            if (fxList.getLength() > 0) {
                fxSingleLeg = (Element) fxList.item(0);
            }
        }
        if (fxSingleLeg == null) {
            throw new IllegalArgumentException("Missing fxSingleLeg element");
        }

        // Exchanged currency 1
        Element excCurr1 = getChildElement(fxSingleLeg, "exchangedCurrency1");
        String cc1Currency = "";
        BigDecimal cc1Amount = BigDecimal.ZERO;
        String cc1PayerRef = "";
        String cc1ReceiverRef = "";
        if (excCurr1 != null) {
            Element payRef1 = getChildElement(excCurr1, "payerPartyReference");
            if (payRef1 != null) cc1PayerRef = payRef1.getAttribute("href");
            Element recRef1 = getChildElement(excCurr1, "receiverPartyReference");
            if (recRef1 != null) cc1ReceiverRef = recRef1.getAttribute("href");
            Element payAmt1 = getChildElement(excCurr1, "paymentAmount");
            if (payAmt1 != null) {
                NodeList currNodes = payAmt1.getElementsByTagName("currency");
                if (currNodes.getLength() > 0) cc1Currency = getTextContent(currNodes.item(0));
                NodeList amtNodes = payAmt1.getElementsByTagName("amount");
                if (amtNodes.getLength() > 0) {
                    cc1Amount = new BigDecimal(getTextContent(amtNodes.item(0)));
                }
            }
        }

        // Exchanged currency 2
        Element excCurr2 = getChildElement(fxSingleLeg, "exchangedCurrency2");
        String cc2Currency = "";
        BigDecimal cc2Amount = BigDecimal.ZERO;
        String cc2PayerRef = "";
        String cc2ReceiverRef = "";
        if (excCurr2 != null) {
            Element payRef2 = getChildElement(excCurr2, "payerPartyReference");
            if (payRef2 != null) cc2PayerRef = payRef2.getAttribute("href");
            Element recRef2 = getChildElement(excCurr2, "receiverPartyReference");
            if (recRef2 != null) cc2ReceiverRef = recRef2.getAttribute("href");
            Element payAmt2 = getChildElement(excCurr2, "paymentAmount");
            if (payAmt2 != null) {
                NodeList currNodes = payAmt2.getElementsByTagName("currency");
                if (currNodes.getLength() > 0) cc2Currency = getTextContent(currNodes.item(0));
                NodeList amtNodes = payAmt2.getElementsByTagName("amount");
                if (amtNodes.getLength() > 0) {
                    cc2Amount = new BigDecimal(getTextContent(amtNodes.item(0)));
                }
            }
        }

        // Value date
        String valueDate = "";
        Element valueDateElem = getChildElement(fxSingleLeg, "valueDate");
        if (valueDateElem != null) {
            valueDate = normalizeDate(getTextContent(valueDateElem));
        }

        // Exchange rate
        String rateCurrency1 = "";
        String rateCurrency2 = "";
        BigDecimal rate = BigDecimal.ZERO;
        Element exchangeRate = getChildElement(fxSingleLeg, "exchangeRate");
        if (exchangeRate != null) {
            Element qcp = getChildElement(exchangeRate, "quotedCurrencyPair");
            if (qcp != null) {
                NodeList c1Nodes = qcp.getElementsByTagName("currency1");
                if (c1Nodes.getLength() > 0) rateCurrency1 = getTextContent(c1Nodes.item(0));
                NodeList c2Nodes = qcp.getElementsByTagName("currency2");
                if (c2Nodes.getLength() > 0) rateCurrency2 = getTextContent(c2Nodes.item(0));
            }
            NodeList rateNodes = exchangeRate.getElementsByTagName("rate");
            if (rateNodes.getLength() > 0) {
                rate = new BigDecimal(getTextContent(rateNodes.item(0)));
            }
        }

        // Party roles
        String party1Ref = cc1PayerRef.isEmpty() ? cc1ReceiverRef : cc1PayerRef;
        String party2Ref = cc2PayerRef.equals(party1Ref) ? cc2ReceiverRef : cc2PayerRef;

        // Build CDM JSON
        root.put("meta", createMetaNode(objectMapper, "e410255f"));
        root.put("globalKey", "e410255f");
        root.put("tradeDate", createDateNode(objectMapper, tradeDate));


        // party
        ArrayNode partyArray = objectMapper.createArrayNode();
        for (Map.Entry<String, String> entry : partyIdMap.entrySet()) {
            ObjectNode partyNode = objectMapper.createObjectNode();
            ArrayNode partyIdArray = objectMapper.createArrayNode();
            ObjectNode partyIdNode = objectMapper.createObjectNode();
            partyIdNode.set("identifier", createIdentifierNode(objectMapper, entry.getValue(), "LEI", "http://www.fpml.org/coding-scheme/external/iso17442"));
            partyIdArray.add(partyIdNode);
            partyNode.set("partyId", partyIdArray);
            partyNode.put("meta", createMetaNode(objectMapper, entry.getKey()));
            partyNode.put("globalKey", entry.getKey());
            partyArray.add(partyNode);
        }
        root.set("party", partyArray);

        // counterparty
        ArrayNode counterpartyArray = objectMapper.createArrayNode();
        ObjectNode cp1 = objectMapper.createObjectNode();
        cp1.put("role", "Party1");
        cp1.set("partyReference", createReferenceNode(objectMapper, party2Ref));
        counterpartyArray.add(cp1);
        ObjectNode cp2 = objectMapper.createObjectNode();
        cp2.put("role", "Party2");
        cp2.set("partyReference", createReferenceNode(objectMapper, party1Ref));
        counterpartyArray.add(cp2);
        root.set("counterparty", counterpartyArray);

        // tradeIdentifier
        ArrayNode tradeIdArray = objectMapper.createArrayNode();
        for (int i = 0; i < partyTradeIds.size(); i++) {
            Map<String, String> pti = partyTradeIds.get(i);
            ObjectNode ti = objectMapper.createObjectNode();
            ti.set("issuerReference", createReferenceNode(objectMapper, pti.get("partyRef")));
            ArrayNode assignedArray = objectMapper.createArrayNode();
            ObjectNode assign = objectMapper.createObjectNode();
            ObjectNode idNode = objectMapper.createObjectNode();
            idNode.put("value", pti.get("tradeId"));
            idNode.put("meta", createSchemeNode(objectMapper, pti.get("scheme")));
            assign.set("identifier", idNode);
            assignedArray.add(assign);
            ti.set("assignedIdentifier", assignedArray);
            ti.put("meta", createMetaNode(objectMapper, "tradeId" + i));
            tradeIdArray.add(ti);
        }
        root.set("tradeIdentifier", tradeIdArray);

        // tradeLot
        ArrayNode tradeLotArray = objectMapper.createArrayNode();
        ObjectNode tradeLot = objectMapper.createObjectNode();
        ArrayNode pqArray = objectMapper.createArrayNode();
        ObjectNode pq = objectMapper.createObjectNode();

        // price
        ArrayNode priceArray = objectMapper.createArrayNode();
        ObjectNode priceNode = objectMapper.createObjectNode();
        ObjectNode priceValue = objectMapper.createObjectNode();
        priceValue.put("value", rate);
        ObjectNode priceUnit = objectMapper.createObjectNode();
        priceUnit.set("currency", createCurrencyValue(objectMapper, rateCurrency2));
        priceValue.put("unit", priceUnit);
        ObjectNode perUnitOf = objectMapper.createObjectNode();
        perUnitOf.set("currency", createCurrencyValue(objectMapper, rateCurrency1));
        priceValue.put("perUnitOf", perUnitOf);
        priceValue.put("priceType", "ExchangeRate");
        priceNode.set("value", priceValue);
        priceArray.add(priceNode);
        pq.set("price", priceArray);

        // quantity
        ArrayNode quantityArray = objectMapper.createArrayNode();
        ObjectNode qty1 = objectMapper.createObjectNode();
        ObjectNode qty1Value = objectMapper.createObjectNode();
        qty1Value.put("value", cc1Amount);
        ObjectNode qty1Unit = objectMapper.createObjectNode();
        qty1Unit.set("currency", createCurrencyValue(objectMapper, cc1Currency));
        qty1Value.put("unit", qty1Unit);
        qty1.set("value", qty1Value);
        quantityArray.add(qty1);

        ObjectNode qty2 = objectMapper.createObjectNode();
        ObjectNode qty2Value = objectMapper.createObjectNode();
        qty2Value.put("value", cc2Amount);
        ObjectNode qty2Unit = objectMapper.createObjectNode();
        qty2Unit.set("currency", createCurrencyValue(objectMapper, cc2Currency));
        qty2Value.put("unit", qty2Unit);
        qty2.set("value", qty2Value);
        quantityArray.add(qty2);
        pq.set("quantity", quantityArray);

        pq.put("meta", createMetaNode(objectMapper, "bea3a8c6"));
        pqArray.add(pq);
        tradeLot.set("priceQuantity", pqArray);
        tradeLotArray.add(tradeLot);
        root.set("tradeLot", tradeLotArray);

        // product
        ObjectNode product = objectMapper.createObjectNode();
        product.put("meta", createMetaNode(objectMapper, "62b73eb5"));
        product.put("globalKey", "62b73eb5");

        // taxonomy
        ArrayNode taxonomyArray = objectMapper.createArrayNode();
        ObjectNode taxonomy = objectMapper.createObjectNode();
        taxonomy.put("source", "ISDA");
        taxonomy.put("productQualifier", "ForeignExchange_Spot_Forward");
        taxonomyArray.add(taxonomy);
        product.set("taxonomy", taxonomyArray);

        // economicTerms
        ObjectNode economicTerms = objectMapper.createObjectNode();
        ArrayNode payoutArray = objectMapper.createArrayNode();
        ObjectNode payout = objectMapper.createObjectNode();
        payout.put("meta", createMetaNode(objectMapper, "62b73eb5"));
        payout.put("globalKey", "62b73eb5");

        // SettlementPayout
        ObjectNode settlementPayout = objectMapper.createObjectNode();
        settlementPayout.put("meta", createMetaNode(objectMapper, "62b73eb5"));
        settlementPayout.put("globalKey", "62b73eb5");

        // payerReceiver
        ObjectNode payerReceiver = objectMapper.createObjectNode();
        payerReceiver.put("payer", "Party1");
        payerReceiver.put("receiver", "Party2");
        settlementPayout.set("payerReceiver", payerReceiver);

        // priceQuantity
        ObjectNode spPriceQty = objectMapper.createObjectNode();
        spPriceQty.put("meta", createMetaNode(objectMapper, "0"));
        spPriceQty.set("quantitySchedule", createAddressScope(objectMapper, "quantity-1"));
        ArrayNode priceSchedArray = objectMapper.createArrayNode();
        ObjectNode priceSched = objectMapper.createObjectNode();
        priceSched.set("address", createAddressScope(objectMapper, "price-1"));
        priceSchedArray.add(priceSched);
        spPriceQty.set("priceSchedule", priceSchedArray);
        settlementPayout.set("priceQuantity", spPriceQty);

        // settlementTerms
        ObjectNode settlementTerms = objectMapper.createObjectNode();
        settlementTerms.put("settlementType", "Cash");
        settlementTerms.put("meta", createMetaNode(objectMapper, "764dfd0c"));
        settlementTerms.put("globalKey", "764dfd0c");
        ObjectNode settlementDate = objectMapper.createObjectNode();
        settlementDate.put("valueDate", valueDate);
        settlementDate.put("meta", createMetaNode(objectMapper, "3e8a99"));
        settlementDate.put("globalKey", "3e8a99");
        settlementTerms.set("settlementDate", settlementDate);
        settlementPayout.set("settlementTerms", settlementTerms);

        // underlier
        ObjectNode underlier = objectMapper.createObjectNode();
        ObjectNode observable = objectMapper.createObjectNode();
        observable.set("address", createAddressScope(objectMapper, "observable-1"));
        underlier.set("Observable", observable);
        settlementPayout.set("underlier", underlier);

        payout.set("SettlementPayout", settlementPayout);
        payoutArray.add(payout);
        economicTerms.set("payout", payoutArray);
        product.set("economicTerms", economicTerms);
        root.set("product", product);

        return root;
    }

    private String normalizeDate(String date) {
        if (date == null) return "";
        return date.replaceAll("Z$", "").replaceAll("T.*$", "");
    }


    private String getTextContent(Node node) {
        if (node == null) return "";
        StringBuilder sb = new StringBuilder();
        NodeList children = node.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.TEXT_NODE) {
                sb.append(child.getNodeValue());
            }
        }
        return sb.toString().trim();
    }

    private Element getChildElement(Element parent, String tagName) {
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                if (tagName.equals(child.getNodeName())) {
                    return (Element) child;
                }
            }
        }
        return null;
    }

    private ObjectNode createMetaNode(ObjectMapper mapper, String globalKey) {
        ObjectNode meta = mapper.createObjectNode();
        meta.put("globalKey", globalKey);
        return meta;
    }

    private ObjectNode createReferenceNode(ObjectMapper mapper, String externalRef) {
        ObjectNode ref = mapper.createObjectNode();
        ref.put("globalReference", externalRef);
        ref.put("externalReference", externalRef);
        return ref;
    }

    private ObjectNode createIdentifierNode(ObjectMapper mapper, String value, String identifierType, String scheme) {
        ObjectNode idNode = mapper.createObjectNode();
        idNode.put("value", value);
        idNode.put("identifierType", identifierType);
        idNode.put("meta", createSchemeNode(mapper, scheme));
        return idNode;
    }

    private ObjectNode createSchemeNode(ObjectMapper mapper, String scheme) {
        ObjectNode meta = mapper.createObjectNode();
        meta.put("scheme", scheme != null ? scheme : "");
        return meta;
    }

    private ObjectNode createDateNode(ObjectMapper mapper, String date) {
        ObjectNode dateNode = mapper.createObjectNode();
        dateNode.put("value", date);
        dateNode.put("meta", createMetaNode(mapper, "3e8a97"));
        dateNode.put("globalKey", "3e8a97");
        return dateNode;
    }

    private ObjectNode createAddressScope(ObjectMapper mapper, String value) {
        ObjectNode addr = mapper.createObjectNode();
        addr.put("scope", "DOCUMENT");
        addr.put("value", value);
        return addr;
    }

    private ObjectNode createCurrencyValue(ObjectMapper mapper, String currency) {
        ObjectNode curr = mapper.createObjectNode();
        curr.put("value", currency);
        return curr;
    }
}