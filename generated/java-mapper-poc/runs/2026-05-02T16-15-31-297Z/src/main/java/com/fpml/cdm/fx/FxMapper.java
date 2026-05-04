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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Optional;

/**
 * Main entry point for FpML to CDM conversion.
 * Routes to appropriate product-specific mappers based on detected FpML root element.
 */
public class FxMapper {

    private final ObjectMapper objectMapper;
    private final FxSingleLegMapper singleLegMapper;
    private final Map<String, String> report;
    private final List<String> unsupportedReasons;
    private final List<String> validationErrors;


    public FxMapper() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
        this.objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        this.singleLegMapper = new FxSingleLegMapper();
        this.report = new LinkedHashMap<>();
        this.unsupportedReasons = new ArrayList<>();
        this.validationErrors = new ArrayList<>();
    }

    /**
     * Converts an FpML XML file to CDM JSON.
     * @param fpmlPath Path to FpML XML file
     * @return CDM JSON as a string, or null if conversion failed
     */
    public String convert(String fpmlPath) {
        try {
            Path path = Paths.get(fpmlPath);
            String xmlContent = Files.readString(path);
            return convertXml(xmlContent);
        } catch (IOException e) {
            unsupportedReasons.add("Failed to read file: " + fpmlPath + " - " + e.getMessage());
            return null;
        }
    }

    /**
     * Converts FpML XML content to CDM JSON.
     * @param xmlContent FpML XML as string
     * @return CDM JSON as a string, or null if conversion failed
     */
    public String convertXml(String xmlContent) {
        try {
            // Parse XML to detect product type
            String productType = detectProductType(xmlContent);

            if ("fxSingleLeg".equals(productType)) {
                return singleLegMapper.map(xmlContent, objectMapper);
            } else if ("fxSwap".equals(productType)) {
                unsupportedReasons.add("fxSwap is not yet supported - product group fx-swap is out of scope for this implementation");
                return generateUnsupportedReport(productType, "FX swap products require fx-swap implementation group");
            } else if ("fxSimpleOption".equals(productType)) {
                unsupportedReasons.add("fxSimpleOption is not yet supported - product group fx-simple-option is out of scope");
                return generateUnsupportedReport(productType, "FX simple option products require fx-simple-option implementation group");
            } else if ("fxDigitalOption".equals(productType)) {
                unsupportedReasons.add("fxDigitalOption is not yet supported - product group fx-digital-option is out of scope");
                return generateUnsupportedReport(productType, "FX digital option products require fx-digital-option implementation group");
            } else if ("fxBarrierOption".equals(productType)) {
                unsupportedReasons.add("fxBarrierOption is not yet supported - product group fx-barrier-option is out of scope");
                return generateUnsupportedReport(productType, "FX barrier option products require fx-barrier-option implementation group");
            } else if ("fxAverageRateOption".equals(productType)) {
                unsupportedReasons.add("fxAverageRateOption is not yet supported - product group fx-average-rate-option is out of scope");
                return generateUnsupportedReport(productType, "FX average rate option products require fx-average-rate-option implementation group");
            } else if ("strategy".equals(productType)) {
                unsupportedReasons.add("Strategy products are not yet supported - product group fx-strategy is out of scope");
                return generateUnsupportedReport(productType, "FX strategy products require fx-strategy implementation group");
            } else if ("termDeposit".equals(productType)) {
                unsupportedReasons.add("termDeposit is not an FX product - excluded from fx-derivatives family");
                return generateUnsupportedReport(productType, "Term deposit products are non-FX and excluded from fx-derivatives family");
            } else {
                unsupportedReasons.add("Unknown product type: " + productType + " - cannot route to mapper");
                return generateUnsupportedReport(productType, "Unknown FpML product type");
            }
        } catch (Exception e) {
            validationErrors.add("Conversion error: " + e.getMessage());
            return generateUnsupportedReport("UNKNOWN", e.getMessage());
        }
    }

    /**
     * Detects the product type from FpML XML content.
     */
    private String detectProductType(String xmlContent) {
        // Simple detection based on root element
        if (xmlContent.contains("<fxSingleLeg>")) {
            return "fxSingleLeg";
        } else if (xmlContent.contains("<fxSwap>")) {
            return "fxSwap";
        } else if (xmlContent.contains("<fxSimpleOption>")) {
            return "fxSimpleOption";
        } else if (xmlContent.contains("<fxDigitalOption>")) {
            return "fxDigitalOption";
        } else if (xmlContent.contains("<fxBarrierOption>")) {
            return "fxBarrierOption";
        } else if (xmlContent.contains("<fxAverageRateOption>")) {
            return "fxAverageRateOption";
        } else if (xmlContent.contains("<strategy>")) {
            return "strategy";
        } else if (xmlContent.contains("<termDeposit>")) {
            return "termDeposit";
        }
        return "UNKNOWN";
    }

    /**
     * Generates an unsupported product report.
     */
    private String generateUnsupportedReport(String productType, String reason) {
        try {
            ObjectNode root = objectMapper.createObjectNode();
            root.put("mapper", "fx-mapper");
            root.put("version", "1.0.0");
            root.put("productFamily", "fx-derivatives");
            root.put("status", "UNSUPPORTED");
            root.put("productType", productType);
            root.put("reason", reason);

            ArrayNode reasons = root.putArray("unsupportedReasons");
            for (String r : unsupportedReasons) {
                reasons.add(r);
            }

            if (!validationErrors.isEmpty()) {
                ArrayNode errors = root.putArray("validationErrors");
                for (String e : validationErrors) {
                    errors.add(e);
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            return "{\"error\": \"Failed to generate report\", \"message\": \"" + e.getMessage() + "\"}";
        }
    }

    /**
     * Returns the mapping report.
     */
    public Map<String, String> getReport() {
        return report;
    }

    /**
     * Returns unsupported reasons.
     */
    public List<String> getUnsupportedReasons() {
        return unsupportedReasons;
    }

    /**
     * Returns validation errors.
     */
    public List<String> getValidationErrors() {
        return validationErrors;
    }

    /**
     * Resets the report and error lists.
     */
    public void resetReport() {
        report.clear();
        unsupportedReasons.clear();
        validationErrors.clear();
    }

    /**
     * Main entry point for command-line execution.
     */
    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: java com.fpml.cdm.fx.FxMapper <inputFpmlXml> <outputCdmJson>");
            System.out.println("  Converts FpML XML to CDM JSON");
            System.out.println("  Supported products: fxSingleLeg (FX spot/forward/NDF)");
            System.out.println("  Unsupported products generate a report JSON with status UNSUPPORTED");
            System.exit(1);
        }

        String inputPath = args[0];
        String outputPath = args[1];

        FxMapper mapper = new FxMapper();
        String result = mapper.convert(inputPath);

        if (result != null) {
            try {
                Files.writeString(Paths.get(outputPath), result);
                System.out.println("Successfully converted: " + inputPath + " -> " + outputPath);

                // Print unsupported warnings if any
                if (!mapper.getUnsupportedReasons().isEmpty()) {
                    System.out.println("\nWarnings:");
                    for (String reason : mapper.getUnsupportedReasons()) {
                        System.out.println("  - " + reason);
                    }
                }
            } catch (IOException e) {
                System.err.println("Failed to write output: " + e.getMessage());
                System.exit(1);
            }
        } else {
            System.err.println("Conversion failed for: " + inputPath);
            for (String error : mapper.getValidationErrors()) {
                System.err.println("  - " + error);
            }
            System.exit(1);
        }
    }
}