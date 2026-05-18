# FPML -> CDM Cookbook: fx-derivatives

## Status

- Operational status: `ready`
- Agent use policy: Agents may apply these rules during normal FPML to CDM proposal generation.
- Semantic success rate: 100%
- Draft quality: `strong`
- Draft publication: `success`

## Trigger Signals

- fx-derivatives
- FpML top-level section: header
- FpML top-level section: party
- FpML top-level section: trade
- trade > fxSingleLeg (13 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- header > conversationId (1 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)
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

### Trade date normalization (remove trailing 'Z')

- Rule id: `fx-derivatives:RULE-002`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `trade.tradeHeader.tradeDate (FpML with timezone 'Z')`
- Target CDM paths: `trade.tradeDate.value (CDM normalized ISO date without trailing 'Z')`
- Action: Dates copied from FpML have their trailing 'Z' (UTC designator) trimmed in CDM date.value fields to produce a plain date string.
- Rationale: CDM date fields in these examples use a normalized date format without the timezone marker; mapping routine trims the 'Z' to conform to CDM expected value.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Normalization appears consistent in examples but rules for timezone-preserving conversions (if needed) are not shown.`
- Validate: `Confirm the FPML source contains: trade.tradeHeader.tradeDate (FpML with timezone 'Z').`, `Confirm the proposed CDM representation populates: trade.tradeDate.value (CDM normalized ISO date without trailing 'Z').`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Option product type -> CDM taxonomy name

- Rule id: `fx-derivatives:RULE-003`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `trade.fxdigitaloption.productType (FpML productType strings)`
- Target CDM paths: `trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name)`
- Action: FpML product type labels (e.g., 'Euro Binary') are normalized and mapped into a CDM taxonomy name value (e.g., 'EuroBinary').
- Rationale: CDM uses standardized taxonomy strings for product classification; mapping normalizes source labels to the expected CDM taxonomy representations.
- Evidence: 5 examples from 25/25 semantic pairs
- Caveats: `Normalization details (exact string transformations) are inferred from examples but not exhaustively specified across all possible productType variants.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: trade.fxdigitaloption.productType (FpML productType strings).`, `Confirm the proposed CDM representation populates: trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`

### Expiry date/time/businessCenter -> exerciseTerms.expiration

- Rule id: `fx-derivatives:RULE-004`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields`
- Target CDM paths: `adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration)`
- Action: Expiry-related fields in FpML (date, time, business center) are reshaped into CDM exerciseTerms.expiration components and time fields.
- Rationale: Exercise/expiration in CDM is modeled with nested date/time/business-center pieces; mapping splits and assigns the corresponding FpML pieces into those CDM fields.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `Business center/timezone handling is consistent in examples but may require further rules for edge cases (e.g., missing time or multiple business centers).`
- Validate: `Confirm the FPML source contains: expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields.`, `Confirm the proposed CDM representation populates: adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Payment amounts -> CDM quantities (value + currency unit)

- Rule id: `fx-derivatives:RULE-005`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries)`
- Target CDM paths: `trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units)`
- Action: Each FpML paymentAmount (amount + currency) is converted to a CDM quantity with numeric value and currency unit.
- Rationale: CDM models cash/economic amounts as quantities with explicit units; mapping populates value and currency subfields from FpML paymentAmount.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `When FpML uses splitSettlement or multiple paymentAmount entries some CDM examples aggregate or merge them into a single quantity.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries).`, `Confirm the proposed CDM representation populates: trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`


## Transformations

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

### Date normalization (trim trailing 'Z')

