package com.fpml.cdm.fx;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.DoubleNode;
import com.fasterxml.jackson.databind.node.IntNode;
import com.fasterxml.jackson.databind.node.LongNode;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Mapper for FpML fxSingleLeg products (FX spot, forward, NDF).
 *
 * Supported:
 * - FX spot transactions
 * - FX forward transactions
 * - FX Non-Deliverable Forwards (NDF)
 *
 * Cookbook rules applied:
 * - fx-derivatives:RULE-001 - Trade identifier -> assignedIdentifier.value
 * - fx-derivatives:RULE-002 - Trade date normalization (remove trailing 'Z')
 * - fx-derivatives:RULE-005 - Payment amounts -> CDM quantities (value + currency unit)
 * - fx-derivatives:TR-001 - Party reference resolution
 * - fx-derivatives:TR-002 - Date normalization (trim trailing 'Z')
 */
public class FxSingleLegMapper {

    private static final String RULE_001 = "fx-derivatives:RULE-001";
    private static final String RULE_002 = "fx-derivatives:RULE-002";
    private static final String RULE_005 = "fx-derivatives:RULE-005";
    private static final String TR_001 = "fx-derivatives:TR-001";
    private static final String TR_002 = "fx-derivatives:TR-002";

    private final Map<String, String> fieldMappingTrace;

    public FxSingleLegMapper() {
        this.fieldMappingTrace = new LinkedHashMap<>();
    }

    /**
     * Maps FpML fxSingleLeg XML to CDM JSON.
     * @param xmlContent FpML XML as string
     * @param objectMapper Jackson ObjectMapper for JSON creation
     * @return CDM JSON string
     */
    public String map(String xmlContent, ObjectMapper objectMapper) {
        fieldMappingTrace.clear();

        try {
            // Parse the XML content
            Map<String, Object> fpml = parseXmlToMap(xmlContent);

            // Build CDM structure
            ObjectNode cdm = objectMapper.createObjectNode();

            // Build trade object
            ObjectNode trade = cdm.putObject("trade");

            // Map party information first (needed for counterparty and tradeIdentifier)
            Map<String, Map<String, String>> parties = extractParties(fpml, trade, objectMapper);

            // Map trade header (trade identifiers and trade date)
            mapTradeHeader(fpml, trade, objectMapper);

            // Map product information
            mapProduct(fpml, trade, objectMapper);

            // Map counterparty information
            mapCounterparties(fpml, trade, parties, objectMapper);

            // Map trade date
            mapTradeDate(fpml, trade);

            // Add meta
            ObjectNode meta = cdm.putObject("meta");
            meta.put("globalKey", generateKey("trade"));

            return objectMapper.writeValueAsString(cdm);

        } catch (Exception e) {
            throw new RuntimeException("Mapping failed: " + e.getMessage(), e);
        }
    }

    /**
     * Extracts party information from FpML.
     */
    private Map<String, Map<String, String>> extractParties(Map<String, Object> fpml, ObjectNode trade, ObjectMapper objectMapper) {
        Map<String, Map<String, String>> partyMap = new LinkedHashMap<>();
        ArrayNode partyArray = objectMapper.createArrayNode();

        Object tradeObj = fpml.get("trade");
        if (!(tradeObj instanceof Map)) return partyMap;


        @SuppressWarnings("unchecked")
        Map<String, Object> tradeMap = (Map<String, Object>) tradeObj;
        Object partyObj = tradeMap.get("party");
        if (partyObj instanceof List) {
            List<Map<String, Object>> partyList = (List<Map<String, Object>>) partyObj;
            int idx = 0;
            for (Map<String, Object> party : partyList) {
                Map<String, String> partyInfo = new LinkedHashMap<>();
                String partyId = getStringValue(party, "partyId");
                String partyKey = "party" + (idx + 1);

                ObjectNode partyNode = partyArray.addObject();

                ArrayNode partyIdArray = partyNode.putArray("partyId");
                ObjectNode partyIdNode = partyIdArray.addObject();
                partyIdNode.put("identifierType", "LEI");
                partyIdNode.put("identifier", createNode(objectMapper, "value", partyId));
                partyIdNode.put("meta", createNode(objectMapper, "globalKey", generateKey(partyKey + ".partyId")));

                partyNode.put("meta", createNode(objectMapper, "globalKey", generateKey(partyKey)));
                partyNode.put("meta", createNode(objectMapper, "externalKey", partyKey));

                partyInfo.put("id", partyId);
                partyInfo.put("key", partyKey);
                partyMap.put(partyKey, partyInfo);
                idx++;
            }
        }

        if (partyArray.size() > 0) {
            trade.put("party", partyArray);
        }

        return partyMap;
    }

