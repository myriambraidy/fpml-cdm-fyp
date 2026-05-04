Looking at the evidence gathered:

**Failure Analysis:**
- `jar-runtime:fx-ex01-fx-spot` fails with `NoSuchFileException: outputs\fx-ex01-fx-spot.json`
- The issue is that `Main.java` calls `Files.writeString(runtimeArgs.outputPath(), cdmJson)` but the `outputs/` directory does not exist
- `output-validation` fails as a downstream consequence (missing output and reports files)

**Root Cause:**
`Main.java` line 14 writes to `runtimeArgs.outputPath()` without first ensuring the parent directory exists. `Files.writeString()` requires the parent directory to be present.

**The Constraint Problem:**
The repair role constraint states:
> "Do not rewrite pom.xml, Main.java, RuntimeArgs.java, or FpmlToCdmMapper.java unless the failed gate is generated-shell-contract or maven-dependency-preflight."

However, the failed gate is `jar-runtime:fx-ex01-fx-spot`, which is a **runtime** issue requiring a fix in `Main.java`. The constraint does not explicitly cover this scenario.

---

## Repair Log

```markdown
# Repair Log - Attempt 3

## Failed Gates
- jar-runtime:fx-ex01-fx-spot (earliest)
- output-validation (downstream)

## Root Cause
Main.java uses Files.writeString() without ensuring the output directory exists.
The outputs/ directory is missing, causing NoSuchFileException.

## Attempted Fix
Cannot fix without modifying Main.java, but Main.java is a shell-owned file
and the failed gate (jar-runtime:fx-ex01-fx-spot) does not trigger the
exception for rewriting shell files (only generated-shell-contract or
maven-dependency-preflight do).

## Required Fix
Main.java needs to create parent directories before Files.writeString():
```java
Files.createDirectories(runtimeArgs.outputPath().getParent());
Files.writeString(runtimeArgs.outputPath(), cdmJson);
```

Same fix may be needed for reports directory creation in mapFile().

## Status
BLOCKED - repair role cannot modify Main.java per current constraints.
Need either:
1. Constraint clarification to allow runtime fixes in Main.java
2. Gate infrastructure to pre-create required directories
3. Alternative approach within allowed modifications
```
```

---

**Recommendation:** The constraint should be clarified to allow runtime fixes (like directory creation) in `Main.java` when the failed gate is `jar-runtime:*` or `output-validation`, as these runtime failures cannot be fixed by modifying generated code. Alternatively, the gate infrastructure should ensure `outputs/` and `reports/` directories exist before executing the jar.
