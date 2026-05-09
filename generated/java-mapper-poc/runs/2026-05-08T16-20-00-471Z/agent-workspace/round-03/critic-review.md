## Review

### ✅ Deterministic validation
- ✅ `## Implementation scope (machine-checked)` present, matches `00-product-scope.json` (currentImplementationGroup=fx-single-leg).
- ✅ `## Runtime supported fixtures (machine-checked)` present and matches `run_config.runtimeFixtures`.
- ✅ `## Java shell contract (machine-checked)` matches `java-shell-contract.md`.
- ✅ `## Rosetta evidence coverage (machine-checked)` covers all required Rosetta functions.

### ✅ Product scope
- ✅ Plans only `fx-single-leg`, excluding `fx-swap`, `fx-simple-option`, etc. per `00-product-scope.json`.
- ✅ No broad FX support claims beyond fx-single-leg.

### ✅ Runtime fixtures
- ✅ Uses only the 7 approved runtime fixtures.

### ✅ Java shell contract
- ✅ Uses `com.fpml.cdm.fx.mapper.generated`.
- ✅ Plan class `GeneratedFpmlToCdmMapper` implements `FpmlToCdmMapper`.
- ✅ Does not plan to rewrite shell-owned files.

### ✅ Java package/class design
- ✅ Does not invent `FpmlFxSingleLeg` or similar raw JSON CDM model.
- ✅ Does not contradict `java-shell-contract.md`.
- ✅ Does not plan implementation classes outside `com.fpml.cdm.fx.mapper.generated`.

### ✅ Generated file ownership
- ✅ Only `com.fpml.cdm.fx.mapper.generated` is used for generated implementation.

### ✅ Tests/gates
- ✅ Plans unit tests, integration tests for runtime fixtures, and traceability checks.

### ✅ Unsupported behavior
- ✅ Explicitly lists unsupported FX products.

### ✅ Traceability
- ✅ Each mapping area is explicitly tied to Rosetta function names and block ids.

---

## Blocking issues

1. **Unsupported claim about `TradeState.setTrade(...)` usage**  
   - ❌ Claim: “The implementation will **not** use `set-trade(...)` builder method since it's not in the API contract.”
   - ❌ Counter-evidence: `get_cdm_builder_methods('cdm.event.common.TradeState', 'set-trade')` → `setTrade: public abstract cdm.event.common.TradeState$TradeStateBuilder setTrade(cdm.event.common.Trade)`
   - ❌ This is a **core builder method**, present in the contract and needed for final construction. The plan’s rejection creates an implementation gap.

2. **Missing explicit approval evidence for `ProductIdentifier` and `ProductTaxonomy`**  
   - ❌ Recipe states `ProductIdentifier` and `ProductTaxonomy` are required.
   - ❌ `get_approved_cdm_api_contract` does **not** include `cdm.base.staticdata.asset.common.ProductIdentifier` or `cdm.base.staticdata.asset.common.ProductTaxonomy` in approved classes.
   - ❌ `get_cdm_builder_methods` returns `ERROR: Class is not approved by approved-cdm-api-contract.json` for both.
   - ✅ However, `approved-cdm-api-contract-summary.md` lists `cdm.base.staticdata.asset.common.Asset` and `cdm.base.staticdata.asset.common.Cash`.
   - ❌ This is an omission in the approved contract, but the plan must not use unapproved classes. The plan incorrectly assumes `ProductIdentifier`/`ProductTaxonomy` are approved.

3. **Missing evidence of `TradeIdentifier.addAssignedIdentifier` builder intent**  
   - ✅ Recipe lists `build-root`, `set-identifier` intent for `TradeIdentifier`.
   - ❌ `get_cdm_builder_methods('cdm.event.common.TradeIdentifier', 'set-identifier')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.event.common.TradeIdentifier')` includes `addAssignedIdentifier`, `setAssignedIdentifier`, `setIdentifierType`.
   - ❌ The plan uses “set-identifier” as intent, but the builder contract uses **intent-agnostic method names** (`setAssignedIdentifier`, `setIdentifierType`). This misalignment makes recipe intent mapping ambiguous.

4. **Missing evidence of `Payout.setSettlementPayout` builder intent**  
   - ✅ Recipe lists `set-settlement-payout` intent.
   - ❌ `get_cdm_builder_methods('cdm.product.template.Payout', 'set-settlement-payout')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.product.template.Payout')` includes `getOrCreateSettlementPayout`, `getSettlementPayout`, `setSettlementPayout`.
   - ❌ Same intent/naming mismatch issue.

