import { describe, expect, test } from 'bun:test'
import { findRosettaJavaUsageFindingsInSource } from '../../src/java-generator-agent/rosetta-java-usage-gate'

describe('rosetta java usage gate', () => {
  test('rejects Jackson tree nodes as the main CDM model', () => {
    const findings = findRosettaJavaUsageFindingsInSource({
      sourceText: 'class Mapper { ObjectNode node; ArrayNode items; }',
      displayPath: 'Mapper.java',
      isEntryClass: false,
    })

    expect(findings.some(finding => finding.code === 'jackson_tree_as_cdm_model')).toBe(true)
  })

  test('rejects runtime validator calls', () => {
    const findings = findRosettaJavaUsageFindingsInSource({
      sourceText: 'class Mapper { RosettaTypeValidator validator; }',
      displayPath: 'Mapper.java',
      isEntryClass: false,
    })

    expect(findings.some(finding => finding.code === 'runtime_validator_call')).toBe(true)
  })

  test('requires TradeState root in entry class', () => {
    const findings = findRosettaJavaUsageFindingsInSource({
      sourceText: [
        'import java.nio.file.Path;',
        'public class GeneratedFpmlToCdmMapper {',
        '  public String mapFile(Path inputPath, Path reportsDir) { return "{}"; }',
        '}',
      ].join('\n'),
      displayPath: 'GeneratedFpmlToCdmMapper.java',
      isEntryClass: true,
    })

    expect(findings.some(finding => finding.code === 'missing_trade_state_root')).toBe(true)
  })

  test('allows minimal TradeState boundary shape', () => {
    const findings = findRosettaJavaUsageFindingsInSource({
      sourceText: [
        'import cdm.event.common.Trade;',
        'import cdm.event.common.TradeState;',
        'import java.nio.file.Path;',
        'public class GeneratedFpmlToCdmMapper {',
        '  public String mapFile(Path inputPath, Path reportsDir) {',
        '    Trade trade = Trade.builder().build();',
        '    TradeState tradeState = TradeState.builder().setTrade(trade).build();',
        '    return objectMapper.writeValueAsString(tradeState);',
        '  }',
        '}',
      ].join('\n'),
      displayPath: 'GeneratedFpmlToCdmMapper.java',
      isEntryClass: true,
    })

    expect(findings.filter(finding => finding.severity === 'error')).toEqual([])
  })

  test('allows entry class that delegates TradeState construction', () => {
    const findings = findRosettaJavaUsageFindingsInSource({
      sourceText: [
        'import cdm.event.common.TradeState;',
        'import java.nio.file.Path;',
        'public class GeneratedFpmlToCdmMapper {',
        '  public String mapFile(Path inputPath, Path reportsDir) {',
        '    TradeState tradeState = buildTradeState(inputPath);',
        '    return objectMapper.writeValueAsString(tradeState);',
        '  }',
        '  private TradeState buildTradeState(Path inputPath) { return helper.build(inputPath); }',
        '}',
      ].join('\n'),
      displayPath: 'GeneratedFpmlToCdmMapper.java',
      isEntryClass: true,
    })

    expect(findings.some(finding => finding.code === 'missing_trade_state_root')).toBe(false)
  })
})
