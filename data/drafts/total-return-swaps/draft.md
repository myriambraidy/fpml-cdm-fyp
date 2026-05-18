# Agent Mapping Playbook: total-return-swaps

## 1. Scope

- Folder: `total-return-swaps`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-26`
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

- `total-return-swaps/trs-ex01-equity-basket.xml` -> `total-return-swaps/trs-ex01-equity-basket.json` (`exact`)
- `total-return-swaps/trs-ex02-single-equity.xml` -> `total-return-swaps/trs-ex02-single-equity.json` (`exact`)
- `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml` -> `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.json` (`exact`)

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

- `party` appears in `3/3` examples
- `trade` appears in `3/3` examples

### 5.3 Repeated nested structures

- trade > returnSwap (153 paths)
- trade > tradeHeader (6 paths)
- trade > collateral (5 paths)
- party > partyId (2 paths)
- party > partyName (2 paths)
- trade > returnSwap (141 paths)
- trade > returnSwap (132 paths)
- trade > documentation (5 paths)

### 5.4 Optional but common FpML sections

- `header` appears in `1/3` examples

### 5.5 Repeated CDM top-level sections

- `meta` appears in `3/3` examples
- `trade` appears in `3/3` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (130 paths)
- trade > tradeLot (84 paths)
- trade > tradeIdentifier (21 paths)
- trade > party (17 paths)
- trade > counterparty (7 paths)
- trade > tradeDate (3 paths)
- meta > globalKey (1 paths)
- trade > adjustment (1 paths)

### 5.7 Optional but common CDM sections

- None observed.

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule RULE-001: Equity instrument id/description -> Security identifiers

- Strength: `moderate recurring pattern`
- Evidence count: `3` examples
- Source pattern: `instrumentId / instrument description (FpML trade instrument sections)`
- Target pattern: `security identifier entries (CDM security/observable identifiers)`
- Explanation: Equity instruments in the FpML examples are consistently represented as security/observable identifiers in CDM.
- Why it seems to work this way: Equity product identity is expressed in CDM via security/observable identifier structures; instrument id and description from FpML are used to populate those fields.
- Example files:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex02-single-equity.xml`
  - `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml`
- Caveats:
  - Normalization of identifier namespaces (e.g., exchange codes) occurs in some examples - see exchange-code normalization caveat.
  - Mapping may combine id + descriptive text to populate multiple CDM identifier fields.

### Rule RULE-002: Exchange identifier normalization (FpML exchangeId -> CDM exchange.code)

- Strength: `moderate recurring pattern`
- Evidence count: `3` examples
- Source pattern: `FpML exchangeId values (e.g., 'NASDAQ', 'Milan Stock Exchange')`
- Target pattern: `CDM exchange.code normalized values (e.g., 'XNAS', 'XMIL')`
- Explanation: Exchange identifiers present in FpML are mapped to canonical exchange codes in CDM in multiple examples.
- Why it seems to work this way: Target model uses standardized exchange codes; examples show FpML exchange names/ids translated to a different code space in CDM.
- Example files:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex02-single-equity.xml`
  - `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml`
- Caveats:
  - The precise mapping table or rationale is not present in examples - open questions remain about mapping rules (e.g., 'NASDAQ' -> 'XNAS').
  - Normalization may be context-dependent (local exchange names vs. global codes).

### Rule RULE-003: tradeId -> tradeIdentifier.assignedIdentifier

- Strength: `moderate recurring pattern`
- Evidence count: `2` examples
- Source pattern: `tradeheader.partytradeidentifier.tradeid (FpML)`
- Target pattern: `tradeIdentifier.assignedIdentifier.identifier.value (CDM)`
- Explanation: FpML tradeId values are carried into CDM assignedIdentifier entries repeatedly in multiple examples.
- Why it seems to work this way: Trade-level identifier preservation is required for traceability; examples show a direct mapping from FpML tradeId to CDM assignedIdentifier.
- Example files:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex02-single-equity.xml`
- Caveats:
  - Some CDM outputs show duplicate tradeIdentifier entries; deduplication rules are not provided and should be verified.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Remove timezone suffix from date strings

