# Agent Mapping Playbook: fx-derivatives

## 1. Scope

- Folder: `fx-derivatives`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-23`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `26`
- Matched pairs selected: `25`
- Structural evidence basis: `25/25` matched pairs
- Semantic evidence basis: `25/25` pair analyses
- Full semantic analyses: `25`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `0`
- Missing counterparts: `1`
- Ignored pairs: `0`
- Exact matches: `22`
- Normalized matches: `0`
- Alias matches: `3`
- Structural basis note: Structural summaries are computed from all 25/25 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 25/25 successful or salvaged pair analyses (25 full, 0 salvaged).

## 3. Included Examples

- `fx-derivatives/fx-ex01-fx-spot.xml` -> `fx-derivatives/fx-ex01-fx-spot.json` (`exact`)
- `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml` -> `fx-derivatives/fx-ex02-spot-cross-w-side-rates.json` (`exact`)
- `fx-derivatives/fx-ex03-fx-fwd.xml` -> `fx-derivatives/fx-ex03-fx-fwd.json` (`exact`)
- `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml` -> `fx-derivatives/fx-ex04-fx-fwd-w-settlement.json` (`exact`)
- `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml` -> `fx-derivatives/fx-ex05-fx-fwd-w-ssi.json` (`exact`)
- `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml` -> `fx-derivatives/fx-ex06-fx-fwd-w-splits.json` (`exact`)
- `fx-derivatives/fx-ex07-non-deliverable-forward.xml` -> `fx-derivatives/fx-ex07-non-deliverable-forward.json` (`exact`)
- `fx-derivatives/fx-ex08-fx-swap.xml` -> `fx-derivatives/fx-ex08-fx-swap.json` (`exact`)
- `fx-derivatives/fx-ex09-euro-opt.xml` -> `fx-derivatives/fx-ex09-euro-opt.json` (`exact`)
- `fx-derivatives/fx-ex10-amer-opt.xml` -> `fx-derivatives/fx-ex10-amer-opt.json` (`exact`)
- `fx-derivatives/fx-ex11-non-deliverable-option.xml` -> `fx-derivatives/fx-ex11-non-deliverable-option.json` (`exact`)
- `fx-derivatives/fx-ex12-fx-barrier-option.xml` -> `fx-derivatives/fx-ex12-fx-barrier-option.json` (`exact`)
- `fx-derivatives/fx-ex13-fx-dbl-barrier-option.xml` -> `fx-derivatives/fx-ex13-fx-dbl-barrier-option.json` (`exact`)
- `fx-derivatives/fx-ex14-euro-digital-option.xml` -> `fx-derivatives/fx-ex14-euro-digital-option.json` (`exact`)
- `fx-derivatives/fx-ex15-euro-range-digital-option.xml` -> `fx-derivatives/fx-ex15-euro-range-digital-option.json` (`exact`)
- `fx-derivatives/fx-ex16-one-touch-option.xml` -> `fx-derivatives/fx-ex16-one-touch-option.json` (`exact`)
- `fx-derivatives/fx-ex17-no-touch-option.xml` -> `fx-derivatives/fx-ex17-no-touch-option.json` (`exact`)
- `fx-derivatives/fx-ex18-double-one-touch-option.xml` -> `fx-derivatives/fx-ex18-double-one-touch-option.json` (`exact`)
- `fx-derivatives/fx-ex19-double-no-touch-option.xml` -> `fx-derivatives/fx-ex19-double-no-touch-option.json` (`exact`)
- `fx-derivatives/fx-ex20-avg-rate-option-parametric.xml` -> `fx-derivatives/fx-ex20-avg-rate-option-parametric.json` (`exact`)
- `fx-derivatives/fx-ex21-avg-rate-option-specific.xml` -> `fx-derivatives/fx-ex21-avg-rate-option-specific.json` (`alias`)
- `fx-derivatives/fx-ex22-straddle.xml` -> `fx-derivatives/fx-ex22-straddle.json` (`alias`)
- `fx-derivatives/fx-ex23-delta-hedge.xml` -> `fx-derivatives/fx-ex23-delta-hedge.json` (`alias`)
- `fx-derivatives/td-ex01-simple-term-deposit.xml` -> `fx-derivatives/td-ex01-simple-term-deposit.json` (`exact`)
- `fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml` -> `fx-derivatives/td-ex02-term-deposit-w-settlement-etc.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- fx-derivatives/td-ex03-dual-currency-deposit-strategy.xml

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/header/conversationId
- /FpML/header/messageId
- /FpML/header/sentBy
- /FpML/header/sendTo
- /FpML/header/creationTimestamp
- /FpML/trade/tradeHeader/partyTradeIdentifier
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId

### 5.2 Repeated top-level sections

