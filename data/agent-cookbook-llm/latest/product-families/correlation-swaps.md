# FPML -> CDM Cookbook: correlation-swaps

## Status

- Operational status: `pilot_only`
- Agent use policy: Agents may apply these rules, but must mark material proposals as requiring analyst confirmation.
- Semantic success rate: 100%
- Draft quality: `good`
- Draft publication: `success`
- Readiness reasons: `high_open_question_density`

## Trigger Signals

- correlation-swaps
- FpML top-level section: header
- FpML top-level section: party
- FpML top-level section: trade
- trade > correlationSwap (35 paths)
- trade > tradeHeader (6 paths)
- trade > documentation (5 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sentBy (1 paths)
- trade > calculationAgent (1 paths)
- header
- trade
- party

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: header, party, trade.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Apply recurring mapping rules only when the exact source cues appear in the document.
4. Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
5. Assemble the result under repeated CDM scaffolding such as meta, trade.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

### Settlement type preserved into performance payout settlementTerms

- Rule id: `correlation-swaps:RULE-001`
- Family: `correlation-swaps`
- Kind: `mapping`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `correlationswap.correlationleg.settlementtype`
- Target CDM paths: `performancepayout.settlementterms.settlementtype`
- Action: Settlement type values (e.g., Cash) are consistently copied from the correlation leg settlementType in the FpML into the CDM performance payout settlementTerms.settlementType.
- Rationale: Settlement processing semantics are preserved across representations so downstream CDM logic can rely on the same settlement modality.
- Evidence: 3 examples from 4/4 semantic pairs
- Caveats: `Pattern evidence is from confirmation examples (ex02-ex04); single-file variations (ex01) do not contradict but provide less direct evidence.`, `Does not clarify how optional or complex settlementType variants (beyond simple 'Cash') are represented.`
- Validate: `Confirm the FPML source contains: correlationswap.correlationleg.settlementtype.`, `Confirm the proposed CDM representation populates: performancepayout.settlementterms.settlementtype.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`


## Transformations

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

### Split party references into counterparty entries

- Rule id: `correlation-swaps:TR-002`
- Family: `correlation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `medium`
- Source signals: `payerPartyReference, receiverPartyReference, calculationAgentPartyReference (hrefs)`
- Target CDM paths: `trade counterparties / party list entries (payer, receiver, Party1/Party2)`
- Action: FpML party references (payerPartyReference, receiverPartyReference and similar) are transformed into separate counterparty/party entries in the CDM trade (e.g., Party1/Party2 or payer/receiver fields).
- Rationale: Apply this split transformation when the source-side signal is present.
- Evidence: 3 examples from 4/4 semantic pairs
- Caveats: `Representative examples show payerPartyReference -> payer and receiverPartyReference -> receiver.`, `Some examples raise ambiguity about how calculationAgentPartyReference is represented (see open questions).`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: payerPartyReference, receiverPartyReference, calculationAgentPartyReference (hrefs).`, `Confirm the proposed CDM representation populates: trade counterparties / party list entries (payer, receiver, Party1/Party2).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Move notional into tradeLot.quantity

- Rule id: `correlation-swaps:TR-003`
- Family: `correlation-swaps`
- Kind: `transformation`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `notional amount and currency fields`
- Target CDM paths: `tradeLot.quantity (quantity value + currency)`
- Action: Notional amount and currency from FpML are placed into the CDM tradeLot.quantity structure.
- Rationale: Apply this merge transformation when the source-side signal is present.
- Evidence: 2 examples from 4/4 semantic pairs
- Caveats: `Examples show notional mapped into tradeLot.quantity; quantity addressing in CDM (e.g., priceQuantity.address) remains an open question in some files.`
- Validate: `Confirm the FPML source contains: notional amount and currency fields.`, `Confirm the proposed CDM representation populates: tradeLot.quantity (quantity value + currency).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

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


## Variants And Branches

### Ambiguous party resolution for payer/receiver

- Rule id: `correlation-swaps:VAR-001`
- Family: `correlation-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `Examples show payer/receiver refs mapped to parties but the mapping to Party1/Party2 or which side becomes CalculationAgentIndependent is unclear.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Moderate - party resolution logic should be explicit and handle potential swaps or asymmetric roles; avoid assuming ordering without rule.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 2 examples from 4/4 semantic pairs
- Caveats: `Moderate - party resolution logic should be explicit and handle potential swaps or asymmetric roles; avoid assuming ordering without rule.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### Calculation agent mapping inconsistency

- Rule id: `correlation-swaps:VAR-002`
- Family: `correlation-swaps`
- Kind: `variant`
- Operational status: `pilot_only`
- Confidence: `high`
- Source signals: `The mapping of calculationAgentPartyReference in FpML to 'CalculationAgentIndependent' in CDM appears repeatedly but lacks clear deterministic rules in examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Moderate - implementations should treat mapping of calculationAgentPartyReference as a special-case that may require business rules or external resolution; do not assume always mapped to CalculationAgentIndependent without further confirmation.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 3 examples from 4/4 semantic pairs
- Caveats: `Moderate - implementations should treat mapping of calculationAgentPartyReference as a special-case that may require business rules or external resolution; do not assume always mapped to CalculationAgentIndependent without further confirmation.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

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


## Enrichment And Defaults

### CalculationAgent mapped to CalculationAgentIndependent

- Rule id: `correlation-swaps:ENR-001`
- Family: `correlation-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `CDM examples present a 'CalculationAgentIndependent' value where FpML references a calculationAgentParty (href); this appears to be an enrichment or defaulting behavior in the transformation.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM examples present a 'CalculationAgentIndependent' value where FpML references a calculationAgentParty (href); this appears to be an enrichment or defaulting behavior in the transformation.
- Evidence: 3 examples from 4/4 semantic pairs
- Caveats: `No deterministic rule in examples for when to use CalculationAgentIndependent vs a party-specific agent.`, `Downstream consumers should not assume the original FpML href semantics are preserved without additional resolution.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

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

### priceQuantity.address and quantity-1 usage

- Rule id: `correlation-swaps:ENR-003`
- Family: `correlation-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `CDM contains a priceQuantity.address value 'quantity-1' that is not directly traced to an obvious FpML field in the examples; likely an internal addressing/enrichment convention.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM contains a priceQuantity.address value 'quantity-1' that is not directly traced to an obvious FpML field in the examples; likely an internal addressing/enrichment convention.
- Evidence: 1 examples from 4/4 semantic pairs
- Caveats: `Treat such addressing values as CDM-side artifacts; do not assume they map to an explicit FpML element without specification.`, `If addressing is significant, include mapping metadata or generation rules to preserve traceability.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Cautions And Tentative Signals

### Settlement terms repeatedly map from correlationswap.correlationleg.settlementtype into performancepayout.settlementterms.settlementtype.

- Rule id: `correlation-swaps:TENT-001`
- Family: `correlation-swaps`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Settlement terms repeatedly map from correlationswap.correlationleg.settlementtype into performancepayout.settlementterms.settlementtype.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a strong recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 4/4 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: settlement type preserved`, `Representative note: settlement type copied`, `Representative note: Cash settlement mapped`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

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


## Do Not Assume

- Do not treat CalculationAgent mapped to CalculationAgentIndependent as a guaranteed direct mapping rule yet.
- Do not treat Relative date fields mapped into adjustableOrRelativeDate structure as a guaranteed direct mapping rule yet.
- Do not treat priceQuantity.address and quantity-1 usage as a guaranteed direct mapping rule yet.
- How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
- Where is priceQuantity.address 'quantity-1' derived from in CDM?
- Why were instrumentId schemes converted to BBGID for first two constituents?
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not apply this tentative pattern without matching source evidence.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: Mapping of calculationAgentPartyReference to CalculationAgentIndependent (insufficient deterministic detail).
- Do not treat as stable: Why some instrumentId schemes are converted to BBGID while others are not (unclear conditional rule).
- Do not treat as stable: Origin and intended semantics of CDM addressing artifacts such as priceQuantity.address 'quantity-1'.
- Do not treat as stable: Exact deterministic rules for resolving payer/receiver hrefs into Party1/Party2 and which party becomes calculation agent.
- Do not assume enrichment/default behavior for CalculationAgent mapped to CalculationAgentIndependent without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Relative date fields mapped into adjustableOrRelativeDate structure without source evidence or analyst approval.
- Do not assume enrichment/default behavior for priceQuantity.address and quantity-1 usage without source evidence or analyst approval.

## Human Review Triggers

- How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
- Where is priceQuantity.address 'quantity-1' derived from in CDM?
- Why were instrumentId schemes converted to BBGID for first two constituents?
- How was calculationAgentParty 'CalculationAgentIndependent' derived from href gh4903?
- TradeId scheme differs between FpML and CDM meta - what is the intended canonical scheme?
- Is CalculationAgent mapped as 'CalculationAgentIndependent' for both counterparties or only select roles?
- How are payer/receiver party refs resolved deterministically to Party1/Party2?
- Why does CDM use 'CalculationAgentIndependent' for calculationAgentPartyReference in these examples?
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- Party role or payment direction affects economic meaning.
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
- Check unresolved question: Where is priceQuantity.address 'quantity-1' derived from in CDM?
- Check unresolved question: Why were instrumentId schemes converted to BBGID for first two constituents?
- Check unresolved question: How was calculationAgentParty 'CalculationAgentIndependent' derived from href gh4903?
- Check unresolved question: TradeId scheme differs between FpML and CDM meta - what is the intended canonical scheme?
- Check unresolved question: Is CalculationAgent mapped as 'CalculationAgentIndependent' for both counterparties or only select roles?
- Confirm the FPML source contains: correlationswap.correlationleg.settlementtype.
- Confirm the proposed CDM representation populates: performancepayout.settlementterms.settlementtype.
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm the FPML source contains: instrumentId, description, exchange codes.
- Confirm the proposed CDM representation populates: Security.identifier.value / scheme / Security.name / exchange code normalized (e.g., XNYS), constituent identifier scheme conversions.
- Confirm the FPML source contains: payerPartyReference, receiverPartyReference, calculationAgentPartyReference (hrefs).
- Confirm the proposed CDM representation populates: trade counterparties / party list entries (payer, receiver, Party1/Party2).
- Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.
- Confirm the FPML source contains: notional amount and currency fields.
- Confirm the proposed CDM representation populates: tradeLot.quantity (quantity value + currency).
- Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.
- Confirm the FPML source contains: settlementdate.relativedate.* and relativedate.* fields.
- Confirm the proposed CDM representation populates: adjustableorrelativedate.relativedate.* plus businesscenters.businesscenter.value and relativedate.daterelativeto.externalreference.
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Because this family is pilot-only, mark the overall proposal as requiring analyst confirmation.

## Worked Examples

### correlation-swaps/eqcs-ex01-correlation-swap.xml -> correlation-swaps/eqcs-ex01-correlation-swap.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - payerPartyReference -> payer
  - receiverPartyReference -> receiver
  - relativeDate fields mapped to CDM relativeDate
  - instrumentId -> security identifier value
  - normalize exchange codes (NYSE->XNYS)
- Validation:
  - Review uncertainty: How is calculationAgentPartyReference mapped to 'CalculationAgentIndependent'?
  - Review uncertainty: Where is priceQuantity.address 'quantity-1' derived from in CDM?

### correlation-swaps/eqcs-ex02-correlation-swap-confirmation.xml -> correlation-swaps/eqcs-ex02-correlation-swap-confirmation.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - settlement type preserved
  - relative date fields nested under adjustableOrRelativeDate
  - basket securities mapped to Security structures
  - identifier scheme and exchange codes normalized (e.g. NYSE->XNYS)
- Validation:
  - Review uncertainty: Why were instrumentId schemes converted to BBGID for first two constituents?
  - Review uncertainty: How was calculationAgentParty 'CalculationAgentIndependent' derived from href gh4903?

### correlation-swaps/eqcs-ex03-correlation-swap-confirmation.xml -> correlation-swaps/eqcs-ex03-correlation-swap-confirmation.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - settlement type copied
  - relative date fields mapped
  - instrumentId -> Security.identifier.value
  - notional amount and currency mapped
  - party refs split into counterparty entries
- Validation:
  - Review uncertainty: tradeId scheme differs between FpML and CDM meta
  - Review uncertainty: is CalculationAgent mapped as 'CalculationAgentIndependent' for both parties?

## Source Evidence

- Evidence sidecar: `../references/correlation-swaps.evidence.json`
