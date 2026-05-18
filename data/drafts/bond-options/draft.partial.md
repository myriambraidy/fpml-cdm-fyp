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

### Rule RULE-001: Option type copied into payout.optionpayout.optiontype

- Strength: `strong recurring pattern`
- Evidence count: `3` examples
- Source pattern: `trade.bondoption.optiontype`
- Target pattern: `payout.optionpayout.optiontype`
- Explanation: The optionType value from the FpML bond option trade is preserved and placed into the CDM payout structure under optionpayout.optiontype in all examples.
- Why it seems to work this way: optionType is a semantically stable identifier of the option contract form; preserving the literal value into the CDM payout keeps intent and downstream semantics intact.
- Example files:
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option-2.xml`
  - `bond-options/cb-option.xml`
- Caveats:
  - This rule covers only the optionType element; it does not describe how related option terms (strike, premium, exercise details) are mapped.
  - Party- and agent-related mappings seen in examples are inconsistent and are not covered by this pattern.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Datetime -> date normalization (strip time/timezone)

- Type: `normalization`
- Description: DateTime values are normalized to plain dates by removing time and timezone components.
- Source side: `commencementdate.adjustabledate.unadjusteddate (FpML datetime with possible time/timezone)`
- Target side: `commencementdate.adjustabledate.unadjusteddate (CDM date without time/timezone)`
- Evidence count: `2`
- Example files:
  - `bond-options/cb-option-2.xml`
  - `bond-options/cb-option.xml`
- Notes:
  - Representative transformation described as 'strip timezone from datetime' and 'datetime trimmed to date'.
  - Applied where unadjustedDate appears to include time/timezone in the source and CDM expects a date-only value.

### 6.3 Tentative and emerging signals

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
  - Representative note: optionType mapped
  - Representative note: optionType value copied
  - Representative note: optionType preserved

### TENT-002: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes commencementdate.adjustabledate.unadjusteddate into commencementdate.adjustabledate.unadjusteddate.
- Evidence count: `2`
- Example files:
  - `bond-options/cb-option-2.xml`
  - `bond-options/cb-option.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: strip timezone from datetime
  - Representative note: datetime trimmed to date

### 6.4 Folder-level principles

- Preserve optionType values from FpML bond option trades by copying into CDM payout.optionpayout.optiontype.
- Normalize FpML datetime values (when present as unadjustedDate) to CDM date-only values by removing time and timezone.
- Party- and agent-related mappings are not uniform across examples; treat party role mapping (buyer/seller/payer/receiver) as instance-specific and validate against the trade context.

### 6.5 Variants and exceptions

### Variant VAR-001: Calculation agent mapping unclear

- Description: Mapping of calculationAgentParty or calculationAgentPartyReference to CDM CalculationAgentIndependent is observed but not explained by repeated signals.
- Seen in:
  - `bond-options/bond-option.xml`
  - `bond-options/cb-option-2.xml`
- Impact on generalization: Treat any mapping of calculation agent to CalculationAgentIndependent as tentative; require explicit rule or manual check before generalizing.

### Variant VAR-002: Inconsistent buyer/seller -> buyerSeller mapping

- Description: Different examples map FpML buyerPartyReference/sellerPartyReference to CDM buyerSeller roles differently (buyer -> buyer in one file, buyer -> payer in another).
- Seen in:
  - `bond-options/cb-option-2.xml`
  - `bond-options/cb-option.xml`
- Impact on generalization: Prevents a deterministic folder-wide rule for party reference mapping; party role mapping must be verified per file and cannot be assumed consistent.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: Calculation agent defaulting to CalculationAgentIndependent

- Description: Where a calculationAgentParty or reference appears in source, the CDM output shows CalculationAgentIndependent in at least one mapping; this may be an enrichment or a defaulting behavior when a specific agent mapping is not established.
- Classification: `suspected enrichment`
- Evidence:
  - `bond-options/bond-option.xml (representative note: calculationAgentParty mapped to CalculationAgentIndependent)`
  - `bond-options/cb-option-2.xml (open question: mapping of calculationAgentPartyReference)`
- Caution:
  - Not enough repeated deterministic evidence to treat this as a guaranteed rule.
  - Verify intent and party identity when mapping calculation agents; do not assume a generic CalculationAgentIndependent unless supported by mapping logic or business rules.

### Enrichment ENR-002: Premium mapped to transfer record

- Description: Premium amount and currency from FpML premiums appear in CDM as transfer entries in at least one example.
- Classification: `suspected enrichment`
- Evidence:
  - `bond-options/bond-option.xml (importantMappings: premium amount and currency mapped to transfer)`
- Caution:
  - This is observed in a single representative example; confirm transfer structure semantics before generalizing across the folder.

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