- `header` appears in `25/25` examples
- `party` appears in `25/25` examples
- `trade` appears in `25/25` examples

### 5.3 Repeated nested structures

- trade > fxSingleLeg (13 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- header > conversationId (1 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `25/25` examples
- `trade` appears in `25/25` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > tradeLot (29 paths)
- trade > tradeIdentifier (21 paths)
- trade > product (20 paths)
- trade > party (15 paths)
- trade > counterparty (7 paths)
- trade > tradeDate (2 paths)
- meta > globalKey (1 paths)
- trade > meta (1 paths)

### 5.7 Optional but common CDM sections

- `transferHistory` appears in `13/25` examples

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule RULE-001: Trade identifier -> assignedIdentifier.value

- Strength: `moderate recurring pattern`
- Evidence count: `11` examples
- Source pattern: `tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements)`
- Target pattern: `trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value)`
- Explanation: FpML tradeId values are repeatedly copied into CDM assignedIdentifier.identifier.value preserving the trade identifier value (often with an associated scheme).
- Why it seems to work this way: Trade-level ids are high-value stable keys in the source and are preserved to allow traceability to the original FpML trade.
- Example files:
  - `fx-derivatives/fx-ex01-fx-spot.xml`
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex03-fx-fwd.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex08-fx-swap.xml`
  - `fx-derivatives/fx-ex09-euro-opt.xml`
  - `fx-derivatives/fx-ex11-non-deliverable-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
  - `fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml`
- Caveats:
  - In some CDM outputs there are more assignedIdentifier entries than FpML tradeId elements (possible duplication or added identifiers).
  - AssignedIdentifier.scheme in CDM sometimes differs from FpML tradeIdScheme; reason not consistently evident from examples.

### Rule RULE-002: Trade date normalization (remove trailing 'Z')

- Strength: `moderate recurring pattern`
- Evidence count: `7` examples
- Source pattern: `trade.tradeHeader.tradeDate (FpML with timezone 'Z')`
- Target pattern: `trade.tradeDate.value (CDM normalized ISO date without trailing 'Z')`
- Explanation: Dates copied from FpML have their trailing 'Z' (UTC designator) trimmed in CDM date.value fields to produce a plain date string.
- Why it seems to work this way: CDM date fields in these examples use a normalized date format without the timezone marker; mapping routine trims the 'Z' to conform to CDM expected value.
- Example files:
  - `fx-derivatives/fx-ex03-fx-fwd.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
  - `fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml`
- Caveats:
  - Normalization appears consistent in examples but rules for timezone-preserving conversions (if needed) are not shown.

### Rule RULE-003: Option product type -> CDM taxonomy name

- Strength: `moderate recurring pattern`
- Evidence count: `5` examples
- Source pattern: `trade.fxdigitaloption.productType (FpML productType strings)`
- Target pattern: `trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name)`
- Explanation: FpML product type labels (e.g., 'Euro Binary') are normalized and mapped into a CDM taxonomy name value (e.g., 'EuroBinary').
- Why it seems to work this way: CDM uses standardized taxonomy strings for product classification; mapping normalizes source labels to the expected CDM taxonomy representations.
- Example files:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex16-one-touch-option.xml`
  - `fx-derivatives/fx-ex17-no-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Caveats:
  - Normalization details (exact string transformations) are inferred from examples but not exhaustively specified across all possible productType variants.

### Rule RULE-004: Expiry date/time/businessCenter -> exerciseTerms.expiration

- Strength: `moderate recurring pattern`
- Evidence count: `4` examples
- Source pattern: `expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields`
- Target pattern: `adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration)`
- Explanation: Expiry-related fields in FpML (date, time, business center) are reshaped into CDM exerciseTerms.expiration components and time fields.
- Why it seems to work this way: Exercise/expiration in CDM is modeled with nested date/time/business-center pieces; mapping splits and assigns the corresponding FpML pieces into those CDM fields.
- Example files:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex16-one-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Caveats:
  - Business center/timezone handling is consistent in examples but may require further rules for edge cases (e.g., missing time or multiple business centers).

### Rule RULE-005: Payment amounts -> CDM quantities (value + currency unit)

- Strength: `moderate recurring pattern`
- Evidence count: `4` examples
- Source pattern: `exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries)`
- Target pattern: `trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units)`
- Explanation: Each FpML paymentAmount (amount + currency) is converted to a CDM quantity with numeric value and currency unit.
- Why it seems to work this way: CDM models cash/economic amounts as quantities with explicit units; mapping populates value and currency subfields from FpML paymentAmount.
- Example files:
  - `fx-derivatives/fx-ex01-fx-spot.xml`
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex07-non-deliverable-forward.xml`
- Caveats:
  - When FpML uses splitSettlement or multiple paymentAmount entries some CDM examples aggregate or merge them into a single quantity.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Resolve party hrefs -> CDM party references and roles

