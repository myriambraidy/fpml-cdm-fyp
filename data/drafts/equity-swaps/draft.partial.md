# Agent Mapping Playbook: equity-swaps

## 1. Scope

- Folder: `equity-swaps`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-23`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `19`
- Matched pairs selected: `18`
- Structural evidence basis: `18/18` matched pairs
- Semantic evidence basis: `18/18` pair analyses
- Full semantic analyses: `18`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `0`
- Missing counterparts: `1`
- Ignored pairs: `0`
- Exact matches: `17`
- Normalized matches: `0`
- Alias matches: `1`
- Structural basis note: Structural summaries are computed from all 18/18 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 18/18 successful or salvaged pair analyses (18 full, 0 salvaged).

## 3. Included Examples

- `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml` -> `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.json` (`exact`)
- `equity-swaps/eqs-ex03-index-quanto-long-form.xml` -> `equity-swaps/eqs-ex03-index-quanto-long-form.json` (`exact`)
- `equity-swaps/eqs-ex04-zero-strike-long-form.xml` -> `equity-swaps/eqs-ex04-zero-strike-long-form.json` (`exact`)
- `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml` -> `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.json` (`exact`)
- `equity-swaps/eqs-ex06-single-index-long-form.xml` -> `equity-swaps/eqs-ex06-single-index-long-form.json` (`exact`)
- `equity-swaps/eqs-ex07-long-form-with-stub.xml` -> `equity-swaps/eqs-ex07-long-form-with-stub.json` (`exact`)
- `equity-swaps/eqs-ex08-composite-basket-long-form-separate-spreads.xml` -> `equity-swaps/eqs-ex08-composite-basket-long-form-separate-spreads.json` (`exact`)
- `equity-swaps/eqs-ex09-compounding-swap.xml` -> `equity-swaps/eqs-ex09-compounding-swap.json` (`exact`)
- `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml` -> `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.json` (`exact`)
- `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml` -> `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.json` (`alias`)
- `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml` -> `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.json` (`exact`)
- `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.json` (`exact`)
- `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.json` (`exact`)
- `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.json` (`exact`)
- `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.json` (`exact`)
- `equity-swaps/eqs-ex17-cfd.xml` -> `equity-swaps/eqs-ex17-cfd.json` (`exact`)
- `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml` -> `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.json` (`exact`)
- `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.xml` -> `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- equity-swaps/eqs-ex02-composite-basket-long-form.xml

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/header/conversationId
- /FpML/header/messageId
- /FpML/header/sentBy
- /FpML/header/sendTo
- /FpML/header/creationTimestamp
- /FpML/trade/tradeHeader/partyTradeIdentifier
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId

### 5.2 Repeated top-level sections

- `party` appears in `18/18` examples
- `trade` appears in `18/18` examples
- `header` appears in `14/18` examples

### 5.3 Repeated nested structures

