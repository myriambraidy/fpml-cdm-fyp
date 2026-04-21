# CDM Parallel Dataset

This folder is a curated CDM view built to mirror `data_to_learn_from/fpml`.

Rules used:

- Exact filename matches first
- Conservative normalization for naming drift such as `com-ex1` -> `com-ex01`
- A few explicit aliases for known numbering/name shifts in the CDM ingest output
- Raw CDM files are left untouched in `data_to_learn_from/cdm`

Important:

- A JSON file exists here only when a conservative CDM counterpart was found
- Missing counterparts are recorded in `manifest.json`
- Destination filenames follow the FpML filenames so agents can compare sibling files directly
