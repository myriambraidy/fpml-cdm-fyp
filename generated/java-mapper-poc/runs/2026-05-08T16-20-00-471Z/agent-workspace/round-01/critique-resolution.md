# Critique Review: Planner Round 1 Plan

**Date:** 2026-05-08  
**Planning Round:** 1/3  
**Run ID:** 2026-05-08T16-20-00-471Z  
**Product Family:** fx-derivatives  
**Implementation Group:** fx-single-leg  

---

## Executive Summary

The planner’s round-1 plan is **technically sound in scope, intent, and structure**, but contains **three blocking issues** that prevent acceptance at this stage:

1. **Missing-class blocker**: The plan references `cdm.base.staticdata.party.PartyReference`, an exact class not found in `cdm-java-6.7.0.jar`, and the semantic recipe explicitly warns against using it.
2. **Missing core Rosetta evidence blocker**: The plan includes no traceability of the `TradeState` root’s *build-root* step, which is mandatory per the `fx-single-leg-tradestate` recipe and the Java shell contract.
3. **Java shell contract blocker**: The plan does not confirm use of `get_cdm_java_class` *before* any exact class lookup—even for approved classes—violating the mandatory preflight step.

All other critiques (e.g., `PriceQuantity`, `PriceSchedule`, `NonNegativeQuantity`, `PartyReference`, `Payout` type selection) are **invalid** because:
- They misinterpret same-simple-name classes in other packages as missing,
- They conflict with deterministic evidence (`approved-cdm-api-contract-summary.md`, `cdm-java-api-summary.md`, `semantic-recipes.md`),
- Or they are non-blocking implementation wording issues.

---

## Detailed Critique Items

### ✅ Valid Critique: 1. `cdm.base.staticdata.party.PartyReference` is missing

| Issue | Detail |
|-------|--------|
| **Plan statement** | “`PartyReference`” appears in the *Core Classes* section, and no alternative is used. |
| **Deterministic evidence** | `cdm-java-api-summary.md` explicitly lists: `cdm.base.staticdata.party.PartyReference: exact class not found`. |
| **Recipe guidance** | `semantic-recipes.md` step 1: “Do not invent cdm.base.staticdata.party.PartyReference. Use approved party identity or metafield classes.” |
| **Consequence** | Implementation will fail at compile time or runtime if `PartyReference` is instantiated. |

**Status:** Blocking.  
**Required fix:** Replace all references to `PartyReference` with `ReferenceWithMetaParty`, and ensure the Rosetta mapping block `MapPayerReceiverToAccountPartyReference` is explicitly used per the recipe.

---

### ✅ Valid Critique: 2. `TradeState` root build is untraceable

| Issue | Detail |
|-------|--------|
| **Plan statement** | “`TradeBuilder` orchestrates the complete TradeState construction” is vague and does not cite the mandatory Rosetta function blocks for *build-root*. |
| **Deterministic evidence** | `semantic-recipes.md` step 5 lists `MapTradeToTradeState` as the Rosetta function for building `TradeState`, and the Java contract requires Rosetta traceability for *every* core step. |
| **Consequence** | Traceability validation fails; the plan lacks machine-checkable evidence that `cdm.event.common.TradeState` is built per the recipe. |

**Status:** Blocking.  
**Required fix:** Add a step “5. Build `TradeState` from `Trade` using `MapTradeToTradeState`” and cite `func:ingest-fpml-confirmation-tradestate-func.rosetta:MapTradeToTradeState` in the Rosetta areas list.

---

### ✅ Valid Critique: 3. `get_cdm_java_class` preflight is missing for approved classes

| Issue | Detail |
|-------|--------|
| **Plan statement** | The plan lists approved classes (e.g., `cdm.product.template.OptionPayout`) and implies direct use without invoking `get_cdm_java_class` or `resolve_cdm_concept`. |
| **Deterministic evidence** | `java-shell-contract.md`: “Call search_cdm_java_classes or resolve_cdm_concept before exact class lookup; do not guess package names.” |
| **Consequence** | The build process is not deterministic; missing-class observations would not be checked, risking future failures if class packages shift. |

**Status:** Blocking.  
**Required fix:** Insert a validation step *before* each class instantiation, e.g.,  
`Use get_cdm_java_class('cdm.product.template.OptionPayout') → found → proceed`.

---

### ❌ Invalid Critique: 4. `cdm.observable.asset.PriceQuantity` is required but missing

| Plan claim | `PriceQuantity` is referenced as an input concept. |
|------------|----------------------------------------------------|
| **Evidence** | `cdm-java-api-summary.md` lists no `cdm.base.math.PriceQuantity`. `approved-cdm-api-contract-summary.md` only includes `cdm.observable.asset.PriceSchedule`. |
| **Recipe guidance** | `semantic-recipes.md` step 4 approves `PriceSchedule` and `ResolvablePriceQuantity`, *not* `PriceQuantity`. |
| **Deterministic resolution** | `PriceSchedule` *is* present and approved; the concept map to `PriceSchedule`, not `PriceQuantity`. |
| **Verdict** | The critic misreads same-simple-name classes (`PriceSchedule` vs `PriceQuantity`) and overlooks the exact approved contract. |

