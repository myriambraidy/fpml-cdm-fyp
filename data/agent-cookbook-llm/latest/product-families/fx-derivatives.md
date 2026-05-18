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

1. Start from the repeated FpML sections: header, party, trade. [Applies whenever these sections are present]
2. Map trade identifiers, party references, and trade dates before product-specific economics. [Apply RULE-001, TR-001, RULE-002/TR-002]
3. Apply recurring mapping rules only when the exact source cues appear in the document. [Match source signals exactly as listed under each rule]
4. Apply non-literal transformations that reshape identifiers, dates, wrappers, or references when their source cues are present. [TR-001..TR-006]
5. Assemble the result under repeated CDM scaffolding such as meta, trade. [Do not infer missing structures beyond rule targets]
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise. [ENR-001..ENR-005, TENT-002, TENT-009]

## Stable Rules

- Trade identifier -> assignedIdentifier.value (fx-derivatives:RULE-001)
  - When to apply: When FpML contains tradeHeader.partyTradeIdentifier.tradeId elements. [fx-derivatives:RULE-001]
  - Inspect (FpML): tradeHeader.partyTradeIdentifier.tradeId (value and any associated scheme). [fx-derivatives:RULE-001]
  - Propose to (CDM): trade.tradeIdentifier.assignedIdentifier.identifier.value (and associated scheme if present/consistent). [fx-derivatives:RULE-001]
  - How to validate: Confirm values are copied into CDM assignedIdentifier.identifier.value. Check for any duplication or additional identifiers; record and flag if present. [fx-derivatives:RULE-001, fx-derivatives:VAR-003]
  - Do not apply when: No tradeId is present. [fx-derivatives:RULE-001]
  - Exceptions/Review: Scheme differences or extra identifiers require analyst review. [fx-derivatives:RULE-001, fx-derivatives:VAR-003]

- Trade date normalization (remove trailing 'Z') (fx-derivatives:RULE-002)
  - When to apply: When FpML tradeHeader.tradeDate includes a trailing 'Z' (UTC designator). [fx-derivatives:RULE-002]
  - Inspect (FpML): trade.tradeHeader.tradeDate. [fx-derivatives:RULE-002]
  - Propose to (CDM): trade.tradeDate.value as ISO date without trailing 'Z'. [fx-derivatives:RULE-002]
  - How to validate: Ensure only the trailing 'Z' is trimmed; no timezone semantics needed elsewhere in examples. [fx-derivatives:RULE-002]
  - Do not apply when: No trailing 'Z' is present. [fx-derivatives:RULE-002]
  - Exceptions/Review: If timezone semantics are required downstream, flag for review. [fx-derivatives:RULE-002]

- Option product type -> CDM taxonomy name (fx-derivatives:RULE-003)
  - When to apply: When FpML includes trade.fxdigitaloption.productType. [fx-derivatives:RULE-003]
  - Inspect (FpML): trade.fxdigitaloption.productType label. [fx-derivatives:RULE-003]
  - Propose to (CDM): trade.product.taxonomyName.value or value.name.value with normalized taxonomy string. [fx-derivatives:RULE-003]
  - How to validate: Confirm productType string is normalized consistently with examples. [fx-derivatives:RULE-003]
  - Do not apply when: productType is absent. [fx-derivatives:RULE-003]
  - Exceptions/Review: Any normalization or scheme metadata beyond literal copy requires review. [fx-derivatives:RULE-003]

- Expiry date/time/businessCenter -> exerciseTerms.expiration (fx-derivatives:RULE-004)
  - When to apply: When FpML contains expiryDateTime.expiryDate and expiryTime and businessCenter. [fx-derivatives:RULE-004]
  - Inspect (FpML): expiryDateTime.expiryDate; expiryTime.hourMinuteTime; expiryTime.businessCenter. [fx-derivatives:RULE-004]
  - Propose to (CDM): adjustableDate.adjustedDate.value; exerciseTerms.expirationTime.hourMinuteTime; expirationTime.businessCenter.value. [fx-derivatives:RULE-004]
  - How to validate: All three components (date, time, center) are populated and consistent. [fx-derivatives:RULE-004]
  - Do not apply when: Any of date/time/businessCenter is missing; handle as tentative or flag. [fx-derivatives:RULE-004]
  - Exceptions/Review: Edge cases like multiple centers or missing time require review. [fx-derivatives:RULE-004]

