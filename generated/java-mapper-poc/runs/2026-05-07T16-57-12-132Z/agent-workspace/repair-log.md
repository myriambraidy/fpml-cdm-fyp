```markdown
# Repair Attempt 2 — java-reference-check Gate Failure

## Root Cause Summary

The `java-reference-check` gate failed because:

> `"Project import does not match a generated public type."`  
> — import `com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper` in `Main.java`

This indicates the `GeneratedFpmlToCdmMapper` class **does not exist** in the `src/main/java/com/fpml/cdm/fx/mapper/generated/` directory (or was not generated with that name or `public class` modifier).

This is a *static-java* gate failure; it blocks all downstream Maven and runtime gates.

---

## Evidence Summary

- **Failed gate**: `java-reference-check`
- **Erroneous import**: `com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper`
- **Expected but missing**: `GeneratedFpmlToCdmMapper.java` with `public class GeneratedFpmlToCdmMapper`

No Java file excerpt was available from the gate output, so the exact generated class listing could not be inspected directly.

However, based on:
- The shell contract defining `GeneratedFpmlToCdmMapper` as the generated implementation class,
- The approved CDM API contract confirming only approved classes may be used,
- The semantic recipe requiring `TradeState` as output root,
- The Rosetta contract mapping `MapTradeState` as the top-level Rosetta function,

…we infer the most likely cause:

✅ The generator intended to emit a `public class GeneratedFpmlToCdmMapper`  
❌ But either:
- The file was not generated at all, or  
- It was generated as a `class` without `public`, or  
- It was given a different name.

No evidence suggests a bug in `Main.java`’s logic—only the *reference* to the expected generated class failed.

---

## Repair Focus

Only **one file** needs verification/patch:

- `src/main/java/com/fpml/cdm/fx/mapper/Main.java`

The fix is **not** to change mapping logic, nor to introduce new CDM classes—only to ensure:
- The generated mapper class exists, is `public`, named exactly `GeneratedFpmlToCdmMapper`, and
- Its fully qualified name matches the import.

If the generated class is named differently (e.g., `FpmlToCdmMapperImpl`), then `Main.java` should import *that*, and the contract document (`java-shell-contract.md`) must be updated.

---

## Action Plan (to be executed by agent)

1. **Query generated folder**  
   `ls -la generated\java-mapper-poc\runs\2026-05-07T16-57-12-132Z\agent-workspace\src\main\java\com\fpml\cdm\fx\mapper\generated\`

2. **If `GeneratedFpmlToCdmMapper.java` exists**  
   → Ensure it declares `public class GeneratedFpmlToCdmMapper implements FpmlToCdmMapper` (or whatever interface is expected).

3. **If file is missing or misnamed**  
   → Patch `Main.java` to import the correct generated name, *or*  
   → Fix the generator to emit `public class GeneratedFpmlToCdmMapper` with that exact name.

4. **Validate**  
   After patch, re-run gates — `java-reference-check` must pass.

---

## Notes

- This gate is *not* a compilation or logic issue. It’s a **name/visibility mismatch** between the runtime shell and generated artifact.
- Do **not** touch `pom.xml`, `RuntimeArgs.java`, `FpmlToCdmMapper.java`, or semantic logic unless the root cause reveals missing interface signatures.
- No Rosetta or CDM model changes are needed for this failure.

---

## Next Step

➡️ Generate or verify `GeneratedFpmlToCdmMapper.java`, and fix the import in `Main.java` accordingly.
```
