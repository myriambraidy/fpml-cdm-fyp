# Global FPML -> CDM Identifier Handling

Use these rules when preserving, normalizing, or reviewing trade and party identifiers.

## Promoted Cross-Family Rules

### Duplicate tradeIdentifier entries in CDM

- Rule id: `commodity-derivatives:VAR-001`
- Family: `commodity-derivatives`
- Kind: `variant`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `Several CDM examples show duplicate tradeIdentifier entries (same assignedIdentifier or tradeId repeated). This is observed across multiple examples and is a deviation from a one-to-one identifier expectation.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Post-processing or de-duplication logic may be required when consolidating CDM trade identifiers; treat duplicate entries as a special case requiring review.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `Post-processing or de-duplication logic may be required when consolidating CDM trade identifiers; treat duplicate entries as a special case requiring review.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Generated identifiers or defaults repeatedly appear under partyid.identifier.value.

- Rule id: `commodity-derivatives:TENT-004`
- Family: `commodity-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under partyid.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative enrichment guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 6 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: LEI values inserted in CDM parties`, `Confidence mix includes high.`, `Representative note: LEI identifiers present only in CDM`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

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

### Generated identifiers or defaults repeatedly appear under partyid.identifier.value.

- Rule id: `fx-derivatives:TENT-002`
- Family: `fx-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under partyid.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative enrichment guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: LEI identifiers present in CDM not in FpML`, `Representative note: LEI identifiers present in CDM but not in FpML`, `Representative note: LEI values present in CDM but not in FpML`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.

- Rule id: `fx-derivatives:TENT-001`
- Family: `fx-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 11 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: tradeIds copied`, `Representative note: tradeId mapped to CDM assignedIdentifier.value`, `Representative note: FpML tradeId -> CDM assignedIdentifier`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
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

### Duplicate tradeIdentifier entries in CDM

- Rule id: `total-return-swaps:VAR-001`
- Family: `total-return-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `Some CDM outputs contain duplicate tradeIdentifier entries for the same FpML tradeId.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Introduces ambiguity for deduplication logic; consumers should not assume a 1:1 mapping without additional deduplication or identity rules.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 1 examples from 3/3 semantic pairs
- Caveats: `Introduces ambiguity for deduplication logic; consumers should not assume a 1:1 mapping without additional deduplication or identity rules.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Generated identifiers or defaults repeatedly appear under partyid.identifier.value.

- Rule id: `total-return-swaps:TENT-001`
- Family: `total-return-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under partyid.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative enrichment guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 3/3 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: LEI values added in CDM not in FpML`, `Confidence mix includes high.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.

- Rule id: `total-return-swaps:TENT-002`
- Family: `total-return-swaps`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 2 examples from 3/3 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: FpML tradeId -> CDM tradeIdentifier.assignedIdentifier`, `Confidence mix includes medium.`, `Representative note: tradeId -> assignedIdentifier`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Family-Specific Evidence

### Generated identifiers or defaults repeatedly appear under dateadjustments.meta.globalkey.

- Rule id: `commodity-derivatives:TENT-002`
- Family: `commodity-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Generated identifiers or defaults repeatedly appear under dateadjustments.meta.globalkey.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative enrichment guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: meta.globalKey added in CDM`, `Representative note: meta.globalKey added in CDM, no FpML source`, `Representative note: meta.globalKey entries generated`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### meta.globalKey entries generated

- Rule id: `commodity-derivatives:ENR-001`
- Family: `commodity-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `CDM files repeatedly contain meta.globalKey entries (generated identifiers/defaults) under dateAdjustments.meta.globalKey that are not sourced from FpML.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM files repeatedly contain meta.globalKey entries (generated identifiers/defaults) under dateAdjustments.meta.globalKey that are not sourced from FpML.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `meta.globalKey entries appear to be generated by CDM tooling; they should not be treated as authoritative mappings from FpML content.`, `Downstream consumers relying on meta.globalKey should be aware these values may not exist in the source FpML.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Party identifiers (LEI) added in CDM