- Type: `reference resolution`
- Description: FpML party references (hrefs) are resolved into CDM party objects and assigned CDM roles (Party1/Party2 labels appear in CDM).
- Source side: `partyReference hrefs and buyer/seller/payer/receiver references (FpML)`
- Target side: `CDM party references with party roles (e.g., Party1/Party2) used in buyerSeller and payout sections`
- Evidence count: `8`
- Example files:
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
  - `fx-derivatives/fx-ex08-fx-swap.xml`
  - `fx-derivatives/fx-ex11-non-deliverable-option.xml`
  - `fx-derivatives/fx-ex12-fx-barrier-option.xml`
  - `fx-derivatives/fx-ex13-fx-dbl-barrier-option.xml`
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
- Notes:
  - Examples show consistent resolution of hrefs into CDM party objects but also show apparent inversions of buyer/seller roles (CDM Party1 vs FpML party2) in several cases.
  - Mapping logic for deriving Party1/Party2 labels from FpML hrefs is not explicit in examples.

### Transformation TR-002: Date normalization (trim trailing 'Z')

- Type: `normalization`
- Description: Remove trailing UTC designator 'Z' from trade/tradedate/time values when copying into CDM date.value.
- Source side: `tradeHeader.tradeDate (FpML, may include 'Z')`
- Target side: `trade.tradedate.value (CDM, ISO date without 'Z')`
- Evidence count: `7`
- Example files:
  - `fx-derivatives/fx-ex03-fx-fwd.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
  - `fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml`
- Notes:
  - Examples show consistent trimming of trailing 'Z' to produce plain date strings.
  - No examples show alternative timezone conversion behavior.

### Transformation TR-003: Expiry date/time/businessCenter -> exerciseTerms.expiration

- Type: `normalization`
- Description: Map expiry date, time and business center into CDM exerciseTerms.expiration fields and associated time components.
- Source side: `expirydatetime.expiryDate and expiryTime and businessCenter (FpML)`
- Target side: `adjustableDate.adjustedDate.value and exerciseterms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM)`
- Evidence count: `4`
- Example files:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex16-one-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Notes:
  - High-confidence mapping in examples; business center and time components are preserved in CDM exerciseTerms.

### Transformation TR-004: PaymentAmount -> Quantity mapping

- Type: `normalization`
- Description: Convert each FpML paymentAmount (amount + currency) into a CDM quantity with value and currency unit.
- Source side: `exchangedCurrencyX.paymentAmount.amount and .currency (FpML)`
- Target side: `trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM)`
- Evidence count: `4`
- Example files:
  - `fx-derivatives/fx-ex01-fx-spot.xml`
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex07-non-deliverable-forward.xml`
- Notes:
  - When multiple paymentAmount/splitSettlement entries exist, examples show aggregation/merge into single CDM quantity in some cases.

### Transformation TR-005: ExchangeRate + quoted pair -> Price assembly

- Type: `normalization`
- Description: Assemble CDM price object from FpML exchangeRate rate and quotedCurrencyPair (unit and perUnitOf currencies).
- Source side: `exchangeRate.rate and quotedCurrencyPair.currency1/currency2 (FpML)`
- Target side: `price.value.value, price.unit.currency.value, price.perUnitOf.currency.value (CDM)`
- Evidence count: `3`
- Example files:
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex08-fx-swap.xml`
- Notes:
  - Mapping sometimes relies on interpreting quoteBasis or strikeQuoteBasis to decide which currency is the unit versus perUnitOf.

### Transformation TR-006: Split/Multiple settlement entries -> aggregated quantity

- Type: `merge`
- Description: When FpML includes splitSettlement entries or multiple payment legs, the mapping sometimes merges these into a single CDM quantity or aggregates tradeLot entries.
- Source side: `splitSettlement / multiple paymentAmount entries (FpML)`
- Target side: `single trade.tradeLot.quantity or aggregated quantity entries (CDM)`
- Evidence count: `2`
- Example files:
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
- Notes:
  - Examples show merged results but do not document the aggregation logic for all split cases (e.g., rounding, ordering, or omission of sub-fields).

### 6.3 Tentative and emerging signals

### TENT-001: mapping

- Strength: `moderate recurring pattern`
- Description: Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.
- Evidence count: `11`
- Example files:
  - `fx-derivatives/fx-ex01-fx-spot.xml`
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex03-fx-fwd.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex08-fx-swap.xml`
  - `fx-derivatives/fx-ex09-euro-opt.xml`
  - `fx-derivatives/fx-ex11-non-deliverable-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
  - `fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: tradeIds copied
  - Representative note: tradeId mapped to CDM assignedIdentifier.value
  - Representative note: FpML tradeId -> CDM assignedIdentifier

