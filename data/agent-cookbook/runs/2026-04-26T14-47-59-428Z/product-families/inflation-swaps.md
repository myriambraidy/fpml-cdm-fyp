# FPML -> CDM Cookbook: inflation-swaps

## Status

- Operational status: `pilot_only`
- Agent use policy: Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.
- Semantic success rate: 100%
- Draft quality: `strong`
- Draft publication: `success`
- Readiness reasons: `high_open_question_density`

## Trigger Signals

- inflation-swaps
- FpML top-level section: header
- FpML top-level section: party
- FpML top-level section: trade
- trade > swap (82 paths)
- party > account (6 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)
- header
- trade
- party

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: header, party, trade.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Apply recurring mapping rules only when the exact source cues appear in the document.
4. Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
5. Assemble the result under repeated CDM scaffolding such as meta, trade, transferHistory.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

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

### Party reference resolution: swapstream payer/receiver href -> interestratepayout.payerreceiver.payer|receiver

- Rule id: `inflation-swaps:RULE-002`
- Family: `inflation-swaps`
- Kind: `mapping`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href (FpML party hrefs)`
- Target CDM paths: `interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role labels/externalReference)`
- Action: Party hrefs are consistently resolved into CDM payer/receiver role entries. Multiple examples show this resolution and that the order/assignment may be inverted relative to the raw href order.
- Rationale: FpML uses href references to identify payer/receiver; CDM represents explicit payer/receiver role objects, so hrefs are mapped to those objects. Repeated examples indicate a consistent mapping rule was applied (with inversion in some outputs).
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Several outputs show the payer/receiver assignment reversed versus the original hrefs - treat inversion as active behavior to investigate rather than an isolated error.`, `Mapping should preserve party identity (externalKey/partyId) even when role assignment appears inverted.`
- Human review when: `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href (FpML party hrefs).`, `Confirm the proposed CDM representation populates: interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role labels/externalReference).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Trade identifier copy: tradeHeader.tradeId -> assignedIdentifier.identifier.value

- Rule id: `inflation-swaps:RULE-003`
- Family: `inflation-swaps`
- Kind: `mapping`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `tradeheader.partytradeidentifier.tradeid (FpML tradeId)`
- Target CDM paths: `assignedidentifier.identifier.value (CDM tradeIdentifier/assignedIdentifier value)`
- Action: FpML tradeId values are repeatedly copied into CDM assignedIdentifier/identifier.value fields.
- Rationale: Trade identifiers are preserved to maintain traceability; examples show direct copying of FpML tradeId into CDM identifier structures.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `CDM may include additional identifier metadata (scheme) not present in the FpML field - mapping preserves core id value but external scheme population may vary.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: tradeheader.partytradeidentifier.tradeid (FpML tradeId).`, `Confirm the proposed CDM representation populates: assignedidentifier.identifier.value (CDM tradeIdentifier/assignedIdentifier value).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`


## Transformations

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

### Copy tradeId into assignedIdentifier

- Rule id: `inflation-swaps:TR-003`
- Family: `inflation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `tradeheader.partytradeidentifier.tradeid (FpML)`
- Target CDM paths: `tradeIdentifier.assignedIdentifier.identifier.value (CDM)`
- Action: Copy FpML tradeId values into CDM assignedIdentifier.identifier.value (preserve identifier value).
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Examples show direct copying; scheme or namespace for assignedIdentifier may need separate handling.`
- Validate: `Confirm the FPML source contains: tradeheader.partytradeidentifier.tradeid (FpML).`, `Confirm the proposed CDM representation populates: tradeIdentifier.assignedIdentifier.identifier.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Party href resolution to payer/receiver role

- Rule id: `inflation-swaps:TR-004`
- Family: `inflation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href`
- Target CDM paths: `interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role entries)`
- Action: Resolve FpML party hrefs used in swapStream payer/receiver references into CDM payer/receiver role objects (party.externalKey or partyId).
- Rationale: Apply this reference resolution transformation when the source-side signal is present.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Outputs frequently map href -> role label, but examples show role assignment may be inverted; mapping must reliably reference the correct party object even if role order differs.`
- Human review when: `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href.`, `Confirm the proposed CDM representation populates: interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role entries).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

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


