# Planner Plan

**Run id:** 2026-05-10T12-19-47-654Z  
**Product family:** fx-derivatives  
**Implementation group (current):** fx-single-leg  
**Planning round:** 01  
**Status:** ready for implementer

## Implementation scope (machine-checked)
**Product family:** fx-derivatives  
**In scope (implementation groups):**  
- fx-single-leg  
**Explicitly out of scope (implementation groups):**  
- fx-swap  
- fx-simple-option  
- fx-digital-option  
- fx-barrier-option  
- fx-average-rate-option  
- fx-strategy  
- non-fx  

## Runtime supported fixtures (machine-checked)
- fx-ex01-fx-spot  
- fx-ex02-spot-cross-w-side-rates  
- fx-ex03-fx-fwd  
- fx-ex04-fx-fwd-w-settlement  
- fx-ex05-fx-fwd-w-ssi  
- fx-ex06-fx-fwd-w-splits  
- fx-ex07-non-deliverable-forward  

## Java shell contract (machine-checked)
**Generated package:** com.fpml.cdm.fx.mapper.generated  
**Main generated class:** GeneratedFpmlToCdmMapper  
**Required interface:** com.fpml.cdm.fx.mapper.FpmlToCdmMapper  
**Generated source root:** src/main/java/com/fpml/cdm/fx/mapper/generated/  
**Shell-owned files must not be rewritten:**  
- pom.xml  
- src/main/java/com/fpml/cdm/fx/mapper/Main.java  
- src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java  
- src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java  

## Rosetta evidence coverage (machine-checked)
**product-root:**  
- MapFxSingleLegNonTransferableProduct  
**economic-terms:**  
- MapFxSingleLegEconomicTerms  
**settlement-payout:**  
- MapFxCoreDetailsModelToSettlementPayout  
**price-quantity:**  
- MapFxSingleLegPriceQuantityList  
- MapFxCoreDetailsModelPriceListWithLocation  
- MapFxCoreDetailsModelQuantityListWithLocation  
**party-counterparty:**  
- MapFxSingleLegCounterpartyList  
- MapFxSingleLegAncillaryPartyList  
**account-party-reference:**  
- MapFxSingleLegAccountPartyReference  
- MapPayerReceiverToAccountPartyReference  
**product-identifiers-taxonomy:**  
- MapProductIdentifierList  
- MapProductTaxonomyList  
**dates-settlement:**  
- MapFxCoreDetailsModelToSettlementPayout  
- MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate  

## Overview

This plan targets the **fx-single-leg** implementation group, covering 7 runtime fixtures in the FX derivatives family. The mapping follows Rosetta-native semantics, prioritizes the approved CDM Java contract, and uses the runtime fixture list strictly as the supported surface.

The plan maps XML to an internal CDM representation (cdm.event.common.TradeState), then serializes it to JSON at the runtime boundary. Jackson is allowed only for final output and sidecar traceability reports. FpML input is consumed via DOM/StAX parsing; no FpML Java DTOs are assumed.

Approved CDM builder methods, construction order, and Rosetta function traces are governed by agent-workspace/approved-cdm-api-contract-summary.md and agent-workspace/semantic-recipes.md.

## Summary of mapping responsibilities

| Mapping area | Rosetta function(s) | Java responsibilities |
|--------------|---------------------|-----------------------|
| Parties and identifiers | MapFxSingleLegCounterpartyList, MapFxSingleLegAncillaryPartyList, MapPayerReceiverToAccountPartyReference | Build Party, PartyIdentifier, AssignedIdentifier, AncillaryParty; link accounts and parties via metafields |
| Trade identifiers | MapTradeIdentifierList (not exposed) | Preserve source trade identifiers in traceability reports |
| Product root | MapFxSingleLegNonTransferableProduct | Build NonTransferableProduct with identifiers and taxonomy |
| Economic terms | MapFxSingleLegEconomicTerms | Parameter-only EconomicTerms in this run |
| Payout and settlement | MapFxCoreDetailsModelToSettlementPayout | Build SettlementPayout; attach PriceSchedule and Underlier via approved builders |
| Price and quantity | MapFxSingleLegPriceQuantityList, MapFxCoreDetailsModelPriceListWithLocation, MapFxCoreDetailsModelQuantityListWithLocation | Parameter-only ResolvablePriceQuantity and PriceSchedule in this run |
| Dates and settlement terms | MapFxCashSettlementToSettlementTerms, MapAdjustableOrAdjustedDateToAdjustableOrAdjustedOrRelativeDate | Parameter-only SettlementTerms in this run |

