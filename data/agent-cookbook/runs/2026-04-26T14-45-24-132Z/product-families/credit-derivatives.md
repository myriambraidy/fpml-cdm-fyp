# FPML -> CDM Cookbook: credit-derivatives

## Status

- Operational status: `pilot_only`
- Agent use policy: Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.
- Semantic success rate: 100%
- Draft quality: `good`
- Draft publication: `success`

## Trigger Signals

- credit-derivatives
- FpML top-level section: party
- FpML top-level section: trade
- trade > creditDefaultSwap (58 paths)
- trade > documentation (6 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- party > partyName (2 paths)
- trade > calculationAgent (1 paths)
- trade > calculationAgentBusinessCenter (1 paths)
- trade > creditDefaultSwap (18 paths)
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

No stable operational rules were recovered for this family.

## Transformations

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


## Variants And Branches

### calculationAgentPartyReference -> CalculationAgentIndependent mapping

- Rule id: `credit-derivatives:VAR-001`
- Family: `credit-derivatives`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `A non-obvious mapping was observed where calculationAgentPartyReference in FpML becomes a CDM value labeled 'CalculationAgentIndependent' in several examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: This transformation is ambiguous based on available examples; treat this mapping as a special-case until rule provenance is clarified-do not assume party reference-to-role mapping is identity.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 4 examples from 40/40 semantic pairs
- Caveats: `This transformation is ambiguous based on available examples; treat this mapping as a special-case until rule provenance is clarified-do not assume party reference-to-role mapping is identity.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### duplicated assignedIdentifier entries

- Rule id: `credit-derivatives:VAR-002`
- Family: `credit-derivatives`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `Some CDM outputs show multiple assignedIdentifier entries for a single trade derived from multiple partyTradeIdentifier elements; duplication behavior varies by example.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: When generalizing, consumers should expect multiple assignedIdentifier entries and avoid assuming uniqueness without additional de-duplication rules; provenance of each identifier (scheme/href) should be inspected.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 3 examples from 40/40 semantic pairs
- Caveats: `When generalizing, consumers should expect multiple assignedIdentifier entries and avoid assuming uniqueness without additional de-duplication rules; provenance of each identifier (scheme/href) should be inspected.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`


## Enrichment And Defaults

### Generated identifiers or defaults repeatedly appear under partyid.identifier.value.

- Rule id: `credit-derivatives:TENT-001`
- Family: `credit-derivatives`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under partyid.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative enrichment guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 12 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: LEI added for party entries not in FpML`, `Representative note: LEI values present in CDM not in FpML`, `Representative note: LEI values present in CDM but not in FpML`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Generated identifiers or defaults repeatedly appear under adjustabledate.meta.globalkey.

- Rule id: `credit-derivatives:TENT-002`
- Family: `credit-derivatives`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under adjustabledate.meta.globalkey.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative enrichment guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 10 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: meta.globalKey generated in CDM, not present in FpML`, `Confidence mix includes medium.`, `Representative note: globalKey metadata present only in CDM`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### LEI or generated party identifiers added

- Rule id: `credit-derivatives:ENR-001`
- Family: `credit-derivatives`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under partyId.identifier.value (e.g., LEI values present in CDM though not present in FpML).`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Generated identifiers or defaults repeatedly appear under partyId.identifier.value (e.g., LEI values present in CDM though not present in FpML).
- Evidence: 12 examples from 40/40 semantic pairs
- Caveats: `These identifier values appear to be generated or enriched by the mapping process; do not assume they originate from the source FpML without provenance metadata.`, `Consumers should treat added identifiers as derived metadata and validate against authoritative registries if required.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### meta.globalKey generated on adjustableDate

- Rule id: `credit-derivatives:ENR-002`
- Family: `credit-derivatives`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under adjustableDate.meta.globalKey (meta.globalKey present in CDM but not in FpML).`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Generated identifiers or defaults repeatedly appear under adjustableDate.meta.globalKey (meta.globalKey present in CDM but not in FpML).
- Evidence: 10 examples from 40/40 semantic pairs
- Caveats: `meta.globalKey appears to be generated during transformation; consumers should not rely on it as a source-supplied identifier without verification.`, `Document provenance of generated keys when persisting or reconciling data.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Cautions And Tentative Signals

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

### Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.

- Rule id: `credit-derivatives:TENT-007`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 5 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: tradeId copied to assignedIdentifier`, `Representative note: trade ids to assignedIdentifier`, `Representative note: tradeId -> tradeIdentifier.assignedIdentifier.value`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Trade-level tradeId values are repeatedly copied into the CDM assignedIdentifier.identifier.value; schemes and original tradeId strings are generally preserved. (tradeHeader.partyTradeIdentifier.tradeId (and scheme) -> assignedIdentifier.identifier.value (preserve scheme where present))

- Rule id: `credit-derivatives:TENT-008`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Trade-level tradeId values are repeatedly copied into the CDM assignedIdentifier.identifier.value; schemes and original tradeId strings are generally preserved. (tradeHeader.partyTradeIdentifier.tradeId (and scheme) -> assignedIdentifier.identifier.value (preserve scheme where present))`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 5 examples from 40/40 semantic pairs
- Caveats: `Trade identifiers are a clear canonical identifier for the trade and are preserved in CDM as assigned identifiers for lookup and provenance.`, `Some CDM outputs show multiple assignedIdentifier entries derived from multiple partyTradeIdentifier elements - duplication occurs in examples and needs confirmation.`, `Preservation of scheme is typical but verify whether scheme is moved into a separate field or kept inline.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### reference entity name copied (direct mapping; referenceinformation.referenceentity.entityname -> referenceentity.name.value)

- Rule id: `credit-derivatives:TENT-010`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `reference entity name copied (direct mapping; referenceinformation.referenceentity.entityname -> referenceentity.name.value)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: reference entity name copied`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Reference entity names are copied verbatim from FpML referenceInformation into the CDM referenceEntity.name.value field. (referenceInformation.referenceEntity.entityName -> referenceEntity.name.value)

- Rule id: `credit-derivatives:TENT-011`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Reference entity names are copied verbatim from FpML referenceInformation into the CDM referenceEntity.name.value field. (referenceInformation.referenceEntity.entityName -> referenceEntity.name.value)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 40/40 semantic pairs
- Caveats: `Reference entity name is a direct, human-readable attribute used in both representations and is mapped directly to retain the entity label.`, `In some examples an identifier (scheme/id) is also provided alongside the name; consumers should check both name and id when present.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Do Not Assume

- Do not treat LEI or generated party identifiers added as a guaranteed direct mapping rule yet.
- Do not treat meta.globalKey generated on adjustableDate as a guaranteed direct mapping rule yet.
- Why is calculationAgentPartyReference mapped to CalculationAgentIndependent instead of party1?
- Why tradeId 37209 appears multiple times in CDM tradeIdentifier array?
- Mapping of party role labels Party1/Party2 to FpML hrefs is ambiguous
- Why are tradeIdentifier assignedIdentifier entries duplicated in CDM?
- Do not apply this tentative pattern without matching source evidence.
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: Reason and rule for mapping calculationAgentPartyReference to 'CalculationAgentIndependent' - requires confirmation.
- Do not treat as stable: Handling and de-duplication of multiple assignedIdentifier entries derived from multiple partyTradeIdentifier elements.
- Do not treat as stable: Provenance and intended use of generated LEI/party identifiers present in CDM but not in FpML.
- Do not treat as stable: Exact mapping of party role labels (Party1/Party2) to CDM party references and how guarantorReference should map.
- Do not assume enrichment/default behavior for LEI or generated party identifiers added without source evidence or analyst approval.
- Do not assume enrichment/default behavior for meta.globalKey generated on adjustableDate without source evidence or analyst approval.

## Human Review Triggers

- Why is calculationAgentPartyReference mapped to CalculationAgentIndependent instead of party1?
- Why tradeId 37209 appears multiple times in CDM tradeIdentifier array?
- Mapping of party role labels Party1/Party2 to FpML hrefs is ambiguous
- Why are tradeIdentifier assignedIdentifier entries duplicated in CDM?
- How was calculationAgentParty 'CalculationAgentIndependent' derived from calculationAgentPartyReference?
- Is guarantorReference intended to map to CDM referenceEntity or omitted?
- Why is calculationAgentParty set to 'CalculationAgentIndependent' instead of party1?
- Where did LEI partyId values in CDM come from (not in FpML parties)?
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- Party role or payment direction affects economic meaning.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: Why is calculationAgentPartyReference mapped to CalculationAgentIndependent instead of party1?
- Check unresolved question: Why tradeId 37209 appears multiple times in CDM tradeIdentifier array?
- Check unresolved question: Mapping of party role labels Party1/Party2 to FpML hrefs is ambiguous
- Check unresolved question: Why are tradeIdentifier assignedIdentifier entries duplicated in CDM?
- Check unresolved question: How was calculationAgentParty 'CalculationAgentIndependent' derived from calculationAgentPartyReference?
- Check unresolved question: Is guarantorReference intended to map to CDM referenceEntity or omitted?
- Confirm the FPML source contains: generalTerms.effectivedate.unadjustedDate (FpML).
- Confirm the proposed CDM representation populates: effectivedate.adjustableDate.unadjustedDate (CDM).
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate (FpML).
- Confirm the proposed CDM representation populates: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate (CDM).
- Confirm the FPML source contains: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate | trade.tradeHeader.tradeDate (FpML).
- Confirm the proposed CDM representation populates: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate | trade.tradedate.value (CDM).
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Because this family is pilot-only, mark the overall proposal as requiring analyst confirmation.

## Worked Examples

### credit-derivatives/cd-ex01-long-asia-corp-fixreg.xml -> credit-derivatives/cd-ex01-long-asia-corp-fixreg.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - effectiveDate moved under adjustableDate, Z removed
  - termination unadjustedDate copied
  - each businessCenter element mapped to array value
  - reference entity name and id copied
  - paymentFrequency split to calculation and payment date structures
- Validation:
  - Review uncertainty: Why is calculationAgentPartyReference mapped to CalculationAgentIndependent instead of party1?
  - Review uncertainty: Why tradeId 37209 appears multiple times in CDM tradeIdentifier array?

### credit-derivatives/cd-ex02-2003-short-asia-corp-fixreg.xml -> credit-derivatives/cd-ex02-2003-short-asia-corp-fixreg.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - date normalized (Z removed)
  - termination date normalized
  - reference entity name copied
  - tradeId and scheme preserved
  - calculationAmount moved into tradeLot quantity structure
- Validation:
  - Review uncertainty: Mapping of party role labels Party1/Party2 to FpML hrefs is ambiguous

### credit-derivatives/cd-ex02-short-asia-corp-fixreg.xml -> credit-derivatives/cd-ex02-short-asia-corp-fixreg.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - effective date mapped, timezone Z removed
  - termination date mapped, timezone Z removed
  - reference entity name and id mapped
  - restructuring type mapped
  - periodic payment split into interest payout and price/quantity structures
- Validation:
  - Review uncertainty: Why are tradeIdentifier assignedIdentifier entries duplicated in CDM?

## Source Evidence

- Evidence sidecar: `../references/credit-derivatives.evidence.json`
