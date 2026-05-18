# FPML -> CDM Cookbook: equity-swaps

## Status

- Operational status: `review_only`
- Agent use policy: Agents must not apply these rules automatically; use only as background evidence for analyst review.
- Semantic success rate: 100%
- Draft quality: `fair`
- Draft publication: `failed_integrity_validation`
- Readiness reasons: `not_final_publication`, `integrity_failed`, `critical_ambiguity`

## Trigger Signals

- equity-swaps
- FpML top-level section: party
- FpML top-level section: trade
- FpML top-level section: header
- trade > returnSwap (116 paths)
- trade > tradeHeader (6 paths)
- trade > documentation (5 paths)
- party > partyId (2 paths)
- header > conversationId (1 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header
- trade
- party

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: party, trade, header.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Apply recurring mapping rules only when the exact source cues appear in the document.
4. Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
5. Assemble the result under repeated CDM scaffolding such as meta, trade.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

### effectiveDate unadjustedDate -> effectiveDate.adjustableDate.unadjustedDate

- Rule id: `equity-swaps:MAP-001`
- Family: `equity-swaps`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `effectivedate.adjustabledate.unadjusteddate (FpML)`
- Target CDM paths: `effectivedate.adjustabledate.unadjusteddate (CDM)`
- Action: Effective dates from FpML unadjustedDate elements are consistently copied into the CDM effectiveDate.adjustableDate.unadjustedDate slots.
- Rationale: Preserves the unadjusted effective date semantics; seen in multiple long- and short-form examples.
- Evidence: 7 examples from 18/18 semantic pairs
- Caveats: `Date string normalization (timezone trimming) is applied in many examples — see normalization rules.`, `Some examples include additional business center or adjustedDate elements that require separate handling.`
- Validate: `Confirm the FPML source contains: effectivedate.adjustabledate.unadjusteddate (FpML).`, `Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### trade.tradeHeader.tradeDate -> trade.tradeDate.value

- Rule id: `equity-swaps:MAP-002`
- Family: `equity-swaps`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `trade.tradeHeader.tradeDate (FpML)`
- Target CDM paths: `trade.tradeDate.value (CDM)`
- Action: Trade header tradeDate entries are normalized/mapped into a single trade.tradedate.value field in the CDM representation.
- Rationale: Consolidates trade-level date into the CDM tradeDate slot used by downstream processes.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Some mappings show reformatting of the date string (e.g., timezone removal) during the copy.`
- Validate: `Confirm the FPML source contains: trade.tradeHeader.tradeDate (FpML).`, `Confirm the proposed CDM representation populates: trade.tradeDate.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### notional.notionalAmount.amount|currency -> quantity.value.value|unit.currency.value (tradeLot/priceQuantity)

- Rule id: `equity-swaps:MAP-003`
- Family: `equity-swaps`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `notional.notionalAmount.amount and notional.notionalAmount.currency (FpML)`
- Target CDM paths: `quantity.value.value and unit.currency.value (CDM tradeLot / priceQuantity)`
- Action: Notional amounts from FpML are relocated into CDM quantity/price representations (tradeLot or priceQuantity) preserving numeric value and currency.
- Rationale: CDM models notional as trade lot/quantity; mapping retains economic magnitude and currency semantics.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Some examples resolve equityNotionalAmount references prior to mapping (see representative highlights).`
- Validate: `Confirm the FPML source contains: notional.notionalAmount.amount and notional.notionalAmount.currency (FpML).`, `Confirm the proposed CDM representation populates: quantity.value.value and unit.currency.value (CDM tradeLot / priceQuantity).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### instrumentId / equity identifier -> Security.identifier / Observable identifier

- Rule id: `equity-swaps:MAP-004`
- Family: `equity-swaps`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `equity instrumentId / equity id and exchange (FpML)`
- Target CDM paths: `Security.identifier or Observable.identifier with exchange metadata (CDM)`
- Action: Equity/instrument identifiers present in the FpML trades are consistently mapped into CDM security/observable identifier fields, often preserving id and exchange attributes.
- Rationale: CDM requires an observable/security identifier for equity underlyers; mapping ensures the same identifier is available in CDM for pricing and reference.
- Evidence: 8 examples from 18/18 semantic pairs
- Caveats: `Exchange identifier normalization (FpML exchangeId -> CDM exchange code) is applied in many examples but the mapping source/rules are not explicit.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: equity instrumentId / equity id and exchange (FpML).`, `Confirm the proposed CDM representation populates: Security.identifier or Observable.identifier with exchange metadata (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### party references -> payer/receiver resolution

- Rule id: `equity-swaps:MAP-005`
- Family: `equity-swaps`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `interestLeg.payerPartyReference / receiverPartyReference (FpML)`
- Target CDM paths: `interestratepayout.payerReceiver.payer / .receiver (CDM)`
- Action: Party hrefs used inside interest/leg structures are resolved to explicit payer/receiver roles in CDM payout structures.
- Rationale: CDM requires explicit counterparty role assignment for payout definitions; mapping resolves FpML hrefs to those roles.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `Some examples suggest role inversion or ambiguity between Party1/Party2 mapping — verify role derivation logic per trade.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: interestLeg.payerPartyReference / receiverPartyReference (FpML).`, `Confirm the proposed CDM representation populates: interestratepayout.payerReceiver.payer / .receiver (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### partyTradeIdentifier.versionedTradeId.tradeId -> assignedIdentifier.identifier.value

- Rule id: `equity-swaps:MAP-006`
- Family: `equity-swaps`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `partyTradeIdentifier.versionedTradeId.tradeId (FpML)`
- Target CDM paths: `assignedIdentifier.identifier.value (CDM)`
- Action: FpML trade identifiers are placed into CDM assignedIdentifier structures to record the trade's id value.
- Rationale: CDM uses assignedIdentifier to represent external trade ids; mapping copies the FpML tradeId into this slot.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `The provenance of other meta/globalKey fields derived from FpML is not explicit and may be enriched post-mapping.`
- Human review when: `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: partyTradeIdentifier.versionedTradeId.tradeId (FpML).`, `Confirm the proposed CDM representation populates: assignedIdentifier.identifier.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`


## Transformations

### Strip trailing 'Z' timezone and normalize date format to YYYY-MM-DD

- Rule id: `equity-swaps:XFRM-001`
- Family: `equity-swaps`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FpML date strings (often with trailing 'Z')`
- Target CDM paths: `CDM date strings normalized to YYYY-MM-DD`
- Action: Date strings with trailing 'Z' timezone are trimmed and reformatted to a normalized YYYY-MM-DD representation in the CDM.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 5 examples from 18/18 semantic pairs
- Caveats: `Representative notes: 'strip trailing Z timezone', 'normalize to YYYY-MM-DD'.`, `Applied to effectiveDate, terminationDate and tradeDate fields in multiple examples.`
- Validate: `Confirm the FPML source contains: FpML date strings (often with trailing 'Z').`, `Confirm the proposed CDM representation populates: CDM date strings normalized to YYYY-MM-DD.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Reshape notional amount into tradeLot / quantity and priceQuantity structures

- Rule id: `equity-swaps:XFRM-002`
- Family: `equity-swaps`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `notional.notionalAmount.amount + currency (FpML)`
- Target CDM paths: `tradeLot.quantity.value + unit.currency.value or priceQuantity (CDM)`
- Action: Notional amount and currency are transformed from nested notional elements into CDM tradeLot quantity or priceQuantity value/unit structures.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Ensures numeric amount and currency are retained in CDM structures used downstream for valuation.`
- Validate: `Confirm the FPML source contains: notional.notionalAmount.amount + currency (FpML).`, `Confirm the proposed CDM representation populates: tradeLot.quantity.value + unit.currency.value or priceQuantity (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Resolve href references to explicit Party roles (payer/receiver/party1/party2)

- Rule id: `equity-swaps:XFRM-003`
- Family: `equity-swaps`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `partyReference hrefs within legs and payout structures (FpML)`
- Target CDM paths: `explicit payer/receiver or Party1/Party2 role fields (CDM)`
- Action: FpML href-based party references are dereferenced and mapped to explicit role fields in CDM payouts and counterparty slots.
- Rationale: Apply this reference resolution transformation when the source-side signal is present.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Some examples show ambiguous or inverted role assignments — verification of role-derivation logic is needed per trade.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: partyReference hrefs within legs and payout structures (FpML).`, `Confirm the proposed CDM representation populates: explicit payer/receiver or Party1/Party2 role fields (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Split separate legs into multiple payout entries

- Rule id: `equity-swaps:XFRM-004`
- Family: `equity-swaps`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Multiple leg elements in FpML trade (interestLeg, equityLeg, etc.)`
- Target CDM paths: `Multiple payout entries in CDM trade representation`
- Action: Multiple FpML legs (e.g., separate interest/equity legs or compounding legs) are represented as separate payout objects in CDM.
- Rationale: Apply this split transformation when the source-side signal is present.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `Leg-level semantics (rate specs, compoundingSpread) may require additional enrichment to populate CDM rateSpecification fields.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: Multiple leg elements in FpML trade (interestLeg, equityLeg, etc.).`, `Confirm the proposed CDM representation populates: Multiple payout entries in CDM trade representation.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.

- Rule id: `equity-swaps:TENT-016`
- Family: `equity-swaps`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: strip trailing 'Z' timezone`, `Representative note: Removed trailing 'Z' timezone from date string`, `Confidence mix includes medium.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate.

- Rule id: `equity-swaps:TENT-031`
- Family: `equity-swaps`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Normalization repeatedly reshapes effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: strip timezone, normalize to YYYY-MM-DD`, `Representative note: remove trailing 'Z' from date strings`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Variants And Branches

### Exchange identifier normalization varies by example

- Rule id: `equity-swaps:VAR-001`
- Family: `equity-swaps`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FpML exchangeId values are converted to CDM exchange codes/names in several examples, but the specific mapping rules/source are inconsistent or unspecified.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Prevents a safe, deterministic rule for exchange code normalization; mapping must be driven by an external exchange code table or flagged for manual review.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 4 examples from 18/18 semantic pairs
- Caveats: `Prevents a safe, deterministic rule for exchange code normalization; mapping must be driven by an external exchange code table or flagged for manual review.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Calculation agent role mapping not explicit

- Rule id: `equity-swaps:VAR-002`
- Family: `equity-swaps`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Mapping of FpML calculationAgentParty to CDM calculationAgent roles (e.g., 'CalculationAgentIndependent') is shown in at least one example but the rule is unclear.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Agent role derivation requires explicit rule or lookup; treat as an exception requiring confirmation or augmentation.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 1 examples from 18/18 semantic pairs
- Caveats: `Agent role derivation requires explicit rule or lookup; treat as an exception requiring confirmation or augmentation.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Payer/receiver inversion or ambiguity

- Rule id: `equity-swaps:VAR-003`
- Family: `equity-swaps`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Some examples indicate possible inversion or ambiguous derivation of payer vs receiver when resolving party hrefs.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Role-resolution logic must be validated per trade; do not assume a fixed Party1->payer mapping without confirming source roles.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `Role-resolution logic must be validated per trade; do not assume a fixed Party1->payer mapping without confirming source roles.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Compounding/leg-level rate details need special handling

- Rule id: `equity-swaps:VAR-004`
- Family: `equity-swaps`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Elements like compoundingSpread or spreadSchedules are present but their representation in CDM rateSpecification is not consistent across examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: RateSpecification mapping for compounding/spread details should be treated as a specialized case and validated against domain expectations.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 1 examples from 18/18 semantic pairs
- Caveats: `RateSpecification mapping for compounding/spread details should be treated as a specialized case and validated against domain expectations.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`


## Enrichment And Defaults

### Timezone trimming as normalization

- Rule id: `equity-swaps:ENR-001`
- Family: `equity-swaps`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `Many mappings remove trailing 'Z' from FpML date-time strings before inserting into CDM; treated as a normalization rather than a semantic change.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as normalization; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Many mappings remove trailing 'Z' from FpML date-time strings before inserting into CDM; treated as a normalization rather than a semantic change.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Confirm that timezone removal is acceptable for all date fields and does not drop timezone-sensitive semantics.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Exchange code/name enrichment

- Rule id: `equity-swaps:ENR-002`
- Family: `equity-swaps`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `CDM exchange codes/names (e.g., 'XPAR','NASD','XNSE','XTAI') appear in examples where FpML supplied human-readable exchange ids; likely an enrichment step using an exchange code mapping table.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM exchange codes/names (e.g., 'XPAR','NASD','XNSE','XTAI') appear in examples where FpML supplied human-readable exchange ids; likely an enrichment step using an exchange code mapping table.
- Evidence: 4 examples from 18/18 semantic pairs
- Caveats: `Mapping source is not provided; applying an exchange code lookup without an authoritative table may be incorrect.`, `Where exchange mapping is required, surface for review or apply a controlled mapping source.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### meta/globalKey population from FpML trade identifiers

- Rule id: `equity-swaps:ENR-003`
- Family: `equity-swaps`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `Some CDM meta fields and globalKey-like values appear derived from FpML identifiers; the exact provenance is not explicit in the examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as unclear; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Some CDM meta fields and globalKey-like values appear derived from FpML identifiers; the exact provenance is not explicit in the examples.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `Avoid assuming full CDM meta population rules—treat as an enrichment step that needs explicit specification.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Cautions And Tentative Signals

### Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.

- Rule id: `equity-swaps:TENT-039`
- Family: `equity-swaps`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 18/18 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: effective date unadjustedDate copied`, `Representative note: effective date mapped`, `Representative note: mapped unadjusted effective date`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Date-like fields repeatedly normalize from trade.tradeheader.tradedate into trade.tradedate.value.

- Rule id: `equity-swaps:TENT-050`
- Family: `equity-swaps`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Date-like fields repeatedly normalize from trade.tradeheader.tradedate into trade.tradedate.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: trade date normalized and reformatted`, `Confidence mix includes high.`, `Representative note: trade date copied`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Economic terms repeatedly reshape from notional.notionalamount.amount|notional.notionalamount.currency into quantity.value.value|unit.currency.value.

- Rule id: `equity-swaps:TENT-008`
- Family: `equity-swaps`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Economic terms repeatedly reshape from notional.notionalamount.amount|notional.notionalamount.currency into quantity.value.value|unit.currency.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 18/18 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: notional moved into tradeLot price/quantity`, `Confidence mix includes high.`, `Representative note: notional amount and currency mapped`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Party references repeatedly resolve from equityswaptransactionsupplement.interestleg.payerpartyreference|equityswaptransactionsupplement.interestleg.receiverpartyreference into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.

- Rule id: `equity-swaps:TENT-041`
- Family: `equity-swaps`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Party references repeatedly resolve from equityswaptransactionsupplement.interestleg.payerpartyreference|equityswaptransactionsupplement.interestleg.receiverpartyreference into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: interest leg party hrefs resolved to Party roles`, `Representative note: party refs normalized to Party1/Party2`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Trade identifiers repeatedly map from partytradeidentifier.versionedtradeid.tradeid into assignedidentifier.identifier.value.

- Rule id: `equity-swaps:TENT-070`
- Family: `equity-swaps`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Trade identifiers repeatedly map from partytradeidentifier.versionedtradeid.tradeid into assignedidentifier.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 18/18 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: FpML tradeId -> CDM assignedIdentifier.value`, `Representative note: tradeId -> tradeIdentifier.assignedIdentifier.value`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Do Not Assume

- Do not treat Timezone trimming as normalization as a guaranteed direct mapping rule yet.
- Do not treat Exchange code/name enrichment as a guaranteed direct mapping rule yet.
- Do not treat meta/globalKey population from FpML trade identifiers as a guaranteed direct mapping rule yet.
- Why was exchangeId 'NASDAQ' changed to 'NASD' in target?
- Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?
- FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not apply this tentative pattern without matching source evidence.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: Exchange identifier normalization (FpML exchangeId -> CDM exchange code) — mapping table or rule not provided.
- Do not treat as stable: Derivation of CDM meta/globalKey values from FpML identifiers — provenance unclear.
- Do not treat as stable: Mapping of calculationAgentParty to specific CDM agent roles.
- Do not treat as stable: Representation of compoundingSpread and spreadSchedules in CDM rateSpecification.
- Do not treat as stable: Any assumptions about payer/receiver assignments without explicit role-derivation rules.
- Do not assume enrichment/default behavior for Timezone trimming as normalization without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Exchange code/name enrichment without source evidence or analyst approval.
- Do not assume enrichment/default behavior for meta/globalKey population from FpML trade identifiers without source evidence or analyst approval.

## Human Review Triggers

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
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- Party role or payment direction affects economic meaning.
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: Why was exchangeId 'NASDAQ' changed to 'NASD' in target?
- Check unresolved question: Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?
- Check unresolved question: FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?
- Check unresolved question: FpML exchangeId 'Taiwan Stock Exchange' mapped to CDM exchange code 'XTAI'; mapping source unclear
- Check unresolved question: FpML exchangeId values (EuroNext/MATIF/MONEP) differ from CDM exchange.name (XPAR/XMAT/XMON)
- Check unresolved question: CDM globalKey/meta values provenance not explicit in FpML
- Confirm the FPML source contains: effectivedate.adjustabledate.unadjusteddate (FpML).
- Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate (CDM).
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: trade.tradeHeader.tradeDate (FpML).
- Confirm the proposed CDM representation populates: trade.tradeDate.value (CDM).
- Confirm the FPML source contains: notional.notionalAmount.amount and notional.notionalAmount.currency (FpML).
- Confirm the proposed CDM representation populates: quantity.value.value and unit.currency.value (CDM tradeLot / priceQuantity).
- Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.
- Confirm the FPML source contains: equity instrumentId / equity id and exchange (FpML).
- Confirm the proposed CDM representation populates: Security.identifier or Observable.identifier with exchange metadata (CDM).
- Confirm the FPML source contains: interestLeg.payerPartyReference / receiverPartyReference (FpML).
- Confirm the proposed CDM representation populates: interestratepayout.payerReceiver.payer / .receiver (CDM).
- Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.
- Confirm the FPML source contains: partyTradeIdentifier.versionedTradeId.tradeId (FpML).
- Confirm the proposed CDM representation populates: assignedIdentifier.identifier.value (CDM).
- Confirm the FPML source contains: FpML date strings (often with trailing 'Z').
- Confirm the proposed CDM representation populates: CDM date strings normalized to YYYY-MM-DD.
- Confirm the FPML source contains: notional.notionalAmount.amount + currency (FpML).
- Confirm the proposed CDM representation populates: tradeLot.quantity.value + unit.currency.value or priceQuantity (CDM).
- Confirm the FPML source contains: partyReference hrefs within legs and payout structures (FpML).
- Confirm the proposed CDM representation populates: explicit payer/receiver or Party1/Party2 role fields (CDM).
- Confirm the FPML source contains: Multiple leg elements in FpML trade (interestLeg, equityLeg, etc.).
- Confirm the proposed CDM representation populates: Multiple payout entries in CDM trade representation.
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Do not use this document to automatically map fields; use it only to explain uncertainty.

## Worked Examples

### equity-swaps/eqs-ex01-single-underlyer-execution-long-form.xml -> equity-swaps/eqs-ex01-single-underlyer-execution-long-form.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - relative date fields mapped (periodMultiplier, period, dayType, businessDayConvention)
  - instrumentId mapped to security identifier
  - interim valuation unadjustedDate list transferred
  - notionalAmount mapped into priceQuantity and tradeLot quantity
  - exchange id normalized (NASDAQ -> NASD)
- Validation:
  - Review uncertainty: Why was exchangeId 'NASDAQ' changed to 'NASD' in target?

### equity-swaps/eqs-ex03-index-quanto-long-form.xml -> equity-swaps/eqs-ex03-index-quanto-long-form.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - periodMultiplier preserved
  - notional moved into tradeLot price/quantity
  - quoted pair and rate preserved
  - index instrumentId preserved
  - dates normalized (trimmed 'Z')
- Validation:
  - Review uncertainty: Why is exchangeId 'EuroNext' mapped to 'XPAR' in CDM?

### equity-swaps/eqs-ex04-zero-strike-long-form.xml -> equity-swaps/eqs-ex04-zero-strike-long-form.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - removed timezone Z
  - periodMultiplier 0 preserved
  - instrumentId -> Security.identifier
  - notional amount and currency mapped
  - strip trailing 'Z' timezone
- Validation:
  - Review uncertainty: FpML exchangeId 'NationalStockExchange' maps to CDM exchange.name 'XNSE' — what rule applied?

## Source Evidence

- Evidence sidecar: `../references/equity-swaps.evidence.json`