- Rule id: `commodity-derivatives:ENR-002`
- Family: `commodity-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `CDM party.partyId.identifier.value fields often contain LEI or generated identifier values that are not present in the FpML input; these appear to be inserted during CDM creation.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM party.partyId.identifier.value fields often contain LEI or generated identifier values that are not present in the FpML input; these appear to be inserted during CDM creation.
- Evidence: 6 examples from 23/23 semantic pairs
- Caveats: `LEI values in the CDM do not have an obvious FpML origin in these examples; treat them as supplied/enriched metadata rather than direct mappings.`, `If mapping requires authoritative party identifiers, a separate lookup or enrichment source is necessary.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Identifier and exchange-code normalization

- Rule id: `correlation-swaps:TR-001`
- Family: `correlation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `instrumentId, description, exchange codes`
- Target CDM paths: `Security.identifier.value / scheme / Security.name / exchange code normalized (e.g., XNYS), constituent identifier scheme conversions`
- Action: Instrument identifiers and exchange codes from FpML are normalized when mapped into CDM Security.identifier or exchange fields (examples include mapping NYSE -> XNYS and converting some instrumentId schemes to BBGID).
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 4/4 semantic pairs
- Caveats: `Normalization appears applied to both exchange codes and identifier schemes; specific rule for when to convert to BBGID is unclear.`, `Representative transformation entries mention ISIN/Name creation and exchange code mapping.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: instrumentId, description, exchange codes.`, `Confirm the proposed CDM representation populates: Security.identifier.value / scheme / Security.name / exchange code normalized (e.g., XNYS), constituent identifier scheme conversions.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### Identifier scheme conversion to BBGID for constituents

- Rule id: `correlation-swaps:VAR-003`
- Family: `correlation-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `One example shows the first two basket constituents converted to BBGID; this conversion rule is not explained elsewhere.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Moderate - treat scheme conversions as conditional; require explicit mapping rules or whitelist before generalizing to all instruments.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 1 examples from 4/4 semantic pairs
- Caveats: `Moderate - treat scheme conversions as conditional; require explicit mapping rules or whitelist before generalizing to all instruments.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### TradeId scheme mismatch between FpML and CDM meta

- Rule id: `correlation-swaps:VAR-004`
- Family: `correlation-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `Trade identifier scheme differs between the FpML source and the generated CDM meta in at least one example.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Weak-to-moderate - mapping should allow for scheme remapping or retention of original scheme as an alternate identifier; do not assume a single canonical scheme.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 1 examples from 4/4 semantic pairs
- Caveats: `Weak-to-moderate - mapping should allow for scheme remapping or retention of original scheme as an alternate identifier; do not assume a single canonical scheme.`
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

### Trade identifier -> assignedIdentifier.value

- Rule id: `fx-derivatives:RULE-001`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements)`
- Target CDM paths: `trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value)`
- Action: FpML tradeId values are repeatedly copied into CDM assignedIdentifier.identifier.value preserving the trade identifier value (often with an associated scheme).
- Rationale: Trade-level ids are high-value stable keys in the source and are preserved to allow traceability to the original FpML trade.
- Evidence: 11 examples from 25/25 semantic pairs
- Caveats: `In some CDM outputs there are more assignedIdentifier entries than FpML tradeId elements (possible duplication or added identifiers).`, `AssignedIdentifier.scheme in CDM sometimes differs from FpML tradeIdScheme; reason not consistently evident from examples.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements).`, `Confirm the proposed CDM representation populates: trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### AssignedIdentifier.scheme differences

- Rule id: `fx-derivatives:VAR-001`
- Family: `fx-derivatives`
- Kind: `variant`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `AssignedIdentifier.scheme used in CDM sometimes differs from the tradeIdScheme present (or absent) in FpML examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Do not assume the scheme string is copied verbatim; mapping may normalize, override, or supplement scheme values.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 2 examples from 25/25 semantic pairs
- Caveats: `Do not assume the scheme string is copied verbatim; mapping may normalize, override, or supplement scheme values.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Duplicated tradeIdentifier entries

