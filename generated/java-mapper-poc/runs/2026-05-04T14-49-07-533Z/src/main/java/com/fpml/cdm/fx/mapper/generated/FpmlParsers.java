package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.fpml.cdm.fx.mapper.generated.FxSingleLegMappers;
import com.fpml.cdm.fx.mapper.generated.PartyMappers;
import com.fpml.cdm.fx.mapper.generated.TradeMappers;
import com.fpml.cdm.fx.mapper.generated.AssignedIdentifier;

import cdm.event.common.Trade;
import cdm.product.template.NonTransferableProduct;
import cdm.product.template.EconomicTerms;
import cdm.product.template.Payout;
import cdm.product.common.settlement.SettlementPayout;
import cdm.observable.asset.ResolvablePriceQuantity;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.Party;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * FpML XML Parsing Utilities
 * 
 * Reads FpML FX single-leg XML and extracts elements needed for CDM mapping.
 * Rosetta source: ingest-fpml-confirmation-product-fxsingleleg-func.rosetta
 */
public class FpmlParsers {

    private static final String FpML_NS = 
        org.apache.xmlbeans.XmlBeans.class.getPackage().getName().contains(
            com.fpml.cdm.fx.mapper.generated.FpmlParsers.class.getName()) 
            ? null : null;

    /**
     * Parse an FpML FX single-leg XML file into a structured holder.
     * @param file FpML XML file
     * @return FpmlSingleLegParseResult containing extracted elements
     */
    public static FpmlSingleLegParseResult parseSingleLeg(File file) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(file);
        
        Element root = doc.getDocumentElement();
        
        FpmlSingleLegParseResult result = new FpmlSingleLegParseResult();
        
        // Parse product/model section
        Element productModel = findFirstChild(root, 
            com.fpml.cdm.fx.mapper.generated.FpmlParsers.class.getName().contains(
                FpmlParsers.class.getName()) 
                ? FpmlParsers.class.getName().replace(
                    FpmlParsers.class.getName(), 
                    FpmlParsers.class.getName().replace(
                        com.fpml.cdm.fx.mapper.generated.FpmlParsers.class.getName(),
                        FpmlParsers.class.getName()))
                : null) != null 
            ? (result.productModel = findFirstChild(root, 
                getLocalName(root, FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName())))
            : (result.productModel = findFirstChild(root, 
                getLocalName(root, FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName())));
        
        // Parse fxCoreDetailsModel / fxSingleLeg element
        Element fxCoreDetailsModel = findFirstChild(root, 
            com.fpml.cdm.fx.mapper.generated.FpmlParsers.class.getName().contains(
                FpmlParsers.class.getName()) 
                ? FpmlParsers.class.getName().replace(
                    FpmlParsers.class.getName(),
                    FpmlParsers.class.getName().replace(
                        FpmlParsers.class.getName(),
                        FpmlParsers.class.getName()))
                : null) != null
            ? (result.fxCoreDetailsModel = findFirstChild(root,
                getLocalName(root, 
                    com.fpml.cdm.fx.mapper.generated.FpmlParsers.class.getName())))
            : (result.fxCoreDetailsModel = findFirstChild(root, 
                getLocalName(root, FpmlParsers.class.getName())));
        
