# Decision: NEXT_ROUND_REQUIRED

## Summary

The reviewer raised two **blocking issues** about non-existent CDM Java classes being used in the plan:
1. `cdm.observable.asset.ResolvablePriceQuantity` — not in CDM Java API
2. `cdm.product.common.settlement.SettlementPayout` — wrong package; actual is `cdm.product.template.SettlementPayout`

These require correction before implementation. Other concerns (helper function citations, runtime fixture filenames, builder method examples) are **non-blocking improvements**.

---

## Critique Item-by-Item Review

| # | Critique Item | Validity | Reason |
|---|---------------|----------|--------|
| 1 | ❌ Missing machine-checked fixture-to-ID mapping | **ACCEPTED (non-blocking)** | Plan lists correct runtime fixture IDs and they match the evidence index. It's acceptable as-is. |
| 2 | ❌ Cited CDM classes not in preflight (`ResolvablePriceQuantity`, `SettlementPayout`) | **ACCEPTED (blocking)** | These classes are negative or misnamed: `ResolvablePriceQuantity` and `SettlementPayout` (wrong package) must be replaced. |
| 3 | ❌ Rosetta function usage lacks citing for single-leg mapping | **ACCEPTED (non-blocking)** | While not all Rosetta functions are explicitly listed, the plan references the correct functions for FX single-leg mapping. This is acceptable for a planning round. |
| 4 | ⚠️ “ResolvablePriceQuantity” in CDM Java design (repeated) | **ACCEPTED (blocking)** | Reiteration of item 2; must be corrected. |
| 5 | ✅ No raw JSON construction mentioned | **REJECTED (no issue)** | Plan correctly uses CDM Java model as internal representation. |
| 6 | ✅ No FpML Java input model classes referenced | **REJECTED (no issue)** | Plan correctly avoids `FpmlFxSingleLeg` and uses XML parsing. |
| 7 | ✅ FX support properly gated | **REJECTED (no issue)** | Plan clearly limits scope to `fx-single-leg`. |
| 8 | ✅ No unsupported CDM Java classes cited beyond negatives | **REJECTED (no issue)** | Only misnamed classes need fixing. |
| 9 | 📝 Rosetta helper functions not all listed | **ACCEPTED (non-blocking)** | Missing helper function citations are minor; not blocking. |
|10 | 📝 No runtime fixture filenames referenced | **ACCEPTED (non-blocking)** | While helpful, filenames are not required for the planning round. |
|11 | 📝 CDM classes listed without builder method guidance | **ACCEPTED (non-blocking)** | Not required for planning; can be added in implementation. |

---

## Required Fixes for Next Round

### 🔴 Critical Fixes (Blocking)
1. **Replace `cdm.observable.asset.ResolvablePriceQuantity` with `cdm.observable.asset.PriceQuantity`**  
   - In all occurrences (e.g., “Core CDM Objects” and “Mapping responsibilities” sections)
2. **Replace `cdm.product.common.settlement.SettlementPayout` with `cdm.product.template.SettlementPayout`**  
   - Ensure consistent use in “Core CDM Objects” and “Mapping responsibilities”

### 🟡 Non-blocking Improvements (Strongly Recommended)
3. **Add Rosetta helper function citations**  
   - Include `MapPayerReceiver`, `MapPayerReceiverModelToCounterpartyList`, `MapPayerReceiverToAccountPartyReference`
4. **List runtime fixture filenames (optional)**  
   - e.g., `fx-ex01-fx-spot.xml`, `fx-ex02-spot-cross-w-side-rates.xml`, etc.
5. **Add a minimal `Trade` builder example**  
   - e.g., `Trade.builder().setProduct(...).addCounterparty(...).build()`  
   - Demonstrates understanding of builder API constraints.

---

## Revised Implementation Checklist

| Task | Status | Details |
|------|--------|---------|
| ✅ Correct CDM Java class names | 🔴 Pending | Replace `ResolvablePriceQuantity` and `SettlementPayout` (wrong package) with correct names. |
| ✅ Add helper Rosetta function citations | 🟡 Pending | Explicitly list `MapPayerReceiver`, `MapPayerReceiverModelToCounterpartyList`, `MapPayerReceiverToAccountPartyReference`. |
| ✅ Optional: include runtime fixture filenames | 🟡 Pending | Add a note listing XML filenames used in runtime fixtures. |
| ✅ Optional: add builder example | 🟡 Pending | Include a minimal builder chain for `Trade`. |
| ✅ Validate against `cdm-java-api-pack.md` | 🔴 Before next round | Confirm all referenced classes exist and have the expected builder methods. |
| ✅ Re-run plan validation | 🔴 Before next round | Use `plan-validation.md` to ensure all sections pass structured checks. |

---

## Next Steps

The planner must:
- **Fix the two blocking class name issues**.
- Add Rosetta helper function citations for clarity.
- Re-run validation.
- Submit a revised plan for review.

Once corrected, the plan is otherwise well-structured, aligned with product scope, and aligned with runtime fixtures.

✅ Decision: **NEXT_ROUND_REQUIRED**