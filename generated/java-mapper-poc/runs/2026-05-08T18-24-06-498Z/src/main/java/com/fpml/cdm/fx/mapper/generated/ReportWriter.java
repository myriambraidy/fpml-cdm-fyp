package com.fpml.cdm.fx.mapper.generated;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Jackson-based sidecar report writer for mapping, validation, traceability,
 * and unsupported-scope details.
 */
public class ReportWriter {

    private final ObjectMapper objectMapper;

    public ReportWriter() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    /**
     * Write a sidecar mapping report for a fixture.
     * @param fixtureId fixture identifier (e.g. "fx-ex01-fx-spot")
     * @param rosettaCitations list of Rosetta function names cited
     * @param mappedFields list of successfully mapped fields
     * @param unsupportedFields list of unsupported fields
     * @param notes additional notes
     * @param outputDir output directory
     */
    public void writeReport(String fixtureId, List<String> rosettaCitations,
                           List<String> mappedFields, List<String> unsupportedFields,
                           Map<String, Object> notes, File outputDir) {
        ObjectNode root = objectMapper.createObjectNode();
        root.put("fixtureId", fixtureId);
        root.put("generatedAt", Instant.now().toString());
        root.put("contractVersion", "fx-single-leg");

        // Rosetta traceability citations
        ObjectNode traceability = objectMapper.createObjectNode();
        ArrayNode citations = objectMapper.createArrayNode();
        for (String citation : rosettaCitations) {
            citations.add(citation);
        }
        traceability.set("rosettaFunctionCitations", citations);
        traceability.put("recipeId", "fx-single-leg-tradestate");
        root.set("traceability", traceability);

        // Mapped fields summary
        ObjectNode mapping = objectMapper.createObjectNode();
        ArrayNode mapped = objectMapper.createArrayNode();
        for (String field : mappedFields) {
            mapped.add(field);
        }
        mapping.set("mappedFields", mapped);
        root.set("mapping", mapping);

        // Unsupported fields
        ObjectNode unsupported = objectMapper.createObjectNode();
        ArrayNode unsupportedList = objectMapper.createArrayNode();
        for (String field : unsupportedFields) {
            unsupportedList.add(field);
        }
        unsupported.set("unsupportedFields", unsupportedList);
        unsupported.put("note", "Unsupported fields are reported explicitly and not silently fabricated");
        root.set("unsupportedScope", unsupported);

        // Validation notes
        ObjectNode validation = objectMapper.createObjectNode();
        ArrayNode warnings = objectMapper.createArrayNode();
        if (unsupportedFields.size() > 0) {
            warnings.add("Some fields are unsupported; output may not be CDM-compliant");
        }
        validation.set("warnings", warnings);
        validation.put("validationNote", "Candidate CDM JSON written even if validation failures; not claimed compliant");
        root.set("validation", validation);

        // Additional notes
        if (notes != null && !notes.isEmpty()) {
            ObjectNode notesNode = objectMapper.createObjectNode();
            for (Map.Entry<String, Object> entry : notes.entrySet()) {
                if (entry.getValue() instanceof String) {
                    notesNode.put(entry.getKey(), (String) entry.getValue());
                } else {
                    notesNode.put(entry.getKey(), entry.getValue().toString());
                }
            }
            root.set("notes", notesNode);
        }

        // Write file
        File reportFile = new File(outputDir, fixtureId + "-mapping-report.json");
        try {
            objectMapper.writeValue(reportFile, root);
        } catch (JsonProcessingException e) {
            // log error
        } catch (IOException e) {
            // log error
        }
    }

    /**
     * Write a summary report across all fixtures.
     * @param fixtureIds list of fixture IDs processed
     * @param successCount number of successfully processed fixtures
     * @param outputDir output directory
     */
    public void writeSummaryReport(List<String> fixtureIds, int successCount, File outputDir) {
        ObjectNode root = objectMapper.createObjectNode();
        root.put("generatedAt", Instant.now().toString());
        root.put("contractVersion", "fx-single-leg");
        root.put("recipeId", "fx-single-leg-tradestate");

        ArrayNode fixtures = objectMapper.createArrayNode();
        for (String id : fixtureIds) {
            fixtures.add(id);
        }
        root.set("fixturesProcessed", fixtures);
        root.put("successCount", successCount);
        root.put("totalCount", fixtureIds.size());

        // Rosetta function summary
        ObjectNode rosettaSummary = objectMapper.createObjectNode();
        ArrayNode functions = objectMapper.createArrayNode();
        functions.add("MapFxSingleLegCounterpartyList");
        functions.add("MapFxSingleLegAncillaryPartyList");
        functions.add("MapPayerReceiverToAccountPartyReference");
        functions.add("MapTradeIdentifierList");
        functions.add("MapFxSingleLegNonTransferableProduct");
        functions.add("MapFxSingleLegEconomicTerms");
        functions.add("MapProductIdentifierList");
        functions.add("MapProductTaxonomyList");
        functions.add("MapFxCoreDetailsModelToSettlementPayout");
        functions.add("MapFxCoreDetailsModelPriceListWithLocation");
        functions.add("MapFxCoreDetailsModelQuantityListWithLocation");
        functions.add("MapFxCashSettlementToSettlementTerms");
        functions.add("MapFxCoreDetailsModelPriceWithAddress");
        functions.add("MapFxCoreDetailsModelQuantityWithAddress");
        functions.add("MapTradeState");
        rosettaSummary.set("rosettaFunctions", functions);
        root.set("rosettaTraceability", rosettaSummary);

        // Approved classes used
        ObjectNode approved = objectMapper.createObjectNode();
        ArrayNode classes = objectMapper.createArrayNode();
        classes.add("cdm.event.common.TradeState");
        classes.add("cdm.event.common.Trade");
        classes.add("cdm.event.common.ContractDetails");
        classes.add("cdm.event.common.TradeIdentifier");
        classes.add("cdm.base.staticdata.party.Party");
        classes.add("cdm.base.staticdata.party.PartyIdentifier");
        classes.add("cdm.base.staticdata.party.Counterparty");
        classes.add("cdm.base.staticdata.party.AncillaryParty");
        classes.add("cdm.base.staticdata.identifier.Identifier");
        classes.add("cdm.base.staticdata.identifier.AssignedIdentifier");
        classes.add("cdm.product.template.TradableProduct");
        classes.add("cdm.product.template.Product");
        classes.add("cdm.product.template.NonTransferableProduct");
        classes.add("cdm.product.template.EconomicTerms");
        classes.add("cdm.product.template.Payout");
        classes.add("cdm.product.template.SettlementPayout");
        classes.add("cdm.product.common.settlement.ResolvablePriceQuantity");
        classes.add("cdm.product.common.settlement.SettlementTerms");
        classes.add("cdm.product.common.settlement.CashSettlementTerms");
        classes.add("cdm.product.common.settlement.SettlementTypeEnum");
        classes.add("cdm.product.template.Underlier");
        classes.add("cdm.observable.asset.Observable");
        classes.add("cdm.observable.asset.PriceSchedule");
        classes.add("cdm.base.staticdata.asset.common.Cash");
        approved.set("approvedClassesUsed", classes);
        root.set("approvedContract", approved);

        File reportFile = new File(outputDir, "mapping-summary-report.json");
        try {
            objectMapper.writeValue(reportFile, root);
        } catch (JsonProcessingException e) {
            // log error
        } catch (IOException e) {
            // log error
        }
    }
}
