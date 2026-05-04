# Java Generator Agent Output Research

Date: 2026-05-02
Scope: current Java generator agent implementation, current git diff, and observed generated outputs under `generated/java-mapper-poc`.

## Executive Summary

The current Java generator agent is still in the agent-planning phase of the selected design. It has not yet produced a Java Maven project, run Maven gates, or promoted a jar in any observed run.

The latest run, `2026-05-01T17-28-07-939Z`, ran for about 116 minutes and failed with an OpenRouter provider `503` before implementation started. The run spent almost all of its time in planning, critique, and tool-use loops. The tool audit shows 915 tool calls, including 776 `search_text` calls and 327 tool errors. The largest repeated failures were 294 attempts to search or stat a non-existent path: `data/agent-cookbook/latest/fx-derivatives`.

The output quality issues are real, but they are not primarily Java-code quality issues yet. They are orchestration and planning-quality issues:

- The planner was allowed to self-select too much scope.
- Tool-written files and orchestrator-written stage artifacts diverged.
- Relative paths supplied to `write_file` were resolved under `runOutputDir`, duplicating `generated/java-mapper-poc/runs/<runId>` inside itself.
- Failed tool calls were returned to the LLM as normal text, so the model kept retrying bad paths.
- Each role can use up to 8 tool rounds, and each tool round can contain many sequential tool calls, making one planning role take tens of minutes.
- The product scope says support is "to be selected by the planner", but it does not give the planner a deterministic FX product map. That forces the model to discover product types through broad search and makes it easy to over-claim support.

Root cause hypothesis: the pipeline is currently too agent-open-ended for a first compiler proof. The LLM is being asked to discover scope, retrieve evidence, write artifacts, critique itself, and decide convergence through free-form Markdown before the system has strong static contracts, budgets, canonical evidence packets, or path normalization. That combination caused slow wandering and malformed artifacts before any Java generation happened.

## What We Are Building

The design doc describes a build-time Java generator agent for FpML-to-CDM conversion. The important distinction is:

- Agent-generation runtime: TypeScript/Bun orchestrator that calls LLM roles, reads evidence, writes plans, generates Java, runs checks, and repairs failures.
- Mapper runtime: generated Java jar that accepts FpML XML and emits CDM JSON plus sidecar reports. It must not call an LLM or read agent Markdown.

The selected approach is "Approach C - Build-Time Agentic Java Generator". The first product family is FX derivatives. The implementation may still be staged by product group, but the plan should reason from a precomputed FX product map rather than discovering the family structure from scratch.

The desired flow is:

```text
Prepared FpML/CDM/Rosetta context
  -> multi-agent Java generation pipeline
  -> generated Java source and tests
  -> compiled jar
  -> runtime FpML XML to CDM JSON conversion
```

The current code implements the first shell of that pipeline:

- `src/java-generator-agent/config.ts` creates a run config.
- `src/java-generator-agent/workspace.ts` creates Markdown workspace files.
- `src/java-generator-agent/orchestrator.ts` runs planner, critic, critique-reviewer, implementer, gates, repair, and build-reviewer roles.
- `src/java-generator-agent/tool-runner.ts` loops LLM calls with tool results.
- `src/java-generator-agent/tools.ts` exposes read/list/search/parse/write/run/validate tools.
- `src/java-generator-agent/gates.ts` runs TypeScript, Maven, jar runtime, and output validation gates.
- `scripts/run-java-generator-agent.ts` wires the CLI to OpenRouter.

## Current Git Diff

Tracked changes:

- `package.json`: adds `java-agent:run`.
- `src/config.ts`: adds `JAVA_GENERATOR_MODEL` and `JAVA_GENERATOR_MAX_TOKENS`.
- `src/agent/client.ts` and `src/agent/types.ts`: improve OpenRouter error handling and add `LLMProviderError`.
- `test/agent/client.test.ts`: covers provider error envelopes and unexpected response shapes.

Untracked new work:

- `docs/java-generator-agent-design.md`
- `scripts/run-java-generator-agent.ts`
- `src/java-generator-agent/`
- `test/java-generator-agent/`
- `generated/`

Local verification:

