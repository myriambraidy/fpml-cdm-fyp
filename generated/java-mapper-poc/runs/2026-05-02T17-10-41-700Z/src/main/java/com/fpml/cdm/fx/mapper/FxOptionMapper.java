package com.fpml.cdm.fx.mapper;

import com.fpml.cdm.fx.model.CdmTrade;
import com.fpml.cdm.fx.model.CdmTrade.Counterparty;
import com.fpml.cdm.fx.model.CdmTrade.TradeIdentifier;
import com.fpml.cdm.fx.util.PartyResolver;
import com.fpml.cdm.fx.util.PartyResolver.PartyRole;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.List;

/**
 * Mapper for fxSimpleOption and fxDigitalOption products.
 * Handles FX vanilla options, barrier options, and digital options.
 */
public class FxOptionMapper {

    private final PartyResolver partyResolver;

    public FxOptionMapper(PartyResolver partyResolver) {
        this.partyResolver = partyResolver;
    }

    /**
     * Maps an fxOption/fxSimpleOption root to a CDM OptionPayout structure.
     * Returns null if the root is null or not an fxOption type.
     */
    public JsonNode mapFxSimpleOption(JsonNode fxRoot, JsonNode partiesNode, CdmTrade cdmTrade) {
        if (fxRoot == null) return null;
        
        // Detect which option type we have
        boolean isEuropean = false;
        boolean isAmerican = false;
        
        if (fxRoot.has("exerciseStyle")) {
            String style = fxRoot.get("exerciseStyle").asText();
            if ("European".equals(style)) isEuropean = true;
            else if ("American".equals(style)) isAmerican = true;
        }
        
        ObjectNode optionPayout = JsonUtil.createObjectNode();
        
        // Determine option type (Put or Call) from strike
        String optionType = "Put"; // default
        if (fxRoot.has("putCurrencyAmount") && fxRoot.has("callCurrencyAmount")) {
            // Put = putCurrencyAmount is the underlying, call is what you pay
            optionType = "Put";
        } else if (fxRoot.has("callCurrencyAmount") && fxRoot.has("putCurrencyAmount")) {
            optionType = "Call";
        }
        optionPayout.put("optionType", optionType);
        
        // Exercise terms
        ObjectNode exerciseTerms = mapExerciseTerms(fxRoot, isEuropean, isAmerican);
        optionPayout.set("exerciseTerms", exerciseTerms);
        
        // Settlement terms
        if (fxRoot.has("valueDate")) {
            ObjectNode settlementTerms = JsonUtil.createObjectNode();
            settlementTerms.put("settlementType", "Cash");
            ObjectNode settlementDate = JsonUtil.createObjectNode();
            ObjectNode adjDate = JsonUtil.createObjectNode();
            String valueDate = fxRoot.get("valueDate").asText().replace("Z", "");
            adjDate.put("adjustedDate", valueDate);
            settlementDate.set("adjustableDate", adjDate);
            settlementTerms.set("settlementDate", settlementDate);
            optionPayout.set("settlementTerms", settlementTerms);
        }
        
        // Cash settlement for NDO
        if (fxRoot.has("cashSettlementTerms")) {
            ObjectNode settlementTerms = (ObjectNode) optionPayout.get("settlementTerms");
            if (settlementTerms == null) {
                settlementTerms = JsonUtil.createObjectNode();
                optionPayout.set("settlementTerms", settlementTerms);
            }
            JsonNode cashSettle = fxRoot.get("cashSettlementTerms");
            if (cashSettle.has("settlementCurrency")) {
                settlementTerms.put("settlementCurrency", cashSettle.get("settlementCurrency").asText());
            }
            // Map fixing
            if (cashSettle.has("fixing")) {
                ObjectNode cashSettleTerms = JsonUtil.createObjectNode();
                ObjectNode valuationMethod = JsonUtil.createObjectNode();
                ObjectNode valuationSource = JsonUtil.createObjectNode();
                JsonNode fixing = cashSettle.get("fixing");
                if (fixing.has("quotedCurrencyPair")) {
                    JsonNode qcp = fixing.get("quotedCurrencyPair");
                    ObjectNode quotedCcyPair = JsonUtil.createObjectNode();
                    quotedCcyPair.put("currency1", qcp.has("currency1") ? qcp.get("currency1").asText() : "");
                    quotedCcyPair.put("currency2", qcp.has("currency2") ? qcp.get("currency2").asText() : "");
                    quotedCcyPair.put("quoteBasis", qcp.has("quoteBasis") ? qcp.get("quoteBasis").asText() : "");
                    valuationSource.set("quotedCurrencyPair", quotedCcyPair);
                }
                if (fixing.has("primaryRateSource")) {
                    JsonNode prs = fixing.get("primaryRateSource");
                    ObjectNode primarySource = JsonUtil.createObjectNode();
                    if (prs.has("rateSource")) primarySource.put("sourceProvider", prs.get("rateSource").asText());
                    if (prs.has("rateSourcePage")) primarySource.put("sourcePage", prs.get("rateSourcePage").asText());
                    valuationSource.set("primarySource", primarySource);
                }
                valuationMethod.set("valuationSource", valuationSource);
                cashSettleTerms.set("valuationMethod", valuationMethod);
                
                ObjectNode valuationDate = JsonUtil.createObjectNode();
                ObjectNode fxFixingDate = JsonUtil.createObjectNode();
                ObjectNode fxFixingDateAdj = JsonUtil.createObjectNode();
                if (fixing.has("fixingDate")) {
                    String fixingDate = fixing.get("fixingDate").asText().replace("Z", "");
                    fxFixingDateAdj.put("adjustedDate", fixingDate);
                    fxFixingDate.put("fxFixingDate", fxFixingDateAdj);
                    valuationDate.put("fxFixingDate", fxFixingDate);
                }
                cashSettleTerms.set("valuationDate", valuationDate);
                settlementTerms.set("cashSettlementTerms", cashSettleTerms);
            }
        }
        
        // Strike price
        if (fxRoot.has("fxStrikePrice")) {
            ObjectNode strike = JsonUtil.createObjectNode();
            ObjectNode strikePrice = JsonUtil.createObjectNode();
            JsonNode fxStrike = fxRoot.get("fxStrikePrice");
            strikePrice.put("value", fxStrike.has("rate") ? fxStrike.get("rate").asDouble() : 0.0);
            
            // Determine currency from put/call amounts
            String rateCurrency = "";
            String perUnitCurrency = "";
            if (fxRoot.has("putCurrencyAmount")) {
                rateCurrency = fxRoot.get("putCurrencyAmount").has("currency") 
                    ? fxRoot.get("putCurrencyAmount").get("currency").asText() : "";
            }
            if (fxRoot.has("callCurrencyAmount")) {
                perUnitCurrency = fxRoot.get("callCurrencyAmount").has("currency") 
                    ? fxRoot.get("callCurrencyAmount").get("currency").asText() : "";
            }
            ObjectNode unit = JsonUtil.createObjectNode();
            ObjectNode currency = JsonUtil.createObjectNode();
            currency.put("value", rateCurrency);
            unit.set("currency", currency);
            strikePrice.set("unit", unit);
            if (!perUnitCurrency.isEmpty()) {
                ObjectNode perUnitOf = JsonUtil.createObjectNode();
                ObjectNode perUnitCcy = JsonUtil.createObjectNode();
                perUnitCcy.put("value", perUnitCurrency);
                perUnitOf.put("currency", perUnitCcy);
                strikePrice.set("perUnitOf", perUnitOf);
            }
            strikePrice.put("priceType", "ExchangeRate");
            strike.set("strikePrice", strikePrice);
            optionPayout.set("strike", strike);
        }
        
        // Buyer/Seller - flip from FpML buyer/seller to CDM buyerSeller
        ObjectNode buyerSeller = JsonUtil.createObjectNode();
        if (fxRoot.has("buyerPartyReference")) {
            String buyerHref = fxRoot.get("buyerPartyReference").has("href") 
                ? fxRoot.get("buyerPartyReference").get("href").asText() 
                : fxRoot.get("buyerPartyReference").asText();
            String buyerPartyRole = partyResolver.resolveRole(buyerHref);
            buyerSeller.put("buyer", buyerPartyRole);
            buyerSeller.put("seller", PartyRole.otherParty(buyerPartyRole));
        }
        optionPayout.set("buyerSeller", buyerSeller);
        
        // Payer/Receiver for premium (if present)
        if (fxRoot.has("fxOptionPremium")) {
            ObjectNode payerReceiver = JsonUtil.createObjectNode();
            JsonNode premium = fxRoot.get("fxOptionPremium");
            if (premium.has("payerPartyReference")) {
                String payerHref = premium.get("payerPartyReference").has("href") 
                    ? premium.get("payerPartyReference").get("href").asText() 
                    : premium.get("payerPartyReference").asText();
                payerReceiver.put("payer", partyResolver.resolveRole(payerHref));
            }
            if (premium.has("receiverPartyReference")) {
                String recvHref = premium.get("receiverPartyReference").has("href") 
                    ? premium.get("receiverPartyReference").get("href").asText() 
                    : premium.get("receiverPartyReference").asText();
                payerReceiver.put("receiver", partyResolver.resolveRole(recvHref));
            }
            optionPayout.set("payerReceiver", payerReceiver);
        }
        
        // Quantity schedule from put/call amounts
        ObjectNode priceQuantity = mapPriceQuantity(fxRoot);
        optionPayout.set("priceQuantity", priceQuantity);
        
        return optionPayout;
    }

