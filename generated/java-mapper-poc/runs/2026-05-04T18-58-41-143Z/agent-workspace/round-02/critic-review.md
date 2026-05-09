## Review

### Blocking Issues

1. **CDM Java class mismatch**:
   - Plan states `cdm.product.template.SettlementPayout` is used, and `cdm.product.common.settlement.SettlementPayout` is explicitly excluded as “not part of CDM Java”.
   - However, the `cdm-java-api-pack.md` clearly lists `cdm.product.common.settlement.SettlementPayout` as **Exists: yes** with package `cdm.product.common.settlement`, builder `SettlementPayout$SettlementPayoutBuilder`, and extensive builder methods (including `setPayerReceiver`, `setPriceQuantity`, `settlementTerms`, `underlier`, `settlementDate`, etc.).
   - The plan’s justification (“not found in cdm-java-6.7.0.jar”) contradicts the preflight file (`cdm-java-api-pack.md`) and the validator’s evidence. This is a **critical conflict** and invalidates the plan’s correctness.
   - Additionally, Rosetta generates `cdm.product.common.settlement.SettlementPayout` for `SettlementPayout` in CDM. Using `cdm.product.template.SettlementPayout` would be an unsupported usage (the `Payout` model supports `settlementPayout` as a union member, but the actual type is `SettlementPayout` from `cdm.product.common.settlement`).

2. **Runtime fixture evidence is incomplete**:
   - The plan references `cdm.observable.asset.ResolvablePriceQuantity` as unavailable and uses `cdm.observable.asset.PriceQuantity` instead. While the plan is correct that `ResolvablePriceQuantity` is not in the CDM Java API, the `cdm-java-api-pack.md` lists `cdm.observable.asset.ResolvablePriceQuantity` as **Exists: yes** in preflight with builder methods.
   - In the negative classes list, `cdm.observable.asset.ResolvablePriceQuantity` is correctly flagged, but the plan does not cite preflight `ResolvablePriceQuantity` as `Exists: yes` and does not explain the correct usage path.
   - Further, `cdm-java-api-pack.md` confirms `cdm.observable.asset.PriceQuantity` is available, but `cdm.product.common.settlement.SettlementPayout` is **also** available. The plan must use `cdm.product.common.settlement.SettlementPayout`.

3. **Rosetta function calls not supported by preflight**:
   - The plan cites Rosetta functions from `rosetta-generation-context.md` but does not validate the Rosetta output types (e.g., `Payout` vs `SettlementPayout`) against the CDM Java API pack.
   - The plan references `MapPayerReceiver`, `MapPayerReceiverModelToCounterpartyList`, etc., but does not cite the `GetRooSettaSnippets` or `GetRosettaCallGraph` to confirm they are supported for the current runtime fixtures. The plan should be updated to ensure Rosetta functions are available for the current runtime fixtures.

4. **Missing core CDM builder methods**:
   - The plan lists `Trade.builder()` usage and lists `setProduct`, `addCounterparty`, etc., as builder methods.
   - While the plan’s usage aligns with the `Trade` builder methods listed in `cdm-java-api-pack.md`, it does not cite specific `CDMTradeStateBuilder` methods required for `TradeState` and `Trade` assembly.
   - The plan should cite `Trade.builder()`, `TradeState.builder()`, `TradeState.setTrade`, `TradeState.setState`, and `Trade.addCounterparty`, etc., with evidence from `cdm-java-api-pack.md`.

### Non-blocking Concerns

1. **Evidence of XML parsing and DOM/StAX usage**:
   - The plan mentions XML parsing and DOM/StAX usage, but does not detail how to parse FpML without `FpmlFxSingleLeg` (which is forbidden).
   - The plan does not reference any internal DTOs or XML parser DTOs to map XML to CDM. It should reference the use of DOM/StAX parsing to extract XML elements and construct CDM objects directly.

2. **Usage of `PriceQuantity` and `Observable`**:
   - The plan mentions `cdm.observable.asset.PriceQuantity` but does not cite `cdm.observable.asset.Observable` usage or builder methods from `cdm-java-api-pack.md`.
   - The plan should reference `PriceQuantity.builder()`, `Observable.builder()`, and their builder methods for observables and price/quantity mapping.

3. **Test validation approach**:
   - The plan mentions unit tests for mapped functions and validation against expected CDM output, but does not reference the expected CDM JSON files (`data_to_learn_from/cdm_parallel/fx-derivatives/fx-ex01-fx-spot.json`, etc.) or validate against them.
   - The plan should reference the expected CDM JSON files and validate against them.

### Decision

- The plan contains **critical errors** in CDM Java class selection (`SettlementPayout` vs `cdm.product.common.settlement.SettlementPayout`).
- The plan incorrectly states `cdm.product.common.settlement.SettlementPayout` is not in CDM Java while the preflight file (`cdm-java-api-pack.md`) explicitly lists it as `Exists: yes`.
- The plan does not validate Rosetta functions or cite correct CDM Java builder methods for `Trade`, `TradeState`, `PriceQuantity`, and `Observable`.

**Decision: NEXT_ROUND_REQUIRED**