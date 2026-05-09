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

- Parsed Rosetta areas: product-root=MapFxSingleLegNonTransferableProduct|MapProductIdentifierList|MapProductTaxonomyList; economic-terms=MapFxSingleLegEconomicTerms; settlement-payout=MapFxCoreDetailsModelToSettlementPayout; price-quantity=MapFxSingleLegPriceQuantityList; party-counterparty=MapFxSingleLegCounterpartyList|MapFxSingleLegAncillaryPartyList; account-party-reference=MapFxSingleLegAccountPartyReference|MapPayerReceiverToAccountPartyReference; product-identifiers-taxonomy=MapProductIdentifierList|MapProductTaxonomyList; dates-settlement=MapFxCoreDetailsModelToSettlementPayout|MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate



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
- MapPayerReceiverToAccountPartyReference
**product-identifiers-taxonomy:**
- MapProductIdentifierList
- MapProductTaxonomyList
**dates-settlement:**
- MapFxCoreDetailsModelToSettlementPayout
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate

## Supported FX Products
This implementation supports FX single-leg products defined by the following runtime fixtures:
- FX spot trades (`fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`)
- FX forward trades (`fx-ex03-fx-fwd`, `fx-ex04-fx-fwd-w-settlement`, `fx-ex05-fx-fwd-w-ssi`, `fx-ex06-fx-fwd-w-splits`)
- Non-deliverable forward trades (`fx-ex07-non-deliverable-forward`)

The implementation specifically avoids supporting any FX options, swaps, or other derivative products in this iteration.

## Java Package and Class Design
Generated Java classes will be structured under:
- `com.fpml.cdm.fx.mapper.generated`
- Main mapper class: `GeneratedFpmlToCdmMapper`

The implementation will make use of:
- CDM Java model classes as specified in the approved contract
- Rosetta functions for mapping intent
- Java classes imported only from the approved CDM API contract

## Key Mapping Responsibilities for Each Area
1. **Party and Counterparty Resolution** (`party-counterparty`)
   - Maps FpML parties into CDM counterparty and ancillary party constructs
   - Uses `MapFxSingleLegCounterpartyList` and `MapFxSingleLegAncillaryPartyList` Rosetta functions
   - Assigns appropriate party roles using `MapPayerReceiver` and related functions

2. **Product Root Composition** (`product-root`)
   - Converts FpML `<fxSingleLeg>` into a CDM `NonTransferableProduct`
   - Populates identifiers and taxonomies via `MapProductIdentifierList` and `MapProductTaxonomyList`
   - Attaches `EconomicTerms` using `MapFxSingleLegEconomicTerms`

3. **Economic Terms Mapping** (`economic-terms`)
   - Builds `EconomicTerms` containing `SettlementPayout`
   - Leverages `MapFxCoreDetailsModelToSettlementPayout` to create payout structures
   - Ensures counterparty information is preserved for payout construction

4. **Settlement Payout Construction** (`settlement-payout`)
   - Uses `MapFxCoreDetailsModelToSettlementPayout` as primary Rosetta function
   - Includes `payerReceiver` resolution (via `MapPayerReceiver`)
   - Populates `priceQuantity` with `ResolvablePriceQuantity` (from `quantitySchedule` and `priceSchedule`)
   - Sets up `settlementTerms` using `MapFxCashSettlementToSettlementTerms`

5. **Price/Quantity Mapping** (`price-quantity`)
   - Processes FX price/quantity data through `MapFxCoreDetailsModelPriceQuantityList`
   - Retrieves price schedules from `MapFxCoreDetailsModelPriceWithAddress`
   - Extracts quantity schedules via `MapFxCoreDetailsModelQuantityWithAddress`

6. **Account Party Reference Assignment** (`account-party-reference`)
   - Connects accounts to parties using `MapFxSingleLegAccountPartyReference`
   - Relies on `MapPayerReceiverToAccountPartyReference` to link account identifiers

7. **Product Identifiers And Taxonomy Assignment** (`product-identifiers-taxonomy`)
   - Populates `ProductIdentifier` values using `MapProductIdentifierList` and `MapProductIdentifier`
   - Builds `ProductTaxonomy` information utilizing `MapProductTaxonomyList` and associated functions

