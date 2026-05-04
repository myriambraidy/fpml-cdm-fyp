package com.fpml.cdm.fx;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.fasterxml.jackson.databind.node.DoubleNode;
import com.fasterxml.jackson.databind.node.IntNode;

import java.util.Map;
import java.util.LinkedHashMap;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Shared conversion utilities for FX mappers.
 * Contains common transformation functions used across product mappers.
 */
public class FxConverter {

    private static final Pattern DATE_PATTERN = Pattern.compile("(\\d{4}-\"d{2}-\"d{2})(Z)?");

    /**
     * Normalizes a date string by removing trailing Z timezone designator.
     * Per cookbook rule fx-derivatives:RULE-002 and fx-derivatives:TR-002.
     */
    public static String normalizeDate(String date) {
        if (date == null) return null;
        if (date.endsWith("Z")) {
            return date.substring(0, date.length() - 1);
        }
        return date;
    }

    /**
     * Resolves a party reference href to a CDM party key.
     * Per cookbook transformation fx-derivatives:TR-001.
     */
    public static String resolvePartyReference(Object partyRef) {
        if (partyRef == null) return null;
        String ref = partyRef.toString();
        if (ref.startsWith("#")) {
            return ref.substring(1);
        }
        return ref;
    }

    /**
     * Converts an FpML party role reference to CDM Party1/Party2 designation.
     * Per cookbook transformation fx-derivatives:TR-001.
     */
    public static String toPartyRole(String partyRef) {
        if (partyRef == null) return "Unknown";
        if (partyRef.contains("party1") || partyRef.equals("party1")) {
            return "Party1";
        } else if (partyRef.contains("party2") || partyRef.equals("party2")) {
            return "Party2";
        }
        return "Party1";
    }

    /**
     * Gets the trade identifier scheme based on party reference.
     * Provides a hint for scheme assignment during mapping.
     */
    public static String getTradeIdScheme(String partyKey) {
        if (partyKey == null) return "http://www.fpml.org/trade-id";
        if (partyKey.contains("party1") || partyKey.contains("partyA")) {
            return "http://www.partyA.com/fx/trade-id";
        } else if (partyKey.contains("party2") || partyKey.contains("partyB")) {
            return "http://www.partyB.com/fx/trade-id";
        }
        return "http://www.fpml.org/trade-id";
    }

    /**
     * Extracts currency code from a currency specification.
     */
    public static String extractCurrency(Object currencySpec) {
        if (currencySpec == null) return null;
        String curr = currencySpec.toString();
        // Handle Currency type objects
        if (curr.contains("currency=")) {
            Matcher m = Pattern.compile("currency=\"([^\"]+)\"").matcher(curr);
            if (m.find()) return m.group(1);
        }
        return curr;
    }

    /**
     * Generates a consistent global key from an input string.
     * Used for CDM meta.globalKey fields.
     */
    public static String generateKey(String input) {
        if (input == null || input.isEmpty()) return "0";
        int hash = input.hashCode();
        return Integer.toHexString(Math.abs(hash));
    }

    /**
     * Parses an exchange rate, handling spot rate, forward points, and composite rates.
     * Per cookbook rule fx-derivatives:RULE-005.
     */
    public static Map<String, Object> parseExchangeRate(Map<String, Object> exchangeRate) {
        Map<String, Object> result = new LinkedHashMap<>();

        if (exchangeRate == null) return result;

        String rate = getStringValue(exchangeRate, "rate");
        String spotRate = getStringValue(exchangeRate, "spotRate");
        String forwardPoints = getStringValue(exchangeRate, "forwardPoints");

        double forwardRate = 0;
        boolean hasForwardPoints = false;

        if (rate != null) {
            try {
                forwardRate = Double.parseDouble(rate);
            } catch (NumberFormatException ignored) {}
        }

        if (forwardPoints != null && spotRate != null) {
            try {
                double spot = Double.parseDouble(spotRate);
                double points = Double.parseDouble(forwardPoints);
                forwardRate = spot + points;
                hasForwardPoints = true;
            } catch (NumberFormatException ignored) {}
        }

        result.put("rate", forwardRate);
        result.put("hasForwardPoints", hasForwardPoints);
        result.put("spotRate", spotRate);
        result.put("forwardPoints", forwardPoints);


        return result;
    }

    /**
     * Extracts quoted currency pair information.
     */
    public static Map<String, String> parseQuotedCurrencyPair(Map<String, Object> quotedCurrencyPair) {
        Map<String, String> result = new LinkedHashMap<>();

        if (quotedCurrencyPair == null) return result;


        String currency1 = getStringValue(quotedCurrencyPair, "currency1");
        String currency2 = getStringValue(quotedCurrencyPair, "currency2");
        String quoteBasis = getStringValue(quotedCurrencyPair, "quoteBasis");


        result.put("currency1", currency1 != null ? currency1 : "");
        result.put("currency2", currency2 != null ? currency2 : "");
        result.put("quoteBasis", quoteBasis != null ? quoteBasis : "");


        return result;
    }

    /**
     * Determines the option type (Call/Put) from strike quote basis.
     */
    public static String determineOptionType(String strikeQuoteBasis, boolean isCallCurrencyAmount) {
        if (strikeQuoteBasis == null) return "Call";

        if (strikeQuoteBasis.contains("CallCurrencyPerPutCurrency")) {
            return isCallCurrencyAmount ? "Call" : "Put";
        } else if (strikeQuoteBasis.contains("PutCurrencyPerCallCurrency")) {
            return isCallCurrencyAmount ? "Put" : "Call";
        }

        return "Call";
    }


    /**
     * Normalizes a product type string to CDM taxonomy name format.
     * Per cookbook rule fx-derivatives:RULE-003.
     */
    public static String normalizeProductType(String productType) {
        if (productType == null) return "";

        // Remove spaces and special characters
        String normalized = productType.replaceAll("[^a-zA-Z0-9]", "");

        // Common normalizations
        Map<String, String> normalizations = new HashMap<>();
        normalizations.put("EuroBinary", "EuroBinary");
        normalizations.put("EuroRangeBinary", "EuroRangeBinary");
        normalizations.put("OneTouch", "OneTouch");
        normalizations.put("NoTouch", "NoTouch");
        normalizations.put("DoubleOneTouch", "DoubleOneTouch");
        normalizations.put("DoubleNoTouch", "DoubleNoTouch");
        normalizations.put("DeltaPutFXOption", "Delta-Put-FX-Option");
        normalizations.put("FxOption", "FxOption");
        normalizations.put("NondeliverableOption", "NondeliverableOption");
        normalizations.put("DOUBLEBARRIER", "DOUBLEBARRIER");

        return normalizations.getOrDefault(normalized, productType);
    }

    private static String getStringValue(Map<String, Object> map, String key) {
        if (map == null || !map.containsKey(key)) return null;
        Object val = map.get(key);
        if (val instanceof String) return (String) val;
        return val != null ? val.toString() : null;
    }

    private FxConverter() {
        // Utility class - private constructor
    }
}