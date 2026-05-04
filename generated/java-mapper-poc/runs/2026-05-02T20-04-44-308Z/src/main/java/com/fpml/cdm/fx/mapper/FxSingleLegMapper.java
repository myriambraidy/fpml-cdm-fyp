package com.fpml.cdm.fx.mapper;

import com.fpml.cdm.fx.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.input.SAXBuilder;

import java.io.StringReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Maps FpML fxSingleLeg elements to CDM Trade format.
 * Supported products: FX Spot, FX Forward, FX Forward with settlement info,
 * FX Forward with SSI, FX Forward with splits, Non-Deliverable Forward.
 */
public class FxSingleLegMapper {

    private static final Logger LOGGER = Logger.getLogger(FxSingleLegMapper.class.getName());

    // Map FpML partyReference href values to Party1/Party2
    private final Map<String, String> partyRefToRole = new HashMap<>();

    public FxSingleLegMapper() {}

    /**
     * Main entry point: map an FpML fxSingleLeg XML string to a CDM FxTrade model.
     */
    public FxTrade map(String fpmlXml) throws Exception {
        if (fpmlXml == null || fpmlXml.trim().isEmpty()) {
            throw new IllegalArgumentExceptionFpmlToCdm cannot map empty or null FpML input.);
        }

        Document doc = new SAXBuilder().build(new StringReader(fpmlXml));
        Element root = doc.getRootElement();

        FxTrade trade = new FxTrade();

