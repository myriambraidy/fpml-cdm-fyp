# Agent Mapping Playbook: interest-rate-derivatives

## 1. Scope

- Folder: `interest-rate-derivatives`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-26`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `35`
- Matched pairs selected: `11`
- Structural evidence basis: `11/11` matched pairs
- Semantic evidence basis: `11/11` pair analyses
- Full semantic analyses: `11`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `0`
- Missing counterparts: `24`
- Ignored pairs: `0`
- Exact matches: `2`
- Normalized matches: `9`
- Alias matches: `0`
- Structural basis note: Structural summaries are computed from all 11/11 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 11/11 successful or salvaged pair analyses (11 full, 0 salvaged).

## 3. Included Examples

- `interest-rate-derivatives/ird-ex01-vanilla-swap.xml` -> `interest-rate-derivatives/ird-ex01-vanilla-swap.json` (`normalized`)
- `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml` -> `interest-rate-derivatives/ird-ex02-stub-amort-swap.json` (`normalized`)
- `interest-rate-derivatives/ird-ex03-compound-swap.xml` -> `interest-rate-derivatives/ird-ex03-compound-swap.json` (`normalized`)
- `interest-rate-derivatives/ird-ex04-arrears-stepup-fee-swap.xml` -> `interest-rate-derivatives/ird-ex04-arrears-stepup-fee-swap.json` (`normalized`)
- `interest-rate-derivatives/ird-ex05-long-stub-swap.xml` -> `interest-rate-derivatives/ird-ex05-long-stub-swap.json` (`normalized`)
- `interest-rate-derivatives/ird-ex06-xccy-swap.xml` -> `interest-rate-derivatives/ird-ex06-xccy-swap.json` (`normalized`)
- `interest-rate-derivatives/ird-ex07-ois-swap.xml` -> `interest-rate-derivatives/ird-ex07-ois-swap.json` (`normalized`)
- `interest-rate-derivatives/ird-ex08-fra.xml` -> `interest-rate-derivatives/ird-ex08-fra.json` (`exact`)
- `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml` -> `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.json` (`normalized`)
- `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml` -> `interest-rate-derivatives/ird-ex10-euro-swaption-relative.json` (`normalized`)
- `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.xml` -> `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- interest-rate-derivatives/ird-ex12-euro-swaption-straddle-cash.xml
- interest-rate-derivatives/ird-ex13-euro-swaption-cash-with-cfs.xml
- interest-rate-derivatives/ird-ex14-berm-swaption.xml
- interest-rate-derivatives/ird-ex15-amer-swaption.xml
- interest-rate-derivatives/ird-ex16-mand-term-swap.xml
- interest-rate-derivatives/ird-ex17-opt-euro-term-swap.xml
- interest-rate-derivatives/ird-ex18-opt-berm-term-swap.xml
- interest-rate-derivatives/ird-ex19-opt-amer-term-swap.xml
- interest-rate-derivatives/ird-ex20-euro-cancel-swap.xml
- interest-rate-derivatives/ird-ex21-euro-extend-swap.xml
- interest-rate-derivatives/ird-ex22-cap.xml
- interest-rate-derivatives/ird-ex23-floor.xml
- interest-rate-derivatives/ird-ex24-collar.xml
- interest-rate-derivatives/ird-ex25-fxnotional-swap.xml
- interest-rate-derivatives/ird-ex26-fxnotional-swap-with-cfs.xml
- interest-rate-derivatives/ird-ex27-inverse-floater.xml
- interest-rate-derivatives/ird-ex28-bullet-payments.xml
- interest-rate-derivatives/ird-ex29-non-deliverable-settlement-swap.xml
- interest-rate-derivatives/ird-ex30-swap-comp-avg-relative-date.xml
- interest-rate-derivatives/ird-ex31-non-deliverable-settlement-swap.xml
- interest-rate-derivatives/ird-ex32-zero-coupon-swap.xml
- interest-rate-derivatives/ird-ex33-BRL-CDI-swap.xml
- interest-rate-derivatives/ird-ex34-MXN-swap.xml
- interest-rate-derivatives/ird-ex35-inverse-floater-inverse-vs-floating.xml

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

- `party` appears in `11/11` examples
- `trade` appears in `11/11` examples

### 5.3 Repeated nested structures

