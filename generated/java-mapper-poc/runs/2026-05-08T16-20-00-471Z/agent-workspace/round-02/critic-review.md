[tool calls blocked]

## Review Summary

### Blocking Issues

1. **Unsupported Rosetta function cited**  
   - Claims: *"Build `TradeState` from `Trade` using Rosetta function `MapTradeState` (a function you did not provide evidence for)."*  
   - Evidence shows `MapTradeState` **was successfully retrieved**, but it is **not in scope for single-leg FX mapping** — it is a generic top-level orchestrator and does **not** produce FX-specific `Product`, `ContractDetails`, or party structures.  
   - However, the critical omission is that **no Rosetta function mapping FX single-leg FpML to `Trade` (or `TradeState`) exists** — only fragment-level functions like `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegCounterpartyList`, etc., are provided.  
   - The plan falsely implies that these fragment functions can be directly chained into a `TradeState`, when in fact **a missing top-level function exists**: the plan provides **no Rosetta function that accepts `fxSingleLeg` FpML and returns `TradeState`**, nor does it cite a Java-entrypoint function (e.g., `MapTrade`) that would coordinate these.

2. **Approved CDM class not in contract but used**  
   - The plan claims use of `cdm.base.datetime.AdjustableOrRelativeDate` (for date handling), but this class **is not listed** in `approved-cdm-api-contract-summary.md` (only `cdm.base.datetime.AdjustableOrAdjustedDate` and `cdm.base.datetime.AdjustableOrRelativeDateOrExpression` are present in the full CDM, but the exact `AdjustableOrRelativeDate` is absent from the *approved* 38-class list).  
   - `get_cdm_java_class('cdm.base.datetime.AdjustableOrRelativeDate')` is explicitly blocked by the contract rules and not resolved via concept.

3. **`MapTradeIdentifierList` cited but not used in FX single-leg Rosetta**  
   - The plan states: *"Executes `MapTradeIdentifierList` Rosetta function"*.  
   - Evidence shows `MapTradeIdentifierList` exists, but it takes **`fpml.TradeHeader`** and outputs **`TradeIdentifier (0..*)`**, and is used in generic header processing.  
   - The FX single-leg Rosetta functions (`ingest-fpml-confirmation-product-fxsingleleg-func.rosetta`, etc.) **do not directly call** `MapTradeIdentifierList`; they expect the caller to supply a full `Trade` or `TradeState`, and do not define how trade identifiers are populated for FX.  
   - This is **overreach**: the plan implies deterministic mapping via a named function, but no FX-specific traceability path is provided.

4. **`set-trade` builder method claimed but not approved**  
   - Claim: *"Use `get_cdm_builder_methods` for exact method details before using a builder method"* is contradicted by plan text that explicitly cites *"Build `TradeState` from `Trade` using Rosetta function `MapTradeState`"* and assumes a `set-trade` method exists on `TradeState.Builder`.  
   - Evidence shows:  
     - `get_cdm_builder_methods(intent="set-trade", for=TradeState)` → *No approved builder methods matched*  
     - `get_cdm_builder_methods(intent="set-trade", for=Trade)` → *No approved builder methods matched*  
   - This means **neither `Trade` nor `TradeState` has a `set-trade(...)` builder method in the approved contract** — the plan assumes construction logic not permitted by the contract.

5. **Missing `Trade`-level Rosetta function for FX single-leg**  
   - The contract and evidence-index.md list **only fragment-level Rosetta functions** (e.g., `MapFxSingleLegCounterpartyList`, `MapFxSingleLegEconomicTerms`).  
   - There is **no `MapTrade` or `MapFxSingleLegTrade` function listed** in `semantic-recipes.md` or `rosetta-fx-pack` that takes `fxSingleLeg` and returns `Trade`/`TradeState`.  
   - Without such a function, the plan’s claim that *"The implementation will follow Rosetta function traceability"* is **unsupported** — no source Rosetta function exists to trace back to.

### Non-blocking Concerns

1. **Java class names (e.g., `FxSingleLegMapper`, `TradeBuilder`) are speculative**  
   - These are **not mandated** by `java-shell-contract.md`, which only requires `GeneratedFpmlToCdmMapper` and does not forbid modular classes.  
   - However, since no exact evidence (preflight, CDM index) verifies these are CDM types, they should be labeled as **internal helper classes**, not CDM types.

2. **Missing `MapFxCoreDetailsModelToSettlementPayout` evidence for FX**  
   - The function is cited in Rosetta areas, but `get_rosetta_function("MapFxCoreDetailsModelToSettlementPayout")` was not executed — and even if it exists, its input/output types for **FX** (not generic `coreDetailsModel`) must be verified.  
   - Not blocking *yet*, but should be explicitly tested per fixture.

### Deterministic Validation (per order)

- ✅ **Deterministic validation**: In-scope groups and runtime fixtures match `00-product-scope.json` and `run_config`.
- ✅ **Product scope**: Confirmed `fx-single-leg` is current implementation group; out-of-scope groups explicitly excluded.
- ✅ **Runtime fixtures**: All 7 fixtures in `run_config` are cited.
- ✅ **Java shell contract**: Generated package, main class, interface, and shell-owned file restrictions are correct.
- ⚠️ **Rosetta evidence coverage**: Areas listed match `java-documentation-readiness.md`, but lack top-level FX `Trade`-level function evidence → **critical gap**.
- ✅ **Approved API contract usage**: Plan cites `approved-cdm-api-contract-summary.md` but violates its rules (overreaches on classes and methods).
- ⚠️ **Semantic recipe coverage**: Only `fx-single-leg-tradestate` is referenced, but no recipe body confirms how fragment functions compose into `TradeState` — missing proof of integration.
- ✅ **Generated file ownership**: Plan correctly restricts implementation to `com.fpml.cdm.fx.mapper.generated`.
- ⚠️ **Tests/gates**: Integration tests plan matches fixtures, but traceability tests will fail if Rosetta traceability is unsupported.
- ✅ **Unsupported behavior**: Explicitly listed unsupported groups and products.
- ❌ **Traceability**: Fails — no top-level Rosetta function for FX single-leg → `TradeState` construction cannot be traced.

---

Decision: **NEXT_ROUND_REQUIRED**

The plan must:
1. Identify the **exact Rosetta function** (with block ID) that accepts `fxSingleLeg` and returns `Trade` or `TradeState`.
2. Remove all references to unapproved classes (`AdjustableOrRelativeDate`) and builder methods (`set-trade`) until proven via `get_cdm_java_class` + `approved-cdm-api-contract-summary.md`.
3. either:
   - cite a single FX-specific `MapTrade`-style function, **or**
   - explicitly define a Java composition pattern (with traceability to each fragment Rosetta function) that avoids assuming non-existent top-level builders.
4. Revalidate every Rosetta function cited with `get_rosetta_function`, not just summary mentions.

Do not proceed until top-level FX single-leg Rosetta mapping evidence is confirmed.