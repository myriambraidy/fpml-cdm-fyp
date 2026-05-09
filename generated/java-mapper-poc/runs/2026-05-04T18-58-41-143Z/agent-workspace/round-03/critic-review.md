## Review Summary

**Plan evaluated:** planner-plan.md (Round 3)

---

### Blocking Issues

#### 1. **Unsupported CDM Class: `cdm.product.template.SettlementPayout`**
The plan explicitly notes: *"`cdm.product.common.settlement.SettlementPayout` is not part of CDM Java; **`cdm.product.template.SettlementPayout` also does not exist**"*, and that the implementation will build `Payout` with “a different type or an empty variant when settlement details are required”.

This claim **must be verified against CDM Java 6.7.0** because the toolcall output shows that:
- `cdm.product.template.Payout` **does** include:
  - `getSettlementPayout(): cdm.product.template.SettlementPayout`
  - `setSettlementPayout(SettlementPayout)`
  - `getOrCreateSettlementPayout(): SettlementPayout$SettlementPayoutBuilder`

And crucially, **the negative classes list does not contain `cdm.product.template.SettlementPayout`**, only `cdm.product.common.settlement.SettlementPayout`.

✅ **Verification**: `cdm.product.template.SettlementPayout` **exists** in the API pack, as confirmed by builder methods. This is an error in the plan.

➡️ This is a **blocking issue**, because if the plan intends to use `SettlementPayout` but believes it is missing, the mapping will be incomplete for settlement-relevant fixtures (fx-ex04–fx-ex07).

---

#### 2. **Lack of Fixture-Gated FX Support Claim**
The plan includes the section:

> **Supported FX products for this run**  
> This run implements the FX single-leg product family...

But elsewhere it says:
> “This run implements the FX single-leg product family…” without citing specific runtime fixture IDs per implementation group.

While the “Runtime supported fixtures (machine-checked)” section *does* list the correct 7 fixtures, the **narrative section above is not constrained by fixture IDs**, and instead relies on generic wording: *“FX single-leg product family”*, *“FX spot/fwd”*, etc.

➡️ This violates the rule: **“Do not make broad FX support claims without fixture gates.”**

This is **not a blocker** by itself, but must be corrected in tandem.

---

### Non-Blocking Concerns

#### 1. **Misattribution of `ResolvablePriceQuantity`**
The plan says:  
> *"`cdm.observable.asset.ResolvablePriceQuantity` is not part of CDM Java; `cdm.observable.asset.PriceQuantity` is used instead"*

✅ Verified via `cdm-java-api-pack.md`: `ResolvablePriceQuantity` is indeed absent — correct.

#### 2. **`Rosetta PriceSchedule` vs. CDM Java**
The plan correctly avoids `PriceSchedule` (not present) and uses `PriceQuantity`.

✅ Verified — correct.

#### 3. **Use of CDM Java API correctly limited**
The plan lists only allowed classes, correctly references builder methods (e.g., `setProduct`, `addCounterparty`), and avoids negative classes (except for the `SettlementPayout` error above). No raw JSON, no FpML Java classes.

✅ Correct.

#### 4. **Rosetta function citations**
The plan correctly maps Rosetta functions to mapping responsibilities, all of which are present in `rosetta-generation-context.md`.

✅ Correct.

#### 5. **Product-scope alignment**
✅ `fx-single-leg` is the correct implementation group (per `00-product-scope.json` and `currentImplementationGroup`).  
✅ Out-of-scope groups match `candidateNextGroups` and `productGroups`.  
✅ Non-FX fixtures excluded as required.

---

### Decision

**Blocking issue**: Use of non-existent `cdm.product.template.SettlementPayout` in settlement-aware fixtures (fx-ex04–fx-ex07). The class **exists**, and the plan’s denial is incorrect. This would lead to an incomplete implementation.

**Decision: NEXT_ROUND_REQUIRED**

Fix:
- Correct the plan to **use `cdm.product.template.SettlementPayout`** and its builder.
- Ensure fixtures requiring settlement (`fx-ex04`, `fx-ex05`, `fx-ex06`, `fx-ex07`) are mapped via `Payout.builder().setSettlementPayout(...)` as supported in the API.
- In narrative sections, attach FX coverage explicitly to the runtime fixture IDs (e.g., *“fx-ex01–fx-ex07”*) instead of generic terms like *“FX single-leg”*.

---