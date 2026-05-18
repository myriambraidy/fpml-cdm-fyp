# FPML -> CDM Cookbook: interest-rate-derivatives

## Status

- Operational status: review_only (background only; not for automatic agent application)
- Publication integrity: failed_integrity_validation; limited pilot readiness and open-question density remain high

## Trigger Signals

Use this page only as background when the FpML payload clearly pertains to interest-rate-derivatives and contains any of the following indicative sections or fields (for analyst review only):
- Top-level sections: party, trade
- Product sections: trade > swap, swap.swapStream, trade.swaption
- Source cues for recurring mappings/normalizations observed in examples:
  - notionalschedule.notionalstepschedule.initialValue and currency
  - swap.swapstream.payerPartyReference | swap.swapstream.receiverPartyReference
  - calculationPeriodDates.effectiveDate.unadjustedDate
  - expirationDate.adjustableDate.unadjustedDate
  - calculation.fixedRateSchedule.initialValue
  - trade.tradeHeader.tradeDate
  - trade.swaption.buyerPartyReference

## Canonical Mapping Procedure

Background-only procedure for analyst review; do not apply automatically:
1. Locate core wrapper content: party and trade.
2. Identify trade/tradeHeader dates and party references before product economics.
3. When exact source cues are present, consider the recurring background patterns below (all require analyst confirmation):
   - Notional schedule (initialValue + currency) -> CDM tradeLot.quantity (value + unit.currency) [review-only]
   - swapStream payer/receiver party hrefs -> CDM InterestRatePayout.payerReceiver [review-only]
   - Timezone trim on calculation period effective dates -> date-only in CDM [review-only]
   - Timezone trim on option expiration dates -> date-only in CDM [review-only]
   - Fixed-rate initialValue -> CDM price.value.value [review-only]
   - Swaption buyerPartyReference -> CDM optionPayout.buyerSeller.buyer [review-only]
4. Treat any identifier reshaping (tradeIdentifier issuers, Party1/Party2/PartyA, LEI-like party ids) as enrichment and require analyst sign-off.
5. Assemble under CDM trade scaffolding only after all party role resolution, date normalization intentions, and identifier provenance are validated.
6. Any unresolved role direction, identifier substitution, or enrichment must be explicitly flagged for human review.

## Do Not Assume

- Do not treat Additional CDM tradeIdentifier issuer entries as a guaranteed direct mapping rule yet.
- Do not treat CDM.party.partyId LEI enrichment as a guaranteed direct mapping rule yet.
- Do not treat Generated role labels (Party1/Party2/PartyA) as a guaranteed direct mapping rule yet.
- FpML includes tradeId TW9235; CDM only contains SW2000. Why is TW9235 omitted?
- Why does CDM use 'Party1'/'Party2' strings instead of partyId values?
- Why CDM party identifier 'PartyA' differs from FpML partyId 'MGTCGB2L'?
- Do not infer Party1/Party2, buyer/seller, or payer/receiver direction from document order alone.
- Do not invent identifiers, global keys, external keys, or LEIs when they are not source-backed.
- Do not apply tentative patterns without matching source evidence.
- Do not treat caveated or unclear behavior as a stable mapping rule.
- Do not invent enriched identifiers, global keys, exchange codes, or defaults without source-backed evidence.
- Do not treat as stable: Mapping of FpML partyId to CDM.party.partyId (Party1/Party2/LEI differences) – evidence shows inconsistent identifier handling.
- Do not treat as stable: Trade identifier provenance and mapping – some FpML tradeIds are omitted or replaced in CDM.
- Do not treat as stable: Role inversion between premium payer and option payout payerReceiver observed in some swaption examples – requires case-by-case validation.
- Do not assume enrichment/default behavior for Additional CDM tradeIdentifier issuer entries without source evidence or analyst approval.
- Do not assume enrichment/default behavior for CDM.party.partyId LEI enrichment without source evidence or analyst approval.
- Do not assume enrichment/default behavior for Generated role labels (Party1/Party2/PartyA) without source evidence or analyst approval.

## Human Review Triggers

Trigger analyst review when any of the following are observed:
- Trade identifier present in FpML but absent or substituted in CDM output (e.g., TW9235 vs SW2000).
- CDM uses 'Party1'/'Party2' or 'PartyA' instead of FpML partyId values.
- Unclear mapping between payer/receiver labels and FpML party hrefs.
- CDM party.partyId values appear as LEIs or normalized ids differing from FpML partyId.
- Multiple CDM tradeIdentifier issuer entries with no clear FpML source.
- Any buyer/seller or payer/receiver role that affects economic meaning.
- Any enrichment or default not directly copied from FpML.
- Any tentative pattern is applied; mark as tentative and require confirmation.

## Validation Checklist

Use this checklist to frame analyst validation (do not auto-apply):
- Confirm presence and mapping of notionalschedule.notionalstepschedule.initialValue + currency -> tradeLot.quantity.value + unit.currency.
- Confirm swap.swapstream payer/receiver hrefs -> InterestRatePayout.payerReceiver and validate direction against the trade context.
- Confirm calculationPeriodDates.effectiveDate.unadjustedDate -> effectivedate.adjustableDate.unadjustedDate only when timezone trimming is intended and acceptable.
- Confirm expirationDate.adjustableDate.unadjustedDate normalization when timezone trimming is intended and acceptable.
- Confirm calculation.fixedRateSchedule.initialValue -> price.value.value with correct units/scale.
- Confirm trade.tradeHeader.tradeDate -> trade.tradeDate.value with intended normalization.
- For each tentative pattern used, confirm exact source signal match and mark mapped field for analyst review.
- Reconcile identifiers: explain any omission/substitution of tradeId, any LEI-like or generated party labels, and any extra tradeIdentifier issuers.
- Ensure every material CDM field proposed cites a background rule id or is explicitly flagged as an assumption requiring review.

## Source Evidence

Background evidence referenced by this page:
- Quality and publication status: interest-rate-derivatives:QUALITY
- Stable rules: interest-rate-derivatives:RULE-001, RULE-002, RULE-003, RULE-004
- Transformations: interest-rate-derivatives:TR-001, TR-002, TR-003, TR-004, TR-005, TR-006, TR-007
- Tentative patterns: interest-rate-derivatives:TENT-001..TENT-012 (as listed in evidence)
- Variants: interest-rate-derivatives:VAR-001, VAR-002, VAR-003
- Suspected enrichments: interest-rate-derivatives:ENR-001, ENR-002, ENR-003
- Open questions: interest-rate-derivatives:OPEN-001..OPEN-008

## Operational Limitations

- Publication integrity failed; the draft is not ready for broad rollout and remains review-only.
- Multiple suspected enrichments and identifier substitutions are present (party labels, LEI-like ids, extra tradeIdentifier issuers) and are not source-backed.
- Role-direction uncertainties (payer/receiver; buyer/seller vs premium) are unresolved in some examples and must be validated case-by-case.
- Several mappings rely on timezone stripping; the intent and business semantics of timezone removal are not evidenced beyond examples and must be confirmed.
- Evidence strength for some recurring patterns is thin (limited example counts), requiring explicit analyst confirmation before use.