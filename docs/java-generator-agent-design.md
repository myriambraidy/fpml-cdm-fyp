# Design: Java Generator Agent for FpML-to-CDM

Date: 2026-05-01
Status: selected approach
First product family: FX derivatives
Selected approach: Approach C - Build-Time Agentic Java Generator
Maximum planning rounds: 3

## Summary

Build a build-time Java generator agent that produces deterministic Java code
for converting FpML into CDM. The generated Java is compiled into a jar and used
at runtime without any LLM calls.

There are two different runtimes in this design:

1. Agent-generation runtime: the TypeScript/Bun orchestration process that runs
   the multi-agent loop, reads/writes Markdown plans, generates Java, runs
   checks, and repairs the generated project.
2. Shipped Java mapper runtime: the compiled Java jar produced by the agent. It
   accepts FpML XML and emits CDM JSON plus sidecar reports. It does not read
   the agent Markdown plans and does not call an LLM.

The core workflow is:

```text
Prepared FpML/CDM/Rosetta context
  -> multi-agent Java generation pipeline
  -> generated Java source and tests
  -> compiled jar
  -> runtime FpML XML to CDM JSON conversion
```

Runtime must stay deterministic:

```text
FpML XML -> generated Java jar -> CDM JSON + sidecar reports
```

In this document, "agent runtime" means the generator process. "mapper runtime"
means the shipped Java jar.

The first product family is FX derivatives. The agent may inspect the whole FX
derivatives evidence folder, but the generated jar must explicitly report which
FX products it supports and which observed FX products remain unsupported. The
goal is to prove the factory: rules and evidence go in, compilable Java and
tests come out, and the jar produces traceable CDM output.

## Problem

FpML-to-CDM conversion requires domain-specific mapping knowledge, product
family branching, normalization rules, validation, and traceability. A runtime
LLM mapper is too hard to certify because output can vary, failures are hard to
bound, and production environments may require offline execution.

The project needs an agentic system, but the agent should be used where it is
valuable: during build time, when it can inspect context, plan the mapper,
generate code, review itself, repair compile or test errors, and produce
evidence. The production runtime should be static Java.

## Product Claim

This project is an LLM-assisted compiler for financial mapping software.

It compiles FpML/CDM/Rosetta mapping knowledge into deterministic Java
conversion code. It is not a runtime LLM converter.

## Goals

- Generate Java code for a selected product family from prepared mapping
context.
- Compile the generated Java into a jar.
- Run the jar on FpML XML without network access or LLM credentials.
- Emit clean CDM JSON as the main output.
- Emit mapping, validation, traceability, and build reports as sidecar
artifacts.
- Make unsupported product families and unsupported required paths explicit.
- Run checks during generation so broken Java is not promoted.
- Proceed product by product inside the FX derivatives family.

## Non-Goals

- Full FpML coverage in the first implementation.
- Runtime LLM fallback.
- Silent partial CDM output for unsupported inputs.
- A production UI as the first proof point.
- Perfect semantic validation before the local CDM Java validation path is
understood.
- A self-modifying runtime jar.

## Premises

1. Build-time LLM usage is acceptable, but runtime LLM usage is not.
2. Generated code must be treated as a build artifact with tests and reports,
  not as trusted text.
3. A narrow product slice is the fastest way to validate the architecture.
4. The FX derivatives folder has enough local fixture and rule context to be
  the first family scope.
5. The generator pipeline should be explicit and inspectable before it becomes
  highly autonomous.
6. A failed compile, failed test, or unsupported required mapping must block jar
  promotion.

## Alternatives Considered

### Approach C: Build-Time Agentic Java Generator

The system uses LLM agents and deterministic tools at build time to generate,
review, test, and repair Java code. The generated jar is deterministic at
runtime.

This keeps AI where it can accelerate complex code generation while preserving
offline, repeatable runtime behavior.

Selected.

## Recommended Architecture

The Java generator agent should be a compiler-like pipeline:

```text
Rule Reader
  -> Context Retriever
  -> Mapper Planner
  -> Plan Critic
  -> Critique Reviewer
  -> Java Generator
  -> Test Generator
  -> Build Runner
  -> Runtime Runner
  -> Validation Runner
  -> Reviewer/Repair Loop
  -> Artifact Promoter
```

