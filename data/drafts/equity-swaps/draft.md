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

### Rule MAP-001: effectiveDate unadjustedDate -> effectiveDate.adjustableDate.unadjustedDate

- Strength: `moderate recurring pattern`
- Evidence count: `7` examples
- Source pattern: `effectivedate.adjustabledate.unadjusteddate (FpML)`
- Target pattern: `effectivedate.adjustabledate.unadjusteddate (CDM)`
- Explanation: Effective dates from FpML unadjustedDate elements are consistently copied into the CDM effectiveDate.adjustableDate.unadjustedDate slots.
- Why it seems to work this way: Preserves the unadjusted effective date semantics; seen in multiple long- and short-form examples.
- Example files:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex17-cfd.xml`
  - `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml`
  - `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.xml`
- Caveats:
  - Date string normalization (timezone trimming) is applied in many examples — see normalization rules.
  - Some examples include additional business center or adjustedDate elements that require separate handling.

### Rule MAP-002: trade.tradeHeader.tradeDate -> trade.tradeDate.value

- Strength: `moderate recurring pattern`
- Evidence count: `3` examples
- Source pattern: `trade.tradeHeader.tradeDate (FpML)`
- Target pattern: `trade.tradeDate.value (CDM)`
- Explanation: Trade header tradeDate entries are normalized/mapped into a single trade.tradedate.value field in the CDM representation.
- Why it seems to work this way: Consolidates trade-level date into the CDM tradeDate slot used by downstream processes.
- Example files:
  - `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
- Caveats:
  - Some mappings show reformatting of the date string (e.g., timezone removal) during the copy.

### Rule MAP-003: notional.notionalAmount.amount|currency -> quantity.value.value|unit.currency.value (tradeLot/priceQuantity)

- Strength: `moderate recurring pattern`
- Evidence count: `3` examples
- Source pattern: `notional.notionalAmount.amount and notional.notionalAmount.currency (FpML)`
- Target pattern: `quantity.value.value and unit.currency.value (CDM tradeLot / priceQuantity)`
- Explanation: Notional amounts from FpML are relocated into CDM quantity/price representations (tradeLot or priceQuantity) preserving numeric value and currency.
- Why it seems to work this way: CDM models notional as trade lot/quantity; mapping retains economic magnitude and currency semantics.
- Example files:
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex06-single-index-long-form.xml`
- Caveats:
  - Some examples resolve equityNotionalAmount references prior to mapping (see representative highlights).

### Rule MAP-004: instrumentId / equity identifier -> Security.identifier / Observable identifier

- Strength: `strong recurring pattern`
- Evidence count: `8` examples
- Source pattern: `equity instrumentId / equity id and exchange (FpML)`
- Target pattern: `Security.identifier or Observable.identifier with exchange metadata (CDM)`
- Explanation: Equity/instrument identifiers present in the FpML trades are consistently mapped into CDM security/observable identifier fields, often preserving id and exchange attributes.
- Why it seems to work this way: CDM requires an observable/security identifier for equity underlyers; mapping ensures the same identifier is available in CDM for pricing and reference.
- Example files:
  - `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml`
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex07-long-form-with-stub.xml`
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex17-cfd.xml`
- Caveats:
  - Exchange identifier normalization (FpML exchangeId -> CDM exchange code) is applied in many examples but the mapping source/rules are not explicit.

### Rule MAP-005: party references -> payer/receiver resolution

- Strength: `moderate recurring pattern`
- Evidence count: `2` examples
- Source pattern: `interestLeg.payerPartyReference / receiverPartyReference (FpML)`
- Target pattern: `interestratepayout.payerReceiver.payer / .receiver (CDM)`
- Explanation: Party hrefs used inside interest/leg structures are resolved to explicit payer/receiver roles in CDM payout structures.
- Why it seems to work this way: CDM requires explicit counterparty role assignment for payout definitions; mapping resolves FpML hrefs to those roles.
- Example files:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml`
- Caveats:
  - Some examples suggest role inversion or ambiguity between Party1/Party2 mapping — verify role derivation logic per trade.

### Rule MAP-006: partyTradeIdentifier.versionedTradeId.tradeId -> assignedIdentifier.identifier.value

