# Final Build Report

**Run ID:** `2026-05-03T20-06-11-601Z`  
**Product Family:** `fx-derivatives`  
**Base Output:** `generated/java-mapper-poc`  
**Status:** ❌ **BLOCKED**

---

## Summary

The build was **not promoted**. After three repair attempts, two gates consistently failed:

- `jar-runtime:fx-ex01-fx-spot`
- `output-validation`

The root cause is a **runtime file-path issue**: the generated mapper fails to create output directories or resolve relative paths on Windows, resulting in missing output and report files.

---

## Failed Gates

### 1. `jar-runtime:fx-ex01-fx-spot`
- **Command:**  
  `java -jar target/fpml-cdm-mapper.jar fixtures/fx-ex01-fx-spot.xml --output outputs/fx-ex01-fx-spot.json --reports reports/fx-ex01-fx-spot`
- **Exit Code:** `1`
- **Error Snippet:**
  ```
  Exception in thread "main" java.nio.file.NoSuchFileException: outputs\fx-ex01-fx-spot.json
  	at java.base/sun.nio.fs.WindowsException.translateToIOException(WindowsException.java:85)
  	...
  	at com.fpml.cdm.fx.mapper.Main.main(Main.java:14)
  ```
- **Root Cause:**  
  The `Main.main(...)` attempts to write to `outputs/fx-ex01-fx-spot.json`, but the `outputs/` directory does **not exist** or is not created before writing. The path is interpreted as a Windows-style relative path, but the directory creation logic in `Main.java` (likely line 14) is missing or flawed.

---

### 2. `output-validation`
- **Command:**  
  Validate runtime fixture CDM JSON and sidecar reports.
- **Exit Code:** `1`
- **Error: Missing Files**
  ```
  outputs/fx-ex01-fx-spot.json
  reports/fx-ex01-fx-spot/mapping-report.json
  reports/fx-ex01-fx-spot/validation-report.json
  reports/fx-ex01-fx-spot/traceability-report.json
  reports/fx-ex01-fx-spot/unsupported-scope.json
  ```
- **Root Cause:**  
  Direct consequence of the first failure — since `jar-runtime` failed to produce any outputs, the validation gate could not proceed.

---

## Propagated Failures

| Gate | Dependency | Status |
|------|------------|--------|
| `jar-runtime:fx-ex01-fx-spot` | — | ❌ Failed |
| `output-validation` | `jar-runtime` | ❌ Blocked downstream |

No other gates failed; all compile/test and hygiene gates (`maven-compile`, `typescript-typecheck`, etc.) passed successfully.

---

## Required Repair

### Action Items

1. **Ensure output directories exist before writing:**
   - Modify `com.fpml.cdm.fx.mapper.Main.java` (likely around line 14).
   - Add pre-flight logic to create `outputs/` and `reports/fx-ex01-fx-spot/` directories using `Files.createDirectories()`.

2. **Prefer platform-independent paths:**
   - Avoid relying on relative paths that may be interpreted differently on Windows (e.g., backslashes vs. forward slashes).
   - Prefer `Path.of("outputs", "fx-ex01-fx-spot.json")` and `Paths.get(...).normalize()`.

3. **Example Fix (Java snippet):**
   ```java
   Path outputPath = Paths.get("outputs", "fx-ex01-fx-spot.json");
   Path outputDir = outputPath.getParent();
   if (outputDir != null) {
       Files.createDirectories(outputDir);
   }
   Files.writeString(outputPath, jsonString);
   ```

4. **Retest with:**
   ```bash
   java -jar target/fpml-cdm-mapper.jar fixtures/fx-ex01-fx-spot.xml --output outputs/fx-ex01-fx-spot.json --reports reports/fx-ex01-fx-spot
   ```

---

## Conclusion

✅ **Build passed static and compilation gates.**  
❌ **Runtime execution is broken due to missing directory creation.**  
➡️ **Blocked for repair.** Fix `Main.java`, regenerate, and re-run.