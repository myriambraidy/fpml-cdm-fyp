# Cardinality Checker Skill

**Generated from:** FPML 5.12 + CDM 5.35.0 analysis  
**Generation date:** 2026-04-17  
**Status:** ⚠️ Generated, requires user review

---

## Purpose

Determines cardinality (single vs array, required vs optional) for FPML fields and maps to CDM cardinality notation. Structural skill that applies to all fields.

---

## Cardinality Notation

### FPML (XSD)
```
minOccurs="0" maxOccurs="1"        → optional single
minOccurs="1" maxOccurs="1"        → required single
minOccurs="0" maxOccurs="unbounded" → optional array
minOccurs="1" maxOccurs="unbounded" → required array (at least 1)
minOccurs="2" maxOccurs="2"        → fixed array (exactly 2)
```

### CDM (Rosetta)
```
field Type (0..1)    → optional single
field Type (1..1)    → required single
field Type (0..*)    → optional array
field Type (1..*)    → required array
field Type (2..2)    → exactly 2 elements
```

---

## Detection Strategy

### Priority 1: Explicit Schema Metadata (95% confidence)
If parser provides `minOccurs` and `maxOccurs` from XSD schema, use those directly.

### Priority 2: Parser Detection (90% confidence)
If parser detected array structure in actual data (`isArray=true`), treat as array.

### Priority 3: Field Name Pattern (85% confidence)
- Plural names (trades, payments, parties) → array
- Singular names (trade, payment, party) → single
- Exceptions: class, process, business, status (not plurals)

### Priority 4: Default (70% confidence)
No information → assume required single (1..1)

---

## Mapping Rules

| FPML Cardinality | CDM Cardinality | CDM Notation | Confidence |
|------------------|-----------------|--------------|------------|
| 0..1 | 0..1 | `field Type (0..1)` | 95% |
| 1..1 | 1..1 | `field Type (1..1)` | 95% |
| 0..* | 0..* | `field Type (0..*)` | 95% |
| 1..* | 1..* | `field Type (1..*)` | 95% |
| 2..2 | 2..2 | `field Type (2..2)` | 95% |
| Plural name | 0..* | `field Type (0..*)` | 85% |
| Parser array | 0..* | `field Type (0..*)` | 90% |
| No info | 1..1 | `field Type (1..1)` | 70% |

---

## Examples

### Example 1: Schema-Defined Cardinality
```xml
<!-- FPML XSD -->
<xsd:element name="payment" type="Payment" minOccurs="0" maxOccurs="unbounded"/>
```

**Detection:**
- minOccurs=0, maxOccurs=unbounded
- → CDM: `payment Payment (0..*)`
- Confidence: 95%

### Example 2: Plural Field Name
```xml
<payments>
  <payment>...</payment>
  <payment>...</payment>
</payments>
```

**Detection:**
- Field name "payments" is plural
- → CDM: `payment[] Payment (0..*)`
- Confidence: 85%
- TODO: Check schema for actual bounds

### Example 3: Fixed Cardinality
```xml
<!-- CDM requires exactly 2 counterparties -->
<buyer>...</buyer>
<seller>...</seller>
```

**CDM Structure:**
- `counterparty Counterparty (2..2)`
- Confidence: 95%

### Example 4: Singular Field
```xml
<trade>
  <tradeDate>2024-01-15</tradeDate>
</trade>
```

**Detection:**
- Field name "tradeDate" is singular
- Likely 1..1 (required single)
- Confidence: 85%

---

## Known Issues

1. **Plural exceptions:** Some words ending in 's' aren't plurals (status, basis, class). Logic includes exception list but may be incomplete.

2. **Wrapper elements:** FPML often has wrapper elements:
   ```xml
   <payments>
     <payment>...</payment>
   </payments>
   ```
   The wrapper `<payments>` is plural but not the actual array. The child `<payment>` is the array element.

3. **No semantic understanding:** Doesn't understand WHAT the field represents, only HOW MANY. Other skills determine the CDM path; this skill determines if it needs `[]`.

---

## User Review Checklist

- [ ] Test with FPML files containing various cardinality patterns
- [ ] Verify plural detection works for your field names
- [ ] Check if any singular words ending in 's' are missed by exception list
- [ ] Confirm default behavior (1..1 for unknown) is appropriate
- [ ] Add any product-specific cardinality rules
- [ ] Test edge cases: empty arrays, single-element arrays, fixed-count arrays

---

## Integration with Other Skills

This skill provides cardinality metadata. Other skills use it:

```typescript
// Example: party-resolver uses cardinality info
const cardinalityResult = cardinalityChecker(field)

if (cardinalityResult.requiresArrayNotation) {
  return {
    cdmPath: `${basePath}[]`,  // Add array notation
    ...
  }
}
```

**Usage pattern:** Run cardinality-checker FIRST, then pass results to domain-specific skills.
