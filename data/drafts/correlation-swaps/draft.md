# Agent Mapping Playbook: correlation-swaps

## 1. Scope

- Folder: `correlation-swaps`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-26`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `4`
- Matched pairs selected: `4`
- Structural evidence basis: `4/4` matched pairs
- Semantic evidence basis: `4/4` pair analyses
- Full semantic analyses: `4`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `0`
- Missing counterparts: `0`
- Ignored pairs: `0`
- Exact matches: `4`
- Normalized matches: `0`
- Alias matches: `0`
- Structural basis note: Structural summaries are computed from all 4/4 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 4/4 successful or salvaged pair analyses (4 full, 0 salvaged).

## 3. Included Examples

- `correlation-swaps/eqcs-ex01-correlation-swap.xml` -> `correlation-swaps/eqcs-ex01-correlation-swap.json` (`exact`)
- `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml` -> `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.json` (`exact`)
- `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml` -> `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.json` (`exact`)
- `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml` -> `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- None observed.

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/header/messageId
- /FpML/header/sentBy
- /FpML/header/creationTimestamp
- /FpML/trade/tradeHeader/partyTradeIdentifier
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId

### 5.2 Repeated top-level sections

- `header` appears in `4/4` examples
- `party` appears in `4/4` examples
- `trade` appears in `4/4` examples

### 5.3 Repeated nested structures

