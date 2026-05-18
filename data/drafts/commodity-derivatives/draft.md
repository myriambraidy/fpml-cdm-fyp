# Agent Mapping Playbook: commodity-derivatives

## 1. Scope

- Folder: `commodity-derivatives`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-23`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `23`
- Matched pairs selected: `23`
- Structural evidence basis: `23/23` matched pairs
- Semantic evidence basis: `23/23` pair analyses
- Full semantic analyses: `23`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `0`
- Missing counterparts: `0`
- Ignored pairs: `0`
- Exact matches: `14`
- Normalized matches: `9`
- Alias matches: `0`
- Structural basis note: Structural summaries are computed from all 23/23 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 23/23 successful or salvaged pair analyses (23 full, 0 salvaged).

## 3. Included Examples

- `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.xml` -> `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.json` (`normalized`)
- `commodity-derivatives/com-ex10-physical-oil-pipeline-crude-wti-floating-price.xml` -> `commodity-derivatives/com-ex10-physical-oil-pipeline-crude-wti-floating-price.json` (`exact`)
- `commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.xml` -> `commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.json` (`exact`)
- `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.xml` -> `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.json` (`exact`)
- `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml` -> `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.json` (`exact`)
- `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml` -> `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.json` (`exact`)
- `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml` -> `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.json` (`exact`)
- `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml` -> `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.json` (`exact`)
- `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml` -> `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.json` (`exact`)
- `commodity-derivatives/com-ex18-physical-power-us-eei-fixed-price-shaped-volume.xml` -> `commodity-derivatives/com-ex18-physical-power-us-eei-fixed-price-shaped-volume.json` (`exact`)
- `commodity-derivatives/com-ex19-physical-bullion-forward.xml` -> `commodity-derivatives/com-ex19-physical-bullion-forward.json` (`exact`)
- `commodity-derivatives/com-ex2-gas-swap-prices-first-day.xml` -> `commodity-derivatives/com-ex2-gas-swap-prices-first-day.json` (`normalized`)
- `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.xml` -> `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.json` (`exact`)
- `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.xml` -> `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.json` (`exact`)
- `commodity-derivatives/com-ex22-physical-gas-option-multiple-expiration.xml` -> `commodity-derivatives/com-ex22-physical-gas-option-multiple-expiration.json` (`exact`)
- `commodity-derivatives/com-ex23-physical-power-option-daily-expiration-efet.xml` -> `commodity-derivatives/com-ex23-physical-power-option-daily-expiration-efet.json` (`exact`)
- `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.xml` -> `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.json` (`normalized`)
- `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml` -> `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.json` (`normalized`)
- `commodity-derivatives/com-ex5-gas-v-electricity-spark-spread.xml` -> `commodity-derivatives/com-ex5-gas-v-electricity-spark-spread.json` (`normalized`)
- `commodity-derivatives/com-ex6-gas-call-option.xml` -> `commodity-derivatives/com-ex6-gas-call-option.json` (`normalized`)
- `commodity-derivatives/com-ex7-gas-put-option.xml` -> `commodity-derivatives/com-ex7-gas-put-option.json` (`normalized`)
- `commodity-derivatives/com-ex8-oil-call-option-strip.xml` -> `commodity-derivatives/com-ex8-oil-call-option-strip.json` (`normalized`)
- `commodity-derivatives/com-ex9-oil-put-option-american.xml` -> `commodity-derivatives/com-ex9-oil-put-option-american.json` (`normalized`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- None observed.

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/trade/tradeHeader/partyTradeIdentifier
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/tradeId
- /FpML/trade/tradeHeader/tradeDate

### 5.2 Repeated top-level sections

- `party` appears in `23/23` examples
- `trade` appears in `23/23` examples

### 5.3 Repeated nested structures

- trade > commoditySwap (47 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- party > partyName (2 paths)
- trade > documentation (2 paths)
- trade > commoditySwap (29 paths)
- trade > commoditySwap (26 paths)
- trade > commoditySwap (28 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `23/23` examples
- `trade` appears in `23/23` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (68 paths)
- trade > tradeLot (60 paths)
- trade > tradeIdentifier (21 paths)
- trade > contractDetails (19 paths)
- trade > party (17 paths)
- trade > counterparty (7 paths)
- trade > tradeDate (2 paths)
- meta > globalKey (1 paths)

### 5.7 Optional but common CDM sections

- `transferHistory` appears in `6/23` examples

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule RULE-001: Effective date unadjustedDate copied

- Strength: `moderate recurring pattern`
- Evidence count: `7` examples
- Source pattern: `effectivedate.adjustabledate.unadjusteddate`
- Target pattern: `effectivedate.adjustabledate.unadjusteddate`
- Explanation: Effective (unadjusted) dates in FpML are repeatedly carried into the CDM effectiveDate.adjustableDate.unadjustedDate element without semantic transformation.
- Why it seems to work this way: Multiple example trades show identical unadjusted date values preserved in CDM effective date fields, indicating a direct copy rule.
- Example files:
  - `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.xml`
  - `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml`
  - `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.xml`
  - `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.xml`
  - `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml`
- Caveats:
  - This addresses the unadjustedDate element specifically; businessDayConvention and adjustment rules may also appear separately in examples.

### Rule RULE-002: Termination date unadjustedDate copied

- Strength: `moderate recurring pattern`
- Evidence count: `7` examples
- Source pattern: `terminationdate.adjustabledate.unadjusteddate`
- Target pattern: `terminationdate.adjustabledate.unadjusteddate`
- Explanation: Termination (unadjusted) dates in FpML are repeatedly carried into the CDM terminationDate.adjustableDate.unadjustedDate element without semantic transformation.
- Why it seems to work this way: Representative examples consistently preserve the FpML termination unadjusted date in the CDM termination date field, indicating a direct mapping.
- Example files:
  - `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.xml`
  - `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml`
  - `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.xml`
  - `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.xml`
  - `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml`
- Caveats:
  - This is specific to unadjustedDate copying; other termination-related metadata (conventions/adjustments) may require additional mapping rules.

### Rule RULE-003: Fixed price elements normalized into CDM price structure

- Strength: `moderate recurring pattern`
- Evidence count: `4` examples
- Source pattern: `fixedleg.fixedprice.price | fixedleg.fixedprice.pricecurrency | fixedleg.fixedprice.priceunit`
- Target pattern: `price.value.value | unit.currency.value | value.perunitof.capacityunit`
- Explanation: FpML fixed price, currency and unit elements are repeatedly reshaped into the CDM price object with nested value, currency and per-unit unit normalization.
- Why it seems to work this way: Multiple fixed-price physical trades show the same normalization pattern: numeric price -> price.value.value, currency -> unit.currency.value, and unit normalized into per-unit capacityUnit.
- Example files:
  - `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.xml`
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.xml`
  - `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml`
