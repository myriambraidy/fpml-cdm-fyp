# FPML -> CDM Cookbook: bond-options

## Status

- Operational status: `review_only`
- Agent use policy: Agents must not apply these rules automatically; use only as background evidence for analyst review.
- Semantic success rate: 100%
- Draft quality: `weak`
- Draft publication: `failed_integrity_validation`
- Readiness reasons: `not_final_publication`, `integrity_failed`, `weak_quality`, `high_open_question_density`

## Trigger Signals

- bond-options
- FpML top-level section: header
- FpML top-level section: party
- FpML top-level section: trade
- trade > bondOption (40 paths)
- trade > tradeHeader (3 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
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

### optionType copied from trade.bondoption.optiontype to payout.optionpayout.optiontype

- Rule id: `bond-options:TENT-001`
- Family: `bond-options`
- Kind: `mapping`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `trade.bondoption.optionType`
- Target CDM paths: `payout.optionPayout.optionType`
- Action: Option type values in the FPML bond/convertible bond option trades are preserved and placed into the CDM OptionPayout.optionType field.
- Rationale: Option type represents an option semantic that is preserved across the source and CDM target and therefore is mapped directly without transformation.
- Evidence: 3 examples from 3/3 semantic pairs
- Validate: `Confirm the FPML source contains: trade.bondoption.optionType.`, `Confirm the proposed CDM representation populates: payout.optionPayout.optionType.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`


## Transformations

### date/time trimmed to date-only

- Rule id: `bond-options:TNT-001`
- Family: `bond-options`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FPML dateTime (often with timezone or time component)`
- Target CDM paths: `CDM date (YYYY-MM-DD)`
- Action: Date/time values in FPML are trimmed/normalized to date-only (YYYY-MM-DD) in the CDM.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `Representative notes mention 'trim timezone to YYYY-MM-DD' and 'strip timezone/time to date-only' across examples.`, `Applied to trade dates and centers where present.`
- Validate: `Confirm the FPML source contains: FPML dateTime (often with timezone or time component).`, `Confirm the proposed CDM representation populates: CDM date (YYYY-MM-DD).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### party role mapping: buyer/seller -> payer/receiver

- Rule id: `bond-options:TNT-002`
- Family: `bond-options`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FPML buyer/seller references and trade party references`
- Target CDM paths: `CDM counterparty entries and OptionPayout buyer/payer and seller/receiver`
- Action: FPML buyer and seller references are mapped to CDM counterparties and used as OptionPayout buyer/payer and seller/receiver roles (buyer->payer, seller->receiver).
- Rationale: Apply this reference resolution transformation when the source-side signal is present.
- Evidence: 2 examples from 3/3 semantic pairs
- Caveats: `Examples show buyer reference mapping to counterparty and OptionPayout buyer/payer; seller to counterparty and OptionPayout seller/receiver.`, `There is repeated uncertainty about payer/receiver inversion which suggests mapping exists but its direction/semantics should be verified.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: FPML buyer/seller references and trade party references.`, `Confirm the proposed CDM representation populates: CDM counterparty entries and OptionPayout buyer/payer and seller/receiver.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### numberOfOptions -> tradeLot.quantity and parValue -> multiplier

- Rule id: `bond-options:TNT-003`
- Family: `bond-options`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FPML numberOfOptions, parValue`
- Target CDM paths: `CDM tradeLot.quantity, tradeLot.multiplier`
- Action: FPML numberOfOptions becomes a CDM quantity; FPML parValue becomes a multiplier on the CDM trade lot.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 1 examples from 3/3 semantic pairs
- Caveats: `Represented in cb-option mapping: 'numberOfOptions->quantity, parValue->multiplier, currency->currency'.`
- Validate: `Confirm the FPML source contains: FPML numberOfOptions, parValue.`, `Confirm the proposed CDM representation populates: CDM tradeLot.quantity, tradeLot.multiplier.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### premium mapped to transferHistory entry

- Rule id: `bond-options:TNT-004`
- Family: `bond-options`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FPML premium element`
- Target CDM paths: `CDM transferHistory / transfer entries`
- Action: FPML premium information is represented as a transfer/transferHistory entry in the CDM.
- Rationale: Apply this wrapper insertion transformation when the source-side signal is present.
- Evidence: 1 examples from 3/3 semantic pairs
- Caveats: `bond-option shows premium mapped to transferHistory; appears as a transfer wrapper in target.`
- Validate: `Confirm the FPML source contains: FPML premium element.`, `Confirm the proposed CDM representation populates: CDM transferHistory / transfer entries.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### notional/par value mapping to tradeLot quantity

- Rule id: `bond-options:TNT-005`
- Family: `bond-options`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FPML notional / nominal / par value fields`
- Target CDM paths: `CDM tradeLot.quantity (and possibly multiplier per above)`
- Action: FPML notional/par value is used to produce tradeLot.quantity in CDM (notional-sized quantity representation).
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 1 examples from 3/3 semantic pairs
- Caveats: `bond-option highlights notional mapped to tradeLot quantity.`
- Validate: `Confirm the FPML source contains: FPML notional / nominal / par value fields.`, `Confirm the proposed CDM representation populates: CDM tradeLot.quantity (and possibly multiplier per above).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### currency preserved

- Rule id: `bond-options:TNT-006`
- Family: `bond-options`
- Kind: `transformation`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `FPML currency attributes`
- Target CDM paths: `CDM currency fields`
- Action: Currency values are preserved from FPML into CDM currency fields for quantity/amounts.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 1 examples from 3/3 semantic pairs
- Caveats: `Explicit mention in cb-option: 'currency->currency'.`
- Validate: `Confirm the FPML source contains: FPML currency attributes.`, `Confirm the proposed CDM representation populates: CDM currency fields.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`


## Variants And Branches

### OptionPayout.payerReceiver inversion

- Rule id: `bond-options:VAR-001`
- Family: `bond-options`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Several examples show payer/receiver values that appear inverted relative to FPML buyer/seller; mapping direction may differ or be intentionally inverted in CDM.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Mapping of buyer/seller to payer/receiver should be treated as a variant; automated rules should include a verification step. This reduces confidence in blindly swapping roles without checking contextual semantics.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `Mapping of buyer/seller to payer/receiver should be treated as a variant; automated rules should include a verification step. This reduces confidence in blindly swapping roles without checking contextual semantics.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

### calculationAgent mapping to CalculationAgentIndependent ancillaryParty

- Rule id: `bond-options:VAR-002`
- Family: `bond-options`
- Kind: `variant`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Some examples show FPML calculationAgentPartyReference becoming a CDM ancillary party typed 'CalculationAgentIndependent' rather than a straightforward party reference.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: This appears to be an enrichment/normalization choice; treat as an exception that requires explicit handling or confirmation rather than an automatic party reference mapping.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `This appears to be an enrichment/normalization choice; treat as an exception that requires explicit handling or confirmation rather than an automatic party reference mapping.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`, `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`


## Enrichment And Defaults

### calculationAgentPartyReference -> CalculationAgentIndependent ancillaryParty

- Rule id: `bond-options:ENR-001`
- Family: `bond-options`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `FPML calculationAgent references are turned into an ancillaryParty entry with role 'CalculationAgentIndependent' in the CDM (appears to be an enrichment or normalization).`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: FPML calculationAgent references are turned into an ancillaryParty entry with role 'CalculationAgentIndependent' in the CDM (appears to be an enrichment or normalization).
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `Representation changes party reference semantics; require confirmation whether this is always desired or only for specific agent types.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `Party role or payment direction affects economic meaning.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### payer/receiver role normalization

- Rule id: `bond-options:ENR-002`
- Family: `bond-options`
- Kind: `enrichment`
- Operational status: `review_only`
- Confidence: `low`
- Source signals: `The translation from FPML buyer/seller to CDM payer/receiver may include normalization logic that inverts or reinterprets roles.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as unclear; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: The translation from FPML buyer/seller to CDM payer/receiver may include normalization logic that inverts or reinterprets roles.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `Observed inversion or unexpected assignment of payer/receiver; treat as a potential enrichment or domain-specific reinterpretation and validate against business rules.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `Party role or payment direction affects economic meaning.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Cautions And Tentative Signals

### Option-specific terms repeatedly map from trade.bondoption.optiontype into payout.optionpayout.optiontype.

- Rule id: `bond-options:TENT-001`
- Family: `bond-options`
- Kind: `caution`
- Operational status: `review_only`
- Confidence: `blocked`
- Source signals: `Option-specific terms repeatedly map from trade.bondoption.optiontype into payout.optionpayout.optiontype.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a strong recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 3/3 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: option type preserved`, `Representative note: optionType copied`, `Representative note: optionType value mapped`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Do Not Assume

- Do not treat calculationAgentPartyReference -> CalculationAgentIndependent ancillaryParty as a guaranteed direct mapping rule yet.
- Do not treat payer/receiver role normalization as a guaranteed direct mapping rule yet.
- Why is payerReceiver inverted versus buyerSeller in CDM?
- Why OptionPayout.payerReceiver shows payer/receiver reversed?
- How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?
- How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not apply this tentative pattern without matching source evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: Exact semantics/direction when mapping buyer/seller to payer/receiver (observed inversions).
- Do not treat as stable: Transformation of calculationAgent references into CalculationAgentIndependent ancillaryParty (suspected enrichment).
- Do not treat as stable: Explicit linking of underlier Observable to convertibleBond.instrumentId (unresolved).
- Do not treat as stable: Any automated rule that assumes payer/receiver direction without validation.
- Do not assume enrichment/default behavior for calculationAgentPartyReference -> CalculationAgentIndependent ancillaryParty without source evidence or analyst approval.
- Do not assume enrichment/default behavior for payer/receiver role normalization without source evidence or analyst approval.

## Human Review Triggers

- Why OptionPayout.payerReceiver shows payer/receiver reversed?
- How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?
- Why is payerReceiver inverted versus buyerSeller in CDM?
- How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Is underlier Observable explicitly linked to convertibleBond.instrumentId?
- Party role or payment direction affects economic meaning.
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: Why OptionPayout.payerReceiver shows payer/receiver reversed?
- Check unresolved question: How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?
- Check unresolved question: Why is payerReceiver inverted versus buyerSeller in CDM?
- Check unresolved question: How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
- Check unresolved question: Is underlier Observable explicitly linked to convertibleBond.instrumentId?
- Check enrichment/default behavior: FPML calculationAgent references are turned into an ancillaryParty entry with role 'CalculationAgentIndependent' in the CDM (appears to be an enrichment or normalization).
- Confirm the FPML source contains: trade.bondoption.optionType.
- Confirm the proposed CDM representation populates: payout.optionPayout.optionType.
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm the FPML source contains: FPML dateTime (often with timezone or time component).
- Confirm the proposed CDM representation populates: CDM date (YYYY-MM-DD).
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: FPML buyer/seller references and trade party references.
- Confirm the proposed CDM representation populates: CDM counterparty entries and OptionPayout buyer/payer and seller/receiver.
- Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.
- Confirm the FPML source contains: FPML numberOfOptions, parValue.
- Confirm the proposed CDM representation populates: CDM tradeLot.quantity, tradeLot.multiplier.
- Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.
- Confirm the FPML source contains: FPML premium element.
- Confirm the proposed CDM representation populates: CDM transferHistory / transfer entries.
- Confirm the FPML source contains: FPML notional / nominal / par value fields.
- Confirm the proposed CDM representation populates: CDM tradeLot.quantity (and possibly multiplier per above).
- Confirm the FPML source contains: FPML currency attributes.
- Confirm the proposed CDM representation populates: CDM currency fields.
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Do not use this document to automatically map fields; use it only to explain uncertainty.

## Worked Examples

### bond-options/cb-option-2.xml -> bond-options/cb-option-2.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - buyer reference maps to counterparty and OptionPayout buyer
  - seller reference maps to counterparty and OptionPayout seller
  - optionType copied
  - settlementType copied
  - trim timezone to YYYY-MM-DD
- Validation:
  - Review uncertainty: Why is payerReceiver inverted versus buyerSeller in CDM?

### bond-options/bond-option.xml -> bond-options/bond-option.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - option type preserved
  - premium mapped to transferHistory
  - notional mapped to tradeLot quantity
  - strip timezone/time to date-only
- Validation:
  - Review uncertainty: Why OptionPayout.payerReceiver shows payer/receiver reversed?
  - Review uncertainty: How calculationAgent became 'CalculationAgentIndependent' ancillaryParty?

### bond-options/cb-option.xml -> bond-options/cb-option.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - optionType value mapped
  - buyer->payer, seller->receiver
  - date normalized and centers mapped
  - numberOfOptions->quantity, parValue->multiplier, currency->currency
- Validation:
  - Review uncertainty: How is calculationAgentPartyReference mapped to CalculationAgentIndependent?
  - Review uncertainty: Is underlier Observable explicitly linked to convertibleBond.instrumentId?

## Source Evidence

- Evidence sidecar: `../references/bond-options.evidence.json`
