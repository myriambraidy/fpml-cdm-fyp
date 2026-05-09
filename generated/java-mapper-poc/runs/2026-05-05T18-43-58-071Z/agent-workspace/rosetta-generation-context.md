# Rosetta Generation Context

Authority: rosetta-outranks-cookbook
Product family: fx-derivatives
Implementation group: fx-single-leg

## Required Rosetta Functions

### MapFxSingleLegCounterpartyList

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:17-27

```rosetta
func MapFxSingleLegCounterpartyList:
    inputs:
        fpmlFxSingleLeg fpml.FxSingleLeg (0..1)
    output:
        counterpartyList Counterparty (0..2)

    add counterpartyList:
        MapPayerReceiverModelToCounterpartyList(
                GetFpmlExchangedCurrency(fpmlFxSingleLeg -> fxCoreDetailsModel) -> payerReceiverModel
            )

```

Calls:
- Counterparty
- FxSingleLeg
- GetFpmlExchangedCurrency
- MapPayerReceiverModelToCounterpartyList


### MapFxSingleLegAncillaryPartyList

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:28-33

```rosetta
func MapFxSingleLegAncillaryPartyList:
    inputs:
        fpmlFxSingleLeg fpml.FxSingleLeg (0..1)
    output:
        ancillaryPartyList AncillaryParty (0..*)

```

Calls:
- AncillaryParty
- FxSingleLeg


### MapFxSingleLegNonTransferableProduct

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:34-47

```rosetta
func MapFxSingleLegNonTransferableProduct:
    inputs:
        fpmlFxSingleLeg fpml.FxSingleLeg (0..1)
        cdmCounterpartyList Counterparty (0..2)
    output:
        nonTransferableProduct NonTransferableProduct (0..1)

    set nonTransferableProduct:
        NonTransferableProduct {
            identifier: MapProductIdentifierList(fpmlFxSingleLeg -> productModel),
            taxonomy: MapProductTaxonomyList(fpmlFxSingleLeg -> productModel),
            economicTerms: MapFxSingleLegEconomicTerms(fpmlFxSingleLeg, cdmCounterpartyList)
        }

```

Calls:
- Counterparty
- FxSingleLeg
- MapFxSingleLegEconomicTerms
- MapProductIdentifierList
- MapProductTaxonomyList
- NonTransferableProduct


### MapFxSingleLegEconomicTerms

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:48-64

```rosetta
func MapFxSingleLegEconomicTerms:
    inputs:
        fpmlFxSingleLeg fpml.FxSingleLeg (0..1)
        cdmCounterpartyList Counterparty (0..2)
    output:
        economicTerms EconomicTerms (0..1)

    set economicTerms:
        EconomicTerms {
            payout: MapFxCoreDetailsModelToSettlementPayout(
                        fpmlFxSingleLeg -> fxCoreDetailsModel,
                        empty,
                        cdmCounterpartyList
                    ),
            ...
        }

```

Calls:
- Counterparty
- EconomicTerms
- FxSingleLeg
- MapFxCoreDetailsModelToSettlementPayout


### MapFxCoreDetailsModelToSettlementPayout

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:65-111

