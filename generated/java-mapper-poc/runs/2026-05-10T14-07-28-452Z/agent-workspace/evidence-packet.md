# Evidence Packet

Generated: 2026-05-10T14:07:28.705Z

# Product Scope

Selected product family: fx-derivatives
Implementation strategy: staged-by-product-group
Default current implementation group: fx-single-leg
Candidate next groups: fx-swap, fx-simple-option

## Product Groups

- fx-single-leg: 7 fixture(s), good-first-target. Default starting group for staged FX-family generation.
- fx-swap: 1 fixture(s), candidate. Natural next FX group after single-leg handling.
- fx-simple-option: 3 fixture(s), candidate. Candidate after simpler linear FX products are stable.
- fx-digital-option: 6 fixture(s), later. Requires richer option handling and should follow simpler options.
- fx-barrier-option: 2 fixture(s), later. More complex option variant; later milestone.
- fx-average-rate-option: 2 fixture(s), later. More complex option variant; later milestone.
- fx-strategy: 2 fixture(s), later. Strategy wrappers need separate decomposition logic.
- non-fx: 2 fixture(s), exclude. Excluded from FX derivatives generation.

## Classified Fixtures

- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex01-fx-spot.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex02-spot-cross-w-side-rates.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex02-spot-cross-w-side-rates.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex03-fx-fwd.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex03-fx-fwd.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex04-fx-fwd-w-settlement.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex04-fx-fwd-w-settlement.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex05-fx-fwd-w-ssi.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex05-fx-fwd-w-ssi.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex06-fx-fwd-w-splits.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex06-fx-fwd-w-splits.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex07-non-deliverable-forward.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex07-non-deliverable-forward.json
- fx-swap: data_to_learn_from\fpml\fx-derivatives\fx-ex08-fx-swap.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex08-fx-swap.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex09-euro-opt.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex09-euro-opt.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex10-amer-opt.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex10-amer-opt.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex11-non-deliverable-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex11-non-deliverable-option.json
- fx-barrier-option: data_to_learn_from\fpml\fx-derivatives\fx-ex12-fx-barrier-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex12-fx-barrier-option.json
- fx-barrier-option: data_to_learn_from\fpml\fx-derivatives\fx-ex13-fx-dbl-barrier-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex13-fx-dbl-barrier-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex14-euro-digital-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex14-euro-digital-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex15-euro-range-digital-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex15-euro-range-digital-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex16-one-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex16-one-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex17-no-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex17-no-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex18-double-one-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex18-double-one-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex19-double-no-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex19-double-no-touch-option.json
- fx-average-rate-option: data_to_learn_from\fpml\fx-derivatives\fx-ex20-avg-rate-option-parametric.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex20-avg-rate-option-parametric.json
- fx-average-rate-option: data_to_learn_from\fpml\fx-derivatives\fx-ex21-avg-rate-option-specific.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex21-avg-rate-option-specific.json
- fx-strategy: data_to_learn_from\fpml\fx-derivatives\fx-ex22-straddle.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex22-straddle.json
- fx-strategy: data_to_learn_from\fpml\fx-derivatives\fx-ex23-delta-hedge.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex23-delta-hedge.json
- non-fx: data_to_learn_from\fpml\fx-derivatives\td-ex01-simple-term-deposit.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\td-ex01-simple-term-deposit.json
- non-fx: data_to_learn_from\fpml\fx-derivatives\td-ex02-term-deposit-w-settlement-etc.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\td-ex02-term-deposit-w-settlement-etc.json

## Rules

- Use this product map instead of discovering product types through broad search.
- Plan within the FX derivatives family.
- Do not add non-FX products to the current plan.
- Do not invent fixture paths, cookbook paths, or product roots.
- If changing the default implementation group, write an "Implementation Group Change Proposal".


## Fixture Summaries

### data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml

```text
/FpML/header/conversationId = FX987
/FpML/header/messageId = FX456a789b
/FpML/header/sentBy = MATCHSRV
/FpML/header/sendTo = CITIUS
/FpML/header/creationTimestamp = 2001-10-01T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI123
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = BARC987
/FpML/trade/tradeHeader/tradeDate = 2001-10-23Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = GBP
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 14800000
/FpML/trade/fxSingleLeg/valueDate = 2001-10-25Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 1.48
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = BARCGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex02-spot-cross-w-side-rates.xml

```text
/FpML/header/conversationId = FX987
/FpML/header/messageId = FX456a789b
/FpML/header/sentBy = PARTYAUS
/FpML/header/sendTo = MATCHSRV
/FpML/header/creationTimestamp = 2001-10-23T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = PARTYA345
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = CSFB9842
/FpML/trade/tradeHeader/tradeDate = 2001-10-23Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = GBP
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = EUR
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 6300680
/FpML/trade/fxSingleLeg/valueDate = 2001-10-25Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = EUR
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 0.630068
/FpML/trade/fxSingleLeg/exchangeRate/sideRates/baseCurrency = USD
/FpML/trade/fxSingleLeg/exchangeRate/sideRates/currency1SideRate/currency = GBP
/FpML/trade/fxSingleLeg/exchangeRate/sideRates/currency1SideRate/sideRateBasis = BaseCurrencyPerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/sideRates/currency1SideRate/rate = 1.4800
/FpML/trade/fxSingleLeg/exchangeRate/sideRates/currency2SideRate/currency = EUR
/FpML/trade/fxSingleLeg/exchangeRate/sideRates/currency2SideRate/sideRateBasis = BaseCurrencyPerCurrency2
/FpML/trade/fxSingleLeg/exchangeRate/sideRates/currency2SideRate/rate = 0.9325
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[1]/partyId = CSFBUS33
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex03-fx-fwd.xml

```text
/FpML/header/conversationId = FX987
/FpML/header/messageId = FX456a789b
/FpML/header/sentBy = ABN
/FpML/header/sendTo = MATCHSRV
/FpML/header/creationTimestamp = 2001-11-19T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = ABN1234
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = DB5678
/FpML/trade/tradeHeader/tradeDate = 2001-11-19Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = EUR
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 9175000
/FpML/trade/fxSingleLeg/valueDate = 2001-12-21Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = EUR
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 0.9175
/FpML/trade/fxSingleLeg/exchangeRate/spotRate = 0.9130
/FpML/trade/fxSingleLeg/exchangeRate/forwardPoints = 0.0045
/FpML/party
/FpML/party[0]/partyId = ABNANL2A
/FpML/party[1]/partyId = DEUTDEFF
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex04-fx-fwd-w-settlement.xml

```text
/FpML/header/conversationId = FX987
/FpML/header/messageId = FX456a789b
/FpML/header/sentBy = MATCHSRV
/FpML/header/sendTo = CITIUS
/FpML/header/creationTimestamp = 2001-10-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = FWD123
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = FXD2002987
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = GBP
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/settlementMethod = SWIFT
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/correspondentInformation/routingIds/routingId = UBSWGB2L
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/beneficiaryBank/routingIds/routingId = CITIGB2L
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/beneficiary/routingIds/routingId = CITIUS33
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 14643000
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiaryBank/routingIdsAndExplicitDetails/routingIds/routingId = CITIUS33
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiaryBank/routingIdsAndExplicitDetails/routingName = Citibank
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiaryBank/routingIdsAndExplicitDetails/routingAccountNumber = /C/1234567788
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiary/routingIds/routingId = UBSWCHZH
/FpML/trade/fxSingleLeg/valueDate = 2002-04-01Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 1.4643
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = UBSWCHZH
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex05-fx-fwd-w-ssi.xml

```text
/FpML/header/conversationId = FX987
/FpML/header/messageId = FX456a789b
/FpML/header/sentBy = ABN
/FpML/header/sendTo = MATCHSRV
/FpML/header/creationTimestamp = 2001-11-19T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = ABN1234
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = DB5678
/FpML/trade/tradeHeader/tradeDate = 2001-11-19Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = EUR
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/standardSettlementStyle = Standard
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 9175000
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/standardSettlementStyle = Standard
/FpML/trade/fxSingleLeg/valueDate = 2001-12-21Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = EUR
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 0.9175
/FpML/trade/fxSingleLeg/exchangeRate/spotRate = 0.9130
/FpML/trade/fxSingleLeg/exchangeRate/forwardPoints = 0.0045
/FpML/party
/FpML/party[0]/partyId = ABNANL2A
/FpML/party[1]/partyId = DEUTDEFF
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex06-fx-fwd-w-splits.xml

```text
/FpML/header/conversationId = FX1234
/FpML/header/messageId = FX98765
/FpML/header/sentBy = DEUTDEFF
/FpML/header/sendTo = ABNANL2A
/FpML/header/creationTimestamp = 2001-11-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = FX048VS
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = USABC023
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 13000000
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/settlementMethod = SWIFT
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/correspondentInformation/routingIds/routingId = DEUTUS33
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/beneficiary/routingIds/routingId = ABNANL2A
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[0]/splitSettlementAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[0]/splitSettlementAmount/amount = 3000000
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[0]/beneficiaryBank/routingIds/routingId = ABNAUS33
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[0]/beneficiary/routingIds/routingId = ABNANL2A
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[1]/splitSettlementAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[1]/splitSettlementAmount/amount = 4000000
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[1]/beneficiaryBank/routingIds/routingId = ABNAUS4C
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[1]/beneficiary/routingIds/routingId = ABNANL2A
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[2]/splitSettlementAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[2]/splitSettlementAmount/amount = 6000000
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[2]/beneficiaryBank/routingIds/routingId = ABNAUS6F
/FpML/trade/fxSingleLeg/exchangedCurrency1/settlementInformation/settlementInstruction/splitSettlement[2]/beneficiary/routingIds/routingId = ABNANL2A
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = EUR
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 14393600
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiaryBank/routingIdsAndExplicitDetails/routingIds/routingId = DEUTDEFF
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiaryBank/routingIdsAndExplicitDetails/routingName = DeutscheBank
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiaryBank/routingIdsAndExplicitDetails/routingAccountNumber = /D/123-456-789
/FpML/trade/fxSingleLeg/exchangedCurrency2/settlementInformation/settlementInstruction/beneficiary/routingIds/routingId = DEUTDEFF
/FpML/trade/fxSingleLeg/valueDate = 2002-02-14Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = USD
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = EUR
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 1.1072
/FpML/party
/FpML/party[0]/partyId = DEUTDEFF
/FpML/party[1]/partyId = ABNANL2A
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex07-non-deliverable-forward.xml

```text
/FpML/header/conversationId = 1234
/FpML/header/messageId = 09876
/FpML/header/sentBy = PARTYAUS33
/FpML/header/sendTo = CSFBUS33
/FpML/header/creationTimestamp = 2002-01-09T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = PARTYA345
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = CSFB9842
/FpML/trade/tradeHeader/tradeDate = 2002-01-09Z
/FpML/trade/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = USD
/FpML/trade/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = INR
/FpML/trade/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 434000000
/FpML/trade/fxSingleLeg/valueDate = 2002-04-11Z
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = USD
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = INR
/FpML/trade/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/exchangeRate/rate = 43.40
/FpML/trade/fxSingleLeg/exchangeRate/spotRate = 43.35
/FpML/trade/fxSingleLeg/exchangeRate/forwardPoints = 0.05
/FpML/trade/fxSingleLeg/nonDeliverableForward/settlementCurrency = USD
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/primaryRateSource/rateSource = Reuters
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/primaryRateSource/rateSourcePage = RBIB
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/fixingTime/hourMinuteTime = 14:30:00
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/fixingTime/businessCenter = INMU
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/quotedCurrencyPair/currency1 = USD
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/quotedCurrencyPair/currency2 = INR
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSingleLeg/nonDeliverableForward/fixing/fixingDate = 2002-04-09Z
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[1]/partyId = CSFBUS33
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex08-fx-swap.xml

```text
/FpML/header/conversationId = FX12345
/FpML/header/messageId = FX098765
/FpML/header/sentBy = DEUTDEFF
/FpML/header/sendTo = PARTYAUS33
/FpML/header/creationTimestamp = 2002-01-23T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = PARTYAUS33
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = DEUTDEFF
/FpML/trade/tradeHeader/tradeDate = 2002-01-23Z
/FpML/trade/fxSwap/productType = FXSWAP
/FpML/trade/fxSwap/fxSingleLeg
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency1/paymentAmount/currency = GBP
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangedCurrency2/paymentAmount/amount = 14800000
/FpML/trade/fxSwap/fxSingleLeg[0]/valueDate = 2002-01-25Z
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangeRate/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSwap/fxSingleLeg[0]/exchangeRate/rate = 1.48
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency1/payerPartyReference = party1
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency1/receiverPartyReference = party2
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency1/paymentAmount/currency = GBP
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency1/paymentAmount/amount = 10000000
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency2/payerPartyReference = party2
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency2/receiverPartyReference = party1
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangedCurrency2/paymentAmount/amount = 15000000
/FpML/trade/fxSwap/fxSingleLeg[1]/valueDate = 2002-02-25Z
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangeRate/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxSwap/fxSingleLeg[1]/exchangeRate/rate = 1.5
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[1]/partyId = DEUTDEFF
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex09-euro-opt.xml

