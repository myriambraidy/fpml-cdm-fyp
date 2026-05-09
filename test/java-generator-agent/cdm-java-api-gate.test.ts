import { describe, expect, test } from 'bun:test'
import { validateCdmImports } from '../../src/java-generator-agent/cdm-java-api-gate'

describe('cdm java api gate', () => {
  test('rejects imports outside the narrow API pack', () => {
    const findings = validateCdmImports({
      sourceText: 'import cdm.product.common.settlement.SettlementPayout;',
      promptSeedClasses: new Set(['cdm.event.common.Trade']),
      exactMissingClasses: new Set(['cdm.product.common.settlement.SettlementPayout']),
    })

    expect(findings.some(finding => finding.includes('SettlementPayout'))).toBe(true)
  })

  test('rejects invented FpML model references', () => {
    const findings = validateCdmImports({
      sourceText: 'final FpmlFxSingleLeg fx = parser.parse();',
      promptSeedClasses: new Set(),
      exactMissingClasses: new Set(),
    })

    expect(findings.some(finding => finding.includes('FpML model class'))).toBe(true)
  })

  test('allows imports listed in the pack', () => {
    const findings = validateCdmImports({
      sourceText: 'import cdm.event.common.Trade;',
      promptSeedClasses: new Set(['cdm.event.common.Trade']),
      exactMissingClasses: new Set(),
    })

    expect(findings).toEqual([])
  })

  test('allows approved contract imports even when they are outside the old prompt seed', () => {
    const findings = validateCdmImports({
      sourceText: 'import cdm.product.template.SettlementPayout;',
      promptSeedClasses: new Set(['cdm.event.common.Trade']),
      approvedClasses: new Set(['cdm.product.template.SettlementPayout']),
      forbiddenClasses: new Set(),
      exactMissingClasses: new Set(),
    })

    expect(findings).toEqual([])
  })

  test('rejects forbidden contract imports before other allow rules', () => {
    const findings = validateCdmImports({
      sourceText: 'import cdm.product.common.settlement.SettlementPayout;',
      promptSeedClasses: new Set(),
      approvedClasses: new Set(['cdm.product.common.settlement.SettlementPayout']),
      forbiddenClasses: new Set(['cdm.product.common.settlement.SettlementPayout']),
      exactMissingClasses: new Set(),
    })

    expect(findings.some(finding => finding.includes('forbidden'))).toBe(true)
    expect(findings.some(finding => finding.includes('SettlementPayout'))).toBe(true)
  })

  test('rejects unapproved fully qualified CDM references without imports', () => {
    const findings = validateCdmImports({
      sourceText: 'final var payout = cdm.product.template.SettlementPayout.builder().build();',
      approvedClasses: new Set(['cdm.event.common.Trade']),
      forbiddenClasses: new Set(),
      indexedClasses: new Set(['cdm.event.common.Trade', 'cdm.product.template.SettlementPayout']),
      exactMissingClasses: new Set(),
    })

    expect(findings.some(finding => finding.includes('fully-qualified-reference'))).toBe(true)
    expect(findings.some(finding => finding.includes('SettlementPayout'))).toBe(true)
  })

  test('ignores CDM-looking tokens in comments, strings, javadocs, and package-only segments', () => {
    const findings = validateCdmImports({
      sourceText: [
        '/* cdm.product.template.SettlementPayout */',
        '// cdm.product.template.SettlementPayout',
        '/** @param x cdm.product.template.SettlementPayout */',
        'final String text = "cdm.product.template.SettlementPayout";',
        'final String pkg = "cdm.product.template";',
      ].join('\n'),
      approvedClasses: new Set(),
      forbiddenClasses: new Set(),
      indexedClasses: new Set(['cdm.product.template.SettlementPayout']),
      exactMissingClasses: new Set(),
    })

    expect(findings).toEqual([])
  })
})
