# Round 2 Summary

Decision: UNKNOWN

## Planner Focus

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Critic Findings

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

## Resolution Notes

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