- Rule id: `fx-derivatives:VAR-003`
- Family: `fx-derivatives`
- Kind: `variant`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `Some CDM outputs contain more tradeIdentifier entries than FpML tradeId elements (duplicates or additional identifiers).`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Avoid assuming a 1:1 correspondence between FpML tradeId elements and CDM tradeIdentifier list; additional identifiers may be added or duplicated during mapping.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 2 examples from 25/25 semantic pairs
- Caveats: `Avoid assuming a 1:1 correspondence between FpML tradeId elements and CDM tradeIdentifier list; additional identifiers may be added or duplicated during mapping.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Generated/default party identifiers appear under partyid.identifier.value

- Rule id: `fx-derivatives:ENR-001`
- Family: `fx-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `CDM representations frequently include LEI-like or other identifier values for parties even when the FpML example does not contain them. CDM party model expects canonical identifiers; mappings populate these fields with generated defaults or externally-sourced identifiers when not present in FpML.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM representations frequently include LEI-like or other identifier values for parties even when the FpML example does not contain them. CDM party model expects canonical identifiers; mappings populate these fields with generated defaults or externally-sourced identifiers when not present in FpML.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Source of the LEI or generated identifier is not present in the FpML examples and appears to be an enrichment from an external source or mapping rule.`, `Not all parties receive such generated identifiers in every example.`, `Do not treat Generated/default party identifiers appear under partyid.identifier.value as a guaranteed direct mapping rule yet.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Party LEI or generated identifiers inserted

- Rule id: `fx-derivatives:ENR-002`
- Family: `fx-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `CDM examples include LEI-like party identifiers or other generated identifier values where FpML does not provide them.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM examples include LEI-like party identifiers or other generated identifier values where FpML does not provide them.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Source of these identifiers is not visible in FpML examples; they may come from an external reference data feed or internal generation policy.`, `Treat mappings that rely on LEI presence as enriched and verify with source of truth if precise LEI data is required.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

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

### Equity instrument id/description -> Security identifiers

- Rule id: `total-return-swaps:RULE-001`
- Family: `total-return-swaps`
- Kind: `mapping`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `instrumentId / instrument description (FpML trade instrument sections)`
- Target CDM paths: `security identifier entries (CDM security/observable identifiers)`
- Action: Equity instruments in the FpML examples are consistently represented as security/observable identifiers in CDM.
- Rationale: Equity product identity is expressed in CDM via security/observable identifier structures; instrument id and description from FpML are used to populate those fields.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `Normalization of identifier namespaces (e.g., exchange codes) occurs in some examples - see exchange-code normalization caveat.`, `Mapping may combine id + descriptive text to populate multiple CDM identifier fields.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: instrumentId / instrument description (FpML trade instrument sections).`, `Confirm the proposed CDM representation populates: security identifier entries (CDM security/observable identifiers).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### Exchange identifier normalization (FpML exchangeId -> CDM exchange.code)

- Rule id: `total-return-swaps:RULE-002`
- Family: `total-return-swaps`
- Kind: `mapping`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `FpML exchangeId values (e.g., 'NASDAQ', 'Milan Stock Exchange')`
- Target CDM paths: `CDM exchange.code normalized values (e.g., 'XNAS', 'XMIL')`
- Action: Exchange identifiers present in FpML are mapped to canonical exchange codes in CDM in multiple examples.
- Rationale: Target model uses standardized exchange codes; examples show FpML exchange names/ids translated to a different code space in CDM.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `The precise mapping table or rationale is not present in examples - open questions remain about mapping rules (e.g., 'NASDAQ' -> 'XNAS').`, `Normalization may be context-dependent (local exchange names vs. global codes).`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: FpML exchangeId values (e.g., 'NASDAQ', 'Milan Stock Exchange').`, `Confirm the proposed CDM representation populates: CDM exchange.code normalized values (e.g., 'XNAS', 'XMIL').`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### tradeId -> tradeIdentifier.assignedIdentifier

- Rule id: `total-return-swaps:RULE-003`
- Family: `total-return-swaps`
- Kind: `mapping`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `tradeheader.partytradeidentifier.tradeid (FpML)`
- Target CDM paths: `tradeIdentifier.assignedIdentifier.identifier.value (CDM)`
- Action: FpML tradeId values are carried into CDM assignedIdentifier entries repeatedly in multiple examples.
- Rationale: Trade-level identifier preservation is required for traceability; examples show a direct mapping from FpML tradeId to CDM assignedIdentifier.
- Evidence: 2 examples from 3/3 semantic pairs
- Caveats: `Some CDM outputs show duplicate tradeIdentifier entries; deduplication rules are not provided and should be verified.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: tradeheader.partytradeidentifier.tradeid (FpML).`, `Confirm the proposed CDM representation populates: tradeIdentifier.assignedIdentifier.identifier.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Party identifiers enriched with generated/default identifiers (e.g., LEI)

- Rule id: `total-return-swaps:ENR-001`
- Family: `total-return-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `CDM party identifier elements often include generated or default identifier values that are not present in the source FpML (example: LEI values added).`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM party identifier elements often include generated or default identifier values that are not present in the source FpML (example: LEI values added).
- Evidence: 2 examples from 3/3 semantic pairs
- Caveats: `Treat added identifiers as enrichment rather than source-canonical; do not assume they exist in FpML.`, `Verify whether enrichment is deterministic for all parties or applied selectively.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Do Not Assume

- Do not invent identifiers, duplicate identifiers, schemes, global keys, or external keys.

## Validation Checklist

- Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.
- If the source signal does not match the rule, do not apply the rule.