- trade > returnSwap (116 paths)
- trade > tradeHeader (6 paths)
- trade > documentation (5 paths)
- party > partyId (2 paths)
- header > conversationId (1 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `18/18` examples
- `trade` appears in `18/18` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (145 paths)
- trade > tradeLot (63 paths)
- trade > contractDetails (22 paths)
- trade > tradeIdentifier (21 paths)
- trade > party (13 paths)
- trade > counterparty (7 paths)
- trade > ancillaryParty (5 paths)
- trade > tradeDate (3 paths)

### 5.7 Optional but common CDM sections

- `transferHistory` appears in `1/18` examples

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule RULE-001: Effective / relative dates -> CDM effectiveDate fields

- Strength: `moderate recurring pattern`
- Evidence count: `8` examples
- Source pattern: `FpML effective/relative date nodes (e.g., effectivedate.adjustabledate.unadjusteddate, interest effective date variants)`
- Target pattern: `CDM trade.economicTerms.effectivedate.adjustableDate.unadjustedDate (ISO date string)`
- Explanation: Multiple examples copy or normalize FpML effective and relative date values into the CDM effectiveDate unadjusted-date fields (often after minimal string normalization).
- Why it seems to work this way: Effective and relative dates are canonical trade-level attributes in both models; mapping preserves the unadjusted date semantics while normalizing formatting.
- Example files:
  - `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml`
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex17-cfd.xml`
  - `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml`
  - `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.xml`
- Caveats:
  - Date strings are often normalized (e.g., trimming trailing 'Z'); source timezone semantics may be lost.
  - Which specific FpML date node maps to product.economicTerms.effectiveDate can vary by file.

### Rule RULE-002: Notional amount + currency -> CDM quantity and unit

- Strength: `moderate recurring pattern`
- Evidence count: `3` examples
- Source pattern: `FpML economicTerms.notional.notionalAmount (amount + currency)`
- Target pattern: `CDM product.economicTerms.notional -> quantity.value.value and quantity.unit.currency (CDM Quantity structure)`
- Explanation: Notional amount and its currency in FpML are consistently mapped into a CDM quantity structure (value + currency/unit).
- Why it seems to work this way: CDM represents trade sizes and notionals as Quantity objects; mapping preserves numeric value and currency semantics by placing them into CDM quantity fields.
- Example files:
  - `equity-swaps/eqs-ex06-single-index-long-form.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml`
- Caveats:
  - Some examples also copy the notional id into externalKey or meta fields - mapping of identifiers is not uniform.
  - Currency may be represented in CDM as a unit.currency field; confirm exact CDM path expected by consumer.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Normalize multiple FpML date variants into CDM effective/trade date nodes

- Type: `normalization`
- Description: Various FpML date-like nodes (effective, termination, interest effective, interim unadjusted dates) are normalized and placed into the corresponding CDM date fields.
- Source side: `FpML effective/termination/interest and relative date nodes`
- Target side: `CDM effectiveDate, terminationDate, tradeDate fields (unadjustedDate value)`
- Evidence count: `8`
- Example files:
  - `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml`
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
- Notes:
  - Normalization includes formatting changes and selection of the unadjusted date element when multiple date forms exist.
  - The exact mapping (which FpML node -> which CDM date field) can vary by example; treat as a canonicalization pattern rather than fixed XPath translation.

### Transformation TR-002: Resolve href party references to CDM role labels

- Type: `reference resolution`
- Description: FpML href attributes referencing parties are converted to CDM role labels (e.g., 'Party1', 'Party2') and then used as payer/receiver or counterparty references.
- Source side: `FpML partyReference href values (in interestLeg and other nodes)`
- Target side: `CDM payer/receiver or counterparty fields containing resolved role labels`
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
- Notes:
  - Mapping sometimes inverts roles (payer -> receiver) depending on leg semantics; verify per-leg direction.
  - Resolution may map party hrefs to abstract labels rather than preserving original party ids.

### Transformation TR-003: Trim trailing 'Z' timezone from date strings

- Type: `normalization`
- Description: Date/time strings with a trailing 'Z' are normalized to plain ISO date strings (trailing 'Z' removed) before placement into CDM date fields.
- Source side: `FpML date/time strings sometimes include timezone 'Z' suffix`
- Target side: `CDM date fields use trimmed ISO date strings without trailing 'Z'`
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml`
  - `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.xml`
- Notes:
  - Representative notes explicitly mention stripping trailing 'Z' during normalization.
  - Applies primarily to effective and trade date fields; confirm if time components should be preserved or dropped.

### 6.3 Tentative and emerging signals

### TENT-001: mapping

- Strength: `moderate recurring pattern`
- Description: Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.
- Evidence count: `8`
- Example files:
  - `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml`
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex17-cfd.xml`
  - `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml`
  - `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: effective date unadjusted
  - Representative note: interest effective date
  - Representative note: effective date copied

### TENT-002: mapping

- Strength: `moderate recurring pattern`
- Description: Economic terms repeatedly reshape from notional.notionalamount.amount|notional.notionalamount.currency into quantity.value.value|unit.currency.value.
- Evidence count: `3`
- Example files:
  - `equity-swaps/eqs-ex06-single-index-long-form.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Notional amount and currency mapped
  - Representative note: notional amount and currency mapped to CDM quantity
  - Representative note: notional amount and currency mapped to quantity

### TENT-003: mapping

- Strength: `moderate recurring pattern`
- Description: Date-like fields repeatedly normalize from trade.tradeheader.tradedate into trade.tradedate.value.
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: trade date
  - Confidence mix includes medium.
  - Representative note: trade date mapped and formatted

### TENT-004: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml`
  - `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: strip trailing 'Z' timezone
  - Representative note: removed trailing 'Z' from date string

### TENT-005: mapping

- Strength: `moderate recurring pattern`
- Description: Observed FpML trade date values are mapped into the CDM trade.tradeDate.value field after formatting. (FpML trade.tradeHeader.tradeDate or trade.tradeheader.tradedate nodes -> CDM trade.tradeDate.value (ISO date string))
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml`
- Notes:
  - Trade date is a primary trade identifier/timestamp in both representations; mapping places it in the CDM tradeDate value for downstream consumers.
  - Formatting/normalization (e.g., removing trailing 'Z') is applied in some files; ensure consistent ISO representation.

### TENT-006: mapping

- Strength: `moderate recurring pattern`
- Description: Party hrefs in FpML are resolved and mapped to CDM role labels (e.g., Party1/Party2) for payer/receiver fields. (FpML party references in interestLeg/payerPartyReference or other href attributes -> CDM interestratepayout.payerReceiver.payer (party label) and receiver role labels)
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
- Notes:
  - CDM encodes counterparty roles explicitly; resolving FpML hrefs to role labels allows representation of payer/receiver without embedding raw hrefs.
  - Role inversion is observed in some mappings (FpML interestLeg payer -> CDM receiver); confirm intended direction per product.
  - Resolution sometimes produces abstract labels (Party1) rather than original party ids.

### TENT-007: transformation

- Strength: `moderate recurring pattern`
- Description: Reference resolution repeatedly converts equityswaptransactionsupplement.interestleg.payerpartyreference into interestratepayout.payerreceiver.payer.
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: href -> Party label
  - Representative note: party href mapped to role label (partyA -> Party1)

### TENT-008: mapping

- Strength: `moderate recurring pattern`
- Description: Trade identifiers repeatedly map from partytradeidentifier.versionedtradeid.tradeid into assignedidentifier.identifier.value.
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: party1 tradeId -> first tradeIdentifier value
  - Representative note: party tradeId mapped to assignedIdentifier

### 6.4 Folder-level principles

- Canonical date handling: trim and normalize FpML date strings (remove trailing 'Z') and place unadjusted date values into CDM effective/trade/termination date fields.
- Economic quantities: FpML notional amounts (value + currency) are represented as CDM Quantity objects (value + unit/currency).
- Party identity resolution: FpML href-based party references are resolved to CDM role labels (Party1/Party2) and used for payer/receiver or counterparty fields; mapping direction may invert for some payout legs.
- Identifiers: party-supplied trade identifiers are promoted into CDM assignedIdentifier entries; source ordering or deduplication rules are not uniform across examples.
- Minimal enrichment: where FpML lacks an explicit CDM field mapping (e.g., calculationAgent), CDM values are sometimes set to default or abstract roles rather than direct party links.

### 6.5 Variants and exceptions

### Variant VAR-001: calculationAgent defaulting/abstraction

- Description: Several examples set CDM calculationAgent or calculationAgentParty to an abstract/default value (e.g., 'CalculationAgentIndependent') instead of directly referencing the FpML party reference.
- Seen in:
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
- Impact on generalization: Mapping cannot assume that FpML calculationAgentPartyReference will always map to a CDM party reference; treat calculationAgent as a field that may be defaulted or abstracted.

### Variant VAR-002: Exchange / venue normalization inconsistent

- Description: Exchange identifiers are normalized to short codes or X-prefixed values in CDM in several examples, but the normalization rules are not consistent or documented.
- Seen in:
  - `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml`
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex06-single-index-long-form.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
- Impact on generalization: Exchange id mappings require a normalization table or look-up; cannot be inferred deterministically from examples alone.

### Variant VAR-003: party role inversion for payout mapping

- Description: In some mappings the FpML payer/receiver semantics are inverted when placed into CDM payer/receiver fields (observed for interest legs/payouts).
- Seen in:
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
- Impact on generalization: Do not assume a one-to-one directional mapping of FpML leg payer->CDM payer; validate mapping direction per leg type.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: CalculationAgent set to CalculationAgentIndependent

- Description: CDM calculationAgent fields are sometimes set to an abstract/default value rather than a resolved party reference.
- Classification: `suspected enrichment`
- Evidence:
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
- Caution:
  - Treat values like 'CalculationAgentIndependent' as mapping decisions or defaults; do not assume they reflect direct FpML party text without confirmation.

### Enrichment ENR-002: Party trade identifiers -> CDM assignedIdentifier

- Description: Per-file party trade identifiers are mapped into CDM assignedIdentifier entries (typically the first tradeIdentifier element). Assigned identifiers in CDM provide canonical trade identifiers; party-specific trade ids are converted into these assignedIdentifier slots.
- Classification: `suspected enrichment`
- Evidence:
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
- Caution:
  - Some CDs show duplicate assignedIdentifier entries for the same id across examples - dedupe behavior is unclear.
  - Mapping order (which party's id becomes primary) is not always explicit in source files.
  - Do not treat Party trade identifiers -> CDM assignedIdentifier as a guaranteed direct mapping rule yet.

### Enrichment ENR-003: Duplicate assignedIdentifier entries observed

- Description: Some CDM outputs contain duplicated assignedIdentifier entries for the same id value.
- Classification: `unclear`
- Evidence:
  - `Representative examples and open questions (files not always named explicitly)`
- Caution:
  - Duplication may come from mapping multiple party trade ids into assignedIdentifier without deduplication; confirm intended dedupe behavior.

### Enrichment ENR-004: Id attributes copied to CDM meta.externalKey

- Description: In at least one example an FpML id attribute is used as an externalKey in the CDM meta section.
- Classification: `suspected enrichment`
- Evidence:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
- Caution:
  - This behavior is example-specific; do not assume every FpML id will be promoted to externalKey without explicit mapping rules.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 18/18 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 18/18 successful or salvaged pair analyses (18 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: party, trade, header.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- FpML effective/relative date nodes (e.g., effectivedate.adjustabledate.unadjusteddate, interest effective date variants) -> CDM trade.economicTerms.effectivedate.adjustableDate.unadjustedDate (ISO date string): Multiple examples copy or normalize FpML effective and relative date values into the CDM effectiveDate unadjusted-date fields (often after minimal string normalization).
- FpML economicTerms.notional.notionalAmount (amount + currency) -> CDM product.economicTerms.notional -> quantity.value.value and quantity.unit.currency (CDM Quantity structure): Notional amount and its currency in FpML are consistently mapped into a CDM quantity structure (value + currency/unit).
- Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate. [tentative 8 examples]
- Economic terms repeatedly reshape from notional.notionalamount.amount|notional.notionalamount.currency into quantity.value.value|unit.currency.value. [tentative 3 examples]
- Date-like fields repeatedly normalize from trade.tradeheader.tradedate into trade.tradedate.value. [tentative 2 examples]
- Observed FpML trade date values are mapped into the CDM trade.tradeDate.value field after formatting. (FpML trade.tradeHeader.tradeDate or trade.tradeheader.tradedate nodes -> CDM trade.tradeDate.value (ISO date string)) [tentative 2 examples]

### Transformation Patterns

- normalization: Various FpML date-like nodes (effective, termination, interest effective, interim unadjusted dates) are normalized and placed into the corresponding CDM date fields.
- reference resolution: FpML href attributes referencing parties are converted to CDM role labels (e.g., 'Party1', 'Party2') and then used as payer/receiver or counterparty references.
- normalization: Date/time strings with a trailing 'Z' are normalized to plain ISO date strings (trailing 'Z' removed) before placement into CDM date fields.
- Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate. [tentative 2 examples]
- Reference resolution repeatedly converts equityswaptransactionsupplement.interestleg.payerpartyreference into interestratepayout.payerreceiver.payer. [tentative 2 examples]

### Product-Specific Branches

### eqs-ex01-single-underlyer-execution-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - effective relative date fields mapped
  - openUnits mapped to tradeLot quantity
  - interim unadjusted dates list mapped
  - party tradeIds mapped to tradeIdentifier assignedIdentifier
- Cautions:
  - Why is exchange 'NASDAQ' rendered as 'NASD' in CDM?

### eqs-ex03-index-quanto-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - TradeDate mapped to trade.tradeDate.value
  - EffectiveDate relativeDate fields mapped
  - Basket constituents normalized into CDM Basket Observable
  - Quoted currency pairs and rates mapped to fxRate array
- Cautions:
  - How were exchangeId values transformed to X-prefixed exchange names?
  - Why is calculationAgentParty set to 'CalculationAgentIndependent' instead of party1 reference?

### eqs-ex04-zero-strike-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - Effective date mapped and timezone 'Z' removed
  - Termination periodMultiplier copied
  - Equity instrumentId mapped to observable identifier
- Cautions:
  - FpML exchangeId 'NationalStockExchange' -> CDM exchange 'XNSE' mapping unclear
  - Why CDM contains duplicate assignedIdentifier entries for '1234' and '5678'?

### eqs-ex05-single-stock-plus-fee-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - effective date unadjusted
  - termination relative date fields
  - party href mapped to counterparty externalReference
  - brokerage fee mapped to transferHistory cash transfer
- Cautions:
  - How was calculationAgentParty 'CalculationAgentIndependent' derived from calculationAgentPartyReference party1?

### eqs-ex06-single-index-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - Index id and name mapped
  - Notional amount and currency mapped
  - EffectiveDate relative fields mapped
  - Business centers list mapped
- Cautions:
  - How was 'EuroNext' normalized to 'XPAR' in CDM exchange fields?

### eqs-ex07-long-form-with-stub.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - effectiveDate unadjustedDate, BDC, and externalKey map
  - terminationDate and business centers map
  - partyTradeIdentifier -> tradeIdentifier and assignedIdentifier
- Cautions:
  - How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent' role?

### Validation Checks

- Check unresolved question: Why is exchange 'NASDAQ' rendered as 'NASD' in CDM?
- Check unresolved question: How were exchangeId values transformed to X-prefixed exchange names?
- Check unresolved question: Why is calculationAgentParty set to 'CalculationAgentIndependent' instead of party1 reference?
- Check unresolved question: FpML exchangeId 'NationalStockExchange' -> CDM exchange 'XNSE' mapping unclear
- Check unresolved question: Why CDM contains duplicate assignedIdentifier entries for '1234' and '5678'?
- Check unresolved question: How was calculationAgentParty 'CalculationAgentIndependent' derived from calculationAgentPartyReference party1?

### Do Not Assume

- Do not treat CalculationAgent set to CalculationAgentIndependent as a guaranteed direct mapping rule yet.
- Do not treat Party trade identifiers -> CDM assignedIdentifier as a guaranteed direct mapping rule yet.
- Do not treat Duplicate assignedIdentifier entries observed as a guaranteed direct mapping rule yet.
- Do not treat Id attributes copied to CDM meta.externalKey as a guaranteed direct mapping rule yet.
- Why is exchange 'NASDAQ' rendered as 'NASD' in CDM?
- How were exchangeId values transformed to X-prefixed exchange names?

## 8. Pair-Level Worked Examples

- Showing the top `10` worked examples in markdown; the full `18` remain in the JSON and debug artifacts.
### `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml` -> `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective relative date fields mapped
  - openUnits mapped to tradeLot quantity
  - interim unadjusted dates list mapped
  - party tradeIds mapped to tradeIdentifier assignedIdentifier
- Most important transformation:
  - removed trailing 'Z' from date strings
- Uncertainty:
  - Why is exchange 'NASDAQ' rendered as 'NASD' in CDM?

### `equity-swaps/eqs-ex03-index-quanto-long-form.xml` -> `equity-swaps/eqs-ex03-index-quanto-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - TradeDate mapped to trade.tradeDate.value
  - EffectiveDate relativeDate fields mapped
  - Basket constituents normalized into CDM Basket Observable
  - Quoted currency pairs and rates mapped to fxRate array
- Most important transformation:
  - Trim trailing 'Z' from XML dates to ISO date strings
- Uncertainty:
  - How were exchangeId values transformed to X-prefixed exchange names?
  - Why is calculationAgentParty set to 'CalculationAgentIndependent' instead of party1 reference?

### `equity-swaps/eqs-ex04-zero-strike-long-form.xml` -> `equity-swaps/eqs-ex04-zero-strike-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - Effective date mapped and timezone 'Z' removed
  - Termination periodMultiplier copied
  - Equity instrumentId mapped to observable identifier
- Most important transformation:
  - strip trailing 'Z' from date
- Uncertainty:
  - FpML exchangeId 'NationalStockExchange' -> CDM exchange 'XNSE' mapping unclear
  - Why CDM contains duplicate assignedIdentifier entries for '1234' and '5678'?

### `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml` -> `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - effective date unadjusted
  - termination relative date fields
  - party href mapped to counterparty externalReference
  - brokerage fee mapped to transferHistory cash transfer
- Most important transformation:
  - strip trailing 'Z' timezone
- Uncertainty:
  - How was calculationAgentParty 'CalculationAgentIndependent' derived from calculationAgentPartyReference party1?

### `equity-swaps/eqs-ex06-single-index-long-form.xml` -> `equity-swaps/eqs-ex06-single-index-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - Index id and name mapped
  - Notional amount and currency mapped
  - EffectiveDate relative fields mapped
  - Business centers list mapped
- Most important transformation:
  - Exchange names normalized to short codes
- Uncertainty:
  - How was 'EuroNext' normalized to 'XPAR' in CDM exchange fields?

### `equity-swaps/eqs-ex07-long-form-with-stub.xml` -> `equity-swaps/eqs-ex07-long-form-with-stub.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effectiveDate unadjustedDate, BDC, and externalKey map
  - terminationDate and business centers map
  - partyTradeIdentifier -> tradeIdentifier and assignedIdentifier
- Most important transformation:
  - bond/index wrapped into Asset->Instrument->Security or Index structures
- Uncertainty:
  - How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent' role?

### `equity-swaps/eqs-ex08-composite-basket-long-form-separate-spreads.xml` -> `equity-swaps/eqs-ex08-composite-basket-long-form-separate-spreads.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - relativeDate fields mapped (periodMultiplier, period, dayType, businessDayConvention, dateRelativeTo)
  - instrumentId -> Security.identifier.value with scheme
  - spreadSchedule step -> price.datedValue (date,value)
- Most important transformation:
  - returnSwap split into PerformancePayout and InterestRatePayout
- Uncertainty:
  - Is CalculationAgent 'CalculationAgentIndependent' derived from calculationAgentPartyReference?

### `equity-swaps/eqs-ex09-compounding-swap.xml` -> `equity-swaps/eqs-ex09-compounding-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective unadjusted date copied
  - relative date fields and reference mapped
  - notional amount and currency mapped to quantity; id used as externalKey
  - index id and exchanges copied to observable
- Most important transformation:
  - id attribute becomes externalKey in CDM
- Uncertainty:
  - Where is compoundingSpread (.05) represented in CDM?
  - How were meta.globalKey values generated?

### `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml` -> `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - trade date
  - payer/receiver mapped
  - interest effective date
  - business day conv
- Most important transformation:
  - href -> Party label
- Uncertainty:
  - Which FpML date maps to product.economicTerms.effectiveDate?

### `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml` -> `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - trade date mapped and formatted
  - notional id mapped to externalReference
  - underlyer mapped to observable address but identifier differs
- Most important transformation:
  - multiple unadjustedDates converted to periodicDates structure
- Uncertainty:
  - Why tradeDate values differ between FpML and CDM?
  - Which FpML element produced CDM observable identifier '.GDAXI'?

## 9. Open Questions And Risks

- Why is exchange 'NASDAQ' rendered as 'NASD' in CDM?
- How were exchangeId values transformed to X-prefixed exchange names?
- Why is calculationAgentParty set to 'CalculationAgentIndependent' instead of party1 reference?
- FpML exchangeId 'NationalStockExchange' -> CDM exchange 'XNSE' mapping unclear
- Why CDM contains duplicate assignedIdentifier entries for '1234' and '5678'?
- How was calculationAgentParty 'CalculationAgentIndependent' derived from calculationAgentPartyReference party1?
- How was 'EuroNext' normalized to 'XPAR' in CDM exchange fields?
- How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent' role?

## 10. Draft Conclusion

- Most reusable findings:
  - Dates are consistently normalized and the unadjusted-date elements are used for CDM effective/trade/termination date fields; trailing 'Z' is commonly removed.
  - Notional amount + currency in FpML map to CDM Quantity (value + unit/currency).
  - FpML party hrefs are resolved to CDM role labels and used for payer/receiver and counterparty fields.
  - Party trade identifiers are promoted into CDM assignedIdentifier entries.
- What seems safe to generalize:
  - Trim/normalize FpML date strings (remove trailing 'Z') and map unadjusted-date to CDM effective/trade date fields (strongest evidence).
  - Map FpML notional amount and currency to CDM Quantity value and currency/unit.
- What should remain tentative:
  - Exact exchange/venue normalization rules (e.g., NASDAQ -> NASD or X-prefixed names).
  - How calculationAgent mappings are derived (direct party reference vs. default abstract roles).
  - Dedupe policies for assignedIdentifier when multiple party trade ids exist.
  - Whether FpML id attributes should always become CDM meta.externalKey.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `18`
- Successful semantic pair count: `18`
- Full semantic pair count: `18`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `0`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 18
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 18
  - Tentative repeated semantic signals: 6
