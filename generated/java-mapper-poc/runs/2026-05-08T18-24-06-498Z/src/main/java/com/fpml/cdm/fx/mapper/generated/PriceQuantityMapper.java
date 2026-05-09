package com.fpml.cdm.fx.mapper.generated;

import cdm.base.math.Rounding;
import cdm.base.math.UnitType;
import cdm.observable.asset.PriceSchedule;
import cdm.product.common.settlement.ResolvablePriceQuantity;
import com.rosetta.model.metafields.FieldWithMetaString;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.math.BigDecimal;

/**
 * Maps FpML exchange rates to CDM PriceSchedule and amounts to ResolvablePriceQuantity.
 * Rosetta functions: MapFxCoreDetailsModelPriceWithAddress, MapFxCoreDetailsModelQuantityWithAddress,
 * MapFxCoreDetailsModelPriceListWithLocation.
 */
public class PriceQuantityMapper {

    private final XPath xpath;

    public PriceQuantityMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
    }

    /**
     * Build ResolvablePriceQuantity from FpML fx element.
     * Handles spotRate, forwardPoints, and dual currency amounts.
     * @param doc FpML document
     * @return ResolvablePriceQuantity
     */
    public ResolvablePriceQuantity buildPriceQuantity(Document doc) {
        try {
            // Extract base currency amount
            String baseCurrencyAmount = xpath.evaluate("//fxSpotTrade/@baseCurrencyAmount", doc);
            String baseCurrency = xpath.evaluate("//fxSingleLeg/@baseCurrency", doc);

            // Extract quoted currency amount
            String quotedCurrencyAmount = xpath.evaluate("//fxSpotTrade/@quotedCurrencyAmount", doc);
            String quotedCurrency = xpath.evaluate("//fxSingleLeg/@quoteCurrency", doc);

            // Extract exchange rate (spot rate)
            String spotRateStr = xpath.evaluate("//spotRate", doc);
            BigDecimal spotRate = parseDecimal(spotRateStr);

            // Extract forward points (for forward trades)
            String forwardPointsStr = xpath.evaluate("//forwardPoints", doc);
            BigDecimal forwardPoints = parseDecimal(forwardPointsStr);

            // Build price schedule from exchange rate
            PriceSchedule priceSchedule = buildPriceSchedule(spotRate, forwardPoints,
                    baseCurrency, quotedCurrency, doc);

            // Build quantity schedule(s) from amounts
            ResolvablePriceQuantity.Builder rpqBuilder = ResolvablePriceQuantity.builder();
            if (priceSchedule != null) {
                rpqBuilder.setPrice(priceSchedule);
            }

            // Add base leg quantity
            if (baseCurrencyAmount != null && !baseCurrencyAmount.isEmpty()) {
                BigDecimal baseAmt = parseDecimal(baseCurrencyAmount);
                if (baseAmt != null) {
                    cdm.base.math.NonNegativeQuantity nonNegBase = cdm.base.math.NonNegativeQuantity.builder()
                            .setAmount(com.rosetta.model.metafields.FieldWithMetaDecimal.builder()
                                    .setValue(baseAmt)
                                    .build())
                            .setUnit(buildUnitType(baseCurrency))
                            .build();
                    rpqBuilder.addQuantity(nonNegBase);
                }
            }

            // Add quoted leg quantity
            if (quotedCurrencyAmount != null && !quotedCurrencyAmount.isEmpty()) {
                BigDecimal quotedAmt = parseDecimal(quotedCurrencyAmount);
                if (quotedAmt != null) {
                    cdm.base.math.NonNegativeQuantity nonNegQuote = cdm.base.math.NonNegativeQuantity.builder()
                            .setAmount(com.rosetta.model.metafields.FieldWithMetaDecimal.builder()
                                    .setValue(quotedAmt)
                                    .build())
                            .setUnit(buildUnitType(quotedCurrency))
                            .build();
                    rpqBuilder.addQuantity(nonNegQuote);
                }
            }

            return rpqBuilder.build();
        } catch (Exception e) {
            // log and continue
            return ResolvablePriceQuantity.builder().build();
        }
    }

    /**
     * Build PriceSchedule from spot rate and optional forward points.
     * Rosetta: MapFxCoreDetailsModelPriceWithAddress.
     */
    private PriceSchedule buildPriceSchedule(BigDecimal spotRate, BigDecimal forwardPoints,
                                              String baseCurrency, String quotedCurrency, Document doc) {
        // Compute effective rate: spot + forwardPoints for forwards
        BigDecimal effectiveRate = spotRate;
        if (forwardPoints != null && spotRate != null) {
            // Forward rate = spot + forwardPoints
            effectiveRate = spotRate.add(forwardPoints);
        }

        if (effectiveRate == null) {
            return null;
        }

        PriceSchedule.Builder psBuilder = PriceSchedule.builder()
                .setValue(com.rosetta.model.metafields.FieldWithMetaDecimal.builder()
                        .setValue(effectiveRate)
                        .build());

        // Set unit
        if (baseCurrency != null && quotedCurrency != null) {
            UnitType unit = UnitType.builder()
                    .setCurrencyUnit(com.rosetta.model.metafields.FieldWithMetaString.builder()
                            .setValue(quotedCurrency)
                            .build())
                    .build();
            psBuilder.setUnit(unit);
        }

        // Set measure type for FX
        psBuilder.setMeasureType(FieldWithMetaString.builder()
                .setValue("FX Rate")
                .build());

        return psBuilder.build();
    }

    private UnitType buildUnitType(String currency) {
        if (currency == null || currency.isEmpty()) {
            return UnitType.builder().build();
        }
        return UnitType.builder()
                .setCurrencyUnit(FieldWithMetaString.builder()
                        .setValue(currency)
                        .build())
                .build();
    }

    private BigDecimal parseDecimal(String value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