    private ObjectNode mapExerciseTerms(JsonNode fxRoot, boolean isEuropean, boolean isAmerican) {
        ObjectNode exerciseTerms = JsonUtil.createObjectNode();
        
        if (isEuropean) {
            exerciseTerms.put("style", "European");
        } else if (isAmerican) {
            exerciseTerms.put("style", "American");
            // Commencement date for American options
            if (fxRoot.has("expiryDateTime")) {
                ObjectNode commencementDate = JsonUtil.createObjectNode();
                ObjectNode adjDate = JsonUtil.createObjectNode();
                ObjectNode dateAdjustments = JsonUtil.createObjectNode();
                dateAdjustments.put("businessDayConvention", "FOLLOWING");
                if (fxRoot.has("exerciseStyle")) {
                    // USNY business center for FX American options
                }
                adjDate.set("dateAdjustments", dateAdjustments);
                commencementDate.set("adjustableDate", adjDate);
                exerciseTerms.set("commencementDate", commencementDate);
            }
        }
        
        // Expiration date/time
        if (fxRoot.has("expiryDateTime")) {
            JsonNode expiryDt = fxRoot.get("expiryDateTime");
            
            ArrayNode expirationDate = JsonUtil.createArrayNode();
            ObjectNode expDate = JsonUtil.createObjectNode();
            ObjectNode adjDate = JsonUtil.createObjectNode();
            if (expiryDt.has("expiryDate")) {
                String expDateStr = expiryDt.get("expiryDate").asText().replace("Z", "");
                adjDate.put("adjustedDate", expDateStr);
            }
            expDate.set("adjustableDate", adjDate);
            expirationDate.add(expDate);
            exerciseTerms.set("expirationDate", expirationDate);
            
            if (expiryDt.has("expiryTime")) {
                ObjectNode expirationTime = JsonUtil.createObjectNode();
                JsonNode expTime = expiryDt.get("expiryTime");
                if (expTime.has("hourMinuteTime")) {
                    expirationTime.put("hourMinuteTime", expTime.get("hourMinuteTime").asText());
                }
                if (expTime.has("businessCenter")) {
                    expirationTime.put("businessCenter", expTime.get("businessCenter").asText());
                }
                expirationTime.put("expirationTimeType", "SpecificTime");
                exerciseTerms.set("expirationTime", expirationTime);
            }
        }
        
        return exerciseTerms;
    }

