# FPML -> CDM Cookbook: fx-derivatives

## Status

- Operational status: ready
- Agent use policy: Agents may apply these rules during normal FPML to CDM proposal generation.
- Semantic success rate: 100%
- Draft quality: strong
- Draft publication: success

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
- When to apply: The FpML document contains tradeHeader.partyTradeIdentifier.tradeId elements.
- Source signals to inspect: tradeHeader.partyTradeIdentifier.tradeId (FpML tradeId elements).
- CDM target to propose: trade.tradeIdentifier.assignedIdentifier.identifier.value (assignedIdentifier.value); scheme may be present but is variant-prone.
- How to validate: Verify each FpML tradeId value appears in a CDM assignedIdentifier.identifier.value. Check for unexpected duplicates or added identifiers and record rationale if present.
- When not to apply: No tradeId present in source.
- Exceptions and analyst review triggers: Differences in scheme and cases with more CDM identifiers than FpML tradeIds require review.
- Evidence: fx-derivatives:RULE-001

### Trade date normalization (remove trailing 'Z')
- When to apply: The FpML tradeHeader.tradeDate includes a timezone marker 'Z'.
- Source signals to inspect: trade.tradeHeader.tradeDate.
- CDM target to propose: trade.tradeDate.value as a plain date string (no trailing 'Z').
- How to validate: Confirm the date value matches the FpML date, with only the trailing 'Z' removed. Ensure no timezone semantics needed elsewhere.
- When not to apply: No trailing 'Z' present; non-dateTime fields.
- Exceptions and analyst review triggers: If timezone is economically significant or additional time components exist not covered by examples.
- Evidence: fx-derivatives:RULE-002

### Option product type -> CDM taxonomy name
- When to apply: The product is an FX digital/option with trade.fxdigitaloption.productType populated.
- Source signals to inspect: trade.fxdigitaloption.productType (string label).
- CDM target to propose: trade.product.taxonomyName.value (or value.name.value) with normalized taxonomy string.
- How to validate: Confirm normalized product type string logically corresponds to the FpML label in examples.
- When not to apply: Non-option products or missing productType.
- Exceptions and analyst review triggers: Unseen or ambiguous labels; normalization beyond examples.
- Evidence: fx-derivatives:RULE-003

### Expiry date/time/businessCenter -> exerciseTerms.expiration
- When to apply: FpML includes expiryDateTime.expiryDate and expiryTime plus businessCenter.
- Source signals to inspect: expiryDateTime.expiryDate; expiryDateTime.expiryTime.hourMinuteTime; expiryDateTime.expiryTime.businessCenter.
- CDM target to propose: adjustableDate.adjustedDate.value; exerciseTerms.expirationTime.hourMinuteTime; expirationTime.businessCenter.value.
- How to validate: Verify date, time, and business center in CDM match FpML values without unintended timezone loss.
- When not to apply: Expiry components absent.
- Exceptions and analyst review triggers: Multiple centers, missing time, or timezone conversions.
- Evidence: fx-derivatives:RULE-004

### Payment amounts -> CDM quantities (value + currency unit)
- When to apply: FpML exchangedCurrencyX.paymentAmount.amount and .currency are present.
- Source signals to inspect: exchangedCurrency1/2.paymentAmount.amount; exchangedCurrency1/2.paymentAmount.currency.
- CDM target to propose: trade.tradeLot.quantity.value; trade.tradeLot.quantity.unit.currency.value.
- How to validate: Amount numeric value and currency unit match FpML; sign/scale preserved.
- When not to apply: Missing paymentAmount.
- Exceptions and analyst review triggers: splitSettlement or multiple paymentAmount entries; aggregation behavior varies in examples.
- Evidence: fx-derivatives:RULE-005

## Transformations

### Resolve party hrefs -> CDM party references and roles
- When to apply: partyReference hrefs and buyer/seller/payer/receiver references are present.
- Source signals to inspect: buyerPartyReference/sellerPartyReference; payer/receiver references; party/@id and references.
- CDM target to propose: Resolved CDM party references with Party1/Party2 roles used in buyerSeller and payout sections.
- How to validate: Check each href resolves to the correct CDM party; verify directionality against FpML context.
- When not to apply: No party references/hrefs.
- Exceptions and analyst review triggers: Observed inversions between FpML buyer/seller and CDM Party1/Party2; clarify role mapping.
- Evidence: fx-derivatives:TR-001

### Date normalization (trim trailing 'Z')
- When to apply: tradeHeader.tradeDate includes 'Z'.
- Source signals to inspect: tradeHeader.tradeDate.
- CDM target to propose: trade.tradedate.value without trailing 'Z'.
- How to validate: Date value matches FpML date sans 'Z'.
- When not to apply: No 'Z' present or non-date value.
- Evidence: fx-derivatives:TR-002

### Expiry date/time/businessCenter -> exerciseTerms.expiration
- When to apply: expirydatetime has date, time, and business center.
- Source signals to inspect: expirydatetime.expiryDate; expirydatetime.expiryTime.hourMinuteTime; expirydatetime.expiryTime.businessCenter.
- CDM target to propose: adjustableDate.adjustedDate.value; exerciseterms.expirationTime.hourMinuteTime; expirationTime.businessCenter.value.
- How to validate: Field-by-field equality with FpML values.
- Evidence: fx-derivatives:TR-003