    /**
     * Maps trade header (identifiers and trade date).
     */
    @SuppressWarnings("unchecked")
    private void mapTradeHeader(Map<String, Object> fpml, ObjectNode trade, ObjectMapper objectMapper) {
        Object tradeObj = fpml.get("trade");
        if (!(tradeObj instanceof Map)) return;

        Map<String, Object> tradeMap = (Map<String, Object>) tradeObj;
        Object headerObj = tradeMap.get("tradeHeader");
        if (!(headerObj instanceof Map)) return;

        Map<String, Object> headerMap = (Map<String, Object>) headerObj;
        Object ptiObj = headerMap.get("partyTradeIdentifier");

        ArrayNode tradeIdArray = objectMapper.createArrayNode();

        if (ptiObj instanceof List) {
            List<Map<String, Object>> ptiList = (List<Map<String, Object>>) ptiObj;
            for (Map<String, Object> pti : ptiList) {
                Object partyRef = pti.get("partyReference");
                String tradeId = getStringValue(pti, "tradeId");

                if (tradeId != null && !tradeId.isEmpty()) {
                    ObjectNode tiNode = tradeIdArray.addObject();

                    // Resolve party reference
                    String partyKey = resolvePartyKey(partyRef, objectMapper);
                    if (partyKey != null) {
                        ObjectNode issuerRef = tiNode.putObject("issuerReference");
                        issuerRef.put("externalReference", partyKey);
                        issuerRef.put("globalReference", generateKey(partyKey));
                    }

                    ArrayNode assignedIdArray = tiNode.putArray("assignedIdentifier");
                    ObjectNode assignedId = assignedIdArray.addObject();
                    ObjectNode idNode = assignedId.putObject("identifier");
                    idNode.put("value", tradeId);
                    idNode.put("meta", createNode(objectMapper, "scheme", getSchemeForTradeId(partyKey)));
                    assignedId.put("meta", createNode(objectMapper, "globalKey", generateKey("tradeId." + tradeId)));
                    tiNode.put("meta", createNode(objectMapper, "globalKey", generateKey("tradeIdentifier." + tradeId)));

                    fieldMappingTrace.put("trade.tradeIdentifier", RULE_001);
                }
            }
        }

        if (tradeIdArray.size() > 0) {
            trade.put("tradeIdentifier", tradeIdArray);
        }
    }


