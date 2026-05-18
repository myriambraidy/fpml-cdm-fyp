# Promoted Cross-Family Rules

- None promoted. Do not generalize across families unless explicitly promoted here. [See Do Not Assume]

# Family-Specific Evidence

## commodity-derivatives

- Rule id: commodity-derivatives:RULE-003 (mapping; operational status: ready)
  - When this applies:
    - Source contains fixedleg.fixedprice.price | fixedleg.fixedprice.pricecurrency | fixedleg.fixedprice.priceunit.
  - Inspect these FpML source signals:
    - fixedleg.fixedprice.price
    - fixedleg.fixedprice.pricecurrency
    - fixedleg.fixedprice.priceunit
  - Propose this CDM target structure:
    - price.value.value | unit.currency.value | value.perunitof.capacityunit
  - How to validate:
    - Confirm the above source signals are present.
    - Confirm CDM fields are populated as specified and amount, currency, unit, sign, and scale are preserved.
  - Do not apply when:
    - Any of the required source signals are missing.
  - Exceptions / analyst-review triggers:
    - Unit normalization (e.g., Gal -> USGAL) is required; some unit mappings may be uncertain or context-dependent and require review.

- Rule id: commodity-derivatives:TR-001 (transformation; operational status: ready)
  - When this applies:
    - Source contains fixedleg.fixedprice.price + fixedleg.fixedprice.pricecurrency + fixedleg.fixedprice.priceunit.
  - Inspect these FpML source signals:
    - fixedleg.fixedprice.price
    - fixedleg.fixedprice.pricecurrency
    - fixedleg.fixedprice.priceunit
  - Propose this CDM target structure:
    - price.value.value + unit.currency.value + value.perunitof.capacityunit
  - How to validate:
    - Confirm the above source signals are present and CDM fields are populated as specified.
    - Ensure amount, currency, unit, sign, and scale are preserved; confirm unit codes are normalized to CDM canonical unit codes.
  - Do not apply when:
    - Any of the required source signals are missing.
  - Exceptions / analyst-review triggers:
    - Source unit codes requiring normalization not covered by known canonical mappings should be flagged for review.

- Rule id: commodity-derivatives:TR-002 (transformation; operational status: ready)
  - When this applies:
    - Source contains calculation.spread.amount | calculation.spread.currency.
  - Inspect these FpML source signals:
    - calculation.spread.amount
    - calculation.spread.currency
  - Propose this CDM target structure:
    - price.value.value | unit.currency.value
  - How to validate:
    - Confirm the above source signals are present and CDM fields are populated as specified; preserve amount, currency, sign, and scale.
  - Do not apply when:
    - Either spread amount or currency is missing.
  - Exceptions / analyst-review triggers:
    - Spreads expressed relative to indexes/references may require additional resolution beyond this normalization; flag for analyst review.

- Rule id: commodity-derivatives:VAR-002 (variant; operational status: ready)
  - When this applies:
    - Unit normalization for price/volume fields is needed and source units may not match CDM canonical codes.
  - Inspect these FpML source signals:
    - Any price or volume unit code values (e.g., Gal, MMBTU, Therm).
  - Propose this action:
    - Normalize source unit codes to CDM canonical codes where explicit mapping rules exist.
  - How to validate:
    - Confirm product subtype matches this variant before applying.
  - Do not apply when:
    - Canonical unit mappings are not known for the given source unit.
  - Exceptions / analyst-review triggers:
    - Units with uncertain mappings (e.g., MMBTU -> USMMBTU, Therm -> USTHM) require explicit rules or analyst confirmation.

- Rule id: commodity-derivatives:TENT-005 (caution; operational status: ready, confidence: low)
  - When this applies:
    - Source exactly matches the tentative pattern: fixedleg.fixedprice.price | fixedleg.fixedprice.pricecurrency | fixedleg.fixedprice.priceunit.
  - Propose this guidance:
    - Tentative mapping to price.value.value | unit.currency.value | value.perunitof.capacityunit; mark for analyst review.
  - Validation and review:
    - Confirm exact source match; mark mapped fields as requiring analyst review.

- Rule id: commodity-derivatives:TENT-008 (caution; operational status: ready, confidence: low)
  - When this applies:
    - Source exactly matches the tentative pattern: calculation.spread.amount | calculation.spread.currency.
  - Propose this guidance:
    - Tentative reshape to price.value.value | unit.currency.value; mark for analyst review.
  - Validation and review:
    - Confirm exact source match; mark mapped fields as requiring analyst review.

## fx-derivatives

- Rule id: fx-derivatives:RULE-005 (mapping; operational status: ready)
  - When this applies:
    - Source contains exchangedCurrencyX.paymentAmount.amount and exchangedCurrencyX.paymentAmount.currency.
  - Inspect these FpML source signals:
    - exchangedCurrencyX.paymentAmount.amount
    - exchangedCurrencyX.paymentAmount.currency
  - Propose this CDM target structure:
    - trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value
  - How to validate:
    - Confirm source fields exist and CDM value + currency unit are populated; preserve amount, currency, sign, and scale.
  - Do not apply when:
    - paymentAmount amount or currency is missing.
  - Exceptions / analyst-review triggers:
    - When splitSettlement or multiple paymentAmount entries exist, some examples aggregate/merge them; treat aggregation as implementation-specific and flag for review if applied.