### TENT-002: enrichment

- Strength: `moderate recurring pattern`
- Description: Generated identifiers or defaults repeatedly appear under partyid.identifier.value.
- Evidence count: `7`
- Example files:
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: LEI identifiers present in CDM not in FpML
  - Representative note: LEI identifiers present in CDM but not in FpML
  - Representative note: LEI values present in CDM but not in FpML

### TENT-003: transformation

- Strength: `moderate recurring pattern`
- Description: Normalization repeatedly reshapes trade.tradeheader.tradedate into trade.tradedate.value.
- Evidence count: `7`
- Example files:
  - `fx-derivatives/fx-ex03-fx-fwd.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
  - `fx-derivatives/td-ex02-term-deposit-w-settlement-etc.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: removed trailing 'Z' from date
  - Representative note: trimmed trailing Z from date
  - Representative note: Stripped trailing 'Z' to produce date '2001-11-12'.

### TENT-004: mapping

- Strength: `moderate recurring pattern`
- Description: Option-specific terms repeatedly map from trade.fxdigitaloption.producttype into value.name.value.
- Evidence count: `5`
- Example files:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex16-one-touch-option.xml`
  - `fx-derivatives/fx-ex17-no-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: Product type maps to CDM taxonomy name.
  - Confidence mix includes high.
  - Representative note: product type normalized to taxonomy name

### TENT-005: mapping

- Strength: `moderate recurring pattern`
- Description: Date-like fields repeatedly normalize from expirydatetime.expirytime.businesscenter|expirydatetime.expirytime.hourminutetime|fxdigitaloption.expirydatetime.expirydate into adjustabledate.adjusteddate.value|exerciseterms.expirationtime.hourminutetime|expirationtime.businesscenter.value.
- Evidence count: `4`
- Example files:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex16-one-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Expiry date/time and business center map to exerciseTerms expiration.
  - Representative note: expiry date and time normalized into exerciseTerms
  - Representative note: expiry date, time, center map to exercise expiration fields

### TENT-006: mapping

- Strength: `moderate recurring pattern`
- Description: Economic terms repeatedly reshape from exchangedcurrency1.paymentamount.amount|exchangedcurrency1.paymentamount.currency|exchangedcurrency2.paymentamount.amount|exchangedcurrency2.paymentamount.currency into quantity.value.value|unit.currency.value.
- Evidence count: `4`
- Example files:
  - `fx-derivatives/fx-ex01-fx-spot.xml`
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex07-non-deliverable-forward.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: payment amounts to quantities
  - Representative note: Each paymentAmount mapped to a CDM quantity entry
  - Representative note: FpML paymentAmount amounts and currencies -> CDM quantities with currency units

### TENT-007: mapping

- Strength: `moderate recurring pattern`
- Description: Economic terms repeatedly reshape from exchangerate.quotedcurrencypair.currency1|exchangerate.quotedcurrencypair.currency2|fxsingleleg.exchangerate.rate into perunitof.currency.value|price.value.value|unit.currency.value.
- Evidence count: `3`
- Example files:
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex08-fx-swap.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: exchangeRate and quoted pair -> price value and unit/perUnitOf
  - Representative note: FpML exchangeRate rate and currency pair -> CDM price value and perUnitOf currencies
  - Representative note: rate -> price value; quoted currencies -> unit/perUnitOf

### TENT-008: mapping

- Strength: `moderate recurring pattern`
- Description: FpML exchange rate entries and the quoted currency pair are used to create a CDM price object with numeric price and unit/perUnitOf currencies. (exchangeRate.quotedCurrencyPair.currency1|currency2 and fxSingleLeg.exchangeRate.rate (FpML) -> price.value.value and price.unit.currency.value and price.perUnitOf.currency.value (CDM price value, unit and perUnitOf))
- Evidence count: `3`
- Example files:
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml`
  - `fx-derivatives/fx-ex08-fx-swap.xml`
- Notes:
  - CDM separates price value and the two currencies involved (unit and perUnitOf); mapping derives these from the FpML rate and quotedCurrencyPair.
  - Mapping sometimes requires interpreting quoteBasis/strikeQuoteBasis to decide which currency is unit vs perUnitOf; examples show consistent but slightly different interpretations.

### TENT-009: enrichment

- Strength: `moderate recurring pattern`
- Description: Metadata-like enrichments repeatedly appear under name.meta.scheme.
- Evidence count: `3`
- Example files:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex17-no-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: Taxonomy scheme added in CDM not present in FpML.
  - Confidence mix includes high.
  - Representative note: Taxonomy scheme added in CDM, not present in FpML.

### 6.4 Folder-level principles

- Preserve primary trade identifiers: FpML tradeId values are retained in CDM assignedIdentifier entries for traceability.
- Represent monetary amounts as CDM quantities: each FpML paymentAmount (amount + currency) becomes a CDM quantity with value and currency unit.
- Assemble price from rate + quoted currency pair: exchangeRate rate plus quotedCurrencyPair determine CDM price.value and the two currencies (unit/perUnitOf).
- Normalize dates/times: FpML date/time strings are normalized (examples trim trailing 'Z') when placed into CDM date/value/time fields.
- Map option expiry components into CDM exerciseTerms: expiry date, optional time and business center map to exerciseTerms.expiration elements.
- Mapping may include enrichments: CDM often contains added metadata (taxonomy schemes) and generated party identifiers when absent in FpML.

### 6.5 Variants and exceptions

### Variant VAR-001: AssignedIdentifier.scheme differences

- Description: AssignedIdentifier.scheme used in CDM sometimes differs from the tradeIdScheme present (or absent) in FpML examples.
- Seen in:
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex08-fx-swap.xml`
- Impact on generalization: Do not assume the scheme string is copied verbatim; mapping may normalize, override, or supplement scheme values.