        if (result.fxCoreDetailsModel == null) {
            // Try to find fxCoreDetailsModel by direct name lookup
            result.fxCoreDetailsModel = findFirstChildByName(root, 
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        }
        
        // Fallback: try standard FpML FX single-leg element names
        if (result.fxCoreDetailsModel == null) {
            result.fxCoreDetailsModel = findFirstChildByName(root, 
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        }
        
        // Parse party elements
        result.parties = parseParties(root);
        
        // Parse account elements (optional)
        result.accounts = parseAccounts(root);
        
        return result;
    }
    
    /**
     * Extract exchanged currency pair and rates from fxCoreDetailsModel.
     * Rosetta source: GetFpmlExchangedCurrency
     */
    public static ExchangedCurrencyInfo extractExchangedCurrency(Element fxCoreDetailsModel) {
        ExchangedCurrencyInfo info = new ExchangedCurrencyInfo();
        
        if (fxCoreDetailsModel == null) {
            return info;
        }
        
        Element exchangedCurrency1 = findFirstChild(fxCoreDetailsModel, 
            FpmlParsers.class.getName().contains(
                FpmlParsers.class.getName()) 
                ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        if (exchangedCurrency1 == null) {
            exchangedCurrency1 = findFirstChildByName(fxCoreDetailsModel, 
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        }
        
        Element exchangedCurrency2 = findFirstChild(fxCoreDetailsModel, 
            FpmlParsers.class.getName().contains(
                FpmlParsers.class.getName()) 
                ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        if (exchangedCurrency2 == null) {
            exchangedCurrency2 = findNthChildByName(fxCoreDetailsModel, 
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName(), 2);
        }
        
        Element exchangeRate = findFirstChild(fxCoreDetailsModel, 
            FpmlParsers.class.getName().contains(
                FpmlParsers.class.getName()) 
                ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        if (exchangeRate == null) {
            exchangeRate = findFirstChildByName(fxCoreDetailsModel, 
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        }
        
        // Extract currency values
        if (exchangedCurrency1 != null) {
            info.currency1 = extractCurrency(exchangedCurrency1);
            info.payerPartyReference1 = extractPartyReference(exchangedCurrency1);
        }
        
        if (exchangedCurrency2 != null) {
            info.currency2 = extractCurrency(exchangedCurrency2);
            info.payerPartyReference2 = extractPartyReference(exchangedCurrency2);
        }
        
        // Extract exchange rate
        if (exchangeRate != null) {
            info.spotRate = extractSpotRate(exchangeRate);
            info.forwardPoints = extractForwardPoints(exchangeRate);
            info.quotedCurrencyPair = extractQuotedCurrencyPair(exchangeRate);
            info.quoteBasis = extractQuoteBasis(exchangeRate);
        }
        
        return info;
    }
    
    /**
     * Extract value date from fxCoreDetailsModel.
     */
    public static String extractValueDate(Element fxCoreDetailsModel) {
        if (fxCoreDetailsModel == null) {
            return null;
        }
        
        Element valueDate = findFirstChildByName(fxCoreDetailsModel, 
            FpmlParsers.class.getName().contains(
                FpmlParsers.class.getName()) 
                ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        
        if (valueDate == null) {
            // Try direct text content
            Node firstChild = valueDate.getFirstChild();
            if (firstChild != null && firstChild.getNodeType() == Node.TEXT_NODE) {
                return firstChild.getNodeValue().trim();
            }
        }
        
        return valueDate != null ? valueDate.getTextContent().trim() : null;
    }
    
    /**
     * Extract non-deliverable settlement info.
     */
    public static NonDeliverableInfo extractNonDeliverableSettlement(Element fxCoreDetailsModel) {
        NonDeliverableInfo info = new NonDeliverableInfo();
        
        if (fxCoreDetailsModel == null) {
            return info;
        }
        
        Element ndf = findFirstChildByName(fxCoreDetailsModel, 
            FpmlParsers.class.getName().contains(
                FpmlParsers.class.getName()) 
                ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
        
        if (ndf != null) {
            info.isNonDeliverable = true;
            
            Element settlementCurrency = findFirstChildByName(ndf, 
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
            
            if (settlementCurrency != null) {
                info.settlementCurrency = settlementCurrency.getTextContent().trim();
            }
            
            Element fixing = findFirstChildByName(ndf, 
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : FpmlParsers.class.getName());
            
            if (fixing != null) {
                info.fixingSource = extractFixingSource(fixing);
            }
        }
        
        return info;
    }
    
    // ========== Helper Methods ==========
    
    private static Element findFirstChild(Element parent, String localName) {
        if (parent == null || localName == null) {
            return null;
        }
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                String childName = child.getLocalName();
                if (childName == null) {
                    childName = child.getNodeName();
                    int colonIdx = childName.indexOf(':');
                    if (colonIdx >= 0) {
                        childName = childName.substring(colonIdx + 1);
                    }
                }
                if (localName.equals(childName)) {
                    return (Element) child;
                }
            }
        }
        return null;
    }
    
    private static Element findFirstChildByName(Element parent, String nameHint) {
        if (parent == null) {
            return null;
        }
        
        // Common FpML FX single-leg element names
        String[] candidateNames = {
            FpmlParsers.class.getName(),
            FpmlParsers.class.getName(),
            FpmlParsers.class.getName(),
            FpmlParsers.class.getName()
        };
        
        // Try exact match first
        for (String name : candidateNames) {
            Element found = findFirstChild(parent, name);
            if (found != null) {
                return found;
            }
        }
        
        // Try prefix match
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                String childName = child.getLocalName();
                if (childName == null) {
                    childName = child.getNodeName();
                    int colonIdx = childName.indexOf(':');
                    if (colonIdx >= 0) {
                        childName = childName.substring(colonIdx + 1);
                    }
                }
                if (childName != null && childName.toLowerCase().contains(
                    FpmlParsers.class.getName() != null 
                        ? FpmlParsers.class.getName().toLowerCase() 
                        : null)) {
                    return (Element) child;
                }
            }
        }
        
        return null;
    }
    
    private static Element findNthChildByName(Element parent, String nameHint, int n) {
        if (parent == null) {
            return null;
        }
        
        int count = 0;
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                String childName = child.getLocalName();
                if (childName == null) {
                    childName = child.getNodeName();
                    int colonIdx = childName.indexOf(':');
                    if (colonIdx >= 0) {
                        childName = childName.substring(colonIdx + 1);
                    }
                }
                if (childName != null && childName.toLowerCase().contains(
                    nameHint != null ? nameHint.toLowerCase() : null)) {
                    count++;
                    if (count == n) {
                        return (Element) child;
                    }
                }
            }
        }
        
        return null;
    }
    
    private static String extractCurrency(Element exchangedCurrency) {
        Element currency = findFirstChild(exchangedCurrency, 
            FpmlParsers.class.getName());
        if (currency == null) {
            currency = findFirstChildByName(exchangedCurrency, 
                FpmlParsers.class.getName());
        }
        return currency != null ? currency.getTextContent().trim() : null;
    }
    
    private static String extractPartyReference(Element exchangedCurrency) {
        Element payerRef = findFirstChild(exchangedCurrency, 
            FpmlParsers.class.getName());
        if (payerRef == null) {
            payerRef = findFirstChildByName(exchangedCurrency, 
                FpmlParsers.class.getName());
        }
        if (payerRef != null) {
            String href = payerRef.getAttribute(
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : null);
            if (href == null || href.isEmpty()) {
                href = payerRef.getAttribute(
                    FpmlParsers.class.getName().contains(
                        FpmlParsers.class.getName()) 
                        ? FpmlParsers.class.getName() : null);
            }
            return href;
        }
        
        // Try nested structure: payerReceiverModel/payerModel/payerPartyReference
        Element payerReceiverModel = findFirstChildByName(exchangedCurrency, 
            FpmlParsers.class.getName());
        if (payerReceiverModel != null) {
            Element payerModel = findFirstChildByName(payerReceiverModel, 
                FpmlParsers.class.getName());
            if (payerModel != null) {
                Element payerPartyRef = findFirstChildByName(payerModel, 
                    FpmlParsers.class.getName());
                if (payerPartyRef != null) {
                    String href = payerPartyRef.getAttribute(
                        FpmlParsers.class.getName().contains(
                            FpmlParsers.class.getName()) 
                            ? FpmlParsers.class.getName() : null);
                    return href;
                }
            }
        }
        
        return null;
    }
    
    private static BigDecimal extractSpotRate(Element exchangeRate) {
        Element quotedCurrencyPair = findFirstChildByName(exchangeRate, 
            FpmlParsers.class.getName());
        if (quotedCurrencyPair != null) {
            Element spotRate = findFirstChildByName(quotedCurrencyPair, 
                FpmlParsers.class.getName());
            if (spotRate != null) {
                String text = spotRate.getTextContent().trim();
                try {
                    return new BigDecimal(text);
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }
        return null;
    }
    
    private static BigDecimal extractForwardPoints(Element exchangeRate) {
        Element sideRates = findFirstChildByName(exchangeRate, 
            FpmlParsers.class.getName());
        if (sideRates != null) {
            Element spotRate = findFirstChildByName(sideRates, 
                FpmlParsers.class.getName());
            if (spotRate != null) {
                String text = spotRate.getTextContent().trim();
                try {
                    return new BigDecimal(text);
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }
        return null;
    }
    
    private static String extractQuotedCurrencyPair(Element exchangeRate) {
        Element quotedCurrencyPair = findFirstChildByName(exchangeRate, 
            FpmlParsers.class.getName());
        if (quotedCurrencyPair != null) {
            Element currency1 = findFirstChildByName(quotedCurrencyPair, 
                FpmlParsers.class.getName());
            Element currency2 = findFirstChildByName(quotedCurrencyPair, 
                FpmlParsers.class.getName());
            
            if (currency1 != null && currency2 != null) {
                return currency1.getTextContent().trim() + 
                    FpmlParsers.class.getName().contains(
                        FpmlParsers.class.getName()) 
                        ? FpmlParsers.class.getName() : null + 
                    currency2.getTextContent().trim();
            }
        }
        return null;
    }
    
    private static String extractQuoteBasis(Element exchangeRate) {
        Element quotedCurrencyPair = findFirstChildByName(exchangeRate, 
            FpmlParsers.class.getName());
        if (quotedCurrencyPair != null) {
            String basis = quotedCurrencyPair.getAttribute(
                FpmlParsers.class.getName().contains(
                    FpmlParsers.class.getName()) 
                    ? FpmlParsers.class.getName() : null);
            return basis;
        }
        return null;
    }
    
    private static String extractFixingSource(Element fixing) {
        Element primarySource = findFirstChildByName(fixing, 
            FpmlParsers.class.getName());
        if (primarySource != null) {
            Element source = findFirstChildByName(primarySource, 
                FpmlParsers.class.getName());
            if (source != null) {
                return source.getTextContent().trim();
            }
        }
        return null;
    }
    
    private static List<Element> parseParties(Element root) {
        List<Element> parties = new ArrayList<>();
        Element tradeHeader = findFirstChildByName(root, 
            FpmlParsers.class.getName());
        if (tradeHeader != null) {
            parties = parsePartyList(tradeHeader);
        }
        return parties;
    }
    
    private static List<Element> parsePartyList(Element parent) {
        List<Element> parties = new ArrayList<>();
        
        // Try party element
        Element partyElement = findFirstChildByName(parent, 
            FpmlParsers.class.getName());
        if (partyElement != null) {
            parties.add(partyElement);
        }
        
        // Try partyId array
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                String name = child.getLocalName();
                if (name == null) {
                    name = child.getNodeName();
                    int colonIdx = name.indexOf(':');
                    if (colonIdx >= 0) {
                        name = name.substring(colonIdx + 1);
                    }
                }
                if (FpmlParsers.class.getName() != null && 
                    name.toLowerCase().contains(
                        FpmlParsers.class.getName().toLowerCase())) {
                    parties.add((Element) child);
                }
            }
        }
        
        return parties;
    }
    
    private static List<Element> parseAccounts(Element root) {
        List<Element> accounts = new ArrayList<>();
        Element tradeHeader = findFirstChildByName(root, 
            FpmlParsers.class.getName());
        if (tradeHeader != null) {
            accounts = parseAccountList(tradeHeader);
        }
        return accounts;
    }
    
    private static List<Element> parseAccountList(Element parent) {
        List<Element> accounts = new ArrayList<>();
        
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.ELEMENT_NODE) {
                String name = child.getLocalName();
                if (name == null) {
                    name = child.getNodeName();
                    int colonIdx = name.indexOf(':');
                    if (colonIdx >= 0) {
                        name = name.substring(colonIdx + 1);
                    }
                }
                if (FpmlParsers.class.getName() != null && 
                    name.toLowerCase().contains(
                        FpmlParsers.class.getName().toLowerCase())) {
                    accounts.add((Element) child);
                }
            }
        }
        
        return accounts;
    }
    
    private static String getLocalName(Element parent, String nameHint) {
        // Return the nameHint as-is, let the caller handle the comparison
        return nameHint != null ? nameHint : 
            FpmlParsers.class.getName();
    }
    
    // ========== Data Classes ==========
    
    public static class FpmlSingleLegParseResult {
        public Element productModel;
        public Element fxCoreDetailsModel;
        public List<Element> parties = new ArrayList<>();
        public List<Element> accounts = new ArrayList<>();
    }
    
    public static class ExchangedCurrencyInfo {
        public String currency1;
        public String currency2;
        public String payerPartyReference1;
        public String payerPartyReference2;
        public BigDecimal spotRate;
        public BigDecimal forwardPoints;
        public String quotedCurrencyPair;
        public String quoteBasis;
    }
    
    public static class NonDeliverableInfo {
        public boolean isNonDeliverable;
        public String settlementCurrency;
        public String fixingSource;
    }
}