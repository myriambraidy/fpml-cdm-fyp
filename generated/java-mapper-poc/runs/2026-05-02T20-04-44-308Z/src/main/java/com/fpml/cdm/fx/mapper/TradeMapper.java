package com.fpml.cdm.fx.mapper;

/**
 * Constants for FpML element names and CDM path constants.
 */
public final class TradeMapper {

    private TradeMapper() {}

    // FpML element names
    public static final String FPML_ROOT = “FpML”;
    public static final String FPML_PARTY = “party”;
    public static final String FPML_PARTY_ID = “partyId”;
    public static final String FPML_ID_ATTR = “id”;
    public static final String FPML_TRADE = “trade”;
    public static final String FPML_TRADE_HEADER = “tradeHeader”;
    public static final String FPML_FX_SINGLE_LEG = “fxSingleLeg”;
    public static final String FPML_FX_SWAP = “fxSwap”;
    public static final String FPML_FX_OPTION = “fxSimpleOption”;
    public static final String FPML_EXCHANGED_CURRENCY_1 = “exchangedCurrency1”;
    public static final String FPML_EXCHANGED_CURRENCY_2 = “exchangedCurrency2”;
    public static final String FPML_PAYER_PARTY_REFERENCE = “payerPartyReference”;
    public static final String FPML_RECEIVER_PARTY_REFERENCE = “receiverPartyReference”;
    public static final String FPML_PAYMENT_AMOUNT = “paymentAmount”;
    public static final String FPML_VALUE_DATE = “valueDate”;
    public static final String FPML_EXCHANGE_RATE = “exchangeRate”;
    public static final String FPML_QUOTED_CURRENCY_PAIR = “quotedCurrencyPair”;
    public static final String FPML_CURRENCY_1 = “currency1”;
    public static final String FPML_CURRENCY_2 = “currency2”;
    public static final String FPML_RATE = “rate”;
    public static final String FPML_NON_DELIVERABLE_FORWARD = “nonDeliverableForward”;
    public static final String FPML_SETTLEMENT_CURRENCY = “settlementCurrency”;
    public static final String FPML_PARTY_TRADE_IDENTIFIER = “partyTradeIdentifier”;
    public static final String FPML_TRADE_ID = “tradeId”;
    public static final String FPML_TRADE_DATE = “tradeDate”;

    // CDM Taxonomy constants
    public static final String TAXONOMY_SOURCE_OTHER = “Other”;
    public static final String TAXONOMY_SOURCE_ISDA = “ISDA”;
    public static final String TAXONOMY_NAME_FX_SPOT = “FxSpot”;
    public static final String TAXONOMY_QUALIFIER_FX_SPOT_FORWARD = “ForeignExchange_Spot_Forward”;
    public static final String TAXONOMY_QUALIFIER_FX_SWAP = “ForeignExchange_Swap”;
    public static final String TAXONOMY_QUALIFIER_FX_VANILLA_OPTION = “ForeignExchange_VanillaOption”;

    // CDM Address constants
    public static final String ADDRESS_SCOPE_DOCUMENT = “DOCUMENT”;
    public static final String ADDRESS_QUANTITY_1 = “quantity-1”;
    public static final String ADDRESS_QUANTITY_2 = “quantity-2”;
    public static final String ADDRESS_PRICE_1 = “price-1”;
    public static final String ADDRESS_PRICE_2 = “price-2”;
    public static final String ADDRESS_OBSERVABLE_1 = “observable-1”;
    public static final String ADDRESS_OBSERVABLE_2 = “observable-2”;

    // Product group names
    public static final String PRODUCT_GROUP_FX_SWAP = “fx-swap”;
    public static final String PRODUCT_GROUP_FX_OPTION = “fx-simple-option”;
}