- `node .\node_modules\typescript\lib\tsc.js --noEmit` passed.
- `bun test test\java-generator-agent` passed: 4 tests, 0 failures.

The focused tests cover happy paths for workspace creation, tool writing, path rejection, and feeding tool results back to the model. They do not yet cover the observed failure modes from the real run.

## Observed Run Timeline

Latest run:

```text
generated/java-mapper-poc/runs/2026-05-01T17-28-07-939Z
```

Run log:

- `17:28:07` workspace created.
- `17:28:07` planning round 1 started.
- `18:08:56` planning round 2 started.
- `19:08:27` planning round 3 started.
- `19:24:08` generator failed with `Provider returned error | code=503`.

Approximate elapsed time: 1 hour 56 minutes.

No `gate-results.json` exists. No implementation stage ran. No Maven project was generated. No jar was promoted.

Across all observed generated runs, none reached gates:

- `2026-05-01T16-59-59-071Z`: failed on `Read path outside allowed roots: data`.
- `2026-05-01T17-09-36-371Z`: failed on network connectivity.
- `2026-05-01T17-10-28-834Z`: failed on `OpenRouter response missing choices[]`.
- `2026-05-01T17-28-07-939Z`: failed on provider `503`.

## Output Quality Assessment

### 1. The Pipeline Did Not Produce Java

The most important output assessment is that there is no generated mapper project in the latest run. The intended design calls for `pom.xml`, Java sources, Java tests, runtime outputs, sidecar reports, and build reports. The latest run only contains Markdown planning artifacts, a final blocked report, and a tool audit log.

This means the current output quality problem is upstream from Java generation.

### 2. Stage Artifacts Diverged From Tool-Written Artifacts

The official `agent-workspace/round-01/planner-plan.md` is only:

```text
[tool_calls_requested end]
```

But the tool audit shows the model also wrote planner files through `write_file` into nested locations such as:

```text
generated/java-mapper-poc/runs/<runId>/generated/java-mapper-poc/runs/<runId>/agent-workspace/planner-plan.md
```

The orchestrator then wrote its own role return value to the official round file. So humans looking at the official workspace see one artifact, while the LLM may have written a different artifact elsewhere. This is a core auditability defect.

Likely cause: `writeFileTool` treats any non-absolute path as relative to `config.runOutputDir`. If the model passes a path that already starts with `generated/java-mapper-poc/runs/<runId>`, it gets nested under the run directory again.

### 3. The Planner Expanded Scope Too Far

The design doc selects FX derivatives as the first product family. Current `createRunConfig` gives the planner two candidate fixtures, spot and forward, but leaves `supportedProducts` empty and does not provide a full classified FX product map. The product scope file says:

```text
Supported products for this run:
- To be selected by the planner from FX derivatives evidence.
```

The planner used that opening to expand the plan. Round 1 reportedly claimed all 25 fixtures, including two term-deposit fixtures. Round 2/3 corrected term deposits but still moved toward 13 runtime-supported FX products, including options and swaps.

That may be a reasonable family-level ambition, but it happened through free-form discovery instead of a controlled product map. The result was slow, hard to audit, and prone to over-claiming runtime support before the implementation sequence was clear.

### 4. The Critic Found Real Domain Defects

The critic artifacts are useful. They identify genuine mapping issues:

- Term deposits were incorrectly included as supported.
- Evidence quality was confused with runtime support.
- Round 1 lacked a concrete Maven/project structure.
- Forward points should map into `Price.composite`, not a flat `forwardRate`.
- Option premium mapping needs `transferHistory`.
- The model architecture was ambiguous: JAXB input model, Jackson output model, and in-memory bridge were not clearly specified.
- Party LEIs appear in expected CDM but are not present in FpML, so strict expected-output comparison can fail unless enrichments are handled or excluded.

These are exactly the kind of findings the multi-role design should surface. The problem is that getting to those findings took too long and did not converge to implementation before provider failure.

### 5. The Round-3 Plan Is More Concrete But Still Too Large

Round 3 says it is "ready for code generation" and fixes several issues. However, it still claims 13 runtime-supported products. That is not aligned with the original first-slice acceptance criteria.