- Payment amounts -> CDM quantities (value + currency unit) (fx-derivatives:RULE-005)
  - When to apply: When FpML has exchangedCurrencyX.paymentAmount.amount and .currency. [fx-derivatives:RULE-005]
  - Inspect (FpML): exchangedCurrency1/2.paymentAmount.amount and .currency; presence of splitSettlement. [fx-derivatives:RULE-005]
  - Propose to (CDM): trade.tradeLot.quantity.value and trade.tradeLot.quantity.unit.currency.value. [fx-derivatives:RULE-005]
  - How to validate: Numeric value and currency unit copied; sign/scale preserved. [fx-derivatives:RULE-005]
  - Do not apply when: paymentAmount fields are absent. [fx-derivatives:RULE-005]
  - Exceptions/Review: Multiple/split settlements may be aggregated; confirm behavior and flag if merged. [fx-derivatives:RULE-005, fx-derivatives:TR-006]

## Transformations

- Resolve party hrefs -> CDM party references and roles (fx-derivatives:TR-001)
  - When to apply: When partyReference hrefs and buyer/seller/payer/receiver references exist in FpML. [fx-derivatives:TR-001]
  - Inspect (FpML): partyReference hrefs; buyer/seller; payer/receiver. [fx-derivatives:TR-001]
  - Propose to (CDM): CDM party references with party roles (Party1/Party2) used in buyerSeller and payout sections. [fx-derivatives:TR-001]
  - How to validate: Verify references resolve and roles are consistent with economic direction. [fx-derivatives:TR-001]
  - Exceptions/Review: Evidence shows potential buyer/seller inversion; require review of polarity. [fx-derivatives:TR-001, fx-derivatives:VAR-002]

- Date normalization (trim trailing 'Z') (fx-derivatives:TR-002)
  - When to apply: When tradeHeader.tradeDate includes trailing 'Z'. [fx-derivatives:TR-002]
  - Inspect (FpML): tradeHeader.tradeDate. [fx-derivatives:TR-002]
  - Propose to (CDM): trade.tradedate.value without 'Z'. [fx-derivatives:TR-002]
  - Validate/Review: Ensure only the trailing 'Z' is removed. [fx-derivatives:TR-002]

- Expiry date/time/businessCenter -> exerciseTerms.expiration (fx-derivatives:TR-003)
  - When to apply: When expiry date, time, and business center are provided. [fx-derivatives:TR-003]
  - Inspect (FpML): expirydatetime.expiryDate, expiryTime.hourMinuteTime, expiryTime.businessCenter. [fx-derivatives:TR-003]
  - Propose to (CDM): adjustableDate.adjustedDate.value; exerciseterms.expirationTime.hourMinuteTime; expirationTime.businessCenter.value. [fx-derivatives:TR-003]
  - Validate/Review: Preserve time and business center semantics; flag missing parts. [fx-derivatives:TR-003]

- PaymentAmount -> Quantity mapping (fx-derivatives:TR-004)
  - When to apply: When exchangedCurrencyX.paymentAmount fields exist. [fx-derivatives:TR-004]
  - Inspect (FpML): amount, currency; splitSettlement presence. [fx-derivatives:TR-004]
  - Propose to (CDM): trade.tradeLot.quantity.value; trade.tradeLot.quantity.unit.currency.value. [fx-derivatives:TR-004]
  - Validate/Review: Preserve amount, currency, unit, sign, and scale; review any aggregation. [fx-derivatives:TR-004]

- ExchangeRate + quoted pair -> Price assembly (fx-derivatives:TR-005)
  - When to apply: When exchangeRate.rate and quotedCurrencyPair.currency1/currency2 are present. [fx-derivatives:TR-005]
  - Inspect (FpML): fxSingleLeg.exchangeRate.rate; quotedCurrencyPair.currency1/currency2; any quoteBasis/strikeQuoteBasis. [fx-derivatives:TR-005]
  - Propose to (CDM): price.value.value; price.unit.currency.value; price.perUnitOf.currency.value. [fx-derivatives:TR-005]
  - Validate/Review: Confirm currency orientation; flag if quoteBasis is required to select unit/perUnitOf. [fx-derivatives:TR-005]

