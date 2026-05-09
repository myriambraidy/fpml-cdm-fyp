import { describe, expect, test } from 'bun:test'
import {
  cdmJavaApiIndexPath,
  cdmJavaApiSummaryMarkdownPath,
  cdmJavaFxSingleLegPackMarkdownPath,
  cdmJavaMissingClassesPath,
  lookupCdmJavaClassDetails,
  parseJavapMethods,
  readCdmJavaApiIndex,
  readCdmJavaClassDetails,
  readCdmJavaMissingClassObservations,
} from '../../src/java-generator-agent/cdm-java-api-pack'
import { CDM_JAVA_VERSION } from '../../src/java-generator-agent/java-contract'

describe('cdm java api pack', () => {
  test('uses the repo-pinned CDM Java version and generated pack paths', () => {
    expect(cdmJavaApiIndexPath()).toContain(`data\\cdm-java-api\\${CDM_JAVA_VERSION}`)
    expect(cdmJavaFxSingleLegPackMarkdownPath()).toContain('fx-single-leg-pack.md')
    expect(cdmJavaApiSummaryMarkdownPath()).toContain('api-summary.md')
    expect(cdmJavaMissingClassesPath()).toContain('missing-classes.json')
  })

  test('reads the generated API pack and exact missing-class observations', async () => {
    const index = await readCdmJavaApiIndex()
    const observations = await readCdmJavaMissingClassObservations()

    expect(index.manifest.version).toBe(CDM_JAVA_VERSION)
    expect(index.classes.some(entry => entry.className === 'cdm.event.common.Trade')).toBe(true)
    expect(index.promptSeedClasses).toContain('cdm.event.common.Trade')
    expect(observations.some(item => item.className === 'cdm.product.common.settlement.SettlementPayout')).toBe(true)
    expect(observations.some(item => item.className === 'FpmlFxSingleLeg')).toBe(true)
  })

  test('reads verified class details with builder methods', async () => {
    const details = await readCdmJavaClassDetails('cdm.event.common.Trade')

    expect(details?.className).toBe('cdm.event.common.Trade')
    expect(details?.builderClassName).toBe('cdm.event.common.Trade$TradeBuilder')
    expect(details?.builderMethods.some(method => method.name === 'setTradeIdentifier')).toBe(true)
  })

  test('parses javap method signatures', () => {
    const methods = parseJavapMethods(`
public interface Example {
  public abstract example.Builder setTradeDate(com.rosetta.model.metafields.FieldWithMetaDate);
  public static example.Builder builder();
}
`)

    expect(methods.map(method => method.name)).toEqual(['setTradeDate', 'builder'])
    expect(methods[0]?.parameters).toEqual(['com.rosetta.model.metafields.FieldWithMetaDate'])
  })

  test('inspects indexed-only classes on demand', async () => {
    const result = await lookupCdmJavaClassDetails('cdm.product.template.SettlementPayout')

    expect(result.status).toBe('found')
    if (result.status === 'found') {
      expect(result.details.className).toBe('cdm.product.template.SettlementPayout')
      expect(result.details.builderClassName).toContain('SettlementPayoutBuilder')
    }
  })

  test('missing exact FQCN reports same-simple-name candidates', async () => {
    const result = await lookupCdmJavaClassDetails('cdm.observable.asset.ResolvablePriceQuantity')

    expect(result.status).toBe('missing')
    if (result.status === 'missing') {
      expect(result.sameSimpleNameCandidates).toContain(
        'cdm.product.common.settlement.ResolvablePriceQuantity'
      )
    }
  })
})
