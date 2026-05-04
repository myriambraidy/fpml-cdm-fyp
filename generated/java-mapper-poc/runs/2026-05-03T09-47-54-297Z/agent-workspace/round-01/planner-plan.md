# FX Derivatives Java Mapper Plan

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

## Supported FX products for this run
The current implementation targets the `fx-single-leg` product group, which includes 7 fixtures:
1. fx-ex01-fx-spot.xml
2. fx-ex02-spot-cross-w-side-rates.xml
3. fx-ex03-fx-fwd.xml
4. fx-ex04-fx-fwd-w-settlement.xml
5. fx-ex05-fx-fwd-w-ssi.xml
6. fx-ex06-fx-fwd-w-splits.xml
7. fx-ex07-non-deliverable-forward.xml

## Observed unsupported FX products
The following FX product groups are identified but not implemented in this phase:
- fx-swap (1 fixture)
- fx-simple-option (3 fixtures)
- fx-digital-option (6 fixtures)
- fx-barrier-option (2 fixtures)
- fx-average-rate-option (2 fixtures)
- fx-strategy (2 fixtures)

## Java package/class design
```
com.example.fxmapper
├── FpmlFxMapper.java                    (Main mapper entry point)
├── model                                (CDM model classes)
│   ├── Trade.java
│   ├── Product.java
│   ├── Counterparty.java
│   ├── TradeIdentifier.java
│   ├── TradeDate.java
│   ├── SettlementTerms.java
│   ├── Payout.java
│   └── PriceQuantity.java
├── fxsingleleg                          (fx-single-leg specific logic)
│   ├── FxSingleLegMapper.java           (Core mapping logic)
│   ├── FxSingleLegParser.java           (XML parsing)
│   ├── FxSingleLegValidator.java        (Validation)
│   └── FxSingleLegTransformer.java      (Transformations)
├── util                                 (Utility classes)
│   ├── DateUtils.java
│   ├── CurrencyUtils.java
│   └── PartyUtils.java
└── exception                            (Custom exceptions)
    └── FxMappingException.java
```

## Mapping responsibilities
### Primary mapping responsibilities
- Map `tradeHeader` elements to `Trade` and `TradeDate` objects
- Map `partyTradeIdentifier` elements to `TradeIdentifier` objects
- Map `fxSingleLeg` elements to `Product` with `Payout` and `PriceQuantity` objects
- Map payment amounts and currency to `PriceQuantity` structures
- Resolve party references and assign party roles
- Apply standard transformations like date normalization

### Secondary mapping responsibilities
- Handle settlement information (settlement type, method, details)
- Process side rates for spot cross rates
- Map value dates to settlement dates
- Map forward points and spot rates

## Tests
### Unit tests
- `FxSingleLegMapperTest` - Tests core mapping functionality for single-leg FX products
- `FxSingleLegParserTest` - Tests XML parsing logic
- `FxSingleLegValidatorTest` - Tests validation rules (e.g., required fields)
- `DateUtilsTest` - Tests date normalization and conversion

### Integration tests
- `FpmlFxMapperIntegrationTest` - Tests complete pipeline from FpML XML to CDM JSON
- `FxSingleLegEndToEndTest` - Tests full round-trip conversion for each supported fixture

## Validation gates
### Structure validation
- Verify FpML contains required elements (tradeHeader, fxSingleLeg)
- Validate party references exist in party section
- Ensure required attributes like currency, amount, date are present

### Content validation
- Validate that all 7 fx-single-leg fixtures map without errors
- Ensure mapping produces valid CDM JSON format
- Verify that party assignments match expected Party1/Party2 roles

### Quality validation
- Maintain 100% semantic success rate as observed in evidence
- Ensure data normalization (e.g., trailing Z in dates) is applied correctly
- Validate that currency codes and amounts match between FpML and CDM

## Unsupported behavior
The current implementation only supports `fx-single-leg` products and excludes:
- Single-leg features like side rates in non-spot products
- Any products from the unsupported groups (fx-swap, fx-simple-option, etc.)

## Traceability requirements
- All mapping logic must directly reference evidence from the `fx-derivatives` cookbook
- Each CDM field mapping must be traceable to a stable rule in `data/agent-cookbook/latest/product-families/fx-derivatives.md`
- All transformation logic must reference `TR-001` through `TR-003` transformations from the cookbook
- Generated identifiers, global keys and party mappings must be traceable to FpML source structures
- Mapping of `tradeId` to `assignedIdentifier.value` must preserve the exact value and scheme
- `expiryDateTime` mapping must convert into `exerciseTerms.expiration` components and time fields
- Trade date normalization must consistently remove trailing 'Z' from dates
- Payment amounts must map to CDM quantities with proper currency units
- Party reference resolution must follow cookbook transformation rules for Party1/Party2 roles

## Implementation Group Change Proposal
No change proposed. The current default `fx-single-leg` implementation group is appropriate for the staged-by-product-group strategy and represents a good first target with 7 supporting fixtures.
The next logical group (fx-swap or fx-simple-option) should be implemented in a future phase after verifying stability of this base implementation.