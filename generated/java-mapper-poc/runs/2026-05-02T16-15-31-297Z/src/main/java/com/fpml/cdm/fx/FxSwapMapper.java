package com.fpml.cdm.fx;

/**
 * Placeholder mapper for FpML fxSwap products.
 *
 * Status: STUB - Not implemented in current scope.
 *
 * This mapper is a placeholder for future implementation of the fx-swap product group.
 * Currently returns an unsupported report when invoked.
 *
 * Planned implementation will handle:
 * - FX swap with near and far legs
 * - Dual currency exchanges
 * - Forward-forward swaps
 *
 * @see FxSingleLegMapper for reference implementation
 */
public class FxSwapMapper {


    /**
     * Returns an unsupported report for fxSwap products.
     *
     * @return JSON string describing that fxSwap is not yet supported
     */
    public String getUnsupportedReport() {
        return """
            {
                \