- Caveats:
  - Unit normalization mapping (e.g., Gal -> USGAL) is applied in examples; some unit mappings are uncertain or context-dependent.

### Rule RULE-004: Option type mapping to payout.optionpayout.optiontype

- Strength: `moderate recurring pattern`
- Evidence count: `4` examples
- Source pattern: `trade.commodityoption.optiontype`
- Target pattern: `payout.optionpayout.optiontype`
- Explanation: Commodity option trades map the FpML option type into the CDM payout.optionPayout.optionType element (e.g., Call/Put -> OptionType).
- Why it seems to work this way: All representative option examples show direct mapping of the option type from the FpML option section into the CDM payout structure.
- Example files:
  - `commodity-derivatives/com-ex6-gas-call-option.xml`
  - `commodity-derivatives/com-ex7-gas-put-option.xml`
  - `commodity-derivatives/com-ex8-oil-call-option-strip.xml`
  - `commodity-derivatives/com-ex9-oil-put-option-american.xml`
- Caveats:
  - This covers option-type value mapping only; other option-specific fields (exercise style, expiries) may need separate handling.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Price fields reshaped and unit normalized

- Type: `normalization`
- Description: Fixed-price fields (price, currency, unit) are reshaped into the CDM price structure and units normalized to CDM canonical unit codes.
- Source side: `fixedleg.fixedprice.price + fixedleg.fixedprice.pricecurrency + fixedleg.fixedprice.priceunit`
- Target side: `price.value.value + unit.currency.value + value.perunitof.capacityunit`
- Evidence count: `4`
- Example files:
  - `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.xml`
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.xml`
  - `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml`
- Notes:
  - Example mappings include explicit unit normalization (e.g., Gal -> USGAL).
  - Mapping assumes a canonical CDM unit vocabulary; some source units require normalization rules.

### Transformation TR-002: Spread amount+currency converted to CDM price structure

- Type: `normalization`
- Description: Calculation spread amounts with currency are repeatedly converted into the CDM price.value and unit.currency representation.
- Source side: `calculation.spread.amount | calculation.spread.currency`
- Target side: `price.value.value | unit.currency.value`
- Evidence count: `3`
- Example files:
  - `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex5-gas-v-electricity-spark-spread.xml`
- Notes:
  - This converts 'spread' style pricing into the canonical CDM price representation used elsewhere in the folder.
  - Some spreads are expressed relative to indexes or references and may require additional resolution outside this normalization.

### 6.3 Tentative and emerging signals

### TENT-001: mapping

- Strength: `moderate recurring pattern`
- Description: Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.
- Evidence count: `7`
- Example files:
  - `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.xml`
  - `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml`
  - `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.xml`
  - `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.xml`
  - `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: effective date copied
  - Representative note: effective date value copied

