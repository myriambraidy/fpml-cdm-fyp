# Java Agent Context: FX Single-Leg CDM 6 PoC

- Context id: `fx-single-leg-cdm6-poc`
- FpML input version: `4-9`
- CDM target family: `6.x`
- Candidate CDM Maven artifact: `org.finos.cdm:cdm-java:6.15.0`
- Main runtime output: `generated-cdm.json`
- Sidecar reports: mapping, validation, traceability

The paired CDM example is evidence and a test fixture. The generated Java must
parse the FpML XML and map selected fields; it must not embed the full expected
CDM JSON as a static string.
