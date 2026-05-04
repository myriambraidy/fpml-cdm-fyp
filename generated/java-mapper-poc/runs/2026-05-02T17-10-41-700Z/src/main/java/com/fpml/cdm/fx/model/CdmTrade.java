package com.fpml.cdm.fx.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.ArrayList();

/**
 * Root CDM Trade structure for JSON output.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CdmTrade {

    @JsonProperty("meta")
    private Meta meta;

    @JsonProperty("trade")
    private Trade trade;


    @JsonProperty("transferHistory")
    private List<Transfer> transferHistory;


    public CdmTrade() {
        this.meta = new Meta();
        this.trade = new Trade();
        this.transferHistory = new ArrayList<>();
    }

    // Getters and setters
    public Meta getMeta() { return meta; }
    public void setMeta(Meta meta) { this.meta = meta; }

    public Trade getTrade() { return trade; }
    public void setTrade(Trade trade) { this.trade = trade; }


    public List<Transfer> getTransferHistory() { return transferHistory; }
    public void setTransferHistory(List<Transfer> transferHistory) {
        this.transferHistory = transferHistory;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Meta {
        @JsonProperty("globalKey")
        private String globalKey;

        public Meta() { this.globalKey = "cdm-meta"; }

        public String getGlobalKey() { return globalKey; }
        public void setGlobalKey(String globalKey) { this.globalKey = globalKey; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Trade {
        @JsonProperty("meta")
        private Meta meta;

        @JsonProperty("product")
        private Product product;


        @JsonProperty("tradeLot")
        private List<TradeLot> tradeLot;


        @JsonProperty("counterparty")
        private List<Counterparty> counterparty;


        @JsonProperty("tradeIdentifier")
        private List<TradeIdentifier> tradeIdentifier;


        @JsonProperty("tradeDate")
        private TradeDate tradeDate;

        @JsonProperty("party")
        private List<Party> party;

        public Trade() {
            this.meta = new Meta();
            this.tradeLot = new ArrayList<>();
            this.counterparty = new ArrayList<>();
            this.tradeIdentifier = new ArrayList<>();
            this.party = new ArrayList<>();
        }

        public Meta getMeta() { return meta; }
        public void setMeta(Meta meta) { this.meta = meta; }

        public Product getProduct() { return product; }
        public void setProduct(Product product) { this.product = product; }

        public List<TradeLot> getTradeLot() { return tradeLot; }
        public void setTradeLot(List<TradeLot> tradeLot) { this.tradeLot = tradeLot; }

        public List<Counterparty> getCounterparty() { return counterparty; }
        public void setCounterparty(List<Counterparty> counterparty) {
            this.counterparty = counterparty;
        }

        public List<TradeIdentifier> getTradeIdentifier() { return tradeIdentifier; }
        public void setTradeIdentifier(List<TradeIdentifier> tradeIdentifier) {
            this.tradeIdentifier = tradeIdentifier;
        }

        public TradeDate getTradeDate() { return tradeDate; }
        public void setTradeDate(TradeDate tradeDate) { this.tradeDate = tradeDate; }

        public List<Party> getParty() { return party; }
        public void setParty(List<Party> party) { this.party = party; }

        public static class Meta {
            @JsonProperty("globalKey")
            private String globalKey;

            public Meta() { this.globalKey = "trade-meta"; }

            public String getGlobalKey() { return globalKey; }
            public void setGlobalKey(String globalKey) { this.globalKey = globalKey; }
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Product {
        @JsonProperty("meta")
        private Meta meta;

        @JsonProperty("taxonomy")
        private List<Taxonomy> taxonomy;

        @JsonProperty("economicTerms")
        private EconomicTerms economicTerms;

        public Product() {
            this.meta = new Meta();
            this.taxonomy = new ArrayList<>();
        }

        public Meta getMeta() { return meta; }
        public void setMeta(Meta meta) { this.meta = meta; }

        public List<Taxonomy> getTaxonomy() { return taxonomy; }
        public void setTaxonomy(List<Taxonomy> taxonomy) { this.taxonomy = taxonomy; }

        public EconomicTerms getEconomicTerms() { return economicTerms; }
        public void setEconomicTerms(EconomicTerms economicTerms) {
            this.economicTerms = economicTerms;
        }

        public static class Meta {
            @JsonProperty("globalKey")
            private String globalKey;

            public Meta() { this.globalKey = "product-meta"; }

            public String getGlobalKey() { return globalKey; }
            public void setGlobalKey(String globalKey) { this.globalKey = globalKey; }
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Taxonomy {
        @JsonProperty("source")
        private String source;

        @JsonProperty("productQualifier")
        private String productQualifier;

        public Taxonomy() {}


        public Taxonomy(String source, String productQualifier) {
            this.source = source;
            this.productQualifier = productQualifier;
        }

        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }

        public String getProductQualifier() { return productQualifier; }
        public void setProductQualifier(String productQualifier) {
            this.productQualifier = productQualifier;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EconomicTerms {
        @JsonProperty("payout")
        private List<Payout> payout;

        public EconomicTerms() {
            this.payout = new ArrayList<>();
        }

        public List<Payout> getPayout() { return payout; }
        public void setPayout(List<Payout> payout) { this.payout = payout; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Payout {
        @JsonProperty("meta")
        private String meta;

        @JsonProperty("payerReceiver")
        private PayerReceiver payerReceiver;

        @JsonProperty("priceQuantity")
        private PriceQuantity priceQuantity;

        @JsonProperty("settlementTerms")
        private SettlementTerms settlementTerms;

        @JsonProperty("underlier")
        private Underlier underlier;

        @JsonProperty("optionType")
        private String optionType;

        @JsonProperty("exerciseTerms")
        private ExerciseTerms exerciseTerms;

        @JsonProperty("strike")
        private Strike strike;

        @JsonProperty("buyerSeller")
        private BuyerSeller buyerSeller;

        public Payout() {
            this.meta = "payout-meta";
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }

        public PayerReceiver getPayerReceiver() { return payerReceiver; }
        public void setPayerReceiver(PayerReceiver payerReceiver) {
            this.payerReceiver = payerReceiver;
        }

        public PriceQuantity getPriceQuantity() { return priceQuantity; }
        public void setPriceQuantity(PriceQuantity priceQuantity) {
            this.priceQuantity = priceQuantity;
        }

        public SettlementTerms getSettlementTerms() { return settlementTerms; }
        public void setSettlementTerms(SettlementTerms settlementTerms) {
            this.settlementTerms = settlementTerms;
        }

        public Underlier getUnderlier() { return underlier; }
        public void setUnderlier(Underlier underlier) { this.underlier = underlier; }

        public String getOptionType() { return optionType; }
        public void setOptionType(String optionType) { this.optionType = optionType; }

        public ExerciseTerms getExerciseTerms() { return exerciseTerms; }
        public void setExerciseTerms(ExerciseTerms exerciseTerms) {
            this.exerciseTerms = exerciseTerms;
        }

        public Strike getStrike() { return strike; }
        public void setStrike(Strike strike) { this.strike = strike; }

        public BuyerSeller getBuyerSeller() { return buyerSeller; }
        public void setBuyerSeller(BuyerSeller buyerSeller) {
            this.buyerSeller = buyerSeller;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PayerReceiver {
        @JsonProperty("payer")
        private String payer;


        @JsonProperty("receiver")
        private String receiver;

        public PayerReceiver() {}

        public String getPayer() { return payer; }
        public void setPayer(String payer) { this.payer = payer; }

        public String getReceiver() { return receiver; }
        public void setReceiver(String receiver) { this.receiver = receiver; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PriceQuantity {
        @JsonProperty("quantitySchedule")
        private AddressWrapper quantitySchedule;

        @JsonProperty("priceSchedule")
        private AddressWrapper priceSchedule;

        @JsonProperty("meta")
        private String meta;

        public PriceQuantity() {
            this.meta = "0";
        }

        public AddressWrapper getQuantitySchedule() { return quantitySchedule; }
        public void setQuantitySchedule(AddressWrapper quantitySchedule) {
            this.quantitySchedule = quantitySchedule;
        }

        public AddressWrapper getPriceSchedule() { return priceSchedule; }
        public void setPriceSchedule(AddressWrapper priceSchedule) {
            this.priceSchedule = priceSchedule;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AddressWrapper {
        @JsonProperty("address")
        private Address address;

        public AddressWrapper() {
            this.address = new Address();
        }

        public Address getAddress() { return address; }
        public void setAddress(Address address) { this.address = address; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Address {
        @JsonProperty("scope")
        private String scope = "DOCUMENT";

        @JsonProperty("value")
        private String value;

        public String getScope() { return scope; }
        public void setScope(String scope) { this.scope = scope; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SettlementTerms {
        @JsonProperty("settlementType")
        private String settlementType;

        @JsonProperty("settlementDate")
        private SettlementDate settlementDate;

        @JsonProperty("meta")
        private String meta;

        @JsonProperty("settlementCurrency")
        private SettlementCurrency settlementCurrency;

        public SettlementTerms() {
            this.meta = "settlement-meta";
            this.settlementType = "Cash";
            this.settlementDate = new SettlementDate();
        }

        public String getSettlementType() { return settlementType; }
        public void setSettlementType(String settlementType) {
            this.settlementType = settlementType;
        }

        public SettlementDate getSettlementDate() { return settlementDate; }
        public void setSettlementDate(SettlementDate settlementDate) {
            this.settlementDate = settlementDate;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }

        public SettlementCurrency getSettlementCurrency() { return settlementCurrency; }
        public void setSettlementCurrency(SettlementCurrency settlementCurrency) {
            this.settlementCurrency = settlementCurrency;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SettlementDate {
        @JsonProperty("valueDate")
        private String valueDate;

        @JsonProperty("meta")
        private String meta;

        public SettlementDate() {
            this.meta = "settlement-date-meta";
        }

        public String getValueDate() { return valueDate; }
        public void setValueDate(String valueDate) { this.valueDate = valueDate; }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class SettlementCurrency {
        @JsonProperty("value")
        private String value;

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Underlier {
        @JsonProperty("Observable")
        private AddressWrapper observable;

        public Underlier() {
            this.observable = new AddressWrapper();
        }

        public AddressWrapper getObservable() { return observable; }
        public void setObservable(AddressWrapper observable) {
            this.observable = observable;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ExerciseTerms {
        @JsonProperty("style")
        private String style;

        @JsonProperty("expirationDate")
        private List<ExpirationDate> expirationDate;

        @JsonProperty("expirationTime")
        private ExpirationTime expirationTime;

        @JsonProperty("meta")
        private String meta;

        @JsonProperty("commencementDate")
        private CommencementDate commencementDate;

        public ExerciseTerms() {
            this.meta = "exercise-meta";
            this.expirationDate = new ArrayList<>();
        }

        public String getStyle() { return style; }
        public void setStyle(String style) { this.style = style; }

        public List<ExpirationDate> getExpirationDate() { return expirationDate; }
        public void setExpirationDate(List<ExpirationDate> expirationDate) {
            this.expirationDate = expirationDate;
        }

        public ExpirationTime getExpirationTime() { return expirationTime; }
        public void setExpirationTime(ExpirationTime expirationTime) {
            this.expirationTime = expirationTime;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }

        public CommencementDate getCommencementDate() { return commencementDate; }
        public void setCommencementDate(CommencementDate commencementDate) {
            this.commencementDate = commencementDate;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ExpirationDate {
        @JsonProperty("adjustableDate")
        private AdjustableDate adjustableDate;


        @JsonProperty("meta")
        private String meta;


        public ExpirationDate() {
            this.adjustableDate = new AdjustableDate();
            this.meta = "0";
        }

        public AdjustableDate getAdjustableDate() { return adjustableDate; }
        public void setAdjustableDate(AdjustableDate adjustableDate) {
            this.adjustableDate = adjustableDate;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AdjustableDate {
        @JsonProperty("adjustedDate")
        private AdjustedDate adjustedDate;

        @JsonProperty("meta")
        private String meta;

        public AdjustableDate() {
            this.meta = "0";
            this.adjustedDate = new AdjustedDate();
        }

        public AdjustedDate getAdjustedDate() { return adjustedDate; }
        public void setAdjustedDate(AdjustedDate adjustedDate) {
            this.adjustedDate = adjustedDate;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AdjustedDate {
        @JsonProperty("value")
        private String value;


        @JsonProperty("meta")
        private String meta;

        public AdjustedDate() {
            this.meta = "adjusted-date-meta";
        }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ExpirationTime {
        @JsonProperty("hourMinuteTime")
        private String hourMinuteTime;


        @JsonProperty("businessCenter")
        private BusinessCenter businessCenter;

        @JsonProperty("expirationTimeType")
        private String expirationTimeType = "SpecificTime";

        public ExpirationTime() {}

        public String getHourMinuteTime() { return hourMinuteTime; }
        public void setHourMinuteTime(String hourMinuteTime) {
            this.hourMinuteTime = hourMinuteTime;
        }

        public BusinessCenter getBusinessCenter() { return businessCenter; }
        public void setBusinessCenter(BusinessCenter businessCenter) {
            this.businessCenter = businessCenter;
        }

        public String getExpirationTimeType() { return expirationTimeType; }
        public void setExpirationTimeType(String expirationTimeType) {
            this.expirationTimeType = expirationTimeType;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BusinessCenter {
        @JsonProperty("value")
        private String value;

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CommencementDate {
        @JsonProperty("adjustableDate")
        private AdjustableDate adjustableDate;

        @JsonProperty("meta")
        private String meta;

        public CommencementDate() {
            this.meta = "commencement-meta";
            this.adjustableDate = new AdjustableDate();
        }

        public AdjustableDate getAdjustableDate() { return adjustableDate; }
        public void setAdjustableDate(AdjustableDate adjustableDate) {
            this.adjustableDate = adjustableDate;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Strike {
        @JsonProperty("strikePrice")
        private StrikePrice strikePrice;

        public Strike() {
            this.strikePrice = new StrikePrice();
        }


        public StrikePrice getStrikePrice() { return strikePrice; }
        public void setStrikePrice(StrikePrice strikePrice) {
            this.strikePrice = strikePrice;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class StrikePrice {
        @JsonProperty("value")
        private Double value;

        @JsonProperty("unit")
        private Unit unit;

        @JsonProperty("perUnitOf")
        private Unit perUnitOf;


        @JsonProperty("priceType")
        private String priceType = "ExchangeRate";


        @JsonProperty("composite")
        private Composite composite;


        public StrikePrice() {
            this.unit = new Unit();
            this.perUnitOf = new Unit();
        }

        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }

        public Unit getUnit() { return unit; }
        public void setUnit(Unit unit) { this.unit = unit; }

        public Unit getPerUnitOf() { return perUnitOf; }
        public void setPerUnitOf(Unit perUnitOf) { this.perUnitOf = perUnitOf; }

        public String getPriceType() { return priceType; }
        public void setPriceType(String priceType) { this.priceType = priceType; }

        public Composite getComposite() { return composite; }
        public void setComposite(Composite composite) { this.composite = composite; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Unit {
        @JsonProperty("currency")
        private Currency currency;

        public Unit() {
            this.currency = new Currency();
        }

        public Currency getCurrency() { return currency; }
        public void setCurrency(Currency currency) { this.currency = currency; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Currency {
        @JsonProperty("value")
        private String value;

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Composite {
        @JsonProperty("baseValue")
        private Double baseValue;

        @JsonProperty("operand")
        private Double operand;

        @JsonProperty("arithmeticOperator")
        private String arithmeticOperator = "Add";

        @JsonProperty("operandType")
        private String operandType = "ForwardPoint";

        public Composite() {
            this.arithmeticOperator = "Add";
            this.operandType = "ForwardPoint";
        }

        public Double getBaseValue() { return baseValue; }
        public void setBaseValue(Double baseValue) { this.baseValue = baseValue; }

        public Double getOperand() { return operand; }
        public void setOperand(Double operand) { this.operand = operand; }

        public String getArithmeticOperator() { return arithmeticOperator; }
        public void setArithmeticOperator(String arithmeticOperator) {
            this.arithmeticOperator = arithmeticOperator;
        }

        public String getOperandType() { return operandType; }
        public void setOperandType(String operandType) { this.operandType = operandType; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class BuyerSeller {
        @JsonProperty("buyer")
        private String buyer;

        @JsonProperty("seller")
        private String seller;

        public BuyerSeller() {}

        public String getBuyer() { return buyer; }
        public void setBuyer(String buyer) { this.buyer = buyer; }

        public String getSeller() { return seller; }
        public void setSeller(String seller) { this.seller = seller; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TradeLot {
        @JsonProperty("priceQuantity")
        private List<PriceQuantityItem> priceQuantity;

        @JsonProperty("meta")
        private String meta;

        public TradeLot() {
            this.priceQuantity = new ArrayList<>();
            this.meta = "trade-lot-meta";
        }

        public List<PriceQuantityItem> getPriceQuantity() { return priceQuantity; }
        public void setPriceQuantity(List<PriceQuantityItem> priceQuantity) {
            this.priceQuantity = priceQuantity;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PriceQuantityItem {
        @JsonProperty("price")
        private List<Price> price;

        @JsonProperty("quantity")
        private List<Quantity> quantity;

        @JsonProperty("observable")
        private Observable observable;

        @JsonProperty("meta")
        private String meta;

        public PriceQuantityItem() {
            this.price = new ArrayList<>();
            this.quantity = new ArrayList<>();
            this.observable = new Observable();
            this.meta = "pq-meta";
        }

        public List<Price> getPrice() { return price; }
        public void setPrice(List<Price> price) { this.price = price; }

        public List<Quantity> getQuantity() { return quantity; }
        public void setQuantity(List<Quantity> quantity) { this.quantity = quantity; }

        public Observable getObservable() { return observable; }
        public void setObservable(Observable observable) {
            this.observable = observable;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Price {
        @JsonProperty("value")
        private PriceValue value;


        @JsonProperty("meta")
        private List<MetaLocation> metaLocation;


        public Price() {
            this.value = new PriceValue();
            this.metaLocation = new ArrayList<>();
        }

        public PriceValue getValue() { return value; }
        public void setValue(PriceValue value) { this.value = value; }

        public List<MetaLocation> getMetaLocation() { return metaLocation; }
        public void setMetaLocation(List<MetaLocation> metaLocation) {
            this.metaLocation = metaLocation;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PriceValue {
        @JsonProperty("value")
        private Double value;

        @JsonProperty("unit")
        private Unit unit;

        @JsonProperty("perUnitOf")
        private Unit perUnitOf;

        @JsonProperty("priceType")
        private String priceType = "ExchangeRate";

        @JsonProperty("composite")
        private Composite composite;

        public PriceValue() {
            this.unit = new Unit();
            this.perUnitOf = new Unit();
            this.priceType = "ExchangeRate";
        }

        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }

        public Unit getUnit() { return unit; }
        public void setUnit(Unit unit) { this.unit = unit; }

        public Unit getPerUnitOf() { return perUnitOf; }
        public void setPerUnitOf(Unit perUnitOf) { this.perUnitOf = perUnitOf; }

        public String getPriceType() { return priceType; }
        public void setPriceType(String priceType) { this.priceType = priceType; }

        public Composite getComposite() { return composite; }
        public void setComposite(Composite composite) { this.composite = composite; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MetaLocation {
        @JsonProperty("scope")
        private String scope = "DOCUMENT";

        @JsonProperty("value")
        private String value;


        public MetaLocation() {
            this.scope = "DOCUMENT";
        }

        public String getScope() { return scope; }
        public void setScope(String scope) { this.scope = scope; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Quantity {
        @JsonProperty("value")
        private Double value;

        @JsonProperty("unit")
        private Unit unit;

        @JsonProperty("meta")
        private List<MetaLocation> metaLocation;

        public Quantity() {
            this.unit = new Unit();
            this.metaLocation = new ArrayList<>();
        }

        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }

        public Unit getUnit() { return unit; }
        public void setUnit(Unit unit) { this.unit = unit; }

        public List<MetaLocation> getMetaLocation() { return metaLocation; }
        public void setMetaLocation(List<MetaLocation> metaLocation) {
            this.metaLocation = metaLocation;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Observable {
        @JsonProperty("value")
        private Asset value;

        @JsonProperty("meta")
        private List<MetaLocation> metaLocation;

        public Observable() {
            this.value = new Asset();
            this.metaLocation = new ArrayList<>();
        }

        public Asset getValue() { return value; }
        public void setValue(Asset value) { this.value = value; }

        public List<MetaLocation> getMetaLocation() { return metaLocation; }
        public void setMetaLocation(List<MetaLocation> metaLocation) {
            this.metaLocation = metaLocation;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Asset {
        @JsonProperty("Cash")
        private Cash Cash;


        public Asset() {
            this.Cash = new Cash();
        }

        public Cash getCash() { return Cash; }
        public void setCash(Cash Cash) { this.Cash = Cash; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Cash {
        @JsonProperty("identifier")
        private List<Identifier> identifier;

        @JsonProperty("assetType")
        private String assetType = "Cash";

        public Cash() {
            this.identifier = new ArrayList<>();
            this.assetType = "Cash";
        }

        public List<Identifier> getIdentifier() { return identifier; }
        public void setIdentifier(List<Identifier> identifier) {
            this.identifier = identifier;
        }

        public String getAssetType() { return assetType; }
        public void setAssetType(String assetType) { this.assetType = assetType; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Identifier {
        @JsonProperty("identifier")
        private IdentifierValue identifier;

        @JsonProperty("identifierType")
        private String identifierType = "CurrencyCode";

        public Identifier() {
            this.identifier = new IdentifierValue();
        }

        public IdentifierValue getIdentifier() { return identifier; }
        public void setIdentifier(IdentifierValue identifier) {
            this.identifier = identifier;
        }

        public String getIdentifierType() { return identifierType; }
        public void setIdentifierType(String identifierType) {
            this.identifierType = identifierType;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class IdentifierValue {
        @JsonProperty("value")
        private String value;


        @JsonProperty("meta")
        private Meta meta;


        public IdentifierValue() {
            this.meta = new Meta();
        }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }

        public Meta getMeta() { return meta; }
        public void setMeta(Meta meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Counterparty {
        @JsonProperty("role")
        private String role;


        @JsonProperty("partyReference")
        private PartyReference partyReference;

        public Counterparty() {
            this.partyReference = new PartyReference();
        }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public PartyReference getPartyReference() { return partyReference; }
        public void setPartyReference(PartyReference partyReference) {
            this.partyReference = partyReference;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PartyReference {
        @JsonProperty("globalReference")
        private String globalReference;

        @JsonProperty("externalReference")
        private String externalReference;

        public PartyReference() {}

        public String getGlobalReference() { return globalReference; }
        public void setGlobalReference(String globalReference) {
            this.globalReference = globalReference;
        }

        public String getExternalReference() { return externalReference; }
        public void setExternalReference(String externalReference) {
            this.externalReference = externalReference;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TradeIdentifier {
        @JsonProperty("issuerReference")
        private PartyReference issuerReference;

        @JsonProperty("assignedIdentifier")
        private List<AssignedIdentifier> assignedIdentifier;

        @JsonProperty("meta")
        private String meta;

        public TradeIdentifier() {
            this.assignedIdentifier = new ArrayList<>();
            this.meta = "trade-id-meta";
        }

        public PartyReference getIssuerReference() { return issuerReference; }
        public void setIssuerReference(PartyReference issuerReference) {
            this.issuerReference = issuerReference;
        }

        public List<AssignedIdentifier> getAssignedIdentifier() {
            return assignedIdentifier;
        }
        public void setAssignedIdentifier(List<AssignedIdentifier> assignedIdentifier) {
            this.assignedIdentifier = assignedIdentifier;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class AssignedIdentifier {
        @JsonProperty("identifier")
        private Identifier identifier;


        @JsonProperty("meta")
        private String meta;


        public AssignedIdentifier() {
            this.identifier = new Identifier();
            this.meta = "assigned-id-meta";
        }

        public Identifier getIdentifier() { return identifier; }
        public void setIdentifier(Identifier identifier) {
            this.identifier = identifier;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TradeDate {
        @JsonProperty("value")
        private String value;


        @JsonProperty("meta")
        private String meta;


        public TradeDate() {
            this.meta = "trade-date-meta";
        }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }


        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Party {
        @JsonProperty("partyId")
        private List<PartyId> partyId;


        @JsonProperty("name")
        private PartyName name;

        @JsonProperty("meta")
        private PartyMeta meta;

        @JsonProperty("metaExternalKey")
        private String metaExternalKey;


        public Party() {
            this.partyId = new ArrayList<>();
            this.meta = new PartyMeta();
        }

        public List<PartyId> getPartyId() { return partyId; }
        public void setPartyId(List<PartyId> partyId) { this.partyId = partyId; }

        public PartyName getName() { return name; }
        public void setName(PartyName name) { this.name = name; }

        public PartyMeta getMeta() { return meta; }
        public void setMeta(PartyMeta meta) { this.meta = meta; }

        public String getMetaExternalKey() { return metaExternalKey; }
        public void setMetaExternalKey(String metaExternalKey) {
            this.metaExternalKey = metaExternalKey;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PartyId {
        @JsonProperty("identifier")
        private IdentifierValue identifier;

        @JsonProperty("identifierType")
        private String identifierType = "LEI";

        @JsonProperty("meta")
        private String meta;

        public PartyId() {
            this.identifier = new IdentifierValue();
            this.meta = "party-id-meta";
        }

        public IdentifierValue getIdentifier() { return identifier; }
        public void setIdentifier(IdentifierValue identifier) {
            this.identifier = identifier;
        }


        public String getIdentifierType() { return identifierType; }
        public void setIdentifierType(String identifierType) {
            this.identifierType = identifierType;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PartyName {
        @JsonProperty("value")
        private String value;

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PartyMeta {
        @JsonProperty("globalKey")
        private String globalKey;


        public PartyMeta() { this.globalKey = "party-meta"; }


        public String getGlobalKey() { return globalKey; }
        public void setGlobalKey(String globalKey) { this.globalKey = globalKey; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Transfer {
        @JsonProperty("transfer")
        private TransferDetails transfer;

        @JsonProperty("meta")
        private String meta;

        public Transfer() {
            this.transfer = new TransferDetails();
            this.meta = "transfer-meta";
        }

        public TransferDetails getTransfer() { return transfer; }
        public void setTransfer(TransferDetails transfer) {
            this.transfer = transfer;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TransferDetails {
        @JsonProperty("quantity")
        private Quantity quantity;

        @JsonProperty("asset")
        private Asset asset;

        @JsonProperty("settlementDate")
        private TransferSettlementDate settlementDate;

        @JsonProperty("payerReceiver")
        private TransferPayerReceiver payerReceiver;


        @JsonProperty("transferExpression")
        private TransferExpression transferExpression;

        public TransferDetails() {
            this.quantity = new Quantity();
            this.asset = new Asset();
            this.settlementDate = new TransferSettlementDate();
            this.payerReceiver = new TransferPayerReceiver();
            this.transferExpression = new TransferExpression();
        }

        public Quantity getQuantity() { return quantity; }
        public void setQuantity(Quantity quantity) { this.quantity = quantity; }

        public Asset getAsset() { return asset; }
        public void setAsset(Asset asset) { this.asset = asset; }

        public TransferSettlementDate getSettlementDate() { return settlementDate; }
        public void setSettlementDate(TransferSettlementDate settlementDate) {
            this.settlementDate = settlementDate;
        }

        public TransferPayerReceiver getPayerReceiver() { return payerReceiver; }
        public void setPayerReceiver(TransferPayerReceiver payerReceiver) {
            this.payerReceiver = payerReceiver;
        }

        public TransferExpression getTransferExpression() { return transferExpression; }
        public void setTransferExpression(TransferExpression transferExpression) {
            this.transferExpression = transferExpression;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TransferSettlementDate {
        @JsonProperty("unadjustedDate")
        private String unadjustedDate;

        @JsonProperty("dateAdjustments")
        private DateAdjustments dateAdjustments;

        public TransferSettlementDate() {
            this.dateAdjustments = new DateAdjustments();
        }

        public String getUnadjustedDate() { return unadjustedDate; }
        public void setUnadjustedDate(String unadjustedDate) {
            this.unadjustedDate = unadjustedDate;
        }

        public DateAdjustments getDateAdjustments() { return dateAdjustments; }
        public void setDateAdjustments(DateAdjustments dateAdjustments) {
            this.dateAdjustments = dateAdjustments;
        }
    }


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class DateAdjustments {
        @JsonProperty("businessDayConvention")
        private String businessDayConvention = "NONE";

        @JsonProperty("meta")
        private String meta;

        public DateAdjustments() {
            this.meta = "date-adjustments-meta";
            this.businessDayConvention = "NONE";
        }

        public String getBusinessDayConvention() { return businessDayConvention; }
        public void setBusinessDayConvention(String businessDayConvention) {
            this.businessDayConvention = businessDayConvention;
        }

        public String getMeta() { return meta; }
        public void setMeta(String meta) { this.meta = meta; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TransferPayerReceiver {
        @JsonProperty("payerPartyReference")
        private PartyReference payerPartyReference;

        @JsonProperty("receiverPartyReference")
        private PartyReference receiverPartyReference;

        public TransferPayerReceiver() {
            this.payerPartyReference = new PartyReference();
            this.receiverPartyReference = new PartyReference();
        }

        public PartyReference getPayerPartyReference() { return payerPartyReference; }
        public void setPayerPartyReference(PartyReference payerPartyReference) {
            this.payerPartyReference = payerPartyReference;
        }

        public PartyReference getReceiverPartyReference() { return receiverPartyReference; }
        public void setReceiverPartyReference(PartyReference receiverPartyReference) {
            this.receiverPartyReference = receiverPartyReference;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class TransferExpression {
        @JsonProperty("unscheduledTransfer")
        private UnscheduledTransfer unscheduledTransfer;


        public TransferExpression() {
            this.unscheduledTransfer = new UnscheduledTransfer();
        }

        public UnscheduledTransfer getUnscheduledTransfer() { return unscheduledTransfer; }
        public void setUnscheduledTransfer(UnscheduledTransfer unscheduledTransfer) {
            this.unscheduledTransfer = unscheduledTransfer;
        }
    }


    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UnscheduledTransfer {
        @JsonProperty("priceTransfer")
        private String priceTransfer = "Premium";

        public UnscheduledTransfer() {
            this.priceTransfer = "Premium";
        }


        public String getPriceTransfer() { return priceTransfer; }
        public void setPriceTransfer(String priceTransfer) {
            this.priceTransfer = priceTransfer;
        }
    }
}