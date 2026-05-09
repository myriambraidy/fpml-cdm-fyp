[tool calls cancelled]

## Plan Review

### ✅ Implementation scope (machine-checked)

**In scope (implementation groups):**
- `fx-single-leg` — matches `currentImplementationGroup` and `productGroups[].group` for fx-single-leg.

**Explicitly out of scope (implementation groups):**
- `non-fx` — matches `productGroups[].group == "non-fx"` and `allowNonFxExpansion == false`.

**✅ Correct and sufficient.**

---

### ✅ Runtime supported fixtures (machine-checked)

The plan lists **exactly** the runtime fixture IDs defined in `run_config.runtimeFixtures`:
- `fx-ex01-fx-spot`
- `fx-ex02-spot-cross-w-side-rates`
- `fx-ex03-fx-fwd`
- `fx-ex04-fx-fwd-w-settlement`
- `fx-ex05-fx-fwd-w-ssi`
- `fx-ex06-fx-fwd-w-splits`
- `fx-ex07-non-deliverable-forward`

**✅ Exactly matches evidence-index.md and `run_config.runtimeFixtures`.**

---

### ⚠️ CDM Class Usage – Blocking Issues

| Claimed CDM class                     | Status (per cdm-java-api-pack.md / tool calls) | Issue |
|--------------------------------------|-----------------------------------------------|-------|
| `cdm.base.math.PriceSchedule`        | Not available (`PriceSchedule: not found`)   | Must not be used or referenced. Plan mentions it as “missing” and proposes no substitution, but still lists it in CDM class usage. |
| `cdm.base.staticdata.party.PartyReference` | Not available (`PartyReference: not found`) | Must not be used. Plan does not mention usage, but refers to `MapCounterpartyRoleEnum` and `ReferenceWithMetaParty`, which is allowed. No direct blocking. |
| `cdm.base.staticdata.asset.Asset`, `Cash` | Not available | Plan uses `cdm.base.staticdata.asset.common.Asset` (which **is** listed as exists in cdm-java-api-pack.md), **not** `cdm.base.staticdata.asset.Asset`, so **not blocked**. |
| `cdm.product.common.settlement.SettlementPayout` | Not available (`SettlementPayout: not found`) | Plan explicitly attempts to “emulate” using `Payout` + `SettlementTerms`, but `SettlementTerms` is also **not available**. |
| `cdm.product.template.SettlementTerms`, `CashSettlementTerms`, `SettlementTypeEnum` | Not available (`SettlementTerms: not found`, etc.) | Plan proposes to use these, but they are unavailable. |
| `cdm.observable.asset.ResolvablePriceQuantity` | Not available (`ResolvablePriceQuantity: not found`) | Plan proposes to substitute with `PriceQuantity`, which **is available**. **✅ Acceptable substitution**, but requires precise usage of `cdm.observable.asset.PriceQuantity` and its `price`, `quantity`, and `observable` fields. |

#### **Critical blocking issue**
The plan proposes to use `SettlementPayout` and `SettlementTerms`, but **neither is available in CDM Java API Pack**, and there is no evidence in preflight that Rosetta exposes these classes for Java usage. The only available payout container is `cdm.product.template.Payout` (which exists and has `.setSettlementPayout(cdm.product.template.SettlementPayout)` builder method), but `SettlementPayout` itself is missing.

**No available path to construct settlement payout semantics without both `SettlementPayout` and `SettlementTerms`.**

**Solution path (not in plan)**:  
Based on `rosetta-generation-context.md`, the Rosetta function `MapFxCoreDetailsModelToSettlementPayout` **outputs** `Payout`, and its **internal logic** contains `SettlementPayout`. Since `SettlementPayout` does not exist in Java, this Rosetta function **cannot be faithfully reproduced in Java without internal representation of `SettlementPayout`** — thus requiring an internal DTO + schema evolution.

The plan says:  
> These classes will be **emulated** using `Payout` + `PriceQuantity` + `SettlementTerms`  
> (to represent settlement semantics) and `PriceQuantity` respectively.

This is **not feasible** unless `SettlementTerms` and `SettlementPayout` exist — which they do not.

---

### ✅ Rosetta function usage (traceability)

The plan lists the correct Rosetta functions (`MapFxSingleLegCounterpartyList`, `MapFxCoreDetailsModelToSettlementPayout`, etc.) as cited in `rosetta-generation-context.md`. This satisfies the requirement to cite Rosetta functions for FX single-leg mapping.

---

### ✅ In-place FPML input modeling

The plan avoids `FpmlFxSingleLeg` (which is **not in CDM Java**) and proposes internal DTOs (`FpmlFxSingleLegDto`, `FpmlExchangedCurrencyDto`, etc.). This is acceptable and avoids forbidden class usage.

---

### 📌 Non-blocking concerns

1. **`PriceSchedule` not available**  
   - The plan does not directly reference `PriceSchedule`, but Rosetta and CDM JSON examples use it.  
   - Since `cdm.base.math.PriceSchedule` is unavailable, **`cdm.base.math.PriceSchedule` cannot be used**.  
   - **No substitution is proposed**, but `PriceQuantity` builder methods accept `PriceSchedule` (which is **not available**) — leading to a **runtime dependency on missing classes in Java**.

2. **`MetaFields` and `Date`**  
   - Both are listed as “seed class not found” in cdm-java-api-pack.md.  
   - Plan says:  
     > The mapping will manage metadata and date fields manually where possible, or leverage external tools if needed.  
   - This is vague and may cause runtime failures. No explicit mitigation plan.

3. **Test fixture validation**  
   - The plan says:  
     > Each fixture will be validated against its expected CDM JSON output  
   - This is a reasonable test goal, but requires JSON ↔ CDM roundtrip tooling. No tooling or `Jackson` usage guidance.

---

## Decision

**Block on unfeasible `SettlementPayout`/`SettlementTerms` usage.**

The plan:
- Does **not** cite Rosetta functions for FX single-leg mapping *without* referencing unavailable `SettlementPayout` and `SettlementTerms`.
- Proposes “emulating” settlement payout semantics using classes that **do not exist** in CDM Java API.
- References `cdm.base.math.PriceSchedule`, which is **explicitly forbidden** and missing.

These issues are **blocking** because they prevent generation of valid Java code using only allowed CDM Java classes.

### ✅ Correct aspects
- In-scope group matches `currentImplementationGroup`.
- Runtime fixtures match exactly.
- Avoids `FpmlFxSingleLeg`.
- Correct CDM class usage for `Trade`, `Party`, `Counterparty`, `Payout`, `PriceQuantity`, `Observable`, `PartyRole`, etc.

### ❌ Blocking issues
- **Uses `SettlementPayout` and `SettlementTerms`, which are not available** and no legal substitution exists.
- **No mechanism to construct settlement semantics in Java without missing classes.**
- **`PriceSchedule` is mentioned and used, though forbidden and missing.**

---

Decision: NEXT_ROUND_REQUIRED