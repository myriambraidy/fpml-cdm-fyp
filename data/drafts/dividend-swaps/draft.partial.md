# Agent Mapping Playbook: dividend-swaps

## 1. Scope

- Folder: `dividend-swaps`
- FPML root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\fpml`
- CDM root: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel`
- Run date: `2026-04-26`
- Pairing source: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`

## 2. Evidence Coverage

- Total FpML files in folder: `3`
- Matched pairs selected: `3`
- Structural evidence basis: `3/3` matched pairs
- Semantic evidence basis: `0/3` pair analyses
- Full semantic analyses: `0`
- Salvaged semantic analyses: `0`
- Failed semantic pair analyses: `3`
- Missing counterparts: `0`
- Ignored pairs: `0`
- Exact matches: `3`
- Normalized matches: `0`
- Alias matches: `0`
- Structural basis note: Structural summaries are computed from all 3/3 matched pairs, including pairs without semantic extraction.
- Semantic basis note: Semantic rules are computed from 0/3 successful or salvaged pair analyses (0 full, 0 salvaged).

## 3. Included Examples

- `dividend-swaps/div-ex01-dividend-swap.xml` -> `dividend-swaps/div-ex01-dividend-swap.json` (`exact`)
- `dividend-swaps/div-ex02-dividend-swap-collateral.xml` -> `dividend-swaps/div-ex02-dividend-swap-collateral.json` (`exact`)
- `dividend-swaps/div-ex03-dividend-swap-short-form-japanese-underlyer.xml` -> `dividend-swaps/div-ex03-dividend-swap-short-form-japanese-underlyer.json` (`exact`)

## 4. Ignored or Missing Examples

### 4.1 Missing counterparts

- None observed.

### 4.2 Ignored despite match candidate

None observed.

## 5. Structural Baseline From All Matched Pairs

### 5.1 Repeated FpML header and boilerplate

- /FpML/header/messageId
- /FpML/header/sentBy
- /FpML/header/sendTo
- /FpML/header/creationTimestamp
- /FpML/trade/tradeHeader/partyTradeIdentifier
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/partyReference
- /FpML/trade/tradeHeader/partyTradeIdentifier[0]/tradeId
- /FpML/trade/tradeHeader/partyTradeIdentifier[1]/partyReference

### 5.2 Repeated top-level sections

- `header` appears in `3/3` examples
- `party` appears in `3/3` examples
- `trade` appears in `3/3` examples

### 5.3 Repeated nested structures

- trade > dividendSwapTransactionSupplement (50 paths)
- trade > tradeHeader (6 paths)
- party > partyId (2 paths)
- header > creationTimestamp (1 paths)
- header > messageId (1 paths)
- header > sendTo (1 paths)
- header > sentBy (1 paths)
- trade > collateral (15 paths)

### 5.4 Optional but common FpML sections

- None observed.

### 5.5 Repeated CDM top-level sections

- `meta` appears in `3/3` examples
- `trade` appears in `3/3` examples

### 5.6 Repeated CDM wrappers and scaffolding

- trade > product (66 paths)
- trade > tradeLot (36 paths)
- trade > tradeIdentifier (21 paths)
- trade > party (13 paths)
- trade > counterparty (7 paths)
- trade > tradeDate (3 paths)
- meta > globalKey (1 paths)
- trade > meta (1 paths)

### 5.7 Optional but common CDM sections

- None observed.

## 6. Semantic Mapping Signals

### 6.1 Stable mapping patterns

No strong evidence yet.

### 6.2 Repeated non-literal transformations

No strong evidence yet.

### 6.3 Tentative and emerging signals

No repeated tentative signals were recovered yet.

### 6.4 Folder-level principles

- No semantic synthesis was recovered for this folder; only deterministic structure is available.

### 6.5 Variants and exceptions

No strong evidence yet.

### 6.6 Suspected enrichment or default behavior

No strong evidence yet.

## 7. Agent Playbook

- Summary: Structural summaries are computed from all 3/3 matched pairs, including pairs without semantic extraction. Semantic rules are computed from 0/3 successful or salvaged pair analyses (0 full, 0 salvaged).

### Canonical Steps

- Start from the repeated FPML sections seen across matched files: header, party, trade.
- Map trade identifiers, party references, and trade dates before product-specific economics.
- Use pair-level examples as tentative guidance; no repeated folder-wide rules were recovered yet.
- Watch for non-literal reshaping and confirm it from pair-level examples before generalizing.
- Assemble the result under repeated CDM scaffolding such as meta, trade.
- Treat generated identifiers, global keys, and unmatched party identifiers as enrichments unless the source proves otherwise.

### Recurring Rules

- No repeated semantic rules recovered yet.

### Transformation Patterns

- No repeated transformation patterns recovered yet.

### Product-Specific Branches

No product-specific branches recovered yet.

### Validation Checks

- Check unresolved question: No semantic synthesis was recovered for this folder; mapping rules remain tentative.

### Do Not Assume

- Do not assume every repeated wrapper or metadata field implies a semantic mapping rule.

## 8. Pair-Level Worked Examples

No strong evidence yet.

## 9. Open Questions And Risks

- No semantic synthesis was recovered for this folder; mapping rules remain tentative.

## 10. Draft Conclusion

- Most reusable findings:
  - Deterministic structural summaries were generated for the matched pairs.
- What seems safe to generalize:
  - Repeated top-level structure can be reused as initial folder scaffolding.
- What should remain tentative:
  - Semantic mapping rules still need stronger evidence before they are treated as folder-wide defaults.

## 11. Source Appendix

- Manifest used: `C:\Users\User\Desktop\fpml-cdm-fyp\data_to_learn_from\cdm_parallel\manifest.json`
- Included pair count: `3`
- Successful semantic pair count: `0`
- Full semantic pair count: `0`
- Salvaged semantic pair count: `0`
- Failed semantic pair count: `3`
- Ignored pair count: `0`
- Notes:
  - Included pairs: 3
  - Ignored pairs: 0
  - Semantic pair analyses recovered: 0
  - Tentative repeated semantic signals: 0
