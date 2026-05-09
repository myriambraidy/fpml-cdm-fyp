package com.fpml.cdm.fx.mapper.generated;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.fpml.cdm.fx.mapper.RuntimeArgs;
import cdm.event.common.TradeState;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * Generated FpML-to-CDM mapper for FX single-leg derivatives.
 * Implements FpmlToCdmMapper and produces CDM TradeState objects from FpML FX fixture files.
 * 
 * Rosetta traceability: MapTradeState
 */
public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {

    private final ObjectMapper objectMapper;
    private final PartyMapper partyMapper;
    private final TradeIdentifierMapper tradeIdentifierMapper;
    private final ObservableMapper observableMapper;
    private final PriceQuantityMapper priceQuantityMapper;
    private final SettlementMapper settlementMapper;
    private final PayoutMapper payoutMapper;
    private final FxSpotMapper fxSpotMapper;
    private final FxFwdMapper fxFwdMapper;
    private final NdfMapper ndfMapper;
    private final ReportWriter reportWriter;

    public GeneratedFpmlToCdmMapper() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

        this.partyMapper = new PartyMapper();
        this.tradeIdentifierMapper = new TradeIdentifierMapper();
        this.observableMapper = new ObservableMapper();
        this.priceQuantityMapper = new PriceQuantityMapper();
        this.settlementMapper = new SettlementMapper();
        this.payoutMapper = new PayoutMapper(observableMapper, priceQuantityMapper, settlementMapper);
        this.fxSpotMapper = new FxSpotMapper(partyMapper, tradeIdentifierMapper, payoutMapper);
        this.fxFwdMapper = new FxFwdMapper(partyMapper, tradeIdentifierMapper, payoutMapper);
        this.ndfMapper = new NdfMapper(partyMapper, tradeIdentifierMapper, payoutMapper);
        this.reportWriter = new ReportWriter(objectMapper);
    }

    @Override
    public List<String> map(RuntimeArgs args) throws Exception {
        List<String> results = new ArrayList<>();
        List<String> unsupported = new ArrayList<>();
        List<String> traceability = new ArrayList<>();

        for (String fixtureName : args.getFixtureNames()) {
            String fixturePath = args.getFixtureDir().resolve(fixtureName + ".xml").toString();
            File fixtureFile = new File(fixturePath);

            if (!fixtureFile.exists()) {
                unsupported.add("Fixture not found: " + fixtureName);
                continue;
            }

            try {
                Document doc = parseXml(fixtureFile);
                String productType = determineProductType(doc);
                TradeState tradeState = mapDocument(doc, productType, fixtureName);

                String json = serializeToJson(tradeState);
                results.add(json);

                traceability.add("Rosetta: MapTradeState | Fixture: " + fixtureName + " | Product: " + productType);

                reportWriter.writeSidecarReport(fixtureName, productType, traceability, unsupported);

            } catch (Exception e) {
                unsupported.add("Mapping error for " + fixtureName + ": " + e.getMessage());
                results.add("{\"error\": \"" + fixtureName + " failed: " + e.getMessage() + "\"}");
            }
        }

        return results;
    }

    /**
     * Maps an FpML XML Document to a CDM TradeState based on product type.
     * 
     * Rosetta traceability: MapFxSingleLegNonTransferableProduct, MapFxSingleLegEconomicTerms, MapTradeState
     */
    public TradeState mapDocument(Document doc, String productType, String fixtureName) throws Exception {
        switch (productType) {
            case "fxSpot":
            case "fxSpotCross":
                return fxSpotMapper.mapFxSingleLeg(doc, fixtureName);
            case "fxFwd":
            case "fxFwdSettlement":
            case "fxFwdSsi":
            case "fxFwdSplits":
                return fxFwdMapper.mapFxSingleLeg(doc, fixtureName);
            case "ndf":
                return ndfMapper.mapFxSingleLeg(doc, fixtureName);
            default:
                throw new IllegalArgumentException("Unknown product type: " + productType);
        }
    }

    /**
     * Determines product type from FpML document structure.
     * 
     * Rosetta traceability: MapFxSingleLegProductClassification
     */
    public String determineProductType(Document doc) {
        XPath xpath = XPathFactory.newInstance().newXPath();
        try {
            // Check for fx element
            NodeList fxNodes = (NodeList) xpath.evaluate("//fxSingleLeg", doc, XPathConstants.NODESET);
            if (fxNodes.getLength() > 0) {
                Element fxElement = (Element) fxNodes.item(0);
                
                // Check for nonDeliverableSettlement
                NodeList ndfNodes = (NodeList) xpath.evaluate("nonDeliverableSettlement", fxElement, XPathConstants.NODESET);
                if (ndfNodes.getLength() > 0) {
                    return "ndf";
                }
                
                // Check for forwardPoints
                NodeList fwdNodes = (NodeList) xpath.evaluate("forwardRate/forwardPoints", fxElement, XPathConstants.NODESET);
                if (fwdNodes.getLength() > 0) {
                    return "fxFwd";
                }
                
                return "fxSpot";
            }
            
            // Check for spotCross with side rates
            NodeList sideNodes = (NodeList) xpath.evaluate("//quotedCurrencyPair", doc, XPathConstants.NODESET);
            if (sideNodes.getLength() > 0) {
                return "fxSpotCross";
            }
            
            // Check for fxFwd settlement
            NodeList settleNodes = (NodeList) xpath.evaluate("//settlement", doc, XPathConstants.NODESET);
            if (settleNodes.getLength() > 0) {
                return "fxFwdSettlement";
            }
            
            return "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * Parses an XML file into a W3C Document.
     */
    private Document parseXml(File file) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(file);
    }

    /**
     * Serializes a CDM TradeState to JSON using Jackson.
     * 
     * Rosetta traceability: MapTradeState
     */
    public String serializeToJson(TradeState tradeState) throws IOException {
        StringWriter writer = new StringWriter();
        objectMapper.writeValue(writer, tradeState);
        return writer.toString();
    }

    /**
     * Writes CDM JSON output to file.
     */
    public void writeOutput(String fixtureName, String json, Path outputDir) throws IOException {
        Path outputPath = outputDir.resolve(fixtureName + "-output.json");
        Files.writeString(outputPath, json);
    }

    public ObjectMapper getObjectMapper() {
        return objectMapper;
    }
}
