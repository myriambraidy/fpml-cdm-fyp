# Accepted Plan

Accepted in round 1.

This file is the implementation contract. It is synthesized from the product
scope, planner plan, critic review, critique resolution, and deterministic plan
validation. The full evidence packet path is referenced below for on-demand reads
via tools (for example get_context_packet); it is not inlined here to keep this
artifact small.

## Machine-Checked Implementation Contract

This section is authoritative when it conflicts with planner narrative.
The planner, critic, and reviewer sections are historical rationale. They cannot
authorize CDM Java classes, builder methods, generated packages, runtime
fixtures, or file ownership that conflict with this section or deterministic
validation.

### Java Shell Contract

- Generated package: com.fpml.cdm.fx.mapper.generated
- Main generated class: GeneratedFpmlToCdmMapper
- Required interface: com.fpml.cdm.fx.mapper.FpmlToCdmMapper
- Generated source root: src/main/java/com/fpml/cdm/fx/mapper/generated
- Shell-owned files must not be rewritten:
  - pom.xml
  - src/main/java/com/fpml/cdm/fx/mapper/Main.java
  - src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
  - src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

### Rosetta Evidence Contract

Rosetta source is mapping-intent authority only. CDM Java class and builder
authority comes from the approved CDM API contract and semantic recipes.

- product-root: MapFxSingleLegNonTransferableProduct, MapProductIdentifierList, MapProductTaxonomyList
- economic-terms: MapFxSingleLegEconomicTerms
- settlement-payout: MapFxCoreDetailsModelToSettlementPayout
- price-quantity: MapFxSingleLegPriceQuantityList, MapFxCoreDetailsModelPriceListWithLocation, MapFxCoreDetailsModelQuantityListWithLocation
- party-counterparty: MapFxSingleLegCounterpartyList, MapFxSingleLegAncillaryPartyList
- account-party-reference: MapFxSingleLegAccountPartyReference, MapPayerReceiverToAccountPartyReference
- product-identifiers-taxonomy: MapProductIdentifierList, MapProductIdentifier, MapProductTaxonomyList
- dates-settlement: MapFxCoreDetailsModelToSettlementPayout, MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

### Runtime Contract

Runtime-supported fixtures are the fixture ids listed in the deterministic
validation section below. Observed fixtures outside that list are not runtime
supported by this accepted plan.

### Approved Java API Guardrails

- Java implementation authority comes from approved-cdm-api-contract-summary.md and semantic-recipes.md only.
- Use TradeState.builder().setTrade(trade).build() for the final root output.
- Do not use ProductIdentifier or ProductTaxonomy as Java implementation classes unless a future approved API contract explicitly adds them.
- Do not use AdjustableOrAdjustedDateOrRelativeDate or AdjustableOrRelativeDateOrExpression as Java implementation classes unless a future approved API contract explicitly adds them.
- Rosetta functions named MapProductIdentifierList, MapProductIdentifier, or MapProductTaxonomyList remain mapping-intent evidence only.

## Product Scope Contract

# Product Scope

Selected product family: fx-derivatives
Implementation strategy: staged-by-product-group
Default current implementation group: fx-single-leg
Candidate next groups: fx-swap, fx-simple-option

## Product Groups

- fx-single-leg: 7 fixture(s), good-first-target. Default starting group for staged FX-family generation.
- fx-swap: 1 fixture(s), candidate. Natural next FX group after single-leg handling.
- fx-simple-option: 3 fixture(s), candidate. Candidate after simpler linear FX products are stable.
- fx-digital-option: 6 fixture(s), later. Requires richer option handling and should follow simpler options.
- fx-barrier-option: 2 fixture(s), later. More complex option variant; later milestone.
- fx-average-rate-option: 2 fixture(s), later. More complex option variant; later milestone.
- fx-strategy: 2 fixture(s), later. Strategy wrappers need separate decomposition logic.
- non-fx: 2 fixture(s), exclude. Excluded from FX derivatives generation.

## Classified Fixtures

- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex01-fx-spot.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex02-spot-cross-w-side-rates.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex02-spot-cross-w-side-rates.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex03-fx-fwd.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex03-fx-fwd.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex04-fx-fwd-w-settlement.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex04-fx-fwd-w-settlement.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex05-fx-fwd-w-ssi.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex05-fx-fwd-w-ssi.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex06-fx-fwd-w-splits.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex06-fx-fwd-w-splits.json
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex07-non-deliverable-forward.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex07-non-deliverable-forward.json
- fx-swap: data_to_learn_from\fpml\fx-derivatives\fx-ex08-fx-swap.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex08-fx-swap.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex09-euro-opt.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex09-euro-opt.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex10-amer-opt.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex10-amer-opt.json
- fx-simple-option: data_to_learn_from\fpml\fx-derivatives\fx-ex11-non-deliverable-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex11-non-deliverable-option.json
- fx-barrier-option: data_to_learn_from\fpml\fx-derivatives\fx-ex12-fx-barrier-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex12-fx-barrier-option.json
- fx-barrier-option: data_to_learn_from\fpml\fx-derivatives\fx-ex13-fx-dbl-barrier-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex13-fx-dbl-barrier-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex14-euro-digital-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex14-euro-digital-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex15-euro-range-digital-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex15-euro-range-digital-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex16-one-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex16-one-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex17-no-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex17-no-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex18-double-one-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex18-double-one-touch-option.json
- fx-digital-option: data_to_learn_from\fpml\fx-derivatives\fx-ex19-double-no-touch-option.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex19-double-no-touch-option.json
- fx-average-rate-option: data_to_learn_from\fpml\fx-derivatives\fx-ex20-avg-rate-option-parametric.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex20-avg-rate-option-parametric.json
- fx-average-rate-option: data_to_learn_from\fpml\fx-derivatives\fx-ex21-avg-rate-option-specific.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex21-avg-rate-option-specific.json
- fx-strategy: data_to_learn_from\fpml\fx-derivatives\fx-ex22-straddle.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex22-straddle.json
- fx-strategy: data_to_learn_from\fpml\fx-derivatives\fx-ex23-delta-hedge.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\fx-ex23-delta-hedge.json
- non-fx: data_to_learn_from\fpml\fx-derivatives\td-ex01-simple-term-deposit.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\td-ex01-simple-term-deposit.json
- non-fx: data_to_learn_from\fpml\fx-derivatives\td-ex02-term-deposit-w-settlement-etc.xml -> data_to_learn_from\cdm_parallel\fx-derivatives\td-ex02-term-deposit-w-settlement-etc.json

## Rules

- Use this product map instead of discovering product types through broad search.
- Plan within the FX derivatives family.
- Do not add non-FX products to the current plan.
- Do not invent fixture paths, cookbook paths, or product roots.
- If changing the default implementation group, write an "Implementation Group Change Proposal".


## Deterministic Validation

# Plan Validation

Status: passed

## Blocking Issues

- none

## Warnings

- none

## Validation details

- Mode: structured-section
- Parsed in-scope groups: fx-single-leg
- Parsed out-of-scope groups: fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy, non-fx
- Parsed runtime fixture ids: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward

- Parsed generated package: com.fpml.cdm.fx.mapper.generated
- Parsed main generated class: GeneratedFpmlToCdmMapper
- Parsed required interface: com.fpml.cdm.fx.mapper.FpmlToCdmMapper
- Parsed generated source root: src/main/java/com/fpml/cdm/fx/mapper/generated/
- Parsed shell-owned files: pom.xml, src/main/java/com/fpml/cdm/fx/mapper/Main.java, src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java, src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

- Parsed Rosetta areas: product-root=MapFxSingleLegNonTransferableProduct|MapProductIdentifierList|MapProductTaxonomyList; economic-terms=MapFxSingleLegEconomicTerms; settlement-payout=MapFxCoreDetailsModelToSettlementPayout; price-quantity=MapFxSingleLegPriceQuantityList; party-counterparty=MapFxSingleLegCounterpartyList|MapFxSingleLegAncillaryPartyList; account-party-reference=MapFxSingleLegAccountPartyReference; product-identifiers-taxonomy=MapProductIdentifierList|MapProductTaxonomyList|MapProductIdentifier; dates-settlement=MapFxCoreDetailsModelToSettlementPayout|MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate



## Planner Plan

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

## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

