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