package com.fpml.cdm.fx;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fpml.cdm.fx.mapper.FxSingleLegMapper;
import com.fpml.cdm.fx.mapper.SwapMapper;
import com.fpml.cdm.fx.mapper.SimpleOptionMapper;
import com.fpml.cdm.fx.mapper.UnsupportedProductMapper;
import com.fpml.cdm.fx.model.CdmTrade;
import com.fpml.cdm.fx.model.MapperReport;
import com.fpml.cdm.fx.model.TradeMetadata;
import com.fpml.cdm.fx.util.PartyResolver;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;


import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;
import java.io.FileWriter;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * Main entry point for FpML to CDM mapping.
 * Reads FpML XML files and produces CDM JSON output.
 */
public class FpmlToFxMapper {

    private final ObjectMapper objectMapper;
    private final FxSingleLegMapper singleLegMapper;
    private final SwapMapper swapMapper;
    private final SimpleOptionMapper simpleOptionMapper;
    private final UnsupportedProductMapper unsupportedMapper;

    private final PartyResolver partyResolver;

    public FpmlToFxMapper() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.partyResolver = new PartyResolver();
        this.singleLegMapper = new FxSingleLegMapper(partyResolver);
        this.swapMapper = new SwapMapper(partyResolver);
        this.simpleOptionMapper = new SimpleOptionMapper(partyResolver);
        this.unsupportedMapper = new UnsupportedProductMapper();
    }

    /**
     * Maps a single FpML XML file to CDM JSON.
     * @param fpmlFile Input FpML XML file
     * @param outputDir Directory for output JSON and reports
     * @return MapperReport with mapping details
     */
    public MapperReport mapFile(File fpmlFile, File outputDir) {
        MapperReport report = new MapperReport();
        report.setInputFile(fpmlFile.getName());
        long startTime = System.currentTimeMillis();

        try {
            Document doc = parseXml(fpmlFile);
            Element root = doc.getDocumentElement();
            String tradeTag = root.getTagName();

            // Detect product type from root element
            String productType = detectProductType(root, tradeTag);
            report.setProductType(productType);

            // Resolve parties first
            partyResolver.resolveParties(doc);

            CdmTrade cdmTrade;
            switch (productType) {
                case "fxSingleLeg":
                    cdmTrade = singleLegMapper.map(doc);
                    report.setProductGroup("fx-single-leg");
                    report.setMapped(true);
                    break;
                case "fxSwap":
                    cdmTrade = swapMapper.map(doc);
                    report.setProductGroup("fx-swap");
                    report.setMapped(true);
                    break;
                case "fxSimpleOption":
                    cdmTrade = simpleOptionMapper.map(doc);
                    report.setProductGroup("fx-simple-option");
                    report.setMapped(true);
                    break;
                default:
                    cdmTrade = unsupportedMapper.map(doc, productType);
                    report.setProductGroup("unsupported");
                    report.setUnsupported(true);
                    report.setUnsupportedReason("Product type '" + productType + "' is not in scope for fx-single-leg implementation group");
                    break;
            }


            // Write CDM JSON output
            String baseName = fpmlFile.getName().replaceAll("\\.xml$", "");
            File jsonOutput = new File(outputDir, baseName + ".json");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(jsonOutput, cdmTrade);
            report.setOutputFile(jsonOutput.getName());
            report.setSuccess(true);

        } catch (UnsupportedOperationException e) {
            report.setSuccess(false);
            report.setErrorMessage(e.getMessage());
            report.setUnsupported(true);
            report.setUnsupportedReason(e.getMessage());
        } catch (Exception e) {
            report.setSuccess(false);
            report.setErrorMessage("Mapping failed: " + e.getMessage());
        }

        report.setElapsedMs(System.currentTimeMillis() - startTime);
        return report;
    }

    /**
     * Batch maps all XML files in a directory.
     */
    public List<MapperReport> mapDirectory(File inputDir, File outputDir) {
        List<MapperReport> reports = new ArrayList<>();
        File[] files = inputDir.listFiles((dir, name) -> name.endsWith(".xml"));
        if (files != null) {
            for (File file : files) {
                reports.add(mapFile(file, outputDir));
            }
        }
        return reports;
    }


    private String detectProductType(Element root, String tradeTag) {
        // Check if it's trade/fxSingleLeg, trade/fxSwap, trade/fxSimpleOption, etc.
        if (tradeTag.equalsIgnoreCase("trade")) {
            NodeList children = root.getChildNodes();
            for (int i = 0; i < children.getLength(); i++) {
                if (children.item(i) instanceof Element) {
                    String childTag = ((Element) children.item(i)).getTagName();
                    if (childTag.equalsIgnoreCase("fxSingleLeg")) return "fxSingleLeg";
                    if (childTag.equalsIgnoreCase("fxSwap")) return "fxSwap";
                    if (childTag.equalsIgnoreCase("fxSimpleOption")) return "fxSimpleOption";
                    if (childTag.equalsIgnoreCase("fxBarrierOption")) return "fxBarrierOption";
                    if (childTag.equalsIgnoreCase("fxDigitalOption")) return "fxDigitalOption";
                    if (childTag.equalsIgnoreCase("fxAverageRateOption")) return "fxAverageRateOption";
                    if (childTag.equalsIgnoreCase("strategy")) return "strategy";
                    if (childTag.equalsIgnoreCase("termDeposit")) return "termDeposit";
                }
            }
        }
        return tradeTag;
    }

    private Document parseXml(File file) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(file);
    }

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.out.println("Usage: FpmlToFxMapper <inputDir> <outputDir>");
            System.exit(1);
        }
        File inputDir = new File(args[0]);
        File outputDir = new File(args[1]);
        outputDir.mkdirs();

        FpmlToFxMapper mapper = new FpmlToFxMapper();
        List<MapperReport> reports = mapper.mapDirectory(inputDir, outputDir);

        // Write summary report
        ObjectMapper om = new ObjectMapper();
        om.writerWithDefaultPrettyPrinter().writeValue(
            new File(outputDir, "mapper-report.json"), reports);


        long successCount = reports.stream().filter(MapperReport::isSuccess).count();
        System.out.println("Mapping complete: " + successCount + "/" + reports.size() + " successful");
    }
}