    /**
     * Maps product information including taxonomy and economic terms.
     */
    @SuppressWarnings("unchecked")
    private void mapProduct(Map<String, Object> fpml, ObjectNode trade, ObjectMapper objectMapper) {
        Object tradeObj = fpml.get("trade");
        if (!(tradeObj instanceof Map)) return;

        Map<String, Object> tradeMap = (Map<String, Object>) tradeObj;
        Object fxSingleLeg = tradeMap.get("fxSingleLeg");
        if (!(fxSingleLeg instanceof Map)) return;

        Map<String, Object> singleLeg = (Map<String, Object>) fxSingleLeg;

        ObjectNode product = trade.putObject("product");

        // Taxonomy
        ArrayNode taxonomy = product.putArray("taxonomy");
        ObjectNode tax1 = taxonomy.addObject();
        tax1.put("source", "ISDA");
        tax1.put("productQualifier", "ForeignExchange_Spot_Forward");

        // Check if NDF
        Object ndf = singleLeg.get("nonDeliverableForward");
        boolean isNdf = ndf instanceof Map;


        if (isNdf) {
            ObjectNode tax2 = taxonomy.addObject();
            tax2.put("source", "FpML");
            tax2.put("productQualifier", "ForeignExchange_NDF");
        }

        // Economic terms
        ObjectNode economicTerms = product.putObject("economicTerms");
        ArrayNode payout = economicTerms.putArray("payout");

        ObjectNode settlementPayout = payout.addObject();
        settlementPayout.put("meta", createNode(objectMapper, "globalKey", generateKey("payout[0]")));

        // Payer/Receiver
        ObjectNode payerReceiver = settlementPayout.putObject("payerReceiver");

        // Determine direction from exchangedCurrency1
        Map<String, Object> exchangedCurrency1 = getMapValue(singleLeg, "exchangedCurrency1");
        String payer1 = getStringValue(exchangedCurrency1, "payerPartyReference");
        String receiver1 = getStringValue(exchangedCurrency1, "receiverPartyReference");

        payerReceiver.put("payer", resolvePartyRole(payer1));
        payerReceiver.put("receiver", resolvePartyRole(receiver1));


        fieldMappingTrace.put("product.economicTerms.payout[0].payerReceiver", TR_001);

        // Price quantity with address references
        ObjectNode priceQuantity = settlementPayout.putObject("priceQuantity");
        priceQuantity.put("quantitySchedule", createNode(objectMapper, "address", createAddressNode(objectMapper, "scope", "DOCUMENT", "value", "quantity-1")));
        priceQuantity.put("meta", createNode(objectMapper, "globalKey", "0"));

        // Settlement terms
        ObjectNode settlementTerms = settlementPayout.putObject("settlementTerms");
        settlementTerms.put("settlementType", "Cash");

        String valueDate = getStringValue(singleLeg, "valueDate");
        if (valueDate != null) {
            ObjectNode settleDate = settlementTerms.putObject("settlementDate");
            settleDate.put("valueDate", normalizeDate(valueDate));
            settleDate.put("meta", createNode(objectMapper, "globalKey", generateKey("settlementDate")));
            fieldMappingTrace.put("settlementTerms.settlementDate.valueDate", RULE_002);
        }

        if (isNdf) {
            Map<String, Object> ndfMap = (Map<String, Object>) ndf;
            String settlementCurrency = getStringValue(ndfMap, "settlementCurrency");
            if (settlementCurrency != null) {
                settlementTerms.put("settlementCurrency", createNode(objectMapper, "value", settlementCurrency));
            }
        }

        settlementTerms.put("meta", createNode(objectMapper, "globalKey", generateKey("settlementTerms")));

        // Underlier
        ObjectNode underlier = settlementPayout.putObject("underlier");
        underlier.put("Observable", createNode(objectMapper, "address", createAddressNode(objectMapper, "scope", "DOCUMENT", "value", "observable-1")));
        settlementPayout.put("meta", createNode(objectMapper, "globalKey", generateKey("settlementPayout")));

        product.put("meta", createNode(objectMapper, "globalKey", generateKey("product")));
    }

    /**
     * Maps counterparties to CDM counterparty array.
     */
    private void mapCounterparties(Map<String, Object> fpml, ObjectNode trade, Map<String, Map<String, String>> parties, ObjectMapper objectMapper) {
        ArrayNode counterpartyArray = objectMapper.createArrayNode();

        int idx = 0;
        for (Map.Entry<String, Map<String, String>> entry : parties.entrySet()) {
            String partyKey = entry.getKey();
            Map<String, String> partyInfo = entry.getValue();

            ObjectNode cpNode = counterpartyArray.addObject();
            cpNode.put("role", idx == 0 ? "Party1" : "Party2");

            ObjectNode partyRef = cpNode.putObject("partyReference");
            partyRef.put("externalReference", partyKey);
            partyRef.put("globalReference", generateKey(partyKey));

            idx++;
            fieldMappingTrace.put("trade.counterparty", TR_001);
        }

        if (counterpartyArray.size() > 0) {
            trade.put("counterparty", counterpartyArray);
        }
    }

    /**
     * Maps trade date.
     */
    @SuppressWarnings("unchecked")
    private void mapTradeDate(Map<String, Object> fpml, ObjectNode trade) {
        Object tradeObj = fpml.get("trade");
        if (!(tradeObj instanceof Map)) return;

        Map<String, Object> tradeMap = (Map<String, Object>) tradeObj;
        Object headerObj = tradeMap.get("tradeHeader");
        if (!(headerObj instanceof Map)) return;


        Map<String, Object> headerMap = (Map<String, Object>) headerObj;
        String tradeDate = getStringValue(headerMap, "tradeDate");

        if (tradeDate != null) {
            ObjectNode tradeDateNode = trade.putObject("tradeDate");
            tradeDateNode.put("value", normalizeDate(tradeDate));
            tradeDateNode.put("meta", createNode(objectMapper, "globalKey", generateKey("tradeDate")));
            fieldMappingTrace.put("trade.tradeDate.value", RULE_002);
        }
    }

