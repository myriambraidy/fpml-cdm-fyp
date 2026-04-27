# Documentation

Purpose: permanent documentation for agents and humans working on this codebase.

## Current Source Of Truth

Read these first:

1. root `README.md`
2. `docs/architecture.md`
3. `plans/static-java-generation-implementation-plan.md`

These describe the current scope: prepare mapping knowledge, generate static
Java at build time, and run a no-LLM jar at runtime.

## Prototype History

The following documents describe earlier approaches and should be treated as
historical/prototype context:

- `docs/design.md` - original analyst-copilot wedge
- `plans/mapping-agent-cookbook-runtime-context-plan.md` - cookbook injected into runtime LLM prompts
- `plans/mapping-copilot-cdm-orchestrator.md` - LLM CDM synthesis and repair loop
- older week-by-week plans under `plans/`

Do not use those older plans as the production architecture unless they are
explicitly reconciled with the static Java generation plan.

## Reference Docs

- `docs/mapping-rules.md` - FPML-to-CDM mapping research notes
- `docs/skills-status.md` - status of prototype TypeScript skills
- `docs/schemas/` - FPML/CDM structure notes

These can feed the preparation stage, but they are not themselves the canonical
build-time rule bundle.
