# Round 2 Summary

Decision: FAILED

## Planner Focus

- fx-single-leg
- fx-swap
- fx-simple-option
- fx-digital-option
- fx-barrier-option
- fx-average-rate-option
- fx-strategy
- fx-ex01-fx-spot

## Critic Findings

1. **CDM Java class mismatch**:
- Plan states `cdm.product.template.SettlementPayout` is used, and `cdm.product.common.settlement.SettlementPayout` is explicitly excluded as “not part of CDM Java”.
- However, the `cdm-java-api-pack.md` clearly lists `cdm.product.common.settlement.SettlementPayout` as **Exists: yes** with package `cdm.product.common.settlement`, builder `SettlementPayout$SettlementPayoutBuilder`, and extensive builder methods (including `setPayerReceiver`, `setPriceQuantity`, `settlementTerms`, `underlier`, `settlementDate`, etc.).
- The plan’s justification (“not found in cdm-java-6.7.0.jar”) contradicts the preflight file (`cdm-java-api-pack.md`) and the validator’s evidence. This is a **critical conflict** and invalidates the plan’s correctness.
- Additionally, Rosetta generates `cdm.product.common.settlement.SettlementPayout` for `SettlementPayout` in CDM. Using `cdm.product.template.SettlementPayout` would be an unsupported usage (the `Payout` model supports `settlementPayout` as a union member, but the actual type is `SettlementPayout` from `cdm.product.common.settlement`).
2. **Runtime fixture evidence is incomplete**:
- The plan references `cdm.observable.asset.ResolvablePriceQuantity` as unavailable and uses `cdm.observable.asset.PriceQuantity` instead. While the plan is correct that `ResolvablePriceQuantity` is not in the CDM Java API, the `cdm-java-api-pack.md` lists `cdm.observable.asset.ResolvablePriceQuantity` as **Exists: yes** in preflight with builder methods.
- In the negative classes list, `cdm.observable.asset.ResolvablePriceQuantity` is correctly flagged, but the plan does not cite preflight `ResolvablePriceQuantity` as `Exists: yes` and does not explain the correct usage path.
- Further, `cdm-java-api-pack.md` confirms `cdm.observable.asset.PriceQuantity` is available, but `cdm.product.common.settlement.SettlementPayout` is **also** available. The plan must use `cdm.product.common.settlement.SettlementPayout`.
3. **Rosetta function calls not supported by preflight**:

## Resolution Notes

- **Critique**: “Plan incorrectly excludes `cdm.product.common.settlement.SettlementPayout` as not in CDM Java, while `cdm-java-api-pack.md` lists it as Exists: yes.”
- **Reality**:
- `cdm-java-api-pack.md` *does* list `cdm.product.common.settlement.SettlementPayout` as **Exists: yes**, but the **negative classes file** (`cdm-java-negative-classes.md`) explicitly says:
- This contradiction was resolved via the tool call `get_cdm_java_class`. Result:
- A second attempt to resolve `cdm.product.template.SettlementPayout` also failed:
- **Conclusion**: Neither class exists in `cdm-java-6.7.0.jar`. The plan’s assertion that `cdm.product.template.SettlementPayout` is acceptable is **invalid**.
- **Critique**: Plan references `cdm.observable.asset.ResolvablePriceQuantity` as unavailable, but `cdm-java-api-pack.md` shows it exists.
- **Reality**:
- Tool call `get_cdm_java_class` confirms:
- Although `cdm-java-api-pack.md`’s preflight section *lists* `ResolvablePriceQuantity`, the compiled JAR (verified via `javap`) confirms it is **absent**.
