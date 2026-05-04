package com.fpml.cdm.fx.mapper.generated;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.fpml.cdm.fx.mapper.generated.singleleg.FxSingleLegMapper;
import com.fpml.cdm.fx.mapper.generated.singleleg.FxSingleLegMapperUtils;
import com.fpml.cdm.fx.mapper.generated.support.PartyMapper;
import com.fpml.cdm.fx.mapper.generated.support.SettlementTermsMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;

public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {

    private final ObjectMapper objectMapper;
    private final FxSingleLegMapper singleLegMapper;
    private final PartyMapper partyMapper;
    private final SettlementTermsMapper settlementTermsMapper;
    private final FxSingleLegMapperUtils utils;

    public GeneratedFpmlToCdmMapper() {
        this.objectMapper = new ObjectMapper();
        this.utils = new FxSingleLegMapperUtils();
        this.partyMapper = new PartyMapper(objectMapper);
        this.settlementTermsMapper = new SettlementTermsMapper(objectMapper);
        this.singleLegMapper = new FxSingleLegMapper(objectMapper, partyMapper, settlementTermsMapper, utils);
    }

    @Override
    public JsonNode mapFpmlToCdm(String fpmlXmlContent, String fixtureId) throws IOException {
        ObjectNode rootNode = objectMapper.createObjectNode();
        
        // Parse FpML XML content
        Map<String, Object> fpmlData = parseFpmlXml(fpmlXmlContent);
        
        // Detect product type and route to appropriate mapper
        String productType = detectProductType(fpmlData);
        
        if ("fxSingleLeg".equals(productType)) {
            return mapFxSingleLeg(fpmlData, rootNode);
        } else {
            return createUnsupportedReport(rootNode, productType, "Product type not supported in current implementation group: " + productType);
        }
    }

    @Override
    public JsonNode mapFpmlFileToCdm(File fpmlFile, String fixtureId) throws IOException {
        String content = new String(Files.readAllBytes(fpmlFile.toPath()));
        return mapFpmlToCdm(content, fixtureId);
    }

    @Override
    public void mapFpmlFileToCdmFile(File fpmlFile, File outputFile, String fixtureId) throws IOException {
        JsonNode result = mapFpmlFileToCdm(fpmlFile, fixtureId);
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, result);
    }

    private JsonNode mapFxSingleLeg(Map<String, Object> fpmlData, ObjectNode rootNode) {
        return singleLegMapper.map(fpmlData, rootNode);
    }

    private String detectProductType(Map<String, Object> fpmlData) {
        Map<String, Object> trade = getNestedMap(fpmlData, "trade");
        if (trade != null) {
            if (trade.containsKey("fxSingleLeg")) return "fxSingleLeg";
            if (trade.containsKey("fxSwap")) return "fxSwap";
            if (trade.containsKey("fxSimpleOption")) return "fxSimpleOption";
            if (trade.containsKey("fxDigitalOption")) return "fxDigitalOption";
            if (trade.containsKey("fxBarrierOption")) return "fxBarrierOption";
        }
        return "unknown";
    }

    private Map<String, Object> parseFpmlXml(String xmlContent) {
        // Simple XML parsing using string manipulation for FpML structure
        Map<String, Object> result = new HashMap<>();
        
        // Parse header
        result.put("header", parseHeader(xmlContent));
        
        // Parse party elements
        result.put("party", parseParties(xmlContent));
        
        // Parse trade
        result.put("trade", parseTrade(xmlContent));
        
        return result;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseHeader(String xml) {
        Map<String, Object> header = new HashMap<>();
        
        header.put("conversationId", extractValue(xml, "conversationId"));
        header.put("messageId", extractValue(xml, "messageId"));
        header.put("sentBy", extractValue(xml, "sentBy"));
        header.put("sendTo", extractValue(xml, "sendTo"));
        header.put("creationTimestamp", extractValue(xml, "creationTimestamp"));
        
        return header;
    }

    @SuppressWarnings("unchecked")
    private java.util.List<Map<String, Object>> parseParties(String xml) {
        java.util.List<Map<String, Object>> parties = new java.util.ArrayList<>();
        String partyPattern = "<party>";
        int idx = 0;
        
        while ((idx = xml.indexOf(partyPattern, idx)) != -1) {
            int endIdx = xml.indexOf("</party>", idx);
            if (endIdx == -1) break;
            
            String partyXml = xml.substring(idx, endIdx + 8);
            Map<String, Object> party = new HashMap<>();
            
            String partyId = extractValue(partyXml, "partyId");
            if (partyId != null) {
                party.put("partyId", partyId);
                parties.add(party);
            }
            idx = endIdx;
        }
        
        return parties;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseTrade(String xml) {
        Map<String, Object> trade = new HashMap<>();
        
        // Check for fxSingleLeg
        int singlelegStart = xml.indexOf("<fxSingleLeg>");
        if (singlelegStart != -1) {
            int singlelegEnd = xml.indexOf("</fxSingleLeg>", singlelegStart);
            if (singlelegEnd != -1) {
                String singlelegXml = xml.substring(singlelegStart, singlelegEnd + 13);
                trade.put("fxSingleLeg", parseFxSingleLeg(singlelegXml));
            }
        }
        
        // Parse tradeHeader
        int tradeHeaderStart = xml.indexOf("<tradeHeader>");
        if (tradeHeaderStart != -1) {
            int tradeHeaderEnd = xml.indexOf("</tradeHeader>", tradeHeaderStart);
            if (tradeHeaderEnd != -1) {
                String tradeHeaderXml = xml.substring(tradeHeaderStart, tradeHeaderEnd + 14);
                trade.put("tradeHeader", parseTradeHeader(tradeHeaderXml));
            }
        }
        
        return trade;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseTradeHeader(String xml) {
        Map<String, Object> tradeHeader = new HashMap<>();
        
        tradeHeader.put("tradeDate", extractValue(xml, "tradeDate"));
        tradeHeader.put("partyTradeIdentifier", parsePartyTradeIdentifiers(xml));
        
        return tradeHeader;
    }

    @SuppressWarnings("unchecked")
    private java.util.List<Map<String, Object>> parsePartyTradeIdentifiers(String xml) {
        java.util.List<Map<String, Object>> identifiers = new java.util.ArrayList<>();
        String pattern = "<partyTradeIdentifier>";
        int idx = 0;
        
        while ((idx = xml.indexOf(pattern, idx)) != -1) {
            int endIdx = xml.indexOf("</partyTradeIdentifier>", idx);
            if (endIdx == -1) break;
            
            String itemXml = xml.substring(idx, endIdx + 21);
            Map<String, Object> item = new HashMap<>();
            item.put("partyReference", extractValue(itemXml, "partyReference"));
            item.put("tradeId", extractValue(itemXml, "tradeId"));
            identifiers.add(item);
            idx = endIdx;
        }
        
        return identifiers;
    }


    @SuppressWarnings("unchecked")
    private Map<String, Object> parseFxSingleLeg(String xml) {
        Map<String, Object> fxSingleLeg = new HashMap<>();
        
        // Parse exchangedCurrency1
        int ec1Start = xml.indexOf("<exchangedCurrency1>");
        if (ec1Start != -1) {
            int ec1End = xml.indexOf("</exchangedCurrency1>", ec1Start);
            String ec1Xml = xml.substring(ec1Start, ec1End + 20);
            fxSingleLeg.put("exchangedCurrency1", parseExchangedCurrency(ec1Xml));
        }
        
        // Parse exchangedCurrency2
        int ec2Start = xml.indexOf("<exchangedCurrency2>");
        if (ec2Start != -1) {
            int ec2End = xml.indexOf("</exchangedCurrency2>", ec2Start);
            String ec2Xml = xml.substring(ec2Start, ec2End + 20);
            fxSingleLeg.put("exchangedCurrency2", parseExchangedCurrency(ec2Xml));
        }
        
        // Parse valueDate
        fxSingleLeg.put("valueDate", extractValue(xml, "valueDate"));
        
        // Parse exchangeRate
        int erStart = xml.indexOf("<exchangeRate>");
        if (erStart != -1) {
            int erEnd = xml.indexOf("</exchangeRate>", erStart);
            String erXml = xml.substring(erStart, erEnd + 15);
            fxSingleLeg.put("exchangeRate", parseExchangeRate(erXml));
        }
        
        return fxSingleLeg;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseExchangedCurrency(String xml) {
        Map<String, Object> ec = new HashMap<>();
        
        ec.put("payerPartyReference", extractValue(xml, "payerPartyReference"));
        ec.put("receiverPartyReference", extractValue(xml, "receiverPartyReference"));
        
        int amountStart = xml.indexOf("<paymentAmount>");
        if (amountStart != -1) {
            int amountEnd = xml.indexOf("</paymentAmount>", amountStart);
            String amountXml = xml.substring(amountStart, amountEnd + 16);
            
            Map<String, Object> paymentAmount = new HashMap<>();
            paymentAmount.put("currency", extractValue(amountXml, "currency"));
            paymentAmount.put("amount", extractValue(amountXml, "amount"));
            ec.put("paymentAmount", paymentAmount);
        }
        
        return ec;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseExchangeRate(String xml) {
        Map<String, Object> er = new HashMap<>();
        
        er.put("rate", extractValue(xml, "rate"));
        
        int qcpStart = xml.indexOf("<quotedCurrencyPair>");
        if (qcpStart != -1) {
            int qcpEnd = xml.indexOf("</quotedCurrencyPair>", qcpStart);
            String qcpXml = xml.substring(qcpStart, qcpEnd + 21);
            er.put("quotedCurrencyPair", parseQuotedCurrencyPair(qcpXml));
        }
        
        return er;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseQuotedCurrencyPair(String xml) {
        Map<String, Object> qcp = new HashMap<>();
        
        qcp.put("currency1", extractValue(xml, "currency1"));
        qcp.put("currency2", extractValue(xml, "currency2"));
        qcp.put("quoteBasis", extractValue(xml, "quoteBasis"));
        
        return qcp;
    }

    private String extractValue(String xml, String tagName) {
        String openTag = "<" + tagName + ">";
        String closeTag = "</" + tagName + ">";
        
        int start = xml.indexOf(openTag);
        if (start == -1) return null;
        
        start += openTag.length();
        int end = xml.indexOf(closeTag, start);
        if (end == -1) return null;
        
        return xml.substring(start, end).trim();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> getNestedMap(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value instanceof Map) {
            return (Map<String, Object>) value;
        }
        return null;
    }

    private ObjectNode createUnsupportedReport(ObjectNode rootNode, String productType, String reason) {
        ObjectNode report = objectMapper.createObjectNode();
        report.put("status", "UNSUPPORTED");
        report.put("productType", productType);
        report.put("reason", reason);
        report.put("implementationGroup", "fx-single-leg");
        report.put("supportedProducts", "fx-single-leg");
        rootNode.set("unsupportedReport", report);
        return rootNode;
    }
}
