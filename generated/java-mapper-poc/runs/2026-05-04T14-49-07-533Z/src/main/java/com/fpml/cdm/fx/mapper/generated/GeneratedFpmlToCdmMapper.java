package com.fpml.cdm.fx.mapper.generated;

import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import com.fpml.cdm.fx.mapper.generated.FpmlParsers;
import com.fpml.cdm.fx.mapper.generated.FxSingleLegMappers;
import com.fpml.cdm.fx.mapper.generated.PartyMappers;
import com.fpml.cdm.fx.mapper.generated.TradeMappers;
import com.fpml.cdm.fx.mapper.generated.AssignedIdentifier;

import cdm.event.common.Trade;
import cdm.event.common.TradeState;
import cdm.product.template.NonTransferableProduct;
import cdm.product.template.EconomicTerms;
import cdm.product.template.Payout;
import cdm.product.common.settlement.SettlementPayout;
import cdm.observable.asset.ResolvablePriceQuantity;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.Party;

import java.io.File;
import java.util.List;

/**
 * Generated FpML to CDM Mapper
 * 
 * Primary entry point for mapping FpML FX single-leg products to CDM.
 * Implements FpmlToCdmMapper interface and invokes generated mapping logic.
 * 
 * Rosetta source: 
 * - ingest-fpml-confirmation-product-fxsingleleg-func.rosetta
 * - MapFxSingleLegNonTransferableProduct
 */
public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper {

    /**
     * Map FpML file to CDM Trade.
     * @param fpmlFile FpML XML file
     * @return Result containing CDM Trade and traceability info
     */
    @Override
    public FpmlToCdmMapper.Result mapFpmlToCdm(File fpmlFile) {
        try {
            // Parse FpML XML
            FpmlParsers.FpmlSingleLegParseResult parseResult = 
                FpmlParsers.parseSingleLeg(fpmlFile);
            
            // Extract exchanged currency info
            FpmlParsers.ExchangedCurrencyInfo exchangedCurrency = 
                FpmlParsers.extractExchangedCurrency(parseResult.fxCoreDetailsModel);
            
            // Extract value date
            String valueDate = FpmlParsers.extractValueDate(parseResult.fxCoreDetailsModel);
            
            // Extract non-deliverable settlement info
            FpmlParsers.NonDeliverableInfo ndfInfo = 
                FpmlParsers.extractNonDeliverableSettlement(parseResult.fxCoreDetailsModel);
            
            // Build party/counterparty list (Rosetta: MapFxSingleLegCounterpartyList)
            List<Counterparty> counterpartyList = 
                FxSingleLegMappers.MapFxSingleLegCounterpartyList(
                    parseResult.fxCoreDetailsModel);
            
            // Build ancillary parties (Rosetta: MapFxSingleLegAncillaryPartyList)
            // Empty for now, extend as needed
            
            // Build NonTransferableProduct with EconomicTerms
            NonTransferableProduct product = FxSingleLegMappers.MapFxSingleLegNonTransferableProduct(
                parseResult.productModel,
                counterpartyList,
                parseResult.fxCoreDetailsModel,
                valueDate,
                ndfInfo);
            
            // Build Trade with product
            Trade trade = TradeMappers.buildTrade(product, parseResult.parties);
            
            // Build TradeState wrapper
            TradeState tradeState = TradeMappers.buildTradeState(trade);
            
            return new FpmlToCdmMapper.Result(tradeState, null);
            
        } catch (Exception e) {
            return new FpmlToCdmMapper.Result(null, e);
        }
    }
    
    /**
     * Map FpML content string to CDM Trade.
     * @param fpmlContent FpML XML content as string
     * @return Result containing CDM Trade and traceability info
     */
    @Override
    public FpmlToCdmMapper.Result mapFpmlStringToCdm(String fpmlContent) {
        // Delegate to file-based mapping with temp file
        try {
            File tempFile = File.createTempFile(
                FpmlToCdmMapper.class.getName(), 
                FpmlToCdmMapper.class.getName().contains(
                    FpmlToCdmMapper.class.getName()) 
                    ? FpmlToCdmMapper.class.getName() : null);
            tempFile.deleteOnExit();
            
            java.nio.file.Files.write(
                tempFile.toPath(), 
                fpmlContent.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            
            return mapFpmlToCdm(tempFile);
            
        } catch (Exception e) {
            return new FpmlToCdmMapper.Result(null, e);
        }
    }
}