```rosetta
func MapFxCoreDetailsModelToSettlementPayout:
    inputs:
        fpmlFxCoreDetailsModel fpml.FxCoreDetailsModel (0..1)
        fpmlLeg fpml.Leg (0..1)
        cdmCounterpartyList Counterparty (0..2)
    output:
        payout Payout (0..1)

    alias exchangedCurrency: GetFpmlExchangedCurrency(fpmlFxCoreDetailsModel)

    set payout:
        Payout {
            SettlementPayout:
                SettlementPayout {
                    payerReceiver: MapPayerReceiver(
                                exchangedCurrency -> payerReceiverModel,
                                cdmCounterpartyList
                            ),
                    priceQuantity:
                        ResolvablePriceQuantity {
                            quantitySchedule: MapFxCoreDetailsModelQuantityWithAddress(
                                        fpmlFxCoreDetailsModel,
                                        fpmlLeg
                                    ),
                            priceSchedule: MapFxCoreDetailsModelPriceWithAddress(
                                        fpmlFxCoreDetailsModel,
                                        fpmlLeg
                                    ),
                            ...
                        },
                    settlementTerms: MapFxCashSettlementToSettlementTerms(
                                fpmlFxCoreDetailsModel -> nonDeliverableSettlement,
                                fpmlFxCoreDetailsModel -> valueDate -> date
                            ),
                    underlier:
                        Underlier {
                            Observable: MapCurrencyToObservableCashWithAddress(
                                        exchangedCurrency -> paymentAmount -> currency,
                                        fpmlLeg
                                    ),
                            ...
                        },
                    ...
                },
            ...
        }

```

Calls:
- Counterparty
- FxCoreDetailsModel
- GetFpmlExchangedCurrency
- Leg
- MapCurrencyToObservableCashWithAddress
- MapFxCashSettlementToSettlementTerms
- MapFxCoreDetailsModelPriceWithAddress
- MapFxCoreDetailsModelQuantityWithAddress
- MapPayerReceiver
- Payout


### MapFxSingleLegPriceQuantityList

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:112-120

```rosetta
func MapFxSingleLegPriceQuantityList:
    inputs:
        fpmlFxSingleLeg fpml.FxSingleLeg (0..1)
    output:
        priceQuantityList PriceQuantity (0..*)

    add priceQuantityList:
        MapFxCoreDetailsModelPriceQuantityList(fpmlFxSingleLeg -> fxCoreDetailsModel, empty)

```

Calls:
- FxSingleLeg
- MapFxCoreDetailsModelPriceQuantityList
- PriceQuantity


### MapFxSingleLegAccountPartyReference

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:121-134

```rosetta
func MapFxSingleLegAccountPartyReference:
    inputs:
        fpmlFxSingleLeg fpml.FxSingleLeg (0..1)
        fpmlAccount fpml.Account (0..1)
    output:
        partyReference Party (0..1)
            [metadata reference]

    set partyReference:
        MapPayerReceiverToAccountPartyReference(
                fpmlAccount,
                [fpmlFxSingleLeg -> fxCoreDetailsModel -> exchangedCurrency1 -> payerReceiverModel, fpmlFxSingleLeg -> fxCoreDetailsModel -> exchangedCurrency2 -> payerReceiverModel]
            )

```

Calls:
- Account
- FxSingleLeg
- MapPayerReceiverToAccountPartyReference
- Party


## Shared Helper Functions

### MapPayerReceiverModelToCounterpartyList

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta:102-119

```rosetta
func MapPayerReceiverModelToCounterpartyList:
    inputs:
        fpmlPayerReceiverModel fpml.PayerReceiverModel (0..1)
    output:
        counterpartyList Counterparty (0..2)

    add counterpartyList:
        MapCounterparty(
                CounterpartyRoleEnum -> Party1,
                fpmlPayerReceiverModel -> payerModel -> payerPartyReference
            )

    add counterpartyList:
        MapCounterparty(
                CounterpartyRoleEnum -> Party2,
                fpmlPayerReceiverModel -> receiverModel -> receiverPartyReference
            )

```

Calls:
- Counterparty
- MapCounterparty
- PayerReceiverModel


### MapPayerReceiver

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta:779-797

```rosetta
func MapPayerReceiver:
    inputs:
        fpmlPayerReceiverModel fpml.PayerReceiverModel (0..1)
        cdmCounterpartyList Counterparty (0..2)
    output:
        payerReceiver PayerReceiver (0..1)

    set payerReceiver:
        PayerReceiver {
            payer: MapCounterpartyRoleEnum(
                        fpmlPayerReceiverModel -> payerModel -> payerPartyReference -> href,
                        cdmCounterpartyList
                    ),
            receiver: MapCounterpartyRoleEnum(
                        fpmlPayerReceiverModel -> receiverModel -> receiverPartyReference -> href,
                        cdmCounterpartyList
            ),
        }

```

