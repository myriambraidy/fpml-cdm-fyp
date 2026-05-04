package com.fpml.cdm.fx.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;


/**
 * Report capturing mapping results for each input file.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MapperReport {

    @JsonProperty("inputFile")
    private String inputFile;

    @JsonProperty("outputFile")
    private String outputFile;


    @JsonProperty("productType")
    private String productType;

    @JsonProperty("productGroup")
    private String productGroup;

    @JsonProperty("mapped")
    private boolean mapped;

    @JsonProperty("unsupported")
    private boolean unsupported;

    @JsonProperty("unsupportedReason")
    private String unsupportedReason;

    @JsonProperty("success")
    private boolean success;

    @JsonProperty("errorMessage")
    private String errorMessage;


    @JsonProperty("elapsedMs")
    private long elapsedMs;

    @JsonProperty("validationDetails")
    private ValidationDetails validationDetails;

    @JsonProperty("traceability")
    private Traceability traceability;


    public MapperReport() {
        this.validationDetails = new ValidationDetails();
        this.traceability = new Traceability();
    }

    public String getInputFile() { return inputFile; }
    public void setInputFile(String inputFile) { this.inputFile = inputFile; }

    public String getOutputFile() { return outputFile; }
    public void setOutputFile(String outputFile) { this.outputFile = outputFile; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }


    public String getProductGroup() { return productGroup; }
    public void setProductGroup(String productGroup) { this.productGroup = productGroup; }

    public boolean isMapped() { return mapped; }
    public void setMapped(boolean mapped) { this.mapped = mapped; }

    public boolean isUnsupported() { return unsupported; }
    public void setUnsupported(boolean unsupported) { this.unsupported = unsupported; }

    public String getUnsupportedReason() { return unsupportedReason; }
    public void setUnsupportedReason(String unsupportedReason) {
        this.unsupportedReason = unsupportedReason;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public long getElapsedMs() { return elapsedMs; }
    public void setElapsedMs(long elapsedMs) { this.elapsedMs = elapsedMs; }

    public ValidationDetails getValidationDetails() { return validationDetails; }
    public void setValidationDetails(ValidationDetails validationDetails) {
        this.validationDetails = validationDetails;
    }

    public Traceability getTraceability() { return traceability; }
    public void setTraceability(Traceability traceability) { this.traceability = traceability; }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ValidationDetails {
        @JsonProperty(" tradeDateNormalized")
        private boolean tradeDateNormalized;

        @JsonProperty("quantitiesMapped")
        private boolean quantitiesMapped;

        @JsonProperty("exchangeRateMapped")
        private boolean exchangeRateMapped;


        @JsonProperty("partyReferencesResolved")
        private boolean partyReferencesResolved;


        @JsonProperty("tradeIdentifiersMapped")
        private boolean tradeIdentifiersMapped;

        @JsonProperty("settlementInfoPresent")
        private boolean settlementInfoPresent;


        @JsonProperty("nonDeliverablePresent")
        private boolean nonDeliverablePresent;


        public boolean isTradeDateNormalized() { return tradeDateNormalized; }
        public void setTradeDateNormalized(boolean tradeDateNormalized) {
            this.tradeDateNormalized = tradeDateNormalized;
        }

        public boolean isQuantitiesMapped() { return quantitiesMapped; }
        public void setQuantitiesMapped(boolean quantitiesMapped) {
            this.quantitiesMapped = quantitiesMapped;
        }

        public boolean isExchangeRateMapped() { return exchangeRateMapped; }
        public void setExchangeRateMapped(boolean exchangeRateMapped) {
            this.exchangeRateMapped = exchangeRateMapped;
        }

        public boolean isPartyReferencesResolved() { return partyReferencesResolved; }
        public void setPartyReferencesResolved(boolean partyReferencesResolved) {
            this.partyReferencesResolved = partyReferencesResolved;
        }

        public boolean isTradeIdentifiersMapped() { return tradeIdentifiersMapped; }
        public void setTradeIdentifiersMapped(boolean tradeIdentifiersMapped) {
            this.tradeIdentifiersMapped = tradeIdentifiersMapped;
        }

        public boolean isSettlementInfoPresent() { return settlementInfoPresent; }
        public void setSettlementInfoPresent(boolean settlementInfoPresent) {
            this.settlementInfoPresent = settlementInfoPresent;
        }

        public boolean isNonDeliverablePresent() { return nonDeliverablePresent; }
        public void setNonDeliverablePresent(boolean nonDeliverablePresent) {
            this.nonDeliverablePresent = nonDeliverablePresent;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Traceability {
        @JsonProperty("sourceFpmlElements")
        private List<String> sourceFpmlElements;


        @JsonProperty("targetCdmPaths")
        private List<String> targetCdmPaths;


        @JsonProperty("cookbookRules")
        private List<String> cookbookRules;


        @JsonProperty("rosettaFunctions")
        private List<String> rosettaFunctions;


        public Traceability() {
            this.sourceFpmlElements = new ArrayList<>();
            this.targetCdmPaths = new ArrayList<>();
            this.cookbookRules = new ArrayList<>();
            this.rosettaFunctions = new ArrayList<>();
        }

        public List<String> getSourceFpmlElements() { return sourceFpmlElements; }
        public void setSourceFpmlElements(List<String> sourceFpmlElements) {
            this.sourceFpmlElements = sourceFpmlElements;
        }

        public List<String> getTargetCdmPaths() { return targetCdmPaths; }
        public void setTargetCdmPaths(List<String> targetCdmPaths) {
            this.targetCdmPaths = targetCdmPaths;
        }

        public List<String> getCookbookRules() { return cookbookRules; }
        public void setCookbookRules(List<String> cookbookRules) {
            this.cookbookRules = cookbookRules;
        }

        public List<String> getRosettaFunctions() { return rosettaFunctions; }
        public void setRosettaFunctions(List<String> rosettaFunctions) {
            this.rosettaFunctions = rosettaFunctions;
        }
    }
}