- trade > correlationSwap (35 paths)
- trade > tradeHeader (6 paths)
- trade > documentation (5 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sentBy (1 paths)
- trade > calculationAgent (1 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `4/4` examples
- `trade` appears in `4/4` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > tradeLot (56 paths)
- trade > product (46 paths)
- trade > contractDetails (22 paths)
- trade > tradeIdentifier (21 paths)
- trade > party (13 paths)
- trade > counterparty (7 paths)
- trade > ancillaryParty (5 paths)
- trade > tradeDate (2 paths)

### 5.7 Optional but common CDM sections

- None observed.

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule RULE-001: Settlement type preserved into performance payout settlementTerms

- Strength: `strong recurring pattern`
- Evidence count: `3` examples
- Source pattern: `correlationswap.correlationleg.settlementtype`
- Target pattern: `performancepayout.settlementterms.settlementtype`
- Explanation: Settlement type values (e.g., Cash) are consistently copied from the correlation leg settlementType in the FpML into the CDM performance payout settlementTerms.settlementType.
- Why it seems to work this way: Settlement processing semantics are preserved across representations so downstream CDM logic can rely on the same settlement modality.
- Example files:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Caveats:
  - Pattern evidence is from confirmation examples (ex02-ex04); single-file variations (ex01) do not contradict but provide less direct evidence.
  - Does not clarify how optional or complex settlementType variants (beyond simple 'Cash') are represented.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Identifier and exchange-code normalization

- Type: `normalization`
- Description: Instrument identifiers and exchange codes from FpML are normalized when mapped into CDM Security.identifier or exchange fields (examples include mapping NYSE -> XNYS and converting some instrumentId schemes to BBGID).
- Source side: `instrumentId, description, exchange codes`
- Target side: `Security.identifier.value / scheme / Security.name / exchange code normalized (e.g., XNYS), constituent identifier scheme conversions`
- Evidence count: `4`
- Example files:
  - `correlation-swaps/eqcs-ex01-correlation-swap.xml`
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Notes:
  - Normalization appears applied to both exchange codes and identifier schemes; specific rule for when to convert to BBGID is unclear.
  - Representative transformation entries mention ISIN/Name creation and exchange code mapping.

### Transformation TR-002: Split party references into counterparty entries

- Type: `split`
- Description: FpML party references (payerPartyReference, receiverPartyReference and similar) are transformed into separate counterparty/party entries in the CDM trade (e.g., Party1/Party2 or payer/receiver fields).
- Source side: `payerPartyReference, receiverPartyReference, calculationAgentPartyReference (hrefs)`
- Target side: `trade counterparties / party list entries (payer, receiver, Party1/Party2)`
- Evidence count: `3`
- Example files:
  - `correlation-swaps/eqcs-ex01-correlation-swap.xml`
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Notes:
  - Representative examples show payerPartyReference -> payer and receiverPartyReference -> receiver.
  - Some examples raise ambiguity about how calculationAgentPartyReference is represented (see open questions).

### Transformation TR-003: Move notional into tradeLot.quantity

- Type: `merge`
- Description: Notional amount and currency from FpML are placed into the CDM tradeLot.quantity structure.
- Source side: `notional amount and currency fields`
- Target side: `tradeLot.quantity (quantity value + currency)`
- Evidence count: `2`
- Example files:
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Notes:
  - Examples show notional mapped into tradeLot.quantity; quantity addressing in CDM (e.g., priceQuantity.address) remains an open question in some files.

### Transformation TR-004: RelativeDate fields nested under adjustableOrRelativeDate

- Type: `nesting change`
- Description: Individual relativeDate elements from FpML are re-grouped under an adjustableOrRelativeDate wrapper and tied to business center and daterelativeto references in CDM.
- Source side: `settlementdate.relativedate.* and relativedate.* fields`
- Target side: `adjustableorrelativedate.relativedate.* plus businesscenters.businesscenter.value and relativedate.daterelativeto.externalreference`
- Evidence count: `2`
- Example files:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Notes:
  - This mirrors TENT-002; examples show relative date fields grouped under the CDM adjustableOrRelativeDate construct.
  - Href-to-externalReference conversions are present in some examples and may require resolution logic.

### 6.3 Tentative and emerging signals

### TENT-001: mapping

- Strength: `strong recurring pattern`
- Description: Settlement terms repeatedly map from correlationswap.correlationleg.settlementtype into performancepayout.settlementterms.settlementtype.
- Evidence count: `3`
- Example files:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: settlement type preserved
  - Representative note: settlement type copied
  - Representative note: Cash settlement mapped

### TENT-002: mapping

- Strength: `moderate recurring pattern`
- Description: Settlement terms repeatedly map from relativedate.businesscenters.businesscenter|relativedate.daterelativeto.href|settlementdate.relativedate.businessdayconvention|settlementdate.relativedate.daytype|settlementdate.relativedate.period|settlementdate.relativedate.periodmultiplier into adjustableorrelativedate.relativedate.businessdayconvention|adjustableorrelativedate.relativedate.daytype|adjustableorrelativedate.relativedate.period|adjustableorrelativedate.relativedate.periodmultiplier|businesscenters.businesscenter.value|relativedate.daterelativeto.externalreference.
- Evidence count: `2`
- Example files:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: relative date fields nested under adjustableOrRelativeDate
  - Representative note: relativeDate fields mapped

### 6.4 Folder-level principles

- Preserve settlement modality: settlementType values in FpML should be carried into CDM settlementTerms without loss.
- Group relative-date metadata: relativedate fields in FpML are mapped into CDM's adjustableOrRelativeDate container rather than scattered top-level fields.
- Resolve and normalize identifiers: instrumentId and exchange references are converted to CDM Security.identifier entries and normalized (exchange codes and identifier schemes normalized where shown).
- Party references become explicit counterparties: payer/receiver party hrefs should be mapped to distinct CDM party entries rather than left as unresolved hrefs.

### 6.5 Variants and exceptions

### Variant VAR-001: Ambiguous party resolution for payer/receiver

- Description: Examples show payer/receiver refs mapped to parties but the mapping to Party1/Party2 or which side becomes CalculationAgentIndependent is unclear.
- Seen in:
  - `correlation-swaps/eqcs-ex01-correlation-swap.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Impact on generalization: Moderate - party resolution logic should be explicit and handle potential swaps or asymmetric roles; avoid assuming ordering without rule.

### Variant VAR-002: Calculation agent mapping inconsistency

- Description: The mapping of calculationAgentPartyReference in FpML to 'CalculationAgentIndependent' in CDM appears repeatedly but lacks clear deterministic rules in examples.
- Seen in:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Impact on generalization: Moderate - implementations should treat mapping of calculationAgentPartyReference as a special-case that may require business rules or external resolution; do not assume always mapped to CalculationAgentIndependent without further confirmation.

### Variant VAR-003: Identifier scheme conversion to BBGID for constituents

- Description: One example shows the first two basket constituents converted to BBGID; this conversion rule is not explained elsewhere.
- Seen in:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
- Impact on generalization: Moderate - treat scheme conversions as conditional; require explicit mapping rules or whitelist before generalizing to all instruments.

### Variant VAR-004: TradeId scheme mismatch between FpML and CDM meta

- Description: Trade identifier scheme differs between the FpML source and the generated CDM meta in at least one example.
- Seen in:
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
- Impact on generalization: Weak-to-moderate - mapping should allow for scheme remapping or retention of original scheme as an alternate identifier; do not assume a single canonical scheme.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: CalculationAgent mapped to CalculationAgentIndependent

- Description: CDM examples present a 'CalculationAgentIndependent' value where FpML references a calculationAgentParty (href); this appears to be an enrichment or defaulting behavior in the transformation.
- Classification: `suspected enrichment`
- Evidence:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Caution:
  - No deterministic rule in examples for when to use CalculationAgentIndependent vs a party-specific agent.
  - Downstream consumers should not assume the original FpML href semantics are preserved without additional resolution.

### Enrichment ENR-002: Relative date fields mapped into adjustableOrRelativeDate structure

- Description: RelativeDate elements from FpML (including business day conventions, day type, period and multiplier, and business center references) are nested under an adjustableOrRelativeDate wrapper in the CDM, and references are converted to CDM externalReference form where applicable. CDM models use adjustableOrRelativeDate as a single canonical container for relative-date metadata; mapping groups all related relative-date fields under that wrapper.
- Classification: `suspected enrichment`
- Evidence:
  - `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml`
  - `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml`
- Caution:
  - Only observed in two confirmation examples; other variants of relativedate in the folder may require additional handling.
  - Mapping of href-based references to externalReference requires resolution logic (not demonstrated in all examples).
  - Do not treat Relative date fields mapped into adjustableOrRelativeDate structure as a guaranteed direct mapping rule yet.

### Enrichment ENR-003: priceQuantity.address and quantity-1 usage

- Description: CDM contains a priceQuantity.address value 'quantity-1' that is not directly traced to an obvious FpML field in the examples; likely an internal addressing/enrichment convention.
- Classification: `suspected enrichment`
- Evidence:
  - `correlation-swaps/eqcs-ex01-correlation-swap.xml`
- Caution:
  - Treat such addressing values as CDM-side artifacts; do not assume they map to an explicit FpML element without specification.
  - If addressing is significant, include mapping metadata or generation rules to preserve traceability.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 4/4 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 4/4 successful or salvaged pair analyses (4 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: header, party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- correlationswap.correlationleg.settlementtype -> performancepayout.settlementterms.settlementtype: Settlement type values (e.g., Cash) are consistently copied from the correlation leg settlementType in the FpML into the CDM performance payout settlementTerms.settlementType.
- Settlement terms repeatedly map from correlationswap.correlationleg.settlementtype into performancepayout.settlementterms.settlementtype. [tentative 3 examples]
- Settlement terms repeatedly map from relativedate.businesscenters.businesscenter|relativedate.daterelativeto.href|settlementdate.relativedate.businessdayconvention|settlementdate.relativedate.daytype|settlementdate.relativedate.period|settlementdate.relativedate.periodmultiplier into adjustableorrelativedate.relativedate.businessdayconvention|adjustableorrelativedate.relativedate.daytype|adjustableorrelativedate.relativedate.period|adjustableorrelativedate.relativedate.periodmultiplier|businesscenters.businesscenter.value|relativedate.daterelativeto.externalreference. [tentative 2 examples]

### Transformation Patterns

- normalization: Instrument identifiers and exchange codes from FpML are normalized when mapped into CDM Security.identifier or exchange fields (examples include mapping NYSE -> XNYS and converting some instrumentId schemes to BBGID).
- split: FpML party references (payerPartyReference, receiverPartyReference and similar) are transformed into separate counterparty/party entries in the CDM trade (e.g., Party1/Party2 or payer/receiver fields).
- merge: Notional amount and currency from FpML are placed into the CDM tradeLot.quantity structure.
- nesting change: Individual relativeDate elements from FpML are re-grouped under an adjustableOrRelativeDate wrapper and tied to business center and daterelativeto references in CDM.

### Product-Specific Branches

### eqcs-ex01-correlation-swap.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - payerPartyReference -> payer
  - receiverPartyReference -> receiver
  - relativeDate fields mapped to CDM relativeDate
  - instrumentId -> security identifier value
- Cautions:
  - How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
  - Where is priceQuantity.address 'quantity-1' derived from in CDM?

### eqcs-ex02-correlation-swap-confirmation.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - settlement type preserved
  - relative date fields nested under adjustableOrRelativeDate
  - basket securities mapped to Security structures
- Cautions:
  - Why were instrumentId schemes converted to BBGID for first two constituents?
  - How was calculationAgentParty 'CalculationAgentIndependent' derived from href gh4903?

### eqcs-ex03-correlation-swap-confirmation.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - settlement type copied
  - relative date fields mapped
  - instrumentId -> Security.identifier.value
  - notional amount and currency mapped
- Cautions:
  - tradeId scheme differs between FpML and CDM meta
  - is CalculationAgent mapped as 'CalculationAgentIndependent' for both parties?

### eqcs-ex04-correlation-swap-confirmation.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - Cash settlement mapped
  - relativeDate fields mapped
  - observation start date mapped
  - notional moved into tradeLot.quantity
- Cautions:
  - How are payer/receiver party refs resolved to Party1/Party2?
  - Why CDM uses 'CalculationAgentIndependent' for calculationAgentPartyReference?

### Validation Checks

- Check unresolved question: How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
- Check unresolved question: Where is priceQuantity.address 'quantity-1' derived from in CDM?
- Check unresolved question: Why were instrumentId schemes converted to BBGID for first two constituents?
- Check unresolved question: How was calculationAgentParty 'CalculationAgentIndependent' derived from href gh4903?
- Check unresolved question: TradeId scheme differs between FpML and CDM meta - what is the intended canonical scheme?
- Check unresolved question: Is CalculationAgent mapped as 'CalculationAgentIndependent' for both counterparties or only select roles?

### Do Not Assume

- Do not treat CalculationAgent mapped to CalculationAgentIndependent as a guaranteed direct mapping rule yet.
- Do not treat Relative date fields mapped into adjustableOrRelativeDate structure as a guaranteed direct mapping rule yet.
- Do not treat priceQuantity.address and quantity-1 usage as a guaranteed direct mapping rule yet.
- How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
- Where is priceQuantity.address 'quantity-1' derived from in CDM?
- Why were instrumentId schemes converted to BBGID for first two constituents?

## 8. Pair-Level Worked Examples

### `correlation-swaps/eqcs-ex01-correlation-swap.xml` -> `correlation-swaps/eqcs-ex01-correlation-swap.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - payerPartyReference -> payer
  - receiverPartyReference -> receiver
  - relativeDate fields mapped to CDM relativeDate
  - instrumentId -> security identifier value
- Most important transformation:
  - normalize exchange codes (NYSE->XNYS)
- Uncertainty:
  - How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
  - Where is priceQuantity.address 'quantity-1' derived from in CDM?

### `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml` -> `correlation-swaps/eqcs-ex02-correlation-swap-confirmation.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - settlement type preserved
  - relative date fields nested under adjustableOrRelativeDate
  - basket securities mapped to Security structures
- Most important transformation:
  - identifier scheme and exchange codes normalized (e.g. NYSE->XNYS)
- Uncertainty:
  - Why were instrumentId schemes converted to BBGID for first two constituents?
  - How was calculationAgentParty 'CalculationAgentIndependent' derived from href gh4903?

### `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml` -> `correlation-swaps/eqcs-ex03-correlation-swap-confirmation.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - settlement type copied
  - relative date fields mapped
  - instrumentId -> Security.identifier.value
  - notional amount and currency mapped
- Most important transformation:
  - party refs split into counterparty entries
- Uncertainty:
  - tradeId scheme differs between FpML and CDM meta
  - is CalculationAgent mapped as 'CalculationAgentIndependent' for both parties?

### `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.xml` -> `correlation-swaps/eqcs-ex04-correlation-swap-confirmation.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - Cash settlement mapped
  - relativeDate fields mapped
  - observation start date mapped
  - notional moved into tradeLot.quantity
- Most important transformation:
  - instrumentId and description become ISIN and Name identifiers
- Uncertainty:
  - How are payer/receiver party refs resolved to Party1/Party2?
  - Why CDM uses 'CalculationAgentIndependent' for calculationAgentPartyReference?

## 9. Open Questions And Risks

- How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
- Where is priceQuantity.address 'quantity-1' derived from in CDM?
- Why were instrumentId schemes converted to BBGID for first two constituents?
- How was calculationAgentParty 'CalculationAgentIndependent' derived from href gh4903?
- TradeId scheme differs between FpML and CDM meta - what is the intended canonical scheme?
- Is CalculationAgent mapped as 'CalculationAgentIndependent' for both counterparties or only select roles?
- How are payer/receiver party refs resolved deterministically to Party1/Party2?
- Why does CDM use 'CalculationAgentIndependent' for calculationAgentPartyReference in these examples?

## 10. Draft Conclusion

- Most reusable findings:
  - Settlement type values are preserved from FpML correlation leg into CDM performance payout settlementTerms.
  - Relative-date metadata in FpML is grouped under CDM adjustableOrRelativeDate.
  - Instrument identifiers and exchange codes are normalized into CDM Security.identifier and exchange representations.
  - FpML party hrefs are expanded into explicit CDM counterparties (payer/receiver → party entries).
- What seems safe to generalize:
  - Mapping settlementType to CDM settlementTerms.settlementType (strong support).
  - Grouping relativedate fields under adjustableOrRelativeDate (moderate support).
  - Converting instrumentId and exchange codes into Security.identifier with normalization (observed repeatedly).
- What should remain tentative:
  - Mapping of calculationAgentPartyReference to CalculationAgentIndependent (insufficient deterministic detail).
  - Why some instrumentId schemes are converted to BBGID while others are not (unclear conditional rule).
  - Origin and intended semantics of CDM addressing artifacts such as priceQuantity.address 'quantity-1'.
  - Exact deterministic rules for resolving payer/receiver hrefs into Party1/Party2 and which party becomes calculation agent.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `4`
- Successful semantic pair count: `4`
- Full semantic pair count: `4`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `0`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 4
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 4
  - Tentative repeated semantic signals: 2