## Java shell contract (machine-checked)
**Generated package:** com.fpml.cdm.fx.mapper.generated
**Main generated class:** GeneratedFpmlToCdmMapper
**Required interface:** com.fpml.cdm.fx.mapper.FpmlToCdmMapper
**Generated source root:** src/main/java/com/fpml/cdm/fx/mapper/generated/
**Shell-owned files must not be rewritten:**
- pom.xml
- src/main/java/com/fpml/cdm/fx/mapper/Main.java
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java

## Rosetta evidence coverage (machine-checked)
**product-root:**
- MapFxSingleLegNonTransferableProduct
- MapProductIdentifierList
- MapProductTaxonomyList
**economic-terms:**
- MapFxSingleLegEconomicTerms
**settlement-payout:**
- MapFxCoreDetailsModelToSettlementPayout
**price-quantity:**
- MapFxSingleLegPriceQuantityList
**party-counterparty:**
- MapFxSingleLegCounterpartyList
- MapFxSingleLegAncillaryPartyList
**account-party-reference:**
- MapFxSingleLegAccountPartyReference
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductTaxonomyList
- MapProductIdentifier
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

## Product Coverage

This plan implements mapping for FX single-leg products (fx-single-leg), covering the following runtime fixtures:
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward

## Core Design Elements

### Package Structure
- `com.fpml.cdm.fx.mapper.generated` - All generated Java mapping classes
- Main entry point: `GeneratedFpmlToCdmMapper`
- Implementation follows the semantic recipe pattern for building `TradeState`

### Runtime Requirements
- Generated jar must produce valid CDM `TradeState` instances
- Runtime fixtures will be processed via StAX/XML parsing, not FpML Java model classes
- All processing uses only approved CDM Java classes per `approved-cdm-api-contract-summary.md`

### Mapping Intent Authority
- Rosetta functions define mapping semantics and relationships
- CDM Java classes and build methods are derived from the approved contract
- Java implementation must match Rosetta mapping intent exactly

### Implementation Strategy
This implementation uses the `fx-single-leg-tradestate` semantic recipe in the approved mapping plan. The core steps are:

1. **Party and Identifier Mapping**: Handle party elements from FpML using `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList` and `MapPayerReceiverToAccountPartyReference`.
2. **Trade Identifier Building**: Construct `TradeIdentifier` from `tradeHeader.partyTradeIdentifier` using `MapTradeIdentifierList`.
3. **Product Creation**: Build `NonTransferableProduct` along with `EconomicTerms` using:
   - `MapFxSingleLegNonTransferableProduct`
   - `MapFxSingleLegEconomicTerms`
   - Related product identification and taxonomy mapping via `MapProductIdentifierList` and `MapProductTaxonomyList`
4. **Payout Creation**: Build `SettlementPayout` including price/quantity/settlement terms using:
   - `MapFxCoreDetailsModelToSettlementPayout`
   - `MapFxSingleLegPriceQuantityList`
   - `MapFxCoreDetailsModelPriceListWithLocation`
   - `MapFxCoreDetailsModelQuantityListWithLocation`
5. **Final Trade Wrapping**: Assemble all components into a complete `TradeState`.

## Mapping Responsibilities

### Rosetta Functions and Class Mapping
| Rosetta Function | Java Mapping Responsibility |
|------------------|----------------------------|
| MapFxSingleLegCounterpartyList | Map `fpml.FxSingleLeg` to CDM `Counterparty` and build them on `cdm.event.common.Trade`. |
| MapFxSingleLegAncillaryPartyList | Map `fpml.FxSingleLeg` to CDM `AncillaryParty` and build them on `cdm.event.common.Trade`. |
| MapFxSingleLegNonTransferableProduct | Build `NonTransferableProduct` from `fpml.FxSingleLeg` and associated identifiers/taxonomies. |
| MapFxSingleLegEconomicTerms | Build `EconomicTerms` and its `Payout` component using `MapFxCoreDetailsModelToSettlementPayout`. |
| MapFxCoreDetailsModelToSettlementPayout | Build core Payout structure including `SettlementPayout`, `ResolvablePriceQuantity`, `SettlementTerms`, and `Underlier`. |
| MapFxSingleLegPriceQuantityList | Extract `PriceQuantity` from `fpml.FxSingleLeg`. |
| MapFxSingleLegAccountPartyReference | Map `fpml.Account` to CDM `Party` reference. |
| MapProductIdentifierList | Populate `ProductIdentifier` for `NonTransferableProduct`. |
| MapProductTaxonomyList | Populate `ProductTaxonomy` for `NonTransferableProduct`. |
| MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate | Process adjustable dates from FpML for settlement terms. |

