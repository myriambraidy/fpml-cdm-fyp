# Agent Mapping Playbook: equity-options

## 1. Scope

- Folder: `equity-options`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-26`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `27`
- Matched pairs selected: `27`
- Structural evidence basis: `27/27` matched pairs
- Semantic evidence basis: `6/27` pair analyses
- Full semantic analyses: `6`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `21`
- Missing counterparts: `0`
- Ignored pairs: `0`
- Exact matches: `26`
- Normalized matches: `1`
- Alias matches: `0`
- Structural basis note: Structural summaries are computed from all 27/27 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 6/27 successful or salvaged pair analyses (6 full, 0 salvaged).

## 3. Included Examples

- `equity-options/eqd-ex-27-equityOptionTransactionSupplement-EMEA-interdealer.xml` -> `equity-options/eqd-ex-27-equityOptionTransactionSupplement-EMEA-interdealer.json` (`normalized`)
- `equity-options/eqd-ex01-american-call-stock-long-form.xml` -> `equity-options/eqd-ex01-american-call-stock-long-form.json` (`exact`)
- `equity-options/eqd-ex02-calendar-spread-short-form.xml` -> `equity-options/eqd-ex02-calendar-spread-short-form.json` (`exact`)
- `equity-options/eqd-ex03-call-or-put-spread-short-form.xml` -> `equity-options/eqd-ex03-call-or-put-spread-short-form.json` (`exact`)
- `equity-options/eqd-ex04-european-call-index-long-form.xml` -> `equity-options/eqd-ex04-european-call-index-long-form.json` (`exact`)
- `equity-options/eqd-ex05-asian-long-form.xml` -> `equity-options/eqd-ex05-asian-long-form.json` (`exact`)
- `equity-options/eqd-ex06-averaging-in-long-form.xml` -> `equity-options/eqd-ex06-averaging-in-long-form.json` (`exact`)
- `equity-options/eqd-ex07-barrier-knockout-rebate-long-form.xml` -> `equity-options/eqd-ex07-barrier-knockout-rebate-long-form.json` (`exact`)
- `equity-options/eqd-ex08-basket-long-form.xml` -> `equity-options/eqd-ex08-basket-long-form.json` (`exact`)
- `equity-options/eqd-ex09-bermuda-long-form.xml` -> `equity-options/eqd-ex09-bermuda-long-form.json` (`exact`)
- `equity-options/eqd-ex10-binary-barrier-long-form.xml` -> `equity-options/eqd-ex10-binary-barrier-long-form.json` (`exact`)
- `equity-options/eqd-ex11-quanto-long-form.xml` -> `equity-options/eqd-ex11-quanto-long-form.json` (`exact`)
- `equity-options/eqd-ex12-vanilla-short-form.xml` -> `equity-options/eqd-ex12-vanilla-short-form.json` (`exact`)
- `equity-options/eqd-ex13-1996-american-call-stock.xml` -> `equity-options/eqd-ex13-1996-american-call-stock.json` (`exact`)
- `equity-options/eqd-ex14-american-call-stock-passthrough-long-form.xml` -> `equity-options/eqd-ex14-american-call-stock-passthrough-long-form.json` (`exact`)
- `equity-options/eqd-ex15-basket-passthrough-long-form.xml` -> `equity-options/eqd-ex15-basket-passthrough-long-form.json` (`exact`)
- `equity-options/eqd-ex16-equityOptionTransactionSupplement.xml` -> `equity-options/eqd-ex16-equityOptionTransactionSupplement.json` (`exact`)
- `equity-options/eqd-ex17-equityOptionTransactionSupplement-non-deliverable-share.xml` -> `equity-options/eqd-ex17-equityOptionTransactionSupplement-non-deliverable-share.json` (`exact`)
- `equity-options/eqd-ex18-equityOptionTransactionSupplement-non-deliverable-index.xml` -> `equity-options/eqd-ex18-equityOptionTransactionSupplement-non-deliverable-index.json` (`exact`)
- `equity-options/eqd-ex19-dividend-adjustment.xml` -> `equity-options/eqd-ex19-dividend-adjustment.json` (`exact`)
- `equity-options/eqd-ex20-nested-basket.xml` -> `equity-options/eqd-ex20-nested-basket.json` (`exact`)
- `equity-options/eqd-ex21-flat-weight-basket.xml` -> `equity-options/eqd-ex21-flat-weight-basket.json` (`exact`)
- `equity-options/eqd-ex22-equityOptionTransactionSupplement-index-option-asian-dates.xml` -> `equity-options/eqd-ex22-equityOptionTransactionSupplement-index-option-asian-dates.json` (`exact`)
- `equity-options/eqd-ex23-equityOptionTransactionSupplement-index-option-cliquet.xml` -> `equity-options/eqd-ex23-equityOptionTransactionSupplement-index-option-cliquet.json` (`exact`)
- `equity-options/eqd-ex24-equityOptionTransactionSupplement-index-option-asian-schedule.xml` -> `equity-options/eqd-ex24-equityOptionTransactionSupplement-index-option-asian-schedule.json` (`exact`)
- `equity-options/eqd-ex25-equityOptionTransactionSupplement-index-option-knock-in-knock-out-features.xml` -> `equity-options/eqd-ex25-equityOptionTransactionSupplement-index-option-knock-in-knock-out-features.json` (`exact`)
- `equity-options/eqd-ex26-mixed-asset-basket.xml` -> `equity-options/eqd-ex26-mixed-asset-basket.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- None observed.

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/trade/tradeHeader/partyTradeIdentifier
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId
- /FpML/trade/tradeHeader/tradeDate
- /FpML/header/conversationId
- /FpML/header/messageId

