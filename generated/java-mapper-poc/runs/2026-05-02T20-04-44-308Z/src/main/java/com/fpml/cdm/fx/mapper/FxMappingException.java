package com.fpml.cdm.fx.mapper;

/**
 * Exception thrown when FpML to CDM mapping fails.
 */
public class FxMappingException extends Exception {

    public FxMappingException(String message) {
        super(message);
    }

    public FxMappingException(String message, Throwable cause) {
        super(message, cause);
    }

    public FxMappingException(UnsupportedProductException e) {
        super(e.getMessage(), e);
    }
}