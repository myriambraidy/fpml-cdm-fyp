```markdown
# Critique Review Decision

## Deterministic Validation (plan-validation.md)
✅ Status: **passed**
- `## Implementation scope` and `## Runtime supported fixtures` match `00-product-scope.json`.
- `## Java shell contract` and `## Rosetta evidence coverage` match authority files.

---

## Validity of Critique Items

### ✅ Valid — Blocking: Misinterpretation of `TradeState.setTrade(...)` intent

> **Critique**: “Claim: ‘The implementation will **not** use `set-trade(...)` builder method’… This is a **core builder method**.”

✅ **VALID / BLOCKING**
- Evidence: `get_cdm_builder_methods('cdm.event.common.TradeState', 'set-trade')` → `setTrade(...)`.
- The `approved-cdm-api-contract-summary.md` lists:
  ```
  cdm.event.common.TradeState: setTrade [set-trade]
  ```
- The plan incorrectly assumed `set-trade` was not in contract; this blocks `TradeState` construction.
- This is a **machine contract violation** — cannot proceed without using this approved method.

---

### ✅ Valid — Blocking: Use of unapproved `ProductIdentifier` and `ProductTaxonomy`

> **Critique**: Recipe requires `ProductIdentifier`/`ProductTaxonomy`, but they are **not approved**.

✅ **VALID / BLOCKING**
- Evidence: `get_approved_cdm_api_contract` → both `ProductIdentifier` and `ProductTaxonomy` are **absent** from approved classes.
- `get_cdm_builder_methods(..., 'ProductIdentifier')` returns: `ERROR: Class is not approved`.
- The plan cannot use classes outside `approved-cdm-api-contract-summary.md`.
- This is a **machine contract violation**.

---

### ❌ Invalid — Intent-based method mismatch for `TradeIdentifier.set-identifier`

> **Critique**: “`set-identifier` intent not found; only `addAssignedIdentifier`, `setAssignedIdentifier`, `setIdentifierType` exist.”

❌ **INVALID / NON-BLOCKING**
- `approved-cdm-api-contract-summary.md` lists:
  ```
  cdm.event.common.TradeIdentifier: addAssignedIdentifier [set-identifier], setAssignedIdentifier [set-identifier], setIdentifierType [set-identifier]
  ```
- Intent-based naming (`[set-identifier]`) is intentional and matches semantic recipes.
- Java builder calls use intent-agnostic names, but intent contract is stable.
- This is **not a blocking issue**; it’s a documentation mismatch, not a feasibility gap.

---

### ❌ Invalid — Intent-based mismatch for `Payout.set-settlement-payout`

> **Critique**: “`set-settlement-payout` intent not found.”

❌ **INVALID / NON-BLOCKING**
- `approved-cdm-api-contract-summary.md` explicitly lists:
  ```
  cdm.product.template.Payout: setSettlementPayout [set-settlement-payout]
  ```
- Intent mapping is correct; method name mismatch is expected.
- This is **not a blocker**.

---

### ❌ Invalid — Intent-based mismatch for `ReferenceWithMetaParty.setValue`

> **Critique**: “`set-party` intent not found.”

❌ **INVALID / NON-BLOCKING**
- `ReferenceWithMetaParty` uses `.setValue(Party)` — Rosetta builder intent `set-party` → actual `setValue`.
- `approved-cdm-api-contract-summary.md` does not explicitly list it, but:
  - It **is approved** as a class (`cdm.base.staticdata.party.metafields.ReferenceWithMetaParty`).
  - Builder pattern supports `setValue(...)` (standard Rosetta practice).
- This is **not a blocker**.

---

### ❌ Invalid — Intent-based mismatch for `ResolvablePriceQuantity.set-price-quantity`

> **Critique**: `set-price-quantity` intent not found for `ResolvablePriceQuantity`.

❌ **INVALID / NON-BLOCKING**
- `approved-cdm-api-contract-summary.md` lists:
  ```
  cdm.product.template.SettlementPayout: setPriceQuantity [set-price-quantity]
  ```
- Builder chain is `SettlementPayout.builder().setPriceQuantity(…).build()`.
- Plan should not attempt `ResolvablePriceQuantity.setPriceQuantity(...)` — it doesn’t — so no misstep.
- This is **not a blocker**.

---

### ❌ Invalid — Intent-based mismatch for `Trade.set-product`/`set-contract-details`/`set-party`

> **Critique**: Intent-based names (`set-product`, `set-contract-details`, `set-party`) not found.

❌ **INVALID / NON-BLOCKING**
- `approved-cdm-api-contract-summary.md` lists all of these with exact intent:
  ```
  cdm.event.common.Trade: setProduct [set-product], setContractDetails [set-contract-details], addParty [set-party], ...
  ```
- Intent mapping is explicit and correct.
- Method names are intent-agnostic; intent contract is authoritative.
- This is **not a blocker**.

---

### ❌ Invalid — Intent-based mismatch for `TradeState.set-trade`

> **Critique**: Claims `set-trade` is not in contract.

❌ **INVALID / NON-BLOCKING** — *but* this is **overruled by the earlier blocking issue**, which *was* valid.
- Re-evaluated: `get_cdm_builder_methods(..., 'set-trade')` → `setTrade(...)`.
- The **original critique** (not this later one) was correct: the plan wrongly rejected a critical method.
- That critique is **still valid** and **blocking**, as confirmed by approval evidence.

