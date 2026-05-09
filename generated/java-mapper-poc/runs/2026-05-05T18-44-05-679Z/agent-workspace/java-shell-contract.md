# Java Shell Contract

Java target: 11
Base package: com.fpml.cdm.fx.mapper
Generated implementation package: com.fpml.cdm.fx.mapper.generated
Generated implementation class: GeneratedFpmlToCdmMapper
CDM/Rosetta preflight status: passed
CDM Java API summary: agent-workspace/cdm-java-api-summary.md

## Shell-Owned Files

- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

## Generated-Owned Files

- src/main/java/com/fpml/cdm/fx/mapper/generated/**
- src/test/java/**
- reports/**

## Runtime Fixtures

- fx-ex01-fx-spot: fixtures/fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates: fixtures/fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd: fixtures/fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement: fixtures/fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi: fixtures/fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits: fixtures/fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward: fixtures/fx-ex07-non-deliverable-forward.xml

## Rosetta-Native Runtime Rules

- Build the main CDM result with preflight-approved CDM/Rosetta Java model classes.
- Use agent-workspace/cdm-java-api-summary.md as compact prompt context.
- Call get_cdm_java_class before using exact CDM Java class builders or methods not already inspected.
- Missing-class observations apply only to exact fully qualified class names.
- Do not invent FpML Java model classes such as FpmlFxSingleLeg; parse XML with DOM/StAX or generated internal DTOs.
- Do not build the main CDM output with Jackson ObjectNode or ArrayNode.
- Use Jackson only for final serialization and sidecar reports.
- Cite Rosetta function names in traceability reports.