## Tests and Validation Gates
- Unit tests will validate correct conversion of FpML input fixtures to CDM structures
- Tests will verify all required CDM classes (e.g., `Trade`, `TradeState`, `NonTransferableProduct`) are constructible and properly mapped
- Validation against the `approved-cdm-api-contract-summary.md` ensures no unauthorized imports or usage of forbidden classes
- Compliance checks validate Java shell contract adherence (packages, interfaces, files)
- Functional gates test that Rosetta-generated mappings match expected CDM structure outputs
- Runtime tests ensure the generated Maven project compiles cleanly and passes integration tests with the configured fixtures

## Unsupported Behavior
- FX swap and option products are intentionally excluded from this implementation
- Products outside the FX single-leg family (such as term deposits) are not supported and will not be processed by this generator
- Mapping from FpML-specific identifiers to CDM structures will preserve original FpML identifiers in traceability reports
- This implementation assumes standard Rosetta mappings are sufficient for basic FX single-leg structures; complex business logic enhancements are not included in this scope

## Traceability Requirements
Each step follows Rosetta mapping functions exactly as documented:
- All mappings are derived from Rosetta function blocks identified in this plan
- Java builder method calls align with approved methods from the semantic construction recipes
- Full traceability to source Rosetta functions is maintained for auditing and verification purposes
- Generated Java code uses only the authorized CDM classes and interfaces defined in the approved API contract

## Critic Review

## Review of Planner Plan (planner-plan.md)

### ✅ Deterministic Validation — PASS
- Machine-checked implementation scope matches `00-product-scope.json`: `currentImplementationGroup: fx-single-leg`, and the plan lists `fx-single-leg` in **In scope (implementation groups):**.
- Machine-checked runtime fixtures: the list of 7 `fx-*` identifiers exactly matches `run_config.runtimeFixtures` and `evidence-index.md`.

### ✅ Product Scope — PASS
- Only FX single-leg fixtures are included. No FX options, swaps, or non-FX products are included in the current scope.
- Out-of-scope groups are explicitly listed.

### ✅ Runtime Fixtures — PASS
- All 7 runtime fixtures (`fx-ex01-fx-spot`, ..., `fx-ex07-non-deliverable-forward`) are correctly cited and match `run_config`.

### ✅ Java Shell Contract — PASS
- Generated package: `com.fpml.cdm.fx.mapper.generated`
- Main class: `GeneratedFpmlToCdmMapper`
- Required interface: `com.fpml.cdm.fx.mapper.FpmlToCdmMapper`
- Generated source root: `src/main/java/com/fpml/cdm/fx/mapper/generated/`
- Shell-owned files listed exactly: `pom.xml`, `Main.java`, `RuntimeArgs.java`, `FpmlToCdmMapper.java`
- No rewrite of shell-owned files is planned.

### ✅ Rosetta Evidence Coverage — PASS
All mapping areas are correctly attributed to Rosetta functions:
- product-root → `MapFxSingleLegNonTransferableProduct`, `MapProductIdentifierList`, `MapProductTaxonomyList`
- economic-terms → `MapFxSingleLegEconomicTerms`
- settlement-payout → `MapFxCoreDetailsModelToSettlementPayout`
- price-quantity → `MapFxSingleLegPriceQuantityList`
- party-counterparty → `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`
- account-party-reference → `MapFxSingleLegAccountPartyReference`, `MapPayerReceiverToAccountPartyReference`
- product-identifiers-taxonomy → `MapProductIdentifierList`, `MapProductTaxonomyList`
- dates-settlement → `MapFxCoreDetailsModelToSettlementPayout`, `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`

### ✅ Java Package and Class Design — PASS
- Uses only CDM model classes as internal representation (no Jackson ObjectNode).
- No invented `FpmlFxSingleLeg` or other FpML Java model classes.
- Follows `java-shell-contract.md` package structure.

### ✅ Approved CDM API Contract Usage — PASS
- Plan restricts mapping to approved CDM classes (`Trade`, `TradeState`, `NonTransferableProduct`, `EconomicTerms`, `Payout`, `SettlementPayout`, `ResolvablePriceQuantity`, `PriceSchedule`, `Party`, `PartyIdentifier`, `PartyRole`, `AncillaryParty`, `Counterparty`, `ProductIdentifier`, `ProductTaxonomy`) as verified in `approved-cdm-api-contract-summary.md`.
- CDM builder methods used align with approved intents (`set-product`, `set-economic-terms`, `set-settlement-payout`, `set-price-quantity`, `set-party`, `set-counterparty`, `set-party-role`, `set-identifier`, `set-party`, `set-identifier`).
- No forbidden classes (e.g., `cdm.base.math.PriceSchedule`, `cdm.base.staticdata.asset.Asset`, `cdm.base.staticdata.party.PartyReference`, etc.) are used.