- trade > swap (59 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- trade > swap (178 paths)
- trade > swap (142 paths)
- trade > swap (69 paths)
- trade > swap (75 paths)
- trade > swap (167 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `11/11` examples
- `trade` appears in `11/11` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (117 paths)
- trade > tradeLot (43 paths)
- trade > party (16 paths)
- trade > tradeIdentifier (8 paths)
- trade > counterparty (7 paths)
- trade > tradeDate (2 paths)
- meta > globalKey (1 paths)
- trade > meta (1 paths)

### 5.7 Optional but common CDM sections

- `transferHistory` appears in `4/11` examples

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule RULE-001: Notional -> tradeLot.quantity

- Strength: `moderate recurring pattern`
- Evidence count: `4` examples
- Source pattern: `notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue`
- Target pattern: `tradeLot.quantity.value|unit.currency.value`
- Explanation: Notional amounts (value + currency) in FpML are repeatedly represented as a tradeLot quantity in the CDM with numeric value and currency unit.
- Why it seems to work this way: Trade-level economic size is preserved by mapping FpML notional constructs to CDM tradeLot.quantity which captures amount+currency.
- Example files:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex04-arrears-stepup-fee-swap.xml`
  - `interest-rate-derivatives/ird-ex05-long-stub-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Caveats:
  - Requires both numeric initialValue and an associated currency to form a CDM quantity.
  - FpML notional schedule variants (steps, long-stub) may require aggregation or selection logic not captured by a single rule.

### Rule RULE-002: Swap stream payer/receiver -> interestratepayout.payerReceiver

- Strength: `moderate recurring pattern`
- Evidence count: `4` examples
- Source pattern: `swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference`
- Target pattern: `interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver`
- Explanation: Party references used on swapStream elements are resolved into CDM payer/receiver roles on interest rate payouts.
- Why it seems to work this way: Each swapStream represents a side of the swap; mapping its party hrefs to payer/receiver yields the CDM representation of counterparty cashflow direction.
- Example files:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml`
  - `interest-rate-derivatives/ird-ex06-xccy-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Caveats:
  - Representative examples show consistent href use, but derived CDM role labels (e.g., 'Party1') differ from FpML partyId values - mapping of identifiers is inconsistent across examples.

### Rule RULE-003: Strip timezone from effectivedate values

- Strength: `moderate recurring pattern`
- Evidence count: `3` examples
- Source pattern: `calculationperioddates.effectivedate.unadjusteddate`
- Target pattern: `effectivedate.adjustabledate.unadjusteddate`
- Explanation: Date/time strings in FpML that include timezone suffixes (e.g., trailing 'Z') are normalized by removing the timezone before populating CDM date fields.
- Why it seems to work this way: CDM date fields in examples use date-only or normalized datetime formats; removing trailing timezone characters produces the expected CDM format.
- Example files:
  - `interest-rate-derivatives/ird-ex03-compound-swap.xml`
  - `interest-rate-derivatives/ird-ex06-xccy-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Caveats:
  - Normalization assumes UTC 'Z' suffix or similar trailing timezone tokens; other timezone encodings are not evidenced.
  - Time-of-day information is effectively lost when trimming to date-only representations.

### Rule RULE-004: Strip timezone from expirationdate values

- Strength: `moderate recurring pattern`
- Evidence count: `3` examples
- Source pattern: `expirationdate.adjustabledate.unadjusteddate`
- Target pattern: `expirationdate.adjustabledate.unadjusteddate`
- Explanation: Expiration dates for options in FpML are normalized by removing timezone suffixes before mapping into CDM expiration date fields.
- Why it seems to work this way: CDM examples show expiration dates without the trailing timezone; the strip-normalize step produces consistent formatting expected by CDM.
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
  - `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.xml`
- Caveats:
  - Normalization is demonstrated on examples with trailing 'Z'; other timezone formats are not evidenced.
  - Ensure that business rules about timezone interpretation are satisfied before removing timezone info.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Notional value normalization to tradeLot quantity

- Type: `normalization`
- Description: Converts FpML notional schedules (value + currency) into CDM tradeLot.quantity entries (numeric value + currency unit).
- Source side: `notionalschedule.notionalstepschedule.initialvalue + currency`
- Target side: `tradeLot.quantity.value + tradeLot.quantity.unit.currency`
- Evidence count: `4`
- Example files:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex04-arrears-stepup-fee-swap.xml`
  - `interest-rate-derivatives/ird-ex05-long-stub-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Notes:
  - Representative note: notional amount and currency mapped to tradeLot quantity
  - Aggregation rules for stepped notionals are not fully evidenced.

### Transformation TR-002: Resolve swapStream party href to CDM payer/receiver

- Type: `reference resolution`
- Description: Resolves FpML swapStream payer/receiver hrefs to CDM InterestRatePayout payerReceiver roles.
- Source side: `swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference`
- Target side: `interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver`
- Evidence count: `4`
- Example files:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml`
  - `interest-rate-derivatives/ird-ex06-xccy-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Notes:
  - Representative note: swapStream payer/receiver hrefs map to CDM payerReceiver
  - Identifier mapping between FpML partyId and CDM.party.partyId is inconsistent across examples.

### Transformation TR-003: Effectivedate timezone trim

- Type: `normalization`
- Description: Remove trailing timezone indicators (e.g., 'Z') from calculation period effective dates before mapping to CDM date fields.
- Source side: `calculationperioddates.effectivedate.unadjusteddate (may include trailing 'Z')`
- Target side: `effectivedate.adjustabledate.unadjusteddate (date-only/normalized)`
- Evidence count: `3`
- Example files:
  - `interest-rate-derivatives/ird-ex03-compound-swap.xml`
  - `interest-rate-derivatives/ird-ex06-xccy-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Notes:
  - Representative note: Trim timezone 'Z' from date string
  - Time-of-day/timezone information is not preserved in the CDM examples.

### Transformation TR-004: Expiration date timezone trim

- Type: `normalization`
- Description: Remove timezone suffix from option expiration dates when mapping to CDM expiration fields.
- Source side: `expirationdate.adjustabledate.unadjusteddate`
- Target side: `expirationdate.adjustabledate.unadjusteddate (normalized)`
- Evidence count: `3`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
  - `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.xml`
- Notes:
  - Representative note: Strip timezone from datetime
  - Preserves date semantics expected by CDM while removing timezone suffix.

### Transformation TR-005: Fixed rate -> price normalization

- Type: `normalization`
- Description: Map fixed-rate schedule initial values into CDM price.value to represent fixed leg or option strike rates.
- Source side: `calculation.fixedrateschedule.initialvalue`
- Target side: `price.value.value`
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
- Notes:
  - Representative note: Fixed rate value mapped to CDM price
  - Unit/scale consistency (e.g., decimal vs percent) should be verified when applying this rule.

### Transformation TR-006: Swaption buyer reference resolution

- Type: `reference resolution`
- Description: Resolve trade.swaption.buyerpartyreference into CDM option payout buyer field for option contract mapping.
- Source side: `trade.swaption.buyerpartyreference`
- Target side: `optionpayout.buyerseller.buyer`
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
- Notes:
  - Representative note: buyerPartyReference -> buyer
  - Some examples show apparent payer/receiver inversions between premium and option payout which must be validated.

### Transformation TR-007: Trade/tradedate normalization

- Type: `normalization`
- Description: Normalize trade.tradeheader.tradedate by stripping trailing timezone characters and formatting to CDM trade.tradedate.value.
- Source side: `trade.tradeheader.tradedate`
- Target side: `trade.tradedate.value`
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml`
  - `interest-rate-derivatives/ird-ex05-long-stub-swap.xml`
- Notes:
  - Representative note: strip trailing 'Z' and normalize to YYYY-MM-DD
  - Applies to trade header dates observed in swap examples.

### 6.3 Tentative and emerging signals

### TENT-001: mapping

- Strength: `moderate recurring pattern`
- Description: Economic terms repeatedly reshape from notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue into quantity.value.value|unit.currency.value.
- Evidence count: `4`
- Example files:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex04-arrears-stepup-fee-swap.xml`
  - `interest-rate-derivatives/ird-ex05-long-stub-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: notional amount and currency mapped to tradeLot quantity
  - Representative note: notional amount and currency
  - Representative note: notional amount and currency -> tradeLot quantity

### TENT-002: mapping

- Strength: `moderate recurring pattern`
- Description: Party references repeatedly resolve from swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.
- Evidence count: `4`
- Example files:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml`
  - `interest-rate-derivatives/ird-ex06-xccy-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: swapStream payer/receiver hrefs map to CDM payerReceiver
  - Representative note: FpML payer/receiver mapped to CDM payerReceiver
  - Representative note: party hrefs map to payer/receiver roles

### TENT-003: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.
- Evidence count: `3`
- Example files:
  - `interest-rate-derivatives/ird-ex03-compound-swap.xml`
  - `interest-rate-derivatives/ird-ex06-xccy-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Trim timezone 'Z' from date string
  - Representative note: strip trailing 'Z' from date
  - Representative note: strip timezone from datetime

### TENT-004: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes expirationdate.adjustabledate.unadjusteddate into expirationdate.adjustabledate.unadjusteddate.
- Evidence count: `3`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
  - `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Strip timezone from datetime
  - Representative note: removed timezone suffix 'Z' from date
  - Representative note: removed trailing 'Z' timezone

### TENT-005: mapping

- Strength: `moderate recurring pattern`
- Description: Both trade tradedate and calculation period effective dates have trailing timezone characters removed and are normalized to a CDM date format. (calculationperioddates.effectivedate.unadjusteddate|trade.tradeheader.tradedate -> effectivedate.adjustabledate.unadjusteddate|trade.tradedate.value)
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml`
  - `interest-rate-derivatives/ird-ex05-long-stub-swap.xml`
- Notes:
  - Examples with long stubs and trade headers both applied the same date normalization logic to match CDM representation.
  - Normalization is demonstrated as removing trailing 'Z' and normalizing to YYYY-MM-DD. Other timezone or datetime-preserving behaviors are not evidenced.

### TENT-006: mapping

- Strength: `moderate recurring pattern`
- Description: Buyer references in FpML swaption constructs map to the CDM option payout buyer role. (trade.swaption.buyerpartyreference -> optionpayout.buyerseller.buyer)
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
- Notes:
  - Examples consistently map buyerPartyReference into the CDM buyer field for option payouts.
  - Some examples raise questions about apparent payer/receiver inversions for premium vs option payout - buyer mapping is consistent in observed cases but role inversion issues remain in other fields.

### TENT-007: mapping

- Strength: `moderate recurring pattern`
- Description: Date-like fields repeatedly normalize from expirationdate.adjustabledate.unadjusteddate into expirationdate.adjustabledate.unadjusteddate.
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Expiration date mapped with format normalization
  - Representative note: expiration date normalized format

### TENT-008: mapping

- Strength: `moderate recurring pattern`
- Description: Economic terms repeatedly reshape from calculation.fixedrateschedule.initialvalue into price.value.value.
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Fixed rate value mapped to CDM price
  - Representative note: fixed rate initialValue -> tradeLot price

### TENT-009: mapping

- Strength: `moderate recurring pattern`
- Description: Expiration dates are consistently normalized to the CDM date format (strip trailing timezone and possibly convert to YYYY-MM-DD). (expirationdate.adjustabledate.unadjusteddate -> expirationdate.adjustabledate.unadjusteddate)
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.xml`
- Notes:
  - Two swaption examples explicitly show the same normalization step applied to expiration dates to match CDM date formatting.
  - Applies to observed examples; broader date/time edge-cases are not present in the evidence set.

### TENT-010: mapping

- Strength: `moderate recurring pattern`
- Description: Fixed-rate values used in option underlying or fixed legs are mapped into CDM price fields representing the fixed rate as a numeric price. (calculation.fixedrateschedule.initialvalue -> price.value.value)
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
- Notes:
  - CDM represents fixed economic parameters for pricing as price.value; mapping initial fixed rate into price preserves the economic parameter.
  - Rate units and scaling assumptions must be consistent (e.g., 0.0585 -> 5.85%); examples show numeric mapping but not unit conversion rules.

### TENT-011: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate|trade.tradeheader.tradedate into effectivedate.adjustabledate.unadjusteddate|trade.tradedate.value.
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml`
  - `interest-rate-derivatives/ird-ex05-long-stub-swap.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Strip trailing 'Z' from dates
  - Representative note: strip trailing 'Z' and normalize to YYYY-MM-DD

### TENT-012: mapping

- Strength: `moderate recurring pattern`
- Description: Party references repeatedly resolve from trade.swaption.buyerpartyreference into optionpayout.buyerseller.buyer.
- Evidence count: `2`
- Example files:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Buyer party mapped to CDM buyer
  - Representative note: buyerPartyReference -> buyer

### 6.4 Folder-level principles

- Map FpML notional amount + currency to CDM tradeLot.quantity (value + currency).
- Resolve swapStream party hrefs to CDM payer/receiver roles on InterestRatePayout entries.
- Normalize FpML date/time strings by removing trailing timezone suffixes (e.g., 'Z') to match CDM date formatting.
- Map fixed-rate initialValue fields to CDM price.value for fixed leg rates and option strikes.
- Represent each FpML swapStream as one or more CDM InterestRatePayouts (i.e., swap streams split into payout entries).
- Map floating rate index identifiers (e.g., USD-LIBOR-BBA) to CDM observable/index identifier fields.

### 6.5 Variants and exceptions

### Variant VAR-001: Party identifier label variance

- Description: CDM uses short role-like labels (e.g., 'Party1', 'Party2', 'PartyA') instead of FpML partyId values in examples.
- Seen in:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex03-compound-swap.xml`
  - `interest-rate-derivatives/ird-ex05-long-stub-swap.xml`
- Impact on generalization: Significant - mapping logic must allow for label generation or external enrichment; do not assume CDM.party.partyId equals FpML partyId.

### Variant VAR-002: Payer/receiver apparent inversion in option premium vs payout

- Description: Some swaption examples indicate that premium payer values in FpML do not always align with CDM optionPayout.payerReceiver mapping (possible inversion).
- Seen in:
  - `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml`
  - `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml`
- Impact on generalization: High - mapping of premium vs option payout roles must be validated case-by-case; do not apply an assumption of consistent direction without checks.

### Variant VAR-003: Trade identifier omission or substitution

- Description: FpML tradeId values (e.g., TW9235, TRN12000) are sometimes absent or replaced by different CDM tradeIdentifier values (e.g., SW2000).
- Seen in:
  - `interest-rate-derivatives/ird-ex01-vanilla-swap.xml`
  - `interest-rate-derivatives/ird-ex07-ois-swap.xml`
- Impact on generalization: Moderate - do not assume a 1:1 mapping for trade identifiers; mapping may require external provenance or enrichment.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: Additional CDM tradeIdentifier issuer entries

- Description: Examples contain multiple CDM tradeIdentifier issuer entries without a clear corresponding FpML source, indicating possible enrichment or synthetic identifiers.
- Classification: `suspected enrichment`
- Evidence:
  - `Representative highlights mention multiple CDM tradeIdentifier issuer entries lack clear FpML source (ird-ex04).`
  - `Trade id mismatches noted in ird-ex01 and ird-ex07.`
- Caution:
  - Preserve provenance of any generated identifiers and avoid assuming FpML contains the authoritative issuer values.
  - Flag generated identifiers for downstream review.

### Enrichment ENR-002: CDM.party.partyId LEI enrichment

- Description: CDM party.partyId entries in examples appear to contain LEIs or other normalized identifiers that are not present in the FpML party definitions.
- Classification: `suspected enrichment`
- Evidence:
  - `Examples: ird-ex01, ird-ex04, ird-ex07 show CDM party identifiers not matching FpML partyId.`
  - `Representative open questions and highlights noting CDM party.partyId LEIs differ from FpML partyId values.`
- Caution:
  - Treat CDM party identifiers as potentially externally-sourced; do not infer source mapping rules from the current example set alone.
  - Preserve original FpML partyId in intermediate artifacts to enable reconciliation.

### Enrichment ENR-003: Generated role labels (Party1/Party2/PartyA)

- Description: CDM examples use generated role labels (e.g., 'Party1','Party2','PartyA') rather than the raw FpML partyId values, suggesting a deterministic label generation or anonymization step.
- Classification: `suspected enrichment`
- Evidence:
  - `Multiple examples and uncertainties about how Party1/Party2 derived (see ird-ex03, ird-ex05).`
  - `Representative open questions asking how Party1/Party2 labels were derived.`
- Caution:
  - Do not overwrite or discard original FpML party identifiers when producing CDM parties; maintain mapping metadata.
  - If label-generation is applied, document the algorithm or source used for reproducibility.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 11/11 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 11/11 successful or salvaged pair analyses (11 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue -> tradeLot.quantity.value|unit.currency.value: Notional amounts (value + currency) in FpML are repeatedly represented as a tradeLot quantity in the CDM with numeric value and currency unit.
- swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference -> interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver: Party references used on swapStream elements are resolved into CDM payer/receiver roles on interest rate payouts.
- calculationperioddates.effectivedate.unadjusteddate -> effectivedate.adjustabledate.unadjusteddate: Date/time strings in FpML that include timezone suffixes (e.g., trailing 'Z') are normalized by removing the timezone before populating CDM date fields.
- expirationdate.adjustabledate.unadjusteddate -> expirationdate.adjustabledate.unadjusteddate: Expiration dates for options in FpML are normalized by removing timezone suffixes before mapping into CDM expiration date fields.
- Economic terms repeatedly reshape from notionalschedule.notionalstepschedule.currency|notionalschedule.notionalstepschedule.initialvalue into quantity.value.value|unit.currency.value. [tentative 4 examples]
- Party references repeatedly resolve from swap.swapstream.payerpartyreference|swap.swapstream.receiverpartyreference into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver. [tentative 4 examples]

### Transformation Patterns

- normalization: Converts FpML notional schedules (value + currency) into CDM tradeLot.quantity entries (numeric value + currency unit).
- reference resolution: Resolves FpML swapStream payer/receiver hrefs to CDM InterestRatePayout payerReceiver roles.
- normalization: Remove trailing timezone indicators (e.g., 'Z') from calculation period effective dates before mapping to CDM date fields.
- normalization: Remove timezone suffix from option expiration dates when mapping to CDM expiration fields.
- normalization: Map fixed-rate schedule initial values into CDM price.value to represent fixed leg or option strike rates.
- reference resolution: Resolve trade.swaption.buyerpartyreference into CDM option payout buyer field for option contract mapping.

### Product-Specific Branches

### ird-ex01-vanilla-swap.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - tradeDate mapped and normalized (Z removed)
  - swapStream payer/receiver hrefs map to CDM payerReceiver
  - notional amount and currency mapped to tradeLot quantity
  - floating rate index and tenor mapped to observable index
- Cautions:
  - FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?

### ird-ex02-stub-amort-swap.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - FpML payer/receiver mapped to CDM payerReceiver
  - Notional step schedule converted to dated quantity values
  - Floating index and tenor moved into observable index structure
- Cautions:
  - Why does CDM use 'Party1'/'Party2' strings instead of partyId values?

### ird-ex03-compound-swap.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - Notional initialValue maps to tradeLot quantity value
  - Fixed rate 0.0585 maps to CDM fixedRate
  - Floating index USD-LIBOR-BBA maps to CDM index identifier
  - Date normalized (removed trailing Z)
- Cautions:
  - Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
  - Mapping of payer/receiver labels (Party1/Party2) to FpML hrefs unclear

### ird-ex04-arrears-stepup-fee-swap.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - trade date copied
  - notional amount and currency
  - floating index normalized into observable
  - additionalPayment -> transferHistory.transfer
- Cautions:
  - CDM party.partyId LEIs differ from FpML partyId values; mapping unclear
  - Multiple CDM tradeIdentifier issuer entries lack clear FpML source

### ird-ex05-long-stub-swap.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - payer href 'party1' -> payer 'Party1'
  - dayCountFraction ACT/360 -> payout dayCountFraction
  - notional amount and currency -> tradeLot quantity
  - floatingRateIndex name -> observable identifier
- Cautions:
  - How were Party1/Party2 labels derived from FpML party hrefs?
  - Why FpML partyId values not reflected as same identifiers in CDM?

### ird-ex06-xccy-swap.xml

- When to use: Use this branch when the source document resembles trade, party.
- Source signals:
  - trade
  - party
- Mapping focus:
  - party hrefs map to payer/receiver roles
  - notional amount and currency mapped
  - unadjustedDate normalized
- Cautions:
  - FpML partyId values differ from CDM party.partyId LEIs; mapping unclear
  - FpML tradeHeader.tradeId values not present in CDM.tradeIdentifier; provenance unclear

### Validation Checks

- Check unresolved question: FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?
- Check unresolved question: Why does CDM use 'Party1'/'Party2' strings instead of partyId values?
- Check unresolved question: Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
- Check unresolved question: Mapping of payer/receiver labels (Party1/Party2) to FpML hrefs unclear
- Check unresolved question: CDM party.partyId LEIs differ from FpML partyId values; mapping unclear
- Check unresolved question: Multiple CDM tradeIdentifier issuer entries lack clear FpML source

### Do Not Assume

- Do not treat Additional CDM tradeIdentifier issuer entries as a guaranteed direct mapping rule yet.
- Do not treat CDM.party.partyId LEI enrichment as a guaranteed direct mapping rule yet.
- Do not treat Generated role labels (Party1/Party2/PartyA) as a guaranteed direct mapping rule yet.
- FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?
- Why does CDM use 'Party1'/'Party2' strings instead of partyId values?
- Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?

## 8. Pair-Level Worked Examples

### `interest-rate-derivatives/ird-ex01-vanilla-swap.xml` -> `interest-rate-derivatives/ird-ex01-vanilla-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - tradeDate mapped and normalized (Z removed)
  - swapStream payer/receiver hrefs map to CDM payerReceiver
  - notional amount and currency mapped to tradeLot quantity
  - floating rate index and tenor mapped to observable index
- Most important transformation:
  - removed trailing Z from date
- Uncertainty:
  - FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?

### `interest-rate-derivatives/ird-ex02-stub-amort-swap.xml` -> `interest-rate-derivatives/ird-ex02-stub-amort-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML payer/receiver mapped to CDM payerReceiver
  - Notional step schedule converted to dated quantity values
  - Floating index and tenor moved into observable index structure
- Most important transformation:
  - Strip trailing 'Z' from dates
- Uncertainty:
  - Why does CDM use 'Party1'/'Party2' strings instead of partyId values?

### `interest-rate-derivatives/ird-ex03-compound-swap.xml` -> `interest-rate-derivatives/ird-ex03-compound-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - Notional initialValue maps to tradeLot quantity value
  - Fixed rate 0.0585 maps to CDM fixedRate
  - Floating index USD-LIBOR-BBA maps to CDM index identifier
  - Date normalized (removed trailing Z)
- Most important transformation:
  - Two swapStream elements become two InterestRatePayouts
- Uncertainty:
  - Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
  - Mapping of payer/receiver labels (Party1/Party2) to FpML hrefs unclear

### `interest-rate-derivatives/ird-ex04-arrears-stepup-fee-swap.xml` -> `interest-rate-derivatives/ird-ex04-arrears-stepup-fee-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - trade date copied
  - notional amount and currency
  - floating index normalized into observable
  - additionalPayment -> transferHistory.transfer
- Most important transformation:
  - Each swapStream becomes an InterestRatePayout entry
- Uncertainty:
  - CDM party.partyId LEIs differ from FpML partyId values; mapping unclear
  - Multiple CDM tradeIdentifier issuer entries lack clear FpML source

### `interest-rate-derivatives/ird-ex05-long-stub-swap.xml` -> `interest-rate-derivatives/ird-ex05-long-stub-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - payer href 'party1' -> payer 'Party1'
  - dayCountFraction ACT/360 -> payout dayCountFraction
  - notional amount and currency -> tradeLot quantity
  - floatingRateIndex name -> observable identifier
- Most important transformation:
  - strip trailing 'Z' and normalize to YYYY-MM-DD
- Uncertainty:
  - How were Party1/Party2 labels derived from FpML party hrefs?
  - Why FpML partyId values not reflected as same identifiers in CDM?

### `interest-rate-derivatives/ird-ex06-xccy-swap.xml` -> `interest-rate-derivatives/ird-ex06-xccy-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - party hrefs map to payer/receiver roles
  - notional amount and currency mapped
  - unadjustedDate normalized
- Most important transformation:
  - strip trailing 'Z' from date
- Uncertainty:
  - FpML partyId values differ from CDM party.partyId LEIs; mapping unclear
  - FpML tradeHeader.tradeId values not present in CDM.tradeIdentifier; provenance unclear

### `interest-rate-derivatives/ird-ex07-ois-swap.xml` -> `interest-rate-derivatives/ird-ex07-ois-swap.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - party href to payer/receiver
  - notional and currency to tradeLot quantity
  - floating rate index to observable identifier
  - unadjustedDate timezone trimmed
- Most important transformation:
  - strip timezone from datetime
- Uncertainty:
  - FpML tradeId values TRN12000/TRN13000 not mapped to CDM.tradeIdentifier
  - FpML parties lack LEI; CDM.party.partyId LEIs sourced elsewhere

### `interest-rate-derivatives/ird-ex08-fra.xml` -> `interest-rate-derivatives/ird-ex08-fra.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - buyerParty -> payer
  - sellerParty -> receiver
  - datetime -> date (timezone removed)
  - rate string -> numeric price
- Most important transformation:
  - FRA split into fixed and floating payouts
- Uncertainty:
  - Are party LEIs sourced externally or inferred?
  - Why are tradeIdentifier entries duplicated in CDM?

### `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.xml` -> `interest-rate-derivatives/ird-ex09-euro-swaption-explicit.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - Buyer party mapped to CDM buyer
  - Expiration date mapped with format normalization
  - Fixed rate value mapped to CDM price
  - Accrual business center mapped
- Most important transformation:
  - Strip timezone from datetime
- Uncertainty:
  - Why is OptionPayout.payerReceiver reversed relative to premium.payerPartyReference?

### `interest-rate-derivatives/ird-ex10-euro-swaption-relative.xml` -> `interest-rate-derivatives/ird-ex10-euro-swaption-relative.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - buyerPartyReference -> buyer
  - sellerPartyReference -> seller
  - premium amount+currency -> transferHistory quantity
  - fixed rate initialValue -> tradeLot price
- Most important transformation:
  - removed timezone suffix 'Z' from date
- Uncertainty:
  - FpML premium payer=party1 but OptionPayout.payerReceiver.payer=Party2; is mapping inverted?

### `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.xml` -> `interest-rate-derivatives/ird-ex11-euro-swaption-partial-auto-ex.json`

- Main FpML sections: trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - swaption buyer/seller → OptionPayout buyer/seller
  - FpML partyId values preserved to CDM partyId
  - expiration date normalized format
  - notional href copied to externalReference
- Most important transformation:
  - removed trailing 'Z' timezone
- Uncertainty:
  - OptionPayout.payerReceiver shows payer Party2, but FpML premium payer is party1. Why?

## 9. Open Questions And Risks

- FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?
- Why does CDM use 'Party1'/'Party2' strings instead of partyId values?
- Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
- Mapping of payer/receiver labels (Party1/Party2) to FpML hrefs unclear
- CDM party.partyId LEIs differ from FpML partyId values; mapping unclear
- Multiple CDM tradeIdentifier issuer entries lack clear FpML source
- How were Party1/Party2 labels derived from FpML party hrefs?
- Why FpML partyId values not reflected as same identifiers in CDM?

## 10. Draft Conclusion

- Most reusable findings:
  - Notional amounts + currency -> CDM tradeLot.quantity is a consistent mapping across swaps (use this as primary rule for trade notional translation).
  - Swap.swapStream party hrefs consistently map to CDM InterestRatePayout payer/receiver roles (resolve hrefs to party identifiers).
  - Strip trailing timezone suffixes (e.g., 'Z') from FpML date/time fields before populating CDM date fields.
  - Fixed-rate initialValue maps to CDM price.value for fixed legs and swaption strikes.
- What seems safe to generalize:
  - Date/time normalization by removing trailing 'Z' (evidenced across multiple examples).
  - Notional -> tradeLot.quantity mapping (multiple swap examples).
  - swapStream payer/receiver href -> interestratepayout.payerReceiver (multiple examples).
  - Fixed rate initialValue -> price.value for swaptions/fixed legs (swaption examples).
- What should remain tentative:
  - Mapping of FpML partyId to CDM.party.partyId (Party1/Party2/LEI differences) - evidence shows inconsistent identifier handling.
  - Trade identifier provenance and mapping - some FpML tradeIds are omitted or replaced in CDM.
  - Role inversion between premium payer and option payout payerReceiver observed in some swaption examples - requires case-by-case validation.
  - Any assumption that CDM identifiers are present in FpML without external enrichment - likely untrue given examples.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `11`
- Successful semantic pair count: `11`
- Full semantic pair count: `11`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `0`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 11
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 11
  - Tentative repeated semantic signals: 8
