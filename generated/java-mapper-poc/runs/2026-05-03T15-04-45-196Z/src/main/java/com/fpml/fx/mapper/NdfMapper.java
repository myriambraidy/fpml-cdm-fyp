package com.fpml.fx.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import java.math.BigDecimal;

/**
 * Helper mapper for Non-Deliverable Forward (NDF) FX products.
 * Maps fx-ex07-non-deliverable-forward.xml to CDM.
 * Referenced Rosetta functions: MapFxSingleLegEconomicTerms (NDF branch).
 */
public class NdfMapper {

    private final ObjectNode rootNode;
    private final StringBuilder report;

    public NdfMapper(ObjectNode rootNode, StringBuilder report) {
        this.rootNode = rootNode;
        this.report = report;
    }

    /**
     * Detects NDF from FpML nonDeliverableForward element.
     */
    public boolean isNdf(ObjectNode fxSingleLeg) {
        return fxSingleLeg.has("nonDeliverableForward");
    }

    /**
     * Maps NDF settlementCurrency to settlementTerms.settlementCurrency.value.
     * Source: nonDeliverableForward/settlementCurrency (FpML)
     * Target: settlementTerms.settlementCurrency.value (CDM)
     */
    public void mapSettlementCurrency(ObjectNode fxSingleLeg, ObjectNode settlementTerms) {
        ObjectNode ndf = (ObjectNode) fxSingleLeg.get("nonDeliverableForward");
        if (ndf == null || !ndf.has("settlementCurrency")) {
            report.append("WARNING: NDF settlementCurrency not found\n");
            return;
        }
        String settlementCurrency = ndf.get("settlementCurrency").asText();
        ObjectNode sc = mapper.MappingUtils.createObjectNode();
        sc.put("value", settlementCurrency);
        settlementTerms.set("settlementCurrency", sc);
        report.append("TRACE: NDF settlementCurrency=").append(settlementCurrency).append("\n");
    }

    /**
     * Maps NDF fixing details to cashSettlementTerms.
     * Source: nonDeliverableForward/fixing/fixingDate, fixingTime, rateSource (FpML)
     * Target: cashSettlementTerms[0].valuationMethod.valuationSource (CDM)
     */
    public void mapFixing(ObjectNode fxSingleLeg, ObjectNode settlementTerms) {
        ObjectNode ndf = (ObjectNode) fxSingleLeg.get("nonDeliverableForward");
        if (ndf == null || !ndf.has("fixing")) {
            report.append("WARNING: NDF fixing not found\n");
            return;
        }
        ObjectNode fixing = (ObjectNode) ndf.get("fixing");
        ObjectNode css = mapper.MappingUtils.createObjectNode();
        ObjectNode vm = mapper.MappingUtils.createObjectNode();
        ObjectNode vs = mapper.MappingUtils.createObjectNode();
        if (fixing.has("primaryRateSource")) {
            ObjectNode prs = (ObjectNode) fixing.get("primaryRateSource");
            ObjectNode primarySource = mapper.MappingUtils.createObjectNode();
            ObjectNode sp = mapper.MappingUtils.createObjectNode();
            sp.put("value", prs.has("rateSource") ? prs.get("rateSource").asText() : "Reuters");
            primarySource.set("sourceProvider", sp);
            if (prs.has("rateSourcePage")) {
                ObjectNode page = mapper.MappingUtils.createObjectNode();
                page.put("value", prs.get("rateSourcePage").asText());
                primarySource.set("sourcePage", page);
            }
            ObjectNode qcp = mapper.MappingUtils.createObjectNode();
            if (fixing.has("quotedCurrencyPair")) {
                ObjectNode qcpFpml = (ObjectNode) fixing.get("quotedCurrencyPair");
                qcp.put("currency1", MapperTest.parseCurrency(qcpFpml, "currency1"));
                qcp.put("currency2", MapperTest.parseCurrency(qcpFpml, "currency2"));
                if (qcpFpml.has("quoteBasis")) {
                    qcp.put("quoteBasis", qcpFpml.get("quoteBasis").asText());
                }
            }
            vs.set("quotedCurrencyPair", qcp);
            vs.set("primarySource", primarySource);
        }
        vm.set("valuationSource", vs);
        css.set("valuationMethod", vm);
        if (fixing.has("fixingDate")) {
            String fixingDate = fixing.get("fixingDate").asText().replace("Z", "");
            ObjectNode vd = mapper.MappingUtils.createObjectNode();
            ObjectNode ffd = mapper.MappingUtils.createObjectNode();
            ObjectNode adj = mapper.MappingUtils.createObjectNode();
            ObjectNode ad = mapper.MappingUtils.createObjectNode();
            ad.put("value", fixingDate);
            adj.set("adjustedDate", ad);
            ffd.set("adjustableDate", adj);
            ObjectNode fxFixingDate = mapper.MappingUtils.createObjectNode();
            fxFixingDate.set("fxFixingDate", ffd);
            ObjectNode valuationDate = mapper.MappingUtils.createObjectNode();
            valuationDate.set("fxFixingDate", fxFixingDate);
            css.set("valuationDate", valuationDate);
        }
        if (fixing.has("fixingTime")) {
            ObjectNode ft = (ObjectNode) fixing.get("fixingTime");
            ObjectNode valuationTime = mapper.MappingUtils.createObjectNode();
            if (ft.has("hourMinuteTime")) {
                valuationTime.put("hourMinuteTime", ft.get("hourMinuteTime").asText());
            }
            if (ft.has("businessCenter")) {
                ObjectNode bc = mapper.MappingUtils.createObjectNode();
                bc.put("value", ft.get("businessCenter").asText());
                valuationTime.set("businessCenter", bc);
            }
            css.set("valuationTime", valuationTime);
        }
        settlementTerms.set("cashSettlementTerms", mapper.MappingUtils.createArrayNode().add(css));
        report.append("TRACE: NDF fixing mapped to cashSettlementTerms\n");
    }
}