It also proposes a full JAXB-annotated FpML POJO hierarchy and Jackson CDM POJO hierarchy. That may be clean in theory, but for a first generator proof it is likely too large and brittle. A faster first version should probably parse FpML with DOM/XPath or a thin helper over the parsed XML and emit CDM-shaped JSON with Jackson. The CDM-native model can come later, as the design doc already describes.

## Performance Assessment

The latest run's tool audit contains:

```text
total tool calls: 915
search_text: 776
read_file: 97
list_files: 22
write_file: 8
parse_xml_summary: 6
parse_json_summary: 6
tool errors: 327
```

The top repeated calls were:

- 219 searches for `swaption` under `data/agent-cookbook/latest/fx-derivatives`, a path that does not exist.
- 202 searches for `rosetta` under `data_to_learn_from/fpml/fx-derivatives`, which repeatedly returned no matches.
- 294 total `ENOENT` errors for `data/agent-cookbook/latest/fx-derivatives`.

The biggest performance root causes are:

1. Missing static evidence packet.
   The LLM repeatedly lists and searches raw folders instead of receiving a curated run-local packet: selected fixtures, available CDM examples, relevant cookbook pages, relevant Rosetta docpack paths, and unsupported products.

2. No negative-result cache.
   The same bad path and no-match searches were repeated hundreds of times.

3. Tool errors are not circuit-breaking.
   `executeGeneratorTool` returns `ERROR: ...` as text but keeps the role going. The model treats this as more evidence to recover from, not as a signal to stop retrying.

4. Too many tool rounds.
   Every role gets up to 8 tool rounds, and every planning round runs planner, critic, and critique-reviewer. With 3 planning rounds, the system can make many LLM calls before implementation even starts.

5. Tool calls within a response run sequentially.
   If a model emits many `search_text` calls, `callRoleWithTools` awaits them one by one.

6. Scope discovery is too open-ended.
   Letting the planner discover FX product groups from raw folders makes the run slower and less predictable. The model should receive a deterministic classification of the FX family first.

## Root Causes

### RC1: Product Scope Guidance Is Missing

The first family is `fx-derivatives`, but the current product scope leaves product-type discovery to the planner. The critic can object, but the pipeline pays for full exploration first.

Fix direction: add a semi-deterministic product-scope guidance layer before planning. It should classify FX fixtures into product groups and identify non-FX fixtures, known paths, expected CDM files, and candidate implementation groups.

```json
{
  "productFamily": "fx-derivatives",
  "classifiedGroups": [
    "fx-single-leg",
    "fx-swap",
    "fx-simple-option",
    "fx-digital-option",
    "fx-barrier-option",
    "fx-average-rate-option",
    "fx-strategy"
  ],
  "nonFxFixtures": ["term deposits"]
}
```

The planner should choose an implementation sequence from this classified FX product map. It should not discover product roots by repeatedly searching the repo, and it should not add non-FX products.

### RC2: `write_file` Path Semantics Are Too Easy To Misuse

The model sees `runOutputDir` in the prompt and naturally writes paths including that prefix. The tool then prepends `runOutputDir` again.

Fix direction:

- Give `write_file` a logical path contract such as `agent-workspace/...`, `pom.xml`, `src/main/java/...`.
- Reject any relative write path containing `generated/`, the run id, or `..`.
- Normalize paths and return a specific error: "write paths must be relative to the run root; do not include runOutputDir".
- Keep `write_file` enabled, but make it stage-aware. For planning roles, the same tool should accept only the current round's canonical artifact and approved scratch paths.

### RC3: Tool Runner Does Not Distinguish Role Artifact Text From Tool Side Effects

The current role result is whatever final assistant content is returned. But the model can also write files as a side effect. That produced official artifacts like `[tool_calls_requested end]` while useful content went elsewhere.

Fix direction:

- Keep three planning rounds available. The goal is not fewer review passes; it is faster, bounded, evidence-rich passes.
- Keep `write_file` enabled, but make its contract deterministic: planning roles may write only to their current canonical stage path and approved scratch paths under the current round.
- Keep each planner output as one complete Markdown plan. Do not split planning into partial fragments just to make it faster.
- Add stage-aware write permissions. For example, the planner in round 2 can write `agent-workspace/round-02/planner-plan.md`, but cannot write `round-01/*`, arbitrary nested run paths, or implementation files.
- After each role, the orchestrator should verify that the canonical artifact exists, is non-placeholder content, and matches the expected stage before moving on.

