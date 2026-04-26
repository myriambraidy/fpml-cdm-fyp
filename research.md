# Research Report: `/src/draft`

## Executive Summary

`/src/draft` is a folder-scoped research pipeline for learning reusable FPML -> CDM mapping knowledge from already-paired example files. It is not a mapper, not a validator, and not a final documentation generator. Its real job is to take one product folder such as `fx-derivatives`, inspect the matched FPML/XML and CDM/JSON examples for that folder, extract pair-level evidence, synthesize folder-level patterns, and emit a research artifact that later agents or later pipeline phases can reuse.

The module is deliberately split into two evidence layers:

1. deterministic structural analysis, which always runs and does not require an LLM
2. semantic extraction and synthesis, which uses the repo’s `LLMClient` abstraction and is treated as optional / failure-prone

That split is the defining design choice of the whole subsystem. Even when semantic extraction fails, the draft phase still produces structural output, debug output, and logs.

After reading the code, tests, plans, config, parsers, and one real generated output in `data/drafts/fx-derivatives`, my main conclusion is:

- the draft pipeline is thoughtfully designed, conservative, and strongly typed
- it is structurally reliable
- it is semantically fragile in practice because LLM structured-output quality is still unstable
- a lot of the current usefulness comes from salvage/fallback behavior rather than clean first-pass success

## What The Draft Phase Is For

The intended purpose of the Draft phase is to build a reusable “mapping playbook” for one folder of examples. It tries to capture:

- repeated FpML structure
- repeated CDM structure
- recurring semantic mapping patterns
- recurring non-literal transformations
- suspected enrichments or defaults
- variants and exceptions
- pair-level worked examples
- an agent-oriented playbook for future mapping work

This matches the implementation plans in:

- `plans/draft-phase-implementation-plan.md`
- `plans/draft-prompt-and-model-hardening-plan.md`

The code follows that intent closely. The module is not trying to infer mappings across the whole dataset at once. It explicitly analyzes one folder at a time, with manual folder selection in `scripts/run-draft-phase.ts`.

## High-Level Architecture

The execution flow is:

1. `scripts/run-draft-phase.ts` sets constants such as selected folder and roots, creates an OpenRouter-backed `LLMClient`, and calls `runDraftPhase`.
2. `src/draft/index.ts` orchestrates the whole phase.
3. `pair-selection.ts` reads `manifest.json` and chooses matched examples for the requested folder.
4. `pair-analysis.ts` analyzes each matched FPML/CDM pair:
   - deterministic document summarization always
   - semantic extraction via LLM when enabled
   - salvage or fallback if the model response is malformed
5. `folder-synthesis.ts` synthesizes all pair results into a folder-level draft:
   - deterministic structure always
   - semantic synthesis via LLM when possible
   - salvage or fallback if malformed
6. `validation.ts` checks that synthesized references only cite allowed example files.
7. `index.ts` decides whether the result is final or partial.
8. `io.ts` writes:
   - `draft.md` or `draft.partial.md`
   - `draft.json` or `draft.partial.json`
   - `debug.json`
   - `run-log.json`

So the module is not one monolithic prompt. It is a staged pipeline with deterministic scaffolding around two LLM calls:

- per-pair extraction
- folder-level semantic synthesis

## Folder By Folder File Analysis

### `src/draft/index.ts`

This is the orchestration layer.

It does these things in order:

- creates a `DraftLogger`
- reads `manifest.json`
- selects pairs for the chosen folder
- analyzes each included pair sequentially
- splits analyses into successful vs failed
- runs synthesis
- validates integrity
- decides whether to publish final vs partial
- assembles artifacts
- writes output files

Important specifics:

- Pair analysis is sequential, not parallel.
- Structural synthesis uses all analyzed pairs, including failed semantic pairs.
- Semantic synthesis uses only successful pair analyses, including salvaged ones.
- Final publication is gated separately from synthesis success.

This file clearly treats semantic extraction as best-effort while keeping the overall run durable.

### `src/draft/types.ts`

