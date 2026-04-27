# Architecture: Static Java FPML-to-CDM Mapping Compiler

Date: 2026-04-27

## Scope

The project target is a deterministic Java runtime for converting FpML XML into
CDM output. LLMs are allowed during preparation and build time, but not in the
production runtime jar.

This supersedes the earlier runtime LLM copilot architecture.

## Product Claim

The system should be described as:

> An LLM-assisted build-time pipeline that compiles FPML/CDM/Rosetta mapping
> knowledge into deterministic Java conversion software.

It should not be described as:

> An LLM runtime that converts FpML into CDM.

## Three-Stage Workflow

```text
+------------------+
|  Preparation     |
|------------------|
| cookbook         |
| .reslit rules    |
| Rosetta rules    |
| examples         |
+--------+---------+
         |
         v
+------------------+
|  Build Time      |
|------------------|
| LLM sub-agents   |
| Java generator   |
| generated tests  |
| jar packaging    |
+--------+---------+
         |
         v
+------------------+
|  Runtime         |
|------------------|
| java -jar ...    |
| FpML XML input   |
| CDM output       |
| validation report|
+------------------+
```

## Stage 1: Preparation

Inputs:

- generated cookbook artifacts
- `.reslit.rules` / Rosetta rule files supplied by the user
- WebScript or scraped rule/reference material
- FpML/CDM examples and schema notes

Output:

- canonical rule bundle
- rule manifest
- coverage report
- unsupported-scope report
- traceability from source rule files to normalized rule ids

The preparation stage converts prose and source rule files into a stable,
machine-readable contract for code generation. Markdown can remain as human
documentation, but build-time agents must consume structured rule data.

## Stage 2: Build Time

Inputs:

- canonical rule bundle from preparation

Process:

- classify product families and supported roots
- plan Java mapper modules
- generate Java source
- generate Java tests and fixtures
- compile/package jar
- run generated tests and validation gates

Outputs:

- generated Java source
- generated Java tests
- compiled jar
- build report
- traceability report
- unsupported feature report

The LLM is used here only to generate and review code. Build success requires
deterministic tests and validation, not just successful text generation.

## Stage 3: Runtime

Input:

- one FpML XML file

Process:

- parse XML
- detect supported product family
- apply generated Java mappings
- validate generated CDM structurally and semantically where validators are
  available

Output:

- CDM payload, preferably JSON for the first runtime contract
- validation report
- explicit unsupported/failed status when mapping coverage is missing

Runtime must not call an LLM. Runtime must not silently emit partial CDM when a
required mapping branch is unsupported.

## Runtime Contract

Initial CLI target:

```bash
java -jar fpml-cdm-mapper.jar input.xml --output output.json --validate
```

Suggested output envelope:

```json
{
  "status": "valid | invalid | unsupported | error",
  "cdm": {},
  "validation": {
    "structuralOk": true,
    "semanticOk": true,
    "errors": []
  },
  "coverage": {
    "productFamily": "fx-derivatives",
    "rulesApplied": ["fx.settlement.001"],
    "unsupportedPaths": []
  }
}
```

## Compliance Language

Use `CDM compliant` only when all of these are true:

- the input product family is in supported scope
- no required FpML branch was skipped
- the generated CDM is structurally valid
- Rosetta/CDM semantic validation passes, when available
- all required rule branches have traceable rule ids

Otherwise use `candidate CDM output`, `structurally valid output`, or
`unsupported input`, depending on the result.

## Existing Prototype Assets

The current TypeScript/Bun app remains useful for:

- cookbook generation
- evidence extraction
- FPML parsing experiments
- CDM assembly experiments
- validation and repair-loop lessons
- fixtures and test examples

The following are prototype history, not production runtime targets:

- runtime LLM prompt injection from cookbook context
- LLM CDM synthesis/repair at runtime
- analyst review UI as the production conversion path
- Bun app as the final mapper runtime

## Key Engineering Requirements

1. Rule bundle must be structured and versioned.
2. Generated Java must include generated tests.
3. Runtime must fail explicitly for unsupported inputs.
4. Every generated mapper method should be traceable to source rule ids.
5. Build artifacts must record cookbook/rule versions.
6. The jar must be usable without network access or LLM credentials.
