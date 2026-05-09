# Final Build Report

Status: blocked
Run id: 2026-05-08T18-24-06-498Z

## Failure Classification

- Earliest failed gate: generated-java-static-sanity
- Category: static-java
- Hidden downstream gates: java-reference-check, cdm-java-api-usage, maven-dependency-preflight, maven-compile, maven-test-compile, maven-test, maven-package, jar-runtime:fx-ex01-fx-spot, jar-runtime:fx-ex02-spot-cross-w-side-rates, jar-runtime:fx-ex03-fx-fwd, jar-runtime:fx-ex04-fx-fwd-w-settlement, jar-runtime:fx-ex05-fx-fwd-w-ssi, jar-runtime:fx-ex06-fx-fwd-w-splits, jar-runtime:fx-ex07-non-deliverable-forward, output-validation, rosetta-validation:fx-ex01-fx-spot, rosetta-validation:fx-ex02-spot-cross-w-side-rates, rosetta-validation:fx-ex03-fx-fwd, rosetta-validation:fx-ex04-fx-fwd-w-settlement, rosetta-validation:fx-ex05-fx-fwd-w-ssi, rosetta-validation:fx-ex06-fx-fwd-w-splits, rosetta-validation:fx-ex07-non-deliverable-forward


## Failed Gates

- generated-java-static-sanity: [
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\GeneratedFpmlToCdmMapper.java",
    "line": 96,
    "code": "escaped_quotes_in_java",
    "message": "Java source contains escaped quote text instead of normal string literals."
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\ReportWriter.java",
    "line": 6,
    "code": "jackson_tree_cdm_construction",
    "message": "Generated mapper must not use Jackson tree nodes as the internal CDM model."
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\ReportWriter.java",
    "line": 1,
    "code": "missing_cdm_rosetta_import",
    "message": "Generated mapper must import preflight-approved CDM/Rosetta model classes."
  }
]
- cdm-java-api-usage: [
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\FxSingleLegMapper.java",
    "line": 20,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta import is outside approved-cdm-api-contract.json: cdm.product.common.settlement.SettlementDate"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\FxSingleLegMapper.java",
    "line": 31,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta import is outside approved-cdm-api-contract.json: com.rosetta.model.metafields.FieldWithMetaDate"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\FxSingleLegMapper.java",
    "line": 20,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: cdm.product.common.settlement.SettlementDate"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\FxSingleLegMapper.java",
    "line": 31,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: com.rosetta.model.metafields.FieldWithMetaDate"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\PriceQuantityMapper.java",
    "line": 2,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta import is outside approved-cdm-api-contract.json: cdm.base.math.Rounding"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\PriceQuantityMapper.java",
    "line": 4,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta import is outside approved-cdm-api-contract.json: cdm.base.math.UnitType"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\PriceQuantityMapper.java",
    "line": 3,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: cdm.base.math.Rounding"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\PriceQuantityMapper.java",
    "line": 4,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: cdm.base.math.UnitType"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\PriceQuantityMapper.java",
    "line": 69,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: cdm.base.math.NonNegativeQuantity"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\PriceQuantityMapper.java",
    "line": 83,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: cdm.base.math.NonNegativeQuantity"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\SettlementMapper.java",
    "line": 4,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta import is outside approved-cdm-api-contract.json: cdm.base.datetime.BusinessDayConventionEnum"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\SettlementMapper.java",
    "line": 6,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta import is outside approved-cdm-api-contract.json: cdm.product.common.settlement.SettlementDate"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\SettlementMapper.java",
    "line": 9,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta import is outside approved-cdm-api-contract.json: com.rosetta.model.metafields.FieldWithMetaDate"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\SettlementMapper.java",
    "line": 4,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: cdm.base.datetime.BusinessDayConventionEnum"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\SettlementMapper.java",
    "line": 6,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: cdm.product.common.settlement.SettlementDate"
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\SettlementMapper.java",
    "line": 9,
    "code": "cdm_import_not_in_approved_contract",
    "message": "CDM/Rosetta fully-qualified-reference is outside approved-cdm-api-contract.json: com.rosetta.model.metafields.FieldWithMetaDate"
  }
]