### RC4: Repeated Bad Tool Calls Are Not Budgeted

The run burned hundreds of calls on missing paths and no-match searches.

Fix direction:

- Add per-role budgets: max total tool calls, max failed tool calls, max repeated identical tool calls.
- Add negative-result caching for `list_files`, `search_text`, `read_file`, and parse tools.
- If the same tool/input fails twice, return a hard "repeated failure blocked" result and stop the role if failures exceed a threshold.

### RC5: Evidence Retrieval Is Agent-Driven Instead Of Deterministic

The agent should reason over evidence, but the first pass of evidence selection should be deterministic. Right now the LLM spends expensive context and time discovering facts that the TypeScript runtime can prepare cheaply.

Fix direction:

- Build `evidence-packet.md` before LLM planning.
- Include exact fixture list, selected fixture summaries, expected CDM summaries, relevant cookbook page snippets, and relevant Rosetta docpack paths.
- Include "known absent" paths so the model does not invent `data/agent-cookbook/latest/fx-derivatives`.
- Give the planner the packet and narrow broad `list_files`/`search_text` access to approved evidence roots and explicit verification needs.

### RC6: Gate Strategy Only Runs After Implementation

Because gates run only after planning and implementation, an unbounded planning problem can waste a long run before any deterministic feedback arrives.

Fix direction:

- Add preflight gates before LLM calls:
  - evidence roots exist
  - selected fixtures exist
  - expected CDM files exist
  - Maven availability check, if implementation will run
  - output directories are clean and writable
- Add planning artifact validation:
  - contains `Decision: ACCEPTED` only in critique-resolution
  - supported products are subset of configured supported products
  - no non-FX products
  - no planned fixture outside configured scope

## Recommended Fix Order

### P0: Make Runs Fast Enough To Iterate

1. Add semi-deterministic FX product-scope guidance.
2. Add deterministic evidence packet generation.
3. Keep the planner responsible for one complete end-to-end implementation plan, but make that plan faster by giving it pre-collected evidence instead of making it search the repo.
4. Keep three planning rounds, but make each round cheaper by reusing the same deterministic evidence packet, previous-round summaries, and cached tool results.
5. Add tool budgets and repeated-call blocking.
6. Keep `write_file` enabled with role/stage-aware write permissions and path normalization.
7. Add resumable runs so failed provider calls do not force full reruns from scratch.

Expected impact: first useful plan should take minutes, not hours.

### P1: Make Artifacts Trustworthy

1. Canonicalize all run paths and use absolute paths internally.
2. Reject duplicate run-root writes.
3. Add a stage manifest that is updated after every role:

```json
{
  "stage": "planner",
  "round": 1,
  "status": "passed",
  "artifact": "agent-workspace/round-01/planner-plan.md",
  "llmCalls": 2,
  "toolCalls": 5,
  "failedToolCalls": 0
}
```

4. Persist LLM call metadata: role, round, started, ended, model, token estimates if available, tool count, stop reason.
5. Treat provider failure as resumable when prior stage artifacts exist.
6. Add artifact quality checks: reject placeholder content, unresolved tool-call markers, empty decisions, unsupported-scope expansion, and references to paths outside the deterministic evidence packet.

### P2: Improve Output Quality

1. Require the accepted plan to stay within the configured runtime scope.
2. Compare expected CDM only on mappable assertions for milestone 1. Do not strict-compare enriched fields such as LEIs unless an enrichment table is supplied.
3. Generate smaller Java first:
   - DOM/XPath or parsed XML helper for FpML
   - Jackson `ObjectNode` or small CDM-shaped DTOs for output
   - sidecar reports
   - unsupported detection
4. Defer full JAXB and official CDM Java model until the first static jar passes end-to-end gates.

### P3: Improve Resilience

