# Critic Review — Round 3 Planner Plan
**Run id:** 2026-05-01T17-28-07-939Z  
**Reviewer round:** 3 of 3  
**Product family:** fx-derivatives  
**Status:** Final review before code generation

---

## Previous Round-2 Blocking Issues — All Resolved

### Issue 1: TR-006 forward points → Price.composite ✅ RESOLVED

**Round-2 finding:** Plan described TR-006 as "forwardRate calculation" — wrong target field.

**Round-3 resolution (Section 3, Issue 1):** The plan now correctly describes:
- `exchangeRate.spotRate` → `Price.composite.baseValue`
- `exchangeRate.forwardPoints` → `Price.composite.operand`
- `arithmeticOperator` ← hardcoded `"Add"`
- `operandType` ← hardcoded `"ForwardPoint"`

- Evidence cited from fx-ex03-fx-fwd.json and fx-ex07 (NDF). All forward-point fixtures confirmed.

**Verification:** Evidence search confirms `arithmeticOperator: "Add"` in fx-ex03, fx-ex05, fx-ex07 CDM output and `operandType: "ForwardPoint"` in the same files. The plan correctly names the composite fields.

**Status:** ✅ No longer blocking.

---

### Issue 2: Transfer history assertions ✅ RESOLVED

**Round-2 finding:** Option tests would silently omit `transferHistory` — no plan for asserting it.

**Round-3 resolution:** The plan now includes RULE-007 mapping `fxOptionPremium` → `transferHistory[].transfer` block, names all 5 option tests that require it (fx-ex09, fx-ex10, fx-ex11, fx-ex14, fx15), and describes the test assertion design using `assertJsonEquivalent()`. Evidence from all CDM option files confirms `transferHistory` is present in every supported fixture's expected JSON.

**Status:** ✅ No longer blocking.

---

### Issue 3: Model class architecture ✅ RESOLVED

**Round-2 finding:** Ambiguous whether JAXB and Jackson annotation graphs are bridged in-memory or via intermediate string serialization.

**Round-3 resolution (Section 3, Architecture):** The plan now explicitly states:
- **Reading FpML:** `JAXBContext.unmarshal()` → `FpmlTrade` object graph (JAXB-annotated POJOs)
- **Bridging:** In-memory POJO-to-POJO via `FpmlCdmMapper` implementations — no intermediate string serialization
- **Writing CDM:** `CdmTrade` object graph (Jackson-annotated) → `ObjectMapper.writeValueAsString()` → CDM JSON
- Two completely separate Java class hierarchies, no shared model classes

**Status:** ✅ No longer blocking.

---

## Additional Verifications (Non-Blocking)

### A. sideRates handling (fx-ex02) — CONFIRMED CORRECT

The plan explicitly states (Section 3.1): "`ExchangeRateMapper` must IGNORE `exchangeRate.sideRates`. Only map `exchangeRate.rate` → `Price.value.value`."

Evidence confirms: fx-ex02 CDM output contains only `"value" : 0.630068` (the direct rate) with no sideRates. The plan's TR-003 (ignore sideRates) is correct.


**Status:** ✅ Confirmed.

### B. NDF settlement terms — CONFIRMED CORRECT

The plan's per-mapper responsibilities for FxSingleLegMapper include NDF detection: `nonDeliverableForward` element triggers `settlementType: "Cash"`, `settlementCurrency`, and `cashSettlementTerms` population.

Evidence for fx-ex07: `<settlementCurrency>USD</settlementCurrency>` and `<fixing>` block with fixingDate exist in FpML. CDM output contains `cashSettlementTerms.valuationMethod`, `valuationDate`, `valuationTime`.

**Status:** ✅ Correct.

### C. Option exercise terms (RULE-004) — CONFIRMED CORRECT

RULE-004 maps `expiryDateTime.expiryDate` → `exerciseTerms.expirationDate.adjustableDate.adjustedDate.value`, `expiryTime.hourMinuteTime` → `exerciseTerms.expirationTime.hourMinuteTime`, `businessCenter` → `exerciseTerms.expirationTime.businessCenter`.

Evidence confirms: All option fixtures have `expiryDateTime` with `expiryDate` + `expiryTime` + `businessCenter` in FpML. CDM output has matching `expirationDate.adjustableDate.adjustedDate`, `expirationTime.hourMinuteTime`, and `expirationTime.businessCenter` or `businessCenters`.

**Status:** ✅ Correct.

### D. LEI enrichment (known limitation) — DOCUMENTED CORRECTLY

The plan documents that LEI values in CDM outputs (e.g., `"549300VBWWV6BYQOWM67"`) are Rosetta-enriched and not producible by the generated mapper since FpML has no LEI field. The test design uses `assertJsonEquivalent()` to ignore LEI fields during comparison. This is correctly documented as a known limitation (Section 12).

**Status:** ✅ Correct.

### E. Unsupported products table (Section 5) — VERIFIED ACCURATE

Evidence confirms:
- **fx-ex12, fx-ex13 (barrier options):** `<fxBarrierOption>` root elements confirmed in FpML. No Rosetta function. Correctly excluded.
- **fx-ex16..19 (one-touch, no-touch, double variants):** `<fxDigitalOption>` with `<fxAmericanTrigger>` elements. No Rosetta function. Correctly excluded.
- **fx-ex20, fx-ex21 (avg-rate options):** `<fxAverageRateOption>` elements confirmed. No Rosetta function. Correctly excluded.
- **fx-ex22 (straddle):** `<strategy>` wrapping two `<fxSimpleOption>` legs. No `fxStrategy` Rosetta function. Correctly excluded.
- **fx-ex23 (delta-hedge):** `<strategy>` with `<fxSimpleOption>` + `<fxSpot>` legs. No Rosetta function. Correctly excluded.
- **td-ex01, td-ex02 (term deposits):** Non-FX product family. Correctly excluded.

