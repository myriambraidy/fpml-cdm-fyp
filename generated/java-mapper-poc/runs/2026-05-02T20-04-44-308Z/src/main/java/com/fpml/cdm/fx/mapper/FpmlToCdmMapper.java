package com.fpml.cdm.fx.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

/**
 * Main entry point for mapping FpML FX trades to CDM format.
 * This mapper handles FX single-leg products (spot, forward, NDF).
 * The runtime does NOT call any LLM and does NOT read the agent workspace.
 */
public class FpmlToCdmMapper {

    public static final String FPML_ROOT = “FpML”;
    public static final String FPML_PARTY = “party”;
    public static final String FPML_PARTY_ID = “partyId”;
    public static final String FPML_ID_ATTR = “id”;
    public static final String FPML_TRADE = “trade”;
    public static final String FPML_TRADE_HEADER = “tradeHeader”;
    public static final String FPML_FX_SINGLE_LEG = “fxSingleLeg”;
    public static final String FPML_FX_SWAP = “fxSwap”;
    public static final String FPML_FX_OPTION = “fxSimpleOption”;
    public static final String FPML_FX_DIGITAL_OPTION = “fxDigitalOption”;
    public static final String FPML_EXCHANGED_CURRENCY_1 = “exchangedCurrency1”;
    public static final String FPML_EXCHANGED_CURRENCY_2 = “exchangedCurrency2”;
    public static final String FPML_PAYER_PARTY_REFERENCE = “payerPartyReference”;
    public static final String FPML_RECEIVER_PARTY_REFERENCE = “receiverPartyReference”;
    public static final String FPML_PAYMENT_AMOUNT = “paymentAmount”;
    public static final String FPML_VALUE_DATE = “valueDate”;
    public static final String FPML_EXCHANGE_RATE = “exchangeRate”;
    public static final String FPML_QUOTED_CURRENCY_PAIR = “quotedCurrencyPair”;
    public static final String FPML_CURRENCY_1 = “currency1”;
    public static final String FPML_CURRENCY_2 = “currency2”;
    public static final String FPML_RATE = “rate”;
    public static final String FPML_SPOT_RATE = “spotRate”;
    public static final String FPML_FORWARD_POINTS = “forwardPoints”;
    public static final String FPML_NON_DELIVERABLE_FORWARD = “nonDeliverableForward”;
    public static final String FPML_SETTLEMENT_CURRENCY = “settlementCurrency”;
    public static final String FPML_PARTY_TRADE_IDENTIFIER = “partyTradeIdentifier”;
    public static final String FPML_TRADE_ID = “tradeId”;
    public static final String FPML_TRADE_DATE = “tradeDate”;

    public static final String TAXONOMY_SOURCE_OTHER = “Other”;
    public static final String TAXONOMY_SOURCE_ISDA = “ISDA”;
    public static final String TAXONOMY_NAME_FX_SPOT = “FxSpot”;
    public static final String TAXONOMY_QUALIFIER_FX_SPOT_FORWARD = “ForeignExchange_Spot_Forward”;
    public static final String TAXONOMY_QUALIFIER_FX_SWAP = “ForeignExchange_Swap”;
    public static final String TAXONOMY_QUALIFIER_FX_VANILLA_OPTION = “ForeignExchange_VanillaOption”;

    public static final String ADDRESS_SCOPE_DOCUMENT = “DOCUMENT”;
    public static final String ADDRESS_QUANTITY_1 = “quantity-1”;
    public static final String ADDRESS_QUANTITY_2 = “quantity-2”;
    public static final String ADDRESS_PRICE_1 = “price-1”;
    public static final String ADDRESS_PRICE_2 = “price-2”;
    public static final String ADDRESS_OBSERVABLE_1 = “observable-1”;
    public static final String ADDRESS_OBSERVABLE_2 = “observable-2”;