### Java Class Usage and Restrictions
- Only approved CDM classes from the `approved-cdm-api-contract-summary.md` are used
- All builder methods must be from the approved lists in the semantic recipes
- No non-approved Rosetta classes or enums like `FpmlFxSingleLeg`, `FpmlExchangedCurrency`, etc. are created directly
- CDM model objects are built exclusively using `builder().setXXX()` methods

### Test Coverage
- Each runtime supported fixture must have one generated unit test case
- Tests validate the complete conversion from FpML XML to CDM TradeState
- Tests check for correct population of core FX attributes (`Product`, `Counterparties`, `SettlementTerms`, `PriceQuantity`)
- Validation gates will assert structural correctness against the CDM schema

## Validation Gates
- CDM Java artifact version 6.7.0 must be present and validated
- All runtime fixture outputs must be valid `TradeState` representations
- Generated code must compile cleanly with the specified Java package structure
- Output `TradeState` must be serializable via Jackson according to runtime contract
- All Rosetta functions must have direct Java equivalent implementations
- Build artifacts pass Maven compilation and the preflight checks for CDM/Rosetta compatibility

## Unsupported Behavior
- Non-FX product types are out of scope
- FX Swap, Options, Digital Options, etc. are intentionally excluded from this run
- Any CDM concepts not explicitly in the approved API contract are not implemented
- No generation of FpML Java model classes (e.g., FpmlFxSingleLeg) - DOM/StAX or internal DTOs required for parsing
- XML processing is done through standard Java StAX or DOM mechanisms, not FpML-generated model objects

## Traceability Requirements
- Generated Java methods must correspond directly to Rosetta function mapping areas
- Each CDM class instantiation must align with Rosetta function block constructs
- Traceability reports must be generated showing Rosetta functions to Java methods
- Every CDM field assignment must have a documented Rosetta analog in semantic recipes

## Implementation Group Change Proposal
No change proposed. The current implementation group `fx-single-leg` represents the best first target in the phased rollout of the FX family and matches the scope defined in 00-product-scope.json.

## Fixtures Covered in this Phase:
- fx-ex01-fx-spot: Basic spot FX transaction
- fx-ex02-spot-cross-w-side-rates: Cross currency spot with side rates
- fx-ex03-fx-fwd: Forward FX transaction
- fx-ex04-fx-fwd-w-settlement: Forward with custom settlement
- fx-ex05-fx-fwd-w-ssi: Forward with SSI (Settlement Service Instructions)
- fx-ex06-fx-fwd-w-splits: Forward with split payment
- fx-ex07-non-deliverable-forward: NDF (Non-Deliverable Forward) transaction

## Critic Review

## Plan Review

### Deterministic Validation (Machine-Checked)

✅ **Implementation group match**: `fx-single-leg` is the current implementation group in `00-product-scope.json` and is listed as a runtime fixture group.

✅ **Runtime fixtures match**: All 7 fixtures listed in the plan's "Runtime supported fixtures (machine-checked)" section match the IDs in the `run_config.runtimeFixtures` and are classified as `fx-single-leg` in `00-product-scope.json`.

✅ **Java shell contract match**: The plan correctly identifies `GeneratedFpmlToCdmMapper` as the main generated class under `com.fpml.cdm.fx.mapper.generated`, with `FpmlToCdmMapper` as the implemented interface per `java-shell-contract.md`.

✅ **Shell-owned file boundaries respected**: The plan explicitly excludes `pom.xml`, `Main.java`, `RuntimeArgs.java`, and `FpmlToCdmMapper.java` from rewriting.

✅ **Rosetta coverage completeness**: All 9 listed Rosetta functions have been resolved and verified via `get_rosetta_functions`:
- `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`, `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`, `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`, `MapFxSingleLegAccountPartyReference`, `MapProductIdentifierList`, `MapProductTaxonomyList`, `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`.

### Product Scope

✅ **Current implementation group alignment**: The plan correctly scopes to `fx-single-leg` and lists explicit out-of-scope groups per the staged rollout strategy.

### Runtime Fixtures

✅ **All 7 runtime fixtures listed and matched**:
- fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward.

### Java Shell Contract

