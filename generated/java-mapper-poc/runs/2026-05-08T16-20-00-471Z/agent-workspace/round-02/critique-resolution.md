## Critique Review Analysis & Decision

### Summary of Tool Results

| # | Critique Item | Tool Evidence | Valid? | Reason |
|---|---------------|---------------|--------|--------|
| 1 | **MapTradeState citation** | ✅ `get_rosetta_function("MapTradeState")` → found; block `func:ingest-fpml-confirmation-tradestate-func.rosetta:MapTradeState` exists | ✅ **Valid (but context-sensitive)** | `MapTradeState` takes `fpml.Trade` (not `fxSingleLeg`). The plan must clarify that `fxSingleLeg` → `Trade` is not direct. |
| 2 | **AdjustableOrRelativeDate usage** | ❌ `get_cdm_java_class('cdm.base.datetime.AdjustableOrRelativeDate')` → blocked; `get_cdm_builder_methods(...set-trade...)` → no matches | ✅ **Valid** | `AdjustableOrRelativeDate` is not in the approved contract list. The plan incorrectly assumes it's usable without `resolve_cdm_concept`. |
| 3 | **MapTradeIdentifierList overreach** | ✅ `MapTradeIdentifierList` exists and is called in `MapTrade`, but not directly from FX single-leg recipes | ✅ **Valid** | FX single-leg does not call `MapTradeIdentifierList`. Trade identifiers must come via `MapTrade` → `Trade.tradeIdentifier`, not direct FX recipe. |
| 4 | **`set-trade` builder method** | ❌ `get_cdm_builder_methods(intent="set-trade", for=TradeState)` → no matches | ✅ **Valid** | Contract explicitly blocks unapproved builder methods. Plan incorrectly assumes `TradeState.setTrade(...)` exists. |
| 5 | **Missing top-level FX Rosetta function** | ✅ `MapTrade`, `MapTradeState`, `MapDataDocumentToTradeState` exist and call fragment functions | ❌ **Invalid** | The evidence *does* show a valid top-level function path: `MapDataDocumentToTradeState` → `MapTradeState` → `MapTrade` → fragment functions. The plan is *not* missing a top-level function—it's just poorly described. |

---

### Key Clarifications from Tool Evidence

1. **Top-level FX mapping *is* supported**  
   - `MapDataDocumentToTradeState` is the actual entry point for `DataDocument.trade` (which includes `fxSingleLeg` in XML).
   - It calls `MapTradeState(fpmlTrade, fpmlPartiesAndAccountsModel)`, which in turn calls `MapTrade(...)`.
   - `MapTrade` internally calls `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegCounterpartyList`, etc.

2. **TradeState construction does *not* use `set-trade(...)`**  
   - `TradeState` is built directly from its builder; `Trade` is set *in the same builder step* via `TradeState.trade = ...`, not via `setTrade(...)` (which doesn’t exist).

3. **Trade identifiers are included in `MapTrade`**  
   - `MapTrade` calls `MapTradeIdentifierList(fpmlTrade -> tradeHeader)` internally — no separate call is needed.

4. **Date handling must use approved classes only**  
   - The approved contract contains:  
     `cdm.base.datetime.AdjustableOrAdjustedDate`  
     `cdm.base.datetime.AdjustableOrRelativeDateOrExpression`  
   - `cdm.base.datetime.AdjustableOrRelativeDate` is **not approved**. The plan should use `AdjustableOrAdjustedOrRelativeDate` or `AdjustableOrRelativeDateOrExpression` per `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate`.

---

### Valid Critique Items (to fix)

| # | Item | Fix Required |
|---|------|--------------|
| 2 | `AdjustableOrRelativeDate` | Replace with `cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate` or resolve via `resolve_cdm_concept('adjustable-date')`. |
| 4 | `set-trade` builder method | Remove all references to `set-trade(...)` or `setTrade(...)`. Build `TradeState` with a single builder call: `TradeState.builder().trade(...).build()`. |
| 3 | `MapTradeIdentifierList` | Cite its *internal* use in `MapTrade`, not as a direct FX recipe. E.g., “via `MapTrade` → `Trade.tradeIdentifier`” instead of “Executes `MapTradeIdentifierList` Rosetta function”. |

---

### Invalid Critique Items (to dismiss)

| # | Item | Why Dismissed |
|---|------|----------------|
| 1 | `MapTradeState` not used for FX | `MapTradeState` *is* the correct high-level function — the plan only needs to clarify the input chain: `fxSingleLeg` → `fpml.Trade` → `MapTradeState`. |
| 5 | Missing top-level function | `MapDataDocumentToTradeState` exists and is FX-compatible. The plan only needs to reference it explicitly (e.g., in traceability). |

---

### Required Revisions for Next Round

1. **Update traceability**  
   Replace:  
   > *"Build `TradeState` from `Trade` using Rosetta function `MapTradeState`"*  
   With:  
   > *"Build `TradeState` from `fpml.Trade` via `MapTradeState` (invoked by `MapDataDocumentToTradeState`), which internally calls fragment functions including `MapFxSingleLegNonTransferableProduct`, `MapTrade`, `MapTradeIdentifierList`, and `MapFxSingleLegCounterpartyList`."*

2. **Remove unapproved class references**  
   - Replace all uses of `cdm.base.datetime.AdjustableOrRelativeDate` with:  
     `cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate` (approved)  
     or resolve via `resolve_cdm_concept('adjustable-date')`.

3. **Rephrase builder usage**  
   Remove all mentions of `set-trade(...)` or `setTrade(...)`.  
   Use:  
   > *"`TradeState` is constructed in a single builder step with `TradeState.builder().trade(...).build()`."*

4. **Reframe trade identifiers**  
   - Remove: *"Executes `MapTradeIdentifierList` Rosetta function"*  
   - Add: *"Populated internally by `MapTrade` → `Trade.tradeIdentifier` via `MapTradeIdentifierList`."*

---

### Deterministic Validation Check

✅ **plan-validation.md passed**  
✅ **00-product-scope.json matches runtime fixtures**  
✅ **approved-cdm-api-contract-summary.md has all required classes**  
✅ **semantic-recipes.md includes `fx-single-leg-tradestate`**  
❌ **Current plan misstates class and method use per contract**

---

### Final Decision: **NEXT_ROUND_REQUIRED**

**Blocking issues: 3 (2 invalid, 1 valid + 2 correctable)**  
- **Critical (must fix)**: Unapproved class (`AdjustableOrRelativeDate`) and unapproved builder method (`set-trade`).  
- **Correctable (with minor wording)**: Overstated use of `MapTradeIdentifierList`; missing reference to `MapDataDocumentToTradeState` entry point.

The plan is *almost correct* but fails machine contract checks. The planner must fix the two valid blocking items above and clarify traceability to avoid overclaiming.

**Next round must:**
1. Replace unapproved classes/methods per this review.
2. Explicitly cite `MapDataDocumentToTradeState` as the top-level FX single-leg entry.
3. Delete all references to `set-trade(...)` or `setTrade(...)`.
4. Correct `AdjustableOrRelativeDate` → approved variant.
5. Reframe `MapTradeIdentifierList` as internal to `MapTrade`.

Once fixed, this becomes a candidate for acceptance.

--- 

Decision: **NEXT_ROUND_REQUIRED**