- Type: `normalization`
- Description: Date/time strings in FpML that include timezone offsets are normalized by removing the timezone suffix when populating CDM date fields.
- Source side: `FpML unadjusted/adjusted dates with timezone offsets`
- Target side: `CDM date strings without timezone offset`
- Evidence count: `3`
- Example files:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex02-single-equity.xml`
  - `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml`
- Notes:
  - Described explicitly as an important transformation in multiple pair highlights.
  - Consider canonicalization of date format as a deterministic step prior to CDM population.

### Transformation TR-002: Dividend and performance terms mapping

- Type: `normalization`
- Description: Dividend-related fields and performance payout roles from FpML are translated into CDM dividend/performance payout structures.
- Source side: `FpML dividend terms, payout role references`
- Target side: `CDM dividend terms, PerformancePayout structures`
- Evidence count: `2`
- Example files:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml`
- Notes:
  - Mapping occurs in examples but role directionality/party mapping shows inconsistencies in at least one example - treat role mapping carefully.

### 6.3 Tentative and emerging signals

### TENT-001: enrichment

- Strength: `moderate recurring pattern`
- Description: Generated identifiers or defaults repeatedly appear under partyid.identifier.value.
- Evidence count: `2`
- Example files:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex02-single-equity.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: LEI values added in CDM not in FpML
  - Confidence mix includes high.

### TENT-002: mapping

- Strength: `moderate recurring pattern`
- Description: Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.
- Evidence count: `2`
- Example files:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex02-single-equity.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: FpML tradeId -> CDM tradeIdentifier.assignedIdentifier
  - Confidence mix includes medium.
  - Representative note: tradeId -> assignedIdentifier

### 6.4 Folder-level principles

- Preserve FpML trade identifier values by mapping tradeId -> CDM tradeIdentifier.assignedIdentifier for traceability.
- Normalize date/time strings by removing timezone offsets when populating CDM date fields.
- Map FpML equity instrument identifiers and descriptions to CDM security/observable identifier structures.
- Normalize FpML exchange identifiers to canonical exchange.code values in CDM (mapping table not provided by examples).
- Party identifier fields in CDM may include generated or default identifiers (e.g., LEI) not present in FpML; treat these as likely enrichment.

### 6.5 Variants and exceptions

### Variant VAR-001: Duplicate tradeIdentifier entries in CDM

- Description: Some CDM outputs contain duplicate tradeIdentifier entries for the same FpML tradeId.
- Seen in:
  - `total-return-swaps/trs-ex02-single-equity.xml`
- Impact on generalization: Introduces ambiguity for deduplication logic; consumers should not assume a 1:1 mapping without additional deduplication or identity rules.

### Variant VAR-002: PerformancePayout payer/receiver direction mismatch

- Description: In at least one example, CDM PerformancePayout payer/receiver roles appear inverted relative to FpML payerPartyReference.
- Seen in:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
- Impact on generalization: Role mapping for payouts may require explicit verification per trade; do not assume party reference semantics are identical between FpML and CDM without confirmation.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: Party identifiers enriched with generated/default identifiers (e.g., LEI)

- Description: CDM party identifier elements often include generated or default identifier values that are not present in the source FpML (example: LEI values added).
- Classification: `suspected enrichment`
- Evidence:
  - `total-return-swaps/trs-ex01-equity-basket.xml`
  - `total-return-swaps/trs-ex02-single-equity.xml`
