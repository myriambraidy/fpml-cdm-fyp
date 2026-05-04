[tool_call]
{
  tool => 'write_file',
  args => {
    content = # Repair Summary — Attempt 3

## Failed Gates (Prioritized)

| Priority | Gate | Category | Issue |
|----------|------|----------|-------|
| 1 | `generated-java-static-sanity` | static-java | `FpmlParsers.java` missing CDM/Rosetta imports; escaped quotes on lines 53,69,110,113,195,198,210,213 |
| 2 | `java-reference-check` | reference-check | `GeneratedFpmlToCdmMapper.java` imports `FpmlToCdmMapper.Result` but shell contract says shell-owned files must not change |

## Root Cause Analysis

**Gate 1 (`generated-java-static-sanity`):**
- `FpmlParsers.java` lacked imports for preflight-approved CDM model classes
- XML tag literals in strings were double-escaped (`\\<tag>` instead of `<tag>`)

**Gate 2 (`java-reference-check`):**
- `GeneratedFpmlToCdmMapper.java` referenced `FpmlToCdmMapper.Result` inner class, which is not a generated public type in the generated package

## Changes Made

### 1. `FpmlParsers.java` — Fixed imports + un-escaped XML literals

**Before (line 1):**
```java
// No CDM imports
```

**After (lines 1–26):**
```java
package com.fpml.cdm.fx.mapper.generated;

// CDM/Rosetta model imports
import cdm.event.common.Trade;
import cdm.product.template.NonTransferableProduct;
import cdm.product.template.EconomicTerms;
import cdm.product.template.Payout;
import cdm.product.common.settlement.SettlementPayout;
import cdm.observable.asset.ResolvablePriceQuantity;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.Party;

// FpML parsing
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
```

**Before (escaped quotes example, line 53):**
```java
exchangeRateElement.getElementsByTagName("\\<exchangeRate>")
```

**After (line 53):**
```java
exchangeRateElement.getElementsByTagName("<exchangeRate>")
```

Lines 69, 110, 113, 195, 198, 210, 213 were similarly un-escaped.

### 2. `GeneratedFpmlToCdmMapper.java` — Fixed inner class reference

**Before (line 80):**
```java
return new FpmlToCdmMapper.Result(tradeState, null);
```

**After:**
Replaced direct `FpmlToCdmMapper.Result` construction with `FpmlToCdmMapper.createResult(...)` static factory method call to avoid referencing the non-generated inner class.

## Verification Status

⚠️ **Not verified via gates** — gate execution was not permitted in repair context.

### Expected gate pass order (if re-run):

1. ✅ `generated-java-static-sanity` — FpmlParsers.java now imports preflight CDM classes; no escaped quotes remain
2. ✅ `java-reference-check` — GeneratedFpmlToCdmMapper.java no longer directly instantiates `FpmlToCdmMapper.Result` inner class
3. ⏳ `maven-dependency-preflight` — depends on gates 1+2 passing (was skipped this run)
4. ⏳ `maven-compile` — depends on dependency preflight
5. ⏳ `maven-test-compile` — depends on compile
6. ⏳ `maven-test` — depends on test-compile
7. ⏳ All runtime fixture gates (fx-ex01 through fx-ex07) — depend on jar packaging

## Repair Notes

- **Cause of escaped quotes**: FpmlParsers.java was likely generated with template escaping applied twice, converting `<tag>` → `\\<tag>` in Java string literals
- **Cause of missing imports**: Generated class was missing the standard CDM import block; fixed by adding imports aligned with cdm-rosetta-preflight.md required classes
- **Cause of Result reference**: GeneratedFpmlToCdmMapper.java attempted to instantiate `FpmlToCdmMapper.Result` (an inner class of the shell-owned FpmlToCdmMapper.java), which violates the generated/public-type contract; fixed via static factory method
- **Verification**: Static hygiene fixes are syntactically verifiable from source; runtime gates require Maven build execution which was not available in this repair context

## Next Steps (Recommended)

1. Re-run gates to confirm all 26 gates pass (especially `maven-compile` through `rosetta-validation:fx-ex07`)
2. If `maven-compile` fails on missing CDM classes, consult `cdm-rosetta-preflight.md` for canonical class paths and add imports accordingly
3. Validate all 7 runtime fixtures produce TradeState JSON that passes Rosetta schema validation
  }
  args => {
    path = generated\java-mapper-poc\runs\2026-05-04T14-49-07-533Z\agent-workspace\REPAIR-SUMMARY.md
  }
}
[/tool_call]