```text
/FpML/header/conversationId = FX12345
/FpML/header/messageId = FX098765
/FpML/header/sentBy = ABNANL2A
/FpML/header/sendTo = PARTYAUS33
/FpML/header/creationTimestamp = 2002-01-04T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = IBFXO-0123456789
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = IBFXO-0123456789
/FpML/trade/tradeHeader/tradeDate = 2002-01-04Z
/FpML/trade/fxSimpleOption/productType = Delta-Put-FX-Option
/FpML/trade/fxSimpleOption/buyerPartyReference = party1
/FpML/trade/fxSimpleOption/sellerPartyReference = party2
/FpML/trade/fxSimpleOption/expiryDateTime/expiryDate = 2002-06-04Z
/FpML/trade/fxSimpleOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxSimpleOption/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/fxSimpleOption/expiryDateTime/cutName = NewYork
/FpML/trade/fxSimpleOption/exerciseStyle = European
/FpML/trade/fxSimpleOption/fxOptionPremium/payerPartyReference = party1
/FpML/trade/fxSimpleOption/fxOptionPremium/receiverPartyReference = party2
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumAmount/amount = 36900
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumSettlementDate = 2001-12-06Z
/FpML/trade/fxSimpleOption/fxOptionPremium/settlementInformation/settlementInstruction/correspondentInformation/routingIds/routingId = PARTYAUS33
/FpML/trade/fxSimpleOption/fxOptionPremium/settlementInformation/settlementInstruction/beneficiary/routingIds/routingId = ABNANL2A
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumQuote/premiumValue = 0.001
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumQuote/premiumQuoteBasis = PercentageOfCallCurrencyAmount
/FpML/trade/fxSimpleOption/valueDate = 2002-06-06Z
/FpML/trade/fxSimpleOption/putCurrencyAmount/currency = AUD
/FpML/trade/fxSimpleOption/putCurrencyAmount/amount = 75000000
/FpML/trade/fxSimpleOption/callCurrencyAmount/currency = USD
/FpML/trade/fxSimpleOption/callCurrencyAmount/amount = 36900000
/FpML/trade/fxSimpleOption/fxStrikePrice/rate = 0.4920
/FpML/trade/fxSimpleOption/fxStrikePrice/strikeQuoteBasis = CallCurrencyPerPutCurrency
/FpML/trade/fxSimpleOption/quotedAs/optionOnCurrency = AUD
/FpML/trade/fxSimpleOption/quotedAs/faceOnCurrency = USD
/FpML/trade/fxSimpleOption/quotedAs/quotedTenor/periodMultiplier = 6
/FpML/trade/fxSimpleOption/quotedAs/quotedTenor/period = M
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[0]/partyName = Party A
/FpML/party[1]/partyId = ABNANL2A
/FpML/party[1]/partyName = ABN Amro
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex10-amer-opt.xml

```text
/FpML/header/conversationId = FX01234
/FpML/header/messageId = FX109876
/FpML/header/sentBy = ABNANL2A
/FpML/header/sendTo = PARTYAUS33
/FpML/header/creationTimestamp = 2001-12-04T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = 123456789
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = ABN1789
/FpML/trade/tradeHeader/tradeDate = 2001-12-04Z
/FpML/trade/fxSimpleOption/productType = American FX Option
/FpML/trade/fxSimpleOption/buyerPartyReference = party1
/FpML/trade/fxSimpleOption/sellerPartyReference = party2
/FpML/trade/fxSimpleOption/expiryDateTime/expiryDate = 2002-06-04Z
/FpML/trade/fxSimpleOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxSimpleOption/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/fxSimpleOption/expiryDateTime/cutName = NewYork
/FpML/trade/fxSimpleOption/exerciseStyle = American
/FpML/trade/fxSimpleOption/fxOptionPremium/payerPartyReference = party1
/FpML/trade/fxSimpleOption/fxOptionPremium/receiverPartyReference = party2
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumAmount/amount = 36900
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumSettlementDate = 2001-12-06Z
/FpML/trade/fxSimpleOption/fxOptionPremium/settlementInformation/settlementInstruction/correspondentInformation/routingIds/routingId = PARTYAUS33
/FpML/trade/fxSimpleOption/fxOptionPremium/settlementInformation/settlementInstruction/beneficiary/routingIds/routingId = ABNANL2A
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumQuote/premiumValue = 0.001
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumQuote/premiumQuoteBasis = PercentageOfCallCurrencyAmount
/FpML/trade/fxSimpleOption/valueDate = 2002-06-06Z
/FpML/trade/fxSimpleOption/putCurrencyAmount/currency = AUD
/FpML/trade/fxSimpleOption/putCurrencyAmount/amount = 75000000
/FpML/trade/fxSimpleOption/callCurrencyAmount/currency = USD
/FpML/trade/fxSimpleOption/callCurrencyAmount/amount = 36900000
/FpML/trade/fxSimpleOption/fxStrikePrice/rate = 0.4920
/FpML/trade/fxSimpleOption/fxStrikePrice/strikeQuoteBasis = CallCurrencyPerPutCurrency
/FpML/trade/fxSimpleOption/quotedAs/optionOnCurrency = AUD
/FpML/trade/fxSimpleOption/quotedAs/faceOnCurrency = USD
/FpML/trade/fxSimpleOption/quotedAs/quotedTenor/periodMultiplier = 6
/FpML/trade/fxSimpleOption/quotedAs/quotedTenor/period = M
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[0]/partyName = PARTYA
/FpML/party[1]/partyId = ABNANL2A
/FpML/party[1]/partyName = ABN Amro
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex11-non-deliverable-option.xml

```text
/FpML/header/conversationId = FX01234
/FpML/header/messageId = FX109876
/FpML/header/sentBy = ABNANL2A
/FpML/header/sendTo = PARTYAUS33
/FpML/header/creationTimestamp = 2001-01-15T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = IBFXO-0123456789
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = IBFXO-0123456789
/FpML/trade/tradeHeader/tradeDate = 2001-01-15Z
/FpML/trade/fxSimpleOption/productType = Nondeliverable Option
/FpML/trade/fxSimpleOption/buyerPartyReference = party1
/FpML/trade/fxSimpleOption/sellerPartyReference = party2
/FpML/trade/fxSimpleOption/expiryDateTime/expiryDate = 2001-04-09Z
/FpML/trade/fxSimpleOption/expiryDateTime/expiryTime/hourMinuteTime = 10:00:00
/FpML/trade/fxSimpleOption/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/fxSimpleOption/exerciseStyle = European
/FpML/trade/fxSimpleOption/fxOptionPremium/payerPartyReference = party1
/FpML/trade/fxSimpleOption/fxOptionPremium/receiverPartyReference = party2
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumAmount/amount = 372750
/FpML/trade/fxSimpleOption/fxOptionPremium/premiumSettlementDate = 2001-01-17Z
/FpML/trade/fxSimpleOption/valueDate = 2001-04-11Z
/FpML/trade/fxSimpleOption/cashSettlementTerms/settlementCurrency = USD
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/primaryRateSource/rateSource = Reuters
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/primaryRateSource/rateSourcePage = VEB01
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/fixingTime/hourMinuteTime = 17:00:00
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/fixingTime/businessCenter = VECA
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/quotedCurrencyPair/currency1 = VEB
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/quotedCurrencyPair/quoteBasis = Currency1PerCurrency2
/FpML/trade/fxSimpleOption/cashSettlementTerms/fixing/fixingDate = 2001-04-09Z
/FpML/trade/fxSimpleOption/putCurrencyAmount/currency = VEB
/FpML/trade/fxSimpleOption/putCurrencyAmount/amount = 17250000
/FpML/trade/fxSimpleOption/callCurrencyAmount/currency = USD
/FpML/trade/fxSimpleOption/callCurrencyAmount/amount = 15000000
/FpML/trade/fxSimpleOption/fxStrikePrice/rate = 1.15
/FpML/trade/fxSimpleOption/fxStrikePrice/strikeQuoteBasis = PutCurrencyPerCallCurrency
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[0]/partyName = PARTYA
/FpML/party[1]/partyId = ABNANL2A
/FpML/party[1]/partyName = ABN Amro
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex12-fx-barrier-option.xml

```text
/FpML/header/conversationId = FX01234
/FpML/header/messageId = FX109876
/FpML/header/sentBy = PARTYAUS33
/FpML/header/sendTo = DEUTDEFF
/FpML/header/creationTimestamp = 2001-08-16T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = PARTYAUS33
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = DEUTDEFF
/FpML/trade/tradeHeader/tradeDate = 2001-08-16Z
/FpML/trade/fxBarrierOption/buyerPartyReference = party2
/FpML/trade/fxBarrierOption/sellerPartyReference = party1
/FpML/trade/fxBarrierOption/expiryDateTime/expiryDate = 2002-02-06Z
/FpML/trade/fxBarrierOption/expiryDateTime/expiryTime/hourMinuteTime = 10:00:00
/FpML/trade/fxBarrierOption/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/fxBarrierOption/exerciseStyle = European
/FpML/trade/fxBarrierOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxBarrierOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumAmount/amount = 45000
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumSettlementDate = 2001-11-06Z
/FpML/trade/fxBarrierOption/valueDate = 2002-02-08Z
/FpML/trade/fxBarrierOption/putCurrencyAmount/currency = USD
/FpML/trade/fxBarrierOption/putCurrencyAmount/amount = 4500000
/FpML/trade/fxBarrierOption/callCurrencyAmount/currency = EUR
/FpML/trade/fxBarrierOption/callCurrencyAmount/amount = 5000000
/FpML/trade/fxBarrierOption/fxStrikePrice/rate = 0.9
/FpML/trade/fxBarrierOption/fxStrikePrice/strikeQuoteBasis = PutCurrencyPerCallCurrency
/FpML/trade/fxBarrierOption/spotRate = 0.8935
/FpML/trade/fxBarrierOption/fxBarrier/fxBarrierType = Knockin
/FpML/trade/fxBarrierOption/fxBarrier/quotedCurrencyPair/currency1 = EUR
/FpML/trade/fxBarrierOption/fxBarrier/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxBarrierOption/fxBarrier/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxBarrierOption/fxBarrier/triggerRate = 0.8975
/FpML/trade/fxBarrierOption/fxBarrier/informationSource/rateSource = Reuters
/FpML/trade/fxBarrierOption/fxBarrier/informationSource/rateSourcePage = EUR=
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[1]/partyId = DEUTDEFF
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex13-fx-dbl-barrier-option.xml

```text
/FpML/header/conversationId = FX01234
/FpML/header/messageId = FX109876
/FpML/header/sentBy = DEUTDEFF
/FpML/header/sendTo = PARTYAUS33
/FpML/header/creationTimestamp = 2002-01-03T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = PARTYAUS33
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = DEUTDEFF
/FpML/trade/tradeHeader/tradeDate = 2002-01-03Z
/FpML/trade/fxBarrierOption/productType = DOUBLEBARRIER
/FpML/trade/fxBarrierOption/buyerPartyReference = party2
/FpML/trade/fxBarrierOption/sellerPartyReference = party1
/FpML/trade/fxBarrierOption/expiryDateTime/expiryDate = 2002-03-04Z
/FpML/trade/fxBarrierOption/expiryDateTime/expiryTime/hourMinuteTime = 10:00:00
/FpML/trade/fxBarrierOption/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/fxBarrierOption/exerciseStyle = European
/FpML/trade/fxBarrierOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxBarrierOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumAmount/amount = 192765.35
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumSettlementDate = 2002-01-07Z
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumQuote/premiumValue = 0.0081
/FpML/trade/fxBarrierOption/fxOptionPremium/premiumQuote/premiumQuoteBasis = PercentageOfCallCurrencyAmount
/FpML/trade/fxBarrierOption/valueDate = 2002-03-06Z
/FpML/trade/fxBarrierOption/putCurrencyAmount/currency = JPY
/FpML/trade/fxBarrierOption/putCurrencyAmount/amount = 2500000000
/FpML/trade/fxBarrierOption/callCurrencyAmount/currency = USD
/FpML/trade/fxBarrierOption/callCurrencyAmount/amount = 23798191.34
/FpML/trade/fxBarrierOption/fxStrikePrice/rate = 105.05
/FpML/trade/fxBarrierOption/fxStrikePrice/strikeQuoteBasis = PutCurrencyPerCallCurrency
/FpML/trade/fxBarrierOption/quotedAs/optionOnCurrency = JPY
/FpML/trade/fxBarrierOption/quotedAs/faceOnCurrency = USD
/FpML/trade/fxBarrierOption/quotedAs/quotedTenor/periodMultiplier = 2
/FpML/trade/fxBarrierOption/quotedAs/quotedTenor/period = M
/FpML/trade/fxBarrierOption/spotRate = 106
/FpML/trade/fxBarrierOption/fxBarrier
/FpML/trade/fxBarrierOption/fxBarrier[0]/fxBarrierType = ReverseKnockout
/FpML/trade/fxBarrierOption/fxBarrier[0]/quotedCurrencyPair/currency1 = USD
/FpML/trade/fxBarrierOption/fxBarrier[0]/quotedCurrencyPair/currency2 = JPY
/FpML/trade/fxBarrierOption/fxBarrier[0]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxBarrierOption/fxBarrier[0]/triggerRate = 102
/FpML/trade/fxBarrierOption/fxBarrier[0]/informationSource/rateSource = Reuters
/FpML/trade/fxBarrierOption/fxBarrier[0]/informationSource/rateSourcePage = JPY=
/FpML/trade/fxBarrierOption/fxBarrier[1]/fxBarrierType = Knockout
/FpML/trade/fxBarrierOption/fxBarrier[1]/quotedCurrencyPair/currency1 = USD
/FpML/trade/fxBarrierOption/fxBarrier[1]/quotedCurrencyPair/currency2 = JPY
/FpML/trade/fxBarrierOption/fxBarrier[1]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxBarrierOption/fxBarrier[1]/triggerRate = 115
/FpML/trade/fxBarrierOption/fxBarrier[1]/informationSource/rateSource = Reuters
/FpML/trade/fxBarrierOption/fxBarrier[1]/informationSource/rateSourcePage = JPY=
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[1]/partyId = DEUTDEFF
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex14-euro-digital-option.xml

```text
/FpML/header/conversationId = FX01234
/FpML/header/messageId = FX109876
/FpML/header/sentBy = CITIUS33
/FpML/header/sendTo = UBSWGB2L
/FpML/header/creationTimestamp = 2001-11-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI10014
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = UBSW20014
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/productType = Euro Binary
/FpML/trade/fxDigitalOption/buyerPartyReference = party2
/FpML/trade/fxDigitalOption/sellerPartyReference = party1
/FpML/trade/fxDigitalOption/expiryDateTime/expiryDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/businessCenter = GBLO
/FpML/trade/fxDigitalOption/expiryDateTime/cutName = LondonEveningPgm
/FpML/trade/fxDigitalOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxDigitalOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/currency = GBP
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/amount = 53000
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumSettlementDate = 2001-11-14Z
/FpML/trade/fxDigitalOption/valueDate = 2001-11-28Z
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/spotRate = 1.4800
/FpML/trade/fxDigitalOption/fxEuropeanTrigger/triggerCondition = Above
/FpML/trade/fxDigitalOption/fxEuropeanTrigger/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxEuropeanTrigger/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxEuropeanTrigger/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxEuropeanTrigger/triggerRate = 1.4800
/FpML/trade/fxDigitalOption/fxEuropeanTrigger/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxEuropeanTrigger/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/triggerPayout/currency = GBP
/FpML/trade/fxDigitalOption/triggerPayout/amount = 750000
/FpML/trade/fxDigitalOption/triggerPayout/payoutStyle = Immediate
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = UBSWGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex15-euro-range-digital-option.xml

