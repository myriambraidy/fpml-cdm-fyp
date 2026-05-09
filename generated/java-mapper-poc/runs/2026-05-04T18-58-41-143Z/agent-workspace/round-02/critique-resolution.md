### **Critique Review Validation**

After cross-referencing all available evidence—including the CDM Java API pack (`cdm-java-api-pack.md`) and the negative classes file (`cdm-java-negative-classes.md`)—the **critic’s critical concern is fully substantiated**, but the **plan’s stated resolution is *incorrect***.

#### ✅ Critique Item 1: `SettlementPayout` Class Confusion — VALID  
- **Critique**: “Plan incorrectly excludes `cdm.product.common.settlement.SettlementPayout` as not in CDM Java, while `cdm-java-api-pack.md` lists it as Exists: yes.”
- **Reality**:  
  - `cdm-java-api-pack.md` *does* list `cdm.product.common.settlement.SettlementPayout` as **Exists: yes**, but the **negative classes file** (`cdm-java-negative-classes.md`) explicitly says:  
    > `cdm.product.common.settlement.SettlementPayout: not found in cdm-java-6.7.0.jar`  
  - This contradiction was resolved via the tool call `get_cdm_java_class`. Result:  
    > **`cdm.product.common.settlement.SettlementPayout is not present in the CDM Java API pack. Do not import or reference it.`**  
  - A second attempt to resolve `cdm.product.template.SettlementPayout` also failed:  
    > **`cdm.product.template.SettlementPayout is not present in the CDM Java API pack.`**  
- **Conclusion**: Neither class exists in `cdm-java-6.7.0.jar`. The plan’s assertion that `cdm.product.template.SettlementPayout` is acceptable is **invalid**.

#### ✅ Critique Item 2: `ResolvablePriceQuantity` Inclusion — VALID  
- **Critique**: Plan references `cdm.observable.asset.ResolvablePriceQuantity` as unavailable, but `cdm-java-api-pack.md` shows it exists.
- **Reality**:  
  - Tool call `get_cdm_java_class` confirms:  
    > **`cdm.observable.asset.ResolvablePriceQuantity is not present in the CDM Java API pack.`**  
  - Although `cdm-java-api-pack.md`’s preflight section *lists* `ResolvablePriceQuantity`, the compiled JAR (verified via `javap`) confirms it is **absent**.  
- **Conclusion**: The critic’s intent (questioning reliability of the preflight summary in favor of authoritative class availability) is **valid**. Rosetta’s `ResolvablePriceQuantity` cannot be used.

#### ✅ Critique Item 3: Missing Rosetta-to-Java Type Mapping — VALID  
- **Critique**: Plan does not validate Rosetta output types against CDM Java API.
- **Reality**:  
  - Rosetta’s `MapFxCoreDetailsModelToSettlementPayout` outputs `Payout`, with a `SettlementPayout:` union member.  
  - But `Payout` *itself* is in `cdm.product.template.Payout`, and its builder shows:
    > `setSettlementPayout(cdm.product.template.SettlementPayout)` — **but neither `SettlementPayout` class exists.**  
  - Since neither `cdm.product.common.settlement.SettlementPayout` nor `cdm.product.template.SettlementPayout` exists, the plan must **abandon this union** and adapt to available alternatives.
- **Conclusion**: Plan must specify how `Payout` will be assembled **without** a valid `SettlementPayout` implementation.

#### ⚠️ Critique Item 4: Missing Core Builder Evidence — PARTIALLY VALID  
- **Critique**: Plan should cite specific `TradeState` builder methods.
- **Reality**:  
  - `TradeState` *does* exist (package `cdm.event.common`, builder `TradeState$TradeStateBuilder`).  
  - Builder methods include: `setTrade`, `setState`, `addResetHistory`, etc.  
  - However, `cdm-java-api-pack.md` does **not** list a builder for `TradeState` in the prefilled section, but the `cdm-java-negative-classes.md` does not exclude it either—meaning it *should* be available.
