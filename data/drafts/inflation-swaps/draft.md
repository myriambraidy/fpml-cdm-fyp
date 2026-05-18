# Agent Mapping Playbook: inflation-swaps

## 1. Scope

- Folder: `inflation-swaps`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-26`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `5`
- Matched pairs selected: `5`
- Structural evidence basis: `5/5` matched pairs
- Semantic evidence basis: `5/5` pair analyses
- Full semantic analyses: `5`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `0`
- Missing counterparts: `0`
- Ignored pairs: `0`
- Exact matches: `5`
- Normalized matches: `0`
- Alias matches: `0`
- Structural basis note: Structural summaries are computed from all 5/5 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 5/5 successful or salvaged pair analyses (5 full, 0 salvaged).

## 3. Included Examples

- `inflation-swaps/inflation-swap-ex01-yoy.xml` -> `inflation-swaps/inflation-swap-ex01-yoy.json` (`exact`)
- `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml` -> `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.json` (`exact`)
- `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml` -> `inflation-swaps/inflation-swap-ex03-yoy-initial-level.json` (`exact`)
- `inflation-swaps/inflation-swap-ex04-yoy-interp.xml` -> `inflation-swaps/inflation-swap-ex04-yoy-interp.json` (`exact`)
- `inflation-swaps/inflation-swap-ex05-zc.xml` -> `inflation-swaps/inflation-swap-ex05-zc.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- None observed.

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/header/messageId
- /FpML/header/sentBy
- /FpML/header/sendTo
- /FpML/header/creationTimestamp
- /FpML/trade/tradeHeader/partyTradeIdentifier
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference

### 5.2 Repeated top-level sections

- `header` appears in `5/5` examples
- `party` appears in `5/5` examples
- `trade` appears in `5/5` examples

### 5.3 Repeated nested structures