This file is the contract for the whole subsystem. It is extensive and valuable because it shows the design more clearly than any one implementation file.

Important type families:

- run config and run status
- manifest / selection types
- per-document and per-pair summary types
- folder synthesis types
- logging and debug types
- integrity validation and publication decision types

Notable design choices encoded in the types:

- pairing strategies are explicit: `exact`, `normalized`, `alias`
- semantic recovery is explicit: `full`, `salvaged`, `none`
- publication status is explicit:
  - `success`
  - `partial_success`
  - `failed_pair_analysis`
  - `failed_synthesis`
  - `failed_integrity_validation`
  - `deterministic_only`

This type model makes the pipeline legible and debuggable. It is one of the stronger parts of the implementation.

### `src/draft/pair-selection.ts`

This module is conservative and manifest-driven.

Key mechanics:

- Normalizes slashes so Windows paths behave consistently.
- Matches folders by exact folder or folder prefix.
- Reads the manifest from disk.
- Includes only entries whose manifest status is `matched`.
- Keeps track of:
  - included pairs
  - missing examples
  - ignored examples
  - coverage summary

Important specifics:

- `maxPairs` truncates from the front of manifest order.
- truncated-away matched pairs are not lost silently; they become `ignoredExamples` with a reason
- missing examples are carried forward explicitly
- absolute file paths are derived from configured roots, not from the manifest source roots

Subtle edge case:

- `maxPairs: 0` behaves like “no limit” because the condition is `config.maxPairs && config.maxPairs > 0`

### `src/draft/pair-analysis.ts`

This is the most important and most intricate file in the module.

Its job is to take one FPML/XML file and one CDM/JSON file and produce:

- deterministic document summaries
- semantic mapping observations
- transformation observations
- enrichment observations
- open questions
- a pair highlight

The design has three layers:

1. deterministic parsing
2. clean LLM structured response path
3. salvage/fallback path if the model output is broken

#### Deterministic parsing and summarization

The pair-analysis stage parses:

- FPML with `parseXML`
- CDM with `parseJSON`

It then summarizes each document into a compact `PairDocumentSummary` containing:

- `format`
- `root`
- `topLevelSections`
- `structuralNotes`
- `headerBoilerplateSignals`
- `nestedStructureSignals`
- `samplePaths`
- `rawFieldCount`

Important specifics:

- XML top-level sections are derived from the second segment after the root.
- JSON top-level sections are derived from the first JSON path segment.
- arrays are normalized by removing `[index]` when building section summaries
- `headerBoilerplateSignals` are detected with a regex looking for things like:
  - `header`
  - `tradeHeader`
  - `conversationId`
  - `messageId`
  - `partyTradeIdentifier`
  - `counterparty`
  - `tradeIdentifier`
  - `meta`
- only limited numbers of paths/signals are kept:
  - path limit: 10
  - structure limit: 8

This means the deterministic layer is intentionally summarized and lossy. It is good for scaffolding, not for full forensic inspection.

#### Pair-analysis prompt design

`prompts.ts` builds a strict extractor-style prompt, not a documentation prompt.

Notable constraints in the pair-analysis prompt:

- return only JSON
- no comments
- no invented filenames
- use exact `fpmlRelativePath` and `cdmRelativePath`
- if evidence is weak, return empty arrays
- ground observations in the input only
- treat unsupported CDM details as enriched or unclear

The user prompt includes:

- pair identity
- extraction limits
- deterministic summaries
- truncated raw FPML and CDM documents

The raw documents are truncated at 40,000 chars each.

#### LLM structured-output path

If an `LLMClient` is present:

- the module requests strict JSON schema output using Zod + `zodToJsonSchema`
- it records prompt and response sizes
- on success, it returns a `DraftPairAnalysis` with `semanticRecovery: 'full'`

This is the ideal path.

#### Fallback and salvage behavior

This is where the code is especially careful.

If no LLM is present:

- the pair returns `status: 'failed'`
- `failureKind: 'llm_disabled'`
- deterministic summaries still exist
- a fallback pair highlight is produced