- Split/Multiple settlement entries -> aggregated quantity (fx-derivatives:TR-006)
  - When to apply: When splitSettlement or multiple paymentAmount entries are present. [fx-derivatives:TR-006]
  - Inspect (FpML): All paymentAmount occurrences and split details. [fx-derivatives:TR-006]
  - Propose to (CDM): Single trade.tradeLot.quantity or aggregated quantities as per examples. [fx-derivatives:TR-006]
  - Validate/Review: Aggregation logic is not fully documented; flag rounding/order/omissions for review. [fx-derivatives:TR-006]

- Tentative: Normalization reshapes trade.tradeheader.tradedate into trade.tradedate.value (fx-derivatives:TENT-003)
  - Apply only when exact source signal matches; mark for analyst review. [fx-derivatives:TENT-003]

## Variants And Branches

- AssignedIdentifier.scheme differences (fx-derivatives:VAR-001)
  - Signal: CDM assignedIdentifier.scheme differs from FpML tradeIdScheme (or scheme absent). [fx-derivatives:VAR-001]
  - Action: Do not assume verbatim copy; treat as normalization/override/supplement. [fx-derivatives:VAR-001]
  - Review: Confirm chosen scheme; flag discrepancies. [fx-derivatives:VAR-001]

- Buyer/Seller role inversion (fx-derivatives:VAR-002)
  - Signal: CDM buyer/seller or payer/receiver appears inverted relative to FpML hrefs. [fx-derivatives:VAR-002]
  - Action: Treat polarity as tentative; require confirmation. [fx-derivatives:VAR-002]
  - Review: Mandatory when economic direction matters. [fx-derivatives:VAR-002]

- Duplicated tradeIdentifier entries (fx-derivatives:VAR-003)
  - Signal: More CDM tradeIdentifier entries than FpML tradeId elements. [fx-derivatives:VAR-003]
  - Action: Avoid assuming 1:1; preserve all observed identifiers; flag extras. [fx-derivatives:VAR-003]

## Enrichment And Defaults

- Generated/default party identifiers appear under partyid.identifier.value (fx-derivatives:ENR-001, fx-derivatives:ENR-002, fx-derivatives:TENT-002)
  - Signal: LEI-like or generated identifiers in CDM when absent in FpML. [fx-derivatives:ENR-001, fx-derivatives:ENR-002, fx-derivatives:TENT-002]
  - Action: Treat as enrichment; do not generate unless explicitly approved. [fx-derivatives:ENR-001, fx-derivatives:ENR-002]
  - Review: Always verify source/approval for enriched identifiers. [fx-derivatives:ENR-001, fx-derivatives:ENR-002]

- Metadata taxonomy scheme enrichment under name.meta.scheme (fx-derivatives:ENR-003, fx-derivatives:ENR-004, fx-derivatives:ENR-005, fx-derivatives:TENT-009)
  - Signal: CDM includes taxonomy scheme metadata not present in FpML. [fx-derivatives:ENR-003, fx-derivatives:ENR-004, fx-derivatives:ENR-005, fx-derivatives:TENT-009]
  - Action: Treat as enrichment; do not generate without approval. [fx-derivatives:ENR-003, fx-derivatives:ENR-004, fx-derivatives:ENR-005]
  - Review: Confirm scheme choice with controlled mapping. [fx-derivatives:ENR-003]

## Human Review Triggers

