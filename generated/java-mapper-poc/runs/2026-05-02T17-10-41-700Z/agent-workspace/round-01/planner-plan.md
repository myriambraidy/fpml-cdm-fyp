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

## Product Coverage
This plan focuses on the **fx-single-leg** implementation group, which contains 7 fixtures:
- fx-ex01-fx-spot.xml
- fx-ex02-spot-cross-w-side-rates.xml
- fx-ex03-fx-fwd.xml
- fx-ex04-fx-fwd-w-settlement.xml
- fx-ex05-fx-fwd-w-ssi.xml
- fx-ex06-fx-fwd-w-splits.xml
- fx-ex07-non-deliverable-forward.xml

## Fixtures covered in this phase:
- data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex02-spot-cross-w-side-rates.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex03-fx-fwd.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex04-fx-fwd-w-settlement.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex05-fx-fwd-w-ssi.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex06-fx-fwd-w-splits.xml
- data_to_learn_from\fpml\fx-derivatives\fx-ex07-non-deliverable-forward.xml

## Implementation Group Change Proposal
No change to currentImplementationGroup needed. The default implementation group `fx-single-leg` is appropriate for the initial staged generation, as it represents a core, good-first-target product type with 7 well-defined fixtures that cover basic FX spot and forward structures.

## Java Package and Class Design
Based on Rosetta patterns and evidence from the cookbook, the implementation will be organized as follows:

### Java Package Structure
```
com.fpml.cdm.fx
├── FpmlToFxMapper.java (main mapper entry point)
├── model
│   ├── FxSingleLegTrade.java
│   ├── FxParty.java
│   ├── FxTradeIdentifier.java
│   └── FxTradeDate.java
└── mapper
    ├── FxSingleLegMapper.java
    ├── PartyMapper.java
    ├── TradeIdentifierMapper.java
    └── TradeDateMapper.java
```

### Key Classes for fx-single-leg:
1. **FxSingleLegMapper** - Maps `trade/fxSingleLeg` elements to CDM structures
2. **PartyMapper** - Handles party resolution and role assignment (Party1/Party2)
3. **TradeIdentifierMapper** - Maps trade identifiers with schemes
4. **TradeDateMapper** - Handles date normalization (trimming trailing 'Z')

## Mapping Responsibilities
### Core Economic Terms Mapping
- **Payment amounts** → `trade.tradeLot.quantity.value` and `trade.tradeLot.quantity.unit.currency.value`
  - Rule: `fx-derivatives:RULE-005` (Payment amounts -> CDM quantities)
- **Exchange rates** → `trade.tradeLot.priceQuantity.price` 
  - From `exchangeRate/rate` and `exchangeRate/quotedCurrencyPair`
  - Rosetta: `MapFxRate`, `MapQuotedCurrencyPair` 

### Trade Metadata Mapping
- **Trade date** → `trade.tradeDate.value`
  - Rule: `fx-derivatives:RULE-002` (Trade date normalization)
  - Rosetta: `MapDateToAdjustableOrRelativeDate`
- **Trade identifiers** → `trade.tradeIdentifier.assignedIdentifier`
  - Rule: `fx-derivatives:RULE-001` (Trade identifier mapping)
  - Rosetta: `MapProductIdentifierList`, `MapProductIdentifier`

### Party Resolution
- **Party references** → `trade.counterparty` 
  - Rule: `fx-derivatives:TR-001` (Resolve party hrefs)
  - Rosetta: `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAccountPartyReference`

## Validation Gates
1. **Parse validation**
   - FpML fixtures parse successfully with required elements
2. **Mapping consistency check**
   - All 7 fx-single-leg fixtures map to expected CDM structures  
3. **Semantic correctness**
   - Trade date normalization (removing 'Z')
   - Quantity/currency mappings for both exchanged currencies
   - Party reference resolution
4. **Round-trip verification**
   - Confirm key values (amounts, rates, dates) are preserved through mapping
   - Verify party roles are correctly assigned as Party1/Party2

## Tests
Unit tests will be generated for:
- Basic single-leg spot trade (fx-ex01-fx-spot.xml)
- Spot with cross rates (fx-ex02-spot-cross-w-side-rates.xml)  
- Forward trade (fx-ex03-fx-fwd.xml)
- Forward with settlement info (fx-ex04-fx-fwd-w-settlement.xml)
- Forward with standard settlement instructions (fx-ex05-fx-fwd-w-ssi.xml)
- Forward with split settlement (fx-ex06-fx-fwd-w-splits.xml)
- Non-deliverable forward (fx-ex07-non-deliverable-forward.xml)

## Unsupported Behavior
This phase excludes:
- FX swaps (fx-swap)
- FX options (fx-simple-option, fx-digital-option, etc.)
- Strategy products (fx-strategy)
- Non-FX products (non-fx)

## Traceability Requirements
Each generated Java class will be traced back to:
- Source FpML structure patterns observed in fixture examples
- Rosetta mapping functions used for implementation
- Cookbook rules that define expected conversion behavior
- CDM output schema structures validated against examples