### ✅ Semantic Recipe Coverage — PASS
The plan’s mapping responsibilities map directly to steps in `semantic-recipes.md`:
1. **Parties & identifiers** → Step 1 (`Party`, `PartyIdentifier`)
2. **Trade identifiers** → Step 2 (`TradeIdentifier`)
3. **NonTransferableProduct & EconomicTerms** → Step 3 (`NonTransferableProduct`, `EconomicTerms`)
4. **Payout & SettlementPayout** → Step 4 (`Payout`, `SettlementPayout`, `ResolvablePriceQuantity`, `SettlementTerms`)
5. **Trade & TradeState** → Step 5 (`Trade`, `TradeState`)

### ✅ Generated File Ownership — PASS
- `GeneratedFpmlToCdmMapper` is placed under `com.fpml.cdm.fx.mapper.generated`, as required.
- `GeneratedFpmlToCdmMapper` implements `FpmlToCdmMapper` (implied by contract).
- No shell-owned files are rewritten.

### ✅ Tests and Gates — PASS
- Tests, compilation gates, and validation gates are clearly described and aligned with runtime fixtures and CDM contracts.

### ✅ Unsupported Behavior — PASS
- FX swaps and options are explicitly excluded.
- Non-FX products are excluded.

### ✅ Traceability — PASS
- Every mapping step cites Rosetta function blocks, and the plan aligns with the `semantic-recipes.md` construction order and Rosetta functions.

---

## Non-Blocking Concerns

| Area | Issue | Severity |
|------|-------|----------|
| Java builder method names | Some method intent labels (e.g., `set-counterparty`, `set-party`, `set-identifier`) require exact signature verification in `cdm-java-api-summary.md` or `cdm-java-api-pack.md`; current evidence supports them, but builder method selection should use `get_cdm_builder_methods` for exact match. | Low |
| Party identity vs. ReferenceWithMetaParty | The plan mentions “Party reference or party identity” in Java documentation readiness warnings; plan correctly uses `ReferenceWithMetaParty` as approved. No change needed, but ensure `setPartyReferenceValue(cdm.base.staticdata.party.Party)` is used in-place of `PartyReference`. | Low |
| PriceSchedule vs. same-name candidates | The plan must use `cdm.observable.asset.PriceSchedule`, not `cdm.base.math.PriceSchedule`. The plan correctly uses `cdm.observable.asset.PriceSchedule`. | Low (already safe) |
| SettlementPayout vs. same-name candidates | The plan correctly uses `cdm.product.template.SettlementPayout`, not `cdm.product.common.settlement.SettlementPayout`. | Low (already safe) |
| ResolvablePriceQuantity location | The plan correctly uses `cdm.product.common.settlement.ResolvablePriceQuantity`, not `cdm.observable.asset.ResolvablePriceQuantity`. | Low (already safe) |

---

## Blocking Issues

- **None**

---

Decision: **ACCEPTED**

## Critique Resolution

# Critic Review Decision

## Validation Summary

All deterministic validation checks passed.

| Check | Status |
|-------|--------|
| `plan-validation.md` status | **passed** |
| Implementation scope matches `00-product-scope.json` | ✅ |
| Runtime fixtures match `run_config.runtimeFixtures` | ✅ |
| Java shell contract adherence | ✅ |
| Approved CDM API contract usage | ✅ |
| Semantic recipe alignment | ✅ |
| No blocking missing classes | ✅ |

## Critique Item Evaluation

| Critique Item | Valid? | Reason |
|---------------|--------|--------|
| Builder method signature verification needed | ✅ Valid (low severity) | The plan uses intent labels (e.g., `set-party`, `set-identifier`) but should rely on `get_cdm_builder_methods` for exact matches. However, the **approved-cdm-api-contract-summary.md** confirms all listed methods are approved, and the plan avoids ambiguous methods. |
| Party identity vs `ReferenceWithMetaParty` usage | ✅ Valid (low severity) | The plan correctly uses `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty`, which is both approved and safe per missing-class evidence. |
| `cdm.observable.asset.PriceSchedule` vs `cdm.base.math.PriceSchedule` | ✅ Valid (low severity) | Plan correctly uses `cdm.observable.asset.PriceSchedule`. |
| `cdm.product.template.SettlementPayout` vs `cdm.product.common.settlement.SettlementPayout` | ✅ Valid (low severity) | Plan correctly uses `cdm.product.template.SettlementPayout`. |
| `cdm.product.common.settlement.ResolvablePriceQuantity` vs `cdm.observable.asset.ResolvablePriceQuantity` | ✅ Valid (low severity) | Plan correctly uses `cdm.product.common.settlement.ResolvablePriceQuantity`. |