### Variant VAR-002: Buyer/Seller role inversion

- Description: Several CDM examples show buyer/seller or payer/receiver roles appearing inverted compared to the FpML buyerPartyReference/sellerPartyReference hrefs.
- Seen in:
  - `fx-derivatives/fx-ex11-non-deliverable-option.xml`
  - `fx-derivatives/fx-ex12-fx-barrier-option.xml`
  - `fx-derivatives/fx-ex13-fx-dbl-barrier-option.xml`
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
- Impact on generalization: Role mapping cannot be safely generalized without clarifying the rule used to derive CDM Party1/Party2 from FpML hrefs; treat buyer/seller polarity as tentative in mappings.

### Variant VAR-003: Duplicated tradeIdentifier entries

- Description: Some CDM outputs contain more tradeIdentifier entries than FpML tradeId elements (duplicates or additional identifiers).
- Seen in:
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
- Impact on generalization: Avoid assuming a 1:1 correspondence between FpML tradeId elements and CDM tradeIdentifier list; additional identifiers may be added or duplicated during mapping.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: Generated/default party identifiers appear under partyid.identifier.value

- Description: CDM representations frequently include LEI-like or other identifier values for parties even when the FpML example does not contain them. CDM party model expects canonical identifiers; mappings populate these fields with generated defaults or externally-sourced identifiers when not present in FpML.
- Classification: `suspected enrichment`
- Evidence:
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
- Caution:
  - Source of the LEI or generated identifier is not present in the FpML examples and appears to be an enrichment from an external source or mapping rule.
  - Not all parties receive such generated identifiers in every example.
  - Do not treat Generated/default party identifiers appear under partyid.identifier.value as a guaranteed direct mapping rule yet.

### Enrichment ENR-002: Party LEI or generated identifiers inserted

- Description: CDM examples include LEI-like party identifiers or other generated identifier values where FpML does not provide them.
- Classification: `suspected enrichment`
- Evidence:
  - `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml`
  - `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml`
  - `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml`
  - `fx-derivatives/fx-ex15-euro-range-digital-option.xml`
  - `fx-derivatives/fx-ex22-straddle.xml`
  - `fx-derivatives/fx-ex23-delta-hedge.xml`
  - `fx-derivatives/td-ex01-simple-term-deposit.xml`
- Caution:
  - Source of these identifiers is not visible in FpML examples; they may come from an external reference data feed or internal generation policy.
  - Treat mappings that rely on LEI presence as enriched and verify with source of truth if precise LEI data is required.

### Enrichment ENR-003: Metadata taxonomy scheme enrichment under name.meta.scheme

- Description: CDM entries include a taxonomy scheme field under name.meta.scheme even when FpML does not provide an explicit scheme value. CDM product/name representation includes metadata about taxonomy scheme; mapping populates a scheme value (enrichment) to conform to CDM metadata expectations.
- Classification: `suspected enrichment`
- Evidence:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex17-no-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Caution:
  - The exact scheme value used in CDM is not present in FpML and appears to be added during mapping; scheme choice rationale is not documented in the examples.
  - Do not treat Metadata taxonomy scheme enrichment under name.meta.scheme as a guaranteed direct mapping rule yet.

### Enrichment ENR-004: Product type normalization -> taxonomy name and meta.scheme enrichment

- Description: Normalize productType strings and add taxonomy scheme metadata under name.meta.scheme in CDM.
- Classification: `suspected enrichment`
- Evidence:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex17-no-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Caution:
  - Both normalization of the product name and insertion of a taxonomy scheme are observed; the scheme value appears to be an added enrichment rather than copied from FpML.
  - Do not treat Product type normalization -> taxonomy name and meta.scheme enrichment as a reusable direct mapping transformation yet.

