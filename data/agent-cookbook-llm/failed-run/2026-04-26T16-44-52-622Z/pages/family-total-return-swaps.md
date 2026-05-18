# FPML -> CDM Cookbook: total-return-swaps

## Status

- Operational status: `pilot_only`
- Agent use policy: Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.
- Semantic success rate: 100%
- Draft quality: `good`
- Draft publication: `success`
- Readiness reasons: `high_open_question_density`

## Trigger Signals

- total-return-swaps
- FpML top-level section: party
- FpML top-level section: trade
- trade > returnSwap (153 paths)
- trade > tradeHeader (6 paths)
- trade > collateral (5 paths)
- party > partyId (2 paths)
- party > partyName (2 paths)
- trade > returnSwap (141 paths)
- trade > returnSwap (132 paths)
- trade > documentation (5 paths)
- trade
- party
- header

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: party, trade.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Apply recurring mapping rules only when the exact source cues appear in the document.
4. Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
5. Assemble the result under repeated CDM scaffolding such as meta, trade.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

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


## Transformations

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

### Dividend and performance terms mapping

- Rule id: `total-return-swaps:TR-002`
- Family: `total-return-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `FpML dividend terms, payout role references`
- Target CDM paths: `CDM dividend terms, PerformancePayout structures`
- Action: Dividend-related fields and performance payout roles from FpML are translated into CDM dividend/performance payout structures.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 2 examples from 3/3 semantic pairs
- Caveats: `Mapping occurs in examples but role directionality/party mapping shows inconsistencies in at least one example - treat role mapping carefully.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: FpML dividend terms, payout role references.`, `Confirm the proposed CDM representation populates: CDM dividend terms, PerformancePayout structures.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`


## Variants And Branches

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

### PerformancePayout payer/receiver direction mismatch

- Rule id: `total-return-swaps:VAR-002`
- Family: `total-return-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `In at least one example, CDM PerformancePayout payer/receiver roles appear inverted relative to FpML payerPartyReference.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Role mapping for payouts may require explicit verification per trade; do not assume party reference semantics are identical between FpML and CDM without confirmation.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 1 examples from 3/3 semantic pairs
- Caveats: `Role mapping for payouts may require explicit verification per trade; do not assume party reference semantics are identical between FpML and CDM without confirmation.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`


## Enrichment And Defaults

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


## Cautions And Tentative Signals

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


## Do Not Assume

- Do not treat Party identifiers enriched with generated/default identifiers (e.g., LEI) as a guaranteed direct mapping rule yet.
- Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
- CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference
- Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
- Why does CDM contain duplicate tradeIdentifier entries?
- Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not apply this tentative pattern without matching source evidence.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: Rationale and mapping rules for exchange code normalization (e.g., NASDAQ -> XNAS, Milan Stock Exchange -> XMIL).
- Do not treat as stable: Handling and deduplication of duplicate tradeIdentifier entries in CDM.
- Do not treat as stable: Exact semantics for PerformancePayout party role mapping where examples show inversion.
- Do not treat as stable: Whether party identifier LEI additions are always applied or conditional enrichment.
- Do not assume enrichment/default behavior for Party identifiers enriched with generated/default identifiers (e.g., LEI) without source evidence or analyst approval.

## Human Review Triggers

- Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
- CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference
- Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
- Why does CDM contain duplicate tradeIdentifier entries?
- Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- Party role or payment direction affects economic meaning.
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
- Check unresolved question: CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference
- Check unresolved question: Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
- Check unresolved question: Why does CDM contain duplicate tradeIdentifier entries?
- Check unresolved question: Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?
- Check enrichment/default behavior: CDM party identifier elements often include generated or default identifier values that are not present in the source FpML (example: LEI values added).
- Confirm the FPML source contains: instrumentId / instrument description (FpML trade instrument sections).
- Confirm the proposed CDM representation populates: security identifier entries (CDM security/observable identifiers).
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm the FPML source contains: FpML exchangeId values (e.g., 'NASDAQ', 'Milan Stock Exchange').
- Confirm the proposed CDM representation populates: CDM exchange.code normalized values (e.g., 'XNAS', 'XMIL').
- Confirm the FPML source contains: tradeheader.partytradeidentifier.tradeid (FpML).
- Confirm the proposed CDM representation populates: tradeIdentifier.assignedIdentifier.identifier.value (CDM).
- Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.
- Confirm the FPML source contains: FpML unadjusted/adjusted dates with timezone offsets.
- Confirm the proposed CDM representation populates: CDM date strings without timezone offset.
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: FpML dividend terms, payout role references.
- Confirm the proposed CDM representation populates: CDM dividend terms, PerformancePayout structures.
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Because this family is pilot-only, mark the overall proposal as requiring analyst confirmation.

## Worked Examples

### total-return-swaps/trs-ex01-equity-basket.xml -> total-return-swaps/trs-ex01-equity-basket.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - FpML tradeId -> CDM tradeIdentifier.assignedIdentifier
  - Unadjusted date copied, timezone removed
  - Equity instrumentId and description -> Security identifiers
  - Remove timezone offset from date string
- Validation:
  - Review uncertainty: Why is FpML exchangeId 'Milan Stock Exchange' mapped to CDM exchange.code 'XMIL'?
  - Review uncertainty: CDM PerformancePayout payer/receiver roles appear inverted versus FpML payerPartyReference

### total-return-swaps/trs-ex02-single-equity.xml -> total-return-swaps/trs-ex02-single-equity.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - product type value
  - date normalized
  - equity id -> security identifier
  - tradeId -> assignedIdentifier
  - remove timezone suffix from dates
- Validation:
  - Review uncertainty: Why is FpML exchangeId 'NASDAQ' represented as CDM exchange 'XNAS'?
  - Review uncertainty: Why does CDM contain duplicate tradeIdentifier entries?

### total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.xml -> total-return-swaps/trs-ex03-single-stock-execution-swap-with-fixing-and-dividend-payment-dates.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - effective date relative fields mapped
  - termination relative-date fields mapped
  - instrument id and units mapped to observable and quantity
  - dividend terms mapped
  - exchange code normalized (NASDAQ -> XNAS)
- Validation:
  - Review uncertainty: Why is calculationAgentParty set to CalculationAgentIndependent instead of party1 reference?

## Source Evidence

- Evidence sidecar: `../references/total-return-swaps.evidence.json`
