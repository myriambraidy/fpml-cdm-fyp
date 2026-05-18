# Global FPML -> CDM Quantity And Unit Normalization

Use these rules when mapping amounts, notionals, prices, currencies, and units.

## Promoted Cross-Family Rules

No rules have enough cross-family evidence for promotion yet.

## Family-Specific Evidence

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

### reference entity name copied (direct mapping; referenceinformation.referenceentity.entityname -> referenceentity.name.value)

- Rule id: `credit-derivatives:TENT-010`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `reference entity name copied (direct mapping; referenceinformation.referenceentity.entityname -> referenceentity.name.value)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 40/40 semantic pairs
- Caveats: `Confidence mix includes high.`, `Representative note: reference entity name copied`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

### Reference entity names are copied verbatim from FpML referenceInformation into the CDM referenceEntity.name.value field. (referenceInformation.referenceEntity.entityName -> referenceEntity.name.value)

- Rule id: `credit-derivatives:TENT-011`
- Family: `credit-derivatives`
- Kind: `caution`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Reference entity names are copied verbatim from FpML referenceInformation into the CDM referenceEntity.name.value field. (referenceInformation.referenceEntity.entityName -> referenceEntity.name.value)`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as tentative mapping guidance; apply only when the source evidence exactly matches.
- Rationale: Recovered as a moderate recurring pattern from draft synthesis, but not promoted to a stable rule.
- Evidence: 4 examples from 40/40 semantic pairs
- Caveats: `Reference entity name is a direct, human-readable attribute used in both representations and is mapped directly to retain the entity label.`, `In some examples an identifier (scheme/id) is also provided alongside the name; consumers should check both name and id when present.`
- Human review when: `This pattern is tentative and needs analyst confirmation before it is treated as stable.`
- Validate: `Confirm the source document contains an exact signal matching this tentative pattern.`, `Mark the mapped field as requiring analyst review.`

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

### Unmapped interpolation/publication metadata

- Rule id: `inflation-swaps:ENR-001`
- Family: `inflation-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Index source, mainPublication and interpolationMethod fields in FpML are present in inputs but their CDM targets are unclear or not represented in examples.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as unclear; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Index source, mainPublication and interpolationMethod fields in FpML are present in inputs but their CDM targets are unclear or not represented in examples.
- Evidence: 3 examples from 5/5 semantic pairs
- Caveats: `Do not assume these fields are omitted intentionally; seek domain guidance on where such metadata should go in CDM (if at all).`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`

### Quantity scaling hypothesis

- Rule id: `inflation-swaps:ENR-002`
- Family: `inflation-swaps`
- Kind: `enrichment`
- Operational status: `pilot_only`
- Confidence: `low`
- Source signals: `Observed CDM quantity values (e.g., 1000000) may be derived by scaling FpML input values (example mentions initialValue 1). The transformation is not explicitly shown but is suspected.`
- Target CDM paths: none recovered; treat as branch, caution, or review guidance.
- Action: Treat as suspected enrichment; do not generate enriched CDM values unless source evidence or an approved default supports them.
- Rationale: Observed CDM quantity values (e.g., 1000000) may be derived by scaling FpML input values (example mentions initialValue 1). The transformation is not explicitly shown but is suspected.
- Evidence: 1 examples from 5/5 semantic pairs
- Caveats: `Scaling logic is not demonstrated across multiple examples - treat as tentative and verify with canonical rules or source system metadata before applying.`, `Do not apply automatic scaling unless mapping rule is confirmed.`
- Human review when: `The CDM proposal contains enrichment or default behavior not directly copied from FpML.`
- Validate: `Confirm each enriched/defaulted CDM value is either present in source evidence or explicitly approved as a default.`


## Do Not Assume

- Do not generalize a family-specific rule unless this global document says it is promoted.

## Validation Checklist

- Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.
- If the source signal does not match the rule, do not apply the rule.
