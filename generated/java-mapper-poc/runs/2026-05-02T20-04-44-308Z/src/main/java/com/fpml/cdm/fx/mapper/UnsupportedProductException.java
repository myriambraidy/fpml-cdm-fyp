package com.fpml.cdm.fx.mapper;

/**
 * Exception thrown when an unsupported product type is encountered.
 */
public class UnsupportedProductException extends RuntimeException {

    public UnsupportedProductException(String message) {
        super(message);
    }

    public static UnsupportedProductException UNSUPPORTED_ROOT(String rootTag) {
        return new UnsupportedProductException(“Unsupported root element: “ + rootTag + “. Expected FpML.”);
    }

    public static UnsupportedProductException NO_TRADE_ELEMENT() {
        return new UnsupportedProductException(“No trade element found in FpML document.”);
    }

    public static UnsupportedProductException PRODUCT_NOT_IN_SCOPE(String productType, String productGroup) {
        return new UnsupportedProductException(productType + “ (“ + productGroup + “) is not in scope for this implementation group.”);
    }

    public static UnsupportedProductException UNKNOWN_PRODUCT() {
        return new UnsupportedProductException(“Unknown or unsupported FX product type.”);
    }

    public static UnsupportedProductException MISSING_ELEMENT(String elementName) {
        return new UnsupportedProductException(“Missing required element: “ + elementName);
    }

    public static UnsupportedProductException PARSE_ERROR(String filePath, String errorMessage) {
        return new UnsupportedProductException(“Error parsing FpML file “ + filePath + “: “ + errorMessage);
    }
}