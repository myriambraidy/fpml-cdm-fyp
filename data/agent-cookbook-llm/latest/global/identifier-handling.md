# Promoted Cross-Family Rules

Use these only when the family and source signals match exactly. Do not generalize beyond the stated family/kind/status.

- Rule id: commodity-derivatives:VAR-001 (variant, ready)
  - Applies when: The product is in commodity-derivatives and CDM outputs show duplicate tradeIdentifier entries (same assignedIdentifier or tradeId repeated).
  - Inspect in FpML: n/a (duplication observed in CDM outputs).
  - Propose in CDM: No specific target paths recovered; treat as review guidance.
  - Action: Post-processing or de-duplication logic may be required; treat duplicates as special-case requiring review.
  - Validate: Confirm the source product subtype matches this variant before applying.
  - Do not apply when: The product family or duplication pattern does not match the variant description.

- Rule id: commodity-derivatives:TENT-004 (enrichment, ready)
  - Applies when: Generated identifiers or defaults appear under partyid.identifier.value.
  - Inspect in FpML: party identifiers; confirm whether values exist in FpML.
  - Propose in CDM: None recovered; treat as tentative enrichment guidance only.
  - Action: Apply only when the source exactly matches; mark for analyst review.
  - Validate: Confirm an exact source-side signal; mark the mapped field for analyst review.
  - Do not apply when: No exact match in source; do not generate identifiers by default.

- Rule id: credit-derivatives:TENT-001 (enrichment, pilot_only)
  - Applies when: Generated identifiers/defaults repeatedly appear under partyid.identifier.value.
  - Inspect in FpML: party identifiers; check for absence of such values.
  - Propose in CDM: None recovered; treat as tentative enrichment guidance.
  - Action: Apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.
  - Do not apply when: No exact source match; enrichment not evidenced.

- Rule id: credit-derivatives:TENT-007 (caution, pilot_only)
  - Applies when: Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.
  - Inspect in FpML: tradeheader.partytradeidentifier.tradeid.
  - Propose in CDM: None recovered; treat as caution/review guidance.
  - Action: Tentative mapping; apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.
  - Do not apply when: Source field(s) absent or structure diverges.

- Rule id: fx-derivatives:TENT-002 (enrichment, ready)
  - Applies when: Generated identifiers/defaults appear under partyid.identifier.value.
  - Inspect in FpML: party identifiers; verify absence in FpML.
  - Propose in CDM: None recovered; treat as tentative enrichment guidance.
  - Action: Apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.
  - Do not apply when: No exact source match.

- Rule id: fx-derivatives:TENT-001 (caution, ready)
  - Applies when: Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.
  - Inspect in FpML: tradeheader.partytradeidentifier.tradeid.
  - Propose in CDM: None recovered; treat as caution/review guidance.
  - Action: Tentative mapping; apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.
  - Do not apply when: Source field(s) absent or structure diverges.

- Rule id: inflation-swaps:TENT-003 (caution, pilot_only)
  - Applies when: Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.
  - Inspect in FpML: tradeheader.partytradeidentifier.tradeid.
  - Propose in CDM: None recovered; treat as caution/review guidance.
  - Action: Tentative mapping; apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.
  - Do not apply when: Source field(s) absent or structure diverges.

- Rule id: total-return-swaps:VAR-001 (variant, pilot_only)
  - Applies when: Some CDM outputs contain duplicate tradeIdentifier entries for the same FpML tradeId.
  - Inspect in FpML: n/a (duplication observed in CDM outputs).
  - Propose in CDM: None recovered; treat as review guidance.
  - Action: Do not assume 1:1 mapping; handle deduplication/identity resolution explicitly.
  - Validate: Confirm the source product subtype matches this variant.
  - Do not apply when: Family/subtype does not match; no duplication observed.

- Rule id: total-return-swaps:TENT-001 (enrichment, pilot_only)
  - Applies when: Generated identifiers/defaults appear under partyid.identifier.value.
  - Inspect in FpML: party identifiers; confirm absence.
  - Propose in CDM: None recovered; treat as tentative enrichment guidance.
  - Action: Apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.
  - Do not apply when: No exact source match.

- Rule id: total-return-swaps:TENT-002 (caution, pilot_only)
  - Applies when: Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.
  - Inspect in FpML: tradeheader.partytradeidentifier.tradeid.
  - Propose in CDM: None recovered; treat as caution/review guidance.
  - Action: Tentative mapping; apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.
  - Do not apply when: Source field(s) absent or structure diverges.

