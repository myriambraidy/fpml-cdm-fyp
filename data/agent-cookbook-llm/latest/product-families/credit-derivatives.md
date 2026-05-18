# FPML -> CDM Cookbook: credit-derivatives

## Status

- Operational status: pilot_only
- Agent use policy: Apply rules cautiously; mark all material proposals for analyst confirmation
- Semantic success rate: 100%
- Draft quality: good
- Draft publication: success

## Trigger Signals

Apply this page when any of the following are present in the FpML document:
- Family: credit-derivatives
- Top-level sections: party, trade
- Product node: trade > creditDefaultSwap
- Trade metadata nodes: trade > documentation, trade > tradeHeader
- Party metadata nodes: party > partyId, party > partyName
- Calculation agent nodes: trade > calculationAgent, trade > calculationAgentBusinessCenter

## Canonical Mapping Procedure

1. Start from repeated FpML sections: party, trade. [Pilot-only: require analyst confirmation]
2. Map trade identifiers, party references, and trade dates before product-specific economics. [Pilot-only]
3. Apply a rule only when the exact source cue appears in the FpML. If absent or structurally different, skip and mark for review. [Pilot-only]
4. Apply the date reshaping/normalization transformations below to relocate FpML dates into CDM adjustableDate structures when source-side signals match. [Pilot-only]
5. Assemble results under standard CDM scaffolding (e.g., trade, meta) only where supported by rules; treat generated identifiers/global keys as enrichment. [Pilot-only]
6. Treat any generated identifiers, global keys, and unmatched party identifiers as enrichment requiring analyst approval unless source-backed.

## Stable Rules

- None recovered for this family (no stable operational rules). [Analyst confirmation required for all material mappings]

## Transformations

All transformations in this family are pilot_only. Apply only when the exact source signals match. Mark results for analyst review.

- Rule id: credit-derivatives:TR-001 — effectiveDate reshaped into adjustableDate
  - Applies when: FpML generalTerms.effectivedate.unadjustedDate is present
  - Inspect: generalTerms.effectivedate.unadjustedDate (FpML)
  - Propose CDM: effectivedate.adjustableDate.unadjustedDate (CDM)
  - Action: Relocate the unadjusted date into CDM adjustableDate.unadjustedDate; normalize date format (examples remove trailing 'Z' and standardize to YYYY-MM-DD)
  - Validate:
    - Confirm source presence of generalTerms.effectivedate.unadjustedDate
    - Confirm CDM effectivedate.adjustableDate.unadjustedDate is populated and value normalized as observed
    - Ensure no required timezone semantics are lost
  - Do not apply when: The source field is absent or adjusted-date semantics/business-day adjustments are specified that this rule does not cover
  - Analyst review triggers: Any timezone content in source, any business-day adjustment context, or any enrichment/default behavior

- Rule id: credit-derivatives:TR-002 — reshape effective/termination date locations and normalize format
  - Applies when: Either FpML generalTerms.effectivedate.unadjustedDate or scheduledTerminationDate.adjustableDate.unadjustedDate is present
  - Inspect: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate (FpML)
  - Propose CDM: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate (CDM)
  - Action: Relocate and normalize unadjusted date values; examples remove trailing 'Z' and standardize to YYYY-MM-DD
  - Validate:
    - Confirm exact source fields exist
    - Confirm proposed CDM targets are populated with normalized values
    - If business-day adjustments are present in FpML, flag for separate handling and analyst review
  - Do not apply when: The source fields differ structurally or represent adjusted dates beyond this rule’s scope
  - Analyst review triggers: Any business-day adjustment, offsets, or timezone semantics

- Rule id: credit-derivatives:TR-003 — multiple date fields normalized and relocated
  - Applies when: Any of these FpML fields is present: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate | trade.tradeHeader.tradeDate
  - Inspect: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate | trade.tradeHeader.tradeDate (FpML)
  - Propose CDM: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate | trade.tradedate.value (CDM)
  - Action: Relocate and normalize each present date; examples strip trailing 'Z' and use YYYY-MM-DD
  - Validate:
    - Confirm presence of each source field used
    - Confirm each mapped CDM field is populated and normalized
    - Verify any removed timezone metadata is non-essential
  - Do not apply when: Source fields are absent or contain adjusted-date semantics not covered here
  - Analyst review triggers: Any timezone content, business-day adjustments, or inconsistent date schemes

- Tentative normalization branches (apply only when exact pattern match; always mark for review):
  - credit-derivatives:TENT-004 — effectivedate/scheduledTerminationDate to CDM effectivedate/terminationdate with normalization
  - credit-derivatives:TENT-009 — extends above to include tradeHeader.tradeDate -> trade.tradeDate.value

## Variants And Branches

- Rule id: credit-derivatives:VAR-001 — calculationAgentPartyReference -> CalculationAgentIndependent (ambiguous)
  - Applies when: Examples show calculationAgentPartyReference present in FpML, and outputs contain a CDM value labeled "CalculationAgentIndependent"
  - Inspect: calculationAgentPartyReference (FpML)
  - Propose CDM: Do not assume party-reference-to-role identity; if examples match, propose the observed label with caution
  - Validate: Confirm the source product subtype/structure matches the observed variant cases before proposing
  - Do not apply when: Source structure does not match the observed cases; when party role mapping is ambiguous
  - Analyst review triggers: Any party/role inference; directionality or economic meaning impact; open questions around derivation

