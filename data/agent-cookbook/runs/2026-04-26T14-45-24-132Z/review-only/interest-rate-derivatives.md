# FPML -> CDM Cookbook: interest-rate-derivatives

## Status

- Operational status: `review_only`
- Agent use policy: Agents must not apply these rules automatically; use only as background evidence for analyst review.
- Semantic success rate: 100%
- Draft quality: `good`
- Draft publication: `failed_integrity_validation`
- Readiness reasons: `not_final_publication`, `integrity_failed`, `high_open_question_density`, `critical_ambiguity`

## Trigger Signals

- interest-rate-derivatives
- FpML top-level section: party
- FpML top-level section: trade
- trade > swap (59 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- trade > swap (178 paths)
- trade > swap (142 paths)
- trade > swap (69 paths)
- trade > swap (75 paths)
- trade > swap (167 paths)
- trade
- party

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: party, trade.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Apply recurring mapping rules only when the exact source cues appear in the document.
4. Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
5. Assemble the result under repeated CDM scaffolding such as meta, trade.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

### Notional -> tradeLot.quantity

- Rule id: `interest-rate-derivatives:RULE-001`
- Family: `interest-rate-derivatives`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue`
- Target CDM paths: `tradeLot.quantity.value|unit.currency.value`
- Action: Notional amounts (value + currency) in FpML are repeatedly represented as a tradeLot quantity in the CDM with numeric value and currency unit.
- Rationale: Trade-level economic size is preserved by mapping FpML notional constructs to CDM tradeLot.quantity which captures amount+currency.
- Evidence: 4 examples from 11/11 semantic pairs
- Caveats: `Requires both numeric initialValue and an associated currency to form a CDM quantity.`, `FpML notional schedule variants (steps, long-stub) may require aggregation or selection logic not captured by a single rule.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`
- Validate: `Confirm the FPML source contains: notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue.`, `Confirm the proposed CDM representation populates: tradeLot.quantity.value|unit.currency.value.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Swap stream payer/receiver -> interestratepayout.payerReceiver

- Rule id: `interest-rate-derivatives:RULE-002`
- Family: `interest-rate-derivatives`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference`
- Target CDM paths: `interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver`
- Action: Party references used on swapStream elements are resolved into CDM payer/receiver roles on interest rate payouts.
- Rationale: Each swapStream represents a side of the swap; mapping its party hrefs to payer/receiver yields the CDM representation of counterparty cashflow direction.
- Evidence: 4 examples from 11/11 semantic pairs
- Caveats: `Representative examples show consistent href use, but derived CDM role labels (e.g., 'Party1') differ from FpML partyId values - mapping of identifiers is inconsistent across examples.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference.`, `Confirm the proposed CDM representation populates: interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Strip timezone from effectivedate values

- Rule id: `interest-rate-derivatives:RULE-003`
- Family: `interest-rate-derivatives`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `calculationperioddates.effectivedate.unadjusteddate`
- Target CDM paths: `effectivedate.adjustabledate.unadjusteddate`
- Action: Date/time strings in FpML that include timezone suffixes (e.g., trailing 'Z') are normalized by removing the timezone before populating CDM date fields.
- Rationale: CDM date fields in examples use date-only or normalized datetime formats; removing trailing timezone characters produces the expected CDM format.
- Evidence: 3 examples from 11/11 semantic pairs
- Caveats: `Normalization assumes UTC 'Z' suffix or similar trailing timezone tokens; other timezone encodings are not evidenced.`, `Time-of-day information is effectively lost when trimming to date-only representations.`
- Validate: `Confirm the FPML source contains: calculationperioddates.effectivedate.unadjusteddate.`, `Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Strip timezone from expirationdate values

- Rule id: `interest-rate-derivatives:RULE-004`
- Family: `interest-rate-derivatives`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `expirationdate.adjustabledate.unadjusteddate`
- Target CDM paths: `expirationdate.adjustabledate.unadjusteddate`
- Action: Expiration dates for options in FpML are normalized by removing timezone suffixes before mapping into CDM expiration date fields.
- Rationale: CDM examples show expiration dates without the trailing timezone; the strip-normalize step produces consistent formatting expected by CDM.
- Evidence: 3 examples from 11/11 semantic pairs
- Caveats: `Normalization is demonstrated on examples with trailing 'Z'; other timezone formats are not evidenced.`, `Ensure that business rules about timezone interpretation are satisfied before removing timezone info.`
- Validate: `Confirm the FPML source contains: expirationdate.adjustabledate.unadjusteddate.`, `Confirm the proposed CDM representation populates: expirationdate.adjustabledate.unadjusteddate.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`


## Transformations

### Notional value normalization to tradeLot quantity

- Rule id: `interest-rate-derivatives:TR-001`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `notionalschedule.notionalstepschedule.initialvalue + currency`
- Target CDM paths: `tradeLot.quantity.value + tradeLot.quantity.unit.currency`
- Action: Converts FpML notional schedules (value + currency) into CDM tradeLot.quantity entries (numeric value + currency unit).
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 11/11 semantic pairs
- Caveats: `Representative note: notional amount and currency mapped to tradeLot quantity`, `Aggregation rules for stepped notionals are not fully evidenced.`
- Validate: `Confirm the FPML source contains: notionalschedule.notionalstepschedule.initialvalue + currency.`, `Confirm the proposed CDM representation populates: tradeLot.quantity.value + tradeLot.quantity.unit.currency.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Resolve swapStream party href to CDM payer/receiver

- Rule id: `interest-rate-derivatives:TR-002`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference`
- Target CDM paths: `interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver`
- Action: Resolves FpML swapStream payer/receiver hrefs to CDM InterestRatePayout payerReceiver roles.
- Rationale: Apply this reference resolution transformation when the source-side signal is present.
- Evidence: 4 examples from 11/11 semantic pairs
- Caveats: `Representative note: swapStream payer/receiver hrefs map to CDM payerReceiver`, `Identifier mapping between FpML partyId and CDM.party.partyId is inconsistent across examples.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference.`, `Confirm the proposed CDM representation populates: interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Effectivedate timezone trim

- Rule id: `interest-rate-derivatives:TR-003`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `calculationperioddates.effectivedate.unadjusteddate (may include trailing 'Z')`
- Target CDM paths: `effectivedate.adjustabledate.unadjusteddate (date-only/normalized)`
- Action: Remove trailing timezone indicators (e.g., 'Z') from calculation period effective dates before mapping to CDM date fields.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 11/11 semantic pairs
- Caveats: `Representative note: Trim timezone 'Z' from date string`, `Time-of-day/timezone information is not preserved in the CDM examples.`
- Validate: `Confirm the FPML source contains: calculationperioddates.effectivedate.unadjusteddate (may include trailing 'Z').`, `Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate (date-only/normalized).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Expiration date timezone trim

- Rule id: `interest-rate-derivatives:TR-004`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `expirationdate.adjustabledate.unadjusteddate`
- Target CDM paths: `expirationdate.adjustabledate.unadjusteddate (normalized)`
- Action: Remove timezone suffix from option expiration dates when mapping to CDM expiration fields.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 11/11 semantic pairs
- Caveats: `Representative note: Strip timezone from datetime`, `Preserves date semantics expected by CDM while removing timezone suffix.`
- Validate: `Confirm the FPML source contains: expirationdate.adjustabledate.unadjusteddate.`, `Confirm the proposed CDM representation populates: expirationdate.adjustabledate.unadjusteddate (normalized).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Fixed rate -> price normalization

- Rule id: `interest-rate-derivatives:TR-005`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `calculation.fixedrateschedule.initialvalue`
- Target CDM paths: `price.value.value`
- Action: Map fixed-rate schedule initial values into CDM price.value to represent fixed leg or option strike rates.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Representative note: Fixed rate value mapped to CDM price`, `Unit/scale consistency (e.g., decimal vs percent) should be verified when applying this rule.`
- Validate: `Confirm the FPML source contains: calculation.fixedrateschedule.initialvalue.`, `Confirm the proposed CDM representation populates: price.value.value.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Swaption buyer reference resolution

- Rule id: `interest-rate-derivatives:TR-006`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `trade.swaption.buyerpartyreference`
- Target CDM paths: `optionpayout.buyerseller.buyer`
- Action: Resolve trade.swaption.buyerpartyreference into CDM option payout buyer field for option contract mapping.
- Rationale: Apply this reference resolution transformation when the source-side signal is present.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Representative note: buyerPartyReference -> buyer`, `Some examples show apparent payer/receiver inversions between premium and option payout which must be validated.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: trade.swaption.buyerpartyreference.`, `Confirm the proposed CDM representation populates: optionpayout.buyerseller.buyer.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Trade/tradedate normalization

- Rule id: `interest-rate-derivatives:TR-007`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `trade.tradeheader.tradedate`
- Target CDM paths: `trade.tradedate.value`
- Action: Normalize trade.tradeheader.tradedate by stripping trailing timezone characters and formatting to CDM trade.tradedate.value.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Representative note: strip trailing 'Z' and normalize to YYYY-MM-DD`, `Applies to trade header dates observed in swap examples.`
- Validate: `Confirm the FPML source contains: trade.tradeheader.tradedate.`, `Confirm the proposed CDM representation populates: trade.tradedate.value.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.

- Rule id: `interest-rate-derivatives:TENT-003`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Trim timezone 'Z' from date string`, `Representative note: strip trailing 'Z' from date`, `Representative note: strip timezone from datetime`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Normalization repeatedly reshapes expirationdate.adjustabledate.unadjusteddate into expirationdate.adjustabledate.unadjusteddate.

- Rule id: `interest-rate-derivatives:TENT-004`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Normalization repeatedly reshapes expirationdate.adjustabledate.unadjusteddate into expirationdate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Strip timezone from datetime`, `Representative note: removed timezone suffix 'Z' from date`, `Representative note: removed trailing 'Z' timezone`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate|trade.tradeheader.tradedate into effectivedate.adjustabledate.unadjusteddate|trade.tradedate.value.

- Rule id: `interest-rate-derivatives:TENT-011`
- Family: `interest-rate-derivatives`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate|trade.tradeheader.tradedate into effectivedate.adjustabledate.unadjusteddate|trade.tradedate.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Strip trailing 'Z' from dates`, `Representative note: strip trailing 'Z' and normalize to YYYY-MM-DD`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Variants And Branches

### Party identifier label variance

- Rule id: `interest-rate-derivatives:VAR-001`
- Family: `interest-rate-derivatives`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `CDM uses short role-like labels (e.g., 'Party1', 'Party2', 'PartyA') instead of FpML partyId values in examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Significant - mapping logic must allow for label generation or external enrichment; do not assume CDM.party.partyId equals FpML partyId.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 3 examples from 11/11 semantic pairs
- Caveats: `Significant - mapping logic must allow for label generation or external enrichment; do not assume CDM.party.partyId equals FpML partyId.`
- Human review when: `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Payer/receiver apparent inversion in option premium vs payout

- Rule id: `interest-rate-derivatives:VAR-002`
- Family: `interest-rate-derivatives`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Some swaption examples indicate that premium payer values in FpML do not always align with CDM optionPayout.payerReceiver mapping (possible inversion).`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: High - mapping of premium vs option payout roles must be validated case-by-case; do not apply an assumption of consistent direction without checks.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `High - mapping of premium vs option payout roles must be validated case-by-case; do not apply an assumption of consistent direction without checks.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Trade identifier omission or substitution

- Rule id: `interest-rate-derivatives:VAR-003`
- Family: `interest-rate-derivatives`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FpML tradeId values (e.g., TW9235, TRN12000) are sometimes absent or replaced by different CDM tradeIdentifier values (e.g., SW2000).`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Moderate - do not assume a 1:1 mapping for trade identifiers; mapping may require external provenance or enrichment.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Moderate - do not assume a 1:1 mapping for trade identifiers; mapping may require external provenance or enrichment.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`


## Enrichment And Defaults

### Additional CDM tradeIdentifier issuer entries

- Rule id: `interest-rate-derivatives:ENR-001`
- Family: `interest-rate-derivatives`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `Examples contain multiple CDM tradeIdentifier issuer entries without a clear corresponding FpML source, indicating possible enrichment or synthetic identifiers.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Examples contain multiple CDM tradeIdentifier issuer entries without a clear corresponding FpML source, indicating possible enrichment or synthetic identifiers.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Preserve provenance of any generated identifiers and avoid assuming FpML contains the authoritative issuer values.`, `Flag generated identifiers for downstream review.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### CDM.party.partyId LEI enrichment

- Rule id: `interest-rate-derivatives:ENR-002`
- Family: `interest-rate-derivatives`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `CDM party.partyId entries in examples appear to contain LEIs or other normalized identifiers that are not present in the FpML party definitions.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM party.partyId entries in examples appear to contain LEIs or other normalized identifiers that are not present in the FpML party definitions.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Treat CDM party identifiers as potentially externally-sourced; do not infer source mapping rules from the current example set alone.`, `Preserve original FpML partyId in intermediate artifacts to enable reconciliation.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Generated role labels (Party1/Party2/PartyA)

- Rule id: `interest-rate-derivatives:ENR-003`
- Family: `interest-rate-derivatives`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `CDM examples use generated role labels (e.g., 'Party1','Party2','PartyA') rather than the raw FpML partyId values, suggesting a deterministic label generation or anonymization step.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM examples use generated role labels (e.g., 'Party1','Party2','PartyA') rather than the raw FpML partyId values, suggesting a deterministic label generation or anonymization step.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Do not overwrite or discard original FpML party identifiers when producing CDM parties; maintain mapping metadata.`, `If label-generation is applied, document the algorithm or source used for reproducibility.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Cautions And Tentative Signals

### Economic terms repeatedly reshape from notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue into quantity.value.value|unit.currency.value.

- Rule id: `interest-rate-derivatives:TENT-001`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Economic terms repeatedly reshape from notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue into quantity.value.value|unit.currency.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: notional amount and currency mapped to tradeLot quantity`, `Representative note: notional amount and currency`, `Representative note: notional amount and currency -> tradeLot quantity`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Party references repeatedly resolve from swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.

- Rule id: `interest-rate-derivatives:TENT-002`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Party references repeatedly resolve from swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: swapStream payer/receiver hrefs map to CDM payerReceiver`, `Representative note: FpML payer/receiver mapped to CDM payerReceiver`, `Representative note: party hrefs map to payer/receiver roles`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Both trade tradedate and calculation period effective dates have trailing timezone characters removed and are normalized to a CDM date format. (calculationperioddates.effectivedate.unadjusteddate|trade.tradeheader.tradedate -> effectivedate.adjustabledate.unadjusteddate|trade.tradedate.value)

- Rule id: `interest-rate-derivatives:TENT-005`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Both trade tradedate and calculation period effective dates have trailing timezone characters removed and are normalized to a CDM date format. (calculationperioddates.effectivedate.unadjusteddate|trade.tradeheader.tradedate -> effectivedate.adjustabledate.unadjusteddate|trade.tradedate.value)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Examples with long stubs and trade headers both applied the same date normalization logic to match CDM representation.`, `Normalization is demonstrated as removing trailing 'Z' and normalizing to YYYY-MM-DD. Other timezone or datetime-preserving behaviors are not evidenced.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Buyer references in FpML swaption constructs map to the CDM option payout buyer role. (trade.swaption.buyerpartyreference -> optionpayout.buyerseller.buyer)

- Rule id: `interest-rate-derivatives:TENT-006`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Buyer references in FpML swaption constructs map to the CDM option payout buyer role. (trade.swaption.buyerpartyreference -> optionpayout.buyerseller.buyer)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Examples consistently map buyerPartyReference into the CDM buyer field for option payouts.`, `Some examples raise questions about apparent payer/receiver inversions for premium vs option payout - buyer mapping is consistent in observed cases but role inversion issues remain in other fields.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Date-like fields repeatedly normalize from expirationdate.adjustabledate.unadjusteddate into expirationdate.adjustabledate.unadjusteddate.

- Rule id: `interest-rate-derivatives:TENT-007`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Date-like fields repeatedly normalize from expirationdate.adjustabledate.unadjusteddate into expirationdate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Expiration date mapped with format normalization`, `Representative note: expiration date normalized format`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Economic terms repeatedly reshape from calculation.fixedrateschedule.initialvalue into price.value.value.

- Rule id: `interest-rate-derivatives:TENT-008`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Economic terms repeatedly reshape from calculation.fixedrateschedule.initialvalue into price.value.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Fixed rate value mapped to CDM price`, `Representative note: fixed rate initialValue -> tradeLot price`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Expiration dates are consistently normalized to the CDM date format (strip trailing timezone and possibly convert to YYYY-MM-DD). (expirationdate.adjustabledate.unadjusteddate -> expirationdate.adjustabledate.unadjusteddate)

- Rule id: `interest-rate-derivatives:TENT-009`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Expiration dates are consistently normalized to the CDM date format (strip trailing timezone and possibly convert to YYYY-MM-DD). (expirationdate.adjustabledate.unadjusteddate -> expirationdate.adjustabledate.unadjusteddate)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Two swaption examples explicitly show the same normalization step applied to expiration dates to match CDM date formatting.`, `Applies to observed examples; broader date/time edge-cases are not present in the evidence set.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Fixed-rate values used in option underlying or fixed legs are mapped into CDM price fields representing the fixed rate as a numeric price. (calculation.fixedrateschedule.initialvalue -> price.value.value)

- Rule id: `interest-rate-derivatives:TENT-010`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Fixed-rate values used in option underlying or fixed legs are mapped into CDM price fields representing the fixed rate as a numeric price. (calculation.fixedrateschedule.initialvalue -> price.value.value)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `CDM represents fixed economic parameters for pricing as price.value; mapping initial fixed rate into price preserves the economic parameter.`, `Rate units and scaling assumptions must be consistent (e.g., 0.0585 -> 5.85%); examples show numeric mapping but not unit conversion rules.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Party references repeatedly resolve from trade.swaption.buyerpartyreference into optionpayout.buyerseller.buyer.

- Rule id: `interest-rate-derivatives:TENT-012`
- Family: `interest-rate-derivatives`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Party references repeatedly resolve from trade.swaption.buyerpartyreference into optionpayout.buyerseller.buyer.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 11/11 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Buyer party mapped to CDM buyer`, `Representative note: buyerPartyReference -> buyer`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Do Not Assume

- Do not treat Additional CDM tradeIdentifier issuer entries as a guaranteed direct mapping rule yet.
- Do not treat CDM.party.partyId LEI enrichment as a guaranteed direct mapping rule yet.
- Do not treat Generated role labels (Party1/Party2/PartyA) as a guaranteed direct mapping rule yet.
- FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?
- Why does CDM use 'Party1'/'Party2' strings instead of partyId values?
- Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not apply this tentative pattern without matching source evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: Mapping of FpML partyId to CDM.party.partyId (Party1/Party2/LEI differences) - evidence shows inconsistent identifier handling.
- Do not treat as stable: Trade identifier provenance and mapping - some FpML tradeIds are omitted or replaced in CDM.
- Do not treat as stable: Role inversion between premium payer and option payout payerReceiver observed in some swaption examples - requires case-by-case validation.
- Do not treat as stable: Any assumption that CDM identifiers are present in FpML without external enrichment - likely untrue given examples.
- Do not assume enrichment/default behavior for Additional CDM tradeIdentifier issuer entries without source evidence or analyst approval.
- Do not assume enrichment/default behavior for CDM.party.partyId LEI enrichment without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Generated role labels (Party1/Party2/PartyA) without source evidence or analyst approval.

## Human Review Triggers

- FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?
- Why does CDM use 'Party1'/'Party2' strings instead of partyId values?
- Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
- Mapping of payer/receiver labels (Party1/Party2) to FpML hrefs unclear
- CDM party.partyId LEIs differ from FpML partyId values; mapping unclear
- Multiple CDM tradeIdentifier issuer entries lack clear FpML source
- How were Party1/Party2 labels derived from FpML party hrefs?
- Why FpML partyId values not reflected as same identifiers in CDM?
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- Party role or payment direction affects economic meaning.
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?
- Check unresolved question: Why does CDM use 'Party1'/'Party2' strings instead of partyId values?
- Check unresolved question: Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
- Check unresolved question: Mapping of payer/receiver labels (Party1/Party2) to FpML hrefs unclear
- Check unresolved question: CDM party.partyId LEIs differ from FpML partyId values; mapping unclear
- Check unresolved question: Multiple CDM tradeIdentifier issuer entries lack clear FpML source
- Confirm the FPML source contains: notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue.
- Confirm the proposed CDM representation populates: tradeLot.quantity.value|unit.currency.value.
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.
- Confirm the FPML source contains: swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference.
- Confirm the proposed CDM representation populates: interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.
- Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.
- Confirm the FPML source contains: calculationperioddates.effectivedate.unadjusteddate.
- Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate.
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: expirationdate.adjustabledate.unadjusteddate.
- Confirm the proposed CDM representation populates: expirationdate.adjustabledate.unadjusteddate.
- Confirm the FPML source contains: notionalschedule.notionalstepschedule.initialvalue + currency.
- Confirm the proposed CDM representation populates: tradeLot.quantity.value + tradeLot.quantity.unit.currency.
- Confirm the FPML source contains: calculationperioddates.effectivedate.unadjusteddate (may include trailing 'Z').
- Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate (date-only/normalized).
- Confirm the proposed CDM representation populates: expirationdate.adjustabledate.unadjusteddate (normalized).
- Confirm the FPML source contains: calculation.fixedrateschedule.initialvalue.
- Confirm the proposed CDM representation populates: price.value.value.
- Confirm the FPML source contains: trade.swaption.buyerpartyreference.
- Confirm the proposed CDM representation populates: optionpayout.buyerseller.buyer.
- Confirm the FPML source contains: trade.tradeheader.tradedate.
- Confirm the proposed CDM representation populates: trade.tradedate.value.
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Do not use this document to automatically map fields; use it only to explain uncertainty.

## Worked Examples

### interest-rate-derivatives/ird-ex01-vanilla-swap.xml -> interest-rate-derivatives/ird-ex01-vanilla-swap.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - tradeDate mapped and normalized (Z removed)
  - swapStream payer/receiver hrefs map to CDM payerReceiver
  - notional amount and currency mapped to tradeLot quantity
  - floating rate index and tenor mapped to observable index
  - removed trailing Z from date
- Validation:
  - Review uncertainty: FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?

### interest-rate-derivatives/ird-ex02-stub-amort-swap.xml -> interest-rate-derivatives/ird-ex02-stub-amort-swap.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - FpML payer/receiver mapped to CDM payerReceiver
  - Notional step schedule converted to dated quantity values
  - Floating index and tenor moved into observable index structure
  - Strip trailing 'Z' from dates
- Validation:
  - Review uncertainty: Why does CDM use 'Party1'/'Party2' strings instead of partyId values?

### interest-rate-derivatives/ird-ex03-compound-swap.xml -> interest-rate-derivatives/ird-ex03-compound-swap.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - Notional initialValue maps to tradeLot quantity value
  - Fixed rate 0.0585 maps to CDM fixedRate
  - Floating index USD-LIBOR-BBA maps to CDM index identifier
  - Date normalized (removed trailing Z)
  - Two swapStream elements become two InterestRatePayouts
- Validation:
  - Review uncertainty: Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
  - Review uncertainty: Mapping of payer/receiver labels (Party1/Party2) to FpML hrefs unclear

## Source Evidence

- Evidence sidecar: `../references/interest-rate-derivatives.evidence.json`
