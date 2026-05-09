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