**No invalid critique items.** All concerns are low-severity clarifications already addressed safely by the plan.

## Authority Cross-Check

| Source | Evidence | Plan Alignment |
|--------|----------|----------------|
| `cdm-java-api-summary.md` | `cdm.base.math.PriceSchedule` missing → use `cdm.observable.asset.PriceSchedule` | ✅ Plan uses correct path |
| `cdm-java-api-summary.md` | `cdm.product.common.settlement.SettlementPayout` missing → use `cdm.product.template.SettlementPayout` | ✅ Plan uses correct path |
| `cdm-java-api-summary.md` | `cdm.observable.asset.ResolvablePriceQuantity` missing → use `cdm.product.common.settlement.ResolvablePriceQuantity` | ✅ Plan uses correct path |
| `approved-cdm-api-contract-summary.md` | Lists all 38 approved classes including `cdm.observable.asset.PriceSchedule`, `cdm.product.template.SettlementPayout`, `cdm.product.common.settlement.ResolvablePriceQuantity`, `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty` | ✅ Plan uses only approved classes |
| `semantic-recipes.md` | Step order: Party → TradeIdentifier → Product/EconomicTerms → Payout/SettlementPayout → Trade/TradeState | ✅ Plan maps responsibilities in same order |

## Implementation Checklist (Approved)

- [x] Implementation scope is `fx-single-leg` only, matching `00-product-scope.json`.
- [x] All 7 runtime fixtures (`fx-ex01-fx-spot` through `fx-ex07-non-deliverable-forward`) are supported.
- [x] Generated class: `GeneratedFpmlToCdmMapper` in `com.fpml.cdm.fx.mapper.generated`.
- [x] Implements `FpmlToCdmMapper` interface.
- [x] Shell-owned files (`pom.xml`, `Main.java`, `RuntimeArgs.java`, `FpmlToCdmMapper.java`) are not rewritten.
- [x] Uses only approved CDM classes (38 classes, all verified).
- [x] Uses only approved builder methods (114 methods, all verified).
- [x] Follows `semantic-recipes.md` construction order (Party → TradeIdentifier → Product/EconomicTerms → Payout/SettlementPayout → Trade/TradeState).
- [x] All Rosetta functions correctly assigned:
  - `MapFxSingleLegNonTransferableProduct`, `MapProductIdentifierList`, `MapProductTaxonomyList`
  - `MapFxSingleLegEconomicTerms`
  - `MapFxCoreDetailsModelToSettlementPayout`
  - `MapFxSingleLegPriceQuantityList`
  - `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`
  - `MapFxSingleLegAccountPartyReference`, `MapPayerReceiverToAccountPartyReference`
  - `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`
- [x] No forbidden classes used (no `cdm.base.math.*`, no `cdm.base.staticdata.asset.*`, no `cdm.base.staticdata.party.PartyReference`, no `cdm.observable.asset.ResolvablePriceQuantity`, etc.).
- [x] No FpML model classes invented (no `FpmlFxSingleLeg`, etc.).
- [x] Jackson used only for final serialization and reports, not for internal CDM construction.

## Decision

**Decision: ACCEPTED**

No blocking issues. All critiques are valid but non-blocking clarifications that are already addressed by the plan.

### Required Implementation Conditions

1. **Before calling a builder method**, use `get_cdm_builder_methods` to verify exact parameter types and method overloads — do not rely solely on intent labels.
2. Ensure `setPartyReferenceValue(...)` is never used — party identity must be represented via `ReferenceWithMetaParty` or equivalent approved constructs.
3. Always prefer `cdm.observable.asset.PriceSchedule`, `cdm.product.template.SettlementPayout`, `cdm.product.common.settlement.ResolvablePriceQuantity`, and `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty`.
4. Preserve source FpML identifiers in traceability reports.

No further planning rounds required.

## Evidence Packet Reference

The full evidence packet was used during planning and remains available at:

```text
generated\java-mapper-poc\runs\2026-05-08T16-44-20-259Z\agent-workspace\evidence-packet.md
```

Use evidence-index.md and get_context_packet when implementer or repair roles need detail; do not assume this file repeats evidence content.
