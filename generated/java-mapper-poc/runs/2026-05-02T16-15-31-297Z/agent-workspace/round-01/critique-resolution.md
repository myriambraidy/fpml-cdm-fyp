# ✅ Critique Review: ACCEPTED

All critique items are valid. The planner plan meets all safety, correctness, and scope constraints.

## Valid Critique Items (Accepted)

| Item | Valid? | Reason |
|------|--------|--------|
| ✅ Correct mapping of in-scope groups | ✔️ | `fx-single-leg` matches `currentImplementationGroup` in `00-product-scope.json`; all 7 fixtures correctly listed |
| ✅ Out-of-scope groups correctly excluded | ✔️ | All remaining product groups are explicitly listed as out of scope |
| ✅ Structure matches spec | ✔️ | `## Implementation scope (machine-checked)` section is present with correct bullet slugs |
| ✅ No critical mappings missing for fx-single-leg | ✔️ | Evidence from `evidence-packet.md` confirms 7 fixtures are representative of fx-single-leg; cookbook rules cover the required mappings |
| ✅ No overreach in scope | ✔️ | Plan is appropriately constrained to staged implementation of fx-single-leg only |
| ⚠️ Future mappers (FxSwapMapper, FxOptionMapper) labeled but not implemented | ✔️ | Acceptable architectural foresight; clearly noted as placeholders for future phases |
| ⚠️ Test details lack specificity (CDM paths, rule IDs) | ✔️ | Identified as improvement, not blocker; implementer will derive test assertions from cookbook and expected CDM summaries |
| ✅ Unsupported cases correctly excluded | ✔️ | Plan explicitly excludes fx-swap, options, strategies, and non-FX products |
| ✅ No confusion of evidence vs. runtime behavior | ✔️ | References cookbook rules correctly and specifies deterministic Java implementation |
| ✅ No LLM or agent-runtime coupling | ✔️ | Maven project with deterministic mapping—complies with requirement “must not call an LLM and must not read this agent workspace” |

## Revised Implementation Checklist

### Planning & Design
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

### Core Mapping Implementation (fx-single-leg only)
- [ ] Implement `FxSingleLegMapper.map()` to convert FpML `fxSingleLeg` → CDM JSON
- [ ] Apply cookbook rules:
  - `fx-derivatives:RULE-001`: `tradeId` → `tradeIdentifier.assignedIdentifier.identifier.value`
  - `fx-derivatives:RULE-002`: trade date → `tradeDate.value` (strip trailing `Z`)
  - `fx-derivatives:RULE-005`: payment amounts → `tradeLot.quantity` (value + currency)
  - `fx-derivatives:TR-001`: party hrefs → CDM party objects and roles
  - `fx-derivatives:TR-002`: date normalization (trim `Z`)
- [ ] Special handling:
  - `nonDeliverableForward` section → CDM cash settlement + fixing
  - `sideRates` → include in `priceQuantity.price.composite` if present
  - `splitSettlement` → map to CDM `settlementInstruction` sub-lists

### Tests
- [ ] 7 JUnit tests (`fx-ex01` through `fx-ex07`) that:
  - Load FpML XML fixture
  - Call `FxSingleLegMapper.map()`
  - Assert against expected CDM JSON (using JSONAssert or equivalent)
  - Include checks on:
    - `tradeIdentifier`, `tradeDate`, `party` roles
    - `priceQuantity.quantity`, `price`, `unit`, `perUnitOf`
    - `settlementDate.valueDate`, `settlementCurrency`
    - `exerciseTerms.expirationDate.adjustedDate.value` (for NDF fixing)
- [ ] Add test assertions referencing cookbook rule IDs (e.g., assert `RULE-001` compliance)
- [ ] Add CDM path assertions (e.g., `$.trade.tradeDate.value`, `$.trade.counterparty[0].role`)

### Validation Gates
- [ ] Run static analysis: CheckStyle/SpotBugs with baseline rules
- [ ] Enforce ≥80% line coverage (focus on `FxSingleLegMapper`)
- [ ] Performance tests: <100ms per fixture, <50MB heap for 7-test batch

### Deliverables
- [ ] `src/main/java/com/fpml/cdm/fx/FxMapper.java`
- [ ] `src/main/java/com/fpml/cdm/fx/FxSingleLegMapper.java`
- [ ] `src/test/resources/fpml/*.xml` (7 fixtures)
- [ ] `src/test/resources/expected-cdm/*.json` (7 expected CDM outputs)
- [ ] `src/test/java/com/fpml/cdm/fx/FxMapperTest.java`

---

**Decision: ACCEPTED**