```text
/FpML/header/conversationId = FX01234
/FpML/header/messageId = FX109876
/FpML/header/sentBy = CITI10015
/FpML/header/sendTo = UBSW20015
/FpML/header/creationTimestamp = 2001-11-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI10015
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = UBSW20015
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/productType = Euro Range Binary
/FpML/trade/fxDigitalOption/buyerPartyReference = party2
/FpML/trade/fxDigitalOption/sellerPartyReference = party1
/FpML/trade/fxDigitalOption/expiryDateTime/expiryDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/businessCenter = GBLO
/FpML/trade/fxDigitalOption/expiryDateTime/cutName = LondonEveningPgm
/FpML/trade/fxDigitalOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxDigitalOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/currency = GBP
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/amount = 43000
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumSettlementDate = 2001-11-14Z
/FpML/trade/fxDigitalOption/valueDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/spotRate = 1.4800
/FpML/trade/fxDigitalOption/fxEuropeanTrigger
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[0]/triggerCondition = Above
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[0]/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[0]/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[0]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[0]/triggerRate = 1.4800
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[0]/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[0]/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[1]/triggerCondition = Below
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[1]/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[1]/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[1]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[1]/triggerRate = 1.5500
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[1]/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxEuropeanTrigger[1]/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/triggerPayout/currency = GBP
/FpML/trade/fxDigitalOption/triggerPayout/amount = 1250000
/FpML/trade/fxDigitalOption/triggerPayout/payoutStyle = Immediate
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = UBSWGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex16-one-touch-option.xml

```text
/FpML/header/conversationId = FX12345
/FpML/header/messageId = FX019876
/FpML/header/sentBy = CITI10015
/FpML/header/sendTo = UBSW20015
/FpML/header/creationTimestamp = 2001-11-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI10016
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = UBSW20016
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/productType = One Touch
/FpML/trade/fxDigitalOption/buyerPartyReference = party2
/FpML/trade/fxDigitalOption/sellerPartyReference = party1
/FpML/trade/fxDigitalOption/expiryDateTime/expiryDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/businessCenter = GBLO
/FpML/trade/fxDigitalOption/expiryDateTime/cutName = LondonEveningPgm
/FpML/trade/fxDigitalOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxDigitalOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/currency = GBP
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/amount = 78000
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumSettlementDate = 2001-11-14Z
/FpML/trade/fxDigitalOption/valueDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/spotRate = 1.4800
/FpML/trade/fxDigitalOption/fxAmericanTrigger/touchCondition = Touch
/FpML/trade/fxDigitalOption/fxAmericanTrigger/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxAmericanTrigger/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxAmericanTrigger/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxAmericanTrigger/triggerRate = 1.5200
/FpML/trade/fxDigitalOption/fxAmericanTrigger/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxAmericanTrigger/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/fxAmericanTrigger/observationStartDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger/observationEndDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/triggerPayout/currency = GBP
/FpML/trade/fxDigitalOption/triggerPayout/amount = 2000000
/FpML/trade/fxDigitalOption/triggerPayout/payoutStyle = Deferred
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = UBSWGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex17-no-touch-option.xml

```text
/FpML/header/conversationId = FX09876
/FpML/header/messageId = FX65432
/FpML/header/sentBy = UBSW20015
/FpML/header/sendTo = CITI10015
/FpML/header/creationTimestamp = 2001-11-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI10017
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = UBSW20018
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/productType = No Touch
/FpML/trade/fxDigitalOption/buyerPartyReference = party2
/FpML/trade/fxDigitalOption/sellerPartyReference = party1
/FpML/trade/fxDigitalOption/expiryDateTime/expiryDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/businessCenter = GBLO
/FpML/trade/fxDigitalOption/expiryDateTime/cutName = LondonEveningPgm
/FpML/trade/fxDigitalOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxDigitalOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/currency = GBP
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/amount = 78000
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumSettlementDate = 2001-11-14Z
/FpML/trade/fxDigitalOption/valueDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/spotRate = 1.4800
/FpML/trade/fxDigitalOption/fxAmericanTrigger/touchCondition = Notouch
/FpML/trade/fxDigitalOption/fxAmericanTrigger/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxAmericanTrigger/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxAmericanTrigger/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxAmericanTrigger/triggerRate = 1.5200
/FpML/trade/fxDigitalOption/fxAmericanTrigger/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxAmericanTrigger/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/fxAmericanTrigger/observationStartDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger/observationEndDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/triggerPayout/currency = GBP
/FpML/trade/fxDigitalOption/triggerPayout/amount = 3000000
/FpML/trade/fxDigitalOption/triggerPayout/payoutStyle = Immediate
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = UBSWGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex18-double-one-touch-option.xml

```text
/FpML/header/conversationId = FX65432
/FpML/header/messageId = FX87654
/FpML/header/sentBy = UBSW20015
/FpML/header/sendTo = CITI10015
/FpML/header/creationTimestamp = 2001-11-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI10018
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = UBSW20018
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/productType = Double one touch
/FpML/trade/fxDigitalOption/buyerPartyReference = party2
/FpML/trade/fxDigitalOption/sellerPartyReference = party1
/FpML/trade/fxDigitalOption/expiryDateTime/expiryDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/businessCenter = GBLO
/FpML/trade/fxDigitalOption/expiryDateTime/cutName = LondonEveningPgm
/FpML/trade/fxDigitalOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxDigitalOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/currency = GBP
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/amount = 78000
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumSettlementDate = 2001-11-14Z
/FpML/trade/fxDigitalOption/valueDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/spotRate = 1.4800
/FpML/trade/fxDigitalOption/fxAmericanTrigger
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/touchCondition = Touch
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/triggerRate = 1.5200
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/observationStartDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/observationEndDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/touchCondition = Touch
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/triggerRate = 1.4600
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/observationStartDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/observationEndDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/triggerPayout/currency = GBP
/FpML/trade/fxDigitalOption/triggerPayout/amount = 2000000
/FpML/trade/fxDigitalOption/triggerPayout/payoutStyle = Immediate
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = UBSWGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex19-double-no-touch-option.xml

```text
/FpML/header/conversationId = FX65432
/FpML/header/messageId = FX87654
/FpML/header/sentBy = UBSW20015
/FpML/header/sendTo = CITI10015
/FpML/header/creationTimestamp = 2001-11-12T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CITI10019
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = UBSW20019
/FpML/trade/tradeHeader/tradeDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/productType = Double no touch
/FpML/trade/fxDigitalOption/buyerPartyReference = party2
/FpML/trade/fxDigitalOption/sellerPartyReference = party1
/FpML/trade/fxDigitalOption/expiryDateTime/expiryDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/fxDigitalOption/expiryDateTime/expiryTime/businessCenter = GBLO
/FpML/trade/fxDigitalOption/expiryDateTime/cutName = LondonEveningPgm
/FpML/trade/fxDigitalOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxDigitalOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/currency = GBP
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumAmount/amount = 78000
/FpML/trade/fxDigitalOption/fxOptionPremium/premiumSettlementDate = 2001-11-14Z
/FpML/trade/fxDigitalOption/valueDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/spotRate = 1.4800
/FpML/trade/fxDigitalOption/fxAmericanTrigger
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/touchCondition = Notouch
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/triggerRate = 1.5200
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/observationStartDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger[0]/observationEndDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/touchCondition = Notouch
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/quotedCurrencyPair/currency1 = GBP
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/quotedCurrencyPair/currency2 = USD
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/triggerRate = 1.4500
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/informationSource/rateSource = Reuters
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/informationSource/rateSourcePage = GBP=
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/observationStartDate = 2001-11-12Z
/FpML/trade/fxDigitalOption/fxAmericanTrigger[1]/observationEndDate = 2001-11-26Z
/FpML/trade/fxDigitalOption/triggerPayout/currency = GBP
/FpML/trade/fxDigitalOption/triggerPayout/amount = 3000000
/FpML/trade/fxDigitalOption/triggerPayout/payoutStyle = Immediate
/FpML/party
/FpML/party[0]/partyId = CITIUS33
/FpML/party[1]/partyId = UBSWGB2L
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex20-avg-rate-option-parametric.xml

```text
/FpML/header/conversationId = FX65432
/FpML/header/messageId = FX87654
/FpML/header/sentBy = PARTYAUS33
/FpML/header/sendTo = DEUTDEFF
/FpML/header/creationTimestamp = 2001-08-16T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = CH-12345
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = DB-98765
/FpML/trade/tradeHeader/tradeDate = 2001-08-16Z
/FpML/trade/fxAverageRateOption/buyerPartyReference = party2
/FpML/trade/fxAverageRateOption/sellerPartyReference = party1
/FpML/trade/fxAverageRateOption/expiryDateTime/expiryDate = 2001-11-30Z
/FpML/trade/fxAverageRateOption/expiryDateTime/expiryTime/hourMinuteTime = 12:30:00
/FpML/trade/fxAverageRateOption/expiryDateTime/expiryTime/businessCenter = MXMC
/FpML/trade/fxAverageRateOption/exerciseStyle = European
/FpML/trade/fxAverageRateOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxAverageRateOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxAverageRateOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/fxAverageRateOption/fxOptionPremium/premiumAmount/amount = 1750
/FpML/trade/fxAverageRateOption/fxOptionPremium/premiumSettlementDate = 2001-08-18Z
/FpML/trade/fxAverageRateOption/valueDate = 2001-12-04Z
/FpML/trade/fxAverageRateOption/putCurrencyAmount/currency = MXN
/FpML/trade/fxAverageRateOption/putCurrencyAmount/amount = 5750000
/FpML/trade/fxAverageRateOption/callCurrencyAmount/currency = USD
/FpML/trade/fxAverageRateOption/callCurrencyAmount/amount = 585539.71
/FpML/trade/fxAverageRateOption/fxStrikePrice/rate = 9.82
/FpML/trade/fxAverageRateOption/fxStrikePrice/strikeQuoteBasis = PutCurrencyPerCallCurrency
/FpML/trade/fxAverageRateOption/payoutCurrency = USD
/FpML/trade/fxAverageRateOption/averageRateQuoteBasis = PutCurrencyPerCallCurrency
/FpML/trade/fxAverageRateOption/primaryRateSource/rateSource = Reuters
/FpML/trade/fxAverageRateOption/primaryRateSource/rateSourcePage = BNBX
/FpML/trade/fxAverageRateOption/fixingTime/hourMinuteTime = 18:00:00
/FpML/trade/fxAverageRateOption/fixingTime/businessCenter = MXMC
/FpML/trade/fxAverageRateOption/averageRateObservationSchedule/observationStartDate = 2001-11-01Z
/FpML/trade/fxAverageRateOption/averageRateObservationSchedule/observationEndDate = 2001-11-30Z
/FpML/trade/fxAverageRateOption/averageRateObservationSchedule/calculationPeriodFrequency/periodMultiplier = 1
/FpML/trade/fxAverageRateOption/averageRateObservationSchedule/calculationPeriodFrequency/period = T
/FpML/trade/fxAverageRateOption/averageRateObservationSchedule/calculationPeriodFrequency/rollConvention = NONE
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[1]/partyId = DEUTDEFF
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex21-avg-rate-option-specific.xml

