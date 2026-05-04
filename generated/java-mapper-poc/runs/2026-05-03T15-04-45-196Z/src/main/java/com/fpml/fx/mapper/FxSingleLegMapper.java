package com.fpml.fx.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

/**
 * Main mapper for FpML FX Single Leg products.
 * Maps fxSingleLeg root elements to CDM JSON output.
 *
 * Evidence: MapFxSingleLegNonTransferableProduct, MapFxSingleLegEconomicTerms,
 * MapFxSingleLegCounterpartyList, MapFxCoreDetailsModelToSettlementPayout,
 * fx-derivatives:RULE-001, fx-derivatives:RULE-002, fx-derivatives:RULE-005
 */
public class FxSingleLegMapper {

    private final PartyResolver partyResolver;
    private final TradeIdentifierMapper tradeIdMapper;
    private final DateTimeMapper dateTimeMapper;
    private final NdfMapper ndfMapper;
    private final CdmNodeFactory nodeFactory;

    public FxSingleLegMapper() {
        this.partyResolver = new PartyResolver();
        this.tradeIdMapper = new TradeIdentifierMapper();
        this.dateTimeMapper = new DateTimeMapper();
        this.ndfMapper = new NdfMapper();
        this.nodeFactory = new CdmNodeFactory();
    }

    /**
     * Maps an FpML FX Single Leg XML file to CDM JSON.
     *
     * @param fpmlFilePath Path to the FpML XML file
     * @return ObjectNode representing the CDM trade
     */
    public ObjectNode map(String fpmlFilePath) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(Files.newInputStream(Paths.get(fpmlFilePath)));

        ObjectNode rootNode = nodeFactory.createObject();

        // Build meta
        ObjectNode meta = nodeFactory.createObject();
        meta.put(globalKey, nodeFactory.generateGlobalKey());
        rootNode.set(metaKey, meta);

        // Build trade wrapper
        ObjectNode tradeNode = nodeFactory.createObject();
        tradeNode.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        // Map parties
        mapParties(doc, tradeNode);

        // Map trade identifiers
        tradeIdMapper.mapTradeIdentifiers(doc, tradeNode);

        // Map trade date
        mapTradeDate(doc, tradeNode);

        // Map product (fxSingleLeg)
        Element fxSingleLeg = findFxSingleLeg(doc);
        if (fxSingleLeg == null) {
            throw new IllegalArgumentException(
                UnsupportedReport.forUnknownProduct(
                    fpmlFilePath,
                    null,
                    null,
                    new String[]{
                        MapFxSingleLegNonTransferableProduct.class.getSimpleName(),
                        MapFxSingleLegEconomicTerms.class.getSimpleName()
                    }
                ).toString()
            );
        }

        mapFxSingleLegProduct(fxSingleLeg, tradeNode, fpmlFilePath);