- Rule id: `fx-derivatives:TR-002`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `tradeHeader.tradeDate (FpML, may include 'Z')`
- Target CDM paths: `trade.tradedate.value (CDM, ISO date without 'Z')`
- Action: Remove trailing UTC designator 'Z' from trade/tradedate/time values when copying into CDM date.value.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Examples show consistent trimming of trailing 'Z' to produce plain date strings.`, `No examples show alternative timezone conversion behavior.`
- Validate: `Confirm the FPML source contains: tradeHeader.tradeDate (FpML, may include 'Z').`, `Confirm the proposed CDM representation populates: trade.tradedate.value (CDM, ISO date without 'Z').`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### Expiry date/time/businessCenter -> exerciseTerms.expiration

- Rule id: `fx-derivatives:TR-003`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `expirydatetime.expiryDate and expiryTime and businessCenter (FpML)`
- Target CDM paths: `adjustableDate.adjustedDate.value and exerciseterms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM)`
- Action: Map expiry date, time and business center into CDM exerciseTerms.expiration fields and associated time components.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `High-confidence mapping in examples; business center and time components are preserved in CDM exerciseTerms.`
- Validate: `Confirm the FPML source contains: expirydatetime.expiryDate and expiryTime and businessCenter (FpML).`, `Confirm the proposed CDM representation populates: adjustableDate.adjustedDate.value and exerciseterms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`

### PaymentAmount -> Quantity mapping

- Rule id: `fx-derivatives:TR-004`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `exchangedCurrencyX.paymentAmount.amount and .currency (FpML)`
- Target CDM paths: `trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM)`
- Action: Convert each FpML paymentAmount (amount + currency) into a CDM quantity with value and currency unit.
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `When multiple paymentAmount/splitSettlement entries exist, examples show aggregation/merge into single CDM quantity in some cases.`
- Validate: `Confirm the FPML source contains: exchangedCurrencyX.paymentAmount.amount and .currency (FpML).`, `Confirm the proposed CDM representation populates: trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### ExchangeRate + quoted pair -> Price assembly

- Rule id: `fx-derivatives:TR-005`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `exchangeRate.rate and quotedCurrencyPair.currency1/currency2 (FpML)`
- Target CDM paths: `price.value.value, price.unit.currency.value, price.perUnitOf.currency.value (CDM)`
- Action: Assemble CDM price object from FpML exchangeRate rate and quotedCurrencyPair (unit and perUnitOf currencies).
- Rationale: Apply this normalization transformation when the source-side signal is present.
- Evidence: 3 examples from 25/25 semantic pairs
- Caveats: `Mapping sometimes relies on interpreting quoteBasis or strikeQuoteBasis to decide which currency is the unit versus perUnitOf.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: exchangeRate.rate and quotedCurrencyPair.currency1/currency2 (FpML).`, `Confirm the proposed CDM representation populates: price.value.value, price.unit.currency.value, price.perUnitOf.currency.value (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Split/Multiple settlement entries -> aggregated quantity

- Rule id: `fx-derivatives:TR-006`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `medium`
- Source signals: `splitSettlement / multiple paymentAmount entries (FpML)`
- Target CDM paths: `single trade.tradeLot.quantity or aggregated quantity entries (CDM)`
- Action: When FpML includes splitSettlement entries or multiple payment legs, the mapping sometimes merges these into a single CDM quantity or aggregates tradeLot entries.
- Rationale: Apply this merge transformation when the source-side signal is present.
- Evidence: 2 examples from 25/25 semantic pairs
- Caveats: `Examples show merged results but do not document the aggregation logic for all split cases (e.g., rounding, ordering, or omission of sub-fields).`
- Validate: `Confirm the FPML source contains: splitSettlement / multiple paymentAmount entries (FpML).`, `Confirm the proposed CDM representation populates: single trade.tradeLot.quantity or aggregated quantity entries (CDM).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`, `Confirm date/time normalization is intentional and does not drop required timezone semantics.`, `Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.`

### Normalization repeatedly reshapes trade.tradeheader.tradedate into trade.tradedate.value.

- Rule id: `fx-derivatives:TENT-003`
- Family: `fx-derivatives`
- Kind: `transformation`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Normalization repeatedly reshapes trade.tradeheader.tradedate into trade.tradedate.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative transformation guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 7 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: removed trailing 'Z' from date`, `Representative note: trimmed trailing Z from date`, `Representative note: Stripped trailing 'Z' to produce date '2001-11-12'.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Variants And Branches

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


## Enrichment And Defaults

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

### Metadata-like enrichments repeatedly appear under name.meta.scheme.

- Rule id: `fx-derivatives:TENT-009`
- Family: `fx-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Metadata-like enrichments repeatedly appear under name.meta.scheme.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative enrichment guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: Taxonomy scheme added in CDM not present in FpML.`, `Confidence mix includes high.`, `Representative note: Taxonomy scheme added in CDM, not present in FpML.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

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

### Metadata taxonomy scheme enrichment under name.meta.scheme

