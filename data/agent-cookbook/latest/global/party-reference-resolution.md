# Global FPML -> CDM Party Reference Resolution

Use these rules when resolving party hrefs, counterparties, payer/receiver roles, and party direction.

## Promoted Cross-Family Rules

No rules have enough cross-family evidence for promotion yet.

## Family-Specific Evidence

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

### Resolve party hrefs -> CDM party references and roles

- Rule id: `fx-derivatives:TR-001`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `partyReference hrefs and buyer/seller/payer/receiver references (FpML)`
- Target CDM paths: `CDM party references with party roles (e.g., Party1/Party2) used in buyerSeller and payout sections`
- Action: FpML party references (hrefs) are resolved into CDM party objects and assigned CDM roles (Party1/Party2 labels appear in CDM).
- Rationale: Apply this reference resolution transformation when the source-side signal is present.
- Evidence: 8 examples from 25/25 semantic pairs
- Caveats: `Examples show consistent resolution of hrefs into CDM party objects but also show apparent inversions of buyer/seller roles (CDM Party1 vs FpML party2) in several cases.`, `Mapping logic for deriving Party1/Party2 labels from FpML hrefs is not explicit in examples.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the FPML source contains: partyReference hrefs and buyer/seller/payer/receiver references (FpML).`, `Confirm the proposed CDM representation populates: CDM party references with party roles (e.g., Party1/Party2) used in buyerSeller and payout sections.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.`

### Buyer/Seller role inversion

- Rule id: `fx-derivatives:VAR-002`
- Family: `fx-derivatives`
- Kind: `variant`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `Several CDM examples show buyer/seller or payer/receiver roles appearing inverted compared to the FpML buyerPartyReference/sellerPartyReference hrefs.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Role mapping cannot be safely generalized without clarifying the rule used to derive CDM Party1/Party2 from FpML hrefs; treat buyer/seller polarity as tentative in mappings.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 5 examples from 25/25 semantic pairs
- Caveats: `Role mapping cannot be safely generalized without clarifying the rule used to derive CDM Party1/Party2 from FpML hrefs; treat buyer/seller polarity as tentative in mappings.`
- Human review when: `Party role or payment direction affects economic meaning.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`

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


## Do Not Assume

- Do not infer party direction from document order alone.

## Validation Checklist

- Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.
- If the source signal does not match the rule, do not apply the rule.
- Validate Party1/Party2 and payer/receiver direction against the FPML product context.
- Mark ambiguous party direction for analyst review.
