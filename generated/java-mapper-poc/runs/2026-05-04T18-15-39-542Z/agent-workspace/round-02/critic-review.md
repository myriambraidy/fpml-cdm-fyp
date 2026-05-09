## Review Summary

The plan is evaluated against the following fixed constraints derived from `00-product-scope.json`, `evidence-index.md`, `cdm-java-api-pack.md`, `cdm-java-negative-classes.md`, and `rosetta-generation-context.md`:

### Blocking Criteria (hard rules)

1. **Implementation scope must be machine-checked and match productGroups[].group slugs**
   - ✅ Plan contains `## Implementation scope (machine-checked)` with **In scope (implementation groups):** bullet listing `fx-single-leg`.
   - ✅ `currentImplementationGroup` in JSON is `fx-single-leg`.
   - ❌ **BLOCK: Out-of-scope group `fx-swap` is explicitly listed in “Explicitly out of scope”**, but `fx-swap` is **not** a candidate in `00-product-scope.json`. The only candidate next groups are `fx-swap` and `fx-simple-option`, and the plan incorrectly treats `fx-swap` as explicitly out-of-scope rather than “future phase”, contradicting the staged strategy and product scope.

2. **Runtime fixtures must match exactly `run_config.runtimeFixtures` IDs**
   - ✅ Plan contains `## Runtime supported fixtures (machine-checked)` and exactly lists:
     `fx-ex01-fx-spot`, `fx-ex02-spot-cross-w-side-rates`, `fx-ex03-fx-fwd`, `fx-ex04-fx-fwd-w-settlement`, `fx-ex05-fx-fwd-w-ssi`, `fx-ex06-fx-fwd-w-splits`, `fx-ex07-non-deliverable-forward`.
   - ✅ These match `runtimeFixtures` keys in the provided `run_config`.

3. **Support for FX single-leg must cite Rosetta functions**
   - ✅ Plan lists `MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`, `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`, `MapFxCoreDetailsModelToSettlementPayout`, `MapFxSingleLegPriceQuantityList`, `MapFxSingleLegAccountPartyReference` and correctly references them as required Rosetta functions.

4. **Do not reference forbidden classes**
   - ✅ Plan explicitly excludes `FpmlFxSingleLeg`, `SettlementPayout`, `ResolvablePriceQuantity`, `PriceSchedule`, `Date`, `MetaFields`, etc., and proposes substitutions (e.g., `Payout` + `PriceQuantity` for `SettlementPayout`, inline `SettlementTerms` pattern), which aligns with negative class constraints.

5. **No raw JSON construction as internal CDM model**
   - ✅ Plan uses builder-based Java CDM classes only.

6. **No CDM Java classes absent from cdm-java-api-pack.md**
   - ✅ All CDM classes listed in “CDM Class Usage” exist in the API pack (verified: `Trade`, `TradeState`, `NonTransferableProduct`, `EconomicTerms`, `Payout`, `Party`, `Counterparty`, `AncillaryParty`, `TradeIdentifier`, `PriceQuantity`, `Observable`, `FieldWithMetaDate`).
   - ✅ No reference to missing seed classes or CDM Java package shortcuts is used.

7. **No invented FpML input model (e.g., `FpmlFxSingleLeg`)**
   - ✅ Plan correctly states: “parse FpML XML with DOM/StAX or generated internal DTOs” and does not import `FpmlFxSingleLeg`.

8. **No broad FX claims without fixture gates**
   - ✅ Supported products are limited to FX single-leg runtime fixtures and explicit unsupported products are clearly demarcated as future phases.

### Non-blocking concerns

- **Missing runtime support for `Date`, `MetaFields`**: The plan acknowledges that `com.rosetta.model.lib.records.Date` and `com.rosetta.model.metafields.MetaFields` are missing from CDM Java API pack and proposes manual handling. This is a known constraint per negative classes and preflight, and the plan does not claim to use them directly.
- **Settlement semantics substitution**: The plan proposes “inline `SettlementTerms` within `Payout`” to emulate `SettlementPayout` behavior. This is acceptable per constraints and matches the stated emulated handling.

---

### Decision: NEXT_ROUND_REQUIRED

**Reason:** The plan violates constraint #1: `fx-swap` is incorrectly listed in the **“Explicitly out of scope”** section, despite the `product-family` scope being “staged-by-product-group” and `candidateNextGroups` including `fx-swap`. While the plan correctly targets only runtime fixtures (fx-single-leg), the explicit classification of `fx-swap` as “Future phase” and out-of-scope conflicts with the staged strategy. In staged implementation, groups beyond the current are not “out of scope” for the product family; they are future phases.

**Required correction:** Remove `fx-swap` (and other non-current groups) from the “Explicitly out of scope” section and replace with:  
- **In future phases:** fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy (as per `candidateNextGroups` and `productGroups` order).

Once this editorial/terminology fix is applied, the plan passes all blocking checks.

Decision: NEXT_ROUND_REQUIRED