- Rule id: `fx-derivatives:ENR-003`
- Family: `fx-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `CDM entries include a taxonomy scheme field under name.meta.scheme even when FpML does not provide an explicit scheme value. CDM product/name representation includes metadata about taxonomy scheme; mapping populates a scheme value (enrichment) to conform to CDM metadata expectations.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM entries include a taxonomy scheme field under name.meta.scheme even when FpML does not provide an explicit scheme value. CDM product/name representation includes metadata about taxonomy scheme; mapping populates a scheme value (enrichment) to conform to CDM metadata expectations.
- Evidence: 3 examples from 25/25 semantic pairs
- Caveats: `The exact scheme value used in CDM is not present in FpML and appears to be added during mapping; scheme choice rationale is not documented in the examples.`, `Do not treat Metadata taxonomy scheme enrichment under name.meta.scheme as a guaranteed direct mapping rule yet.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Product type normalization -> taxonomy name and meta.scheme enrichment

- Rule id: `fx-derivatives:ENR-004`
- Family: `fx-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Normalize productType strings and add taxonomy scheme metadata under name.meta.scheme in CDM.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Normalize productType strings and add taxonomy scheme metadata under name.meta.scheme in CDM.
- Evidence: 3 examples from 25/25 semantic pairs
- Caveats: `Both normalization of the product name and insertion of a taxonomy scheme are observed; the scheme value appears to be an added enrichment rather than copied from FpML.`, `Do not treat Product type normalization -> taxonomy name and meta.scheme enrichment as a reusable direct mapping transformation yet.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Taxonomy scheme metadata added under name.meta.scheme

- Rule id: `fx-derivatives:ENR-005`
- Family: `fx-derivatives`
- Kind: `enrichment`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `CDM includes a taxonomy scheme metadata element under name.meta.scheme even when FpML lacks an explicit scheme.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: CDM includes a taxonomy scheme metadata element under name.meta.scheme even when FpML lacks an explicit scheme.
- Evidence: 3 examples from 25/25 semantic pairs
- Caveats: `Scheme selection rationale is not shown; different mapping implementations might choose different taxonomy scheme values.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Cautions And Tentative Signals

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

### Option-specific terms repeatedly map from trade.fxdigitaloption.producttype into value.name.value.

- Rule id: `fx-derivatives:TENT-004`
- Family: `fx-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Option-specific terms repeatedly map from trade.fxdigitaloption.producttype into value.name.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 5 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes medium.`, `Representative note: Product type maps to CDM taxonomy name.`, `Confidence mix includes high.`, `Representative note: product type normalized to taxonomy name`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Date-like fields repeatedly normalize from expirydatetime.expirytime.businesscenter|expirydatetime.expirytime.hourminutetime|fxdigitaloption.expirydatetime.expirydate into adjustabledate.adjusteddate.value|exerciseterms.expirationtime.hourminutetime|expirationtime.businesscenter.value.

- Rule id: `fx-derivatives:TENT-005`
- Family: `fx-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Date-like fields repeatedly normalize from expirydatetime.expirytime.businesscenter|expirydatetime.expirytime.hourminutetime|fxdigitaloption.expirydatetime.expirydate into adjustabledate.adjusteddate.value|exerciseterms.expirationtime.hourminutetime|expirationtime.businesscenter.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: Expiry date/time and business center map to exerciseTerms expiration.`, `Representative note: expiry date and time normalized into exerciseTerms`, `Representative note: expiry date, time, center map to exercise expiration fields`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Economic terms repeatedly reshape from exchangedcurrency1.paymentamount.amount|exchangedcurrency1.paymentamount.currency|exchangedcurrency2.paymentamount.amount|exchangedcurrency2.paymentamount.currency into quantity.value.value|unit.currency.value.

- Rule id: `fx-derivatives:TENT-006`
- Family: `fx-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Economic terms repeatedly reshape from exchangedcurrency1.paymentamount.amount|exchangedcurrency1.paymentamount.currency|exchangedcurrency2.paymentamount.amount|exchangedcurrency2.paymentamount.currency into quantity.value.value|unit.currency.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: payment amounts to quantities`, `Representative note: Each paymentAmount mapped to a CDM quantity entry`, `Representative note: FpML paymentAmount amounts and currencies -> CDM quantities with currency units`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Economic terms repeatedly reshape from exchangerate.quotedcurrencypair.currency1|exchangerate.quotedcurrencypair.currency2|fxsingleleg.exchangerate.rate into perunitof.currency.value|price.value.value|unit.currency.value.

- Rule id: `fx-derivatives:TENT-007`
- Family: `fx-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `Economic terms repeatedly reshape from exchangerate.quotedcurrencypair.currency1|exchangerate.quotedcurrencypair.currency2|fxsingleleg.exchangerate.rate into perunitof.currency.value|price.value.value|unit.currency.value.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 25/25 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: exchangeRate and quoted pair -> price value and unit/perUnitOf`, `Representative note: FpML exchangeRate rate and currency pair -> CDM price value and perUnitOf currencies`, `Representative note: rate -> price value; quoted currencies -> unit/perUnitOf`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### FpML exchange rate entries and the quoted currency pair are used to create a CDM price object with numeric price and unit/perUnitOf currencies. (exchangeRate.quotedCurrencyPair.currency1|currency2 and fxSingleLeg.exchangeRate.rate (FpML) -> price.value.value and price.unit.currency.value and price.perUnitOf.currency.value (CDM price value, unit and perUnitOf))