        rootNode.set(tradeKey, tradeNode);
        return rootNode;
    }

    private void mapParties(Document doc, ObjectNode tradeNode) {
        ArrayNode parties = nodeFactory.createArray();
        NodeList partyList = doc.getElementsByTagName(partyTag);
        Map<String, String> partyIdMap = partyResolver.resolvePartyIds(doc, partyList);

        int idx = 0;
        for (Map.Entry<String, String> entry : partyIdMap.entrySet()) {
            ObjectNode party = nodeFactory.createObject();
            String partyKey = nodeFactory.generateGlobalKey();
            party.put(metaKey, nodeFactory.createMeta(partyKey));
            party.put(externalRefKey, entry.getKey());

            ArrayNode partyIdArray = nodeFactory.createArray();
            ObjectNode partyId = nodeFactory.createObject();
            ObjectNode identifier = nodeFactory.createObject();
            identifier.put(valueKey, entry.getValue());
            identifier.put(schemeKey, leiScheme);
            identifier.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));
            partyId.set(identifierTag, identifier);
            partyId.put(typeKey, leiLabel);
            partyIdArray.add(partyId);
            party.set(partyIdTag, partyIdArray);
            parties.add(party);
            idx++;
        }
        tradeNode.set(partyKey, parties);
    }

    private void mapTradeIdentifiers(Element fpmlRoot, ObjectNode tradeNode) {
        tradeIdMapper.mapTradeIdentifiers(fpmlRoot, tradeNode);
    }

    private void mapTradeDate(Document doc, ObjectNode tradeNode) {
        dateTimeMapper.mapTradeDate(doc, tradeNode);
    }

    private void mapFxSingleLegProduct(Element fxSingleLeg, ObjectNode tradeNode, String fpmlFilePath) {
        ObjectNode productNode = nodeFactory.createObject();
        productNode.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        // Product taxonomy: ISDA ForeignExchange_Spot_Forward
        // See: MapFxSingleLegNonTransferableProduct
        ArrayNode taxonomy = nodeFactory.createArray();
        ObjectNode isdaTax = nodeFactory.createObject();
        isdaTax.put(sourceKey, isdaSource);
        isdaTax.put(qualifierKey, spotForwardQualifier);
        taxonomy.add(isdaTax);
        productNode.set(taxonomyKey, taxonomy);

        // Economic terms
        ObjectNode economicTerms = nodeFactory.createObject();
        economicTerms.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        // Settlement date (valueDate)
        String valueDateStr = getElementText(fxSingleLeg, valueDateTag);
        String normalizedDate = dateTimeMapper.normalizeDate(valueDateStr);

        // Exchange rate and currencies
        Element exchangeRate = getChildElement(fxSingleLeg, exchangeRateTag);
        Element quotedPair = getChildElement(exchangeRate, quotedCurrencyPairTag);
        String currency1 = getElementText(quotedPair, currency1Tag);
        String currency2 = getElementText(quotedPair, currency2Tag);
        String quoteBasis = getElementText(quotedPair, quoteBasisTag);
        String rateStr = getElementText(exchangeRate, rateTag);

        // Spot rate and forward points (optional)
        String spotRateStr = getElementText(exchangeRate, spotRateTag);
        String fwdPointsStr = getElementText(exchangeRate, forwardPointsTag);

        // Payment amounts
        Element exchangedCurrency1 = getChildElement(fxSingleLeg, exchangedCurrency1Tag);
        Element exchangedCurrency2 = getChildElement(fxSingleLeg, exchangedCurrency2Tag);

        String amount1Str = getElementText(exchangedCurrency1, paymentAmountTag.replaceAll.*, amountTag));
        String currency1Pay = getElementText(exchangedCurrency1, paymentAmountTag.replaceAll.*, currencyTag));
        String payerRef1 = getElementText(exchangedCurrency1, payerPartyReferenceTag);
        String receiverRef1 = getElementText(exchangedCurrency1, receiverPartyReferenceTag);

        String amount2Str = getElementText(exchangedCurrency2, paymentAmountTag.replaceAll.*, amountTag));
        String currency2Pay = getElementText(exchangedCurrency2, paymentAmountTag.replaceAll.*, currencyTag));
        String payerRef2 = getElementText(exchangedCurrency2, payerPartyReferenceTag);
        String receiverRef2 = getElementText(exchangedCurrency2, receiverPartyReferenceTag);

        // Party role resolution: FpML partyReference -> CDM Party1/Party2
        // See: MapFxSingleLegCounterpartyList
        // Observed inversion: exchangedCurrency1.payerPartyReference=party2 -> CDM payer=Party1
        String payerCdmRole = partyResolver.resolvePayerRole(payerRef1);
        String receiverCdmRole = partyResolver.resolveReceiverRole(receiverRef1);

        // Build payout array
        ArrayNode payouts = nodeFactory.createArray();

        ObjectNode settlementPayout = nodeFactory.createObject();
        settlementPayout.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        // PayerReceiver
        ObjectNode payerReceiver = nodeFactory.createObject();
        payerReceiver.put(payerKey, payerCdmRole);
        payerReceiver.put(receiverKey, receiverCdmRole);
        settlementPayout.set(payerReceiverKey, payerReceiver);

        // Price quantity schedule
        ObjectNode priceQuantity = nodeFactory.createObject();
        priceQuantity.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        // Quantity schedule (address reference for quantity-1)
        ObjectNode quantitySchedule = nodeFactory.createObject();
        ObjectNode quantityAddr = nodeFactory.createObject();
        quantityAddr.put(scopeKey, documentLabel);
        quantityAddr.put(valueKey, quantityLabel + 1);
        quantitySchedule.set(addressKey, quantityAddr);
        priceQuantity.set(quantityScheduleKey, quantitySchedule);

        // Price schedule
        ArrayNode priceScheduleArray = nodeFactory.createArray();
        ObjectNode priceSchedule = nodeFactory.createObject();
        ObjectNode priceAddr = nodeFactory.createObject();
        priceAddr.put(scopeKey, documentLabel);
        priceAddr.put(valueKey, priceLabel + 1);
        priceSchedule.set(addressKey, priceAddr);
        priceScheduleArray.add(priceSchedule);
        priceQuantity.set(priceScheduleKey, priceScheduleArray);

        settlementPayout.set(priceQuantityKey, priceQuantity);

        // Settlement terms
        ObjectNode settlementTerms = nodeFactory.createObject();
        settlementTerms.put(settlementTypeKey, cashLabel);
        settlementTerms.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        // Settlement date
        ObjectNode settlementDate = nodeFactory.createObject();
        settlementDate.put(valueKey, normalizedDate);
        settlementDate.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));
        settlementTerms.set(settlementDateKey, settlementDate);

        // Check for NDF: nonDeliverableForward element
        Element ndfElement = getChildElement(fxSingleLeg, nonDeliverableForwardTag);
        if (ndfElement != null) {
            ndfMapper.applyNdfSettlement(ndfElement, settlementTerms, fpmlFilePath);
        }

        settlementPayout.set(settlementTermsKey, settlementTerms);

        // Underlier (observable reference to currency1)
        ObjectNode underlier = nodeFactory.createObject();
        ObjectNode observableAddr = nodeFactory.createObject();
        observableAddr.put(scopeKey, documentLabel);
        observableAddr.put(valueKey, observableLabel + 1);
        underlier.set(observableKey, observableAddr);
        settlementPayout.set(underlierKey, underlier);

        payouts.add(settlementPayout);
        economicTerms.set(payoutKey, payouts);

        productNode.set(economicTermsKey, economicTerms);
        tradeNode.set(productKey, productNode);

        // Trade lot with price quantity
        ArrayNode tradeLots = nodeFactory.createArray();
        ObjectNode tradeLot = nodeFactory.createObject();
        tradeLot.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        ArrayNode priceQuantityList = nodeFactory.createArray();
        ObjectNode pqEntry = nodeFactory.createObject();
        pqEntry.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));

        // Price (exchange rate)
        ArrayNode priceList = nodeFactory.createArray();
        ObjectNode priceNode = nodeFactory.createObject();
        ObjectNode priceValue = nodeFactory.createObject();
        priceValue.put(valueKey, new BigDecimal(rateStr));
        priceValue.put(priceTypeKey, exchangeRateLabel);

        // Unit: currency2 per currency1
        ObjectNode unit = nodeFactory.createObject();
        ObjectNode currencyUnit = nodeFactory.createObject();
        currencyUnit.put(valueKey, currency2Pay);
        unit.set(currencyKey, currencyUnit);
        priceValue.set(unitKey, unit);

        // Per unit of
        ObjectNode perUnitOf = nodeFactory.createObject();
        ObjectNode perUnitCurrency = nodeFactory.createObject();
        perUnitCurrency.put(valueKey, currency1Pay);
        perUnitOf.set(currencyKey, perUnitCurrency);
        priceValue.set(perUnitOfKey, perUnitOf);

        // Composite (forward points)
        if (spotRateStr != null && fwdPointsStr != null) {
            ObjectNode composite = nodeFactory.createObject();
            composite.put(baseValueKey, new BigDecimal(spotRateStr));
            composite.put(operandKey, new BigDecimal(fwdPointsStr));
            composite.put(arithmeticOpKey, addLabel);
            composite.put(operandTypeKey, forwardPointLabel);
            priceValue.set(compositeKey, composite);
        }

        ObjectNode priceMeta = nodeFactory.createObject();
        ArrayNode priceMetaLoc = nodeFactory.createArray();
        ObjectNode priceLoc = nodeFactory.createObject();
        priceLoc.put(scopeKey, documentLabel);
        priceLoc.put(valueKey, priceLabel + 1);
        priceMetaLoc.add(priceLoc);
        priceMeta.set(locationKey, priceMetaLoc);
        priceNode.set(metaKey, priceMeta);

        priceNode.set(valueKey, priceValue);
        priceList.add(priceNode);
        pqEntry.set(priceKey, priceList);

        // Quantities
        ArrayNode quantityList = nodeFactory.createArray();

        ObjectNode q1 = nodeFactory.createObject();
        ObjectNode q1Value = nodeFactory.createObject();
        q1Value.put(valueKey, new BigDecimal(amount1Str));
        ObjectNode q1Unit = nodeFactory.createObject();
        ObjectNode q1Currency = nodeFactory.createObject();
        q1Currency.put(valueKey, currency1Pay);
        q1Unit.set(currencyKey, q1Currency);
        q1Value.set(unitKey, q1Unit);
        q1.set(valueKey, q1Value);
        ObjectNode q1Meta = nodeFactory.createObject();
        ArrayNode q1MetaLoc = nodeFactory.createArray();
        ObjectNode q1Loc = nodeFactory.createObject();
        q1Loc.put(scopeKey, documentLabel);
        q1Loc.put(valueKey, quantityLabel + 1);
        q1MetaLoc.add(q1Loc);
        q1Meta.set(locationKey, q1MetaLoc);
        q1.set(metaKey, q1Meta);
        quantityList.add(q1);

        ObjectNode q2 = nodeFactory.createObject();
        ObjectNode q2Value = nodeFactory.createObject();
        q2Value.put(valueKey, new BigDecimal(amount2Str));
        ObjectNode q2Unit = nodeFactory.createObject();
        ObjectNode q2Currency = nodeFactory.createObject();
        q2Currency.put(valueKey, currency2Pay);
        q2Unit.set(currencyKey, q2Currency);
        q2Value.set(unitKey, q2Unit);
        q2.set(valueKey, q2Value);
        ObjectNode q2Meta = nodeFactory.createObject();
        ArrayNode q2MetaLoc = nodeFactory.createArray();
        ObjectNode q2Loc = nodeFactory.createObject();
        q2Loc.put(scopeKey, documentLabel);
        q2Loc.put(valueKey, quantityLabel + 2);
        q2MetaLoc.add(q2Loc);
        q2Meta.set(locationKey, q2MetaLoc);
        q2.set(metaKey, q2Meta);
        quantityList.add(q2);

        pqEntry.set(quantityKey, quantityList);

        // Observable (currency1 as Cash asset)
        ObjectNode observable = nodeFactory.createObject();
        ObjectNode cash = nodeFactory.createObject();
        ArrayNode cashIdents = nodeFactory.createArray();
        ObjectNode cashIdent = nodeFactory.createObject();
        cashIdent.put(identifierValueKey, currency1Pay);
        cashIdent.put(identifierTypeKey, currencyCodeLabel);
        cashIdent.put(metaKey, nodeFactory.createMeta(nodeFactory.generateGlobalKey()));
        cashIdents.add(cashIdent);
        cash.set(identifierKey, cashIdents);
        cash.put(assetTypeKey, cashLabel);
        observable.set(valueKey, cash);
        ObjectNode obsMeta = nodeFactory.createObject();
        ArrayNode obsMetaLoc = nodeFactory.createArray();
        ObjectNode obsLoc = nodeFactory.createObject();
        obsLoc.put(scopeKey, documentLabel);
        obsLoc.put(valueKey, observableLabel + 1);
        obsMetaLoc.add(obsLoc);
        obsMeta.set(locationKey, obsMetaLoc);
        observable.set(metaKey, obsMeta);
        pqEntry.set(observableKey, observable);

        priceQuantityList.add(pqEntry);
        tradeLot.set(priceQuantityKey, priceQuantityList);
        tradeLots.add(tradeLot);
        tradeNode.set(tradeLotKey, tradeLots);
    }

    private Element findFxSingleLeg(Document doc) {
        NodeList list = doc.getElementsByTagName(fxSingleLegTag);
        return list.getLength() > 0 ? (Element) list.item(0) : null;
    }

    private Element getChildElement(Element parent, String childName) {
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            if (children.item(i).getNodeType() == Node.ELEMENT_NODE) {
                Element child = (Element) children.item(i);
                if (child.getTagName().equals(childName)) {
                    return child;
                }
            }
        }
        return null;
    }

    private String getElementText(Element parent, String tagName) {
        Element child = getChildElement(parent, tagName);
        if (child == null) {
            NodeList list = parent.getElementsByTagName(tagName);
            if (list.getLength() > 0) {
                return list.item(0).getTextContent();
            }
            return null;
        }
        return child.getTextContent();
    }

    // Constants
    private static final String tradeKey = \"trade\";
    private static final String metaKey = \"meta\";
    private static final String globalKey = \"globalKey\";
    private static final String partyKey = \"party\";
    private static final String externalRefKey = \"externalKey\";
    private static final String partyIdTag = \"partyId\";
    private static final String partyTag = \"party\";
    private static final String identifierTag = \"identifier\";
    private static final String valueKey = \"value\";
    private static final String schemeKey = \"scheme\";
    private static final String typeKey = \"identifierType\";
    private static final String leiScheme = \"http://www.fpml.org/coding-scheme/external/iso17442\";
    private static final String leiLabel = \"LEI\";
    private static final String fxSingleLegTag = \"fxSingleLeg\";
    private static final String valueDateTag = \"valueDate\";
    private static final String exchangeRateTag = \"exchangeRate\";
    private static final String quotedCurrencyPairTag = \"quotedCurrencyPair\";
    private static final String currency1Tag = \"currency1\";
    private static final String currency2Tag = \"currency2\";
    private static final String quoteBasisTag = \"quoteBasis\";
    private static final String rateTag = \"rate\";
    private static final String spotRateTag = \"spotRate\";
    private static final String forwardPointsTag = \"forwardPoints\";
    private static final String exchangedCurrency1Tag = \"exchangedCurrency1\";
    private static final String exchangedCurrency2Tag = \"exchangedCurrency2\";
    private static final String paymentAmountTag = \"paymentAmount\";
    private static final String amountTag = \"amount\";
    private static final String currencyTag = \"currency\";
    private static final String payerPartyReferenceTag = \"payerPartyReference\";
    private static final String receiverPartyReferenceTag = \"receiverPartyReference\";
    private static final String taxonomyKey = \"taxonomy\";
    private static final String sourceKey = \"source\";
    private static final String qualifierKey = \"productQualifier\";
    private static final String isdaSource = \"ISDA\";
    private static final String spotForwardQualifier = \"ForeignExchange_Spot_Forward\";
    private static final String economicTermsKey = \"economicTerms\";
    private static final String payoutKey = \"payout\";
    private static final String payerReceiverKey = \"payerReceiver\";
    private static final String payerKey = \"payer\";
    private static final String receiverKey = \"receiver\";
    private static final String priceQuantityKey = \"priceQuantity\";
    private static final String quantityScheduleKey = \"quantitySchedule\";
    private static final String priceScheduleKey = \"priceSchedule\";
    private static final String addressKey = \"address\";
    private static final String scopeKey = \"scope\";
    private static final String documentLabel = \"DOCUMENT\";
    private static final String quantityLabel = \"quantity\";
    private static final String priceLabel = \"price\";
    private static final String observableKey = \"Observable\";
    private static final String observableLabel = \"observable\";
    private static final String settlementTypeKey = \"settlementType\";
    private static final String cashLabel = \"Cash\";
    private static final String settlementDateKey = \"settlementDate\";
    private static final String nonDeliverableForwardTag = \"nonDeliverableForward\";
    private static final String underlierKey = \"underlier\";
    private static final String productKey = \"product\";
    private static final String tradeIdentifierKey = \"tradeIdentifier\";
    private static final String assignedIdentifierKey = \"assignedIdentifier\";
    private static final String tradeDateKey = \"tradeDate\";
    private static final String tradeLotKey = \"tradeLot\";
    private static final String priceKey = \"price\";
    private static final String quantityKey = \"quantity\";
    private static final String unitKey = \"unit\";
    private static final String currencyKey = \"currency\";
    private static final String perUnitOfKey = \"perUnitOf\";
    private static final String priceTypeKey = \"priceType\";
    private static final String exchangeRateLabel = \"ExchangeRate\";
    private static final String compositeKey = \"composite\";
    private static final String baseValueKey = \"baseValue\";
    private static final String operandKey = \"operand\";
    private static final String arithmeticOpKey = \"arithmeticOperator\";
    private static final String addLabel = \"Add\";
    private static final String operandTypeKey = \"operandType\";
    private static final String forwardPointLabel = \"ForwardPoint\";
    private static final String identifierValueKey = \"identifier.value\";
    private static final String identifierTypeKey = \"identifierType\";
    private static final String currencyCodeLabel = \"CurrencyCode\";
    private static final String assetTypeKey = \"assetType\";
    private static final String locationKey = \"location\";
}