### TENT-002: enrichment

- Strength: `moderate recurring pattern`
- Description: Generated identifiers or defaults repeatedly appear under dateadjustments.meta.globalkey.
- Evidence count: `7`
- Example files:
  - `commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.xml`
  - `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml`
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml`
  - `commodity-derivatives/com-ex2-gas-swap-prices-first-day.xml`
  - `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: meta.globalKey added in CDM
  - Representative note: meta.globalKey added in CDM, no FpML source
  - Representative note: meta.globalKey entries generated

### TENT-003: mapping

- Strength: `moderate recurring pattern`
- Description: termination date copied (direct mapping; terminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate)
- Evidence count: `7`
- Example files:
  - `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.xml`
  - `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml`
  - `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.xml`
  - `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.xml`
  - `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: termination date copied

### TENT-004: enrichment

- Strength: `moderate recurring pattern`
- Description: Generated identifiers or defaults repeatedly appear under partyid.identifier.value.
- Evidence count: `6`
- Example files:
  - `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.xml`
  - `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml`
  - `commodity-derivatives/com-ex18-physical-power-us-eei-fixed-price-shaped-volume.xml`
  - `commodity-derivatives/com-ex19-physical-bullion-forward.xml`
  - `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.xml`
  - `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: LEI values inserted in CDM parties
  - Confidence mix includes high.
  - Representative note: LEI identifiers present only in CDM

### TENT-005: mapping

- Strength: `moderate recurring pattern`
- Description: Economic terms repeatedly reshape from fixedleg.fixedprice.price|fixedleg.fixedprice.pricecurrency|fixedleg.fixedprice.priceunit into price.value.value|unit.currency.value|value.perunitof.capacityunit.
- Evidence count: `4`
- Example files:
  - `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.xml`
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.xml`
  - `commodity-derivatives/com-ex4-electricity-swap-hourly-off-peak.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: price,currency,unit normalized into CDM price structure
  - Representative note: price, currency and unit mapped; unit normalized
  - Representative note: fixed price, currency and unit mapped

### TENT-006: mapping

