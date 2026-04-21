# Build Curated CDM Parallel Dataset

This script creates a new folder:

- `data_to_learn_from/cdm_parallel`

It mirrors the `fpml` folder structure and copies in the best conservative CDM JSON counterpart for each FpML XML file when one exists.

Run:

```bash
bun scripts/build-cdm-parallel.ts
```

Outputs:

- mirrored JSON files under `data_to_learn_from/cdm_parallel`
- `manifest.json` with matched and missing entries
- `README.md` explaining the curation rules
