# FPML -> CDM Cookbook: equity-options

## Status

- Operational status: `review_only`
- Agent use policy: Agents must not apply these rules automatically; use only as background evidence for analyst review.
- Semantic success rate: 22%
- Draft quality: `poor`
- Draft publication: `success`
- Readiness reasons: `fallback_synthesis`, `low_semantic_success`, `weak_quality`, `high_open_question_density`

## Trigger Signals

- equity-options
- FpML top-level section: party
- FpML top-level section: trade
- FpML top-level section: header
- trade > equityOptionTransactionSupplement (39 paths)
- trade > tradeHeader (6 paths)
- trade > documentation (3 paths)
- party > partyId (2 paths)
- party > partyName (2 paths)
- trade > equityOption (58 paths)
- trade > tradeHeader (3 paths)
- header > conversationId (1 paths)
- trade
- party
- header

## Canonical Mapping Procedure

1. Start from the repeated FPML sections seen across matched files: party, trade, header.
2. Map trade identifiers, party references, and trade dates before product-specific economics.
3. Use pair-level examples as tentative guidance; no repeated folder-wide rules were recovered yet.
4. Watch for non-literal reshaping and confirm it from pair-level examples before generalizing.
5. Assemble the result under repeated CDM scaffolding such as meta, trade, transferHistory.
6. Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

## Stable Rules

No stable operational rules were recovered for this family.

## Transformations

No repeated transformations were recovered for this family.

## Variants And Branches

No product variants or branches were recovered for this family.

## Enrichment And Defaults

No enrichment or default behavior was recovered for this family.

## Cautions And Tentative Signals

No additional cautionary signals were recovered for this family.

## Do Not Assume

- CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
- Why is payerReceiver.payer Party2 though buyer is Party1?
- Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
- Why buyer/seller role names appear swapped between FpML and CDM?
- Why are buyer/seller values inverted between FpML and CDM?
- Why was exchange 'NSE' converted to 'XNSE' in CDM?
- Do not treat as stable: CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
- Do not treat as stable: Why is payerReceiver.payer Party2 though buyer is Party1?
- Do not treat as stable: Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
- Do not treat as stable: Why buyer/seller role names appear swapped between FpML and CDM?

## Human Review Triggers

- CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
- Why is payerReceiver.payer Party2 though buyer is Party1?
- Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
- Why buyer/seller role names appear swapped between FpML and CDM?
- Why are buyer/seller values inverted between FpML and CDM?
- Why was exchange 'NSE' converted to 'XNSE' in CDM?

## Validation Checklist

- Check unresolved question: CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
- Check unresolved question: Why is payerReceiver.payer Party2 though buyer is Party1?
- Check unresolved question: Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
- Check unresolved question: Why buyer/seller role names appear swapped between FpML and CDM?
- Check unresolved question: Why are buyer/seller values inverted between FpML and CDM?
- Check unresolved question: Why was exchange 'NSE' converted to 'XNSE' in CDM?
- Every material CDM field in the proposal must cite a cookbook rule id or be listed as an assumption.
- Every unresolved party direction, generated identifier, or enrichment must be marked for analyst review.
- Do not use this document to automatically map fields; use it only to explain uncertainty.

## Worked Examples

### equity-options/eqd-ex-27-equityOptionTransactionSupplement-EMEA-interdealer.xml -> equity-options/eqd-ex-27-equityOptionTransactionSupplement-EMEA-interdealer.json

- Source signals:
  - trade, party
- CDM proposal guidance:
  - option type 'Call' maps directly
  - settlement type and currency map
  - instrumentId and description become identifiers
  - buyer/seller hrefs mapped to Party1/Party2 roles
  - href 'valuationDate' resolved to externalReference
- Validation:
  - Review uncertainty: CDM exchange name 'XWAR' differs from FpML 'WSE'; mapping rule?
  - Review uncertainty: Why is payerReceiver.payer Party2 though buyer is Party1?

### equity-options/eqd-ex02-calendar-spread-short-form.xml -> equity-options/eqd-ex02-calendar-spread-short-form.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - productType 'calendarSpread' -> taxonomy name
  - optionType 'Call' -> OptionPayout.optionType
  - exercise unadjustedDate values map to CDM exerciseTerms
  - numberOfOptions -> tradeLot quantity value (unit Contract)
  - FpML buyer/seller hrefs resolved to CDM counterparty externalReference
- Validation:
  - Review uncertainty: Why FpML exchangeId 'NSE' became 'XNSE' in CDM?
  - Review uncertainty: Why buyer/seller role names appear swapped between FpML and CDM?

### equity-options/eqd-ex03-call-or-put-spread-short-form.xml -> equity-options/eqd-ex03-call-or-put-spread-short-form.json

- Source signals:
  - header, trade, party
- CDM proposal guidance:
  - option type mapped
  - strike value mapped; currency attached
  - underlyer id and name mapped
  - premium represented as transferHistory entry
  - exchange code 'NSE' appears as 'XNSE' in CDM
- Validation:
  - Review uncertainty: Why are buyer/seller values inverted between FpML and CDM?
  - Review uncertainty: Why was exchange 'NSE' converted to 'XNSE' in CDM?

## Source Evidence

- Evidence sidecar: `../references/equity-options.evidence.json`