The stages should be AI-native from the beginning. The planner, critic,
critique reviewer, implementer, and repair loop should be real LLM-backed
agents that communicate through the Markdown workspace.

For the first implementation, these roles are executed by one orchestrator model
that changes role by reading and writing the stage files. The orchestrator runs
sequential role passes: planner, critic, critique reviewer, implementer, build
reviewer, and repair agent. Separate model calls per role can be introduced
later if the single-orchestrator loop becomes hard to reason about or evaluate.

There is no non-LLM planning shell phase. Each role pass in the first
implementation should have a brain: it should be backed by an LLM call, use the
available tools, and write its own Markdown artifact. Deterministic code should
support the agent loop by providing tools, file contracts, command execution,
and gates; it should not replace the agent reasoning.

The tools they use should be deterministic and auditable: file reads, search,
XML/JSON parsing, Java generation writes, Maven commands, validation checks, and
report writing. The intelligence lives in the agent loop; the evidence,
commands, and promotion gates stay concrete and repeatable.

The pipeline's coordination medium is Markdown, not JSON. Plans, critiques,
review responses, implementation logs, and repair notes should be written as
human-readable Markdown documents so each sub-agent can inspect the reasoning of
the previous sub-agents, debate decisions over multiple rounds, and preserve a
clear audit trail.

JSON remains useful for strict machine contracts such as rule bundles,
traceability reports, validation reports, and build metadata. Markdown is the
primary medium for agent reasoning and collaboration.

Planning is capped at three rounds. If the planner, critic, and critique
reviewer cannot converge after three rounds, the agent-generation runtime must
stop and request human review instead of continuing indefinitely.

## Agent Roles

### Rule Reader

Loads the prepared rule bundle and selects rules for the requested product
family.

Inputs:

- canonical rule bundle
- product family selection
- build configuration

Outputs:

- generation tasks
- ready/review-only/blocked rule classification
- unsupported-scope notes

### Context Retriever

Finds relevant local context for the product slice.

Inputs:

- selected rules
- fixture FpML
- expected CDM examples
- cookbook pages
- Rosetta source/docpacks

Outputs:

- evidence packet for planning and generation
- relevant FpML paths
- relevant CDM paths
- example-derived expectations

### Mapper Planner

Creates the implementation plan for the generated Java mapper.

Outputs:

- package layout
- class list
- method boundaries
- mapping responsibility per method
- test plan
- unsupported branch plan

The plan is persisted as a build artifact so later stages can mark steps as
done.

### Plan Critic

Reviews the mapper plan before code is generated.

Checks:

- required FpML fields are covered
- CDM paths are plausible
- unsupported cases are explicit
- tests prove the important mappings
- runtime contract is preserved
- no LLM runtime dependency is introduced

### Critique Reviewer

Decides which critique items are valid and updates the plan. This prevents the
pipeline from blindly following a bad critique.

Outputs:

- accepted critique items
- rejected critique items with reasons
- revised plan

### Java Generator

Generates Java source from the accepted plan.

For the first slice, generated classes should stay small and legible. The
current proven direction is a generated Maven project under
`generated/java-mapper-poc`.

Initial package shape:

```text
com.fpmlcdm.mapper.Main
com.fpmlcdm.mapper.FxSingleLegMapper
com.fpmlcdm.mapper.FpmlXml
com.fpmlcdm.mapper.CdmJsonWriter
com.fpmlcdm.mapper.MappingReport
```

The first implementation can emit CDM-shaped JSON directly. The next layer
should generate code that uses the official FINOS CDM Java model where
practical.

### Test Generator

Generates tests from fixtures, examples, and rule expectations.

First FX tests should verify:

- the fixture parses successfully
- product qualifier is `ForeignExchange_Spot_Forward`
- trade date is normalized
- value date is normalized
- GBP and USD quantities are mapped
- exchange rate is mapped
- output root is clean CDM JSON, not an execution envelope
- mapping report includes the applied rule ids
- unsupported input fails explicitly

### Build Runner

Runs Java compile, tests, and packaging. A jar is not promotable unless this
stage passes.

