## Critic Review — Round 2 Planner Plan

### Blocking Issues

**1. TR-006 description does not match CDM evidence**
- The plan states: "Forward points → forwardRate calculation" (TR-006, Section 3)
- Actual CDM output for fx-ex06 (EUR/USD fwd with forwardPoints 0.0045):
  ```json
  "composite": {
    "baseValue": 0.9130,
    "operand": 0.0045,
    "arithmeticOperator": "Add",
    "operandType": "ForwardPoint"
  }
  ```
- The target is NOT a flat `forwardRate` field — it is a `Price.composite` object with `baseValue`, `operand`, `arithmeticOperator`, `operandType`. The plan's description must be updated to reflect the correct CDM structure, or the generated mapper will produce incorrect output.

**2. Transfer history / premium assertions not addressed**
- CDM output for options (fx-ex09, fx-ex10, fx-ex11, fx-ex14, fx-ex15) includes a `transferHistory[].transfer` block containing premium payment details: currency, amount, settlement date, payer/receiver party references, and transfer expression.
- The 5 option tests (European, American, NDF, Euro Digital, Range Digital) will fail to match expected output if the mapper omits `transferHistory`. The plan's test design (Section 5.3 / Section 4 test classes) does not mention asserting `transferHistory`. This creates a silent test gap.

**3. Model class annotation strategy is ambiguous**
- Section 4 of the plan states:
  - `FpmlTrade.java` ← "FpML DOM model (JAXB)"
  - `CdmTrade.java` ← "CDM model (Jackson-annotated)"
- The plan does not specify how the Java mapper reads FpML XML. If `FpmlTrade` uses JAXB (`@XmlRootElement`, etc.), the mapper must use `JAXBContext` to unmarshal. If `CdmTrade` uses Jackson (`@JsonProperty`, etc.), the mapper must use `ObjectMapper` to serialize. These are two different object graphs. The plan does not clarify whether there is a single unified object model or two separate ones, and whether intermediate transformation happens in-memory or via string serialization. Code generation will stall on this ambiguity.

---

### Non-Blocking Concerns

**4. Term deposit exclusion is correct but not tested**
- `termDeposit` exists in the Rosetta `MapCounterpartyList` switch and would produce a CDM output if ingested, but the plan correctly excludes it per the scope rule. This is handled correctly. Non-issue, just informational.

**5. Side rates (fx-ex02) not explicitly designed for**
- fx-ex02 has `exchangeRate.sideRates` (cross currency with base USD side rates) in addition to the direct rate. The CDM output shows only the direct rate (`0.630068`). The plan's ExchangeRateMapper needs to explicitly handle `sideRates` (which should be ignored / not mapped to CDM, since CDM output shows only the direct rate). The plan's per-mapper responsibilities do not mention this.

**6. NDF fixing terms not explicitly mapped**
- The plan mentions "For fx-ex07 (NDF): map `nonDeliverableForward` → `nonDeliverableSettlement terms`" in passing. The CDM output for fx-ex07 shows `settlementType: "Cash"`, `settlementCurrency: "USD"`, `cashSettlementTerms` with `valuationMethod`, `valuationDate`, and `valuationTime` — all fields that must be populated. The plan does not detail which mapper fields/conditions cover this.

**7. Strategy wrapper (fx-ex22 straddle, fx-ex23 delta-hedge) correctly excluded**
- `fxEx22-straddle.xml` uses `<strategy>` wrapping two `fxSimpleOption` legs. Rosetta has no `fxStrategy` case in any product switch. The plan correctly does not support these. No action needed.

**8. Barrier option (fx-ex12) correctly excluded**
- Rosetta's product switches do not include `fpml.FxBarrierOption`. The plan correctly excludes fx-ex12 and fx-ex13. Confirmed against blocks.json.

**9. LEI enrichment present in CDM but not in plan**
- All CDM outputs contain LEI codes (e.g., `"549300VBWWV6BYQOWM67"`) in `party[].partyId[].identifier.value` that are not present in FpML XML party elements. This is Rosetta-enriched, not FpML-mapped. The plan does not address this. For test generation, the test fixtures' expected CDM JSON files must contain these LEI values — but if the Java mapper cannot generate LEIs (since FpML has no LEI), the comparison will fail. The plan should clarify that these expected JSON files are pre-existing ground truth not producible by the generated mapper, or that the mapper should not attempt to produce party LEIs.

**10. Forward points field name not reflected in ExchangeRateMapper design**
- TR-006 is described but no `ExchangeRateMapper.java` field/method is named for forward points or composite pricing. The generated code may omit this mapping.

---

### Decision

**Decision: NEXT_ROUND_REQUIRED**

The plan is substantially correct in scope (13 products, evidence base, unsupported fixtures, rule table). The product selection and unsupported-product table are accurate. Three items must be resolved before generation can proceed reliably:

1. Correct TR-006 description: composite price structure, not `forwardRate`
2. Add transfer history assertions to option test design
3. Clarify model class architecture (JAXB vs. Jackson, single vs. dual object graph)