1. Add provider retry/backoff for 429/503.
2. Save partial accepted plans and support resume.
3. Add role-specific model configuration and token budgets.
4. Add provider/model fallbacks by role.
5. Add a dry-run/mock LLM fixture test that reproduces:
   - model calls bad path repeatedly
   - model writes nested run path
   - model returns tool calls but no final content
   - provider fails after round 2

### P4: Tune Cost And Latency

1. Use cheaper Qwen models for planner, critic, and critique reviewer.
2. Use MiniMax only where it has the most leverage: implementation and repair.
3. Set lower `maxTokens` for critic/reviewer than planner/implementer.
4. Capture per-role cost estimates so model choices can be benchmarked with real runs.
5. Add a `--model-profile cheap|balanced|strong` CLI option once the role model split is implemented.

## Concrete Test Gaps To Add

1. `write_file` rejects paths that duplicate `config.runOutputDir`.
2. Planning roles can use `write_file`, but only for their current round/stage canonical artifact and approved scratch files.
3. Tool runner stops after repeated identical failed calls.
4. Tool runner records per-role tool counts and failure counts.
5. A planner cannot mark non-configured products as runtime-supported.
6. A failed provider response after a completed round preserves artifacts and emits a resumable status.
7. Evidence packet includes correct FX cookbook paths:
   - `data/agent-cookbook/latest/product-families/fx-derivatives.md`
   - `data/agent-cookbook/latest/references/fx-derivatives.evidence.json`
   - not `data/agent-cookbook/latest/fx-derivatives`

## Proposed Near-Term Architecture Adjustment

Keep the selected design, but make the first milestone less open-ended:

```text
Preflight
  -> semi-deterministic FX product-scope guidance
  -> deterministic evidence packet for the classified FX family
  -> round 1 planner reads packet and writes complete plan
  -> round 1 deterministic plan validator
  -> round 1 critic reads packet + plan and writes review
  -> round 1 critique reviewer writes resolution
  -> repeat for rounds 2 and 3 when required, reusing cached evidence
  -> accepted-plan synthesis
  -> implementer gets write_file and generates Java
  -> gates
  -> repair loop
```

The key change is that agents reason inside a bounded compiler job. They should refine the implementation plan across three rounds, but they should not invent or expand the compiler job itself.

## Model Strategy

Use Qwen for the planning pressure and MiniMax for the code-producing stages. This keeps cost low while preserving a stronger agentic model where mistakes are most expensive.

Recommended role models:

```env
JAVA_GENERATOR_PLANNER_MODEL=qwen/qwen3-coder-30b-a3b-instruct
JAVA_GENERATOR_CRITIC_MODEL=qwen/qwen3-coder-next
JAVA_GENERATOR_REVIEWER_MODEL=qwen/qwen3-coder-next
JAVA_GENERATOR_IMPLEMENTER_MODEL=minimax/minimax-m2.7
JAVA_GENERATOR_REPAIR_MODEL=minimax/minimax-m2.7
```

Recommended role output budgets:

```text
planner:            7k-10k output tokens
critic:             3k-5k output tokens
critique reviewer:  3k-5k output tokens
implementer:        12k-20k output tokens
repair:             8k-12k output tokens
build reviewer:     2k-4k output tokens
```

Recommended fallbacks:

```env
JAVA_GENERATOR_PLANNER_FALLBACK_MODEL=qwen/qwen3-coder-next
JAVA_GENERATOR_CRITIC_FALLBACK_MODEL=minimax/minimax-m2.7
JAVA_GENERATOR_IMPLEMENTER_FALLBACK_MODEL=qwen/qwen3-coder-next
JAVA_GENERATOR_REPAIR_FALLBACK_MODEL=qwen/qwen3-coder-next
```

The planner should be cheap because it reads a deterministic evidence packet rather than discovering the repo from scratch. The critic should be a different model family from the planner so it catches planner blind spots. MiniMax is best reserved for implementer and repair, where the model must write or patch Java and reason from gate failures.

Do not use one global `JAVA_GENERATOR_MODEL` for every role once this pipeline is hardened. A single model is simpler but wastes credits and creates same-model blind spots in critic/reviewer stages.

## Additional Enhancements