    private ObjectNode mapPriceQuantity(JsonNode fxRoot) {
        ObjectNode priceQuantity = JsonUtil.createObjectNode();
        
        ArrayNode quantitySchedule = JsonUtil.createArrayNode();
        
        // Map put currency amount
        if (fxRoot.has("putCurrencyAmount")) {
            JsonNode putAmt = fxRoot.get("putCurrencyAmount");
            ObjectNode q1 = JsonUtil.createObjectNode();
            ObjectNode qty = JsonUtil.createObjectNode();
            ObjectNode value = JsonUtil.createObjectNode();
            value.put("value", putAmt.has("amount") ? putAmt.get("amount").asDouble() : 0.0);
            ObjectNode unit = JsonUtil.createObjectNode();
            ObjectNode ccy = JsonUtil.createObjectNode();
            ccy.put("value", putAmt.has("currency") ? putAmt.get("currency").asText() : "");
            unit.set("currency", ccy);
            value.set("unit", unit);
            qty.set("value", value);
            
            ObjectNode addr = JsonUtil.createObjectNode();
            addr.put("scope", "DOCUMENT");
            addr.put("value", "quantity-2");
            qty.set("address", addr);
            quantitySchedule.add(qty);
        }
        
        // Map call currency amount
        if (fxRoot.has("callCurrencyAmount")) {
            JsonNode callAmt = fxRoot.get("callCurrencyAmount");
            ObjectNode q2 = JsonUtil.createObjectNode();
            ObjectNode qty = JsonUtil.createObjectNode();
            ObjectNode value = JsonUtil.createObjectNode();
            value.put("value", callAmt.has("amount") ? callAmt.get("amount").asDouble() : 0.0);
            ObjectNode unit = JsonUtil.createObjectNode();
            ObjectNode ccy = JsonUtil.createObjectNode();
            ccy.put("value", callAmt.has("currency") ? callAmt.get("currency").asText() : "");
            unit.set("currency", ccy);
            value.set("unit", unit);
            qty.set("value", value);
            
            ObjectNode addr = JsonUtil.createObjectNode();
            addr.put("scope", "DOCUMENT");
            addr.put("value", "quantity-1");
            qty.set("address", addr);
            quantitySchedule.add(qty);
        }
        
        priceQuantity.set("quantitySchedule", quantitySchedule);
        return priceQuantity;
    }