```text
/FpML/header/conversationId = FX65432
/FpML/header/messageId = FX87654
/FpML/header/sentBy = PARTYAUS33
/FpML/header/sendTo = DEUTDEFF
/FpML/header/creationTimestamp = 2001-08-16T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = PARTYAUS33
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = DB-89080
/FpML/trade/tradeHeader/tradeDate = 2001-08-16Z
/FpML/trade/fxAverageRateOption/buyerPartyReference = party2
/FpML/trade/fxAverageRateOption/sellerPartyReference = party1
/FpML/trade/fxAverageRateOption/expiryDateTime/expiryDate = 2001-11-30Z
/FpML/trade/fxAverageRateOption/expiryDateTime/expiryTime/hourMinuteTime = 12:30:00
/FpML/trade/fxAverageRateOption/expiryDateTime/expiryTime/businessCenter = MXMC
/FpML/trade/fxAverageRateOption/exerciseStyle = European
/FpML/trade/fxAverageRateOption/fxOptionPremium/payerPartyReference = party2
/FpML/trade/fxAverageRateOption/fxOptionPremium/receiverPartyReference = party1
/FpML/trade/fxAverageRateOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/fxAverageRateOption/fxOptionPremium/premiumAmount/amount = 1750
/FpML/trade/fxAverageRateOption/fxOptionPremium/premiumSettlementDate = 2001-08-18Z
/FpML/trade/fxAverageRateOption/valueDate = 2001-12-04Z
/FpML/trade/fxAverageRateOption/putCurrencyAmount/currency = MXN
/FpML/trade/fxAverageRateOption/putCurrencyAmount/amount = 5750000
/FpML/trade/fxAverageRateOption/callCurrencyAmount/currency = USD
/FpML/trade/fxAverageRateOption/callCurrencyAmount/amount = 585539.71
/FpML/trade/fxAverageRateOption/fxStrikePrice/rate = 9.82
/FpML/trade/fxAverageRateOption/fxStrikePrice/strikeQuoteBasis = PutCurrencyPerCallCurrency
/FpML/trade/fxAverageRateOption/payoutCurrency = USD
/FpML/trade/fxAverageRateOption/averageRateQuoteBasis = PutCurrencyPerCallCurrency
/FpML/trade/fxAverageRateOption/primaryRateSource/rateSource = Reuters
/FpML/trade/fxAverageRateOption/primaryRateSource/rateSourcePage = BNBX
/FpML/trade/fxAverageRateOption/fixingTime/hourMinuteTime = 18:00:00
/FpML/trade/fxAverageRateOption/fixingTime/businessCenter = MXMC
/FpML/trade/fxAverageRateOption/averageRateObservationDate
/FpML/trade/fxAverageRateOption/averageRateObservationDate[0]/observationDate = 2001-11-01Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[0]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[1]/observationDate = 2001-11-02Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[1]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[2]/observationDate = 2001-11-05Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[2]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[3]/observationDate = 2001-11-06Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[3]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[4]/observationDate = 2001-11-07Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[4]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[5]/observationDate = 2001-11-08Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[5]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[6]/observationDate = 2001-11-09Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[6]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[7]/observationDate = 2001-11-13Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[7]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[8]/observationDate = 2001-11-14Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[8]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[9]/observationDate = 2001-11-15Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[9]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[10]/observationDate = 2001-11-16Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[10]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[11]/observationDate = 2001-11-19Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[11]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[12]/observationDate = 2001-11-20Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[12]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[13]/observationDate = 2001-11-21Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[13]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[14]/observationDate = 2001-11-23Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[14]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[15]/observationDate = 2001-11-26Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[15]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[16]/observationDate = 2001-11-27Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[16]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[17]/observationDate = 2001-11-28Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[17]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[18]/observationDate = 2001-11-29Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[18]/averageRateWeightingFactor = 1
/FpML/trade/fxAverageRateOption/averageRateObservationDate[19]/observationDate = 2001-11-30Z
/FpML/trade/fxAverageRateOption/averageRateObservationDate[19]/averageRateWeightingFactor = 1
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[1]/partyId = DEUTDEFF
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex22-straddle.xml

```text
/FpML/header/conversationId = FX65432
/FpML/header/messageId = FX87654
/FpML/header/sentBy = ABNANL2A
/FpML/header/sendTo = PARTYAUS33
/FpML/header/creationTimestamp = 2001-11-20T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = 123456789
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = 123456789
/FpML/trade/tradeHeader/tradeDate = 2001-11-20Z
/FpML/trade/strategy/productType = Straddle
/FpML/trade/strategy/fxSimpleOption
/FpML/trade/strategy/fxSimpleOption[0]/buyerPartyReference = party1
/FpML/trade/strategy/fxSimpleOption[0]/sellerPartyReference = party2
/FpML/trade/strategy/fxSimpleOption[0]/expiryDateTime/expiryDate = 2001-12-20Z
/FpML/trade/strategy/fxSimpleOption[0]/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/strategy/fxSimpleOption[0]/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/strategy/fxSimpleOption[0]/exerciseStyle = European
/FpML/trade/strategy/fxSimpleOption[0]/fxOptionPremium/payerPartyReference = party1
/FpML/trade/strategy/fxSimpleOption[0]/fxOptionPremium/receiverPartyReference = party2
/FpML/trade/strategy/fxSimpleOption[0]/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/strategy/fxSimpleOption[0]/fxOptionPremium/premiumAmount/amount = 26000
/FpML/trade/strategy/fxSimpleOption[0]/fxOptionPremium/premiumSettlementDate = 2001-11-23Z
/FpML/trade/strategy/fxSimpleOption[0]/fxOptionPremium/premiumQuote/premiumValue = 0.001
/FpML/trade/strategy/fxSimpleOption[0]/fxOptionPremium/premiumQuote/premiumQuoteBasis = PercentageOfCallCurrencyAmount
/FpML/trade/strategy/fxSimpleOption[0]/valueDate = 2001-12-24Z
/FpML/trade/strategy/fxSimpleOption[0]/putCurrencyAmount/currency = AUD
/FpML/trade/strategy/fxSimpleOption[0]/putCurrencyAmount/amount = 50000000
/FpML/trade/strategy/fxSimpleOption[0]/callCurrencyAmount/currency = USD
/FpML/trade/strategy/fxSimpleOption[0]/callCurrencyAmount/amount = 26000000
/FpML/trade/strategy/fxSimpleOption[0]/fxStrikePrice/rate = 0.5200
/FpML/trade/strategy/fxSimpleOption[0]/fxStrikePrice/strikeQuoteBasis = CallCurrencyPerPutCurrency
/FpML/trade/strategy/fxSimpleOption[0]/quotedAs/optionOnCurrency = AUD
/FpML/trade/strategy/fxSimpleOption[0]/quotedAs/faceOnCurrency = USD
/FpML/trade/strategy/fxSimpleOption[0]/quotedAs/quotedTenor/periodMultiplier = 1
/FpML/trade/strategy/fxSimpleOption[0]/quotedAs/quotedTenor/period = M
/FpML/trade/strategy/fxSimpleOption[1]/buyerPartyReference = party1
/FpML/trade/strategy/fxSimpleOption[1]/sellerPartyReference = party2
/FpML/trade/strategy/fxSimpleOption[1]/expiryDateTime/expiryDate = 2001-12-20Z
/FpML/trade/strategy/fxSimpleOption[1]/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/strategy/fxSimpleOption[1]/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/strategy/fxSimpleOption[1]/expiryDateTime/cutName = NewYork
/FpML/trade/strategy/fxSimpleOption[1]/exerciseStyle = European
/FpML/trade/strategy/fxSimpleOption[1]/fxOptionPremium/payerPartyReference = party1
/FpML/trade/strategy/fxSimpleOption[1]/fxOptionPremium/receiverPartyReference = party2
/FpML/trade/strategy/fxSimpleOption[1]/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/strategy/fxSimpleOption[1]/fxOptionPremium/premiumAmount/amount = 26000
/FpML/trade/strategy/fxSimpleOption[1]/fxOptionPremium/premiumSettlementDate = 2001-11-23Z
/FpML/trade/strategy/fxSimpleOption[1]/fxOptionPremium/premiumQuote/premiumValue = 0.001
/FpML/trade/strategy/fxSimpleOption[1]/fxOptionPremium/premiumQuote/premiumQuoteBasis = PercentageOfPutCurrencyAmount
/FpML/trade/strategy/fxSimpleOption[1]/valueDate = 2001-12-24Z
/FpML/trade/strategy/fxSimpleOption[1]/putCurrencyAmount/currency = USD
/FpML/trade/strategy/fxSimpleOption[1]/putCurrencyAmount/amount = 26000000
/FpML/trade/strategy/fxSimpleOption[1]/callCurrencyAmount/currency = AUD
/FpML/trade/strategy/fxSimpleOption[1]/callCurrencyAmount/amount = 50000000
/FpML/trade/strategy/fxSimpleOption[1]/fxStrikePrice/rate = 0.5200
/FpML/trade/strategy/fxSimpleOption[1]/fxStrikePrice/strikeQuoteBasis = PutCurrencyPerCallCurrency
/FpML/trade/strategy/fxSimpleOption[1]/quotedAs/optionOnCurrency = AUD
/FpML/trade/strategy/fxSimpleOption[1]/quotedAs/faceOnCurrency = USD
/FpML/trade/strategy/fxSimpleOption[1]/quotedAs/quotedTenor/periodMultiplier = 1
/FpML/trade/strategy/fxSimpleOption[1]/quotedAs/quotedTenor/period = M
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[0]/partyName = PARTYA
/FpML/party[1]/partyId = ABNANL2A
/FpML/party[1]/partyName = ABN Amro
```

### data_to_learn_from\fpml\fx-derivatives\fx-ex23-delta-hedge.xml

```text
/FpML/header/conversationId = FX65432
/FpML/header/messageId = FX87654
/FpML/header/sentBy = ABNANL2A
/FpML/header/sendTo = PARTYAUS33
/FpML/header/creationTimestamp = 2001-12-04T08:57:00Z
/FpML/trade/tradeHeader/partyTradeIdentifier
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference = party1
/FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId = 123456789
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference = party2
/FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId = 123456789
/FpML/trade/tradeHeader/tradeDate = 2001-12-04Z
/FpML/trade/strategy/productType = Delta-Hedge
/FpML/trade/strategy/fxSimpleOption/productType = European FX Option
/FpML/trade/strategy/fxSimpleOption/buyerPartyReference = party1
/FpML/trade/strategy/fxSimpleOption/sellerPartyReference = party2
/FpML/trade/strategy/fxSimpleOption/expiryDateTime/expiryDate = 2002-06-04Z
/FpML/trade/strategy/fxSimpleOption/expiryDateTime/expiryTime/hourMinuteTime = 14:00:00
/FpML/trade/strategy/fxSimpleOption/expiryDateTime/expiryTime/businessCenter = USNY
/FpML/trade/strategy/fxSimpleOption/expiryDateTime/cutName = NewYork
/FpML/trade/strategy/fxSimpleOption/exerciseStyle = European
/FpML/trade/strategy/fxSimpleOption/fxOptionPremium/payerPartyReference = party1
/FpML/trade/strategy/fxSimpleOption/fxOptionPremium/receiverPartyReference = party2
/FpML/trade/strategy/fxSimpleOption/fxOptionPremium/premiumAmount/currency = USD
/FpML/trade/strategy/fxSimpleOption/fxOptionPremium/premiumAmount/amount = 36900
/FpML/trade/strategy/fxSimpleOption/fxOptionPremium/premiumSettlementDate = 2001-12-06Z
/FpML/trade/strategy/fxSimpleOption/fxOptionPremium/premiumQuote/premiumValue = 0.001
/FpML/trade/strategy/fxSimpleOption/fxOptionPremium/premiumQuote/premiumQuoteBasis = PercentageOfCallCurrencyAmount
/FpML/trade/strategy/fxSimpleOption/valueDate = 2002-06-06Z
/FpML/trade/strategy/fxSimpleOption/putCurrencyAmount/currency = AUD
/FpML/trade/strategy/fxSimpleOption/putCurrencyAmount/amount = 75000000
/FpML/trade/strategy/fxSimpleOption/callCurrencyAmount/currency = USD
/FpML/trade/strategy/fxSimpleOption/callCurrencyAmount/amount = 36900000
/FpML/trade/strategy/fxSimpleOption/fxStrikePrice/rate = 0.4920
/FpML/trade/strategy/fxSimpleOption/fxStrikePrice/strikeQuoteBasis = CallCurrencyPerPutCurrency
/FpML/trade/strategy/fxSimpleOption/quotedAs/optionOnCurrency = AUD
/FpML/trade/strategy/fxSimpleOption/quotedAs/faceOnCurrency = USD
/FpML/trade/strategy/fxSimpleOption/quotedAs/quotedTenor/periodMultiplier = 6
/FpML/trade/strategy/fxSimpleOption/quotedAs/quotedTenor/period = M
/FpML/trade/strategy/fxSingleLeg/productType = Spot-Hedge
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency1/payerPartyReference = party2
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency1/receiverPartyReference = party1
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency1/paymentAmount/currency = AUD
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency1/paymentAmount/amount = 18750000
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency2/payerPartyReference = party1
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency2/receiverPartyReference = party2
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency2/paymentAmount/currency = USD
/FpML/trade/strategy/fxSingleLeg/exchangedCurrency2/paymentAmount/amount = 9736875
/FpML/trade/strategy/fxSingleLeg/valueDate = 2001-12-06Z
/FpML/trade/strategy/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency1 = AUD
/FpML/trade/strategy/fxSingleLeg/exchangeRate/quotedCurrencyPair/currency2 = USD
/FpML/trade/strategy/fxSingleLeg/exchangeRate/quotedCurrencyPair/quoteBasis = Currency2PerCurrency1
/FpML/trade/strategy/fxSingleLeg/exchangeRate/rate = 0.5193
/FpML/party
/FpML/party[0]/partyId = PARTYAUS33
/FpML/party[0]/partyName = PARTYA
/FpML/party[1]/partyId = ABNANL2A
/FpML/party[1]/partyName = ABN Amro
```

## Expected CDM Summaries

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex01-fx-spot.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2001-10-25
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e8a99
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 764dfd0c
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = 62b73eb5
$.trade.product.meta.globalKey = 62b73eb5
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 1.48
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 14800000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = GBP
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = bea3a8c6
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 3cc9e195
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CITI123
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = ef0f690c
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CITI123
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 5994eaf7
$.trade.tradeIdentifier[2].issuerReference.globalReference = 3cc9e195
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = BARC987
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.barclays.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = ac6412bc
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = BARC987
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.barclays.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 16e92048
$.trade.tradeDate.value = 2001-10-23
$.trade.tradeDate.meta.globalKey = 3e8a97
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 529900DTJ5A7S5UCBB52
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 3cc9e195
$.trade.party[1].meta.globalKey = 3cc9e195
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = e410255f
$.meta.globalKey = e410255f
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex02-spot-cross-w-side-rates.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2001-10-25
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e8a99
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 764dfd0c
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = 62b73eb5
$.trade.product.meta.globalKey = 62b73eb5
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 0.630068
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 6300680
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = GBP
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 1714d520
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 45bde65c
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 4a5d2d9f
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 4a5d2d9f
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = PARTYA345
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = d1241fee
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = PARTYA345
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 3ba9a1d9
$.trade.tradeIdentifier[2].issuerReference.globalReference = 45bde65c
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = CSFB9842
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.csfb.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 673ef37d
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = CSFB9842
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.csfb.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = d1c40109
$.trade.tradeDate.value = 2001-10-23
$.trade.tradeDate.meta.globalKey = 3e8a97
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 391200ZGI3FROE0WYF22
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 45bde65c
$.trade.party[1].meta.globalKey = 45bde65c
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 49262cdd
$.meta.globalKey = 49262cdd
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex03-fx-fwd.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2001-12-21
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e8b15
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 764dfd88
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = 62b74db9
$.trade.product.meta.globalKey = 62b74db9
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 0.9175
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.baseValue = 0.913
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.operand = 0.0045
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.arithmeticOperator = Add
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.operandType = ForwardPoint
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 9175000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = EUR
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 23a8626c
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = a887a4ca
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = a887a4ca
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = ABN1234
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.abn-amro.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = 78f19424
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = ABN1234
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.abn-amro.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = e377160f
$.trade.tradeIdentifier[2].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = DB5678
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = d3f7534
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = DB5678
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 77c482c0
$.trade.tradeDate.value = 2001-11-19
$.trade.tradeDate.meta.globalKey = 3e8ad3
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = a887a4ca
$.trade.party[0].meta.globalKey = a887a4ca
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 213800QILIUD4ROSUO03
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a41bc6e9
$.trade.party[1].meta.globalKey = a41bc6e9
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 27544dcf
$.meta.globalKey = 27544dcf
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex04-fx-fwd-w-settlement.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2002-04-01
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e9101
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 764e0374
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = 62b8054d
$.trade.product.meta.globalKey = 62b8054d
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 1.4643
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 14643000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = GBP
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = bb042026
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 6b3b6af3
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = FWD123
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = 11d75dd4
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = FWD123
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 7c5cdfbf
$.trade.tradeIdentifier[2].issuerReference.globalReference = 6b3b6af3
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = FXD2002987
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 9a8224ba
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = FXD2002987
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 5073246
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFM8T61CT2L1QCEMIK50
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = c6c37ac5
$.meta.globalKey = c6c37ac5
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex05-fx-fwd-w-ssi.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2001-12-21
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e8b15
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 764dfd88
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = 62b74db9
$.trade.product.meta.globalKey = 62b74db9
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 0.9175
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.baseValue = 0.913
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.operand = 0.0045
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.arithmeticOperator = Add
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.operandType = ForwardPoint
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 9175000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = EUR
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 23a8626c
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = a887a4ca
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = a887a4ca
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = ABN1234
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.abn-amro.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = 78f19424
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = ABN1234
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.abn-amro.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = e377160f
$.trade.tradeIdentifier[2].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = DB5678
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = d3f7534
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = DB5678
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 77c482c0
$.trade.tradeDate.value = 2001-11-19
$.trade.tradeDate.meta.globalKey = 3e8ad3
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = a887a4ca
$.trade.party[0].meta.globalKey = a887a4ca
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 213800QILIUD4ROSUO03
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a41bc6e9
$.trade.party[1].meta.globalKey = a41bc6e9
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 27544dcf
$.meta.globalKey = 27544dcf
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex06-fx-fwd-w-splits.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2002-02-14
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e908e
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 764e0301
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = 62b7f760
$.trade.product.meta.globalKey = 62b7f760
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 1.1072
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 13000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 14393600
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = USD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = acca8d07
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party1
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = a887a4ca
$.trade.counterparty[1].partyReference.externalReference = party2
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = FX048VS
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = a55610f4
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = FX048VS
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = fdb92df
$.trade.tradeIdentifier[2].issuerReference.globalReference = a887a4ca
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = USABC023
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.abn.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = ac904d81
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = USABC023
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.abn.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 17155b0d
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 213800QILIUD4ROSUO03
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = a41bc6e9
$.trade.party[0].meta.globalKey = a41bc6e9
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].meta.globalKey = a887a4ca
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 6a9bb893
$.meta.globalKey = 6a9bb893
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex07-non-deliverable-forward.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_Spot_Forward
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementCurrency.value = USD
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2002-04-11
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e910b
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 350fbaa4
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = c12fa7dd
$.trade.product.meta.globalKey = c12fa7dd
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 43.4
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = INR
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.baseValue = 43.35
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.operand = 0.05
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.arithmeticOperator = Add
$.trade.tradeLot[0].priceQuantity[0].price[0].value.composite.operandType = ForwardPoint
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 434000000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = INR
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = USD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 2140f4fa
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 45bde65c
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 4a5d2d9f
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 4a5d2d9f
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = PARTYA345
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = d1241fee
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = PARTYA345
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 3ba9a1d9
$.trade.tradeIdentifier[2].issuerReference.globalReference = 45bde65c
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = CSFB9842
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.csfb.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 673ef37d
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = CSFB9842
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.csfb.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = d1c40109
$.trade.tradeDate.value = 2002-01-09
$.trade.tradeDate.meta.globalKey = 3e9049
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 391200ZGI3FROE0WYF22
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 45bde65c
$.trade.party[1].meta.globalKey = 45bde65c
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = f1d568e9
$.meta.globalKey = f1d568e9
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex08-fx-swap.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = FxSwap
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.fpml.org/coding-scheme/product-type-simple
$.trade.product.taxonomy[1].source = ISDA
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_Swap
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.payer = Party1
$.trade.product.economicTerms.payout[0].SettlementPayout.payerReceiver.receiver = Party2
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-1
$.trade.product.economicTerms.payout[0].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate = 2002-01-25
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e9059
$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.meta.globalKey = 764e02cc
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].SettlementPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].meta.globalKey = 62b7f0f5
$.trade.product.economicTerms.payout[1].SettlementPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[1].SettlementPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[1].SettlementPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[1].SettlementPayout.priceQuantity.quantitySchedule.address.value = quantity-2
$.trade.product.economicTerms.payout[1].SettlementPayout.priceQuantity.priceSchedule
$.trade.product.economicTerms.payout[1].SettlementPayout.priceQuantity.priceSchedule[0].address.scope = DOCUMENT
$.trade.product.economicTerms.payout[1].SettlementPayout.priceQuantity.priceSchedule[0].address.value = price-2
$.trade.product.economicTerms.payout[1].SettlementPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[1].SettlementPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[1].SettlementPayout.settlementTerms.settlementDate.valueDate = 2002-02-25
$.trade.product.economicTerms.payout[1].SettlementPayout.settlementTerms.settlementDate.meta.globalKey = 3e9099
$.trade.product.economicTerms.payout[1].SettlementPayout.settlementTerms.meta.globalKey = 764e030c
$.trade.product.economicTerms.payout[1].SettlementPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[1].SettlementPayout.underlier.Observable.address.value = observable-2
$.trade.product.economicTerms.payout[1].meta.globalKey = 95b2ea53
$.trade.product.meta.globalKey = ab8058b3
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].price
$.trade.tradeLot[0].priceQuantity[0].price[0].value.value = 1.48
$.trade.tradeLot[0].priceQuantity[0].price[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].price[0].value.perUnitOf.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].price[0].meta.location[0].value = price-1
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 14800000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-3
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = GBP
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = bea3a8c6
$.trade.tradeLot[0].priceQuantity[1].price
$.trade.tradeLot[0].priceQuantity[1].price[0].value.value = 1.5
$.trade.tradeLot[0].priceQuantity[1].price[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[1].price[0].value.perUnitOf.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[1].price[0].value.priceType = ExchangeRate
$.trade.tradeLot[0].priceQuantity[1].price[0].meta.location
$.trade.tradeLot[0].priceQuantity[1].price[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[1].price[0].meta.location[0].value = price-2
$.trade.tradeLot[0].priceQuantity[1].quantity
$.trade.tradeLot[0].priceQuantity[1].quantity[0].value.value = 10000000
$.trade.tradeLot[0].priceQuantity[1].quantity[0].value.unit.currency.value = GBP
$.trade.tradeLot[0].priceQuantity[1].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[1].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[1].quantity[0].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[1].quantity[1].value.value = 15000000
$.trade.tradeLot[0].priceQuantity[1].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[1].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[1].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[1].quantity[1].meta.location[0].value = quantity-4
$.trade.tradeLot[0].priceQuantity[1].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[1].observable.value.Asset.Cash.identifier[0].identifier.value = GBP
$.trade.tradeLot[0].priceQuantity[1].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[1].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[1].observable.meta.location
$.trade.tradeLot[0].priceQuantity[1].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[1].observable.meta.location[0].value = observable-2
$.trade.tradeLot[0].priceQuantity[1].meta.globalKey = 9a5893a6
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 4a5d2d9f
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 4a5d2d9f
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = PARTYAUS33
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/swaps/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = cf15004e
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = PARTYAUS33
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/swaps/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 399a8239
$.trade.tradeIdentifier[2].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = DEUTDEFF
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/swaps/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 5246e55
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = DEUTDEFF
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex09-euro-opt.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = Delta-Put-FX-Option
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/product-type-1-0
$.trade.product.taxonomy[1].source = ISDA
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_VanillaOption
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2002-06-06
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e9186
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e9186
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].OptionPayout.optionType = Put
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2002-06-04
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e9184
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = USNY
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 20f9f42c
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.value = 0.492
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.unit.currency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.perUnitOf.currency.value = AUD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.priceType = ExchangeRate
$.trade.product.economicTerms.payout[0].meta.globalKey = cfd56c84
$.trade.product.meta.globalKey = 1a7ab71
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 75000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = AUD
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 36900000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = AUD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 4d0fc11a
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 5bbdd746
$.trade.counterparty[0].partyReference.externalReference = partyX
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 2fb569c6
$.trade.counterparty[1].partyReference.externalReference = partyY
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 5bbdd746
$.trade.tradeIdentifier[0].issuerReference.externalReference = partyX
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[0].meta.globalKey = bce1f9fc
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[1].meta.globalKey = 2755c16e
$.trade.tradeIdentifier[2].issuerReference.globalReference = 2fb569c6
$.trade.tradeIdentifier[2].issuerReference.externalReference = partyY
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[2].meta.globalKey = bce26e5b
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[3].meta.globalKey = 2755c16e
$.trade.tradeDate.value = 2002-01-04
$.trade.tradeDate.meta.globalKey = 3e9044
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].name.value = Party A
$.trade.party[0].meta.globalKey = 5bbdd746
$.trade.party[0].meta.externalKey = partyX
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].name.value = ABN Amro
$.trade.party[1].meta.globalKey = 2fb569c6
$.trade.party[1].meta.externalKey = partyY
$.trade.meta.globalKey = 8cb6c37e
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 36900
$.transferHistory[0].transfer.quantity.unit.currency.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-12-06
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = 5bbdd746
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = partyX
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 2fb569c6
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = partyY
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex10-amer-opt.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = FxOption
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.fpml.org/coding-scheme/product-type-simple
$.trade.product.taxonomy[1].source = ISDA
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_VanillaOption
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2002-06-06
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e9186
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e9186
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].OptionPayout.optionType = Put
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = American
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.unadjustedDate = 2001-12-04
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessDayConvention = FOLLOWING
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter[0].value = USNY
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.meta.globalKey = 27e4e9
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.meta.globalKey = 212500d8
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.meta.globalKey = d018b854
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.meta.globalKey = d018b854
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2002-06-04
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e9184
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = USNY
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = fd6cf567
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.value = 0.492
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.unit.currency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.perUnitOf.currency.value = AUD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.priceType = ExchangeRate
$.trade.product.economicTerms.payout[0].meta.globalKey = b3c51aff
$.trade.product.meta.globalKey = 812a156
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 75000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = AUD
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 36900000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = AUD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 4d0fc11a
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = b406781a
$.trade.counterparty[0].partyReference.externalReference = party1
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 2fb569c6
$.trade.counterparty[1].partyReference.externalReference = party2
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = b406781a
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://partyA.com/trades
$.trade.tradeIdentifier[0].meta.globalKey = 262c8e4a
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://partyA.com/trades
$.trade.tradeIdentifier[1].meta.globalKey = 90b21035
$.trade.tradeIdentifier[2].issuerReference.globalReference = 2fb569c6
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = ABN1789
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://adnamro.com/trade-ids
$.trade.tradeIdentifier[2].meta.globalKey = 78f21be8
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = ABN1789
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://adnamro.com/trade-ids
$.trade.tradeIdentifier[3].meta.globalKey = e3772974
$.trade.tradeDate.value = 2001-12-04
$.trade.tradeDate.meta.globalKey = 3e8b04
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].name.value = PARTYA
$.trade.party[0].meta.globalKey = b406781a
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].name.value = ABN Amro
$.trade.party[1].meta.globalKey = 2fb569c6
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 244bc8a9
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 36900
$.transferHistory[0].transfer.quantity.unit.currency.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex11-non-deliverable-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = ForeignExchange:NDO
$.trade.product.taxonomy[1].source = ISDA
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_NDO
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementType = Cash
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementCurrency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-04-11
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e890b
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = a8f828b
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationMethod.valuationSource.quotedCurrencyPair.value.currency1.value = VEB
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationMethod.valuationSource.quotedCurrencyPair.value.currency2.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationMethod.valuationSource.quotedCurrencyPair.value.quoteBasis = Currency1PerCurrency2
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationMethod.valuationSource.informationSource.primarySource.sourceProvider.value = Reuters
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationMethod.valuationSource.informationSource.primarySource.sourcePage.value = VEB01
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationDate.fxFixingDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationDate.fxFixingDate.fxFixingDate.adjustableDate.adjustedDate.value = 2001-04-09
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationDate.fxFixingDate.fxFixingDate.adjustableDate.adjustedDate.meta.globalKey = 3e8909
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationDate.fxFixingDate.fxFixingDate.adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationDate.fxFixingDate.fxFixingDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationTime.hourMinuteTime = 17:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].valuationTime.businessCenter.value = VECA
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.cashSettlementTerms[0].meta.globalKey = e047be7
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].OptionPayout.optionType = Call
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-04-09
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8909
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 10:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = USNY
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 26f843e5
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.value = 1.15
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.unit.currency.value = VEB
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.perUnitOf.currency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.priceType = ExchangeRate
$.trade.product.economicTerms.payout[0].meta.globalKey = e95cf45a
$.trade.product.meta.globalKey = c202ecb4
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 17250000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = VEB
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 15000000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = USD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 339c5c76
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = b406781a
$.trade.counterparty[0].partyReference.externalReference = party1
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 2fb569c6
$.trade.counterparty[1].partyReference.externalReference = party2
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = b406781a
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[0].meta.globalKey = bcd03f83
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[1].meta.globalKey = 2755c16e
$.trade.tradeIdentifier[2].issuerReference.globalReference = 2fb569c6
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[2].meta.globalKey = bcd0b3e2
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = IBFXO-0123456789
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-2-0
$.trade.tradeIdentifier[3].meta.globalKey = 2755c16e
$.trade.tradeDate.value = 2001-01-15
$.trade.tradeDate.meta.globalKey = 3e884f
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].name.value = PARTYA
$.trade.party[0].meta.globalKey = b406781a
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].name.value = ABN Amro
$.trade.party[1].meta.globalKey = 2fb569c6
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 275e2483
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex12-fx-barrier-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_VanillaOption
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2002-02-08
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e9088
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e9088
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].OptionPayout.optionType = Call
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2002-02-06
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e9086
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 10:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = USNY
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 26f843e5
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.value = 0.9
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.unit.currency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.perUnitOf.currency.value = EUR
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.priceType = ExchangeRate
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.composite.baseValue = 0.8935
$.trade.product.economicTerms.payout[0].meta.globalKey = 6ab99113
$.trade.product.meta.globalKey = 6ab99113
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 4500000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 5000000
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = EUR
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = EUR
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 113147e2
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 4a5d2d9f
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 4a5d2d9f
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = PARTYAUS33
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/swaps/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = cf15004e
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = PARTYAUS33
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/swaps/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 399a8239
$.trade.tradeIdentifier[2].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = DEUTDEFF
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/swaps/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 5246e55
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = DEUTDEFF
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/swaps/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 6fa97be1
$.trade.tradeDate.value = 2001-08-16
$.trade.tradeDate.meta.globalKey = 3e8a10
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 213800QILIUD4ROSUO03
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a41bc6e9
$.trade.party[1].meta.globalKey = a41bc6e9
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 4e321694
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 45000
$.transferHistory[0].transfer.quantity.unit.currency.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-11-06
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = a41bc6e9
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 4a5d2d9f
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = ec40d405
$.meta.globalKey = 1a411999
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex13-fx-dbl-barrier-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = DOUBLEBARRIER
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.sample.com/coding-scheme/product-type-simple
$.trade.product.taxonomy[1].source = ISDA
$.trade.product.taxonomy[1].productQualifier = ForeignExchange_VanillaOption
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2002-03-06
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e90c6
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e90c6
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].OptionPayout.optionType = Call
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2002-03-04
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e90c4
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 10:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = USNY
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 26f843e5
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.value = 105.05
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.unit.currency.value = JPY
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.perUnitOf.currency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.priceType = ExchangeRate
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.composite.baseValue = 106
$.trade.product.economicTerms.payout[0].meta.globalKey = a40974e
$.trade.product.meta.globalKey = e91ca04
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 2500000000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = JPY
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 23798191.34
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = USD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = e6ad5e7
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 4a5d2d9f
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 4a5d2d9f
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = PARTYAUS33
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/swaps/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = cf15004e
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = PARTYAUS33
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/swaps/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 399a8239
$.trade.tradeIdentifier[2].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = DEUTDEFF
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/swaps/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 5246e55
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = DEUTDEFF
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/swaps/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 6fa97be1
$.trade.tradeDate.value = 2002-01-03
$.trade.tradeDate.meta.globalKey = 3e9043
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 213800QILIUD4ROSUO03
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a41bc6e9
$.trade.party[1].meta.globalKey = a41bc6e9
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 62e29ca
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 192765.35
$.transferHistory[0].transfer.quantity.unit.currency.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2002-01-07
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = a41bc6e9
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 4a5d2d9f
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = 31bea01b
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex14-euro-digital-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = EuroBinary
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.sample.com/coding-scheme/product-type-simple
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-11-28
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e8adc
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e8adc
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 202ce817
$.trade.product.economicTerms.payout[0].meta.globalKey = 74651a13
$.trade.product.meta.globalKey = 62074455
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 6b3b6af3
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CITI10014
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = dd7f996e
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CITI10014
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 48051b59
$.trade.tradeIdentifier[2].issuerReference.globalReference = 6b3b6af3
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = UBSW20014
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 563356b8
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = UBSW20014
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = c0b86444
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFM8T61CT2L1QCEMIK50
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 75f67c21
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 53000
$.transferHistory[0].transfer.quantity.unit.currency.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-11-14
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = 6b3b6af3
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 6c7f6e62
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = 457179f0
$.meta.globalKey = 3b781ed1
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex15-euro-range-digital-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = EuroRangeBinary
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.sample.com/coding-scheme/product-type-simple
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 202ce817
$.trade.product.economicTerms.payout[0].meta.globalKey = 975f0d11
$.trade.product.meta.globalKey = 59637650
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 6b3b6af3
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CITI10015
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = dd7f996f
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CITI10015
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 48051b5a
$.trade.tradeIdentifier[2].issuerReference.globalReference = 6b3b6af3
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = UBSW20015
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 563356b9
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = UBSW20015
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = c0b86445
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFM8T61CT2L1QCEMIK50
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 168af29c
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 43000
$.transferHistory[0].transfer.quantity.unit.currency.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-11-14
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = 6b3b6af3
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 6c7f6e62
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = c20692f
$.meta.globalKey = 396710cb
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex16-one-touch-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = OneTouch
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.sample.com/coding-scheme/product-type-simple
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = American
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.unadjustedDate = 2001-11-12
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessDayConvention = FOLLOWING
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter[0].value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.meta.globalKey = 21479e
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.meta.globalKey = 211e638d
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 3b3f94c5
$.trade.product.economicTerms.payout[0].meta.globalKey = cae21fbf
$.trade.product.meta.globalKey = 86b244b6
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 6b3b6af3
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CITI10016
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = dd7f9970
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CITI10016
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 48051b5b
$.trade.tradeIdentifier[2].issuerReference.globalReference = 6b3b6af3
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = UBSW20016
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 563356ba
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = UBSW20016
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = c0b86446
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFM8T61CT2L1QCEMIK50
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 81a45d42
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 78000
$.transferHistory[0].transfer.quantity.unit.currency.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-11-14
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = 6b3b6af3
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 6c7f6e62
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = c1523b0d
$.meta.globalKey = f7f2a9cf
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex17-no-touch-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = NoTouch
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.sample.com/coding-scheme/product-type-simple
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = American
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.unadjustedDate = 2001-11-12
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessDayConvention = FOLLOWING
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter[0].value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.meta.globalKey = 21479e
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.meta.globalKey = 211e638d
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 3b3f94c5
$.trade.product.economicTerms.payout[0].meta.globalKey = cae21fbf
$.trade.product.meta.globalKey = f2787191
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 6b3b6af3
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CITI10017
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = dd7f9971
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CITI10017
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 48051b5c
$.trade.tradeIdentifier[2].issuerReference.globalReference = 6b3b6af3
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = UBSW20018
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 563356bc
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = UBSW20018
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = c0b86448
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFM8T61CT2L1QCEMIK50
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 48f222fd
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 78000
$.transferHistory[0].transfer.quantity.unit.currency.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-11-14
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = 6b3b6af3
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 6c7f6e62
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = c1523b0d
$.meta.globalKey = 491b6bca
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex18-double-one-touch-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = DoubleOneTouch
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.sample.com/coding-scheme/product-type-simple
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = American
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.unadjustedDate = 2001-11-12
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessDayConvention = FOLLOWING
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter[0].value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.meta.globalKey = 21479e
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.meta.globalKey = 211e638d
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 3b3f94c5
$.trade.product.economicTerms.payout[0].meta.globalKey = cae21fbf
$.trade.product.meta.globalKey = 719faf65
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 6b3b6af3
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CITI10018
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = dd7f9972
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CITI10018
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 48051b5d
$.trade.tradeIdentifier[2].issuerReference.globalReference = 6b3b6af3
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = UBSW20018
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 563356bc
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = UBSW20018
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = c0b86448
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFM8T61CT2L1QCEMIK50
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 36c07e31
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 78000
$.transferHistory[0].transfer.quantity.unit.currency.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-11-14
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = 6b3b6af3
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 6c7f6e62
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = c1523b0d
$.meta.globalKey = e6d56dfe
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex19-double-no-touch-option.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = Other
$.trade.product.taxonomy[0].value.name.value = DoubleNoTouch
$.trade.product.taxonomy[0].value.name.meta.scheme = http://www.sample.com/coding-scheme/product-type-simple
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = American
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.unadjustedDate = 2001-11-12
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessDayConvention = FOLLOWING
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.businessCenter[0].value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.businessCenters.meta.globalKey = 21479e
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.dateAdjustments.meta.globalKey = 211e638d
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.adjustableDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.commencementDate.meta.globalKey = 7082b841
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-11-26
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8ada
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 14:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = GBLO
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 3b3f94c5
$.trade.product.economicTerms.payout[0].meta.globalKey = cae21fbf
$.trade.product.meta.globalKey = 75eb7502
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = 6b3b6af3
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 6c7f6e62
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 6c7f6e62
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CITI10019
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = dd7f9973
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CITI10019
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.citi.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 48051b5e
$.trade.tradeIdentifier[2].issuerReference.globalReference = 6b3b6af3
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = UBSW20019
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 563356bd
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = UBSW20019
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.ubsw.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = c0b86449
$.trade.tradeDate.value = 2001-11-12
$.trade.tradeDate.meta.globalKey = 3e8acc
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 5493000SCC07UI6DB380
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.globalKey = 6c7f6e62
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFM8T61CT2L1QCEMIK50
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.globalKey = 6b3b6af3
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 799abece
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 78000
$.transferHistory[0].transfer.quantity.unit.currency.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = GBP
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2001-11-14
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = 6b3b6af3
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 6c7f6e62
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = c1523b0d
$.meta.globalKey = 5816f45b
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex20-avg-rate-option-parametric.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_VanillaOption
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2001-12-04
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3e8b04
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3e8b04
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationTime.hourMinuteTime = 18:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationTime.businessCenter.value = MXMC
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.informationSource.primarySource.sourceProvider.value = Reuters
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.informationSource.primarySource.sourcePage.value = BNBX
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.startDate.adjustableDate.unadjustedDate = 2001-11-01
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.startDate.adjustableDate.meta.globalKey = 3e8ac1
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.startDate.meta.globalKey = 3e8ac1
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.endDate.adjustableDate.unadjustedDate = 2001-11-30
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.endDate.adjustableDate.meta.globalKey = 3e8ade
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.endDate.meta.globalKey = 3e8ade
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.periodFrequency.periodMultiplier = 1
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.periodFrequency.period = T
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.periodFrequency.meta.globalKey = 24b525
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationDates.periodicSchedule.periodFrequency.rollConvention = NONE
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].OptionPayout.optionType = Call
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2001-11-30
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3e8ade
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 12:30:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = MXMC
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 82cb011d
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.value = 9.82
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.unit.currency.value = MXN
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.perUnitOf.currency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.priceType = ExchangeRate
$.trade.product.economicTerms.payout[0].meta.globalKey = f39e007f
$.trade.product.meta.globalKey = f39e007f
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 5750000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = MXN
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 585539.71
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = USD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = cdbc9f2b
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 4a5d2d9f
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 4a5d2d9f
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = PA-12345
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = c9e1a36c
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = PA-12345
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.partyA.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 34672557
$.trade.tradeIdentifier[2].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = DB-98765
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 20adbe1c
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = DB-98765
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 8b32cba8
$.trade.tradeDate.value = 2001-08-16
$.trade.tradeDate.meta.globalKey = 3e8a10
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 213800QILIUD4ROSUO03
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a41bc6e9
$.trade.party[1].meta.globalKey = a41bc6e9
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = ba28069
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 1750
$.transferHistory[0].transfer.quantity.unit.currency.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex21-avg-rate-option-specific.json

```text
$.trade.product.taxonomy
$.trade.product.taxonomy[0].source = ISDA
$.trade.product.taxonomy[0].productQualifier = ForeignExchange_VanillaOption
$.trade.product.economicTerms.payout
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.payer = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.payerReceiver.receiver = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.quantitySchedule.address.value = quantity-1
$.trade.product.economicTerms.payout[0].OptionPayout.priceQuantity.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.valueDate = 2010-12-04
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.settlementDate.meta.globalKey = 3ed304
$.trade.product.economicTerms.payout[0].OptionPayout.settlementTerms.meta.globalKey = 3ed304
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.buyer = Party1
$.trade.product.economicTerms.payout[0].OptionPayout.buyerSeller.seller = Party2
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationTime.hourMinuteTime = 18:00:00
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.observationTime.businessCenter.value = MXMC
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.informationSource.primarySource.sourceProvider.value = Reuters
$.trade.product.economicTerms.payout[0].OptionPayout.observationTerms.informationSource.primarySource.sourcePage.value = BNBX
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.scope = DOCUMENT
$.trade.product.economicTerms.payout[0].OptionPayout.underlier.Observable.address.value = observable-1
$.trade.product.economicTerms.payout[0].OptionPayout.optionType = Call
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.style = European
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.value = 2010-11-30
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.adjustedDate.meta.globalKey = 3ed2de
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].adjustableDate.meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationDate[0].meta.globalKey = 0
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.hourMinuteTime = 12:30:00
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTime.businessCenter.value = MXMC
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.expirationTimeType = SpecificTime
$.trade.product.economicTerms.payout[0].OptionPayout.exerciseTerms.meta.globalKey = 82cb011d
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.value = 12.4
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.unit.currency.value = MXN
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.perUnitOf.currency.value = USD
$.trade.product.economicTerms.payout[0].OptionPayout.strike.strikePrice.priceType = ExchangeRate
$.trade.product.economicTerms.payout[0].meta.globalKey = 7c08a089
$.trade.product.meta.globalKey = 7c08a089
$.trade.tradeLot
$.trade.tradeLot[0].priceQuantity
$.trade.tradeLot[0].priceQuantity[0].quantity
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.value = 5750000
$.trade.tradeLot[0].priceQuantity[0].quantity[0].value.unit.currency.value = MXN
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[0].meta.location[0].value = quantity-2
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.value = 463709.68
$.trade.tradeLot[0].priceQuantity[0].quantity[1].value.unit.currency.value = USD
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].quantity[1].meta.location[0].value = quantity-1
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifier.value = USD
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.identifier[0].identifierType = CurrencyCode
$.trade.tradeLot[0].priceQuantity[0].observable.value.Asset.Cash.assetType = Cash
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].scope = DOCUMENT
$.trade.tradeLot[0].priceQuantity[0].observable.meta.location[0].value = observable-1
$.trade.tradeLot[0].priceQuantity[0].meta.globalKey = 5700370d
$.trade.counterparty
$.trade.counterparty[0].role = Party1
$.trade.counterparty[0].partyReference.globalReference = a41bc6e9
$.trade.counterparty[0].partyReference.externalReference = party2
$.trade.counterparty[1].role = Party2
$.trade.counterparty[1].partyReference.globalReference = 5b0baa7d
$.trade.counterparty[1].partyReference.externalReference = party1
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = 5b0baa7d
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = CH-23948
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.chase.com/fx/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = f5cc9d49
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = CH-23948
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.chase.com/fx/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 60521f34
$.trade.tradeIdentifier[2].issuerReference.globalReference = a41bc6e9
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = DB-89080
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 20a000ec
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = DB-89080
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.db.com/fx/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 8b250e78
$.trade.tradeDate.value = 2010-08-16
$.trade.tradeDate.meta.globalKey = 3ed210
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 7H6GLXDRUGQFU57RNE97
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 5b0baa7d
$.trade.party[0].meta.globalKey = 5b0baa7d
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = 213800QILIUD4ROSUO03
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a41bc6e9
$.trade.party[1].meta.globalKey = a41bc6e9
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = c33cf993
$.transferHistory
$.transferHistory[0].transfer.quantity.value = 1750
$.transferHistory[0].transfer.quantity.unit.currency.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifier.value = USD
$.transferHistory[0].transfer.asset.Cash.identifier[0].identifierType = CurrencyCode
$.transferHistory[0].transfer.asset.Cash.assetType = Cash
$.transferHistory[0].transfer.settlementDate.unadjustedDate = 2010-08-18
$.transferHistory[0].transfer.settlementDate.dateAdjustments.businessDayConvention = NONE
$.transferHistory[0].transfer.settlementDate.dateAdjustments.meta.globalKey = 24a738
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.globalReference = a41bc6e9
$.transferHistory[0].transfer.payerReceiver.payerPartyReference.externalReference = party2
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.globalReference = 5b0baa7d
$.transferHistory[0].transfer.payerReceiver.receiverPartyReference.externalReference = party1
$.transferHistory[0].transfer.transferExpression.unscheduledTransfer.priceTransfer = Premium
$.transferHistory[0].meta.globalKey = 6b369e03
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex22-straddle.json

