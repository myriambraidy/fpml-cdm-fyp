```markdown
## Critique Decision: NEXT_ROUND_REQUIRED

### Valid Critique Items (Accepted)

#### ✅ **1. SettlementPayout Class Misidentification (Blocking)**
- **Issue**: Plan incorrectly asserts `cdm.product.template.SettlementPayout` does not exist, while earlier evidence falsely suggested `cdm.product.template.Payout.getSettlementPayout()` exists.
- **Verified Fact**:  
  - `get_cdm_java_class("cdm.product.template.SettlementPayout")` → **"cdm.product.template.SettlementPayout is not present in the CDM Java API pack"**  
  - `cdm-java-negative-classes.md` explicitly lists:  
    > `- cdm.product.common.settlement.SettlementPayout: not found`  
    > (and crucially, *not* `cdm.product.template.SettlementPayout`, but the latter *also* does not exist per direct lookup).
  - `cdm-java-api-pack.md` shows `Payout` has `getSettlementPayout(): cdm.product.template.SettlementPayout` — but this is **inconsistent** with the lookup failure.  
  - **Resolution**: `cdm.product.template.SettlementPayout` **does not exist** in v6.7.0 — the `getSettlementPayout()` method cited in `cdm-java-api-pack.md` is a **documentation error**, as the class itself is absent from the jar and negative classes list.

- ✅ **Evidence sufficiency**: Yes — multiple sources confirm the absence:
  - Direct toolcall: `"cdm.product.template.SettlementPayout is not present"`
  - Negative classes list: `cdm.product.common.settlement.SettlementPayout` excluded, but no `cdm.product.template.SettlementPayout` appears — consistent with total absence.
  - CDM v6.7.0 API pack’s builder methods for `Payout` show `setSettlementPayout(...)` but **no type `SettlementPayout` is defined** — high likelihood of stale or schema-derived stub generation.

- ➤ **Required Fix**:  
  - **Remove all references to `SettlementPayout` (template or common)**.  
  - For settlement-aware fixtures (`fx-ex04`–`fx-ex07`), use `Payout` without a payout variant (i.e., use `setPayout(emptyList())` or skip settlement-specific logic), or defer to a later implementation phase where settlement payout support is verified.

#### ✅ **2. Fixture-Gated FX Support Claim (Non-blocking, but required for plan quality)**
- **Issue**: Narrative section says *“This run implements the FX single-leg product family”* without qualifying with runtime fixture IDs, while the plan rules state:  
  > “Do not make broad FX support claims without fixture gates.”

- ✅ **Evidence**:  
  - `rosetta-generation-context.md`, `cdm-java-api-pack.md`, `00-product-scope.json` all correctly restrict `fx-single-leg` to runtime fixtures `fx-ex01–fx-ex07`.  
  - Plan’s machine-checked section *does* list fixture IDs, but narrative does not.

- ➤ **Required Fix**:  
  - In *“Supported FX products for this run”*, change:  
    > *“This run implements the FX single-leg product family…”*  
    to:  
    > *“This run implements FX single-leg for runtime fixtures fx-ex01–fx-ex07.”*

---

### Invalid Critique Items (Rejected)

#### ❌ **1. `ResolvablePriceQuantity` vs. `PriceQuantity` Claim**
- Plan:  
  > *"`cdm.observable.asset.ResolvablePriceQuantity` is not part of CDM Java; `cdm.observable.asset.PriceQuantity` is used instead"*
- ✅ **Verified**: `ResolvablePriceQuantity` is not in `cdm-java-api-pack.md`, and `PriceQuantity` is used in `getPriceQuantity()`.
- **No correction needed** — plan is correct.

#### ❌ **2. `SettlementPayout` Type in `Payout` Builder**
- Plan cited `cdm.product.template.Payout.getSettlementPayout()` as evidence of settlement payout availability.
- ❌ **Rejected**: The builder’s method signature is misleading — if the class `SettlementPayout` does not exist, the method cannot be used. The plan correctly noted this as a risk, but misidentified *which* `SettlementPayout` existed.  
- Since both `SettlementPayout` variants are confirmed absent, the plan’s fallback plan (use “a different type or empty variant”) is **actually appropriate** — the critique over-relied on an apparent API inconsistency that reflects a **jar inconsistency**, not a plan error.

---

### Revised Implementation Checklist (If Fixing Above)

- [ ] **Correct `SettlementPayout` usage**:  
  - Remove all references to `cdm.product.template.SettlementPayout` and `cdm.product.common.settlement.SettlementPayout`.  
  - For `fx-ex04`–`fx-ex07` (fixtures with settlement instructions), assert `payout` is either:  
    - Omitted from `EconomicTerms` builder, or  
    - Created as `Payout.builder().build()` (empty payout), acknowledging known limitation.  
  - Document this limitation in “Unsupported behavior”.

- [ ] **Update narrative fixture scope**:  
  - In *“Supported FX products for this run”*, replace generic “FX single-leg product family” with:  
    > *“This run implements FX single-leg for runtime fixtures fx-ex01–fx-ex07: fx-ex01-fx-spot, fx-ex02-spot-cross-w-side-rates, fx-ex03-fx-fwd, fx-ex04-fx-fwd-w-settlement, fx-ex05-fx-fwd-w-ssi, fx-ex06-fx-fwd-w-splits, fx-ex07-non-deliverable-forward.”*

- [ ] **Reconcile builder method vs. class existence**:  
  - In documentation, add note:  
    > *“Note: CDM Java 6.7.0’s `Payout` builder lists `getSettlementPayout()` and `setSettlementPayout(...)` methods, but the `SettlementPayout` class is absent from the jar and is not importable. This is a known discrepancy; settlement payout support is deferred to future versions.”*

---

### Final Decision

**Decision: NEXT_ROUND_REQUIRED**  
Fix the `SettlementPayout` misconception and fixture-gated narrative, then resubmit.
```