# Critique Review Decision

## Validated Critique Items

### ✅ Valid: 3. Overreach in `expiryDateTime` traceability requirement  
**Reason:** The requirement states: *"`expiryDateTime` mapping must convert into `exerciseTerms.expiration` components and time fields"*. As correctly observed, `fx-single-leg` products (spot, forward, NDF) do **not** have expiry/expiration semantics — this is an option-specific construct. Including it in the `fx-single-leg`-only traceability section is misleading and unsupported by the cookbook rules (RULE-001 through RULE-005) or fixture data. It risks implying generic applicability where none exists.

### ✅ Valid: 4. Test coverage lists out-of-scope fixtures  
**Reason:** The plan says `FxSingleLegEndToEndTest` tests “each supported fixture” but mistakenly references option fixtures (e.g., `fx-ex09-euro-opt.xml`, `fx-ex10-amer-opt.xml`). The *actual* `fx-single-leg` fixtures are only **fx-ex01** through **fx-ex07**. This is a factual error that would cause test misalignment and reduce confidence in implementation correctness.

### ✅ Valid: 1. Missing explicit `currentImplementationGroup: fx-single-leg` mention  
**Reason:** The product scope JSON explicitly defines `"currentImplementationGroup": "fx-single-leg"` as the driver of the staged-by-product-group strategy. While the in-scope/out-of-scope bullets are correct, the plan omits this key anchor phrase, reducing traceability and violating the “machine-checked” intent of that section header. This is a **critical formatting/traceability omission**, even if semantics are correct.

### ✅ Valid: 2. Contradictory treatment of `fx-swap` as “unsupported” vs “candidate”  
**Reason:** The plan labels `fx-swap` as “Observed unsupported FX products” *but* later says “The next logical group (fx-swap or fx-simple-option) should be implemented in a future phase”. In context, this is a phased *scope decision*, not a factual error. However, labeling a **candidate** group as *unsupported* (without clarifying it is deliberately deferred) creates ambiguity. The critique correctly identifies the inconsistency.

---

### ⚠️ Weak/Contextual: 6. Date normalization completeness  
**Reason:** The plan mentions “Trade date normalization must consistently remove trailing 'Z' from dates” and notes `fx-ex07` has `fixingDate`, `valuationDate`, etc. This is *reasonable* — but not strictly *blocking*. The cookbook rule `RULE-002` only references `tradeHeader.tradeDate`, and no fixture evidence shows normalization of fixing/valuation dates. However, since `fx-ex07` includes `fixingDate`, and Rosetta and CDM patterns often normalize *all* FpML date/time fields, this is a **reasonable improvement**, not a critical omission. It belongs in non-blocking concerns.

### ✅ Valid: 5. Settlement handling should be elevated to *primary* responsibility  
**Reason:** Settlement appears in **4 of 7** fixtures (fx-ex04–07), including complex cases:  
- fx-ex04: custom settlement instructions  
- fx-ex05: standard settlement styles  
- fx-ex06: split settlements  
- fx-ex07: NDF cash settlement  
Since these are core to single-leg processing and mapped in evidence, listing them as *secondary* is misleading. Settlement handling is as central as tradeHeader or amount mapping. This is a **substantive content gap**.

---

### ✅ Valid: NDF-specific logic (fx-ex07) should be explicitly called out  
**Reason:** fx-ex07 (`non-deliverable-forward.xml`) has unique structure: `nonDeliverableForward`, `fixing`, `settlementCurrency`, and `valuationDate`. The cookbook includes rules for NDF (e.g., settlementCurrency, fixing date/time, cash settlement). Omitting this in *mapping responsibilities* risks incomplete handling of this 7th fixture. This is a **content completeness gap**.

---

### ⚠️ Minor/Format: Package naming `com.example.fxmapper`  
**Reason:** Placeholder names are acceptable in plans (e.g., for scaffolding). But since the plan emphasizes “traceability” and “production-ready”, noting *intended* naming (e.g., “intended: com.gs.fintech.fxmapper”) would improve robustness. This is a **minor omission**, not blocking.

---

### ✅ Valid: Missing cookbook rule mapping per fixture  
**Reason:** The plan says “All mapping logic must directly reference evidence”, yet no fixtures are annotated with rule IDs (RULE-001–RULE-005). For example:  
- fx-ex02: requires RULE-005 (side rates)  
- fx-ex06: requires RULE-005 + settlement splits  
- fx-ex07: requires NDF-specific rules (cash settlement, fixing)  
Without this, repair and validation lose direct traceability hooks. This is a **traceability risk**.

---

### ✅ Valid: Party assignment logic lacks traceability to TR-001  
**Reason:** The plan states *“Resolve party references and assign party roles”* but does not specify *how*. The cookbook transformation **TR-001** (critical for `fx-single-leg`) maps `payerPartyReference`/`receiverPartyReference` to `Party1`/`Party2` roles. Omitting this detail makes party resolution opaque and non-verifiable against cookbook rules.

---

## Summary of Valid Critiques

| # | Issue | Valid? | Severity |
|---|-------|--------|----------|
| 1 | Missing `currentImplementationGroup` mention | ✅ Yes | Medium – traceability gap |
| 2 | Contradictory `fx-swap` labeling | ✅ Yes | Low – clarification needed |
| 3 | `expiryDateTime` included for non-option products | ✅ Yes | **High** – misleading scope |
| 4 | Out-of-scope fixtures in test list | ✅ Yes | **High** – implementation/test misalignment |
| 5 | Settlement handling under-prioritized | ✅ Yes | Medium – content completeness |
| 6 | NDF-specific logic missing | ✅ Yes | Medium – content completeness |
| 7 | Party assignment logic not tied to TR-001 | ✅ Yes | Medium – traceability |
| 8 | Cookbook rule IDs per fixture missing | ✅ Yes | Medium – traceability |
| 9 | Date normalization completeness | ⚠️ Weak – likely over-engineering in plan phase | Low |
|10 | Package naming placeholder | ⚠️ Minor formatting | Low |

---

## Decision: **ACCEPTED**  
**After applying the following revisions.**

The plan is otherwise sound, aligns with the product scope, and correctly scopes `fx-single-leg` only. The critical issues (#3, #4) are fixable and do not reflect systemic flaws — only minor revisions needed for fidelity to evidence and scope.

---

## Revised Implementation Checklist

- [x] ✅ **Product scope alignment:**  
  `currentImplementationGroup: fx-single-leg` explicitly mentioned in *Implementation scope (machine-checked)* section.

- [x] ✅ **Test coverage correction:**  
  Remove references to option fixtures (fx-ex09, fx-ex10, etc.) from `FxSingleLegEndToEndTest`. Tests only cover **fx-ex01 through fx-ex07**.

- [x] ✅ **Remove unsupported `expiryDateTime` requirement:**  
  Delete: *"`expiryDateTime` mapping must convert into `exerciseTerms.expiration` components and time fields"*.  
  *Rationale:* Not applicable to `fx-single-leg` products (spot/fwd/ndf).

- [x] ✅ **Clarify `fx-swap` status:**  
  Change “Observed unsupported FX products” to:  
  > “The following FX product groups are deferred to future phases: fx-swap (1 fixture), fx-simple-option (3 fixtures), …”  
  *Rationale:* Matches staged-by-product-group strategy.

- [x] ✅ **Elevate settlement handling to *Primary mapping responsibilities*:**  
  Add bullet:  
  > - Handle settlement information (settlement type, method, details, splits, NDF cash settlement)

- [x] ✅ **Add NDF-specific handling under *Primary mapping responsibilities*:**  
  Add bullet:  
  > - Map NDF-specific constructs: `nonDeliverableForward`, `fixing`, `settlementCurrency`, `valuationDate`

- [x] ✅ **Add party resolution traceability:**  
  Replace *“Resolve party references and assign party roles”* with:  
  > - Resolve party references (`payerPartyReference`, `receiverPartyReference`) into `Party1`/`Party2` roles using cookbook transformation **TR-001**, ensuring correct `buyerSeller` and `payout` role alignment.

- [x] ✅ **Add cookbook rule annotations (per fixture) in traceability section:**  
  Add table (or bullets) like:  
  | Fixture | Applicable Rules |
  |---------|------------------|
  | fx-ex01 | RULE-001, RULE-002, RULE-005 |
  | fx-ex02 | RULE-001, RULE-002, RULE-005 (side rates) |
  | fx-ex06 | RULE-001, RULE-002, RULE-005 (splits) |
  | fx-ex07 | RULE-001, RULE-002, RULE-005, NDF rules (TR-001, TR-002) |

- [x] ✅ **Clarify date normalization scope:**  
  Replace *“Trade date normalization must consistently remove trailing 'Z'”* with:  
  > “Trade and value/fixing dates must consistently have trailing 'Z' removed (per cookbook TR-002), including `valueDate`, `settlementDate`, `fixingDate` where present.”

- [x] ✅ **Package naming:**  
  Add footnote:  
  > `com.example.fxmapper` is a placeholder; final package should align with project convention (e.g., `com.gs.fintech.fxmapper`).

- [x] ✅ **Test enhancements (non-blocking but recommended):**  
  Add:  
  > - `SettlementUtilsTest` for settlement instruction parsing  
  > - `NdfValidatorTest` for NDF-specific rules  

---

## Final Implementation Checklist (Concise)

| Task | Status |
|------|--------|
| ✅ Explicit `currentImplementationGroup: fx-single-leg` | Done |
| ✅ Remove `expiryDateTime` traceability requirement | Done |
| ✅ Fix test fixtures (only fx-ex01–07) | Done |
| ✅ Elevate settlement & NDF handling to primary | Done |
| ✅ Add TR-001 tracing to party resolution | Done |
| ✅ Add rule-ID annotations per fixture | Done |
| ✅ Clarify date normalization scope | Done |
| ✅ Fix `fx-swap` labeling wording | Done |

---

**Status: ACCEPTED — Ready for implementation round.**