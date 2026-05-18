# Global FPML -> CDM Wrapper Construction

Use these rules when CDM requires wrapper structures around source values.

## Promoted Cross-Family Rules

No rules have enough cross-family evidence for promotion yet.

## Family-Specific Evidence

### Option type mapping to payout.optionpayout.optiontype

- Rule id: `commodity-derivatives:RULE-004`
- Family: `commodity-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `trade.commodityoption.optiontype`
- Target CDM paths: `payout.optionpayout.optiontype`
- Action: Commodity option trades map the FpML option type into the CDM payout.optionPayout.optionType element (e.g., Call/Put -> OptionType).
- Rationale: All representative option examples show direct mapping of the option type from the FpML option section into the CDM payout structure.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `This covers option-type value mapping only; other option-specific fields (exercise style, expiries) may need separate handling.`
- Validate: `Confirm the FPML source contains: trade.commodityoption.optiontype.`, `Confirm the proposed CDM representation populates: payout.optionpayout.optiontype.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

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


## Do Not Assume

- Do not generalize a family-specific rule unless this global document says it is promoted.

## Validation Checklist

- Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.
- If the source signal does not match the rule, do not apply the rule.