- Strength: `moderate recurring pattern`
- Description: effectiveDate unadjustedDate (direct mapping; effectivedate.adjustabledate.unadjusteddate -> effectivedate.adjustabledate.unadjusteddate)
- Evidence count: `4`
- Example files:
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex2-gas-swap-prices-first-day.xml`
  - `commodity-derivatives/com-ex22-physical-gas-option-multiple-expiration.xml`
  - `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: effectiveDate unadjustedDate

### TENT-007: mapping

- Strength: `moderate recurring pattern`
- Description: Option-specific terms repeatedly map from trade.commodityoption.optiontype into payout.optionpayout.optiontype.
- Evidence count: `4`
- Example files:
  - `commodity-derivatives/com-ex6-gas-call-option.xml`
  - `commodity-derivatives/com-ex7-gas-put-option.xml`
  - `commodity-derivatives/com-ex8-oil-call-option-strip.xml`
  - `commodity-derivatives/com-ex9-oil-put-option-american.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: option type
  - Representative note: Option type 'Put' mapped
  - Representative note: Option type 'Call' mapped

### TENT-008: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes calculation.spread.amount|calculation.spread.currency into price.value.value|unit.currency.value.
- Evidence count: `3`
- Example files:
  - `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex5-gas-v-electricity-spark-spread.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: spread amount+currency converted to price value and unit currency
  - Confidence mix includes high.
  - Representative note: spread converted to price structure

### 6.4 Folder-level principles

- Unadjusted effective and termination dates from FpML are reliably preserved in CDM adjustableDate.unadjustedDate fields.
- Fixed price, currency and unit in FpML are normalized into a CDM price object (value, currency, per-unit) with unit canonicalization applied.
- Spread-based calculations are normalized into the same CDM price structure used for fixed prices (spread amount+currency -> price.value / unit.currency).
- Option trades map the FpML optionType into the CDM payout.optionPayout.optionType consistently (Call/Put preserved).
- CDM often contains generated metadata (meta.globalKey) and party identifiers (LEI) that are not present in the FpML source; treat these as enrichments produced during CDM creation.
- Representative mappings and examples normalize party href references into consistent party roles (e.g., Party1/Party2) when populating CDM parties.

### 6.5 Variants and exceptions

### Variant VAR-001: Duplicate tradeIdentifier entries in CDM

- Description: Several CDM examples show duplicate tradeIdentifier entries (same assignedIdentifier or tradeId repeated). This is observed across multiple examples and is a deviation from a one-to-one identifier expectation.
- Seen in:
  - `commodity-derivatives/com-ex10-physical-oil-pipeline-crude-wti-floating-price.xml`
  - `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml`
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex18-physical-power-us-eei-fixed-price-shaped-volume.xml`
- Impact on generalization: Post-processing or de-duplication logic may be required when consolidating CDM trade identifiers; treat duplicate entries as a special case requiring review.

### Variant VAR-002: Unit code normalization exceptions

- Description: Source unit codes are normalized to CDM canonical codes in examples (e.g., 'Gal' -> 'USGAL'). Other units appear with uncertain mappings (MMBTU -> USMMBTU, Therm -> USTHM) and may require specific rules.
- Seen in:
  - `commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.xml`
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex2-gas-swap-prices-first-day.xml`
- Impact on generalization: Unit normalization is necessary for price and volume fields. Some source units require explicit mapping rules; absent those rules, canonicalization may be inconsistent across trades.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: meta.globalKey entries generated

- Description: CDM files repeatedly contain meta.globalKey entries (generated identifiers/defaults) under dateAdjustments.meta.globalKey that are not sourced from FpML.
- Classification: `suspected enrichment`
- Evidence:
  - `commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.xml`
  - `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml`
  - `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml`
  - `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml`
  - `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml`
  - `commodity-derivatives/com-ex2-gas-swap-prices-first-day.xml`
  - `commodity-derivatives/com-ex20-physical-coal-us-fixed-price.xml`
- Caution:
  - meta.globalKey entries appear to be generated by CDM tooling; they should not be treated as authoritative mappings from FpML content.
  - Downstream consumers relying on meta.globalKey should be aware these values may not exist in the source FpML.

