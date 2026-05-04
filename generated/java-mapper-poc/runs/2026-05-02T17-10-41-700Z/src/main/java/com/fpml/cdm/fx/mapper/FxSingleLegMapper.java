package com.fpml.cdm.fx.mapper;

import com.fpml.cdm.fx.model.*;
import com.fpml.cdm.fx.util.PartyResolver;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.w3c.dom.*;

import javax.xml.parsers.*;
import java.io.*;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;

/**
 * Maps FpML fxSingleLeg trades to CDM JSON.
 * Implements cookbook rules RULE-001 (trade identifiers), RULE-002 (date normalization),
 * RULE-005 (payment amounts to CDM quantities).
 */
public class FxSingleLegMapper {

    private static final String FX_SINGLE_LEG_ROOT = "fxSingleLeg";
    private static final String TRADE_ROOT = "trade";

    private final ObjectMapper objectMapper;

    public FxSingleLegMapper() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }

    /**
     * Maps an FpML XML file to a CDM trade JSON string.
     * Returns null if the file does not contain an fxSingleLeg root.
     */
    public String mapToCdm(String fpmlXmlContent, List<String> validationErrors) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(fpmlXmlContent.getBytes()));

            NodeList fxSingleLegNodes = doc.getElementsByTagName(FX_SINGLE_LEG_ROOT);
            if (fxSingleLegNodes.getLength() == 0) {
                return null;
            }
            Element fxSingleLeg = (Element) fxSingleLegNodes.item(0);

            CdmTrade cdmTrade = buildCdmTrade(doc, fxSingleLeg);
            return objectMapper.writeValueAsString(cdmTrade);
        } catch (Exception e) {
            validationErrors.add("FX_SingleLeg parse error: " + e.getMessage());
            return null;
        }
    }

    private CdmTrade buildCdmTrade(Document doc, Element fxSingleLeg) throws DOMException {
        CdmTrade trade = new CdmTrade();


        // Trade date
        trade.setTradeDate(extractTradeDate(doc));


        // Trade identifiers
        trade.setTradeIdentifier(extractTradeIdentifiers(doc));

        // Parties
        trade.setParty(extractParties(doc));


        // Counterparties
        trade.setCounterparty(extractCounterparties(doc, fxSingleLeg));

        // Product
        trade.setProduct(buildProduct(fxSingleLeg));

        // Trade lot (price/quantity)
        trade.setTradeLot(extractTradeLot(fxSingleLeg));


        // Meta
        trade.setMeta(generateMeta());

        return trade;
    }


    private String extractTradeDate(Document doc) {
        NodeList tradeDateNodes = doc.getElementsByTagName("tradeDate");
        if (tradeDateNodes.getLength() > 0) {
            String date = tradeDateNodes.item(0).getTextContent().trim();
            // RULE-002: trim trailing 'Z'
            if (date.endsWith("Z")) {
                date = date.substring(0, date.length() - 1);
            }
            return date;
        }
        return null;
    }

    private List<CdmTradeIdentifier> extractTradeIdentifiers(Document doc) {
        List<CdmTradeIdentifier> identifiers = new ArrayList<>();
        NodeList partyTradeIdNodes = doc.getElementsByTagName("partyTradeIdentifier");
        for (int i = 0; i < partyTradeIdNodes.getLength(); i++) {
            Element pti = (Element) partyTradeIdNodes.item(i);
            NodeList tradeIdNodes = pti.getElementsByTagName("tradeId");
            for (int j = 0; j < tradeIdNodes.getLength(); j++) {
                String value = tradeIdNodes.item(j).getTextContent().trim();
                CdmTradeIdentifier id = new CdmTradeIdentifier();
                id.addAssignedIdentifier(new CdmAssignedIdentifier(value));
                identifiers.add(id);
            }
        }
        return identifiers;
    }


    private List<CdmParty> extractParties(Document doc) {
        List<CdmParty> parties = new ArrayList<>();
        NodeList partyNodes = doc.getElementsByTagName("party");
        for (int i = 0; i < partyNodes.getLength(); i++) {
            Element partyEl = (Element) partyNodes.item(i);
            NodeList partyIdNodes = partyEl.getElementsByTagName("partyId");
            CdmParty party = new CdmParty();
            for (int j = 0; j < partyIdNodes.getLength(); j++) {
                String idValue = partyIdNodes.item(j).getTextContent().trim();
                CdmPartyId pid = new CdmPartyId(idValue, "LEI", "http://www.fpml.org/coding-scheme/external/iso17442");
                party.addPartyId(pid);
            }
            parties.add(party);
        }
        return parties;
    }

    private List<CdmCounterparty> extractCounterparties(Document doc, Element fxSingleLeg) {
        List<CdmCounterparty> counterparties = new ArrayList<>();

        // Determine Party1 from exchangedCurrency1 receiver
        NodeList receiverNodes = fxSingleLeg.getElementsByTagName("receiverPartyReference");
        if (receiverNodes.getLength() > 0) {
            String party1Ref = receiverNodes.item(0).getTextContent().trim();
            CdmCounterparty cp1 = new CdmCounterparty("Party1", party1Ref);
            counterparties.add(cp1);
        }

        // Determine Party2 from exchangedCurrency1 payer
        NodeList payerNodes = fxSingleLeg.getElementsByTagName("payerPartyReference");
        if (payerNodes.getLength() > 0) {
            String party2Ref = payerNodes.item(0).getTextContent().trim();
            CdmCounterparty cp2 = new CdmCounterparty("Party2", party2Ref);
            counterparties.add(cp2);
        }

        return counterparties;
    }

    private CdmProduct buildProduct(Element fxSingleLeg) {
        CdmProduct product = new CdmProduct();

        // Taxonomy
        CdmTaxonomy tax = new CdmTaxonomy();
        tax.setSource("ISDA");
        tax.setProductQualifier("ForeignExchange_Spot_Forward");
        product.addTaxonomy(tax);

        // Economic terms
        CdmEconomicTerms et = new CdmEconomicTerms();
        et.addPayout(buildSettlementPayout(fxSingleLeg));
        product.setEconomicTerms(et);

        return product;
    }

    private CdmSettlementPayout buildSettlementPayout(Element fxSingleLeg) {
        CdmSettlementPayout payout = new CdmSettlementPayout();

        // Payer/Receiver - derived from exchangedCurrency1
        NodeList exchangedCurr1Nodes = fxSingleLeg.getElementsByTagName("exchangedCurrency1");
        if (exchangedCurr1Nodes.getLength() > 0) {
            Element ec1 = (Element) exchangedCurr1Nodes.item(0);
            String payer = ec1.getElementsByTagName("payerPartyReference").item(0).getTextContent().trim();
            String receiver = ec1.getElementsByTagName("receiverPartyReference").item(0).getTextContent().trim();
            payout.setPayerReceiver(new CdmPayerReceiver(
                PartyResolver.resolvePartyRole(payer),
                PartyResolver.resolvePartyRole(receiver)
            ));
        }

        // Settlement terms
        CdmSettlementTerms st = new CdmSettlementTerms();
        st.setSettlementType("Cash");

        // Value date
        NodeList valueDateNodes = fxSingleLeg.getElementsByTagName("valueDate");
        if (valueDateNodes.getLength() > 0) {
            String vd = valueDateNodes.item(0).getTextContent().trim();
            if (vd.endsWith("Z")) vd = vd.substring(0, vd.length() - 1);
            st.setValueDate(vd);
        }
        payout.setSettlementTerms(st);

        return payout;
    }

    private List<CdmTradeLot> extractTradeLot(Element fxSingleLeg) {
        List<CdmTradeLot> lots = new ArrayList<>();
        CdmTradeLot lot = new CdmTradeLot();

        List<CdmPriceQuantity> pqs = new ArrayList<>();

        // Extract both exchanged currencies as quantities
        NodeList ec1Nodes = fxSingleLeg.getElementsByTagName("exchangedCurrency1");
        NodeList ec2Nodes = fxSingleLeg.getElementsByTagName("exchangedCurrency2");

        if (ec1Nodes.getLength() > 0) {
            Element ec1 = (Element) ec1Nodes.item(0);
            pqs.add(extractCurrencyQuantity(ec1, "quantity-1"));
        }
        if (ec2Nodes.getLength() > 0) {
            Element ec2 = (Element) ec2Nodes.item(0);
            pqs.add(extractCurrencyQuantity(ec2, "quantity-2"));
        }

        // Extract exchange rate as price
        NodeList rateNodes = fxSingleLeg.getElementsByTagName("rate");
        if (rateNodes.getLength() > 0) {
            BigDecimal rate = new BigDecimal(rateNodes.item(0).getTextContent().trim());

            // Determine currencies from quotedCurrencyPair
            NodeList qcpNodes = fxSingleLeg.getElementsByTagName("quotedCurrencyPair");
            if (qcpNodes.getLength() > 0) {
                Element qcp = (Element) qcpNodes.item(0);
                String currency1 = qcp.getElementsByTagName("currency1").item(0).getTextContent().trim();
                String currency2 = qcp.getElementsByTagName("currency2").item(0).getTextContent().trim();

                CdmPrice price = new CdmPrice();
                price.setValue(rate);
                price.setUnitCurrency(currency2);
                price.setPerUnitOfCurrency(currency1);
                price.setPriceType("ExchangeRate");

                CdmPriceQuantity pq = new CdmPriceQuantity();
                pq.addPrice(price);
                pqs.add(pq);
            }
        }

        lot.setPriceQuantity(pqs);
        lots.add(lot);
        return lots;
    }

    private CdmPriceQuantity extractCurrencyQuantity(Element exchangedCurrency, String quantityRef) {
        CdmPriceQuantity pq = new CdmPriceQuantity();

        String currency = exchangedCurrency.getElementsByTagName("currency").item(0).getTextContent().trim();
        BigDecimal amount = new BigDecimal(
            exchangedCurrency.getElementsByTagName("amount").item(0).getTextContent().trim()
        );

        CdmQuantity qty = new CdmQuantity();
        qty.setValue(amount);
        qty.setUnitCurrency(currency);

        pq.addQuantity(qty);
        return pq;
    }

    private Map<String, String> generateMeta() {
        Map<String, String> meta = new LinkedHashMap<>();
        meta.put("globalKey", UUID.randomUUID().toString().replace("-", "").substring(0, 8));
        return meta;
    }
}