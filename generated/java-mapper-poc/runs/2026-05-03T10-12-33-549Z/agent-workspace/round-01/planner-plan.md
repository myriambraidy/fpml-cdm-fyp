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

## FX derivatives implementation plan

This plan is for the initial staged generation of FX derivatives mapper targeting the `fx-single-leg` implementation group as the default starting point. The scope is limited to FX single-leg products (spot, forward) and excludes all non-FX products as well as other FX product types (swap, options, barrier, etc.) in this phase.

### Supported FX products for this run

**In scope:**
- `fx-single-leg`: 7 fixtures covering spot and forward FX transactions, including cross-rate and NDF scenarios.

**All referenced files in scope:**
```text
data_to_learn_from/fpml/fx-derivatives/fx-ex01-fx-spot.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex02-spot-cross-w-side-rates.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex03-fx-fwd.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex04-fx-fwd-w-settlement.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex05-fx-fwd-w-ssi.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex06-fx-fwd-w-splits.xml
data_to_learn_from/fpml/fx-derivatives/fx-ex07-non-deliverable-forward.xml
```

**Observed unsupported FX products**
Other product types, such as `fx-swap`, `fx-simple-option`, etc., are not planned for this phase.

### Java package/class design

A `fx.singleleg` package is selected as the core Java package for generated classes targeting the `fx-single-leg` group. Classes implementing mapping logic are expected to follow these conventions:
- `FxSingleLegMapper`: Main mapper class handling both parser and consumer aspects.
- `FxSingleLegParser`: XML parser implementation for FpML.
- `FxSingleLegConsumer`: Abstract CDM transform implementation.
- `FxSingleLegMapperImpl`: Concrete parser-consumer adapter.
- Secondary classes can be created for value objects and support structures (e.g., `FxSingleLegTrade`, `FxSingleLegPayment`).

### Mapping responsibilities

- Parsing of FpML `fxSingleLeg` sections into intermediate objects.
- Conversion of payment amounts (currency and value) into CDM primitives.
- Map FX rate (exchange rate), spot rate, and forward points into CDM quantities.
- Date handling (values with or without trailing 'Z').
- Party identification and mapping between FpML href references and CDM party roles (Party1/Party2).
- Settlement instructions (SWIFT, etc., depending on fixture examples).

### Tests

Generated Java classes are expected to be unit tested using JUnit.
- Test each identified `fx-single-leg` fixture.
- All test cases are expected to pass within the scope of this phase.
- Testing should cover both mapping correctness and runtime behavior.

### Validation gates

Published rules from `data/agent-cookbook/latest/product-families/fx-derivatives.md` represent the recipe for transformation:
- `RULE-001` - Trade identifier -> `assignedIdentifier.value`.
- `RULE-002` - Trade date normalization (remove trailing 'Z').
- `RULE-005` - Payment amounts -> CDM quantities.
- `TR-001` - Resolve party hrefs -> CDM party references.
- `TR-002` - Date normalization (trim trailing 'Z').
- `TR-003` - Expiry date/time/businessCenter -> exerciseTerms.expiration (optional; not needed for fx-single-leg).

### Unsupported behavior

This phase does not produce any code for the following:
- FX products other than `fx-single-leg`.
- Any FX derivative offering that is not a basic single leg (e.g., swaps, options).
- Complex FX features requiring future rule expansion (e.g., fixing dates, averaging terms, digital features).
- Functionalality that depends on missing schemas (e.g., `cdm.base`) or complex financial modeling libraries beyond the requirements of basic FX payment and party mapping.

### Traceability requirements

Traceability to source and target is critical:
- Source FpML fixtures must be fully parsed and validated.
- All CDM mapping paths are validated against the evidence packet.
- Key transformation rules are linked from `fx-derivatives.md` and its supporting evidence.
- Use of Rosetta `fxsingleleg-func.rosetta` blocks as reference for core mapping functions:
  - `MapFxSingleLegCounterpartyList`
  - `MapFxSingleLegAncillaryPartyList`
  - `MapFxSingleLegNonTransferableProduct`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
  - `MapFxSingleLegAccountPartyReference`