### Enrichment ENR-005: Taxonomy scheme metadata added under name.meta.scheme

- Description: CDM includes a taxonomy scheme metadata element under name.meta.scheme even when FpML lacks an explicit scheme.
- Classification: `suspected enrichment`
- Evidence:
  - `fx-derivatives/fx-ex14-euro-digital-option.xml`
  - `fx-derivatives/fx-ex17-no-touch-option.xml`
  - `fx-derivatives/fx-ex18-double-one-touch-option.xml`
- Caution:
  - Scheme selection rationale is not shown; different mapping implementations might choose different taxonomy scheme values.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 25/25 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 25/25 successful or salvaged pair analyses (25 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: header, party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements) -> trade.tradeIdentifier.assignedIdentifier.identifier.value (CDM assignedIdentifier.value): FpML tradeId values are repeatedly copied into CDM assignedIdentifier.identifier.value preserving the trade identifier value (often with an associated scheme).
- trade.tradeHeader.tradeDate (FpML with timezone 'Z') -> trade.tradeDate.value (CDM normalized ISO date without trailing 'Z'): Dates copied from FpML have their trailing 'Z' (UTC designator) trimmed in CDM date.value fields to produce a plain date string.
- trade.fxdigitaloption.productType (FpML productType strings) -> trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name): FpML product type labels (e.g., 'Euro Binary') are normalized and mapped into a CDM taxonomy name value (e.g., 'EuroBinary').
- expiryDateTime.expiryDate and expiryTime (FpML) and businessCenter fields -> adjustableDate.adjustedDate.value and exerciseTerms.expirationTime.hourMinuteTime and expirationTime.businessCenter.value (CDM exerciseTerms.expiration): Expiry-related fields in FpML (date, time, business center) are reshaped into CDM exerciseTerms.expiration components and time fields.
- exchangedCurrencyX.paymentAmount.amount and .currency (FpML paymentAmount entries) -> trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units): Each FpML paymentAmount (amount + currency) is converted to a CDM quantity with numeric value and currency unit.
- Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value. [tentative 11 examples]

### Transformation Patterns

- reference resolution: FpML party references (hrefs) are resolved into CDM party objects and assigned CDM roles (Party1/Party2 labels appear in CDM).
- normalization: Remove trailing UTC designator 'Z' from trade/tradedate/time values when copying into CDM date.value.
- normalization: Map expiry date, time and business center into CDM exerciseTerms.expiration fields and associated time components.
- normalization: Convert each FpML paymentAmount (amount + currency) into a CDM quantity with value and currency unit.
- normalization: Assemble CDM price object from FpML exchangeRate rate and quotedCurrencyPair (unit and perUnitOf currencies).
- merge: When FpML includes splitSettlement entries or multiple payment legs, the mapping sometimes merges these into a single CDM quantity or aggregates tradeLot entries.

### Product-Specific Branches

### fx-ex01-fx-spot.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - exchange rate copied
  - payment amounts to quantities
  - tradeIds copied
- Cautions:
  - Source of party LEI values missing in FpML
  - Payer/receiver roles appear inverted between FpML and CDM

### fx-ex02-spot-cross-w-side-rates.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - tradeId mapped to CDM assignedIdentifier.value
  - exchangedCurrency1 amount and currency -> quantity[0]
  - exchangeRate and quoted pair -> price value and unit/perUnitOf
- Cautions:
  - Why does CDM 'Party1' reference FpML 'party2'?
  - Are CDM LEI identifiers sourced externally?

### fx-ex03-fx-fwd.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - FpML tradeId -> CDM assignedIdentifier
  - payment amounts -> CDM quantities
  - rate -> price; spotRate+forwardPoints -> composite
- Cautions:
  - Why are payer/receiver roles in CDM reversed relative to FpML hrefs?
  - Why are some tradeIdentifier entries duplicated in CDM for same tradeId?

### fx-ex04-fx-fwd-w-settlement.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - TradeId FWD123 copied with scheme
  - TradeId FXD2002987 copied with scheme
  - Each paymentAmount mapped to a CDM quantity entry
  - Rate and quote pair normalized to price with unit/perUnitOf
- Cautions:
  - How were CDM party role labels Party1/Party2 derived from FpML party hrefs?

### fx-ex05-fx-fwd-w-ssi.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - FpML tradeId ABN1234 -> CDM tradeIdentifier assignedIdentifier value
  - FpML paymentAmount amounts and currencies -> CDM quantities with currency units
  - FpML exchangeRate rate and currency pair -> CDM price value and perUnitOf currencies
