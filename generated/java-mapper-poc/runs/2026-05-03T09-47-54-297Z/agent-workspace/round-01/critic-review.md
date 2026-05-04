## Review

### Blocking Issues

1. **Missing "## Implementation scope (machine-checked)" section header and `currentImplementationGroup` verification**  
   The plan's `## Implementation scope (machine-checked)` block includes the correct in-scope group `fx-single-leg` and lists the same groups in the out-of-scope bullets as `00-product-scope.json`. However, it does **not** contain the required explicit mention of `currentImplementationGroup: fx-single-leg`, which is used as the basis for the staged-by-product-group strategy. While the in-scope/out-of-scope bullets match the product scope JSON, the plan does not reference `currentImplementationGroup` explicitly. This is a minor formatting inconsistency, not a mapping error.

2. **Unsupported group fx-swap listed incorrectly**  
   The plan lists `fx-swap` as “Observed unsupported FX products” but the product scope JSON shows that `fx-swap` is a *candidate* next group (not excluded). It should be listed under “Observed unsupported FX products” only if explicitly excluded in the plan, which is acceptable as a phase decision. However, the plan later says "The next logical group (fx-swap or fx-simple-option)" in the Implementation Group Change Proposal, which contradicts treating fx-swap as unsupported. In context, this is acceptable as a phased implementation decision, not a blocking error.

3. **Overreach in "expiryDateTime mapping must convert into exerciseTerms.expiration"**  
   The traceability requirements list: "`expiryDateTime` mapping must convert into `exerciseTerms.expiration` components and time fields". This applies only to option-type products (fx-simple-option, fx-barrier-option, etc.), **not** to the current `fx-single-leg` group (spot/fwd/ndf) which has no expiry/expiration semantics. Including this in the `fx-single-leg`-only traceability requirements is **unsupported** and confusing, even if the statement itself is correct for options. This is misleading for the current scope.

4. **Test coverage includes option-specific tests**  
   The plan mentions tests like `FxSingleLegEndToEndTest` for “each supported fixture”, but lists fixtures like `fx-ex09-euro-opt.xml`, `fx-ex10-amer-opt.xml`, and others that belong to `fx-simple-option`, not `fx-single-leg`. The actual `fx-single-leg` fixtures are 1–7 only. This is a test plan error.

### Non-blocking Concerns

1. **Party assignment logic in `FxSingleLegMapper` lacks detail**  
   The plan states `Resolve party references and assign party roles`, but does not specify how `party1`/`party2` are assigned to `Party1`/`Party2` roles, which is critical for traceability to the cookbook transformation TR-001. It should reference that the mapper must apply cookbook rules to determine payer/receiver role mappings based on `exchangedCurrencyX.payerPartyReference`.

2. **Missing explicit mention of settlement information handling**  
   Settlement handling (e.g., `settlementInformation`, `settlementMethod`, `settlementInstruction`) is listed as “Secondary mapping responsibilities”, but it appears in 4 of 7 `fx-single-leg` fixtures (fx-ex04, fx-ex05, fx-ex06, fx-ex07). This is a core part of single-leg processing and should be elevated to primary responsibilities.

3. **Package naming convention not justified**  
   The use of `com.example.fxmapper` is placeholder. While this may be intentional for the plan, it would be helpful to note that this is a placeholder or to align with a project-wide convention (e.g., `com.reuters.cdm.fxmapper` or `com.gs.fintech.fxmapper`). This is minor.

4. **Missing explicit trace to cookbook rules per fixture**  
   The plan mentions “All mapping logic must directly reference evidence from the fx-derivatives cookbook”, but does not specify which cookbook rules (e.g., RULE-001 through RULE-005) apply to each fixture. Since fixtures differ in features (e.g., side rates, splits, NDF), it would be helpful to annotate fixtures with applicable rule IDs.

5. **No mention of NDF-specific logic for fx-ex07**  
   The non-deliverable forward (`fx-ex07-non-deliverable-forward.xml`) requires cash settlement and fixing logic (e.g., `nonDeliverableForward`, `fixing`, `settlementCurrency`). This is not called out separately in mapping responsibilities.

6. **Date normalization rule may be incomplete for NDF fixing dates**  
   The plan mentions “Trade date normalization must consistently remove trailing 'Z' from dates”, but `fx-ex07` has `fixingDate`, `valuationDate`, and other date/time fields that may require similar normalization. It should clarify whether *all* date fields in `fxSingleLeg` should have trailing 'Z' trimmed or only `tradeDate`.

### Decision: NEXT_ROUND_REQUIRED

- **Blocking issues:** 2–4 are substantive and must be corrected before implementation can proceed with confidence.
- **Non-blocking concerns:** Several improvements would increase correctness and maintainability; addressing them reduces risk during repair.

**Required fixes for NEXT_ROUND:**
- Remove `expiryDateTime` traceability requirement from fx-single-leg-only section.
- Update test coverage list to reflect only fx-ex01 through fx-ex07 fixtures.
- Explicitly call out `currentImplementationGroup: fx-single-leg` in the Implementation Scope section.
- Adjust fx-swap listing to clarify phased implementation intent (not error).
- Add settlement and NDF-specific handling as primary mapping responsibilities.
- Clarify date normalization applies to all date/time fields in single-leg products.

Decision: NEXT_ROUND_REQUIRED