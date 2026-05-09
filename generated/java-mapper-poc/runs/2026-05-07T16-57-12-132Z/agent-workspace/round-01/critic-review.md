## Plan Review

The plan fails because the **Runtime supported fixtures (machine-checked)** section does not use the required **fixture IDs**.

Per the `run_config`, the fixture IDs are:
- `fx-ex01-fx-spot`
- `fx-ex02-spot-cross-w-side-rates`
- `fx-ex03-fx-fwd`
- `fx-ex04-fx-fwd-w-settlement`
- `fx-ex05-fx-fwd-w-ssi`
- `fx-ex06-fx-fwd-w-splits`
- `fx-ex07-non-deliverable-forward`

But the plan instead lists:
```markdown
- fx-ex01-fx-spot: fx-ex01-fx-spot.xml
...
```
This is not the required format. The format must be:
```markdown
- fx-ex01-fx-spot
- fx-ex02-spot-cross-w-side-rates
...
```
i.e., **only the IDs**, no filename suffixes, no colons.

Additionally, the product-group claim “FX single-leg” is covered by `productGroups[].group = "fx-single-leg"` and `currentImplementationGroup = "fx-single-leg"` in `00-product-scope.json`, so it is not an issue.

No other blocking issues (e.g., no raw JSON CDM model, no `FpmlFxSingleLeg` Java class, no unsupported CDM classes or Rosetta functions cited).

Decision: NEXT_ROUND_REQUIRED