The following changes fit the desired direction: three complete planning rounds, `write_file` enabled, deterministic scope, and better orchestration.

### Semi-Deterministic Product-Scope Guidance

Add a pre-LLM product classifier that turns the FX family input into an explicit product map:

```json
{
  "productFamily": "fx-derivatives",
  "productGroups": [
    { "group": "fx-single-leg", "fixtureCount": 7, "implementationHint": "good-first-target" },
    { "group": "fx-swap", "fixtureCount": 1, "implementationHint": "candidate" },
    { "group": "fx-simple-option", "fixtureCount": 4, "implementationHint": "candidate" },
    { "group": "fx-digital-option", "fixtureCount": 6, "implementationHint": "later" },
    { "group": "fx-barrier-option", "fixtureCount": 2, "implementationHint": "later" },
    { "group": "fx-strategy", "fixtureCount": 2, "implementationHint": "later" }
  ],
  "nonFxFixtures": ["td-ex01-simple-term-deposit.xml", "td-ex02-term-deposit-w-settlement-etc.xml"]
}
```

The planner may choose a staged implementation sequence across FX groups, but it must choose from the classified map and justify the ordering. Non-FX products remain excluded.

### Evidence Packet Cache

Generate `agent-workspace/evidence-packet.md` once, then reuse it across all three planning rounds. Include fixture summaries, expected CDM summaries, relevant cookbook paths, relevant Rosetta snippets, and known missing paths. This keeps completeness while avoiding repeated repo search.

### Role-Specific Tool Profiles

Keep `write_file`, but vary the rest of the tool surface:

- Planner: read evidence packet, parse selected fixtures, search only approved evidence roots, write current planner plan.
- Critic: read evidence packet, read current plan, search only when a claim needs verification, write current critic review.
- Critique reviewer: read plan and critic review, write current resolution, no broad search unless explicitly needed.
- Implementer: write Java project files, run allowed commands, read accepted plan and selected fixtures.
- Repair: read failed gates, read generated files, write generated files, rerun allowed commands.

### Round Delta Summaries

After each round, write a short `round-summary.md`:

```text
Accepted corrections:
- ...

Open blockers:
- ...

Scope changes:
- none allowed / rejected attempted expansion
```

Round 2 and 3 should read the previous summary first, not the full raw transcript unless needed. That keeps the rounds complete but faster.

### Deterministic Plan Validator

Before the critic runs, validate the planner plan mechanically:

- all supported products are in the configured scope
- all fixture paths exist
- all planned Java files are under the generated project
- no runtime LLM dependency
- sidecar reports are planned
- unsupported cases are explicit
- no references to non-existent evidence paths

This gives the critic a clean checklist and catches obvious scope drift early.

### Tool Call Cache And Loop Guard

Cache tool results by `{toolName, input}` for the whole run. Repeated identical calls should return instantly from cache. Repeated identical failures should become a hard blocked result with a clear message, not another slow filesystem operation.

### Speed Improvements

The planning loop should become faster by removing repeated discovery work, not by making plans less complete.

Highest-impact speed changes:

1. Precompute the evidence packet.
   Build one compact `evidence-packet.md` and optional `evidence-packet.json` before any LLM call. The planner should not spend tool rounds discovering files, fixture names, cookbook paths, or Rosetta docpack locations.

2. Cache every deterministic tool result.
   Cache `read_file`, `list_files`, `search_text`, `parse_xml_summary`, `parse_json_summary`, and validation helpers by `{toolName, normalizedInput}`. Reuse the cache across all three planning rounds.

3. Cache failures and block repeated bad calls.
   If `data/agent-cookbook/latest/fx-derivatives` fails once or twice, the tool layer should block that exact path for the rest of the run and tell the model the canonical replacement path.

4. Replace broad search with deterministic retrieval tools.
   Add higher-level tools:
   - `get_scope_evidence`
   - `get_fixture_summary`
   - `get_expected_cdm_summary`
   - `get_rosetta_snippets`
   - `get_unsupported_products`

   Keep `search_text` available, but make it a fallback for explicit verification, not the default way to discover evidence.