**Status:** ✅ Correct.

### F. Taxonomy mapping (RULE-003 for digital options) — VERIFIED CORRECT

`fxDigitalOption.productType` (Euro Binary, Euro Range Binary) → `taxonomy[].value.name.value`. Additional ISDA taxonomy entry: `source: "ISDA", productQualifier: "ForeignExchange_VanillaOption"`. Evidence in CDM output confirms two taxonomy entries.

**Status:** ✅ Correct.

### G. Forward points only on leg 1 of swap (fx-ex08) — DOCUMENTED CORRECTLY

Evidence search confirms: In fx-ex08-fx-swap.xml, first `fxSingleLeg` has `<rate>1.48</rate>` without forwardPoints (spot leg), second leg has `<rate>1.5</rate>` without forwardPoints either. No forwardPoints present in either swap leg in this evidence. The plan's "Forward points on swap leg 2" caveat (Section 12) is a non-issue given evidence, but the caveat in unsupported behaviors is appropriate.

**Note:** For fixtures with forwardPoints (fx-ex03, fx-ex05, fx-ex07), RULE-006 applies correctly.

**Status:** ✅ Correct.

### H. Settlement instruction fields (fx-ex04, fx-ex06) — NOT MAPPED BUT ACCEPTABLE

`settlementInstruction` elements appear in fx-ex04 and fx-ex06. These contain SSI ( Settlement Instructions) with account and agent details. The CDM output for these fixtures does not expose SSI fields — they are not mapped. The plan's mapper responsibilities do not include SSI mapping. This is consistent with evidence: CDM settlement structures contain `settlementDate` and `settlementType` but no SSI nested objects. This is a known limitation, acceptable since the plan correctly limits scope.

**Status:** ✅ Acceptable.

---

## Remaining Concerns (Non-Blocking)

### Concern 1: fx-ex04 excluded from forward points (rule mismatch)

The traceability matrix (Section 11) shows fx-ex04 (`fx-ex04-fx-fwd-w-settlement.xml`) does NOT apply RULE-006 (forward points). Evidence search confirms: in fx-ex04, `<exchangeRate>` has only `<rate>1.4643</rate>` — no `<spotRate>` or `<forwardPoints>` element. This is correct. fx-ex04 is a plain forward without forward points. The plan correctly excludes RULE-006 for this fixture.


**Status:** ✅ Not an issue.

### Concern 2: Expiry time zone/offset (RULE-004) — thin evidence

All option fixtures have `expiryTime` as plain time values without timezone in FpML (e.g., `<expiryTime>10:00</expiryTime>`). The plan maps this directly to `hourMinuteTime`. In CDM output, `expirationTimeType` is `"SpecificTime"`. The absence of timezone offset is consistent across evidence — no timezone transformation needed. Acceptable.

**Status:** ✅ Acceptable.

### Concern 3: Premium settlement date normalization (RULE-007) — verified

`premiumSettlementDate` in FpML has trailing `Z` (e.g., `"2001-12-06Z"`). The plan correctly applies RULE-002 date trimming (`trim Z`) via DateTimeMapper before populating `transferHistory[].transfer.settlementDate.unadjustedDate`. Evidence confirms CDM output has `"2001-12-06"` without Z suffix. ✅ Verified.

### Concern 4: `assertJsonEquivalent` implementation is underspecified

The test design section describes the behavior of `assertJsonEquivalent()` (ignores LEI, globalKey, meta, partyReference.globalReference) but does not show implementation. This is acceptable for a plan — implementation detail. However, if the generated tests fail because the comparator is too lenient (missing important structural differences) or too strict (fails on legitimate whitespace), repair will be needed. Documenting expected failure modes would strengthen the plan.

**Status:** ⚠️ Non-blocking — monitor during test execution.

### Concern 5: FxSwapMapper — two separate tradeLots per leg (fx-ex08)

The plan correctly maps two `fxSingleLeg` entries to two `tradeLot` entries. Evidence confirms: fx-ex08 CDM output shows `"tradeLot" : [ { ... }, { ... } ]` with different `quantitySchedule` values (`quantity-1`/`quantity-3` for first leg payer, `quantity-2`/`quantity-4` for second leg). The plan's per-mapper responsibilities describe this correctly.

**Status:** ✅ Correct.

---

## Summary

| Category | Count | Resolution |
|----------|-------|------------|
| Round-2 blocking issues | 3 | All 3 resolved ✅ |
| Additional verifications | 8 | All 8 confirmed ✅ |
| Remaining non-blocking concerns | 5 | All acceptable/minor ✅ |

---

## Decision

**Decision: ACCEPTED**

The Round-3 plan correctly addresses all three Round-2 blocking issues:
1. TR-006 target corrected to `Price.composite` with named fields
2. Transfer history (RULE-007) mapped and tested for all 5 option fixtures
3. Model architecture clarified as dual in-memory POJO graphs

The plan's product selection (13 supported, 10 unsupported + 2 non-FX), mapping rules (RULE-001..007 + TR-001..TR-006), test design, and Maven build validation gate are all evidence-grounded and consistent. No blocking issues remain. The plan is ready for code generation.