- trade.bondoption.optiontype -> payout.optionpayout.optiontype: The optionType value from the FpML bond option trade is preserved and placed into the CDM payout structure under optionpayout.optiontype in all examples.
- Option-specific terms repeatedly map from trade.bondoption.optiontype into payout.optionpayout.optiontype. [tentative 3 examples]

### Transformation Patterns

- normalization: DateTime values are normalized to plain dates by removing time and timezone components.
- Normalization repeatedly reshapes commencementdate.adjustabledate.unadjusteddate into commencementdate.adjustabledate.unadjusteddate. [tentative 2 examples]

### Product-Specific Branches

### bond-option.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - optionType mapped
  - strike price mapped
  - premium amount and currency mapped to transfer
  - unadjustedDate normalized to date
- Cautions:
  - calculationAgentParty mapped to CalculationAgentIndependent; source shows Party1

### cb-option-2.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - FpML buyerPartyReference -> CDM buyerSeller.buyer
  - FpML sellerPartyReference -> CDM buyerSeller.seller
  - optionType value copied
  - tradeId -> tradeIdentifier.assignedIdentifier
- Cautions:
  - How was calculationAgentPartyReference mapped to CalculationAgentIndependent?

### cb-option.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - buyerPartyReference href -> payer
  - sellerPartyReference href -> receiver
  - optionType preserved
  - ISIN -> observable identifier
- Cautions:
  - Why CDM buyerSeller buyer/seller appear swapped versus FpML buyer/seller

### Validation Checks

- Check unresolved question: calculationAgentParty mapped to CalculationAgentIndependent; source shows Party1
- Check unresolved question: How was calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Check unresolved question: Why CDM buyerSeller buyer/seller appear swapped versus FpML buyer/seller
- Check enrichment/default behavior: Where a calculationAgentParty or reference appears in source, the CDM output shows CalculationAgentIndependent in at least one mapping; this may be an enrichment or a defaulting behavior when a specific agent mapping is not established.
- Check enrichment/default behavior: Premium amount and currency from FpML premiums appear in CDM as transfer entries in at least one example.

### Do Not Assume

- Do not treat Calculation agent defaulting to CalculationAgentIndependent as a guaranteed direct mapping rule yet.
- Do not treat Premium mapped to transfer record as a guaranteed direct mapping rule yet.
- calculationAgentParty mapped to CalculationAgentIndependent; source shows Party1
- How was calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Why CDM buyerSeller buyer/seller appear swapped versus FpML buyer/seller

## 8. Pair-Level Worked Examples

### `bond-options/bond-option.xml` -> `bond-options/bond-option.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - optionType mapped
  - strike price mapped
  - premium amount and currency mapped to transfer
  - unadjustedDate normalized to date
- Most important transformation:
  - remove time/timezone from datetime
- Uncertainty:
  - calculationAgentParty mapped to CalculationAgentIndependent; source shows Party1

### `bond-options/cb-option-2.xml` -> `bond-options/cb-option-2.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML buyerPartyReference -> CDM buyerSeller.buyer
  - FpML sellerPartyReference -> CDM buyerSeller.seller
  - optionType value copied
  - tradeId -> tradeIdentifier.assignedIdentifier
- Most important transformation:
  - strip timezone from datetime
- Uncertainty:
  - How was calculationAgentPartyReference mapped to CalculationAgentIndependent?

### `bond-options/cb-option.xml` -> `bond-options/cb-option.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - buyerPartyReference href -> payer
  - sellerPartyReference href -> receiver
  - optionType preserved
  - ISIN -> observable identifier
- Most important transformation:
  - datetime trimmed to date
- Uncertainty:
  - Why CDM buyerSeller buyer/seller appear swapped versus FpML buyer/seller

## 9. Open Questions And Risks

- calculationAgentParty mapped to CalculationAgentIndependent; source shows Party1
- How was calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Why CDM buyerSeller buyer/seller appear swapped versus FpML buyer/seller

## 10. Draft Conclusion

- Most reusable findings:
  - Option type values are reliably preserved from FpML into CDM payout.optionpayout.optiontype.
  - Datetime values used for commencement/unadjusted dates are commonly normalized to date-only by stripping time and timezone.
- What seems safe to generalize:
  - Copy optionType into payout.optionpayout.optiontype across the folder.
  - Normalize unadjustedDate datetimes to date-only when the CDM target expects a date.
- What should remain tentative:
  - Mapping of party references (buyer/seller -> buyerSeller roles) due to observed inconsistencies.
  - Treatment of calculationAgentParty/reference as CalculationAgentIndependent without explicit mapping rule.
  - Mapping of premium to transfer should be validated before applying as a folder-wide rule.

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
  - Tentative repeated semantic signals: 2
