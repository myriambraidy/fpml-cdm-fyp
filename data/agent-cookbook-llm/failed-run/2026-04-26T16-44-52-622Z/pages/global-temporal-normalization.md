# Global FPML -> CDM Temporal Normalization

Use these rules when moving FPML dates, dateTimes, and adjustable-date structures into CDM.

## Promoted Cross-Family Rules

No rules have enough cross-family evidence for promotion yet.

## Family-Specific Evidence

### Effective date unadjustedDate copied

- Rule id: `commodity-derivatives:RULE-001`
- Family: `commodity-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `effectivedate.adjustabledate.unadjusteddate`
- Target CDM paths: `effectivedate.adjustabledate.unadjusteddate`
- Action: Effective (unadjusted) dates in FpML are repeatedly carried into the CDM effectiveDate.adjustableDate.unadjustedDate element without semantic transformation.
- Rationale: Multiple example trades show identical unadjusted date values preserved in CDM effective date fields, indicating a direct copy rule.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `This addresses the unadjustedDate element specifically; businessDayConvention and adjustment rules may also appear separately in examples.`
- Validate: `Confirm the FPML source contains: effectivedate.adjustabledate.unadjusteddate.`, `Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Termination date unadjustedDate copied

- Rule id: `commodity-derivatives:RULE-002`
- Family: `commodity-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `terminationdate.adjustabledate.unadjusteddate`
- Target CDM paths: `terminationdate.adjustabledate.unadjusteddate`
- Action: Termination (unadjusted) dates in FpML are repeatedly carried into the CDM terminationDate.adjustableDate.unadjustedDate element without semantic transformation.
- Rationale: Representative examples consistently preserve the FpML termination unadjusted date in the CDM termination date field, indicating a direct mapping.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `This is specific to unadjustedDate copying; other termination-related metadata (conventions/adjustments) may require additional mapping rules.`
- Validate: `Confirm the FPML source contains: terminationdate.adjustabledate.unadjusteddate.`, `Confirm the proposed CDM representation populates: terminationdate.adjustabledate.unadjusteddate.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.