### Enrichment ENR-002: Party identifiers (LEI) added in CDM

- Description: CDM party.partyId.identifier.value fields often contain LEI or generated identifier values that are not present in the FpML input; these appear to be inserted during CDM creation.
- Classification: `suspected enrichment`
- Evidence:
  - `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.xml`
  - `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml`
  - `commodity-derivatives/com-ex18-physical-power-us-eei-fixed-price-shaped-volume.xml`
  - `commodity-derivatives/com-ex19-physical-bullion-forward.xml`
  - `commodity-derivatives/com-ex21-physical-power-us-eei-fixed-price-shaped-volume-and-price.xml`
  - `commodity-derivatives/com-ex3-gas-swap-prices-last-three-days.xml`
- Caution:
  - LEI values in the CDM do not have an obvious FpML origin in these examples; treat them as supplied/enriched metadata rather than direct mappings.
  - If mapping requires authoritative party identifiers, a separate lookup or enrichment source is necessary.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 23/23 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 23/23 successful or salvaged pair analyses (23 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- effectivedate.adjustabledate.unadjusteddate -> effectivedate.adjustabledate.unadjusteddate: Effective (unadjusted) dates in FpML are repeatedly carried into the CDM effectiveDate.adjustableDate.unadjustedDate element without semantic transformation.
- terminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate: Termination (unadjusted) dates in FpML are repeatedly carried into the CDM terminationDate.adjustableDate.unadjustedDate element without semantic transformation.
- fixedleg.fixedprice.price | fixedleg.fixedprice.pricecurrency | fixedleg.fixedprice.priceunit -> price.value.value | unit.currency.value | value.perunitof.capacityunit: FpML fixed price, currency and unit elements are repeatedly reshaped into the CDM price object with nested value, currency and per-unit unit normalization.
- trade.commodityoption.optiontype -> payout.optionpayout.optiontype: Commodity option trades map the FpML option type into the CDM payout.optionPayout.optionType element (e.g., Call/Put -> OptionType).
- Date-like fields repeatedly normalize from effectivedate.adjustabledate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate. [tentative 7 examples]
- termination date copied (direct mapping; terminationdate.adjustabledate.unadjusteddate -> terminationdate.adjustabledate.unadjusteddate) [tentative 7 examples]

### Transformation Patterns

- normalization: Fixed-price fields (price, currency, unit) are reshaped into the CDM price structure and units normalized to CDM canonical unit codes.
- normalization: Calculation spread amounts with currency are repeatedly converted into the CDM price.value and unit.currency representation.
- Normalization repeatedly reshapes calculation.spread.amount|calculation.spread.currency into price.value.value|unit.currency.value. [tentative 3 examples]

### Product-Specific Branches

### com-ex1-gas-swap-daily-delivery-prices-last.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - effective date copied
  - termination date copied
  - price and currency mapped; unit normalized
- Cautions:
  - Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?

### com-ex10-physical-oil-pipeline-crude-wti-floating-price.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - trade date copied
  - effective unadjusted date copied
  - termination unadjusted date copied
  - commodity instrument id -> commodity identifier
- Cautions:
  - CDM party.partyId LEI values absent in FpML; source of LEIs?
  - Why CDM has duplicated tradeIdentifier entries for same tradeId?

### com-ex11-physical-oil-pipeline-heating-oil-fixed-price.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - effectiveDate unadjusted and convention
  - terminationDate unadjusted and convention
  - partyA tradeId and scheme
  - party names mapped to CDM party.name
- Cautions:
  - Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?

### com-ex12-physical-gas-europe-zbt-fixed-price.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - tradeId and scheme preserved
  - effective unadjustedDate mapped
  - price,currency,unit normalized into CDM price structure
- Cautions:
  - Why are tradeIdentifier entries duplicated with same assignedIdentifier?
  - MasterAgreementType mapped to 'ISDAMaster' in CDM; is this normalization?

### com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - effective unadjusted date copied
  - termination unadjusted date copied
  - settlement currency mapped
  - partyA name mapped to CDM party[0]
- Cautions:
  - deliveryPoint 'TW-WTX' not represented in CDM?
  - Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?

### com-ex14-physical-gas-europe-ttf-fixed-price.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - effective date copied
  - termination date copied
  - party name and id mapped
- Cautions:
  - What rule maps Therm to USTHM?
  - How are Party1/Party2 role labels assigned from party hrefs?

### Validation Checks

- Check unresolved question: Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?
- Check unresolved question: CDM party.partyId LEI values absent in FpML; source of LEIs?
- Check unresolved question: Why CDM has duplicated tradeIdentifier entries for same tradeId?
- Check unresolved question: Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?
- Check unresolved question: Why are tradeIdentifier entries duplicated with same assignedIdentifier?
- Check unresolved question: MasterAgreementType mapped to 'ISDAMaster' in CDM; is this normalization?

### Do Not Assume

- Do not treat meta.globalKey entries generated as a guaranteed direct mapping rule yet.
- Do not treat Party identifiers (LEI) added in CDM as a guaranteed direct mapping rule yet.
- Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?
- CDM party.partyId LEI values absent in FpML; source of LEIs?
- Why CDM has duplicated tradeIdentifier entries for same tradeId?
- Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?

## 8. Pair-Level Worked Examples

- Showing the top `10` worked examples in markdown; the full `23` remain in the JSON and debug artifacts.
### `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.xml` -> `commodity-derivatives/com-ex1-gas-swap-daily-delivery-prices-last.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective date copied
  - termination date copied
  - price and currency mapped; unit normalized
- Most important transformation:
  - MMBTU normalized to USMMBTU
- Uncertainty:
  - Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?

### `commodity-derivatives/com-ex10-physical-oil-pipeline-crude-wti-floating-price.xml` -> `commodity-derivatives/com-ex10-physical-oil-pipeline-crude-wti-floating-price.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - trade date copied
  - effective unadjusted date copied
  - termination unadjusted date copied
  - commodity instrument id -> commodity identifier
- Most important transformation:
  - href party refs normalized to Party1/Party2 roles
- Uncertainty:
  - CDM party.partyId LEI values absent in FpML; source of LEIs?
  - Why CDM has duplicated tradeIdentifier entries for same tradeId?

### `commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.xml` -> `commodity-derivatives/com-ex11-physical-oil-pipeline-heating-oil-fixed-price.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effectiveDate unadjusted and convention
  - terminationDate unadjusted and convention
  - partyA tradeId and scheme
  - party names mapped to CDM party.name
- Most important transformation:
  - normalize unit Gal to USGAL and map numeric price
- Uncertainty:
  - Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?

### `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.xml` -> `commodity-derivatives/com-ex12-physical-gas-europe-zbt-fixed-price.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - tradeId and scheme preserved
  - effective unadjustedDate mapped
  - price,currency,unit normalized into CDM price structure
- Most important transformation:
  - two swap legs become two payout entries
- Uncertainty:
  - Why are tradeIdentifier entries duplicated with same assignedIdentifier?
  - MasterAgreementType mapped to 'ISDAMaster' in CDM; is this normalization?

### `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.xml` -> `commodity-derivatives/com-ex13-physical-gas-us-tw-west-texas-pool-floating-price-4-days.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective unadjusted date copied
  - termination unadjusted date copied
  - settlement currency mapped
  - partyA name mapped to CDM party[0]
- Most important transformation:
  - spread amount+currency converted to price value and unit currency
- Uncertainty:
  - deliveryPoint 'TW-WTX' not represented in CDM?
  - Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?

### `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.xml` -> `commodity-derivatives/com-ex14-physical-gas-europe-ttf-fixed-price.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective date copied
  - termination date copied
  - party name and id mapped
- Most important transformation:
  - Therm normalized to USTHM; price nested into CDM price structure
- Uncertainty:
  - What rule maps Therm to USTHM?
  - How are Party1/Party2 role labels assigned from party hrefs?

### `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.xml` -> `commodity-derivatives/com-ex15-physical-oil-pipeline-crude-wcs-fixed-price.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - tradeId -> tradeIdentifier value
  - effectiveDate unadjustedDate
  - party name -> party.name
  - price, currency and unit mapped; unit normalized
- Most important transformation:
  - convert 'Gal' to 'USGAL'
- Uncertainty:
  - What is source of price address 'price-1' in CDM?
  - Why are there duplicate tradeIdentifier entries in CDM?

### `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.xml` -> `commodity-derivatives/com-ex16-physical-power-us-eei-floating-price.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective date copied
  - termination date copied
  - settlement currency mapped
  - party name mapped
- Most important transformation:
  - spread converted to price structure
- Uncertainty:
  - Where is deliveryPoint ErcotNorthCongestionZone represented in CDM?
  - Why settlementTerms.settlementType is 'Cash' despite a physical electricity leg in FpML?

### `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.xml` -> `commodity-derivatives/com-ex17-physical-power-uk-gtma-fixed-price.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective date copied
  - termination date copied
  - businessDayConvention copied
  - tradeId values mapped to assignedIdentifier
- Most important transformation:
  - party hrefs normalized to Party1/Party2 roles
- Uncertainty:
  - Where is settlementCurrency (EUR) represented in CDM?

### `commodity-derivatives/com-ex18-physical-power-us-eei-fixed-price-shaped-volume.xml` -> `commodity-derivatives/com-ex18-physical-power-us-eei-fixed-price-shaped-volume.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - effective unadjusted date
  - termination unadjusted date
  - business day convention
  - party id to externalKey
- Most important transformation:
  - hrefs resolved to Party1/Party2 roles
- Uncertainty:
  - Why are tradeIdentifier entries duplicated in CDM?
  - What source provided the LEI values?

## 9. Open Questions And Risks

- Why CDM contains duplicate tradeIdentifier entries for same assignedIdentifier?
- CDM party.partyId LEI values absent in FpML; source of LEIs?
- Why CDM has duplicated tradeIdentifier entries for same tradeId?
- Why does CDM contain duplicate tradeIdentifier entries for same tradeIds?
- Why are tradeIdentifier entries duplicated with same assignedIdentifier?
- MasterAgreementType mapped to 'ISDAMaster' in CDM; is this normalization?
- deliveryPoint 'TW-WTX' not represented in CDM?
- What rule maps Therm to USTHM?

## 10. Draft Conclusion

- Most reusable findings:
  - Unadjusted effective and termination dates are directly copied into CDM adjustableDate.unadjustedDate fields across many examples.
  - Fixed price + currency + unit are consistently normalized into a CDM price structure (value, currency, per-unit) - unit canonicalization is applied.
  - Spread amounts with currency are normalized into the same CDM price representation used for fixed prices.
  - Option type values map directly from FpML option definitions into CDM payout.optionPayout.optionType.
- What seems safe to generalize:
  - Copying of unadjusted effective and termination dates into CDM adjustableDate.unadjustedDate.
  - Normalization of price/currency/unit into CDM price.value / unit.currency / per-unit constructs.
  - Mapping of option type (Call/Put) into CDM payout.optionPayout.optionType.
  - Conversion of spread.amount+currency into CDM price representation.
- What should remain tentative:
  - The provenance and handling of duplicated tradeIdentifier entries in CDM (frequently observed) - whether canonical deduplication is required.
  - Canonical unit mappings for some units (MMBTU, Therm) where source-to-CDM mapping rules are not consistently shown.
  - Location or modeling of deliveryPoint values (e.g., 'TW-WTX') in CDM - may be omitted or represented elsewhere.
  - Source of LEI/party identifier values present in CDM but absent from FpML.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `23`
- Successful semantic pair count: `23`
- Full semantic pair count: `23`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `0`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 23
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 23
  - Tentative repeated semantic signals: 8
