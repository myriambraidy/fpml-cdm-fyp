# Round 3 Summary

Decision: ACCEPTED

## Planner Focus

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- non-fx

## Critic Findings

- Rosetta blocks (`MapFxSingleLegNonTransferableProduct`, `MapFxSwapNonTransferableProduct`, etc.) assign specific `productQualifier` values based on the FpML root.
- Evidence-packet.md shows CDM `product.taxonomy.productQualifier` as ISDA strings (e.g., `ForeignExchange_Spot_Forward`), but the planner does not reference:
- Which Rosetta function performs this mapping
- The mapping logic
- How to disambiguate spot vs forward (valueDate logic)
- Cite `MapFxSingleLegNonTransferableProduct`, `MapFxSwapNonTransferableProduct`, etc., and extract their qualifier logic.
- Provide a table or explicit rules per FpML root → CDM qualifier, including spot/forward differentiation (e.g., based on `valueDate` distance).
- NDFs require a different CDM settlement type (Cash with `settlementCurrency` and `cashSettlementTerms`) rather than standard settlement instructions.
- Evidence-packet.md shows:
- No mention of how the `nonDeliverableForward` block is handled.

## Resolution Notes

- `ForeignExchange_Spot_Forward` (spot/forward)
- `ForeignExchange_Swap`
- `ForeignExchange_VanillaOption`
- Spot vs forward is determined by the `valueDate` distance in Rosetta (spot: `T+2` or less; forward: longer)
- The planner must specify:
- Which Rosetta function performs the mapping (`MapFxSingleLegNonTransferableProduct`)
- How it distinguishes spot vs forward
- How the qualifier is assigned
- Settlement type: `Cash`
- Required fields: `settlementCurrency`, `cashSettlementTerms`, `fixing`