```text
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = b406781a
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[0].meta.globalKey = 262c8e4a
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[1].meta.globalKey = 90b21035
$.trade.tradeIdentifier[2].issuerReference.globalReference = 2fb569c6
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[2].meta.globalKey = 262d02a9
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[3].meta.globalKey = 90b21035
$.trade.tradeDate.value = 2001-11-20
$.trade.tradeDate.meta.globalKey = 3e8ad4
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].name.value = PARTYA
$.trade.party[0].meta.globalKey = b406781a
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].name.value = ABN Amro
$.trade.party[1].meta.globalKey = 2fb569c6
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 23787db7
$.meta.globalKey = 23787db7
```

### data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex23-delta-hedge.json

```text
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = b406781a
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[0].meta.globalKey = 262c8e4a
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[1].meta.globalKey = 90b21035
$.trade.tradeIdentifier[2].issuerReference.globalReference = 2fb569c6
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[2].meta.globalKey = 262d02a9
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = 123456789
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.markets.Reuters.com/rss/spec/2001/trade-id-3-0
$.trade.tradeIdentifier[3].meta.globalKey = 90b21035
$.trade.tradeDate.value = 2001-12-04
$.trade.tradeDate.meta.globalKey = 3e8b04
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = 549300VBWWV6BYQOWM67
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = 4a5d2d9f
$.trade.party[0].name.value = PARTYA
$.trade.party[0].meta.globalKey = b406781a
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].name.value = ABN Amro
$.trade.party[1].meta.globalKey = 2fb569c6
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 23787db7
$.meta.globalKey = 23787db7
```

