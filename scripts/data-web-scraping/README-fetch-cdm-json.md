# Fetch CDM JSON Examples

This script downloads JSON files from the official FINOS CDM GitHub repository instead of scraping the Rosetta UI.

Default behavior:

- repo: `finos/common-domain-model`
- branch: `master`
- prefixes: `examples/`, `ingest/`, `rosetta-source/`
- output: `data_to_learn_from/cdm`

Examples:

```bash
bun scripts/fetch-cdm-json.ts --dry-run
bun scripts/fetch-cdm-json.ts
bun scripts/fetch-cdm-json.ts --prefix ingest/,examples/
bun scripts/fetch-cdm-json.ts --limit 20
```
