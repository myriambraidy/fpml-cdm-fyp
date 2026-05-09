# Java Generator Planning Agents Research

Date: 2026-05-08
Status: draft research
Scope: planner, critic, critique reviewer, deterministic plan validation

## Purpose

This document collects research and decisions for making the Java generator
planning loop much stricter and more useful before implementation starts.

The current planning loop is good at checking business/product scope, but it
can still accept a plan that is not compatible with the exact Java shell
contract. That means a plan can be accepted, move to implementation, and fail
later because the generated Java has the wrong package, class shape, ownership
boundary, or implementation surface.

The goal is to make "plan accepted" mean:

```text
The plan is in product scope, compatible with the exact Java shell contract,
grounded in approved CDM/Rosetta APIs and recipes, and specific enough for the
implementer to generate code that has a realistic path through compile,
runtime, validation, and promotion gates.
```

## Current Improvement Scope

This research now includes a narrow Rosetta source retrieval improvement because
planning quality depends on the planner and critic being able to fetch exact
Rosetta evidence before making mapping claims.

Included:

- Verify that Rosetta source/docpacks are available for the selected product
  family and implementation group.
- Give planner, critic, and critique reviewer a reliable way to fetch exact
  Rosetta function evidence.
- Require major mapping claims to cite Rosetta function names or block ids.
- Separate Rosetta mapping-intent authority from CDM Java implementation
  authority.

Not included yet:

- Fully rebuilding the Rosetta documentation system.
- Building a complete semantic call graph for all Rosetta functions.
- Expanding product scope beyond the selected implementation group.
- Treating Rosetta source as proof of Java package, class, builder method, or
  enum existence.

## Current Failure Diagnosis

The main failure is that plan acceptance currently proves mostly:

- the selected product family is in scope,
- the selected implementation group is valid,
- runtime fixtures are declared correctly,
- broad unsupported FX claims are blocked,
- non-FX expansion is blocked,
- runtime LLM usage is blocked,
- obvious raw JSON-as-CDM-model planning is blocked.

It does not fully prove:

- the planned generated package matches the Java shell contract,
- the planned main generated class matches the shell contract,
- the planned files are under generated-owned paths,
- shell-owned files are preserved,
- the planned mapper implements the required interface,
- the implementation shape is compatible with final implementation contract,
- planned CDM/Rosetta references are all approved by the run-specific contract,
- the plan gives the implementer an executable class/file/test strategy.

This creates a false sense of readiness. The plan can be "accepted" because it
is correctly scoped, while still carrying Java implementation-shape mistakes.

## Evidence From Latest Run

The latest run accepted planning after deterministic scope validation passed,
but the final pipeline failed with a Java reference gate issue. The accepted
plan contained a Java package/class design section that described a mapper
package inconsistent with the generated shell contract.

This shows that the current planning agents and validator are protecting
business scope more strongly than implementation feasibility.

## Desired Acceptance Standard

Planning acceptance should require four layers to pass:

1. Product scope contract.
2. Runtime fixture contract.
3. Java shell contract.
4. API/recipe implementation contract.

The first two are partially implemented today. The third and fourth need to be
made explicit in the planner prompt, critic checklist, critique reviewer
decision logic, and deterministic validator.

## Agent Gap Analysis

### Planner Gaps

The planner currently knows it must describe Java package/class design, but the
prompt does not force that design to be machine-checkable against the shell
contract.

Missing planner requirements:

- A required `## Java shell contract (machine-checked)` section.
- Exact generated package:
  `com.fpml.cdm.fx.mapper.generated`.
- Exact main generated class:
  `GeneratedFpmlToCdmMapper`.
- Exact required interface:
  `com.fpml.cdm.fx.mapper.FpmlToCdmMapper`.
- Exact generated-owned source root:
  `src/main/java/com/fpml/cdm/fx/mapper/generated/`.
- Explicit statement that shell-owned files are not rewritten:
  `pom.xml`, `Main.java`, `RuntimeArgs.java`, `FpmlToCdmMapper.java`.