    // ============== Utility Methods ==============

    /**
     * Simple XML-like parsing to Map structure.
     * Handles common FpML patterns for fxSingleLeg.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseXmlToMap(String xml) {
        Map<String, Object> result = new LinkedHashMap<>();

        xml = xml.trim();

        // Remove XML declaration
        if (xml.startsWith("<?xml")) {
            int endDecl = xml.indexOf("?>");
            if (endDecl > 0) {
                xml = xml.substring(endDecl + 2).trim();
            }
        }

        // Find root element
        Pattern rootPattern = Pattern.compile("<([a-zA-Z0-9:]+)[^>]*>(.*)", Pattern.DOTALL);
        Matcher rootMatcher = rootPattern.matcher(xml);
        if (rootMatcher.matches()) {
            String rootName = rootMatcher.group(1);
            String content = rootMatcher.group(2);

            // Find closing tag
            String closeTag = "</" + rootName + ">";
            int closeIdx = content.lastIndexOf(closeTag);
            if (closeIdx > 0) {
                content = content.substring(0, closeIdx);
            }

            result.put(rootName, parseElement(content, rootName));
        }

        return result;
    }

    private ObjectMapper objectMapper = new ObjectMapper();

    private Object parseElement(String content, String parentName) {
        content = content.trim();
        if (content.isEmpty()) return "";

        // Check if content starts with another element
        Pattern elemStart = Pattern.compile("<([a-zA-Z0-9:]+)[^>]*>");
        Matcher elemMatcher = elemStart.matcher(content);

        if (!elemMatcher.find() || elemMatcher.start() != 0) {
            // Text content
            return content;
        }

        // It's an element or array of elements
        String elemName = elemMatcher.group(1);
        List<Object> array = new ArrayList<>();
        Map<String, Object> map = new LinkedHashMap<>();

        int pos = 0;
        Pattern closeTag = Pattern.compile("</" + elemName + ">");
        Pattern selfClose = Pattern.compile("<" + elemName + "[^>]*/>");
        Pattern openTag = Pattern.compile("<" + elemName + "[^>]*>");

