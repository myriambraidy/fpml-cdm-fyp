Now I have all the evidence I need. Let me provide the critique review with my decisions on each item.

---

## Critic Review — Round 2 Planner Plan

### Blocking Issues

**1. TR-006 description does not match CDM evidence — VALID (BLOCKING)**

The plan describes TR-006 as "Forward points → `forwardRate` calculation." The actual CDM output for fx-ex03 (`fx-ex03-fx-fwd.xml`) shows:

```json
"composite": {
  "baseValue": 0.913,
  "operand": 0.0045,
  "arithmeticOperator": "Add",
  "operandType": "ForwardPoint"
}
```

This is a `Price.composite` object — not a flat `forwardRate` field. The plan's description in Section 3 (TR-006), Section 5 (FxSwapMapper), and Section 7 (unsupported behaviors) all describe this incorrectly, which will cause the generated `ExchangeRateMapper` to map to the wrong target field. **The plan must name the correct CDM structure before generation proceeds.**

---

**2. Transfer history / premium assertions not addressed — VALID (BLOCKING)**

All 13 supported option fixtures (fx-ex09, fx-ex10, fx-ex11, fx-ex14, fx-ex15) and all 11 unsupported option/barrier/avg-rate fixtures contain `transferHistory` in their CDM output. I verified this by searching `data_to_learn_from/cdm_parallel/fx-derivatives/` — every single option JSON file has `"transferHistory" : [ {` at the expected JSON path. For example, fx-ex09 (European option) has a `transferHistory` block recording the premium payment with `currency: "USD"`, `amount: 36900`, `settlementDate: 2001-12-06`, and party references derived from `fxOptionPremium.payerPartyReference` / `receiverPartyReference`.

The plan mentions "Map `fxOption.premium` → CDM price" in Section 5.3 but never mentions `transferHistory`. This is a silent test gap: if the mapper omits `transferHistory`, all 5 option tests will fail their CDM JSON comparisons against the pre-existing ground-truth files.

---

**3. Model class annotation strategy is ambiguous — VALID (BLOCKING)**

Section 4 states:
- `FpmlTrade.java` ← "FpML DOM model (JAXB)"
- `CdmTrade.java` ← "CDM model (Jackson-annotated)"

The plan does not clarify:
1. Whether the mapper reads FpML XML via `JAXBContext` unmarshalling into an `FpmlTrade` object graph, or uses some other mechanism
2. Whether `CdmTrade` is a fully-populated POJO that gets serialized to JSON via `ObjectMapper`, or whether intermediate string-based transformation occurs
3. How the two object graphs are bridged in-memory during mapping (the mapper receives what? produces what?)

This architectural gap will cause code generation to stall or produce incorrect wiring. The plan already mentions "JAXB (FpML parsing), Jackson (JSON)" in dependencies but does not say: *"The mapper reads XML via JAXB into `FpmlTrade`, transforms to `CdmTrade` in memory, then serializes `CdmTrade` to JSON via Jackson ObjectMapper."*

---

### Non-Blocking Concerns

**4. Term deposit exclusion is correct — NON-ISSUE (informational)**

`td-ex01` and `td-ex02` are confirmed non-FX. The plan correctly excludes them. No action needed.

**5. Side rates (fx-ex02) not explicitly designed for — VALID (minor)**

The FX FpML fixture `fx-ex02-spot-cross-w-side-rates.xml` contains `<sideRates>` with base-USD cross rates. The CDM output shows only the direct rate (`0.630068`). The plan does not explicitly state that `sideRates` must