- Strength: `moderate recurring pattern`
- Evidence count: `2` examples
- Source pattern: `partyTradeIdentifier.versionedTradeId.tradeId (FpML)`
- Target pattern: `assignedIdentifier.identifier.value (CDM)`
- Explanation: FpML trade identifiers are placed into CDM assignedIdentifier structures to record the trade's id value.
- Why it seems to work this way: CDM uses assignedIdentifier to represent external trade ids; mapping copies the FpML tradeId into this slot.
- Example files:
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
- Caveats:
  - The provenance of other meta/globalKey fields derived from FpML is not explicit and may be enriched post-mapping.

### 6.2 Repeated non-literal transformations

### Transformation XFRM-001: Strip trailing 'Z' timezone and normalize date format to YYYY-MM-DD

- Type: `normalization`
- Description: Date strings with trailing 'Z' timezone are trimmed and reformatted to a normalized YYYY-MM-DD representation in the CDM.
- Source side: `FpML date strings (often with trailing 'Z')`
- Target side: `CDM date strings normalized to YYYY-MM-DD`
- Evidence count: `5`
- Example files:
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex07-long-form-with-stub.xml`
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
- Notes:
  - Representative notes: 'strip trailing Z timezone', 'normalize to YYYY-MM-DD'.
  - Applied to effectiveDate, terminationDate and tradeDate fields in multiple examples.

### Transformation XFRM-002: Reshape notional amount into tradeLot / quantity and priceQuantity structures

- Type: `normalization`
- Description: Notional amount and currency are transformed from nested notional elements into CDM tradeLot quantity or priceQuantity value/unit structures.
- Source side: `notional.notionalAmount.amount + currency (FpML)`
- Target side: `tradeLot.quantity.value + unit.currency.value or priceQuantity (CDM)`
- Evidence count: `3`
- Example files:
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex06-single-index-long-form.xml`
- Notes:
  - Ensures numeric amount and currency are retained in CDM structures used downstream for valuation.

### Transformation XFRM-003: Resolve href references to explicit Party roles (payer/receiver/party1/party2)

- Type: `reference resolution`
- Description: FpML href-based party references are dereferenced and mapped to explicit role fields in CDM payouts and counterparty slots.
- Source side: `partyReference hrefs within legs and payout structures (FpML)`
- Target side: `explicit payer/receiver or Party1/Party2 role fields (CDM)`
- Evidence count: `3`
- Example files:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex17-cfd.xml`
- Notes:
  - Some examples show ambiguous or inverted role assignments — verification of role-derivation logic is needed per trade.

### Transformation XFRM-004: Split separate legs into multiple payout entries

- Type: `split`
- Description: Multiple FpML legs (e.g., separate interest/equity legs or compounding legs) are represented as separate payout objects in CDM.
- Source side: `Multiple leg elements in FpML trade (interestLeg, equityLeg, etc.)`
- Target side: `Multiple payout entries in CDM trade representation`
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
- Notes:
  - Leg-level semantics (rate specs, compoundingSpread) may require additional enrichment to populate CDM rateSpecification fields.

### 6.3 Tentative repeated signals

### TENT-039: mapping

- Strength: `moderate recurring pattern`
- Description: Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.
- Evidence count: `7`
- Example files:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex17-cfd.xml`
  - `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml`
  - `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: effective date unadjustedDate copied
  - Representative note: effective date mapped
  - Representative note: mapped unadjusted effective date

### TENT-050: mapping

- Strength: `moderate recurring pattern`
- Description: Date-like fields repeatedly normalize from trade.tradeheader.tradedate into trade.tradedate.value.
- Evidence count: `3`
- Example files:
  - `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: trade date normalized and reformatted
  - Confidence mix includes high.
  - Representative note: trade date copied

### TENT-008: mapping

- Strength: `moderate recurring pattern`
- Description: Economic terms repeatedly reshape from notional.notionalamount.amount|notional.notionalamount.currency into quantity.value.value|unit.currency.value.
- Evidence count: `3`
- Example files:
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex06-single-index-long-form.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: notional moved into tradeLot price/quantity
  - Confidence mix includes high.
  - Representative note: notional amount and currency mapped

