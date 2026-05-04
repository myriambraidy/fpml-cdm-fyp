## Review

### Blocking Issues

1. **Missing machine-checked scope section header**: The plan must contain a Markdown section `## Implementation scope (machine-checked)` immediately followed by `**In scope (implementation groups):**` bullets listing exactly the groups from `productGroups[].group` with `currentImplementationGroup` included. While the current plan *does* include a correctly formatted scope section, it is not explicitly verified as such in the validation. The validator should assert the header verbatim.

2. **Overreach: "The Java mapper will be organized following the CDM model hierarchy"**: This phrasing suggests the planner is dictating high-level architecture decisions rather than describing the mapping logic required. The product scope doesn’t require a specific packaging convention; only correctness and runtime absence of LLM calls matter.

3. **Runtime/agent-runtime confusion**: The plan states "Generated artifacts must not require LLM calls at runtime" (correct) but conflates runtime artifact requirements with planning-time behavior. The critic should not restate the runtime constraint as if it required special attention — it’s a hard requirement.

4. **Weak test claims**: "A comprehensive test strategy will be implemented: Unit tests covering the 7 single-leg fixture examples, Validation logic ensuring accurate mapping of all FX fields" is vague. It doesn’t specify how correctness will be measured (e.g., structural diff vs JSON schema vs Rosetta-expected model validation), and doesn’t address non-functional validation (e.g., idempotency, determinism, exception handling). The evidence packet does not define tests; it only defines inputs/outputs.

5. **Evidence/runtime support confusion**: "All transformation rules must be presented in evidence-packet.md for validation" implies the plan must itself include evidence, but the evidence is provided as a separate artifact and should not be duplicated.

### Non-blocking concerns

- The plan correctly identifies that `fx-single-leg` is the default implementation group and includes no Implementation Group Change Proposal, which matches the product scope.

- The list of runtime supported fixtures matches exactly the `classifiedFixtures` where `"productGroup": "fx-single-leg"` in `00-product-scope.json`.

- The out-of-scope groups are correctly listed and the "Observed Unsupported FX Products" section appropriately separates them as future phases.

- The Rosetta blocks reference is appropriate as mapping evidence (not runtime dependency), and the note that “Rosetta blocks serve as mapping evidence, not runtime dependencies” is correct.

### Decision

NEXT_ROUND_REQUIRED — the plan lacks precise, machine-verifiable test criteria, and contains narrative overreach about package design. The plan must include a section `## Implementation scope (machine-checked)` with verbatim `**In scope (implementation groups):**` bullets and explicit fixture lists that match the product scope, but it currently conflates narrative description with machine-checkable assertions. Also, the validation gates should be expressed in terms of measurable differences (e.g., JSON diff thresholds, required CDM path coverage) rather than subjective outcomes like “precisely match” or “accurately transformed”.

Decision: NEXT_ROUND_REQUIRED