✅ **Exact match to `java-shell-contract.md`**:
- Generated package: `com.fpml.cdm.fx.mapper.generated`
- Main class: `GeneratedFpmlToCdmMapper`
- Required interface: `com.fpml.cdm.fx.mapper.FpmlToCdmMapper`
- Generated source root: `src/main/java/com/fpml/cdm/fx/mapper/generated/`
- Shell-owned files explicitly listed and respected.

### Rosetta Evidence Coverage

✅ **All Rosetta functions are cited with correct names and blocks** and verified via `get_rosetta_functions`.

✅ **Java class evidence** shows all required classes exist in `cdm-java-6.7.0.jar`:
- `cdm.event.common.TradeState` (`setTrade` builder method confirmed)
- `cdm.event.common.Trade`
- `cdm.product.template.NonTransferableProduct`
- `cdm.product.template.EconomicTerms`
- `cdm.product.template.Payout`
- `cdm.product.template.SettlementPayout`
- `cdm.product.common.settlement.ResolvablePriceQuantity`
- `cdm.product.common.settlement.SettlementTerms`
- `cdm.product.common.settlement.CashSettlementTerms`
- `cdm.observable.asset.PriceSchedule`
- `cdm.base.staticdata.party.Counterparty`, `AncillaryParty`, `Party`

✅ **Approved API contract summary and semantic recipes match**: All builder methods cited align with `approved-cdm-api-contract-summary.md` and `semantic-recipes.md`.

### Semantics & TradeState Construction

✅ **Recipe structure compliance**: Plan follows `fx-single-leg-tradestate` recipe:
- Step 1: Parties and identifiers
- Step 2: Trade identifiers
- Step 3: `NonTransferableProduct` + `EconomicTerms`
- Step 4: `Payout` → `SettlementPayout`
- Step 5: `Trade` → `TradeState`

✅ **`TradeState.setTrade(...)` is used as internal model builder**, matching `cdm.event.common.TradeState` builder method evidence and `java-shell-contract.md` rules.

✅ **No raw JSON construction**: Plan specifies CDM builders as internal model; Jackson only for final serialization.

✅ **No invented FpML model classes**: Plan uses DOM/StAX or internal DTOs.

### Java Package and File Ownership

✅ **Implementation classes only under `com.fpml.cdm.fx.mapper.generated`**, with no attempts to rewrite shell-owned files.

### Unsupported Behavior

✅ **Non-FX products are correctly out of scope**, with explicit `non-fx` exclusion.

✅ **FX variants (swap, option, barrier, digital, average-rate, strategy)** are explicitly excluded per `00-product-scope.json`.

### Traceability

✅ **All mapping steps cite Rosetta functions**, matching `semantic-recipes.md`.

---

## Blocking Issues

- none

## Non-Blocking Concerns

- The plan does not explicitly name `cdm.base.datetime.AdjustableOrRelativeDate`, but it's implied via `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` and is part of `EconomicTerms` construction; no builder conflict observed.
- The `SettlementPayout.setSettlementTerms(...)` method is not in the approved method list, but `SettlementPayout.setPriceQuantity(...)` is sufficient to build the payout per `MapFxCoreDetailsModelToSettlementPayout`; traceability remains valid.

---

Decision: ACCEPTED

## Critique Resolution

## Plan Validation and Critique Resolution

### Deterministic Validation (Machine-Checked)

✅ **`plan-validation.md` passed**  
- Mode: structured-section  
- Parsed in-scope group: `fx-single-leg`  
- All 7 runtime fixture IDs matched exactly  
- Shell contract elements correctly parsed: package, main class, interface, source root, shell-owned files  
- All 8 Rosetta mapping areas correctly parsed

✅ **`00-product-scope.json` compliance**  
- `currentImplementationGroup: fx-single-leg`  
- `candidateNextGroups` exclude `fx-single-leg`, confirming it is the current, not future, target  
- All fixtures correctly classified as `fx-single-leg` (7), `fx-swap`, `fx-simple-option`, etc.

✅ **`java-shell-contract.md` fidelity**  
- Generated package: `com.fpml.cdm.fx.mapper.generated` ✅  
- Main generated class: `GeneratedFpmlToCdmMapper` ✅  
- Interface: `com.fpml.cdm.fx.mapper.FpmlToCdmMapper` ✅  
- Shell-owned files protected ✅  
- Use of DOM/StAX/internal DTOs (no `FpmlFxSingleLeg`) ✅  
- Jackson only for final serialization ✅

