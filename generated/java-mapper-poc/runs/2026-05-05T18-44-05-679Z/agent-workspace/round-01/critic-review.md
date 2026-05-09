## Plan Review

### Blocking Issues

#### 1. Missing CDM Java classes used in Rosetta FX mapping logic

The plan references `ResolvablePriceQuantity`, `SettlementPayout`, `CashSettlementTerms`, `SettlementTerms`, `SettlementTypeEnum`, `PartyReference`, `PriceSchedule`, `PriceTypeEnum`, `Asset`, `Cash`, and `PartyReference`. While some of these are found in the jar (e.g., `cdm.product.common.settlement.ResolvablePriceQuantity`, `cdm.product.template.SettlementPayout`, `cdm.product.common.settlement.CashSettlementTerms`, `cdm.product.common.settlement.SettlementTerms`, `cdm.product.common.settlement.SettlementTypeEnum`, `cdm.observable.asset.PriceSchedule`, `cdm.base.staticdata.asset.common.Asset`, `cdm.base.staticdata.asset.common.Cash`), others are **missing**:

- `cdm.base.staticdata.party.PartyReference`: not present in `cdm-java-6.7.0.jar`.  
- `cdm.base.math.PriceSchedule`: not present in `cdm-java-6.7.0.jar`.  
- `cdm.base.math.PriceTypeEnum`: not present; only `cdm.observable.asset.PriceTypeEnum` exists.

The Rosetta function `MapFxCoreDetailsModelToSettlementPayout` references `ResolvablePriceQuantity`, but the available class is `cdm.product.common.settlement.ResolvablePriceQuantity`, and no equivalent in `cdm.base.math`. The Rosetta function uses the type as a nested object inside `SettlementPayout`, and while the plan correctly maps to `cdm.product.template.SettlementPayout`, Rosetta expects `SettlementPayout.SettlementPayout` containing `ResolvablePriceQuantity`. This may require additional internal handling or model generation.

#### 2. Unsupported raw JSON construction

The plan states:

> The generated Java will use Rosetta Java model objects as its internal representation.

This is acceptable **only if** it uses builder APIs (not raw JSON) to construct the CDM model. However, the plan does **not** explicitly forbid or prevent internal raw JSON construction (e.g., using Jackson to build JSON then deserialize), which is a violation of the policy requiring runtime-safe CDM model object usage.

#### 3. No explicit claim of using Rosetta functions for FX single-leg mapping

The plan describes mapping responsibilities but **does not explicitly cite** that the mapping logic is derived directly from Rosetta functions (e.g., `MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`) in the mapping design section. The plan *mentions* Rosetta functions in passing, but lacks a clear statement that the implementation will rely on them as the source of truth for Java mapping logic.

#### 4. FX product-group scope not fully supported by runtime fixtures

The plan states it is scoped to `fx-single-leg`, which is correct per `00-product-scope.json`, and correctly identifies the runtime fixtures. However, the plan includes a broad narrative description of FX single-leg products (e.g., “FX spot trades, FX forwards, non-deliverable forwards”) without any **fixture gate** or validation constraint to ensure only runtime-supported fixtures (`fx-ex01` through `fx-ex07`) are tested. This risks overreach into untested behavior (e.g., if future fixes introduce unsupported variants like FX swaps or digital options).

---

### Non-blocking Concerns

#### 1. Missing-class notes should be marked as "blocked for this run"

The plan’s “Missing Classes” section is informative but does not **block** those missing classes from the scope of this run. This should be reworded: if the Rosetta mapping logic for FX single-leg requires `PartyReference`, `PriceSchedule`, or `PriceTypeEnum`, and those are absent from the jar, then the mapping of those specific subfields must be deferred or stubbed, and the plan should acknowledge this limitation explicitly.

#### 2. Java package structure lacks evidence backing

The plan proposes `org.finos.cdm.fx.mapper.singleleg`, but does not provide evidence that this structure is required or recommended by Rosetta, CDM Java, or preflight. The CDM Java API uses builder patterns from deep namespaces (e.g., `cdm.event.common.Trade$TradeBuilder`), so the mapping service package hierarchy is not determined by CDM naming conventions.

#### 3. Test strategy is high-level

Unit tests for each Rosetta function “in isolation” is vague. The plan does not specify how mapping tests would be grounded in fixture data or assert CDM model object equality. Runtime tests are mentioned, but no mechanism (e.g., `assertEquals`, serialization round-trip) is proposed.

---

### Decision

**NEXT_ROUND_REQUIRED**

The plan must be revised to:

1. Explicitly cite Rosetta functions (e.g., `MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`) as the *source* for Java mapping logic.
2. Block use of raw JSON construction in internal CDM representation.
3. Acknowledge missing CDM classes (`PartyReference`, `PriceSchedule`, `PriceTypeEnum`) and either:
   - State how the mapping will be adjusted to avoid them (e.g., use alternative types or skip unsupported fields), or
   - Deferring those parts to a future phase with evidence.
4. Add a runtime fixture gate: “Only `fx-ex01` through `fx-ex07` are in scope; anything beyond must fail validation.”
5. Remove or re-word the “FX single-leg” narrative to align strictly with the fixture IDs in the machine-checked section.

Until these are addressed, the plan is not safe to execute.

Decision: NEXT_ROUND_REQUIRED