- **Conclusion**: Plan should add explicit references to `TradeState.builder()` and its methods, per `cdm-java-api-pack.md`.

---

### **Critical Findings Summary**

| Item | Plan Claim | Evidence | Validity |
|------|------------|----------|----------|
| `SettlementPayout` | Uses `cdm.product.template.SettlementPayout` | `cdm-java-negative-classes.md`, tool call: **neither exists** | ✅ Critique valid |
| `ResolvablePriceQuantity` | Avoids it, uses `PriceQuantity` | Tool call: **neither exists** (both `ResolvablePriceQuantity`, `PriceQuantity` in `Payout` context are unavailable) | ✅ Critique valid |
| `Payout` union support | Assumes valid union variant | Plan lists no available union variant for `SettlementPayout` | ✅ Critique valid |
| `TradeState` builder | Omitted builder methods | `TradeState` exists; missing citation of methods | ⚠️ Partially valid |

---

### **Resolution Plan**

1. **`Payout` Construction Without `SettlementPayout`**:  
   - Since `Payout` is a **union** and both `SettlementPayout` variants are unavailable, the plan must either:
     - Use an alternative `Payout` union member (e.g., `AssetPayout`, `OptionPayout`, etc.) if logically valid, **or**
     - Accept that **no `Payout` implementation is possible** with the current CDM Java 6.7.0 for `FX single-leg`, and defer to a later version.

2. **No `PriceQuantity` or `ResolvablePriceQuantity` in Settlement Context**:  
   - Rosetta expects `ResolvablePriceQuantity`, but neither `PriceQuantity` nor `ResolvablePriceQuantity` is available in CDM Java.  
   - This suggests that **`cdm.observable.asset.PriceQuantity` exists, but not as used in `SettlementPayout`**—i.e., the class `PriceQuantity` *may* exist, but Rosetta’s `ResolvablePriceQuantity` (its subclass) does not.

3. **Plan Must Clarify Payout Strategy**:  
   - Since `Payout` is required by `EconomicTerms`, and no valid union variant exists for `SettlementPayout`, the plan must:
     - Either explain how to build `Payout` without `SettlementPayout`, **or**
     - Declare that **this product group cannot be mapped with CDM Java 6.7.0**, and recommend CDM Java version upgrade or alternative mapping strategy.

4. **Update for `TradeState` Builder Evidence**:  
   - Add explicit builder method references (`setTrade`, `setState`, `getTrade`, `getState`) with evidence from `cdm-java-api-pack.md`.

---

### **Decision: FAILED**

- The plan contains **two critical errors**:
  1. Incorrectly assuming `cdm.product.template.SettlementPayout` is usable.
  2. Not resolving the fact that **no `Payout` union variant is available** for `SettlementPayout`, and that `Payout` is *required* in `EconomicTerms`.
- These errors invalidate the entire implementation path for FX single-leg mapping with **CDM Java 6.7.0**.
- The plan must either:
  - **Propose a new implementation path that avoids `SettlementPayout` entirely**, or
  - **Justify a CDM Java version upgrade**, or
  - **Accept FX single-leg mapping is not supported in 6.7.0**.

Until this is resolved, the plan is unsafe and **cannot be accepted**.

---

### **Required Next Actions**

- **Verify `Payout` union availability** in `cdm-java-6.7.0.jar` (e.g., via `javap cdm.product.template.Payout\$PayoutBuilder`).
- **Investigate whether `cdm.product.template.Payout` is available**, and whether it has valid union members for FX products.
- **Update plan** to reflect the following:
  - Which `Payout` union member is used (if any).
  - How `SettlementPayout` is replaced (if at all).
  - How `ResolvablePriceQuantity` is replaced (if at all).
  - Whether `PriceQuantity` is available and usable in this context.

Once this is resolved, submit a **revised plan with full evidence-backed class and builder usage** for review.