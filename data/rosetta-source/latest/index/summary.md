# Rosetta Source Index Summary

## Snapshot

- Repo: `finos/common-domain-model`
- Branch: `master`
- Tree SHA: `372d4400ec925b0d132d4aa62d27a0d56694d644`
- Source prefix: `rosetta-source/src/main/rosetta/`
- File count: 143
- Total bytes: 2785885

## Category Counts

| Category | Count |
|---|---:|
| `base-model` | 26 |
| `dictionary` | 1 |
| `event-model` | 10 |
| `fpml-ingest` | 44 |
| `legal-documentation` | 15 |
| `mapping-synonym` | 4 |
| `margin` | 3 |
| `observable-model` | 15 |
| `product-model` | 24 |
| `regulation` | 1 |

## Kind Counts

| Kind | Count |
|---|---:|
| `description` | 6 |
| `dictionary` | 1 |
| `enum` | 30 |
| `function` | 71 |
| `synonym` | 4 |
| `type` | 31 |

## Product-Family Coverage

| Family | Count |
|---|---:|
| `commodity` | 5 |
| `common` | 45 |
| `credit` | 4 |
| `equity` | 7 |
| `fx` | 6 |
| `legal` | 16 |
| `rates` | 14 |
| `unclassified` | 46 |

## FpML-Relevant Files

- Total likely relevant files: 91
- Direct ingest files: 44
- Supporting shared files: 23
- Product-specific supporting files: 13
- Uncertain relevant files: 11

## Suggested Files To Inspect First

- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-tradestate-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation; shared file likely supports FpML mapping)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-party-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation; shared file likely supports FpML mapping)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-payment-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation; shared file likely supports FpML mapping)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-pricequantity-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation; shared file likely supports FpML mapping)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-datetime-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation; shared file likely supports FpML mapping)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-settlement-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation; shared file likely supports FpML mapping)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-common-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-header-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-legal-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-message-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; content contains ingest XML reference; mentions confirmation)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-other-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation)
- `rosetta-source/src/main/rosetta/ingest-fpml-confirmation-product-bondoption-func.rosetta` (file category is fpml-ingest; filename contains fpml; content contains fpml; mentions confirmation)

## Suggested Next Action

Inspect the direct FpML ingest files first, starting with trade state, party, payment, price/quantity, datetime, and settlement. Then choose one product family for deeper review.

## Next Decision

This index does not parse rules. Decide whether the next step should inspect full files, extract function blocks with line numbers, or build a conservative Rosetta parser.