    /**
     * Maps an fxDigitalOption root to a CDM OptionPayout structure.
     */
    public JsonNode mapFxDigitalOption(JsonNode fxRoot, JsonNode partiesNode, CdmTrade cdmTrade) {
        if (fxRoot == null) return null;
        
        ObjectNode optionPayout = JsonUtil.createObjectNode();
        
        // Digital options are always European-style
        ObjectNode exerciseTerms = JsonUtil.createObjectNode();
        exerciseTerms.put("style", "European");
        
        // Expiration date/time
        if (fxRoot.has("expiryDateTime")) {
            JsonNode expiryDt = fxRoot.get("expiryDateTime");
            
            ArrayNode expirationDate = JsonUtil.createArrayNode();
            ObjectNode expDate = JsonUtil.createObjectNode();
            ObjectNode adjDate = JsonUtil.createObjectNode();
            if (expiryDt.has("expiryDate")) {
                String expDateStr = expiryDt.get("expiryDate").asText().replace("Z", "");
                adjDate.put("adjustedDate", expDateStr);
            }
            expDate.set("adjustableDate", adjDate);
            expirationDate.add(expDate);
            exerciseTerms.set("expirationDate", expirationDate);
            
            if (expiryDt.has("expiryTime")) {
                ObjectNode expirationTime = JsonUtil.createObjectNode();
                JsonNode expTime = expiryDt.get("expiryTime");
                if (expTime.has("hourMinuteTime")) {
                    expirationTime.put("hourMinuteTime", expTime.get("hourMinuteTime").asText());
                }
                if (expTime.has("businessCenter")) {
                    expirationTime.put("businessCenter", expTime.get("businessCenter").asText());
                }
                expirationTime.put("expirationTimeType", "SpecificTime");
                exerciseTerms.set("expirationTime", expirationTime);
            }
        }
        
        optionPayout.set("exerciseTerms", exerciseTerms);
        
        // Settlement date
        if (fxRoot.has("valueDate")) {
            ObjectNode settlementTerms = JsonUtil.createObjectNode();
            ObjectNode settlementDate = JsonUtil.createObjectNode();
            String valueDate = fxRoot.get("valueDate").asText().replace("Z", "");
            settlementDate.put("valueDate", valueDate);
            settlementTerms.set("settlementDate", settlementDate);
            optionPayout.set("settlementTerms", settlementTerms);
        }
        
        // Buyer/Seller
        ObjectNode buyerSeller = JsonUtil.createObjectNode();
        if (fxRoot.has("buyerPartyReference")) {
            String buyerHref = fxRoot.get("buyerPartyReference").has("href") 
                ? fxRoot.get("buyerPartyReference").get("href").asText() 
                : fxRoot.get("buyerPartyReference").asText();
            String buyerPartyRole = partyResolver.resolveRole(buyerHref);
            buyerSeller.put("buyer", buyerPartyRole);
            buyerSeller.put("seller", PartyRole.otherParty(buyerPartyRole));
        }
        optionPayout.set("buyerSeller", buyerSeller);
        
        // Payer/Receiver
        ObjectNode payerReceiver = JsonUtil.createObjectNode();
        if (fxRoot.has("fxOptionPremium")) {
            JsonNode premium = fxRoot.get("fxOptionPremium");
            if (premium.has("payerPartyReference")) {
                String payerHref = premium.get("payerPartyReference").has("href") 
                    ? premium.get("payerPartyReference").get("href").asText() 
                    : premium.get("payerPartyReference").asText();
                payerReceiver.put("payer", partyResolver.resolveRole(payerHref));
            }
            if (premium.has("receiverPartyReference")) {
                String recvHref = premium.get("receiverPartyReference").has("href") 
                    ? premium.get("receiverPartyReference").get("href").asText() 
                    : premium.get("receiverPartyReference").asText();
                payerReceiver.put("receiver", partyResolver.resolveRole(recvHref));
            }
        }
        optionPayout.set("payerReceiver", payerReceiver);
        
        return optionPayout;
    }

