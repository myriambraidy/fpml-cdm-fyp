package com.fpml.cdm.fx.mapper.generated;

import cdm.base.datetime.BusinessCenter;
import cdm.base.datetime.BusinessDayConventionEnum;
import cdm.product.common.settlement.CashSettlementTerms;
import cdm.product.common.settlement.SettlementDate;
import cdm.product.common.settlement.SettlementTerms;
import cdm.product.common.settlement.SettlementTypeEnum;
import com.rosetta.model.metafields.FieldWithMetaDate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Maps FpML valueDate to CDM SettlementDate and nonDeliverableSettlement to CashSettlementTerms.
 * Rosetta function: MapFxCashSettlementToSettlementTerms.
 */
public class SettlementMapper {

    private final XPath xpath;
    private static final DateTimeFormatter FpML_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public SettlementMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
    }

    /**
     * Build SettlementTerms from FpML valueDate element.
     * Rosetta: MapFxCashSettlementToSettlementTerms.
     * @param doc FpML document
     * @return SettlementTerms
     */
    public SettlementTerms buildSettlementTerms(Document doc) {
        try {
            String valueDateStr = xpath.evaluate("//valueDate", doc);
            if (valueDateStr == null || valueDateStr.isEmpty()) {
                valueDateStr = xpath.evaluate("//valueDate/date", doc);
            }

            LocalDate valueDate = parseDate(valueDateStr);
            if (valueDate == null) {
                return null;
            }

            SettlementDate.Builder sdBuilder = SettlementDate.builder()
                    .setValue(FieldWithMetaDate.builder()
                            .setValue(valueDate)
                            .build());

            // Determine settlement type based on product type
            String productType = xpath.evaluate("//productType", doc);
            SettlementTypeEnum settleType = determineSettlementType(doc);

            return SettlementTerms.builder()
                    .setSettlementDate(sdBuilder.build())
                    .setSettlementType(settleType)
                    .build();
        } catch (Exception e) {
            // log and continue
            return null;
        }
    }

    /**
     * Build CashSettlementTerms for NDF (non-deliverable forward) products.
     * Rosetta: MapFxCashSettlementToCashSettlementTerms.
     * @param doc FpML document
     * @return CashSettlementTerms
     */
    public CashSettlementTerms buildNdfCashSettlementTerms(Document doc) {
        try {
            String currency = xpath.evaluate("//nonDeliverableSettlement/settlementCurrency", doc);
            String fixingDate = xpath.evaluate("//nonDeliverableSettlement/fixingDate", doc);

            LocalDate fixDate = parseDate(fixingDate);

            CashSettlementTerms.Builder cashBuilder = CashSettlementTerms.builder()
                    .setSettlementType(SettlementTypeEnum.CASH);

            if (currency != null && !currency.isEmpty()) {
                cashBuilder.setSettlementCurrency(com.rosetta.model.metafields.FieldWithMetaString.builder()
                        .setValue(currency)
                        .build());
            }

            if (fixDate != null) {
                cashBuilder.setSettlementDate(SettlementDate.builder()
                        .setValue(FieldWithMetaDate.builder()
                                .setValue(fixDate)
                                .build())
                        .build());
            }

            return cashBuilder.build();
        } catch (Exception e) {
            // log and continue
            return null;
        }
    }

    /**
     * Determine settlement type based on FpML product characteristics.
     */
    private SettlementTypeEnum determineSettlementType(Document doc) {
        try {
            // Check for nonDeliverableSettlement element
            String ndf = xpath.evaluate("//nonDeliverableSettlement", doc);
            if (ndf != null && !ndf.isEmpty()) {
                return SettlementTypeEnum.CASH;
            }
            // Check for settlementCurrency in valueDate
            String settleCurrency = xpath.evaluate("//valueDate/settlementCurrency", doc);
            if (settleCurrency != null && !settleCurrency.isEmpty()) {
                return SettlementTypeEnum.CASH;
            }
        } catch (Exception e) {
            // fall through
        }
        return SettlementTypeEnum.CASH;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr.trim(), FpML_DATE_FORMAT);
        } catch (Exception e) {
            // Try alternate format
            try {
                return LocalDate.parse(dateStr.trim());
            } catch (Exception e2) {
                return null;
            }
        }
    }
}
