# Round 1 Summary

Decision: NEXT_ROUND_REQUIRED

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

- No concise bullets found in artifact.

## Resolution Notes

1. **Missing-class blocker**: The plan references `cdm.base.staticdata.party.PartyReference`, an exact class not found in `cdm-java-6.7.0.jar`, and the semantic recipe explicitly warns against using it.
2. **Missing core Rosetta evidence blocker**: The plan includes no traceability of the `TradeState` root’s *build-root* step, which is mandatory per the `fx-single-leg-tradestate` recipe and the Java shell contract.
3. **Java shell contract blocker**: The plan does not confirm use of `get_cdm_java_class` *before* any exact class lookup—even for approved classes—violating the mandatory preflight step.
- They misinterpret same-simple-name classes in other packages as missing,
- They conflict with deterministic evidence (`approved-cdm-api-contract-summary.md`, `cdm-java-api-summary.md`, `semantic-recipes.md`),
- Or they are non-blocking implementation wording issues.
1. **Core classes section**:
- Remove `PartyReference`.
- Add `ReferenceWithMetaParty` as the party identity class.
2. **Mapping responsibilities**:
