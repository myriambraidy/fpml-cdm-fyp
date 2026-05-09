# Final Build Report

**Run ID**: `2026-05-05T18-44-05-679Z`  
**Product Family**: `fx-derivatives`  
**Status**: ❌ **BLOCKED**

---

## Summary

The generated Java mapper project **failed final validation gates** and is **not promoted**.

Only **3 of 28 gates passed**, and the project was blocked due to repeated failures during repair attempts on two gates:
- `java-reference-check`
- `cdm-java-api-usage`

No Maven build gates (`maven-compile`, `maven-package`, etc.) could be executed because earlier gates failed.

---

## Failed Gates

### 1. `cdm-java-api-usage` *(Final blocking gate)*  
**Exit Code**: `1`  
**Category**: **CDM API Compliance Violation**

#### Issues Found

Generated file:  
`src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java`

| Line | CDM Import | Code |
|------|------------|------|
| 8 | `cdm.event.common.ContractDetails` | `cdm_import_not_in_prompt_seed` |
| 12 | `cdm.product.template.SettlementPayout` | `cdm_import_not_in_prompt_seed` |
| 13 | `cdm.product.template.Underlier` | `cdm_import_not_in_prompt_seed` |
| 14 | `cdm.product.common.settlement.SettlementTerms` | `cdm_import_not_in_prompt_seed` |
| 16 | `cdm.product.common.settlement.ResolvablePriceQuantity` | `cdm_import_not_in_prompt_seed` |
| 17 | `cdm.product.common.settlement.SettlementTypeEnum` | `cdm_import_not_in_prompt_seed` |
| 18 | `cdm.product.common.settlement.SettlementDate` | `cdm_import_not_in_prompt_seed` |
| 19 | `cdm.product.common.settlement.CashSettlementTerms` | `cdm_import_not_in_prompt_seed` |
| 21 | `cdm.base.staticdata.party.PartyIdentifier` | `cdm_import_not_in_prompt_seed` |
| 24 | `cdm.base.staticdata.party.PayerReceiver` | `cdm_import_not_in_prompt_seed` |
| 27 | `cdm.base.staticdata.asset.common.Asset` | `cdm_import_not_in_prompt_seed` |
| 28 | `cdm.base.staticdata.asset.common.Cash` | `cdm_import_not_in_prompt_seed` |
| 32 | `cdm.observable.asset.PriceSchedule` | `cdm_import_not_in_prompt_seed` |
| 34 | `cdm.observable.asset.metafields.ReferenceWithMetaObservable` | `cdm_import_not_in_prompt_seed` |
| 35 | `com.rosetta.model.metafields.FieldWithMetaString` | `cdm_import_not_in_prompt_seed` |
| 37 | `com.rosetta.model.lib.records.Date` | `cdm_import_not_in_prompt_seed` |

Additionally:

- Line 15: `cdm.product.common.settlement.SettlementPayout` — **exact_missing_cdm_class_reference**
- Line 37: `com.rosetta.model.lib.records.Date` — **exact_missing_cdm_class_reference**

#### Root Cause

The generator violated the **CDM prompt seed policy**, which restricts imports to only those explicitly declared for the product scope (`fx-derivatives`). This indicates the generator either:
- Over-extended the scope of generated classes,
- Failed to sanitize imports based on the known product-specific CDM subset, or
- Used CDM classes not present in the target CDM Java JAR (`org.finos.cdm:cdm-java:6.7.0`), especially `SettlementPayout` and `Date`.

---

### 2. `java-reference-check` *(Initial failure, resolved in repair attempt 3)*  
**Status**: Initially failed → Passed after repair attempt 2  
**Note**: This gate passed after the first two repair attempts, but revealed deeper issues exposed by `cdm-java-api-usage`.

---

## Passed Gates (3)

| Gate | Status |
|------|--------|
| `typescript-typecheck` | ✅ passed |
| `cdm-rosetta-preflight` | ✅ passed (CDM dependency `6.7.0` confirmed) |
| `generated-project-structure` | ✅ passed |
| `generated-shell-contract` | ✅ passed |
| `source-hygiene` | ✅ passed |
| `generated-java-static-sanity` | ✅ passed |

---

## Downstream Gates Skipped (9 gates)

All Maven and runtime gates were skipped due to earlier failures:

- `maven-dependency-preflight`
- `maven-compile`
- `maven-test-compile`
- `maven-test`
- `maven-package`
- All 7 `jar-runtime:*` runtime tests
- `output-validation`
- All 7 `rosetta-validation:*` tests

---

## Repair Attempts

| Attempt | Failed Gate(s) | Outcome |
|---------|----------------|---------|
| 1 | `java-reference-check` | ❌ Failed — gate still failed |
| 2 | `java-reference-check` | ❌ Failed — gate still failed |
| 3 | `cdm-java-api-usage` | ❌ Failed — final blocker |

**Max repair attempts exhausted**.

---

## Required Fixes

To unblock this build, the following must be addressed:

### ✅ Fix: Align imports with product-scope CDM seed policy
- Only import CDM classes that are **explicitly listed** in the `fx-derivatives` product scope (e.g., via `product-scope.json` or `seed.json`).
- Remove or replace the following imports (and corresponding usages) if not in seed:
  - `cdm.event.common.ContractDetails`
  - `cdm.product.template.SettlementPayout`
  - `cdm.product.template.Underlier`
  - `cdm.product.common.settlement.*`
  - `cdm.base.staticdata.party.*`
  - `cdm.base.staticdata.asset.common.*`
  - `cdm.observable.asset.*`
  - `com.rosetta.model.lib.records.Date`
  - `com.rosetta.model.metafields.FieldWithMetaString`

### ✅ Fix: Ensure all CDM references exist in compiled `cdm-java:6.7.0`
- Resolve missing classes (`SettlementPayout`, `Date`) — verify whether:
  - They exist under a different package name,
  - They were removed/renamed in `6.7.0`, or
  - Their usage is not required for `fx-derivatives` mappers.

> 🔔 **Recommended action**: Regenerate mapper code **using the latest validated prompt seed** and/or restrict the `GeneratedFpmlToCdmMapper` to only use **CDM classes known to be part of the fx-derivatives product model**.

---

## Recommendation

> 🚫 **DO NOT promote** the JAR artifact.  
> 🔧 **Repair and re-run** after:
> 1. Regenerating the Java mapper with restricted CDM imports,
> 2. Validating against the `cdm-java-api-usage` gate *before* committing to a new run.

---

*Generated by Build Reviewer*  
*Date: 2026-05-05T18:59:19Z*