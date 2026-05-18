# Global FPML -> CDM Enrichment And Defaults

Use these rules to decide when generated or default CDM values require analyst review.

## Promoted Cross-Family Rules

No rules have enough cross-family evidence for promotion yet.

## Family-Specific Evidence

### Option product type -> CDM taxonomy name

- Rule id: `fx-derivatives:RULE-003`
- Family: `fx-derivatives`
- Kind: `mapping`
- Operational status: `ready`
- Confidence: `high`
- Source signals: `trade.fxdigitaloption.productType (FpML productType strings)`
- Target CDM paths: `trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name)`
- Action: FpML product type labels (e.g., 'Euro Binary') are normalized and mapped into a CDM taxonomy name value (e.g., 'EuroBinary').
- Rationale: CDM uses standardized taxonomy strings for product classification; mapping normalizes source labels to the expected CDM taxonomy representations.
- Evidence: 5 examples from 25/25 semantic pairs
- Caveats: `Normalization details (exact string transformations) are inferred from examples but not exhaustively specified across all possible productType variants.`
- Human review when: `The CDM output may require enrichment, normalization, or defaulting beyond literal FpML content.`
- Validate: `Confirm the FPML source contains: trade.fxdigitaloption.productType (FpML productType strings).`, `Confirm the proposed CDM representation populates: trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name).`, `Confirm the value is copied, normalized, transformed, or enriched according to the rule action.`


## Do Not Assume

- Do not create enriched CDM values unless evidence or an approved default supports them.

## Validation Checklist

- Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.
- If the source signal does not match the rule, do not apply the rule.
- Validate every generated key, identifier, default, exchange code, and taxonomy value against source evidence or approved defaults.
- Mark unsupported enrichment for analyst review.
