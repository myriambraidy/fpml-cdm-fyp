# Round 1 Summary

Decision: ACCEPTED

## Planner Focus

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Critic Findings

- Specific test assertions (e.g., “fx-ex01: valueDate maps to settlementDate.valueDate”)
- Evidence-backed assertions (no cookbook rule IDs referenced in test cases)
- CDM path assertions derived from expected CDM summaries (e.g., `$.trade.product.economicTerms.payout[0].SettlementPayout.settlementTerms.settlementDate.valueDate`)
- FX Swap (fx-ex08-fx-swap.xml)
- FX Options (fx-ex09-euro-opt.xml, fx-ex10-amer-opt.xml, fx-ex11-non-deliverable-option.xml)
- Digital, barrier, average-rate options
- Strategies (fx-ex22, fx-ex23)
- Non-FX (term deposits)

## Resolution Notes

- [ ] Finalize Maven `pom.xml`: `groupId=com.fpml.cdm`, `artifactId=fx-mapper`, Java 17
- [ ] Package structure:
- `com.fpml.cdm.fx`
- `FxMapper` (main entry point)
- `FxSingleLegMapper` (primary mapper)
- `FxSwapMapper` (stub for future)
- `FxOptionMapper` (stub for future)
- `FxConverter` (shared utilities)
- [ ] Add dependency: `org.jdom2:jdom2` for XML parsing (or equivalent)
- [ ] Add dependency: `com.fasterxml.jackson.core:jackson-databind` for JSON output
