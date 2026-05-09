package com.fpml.cdm.fx.mapper.generated;

import cdm.base.staticdata.asset.common.Cash;
import cdm.base.staticdata.identifier.AssignedIdentifier;
import cdm.base.staticdata.identifier.Identifier;
import cdm.base.staticdata.identifier.TradeIdentifierTypeEnum;
import cdm.base.staticdata.party.AncillaryParty;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.Party;
import cdm.base.staticdata.party.PartyIdentifier;
import cdm.base.staticdata.party.PartyRole;
import cdm.event.common.ContractDetails;
import cdm.event.common.Trade;
import cdm.event.common.TradeIdentifier;
import cdm.event.common.TradeState;
import cdm.observable.asset.Observable;
import cdm.observable.asset.PriceSchedule;
import cdm.product.common.settlement.CashSettlementTerms;
import cdm.product.common.settlement.ResolvablePriceQuantity;
import cdm.product.common.settlement.SettlementDate;
import cdm.product.common.settlement.SettlementTerms;
import cdm.product.common.settlement.SettlementTypeEnum;
import cdm.product.template.EconomicTerms;
import cdm.product.template.NonTransferableProduct;
import cdm.product.template.Payout;
import cdm.product.template.Product;
import cdm.product.template.SettlementPayout;
import cdm.product.template.TradableProduct;
import cdm.product.template.Underlier;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.rosetta.model.metafields.FieldWithMetaDate;
import com.rosetta.model.metafields.FieldWithMetaDecimal;
import com.rosetta.model.metafields.FieldWithMetaString;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.io.File;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Central orchestrator for mapping FpML FX single-leg to CDM TradeState.
 * Implements the fx-single-leg-tradestate recipe.
 * Rosetta functions: MapTradeState, MapFxSingleLegNonTransferableProduct,
 * MapFxSingleLegEconomicTerms, MapFxCoreDetailsModelToSettlementPayout,
 * MapFxSingleLegCounterpartyList, MapTradeIdentifierList.
 */
public class FxSingleLegMapper {

    private final XPath xpath;
    private static final DateTimeFormatter FpML_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public FxSingleLegMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
    }

    /**
     * Map FpML FX single-leg document to CDM TradeState.
     * Recipe: fx-single-leg-tradestate.
     * @param doc FpML document
     * @return TradeState
     */
    public TradeState mapFxSingleLeg(Document doc) {
        // Step 1: Build Trade
        Trade trade = buildTrade(doc);

        // Step 5: Wrap Trade in TradeState
        TradeState tradeState = TradeState.builder()
                .setTrade(trade)
                .build();

        return tradeState;
    }

    /**
     * Build CDM Trade from FpML document.
     * Rosetta: MapTradeState.
     */
    private Trade buildTrade(Document doc) {
        // Step 3: Build NonTransferableProduct with EconomicTerms
        Product product = buildProduct(doc);

        // Step 1: Build parties and counterparties
        List<Party> parties = buildParties(doc);
        List<Counterparty> counterparties = buildCounterparties(doc);
        List<AncillaryParty> ancillaryParties = buildAncillaryParties(doc);

        // Step 2: Build trade identifiers
        List<TradeIdentifier> tradeIdentifiers = buildTradeIdentifiers(doc);

        // Assemble Trade
        Trade.Builder tradeBuilder = Trade.builder()
                .setProduct(product);

        // Add parties
        for (Party party : parties) {
            tradeBuilder.addParty(party);
        }

        // Add counterparties
        for (Counterparty cpty : counterparties) {
            tradeBuilder.addCounterparty(cpty);
        }

        // Add ancillary parties
        for (AncillaryParty anc : ancillaryParties) {
            tradeBuilder.addAncillaryParty(anc);
        }

        // Add trade identifiers to contract details
        if (!tradeIdentifiers.isEmpty()) {
            ContractDetails contractDetails = ContractDetails.builder()
                    .addTradeIdentifier(tradeIdentifiers.get(0))
                    .build();
            tradeBuilder.setContractDetails(contractDetails);
        }

        return tradeBuilder.build();
    }

    /**
     * Step 3 & 4: Build Product, NonTransferableProduct, EconomicTerms, Payout.
     * Rosetta: MapFxSingleLegNonTransferableProduct, MapFxSingleLegEconomicTerms,
     * MapFxCoreDetailsModelToSettlementPayout.
     */
    private Product buildProduct(Document doc) {
        // Build NonTransferableProduct with EconomicTerms
        NonTransferableProduct ntp = NonTransferableProduct.builder()
                .setEconomicTerms(buildEconomicTerms(doc))
                .build();

        // Wrap in Product
        Product product = Product.builder()
                .setNonTransferableProduct(ntp)
                .build();

        return product;
    }

    /**
     * Build EconomicTerms with Payout containing SettlementPayout.
     * Rosetta: MapFxSingleLegEconomicTerms, MapFxCoreDetailsModelToSettlementPayout.
     */
    private EconomicTerms buildEconomicTerms(Document doc) {
        Payout payout = buildPayout(doc);

        return EconomicTerms.builder()
                .setPayout(payout)
                .build();
    }

    /**
     * Build Payout with SettlementPayout, price/quantity, settlement, and underlier.
     * Rosetta: MapFxCoreDetailsModelToSettlementPayout, MapFxCoreDetailsModelPriceListWithLocation,
     * MapFxCoreDetailsModelQuantityListWithLocation.
     */
    private Payout buildPayout(Document doc) {
        // Build price quantity
        ResolvablePriceQuantity priceQuantity = buildPriceQuantity(doc);

        // Build settlement terms
        SettlementTerms settlementTerms = buildSettlementTerms(doc);

        // Build underlier
        Underlier underlier = buildUnderlier(doc);

        // Assemble SettlementPayout
        SettlementPayout settlementPayout = SettlementPayout.builder()
                .setPriceQuantity(priceQuantity)
                .setSettlementTerms(settlementTerms)
                .setUnderlier(underlier)
                .build();

        // Wrap in Payout
        return Payout.builder()
                .setSettlementPayout(settlementPayout)
                .build();
    }

    /**
     * Build ResolvablePriceQuantity from FpML FX rate and amounts.
     * Rosetta: MapFxCoreDetailsModelPriceWithAddress, MapFxCoreDetailsModelQuantityWithAddress.
     */
    private ResolvablePriceQuantity buildPriceQuantity(Document doc) {
        ResolvablePriceQuantity.Builder rpqBuilder = ResolvablePriceQuantity.builder();

        // Extract exchange rate
        BigDecimal spotRate = extractDecimal(doc, "//spotRate");
        BigDecimal forwardPoints = extractDecimal(doc, "//forwardPoints");

        // Compute effective rate
        BigDecimal effectiveRate = spotRate;
        if (forwardPoints != null && spotRate != null) {
            effectiveRate = spotRate.add(forwardPoints);
        }

        // Extract currencies
        String baseCurrency = extractString(doc, "//fxSingleLeg/@baseCurrency");
        String quoteCurrency = extractString(doc, "//fxSingleLeg/@quoteCurrency");

        // Build price schedule
        if (effectiveRate != null) {
            PriceSchedule priceSchedule = PriceSchedule.builder()
                    .setValue(FieldWithMetaDecimal.builder().setValue(effectiveRate).build())
                    .setMeasureType(FieldWithMetaString.builder().setValue("FX Rate").build())
                    .build