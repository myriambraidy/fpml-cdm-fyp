# fpml-cdm-fyp

This project is being refocused from a runtime LLM mapping copilot into a
three-stage FPML-to-CDM mapping compiler.

The target production path is:

```text
Preparation:
  cookbook + Rosetta/.reslit rules + examples
    -> canonical rule bundle

Build time:
  canonical rule bundle
    -> LLM-assisted Java generator
    -> generated Java source + generated tests + jar

Runtime:
  FpML XML
    -> deterministic Java jar
    -> CDM output + validation report
```

The important constraint: **there is no LLM in production runtime**. The LLM is
used during preparation/build time to help generate static Java code. The jar is
then compiled and run deterministically.

## Current Repository State

The existing Bun/TypeScript codebase contains useful prototype assets:

- cookbook and cookbook-LLM generation pipelines
- FPML parsing and mapping research utilities
- CDM assembly and validation experiments
- runtime LLM copilot/orchestrator prototypes
- test fixtures and evidence artifacts

Those prototypes are still valuable as research and scaffolding, but they are no
longer the target production architecture.

## Current UI Status

The active UI supports the future deterministic runtime flow:

1. Upload an FpML XML file.
2. Open the conversion screen.
3. Click Generate CDM.

The Generate CDM action currently returns a placeholder response because the
deterministic Java mapper is not implemented yet. The previous runtime LLM
review/orchestrator pages are no longer part of the active UI flow.

## Main Documents

- `docs/architecture.md` - current three-stage architecture
- `plans/static-java-generation-implementation-plan.md` - implementation plan
- `plans/mapping-agent-cookbook-runtime-context-plan.md` - superseded prototype plan
- `plans/mapping-copilot-cdm-orchestrator.md` - superseded prototype plan

## Development Commands

Install dependencies:

```bash
bun install
```

Run existing TypeScript checks:

```bash
bun run typecheck
```

Run tests:

```bash
bun test
```

## CDM/Rosetta Java Validator

The generator uses the local `rosetta-validator/` Maven module as its compiled
CDM/Rosetta classpath anchor. The `.rosetta` files under
`data/rosetta-source/latest` remain LLM context and mapping authority; the Maven
module supplies the executable Java model and validator.

Build the shaded validator jar:

```bash
bun run rosetta:build
```

Check the generator preflight:

```bash
bun run rosetta:preflight
```

The generated Java promotion gates now validate runtime CDM JSON with the
validator jar after structural output validation passes.