If the LLM request fails:

- the pair returns `status: 'failed'`
- `failureKind: 'request_error'`
- deterministic summaries still survive

If the LLM returns malformed JSON:

- the code tries to salvage partial JSON with `extractPossiblyTruncatedJsonObject`
- then revalidates salvageable portions field by field
- missing pieces are reconstructed from deterministic fallback logic where possible

If salvage succeeds:

- the pair is treated as `status: 'success'`
- `semanticRecovery: 'salvaged'`

This salvage path is not superficial; it is central to how the subsystem works today.

#### Pair highlight fallback logic

The fallback highlight is interesting because it preserves usefulness even when semantics fail. It uses:

- top-level sections from both documents
- placeholder mapping statements
- uncertainty that explicitly says live LLM analysis is still needed

That means failed pairs still contribute structure, but not trusted semantic rules.

### `src/draft/folder-synthesis.ts`

This is the second major file.

It combines:

- deterministic structure across all pairs
- semantic synthesis across successful pairs only

#### Deterministic structure synthesis

This part does not need an LLM.

It computes:

- repeated FpML sections
- repeated CDM sections
- nested structure summaries
- common header/boilerplate behaviors

Important specifics:

- section frequency is counted per pair, deduplicated per document
- a section is “repeated” only if it appears in at least `max(2, ceil(total * 0.6))` examples
- anything below that threshold becomes “optional”

This threshold has a practical side effect:

- in a folder with only 1 matched pair, nothing counts as “repeated”; everything ends up optional

That is conservative and probably intentional, but it is worth knowing.

#### Semantic folder synthesis

If there is LLM access and at least one semantic pair analysis:

- it sends only accepted pair facts to the model
- it explicitly says structural repetition is handled outside the prompt
- it asks only for semantic sections

The schema includes:

- stable mapping patterns
- repeated non-literal transformations
- folder-level principles
- variants and exceptions
- suspected enrichment/default behavior
- open questions
- pair-level highlights
- draft conclusion

The deterministic structure and agent playbook are not delegated fully to the model; they are partly built in code.

#### Fallback synthesis

If no LLM is available, or no semantic pairs succeeded:

- the module still returns a full `DraftFolderSynthesis`
- semantic sections remain empty or generic
- structural sections are still populated
- an agent playbook is still built from deterministic signals and whatever pair highlights exist

This is a strong design decision: synthesis never simply disappears. It degrades to a deterministic shell.

#### Merge strategy

When semantic synthesis succeeds, it does not replace the fallback wholesale. It merges semantic content into a deterministic base:

- semantic lists override fallback when non-empty
- fallback content survives where semantic content is empty
- `agentPlaybook` is rebuilt after merging

This is good because deterministic structure remains stable even if semantic synthesis is partial.

#### Semantic salvage

Folder-level synthesis has the same pattern as pair analysis:

- strict parse first
- salvage if malformed
- fallback if salvage fails

The salvage path only keeps semantically meaningful sections if at least one of them survives validation.

### `src/draft/prompts.ts`

This file is small but important. It reveals the philosophy of the pipeline.

The prompts are intentionally narrow, extractor-oriented, and anti-speculation.

Important specifics:

- full documents are included, but truncated
- deterministic summaries are also included
- the synthesis prompt explicitly separates structural work from semantic work
- allowed pair identities are supplied to reduce invented filenames

This file reflects the “hardening” plan well.

### `src/draft/io.ts`

This file handles both file writing and structured-response parsing/salvage helpers.

Important functions:

- `readUtf8`
- `ensureParentDir`
- `writeDraftArtifacts`
- `extractJsonObject`
- `extractPossiblyTruncatedJsonObject`
- `parseStructuredResponse`

The JSON salvage logic is one of the cleverer parts of the subsystem:

- it can extract JSON from fenced code blocks
- it can extract the first balanced JSON object from surrounding prose
- it can attempt repair of truncated objects by:
  - recording “safe points” at commas and closing brackets/braces
  - trimming dangling tails
  - closing the remaining open stack