- Cautions:
  - Which fxSingleLeg exchangedCurrency maps to SettlementPayout.payerReceiver?
  - Why CDM repeats assignedIdentifier entries for same tradeIds?

### fx-ex06-fx-fwd-w-splits.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - trade id and scheme mapped
  - Z trimmed to ISO date
  - rate and currency sides mapped
  - split amounts aggregated to single quantity
- Cautions:
  - Are splitSettlement beneficiary bank routing details intentionally omitted?

### Validation Checks

- Check unresolved question: What is the authoritative source for the LEI / generated party identifiers present in CDM when absent from FpML?
- Check unresolved question: Why do buyer/seller (payer/receiver) roles appear inverted between FpML hrefs and CDM Party1/Party2 in multiple examples?
- Check unresolved question: How are CDM Party1/Party2 labels derived deterministically from FpML party references (what rule maps party hrefs to Party1 vs Party2)?
- Check unresolved question: Why are some tradeIdentifier entries duplicated or augmented in CDM for a single FpML tradeId?
- Check unresolved question: What logic determines when multiple FpML splitSettlement/paymentAmount entries are merged into a single CDM quantity versus preserved separately?
- Check unresolved question: How is assignedIdentifier.scheme chosen or normalized when it differs from the FpML tradeId scheme?

### Do Not Assume

- Do not treat Generated/default party identifiers appear under partyid.identifier.value as a guaranteed direct mapping rule yet.
- Do not treat Party LEI or generated identifiers inserted as a guaranteed direct mapping rule yet.
- Do not treat Metadata taxonomy scheme enrichment under name.meta.scheme as a guaranteed direct mapping rule yet.
- Do not treat Product type normalization -> taxonomy name and meta.scheme enrichment as a guaranteed direct mapping rule yet.
- Do not treat Taxonomy scheme metadata added under name.meta.scheme as a guaranteed direct mapping rule yet.
- Source of party LEI values missing in FpML

## 8. Pair-Level Worked Examples

- Showing the top `10` worked examples in markdown; the full `25` remain in the JSON and debug artifacts.
### `fx-derivatives/fx-ex01-fx-spot.xml` -> `fx-derivatives/fx-ex01-fx-spot.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - exchange rate copied
  - payment amounts to quantities
  - tradeIds copied
- Most important transformation:
  - strip trailing 'Z' from dates
- Uncertainty:
  - Source of party LEI values missing in FpML
  - Payer/receiver roles appear inverted between FpML and CDM

### `fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml` -> `fx-derivatives/fx-ex02-spot-cross-w-side-rates.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - tradeId mapped to CDM assignedIdentifier.value
  - exchangedCurrency1 amount and currency -> quantity[0]
  - exchangeRate and quoted pair -> price value and unit/perUnitOf
- Most important transformation:
  - hrefs resolved to CDM payer/receiver via counterparty references
- Uncertainty:
  - Why does CDM 'Party1' reference FpML 'party2'?
  - Are CDM LEI identifiers sourced externally?

### `fx-derivatives/fx-ex03-fx-fwd.xml` -> `fx-derivatives/fx-ex03-fx-fwd.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML tradeId -> CDM assignedIdentifier
  - payment amounts -> CDM quantities
  - rate -> price; spotRate+forwardPoints -> composite
- Most important transformation:
  - removed trailing 'Z' from date
- Uncertainty:
  - Why are payer/receiver roles in CDM reversed relative to FpML hrefs?
  - Why are some tradeIdentifier entries duplicated in CDM for same tradeId?

### `fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml` -> `fx-derivatives/fx-ex04-fx-fwd-w-settlement.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - TradeId FWD123 copied with scheme
  - TradeId FXD2002987 copied with scheme
  - Each paymentAmount mapped to a CDM quantity entry
  - Rate and quote pair normalized to price with unit/perUnitOf
- Most important transformation:
  - Combine rate and quoteBasis into price unit/perUnitOf
- Uncertainty:
  - How were CDM party role labels Party1/Party2 derived from FpML party hrefs?

### `fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml` -> `fx-derivatives/fx-ex05-fx-fwd-w-ssi.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - FpML tradeId ABN1234 -> CDM tradeIdentifier assignedIdentifier value
  - FpML paymentAmount amounts and currencies -> CDM quantities with currency units
  - FpML exchangeRate rate and currency pair -> CDM price value and perUnitOf currencies
- Most important transformation:
  - Spot and forwardPoints stored as composite; rate stored as price value
- Uncertainty:
  - Which fxSingleLeg exchangedCurrency maps to SettlementPayout.payerReceiver?
  - Why CDM repeats assignedIdentifier entries for same tradeIds?