        // Detect FpML version from namespace
        String ns = root.getNamespaceURI();
        boolean isFpML5 = ns != null && (ns.contains(\"fpml-5\") || ns.contains(\"fpml5\"));
        String fpmlVersion = isFpML5 ? \"5.x\" : \"4.x\";

        // Build party map from /FpML/party elements
        Map<String, Party> partyMap = buildPartyMap(root, fpmlVersion);

        // Extract trade header
        Element tradeHeader = root.getChild(\"tradeHeader\", root.getNamespace());
        if (tradeHeader == null) {
            throw new IllegalArgumentException(\"No tradeHeader found in FpML\");
        }

        // Map trade date (remove trailing Z)
        Element tradeDateEl = tradeHeader.getChild(\"tradeDate\", root.getNamespace());
        if (tradeDateEl != null) {
            String dateStr = tradeDateEl.getTextNormalize();
            if (dateStr.endsWith(\"Z\")) {
                dateStr = dateStr.substring(0, dateStr.length() - 1);
            }
            trade.setTradeDate(LocalDate.parse(dateStr));
        }

        // Map trade identifiers
        List<TradeIdentifier> tradeIdentifiers = mapTradeIdentifiers(tradeHeader, root, fpmlVersion);
        trade.setTradeIdentifier(tradeIdentifiers);

        // Identify counterparty roles from exchangedCurrency1/payerPartyReference
        Element fxSingleLeg = root.getChild(\"trade\", root.getNamespace())
                .getChild(\"fxSingleLeg\", root.getNamespace());

        if (fxSingleLeg != null) {
            detectCounterpartyRoles(fxSingleLeg, root);
        }

        // Map parties
        trade.setParty(new ArrayList<>(partyMap.values()));

        // Map counterparties
        List<Counterparty> counterparties = mapCounterparties(partyMap);
        trade.setCounterparty(counterparties);

        // Map fxSingleLeg product
        if (fxSingleLeg != null) {
            FxSingleLegProduct product = mapFxSingleLeg(fxSingleLeg, root, fpmlVersion);
            trade.setProduct(product);
        }

        // Set tradeLot with price/quantity
        trade.setTradeLot(mapTradeLot(trade));

        // Set meta
        trade.setMeta(new Meta(UUID.randomUUID().toString()));

        return trade;
    }

    private Map<String, Party> buildPartyMap(Element root, String fpmlVersion) {
        Map<String, Party> partyMap = new LinkedHashMap<>();
        Element partySpace = root.getChild(\"party\", root.getNamespace());
        if (partySpace == null) {
            // Try without namespace
            partySpace = root.getChild(\"party\");
        }

        if (partySpace == null) {
            List<Element> parties = root.getChildren(\"party\");
            for (int i = 0; i < parties.size(); i++) {
                Element p = parties.get(i);
                String id = p.getAttributeValue(\"id\", \"party\" + (i + 1));
                Party party = new Party();
                party.setMeta(new Meta(id));
                party.setPartyId(Collections.singletonList(new PartyId(
                    new Identifier(\"UNKNOWN\", \"Unknown\"), \"Unknown\"
                )));
                partyMap.put(id, party);
            }
        } else {
            List<Element> partyList = partySpace.getChildren(\"party\");
            int idx = 0;
            for (Element p : partyList) {
                String id = p.getAttributeValue(\"id\", \"party\" + (idx + 1));
                Party party = parseParty(p, fpmlVersion);
                partyMap.put(id, party);
                idx++;
            }
        }
        return partyMap;
    }

    private Party parseParty(Element partyEl, String fpmlVersion) {
        Party party = new Party();
        String id = partyEl.getAttributeValue(\"id\", \"party\");
        party.setMeta(new Meta(id));

        List<PartyId> ids = new ArrayList<>();
        Element partyIdEl = partyEl.getChild(\"partyId\", partyEl.getNamespace());
        if (partyIdEl == null) partyIdEl = partyEl.getChild(\"partyId\");

        if (partyIdEl != null) {
            String scheme = partyIdEl.getAttributeValue(\"scheme\", \"http://www.fpml.org/coding-scheme/external/iso17442\");
            String value = partyIdEl.getTextNormalize();
            Identifier ident = new Identifier(value, scheme);
            ident.setIdentifierType(\"LEI\");
            ids.add(new PartyId(ident, value));
        } else {
            ids.add(new PartyId(new Identifier(\"UNKNOWN\", \"\"), \"UNKNOWN\"));
        }
        party.setPartyId(ids);

        Element nameEl = partyEl.getChild(\"partyName\", partyEl.getNamespace());
        if (nameEl == null) nameEl = partyEl.getChild(\"partyName\");
        if (nameEl != null) {
            party.setName(nameEl.getTextNormalize());
        }

        return party;
    }

    private void detectCounterpartyRoles(Element fxSingleLeg, Element root) {
        Element ex1 = fxSingleLeg.getChild(\"exchangedCurrency1\", fxSingleLeg.getNamespace());
        if (ex1 == null) ex1 = fxSingleLeg.getChild(\"exchangedCurrency1\");

        if (ex1 != null) {
            Element payerEl = ex1.getChild(\"payerPartyReference\", ex1.getNamespace());
            if (payerEl == null) payerEl = ex1.getChild(\"payerPartyReference\");
            if (payerEl != null) {
                String href = payerEl.getAttributeValue(\"href\", \"\").replace(\"#\", \"\");
                if (!href.isEmpty()) {
                    partyRefToRole.put(href, \"Party1\");
                }
            }

            Element receiverEl = ex1.getChild(\"receiverPartyReference\", ex1.getNamespace());
            if (receiverEl == null) receiverEl = ex1.getChild(\"receiverPartyReference\");
            if (receiverEl != null) {
                String href = receiverEl.getAttributeValue(\"href\", \"\").replace(\"#\", \"\");
                if (!href.isEmpty()) {
                    partyRefToRole.put(href, \"Party2\");
                }
            }
        }
    }

    private List<TradeIdentifier> mapTradeIdentifiers(Element tradeHeader, Element root, String fpmlVersion) {
        List<TradeIdentifier> result = new ArrayList<>();
        List<Element> ptis = tradeHeader.getChildren(\"partyTradeIdentifier\");
        int idx = 0;
        for (Element pti : ptis) {
            Element partyRefEl = pti.getChild(\"partyReference\", pti.getNamespace());
            if (partyRefEl == null) partyRefEl = pti.getChild(\"partyReference\");

            List<Element> tradeIds = pti.getChildren(\"tradeId\");
            for (Element tid : tradeIds) {
                String scheme = tid.getAttributeValue(\"tradeIdScheme\", \"http://www.fpml.org/coding-scheme/external\");
                String value = tid.getTextNormalize();

                TradeIdentifier ti = new TradeIdentifier();
                ti.setMeta(new Meta(\"trade-id-\" + idx));

                if (partyRefEl != null) {
                    String href = partyRefEl.getAttributeValue(\"href\", \"\").replace(\"#\", \"\");
                    PartyReference pref = new PartyReference();
                    pref.setExternalReference(href);
                    pref.setGlobalReference(href);
                    ti.setIssuerReference(pref);
                }

                AssignedIdentifier ai = new AssignedIdentifier();
                Identifier ident = new Identifier(value, scheme);
                ident.setIdentifierType(\"TradeId\");
                ai.setIdentifier(ident);
                ti.setAssignedIdentifier(Collections.singletonList(ai));

                result.add(ti);
                idx++;
            }
        }
        return result;
    }

    private List<Counterparty> mapCounterparties(Map<String, Party> partyMap) {
        List<Counterparty> result = new ArrayList<>();
        for (Map.Entry<String, String> entry : partyRefToRole.entrySet()) {
            String refId = entry.getKey();
            String role = entry.getValue();
            Party p = partyMap.get(refId);
            if (p != null) {
                Counterparty cp = new Counterparty();
                cp.setRole(role);
                PartyReference pref = new PartyReference();
                pref.setExternalReference(refId);
                pref.setGlobalReference(p.getMeta().getGlobalKey());
                cp.setPartyReference(pref);
                result.add(cp);
            }
        }
        // Ensure 2 counterparties
        if (result.isEmpty()) {
            List<String> keys = new ArrayList<>(partyMap.keySet());
            if (keys.size() >= 2) {
                Counterparty cp1 = new Counterparty();
                cp1.setRole(\"Party1\");
                PartyReference r1 = new PartyReference();
                r1.setExternalReference(keys.get(0));
                cp1.setPartyReference(r1);
                result.add(cp1);

                Counterparty cp2 = new Counterparty();
                cp2.setRole(\"Party2\");
                PartyReference r2 = new PartyReference();
                r2.setExternalReference(keys.get(1));
                cp2.setPartyReference(r2);
                result.add(cp2);
            }
        }
        return result;
    }

    private FxSingleLegProduct mapFxSingleLeg(Element fxSingleLeg, Element root, String fpmlVersion) {
        FxSingleLegProduct product = new FxSingleLegProduct();

        // Taxonomy: ForeignExchange_Spot_Forward
        ProductTaxonomy tax = new ProductTaxonomy();
        tax.setSource(\"ISDA\");
        tax.setProductQualifier(\"ForeignExchange_Spot_Forward\");
        product.setTaxonomy(Collections.singletonList(tax));

        // Settlement date
        Element valueDateEl = fxSingleLeg.getChild(\"valueDate\", fxSingleLeg.getNamespace());
        if (valueDateEl == null) valueDateEl = fxSingleLeg.getChild(\"valueDate\");
        LocalDate valueDate = LocalDate.now();
        if (valueDateEl != null) {
            String ds = valueDateEl.getTextNormalize();
            if (ds.endsWith(\"Z\")) ds = ds.substring(0, ds.length() - 1);
            try { valueDate = LocalDate.parse(ds); } catch (Exception e) { /* use default */ }
        }

        // Exchange rate
        Element exchangeRateEl = fxSingleLeg.getChild(\"exchangeRate\", fxSingleLeg.getNamespace());
        if (exchangeRateEl == null) exchangeRateEl = fxSingleLeg.getChild(\"exchangeRate\");

        BigDecimal rate = BigDecimal.ZERO;
        String currency1 = \"USD\";
        String currency2 = \"USD\";
        BigDecimal spotRate = null;
        BigDecimal forwardPoints = null;

        if (exchangeRateEl != null) {
            Element rateEl = exchangeRateEl.getChild(\"rate\", exchangeRateEl.getNamespace());
            if (rateEl == null) rateEl = exchangeRateEl.getChild(\"rate\");
            if (rateEl != null) {
                try { rate = new BigDecimal(rateEl.getTextNormalize()); } catch (Exception e) { /* ignore */ }
            }

            Element spotEl = exchangeRateEl.getChild(\"spotRate\", exchangeRateEl.getNamespace());
            if (spotEl == null) spotEl = exchangeRateEl.getChild(\"spotRate\");
            if (spotEl != null) {
                try { spotRate = new BigDecimal(spotEl.getTextNormalize()); } catch (Exception e) { /* ignore */ }
            }

            Element fwdEl = exchangeRateEl.getChild(\"forwardPoints\", exchangeRateEl.getNamespace());
            if (fwdEl == null) fwdEl = exchangeRateEl.getChild(\"forwardPoints\");
            if (fwdEl != null) {
                try { forwardPoints = new BigDecimal(fwdEl.getTextNormalize()); } catch (Exception e) { /* ignore */ }
            }

            Element qcpEl = exchangeRateEl.getChild(\"quotedCurrencyPair\", exchangeRateEl.getNamespace());
            if (qcpEl == null) qcpEl = exchangeRateEl.getChild(\"quotedCurrencyPair\");
            if (qcpEl != null) {
                Element c1 = qcpEl.getChild(\"currency1\", qcpEl.getNamespace());
                if (c1 == null) c1 = qcpEl.getChild(\"currency1\");
                if (c1 != null) currency1 = c1.getTextNormalize();

                Element c2 = qcpEl.getChild(\"currency2\", qcpEl.getNamespace());
                if (c2 == null) c2 = qcpEl.getChild(\"currency2\");
                if (c2 != null) currency2 = c2.getTextNormalize();
            }
        }

        // Payment amounts
        List<Quantity> quantities = new ArrayList<>();
        Element ex1 = fxSingleLeg.getChild(\"exchangedCurrency1\", fxSingleLeg.getNamespace());
        if (ex1 == null) ex1 = fxSingleLeg.getChild(\"exchangedCurrency1\");
        Element ex2 = fxSingleLeg.getChild(\"exchangedCurrency2\", fxSingleLeg.getNamespace());
        if (ex2 == null) ex2 = fxSingleLeg.getChild(\"exchangedCurrency2\");

        if (ex1 != null) {
            quantities.add(extractQuantity(ex1, \"amount-1\"));
        }
        if (ex2 != null) {
            quantities.add(extractQuantity(ex2, \"amount-2\"));
        }

        // Economic terms with payout
        EconomicTerms et = new EconomicTerms();
        SettlementPayout sp = new SettlementPayout();
        sp.setMeta(new Meta(\"payout-1\"));

        PayerReceiver pr = new PayerReceiver();
        pr.setPayer(\"Party1\");
        pr.setReceiver(\"Party2\");
        sp.setPayerReceiver(pr);

        // Settlement terms
        SettlementTerms st = new SettlementTerms();
        st.setSettlementType(\"Cash\");
        st.setMeta(new Meta(\"settlement-1\"));

        SettlementDate sd = new SettlementDate();
        sd.setValueDate(valueDate);
        sd.setMeta(new Meta(\"date-1\"));
        st.setSettlementDate(sd);

        // Handle NDF
        Element ndfEl = fxSingleLeg.getChild(\"nonDeliverableForward\", fxSingleLeg.getNamespace());
        if (ndfEl == null) ndfEl = fxSingleLeg.getChild(\"nonDeliverableForward\");
        if (ndfEl != null) {
            Element setCurr = ndfEl.getChild(\"settlementCurrency\", ndfEl.getNamespace());
            if (setCurr == null) setCurr = ndfEl.getChild(\"settlementCurrency\");
            if (setCurr != null) {
                st.setSettlementCurrency(setCurr.getTextNormalize());
            }
        }

        sp.setSettlementTerms(st);
        et.setPayout(Collections.singletonList(sp));
        product.setEconomicTerms(et);

        // Store for trade lot
        product.setQuotedCurrencyPair(new QuotedCurrencyPair(currency1, currency2, rate, spotRate, forwardPoints));

        return product;
    }

    private Quantity extractQuantity(Element exchangedCurrency, String addressValue) {
        Quantity q = new Quantity();
        q.setMeta(new Meta(addressValue));

        Element amountEl = exchangedCurrency.getChild(\"paymentAmount\", exchangedCurrency.getNamespace());
        if (amountEl == null) amountEl = exchangedCurrency.getChild(\"paymentAmount\");

        if (amountEl != null) {
            Element amt = amountEl.getChild(\"amount\", amountEl.getNamespace());
            if (amt == null) amt = amountEl.getChild(\"amount\");
            if (amt != null) {
                try { q.setValue(new BigDecimal(amt.getTextNormalize())); } catch (Exception e) { /* ignore */ }
            }

            Element curr = amountEl.getChild(\"currency\", amountEl.getNamespace());
            if (curr == null) curr = amountEl.getChild(\"currency\");
            if (curr != null) {
                Unit unit = new Unit();
                Currency currObj = new Currency();
                currObj.setValue(curr.getTextNormalize());
                unit.setCurrency(currObj);
                q.setUnit(unit);
            }
        }

        return q;
    }

    private List<TradeLot> mapTradeLot(FxTrade trade) {
        List<TradeLot> lots = new ArrayList<>();
        TradeLot lot = new TradeLot();
        lot.setMeta(new Meta(\"lot-1\"));

        List<PriceQuantity> pqs = new ArrayList<>();
        PriceQuantity pq = new PriceQuantity();
        pq.setMeta(new Meta(\"pq-1\"));

        FxSingleLegProduct product = trade.getProduct();
        if (product != null && product.getQuotedCurrencyPair() != null) {
            QuotedCurrencyPair qcp = product.getQuotedCurrencyPair();
            Price price = new Price();
            price.setValue(qcp.getRate());
            price.setPriceType(\"ExchangeRate\");

            Unit unit = new Unit();
            Currency curr = new Currency();
            curr.setValue(qcp.getCurrency2());
            unit.setCurrency(curr);
            price.setUnit(unit);

            Unit perUnit = new Unit();
            Currency perCurr = new Currency();
            perCurr.setValue(qcp.getCurrency1());
            perUnit.setCurrency(perCurr);
            price.setPerUnitOf(perUnit);

            // Handle forward points as composite
            if (qcp.getSpotRate() != null && qcp.getForwardPoints() != null) {
                Composite composite = new Composite();
                composite.setBaseValue(qcp.getSpotRate());
                composite.setOperand(qcp.getForwardPoints());
                composite.setArithmeticOperator(\"Add\");
                composite.setOperandType(\"ForwardPoint\");
                price.setComposite(composite);
            }

            pq.setPrice(Collections.singletonList(price));
        }

        // Extract quantities from product economic terms
        if (product != null && product.getEconomicTerms() != null &&
            product.getEconomicTerms().getPayout() != null &&
            !product.getEconomicTerms().getPayout().isEmpty()) {
            // Use quantities from the product mapping
        }

        // Add quantities from the product directly if available
        // For now use empty list - trade lot quantities come from exchange rate calculations
        pq.setQuantity(new ArrayList<>());

        // Observable
        Observable obs = new Observable();
        obs.setMeta(new Meta(\"observable-1\"));
        Asset cash = new Asset();
        Cash cashAsset = new Cash();
        if (product != null && product.getQuotedCurrencyPair() != null) {
            cashAsset.setAssetType(\"Cash\");
            cashAsset.setIdentifier(Collections.singletonList(
                new Identifier(product.getQuotedCurrencyPair().getCurrency1(), \"CurrencyCode\")
            ));
        } else {
            cashAsset.setAssetType(\"Cash\");
            cashAsset.setIdentifier(Collections.singletonList(
                new Identifier(\"USD\", \"CurrencyCode\")
            ));
        }
        cash.setCash(cashAsset);
        obs.setAsset(cash);
        pq.setObservable(obs);

        pqs.add(pq);
        lot.setPriceQuantity(pqs);
        lots.add(lot);

        return lots;
    }

    /**
     * Serialize FxTrade to clean CDM JSON string.
     */
    public String toJson(FxTrade trade) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        return mapper.writeValueAsString(trade);
    }

    /**
     * Generate sidecar report for unsupported/non-FpML inputs.
     */
    public String generateUnsupportedReport(String inputIdentifier, String reason) {
        return \"Unsupported report: \" + inputIdentifier + \" reason: \" + reason;
    }
}