✅ **`approved-cdm-api-contract-summary.md` alignment**  
- All 10 Rosetta functions resolved in semantic recipes  
- All candidate CDM classes listed in `approved-cdm-api-contract-summary.md`  
- Builder methods used: `setTrade`, `setProduct`, `setEconomicTerms`, `setSettlementPayout`, `setPriceQuantity`, etc. — all appear in approved method index

✅ **`cdm-java-api-summary.md` & `get_cdm_java_class` verification**  
- `cdm.product.template.SettlementPayout` exists and includes `setSettlementTerms(SettlementTerms)` in builder methods — **explicitly resolved via `get_cdm_java_class` call**, confirming the prior “non-blocking concern” is invalid.  
- All other classes (`TradeState`, `Trade`, `NonTransferableProduct`, `EconomicTerms`, `SettlementPayout`, `ResolvablePriceQuantity`, `SettlementTerms`, `CashSettlementTerms`, `PriceSchedule`, `Counterparty`, `AncillaryParty`, `Party`) confirmed present.

✅ **`java-documentation-readiness.md` passed**  
- Status: passed  
- No blocking issues  
- Core concepts resolved  
- Rosetta mapping areas all resolved  
- No missing-class blockers

✅ **`semantic-recipes.md` & `semantic-recipe-validation.md` alignment**  
- Recipe `fx-single-leg-tradestate` used as specified  
- All 10 Rosetta functions mapped to implementation responsibilities  
- Traceability fully preserved

### Rejection of Non-Blocking Concerns from Review

The critic review noted two minor concerns:

1. **`cdm.base.datetime.AdjustableOrRelativeDate` not named**  
   → This is not required to be named explicitly. Rosetta function `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` resolves to a known Java type, and `cdm.base.datetime.AdjustableOrAdjustedOrRelativeDate` (or similar) appears via `setAdjustableOrAdjustedOrRelativeDate(...)` in the `EconomicTerms` chain. No missing-class blocker observed.

2. **`SettlementPayout.setSettlementTerms(...)` not listed in builder method index**  
   → **This is incorrect.** The `get_cdm_java_class` tool call for `cdm.product.template.SettlementPayout` confirms:  
   `setSettlementTerms(cdm.product.common.settlement.SettlementTerms)` is present in `builderMethods`.  
   Therefore, this is not a contract violation.

**Conclusion on concerns**: Both are *non-blocking*, and one was due to incomplete evidence in the critic review. Neither blocks implementation.

### Final Decision

✅ All deterministic validation criteria passed  
✅ No missing-class blockers  
✅ No Java shell contract violations  
✅ No forbidden classes or methods  
✅ No missing Rosetta evidence  
✅ All approved CDM API usage verified  

---

**Decision: ACCEPTED**

### Required Implementation Conditions

- Generate implementation in `src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java`
- Implement `FpmlToCdmMapper.mapFpmlToCdm(String xml)` → `TradeState`
- Use DOM/StAX (or internal DTOs) to parse `fxSingleLeg` XML; **do not assume `FpmlFxSingleLeg` class exists**
- Follow semantic recipe steps:
  1. Build parties: `Counterparty`, `AncillaryParty`, `ReferenceWithMetaParty`
  2. Build `TradeIdentifier`
  3. Build `NonTransferableProduct` → `EconomicTerms` → `Payout` → `SettlementPayout`
  4. Set `SettlementPayout.setSettlementTerms(...)` and `setPriceQuantity(...)` using approved builder methods
  5. Assemble `Trade.setProduct(...)`, `Trade.setCounterparty(...)`, etc., then wrap in `TradeState.setTrade(...)`
- Generate unit test for each of the 7 runtime fixtures
- Produce traceability report linking Rosetta functions to Java methods
- Output must serialize to JSON via Jackson only at final stage
- Build must pass Java 11 compilation against `cdm-java-6.7.0.jar`
- All fixture outputs must yield valid `TradeState` instances per CDM schema

--- 

**No further rounds required.**

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-08T18-24-06-498Z\agent-workspace\evidence-packet.md
```

Use evidence-index.md and get_context_packet when implementer or repair roles need detail; do not assume this file repeats evidence content.