## Variants And Branches

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

### Unmapped bondReference

- Rule id: `inflation-swaps:VAR-002`
- Family: `inflation-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `Some FpML fields such as bondReference appear in inputs but do not have an obvious CDM target in the provided examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Fields without repeated mapping evidence should be treated as exceptions; avoid inventing CDM targets without additional mappings or stakeholder guidance.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 1 examples from 5/5 semantic pairs
- Caveats: `Fields without repeated mapping evidence should be treated as exceptions; avoid inventing CDM targets without additional mappings or stakeholder guidance.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`


## Enrichment And Defaults

### Unmapped interpolation/publication metadata

- Rule id: `inflation-swaps:ENR-001`
- Family: `inflation-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Index source, mainPublication and interpolationMethod fields in FpML are present in inputs but their CDM targets are unclear or not represented in examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as unclear; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Index source, mainPublication and interpolationMethod fields in FpML are present in inputs but their CDM targets are unclear or not represented in examples.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Do not assume these fields are omitted intentionally; seek domain guidance on where such metadata should go in CDM (if at all).`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Quantity scaling hypothesis

- Rule id: `inflation-swaps:ENR-002`
- Family: `inflation-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Observed CDM quantity values (e.g., 1000000) may be derived by scaling FpML input values (example mentions initialValue 1). The transformation is not explicitly shown but is suspected.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Observed CDM quantity values (e.g., 1000000) may be derived by scaling FpML input values (example mentions initialValue 1). The transformation is not explicitly shown but is suspected.
- Evidence: 1 examples from 5/5 semantic pairs
- Caveats: `Scaling logic is not demonstrated across multiple examples - treat as tentative and verify with canonical rules or source system metadata before applying.`, `Do not apply automatic scaling unless mapping rule is confirmed.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Cautions And Tentative Signals

### Party references repeatedly resolve from swapstream.payerpartyreference.href|swapstream.receiverpartyreference.href into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.

- Rule id: `inflation-swaps:TENT-002`
- Family: `inflation-swaps`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Party references repeatedly resolve from swapstream.payerpartyreference.href|swapstream.receiverpartyreference.href into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a strong recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: payer/receiver mapping appears inverted`, `Representative note: party hrefs mapped to role labels; order reversed`, `Confidence mix includes high.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.

