## Review

### Blocking Issues

- **Runtime LLM dependency concern** (critical): The plan states:  
  > *“**No LLM dependency**: Generated code must contain zero external dependencies on AI models or runtime LLMs”*  
  and includes it in the **Validation gates**.  
  However, the plan **does not explicitly forbid** runtime LLM usage in the *generated code’s runtime behavior*. While the *planning* is LLM-agnostic, the validator’s “Plan appears to allow a runtime LLM dependency” warning indicates risk in **how the plan is interpreted** (e.g., a future mapper implementation that uses a runtime LLM for fallback, dynamic routing, or generic guidance is not explicitly excluded beyond a negated clause).

  **Requirement context (run_config + preflight)**:
  - `cdm-rosetta-preflight.md` mandates:  
    > *“Strategy: maven-compile-gated-jackson-serialization; no ObjectNode/ArrayNode permitted”*  
    and  
    > *“Use the CDM model object as the internal representation and serialize it at the runtime boundary.”*

  - `00-product-scope.json` and `rosetta-generation-context.md` enforce **pure functional mapping**, not decision-making LLMs.

  **Conclusion**: The plan *intends* to be LLM-free, but the wording is insufficiently absolute to satisfy “no runtime LLM dependency” as a *hard constraint* in the implementation. This is a **blocking issue**.

- **Missing runtime fixture IDs in “Runtime supported fixtures (machine-checked)”** (non-blocking): The section lists fixture names (`fx-ex01-fx-spot`, …), but the `run_config`’s `runtimeFixtures` map uses keys like `fx-ex01-fx-spot: fx-ex01-fx-spot.xml`. The plan’s listing style is acceptable *if* it maps 1:1 to the JSON map keys, but the validator’s “none” entry for “Runtime Fixtures” in `evidence-index.md` suggests ambiguity. Since the machine-checked section *does* list the same 7 IDs, this is **not blocking**.

### Non-blocking Concerns

- **Overreach in “Supported FX products for this run”**: The text states:
  > *“FX spot, FX forward, Non-deliverable forward (NDF)”*  
  However, `fx-ex02` and `fx-ex06` include *cross-currency swaps* or *split payments*, which may be better described as *FX single-leg variants* rather than core spot/forward/NDF. This is **narrative**, not a technical flaw—the actual mapping functions cover them via `MapFxCoreDetailsModelToSettlementPayout`, and the product-group mapping is correct. This is a **non-blocking concern**.

- **Missing explicit exclusion of non-FX fixtures in test scope**: The plan explicitly excludes `termDeposit` in *“Unsupported behavior”*, but the test list does not mention validation failure for non-FX input. This is **acceptable**, since exclusion is clear and tests focus on in-scope fixtures.

- **Evidence for helper functions not fully cited**: The plan lists 11 shared helpers but does not explicitly link all of them to their source Rosetta function IDs (e.g., `MapCounterpartyRoleEnum`, `CreateQuantityKey`, etc.). However, these are all present in `rosetta-generation-context.md`’s “Unresolved Helper Functions” section and are covered indirectly via the primary functions. This is **acceptable** under strict scope.

### Decision

**The only blocking issue is insufficiently absolute wording on “no runtime LLM dependency”** — the plan *intends* to forbid it but does not *forbid it unconditionally*, leaving room for misinterpretation or non-conforming implementations.

**Fix**: Add a bullet under **Validation gates** or **Unsupported behavior** stating:  
> *“Runtime execution of the generated Java mapper must not invoke or depend on any external AI/LLM service or model; all logic must be statically compiled and deterministic per Rosetta semantics.”*

This makes the constraint *machine-checkable* and closes the validator’s gap.

Until that fix is made, the plan must be treated as non-compliant.

Decision: NEXT_ROUND_REQUIRED