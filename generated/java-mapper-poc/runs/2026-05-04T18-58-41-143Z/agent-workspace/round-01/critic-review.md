# Review: Planner Plan for FX Single-Leg Mapping (Round 1)

## Blocking Issues

### ❌ Missing machine-checked fixture-to-ID mapping in “Runtime supported fixtures” section

The plan states:
```
## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
- fx-ex03-fx-fwd
- fx-ex04-fx-fwd-w-settlement
- fx-ex05-fx-fwd-w-ssi
- fx-ex06-fx-fwd-w-splits
- fx-ex07-non-deliverable-forward
```

But the **machine-checkable** requirement is that these bullets must exactly match `run_config.runtimeFixtures.ids`, i.e., the keys (e.g., `fx-ex01-fx-spot`) must be paired with values (filenames) as specified in the run_config.

The evidence-index.md confirms:
```
- fx-single-leg: data_to_learn_from\fpml\fx-derivatives\fx-ex01-fx-spot.xml
...
```

The plan correctly lists the expected fixture IDs, so this passes *if* the run_config fixture ids match. Since the run_config matches those IDs exactly, the section is acceptable.

### ❌ Cited CDM classes not in preflight

The plan lists:
- `cdm.product.common.settlement.SettlementPayout`  
- `cdm.observable.asset.ResolvablePriceQuantity`

Both are marked **Negative Classes** (cdm-java-negative-classes.md):
- `cdm.product.common.settlement.SettlementPayout: not found in cdm-java-6.7.0.jar`
- `cdm.observable.asset.ResolvablePriceQuantity: not found in cdm-java-6.7.0.jar`

But the CDM Java API pack (cdm-java-api-pack.md) shows only:
- `cdm.product.template.SettlementPayout` — **Exists: yes**
- No `ResolvablePriceQuantity` — only `cdm.observable.asset.PriceQuantity` is available.

The planner confused both class names and included non-existent CDM Java classes. Using these classes would fail at compile time.

**Fix:**
Replace:
- `cdm.product.common.settlement.SettlementPayout` → `cdm.product.template.SettlementPayout`
- Remove `cdm.observable.asset.ResolvablePriceQuantity` — use `cdm.observable.asset.PriceQuantity` instead.

### ❌ Rosetta function usage lacks citing for single-leg mapping in Java context

The plan lists Rosetta function names, but the rules require citing the *exact* Rosetta functions for FX single-leg mapping. The tool `get_rosetta_generation_context` confirms the following 10 functions are authoritative for `fx-single-leg`:

```rosetta
MapFxSingleLegCounterpartyList
MapFxSingleLegAncillaryPartyList
MapFxSingleLegNonTransferableProduct
MapFxSingleLegEconomicTerms
MapFxCoreDetailsModelToSettlementPayout
MapFxSingleLegPriceQuantityList
MapFxSingleLegAccountPartyReference
MapPayerReceiverModelToCounterpartyList
MapPayerReceiver
MapPayerReceiverToAccountPartyReference
```

The plan omits two key helper functions (`MapPayerReceiver`, `MapPayerReceiverToAccountPartyReference`) and includes the generic `MapFxCoreDetailsModelToSettlementPayout`, but does not cite the full Rosetta call graph from `get_rosetta_call_graph`.

However, the **planning** context is acceptable if the implementation later pins down the Rosetta call graph. Since the plan explicitly references the main FX single-leg functions and includes the shared helpers in the “Mapping responsibilities” section, this is not *strictly* blocking but is a warning.

### ⚠️ “ResolvablePriceQuantity” in CDM Java design (repeated)

The plan states:
> `cdm.observable.asset.ResolvablePriceQuantity` (Price/quantity details)

But `ResolvablePriceQuantity` is **not in the CDM Java API**; only `PriceQuantity` is.

This is a follow-up error from earlier; `ResolvablePriceQuantity` must not be used. Instead, use:
- `cdm.observable.asset.PriceQuantity` — exists and has builder methods.

**Action:** Replace all mentions of `ResolvablePriceQuantity` with `PriceQuantity`.