- Caution:
  - Treat added identifiers as enrichment rather than source-canonical; do not assume they exist in FpML.
  - Verify whether enrichment is deterministic for all parties or applied selectively.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 3/3 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 3/3 successful or salvaged pair analyses (3 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- instrumentId / instrument description (FpML trade instrument sections) -> security identifier entries (CDM security/observable identifiers): Equity instruments in the FpML examples are consistently represented as security/observable identifiers in CDM.
- FpML exchangeId values (e.g., 'NASDAQ', 'Milan Stock Exchange') -> CDM exchange.code normalized values (e.g., 'XNAS', 'XMIL'): Exchange identifiers present in FpML are mapped to canonical exchange codes in CDM in multiple examples.
- tradeheader.partytradeidentifier.tradeid (FpML) -> tradeIdentifier.assignedIdentifier.identifier.value (CDM): FpML tradeId values are carried into CDM assignedIdentifier entries repeatedly in multiple examples.
- Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value. [tentative 2 examples]

### Transformation Patterns

- normalization: Date/time strings in FpML that include timezone offsets are normalized by removing the timezone suffix when populating CDM date fields.
- normalization: Dividend-related fields and performance payout roles from FpML are translated into CDM dividend/performance payout structures.

### Product-Specific Branches

### trs-ex01-equity-basket.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - FpML tradeId -> CDM tradeIdentifier.assignedIdentifier
  - Unadjusted date copied, timezone removed
  - Equity instrumentId and description -> Security identifiers
- Cautions:
  - Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
  - CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference

### trs-ex02-single-equity.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - product type value
  - date normalized
  - equity id -> security identifier
  - tradeId -> assignedIdentifier
- Cautions:
  - Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
  - Why does CDM contain duplicate tradeIdentifier entries?

### trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - effective date relative fields mapped
  - termination relative-date fields mapped
  - instrument id and units mapped to observable and quantity
  - dividend terms mapped
- Cautions:
  - Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?

### Validation Checks

- Check unresolved question: Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
- Check unresolved question: CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference
- Check unresolved question: Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
- Check unresolved question: Why does CDM contain duplicate tradeIdentifier entries?
- Check unresolved question: Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?
- Check enrichment/default behavior: CDM party identifier elements often include generated or default identifier values that are not present in the source FpML (example: LEI values added).

### Do Not Assume

- Do not treat Party identifiers enriched with generated/default identifiers (e.g., LEI) as a guaranteed direct mapping rule yet.
- Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
- CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference
- Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
- Why does CDM contain duplicate tradeIdentifier entries?
- Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?

## 8. Pair-Level Worked Examples

### `total-return-swaps/trs-ex01-equity-basket.xml` -> `total-return-swaps/trs-ex01-equity-basket.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML tradeId -> CDM tradeIdentifier.assignedIdentifier
  - Unadjusted date copied, timezone removed
  - Equity instrumentId and description -> Security identifiers
- Most important transformation:
  - Remove timezone offset from date string
- Uncertainty:
  - Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
  - CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference

### `total-return-swaps/trs-ex02-single-equity.xml` -> `total-return-swaps/trs-ex02-single-equity.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - product type value
  - date normalized
  - equity id -> security identifier
  - tradeId -> assignedIdentifier
- Most important transformation:
  - remove timezone suffix from dates
- Uncertainty:
  - Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
  - Why does CDM contain duplicate tradeIdentifier entries?

### `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml` -> `total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective date relative fields mapped
  - termination relative-date fields mapped
  - instrument id and units mapped to observable and quantity
  - dividend terms mapped
- Most important transformation:
  - exchange code normalized (NASDAQ -> XNAS)
- Uncertainty:
  - Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?

## 9. Open Questions And Risks

- Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
- CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference
- Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
- Why does CDM contain duplicate tradeIdentifier entries?
- Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?

## 10. Draft Conclusion

- Most reusable findings:
  - Trade identifier preservation: map FpML tradeId -> CDM tradeIdentifier.assignedIdentifier.
  - Date normalization: remove timezone suffixes from FpML date strings when populating CDM.
  - Equity instruments become CDM security/observable identifiers; instrument id/description are primary inputs for those identifiers.
  - Exchange identifiers are normalized to a canonical code in CDM; mapping must be verified against a code table.
- What seems safe to generalize:
  - Apply tradeId -> assignedIdentifier mapping as a default rule.
  - Normalize/remove timezone information from date strings before CDM assignment.
  - Populate CDM security/observable identifier fields from FpML instrument id/description.
- What should remain tentative:
  - Rationale and mapping rules for exchange code normalization (e.g., NASDAQ -> XNAS, Milan Stock Exchange -> XMIL).
  - Handling and deduplication of duplicate tradeIdentifier entries in CDM.
  - Exact semantics for PerformancePayout party role mapping where examples show inversion.
  - Whether party identifier LEI additions are always applied or conditional enrichment.

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
