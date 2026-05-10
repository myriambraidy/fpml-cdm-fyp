# Planner Plan – FX Derivatives Java Mapper (Round 01)

**Generated:** 2026-05-10T14:07:29.958Z  
**Run id:** 2026-05-10T14-07-28-452Z  
**Product family:** fx-derivatives  
**Implementation group:** fx-single-leg  
**Default starting group:** fx-single-leg (good-first-target)

---

## Implementation scope (machine-checked)

**Product family:** fx-derivatives  
**In scope (implementation groups):**
- fx-single-leg  
**Explicitly out of scope (implementation groups):**
- fx-swap, fx-simple-option, fx-barrier-option, fx-digital-option, fx-average-rate-option, fx-strategy, non-fx  

---

## Runtime supported fixtures (machine-checked)

- fx-ex01-fx-spot  
- fx-ex02-spot-cross-w-side-rates  
- fx-ex03-fx-fwd  
- fx-ex04-fx-fwd-w-settlement  
- fx-ex05-fx-fwd-w-ssi  
- fx-ex06-fx-fwd-w-splits  
- fx-ex07-non-deliverable-forward  

---

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

---

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

---

## Core mapping responsibilities (FX single-leg)

| Mapping area | Rosetta function(s) | Java responsibility (CDM builders) |
|--------------|---------------------|------------------------------------|
| Parties & Identifiers | MapFxSingleLegCounterpartyList, MapFxSingleLegAncillaryPartyList, MapPayerReceiverToAccountPartyReference | Build Party, PartyIdentifier, AncillaryParty, Counterparty objects with identifiers and roles. |
| Product root & identifiers | MapFxSingleLegNonTransferableProduct, MapProductIdentifierList, MapProductTaxonomyList | Build NonTransferableProduct, attach identifiers and taxonomy. |
| Economic terms | MapFxSingleLegEconomicTerms | Attach Payout (see below). EconomicTerms is parameter-only in this run. |
| Settlement payout | MapFxCoreDetailsModelToSettlementPayout | Build SettlementPayout with payerReceiver, priceQuantity, settlementTerms, underlier. |
| Price & quantity | MapFxSingleLegPriceQuantityList, MapFxCoreDetailsModelPriceWithAddress, MapFxCoreDetailsModelQuantityWithAddress | Build ResolvablePriceQuantity with PriceSchedule and NonNegativeQuantitySchedule (parameter-only). |
| Observable & underlier | MapCurrencyToObservableCashWithAddress | Build Observable from currency value (parameter-only). |
| Settlement terms | MapFxCashSettlementToSettlementTerms | Build SettlementTerms with CashSettlementTerms, settlementDate, and settlementCurrency (parameter-only). |

**Notes on parameter-only concepts**

Per approved-cdm-api-contract-summary.md, these classes are used only as parameters (no direct builder calls):
- cdm.product.template.EconomicTerms  
- cdm.product.common.settlement.ResolvablePriceQuantity  
- cdm.observable.asset.PriceSchedule  
- cdm.event.common.ContractDetails  

Use the approved builder intents and methods only (e.g., setEconomicTerms, setPriceQuantity, setContractDetails).

---

## Execution order & traceability (per semantic-recipes.md)

1. **Parties & Identifiers**  
   - Use MapFxSingleLegCounterpartyList → build Counterparty, Party, and identifiers.  
   - Use MapFxSingleLegAncillaryPartyList → build AncillaryParty.  
   - Use MapPayerReceiverToAccountPartyReference → build ReferenceWithMetaParty for accounts.  

2. **Trade identifiers**  
   - Build TradeIdentifier with AssignedIdentifier from source trade headers.  

3. **NonTransferableProduct**  
   - Use MapFxSingleLegNonTransferableProduct.  
   - Attach identifiers and taxonomy (MapProductIdentifierList, MapProductTaxonomyList).  

4. **EconomicTerms**  
   - Use MapFxSingleLegEconomicTerms.  
   - Attach Payout (see next step).  

5. **Payout & SettlementPayout**  
   - Use MapFxCoreDetailsModelToSettlementPayout.  
   - Attach payerReceiver, priceQuantity, settlementTerms, and underlier.  

6. **Price, quantity, observable**  
   - Use MapFxCoreDetailsModelPriceWithAddress and MapFxCoreDetailsModelQuantityWithAddress (parameter-only).  

7. **Settlement terms & observable**  
   - Use MapFxCashSettlementToSettlementTerms and MapCurrencyToObservableCashWithAddress (parameter-only).  

8. **Wrap in TradeState**  
   - Use MapTradeState → TradeState.builder().setTrade(trade).build().

---

## Forbidden / unsupported for this run

- **CDM Java model classes not in approved contract** (e.g., cdm.base.math.PriceSchedule, cdm.base.staticdata.asset.Asset, cdm.product.template.CashSettlementTerms)  
- **Manual JSON construction with ObjectNode or ArrayNode**  
- **Inventing FpML model classes like FpmlFxSingleLeg**; use DOM/StAX parsing or generated internal DTOs instead  
- **Class names with same simple-name from other packages**; always use fully qualified class names from approved-cdm-api-contract-summary.md  
- **Unapproved builder methods or enum constants**; use only those listed in approved builder method index

---

## Validation gates & sidecar reports (per java-shell-contract.md)

For each runtime fixture, the mapper must produce:
- **main CDM JSON**: outputs/fx-exNN-*.json (serialized cdm.event.common.TradeState)  
- **mapping-report.json**: maps source nodes to Rosetta function names  
- **validation-report.json**: schema and rule validation results  
- **traceability-report.json**: Rosetta function → Java method mapping  
- **unsupported-scope.json**: known unsupported paths for this implementation group  

All reports must be written to reports/fx-exNN-*/.

---

## Next steps

1. Implementer generates Java code following the approved contract and recipes.  
2. Implementer runs gates against runtime fixtures.  
3. If failures occur, repair attempts are capped at 2.  
4. At round limit or success, generate final implementation contract and build summary.