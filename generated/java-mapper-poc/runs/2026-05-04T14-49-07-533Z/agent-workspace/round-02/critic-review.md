# Plan Review

## Blocking Issues

- ✅ **Machine-checked section presence**: The plan contains **both** required machine-checkable sections:
  - `## Implementation scope (machine-checked)` with correct `**In scope (implementation groups):**` bullet listing `fx-single-leg` and matching `currentImplementationGroup` in `00-product-scope.json`.
  - `## Runtime supported fixtures (machine-checked)` with bullets matching **exactly** the run_config `runtimeFixtures` IDs.

- ✅ **CDM internal representation**: The plan explicitly states “Utilize Rosetta-generated CDM Java objects directly as internal representation” and “Use the CDM model object as the internal representation and serialize it at the runtime boundary”, consistent with `cdm-rosetta-preflight.md`’s `maven-compile-gated-jackson-serialization`. No raw JSON construction.

- ✅ **Rosetta function citations**: The plan cites Rosetta functions (`MapFxSingleLegCounterpartyList`, `MapFxSingleLegAncillaryPartyList`, `MapFxSingleLegNonTransferableProduct`, `MapFxSingleLegEconomicTerms`, `MapFxCoreDetailsModelToSettlementPayout`, and helper functions) and aligns with the evidence in `rosetta-generation-context.md`. No broad FX support claims beyond fx-single-leg.

- ✅ **Fixture gates**: Runtime support is limited strictly to the seven `fx-single-leg` fixtures listed in `00-product-scope.json` and run_config. Unsupported FX groups are explicitly listed.

- ✅ **CDM/Rosetta class validity**: All referenced classes (`Trade`, `NonTransferableProduct`, `EconomicTerms`, `Payout`, `SettlementPayout`, `ResolvablePriceQuantity`, `Counterparty`, `AncillaryParty`, `Observable`, `PriceSchedule`, `QuantitySchedule`, `SettlementTerms`) are validated by `cdm-rosetta-preflight.md`.

- ✅ **Product scope alignment**: The plan respects `allowNonFxExpansion: false`—no non-FX fixtures or groups are included.

## Non-blocking Concerns

- **`nonDeliverableSettlement` mapping gap**: The plan states `nonDeliverableSettlement` and `fixing` configuration are “not fully mapped (just the core cash settle component as per base requirement)”. While acceptable for the current scope (NDF cash settlement is covered by `MapFxCashSettlementToSettlementTerms`), the traceability section should clarify that NDF-specific elements like `fixingSource` or `fixingDate` are out-of-scope unless explicitly referenced in the seven runtime fixtures.

- **`sideRates` / `spotRate` handling**: The plan mentions these “may be optionally extended in later phases”, but runtime fixture `fx-ex02-spot-cross-w-side-rates.xml` contains side rates. If the mapping does not cover this fixture’s side-rate logic, the plan should explicitly state that `fx-ex02` testing will be limited to core exchange rate mapping (not side rates), or add side-rate coverage in this round.

- **Party reference traceability**: The plan says “Correlate FpML participant (`partyReference`) with CDM `partyReference`”, but the Rosetta functions for party mapping (`MapPayerReceiverModelToCounterpartyList`, `MapPayerReceiver`, `MapPayerReceiverToAccountPartyReference`) are not reflected in the traceability checklist. Suggest adding a bullet referencing these Rosetta functions.

## Decision

Decision: ACCEPTED