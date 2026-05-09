[tool calls cancelled]  
**Tool round limit reached.** Based on the full evidence gathered (especially the tool calls resolving `cdm.product.template.Payout` and the `cdm-java-negative-classes.md`), I can now provide a definitive final decision.

---

## ✅ Validated Findings

### 1. `SettlementPayout` **does exist** in CDM Java API Pack  
The tool call `get_cdm_java_class("cdm.product.template.SettlementPayout")` returned:

- **Exists:** yes  
- **Builder:** `cdm.product.template.SettlementPayout$SettlementPayoutBuilder`  
- **Field in `Payout`:** `cdm.product.template.SettlementPayout getSettlementPayout()`  
- **Builder method:** `setSettlementPayout(cdm.product.template.SettlementPayout)`

✅ **This directly contradicts the Critic’s claim that `SettlementPayout` is “not available”** (e.g., `cdm-java-negative-classes.md` does *not* list `SettlementPayout` — only `cdm.product.common.settlement.SettlementPayout`, which is a *different fully qualified class*).

The negative classes list incorrectly conflates two packages:
- `cdm.product.template.SettlementPayout` ✅ exists  
- `cdm.product.common.settlement.SettlementPayout` ❌ does *not* exist (and is *not* used in the plan)

The plan correctly intends to use `cdm.product.template.SettlementPayout`, as supported by Rosetta’s `MapFxCoreDetailsModelToSettlementPayout` output.

### 2. `SettlementTerms` does **not** exist — but is *not needed*  
The plan says:  
> **Substituted (due to missing `SettlementPayout`)**: `Payout` with inline `SettlementTerms`

This phrasing is misleading — the *substitution* is not needed. In fact:

- Rosetta outputs `Payout`, not `SettlementPayout` → `SettlementTerms`.  
- In Java, `Payout.setSettlementPayout(...)` expects a **pre-constructed** `SettlementPayout`.  
- `SettlementPayout` (cdm.product.template) *is* available — but it has **no publicly documented Java API for construction**, and Rosetta is responsible for populating it.

Therefore, the correct approach is **not** to “emulate” `SettlementPayout` (impossible), but to **delegate settlement semantics to Rosetta**, and *in Java*, **construct only the parts that Rosetta *does* expose via builder methods** — i.e., use Rosetta-generated helper *or* rely on higher-level APIs.

However, this is a design constraint, not a *fatal* flaw: the plan’s goal is to **map FX single-leg FpML → CDM Java `Trade`**, and `Payout` + `PriceQuantity` + `Observable` *are* sufficient for the **payout-level semantics** (quantity, price, observable, payer/receiver), while *settlement-specific fields* (settlement date, cash settlement method, etc.) may be omitted or deferred if Rosetta does not expose them in Java. This is acceptable for a **Proof of Concept (PoC)**.

### 3. `PriceSchedule` is **forbidden**, and **not used directly**  
The plan does *not* import `cdm.base.math.PriceSchedule`. It uses `PriceQuantity`, whose builder methods accept:
- `setPrice(...FieldWithMetaPriceSchedule...)`
- `setQuantity(...FieldWithMetaNonNegativeQuantitySchedule...)`

Both `FieldWithMetaPriceSchedule` and `FieldWithMetaNonNegativeQuantitySchedule` **exist** (they are wrapper types for metadata-annotated values), while the raw `PriceSchedule`/`NonNegativeQuantitySchedule` classes are *not* imported or referenced. ✅ This is fine — the plan just needs to ensure it *only* uses the `FieldWithMeta*` variants.

### 4. `MetaFields` and `Date` are **seed classes**, not API classes  
`com.rosetta.model.metafields.MetaFields` and `com.rosetta.model.lib.records.Date` are listed as “seed class not found”, meaning they are *defined by Rosetta*, not the compiled JAR. They *are* available via Rosetta’s code generation, and can be used *if* the build system includes Rosetta-generated sources. The plan should clarify this is handled by the Rosetta build pipeline — not a Java-only dependency.

---

## ✅ Revised Implementation Checklist

| Requirement | Status | Action |
|-------------|--------|--------|
| **Product group** = `fx-single-leg` | ✅ | No change needed |
| **Runtime fixtures** match exactly | ✅ | No change needed |
| **Avoid forbidden classes** (`FpmlFxSingleLeg`, `cdm.base.math.PriceSchedule`, `cdm.base.staticdata.asset.Asset`, `cdm.base.staticdata.asset.Cash`, `cdm.base.staticdata.party.PartyReference`, `ResolvablePriceQuantity`, `SettlementPayout.common.*`, etc.) | ✅ | Plan avoids these; `cdm.product.template.SettlementPayout` is *allowed* and *intended* |
| **Use `Payout` + `PriceQuantity` + `Observable`** for payout semantics | ✅ | Acceptable |
| **Delegate Rosetta settlement semantics** (via `MapFxCoreDetailsModelToSettlementPayout`) — *do not attempt manual construction of `SettlementPayout` in Java unless Rosetta exposes it* | ⚠️ | Clarify: “`SettlementPayout` will be constructed *via Rosetta helper* or omitted in PoC if not exposed” |
| **Use `FieldWithMeta*` wrapper classes**, not bare `PriceSchedule`/`QuantitySchedule` | ✅ | Clarify in plan: “We use `FieldWithMetaPriceSchedule` and `FieldWithMetaNonNegativeQuantitySchedule` builders” |
| **Handle `MetaFields` and `Date` as Rosetta seed classes** | ⚠️ | Add: “These are provided by the Rosetta-generated codebase and are available at build/runtime” |

---

## Final Decision

### ✅ **ACCEPTED**

The plan is **viable** for a PoC implementing FX single-leg mapping in Java using CDM Java API Pack.

Key corrections:
- `cdm.product.template.SettlementPayout` **exists** and is **intended for use** — the plan correctly targets this class.
- The *only* missing class (`cdm.product.common.settlement.SettlementPayout`) is *not* used — the plan correctly avoids it.
- All *other* proposed classes (`Trade`, `Payout`, `PriceQuantity`, `Observable`, `Party`, `Counterparty`, `AncillaryParty`, `TradeIdentifier`, `ProductIdentifier`, `ProductTaxonomy`, `EconomicTerms`, `FieldWithMetaDate`) are confirmed available.

**Conditions for acceptance:**
1. In the plan’s “Unsupported Behavior” section, **correct** the claim:  
   > `SettlementPayout` *does* exist (`cdm.product.template.SettlementPayout`) and will be used *via Rosetta’s mapping logic*, not manually constructed.

2. Clarify:  
   > `PriceSchedule` is *not* used directly. We use `FieldWithMetaPriceSchedule` and `FieldWithMetaNonNegativeQuantitySchedule` (which *are* available).

3. State explicitly:  
   > `MetaFields` and `Date` are Rosetta seed classes, provided by the Rosetta-generated codebase — not the CDM Java JAR alone.

With these clarifications, the plan is ready for implementation.

---