- Planned generated classes must either be under the generated package or be
  rejected.
- Any narrative package names must not contradict the machine-checked shell
  section.

Current planner risk:

- It can invent a nice-looking mapper architecture that is conceptually good
  but structurally incompatible with the deterministic shell.

### Critic Gaps

The critic is strict about product scope, runtime support, raw JSON CDM output,
and unproven CDM API claims. It is not yet strict enough about exact generated
Java structure.

Missing critic checks:

- Block wrong package names for generated implementation classes.
- Block missing `GeneratedFpmlToCdmMapper`.
- Block plans where the main generated class does not implement
  `FpmlToCdmMapper`.
- Block generated classes outside generated-owned paths.
- Block any plan that tells the implementer to modify shell-owned files.
- Block narrative class/package design that conflicts with the shell contract,
  even if a machine-checked section exists.
- Block plan acceptance when implementation class/file ownership is ambiguous.

Current critic risk:

- It can focus on the product and mapping domain while missing a basic Java
  contract mismatch that will fail later.

### Critique Reviewer Gaps

The critique reviewer currently treats deterministic plan validation as a
major authority. If `plan-validation.md` passes and no exact missing-class
lookup blocks implementation, the reviewer is encouraged to accept.

That creates a weakness: if deterministic validation is incomplete, the
reviewer may accept too easily.

Missing reviewer behavior:

- It should require all machine contracts to pass, not just product scope
  validation.
- It should treat Java shell contract mismatch as blocking, even on the final
  planning round.
- It should not convert structural Java contract problems into non-blocking
  "conditions".
- It should preserve a final accepted checklist that is implementation-ready,
  not just scope-ready.
- It should distinguish:
  - business scope blocker,
  - Java shell contract blocker,
  - API contract blocker,
  - recipe/semantic blocker,
  - wording or documentation concern.

Current reviewer risk:

- It can accept a scoped plan with implementation-shape conditions that the
  implementer then misreads or cannot satisfy.

## Deterministic Validator Gaps

The validator currently parses the implementation scope and runtime fixture
sections. It should grow into a multi-contract validator.

Proposed new machine-checked sections:

```markdown
## Java shell contract (machine-checked)
**Generated package:** com.fpml.cdm.fx.mapper.generated
**Main generated class:** GeneratedFpmlToCdmMapper
**Required interface:** com.fpml.cdm.fx.mapper.FpmlToCdmMapper
**Generated source root:** src/main/java/com/fpml/cdm/fx/mapper/generated/
**Shell-owned files must not be rewritten:**
- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java
```

Validator checks to add:

- Required shell contract section exists.
- Exact values match `java-shell-contract.md` or constants from
  `java-contract.ts`.
- No generated package contradiction appears elsewhere in the plan.
- No shell-owned file is listed as generated-owned or planned for rewrite.
- Planned main generated class is present and has the required package and
  interface.
- Generated-owned files are under the generated source root.

## Better Planning Contract

The accepted plan should become an implementation contract with these required
sections:

- Implementation scope, machine-checked.
- Runtime supported fixtures, machine-checked.
- Java shell contract, machine-checked.
- Approved API usage strategy.
- Semantic recipe coverage.
- Generated file ownership.
- Runtime output contract.
- Unsupported behavior contract.
- Validation and promotion gates.
- Traceability contract.

Each section should answer a different question:

- Are we building the right product slice?
- Which fixtures must actually pass?
- What exact Java shape must be generated?
- Which CDM/Rosetta APIs may be used?
- Which semantic recipes drive construction?
- Which files may be written?
- What does the jar output?
- What happens for unsupported inputs?
- What gates determine success?
- How do we trace output back to Rosetta source?

## Proposed Fixes

### Fix 0: Add A Rosetta/CDM Java Documentation Readiness Stage

Before the planner writes the implementation plan, the pipeline should prove
that it has loaded the correct Java implementation authority for the selected
scope.