This is exactly why the module can recover value from `Unexpected EOF` or `Unterminated string` style failures.

### `src/draft/logging.ts`

This is a simple in-memory logger with console emission and JSON-serializable entries.

Its strengths:

- consistent stages
- compact formatting
- log capture is artifact-friendly

One subtle implementation quirk:

- `run-log.json` and `debug.json.runLog` are written before the final `"Draft phase run completed."` log line is pushed in `index.ts`
- so persisted run logs do not include the final completion entry, even though it is emitted to console

I confirmed this in `data/drafts/fx-derivatives/run-log.json`: the last persisted entry is `"Writing draft artifacts to disk."`

### `src/draft/validation.ts`

This file performs integrity validation on synthesized semantic references.

It checks whether synthesis references only allowed file identities from successful pair analyses:

- pair highlights
- rule example files
- transformation example files
- variant example files
- enrichment evidence files

It is intentionally narrow. It validates file reference legitimacy, not semantic correctness.

Important specifics:

- both full relative paths and basenames are allowed
- validation only uses successful pair analyses, not failed ones

This makes sense because semantic synthesis is only supposed to be based on successful semantic evidence.

#### Publication decision logic

Publication is decided here too.

The decision flow is:

- if no LLM: `deterministic_only`, never final
- if zero successful pair analyses: `failed_pair_analysis`
- if no synthesis: `failed_synthesis`
- if integrity fails: `failed_integrity_validation`
- otherwise possibly `partial_success` or `success`

Important nuance:

`semanticSignalCount` is defined as:

- count of stable mapping patterns
- plus count of repeated non-literal transformations
- plus count of folder-level principles that do not start with “No live LLM” or “No semantic synthesis”

Because fallback synthesis inserts the generic principle:

- `Generalize only from repeated semantic evidence; use structural repetition only for scaffolding.`

that generic fallback principle counts as a semantic signal.

Practical consequence:

- a run can publish `status: "success"` and `publishFinal: true` even when:
  - there are zero stable mapping patterns
  - zero repeated transformations
  - zero variants
  - zero enrichment summaries

I confirmed this in the real `fx-derivatives` output:

- publication status is `success`
- `publishFinal` is `true`
- but the semantic sections for stable rules and transformations are empty

This is one of the most important behavioral quirks in the current implementation.

## Supporting Files Outside `/src/draft`

### `scripts/run-draft-phase.ts`

This is the operational entrypoint.

It hardcodes:

- workspace root from `process.cwd()`
- FPML root: `data_to_learn_from/fpml`
- CDM root: `data_to_learn_from/cdm_parallel`
- selected folder: `fx-derivatives`
- output dir: `data/drafts`
- `USE_LIVE_LLM = true`

This confirms the Draft phase is currently intended for manual, folder-by-folder runs.

### `src/config.ts`

Draft-specific env vars exist and are well separated:

- `DRAFT_MODEL`
- `DRAFT_SYNTHESIS_MODEL`
- `DRAFT_PAIR_MAX_TOKENS`
- `DRAFT_SYNTHESIS_MAX_TOKENS`
- `DRAFT_STORE_FAILED_RAW_RESPONSES`

Defaults are:

- pair model: `openai/gpt-5-mini`
- synthesis model: `openai/gpt-5-mini`
- pair max tokens: `3000`
- synthesis max tokens: `5000`
- failed raw responses: stored by default

### `src/parser/xml-parser.ts` and `src/parser/json-parser.ts`

These matter because the deterministic summaries depend on them.

Important specifics:

- XML parsing removes namespace prefixes
- XML attributes are preserved with `@_` internally
- attribute-only nodes and text nodes emit fields
- JSON arrays emit an array field plus indexed child traversal
- both parsers normalize and deduplicate fields afterwards

The draft module therefore operates on a normalized field abstraction rather than raw DOM trees.

## Real Observed Behavior From `fx-derivatives`