- Rule id: `fx-derivatives:TENT-008`
- Family: `fx-derivatives`
- Kind: `caution`
- Operational status: `ready`
- Confidence: `low`
- Source signals: `FpML exchange rate entries and the quoted currency pair are used to create a CDM price object with numeric price and unit/perUnitOf currencies. (exchangeRate.quotedCurrencyPair.currency1|currency2 and fxSingleLeg.exchangeRate.rate (FpML) -> price.value.value and price.unit.currency.value and price.perUnitOf.currency.value (CDM price value, unit and perUnitOf))`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 3 examples from 25/25 semantic pairs
- Caveats: `CDM separates price value and the two currencies involved (unit and perUnitOf); mapping derives these from the FpML rate and quotedCurrencyPair.`, `Mapping sometimes requires interpreting quoteBasis/strikeQuoteBasis to decide which currency is unit vs perUnitOf; examples show consistent but slightly different interpretations.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`, `The supporting evidence is caveated, inconsistent, or explicitly incomplete.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`


## Do Not Assume

- Do not treat Generated/default party identifiers appear under partyid.identifier.value as a guaranteed direct mapping rule yet.
- Do not treat Party LEI or generated identifiers inserted as a guaranteed direct mapping rule yet.
- Do not treat Metadata taxonomy scheme enrichment under name.meta.scheme as a guaranteed direct mapping rule yet.
- Do not treat Product type normalization -> taxonomy name and meta.scheme enrichment as a guaranteed direct mapping rule yet.
- Do not treat Taxonomy scheme metadata added under name.meta.scheme as a guaranteed direct mapping rule yet.
- Source of party LEI values missing in FpML
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.
- Do not apply this tentative pattern without matching source evidence.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not treat as stable: Derivation of CDM party role labels (Party1/Party2) from FpML party hrefs - examples show inconsistent inversions.
- Do not treat as stable: Source and reliability of party LEI or generated identifiers included in CDM (likely enrichment).
- Do not treat as stable: Rules that create additional or duplicate tradeIdentifier entries in CDM.
- Do not treat as stable: Precise aggregation rules used when merging splitSettlement/multiple paymentAmount entries into one CDM quantity.
- Do not assume enrichment/default behavior for Generated/default party identifiers appear under partyid.identifier.value without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Party LEI or generated identifiers inserted without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Metadata taxonomy scheme enrichment under name.meta.scheme without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Product type normalization -> taxonomy name and meta.scheme enrichment without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Taxonomy scheme metadata added under name.meta.scheme without source evidence or analyst approval.

## Human Review Triggers

- What is the authoritative source for the LEI / generated party identifiers present in CDM when absent from FpML?
- Why do buyer/seller (payer/receiver) roles appear inverted between FpML hrefs and CDM Party1/Party2 in multiple examples?
- How are CDM Party1/Party2 labels derived deterministically from FpML party references (what rule maps party hrefs to Party1 vs Party2)?
- Why are some tradeIdentifier entries duplicated or augmented in CDM for a single FpML tradeId?
- What logic determines when multiple FpML splitSettlement/paymentAmount entries are merged into a single CDM quantity versus preserved separately?
- How is assignedIdentifier.scheme chosen or normalized when it differs from the FpML tradeId scheme?
- Which fxSingleLeg exchangedCurrency (or leg) in FpML maps to SettlementPayout.payerReceiver in CDM when mapping payouts?
- The supporting evidence is caveated, inconsistent, or explicitly incomplete.
- Party role or payment direction affects economic meaning.
- The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.
- This pattern is tentative and needs analyst confirmation before it is treated as stable.
- The CDM proposal contains enrichment or default behavior not directly copied from FpML.

## Validation Checklist