### TENT-016: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.
- Evidence count: `3`
- Example files:
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: strip trailing 'Z' timezone
  - Representative note: Removed trailing 'Z' timezone from date string
  - Confidence mix includes medium.

### TENT-031: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate.
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex07-long-form-with-stub.xml`
  - `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: strip timezone, normalize to YYYY-MM-DD
  - Representative note: remove trailing 'Z' from date strings

### TENT-041: mapping

- Strength: `moderate recurring pattern`
- Description: Party references repeatedly resolve from equityswaptransactionsupplement.interestleg.payerpartyreference|equityswaptransactionsupplement.interestleg.receiverpartyreference into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: interest leg party hrefs resolved to Party roles
  - Representative note: party refs normalized to Party1/Party2

### TENT-070: mapping

- Strength: `moderate recurring pattern`
- Description: Trade identifiers repeatedly map from partytradeidentifier.versionedtradeid.tradeid into assignedidentifier.identifier.value.
- Evidence count: `2`
- Example files:
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: FpML tradeId -> CDM assignedIdentifier.value
  - Representative note: tradeId -> tradeIdentifier.assignedIdentifier.value

### 6.4 Folder-level principles

- Dates: preserve unadjustedDate semantics from FpML effective/termination dates; normalize string form (remove trailing 'Z' and format as YYYY-MM-DD) before inserting into CDM.
- Trade identifiers: copy FpML tradeId values into CDM assignedIdentifier.identifier.value (record external trade ids).
- Economic amounts: map FpML notional amounts and currency into CDM tradeLot quantity or priceQuantity structures to retain numeric value and currency.
- Instrument identifiers: map FpML instrument/equity ids to CDM security or observable identifier fields, preserving the id and including exchange metadata where present.
- Party references: dereference href-based party references and populate explicit payer/receiver or party role fields in CDM payout/counterparty structures.
- Relative schedule fields (periodMultiplier, period, dayType, businessDayConvention) are preserved when mapping schedule-related elements.

### 6.5 Variants and exceptions

### Variant VAR-001: Exchange identifier normalization varies by example

- Description: FpML exchangeId values are converted to CDM exchange codes/names in several examples, but the specific mapping rules/source are inconsistent or unspecified.
- Seen in:
  - `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml`
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
- Impact on generalization: Prevents a safe, deterministic rule for exchange code normalization; mapping must be driven by an external exchange code table or flagged for manual review.

### Variant VAR-002: Calculation agent role mapping not explicit

- Description: Mapping of FpML calculationAgentParty to CDM calculationAgent roles (e.g., 'CalculationAgentIndependent') is shown in at least one example but the rule is unclear.
- Seen in:
  - `equity-swaps/eqs-ex07-long-form-with-stub.xml`
- Impact on generalization: Agent role derivation requires explicit rule or lookup; treat as an exception requiring confirmation or augmentation.

### Variant VAR-003: Payer/receiver inversion or ambiguity

- Description: Some examples indicate possible inversion or ambiguous derivation of payer vs receiver when resolving party hrefs.
- Seen in:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
  - `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml`
- Impact on generalization: Role-resolution logic must be validated per trade; do not assume a fixed Party1->payer mapping without confirming source roles.

### Variant VAR-004: Compounding/leg-level rate details need special handling

- Description: Elements like compoundingSpread or spreadSchedules are present but their representation in CDM rateSpecification is not consistent across examples.
- Seen in:
  - `equity-swaps/eqs-ex09-compounding-swap.xml`
- Impact on generalization: RateSpecification mapping for compounding/spread details should be treated as a specialized case and validated against domain expectations.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: Timezone trimming as normalization