    /**
     * Maps fxBarrierOption to CDM OptionPayout with barrier features.
     */
    public JsonNode mapFxBarrierOption(JsonNode fxRoot, JsonNode partiesNode, CdmTrade cdmTrade) {
        ObjectNode optionPayout = mapFxSimpleOption(fxRoot, partiesNode, cdmTrade);
        if (optionPayout == null) return null;
        
        // Add barrier information if present
        if (fxRoot.has("fxBarrier")) {
            JsonNode barrier = fxRoot.get("fxBarrier");
            ObjectNode fxBarrierFeature = JsonUtil.createObjectNode();
            
            if (barrier.isArray()) {
                // Double barrier - add array of barriers
                ArrayNode barriers = JsonUtil.createArrayNode();
                for (JsonNode b : barrier) {
                    ObjectNode barrierInfo = JsonUtil.createObjectNode();
                    if (b.has("fxBarrierType")) {
                        barrierInfo.put("fxBarrierType", b.get("fxBarrierType").asText());
                    }
                    if (b.has("triggerRate")) {
                        barrierInfo.put("triggerRate", b.get("triggerRate").asDouble());
                    }
                    barriers.add(barrierInfo);
                }
                fxBarrierFeature.set("fxBarrier", barriers);
            } else {
                // Single barrier
                ObjectNode barrierInfo = JsonUtil.createObjectNode();
                if (barrier.has("fxBarrierType")) {
                    barrierInfo.put("fxBarrierType", barrier.get("fxBarrierType").asText());
                }
                if (barrier.has("triggerRate")) {
                    barrierInfo.put("triggerRate", barrier.get("triggerRate").asDouble());
                }
                fxBarrierFeature.set("fxBarrier", barrierInfo);
            }
            optionPayout.set("fxBarrierFeature", fxBarrierFeature);
        }
        
        return optionPayout;
    }
}