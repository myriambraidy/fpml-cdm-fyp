# Plan Review: FX Derivatives Java Mapper

## Blocking Issues

- **Plan selects unknown product groups**: The plan mentions `fx-derivatives`, `fx-spot`, `fx-fwd`, `fx-fwd-w-settlement`, `fx-fwd-w-ssi`, and `fx-fwd-w-splits` as "implementation groups". These are not valid product groups per the product scope. The only valid implementation groups are: `fx-single-leg`, `fx-swap`, `fx-simple-option`, `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy`, and `non-fx`.

- **Misalignment with staged implementation strategy**: The run config and product scope specify `currentImplementationGroup = fx-single-leg`, yet the plan appears to discuss individual fixtures (e.g., `fx-ex01-fx-spot`) as if they were implementation groups rather than members of `fx-single-leg`. This suggests confusion between *product groups* and *individual fixtures*.

- **No mention of implementation group boundaries**: The plan should explicitly state that Phase 1 is limited to the `fx-single-leg` group and that `fx-swap` is reserved for Phase 2. While the text does mention this, the inconsistent usage of product group names undermines the clarity.

- **Missing evidence mapping**: While the plan references the cookbook, there is no explicit mapping of the stable rules from the evidence JSON (`fx-derivatives.evidence.json`) to the features described in the plan.

- **Java mapper runtime requirements violated**: The plan does not explicitly guarantee that:
  - The generated Java runtime does **not** call an LLM at runtime.
  - The generated Java runtime does **not** read the agent workspace (e.g., `agent-workspace`, evidence folders, cookbook).
  - All runtime logic is hard-coded or derived solely from CDM and FpML models without dynamic introspection or LLM inference.

## Non-blocking Concerns

- **Over-reliance on fixed patterns**: The plan should explicitly state which of the stable rules (per `fx-derivatives.evidence.json`) are being relied upon, to support auditability and traceability. For example, `RULE-001` (trade ID mapping), `RULE-002` (date normalization), `RULE-003` (product type taxonomy), `RULE-004` (exercise terms), `RULE-005` (amounts as quantities) should be explicitly called out.

- **Lack of concrete test strategy**: The plan mentions validation gates and edge cases, but does not specify how tests will be derived from fixture pairs (FPML → CDM) — whether tests will be generated, manually written, or auto-validated from expected CDM outputs.

- **No mention of fixture coverage guarantees**: It’s unclear whether the mapper must support *all* fixtures in `fx-single-leg`, or only representative ones. Since this is a staged implementation, explicit commitment to fixture-level coverage would be valuable.

- **Missing error behavior specification**: While the plan mentions error handling, it does not specify whether errors will be surfaced as exceptions, empty results, or validation summaries — and whether those behaviors differ between development and production use.

- **Implementation group change proposal not included**: Since the plan sticks to `fx-single-leg`, no group change is needed — but the absence of an explicit statement confirming no change is requested may raise疑虑.

- **Version assumptions are vague**: The plan mentions "assuming CDM schema version matching" and "FpML 5.1 compatible" without citing specific versions or sources, increasing the risk of downstream drift.

- **Lack of concrete path guarantees**: The plan should explicitly state which paths (e.g., `data/agent-cookbook/latest`, `data/rosetta-source/latest`, fixture paths) are used at **design time** versus which are **excluded at runtime**.

## Decision: FAILED

The plan fails to meet critical requirements for correctness and runtime isolation. It uses incorrect product group names (e.g., `fx-spot`, `fx-fwd`), lacks explicit guarantees for LLM-free and workspace-isolated runtime, and does not explicitly tie features to stable rules from the evidence packet.

**Before next round, planner must:**
1. Replace all references to non-existent groups (`fx-spot`, `fx-fwd`, etc.) with the correct implementation group names (`fx-single-leg`, `fx-swap`, etc.).
2. Explicitly declare that Phase 1 is bounded strictly to `fx-single-leg` and that `fx-swap`/`fx-simple-option` are excluded.
3. List which stable rules (per `fx-derivatives.evidence.json`) are being applied and how they map to the described behaviors.
4. Add a clear section stating that the Java mapper runtime will:
   - Not call an LLM,
   - Not read any agent workspace paths (including `agent-workspace`, `data/agent-cookbook`, `data_to_learn_from`, etc.),
   - Use only compile-time artifacts and the CDM runtime model.
5. Clarify whether the implementation will cover all `fx-single-leg` fixtures, or if only representative patterns are targeted.

Decision: FAILED