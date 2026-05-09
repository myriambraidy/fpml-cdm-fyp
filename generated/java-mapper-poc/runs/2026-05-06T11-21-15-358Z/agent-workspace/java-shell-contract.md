# Java Shell Contract

Java target: 11
Base package: com.fpml.cdm.fx.mapper
Generated implementation package: com.fpml.cdm.fx.mapper.generated
Generated implementation class: GeneratedFpmlToCdmMapper
CDM/Rosetta preflight status: passed
Approved CDM API contract: agent-workspace/approved-cdm-api-contract.md
Semantic construction recipes: agent-workspace/semantic-recipes.md

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

- Build the main CDM result with approved CDM/Rosetta Java model classes from agent-workspace/approved-cdm-api-contract.md.
- Follow agent-workspace/semantic-recipes.md for construction order and Rosetta traceability.
- Call search_cdm_java_classes or resolve_cdm_concept before exact class lookup; do not guess package names.
- Missing-class observations apply only to exact fully qualified class names.
- Do not invent FpML Java model classes such as FpmlFxSingleLeg; parse XML with DOM/StAX or generated internal DTOs.
- Do not build the main CDM output with Jackson ObjectNode or ArrayNode.
- Never write Java import aliases such as import x.y.Type as Alias; Java does not support them.
- Use Jackson only for final serialization and sidecar reports.
- Cite Rosetta function names in traceability reports.
