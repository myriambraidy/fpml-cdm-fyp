# Good Java Guarantee Review

overall_verdict: fail
run_id: 2026-05-10T21-20-34-583Z
approved_class_count: 38
recipe_derived_fixture_count: 5
compile_status: failed
runtime_fixture_status: failed
gap_report_path: generated\java-mapper-poc\runs\2026-05-10T21-20-34-583Z\agent-workspace\final-build-report.md

## Blocking Failures

- generated-java-static-sanity: [
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\FxSingleLegMapperHelper.java",
    "line": 1,
    "code": "missing_required_reports",
    "message": "Generated mapper must write mapping, validation, traceability, and unsupported-scope sidecar reports. Missing: mapping-report.json, validation-report.json, traceability-report.json, unsupported-scope.json."
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\GeneratedFpmlToCdmMapper.java",
    "line": 39,
    "code": "empty_cdm_builder",
    "message": "Generated mapper builds an empty core CDM object."
  }
]

## Non-Blocking Gaps

- none