- Rule id: `commodity-derivatives:TENT-001`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: effective date copied`, `Representative note: effective date value copied`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### termination date copied (direct mapping; terminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate)

- Rule id: `commodity-derivatives:TENT-003`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `termination date copied (direct mapping; terminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: termination date copied`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### effectiveDate unadjustedDate (direct mapping; effectivedate.adjustabledate.unadjusteddate -> effectivedate.adjustabledate.unadjusteddate)

- Rule id: `commodity-derivatives:TENT-006`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `effectiveDate unadjustedDate (direct mapping; effectivedate.adjustabledate.unadjusteddate -> effectivedate.adjustabledate.unadjusteddate)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: effectiveDate unadjustedDate`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### RelativeDate fields nested under adjustableOrRelativeDate

- Rule id: `correlation-swaps:TR-004`
- Family: `correlation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `settlementdate.relativedate.* and relativedate.* fields`
- Target CDM paths: `adjustableorrelativedate.relativedate.* plus businesscenters.businesscenter.value and relativedate.daterelativeto.externalreference`
- Action: Individual relativeDate elements from FpML are re-grouped under an adjustableOrRelativeDate wrapper and tied to business center and daterelativeto references in CDM.
- Rationale: Apply this nesting change transformation when the source-side signal is present.
- Evidence: 2 examples from 4/4 semantic pairs
- Caveats: `This mirrors TENT-002; examples show relative date fields grouped under the CDM adjustableOrRelativeDate construct.`, `Href-to-externalReference conversions are present in some examples and may require resolution logic.`
- Validate: `Confirm the FPML source contains: settlementdate.relativedate.* and relativedate.* fields.`, `Confirm the proposed CDM representation populates: adjustableorrelativedate.relativedate.* plus businesscenters.businesscenter.value and relativedate.daterelativeto.externalreference.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Relative date fields mapped into adjustableOrRelativeDate structure

- Rule id: `correlation-swaps:ENR-002`
- Family: `correlation-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `RelativeDate elements from FpML (including business day conventions, day type, period and multiplier, and business center references) are nested under an adjustableOrRelativeDate wrapper in the CDM, and references are converted to CDM externalReference form where applicable. CDM models use adjustableOrRelativeDate as a single canonical container for relative-date metadata; mapping groups all related relative-date fields under that wrapper.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: RelativeDate elements from FpML (including business day conventions, day type, period and multiplier, and business center references) are nested under an adjustableOrRelativeDate wrapper in the CDM, and references are converted to CDM externalReference form where applicable. CDM models use adjustableOrRelativeDate as a single canonical container for relative-date metadata; mapping groups all related relative-date fields under that wrapper.
- Evidence: 2 examples from 4/4 semantic pairs
- Caveats: `Only observed in two confirmation examples; other variants of relativedate in the folder may require additional handling.`, `Mapping of href-based references to externalReference requires resolution logic (not demonstrated in all examples).`, `Do not treat Relative date fields mapped into adjustableOrRelativeDate structure as a guaranteed direct mapping rule yet.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Settlement terms repeatedly map from relativedate.businesscenters.businesscenter|relativedate.daterelativeto.href|settlementdate.relativedate.businessdayconvention|settlementdate.relativedate.daytype|settlementdate.relativedate.period|settlementdate.relativedate.periodmultiplier into adjustableorrelativedate.relativedate.businessdayconvention|adjustableorrelativedate.relativedate.daytype|adjustableorrelativedate.relativedate.period|adjustableorrelativedate.relativedate.periodmultiplier|businesscenters.businesscenter.value|relativedate.daterelativeto.externalreference.

- Rule id: `correlation-swaps:TENT-002`
- Family: `correlation-swaps`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Settlement terms repeatedly map from relativedate.businesscenters.businesscenter|relativedate.daterelativeto.href|settlementdate.relativedate.businessdayconvention|settlementdate.relativedate.daytype|settlementdate.relativedate.period|settlementdate.relativedate.periodmultiplier into adjustableorrelativedate.relativedate.businessdayconvention|adjustableorrelativedate.relativedate.daytype|adjustableorrelativedate.relativedate.period|adjustableorrelativedate.relativedate.periodmultiplier|businesscenters.businesscenter.value|relativedate.daterelativeto.externalreference.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 4/4 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: relative date fields nested under adjustableOrRelativeDate`, `Representative note: relativeDate fields mapped`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### effectiveDate reshaped into adjustableDate

- Rule id: `credit-derivatives:TR-001`
- Family: `credit-derivatives`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `generalTerms.effectivedate.unadjustedDate (FpML)`
- Target CDM paths: `effectivedate.adjustableDate.unadjustedDate (CDM)`
- Action: Date-like fields under generalTerms.effectivedate.unadjustedDate are moved into an adjustableDate structure under effectivedate.adjustabledate.unadjusteddate and reformatted.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 8 examples from 40/40 semantic pairs
- Caveats: `Normalization commonly strips trailing 'Z' and standardizes to YYYY-MM-DD.`, `High confidence in recurring pattern across multiple trade types.`
- Validate: `Confirm the FPML source contains: generalTerms.effectivedate.unadjustedDate (FpML).`, `Confirm the proposed CDM representation populates: effectivedate.adjustableDate.unadjustedDate (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### reshape effective/termination date locations and normalize format

- Rule id: `credit-derivatives:TR-002`
- Family: `credit-derivatives`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate (FpML)`
- Target CDM paths: `effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate (CDM)`
- Action: Normalization reshapes generalterms.effectivedate.unadjusteddate and scheduledterminationdate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate and terminationdate.adjustabledate.unadjusteddate, with date format normalization.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 7 examples from 40/40 semantic pairs
- Caveats: `Representative behavior: remove trailing 'Z' timezone marker and format as YYYY-MM-DD.`, `Apply consistently where unadjustedDate strings present; business-day adjustments need separate consideration.`
- Validate: `Confirm the FPML source contains: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate (FpML).`, `Confirm the proposed CDM representation populates: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### multiple date fields normalized and relocated

- Rule id: `credit-derivatives:TR-003`
- Family: `credit-derivatives`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate | trade.tradeHeader.tradeDate (FpML)`
- Target CDM paths: `effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate | trade.tradedate.value (CDM)`
- Action: Normalization repeatedly relocates and reformats several date fields: generalterms.effectivedate.unadjusteddate, scheduledterminationdate.adjustabledate.unadjusteddate, and trade.tradeHeader.tradeDate into CDM targets effectivedate.adjustabledate.unadjusteddate, terminationdate.adjustabledate.unadjusteddate, and trade.tradedate.value respectively.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 40/40 semantic pairs
- Caveats: `Consistent step: strip trailing 'Z' and format to ISO date (YYYY-MM-DD).`, `When tradeDate contains timezone info, timezone is removed in examples.`
- Validate: `Confirm the FPML source contains: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate | trade.tradeHeader.tradeDate (FpML).`, `Confirm the proposed CDM representation populates: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate | trade.tradedate.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Normalization repeatedly reshapes generalterms.effectivedate.unadjusteddate|scheduledterminationdate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate.

- Rule id: `credit-derivatives:TENT-004`
- Family: `credit-derivatives`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Normalization repeatedly reshapes generalterms.effectivedate.unadjusteddate|scheduledterminationdate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: remove trailing 'Z', standardize to YYYY-MM-DD`, `Representative note: removed trailing 'Z' from date strings`, `Representative note: Strip trailing 'Z' timezone from dates`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Normalization repeatedly reshapes generalterms.effectivedate.unadjusteddate|scheduledterminationdate.adjustabledate.unadjusteddate|trade.tradeheader.tradedate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate|trade.tradedate.value.

- Rule id: `credit-derivatives:TENT-009`
- Family: `credit-derivatives`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Normalization repeatedly reshapes generalterms.effectivedate.unadjusteddate|scheduledterminationdate.adjustabledate.unadjusteddate|trade.tradeheader.tradedate into effectivedate.adjustabledate.unadjusteddate|terminationdate.adjustabledate.unadjusteddate|trade.tradedate.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: strip trailing 'Z' and format ISO date`, `Representative note: remove trailing Z and format as YYYY-MM-DD`, `Representative note: strip 'Z' and format YYYY-MM-DD`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Date-like fields repeatedly normalize from generalterms.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.

- Rule id: `credit-derivatives:TENT-003`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Date-like fields repeatedly normalize from generalterms.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 8 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: effective date mapped, timezone Z removed`, `Representative note: effective date mapped and reformatted`, `Representative note: unadjusted effective date`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Scheduled termination date values found in FpML are mapped into CDM terminationDate.adjustableDate.unadjustedDate, with normalization applied to format. (scheduledTerminationDate.adjustableDate.unadjustedDate -> terminationDate.adjustableDate.unadjustedDate)

- Rule id: `credit-derivatives:TENT-005`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Scheduled termination date values found in FpML are mapped into CDM terminationDate.adjustableDate.unadjustedDate, with normalization applied to format. (scheduledTerminationDate.adjustableDate.unadjustedDate -> terminationDate.adjustableDate.unadjustedDate)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 5 examples from 40/40 semantic pairs
- Caveats: `CDM expects a terminationDate field; scheduledTerminationDate in FpML is the semantic equivalent and is therefore normalized into the CDM terminationDate slot.`, `Date strings are typically normalized (see repeated normalizations): time zone designator 'Z' is removed and format standardized to YYYY-MM-DD.`, `Confirm handling when FpML provides business-day adjustments or offsets in addition to raw unadjusted dates.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### termination date normalized (normalized mapping; scheduledterminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate)

- Rule id: `credit-derivatives:TENT-006`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `termination date normalized (normalized mapping; scheduledterminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 5 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: termination date normalized`, `Representative note: Termination date normalized`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

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
- Action: Map expiry date, time and business center into CDM exerciseTerms.expiration fields and associated time components.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `High-confidence mapping in examples; business center and time components are preserved in CDM exerciseTerms.`
- Validate: `Confirm the FPML source contains: expirydatetime.expiryDate and expiryTime and businessCenter (FpML).`, `Confirm the proposed CDM representation populates: adjustableDate.adjustedDate.value and exerciseterms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Split/Multiple settlement entries -> aggregated quantity

- Rule id: `fx-derivatives:TR-006`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `splitSettlement / multiple paymentAmount entries (FpML)`
- Target CDM paths: `single trade.tradeLot.quantity or aggregated quantity entries (CDM)`
- Action: When FpML includes splitSettlement entries or multiple payment legs, the mapping sometimes merges these into a single CDM quantity or aggregates tradeLot entries.
- Rationale: Apply this merge transformation when the source-side signal is present.
- Evidence: 2 examples from 25/25 semantic pairs
- Caveats: `Examples show merged results but do not document the aggregation logic for all split cases (e.g., rounding, ordering, or omission of sub-fields).`
- Validate: `Confirm the FPML source contains: splitSettlement / multiple paymentAmount entries (FpML).`, `Confirm the proposed CDM representation populates: single trade.tradeLot.quantity or aggregated quantity entries (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Normalization repeatedly reshapes trade.tradeheader.tradedate into trade.tradedate.value.

- Rule id: `fx-derivatives:TENT-003`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Normalization repeatedly reshapes trade.tradeheader.tradedate into trade.tradedate.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: removed trailing 'Z' from date`, `Representative note: trimmed trailing Z from date`, `Representative note: Stripped trailing 'Z' to produce date '2001-11-12'.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Date-like fields repeatedly normalize from expirydatetime.expirytime.businesscenter|expirydatetime.expirytime.hourminutetime|fxdigitaloption.expirydatetime.expirydate into adjustabledate.adjusteddate.value|exerciseterms.expirationtime.hourminutetime|expirationtime.businesscenter.value.

- Rule id: `fx-derivatives:TENT-005`
- Family: `fx-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Date-like fields repeatedly normalize from expirydatetime.expirytime.businesscenter|expirydatetime.expirytime.hourminutetime|fxdigitaloption.expirydatetime.expirydate into adjustabledate.adjusteddate.value|exerciseterms.expirationtime.hourminutetime|expirationtime.businesscenter.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Expiry date/time and business center map to exerciseTerms expiration.`, `Representative note: expiry date and time normalized into exerciseTerms`, `Representative note: expiry date, time, center map to exercise expiration fields`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Date normalization: unadjustedDate -> adjustableDate.unadjustedDate (YYYY-MM-DD)

- Rule id: `inflation-swaps:RULE-001`
- Family: `inflation-swaps`
- Kind: `mapping`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `calculationperioddates.effectivedate.unadjusteddate (FpML datetime with timezone)`
- Target CDM paths: `effectivedate.adjustabledate.unadjusteddate (CDM date formatted YYYY-MM-DD)`
- Action: Dates from multiple FpML examples are copied into CDM unadjusted date fields after removing timezone and trimming to date (YYYY-MM-DD).
- Rationale: CDM fields expect date-only values; repeated examples show timezone-stripping and formatting applied deterministically.
- Evidence: 4 examples from 5/5 semantic pairs
- Caveats: `Some datetime inputs include timezones and times - transformation removes timezone and time component.`, `Ensure resulting value is validated as ISO date (YYYY-MM-DD).`
- Validate: `Confirm the FPML source contains: calculationperioddates.effectivedate.unadjusteddate (FpML datetime with timezone).`, `Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate (CDM date formatted YYYY-MM-DD).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Date/time normalization and trimming

- Rule id: `inflation-swaps:TR-001`
- Family: `inflation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `FpML datetime fields (e.g., calculationPeriodDates.effectivedate.unadjusteddate with timezone)`
- Target CDM paths: `CDM adjustableDate.unadjustedDate as date-only string (YYYY-MM-DD)`
- Action: Strip timezone and time component from FpML datetimes and format as date (YYYY-MM-DD) when populating CDM unadjusted date fields.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 5/5 semantic pairs
- Caveats: `Representative notes indicate removal of timezone is applied consistently.`, `Be explicit about validating resulting date format after transformation.`
- Validate: `Confirm the FPML source contains: FpML datetime fields (e.g., calculationPeriodDates.effectivedate.unadjusteddate with timezone).`, `Confirm the proposed CDM representation populates: CDM adjustableDate.unadjustedDate as date-only string (YYYY-MM-DD).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Timezone removal as normalization

- Rule id: `inflation-swaps:TR-002`
- Family: `inflation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `Normalization cue inferred from source-side values.`
- Target CDM paths: `Timezone removal as normalization`
- Action: Removal of timezone and trimming datetimes to date is a normalization behavior applied consistently in examples.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 5/5 semantic pairs
- Caveats: `Normalization should be implemented deterministically (strip timezone, drop time component).`, `Confirm timezone handling policy if any timezone-aware logic is required.`
- Validate: `Confirm the FPML source contains: Normalization cue inferred from source-side values..`, `Confirm the proposed CDM representation populates: Timezone removal as normalization.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.

- Rule id: `inflation-swaps:TENT-001`
- Family: `inflation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a strong recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 5/5 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Strip timezone and format as YYYY-MM-DD`, `Representative note: strip timezone from date`, `Representative note: remove timezone from datetime`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Payer/receiver role inversion

- Rule id: `inflation-swaps:VAR-001`
- Family: `inflation-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `Although party hrefs are resolved into CDM payer/receiver roles consistently, multiple examples show the CDM payer/receiver assignment is reversed relative to the FpML href ordering.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Mapping logic should account for possible systematic inversion; do not assume first href -> payer without verifying role semantics. Treat inversion as an important exception to validate.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Mapping logic should account for possible systematic inversion; do not assume first href -> payer without verifying role semantics. Treat inversion as an important exception to validate.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Remove timezone suffix from date strings

- Rule id: `total-return-swaps:TR-001`
- Family: `total-return-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `FpML unadjusted/adjusted dates with timezone offsets`
- Target CDM paths: `CDM date strings without timezone offset`
- Action: Date/time strings in FpML that include timezone offsets are normalized by removing the timezone suffix when populating CDM date fields.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `Described explicitly as an important transformation in multiple pair highlights.`, `Consider canonicalization of date format as a deterministic step prior to CDM population.`
- Validate: `Confirm the FPML source contains: FpML unadjusted/adjusted dates with timezone offsets.`, `Confirm the proposed CDM representation populates: CDM date strings without timezone offset.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`


## Do Not Assume

- Do not generalize a family-specific rule unless this global document says it is promoted.

## Validation Checklist

- Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.
- If the source signal does not match the rule, do not apply the rule.