        while (pos < content.length()) {
            Matcher selfCloseMatcher = selfClose.matcher(content.substring(pos));
            Matcher openTagMatcher = openTag.matcher(content.substring(pos));

            if (selfCloseMatcher.lookingAt()) {
                // Self-closing element
                String selfCloseContent = selfCloseMatcher.group();
                Map<String, Object> attrs = parseAttributes(selfCloseContent);
                if (!attrs.isEmpty()) {
                    map.putAll(attrs);
                } else {
                    map.put(elemName, "");
                }
                pos += selfCloseMatcher.end();
            } else if (openTagMatcher.lookingAt()) {
                int openEnd = -1;
                String openContent = openTagMatcher.group();

                // Find the closing >
                int gtIdx = openContent.lastIndexOf('>');
                if (gtIdx > 0) {
                    openEnd = pos + gtIdx + 1;
                }

                // Find the closing tag
                Matcher closeMatcher = closeTag.matcher(content.substring(pos));
                if (closeMatcher.find()) {
                    int closeStart = pos + closeMatcher.start();
                    int closeEnd = pos + closeMatcher.end();

                    if (openEnd < closeStart) {
                        String elemContent = content.substring(openEnd, closeStart);
                        String tagName = elemName;

                        // Parse nested content
                        Object parsed = parseElement(elemContent, tagName);

                        // Check if this should be an array
                        String keyToUse = tagName;

                        if (parsed instanceof Map) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> parsedMap = (Map<String, Object>) parsed;
                            // Check if there's a type attribute or similar
                            for (String k : parsedMap.keySet()) {
                                if (!k.equals(tagName)) {
                                    keyToUse = k;
                                    break;
                                }
                            }
                        }

                        if (map.containsKey(keyToUse) || array.size() > 0) {
                            // Already have this key, must be array
                            if (array.isEmpty() && map.containsKey(keyToUse)) {
                                array.add(map.remove(keyToUse));
                            }
                            array.add(parsed);
                        } else {
                            map.put(keyToUse, parsed);
                        }

                        pos = closeEnd;
                    } else {
                        pos += openTagMatcher.end();
                    }
                } else {
                    pos += openTagMatcher.end();
                }
            } else {
                // No more matching elements, might be text
                pos = content.length();
            }
        }

        if (!array.isEmpty()) {
            return array;
        } else if (!map.isEmpty()) {
            return map;
        } else {
            return content;
        }
    }

    private Map<String, Object> parseAttributes(String tag) {
        Map<String, Object> attrs = new LinkedHashMap<>();

        // Simple attribute parsing
        Pattern attrPattern = Pattern.compile("([a-zA-Z0-9:]+)=\"([^\"]*)\"");
        Matcher matcher = attrPattern.matcher(tag);

        while (matcher.find()) {
            String name = matcher.group(1);
            String value = matcher.group(2);


            // Skip href references for now
            if ("href".equals(name)) {
                attrs.put("_ref", value);
            } else {
                attrs.put(name, value);
            }
        }

        return attrs;
    }

    private String getStringValue(Map<String, Object> map, String key) {
        if (map == null || !map.containsKey(key)) return null;
        Object val = map.get(key);
        if (val instanceof String) return (String) val;
        return val != null ? val.toString() : null;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getMapValue(Map<String, Object> map, String key) {
        if (map == null || !map.containsKey(key)) return new LinkedHashMap<>();
        Object val = map.get(key);
        if (val instanceof Map) return (Map<String, Object>) val;
        return new LinkedHashMap<>();
    }

    @SuppressWarnings("unchecked")
    private List<Object> getListValue(Map<String, Object> map, String key) {
        if (map == null || !map.containsKey(key)) return new ArrayList<>();
        Object val = map.get(key);
        if (val instanceof List) return (List<Object>) val;
        return new ArrayList<>();
    }

    private String normalizeDate(String date) {
        if (date == null) return null;
        // Remove trailing Z
        if (date.endsWith("Z")) {
            return date.substring(0, date.length() - 1);
        }
        return date;
    }

    private String resolvePartyRole(String partyRef) {
        if (partyRef == null) return "Unknown";
        if ("party1".equals(partyRef) || partyRef.contains("party1")) {
            return "Party1";
        } else if ("party2".equals(partyRef) || partyRef.contains("party2")) {
            return "Party2";
        }
        return "Party1";
    }

    private String resolvePartyKey(Object partyRef) {
        if (partyRef == null) return null;
        String ref = partyRef instanceof String ? (String) partyRef : partyRef.toString();
        if (ref.startsWith("#")) {
            ref = ref.substring(1);
        }
        return ref;
    }

    private String getSchemeForTradeId(String partyKey) {
        // Different schemes based on party
        if ("party1".equals(partyKey)) {
            return "http://www.partyA.com/fx/trade-id";
        } else if ("party2".equals(partyKey)) {
            return "http://www.partyB.com/fx/trade-id";
        }
        return "http://www.fpml.org/trade-id";
    }

    private String generateKey(String input) {
        if (input == null || input.isEmpty()) {
            return "0";
        }
        int hash = input.hashCode();
        return Integer.toHexString(Math.abs(hash));
    }

    private ObjectNode createNode(ObjectMapper mapper, String key, Object value) {
        ObjectNode node = mapper.createObjectNode();
        if (value instanceof String) {
            node.put(key, (String) value);
        } else if (value instanceof Integer) {
            node.put(key, (Integer) value);
        } else if (value instanceof Long) {
            node.put(key, (Long) value);
        } else if (value instanceof Double) {
            node.put(key, (Double) value);
        } else if (value != null) {
            node.put(key, value.toString());
        }
        return node;
    }

    private ObjectNode createAddressNode(ObjectMapper mapper, String scopeKey, String scopeValue, String valueKey, String valueValue) {
        ObjectNode node = mapper.createObjectNode();
        node.put(scopeKey, scopeValue);
        node.put(valueKey, valueValue);
        return node;
    }

    /**
     * Returns the field mapping traceability.
     */
    public Map<String, String> getFieldMappingTrace() {
        return fieldMappingTrace;
    }
}