Current state:

- `cdm-java-api-summary.md` is available to the planner.
- The summary is only an index and explicitly says it is not method authority.
- Richer artifacts exist:
  - `relevant-cdm-api-candidates.md`
  - `cdm-api-selection-pass1.md`
  - `cdm-api-selection-final.md`
  - `approved-cdm-api-contract-summary.md`
  - `approved-cdm-api-contract.json`
  - `semantic-recipes.md`
  - `semantic-recipe-validation.md`
- These richer artifacts are not all first-class planning authorities for the
  planner.

This means the planner may know that CDM Java exists, but not have enough
structured, mandatory evidence to design the mapper using the exact approved
classes and builder contracts.

Required new artifact:

```text
agent-workspace/java-documentation-readiness.md
agent-workspace/java-documentation-readiness.json
```

The readiness report should answer:

- Which `cdm-java` Maven artifact/version is authoritative?
- Was the compiled jar found?
- Was the class index built from the compiled jar?
- Were required FX single-leg concepts resolved?
- Which concepts are resolved, ambiguous, missing, or deferred?
- Which classes are approved for implementation?
- Which same-simple-name classes were rejected?
- Which builder methods are approved for each core recipe step?
- Did semantic recipe validation pass?
- Did recipe-derived compile fixtures exist and compile?
- Is the approved API contract narrow enough for prompt use?
- What exact files should planner, critic, and reviewer treat as authority?

Planning should not start if this readiness status is failed.

### Fix 0.1: Give Planner The Right Java Authority, Not Just The API Summary

The planner currently receives `cdm-java-api-summary.md`, which is useful but
insufficient. It tells the planner that the jar has 5,183 indexed classes and
lists prompt seed classes and missing-class observations, but it does not give
the final approved API surface or the semantic construction recipe.

The planner should receive:

- `java-shell-contract.md`
- `java-documentation-readiness.md`
- `approved-cdm-api-contract-summary.md`
- `semantic-recipes.md` or a compact planner-specific recipe summary
- `semantic-recipe-validation.md`
- `context-budget-report.md`

The planner should not be expected to discover these from the evidence index.
They are not optional research context; they are implementation authorities.

### Fix 0.2: Separate Three Kinds Of Rosetta/CDM Evidence

The planning agents must distinguish three different authorities:

1. Rosetta source authority.
   - Defines mapping intent and transformation logic.
   - Example: FX single-leg Rosetta functions.
2. CDM Java API authority.
   - Defines which Java classes, packages, builders, methods, and enum values
     actually exist in the compiled jar.
   - Authority is `javap` over the pinned Maven artifact.
3. Approved run-specific API contract.
   - Defines the subset of the CDM Java API the generated mapper may import or
     fully qualify in this run.

A plan should fail if it confuses these:

- Rosetta function names do not authorize Java package names.
- Expected CDM JSON paths do not authorize Java classes.
- Broad CDM API search results do not authorize imports.
- Prompt seed classes do not authorize final implementation.
- Only the approved run-specific contract authorizes implementation references.

### Fix 0.2.1: Add Narrow Rosetta Source Retrieval To Planning Scope

The existing Rosetta source snapshot is useful, but the planning agents need a
more reliable retrieval workflow.

Current Rosetta source assets:

- Raw `.rosetta` files under `data/rosetta-source/latest/files`.
- Extracted blocks under `data/rosetta-source/latest/extracted/blocks.json`.
- Extracted function/type/enum indexes.
- Product-family documentation packs under
  `data/rosetta-source/latest/docs/product-families`.
- Shared ingest documentation under
  `data/rosetta-source/latest/docs/shared-ingest.md`.

Current value:

- Good source of truth for mapping intent.
- Good high-level product-family index.
- Good enough to identify relevant FX single-leg functions.

Current limitations:

- Product-family docpacks list important functions but do not inline all exact
  function bodies.
- Agents must know to fetch raw block text from `blocks.json`.
- There is no mandatory planning workflow that proves the planner inspected
  exact function bodies before making mapping claims.