Calls:
- Counterparty
- MapCounterpartyRoleEnum
- PayerReceiver
- PayerReceiverModel


### MapFxCoreDetailsModelQuantityWithAddress

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:575-593

```rosetta
func MapFxCoreDetailsModelQuantityWithAddress:
    inputs:
        fpmlFxCoreDetailsModel fpml.FxCoreDetailsModel (1..1)
        fpmlLeg fpml.Leg (0..1)
    output:
        quantity NonNegativeQuantitySchedule (0..1)
            [metadata address]

    alias quotedCurrencyPair: fpmlFxCoreDetailsModel -> exchangeRate -> quotedCurrencyPair

    set quantity:
        if quotedCurrencyPair -> quoteBasis = Currency2PerCurrency1
        then CreateQuantityWithAddress(
                    CreateQuantityKey(quotedCurrencyPair -> currency1 -> value, fpmlLeg)
                )
        else CreateQuantityWithAddress(
                CreateQuantityKey(quotedCurrencyPair -> currency2 -> value, fpmlLeg)
            )

```

Calls:
- CreateQuantityKey
- CreateQuantityWithAddress
- FxCoreDetailsModel
- Leg
- NonNegativeQuantitySchedule


### MapFxCoreDetailsModelPriceWithAddress

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:1260-1271

```rosetta
func MapFxCoreDetailsModelPriceWithAddress:
    inputs:
        fpmlFxCoreDetailsModel fpml.FxCoreDetailsModel (0..1)
        fpmlLeg fpml.Leg (0..1)
    output:
        price PriceSchedule (0..1)
            [metadata address]

    set price:
        if fpmlFxCoreDetailsModel -> exchangeRate exists
        then CreatePriceWithAddress(CreatePriceKey("exchangeRate", fpmlLeg))

```

Calls:
- CreatePriceKey
- CreatePriceWithAddress
- FxCoreDetailsModel
- Leg
- PriceSchedule


### MapFxCashSettlementToSettlementTerms

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-settlement-func.rosetta:512-557

```rosetta
func MapFxCashSettlementToSettlementTerms:
    inputs:
        fpmlFxCashSettlement fpml.FxCashSettlement (0..1)
        valueDate date (0..1)
    output:
        settlementTerms SettlementTerms (0..1)

    set settlementTerms:
        SettlementTerms {
            settlementType: Cash,
            settlementCurrency: MapCurrency(fpmlFxCashSettlement -> settlementCurrency),
            settlementDate:
                SettlementDate {
                    adjustableOrRelativeDate: MapAdjustableOrAdjustedOrRelativeDate(
                                empty,
                                fpmlFxCashSettlement -> settlementDate,
                                empty
                            ),
                    valueDate: valueDate,
                    ...
                },
            cashSettlementTerms:
                CashSettlementTerms {
                    cashSettlementMethod: empty,
                    valuationMethod:
                        ValuationMethod {
                            valuationSource:
                                ValuationSource {
                                    quotedCurrencyPair: empty,
                                    informationSource:
                                        FxSpotRateSource {
                                            primarySource: empty,
                                            ...
                                        },
                                    referenceBanks: empty,
                                    ...
                                },
                            quotationMethod: empty,
                            cashCollateralValuationMethod: empty,
                            ...
                        },
                    ...
                },
            ...
        }

```

Calls:
- FxCashSettlement
- MapAdjustableOrAdjustedOrRelativeDate
- MapCurrency
- SettlementTerms


### MapCurrencyToObservableCashWithAddress

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:2197-2207