- Description: Many mappings remove trailing 'Z' from FpML date-time strings before inserting into CDM; treated as a normalization rather than a semantic change.
- Classification: `normalization`
- Evidence:
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex07-long-form-with-stub.xml`
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
- Caution:
  - Confirm that timezone removal is acceptable for all date fields and does not drop timezone-sensitive semantics.

### Enrichment ENR-002: Exchange code/name enrichment

- Description: CDM exchange codes/names (e.g., 'XPAR','NASD','XNSE','XTAI') appear in examples where FpML supplied human-readable exchange ids; likely an enrichment step using an exchange code mapping table.
- Classification: `suspected enrichment`
- Evidence:
  - `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml`
  - `equity-swaps/eqs-ex03-index-quanto-long-form.xml`
  - `equity-swaps/eqs-ex04-zero-strike-long-form.xml`
  - `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml`
- Caution:
  - Mapping source is not provided; applying an exchange code lookup without an authoritative table may be incorrect.
  - Where exchange mapping is required, surface for review or apply a controlled mapping source.

### Enrichment ENR-003: meta/globalKey population from FpML trade identifiers

- Description: Some CDM meta fields and globalKey-like values appear derived from FpML identifiers; the exact provenance is not explicit in the examples.
- Classification: `unclear`
- Evidence:
  - `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml`
  - `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml`
- Caution:
  - Avoid assuming full CDM meta population rules—treat as an enrichment step that needs explicit specification.

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

- effectivedate.adjustabledate.unadjusteddate (FpML) -> effectivedate.adjustabledate.unadjusteddate (CDM): Effective dates from FpML unadjustedDate elements are consistently copied into the CDM effectiveDate.adjustableDate.unadjustedDate slots.
- trade.tradeHeader.tradeDate (FpML) -> trade.tradeDate.value (CDM): Trade header tradeDate entries are normalized/mapped into a single trade.tradedate.value field in the CDM representation.
- notional.notionalAmount.amount and notional.notionalAmount.currency (FpML) -> quantity.value.value and unit.currency.value (CDM tradeLot / priceQuantity): Notional amounts from FpML are relocated into CDM quantity/price representations (tradeLot or priceQuantity) preserving numeric value and currency.
- equity instrumentId / equity id and exchange (FpML) -> Security.identifier or Observable.identifier with exchange metadata (CDM): Equity/instrument identifiers present in the FpML trades are consistently mapped into CDM security/observable identifier fields, often preserving id and exchange attributes.
- interestLeg.payerPartyReference / receiverPartyReference (FpML) -> interestratepayout.payerReceiver.payer / .receiver (CDM): Party hrefs used inside interest/leg structures are resolved to explicit payer/receiver roles in CDM payout structures.
- partyTradeIdentifier.versionedTradeId.tradeId (FpML) -> assignedIdentifier.identifier.value (CDM): FpML trade identifiers are placed into CDM assignedIdentifier structures to record the trade's id value.

### Transformation Patterns

- normalization: Date strings with trailing 'Z' timezone are trimmed and reformatted to a normalized YYYY-MM-DD representation in the CDM.
- normalization: Notional amount and currency are transformed from nested notional elements into CDM tradeLot quantity or priceQuantity value/unit structures.
- reference resolution: FpML href-based party references are dereferenced and mapped to explicit role fields in CDM payouts and counterparty slots.
- split: Multiple FpML legs (e.g., separate interest/equity legs or compounding legs) are represented as separate payout objects in CDM.
- Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate. [tentative 3 examples]
- Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate. [tentative 2 examples]

### Product-Specific Branches

### eqs-ex01-single-underlyer-execution-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - relative date fields mapped (periodMultiplier, period, dayType, businessDayConvention)
  - instrumentId mapped to security identifier
  - interim valuation unadjustedDate list transferred
  - notionalAmount mapped into priceQuantity and tradeLot quantity
- Cautions:
  - Why was exchangeId 'NASDAQ' changed to 'NASD' in target?

### eqs-ex03-index-quanto-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - periodMultiplier preserved
  - notional moved into tradeLot price/quantity
  - quoted pair and rate preserved
  - index instrumentId preserved
- Cautions:
  - Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?

### eqs-ex04-zero-strike-long-form.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - removed timezone Z
  - periodMultiplier 0 preserved
  - instrumentId -> Security.identifier
  - notional amount and currency mapped
- Cautions:
  - FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?

### eqs-ex07-long-form-with-stub.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - effectiveDate unadjustedDate mapped
  - termination date and business centers mapped
  - basket constituents to Observable Basket
  - partyTradeIdentifier -> tradeIdentifier
- Cautions:
  - How is calculationAgentParty mapped to 'CalculationAgentIndependent'?

### eqs-ex09-compounding-swap.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - effective date unadjustedDate copied
  - relative date fields mapped; href preserved as externalReference
  - interest leg party hrefs resolved to Party roles
  - index id and exchanges copied into observable
- Cautions:
  - How is compoundingSpread (.05) represented in CDM rateSpecification?
  - How are Party1/Party2 assignments derived from BankA/BankB?

### eqs-ex12-on-european-index-underlyer-short-form.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - trade date copied
  - party id and name mapped
  - index id and name mapped
  - effective date mapped
- Cautions:
  - FpML exchangeId 'GER' differs from CDM exchange.name 'XEUR'; mapping rationale?

### Validation Checks

- Check unresolved question: Why was exchangeId 'NASDAQ' changed to 'NASD' in target?
- Check unresolved question: Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?
- Check unresolved question: FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?
- Check unresolved question: FpML exchangeId 'Taiwan Stock Exchange' mapped to CDM exchange code 'XTAI'; mapping source unclear
- Check unresolved question: FpML exchangeId values (EuroNext/MATIF/MONEP) differ from CDM exchange.name (XPAR/XMAT/XMON)
- Check unresolved question: CDM globalKey/meta values provenance not explicit in FpML

### Do Not Assume

- Do not treat Timezone trimming as normalization as a guaranteed direct mapping rule yet.
- Do not treat Exchange code/name enrichment as a guaranteed direct mapping rule yet.
- Do not treat meta/globalKey population from FpML trade identifiers as a guaranteed direct mapping rule yet.
- Why was exchangeId 'NASDAQ' changed to 'NASD' in target?
- Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?
- FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?

## 8. Pair-Level Worked Examples

### `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml` -> `equity-swaps/eqs-ex01-single-underlyer-execution-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - relative date fields mapped (periodMultiplier, period, dayType, businessDayConvention)
  - instrumentId mapped to security identifier
  - interim valuation unadjustedDate list transferred
  - notionalAmount mapped into priceQuantity and tradeLot quantity