**Decision:** Rejected.

---

### ❌ Invalid Critique: 5. `PriceSchedule` is missing

| Plan claim | `cdm.base.math.PriceSchedule` should be used. |
|------------|-----------------------------------------------|
| **Evidence** | `cdm-java-api-summary.md`: `cdm.base.math.PriceSchedule: exact class not found`, candidate `cdm.observable.asset.PriceSchedule`. |
| **Approved contract** | `approved-cdm-api-contract-summary.md` includes `cdm.observable.asset.PriceSchedule` (line 21), explicitly selecting the *observable* package. |
| **Recipe guidance** | `semantic-recipes.md` step 4: `cdm.observable.asset.PriceSchedule`. |
| **Verdict** | The critic does not distinguish between `cdm.base.math.PriceSchedule` and `cdm.observable.asset.PriceSchedule`. The approved contract mandates the latter. |

**Decision:** Rejected.

---

### ❌ Invalid Critique: 6. `NonNegativeQuantity` and `NonNegativeQuantitySchedule` are required

| Plan claim | These classes appear in the *Core Concepts* section. |
|------------|-------------------------------------------------------|
| **Evidence** | `cdm-java-api-summary.md`: *exact class not found* for both. Approved contract only lists `cdm.base.staticdata.party.metafields.ReferenceWithMetaNonNegativeQuantitySchedule`, *not* `NonNegativeQuantitySchedule` as a top-level class. |
| **Recipe guidance** | `semantic-recipes.md` step 4 does *not* list them as standalone inputs. They are referenced only as parameters inside `ReferenceWithMeta*` wrappers. |
| **Verdict** | The critic confuses *parameter types inside metafields* with *build-root classes*. No standalone class lookup is required. |

**Decision:** Rejected.

---

### ❌ Invalid Critique: 7. `PartyReference` should be used instead of `ReferenceWithMetaParty`

| Plan claim | Uses `PartyReference`. |
|------------|------------------------|
| **Evidence** | `cdm-java-api-summary.md`: `PartyReference: exact class not found`. |
| **Recipe guidance** | Explicitly forbids `PartyReference` and requires `ReferenceWithMetaParty`. |
| **Verdict** | The critic’s proposed alternative is *explicitly forbidden*. |

**Decision:** Rejected.

---

### ❌ Invalid Critique: 8. `Payout` should be selected from `OptionPayout`, `FixedPricePayout`, etc.

| Plan claim | `Payout` is the container, `SettlementPayout` is selected. |
|------------|------------------------------------------------------------|
| **Evidence** | `semantic-recipes.md` step 4: `SettlementPayout` is the *only* approved payout type for FX single-leg. |
| **Approved contract** | Builder methods listed only for `SettlementPayout`, not for `OptionPayout`/`FixedPricePayout`/`PerformancePayout` in this recipe. |
| **Verdict** | The critic misreads the recipe: `Payout` is the container, `SettlementPayout` is the *selected* concrete type. |

**Decision:** Rejected.

---

## Decision: NEXT_ROUND_REQUIRED

### Blocking Issues Summary

| Issue | Severity | Fix required |
|-------|----------|--------------|
| 1. `PartyReference` usage | Critical | Replace with `ReferenceWithMetaParty`, cite `MapPayerReceiverToAccountPartyReference`. |
| 2. `TradeState` root untraceable | Critical | Add step “5. Build `TradeState` using `MapTradeToTradeState`”. |
| 3. `get_cdm_java_class` preflight omitted | Critical | Insert mandatory preflight before each class lookup. |

### Required Fixes for Round 2

1. **Core classes section**:  
   - Remove `PartyReference`.  
   - Add `ReferenceWithMetaParty` as the party identity class.

2. **Mapping responsibilities**:  
   - Add a bullet: “`TradeState` construction using Rosetta function `MapTradeToTradeState`”.

3. **Core classes (Java implementation)**:  
   - Add a validation step: “Call `get_cdm_java_class` for every CDM class used (e.g., `cdm.event.common.TradeState`, `cdm.product.template.SettlementPayout`) before instantiation.”

4. **Traceability section**:  
   - Add: “Every root object construction must cite the Rosetta function block per `semantic-recipes.md`.”

5. **Tests section**:  
   - Add validation test: “Verify that every `get_cdm_java_class` call returns `found` for approved classes.”

### Excluded Wording Issues

- Minor phrasing issues (e.g., “core classes” vs “approved classes”) are non-blocking and may be deferred to final-round acceptance.

---

**Next step:** Resubmit with explicit fixes for all three blocking items, and include a revised plan-validation.md check.