# Final Build Report

Status: blocked
Run id: 2026-05-08T16-44-20-259Z

## Failure Classification

- Earliest failed gate: java-reference-check
- Category: static-java
- Hidden downstream gates: cdm-java-api-usage, maven-dependency-preflight, maven-compile, maven-test-compile, maven-test, maven-package, jar-runtime:fx-ex01-fx-spot, jar-runtime:fx-ex02-spot-cross-w-side-rates, jar-runtime:fx-ex03-fx-fwd, jar-runtime:fx-ex04-fx-fwd-w-settlement, jar-runtime:fx-ex05-fx-fwd-w-ssi, jar-runtime:fx-ex06-fx-fwd-w-splits, jar-runtime:fx-ex07-non-deliverable-forward, output-validation, rosetta-validation:fx-ex01-fx-spot, rosetta-validation:fx-ex02-spot-cross-w-side-rates, rosetta-validation:fx-ex03-fx-fwd, rosetta-validation:fx-ex04-fx-fwd-w-settlement, rosetta-validation:fx-ex05-fx-fwd-w-ssi, rosetta-validation:fx-ex06-fx-fwd-w-splits, rosetta-validation:fx-ex07-non-deliverable-forward


## Failed Gates

- java-reference-check: [
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\Main.java",
    "importName": "com.fpml.cdm.fx.mapper.generated.GeneratedFpmlToCdmMapper",
    "message": "Project import does not match a generated public type."
  }
]
