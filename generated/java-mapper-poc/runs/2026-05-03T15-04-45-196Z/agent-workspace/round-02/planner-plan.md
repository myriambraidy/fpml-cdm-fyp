# FX Derivatives Java Mapper Plan - Round 2

## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
**Explicitly out of scope (implementation groups):**
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Product Summary
The current implementation focuses on the **fx-single-leg** group, which contains 7 fixtures covering basic FX spot and forward products (FX spot, FX forward, FX forward with settlement, FX forward with SSI, FX forward with splits, and Non-Deliverable Forward). This group represents the foundational FX derivatives products for this generation phase.

## Runtime Supported Fixtures
The following FX fixtures are **runtime supported** in this run, meaning they are expected to pass runtime gates once implemented:
- fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml

## Observed Unsupported FX Products
The following FX products were observed in the evidence but are **not part of the current implementation scope**:
- FX Swap (1 fixture)
- FX Simple Option (3 fixtures)
- FX Digital Option (6 fixtures)
- FX Barrier Option (2 fixtures)
- FX Average Rate Option (2 fixtures)
- FX Strategy (2 fixtures)

These products are classified as "later" or "candidate" and will be implemented in future phases.

## Implementation Group Change Proposal
No change proposed. The default current implementation group `fx-single-leg` is appropriate as the starting point for staged generation, aligning with the `good-first-target` classification and the fact that it includes the most representative examples.

## Java Package/Class Design
The Java mapper will be organized following the CDM model hierarchy:
- `com.fpml.fx.mapper` - Main mapper package
- `com.fpml.fx.mapper.FxSingleLegMapper` - Mapper for single-leg FX products

## Mapping Responsibilities
Primary responsibility for mapping FX single-leg products:
1. Handle `fxSingleLeg` root element
2. Map all exchange currency details
3. Convert FpML date formats to CDM dates
4. Normalize trade identifiers to CDM assigned identifiers
5. Map party references to CDM party roles (Party1/Party2)
6. Map payment amounts to CDM quantities

## Tests
A comprehensive test strategy will be implemented:
- Unit tests covering the 7 single-leg fixture examples
- Validation logic ensuring accurate mapping of all FX fields

## Validation Gates
The generated mapper must meet these validation criteria:
1. All 7 single-leg examples must map without data loss or errors
2. CDM output should precisely match expected JSON structures from parallel CDM exports
3. All party references, dates, and amounts should be accurately transformed
4. Must conform to established CDM standards and Rosetta patterns
5. Generated artifacts must not require LLM calls at runtime

## Unsupported Behavior
The following behaviors are explicitly outside of scope for the current implementation and will be deferred:
- FX option products (simple, barrier, digital, average rate)
- FX swap products
- FX strategy products
- Non-FX products (term deposits, etc.)

## Traceability Requirements
Complete traceability between FpML input and CDM output will be enforced:
- All mapping steps will be traceable to specific FpML elements
- CDM path references must correlate exactly to Rosetta function usage
- The mapping will use the same reference resolution logic as demonstrated in Rosetta blocks
- Traceability kept in the generated Java code through comments and method names
- All transformation rules must be presented in evidence-packet.md for validation

Rosetta blocks serve as mapping evidence, not runtime dependencies. The generated Java code will implement the mappings without external Rosetta runtime libraries.