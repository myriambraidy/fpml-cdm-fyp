# Final Build Report

**Run ID**: `2026-05-03T15-04-45-196Z`  
**Product Family**: `fx-derivatives`  
**Status**: **BLOCKED**  
**Gate Result**: **Failed**

---

## Summary

The generated Java Maven mapper project for `fx-derivatives` **fails all runtime and packaging gates**. While initial validation checks (`typescript-typecheck`, `generated-project-structure`, `source-hygiene`, `java-reference-check`) passed, the build system could not proceed due to critical issues in Maven dependency resolution, JAR creation, and output generation.

The project **must be repaired** before it can be promoted.

---

## Failed Gates

| Gate Name | Command | Exit Code | Failure Reason |
|-----------|---------|-----------|----------------|
| `maven-test` | `mvn test` | 1 | Missing test dependency: `org.xmlunit:xmlunit-core:jar:2.13.0` not found in Maven Central cache |
| `maven-package` | `mvn package` | 1 | Same root cause as `maven-test`; build fails during dependency resolution |
| `jar-runtime` | `java -jar target/fpml-cdm-mapper.jar ...` | 1 | `target/fpml-cdm-mapper.jar` does not exist — build did not complete |
| `output-validation` | `validate generated-cdm.json and sidecar reports` | 1 | Missing output files: `generated-cdm.json`, `reports/mapping-report.json`, `reports/validation-report.json`, `reports/traceability-report.json`, `reports/unsupported-scope.json` |

---

## Root Cause Analysis

1. **Maven Build Failure**: The build fails during dependency resolution because `org.xmlunit:xmlunit-core:jar:2.13.0` is not present in the local or remote Maven repositories (central). This is likely due to:
   - Incorrect version in `pom.xml` (`2.13.0` may be unavailable or typosuch as missing `2.13.x` version)
   - Network or caching issues preventing Maven Central lookup
   - Missing explicit `<repositories>` declaration for Maven Central

2. **Cascading Failures**: Because the Maven build fails, no JAR is produced (`target/fpml-cdm-mapper.jar` missing), and thus runtime gates and output validation fail automatically.

3. **No Runtime Execution Possible**: Since the runtime JAR does not exist and tests cannot run, all output-generation and validation gates are skipped or fail due to missing artifacts.

---

## Required Repairs

### 1. Fix Maven Dependencies (`pom.xml`)

**Action**: Update `pom.xml` to use a known-available version of `xmlunit-core`.

- **Current (failing)**: `<version>2.13.0</version>`
- **Recommended fix**: Use `<version>2.10.0</version>` or the latest stable `<version>2.13.1</version>`.

```xml
<dependency>
  <groupId>org.xmlunit</groupId>
  <artifactId>xmlunit-core</artifactId>
  <version>2.10.0</version>
  <scope>test</scope>
</dependency>
```

Also ensure the `pom.xml` explicitly declares the Maven Central repository:

```xml
<repositories>
  <repository>
    <id>central</id>
    <url>https://repo.maven.apache.org/maven2</url>
  </repository>
</repositories>
```

### 2. Rebuild and Repackage

After fixing the dependency:
- Run `mvn clean test` to verify tests pass.
- Run `mvn clean package` to produce the JAR in `target/`.

### 3. Validate Runtime Execution

Ensure the generated `target/fpml-cdm-mapper.jar` is executable:
```bash
java -jar target/fpml-cdm-mapper.jar fixtures/fx-ex01-fx-spot.xml --output generated-cdm.json --reports reports
```

Confirm output files are generated:
- `generated-cdm.json`
- `reports/mapping-report.json`
- `reports/validation-report.json`
- `reports/traceability-report.json`
- `reports/unsupported-scope.json`

### 4. Output Validation

Validate generated CDM output against expected fixtures to ensure correctness:
- Check JSON structure matches expected CDM summary
- Validate that all required fields (trade identifiers, party references, dates, quantities) are present
- Run output validation gate again

---

## Recommendation

**Block this build from promotion.** The jar must not be deployed to production or released until the above failures are fully resolved and gates pass.

**Next Steps**:
- Fix the Maven dependency issue in `pom.xml`.
- Re-run `mvn clean package`.
- Re-run gates in full.
- Only if all gates pass, promote the build.

---

*Generated automatically by the build-reviewer role.*