- What is the authoritative source for the LEI / generated party identifiers present in CDM when absent from FpML? [fx-derivatives:OPEN-001]
- Why do buyer/seller (payer/receiver) roles appear inverted between FpML hrefs and CDM Party1/Party2 in multiple examples? [fx-derivatives:OPEN-002]
- How are CDM Party1/Party2 labels derived deterministically from FpML party references? [fx-derivatives:OPEN-003]
- Why are some tradeIdentifier entries duplicated or augmented in CDM for a single FpML tradeId? [fx-derivatives:OPEN-004]
- What logic determines when multiple FpML splitSettlement/paymentAmount entries are merged into a single CDM quantity versus preserved separately? [fx-derivatives:OPEN-005]
- How is assignedIdentifier.scheme chosen or normalized when it differs from the FpML tradeId scheme? [fx-derivatives:OPEN-006]
- Which fxSingleLeg exchangedCurrency (or leg) in FpML maps to SettlementPayout.payerReceiver in CDM when mapping payouts? [fx-derivatives:OPEN-007]
- The supporting evidence is caveated, inconsistent, or explicitly incomplete. [fx-derivatives:VAR-002, fx-derivatives:VAR-003, fx-derivatives:TR-006]

## Validation Checklist

- Confirm the FpML source contains: tradeHeader.partyTradeIdentifier.tradeId. Map to CDM: trade.tradeIdentifier.assignedIdentifier.identifier.value. [fx-derivatives:RULE-001]
- Check for duplicate or additional tradeIdentifier entries; flag for review. [fx-derivatives:VAR-003]
- Confirm the FpML source contains: trade.tradeHeader.tradeDate with trailing 'Z'. Map to CDM: trade.tradeDate.value without 'Z'. [fx-derivatives:RULE-002, fx-derivatives:TR-002]
- Confirm the FpML source contains: trade.fxdigitaloption.productType. Map to CDM: trade.product.taxonomyName.value or value.name.value (normalized). [fx-derivatives:RULE-003]
- Confirm the FpML source contains: expiryDateTime.expiryDate and expiryTime and businessCenter. Map to CDM: adjustableDate.adjustedDate.value; exerciseTerms.expirationTime.hourMinuteTime; expirationTime.businessCenter.value. [fx-derivatives:RULE-004, fx-derivatives:TR-003]
- Confirm the FpML source contains: exchangedCurrencyX.paymentAmount.amount and .currency. Map to CDM: trade.tradeLot.quantity.value and .unit.currency.value; preserve sign and scale. [fx-derivatives:RULE-005, fx-derivatives:TR-004]
- If splitSettlement/multiple paymentAmount entries exist, confirm aggregation behavior; flag for review. [fx-derivatives:TR-006]
- Confirm the FpML source contains: partyReference hrefs and buyer/seller/payer/receiver references. Populate CDM party references and roles; validate payer/receiver polarity. [fx-derivatives:TR-001, fx-derivatives:VAR-002]
- Confirm the FpML source contains: exchangeRate.rate and quotedCurrencyPair.currency1/currency2. Populate CDM price.value.value, price.unit.currency.value, price.perUnitOf.currency.value; verify unit vs perUnitOf orientation. [fx-derivatives:TR-005]
- Do not generate LEIs or taxonomy schemes unless approved; mark enriched values for review. [fx-derivatives:ENR-001, fx-derivatives:ENR-002, fx-derivatives:ENR-003]
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption. [All rules/variants]

## Source Evidence

- Quality/publication: fx-derivatives:QUALITY
- Stable rules: fx-derivatives:RULE-001, fx-derivatives:RULE-002, fx-derivatives:RULE-003, fx-derivatives:RULE-004, fx-derivatives:RULE-005
- Transformations: fx-derivatives:TR-001, fx-derivatives:TR-002, fx-derivatives:TR-003, fx-derivatives:TR-004, fx-derivatives:TR-005, fx-derivatives:TR-006
- Variants: fx-derivatives:VAR-001, fx-derivatives:VAR-002, fx-derivatives:VAR-003
- Enrichments/tentative: fx-derivatives:ENR-001, fx-derivatives:ENR-002, fx-derivatives:ENR-003, fx-derivatives:ENR-004, fx-derivatives:ENR-005, fx-derivatives:TENT-002, fx-derivatives:TENT-009
- Tentative/cautionary patterns: fx-derivatives:TENT-001, fx-derivatives:TENT-003, fx-derivatives:TENT-004, fx-derivatives:TENT-005, fx-derivatives:TENT-006, fx-derivatives:TENT-007, fx-derivatives:TENT-008
- Open questions: fx-derivatives:OPEN-001..OPEN-007

## Variants And Branches

