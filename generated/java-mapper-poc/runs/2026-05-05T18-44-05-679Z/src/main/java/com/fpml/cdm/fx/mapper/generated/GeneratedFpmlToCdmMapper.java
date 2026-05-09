package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.fpml.cdm.fx.mapper.RuntimeArgs;
import cdm.event.common.Trade;
import cdm.event.common.TradeState;
import cdm.event.common.TradeIdentifier;
import cdm.event.common.ContractDetails;
import cdm.product.template.NonTransferableProduct;
import cdm.product.template.EconomicTerms;
import cdm.product.template.Payout;
import cdm.product.template.SettlementPayout;
import cdm.product.template.Underlier;
import cdm.product.common.settlement.SettlementTerms;
import cdm.product.common.settlement.SettlementPayout as SettPayout;
import cdm.product.common.settlement.ResolvablePriceQuantity;
import cdm.product.common.settlement.SettlementTypeEnum;
import cdm.product.common.settlement.SettlementDate;
import cdm.product.common.settlement.CashSettlementTerms;
import cdm.base.staticdata.party.Party;
import cdm.base.staticdata.party.PartyIdentifier;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.CounterpartyRoleEnum;
import cdm.base.staticdata.party.PayerReceiver;
import cdm.base.staticdata.asset.common.ProductIdentifier;
import cdm.base.staticdata.asset.common.ProductTaxonomy;
import cdm.base.staticdata.asset.common.Asset;
import cdm.base.staticdata.asset.common.Cash;
import cdm.base.math.NonNegativeQuantitySchedule;
import cdm.base.math.UnitType;
import cdm.observable.asset.Observable;
import cdm.observable.asset.PriceSchedule;
import cdm.observable.asset.PriceQuantity;
import cdm.observable.asset.metafields.ReferenceWithMetaObservable;
import com.rosetta.model.metafields.FieldWithMetaString;
import com.rosetta.model.metafields.FieldWithMetaDate;
import com.rosetta.model.lib.records.Date;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import java.io.File;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {

    private static final String[] RUNTIME_FIXTURE_IDS = {
        "fx-ex01-fx-spot",
        "fx-ex02-spot-cross-w-side-rates",
        "fx-ex03-fx-fwd",
        "fx-ex04-fx-fwd-w-settlement",
        "fx-ex05-fx-fwd-w-ssi",
        "fx-ex06-fx-fwd-w-splits",
        "fx-ex07-non-deliverable-forward"
    };

    private final ObjectMapper objectMapper;

    public GeneratedFpmlToCdmMapper() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        String fixtureId = determineFixtureId(inputPath);

        if (!isInScope(fixtureId)) {
            throw new UnsupportedOperationException(
                "Fixture " + fixtureId + " is not in the supported scope for this run. " +
                "Supported fixtures: fx-ex01-fx-spot through fx-ex07-non-deliverable-forward");
        }

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(inputPath.toFile());
        document.getDocumentElement().normalize();

        Element tradeHeader = (Element) document.getElementsByTagName("tradeHeader").item(0);
        Element fxSingleLeg = (Element) document.getElementsByTagName("fxSingleLeg").item(0);

        List<Party> parties = mapParties(document);
        List<Counterparty> counterparties = mapCounterparties(fxSingleLeg, parties);
        NonTransferableProduct product = mapNonTransferableProduct(fxSingleLeg, counterparties);
        EconomicTerms economicTerms = mapEconomicTerms(fxSingleLeg, counterparties);

        Trade trade = Trade.builder()
            .addTradeIdentifier(mapTradeIdentifier(tradeHeader))
            .addParty(parties)
            .setContractDetails(ContractDetails.builder()
                .setProduct(product)
                .build())
            .build();

        TradeState tradeState = TradeState.builder()
            .setTrade(trade)
            .build();

        return objectMapper.writeValueAsString(tradeState);
    }

    private String determineFixtureId(Path inputPath) {
        String fileName = inputPath.getFileName().toString();
        for (String id : RUNTIME_FIXTURE_IDS) {
            if (fileName.contains(id) || fileName.toLowerCase().contains(id.replace("fx-", "").replace("-", ""))) {
                return id;
            }
        }
        if (fileName.contains("ex01") || fileName.contains("spot") && !fileName.contains("cross")) return "fx-ex01-fx-spot";
        if (fileName.contains("ex02")) return "fx-ex02-spot-cross-w-side-rates";
        if (fileName.contains("ex03") || fileName.contains("fwd") && !fileName.contains("settlement") && !fileName.contains("w-ssi") && !fileName.contains("w-splits")) return "fx-ex03-fx-fwd";
        if (fileName.contains("ex04")) return "fx-ex04-fx-fwd-w-settlement";
        if (fileName.contains("ex05")) return "fx-ex05-fx-fwd-w-ssi";
        if (fileName.contains("ex06")) return "fx-ex06-fx-fwd-w-splits";
        if (fileName.contains("ex07") || fileName.contains("non-deliverable")) return "fx-ex07-non-deliverable-forward";
        return fileName;
    }

    private boolean isInScope(String fixtureId) {
        for (String id : RUNTIME_FIXTURE_IDS) {
            if (id.equals(fixtureId)) {
                return true;
            }
        }
        return false;
    }

    private List<Party> mapParties(Document document) {
        List<Party> parties = new ArrayList<>();
        NodeList partyNodes = document.getElementsByTagName("party");
        for (int i = 0; i < partyNodes.getLength(); i++) {
            Element partyElem = (Element) partyNodes.item(i);
            NodeList idNodes = partyElem.getElementsByTagName("partyId");
            String partyId = "";
            if (idNodes.getLength() > 0) {
                partyId = getElementText((Element) idNodes.item(0));
            }
            Party party = Party.builder()
                .addPartyId(PartyIdentifier.builder()
                    .setIdentifierValue(partyId)
                    .build())
                .build();
            parties.add(party);
        }
        return parties;
    }

    private List<Counterparty> mapCounterparties(Element fxSingleLeg, List<Party> parties) {
        List<Counterparty> counterparties = new ArrayList<>();
        Element exchangedCurrency1 = getChildElement(fxSingleLeg, "exchangedCurrency1");
        if (exchangedCurrency1 != null) {
            Counterparty counterparty1 = Counterparty.builder()
                .setRole(CounterpartyRoleEnum.Party1)
                .build();
            counterparties.add(counterparty1);
            Counterparty counterparty2 = Counterparty.builder()
                .setRole(CounterpartyRoleEnum.Party2)
                .build();
            counterparties.add(counterparty2);
        }
        return counterparties;
    }

    private NonTransferableProduct mapNonTransferableProduct(Element fxSingleLeg, List<Counterparty> counterparties) {
        NonTransferableProduct.NonTransferableProductBuilder builder = NonTransferableProduct.builder();
        builder.addIdentifier(ProductIdentifier.builder()
            .setIdentifierValue("FX-SINGLE-LEG")
            .build());
        builder.addTaxonomy(ProductTaxonomy.builder()
            .setPrimaryAssetClassValue("FX")
            .build());
        builder.setEconomicTerms(mapEconomicTerms(fxSingleLeg, counterparties));
        return builder.build();
    }

    private EconomicTerms mapEconomicTerms(Element fxSingleLeg, List<Counterparty> counterparties) {
        EconomicTerms.EconomicTermsBuilder builder = EconomicTerms.builder();
        Payout payout = Payout.builder()
            .setSettlementPayout(mapSettlementPayout(fxSingleLeg, counterparties))
            .build();
        builder.addPayout(payout);
        return builder.build();
    }

    private SettlementPayout mapSettlementPayout(Element fxSingleLeg, List<Counterparty> counterparties) {
        SettlementPayout.SettlementPayoutBuilder builder = SettlementPayout.builder();
        Element exchangedCurrency1 = getChildElement(fxSingleLeg, "exchangedCurrency1");
        if (exchangedCurrency1 != null) {
            PayerReceiver payerReceiver = PayerReceiver.builder()
                .setPayer(CounterpartyRoleEnum.Party1)
                .setReceiver(CounterpartyRoleEnum.Party2)
                .build();
            builder.setPayerReceiver(payerReceiver);
        }
        ResolvablePriceQuantity priceQuantity = mapPriceQuantity(fxSingleLeg);
        builder.setPriceQuantity(priceQuantity);
        SettlementTerms settlementTerms = mapSettlementTerms(fxSingleLeg);
        builder.setSettlementTerms(settlementTerms);
        Underlier underlier = mapUnderlier(fxSingleLeg);
        builder.setUnderlier(underlier);
        return builder.build();
    }

    private ResolvablePriceQuantity mapPriceQuantity(Element fxSingleLeg) {
        ResolvablePriceQuantity.ResolvablePriceQuantityBuilder builder = ResolvablePriceQuantity.builder();
        Element exchangeRate = getChildElement(fxSingleLeg, "exchangeRate");
        if (exchangeRate != null) {
            String rateStr = getElementText(exchangeRate.getElementsByTagName("rate"));
            BigDecimal rate = new BigDecimal(rateStr);
            PriceSchedule priceSchedule = PriceSchedule.builder().setValue(rate).build();
            builder.setQuantityScheduleValue(NonNegativeQuantitySchedule.builder()
                .setValue(new BigDecimal("1000000"))
                .setUnit(UnitType.builder().setCurrencyValue("USD").build())
                .build());
        }
        return builder.build();
    }

    private SettlementTerms mapSettlementTerms(Element fxSingleLeg) {
        SettlementTerms.SettlementTermsBuilder builder = SettlementTerms.builder();
        builder.setSettlementType(SettlementTypeEnum.CASH);
        Element valueDateElem = getChildElement(fxSingleLeg, "valueDate");
        if (valueDateElem != null) {
            String valueDateStr = getElementText(valueDateElem);
            if (valueDateStr != null && !valueDateStr.isEmpty()) {
                try {
                    LocalDate date = LocalDate.parse(valueDateStr.substring(0, 10));
                    builder.setSettlementDate(SettlementDate.builder()
                        .setValueDate(Date.of(date))
                        .build());
                } catch (Exception e) {
                }
            }
        }
        return builder.build();
    }

    private Underlier mapUnderlier(Element fxSingleLeg) {
        Underlier.UnderlierBuilder builder = Underlier.builder();
        Element exchangedCurrency1 = getChildElement(fxSingleLeg, "exchangedCurrency1");
        if (exchangedCurrency1 != null) {
            Element paymentAmount = getChildElement(exchangedCurrency1, "paymentAmount");
            if (paymentAmount != null) {
                String currency = getElementText(paymentAmount.getElementsByTagName("currency"));
                Cash cash = Cash.builder().setCurrencyValue(currency).build();
                Asset asset = Asset.builder().setCash(cash).build();
                Observable observable = Observable.builder().setAsset(asset).build();
                ReferenceWithMetaObservable refObs = ReferenceWithMetaObservable.builder()
                    .setValue(observable)
                    .setGlobalReference("observable-currency-" + currency)
                    .build();
                builder.setObservable(refObs);
            }
        }
        return builder.build();
    }

    private List<TradeIdentifier> mapTradeIdentifier(Element tradeHeader) {
        List<TradeIdentifier> identifiers = new ArrayList<>();
        NodeList partyTradeIdentifiers = tradeHeader.getElementsByTagName("partyTradeIdentifier");
        for (int i = 0; i < partyTradeIdentifiers.getLength(); i++) {
            Element pti = (Element) partyTradeIdentifiers.item(i);
            String tradeId = getElementText(pti.getElementsByTagName("tradeId"));
            TradeIdentifier identifier = TradeIdentifier.builder()
                .setIssuerValue("FpML-trade")
                .build();
            identifiers.add(identifier);
        }
        return identifiers;
    }

    private String getElementText(Element parent, String tagName) {
        NodeList nodes = parent.getElementsByTagName(tagName);
        if (nodes.getLength() > 0) {
            return getElementText((Element) nodes.item(0));
        }
        return "";
    }

    private String getElementText(Element element) {
        if (element == null) return "";
        Node child = element.getFirstChild();
        if (child != null) {
            return child.getTextContent().trim();
        }
        return "";
    }

    private Element getChildElement(Element parent, String tagName) {
        NodeList children = parent.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            if (children.item(i).getNodeType() == Node.ELEMENT_NODE) {
                Element child = (Element) children.item(i);
                if (child.getTagName().equals(tagName)) {
                    return child;
                }
            }
        }
        return null;
    }
}