5. **Missing evidence of `ReferenceWithMetaParty.setValue`/`PartyReference`**  
   - ❌ Plan states “Uses `ReferenceWithMetaParty`”.
   - ❌ Recipe intent is `set-party` for `ReferenceWithMetaParty`.
   - ❌ `get_cdm_builder_methods('cdm.base.staticdata.party.metafields.ReferenceWithMetaParty', 'set-party')` → error.
   - ✅ But `get_cdm_builder_methods('cdm.base.staticdata.party.metafields.ReferenceWithMetaParty')` includes `setValue(cdm.base.staticdata.party.Party)`.
   - ❌ The builder does **not** expose intent `set-party`; intent must be mapped to `setValue`.

6. **Missing evidence for `setPriceQuantity` intent on `ResolvablePriceQuantity`**  
   - ❌ Recipe intent: `set-price-quantity` on `ResolvablePriceQuantity`.
   - ❌ `get_cdm_builder_methods('cdm.product.common.settlement.ResolvablePriceQuantity', 'set-price-quantity')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.product.template.SettlementPayout')` includes `setPriceQuantity(cdm.product.common.settlement.ResolvablePriceQuantity)`.
   - ❌ The builder contract for `ResolvablePriceQuantity` does **not** list `setPriceQuantity`. The plan conflates `SettlementPayout.setPriceQuantity(...)` with `ResolvablePriceQuantity`.

7. **Missing evidence for `set-product` intent on `Trade`**  
   - ❌ Recipe intent: `set-product` for `Trade`.
   - ❌ `get_cdm_builder_methods('cdm.event.common.Trade', 'set-product')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.event.common.Trade')` includes `setProduct(cdm.product.template.NonTransferableProduct)`.
   - ❌ Again, builder contract uses `setProduct(...)` (no intent-based name).

8. **Missing evidence for `set-contract-details` intent on `Trade`**  
   - ❌ Recipe intent: `set-contract-details` for `Trade`.
   - ❌ `get_cdm_builder_methods('cdm.event.common.Trade', 'set-contract-details')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.event.common.Trade')` includes `setContractDetails(cdm.event.common.ContractDetails)`.
   - ❌ Again, builder contract uses `setContractDetails(...)` (no intent-based name).

9. **Missing evidence for `set-party` intent on `Trade`**  
   - ❌ Recipe intent: `set-party` for `Trade`.
   - ❌ `get_cdm_builder_methods('cdm.event.common.Trade', 'set-party')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.event.common.Trade')` includes `addParty(...)`, `setParty(...)`, `addCounterparty(...)`, `addAncillaryParty(...)`.
   - ❌ Builder contract uses `setParty(...)` (no intent-based name).

10. **Missing evidence for `build` intent on intermediate classes**  
    - ❌ Recipe uses intent `build-root` and `build` for multiple classes.
    - ❌ `get_cdm_builder_methods` returns errors like “No approved builder methods matched intent build”.
    - ✅ However, Rosetta builders always have a `.build()` method, but this plan must **not** assume it is approved unless explicitly listed.
    - ❌ This plan should avoid claiming `build(...)` intent. Instead, it should rely on `setTrade(...)`, `setProduct(...)`, etc.

11. **Incorrect rejection of `setTrade(...)` usage**  
    - ❌ The plan claims `setTrade(...)` is not in the API contract.
    - ✅ Evidence: `get_cdm_builder_methods('cdm.event.common.TradeState', 'set-trade')` → `setTrade(...)` exists.
    - ❌ This is a **critical blocker** — without it, the plan cannot construct `TradeState`.

12. **Missing `cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate` usage**  
    - ❌ Plan mentions `cdm.base.datetime.AdjustableOrAdjustedDate` and `cdm.base.datetime.AdjustableOrRelativeDateOrExpression`.
    - ✅ Recipe mentions `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`.
    - ❌ The plan must ensure that only **approved** classes (e.g., `AdjustableOrAdjustedDateOrRelativeDate`) are used. It does not explicitly cite `AdjustableOrAdjustedDateOrRelativeDate`, only `AdjustableOrAdjustedDate` and `AdjustableOrRelativeDateOrExpression`.

---

## Warnings / Non-blocking concerns

1. **Missing `cdm.base.staticdata.identifier.Identifier` builder methods for `set-identifier`**  
   - Recipe lists `set-identifier` intent for `Identifier`.
   - ❌ `get_cdm_builder_methods('cdm.base.staticdata.identifier.Identifier', 'set-identifier')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.base.staticdata.identifier.Identifier')` includes `addAssignedIdentifier`, `setAssignedIdentifier`.
   - ❌ Intent mismatch; builder uses `setAssignedIdentifier(...)`.