### data_to_learn_from\cdm_parallel\fx-derivatives\td-ex01-simple-term-deposit.json

```text
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = be44d3fb
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = MB87623
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.hsbc.com/swaps/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = f2891f38
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = MB87623
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.hsbc.com/swaps/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 5d0ea123
$.trade.tradeIdentifier[2].issuerReference.globalReference = a887a4ca
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = AA9876
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.abnamro.com/swaps/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 814acd2
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = AA9876
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.abnamro.com/swaps/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 7299ba5e
$.trade.tradeDate.value = 2002-02-14
$.trade.tradeDate.meta.globalKey = 3e908e
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = TR24TWEY5RVRQV65HD49
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = be44d3fb
$.trade.party[0].meta.globalKey = be44d3fb
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].meta.globalKey = a887a4ca
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 7845eabc
$.meta.globalKey = 7845eabc
```

### data_to_learn_from\cdm_parallel\fx-derivatives\td-ex02-term-deposit-w-settlement-etc.json

```text
$.trade.tradeIdentifier
$.trade.tradeIdentifier[0].issuerReference.globalReference = aa13214e
$.trade.tradeIdentifier[0].issuerReference.externalReference = party1
$.trade.tradeIdentifier[0].assignedIdentifier
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.value = MB87623
$.trade.tradeIdentifier[0].assignedIdentifier[0].identifier.meta.scheme = http://www.midlandnb.com/swaps/trade-id
$.trade.tradeIdentifier[0].meta.globalKey = f2891f38
$.trade.tradeIdentifier[1].assignedIdentifier
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.value = MB87623
$.trade.tradeIdentifier[1].assignedIdentifier[0].identifier.meta.scheme = http://www.midlandnb.com/swaps/trade-id
$.trade.tradeIdentifier[1].meta.globalKey = 5d0ea123
$.trade.tradeIdentifier[2].issuerReference.globalReference = 2fb4eda6
$.trade.tradeIdentifier[2].issuerReference.externalReference = party2
$.trade.tradeIdentifier[2].assignedIdentifier
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.value = AA9876
$.trade.tradeIdentifier[2].assignedIdentifier[0].identifier.meta.scheme = http://www.abn.com/swaps/trade-id
$.trade.tradeIdentifier[2].meta.globalKey = 814acd2
$.trade.tradeIdentifier[3].assignedIdentifier
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.value = AA9876
$.trade.tradeIdentifier[3].assignedIdentifier[0].identifier.meta.scheme = http://www.abn.com/swaps/trade-id
$.trade.tradeIdentifier[3].meta.globalKey = 7299ba5e
$.trade.tradeDate.value = 2002-02-14
$.trade.tradeDate.meta.globalKey = 3e908e
$.trade.party
$.trade.party[0].partyId
$.trade.party[0].partyId[0].identifier.value = TR24TWEY5RVRQV65HD49
$.trade.party[0].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[0].partyId[0].identifierType = LEI
$.trade.party[0].partyId[0].meta.globalKey = be44d3fb
$.trade.party[0].name.value = MIDLAND
$.trade.party[0].meta.globalKey = aa13214e
$.trade.party[0].meta.externalKey = party1
$.trade.party[1].partyId
$.trade.party[1].partyId[0].identifier.value = BFXS5XCH7N0Y05NIXW11
$.trade.party[1].partyId[0].identifier.meta.scheme = http://www.fpml.org/coding-scheme/external/iso17442
$.trade.party[1].partyId[0].identifierType = LEI
$.trade.party[1].partyId[0].meta.globalKey = a887a4ca
$.trade.party[1].name.value = ABN AMRO
$.trade.party[1].meta.globalKey = 2fb4eda6
$.trade.party[1].meta.externalKey = party2
$.trade.meta.globalKey = 24dcb06b
$.meta.globalKey = 24dcb06b
```