### PaymentAmount -> Quantity mapping
- When to apply: exchangedCurrencyX.paymentAmount elements exist.
- Source signals to inspect: paymentAmount.amount and .currency.
- CDM target to propose: trade.tradeLot.quantity.value; trade.tradeLot.quantity.unit.currency.value.
- How to validate: Numeric and currency unit parity; sign/scale preserved.
- Exceptions and analyst review triggers: Aggregation observed in split/multiple payments; confirm business intent.
- Evidence: fx-derivatives:TR-004

### ExchangeRate + quoted pair -> Price assembly
- When to apply: fxSingleLeg.exchangeRate.rate and quotedCurrencyPair.currency1/currency2 present.
- Source signals to inspect: exchangeRate.rate; quotedCurrencyPair.currency1; quotedCurrencyPair.currency2; quoteBasis/strikeQuoteBasis if available.
- CDM target to propose: price.value.value; price.unit.currency.value; price.perUnitOf.currency.value.
- How to validate: Price numeric equals FpML rate; unit/perUnitOf currencies match quoted pair per examples.
- Exceptions and analyst review triggers: Requires interpreting quoteBasis/strikeQuoteBasis; confirm polarity.
- Evidence: fx-derivatives:TR-005

### Split/Multiple settlement entries -> aggregated quantity
- When to apply: FpML includes splitSettlement or multiple paymentAmount entries.
- Source signals to inspect: splitSettlement blocks; repeated paymentAmount elements.
- CDM target to propose: Single trade.tradeLot.quantity or aggregated quantities per observed examples.
- How to validate: Aggregation logic documented; amounts/currencies preserved; no unintended rounding.
- Exceptions and analyst review triggers: Aggregation rules not fully documented; confirm with analyst.
- Evidence: fx-derivatives:TR-006

## Variants And Branches

### AssignedIdentifier.scheme differences
- Use only when: AssignedIdentifier.scheme in CDM differs from FpML tradeIdScheme or is absent in FpML.
- Action: Do not assume verbatim copy of scheme; treat as variant requiring review or normalization logic.
- Evidence: fx-derivatives:VAR-001

### Buyer/Seller role inversion
- Use only when: Examples indicate polarity mismatch between FpML buyer/seller hrefs and CDM Party1/Party2.
- Action: Treat buyer/seller polarity as tentative; require analyst confirmation of Party1/Party2 derivation.
- Evidence: fx-derivatives:VAR-002

### Duplicated tradeIdentifier entries
- Use only when: CDM outputs contain more tradeIdentifier entries than FpML tradeId elements.
- Action: Avoid assuming 1:1 mapping; flag additional/duplicate identifiers for review.
- Evidence: fx-derivatives:VAR-003

## Enrichment And Defaults

- Generated/default party identifiers (e.g., LEI-like) under partyid.identifier.value appear as enrichments; do not generate without source-backed approval. Evidence: fx-derivatives:ENR-001, fx-derivatives:ENR-002
- Taxonomy scheme metadata under name.meta.scheme appears added during mapping; treat as enrichment unless source-backed. Evidence: fx-derivatives:ENR-003, fx-derivatives:ENR-004, fx-derivatives:ENR-005

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

## Validation Checklist

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
- Confirm the FPML source contains: exchangedCurrencyX.paymentAmount.amount and .currency (FpML).
- Confirm the proposed CDM representation populates: trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value (CDM quantities with currency units).
- Confirm amount, currency, unit, sign, and scale are preserved in the CDM proposal.
- Confirm the FPML source contains: partyReference hrefs and buyer/seller/payer/receiver references (FpML).
- Confirm the proposed CDM representation populates: CDM party references with party roles (e.g., Party1/Party2) used in buyerSeller and payout sections.
- Confirm the FPML source contains: exchangeRate.rate and quotedCurrencyPair.currency1/currency2 (FpML).
- Confirm the proposed CDM representation populates: price.value.value, price.unit.currency.value, price.perUnitOf.currency.value (CDM).
- Confirm the FPML source contains: splitSettlement / multiple paymentAmount entries (FpML).
- Confirm the proposed CDM representation populates: single trade.tradeLot.quantity or aggregated quantity entries (CDM).
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.

## Worked Examples

### fx-derivatives/fx-ex01-fx-spot.xml -> fx-derivatives/fx-ex01-fx-spot.json
- Source signals: header, trade, party
- CDM proposal guidance: exchange rate copied; payment amounts to quantities; tradeIds copied; strip trailing 'Z' from dates
- Validation: Review uncertainty around party LEI presence and potential payer/receiver inversion

### fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml -> fx-derivatives/fx-ex02-spot-cross-w-side-rates.json
- Source signals: header, trade, party
- CDM proposal guidance: tradeId -> assignedIdentifier.value; exchangedCurrency1 amount+currency -> quantity[0]; exchangeRate+quoted pair -> price unit/perUnitOf; hrefs resolved to payer/receiver
- Validation: Review Party1 referencing FpML party2; confirm any LEI identifiers are source-backed

### fx-derivatives/fx-ex03-fx-fwd.xml -> fx-derivatives/fx-ex03-fx-fwd.json
- Source signals: header, trade, party
- CDM proposal guidance: FpML tradeId -> CDM assignedIdentifier; payment amounts -> CDM quantities; rate -> price; removed trailing 'Z' from date
- Validation: Review any payer/receiver polarity reversal; check for duplicate tradeIdentifier entries

## Source Evidence

- Evidence sidecar: ../references/fx-derivatives.evidence.json