- Most important transformation:
  - exchange id normalized (NASDAQ -> NASD)
- Uncertainty:
  - Why was exchangeId 'NASDAQ' changed to 'NASD' in target?

### `equity-swaps/eqs-ex03-index-quanto-long-form.xml` -> `equity-swaps/eqs-ex03-index-quanto-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - periodMultiplier preserved
  - notional moved into tradeLot price/quantity
  - quoted pair and rate preserved
  - index instrumentId preserved
- Most important transformation:
  - dates normalized (trimmed 'Z')
- Uncertainty:
  - Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?

### `equity-swaps/eqs-ex04-zero-strike-long-form.xml` -> `equity-swaps/eqs-ex04-zero-strike-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - removed timezone Z
  - periodMultiplier 0 preserved
  - instrumentId -> Security.identifier
  - notional amount and currency mapped
- Most important transformation:
  - strip trailing 'Z' timezone
- Uncertainty:
  - FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?

### `equity-swaps/eqs-ex07-long-form-with-stub.xml` -> `equity-swaps/eqs-ex07-long-form-with-stub.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effectiveDate unadjustedDate mapped
  - termination date and business centers mapped
  - basket constituents to Observable Basket
  - partyTradeIdentifier -> tradeIdentifier
- Most important transformation:
  - strip timezone, normalize to YYYY-MM-DD
- Uncertainty:
  - How is calculationAgentParty mapped to 'CalculationAgentIndependent'?

### `equity-swaps/eqs-ex09-compounding-swap.xml` -> `equity-swaps/eqs-ex09-compounding-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective date unadjustedDate copied
  - relative date fields mapped; href preserved as externalReference
  - interest leg party hrefs resolved to Party roles
  - index id and exchanges copied into observable
- Most important transformation:
  - separate legs become two payout entries
- Uncertainty:
  - How is compoundingSpread (.05) represented in CDM rateSpecification?
  - How are Party1/Party2 assignments derived from BankA/BankB?

