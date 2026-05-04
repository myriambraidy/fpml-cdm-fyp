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

## Supported FX products
Based on the product scope and evidence packet, the following FX products are supported in this run:

1. **FX single-leg** (`fx-single-leg`)
   - FX spot
   - FX forward
   - FX forward with settlement information
   - FX forward with standard settlement instruction
   - FX forward with split settlement
   - Non-deliverable forward

## Observed unsupported FX products
The following FX product types are present in the evidence but not included in this run's implementation scope:
- FX swap (`fx-swap`)
- FX simple option (`fx-simple-option`)
- FX digital option (`fx-digital-option`)
- FX barrier option (`fx-barrier-option`)
- FX average rate option (`fx-average-rate-option`)
- FX strategy (`fx-strategy`)

## Java package/class design

### Core Package Structure
```
com.fpml.cdm.fx
├── mapper
│   ├── FpmlToCdmMapper.java
│   └── FxMapperFactory.java
├── model
│   ├── FxTrade.java
│   ├── FxSingleLeg.java
│   ├── FxSwap.java
│   ├── FxOption.java
│   └── ...
├── exception
│   └── FxMappingException.java
└── util
    ├── CurrencyUtils.java
    ├── DateUtils.java
    └── PartyMapper.java
```

### Key Classes
1. **FpmlToCdmMapper** - Main entry point for mapping FX products, delegates to product-specific mappers
2. **FxMapperFactory** - Creates appropriate mappers for different FX product types
3. **FxTrade** - CDM model class representing FX trade
4. **FxSingleLeg** - CDM model class for single leg FX products
5. **PartyMapper** - Maps FpML party references to CDM party objects

## Mapping responsibilities
- Map FX single-leg products (spot, forward, NDF)
- Map basic trade identifiers, dates, and party references
- Convert payment amounts to CDM quantities with currency units
- Map exchange rates and associated FX details
- Convert trade dates from FpML's ISO date with 'Z' to CDM date without 'Z'
- Map FX product taxonomy

## Tests
- Unit tests for each FX product type mapping
- Integration tests covering the complete mapping pipeline
- Tests for edge cases like split settlements and NDFs
- Tests verifying date normalization and party reference resolution

## Validation gates
- Semantic validation of mapping results against expected CDM structure
- Trade identifier preservation
- Proper party reference resolution
- Correct date format compliance
- Amount and currency unit mapping accuracy

## Unsupported behavior
- FX swap products (`fx-swap`)
- FX simple options (`fx-simple-option`)
- FX digital options (`fx-digital-option`)
- FX barrier options (`fx-barrier-option`)
- FX average rate options (`fx-average-rate-option`)
- FX strategies (`fx-strategy`)
- Non-FX products

## Traceability requirements
- All mapping decisions must be traceable to evidence in 00-product-scope.json and evidence-packet.md
- Maintained mapping traceability for each supported FX single-leg product
- Configurable mapping behavior through cookbook reference rules when available
- Clear separation of concerns between FpML parsing and CDM mapping logic