### ✅ No raw JSON construction mentioned (CDM model used)

The plan says: *“Generated Java code will produce a Maven project using the CDM/Rosetta Java model as its internal representation.”*  
No use of raw JSON construction as the internal model — acceptable.

### ✅ No FpML Java input model classes referenced

The plan says: *“Construction of FpmlFxSingleLeg model classes is avoided per CDM Java negative class list”* and emphasizes XML parsing with DOM/StAX.

### ✅ FX support properly gated

The plan states: *“This run implements the FX single-leg product family”* and explicitly lists out-of-scope FX groups. It does not claim “full FX support” — acceptable.

### ✅ No unsupported CDM Java classes cited beyond negatives

The core CDM classes listed (`Trade`, `NonTransferableProduct`, etc.) all exist in `cdm-java-api-pack.md`. The `Negative Classes` list confirms only `SettlementPayout` (wrong package) and `ResolvablePriceQuantity` are misnamed.

## Non-blocking concerns

### 📝 Rosetta helper functions not all listed

The plan lists:
- `MapFxSingleLegCounterpartyList`
- `MapFxSingleLegAncillaryPartyList`
- `MapFxSingleLegNonTransferableProduct`
- `MapFxSingleLegEconomicTerms`
- `MapFxCoreDetailsModelToSettlementPayout`
- `MapFxSingleLegPriceQuantityList`

But the Rosetta context shows these additional key functions:
- `MapPayerReceiver`
- `MapPayerReceiverModelToCounterpartyList`
- `MapPayerReceiverToAccountPartyReference`

**Recommendation:** Include all 9-10 Rosetta functions used in the generation context, especially `MapPayerReceiver`, as it is called by `MapFxCoreDetailsModelToSettlementPayout` and `MapFxSingleLegCounterpartyList`.

### 📝 No runtime fixture filenames referenced in plan

The plan says “runtime fixtures” but does not reference actual filenames (`fx-ex01-fx-spot.xml`, etc.), only IDs. While the evidence-index.md includes filenames, the planner-plan should be self-contained.

**Minor improvement:** Add one line:
> Runtime fixtures (XML files): fx-ex01-fx-spot.xml, fx-ex02-spot-cross-w-side-rates.xml, etc.

But this is not blocking.

### 📝 CDM classes listed as “Core CDM Objects” — include builder method guidance

The plan lists CDM classes but does not explicitly state which builder methods are used (e.g., `Trade.builder().setProduct(...).addCounterparty(...).build()`). The CDM Java API pack shows extensive builder APIs.

**Improvement suggestion:** Provide a minimal example of builder chaining for `Trade` to show understanding of API constraints.

---

## Final Verdict

### Decision: NEXT_ROUND_REQUIRED

**Reason:** Two blocking issues:
- Use of non-existent CDM Java class `cdm.observable.asset.ResolvablePriceQuantity` (twice).
- Use of non-existent CDM Java class `cdm.product.common.settlement.SettlementPayout` (wrong package vs. `cdm.product.template.SettlementPayout`).

These must be corrected before implementation.

### Required corrections

1. Replace `cdm.observable.asset.ResolvablePriceQuantity` with `cdm.observable.asset.PriceQuantity`.
2. Replace `cdm.product.common.settlement.SettlementPayout` with `cdm.product.template.SettlementPayout`.
3. Confirm all Rosetta helper functions (`MapPayerReceiver`, `MapPayerReceiverModelToCounterpartyList`, etc.) are cited if used.
4. Optional: Clarify that `cdm.base.math.NonNegativeQuantitySchedule` and `cdm.base.math.PriceSchedule` are *not* used — per negative classes — and `PriceSchedule` is absent from CDM Java.

Once corrected, this plan is otherwise well-structured and aligned with product scope and runtime fixtures.

**Next steps:**
- Update `planner-plan.md` with correct class names.
- Re-run validation with `plan-validation.md`.
- Ensure no new negative classes are imported.

Decision: NEXT_ROUND_REQUIRED