# Agent Mapping Playbook: bond-options

## 1. Scope

- Folder: `bond-options`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-23`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `3`
- Matched pairs selected: `3`
- Structural evidence basis: `3/3` matched pairs
- Semantic evidence basis: `3/3` pair analyses
- Full semantic analyses: `3`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `0`
- Missing counterparts: `0`
- Ignored pairs: `0`
- Exact matches: `3`
- Normalized matches: `0`
- Alias matches: `0`
- Structural basis note: Structural summaries are computed from all 3/3 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 3/3 successful or salvaged pair analyses (3 full, 0 salvaged).

## 3. Included Examples

- `bond-options/bond-option.xml` -> `bond-options/bond-option.json` (`exact`)
- `bond-options/cb-option-2.xml` -> `bond-options/cb-option-2.json` (`exact`)
- `bond-options/cb-option.xml` -> `bond-options/cb-option.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- None observed.

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/header/messageId
- /FpML/header/sentBy
- /FpML/header/sendTo
- /FpML/header/creationTimestamp
- /FpML/trade/tradeHeader/partyTradeIdentifier/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier/tradeId
- /FpML/trade/tradeHeader/tradeDate

### 5.2 Repeated top-level sections

- `header` appears in `3/3` examples
- `party` appears in `3/3` examples
- `trade` appears in `3/3` examples

### 5.3 Repeated nested structures

