# Fetch Rosetta Source

Downloads a local snapshot of official FINOS CDM Rosetta source files.

This uses the GitHub tree API to discover files and raw GitHub URLs to download
contents. It does not scrape GitHub HTML pages.

Default source:

```text
repo: finos/common-domain-model
branch: master
prefix: rosetta-source/src/main/rosetta/
```

Default output:

```text
data/rosetta-source/latest/
```

The script downloads:

- `.rosetta` files
- `RosettaDictionary.txt`

It also writes:

- `manifest.json`
- `diagnostics.json`

## Usage

Preview matching files without downloading:

```bash
bun scripts/data-web-scraping/fetch-rosetta-source.ts --dry-run
```

Download the current snapshot:

```bash
bun scripts/data-web-scraping/fetch-rosetta-source.ts
```

Limit downloads while testing:

```bash
bun scripts/data-web-scraping/fetch-rosetta-source.ts --limit 20
```

Write a timestamped run and also update `latest`:

```bash
bun scripts/data-web-scraping/fetch-rosetta-source.ts --mode append
```

Filter to paths containing a substring:

```bash
bun scripts/data-web-scraping/fetch-rosetta-source.ts --include ingest-fpml-confirmation
```

## Scope

This script only fetches and stores source files. It does not parse Rosetta,
extract rules, integrate the cookbook, generate Java, or validate CDM output.

After fetching, build a local catalog of the snapshot with:

```bash
bun run index:rosetta-source
```

The index is written under:

```text
data/rosetta-source/latest/index/
```
