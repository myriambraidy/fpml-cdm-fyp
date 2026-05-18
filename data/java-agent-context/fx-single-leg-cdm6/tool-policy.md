# Java Agent Tool Policy

The Java agent must use prepared context before writing Java:

1. Read `rules.json`.
2. Read `source-index.json`.
3. Select Rosetta blocks relevant to FX single-leg mapping.
4. Produce `discovery-report.json` and `generation-plan.json`.
5. Generate Java source, Maven metadata, fixtures, and reports.
6. Run Maven and runtime verification unless explicitly skipped.

The runtime jar must not call an LLM or require network access.