### 5.2 Repeated top-level sections

- `party` appears in `27/27` examples
- `trade` appears in `27/27` examples
- `header` appears in `21/27` examples

### 5.3 Repeated nested structures

- trade > equityOptionTransactionSupplement (39 paths)
- trade > tradeHeader (6 paths)
- trade > documentation (3 paths)
- party > partyId (2 paths)
- party > partyName (2 paths)
- trade > equityOption (58 paths)
- trade > tradeHeader (3 paths)
- header > conversationId (1 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `27/27` examples
- `trade` appears in `27/27` examples
- `transferHistory` appears in `27/27` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (39 paths)
- trade > tradeLot (29 paths)
- trade > tradeIdentifier (21 paths)
- trade > party (15 paths)
- transferHistory > transfer (15 paths)
- trade > contractDetails (12 paths)
- trade > counterparty (7 paths)
- trade > tradeDate (2 paths)

### 5.7 Optional but common CDM sections

- None observed.

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

No strong evidence yet.

### 6.2 Repeated non-literal transformations

No strong evidence yet.

### 6.3 Tentative and emerging signals

No repeated tentative signals were recovered yet.

### 6.4 Folder-level principles

- Generalize only from repeated semantic evidence; use structural repetition only for scaffolding.

### 6.5 Variants and exceptions

No strong evidence yet.

### 6.6 Suspected enrichment or default behavior

No strong evidence yet.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 27/27 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 6/27 successful or salvaged pair analyses (6 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: party, trade, header.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Use pair-level examples as tentative guidance; no repeated folder-wide rules were recovered yet.
- Watch for non-literal reshaping and confirm it from pair-level examples before generalizing.
- Assemble the result under repeated CDM scaffolding such as meta, trade, transferHistory.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- No repeated semantic rules recovered yet.

### Transformation Patterns

- No repeated transformation patterns recovered yet.

### Product-Specific Branches

### eqd-ex-27-equityOptionTransactionSupplement-EMEA-interdealer.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - option type 'Call' maps directly
  - settlement type and currency map
  - instrumentId and description become identifiers
  - buyer/seller hrefs mapped to Party1/Party2 roles
- Cautions:
  - CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
  - Why is payerReceiver.payer Party2 though buyer is Party1?

### eqd-ex02-calendar-spread-short-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - productType 'calendarSpread' -> taxonomy name
  - optionType 'Call' -> OptionPayout.optionType
  - exercise unadjustedDate values map to CDM exerciseTerms
  - numberOfOptions -> tradeLot quantity value (unit Contract)
- Cautions:
  - Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
  - Why buyer/seller role names appear swapped between FpML and CDM?

### eqd-ex03-call-or-put-spread-short-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - option type mapped
  - strike value mapped; currency attached
  - underlyer id and name mapped
  - premium represented as transferHistory entry
- Cautions:
  - Why are buyer/seller values inverted between FpML and CDM?
  - Why was exchange 'NSE' converted to 'XNSE' in CDM?

### eqd-ex04-european-call-index-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - strike price copied
  - buyer/seller mapped to payer/receiver
  - quantity and multiplier set
  - relative settlement date mapped
- Cautions:
  - Is calculationAgentPartyReference mapped to calculationAgent role or ancillaryParty?

### eqd-ex05-asian-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - premium amount and currency mapped to transfer quantity
  - asian averaging feature and dates mapped
  - index identifiers and exchanges mapped to observable index
- Cautions:
  - Why are buyer/seller roles inverted in CDM buyerSeller versus FpML buyerPartyReference?
  - What mapping produced CDM exchange codes XTKS/XOSE from FpML TSE/OSE?

### eqd-ex07-barrier-knockout-rebate-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - option type preserved
  - settlement type mapped
  - underlier identifier preserved
  - notional amount and currency mapped
- Cautions:
  - Is ancillaryParty role 'CalculationAgentIndependent' a normalization of FpML calculationAgent?

### Validation Checks

- Check unresolved question: CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
- Check unresolved question: Why is payerReceiver.payer Party2 though buyer is Party1?
- Check unresolved question: Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
- Check unresolved question: Why buyer/seller role names appear swapped between FpML and CDM?
- Check unresolved question: Why are buyer/seller values inverted between FpML and CDM?
- Check unresolved question: Why was exchange 'NSE' converted to 'XNSE' in CDM?

### Do Not Assume

- CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
- Why is payerReceiver.payer Party2 though buyer is Party1?
- Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
- Why buyer/seller role names appear swapped between FpML and CDM?
- Why are buyer/seller values inverted between FpML and CDM?
- Why was exchange 'NSE' converted to 'XNSE' in CDM?

## 8. Pair-Level Worked Examples

### `equity-options/eqd-ex-27-equityOptionTransactionSupplement-EMEA-interdealer.xml` -> `equity-options/eqd-ex-27-equityOptionTransactionSupplement-EMEA-interdealer.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - option type 'Call' maps directly
  - settlement type and currency map
  - instrumentId and description become identifiers
  - buyer/seller hrefs mapped to Party1/Party2 roles
- Most important transformation:
  - href 'valuationDate' resolved to externalReference
- Uncertainty:
  - CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
  - Why is payerReceiver.payer Party2 though buyer is Party1?

### `equity-options/eqd-ex02-calendar-spread-short-form.xml` -> `equity-options/eqd-ex02-calendar-spread-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - productType 'calendarSpread' -> taxonomy name
  - optionType 'Call' -> OptionPayout.optionType
  - exercise unadjustedDate values map to CDM exerciseTerms
  - numberOfOptions -> tradeLot quantity value (unit Contract)
- Most important transformation:
  - FpML buyer/seller hrefs resolved to CDM counterparty externalReference
- Uncertainty:
  - Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
  - Why buyer/seller role names appear swapped between FpML and CDM?

### `equity-options/eqd-ex03-call-or-put-spread-short-form.xml` -> `equity-options/eqd-ex03-call-or-put-spread-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - option type mapped
  - strike value mapped; currency attached
  - underlyer id and name mapped
  - premium represented as transferHistory entry
- Most important transformation:
  - exchange code 'NSE' appears as 'XNSE' in CDM
- Uncertainty:
  - Why are buyer/seller values inverted between FpML and CDM?
  - Why was exchange 'NSE' converted to 'XNSE' in CDM?

### `equity-options/eqd-ex04-european-call-index-long-form.xml` -> `equity-options/eqd-ex04-european-call-index-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - strike price copied
  - buyer/seller mapped to payer/receiver
  - quantity and multiplier set
  - relative settlement date mapped
- Most important transformation:
  - removed trailing Z from date
- Uncertainty:
  - Is calculationAgentPartyReference mapped to calculationAgent role or ancillaryParty?

### `equity-options/eqd-ex05-asian-long-form.xml` -> `equity-options/eqd-ex05-asian-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - premium amount and currency mapped to transfer quantity
  - asian averaging feature and dates mapped
  - index identifiers and exchanges mapped to observable index
- Most important transformation:
  - strike price numeric plus settlement currency combined into CDM strike price unit
- Uncertainty:
  - Why are buyer/seller roles inverted in CDM buyerSeller versus FpML buyerPartyReference?
  - What mapping produced CDM exchange codes XTKS/XOSE from FpML TSE/OSE?

### `equity-options/eqd-ex07-barrier-knockout-rebate-long-form.xml` -> `equity-options/eqd-ex07-barrier-knockout-rebate-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - option type preserved
  - settlement type mapped
  - underlier identifier preserved
  - notional amount and currency mapped
- Most important transformation:
  - premium moved to transferHistory structure
- Uncertainty:
  - Is ancillaryParty role 'CalculationAgentIndependent' a normalization of FpML calculationAgent?

## 9. Open Questions And Risks

- CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
- Why is payerReceiver.payer Party2 though buyer is Party1?
- Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
- Why buyer/seller role names appear swapped between FpML and CDM?
- Why are buyer/seller values inverted between FpML and CDM?
- Why was exchange 'NSE' converted to 'XNSE' in CDM?

## 10. Draft Conclusion

- Most reusable findings:
  - option type 'Call' maps directly
  - settlement type and currency map
  - productType 'calendarSpread' -> taxonomy name
  - optionType 'Call' -> OptionPayout.optionType
- What seems safe to generalize:
  - Apply only rules backed by repeated semantic evidence and exact source cues.
- What should remain tentative:
  - CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
  - Why is payerReceiver.payer Party2 though buyer is Party1?
  - Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
  - Why buyer/seller role names appear swapped between FpML and CDM?

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `27`
- Successful semantic pair count: `6`
- Full semantic pair count: `6`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `21`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 27
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 6
  - Tentative repeated semantic signals: 0