- trade > swap (82 paths)
- party > account (6 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `5/5` examples
- `trade` appears in `5/5` examples
- `transferHistory` appears in `3/5` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (101 paths)
- trade > tradeLot (33 paths)
- trade > tradeIdentifier (21 paths)
- transferHistory > transfer (17 paths)
- trade > account (13 paths)
- trade > party (13 paths)
- trade > counterparty (7 paths)
- trade > ancillaryParty (5 paths)

### 5.7 Optional but common CDM sections

- None observed.

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

### Rule RULE-001: Date normalization: unadjustedDate -> adjustableDate.unadjustedDate (YYYY-MM-DD)

- Strength: `strong recurring pattern`
- Evidence count: `4` examples
- Source pattern: `calculationperioddates.effectivedate.unadjusteddate (FpML datetime with timezone)`
- Target pattern: `effectivedate.adjustabledate.unadjusteddate (CDM date formatted YYYY-MM-DD)`
- Explanation: Dates from multiple FpML examples are copied into CDM unadjusted date fields after removing timezone and trimming to date (YYYY-MM-DD).
- Why it seems to work this way: CDM fields expect date-only values; repeated examples show timezone-stripping and formatting applied deterministically.
- Example files:
  - `inflation-swaps/inflation-swap-ex01-yoy.xml`
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Caveats:
  - Some datetime inputs include timezones and times - transformation removes timezone and time component.
  - Ensure resulting value is validated as ISO date (YYYY-MM-DD).

### Rule RULE-002: Party reference resolution: swapstream payer/receiver href -> interestratepayout.payerreceiver.payer|receiver

- Strength: `strong recurring pattern`
- Evidence count: `3` examples
- Source pattern: `swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href (FpML party hrefs)`
- Target pattern: `interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role labels/externalReference)`
- Explanation: Party hrefs are consistently resolved into CDM payer/receiver role entries. Multiple examples show this resolution and that the order/assignment may be inverted relative to the raw href order.
- Why it seems to work this way: FpML uses href references to identify payer/receiver; CDM represents explicit payer/receiver role objects, so hrefs are mapped to those objects. Repeated examples indicate a consistent mapping rule was applied (with inversion in some outputs).
- Example files:
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex04-yoy-interp.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Caveats:
  - Several outputs show the payer/receiver assignment reversed versus the original hrefs - treat inversion as active behavior to investigate rather than an isolated error.
  - Mapping should preserve party identity (externalKey/partyId) even when role assignment appears inverted.

### Rule RULE-003: Trade identifier copy: tradeHeader.tradeId -> assignedIdentifier.identifier.value

- Strength: `strong recurring pattern`
- Evidence count: `3` examples
- Source pattern: `tradeheader.partytradeidentifier.tradeid (FpML tradeId)`
- Target pattern: `assignedidentifier.identifier.value (CDM tradeIdentifier/assignedIdentifier value)`
- Explanation: FpML tradeId values are repeatedly copied into CDM assignedIdentifier/identifier.value fields.
- Why it seems to work this way: Trade identifiers are preserved to maintain traceability; examples show direct copying of FpML tradeId into CDM identifier structures.
- Example files:
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Caveats:
  - CDM may include additional identifier metadata (scheme) not present in the FpML field - mapping preserves core id value but external scheme population may vary.

### 6.2 Repeated non-literal transformations

### Transformation TR-001: Date/time normalization and trimming

- Type: `normalization`
- Description: Strip timezone and time component from FpML datetimes and format as date (YYYY-MM-DD) when populating CDM unadjusted date fields.
- Source side: `FpML datetime fields (e.g., calculationPeriodDates.effectivedate.unadjusteddate with timezone)`
- Target side: `CDM adjustableDate.unadjustedDate as date-only string (YYYY-MM-DD)`
- Evidence count: `4`
- Example files:
  - `inflation-swaps/inflation-swap-ex01-yoy.xml`
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Notes:
  - Representative notes indicate removal of timezone is applied consistently.
  - Be explicit about validating resulting date format after transformation.

### Transformation TR-002: Timezone removal as normalization

- Type: `normalization`
- Description: Removal of timezone and trimming datetimes to date is a normalization behavior applied consistently in examples.
- Source side: `Normalization cue inferred from source-side values.`
- Target side: `Timezone removal as normalization`
- Evidence count: `4`
- Example files:
  - `inflation-swaps/inflation-swap-ex01-yoy.xml`
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Notes:
  - Normalization should be implemented deterministically (strip timezone, drop time component).
  - Confirm timezone handling policy if any timezone-aware logic is required.

### Transformation TR-003: Copy tradeId into assignedIdentifier

- Type: `normalization`
- Description: Copy FpML tradeId values into CDM assignedIdentifier.identifier.value (preserve identifier value).
- Source side: `tradeheader.partytradeidentifier.tradeid (FpML)`
- Target side: `tradeIdentifier.assignedIdentifier.identifier.value (CDM)`
- Evidence count: `3`
- Example files:
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Notes:
  - Examples show direct copying; scheme or namespace for assignedIdentifier may need separate handling.

### Transformation TR-004: Party href resolution to payer/receiver role

- Type: `reference resolution`
- Description: Resolve FpML party hrefs used in swapStream payer/receiver references into CDM payer/receiver role objects (party.externalKey or partyId).
- Source side: `swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href`
- Target side: `interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role entries)`
- Evidence count: `3`
- Example files:
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex04-yoy-interp.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Notes:
  - Outputs frequently map href -> role label, but examples show role assignment may be inverted; mapping must reliably reference the correct party object even if role order differs.

### 6.3 Tentative and emerging signals

### TENT-001: transformation

- Strength: `strong recurring pattern`
- Description: Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate.
- Evidence count: `4`
- Example files:
  - `inflation-swaps/inflation-swap-ex01-yoy.xml`
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: Strip timezone and format as YYYY-MM-DD
  - Representative note: strip timezone from date
  - Representative note: remove timezone from datetime

### TENT-002: mapping

- Strength: `strong recurring pattern`
- Description: Party references repeatedly resolve from swapstream.payerpartyreference.href|swapstream.receiverpartyreference.href into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver.
- Evidence count: `3`
- Example files:
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex04-yoy-interp.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Notes:
  - Confidence mix includes medium.
  - Representative note: payer/receiver mapping appears inverted
  - Representative note: party hrefs mapped to role labels; order reversed
  - Confidence mix includes high.

### TENT-003: mapping

- Strength: `strong recurring pattern`
- Description: Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value.
- Evidence count: `3`
- Example files:
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Notes:
  - Confidence mix includes high.
  - Representative note: tradeId -> tradeIdentifier.assignedIdentifier.value
  - Representative note: tradeId -> tradeIdentifier.value
  - Representative note: FpML tradeId values copied to CDM assignedIdentifier

### 6.4 Folder-level principles

- Normalize FpML datetimes to CDM date-only fields by removing timezone and time; use ISO YYYY-MM-DD.
- Resolve FpML party hrefs into CDM party role objects (payer/receiver) and populate party externalKey/partyId accordingly.
- Preserve FpML trade identifiers by copying tradeId into CDM assignedIdentifier/identifier.value for traceability.

### 6.5 Variants and exceptions

### Variant VAR-001: Payer/receiver role inversion

- Description: Although party hrefs are resolved into CDM payer/receiver roles consistently, multiple examples show the CDM payer/receiver assignment is reversed relative to the FpML href ordering.
- Seen in:
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex04-yoy-interp.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Impact on generalization: Mapping logic should account for possible systematic inversion; do not assume first href -> payer without verifying role semantics. Treat inversion as an important exception to validate.

### Variant VAR-002: Unmapped bondReference

- Description: Some FpML fields such as bondReference appear in inputs but do not have an obvious CDM target in the provided examples.
- Seen in:
  - `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml`
- Impact on generalization: Fields without repeated mapping evidence should be treated as exceptions; avoid inventing CDM targets without additional mappings or stakeholder guidance.

### 6.6 Suspected enrichment or default behavior

### Enrichment ENR-001: Unmapped interpolation/publication metadata

- Description: Index source, mainPublication and interpolationMethod fields in FpML are present in inputs but their CDM targets are unclear or not represented in examples.
- Classification: `unclear`
- Evidence:
  - `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml`
  - `inflation-swaps/inflation-swap-ex04-yoy-interp.xml`
  - `inflation-swaps/inflation-swap-ex05-zc.xml`
- Caution:
  - Do not assume these fields are omitted intentionally; seek domain guidance on where such metadata should go in CDM (if at all).

### Enrichment ENR-002: Quantity scaling hypothesis

- Description: Observed CDM quantity values (e.g., 1000000) may be derived by scaling FpML input values (example mentions initialValue 1). The transformation is not explicitly shown but is suspected.
- Classification: `suspected enrichment`
- Evidence:
  - `inflation-swaps/inflation-swap-ex01-yoy.xml`
- Caution:
  - Scaling logic is not demonstrated across multiple examples - treat as tentative and verify with canonical rules or source system metadata before applying.
  - Do not apply automatic scaling unless mapping rule is confirmed.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 5/5 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 5/5 successful or salvaged pair analyses (5 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: header, party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Apply recurring mapping rules only when the exact source cues appear in the document.
- Then apply the repeated non-literal transformations that reshape identifiers, dates, wrappers, or references.
- Assemble the result under repeated CDM scaffolding such as meta, trade, transferHistory.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- calculationperioddates.effectivedate.unadjusteddate (FpML datetime with timezone) -> effectivedate.adjustabledate.unadjusteddate (CDM date formatted YYYY-MM-DD): Dates from multiple FpML examples are copied into CDM unadjusted date fields after removing timezone and trimming to date (YYYY-MM-DD).
- swapstream.payerpartyreference.href | swapstream.receiverpartyreference.href (FpML party hrefs) -> interestratepayout.payerreceiver.payer | interestratepayout.payerreceiver.receiver (CDM party role labels/externalReference): Party hrefs are consistently resolved into CDM payer/receiver role entries. Multiple examples show this resolution and that the order/assignment may be inverted relative to the raw href order.
- tradeheader.partytradeidentifier.tradeid (FpML tradeId) -> assignedidentifier.identifier.value (CDM tradeIdentifier/assignedIdentifier value): FpML tradeId values are repeatedly copied into CDM assignedIdentifier/identifier.value fields.
- Party references repeatedly resolve from swapstream.payerpartyreference.href|swapstream.receiverpartyreference.href into interestratepayout.payerreceiver.payer|interestratepayout.payerreceiver.receiver. [tentative 3 examples]
- Trade identifiers repeatedly map from tradeheader.partytradeidentifier.tradeid into assignedidentifier.identifier.value. [tentative 3 examples]

### Transformation Patterns

- normalization: Strip timezone and time component from FpML datetimes and format as date (YYYY-MM-DD) when populating CDM unadjusted date fields.
- normalization: Removal of timezone and trimming datetimes to date is a normalization behavior applied consistently in examples.
- normalization: Copy FpML tradeId values into CDM assignedIdentifier.identifier.value (preserve identifier value).
- reference resolution: Resolve FpML party hrefs used in swapStream payer/receiver references into CDM payer/receiver role objects (party.externalKey or partyId).
- Normalization repeatedly reshapes calculationperioddates.effectivedate.unadjusteddate into effectivedate.adjustabledate.unadjusteddate. [tentative 4 examples]

### Product-Specific Branches

### inflation-swap-ex01-yoy.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - FpML tradeId -> CDM tradeIdentifier value and scheme
  - FpML party id -> CDM party.partyId and externalKey
  - Timezone removed, date normalized to YYYY-MM-DD
  - FpML floatingRateIndex -> CDM inflationRateIndex.value
- Cautions:
  - Why CDM counterparty roles reference opposite externalReference?
  - Is quantity 1000000 derived from FpML initialValue 1 (scaling)?

### inflation-swap-ex02-yoy-bond-reference.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - tradeId -> tradeIdentifier.assignedIdentifier.value
  - FpML party id and partyId -> CDM party.externalKey and partyId
- Cautions:
  - bondReference in FpML not represented in CDM; where mapped?

### inflation-swap-ex03-yoy-initial-level.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - tradeId -> tradeIdentifier.value
  - datetime trimmed to date
  - payer/receiver mapping appears inverted
  - floatingRateIndex and tenor -> InflationIndex fields
- Cautions:
  - Why is CDM payer value reversed versus FpML hrefs?
  - Where were indexSource/mainPublication/interpolation mapped?

### inflation-swap-ex04-yoy-interp.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - party hrefs mapped to role labels; order reversed
  - unadjustedDate copied with timezone removed
  - inflation index and tenor mapped into observable InflationIndex
- Cautions:
  - Why CDM payer role labels invert FpML hrefs?
  - Where interpolationMethod (LinearZeroYield) should map in CDM?

### inflation-swap-ex05-zc.xml

- When to use: Use this branch when the source document resembles header, trade, party.
- Source signals:
  - header
  - trade
  - party
- Mapping focus:
  - payer/receiver href mapped to payer/receiver roles
  - FpML tradeId values copied to CDM assignedIdentifier
  - unadjustedDate timezone stripped
- Cautions:
  - Why calculationPeriodFrequency.periodMultiplier changes (FpML 30 vs CDM 1)?
  - FpML interpolationMethod 'LinearZeroYield' not represented in CDM?

### Validation Checks

- Check unresolved question: Why CDM counterparty roles reference opposite externalReference?
- Check unresolved question: Is quantity 1000000 derived from FpML initialValue 1 (scaling)?
- Check unresolved question: bondReference in FpML not represented in CDM; where mapped?
- Check unresolved question: Why is CDM payer value reversed versus FpML hrefs?
- Check unresolved question: Where were indexSource/mainPublication/interpolation mapped?
- Check unresolved question: Why CDM payer role labels invert FpML hrefs?

### Do Not Assume

- Do not treat Unmapped interpolation/publication metadata as a guaranteed direct mapping rule yet.
- Do not treat Quantity scaling hypothesis as a guaranteed direct mapping rule yet.
- Why CDM counterparty roles reference opposite externalReference?
- Is quantity 1000000 derived from FpML initialValue 1 (scaling)?
- bondReference in FpML not represented in CDM; where mapped?
- Why is CDM payer value reversed versus FpML hrefs?

## 8. Pair-Level Worked Examples

### `inflation-swaps/inflation-swap-ex01-yoy.xml` -> `inflation-swaps/inflation-swap-ex01-yoy.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - FpML tradeId -> CDM tradeIdentifier value and scheme
  - FpML party id -> CDM party.partyId and externalKey
  - Timezone removed, date normalized to YYYY-MM-DD
  - FpML floatingRateIndex -> CDM inflationRateIndex.value
- Most important transformation:
  - Strip timezone and format as YYYY-MM-DD
- Uncertainty:
  - Why CDM counterparty roles reference opposite externalReference?
  - Is quantity 1000000 derived from FpML initialValue 1 (scaling)?

### `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.xml` -> `inflation-swaps/inflation-swap-ex02-yoy-bond-reference.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - tradeId -> tradeIdentifier.assignedIdentifier.value
  - FpML party id and partyId -> CDM party.externalKey and partyId
- Most important transformation:
  - strip timezone from date
- Uncertainty:
  - bondReference in FpML not represented in CDM; where mapped?

### `inflation-swaps/inflation-swap-ex03-yoy-initial-level.xml` -> `inflation-swaps/inflation-swap-ex03-yoy-initial-level.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, transferHistory, meta
- Most important observed mappings:
  - tradeId -> tradeIdentifier.value
  - datetime trimmed to date
  - payer/receiver mapping appears inverted
  - floatingRateIndex and tenor -> InflationIndex fields
- Most important transformation:
  - remove timezone from datetime
- Uncertainty:
  - Why is CDM payer value reversed versus FpML hrefs?
  - Where were indexSource/mainPublication/interpolation mapped?

### `inflation-swaps/inflation-swap-ex04-yoy-interp.xml` -> `inflation-swaps/inflation-swap-ex04-yoy-interp.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - party hrefs mapped to role labels; order reversed
  - unadjustedDate copied with timezone removed
  - inflation index and tenor mapped into observable InflationIndex
- Most important transformation:
  - map party ids to canonical role labels and invert order
- Uncertainty:
  - Why CDM payer role labels invert FpML hrefs?
  - Where interpolationMethod (LinearZeroYield) should map in CDM?

### `inflation-swaps/inflation-swap-ex05-zc.xml` -> `inflation-swaps/inflation-swap-ex05-zc.json`

- Main FpML sections: header, trade, party
- Main CDM sections: trade, meta
- Most important observed mappings:
  - payer/receiver href mapped to payer/receiver roles
  - FpML tradeId values copied to CDM assignedIdentifier
  - unadjustedDate timezone stripped
- Most important transformation:
  - href resolved to party role label
- Uncertainty:
  - Why calculationPeriodFrequency.periodMultiplier changes (FpML 30 vs CDM 1)?
  - FpML interpolationMethod 'LinearZeroYield' not represented in CDM?

## 9. Open Questions And Risks

- Why CDM counterparty roles reference opposite externalReference?
- Is quantity 1000000 derived from FpML initialValue 1 (scaling)?
- bondReference in FpML not represented in CDM; where mapped?
- Why is CDM payer value reversed versus FpML hrefs?
- Where were indexSource/mainPublication/interpolation mapped?
- Why CDM payer role labels invert FpML hrefs?
- Where interpolationMethod (LinearZeroYield) should map in CDM?
- Why calculationPeriodFrequency.periodMultiplier changes (FpML 30 vs CDM 1)?

## 10. Draft Conclusion

- Most reusable findings:
  - Strip timezone and normalize FpML datetimes to date-only (YYYY-MM-DD) when populating CDM unadjusted date fields.
  - Resolve party hrefs into CDM payer/receiver role objects and populate party externalKey/partyId for role entries.
  - Copy FpML tradeId values into CDM assignedIdentifier.identifier.value to preserve traceability.
- What seems safe to generalize:
  - Date normalization (timezone removal and date trimming) - well supported across examples.
  - Trade identifier copying into CDM assignedIdentifier - repeated and consistent.
  - Resolving FpML party hrefs into CDM party role structures - repeated, but see inversion caveat.
- What should remain tentative:
  - The reason and intended direction for payer/receiver inversion - repeated but semantically ambiguous.
  - Quantity scaling behavior (e.g., initialValue -> large quantity) - suspected but not confirmed.
  - Mapping targets for bondReference, interpolationMethod, indexSource/mainPublication - unclear from examples.
  - Why calculationPeriodFrequency.periodMultiplier differs between FpML and CDM in examples.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `5`
- Successful semantic pair count: `5`
- Full semantic pair count: `5`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `0`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 5
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 5
  - Tentative repeated semantic signals: 3
