## Review

### Blocking Issues

- **In-scope group mismatch**: The plan’s “In scope (implementation groups):” bullet includes only `fx-single-leg`, which matches `00-product-scope.json.currentImplementationGroup`. ✅  
- However, **the runtime-supported list is not derived from `productGroups[].fixtureCount`**. It lists six FX products, but the `fx-single-leg` group only includes seven fixtures of *single-leg* FX products (fxSingleLeg). The plan conflates “FX single-leg” with six specific runtime products. This overstates what is in scope for `fx-single-leg` and is unsupported by the product-scope JSON.

  - `fx-ex01-fx-spot.xml` → `FX Spot`
  - `fx-ex02-spot-cross-w-side-rates.xml` → `FX Spot`
  - `fx-ex03-fx-fwd.xml` → `FX Forward`
  - `fx-ex04-fx-fwd-w-settlement.xml` → `FX Forward with Settlement`
  - `fx-ex05-fx-fwd-w-ssi.xml` → `FX Forward with SSI`
  - `fx-ex06-fx-fwd-w-splits.xml` → `FX Forward with Splits`
  - `fx-ex07-non-deliverable-forward.xml` → `Non-Deliverable Forward`

  These are seven **fixtures**, not six distinct runtime product types. The plan incorrectly splits `fx-ex06` and `fx-ex04`/`fx-ex05` into separate “runtime supported” items, creating a mismatch. The validation logic should check fixture coverage, not product type names. This is a **mischaracterization of in-scope coverage**, not a tooling or runtime limitation.

- **“Tests” section is unsupported by evidence**: The plan promises “Gatling performance tests for throughput verification” and “Integration tests for dependent component compatibility,” but no performance or integration test requirements exist in `00-input-brief` or `00-product-scope`. The brief explicitly asks for a **Java Maven mapper project** with **runtime gates** that **must not call an LLM**. Performance benchmarks and integration test libraries are outside the current scope.

- **“Java Package/Class Design” overreaches scope**: It lists `FxSwapMapper`, `FxOptionMapper`, and `FxDigitalOptionMapper` with “(future)” notes, but the brief and product scope mandate a *current* run for `fx-single-leg` only. Including future classes in the design section is speculative narrative noise, not machine-checked scope.

### Non-Blocking Concerns

- **Traceability Requirements section is redundant**: Most details (e.g., “traceability kept in the generated Java code through comments and method names”) are implementation heuristics, not verifiable product-scope requirements. Not critical.

- **“Runtime Supported FX Products” list is not aligned with `productGroups[].fixtureCount`**: It is acceptable to highlight expected fixture support, but the phrasing implies a product-type count (six) not supported by the single-group count (seven fixtures). This could mislead gate design. Suggestion: map fixtures directly in test strategy instead of product type aliases.

### Evidence/Runtime Support Confusion

- The plan mentions “Rosetta patterns” and “Rosetta function usage” in traceability requirements. While `evidence-packet.md` includes Rosetta blocks, the brief explicitly requires **a runtime Java mapper that must not call an LLM**. Rosetta blocks are *evidence sources*, not runtime dependencies. The plan must not conflate Rosetta source blocks with runtime library requirements.

### Decision

The plan correctly identifies `fx-single-leg` as the in-scope group but incorrectly expands the scope by listing six “runtime supported” FX products not directly derived from `productGroups[].fixtureCount`. The “Tests” section introduces Gatling and integration test support unsupported by the brief. These are **blocking mismatches** between the plan and the `00-product-scope.json`/`00-input-brief` constraints.

Decision: NEXT_ROUND_REQUIRED