    public static final String JSON_PATH_META = “meta”;
    public static final String JSON_PATH_META_GLOBAL_KEY = “globalKey”;
    public static final String JSON_PATH_TRADE = “trade”;
    public static final String JSON_PATH_PRODUCT = “product”;
    public static final String JSON_PATH_TAXONOMY = “taxonomy”;
    public static final String JSON_PATH_SOURCE = “source”;
    public static final String JSON_PATH_VALUE_NAME = “value”;
    public static final String JSON_PATH_VALUE_NAME_VALUE = “name”;
    public static final String JSON_PATH_PRODUCT_QUALIFIER = “productQualifier”;
    public static final String JSON_PATH_ECONOMIC_TERMS = “economicTerms”;
    public static final String JSON_PATH_PAYOUT = “payout”;
    public static final String JSON_PATH_PAYER_RECEIVER = “payerReceiver”;
    public static final String JSON_PATH_PAYER = “payer”;
    public static final String JSON_PATH_RECEIVER = “receiver”;
    public static final String JSON_PATH_PRICE_QUANTITY = “priceQuantity”;
    public static final String JSON_PATH_QUANTITY_SCHEDULE = “quantitySchedule”;
    public static final String JSON_PATH_PRICE_SCHEDULE = “priceSchedule”;
    public static final String JSON_PATH_ADDRESS_SCOPE = “address”;
    public static final String JSON_PATH_ADDRESS_VALUE = “scope”;
    public static final String JSON_PATH_SETTLEMENT_TERMS = “settlementTerms”;
    public static final String JSON_PATH_SETTLEMENT_TYPE = “settlementType”;
    public static final String JSON_PATH_SETTLEMENT_DATE = “settlementDate”;
    public static final String JSON_PATH_VALUE = “value”;
    public static final String JSON_PATH_UNDERLIER = “underlier”;
    public static final String JSON_PATH_OBSERVABLE = “Observable”;
    public static final String JSON_PATH_TRADE_LOT = “tradeLot”;
    public static final String JSON_PATH_COUNTERPARTY = “counterparty”;
    public static final String JSON_PATH_ROLE = “role”;
    public static final String JSON_PATH_PARTY_REFERENCE = “partyReference”;
    public static final String JSON_PATH_EXTERNAL_REFERENCE = “externalReference”;
    public static final String JSON_PATH_GLOBAL_REFERENCE = “globalReference”;
    public static final String JSON_PATH_TRADE_IDENTIFIER = “tradeIdentifier”;
    public static final String JSON_PATH_ISSUER_REFERENCE = “issuerReference”;
    public static final String JSON_PATH_ASSIGNED_IDENTIFIER = “assignedIdentifier”;
    public static final String JSON_PATH_IDENTIFIER = “identifier”;
    public static final String JSON_PATH_TRADE_DATE = “tradeDate”;
    public static final String JSON_PATH_PARTY = “party”;
    public static final String JSON_PATH_PARTY_ID = “partyId”;
    public static final String JSON_PATH_NAME = “name”;
    public static final String JSON_PATH_IDENTIFIER_TYPE = “identifierType”;
    public static final String JSON_PATH_QUANTITY = “quantity”;
    public static final String JSON_PATH_PRICE = “price”;
    public static final String JSON_PATH_UNIT = “unit”;
    public static final String JSON_PATH_CURRENCY = “currency”;

    public static final String SETTLEMENT_TYPE_CASH = “Cash”;
    public static final String PRICE_TYPE_EXCHANGE_RATE = “ExchangeRate”;

    public static final String PRODUCT_GROUP_FX_SWAP = “fx-swap”;
    public static final String PRODUCT_GROUP_FX_OPTION = “fx-simple-option”;

    private final ObjectMapper objectMapper;
    private final Map<String, String> partyRefToId = new HashMap<>();
    private final Map<String, String> partyRefToGlobalKey = new HashMap<>();