5. Summarize between rounds.
   Each round should write `round-summary.md`. Round 2 and round 3 should read the previous summary first and only read full prior artifacts when resolving a specific issue.

6. Use smaller role-specific output budgets.
   Planner can use 7k-10k output tokens. Critic and critique reviewer should normally use 3k-5k. Build reviewer can be 2k-4k. This prevents inexpensive roles from becoming expensive document generators.

7. Parallelize deterministic preflight.
   Before LLM calls, parse selected FpML fixtures, parse expected CDM JSON, read cookbook pages, and read Rosetta snippets in parallel.

8. Resume from the last completed stage.
   If a provider fails in round 3, rerun round 3 only. Do not rerun round 1 and round 2 unless scope or evidence changed.

9. Provide product-scope guidance before planning.
   The planner should receive the classified FX product map before round 1. If it discovers adjacent or unknown products, it records them as human-review candidates, not current implementation scope.

10. Stage gates.
   Do not run full Maven package/runtime gates until the generated project passes cheap structural checks: `pom.xml` exists, expected Java source folders exist, tests exist, and no runtime LLM dependency is present.

Expected impact: the first three changes should remove the largest observed waste from the latest run: repeated missing-path searches, repeated no-result searches, and raw repository discovery during planning.

### Resume By Stage

Persist stage status so a provider error in round 3 does not require rerunning round 1 and round 2. This matters more when keeping three planning rounds.

### Accepted Plan Synthesis

Do not treat the round-3 planner plan as automatically accepted. After the third critique resolution, synthesize a final `accepted-plan.md` from:

- deterministic scope file
- evidence packet
- latest planner plan
- accepted critic corrections
- rejected scope expansions
- deterministic plan-validator findings

This keeps the final contract clean and avoids carrying stale wording from earlier rounds into implementation.

### Cost Ledger

Write `build-reports/model-cost-ledger.json` with one entry per role call:

```json
{
  "role": "critic",
  "round": 2,
  "model": "qwen/qwen3-coder-next",
  "inputChars": 42110,
  "outputChars": 3812,
  "toolCalls": 3,
  "cachedToolCalls": 2,
  "failedToolCalls": 0,
  "durationMs": 18420
}
```

Exact token counts may not always be available from providers. Character counts plus model pricing are still good enough to compare model profiles and identify runaway stages.

### Human Review Gate For Scope Expansion

Agents may propose future support, but current-run scope expansion should require a human gate or an explicit CLI flag. For example:

```text
--allow-scope-expansion=false
```

Default should be false for non-FX expansion. Within FX derivatives, the planner may sequence classified product groups, but it must not invent unknown groups or fixture paths.

## Implementation Sequence

The safest implementation order is:

1. Add role model config and per-role token budgets.
2. Add semi-deterministic product-scope guidance and write `00-product-scope.json` next to the Markdown scope.
3. Add evidence packet generation and cache it for all three planning rounds.
4. Add deterministic retrieval tools so planner/critic do not rely on broad raw search.
5. Add tool result cache and repeated-failure loop guard.
6. Parallelize deterministic preflight evidence gathering.
7. Add round summaries and make later rounds read summaries first.
8. Make `write_file` stage-aware while keeping it enabled.
9. Add staged gates: cheap structural checks before Maven/package/runtime checks.
10. Add deterministic plan validator and run it before each critic pass.
11. Add stage manifest and resume-by-stage.
12. Add accepted-plan synthesis.
13. Add cost ledger and model profile benchmarking.
14. Only then tune prompts, because the structure will finally make prompt results measurable.

## Bottom Line

The design direction is sound: use LLMs at build time, ship deterministic Java at runtime. The current implementation proves the roles and tool plumbing exist, but the first real run shows the loop is too unconstrained.

The highest-leverage fixes are not prompt tweaks. They are contracts:

- hard product scope
- deterministic evidence packets
- canonical artifact ownership
- path normalization
- tool budgets
- repeated-failure blocking
- resumable stages
- role-specific Qwen/MiniMax model routing
- cost and latency ledger
- deterministic retrieval tools
- cached evidence and tool results
- staged gates

Once those are in place, the Java output quality can be assessed properly because the pipeline will actually reach implementation and gates.