### `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.xml` -> `equity-swaps/eqs-ex12-on-european-index-underlyer-short-form.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - trade date copied
  - party id and name mapped
  - index id and name mapped
  - effective date mapped
- Most important transformation:
  - resolved equityNotionalAmount reference to quantity
- Uncertainty:
  - FpML exchangeId 'GER' differs from CDM exchange.name 'XEUR'; mapping rationale?

### `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex13-pan-asia-interdealer-share-swap-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - mapped unadjusted effective date
  - mapped unadjusted termination date
  - mapped trade date
  - equity instrument ids to security identifiers
- Most important transformation:
  - strip trailing 'Z' and format as YYYY-MM-DD
- Uncertainty:
  - InterestRatePayout payer/receiver role appears inverted between FpML and CDM; confirm mapping

### `equity-swaps/eqs-ex17-cfd.xml` -> `equity-swaps/eqs-ex17-cfd.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - productType value and scheme -> taxonomy[0].name
  - effective date mapped
  - termination date mapped
  - equity identifier and exchange mapped
- Most important transformation:
  - href resolved to Party1/Party2 via counterparty mapping
- Uncertainty:
  - What is source of taxonomy[1].productQualifier?

### `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.xml` -> `equity-swaps/eqs-ex19-european-interdealer-fair-value-share-swap-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML tradeId -> CDM tradeIdentifier.assignedIdentifier
  - effective date copied to economicTerms.effectiveDate
  - instrumentId and exchange -> Security identifier and exchange.name
  - FpML notional amount -> CDM quantity value
- Most important transformation:
  - string '.85' normalized to numeric 0.85
- Uncertainty:
  - Why does CDM contain duplicate tradeIdentifier entries for same values?

### `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.xml` -> `equity-swaps/eqs-ex05-single-stock-plus-fee-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - instrumentId -> security identifier value
  - tradeDate -> tradeDate.value (format normalized)
  - otherPartyPayment (brokerage) -> transferHistory cash transfer
- Most important transformation:
  - formula interpreted as upfront transfer linked to EffectiveDate
- Uncertainty:
  - FpML exchangeId 'Taiwan Stock Exchange' mapped to CDM exchange code 'XTAI'; mapping source unclear

### `equity-swaps/eqs-ex06-single-index-long-form.xml` -> `equity-swaps/eqs-ex06-single-index-long-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effectiveDate relativeDate fields mapped directly
  - index instrumentId and description to observable identifiers
  - notional amount and currency mapped to quantity
- Most important transformation:
  - href party references resolved to Party1/Party2 identifiers
- Uncertainty:
  - FpML exchangeId values (EuroNext/MATIF/MONEP) differ from CDM exchange.name (XPAR/XMAT/XMON)
  - CDM globalKey/meta values provenance not explicit in FpML

### `equity-swaps/eqs-ex08-composite-basket-long-form-separate-spreads.xml` -> `equity-swaps/eqs-ex08-composite-basket-long-form-separate-spreads.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML equity instrumentId mapped to CDM security identifier
  - Notional amount and currency mapped to CDM quantity and price
  - FpML spreadSchedule entries mapped to CDM price and datedValue entries
- Most important transformation:
  - Each spreadSchedule -> one or more CDM price entries (initial and dated steps)
- Uncertainty:
  - How are underlyerSpread href values linked to spreadSchedule ids in CDM?
  - What mapping rule produced exchange code abbreviations (e.g. XMIL) from names?

### `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.xml` -> `equity-swaps/eqs-ex10-short-form-interestLeg-driving-schedule-dates.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - payer href -> payer role
  - termination unadjustedDate
  - rollConvention value
- Most important transformation:
  - remove trailing 'Z' from date strings
- Uncertainty:
  - How is CDM role 'Party1' derived from FpML href 'party1'?

### `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.xml` -> `equity-swaps/eqs-ex11-on-european-index-underlyer-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - trade date normalized and reformatted
  - party refs normalized to Party1/Party2
  - equity identifier does not match CDM observable
- Most important transformation:
  - date value and format normalized
- Uncertainty:
  - Why tradeDate values differ between files?
  - Why CDM equity observable differs from FpML instrumentId?