- Rule id: `inflation-swaps:TENT-003`
- Family: `inflation-swaps`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a strong recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: tradeId -> tradeIdentifier.assignedIdentifier.value`, `Representative note: tradeId -> tradeIdentifier.value`, `Representative note: FpML tradeId values copied to CDM assignedIdentifier`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Do Not Assume

- Do not treat Unmapped interpolation/publication metadata as a guaranteed direct mapping rule yet.
- Do not treat Quantity scaling hypothesis as a guaranteed direct mapping rule yet.
- Why CDM counterparty roles reference opposite externalReference?
- Is quantity 1000000 derived from FpML initialValue 1 (scaling)?
- bondReference in FpML not represented in CDM; where mapped?
- Why is CDM payer value reversed versus FpML hrefs?
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.
- Do not apply this tentative pattern without matching source evidence.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: The reason and intended direction for payer/receiver inversion - repeated but semantically ambiguous.
- Do not treat as stable: Quantity scaling behavior (e.g., initialValue -> large quantity) - suspected but not confirmed.
- Do not treat as stable: Mapping targets for bondReference, interpolationMethod, indexSource/mainPublication - unclear from examples.
- Do not treat as stable: Why calculationPeriodFrequency.periodMultiplier differs between FpML and CDM in examples.
- Do not assume enrichment/default behavior for Unmapped interpolation/publication metadata without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Quantity scaling hypothesis without source evidence or analyst approval.

## Human Review Triggers

- Why CDM counterparty roles reference opposite externalReference?
- Is quantity 1000000 derived from FpML initialValue 1 (scaling)?
- bondReference in FpML not represented in CDM; where mapped?
- Why is CDM payer value reversed versus FpML hrefs?
- Where were indexSource/mainPublication/interpolation mapped?
- Why CDM payer role labels invert FpML hrefs?
- Where interpolationMethod (LinearZeroYield) should map in CDM?
- Why calculationPeriodFrequency.periodMultiplier changes (FpML 30 vs CDM 1)?
- Party role or payment direction affects economic meaning.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: Why CDM counterparty roles reference opposite externalReference?
- Check unresolved question: Is quantity 1000000 derived from FpML initialValue 1 (scaling)?
- Check unresolved question: bondReference in FpML not represented in CDM; where mapped?
- Check unresolved question: Why is CDM payer value reversed versus FpML hrefs?
- Check unresolved question: Where were indexSource/mainPublication/interpolation mapped?
- Check unresolved question: Why CDM payer role labels invert FpML hrefs?
- Confirm the FPML source contains: calculationperioddates.effectivedate.unadjusteddate (FpML datetime with timezone).
- Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate (CDM date formatted YYYY-MM-DD).
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href (FpML party hrefs).
- Confirm the proposed CDM representation populates: interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role labels/externalReference).
- Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.
- Confirm the FPML source contains: tradeheader.partytradeidentifier.tradeid (FpML tradeId).
- Confirm the proposed CDM representation populates: assignedidentifier.identifier.value (CDM tradeIdentifier/assignedIdentifier value).
- Confirm the FPML source contains: FpML datetime fields (e.g., calculationPeriodDates.effectivedate.unadjusteddate with timezone).
- Confirm the proposed CDM representation populates: CDM adjustableDate.unadjustedDate as date-only string (YYYY-MM-DD).
- Confirm the FPML source contains: Normalization cue inferred from source-side values..
- Confirm the proposed CDM representation populates: Timezone removal as normalization.
- Confirm the FPML source contains: tradeheader.partytradeidentifier.tradeid (FpML).
- Confirm the proposed CDM representation populates: tradeIdentifier.assignedIdentifier.identifier.value (CDM).
- Confirm the FPML source contains: swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href.
- Confirm the proposed CDM representation populates: interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role entries).
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Because this family is pilot-only, mark the overall proposal as requiring analyst confirmation.

## Worked Examples

### inflation-swaps/inflation-swap-ex01-yoy.xml -> inflation-swaps/inflation-swap-ex01-yoy.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - FpML tradeId -> CDM tradeIdentifier value and scheme
  - FpML party id -> CDM party.partyId and externalKey
  - Timezone removed, date normalized to YYYY-MM-DD
  - FpML floatingRateIndex -> CDM inflationRateIndex.value
  - Strip timezone and format as YYYY-MM-DD
- Validation:
  - Review uncertainty: Why CDM counterparty roles reference opposite externalReference?
  - Review uncertainty: Is quantity 1000000 derived from FpML initialValue 1 (scaling)?

### inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml -> inflation-swaps/inflation-swap-ex02-yoy-bond-reference.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - tradeId -> tradeIdentifier.assignedIdentifier.value
  - FpML party id and partyId -> CDM party.externalKey and partyId
  - strip timezone from date
- Validation:
  - Review uncertainty: bondReference in FpML not represented in CDM; where mapped?

### inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml -> inflation-swaps/inflation-swap-ex03-yoy-initial-level.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - tradeId -> tradeIdentifier.value
  - datetime trimmed to date
  - payer/receiver mapping appears inverted
  - floatingRateIndex and tenor -> InflationIndex fields
  - remove timezone from datetime
- Validation:
  - Review uncertainty: Why is CDM payer value reversed versus FpML hrefs?
  - Review uncertainty: Where were indexSource/mainPublication/interpolation mapped?

## Source Evidence

- Evidence sidecar: `../references/inflation-swaps.evidence.json`