- Rule id: credit-derivatives:VAR-002 — duplicated assignedIdentifier entries
  - Applies when: Multiple tradeHeader.partyTradeIdentifier elements exist in FpML
  - Inspect: tradeHeader.partyTradeIdentifier (FpML)
  - Propose CDM: Multiple tradeIdentifier.assignedIdentifier entries may appear; do not assume uniqueness without de-duplication rules
  - Validate: Preserve provenance (scheme/href) where present; verify intentional duplication vs. required consolidation
  - Do not apply when: Single partyTradeIdentifier exists or deduplication rules are governed elsewhere
  - Analyst review triggers: Any identifier duplication or consolidation decision

## Enrichment And Defaults

Treat all enrichments as non-literal and require analyst approval.

- Rule id: credit-derivatives:ENR-001 — LEI or generated party identifiers added
  - Signal: Generated identifiers/defaults appear under partyId.identifier.value in CDM while absent in FpML
  - Action: Do not generate; treat as enrichment unless source-backed or approved default
  - Validate: Confirm each enriched/defaulted value is source-present or explicitly approved
  - Analyst review triggers: Any added party identifiers or LEIs not in source FpML

- Rule id: credit-derivatives:ENR-002 — meta.globalKey generated on adjustableDate
  - Signal: adjustableDate.meta.globalKey present in CDM, absent in FpML
  - Action: Treat as generated metadata; document provenance if persisted
  - Validate: Do not rely on this as source-supplied identifier; confirm governance for key generation
  - Analyst review triggers: Any use of generated meta keys

- Tentative enrichment signals (apply only on exact match and mark for review):
  - credit-derivatives:TENT-001 — generated partyId.identifier.value occurrences
  - credit-derivatives:TENT-002 — generated adjustableDate.meta.globalKey occurrences

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

Trigger analyst review when any of the following apply:
- Calculation agent derivation: calculationAgentPartyReference -> CalculationAgentIndependent
- Multiple tradeIdentifier.assignedIdentifier entries appear or de-duplication is needed
- Party role label mapping (Party1/Party2) to FpML hrefs is ambiguous
- Guarantor or reference entity mapping uncertainty
- Presence of enriched identifiers (e.g., LEIs) not in FpML source
- Any transformation that removes timezone info or overlooks business-day adjustments
- Any mapping guided by tentative rules (TENT-*)
- Any enrichment/default not directly copied from FpML

## Validation Checklist

- Confirm the FpML source contains: generalTerms.effectivedate.unadjustedDate (FpML)
- Confirm the proposed CDM populates: effectivedate.adjustableDate.unadjustedDate (CDM)
- Confirm the FpML source contains: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate (FpML)
- Confirm the proposed CDM populates: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate (CDM)
- Confirm the FpML source contains: generalTerms.effectivedate.unadjustedDate | scheduledTerminationDate.adjustableDate.unadjustedDate | trade.tradeHeader.tradeDate (FpML)
- Confirm the proposed CDM populates: effectivedate.adjustableDate.unadjustedDate | terminationdate.adjustableDate.unadjustedDate | trade.tradedate.value (CDM)
- Confirm date/time normalization (e.g., trailing 'Z' removed) is intentional and does not drop required timezone semantics
- Confirm variant application only when source subtype/structure matches (e.g., calculation agent variant, identifier duplication)
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review
- Because this family is pilot-only, mark the overall proposal as requiring analyst confirmation

## Worked Examples

- credit-derivatives/cd-ex01-long-asia-corp-fixreg.xml -> credit-derivatives/cd-ex01-long-asia-corp-fixreg.json
  - Source signals: trade, party
  - CDM guidance: effectiveDate moved under adjustableDate; termination unadjustedDate copied; reference entity name/id copied; business centers mapped to array; payment frequency split as observed
  - Validation notes: Review calculationAgentPartyReference -> CalculationAgentIndependent; investigate repeated tradeIdentifier entries

- credit-derivatives/cd-ex02-2003-short-asia-corp-fixreg.xml -> credit-derivatives/cd-ex02-2003-short-asia-corp-fixreg.json
  - Source signals: trade, party
  - CDM guidance: dates normalized (Z removed); termination date normalized; reference entity name copied; tradeId and scheme preserved; calculationAmount into tradeLot quantity structure
  - Validation notes: Confirm party role label mapping (Party1/Party2) to FpML hrefs

- credit-derivatives/cd-ex02-short-asia-corp-fixreg.xml -> credit-derivatives/cd-ex02-short-asia-corp-fixreg.json
  - Source signals: trade, party
  - CDM guidance: effective/termination dates mapped and Z removed; reference entity name/id mapped; restructuring type mapped; periodic payment split into interest payout and price/quantity structures
  - Validation notes: Investigate duplicate assignedIdentifier entries in CDM

## Source Evidence

- Evidence sidecar: ../references/credit-derivatives.evidence.json