---

### ❌ Invalid — Missing `cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate`

> **Critique**: Plan mentions this class, but `resolve_cdm_concept` fails.

✅ **PARTIALLY VALID**
- `resolve_cdm_concept('AdjustableOrAdjustedDateOrRelativeDate')` → `ERROR: missing`
- `get_cdm_builder_methods(..., 'AdjustableOrAdjustedDateOrRelativeDate')` → `Class is not approved`
- `cdm.base.datetime.AdjustableOrAdjustedDateOrRelativeDate` is **not approved**, nor is `AdjustableOrAdjustedDate` or `AdjustableOrRelativeDateOrExpression` in `approved-cdm-api-contract-summary.md`.
- However: `MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate` Rosetta function is present.
- **Resolution**: The plan must use `AdjustableOrAdjustedDate` (which *is* approved), and Rosetta will convert it to the intermediate type internally.
- Since Rosetta handles the type mapping, Java side only needs `AdjustableOrAdjustedDate`.
- This is **not a blocking issue** — just a phrasing ambiguity in the plan.

---

### ✅ Valid — Missing `TradeIdentifier` builder methods for `set-identifier`

> **Critique**: Intent `set-identifier` not found.

✅ **VALID / NON-BLOCKING**
- `approved-cdm-api-contract-summary.md` lists:
  ```
  cdm.base.staticdata.identifier.Identifier: addAssignedIdentifier [set-identifier], setAssignedIdentifier [set-identifier]
  ```
- Intent contract is correct; method names are intent-agnostic.
- This is **not a blocker**.

---

## Final Evaluation

### Critical Blockers (Machine-Contract Violations)

| # | Issue | Status |
|---|-------|--------|
| 1 | Incorrect rejection of `TradeState.setTrade(...)` | ✅ **BLOCKING** |
| 2 | Use of unapproved `ProductIdentifier`/`ProductTaxonomy` | ✅ **BLOCKING** |

These are **machine-contract failures**, not wording issues. The plan cannot proceed without fixing them.

### Non-Blocking Issues

- All intent-based naming mismatches are **expected** and **documented** in the contract.
- All missing `build-root` intent reports are **false negatives** — `.build()` is implicit and not required to be listed.
- All `ReferenceWithMetaParty.setValue`, `PriceSchedule`, etc., are approved classes — intent mapping is contractually stable.

### Final Verdict

**Decision: NEXT_ROUND_REQUIRED**

- Round 3 is final, but this plan **must** be fixed before implementation.
- The plan *was* close to acceptable, but two **blocking contract violations** remain:
  1. Rejecting `setTrade(...)` in `TradeState` — the primary way to construct `TradeState`.
  2. Referencing unapproved `ProductIdentifier`/`ProductTaxonomy`.

- A new round is required to:
  - Explicitly use `TradeState.builder().setTrade(...).build()`.
  - Remove all references to `ProductIdentifier`/`ProductTaxonomy`, and instead rely on `ProductIdentifierList` → `Trade.tradeIdentifier` as *already approved* (via `TradeIdentifier`).
  - Fix `AdjustableOrAdjustedDateOrRelativeDate` phrasing to use only `AdjustableOrAdjustedDate`.

---

## Revised Implementation Checklist

✅ Must-pass checks before implementation (not conditions):

1. **`TradeState` construction**  
   - Use: `TradeState.builder().setTrade(trade).build()`  
   - Use `Trade.builder().setProduct(...).setContractDetails(...).addCounterparty(...).build()`  
   - Confirm intent contract: `setTrade [set-trade]`, `setProduct [set-product]`, `setContractDetails [set-contract-details]`, `setParty [set-party]`, etc.

2. **Product identifiers**  
   - Use `TradeIdentifier` (approved), not `ProductIdentifier`/`ProductTaxonomy` (unapproved).  
   - Build `TradeIdentifier` via `addAssignedIdentifier(...)`, `setAssignedIdentifier(...)`, `setIdentifierType(...)`.

3. **Party references**  
   - Use `ReferenceWithMetaParty.setValue(Party)` (approved class, valid builder).  
   - Ensure `PartyIdentifier.setIdentifier(...)` uses intent-agnostic methods: `setIdentifier(...)`, `setIdentifierType(...)`, etc.

4. **Date handling**  
   - Use only `AdjustableOrAdjustedDate` (approved).  
   - Do not reference `AdjustableOrAdjustedDateOrRelativeDate`, `AdjustableOrRelativeDateOrExpression`, or unapproved date types.

5. **Rosetta traceability**  
   - For each Rosetta function block (e.g., `MapFxSingleLegNonTransferableProduct`), map to corresponding builder calls (not generic descriptions).
   - E.g., for `MapTrade`, use `Trade.builder(...).build()`, then wrap in `TradeState.builder().setTrade(...).build()`.

6. **No use of unapproved classes**  
   - Cross-check every type against `approved-cdm-api-contract-summary.md`.  
   - No fallback to `ProductIdentifier`, `ProductTaxonomy`, or `AdjustableOrAdjustedDateOrRelativeDate`.

---

✅ If all above are satisfied in next round, the plan will be **ACCEPTED**.
```