# Family-Specific Evidence

Apply only when the FpML source and family match. Do not generalize across families.

- commodity-derivatives:TENT-002 (enrichment, ready)
  - Signal: Generated identifiers/defaults under dateadjustments.meta.globalkey.
  - CDM target: None recovered; review guidance only.
  - Action: Tentative; apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.

- commodity-derivatives:ENR-001 (enrichment, ready)
  - Signal: meta.globalKey entries under dateAdjustments.meta.globalKey not sourced from FpML.
  - CDM target: None recovered; review guidance only.
  - Action: Suspected enrichment; do not generate without source or approved default.
  - Validate: Confirm each enriched/defaulted value is source-backed or approved default.

- commodity-derivatives:ENR-2 (enrichment, ready)
  - Signal: party.partyId.identifier.value contains LEI/generated identifiers not present in FpML.
  - CDM target: None recovered; review guidance only.
  - Action: Suspected enrichment; do not auto-generate; requires external provenance if used.
  - Validate: Confirm enrichment provenance or presence in source.

- correlation-swaps:TR-001 (transformation, pilot_only)
  - Signals: instrumentId, description, exchange codes.
  - Target: Security.identifier.value/scheme, Security.name, normalized exchange code.
  - Action: Normalize instrument identifiers and exchange codes when signals exist.
  - Validate: Confirm all listed source signals; confirm normalized targets are populated as specified.
  - Caveat: Specific BBGID conversion criteria unclear; treat scheme conversions as conditional.

- correlation-swaps:VAR-003 (variant, pilot_only)
  - Signal: Select basket constituents converted to BBGID in one example.
  - Target: None recovered; review guidance only.
  - Action: Treat scheme conversions as conditional; require explicit rules/whitelist.
  - Validate: Confirm product subtype matches before applying.

- correlation-swaps:VAR-004 (variant, pilot_only)
  - Signal: Trade identifier scheme differs between FpML source and generated CDM meta.
  - Target: None recovered; review guidance only.
  - Action: Allow for scheme remapping or retention of original scheme as alternate; do not assume single canonical scheme.
  - Validate: Confirm product subtype matches before applying.

- credit-derivatives:VAR-002 (variant, pilot_only)
  - Signal: Multiple assignedIdentifier entries for a single trade derived from multiple partyTradeIdentifier elements.
  - Target: None recovered; review guidance only.
  - Action: Expect multiples; avoid assuming uniqueness; inspect provenance (scheme/href).
  - Validate: Confirm product subtype matches before applying.

- credit-derivatives:TENT-002 (enrichment, pilot_only)
  - Signal: Generated defaults under adjustabledate.meta.globalkey.
  - Target: None recovered; review guidance only.
  - Action: Tentative; apply only on exact match; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.

- credit-derivatives:ENR-001 (enrichment, pilot_only)
  - Signal: Generated/default partyId.identifier.value (e.g., LEI) not in FpML.
  - Target: None recovered; review guidance only.
  - Action: Suspected enrichment; do not auto-generate without source/default.
  - Validate: Confirm each enriched/defaulted value is source-backed or approved default.

- credit-derivatives:ENR-002 (enrichment, pilot_only)
  - Signal: adjustableDate.meta.globalKey present in CDM but not FpML.
  - Target: None recovered; review guidance only.
  - Action: Suspected enrichment; document provenance; do not treat as source-supplied.
  - Validate: Confirm enrichment provenance or presence in source.

- credit-derivatives:TENT-008 (caution, pilot_only)
  - Signal: tradeHeader.partyTradeIdentifier.tradeId (and scheme) copied to assignedIdentifier.identifier.value; schemes generally preserved; possible multiples.
  - Target: None recovered; review guidance only.
  - Action: Tentative mapping; verify scheme handling and duplication; mark for analyst review.
  - Validate: Confirm exact source signal; mark for analyst review.

- fx-derivatives:RULE-001 (mapping, ready)
  - Signal: tradeHeader.partyTradeIdentifier.tradeId.
  - Target: trade.tradeIdentifier.assignedIdentifier.identifier.value.
  - Action: Copy FpML tradeId into CDM assignedIdentifier.identifier.value; preserve value; scheme handling may vary.
  - Validate: Confirm source contains tradeHeader.partyTradeIdentifier.tradeId; confirm target path populated; note caveats on duplicates and scheme differences; confirm party/direction context.