- AssignedIdentifier.scheme differences – handle scheme normalization/override with review. [fx-derivatives:VAR-001]
- Buyer/Seller role inversion – treat polarity as tentative; confirm direction. [fx-derivatives:VAR-002]
- Duplicated tradeIdentifier entries – avoid assuming 1:1 mapping; flag extras. [fx-derivatives:VAR-003]

## Enrichment And Defaults

- Do not generate LEI or other party identifiers without source/approved defaults; flag if present. [fx-derivatives:ENR-001, fx-derivatives:ENR-002, fx-derivatives:TENT-002]
- Do not generate taxonomy scheme metadata under name.meta.scheme without approval; flag if present. [fx-derivatives:ENR-003, fx-derivatives:ENR-004, fx-derivatives:ENR-005, fx-derivatives:TENT-009]

## Worked Examples

- fx-derivatives/fx-ex01-fx-spot.xml -> fx-derivatives/fx-ex01-fx-spot.json
  - Source signals: header, trade, party
  - CDM proposal guidance: exchange rate copied; payment amounts to quantities; tradeIds copied; strip trailing 'Z' from dates. [fx-derivatives:RULE-001, fx-derivatives:RULE-002, fx-derivatives:RULE-005]
  - Validation: Review source of party LEIs if present; verify payer/receiver polarity. [fx-derivatives:ENR-001, fx-derivatives:VAR-002]

- fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml -> fx-derivatives/fx-ex02-spot-cross-w-side-rates.json
  - Source signals: header, trade, party
  - CDM proposal guidance: tradeId -> assignedIdentifier; exchangedCurrency1 amount and currency -> quantity; exchangeRate + quoted pair -> price unit/perUnitOf; resolve hrefs to payer/receiver. [fx-derivatives:RULE-001, fx-derivatives:TR-004, fx-derivatives:TR-005, fx-derivatives:TR-001]
  - Validation: Confirm CDM Party1 vs FpML party mapping; confirm source of any LEIs. [fx-derivatives:VAR-002, fx-derivatives:ENR-001]

- fx-derivatives/fx-ex03-fx-fwd.xml -> fx-derivatives/fx-ex03-fx-fwd.json
  - Source signals: header, trade, party
  - CDM proposal guidance: tradeId -> assignedIdentifier; payment amounts -> quantities; rate -> price; remove trailing 'Z' from date. [fx-derivatives:RULE-001, fx-derivatives:RULE-005, fx-derivatives:TR-005, fx-derivatives:RULE-002]
  - Validation: Review payer/receiver polarity; check for duplicate tradeIdentifier entries. [fx-derivatives:VAR-002, fx-derivatives:VAR-003]

## Do Not Assume

- Do not treat Generated/default party identifiers appear under partyid.identifier.value as a guaranteed direct mapping rule yet.
- Do not treat Party LEI or generated identifiers inserted as a guaranteed direct mapping rule yet.
- Do not treat Metadata taxonomy scheme enrichment under name.meta.scheme as a guaranteed direct mapping rule yet.
- Do not treat Product type normalization -> taxonomy name and meta.scheme enrichment as a guaranteed direct mapping rule yet.
- Do not treat Taxonomy scheme metadata added under name.meta.scheme as a guaranteed direct mapping rule yet.
- Source of party LEI values missing in FpML.
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not guess normalized exchange, taxonomy, or scheme values without a controlled mapping or evidence.
- Do not apply tentative patterns without matching source evidence.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not treat as stable: Derivation of CDM party role labels (Party1/Party2) from FpML party hrefs; examples show inconsistent inversions.
- Do not treat as stable: Source and reliability of party LEI or generated identifiers included in CDM (likely enrichment).
- Do not treat as stable: Rules that create additional or duplicate tradeIdentifier entries in CDM.
- Do not treat as stable: Precise aggregation rules used when merging splitSettlement/multiple paymentAmount entries into one CDM quantity.
- Do not assume enrichment/default behavior for Generated/default party identifiers appear under partyid.identifier.value without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Party LEI or generated identifiers inserted without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Metadata taxonomy scheme enrichment under name.meta.scheme without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Product type normalization -> taxonomy name and meta.scheme enrichment without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Taxonomy scheme metadata added under name.meta.scheme without source evidence or analyst approval.