- There is no focused retrieval by mapping area, such as settlement payout,
  party mapping, price/quantity, or product taxonomy.
- Rosetta source is not connected cleanly to approved Java API contracts.

Required narrow improvement:

Add Rosetta retrieval as a required planning support layer, without rebuilding
the whole documentation system.

Useful tool/API shape:

```text
get_rosetta_product_pack(productFamily)
get_rosetta_function(functionName)
get_rosetta_functions(functionNames[])
search_rosetta_blocks(query, productFamily)
get_rosetta_mapping_area(productFamily, implementationGroup, area)
```

Initial mapping areas for FX single-leg:

- product root and non-transferable product,
- economic terms,
- settlement payout,
- price/quantity,
- party and counterparty,
- account party reference,
- product identifiers and taxonomy,
- dates and settlement.

Planner requirements:

- The planner must cite Rosetta function names for every major mapping area.
- The planner must fetch exact function bodies for core FX single-leg mapping
  functions before writing mapping responsibilities.
- The planner must not infer Java packages/classes from Rosetta names.

Critic requirements:

- The critic must block mapping claims that cite no Rosetta function evidence.
- The critic must block claims where the cited Rosetta function does not support
  the planned responsibility.
- The critic must distinguish "Rosetta says this mapping intent exists" from
  "CDM Java provides this class/method".

Critique reviewer requirements:

- The reviewer must not accept a plan with unresolved Rosetta evidence for core
  mapping areas.
- The reviewer may allow non-core Rosetta gaps only when unsupported behavior is
  explicit and the runtime fixture scope is not affected.

Deterministic readiness checks:

- FX product-family Rosetta pack exists.
- Shared ingest pack exists.
- Required FX single-leg function names resolve to extracted blocks.
- Core mapping areas have at least one cited Rosetta function.
- Missing Rosetta evidence is reported before planning acceptance.

### Fix 0.3: Add Concept Resolution Quality Gates

The Java documentation readiness stage should classify required concepts:

```text
concept -> selected class -> status -> evidence -> builder readiness
```

For FX single-leg, examples include:

- Trade root
- TradeState root
- Contract details
- Non-transferable product
- Economic terms
- Payout container
- Settlement payout
- Resolvable price quantity
- Price schedule
- Party reference or party identity

Each concept should have one of these statuses:

- resolved: exact approved class exists and has required builder support.
- deferred: concept is not implemented in this scope and unsupported behavior
  is explicit.
- ambiguous: multiple candidate classes exist and no approved selection was
  made.
- missing: no acceptable class exists.

Planner acceptance should require no ambiguous or missing core concepts.

### Fix 0.4: Make Builder Method Readiness Visible Before Planning

The current recipes contain approved builder methods, but the planner prompt
does not force itself to plan around them.

The readiness report should show, for every core recipe step:

- approved classes,
- required builder intents,
- approved builder methods,
- parameter types,
- rejected or missing methods,
- whether the step is compile-fixture covered.

The planner should cite recipe step ids rather than inventing raw builder
strategy from memory.

### Fix 0.5: Add Documentation Fetch Completeness Checks

The pipeline should explicitly check whether Java documentation/artifact
fetching is complete.

Checks:

- `cdm-java-api/6.7.0/manifest.json` exists and matches `CDM_JAVA_VERSION`.
- `api-index.json` exists and has indexed CDM/Rosetta classes.
- class details exist for every approved class, not only prompt seed classes.
- builder methods exist for every core approved recipe step.
- missing-class observations are current against the same jar version.
- approved contract was generated from final selection, not candidate search.
- semantic recipes were generated after final API selection.
- semantic recipe validation status is passed.
- recipe-derived fixture report status is passed.

If any check fails, planning should stop before the planner role is called.

### Fix 0.6: Give Critic A Documentation Authority Checklist

The critic should block the plan if:

- the planner references a CDM/Rosetta class outside the approved contract,
- the planner uses a class from candidate search but not final approval,
- the planner names a builder method not present in the approved builder method
  index,
- the planner claims a missing concept is supported,
- the planner does not cite recipe steps for core construction areas,
- the planner treats Rosetta source as proof of Java API existence,
- the planner treats expected CDM JSON shape as proof of Java API existence.

### Fix 0.7: Add Reviewer Rules For Documentation Gaps

The critique reviewer should not accept if Java documentation readiness is
failed, stale, ambiguous, or absent.

The reviewer may accept with conditions only for non-blocking wording issues.
It must not accept with conditions for:

- unresolved core CDM concepts,
- ambiguous selected classes,
- missing builder methods for core recipe steps,
- stale or mismatched CDM Java artifact version,
- missing approved API contract,
- missing semantic recipe validation,
- missing recipe-derived fixtures.

### Fix 1: Add Java Shell Contract To Planner Context And Prompt

The planner already receives several context files, but the prompt should make
the Java shell contract a first-class planning authority, not just an
implementation concern.

Implementation direction:

- Include `java-shell-contract.md` in planner, critic, and critique reviewer
  context.
- Require exact shell contract section in planner output.
- Tell planner that any narrative Java package/class design must be compatible
  with that section.

### Fix 2: Extend Deterministic Plan Validation

Add shell-contract parsing to `plan-validator.ts`.

The validator should return separate detail groups:

- parsed scope details,
- parsed runtime fixture details,
- parsed Java shell details,
- ownership findings.

Acceptance should fail if any required Java shell value is missing or wrong.

### Fix 3: Strengthen Critic Prompt

The critic should have a mandatory contract-first review order:

1. Product scope.
2. Runtime fixtures.
3. Java shell contract.
4. API contract.
5. Semantic recipes.
6. Tests/gates.
7. Unsupported behavior.
8. Traceability.

If any earlier contract fails, the critic should block the plan before spending
tokens on lower-level style or wording issues.

### Fix 4: Strengthen Critique Reviewer Decision Rules

The reviewer should only accept when:

- deterministic product scope validation passes,
- deterministic Java shell validation passes,
- critic has no valid blocking issues,
- any conditions are truly non-blocking.

On the final round, the reviewer may accept with wording conditions, but must
not accept with Java shell, API contract, fixture, or runtime support
conditions.

### Fix 5: Add Accepted Plan Consistency Cleanup

The accepted plan synthesis currently combines product scope, validation,
planner plan, critic review, and critique resolution. It can carry stale or
contradictory narrative from the planner.

Future improvement:

- Synthesize a clean final implementation contract section from machine-checked
  values.
- Mark planner narrative as supporting rationale, not authority, when it
  conflicts with machine contracts.
- Optionally add a final deterministic "accepted plan consistency" pass.

### Fix 6: Add Regression Tests From Latest Failure

Add tests that prove:

- A plan with `org.finos.cdm.fx.singleleg` as generated package fails.
- A plan missing `GeneratedFpmlToCdmMapper` fails.
- A plan that rewrites `Main.java` fails.
- A plan with correct product scope but wrong Java shell contract fails.
- A plan with correct shell section but contradictory narrative fails.

## Open Questions

- Should the planner be allowed to propose helper packages outside
  `com.fpml.cdm.fx.mapper.generated`, or should all generated helpers live
  strictly under that package for now?
- Should the Java shell contract be parsed from `java-shell-contract.md` during
  validation, or imported from constants in `java-contract.ts`?
- Should accepted plan synthesis remove contradictory planner text, or should
  it preserve it with an explicit warning?
- Should final-round acceptance be impossible if any deterministic validator
  status is failed, even when the reviewer says accepted?

## Working Principle

Planning should stop being only a product-scope conversation.

For this generator, planning is a compiler contract. A plan is not ready unless
it tells the implementer exactly what Java shape to generate, where to write it,
what APIs it may use, what fixtures must pass, and what gates define promotion.