- Rule id: fx-derivatives:TR-004 (transformation; operational status: ready)
  - When this applies:
    - Source contains exchangedCurrencyX.paymentAmount.amount and .currency.
  - Inspect these FpML source signals:
    - exchangedCurrencyX.paymentAmount.amount
    - exchangedCurrencyX.paymentAmount.currency
  - Propose this CDM target structure:
    - trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value
  - How to validate:
    - Confirm source fields exist and CDM value + currency unit are populated; preserve amount, currency, sign, and scale.
  - Do not apply when:
    - paymentAmount amount or currency is missing.
  - Exceptions / analyst-review triggers:
    - If multiple paymentAmount/splitSettlement entries are aggregated into a single CDM quantity, mark for analyst review.

- Rule id: fx-derivatives:TR-005 (transformation; operational status: ready)
  - When this applies:
    - Source contains exchangeRate.rate and quotedCurrencyPair.currency1/currency2.
  - Inspect these FpML source signals:
    - exchangeRate.rate
    - quotedCurrencyPair.currency1
    - quotedCurrencyPair.currency2
  - Propose this CDM target structure:
    - price.value.value, price.unit.currency.value, price.perUnitOf.currency.value
  - How to validate:
    - Confirm source fields exist and CDM price value and the unit/perUnitOf currencies are populated; preserve sign and scale.
  - Do not apply when:
    - exchangeRate.rate or quotedCurrencyPair currencies are missing.
  - Exceptions / analyst-review triggers:
    - Interpreting quoteBasis/strikeQuoteBasis may be required to assign unit vs perUnitOf; mark for analyst review when interpretation is needed.

- Rule id: fx-derivatives:TENT-006 (caution; operational status: ready, confidence: low)
  - When this applies:
    - Source exactly matches the pattern: exchangedcurrency1.paymentamount.amount|currency and exchangedcurrency2.paymentamount.amount|currency.
  - Propose this guidance:
    - Tentative reshape into quantity.value.value | unit.currency.value; mark for analyst review.
  - Validation and review:
    - Confirm exact source match; mark mapped fields as requiring analyst review.

- Rule id: fx-derivatives:TENT-007 (caution; operational status: ready, confidence: low)
  - When this applies:
    - Source exactly matches the pattern: exchangerate.quotedcurrencypair.currency1|currency2 and fxsingleleg.exchangerate.rate.
  - Propose this guidance:
    - Tentative reshape into perunitof.currency.value | price.value.value | unit.currency.value; mark for analyst review.
  - Validation and review:
    - Confirm exact source match; mark mapped fields as requiring analyst review.

- Rule id: fx-derivatives:TENT-008 (caution; operational status: ready, confidence: low)
  - When this applies:
    - Source exactly matches the pattern: exchangeRate.quotedCurrencyPair.currency1|currency2 and fxSingleLeg.exchangeRate.rate.
  - Propose this guidance:
    - Tentative assembly into price.value.value and price.unit.currency.value and price.perUnitOf.currency.value; mark for analyst review.
  - Validation and review:
    - Confirm exact source match; mark mapped fields as requiring analyst review, especially when quoteBasis/strikeQuoteBasis affects orientation.

## correlation-swaps

- Rule id: correlation-swaps:TR-003 (transformation; operational status: pilot_only)
  - When this applies:
    - Source contains notional amount and currency fields.
  - Inspect these FpML source signals:
    - notional amount
    - notional currency
  - Propose this CDM target structure:
    - tradeLot.quantity (quantity value + currency)
  - How to validate:
    - Confirm source signals exist and CDM tradeLot.quantity value and currency are populated; preserve amount, currency, sign, and scale.
  - Do not apply when:
    - Notional amount or currency is missing.
  - Exceptions / analyst-review triggers:
    - This is pilot_only; priceQuantity.address usage remains an open question in some files; require analyst review.

- Rule id: correlation-swaps:ENR-003 (enrichment; operational status: pilot_only)
  - Guidance:
    - priceQuantity.address value 'quantity-1' is suspected enrichment; do not generate unless explicitly present in source or approved as a default; mark any such usage for analyst review.

## inflation-swaps

- Rule id: inflation-swaps:ENR-002 (enrichment; operational status: pilot_only)
  - Guidance:
    - Suspected scaling from FpML input values to CDM quantities is not confirmed; do not apply automatic scaling; require analyst confirmation before any scaling.

- Rule id: inflation-swaps:ENR-001 (enrichment; operational status: pilot_only)
  - Guidance:
    - Index source, mainPublication, interpolationMethod appear in inputs but targets are unclear; do not generate enriched CDM values unless source evidence or an approved default supports them; escalate for domain guidance.

# Do Not Assume

- Do not generalize a family-specific rule unless this global document says it is promoted.
- Do not generate enrichments/defaults (e.g., taxonomy scheme metadata, priceQuantity.address values, quantity scaling) unless present in FpML or explicitly approved as defaults.
- Do not apply unit canonicalization for ambiguous units without explicit mapping rules; escalate uncertain unit mappings for review.
- Do not infer spread linkages to indexes/references beyond converting amount+currency to CDM price structure without analyst confirmation.
- Do not aggregate or merge multiple paymentAmount entries into a single CDM quantity unless the implementation’s approved rule set specifies this; if done, mark for review.

# Validation Checklist

- Verify the source signals exactly match the cited rule before applying it.
- For each mapping, cite the family-specific cookbook rule id used.
- Confirm the proposed CDM representation populates the specified target paths.
- Preserve amount, currency, unit, sign, and scale in every transformation.
- Confirm unit codes are normalized to CDM canonical codes where required; escalate uncertain mappings.
- Mark outputs as requiring analyst review when a rule is tentative, variant-driven, pilot_only, or when caveats indicate additional resolution is needed.
- Do not emit enriched/defaulted values unless directly present in source or covered by an approved default and identified enrichment rule.