- Check unresolved question: What is the authoritative source for the LEI / generated party identifiers present in CDM when absent from FpML?
- Check unresolved question: Why do buyer/seller (payer/receiver) roles appear inverted between FpML hrefs and CDM Party1/Party2 in multiple examples?
- Check unresolved question: How are CDM Party1/Party2 labels derived deterministically from FpML party references (what rule maps party hrefs to Party1 vs Party2)?
- Check unresolved question: Why are some tradeIdentifier entries duplicated or augmented in CDM for a single FpML tradeId?
- Check unresolved question: What logic determines when multiple FpML splitSettlement/paymentAmount entries are merged into a single CDM quantity versus preserved separately?
- Check unresolved question: How is assignedIdentifier.scheme chosen or normalized when it differs from the FpML tradeId scheme?
- Confirm the FPML source contains: tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements).
- Confirm the proposed CDM representation populates: trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value).
- Confirm the value is copied, normalized, transformed, or enriched according to the rule action.
- Confirm Party1/Party2 and payer/receiver direction against the FPML trade context.
- Confirm the FPML source contains: trade.tradeHeader.tradeDate (FpML with timezone 'Z').
- Confirm the proposed CDM representation populates: trade.tradeDate.value (CDM normalized ISO date without trailing 'Z').
- Confirm date/time normalization is intentional and does not drop required timezone semantics.
- Confirm the FPML source contains: trade.fxdigitaloption.productType (FpML productType strings).
- Confirm the proposed CDM representation populates: trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name).
- Confirm the FPML source contains: expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields.
- Confirm the proposed CDM representation populates: adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration).
- Confirm the FPML source contains: exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries).
- Confirm the proposed CDM representation populates: trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units).
- Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.
- Confirm the FPML source contains: partyReference hrefs and buyer/seller/payer/receiver references (FpML).
- Confirm the proposed CDM representation populates: CDM party references with party roles (e.g., Party1/Party2) used in buyerSeller and payout sections.
- Confirm the FPML source contains: tradeHeader.tradeDate (FpML, may include 'Z').
- Confirm the proposed CDM representation populates: trade.tradedate.value (CDM, ISO date without 'Z').
- Confirm the FPML source contains: expirydatetime.expiryDate and expiryTime and businessCenter (FpML).
- Confirm the proposed CDM representation populates: adjustableDate.adjustedDate.value and exerciseterms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM).
- Confirm the FPML source contains: exchangedCurrencyX.paymentAmount.amount and .currency (FpML).
- Confirm the proposed CDM representation populates: trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM).
- Confirm the FPML source contains: exchangeRate.rate and quotedCurrencyPair.currency1/currency2 (FpML).
- Confirm the proposed CDM representation populates: price.value.value, price.unit.currency.value, price.perUnitOf.currency.value (CDM).
- Confirm the FPML source contains: splitSettlement / multiple paymentAmount entries (FpML).
- Confirm the proposed CDM representation populates: single trade.tradeLot.quantity or aggregated quantity entries (CDM).
- Confirm the source document contains an exact signal matching this tentative pattern.
- Mark the mapped field as requiring analyst review.
- Confirm the source product subtype matches this variant before applying variant-specific mapping rules.
- Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.

## Worked Examples

### fx-derivatives/fx-ex01-fx-spot.xml -> fx-derivatives/fx-ex01-fx-spot.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - exchange rate copied
  - payment amounts to quantities
  - tradeIds copied
  - strip trailing 'Z' from dates
- Validation:
  - Review uncertainty: Source of party LEI values missing in FpML
  - Review uncertainty: Payer/receiver roles appear inverted between FpML and CDM

### fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml -> fx-derivatives/fx-ex02-spot-cross-w-side-rates.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - tradeId mapped to CDM assignedIdentifier.value
  - exchangedCurrency1 amount and currency -> quantity[0]
  - exchangeRate and quoted pair -> price value and unit/perUnitOf
  - hrefs resolved to CDM payer/receiver via counterparty references
- Validation:
  - Review uncertainty: Why does CDM 'Party1' reference FpML 'party2'?
  - Review uncertainty: Are CDM LEI identifiers sourced externally?

### fx-derivatives/fx-ex03-fx-fwd.xml -> fx-derivatives/fx-ex03-fx-fwd.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - FpML tradeId -> CDM assignedIdentifier
  - payment amounts -> CDM quantities
  - rate -> price; spotRate+forwardPoints -> composite
  - removed trailing 'Z' from date
- Validation:
  - Review uncertainty: Why are payer/receiver roles in CDM reversed relative to FpML hrefs?
  - Review uncertainty: Why are some tradeIdentifier entries duplicated in CDM for same tradeId?

## Source Evidence

- Evidence sidecar: `../references/fx-derivatives.evidence.json`