### `fx-derivatives/fx-ex06-fx-fwd-w-splits.xml` -> `fx-derivatives/fx-ex06-fx-fwd-w-splits.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - trade id and scheme mapped
  - Z trimmed to ISO date
  - rate and currency sides mapped
  - split amounts aggregated to single quantity
- Most important transformation:
  - merged splitSettlement entries into one quantity
- Uncertainty:
  - Are splitSettlement beneficiary bank routing details intentionally omitted?

### `fx-derivatives/fx-ex07-non-deliverable-forward.xml` -> `fx-derivatives/fx-ex07-non-deliverable-forward.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - payment amounts and currencies mapped to quantities
  - exchangeRate.rate -> price value
  - valueDate normalized to CDM date
- Most important transformation:
  - spotRate + forwardPoints -> composite baseValue and operand
- Uncertainty:
  - Why does CDM contain duplicate tradeIdentifier entries for PARTYA345?

### `fx-derivatives/fx-ex08-fx-swap.xml` -> `fx-derivatives/fx-ex08-fx-swap.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - GBP 10000000 -> tradeLot quantity value and currency
  - rate -> price value; quoted currencies -> unit/perUnitOf
  - tradeId DEUTDEFF -> tradeIdentifier assignedIdentifier
  - fxSingleLeg valueDate -> payout settlementDate
- Most important transformation:
  - two fxSingleLegs -> two payouts and two tradeLot priceQuantity entries
- Uncertainty:
  - Why assignedIdentifier scheme differs from FpML tradeIdScheme?
  - How party role Party1/Party2 derived from partyReferences?

### `fx-derivatives/fx-ex09-euro-opt.xml` -> `fx-derivatives/fx-ex09-euro-opt.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - tradeId mapped to CDM assignedIdentifier value
  - premium amount/currency/date to transfer record
  - rate and basis normalized into strike structure
- Most important transformation:
  - compose rate and basis into nested strike object
- Uncertainty:
  - How are FpML party hrefs (party1/party2) mapped to CDM externalReference partyX/partyY?

### `fx-derivatives/fx-ex10-amer-opt.xml` -> `fx-derivatives/fx-ex10-amer-opt.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - trade date copied to CDM tradeDate
  - buyer/seller mapped to buyerSeller
  - rate and currencies combined into strike object
- Most important transformation:
  - assemble strike price from rate and currencies
- Uncertainty:
  - Why is OptionPayout.payerReceiver payer Party2 while fxOptionPremium.payerPartyReference is party1?
  - Why CDM has duplicate tradeIdentifier entries with same assignedIdentifier?

## 9. Open Questions And Risks

- What is the authoritative source for the LEI / generated party identifiers present in CDM when absent from FpML?
- Why do buyer/seller (payer/receiver) roles appear inverted between FpML hrefs and CDM Party1/Party2 in multiple examples?
- How are CDM Party1/Party2 labels derived deterministically from FpML party references (what rule maps party hrefs to Party1 vs Party2)?
- Why are some tradeIdentifier entries duplicated or augmented in CDM for a single FpML tradeId?
- What logic determines when multiple FpML splitSettlement/paymentAmount entries are merged into a single CDM quantity versus preserved separately?
- How is assignedIdentifier.scheme chosen or normalized when it differs from the FpML tradeId scheme?
- Which fxSingleLeg exchangedCurrency (or leg) in FpML maps to SettlementPayout.payerReceiver in CDM when mapping payouts?

## 10. Draft Conclusion

- Most reusable findings:
  - FpML tradeId values are routinely preserved in CDM assignedIdentifier.identifier.value - use this as the primary linkage point.
  - Monetary amounts in FpML paymentAmount entries reliably map to CDM quantities (value + currency unit).
  - Exchange rates plus quoted currency pairs are consistently assembled into CDM price objects (price.value + unit/perUnitOf).
  - Dates are normalized (examples trim trailing 'Z') when mapped into CDM date/time fields.
- What seems safe to generalize:
  - Copying tradeId into CDM assignedIdentifier.value for traceability.
  - Mapping paymentAmount amount+currency -> CDM quantity value+unit.
  - Assembling CDM price from exchangeRate rate and quotedCurrencyPair currencies.
  - Normalizing date strings by trimming trailing 'Z' when producing CDM date.value.
- What should remain tentative:
  - Derivation of CDM party role labels (Party1/Party2) from FpML party hrefs - examples show inconsistent inversions.
  - Source and reliability of party LEI or generated identifiers included in CDM (likely enrichment).
  - Rules that create additional or duplicate tradeIdentifier entries in CDM.
  - Precise aggregation rules used when merging splitSettlement/multiple paymentAmount entries into one CDM quantity.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `25`
- Successful semantic pair count: `25`
- Full semantic pair count: `25`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `0`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 25
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 25
  - Tentative repeated semantic signals: 8
