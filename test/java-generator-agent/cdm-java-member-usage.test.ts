import { describe, expect, test } from 'bun:test'
import type { CdmJavaClassDetails } from '../../src/java-generator-agent/cdm-java-api-pack'
import { collectImportedClasses, validateCdmJavaMembers } from '../../src/java-generator-agent/cdm-java-member-usage'

describe('cdm java member usage', () => {
  test('rejects unknown enum constants', async () => {
    const sourceText = [
      'import cdm.base.staticdata.identifier.TradeIdentifierTypeEnum;',
      'class Example { Object x = TradeIdentifierTypeEnum.TRADE_ID; }',
    ].join('\n')
    const findings = await validateCdmJavaMembers({
      sourceText,
      displayPath: 'Example.java',
      importedClasses: collectImportedClasses(sourceText),
      indexedBySimpleName: new Map([
        ['TradeIdentifierTypeEnum', ['cdm.base.staticdata.identifier.TradeIdentifierTypeEnum']],
      ]),
      detailCache: new Map([
        ['cdm.base.staticdata.identifier.TradeIdentifierTypeEnum', enumDetails(
          'cdm.base.staticdata.identifier.TradeIdentifierTypeEnum',
          ['UNIQUE_TRANSACTION_IDENTIFIER', 'UNIQUE_SWAP_IDENTIFIER']
        )],
      ]),
    })

    expect(findings.some(finding => finding.code === 'unknown_enum_constant')).toBe(true)
  })

  test('allows known enum constants', async () => {
    const sourceText = [
      'import cdm.base.staticdata.identifier.TradeIdentifierTypeEnum;',
      'class Example { Object x = TradeIdentifierTypeEnum.UNIQUE_TRANSACTION_IDENTIFIER; }',
    ].join('\n')
    const findings = await validateCdmJavaMembers({
      sourceText,
      displayPath: 'Example.java',
      importedClasses: collectImportedClasses(sourceText),
      indexedBySimpleName: new Map([
        ['TradeIdentifierTypeEnum', ['cdm.base.staticdata.identifier.TradeIdentifierTypeEnum']],
      ]),
      detailCache: new Map([
        ['cdm.base.staticdata.identifier.TradeIdentifierTypeEnum', enumDetails(
          'cdm.base.staticdata.identifier.TradeIdentifierTypeEnum',
          ['UNIQUE_TRANSACTION_IDENTIFIER', 'UNIQUE_SWAP_IDENTIFIER']
        )],
      ]),
    })

    expect(findings).toEqual([])
  })

  test('rejects unknown fully-qualified enum constants', async () => {
    const sourceText = [
      'class Example {',
      '  Object x = cdm.base.staticdata.identifier.TradeIdentifierTypeEnum.TRADE_ID;',
      '}',
    ].join('\n')
    const findings = await validateCdmJavaMembers({
      sourceText,
      displayPath: 'Example.java',
      importedClasses: collectImportedClasses(sourceText),
      indexedBySimpleName: new Map(),
      detailCache: new Map([
        ['cdm.base.staticdata.identifier.TradeIdentifierTypeEnum', enumDetails(
          'cdm.base.staticdata.identifier.TradeIdentifierTypeEnum',
          ['UNIQUE_TRANSACTION_IDENTIFIER', 'UNIQUE_SWAP_IDENTIFIER']
        )],
      ]),
    })

    expect(findings.some(finding => finding.code === 'unknown_enum_constant')).toBe(true)
  })

  test('rejects fully-qualified generic nested Builder guesses', async () => {
    const sourceText = [
      'class Example {',
      '  cdm.event.common.TradeIdentifier.Builder b;',
      '}',
    ].join('\n')
    const findings = await validateCdmJavaMembers({
      sourceText,
      displayPath: 'Example.java',
      importedClasses: collectImportedClasses(sourceText),
      indexedBySimpleName: new Map(),
      detailCache: new Map([
        ['cdm.event.common.TradeIdentifier', builderDetails(
          'cdm.event.common.TradeIdentifier',
          'cdm.event.common.TradeIdentifier$TradeIdentifierBuilder'
        )],
      ]),
    })

    expect(findings.some(finding => finding.code === 'unknown_nested_builder_type')).toBe(true)
  })

  test('rejects generic nested Builder guesses', async () => {
    const sourceText = [
      'import cdm.event.common.TradeIdentifier;',
      'class Example { TradeIdentifier.Builder b = TradeIdentifier.builder(); }',
    ].join('\n')
    const findings = await validateCdmJavaMembers({
      sourceText,
      displayPath: 'Example.java',
      importedClasses: collectImportedClasses(sourceText),
      indexedBySimpleName: new Map([
        ['TradeIdentifier', ['cdm.event.common.TradeIdentifier']],
      ]),
      detailCache: new Map([
        ['cdm.event.common.TradeIdentifier', builderDetails(
          'cdm.event.common.TradeIdentifier',
          'cdm.event.common.TradeIdentifier$TradeIdentifierBuilder'
        )],
      ]),
    })

    expect(findings.some(finding => finding.code === 'unknown_nested_builder_type')).toBe(true)
  })
})

function enumDetails(className: string, enumValues: string[]): CdmJavaClassDetails {
  const simpleName = className.split('.').at(-1) ?? className
  return {
    className,
    exists: true,
    packageName: className.split('.').slice(0, -1).join('.'),
    simpleName,
    methods: [],
    builderMethods: [],
    enumValues,
  }
}

function builderDetails(className: string, builderClassName: string): CdmJavaClassDetails {
  const simpleName = className.split('.').at(-1) ?? className
  return {
    className,
    exists: true,
    packageName: className.split('.').slice(0, -1).join('.'),
    simpleName,
    methods: [],
    builderClassName,
    builderMethods: [],
  }
}