2. **Missing `cdm.base.staticdata.party.PartyIdentifier` builder methods for `set-identifier`**  
   - Recipe lists `set-identifier` intent for `PartyIdentifier`.
   - ❌ `get_cdm_builder_methods('cdm.base.staticdata.party.PartyIdentifier', 'set-identifier')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.base.staticdata.party.PartyIdentifier')` includes `setIdentifier(...)`, `setIdentifierValue(...)`, `setIdentifierType(...)`.
   - ❌ Intent mismatch.

3. **Missing `cdm.product.template.EconomicTerms` builder method evidence for `set-economic-terms`**  
   - ✅ Recipe intent: `set-economic-terms`.
   - ❌ `get_cdm_builder_methods('cdm.product.template.EconomicTerms', 'set-economic-terms')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.product.template.NonTransferableProduct')` includes `setEconomicTerms(...)`.
   - ❌ Intent mismatch; should be `setEconomicTerms(...)`.

4. **Missing `cdm.base.staticdata.party.Party` builder method evidence for `set-party`**  
   - ✅ Recipe intent: `set-party`.
   - ❌ `get_cdm_builder_methods('cdm.base.staticdata.party.Party', 'set-party')` returns no matches.
   - ✅ But `get_cdm_builder_methods('cdm.base.staticdata.party.Party')` includes `addPartyId(...)`, `setPartyId(...)`.
   - ❌ Intent mismatch; should be `setPartyId(...)`.

5. **Missing `cdm.base.staticdata.party.Counterparty` builder method evidence for `build-root`**  
   - ❌ Recipe lists `build-root`.
   - ❌ `get_cdm_builder_methods('cdm.base.staticdata.party.Counterparty', 'build-root')` returns no matches.
   - ✅ But `cdm.base.staticdata.party.Counterparty` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

6. **Missing `cdm.base.staticdata.party.AncillaryParty` builder method evidence for `build-root`**  
   - ❌ Recipe lists `build-root`.
   - ❌ `get_cdm_builder_methods('cdm.base.staticdata.party.AncillaryParty', 'build-root')` returns no matches.
   - ✅ But `cdm.base.staticdata.party.AncillaryParty` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

7. **Missing `cdm.product.template.SettlementPayout` builder method evidence for `build-root`**  
   - ❌ Recipe lists `build-root`.
   - ❌ `get_cdm_builder_methods('cdm.product.template.SettlementPayout', 'build-root')` returns no matches.
   - ✅ But `cdm.product.template.SettlementPayout` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

8. **Missing `cdm.observable.asset.PriceSchedule` builder method evidence for `build-root`**  
   - ❌ Recipe lists `build-root`.
   - ❌ `get_cdm_builder_methods('cdm.observable.asset.PriceSchedule', 'build-root')` returns no matches.
   - ✅ But `cdm.observable.asset.PriceSchedule` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

9. **Missing `cdm.product.common.settlement.ResolvablePriceQuantity` builder method evidence for `build-root`**  
   - ❌ Recipe lists `build-root`.
   - ❌ `get_cdm_builder_methods('cdm.product.common.settlement.ResolvablePriceQuantity', 'build-root')` returns no matches.
   - ✅ But `cdm.product.common.settlement.ResolvablePriceQuantity` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

10. **Missing `cdm.event.common.TradeIdentifier` builder method evidence for `build-root`**  
    - ❌ Recipe lists `build-root`.
    - ❌ `get_cdm_builder_methods('cdm.event.common.TradeIdentifier', 'build-root')` returns no matches.
    - ✅ But `cdm.event.common.TradeIdentifier` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

11. **Missing `cdm.base.staticdata.identifier.AssignedIdentifier` builder method evidence for `build-root`**  
    - ❌ Recipe lists `build-root`.
    - ❌ `get_cdm_builder_methods('cdm.base.staticdata.identifier.AssignedIdentifier', 'build-root')` returns no matches.
    - ✅ But `cdm.base.staticdata.identifier.AssignedIdentifier` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

12. **Missing `cdm.base.staticdata.party.Party` builder method evidence for `build-root`**  
    - ❌ Recipe lists `build-root`.
    - ❌ `get_cdm_builder_methods('cdm.base.staticdata.party.Party', 'build-root')` returns no matches.
    - ✅ But `cdm.base.staticdata.party.Party` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

13. **Missing `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty` builder method evidence for `build-root`**  
    - ❌ Recipe lists `build-root`.
    - ❌ `get_cdm_builder_methods('cdm.base.staticdata.party.metafields.ReferenceWithMetaParty', 'build-root')` returns no matches.
    - ✅ But `cdm.base.staticdata.party.metafields.ReferenceWithMetaParty` builder includes `.build()` — not in `approved-cdm-api-contract.json`.

---

## Decision

Decision: **NEXT_ROUND_REQUIRED**