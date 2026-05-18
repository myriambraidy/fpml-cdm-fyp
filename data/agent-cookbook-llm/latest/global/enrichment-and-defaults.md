Use these rules to decide when generated or default CDM values require analyst review.

# Promoted Cross-Family Rules
- No cross-family rules are promoted. Do not apply any cross-family enrichment or defaulting beyond what is explicitly evidenced.

# Family-Specific Evidence
- Rule id: fx-derivatives:RULE-003 (Option product type -> CDM taxonomy name)
  - When to apply:
    - The trade is an FX digital option and the FpML source contains trade.fxdigitaloption.productType.
  - Source signals to inspect:
    - trade.fxdigitaloption.productType (FpML productType strings).
  - CDM target structure to propose:
    - trade.product.taxonomyName.value or value.name.value (CDM normalized taxonomy name).
  - How to propose:
    - Normalize the FpML product type label and map it into the CDM taxonomy name value.
  - How to validate:
    - Confirm trade.fxdigitaloption.productType is present in the FpML.
    - Confirm the proposed CDM representation populates trade.product.taxonomyName.value or value.name.value.
    - Confirm the value is copied, normalized, transformed, or enriched according to this rule action.
    - Cite rule id fx-derivatives:RULE-003 in the proposal.
  - Do not apply when:
    - The product is not an FX digital option, or trade.fxdigitaloption.productType is absent.
    - The source value is unknown/ambiguous, or mapping would require enrichment beyond literal FpML content without approved defaults.
  - Exceptions and analyst-review triggers:
    - Any case where normalization or defaulting extends beyond the literal FpML content.
    - Unclear or out-of-scope productType variants where normalization details are not specified.

# Do Not Assume
- Do not create enriched CDM values unless evidence or an approved default supports them.

# Validation Checklist
- Cite the family-specific cookbook rule id for each material mapping in the CDM proposal.
- If the source signal does not match the rule, do not apply the rule.
- Validate every generated key, identifier, default, exchange code, and taxonomy value against source evidence or approved defaults.
- Mark unsupported enrichment for analyst review.