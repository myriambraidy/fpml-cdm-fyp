# 🛑 Build Report — java-mapper-poc  
**Run ID**: `2026-05-06T11-21-15-358Z`  
**Product Family**: `fx-derivatives`  
**Status**: ❌ **BLOCKED**  
**Date**: 2026-05-06  

---

## 🔍 Summary

The build **failed during the `java-reference-check` gate**, and all three repair attempts were exhausted without resolution.

The root cause is an **invalid or mismatched import statement** in the generated Java source — specifically, a missing or incorrectly named generated class reference.

---

## 🚫 Failed Gates

| Gate | Status | Details |
|------|--------|---------|
| `java-reference-check` | ❌ Failed | `Project import does not match a generated public type.`<br>File: `src\main\java\com\fpml\cdm\fx\mapper\Main.java`<br>Import: `com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper` |

> ⚠️ **All downstream gates were skipped** due to this gate failing early in the pre-Maven stage (including CDM usage checks, Maven compile/test/package, and runtime execution tests).

---

## 📦 Blocked Artifacts

- **JAR artifact**: **❌ Not promoted**
- **Generated Java code**: Invalid reference prevents compilation and packaging

---

## 🛠 Required Fixes

### 1. **Repair `Main.java` Import Reference**
- **Issue**: The import `com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper` does not resolve to a public class in the generated code.
- **Fix**:
  - Verify if `GeneratedFpmlToCdmMapper` was generated correctly.
  - Check if the class name or package path differs (e.g., is it `FpmlToCdmMapper`? Is the `generated` folder under `mapper` or elsewhere?).
  - Ensure the class is `public` and not package-private or missing due to mapping rules.
  - Confirm the `package` declaration matches the import path.

### 2. **Re-run Builder After Fix**
- Once the incorrect or stale import is corrected in `Main.java`, the build pipeline can resume and pass subsequent gates.

---

## ✅ Gates Passed

| Gate | Status |
|------|--------|
| `typescript-typecheck` | ✅ |
| `cdm-rosetta-preflight` | ✅ |
| `generated-project-structure` | ✅ |
| `generated-shell-contract` | ✅ |
| `source-hygiene` | ✅ |
| `generated-java-static-sanity` | ✅ |

---

## 🧠 Observations

- The `generated-shell-contract` gate passed, implying the interface contract was generated, but the **implementation (or reference to it) is misaligned**.
- No `cdm-java-api-usage` violations were reported — the issue is isolated to **source-level reference integrity**, not API misuse.

---

## ✅ Next Steps

1. Inspect `src/main/java/com/fpml/cdm/fx/mapper/Main.java`.
2. Check whether `GeneratedFpmlToCdmMapper` exists in `src/main/java/com/fpml/cdm/fx/mapper/generated/`.
3. Correct or regenerate the class reference if needed.
4. Re-trigger build with updated generator logic or source.

--- 

📌 **Final Verdict**: **BLOCKED** due to invalid Java import reference in `Main.java`.  
🛠 Repair target: Fix the `GeneratedFpmlToCdmMapper` import path or ensure the class is generated and public.

> 🔔 *Tip: If the class was intentionally omitted from generation (e.g., manual implementation), ensure the import is replaced with a valid stub or comment to prevent future failures.*