```rosetta
func MapCurrencyToObservableCashWithAddress:
    inputs:
        fpmlCurrency fpml.Currency (0..1)
        fpmlLeg fpml.Leg (0..1)
    output:
        observable Observable (0..1)
            [metadata address]

    set observable:
        CreateObservableWithAddress(CreateObservableKey(fpmlCurrency -> value, fpmlLeg))

```

Calls:
- CreateObservableKey
- CreateObservableWithAddress
- Currency
- Leg
- Observable


### MapFxCoreDetailsModelPriceQuantityList

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta:1219-1244

```rosetta
func MapFxCoreDetailsModelPriceQuantityList:
    inputs:
        fpmlFxCoreDetailsModel fpml.FxCoreDetailsModel (0..1)
        fpmlLeg fpml.Leg (0..1)
    output:
        priceQuantityList PriceQuantity (0..*)

    alias exchangedCurrency: GetFpmlExchangedCurrency(fpmlFxCoreDetailsModel)

    add priceQuantityList:
        PriceQuantity {
            price: MapFxCoreDetailsModelPriceListWithLocation(
                        fpmlFxCoreDetailsModel,
                        fpmlLeg
                    ),
            quantity: MapFxCoreDetailsModelQuantityListWithLocation(
                        fpmlFxCoreDetailsModel,
                        fpmlLeg
                    ),
            observable: MapCurrencyToObservableCashWithLocation(
                        exchangedCurrency -> paymentAmount -> currency,
                        fpmlLeg
                    ),
            ...
        }

```

Calls:
- FxCoreDetailsModel
- GetFpmlExchangedCurrency
- Leg
- MapCurrencyToObservableCashWithLocation
- MapFxCoreDetailsModelPriceListWithLocation
- MapFxCoreDetailsModelQuantityListWithLocation
- PriceQuantity


### MapPayerReceiverToAccountPartyReference

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta:647-677

```rosetta
func MapPayerReceiverToAccountPartyReference:
    inputs:
        fpmlAccount fpml.Account (0..1)
        fpmlPayerReceiverModelList fpml.PayerReceiverModel (0..*)
    output:
        partyReference Party (0..1)
            [metadata reference]

    alias payerPartyReference:
        fpmlPayerReceiverModelList -> payerModel
            filter payerAccountReference -> href = fpmlAccount -> id
            then extract payerPartyReference -> href
            then distinct only-element

    alias receiverPartyReference:
        fpmlPayerReceiverModelList -> receiverModel
            filter receiverAccountReference -> href = fpmlAccount -> id
            then extract receiverPartyReference -> href
            then distinct only-element

    alias href:
        if payerPartyReference exists
        then payerPartyReference
        else if receiverPartyReference exists
        then receiverPartyReference

    set partyReference:
        empty with-meta {
            reference: href
        }

```

Calls:
- Account
- Party
- PayerReceiverModel


### MapProductIdentifierList

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:235-242

```rosetta
func MapProductIdentifierList:
    inputs:
        fpmlProductModel fpml.ProductModel (0..1)
    output:
        productIdentifierList ProductIdentifier (0..*)

    add productIdentifierList: fpmlProductModel -> productId extract MapProductIdentifier

```

Calls:
- ProductIdentifier
- ProductModel


### MapProductTaxonomyList

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:109-136

```rosetta
func MapProductTaxonomyList:
    inputs:
        fpmlProductModel fpml.ProductModel (0..1)
    output:
        taxonomy ProductTaxonomy (0..*)

    add taxonomy:
        ProductTaxonomy {
            primaryAssetClass: MapAssetClassWithScheme(
                        fpmlProductModel -> primaryAssetClass -> value,
                        fpmlProductModel -> primaryAssetClass -> assetClassScheme
                    ),
            ...
        }

    add taxonomy:
        fpmlProductModel -> productType
            extract
                ProductTaxonomy {
                    source: MapTaxonomySourceEnum(productTypeScheme),
                    value:
                        TaxonomyValue {
                            name: MapStringWithScheme(value, productTypeScheme),
                            ...
                        },
                    ...
                }

```

