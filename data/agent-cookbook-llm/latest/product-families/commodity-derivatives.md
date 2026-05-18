# FPML -> CDM Cookbook: commodity-derivatives

## Status

- Operational status: `ready`
- Agent use policy: Agents may apply these rules during normal FPML to CDM proposal generation.
- Semantic success rate: 100%
- Draft quality: `strong`
- Draft publication: `success`

## Trigger Signals

- commodity-derivatives
- FpML top-level section: party
- FpML top-level section: trade
- trade > commoditySwap (47 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- party > partyName (2 paths)
- trade > documentation (2 paths)
- trade > commoditySwap (29 paths)
- trade > commoditySwap (26 paths)
- trade > commoditySwap (28 paths)
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

### Effective date unadjustedDate copied

- Rule id: `commodity-derivatives:RULE-001`
- Family: `commodity-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `effectivedate.adjustabledate.unadjusteddate`
- Target CDM paths: `effectivedate.adjustabledate.unadjusteddate`
- Action: Effective (unadjusted) dates in FpML are repeatedly carried into the CDM effectiveDate.adjustableDate.unadjustedDate element without semantic transformation.
- Rationale: Multiple example trades show identical unadjusted date values preserved in CDM effective date fields, indicating a direct copy rule.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `This addresses the unadjustedDate element specifically; businessDayConvention and adjustment rules may also appear separately in examples.`
- Validate: `Confirm the FPML source contains: effectivedate.adjustabledate.unadjusteddate.`, `Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Termination date unadjustedDate copied

- Rule id: `commodity-derivatives:RULE-002`
- Family: `commodity-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `terminationdate.adjustabledate.unadjusteddate`
- Target CDM paths: `terminationdate.adjustabledate.unadjusteddate`
- Action: Termination (unadjusted) dates in FpML are repeatedly carried into the CDM terminationDate.adjustableDate.unadjustedDate element without semantic transformation.
- Rationale: Representative examples consistently preserve the FpML termination unadjusted date in the CDM termination date field, indicating a direct mapping.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `This is specific to unadjustedDate copying; other termination-related metadata (conventions/adjustments) may require additional mapping rules.`
- Validate: `Confirm the FPML source contains: terminationdate.adjustabledate.unadjusteddate.`, `Confirm the proposed CDM representation populates: terminationdate.adjustabledate.unadjusteddate.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Fixed price elements normalized into CDM price structure

- Rule id: `commodity-derivatives:RULE-003`
- Family: `commodity-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `fixedleg.fixedprice.price | fixedleg.fixedprice.pricecurrency | fixedleg.fixedprice.priceunit`
- Target CDM paths: `price.value.value | unit.currency.value | value.perunitof.capacityunit`
- Action: FpML fixed price, currency and unit elements are repeatedly reshaped into the CDM price object with nested value, currency and per-unit unit normalization.
- Rationale: Multiple fixed-price physical trades show the same normalization pattern: numeric price -> price.value.value, currency -> unit.currency.value, and unit normalized into per-unit capacityUnit.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `Unit normalization mapping (e.g., Gal -> USGAL) is applied in examples; some unit mappings are uncertain or context-dependent.`
- Validate: `Confirm the FPML source contains: fixedleg.fixedprice.price | fixedleg.fixedprice.pricecurrency | fixedleg.fixedprice.priceunit.`, `Confirm the proposed CDM representation populates: price.value.value | unit.currency.value | value.perunitof.capacityunit.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

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


## Transformations

### Price fields reshaped and unit normalized

- Rule id: `commodity-derivatives:TR-001`
- Family: `commodity-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `fixedleg.fixedprice.price + fixedleg.fixedprice.pricecurrency + fixedleg.fixedprice.priceunit`
- Target CDM paths: `price.value.value + unit.currency.value + value.perunitof.capacityunit`
- Action: Fixed-price fields (price, currency, unit) are reshaped into the CDM price structure and units normalized to CDM canonical unit codes.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `Example mappings include explicit unit normalization (e.g., Gal -> USGAL).`, `Mapping assumes a canonical CDM unit vocabulary; some source units require normalization rules.`
- Validate: `Confirm the FPML source contains: fixedleg.fixedprice.price + fixedleg.fixedprice.pricecurrency + fixedleg.fixedprice.priceunit.`, `Confirm the proposed CDM representation populates: price.value.value + unit.currency.value + value.perunitof.capacityunit.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Spread amount+currency converted to CDM price structure

- Rule id: `commodity-derivatives:TR-002`
- Family: `commodity-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `calculation.spread.amount | calculation.spread.currency`
- Target CDM paths: `price.value.value | unit.currency.value`
- Action: Calculation spread amounts with currency are repeatedly converted into the CDM price.value and unit.currency representation.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 23/23 semantic pairs
- Caveats: `This converts 'spread' style pricing into the canonical CDM price representation used elsewhere in the folder.`, `Some spreads are expressed relative to indexes or references and may require additional resolution outside this normalization.`
- Validate: `Confirm the FPML source contains: calculation.spread.amount | calculation.spread.currency.`, `Confirm the proposed CDM representation populates: price.value.value | unit.currency.value.`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Normalization repeatedly reshapes calculation.spread.amount|calculation.spread.currency into price.value.value|unit.currency.value.

- Rule id: `commodity-derivatives:TENT-008`
- Family: `commodity-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Normalization repeatedly reshapes calculation.spread.amount|calculation.spread.currency into price.value.value|unit.currency.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: spread amount+currency converted to price value and unit currency`, `Confidence mix includes high.`, `Representative note: spread converted to price structure`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Variants And Branches

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

### Unit code normalization exceptions

- Rule id: `commodity-derivatives:VAR-002`
- Family: `commodity-derivatives`
- Kind: `variant`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `Source unit codes are normalized to CDM canonical codes in examples (e.g., 'Gal' -> 'USGAL'). Other units appear with uncertain mappings (MMBTU -> USMMBTU, Therm -> USTHM) and may require specific rules.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Unit normalization is necessary for price and volume fields. Some source units require explicit mapping rules; absent those rules, canonicalization may be inconsistent across trades.
- Rationale: Use this branch only when the source product subtype or structure matches the variant description.
- Evidence: 3 examples from 23/23 semantic pairs
- Caveats: `Unit normalization is necessary for price and volume fields. Some source units require explicit mapping rules; absent those rules, canonicalization may be inconsistent across trades.`
- Human review when: `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`
- Validate: `Confirm the source product subtype matches this variant before applying variant-specific mapping rules.`


## Enrichment And Defaults

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


## Cautions And Tentative Signals

### Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.

- Rule id: `commodity-derivatives:TENT-001`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: effective date copied`, `Representative note: effective date value copied`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### termination date copied (direct mapping; terminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate)

- Rule id: `commodity-derivatives:TENT-003`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `termination date copied (direct mapping; terminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: termination date copied`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Economic terms repeatedly reshape from fixedleg.fixedprice.price|fixedleg.fixedprice.pricecurrency|fixedleg.fixedprice.priceunit into price.value.value|unit.currency.value|value.perunitof.capacityunit.

- Rule id: `commodity-derivatives:TENT-005`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Economic terms repeatedly reshape from fixedleg.fixedprice.price|fixedleg.fixedprice.pricecurrency|fixedleg.fixedprice.priceunit into price.value.value|unit.currency.value|value.perunitof.capacityunit.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: price,currency,unit normalized into CDM price structure`, `Representative note: price, currency and unit mapped; unit normalized`, `Representative note: fixed price, currency and unit mapped`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### effectiveDate unadjustedDate (direct mapping; effectivedate.adjustabledate.unadjusteddate -> effectivedate.adjustabledate.unadjusteddate)

- Rule id: `commodity-derivatives:TENT-006`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `effectiveDate unadjustedDate (direct mapping; effectivedate.adjustabledate.unadjusteddate -> effectivedate.adjustabledate.unadjusteddate)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: effectiveDate unadjustedDate`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Option-specific terms repeatedly map from trade.commodityoption.optiontype into payout.optionpayout.optiontype.

- Rule id: `commodity-derivatives:TENT-007`
- Family: `commodity-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Option-specific terms repeatedly map from trade.commodityoption.optiontype into payout.optionpayout.optiontype.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 23/23 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: option type`, `Representative note: Option type 'Put' mapped`, `Representative note: Option type 'Call' mapped`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Do Not Assume

- Do not treat meta.globalKey entries generated as a guaranteed direct mapping rule yet.
- Do not treat Party identifiers (LEI) added in CDM as a guaranteed direct mapping rule yet.
- Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?
- CDM party.partyId LEI values absent in FpML; source of LEIs?
- Why CDM has duplicated tradeIdentifier entries for same tradeId?
- Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?
- Do not apply this tentative pattern without matching source evidence.
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not treat as stable: The provenance and handling of duplicated tradeIdentifier entries in CDM (frequently observed) - whether canonical deduplication is required.
- Do not treat as stable: Canonical unit mappings for some units (MMBTU, Therm) where source-to-CDM mapping rules are not consistently shown.
- Do not treat as stable: Location or modeling of deliveryPoint values (e.g., 'TW-WTX') in CDM - may be omitted or represented elsewhere.
- Do not treat as stable: Source of LEI/party identifier values present in CDM but absent from FpML.
- Do not assume enrichment/default behavior for meta.globalKey entries generated without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Party identifiers (LEI) added in CDM without source evidence or analyst approval.

## Human Review Triggers

- Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?
- CDM party.partyId LEI values absent in FpML; source of LEIs?
- Why CDM has duplicated tradeIdentifier entries for same tradeId?
- Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?
- Why are tradeIdentifier entries duplicated with same assignedIdentifier?
- MasterAgreementType mapped to 'ISDAMaster' in CDM; is this normalization?
- deliveryPoint 'TW-WTX' not represented in CDM?
- What rule maps Therm to USTHM?
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.
- Party role or payment direction affects economic meaning.

## Validation Checklist

- Check unresolved question: Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?
- Check unresolved question: CDM party.partyId LEI values absent in FpML; source of LEIs?
- Check unresolved question: Why CDM has duplicated tradeIdentifier entries for same tradeId?
- Check unresolved question: Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?
- Check unresolved question: Why are tradeIdentifier entries duplicated with same assignedIdentifier?
- Check unresolved question: MasterAgreementType mapped to 'ISDAMaster' in CDM; is this normalization?
- Confirm the FPML source contains: effectivedate.adjustabledate.unadjusteddate.
- Confirm the proposed CDM representation populates: effectivedate.adjustabledate.unadjusteddate.
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: terminationdate.adjustabledate.unadjusteddate.
- Confirm the proposed CDM representation populates: terminationdate.adjustabledate.unadjusteddate.
- Confirm the FPML source contains: fixedleg.fixedprice.price | fixedleg.fixedprice.pricecurrency | fixedleg.fixedprice.priceunit.
- Confirm the proposed CDM representation populates: price.value.value | unit.currency.value | value.perunitof.capacityunit.
- Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.
- Confirm the FPML source contains: trade.commodityoption.optiontype.
- Confirm the proposed CDM representation populates: payout.optionpayout.optiontype.
- Confirm the FPML source contains: fixedleg.fixedprice.price + fixedleg.fixedprice.pricecurrency + fixedleg.fixedprice.priceunit.
- Confirm the proposed CDM representation populates: price.value.value + unit.currency.value + value.perunitof.capacityunit.
- Confirm the FPML source contains: calculation.spread.amount | calculation.spread.currency.
- Confirm the proposed CDM representation populates: price.value.value | unit.currency.value.
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.

## Worked Examples

### commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.xml -> commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - effective date copied
  - termination date copied
  - price and currency mapped; unit normalized
  - MMBTU normalized to USMMBTU
- Validation:
  - Review uncertainty: Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?

### commodity-derivatives/com-ex10-physical-oil-pipeline-crude-wti-floating-price.xml -> commodity-derivatives/com-ex10-physical-oil-pipeline-crude-wti-floating-price.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - trade date copied
  - effective unadjusted date copied
  - termination unadjusted date copied
  - commodity instrument id -> commodity identifier
  - href party refs normalized to Party1/Party2 roles
- Validation:
  - Review uncertainty: CDM party.partyId LEI values absent in FpML; source of LEIs?
  - Review uncertainty: Why CDM has duplicated tradeIdentifier entries for same tradeId?

### commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.xml -> commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - effectiveDate unadjusted and convention
  - terminationDate unadjusted and convention
  - partyA tradeId and scheme
  - party names mapped to CDM party.name
  - normalize unit Gal to USGAL and map numeric price
- Validation:
  - Review uncertainty: Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?

## Source Evidence

- Evidence sidecar: `../references/commodity-derivatives.evidence.json`
