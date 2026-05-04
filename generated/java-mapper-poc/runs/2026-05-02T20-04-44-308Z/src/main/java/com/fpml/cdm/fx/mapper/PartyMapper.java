package com.fpml.cdm.fx.mapper;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import java.util.HashMap;
import java.util.Map;

public class PartyMapper {

    public static final String FPML_ROOT = \"FpML\";
    public static final String FPML_PARTY = \"party\";
    public static final String FPML_PARTY_ID = \"partyId\";
    public static final String FPML_ID_ATTR = \"id\";

    public static String normalizeTradeDate(String dateWithZ) {
        if (dateWithZ != null && dateWithZ.endsWith(\"Z\")) {
            return dateWithZ.substring(0, dateWithZ.length() - 1);
        }
        return dateWithZ;
    }
}