    public FpmlToCdmMapper() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    public String mapFpmlToCdm(String fpmlFilePath) throws Exception {
        File fpmlFile = new File(fpmlFilePath);
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(fpmlFile);
        document.getDocumentElement().normalize();

        Element root = document.getDocumentElement();
        String rootTag = root.getTagName();

        if (!rootTag.equalsIgnoreCase(FPML_ROOT)) {
            throw new RuntimeException(“Unsupported root element: “ + rootTag + “. Expected FpML.”);
        }

        // Parse parties
        NodeList partyNodes = document.getElementsByTagName(FPML_PARTY);
        this.partyRefToId.clear();
        this.partyRefToGlobalKey.clear();

        for (int i = 0; i < partyNodes.getLength(); i++) {
            Element partyElement = (Element) partyNodes.item(i);
            String partyRef = partyElement.getAttribute(FPML_ID_ATTR);
            if (partyRef.isEmpty()) continue;

            NodeList partyIdNodes = partyElement.getElementsByTagName(FPML_PARTY_ID);
            String partyId = partyIdNodes.getLength() > 0 ? partyIdNodes.item(0).getTextContent() : “UNKNOWN”;

            this.partyRefToId.put(partyRef, partyId);
            this.partyRefToGlobalKey.put(partyRef, generateGlobalKey());
        }

        // Find trade element
        NodeList tradeNodes = document.getElementsByTagName(FPML_TRADE);
        if (tradeNodes.getLength() == 0) {
            throw new RuntimeException(“No trade element found in FpML document.”);
        }

        Element tradeElement = (Element) tradeNodes.item(0);

        // Detect product type
        NodeList fxSingleLegNodes = document.getElementsByTagName(FPML_FX_SINGLE_LEG);
        NodeList fxSwapNodes = document.getElementsByTagName(FPML_FX_SWAP);
        NodeList fxOptionNodes = document.getElementsByTagName(FPML_FX_OPTION);
        NodeList fxDigitalOptionNodes = document.getElementsByTagName(FPML_FX_DIGITAL_OPTION);

        if (fxSingleLegNodes.getLength() > 0) {
            return mapFxSingleLeg(tradeElement, document);
        } else if (fxSwapNodes.getLength() > 0) {
            throw new RuntimeException(“FX Swap is not in scope for this implementation group.”);
        } else if (fxOptionNodes.getLength() > 0 || fxDigitalOptionNodes.getLength() > 0) {
            throw new RuntimeException(“FX Options are not in scope for this implementation group.”);
        } else {
            throw new RuntimeException(“Unknown or unsupported FX product type.”);
        }
    }

    private String mapFxSingleLeg(Element tradeElement, Document document) throws Exception {
        ObjectNode rootNode = objectMapper.createObjectNode();

        // Root meta
        ObjectNode rootMeta = objectMapper.createObjectNode();
        rootMeta.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());
        rootNode.set(JSON_PATH_META, rootMeta);

        // Trade node
        ObjectNode tradeNode = objectMapper.createObjectNode();
        String tradeGlobalKey = generateGlobalKey();
        tradeNode.put(JSON_PATH_META_GLOBAL_KEY, tradeGlobalKey);

        // Product
        ObjectNode productNode = objectMapper.createObjectNode();
        String productGlobalKey = generateGlobalKey();
        productNode.put(JSON_PATH_META_GLOBAL_KEY, productGlobalKey);

        // Taxonomy
        ArrayNode taxonomyArray = objectMapper.createArrayNode();
        ObjectNode taxonomy1 = objectMapper.createObjectNode();
        taxonomy1.put(JSON_PATH_SOURCE, TAXONOMY_SOURCE_OTHER);
        ObjectNode taxonomyName = objectMapper.createObjectNode();
        taxonomyName.put(JSON_PATH_VALUE_NAME_VALUE, TAXONOMY_NAME_FX_SPOT);
        taxonomy1.set(JSON_PATH_VALUE_NAME, taxonomyName);
        taxonomyArray.add(taxonomy1);

        ObjectNode taxonomy2 = objectMapper.createObjectNode();
        taxonomy2.put(JSON_PATH_SOURCE, TAXONOMY_SOURCE_ISDA);
        taxonomy2.put(JSON_PATH_PRODUCT_QUALIFIER, TAXONOMY_QUALIFIER_FX_SPOT_FORWARD);
        taxonomyArray.add(taxonomy2);
        productNode.set(JSON_PATH_TAXONOMY, taxonomyArray);