## Cookbook Context

### data/agent-cookbook/latest/product-families/fx-derivatives.md

```text
# FPML -> CDM Cookbook: fx-derivatives

## Status

- Operational status: `ready`
- Agent use policy: Agents may apply these rules during normal FPML to CDM proposal generation.
- Semantic success rate: 100%
- Draft quality: `strong`
- Draft publication: `success`

## Trigger Signals

- fx-derivatives
- FpML top-level section: header
- FpML top-level section: party
- FpML top-level section: trade
- trade > fxSingleLeg (13 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- header > conversationId (1 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)
- header
- trade
- party

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: header, party, trade.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Apply recurring mapping rules only when the exact source cues appear in the document.
4. Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
5. Assemble the result under repeated CDM scaffolding such as meta, trade.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

### Trade identifier -> assignedIdentifier.value

- Rule id: `fx-derivatives:RULE-001`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements)`
- Target CDM paths: `trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value)`
- Action: FpML tradeId values are repeatedly copied into CDM assignedIdentifier.identifier.value preserving the trade identifier value (often with an associated scheme).
- Rationale: Trade-level ids are high-value stable keys in the source and are preserved to allow traceability to the original FpML trade.
- Evidence: 11 examples from 25/25 semantic pairs
- Caveats: `In some CDM outputs there are more assignedIdentifier entries than FpML tradeId elements (possible duplication or added identifiers).`, `AssignedIdentifier.scheme in CDM sometimes differs from FpML tradeIdScheme; reason not consistently evident from examples.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements).`, `Confirm the proposed CDM representation populates: trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Trade date normalization (remove trailing 'Z')

- Rule id: `fx-derivatives:RULE-002`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `trade.tradeHeader.tradeDate (FpML with timezone 'Z')`
- Target CDM paths: `trade.tradeDate.value (CDM normalized ISO date without trailing 'Z')`
- Action: Dates copied from FpML have their trailing 'Z' (UTC designator) trimmed in CDM date.value fields to produce a plain date string.
- Rationale: CDM date fields in these examples use a normalized date format without the timezone marker; mapping routine trims the 'Z' to conform to CDM expected value.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Normalization appears consistent in examples but rules for timezone-preserving conversions (if needed) are not shown.`
- Validate: `Confirm the FPML source contains: trade.tradeHeader.tradeDate (FpML with timezone 'Z').`, `Confirm the proposed CDM representation populates: trade.tradeDate.value (CDM normalized ISO date without trailing 'Z').`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Option product type -> CDM taxonomy name

- Rule id: `fx-derivatives:RULE-003`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `trade.fxdigitaloption.productType (FpML productType strings)`
- Target CDM paths: `trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name)`
- Action: FpML product type labels (e.g., 'Euro Binary') are normalized and mapped into a CDM taxonomy name value (e.g., 'EuroBinary').
- Rationale: CDM uses standardized taxonomy strings for product classification; mapping normalizes source labels to the expected CDM taxonomy representations.
- Evidence: 5 examples from 25/25 semantic pairs
- Caveats: `Normalization details (exact string transformations) are inferred from examples but not exhaustively specified across all possible productType variants.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: trade.fxdigitaloption.productType (FpML productType strings).`, `Confirm the proposed CDM representation populates: trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### Expiry date/time/businessCenter -> exerciseTerms.expiration

- Rule id: `fx-derivatives:RULE-004`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields`
- Target CDM paths: `adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration)`
- Action: Expiry-related fields in FpML (date, time, business center) are reshaped into CDM exerciseTerms.expiration components and time fields.
- Rationale: Exercise/expiration in CDM is modeled with nested date/time/business-center pieces; mapping splits and assigns the corresponding FpML pieces into those CDM fields.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `Business center/timezone handling is consistent in examples but may require further rules for edge cases (e.g., missing time or multiple business centers).`
- Validate: `Confirm the FPML source contains: expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields.`, `Confirm the proposed CDM representation populates: adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Payment amounts -> CDM quantities (value + currency unit)

- Rule id: `fx-derivatives:RULE-005`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries)`
- Target CDM paths: `trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units)`
- Action: Each FpML paymentAmount (amount + currency) is converted to a CDM quantity with numeric value and currency unit.
- Rationale: CDM models cash/economic amounts as quantities with explicit units; mapping populates value and currency subfields from FpML paymentAmount.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `When FpML uses splitSettlement or multiple paymentAmount entries some CDM examples aggregate or merge them into a single quantity.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries).`, `Confirm the proposed CDM representation populates: trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`


## Transformations

### Resolve party hrefs -> CDM party references and roles

- Rule id: `fx-derivatives:TR-001`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `partyReference hrefs and buyer/seller/payer/receiver references (FpML)`
- Target CDM paths: `CDM party references with party roles (e.g., Party1/Party2) used in buyerSeller and payout sections`
- Action: FpML party references (hrefs) are resolved into CDM party objects and assigned CDM roles (Party1/Party2 labels appear in CDM).
- Rationale: Apply this reference resolution transformation when the source-side signal is present.
- Evidence: 8 examples from 25/25 semantic pairs
- Caveats: `Examples show consistent resolution of hrefs into CDM party objects but also show apparent inversions of buyer/seller roles (CDM Party1 vs FpML party2) in several cases.`, `Mapping logic for deriving Party1/Party2 labels from FpML hrefs is not explicit in examples.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: partyReference hrefs and buyer/seller/payer/receiver references (FpML).`, `Confirm the proposed CDM representation populates: CDM party references with party roles (e.g., Party1/Party2) used in buyerSeller and payout sections.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Date normalization (trim trailing 'Z')

- Rule id: `fx-derivatives:TR-002`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `tradeHeader.tradeDate (FpML, may include 'Z')`
- Target CDM paths: `trade.tradedate.value (CDM, ISO date without 'Z')`
- Action: Remove trailing UTC designator 'Z' from trade/tradedate/time values when copying into CDM date.value.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Examples show consistent trimming of trailing 'Z' to produce plain date strings.`, `No examples show alternative timezone conversion behavior.`
- Validate: `Confirm the FPML source contains: tradeHeader.tradeDate (FpML, may include 'Z').`, `Confirm the proposed CDM representation populates: trade.tradedate.value (CDM, ISO date without 'Z').`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Expiry date/time/businessCenter -> exerciseTerms.expiration

