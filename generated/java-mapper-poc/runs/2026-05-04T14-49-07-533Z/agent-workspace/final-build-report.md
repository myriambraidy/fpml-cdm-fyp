# Final Build Report

**Run ID:** `2026-05-04T14-49-07-533Z`  
**Product Family:** `fx-derivatives`  
**Status:** ❌ **BLOCKED**

---

## Gate Summary

| Gate | Status | Notes |
|------|--------|-------|
| `typescript-typecheck` | ✅ Passed | — |
| `cdm-rosetta-preflight` | ✅ Passed | Using `org.finos.cdm:cdm-java:6.7.0` |
| `generated-project-structure` | ✅ Passed | Maven project structure present |
| `generated-shell-contract` | ✅ Passed | Shell contract valid |
| `source-hygiene` | ✅ Passed | No invalid generated text |
| `generated-java-static-sanity` | ⚠️ Passed in initial gates, but **later failed** (see below) | Static sanity checks were *marked passed* in early reports, but compilation errors later revealed issues indicating this gate did not catch them all |
| `java-reference-check` | ⚠️ Passed in initial gates, but **later failed** | Similar to above; reference checks were not sufficient to prevent downstream compilation errors |
| **`maven-compile`** | ❌ **FAILED** | Primary blocking failure |
| All downstream gates | ⏭️ Skipped | Due to `maven-compile` failure |

---

## Failed Gate Details

### ❌ `maven-compile`

```bash
[ERROR] COMPILATION ERROR :
[ERROR] .../FxSingleLegMappers.java:[5,28] cannot find symbol
  symbol:   class SettlementTerms
  location: package cdm.product.template
...
[ERROR] Multiple cannot find symbol errors across:
  - SettlementTerms, CashSettlementTerms, SettlementTypeEnum
  - SettlementPayout, PayerReceiver
  - ResolvablePriceQuantity
  - PartyReference
  - Asset, Cash
  - PriceSchedule, PriceTypeEnum
  - FpmlFxSingleLeg
...
```

- **Error Type:** Missing CDM class references during Java compilation.
- **Root Cause:** The generated code imports and references classes that are either:
  - Not included in the `cdm-java` dependency (`6.7.0`), or
  - Not correctly resolved at compile time due to missing or misaligned artifacts.

> Despite initial reports marking `generated-java-static-sanity` and `java-reference-check` as passed, these gates failed to catch the core compilation issues — indicating either incomplete validation logic or mismatched CDM model versions.

---

## impacted Gates & Downstream Effects

All gates following `maven-compile` were skipped:

- `maven-test-compile`
- `maven-test`
- `maven-package`
- All `jar-runtime:*` fixtures (7 total)
- `output-validation`
- All `rosetta-validation:*` fixtures (7 total)

---

## Repair Attempts

✅ Attempted **3 repair cycles**, all failing to resolve the compilation failures.

- Repair 1 (15:02:13 → 15:09:23)
- Repair 2 (15:09:27 → 15:16:14)
- Repair 3 (15:16:19 → 15:18:41)

All 3 repairs retained the same `maven-compile` error.

---

## Recommendation

**BLOCKED — Requires repair:**

1. **Verify CDM version alignment**: Ensure `cdm-java:6.7.0` contains all referenced classes (`SettlementTerms`, `CashSettlementTerms`, `ResolvablePriceQuantity`, etc.).  
   → Check CDM changelog or `cdm.product.template` module exports.

2. **Check codegen model bindings**:  
   → Generated mapper uses `SettlementPayout` from `cdm.product.common.settlement`, but this class may be missing or renamed in `6.7.0`.  
   → Similarly, `FpmlFxSingleLeg` should be validated as present in the Fpml XML-to-CDM model.

3. **Regenerate with updated/patched model**:  
   If classes are missing in `6.7.0`, either:
   - Downgrade/upgrade CDM to a compatible version, *or*
   - Regenerate with updated schema/generator that produces references aligned with the dependency.

4. **Validate compile-time dependencies** in `pom.xml`:  
   Ensure the `dependency` block matches expected transitive dependencies of the CDM modules used.

---

## ✅ Summary

| Criterion | Status |
|----------|--------|
| **Build Promoted?** | ❌ No |
| **Maven Compile?** | ❌ Failed |
| **Gates Passed?** | 6 / 17 |
| **Ready for Release?** | ❌ No — blocked by missing CDM symbol resolution |

**Next Action:** Investigate CDM class availability and correct symbol mismatches in generated Java code.