        // Economic terms
        ObjectNode economicTerms = objectMapper.createObjectNode();
        economicTerms.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());

        // Payouts
        ArrayNode payoutArray = objectMapper.createArrayNode();
        ObjectNode payoutNode = mapSettlementPayout(tradeElement, document);
        payoutArray.add(payoutNode);
        economicTerms.set(JSON_PATH_PAYOUT, payoutArray);

        productNode.set(JSON_PATH_ECONOMIC_TERMS, economicTerms);
        tradeNode.set(JSON_PATH_PRODUCT, productNode);

        // Trade lot
        ArrayNode tradeLotArray = objectMapper.createArrayNode();
        ObjectNode tradeLotNode = mapTradeLot(tradeElement, document);
        tradeLotArray.add(tradeLotNode);
        tradeNode.set(JSON_PATH_TRADE_LOT, tradeLotArray);

        // Counterparty
        ArrayNode counterpartyArray = objectMapper.createArrayNode();
        mapCounterparties(tradeElement, document, counterpartyArray);
        tradeNode.set(JSON_PATH_COUNTERPARTY, counterpartyArray);

        // Trade identifier
        ArrayNode tradeIdArray = objectMapper.createArrayNode();
        mapTradeIdentifiers(tradeElement, document, tradeIdArray);
        tradeNode.set(JSON_PATH_TRADE_IDENTIFIER, tradeIdArray);

        // Trade date
        ObjectNode tradeDateNode = objectMapper.createObjectNode();
        String tradeDate = getTradeDate(tradeElement, document);
        tradeDateNode.put(JSON_PATH_VALUE, normalizeTradeDate(tradeDate));
        tradeDateNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());
        tradeNode.set(JSON_PATH_TRADE_DATE, tradeDateNode);

        // Party
        ArrayNode partyArray = objectMapper.createArrayNode();
        mapParties(document, partyArray);
        tradeNode.set(JSON_PATH_PARTY, partyArray);

        rootNode.set(JSON_PATH_TRADE, tradeNode);

        return objectMapper.writeValueAsString(rootNode);
    }

    private ObjectNode mapSettlementPayout(Element tradeElement, Document document) throws Exception {
        ObjectNode payoutNode = objectMapper.createObjectNode();
        payoutNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());

        NodeList exchangedCurrency1Nodes = document.getElementsByTagName(FPML_EXCHANGED_CURRENCY_1);
        if (exchangedCurrency1Nodes.getLength() == 0) {
            throw new RuntimeException(“Missing exchangedCurrency1 element.”);
        }

        Element exchangedCurrency1 = (Element) exchangedCurrency1Nodes.item(0);

        ObjectNode payerReceiverNode = objectMapper.createObjectNode();
        String payerPartyRef = getChildTextContent(exchangedCurrency1, FPML_PAYER_PARTY_REFERENCE);
        String receiverPartyRef = getChildTextContent(exchangedCurrency1, FPML_RECEIVER_PARTY_REFERENCE);

        String payerRole = derivePartyRole(payerPartyRef);
        String receiverRole = derivePartyRole(receiverPartyRef);

        payerReceiverNode.put(JSON_PATH_PAYER, payerRole);
        payerReceiverNode.put(JSON_PATH_RECEIVER, receiverRole);
        payoutNode.set(JSON_PATH_PAYER_RECEIVER, payerReceiverNode);

        // Price quantity
        ObjectNode priceQuantityNode = objectMapper.createObjectNode();
        priceQuantityNode.put(JSON_PATH_META_GLOBAL_KEY, “0”);

        ObjectNode quantitySchedule = objectMapper.createObjectNode();
        quantitySchedule.put(JSON_PATH_ADDRESS_SCOPE, ADDRESS_SCOPE_DOCUMENT);
        quantitySchedule.put(JSON_PATH_ADDRESS_VALUE, ADDRESS_QUANTITY_1);
        priceQuantityNode.set(JSON_PATH_QUANTITY_SCHEDULE, quantitySchedule);

        ArrayNode priceScheduleArray = objectMapper.createArrayNode();
        ObjectNode priceSchedule = objectMapper.createObjectNode();
        priceSchedule.put(JSON_PATH_ADDRESS_SCOPE, ADDRESS_SCOPE_DOCUMENT);
        priceSchedule.put(JSON_PATH_ADDRESS_VALUE, ADDRESS_PRICE_1);
        priceScheduleArray.add(priceSchedule);
        priceQuantityNode.set(JSON_PATH_PRICE_SCHEDULE, priceScheduleArray);

        payoutNode.set(JSON_PATH_PRICE_QUANTITY, priceQuantityNode);

        // Settlement terms
        ObjectNode settlementTerms = objectMapper.createObjectNode();
        settlementTerms.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());
        settlementTerms.put(JSON_PATH_SETTLEMENT_TYPE, SETTLEMENT_TYPE_CASH);

        // Check for NDF
        NodeList ndfNodes = document.getElementsByTagName(FPML_NON_DELIVERABLE_FORWARD);
        if (ndfNodes.getLength() > 0) {
            Element ndfElement = (Element) ndfNodes.item(0);
            String settlementCurrency = getChildTextContent(ndfElement, FPML_SETTLEMENT_CURRENCY);
            if (!settlementCurrency.isEmpty()) {
                ObjectNode settlementCurrencyNode = objectMapper.createObjectNode();
                settlementCurrencyNode.put(JSON_PATH_VALUE, settlementCurrency);
                settlementTerms.set(“settlementCurrency”, settlementCurrencyNode);
            }
        }

        ObjectNode settlementDateNode = objectMapper.createObjectNode();
        String valueDate = getFxValueDate(document);
        settlementDateNode.put(JSON_PATH_VALUE, normalizeTradeDate(valueDate));
        settlementDateNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());
        settlementTerms.set(JSON_PATH_SETTLEMENT_DATE, settlementDateNode);

        payoutNode.set(JSON_PATH_SETTLEMENT_TERMS, settlementTerms);

        // Underlier
        ObjectNode underlierNode = objectMapper.createObjectNode();
        ObjectNode observableNode = objectMapper.createObjectNode();
        observableNode.put(JSON_PATH_ADDRESS_SCOPE, ADDRESS_SCOPE_DOCUMENT);
        observableNode.put(JSON_PATH_ADDRESS_VALUE, ADDRESS_OBSERVABLE_1);
        underlierNode.set(JSON_PATH_OBSERVABLE, observableNode);
        payoutNode.set(JSON_PATH_UNDERLIER, underlierNode);

        return payoutNode;
    }

    private ObjectNode mapTradeLot(Element tradeElement, Document document) throws Exception {
        ObjectNode tradeLotNode = objectMapper.createObjectNode();
        tradeLotNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());

        ArrayNode priceQuantityArray = objectMapper.createArrayNode();
        ObjectNode priceQuantityNode = objectMapper.createObjectNode();

        // Get exchange rate info
        NodeList exchangeRateNodes = document.getElementsByTagName(FPML_EXCHANGE_RATE);
        String rateValue = “0”;
        String currency1 = “USD”;
        String currency2 = “USD”;
        String perUnitOfCurrency = “USD”;

        if (exchangeRateNodes.getLength() > 0) {
            Element exchangeRate = (Element) exchangeRateNodes.item(0);
            rateValue = getChildTextContent(exchangeRate, FPML_RATE);
            if (rateValue.isEmpty()) {
                rateValue = getChildTextContent(exchangeRate, FPML_SPOT_RATE);
            }

            NodeList currencyPairNodes = exchangeRate.getElementsByTagName(FPML_QUOTED_CURRENCY_PAIR);
            if (currencyPairNodes.getLength() > 0) {
                Element currencyPair = (Element) currencyPairNodes.item(0);
                currency1 = getChildTextContent(currencyPair, FPML_CURRENCY_1);
                currency2 = getChildTextContent(currencyPair, FPML_CURRENCY_2);
                perUnitOfCurrency = currency1;
            }
        }

        // Price
        ArrayNode priceArray = objectMapper.createArrayNode();
        ObjectNode priceNode = objectMapper.createObjectNode();
        priceNode.put(JSON_PATH_VALUE, new BigDecimal(rateValue));
        ObjectNode priceUnitNode = objectMapper.createObjectNode();
        priceUnitNode.put(JSON_PATH_VALUE, currency2);
        priceNode.set(JSON_PATH_UNIT, priceUnitNode);
        ObjectNode perUnitOfNode = objectMapper.createObjectNode();
        perUnitOfNode.put(JSON_PATH_VALUE, perUnitOfCurrency);
        priceNode.set(“perUnitOf”, perUnitOfNode);
        priceNode.put(“priceType”, PRICE_TYPE_EXCHANGE_RATE);

        ArrayNode priceLocationArray = objectMapper.createArrayNode();
        ObjectNode priceLocationNode = objectMapper.createObjectNode();
        priceLocationNode.put(JSON_PATH_ADDRESS_SCOPE, ADDRESS_SCOPE_DOCUMENT);
        priceLocationNode.put(JSON_PATH_ADDRESS_VALUE, ADDRESS_PRICE_1);
        priceLocationArray.add(priceLocationNode);
        priceNode.set(“meta”, objectMapper.createObjectNode().set(“location”, priceLocationArray));

        priceArray.add(priceNode);
        priceQuantityNode.set(JSON_PATH_PRICE, priceArray);

        // Quantities
        ArrayNode quantityArray = objectMapper.createArrayNode();
        NodeList exchangedCurrency1Nodes = document.getElementsByTagName(FPML_EXCHANGED_CURRENCY_1);
        NodeList exchangedCurrency2Nodes = document.getElementsByTagName(FPML_EXCHANGED_CURRENCY_2);

        if (exchangedCurrency1Nodes.getLength() > 0) {
            Element ex1 = (Element) exchangedCurrency1Nodes.item(0);
            String amount1 = getPaymentAmount(ex1);
            String curr1 = getPaymentCurrency(ex1);

            ObjectNode q1Node = objectMapper.createObjectNode();
            q1Node.put(JSON_PATH_VALUE, new BigDecimal(amount1));
            ObjectNode q1UnitNode = objectMapper.createObjectNode();
            q1UnitNode.put(JSON_PATH_VALUE, curr1);
            q1Node.set(JSON_PATH_UNIT, q1UnitNode);

            ArrayNode q1LocationArray = objectMapper.createArrayNode();
            ObjectNode q1LocationNode = objectMapper.createObjectNode();
            q1LocationNode.put(JSON_PATH_ADDRESS_SCOPE, ADDRESS_SCOPE_DOCUMENT);
            q1LocationNode.put(JSON_PATH_ADDRESS_VALUE, ADDRESS_QUANTITY_1);
            q1LocationArray.add(q1LocationNode);
            q1Node.set(“meta”, objectMapper.createObjectNode().set(“location”, q1LocationArray));

            quantityArray.add(q1Node);
        }

        if (exchangedCurrency2Nodes.getLength() > 0) {
            Element ex2 = (Element) exchangedCurrency2Nodes.item(0);
            String amount2 = getPaymentAmount(ex2);
            String curr2 = getPaymentCurrency(ex2);

            ObjectNode q2Node = objectMapper.createObjectNode();
            q2Node.put(JSON_PATH_VALUE, new BigDecimal(amount2));
            ObjectNode q2UnitNode = objectMapper.createObjectNode();
            q2UnitNode.put(JSON_PATH_VALUE, curr2);
            q2Node.set(JSON_PATH_UNIT, q2UnitNode);

            ArrayNode q2LocationArray = objectMapper.createArrayNode();
            ObjectNode q2LocationNode = objectMapper.createObjectNode();
            q2LocationNode.put(JSON_PATH_ADDRESS_SCOPE, ADDRESS_SCOPE_DOCUMENT);
            q2LocationNode.put(JSON_PATH_ADDRESS_VALUE, ADDRESS_QUANTITY_2);
            q2LocationArray.add(q2LocationNode);
            q2Node.set(“meta”, objectMapper.createObjectNode().set(“location”, q2LocationArray));

            quantityArray.add(q2Node);
        }

        priceQuantityNode.set(JSON_PATH_QUANTITY, quantityArray);

        // Observable
        ObjectNode observableNode = objectMapper.createObjectNode();
        ObjectNode assetNode = objectMapper.createObjectNode();
        ObjectNode cashNode = objectMapper.createObjectNode();
        ArrayNode identifierArray = objectMapper.createArrayNode();
        ObjectNode identifierNode = objectMapper.createObjectNode();
        identifierNode.put(JSON_PATH_VALUE, currency1);
        identifierNode.put(JSON_PATH_IDENTIFIER_TYPE, “CurrencyCode”);
        identifierArray.add(identifierNode);
        cashNode.set(JSON_PATH_IDENTIFIER, identifierArray);
        cashNode.put(“assetType”, “Cash”);
        assetNode.set(“Cash”, cashNode);
        observableNode.set(“value”, assetNode);

        ArrayNode observableLocationArray = objectMapper.createArrayNode();
        ObjectNode observableLocationNode = objectMapper.createObjectNode();
        observableLocationNode.put(JSON_PATH_ADDRESS_SCOPE, ADDRESS_SCOPE_DOCUMENT);
        observableLocationNode.put(JSON_PATH_ADDRESS_VALUE, ADDRESS_OBSERVABLE_1);
        observableLocationArray.add(observableLocationNode);
        observableNode.set(“meta”, objectMapper.createObjectNode().set(“location”, observableLocationArray));

        priceQuantityNode.set(JSON_PATH_OBSERVABLE, observableNode);

        priceQuantityNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());
        priceQuantityArray.add(priceQuantityNode);

        tradeLotNode.set(JSON_PATH_PRICE_QUANTITY, priceQuantityArray);

        return tradeLotNode;
    }

    private void mapCounterparties(Element tradeElement, Document document, ArrayNode counterpartyArray) {
        NodeList exchangedCurrency1Nodes = document.getElementsByTagName(FPML_EXCHANGED_CURRENCY_1);
        if (exchangedCurrency1Nodes.getLength() > 0) {
            Element ex1 = (Element) exchangedCurrency1Nodes.item(0);
            String payerPartyRef = getChildTextContent(ex1, FPML_PAYER_PARTY_REFERENCE);
            String receiverPartyRef = getChildTextContent(ex1, FPML_RECEIVER_PARTY_REFERENCE);

            // Party1
            ObjectNode cp1 = objectMapper.createObjectNode();
            cp1.put(JSON_PATH_ROLE, “Party1”);
            ObjectNode pref1 = objectMapper.createObjectNode();
            pref1.put(JSON_PATH_EXTERNAL_REFERENCE, receiverPartyRef);
            pref1.put(JSON_PATH_GLOBAL_REFERENCE, partyRefToGlobalKey.getOrDefault(receiverPartyRef, “”));
            cp1.set(JSON_PATH_PARTY_REFERENCE, pref1);
            counterpartyArray.add(cp1);

            // Party2
            ObjectNode cp2 = objectMapper.createObjectNode();
            cp2.put(JSON_PATH_ROLE, “Party2”);
            ObjectNode pref2 = objectMapper.createObjectNode();
            pref2.put(JSON_PATH_EXTERNAL_REFERENCE, payerPartyRef);
            pref2.put(JSON_PATH_GLOBAL_REFERENCE, partyRefToGlobalKey.getOrDefault(payerPartyRef, “”));
            cp2.set(JSON_PATH_PARTY_REFERENCE, pref2);
            counterpartyArray.add(cp2);
        }
    }

    private void mapTradeIdentifiers(Element tradeElement, Document document, ArrayNode tradeIdArray) {
        NodeList tradeHeaderNodes = document.getElementsByTagName(FPML_TRADE_HEADER);
        if (tradeHeaderNodes.getLength() == 0) return;

        Element tradeHeader = (Element) tradeHeaderNodes.item(0);
        NodeList ptiNodes = tradeHeader.getElementsByTagName(FPML_PARTY_TRADE_IDENTIFIER);

        for (int i = 0; i < ptiNodes.getLength(); i++) {
            Element pti = (Element) ptiNodes.item(i);
            NodeList tradeIdNodes = pti.getElementsByTagName(FPML_TRADE_ID);

            for (int j = 0; j < tradeIdNodes.getLength(); j++) {
                Element tradeIdEl = (Element) tradeIdNodes.item(j);
                String tradeIdValue = tradeIdEl.getTextContent();

                ObjectNode tradeIdNode = objectMapper.createObjectNode();
                tradeIdNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());

                // Get party reference
                NodeList partyRefNodes = pti.getElementsByTagName(FPML_PAYER_PARTY_REFERENCE);
                if (partyRefNodes.getLength() == 0) {
                    partyRefNodes = pti.getElementsByTagName(“partyReference”);
                }

                if (partyRefNodes.getLength() > 0) {
                    Element partyRefEl = (Element) partyRefNodes.item(0);
                    String href = partyRefEl.getAttribute(“href”);
                    if (href != null) {
                        href = href.replace(“#”, “”);
                    }

                    ObjectNode issuerRef = objectMapper.createObjectNode();
                    issuerRef.put(JSON_PATH_GLOBAL_REFERENCE, partyRefToGlobalKey.getOrDefault(href, “”));
                    issuerRef.put(JSON_PATH_EXTERNAL_REFERENCE, href);
                    tradeIdNode.set(JSON_PATH_ISSUER_REFERENCE, issuerRef);
                }

                ArrayNode assignedIdArray = objectMapper.createArrayNode();
                ObjectNode assignedId = objectMapper.createObjectNode();
                ObjectNode identNode = objectMapper.createObjectNode();
                identNode.put(JSON_PATH_VALUE, tradeIdValue);
                identNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());
                assignedId.set(JSON_PATH_IDENTIFIER, identNode);
                assignedIdArray.add(assignedId);
                tradeIdNode.set(JSON_PATH_ASSIGNED_IDENTIFIER, assignedIdArray);

                tradeIdArray.add(tradeIdNode);
            }
        }
    }

    private void mapParties(Document document, ArrayNode partyArray) {
        for (Map.Entry<String, String> entry : partyRefToId.entrySet()) {
            String ref = entry.getKey();
            String id = entry.getValue();

            ObjectNode partyNode = objectMapper.createObjectNode();
            partyNode.put(JSON_PATH_META_GLOBAL_KEY, partyRefToGlobalKey.get(ref));
            partyNode.put(“meta”, objectMapper.createObjectNode().put(“externalKey”, ref));

            ArrayNode partyIdArray = objectMapper.createArrayNode();
            ObjectNode partyIdNode = objectMapper.createObjectNode();
            partyIdNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());

            ObjectNode identNode = objectMapper.createObjectNode();
            identNode.put(JSON_PATH_VALUE, id);
            identNode.put(JSON_PATH_IDENTIFIER_TYPE, “LEI”);
            identNode.put(JSON_PATH_META_GLOBAL_KEY, generateGlobalKey());
            partyIdNode.set(JSON_PATH_IDENTIFIER, identNode);

            partyIdArray.add(partyIdNode);
            partyNode.set(JSON_PATH_PARTY_ID, partyIdArray);

            partyArray.add(partyNode);
        }
    }

    private String getFxValueDate(Document document) {
        NodeList fxSingleLegNodes = document.getElementsByTagName(FPML_FX_SINGLE_LEG);
        if (fxSingleLegNodes.getLength() > 0) {
            Element fxSingleLeg = (Element) fxSingleLegNodes.item(0);
            return getChildTextContent(fxSingleLeg, FPML_VALUE_DATE);
        }
        return LocalDate.now().toString();
    }

    private String getTradeDate(Element tradeElement, Document document) {
        NodeList tradeHeaderNodes = document.getElementsByTagName(FPML_TRADE_HEADER);
        if (tradeHeaderNodes.getLength() > 0) {
            Element tradeHeader = (Element) tradeHeaderNodes.item(0);
            return getChildTextContent(tradeHeader, FPML_TRADE_DATE);
        }
        return LocalDate.now().toString();
    }

    private String getChildTextContent(Element parent, String childTagName) {
        NodeList children = parent.getElementsByTagName(childTagName);
        if (children.getLength() > 0) {
            return children.item(0).getTextContent();
        }
        return “”;
    }

    private String getPaymentAmount(Element exchangedCurrency) {
        NodeList amountNodes = exchangedCurrency.getElementsByTagName(FPML_PAYMENT_AMOUNT);
        if (amountNodes.getLength() > 0) {
            Element amountEl = (Element) amountNodes.item(0);
            return amountEl.getElementsByTagName(“amount”).item(0).getTextContent();
        }
        return “0”;
    }

    private String getPaymentCurrency(Element exchangedCurrency) {
        NodeList amountNodes = exchangedCurrency.getElementsByTagName(FPML_PAYMENT_AMOUNT);
        if (amountNodes.getLength() > 0) {
            Element amountEl = (Element) amountNodes.item(0);
            return amountEl.getElementsByTagName(“currency”).item(0).getTextContent();
        }
        return “USD”;
    }

    private String derivePartyRole(String partyRef) {
        if (partyRef == null || partyRef.isEmpty()) return “Party1”;
        String ref = partyRef.replace(“#”, “”);
        return partyRefToId.containsKey(ref) ? “Party1” : “Party2”;
    }

    private String normalizeTradeDate(String dateStr) {
        if (dateStr != null && dateStr.endsWith(“Z”)) {
            return dateStr.substring(0, dateStr.length() - 1);
        }
        return dateStr != null ? dateStr : LocalDate.now().toString();
    }

    private String generateGlobalKey() {
        return UUID.randomUUID().toString().replace(“-”, “”).substring(0, 8);
    }

    public static void main(String[] args) {
        if (args.length < 1) {
            System.err.println(“Usage: java FpmlToCdmMapper <fpml-file-path>”);
            System.exit(1);
        }

        try {
            FpmlToCdmMapper mapper = new FpmlToCdmMapper();
            String cdmJson = mapper.mapFpmlToCdm(args[0]);
            System.out.println(cdmJson);
        } catch (Exception e) {
            System.err.println(“Error mapping FpML to CDM: “ + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}