Expected checks:

```text
mvn test
mvn package
java -jar target/fpml-cdm-mapper.jar fixtures/fx-single-leg.xml --output generated-cdm.json --reports reports/
```

### Runtime Runner

Executes the generated jar against the selected fixture and records runtime
outputs.

Expected runtime command:

```text
java -jar fpml-cdm-mapper.jar input.xml --output output.json --reports reports/
```

### Validation Runner

Validates runtime output.

Layer 1:

- structural checks over expected CDM-shaped JSON
- report completeness checks
- unsupported-path checks

Layer 2:

- official CDM Java model serialization through `org.finos.cdm:cdm-java`
- Rosetta/CDM validation through the local `rosetta-validator/` shaded jar

The repository has two Rosetta inputs with different jobs:

```text
data/rosetta-source/latest/
  -> .rosetta source, docs, and extracted blocks for LLM mapping context

rosetta-validator/
  -> Maven module pinned to CDM 6.7.0
  -> shaded Java validator jar
  -> optional generated/ source root for agent-written Java builders
```

The generator preflight passes only after the repo-local validator jar exists or
can be built. Runtime outputs are then validated as `TradeState` JSON by running:

```text
java -jar rosetta-validator/target/rosetta-validator-1.0.0.jar outputs/<fixture>.json --type tradeState
```

### Reviewer/Repair Loop

Reads compile, test, runtime, and validation failures. Repairs the generated
source or plan, then reruns checks.

The loop should have a bounded retry count. If it cannot repair the artifact, it
must fail the build and write a report rather than promote a broken jar.

### Artifact Promoter

Promotes the generated jar only when all gates pass.

Promoted artifacts:

- generated Java source
- generated Java tests
- jar
- build report
- mapping report
- validation report
- traceability report
- unsupported-scope report

## Planning Document Lifecycle

Each generator run should create a run-local Markdown workspace:

```text
generated/java-mapper-poc/agent-workspace/
  00-input-brief.md
  00-product-scope.md
  00-run-log.md
  round-01/
    planner-plan.md
    critic-review.md
    critique-resolution.md
  round-02/
    planner-plan.md
    critic-review.md
    critique-resolution.md
  accepted-plan.md
  implementation-plan.md
  implementation-log.md
  repair-log.md
  final-build-report.md
```

The Markdown workspace is the communication layer between sub-agents. It should
store the ideas, disagreements, accepted decisions, rejected proposals, and
implementation status in a format that is easy for humans and agents to review.

Each planning/critique iteration gets its own round folder. Agents should not
overwrite earlier rounds. Once a round produces a plan that satisfies the
reviewer, the pipeline writes `accepted-plan.md` as the stable implementation
contract.

The agent-generation runtime must not plan or generate for products outside
`00-product-scope.md`. If agents discover related products, variants, or
branches, they should record them as future candidates instead of expanding the
current run.

`00-product-scope.md` is the product boundary for the run. It should be created
before planning starts and include:

- selected product family
- selected product or product variant
- included FpML roots
- explicitly excluded products
- selected fixtures and examples
- allowed source folders
- blocked source folders, if any
- reason this product was selected
- next-product candidates discovered during the run

For the first run:

```markdown
# Product Scope

Selected product family: fx-derivatives
Selected product: FX single-leg spot/forward

Included FpML roots:
- trade/fxSingleLeg

Excluded for this run:
- FX options
- FX swaps
- multiple trades
- allocations
- amendments
- clearing
- collateral
- lifecycle events

Allowed evidence:
- data/agent-cookbook/latest/
- data/rosetta-source/latest/
- data_to_learn_from/fpml/fx-derivatives/
- data_to_learn_from/cdm_parallel/fx-derivatives/

Do not expand beyond this scope during this run.
```

`00-run-log.md` is the chronological log for the generator run. It should record:

- run id
- timestamp
- selected product scope
- agent rounds created
- round outcome
- accepted plan path
- implementation stages started and completed
- commands run
- failures and repair attempts
- final promoted or failed status

The planner's Markdown plan should include:

- selected product family
- selected fixture set
- mapping scope
- assumptions
- Java package/class design
- mapping method responsibilities
- test strategy
- unsupported-scope strategy
- implementation checklist

The critic's Markdown review should include:

- correctness concerns
- missing mappings
- unsupported edge cases
- weak tests
- traceability gaps
- CDM-shape concerns
- recommended changes

The critique-resolution Markdown document should include:

- accepted critique items
- rejected critique items
- reasons for each decision
- revised implementation checklist

The implementation log should include:

- checklist item status
- files generated or changed
- commands run
- typecheck, compile, test, and runtime results
- failures encountered
- repairs attempted

During implementation, each completed step is marked done in the Markdown
implementation plan or log. Temporary scratch notes may be deleted after the
run, but the final Markdown workspace should be kept with the generated build
artifacts for traceability.

For strict automated checks, the pipeline may also emit JSON summaries derived
from the Markdown workspace. The Markdown remains the source of truth for agent
reasoning.

## Runtime Contract

This section describes the shipped Java mapper runtime, not the agent-generation
runtime.

The shipped Java mapper runtime accepts user-provided FpML files. The input file
does not need to come from `data_to_learn_from` or any example folder. The
example files are build-time evidence and test fixtures for the generator; they
are not the only files the generated jar should support.

Main output is CDM JSON only:

```text
output.json
```

Diagnostics are sidecar reports:

```text
reports/mapping-report.json
reports/validation-report.json
reports/traceability-report.json
reports/unsupported-scope.json
```

The CDM output must not be wrapped like this:

```json
{
  "status": "valid",
  "cdm": {}
}
```

Runtime status belongs in sidecar reports or process exit code.

The shipped Java mapper runtime must not consume the Markdown agent plans. Those
plans are build-time artifacts for the generator agents and human audit.

For supported inputs, the generated CDM JSON should be structurally consistent
with the matching CDM examples in `data_to_learn_from/cdm_parallel/`. The mapper
must not copy example output blindly. It should map values from the new FpML
input into the learned CDM structure.

The runtime may call an output `CDM compliant` only when:

- the input product is in supported scope
- all required FpML branches for that scope are mapped or explicitly allowed to
  be absent
- structural validation passes
- semantic CDM/Rosetta validation passes when available
- validation and traceability reports contain no blocking errors

Otherwise, the output should be described as candidate CDM JSON, unsupported
input, parse error, mapping error, or validation error.

## First Product Slice

Product family:

```text
fx-derivatives
```

Product:

```text
FX single-leg spot/forward
```

Initial FpML scope:

- FpML 4.9
- one trade per document
- `trade/fxSingleLeg`
- trade identifier
- trade date
- exchanged currency 1
- exchanged currency 2
- value date
- quoted currency pair
- exchange rate
- parties

Initial out-of-scope cases:

- multiple trades
- options
- swaps
- allocations
- amendments
- clearing and collateral
- lifecycle events
- full party enrichment
- perfect global-key parity with reference CDM

## Data Inputs

Initial local context:

```text
data/rosetta-source/latest/
data/agent-cookbook/latest/
data_to_learn_from/fpml/fx-derivatives/
data_to_learn_from/cdm_parallel/fx-derivatives/
data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml
data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json
```

The paired examples are evidence and tests. They should not be the only source
of mapping logic.

The paired CDM examples define the expected output family for the first
generator. A new supported FX single-leg FpML file should produce CDM JSON that
uses the same broad structure as the examples, including trade, product,
economic terms, payout, trade lot, counterparty, trade identifier, trade date,
party, and meta sections. Values must come from the input file and generated
mapping logic, not from copied examples.

## Generated Project Layout

Initial generated Maven project:

```text
generated/java-mapper-poc/
  pom.xml
  src/main/java/com/fpmlcdm/mapper/
  src/test/java/com/fpmlcdm/mapper/
  fixtures/
  expected/
  reports/
  build-reports/
```

The generated project may later be renamed from `java-mapper-poc` once the
pipeline is no longer a proof of concept.

## Tool Surface

Initial generator tools:

- `read_file`: read rules, examples, generated Java, and reports
- `list_files`: inspect prepared context and generated project layout
- `search`: find relevant FpML/CDM/Rosetta terms
- `write_file`: write generated Java, tests, plans, and reports
- `run_command`: run type checks, Maven, tests, and jar execution
- `validate_json`: validate generated reports and CDM-shaped JSON
- `update_plan`: mark generator-run tasks complete

The build-time orchestrator should expose these as tools to the sub-agents.
Tool outputs should be logged so the agents can reason over evidence rather than
guessing.

## Quality Gates

A generated jar can be promoted only if:

- the selected rules validate
- the mapper plan is accepted
- generated Java compiles
- generated tests pass
- the jar runs against the FX fixture
- output is clean CDM JSON
- required sidecar reports are written
- unsupported cases are explicit
- traceability links generated methods to rule ids
- no runtime LLM dependency exists

## Failure Handling


| Failure                          | Required behavior                                   |
| -------------------------------- | --------------------------------------------------- |
| Rule cannot be parsed            | Preparation/generation fails with source and reason |
| Rule lacks required paths        | Rule is excluded or marked review-only              |
| Product family unsupported       | Runtime fails explicitly                            |
| Required FpML branch unsupported | Runtime reports unsupported or mapping error        |
| Java compile fails               | Repair loop runs; jar is not promoted               |
| Tests fail                       | Repair loop runs; jar is not promoted               |
| Validation fails                 | Output is not called valid CDM                      |
| Repair loop exhausts retries     | Build fails with report                             |


Silent partial conversion is a critical defect.

## Implementation Phases

### Phase 1: Harden the Existing FX POC

### Phase 1: AI-Native FX Generator Loop

- Build the single-orchestrator, multi-role LLM loop from day one.
- Keep FX single-leg spot/forward as the first product.
- Create the Markdown agent workspace for each run.
- Run LLM-backed planner, critic, and critique-reviewer passes for up to three
  rounds.
- Produce `accepted-plan.md` from the resolved critique.
- Run an LLM-backed implementer pass that generates Java from the accepted plan.
- Generate Java tests and runtime report writers.
- Run TypeScript typecheck, Maven compile/test/package, jar execution, and
  output validation gates.
- Run an LLM-backed repair pass when gates fail, with bounded retries.
- Preserve clean CDM JSON plus sidecar reports.
- Ensure unsupported inputs fail explicitly.
- Ensure build reports include commands and pass/fail status.

### Phase 2: Strengthen The Pipeline

- Add structured stage contracts.
- Improve tool audit logs.
- Add richer product-scope enforcement.
- Improve round summaries and convergence criteria.
- Add stronger validation over Markdown and JSON artifacts.

### Phase 3: Connect Prepared Rule Bundle

- Replace hand-authored tiny rules with prepared rule bundle inputs.
- Filter ready/review-only/blocked rules.
- Generate traceability from real source rule ids.
- Emit coverage and unsupported-scope reports.

### Phase 4: CDM-Native Java Layer

- Pin the CDM Java dependency.
- Inspect official builder and serialization patterns.
- Generate CDM model objects where practical.
- Add CDM/Rosetta validation reports.

### Phase 5: Product-by-Product Expansion

- Add the next FX variant only after the first slice is stable.
- Use coverage reports to choose the next product.
- Keep every new product behind compile, test, runtime, validation, and
traceability gates.

## Acceptance Criteria For The First Complete Milestone

- FX single-leg spot/forward is selected as the supported product.
- The generator creates a Maven Java project.
- Generated Java compiles.
- Generated tests pass.
- The generated jar runs on the FX fixture.
- Main output is clean CDM JSON.
- Sidecar mapping, validation, traceability, and build reports are produced.
- Unsupported input fails explicitly.
- Every generated mapper method is traceable to rule ids or evidence.
- No runtime LLM call is possible.

## The Assignment

The next implementation assignment is to harden the existing FX POC into a
repeatable stage-based generator run:

1. Add or confirm a persisted generator run plan.
2. Add explicit planner, critic, critique-reviewer, generator, tester, builder,
  runner, validator, and repair-loop stage outputs.
3. Ensure each completed implementation step is marked done in the run plan.
4. Run TypeScript typecheck and Maven checks during implementation.
5. Promote the jar only when all gates pass.
