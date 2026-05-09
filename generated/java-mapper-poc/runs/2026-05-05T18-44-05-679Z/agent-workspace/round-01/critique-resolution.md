# Critique Review Response and Decision

## Validated Critique Items

### ✅ Item 1: `cdm.base.staticdata.party.PartyReference` is missing  
**Status: VALID**  
Evidence: `get_cdm_java_class` confirms `cdm.base.staticdata.party.PartyReference` is not present in `cdm-java-6.7.0.jar`, and no same-simple-name candidate exists.  
**Action required**: Do not use `PartyReference`; rely on `Party` (which *is* available) for referenced party identification.

### ✅ Item 2: `cdm.base.math.PriceSchedule` is missing  
**Status: VALID**  
Evidence: `get_cdm_java_class` returns exact-class-not-found for `cdm.base.math.PriceSchedule`. Candidate `cdm.observable.asset.PriceSchedule` *is* available, but cannot be used interchangeably—different packages, different metadata semantics.  
**Action required**: Do not expect `PriceSchedule` from `cdm.base.math`. Use `cdm.observable.asset.PriceSchedule` only if its metadata constraints match fixture expectations.

### ✅ Item 3: `cdm.base.math.PriceTypeEnum` is missing  
**Status: VALID**  
Evidence: `get_cdm_java_class` returns exact-class-not-found for `cdm.base.math.PriceTypeEnum`. Candidate `cdm.observable.asset.PriceTypeEnum` exists but belongs to a different package and may not be assignment-compatible.  
**Action required**: Do not use `cdm.base.math.PriceTypeEnum`. Defer price-type-specific logic or use enum strings pending verification.

### ✅ Item 4: `cdm.observable.asset.ResolvablePriceQuantity` is missing  
**Status: VALID**, but a workable alternative exists  
Evidence: Exact class missing; available candidate is `cdm.product.common.settlement.ResolvablePriceQuantity`, confirmed present and with suitable builder support.  
**Action required**: Replace all references to `ResolvablePriceQuantity` in Rosetta function `MapFxCoreDetailsModelToSettlementPayout` with `cdm.product.common.settlement.ResolvablePriceQuantity`.

### ✅ Item 5: `cdm.product.template.SettlementPayout` is the correct replacement  
**Status: VALID**  
Evidence: `get_cdm_java_class` confirms `cdm.product.template.SettlementPayout` exists and *accepts* `cdm.product.common.settlement.ResolvablePriceQuantity` via `.setPriceQuantity(...)`.  
**Action required**: Use `cdm.product.template.SettlementPayout` as the root payout type, and embed `cdm.product.common.settlement.ResolvablePriceQuantity` where Rosetta references `SettlementPayout`.

### ✅ Item 6: `cdm.product.template.CashSettlementTerms` is missing  
**Status: VALID**, but available replacement  
Evidence: Exact class not found; candidate `cdm.product.common.settlement.CashSettlementTerms` exists and is complete (verified builder methods: `setValuationMethod`, `setValuationDate`, etc.).  
**Action required**: Use `cdm.product.common.settlement.CashSettlementTerms`.

### ✅ Item 7: `cdm.product.template.SettlementTerms` is missing  
**Status: VALID**, but available replacement  
Evidence: Exact class not found; candidate `cdm.product.common.settlement.SettlementTerms` exists and supports `CashSettlementTerms` and `settlementType: SettlementTypeEnum`.  
**Action required**: Use `cdm.product.common.settlement.SettlementTerms`.

### ✅ Item 8: `cdm.product.template.SettlementTypeEnum` is missing  
**Status: VALID**, but available replacement  
Evidence: Exact class not found; candidate `cdm.product.common.settlement.SettlementTypeEnum` exists (confirmed with `values()`, `valueOf()`, etc.).  
**Action required**: Use `cdm.product.common.settlement.SettlementTypeEnum`.

### ✅ Item 9: No explicit ban on raw JSON construction  
**Status: VALID**  
Plan does *not* explicitly forbid Jackson-based JSON construction as internal representation.  
**Action required**: Add a clause: “All internal processing must use CDM Java builders (`…$…Builder`), not intermediate JSON serialization/deserialization.”

### ✅ Item 10: Missing explicit Rosetta-function attribution  
**Status: VALID**  
Plan describes mapping *tasks* but does not explicitly assert: “All mapping logic is derived from and must exactly reproduce the semantics of Rosetta functions in `rosetta-generation-context.md`.”  
**Action required**: Add an explicit section: “Source of truth for mapping logic: Rosetta functions `MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`, and other functions in `rosetta-generation-context.md`.”

---

## Rejection of Critique Items

### ❌ Item: Java package structure needs evidence  
**Reason for rejection**: Package structure is design choice, not blocking dependency. CDM Java does not mandate `org.finos.cdm.fx.mapper`. This item is non-blocking and can be finalized during implementation.

### ❌ Item: Test strategy is vague  
**Reason for rejection**: Test design is out of scope for this planning round; only required that testability is ensured (e.g., by using public builder APIs). Vagueness is acceptable at planning stage.

### ❌ Item: “FX single-leg” narrative risks overreach  
**Reason for rejection**: The “machine-checked” section explicitly restricts scope to the 7 runtime fixture IDs. The narrative is explanatory only and does not override the machine-checked gate.

---

## Implementation Checklist (Revised)

Before execution, the planner must incorporate the following into the plan:

1. **Root type correction**:  
   - Use `cdm.product.template.SettlementPayout` as the top-level payout container (no change).  
   - Use `cdm.product.common.settlement.ResolvablePriceQuantity` for price/quantity fields inside `SettlementPayout`.

2. **Settlement types**:  
   - Replace `cdm.product.template.SettlementTypeEnum`, `SettlementTerms`, `CashSettlementTerms` with their `cdm.product.common.settlement.*` equivalents.

3. **Missing fields**:  
   - `PartyReference`, `cdm.base.math.PriceSchedule`, `cdm.base.math.PriceTypeEnum` are **not used**.  
   - Where Rosetta references these, map to `Party`, `String`, or omit.

4. **Construction policy**:  
   - All mapping logic must construct objects exclusively via CDM Java builders (`Foo$FooBuilder`), *not* via JSON serialization/deserialization.

5. **Rosetta-function attribution**:  
   - Add an explicit section:  
     > “This implementation strictly follows the Rosetta function semantics documented in `rosetta-generation-context.md`. Each mapping step corresponds to a Rosetta function definition; where Rosetta is silent or ambiguous, builder APIs are used, but only if they preserve the semantic intent of the Rosetta function.”

6. **Fixture gate**:  
   - Keep the existing machine-checked list of runtime fixture IDs, and add:  
     > “Any fixture not in the above machine-checked list will cause a validation failure; no extended FX single-leg variants are supported in this run.”

---

## Decision: ACCEPTED

The plan, once revised per the Implementation Checklist above, is safe to execute.

**Required conditions before execution**:
- All CDM class names updated to use available `cdm.product.common.settlement.*` types where `cdm.product.template.*` was referenced.
- `PartyReference`, `cdm.base.math.PriceSchedule`, `cdm.base.math.PriceTypeEnum` removed from implementation plan.
- JSON construction policy explicitly banned.
- Rosetta functions cited as the sole source of mapping semantics.
- Fixture IDs strictly limited to the 7 runtime-supported IDs.

No further rounds are needed for wording, citation, or clarification issues once these conditions are met.

✅ **Ready for implementation** (planner’s next revision must apply the checklist).