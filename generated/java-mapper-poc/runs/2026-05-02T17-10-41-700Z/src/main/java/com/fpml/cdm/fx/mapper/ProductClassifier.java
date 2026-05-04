package com.fpml.cdm.fx.mapper;

import com.fpml.cdm.fx.model.MapperReport;
import org.w3c.dom.*;

/**
 * Classifier that detects which product type is present in an FpML trade document.
 * Supports fx-single-leg, fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option,
 * fx-average-rate-option, fx-strategy, and non-FX (termDeposit) product groups.
 */
public class ProductClassifier {

    public static final String FX_SINGLE_LEG = "fx-single-leg";
    public static final String FX_SWAP = "fx-swap";
    public static final String FX_SIMPLE_OPTION = "fx-simple-option";
    public static final String FX_DIGITAL_OPTION = "fx-digital-option";
    public static final String FX_BARRIER_OPTION = "fx-barrier-option";
    public static final String FX_AVERAGE_RATE_OPTION = "fx-average-rate-option";
    public static final String FX_STRATEGY = "fx-strategy";
    public static final String NON_FX = "non-fx";
    public static final String UNSUPPORTED = "unsupported";

    /**
     * Classifies the product type of the given trade element.
     *
     * @param tradeEl the trade DOM element
     * @return one of the product group constants
     */
    public static String classify(Element tradeEl) {
        if (tradeEl == null) {
            return UNSUPPORTED;
        }

        NodeList children = tradeEl.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() != Node.ELEMENT_NODE) continue;
            String localName = child.getLocalName() != null ? child.getLocalName() : child.getNodeName();

            switch (localName) {
                case "fxSingleLeg":
                    return FX_SINGLE_LEG;
                case "fxSwap":
                    return FX_SWAP;
                case "fxSimpleOption":
                    return FX_SIMPLE_OPTION;
                case "fxDigitalOption":
                    return FX_DIGITAL_OPTION;
                case "fxBarrierOption":
                    return FX_BARRIER_OPTION;
                case "fxAverageRateOption":
                    return FX_AVERAGE_RATE_OPTION;
                case "strategy":
                    return FX_STRATEGY;
                case "termDeposit":
                    return NON_FX;
            }
        }

        return UNSUPPORTED;
    }

    /**
     * Returns true if the given product group is in scope for this implementation.
     * fx-single-leg is the only in-scope group; all others are unsupported.
     */
    public static boolean isInScope(String productGroup) {
        return FX_SINGLE_LEG.equals(productGroup);
    }

    /**
     * Returns the appropriate mapper class name for the given product group.
     */
    public static String getMapperClass(String productGroup) {
        switch (productGroup) {
            case FX_SINGLE_LEG:
                return FxSingleLegMapper.class.getName();
            case FX_SWAP:
                return FxSwapMapper.class.getName();
            case FX_SIMPLE_OPTION:
                return FxOptionMapper.class.getName();
            case FX_DIGITAL_OPTION:
                return FxOptionMapper.class.getName();
            case FX_BARRIER_OPTION:
                return FxOptionMapper.class.getName();
            case FX_AVERAGE_RATE_OPTION:
                return FxOptionMapper.class.getName();
            default:
                return null;
        }
    }

    /**
     * Logs an unsupported product warning to the mapper report.
     */
    public static MapperReport.UnsupportedProductLog unsupportedProduct(String fpmlPath, String productGroup, String reason) {
        MapperReport.UnsupportedProductLog log = new MapperReport.UnsupportedProductLog();
        log.fpmlPath = fpmlPath;
        log.productGroup = productGroup;
        log.reason = reason;
        return log;
    }
}