### `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex14-european-interdealer-share-swap-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML dates normalized (removed trailing 'Z') into CDM date strings
  - Notional href/id mapped to CDM quantity reference and numeric value
  - Equity instrumentIds mapped to CDM security identifiers
- Most important transformation:
  - Remove trailing 'Z' from date strings
- Uncertainty:
  - Party role mapping inversion between FpML party1/party2 and CDM Party1/Party2 unclear

### `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex15-forward-starting-pre-european-interdealer-share-swap-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML tradeId -> CDM assignedIdentifier.value
  - FpML partyName -> CDM party.name
  - Instrument ids mapped to CDM identifiers with types
- Most important transformation:
  - Removed trailing 'Z' timezone from date string
- Uncertainty:
  - How was exchangeId 'GER' mapped to CDM exchange.name 'XETR'?

### `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.xml` -> `equity-swaps/eqs-ex16-forward-starting-post-european-interdealer-share-swap-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - tradeId -> tradeIdentifier.assignedIdentifier.value
  - effective date copied and normalized
  - ISIN -> Security.identifier[ISIN]
- Most important transformation:
  - strip trailing 'Z' from date
- Uncertainty:
  - Why are $.trade.counterparty.externalReference values swapped relative to FpML party hrefs?

### `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.xml` -> `equity-swaps/eqs-ex18-pan-asia-interdealer-index-swap-short-form.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective date unadjusted maps directly
  - equity instrument id -> security identifier
  - initial net price -> tradeLot price value
- Most important transformation:
  - rate index and tenor normalized to InterestRateIndex observable
- Uncertainty:
  - Why tradeIdentifier TW9236 appears duplicated without issuerReference?

## 9. Open Questions And Risks

- Why was exchangeId 'NASDAQ' changed to 'NASD' in target?
- Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?
- FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?
- FpML exchangeId 'Taiwan Stock Exchange' mapped to CDM exchange code 'XTAI'; mapping source unclear
- FpML exchangeId values (EuroNext/MATIF/MONEP) differ from CDM exchange.name (XPAR/XMAT/XMON)
- CDM globalKey/meta values provenance not explicit in FpML
- How is calculationAgentParty mapped to 'CalculationAgentIndependent'?
- How are underlyerSpread href values linked to spreadSchedule ids in CDM?
- How is compoundingSpread represented in CDM rateSpecification?
- How are Party1/Party2 assignments derived from BankA/BankB when resolving hrefs?
- What is the source of taxonomy[1].productQualifier in the CDM mapping?

## 10. Draft Conclusion

- Most reusable findings:
  - Unadjusted effective dates and trade dates are consistently mapped into CDM date fields with a normalization step (remove trailing 'Z', format YYYY-MM-DD).
  - Notional amounts and currency are regularly moved into CDM tradeLot/quantity or priceQuantity structures to preserve economic value.
  - Instrument/equity ids from FpML are reliably mapped to CDM security/observable identifier structures (including exchange metadata where provided).
  - Party hrefs are dereferenced and assigned to explicit CDM roles (payer/receiver/party1/party2) for payouts and counterparties.
  - FpML trade identifiers are copied into CDM assignedIdentifier structures to preserve original trade ids.
- What seems safe to generalize:
  - Map FpML unadjustedDate elements into CDM effectiveDate/terminationDate unadjustedDate fields, trimming timezone suffixes.
  - Normalize and copy FpML trade.tradeHeader.tradeDate into CDM trade.tradedate.value.
  - Move notional.notionalAmount.amount and currency into CDM quantity/price structures.
  - Map instrument/equity ids to CDM security/observable identifiers.
  - Dereference party hrefs and populate explicit party role fields in CDM.
- What should remain tentative:
  - Exchange identifier normalization (FpML exchangeId -> CDM exchange code) — mapping table or rule not provided.
  - Derivation of CDM meta/globalKey values from FpML identifiers — provenance unclear.
  - Mapping of calculationAgentParty to specific CDM agent roles.
  - Representation of compoundingSpread and spreadSchedules in CDM rateSpecification.
  - Any assumptions about payer/receiver assignments without explicit role-derivation rules.

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
  - Tentative repeated semantic signals: 7