- Rule id: `fx-derivatives:TR-003`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `expirydatetime.expiryDate and expiryTime and businessCenter (FpML)`
- Target CDM paths: `adjustableDate.adjustedDate.value and exerciseterms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM)`
```

### data/agent-cookbook/latest/references/fx-derivatives.evidence.json

```text
{
  "folder": "fx-derivatives",
  "generatedAt": "2026-04-26T14:59:22.253Z",
  "sourceDraft": "C:\\Users\\User\\Desktop\\fpml-cdm-fyp\\data\\drafts\\fx-derivatives\\draft.json",
  "sourceDebug": "C:\\Users\\User\\Desktop\\fpml-cdm-fyp\\data\\drafts\\fx-derivatives\\debug.json",
  "evidenceCoverage": {
    "matchedPairCount": 25,
    "structuralPairCount": 25,
    "semanticPairCount": 25,
    "fullSemanticPairCount": 25,
    "salvagedSemanticPairCount": 0,
    "failedSemanticPairCount": 0,
    "structuralBasisNote": "Structural summaries are computed from all 25/25 matched pairs, including pairs without semantic extraction.",
    "semanticBasisNote": "Semantic rules are computed from 25/25 successful or salvaged pair analyses (25 full, 0 salvaged)."
  },
  "publication": {
    "status": "success",
    "publishFinal": true,
    "reasons": [
      "Draft passed quality and integrity checks."
    ]
  },
  "qualityAssessment": {
    "score": 9.8,
    "rating": "strong",
    "reasons": [
      "2 stable rules sit only at the minimum evidence threshold.",
      "1 repeated transformation still have thin supporting evidence."
    ],
    "metrics": {
      "semanticSuccessRate": 1,
      "fullParseRate": 1,
      "stableRuleCount": 5,
      "repeatedTransformationCount": 6,
      "tentativePatternCount": 9,
      "placeholderHighlightRate": 0,
      "openQuestionCount": 7,
      "openQuestionDensity": 0.28,
      "criticalAmbiguityCount": 0,
      "lowEvidenceStableRuleCount": 2,
      "lowEvidenceTransformationCount": 1,
      "synthesisReliability": "full"
    }
  },
  "rolloutReadiness": {
    "decision": "pilot_only",
    "readyForBroadRollout": false,
    "reasons": [
      "Draft quality is strong enough for a limited pilot on a few additional folders, but not for broad rollout yet.",
      "Too many stable rules are only barely above the minimum evidence threshold."
    ]
  },
  "stableMappingPatterns": [
    {
      "id": "RULE-001",
      "name": "Trade identifier -> assignedIdentifier.value",
      "strength": "moderate recurring pattern",
      "evidenceCount": 11,
      "sourcePattern": "tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements)",
      "targetPattern": "trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value)",
      "explanation": "FpML tradeId values are repeatedly copied into CDM assignedIdentifier.identifier.value preserving the trade identifier value (often with an associated scheme).",
      "whyItWorksThisWay": "Trade-level ids are high-value stable keys in the source and are preserved to allow traceability to the original FpML trade.",
      "exampleFiles": [
        "fx-derivatives/fx-ex01-fx-spot.xml",
        "fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml",
        "fx-derivatives/fx-ex03-fx-fwd.xml",
        "fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml",
        "fx-derivatives/fx-ex08-fx-swap.xml",
        "fx-derivatives/fx-ex09-euro-opt.xml",
        "fx-derivatives/fx-ex11-non-deliverable-option.xml",
        "fx-derivatives/fx-ex22-straddle.xml",
        "fx-derivatives/fx-ex23-delta-hedge.xml",
        "fx-derivatives/td-ex01-simple-term-deposit.xml",
        "fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml"
      ],
      "caveats": [
        "In some CDM outputs there are more assignedIdentifier entries than FpML tradeId elements (possible duplication or added identifiers).",
        "AssignedIdentifier.scheme in CDM sometimes differs from FpML tradeIdScheme; reason not consistently evident from examples."
      ]
    },
    {
      "id": "RULE-002",
      "name": "Trade date normalization (remove trailing 'Z')",
      "strength": "moderate recurring pattern",
      "evidenceCount": 7,
      "sourcePattern": "trade.tradeHeader.tradeDate (FpML with timezone 'Z')",
      "targetPattern": "trade.tradeDate.value (CDM normalized ISO date without trailing 'Z')",
      "explanation": "Dates copied from FpML have their trailing 'Z' (UTC designator) trimmed in CDM date.value fields to produce a plain date string.",
      "whyItWorksThisWay": "CDM date fields in these examples use a normalized date format without the timezone marker; mapping routine trims the 'Z' to conform to CDM expected value.",
      "exampleFiles": [
        "fx-derivatives/fx-ex03-fx-fwd.xml",
        "fx-derivatives/fx-ex06-fx-fwd-w-splits.xml",
        "fx-derivatives/fx-ex14-euro-digital-option.xml",
        "fx-derivatives/fx-ex22-straddle.xml",
        "fx-derivatives/fx-ex23-delta-hedge.xml",
        "fx-derivatives/td-ex01-simple-term-deposit.xml",
        "fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml"
      ],
      "caveats": [
        "Normalization appears consistent in examples but rules for timezone-preserving conversions (if needed) are not shown."
      ]
    },
    {
      "id": "RULE-003",
      "name": "Option product type -> CDM taxonomy name",
      "strength": "moderate recurring pattern",
      "evidenceCount": 5,
      "sourcePattern": "trade.fxdigitaloption.productType (FpML productType strings)",
      "targetPattern": "trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name)",
      "explanation": "FpML product type labels (e.g., 'Euro Binary') are normalized and mapped into a CDM taxonomy name value (e.g., 'EuroBinary').",
      "whyItWorksThisWay": "CDM uses standardized taxonomy strings for product classification; mapping normalizes source labels to the expected CDM taxonomy representations.",
      "exampleFiles": [
        "fx-derivatives/fx-ex14-euro-digital-option.xml",
        "fx-derivatives/fx-ex15-euro-range-digital-option.xml",
        "fx-derivatives/fx-ex16-one-touch-option.xml",
        "fx-derivatives/fx-ex17-no-touch-option.xml",
        "fx-derivatives/fx-ex18-double-one-touch-option.xml"
      ],
      "caveats": [
        "Normalization details (exact string transformations) are inferred from examples but not exhaustively specified across all possible productType variants."
      ]
    },
    {
      "id": "RULE-004",
      "name": "Expiry date/time/businessCenter -> exerciseTerms.expiration",
      "strength": "moderate recurring pattern",
      "evidenceCount": 4,
      "sourcePattern": "expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields",
      "targetPattern": "adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration)",
      "explanation": "Expiry-related fields in FpML (date, time, business center) are reshaped into CDM exerciseTerms.expiration components and time fields.",
      "whyItWorksThisWay": "Exercise/expiration in CDM is modeled with nested date/time/business-center pieces; mapping splits and assigns the corresponding FpML pieces into those CDM fields.",
      "exampleFiles": [
        "fx-derivatives/fx-ex14-euro-digital-option.xml",
        "fx-derivatives/fx-ex15-euro-range-digital-option.xml",
        "fx-derivatives/fx-ex16-one-touch-option.xml",
        "fx-derivatives/fx-ex18-double-one-touch-option.xml"
      ],
      "caveats": [
        "Business center/timezone handling is consistent in examples but may require further rules for edge cases (e.g., missing time or multiple business centers)."
      ]
    },
    {
      "id": "RULE-005",
      "name": "Payment amounts -> CDM quantities (value + currency unit)",
      "strength": "moderate recurring pattern",
      "evidenceCount": 4,
      "sourcePattern": "exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries)",
      "targetPattern": "trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units)",
      "explanation": "Each FpML paymentAmount (amount + currency) is converted to a CDM quantity with numeric value and currency unit.",
      "whyItWorksThisWay": "CDM models cash/economic amounts as quantities with explicit units; mapping populates value and currency subfields from FpML paymentAmount.",
      "exampleFiles": [
        "fx-derivatives/fx-ex01-fx-spot.xml",
        "fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml",
        "fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml",
        "fx-derivatives/fx-ex07-non-deliverable-forward.xml"
      ],
      "caveats": [
        "When FpML uses splitSettlement or multiple paymentAmount entries some CDM examples aggregate or merge them into a single quantity."
      ]
    }
```

## Rosetta Context

### data/rosetta-source/latest/docs/product-families/fx.md

```text
# Rosetta Pack: FX

## Purpose

Use this pack to find Rosetta context for FX FpML ingestion and model support.

## Relevant Raw Files

- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta`

## Important Blocks

| Kind | Name | Source | Lines |
|---|---|---|---:|
| `func` | `MapFxDigitalOptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 13-29 |
| `func` | `MapFxDigitalOptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 30-38 |
| `func` | `MapFxDigitalOptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 39-51 |
| `func` | `MapFxDigitalOptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxdigitaloption-func.rosetta` | 52-86 |
| `func` | `MapFxOptionCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 22-30 |
| `func` | `MapFxOptionAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 31-36 |
| `func` | `MapFxOptionNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 37-50 |
| `func` | `MapFxOptionEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 51-64 |
| `func` | `MapFxOptionPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 65-119 |
| `func` | `MapFxOptionFeaturesToObservationTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 120-141 |
| `func` | `MapObservationScheduleToObservationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 142-176 |
| `func` | `GetExchangedCurrencyAmount` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 177-186 |
| `func` | `MapFxOptionStrikePrice` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 187-232 |
| `func` | `MapFxOptionPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 233-247 |
| `func` | `MapFxOptionAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxoption-func.rosetta` | 248-258 |
| `func` | `MapFxSingleLegCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 17-27 |
| `func` | `MapFxSingleLegAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 28-33 |
| `func` | `MapFxSingleLegNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 34-47 |
| `func` | `MapFxSingleLegEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 48-64 |
| `func` | `MapFxCoreDetailsModelToSettlementPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 65-111 |
| `func` | `MapFxSingleLegPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 112-120 |
| `func` | `MapFxSingleLegAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxsingleleg-func.rosetta` | 121-134 |
| `func` | `MapFxSwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 16-26 |
| `func` | `MapFxSwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 27-32 |
| `func` | `MapFxSwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 33-46 |
| `func` | `MapFxSwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 47-59 |
| `func` | `MapFxSwapPayoutList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 60-80 |
| `func` | `MapFxSwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 81-98 |
| `func` | `MapFxSwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxswap-func.rosetta` | 99-112 |
| `func` | `MapFxVarianceSwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 22-37 |
| `func` | `MapFxVarianceSwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 38-43 |
| `func` | `MapFxVarianceSwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 44-60 |
| `func` | `MapFxVarianceSwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 61-77 |
| `func` | `MapFxVarianceSwapPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 78-132 |
| `func` | `MapFxVarianceSwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 133-163 |
| `func` | `MapFxPerformanceSwapToObservationTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 164-190 |
| `func` | `MapFxFixingScheduleToObservationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 191-225 |
| `func` | `MapFxValuationDateOffsetToValuationDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 226-256 |
| `func` | `MapFxPerformanceSwapToReturnTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 257-303 |
| `func` | `MapFxVarianceSwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvarianceswap-func.rosetta` | 304-311 |
| `func` | `MapFxVolatilitySwapCounterpartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 18-33 |
| `func` | `MapFxVolatilitySwapAncillaryPartyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 34-39 |
| `func` | `MapFxVolatilitySwapNonTransferableProduct` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 40-56 |
| `func` | `MapFxVolatilitySwapEconomicTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 57-69 |
| `func` | `MapFxVolatilitySwapPayout` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 70-83 |
| `func` | `MapFxVolatilitySwapReturnTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 84-127 |
| `func` | `MapFxVolatilitySwapPriceQuantityList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 128-147 |
| `func` | `MapFxVolatilitySwapAccountPartyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-fxvolatilityswap-func.rosetta` | 148-155 |

## Shared Dependencies

Also read `../shared-ingest.md` for party, payment, date, settlement, and price/quantity context.

## Next Step

Inspect these block references before extracting cookbook rules. Full raw block text is stored in `../../extracted/blocks.json`.

```

### data/rosetta-source/latest/docs/shared-ingest.md

```text
# Rosetta Pack: Shared FpML Ingest

## Purpose

Use this pack to find shared Rosetta context for trade state, party, payment, price/quantity, datetime, and settlement handling.

## Relevant Raw Files

- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-header-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-message-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-payment-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-settlement-func.rosetta`
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-tradestate-func.rosetta`

## Important Blocks

| Kind | Name | Source | Lines |
|---|---|---|---:|
| `func` | `GetFpmlTrade` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 28-50 |
| `func` | `MapStringWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 51-63 |
| `func` | `MapStringWithReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 64-76 |
| `func` | `MapCurrency` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 77-86 |
| `func` | `MapCurrencyReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 87-96 |
| `func` | `MapResolvablePriceQuantityReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 97-108 |
| `func` | `MapProductTaxonomyList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 109-136 |
| `func` | `MapAssetClassWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 137-149 |
| `func` | `MapUnitTypeWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 150-167 |
| `func` | `MapCapacityUnitWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 168-180 |
| `func` | `MapWeatherUnitWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 181-193 |
| `func` | `MapFinancialUnitWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 194-206 |
| `func` | `MapTaxonomySourceEnum` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 207-221 |
| `func` | `MapFeeTypeEnumWithScheme` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 222-234 |
| `func` | `MapProductIdentifierList` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 235-242 |
| `func` | `MapProductIdentifier` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 243-257 |
| `func` | `MapProductIdType` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 258-278 |
| `func` | `MapFxFeature` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 279-292 |
| `func` | `MapReferenceCurrency` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 293-306 |
| `func` | `MapComposite` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 307-322 |
| `func` | `MapQuanto` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 323-335 |
| `func` | `MapFxRate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 336-347 |
| `func` | `MapQuotedCurrencyPair` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 348-360 |
| `func` | `MapQuotedCurrencyPairWithLocation` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 361-372 |
| `func` | `MapFxSpotRateSource` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 373-386 |
| `func` | `MapInformationSource` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 387-402 |
| `func` | `MapMoney` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 403-420 |
| `func` | `GetFpmlEquityExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 421-434 |
| `func` | `GetFpmlCommodityExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 435-446 |
| `func` | `GetFpmlCommodityPhysicalExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 447-458 |
| `func` | `GetFpmlFxExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 459-470 |
| `func` | `GetFpmlFxDigitalExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 471-482 |
| `func` | `MapExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 483-527 |
| `func` | `MapExerciseProcedure` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 528-568 |
| `func` | `MapEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 569-603 |
| `func` | `MapEquityEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 604-629 |
| `func` | `MapCommodityEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 630-656 |
| `func` | `MapFxEuropeanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 657-678 |
| `func` | `MapBermudaExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 679-709 |
| `func` | `MapEquityBermudaExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 710-747 |
| `func` | `MapAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 748-782 |
| `func` | `MapMultipleExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 783-800 |
| `func` | `MapEquityAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 801-835 |
| `func` | `MapEquityMultipleExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 836-850 |
| `func` | `MapCommodityAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 851-879 |
| `func` | `MapFxDigitalAmericanExercise` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 880-904 |
| `func` | `MapFxAmericanExerciseTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 905-914 |
| `func` | `GetPerUnitOfForEquityDerivativeBase` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 915-936 |
| `func` | `MapAdjustableOrRelativeDateToObservationTerms` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 937-965 |
| `func` | `StringContains` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 966-973 |
| `func` | `MapMessageAction` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` | 974-987 |
| `func` | `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 25-40 |
| `func` | `MapAdjustableOrAdjustedOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 41-58 |
| `func` | `MapAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 59-75 |
| `func` | `MapAdjustedDateToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 76-89 |
| `func` | `MapAdjustedDateToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 90-101 |
| `func` | `MapAdjustableDate2ToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 102-119 |
| `func` | `MapAdjustableDate2ToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 120-131 |
| `func` | `MapUnadjustedDateToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 132-145 |
| `func` | `MapUnadjustedDateToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 146-157 |
| `func` | `MapAdjustableDateOrAdjustedRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 158-170 |
| `func` | `MapAdjustedRelativeDateReference` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 171-182 |
| `func` | `MapAdjustableDateOrRelativeDateSequenceToAdjustableOrAdjustedRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 183-200 |
| `func` | `MapAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 201-215 |
| `func` | `MapZoneDateTimeToDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 216-222 |
| `func` | `MapAdjustableOrRelativeDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 223-239 |
| `func` | `MapAdjustable2` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 240-255 |
| `func` | `MapAdjustableRelativeOrPeriodicDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 256-276 |
| `func` | `MapAdjustableRelativeOrPeriodicDates2` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 277-297 |
| `func` | `MapAdjustableOrRelativeDatesToAdjustableRelativeOrPeriodicDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 298-314 |
| `func` | `MapAdjustableDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 315-329 |
| `func` | `MapDateWithId` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 330-341 |
| `func` | `MapDateListToAdjustableOrRelativeDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 342-353 |
| `func` | `MapDateListToAdjustableDates` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 354-365 |
| `func` | `MapDateToAdjustableOrRelativeDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 366-377 |
| `func` | `MapDateToAdjustableDate` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 378-389 |
| `func` | `MapOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 390-402 |
| `func` | `MapAdjustedRelativeDateOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 403-414 |
| `func` | `MapRelativeDateSequenceToAdjustedRelativeDateOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 415-438 |
| `func` | `MapRelativeDateOffsetToAdjustedRelativeDateOffset` | `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` | 439-461 |
| ... | 274 additional blocks omitted from markdown | See extracted JSON | ... |

## Next Step

Inspect these block references before extracting cookbook rules. Full raw block text is stored in `../extracted/blocks.json`.

```

## CDM/Rosetta Java Preflight

# CDM/Rosetta Java Preflight

Generated: 2026-05-06T11:11:20.039Z
Status: passed
Mode: repo-local-rosetta-validator

## Artifact

org.finos.cdm:cdm-java:6.7.0

## Validator Module

- POM: C:\Users\User\Desktop\fpml-cdm-fyp\rosetta-validator\pom.xml
- JAR: C:\Users\User\Desktop\fpml-cdm-fyp\rosetta-validator\target\rosetta-validator-1.0.0.jar
- Build command: mvn -q -DskipTests package

## Model Root Candidates

- cdm.event.common.TradeState
- cdm.event.common.Trade

## Required Classes

- Trade root: cdm.event.common.Trade
- Trade state root: cdm.event.common.TradeState
- Contract details: cdm.event.common.ContractDetails
- Non-transferable product: cdm.product.template.NonTransferableProduct
- Economic terms: cdm.product.template.EconomicTerms
- Payout container: cdm.product.template.Payout
- Settlement payout: cdm.product.template.SettlementPayout
- Resolvable price quantity: cdm.product.common.settlement.ResolvablePriceQuantity
- Price schedule: cdm.observable.asset.PriceSchedule
- Party reference or party identity: cdm.base.staticdata.party.metafields.ReferenceWithMetaParty

## Serializer

- Strategy: maven-compile-gated-jackson-serialization
- Notes: Use the CDM model object as the internal representation and serialize it at the runtime boundary.

## Diagnostics

- rosetta-validator Maven module was found and packaged successfully.
- Built C:\Users\User\Desktop\fpml-cdm-fyp\rosetta-validator\target\rosetta-validator-1.0.0.jar.


## Rosetta Authoritative Context

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


## Known Absent Paths

- data/agent-cookbook/latest/fx-derivatives
- data/agent-cookbook/latest/fx-derivatives/evidence.json

## Notes

- Use 00-product-scope.json as the authoritative FX product map.
- Use data/agent-cookbook/latest/product-families/fx-derivatives.md for cookbook rules.
- Use data/agent-cookbook/latest/references/fx-derivatives.evidence.json for evidence metadata.
- Rosetta source is authoritative for CDM mapping structure.
- Cookbook rules are secondary and must not override Rosetta source.
- Generated Java must use CDM/Rosetta Java model classes as the internal model.
- Jackson ObjectNode/ArrayNode are allowed for sidecar reports only, not CDM construction.
- Runtime support claims must be fixture-gated.
- Do not invent product roots, fixture paths, or cookbook paths.