## Implementation flow

### 1. Input parsing
- Parse inputPath with DOM/StAX to extract FpML trade elements.
- For fx-single-leg fixtures, the XML root is trade/fxSingleLeg.

### 2. Parties and identifiers
- Map FpML party elements to cdm.base.staticdata.party.Party via MapFxSingleLegCounterpartyList.
- Map FpML party identifiers to cdm.base.staticdata.party.PartyIdentifier via Rosetta helper functions.
- Map ancillary parties via MapFxSingleLegAncillaryPartyList.
- Map account-to-party references via MapPayerReceiverToAccountPartyReference.

### 3. Trade identifiers
- Build cdm.event.common.TradeIdentifier from tradeHeader.partyTradeIdentifier.
- Preserve identifiers in traceability reports for auditability.

### 4. Product structure
- Build cdm.product.template.NonTransferableProduct.
- Attach identifiers and taxonomy via MapProductIdentifierList and MapProductTaxonomyList.
- EconomicTerms is parameter-only; do not call EconomicTerms.builder().

### 5. Payout and settlement
- Build cdm.product.template.SettlementPayout.
- Attach price, quantity, settlement terms, and underlier as parameters (parameter-only).
- Follow MapFxCoreDetailsModelToSettlementPayout for structure.

### 6. Price and quantity
- Map FpML price and quantity to parameter-only PriceSchedule and ResolvablePriceQuantity.

### 7. Dates and settlement terms
- Map FpML dates to parameter-only SettlementTerms and AdjustableOrAdjustedOrRelativeDate.

### 8. TradeState composition
- Build cdm.event.common.Trade with parties, identifiers, and product.
- Wrap in cdm.event.common.TradeState via setTrade.
- Return serialized CDM JSON at runtime boundary.

## Approved CDM API contract

- Approved classes: 38  
- Approved builder methods: 114  
- Core builder intents: build-root, set-party, set-identifier, set-product, set-economic-terms, set-payout, set-settlement-payout, set-price-quantity  

See agent-workspace/approved-cdm-api-contract-summary.md for full details. Forbidden categories (validation, utility, processor, metadata implementation) are not used.

## Traceability requirements

- Cite Rosetta function names in traceability reports.
- Preserve FpML element paths in reports when possible.
- Output sidecar JSON files per fixture with mapping diagnostics.
- Keep traceability reports separate from runtime return value.

## Tests and validation gates

- Validate against runtime fixtures only (7 fixtures listed above).
- Compare generated CDM JSON against data_to_learn_from/cdm_parallel/fx-derivatives/*.
- Verify round-trip JSON equality (ignoring meta fields) against expected CDM JSON.
- Report mismatches with diagnostics to reports/ directory.

## Unsupported behavior

- fx-swap, fx-simple-option, fx-digital-option, fx-barrier-option, fx-average-rate-option, fx-strategy fixtures are not supported in this run.
- Non-FX fixtures (term deposits) are explicitly excluded.
- Full ContractDetails, EconomicTerms, ResolvablePriceQuantity, PriceSchedule, and Party reference metafields are parameter-only; they cannot be built directly.

## Future support

- After fx-single-leg passes, extend to fx-swap, fx-simple-option, then richer option families.

## Known constraints

- No FpML Java DTOs (e.g., FpmlFxSingleLeg) exist in CDM Java; use DOM/StAX parsing.
- Some classes like EconomicTerms and SettlementTerms are parameter-only in this run; do not call their builders.
- Do not use cdm.base.staticdata.party.PartyReference; use approved Party or metafield classes.

## Deliverables

- Generated Java source in src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java
- Test fixtures in src/test/java/
- Traceability and validation reports in reports/

End of plan.