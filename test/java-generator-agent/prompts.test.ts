import { describe, expect, test } from 'bun:test'
import {
  CRITIC_SYSTEM_PROMPT,
  CRITIQUE_REVIEWER_SYSTEM_PROMPT,
  IMPLEMENTER_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  REPAIR_SYSTEM_PROMPT,
} from '../../src/java-generator-agent/prompts'

describe('java generator prompts', () => {
  test('planner separates runtime support from observed and future support', () => {
    expect(PLANNER_SYSTEM_PROMPT).toContain('Runtime supported in this run')
    expect(PLANNER_SYSTEM_PROMPT).toContain('Observed in evidence')
    expect(PLANNER_SYSTEM_PROMPT).toContain('Future support')
    expect(PLANNER_SYSTEM_PROMPT).toContain('## Runtime supported fixtures (machine-checked)')
  })

  test('planner treats prompt seed as discovery context only', () => {
    expect(PLANNER_SYSTEM_PROMPT).toContain('prompt seed is discovery context only')
    expect(PLANNER_SYSTEM_PROMPT).toContain('approved CDM API contract summary')
    expect(PLANNER_SYSTEM_PROMPT).not.toContain('present in the CDM Java prompt seed list')
  })

  test('planner requires shell and Rosetta evidence contracts', () => {
    expect(PLANNER_SYSTEM_PROMPT).toContain('## Java shell contract (machine-checked)')
    expect(PLANNER_SYSTEM_PROMPT).toContain('GeneratedFpmlToCdmMapper')
    expect(PLANNER_SYSTEM_PROMPT).toContain('## Rosetta evidence coverage (machine-checked)')
    expect(PLANNER_SYSTEM_PROMPT).toContain('get_rosetta_mapping_area')
    expect(PLANNER_SYSTEM_PROMPT).toContain('Rosetta source defines mapping intent only')
  })

  test('critic blocks shell and Rosetta authority violations', () => {
    expect(CRITIC_SYSTEM_PROMPT).toContain('contradicts java-shell-contract.md')
    expect(CRITIC_SYSTEM_PROMPT).toContain('core mapping responsibilities lack Rosetta function evidence')
    expect(CRITIC_SYSTEM_PROMPT).toContain('Rosetta function names as proof of Java class')
    expect(CRITIC_SYSTEM_PROMPT).toContain('candidate classes as approved implementation API')
  })

  test('critique reviewer cannot accept machine contract failures', () => {
    expect(CRITIQUE_REVIEWER_SYSTEM_PROMPT).toContain('Do not accept a plan when deterministic validation failed')
    expect(CRITIQUE_REVIEWER_SYSTEM_PROMPT).toContain('Do not accept with conditions for Java shell contract issues')
    expect(CRITIQUE_REVIEWER_SYSTEM_PROMPT).toContain('Final-round acceptance can waive wording issues only')
  })

  test('implementer prompt rejects known malformed source patterns', () => {
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Write only ASCII Java source')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Never use smart quotes')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Never HTML-escape source code')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Do not import com.fpml.cdm.fx.model.*')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('final-implementation-contract.md')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('approved-cdm-api-contract-summary.md')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('semantic-recipes.md')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Never write Java import aliases')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('Use provider-native tool calls only')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('write_generated_java_file')
    expect(IMPLEMENTER_SYSTEM_PROMPT).not.toContain('Use write_generated_java for root generated Java classes')
    expect(IMPLEMENTER_SYSTEM_PROMPT).toContain('GeneratedFpmlToCdmMapper.java exists')
  })

  test('repair prompt prioritizes earliest failed gate and runtime contract', () => {
    expect(REPAIR_SYSTEM_PROMPT).toContain('Prioritize the earliest failed gate')
    expect(REPAIR_SYSTEM_PROMPT).toContain('Preserve the runtime CLI contract')
    expect(REPAIR_SYSTEM_PROMPT).toContain('Do not introduce runtime LLM calls')
    expect(REPAIR_SYSTEM_PROMPT).toContain('approved-cdm-api-contract-summary.md')
    expect(REPAIR_SYSTEM_PROMPT).toContain('semantic-recipes.md')
    expect(REPAIR_SYSTEM_PROMPT).toContain('contract gap')
    expect(REPAIR_SYSTEM_PROMPT).toContain('Never write Java import aliases')
    expect(REPAIR_SYSTEM_PROMPT).toContain('focused repair packet')
    expect(REPAIR_SYSTEM_PROMPT).toContain('create or fix src/main/java/com/fpml/cdm/fx/mapper/generated/GeneratedFpmlToCdmMapper.java')
    expect(REPAIR_SYSTEM_PROMPT).toContain('Never print pseudo tool calls')
    expect(REPAIR_SYSTEM_PROMPT).toContain('Use write_generated_java_file for generated Java classes')
  })
})
