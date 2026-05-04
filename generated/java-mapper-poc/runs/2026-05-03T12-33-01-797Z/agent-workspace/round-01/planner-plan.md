# FX Derivatives Java Mapper Plan

## Implementation scope (machine-checked)
**Product family:** fx-derivatives
**In scope (implementation groups):**
- fx-single-leg
- fx-swap
- fx-simple-option
**Explicitly out of scope (implementation groups):**
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Product Coverage

### Supported FX Products (Runtime supported)
- **fx-single-leg**: 7 fixtures (FX spot, forward, NDF)
  - `fx-ex01-fx-spot.xml` → `fx-ex01-fx-spot.json`
  - `fx-ex02-spot-cross-w-side-rates.xml` → `fx-ex02-spot-cross-w-side-rates.json`
  - `fx-ex03-fx-fwd.xml` → `fx-ex03-fx-fwd.json`
  - `fx-ex04-fx-fwd-w-settlement.xml` → `fx-ex04-fx-fwd-w-settlement.json`
  - `fx-ex05-fx-fwd-w-ssi.xml` → `fx-ex05-fx-fwd-w-ssi.json`
  - `fx-ex06-fx-fwd-w-splits.xml` → `fx-ex06-fx-fwd-w-splits.json`
  - `fx-ex07-non-deliverable-forward.xml` → `fx-ex07-non-deliverable-forward.json`

- **fx-swap**: 1 fixture (FX swap)
  - `fx-ex08-fx-swap.xml` → `fx-ex08-fx-swap.json`

- **fx-simple-option**: 3 fixtures (European, American, NDO options)
  - `fx-ex09-euro-opt.xml` → `fx-ex09-euro-opt.json`
  - `fx-ex10-amer-opt.xml` → `fx-ex10-amer-opt.json`
  - `fx-ex11-non-deliverable-option.xml` → `fx-ex11-non-deliverable-option.json`

### Observations / Unsupported FX Products (Observed, not runtime supported)
The following products are present in the fixture data but will not be implemented in this phase:
- **fx-digital-option**: 6 fixtures with digital option variants (euro, range, one-touch, etc.)
- **fx-barrier-option**: 2 fixtures
- **fx-average-rate-option**: 2 fixtures
- **fx-strategy**: 2 fixtures

> Note: These are identified in the evidence as having `later` or `exclude` implementation hints. They are in scope for future phases but not this run.

### Non-FX Products (Excluded)
- **non-fx**: 2 fixtures (term deposits)
- These are explicitly classified as `non-fx` and are excluded.

## Java Package Design

The generated Maven project will have a structured package hierarchy:

```
com.example.cdm.mapper
├── fx
│   ├── singleleg
│   │   ├── FxSingleLegMapper.java
│   │   ├── FxSingleLegMapperFactory.java
│   │   └── FxSingleLegMappingException.java
│   ├── swap
│   │   ├── FxSwapMapper.java
│   │   ├── FxSwapMapperFactory.java
│   │   └── FxSwapMappingException.java
│   └── simpleoption
│       ├── FxSimpleOptionMapper.java
│       ├── FxSimpleOptionMapperFactory.java
│       └── FxSimpleOptionMappingException.java
├── common
│   ├── FpmlHeaderMapper.java
│   ├── FpmlPartyMapper.java
│   ├── FpmlTradeDateMapper.java
│   └── FpmlTradeIdentifierMapper.java
└── FpmlToCdmMapper.java (entry point)
```

## Mapping Responsibilities

### Core Mappers (One per product group)
Each product group will have a dedicated mapper:
1. **FxSingleLegMapper** - Maps `fxSingleLeg` elements to CDM `SettlementPayout`
2. **FxSwapMapper** - Maps `fxSwap` elements containing `fxSingleLeg` to CDM `SettlementPayout` for both legs
3. **FxSimpleOptionMapper** - Maps `fxSimpleOption` elements to CDM `OptionPayout`

### Utility Mappers (Shared)
1. **FpmlHeaderMapper** - Maps `header` section and common fields (conversationId, messageId, sentBy, sendTo)
2. **FpmlPartyMapper** - Resolves party references, maps `partyId` to LEI, and assigns roles (Party1/Party2)
3. **FpmlTradeDateMapper** - Normalizes `tradeDate` values (removes 'Z' suffix)
4. **FpmlTradeIdentifierMapper** - Maps `partyTradeIdentifier` to `assignedIdentifier`

### Entry Point
- **FpmlToCdmMapper** - Combines all mappers to orchestrate full conversion from FpML to CDM

## Validation and Testing

### Validation Gates
1. Unit Tests for each mapper (assertion-based on fixture data):
   - Ensure input FpML element parses correctly
   - Map to expected CDM structure
   - Validate values (dates, amounts, identifiers)

2. Integration Tests:
   - Full conversion of all supported fixtures
   - Cross-check against known CDM example outputs
   - Validation against Rosetta and cookbook rules

### Test Coverage
1. **Fixture-driven tests**: Each fixture will have:
   - Input: `fpml/fx-derivatives/<filename>.xml`
   - Output: `cdm_parallel/fx-derivatives/<filename>.json`
2. **Mapper unit tests**: Each product group will have specific unit tests to cover:
   - Basic mapping scenarios
   - Edge cases (e.g., side rates, settlements, splits)
   - Mapping validation against cookbook rules

## Unsupported Behavior

1. **Unimplemented Products**: `fx-digital-option`, `fx-barrier-option`, `fx-average-rate-option`, `fx-strategy` will not be mapped in this phase
2. **Non-FX Products**: `termDeposit` is excluded
3. **Partial Mappings**:
   - Settlement instructions will be mapped to basic fields (payment amounts, parties, dates)
   - Complex settlement rules (like splitSettlement) may not be fully implemented in this phase
   - Currency conversion and rate derivation logic (aside from spot rate) is not yet covered
4. **Limited party resolution**: Party role assignments (Party1/Party2) are simplified and may not handle all reference inversion cases present in examples

## Traceability Requirements

1. **Mapping Rules**:
   - All mappings must reference stable rules from `data/agent-cookbook/latest/product-families/fx-derivatives.md`
   - Transformations and patterns used must be traceable to evidence in the cookbook JSON

2. **Generated Code Traceability**:
   - Each generated class and method should have a comment referencing the relevant cookbook rule or Rosetta function
   - Method-level documentation should reference the specific elements or functions used

3. **Runtime Validation**:
   - Code should validate that all mandatory fields are populated
   - Mappers should fail gracefully on malformed FpML with meaningful error messages pointing to validation issues

## Implementation Group Change Proposal

No change to the default implementation group is proposed. The current implementation group `fx-single-leg` with its 7 supported fixtures is a strong, focused starting point. The next logical step (after single-leg) is `fx-swap` as it is a direct extension with similar structure, and `fx-simple-option` as it is a more complex but linear variant.

All features described above are consistent with the current implementation group structure and the product scope.