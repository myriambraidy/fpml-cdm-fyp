package com.fpml.cdm.fx.mapper.generated;

import cdm.base.staticdata.asset.common.Cash;
import cdm.observable.asset.Observable;
import org.w3c.dom.Document;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

/**
 * Maps FpML currency codes to CDM Observable containing Cash asset.
 * Rosetta function: MapCurrencyToObservableCashWithAddress.
 */
public class ObservableMapper {

    private final XPath xpath;

    public ObservableMapper() {
        XPathFactory xpf = XPathFactory.newInstance();
        this.xpath = xpf.newXPath();
    }

    /**
     * Build CDM Observable for a currency code.
     * @param currencyCode ISO 4217 currency code (e.g. "USD", "EUR")
     * @return Observable containing Cash asset
     */
    public Observable buildObservable(String currencyCode) {
        if (currencyCode == null || currencyCode.isEmpty()) {
            return null;
        }
        Cash cash = Cash.builder()
                .setCurrency(com.rosetta.model.metafields.FieldWithMetaString.builder()
                        .setValue(currencyCode)
                        .build())
                .build();
        return Observable.builder()
                .setCash(cash)
                .build();
    }

    /**
     * Extract the settlement currency from FpML valueDate element.
     * @param doc FpML document
     * @return Observable for settlement currency
     */
    public Observable mapSettlementCurrencyObservable(Document doc) {
        try {
            String currency = xpath.evaluate("//valueDate/settlementCurrency", doc);
            if (currency != null && !currency.isEmpty()) {
                return buildObservable(currency);
            }
        } catch (Exception e) {
            // log and continue
        }
        return null;
    }

    /**
     * Extract currency from nonDeliverableSettlement element.
     * @param doc FpML document
     * @return Observable for NDF settlement currency
     */
    public Observable mapNdfSettlementCurrencyObservable(Document doc) {
        try {
            String currency = xpath.evaluate("//nonDeliverableSettlement/settlementCurrency", doc);
            if (currency != null && !currency.isEmpty()) {
                return buildObservable(currency);
            }
        } catch (Exception e) {
            // log and continue
        }
        return null;
    }
}