- fx-derivatives:VAR-001 (variant, ready)
  - Signal: AssignedIdentifier.scheme sometimes differs from FpML tradeIdScheme (or absent in FpML).
  - Target: None recovered; review guidance only.
  - Action: Do not assume verbatim scheme copy; scheme may be normalized/overridden/supplemented.
  - Validate: Confirm product subtype matches before applying.

- fx-derivatives:VAR-003 (variant, ready)
  - Signal: More tradeIdentifier entries in CDM than FpML tradeId elements.
  - Target: None recovered; review guidance only.
  - Action: Avoid assuming 1:1 between FpML tradeId and CDM tradeIdentifier list.
  - Validate: Confirm product subtype matches before applying.

- fx-derivatives:ENR-001 (enrichment, ready) and fx-derivatives:ENR-002 (enrichment, ready)
  - Signal: LEI-like/generated party identifiers present in CDM where FpML does not provide them.
  - Target: None recovered; review guidance only.
  - Action: Suspected enrichment; do not auto-generate; verify with external source if needed.
  - Validate: Confirm each enriched/defaulted value is source-backed or approved default; mark for analyst review.

- inflation-swaps:RULE-003 (mapping, pilot_only) and inflation-swaps:TR-003 (transformation, pilot_only)
  - Signal: tradeheader.partytradeidentifier.tradeid.
  - Target: assignedidentifier.identifier.value (tradeIdentifier.assignedIdentifier.identifier.value).
  - Action: Copy FpML tradeId into CDM assignedIdentifier.identifier.value; scheme handling may be separate.
  - Validate: Confirm source signal; confirm target populated; confirm party/direction context.

- total-return-swaps:RULE-001 (mapping, pilot_only)
  - Signal: instrumentId / instrument description (equity instrument in FpML trade instrument sections).
  - Target: security identifier entries (CDM security/observable identifiers).
  - Action: Represent equity instruments as security/observable identifiers.
  - Validate: Confirm source signals; confirm CDM security identifiers populated; note exchange normalization caveats.

- total-return-swaps:RULE-002 (mapping, pilot_only)
  - Signal: FpML exchangeId values (e.g., 'NASDAQ', 'Milan Stock Exchange').
  - Target: CDM exchange.code normalized values (e.g., 'XNAS', 'XMIL').
  - Action: Map FpML exchange identifiers to canonical CDM exchange codes.
  - Validate: Confirm source exchangeId; confirm normalized exchange.code populated; note that mapping table is unspecified.

- total-return-swaps:RULE-003 (mapping, pilot_only)
  - Signal: tradeheader.partytradeidentifier.tradeid.
  - Target: tradeIdentifier.assignedIdentifier.identifier.value.
  - Action: Carry FpML tradeId into CDM assignedIdentifier entries; duplicates may occur.
  - Validate: Confirm source signal; confirm target populated; review duplicates and party/direction context.

- total-return-swaps:ENR-001 (enrichment, pilot_only)
  - Signal: party identifier elements include generated/default values (e.g., LEI) not in FpML.
  - Target: None recovered; review guidance only.
  - Action: Suspected enrichment; do not auto-generate; verify determinism and provenance.
  - Validate: Confirm each enriched/defaulted value is source-backed or approved default; mark for analyst review.

# Do Not Assume

- Do not invent identifiers, duplicate identifiers, schemes, global keys, or external keys.

# Validation Checklist

- Cite the family-specific cookbook rule id for each material mapping you propose in CDM.
- If the source signal does not match the rule, do not apply the rule.
- For tradeId-to-assignedIdentifier rules, confirm FpML contains tradeHeader.partyTradeIdentifier.tradeId (or tradeheader.partytradeidentifier.tradeid as applicable) before proposing a CDM mapping; then confirm trade.tradeIdentifier.assignedIdentifier.identifier.value (or assignedidentifier.identifier.value) is populated accordingly, observing each rule’s caveats.
- For enrichment/default patterns (partyId.identifier.value, meta.globalKey), confirm the source contains an exact matching signal or that an approved default exists; mark these fields for analyst review.
- For duplication variants, do not assume 1:1 identifier counts; flag cases with extra or duplicate tradeIdentifier/assignedIdentifier entries for analyst review and do not auto-deduplicate without explicit rules.