Calls:
- MapAssetClassWithScheme
- MapStringWithScheme
- MapTaxonomySourceEnum
- ProductModel
- ProductTaxonomy


### MapCurrency

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:77-86

```rosetta
func MapCurrency:
    inputs:
        fpmlCurrency fpml.Currency (0..1)
    output:
        currencyWithScheme string (0..1)
            [metadata scheme]

    set currencyWithScheme:
        MapStringWithScheme(fpmlCurrency -> value, fpmlCurrency -> currencyScheme)

```

Calls:
- Currency
- MapStringWithScheme


### MapMoney

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:403-420

```rosetta
func MapMoney:
    inputs:
        fpmlMoney fpml.Money (0..1)
    output:
        money Money (0..1)

    set money:
        if fpmlMoney exists
        then Money {
                value: fpmlMoney -> amount,
                unit:
                    UnitType {
                        currency: MapCurrency(fpmlMoney -> currency),
                        ...
                    },
                ...
            }

```

Calls:
- MapCurrency
- Money


### MapFxRate

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:336-347

```rosetta
func MapFxRate:
    inputs:
        fpmlFxRate fpml.FxRate (0..1)
    output:
        fxRate FxRate (0..1)

    set fxRate:
        FxRate {
            quotedCurrencyPair: MapQuotedCurrencyPair(fpmlFxRate -> quotedCurrencyPair),
            rate: fpmlFxRate -> rate
        }

```

Calls:
- FxRate
- MapQuotedCurrencyPair


### MapQuotedCurrencyPair

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta:348-360

```rosetta
func MapQuotedCurrencyPair:
    inputs:
        fpmlQuotedCurrencyPair fpml.QuotedCurrencyPair (0..1)
    output:
        quotedCurrencyPair QuotedCurrencyPair (0..1)

    set quotedCurrencyPair:
        QuotedCurrencyPair {
            currency1: MapCurrency(fpmlQuotedCurrencyPair -> currency1),
            currency2: MapCurrency(fpmlQuotedCurrencyPair -> currency2),
            quoteBasis: fpmlQuotedCurrencyPair -> quoteBasis to-enum QuoteBasisEnum
        }

```

Calls:
- MapCurrency
- QuotedCurrencyPair


### MapDateToAdjustableDate

Source: rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta:378-389

```rosetta
func MapDateToAdjustableDate:
    inputs:
        fpmlDateList date (0..1)
    output:
        adjustableDate AdjustableDate (0..1)

    set adjustableDate:
        AdjustableDate {
            adjustedDate: fpmlDateList,
            ...
        }

```

Calls:
- AdjustableDate


## Unresolved Helper Functions

- Account
- AdjustableDate
- AncillaryParty
- Counterparty
- CreateObservableKey
- CreateObservableWithAddress
- CreatePriceKey
- CreatePriceWithAddress
- CreateQuantityKey
- CreateQuantityWithAddress
- Currency
- EconomicTerms
- FxCashSettlement
- FxCoreDetailsModel
- FxRate
- FxSingleLeg
- GetFpmlExchangedCurrency
- Leg
- MapAdjustableOrAdjustedOrRelativeDate
- MapAssetClassWithScheme
- MapCounterparty
- MapCounterpartyRoleEnum
- MapCurrencyToObservableCashWithLocation
- MapFxCoreDetailsModelPriceListWithLocation
- MapFxCoreDetailsModelQuantityListWithLocation
- MapStringWithScheme
- MapTaxonomySourceEnum
- Money
- NonNegativeQuantitySchedule
- NonTransferableProduct
- Observable
- Party
- PayerReceiver
- PayerReceiverModel
- Payout
- PriceQuantity
- PriceSchedule
- ProductIdentifier
- ProductModel
- ProductTaxonomy
- QuotedCurrencyPair
- SettlementTerms