- trade > bondOption (40 paths)
- trade > tradeHeader (3 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)
- trade > calculationAgent (1 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `3/3` examples
- `trade` appears in `3/3` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (47 paths)
- trade > tradeLot (26 paths)
- transferHistory > transfer (16 paths)
- trade > party (13 paths)
- trade > tradeIdentifier (11 paths)
- trade > counterparty (7 paths)
- trade > ancillaryParty (5 paths)
- trade > tradeDate (3 paths)

### 5.7 Optional but common CDM sections

- `transferHistory` appears in `1/3` examples

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule TENT-001: optionType copied from trade.bondoption.optiontype to payout.optionpayout.optiontype

- Strength: `strong recurring pattern`
- Evidence count: `3` examples
- Source pattern: `trade.bondoption.optionType`
- Target pattern: `payout.optionPayout.optionType`
- Explanation: Option type values in the FPML bond/convertible bond option trades are preserved and placed into the CDM OptionPayout.optionType field.
- Why it seems to work this way: Option type represents an option semantic that is preserved across the source and CDM target and therefore is mapped directly without transformation.
- Example files:
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option-2.xml`
  - `bond-options/cb-option.xml`
- Caveats:
  - None observed.

### 6.2 Repeated non-literal transformations

### Transformation TNT-001: date/time trimmed to date-only

- Type: `normalization`
- Description: Date/time values in FPML are trimmed/normalized to date-only (YYYY-MM-DD) in the CDM.
- Source side: `FPML dateTime (often with timezone or time component)`
- Target side: `CDM date (YYYY-MM-DD)`
- Evidence count: `3`
- Example files:
  - `bond-options/cb-option-2.xml`
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option.xml`
- Notes:
  - Representative notes mention 'trim timezone to YYYY-MM-DD' and 'strip timezone/time to date-only' across examples.
  - Applied to trade dates and centers where present.

### Transformation TNT-002: party role mapping: buyer/seller -> payer/receiver

- Type: `reference resolution`
- Description: FPML buyer and seller references are mapped to CDM counterparties and used as OptionPayout buyer/payer and seller/receiver roles (buyer->payer, seller->receiver).
- Source side: `FPML buyer/seller references and trade party references`
- Target side: `CDM counterparty entries and OptionPayout buyer/payer and seller/receiver`
- Evidence count: `2`
- Example files:
  - `bond-options/cb-option-2.xml`
  - `bond-options/cb-option.xml`
- Notes:
  - Examples show buyer reference mapping to counterparty and OptionPayout buyer/payer; seller to counterparty and OptionPayout seller/receiver.
  - There is repeated uncertainty about payer/receiver inversion which suggests mapping exists but its direction/semantics should be verified.

### Transformation TNT-003: numberOfOptions -> tradeLot.quantity and parValue -> multiplier

- Type: `normalization`
- Description: FPML numberOfOptions becomes a CDM quantity; FPML parValue becomes a multiplier on the CDM trade lot.
- Source side: `FPML numberOfOptions, parValue`
- Target side: `CDM tradeLot.quantity, tradeLot.multiplier`
- Evidence count: `1`
- Example files:
  - `bond-options/cb-option.xml`
- Notes:
  - Represented in cb-option mapping: 'numberOfOptions->quantity, parValue->multiplier, currency->currency'.

### Transformation TNT-004: premium mapped to transferHistory entry

- Type: `wrapper insertion`
- Description: FPML premium information is represented as a transfer/transferHistory entry in the CDM.
- Source side: `FPML premium element`
- Target side: `CDM transferHistory / transfer entries`
- Evidence count: `1`
- Example files:
  - `bond-options/bond-option.xml`
- Notes:
  - bond-option shows premium mapped to transferHistory; appears as a transfer wrapper in target.

### Transformation TNT-005: notional/par value mapping to tradeLot quantity

- Type: `normalization`
- Description: FPML notional/par value is used to produce tradeLot.quantity in CDM (notional-sized quantity representation).
- Source side: `FPML notional / nominal / par value fields`
- Target side: `CDM tradeLot.quantity (and possibly multiplier per above)`
- Evidence count: `1`
- Example files:
  - `bond-options/bond-option.xml`
- Notes:
  - bond-option highlights notional mapped to tradeLot quantity.

### Transformation TNT-006: currency preserved

- Type: `normalization`
- Description: Currency values are preserved from FPML into CDM currency fields for quantity/amounts.
- Source side: `FPML currency attributes`
- Target side: `CDM currency fields`
- Evidence count: `1`
- Example files:
  - `bond-options/cb-option.xml`
- Notes:
  - Explicit mention in cb-option: 'currency->currency'.

### 6.3 Tentative repeated signals

### TENT-001: mapping

- Strength: `strong recurring pattern`
- Description: Option-specific terms repeatedly map from trade.bondoption.optiontype into payout.optionpayout.optiontype.
- Evidence count: `3`
- Example files:
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option-2.xml`
  - `bond-options/cb-option.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: option type preserved
  - Representative note: optionType copied
  - Representative note: optionType value mapped

### 6.4 Folder-level principles

- Option semantic elements (optionType) are copied from FPML option sections into CDM OptionPayout.optionType.
- FPML party references for buyer/seller are material to CDM counterparties and are reused as payer/receiver roles within OptionPayouts (verify direction semantics).
- Monetary and quantity-like fields (numberOfOptions, parValue, notional) are normalized into CDM tradeLot quantity/multiplier and preserved currency.

### 6.5 Variants and exceptions

### Variant VAR-001: OptionPayout.payerReceiver inversion

- Description: Several examples show payer/receiver values that appear inverted relative to FPML buyer/seller; mapping direction may differ or be intentionally inverted in CDM.
- Seen in:
  - `bond-options/cb-option-2.xml`
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option.xml`
- Impact on generalization: Mapping of buyer/seller to payer/receiver should be treated as a variant; automated rules should include a verification step. This reduces confidence in blindly swapping roles without checking contextual semantics.

### Variant VAR-002: calculationAgent mapping to CalculationAgentIndependent ancillaryParty

- Description: Some examples show FPML calculationAgentPartyReference becoming a CDM ancillary party typed 'CalculationAgentIndependent' rather than a straightforward party reference.
- Seen in:
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option.xml`
  - `bond-options/cb-option-2.xml`
- Impact on generalization: This appears to be an enrichment/normalization choice; treat as an exception that requires explicit handling or confirmation rather than an automatic party reference mapping.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: calculationAgentPartyReference -> CalculationAgentIndependent ancillaryParty

- Description: FPML calculationAgent references are turned into an ancillaryParty entry with role 'CalculationAgentIndependent' in the CDM (appears to be an enrichment or normalization).
- Classification: `suspected enrichment`
- Evidence:
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option.xml`
  - `bond-options/cb-option-2.xml`
- Caution:
  - Representation changes party reference semantics; require confirmation whether this is always desired or only for specific agent types.

### Enrichment ENR-002: payer/receiver role normalization

- Description: The translation from FPML buyer/seller to CDM payer/receiver may include normalization logic that inverts or reinterprets roles.
- Classification: `unclear`
- Evidence:
  - `bond-options/cb-option-2.xml`
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option.xml`
- Caution:
  - Observed inversion or unexpected assignment of payer/receiver; treat as a potential enrichment or domain-specific reinterpretation and validate against business rules.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 3/3 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 3/3 successful or salvaged pair analyses (3 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: header, party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- trade.bondoption.optionType -> payout.optionPayout.optionType: Option type values in the FPML bond/convertible bond option trades are preserved and placed into the CDM OptionPayout.optionType field.
- Option-specific terms repeatedly map from trade.bondoption.optiontype into payout.optionpayout.optiontype. [tentative 3 examples]

### Transformation Patterns

- normalization: Date/time values in FPML are trimmed/normalized to date-only (YYYY-MM-DD) in the CDM.
- reference resolution: FPML buyer and seller references are mapped to CDM counterparties and used as OptionPayout buyer/payer and seller/receiver roles (buyer->payer, seller->receiver).
- normalization: FPML numberOfOptions becomes a CDM quantity; FPML parValue becomes a multiplier on the CDM trade lot.
- wrapper insertion: FPML premium information is represented as a transfer/transferHistory entry in the CDM.
- normalization: FPML notional/par value is used to produce tradeLot.quantity in CDM (notional-sized quantity representation).
- normalization: Currency values are preserved from FPML into CDM currency fields for quantity/amounts.

### Product-Specific Branches

### cb-option-2.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - buyer reference maps to counterparty and OptionPayout buyer
  - seller reference maps to counterparty and OptionPayout seller
  - optionType copied
  - settlementType copied
- Cautions:
  - Why is payerReceiver inverted versus buyerSeller in CDM?

### bond-option.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - option type preserved
  - premium mapped to transferHistory
  - notional mapped to tradeLot quantity
- Cautions:
  - Why OptionPayout.payerReceiver shows payer/receiver reversed?
  - How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?

### cb-option.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - optionType value mapped
  - buyer->payer, seller->receiver
  - date normalized and centers mapped
- Cautions:
  - How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
  - Is underlier Observable explicitly linked to convertibleBond.instrumentId?

### Validation Checks

- Check unresolved question: Why OptionPayout.payerReceiver shows payer/receiver reversed?
- Check unresolved question: How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?
- Check unresolved question: Why is payerReceiver inverted versus buyerSeller in CDM?
- Check unresolved question: How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Check unresolved question: Is underlier Observable explicitly linked to convertibleBond.instrumentId?
- Check enrichment/default behavior: FPML calculationAgent references are turned into an ancillaryParty entry with role 'CalculationAgentIndependent' in the CDM (appears to be an enrichment or normalization).

### Do Not Assume

- Do not treat calculationAgentPartyReference -> CalculationAgentIndependent ancillaryParty as a guaranteed direct mapping rule yet.
- Do not treat payer/receiver role normalization as a guaranteed direct mapping rule yet.
- Why is payerReceiver inverted versus buyerSeller in CDM?
- Why OptionPayout.payerReceiver shows payer/receiver reversed?
- How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?
- How is calculationAgentPartyReference mapped to CalculationAgentIndependent?

## 8. Pair-Level Worked Examples

### `bond-options/cb-option-2.xml` -> `bond-options/cb-option-2.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - buyer reference maps to counterparty and OptionPayout buyer
  - seller reference maps to counterparty and OptionPayout seller
  - optionType copied
  - settlementType copied
- Most important transformation:
  - trim timezone to YYYY-MM-DD
- Uncertainty:
  - Why is payerReceiver inverted versus buyerSeller in CDM?

### `bond-options/bond-option.xml` -> `bond-options/bond-option.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - option type preserved
  - premium mapped to transferHistory
  - notional mapped to tradeLot quantity
- Most important transformation:
  - strip timezone/time to date-only
- Uncertainty:
  - Why OptionPayout.payerReceiver shows payer/receiver reversed?
  - How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?

### `bond-options/cb-option.xml` -> `bond-options/cb-option.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - optionType value mapped
  - buyer->payer, seller->receiver
  - date normalized and centers mapped
- Most important transformation:
  - numberOfOptions->quantity, parValue->multiplier, currency->currency
- Uncertainty:
  - How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
  - Is underlier Observable explicitly linked to convertibleBond.instrumentId?

## 9. Open Questions And Risks

- Why OptionPayout.payerReceiver shows payer/receiver reversed?
- How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?
- Why is payerReceiver inverted versus buyerSeller in CDM?
- How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Is underlier Observable explicitly linked to convertibleBond.instrumentId?

## 10. Draft Conclusion

- Most reusable findings:
  - Option type values are reliably copied from FPML option sections into CDM OptionPayout.optionType.
  - Dates/times are normalized to date-only (YYYY-MM-DD) in the CDM.
  - Buyer/seller party references are used to populate CDM counterparties and OptionPayout payer/receiver roles (but direction requires verification).
  - Quantity-related fields (numberOfOptions, parValue, notional) are normalized into CDM tradeLot quantity and multiplier; currency is preserved.
- What seems safe to generalize:
  - Mapping of optionType from FPML to CDM OptionPayout.optionType (strong evidence).
  - Trimming/normalizing FPML dateTimes to CDM date-only (strong evidence across examples).
- What should remain tentative:
  - Exact semantics/direction when mapping buyer/seller to payer/receiver (observed inversions).
  - Transformation of calculationAgent references into CalculationAgentIndependent ancillaryParty (suspected enrichment).
  - Explicit linking of underlier Observable to convertibleBond.instrumentId (unresolved).
  - Any automated rule that assumes payer/receiver direction without validation.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `3`
- Successful semantic pair count: `3`
- Full semantic pair count: `3`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `0`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 3
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 3
  - Tentative repeated semantic signals: 1