I inspected the existing run in:

- `data/drafts/fx-derivatives/draft.md`
- `data/drafts/fx-derivatives/debug.json`
- `data/drafts/fx-derivatives/run-log.json`

Observed facts:

- total FpML files in folder: 26
- matched pairs selected: 25
- missing counterparts: 1
- successful semantic pair analyses: 14
- failed semantic pair analyses: 11
- full semantic analyses: 1
- salvaged semantic analyses: 13

This is extremely revealing.

What it says about the subsystem today:

- deterministic structure extraction is working and useful
- clean semantic extraction is not the norm
- salvage is doing a lot of the heavy lifting
- the final published draft can still be thin semantically despite being marked successful

The generated `draft.md` for `fx-derivatives` has:

- strong structural sections
- many pair-level worked examples
- an agent playbook
- but empty folder-level stable mapping patterns
- empty repeated non-literal transformations
- empty variants and enrichments

That means the current system is better at “structure plus example notes” than at “recovering repeated folder-wide semantic rules.”

## Tests And Confidence Level

Draft-specific tests exist under `test/draft` and I ran them.

Result:

- 8 tests passed
- 0 failed

Covered areas:

- pair selection
- pair-analysis salvage behavior
- markdown rendering
- integrity validation
- publication decision

This is good coverage for the support logic, but there are still important untested areas:

- full `runDraftPhase` end-to-end orchestration
- artifact writing and persisted log contents
- prompt payload size behavior on large real examples
- real OpenRouter structured-output reliability
- publication threshold quality on weak semantic results

So the subsystem is reasonably unit-tested, but not strongly end-to-end tested.

## Specific Strengths

- Strong type model with explicit statuses and recovery modes.
- Clear separation between deterministic structure and semantic inference.
- Conservative manifest-driven pair selection.
- Good observability through `debug.json` and `run-log.json`.
- Useful salvage logic for malformed JSON responses.
- Integrity validation prevents invented file references from silently entering synthesis.
- Output artifacts are human-readable and machine-readable.
- The module degrades gracefully instead of failing hard.

## Specific Weaknesses And Risks

- Pair analysis is sequential, so full-folder runs can be slow.
- Semantic success currently depends heavily on salvage rather than clean schema adherence.
- Folder-level semantic rules often remain empty even when publication succeeds.
- Publication can be overly optimistic because a generic fallback principle counts as a semantic signal.
- Persisted run logs miss the final completion event.
- Structural summaries are intentionally lossy due to capped path/sample limits.
- A one-pair folder cannot produce “repeated” sections under the current thresholding.
- `maxPairs: 0` does not mean zero; it means unlimited.
- Validation checks file-reference legitimacy only, not semantic truth.

## My Deep Reading Of The Module’s True Behavior

The draft subsystem is best understood as a robust research harness around unreliable semantic extraction, not as a stable semantic rule engine.

Its real operational contract is:

- always produce something useful
- preserve structure deterministically
- salvage semantic evidence when possible
- be conservative about invented generalizations
- expose enough debug information that later humans/agents can judge confidence

The module succeeds at that contract.

It does not yet reliably succeed at a stronger contract such as:

- consistently extract clean semantic rules from most pairs
- consistently synthesize strong recurring folder-level mapping patterns
- publish only when semantic content is truly substantial

So the current `/src/draft` folder is already a solid research pipeline, but still an intermediate system. It is much closer to “evidence collection and synthesis scaffold” than to “finished knowledge compiler.”

## Bottom-Line Takeaways

- `/src/draft` is a well-structured, folder-scoped FPML/CDM research pipeline.
- The deterministic layer is the most dependable part.
- The LLM layer is carefully hardened but still fragile in real runs.
- Salvage logic is not just a nice extra; it is a core operating mechanism.
- Current final publication criteria are permissive enough that a semantically thin draft can still be labeled successful.
- The module is already useful for structural understanding and pair-level evidence gathering.
- The biggest gap is strong, repeated, folder-level semantic rule recovery.

